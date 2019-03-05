# @use-firebase/database

A custom React Hook that impliments Firebase's Database object.

[![npm version](https://badge.fury.io/js/%40use-firebase%2Fdatabase.svg)](https://badge.fury.io/js/%40use-firebase%2Fdatabase)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

## Installation

```bash
$ npm i @use-firebase/database
```

or

```bash
$ yarn add @use-firebase/database
```

Currently only `useValue` for a single database ref is supported.
Complete support is planned.

## API

### `useValue`

For now, here is a basic setup. This will likely change in the future.

```js
const [value, setValue] = useValue(path);
```

#### Parameters

Here are the parameters that you can use.

| Parameter  | Description                              |
| :--------- | :--------------------------------------- |
| `path`     | A string path to the value in Firebase.  |

#### Return

`useValue` returns a `useState` compatible array that you can deconstruct into `value` and `setValue`.

| Parameter  | Description                                                                                                                                                                                                                                                                       |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`    | The value from the Firebase database at `path`. If the path is invalid, or the data is not yet read from thje cloud, a `null` is returned.                                                                                                                                        |
| `setValue` | A function that accepts a single patameter that is the data sent to Firebase. It returns a promise that resolves when the data is saved in the cloud. `value` will immediately reflect the new value from calling `setValue` (i.e. no round trip required to see a new `value`). |

#### Example

TODO

## Live demo

TODO

## License

**[MIT](LICENSE)** Licensed
