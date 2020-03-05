const dotenv = require('dotenv');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const libs = {
  React: isProd
    ? '/node_modules/react/umd/react.production.min.js'
    : '/node_modules/react/umd/react.development.js',
  ReactDOM: isProd
    ? '/node_modules/react-dom/umd/react-dom.production.min.js'
    : '/node_modules/react-dom/umd/react-dom.development.js',
  ReactRouterDOM: isProd
    ? '/node_modules/react-router-dom/umd/react-router-dom.min.js'
    : '/node_modules/react-router-dom/umd/react-router-dom.js',
};

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
<script src="${libs.React}"></script>
<script src="${libs.ReactDOM}"></script>
<script src="${libs.ReactRouterDOM}"></script>
${webExtractor.getScriptTags()}
</body>
</html>`;
};
