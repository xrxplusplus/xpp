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
  this.locator = new Locator2Impl();
  this.contentHandler.setDocumentLocator(this.locator);
  this.saxParser = XMLReaderFactory.createXMLReader();
  this.saxParser.setHandler(this.contentHandler);
};



xrx.parse.prototype.normalize = function(xml) {
  var self = this;
  var loc = this.contentHandler.locator;
  var elements = [];
  var namespaces = [];
  var normalized = '';

  this.contentHandler.characters = function(ch, start, length) {
    normalized += ch;
  };

  this.contentHandler.endDocument = function() {

  };

  this.contentHandler.endElement = function(uri, localName, qName) {
    var locc = elements.pop();
    (loc.getLineNumber() === locc.l && loc.getColumnNumber() === locc.c) ?
        normalized = normalized.slice(0, -1) + '/>' : 
            normalized += xrx.serialize.endTag(qName);
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
    var n = "";
    var a = "";
    var arr = atts.attsArray;

    elements.push({ l: loc.getLineNumber(), c: loc.getColumnNumber() });
    for (var nn in namespaces) {
      n += xrx.serialize.namespace(namespaces[nn].prefix, namespaces[nn].uri);
    };
    for (var aa in atts.attsArray) {
      a += xrx.serialize.attribute(arr[aa].qName, arr[aa].value);
    };

    normalized += xrx.serialize.startTag(qName, n, a);
  };

  this.contentHandler.startPrefixMapping = function(prefix, uri) {
    namespaces.push({ prefix: prefix, uri: uri });
  };

  this.saxParser.parseString(xml);

  return normalized;
};
