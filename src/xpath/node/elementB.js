/**
 * @fileoverview A class representing a element node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.ElementB');



goog.require('xrx.node');



/**
 * @constructor
 */
xrx.node.ElementB = function(instance, opt_token, opt_row) {
  goog.base(this, xrx.node.ELEMENT, opt_token, instance);



  this.row_ = opt_row;
};
goog.inherits(xrx.node.ElementB, xrx.node);




xrx.node.ElementB.prototype.getName = function() {
  var tagName = this.instance_.getIndex().tagName(this.token_, this.row_);

  return null;//token.xml(this.instance_.xml());
};

