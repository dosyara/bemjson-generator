var bemgen = require('./common.blocks/bemjson-generator/bemjson-generator.js');

// hack to use modules' methods as global functions
var block, elem, ctx;
for (var name in bemgen)
    if (bemgen.hasOwnProperty(name))
        GLOBAL[name] = bemgen[name];

console.log(JSON.stringify(
    block('link')
        .mods({ pseudo: 'yes' })
        .ctx({ url: 'ya.ru' })
        .mix(block('bla')())
        .content(
            elem('inner')('yandex'),
            '!'
        )
    , false, '  '));
