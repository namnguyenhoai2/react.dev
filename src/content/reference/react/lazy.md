---
title: lazy
---

<Intro>

`lazy` cho phép bạn trì hoãn việc tải mã của component cho đến khi component đó được render lần đầu tiên.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `lazy(load)` {/*lazy*/}

Gọi `lazy` bên ngoài các component để khai báo một React component được tải lazy:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `load`: Một hàm trả về một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) hoặc một *thenable* khác (một đối tượng giống Promise có phương thức `then`). React sẽ không gọi `load` cho đến lần đầu tiên bạn cố gắng render component được trả về. Sau khi React gọi `load` lần đầu tiên, React sẽ chờ hàm này resolve, rồi render `.default` của giá trị đã được resolve dưới dạng một React component. Cả Promise được trả về và giá trị đã được resolve của Promise đều sẽ được lưu vào cache, vì vậy React sẽ không gọi `load` nhiều hơn một lần. Nếu Promise bị reject, React sẽ `throw` lý do bị reject để Error Boundary gần nhất xử lý.

#### Giá trị trả về {/*returns*/}

`lazy` trả về một React component mà bạn có thể render trong cây của mình. Trong khi mã của lazy component vẫn đang được tải, việc cố gắng render component đó sẽ *suspend*. Hãy sử dụng [`<Suspense>`](/reference/react/Suspense) để hiển thị chỉ báo tải trong khi component đang được tải.

---

### Hàm `load` {/*load*/}

#### Tham số {/*load-parameters*/}

`load` không nhận tham số nào.

#### Giá trị trả về {/*load-returns*/}

Bạn cần trả về một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) hoặc một *thenable* khác (một đối tượng giống Promise có phương thức `then`). Cuối cùng, giá trị này phải resolve thành một đối tượng có thuộc tính `.default` là một loại React component hợp lệ, chẳng hạn như một hàm, [`memo`](/reference/react/memo), hoặc một component [`forwardRef`](/reference/react/forwardRef).

---

## Cách sử dụng {/*usage*/}

### Tải component lazy với Suspense {/*suspense-for-code-splitting*/}

Thông thường, bạn import các component bằng khai báo [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) tĩnh:

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Để trì hoãn việc tải mã của component này cho đến khi component được render lần đầu tiên, hãy thay import này bằng:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

Mã này dựa vào [import `import()` động,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) và có thể cần bundler hoặc framework của bạn hỗ trợ. Việc sử dụng mẫu này yêu cầu lazy component mà bạn import phải được export dưới dạng `default`.

Giờ đây, khi mã của component được tải theo nhu cầu, bạn cũng cần chỉ định nội dung sẽ được hiển thị trong khi component đang tải. Bạn có thể thực hiện việc này bằng cách bọc lazy component hoặc bất kỳ component cha nào của nó trong một [`<Suspense>`](/reference/react/Suspense) boundary:

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
</Suspense>
```

Trong ví dụ này, mã của `MarkdownPreview` sẽ không được tải cho đến khi bạn cố gắng render component đó. Nếu `MarkdownPreview` chưa được tải, `Loading` sẽ được hiển thị thay cho nó. Hãy thử bật checkbox:

<Sandpack>

```js src/App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Add a fixed delay so you can see the loading state
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js src/Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

Bản demo này tải với độ trễ giả lập. Lần tiếp theo bạn bỏ chọn rồi chọn lại checkbox, `Preview` sẽ được lưu vào cache, nên sẽ không còn trạng thái tải. Để xem lại trạng thái tải, hãy nhấp vào "Reset" trên sandbox.

[Tìm hiểu thêm về cách quản lý trạng thái tải với Suspense.](/reference/react/Suspense)

---

## Xử lý sự cố {/*troubleshooting*/}

### Trạng thái của component `lazy` của tôi bị đặt lại ngoài dự kiến {/*my-lazy-components-state-gets-reset-unexpectedly*/}

Không khai báo các component `lazy` *bên trong* những component khác:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Bad: This will cause all state to be reset on re-renders
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Thay vào đó, luôn khai báo chúng ở cấp cao nhất của module:

```js {3-4}
import { lazy } from 'react';

// ✅ Good: Declare lazy components outside of your components
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```