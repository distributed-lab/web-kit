<h1><p align="center"><img alt="Distributed Lab | Web-Kit" src="https://raw.githubusercontent.com/distributed-lab/web-kit/main/assets/logo.png" width="876" /></p></h1>

<div align="center">
  <a href="https://github.com/distributed-lab/web-kit/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/github/license/distributed-lab/web-kit.svg" />
  </a>
</div>

# Distributed Lab | Web-Kit

TypeScript-based various types of solutions for [Distributed Lab](https://distributedlab.com/) projects and not only.

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/distributed-lab/web-kit/blob/main/CHANGELOG.md).


## Packages

The Distributed Lab Web-Kit is a library that consists of many smaller NPM packages within the
[@distributedlab namespace](https://www.npmjs.com/org/distributedlab), a so-called monorepo.

Here are the packages in the namespace:

| Package                                                                                               | Description                                                          | Latest                                                                                                                        |
|-------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| [@distributedlab/jac](https://distributed-lab.github.io/web-kit/modules/_distributedlab_jac.html)     | A library for constructing JSON-API compliant requests and responses | [![npm version](https://img.shields.io/npm/v/@distributedlab/jac.svg)](https://www.npmjs.com/package/@distributedlab/jac)     |
| [@distributedlab/tools](https://distributed-lab.github.io/web-kit/modules/_distributedlab_tools.html) | Collection of common utility functions and classes                   | [![npm version](https://img.shields.io/npm/v/@distributedlab/tools.svg)](https://www.npmjs.com/package/@distributedlab/tools) |

## Development

### Editors

#### VSCode

To get ESLint and Prettier working in VSCode, install [ESLint extension] and add the following to your settings.json:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "eslint.validate": [
    "javascript",
    "typescript"
  ],
  "eslint.alwaysShowStatus": true,
  "eslint.packageManager": "yarn",
  "eslint.workingDirectories": [{ "mode": "auto" }]
}
```


[ESLint extension]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

#### WebStorm

To get ESLint and Prettier working in WebStorm, go to `Preferences > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint` and check the following:
- `Run eslint --fix on save` enabled
- `Automatic ESLint configuration` enabled
- `{**/*,*}.{js,ts}` in `Run for files` field


### Dependencies

#### Local dependencies

To install all dependencies, run:
```bash
yarn install
```

If you are implementing a new package which needs to depend on the local package, you can use the following command to install it:
```bash
yarn workspace @distributedlab/target-package add @distributedlab/package-to-add
```

To install a dependency to all packages, use the following command:
```bash
yarn workspaces foreach -pt run add @distributedlab/package-to-add
```

#### Testing dependencies

To test the packages, you need:

1. Build the packages:

    ```bash
    yarn build
    ```
2. Switch yarn to version berry in the project where you want to test package, to yarn be able to resolve workspace dependencies:

    ```bash
    yarn set version berry
    ```
3. Add this to the `.yarnrc.yml` file:

    ```yaml
    nodeLinker: node-modules
    ```
4. Link the packages to the project:

    ```bash
    yarn link -p -A /path/to/web-kit/root/directory
    ```
5. Add dependencies to the package.json file:

    ```json
    {
      "dependencies": {
        "@distributedlab/jac": "*"
      }
    }
    ```

6. Install the dependencies:
    ```bash
    yarn install
    ```

### Basics

#### Build

```bash
yarn build
```

#### Run tests

```bash
yarn test
```

#### Run linter

```bash
yarn lint
```

#### Check release version

```bash
yarn rsc 0.1.0
```

### Resources
- [Yarn Berry](https://yarnpkg.com/cli/install)
- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Web-Kit TypeDoc](https://distributed-lab.github.io/web-kit)
