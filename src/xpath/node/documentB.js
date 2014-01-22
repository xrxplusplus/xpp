/**
 * @fileoverview A class representing a document node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.DocumentB');



goog.require('xrx.index');
goog.require('xrx.label');
goog.require('xrx.node');
goog.require('xrx.nodeB');
goog.require('xrx.node.ElementB');
goog.require('xrx.node.TextB');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



/**
 * Creates a binary document node.
 *
 * @param {!xrx.instance}
 * @constructor
 */
xrx.node.DocumentB = function(instance) {
  goog.base(this, xrx.node.DOCUMENT, instance);
};
goog.inherits(xrx.node.DocumentB, xrx.nodeB);



xrx.node.DocumentB.prototype.getToken = function() {
  // TODO: implement this.
  return undefined;
};



xrx.node.DocumentB.prototype.getLabel = function() {
  return new xrx.label();
};



xrx.node.DocumentB.prototype.getOffset = function() {
  return 0;
};



xrx.node.DocumentB.prototype.getLength = function() {
  // TODO: implement this.
  return undefined;
};



xrx.node.DocumentB.prototype.isSameAs = function(node) {
  return node.getType() === xrx.node.DOCUMENT;
};



xrx.node.DocumentB.prototype.isBefore = function(node) {
  return true;
};



xrx.node.DocumentB.prototype.isAfter = function(node) {
  return false;
};



xrx.node.DocumentB.prototype.isAncestorOf = function(node) {
  return true;
};



xrx.node.DocumentB.prototype.isAttributeOf = function(node) {
  return false;
};



xrx.node.DocumentB.prototype.isChildOf = function(node) {
 return false;
};



xrx.node.DocumentB.prototype.isDescendantOf = function(node) {
  return false;
};



xrx.node.DocumentB.prototype.isFollowingOf = function(node) {
  return false;
};



xrx.node.DocumentB.prototype.isFollowingSiblingOf = function(node) {
  return false;
};



xrx.node.DocumentB.prototype.isParentOf = function(node) {
  return node.getKey() === 0;
};



xrx.node.DocumentB.prototype.isPrecedingOf = function(node) {
  return false;
};



xrx.node.DocumentB.prototype.isPrecedingSiblingOf = function(node) {
  return false;
};



xrx.node.DocumentB.prototype.getName = function() {
  return '';
};



xrx.node.DocumentB.prototype.getNamespaceUri = function(prefix) {
  return '';
};



xrx.node.DocumentB.prototype.getStringValue = function() {
  var string = '';
  var xml = this.instance_.xml();
  var row;

  for(var key = 0; key <= this.getIndex().last(); key++) {
    row = this.getIndex().getRow(key);
    string += xml.substr(row.getOffset() + row.getLength1(),
        row.getLength2() - row.getLength1());
  };

  return string;
};



xrx.node.DocumentB.prototype.getXml = function() {
  return this.instance_.xml();
};



xrx.node.DocumentB.prototype.getNodeAncestor = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.DocumentB.prototype.getNodeAttribute = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.DocumentB.prototype.getNodeChild = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  var element = new xrx.node.ElementB(this.instance_, 0);

  if (test.matches(element)) nodeset.add(element);

  return nodeset;
};



xrx.node.DocumentB.prototype.getNodeDescendant = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  var iter = new xrx.index.Iter(this.getIndex());
  var row = iter.getRow();
  var element;
  var text;

  do {

    if (row.getType() !== xrx.token.END_TAG) {
      element = new xrx.node.ElementB(this.instance_, iter.getPos());
      if (test.matches(element)) {
        nodeset.add(element);
      }
    }

    if (row.getLength1() !== row.getLength2()) {
      text = new xrx.node.TextB(this.instance_, iter.getPos());
      if (test.matches(text)) {
        nodeset.add(text);
      }
    }
 
  } while(row = iter.next());

  return nodeset;
};



xrx.node.DocumentB.prototype.getNodeFollowing = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.DocumentB.prototype.getNodeFollowingSibling = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.DocumentB.prototype.getNodeParent = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.DocumentB.prototype.getNodePreceding = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.DocumentB.prototype.getNodePrecedingSibling = function(test) {
  return new xrx.xpath.NodeSet();
};



/**
 * @private
 */
xrx.node.DocumentB.prototype.find = function(test, axisTest, reverse, stop) {
  var self = this;
  var selfLabel = self.getLabel();
  var nodeset = new xrx.xpath.NodeSet();

  this.eventNode = function(node) {

    if (self.instance_ === node.getInstance() && axisTest.call(self, node) &&
        test.matches(node)) {
      nodeset.add(node);
    }
  };
  
  this.forward(stop);
  return nodeset;
};

