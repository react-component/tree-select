const base = require('@umijs/fabric/dist/eslint');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'default-case': 0,
    'eslint-comments/disable-enable-pair': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
