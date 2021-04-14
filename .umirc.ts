import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'rc-tree-select',
  favicon:
    'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  logo:
    'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  exportStatic: {},
  outputPath: '.doc',
  resolve: {
    examples: ['none'],
  },
  styles: [
    `
      .markdown table {
        width: auto !important;
      }
    `,
  ]
});
