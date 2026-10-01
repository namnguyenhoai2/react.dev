---
title: prerender
---

<Intro>

`prerender` kết xuất một cây React thành chuỗi HTML tĩnh bằng cách sử dụng [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```js
const {prelude, postponed} = await prerender(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API này phụ thuộc vào [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Đối với Node.js, hãy sử dụng [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) thay thế.

</Note>

---

## Tham chiếu {/*reference*/}

### `prerender(reactNode, options?)` {/*prerender*/}

Gọi `prerender` để kết xuất ứng dụng của bạn thành HTML tĩnh.

```js
import { prerender } from 'react-dom/static';

async function handler(request, response) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Trên client, hãy gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML do server tạo trở nên interactive.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một React node mà bạn muốn kết xuất thành HTML. Ví dụ: một JSX node như `<App />`. Node này được kỳ vọng sẽ đại diện cho toàn bộ document, vì vậy component App phải kết xuất thẻ `<html>`.

* **tùy chọn** `options`: Một object chứa các tùy chọn static generation.
  * **tùy chọn** `bootstrapScriptContent`: Nếu được chỉ định, chuỗi này sẽ được đặt trong thẻ `<script>` inline.
  * **tùy chọn** `bootstrapScripts`: Một mảng các URL dạng chuỗi cho các thẻ `<script>` cần đưa vào trang. Sử dụng tùy chọn này để đưa vào `<script>` gọi [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Bỏ qua tùy chọn này nếu bạn hoàn toàn không muốn chạy React trên client.
  * **tùy chọn** `bootstrapModules`: Tương tự như `bootstrapScripts`, nhưng thay vào đó sẽ đưa ra [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
  * **tùy chọn** `identifierPrefix`: Một tiền tố dạng chuỗi mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Tùy chọn này hữu ích để tránh xung đột khi sử dụng nhiều root trên cùng một trang. Tiền tố này phải giống với tiền tố được truyền vào [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **tùy chọn** `importMap`: Một [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) object có các thuộc tính `imports` và `scopes`. React đưa object này vào một thẻ `<script type="importmap">` inline trước mọi module script, để các thẻ `<script type="module">` (ví dụ: từ `bootstrapModules`) có thể sử dụng bare module specifier.
  * **tùy chọn** `maxHeadersLength`: Độ dài tổng tối đa của nội dung header được truyền vào `onHeaders`, tính theo đơn vị UTF-16 code unit. Mặc định là 2000. Khi đạt đến giới hạn, React sẽ ngừng thêm resource hint vào các header.
  * **tùy chọn** `namespaceURI`: Một chuỗi chứa [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) root cho stream. Mặc định là HTML thông thường. Truyền `'http://www.w3.org/2000/svg'` cho SVG hoặc `'http://www.w3.org/1998/Math/MathML'` cho MathML.
  * **tùy chọn** `onBrowserBailout`: Một callback được React gọi khi khôi phục sau [`browser()`](/reference/react-dom/browser) bằng cách để lại một Suspense fallback cho browser thay thế. Callback này nhận một `Error` mô tả việc kết xuất chỉ dành cho browser và một object `errorInfo` chứa `componentStack`. Nếu một lý do được truyền vào `browser`, lý do đó sẽ có sẵn dưới dạng `error.cause`. Theo mặc định, React không thực hiện hành động nào. [Xem cách báo cáo việc kết xuất chỉ dành cho browser.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **tùy chọn** `onError`: Một callback được kích hoạt bất cứ khi nào có lỗi server, dù lỗi đó [có thể khôi phục](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) hay [không.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) Theo mặc định, callback này chỉ gọi `console.error`. Nếu bạn override callback để [ghi log báo cáo sự cố,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`. Bạn cũng có thể dùng callback này để [điều chỉnh status code](/reference/react-dom/server/renderToReadableStream#setting-the-status-code) trước khi shell được phát ra.
  * **tùy chọn** `onHeaders`: Một callback được kích hoạt khi React đã xác định các resource hint cho document, chẳng hạn như preconnect và preload cho stylesheet, font hoặc hình ảnh có độ ưu tiên cao. Callback này nhận một instance [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) chứa giá trị [`Link` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/link) tương ứng, để bạn có thể gửi giá trị đó dưới dạng HTTP response header hoặc response [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103). React gọi callback này ngay cả khi không có resource hint nào cần gửi. Nội dung header được giới hạn bởi `maxHeadersLength`.
  * **tùy chọn** `progressiveChunkSize`: Số byte trong một chunk. [Đọc thêm về heuristic mặc định.](https://github.com/react/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **tùy chọn** `signal`: Một [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) cho phép bạn [hủy prerendering](#aborting-prerendering) và kết xuất phần còn lại trên client.

#### Giá trị trả về {/*returns*/}

`prerender` trả về một Promise:
- Nếu việc kết xuất thành công, Promise sẽ resolve thành một object chứa:
  - `prelude`: một [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) chứa HTML. Bạn có thể dùng stream này để gửi response theo từng chunk hoặc đọc toàn bộ stream thành một chuỗi.
  - `postponed`: một object opaque có thể serialize thành JSON và truyền vào [`resume`](/reference/react-dom/server/resume) nếu `prerender` chưa hoàn tất. Nếu không, giá trị này là `null`, cho biết `prelude` chứa toàn bộ nội dung và không cần resume.
- Nếu việc kết xuất thất bại, Promise sẽ bị reject. [Sử dụng cách này để xuất một fallback shell.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### Lưu ý {/*caveats*/}

`nonce` không phải là một tùy chọn khả dụng khi prerendering. Nonce phải là duy nhất cho mỗi request; nếu bạn sử dụng nonce để bảo vệ ứng dụng bằng [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) thì việc đưa giá trị nonce vào chính prerender là không phù hợp và không an toàn.

<Note>

### Khi nào nên sử dụng `prerender`? {/*when-to-use-prerender*/}

API `prerender` tĩnh được dùng cho static server-side generation (SSG). Không giống như `renderToString`, `prerender` chờ toàn bộ dữ liệu tải xong trước khi resolve. Điều này khiến API phù hợp để tạo HTML tĩnh cho toàn bộ trang, bao gồm cả dữ liệu cần được fetch bằng Suspense. Để stream nội dung khi nội dung được tải, hãy sử dụng API streaming server-side render (SSR) như [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

`prerender` có thể bị abort và sau đó tiếp tục bằng `resumeAndPrerender` hoặc resume bằng `resume` để hỗ trợ partial pre-rendering.

</Note>

---

## Cách sử dụng {/*usage*/}

### Kết xuất một cây React thành stream HTML tĩnh {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

Gọi `prerender` để kết xuất cây React của bạn thành HTML tĩnh trong một [Readable Web Stream:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream):

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Cùng với <CodeStep step={1}>root component</CodeStep>, bạn cần cung cấp danh sách các đường dẫn <CodeStep step={2}>bootstrap `<script>` </CodeStep>. Root component của bạn phải trả về **toàn bộ document, bao gồm cả thẻ `<html>` root.**

Ví dụ, có thể viết như sau:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React sẽ đưa [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) và các thẻ <CodeStep step={2}>bootstrap `<script>` </CodeStep> vào stream HTML kết quả:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML từ các component của bạn ... -->
</html>
<script src="/main.js" async=""></script>
```

Trên client, bootstrap script của bạn phải [hydrate toàn bộ `document` bằng một lời gọi đến `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Thao tác này sẽ gắn các event listener vào HTML tĩnh do server tạo và làm cho HTML trở nên interactive.

<DeepDive>

#### Đọc đường dẫn asset CSS và JS từ output của bản build {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Các URL asset cuối cùng (chẳng hạn như các tệp JavaScript và CSS) thường được hash sau khi build. Ví dụ, thay vì `styles.css`, bạn có thể nhận được `styles.123456.css`. Việc hash tên tệp asset tĩnh đảm bảo rằng mỗi build khác nhau của cùng một asset sẽ có một tên tệp khác nhau. Điều này hữu ích vì cho phép bạn bật caching dài hạn một cách an toàn cho các asset tĩnh: một tệp có tên nhất định sẽ không bao giờ thay đổi nội dung.

Tuy nhiên, nếu bạn không biết các URL asset cho đến sau khi build, bạn không có cách nào đưa chúng vào source code. Ví dụ, hardcode `"/styles.css"` vào JSX như trước đó sẽ không hoạt động. Để giữ chúng ngoài source code, component gốc của bạn có thể đọc tên tệp thực từ một map được truyền vào dưới dạng prop:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

Trên server, render `<App assetMap={assetMap} />` và truyền `assetMap` của bạn cùng với các URL asset:

```js {1-5,8,9}
// Bạn cần lấy JSON này từ build tooling, chẳng hạn đọc từ build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Vì server hiện đang render `<App assetMap={assetMap} />`, bạn cũng cần render nó bằng `assetMap` trên client để tránh lỗi hydration. Bạn có thể serialize và truyền `assetMap` đến client như sau:

```js {9-10}
// Bạn cần lấy JSON này từ build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    // Lưu ý: Có thể stringify() dữ liệu này an toàn vì nó không do người dùng tạo.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Trong ví dụ trên, tùy chọn `bootstrapScriptContent` thêm một thẻ `<script>` inline bổ sung, đặt biến toàn cục `window.assetMap` trên client. Điều này cho phép code phía client đọc cùng `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Cả client và server đều render `App` với cùng prop `assetMap`, vì vậy không xảy ra lỗi hydration.

</DeepDive>

---

### Render một cây React thành chuỗi HTML tĩnh {/*rendering-a-react-tree-to-a-string-of-static-html*/}

Gọi `prerender` để render app của bạn thành một chuỗi HTML tĩnh:

```js
import { prerender } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });

  const reader = prelude.getReader();
  let content = '';
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      return content;
    }
    content += Buffer.from(value).toString('utf8');
  }
}
```

Thao tác này sẽ tạo ra output HTML ban đầu, không có tính tương tác, của các React component. Trên client, bạn cần gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để *hydrate* HTML do server tạo ra và làm cho nó có tính tương tác.

---

### Chờ tất cả dữ liệu tải xong {/*waiting-for-all-data-to-load*/}

`prerender` chờ tất cả dữ liệu tải xong trước khi hoàn tất việc tạo HTML tĩnh và resolve. Ví dụ, hãy xem xét một trang profile hiển thị ảnh bìa, sidebar có bạn bè và ảnh, cùng một danh sách bài đăng:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Giả sử `<Posts />` cần tải một số dữ liệu và việc này mất một khoảng thời gian. Lý tưởng nhất là bạn muốn chờ các bài đăng tải xong để chúng được đưa vào HTML. Để thực hiện việc này, bạn có thể dùng Suspense để suspend trên dữ liệu, và `prerender` sẽ chờ nội dung bị suspend hoàn tất trước khi resolve thành HTML tĩnh.

<Note>

Chỉ dữ liệu được đọc từ một nguồn mà [activates a Suspense boundary](/reference/react/Suspense#what-activates-a-suspense-boundary), chẳng hạn như một Promise được đọc bằng [`use`](/reference/react/use), mới suspend trong quá trình render. Suspense không phát hiện dữ liệu được fetch bên trong Effect hoặc event handler.

</Note>

---

### Hủy prerendering {/*aborting-prerendering*/}

Bạn có thể buộc prerender “từ bỏ” sau một khoảng thời gian chờ:

```js {2-5,11}
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  try {
    // prelude sẽ chứa toàn bộ HTML đã được prerender
    // trước khi controller hủy.
    const {prelude} = await prerender(<App />, {
      signal: controller.signal,
    });
    //...
```

Mọi Suspense boundary có các child chưa hoàn tất sẽ được đưa vào prelude ở trạng thái fallback.

Bạn có thể sử dụng tính năng này để prerender từng phần cùng với [`resume`](/reference/react-dom/server/resume) hoặc [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender).

## Khắc phục sự cố {/*troubleshooting*/}

### Stream của tôi không bắt đầu cho đến khi toàn bộ app được render {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

Response `prerender` chờ toàn bộ app render xong, bao gồm việc chờ tất cả Suspense boundary resolve, trước khi resolve. API này được thiết kế cho việc tạo static site (SSG) trước và không hỗ trợ stream thêm nội dung khi nội dung đó tải xong.

Để stream nội dung khi nội dung đó tải xong, hãy sử dụng một API server render dạng streaming như [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).
