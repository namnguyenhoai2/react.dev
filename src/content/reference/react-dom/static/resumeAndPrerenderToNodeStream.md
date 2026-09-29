---
title: resumeAndPrerenderToNodeStream
---

<Intro>

`resumeAndPrerenderToNodeStream` tiếp tục prerender một cây React thành chuỗi HTML tĩnh bằng [Node.js Stream.](https://nodejs.org/api/stream.html).

```js
const {prelude, postponed} = await resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

API này dành riêng cho Node.js. Các môi trường có [Web Streams,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) như Deno và các edge runtime hiện đại nên sử dụng [`prerender`](/reference/react-dom/static/prerender) thay thế.

</Note>

---

## Tham chiếu {/*reference*/}

### `resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)` {/*resumeandprerendertolnodestream*/}

Gọi `resumeAndPrerenderToNodeStream` để tiếp tục prerender một cây React thành chuỗi HTML tĩnh.

```js
import { resumeAndPrerenderToNodeStream } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, writable) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerenderToNodeStream(<App />, JSON.parse(postponedState));
  prelude.pipe(writable);
}
```

Trên client, gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML do server tạo trở nên tương tác được.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Node React mà bạn đã gọi `prerender` (hoặc `resumeAndPrerenderToNodeStream` trước đó) với nó. Ví dụ: một phần tử JSX như `<App />`. Node này được kỳ vọng là đại diện cho toàn bộ tài liệu, vì vậy component `App` nên render thẻ `<html>`.
* `postponedState`: Đối tượng `postpone` không trong suốt được trả về từ [prerender API](/reference/react-dom/static/index), được tải từ nơi bạn đã lưu nó (ví dụ: redis, một tệp hoặc S3).
* **optional** `options`: Một object chứa các tùy chọn streaming.
  * **optional** `signal`: Một [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) cho phép bạn [abort server rendering](#aborting-server-rendering) và render phần còn lại trên client.
  * **optional** `onBrowserBailout`: Một callback được React gọi khi khôi phục từ [`browser()`](/reference/react-dom/browser) bằng cách để lại một Suspense fallback cho trình duyệt thay thế. Callback này nhận một `Error` mô tả quá trình render chỉ dành cho trình duyệt và một object `errorInfo` chứa `componentStack`. Nếu một lý do được truyền vào `browser`, lý do đó sẽ có sẵn dưới dạng `error.cause`. Theo mặc định, React không thực hiện hành động nào. [Xem cách báo cáo quá trình render chỉ dành cho trình duyệt.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **optional** `onError`: Một callback được kích hoạt mỗi khi có lỗi server, bất kể lỗi đó [recoverable](#recovering-from-errors-outside-the-shell) hay [not.](#recovering-from-errors-inside-the-shell) Theo mặc định, callback này chỉ gọi `console.error`. Nếu bạn ghi đè callback này để [log crash reports,](#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`.

#### Giá trị trả về {/*returns*/}

`resumeAndPrerenderToNodeStream` trả về một Promise:
- Nếu quá trình render thành công, Promise sẽ resolve thành một object chứa:
  - `prelude`: một [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) chứa HTML. Bạn có thể sử dụng stream này để gửi response theo từng chunk hoặc đọc toàn bộ stream thành một string.
  - `postponed`: một object không trong suốt, có thể serialize bằng JSON, được truyền vào [`resumeToNodeStream`](/reference/react-dom/server/resume) hoặc [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) nếu `resumeAndPrerenderToNodeStream` bị abort.
- Nếu quá trình render thất bại, Promise sẽ bị reject. [Sử dụng giá trị này để xuất một fallback shell.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### Lưu ý {/*caveats*/}

`nonce` không phải là tùy chọn khả dụng khi prerender. Nonce phải là duy nhất cho mỗi request, và nếu bạn sử dụng nonce để bảo mật ứng dụng bằng [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) thì việc đưa giá trị nonce vào chính quá trình prerender là không phù hợp và không an toàn.

<Note>

### Khi nào nên sử dụng `resumeAndPrerenderToNodeStream`? {/*when-to-use-prerender*/}

API `resumeAndPrerenderToNodeStream` tĩnh được sử dụng để tạo nội dung tĩnh phía server (SSG). Không giống như `renderToString`, `resumeAndPrerenderToNodeStream` chờ tất cả dữ liệu được tải trước khi resolve. Điều này khiến nó phù hợp để tạo HTML tĩnh cho một trang hoàn chỉnh, bao gồm cả dữ liệu cần được fetch bằng Suspense. Để stream nội dung khi nội dung được tải, hãy sử dụng API render phía server dạng streaming (SSR) như [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

`resumeAndPrerenderToNodeStream` có thể bị abort và sau đó được tiếp tục bằng một `resumeAndPrerenderToNodeStream` khác hoặc resumed bằng `resume` để hỗ trợ partial pre-rendering.

</Note>

---

## Cách sử dụng {/*usage*/}

### Đọc thêm {/*further-reading*/}

`resumeAndPrerenderToNodeStream` hoạt động tương tự [`prerender`](/reference/react-dom/static/prerender) nhưng có thể được sử dụng để tiếp tục một quá trình prerender đã bắt đầu trước đó nhưng bị abort.
Để biết thêm thông tin về việc tiếp tục một cây đã được prerender, hãy xem [resume documentation](/reference/react-dom/server/resume#resuming-a-prerender).

