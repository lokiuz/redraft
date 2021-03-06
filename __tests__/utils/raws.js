export const raw = {
  entityMap: {
    0: {
      data: {
        url: 'http://zombo.com/',
      },
      type: 'LINK',
      mutability: 'MUTABLE',
    },
  },
  blocks: [{
    key: '77n1t',
    text: 'Lorem ipsum dolor sit amet, pro nisl sonet ad. ',
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [
      {
        offset: 0,
        length: 17,
        style: 'BOLD',
      },
      {
        offset: 6,
        length: 21,
        style: 'ITALIC',
      },
      {
        offset: 11,
        length: 6,
        style: 'UNDERLINE',
      },
      {
        offset: 11,
        length: 6,
        style: 'STRIKETHROUGH',
      },
    ],
    entityRanges: [
      {
        key: 0,
        offset: 6,
        length: 5,
      },
    ],
  }, {
    key: 'a005',
    text: 'Eos affert numquam id, in est meis nobis. Legimus singulis suscipiantur eum in, ceteros invenire tractatos his id. ', // eslint-disable-line max-len
    type: 'blockquote',
    depth: 0,
    inlineStyleRanges: [
      {
        offset: 80,
        length: 17,
        style: 'ITALIC',
      },
    ],
    entityRanges: [],
  }, {
    key: 'ee96q',
    text: 'Facer facilis definiebas ea pro, mei malis libris latine an. Senserit moderatius vituperata vis in.', // eslint-disable-line max-len
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [
      {
        offset: 0,
        length: 99,
        style: 'BOLD',
      },
    ],
    entityRanges: [],
  }],
};

export const raw2 = {
  entityMap: {},
  blocks: [{
    key: 'az45a',
    text: '!', // eslint-disable-line max-len
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }],
};

export const unsportedType = {
  entityMap: {},
  blocks: [{
    key: 'az45a',
    text: 'Block of this type is not supported', // eslint-disable-line max-len
    type: 'custom',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }],
};

export const raw3 = {
  entityMap: {},
  blocks: [{
    key: 'e047l',
    text: 'Paragraph one',
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }, {
    key: '520kr',
    text: 'A quote',
    type: 'blockquote',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }, {
    key: 'c3taj',
    text: 'Spanning multiple lines',
    type: 'blockquote',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }, {
    key: '6aaeh',
    text: 'A second paragraph.',
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }],
};

export const rawWithEmptyLine = {
  entityMap: {},
  blocks: [{
    key: 'az45a',
    text: '!', // eslint-disable-line max-len
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }, {
    key: 'az45b',
    text: '', // eslint-disable-line max-len
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }, {
    key: 'az45c',
    text: '!', // eslint-disable-line max-len
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }],
};

export const rawEmptyFirstLine = {
  entityMap: {},
  blocks: [{
    key: 'az45b',
    text: '', // eslint-disable-line max-len
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }, {
    key: 'az45a',
    text: '!', // eslint-disable-line max-len
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
  }],
};

export const rawWithDepth = {
  entityMap: {},
  blocks: [
    {
      key: 'eunbc',
      type: 'unordered-list-item',
      text: 'Hey',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '9nl08',
      type: 'unordered-list-item',
      text: 'Ho',
      depth: 1,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '9qp7i',
      type: 'unordered-list-item',
      text: 'Let\'s',
      depth: 2,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '1hegu',
      type: 'ordered-list-item',
      text: 'Go',
      depth: 2,
      inlineStyleRanges: [],
      entityRanges: [],
    }],
};

export const rawWithDepth2 = {
  entityMap: {},
  blocks: [
    {
      key: 'eunbc',
      type: 'unordered-list-item',
      text: 'Hey',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '9nl08',
      type: 'unordered-list-item',
      text: 'Ho',
      depth: 1,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '9qp7i',
      type: 'unordered-list-item',
      text: 'Let\'s',
      depth: 2,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '1hegu',
      type: 'ordered-list-item',
      text: 'Go',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    }],
};

export const emptyRaw = {
  entityMap: {},
  blocks: [],
};

export const invalidRaw = {
  entityMap: {},
  blocks: {},
};

export const rawWithDepth3 = {
  entityMap: {},
  blocks: [
    {
      key: 'eunbc',
      type: 'unordered-list-item',
      text: 'Hey',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '9nl08',
      type: 'unordered-list-item',
      text: 'Ho',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '9qp7i',
      type: 'unordered-list-item',
      text: 'Let\'s',
      depth: 2,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '1hegu',
      type: 'ordered-list-item',
      text: 'Go',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    }],
};

export const rawStyleWithEntities = {
  entityMap: {
    0: {
      type: 'ENTITY',
      mutability: 'MUTABLE',
      data: {
        data: {
          color: '#ee6a56',
        },
      },
    },
    1: {
      type: 'ENTITY',
      mutability: 'IMMUTABLE',
      data: {
        data: {
          placeholder: 'greeting',
          color: '#ee6a56',
        },
      },
    },
  },
  blocks: [
    {
      key: 'qaie',
      text: 'This is a Greeting redraftbug.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        {
          offset: 0,
          length: 30,
          style: 'BOLD',
        },
      ],
      entityRanges: [
        {
          offset: 5,
          length: 5,
          key: 0,
        }, {
          offset: 10,
          length: 8,
          key: 1,
        }, {
          offset: 18,
          length: 8,
          key: 0,
        },
      ],
      data: {},
    },
  ],
};

export const rawWithMetadata = {
  entityMap: {},
  blocks: [
    {
      key: '1',
      type: 'atomic',
      data: {
        type: 'resizable',
        width: '300px',
      },
      text: 'A',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '2',
      type: 'atomic',
      data: {
        type: 'image',
        src: 'img.png',
        alt: 'C',
      },
      text: 'B',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    }],
};

export const rawWithEmptyBlocks = {
  entityMap: {},
  blocks: [
    {
      key: '1',
      type: 'atomic',
      data: {
        type: 'resizable',
        width: '300px',
      },
      text: 'A',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: 'u1',
      type: 'unstyled',
      text: '',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '2',
      type: 'atomic',
      data: {
        type: 'resizable',
        width: '100px',
      },
      text: 'B',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: 'u2',
      type: 'blockquote',
      text: '',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: '3',
      type: 'atomic',
      data: {
        type: 'image',
        src: 'img.png',
        alt: 'D',
      },
      text: 'C',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: 'u3',
      type: 'unstyled',
      text: ' ',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
  ],
};

export const rawWithEmptyBlocks2 = {
  entityMap: {},
  blocks: [
    {
      key: 'u1',
      type: 'unstyled',
      text: '',
      depth: 0,
      data: {},
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: 'a1',
      type: 'atomic',
      data: {
        type: 'resizable',
        width: '300px',
      },
      text: '',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: 'u2',
      type: 'unstyled',
      text: 'A',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: 'b1',
      type: 'blockquote',
      text: '',
      depth: 0,
      data: {},
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: 'a2',
      type: 'atomic',
      text: ' ',
      depth: 0,
      data: {
        type: 'resizable',
        width: '300px',
      },
      inlineStyleRanges: [],
      entityRanges: [],
    },
  ],
};

export const rawWithEmoji = {
  entityMap: {},
  blocks: [{
    key: 'az45b',
    text: 'abc 😀', // eslint-disable-line max-len
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [
      {
        offset: 0,
        length: 5,
        style: 'BOLD',
      },
      {
        offset: 4,
        length: 1,
        style: 'ITALIC',
      },
    ],
    entityRanges: [],
  }],
};

export const rawWithEmoji2 = {
  entityMap: {},
  blocks: [{
    key: 'az45b',
    text: '😺😀', // eslint-disable-line max-len
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [
      {
        offset: 0,
        length: 1,
        style: 'BOLD',
      },
    ],
    entityRanges: [],
  }],
};

export const rawWithEmoji3 = {
  entityMap: {
    0: {
      type: 'ENTITY',
      mutability: 'MUTABLE',
      data: {
        data: {
          color: '#ee6a56',
        },
      },
    },
  },
  blocks: [{
    key: 'az45b',
    text: '😺123456😀', // eslint-disable-line max-len
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [
      {
        offset: 0,
        length: 1,
        style: 'BOLD',
      },
    ],
    entityRanges: [
      {
        offset: 6,
        length: 2,
        key: 0,
      },
    ],
  }],
};

export const rawWithEmptyBlocks3 = {
  entityMap: {},
  blocks: [
    {
      key: 'u1',
      type: 'unstyled',
      text: '',
      depth: 0,
      data: {},
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: 'u2',
      type: 'unstyled',
      text: '1',
      depth: 0,
      data: {},
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: 'u3',
      type: 'unstyled',
      text: '',
      depth: 0,
      data: {},
      inlineStyleRanges: [],
      entityRanges: [],
    },
    {
      key: 'u4',
      type: 'unstyled',
      text: '2',
      depth: 0,
      data: {},
      inlineStyleRanges: [],
      entityRanges: [],
    },
  ],
};

export const rawWithDuplicateStyles = {
  entityMap: {},
  blocks: [
    {
      key: 'u1',
      type: 'unstyled',
      depth: 0,
      data: {},
      inlineStyleRanges: [
        { length: 6, offset: 0, style: 'BOLD' },
        { length: 6, offset: 6, style: 'ITALIC' },
      ],
      text: 'Lorem ipsum.',
      entityRanges: [],
    },
  ],
};
