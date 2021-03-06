export default ({ html, apolloState, helmet, webExtractor }): string => {
  return `<!DOCTYPE html>
    <html ${helmet.htmlAttributes.toString()}>
    <head>
    ${helmet.meta.toString()}
    ${helmet.title.toString()}
    ${helmet.link.toString()}
    ${webExtractor.getLinkTags()}
    ${webExtractor.getStyleTags()}
    </head>
    <body ${helmet.bodyAttributes.toString()}>
    <div id="root">${html}</div>
    <script>window.__APOLLO_STATE__=${JSON.stringify(apolloState)}</script>
    ${webExtractor.getScriptTags()}
    </body>
    </html>
  `;
};
