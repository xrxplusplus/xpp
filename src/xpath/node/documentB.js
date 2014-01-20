/**
 * @fileoverview A class representing a document node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.DocumentB');



goog.require('xrx.node');
goog.require('xrx.nodeB');



/**
 * @param {!xrx.instance}
 * @constructor
 */
xrx.node.DocumentB = function(instance) {
  goog.base(this, xrx.node.DOCUMENT, instance);
};
goog.inherits(xrx.node.DocumentB, xrx.nodeB);
