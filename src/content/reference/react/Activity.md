---
title: <Activity>
---

<Intro>

`<Activity>` cho phép bạn ẩn và khôi phục UI cũng như trạng thái nội bộ của các thành phần con.

```js
<Activity mode={visibility}>
  <Sidebar />
</Activity>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<Activity>` {/*activity*/}

Bạn có thể sử dụng Activity để ẩn một phần ứng dụng của mình:

```js [[1, 1, "\\"hidden\\""], [2, 2, "<Sidebar />"], [3, 1, "\\"visible\\""]]
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

Khi một boundary Activity ở trạng thái <CodeStep step={1}>ẩn</CodeStep>, React sẽ ẩn về mặt trực quan <CodeStep step={2}>các thành phần con của nó</CodeStep> bằng thuộc tính CSS `display: "none"`. React cũng sẽ hủy các Effect của chúng và dọn dẹp mọi subscription đang hoạt động.

Trong khi bị ẩn, các thành phần con vẫn re-render khi nhận props mới, dù với mức độ ưu tiên thấp hơn phần nội dung còn lại.

Khi boundary trở nên <CodeStep step={3}>hiển thị</CodeStep> trở lại, React sẽ hiển thị lại các thành phần con với trạng thái trước đó được khôi phục, đồng thời tạo lại các Effect của chúng.

Theo cách này, Activity có thể được xem là một cơ chế để render “hoạt động nền”. Thay vì loại bỏ hoàn toàn nội dung có khả năng sẽ hiển thị lại, bạn có thể sử dụng Activity để duy trì và khôi phục UI cùng trạng thái nội bộ của nội dung đó, đồng thời đảm bảo nội dung bị ẩn không gây ra các side effect không mong muốn.

[Xem thêm ví dụ bên dưới.](#usage)

#### Props {/*props*/}

* `children`: UI mà bạn muốn hiển thị và ẩn.
* `mode`: Một giá trị chuỗi là `'visible'` hoặc `'hidden'`. Nếu được bỏ qua, mặc định là `'visible'`.

#### Lưu ý {/*caveats*/}

- Nếu một Activity được render bên trong [ViewTransition](/reference/react/ViewTransition), và trở nên hiển thị do một bản cập nhật được gây ra bởi [startTransition](/reference/react/startTransition), nó sẽ kích hoạt animation `enter` của ViewTransition. Nếu trở nên bị ẩn, nó sẽ kích hoạt animation `exit`.
- Một Activity *bị ẩn* chỉ render văn bản sẽ không render gì cả thay vì render văn bản bị ẩn, vì không có phần tử DOM tương ứng để áp dụng các thay đổi về khả năng hiển thị. Ví dụ, `<Activity mode="hidden"><ComponentThatJustReturnsText /></Activity>` sẽ không tạo ra đầu ra nào trong DOM cho `const ComponentThatJustReturnsText = () => "Hello, World!"`. `<Activity mode="visible"><ComponentThatJustReturnsText /></Activity>` sẽ render văn bản hiển thị.

---

## Cách sử dụng {/*usage*/}

### Khôi phục trạng thái của các component bị ẩn {/*restoring-the-state-of-hidden-components*/}

Trong React, khi muốn hiển thị hoặc ẩn một component có điều kiện, thông thường bạn sẽ mount hoặc unmount component đó dựa trên điều kiện:

```jsx
{isShowingSidebar && (
  <Sidebar />
)}
```

Tuy nhiên, unmount một component sẽ hủy trạng thái nội bộ của nó, và đây không phải lúc nào cũng là điều bạn muốn.

Thay vào đó, khi ẩn một component bằng boundary Activity, React sẽ “lưu” trạng thái của component để sử dụng sau:

```jsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

Nhờ đó, bạn có thể ẩn component rồi khôi phục component sau này về trạng thái trước đó.

Ví dụ sau có một sidebar với một section có thể mở rộng. Bạn có thể nhấn “Overview” để hiển thị ba subitem bên dưới. Khu vực chính của app cũng có một button để ẩn và hiện sidebar.

Hãy thử mở rộng section Overview, sau đó tắt rồi bật lại sidebar:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      {isShowingSidebar && (
        <Sidebar />
      )}

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

Section Overview luôn bắt đầu ở trạng thái thu gọn. Vì chúng ta unmount sidebar khi `isShowingSidebar` chuyển thành `false`, toàn bộ trạng thái nội bộ của nó bị mất.

Đây là một trường hợp sử dụng hoàn hảo cho Activity. Chúng ta có thể giữ lại trạng thái nội bộ của sidebar, ngay cả khi ẩn nó về mặt trực quan.

Hãy thay việc render sidebar có điều kiện bằng một boundary Activity:

```jsx {7,9}
// Trước
{isShowingSidebar && (
  <Sidebar />
)}

// Sau
<Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

và xem hành vi mới:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';

import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

Trạng thái nội bộ của sidebar giờ đây được khôi phục mà không cần thay đổi cách triển khai.

---

### Khôi phục DOM của các component bị ẩn {/*restoring-the-dom-of-hidden-components*/}

Vì các boundary Activity ẩn các thành phần con bằng `display: none`, DOM của các thành phần con cũng được giữ lại khi bị ẩn. Điều này khiến Activity rất phù hợp để duy trì trạng thái tạm thời trong những phần UI mà người dùng có khả năng sẽ tương tác lại.

Trong ví dụ này, tab Contact có một `<textarea>` để người dùng nhập tin nhắn. Nếu bạn nhập một đoạn văn bản, chuyển sang tab Home, rồi chuyển lại tab Contact, tin nhắn nháp sẽ bị mất:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'contact' && <Contact />}
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js active
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Điều này xảy ra vì chúng ta unmount hoàn toàn `Contact` trong `App`. Khi tab Contact bị unmount, trạng thái DOM nội bộ của phần tử `<textarea>` bị mất.

Nếu chuyển sang sử dụng boundary Activity để hiển thị và ẩn tab đang hoạt động, chúng ta có thể giữ lại trạng thái DOM của từng tab. Hãy thử nhập văn bản và chuyển đổi giữa các tab lần nữa, bạn sẽ thấy tin nhắn nháp không còn bị reset:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'contact' ? 'visible' : 'hidden'}>
        <Contact />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Một lần nữa, boundary Activity cho phép chúng ta giữ lại trạng thái nội bộ của tab Contact mà không cần thay đổi cách triển khai.

---

### Pre-render nội dung có khả năng sẽ hiển thị {/*pre-rendering-content-thats-likely-to-become-visible*/}

Cho đến giờ, chúng ta đã thấy Activity có thể ẩn nội dung mà người dùng đã tương tác mà không loại bỏ trạng thái tạm thời của nội dung đó.

Nhưng các boundary Activity cũng có thể được sử dụng để _chuẩn bị_ nội dung mà người dùng chưa từng thấy:

```jsx [[1, 1, "\\"hidden\\""]]
<Activity mode="hidden">
  <SlowComponent />
</Activity>
```

Khi một boundary Activity ở trạng thái <CodeStep step={1}>ẩn</CodeStep> trong lần render đầu tiên, các thành phần con của nó sẽ không hiển thị trên trang — nhưng chúng _vẫn được render_, dù với mức độ ưu tiên thấp hơn nội dung đang hiển thị, và không mount các Effect của chúng.

Việc _pre-render_ này cho phép các thành phần con tải trước mọi code hoặc dữ liệu cần thiết, để sau đó, khi boundary Activity trở nên hiển thị, các thành phần con có thể xuất hiện nhanh hơn với thời gian tải ngắn hơn.

Hãy xem một ví dụ.

Trong bản demo này, tab Posts tải một số dữ liệu. Nếu bạn nhấn vào tab đó, bạn sẽ thấy fallback Suspense hiển thị trong khi dữ liệu đang được lấy:

<Sandpack>

```js src/App.js
import { useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        {activeTab === 'home' && <Home />}
        {activeTab === 'posts' && <Posts />}
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
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
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

Điều này xảy ra vì `App` không mount `Posts` cho đến khi tab của nó hoạt động.

Nếu cập nhật `App` để sử dụng boundary Activity nhằm hiển thị và ẩn tab đang hoạt động, `Posts` sẽ được pre-render khi app tải lần đầu, cho phép nó lấy dữ liệu trước khi trở nên hiển thị.

Hãy thử nhấp vào tab Posts ngay bây giờ:

<Sandpack>

```js src/App.js
import { Activity, useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <Home />
        </Activity>
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <Posts />
        </Activity>
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
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
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

`Posts` đã có thể tự chuẩn bị để render nhanh hơn nhờ boundary Activity bị ẩn.

---

Pre-render các component bằng boundary Activity bị ẩn là một cách mạnh mẽ để giảm thời gian tải cho những phần UI mà người dùng có khả năng sẽ tương tác tiếp theo.

<Note>

Chỉ dữ liệu được đọc từ một nguồn [kích hoạt một boundary Suspense](/reference/react/Suspense#what-activates-a-suspense-boundary), chẳng hạn như một Promise được đọc bằng [`use`](/reference/react/use), mới được lấy trong quá trình pre-render. Activity không phát hiện dữ liệu được lấy bên trong một Effect.

</Note>

---


### Tăng tốc tương tác trong khi tải trang {/*speeding-up-interactions-during-page-load*/}

React có một tối ưu hóa hiệu năng hoạt động bên trong có tên là Selective Hydration. Tính năng này hydrate HTML ban đầu của app _theo từng phần_, cho phép một số component trở nên có thể tương tác ngay cả khi code hoặc dữ liệu của các component khác trên trang chưa được tải.

Các boundary Suspense tham gia vào Selective Hydration vì chúng tự nhiên chia cây component thành những đơn vị độc lập với nhau:

```jsx
function Page() {
  return (
    <>
      <MessageComposer />

      <Suspense fallback="Loading chats...">
        <Chats />
      </Suspense>
    </>
  )
}
```

Tại đây, `MessageComposer` có thể được hydrate hoàn toàn trong lần render đầu tiên của trang, ngay cả trước khi `Chats` được mount và bắt đầu lấy dữ liệu.

Vì vậy, bằng cách chia cây component thành các đơn vị riêng biệt, Suspense cho phép React hydrate HTML được render từ server của app theo từng phần, giúp các phần của app trở nên có thể tương tác nhanh nhất có thể.

Nhưng những trang không sử dụng Suspense thì sao?

Hãy xem ví dụ về tabs này:

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      {activeTab === 'home' && (
        <Home />
      )}
      {activeTab === 'video' && (
        <Video />
      )}
    </>
  )
}
```

Tại đây, React phải hydrate toàn bộ trang cùng một lúc. Nếu `Home` hoặc `Video` render chậm hơn, chúng có thể khiến các button tab phản hồi chậm trong quá trình hydration.

Thêm Suspense xung quanh tab đang hoạt động sẽ giải quyết vấn đề này:

```jsx {13,20}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Suspense fallback={<Placeholder />}>
        {activeTab === 'home' && (
          <Home />
        )}
        {activeTab === 'video' && (
          <Video />
        )}
      </Suspense>
    </>
  )
}
```

...nhưng điều đó cũng sẽ thay đổi UI, vì `Placeholder` fallback sẽ hiển thị trong lần render đầu tiên.

Thay vào đó, chúng ta có thể sử dụng Activity. Vì các boundary Activity hiển thị và ẩn các thành phần con, chúng vốn đã tự nhiên chia cây component thành những đơn vị độc lập. Và cũng giống như Suspense, tính năng này cho phép chúng tham gia vào Selective Hydration.

Hãy cập nhật ví dụ để sử dụng các Activity boundary xung quanh tab đang hoạt động:

```jsx {13-18}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Activity mode={activeTab === "home" ? "visible" : "hidden"}>
        <Home />
      </Activity>
      <Activity mode={activeTab === "video" ? "visible" : "hidden"}>
        <Video />
      </Activity>
    </>
  )
}
```

Giờ đây, HTML được server render ban đầu của chúng ta trông giống như trong phiên bản gốc, nhưng nhờ Activity, React có thể hydrate các nút tab trước, thậm chí trước khi mount `Home` hoặc `Video`.

---

Vì vậy, ngoài việc ẩn và hiển thị nội dung, các Activity boundary còn giúp cải thiện hiệu năng của ứng dụng trong quá trình hydration bằng cách cho React biết phần nào trên trang có thể trở nên tương tác một cách độc lập.

Và ngay cả khi trang của bạn không bao giờ ẩn một phần nội dung nào, bạn vẫn có thể thêm các Activity boundary luôn hiển thị để cải thiện hiệu năng hydration:

```jsx
function Page() {
  return (
    <>
      <Post />

      <Activity>
        <Comments />
      </Activity>
    </>
  );
}
```

---

## Khắc phục sự cố {/*troubleshooting*/}

### Các component bị ẩn của tôi có những side effect không mong muốn {/*my-hidden-components-have-unwanted-side-effects*/}

Một Activity boundary ẩn nội dung bằng cách đặt `display: none` trên các phần tử con của nó và dọn dẹp mọi Effect của chúng. Vì vậy, hầu hết các React component hoạt động đúng cách và dọn dẹp side effect của mình sẽ vốn đã có khả năng xử lý tốt việc bị Activity ẩn đi.

Tuy nhiên, _có_ một số tình huống trong đó một component bị ẩn hoạt động khác với một component đã unmount. Đáng chú ý nhất là vì DOM của component bị ẩn không bị hủy, mọi side effect từ DOM đó sẽ vẫn tồn tại, ngay cả sau khi component bị ẩn.

Ví dụ, hãy xét một thẻ `<video>`. Thông thường, thẻ này không cần dọn dẹp vì ngay cả khi bạn đang phát video, việc unmount thẻ cũng sẽ dừng video và âm thanh phát trong trình duyệt. Hãy thử phát video rồi nhấn Home trong bản demo này:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'video' && <Video />}
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
export default function Video() {
  return (
    <video
      // 'Big Buck Bunny' được cấp phép theo CC 3.0 bởi Blender Foundation. Được lưu trữ trên archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
      controls
      playsInline
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

Video sẽ dừng phát như mong đợi.

Bây giờ, giả sử chúng ta muốn lưu lại timecode tại nơi người dùng xem lần cuối, để khi họ chuyển lại tab video, video không bắt đầu lại từ đầu.

Đây là một trường hợp sử dụng tuyệt vời cho Activity!

Hãy cập nhật `App` để ẩn tab không hoạt động bằng một Activity boundary bị ẩn thay vì unmount nó, rồi xem lần này bản demo hoạt động như thế nào:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
export default function Video() {
  return (
    <video
      controls
      playsInline
      // 'Big Buck Bunny' được cấp phép theo CC 3.0 bởi Blender Foundation. Được lưu trữ trên archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

Ôi không! Video và âm thanh vẫn tiếp tục phát ngay cả sau khi bị ẩn, vì phần tử `<video>` của tab vẫn còn trong DOM.

Để khắc phục điều này, chúng ta có thể thêm một Effect với hàm cleanup để tạm dừng video:

```jsx {2,4-10,14}
export default function VideoTab() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current;

    return () => {
      videoRef.pause()
    }
  }, []);

  return (
    <video
      ref={ref}
      controls
      playsInline
      src="..."
    />

  );
}
```

Chúng ta gọi `useLayoutEffect` thay vì `useEffect` vì về mặt khái niệm, code cleanup gắn với việc UI của component bị ẩn về mặt trực quan. Nếu sử dụng effect thông thường, code có thể bị trì hoãn bởi (chẳng hạn) một Suspense boundary đang suspend lại hoặc một View Transition.

Hãy xem hành vi mới. Hãy thử phát video, chuyển sang tab Home, rồi quay lại tab Video:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js
import { useRef, useLayoutEffect } from 'react';

export default function Video() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current

    return () => {
      videoRef.pause()
    };
  }, [])

  return (
    <video
      ref={ref}
      controls
      playsInline
      // 'Big Buck Bunny' được cấp phép theo CC 3.0 bởi Blender Foundation. Được lưu trữ trên archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

Mọi thứ hoạt động rất tốt! Hàm cleanup của chúng ta đảm bảo video sẽ dừng phát nếu bị một Activity boundary ẩn đi, và tuyệt vời hơn nữa, vì thẻ `<video>` không bao giờ bị hủy, timecode được giữ lại, đồng thời bản thân video không cần được khởi tạo hoặc tải xuống lại khi người dùng chuyển trở lại để tiếp tục xem.

Đây là một ví dụ tuyệt vời về việc sử dụng Activity để giữ lại trạng thái DOM tạm thời cho những phần UI bị ẩn nhưng có khả năng người dùng sẽ sớm tương tác lại.

---

Ví dụ của chúng ta cho thấy đối với một số thẻ nhất định như `<video>`, việc unmount và việc ẩn có hành vi khác nhau. Nếu một component render DOM có side effect và bạn muốn ngăn side effect đó khi một Activity boundary ẩn component, hãy thêm một Effect có hàm return để dọn dẹp side effect đó.

Các trường hợp phổ biến nhất là những thẻ sau:

  - `<video>`
  - `<audio>`
  - `<iframe>`

Tuy nhiên, thông thường, hầu hết React component của bạn vốn đã có khả năng xử lý tốt việc bị một Activity boundary ẩn đi. Và về mặt khái niệm, bạn nên xem các Activity "hidden" như đã được unmount.

Để chủ động phát hiện các Effect khác chưa được cleanup đúng cách, điều quan trọng không chỉ đối với Activity boundary mà còn đối với nhiều hành vi khác trong React, chúng tôi khuyến nghị sử dụng [`<StrictMode>`](/reference/react/StrictMode).

---


### Các component bị ẩn của tôi có những Effect không chạy {/*my-hidden-components-have-effects-that-arent-running*/}

Khi một `<Activity>` ở trạng thái "hidden", tất cả Effect của các phần tử con đều được cleanup. Về mặt khái niệm, các phần tử con đã được unmount, nhưng React lưu lại state của chúng để sử dụng sau. Đây là một tính năng của Activity vì nó có nghĩa là các subscription sẽ không hoạt động đối với những phần UI bị ẩn, từ đó giảm lượng công việc cần thực hiện cho nội dung bị ẩn.

Nếu bạn đang dựa vào việc Effect mount để dọn dẹp side effect của component, hãy refactor Effect để thực hiện công việc đó trong hàm cleanup được return.

Để chủ động tìm các Effect có vấn đề, chúng tôi khuyến nghị thêm [`<StrictMode>`](/reference/react/StrictMode), tính năng này sẽ chủ động thực hiện việc unmount và mount Activity để phát hiện mọi side effect không mong muốn.
