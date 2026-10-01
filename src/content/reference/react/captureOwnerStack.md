---
title: captureOwnerStack
---

<Intro>

`captureOwnerStack` đọc Owner Stack hiện tại trong development và trả về dưới dạng chuỗi nếu có.

```js
const stack = captureOwnerStack();
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

Gọi `captureOwnerStack` để lấy Owner Stack hiện tại.

```js {5,5}
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### Tham số {/*parameters*/}

`captureOwnerStack` không nhận tham số nào.

#### Giá trị trả về {/*returns*/}

`captureOwnerStack` trả về `string | null`.

Owner Stack khả dụng trong:
- Quá trình render Component
- Effects (ví dụ: `useEffect`)
- Event handler của React (ví dụ: `<button onClick={...} />`)
- Error handler của React ([các tùy chọn React Root](/reference/react-dom/client/createRoot#parameters) `onCaughtError`, `onRecoverableError` và `onUncaughtError`)

Nếu không có Owner Stack, `null` sẽ được trả về (xem [Khắc phục sự cố: Owner Stack `null`](#the-owner-stack-is-null)).

#### Lưu ý {/*caveats*/}

- Owner Stack chỉ khả dụng trong development. `captureOwnerStack` sẽ luôn trả về `null` bên ngoài development.

<DeepDive>

#### Owner Stack và Component Stack {/*owner-stack-vs-component-stack*/}

Owner Stack khác với Component Stack, vốn khả dụng trong các error handler của React như [`errorInfo.componentStack` trong `onUncaughtError`](/reference/react-dom/client/hydrateRoot#error-logging-in-production).

Ví dụ, hãy xét đoạn code sau:

<Sandpack>

```js src/App.js
import {Suspense} from 'react';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}

function Navigation() {
  return null;
}

export default function App({children}) {
  return (
    <Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App, {Component} from './App.js';
import './styles.css';

createRoot(document.createElement('div'), {
  onUncaughtError: (error, errorInfo) => {
    // Các stack được log thay vì hiển thị trực tiếp trong UI để
    // nhấn mạnh rằng trình duyệt sẽ áp dụng sourcemap cho stack đã log.
    // Lưu ý rằng sourcemap chỉ được áp dụng trong console thật của trình duyệt,
    // không phải console giả hiển thị trên trang này.
    // Nhấn "fork" để xem stack đã sourcemap trong console thật.
    console.log(errorInfo.componentStack);
    console.log(captureOwnerStack());
  },
}).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Check the console output.</p>
  </body>
</html>
```

</Sandpack>

`SubComponent` sẽ throw một error.
Component Stack của error đó sẽ là

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

Tuy nhiên, Owner Stack sẽ chỉ đọc

```
at Component
```

Cả `App` lẫn các DOM component (ví dụ: `fieldset`) đều không được xem là Owner trong Stack này vì chúng không góp phần “tạo” node chứa `SubComponent`. `App` và các DOM component chỉ chuyển tiếp node. `App` chỉ render node `children`, thay vì `Component`, vốn tạo một node chứa `SubComponent` thông qua `<SubComponent />`.

Cả `Navigation` lẫn `legend` đều không xuất hiện trong stack vì chúng chỉ là sibling của một node chứa `<SubComponent />`.

`SubComponent` được lược bỏ vì nó đã nằm trong call stack.

</DeepDive>

## Cách sử dụng {/*usage*/}

### Cải thiện custom error overlay {/*enhance-a-custom-error-overlay*/}

```js [[1, 5, "console.error"], [4, 7, "captureOwnerStack"]]
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Lưu ý rằng trong ứng dụng thực tế, console.error có thể được
    // gọi với nhiều đối số mà bạn cần xử lý.
    consoleMessage: args[0],
    ownerStack,
  });
};
```

Nếu bạn intercept các lệnh gọi <CodeStep step={1}>`console.error`</CodeStep> để highlight chúng trong error overlay, bạn có thể gọi <CodeStep step={2}>`captureOwnerStack`</CodeStep> để thêm Owner Stack.

<Sandpack>

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;
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
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red">Error</h1>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h2 class="-mb-20">Owner Stack:</h4>
  <pre id="error-owner-stack" class="nowrap"></pre>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
</div>
<!-- Đây là DOM node -->
<div id="root"></div>
</body>
</html>

```

```js src/errorOverlay.js

export function onConsoleError({ consoleMessage, ownerStack }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorBody = document.getElementById("error-body");
  const errorOwnerStack = document.getElementById("error-owner-stack");

  // Hiển thị thông báo console.error()
  errorBody.innerText = consoleMessage;

  // Hiển thị owner stack
  errorOwnerStack.innerText = ownerStack;

  // Hiển thị hộp thoại
  errorDialog.classList.remove("hidden");
}
```

```js src/index.js active
import { captureOwnerStack } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { onConsoleError } from "./errorOverlay";
import './styles.css';

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Lưu ý rằng trong ứng dụng thực tế, console.error có thể được
    // gọi với nhiều đối số mà bạn cần xử lý.
    consoleMessage: args[0],
    ownerStack,
  });
};

const container = document.getElementById("root");
createRoot(container).render(<App />);
```

```js src/App.js
function Component() {
  return <button onClick={() => console.error('Some console error')}>Trigger console.error()</button>;
}

export default function App() {
  return <Component />;
}
```

</Sandpack>

## Khắc phục sự cố {/*troubleshooting*/}

### Owner Stack `null` {/*the-owner-stack-is-null*/}

Lệnh gọi `captureOwnerStack` đã diễn ra bên ngoài một function do React kiểm soát, chẳng hạn như trong callback của `setTimeout`, sau một lệnh gọi `fetch` hoặc trong custom DOM event handler. Trong quá trình render, Effects, event handler của React và error handler của React (ví dụ: `hydrateRoot#options.onCaughtError`), Owner Stack sẽ khả dụng.

Trong ví dụ bên dưới, việc nhấp vào button sẽ log một Owner Stack trống vì `captureOwnerStack` được gọi trong một custom DOM event handler. Owner Stack phải được capture sớm hơn, chẳng hạn bằng cách chuyển lệnh gọi `captureOwnerStack` vào bên trong Effect.

<Sandpack>

```js
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Nên gọi `captureOwnerStack` ở đây.
    function handleEvent() {
      // Gọi nó trong event handler DOM tùy chỉnh là quá muộn.
      // Owner Stack sẽ là `null` ở thời điểm này.
      console.log('Owner Stack: ', captureOwnerStack());
    }

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Click me to see that Owner Stacks are not available in custom DOM event handlers</button>;
}
```

</Sandpack>

### `captureOwnerStack` không khả dụng {/*captureownerstack-is-not-available*/}

`captureOwnerStack` chỉ được export trong các build development. Nó sẽ `undefined` trong các build production. Nếu `captureOwnerStack` được sử dụng trong các file được bundle cho cả production và development, bạn nên truy cập nó có điều kiện từ một namespace import.

```js
// Không dùng named import của `captureOwnerStack` trong các tệp được bundle cho development và production.
import {captureOwnerStack} from 'react';
// Thay vào đó, dùng namespace import và truy cập `captureOwnerStack` có điều kiện.
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
  console.log('Owner Stack', ownerStack);
}
```
