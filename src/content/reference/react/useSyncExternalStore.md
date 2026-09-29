---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` là một React Hook cho phép bạn subscribe vào một external store.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Gọi `useSyncExternalStore` ở cấp cao nhất của component để đọc một giá trị từ external data store.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Nó trả về snapshot của dữ liệu trong store. Bạn cần truyền hai hàm làm đối số:

1. Hàm `subscribe` phải subscribe vào store và trả về một hàm để unsubscribe.
2. Hàm `getSnapshot` phải đọc một snapshot của dữ liệu từ store.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `subscribe`: Một hàm nhận một đối số `callback` duy nhất và subscribe đối số đó vào store. Khi store thay đổi, hàm này phải gọi `callback` đã được cung cấp, khiến React gọi lại `getSnapshot` và (nếu cần) re-render component. Hàm `subscribe` phải trả về một hàm dọn dẹp subscription.

* `getSnapshot`: Một hàm trả về snapshot của dữ liệu trong store mà component cần. Khi store chưa thay đổi, các lần gọi `getSnapshot` lặp lại phải trả về cùng một giá trị. Nếu store thay đổi và giá trị được trả về khác đi (được so sánh bằng [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), React sẽ re-render component.

* **tùy chọn** `getServerSnapshot`: Một hàm trả về snapshot ban đầu của dữ liệu trong store. Hàm này chỉ được sử dụng trong quá trình server rendering và hydration của nội dung được server render trên client. Server snapshot phải giống nhau giữa client và server, và thường được serialize rồi truyền từ server đến client. Nếu bạn bỏ qua đối số này, việc render component trên server sẽ gây ra lỗi.

#### Giá trị trả về {/*returns*/}

Snapshot hiện tại của store mà bạn có thể sử dụng trong logic rendering.

#### Lưu ý {/*caveats*/}

* Store snapshot được `getSnapshot` trả về phải immutable. Nếu store underlying có dữ liệu mutable, hãy trả về một snapshot immutable mới nếu dữ liệu đã thay đổi. Nếu không, hãy trả về snapshot cuối cùng đã được cache.

* Nếu một hàm `subscribe` khác được truyền vào trong quá trình re-render, React sẽ subscribe lại vào store bằng hàm `subscribe` mới được truyền vào. Bạn có thể ngăn điều này bằng cách khai báo `subscribe` bên ngoài component.

* Nếu store bị mutate trong một [non-blocking Transition update](/reference/react/useTransition), React sẽ chuyển sang thực hiện update đó theo cách blocking. Cụ thể, đối với mỗi Transition update, React sẽ gọi `getSnapshot` lần thứ hai ngay trước khi áp dụng các thay đổi vào DOM. Nếu hàm này trả về giá trị khác với lần được gọi ban đầu, React sẽ khởi động lại update từ đầu, lần này áp dụng dưới dạng blocking update, để đảm bảo mọi component trên màn hình đều phản ánh cùng một phiên bản của store.

* Không nên _suspend_ một lần render dựa trên giá trị store được `useSyncExternalStore` trả về. Lý do là các mutation đối với external store không thể được đánh dấu là [non-blocking Transition updates](/reference/react/useTransition), nên chúng sẽ kích hoạt [`Suspense` fallback](/reference/react/Suspense) gần nhất, thay thế nội dung đã render trên màn hình bằng một loading spinner, thường dẫn đến UX kém.

  Ví dụ, bạn không nên sử dụng những cách sau:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Calling `use` with a Promise dependent on `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Conditionally rendering a lazy component based on `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## Cách sử dụng {/*usage*/}

### Subscribe vào external store {/*subscribing-to-an-external-store*/}

Hầu hết các React component của bạn sẽ chỉ đọc dữ liệu từ [props,](/learn/passing-props-to-a-component) [state,](/reference/react/useState) và [context.](/reference/react/useContext) Tuy nhiên, đôi khi một component cần đọc một số dữ liệu từ một store bên ngoài React và thay đổi theo thời gian. Những trường hợp này bao gồm:

* Các thư viện quản lý state bên thứ ba lưu state bên ngoài React.
* Các Browser API cung cấp một giá trị mutable và các event để subscribe vào những thay đổi của giá trị đó.

Gọi `useSyncExternalStore` ở cấp cao nhất của component để đọc một giá trị từ external data store.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Nó trả về <CodeStep step={3}>snapshot</CodeStep> của dữ liệu trong store. Bạn cần truyền hai hàm làm đối số:

1. Hàm <CodeStep step={1}>`subscribe` function</CodeStep> phải subscribe vào store và trả về một hàm để unsubscribe.
2. Hàm <CodeStep step={2}>`getSnapshot` function</CodeStep> phải đọc một snapshot của dữ liệu từ store.

React sẽ sử dụng các hàm này để giữ cho component của bạn subscribe vào store và re-render khi có thay đổi.

Ví dụ, trong sandbox bên dưới, `todosStore` được triển khai dưới dạng một external store lưu trữ dữ liệu bên ngoài React. Component `TodosApp` kết nối với external store đó bằng `useSyncExternalStore` Hook.

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

Khi có thể, chúng tôi khuyến nghị sử dụng state tích hợp sẵn của React với [`useState`](/reference/react/useState) và [`useReducer`](/reference/react/useReducer) thay vào đó. API `useSyncExternalStore` chủ yếu hữu ích khi bạn cần tích hợp với code hiện có không sử dụng React.

</Note>

---

### Subscribe vào Browser API {/*subscribing-to-a-browser-api*/}

Một lý do khác để thêm `useSyncExternalStore` là khi bạn muốn subscribe vào một giá trị do browser cung cấp và thay đổi theo thời gian. Ví dụ, giả sử bạn muốn component hiển thị liệu kết nối mạng có đang hoạt động hay không. Browser cung cấp thông tin này thông qua một property có tên là [`navigator.onLine`.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

Giá trị này có thể thay đổi mà React không biết, vì vậy bạn nên đọc nó bằng `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Để triển khai hàm `getSnapshot`, hãy đọc giá trị hiện tại từ Browser API:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

Tiếp theo, bạn cần triển khai hàm `subscribe`. Ví dụ, khi `navigator.onLine` thay đổi, browser sẽ phát sinh các event [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) và [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) trên object `window`. Bạn cần subscribe đối số `callback` vào các event tương ứng, sau đó trả về một hàm dọn dẹp các subscription:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

Giờ đây React đã biết cách đọc giá trị từ `navigator.onLine` API bên ngoài và cách subscribe vào những thay đổi của giá trị đó. Hãy ngắt kết nối thiết bị của bạn khỏi mạng và quan sát component re-render để phản hồi:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Tách logic thành custom Hook {/*extracting-the-logic-to-a-custom-hook*/}

Thông thường, bạn sẽ không viết `useSyncExternalStore` trực tiếp trong các component. Thay vào đó, bạn thường sẽ gọi nó từ custom Hook của riêng mình. Điều này cho phép bạn sử dụng cùng một external store từ nhiều component khác nhau.

Ví dụ, custom `useOnlineStatus` Hook này theo dõi xem mạng có đang online hay không:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

Giờ đây, các component khác nhau có thể gọi `useOnlineStatus` mà không cần lặp lại phần triển khai underlying:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Thêm hỗ trợ cho server rendering {/*adding-support-for-server-rendering*/}

Nếu ứng dụng React của bạn sử dụng [server rendering,](/reference/react-dom/server) các React component của bạn cũng sẽ chạy bên ngoài môi trường browser để tạo HTML ban đầu. Điều này tạo ra một số thách thức khi kết nối với external store:

- Nếu bạn đang kết nối với API chỉ hoạt động trên browser, API đó sẽ không hoạt động vì nó không tồn tại trên server.
- Nếu bạn đang kết nối với một data store bên thứ ba, bạn sẽ cần dữ liệu của store khớp nhau giữa server và client.

Để giải quyết những vấn đề này, hãy truyền một hàm `getServerSnapshot` làm đối số thứ ba cho `useSyncExternalStore`:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

Hàm `getServerSnapshot` tương tự như `getSnapshot`, nhưng chỉ chạy trong hai tình huống:

- Hàm chạy trên server khi tạo HTML.
- Hàm chạy trên client trong quá trình [hydration](/reference/react-dom/client/hydrateRoot), tức là khi React lấy HTML từ server và làm cho HTML đó trở nên interactive.

Điều này cho phép bạn cung cấp giá trị snapshot ban đầu sẽ được sử dụng trước khi ứng dụng trở nên tương tác. Nếu không có giá trị ban đầu có ý nghĩa cho việc server rendering, hãy bỏ qua đối số này để [buộc rendering trên client.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

<Note>

Hãy đảm bảo rằng `getServerSnapshot` trả về chính xác cùng một dữ liệu trong lần client render ban đầu như dữ liệu đã trả về trên server. Ví dụ: nếu `getServerSnapshot` trả về một phần nội dung store đã được điền sẵn trên server, bạn cần truyền phần nội dung này sang client. Một cách để thực hiện việc này là xuất một thẻ `<script>` trong quá trình server rendering, thẻ này thiết lập một biến global như `window.MY_STORE_DATA`, sau đó đọc biến global đó trên client trong `getServerSnapshot`. External store của bạn nên cung cấp hướng dẫn về cách thực hiện việc này.

</Note>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi gặp lỗi: "Kết quả của `getSnapshot` phải được cache" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

Lỗi này có nghĩa là hàm `getSnapshot` của bạn trả về một object mới mỗi lần được gọi, ví dụ:

```js {2-5}
function getSnapshot() {
  // 🔴 Do not return always different objects from getSnapshot
  return {
    todos: myStore.todos
  };
}
```

React sẽ render lại component nếu giá trị trả về của `getSnapshot` khác với lần trước. Vì vậy, nếu bạn luôn trả về một giá trị khác, bạn sẽ rơi vào vòng lặp vô hạn và gặp lỗi này.

Object `getSnapshot` của bạn chỉ nên trả về một object khác nếu thực sự có thay đổi. Nếu store của bạn chứa dữ liệu immutable, bạn có thể trả về trực tiếp dữ liệu đó:

```js {2-3}
function getSnapshot() {
  // ✅ You can return immutable data
  return myStore.todos;
}
```

Nếu dữ liệu trong store của bạn mutable, hàm `getSnapshot` nên trả về một snapshot immutable của dữ liệu đó. Điều này có nghĩa là hàm *cần* tạo các object mới, nhưng không nên làm vậy trong mọi lần gọi. Thay vào đó, hàm nên lưu snapshot được tính toán gần nhất và trả về chính snapshot đó như lần trước nếu dữ liệu trong store không thay đổi. Cách xác định dữ liệu mutable đã thay đổi hay chưa phụ thuộc vào mutable store của bạn.

---

### Hàm `subscribe` của tôi được gọi sau mỗi lần render lại {/*my-subscribe-function-gets-called-after-every-re-render*/}

Hàm `subscribe` này được định nghĩa *bên trong* một component, nên nó khác nhau sau mỗi lần render lại:

```js {2-5}
function ChatIndicator() {
  // 🚩 Always a different function, so React will resubscribe on every re-render
  function subscribe() {
    // ...
  }

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```

React sẽ đăng ký lại với store nếu bạn truyền một hàm `subscribe` khác giữa các lần render lại. Nếu điều này gây ra vấn đề về hiệu năng và bạn muốn tránh việc đăng ký lại, hãy di chuyển hàm `subscribe` ra bên ngoài:

```js {1-4}
// ✅ Always the same function, so React won't need to resubscribe
function subscribe() {
  // ...
}

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Ngoài ra, hãy bọc `subscribe` trong [`useCallback`](/reference/react/useCallback) để chỉ đăng ký lại khi một đối số nào đó thay đổi:

```js {2-5}
function ChatIndicator({ userId }) {
  // ✅ Same function as long as userId doesn't change
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```