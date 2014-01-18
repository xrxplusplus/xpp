/**
 * @fileoverview A class representing the element node of the
 * XDM interface.
 */

goog.provide('xrx.node.Element');



goog.require('goog.string');
goog.require('xrx.node');
goog.require('xrx.node.Attribute');
goog.require('xrx.pilot');
goog.require('xrx.stream');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



/** 
 * @constructor
 */
xrx.node.Element = function(token, instance) {
  goog.base(this, xrx.node.ELEMENT, token, instance);
};
goog.inherits(xrx.node.Element, xrx.node);



/**
 * return {!string}
 */
xrx.node.Element.getNameLocal = function(name) {
  return goog.string.contains(name, ':') ? 
      name.substr(name.indexOf(':') + 1) : name;
};



/**
 * return {!string}
 */
xrx.node.Element.getNamePrefix = function(name) {
  return goog.string.contains(name, ':') ? 
      'xmlns:' + name.substr(0, name.indexOf(':')) : 'xmlns';
};



/**
 * return {!string}
 */
xrx.node.Element.getNameExpanded = function(namespace, localName) {
  return namespace + '#' + localName;
};
