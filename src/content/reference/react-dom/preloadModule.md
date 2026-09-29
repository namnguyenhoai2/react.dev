---
title: preloadModule
---

<Note>

[các framework dựa trên React](/learn/creating-a-react-app) thường xử lý việc tải tài nguyên thay cho bạn, vì vậy bạn có thể không cần tự gọi API này. Hãy xem tài liệu của framework để biết chi tiết.

</Note>

<Intro>

`preloadModule` cho phép bạn eager fetch một module ESM mà bạn dự kiến sẽ sử dụng.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

Để preload một module ESM, hãy gọi hàm `preloadModule` từ `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm `preloadModule` cung cấp cho trình duyệt một gợi ý rằng trình duyệt nên bắt đầu tải xuống module đã cho, nhờ đó có thể tiết kiệm thời gian.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của module bạn muốn tải xuống.
* `options`: một object. Object này chứa các thuộc tính sau:
  *  `as`: một chuỗi bắt buộc. Giá trị phải là `'script'`.
  *  `crossOrigin`: một chuỗi. [chính sách CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) cần sử dụng. Các giá trị có thể có là `anonymous` và `use-credentials`.
  *  `integrity`: một chuỗi. Một mã hash mật mã của module, để [xác minh tính xác thực](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) của module.
  *  `nonce`: một chuỗi. Một [nonce mật mã để cho phép module](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Content Security Policy nghiêm ngặt.


#### Giá trị trả về {/*returns*/}

`preloadModule` không trả về gì.

#### Lưu ý {/*caveats*/}

* Nhiều lần gọi `preloadModule` với cùng `href` có tác dụng giống như một lần gọi.
* Trong trình duyệt, bạn có thể gọi `preloadModule` trong bất kỳ tình huống nào: khi đang render một component, trong một Effect, trong một event handler, v.v.
* Trong server-side rendering hoặc khi render Server Components, `preloadModule` chỉ có tác dụng nếu bạn gọi nó khi đang render một component hoặc trong một async context bắt nguồn từ việc render một component. Mọi lệnh gọi khác sẽ bị bỏ qua.

---

## Cách sử dụng {/*usage*/}

### Preload khi render {/*preloading-when-rendering*/}

Hãy gọi `preloadModule` khi render một component nếu bạn biết component đó hoặc các component con của nó sẽ sử dụng một module cụ thể.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Nếu muốn trình duyệt bắt đầu thực thi module ngay lập tức thay vì chỉ tải xuống module, hãy sử dụng [`preinitModule`](/reference/react-dom/preinitModule) thay thế. Nếu muốn tải một script không phải là module ESM, hãy sử dụng [`preload`](/reference/react-dom/preload).

### Preload trong event handler {/*preloading-in-an-event-handler*/}

Hãy gọi `preloadModule` trong một event handler trước khi chuyển sang một trang hoặc state mà module sẽ cần đến. Cách này bắt đầu quá trình sớm hơn so với việc gọi nó trong khi render trang hoặc state mới.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```