module.exports = function HtmlDocument({ html, apolloState, helmet, webExtractor }) {
  return `<!DOCTYPE html>
<html lang="ru" ${helmet.htmlAttributes.toString()}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
${helmet.meta.toString()}
${helmet.title.toString()}
<link rel="icon" href="/static/favicon.ico" />
${helmet.link.toString()}
${webExtractor.getLinkTags()}
${webExtractor.getStyleTags()}
</head>
<body ${helmet.bodyAttributes.toString()}>
<div id="root">${html}</div>
<script>window.SERVER_STATE=${JSON.stringify(apolloState)}</script>
${webExtractor.getScriptTags()}
</body>
</html>`;
};
