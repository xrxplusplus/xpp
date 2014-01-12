/**
 * @fileoverview A class to stream over the labels of
 * a XML instance.
 */

goog.provide('xrx.tree');


goog.require('xrx.stream');
goog.require('xrx.label');



/**
 * A class to stream over the labels of a XML instance.
 */
xrx.tree = function(xml) {



  this.stream_ = new xrx.stream(xml);
};



/**
 * 
 */
xrx.tree.prototype.stream = function() {
  return this.stream_;
};



/**
 * Event, thrown whenever a start-tag row is found.
 */
xrx.tree.prototype.rowStartTag = goog.abstractMethod;



/**
 * Event, thrown whenever a empty-tag row is found.
 */
xrx.tree.prototype.rowEmptyTag = goog.abstractMethod;



/**
 * Event, thrown whenever a end-tag row is found.
 */
xrx.tree.prototype.rowEndTag = goog.abstractMethod;



/**
 * Event, thrown whenever a tag-name is found.
 */
xrx.tree.prototype.eventTagName = goog.abstractMethod;



/**
 * Event, thrown whenever a attribute token is found.
 */
xrx.tree.prototype.eventAttribute = goog.abstractMethod;



/**
 * Event, thrown whenever a attribute name is found.
 */
xrx.tree.prototype.eventAttrName = goog.abstractMethod;



/**
 * Event, thrown whenever a attribute value is found.
 */
xrx.tree.prototype.eventAttrValue = goog.abstractMethod;



/**
 * Event, thrown whenever a namespace token is found.
 */
xrx.tree.prototype.eventNamespace = goog.abstractMethod;



/**
 * Event, thrown whenever a namespace prefix is found.
 */
xrx.tree.prototype.eventNsPrefix = goog.abstractMethod;



/**
 * Event, thrown whenever a namespace URI is found.
 */
xrx.tree.prototype.eventNsUri = goog.abstractMethod;




/**
 * Function to turn events on and off.
 * 
 * @param {!string} feature The name of the feature.
 * @param {!boolean} flag On or off.
 */
xrx.tree.prototype.setFeature = function(feature, flag) {
  this.stream_.setFeature(feature, flag);
};


/**
 * Whether a specific feature is turned on or off.
 * 
 * @param {!string} feature The feature to test.
 * @return {!boolean} True when on otherwise false.
 */
xrx.tree.prototype.hasFeature = function(feature) {
  return this.stream_.hasFeature(feature);
};



/**
 * Convenience function to turn all events on or off.
 * 
 * @param {!boolean} flag On or off.
 */
xrx.tree.prototype.setFeatures = function(flag) {
  this.stream_.setFeatures(flag);
};



/**
 * Stream over the labels of a XML instance in forward direction.
 */
xrx.tree.prototype.forward = function(offset) {
  var tree = this;
  var label = new xrx.label();
  var attrLabel = new xrx.label();
  var nsLabel = new xrx.label();
  var lastTag;

  if (offset) { this.stream_.pos(offset); }
  
  var secondaryLabel = function(label, primaryLabel) {

    if (label.isRoot()) {
      label = primaryLabel.clone();
      label.child();
    } else {
      label.nextSibling();
    }
    return label;
  };

  this.stream_.rowStartTag = function(offset, length1, length2) {
    !lastTag || lastTag === xrx.token.START_TAG ? label.child() : label.nextSibling();
    tree.rowStartTag(label.clone(), offset, length1, length2);
    lastTag = xrx.token.START_TAG;
    attrLabel = new xrx.label();
    nsLabel = new xrx.label();
  };

  this.stream_.rowEmptyTag = function(offset, length1, length2) {
    !lastTag || lastTag === xrx.token.START_TAG ? label.child() : label.nextSibling();
    tree.rowEmptyTag(label.clone(), offset, length1, length2);
    lastTag = xrx.token.END_TAG;
    attrLabel = new xrx.label();
    nsLabel = new xrx.label();
  };

  this.stream_.rowEndTag = function(offset, length1, length2) {
    if (lastTag !== xrx.token.START_TAG) label.parent();
    tree.rowEndTag(label.clone(), offset, length1, length2);
    lastTag = xrx.token.END_TAG;
  };

  this.stream_.eventTagName = function(offset, length) {
    tree.eventTagName(label.clone(), offset, length);
  };

  this.stream_.eventAttribute = function(offset, length) {
    attrLabel = secondaryLabel(attrLabel, label);
    tree.eventAttribute(attrLabel, offset, length);
  };

  this.stream_.eventAttrName = function(offset, length) {
    if (!tree.hasFeature('ATTRIBUTE')) attrLabel = secondaryLabel(attrLabel, label);
    tree.eventAttrName(attrLabel, offset, length);
  };

  this.stream_.eventAttrValue = function(offset, length) {
    if (!tree.hasFeature('ATTRIBUTE') && !tree.hasFeature('ATTR_NAME')) 
        attrLabel = secondaryLabel(attrLabel, label);
    tree.eventAttrValue(attrLabel, offset, length);
  };
  
  this.stream_.eventNamespace = function(offset, length) {
    nsLabel = secondaryLabel(nsLabel, label);
    tree.eventNamespace(nsLabel, offset, length);
  };
  
  this.stream_.eventNsPrefix = function(offset, length) {
    if (!tree.hasFeature('NAMESPACE')) nsLabel = secondaryLabel(nsLabel, label);
    tree.eventNsPrefix(nsLabel, offset, length);
  };
  
  this.stream_.eventNsUri = function(offset, length) {
    if (!tree.hasFeature('NAMESPACE') && !tree.hasFeature('NS_PREFIX')) 
      nsLabel = secondaryLabel(nsLabel, label);
    tree.eventNsUri(nsLabel, offset, length);
  };
  
  this.stream_.forward();
};



/**
 * Stream over the labels of a XML instance in backward direction.
 */
xrx.tree.prototype.backward = function() {
  
};