/**
 * @fileoverview Class implements data instance component for 
 * the model-view-controller.
 */

goog.provide('xrx.instance');


goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.net.XhrIo');
goog.require('xrx.index');
goog.require('xrx.model');
goog.require('xrx.node');
goog.require('xrx.pilot');



/**
 * @constructor
 */
xrx.instance = function(element) {
  goog.base(this, element);



  this.xml_;



  this.recalculate();
};
goog.inherits(xrx.instance, xrx.model);



/**
 * 
 */
xrx.instance.prototype.getDataInline = function() {
  this.xml_ = goog.dom.getRawTextContent(this.getElement());
};



/**
 * 
 */
xrx.instance.prototype.getDataRemote = function() {
  var request = new goog.net.XhrIo();

  goog.events.listen(request, 'complete', function() {
    if(request.getResponseHeader('Content-Type') != 'text/plain') 
        throw Error('Expected content type is "text/plain."');
    this.xml_ = request.getResponseText();
  });

  request.send(this.getSrcUri(), 'GET');
};




/**
 * @override
 */
xrx.instance.prototype.recalculate = function() {
  this.getSrcUri() ? this.getDataRemote() : this.getDataInline();
};



/**
 * @return {!string} The XML instance as string.
 */
xrx.instance.prototype.xml = function(xml) {
  if (xml) this.xml_ = xml;
  return this.xml_;
};



/**
 * @return {!xrx.node.Document} The XML instance as node.
 */
xrx.instance.prototype.document = function(id) {
  var pilot = new xrx.pilot(this.xml());
  var node = new xrx.node.Document(pilot, this.getId());
  
  return node;
};



/**
 *
 */
xrx.instance.prototype.getIndex = function() {
  if (!this.index_) this.index_ = new xrx.index(this.xml_);

  return this.index_;
};
