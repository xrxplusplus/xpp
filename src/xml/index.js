/**
 * @fileoverview A class to create long-lived binary
 * encodings for XML instances. 
 */


goog.provide('xrx.index');



goog.require('goog.math.Long');
goog.require('xrx.node');
goog.require('xrx.traverse');



xrx.index = function(xml, opt_format) {



  this.format_ = opt_format || '128Bit';



  this.rows_ = [];



  this.labelBuffer_ = {};



  this.reindex(xml);
};



xrx.index.prototype.length = function() {
  return this.rows_.length;
};



xrx.index.prototype.last = function() {
  return this.length() - 1;
};



xrx.index.prototype.reindex = function(xml) {
  var traverse = new xrx.traverse(xml);
  var row;
  var index = this;
  var parent;

  traverse.namespace = function() {
    row = index.head();
  };

  traverse.rowStartTag = function(label, offset, length) {
    parent = label.clone();
    parent.parent();

    row = index.head();
    index.setType(row, xrx.node.ELEMENT);
    index.setPosition(row, label.last());
    index.setParent(row, parent);
    index.setOffset(row, offset);
    index.setLength(row, length);
    index.labelBuffer_[label.toString()] = index.last();
  };

  traverse.rowEmptyTag = function(label, offset, length) {
    parent = label.clone();
    parent.parent();

    row = index.head();
    index.setType(row, xrx.node.ELEMENT);
    index.setPosition(row, label.last());
    index.setParent(row, parent);
    index.setOffset(row, offset);
    index.setLength(row, length);
  };

  traverse.rowEndTag = function(label, offset, length) {
    delete index.labelBuffer_[label.toString()];
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
  LENGTH: { bits: 'high_', shift: 40, size: 20 }
  // 44 bites free for XML Schema support
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
  LENGTH: xrx.index.mask.fromFormat('128Bit', 'LENGTH')
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
xrx.index.row.prototype.get = function(integer, format) {
  var long = goog.math.Long.fromInt(integer);

  long = long.shiftLeft(format.shift);
  this[format.bits] = this[format.bits].or(long);
};



xrx.index.row.prototype.getType = function(format) {
  var mask = xrx.index.mask[format].TYPE;
  var long = this.low_.and(mask).shiftRight(59);

  return long.toInt();
};



xrx.index.prototype.setType = function(row, type) {
  xrx.index.update(row, type, 
      xrx.index.format[this.format_].TYPE);
};



xrx.index.prototype.setPosition = function(row, position) {
  xrx.index.update(row, position, 
      xrx.index.format[this.format_].POSITION); 
};



xrx.index.prototype.setParent = function(row, position) {
  xrx.index.update(row, position, 
      xrx.index.format[this.format_].PARENT); 
};



xrx.index.prototype.setOffset = function(row, offset) {
  xrx.index.update(row, offset, 
      xrx.index.format[this.format_].OFFSET); 
};



xrx.index.prototype.setLength = function(row, length) {
  xrx.index.update(row, length, 
      xrx.index.format[this.format_].LENGTH);
};



xrx.index.prototype.tagName = function(target) {
  var start = 0;
  var row;

  while(row = this.rows_[start]) {
    row.getType(this.format_);
    start++;
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
