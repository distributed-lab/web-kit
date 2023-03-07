## Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.3] - 2023-03-07
### Added
- `@distributedlab/tools`: `BN.WEI_DECIMALS` value

### Fixed
- `@distributedlab/tools`: `BN.MAX_UINT256` value

## [0.1.2] - 2023-03-07
### Added
- `@distributedlab/tools`: `isZero` getter to `BN` class

## [0.1.1] - 2023-03-07
### Fixed
- `root`: Links to the packages in the `README.md` file
- `@distributedlab/tools`: Export `BN` class

## [0.1.0] - 2023-03-06
### Added
- `CHANGELOG.md` file
- `root`: `package.json`, `.editorconfig`, `.gitattributes`, `.gitignore` initial files
- `root`: Yarn Berry
- `root`: Jest and configuration files
- `root`: Prettier, ESLint and configuration files
- `root`: Git hooks with Yorkie
- `root`: TypeScript and configuration files
- `root`: TypeDoc and configuration file
- `root`: `@distributedlab/tools` package particularly moved from the [old repo] `@distributedlab/utils` package
- `root`: `@distributedlab/jac` package moved from the [old repo] `@distributedlab/json-api-client` package
- `root`: GitHub Actions
- `all`: Build to CommonJS and ES modules
- `all`: `tsc-alias` package to use aliases in TypeScript
- `root`: `yarn rsc` Release Sanity Check script
- `root`: Rollup and configuration file to build packages for CDN
- `@distributedlab/tools`: Handling big numbers
- `@distributedlab/tools`: Add tests  for time.ts and duration.ts

### Changed
- `root`: Updated `README.md`

[old repo]: https://github.com/distributed-lab/web-kit-old

[Unreleased]: https://github.com/distributed-lab/web-kit/compare/0.1.3...HEAD
[0.1.3]: https://github.com/distributed-lab/web-kit/compare/0.1.2...0.1.3
[0.1.2]: https://github.com/distributed-lab/web-kit/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/distributed-lab/web-kit/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/distributed-lab/web-kit/releases/tag/0.1.0
