---
title: resumeToPipeableStream
---

<Intro>

`resumeToPipeableStream` stream một cây React đã được pre-render  tới một [Node.js Stream.](https://nodejs.org/api/stream.html)

```js
const {pipe, abort} = await resumeToPipeableStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

API này dành riêng cho Node.js. Các môi trường có [Web Streams,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) như Deno và các edge runtime hiện đại nên sử dụng [`resume`](/reference/react-dom/server/renderToReadableStream) thay thế.

</Note>

---

## Tham chiếu {/*reference*/}

### `resumeToPipeableStream(node, postponed, options?)` {/*resume-to-pipeable-stream*/}

Gọi `resumeToPipeableStream` để tiếp tục render một cây React đã được pre-render dưới dạng HTML vào một [Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { resumeToPipeableStream } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, response) {
  const postponed = await getPostponedState(request);
  const {pipe} = resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    }
  });
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: React node mà bạn đã gọi `prerender` với nó. Ví dụ: một phần tử JSX như `<App />`. Node này được kỳ vọng đại diện cho toàn bộ document, vì vậy component `App` phải render tag `<html>`.
* `postponedState`: Đối tượng `postpone` opaque được trả về từ một [prerender API](/reference/react-dom/static/index), được tải từ nơi bạn đã lưu nó (ví dụ: redis, một file hoặc S3).
* **tùy chọn** `options`: Một object chứa các tùy chọn streaming.
  * **tùy chọn** `nonce`: Một chuỗi [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) cho phép các script dùng cho [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **tùy chọn** `onAllReady`: Một callback được gọi khi toàn bộ quá trình render hoàn tất, bao gồm cả shell và tất cả nội dung bổ sung. Bạn có thể gọi `pipe` tại đây thay vì trong `onShellReady` cho crawler và việc static generation. Stream sẽ chứa HTML cuối cùng.
  * **tùy chọn** `onBrowserBailout`: Một callback được React gọi khi khôi phục từ [`browser()`](/reference/react-dom/browser) bằng cách để lại một Suspense fallback để browser thay thế. Callback nhận một `Error` mô tả việc render chỉ dành cho browser và một object `errorInfo` chứa `componentStack`. Nếu một lý do được truyền cho `browser`, lý do đó sẽ có sẵn dưới dạng `error.cause`. Theo mặc định, React không làm gì cả. [Xem cách báo cáo việc render chỉ dành cho browser.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **tùy chọn** `onError`: Một callback được gọi mỗi khi có lỗi phía server, bất kể lỗi đó có thể [khôi phục](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) hay [không.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) Theo mặc định, callback này chỉ gọi `console.error`. Nếu bạn ghi đè callback để [ghi log các báo cáo sự cố,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`.
  * **tùy chọn** `onShellReady`: Một callback được gọi ngay sau khi [shell](#specifying-what-goes-into-the-shell) hoàn tất. Bạn có thể gọi `pipe` tại đây để bắt đầu streaming. React sẽ [stream nội dung bổ sung](#streaming-more-content-as-it-loads) sau shell cùng với các tag `<script>` inline để thay thế các fallback HTML đang tải bằng nội dung.
  * **tùy chọn** `onShellError`: Một callback được gọi nếu xảy ra lỗi khi render shell. Callback nhận lỗi làm đối số. Chưa có byte nào được phát ra từ stream, đồng thời cả `onShellReady` lẫn `onAllReady` đều sẽ không được gọi, vì vậy bạn có thể [xuất một shell HTML fallback](#recovering-from-errors-inside-the-shell) hoặc sử dụng prelude.


#### Giá trị trả về {/*returns*/}

`resumeToPipeableStream` trả về một object với hai method:

* `pipe` xuất HTML vào [Writable Node.js Stream](https://nodejs.org/api/stream.html#writable-streams) được cung cấp. Gọi `pipe` trong `onShellReady` nếu bạn muốn bật streaming, hoặc trong `onAllReady` cho crawler và việc static generation.
* `abort` cho phép bạn [hủy việc render phía server](#aborting-server-rendering) và render phần còn lại trên client.

#### Lưu ý {/*caveats*/}

- `resumeToPipeableStream` không chấp nhận các tùy chọn cho `bootstrapScripts`, `bootstrapScriptContent` hoặc `bootstrapModules`. Thay vào đó, bạn cần truyền các tùy chọn này vào lời gọi `prerender` tạo ra `postponedState`. Bạn cũng có thể tự chèn nội dung bootstrap vào writable stream.
- `resumeToPipeableStream` không chấp nhận `identifierPrefix` vì prefix cần giống nhau trong cả `prerender` và `resumeToPipeableStream`.
- Vì không thể cung cấp `nonce` cho prerender, bạn chỉ nên cung cấp `nonce` cho `resumeToPipeableStream` nếu bạn không cung cấp script cho prerender.
- `resumeToPipeableStream` re-render từ root cho đến khi tìm thấy một component chưa được pre-render hoàn toàn. Chỉ các Component được prerender hoàn toàn (Component và các component con của nó đã hoàn tất việc prerender) mới được bỏ qua hoàn toàn.

## Cách sử dụng {/*usage*/}

### Đọc thêm {/*further-reading*/}

Việc tiếp tục hoạt động giống như `renderToReadableStream`. Để xem thêm ví dụ, hãy xem phần [cách sử dụng của `renderToReadableStream`](/reference/react-dom/server/renderToReadableStream#usage).
Phần [cách sử dụng của `prerender`](/reference/react-dom/static/prerender#usage) bao gồm các ví dụ về cách sử dụng cụ thể `prerenderToNodeStream`.