/**
 * @fileoverview A class to stream over the tokens of
 * a XML instance.
 */

goog.provide('xrx.stream');



goog.require('goog.string');
goog.require('xrx.location');
goog.require('xrx.reader');
goog.require('xrx.token');



/**
 * A class to stream over the tokens of a XML instance.
 *   
 * @param {!string} xml A well-formed, normalized XML document or
 * XML fragment. Make sure that the input is parsed with
 * @constructor
 */
xrx.stream = function(xml) {



  /**
   * @type
   * @private
   */
  this.reader_ = new xrx.reader(xml);
  
  

  /**
   * Whether the stream is stopped.
   * @type {boolean}
   * @private
   */
  this.stopped_ = false;



  /**
   * @private
   */
  this.features_ = {
    TAG_NAME: false,
    ATTRIBUTE: false,
    ATTR_NAME: false,
    ATTR_VALUE: false,
    NAMESPACE: false,
    NS_PREFIX: false,
    NS_URI: false
  }


  /**
   * Whether at least one feature is on.
   * @private
   */
  this.oneFeatureOn_ = false;
};



/**
 * Event, thrown whenever a start-tag row is found.
 */
xrx.stream.prototype.rowStartTag = goog.abstractMethod;



/**
 * Event, thrown whenever a end-tag row is found.
 */
xrx.stream.prototype.rowEndTag = goog.abstractMethod;



/**
 * Event, thrown whenever a empty-tag row is found.
 */
xrx.stream.prototype.rowEmptyTag = goog.abstractMethod;



/**
 * Event, thrown whenever a tag-name is found.
 */
xrx.stream.prototype.eventTagName = goog.abstractMethod;



/**
 * Event, thrown whenever a attribute token is found.
 */
xrx.stream.prototype.eventAttribute = goog.abstractMethod;



/**
 * Event, thrown whenever a attribute name is found.
 */
xrx.stream.prototype.eventAttrName = goog.abstractMethod;



/**
 * Event, thrown whenever a attribute value is found.
 */
xrx.stream.prototype.eventAttrValue = goog.abstractMethod;



/**
 * Event, thrown whenever a namespace token is found.
 */
xrx.stream.prototype.eventNamespace = goog.abstractMethod;



/**
 * Event, thrown whenever a namespace prefix is found.
 */
xrx.stream.prototype.eventNsPrefix = goog.abstractMethod;



/**
 * Event, thrown whenever a namespace URI is found.
 */
xrx.stream.prototype.eventNsUri = goog.abstractMethod;



/**
 * Function to turn events on and off.
 * 
 * @param {!string} feature The name of the feature.
 * @param {!boolean} flag On or off.
 */
xrx.stream.prototype.setFeature = function(feature, flag) {
  if (this.features_[feature] === undefined) throw Error('Unknown feature.');
  var on = false;

  this.features_[feature] = flag || true;

  for(var f in this.features_) {
    if (this.features_[f] === true) on = true;
  };
  this.oneFeatureOn_ = on;
};



/**
 * Convenience function to turn all events on or off.
 * 
 * @param {!boolean} flag On or off.
 */
xrx.stream.prototype.setFeatures = function(flag) {
  
  for(var f in this.features_) {
    this.features_[f] = flag;
  }
  flag === true ? this.oneFeatureOn_ = true :
    this.oneFeatureOn_ = false;
};


/**
 * Whether a specific feature is turned on or off.
 * 
 * @param {!string} feature The feature to test.
 * @return {!boolean} True when on otherwise false.
 */
xrx.stream.prototype.hasFeature = function(feature) {
  return this.features_[feature] === true;
};



/**
 * Enumeration of internal states used by the streamer.
 * @enum
 * @private
 */
xrx.stream.State_ = {
  XML_START: 1,
  XML_END: 2,
  START_TAG: 3,
  END_TAG: 4,
  EMPTY_TAG: 5,
  NOT_TAG: 6,
  LT_SEEN: 7,
  GT_SEEN: 8,
  WS_SEEN: 9,
  TAG_START: 10,
  TAG_NAME: 11,
  TOK_END: 12,
  ATTR_NAME: 13,
  ATTR_VAL: 14
};



/**
 * Returns or sets the content of the current stream reader.
 * 
 * @param opt_xml Well-formed, normalized UTF-8 XML string.
 * @return The content of the stream reader.
 */
xrx.stream.prototype.xml = function(opt_xml) {
  
  return !opt_xml ? this.reader_.input() : this.reader_.input(opt_xml);
};



/**
 * Updates the XML stream at a given location.
 * 
 * @param {!number} offset The offset.
 * @param {!number} length Number of characters to replace.
 * @param {!string} xml The new string.
 */
xrx.stream.prototype.update = function(offset, length, xml) {
  
  this.reader_.input(this.xml().substr(0, offset) + xml + 
      this.xml().substr(offset + length));
};



/**
 * Can be called to stop streaming.
 */
xrx.stream.prototype.stop = function() {

  this.stopped_ = true;
};



/**
 * Returns or sets the position of the stream reader.
 * 
 * @param opt_pos The position.
 * @return {!number} The position or the new position.
 */
xrx.stream.prototype.pos = function(opt_pos) {
  if (opt_pos) this.reader_.set(opt_pos);
  return this.reader_.pos();
};



/**
 * Throws events for the secondary tokens of a tag for the features
 * is turned on.
 * TODO(jochen): can we avoid reparsing of tokens?
 *
 * @param token The current token.
 * @param {!number} offset The current offset.
 * @param {!number} length The current length.
 */
xrx.stream.prototype.features = function(token, offset, length) {
  var stream = this;

  if (stream.oneFeatureOn_ === true) {
    var tag = stream.xml().substr(offset, length);

    // tag name feature on?
    if (stream.hasFeature('TAG_NAME')) {
      var name = stream.tagName(tag);
      stream.eventTagName(name.offset + offset, name.length);
    }

    // attribute or namespace feature on?
    if (stream.hasFeature('NAMESPACE') || stream.hasFeature('ATTRIBUTE') ||
        stream.hasFeature('ATTR_NAME') || stream.hasFeature('ATTR_VALUE') ||
        stream.hasFeature('NS_PREFIX') || stream.hasFeature('NS_URI')) {

      if ((token === xrx.token.START_TAG || token === xrx.token.EMPTY_TAG)) {
        var atts = stream.secondaries(tag);
        for (var pos in atts) {
          var att = atts[pos];
          if (goog.string.startsWith(att.xml(tag), 'xmlns:') ||
              goog.string.startsWith(att.xml(tag), 'xmlns=')) {

            if (stream.hasFeature('NAMESPACE')) {
              stream.eventNamespace(att.offset + offset, att.length);
            }

            // namespace prefix feature on?
            if (stream.hasFeature('NS_PREFIX')) {
              var nsPrefix = stream.attr_(tag, 1, xrx.token.ATTR_NAME, att.offset);
              stream.eventNsPrefix(nsPrefix.offset + offset, nsPrefix.length);
            }

            // namespace uri feature on?
            if (stream.hasFeature('NS_URI')) {
              var nsUri = stream.attr_(tag, 1, xrx.token.ATTR_VALUE, att.offset);
              stream.eventNsUri(nsUri.offset + offset, nsUri.length);
            }

          } else {

            if (stream.hasFeature('ATTRIBUTE')) {
              stream.eventAttribute(att.offset + offset, att.length);
            }

            // attribute name feature on?
            if (stream.hasFeature('ATTR_NAME')) {
              var attrName = stream.attr_(tag, 1, xrx.token.ATTR_NAME, att.offset);
              stream.eventAttrName(attrName.offset + offset, attrName.length);
            }

            // attribute value feature on?
            if (stream.hasFeature('ATTR_VALUE')) {
              var attrValue = stream.attr_(tag, 1, xrx.token.ATTR_VALUE, att.offset);
              stream.eventAttrValue(attrValue.offset + offset, attrValue.length);
            }
          }
        }
      }
    }
  }
};



/**
 * Streams over a XML document or XML fragment in forward direction
 * and fires start-row, end-row, empty row and namespace events. 
 * The streaming starts at the beginning of the XML document / 
 * fragment by default or optionally at an offset.
 * 
 * @param {?number} opt_offset The offset.
 */
xrx.stream.prototype.forward = function(opt_offset) {
  var state = xrx.stream.State_.XML_START;
  var token;
  var offset;
  var length;
  var reader = this.reader_;

  !opt_offset ? reader.first() : reader.set(opt_offset);
  this.stopped_ = false;

  for (;;) {

    switch (state) {
    // start parsing
    case xrx.stream.State_.XML_START:
      reader.get() === '<' ? state = xrx.stream.State_.LT_SEEN :
          state = xrx.stream.State_.NOT_TAG;
      break;
    // end parsing
    case xrx.stream.State_.XML_END:
      break;
    // parse start tag or empty tag
    case xrx.stream.State_.START_TAG:
      offset = reader.pos();
      reader.forwardInclusive('>');
      state = xrx.stream.State_.NOT_TAG;
      reader.peek(-2) === '/' ? token = xrx.token.EMPTY_TAG : 
          token = xrx.token.START_TAG;
      length = reader.pos() - offset;
      break;
    // parse end tag
    case xrx.stream.State_.END_TAG:
      offset = reader.pos();
      reader.forwardInclusive('>');
      state = xrx.stream.State_.NOT_TAG;
      token = xrx.token.END_TAG;
      length = reader.pos() - offset;
      break;
    // empty tag (never used)
    case xrx.stream.State_.EMPTY_TAG:
      break;
    // parse token that is not a tag
    case xrx.stream.State_.NOT_TAG:
      if (!reader.get()) {
        state = xrx.stream.State_.XML_END;
      } else if (reader.peek() === '<') {
        state = xrx.stream.State_.LT_SEEN;
      } else {
        reader.forwardExclusive('<');
        state = xrx.stream.State_.LT_SEEN;
      }
      // if we have parsed the not-tag, the row is complete.
      switch(token) {
      case xrx.token.START_TAG:
        this.rowStartTag(offset, length, reader.pos() - offset);
        break;
      case xrx.token.END_TAG:
        this.rowEndTag(offset, length, reader.pos() - offset);
        break;
      case xrx.token.EMPTY_TAG:
        this.rowEmptyTag(offset, length, reader.pos() - offset);
        break;
      default:
        break;
      };
      this.features(token, offset, length);
      break;
    // '<' seen: start tag or empty tag or end tag?
    case xrx.stream.State_.LT_SEEN:
      if (reader.peek(1) === '/') {
        state = xrx.stream.State_.END_TAG;
      } else {
        state = xrx.stream.State_.START_TAG;
      }
      break;
    default:
      throw Error('Invalid parser state.');
      break;
    }

    if (state === xrx.stream.State_.XML_END || this.stopped_) {
      this.stopped_ = false;
      break;
    }
  }
};



/**
 * Streams over a XML document or XML fragment in backward direction
 * and fires start-row, end-row, empty row and namespace events. The 
 * streaming starts at the end of the XML document / fragment by 
 * default or optionally at an offset.
 * TODO(jochen): do we need length2 in backward streaming events?
 * 
 * @param {?number} opt_offset The offset.
 */
xrx.stream.prototype.backward = function(opt_offset) {
  var state = xrx.stream.State_.XML_START;
  var reader = this.reader_;
  var token;
  var offset;
  var length;

  !opt_offset ? reader.last() : reader.set(opt_offset);
  this.stopped_ = false;

  for (;;) {

    switch (state) {
    // start parsing
    case xrx.stream.State_.XML_START:
      if (reader.get() === '<') reader.previous();
      reader.get() === '>' ? state = xrx.stream.State_.GT_SEEN : 
          state = xrx.stream.State_.NOT_TAG;
      break;
    // end parsing
    case xrx.stream.State_.XML_END:
      break;
    // start tag (never used)
    case xrx.stream.State_.START_TAG:
      break;
    // parse end tag or start tag
    case xrx.stream.State_.END_TAG:
      offset = reader.pos();
      reader.backwardInclusive('<');
      state = xrx.stream.State_.NOT_TAG;
      if (reader.peek(1) !== '/') {
        var off = reader.pos();
        var len1 = offset - reader.pos() + 1;
        this.rowStartTag(off, len1);
        this.features(xrx.token.START_TAG, off, len1);
      } else {
        this.rowEndTag(reader.pos(), offset - reader.pos() + 1);
        this.features(xrx.token.END_TAG, reader.pos(), offset - reader.pos() + 1);
      }
      reader.previous();
      if (reader.finished()) state = xrx.stream.State_.XML_END;
      break;
    // parse empty tag
    case xrx.stream.State_.EMPTY_TAG:
      offset = reader.pos();
      reader.backwardInclusive('<');
      state = xrx.stream.State_.NOT_TAG;
      var off = reader.pos();
      var len1 = offset - reader.pos() + 1;
      this.rowEmptyTag(off, len1);
      this.features(xrx.token.EMPTY_TAG, off, len1);
      reader.previous();
      if (reader.finished()) state = xrx.stream.State_.XML_END;
      break;
    // parse token that is not a tag
    case xrx.stream.State_.NOT_TAG:
      if (reader.get() === '>') {
        state = xrx.stream.State_.GT_SEEN;
      } else {
        offset = reader.pos();
        reader.backwardExclusive('>');
        //this.tokenNotTag.call(this, reader.pos(), offset - reader.pos() + 1);
        reader.previous();
        state = xrx.stream.State_.GT_SEEN;
      }
      if (reader.finished()) state = xrx.stream.State_.XML_END;
      break;
    // '>' seen: end tag or start tag or empty tag?
    case xrx.stream.State_.GT_SEEN:
      if (reader.peek(-1) === '/') {
        state = xrx.stream.State_.EMPTY_TAG;
      } else {
        state = xrx.stream.State_.END_TAG;
      }
      break;
    default:
      throw Error('Invalid parser state.');
      break;
    }

    if (state === xrx.stream.State_.XML_END || this.stopped_) {
      this.stopped_ = false;
      break;
    }
  }
};



/**
 * Streams over a start-tag, a empty tag or an end-tag and
 * returns the location of the name of the tag.
 * 
 * @param {!string} xml The tag.
 * @param {?xrx.reader} opt_reader Optional reader object.
 * @return {!xrx.location} The tag-name.
 */
xrx.stream.prototype.tagName = function(xml, opt_reader) {
  var state = xrx.stream.State_.TAG_START;
  var offset;
  var length;
  var reader = opt_reader || new xrx.reader(xml);

  this.stopped_ = false;
  
  for (;;) {
    
    switch(state) {
    case xrx.stream.State_.TAG_START:
      if (reader.next() !== '<') {
        throw Error('< is expected.');
      } else {
        state = xrx.stream.State_.TAG_NAME;
        reader.get() === '/' ? reader.next() : null;
        offset = reader.pos();
      }
      break;
    case xrx.stream.State_.TAG_NAME:
      if (reader.next().match(/( |\/|>)/g)) {
        state = xrx.stream.State_.TOK_END;
        reader.backward();
        length = reader.pos() - offset - 1;
      }
      break;
    default:
      throw Error('Invalid parser state.');
      break;
    }
    
    if (state === xrx.stream.State_.TOK_END) break; 
  }

  return new xrx.location(offset, length);
};



/**
 * Streams over a start-tag or a empty tag and returns the location
 * of the n'th attribute, or null if the attribute does not exist.
 * 
 * @param {!string} xml The start-tag or empty tag.
 * @param {!number} pos The attribute position.
 * @return {string|null} The attribute at position n or null.
 */
xrx.stream.prototype.attribute = function(xml, pos, opt_offset) {
  return this.attr_(xml, pos, xrx.token.ATTRIBUTE, opt_offset);
};



/**
 * Streams over a start-tag or a empty tag and returns an array of 
 * locations of all attributes found in the tag.
 * 
 * @param {!string} xml The start-tag or empty tag.
 * @return {Array.<xrx.location>} The location array.
 */
xrx.stream.prototype.attributes = function(xml) {
  var locs = {};
  var location = new xrx.location();

  for(var i = 1;;i++) {
    var newLocation = this.attribute(xml, i, location.offset + location.length);
    if (!newLocation) break;
    
    if(newLocation.xml(xml).match(/^xmlns(:|=)/) === null) locs[i] = newLocation;
  }

  return locs;
};



/**
 * Streams over a start-tag or a empty tag and returns an array of 
 * locations of all namespaces found in the tag.
 * 
 * @param {!string} xml The start-tag or empty tag.
 * @return {Array.<xrx.location>} The location array.
 */
xrx.stream.prototype.namespaces = function(xml) {
  var locs = {};
  var location = new xrx.location();

  for(var i = 1;;i++) {
    var newLocation = this.attribute(xml, i, location.offset + location.length);
    if (!newLocation) break;
    
    if(newLocation.xml(xml).match(/^xmlns(:|=)/) !== null) locs[i] = newLocation;
  }

  return locs;
};



/**
 * Streams over a start-tag or a empty tag and returns an array of 
 * locations of all attributes and namespaces found in the tag.
 * 
 * @param {!string} xml The start-tag or empty tag.
 * @return {Array.<xrx.location>} The location array.
 */
xrx.stream.prototype.secondaries = function(xml) {
  var locs = {};
  var location = new xrx.location();

  for(var i = 1;;i++) {
    var newLocation = this.attribute(xml, i, location.offset + location.length);
    if (!newLocation) break;
    
    locs[i] = newLocation;
  }

  return locs;
};



/**
 * Streams over a start-tag or empty tag and returns the location
 * of the name of the n'th attribute.
 * 
 * @param {!string} xml The tag.
 * @param {!number} pos The attribute position.
 * @return {!string} The attribute name.
 */
xrx.stream.prototype.attrName = function(xml, pos) {
  return this.attr_(xml, pos, xrx.token.ATTR_NAME);
};



/**
 * Streams over a start-tag or empty tag and returns the location 
 * of the value of the n'th attribute.
 * 
 * @param {!string} xml The attribute.
 * @param {!number} pos The attribute position.
 * @return {!xrx.location} The attribute value location.
 */
xrx.stream.prototype.attrValue = function(xml, pos) {
  return this.attr_(xml, pos, xrx.token.ATTR_VALUE);
};


/**
 * Shared utility function for attributes.
 * 
 * @private
 */
xrx.stream.prototype.attr_ = function(xml, pos, tokenType, opt_offset, opt_reader) {
  var reader = opt_reader || new xrx.reader(xml);
  if (opt_offset) reader.set(opt_offset);
  this.stopped_ = false;
  
  var location = !opt_offset ? this.tagName(xml, reader) : new xrx.location();
  // tag does not contain any attributes ? => return null
  if (reader.peek(-1).match(/(\/|>)/g)) return null; 

  var state = xrx.stream.State_.ATTR_NAME;
  var offset = reader.pos();
  var length;
  var found = 0;
  var quote;

  
  for (;;) {

    switch(state) {
    case xrx.stream.State_.ATTR_NAME:
      found += 1;
      tokenType === xrx.token.ATTRIBUTE || tokenType === xrx.token.ATTR_NAME ? 
          offset = reader.pos() : null;
      reader.forwardInclusive('=');
      if (tokenType === xrx.token.ATTR_NAME && found === pos) {
        location.offset = offset;
        location.length = reader.pos() - offset - 1;
        state = xrx.stream.State_.TOK_END;
      } else {
        quote = reader.next();
        tokenType === xrx.token.ATTR_VALUE ? offset = reader.pos() : null;
        state = xrx.stream.State_.ATTR_VAL;
      }
      break;
    case xrx.stream.State_.ATTR_VAL:
      reader.forwardInclusive(quote);
      if(found === pos) {
        location.offset = offset;
        if (tokenType === xrx.token.ATTRIBUTE) {
          location.length = reader.pos() - offset;
        } else if (tokenType === xrx.token.ATTR_VALUE) {
          location.length = reader.pos() - offset - 1;
        } else {}
        state = xrx.stream.State_.TOK_END;
      } else {
        reader.next();
        if(!reader.peek(-1).match(/(\/|>)/g)) {
          state = xrx.stream.State_.ATTR_NAME;
        } else {
          state = xrx.stream.State_.TOK_END;
          location = null;
        }
      }
      break;
    default:
      throw Error('Invalid parser state.');
      break;
    }
    
    if (state === xrx.stream.State_.TOK_END) break;
  }
  return location;
};



/**
 * Streams over some XML content and returns the location of 
 * one or more comments.
 */
xrx.stream.prototype.comment = function(xml) {
  // TODO(jochen)
};



/**
 * Streams over some XML content and returns the location of 
 * one or more processing instructions (PI).
 * 
 * @param xml XML string.
 */
xrx.stream.prototype.pi = function(xml) {
  // TODO(jochen)
};



/**
 * Streams over some XML content and returns the location of
 * one or more character data (CDATA) sections.
 * 
 * @param xml XML string.
 */
xrx.stream.prototype.cdata = function(xml) {
  // TODO(jochen)
};



/**
 * Streams over some XML content and returns the location of
 * one or more document type declarations.
 * 
 * @param xml XML string.
 */
xrx.stream.prototype.doctypedecl = function(xml) {
  // TODO(jochen)
};
