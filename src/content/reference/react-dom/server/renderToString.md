---
title: renderToString
---

<Pitfall>

`renderToString` không hỗ trợ streaming hoặc chờ dữ liệu. [Xem các giải pháp thay thế.](#alternatives)

</Pitfall>

<Intro>

`renderToString` render một cây React thành chuỗi HTML.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

Trên server, gọi `renderToString` để render ứng dụng của bạn thành HTML.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

Trên client, gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML do server tạo trở nên tương tác được.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một React node mà bạn muốn render thành HTML. Ví dụ: một JSX node như `<App />`.

* **tùy chọn** `options`: Một object dùng cho việc render trên server.
  * **tùy chọn** `identifierPrefix`: Một chuỗi tiền tố mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều root trên cùng một trang. Phải giống với tiền tố được truyền vào [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### Giá trị trả về {/*returns*/}

Một chuỗi HTML.

#### Lưu ý {/*caveats*/}

* `renderToString` chỉ hỗ trợ Suspense ở mức hạn chế. Nếu một component suspend, `renderToString` sẽ ngay lập tức gửi fallback của component đó dưới dạng HTML.

* `renderToString` hoạt động trong trình duyệt, nhưng sử dụng nó trong client code là [không được khuyến nghị.](#removing-rendertostring-from-the-client-code)

---

## Cách sử dụng {/*usage*/}

### Render một cây React thành chuỗi HTML {/*rendering-a-react-tree-as-html-to-a-string*/}

Gọi `renderToString` để render ứng dụng của bạn thành một chuỗi HTML mà bạn có thể gửi cùng với response từ server:

```js {5-6}
import { renderToString } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

Thao tác này sẽ tạo ra HTML ban đầu, không có tính tương tác, của các React component. Trên client, bạn sẽ cần gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để *hydrate* HTML do server tạo và làm cho nó trở nên tương tác được.


<Pitfall>

`renderToString` không hỗ trợ streaming hoặc chờ dữ liệu. [Xem các giải pháp thay thế.](#alternatives)

</Pitfall>

---

## Giải pháp thay thế {/*alternatives*/}

### Chuyển từ `renderToString` sang streaming render trên server {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` trả về một chuỗi ngay lập tức, vì vậy không hỗ trợ streaming nội dung trong khi nội dung đó đang được tải.

Khi có thể, chúng tôi khuyến nghị sử dụng các giải pháp thay thế đầy đủ tính năng sau:

* Nếu bạn sử dụng Node.js, hãy sử dụng [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)
* Nếu bạn sử dụng Deno hoặc một edge runtime hiện đại có [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), hãy sử dụng [`renderToReadableStream`.](/reference/react-dom/server/renderToReadableStream)

Bạn vẫn có thể tiếp tục sử dụng `renderToString` nếu môi trường server của bạn không hỗ trợ streams.

---

### Chuyển từ `renderToString` sang static prerender trên server {/*migrating-from-rendertostring-to-a-static-prerender-on-the-server*/}

`renderToString` trả về một chuỗi ngay lập tức, vì vậy không hỗ trợ chờ dữ liệu tải xong để tạo HTML tĩnh.

Chúng tôi khuyến nghị sử dụng các giải pháp thay thế đầy đủ tính năng sau:

* Nếu bạn sử dụng Node.js, hãy sử dụng [`prerenderToNodeStream`.](/reference/react-dom/static/prerenderToNodeStream)
* Nếu bạn sử dụng Deno hoặc một edge runtime hiện đại có [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), hãy sử dụng [`prerender`.](/reference/react-dom/static/prerender)

Bạn vẫn có thể tiếp tục sử dụng `renderToString` nếu môi trường tạo static site của bạn không hỗ trợ streams.

---

### Loại bỏ `renderToString` khỏi client code {/*removing-rendertostring-from-the-client-code*/}

Đôi khi, `renderToString` được sử dụng trên client để chuyển đổi một component thành HTML.

```js {1-2}
// 🚩 Unnecessary: using renderToString on the client
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // For example, "<svg>...</svg>"
```

Việc import `react-dom/server` **trên client** làm tăng kích thước bundle một cách không cần thiết và nên tránh. Nếu bạn cần render một component thành HTML trong trình duyệt, hãy sử dụng [`createRoot`](/reference/react-dom/client/createRoot) rồi đọc HTML từ DOM:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // For example, "<svg>...</svg>"
```

Lệnh gọi [`flushSync`](/reference/react-dom/flushSync) là cần thiết để DOM được cập nhật trước khi đọc thuộc tính [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) của nó.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Khi một component suspend, HTML luôn chứa fallback {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` không hỗ trợ đầy đủ Suspense.

Nếu một component suspend (ví dụ: vì component đó được định nghĩa bằng [`lazy`](/reference/react/lazy) hoặc fetch dữ liệu), `renderToString` sẽ không chờ nội dung của component đó được resolve. Thay vào đó, `renderToString` sẽ tìm boundary [`<Suspense>`](/reference/react/Suspense) gần nhất ở phía trên nó và render prop `fallback` của boundary đó vào HTML. Nội dung sẽ không xuất hiện cho đến khi client code được tải.

Để giải quyết vấn đề này, hãy sử dụng một trong các giải pháp streaming [được khuyến nghị.](#alternatives) Đối với server-side rendering, các giải pháp này có thể stream nội dung theo từng chunk khi nội dung được resolve trên server, để người dùng thấy trang được điền dần trước khi client code được tải. Đối với static site generation, các giải pháp này có thể chờ toàn bộ nội dung được resolve trước khi tạo HTML tĩnh.