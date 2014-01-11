
function parse(xml) {
  var contentHandler = new DefaultHandler2();
  //var locator = new Locator2Impl();
  //var contentHandler.setDocumentLocator(locator);
  var saxParser = XMLReaderFactory.createXMLReader();
  saxParser.setHandler(contentHandler);

  saxParser.parseString(xml);
};
