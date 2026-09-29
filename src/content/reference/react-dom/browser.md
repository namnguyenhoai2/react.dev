---
title: trình duyệt
---

<Intro>

`browser` cho phép bạn đánh dấu một component chỉ dành cho trình duyệt trong quá trình render phía server.

```js
use(browser(reason?))
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `browser(reason?)` {/*browser*/}

Gọi `browser` bên trong [`use`](/reference/react/use) để đánh dấu một component chỉ dành cho trình duyệt trong quá trình render phía server:

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('This component requires browser APIs.'));
  return <BrowserContent />;
}
```

Trong quá trình render phía server, `use(browser())` dừng việc render component và để fallback của boundary [`<Suspense>`](/reference/react/Suspense) gần nhất thay vào đó. Trong trình duyệt, `use(browser())` trả về `undefined`, vì vậy component được render bình thường.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* **tùy chọn** `reason`: Một chuỗi hoặc function giải thích lý do nội dung cần được render trong trình duyệt. Chuỗi hoặc giá trị trả về của function sẽ trở thành `cause` của `Error` được truyền đến [`onBrowserBailout`](#reporting-browser-only-rendering-on-the-server). React gọi function lý do mỗi khi server renderer gặp giá trị do `browser` trả về, nhưng không gọi function này trong trình duyệt. Nếu việc tạo lý do tốn kém, hãy truyền một function như `() => new Error(...)`.

#### Giá trị trả về {/*returns*/}

`browser` trả về một giá trị opaque mà bạn có thể truyền vào `use` trong một component hoặc dùng làm lý do khi [hủy một lần render phía server](#aborting-pending-server-rendering-for-the-browser). Trong trình duyệt, việc truyền giá trị này vào `use` sẽ trả về `undefined`.

#### Lưu ý {/*caveats*/}

* `use(browser())` phải nằm bên trong một boundary `<Suspense>` trong quá trình render phía server. Nếu không có boundary này, quá trình render phía server sẽ thất bại.
* `use(browser())` phải được gọi từ một [Client Component](/reference/rsc/use-client), không phải một [Server Component](/reference/rsc/server-components).
* Việc tự gọi `browser()` không có tác dụng. Để đánh dấu một component chỉ dành cho trình duyệt, hãy truyền giá trị do `browser` trả về vào `use`. Không được throw giá trị đó.

---

## Cách sử dụng {/*usage*/}

### Chỉ render nội dung trong trình duyệt {/*rendering-content-only-in-the-browser*/}

Gọi `browser` bên trong `use` trong một component chỉ nên được render trong trình duyệt:

Bạn có thể dùng cách này thay cho việc kiểm tra `typeof window`, chờ một [`Effect`](/reference/react/useEffect) để thiết lập trạng thái đã mount, hoặc dùng một tùy chọn của framework để tắt server rendering.

Nhấp vào **Reload** để xem fallback loading trong HTML ban đầu. Sau hydration, React hiển thị bản nháp được tải từ `localStorage`.

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('The draft is stored in localStorage.'));
  const [draft, setDraft] = useState(
    () => localStorage.getItem('draft') ?? ''
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem('draft', nextDraft);
  }

  return (
    <label>
      Draft:
      <textarea
        value={draft}
        onChange={handleChange}
        rows={4}
        cols={30}
      />
    </label>
  );
}

export default function App() {
  return (
    <>
      <h1>Saved draft</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Saved draft</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
          label, textarea { display: block; }
          textarea { margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Browser-only rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 160px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Note>

`use(browser())` phải được gọi từ một Client Component. Nếu framework của bạn mặc định sử dụng Server Components, hãy thêm directive [`'use client'`](/reference/rsc/use-client) vào file đó hoặc chuyển lời gọi sang một Client Component con:

```js {1}
'use client';

import { use, useState } from 'react';
import { browser } from 'react-dom';

export default function SavedDraft() {
  use(browser('The saved draft is stored in localStorage.'));
  const [draft] = useState(() => localStorage.getItem('draft') ?? '');
  return <DraftEditor initialDraft={draft} />;
}
```

</Note>

---

### Render có điều kiện trên server {/*conditionally-rendering-on-the-server*/}

Giống như các lời gọi khác đến [`use`](/reference/react/use), `use(browser())` có thể được gọi bên trong một câu lệnh điều kiện hoặc sau một early return. Điều này cho phép một Component hoặc custom Hook chọn không render phía server dựa trên một điều kiện, chẳng hạn như giá trị của một prop.

Ví dụ, `useTimeZone` Hook này chấp nhận một giá trị mặc định tùy chọn. Khi được cung cấp, React sẽ render giá trị mặc định trong HTML ban đầu và trong trình duyệt. Nếu không có giá trị mặc định, Component sẽ suspend trong quá trình render phía server và hiển thị múi giờ cục bộ của thiết bị trong trình duyệt.

Nhấp vào **Reload** để xem fallback loading trước khi múi giờ của người dùng xuất hiện.

<Sandpack>

```js src/App.js
import { Suspense } from 'react';
import { useTimeZone } from './useTimeZone.js';

function TimeZone({label, defaultTimeZone}) {
  const timeZone = useTimeZone(defaultTimeZone);
  return <p>{label}: <strong>{timeZone}</strong></p>;
}

export default function App() {
  return (
    <>
      <h1>Event details</h1>
      <TimeZone
        label="Event time zone"
        defaultTimeZone="America/New_York"
      />
      <Suspense fallback={<p>Loading your time zone...</p>}>
        <TimeZone label="Your time zone" />
      </Suspense>
    </>
  );
}
```

```js src/useTimeZone.js active
import { use } from 'react';
import { browser } from 'react-dom';

export function useTimeZone(defaultTimeZone) {
  if (defaultTimeZone !== undefined) {
    return defaultTimeZone;
  }

  use(browser('No default time zone was provided.'));
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Bạn có thể áp dụng pattern tương tự để có điều kiện tránh render phía server khi sử dụng thư viện data-fetching hỗ trợ Suspense:

```js {3}
function useBrowserQuery(query, options) {
  if (options.initialData === undefined) {
    use(browser('useBrowserQuery: No initial data was provided.'));
  }

  return useQuery(query, options);
}

function ProductDetails({ productId, initialData }) {
  const product = useBrowserQuery(`/api/products/${productId}`, {
    initialData,
  });

  return <h1>{product.name}</h1>;
}
```

Với `initialData`, React render Component thành HTML trên server. Nếu không có nó, React để fallback của boundary [`<Suspense>`](/reference/react/Suspense) gần nhất trong HTML. Trong trình duyệt, `useQuery` có thể fetch dữ liệu hoặc đọc dữ liệu từ client cache như bình thường.

---

### Báo cáo việc render chỉ dành cho trình duyệt trên server {/*reporting-browser-only-rendering-on-the-server*/}

Truyền một callback `onBrowserBailout` cho server renderer để báo cáo việc render chỉ dành cho trình duyệt. Khi React để lại một Suspense fallback cho trình duyệt, nó không gọi callback `onError` của server renderer hoặc callback [`hydrateRoot` `onRecoverableError`](/reference/react-dom/client/hydrateRoot#error-logging-in-production). Ví dụ này cũng truyền một lý do, có sẵn trong `cause` của lỗi được báo cáo:

```js
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';
import { renderToPipeableStream } from 'react-dom/server';

function SavedDraft() {
  use(browser(() => new Error('The saved draft is stored in localStorage.')));
  const [draft] = useState(() => localStorage.getItem('draft') ?? '');
  return <DraftEditor initialDraft={draft} />;
}

function App() {
  return (
    <Suspense fallback={<p>Loading saved draft...</p>}>
      <SavedDraft />
    </Suspense>
  );
}

const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
  },
  onBrowserBailout(error, errorInfo) {
    logBrowserBailout(error, errorInfo);
  }
});
```

`onBrowserBailout` nhận hai đối số:

1. Một `Error` mô tả việc render chỉ dành cho trình duyệt. Nếu bạn truyền một lý do vào `browser`, lý do đó có sẵn trong `cause` của lỗi.
2. Một object `errorInfo` có `componentStack` cho biết nơi xảy ra việc render chỉ dành cho trình duyệt.

Function lý do có thể trả về bất kỳ giá trị nào. Hãy trả về một `Error` mới để nguyên nhân có stack riêng mà không tạo `Error` trong trình duyệt. React không serialize lý do vào HTML.

Nếu không có Suspense boundary để cung cấp fallback, quá trình render phía server sẽ thất bại. React báo cáo lỗi thông qua các callback lỗi thông thường của renderer thay vì `onBrowserBailout`.

---

### Hủy quá trình render phía server đang chờ để trình duyệt tiếp tục {/*aborting-pending-server-rendering-for-the-browser*/}

Nếu bạn gọi trực tiếp một API render phía server, bạn có thể dừng chờ nội dung đang chờ xử lý và để trình duyệt hoàn tất việc render. Truyền giá trị do `browser` trả về làm lý do khi hủy quá trình render phía server. Sau đó React để các Suspense boundary đang chờ ở trạng thái fallback và render nội dung của chúng trong trình duyệt:

```js {1,8}
import { browser } from 'react-dom';
import { renderToPipeableStream } from 'react-dom/server';

const { pipe, abort } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
    setTimeout(() => {
      abort(browser('The server render timed out.'));
    }, 10000);
  }
});
```

Một lý do hủy `browser` không kích hoạt callback `onError` của server renderer hoặc callback `hydrateRoot` của `onRecoverableError`. Thay vào đó, server renderer báo cáo từng Suspense boundary đã được khôi phục cho `onBrowserBailout`.

Đối với các API render phía server chấp nhận một [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), hãy truyền `browser()` làm lý do cho [`AbortController.abort`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).