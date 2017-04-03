calico
======
Backbone mixins for models, views, controllers, and routers! Oh, my!

### Bower installation

```bash
bower install calico
```

---

### Why include calico?

Using Backbone for production environments has great advantages over vanilla JavaScript. It provides structural standards for routing, service handling, and removes our truth from the DOM. Many experiences with the library (along with native JavaScript) can be destructive. Extending allows new instances to adopt parent functionality, but comes at the cost of overriding one parent property after another. Since JS is a prototypal language, redefining parent properties during inheritance will eliminate reusable functionality, and since JavaScript lacks proper class inheritance, referencing super methods becomes nothing but a painful process.

Thats where calico.js comes in. This lightweight library provides constructive functionality mixin after mixin. calico introduces fusion properties. What is a fused property? When a mixin is added during extension, it acts as a parent, but instead of being overwritten by child properties, they become channeled into a hybrid instance.

__For example, when I create mixins to adopt specific patterns …__
```javascript
var createTypeMixin = {

    "initialize": function() {
        console.log(this.type);
        this.type = 'fusion';
    },
    
    "type": 'mixin'

};
```

__… and override the parental properties.__
```javascript
var MixinView = Backbone.View.extend({
    
    "mixins": [createTypeMixin],

    "initialize": function() {
        console.log(this.type);
    },

    "type": 'child'

});
```

__calico will combine identical methods into a single experience.__
```javascript
new MixinView(); // logs "child" followed by "fusion"
```

> **Note:** Backbone’s native extension functionality is intact. Instead of a parents prototype chain becoming fused, a mixin record is kept and applied to the new instance.

---

### Creating mixins

Mixins can be defined one of two ways. Either `object` literals extend their properties, or `functions` are invoked with a desired context.

__Object mixin__
```javascript
var mixin = {

    "method": function() {
        console.log(this);
    }

};
```

__Functional mixin__
```javascript
var mixin = function() {

    this.method = function() {
        console.log(this);
    };

};
```

---

### Using mixins

Mixins can also be applied one of two ways. Either a `mixins` property is assigned during extension, or a `mixin` instance method is available after extending.

> **Note:** Multiple mixins can be applied with a comma separated list during this processes. Any mixin added to a list will invoke in the order it’s applied.

__Mixins property__
```javascript
var MixinModel = Backbone.Model.extend({

    "mixins": [mixin]

});
```

__Mixin instance method__
```javascript
var MixinModel = Backbone.Model.extend({

    "initialize": function() {
        ...
    }

});

MixinModel.mixin(mixin);
```

---

### The Mixin Registry

If working in AMD or dealing with any module pattern, using and reusing mixins is like butta. When a mixin becomes registered, any Backbone instance has reference to it’s source. To apply a mixin from the calico registry to a new instance, wrap it’s declaration in a string literal.

>**Note:** An object argument can be used to register multiple mixins.

__Creating a registered mixin__
```javascript
var unregisteredMixin = {

    "logContents": function() {
        console.log(this.get('message'));
    }

};

Backbone.Calico.registerMixin('registered:mixin', {

    "defaults": {
        "message": 'I’m registered!'
    }

});
```

__Using registered mixins__
```javascript
var MixinModel = Backbone.Model.extend({

    "mixins": [unregisteredMixin, 'registered:mixin'],

    "initialize": function() {
        this.logContents(); // logs: "I’m registered!"
    }

});
```

---

### Putting it all together

#### Computed Properties

__Mixin__
```javascript
Backbone.Calico.registerMixin('model:computed', function() {

    var computed = [];

    this.initialize = function() {
        var attributes = this.toJSON();

        for (var attribute in attributes) {
            if (attributes[attribute].toLowerCase() === '__computed__') {
                computed.push(attribute);
                delete this.attributes[attribute];
            }
        }
    };

    this.toJSON = function(options) {
        var attributes = _.clone(this.attributes),
            value;

        if (options && options.calculated) {
            _(computed).each(function(property) {
                value = this[property];
                attributes[property] = value instanceof Function ? value.call(this) : value;
            }, this);
        }

        return attributes;
    };

});
```

__Model__
```javascript
var MixinModel = Backbone.Model.extend({

    "mixins": ['model:computed'],

    "defaults": {
        "firstName": 'John',
        "lastName": 'Wayne',
        "fullName": '__computed__'
    },

    "fullName": function() {
        return this.get('firstName') + ' ' + this.get('lastName');
    }

});
```

__Result__
```javascript
var model = new MixinModel();

console.log(model.attributes); // {firstName: 'John', lastName: 'Wayne'}

model.toJSON({ // returns: {firstName: 'John', lastName: 'Wayne', fullName: 'John Wayne'}
    "computed": true
});

model.toJSON(); // returns: {firstName: 'John', lastName: 'Wayne'}
```

#### Two-way Data Binding

__Mixin__

```javascript
Backbone.Calico.registerMixin('view:mvvm', function() {

    function syncTemplate(model) {
        _(model.changed).each(function(value, property) {
            this.$('[data-mvvm-view="' + property + '"]').html(value);
        }, this);
    }

    function syncModel(e) {
        var model = this.$(e.currentTarget),
            property = model.data('mvvm-model'),
            value = _.escape(model.val());

        this.model.set(property, value);
    }

    this.events = {
        'change [data-mvvm-model]': syncModel
    };

    this.initialize = function() {
        this.listenToOnce(this, 'render:mvvm', function() {
            this.listenTo(this.model, 'change', syncTemplate);
        });
    };

    this.render = function(options) {
        var attributes = this.model.toJSON(options);
        this.$el.html(this.template(attributes));
        return this.trigger('render:mvvm');
    };

});
```

__View__
```javascript
var MixinView = Backbone.View.extend({

    "mixins": ['view:mvvm'],

    "template": _.template(
        '<input type="text" data-mvvm-model="content" value="<%=content %>" /> ' +
        '<span data-mvvm-view="content"><%=content %></span>'
    ),

    "initialize": function() {
        this.model = new Backbone.Model({
            "content": "Chuck Norris vs. ThunderDOM"
        });
    }

});
```

__Result__
```javascript
var view = new MixinView();
$(document.body).append(view.render().el);
```
