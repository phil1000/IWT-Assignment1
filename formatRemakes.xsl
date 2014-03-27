<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<!--The use of params within the sort was deduced from information from W3C and developer.mozilla.org  -->
	<xsl:param name="sortBy" select="'rtitle'"/>
	<xsl:template match="remakes">
		<html>
		<body>
		<table align="centre" border="1" cellpadding="4">
			<tr>
				<th>Title</th>
				<th>Year</th>
				<th>Original Title</th>
				<th>Original Year</th>
				<th>Fraction</th>
			</tr>
			<xsl:for-each select="remake">
			<xsl:sort select="*[name()=$sortBy]" />
				<tr>
					<td><xsl:value-of select="rtitle"/></td>
					<td><xsl:value-of select="ryear"/></td>
					<td><xsl:value-of select="stitle"/></td>
					<td><xsl:value-of select="syear"/></td>
					<td><xsl:value-of select="fraction"/></td>
				</tr>
			</xsl:for-each>
		</table>
		</body>
		</html>
	</xsl:template>
</xsl:stylesheet>