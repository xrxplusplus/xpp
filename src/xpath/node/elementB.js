/**
 * @fileoverview A class representing a element node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.ElementB');



goog.require('xrx.node');
goog.require('xrx.node.Element');



/**
 * @constructor
 */
xrx.node.ElementB = function(instance, opt_token, opt_row) {
  goog.base(this, xrx.node.ELEMENT, opt_token, instance);



  this.row_ = opt_row;
};
goog.inherits(xrx.node.ElementB, xrx.node);




xrx.node.ElementB.prototype.getName = function() {
  var inst = this.instance_;
  var tag = inst.getIndex().getToken(this.token_);
  var loc = inst.getStream().tagName(tag.xml(inst.xml()));
  loc.offset += tag.offset();

  return loc.xml(inst.xml());
};



xrx.node.ElementB.prototype.getNamespaceUri = function(prefix) {
  var inst = this.instance_;
  var ns = inst.getIndex().getNamespace(this.token_, prefix);

  return ns.uri;
};
