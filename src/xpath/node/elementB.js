/**
 * @fileoverview A class representing a element node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.ElementB');


goog.require('xrx.node');
goog.require('xrx.node.Element');
goog.require('xrx.nodeB');



/**
 * @param {!xrx.instance}
 * @param {!integer} 
 * @constructor
 */
xrx.node.ElementB = function(instance, opt_row) {
  goog.base(this, xrx.node.ELEMENT, instance, opt_row);
};
goog.inherits(xrx.node.ElementB, xrx.nodeB);




xrx.node.ElementB.prototype.getName = function() {
  var inst = this.instance_;
  var tag = inst.getIndex().getToken(this.row_);
  var loc = inst.getStream().tagName(tag.xml(inst.xml()));
  loc.offset += tag.offset();

  return loc.xml(inst.xml());
};



xrx.node.ElementB.prototype.getNamespaceUri = function(prefix) {
  var inst = this.instance_;
  var ns = inst.getIndex().getNamespace(this.getToken(), prefix);

  return ns.uri;
};



xrx.node.ElementB.prototype.getNodeAncestor = function(test) {

  return this.find(test, xrx.label.prototype.isDescendantOf, true);
};
