/**
 * @fileoverview A node implementation for binary XPath 
 * evaluation.
 */

goog.provide('xrx.nodeB');


goog.require('xrx.node');
goog.require('xrx.node.ElementB');
goog.require('xrx.xpath.NodeSet');



/**
 * @constructor
 */
xrx.nodeB = function(type, instance, row) {
  goog.base(this, type, null, instance);



  this.row_ = row;
};
goog.inherits(xrx.nodeB, xrx.node);




xrx.nodeB.prototype.getToken = function() {
  return this.instance_.getIndex().getToken(this.row_);
};



xrx.nodeB.prototype.backward = function() {
  var index = this.instance_.getIndex();

  index.rowStartTag = function() {
    
  };

  index.rowEmptyTag = function() {
    
  };

  index.rowEndTag = function() {
    
  };

  index.forward();
};



/**
 * @private
 */
xrx.nodeB.prototype.find = function(test, axisTest, reverse) {
  var nodeset = new xrx.xpath.NodeSet();
  var instance = this.instance_;
  var elmnt;

  this.nodeElement = function(token) {
    elmnt = new xrx.node.ElementB(token, instance);
    if (axisTest.call(this.label(), token.label()) && test.matches(elmnt)) {
      reverse ? nodeset.unshift(elmnt) : nodeset.add(elmnt);
    }
  };

  this.nodeText = function(token) {
    var txt = new xrx.node.TextB(token, elmnt, instance);
    if (axisTest.call(this.label(), token.label()) && test.matches(txt)) {
      reverse ? nodeset.unshift(txt) : nodeset.add(txt);
    }
  };
  
  reverse ? this.backward() : this.forward();
  return nodeset;
};