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

- 🚀 Quick management of your application configurations & local project configurations
- 🧰 Easy to use CLI interface
- 🔗 Support symlink mode (experimental)
- 🧹 WIP: Auto cleanup when uninstalling

## Usage

Install globally with node package manager (bun, npm, yarn, pnpm, etc.):

```sh
bun install starship-butler -g
```

Run the cli and get help info with `--help` flag:

```sh
butler --help
```

### Preset

Command `preset` helps you to preset your application configurations.

```sh
butler preset [...options]
```

Applying all presets:

```sh
butler preset --all
```

Specifying included preset id pattern:

```sh
butler preset --include <preset_id_pattern>
```

See help info for more details:

```sh
butler preset --help
```

### Set

Command `Set` helps you to set local project configurations.

```sh
butler set <source_pattern> <target> [...options]
```

If `source_pattern` does not contain `/` character, it will be automatically prefix with `**` in
order to match files in all sub-directories simply. For example, `butler set .eslintrc.json ./project/` will be treated as `butler set **/.eslintrc.json ./project/`.

Notice that `target` must be a directory. If `target` is not existed yet, you must postfix it with `/` character to indicate it's a directory, or butler will treat it as a file path. For example, `butler set .eslintrc.json ./project` will copy the matched file to `.` and rename it to `project`.

See help info for more details:

```sh
butler set --help
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/lumirelle/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/lumirelle/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](../../LICENSE.md) License © [Lumirelle](https://github.com/lumirelle)

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
[license-href]: https://github.com/lumirelle/starship-butler/blob/main/LICENSE.md
