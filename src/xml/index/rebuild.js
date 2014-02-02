/**
 * @fileoverview A class extending class xrx.index with update
 * operations on binary encodings. 
 */

goog.provide('xrx.rebuild');



goog.require('goog.object');
goog.require('xrx.token');
goog.require('xrx.token.StartEmptyTag');



xrx.rebuild = function() {};



xrx.rebuild.offset = function(index, key, diff) {
  var row;

  while (row = index.iterNext()) {
    row.setOffset(row.getOffset() + diff);
  };
};



/**
 * Rebuilds an index after a XML instance has been updated by
 * a replaceNotTag update operation.
 */
xrx.rebuild.replaceNotTag = function(instance, token, diff) {
  var index = instance.getIndex();
  var parentLabel = token.label().clone();
  parentLabel.parent();
  var parent = new xrx.token.StartEmptyTag(parentLabel);
  var key = index.getKeyByToken(parent);
  var row = index.getRow(key);

  index.iterSetKey(key);
  row.setLength2(row.getLength2() + diff);
  index.rows_[key] = goog.object.clone(row);

  xrx.rebuild.offset(index, key, diff);
};
