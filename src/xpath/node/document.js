/**
 * @fileoverview An abstract class representing the document node 
 * of the XDM interface.
 */

goog.provide('xrx.node.Document');



goog.require('xrx.node');
goog.require('xrx.token');



/** 
 * @constructor 
 */
xrx.node.Document = function(instance) {
  goog.base(this, xrx.node.DOCUMENT, new xrx.token.Root(), instance);
};
goog.inherits(xrx.node.Document, xrx.node);

