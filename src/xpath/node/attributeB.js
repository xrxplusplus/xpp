/**
 * @fileoverview A class representing a attribute node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.AttributeB');


goog.require('xrx.node');
goog.require('xrx.nodeB');
goog.require('xrx.xpath.NodeSet');


/**
 * Creates a binary attribute node.
 *
 * @param {!integer}
 * @param {!xrx.node.ElementB}
 * @constructor
 */
xrx.node.AttributeB = function(num, parent) {
  goog.base(this, xrx.node.ATTRIBUTE);


  this.num_ = num;



  this.parent_ = parent;
};
goog.inherits(xrx.node.AttributeB, xrx.nodeB);



xrx.node.AttributeB.prototype.getStream = function() {
  return this.parent_.getInstance().getStream();
};



xrx.node.AttributeB.prototype.getInstance = function() {
  return this.parent_.getInstance();
};



xrx.node.AttributeB.prototype.getToken = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attribute(xml, this.num_);
  
  return new xrx.token.Attribute(this.getLabel(), loc.offset, loc.length);
};



xrx.node.AttributeB.prototype.getLabel = function() {
  var label = this.parent_.getLabel();
  label.push(this.num_);

  return label;
};



xrx.node.AttributeB.prototype.getOffset = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attribute(xml, this.num_);

  return loc.offset;
};



xrx.node.AttributeB.prototype.getLength = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attribute(xml, this.num_);

  return loc.length;
};



xrx.node.AttributeB.prototype.isSameAs = function(node) {
  return this.getType() === node.getType() && 
      this.getLabel().sameAs(node.getLabel());
};



xrx.node.AttributeB.prototype.isBefore = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isBefore(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) &&
          this.getType() < node.getType() );
};



xrx.node.AttributeB.prototype.isAfter = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isAfter(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) &&
          this.getType() > node.getType() );
};



xrx.node.AttributeB.prototype.isAncestorOf = function(node) {
  return false;
};



xrx.node.AttributeB.prototype.isAttributeOf = function(node) {
  return this.parent_.isSameAs(node);
};



xrx.node.AttributeB.prototype.isChildOf = function(node) {
  return false;
};



xrx.node.AttributeB.prototype.isDescendantOf = function(node) {
  return false;
};



xrx.node.AttributeB.prototype.isFollowingOf = function(node) {
  return false;
};



xrx.node.AttributeB.prototype.isFollowingSiblingOf = function(node) {
  return false;
};



xrx.node.AttributeB.prototype.isParentOf = function(node) {
  return false;
};



xrx.node.AttributeB.prototype.isPrecedingOf = function(node) {
  return false;
};



xrx.node.AttributeB.prototype.isPrecedingSiblingOf = function(node) {
  return false;
};



xrx.node.AttributeB.prototype.getName = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attrName(xml, this.num_);

  return loc.xml(xml);
};



xrx.node.AttributeB.prototype.getNamespaceUri = function(prefix) {
};



xrx.node.AttributeB.prototype.getStringValue = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attrValue(xml, this.num_);

  return loc.xml(xml);
};



xrx.node.AttributeB.prototype.getXml = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attribute(xml, this.num_);

  return loc.xml(xml);
};



xrx.node.AttributeB.prototype.getNodeAncestor = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  if (test.matches(this.parent_)) nodeset.add(this.parent_);
  nodeset.add(this.parent_.getNodeAncestor(test));

  // TODO: not sure if this is correct?
  if (test.getName() === 'node') 
      nodeset.unshift(new xrx.node.DocumentB(this.instance_));

  return nodeset;
};



xrx.node.AttributeB.prototype.getNodeAttribute = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.AttributeB.prototype.getNodeChild = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.AttributeB.prototype.getNodeDescendant = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.AttributeB.prototype.getNodeFollowing = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.AttributeB.prototype.getNodeFollowingSibling = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.AttributeB.prototype.getNodeParent = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  if (test.matches(this.parent_)) nodeset.add(this.parent_);

  return nodeset;
};



xrx.node.AttributeB.prototype.getNodePreceding = function(test) {
  return new xrx.xpath.NodeSet();
};



xrx.node.AttributeB.prototype.getNodePrecedingSibling = function(test) {
  return new xrx.xpath.NodeSet();
};



