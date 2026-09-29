---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` render một cây React thành một [Node.js Stream](https://nodejs.org/api/stream.html) có thể pipe.

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API này dành riêng cho Node.js. Các môi trường có [Web Streams,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) như Deno và các edge runtime hiện đại nên sử dụng [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) thay thế.

</Note>

---

## Tham chiếu {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

Gọi `renderToPipeableStream` để render cây React của bạn thành HTML vào một [Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Ở phía client, gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) để làm cho HTML do server tạo trở nên tương tác.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reactNode`: Một React node mà bạn muốn render thành HTML. Ví dụ: một phần tử JSX như `<App />`. Node này được kỳ vọng đại diện cho toàn bộ tài liệu, vì vậy component `App` nên render thẻ `<html>`.

* **tùy chọn** `options`: Một object chứa các tùy chọn streaming.
  * **tùy chọn** `bootstrapScriptContent`: Nếu được chỉ định, chuỗi này sẽ được đặt trong một thẻ `<script>` inline.
  * **tùy chọn** `bootstrapScripts`: Một mảng các URL dạng chuỗi cho các thẻ `<script>` sẽ được phát ra trên trang. Sử dụng tùy chọn này để đưa vào `<script>` gọi [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Bỏ qua tùy chọn này nếu bạn hoàn toàn không muốn chạy React trên client.
  * **tùy chọn** `bootstrapModules`: Tương tự `bootstrapScripts`, nhưng thay vào đó sẽ phát ra [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
  * **tùy chọn** `formState`: Trạng thái form từ một lần gửi form được xử lý bởi [Server Function](/reference/rsc/server-functions). Nếu trang được render để phản hồi việc gửi một form sử dụng [`useActionState`](/reference/react/useActionState) cùng với một `permalink`, hãy truyền trạng thái form kết quả để React nhúng nó vào HTML phục vụ hydration. Cùng một giá trị phải được truyền cho [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) ở client. Framework của bạn thường sẽ truyền giá trị này xuyên suốt.
  * **tùy chọn** `identifierPrefix`: Một tiền tố chuỗi mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều root trên cùng một trang. Phải là cùng tiền tố được truyền cho [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **tùy chọn** `importMap`: Một object [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) có các thuộc tính `imports` và `scopes`. React phát nó dưới dạng một thẻ `<script type="importmap">` inline trước mọi module script, để các thẻ `<script type="module">` (ví dụ từ `bootstrapModules`) có thể sử dụng bare module specifier. <CanaryBadge /> Khi `nonce` được thiết lập, nó cũng được áp dụng cho import map script.
  * **tùy chọn** `maxHeadersLength`: Độ dài tổng tối đa của nội dung header được truyền cho `onHeaders`, được đo bằng đơn vị mã UTF-16. Mặc định là 2000. Khi đạt đến giới hạn, React sẽ ngừng thêm resource hint vào các header.
  * **tùy chọn** `namespaceURI`: Một chuỗi chứa [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) gốc cho stream. Mặc định là HTML thông thường. Truyền `'http://www.w3.org/2000/svg'` cho SVG hoặc `'http://www.w3.org/1998/Math/MathML'` cho MathML.
  * **tùy chọn** `nonce`: Một chuỗi [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) cho phép các script trong [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). Để sử dụng các nonce khác nhau cho script và style, hãy truyền một object có các thuộc tính `script` và `style`.
  * **tùy chọn** `onAllReady`: Một callback được gọi khi toàn bộ quá trình rendering hoàn tất, bao gồm cả [shell](#specifying-what-goes-into-the-shell) và toàn bộ [content.](#streaming-more-content-as-it-loads) Bạn có thể sử dụng tùy chọn này thay cho `onShellReady` [đối với crawler và static generation.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Nếu bắt đầu streaming tại đây, bạn sẽ không nhận được progressive loading. Stream sẽ chứa HTML cuối cùng.
  * **tùy chọn** `onBrowserBailout`: Một callback được React gọi khi khôi phục sau [`browser()`](/reference/react-dom/browser) bằng cách để lại một Suspense fallback cho browser thay thế. Callback này nhận một `Error` mô tả việc render chỉ dành cho browser và một object `errorInfo` chứa `componentStack`. Nếu một lý do được truyền cho `browser`, lý do đó sẽ có sẵn dưới dạng `error.cause`. Theo mặc định, React không thực hiện thao tác nào. [Xem cách báo cáo việc render chỉ dành cho browser.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **tùy chọn** `onError`: Một callback được gọi bất cứ khi nào có lỗi phía server, dù lỗi đó [có thể khôi phục](#recovering-from-errors-outside-the-shell) hay [không thể khôi phục.](#recovering-from-errors-inside-the-shell) Theo mặc định, callback này chỉ gọi `console.error`. Nếu bạn ghi đè nó để [ghi log báo cáo crash,](#logging-crashes-on-the-server) hãy đảm bảo vẫn gọi `console.error`. Bạn cũng có thể sử dụng callback này để [điều chỉnh status code](#setting-the-status-code) trước khi shell được phát ra.
  * **tùy chọn** `onHeaders`: Một callback được gọi khi React đã xác định các resource hint cho tài liệu, chẳng hạn như preconnect và preload cho stylesheet, font hoặc hình ảnh có độ ưu tiên cao. Callback này nhận một object có thuộc tính `Link` chứa giá trị [`Link` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/link) tương ứng, để bạn có thể gửi giá trị đó dưới dạng HTTP response header hoặc trong một response [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103). React gọi callback này ngay cả khi không có resource hint nào để gửi. Nội dung header bị giới hạn bởi `maxHeadersLength`.
  * **tùy chọn** `onShellReady`: Một callback được gọi ngay sau khi [initial shell](#specifying-what-goes-into-the-shell) được render. Bạn có thể [thiết lập status code](#setting-the-status-code) và gọi `pipe` tại đây để bắt đầu streaming. React sẽ [stream phần content bổ sung](#streaming-more-content-as-it-loads) sau shell cùng với các thẻ `<script>` inline để thay thế các fallback loading trong HTML bằng content.
  * **tùy chọn** `onShellError`: Một callback được gọi nếu xảy ra lỗi khi render initial shell. Callback nhận lỗi làm đối số. Chưa có byte nào được phát ra từ stream, đồng thời cả `onShellReady` lẫn `onAllReady` đều chưa được gọi, vì vậy bạn có thể [xuất ra một fallback HTML shell.](#recovering-from-errors-inside-the-shell)
  * **tùy chọn** `progressiveChunkSize`: Số byte trong một chunk. [Đọc thêm về heuristic mặc định.](https://github.com/react/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


#### Giá trị trả về {/*returns*/}

`renderToPipeableStream` trả về một object có hai method:

* `pipe` xuất HTML vào [Writable Node.js Stream](https://nodejs.org/api/stream.html#writable-streams) được cung cấp. Gọi `pipe` trong `onShellReady` nếu bạn muốn bật streaming, hoặc trong `onAllReady` cho crawler và static generation.
* `abort` cho phép bạn [hủy việc render phía server](#aborting-server-rendering) và render phần còn lại trên client.

---

## Cách sử dụng {/*usage*/}

### Render một cây React thành HTML vào Node.js Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

Gọi `renderToPipeableStream` để render cây React của bạn thành HTML vào một [Node.js Stream:](https://nodejs.org/api/stream.html#writable-streams)

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Cùng với <CodeStep step={1}>root component</CodeStep>, bạn cần cung cấp một danh sách các đường dẫn <CodeStep step={2}>bootstrap `<script>` paths</CodeStep>. Root component của bạn phải trả về **toàn bộ document, bao gồm cả thẻ `<html>` gốc.**

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

React sẽ chèn [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) và các thẻ <CodeStep step={2}>bootstrap `<script>` tags</CodeStep> của bạn vào HTML stream kết quả:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

Trên client, bootstrap script của bạn sẽ [hydrate toàn bộ `document` bằng một lệnh gọi đến `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Thao tác này sẽ gắn các event listener vào HTML do server tạo và khiến nó trở nên interactive.

<DeepDive>

#### Đọc các đường dẫn asset CSS và JS từ build output {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Các URL asset cuối cùng (chẳng hạn như các file JavaScript và CSS) thường được hash sau khi build. Ví dụ, thay vì `styles.css`, bạn có thể nhận được `styles.123456.css`. Việc hash tên file asset tĩnh đảm bảo rằng mỗi build khác nhau của cùng một asset sẽ có một tên file khác nhau. Điều này hữu ích vì bạn có thể bật caching dài hạn một cách an toàn cho các asset tĩnh: một file có tên cụ thể sẽ không bao giờ thay đổi nội dung.

Tuy nhiên, nếu bạn không biết các URL asset cho đến sau khi build, bạn không thể đưa chúng vào source code. Ví dụ, hardcode `"/styles.css"` vào JSX như trước sẽ không hoạt động. Để giữ chúng bên ngoài source code, root component của bạn có thể đọc tên file thực từ một map được truyền vào dưới dạng prop:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
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

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Vì hiện tại server của bạn đang render `<App assetMap={assetMap} />`, bạn cũng cần render nó bằng `assetMap` trên client để tránh các lỗi hydration. Bạn có thể serialize và truyền `assetMap` đến client như sau:

```js {9-10}
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Trong ví dụ trên, tùy chọn `bootstrapScriptContent` thêm một thẻ `<script>` inline bổ sung, thiết lập biến global `window.assetMap` trên client. Nhờ đó, code phía client có thể đọc cùng `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Cả client và server đều render `App` với cùng prop `assetMap`, vì vậy sẽ không có lỗi hydration.

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

Hãy giả sử việc tải dữ liệu cho `<Posts />` mất một khoảng thời gian. Lý tưởng nhất là bạn muốn hiển thị phần nội dung còn lại của trang hồ sơ cho người dùng mà không phải chờ các bài đăng. Để làm điều này, [wrap `Posts` trong một `<Suspense>` boundary:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

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

Điều này yêu cầu React bắt đầu stream HTML trước khi `Posts` tải dữ liệu của nó. Trước tiên, React sẽ gửi HTML cho loading fallback (`PostsGlimmer`), sau đó, khi `Posts` tải xong dữ liệu, React sẽ gửi phần HTML còn lại cùng một thẻ `<script>` inline để thay loading fallback bằng HTML đó. Theo góc nhìn của người dùng, trang trước tiên sẽ xuất hiện với `PostsGlimmer`, sau đó được thay thế bằng `Posts`.

Bạn có thể [nest `<Suspense>` boundaries](/reference/react/Suspense#revealing-nested-content-as-it-loads) sâu hơn để tạo ra trình tự loading chi tiết hơn:

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

Trong ví dụ này, React có thể bắt đầu stream trang sớm hơn nữa. Chỉ `ProfileLayout` và `ProfileCover` phải hoàn tất việc render trước vì chúng không được bọc trong `<Suspense>` boundary nào. Tuy nhiên, nếu `Sidebar`, `Friends` hoặc `Photos` cần tải một số dữ liệu, React sẽ gửi HTML cho `BigSpinner` fallback thay thế. Sau đó, khi có thêm dữ liệu, nhiều nội dung hơn sẽ tiếp tục được hiển thị cho đến khi toàn bộ nội dung đều hiển thị.

Streaming không cần chờ React tự tải trong trình duyệt hoặc chờ app của bạn trở nên interactive. Nội dung HTML từ server sẽ dần được hiển thị trước khi bất kỳ thẻ `<script>` nào tải xong.

[Đọc thêm về cách streaming HTML hoạt động.](https://github.com/reactwg/react-18/discussions/37)

<Note>

Chỉ dữ liệu được đọc từ một nguồn [activates a Suspense boundary](/reference/react/Suspense#what-activates-a-suspense-boundary), chẳng hạn như một Promise được đọc bằng [`use`](/reference/react/use), mới tạm dừng trong quá trình render. Suspense không phát hiện dữ liệu được fetch bên trong Effect hoặc event handler.

</Note>

---

### Chỉ định nội dung nằm trong shell {/*specifying-what-goes-into-the-shell*/}

Phần app nằm bên ngoài mọi `<Suspense>` boundary được gọi là *shell:*

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

Nó xác định loading state sớm nhất mà người dùng có thể nhìn thấy:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Nếu bạn bọc toàn bộ app trong một `<Suspense>` boundary ở root, shell sẽ chỉ chứa spinner đó. Tuy nhiên, đây không phải là trải nghiệm người dùng dễ chịu, vì việc nhìn thấy một spinner lớn trên màn hình có thể tạo cảm giác chậm hơn và khó chịu hơn so với việc chờ thêm một chút để thấy layout thực tế. Vì vậy, thông thường bạn sẽ muốn đặt các `<Suspense>` boundaries sao cho shell có cảm giác *tối giản nhưng hoàn chỉnh*--giống như skeleton của toàn bộ layout trang.

Callback `onShellReady` được gọi khi toàn bộ shell đã được render. Thông thường, bạn sẽ bắt đầu streaming khi đó:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Khi `onShellReady` được gọi, các component trong những `<Suspense>` boundaries lồng nhau có thể vẫn đang tải dữ liệu.

---

### Ghi log các crash trên server {/*logging-crashes-on-the-server*/}

Theo mặc định, mọi lỗi trên server đều được log ra console. Bạn có thể ghi đè hành vi này để log các crash report:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Nếu cung cấp implementation `onError` tùy chỉnh, đừng quên cũng log các lỗi ra console như trên.

---

### Khôi phục từ lỗi bên trong shell {/*recovering-from-errors-inside-the-shell*/}

Trong ví dụ này, shell chứa `ProfileLayout`, `ProfileCover` và `PostsGlimmer`:

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

Nếu xảy ra lỗi trong khi render các component đó, React sẽ không có HTML có ý nghĩa nào để gửi đến client. Hãy ghi đè `onShellError` để gửi HTML fallback không phụ thuộc vào server rendering như phương án cuối cùng:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Nếu xảy ra lỗi trong khi tạo shell, cả `onError` và `onShellError` đều sẽ được gọi. Sử dụng `onError` để báo cáo lỗi và sử dụng `onShellError` để gửi fallback HTML document. Fallback HTML của bạn không nhất thiết phải là một trang lỗi. Thay vào đó, bạn có thể bao gồm một shell thay thế, render app của bạn chỉ trên client.

---

### Khôi phục từ lỗi bên ngoài shell {/*recovering-from-errors-outside-the-shell*/}

Trong ví dụ này, component `<Posts />` được bọc trong `<Suspense>`, nên nó *không phải* là một phần của shell:

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

1. Nó sẽ đưa loading fallback của `<Suspense>` boundary gần nhất (`PostsGlimmer`) vào HTML.
2. Nó sẽ “từ bỏ” việc tiếp tục render nội dung `Posts` trên server.
3. Khi code JavaScript tải trên client, React sẽ *thử lại* việc render `Posts` trên client.

Nếu việc thử lại render `Posts` trên client *cũng thất bại*, React sẽ throw error trên client. Cũng như mọi lỗi được throw trong quá trình render, [closest parent error boundary](/reference/react/Component#static-getderivedstatefromerror) sẽ quyết định cách hiển thị lỗi cho người dùng. Trên thực tế, điều này có nghĩa là người dùng sẽ thấy loading indicator cho đến khi chắc chắn rằng lỗi không thể khôi phục.

Nếu việc thử lại render `Posts` trên client thành công, loading fallback từ server sẽ được thay thế bằng output do client rendering tạo ra. Người dùng sẽ không biết rằng đã xảy ra lỗi trên server. Tuy nhiên, callback `onError` của server và các callback [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) của client sẽ được gọi để bạn nhận thông báo về lỗi.

---

### Thiết lập status code {/*setting-the-status-code*/}

Streaming tạo ra một sự đánh đổi. Bạn muốn bắt đầu stream trang sớm nhất có thể để người dùng nhìn thấy nội dung sớm hơn. Tuy nhiên, một khi đã bắt đầu streaming, bạn không thể tiếp tục đặt status code của response.

Bằng cách [phân chia ứng dụng của bạn](#specifying-what-goes-into-the-shell) thành phần shell (nằm trên tất cả các boundary `<Suspense>`) và phần nội dung còn lại, bạn đã giải quyết được một phần vấn đề này. Nếu shell xảy ra lỗi, bạn sẽ nhận được callback `onShellError`, cho phép bạn đặt mã trạng thái lỗi. Nếu không, bạn biết rằng ứng dụng có thể khôi phục ở client, nên bạn có thể gửi mã "OK".

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Nếu một component *bên ngoài* shell (tức là bên trong một boundary `<Suspense>`) xảy ra lỗi, React sẽ không dừng việc render. Điều này có nghĩa là callback `onError` sẽ được gọi, nhưng bạn vẫn nhận được `onShellReady` thay vì `onShellError`. Điều này là do React sẽ cố gắng khôi phục lỗi đó ở client, [như đã mô tả ở trên.](#recovering-from-errors-outside-the-shell)

Tuy nhiên, nếu muốn, bạn có thể sử dụng việc đã xảy ra lỗi để đặt mã trạng thái:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Cách này chỉ bắt được các lỗi bên ngoài shell xảy ra trong khi tạo nội dung shell ban đầu, nên không bao quát mọi trường hợp. Nếu việc biết một phần nội dung nào đó có xảy ra lỗi hay không là quan trọng, bạn có thể đưa phần đó lên shell.

---

### Xử lý các lỗi khác nhau theo những cách khác nhau {/*handling-different-errors-in-different-ways*/}

Bạn có thể [tạo các lớp con `Error` của riêng mình](https://javascript.info/custom-errors) và sử dụng toán tử [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) để kiểm tra lỗi nào đã được throw. Ví dụ, bạn có thể định nghĩa một `NotFoundError` tùy chỉnh và throw nó từ component của mình. Sau đó, các callback `onError`, `onShellReady` và `onShellError` có thể thực hiện những việc khác nhau tùy thuộc vào loại lỗi:

```js {2,4-14,19,24,30}
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

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Hãy nhớ rằng một khi bạn đã gửi shell và bắt đầu streaming, bạn không thể thay đổi mã trạng thái.

---

### Chờ toàn bộ nội dung tải xong cho crawler và việc tạo static {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Streaming mang lại trải nghiệm người dùng tốt hơn vì người dùng có thể xem nội dung ngay khi nội dung đó sẵn sàng.

Tuy nhiên, khi crawler truy cập trang của bạn hoặc khi bạn đang tạo các trang trong thời gian build, bạn có thể muốn để toàn bộ nội dung tải xong trước, sau đó tạo output HTML cuối cùng thay vì hiển thị nội dung dần dần.

Bạn có thể chờ toàn bộ nội dung tải xong bằng callback `onAllReady`:


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... depends on your bot detection strategy ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Khách truy cập thông thường sẽ nhận được một stream nội dung được tải dần. Crawler sẽ nhận output HTML cuối cùng sau khi toàn bộ dữ liệu tải xong. Tuy nhiên, điều này cũng có nghĩa là crawler sẽ phải chờ *toàn bộ* dữ liệu, trong đó một phần có thể tải chậm hoặc xảy ra lỗi. Tùy thuộc vào ứng dụng, bạn cũng có thể chọn gửi shell cho crawler.

---

### Hủy việc render phía server {/*aborting-server-rendering*/}

Bạn có thể buộc việc render phía server “bỏ cuộc” sau một khoảng thời gian chờ:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React sẽ flush các fallback đang loading còn lại dưới dạng HTML và sẽ cố gắng render phần còn lại ở client.