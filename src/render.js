import RawParser from './RawParser';
import warn from './warn';
import checkCleanup from './checkClenup';

const defaultOptions = {
  joinOutput: false,
  cleanup: {
    after: ['atomic'],
    types: ['unstyled'],
    trim: false,
    split: true,
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

// return a new generator wich produces sequential keys for nodes
const getKeyGenerator = () => {
  let key = 0;
  const keyGenerator = () => {
    const current = key;
    key += 1;
    return current; // eslint-disable-line no-plusplus
  };
  return keyGenerator;
};


/**
 * Recursively renders a node with nested nodes with given callbacks
 */
export const renderNode = (
  node,
  styleRenderers,
  entityRenderers,
  entityMap,
  options,
  keyGenerator
) => {
  let children = [];
  let index = 0;
  node.content.forEach((part) => {
    if (typeof part === 'string') {
      children = pushString(part, children, index);
    } else {
      index += 1;
      children[index] = renderNode(
        part,
        styleRenderers,
        entityRenderers,
        entityMap,
        options,
        keyGenerator
      );
      index += 1;
    }
  });
  if (node.style && styleRenderers[node.style]) {
    return styleRenderers[node.style](
      checkJoin(children, options),
      { key: keyGenerator() }
    );
  }
  if (node.entity !== null) {
    const entity = entityMap[node.entity];
    if (entity && entityRenderers[entity.type]) {
      return entityRenderers[entity.type](
        checkJoin(children, options),
        entity.data,
        { key: node.entity }
      );
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
  let splitGroup = false;
  const Parser = new RawParser();

  blocks.forEach((block) => {
    if (checkCleanup(block, prevType, options)) {
      // Set the split flag if enabled
      if (options.cleanup.split === true) {
        splitGroup = true;
      }
      return;
    }
    const node = Parser.parse(block);
    const renderedNode = renderNode(
      node,
      inlineRenderers,
      entityRenderers,
      entityMap,
      options,
      getKeyGenerator()
    );
    // if type of the block has changed or the split flag is set
    // render the block and clear group
    if ((prevType && prevType !== block.type) || splitGroup) {
      // in case current group is empty it should not be rendered
      if (blockRenderers[prevType] && group.length > 0) {
        rendered.push(blockRenderers[prevType](group, prevDepth, {
          keys: prevKeys,
          data: prevData,
        }));
      } else if (group.length > 0) {
        rendered.push(group);
      }
      // reset group vars
      // IDEA: might be worth to group those into an instance and just newup a new one
      prevData = [];
      prevKeys = [];
      group = [];
      splitGroup = false;
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
