/*global describe:false, it:false, expect:false, beforeEach:false */

var calico = require('../src/calico').Calico,
    expect = require('expect.js');

describe('Calico', function() {
    'use strict';

    var arrayBlock, properties1, properties2, fusion;

    beforeEach(function() {
        arrayBlock = [];
        properties1 = {};
        properties2 = {};
    });

    it('should fuse function properties', function() {

        properties1.fn = function() {
            arrayBlock.push('one');
        };

        properties2.fn = function() {
            arrayBlock.push('two');
        };

        fusion = calico({}, properties1, properties2);
        fusion.fn();

        expect(arrayBlock.length).to.equal(2);
        expect(arrayBlock[0]).to.equal('one');
        expect(arrayBlock[1]).to.equal('two');
    });

    it('should fuse array properties', function() {

        properties1.block = ['one'];

        properties2.block = ['two'];

        fusion = calico({}, properties1, properties2);
        expect(fusion.block.length).to.equal(2);
        expect(fusion.block[0]).to.equal('one');
        expect(fusion.block[1]).to.equal('two');

        fusion = calico(properties1, properties2);
        expect(fusion.block.length).to.equal(2);
        expect(fusion.block[1]).to.equal('one');
        expect(fusion.block[0]).to.equal('two');
    });

    it('should fuse object properties', function() {

        properties1.obj = {
            "block": ['one'],
            "jbo": {
                "fn": function() {
                    arrayBlock.push('three');
                },
                "block": ['one'],
                "test": 'test1',
                "num": 1
            },
            "fn": function() {
                arrayBlock.push('one');
            }
        };

        properties2.obj = {
            "block": ['two'],
            "jbo": {
                "fn": function() {
                    arrayBlock.push('four');
                },
                "block": ['two'],
                "test": 'test2',
                "num": 2
            },
            "fn": function() {
                arrayBlock.push('two');
            }
        };

        fusion = calico({}, properties1, properties2);

        expect(fusion.obj.block.length).to.equal(2);
        expect(fusion.obj.block[0]).to.equal('one');
        expect(fusion.obj.block[1]).to.equal('two');

        expect(arrayBlock.length).to.equal(0);
        fusion.obj.fn();
        expect(arrayBlock.length).to.equal(2);
        expect(arrayBlock[0]).to.equal('one');
        expect(arrayBlock[1]).to.equal('two');

        fusion.obj.jbo.fn();
        expect(arrayBlock.length).to.equal(4);
        expect(arrayBlock[2]).to.equal('three');
        expect(arrayBlock[3]).to.equal('four');

        expect(fusion.obj.jbo.block.length).to.equal(2);
        expect(fusion.obj.jbo.block[0]).to.equal('one');
        expect(fusion.obj.jbo.block[1]).to.equal('two');

        expect(fusion.obj.jbo.test).to.equal('test2');
    });

    it('should take mixin over current context property', function() {
        properties1 = {
            "testString": 'test1',
            "testNumber": 1
        };

        properties2 = {
            "testString": 'test2',
            "testNumber": 2
        };

        fusion = calico({}, properties1, properties2);
        expect(fusion.testString).to.equal('test2');
        expect(fusion.testNumber).to.equal(2);

        fusion = calico(properties1, properties2);
        expect(fusion.testNumber).to.equal(1);
        expect(fusion.testString).to.equal('test1');
    });

    it('should assign to prototype chain for contextual funcitons', function() {
        var fn = function() {};
        
        calico(fn, {
            "testMethod": 'this is a test'
        });
        
        calico(fn, function() {
            this.testMethod2 = 'this is another test';
        });

        expect(fn.prototype.testMethod).to.equal('this is a test');
        expect(fn.prototype.testMethod2).to.equal('this is another test');
    });

    afterEach(function() {
        arrayBlock = null;
        properties1 = null;
        properties2 = null;
        fusion = null;
    });
});

describe('registerMixin', function() {
    'use strict';

    beforeEach(function() {
        calico.registerMixin({
            "test1": function() {
                this.result1 = 'result1 value';
            },
            "test2": {
                "result2": 'result2 value'
            }
        });
    });

    it('should apply registered mixins with string argument', function() {
        var result = calico({}, 'test1');
        expect(result.result1).to.equal('result1 value');
    });

    it('should cache registered mixins', function() {
        calico.registerMixin('util', function() {
            this.result = 'the test worked!';
        });
        var test = calico({}, 'util');
        expect(test.result).to.equal('the test worked!');
    });

    afterEach(function() {
        calico.deregisterMixin();
    });
});

describe('deregisterMixin', function() {
    'use strict';

    var test;

    beforeEach(function() {
        calico.registerMixin({
            "one": {"result1": 'result 1 value'},
            "two": {"result2": 'result 2 value'}
        });
    });

    it('should deregister specified mixin', function() {

        test = calico({}, 'one', 'two');
        expect(test.result1).to.equal('result 1 value');
        expect(test.result2).to.equal('result 2 value');

        calico.deregisterMixin('one');

        test = calico({}, 'one', 'two');
        expect(test.result1).to.be(void 0);
        expect(test.result2).to.equal('result 2 value');
    });

    it('should deregister all mixins if no argument is passed', function() {

        test = calico({}, 'one', 'two');
        expect(test.result1).to.equal('result 1 value');
        expect(test.result2).to.equal('result 2 value');

        calico.deregisterMixin();

        test = calico({}, 'one', 'two');
        expect(test.result1).to.be(void 0);
        expect(test.result2).to.be(void 0);
    });

    afterEach(function() {
        test = null;
        calico.deregisterMixin();
    });
});
