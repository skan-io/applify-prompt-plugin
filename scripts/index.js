/* eslint max-len: 0 */

export default {
  clean: 'rimraf ./build',

  build: 'run build:*',
  ['build:babel']: "babel src --out-dir build/pkg --ignore '**/*.test.js'",
  ['build:files']: 'cp -R ./README.md ./LICENSE ./package.json build/pkg/',

  test: 'run lint jest',

  cd: 'run clean build release',
  release: 'semantic-release',

  lint: 'run lint:*',
  ['lint:js']: 'eslint --report-unused-disable-directives --ignore-path .gitignore .',
  ['lint:md']: 'remark -i .gitignore --no-stdout --use remark-lint *.md',

  jest: 'jest --runInBand --no-cache'
};
