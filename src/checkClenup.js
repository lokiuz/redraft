/**
 * Check if block has any text, respects trim setting
 */
const hasText = (text, { trim }) => !!(trim ? text.trim() : text);


/**
 * Check if block has any data like text, metadata or entities
 */
const hasData = (block, options) => {
  if (hasText(block.text, options)) {
    return true;
  }
  if (block.data && Object.keys(block.data).length) {
    return true;
  }
  if (block.entityRanges && block.entityRanges.length) {
    return true;
  }
  return false;
};


/**
 * Checks if current block is empty and if it should be ommited according to passed settings
 */
const checkCleanup = (block, prevType, { cleanup }) => {
  if (!cleanup || hasData(block, cleanup)) {
    return false;
  }
  // Check if cleanup is enabled after prev type
  if (cleanup.after !== 'all' && !cleanup.after.includes(prevType)) {
    return false;
  }
  // Handle the except array if passed
  if (cleanup.except && !cleanup.except.includes(block.type)) {
    return true;
  }
  // Finaly if cleanup is enabled for current type
  if (cleanup.types && (cleanup.types === 'all' || cleanup.types.includes(block.type))) {
    return true;
  }
  return false;
};

export default checkCleanup;
