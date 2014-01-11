
function readForward(xml) {
  var reader = new xrx.reader(xml);

  reader.first();

  for(;;) {
    reader.next();
    if (reader.finished()) break;
  }
};

function readBackward(xml) {
  var reader = new xrx.reader(xml);

  reader.last();

  for(;;) {
    reader.previous();
    if (reader.finished()) break;
  }
};

