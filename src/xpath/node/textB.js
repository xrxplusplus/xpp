/**
 * @fileoverview A class representing a text node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.TextB');



goog.require('xrx.node');
goog.require('xrx.nodeB');
goog.require('xrx.token');



/**
 * @param {!xrx.instance}
 * @constructor
 */
xrx.node.TextB = function(instance, opt_row) {
  goog.base(this, xrx.node.TEXT, instance, opt_row);
};
goog.inherits(xrx.node.TextB, xrx.nodeB);




xrx.node.TextB.prototype.getLabel = function() {
  var type = this.getRow().getType();
  var label = this.instance_.getIndex().getLabel(this.row_);
  if (type === xrx.token.START_TAG) label.push0();

  return label;
};
