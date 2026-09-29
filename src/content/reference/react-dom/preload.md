---
title: preload
---

<Note>

[các framework dựa trên React](/learn/creating-a-react-app) thường xử lý việc tải tài nguyên giúp bạn, vì vậy bạn có thể không cần tự gọi API này. Hãy tham khảo tài liệu của framework để biết thêm chi tiết.

</Note>

<Intro>

`preload` cho phép bạn eager fetch một tài nguyên, chẳng hạn như stylesheet, font hoặc external script mà bạn dự kiến sẽ sử dụng.

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `preload(href, options)` {/*preload*/}

Để preload một tài nguyên, hãy gọi hàm `preload` từ `react-dom`.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm `preload` cung cấp cho trình duyệt một gợi ý rằng trình duyệt nên bắt đầu tải xuống tài nguyên được chỉ định, nhờ đó có thể tiết kiệm thời gian.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của tài nguyên bạn muốn tải xuống.
* `options`: một object. Object này chứa các thuộc tính sau:
  *  `as`: một chuỗi bắt buộc. Loại tài nguyên. Các [giá trị có thể có](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as) của thuộc tính này là `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
  *  `crossOrigin`: một chuỗi. [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) cần sử dụng. Các giá trị có thể có là `anonymous` và `use-credentials`. Thuộc tính này bắt buộc khi `as` được đặt thành `"fetch"`.
  *  `referrerPolicy`: một chuỗi. [Referrer header](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) cần gửi khi fetch. Các giá trị có thể có là `no-referrer-when-downgrade` (mặc định), `no-referrer`, `origin`, `origin-when-cross-origin` và `unsafe-url`.
  *  `integrity`: một chuỗi. Hàm băm mật mã của tài nguyên, dùng để [xác minh tính xác thực của tài nguyên](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `type`: một chuỗi. MIME type của tài nguyên.
  *  `nonce`: một chuỗi. Một [nonce mật mã cho phép tài nguyên](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Content Security Policy nghiêm ngặt.
  *  `fetchPriority`: một chuỗi. Đề xuất mức độ ưu tiên tương đối khi fetch tài nguyên. Các giá trị có thể có là `auto` (mặc định), `high` và `low`.
  *  `imageSrcSet`: một chuỗi. Chỉ sử dụng với `as: "image"`. Chỉ định [source set của hình ảnh](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
  *  `imageSizes`: một chuỗi. Chỉ sử dụng với `as: "image"`. Chỉ định [kích thước của hình ảnh](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

#### Giá trị trả về {/*returns*/}

`preload` không trả về gì.

#### Lưu ý {/*caveats*/}

* Nhiều lần gọi tương đương đến `preload` có cùng tác dụng như một lần gọi. Các lần gọi đến `preload` được xem là tương đương theo các quy tắc sau:
  * Hai lần gọi tương đương nếu chúng có cùng `href`, ngoại trừ:
  * Nếu `as` được đặt thành `image`, hai lần gọi tương đương nếu chúng có cùng `href`, `imageSrcSet` và `imageSizes`.
* Trong trình duyệt, bạn có thể gọi `preload` trong mọi tình huống: khi render component, trong Effect, trong event handler, v.v.
* Khi server-side rendering hoặc render Server Components, `preload` chỉ có tác dụng nếu bạn gọi nó trong khi render một component hoặc trong một async context bắt nguồn từ việc render một component. Mọi lần gọi khác sẽ bị bỏ qua.

---

## Cách sử dụng {/*usage*/}

### Preload khi render {/*preloading-when-rendering*/}

Gọi `preload` khi render một component nếu bạn biết component đó hoặc các component con của nó sẽ sử dụng một tài nguyên cụ thể.

<Recipes titleText="Examples of preloading">

#### Preload external script {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Nếu muốn trình duyệt bắt đầu thực thi script ngay lập tức (thay vì chỉ tải xuống), hãy sử dụng [`preinit`](/reference/react-dom/preinit) thay thế. Nếu muốn load một ESM module, hãy sử dụng [`preloadModule`](/reference/react-dom/preloadModule).

<Solution />

#### Preload stylesheet {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

Nếu muốn stylesheet được chèn ngay vào document (nghĩa là trình duyệt sẽ bắt đầu parse stylesheet ngay lập tức thay vì chỉ tải xuống), hãy sử dụng [`preinit`](/reference/react-dom/preinit) thay thế.

<Solution />

#### Preload font {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

Nếu preload một stylesheet, bạn cũng nên preload mọi font mà stylesheet đó tham chiếu. Nhờ vậy, trình duyệt có thể bắt đầu tải xuống font trước khi stylesheet được tải xuống và parse.

<Solution />

#### Preload hình ảnh {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

Khi preload một hình ảnh, các tùy chọn `imageSrcSet` và `imageSizes` giúp trình duyệt [fetch hình ảnh có kích thước phù hợp với kích thước màn hình](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

<Solution />

</Recipes>

### Preload trong event handler {/*preloading-in-an-event-handler*/}

Gọi `preload` trong một event handler trước khi chuyển sang trang hoặc state nơi cần các tài nguyên bên ngoài. Việc này bắt đầu quá trình sớm hơn so với khi bạn gọi nó trong lúc render trang hoặc state mới.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```