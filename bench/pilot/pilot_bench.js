
function pilotForward(xml) {
  var pilot = new xrx.pilot(xml);
  var label = new xrx.label([1]);
  var stop = new xrx.token.EndTag(label);

  pilot.forward(null, stop);
};

function pilotBackward(xml, context) {
  var pilot = new xrx.pilot(xml);
  var label = new xrx.label([1]);
  var stop = new xrx.token.StartTag(label);

  pilot.backward(context, stop);
};


