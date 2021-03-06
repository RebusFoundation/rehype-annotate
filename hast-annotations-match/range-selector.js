const getNode = require("./get-node");
const visit = require("unist-util-visit");
const is = require("unist-util-is");
const addPropsToNode = require("./add-props-to-node");

module.exports = rangeSelector;

/**
 *
 * @param {{tree: Object, selector: Object, annotation: Object}} param0 - selector options
 */
function rangeSelector({ tree, selector, annotation }) {
  const { startSelector, endSelector } = selector;
  const startNode = getNode({
    tree,
    selector: startSelector,
    annotation
  });
  const endNode = getNode({
    tree,
    selector: endSelector,
    annotation
  });
  let controlStart = false;
  let controlEnd = false;
  let selectedNodes = [startNode];
  if (!startNode || !endNode) return;
  visit(tree, "element", (node, index, parent) => {
    if (controlStart && !controlEnd) {
      selectedNodes = selectedNodes.concat(node);
    }
    if (is(node, startNode)) {
      controlStart = true;
    }
    if (is(node, endNode)) {
      controlEnd = true;
    }
  });
  selectedNodes = [...selectedNodes, endNode];
  selectedNodes.map(node => {
    addPropsToNode(node, annotation);
  });
}
