/**
 * @fileoverview A class implementing the text node
 * type for streaming XPath evaluation.
 */

goog.provide('xrx.node.TextS');


goog.require('xrx.node');
goog.require('xrx.nodeS');


xrx.node.TextS = function(instance, token) {
  goog.base(this, xrx.node.TEXT, instance, token);
};
goog.inherits(xrx.node.TextS, xrx.nodeS);
