import chai from 'chai';
import redraft from '../src';
import * as raws from './raws';
import { joinRecursively, makeList } from './helpers';

const should = chai.should();


// render to HTML
const inline = {
  BOLD: (children) => `<strong>${children.join('')}</strong>`,
  ITALIC: (children) => `<em>${children.join('')}</em>`,
  UND: (children) => `<em>${children.join('')}</em>`,
};

const blocks = {
  unstyled: (children) => `<p>${joinRecursively(children)}</p>`,
  blockquote: (children) => `<blockquote>${joinRecursively(children)}</blockquote>`,
  'ordered-list-item': (children) => `<ol>${makeList(children)}</ol>`,
  'unordered-list-item': (children) => `<ul>${makeList(children)}</ul>`,
};

const atomicBlocks = {
  resizable: (children, { width }, key) => `<div key="${key}" style="width: ${width};" >${joinRecursively(children)}</div>`,
  image: (children, { src, alt }, key) => `<img key="${key}" src="${src}" alt="${alt}" />`,
};

const dataBlocks = {
  unstyled: (children) => `<p>${joinRecursively(children)}</p>`,
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

const renderers = {
  inline,
  blocks,
  entities,
};

const blocksWithKeys = {
  unstyled: (children, depth, { keys }) => `<p key="${keys.join(',')}">${joinRecursively(children)}</p>`,
  blockquote:
    (children, depth, { keys }) => `<blockquote key="${keys.join(',')}">${joinRecursively(children)}</blockquote>`,
  'ordered-list-item':
    (children, depth, { keys }) => `<ol key="${keys.join(',')}">${makeList(children)}</ol>`,
  'unordered-list-item':
    (children, depth, { keys }) => `<ul key="${keys.join(',')}">${makeList(children)}</ul>`,
};

// render to HTML

const inlineNoJoin = {
  BOLD: (children) => `<strong>${children}</strong>`,
  ITALIC: (children) => `<em>${children}</em>`,
  UND: (children) => `<em>${children}</em>`,
};

const entitiesNoJoin = {
  LINK: (children, entity) => `<a href="${entity.url}" >${children}</a>`,
  ENTITY: (children, entity) => `<div style="color: ${entity.data.color}" >${children}</div>`,
};


const renderersWithKeys = {
  inline,
  blocks: blocksWithKeys,
  entities,
};

const renderersNoJoin = {
  inline: inlineNoJoin,
  blocks,
  entities: entitiesNoJoin,
};

const renderersWithData = {
  inline,
  blocks: dataBlocks,
  entities,
};

describe('redraft', () => {
  it('should render correctly', () => {
    const rendered = redraft(raws.raw, renderers);
    const joined = joinRecursively(rendered);
    joined.should.equal('<p><strong>L🐡rem </strong><a href="http://zombo.com/" ><strong><em>ipsum</em></strong></a><strong><em> dolor</em></strong><em> sit amet,</em> pro nisl sonet ad. </p><blockquote>Eos affert numquam id, in est meis nobis. Legimus singulis suscipiantur eum in, <em>ceteros invenire </em>tractatos his id. </blockquote><p><strong>Facer facilis definiebas ea pro, mei malis libris latine an. Senserit moderatius vituperata vis in.</strong></p>'); // eslint-disable-line max-len
  });
  it('should render blocks with single char correctly', () => {
    const rendered = redraft(raws.raw2, renderers);
    const joined = joinRecursively(rendered);
    joined.should.equal('<p>!</p>');
  });
  it('should render blocks with depth correctly 1/2', () => {
    const rendered = redraft(raws.rawWithDepth, renderers);
    const joined = joinRecursively(rendered);
    joined.should.equal("<ul><li>Hey<ul><li>Ho<ul><li>Let's</li></ul><ol><li>Go</li></ol></li></ul></li></ul>"); // eslint-disable-line max-len
  });
  it('should render blocks with depth correctly 2/2', () => {
    const rendered = redraft(raws.rawWithDepth2, renderers);
    const joined = joinRecursively(rendered);
    joined.should.equal("<ul><li>Hey<ul><li>Ho<ul><li>Let's</li></ul></li></ul></li></ul><ol><li>Go</li></ol>"); // eslint-disable-line max-len
  });
  it('should render blocks containing empty lines', () => {
    const rendered = redraft(raws.rawWithEmptyLine, renderers);
    const joined = joinRecursively(rendered);
    joined.should.equal('<p>!!</p>');
  });
  it('should render blocks when first block is empty', () => {
    const rendered = redraft(raws.rawEmptyFirstLine, renderers);
    const joined = joinRecursively(rendered);
    joined.should.equal('<p>!</p>');
  });
  it('should render blocks with depth when depth jumps from 0 to 2', () => {
    const rendered = redraft(raws.rawWithDepth3, renderers);
    const joined = joinRecursively(rendered);
    joined.should.equal("<ul><li>Hey</li><li>Ho<ul><li>Let's</li></ul></li></ul><ol><li>Go</li></ol>"); // eslint-disable-line max-len
  });
  it('should style last node properly when its after an entity', () => {
    const rendered = redraft(raws.rawStyleWithEntities, renderers);
    const joined = joinRecursively(rendered);
    joined.should.equal('<p><strong>This </strong><div style="color: #ee6a56" ><strong>is a </strong></div><div style="color: #ee6a56" ><strong>Greeting</strong></div><div style="color: #ee6a56" ><strong> redraft</strong></div><strong>bug.</strong></p>'); // eslint-disable-line max-len
  });
  it('should render blocks with the block keys', () => {
    const rendered = redraft(raws.raw3, renderersWithKeys);
    const joined = joinRecursively(rendered);
    joined.should.equal('<p key="e047l">Paragraph one</p><blockquote key="520kr,c3taj">A quoteSpanning multiple lines</blockquote><p key="6aaeh">A second paragraph.</p>'); // eslint-disable-line max-len
  });
  it('should render atomic blocks with block metadata', () => {
    const rendered = redraft(raws.rawWithMetadata, renderersWithData);
    const joined = joinRecursively(rendered);
    joined.should.equal('<div key="1" style="width: 300px;" >A</div><img key="2" src="img.png" alt="C" />'); // eslint-disable-line max-len
  });
  it('should render correctly without join', () => {
    const rendered = redraft(raws.raw, renderersNoJoin, { joinOutput: true });
    rendered.should.equal('<p><strong>L🐡rem </strong><a href="http://zombo.com/" ><strong><em>ipsum</em></strong></a><strong><em> dolor</em></strong><em> sit amet,</em> pro nisl sonet ad. </p><blockquote>Eos affert numquam id, in est meis nobis. Legimus singulis suscipiantur eum in, <em>ceteros invenire </em>tractatos his id. </blockquote><p><strong>Facer facilis definiebas ea pro, mei malis libris latine an. Senserit moderatius vituperata vis in.</strong></p>'); // eslint-disable-line max-len
  });
  it('should render null for empty raw blocks array', () => {
    const rendered = redraft(raws.emptyRaw, renderers);
    should.equal(rendered, null);
  });
  it('should return null for an invalid input 1/2', () => {
    const rendered = redraft(raws.invalidRaw, renderers);
    should.equal(rendered, null);
  });
  it('should return null for an invalid input 2/2', () => {
    const rendered = redraft([], renderers);
    should.equal(rendered, null);
  });
  it('should return null for no input', () => {
    const rendered = redraft();
    should.equal(rendered, null);
  });
});
