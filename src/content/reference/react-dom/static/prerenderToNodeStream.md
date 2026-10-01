---
title: prerenderToNodeStream
---

<Intro>

`prerenderToNodeStream` render một cây React thành chuỗi HTML tĩnh bằng [Node.js Stream.](https://nodejs.org/api/stream.html)

```js
const {prelude, postponed} = await prerenderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API này dành riêng cho Node.js. Các môi trường có [Web Streams,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) như Deno và các edge runtime hiện đại nên sử dụng [`prerender`](/reference/react-dom/static/prerender) thay thế.

</Note>

---

## Tham chiếu {/*reference*/}

### `prerenderToNodeStream(reactNode, options?)` {/*prerender*/}

Gọi `prerenderToNodeStream` để render ứng dụng của bạn thành HTML tĩnh.

```js
import { prerenderToNodeStream } from 'react-dom/static';

// Cú pháp route handler phụ thuộc vào backend framework của bạn
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

Ở phía client, gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML do server tạo trở nên tương tác.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một React node mà bạn muốn render thành HTML. Ví dụ: một JSX node như `<App />`. Node này được kỳ vọng đại diện cho toàn bộ tài liệu, vì vậy component App nên render thẻ `<html>`.

* **tùy chọn** `options`: Một object chứa các tùy chọn tạo tĩnh.
  * **tùy chọn** `bootstrapScriptContent`: Nếu được chỉ định, chuỗi này sẽ được đặt trong thẻ `<script>` nội tuyến.
  * **tùy chọn** `bootstrapScripts`: Một mảng các URL dạng chuỗi cho các thẻ `<script>` được chèn vào trang. Sử dụng tùy chọn này để đưa vào `<script>` gọi [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Bỏ qua tùy chọn này nếu bạn hoàn toàn không muốn chạy React ở client.
  * **tùy chọn** `bootstrapModules`: Tương tự `bootstrapScripts`, nhưng thay vào đó sẽ chèn [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
  * **tùy chọn** `identifierPrefix`: Một tiền tố dạng chuỗi mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều root trên cùng một trang. Tiền tố này phải giống với tiền tố được truyền vào [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **tùy chọn** `importMap`: Một [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) object có các thuộc tính `imports` và `scopes`. React chèn nó dưới dạng thẻ `<script type="importmap">` nội tuyến trước mọi module script, để các thẻ `<script type="module">` (ví dụ từ `bootstrapModules`) có thể sử dụng bare module specifier.
  * **tùy chọn** `maxHeadersLength`: Tổng độ dài tối đa của nội dung header được truyền vào `onHeaders`, tính bằng đơn vị mã UTF-16. Mặc định là 2000. Khi đạt đến giới hạn, React sẽ ngừng thêm resource hint vào các header.
  * **tùy chọn** `namespaceURI`: Một chuỗi chứa [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) gốc cho stream. Mặc định là HTML thông thường. Truyền `'http://www.w3.org/2000/svg'` cho SVG hoặc `'http://www.w3.org/1998/Math/MathML'` cho MathML.
  * **tùy chọn** `onBrowserBailout`: Một callback được React gọi khi khôi phục sau [`browser()`](/reference/react-dom/browser) bằng cách để lại một Suspense fallback cho trình duyệt thay thế. Callback này nhận một `Error` mô tả việc render chỉ dành cho trình duyệt và một object `errorInfo` chứa `componentStack`. Nếu một lý do được truyền vào `browser`, lý do đó có sẵn dưới dạng `error.cause`. Theo mặc định, React không thực hiện thao tác nào. [Xem cách báo cáo việc render chỉ dành cho trình duyệt.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **tùy chọn** `onError`: Một callback được kích hoạt mỗi khi có lỗi server, bất kể lỗi đó có [thể khôi phục](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-outside-the-shell) hay [không thể khôi phục](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell). Theo mặc định, callback này chỉ gọi `console.error`. Nếu ghi đè callback để [ghi nhật ký báo cáo sự cố,](/reference/react-dom/server/renderToPipeableStream#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`. Bạn cũng có thể sử dụng callback này để [điều chỉnh mã trạng thái](/reference/react-dom/server/renderToPipeableStream#setting-the-status-code) trước khi shell được phát ra.
  * **tùy chọn** `onHeaders`: Một callback được kích hoạt khi React đã xác định các resource hint cho tài liệu, chẳng hạn như preconnect và preload cho stylesheet, font hoặc hình ảnh có độ ưu tiên cao. Callback này nhận một instance [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) chứa giá trị [`Link` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/link) tương ứng, để bạn có thể gửi giá trị đó dưới dạng HTTP response header hoặc response [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103). React gọi callback này ngay cả khi không có resource hint nào để gửi. Nội dung header bị giới hạn bởi `maxHeadersLength`.
  * **tùy chọn** `progressiveChunkSize`: Số byte trong một chunk. [Đọc thêm về heuristic mặc định.](https://github.com/react/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **tùy chọn** `signal`: Một [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) cho phép bạn [hủy quá trình prerender](#aborting-prerendering) và render phần còn lại ở client.

#### Giá trị trả về {/*returns*/}

`prerenderToNodeStream` trả về một Promise:
- Nếu quá trình render thành công, Promise sẽ resolve thành một object chứa:
  - `prelude`: một [Node.js Stream.](https://nodejs.org/api/stream.html) chứa HTML. Bạn có thể sử dụng stream này để gửi response theo từng chunk hoặc đọc toàn bộ stream thành một chuỗi.
  - `postponed`: một object opaque có thể được serialize thành JSON và truyền vào [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) nếu `prerenderToNodeStream` chưa hoàn tất. Nếu không, giá trị này là `null`, cho biết `prelude` chứa toàn bộ nội dung và không cần resume.
- Nếu quá trình render thất bại, Promise sẽ bị reject. [Sử dụng giá trị này để xuất một shell dự phòng.](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell)

#### Lưu ý {/*caveats*/}

`nonce` không phải là tùy chọn khả dụng khi prerender. Nonce phải là duy nhất cho mỗi request, và nếu bạn sử dụng nonce để bảo mật ứng dụng bằng [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) thì việc đưa giá trị nonce vào chính prerender là không phù hợp và không an toàn.

<Note>

### Khi nào nên sử dụng `prerenderToNodeStream`? {/*when-to-use-prerender*/}

API `prerenderToNodeStream` tĩnh được sử dụng cho việc tạo tĩnh phía server (SSG). Không giống `renderToString`, `prerenderToNodeStream` chờ tất cả dữ liệu tải xong trước khi resolve. Điều này khiến API phù hợp để tạo HTML tĩnh cho một trang hoàn chỉnh, bao gồm cả dữ liệu cần được fetch bằng Suspense. Để stream nội dung khi nội dung tải, hãy sử dụng API render phía server dạng streaming (SSR) như [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

`prerenderToNodeStream` có thể bị abort và resume sau đó bằng `resumeToPipeableStream` để hỗ trợ prerender từng phần.

</Note>

---

## Cách sử dụng {/*usage*/}

### Render một cây React thành stream HTML tĩnh {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

Gọi `prerenderToNodeStream` để render cây React của bạn thành HTML tĩnh trong một [Node.js Stream](https://nodejs.org/api/stream.html):

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { prerenderToNodeStream } from 'react-dom/static';

// Cú pháp route handler phụ thuộc vào backend framework của bạn
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

Cùng với <CodeStep step={1}>component gốc</CodeStep>, bạn cần cung cấp danh sách các đường dẫn <CodeStep step={2}>bootstrap `<script>` </CodeStep>. Component gốc của bạn phải trả về **toàn bộ tài liệu, bao gồm cả thẻ `<html>` gốc.**

Ví dụ, có thể trông như sau:

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

React sẽ chèn [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) và các thẻ <CodeStep step={2}>bootstrap `<script>` </CodeStep> vào stream HTML kết quả:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML từ các component của bạn ... -->
</html>
<script src="/main.js" async=""></script>
```

Ở client, bootstrap script của bạn nên [hydrate toàn bộ `document` bằng một lệnh gọi đến `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Thao tác này sẽ gắn các event listener vào HTML tĩnh do server tạo và làm cho HTML trở nên tương tác.

<DeepDive>

#### Đọc đường dẫn asset CSS và JS từ output của build {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Các URL asset cuối cùng (chẳng hạn như các tệp JavaScript và CSS) thường được hash sau khi build. Ví dụ, thay vì `styles.css`, bạn có thể nhận được `styles.123456.css`. Việc hash tên tệp asset tĩnh đảm bảo rằng mỗi build khác nhau của cùng một asset sẽ có một tên tệp khác nhau. Điều này hữu ích vì cho phép bạn bật caching dài hạn một cách an toàn cho các asset tĩnh: một tệp có tên nhất định sẽ không bao giờ thay đổi nội dung.

Tuy nhiên, nếu bạn không biết các URL asset cho đến sau khi build, bạn không có cách nào đưa chúng vào mã nguồn. Ví dụ, hardcode `"/styles.css"` vào JSX như trước đó sẽ không hoạt động. Để loại bỏ chúng khỏi mã nguồn, component gốc của bạn có thể đọc tên tệp thực tế từ một map được truyền vào dưới dạng prop:

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

Trên server, render `<App assetMap={assetMap} />` và truyền `assetMap` cùng các URL asset:

```js {1-5,8,9}
// Bạn cần lấy JSON này từ build tooling, chẳng hạn đọc từ build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: [assetMap['/main.js']]
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

Vì server hiện đang render `<App assetMap={assetMap} />`, bạn cũng cần render nó bằng `assetMap` trên client để tránh lỗi hydration. Bạn có thể serialize và truyền `assetMap` đến client như sau:

```js {9-10}
// Bạn cần lấy JSON này từ build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    // Lưu ý: Có thể stringify() dữ liệu này an toàn vì nó không do người dùng tạo.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

Trong ví dụ trên, tùy chọn `bootstrapScriptContent` thêm một thẻ `<script>` inline bổ sung, thiết lập biến toàn cục `window.assetMap` trên client. Nhờ đó, mã client có thể đọc cùng `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Cả client và server đều render `App` với cùng prop `assetMap`, vì vậy không xảy ra lỗi hydration.

</DeepDive>

---

### Render một cây React thành chuỗi HTML tĩnh {/*rendering-a-react-tree-to-a-string-of-static-html*/}

Gọi `prerenderToNodeStream` để render ứng dụng của bạn thành một chuỗi HTML tĩnh:

```js
import { prerenderToNodeStream } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  return new Promise((resolve, reject) => {
    let data = '';
    prelude.on('data', chunk => {
      data += chunk;
    });
    prelude.on('end', () => resolve(data));
    prelude.on('error', reject);
  });
}
```

Lệnh này sẽ tạo ra HTML ban đầu, không có tính tương tác, từ các component React của bạn. Trên client, bạn sẽ cần gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để *hydrate* HTML do server tạo ra và làm cho nó có tính tương tác.

---

### Chờ tất cả dữ liệu tải xong {/*waiting-for-all-data-to-load*/}

`prerenderToNodeStream` chờ tất cả dữ liệu tải xong trước khi hoàn tất việc tạo HTML tĩnh và resolve. Ví dụ, hãy xem xét một trang hồ sơ hiển thị ảnh bìa, sidebar chứa bạn bè và ảnh, cùng danh sách bài đăng:

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

Hãy tưởng tượng `<Posts />` cần tải một số dữ liệu và việc này mất một khoảng thời gian. Lý tưởng nhất là bạn muốn chờ các bài đăng hoàn tất để chúng được đưa vào HTML. Để làm vậy, bạn có thể dùng Suspense để suspend khi chờ dữ liệu, và `prerenderToNodeStream` sẽ chờ nội dung bị suspend hoàn tất trước khi resolve thành HTML tĩnh.

<Note>

Chỉ dữ liệu được đọc từ một nguồn [kích hoạt một boundary Suspense](/reference/react/Suspense#what-activates-a-suspense-boundary), chẳng hạn như một Promise được đọc bằng [`use`](/reference/react/use), mới suspend trong quá trình render. Suspense không phát hiện dữ liệu được fetch bên trong Effect hoặc event handler.

</Note>

---

### Hủy prerender {/*aborting-prerendering*/}

Bạn có thể buộc quá trình prerender “bỏ cuộc” sau một khoảng thời gian chờ:

```js {2-5,11}
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  try {
    // prelude sẽ chứa toàn bộ HTML đã được prerender
    // trước khi controller hủy.
    const {prelude} = await prerenderToNodeStream(<App />, {
      signal: controller.signal,
    });
    //...
```

Mọi boundary Suspense có các children chưa hoàn tất sẽ được đưa vào prelude ở trạng thái fallback.

Bạn có thể sử dụng cách này cho partial prerendering cùng với [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) hoặc [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream).

## Khắc phục sự cố {/*troubleshooting*/}

### Stream của tôi không bắt đầu cho đến khi toàn bộ ứng dụng được render {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

Response `prerenderToNodeStream` chờ toàn bộ ứng dụng render xong, bao gồm việc chờ tất cả boundary Suspense resolve, rồi mới resolve. API này được thiết kế cho việc tạo static site (SSG) trước thời điểm chạy và không hỗ trợ streaming thêm nội dung khi nội dung đó tải xong.

Để stream nội dung khi nội dung đó tải xong, hãy sử dụng API server render dạng streaming như [renderToPipeableStream](/reference/react-dom/server/renderToPipeableStream).
