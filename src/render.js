import RawParser from './RawParser';
import deprecated from './deprecated';
import warn from './warn';

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
 * Recursively renders a node with nested nodes with given callbacks
 */
export const renderNode = (node, styleRendrers, entityRenderers, entityMap) => {
  let children = [];
  let index = 0;
  node.content.forEach((part) => {
    if (typeof part === 'string') {
      children = pushString(part, children, index);
    } else {
      index += 1;
      children[index] = renderNode(part, styleRendrers, entityRenderers, entityMap);
      index += 1;
    }
  });
  if (node.style && styleRendrers[node.style]) {
    return styleRendrers[node.style](children);
  }
  if (node.entity !== null) {
    const entity = entityMap[node.entity];
    if (entity && entityRenderers[entity.type]) {
      return entityRenderers[entity.type](children, entity.data);
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
const renderBlocks = (blocks, inlineRendrers = {}, blockRenderers = {},
                      entityRenderers = {}, entityMap = {}) => {
  // initialize
  const rendered = [];
  let group = [];
  let prevType = null;
  let prevDepth = 0;
  let prevKey = null;
  const Parser = new RawParser();

  blocks.forEach((block) => {
    const node = Parser.parse(block);
    const renderedNode = renderNode(node, inlineRendrers, entityRenderers, entityMap);
    // if type of the block has changed render the block and clear group
    if (prevType && prevType !== block.type) {
      if (blockRenderers[prevType]) {
        rendered.push(blockRenderers[prevType](group, prevDepth, prevKey));
      } else {
        rendered.push(group);
      }
      group = [];
    }
    // handle children
    if (block.children) {
      const children = renderBlocks(block.children, inlineRendrers,
      blockRenderers, entityRenderers, entityMap);
      renderedNode.push(children);
    }
    // push current node to group
    group.push(renderedNode);

    // lastly save current type for refference
    prevType = block.type;
    prevDepth = block.depth;
    prevKey = block.key;
  });
  // render last group
  if (blockRenderers[prevType]) {
    rendered.push(blockRenderers[prevType](group, prevDepth, prevKey));
  } else {
    rendered.push(group);
  }
  return rendered;
};

/**
 * Converts and renders each block of Draft.js rawState
 */
export const render = (raw, renderers = {}, arg3 = {}, arg4 = {}) => {
  if (!raw || !Array.isArray(raw.blocks)) {
    warn('invalid raw object');
    return null;
  }
  // If the lenght of the blocks array is 0 its should not log a warning but still return a null
  if (!raw.blocks.length) {
    return null;
  }
  let { inline: inlineRendrers, blocks: blockRenderers, entities: entityRenderers } = renderers;
  // Fallback to deprecated api
  if (!inlineRendrers && !blockRenderers && !entityRenderers) {
    inlineRendrers = renderers;
    blockRenderers = arg3;
    entityRenderers = arg4;
    // Logs a deprecation warning if not in production
    deprecated('passing renderers separetly is deprecated'); // eslint-disable-line
  }
  const blocks = byDepth(raw.blocks);
  return renderBlocks(blocks, inlineRendrers, blockRenderers, entityRenderers, raw.entityMap);
};

export const renderRaw = (...args) => {
  deprecated('renderRaw is deprecated use the default export');
  return render(...args);
};
