calico
======
Backbone mixins for models, views, controllers, and routers! Oh, my!
```
bower install calico
```
===

###Why use calico?

Using Backbone for production environments has great advantages over vanilla JavaScript. It provides structural standards for routing, service handling, and removes our truth from the DOM. Most experiences I’ve encountered with Backbone (and native JavaScript) have been destructive, overriding one property at a time. Extending the library allows new instances to adopt parent functionality, but it comes at a cost. Since JS is a prototypal language, redefining parent properties during inheritance will remove intended functionality, and since JavaScript lacks proper class inheritance, referencing super methods is nothing but a pain.

Thats where calico.js comes in. This lightweight library provides constructive functionality mixin after mixin. Calico introduces infused properties. What are infused properties? When a mixin is added to an instance, It’ll act as the parent instance, but instead of overriding inherited properties, it unleashes a hybrid.

___*When I create mixins to adopt specific patterns …*___
```javascipt
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

___*Calico will combine the identical methods into a single experience.*___
```javascript
new MixinView(); // logs: “fusion instance!”
```

###Usage

Object mixins
```
var standardMixin = {
    newMethod: function() {
        return 'it worked!'
    }
};

var StandardView = Backbone.View.extend({
    
    mixins: [standardMixin]
    
    initialize: function() {
        this.newMethod(); // returns "it worked!"
    }
});
```

Functional mixins
```
var standardMixin = function() {
    this.newMethod = function() {
        return 'it worked!'
    }
};

var StandardView = Backbone.View.extend({
    
    mixins: [standardMixin]
    
    initialize: function() {
        this.newMethod(); // returns "it worked!"
    }
});
```

Register mixins
```
Backbone.Calico.registerMixin('newMixin', {
    getTemplate: function() {
        return this.template;
    }
});

var StandardView = Backbone.View.extend({
    
    mixins: [standardMixin, 'newMixin']
    
    template: '<h1>{{calico}}</h1>'
    
    initialize: function() {
        this.newMethod(); // returns "it worked!"
        this.getTemplate(); // returns "<h1>{{calico}}</h1>"
    }
});
```

Apply mixins after extending Backbone instance 
```
var standardMixin = function() {
    this.newMethod = function() {
        return 'it worked!'
    }
};

Backbone.Calico.registerMixin('newMixin', {
    getTemplate: function() {
        return this.template;
    }
});

var StandardView = Backbone.View.extend({

    template: '<h1>{{calico}}</h1>'
    
    initialize: function() {
        this.newMethod(); // returns "it worked!"
        this.getTemplate(); // returns "<h1>{{calico}}</h1>"
    }
});

StandardView.mixin(standardMixin, 'newMixin');
```
