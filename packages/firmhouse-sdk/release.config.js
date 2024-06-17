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
    'main',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
  ],
  plugins: [
    // Wraps commit-analyzer and release-notes-generator plguins to support squash and merge
    'semantic-release-unsquash',
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
