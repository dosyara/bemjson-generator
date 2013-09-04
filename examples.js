var bemgen = require('./common.blocks/bemjson-generator/bemjson-generator.js');

// hack to use modules' methods as global functions
for (var name in bemgen)
    if (bemgen.hasOwnProperty(name))
        GLOBAL[name] = bemgen[name];

console.log(JSON.stringify(
    block('link')
        .tag('a')
        .mods({ pseudo: 'yes' })
        .ctx({ url: 'ya.ru' })
        .js(true)
        .mix(block('bla')())
        .content(
            elem('inner')('yandex'),
            '!'
        )
        .html()
    , false, '  '));

console.log(JSON.stringify(
    b('link').e('inner').m({ valign: 'middle' }).content('yandex').html()
    , false, '  '));
