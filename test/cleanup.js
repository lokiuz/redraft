import chai from 'chai';
import redraft from '../src';
import * as raws from './raws';
import { joinRecursively, makeList } from './helpers';

chai.should();


// render to HTML
const inline = {
  BOLD: (children) => `<strong>${children.join('')}</strong>`,
  ITALIC: (children) => `<em>${children.join('')}</em>`,
  UND: (children) => `<em>${children.join('')}</em>`,
};

const atomicBlocks = {
  resizable: (children, { width }, key) => `<div key="${key}" style="width: ${width};" >${joinRecursively(children)}</div>`,
  image: (children, { src, alt }, key) => `<img key="${key}" src="${src}" alt="${alt}" />`,
};

const blocks = {
  unstyled: (children) => `<p>${joinRecursively(children)}</p>`,
  blockquote: (children) => `<blockquote>${joinRecursively(children)}</blockquote>`,
  atomic: (children, _, { keys, data }) => {
    const maped = children.map(
      (child, i) => atomicBlocks[data[i].type](child, data[i], keys[i])
    );
    return joinRecursively(maped);
  },
};

const entities = {
  LINK: (children, entity) => `<a href="${entity.url}" >${joinRecursively(children)}</a>`,
  ENTITY: (children, entity) => `<div style="color: ${entity.data.color}" >${joinRecursively(children)}</div>`,
};


// render to HTML


const renderers = {
  inline,
  blocks,
  entities,
};

describe('redraft with cleanup', () => {
  it('should skip only empty unstyled blocks after atomic', () => {
    const rendered = redraft(raws.rawWithEmptyBlocks, renderers);
    const joined = joinRecursively(rendered);
    joined.should.equal('<div key="1" style="width: 300px;" >A</div><div key="2" style="width: 100px;" >B</div><blockquote></blockquote><img key="3" src="img.png" alt="D" /><p> </p>'); // eslint-disable-line max-len
  });
  it('should respect trim option', () => {
    const rendered = redraft(raws.rawWithEmptyBlocks, renderers, {
      cleanup: { types: ['unstyled'], after: ['atomic'], trim: true },
    });
    const joined = joinRecursively(rendered);
    joined.should.equal('<div key="1" style="width: 300px;" >A</div><div key="2" style="width: 100px;" >B</div><blockquote></blockquote><img key="3" src="img.png" alt="D" />'); // eslint-disable-line max-len
  });
  it('should respect passing types as an array', () => {
    const rendered = redraft(raws.rawWithEmptyBlocks, renderers, {
      cleanup: { types: ['unstyled', 'blockquote'], after: ['atomic'], trim: false },
    });
    const joined = joinRecursively(rendered);
    joined.should.equal('<div key="1" style="width: 300px;" >A</div><div key="2" style="width: 100px;" >B</div><img key="3" src="img.png" alt="D" /><p> </p>'); // eslint-disable-line max-len
  });
  it('should respect passing \'all\' to types', () => {
    const rendered = redraft(raws.rawWithEmptyBlocks, renderers, {
      cleanup: { types: 'all', after: ['atomic'], trim: false },
    });
    const joined = joinRecursively(rendered);
    joined.should.equal('<div key="1" style="width: 300px;" >A</div><div key="2" style="width: 100px;" >B</div><img key="3" src="img.png" alt="D" /><p> </p>'); // eslint-disable-line max-len
  });
  it('should check for data when triming', () => {
    const rendered = redraft(raws.rawWithEmptyBlocks2, renderers, {
      cleanup: { types: 'all', after: ['unstyled', 'atomic', 'blockquote'], trim: true },
    });
    const joined = joinRecursively(rendered);
    joined.should.equal('<p></p><div key="a1" style="width: 300px;" ></div><p>A</p><div key="a2" style="width: 300px;" > </div>'); // eslint-disable-line max-len
  });
  it('should respect passing \'all\' to after', () => {
    const rendered = redraft(raws.rawWithEmptyBlocks2, renderers, {
      cleanup: { types: 'all', after: 'all', trim: false },
    });
    const joined = joinRecursively(rendered);
    joined.should.equal('<div key="a1" style="width: 300px;" ></div><p>A</p><div key="a2" style="width: 300px;" > </div>'); // eslint-disable-line max-len
  });
  it('should respect passing except array', () => {
    const rendered = redraft(raws.rawWithEmptyBlocks2, renderers, {
      cleanup: { except: ['blockquote'], after: 'all', trim: false },
    });
    const joined = joinRecursively(rendered);
    joined.should.equal('<div key="a1" style="width: 300px;" ></div><p>A</p><blockquote></blockquote><div key="a2" style="width: 300px;" > </div>'); // eslint-disable-line max-len
  });
  it('should render all blocks with cleanup disabled', () => {
    const rendered = redraft(raws.rawWithEmptyBlocks, renderers, {
      cleanup: false,
    });
    const joined = joinRecursively(rendered);
    joined.should.equal('<div key="1" style="width: 300px;" >A</div><p></p><div key="2" style="width: 100px;" >B</div><blockquote></blockquote><img key="3" src="img.png" alt="D" /><p> </p>'); // eslint-disable-line max-len
  });
});
