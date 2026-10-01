---
title: createRoot
---

<Intro>

`createRoot` cho phép bạn tạo một root để hiển thị các React component bên trong một node DOM của trình duyệt.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Gọi `createRoot` để tạo một React root nhằm hiển thị nội dung bên trong một phần tử DOM của trình duyệt.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React sẽ tạo một root cho `domNode` và tiếp quản việc quản lý DOM bên trong nó. Sau khi tạo root, bạn cần gọi [`root.render`](#root-render) để hiển thị một React component bên trong nó:

```js
root.render(<App />);
```

Một app được xây dựng hoàn toàn bằng React thường chỉ có một lệnh gọi `createRoot` cho component root của app. Một trang sử dụng React theo kiểu “rắc thêm” cho từng phần của trang có thể có nhiều root riêng biệt tùy nhu cầu.

[Xem thêm ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `domNode`: Một [phần tử DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React sẽ tạo một root cho phần tử DOM này và cho phép bạn gọi các hàm trên root, chẳng hạn như `render` để hiển thị nội dung React đã được render.

* **tùy chọn** `options`: Một object chứa các tùy chọn cho React root này.

  * **tùy chọn** `onCaughtError`: Callback được gọi khi React bắt được một lỗi trong Error Boundary. Được gọi với `error` mà Error Boundary bắt được và một object `errorInfo` chứa `componentStack`.
  * **tùy chọn** `onUncaughtError`: Callback được gọi khi một lỗi được throw nhưng không được Error Boundary bắt. Được gọi với `error` đã được throw và một object `errorInfo` chứa `componentStack`.
  * **tùy chọn** `onRecoverableError`: Callback được gọi khi React tự động khôi phục từ các lỗi. Được gọi với `error` mà React throw và một object `errorInfo` chứa `componentStack`. Một số lỗi có thể khôi phục có thể bao gồm nguyên nhân lỗi ban đầu dưới dạng `error.cause`.
  * **tùy chọn** `identifierPrefix`: Một chuỗi tiền tố mà React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều root trên cùng một trang.

#### Giá trị trả về {/*returns*/}

`createRoot` trả về một object có hai phương thức: [`render`](#root-render) và [`unmount`.](#root-unmount)

#### Lưu ý {/*caveats*/}
* Nếu app của bạn được render trên server, không hỗ trợ sử dụng `createRoot()`. Thay vào đó, hãy sử dụng [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot).
* Có lẽ app của bạn sẽ chỉ có một lệnh gọi `createRoot`. Nếu sử dụng framework, framework có thể thực hiện lệnh gọi này thay bạn.
* Khi muốn render một phần JSX ở một phần khác của cây DOM không phải là phần tử con của component (ví dụ: modal hoặc tooltip), hãy sử dụng [`createPortal`](/reference/react-dom/createPortal) thay vì `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Gọi `root.render` để hiển thị một phần [JSX](/learn/writing-markup-with-jsx) (“React node”) vào node DOM của trình duyệt thuộc React root.

```js
root.render(<App />);
```

React sẽ hiển thị `<App />` trong `root` và tiếp quản việc quản lý DOM bên trong nó.

[Xem thêm ví dụ bên dưới.](#usage)

#### Tham số {/*root-render-parameters*/}

* `reactNode`: Một *React node* mà bạn muốn hiển thị. Thông thường đây sẽ là một phần JSX như `<App />`, nhưng bạn cũng có thể truyền một React element được tạo bằng [`createElement()`](/reference/react/createElement), một chuỗi, một số, `null` hoặc `undefined`.


#### Giá trị trả về {/*root-render-returns*/}

`root.render` trả về `undefined`.

#### Lưu ý {/*root-render-caveats*/}

* Lần đầu tiên bạn gọi `root.render`, React sẽ xóa toàn bộ nội dung HTML hiện có bên trong React root trước khi render React component vào đó.

* Nếu node DOM của root chứa HTML được tạo bởi React trên server hoặc trong quá trình build, hãy sử dụng [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) thay vào đó; phương thức này sẽ gắn các event handler vào HTML hiện có.

* Nếu gọi `render` trên cùng một root nhiều hơn một lần, React sẽ cập nhật DOM khi cần để phản ánh JSX mới nhất mà bạn đã truyền vào. React sẽ quyết định phần nào của DOM có thể được tái sử dụng và phần nào cần được tạo lại bằng cách [“đối chiếu”](/learn/preserving-and-resetting-state) với cây đã được render trước đó. Gọi lại `render` trên cùng một root tương tự như gọi hàm [`set` function](/reference/react/useState#setstate) trên root component: React tránh các cập nhật DOM không cần thiết.

* Mặc dù quá trình rendering là đồng bộ khi đã bắt đầu, `root.render(...)` thì không. Điều này có nghĩa là code sau `root.render()` có thể chạy trước khi bất kỳ effect nào (`useLayoutEffect`, `useEffect`) của lần render cụ thể đó được thực thi. Điều này thường không có vấn đề và hiếm khi cần điều chỉnh. Trong những trường hợp hiếm hoi khi thời điểm chạy effect có ý nghĩa, bạn có thể bọc `root.render(...)` trong [`flushSync`](https://react.dev/reference/react-dom/flushSync) để bảo đảm lần render ban đầu chạy hoàn toàn đồng bộ.

  ```js
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
  // 🚩 HTML chưa bao gồm <App /> đã được render:
  console.log(document.body.innerHTML);
  ```

---

### `root.unmount()` {/*root-unmount*/}

Gọi `root.unmount` để hủy một cây đã render bên trong React root.

```js
root.unmount();
```

Một app được xây dựng hoàn toàn bằng React thường sẽ không có bất kỳ lệnh gọi nào đến `root.unmount`.

Điều này chủ yếu hữu ích nếu node DOM của React root (hoặc bất kỳ ancestor nào của nó) có thể bị một đoạn code khác xóa khỏi DOM. Ví dụ, hãy tưởng tượng một tab panel của jQuery xóa các tab không hoạt động khỏi DOM. Nếu một tab bị xóa, mọi thứ bên trong nó (bao gồm cả các React root bên trong) cũng sẽ bị xóa khỏi DOM. Trong trường hợp đó, bạn cần cho React biết để “dừng” quản lý nội dung của root đã bị xóa bằng cách gọi `root.unmount`. Nếu không, các component bên trong root đã bị xóa sẽ không biết cần cleanup và giải phóng các tài nguyên toàn cục như subscription.

Gọi `root.unmount` sẽ unmount tất cả component trong root và “detach” React khỏi node DOM của root, bao gồm việc xóa mọi event handler hoặc state trong cây.


#### Tham số {/*root-unmount-parameters*/}

`root.unmount` không nhận bất kỳ tham số nào.


#### Giá trị trả về {/*root-unmount-returns*/}

`root.unmount` trả về `undefined`.

#### Lưu ý {/*root-unmount-caveats*/}

* Gọi `root.unmount` sẽ unmount tất cả component trong cây và “detach” React khỏi node DOM của root.

* Sau khi gọi `root.unmount`, bạn không thể gọi lại `root.render` trên cùng một root. Việc cố gọi `root.render` trên một root đã unmount sẽ throw lỗi "Cannot update an unmounted root". Tuy nhiên, bạn có thể tạo một root mới cho cùng node DOM sau khi root trước đó của node này đã được unmount.

---

## Cách sử dụng {/*usage*/}

### Render một app được xây dựng hoàn toàn bằng React {/*rendering-an-app-fully-built-with-react*/}

Nếu app của bạn được xây dựng hoàn toàn bằng React, hãy tạo một root duy nhất cho toàn bộ app.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Thông thường, bạn chỉ cần chạy code này một lần khi khởi động. Code sẽ:

1. Tìm <CodeStep step={1}>node DOM của trình duyệt</CodeStep> được định nghĩa trong HTML.
2. Hiển thị <CodeStep step={2}>React component</CodeStep> cho app của bạn bên trong node đó.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Đây là DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

**Nếu app của bạn được xây dựng hoàn toàn bằng React, bạn không cần tạo thêm root nào hoặc gọi lại [`root.render`](#root-render).**

Từ thời điểm này, React sẽ quản lý DOM của toàn bộ app. Để thêm component, [lồng chúng bên trong component `App`.](/learn/importing-and-exporting-components) Khi cần cập nhật UI, mỗi component có thể thực hiện việc này bằng cách [sử dụng state.](/reference/react/useState) Khi cần hiển thị nội dung bổ sung như modal hoặc tooltip bên ngoài node DOM, [hãy render nội dung đó bằng portal.](/reference/react-dom/createPortal)

<Note>

Khi HTML trống, người dùng sẽ thấy một trang trắng cho đến khi code JavaScript của app được tải và chạy:

```html
<div id="root"></div>
```

Điều này có thể khiến ứng dụng cảm thấy rất chậm! Để giải quyết vấn đề này, bạn có thể tạo HTML ban đầu từ các component của mình [trên server hoặc trong quá trình build.](/reference/react-dom/server) Khi đó, khách truy cập có thể đọc văn bản, xem hình ảnh và nhấp vào liên kết trước khi bất kỳ đoạn mã JavaScript nào được tải. Chúng tôi khuyên bạn [sử dụng một framework](/learn/creating-a-react-app#full-stack-frameworks) thực hiện sẵn việc tối ưu hóa này. Tùy thuộc vào thời điểm quá trình này chạy, kỹ thuật này được gọi là *server-side rendering (SSR)* hoặc *static site generation (SSG).*

</Note>

<Pitfall>

**Các app sử dụng server rendering hoặc static generation phải gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) thay vì `createRoot`.** Sau đó, React sẽ *hydrate* (tái sử dụng) các DOM node từ HTML của bạn thay vì hủy và tạo lại chúng.

</Pitfall>

---

### Render một phần trang được xây dựng bằng React {/*rendering-a-page-partially-built-with-react*/}

Nếu trang của bạn [không được xây dựng hoàn toàn bằng React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), bạn có thể gọi `createRoot` nhiều lần để tạo một root cho từng phần UI cấp cao nhất do React quản lý. Bạn có thể hiển thị nội dung khác nhau trong mỗi root bằng cách gọi [`root.render`.](#root-render)

Ở đây, hai component React khác nhau được render vào hai DOM node được định nghĩa trong file `index.html`:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode);
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode);
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

Bạn cũng có thể tạo một DOM node mới bằng [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) rồi thêm thủ công node đó vào document.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode);
root.render(<Comment />);
document.body.appendChild(domNode); // Bạn có thể thêm node này ở bất kỳ đâu trong document
```

Để xóa React tree khỏi DOM node và giải phóng tất cả tài nguyên mà nó sử dụng, hãy gọi [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Điều này chủ yếu hữu ích khi các component React của bạn nằm bên trong một app được viết bằng một framework khác.

---

### Cập nhật root component {/*updating-a-root-component*/}

Bạn có thể gọi `render` nhiều lần trên cùng một root. Miễn là cấu trúc component tree khớp với những gì đã được render trước đó, React sẽ [giữ nguyên state.](/learn/preserving-and-resetting-state) Hãy chú ý rằng bạn có thể nhập vào input, điều này cho thấy các lần cập nhật từ những lệnh gọi `render` lặp lại mỗi giây trong ví dụ này không mang tính hủy bỏ:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

Việc gọi `render` nhiều lần là không phổ biến. Thông thường, các component của bạn sẽ [cập nhật state](/reference/react/useState) thay vào đó.

### Ghi log lỗi trong production {/*error-logging-in-production*/}

Theo mặc định, React sẽ ghi log tất cả lỗi vào console. Để triển khai hệ thống error reporting của riêng mình, bạn có thể cung cấp các root options xử lý lỗi tùy chọn `onUncaughtError`, `onCaughtError` và `onRecoverableError`:

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack", 15]]
import { createRoot } from "react-dom/client";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

Tùy chọn <CodeStep step={1}>onCaughtError</CodeStep> là một function được gọi với hai đối số:

1. <CodeStep step={2}>error</CodeStep> đã được throw.
2. Một object <CodeStep step={3}>errorInfo</CodeStep> chứa <CodeStep step={4}>componentStack</CodeStep> của lỗi.

Kết hợp với `onUncaughtError` và `onRecoverableError`, bạn có thể triển khai hệ thống error reporting của riêng mình:

<Sandpack>

```js src/reportError.js
function reportError({ type, error, errorInfo }) {
  // Việc triển khai cụ thể tùy thuộc vào bạn.
  // `console.error()` chỉ được dùng cho mục đích minh họa.
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error, errorInfo) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error, errorInfo) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error, errorInfo) {
  reportError({ type: "Recoverable", error, errorInfo });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  // Hãy nhớ xóa các tùy chọn này trong môi trường phát triển để tận dụng
  // các trình xử lý mặc định của React hoặc tự triển khai lớp phủ cho môi trường phát triển.
  // Các trình xử lý ở đây chỉ luôn được chỉ định để phục vụ mục đích minh họa.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
root.render(<App />);
```

```js src/App.js
import { Component, useState } from "react";

function Boom() {
  foo.bar = "baz";
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [triggerUncaughtError, settriggerUncaughtError] = useState(false);
  const [triggerCaughtError, setTriggerCaughtError] = useState(false);

  return (
    <>
      <button onClick={() => settriggerUncaughtError(true)}>
        Trigger uncaught error
      </button>
      {triggerUncaughtError && <Boom />}
      <button onClick={() => setTriggerCaughtError(true)}>
        Trigger caught error
      </button>
      {triggerCaughtError && (
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      )}
    </>
  );
}
```

</Sandpack>

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi đã tạo một root nhưng không có gì được hiển thị {/*ive-created-a-root-but-nothing-is-displayed*/}

Hãy đảm bảo bạn không quên thực sự *render* app của mình vào root:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Cho đến khi thực hiện việc đó, sẽ không có gì được hiển thị.

---

### Tôi gặp lỗi: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Một lỗi thường gặp là truyền các options cho `createRoot` vào `root.render(...)`:

<ConsoleBlock level="error">

Cảnh báo: Bạn đã truyền đối số thứ hai cho root.render(...) nhưng hàm này chỉ chấp nhận một đối số.

</ConsoleBlock>

Để sửa lỗi, hãy truyền root options vào `createRoot(...)`, không phải `root.render(...)`:
```js {2,5}
// 🚩 Sai: root.render chỉ nhận một đối số.
root.render(App, {onUncaughtError});

// ✅ Đúng: truyền các tùy chọn vào createRoot.
const root = createRoot(container, {onUncaughtError});
root.render(<App />);
```

---

### Tôi gặp lỗi: "Target container is not a DOM element" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Lỗi này có nghĩa là giá trị bạn truyền vào `createRoot` không phải là một DOM node.

Nếu không chắc chuyện gì đang xảy ra, hãy thử log giá trị đó:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Ví dụ, nếu `domNode` là `null`, điều đó có nghĩa là [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) trả về `null`. Điều này sẽ xảy ra nếu tại thời điểm bạn gọi hàm, trong document không có node nào với ID đã cho. Có thể có một vài nguyên nhân:

1. ID bạn đang tìm có thể khác với ID bạn đã sử dụng trong file HTML. Hãy kiểm tra lỗi chính tả!
2. Thẻ `<script>` trong bundle của bạn không thể "nhìn thấy" bất kỳ DOM node nào xuất hiện *sau* nó trong HTML.

Một cách phổ biến khác gây ra lỗi này là viết `createRoot(<App />)` thay vì `createRoot(domNode)`.

---

### Tôi gặp lỗi: "Functions are not valid as a React child." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Lỗi này có nghĩa là giá trị bạn truyền vào `root.render` không phải là một React component.

Điều này có thể xảy ra nếu bạn gọi `root.render` với `Component` thay vì `<Component />`:

```js {2,5}
// 🚩 Sai: App là một function, không phải Component.
root.render(App);

// ✅ Đúng: <App /> là một component.
root.render(<App />);
```

Hoặc nếu bạn truyền một function vào `root.render`, thay vì kết quả của việc gọi function đó:

```js {2,5}
// 🚩 Sai: createApp là một function, không phải component.
root.render(createApp);

// ✅ Đúng: gọi createApp để trả về một component.
root.render(createApp());
```

---

### HTML được render trên server của tôi bị tạo lại từ đầu {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Nếu app của bạn được render trên server và bao gồm HTML ban đầu do React tạo ra, bạn có thể nhận thấy rằng việc tạo một root và gọi `root.render` sẽ xóa toàn bộ HTML đó, sau đó tạo lại tất cả DOM node từ đầu. Điều này có thể chậm hơn, reset focus và vị trí cuộn, đồng thời có thể làm mất dữ liệu người dùng đã nhập.

Các app được render trên server phải sử dụng [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) thay vì `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Lưu ý rằng API của nó khác biệt. Cụ thể, thông thường sẽ không có thêm lệnh gọi `root.render` nào nữa.
