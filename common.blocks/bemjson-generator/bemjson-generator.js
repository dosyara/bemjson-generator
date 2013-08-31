;(function(exports) {

    /**
     * Extends destination object with source object
     * @param dest
     * @param source
     */
    function extend(dest, source) {
        for (var i in source)
            if (source.hasOwnProperty(i))
                dest[i] = source[i];
    }

    function BEMGEN() {
        var _ctx = {},
            bemgen = function(content) {
                _ctx.content = arguments.length > 1 ? Array.prototype.slice.call(arguments) : content;

                return _ctx;
            },
            getPropSetter = function (propName) {
                return function(value) {
                    _ctx[propName] = value;

                    return bemgen;
                }
            },
            getPropExtender = function (propName) {
                return function(params) {
                    _ctx[propName] || (_ctx[propName] = {});

                    extend(_ctx[propName], params);

                    return bemgen;
                }
            };

        bemgen.ctx = function(params) {
            extend(_ctx, params);

            return bemgen;
        };

        // setters
        ['block', 'elem', 'tag', 'cls', 'js'].forEach(function(name) {
            bemgen[name] = getPropSetter(name);
        });

        // extenders
        ['mods', 'elemMods', 'mix', 'attrs'].forEach(function(name) {
            bemgen[name] = getPropExtender(name);
        });

        // mix
        bemgen.mix = function(params) {
            if (!Array.isArray(_ctx.mix))
                _ctx.mix = _ctx.mix ? [_ctx.mix] : [];

            if (params)
                _ctx.mix = _ctx.mix.concat(params);

            return bemgen;
        };

        // content
        bemgen.content = function() {
            return bemgen.apply(this, arguments);
        };

        return bemgen;
    }

    ['ctx', 'block', 'elem', 'tag'].forEach(function(name) {
       exports[name] = function() {
           return BEMGEN()[name].apply(this, arguments);
       }
    });

})(typeof exports === 'undefined' ? this['bemjson-generator'] = {} : exports);
