const base = require('@umijs/fabric/dist/eslint');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'react/sort-comp': 0,
    'default-case': 0,
    'eslint-comments/disable-enable-pair': 0,
    'jsx-a11y/interactive-supports-focus': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    '@typescript-eslint/no-object-literal-type-assertion': 0,
  },
};
