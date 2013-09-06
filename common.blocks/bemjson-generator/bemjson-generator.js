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
            },
            getNestedPropSetter = function (propName) {
                return function(name, value) {
                    _ctx[propName] || (_ctx[propName] = {});

                    _ctx[propName][name] = value;

                    return bemgen;
                }
            };

        // ctx
        bemgen.ctx = function(name, value) {
            if (typeof name == 'object')
                extend(_ctx, name);
            else
                _ctx[name] = value;

            return bemgen;
        };

        // setters
        ['block', 'elem', 'tag', 'cls', 'js'].forEach(function(name) {
            bemgen[name] = getPropSetter(name);
        });

        // extenders
        ['mods', 'elemMods', 'attrs'].forEach(function(name) {
            bemgen[name] = getPropExtender(name);
        });

        // shortForms
        var shortForms = { mod: 'mods', elemMod: 'elemMods', attr: 'attrs' };
        Object.keys(shortForms).forEach(function(name) {
            bemgen[name] = getNestedPropSetter(shortForms[name]);
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
        bemgen.content = function(content) {
            _ctx.content = arguments.length > 1 ? Array.prototype.slice.call(arguments) : content;

            return bemgen;
        };

        // html
        bemgen.html = function(node, block, elem) {
            node = node || _ctx;
            var nodeType = typeof node,
                buf = [];

            if (nodeType == 'string' || nodeType == 'number') {
                buf.push(node);
            } else {
                if (Array.isArray(node)) {
                    buf.push(node.map(function(item) {
                        return bemgen.html(item, block, elem)
                    }).join(''));
                } else {
                    var SHORT_TAGS = {
                            area: 1, base: 1, br : 1, col : 1, command : 1, embed : 1, hr : 1, img : 1,
                            input : 1, keygen : 1, link : 1, meta : 1, param : 1, source : 1, wbr : 1
                        },
                        ELEM_DELIMETER = '__',
                        MOD_DELIMETER = '_',
                        buildClass = function(block, elem, modName, modVal) {
                            if (typeof modVal == 'undefined' && typeof modName != 'undefined') {
                                modVal = modName;
                                modName = elem;
                                elem = undefined;
                            }

                            return block +
                                (elem ? ELEM_DELIMETER + elem: '') +
                                (modName ? MOD_DELIMETER + modName + MOD_DELIMETER + modVal: '');
                        },
                        buildClasses = function(block, elem, mods) {
                            var res = [buildClass(block, elem)];

                            if (mods) {
                                for (var modName in mods)
                                    if (mods.hasOwnProperty(modName))
                                        res.push(buildClass(block, elem, modName, mods[modName]));
                            }

                            return res.join(' ');
                        },
                        block = node.block || block,
                        elem = node.elem || elem,
                        tag = node.tag || 'div',
                        cls = node.cls || '',
                        jsParams,
                        mixClasses = '';

                    buf.push('<', tag);

                    if (node.js) {
                        jsParams = {};
                        jsParams[buildClass(block, elem)] = node.js === true ? {} : node.js;
                    }

                    if (node.mix) {
                        mixClasses = ' ';
                        var mix = Array.isArray(node.mix) ? node.mix : [node.mix],
                            i = 0,
                            l = mix.length,
                            mixItem,
                            mixBlock,
                            mixElem;

                        while (i < l) {
                            mixItem = mix[i++];
                            mixBlock = mixItem.block || block;
                            mixElem = mixItem.elem || mixItem.block ? undefined : elem;

                            mixClasses += buildClasses(
                                mixBlock,
                                mixElem,
                                mixItem.mods);

                            if (mixItem.js) {
                                (jsParams || (jsParams = {}))[buildClass(mixBlock, mixElem)] = mixItem.js === true ? {} : mixItem.js;
                            }
                        }
                    }

                    (mixClasses || block || elem || cls) &&  buf.push(' class="', buildClasses(block, elem, node.mods), mixClasses, jsParams ? ' i-bem': '', '"');
                    jsParams && buf.push(' onclick=" return ', JSON.stringify(jsParams), '"');

                    if (node.attrs) {
                        for (var attrName in node.attrs)
                            node.attrs.hasOwnProperty(attrName) && buf.push(' ', attrName, '="', node.attrs[attrName], '"')
                    }

                    if (SHORT_TAGS[tag]) {
                        buf.push('/>');
                    } else {
                        buf.push('>');

                        node.content && buf.push(bemgen.html(node.content, block, elem));

                        buf.push('</', tag, '>');
                    }
                }
            }

            return buf.join('');
        };

        // shortcuts
        var shortcuts = { b: 'block', e: 'elem', m: 'mods' };
        Object.keys(shortcuts).forEach(function(name) {
            bemgen[name] = bemgen[shortcuts[name]];
        });

        return bemgen;
    }

    ['ctx', 'block', 'elem', 'tag', 'b', 'e'].forEach(function(name) {
       exports[name] = function() {
           return BEMGEN()[name].apply(this, arguments);
       }
    });

})(typeof exports === 'undefined' ? this['bemjson-generator'] = {} : exports);
