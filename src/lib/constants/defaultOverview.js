export const OVERVIEW_VALUE = {
    object: 'value',
    document: {
        object: 'document',
        data: {},
        nodes: [
            {
                object: 'block',
                type: 'heading-one',
                data: {},
                nodes: [
                    { object: 'text', text: 'Welcome to your wiki', marks: [] },
                ],
            },
            {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    { object: 'text', text: 'This is ', marks: [] },
                    {
                        object: 'text',
                        text: 'your',
                        marks: [{ object: 'mark', type: 'bold', data: {} }],
                    },
                    {
                        object: 'inline',
                        type: 'link',
                        data: { href: 'https://en.wikipedia.org/wiki/Wiki' },
                        nodes: [{ object: 'text', text: 'wiki', marks: [] }],
                    },
                    {
                        object: 'text',
                        text: ', where you can do whatever you want. ',
                        marks: [],
                    },
                    {
                        object: 'text',
                        text: 'All content',
                        marks: [{ object: 'mark', type: 'bold', data: {} }],
                    },
                    {
                        object: 'text',
                        text: ' you create here is saved on your',
                        marks: [],
                    },
                    {
                        object: 'text',
                        text: ' Google Drive',
                        marks: [{ object: 'mark', type: 'bold', data: {} }],
                    },
                    { object: 'text', text: '.', marks: [] },
                ],
            },
            {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    { object: 'text', text: 'You can use it to', marks: [] },
                ],
            },
            {
                object: 'block',
                type: 'bulleted-list',
                data: {},
                nodes: [
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'text',
                                text: 'Develop ideas',
                                marks: [],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'text',
                                text: 'Use it as a notebook',
                                marks: [],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'text',
                                text: 'Collect links, files and data',
                                marks: [],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'text',
                                text: 'Post code snippets you find useful',
                                marks: [],
                            },
                        ],
                    },
                ],
            },
            {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    { object: 'text', text: 'These are just ', marks: [] },
                    {
                        object: 'text',
                        text: 'suggestions',
                        marks: [{ object: 'mark', type: 'bold', data: {} }],
                    },
                    { object: 'text', text: '. Do whatever ', marks: [] },
                    {
                        object: 'text',
                        text: 'you want',
                        marks: [{ object: 'mark', type: 'bold', data: {} }],
                    },
                    { object: 'text', text: '. It is ', marks: [] },
                    {
                        object: 'text',
                        text: 'your',
                        marks: [{ object: 'mark', type: 'bold', data: {} }],
                    },
                    { object: 'text', text: ' wiki.', marks: [] },
                ],
            },
            {
                object: 'block',
                type: 'heading-two',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Some tips to get you started',
                        marks: [],
                    },
                ],
            },
            {
                object: 'block',
                type: 'bulleted-list',
                data: {},
                nodes: [
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'text',
                                text: 'Edit this page.',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text: ' Click on the ',
                                marks: [],
                            },
                            {
                                object: 'text',
                                text: 'edit icon',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            { object: 'text', text: ' or press ', marks: [] },
                            {
                                object: 'text',
                                text: 'e',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text:
                                    '  on your keyboard, the editor will open. You can insert files from your Google Drive by using the Drive-button in the menu bar.',
                                marks: [],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'text',
                                text: 'Insert a new page.',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text: ' Click on the ',
                                marks: [],
                            },
                            {
                                object: 'text',
                                text: 'New Page',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text: ' button on the top left to create a ',
                                marks: [],
                            },
                            {
                                object: 'text',
                                text: 'new page below the current page',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text: '. If you want to ',
                                marks: [],
                            },
                            {
                                object: 'text',
                                text: 'create a page somewhere else',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text: ' in your wiki, ',
                                marks: [],
                            },
                            {
                                object: 'text',
                                text: 'hover over an entry',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text: ' in the page tree and ',
                                marks: [],
                            },
                            {
                                object: 'text',
                                text: 'click',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            { object: 'text', text: ' the ', marks: [] },
                            {
                                object: 'text',
                                text: '+',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            { object: 'text', text: '-button.', marks: [] },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'text',
                                text: 'Search your wiki. ',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text: 'Click into the ',
                                marks: [],
                            },
                            {
                                object: 'text',
                                text: 'search box',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            { object: 'text', text: ' or press ', marks: [] },
                            {
                                object: 'text',
                                text: '/',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text:
                                    ' on your keyboard to search your wiki. The search box will also show your last visited wiki pages.',
                                marks: [],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            { object: 'text', text: 'You can ', marks: [] },
                            {
                                object: 'text',
                                text: 'insert files',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text: ' from your Google Drive ',
                                marks: [],
                            },
                            {
                                object: 'text',
                                text: 'into your wiki',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text: ' pages by using the ',
                                marks: [],
                            },
                            {
                                object: 'text',
                                text: 'Drive-button',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            {
                                object: 'text',
                                text: ' in the menu bar.',
                                marks: [],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            { object: 'text', text: 'If you ', marks: [] },
                            {
                                object: 'text',
                                text: 'need more wikis',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            { object: 'text', text: ', add them ', marks: [] },
                            {
                                object: 'text',
                                text: 'from your Google Drive',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                            { object: 'text', text: ' using the ', marks: [] },
                            {
                                object: 'text',
                                text: 'New-Button.',
                                marks: [
                                    { object: 'mark', type: 'bold', data: {} },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                object: 'block',
                type: 'heading-two',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text: 'Editor features and shortcuts',
                        marks: [],
                    },
                ],
            },
            {
                object: 'block',
                type: 'table',
                data: { headless: false },
                nodes: [
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Feature',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Shortcut',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Start editing',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'e',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Save and close editor',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Ctrl+Enter / ⌘+Enter',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Toggle heading style [1-6]',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Ctrl+Alt+[1-6] / ⌘+Alt+[1-6]',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Toggle numbered list',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Ctrl+Shift+7 / ⌘+Shift+7',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Toggle bulleted list',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Ctrl+Shift+8 / ⌘+Shift+8',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Toggle code block',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Ctrl+Shift+0 / ⌘+Shift+0',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Choose syntax highlighting for code block',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Toggle quote',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Ctrl+Shift+9 / ⌘+Shift+9',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Toggle bold text',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Ctrl+b / ⌘+b',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Toggle italic text',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Ctrl+i / ⌘+i',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Toggle underlined text',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Ctrl+u / ⌘+u',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Toggle strikethrough text',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Ctrl+~ / ⌘+~',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Toggle monospaced text',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Ctrl+` / ⌘+`',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Insert link',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Ctrl+k / ⌘+k',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Insert image from Google Drive',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Drag image from your computer',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text:
                                                    'Insert a link to an item in your Google Drive',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Insert table',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Delete table',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Add column',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Remove column',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Add row',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Remove row',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        object: 'block',
                        type: 'table_row',
                        data: {},
                        nodes: [
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: 'Toggle table header',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                object: 'block',
                                type: 'table_cell',
                                data: {},
                                nodes: [
                                    {
                                        object: 'block',
                                        type: 'paragraph',
                                        data: {},
                                        nodes: [
                                            {
                                                object: 'text',
                                                text: '',
                                                marks: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                object: 'block',
                type: 'heading-two',
                data: {},
                nodes: [
                    { object: 'text', text: 'Markdown shortcuts', marks: [] },
                ],
            },
            {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        text:
                            'If you know markdown you can use it as a shortcut to structure your content. You simply type the markdown marker and hit space. Fulcrum supports the following markers:',
                        marks: [],
                    },
                ],
            },
            {
                object: 'block',
                type: 'heading-one',
                data: {},
                nodes: [{ object: 'text', text: '# Header 1', marks: [] }],
            },
            {
                object: 'block',
                type: 'heading-two',
                data: {},
                nodes: [{ object: 'text', text: '## Header 2', marks: [] }],
            },
            {
                object: 'block',
                type: 'heading-three',
                data: {},
                nodes: [{ object: 'text', text: '### Header 3', marks: [] }],
            },
            {
                object: 'block',
                type: 'heading-four',
                data: {},
                nodes: [{ object: 'text', text: '#### Header 4', marks: [] }],
            },
            {
                object: 'block',
                type: 'heading-five',
                data: {},
                nodes: [{ object: 'text', text: '##### Header 5', marks: [] }],
            },
            {
                object: 'block',
                type: 'heading-six',
                data: {},
                nodes: [{ object: 'text', text: '###### Header 6', marks: [] }],
            },
            {
                object: 'block',
                type: 'bulleted-list',
                data: {},
                nodes: [
                    {
                        object: 'block',
                        type: 'list-item',
                        data: {},
                        nodes: [
                            {
                                object: 'text',
                                text: '* bullet point',
                                marks: [],
                            },
                        ],
                    },
                ],
            },
            {
                object: 'block',
                type: 'block-quote',
                data: {},
                nodes: [{ object: 'text', text: '> quote', marks: [] }],
            },
            {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [{ object: 'text', text: '', marks: [] }],
            },
            {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [{ object: 'text', text: '', marks: [] }],
            },
        ],
    },
}
