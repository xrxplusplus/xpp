/**
 * @fileoverview A class representing a text node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.TextB');



goog.require('xrx.node');
goog.require('xrx.nodeB');
goog.require('xrx.token');



/**
 * Creates a binary text node.
 *
 * @param {!xrx.instance}
 * @constructor
 */
xrx.node.TextB = function(instance, opt_key) {
  goog.base(this, xrx.node.TEXT, instance, opt_key);
};
goog.inherits(xrx.node.TextB, xrx.nodeB);




xrx.node.TextB.prototype.getLabel = function() {
  var label = this.getIndex().getLabel(this.key_);;
  if (this.getRow().getType() === xrx.token.START_TAG) label.push0();

  return label;
};



xrx.node.TextB.prototype.getOffset = function() {
  var row = this.getRow();

  return row.getOffset() + row.getLength1();
};



xrx.node.TextB.prototype.getLength = function() {
  var row = this.getRow();

  return row.getLength2() - row.getLength1();
};




xrx.node.TextB.prototype.getXml = function() {
  return this.instance_.xml().substr(this.getOffset(), this.getLength());
};
