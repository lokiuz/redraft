import RawParser from './RawParser';
import warn from './warn';

const defaultOptions = {
  joinOutput: false,
  cleanup: {
    after: ['atomic'],
    types: ['unstyled'],
    trim: false,
  },
};

/**
 * Concats or insets a string at given array index
 */
const pushString = (string, array, index) => {
  const tempArray = array;
  if (!array[index]) {
    tempArray[index] = string;
  } else {
    tempArray[index] += string;
  }
  return tempArray;
};

/**
 * Joins the input if the joinOutput option is enabled
 */
const checkJoin = (input, options) => {
  if (Array.isArray(input) && options.joinOutput) {
    return input.join('');
  }
  return input;
};

/**
 * Check if text is false with or without trim depending on cleanup settings
 */
const hasText = (text, { trim }) => !!(trim ? text.trim() : text);

/**
 * Checks if current block is empty and if it should be ommited according to passed settings
 */
const checkCleanup = (block, prevType, { cleanup }) => {
  if (!cleanup || hasText(block.text, cleanup)) {
    return false;
  }
  // Check if cleanup is enabled after prev type
  if (cleanup.after !== 'all' && !cleanup.after.includes(prevType)) {
    return false;
  }
  // Finaly if cleanup is enabled for current type
  if (cleanup.types === 'all' || cleanup.types.includes(block.type)) {
    return true;
  }
  return false;
};

/**
 * Recursively renders a node with nested nodes with given callbacks
 */
export const renderNode = (node, styleRenderers, entityRenderers, entityMap, options) => {
  let children = [];
  let index = 0;
  node.content.forEach((part) => {
    if (typeof part === 'string') {
      children = pushString(part, children, index);
    } else {
      index += 1;
      children[index] = renderNode(part, styleRenderers, entityRenderers, entityMap, options);
      index += 1;
    }
  });
  if (node.style && styleRenderers[node.style]) {
    return styleRenderers[node.style](checkJoin(children, options));
  }
  if (node.entity !== null) {
    const entity = entityMap[node.entity];
    if (entity && entityRenderers[entity.type]) {
      return entityRenderers[entity.type](checkJoin(children, options), entity.data);
    }
  }
  return children;
};

/**
 * Nests blocks by depth as children
 */
const byDepth = (blocks) => {
  let group = [];
  const depthStack = [];
  let prevDepth = 0;
  const unwind = (targetDepth) => {
    let i = prevDepth - targetDepth;
    // in case depthStack is too short for target depth
    if (depthStack.length < i) {
      i = depthStack.length;
    }
    for (i; i > 0; i -= 1) {
      const tmp = group;
      group = depthStack.pop();
      group[group.length - 1].children = tmp;
    }
  };

  blocks.forEach((block) => {
    // if type of the block has changed render the block and clear group
    if (prevDepth < block.depth) {
      depthStack.push(group);
      group = [];
    } else if (prevDepth > block.depth) {
      unwind(block.depth);
    }
    prevDepth = block.depth;
    group.push(block);
  });
  if (prevDepth !== 0) {
    unwind(0);
  }
  return group;
};


/**
 * Renders blocks grouped by type using provided blockStyleRenderers
 */
const renderBlocks = (blocks, inlineRenderers = {}, blockRenderers = {},
                      entityRenderers = {}, entityMap = {}, userOptions = {}) => {
  // initialize
  const options = Object.assign({}, defaultOptions, userOptions);
  const rendered = [];
  let group = [];
  let prevType = null;
  let prevDepth = 0;
  let prevKeys = [];
  let prevData = [];
  const Parser = new RawParser();

  blocks.forEach((block) => {
    if (checkCleanup(block, prevType, options)) {
      return;
    }
    const node = Parser.parse(block);
    const renderedNode = renderNode(node, inlineRenderers, entityRenderers, entityMap, options);
    // if type of the block has changed render the block and clear group
    if (prevType && prevType !== block.type) {
      if (blockRenderers[prevType]) {
        rendered.push(blockRenderers[prevType](group, prevDepth, {
          keys: prevKeys,
          data: prevData,
        }));
        prevKeys = [];
        prevData = [];
      } else {
        rendered.push(group);
      }
      group = [];
    }
    // handle children
    if (block.children) {
      const children = renderBlocks(block.children, inlineRenderers,
      blockRenderers, entityRenderers, entityMap, options);
      renderedNode.push(children);
    }
    // push current node to group
    group.push(renderedNode);

    // lastly save current type for refference
    prevType = block.type;
    prevDepth = block.depth;
    prevKeys.push(block.key);
    prevData.push(block.data);
  });
  // render last group
  if (blockRenderers[prevType]) {
    rendered.push(blockRenderers[prevType](group, prevDepth, {
      keys: prevKeys,
      data: prevData,
    }));
  } else {
    rendered.push(group);
  }
  return checkJoin(rendered, options);
};

/**
 * Converts and renders each block of Draft.js rawState
 */
export const render = (raw, renderers = {}, options = {}) => {
  if (!raw || !Array.isArray(raw.blocks)) {
    warn('invalid raw object');
    return null;
  }
  // If the lenght of the blocks array is 0 its should not log a warning but still return a null
  if (!raw.blocks.length) {
    return null;
  }
  const { inline: inlineRenderers, blocks: blockRenderers, entities: entityRenderers } = renderers;

  const blocks = byDepth(raw.blocks);
  return renderBlocks(
    blocks,
    inlineRenderers,
    blockRenderers,
    entityRenderers,
    raw.entityMap,
    options
  );
};
