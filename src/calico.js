(function(root) {
    'use strict';

    var registeredMixins = {};

    function Calico(context) {
        var mixins = Array.prototype.slice.call(arguments, 1),
            method,
            mixin;

        if (context instanceof Function) {
            context = context.prototype || context;
        }

        for (var property in mixins) {
            mixin = mixins[property];
            
            // retrieve mixin from registered cache
            if (mixin.constructor === String) {
                mixin = registeredMixins[mixin] || {};
            }
            
            // invoke functional mixin with context
            if (mixin instanceof Function) {
                mixin.call(context);
                continue;
            }
            
            // extend context with mixin properties
            for (method in mixin) {
                context[method] = mixin[method];
            }
        }

        return context;
    }

    Calico.registerMixin = function(name, mixin) {
        var mixins = {};
        
        if (name instanceof Object) {
            mixins = name;
        } else {
            mixins[name] = mixin;
        }

        for (var property in mixins) {
            registeredMixins[property] = mixins[property];
        }
    };

    if (Backbone === void 0) {
        root.Calico = Calico;
        return root;
    } 

    function calicoMixinWrapper() {
        if (!arguments.length) { 
            return this;
        }
        var mixins = Array.prototype.slice.call(arguments);
        return Calico.apply({}, [this].concat(mixins));
    }

    Backbone.Calico = function() {
        return Calico.apply(this, arguments);
    };

    _.each(['Collection', 'Model', 'Router', 'View'], function(property) {
        var BackboneProperty = Backbone[property],
            _originalExtendMethod = BackboneProperty.extend;

        _.extend(BackboneProperty, {

            "mixin": calicoMixinWrapper,

            "extend": function(properties) {
                
                // define mixin properties to the prototype instance
                // remove mixins extension argument
                if (properties instanceof Object && properties.mixins !== void 0) {
                    calicoMixinWrapper.apply(this, properties.mixins);
                    properties.mixins = null;
                    delete properties.mixins;
                }
                
                return _originalExtendMethod.apply(this, arguments);
            }

        });
    });

})(this);
