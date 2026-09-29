---
title: resumeAndPrerender
---

<Intro>

`resumeAndPrerender` tiếp tục một cây React đã được prerender thành chuỗi HTML tĩnh bằng một [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```js
const {prelude, postponed} = await resumeAndPrerender(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

API này phụ thuộc vào [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Đối với Node.js, hãy sử dụng [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) thay thế.

</Note>

---

## Tài liệu tham khảo {/*reference*/}

### `resumeAndPrerender(reactNode, postponedState, options?)` {/*resumeandprerender*/}

Gọi `resumeAndPrerender` để tiếp tục một cây React đã được prerender thành chuỗi HTML tĩnh.

```js
import { resumeAndPrerender } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, response) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerender(<App />, postponedState, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Ở client, hãy gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML do server tạo trở nên tương tác.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Node React mà bạn đã gọi `prerender` (hoặc một `resumeAndPrerender` trước đó) với nó. Ví dụ: một phần tử JSX như `<App />`. Node này được kỳ vọng đại diện cho toàn bộ document, vì vậy component `App` phải render thẻ `<html>`.
* `postponedState`: Đối tượng `postpone` opaque được trả về từ [prerender API](/reference/react-dom/static/index), được tải từ nơi bạn đã lưu nó (ví dụ: redis, một tệp hoặc S3).
* **tùy chọn** `options`: Một object chứa các tùy chọn streaming.
  * **tùy chọn** `signal`: Một [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) cho phép bạn [abort server rendering](#aborting-server-rendering) và render phần còn lại trên client.
  * **tùy chọn** `onBrowserBailout`: Một callback mà React gọi khi khôi phục từ [`browser()`](/reference/react-dom/browser) bằng cách để lại một Suspense fallback để trình duyệt thay thế. Callback này nhận một `Error` mô tả quá trình render chỉ dành cho trình duyệt và một object `errorInfo` chứa `componentStack`. Nếu một lý do được truyền vào `browser`, lý do đó sẽ có sẵn dưới dạng `error.cause`. Theo mặc định, React không thực hiện thao tác nào. [Xem cách báo cáo quá trình render chỉ dành cho trình duyệt.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **tùy chọn** `onError`: Một callback được kích hoạt bất cứ khi nào có lỗi trên server, bất kể lỗi đó [recoverable](#recovering-from-errors-outside-the-shell) hay [not.](#recovering-from-errors-inside-the-shell) Theo mặc định, callback này chỉ gọi `console.error`. Nếu bạn ghi đè callback này để [log crash reports,](#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`.

#### Giá trị trả về {/*returns*/}

`prerender` trả về một Promise:
- Nếu quá trình render thành công, Promise sẽ resolve thành một object chứa:
  - `prelude`: một [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) chứa HTML. Bạn có thể sử dụng stream này để gửi response theo từng chunk hoặc đọc toàn bộ stream thành một chuỗi.
  - `postponed`: một object opaque có thể serialize bằng JSON, được truyền vào [`resume`](/reference/react-dom/server/resume) hoặc [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) nếu `prerender` bị abort.
- Nếu quá trình render thất bại, Promise sẽ bị reject. [Dùng giá trị này để xuất một fallback shell.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### Lưu ý {/*caveats*/}

`nonce` không phải là một tùy chọn khả dụng khi prerender. Nonce phải là duy nhất cho mỗi request; nếu bạn sử dụng nonce để bảo mật ứng dụng bằng [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), việc đưa giá trị nonce vào chính quá trình prerender sẽ không phù hợp và không an toàn.

<Note>

### Khi nào nên sử dụng `resumeAndPrerender`? {/*when-to-use-prerender*/}

API `resumeAndPrerender` tĩnh được dùng cho việc tạo phía server tĩnh (SSG). Không giống như `renderToString`, `resumeAndPrerender` chờ tất cả dữ liệu tải xong trước khi resolve. Điều này khiến API phù hợp để tạo HTML tĩnh cho một trang hoàn chỉnh, bao gồm cả dữ liệu cần được fetch bằng Suspense. Để stream nội dung khi nội dung tải xong, hãy sử dụng API server-side render (SSR) dạng streaming như [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

`resumeAndPrerender` có thể bị abort và sau đó được tiếp tục bằng một `resumeAndPrerender` khác hoặc resume bằng `resume` để hỗ trợ prerender từng phần.

</Note>

---

## Cách sử dụng {/*usage*/}

### Đọc thêm {/*further-reading*/}

`resumeAndPrerender` hoạt động tương tự như [`prerender`](/reference/react-dom/static/prerender) nhưng có thể được dùng để tiếp tục một quy trình prerender đã bắt đầu trước đó và bị abort.
Để biết thêm thông tin về việc tiếp tục một cây đã được prerender, hãy xem [resume documentation](/reference/react-dom/server/resume#resuming-a-prerender).