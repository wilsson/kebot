"use strict";
/**
 * @private
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Validate = (function () {
    function Validate() {
    }
    Validate.prototype.string = function (entity) {
        if (entity && typeof entity !== 'string') {
            throw new Error(entity + " needs to be a string");
        }
    };
    Validate.prototype.array = function (entity) {
        if (!Array.isArray(entity)) {
            throw new Error(entity + " needs to be a array");
        }
    };
    Validate.prototype.execute = function (type, alias) {
        var that = this;
        that[type].apply(that, [].slice.call(arguments, 1));
    };
    return Validate;
}());
exports.Validate = Validate;
