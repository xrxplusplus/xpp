/**
 * @fileoverview A function module for XML token and XML
 * document serialization.
 */

goog.provide('xrx.serialize');



goog.require('xrx.stream');
goog.require('xrx.token');



/**
 * Function module for XML serializazion.
 */
xrx.serialize = {};



/**
 * Serialize a attribute token.
 * @return {string} The attribute token string.
 */
xrx.serialize.attribute = function(qName, value) {
  return ' ' + qName + '="' + value.replace(/\"/g, "'") + '"';
};



/**
 * Serialize a attribute token with namespace.
 * @return {string} The attribute token string.
 */
xrx.serialize.attributeNs = function(nsPrefix, qName, namespaceUri) {

  if (nsPrefix === undefined || nsPrefix === "xmlns") {

    return xrx.serialize.namespace('xmlns:' + qName.split(':')[0], namespaceUri) +
        xrx.serialize.attribute(qName, '');
  } else {

    return xrx.serialize.attribute(qName, '');
  }
};



/**
 * Shared function for tag serialization.
 * @private
 * @return {string} The tag string.
 */
xrx.serialize.tagNs_ = function(func, nsPrefix, localName, namespaceUri) {

  if (nsPrefix === undefined) {

    return func(localName, xrx.serialize.namespace('xmlns',
        namespaceUri));
  } else if (nsPrefix === 'xmlns') {

    return func(localName);
  } else {
    var colonIndex = nsPrefix.indexOf(':');

    return func(nsPrefix.substr(colonIndex + 1) + ':' + localName);
  }
};



/**
 * Serialize a start-tag token.
 * @return {string} The start-tag token string.
 */
xrx.serialize.startTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes + '>';
};



/**
 * Serialize a start-tag token with namespace.
 * @return {string} The start-tag token string.
 */
xrx.serialize.startTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.serialize.tagNs_(xrx.serialize.startTag, nsPrefix, localName,
      namespaceUri);
};



/**
 * Serialize a end-tag token.
 * @return {string} The end-tag token string.
 */
xrx.serialize.endTag = function(qName) {
  return '</' + qName + '>';
};



/**
 * Serialize a end-tag token with namespace.
 * @return {string} The end-tag token string.
 */
xrx.serialize.endTagNs = function(nsPrefix, localName, namespaceUri) {

  if (nsPrefix === undefined || nsPrefix === 'xmlns') {

    return xrx.serialize.endTag(localName);
  } else {
    var colonIndex = nsPrefix.indexOf(':');

    return xrx.serialize.endTag(nsPrefix.substr(colonIndex + 1) + ':' + localName);
  }
};



/**
 *
 */
xrx.serialize.startEmptyTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes;
};



/**
 * Serialize a empty-tag token.
 * @return {string} The empty-tag token string.
 */
xrx.serialize.emptyTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes + '/>';
};



/**
 * Serialize a empty-tag token with namespace.
 * @return {string} The empty-tag token string.
 */
xrx.serialize.emptyTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.serialize.tagNs_(xrx.serialize.emptyTag, nsPrefix, localName,
      namespaceUri);
};



/**
 * Serialize a namespace token.
 * @return {string} The namespace token string.
 */
xrx.serialize.namespace = function(prefix, uri) {
  return ' ' + prefix + '="' + uri + '"';
};



/**
 * Serialize a XML document with indentation.
 * @return {string} The indented XML document.
 */
xrx.serialize.indent = function(xml, indent) {
  var stream = new xrx.stream(xml);
  var level = 0;
  var lastRow = xrx.token.UNDEFINED;
  var lastToken = xrx.token.UNDEFINED;
  var output = '';
  
  var newLine = function(offset, length1, length2) {
    for(var i = 0, ind = level * indent; i < ind; i++) {
      output += ' ';
    }
    output += stream.xml().substr(offset, length1);
    if (length1 !== length2) {
      output += stream.xml().substr(offset + length1, length2 - length1);
    }
  };
  
  stream.rowStartTag = function(offset, length1, length2) {
    if (lastRow === xrx.token.START_TAG) level += 1;
    if (lastToken === xrx.token.START_TAG || lastToken === xrx.token.EMPTY_TAG) output += '\n';
    newLine(offset, length1, length2);
    lastRow = xrx.token.START_TAG;
    length1 !== length2 ? lastToken = xrx.token.NOT_TAG : 
        lastToken = xrx.token.START_TAG;
  };
  
  stream.rowEmptyTag = function(offset, length1, length2) {
    if(lastRow === xrx.token.START_TAG) level += 1;
    newLine(offset, length1, length2);
    lastRow = xrx.token.END_TAG;
    length1 !== length2 ? lastToken = xrx.token.NOT_TAG : 
      lastToken = xrx.token.EMPTY_TAG;
  };
  
  stream.rowEndTag = function(offset, length1, length2) {
    if (lastRow !== xrx.token.START_TAG) level -= 1;
    output += stream.xml().substr(offset, length1);
    if (level !== 0) output += '\n';
    lastRow = xrx.token.END_TAG;
    length1 !== length2 ? lastToken = xrx.token.NOT_TAG : 
      lastToken = xrx.token.END_TAG;
  };
  
  stream.forward();
  
  return output;
};

