/**
 * @fileoverview A class for XML token serialization.
 */

goog.provide('xrx.serialize');



goog.require('xrx.stream');
goog.require('xrx.token');



/**
 *
 */
xrx.serialize = {};



/**
 *
 */
xrx.serialize.attribute = function(qName, value) {
  return ' ' + qName + '="' + value.replace(/\"/g, "'") + '"';
};



/**
 *
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
 * @private
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
 *
 */
xrx.serialize.startTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes + '>';
};



/**
 *
 */
xrx.serialize.startTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.serialize.tagNs_(xrx.serialize.startTag, nsPrefix, localName,
      namespaceUri);
};



/**
 *
 */
xrx.serialize.endTag = function(qName) {
  return '</' + qName + '>';
};



/**
 *
 */
xrx.serialize.endTagNs = function(nsPrefix, localName, namespaceUri) {
  var prefix = !nsPrefix ? 'xmlns' : nsPrefix;
  return xrx.serialize.tagNs_(xrx.serialize.endTag, prefix, localName,
      namespaceUri);
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
 * 
 */
xrx.serialize.emptyTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes + '/>';
};



/**
 *
 */
xrx.serialize.emptyTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.serialize.tagNs_(xrx.serialize.emptyTag, nsPrefix, localName,
      namespaceUri);
};



/**
 *
 */
xrx.serialize.namespace = function(prefix, uri) {
  return ' ' + prefix + '="' + uri + '"';
};



/**
 *
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
