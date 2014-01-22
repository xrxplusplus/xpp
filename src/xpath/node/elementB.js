/**
 * @fileoverview A class representing a element node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.ElementB');


goog.require('xrx.label');
goog.require('xrx.node');
goog.require('xrx.node.AttributeB');
goog.require('xrx.node.DocumentB');
goog.require('xrx.node.Element');
goog.require('xrx.node.TextB');
goog.require('xrx.nodeB');
goog.require('xrx.token');
goog.require('xrx.token.EndTag');
goog.require('xrx.xpath.NodeSet');



/**
 * Creates a binary element node.
 *
 * @param {!xrx.instance}
 * @param {!integer} 
 * @constructor
 */
xrx.node.ElementB = function(instance, opt_key) {
  goog.base(this, xrx.node.ELEMENT, instance, opt_key);
};
goog.inherits(xrx.node.ElementB, xrx.nodeB);



xrx.node.ElementB.prototype.getToken = function() {
  return this.getIndex().getToken(this.key_);
};



xrx.node.ElementB.prototype.getLabel = function() {
  return this.getIndex().getLabel(this.key_);
};



xrx.node.ElementB.prototype.getOffset = function() {
  return this.getRow().getOffset();
};



xrx.node.ElementB.prototype.getLength = function() {
  return this.getRow().getLength1();
};



xrx.node.ElementB.prototype.isSameAs = function(node) {
  return this.getType() === node.getType() && 
      this.getLabel().sameAs(node.getLabel());
};



xrx.node.ElementB.prototype.isBefore = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isBefore(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) &&
          this.getType() < node.getType() );
};



xrx.node.ElementB.prototype.isAfter = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isAfter(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) &&
          this.getType() > node.getType() );
};



xrx.node.ElementB.prototype.isAncestorOf = function(node) {
  return this.getLabel().isAncestorOf(node.getLabel());
};



xrx.node.ElementB.prototype.isAttributeOf = function(node) {
  return false;
};



xrx.node.ElementB.prototype.isChildOf = function(node) {
  return this.getLabel().isChildOf(node.getLabel());
};



xrx.node.ElementB.prototype.isDescendantOf = function(node) {
  return this.getLabel().isDescendantOf(node.getLabel());
};



xrx.node.ElementB.prototype.isFollowingOf = function(node) {
  return this.isAfter(node) && !this.getLabel().isDescendantOf(node.getLabel());
};



xrx.node.ElementB.prototype.isFollowingSiblingOf = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isFollowingSiblingOf(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) && 
          this.getType() > node.getType() )
};



xrx.node.ElementB.prototype.isParentOf = function(node) {
  return this.getLabel().isParentOf(node.getLabel());
};



xrx.node.ElementB.prototype.isPrecedingOf = function(node) {
  return this.isBefore(node) && !this.getLabel().isAncestorOf(node.getLabel());
};



xrx.nodeB.prototype.isPrecedingSiblingOf = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isPrecedingSiblingOf(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) && 
          this.getType() < node.getType() )
};




xrx.node.ElementB.prototype.getName = function() {
  var inst = this.instance_;
  var tag = inst.getIndex().getToken(this.key_);
  var loc = inst.getStream().tagName(tag.xml(inst.xml()));
  loc.offset += tag.offset();

  return loc.xml(inst.xml());
};



xrx.node.ElementB.prototype.getNamespaceUri = function(prefix) {
  var inst = this.instance_;
  var ns = inst.getIndex().getNamespace(this.getToken(), prefix);

  return ns ? ns.uri : '';
};



xrx.node.ElementB.prototype.getStringValue = function() {
  if (this.getRow().getType() === xrx.token.EMPTY_TAG) return '';

  var string = '';
  var xml = this.instance_.xml();
  var row;
  var selfLabel = this.getLabel();

  for(var key = this.getKey(); key <= this.getIndex().last(); key++) {
    row = this.getIndex().getRow(key);
    if (row.getType() === xrx.token.END_TAG && 
        this.getIndex().getLabel(key).sameAs(selfLabel)) break;
    string += xml.substr(row.getOffset() + row.getLength1(),
        row.getLength2() - row.getLength1());
  };

  return string;
};



xrx.node.ElementB.prototype.getXml = function() {

  if (this.getRow().getType() === xrx.token.EMPTY_TAG) {

    return this.instance_.xml().substr(this.getOffset(), this.getLength());
  } else {
    var row = this.getIndex().getRowByToken(new xrx.token.EndTag(
        this.getLabel()), this.getKey(), false);

    return this.instance_.xml().substring(this.getOffset(), row.getOffset() +
        row.getLength1());
  }
};



xrx.node.ElementB.prototype.getNodeAncestor = function(test) {
  var nodeset = this.find(test, xrx.node.ElementB.prototype.isDescendantOf,
      true, new xrx.label());

  // TODO: not sure if this is correct?
  if (test.getName() === 'node') 
      nodeset.unshift(new xrx.node.DocumentB(this.instance_));
  return nodeset;
};



xrx.node.ElementB.prototype.getNodeAttribute = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  var row = this.getRow();
  var xml = this.instance_.xml().substr(row.getOffset(), row.getLength2());
  var locs = this.instance_.getStream().attributes(xml);
  var i = 0;

  for(var l in locs) {
    var a = locs[l];
    if(a.xml(xml).match(/^xmlns(:|=)/) === null) 
        nodeset.add(new xrx.node.AttributeB(l, this));
  };

  return nodeset;
};



xrx.node.ElementB.prototype.getNodeChild = function(test) {

  return this.find(test, xrx.node.ElementB.prototype.isParentOf, false,
      this.getIndex().getLabel(this.key_));
};



xrx.node.ElementB.prototype.getNodeDescendant = function(test) {

  return this.find(test, xrx.node.ElementB.prototype.isAncestorOf, false,
      this.getIndex().getLabel(this.key_));
};



xrx.node.ElementB.prototype.getNodeFollowing = function(test) {

  return this.find(test, xrx.node.ElementB.prototype.isPrecedingOf, false,
      new xrx.label());
};



xrx.node.ElementB.prototype.getNodeFollowingSibling = function(test) {
  var stop = this.getIndex().getLabel(this.key_);
  stop.parent();

  return this.find(test, xrx.node.ElementB.prototype.isPrecedingSiblingOf,
      false, stop);
};



xrx.node.ElementB.prototype.getNodeParent = function(test) {
  var stop = this.getLabel();
  stop.parent();

  return this.find(test, xrx.node.ElementB.prototype.isChildOf, true, stop);
};



xrx.node.ElementB.prototype.getNodePreceding = function(test) {
  var nodeset = this.find(test, xrx.node.ElementB.prototype.isFollowingOf, true,
      new xrx.label());

  // TODO: not sure if this is correct?
  if (test.getName() === 'node') 
      nodeset.unshift(new xrx.node.DocumentB(this.instance_));

  return nodeset;
};



xrx.node.ElementB.prototype.getNodePrecedingSibling = function(test) {
  var stop = this.getLabel();
  stop.parent();

  return this.find(test, xrx.node.ElementB.prototype.isFollowingSiblingOf, true,
      stop);
};



/**
 * @param {!xrx.label}
 */
xrx.node.ElementB.prototype.forward = function(stop) {
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
xrx.node.ElementB.prototype.backward = function(stop) {
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
xrx.node.ElementB.prototype.find = function(test, axisTest, reverse, stop) {
  var self = this;
  var selfLabel = self.getLabel();
  var nodeset = new xrx.xpath.NodeSet();

  this.eventNode = function(node) {

    if (self.instance_ === node.getInstance() && axisTest.call(self, node) &&
        test.matches(node)) {
      reverse ? nodeset.unshift(node) : nodeset.add(node);
    }
  };
  
  reverse ? this.backward(stop) : this.forward(stop);
  return nodeset;
};

