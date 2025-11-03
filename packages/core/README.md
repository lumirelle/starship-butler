# Starship Butler

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> [!NOTE]
>
> This is an "opinionated" "butler", so that it's not suitable for everyone.

Your best butler, helping you manage the whole development "starship". 😃

## Features

- 🚀 Quick management of your system & local project configurations
- 🧰 Easy to use CLI interface
- 🔗 Support symlink mode (experimental)
- 🧹 WIP: Auto cleanup when uninstalling

## Usage

Install globally with node package manager (npm, yarn, pnpm, etc.):

```sh
npm install starship-butler -g
```

Run the cli and get help info with `--help` flag:

```sh
butler --help
```

### Configure System

Command `configure-system` (with alias `cfsys`) helps you to set up system-level configurations.

```sh
butler configure-system [...options]
```

See help info for more details:

```sh
butler configure-system --help
```

### Configure

Command `configure` (with alias `cf`) helps you to set up local project configurations.

```sh
butler configure <sourcePattern> <target> [...options]
```

`sourcePattern` is support both file path and glob pattern.

If `sourcePattern` is a file path (which does not contain `/` character), butler will automatically prefix with `**` in
order to match files in all sub-directories.

This behavior is designed for better user experience, so that users don't need to type long glob patterns manually.

See help info for more details:

```sh
butler configure --help
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/lumirelle/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/lumirelle/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © [Lumirelle](https://github.com/lumirelle)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/starship-butler?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/starship-butler
[npm-downloads-src]: https://img.shields.io/npm/dm/starship-butler?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/starship-butler
[bundle-src]: https://img.shields.io/bundlephobia/minzip/starship-butler?style=flat&colorA=18181B&colorB=F0DB4F&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=starship-butler
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/starship-butler
[codecov-src]: https://img.shields.io/codecov/c/gh/lumirelle/starship-butler/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/lumirelle/starship-butler
[license-src]: https://img.shields.io/github/license/lumirelle/starship-butler.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/lumirelle/starship-butler/blob/main/LICENSE
