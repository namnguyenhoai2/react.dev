---
title: hydrateRoot
---

<Intro>

`hydrateRoot` cho phép bạn hiển thị các React component bên trong một browser DOM node có nội dung HTML trước đó đã được tạo bởi [`react-dom/server`.](/reference/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

Gọi `hydrateRoot` để “gắn” React vào HTML hiện có, vốn đã được React render trong môi trường server.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React sẽ gắn vào HTML bên trong `domNode` và tiếp quản việc quản lý DOM bên trong đó. Một ứng dụng được xây dựng hoàn toàn bằng React thường chỉ có một lần gọi `hydrateRoot` với root component của nó.

[Xem thêm ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `domNode`: Một [DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element) được render làm root element trên server.

* `reactNode`: “React node” được dùng để render HTML hiện có. Thông thường đây sẽ là một đoạn JSX như `<App />` được render bằng một method `ReactDOM Server` chẳng hạn như `renderToPipeableStream(<App />)`.

* **tùy chọn** `options`: Một object chứa các option cho React root này.

  * **tùy chọn** `onCaughtError`: Callback được gọi khi React bắt được một error trong Error Boundary. Được gọi với `error` bị Error Boundary bắt và một object `errorInfo` chứa `componentStack`.
  * **tùy chọn** `onUncaughtError`: Callback được gọi khi một error được throw nhưng không bị Error Boundary bắt. Được gọi với `error` đã được throw và một object `errorInfo` chứa `componentStack`.
  * **tùy chọn** `onRecoverableError`: Callback được gọi khi React tự động khôi phục từ các error. Được gọi với `error` mà React throw và một object `errorInfo` chứa `componentStack`. Một số recoverable error có thể bao gồm nguyên nhân error ban đầu dưới dạng `error.cause`.
  * **tùy chọn** `identifierPrefix`: Một string prefix được React sử dụng cho các ID được tạo bởi [`useId`.](/reference/react/useId) Hữu ích để tránh xung đột khi sử dụng nhiều root trên cùng một trang. Phải là prefix giống với prefix được sử dụng trên server.
  * **tùy chọn** `formState`: Form state từ một lần submit form được xử lý bởi một [Server Function](/reference/rsc/server-functions). Nếu trang được render trên server để phản hồi việc submit một form sử dụng [`useActionState`](/reference/react/useActionState) với một `permalink`, hãy truyền form state thu được để `useActionState` trả về state đã submit thay vì `initialState`. Phải là cùng giá trị với `formState` được truyền cho [server renderer.](/reference/react-dom/server/renderToPipeableStream#parameters) Thông thường framework của bạn sẽ truyền giá trị này qua.


#### Kết quả trả về {/*returns*/}

`hydrateRoot` trả về một object có hai method: [`render`](#root-render) và [`unmount`.](#root-unmount)

#### Lưu ý {/*caveats*/}

* `hydrateRoot()` yêu cầu nội dung đã render phải giống hệt nội dung được render trên server. Bạn nên xem các khác biệt là bug và sửa chúng.
* Trong development mode, React cảnh báo về các khác biệt trong quá trình hydration. Không có đảm bảo rằng các khác biệt về attribute sẽ được patch trong trường hợp có khác biệt. Điều này quan trọng vì lý do hiệu năng: trong hầu hết ứng dụng, các khác biệt rất hiếm xảy ra, nên việc xác thực toàn bộ markup sẽ tốn chi phí quá lớn.
* Có thể ứng dụng của bạn sẽ chỉ có một lần gọi `hydrateRoot`. Nếu sử dụng framework, framework có thể thực hiện lần gọi này thay bạn.
* Nếu ứng dụng của bạn được render ở client và chưa có HTML nào được render, việc sử dụng `hydrateRoot()` không được hỗ trợ. Thay vào đó, hãy sử dụng [`createRoot()`](/reference/react-dom/client/createRoot).

---

### `root.render(reactNode)` {/*root-render*/}

Gọi `root.render` để cập nhật một React component bên trong một React root đã được hydrate cho một browser DOM element.

```js
root.render(<App />);
```

React sẽ cập nhật `<App />` trong `root` đã được hydrate.

[Xem thêm ví dụ bên dưới.](#usage)

#### Tham số {/*root-render-parameters*/}

* `reactNode`: Một “React node” mà bạn muốn cập nhật. Thông thường đây sẽ là một đoạn JSX như `<App />`, nhưng bạn cũng có thể truyền một React element được tạo bằng [`createElement()`](/reference/react/createElement), một string, một number, `null`, hoặc `undefined`.


#### Kết quả trả về {/*root-render-returns*/}

`root.render` trả về `undefined`.

#### Lưu ý {/*root-render-caveats*/}

* Nếu gọi `root.render` trước khi root hoàn tất hydration, React sẽ xóa nội dung HTML hiện có được render trên server và chuyển toàn bộ root sang client rendering.

---

### `root.unmount()` {/*root-unmount*/}

Gọi `root.unmount` để hủy một rendered tree bên trong một React root.

```js
root.unmount();
```

Một ứng dụng được xây dựng hoàn toàn bằng React thường sẽ không có bất kỳ lần gọi nào đến `root.unmount`.

Điều này chủ yếu hữu ích nếu DOM node của React root (hoặc bất kỳ ancestor nào của nó) có thể bị code khác xóa khỏi DOM. Ví dụ, hãy hình dung một tab panel của jQuery xóa các tab không hoạt động khỏi DOM. Nếu một tab bị xóa, mọi thứ bên trong nó (bao gồm các React root bên trong) cũng sẽ bị xóa khỏi DOM. Bạn cần cho React biết để “dừng” quản lý nội dung của root đã bị xóa bằng cách gọi `root.unmount`. Nếu không, các component bên trong root đã bị xóa sẽ không cleanup và giải phóng các resource như subscription.

Việc gọi `root.unmount` sẽ unmount tất cả component trong root và “detatch” React khỏi root DOM node, bao gồm việc xóa mọi event handler hoặc state trong tree.


#### Tham số {/*root-unmount-parameters*/}

`root.unmount` không nhận bất kỳ tham số nào.


#### Kết quả trả về {/*root-unmount-returns*/}

`root.unmount` trả về `undefined`.

#### Lưu ý {/*root-unmount-caveats*/}

* Việc gọi `root.unmount` sẽ unmount tất cả component trong tree và “detach” React khỏi root DOM node.

* Sau khi gọi `root.unmount`, bạn không thể gọi lại `root.render` trên root. Việc cố gọi `root.render` trên một root đã unmount sẽ throw error “Cannot update an unmounted root”.

---

## Cách sử dụng {/*usage*/}

### Hydrate HTML được render trên server {/*hydrating-server-rendered-html*/}

Nếu HTML của ứng dụng được tạo bởi [`react-dom/server`](/reference/react-dom/client/createRoot), bạn cần *hydrate* nó trên client.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

Lệnh này sẽ hydrate HTML từ server bên trong <CodeStep step={1}>browser DOM node</CodeStep> bằng <CodeStep step={2}>React component</CodeStep> cho ứng dụng của bạn. Thông thường, bạn sẽ thực hiện việc này một lần khi khởi động. Nếu sử dụng framework, framework có thể thực hiện việc này ngầm cho bạn.

Để hydrate ứng dụng, React sẽ “gắn” logic của các component vào HTML ban đầu được tạo từ server. Hydration biến snapshot HTML ban đầu từ server thành một ứng dụng có đầy đủ tính tương tác và chạy trong browser.

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
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

Bạn không cần gọi lại `hydrateRoot` hoặc gọi nó ở nhiều nơi khác. Từ thời điểm này, React sẽ quản lý DOM của ứng dụng. Để cập nhật UI, thay vào đó các component của bạn sẽ [sử dụng state](/reference/react/useState).

<Pitfall>

React tree mà bạn truyền vào `hydrateRoot` cần tạo ra **cùng một output** như trên server.

Điều này quan trọng đối với trải nghiệm người dùng. Người dùng sẽ dành một khoảng thời gian xem HTML được tạo từ server trước khi code JavaScript của bạn được tải. Server rendering tạo ra ảo giác rằng ứng dụng tải nhanh hơn bằng cách hiển thị snapshot HTML của output. Việc đột ngột hiển thị nội dung khác sẽ phá vỡ ảo giác đó. Đây là lý do output render trên server phải khớp với output render ban đầu trên client.

Các nguyên nhân phổ biến nhất dẫn đến hydration error gồm:

* Khoảng trắng thừa (chẳng hạn như newline) xung quanh HTML do React tạo bên trong root node.
* Sử dụng các kiểm tra như `typeof window !== 'undefined'` trong logic rendering.
* Sử dụng các API chỉ có trong browser như [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) trong logic rendering.
* Render dữ liệu khác nhau trên server và client.

React khôi phục được từ một số hydration error, nhưng **bạn phải sửa chúng như các bug khác.** Trong trường hợp tốt nhất, chúng sẽ khiến ứng dụng chậm hơn; trong trường hợp xấu nhất, event handler có thể bị gắn nhầm vào các element.

</Pitfall>

---

### Hydrate toàn bộ document {/*hydrating-an-entire-document*/}

Các ứng dụng được xây dựng hoàn toàn bằng React có thể render toàn bộ document dưới dạng JSX, bao gồm thẻ [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html):

```js {3,13}
function App() {
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

Để hydrate toàn bộ document, hãy truyền global [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) làm đối số đầu tiên cho `hydrateRoot`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### Bỏ qua các lỗi hydration mismatch không thể tránh khỏi {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Nếu attribute hoặc nội dung văn bản của một element chắc chắn khác nhau giữa server và client (ví dụ: timestamp), bạn có thể tắt cảnh báo hydration mismatch.

Để tắt cảnh báo hydration trên một element, hãy thêm `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Cách này chỉ hoạt động ở một cấp và được dùng như một lối thoát. Đừng lạm dụng nó. React **sẽ không** cố gắng sửa nội dung văn bản không khớp.

---

{/* TODO: Remove this subsection when browser is available in Stable. */}

### Xử lý nội dung khác nhau giữa client và server {/*handling-different-client-and-server-content*/}

Nếu bạn cố ý cần render nội dung khác nhau trên server và client, bạn có thể thực hiện rendering hai lượt. Các component render nội dung khác nhau trên client có thể đọc một [state variable](/reference/react/useState) như `isClient`, và đặt giá trị của nó thành `true` trong một [Effect](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

{/* kind of an edge case, seems fine to use this hack here */}
```js {expectedErrors: {'react-compiler': [7]}} src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

Theo cách này, lượt render ban đầu sẽ render cùng nội dung như server, tránh mismatch, nhưng một lượt render bổ sung sẽ diễn ra đồng bộ ngay sau khi hydration hoàn tất.

Hãy sử dụng cách tiếp cận này khi bạn muốn nội dung được render trên client khác với HTML được server render ban đầu.

Nếu một component chỉ nên render trong browser, hãy gọi [`use(browser())`](/reference/react/use#use-browser) thay vì chờ một Effect.

<Pitfall>

Cách tiếp cận này khiến hydration chậm hơn vì các component của bạn phải render hai lần. Hãy lưu ý đến trải nghiệm người dùng trên các kết nối chậm. Mã JavaScript có thể tải muộn hơn đáng kể so với thời điểm HTML ban đầu được render, vì vậy việc render một UI khác ngay sau khi hydration hoàn tất cũng có thể khiến người dùng cảm thấy khó chịu.

</Pitfall>

---

### Cập nhật root component đã được hydrate {/*updating-a-hydrated-root-component*/}

Sau khi root hoàn tất hydration, bạn có thể gọi [`root.render`](#root-render) để cập nhật root React component. **Không giống như [`createRoot`](/reference/react-dom/client/createRoot), bạn thường không cần làm vậy vì nội dung ban đầu đã được render dưới dạng HTML.**

Nếu bạn gọi `root.render` tại một thời điểm nào đó sau khi hydration hoàn tất và cấu trúc cây component khớp với nội dung đã được render trước đó, React sẽ [preserve the state.](/learn/preserving-and-resetting-state) Hãy chú ý rằng bạn có thể nhập vào input, nghĩa là các lần cập nhật từ những lời gọi `render` lặp lại mỗi giây trong ví dụ này không làm mất dữ liệu:

<Sandpack>

```html public/index.html
<!--
  All HTML content inside <div id="root">...</div> was
  generated by rendering <App /> with react-dom/server.
-->
<div id="root"><h1>Hello, world! <!-- -->0</h1><input placeholder="Type something here"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

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

Việc gọi [`root.render`](#root-render) trên một root đã được hydrate là không phổ biến. Thông thường, bạn sẽ [update state](/reference/react/useState) bên trong một trong các component.

### Ghi log lỗi trong production {/*error-logging-in-production*/}

Theo mặc định, React sẽ ghi tất cả lỗi vào console. Để triển khai hệ thống error reporting của riêng mình, bạn có thể cung cấp các root options xử lý lỗi tùy chọn `onUncaughtError`, `onCaughtError` và `onRecoverableError`:

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack", 15]]
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
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
  // Implementation cụ thể tùy thuộc vào bạn.
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
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
hydrateRoot(container, <App />, {
  // Hãy nhớ xóa các option này trong môi trường development để tận dụng
  // các handler mặc định của React hoặc tự triển khai overlay cho development.
  // Các handler ở đây chỉ luôn được chỉ định để phục vụ mục đích minh họa.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
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

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Purposefully using HTML content that differs from the server-rendered content to trigger recoverable errors.
-->
<div id="root">Server content before hydration.</div>
</body>
</html>
```
</Sandpack>

## Khắc phục sự cố {/*troubleshooting*/}


### Tôi gặp lỗi: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Một lỗi thường gặp là truyền các options cho `hydrateRoot` vào `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

Để khắc phục, hãy truyền root options vào `hydrateRoot(...)`, không phải `root.render(...)`:
```js {2,5}
// 🚩 Sai: root.render chỉ nhận một đối số.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
