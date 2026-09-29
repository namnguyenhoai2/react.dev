---
title: preinitModule
---

<Note>

[Các framework dựa trên React](/learn/creating-a-react-app) thường xử lý việc tải tài nguyên cho bạn, vì vậy có thể bạn không cần tự gọi API này. Hãy tham khảo tài liệu của framework để biết thêm chi tiết.

</Note>

<Intro>

`preinitModule` cho phép bạn eagerly fetch và đánh giá một module ESM.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

Để preinit một module ESM, hãy gọi hàm `preinitModule` từ `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm `preinitModule` cung cấp cho trình duyệt một gợi ý rằng trình duyệt nên bắt đầu tải xuống và thực thi module đã cho, từ đó có thể tiết kiệm thời gian. Các module mà bạn `preinit` sẽ được thực thi ngay khi tải xuống xong.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của module mà bạn muốn tải xuống và thực thi.
* `options`: một object. Đối tượng này chứa các thuộc tính sau:
  *  `as`: một chuỗi bắt buộc. Giá trị phải là `'script'`.
  *  `crossOrigin`: một chuỗi. Chính sách [CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) cần sử dụng. Các giá trị có thể có là `anonymous` và `use-credentials`.
  *  `integrity`: một chuỗi. Hash mật mã của module, dùng để [xác minh tính xác thực](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) của module.
  *  `nonce`: một chuỗi. Một [nonce mật mã cho phép module](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Content Security Policy nghiêm ngặt.

#### Giá trị trả về {/*returns*/}

`preinitModule` không trả về gì.

#### Lưu ý {/*caveats*/}

* Nhiều lần gọi `preinitModule` với cùng `href` có tác dụng giống như một lần gọi duy nhất.
* Trong trình duyệt, bạn có thể gọi `preinitModule` trong bất kỳ tình huống nào: khi render một component, trong một Effect, trong một event handler, v.v.
* Khi server-side rendering hoặc render Server Components, `preinitModule` chỉ có tác dụng nếu bạn gọi nó trong khi render một component hoặc trong một async context bắt nguồn từ việc render một component. Mọi lệnh gọi khác sẽ bị bỏ qua.

---

## Cách sử dụng {/*usage*/}

### Preloading khi render {/*preloading-when-rendering*/}

Hãy gọi `preinitModule` khi render một component nếu bạn biết component đó hoặc các component con của nó sẽ sử dụng một module cụ thể và bạn chấp nhận việc module được đánh giá, từ đó có hiệu lực ngay khi được tải xuống.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Nếu muốn trình duyệt tải module xuống nhưng chưa thực thi module ngay, hãy sử dụng [`preloadModule`](/reference/react-dom/preloadModule) thay thế. Nếu muốn preinit một script không phải là module ESM, hãy sử dụng [`preinit`](/reference/react-dom/preinit).

### Preloading trong event handler {/*preloading-in-an-event-handler*/}

Hãy gọi `preinitModule` trong một event handler trước khi chuyển sang trang hoặc state mà module sẽ được yêu cầu. Việc này bắt đầu quá trình sớm hơn so với khi bạn gọi nó trong lúc render trang hoặc state mới.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```