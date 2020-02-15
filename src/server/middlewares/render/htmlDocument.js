function HtmlDocument({ html, apolloState, helmet, webExtractor }) {
  return `
        <!DOCTYPE html>
        <html ${helmet.htmlAttributes.toString()}>
            <head>
                ${helmet.title.toString()}
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                ${helmet.meta.toString()}
                <link rel="icon" href="/static/favicon.ico" />
                ${helmet.link.toString()}
                ${webExtractor.getLinkTags()}
                ${webExtractor.getStyleTags()}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
                <div id="root">${html}</div>
                <noscript>
                    You need to enable JavaScript to run this app.
                </noscript>
                <script type="text/javascript">
                    window.APOLLO_STATE=${JSON.stringify(apolloState)}
                </script>
                ${webExtractor.getScriptTags()}
            </body>
        </html>
    `;
}

export default HtmlDocument;
