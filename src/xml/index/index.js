/**
 * @fileoverview A class to create long-lived binary
 * encodings for XML instances. 
 */


goog.provide('xrx.index');
goog.provide('xrx.index.Namespace');



goog.require('goog.array');
goog.require('goog.math.Long');
goog.require('xrx.index.row');
goog.require('xrx.label');
goog.require('xrx.token');
goog.require('xrx.traverse');



/**
 * A class to create long-lived binary encodings for
 * XML instances.
 * @param {string} The XML string to be indexed.
 * @constructor
 */
xrx.index = function(xml) {

  /**
   * The indexed XML rows.
   * @type {Array.<xrx.index.row>}
   */
  this.rows_ = [];

  /**
   * Current position of row iteration.
   * @type {integer}
   */
  this.iterKey = 0;

  /**
   * Indexed namespace table.
   * @type {Array.<xrx.index.Namespace>}
   */
  this.tNamespace_ = [];



  this.build(xml);
};



/**
 * Returns the number of rows of the index.
 * @return {integer}
 */
xrx.index.prototype.getLength = function() {
  return this.rows_.length;
};



/**
 * Returns the last key of the index.
 * @return {integer}
 */
xrx.index.prototype.last = function() {
  return this.getLength() - 1;
};



/**
 * 
 */
xrx.index.prototype.getKeyByToken = function(token) {
  var key;
  var row;

  for(key = 0; key <= this.last(); key++) {
    row = this.rows_[key];

    if (token.typeOf(row.getType()) && 
        this.getLabel(key).sameAs(token.label())) break;
  }

  return key;
};



/**
 * 
 */
xrx.index.prototype.getRow = function(key) {
  return this.rows_[key];
};



/**
 * 
 */
xrx.index.prototype.getRowByToken = function(token, opt_start, opt_reverse) {
  var row;

  if (opt_reverse) {
    var pos = opt_start || this.last();

    for(pos; pos >= 0; pos--){
      row = this.rows_[pos];

      if (row.getType() === token.type() && 
          this.getLabel(pos).sameAs(token.label())) break;
    }
  } else {
    var pos = opt_start || 0;

    for(pos; pos <= this.last(); pos++) {
      row = this.rows_[pos];

      if (row.getType() === token.type() && 
          this.getLabel(pos).sameAs(token.label())) break;
    }

  }

  return row;
};



/**
 * Sets the iterator key at a position.
 * @param {integer} key The key.
 */
xrx.index.prototype.iterSetKey = function(key) {



  this.iterKey_ = key || 0;
};



/**
 * Returns the current iterator key.
 * @return {integer} The key.
 */
xrx.index.prototype.iterGetKey = function() {

  return this.iterKey_;
};



/**
 * Returns the current row at which the iterator is placed.
 * @return {xrx.index.row} The row.
 */
xrx.index.prototype.iterGetRow = function() {
  return this.getRow(this.iterKey_);
};



/**
 * Iterates to the next row and returns the row.
 * @return {xrx.index.row} The row.
 */
xrx.index.prototype.iterNext = function() {

  return this.getRow(++this.iterKey_);
};



/**
 * Iterates to the previous row and returns the row.
 * @return {xrx.index.row} The row.
 */
xrx.index.prototype.iterPrevious = function() {

  return this.getRow(--this.iterKey_);
};



/**
 * A namespace object. Namespace tokens as the only XML tokens
 * are statically extracted during index building.
 *
 * @param {xrx.label} opt_label The label of the namespace token.
 * @param {string} opt_prefix The namespace prefix.
 * @param {string} opt_uri The namespace URI.
 */
xrx.index.Namespace = function(opt_label, opt_prefix, opt_uri) {



  this.label = opt_label;



  this.parentLabel;



  this.prefix = opt_prefix;



  this.uri = opt_uri;
};



/**
 * @return {xrx.index.Namespace|undefined}
 */
xrx.index.prototype.getNamespace = function(token, prefix) {

  return goog.array.findRight(this.tNamespace_, function(ns, ind, arr) {
    return ns.prefix === prefix && (token.label().sameAs(ns.parentLabel) ||
        token.label().isDescendantOf(ns.parentLabel));
  });
};



/**
 * @return {string|undefined}
 */
xrx.index.prototype.getNamespaceUri = function(token, prefix) {

  var namespace = goog.array.findRight(this.tNamespace_, function(ns, ind, arr) {
    return ns.prefix === prefix && (token.label().sameAs(ns.parentLabel) ||
        token.label().isDescendantOf(ns.parentLabel));
  });
  
  return namespace ? namespace.uri : undefined;
};



/**
 * @return {string|undefined}
 */
xrx.index.prototype.getNamespacePrefix = function(token, uri) {

  var namespace = goog.array.findRight(this.tNamespace_, function(ns, ind, arr) {
    return ns.uri === uri && (token.label().sameAs(ns.parentLabel) ||
        token.label().isDescendantOf(ns.parentLabel));
  });

  return namespace ? namespace.prefix : undefined;
};



xrx.index.replaceNotTag = function(token, diff) {
  var parentLabel = token.label().clone();
  parentLabel.parent();
  var parent = new xrx.token.StartEmptyTag(parentLabel);
  var key = this.getKeyByToken(parent);
  var row = this.getRow(key);

  this.iterSetKey(key);
  row.setLength2(row.getLength2() + diff);
  this.rows_[key] = goog.object.clone(row);

  xrx.rebuild.offset(index, key, diff);
};



/**
 * Builds the index.
 * @param {!string} The XML instance as string.
 */
xrx.index.prototype.build = function(xml) {
  var traverse = new xrx.traverse(xml);
  var row;
  var index = this;
  var parent;
  var labelBuffer = {};

  traverse.setFeature('NS_PREFIX', true);
  traverse.setFeature('NS_URI', true);
  
  var update = function(row, type, label, offset, length1, length2) {
    parent = label.clone();
    parent.parent();

    row.setType(type);
    row.setPosition(label.last());
    row.setParent(labelBuffer[parent.toString()]);
    row.setOffset(offset);
    row.setLength1(length1);
    row.setLength2(length2);
  };

  traverse.rowStartTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.START_TAG, label, offset, length1, length2);
    labelBuffer[label.toString()] = index.last();
  };

  traverse.rowEmptyTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.EMPTY_TAG, label, offset, length1, length2);
  };

  traverse.rowEndTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.END_TAG, label, offset, length1, length2);
    delete labelBuffer[label.toString()];
  };

  traverse.eventNsPrefix = function(label, offset, length) {
    var ns = new xrx.index.Namespace(label.clone(), xml.substr(offset, length));
    var parent = label.clone();
    parent.parent();
    ns.parentLabel = parent;
    index.tNamespace_.push(ns);
  };

  traverse.eventNsUri = function(label, offset, length) {
    index.tNamespace_[index.tNamespace_.length - 1].uri = xml.substr(offset, length);
  };

  traverse.forward();
};


xrx.index.prototype.head = function() {
  this.rows_.push(new xrx.index.row());

  return this.rows_[this.rows_.length - 1];
};



xrx.index.prototype.getLabel = function(pos) {
  var row = this.rows_[pos];
  var next;
  var label = [];

  label.unshift(row.getPosition());
  if (pos === 0 || pos === this.last()) return new xrx.label(label);

  for(;;) {
    next = row.getParent();
    row = this.rows_[next];
    label.unshift(row.getPosition());
    if (next === 0) break;
  }

  return new xrx.label(label);
};



xrx.index.prototype.getToken = function(row) {
  var r = this.rows_[row];
  var tag = new xrx.token(r.getType(), this.getLabel(row),
      r.getOffset(), r.getLength1());
  
  return xrx.token.native(tag);
};



xrx.index.prototype.rowStartTag = goog.abstractMethod;
xrx.index.prototype.rowEmptyTag = goog.abstractMethod;
xrx.index.prototype.rowEndTag = goog.abstractMethod;



xrx.index.prototype.forward = function() {
  var index = this;
  var pos = 0;
  var row;

  while(pos <= index.last()) {
    row = index.rows_[pos];

    switch(row.getType()) {
    case xrx.token.START_TAG:
      index.rowStartTag(pos, index.getLabel(pos), row.getOffset(), 
          row.getLength1(), row.getLength2());
      break;
    case xrx.token.EMPTY_TAG:
      index.rowEmptyTag(pos, index.getLabel(pos), row.getOffset(), 
          row.getLength1(), row.getLength2());
      break;
    case xrx.token.END_TAG:
      index.rowEndTag(pos, index.getLabel(pos), row.getOffset(), 
          row.getLength1(), row.getLength2());
      break;
    default:
      break;
    }
    pos ++;
  }
};



xrx.index.prototype.backward = function() {
  var index = this;
  var pos = index.last();
  var row;

  while(pos >= 0) {
    row = index.rows_[pos];

    switch(row.getType()) {
    case xrx.token.START_TAG:
      index.rowStartTag(pos, index.getLabel(pos), row.getOffset(), 
          row.getLength1(), row.getLength2());
      break;
    case xrx.token.EMPTY_TAG:
      index.rowEmptyTag(pos, index.getLabel(pos), row.getOffset(), 
          row.getLength1(), row.getLength2());
      break;
    case xrx.token.END_TAG:
      index.rowEndTag(pos, index.getLabel(pos), row.getOffset(), 
          row.getLength1(), row.getLength2());
      break;
    default:
      break;
    }
    pos--;
  }
};

