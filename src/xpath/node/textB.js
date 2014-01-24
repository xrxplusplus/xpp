/**
 * @fileoverview A class representing a text node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.TextB');



goog.require('xrx.node');
goog.require('xrx.nodeB');
goog.require('xrx.node.DocumentB');
goog.require('xrx.node.ElementB');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



/**
 * Creates a binary text node.
 *
 * @param {!xrx.instance}
 * @param {!integer} 
 * @constructor
 */
xrx.node.TextB = function(instance, key) {
  goog.base(this, xrx.node.TEXT, instance, key);
};
goog.inherits(xrx.node.TextB, xrx.nodeB);



xrx.node.TextB.prototype.getToken = function() {
  // TODO: implement this.
  return undefined;
};




xrx.node.TextB.prototype.getLabel = function() {
  var label = this.getIndex().getLabel(this.key_);
  if (this.getRow().getType() === xrx.token.START_TAG) {
    label.push0();
  } else if (this.getRow().getType() === xrx.token.END_TAG) {
    var tmp = label.pop();
    label.push(tmp + .5);
  } else {};

  return label;
};



xrx.node.TextB.prototype.getOffset = function() {
  var row = this.getRow();

  return row.getOffset() + row.getLength1();
};



xrx.node.TextB.prototype.getLength = function() {
  var row = this.getRow();

  return row.getLength2() - row.getLength1();
};



xrx.node.TextB.prototype.isSameAs = function(node) {
  return this.getType() === node.getType() && 
      this.getLabel().sameAs(node.getLabel());
};



xrx.node.TextB.prototype.isBefore = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isBefore(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) &&
          this.getType() < node.getType() );
};



xrx.node.TextB.prototype.isAfter = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isAfter(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) &&
          this.getType() > node.getType() );
};



xrx.node.TextB.prototype.isAncestorOf = function(node) {
  return false;
};



xrx.node.TextB.prototype.isAttributeOf = function(node) {
  return false;
};



xrx.node.TextB.prototype.isChildOf = function(node) {
  return node.getType() === xrx.node.ELEMENT &&
      this.getLabel().isChildOf(node.getLabel());
};



xrx.node.TextB.prototype.isDescendantOf = function(node) {
  return ( node.getType() === xrx.node.ELEMENT || 
      node.getType() === xrx.node.DOCUMENT ) &&
          this.getLabel().isDescendantOf(node.getLabel());
};



xrx.node.TextB.prototype.isFollowingOf = function(node) {
  return this.isAfter(node) && !this.isDescendantOf(node);
};



xrx.node.TextB.prototype.isFollowingSiblingOf = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isFollowingSiblingOf(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) && 
          this.getType() > node.getType() );
};



xrx.node.TextB.prototype.isParentOf = function(node) {
  return false;
};



xrx.node.TextB.prototype.isPrecedingOf = function(node) {
  return this.isBefore(node) && !this.getLabel().isAncestorOf(node.getLabel());
};



xrx.node.TextB.prototype.isPrecedingSiblingOf = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isPrecedingSiblingOf(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) && 
          this.getType() < node.getType() );
};



xrx.node.TextB.prototype.getName = function() {
  return '';
};



xrx.node.TextB.prototype.getNamespaceUri = function(prefix) {
  return '';
};



xrx.node.TextB.prototype.getStringValue = function() {
  return this.instance_.xml().substr(this.getOffset(), this.getLength());
};



xrx.node.TextB.prototype.getXml = function() {
  return this.getStringValue();
};



xrx.node.TextB.prototype.getNodeAncestor = function(test) {
  var nodeset = this.find(test, xrx.node.TextB.prototype.isDescendantOf,
      true, new xrx.label());

  // TODO: not sure if this is correct?
  if (test.getName() === 'node') 
      nodeset.unshift(new xrx.node.DocumentB(this.instance_));
  return nodeset;
};



xrx.node.TextB.prototype.getNodeAttribute = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.TextB.prototype.getNodeChild = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.TextB.prototype.getNodeDescendant = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.TextB.prototype.getNodeFollowing = function(test) {

  return this.find(test, xrx.node.TextB.prototype.isPrecedingOf, false,
      new xrx.label());
};



xrx.node.TextB.prototype.getNodeFollowingSibling = function(test) {
  var stop = this.getIndex().getLabel(this.key_);
  stop.parent();

  return this.find(test, xrx.node.TextB.prototype.isPrecedingSiblingOf,
      false, stop);
};



xrx.node.TextB.prototype.getNodeParent = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  var element = new xrx.node.ElementB(this.instance_, this.key_);
  if (test.matches(element)) nodeset.add(element);

  return nodeset;
};



xrx.node.TextB.prototype.getNodePreceding = function(test) {
  var nodeset = this.find(test, xrx.node.TextB.prototype.isFollowingOf, true,
      new xrx.label());

  // TODO: not sure if this is correct?
  if (test.getName() === 'node') 
      nodeset.unshift(new xrx.node.DocumentB(this.instance_));

  return nodeset;
};



xrx.node.TextB.prototype.getNodePrecedingSibling = function(test) {
  var stop = this.getLabel();
  stop.parent();

  return this.find(test, xrx.node.TextB.prototype.isFollowingSiblingOf, true,
      stop);
};



/**
 * @param {!xrx.label}
 */
xrx.node.TextB.prototype.forward = function(stop) {
  var self = this;
  var index = this.instance_.getIndex();
  var iter = new xrx.index.Iter(index, this.key_);
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
xrx.node.TextB.prototype.backward = function(stop) {
  var self = this;
  var index = this.getIndex();
  var iter = new xrx.index.Iter(index, this.key_);
  var row = iter.getRow();
  var type;

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
xrx.node.TextB.prototype.find = function(test, axisTest, reverse, stop) {
  var self = this;
  var selfLabel = self.getLabel();
  var nodeset = new xrx.xpath.NodeSet();

  this.eventNode = function(node) {
    if (self.instance_ === node.getInstance() && axisTest.call(self, node) &&
        test.matches(node)) {
      console.log(node.getXml());
      reverse ? nodeset.unshift(node) : nodeset.add(node);
    }
  };
  
  reverse ? this.backward(stop) : this.forward(stop);
  return nodeset;
};

