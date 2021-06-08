import { ChunkExtractor } from '@loadable/server';
import { HelmetData } from 'react-helmet-async';

export interface Options {
  html: string;
  apolloState: unknown;
  helmet: HelmetData;
  webExtractor: ChunkExtractor;
}

export default ({ html, apolloState, helmet, webExtractor }: Options): string => {
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
