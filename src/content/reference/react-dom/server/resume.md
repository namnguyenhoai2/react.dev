---
title: tiếp tục
---

<Intro>

`resume` stream một cây React đã được render trước vào một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
const stream = await resume(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

API này phụ thuộc vào [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Đối với Node.js, hãy sử dụng [`resumeToNodeStream`](/reference/react-dom/server/renderToPipeableStream) thay thế.

</Note>

---

## Tham chiếu {/*reference*/}

### `resume(node, postponedState, options?)` {/*resume*/}

Gọi `resume` để tiếp tục render một cây React đã được render trước thành HTML vào một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, writable) {
  const postponed = await getPostponedState(request);
  const resumeStream = await resume(<App />, postponed);
  return resumeStream.pipeTo(writable)
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Node React mà bạn đã gọi `prerender` với nó. Ví dụ: một phần tử JSX như `<App />`. Node này được kỳ vọng đại diện cho toàn bộ tài liệu, vì vậy component `App` phải render thẻ `<html>`.
* `postponedState`: Đối tượng `postpone` opaque được trả về từ một [prerender API](/reference/react-dom/static/index), được tải từ nơi bạn đã lưu nó (ví dụ: redis, một tệp hoặc S3).
* **tùy chọn** `options`: Một đối tượng chứa các tùy chọn streaming.
  * **tùy chọn** `nonce`: Một chuỗi [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) cho phép các script của [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **tùy chọn** `signal`: Một [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) cho phép bạn [abort server rendering](#aborting-server-rendering) và render phần còn lại trên client.
  * **tùy chọn** `onBrowserBailout`: Một callback được React gọi khi khôi phục từ [`browser()`](/reference/react-dom/browser) bằng cách để lại một Suspense fallback để trình duyệt thay thế. Callback này nhận một `Error` mô tả việc render chỉ dành cho trình duyệt và một đối tượng `errorInfo` chứa `componentStack`. Nếu một lý do được truyền vào `browser`, lý do đó sẽ có sẵn trong `error.cause`. Theo mặc định, React không thực hiện thao tác nào. [Xem cách báo cáo việc render chỉ dành cho trình duyệt.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **tùy chọn** `onError`: Một callback được kích hoạt bất cứ khi nào có lỗi phía server, dù lỗi đó [recoverable](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) hay [không thể khôi phục.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) Theo mặc định, callback này chỉ gọi `console.error`. Nếu bạn ghi đè callback để [log crash reports,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`.


#### Giá trị trả về {/*returns*/}

`resume` trả về một Promise:

- Nếu `resume` tạo thành công [shell](/reference/react-dom/server/renderToReadableStream#specifying-what-goes-into-the-shell), Promise đó sẽ resolve thành một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) có thể được pipe vào một [Writable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream).
- Nếu xảy ra lỗi trong shell, Promise sẽ reject với lỗi đó.

Stream được trả về có thêm một thuộc tính:

* `allReady`: Một Promise resolve khi toàn bộ quá trình render hoàn tất. Bạn có thể `await stream.allReady` trước khi trả về response [cho crawler và việc tạo static.](/reference/react-dom/server/renderToReadableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Nếu làm vậy, bạn sẽ không nhận được progressive loading. Stream sẽ chứa HTML cuối cùng.

#### Lưu ý {/*caveats*/}

- `resume` không chấp nhận các tùy chọn cho `bootstrapScripts`, `bootstrapScriptContent` hoặc `bootstrapModules`. Thay vào đó, bạn cần truyền các tùy chọn này vào lời gọi `prerender` tạo ra `postponedState`. Bạn cũng có thể tự chèn nội dung bootstrap vào writable stream.
- `resume` không chấp nhận `identifierPrefix` vì prefix cần phải giống nhau trong cả `prerender` và `resume`.
- Vì không thể cung cấp `nonce` cho prerender, bạn chỉ nên cung cấp `nonce` cho `resume` nếu bạn không cung cấp script cho prerender.
- `resume` render lại từ root cho đến khi tìm thấy một component chưa được render trước hoàn toàn. Chỉ các Component được prerender hoàn toàn (Component và các component con của nó đã hoàn tất quá trình prerender) mới được bỏ qua hoàn toàn.

## Cách sử dụng {/*usage*/}

### Tiếp tục một prerender {/*resuming-a-prerender*/}

<Sandpack>

```js src/App.js hidden
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe id="container"></iframe>
</body>
</html>
```

```js src/index.js
import {
  flushReadableStreamToFrame,
  getUser,
  Postponed,
  sleep,
} from "./demo-helpers";
import { StrictMode, Suspense, use, useEffect } from "react";
import { prerender } from "react-dom/static";
import { resume } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

function Header() {
  return <header>Me and my descendants can be prerendered</header>;
}

const { promise: cookies, resolve: resolveCookies } = Promise.withResolvers();

function Main() {
  const { sessionID } = use(cookies);
  const user = getUser(sessionID);

  useEffect(() => {
    console.log("reached interactivity!");
  }, []);

  return (
    <main>
      Hello, {user.name}!
      <button onClick={() => console.log("hydrated!")}>
        Clicking me requires hydration.
      </button>
    </main>
  );
}

function Shell({ children }) {
  // Trong app thực tế, đây là nơi bạn đặt html và body.
  // Ở đây, chúng tôi chỉ dùng các thẻ có thể đưa vào body hiện có để minh họa.
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

function App() {
  return (
    <Shell>
      <Suspense fallback="loading header">
        <Header />
      </Suspense>
      <Suspense fallback="loading main">
        <Main />
      </Suspense>
    </Shell>
  );
}

async function main(frame) {
  // Lớp 1
  const controller = new AbortController();
  const prerenderedApp = prerender(<App />, {
    signal: controller.signal,
    onError(error) {
      if (error instanceof Postponed) {
      } else {
        console.error(error);
      }
    },
  });
  // Chúng tôi hủy ngay trong một macrotask.
  // Mọi thao tác lấy dữ liệu không có sẵn đồng bộ hoặc trong microtask sẽ chưa hoàn tất.
  setTimeout(() => {
    controller.abort(new Postponed());
  });

  const { prelude, postponed } = await prerenderedApp;
  await flushReadableStreamToFrame(prelude, frame);

  // Lớp 2
  // Chỉ chờ ở đây để minh họa.
  // Trong app thực tế, prelude và postponed state đã được serialize ở Lớp 1, rồi Lớp 2 sẽ deserialize chúng.
  // Nội dung prelude có thể được flush ngay dưới dạng HTML thuần trong khi
  // React tiếp tục render từ nơi prerender đã dừng lại.
  await sleep(2000);

  // Bạn sẽ lấy cookie từ HTTP request đến
  resolveCookies({ sessionID: "abc" });

  const stream = await resume(<App />, postponed);

  await flushReadableStreamToFrame(stream, frame);

  // Lớp 3
  // Chỉ chờ ở đây để minh họa.
  await sleep(2000);

  hydrateRoot(frame.contentWindow.document, <App />);
}

main(document.getElementById("container"));

```

```js src/demo-helpers.js
export async function flushReadableStreamToFrame(readable, frame) {
  const document = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    const partialHTML = decoder.decode(value, {stream: true});
    document.write(partialHTML);
  }

  document.write(decoder.decode());
}

// Đây không nhất thiết là một lỗi.
// Bạn có thể dùng bất kỳ cách nào khác để kiểm tra liệu lỗi trong khi prerender
// đến từ việc hủy có chủ ý hay là lỗi thực sự.
export class Postponed extends Error {}

// Ở đây, chúng tôi chỉ hardcode một session.
export function getUser(sessionID) {
  return {
    name: "Alice",
  };
}

export function sleep(timeoutMS) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMS);
  });
}
```

</Sandpack>

### Đọc thêm {/*further-reading*/}

Việc tiếp tục hoạt động giống như `renderToReadableStream`. Để xem thêm ví dụ, hãy xem phần [usage của `renderToReadableStream`](/reference/react-dom/server/renderToReadableStream#usage).
Phần [usage của `prerender`](/reference/react-dom/static/prerender#usage) bao gồm các ví dụ về cách sử dụng cụ thể `prerender`.
