---
title: preconnect
---

<Intro>

`preconnect` cho phép bạn chủ động kết nối đến một máy chủ mà bạn dự kiến sẽ tải tài nguyên từ đó.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

Để preconnect đến một host, hãy gọi hàm `preconnect` từ `react-dom`.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm `preconnect` cung cấp cho trình duyệt một gợi ý rằng trình duyệt nên mở kết nối đến máy chủ được chỉ định. Nếu trình duyệt chọn làm vậy, việc này có thể tăng tốc độ tải tài nguyên từ máy chủ đó.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của máy chủ mà bạn muốn kết nối đến.


#### Giá trị trả về {/*returns*/}

`preconnect` không trả về gì.

#### Lưu ý {/*caveats*/}

* Nhiều lần gọi `preconnect` với cùng một máy chủ có tác dụng giống như một lần gọi duy nhất.
* Trong trình duyệt, bạn có thể gọi `preconnect` trong mọi tình huống: khi render một component, trong một Effect, trong một event handler, v.v.
* Khi server-side rendering hoặc khi render Server Components, `preconnect` chỉ có tác dụng nếu bạn gọi nó trong khi render một component hoặc trong một ngữ cảnh async bắt nguồn từ việc render một component. Mọi lệnh gọi khác sẽ bị bỏ qua.
* Nếu biết chính xác các tài nguyên mình sẽ cần, thay vào đó bạn có thể gọi [các hàm khác](/reference/react-dom/#resource-preloading-apis) để bắt đầu tải tài nguyên ngay lập tức.
* Không có lợi ích gì khi preconnect đến cùng máy chủ đang lưu trữ chính trang web, vì trang web đã kết nối đến máy chủ đó trước khi gợi ý này được đưa ra.

---

## Cách dùng {/*usage*/}

### Preconnect khi render {/*preconnecting-when-rendering*/}

Hãy gọi `preconnect` khi render một component nếu bạn biết các component con của nó sẽ tải tài nguyên bên ngoài từ host đó.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### Preconnect trong event handler {/*preconnecting-in-an-event-handler*/}

Hãy gọi `preconnect` trong một event handler trước khi chuyển sang một trang hoặc state mà tại đó sẽ cần các tài nguyên bên ngoài. Việc này khởi động quá trình sớm hơn so với khi bạn gọi nó trong lúc render trang hoặc state mới.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```