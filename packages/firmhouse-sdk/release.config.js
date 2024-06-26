const name = 'firmhouse-sdk';
const srcRoot = `packages/${name}`;
/**
 * @type {import('semantic-release-plus').GlobalConfig}
 */
module.exports = {
  extends: 'release.config.base.js',
  pkgRoot: `dist/${srcRoot}`,
  tagFormat: `${name}-v\${version}`,
  commitPaths: [`${srcRoot}/*`],
  branches: [
    { name: 'main' },
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
  ],
  plugins: [
    // Wraps commit-analyzer and release-notes-generator plguins to support squash and merge
    [
      'semantic-release-unsquash',
      {
        commitAnalyzerConfig: {
          preset: 'angular',
          releaseRules: [
            {
              type: 'feat',
              release: 'minor',
            },
            {
              type: 'build',
              release: 'patch',
            },
            {
              type: 'ci',
              release: 'patch',
            },
            {
              type: 'chore',
              release: 'patch',
            },
            {
              type: 'docs',
              release: 'patch',
            },
            {
              type: 'refactor',
              release: 'patch',
            },
            {
              type: 'style',
              release: 'patch',
            },
            {
              type: 'test',
              release: 'patch',
            },
            {
              scope: '!firmhouse-sdk',
              release: false,
            },
          ],
        },
        notesGeneratorConfig: {
          preset: 'conventionalcommits',
          presetConfig: {
            types: [
              { type: 'feat', section: 'Features' },
              { type: 'fix', section: 'Bug Fixes' },
              { type: 'chore', hidden: true },
              { type: 'docs', hidden: true },
              { type: 'ci', hidden: true },
              { type: 'style', hidden: true },
              { type: 'refactor', hidden: true },
              { type: 'perf', hidden: true },
              { type: 'test', hidden: true },
              { type: 'build', hidden: true },
            ],
          },
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: `${srcRoot}/CHANGELOG.md`,
      },
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: [`${srcRoot}/package.json`, `${srcRoot}/CHANGELOG.md`],
        message:
          `release(version): Release ${name}` +
          // eslint-disable-next-line no-template-curly-in-string
          '${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
