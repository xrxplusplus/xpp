/**
 * @fileoverview A class representing a element node
 * implementation working on a streaming XML model.
 */

goog.provide('xrx.node.ElementS');



goog.require('xrx.node');
goog.require('xrx.node.Element');
goog.require('xrx.node.TextS');
goog.require('xrx.nodeS');
goog.require('xrx.token');
goog.require('xrx.token.StartTag');
goog.require('xrx.token.EmptyTag');
goog.require('xrx.token.EndTag');
goog.require('xrx.token.NotTag');
goog.require('xrx.xpath.NodeSet');



/**
 * Creates a streaming element node.
 *
 * @param {!xrx.instance}
 * @param {!xrx.token} 
 * @constructor
 */
xrx.node.ElementS = function(instance, token) {
  goog.base(this, xrx.node.ELEMENT, instance, token);

};
goog.inherits(xrx.node.ElementS, xrx.nodeS);



/**
 * 
 */
xrx.node.ElementS.prototype.getLabel = function() {
  return this.token_.label();
};



/**
 * 
 */
xrx.node.ElementS.prototype.getOffset = function() {
  return this.token_.offset();
};



/**
 * 
 */
xrx.node.ElementS.prototype.getLength = function() {
  return this.token_.length();
};



/**
 *
 */
xrx.node.ElementS.prototype.isSameAs = xrx.node.Element.prototype.isSameAs;



/**
 *
 */
xrx.node.ElementS.prototype.isBefore = xrx.node.Element.prototype.isBefore;



/**
 *
 */
xrx.node.ElementS.prototype.isAfter = xrx.node.Element.prototype.isAfter;



/**
 *
 */
xrx.node.ElementS.prototype.isAncestorOf = xrx.node.Element.prototype.isAncestorOf;



/**
 *
 */
xrx.node.ElementS.prototype.isAttributeOf = xrx.node.Element.prototype.isAttributeOf;



/**
 *
 */
xrx.node.ElementS.prototype.isChildOf = xrx.node.Element.prototype.isChildOf;



/**
 *
 */
xrx.node.ElementS.prototype.isDescendantOf = xrx.node.Element.prototype.isDescendantOf;



/**
 *
 */
xrx.node.ElementS.prototype.isFollowingOf = xrx.node.Element.prototype.isFollowingOf;



/**
 *
 */
xrx.node.ElementS.prototype.isFollowingSiblingOf = xrx.node.Element.prototype.isFollowingSiblingOf;



/**
 *
 */
xrx.node.ElementS.prototype.isParentOf = xrx.node.Element.prototype.isParentOf;



/**
 *
 */
xrx.node.ElementS.prototype.isPrecedingOf = xrx.node.Element.prototype.isPrecedingOf;



/**
 *
 */
xrx.node.ElementS.prototype.isPrecedingSiblingOf = xrx.node.Element.prototype.isPrecedingSiblingOf;



/**
 *
 */
xrx.node.ElementS.prototype.getName = function() {
  var xml = this.getInstance().xml();
  var loc = this.getInstance().getStream().tagName(
      this.getToken().xml(xml));
  loc.offset += this.getToken().offset();

  return loc.xml(xml);
};



/**
 *
 */
xrx.node.ElementS.prototype.getNamespaceUri = function(prefix) {
  var inst = this.instance_;
  var ns = inst.getIndex().getNamespace(this.getToken(), prefix);

  return ns ? ns.uri : '';
};



xrx.node.ElementS.prototype.getStringValue = function() {
  var xml = this.instance_.xml();
  var traverse = new xrx.traverse(xml);
  var string = '';
  var self = this;

  traverse.rowStartTag = function(label, offset, length1, length2) {
    string += xml.substr(offset + length1, length2 - length1);
  };

  traverse.rowEmptyTag = function(label, offset, length1, length2) {
    string += xml.substr(offset + length1, length2 - length1);
  };

  traverse.rowEndTag = function(label, offset, length1, length2) {
    var stop = self.getLabel().sameAs(label);
    if (!stop) string += xml.substr(offset + length1, length2 - length1);
    if (stop) traverse.stop();
  };

  traverse.forward(this.getLabel().clone(), this.getOffset());

  return string;
};



xrx.node.ElementS.prototype.getXml = function() {
  if (this.getToken().type() === xrx.token.EMPTY_TAG) return '';

  var pilot = new xrx.pilot(this.instance_.xml());
  var target = new xrx.token.EndTag(this.getLabel().clone());
  var endTag = pilot.location(this.getToken(), target);

  return this.instance_.xml().substring(this.getToken().offset(),
      endTag.offset() + endTag.length());
};



/**
 * 
 */
xrx.node.ElementS.prototype.getNodeAncestor = xrx.node.Element.prototype.getNodeAncestor;



/**
 * 
 */
xrx.node.ElementS.prototype.getNodeAttribute = function(test) {
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



/**
 * 
 */
xrx.node.ElementS.prototype.getNodeChild = xrx.node.Element.prototype.getNodeChild;



/**
 * 
 */
xrx.node.ElementS.prototype.getNodeDescendant = xrx.node.Element.prototype.getNodeDescendant;



/**
 * 
 */
xrx.node.ElementS.prototype.getNodeFollowing = xrx.node.Element.prototype.getNodeFollowing;



/**
 * 
 */
xrx.node.ElementS.prototype.getNodeFollowingSibling = xrx.node.Element.prototype.getNodeFollowingSibling;



/**
 * 
 */
xrx.node.ElementS.prototype.getNodeParent = xrx.node.Element.prototype.getNodeParent;



/**
 * 
 */
xrx.node.ElementS.prototype.getNodePreceding = xrx.node.Element.prototype.getNodePreceding;



/**
 * 
 */
xrx.node.ElementS.prototype.getNodePrecedingSibling = xrx.node.Element.prototype.getNodePrecedingSibling;



/**
 * @param {!xrx.label}
 */
xrx.node.ElementS.prototype.forward = function(stop) {
  var self = this;
  var traverse = new xrx.traverse(this.instance_.xml());
  var token;

  traverse.rowStartTag = function(label, offset, length1, length2) {
    console.log(label.toString());
    console.log(self.instance_.xml().substr(offset, length1));
    self.eventNode(new xrx.node.ElementS(self.instance_, 
        new xrx.token.StartTag(label.clone(), offset, length1)));
  };

  traverse.rowEmptyTag = function(label, offset, length1, length2) {
    console.log(label.toString());
    console.log(self.instance_.xml().substr(offset, length1));
    self.eventNode(new xrx.node.ElementS(self.instance_, 
        new xrx.token.EmptyTag(label.clone(), offset, length1)));
  };

  traverse.rowEndTag = function(label, offset, length1, length2) {
    console.log(label.toString());
    console.log(self.instance_.xml().substr(offset, length1));
    //if (self.getLabel().sameAs(stop)) traverse.stop();
  };

  traverse.forward(self.getLabel().clone(), self.getOffset());
};



/**
 *
 */
xrx.node.ElementS.prototype.backward = function(stop) {
  var self = this;
  var traverse = new xrx.traverse(this.instance_.xml());
  var token;

  traverse.rowStartTag = function(label, offset, length1, length2) {
    console.log(label.toString());
    console.log(self.instance_.xml().substr(offset, length1));
    self.eventNode(new xrx.node.ElementS(self.instance_, 
        new xrx.token.StartTag(label.clone(), offset, length1)));
  };

  traverse.rowEmptyTag = function(label, offset, length1, length2) {
    console.log(label.toString());
    console.log(self.instance_.xml().substr(offset, length1));
    self.eventNode(new xrx.node.ElementS(self.instance_, 
        new xrx.token.EmptyTag(label.clone(), offset, length1)));
  };

  traverse.rowEndTag = function(label, offset, length1, length2) {
    console.log(label.toString());
    console.log(self.instance_.xml().substr(offset, length1));
    //if (self.getLabel().sameAs(stop)) traverse.stop();
  };

  traverse.backward(self.getLabel().clone(), self.getOffset());
};



/**
 * 
 */
xrx.node.ElementS.prototype.find = xrx.node.Element.prototype.find;

