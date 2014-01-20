/**
 * @fileoverview A node implementation for binary XPath 
 * evaluation.
 */

goog.provide('xrx.nodeB');


goog.require('xrx.node');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



/**
 * @constructor
 */
xrx.nodeB = function(type, instance, row) {
  goog.base(this, type, null, instance);



  this.row_ = row;
};
goog.inherits(xrx.nodeB, xrx.node);



xrx.nodeB.prototype.getRow = function() {
  return this.instance_.getIndex().getRow(this.row_);
};



xrx.nodeB.prototype.getIndex = function() {
  return this.instance_.getIndex();
};
