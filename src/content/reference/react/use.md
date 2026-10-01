---
title: use
---

<Intro>

`use` là một React API cho phép bạn đọc một resource trong quá trình rendering, chẳng hạn như một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) hoặc [context](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `use(context)` {/*use-context*/}

Gọi `use` với một [context](/learn/passing-data-deeply-with-context) để đọc giá trị của nó. Không giống như [`useContext`](/reference/react/useContext), `use` có thể được gọi bên trong các vòng lặp và câu lệnh điều kiện như `if`.

```js
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

[Xem thêm ví dụ bên dưới.](#usage-context)

#### Tham số {/*context-parameters*/}

* `context`: Một [context](/learn/passing-data-deeply-with-context) được tạo bằng [`createContext`](/reference/react/createContext).

#### Giá trị trả về {/*context-returns*/}

Giá trị context của context được truyền vào, được xác định bởi context provider gần nhất phía trên component đang gọi. Nếu không có provider, giá trị trả về là `defaultValue` được truyền vào [`createContext`](/reference/react/createContext).

#### Lưu ý {/*context-caveats*/}

* `use` phải được gọi bên trong một Component hoặc một Hook.
* Việc đọc context bằng `use` không được hỗ trợ trong [Server Components](/reference/rsc/server-components).

---

### `use(promise)` {/*use-promise*/}

Gọi `use` với một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) để đọc giá trị đã được resolve của nó. Component gọi `use` sẽ *tạm dừng* trong khi Promise đang chờ xử lý. Mặc dù tên gọi như vậy, `use` không phải là một Hook. Không giống như Hook, nó có thể được gọi bên trong các vòng lặp và câu lệnh điều kiện như `if`.

```js
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  // ...
```

Nếu component gọi `use` được bọc trong một boundary [Suspense](/reference/react/Suspense), fallback sẽ được hiển thị trong khi Promise đang chờ xử lý. Khi Promise được resolve, fallback của Suspense sẽ được thay thế bằng các component đã render, sử dụng dữ liệu do `use` trả về. Nếu Promise bị reject, fallback của [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) gần nhất sẽ được hiển thị.

[Xem thêm ví dụ bên dưới.](#usage-promises)

#### Tham số {/*promise-parameters*/}

* `promise`: Một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) có giá trị đã được resolve mà bạn muốn đọc. Promise phải được [cached](#caching-promises-for-client-components) để cùng một instance được sử dụng lại qua các lần re-render.

#### Giá trị trả về {/*promise-returns*/}

Giá trị đã được resolve của Promise.

#### Lưu ý {/*promise-caveats*/}

* `use` phải được gọi bên trong một Component hoặc một Hook.
* `use` không thể được gọi bên trong khối try-catch. Thay vào đó, hãy bọc component của bạn trong một [Error Boundary](#displaying-an-error-with-an-error-boundary) để bắt lỗi và hiển thị fallback.
* Các Promise được truyền vào `use` phải được cached để cùng một instance Promise được sử dụng lại qua các lần re-render. [Xem Caching Promises bên dưới.](#caching-promises-for-client-components)
* Khi truyền một Promise từ Server Component sang Client Component, giá trị đã được resolve của nó phải [serializable](/reference/rsc/use-client#serializable-types).

---

### `use(browser())` {/*use-browser*/}

Gọi `use` với giá trị do [`browser`](/reference/react-dom/browser) trả về trong một component chỉ nên được render trên browser:

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('This component requires browser APIs.'));
  return <BrowserContent />;
}
```

Trong quá trình server rendering, component gọi `use(browser())` sẽ suspend và React đưa fallback của boundary [`<Suspense>`](/reference/react/Suspense) gần nhất vào HTML. Trên browser, `use(browser())` trả về `undefined`, vì vậy component được render bình thường.

[Xem ví dụ bên dưới.](#rendering-a-component-only-in-the-browser)

#### Tham số {/*browser-parameters*/}

* `browserValue`: Giá trị do [`browser`](/reference/react-dom/browser) trả về.

#### Giá trị trả về {/*browser-returns*/}

`use(browser())` trả về `undefined` trên browser.

#### Lưu ý {/*browser-caveats*/}

* Component gọi `use(browser())` phải nằm bên trong một boundary `<Suspense>` trong quá trình server rendering. Nếu không có boundary, server rendering sẽ thất bại.
* Trong ứng dụng React Server Components, `use(browser())` phải được gọi từ một [Client Component](/reference/rsc/use-client), không phải từ một [Server Component](/reference/rsc/server-components).

---

## Cách sử dụng (Context) {/*usage-context*/}

### Đọc context bằng `use` {/*reading-context-with-use*/}

Khi một [context](/learn/passing-data-deeply-with-context) được truyền vào `use`, nó hoạt động tương tự như [`useContext`](/reference/react/useContext). Trong khi `useContext` phải được gọi ở cấp cao nhất của component, `use` có thể được gọi bên trong các điều kiện như `if` và các vòng lặp như `for`.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

`use` trả về <CodeStep step={2}>giá trị context</CodeStep> của <CodeStep step={1}>context</CodeStep> mà bạn đã truyền vào. Để xác định giá trị context, React tìm trong cây component và tìm **context provider gần nhất phía trên** của context cụ thể đó.

Để truyền context vào một `Button`, hãy bọc nó hoặc một trong các component cha của nó bằng context provider tương ứng.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

Số lượng lớp component nằm giữa provider và `Button` không quan trọng. Khi một `Button` *ở bất kỳ đâu* bên trong `Form` gọi `use(ThemeContext)`, nó sẽ nhận `"dark"` làm giá trị.

Không giống như [`useContext`](/reference/react/useContext), <CodeStep step={2}>`use`</CodeStep> có thể được gọi trong các điều kiện và vòng lặp như <CodeStep step={1}>`if`</CodeStep>.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> được gọi bên trong một câu lệnh <CodeStep step={1}>`if`</CodeStep>, cho phép bạn đọc có điều kiện các giá trị từ một Context.

<Pitfall>

Giống như `useContext`, `use(context)` luôn tìm context provider gần nhất *phía trên* component gọi nó. Nó tìm ngược lên trên và **không** xem xét các context provider trong component mà từ đó bạn đang gọi `use(context)`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

### Đọc Promise từ context {/*reading-a-promise-from-context*/}

Để chia sẻ dữ liệu bất đồng bộ mà không cần prop drilling, hãy đặt một Promise làm giá trị context, sau đó đọc nó bằng `use(context)` và resolve nó bằng `use(promise)`:

```js
import { use } from 'react';
import { UserContext } from './UserContext';

function Profile() {
  const userPromise = use(UserContext);
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}
```

Việc đọc giá trị cần hai lần gọi `use` vì bản thân giá trị context không được await. Xem [Trước khi sử dụng context](/learn/passing-data-deeply-with-context#before-you-use-context) để biết các phương án thay thế cần cân nhắc trước khi sử dụng context.

Hãy bọc các component đọc Promise trong một boundary [Suspense](/reference/react/Suspense) để chỉ subtree đó suspend trong khi Promise đang chờ xử lý. Xem [Cách sử dụng (Promises)](#usage-promises) bên dưới để biết thêm về việc đọc Promise bằng `use`.

<Pitfall>

Khi sử dụng mẫu này với [Server Components](/reference/rsc/server-components), việc fetch lại Promise yêu cầu fetch lại Server Component đã thiết lập Promise trong context. Tránh thiết lập Promise trong context ở vị trí quá cao trong cây, vì điều đó sẽ khiến những phần lớn của ứng dụng bị fetch lại một cách không cần thiết.

</Pitfall>

---

## Cách sử dụng (Promises) {/*usage-promises*/}

### Đọc một Promise với `use` {/*reading-a-promise-with-use*/}

Gọi `use` với một Promise để đọc giá trị đã được resolve của nó. Component sẽ [suspend](/reference/react/Suspense) trong khi Promise đang chờ xử lý.

```js [[1, 4, "use(albumsPromise)"]]
import { use } from 'react';

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

Bọc component gọi <CodeStep step={1}>`use`</CodeStep> trong một boundary [Suspense](/reference/react/Suspense) để React có thể hiển thị fallback trong khi Promise đang chờ xử lý. Boundary Suspense gần component bị suspend nhất ở phía trên sẽ hiển thị fallback của nó. Khi Promise được resolve, React đọc giá trị bằng `use` và thay thế fallback bằng component đã render.

<Recipes titleText="Reading a Promise with use vs fetching in an Effect" titleId="examples-promise">

#### Fetching dữ liệu với `use` {/*fetching-data-with-use*/}

Trong ví dụ này, `Albums` gọi `use` với một Promise đã được cache. Component sẽ suspend trong khi Promise đang chờ xử lý, còn React hiển thị fallback Suspense gần nhất. Các Promise bị reject sẽ được truyền đến [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) gần nhất.

<Sandpack>

```js src/App.js active
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchData } from './data.js';

export default function App() {
  return (
    <ErrorBoundary fallback={<p>Could not fetch albums.</p>}>
      <Suspense fallback={<Loading />}>
        <Albums />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }];
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

<Solution />

#### Fetching dữ liệu với `useEffect` {/*fetching-data-with-useeffect*/}

Trước `use`, một cách tiếp cận phổ biến là fetch dữ liệu trong một Effect và cập nhật state khi dữ liệu về. So với `use`, cách tiếp cận này yêu cầu tự quản lý trạng thái loading và lỗi. Để biết thêm chi tiết về lý do không nên fetch trong một Effect, hãy xem [You Might Not Need an Effect](/learn/you-might-not-need-an-effect#fetching-data).

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { fetchAlbums } from './data.js';

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums()
      .then(data => {
        setAlbums(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
export async function fetchAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }];
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

##### Các Promise truyền vào `use` phải được cache {/*promises-must-cached*/}

Các Promise được tạo trong quá trình render sẽ được tạo lại ở mỗi lần render, khiến React liên tục hiển thị fallback Suspense và ngăn nội dung xuất hiện.

```js
function Albums() {
  // 🔴 `fetch` creates a new Promise on every render.
  const albums = use(fetch('/albums'));
  // ...
}
```

Thay vào đó, hãy truyền một Promise từ cache, một [Suspense-enabled framework](/reference/react/Suspense#suspense-enabled-frameworks), hoặc một Server Component:

```js
// ✅ fetchData reads the Promise from a cache.
const albums = use(fetchData('/albums'));
```

</Pitfall>

<DeepDive>

#### Tại sao Promise lại được tạo lại ở mỗi lần render? {/*why-promises-recreated*/}

[React không giữ lại state cho những lần render bị suspend trước khi mount](/reference/react/Suspense#caveats). Sau mỗi lần suspend, React thử render lại từ đầu, nên mọi Promise được tạo trong quá trình render đều bị tạo lại.

Các cách phổ biến khiến Promise vô tình bị tạo lại trong quá trình render:

```js
function Albums() {
  // 🔴 `fetch` creates a new Promise on every render.
  const albums = use(fetch('/albums'));

  // 🔴 Uncached `async` function calls create a new Promise on every render.
  const albums = use((async () => {
    const res = await fetch('/albums');
    return res.json();
  })());

  // 🔴 Adding `.then` returns a new Promise on every render,
  // ngay cả khi `fetchData` đã được cache.
  const albums = use(fetchData('/albums').then(res => res.json()));
  // ...
}
```

Lý tưởng nhất là tạo Promise trước khi render, chẳng hạn trong event handler, route loader hoặc Server Component, rồi truyền nó vào component gọi `use`. Việc fetch một cách lazy trong quá trình render sẽ trì hoãn các request mạng và có thể tạo ra các waterfall.

```js
// ✅ fetchData reads the Promise from a cache.
const albums = use(fetchData('/albums'));
```

</DeepDive>

---

### Cache Promise cho Client Component {/*caching-promises-for-client-components*/}

Các Promise truyền vào `use` trong Client Component phải được cache để cùng một instance Promise được sử dụng lại qua các lần re-render. Nếu một Promise mới được tạo trực tiếp trong quá trình render, React sẽ hiển thị fallback Suspense ở mỗi lần re-render.

```js
// ✅ Cache the Promise so the same one is reused across renders
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}
```

Hàm `fetchData` trả về cùng một Promise mỗi khi được gọi với cùng một URL. Khi `use` nhận cùng một Promise trong lần re-render, nó sẽ đọc giá trị đã được resolve một cách đồng bộ mà không suspend.

<Note>

Cách bạn cache Promise phụ thuộc vào framework sử dụng cùng Suspense. Các framework thường cung cấp cơ chế caching tích hợp sẵn. Nếu không sử dụng framework, bạn có thể dùng một cache đơn giản ở cấp module như ví dụ trên, hoặc một [Suspense-enabled data source](/reference/react/Suspense#what-activates-a-suspense-boundary).

</Note>

Trong ví dụ dưới đây, việc nhấp vào "Re-render" sẽ cập nhật state trong `App` và kích hoạt re-render. Vì `fetchData` trả về cùng một Promise đã được cache, `Albums` sẽ đọc giá trị một cách đồng bộ thay vì hiển thị lại fallback Suspense.

<Sandpack>

```js src/App.js active
import { use, Suspense, useState } from 'react';
import { fetchData } from './data.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Re-render
      </button>
      <p>Render count: {count}</p>
      <Suspense fallback={<p>Loading...</p>}>
        <Albums />
      </Suspense>
    </>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }];
}
```

</Sandpack>

<DeepDive>

#### Cách triển khai cache cho Promise {/*how-to-implement-a-promise-cache*/}

Một cache cơ bản lưu Promise với khóa là URL để cùng một instance được sử dụng lại qua các lần render. Để đồng thời tránh các fallback Suspense không cần thiết khi dữ liệu đã có sẵn, bạn có thể thiết lập các trường `status` và `value` (hoặc `reason`) trên Promise. React kiểm tra các trường này khi `use` được gọi: nếu `status` là `'fulfilled'`, nó sẽ đọc `value` một cách đồng bộ mà không suspend. Nếu `status` là `'rejected'`, nó sẽ throw `reason`. Nếu trường này bị thiếu hoặc là `'pending'`, nó sẽ suspend.

```js
let cache = new Map();

function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}
```

Điều này chủ yếu hữu ích cho các tác giả thư viện đang xây dựng data layer tương thích với Suspense. React sẽ tự đặt trường `status` trên những Promise chưa có trường này, nhưng tự thiết lập trường này sẽ tránh một lần render bổ sung khi dữ liệu đã có sẵn.

Mẫu cache này là nền tảng cho việc [re-fetching data](#re-fetching-data-in-client-components) (trong đó việc thay đổi cache key sẽ kích hoạt một fetch mới) và [preloading data on hover](#preloading-data-on-hover) (trong đó việc gọi `fetchData` sớm có nghĩa là Promise có thể đã được resolve vào thời điểm `use` đọc nó).

</DeepDive>

<Pitfall>

##### Đừng bỏ qua việc gọi `use` chỉ dựa trên việc Promise đã settle hay chưa. {/*conditional-use*/}

Không giống các hook khác, `use` có thể được gọi bên trong các điều kiện và vòng lặp — nhưng luôn phải được gọi cho chính Promise đó. Không bao giờ đọc trực tiếp `promise.status` hoặc `promise.value` để bypass `use`; luôn truyền Promise vào `use` và để React xử lý.

```js
// 🔴 Don't bypass `use` by reading promise status directly
if (promise.status === 'fulfilled') {
  return promise.value;
}
const value = use(promise);
```

```js
// ✅ Pass the promise to `use` and let React track the promise
const value = use(promise);
```

Việc bypass `use` theo cách này có thể phá vỡ các tối ưu hóa của React Suspense và các tính năng Suspense dành cho React DevTools. Bạn có thể `use(promise)` theo điều kiện, nhưng đừng `use(promise)` theo điều kiện dựa trên chính Promise.

</Pitfall>

---

### Fetch lại dữ liệu trong Client Component {/*re-fetching-data-in-client-components*/}

Để refresh dữ liệu tại cùng một URL (chẳng hạn bằng nút "Refresh"), hãy invalidate mục cache và bắt đầu một fetch mới bên trong một [`startTransition`](/reference/react/startTransition). Lưu Promise kết quả vào state để kích hoạt re-render. Trong khi Promise mới đang chờ xử lý, React vẫn hiển thị nội dung hiện tại vì quá trình cập nhật nằm bên trong một Transition.

```js
function App() {
  const [albumsPromise, setAlbumsPromise] = useState(fetchData('/albums'));
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/albums'));
    });
  }
  // ...
}
```

`refetchData` xóa mục cache cũ và bắt đầu một fetch mới tại cùng URL. Việc lưu Promise kết quả vào state sẽ kích hoạt re-render bên trong Transition. Trong lần re-render, `Albums` nhận Promise mới và `use` suspend trên Promise đó trong khi React vẫn tiếp tục hiển thị nội dung cũ.

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import { use } from 'react';
import { fetchData, refetchData } from './data.js';

export default function App() {
  const [albumsPromise, setAlbumsPromise] = useState(
    () => fetchData('/the-beatles/albums')
  );
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/the-beatles/albums'));
    });
  }

  return (
    <>
      <button
        onClick={handleRefresh}
        disabled={isPending}
      >
        {isPending ? 'Refreshing...' : 'Refresh'}
      </button>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <Suspense fallback={<Loading />}>
          <Albums albumsPromise={albumsPromise} />
        </Suspense>
      </div>
    </>
  );
}

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

export function refetchData(url) {
  cache.delete(url);
  return fetchData(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }];
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

<Note>

Các framework hỗ trợ Suspense thường cung cấp cơ chế caching và invalidation riêng. Cache tùy chỉnh ở trên hữu ích để hiểu mẫu này, nhưng trong thực tế, hãy ưu tiên giải pháp fetching dữ liệu của framework bạn.

</Note>

---

### Preload dữ liệu khi hover {/*preloading-data-on-hover*/}

Bạn có thể bắt đầu tải dữ liệu trước khi cần đến bằng cách gọi `fetchData` trong một sự kiện hover. Vì `fetchData` cache Promise, dữ liệu có thể đã sẵn sàng khi người dùng nhấp vào. Nếu Promise đã được resolve vào thời điểm `use` đọc nó, React sẽ render component ngay lập tức mà không hiển thị fallback Suspense.

```js
<button
  onMouseEnter={() => fetchData(`/${id}/albums`)}
  onClick={() => {
    startTransition(() => {
      setArtistId(id);
    });
  }}
>
```

Trong ví dụ này, việc di chuột lên nút artist sẽ bắt đầu fetch các album của họ ở chế độ nền. Nếu không hover trước, thao tác nhấp sẽ hiển thị fallback loading. Hãy thử hover lên một nút trong giây lát trước khi nhấp để thấy sự khác biệt.

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import Albums from './Albums.js';
import { fetchData } from './data.js';

export default function App() {
  const [artistId, setArtistId] = useState('the-beatles');
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div>
        {['the-beatles', 'led-zeppelin', 'pink-floyd'].map(id => (
          <button
            key={id}
            onMouseEnter={() => {
              fetchData(`/${id}/albums`);
            }}
            onClick={() => {
              startTransition(() => {
                setArtistId(id);
              });
            }}
          >
            {id === 'the-beatles' ? 'The Beatles' :
             id === 'led-zeppelin' ? 'Led Zeppelin' :
             'Pink Floyd'}
          </button>
        ))}
      </div>
      <Suspense key={artistId} fallback={<Loading />}>
        <Albums artistId={artistId} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    // Thiết lập các trường trạng thái để React có thể đọc giá trị
    // đồng bộ nếu Promise được resolve trước
    // `use` is called (e.g. when preloading on hover).
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums('the-beatles');
  } else if (url.startsWith('/led-zeppelin/albums')) {
    return await getAlbums('led-zeppelin');
  } else if (url.startsWith('/pink-floyd/albums')) {
    return await getAlbums('pink-floyd');
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums(artistId) {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 800);
  });

  if (artistId === 'the-beatles') {
    return [{
      id: 13,
      title: 'Let It Be',
      year: 1970
    }, {
      id: 12,
      title: 'Abbey Road',
      year: 1969
    }, {
      id: 11,
      title: 'Yellow Submarine',
      year: 1969
    }];
  } else if (artistId === 'led-zeppelin') {
    return [{
      id: 10,
      title: 'Coda',
      year: 1982
    }, {
      id: 9,
      title: 'In Through the Out Door',
      year: 1979
    }, {
      id: 8,
      title: 'Presence',
      year: 1976
    }];
  } else {
    return [{
      id: 7,
      title: 'The Wall',
      year: 1979
    }, {
      id: 6,
      title: 'Animals',
      year: 1977
    }, {
      id: 5,
      title: 'Wish You Were Here',
      year: 1975
    }];
  }
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

---

### Stream dữ liệu từ server đến client {/*streaming-data-from-server-to-client*/}

Dữ liệu có thể được stream từ server đến client bằng cách truyền một Promise dưới dạng prop từ Server Component đến Client Component.

```js
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Sau đó, Client Component nhận Promise được truyền dưới dạng prop và truyền nó vào API `use`. Điều này cho phép Client Component đọc giá trị từ Promise ban đầu được tạo bởi Server Component.

```js
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
Vì `Message` được bao bọc trong boundary [Suspense](/reference/react/Suspense), fallback sẽ được hiển thị cho đến khi Promise được resolve. Khi Promise được resolve, giá trị sẽ được đọc bởi API `use` và component `Message` sẽ thay thế fallback của Suspense.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// môi trường demo Codesandbox Server Component
// sau khi được tạo
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<DeepDive>

#### Tôi nên resolve Promise trong Server Component hay Client Component? {/*resolve-promise-in-server-or-client-component*/}

Nếu có một Promise, đến một thời điểm nào đó bạn cần unwrap nó để đọc giá trị. Bạn unwrap nó bằng `await` trong Server Component và bằng `use` trong Client Component.

Thông thường, lựa chọn đơn giản nhất là `await` Promise ngay tại nơi bạn tạo nó. Server Component sẽ suspend cho đến khi dữ liệu sẵn sàng, và mọi thứ bên dưới nó cũng sẽ chờ:

```js
// Server Component
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />;
}
```

Tuy nhiên, bạn không nhất thiết phải unwrap nó ngay lập tức. Bạn có thể truyền Promise xuống dưới dưới dạng prop rồi unwrap nó ở phần sâu hơn trong cây component. Component đọc Promise vẫn sẽ suspend, nhưng chỉ phần đó của cây phải chờ dữ liệu. Hãy bọc component đó trong một boundary [`<Suspense>`](/reference/react/Suspense) để hiển thị fallback trong khi phần còn lại của trang được render ngay lập tức.

Ví dụ, một Server Component ở sâu hơn có thể `await` Promise mà nó nhận được:

```js
import { Suspense } from 'react';

// Server Component
export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}

// Server Component
async function Message({ messagePromise }) {
  const messageContent = await messagePromise;
  return <p>{messageContent}</p>;
}
```

Hoặc, trong một file riêng, một Client Component có thể unwrap cùng Promise đó bằng `use`:

```js
// Client Component
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>{messageContent}</p>;
}
```

Việc truyền Promise xuống hoạt động giống nhau trong cả hai trường hợp. Cả hai đều suspend tại nơi Promise được đọc và đều bỏ chặn UI ở phía trên. Điểm khác biệt duy nhất là Client Component không thể `await` trong quá trình render, nên chúng unwrap Promise bằng `use` thay thế. Một trường hợp thường gặp là nội dung tương tác như popover và tooltip, trong đó dữ liệu chỉ cần thiết sau khi hover hoặc click.

Xem [Revealing content together at once](/reference/react/Suspense#revealing-content-together-at-once) để biết cách đặt các boundary Suspense.

</DeepDive>

---

### Hiển thị lỗi bằng Error Boundary {/*displaying-an-error-with-an-error-boundary*/}

Nếu Promise được truyền vào `use` bị rejected, lỗi sẽ lan truyền đến [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) gần nhất. Hãy bọc component gọi `use` trong một Error Boundary để hiển thị fallback khi Promise bị rejected.

Trong ví dụ dưới đây, `fetchData` bị rejected ở lần thử đầu tiên và thành công khi retry. Error Boundary bắt rejection và hiển thị fallback kèm nút "Try again".

<Sandpack>

```js src/App.js active
import { use, Suspense, useState, startTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchData, refetchData } from "./data.js";

export default function App() {
  const [albumsPromise, setAlbumsPromise] = useState(
    () => fetchData('/the-beatles/albums')
  );

  function handleRetry() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/the-beatles/albums'));
    });
  }

  return (
    <ErrorBoundary
      resetKeys={[albumsPromise]}
      fallbackRender={() => (
        <>
          <p>⚠️ Something went wrong loading the albums.</p>
          <button onClick={handleRetry}>Try again</button>
        </>
      )}
    >
      <Suspense fallback={<p>Loading...</p>}>
        <Albums albumsPromise={albumsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();
let retried = false;

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

export function refetchData(url) {
  cache.delete(url);
  retried = true;
  return fetchData(url);
}

async function getData(url) {
  // Thêm độ trễ giả để trạng thái đang tải hiển thị rõ hơn.
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (url === '/the-beatles/albums') {
    // Làm lần thử đầu tiên thất bại để minh họa Error Boundary,
    // sau đó thành công khi thử lại.
    if (!retried) {
      throw new Error('Example Error: Failed to fetch albums');
    }
    return [{
      id: 13,
      title: 'Let It Be',
      year: 1970
    }, {
      id: 12,
      title: 'Abbey Road',
      year: 1969
    }, {
      id: 11,
      title: 'Yellow Submarine',
      year: 1969
    }, {
      id: 10,
      title: 'The Beatles',
      year: 1968
    }];
  }
  throw new Error('Not implemented');
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Cách sử dụng (Browser) {/*usage-browser*/}

### Chỉ render một component trong browser {/*rendering-a-component-only-in-the-browser*/}

Truyền giá trị được trả về bởi [`browser`](/reference/react-dom/browser) vào `use` bên trong một component chỉ nên được render trong browser.

Nhấp vào **Reload** để xem loading fallback trong HTML ban đầu. Sau hydration, React sẽ hiển thị bản nháp được tải từ `localStorage`.

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

  // Chờ để cả fallback lẫn nội dung đã hydrate đều hiển thị.
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

Trong quá trình server rendering, `use(browser())` sẽ suspend component và React đưa fallback của boundary Suspense gần nhất vào HTML. Trong browser, `use(browser())` trả về `undefined` và bản nháp đã lưu được render bình thường.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi gặp lỗi: "Suspense Exception: Đây không phải lỗi thực sự!" {/*suspense-exception-error*/}

Bạn đang gọi `use` bên trong một khối try-catch. `use` tự ném exception bên trong để tích hợp với Suspense, nên không thể được bọc trong try-catch. Thay vào đó, hãy bọc component gọi `use` trong một [Error Boundary](#displaying-an-error-with-an-error-boundary) để xử lý lỗi.

```jsx
function Albums({ albumsPromise }) {
  try {
    // ❌ Don't wrap `use` in try-catch
    const albums = use(albumsPromise);
  } catch (e) {
    return <p>Error</p>;
  }
  // ...
```

Thay vào đó, hãy bọc component trong một Error Boundary:

```jsx
function Albums({ albumsPromise }) {
  // ✅ Call `use` without try-catch
  const albums = use(albumsPromise);
  // ...
```

```jsx
// ✅ Use an Error Boundary to handle errors
<ErrorBoundary fallback={<p>Error</p>}>
  <Albums albumsPromise={albumsPromise} />
</ErrorBoundary>
```

---

### Tôi nhận được cảnh báo: "Một component đã bị suspend bởi một promise chưa được cache" {/*uncached-promise-error*/}

Promise được truyền vào `use` chưa được cache, nên React không thể tái sử dụng nó giữa các lần re-render.

Điều này thường xảy ra khi gọi trực tiếp `fetch` hoặc một hàm `async` trong quá trình render:

```js
function Albums() {
  // 🔴 This creates a new Promise on every render
  const albums = use(fetch('/albums'));
  // ...
}
```

Để khắc phục, hãy cache Promise để cùng một instance được tái sử dụng:

```js
// ✅ fetchData returns the same Promise for the same URL
const albums = use(fetchData('/albums'));
```

Xem [caching Promises for Client Components](#caching-promises-for-client-components) để biết thêm chi tiết.
