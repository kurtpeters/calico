calico
======
Backbone mixins for models, views, controllers, and routers! Oh, my!

###Bower
```
bower install calico
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
