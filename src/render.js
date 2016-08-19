import RawParser from './RawParser';
import deprecated from './deprecated';

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
      index++;
      children[index] = renderNode(part, styleRendrers, entityRenderers, entityMap);
      index++;
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
const byDepth = blocks => {
  let group = [];
  const depthStack = [];
  let prevDepth = 0;
  const unwind = targetDepth => {
    let i = prevDepth - targetDepth;
    // in case depthStack is too short for target depth
    if (depthStack.length < i) {
      i = depthStack.length;
    }
    for (i; i > 0; i--) {
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
  const Parser = new RawParser;
  let prevDepth = 0;
  blocks.forEach((block) => {
    const node = Parser.parse(block);
    const renderedNode = renderNode(node, inlineRendrers, entityRenderers, entityMap);
    // if type of the block has changed render the block and clear group
    if (prevType && prevType !== block.type) {
      if (blockRenderers[prevType]) {
        rendered.push(blockRenderers[prevType](group, prevDepth));
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
  });
  // render last group
  if (blockRenderers[prevType]) {
    rendered.push(blockRenderers[prevType](group, prevDepth));
  } else {
    rendered.push(group);
  }
  return rendered;
};

/**
 * Converts and renders each block of Draft.js rawState
 */
export const render = (raw, renderers = {}, arg3 = {}, arg4 = {}) => {
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
  if (!blocks) {
    return null;
  }
  return renderBlocks(blocks, inlineRendrers, blockRenderers, entityRenderers, raw.entityMap);
};

export const renderRaw = (...args) => {
  deprecated('renderRaw is deprecated us the default export');
  return render(...args);
};
