---
title: <StrictMode>
---


<Intro>

`<StrictMode>` giúp bạn sớm tìm ra các lỗi phổ biến trong component trong quá trình phát triển.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

Sử dụng `StrictMode` để bật thêm các hành vi và cảnh báo trong quá trình phát triển cho cây component bên trong:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[Xem thêm các ví dụ bên dưới.](#usage)

Strict Mode bật các hành vi chỉ có trong quá trình phát triển sau:

- Các component của bạn sẽ [re-render thêm một lần](#fixing-bugs-found-by-double-rendering-in-development) để tìm các lỗi do việc render không thuần túy gây ra.
- Các component của bạn sẽ [chạy lại Effects thêm một lần](#fixing-bugs-found-by-re-running-effects-in-development) để tìm các lỗi do thiếu cleanup cho Effect gây ra.
- Các component của bạn sẽ [chạy lại các callback của ref thêm một lần](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) để tìm các lỗi do thiếu cleanup cho ref gây ra.
- Các component của bạn sẽ [được kiểm tra việc sử dụng các API đã deprecated.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode` không nhận prop nào.

#### Lưu ý {/*caveats*/}

* Không có cách nào để tắt Strict Mode bên trong một cây được bọc trong `<StrictMode>`. Điều này giúp bạn tin tưởng rằng tất cả component bên trong `<StrictMode>` đều được kiểm tra. Nếu hai team cùng làm việc trên một sản phẩm không đồng thuận về giá trị của các kiểm tra này, họ cần đạt được đồng thuận hoặc di chuyển `<StrictMode>` xuống vị trí thấp hơn trong cây.

---

## Cách sử dụng {/*usage*/}

### Bật Strict Mode cho toàn bộ ứng dụng {/*enabling-strict-mode-for-entire-app*/}

Strict Mode bật thêm các kiểm tra chỉ có trong quá trình phát triển cho toàn bộ cây component bên trong component `<StrictMode>`. Các kiểm tra này giúp bạn sớm tìm ra các lỗi phổ biến trong component trong quá trình phát triển.


Để bật Strict Mode cho toàn bộ ứng dụng, hãy bọc component gốc bằng `<StrictMode>` khi render nó:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Chúng tôi khuyến nghị bọc toàn bộ ứng dụng trong Strict Mode, đặc biệt là với các ứng dụng mới tạo. Nếu bạn sử dụng một framework gọi [`createRoot`](/reference/react-dom/client/createRoot) thay bạn, hãy xem tài liệu của framework đó để biết cách bật Strict Mode.

Mặc dù các kiểm tra của Strict Mode **chỉ chạy trong quá trình phát triển,** chúng giúp bạn tìm ra các lỗi đã tồn tại trong code nhưng có thể khó tái hiện một cách đáng tin cậy trong production. Strict Mode cho phép bạn sửa lỗi trước khi người dùng báo cáo chúng.

<Note>

Strict Mode bật các kiểm tra sau trong quá trình phát triển:

- Các component của bạn sẽ [re-render thêm một lần](#fixing-bugs-found-by-double-rendering-in-development) để tìm các lỗi do việc render không thuần túy gây ra.
- Các component của bạn sẽ [chạy lại Effects thêm một lần](#fixing-bugs-found-by-re-running-effects-in-development) để tìm các lỗi do thiếu cleanup cho Effect gây ra.
- Các component của bạn sẽ [chạy lại các callback của ref thêm một lần](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) để tìm các lỗi do thiếu cleanup cho ref gây ra.
- Các component của bạn sẽ [được kiểm tra việc sử dụng các API đã deprecated.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**Tất cả các kiểm tra này chỉ dành cho quá trình phát triển và không ảnh hưởng đến production build.**

</Note>

---

### Bật Strict Mode cho một phần ứng dụng {/*enabling-strict-mode-for-a-part-of-the-app*/}

Bạn cũng có thể bật Strict Mode cho bất kỳ phần nào trong ứng dụng:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

Trong ví dụ này, các kiểm tra của Strict Mode sẽ không chạy trên các component `Header` và `Footer`. Tuy nhiên, chúng sẽ chạy trên `Sidebar` và `Content`, cũng như tất cả component bên trong chúng, bất kể độ sâu.

<Note>

Khi `StrictMode` được bật cho một phần ứng dụng, React chỉ bật những hành vi có thể xảy ra trong production. Ví dụ: nếu `<StrictMode>` không được bật ở root của ứng dụng, nó sẽ không [chạy lại Effects thêm một lần](#fixing-bugs-found-by-re-running-effects-in-development) trong lần mount đầu tiên, vì điều này sẽ khiến các Effect của component con chạy hai lần mà không có các Effect của component cha, một điều không thể xảy ra trong production.

</Note>

---

### Sửa các lỗi được phát hiện bởi việc double rendering trong quá trình phát triển {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React giả định rằng mọi component bạn viết đều là một pure function.](/learn/keeping-components-pure) Điều này có nghĩa là các React component bạn viết luôn phải trả về cùng một JSX khi nhận cùng các input (props, state và context).

Các component vi phạm quy tắc này sẽ hoạt động không thể đoán trước và gây ra lỗi. Để giúp bạn tìm ra code vô tình không thuần túy, Strict Mode gọi một số function của bạn (chỉ những function đáng lẽ phải thuần túy) **hai lần trong quá trình phát triển.** Điều này bao gồm:

- Thân hàm của component (chỉ logic ở cấp cao nhất, nên không bao gồm code bên trong các event handler)
- Các function mà bạn truyền vào [`useState`](/reference/react/useState), các function [`set` ](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), hoặc [`useReducer`](/reference/react/useReducer)
- Một số method của class component như [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([xem toàn bộ danh sách](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Nếu một function là thuần túy, việc chạy nó hai lần không làm thay đổi hành vi vì một pure function luôn tạo ra cùng một kết quả. Tuy nhiên, nếu một function không thuần túy (ví dụ: function thay đổi dữ liệu mà nó nhận), việc chạy nó hai lần thường sẽ dễ nhận thấy (đó chính là điều khiến nó không thuần túy!) Điều này giúp bạn sớm phát hiện và sửa lỗi.

**Đây là một ví dụ minh họa cách double rendering trong Strict Mode giúp bạn sớm tìm ra lỗi.**

Component `StoryTray` này nhận một mảng `stories` và thêm một mục "Create Story" ở cuối:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Đoạn code trên có một lỗi. Tuy nhiên, lỗi này rất dễ bị bỏ qua vì output ban đầu có vẻ đúng.

Lỗi này sẽ dễ nhận thấy hơn nếu component `StoryTray` re-render nhiều lần. Ví dụ, hãy để `StoryTray` re-render với màu nền khác mỗi khi bạn di chuột qua nó:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Hãy chú ý rằng mỗi khi bạn di chuột qua component `StoryTray`, "Create Story" lại được thêm vào danh sách một lần nữa. Ý định của code là chỉ thêm nó một lần ở cuối. Nhưng `StoryTray` trực tiếp sửa đổi mảng `stories` từ props. Mỗi lần `StoryTray` render, nó lại thêm "Create Story" vào cuối cùng một mảng đó. Nói cách khác, `StoryTray` không phải là một pure function—việc chạy nó nhiều lần tạo ra các kết quả khác nhau.

Để sửa vấn đề này, bạn có thể tạo một bản sao của mảng và sửa đổi bản sao đó thay vì mảng ban đầu:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Sao chép mảng
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

Điều này sẽ [giúp function `StoryTray` trở thành một pure function.](/learn/keeping-components-pure) Mỗi lần được gọi, function này chỉ sửa đổi một bản sao mới của mảng và không ảnh hưởng đến bất kỳ object hoặc biến bên ngoài nào. Cách này giải quyết lỗi, nhưng bạn phải khiến component re-render thường xuyên hơn thì lỗi trong hành vi của nó mới trở nên rõ ràng.

**Trong ví dụ ban đầu, lỗi không dễ nhận thấy. Bây giờ hãy bọc code ban đầu (có lỗi) trong `<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Mode *luôn* gọi function render của bạn hai lần, vì vậy bạn có thể thấy lỗi ngay lập tức** ("Create Story" xuất hiện hai lần). Điều này giúp bạn sớm nhận ra những lỗi như vậy trong quá trình phát triển. Khi sửa component để render trong Strict Mode, bạn cũng *đồng thời* sửa được nhiều lỗi production có thể xảy ra trong tương lai, chẳng hạn như chức năng hover ở trên:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Sao chép mảng
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Nếu không có Strict Mode, bạn rất dễ bỏ qua lỗi cho đến khi thêm nhiều lần re-render hơn. Strict Mode khiến cùng lỗi đó xuất hiện ngay lập tức. Strict Mode giúp bạn tìm ra lỗi trước khi push chúng cho team và người dùng.

[Đọc thêm về cách giữ cho component thuần túy.](/learn/keeping-components-pure)

<Note>

Nếu bạn đã cài đặt [React DevTools](/learn/react-developer-tools), mọi lệnh gọi `console.log` trong lần render thứ hai sẽ hiển thị hơi mờ. React DevTools cũng cung cấp một tùy chọn (mặc định tắt) để hoàn toàn loại bỏ chúng.

</Note>

---

### Sửa các lỗi được phát hiện khi chạy lại Effects trong môi trường development {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode cũng có thể giúp tìm các lỗi trong [Effects.](/learn/synchronizing-with-effects)

Mỗi Effect đều có một số mã setup và có thể có một số mã cleanup. Thông thường, React gọi setup khi component *mount* (được thêm vào màn hình) và gọi cleanup khi component *unmount* (bị xóa khỏi màn hình). Sau đó, React gọi cleanup rồi setup lại nếu các dependencies của nó đã thay đổi kể từ lần render trước.

Khi Strict Mode được bật, React cũng sẽ **chạy thêm một chu kỳ setup+cleanup trong môi trường development cho mỗi Effect.** Điều này có thể khiến bạn bất ngờ, nhưng nó giúp phát hiện những lỗi tinh vi khó có thể bắt được bằng cách kiểm tra thủ công.

**Dưới đây là một ví dụ minh họa cách việc chạy lại Effects trong Strict Mode giúp bạn phát hiện lỗi sớm.**

Hãy xem xét ví dụ kết nối một component với một chat sau đây:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Đoạn code này có một vấn đề, nhưng có thể bạn sẽ không nhận ra ngay.

Để vấn đề rõ ràng hơn, hãy triển khai một tính năng. Trong ví dụ bên dưới, `roomId` không được hardcode. Thay vào đó, người dùng có thể chọn `roomId` mà họ muốn kết nối từ một dropdown. Hãy nhấp vào "Open chat", sau đó lần lượt chọn các phòng chat khác nhau. Theo dõi số lượng kết nối đang hoạt động trong console:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bạn sẽ nhận thấy số lượng kết nối đang mở luôn tăng lên. Trong một ứng dụng thực tế, điều này sẽ gây ra các vấn đề về hiệu năng và mạng. Vấn đề là [Effect của bạn đang thiếu một hàm cleanup:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Giờ đây, khi Effect của bạn đã tự "cleanup" và hủy các kết nối đã lỗi thời, sự rò rỉ đã được giải quyết. Tuy nhiên, hãy lưu ý rằng vấn đề chỉ trở nên rõ ràng sau khi bạn thêm nhiều tính năng hơn (hộp chọn).

**Trong ví dụ ban đầu, lỗi không rõ ràng. Bây giờ hãy bọc đoạn code (có lỗi) ban đầu trong `<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Với Strict Mode, bạn sẽ ngay lập tức thấy có vấn đề** (số lượng kết nối đang hoạt động tăng lên 2). Strict Mode chạy thêm một chu kỳ setup+cleanup cho mỗi Effect. Effect này không có logic cleanup, nên nó tạo thêm một kết nối nhưng không hủy kết nối đó. Đây là dấu hiệu cho thấy bạn đang thiếu một hàm cleanup.

Strict Mode giúp bạn sớm nhận ra những sai sót như vậy trong quá trình phát triển. Khi sửa Effect bằng cách thêm một hàm cleanup trong Strict Mode, bạn *đồng thời* cũng sửa được nhiều lỗi có thể xảy ra trong tương lai ở môi trường production, chẳng hạn như lỗi với hộp chọn ở trên:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Hãy chú ý rằng số lượng kết nối đang hoạt động trong console không còn tiếp tục tăng nữa.

Nếu không có Strict Mode, bạn rất dễ bỏ sót việc Effect cần cleanup. Bằng cách chạy *setup → cleanup → setup* thay vì chỉ *setup* cho Effect trong môi trường development, Strict Mode khiến logic cleanup bị thiếu trở nên dễ nhận thấy hơn.

[Đọc thêm về cách triển khai cleanup cho Effect.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---
### Sửa các lỗi được phát hiện khi chạy lại ref callbacks trong môi trường development {/*fixing-bugs-found-by-re-running-ref-callbacks-in-development*/}

Strict Mode cũng có thể giúp tìm các lỗi trong [callbacks ref.](/learn/manipulating-the-dom-with-refs)

Mỗi callback `ref` đều có một số mã setup và có thể có một số mã cleanup. Thông thường, React gọi setup khi phần tử được *tạo* (được thêm vào DOM) và gọi cleanup khi phần tử bị *xóa* (bị xóa khỏi DOM).

Khi Strict Mode được bật, React cũng sẽ **chạy thêm một chu kỳ setup+cleanup trong môi trường development cho mỗi callback `ref`.** Điều này có thể khiến bạn bất ngờ, nhưng nó giúp phát hiện những lỗi tinh vi khó có thể bắt được bằng cách kiểm tra thủ công.

Hãy xem xét ví dụ cho phép bạn chọn một loài động vật rồi cuộn đến một trong số chúng. Hãy chú ý rằng khi chuyển từ "Cats" sang "Dogs", các log trong console cho thấy số lượng động vật trong danh sách tiếp tục tăng, còn các nút "Scroll to" ngừng hoạt động:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ Not using StrictMode.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>


**Đây là một lỗi trong production!** Vì callback ref không xóa các động vật khỏi danh sách trong quá trình cleanup, danh sách động vật tiếp tục tăng. Đây là một memory leak có thể gây ra các vấn đề về hiệu năng trong ứng dụng thực tế và làm hỏng hành vi của ứng dụng.

Vấn đề là callback ref không tự cleanup:

```js {6-8}
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    }
  }}
</li>
```

Bây giờ hãy bọc đoạn code (có lỗi) ban đầu trong `<StrictMode>`:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

**Với Strict Mode, bạn sẽ ngay lập tức thấy có vấn đề**. Strict Mode chạy thêm một chu kỳ setup+cleanup cho mỗi callback ref. Callback ref này không có logic cleanup, nên nó thêm các ref nhưng không xóa chúng. Đây là dấu hiệu cho thấy bạn đang thiếu một hàm cleanup.

Strict Mode giúp bạn chủ động phát hiện các sai sót trong callback ref. Khi sửa callback bằng cách thêm một hàm cleanup trong Strict Mode, bạn *đồng thời* cũng sửa được nhiều lỗi có thể xảy ra trong tương lai ở môi trường production, chẳng hạn như lỗi "Scroll to" ở trên:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  list.splice(list.indexOf(item), 1);
                  console.log(`❌ Removing cat from the map. Total cats: ${itemsRef.current.length}`);
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

Giờ đây, trong lần mount ban đầu ở StrictMode, các callback ref đều được setup, cleanup rồi setup lại:

```
...
✅ Adding animal to the map. Total animals: 10
...
❌ Removing animal from the map. Total animals: 0
...
✅ Adding animal to the map. Total animals: 10
```

**Đây là hành vi được mong đợi.** Strict Mode xác nhận rằng các callback ref được cleanup đúng cách, vì vậy kích thước không bao giờ tăng vượt quá mức dự kiến. Sau khi sửa, không còn memory leak nào và mọi tính năng đều hoạt động như mong đợi.

Nếu không có Strict Mode, bạn rất dễ bỏ sót lỗi cho đến khi nhấp thử các phần khác nhau trong ứng dụng và nhận ra các tính năng bị hỏng. Strict Mode khiến lỗi xuất hiện ngay lập tức, trước khi bạn đưa chúng lên production.

---
### Sửa các cảnh báo deprecated được bật bởi Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React sẽ cảnh báo nếu bất kỳ component nào bên trong một cây `<StrictMode>` sử dụng một trong các API deprecated sau:

* Các phương thức lifecycle của class `UNSAFE_` như [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Xem các phương án thay thế.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)

Các API này chủ yếu được sử dụng trong các [class component](/reference/react/Component) cũ, vì vậy chúng hiếm khi xuất hiện trong các ứng dụng hiện đại.
