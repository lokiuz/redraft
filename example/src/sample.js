const sample = {
  entityMap: {
    0: {
      type: 'LINK',
      mutability: 'MUTABLE',
      data: {
        url: 'https://github.com/facebook/draft-js',
      },
    },
    1: {
      type: 'LINK',
      mutability: 'MUTABLE',
      data: {
        url: 'https://github.com/lokiuz/redraft/blob/master/README.md',
      },
    },
    2: {
      type: 'LINK',
      mutability: 'MUTABLE',
      data: {
        url: 'https://github.com/lokiuz/redraft/tree/master/example/src',
      },
    },
  },
  blocks: [
    {
      key: '8ofc8',
      text: 'Render to React components sample',
      type: 'header-one',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    }, {
      key: 'f9oqb',
      text: 'You can define custom components to render any part of the draf-js raw.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 59,
          length: 7,
          key: 0,
        },
      ],
      data: {},
    }, {
      key: 'edq7t',
      text: 'With cleanup and split flag enabled you can create new paragraphs with empty lines.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    }, {
      key: '964p1',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    }, {
      key: 'cd2or',
      text: 'Like this.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    }, {
      key: '3ov91',
      text: '',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {
        src: 'sample_cat.jpg',
        type: 'image',
        display: 'medium',
        caption: 'Some cat tax',
        rightsHolder: 'Inge Wallumrød, under CC0 License ',
      },
    }, {
      key: '1pdul',
      text: 'Lists are cool',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    }, {
      key: '224ne',
      text: 'try to add or delete',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 7,
          length: 3,
          style: 'BOLD',
        }, {
          offset: 14,
          length: 6,
          style: 'BOLD',
        }, {
          offset: 7,
          length: 3,
          style: 'ITALIC',
        }, {
          offset: 14,
          length: 6,
          style: 'ITALIC',
        },
      ],
      entityRanges: [],
      data: {},
    }, {
      key: 'dulcp',
      text: 'some items',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    }, {
      key: 'f0nn7',
      text: 'in this example',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    }, {
      key: 'bg0j2',
      text: 'Redraft api is simple and declarative, for more info check the readme or this example source ',
      type: 'blockquote',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 63,
          length: 6,
          key: 1,
        },
        {
          offset: 86,
          length: 6,
          key: 2,
        },
      ],
      data: {},
    },
  ],
};

export default sample;
