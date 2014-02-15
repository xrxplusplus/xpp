<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xrx="http://www.monasterium.net/NS/xrx"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:demo="http://www.monasterium.net/NS/demo">
  <xsl:import href="xrx2html.xsl"/>
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:variable name="filename" select="/xhtml:div/@data-filename"/>
  <xsl:variable name="relativepath" select="/xhtml:div/@data-relativepath"/>

  <xsl:template match="/">
    <xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html&gt;</xsl:text>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>XRX++ - A JavaScript Library for Native and Visual in-Browser XML Editing.</title>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/jssaxparser/SAXException.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/jssaxparser/SAXScanner.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/jssaxparser/XMLFilterImpls.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/jssaxparser/ReaderWrapper.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/jssaxparser/Reader.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/jssaxparser/AttributesImpl.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/jssaxparser/LocatorImpls.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/jssaxparser/NamespaceSupport.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/jssaxparser/sax.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/jssaxparser/DefaultHandlers.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/codemirror/lib/codemirror.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/codemirror/mode/javascript/javascript.js</xsl:text>
          </xsl:attribute>
        </script>
        <link rel="stylesheet" type="text/css">
          <xsl:attribute name="href">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/codemirror/lib/codemirror.css</xsl:text>
          </xsl:attribute>
        </link>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>lib/closure-library/closure/goog/base.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          <xsl:attribute name="src">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>src/deps.js</xsl:text>
          </xsl:attribute>
        </script>
        <script>
          goog.require('goog.dom');
          goog.require('goog.dom.forms');
          goog.require('goog.userAgent.product');
          goog.require('xrx');
        </script>
        <link rel="stylesheet" type="text/css">
          <xsl:attribute name="href">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>src/ui/wysiwym/default.css</xsl:text>
          </xsl:attribute>
        </link>
        <link rel="stylesheet" type="text/css">
          <xsl:attribute name="href">
            <xsl:value-of select="$relativepath"/>
            <xsl:text>demo/demo.css</xsl:text>
          </xsl:attribute>
        </link>
      </head>
      <body>
        <div class="left">
          <h1>
            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="$relativepath"/>
                <xsl:text>index.html</xsl:text>
              </xsl:attribute>
              <xrx:text>XRX++</xrx:text>
            </a>
          </h1>
          <i>A JavaScript Library for Native and Visual in-Browser XML Editing</i>
          <div style="height: 3em"><span>&#160;</span></div>
          <h3>Basic Features</h3>
          <ul class="nostyle">
            <li>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="$relativepath"/>
                  <xsl:text>demo/wysiwym-xml-authoring.html</xsl:text>
                </xsl:attribute>
                <xsl:if test="$filename = 'wysiwym-xml-authoring.xml'">
                  <xsl:attribute name="class">active</xsl:attribute>
                </xsl:if>
                <xsl:text>WYSIWYM XML Authoring</xsl:text>
              </a>
            </li>
            <li>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="$relativepath"/>
                  <xsl:text>demo/data-binding.html</xsl:text>
                </xsl:attribute>
                <xsl:if test="$filename = 'data-binding.xml'">
                  <xsl:attribute name="class">active</xsl:attribute>
                </xsl:if>
                <xsl:text>Data Binding</xsl:text>
              </a>
            </li>
            <li>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="$relativepath"/>
                  <xsl:text>demo/large-document-support.html</xsl:text>
                </xsl:attribute>
                <xsl:if test="$filename = 'large-document-support.xml'">
                  <xsl:attribute name="class">active</xsl:attribute>
                </xsl:if>
                <xsl:text>Large Document Support</xsl:text>
              </a>
            </li>
          </ul>
          <h3>User's Guide</h3>
          <ul class="nostyle">
            <li>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="$relativepath"/>
                  <xsl:text>demo/getting-started.html</xsl:text>
                </xsl:attribute>
                <xsl:if test="$filename = 'getting-started.xml'">
                  <xsl:attribute name="class">active</xsl:attribute>
                </xsl:if>
                <xsl:text>Getting Started</xsl:text>
              </a>
            </li>
          </ul>
          <h3>Developer's Guide</h3>
          <ul class="nostyle">
            <li>
              <a>
                <xsl:attribute name="href">
                  <xsl:text>http://github.com/xrxplusplus</xsl:text>
                </xsl:attribute>
                <xsl:text>Source</xsl:text>
              </a>
            </li>
            <li>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="$relativepath"/>
                  <xsl:text>doc/index.html</xsl:text>
                </xsl:attribute>
                <xsl:text>API Reference</xsl:text>
              </a>
            </li>
            <li>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="$relativepath"/>
                  <xsl:text>src/alltests.html</xsl:text>
                </xsl:attribute>
                <xsl:text>Unit Tests</xsl:text>
              </a>
            </li>
          </ul>        
        </div>
        <div class="main">
          <xsl:apply-templates/>
        </div>
        <script type="text/javascript">
          xrx.install();
        </script>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="demo:header">
    <h2>
      <xsl:apply-templates/>
    </h2>
  </xsl:template>

  <xsl:template match="demo:heading">
    <div><span>&#160;</span></div>
    <div><span>&#160;</span></div>
    <h3>
      <xsl:apply-templates/>
    </h3>
  </xsl:template>

  <xsl:template match="demo:description">
    <div class="demo-description">
      <span>
        <xsl:apply-templates/>
      </span>
    </div>
  </xsl:template>

  <xsl:template match="demo:app">
    <div class="source-heading">Demo:</div>
    <div class="demo">
      <div class="demo-source">
        <xsl:apply-templates/>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="demo:mvc">
    <div class="demo-view-model">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="demo:view">
    <div class="demo-view">
      <span class="view-label">View: </span>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="demo:model">
    <div class="demo-model">
      <span class="model-label">Model: </span>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="demo:source">
    <div class="source-heading">Source: </div>
    <textarea class="demo-source" readonly="readonly">
      <xsl:copy-of select="@rows"/>
      <xsl:apply-templates/>
    </textarea>
  </xsl:template>
  
  <xsl:template match="demo:try-it-out-link">
    <p>
      <a>
        <xsl:attribute name="href">
          <xsl:value-of select="@href"/>
        </xsl:attribute>
        <xsl:text>Try it yourself &gt;&gt;</xsl:text>
      </a>
    </p>
  </xsl:template>

</xsl:stylesheet>
