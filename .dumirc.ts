import { defineConfig } from 'dumi';

const basePath = process.env.GH_PAGES ? '/tree-select/' : '/';
const publicPath = basePath;

export default defineConfig({
  outputPath: 'docs-dist',
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'tree-select',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
  exportStatic: {},
  base: basePath,
  publicPath,
  styles: [
    `
      .markdown table {
        width: auto !important;
      }
    `,
  ],
});
