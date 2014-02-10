/**
 * @fileoverview Cursor functions for a WYSIWYM control.
 */

goog.provide('xrx.ui.wysiwym.cursor');



/**
 * WYSIWYM cursor object.
 */
xrx.ui.wysiwym.cursor = {};



/**
 * Returns whether the current cursor is a selection or a caret.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {boolean} True if something is selected.
 */
xrx.ui.wysiwym.cursor.isSomethingSelected = function(wysiwym) {
  return wysiwym.codemirror_.somethingSelected();
};



/**
 * Returns the position of the cursor caret if nothing is selected
 * or the position of the left edge of a cursor selection if something
 * is selected as integer.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {integer} The position of the cursor caret or the left
 * edge of the selection.
 */
xrx.ui.wysiwym.cursor.leftIndex = function(wysiwym) {
  return wysiwym.codemirror_.indexFromPos(
      xrx.ui.wysiwym.cursor.leftPosition(wysiwym));
};



/**
 * Returns the position of the cursor caret if nothing is selected
 * or the position of the left edge of a cursor selection if something
 * is selected as a position object.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {Object.<number, number>} The position of the cursor caret 
 * or the left edge of the selection.
 */
xrx.ui.wysiwym.cursor.leftPosition = function(wysiwym) {
  return wysiwym.codemirror_.getCursor(true);
};



/**
 * Returns the token left of the cursor caret or left of the left edge
 * of a cursor selection. Token here is not a XML token, but a visual HTML
 * token.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {Object} The HTML token.
 */
xrx.ui.wysiwym.cursor.leftTokenInside = function(wysiwym) {
  var cm = wysiwym.codemirror_;

  return cm.getTokenAt(cm.posFromIndex(xrx.ui.wysiwym.cursor.leftIndex(wysiwym) + 1));
};



/**
 * Returns the token right of the cursor caret or right of the left edge
 * of a cursor selection. Token here is not a XML token, but a visual HTML
 * token.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {Object} The HTML token.
 */
xrx.ui.wysiwym.cursor.leftTokenOutside = function(wysiwym) {
  return wysiwym.codemirror_.getTokenAt(xrx.ui.wysiwym.cursor.leftPosition(wysiwym));
};



/**
 * Returns whether the cursor caret or the left edge of a cursor
 * selection is placed at the very beginning of a WYSIWYM control.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {boolean} True if the cursor is placed at the beginning
 * otherwise false.
 */
xrx.ui.wysiwym.cursor.leftAtStartPosition = function(wysiwym) {
  var pos = xrx.ui.wysiwym.cursor.leftPosition(wysiwym);

  return pos.line === 0 && pos.ch === 0;
};



/**
 * Returns whether the cursor caret or the left edge of a cursor
 * selection is placed at the very end of a WYSIWYM control.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {boolean} True if the cursor is placed at the end
 * otherwise false.
 */
xrx.ui.wysiwym.cursor.leftAtEndPosition = function(wysiwym) {
  var pos = xrx.ui.wysiwym.cursor.leftPosition(wysiwym);
  var cm = wysiwym.codemirror_;
  var last = cm.lineCount() - 1;
  var line = cm.getLine(last);

  return pos.line === last && pos.ch === line.length;
};



/**
 * Returns the right edge of a cursor selection as integer.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {integer|null} The right edge of the selection or null if
 * nothing is selected.
 */
xrx.ui.wysiwym.cursor.rightIndex = function(wysiwym) {
  var cursor = xrx.ui.wysiwym.cursor;

  return cursor.isSomethingSelected(wysiwym) ? wysiwym.codemirror_.indexFromPos(
      cursor.rightPosition(wysiwym)) : null;
};



/**
 * Returns the right edge of a cursor selection as a position object.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {Object.<number, number>|null} The right edge of the selection
 * or null if nothing is selected.
 */
xrx.ui.wysiwym.cursor.rightPosition = function(wysiwym) {
  return xrx.ui.wysiwym.cursor.isSomethingSelected(wysiwym) ? 
      wysiwym.codemirror_.getCursor(false) : null;
};



/**
 * Returns the token left of the right edge of a cursor selection. Token
 * here is not a XML token, but a visual HTML token.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {Object} The HTML token.
 */
xrx.ui.wysiwym.cursor.rightTokenInside = function(wysiwym) {
  return xrx.ui.wysiwym.cursor.isSomethingSelected(wysiwym) ?
      wysiwym.codemirror_.getTokenAt(xrx.ui.wysiwym.cursor.rightPosition(wysiwym)) :
          null;
};



/**
 * Returns the token right of the right edge of a cursor selection. Token
 * here is not a XML token, but a visual HTML token.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {Object} The HTML token.
 */
xrx.ui.wysiwym.cursor.rightTokenOutside = function(wysiwym) {
  var cm = wysiwym.codemirror_;

  return xrx.ui.wysiwym.cursor.isSomethingSelected(wysiwym) ? 
      cm.getTokenAt(cm.posFromIndex(xrx.ui.wysiwym.cursor.rightIndex(wysiwym) + 1)) :
          null;
};



/**
 * Returns whether the right edge of a cursor selection is placed at 
 * the very beginning of a WYSIWYM control.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {false|null} Null if nothing is selected, false if something
 * is selected.
 */
xrx.ui.wysiwym.cursor.rightAtStartPosition = function(wysiwym) {
  var pos = xrx.ui.wysiwym.cursor.rightPosition(wysiwym);

  return xrx.ui.wysiwym.cursor.isSomethingSelected(wysiwym) ? false : null;
};



/**
 * Returns whether the right edge of a cursor selection is placed at 
 * the very end of a WYSIWYM control.
 *
 * @param {!xrx.richxml} wysiwym The WYSIWYM control.
 * @return {boolean|null} Null if nothing is selected, true if the
 * right edge is placed at the very end, otherwise false.
 */
xrx.ui.wysiwym.cursor.rightAtEndPosition = function(wysiwym) {
  var cursor = xrx.ui.wysiwym.cursor;
  var pos = cursor.rightPosition(wysiwym);
  var cm = wysiwym.codemirror_;
  var last = cm.lineCount() - 1;
  var line = cm.getLine(last);

  return cursor.isSomethingSelected(wysiwym) ? 
      pos.line === last && pos.ch === line.length : null;
};

