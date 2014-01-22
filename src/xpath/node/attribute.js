/**
 * @fileoverview A class representing the attribute node of the
 * XDM interface.
 */

goog.provide('xrx.node.Attribute');



goog.require('xrx.node');
goog.require('xrx.stream');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



/** 
 * @constructor 
 */
xrx.node.Attribute = function(token, parent, instance) {
  goog.base(this, xrx.node.ATTRIBUTE, token, instance);



  this.parent_ = parent;
};
goog.inherits(xrx.node.Attribute, xrx.node);
