calico
======
Backbone mixins for models, views, controllers, and routers! Oh, my!

###Bower installation
```
bower install calico
```
===

###Why include calico?

Using Backbone for production environments has great advantages over vanilla JavaScript. It provides structural standards for routing, service handling, and removes our truth from the DOM. Many experiences with the library (along with native JavaScript) can be destructive. Extending allows new instances to adopt parent functionality, but comes at the cost of overriding one parent property after another. Since JS is a prototypal language, redefining parent properties during inheritance will eliminate reusable functionality, and since JavaScript lacks proper class inheritance, referencing super methods becomes nothing but a painful process.

Thats where calico.js comes in. This lightweight library provides constructive functionality mixin after mixin. calico introduces fused properties. What is a fusion property? When a mixin is added during extension, It acts as a parent instance, but instead of these inherited properties being overridden, a hybrid is unleashed!

__*When I create mixins to adopt specific patterns …*__
```javascript
var createTypeMixin = {

    “initialize”: function() {
        this.type = ‘fusion’;
    }

};
```

__*… and override the parental properties.*__
```javascript
var MixinView = Backbone.View.extend({
    
    “mixins”: [createTypeMixin],

    “initialize”: function() {
        console.log(this.type + ‘ instance!’);
    },

    “type”: ‘basic’

});
```

__*calico will combine the identical methods into a single experience.*__
```javascript
new MixinView(); // logs: “fusion instance!”
```

===

###Creating mixins

Mixins can be defined one of two ways. Either `object` literals extend their properties, or `functions` are invoked with a desired context.

__Object mixins__
```javascript
var mixin = {

    “method”: function() {
        console.log(this);
    }

};
```

__Functional mixins__
```javascript
var mixin = function() {

    this.method = function() {
        console.log(this);
    };

};
```

===

###Using mixins

Mixins can also be applied one of two ways. Either a `mixins` property is assigned during extension, or a `mixin` instance method is available after extending.

> **Note:** Multiple mixins can be applied with a comma separated list during this processes. Any mixin added to a list will invoke in the order it’s applied.

__Mixins property__
```javascript
var MixinModel = Backbone.Model.extend({

    “mixins”: [mixin]

});
```

__Mixin instance method__
```javascript
var MixinModel = Backbone.Model.extend({

    “initialize”: function() {
        ...
    }

});

MixinModel.mixin(mixin);
```

===

###Register Mixins

If working in AMD or dealing with any module definition, using and reusing mixins is like butta. When a mixin becomes registered, any Backbone instance has reference to it’s source. To apply a mixin from the calico registry to a new Backbone instance, wrap it’s declaration in string literal.

>**Note:** An object argument can be used to register multiple mixins.

__Creating a registered mixin__
```javascript
Backbone.Calico.registerMixin(‘mixin:name’, {

    “contents”: function() {
        return “I’m registered!”;
    }

});
```

__Using registered mixins__
```javascript
var MixinModel = Backbone.Model.extend({

    “mixins”: [‘mixin:name’],

    “initialize”: function() {
        console.log(this.contents()); // logs: “I’m registered!”
    }

});
```

===

###Example

```
Backbone.Calico.registerMixin(‘computedProperties’, function() {

    var computed = {};

    this.initialize = function() {
        var attributes = this.toJSON();

        for (var attribute in attributes) {
            if (attributes[attribute].toLowerCase() === '__computed__') {
                computed[attribute] = attributes[attribute];
                delete this.attributes[attribute];
            }
        }
    };

    this.toJSON = function(options) {
        var toJSON = _.clone(this.attributes),
            value;

        if (options.calculated) {
            _(computed).each(function(property) {
                value = this[property];
                toJSON[property] = value instanceof Function ? value() : value;
            }, this);
        }

        return toJSON;
    };

});
```
```
var MixinModel = Backbone.Model.extend({

    “mixins”: [‘computedProperties’],

    “attributes”: {
        "firstName": 'John',
        "lastName": 'Wayne',
        "fullName": '__computed__'
    },

    “fullName”: function() {
        return this.get(‘firstName’) + ‘ ‘ + this.get(‘lastName’);
    }

});
```
```
var model = new MixinModel();

model.toJSON({
    “computed”: true
}); // returns: {firstName: 'John', lastName: 'Wayne', fullName: 'John Wayne'}
```



