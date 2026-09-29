---
title: preinit
---

<Note>

[Các framework dựa trên React](/learn/creating-a-react-app) thường tự xử lý việc tải tài nguyên cho bạn, vì vậy có thể bạn không cần tự gọi API này. Hãy xem tài liệu của framework để biết thêm chi tiết.

</Note>

<Intro>

`preinit` cho phép bạn eager fetch và đánh giá một stylesheet hoặc external script.

```js
preinit("https://example.com/script.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

Để preinit một script hoặc stylesheet, hãy gọi hàm `preinit` từ `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm `preinit` cung cấp cho trình duyệt một gợi ý rằng trình duyệt nên bắt đầu tải xuống và thực thi tài nguyên đã cho, nhờ đó có thể tiết kiệm thời gian. Các script mà bạn `preinit` sẽ được thực thi ngay khi tải xuống xong. Các stylesheet được preinit sẽ được chèn vào document, khiến chúng có hiệu lực ngay lập tức.

#### Tham số {/*parameters*/}

* `href`: một string. URL của tài nguyên bạn muốn tải xuống và thực thi.
* `options`: một object. Object này chứa các thuộc tính sau:
  *  `as`: một string bắt buộc. Loại tài nguyên. Các giá trị có thể là `script` và `style`.
  *  `precedence`: một string. Bắt buộc với stylesheet. Cho biết vị trí chèn stylesheet so với các stylesheet khác. Stylesheet có precedence cao hơn có thể ghi đè stylesheet có precedence thấp hơn. Các giá trị có thể là `reset`, `low`, `medium`, `high`.
  *  `crossOrigin`: một string. Chính sách [CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) cần sử dụng. Các giá trị có thể là `anonymous` và `use-credentials`.
  *  `integrity`: một string. Một cryptographic hash của tài nguyên, dùng để [xác minh tính xác thực](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) của tài nguyên.
  *  `nonce`: một string. Một cryptographic [nonce cho phép tài nguyên](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Content Security Policy nghiêm ngặt.
  *  `fetchPriority`: một string. Đề xuất mức độ ưu tiên tương đối khi tải tài nguyên. Các giá trị có thể là `auto` (mặc định), `high` và `low`.

#### Giá trị trả về {/*returns*/}

`preinit` không trả về gì.

#### Lưu ý {/*caveats*/}

* Gọi `preinit` nhiều lần với cùng `href` sẽ có tác dụng giống như gọi một lần.
* Trong trình duyệt, bạn có thể gọi `preinit` trong mọi tình huống: khi render một component, trong một Effect, trong một event handler, v.v.
* Khi server-side rendering hoặc render Server Components, `preinit` chỉ có tác dụng nếu bạn gọi nó trong khi render một component hoặc trong một async context bắt nguồn từ việc render một component. Mọi lệnh gọi khác sẽ bị bỏ qua.

---

## Cách sử dụng {/*usage*/}

### Preinit khi render {/*preiniting-when-rendering*/}

Gọi `preinit` khi render một component nếu bạn biết component đó hoặc các component con của nó sẽ sử dụng một tài nguyên cụ thể, và bạn chấp nhận việc tài nguyên được đánh giá, qua đó có hiệu lực ngay sau khi tải xuống.

<Recipes titleText="Examples of preiniting">

#### Preinit external script {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Nếu muốn trình duyệt tải xuống script nhưng chưa thực thi script ngay, hãy sử dụng [`preload`](/reference/react-dom/preload) thay thế. Nếu muốn tải một ESM module, hãy sử dụng [`preinitModule`](/reference/react-dom/preinitModule).

<Solution />

#### Preinit stylesheet {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

Tùy chọn `precedence`, vốn là tùy chọn bắt buộc, cho phép bạn kiểm soát thứ tự của các stylesheet trong document. Stylesheet có precedence cao hơn có thể ghi đè stylesheet có precedence thấp hơn.

Nếu muốn tải xuống stylesheet nhưng chưa chèn stylesheet vào document ngay, hãy sử dụng [`preload`](/reference/react-dom/preload) thay thế.

<Solution />

</Recipes>

### Preinit trong event handler {/*preiniting-in-an-event-handler*/}

Gọi `preinit` trong một event handler trước khi chuyển sang page hoặc state nơi các external resource sẽ cần thiết. Việc này bắt đầu quá trình sớm hơn so với khi bạn gọi hàm trong lúc render page hoặc state mới.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```