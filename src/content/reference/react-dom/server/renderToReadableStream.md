---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream` render một cây React thành [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API này phụ thuộc vào [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Đối với Node.js, hãy sử dụng [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) thay thế.

</Note>

---

## Tham chiếu {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

Gọi `renderToReadableStream` để render cây React của bạn thành HTML vào một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Ở phía client, gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML do server tạo có tính tương tác.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một React node mà bạn muốn render thành HTML. Ví dụ: một phần tử JSX như `<App />`. Node này được kỳ vọng là đại diện cho toàn bộ document, vì vậy component `App` phải render thẻ `<html>`.

* **tùy chọn** `options`: Một object chứa các tùy chọn streaming.
  * **tùy chọn** `bootstrapScriptContent`: Nếu được chỉ định, chuỗi này sẽ được đặt trong một thẻ `<script>` inline.
  * **tùy chọn** `bootstrapScripts`: Một mảng các URL dạng chuỗi cho các thẻ `<script>` cần phát ra trên trang. Sử dụng tùy chọn này để đưa vào `<script>` gọi [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Bỏ qua tùy chọn này nếu bạn hoàn toàn không muốn chạy React trên client.
  * **tùy chọn** `bootstrapModules`: Tương tự `bootstrapScripts`, nhưng phát ra [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) thay thế.
  * **tùy chọn** `formState`: Trạng thái form từ một lần gửi form được xử lý bởi [Server Function](/reference/rsc/server-functions). Nếu trang được render để phản hồi việc gửi một form sử dụng [`useActionState`](/reference/react/useActionState) cùng với một `permalink`, hãy truyền trạng thái form thu được để React nhúng trạng thái đó vào HTML phục vụ hydration. Phải truyền cùng giá trị này cho [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) trên client. Framework của bạn thường sẽ truyền giá trị này qua.
  * **tùy chọn** `identifierPrefix`: Một tiền tố dạng chuỗi mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Tùy chọn này hữu ích để tránh xung đột khi sử dụng nhiều root trên cùng một trang. Tiền tố phải giống với tiền tố được truyền cho [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **tùy chọn** `importMap`: Một object [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) có các thuộc tính `imports` và `scopes`. React phát object này dưới dạng một thẻ `<script type="importmap">` inline trước mọi module script, để các thẻ `<script type="module">` (ví dụ từ `bootstrapModules`) có thể sử dụng bare module specifier. <CanaryBadge /> Khi `nonce` được thiết lập, nó cũng được áp dụng cho import map script.
  * **tùy chọn** `maxHeadersLength`: Độ dài tổng tối đa của nội dung header được truyền cho `onHeaders`, được đo bằng đơn vị mã UTF-16. Mặc định là 2000. Khi đạt đến giới hạn, React sẽ ngừng thêm resource hint vào các header.
  * **tùy chọn** `namespaceURI`: Một chuỗi chứa [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) gốc cho stream. Mặc định là HTML thông thường. Truyền `'http://www.w3.org/2000/svg'` cho SVG hoặc `'http://www.w3.org/1998/Math/MathML'` cho MathML.
  * **tùy chọn** `nonce`: Một chuỗi [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) để cho phép các script cho [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). Để sử dụng các nonce khác nhau cho script và style, hãy truyền một object có các thuộc tính `script` và `style`.
  * **tùy chọn** `onBrowserBailout`: Một callback được React gọi khi khôi phục từ [`browser()`](/reference/react-dom/browser) bằng cách để lại một Suspense fallback cho trình duyệt thay thế. Callback nhận một `Error` mô tả việc render chỉ dành cho trình duyệt và một object `errorInfo` chứa `componentStack`. Nếu một lý do được truyền cho `browser`, lý do đó sẽ có sẵn dưới dạng `error.cause`. Theo mặc định, React không làm gì cả. [Xem cách báo cáo việc render chỉ dành cho trình duyệt.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **tùy chọn** `onError`: Một callback được kích hoạt bất cứ khi nào có lỗi server, dù lỗi đó [recoverable](#recovering-from-errors-outside-the-shell) hay [not.](#recovering-from-errors-inside-the-shell) Theo mặc định, callback này chỉ gọi `console.error`. Nếu bạn ghi đè callback để [log crash reports,](#logging-crashes-on-the-server) hãy đảm bảo rằng bạn vẫn gọi `console.error`. Bạn cũng có thể sử dụng callback này để [adjust the status code](#setting-the-status-code) trước khi shell được phát ra.
  * **tùy chọn** `onHeaders`: Một callback được kích hoạt khi React đã xác định các resource hint cho document, chẳng hạn như preconnect và preload stylesheet, font hoặc hình ảnh có độ ưu tiên cao. Callback nhận một instance [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) chứa giá trị [`Link` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/link) tương ứng, để bạn có thể gửi giá trị đó dưới dạng HTTP response header hoặc response [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103). React gọi callback ngay cả khi không có resource hint nào cần gửi. Nội dung header được giới hạn bởi `maxHeadersLength`.
  * **tùy chọn** `progressiveChunkSize`: Số byte trong một chunk. [Đọc thêm về heuristic mặc định.](https://github.com/react/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **tùy chọn** `signal`: Một [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) cho phép bạn [abort server rendering](#aborting-server-rendering) và render phần còn lại trên client.


#### Giá trị trả về {/*returns*/}

`renderToReadableStream` trả về một Promise:

- Nếu việc render [shell](#specifying-what-goes-into-the-shell) thành công, Promise đó sẽ resolve thành một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- Nếu việc render shell thất bại, Promise sẽ bị reject. [Sử dụng điều này để xuất một shell dự phòng.](#recovering-from-errors-inside-the-shell)

Stream được trả về có thêm một thuộc tính:

* `allReady`: Một Promise resolve khi toàn bộ quá trình render hoàn tất, bao gồm cả [shell](#specifying-what-goes-into-the-shell) và toàn bộ [content__ bổ sung.](#streaming-more-content-as-it-loads) Bạn có thể `await stream.allReady` trước khi trả về response [cho crawler và việc tạo static.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Nếu làm vậy, bạn sẽ không nhận được progressive loading. Stream sẽ chứa HTML cuối cùng.

---

## Cách sử dụng {/*usage*/}

### Render một cây React thành HTML vào một Readable Web Stream {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

Gọi `renderToReadableStream` để render cây React của bạn thành HTML vào một [Readable Web Stream:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Cùng với <CodeStep step={1}>root component</CodeStep>, bạn cần cung cấp một danh sách các đường dẫn <CodeStep step={2}>bootstrap `<script>` </CodeStep>. Root component của bạn phải trả về **toàn bộ document, bao gồm cả thẻ `<html>` root.**

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

React sẽ chèn [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) và các thẻ <CodeStep step={2}>bootstrap `<script>` </CodeStep> vào HTML stream kết quả:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

Trên client, bootstrap script của bạn nên [hydrate toàn bộ `document` bằng một lời gọi tới `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Thao tác này sẽ gắn các event listener vào HTML do server tạo và làm cho HTML đó có tính tương tác.

<DeepDive>

#### Đọc đường dẫn asset CSS và JS từ build output {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Các URL asset cuối cùng (chẳng hạn như các file JavaScript và CSS) thường được thêm hash sau khi build. Ví dụ, thay vì `styles.css`, bạn có thể nhận được `styles.123456.css`. Việc thêm hash vào tên file asset tĩnh đảm bảo rằng mỗi build khác nhau của cùng một asset sẽ có một tên file khác nhau. Điều này hữu ích vì cho phép bạn bật caching dài hạn một cách an toàn cho các asset tĩnh: một file có tên nhất định sẽ không bao giờ thay đổi nội dung.

Tuy nhiên, nếu bạn chưa biết các URL asset cho đến sau khi build, bạn không có cách nào đưa chúng vào source code. Ví dụ, hardcode `"/styles.css"` vào JSX như trước đây sẽ không hoạt động. Để loại chúng khỏi source code, root component của bạn có thể đọc tên file thực từ một map được truyền vào dưới dạng prop:

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

Trên server, render `<App assetMap={assetMap} />` và truyền `assetMap` của bạn cùng các URL asset:

```js {1-5,8,9}
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Vì hiện tại server đang render `<App assetMap={assetMap} />`, bạn cũng cần render nó với `assetMap` trên client để tránh lỗi hydration. Bạn có thể serialize và truyền `assetMap` cho client như sau:

```js {9-10}
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Trong ví dụ trên, tùy chọn `bootstrapScriptContent` thêm một thẻ `<script>` inline bổ sung, thẻ này thiết lập biến toàn cục `window.assetMap` trên client. Nhờ đó, code phía client có thể đọc cùng `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Cả client và server đều render `App` với cùng prop `assetMap`, nên không xảy ra lỗi hydration.

</DeepDive>

---

### Stream thêm nội dung khi nội dung đó được tải {/*streaming-more-content-as-it-loads*/}

Streaming cho phép người dùng bắt đầu nhìn thấy nội dung ngay cả trước khi toàn bộ dữ liệu được tải trên server. Ví dụ, hãy xem xét một trang hồ sơ hiển thị ảnh bìa, sidebar chứa bạn bè và ảnh, cùng danh sách bài đăng:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

Hãy tưởng tượng việc tải dữ liệu cho `<Posts />` mất một khoảng thời gian. Lý tưởng nhất là bạn muốn hiển thị phần nội dung còn lại của trang hồ sơ cho người dùng mà không phải chờ các bài đăng. Để làm điều này, [wrap `Posts` trong một `<Suspense>` boundary:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
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

Điều này yêu cầu React bắt đầu streaming HTML trước khi `Posts` tải xong dữ liệu. React trước tiên sẽ gửi HTML cho loading fallback (`PostsGlimmer`), sau đó, khi `Posts` tải xong dữ liệu, React sẽ gửi phần HTML còn lại cùng một thẻ `<script>` inline để thay loading fallback bằng HTML đó. Theo góc nhìn của người dùng, trang trước tiên sẽ xuất hiện với `PostsGlimmer`, rồi sau đó được thay bằng `Posts`.

Bạn có thể [nest thêm các `<Suspense>` boundary](/reference/react/Suspense#revealing-nested-content-as-it-loads) để tạo ra trình tự loading chi tiết hơn:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Trong ví dụ này, React có thể bắt đầu streaming trang thậm chí còn sớm hơn. Chỉ `ProfileLayout` và `ProfileCover` phải hoàn tất render trước vì chúng không được bọc trong bất kỳ `<Suspense>` boundary nào. Tuy nhiên, nếu `Sidebar`, `Friends`, hoặc `Photos` cần tải dữ liệu, React sẽ gửi HTML cho `BigSpinner` fallback thay thế. Sau đó, khi có thêm dữ liệu, ngày càng nhiều nội dung sẽ tiếp tục được hiển thị cho đến khi toàn bộ nội dung đều xuất hiện.

Streaming không cần chờ React tự tải trong trình duyệt hoặc chờ ứng dụng của bạn trở nên có tính tương tác. Nội dung HTML từ server sẽ dần được hiển thị trước khi bất kỳ thẻ `<script>` nào tải xong.

[Đọc thêm về cách streaming HTML hoạt động.](https://github.com/reactwg/react-18/discussions/37)

<Note>

Chỉ dữ liệu được đọc từ một nguồn [activates a Suspense boundary](/reference/react/Suspense#what-activates-a-suspense-boundary), chẳng hạn như một Promise được đọc bằng [`use`](/reference/react/use), mới suspend trong quá trình render. Suspense không phát hiện dữ liệu được fetch bên trong Effect hoặc event handler.

</Note>

---

### Xác định nội dung đưa vào shell {/*specifying-what-goes-into-the-shell*/}

Phần ứng dụng nằm ngoài mọi `<Suspense>` boundary được gọi là *shell:*

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Nó xác định trạng thái loading sớm nhất mà người dùng có thể nhìn thấy:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Nếu bạn bọc toàn bộ ứng dụng trong một `<Suspense>` boundary ở root, shell sẽ chỉ chứa spinner đó. Tuy nhiên, đây không phải là trải nghiệm người dùng dễ chịu vì việc nhìn thấy một spinner lớn trên màn hình có thể tạo cảm giác chậm hơn và khó chịu hơn so với chờ thêm một chút để thấy layout thực tế. Vì vậy, thông thường bạn sẽ muốn đặt các `<Suspense>` boundary sao cho shell có cảm giác *tối giản nhưng đầy đủ*—giống như skeleton của toàn bộ layout trang.

Lời gọi async tới `renderToReadableStream` sẽ resolve thành một `stream` ngay khi toàn bộ shell đã được render. Thông thường, bạn sẽ bắt đầu streaming bằng cách tạo và trả về một response với `stream` đó:

```js {5}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Khi `stream` được trả về, các component trong những `<Suspense>` boundary lồng nhau có thể vẫn đang tải dữ liệu.

---

### Ghi log các crash trên server {/*logging-crashes-on-the-server*/}

Theo mặc định, mọi lỗi trên server đều được ghi vào console. Bạn có thể ghi đè hành vi này để log crash report:

```js {4-7}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Nếu bạn cung cấp một implementation `onError` tùy chỉnh, đừng quên đồng thời log lỗi vào console như trên.

---

### Khôi phục từ lỗi bên trong shell {/*recovering-from-errors-inside-the-shell*/}

Trong ví dụ này, shell chứa `ProfileLayout`, `ProfileCover`, và `PostsGlimmer`:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Nếu xảy ra lỗi trong khi render các component đó, React sẽ không có HTML có ý nghĩa nào để gửi cho client. Hãy bọc lời gọi `renderToReadableStream` của bạn trong một `try...catch` để gửi HTML fallback không phụ thuộc vào server rendering như phương án cuối cùng:

```js {2,13-18}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Nếu xảy ra lỗi khi tạo shell, cả `onError` và block `catch` của bạn đều sẽ được gọi. Sử dụng `onError` để báo cáo lỗi và sử dụng block `catch` để gửi tài liệu HTML fallback. HTML fallback của bạn không nhất thiết phải là một trang lỗi. Thay vào đó, bạn có thể đưa vào một shell thay thế để render ứng dụng chỉ trên client.

---

### Khôi phục từ lỗi bên ngoài shell {/*recovering-from-errors-outside-the-shell*/}

Trong ví dụ này, component `<Posts />` được bọc trong `<Suspense>` nên *không* thuộc shell:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Nếu xảy ra lỗi trong component `Posts` hoặc ở đâu đó bên trong nó, React sẽ [try to recover from it:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. Nó sẽ đưa loading fallback của boundary `<Suspense>` gần nhất (`PostsGlimmer`) vào HTML.
2. Nó sẽ “từ bỏ” việc tiếp tục render nội dung `Posts` trên server.
3. Khi code JavaScript tải trên client, React sẽ *thử lại* việc render `Posts` trên client.

Nếu việc thử lại render `Posts` trên client *cũng* thất bại, React sẽ throw lỗi trên client. Cũng như mọi lỗi được throw trong quá trình render, [closest parent error boundary](/reference/react/Component#static-getderivedstatefromerror) sẽ quyết định cách hiển thị lỗi cho người dùng. Trên thực tế, điều này có nghĩa là người dùng sẽ thấy loading indicator cho đến khi xác định chắc chắn rằng lỗi không thể khôi phục.

Nếu việc thử lại render `Posts` trên client thành công, loading fallback từ server sẽ được thay bằng output render từ client. Người dùng sẽ không biết đã xảy ra lỗi trên server. Tuy nhiên, callback `onError` trên server và các callback [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) trên client sẽ được gọi để bạn nhận thông báo về lỗi.

---

### Thiết lập status code {/*setting-the-status-code*/}

Streaming tạo ra một sự đánh đổi. Bạn muốn bắt đầu streaming trang sớm nhất có thể để người dùng nhìn thấy nội dung sớm hơn. Tuy nhiên, một khi đã bắt đầu streaming, bạn không thể tiếp tục thiết lập status code của response.

Bằng cách [dividing your app](#specifying-what-goes-into-the-shell) thành shell (nằm phía trên tất cả các `<Suspense>` boundary) và phần nội dung còn lại, bạn đã giải quyết được một phần vấn đề này. Nếu shell xảy ra lỗi, block `catch` của bạn sẽ chạy, cho phép bạn thiết lập status code lỗi. Nếu không, bạn biết rằng ứng dụng có thể khôi phục trên client, nên có thể gửi “OK”.

```js {11}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Nếu một component *bên ngoài* shell (tức là nằm trong ranh giới `<Suspense>`) xảy ra lỗi, React sẽ không dừng quá trình render. Điều này có nghĩa là callback `onError` sẽ được gọi, nhưng code của bạn vẫn tiếp tục chạy mà không đi vào block `catch`. Đó là vì React sẽ cố gắng khôi phục từ lỗi đó ở client, [như đã mô tả ở trên.](#recovering-from-errors-outside-the-shell)

Tuy nhiên, nếu muốn, bạn có thể sử dụng việc đã xảy ra lỗi để thiết lập status code:

```js {3,7,13}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Cách này chỉ bắt được các lỗi bên ngoài shell xảy ra trong khi tạo nội dung shell ban đầu, nên không bao quát mọi trường hợp. Nếu việc biết liệu một số nội dung có xảy ra lỗi hay không là rất quan trọng, bạn có thể đưa nội dung đó vào shell.

---

### Xử lý các lỗi khác nhau theo những cách khác nhau {/*handling-different-errors-in-different-ways*/}

Bạn có thể [tạo các subclass `Error` tùy chỉnh](https://javascript.info/custom-errors) của riêng mình và sử dụng toán tử [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) để kiểm tra lỗi nào đã được ném ra. Ví dụ: bạn có thể định nghĩa một `NotFoundError` tùy chỉnh và ném nó từ component của mình. Sau đó, bạn có thể lưu lỗi vào `onError` và thực hiện việc khác trước khi trả về response, tùy thuộc vào loại lỗi:

```js {2-3,5-15,22,28,33}
async function handler(request) {
  let didError = false;
  let caughtError = null;

  function getStatusCode() {
    if (didError) {
      if (caughtError instanceof NotFoundError) {
        return 404;
      } else {
        return 500;
      }
    } else {
      return 200;
    }
  }

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Hãy nhớ rằng một khi đã phát shell và bắt đầu streaming, bạn không thể thay đổi status code.

---

### Chờ toàn bộ nội dung tải xong cho crawler và static generation {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Streaming mang lại trải nghiệm tốt hơn cho người dùng vì họ có thể xem nội dung ngay khi nội dung đó khả dụng.

Tuy nhiên, khi crawler truy cập trang của bạn hoặc khi bạn đang tạo các trang tại thời điểm build, bạn có thể muốn để toàn bộ nội dung tải xong trước, rồi tạo đầu ra HTML cuối cùng thay vì hiển thị nội dung dần dần.

Bạn có thể chờ toàn bộ nội dung tải xong bằng cách await Promise `stream.allReady`:

```js {12-15}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... depends on your bot detection strategy ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Khách truy cập thông thường sẽ nhận được stream với nội dung được tải dần. Crawler sẽ nhận đầu ra HTML cuối cùng sau khi toàn bộ dữ liệu tải xong. Tuy nhiên, điều này cũng có nghĩa là crawler sẽ phải chờ *tất cả* dữ liệu, trong đó một phần có thể tải chậm hoặc xảy ra lỗi. Tùy thuộc vào app của bạn, bạn cũng có thể chọn gửi shell cho crawler.

---

### Hủy server rendering {/*aborting-server-rendering*/}

Bạn có thể buộc server rendering “từ bỏ” sau một khoảng thời gian chờ:

```js {3,4-6,9}
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
```

React sẽ flush các loading fallback còn lại dưới dạng HTML và cố gắng render phần còn lại ở client.