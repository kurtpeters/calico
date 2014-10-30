(function(root) {
    'use strict';

    var registeredMixins = {};

    function fuseProperties(property, mixin) {

        if (!property || !mixin) {
            return property ? property : mixin;
        }

        function insatceOf(instance, method) {
            return (method ? property[method] : property) instanceof instance &&
                   (method ? mixin[method] : mixin) instanceof instance;
        }

        if (insatceOf(Function)) {
            return function() {
                mixin.apply(this, arguments);
                return property.apply(this, arguments);
            };
        }

        if (insatceOf(Function, 'sort')) {
            return property.concat(mixin);
        }

        if (insatceOf(Object)) {
            for (var instance in mixin) {
                property[instance] = fuseProperties(property[instance], mixin[instance]);
            }
            return property;
        }

        return mixin;
    }

    function Calico(context) {
        var mixins = Array.prototype.slice.call(arguments, 1),
            pseudoContext = {},
            pseudoProperty,
            property,
            method,
            mixin;

        if (context instanceof Function) {
            context = context.prototype || context;
        }

        for (property in mixins) {
            mixin = mixins[property];

            // retrieve mixin from registered cache
            if (mixin.constructor === String) {
                mixin = registeredMixins[mixin] || {};
            }

            // invoke functional mixin with context
            if (mixin instanceof Function) {
                mixin.call(pseudoContext);
                for (pseudoProperty in pseudoContext) {
                    context[pseudoProperty] = fuseProperties(context[pseudoProperty], pseudoContext[pseudoProperty]);
                }
                pseudoContext = {};
                continue;
            }

            // extend context with mixin properties
            for (method in mixin) {
                context[method] = fuseProperties(context[method], mixin[method], context);
            }
        }

        return context;
    }

    Calico.registerMixin = function(name, mixin) {
        var mixins = {},
            property;

        if (name instanceof Object) {
            mixins = name;
        } else {
            mixins[name] = mixin;
        }

        for (property in mixins) {
            registeredMixins[property] = fuseProperties(registeredMixins[property], mixins[property]);
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

    Backbone.Calico = Calico;

    _.each(['Collection', 'Model', 'Router', 'View'], function(property) {
        var BackboneProperty = Backbone[property],
            _originalExtendMethod = BackboneProperty.extend;

        _.extend(BackboneProperty, {

            "mixin": calicoMixinWrapper,

            "extend": function(properties) {

                if (properties instanceof Object && properties.mixins !== void 0) {
                    var mixins = properties.mixins.reverse();
                    properties.mixins = null;
                    delete properties.mixins;
                    calicoMixinWrapper.apply(properties, mixins);
                }

                return _originalExtendMethod.apply(this, arguments);
            }

        });
    });

})(this);
