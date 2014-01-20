/**
 * @fileoverview A class representing a element node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.ElementB');


goog.require('xrx.label');
goog.require('xrx.node');
goog.require('xrx.node.DocumentB');
goog.require('xrx.node.Element');
goog.require('xrx.node.TextB');
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




xrx.nodeB.prototype.getToken = function() {
  return this.instance_.getIndex().getToken(this.row_);
};




xrx.nodeB.prototype.getLabel = function() {
  return this.instance_.getIndex().getLabel(this.row_);
};




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

  return ns ? ns.uri : '';
};



xrx.node.ElementB.prototype.getNodeAncestor = function(test) {
  var nodeset = this.find(test, xrx.label.prototype.isDescendantOf,
      true, new xrx.label());

  if (test.getName() === 'node') 
      nodeset.unshift(new xrx.node.DocumentB(this.instance_));
  return nodeset;
};



xrx.node.ElementB.prototype.getNodeChild = function(test) {

  return this.find(test, xrx.label.prototype.isParentOf, false,
      new xrx.label(this.getIndex().getLabel(this.row_)));
};



xrx.node.ElementB.prototype.getNodeDescendant = function(test) {

  return this.find(test, xrx.label.prototype.isAncestorOf, false,
      new xrx.label(this.getIndex().getLabel(this.row_)));
};



xrx.node.ElementB.prototype.getNodeFollowing = function(test) {

  return this.find(test, xrx.label.prototype.isPrecedingOf, false,
      new xrx.label());
};



/**
 * @param {!xrx.label}
 */
xrx.node.ElementB.prototype.forward = function(stop) {
  var self = this;
  var index = this.instance_.getIndex();
  var iter = new xrx.index.Iter(index, this.row_);
  var row = iter.getRow();
  var type;

  do {
    type = row.getType();

    switch(type) {
    case xrx.token.START_TAG:
      self.eventNode(new xrx.node.ElementB(self.instance_, iter.getPos()));
      break;
    case xrx.token.EMPTY_TAG:
      self.eventNode(new xrx.node.ElementB(self.instance_, iter.getPos()));
      break;
    default:
      break;
    };

    if (row.getLength1() !== row.getLength2()) {
      self.eventNode(new xrx.node.TextB(self.instance_, iter.getPos()));
    }

    if (type === xrx.token.END_TAG &&
        self.getIndex().getLabel(iter.getPos()).sameAs(stop)) break;

  } while (row = iter.next());
};



/**
 * @param {!xrx.label}
 */
xrx.node.ElementB.prototype.backward = function(stop) {
  var self = this;
  var index = this.getIndex();
  var iter = new xrx.index.Iter(index, this.row_);
  var row = iter.getRow();

  do {
    type = row.getType();

    if (row.getLength1() !== row.getLength2()) {
      self.eventNode(new xrx.node.TextB(self.instance_, iter.getPos()));
    }

    switch(type) {
    case xrx.token.START_TAG:
      self.eventNode(new xrx.node.ElementB(self.instance_, iter.getPos()));
      break;
    case xrx.token.EMPTY_TAG:
      self.eventNode(new xrx.node.ElementB(self.instance_, iter.getPos()));
      break;
    default:
      break;
    };

    if (type === xrx.token.END_TAG &&
        self.getIndex().getLabel(iter.getPos()).sameAs(stop)) break;

  } while (row = iter.previous());
};



/**
 * @private
 */
xrx.node.ElementB.prototype.find = function(test, axisTest, reverse, stop) {
  var self = this;
  var selfLabel = self.getLabel();
  var nodeset = new xrx.xpath.NodeSet();

  this.eventNode = function(node) {

    if (axisTest.call(selfLabel, node.getLabel()) && test.matches(node)) {
      reverse ? nodeset.unshift(node) : nodeset.add(node);
    }
  };
  
  reverse ? this.backward(stop) : this.forward(stop);
  return nodeset;
};
