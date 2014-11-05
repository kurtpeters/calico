calico
======
Backbone mixins for models, views, controllers, and routers! Oh, my!

###Bower installation
```
bower install calico
```
===

###Why include calico?

Using Backbone for production environments has great advantages over vanilla JavaScript. It provides structural standards for routing, service handling, and removes our truth from the DOM. Many experiences with the library (along with native JavaScript) can be destructive. Extending allows new instances to adopt parent functionality, but comes at the cost of overriding one property after another. Since JS is a prototypal language, redefining parent properties during inheritance will eliminate reusable functionality, and since JavaScript lacks proper class inheritance, referencing super methods becomes nothing but a painful process.

Thats where calico.js comes in. This lightweight library provides constructive functionality mixin after mixin. calico introduces fusion properties. What is a fusion property? When a mixin is added during extension, It acts as a parent instance, but instead of overriding inherited properties, it unleashes a hybrid.

___*When I create mixins to adopt specific patterns …*___
```javascript
var createTypeMixin = {

    “initialize”: function() {
        this.type = ‘fusion’;
    }

};
```

___*… and override the parental properties.*___
```javascript
var MixinView = Backbone.View.extend({
    
    “mixins”: [createTypeMixin],

    “initialize”: function() {
        console.log(this.type + ‘ instance!’);
    },

    “type”: basic’

});
```

___*calico will combine the identical methods into a single experience.*___
```javascript
new MixinView(); // logs: “fusion instance!”
```

===

###Creating mixins

Mixins can be defined one of two ways. Either `object` literals extend their properties, or `functions` are invoked with a desired context.

___Object mixins___
```javascript
var mixin = {

    “method”: function() {
        console.log(this);
    }

};
```

___Functional mixins___
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

> Note: multiple mixins can be applied as a comma separated list during the following processes.

___Mixins property___
```javascript
var MixinModel = Backbone.Model.extend({

    “mixins”: [mixin]

});
```

___Mixin instance method___
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

```
Backbone.Calico.registerMixin(‘computedProperties’, {

    "toJSONC": function() {        
        var attributes = {};

        _(this.computed).each(function(property) {
            if (this[property] instanceof Function) {
                attributes[property] = this[property]();
            }
        }, this);

        return _.extend(this.toJSON, attributes);
    }

});
```
```
var MixinModel = Backbone.Model.extend({

    “mixins”: [‘computedProperties’],

    “attributes”: {
        “firstName”: 'John',
        “lastName”: 'Wayne'
    },

    “computed”: [‘fullName’],

    “fullName”: function() {
        return this.get(‘firstName’) + ‘ ‘ + this.get(‘lastName’);
    }

});
```
```
var model = new MixinModel();
model.toJSONC(); // {firstName: 'John', lastName: 'Wayne', fullName: 'John Wayne'}
```



