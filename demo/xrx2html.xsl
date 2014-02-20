<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xrx="http://www.monasterium.net/NS/xrx"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:instance/>                                   # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:variable name="Entities">
    <entities>
      <entity value="&quot;" escaped="&amp;quot;"/>
      <entity value="&amp;" escaped="&amp;amp;"/>
      <entity value="&lt;" escaped="&amp;lt;"/>
      <entity value="&gt;" escaped="&amp;gt;"/>
      <entity value="&apos;" escaped="&amp;apos;"/>
    </entities>
  </xsl:variable>

  <xsl:template match="/">
    <xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html&gt;</xsl:text>
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="xhtml:head">
    <head xmlns="http://www.w3.org/1999/xhtml">
      <xsl:copy-of select="@*"/>
      <xsl:call-template name="xrx.resources">
        <xsl:with-param name="relativepath" select="'/xpp/'"/>
      </xsl:call-template>
      <xsl:copy-of select="./*"/>
    </head>
  </xsl:template>

  <xsl:template match="xhtml:body">
    <body xmlns="http://www.w3.org/1999/xhtml">
      <xsl:copy-of select="@*"/>
      <xsl:apply-templates/>
      <script type="text/javascript">
        xrx.install();
      </script>
    </body>
  </xsl:template>

  <xsl:template name="xrx.resources">
    <xsl:param name="relativepath"/>
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
      goog.require('xrx');
    </script>
    <link rel="stylesheet" type="text/css">
      <xsl:attribute name="href">
        <xsl:value-of select="$relativepath"/>
        <xsl:text>src/ui/wysiwym/default.css</xsl:text>
      </xsl:attribute>
    </link>
  </xsl:template>

  <xsl:template match="xrx:instance">
    <div class="xrx-instance">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
      <xsl:apply-templates mode="instance"/>
    </div>
  </xsl:template>

  <xsl:template match="*" mode="instance">
    <xsl:variable name="currentNode" select="."/>
    <xsl:text>&lt;</xsl:text>
    <xsl:value-of select="name(.)"/>
    <xsl:apply-templates select="@*" mode="instance"/>
    <xsl:for-each select="namespace::*[name() != 'xml'][not(. = $currentNode/../namespace::*)]">
      <xsl:call-template name="EscapeNamespace" mode="instance">
        <xsl:with-param name="namespace" select="."/>
      </xsl:call-template>
    </xsl:for-each>
    <xsl:text>&gt;</xsl:text>
    <xsl:apply-templates select="node()" mode="instance"/>
    <xsl:text>&lt;/</xsl:text>
    <xsl:value-of select="name(.)"/>
    <xsl:text>&gt;</xsl:text>
  </xsl:template>
  
  <xsl:template match="@*" mode="instance">
    <xsl:text> </xsl:text>
    <xsl:value-of select="name(.)"/>
    <xsl:text>=&quot;</xsl:text>
    <xsl:call-template name="EscapeText" mode="instance">
      <xsl:with-param name="text" select="."/>
    </xsl:call-template>
    <xsl:text>&quot;</xsl:text>
  </xsl:template>
  
  <xsl:template match="text()" mode="instance">
    <xsl:call-template name="EscapeText" mode="instance">
      <xsl:with-param name="text" select="."/>
    </xsl:call-template>
  </xsl:template>
  
  <xsl:template name="EscapeNamespace" mode="instance">
    <xsl:param name="namespace"/>
  
    <xsl:variable name="prefix">
      <xsl:choose>
        <xsl:when test="name($namespace) = ''">
          <xsl:value-of select="'xmlns'"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="concat('xmlns:', name($namespace))"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
  
    <xsl:value-of select="concat(' ', $prefix, '=&quot;')"/>
    <xsl:call-template name="EscapeText" mode="instance">
      <xsl:with-param name="text" select="$namespace"/>
    </xsl:call-template>
    <xsl:value-of select="'&quot;'"/>
  </xsl:template>
  
  <xsl:template name="EscapeText" mode="instance">
    <xsl:param name="text"/>
  
    <xsl:variable name="apos">&apos;</xsl:variable>
    <xsl:variable name="foundEntity">
      <xsl:choose>
        <xsl:when test="contains($text, '&quot;')">
          <xsl:value-of select="'&quot;'"/>
        </xsl:when>
        <xsl:when test="contains($text, '&amp;')">
          <xsl:value-of select="'&amp;'"/>
        </xsl:when>
        <xsl:when test="contains($text, '&lt;')">
          <xsl:value-of select="'&lt;'"/>
        </xsl:when>
        <xsl:when test="contains($text, '&gt;')">
          <xsl:value-of select="'&gt;'"/>
        </xsl:when>
        <xsl:when test='contains($text, "&apos;")'>
          <xsl:value-of select="$apos"/>
        </xsl:when>
        <xsl:otherwise/>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="escapedEntity">
      <xsl:choose>
        <xsl:when test="contains($text, '&quot;')">
          <xsl:value-of select="'&amp;quot;'"/>
        </xsl:when>
        <xsl:when test="contains($text, '&amp;')">
          <xsl:value-of select="'&amp;amp;'"/>
        </xsl:when>
        <xsl:when test="contains($text, '&lt;')">
          <xsl:value-of select="'&amp;lt;'"/>
        </xsl:when>
        <xsl:when test="contains($text, '&gt;')">
          <xsl:value-of select="'&amp;gt;'"/>
        </xsl:when>
        <xsl:when test='contains($text, "&apos;")'>
          <xsl:value-of select="'&amp;apos;'"/>
        </xsl:when>
        <xsl:otherwise/>
      </xsl:choose>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$foundEntity != ''">
        <xsl:call-template name="EscapeText" mode="instance">
          <xsl:with-param name="text" select="substring-before($text, $foundEntity)"/>
        </xsl:call-template>
        <xsl:value-of select="$escapedEntity"/>
        <xsl:call-template name="EscapeText" mode="instance">
          <xsl:with-param name="text" select="substring-after($text, $foundEntity)"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text"/>
      </xsl:otherwise>
    </xsl:choose>
  
  </xsl:template>

  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:bind/>                                       # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xrx:bind">
    <div class="xrx-bind">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
    </div>
  </xsl:template>

  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:repeat/>                                     # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xrx:repeat">
    <div class="xrx-repeat">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:console/>                                    # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xrx:console">
    <span class="xrx-console">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
    </span>
  </xsl:template>

  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:input/>                                      # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xrx:input">
    <textarea class="xrx-wysiwym-input">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
    </textarea>
  </xsl:template>

  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:ouptput/>                                    # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xrx:output">
    <span class="xrx-output">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
    </span>
  </xsl:template>

  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # <xrx:textarea/>                                   # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  <xsl:template match="xrx:textarea">
    <textarea class="xrx-wysiwym-textarea">
      <xsl:call-template name="copy-attributes" select="./self::*"/>
    </textarea>
  </xsl:template>

  <!-- ##################################################### -->
  <!-- #                                                   # -->
  <!-- # shared                                            # -->
  <!-- #                                                   # -->
  <!-- ##################################################### -->
  
  <xsl:template name="copy-attributes">
    <xsl:for-each select="@*">
      <xsl:choose>
        <xsl:when test="name(.) = 'ref'">
          <xsl:attribute name="data-xrx-ref">
            <xsl:value-of select="."/>
          </xsl:attribute>
        </xsl:when>
        <xsl:when test="name(.) = 'bind'">
          <xsl:attribute name="data-xrx-bind">
            <xsl:value-of select="."/>
          </xsl:attribute>
        </xsl:when>
        <xsl:when test="name(.) = 'src'">
          <xsl:attribute name="data-xrx-src">
            <xsl:value-of select="."/>
          </xsl:attribute>
        </xsl:when>
        <xsl:otherwise>
          <xsl:copy-of select="."/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:template>
  
  <xsl:template match="@*|*" priority="-2">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()" />
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
