<p align="center"><b>React Notification Library</b><br/>(Inspired by iOS)</p>

<p align="center">
  <a href="https://github.com/ykadosh/notify">
    <img src="https://img.shields.io/bundlephobia/minzip/@yoavik/notify?color=4ba0f6&label=gzipped" />
  </a>

  <a href="https://www.npmjs.com/package/@yoavik/notify">
    <img src="https://img.shields.io/npm/v/@yoavik/notify?color=4ba0f6" />
  </a>

  <a href="https://www.npmjs.com/package/@yoavik/notify">
    <img src="https://img.shields.io/npm/dw/@yoavik/notify?color=4ba0f6" />
  </a>

  <a href="https://www.npmjs.com/package/@yoavik/notify">
    <img src="https://img.shields.io/badge/TypeScript-included-4ba0f6" />
  </a>
</p>

<p align="center">:construction: This package is under active development. :construction: <br/>Some APIs are likely to break.</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/7763083/206893739-7807e967-421b-4cdc-b009-1af8f2c076b5.gif" />
</p>

```
npm i @yoavik/notify
```

```ts
import { useNotify } from '@yoavik/notify';
const { add } = useNotify();
add({
  title: 'Some title',
  content: 'Some content',
  timeout: 5000,
});
```

<p align="center">
  <a href="https://codesandbox.io/s/yoavik-notify-example-qlcuui">
    <img src="https://img.shields.io/badge/Try_on_Codesandbox-4ba0f6?style=for-the-badge"/>
  </a>
</p>
