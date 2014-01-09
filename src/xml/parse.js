/**
 * @fileoverview A class to parse and normalize 
 * stringified XML documents.
 */

goog.provide('xrx.parse');



goog.require('xrx.serialize');



/**
 * A class to parse and normalize stringified XML
 * documents
 */
xrx.parse = function() {



  this.contentHandler;



  this.saxParser;



  this.initSax();
};



xrx.parse.prototype.initSax = function() {

  this.contentHandler = new DefaultHandler2();
  this.saxParser = XMLReaderFactory.createXMLReader();
  this.saxParser.setHandler(this.contentHandler);
};



xrx.parse.prototype.normalize = function(xml) {
  var normalized = '';

  this.contentHandler.characters = function(ch, start, length) {
    normalized += ch;
  };

  this.contentHandler.endDocument = function() {

  };

  this.contentHandler.endElement = function(uri, localName, qName) {
    normalized += xrx.serialize.startTag(qName);
  };

  this.contentHandler.endPrefixMapping = function(prefix) {

  };

  this.contentHandler.ignorableWhitespace = function(ch, start, length) {

  };

  this.contentHandler.processingInstruction = function(target, data) {

  };

  this.contentHandler.skippedEntity = function(name) {

  };

  this.contentHandler.startDocument = function() {

  };

  this.contentHandler.startElement = function(uri, localName, qName, atts) {
    if(normalized === '') console.log(atts);
    normalized += xrx.serialize.startTag(qName);
  };

  this.contentHandler.startPrefixMapping = function(prefix, uri) {

  };

  this.saxParser.parseString(xml);

  return normalized;
};
