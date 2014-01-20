/**
 * @fileoverview A class to create long-lived binary
 * encodings for XML instances. 
 */


goog.provide('xrx.index');



goog.require('goog.array');
goog.require('goog.math.Long');
goog.require('xrx.label');
goog.require('xrx.token');
goog.require('xrx.traverse');



/**
 * A class to create long-lived binary encodings for
 * XML instances.
 */
xrx.index = function(xml, opt_format) {



  this.format_ = opt_format || '128Bit';



  this.rows_ = [];



  this.labelBuffer_ = {};



  this.tNamespace_ = [];



  this.reindex(xml);
};



/**
 * 
 */
xrx.index.prototype.length = function() {
  return this.rows_.length;
};



/**
 * 
 */
xrx.index.prototype.last = function() {
  return this.length() - 1;
};



/**
 * 
 */
xrx.index.prototype.getRow = function(pos) {
  return this.rows_[pos];
};



/**
 *
 */
xrx.index.Iter = function(index, opt_start) {



  this.index_ = index;



  this.pos_ = opt_start || 0;
};



/**
 *
 */
xrx.index.Iter.prototype.getRow = function() {

  return this.index_.getRow(this.pos_);
};



/**
 *
 */
xrx.index.Iter.prototype.next = function() {

  return this.index_.getRow(++this.pos_);
};



/**
 *
 */
xrx.index.Iter.prototype.previous = function() {

  return this.index_.getRow(--this.pos_);
};



xrx.index.Iter.prototype.getPos = function() {

  return this.pos_;
};



/**
 * 
 */
xrx.index.Namespace = function(opt_label, opt_prefix, opt_uri) {



  this.label = opt_label;



  this.parentLabel;



  this.prefix = opt_prefix;



  this.uri = opt_uri;
};



/**
 * 
 */
xrx.index.prototype.reindex = function(xml) {
  var traverse = new xrx.traverse(xml);
  var row;
  var index = this;
  var parent;

  traverse.setFeature('NS_PREFIX', true);
  traverse.setFeature('NS_URI', true);
  
  var update = function(row, type, label, offset, length1, length2) {
    parent = label.clone();
    parent.parent();

    index.setType(row, type);
    index.setPosition(row, label.last());
    index.setParent(row, index.labelBuffer_[parent.toString()]);
    index.setOffset(row, offset);
    index.setLength1(row, length1);
    index.setLength2(row, length2);
  };

  traverse.rowStartTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.START_TAG, label, offset, length1, length2);
    index.labelBuffer_[label.toString()] = index.last();
  };

  traverse.rowEmptyTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.EMPTY_TAG, label, offset, length1, length2);
  };

  traverse.rowEndTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.END_TAG, label, offset, length1, length2);
    delete index.labelBuffer_[label.toString()];
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



xrx.index.format = {};



xrx.index.format['128Bit'] = {

  TYPE: { bits: 'low_', shift: 59, size: 4 },
  POSITION: { bits: 'low_', shift: 41, size: 18 },
  PARENT: { bits: 'low_', shift: 24, size: 17 },
  OFFSET: { bits: 'low_', shift: 0, size: 24 },
  LENGTH1: { bits: 'high_', shift: 43, size: 20 },
  LENGTH2: { bits: 'high_', shift: 23, size: 20 }
};



xrx.index.mask = {};



xrx.index.mask.fromFormat = function(format, item) {
  var item = xrx.index.format[format][item];
  var shift = item.shift;
  var integer = Math.pow(2, item.size) - 1;

  return goog.math.Long.fromInt(integer).shiftLeft(shift);
};



xrx.index.mask['128Bit'] = {

  TYPE: xrx.index.mask.fromFormat('128Bit', 'TYPE'),
  POSITION: xrx.index.mask.fromFormat('128Bit', 'POSITION'),
  PARENT: xrx.index.mask.fromFormat('128Bit', 'PARENT'),
  OFFSET: xrx.index.mask.fromFormat('128Bit', 'OFFSET'),
  LENGTH1: xrx.index.mask.fromFormat('128Bit', 'LENGTH1'),
  LENGTH2: xrx.index.mask.fromFormat('128Bit', 'LENGTH2')
};



xrx.index.row = function() {

  this.low_ = new goog.math.Long();
  this.high_ = new goog.math.Long();
};



/**
 * @private
 */
xrx.index.update = function(row, integer, format) {
  var long = goog.math.Long.fromInt(integer);

  long = long.shiftLeft(format.shift);
  row[format.bits] = row[format.bits].or(long);
};



/**
 * @private
 */
xrx.index.row.prototype.get = function(item, format) {
  var f = format || '128Bit';
  var i = xrx.index.format[f][item];
  var mask = xrx.index.mask[f][item];

  return this[i.bits].and(mask).shiftRight(i.shift).toInt();
};



/**
 * return {!integer} The token type.
 */
xrx.index.row.prototype.getType = function(format) {
  return this.get('TYPE', format);
};



/**
 * 
 */
xrx.index.prototype.setType = function(row, type) {
  xrx.index.update(row, type, 
      xrx.index.format[this.format_].TYPE);
};



/**
 * return {!integer}
 */
xrx.index.row.prototype.getPosition = function(format) {
  return this.get('POSITION', format);
};



xrx.index.prototype.setPosition = function(row, position) {
  xrx.index.update(row, position, 
      xrx.index.format[this.format_].POSITION); 
};



xrx.index.row.prototype.getParent = function(format) {
  return this.get('PARENT', format);
};



xrx.index.prototype.setParent = function(row, position) {
  xrx.index.update(row, position, 
      xrx.index.format[this.format_].PARENT); 
};



xrx.index.row.prototype.getOffset = function(format) {
  return this.get('OFFSET', format);
};



xrx.index.prototype.setOffset = function(row, offset) {
  xrx.index.update(row, offset, 
      xrx.index.format[this.format_].OFFSET); 
};



xrx.index.row.prototype.getLength1 = function(format) {
  return this.get('LENGTH1', format);
};



xrx.index.prototype.setLength1 = function(row, length) {
  xrx.index.update(row, length, 
      xrx.index.format[this.format_].LENGTH1);
};



xrx.index.row.prototype.getLength2 = function(format) {
  return this.get('LENGTH2', format);
};



xrx.index.prototype.setLength2 = function(row, length) {
  xrx.index.update(row, length, 
      xrx.index.format[this.format_].LENGTH2);
};




xrx.index.prototype.getLabel = function(pos) {
  var row = this.rows_[pos];
  var next;
  var label = [];

  label.unshift(row.getPosition(this.format_));
  if (pos === 0 || pos === this.last()) return new xrx.label(label);

  for(;;) {
    next = row.getParent(this.format_);
    row = this.rows_[next];
    label.unshift(row.getPosition(this.format_));
    if (next === 0) break;
  }

  return new xrx.label(label);
};



xrx.index.prototype.getToken = function(row) {
  var r = this.rows_[row];
  var tag = new xrx.token(r.getType(this.format_), this.getLabel(row),
      r.getOffset(this.format_), r.getLength1(this.format_));
  
  return xrx.token.native(tag);
};



/**
 * return {!xrx.index.row}
 */
xrx.index.prototype.getNamespace = function(token, prefix) {

  return goog.array.findRight(this.tNamespace_, function(ns, ind, arr) {
    return ns.prefix === prefix && (token.label().sameAs(ns.parentLabel) ||
        token.label().isDescendantOf(ns.parentLabel));
  });
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

    switch(row.getType(index.format_)) {
    case xrx.token.START_TAG:
      index.rowStartTag(pos, index.getLabel(pos), row.getOffset(index.format_), 
          row.getLength1(index.format_), row.getLength2(index.format_));
      break;
    case xrx.token.EMPTY_TAG:
      index.rowEmptyTag(pos, index.getLabel(pos), row.getOffset(index.format_), 
          row.getLength1(index.format_), row.getLength2(index.format_));
      break;
    case xrx.token.END_TAG:
      index.rowEndTag(pos, index.getLabel(pos), row.getOffset(index.format_), 
          row.getLength1(index.format_), row.getLength2(index.format_));
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

    switch(row.getType(index.format_)) {
    case xrx.token.START_TAG:
      index.rowStartTag(pos, index.getLabel(pos), row.getOffset(index.format_), 
          row.getLength1(index.format_), row.getLength2(index.format_));
      break;
    case xrx.token.EMPTY_TAG:
      index.rowEmptyTag(pos, index.getLabel(pos), row.getOffset(index.format_), 
          row.getLength1(index.format_), row.getLength2(index.format_));
      break;
    case xrx.token.END_TAG:
      index.rowEndTag(pos, index.getLabel(pos), row.getOffset(index.format_), 
          row.getLength1(index.format_), row.getLength2(index.format_));
      break;
    default:
      break;
    }
    pos--;
  }
};



xrx.index.toString = function(row) {

  var formatNumber = function(number) {
    var str = "" + number.toString(2);
    while (str.length < 64) {
      str = "0" + str;
    }
    return str;
  };

  return formatNumber(row.low_) + '|' + formatNumber(row.high_);
};
