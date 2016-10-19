import ContentNode from './ContentNode';
  /**
   * creates nodes with entity keys and the endOffset
   */
function createEntityNodes(entityRanges, text) {
  let lastIndex = 0;
  const nodes = [];
  // if thers no entities will return just a single item
  if (entityRanges.length < 1) {
    nodes.push(new ContentNode({ start: 0, end: text.length }));
    return nodes;
  }

  entityRanges.forEach((range) => {
    // create an empty node for content between previous and this entity
    if (range.offset > lastIndex) {
      nodes.push(new ContentNode({ start: lastIndex, end: range.offset }));
    }
    // push the node for the entity
    nodes.push(new ContentNode({
      entity: range.key,
      start: range.offset,
      end: range.offset + range.length,
    }));
    lastIndex = range.offset + range.length;
  });

  // finaly add a node for the remaining text if any
  if (lastIndex < text.length) {
    nodes.push(new ContentNode({
      start: lastIndex,
      end: text.length,
    }));
  }
  return nodes;
}

function addIndexes(indexes, ranges) {
  ranges.forEach((range) => {
    indexes.push(range.offset);
    indexes.push(range.offset + range.length);
  });
  return indexes;
}

/**
 * Creates an array of sorted char indexes to avoid iterating over every single character
 */
function getRelevantIndexes(text, inlineRanges, entityRanges = []) {
  let relevantIndexes = [];
  // set indexes to corresponding keys to ensure uniquenes
  relevantIndexes = addIndexes(relevantIndexes, inlineRanges);
  relevantIndexes = addIndexes(relevantIndexes, entityRanges);
  // add text start and end to relevant indexes
  relevantIndexes.push(0);
  relevantIndexes.push(text.length);
  const uniqueRelevantIndexes = relevantIndexes.filter(
    (value, index, self) => self.indexOf(value) === index
  );
  // and sort it
  return uniqueRelevantIndexes.sort((aa, bb) => (aa - bb));
}

/**
 * Slices the decoded ucs2 array and encodes the result back to a string representation
 */
const getString = (array, from, to) => array.slice(from, to).join('');

export default class RawParser {

  relevantStyles(offset) {
    const styles = this.ranges.filter(
      range => offset >= range.offset && offset < (range.offset + range.length)
    );
    return styles.map(style => style.style);
  }

  /**
   * Loops over relevant text indexes
   */
  nodeIterator(node, start, end) {
    const indexes = this.relevantIndexes.slice(
      this.relevantIndexes.indexOf(start),
      this.relevantIndexes.indexOf(end)
    );
    // loops while next index is smaller than the endOffset
    indexes.forEach((index, key) => {
      // figure out what styles this char and the next char need
      // (regardless of whether there *is* a next char or not)
      const characterStyles = this.relevantStyles(index);

      // calculate distance or set it to 1 if thers no next index
      const distance = indexes[key + 1]
                       ? indexes[key + 1] - index
                       : 1;
      // add all the chars up to next relevantIndex
      const text = getString(this.textArray, index, index + distance);
      node.pushContent(text, characterStyles);

      // if thers no next index and thers more text left to push
      if (!indexes[key + 1] && index < end) {
        node.pushContent(getString(this.textArray, index + 1, end), this.relevantStyles(end - 1));
      }
    });
    return node;
  }

  /**
   * Converts raw block to object with nested style objects,
   * while it returns an object not a string
   * the idea is still mostly same as backdraft.js (https://github.com/evanc/backdraft-js)
   */
  parse({ text, inlineStyleRanges: ranges, entityRanges }) {
    // Some unicode charactes actualy have length of more than 1
    // this creates an array of code points using es6 string iterator
    this.textArray = Array.from(text);
    this.ranges = ranges;
    this.iterator = 0;
    // get all the relevant indexes for whole block
    this.relevantIndexes = getRelevantIndexes(text, ranges, entityRanges);
    // create entity or empty nodes to place the inline styles in
    const entityNodes = createEntityNodes(entityRanges, text);
    const parsedNodes = entityNodes.map((node) => {
      // reset the stacks
      this.styleStack = [];
      this.stylesToRemove = [];
      return this.nodeIterator(node, node.start, node.end);
    });
    return new ContentNode({ content: parsedNodes });
  }

}
