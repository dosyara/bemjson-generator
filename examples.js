var bemgen = require('./common.blocks/bemjson-generator/bemjson-generator.js');

// globals
var ctx = bemgen['ctx'],
    tag = bemgen['tag'],
    block = bemgen['block'],
    elem = bemgen['elem'],
    b = bemgen['b'],
    e = bemgen['e'];


var page = block('b-page')
    .ctx('title', 'examples')
    .ctx('head', [
        elem('css')
            .ctx({
                url: 'test.css',
                ie: false
            })()
    ])
    .mod('theme', 'normal')
    .content(

        //short form
        b('link')
            .e('inner')
            .m({ valign: 'middle' })
            ('yandex'),
        /*{
            block: 'link',
            elem: 'inner',
            mods: { valign: 'middle' },
            content: 'yandex'
         },*/

        // link
        block('link')
            .tag('a')
            .mod('pseudo', 'yes')
            .attr('target', '_blank')
            .ctx('url', 'ya.ru')
            .js(true)
            ('yandex'),
        /*{
            block: 'link',
            tag: 'a',
            mods: { pseudo: 'yes' },
            attrs: { target: '_blank' },
            url: 'ya.ru',
            js: true,
            content: 'yandex'
        },*/

        // select
        block('select')
            .ctx('name', 'mail')
            .mods({ size: 'm', theme: 'normal' })
            (
                block('button')('Отправленные'),
                elem('control')
                    (
                        elem('options')
                            .attrs({ value: 'send' })
                            ('Отправленные'),
                        elem('options')
                            .attrs({ value: 'draft' })
                            ('Черновики')
                    )
            )
        /*{
            block: 'select',
            name: 'mail',
            mods: { size: 'm', theme: 'normal' },
            content: [
                {
                    block: 'button',
                    content: 'Отправленные'
                },
                {
                    elem: 'control',
                    content: [
                        {
                            elem: 'option',
                            attrs: { value: 'send' },
                            content: 'Отправленные'
                        },
                        {
                            elem: 'option',
                            attrs: { value: 'draft' },
                            content: 'Черновики'
                        }
                    ]
                }
            ]
        },*/

    );

console.log(JSON.stringify(
    page()
    , false, '  '));
