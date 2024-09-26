# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- `root` - `scripts/release-sanity-check.js` and `scripts/version.js` replaced with `rlx` package

### Fixed
- `root` - CHANGLOG.md according to the Keep a Changelog format

## [1.0.0-rc.16] - 2024-05-03
### Fixed
- `@distributedlab/w3p` - `ProviderDetector` resets pure providers list on init
- `@distributedlab/jac` - example in README

## [1.0.0-rc.15] - 2024-04-08
### Fixed
- `@distributedlab/jac` - `JsonApiResponse.createLink` method to handle client `baseUrl` with root path

## [1.0.0-rc.14] - 2024-03-12
### Fixed
- `@distributedlab/jac` - `JsonApiResponse.createLink` method to handle client `baseUrl` with root path

## [1.0.0-rc.13] - 2024-03-02
### Changed
- `@distributedlab/w3p` - private properties to be public
- `@distributedlab/tools` - `EventEmitter` properties to be public

## [1.0.0-rc.12] - 2024-02-28
### Removed
- `all` - Compling output into `.mjs` extension

## [1.0.0-rc.11] - 2024-02-28
### Changed
- `all`
  - Output ESM files with `.mjs` extension
  - Updated `swc` dependencies versions to the latest

### Removed
- `all` - Creating extra `package.json` files in the dist folder for resolving ESM and CommonJS modules
- `all,root` - postbuild script
- `all` - CDN distributives support

### Fixed
- `@distributedlab/w3p` - Tree-shaking issues related to sub-dependencies

## [1.0.0-rc.10] - 2024-01-18
### Fixed
- `@distributedlab/jac` - possibility to throw custom error on request

## [1.0.0-rc.9] - 2023-12-19
### Fixed
- `@distributedlab/fetcher` - parsing query params from URL in the fetcher standalone

## [1.0.0-rc.8] - 2023-11-07
### Fixed
- `@distributedlab/tools` - `BN.fromRaw` parsing string value with the exponential notation

## [1.0.0-rc.7] - 2023-09-25
### Added
- `@distributedlab/w3p` - WalletConnect EVM provider

## [1.0.0-rc.6] - 2023-08-04
### Added
- `@distributedlab/tools` - `BN` decimals global configuration

### Changed
- `@distributedlab/tools`
  - `BN`
    - `fromRaw` `configOrDecimals` argument is optional
    - `fromBigInt` `configOrDecimals` argument is optional

### Fixed
- `@distributedlab/tools` - `BN` static fields `undefined` value after production build at the client side

## [1.0.0-rc.5] - 2023-08-02
### Fixed
- `@distributedlab/tools` - `BN` format group sizes

## [1.0.0-rc.4] - 2023-07-31
### Fixed
- `@distributedlab/tools` - `BN` format decimals size of the output value

## [1.0.0-rc.3] - 2023-07-31
### Added
- `@distributedlab/reactity` - `extend` ability to extend multiple parents

### Changed
- `@distributedlab/reactity` - `extend` arguments order

## [1.0.0-rc.2] - 2023-07-17
### Fixed
- `@distributedlab/tools` - `Time` `TimeDate` data when the value is in timestamp format

## [1.0.0-rc.1] - 2023-07-17
### Fixed
- `@distributedlab/tools` - `BN` `toDecimals` method when decimals value equals to this decimals value

## [1.0.0-rc.0] - 2023-07-12
### Added
- `@distributedlab/w3p` Test coverage
- `@distributedlab/tools`
  - `BN`
    - `percent, addPercent, subPercent, negated` methods
    - `isNegative, isPositive, raw` getters

### Changed
- `@distributedlab/tools`
  - `BN`
    - migrated to the native `BigInt`
    - uses maximum precision for calculations
    - `isGreaterThan` renamed to `gt`
    - `isGreaterThanOrEqualTo` renamed to `gte`
    - `isLessThan` renamed to `lt`
    - `isLessThanOrEqualTo` renamed to `lte`
    - `isEqualTo` renamed to `eq`
    - default rounding mode is `BN_ROUNDING.HALF_UP`

### Removed
- `@distributedlab/tools` - `bignumber.js` dependency
- `@distributedlab/tools` - `BN` `fromFraction, toFraction, clone` methods
- `@distributedlab/tools` - `BN_ROUNDING.HALF_EVEN` rounding mode
- `@distributedlab/tools` - `BnFormatConfig.secondGroupSize` field

## [0.2.0] - 2023-07-11

## [0.2.0-rc.25] - 2023-07-06
### Added
- `@distributedlab/w3p` - `RawProvider` property

## [0.2.0-rc.24] - 2023-07-05
### Fixed
- `@distributedlab/tools` - `BN.toGreaterDecimals` method returnable instance decimals value

## [0.2.0-rc.23] - 2023-07-05
### Added
- `@distributedlab/tools` - `BN` `toGreaterDecimals`, `toLessDecimals`, `toDecimals` methods

### Fixed
- `root` - Inlining sourcemaps to be able to use debugger

## [0.2.0-rc.22] - 2023-07-05
### Changed
- `@distributedlab/tools` - Extend `TimeDate` type with `Time` instance to be able to use as argument

## [0.2.0-rc.21] - 2023-06-28
### Fixed
- `@distributedlab/fetcher` - Building URL from base URL and endpoint with query params

## [0.2.0-rc.20] - 2023-06-28
### Added
- `@distributedlab/fetcher` - `fetcher` standalone instance

### Fixed
- `@distributedlab/w3p` - Circular dependency

## [0.2.0-rc.19] - 2023-06-09
- `@distributedlab/reactivity` - `extend` hook return type
- `@distributedlab/reactivity` - `ref` hook value argument type

## [0.2.0-rc.18] - 2023-06-08
### Fixed
- `@distributedlab/reactivity` - Redefining issue in the `extend` hook

## [0.2.0-rc.17] - 2023-06-08
### Added
- `@distributedlab/reactivity` - Implementation of the reactivity connections to propagate changes between objects

## [0.2.0-rc.16] - 2023-05-22
### Added
- `@distributedlab/w3p` - `signMessage` method for base-evm provider wrapper

## [0.2.0-rc.15] - 2023-05-19
### Added
- `@distributedlab/tools` - abs method for BN utility

## [0.2.0-rc.14] - 2023-05-18
### Added
- `@distributedlab/w3p`
  - `ProviderDetector` - configuration and custom error handlers passing
  - `handleEthError` - optional custom error handlers

### Fixed
- `@distributedlab/w3p` - `wrapExternalEthProvider` not supported provider listeners

## [0.2.0-rc.13] - 2023-05-18
### Fixed
- `@distributedlab/fetcher` - error building in response
- `@distributedlab/w3p` - invalid providerType getter for fallback evm provider wrapper

## [0.2.0-rc.12] - 2023-05-17
### Fixed
- `@distributedlab/w3p` - `ProviderUserRejectedRequest` error class

## [0.2.0-rc.11] - 2023-05-16
### Added
- `@distributedlab/w3p`
  - EVM fallback provider
  - readme details about custom provider implementation
  - possibility to set details for many supported chains
  - `wrapExternalProvider` method for EVM providers
- `@distributedlab/tools` - `RuntimeError` class

### Changed
- `@distributedlab/w3p`
  - `multiple-providers` examples about adding details for supported chains
  - `SwitchChain` method of `ProviderBase` interface now optional
  - errors classes
  - `handleEthError` method
  - evm `addChain` method
  - `BaseEVMProvider` methods now ain't need try catch anymore

### Removed
- `@distributedlab/w3p` - `RuntimeError` class

## [0.2.0-rc.10] - 2023-05-11
### Changed
- `@distributedlab/w3p` - types, to be more flexible with external provider proxy constructors

## [0.2.0-rc.9] - 2023-05-02
### Fixed
- `all` - Node resolution in the `package.json` files

## [0.2.0-rc.8] - 2023-05-02
### Changed
- `@distributedlab/fetcher` - Moved `query` and `body` arguments of `request` wrapping methods into `opts`
- `@distributedlab/jac` - Moved `query` and `body` arguments of `request` wrapping methods into `opts`
- `root` - Workspace dependency version to be strict equal
- `all` - Migrate to TypeScript 5.0.4

### Fixed
- `@distributedlab/fetcher` - Circular dependencies in the helpers

## [0.2.0-rc.7] - 2023-04-27
### Fixed
- `@distributedlab/fetcher` - Base URL cropping in the case when it has a path

## [0.2.0-rc.6] - 2023-04-25
### Changed
- `@distributedlab/tools` - `EventEmitter` Make emit second parameter optional

## [0.2.0-rc.5] - 2023-04-24
### Removed
- `@distributedlab/jac` - Dependency `@distributedlab/jsona`

### Fixed
- `@distributedlab/fetcher` - `clone` method

## [0.2.0-rc.4] - 2023-04-24
### Added
- `@distributedlab/jac` - `deserialize` helper to deserialize JSON API structures
- `@distributedlab/w3p` - Examples and use-cases

### Removed
- `@distributedlab/jac` - Dependency `@distributedlab/jsona`

## [0.2.0-rc.3] - 2023-04-24
### Added
- `root`: Package `@distributedlab/w3p` - wrapper for web3 providers
  - `EVN based`:
    - `MetamaskProvider`
    - `CoinbaseProvider`
  - `Solana based`:
    - `PhantomProvider`
    - `SolflareProvider`
  - `Near based`:
    - `NearProvider`

### Removed
- `root` - Unused `tsconfig.eslint.json`

## [0.2.0-rc.2] - 2023-04-24
### Added
- `@distributedlab/jac` - Re-export `@distributedlab/fetcher` `HTTP_METHODS, HTTP_STATUS_CODES` enums

### Changed
- `all` - Migrate from `tsc` to `swc` to build packages
- `all` - Migrate from `ts-jest` to `swc-jest` to run tests

### Fixed
- `root` - CI prebuild packages to resolve `@distributedlab/fetcher` dependency in the `@distributedlab/jac` package
- `root` - Prevent typedoc from detecting every index file as a module
- `all` - Replace type imports with `import type` syntax according to the [SWC tsc migration guide]
- `all` - Set "browser": to "./dist/esm/index.js" to correctly resolve the package by the Webpack
- `all` - Moved exclude tests to the `tsconfig.build.json` file to make ESLint work in the tests

## [0.2.0-rc.1] - 2023-04-17
### Added
- `@distributedlab/jac` - `@distributedlab/fetcher` dependency

### Removed
- `@distributedlab/jac` - `axios` dependency

## [0.2.0-rc.0] - 2023-04-05
### Added
- `root` - "Using in the projects made by create-react-app" section in the `README.md`
- `root`: `apply-version` script to easier bump version
- `root`: Package `@distributedlab/fetcher`
- `@distributedlab/tools`: `BN` `sqrt` method

### Changed
- `all`: Drop support for node < 18 versions

## [0.1.7] - 2023-03-20
### Added
- `@distributedlab/jac` - Example if user use a refresh token functionality

## [0.1.7-rc.1] - 2023-03-17
### Changed
- `@distributedlab/jac` - migrate from `jsona` dependency to the `@distributedlab/jsona`

## [0.1.7-rc.0] - 2023-03-17
### Added
- `root`: Contributing guide in the `README.md` file
- `root`: Table of contents in the `README.md` file

### Changed
- `@distributedlab/jac` - `jsona` dependency moved to the `peerDependencies` and `devDependencies`

## [0.1.6] - 2023-03-11
### Added
- `@distributedlab/tools`: `BN` `isEqualTo` compare

### Changed
- `@distributedlab/tools`: `BN` comparing methods

### Fixed
- `@distributedlab/tools`: `BN` return formatted string for value getter instead toString method

## [0.1.5] - 2023-03-09
### Fixed
- `@distributedlab/tools`: `BN` drop unexpected decimal part during multiplication and division

## [0.1.4] - 2023-03-08
### Added
- `@distributedlab/tools`: `BN.clone()` method to safely clone `BN` instance

### Changed
- `@distributedlab/tools`: `BN.valueOf()` method refactored to `value` getter
- `@distributedlab/tools`: `BN.toString()` now return human-readable string
- `@distributedlab/tools`: `BN` types moved to the related directories

### Fixed
- `@distributedlab/tools`: `BN` the exponent value at which `BigNumber.js` returns exponential notation set to 256

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
- `@distributedlab/tools`: Add tests for time.ts and duration.ts

### Changed
- `root`: Updated `README.md`


[SWC tsc migration guide]: https://swc.rs/docs/migrating-from-tsc
[old repo]: https://github.com/distributed-lab/web-kit-old

[Unreleased]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.16...HEAD
[1.0.0-rc.16]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.15...1.0.0-rc.16
[1.0.0-rc.15]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.14...1.0.0-rc.15
[1.0.0-rc.14]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.13...1.0.0-rc.14
[1.0.0-rc.13]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.12...1.0.0-rc.13
[1.0.0-rc.12]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.11...1.0.0-rc.12
[1.0.0-rc.11]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.10...1.0.0-rc.11
[1.0.0-rc.10]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.9...1.0.0-rc.10
[1.0.0-rc.9]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.8...1.0.0-rc.9
[1.0.0-rc.8]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.7...1.0.0-rc.8
[1.0.0-rc.7]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.6...1.0.0-rc.7
[1.0.0-rc.6]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.5...1.0.0-rc.6
[1.0.0-rc.5]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.4...1.0.0-rc.5
[1.0.0-rc.4]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.3...1.0.0-rc.4
[1.0.0-rc.3]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.2...1.0.0-rc.3
[1.0.0-rc.2]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.1...1.0.0-rc.2
[1.0.0-rc.1]: https://github.com/distributed-lab/web-kit/compare/1.0.0-rc.0...1.0.0-rc.1
[1.0.0-rc.0]: https://github.com/distributed-lab/web-kit/compare/0.2.0...1.0.0-rc.0
[0.2.0]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.25...0.2.0
[0.2.0-rc.25]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.24...0.2.0-rc.25
[0.2.0-rc.24]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.23...0.2.0-rc.24
[0.2.0-rc.23]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.22...0.2.0-rc.23
[0.2.0-rc.22]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.21...0.2.0-rc.22
[0.2.0-rc.21]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.20...0.2.0-rc.21
[0.2.0-rc.20]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.19...0.2.0-rc.20
[0.2.0-rc.19]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.18...0.2.0-rc.19
[0.2.0-rc.18]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.17...0.2.0-rc.18
[0.2.0-rc.17]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.16...0.2.0-rc.17
[0.2.0-rc.16]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.15...0.2.0-rc.16
[0.2.0-rc.15]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.14...0.2.0-rc.15
[0.2.0-rc.14]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.13...0.2.0-rc.14
[0.2.0-rc.13]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.12...0.2.0-rc.13
[0.2.0-rc.12]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.11...0.2.0-rc.12
[0.2.0-rc.11]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.10...0.2.0-rc.11
[0.2.0-rc.10]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.9...0.2.0-rc.10
[0.2.0-rc.9]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.8...0.2.0-rc.9
[0.2.0-rc.8]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.7...0.2.0-rc.8
[0.2.0-rc.7]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.6...0.2.0-rc.7
[0.2.0-rc.6]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.5...0.2.0-rc.6
[0.2.0-rc.5]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.4...0.2.0-rc.5
[0.2.0-rc.4]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.3...0.2.0-rc.4
[0.2.0-rc.3]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.2...0.2.0-rc.3
[0.2.0-rc.2]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.1...0.2.0-rc.2
[0.2.0-rc.1]: https://github.com/distributed-lab/web-kit/compare/0.2.0-rc.0...0.2.0-rc.1
[0.2.0-rc.0]: https://github.com/distributed-lab/web-kit/compare/0.1.7...0.2.0-rc.0
[0.1.7]: https://github.com/distributed-lab/web-kit/compare/0.1.7-rc.1...0.1.7
[0.1.7-rc.1]: https://github.com/distributed-lab/web-kit/compare/0.1.7-rc.0...0.1.7-rc.1
[0.1.7-rc.0]: https://github.com/distributed-lab/web-kit/compare/0.1.6...0.1.7-rc.0
[0.1.6]: https://github.com/distributed-lab/web-kit/compare/0.1.5...0.1.6
[0.1.5]: https://github.com/distributed-lab/web-kit/compare/0.1.4...0.1.5
[0.1.4]: https://github.com/distributed-lab/web-kit/compare/0.1.3...0.1.4
[0.1.3]: https://github.com/distributed-lab/web-kit/compare/0.1.2...0.1.3
[0.1.2]: https://github.com/distributed-lab/web-kit/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/distributed-lab/web-kit/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/distributed-lab/web-kit/releases/tag/0.1.0
