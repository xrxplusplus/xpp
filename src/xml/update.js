/**
 * @fileoverview A class implementing low-level update operations 
 * on XML tokens.
 */

goog.provide('xrx.update');



goog.require('xrx.serialize');
goog.require('xrx.stream');
goog.require('xrx.token');



xrx.update = function() {};



/**
 * Shared function for all replace operations.
 * @private
 */
xrx.update.replace_ = function(instance, token, xml) {
  var diff = xml.length - token.length();

  instance.update(token.offset(), token.length(), xml);

  token.length(xml.length);

  return diff;
};



/**
 * Shared function for all insert operations.
 * @private
 */
xrx.update.insert_ = function(instance, offset, xml) {

  instance.update(offset, 0, xml);

  return xml.length;
};



/**
 * Shared function for all remove operations.
 * @private
 */
xrx.update.remove_ = function(instance, offset, length) {

  instance.update(offset, length, '');

  return -length;
};



/**
 * Wrap a piece of XML with a start-tag and a end-tag.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target1 The left not-tag token where the new
 * start-tag shall be inserted.
 * @param {!xrx.token.NotTag} target2 The right not-tag token where the
 * new end-tag shall be inserted.
 * @param {!integer} offset1 The offset relative to the left not-tag token.
 * @param {!integer} offset2 The offset relative to the right not-tag token.
 * @param {!string} localName The local name of the new token.
 * @param {!string} opt_namespaceUri The namespace URI of the new token.
 */
xrx.update.wrap = function(instance, target1, target2, offset1, offset2,
    localName, opt_namespaceUri) {
};



/**
 * Replaces a not-tag token with another not-tag token.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The token to be replaced.
 * @param {!string} string The new not-tag string. 
 */
xrx.update.replaceNotTag = function(instance, target, string) {
  var diff = xrx.update.replace_(instance, target, string);
};



xrx.update.replaceTagName = function(instance, token, localName, opt_namespaceUri) {
  //TODO: implement this
};



/**
 * Replaces the value of an attribute with another value.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.AttrValue} target The token to be replaced.
 * @param {!string} token The new value. 
 */
xrx.update.replaceAttrValue = function(instance, target, value) {
  var diff = xrx.update.replace_(instance, target, value);
};


/**
 * Inserts a new empty tag into a not-tag token.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The not-tag token where the empty tag is inserted.
 * @param {!integer} offset The offset relative to the not-tag token.
 * @param {!string} localName The local name of the new token.
 * @param {!string} opt_namespaceUri The namespace URI of the new token.
 */
xrx.update.insertEmptyTag = function(instance, target, offset, localName,
    opt_namespaceUri) {
  var diff;

  if (!opt_namespaceUri) {
    diff = xrx.update.insert_(instance, target.offset() + offset,
        xrx.serialize.emptyTag(localName));
  } else {
    var nsPrefix = instance.getIndex().getNamespacePrefix(target, opt_namespaceUri);

    diff = xrx.update.insert_(instance, target.offset() + offset,
        xrx.serialize.emptyTagNs(nsPrefix, localName, opt_namespaceUri));

    //TODO: add namespace declaration to index
  }
};



/**
 * Inserts a new start-end-tag into a not-tag token.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The not-tag token where the start-end-tag is inserted.
 * @param {!integer} offset The offset relative to the not-tag token.
 * @param {!string} localName The local name of the new token.
 * @param {!string} opt_namespaceUri The namespace URI of the new token.
 */
xrx.update.insertStartEndTag = function(instance, target, offset, localName,
    opt_namespaceUri) {
  var diff;

  if (!opt_namespaceUri) {
    diff = xrx.update.insert_(instance, target.offset() + offset,
        xrx.serialize.startTag(localName) + xrx.serialize.endTag(localName));
  } else {
    var nsPrefix = instance.getIndex().getNamespacePrefix(target, opt_namespaceUri);

    diff = xrx.update.insert_(instance, target.offset() + offset,
        xrx.serialize.startTagNs(nsPrefix, localName, opt_namespaceUri) +
            xrx.serialize.endTagNs(nsPrefix, localName, opt_namespaceUri));

    //TODO: add namespace declaration to index
  }
};



xrx.update.insertFragment = function(instance, target, offset, localName,
    opt_namespaceUri) {
  //TODO: implement this
};



xrx.update.insertMixed = function(instance, target, offset, localName,
    opt_namespaceUri) {
  //TODO: implement this
};



/**
 * Inserts a new attribute into a start-tag or a empty tag.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!(xrx.token.StartTag|xrx.token.EmptyTag)} target The tag where the attribute 
 * shall be inserted.
 * @param {!string} qName The qualified name of the new attribute.
 * @param {!string} opt_namespaceUri The namespace URI of the new attribute.
 */
xrx.update.insertAttribute = function(instance, parent, qName,
    opt_namespaceUri) {
  var diff;
  var loc = instance.getStream().tagName(parent.xml(instance.xml()));

  if (!opt_namespaceUri) {
    diff = xrx.update.insert_(instance, parent.offset() + loc.offset +
        loc.length, xrx.serialize.attribute(qName, ''));
  } else {
    var nsPrefix1 = instance.getIndex().getNamespacePrefix(parent, opt_namespaceUri);
    var nsPrefix2 = qName.split(':')[0];
    if (nsPrefix1 !== 'xmlns:' + nsPrefix2 && nsPrefix1 !== undefined &&
        nsPrefix1 !== 'xmlns') throw Error('Prefix ' + nsPrefix2 +
        ' is not bound to namespace ' + opt_namespaceUri + '.');

    diff = xrx.update.insert_(instance, parent.offset() + loc.offset +
        loc.length, xrx.serialize.attributeNs(nsPrefix1, qName, opt_namespaceUri));

    //TODO: add namespace declaration to index
  }
};



/**
 * Removes a empty tag.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.EmptyTag} target The tag to be removed.
 */
xrx.update.removeEmptyTag = function(instance, token) {
  var diff = xrx.update.remove_(instance, token.offset(), token.length());
};



/**
 * Removes a start-tag and a end-tag at once but keeping the content
 * between the two tags. 
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.EmptyTag} target The tag to be removed.
 */
xrx.update.removeStartEndTag = function(instance, token1, token2) {
};



/**
 * Removes a start-tag, a end-tag and the content between the two
 * tags. 
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.Fragment} target The tag to be removed.
 */
xrx.update.removeFragment = function(instance, token) {
  //TODO: implement this
};



/**
 * Removes a mixed set of nodes. 
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.Mixed} target The token to be removed.
 */
xrx.update.removeMixed = function(instance, token) {
  //TODO: implement this
};



/**
 * Removes a attribute token.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.Attribute} target The token to be removed.
 */
xrx.update.removeAttribute = function(instance, token) {
  var diff = xrx.update.remove_(instance, token.offset() - 1, token.length() + 1);
};
