(function(root) {
    'use strict';

    var registeredMixins = {};

    function fuseProperties(property, mixin, reversed) {

        if (!property || !mixin) {
            return property ? property : mixin;
        }

        function instanceOf(instance, method) {
            return (method ? property[method] : property) instanceof instance &&
                   (method ? mixin[method] : mixin) instanceof instance;
        }

        // fuse function properties
        if (instanceOf(Function)) {
            return function() {
                mixin.apply(this, arguments);
                return property.apply(this, arguments);
            };
        }

        // fuse array properties
        if (instanceOf(Function, 'sort')) {
            return reversed ? mixin.concat(property) : property.concat(mixin);
        }

        // fuse object properties
        if (instanceOf(Object)) {
            for (var instance in mixin) {
                property[instance] = fuseProperties(property[instance], mixin[instance], reversed);
            }
            return property;
        }

        return reversed ? property : mixin;
    }

    function Calico(context) {
        var mixins = Array.prototype.slice.call(arguments, 1),
            pseudoContext = {},
            reversed = false,
            pseudoProperty,
            property,
            method,
            mixin;

        if (context instanceof Function) {
            context = context.prototype || context;
        }

        // reverse mixins to keep assignment order
        if (mixins.length - 1) {
            mixins.reverse();
            reversed = true;
        }

        for (property in mixins) {
            mixin = mixins[property];

            // retrieve mixin from registered cache
            if (mixin.constructor === String) {
                mixin = registeredMixins[mixin] || {};
            }

            // invoke functional mixin with pseudo instance and fuse with context
            if (mixin instanceof Function) {
                mixin.call(pseudoContext);
                for (pseudoProperty in pseudoContext) {
                    context[pseudoProperty] = fuseProperties(context[pseudoProperty], pseudoContext[pseudoProperty], reversed);
                }
                pseudoContext = {};
                continue;
            }

            // extend context with mixin properties
            for (method in mixin) {
                context[method] = fuseProperties(context[method], mixin[method], reversed);
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
            registeredMixins[property] = mixins[property];
        }
    };

    Calico.deregisterMixin = function(name) {
        if (name === void 0) {
            registeredMixins = {};
            return;
        }
        registeredMixins[name] = null;
        delete registeredMixins[name];
    };

    if (root.Backbone === void 0) {

        if (root.exports !== void 0) {
            root.exports.Calico = Calico;
            return;
        }

        if (root.require !== void 0) {
            define('calico', function() { return Calico; });
            return;
        }

        root.Calico = Calico;
        return;
    }

    function calicoMixinWrapper() {
        if (!arguments.length) {
            return this;
        }

        var mixins = Array.prototype.slice.call(arguments);
        Calico.apply({}, [this].concat(mixins));

        if (this.prototype !== void 0) {
            this.prototype.__mixins__ = _.union(this.prototype.__mixins__, mixins);
        } else {
            this.__mixins__ = mixins;
        }
    }

    root.Backbone.Calico = Calico;

    _.each(['Collection', 'Model', 'Router', 'View'], function(property) {
        var BackboneProperty = root.Backbone[property],
            originalExtendMethod = BackboneProperty.extend;

        _.extend(BackboneProperty, {

            "mixin": calicoMixinWrapper,

            "extend": function(properties) {
                var mixins;

                if (properties instanceof Object && properties.mixins !== void 0) {
                    mixins = _.union(this.prototype.__mixins__, properties.mixins.slice());
                    delete properties.mixins;
                    calicoMixinWrapper.apply(properties, mixins);
                }

                return originalExtendMethod.apply(this, arguments);
            }

        });
    });

})(this);
