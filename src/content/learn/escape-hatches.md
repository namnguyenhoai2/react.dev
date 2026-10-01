---
title: Các lối thoát
---

<Intro>

Một số component của bạn có thể cần điều khiển và đồng bộ hóa với các hệ thống bên ngoài React. Ví dụ: bạn có thể cần focus một input bằng browser API, phát và tạm dừng một trình phát video được triển khai mà không dùng React, hoặc kết nối và lắng nghe các message từ một remote server. Trong chương này, bạn sẽ tìm hiểu các lối thoát cho phép bạn “bước ra ngoài” React và kết nối với các hệ thống bên ngoài. Phần lớn logic và luồng dữ liệu của ứng dụng không nên phụ thuộc vào những tính năng này.

</Intro>

<YouWillLearn isChapter={true}>

* [Cách “ghi nhớ” thông tin mà không re-render](/learn/referencing-values-with-refs)
* [Cách truy cập các phần tử DOM do React quản lý](/learn/manipulating-the-dom-with-refs)
* [Cách đồng bộ hóa component với các hệ thống bên ngoài](/learn/synchronizing-with-effects)
* [Cách loại bỏ các Effect không cần thiết khỏi component](/learn/you-might-not-need-an-effect)
* [Vòng đời của Effect khác với vòng đời của component như thế nào](/learn/lifecycle-of-reactive-effects)
* [Cách ngăn một số giá trị kích hoạt lại Effect](/learn/separating-events-from-effects)
* [Cách khiến Effect chạy lại ít thường xuyên hơn](/learn/removing-effect-dependencies)
* [Cách chia sẻ logic giữa các component](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Tham chiếu các giá trị bằng ref {/*referencing-values-with-refs*/}

Khi muốn một component “ghi nhớ” một số thông tin nhưng không muốn thông tin đó [kích hoạt các lần render mới](/learn/render-and-commit), bạn có thể dùng một *ref*:

```js
const ref = useRef(0);
```

Giống như state, ref được React giữ lại giữa các lần re-render. Tuy nhiên, việc thiết lập state sẽ khiến component re-render. Thay đổi ref thì không! Bạn có thể truy cập giá trị hiện tại của ref thông qua thuộc tính `ref.current`.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

Ref giống như một chiếc túi bí mật của component mà React không theo dõi. Ví dụ, bạn có thể dùng ref để lưu trữ [ID timeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [phần tử DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element), và các object khác không ảnh hưởng đến kết quả render của component.

<LearnMore path="/learn/referencing-values-with-refs">

Đọc **[Tham chiếu các giá trị bằng Ref](/learn/referencing-values-with-refs)** để tìm hiểu cách dùng ref nhằm ghi nhớ thông tin.

</LearnMore>

## Thao tác với DOM bằng ref {/*manipulating-the-dom-with-refs*/}

React tự động cập nhật DOM để khớp với kết quả render của bạn, vì vậy component của bạn thường không cần thao tác với DOM. Tuy nhiên, đôi khi bạn có thể cần truy cập các phần tử DOM do React quản lý—chẳng hạn để focus một node, cuộn đến node đó, hoặc đo kích thước và vị trí của nó. React không có cách tích hợp sẵn để thực hiện những việc này, vì vậy bạn sẽ cần một ref trỏ đến node DOM. Ví dụ, khi nhấp vào button, input sẽ được focus bằng ref:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Đọc **[Thao tác với DOM bằng Ref](/learn/manipulating-the-dom-with-refs)** để tìm hiểu cách truy cập các phần tử DOM do React quản lý.

</LearnMore>

## Đồng bộ hóa bằng Effect {/*synchronizing-with-effects*/}

Một số component cần đồng bộ hóa với các hệ thống bên ngoài. Ví dụ: bạn có thể muốn điều khiển một component không dùng React dựa trên state của React, thiết lập kết nối đến server, hoặc gửi log phân tích khi một component xuất hiện trên màn hình. Không giống event handler, vốn cho phép bạn xử lý các sự kiện cụ thể, *Effect* cho phép bạn chạy một đoạn code sau khi render. Hãy dùng chúng để đồng bộ hóa component với một hệ thống bên ngoài React.

Nhấn Play/Pause vài lần và xem trình phát video vẫn được đồng bộ hóa với giá trị prop `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Nhiều Effect cũng tự “dọn dẹp” sau khi chạy. Ví dụ, một Effect thiết lập kết nối đến chat server nên trả về một *cleanup function* cho React biết cách ngắt kết nối component khỏi server đó:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Trong môi trường development, React sẽ chạy và dọn dẹp Effect của bạn thêm một lần ngay lập tức. Đây là lý do bạn thấy `"✅ Connecting..."` được in ra hai lần. Điều này đảm bảo bạn không quên triển khai cleanup function.

<LearnMore path="/learn/synchronizing-with-effects">

Đọc **[Đồng bộ hóa bằng Effect](/learn/synchronizing-with-effects)** để tìm hiểu cách đồng bộ hóa component với các hệ thống bên ngoài.

</LearnMore>

## Có thể bạn không cần Effect {/*you-might-not-need-an-effect*/}

Effect là một lối thoát khỏi mô hình React. Chúng cho phép bạn “bước ra ngoài” React và đồng bộ hóa component với một hệ thống bên ngoài. Nếu không có hệ thống bên ngoài nào liên quan (ví dụ: nếu bạn muốn cập nhật state của component khi một prop hoặc state nào đó thay đổi), bạn không cần Effect. Loại bỏ các Effect không cần thiết sẽ giúp code dễ theo dõi hơn, chạy nhanh hơn và ít phát sinh lỗi hơn.

Có hai trường hợp phổ biến mà bạn không cần Effect:
- **Bạn không cần Effect để biến đổi dữ liệu phục vụ việc render.**
- **Bạn không cần Effect để xử lý các sự kiện của người dùng.**

Ví dụ, bạn không cần Effect để điều chỉnh một state dựa trên state khác:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Tránh: state dư thừa và Effect không cần thiết
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Thay vào đó, hãy tính toán nhiều nhất có thể trong quá trình render:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Tốt: tính toán trong khi render
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Tuy nhiên, bạn *cần* Effect để đồng bộ hóa với các hệ thống bên ngoài.

<LearnMore path="/learn/you-might-not-need-an-effect">

Đọc **[Có thể bạn không cần Effect](/learn/you-might-not-need-an-effect)** để tìm hiểu cách loại bỏ các Effect không cần thiết.

</LearnMore>

## Vòng đời của reactive effect {/*lifecycle-of-reactive-effects*/}

Effect có vòng đời khác với component. Component có thể mount, update hoặc unmount. Một Effect chỉ có thể làm hai việc: bắt đầu đồng bộ hóa một thứ gì đó, rồi sau đó dừng đồng bộ hóa nó. Chu kỳ này có thể xảy ra nhiều lần nếu Effect của bạn phụ thuộc vào các prop và state thay đổi theo thời gian.

Effect này phụ thuộc vào giá trị của prop `roomId`. Prop là các *giá trị reactive,* nghĩa là chúng có thể thay đổi sau một lần re-render. Hãy chú ý rằng Effect sẽ *đồng bộ hóa lại* (và kết nối lại với server) nếu `roomId` thay đổi:

<Sandpack>

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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React cung cấp một quy tắc linter để kiểm tra xem bạn đã chỉ định đúng các dependency của Effect hay chưa. Nếu bạn quên chỉ định `roomId` trong danh sách dependency ở ví dụ trên, linter sẽ tự động phát hiện lỗi đó.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Đọc **[Vòng đời của các sự kiện reactive](/learn/lifecycle-of-reactive-effects)** để tìm hiểu vòng đời của Effect khác với vòng đời của component như thế nào.

</LearnMore>

## Tách event khỏi Effect {/*separating-events-from-effects*/}

Event handler chỉ chạy lại khi bạn thực hiện lại cùng một tương tác. Không giống event handler, Effect sẽ đồng bộ hóa lại nếu bất kỳ giá trị nào mà chúng đọc, chẳng hạn prop hoặc state, khác với lần render trước. Đôi khi, bạn muốn kết hợp cả hai hành vi: một Effect chạy lại để phản hồi một số giá trị nhưng không phản hồi các giá trị khác.

Mọi code bên trong Effect đều mang tính *reactive.* Code sẽ chạy lại nếu một giá trị reactive mà nó đọc đã thay đổi do re-render. Ví dụ, Effect này sẽ kết nối lại với chat nếu `roomId` hoặc `theme` thay đổi:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Điều này không lý tưởng. Bạn chỉ muốn kết nối lại với chat khi `roomId` thay đổi. Việc chuyển `theme` không nên khiến chat kết nối lại! Hãy chuyển code đọc `theme` ra khỏi Effect vào một *Effect Event*:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Code bên trong Effect Event không mang tính reactive, vì vậy việc thay đổi `theme` sẽ không còn khiến Effect kết nối lại.

<LearnMore path="/learn/separating-events-from-effects">

Đọc **[Tách Event khỏi Effect](/learn/separating-events-from-effects)** để tìm hiểu cách ngăn một số giá trị kích hoạt lại Effect.

</LearnMore>

## Loại bỏ dependency của Effect {/*removing-effect-dependencies*/}

Khi viết một Effect, linter sẽ kiểm tra xem bạn đã đưa mọi giá trị reactive (chẳng hạn prop và state) mà Effect đọc vào danh sách dependency của Effect hay chưa. Điều này đảm bảo Effect luôn được đồng bộ với prop và state mới nhất của component. Các dependency không cần thiết có thể khiến Effect chạy quá thường xuyên, thậm chí tạo ra vòng lặp vô hạn. Cách loại bỏ chúng phụ thuộc vào từng trường hợp.

Ví dụ: Effect này phụ thuộc vào đối tượng `options`, đối tượng này được tạo lại mỗi khi bạn chỉnh sửa input:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bạn không muốn chat kết nối lại mỗi khi bạn bắt đầu nhập tin nhắn trong chat đó. Để khắc phục vấn đề này, hãy chuyển việc tạo đối tượng `options` vào bên trong Effect để Effect chỉ phụ thuộc vào chuỗi `roomId`:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Lưu ý rằng bạn không bắt đầu bằng cách chỉnh sửa danh sách dependency để xóa dependency `options`. Làm vậy sẽ không đúng. Thay vào đó, bạn đã thay đổi phần code xung quanh để dependency trở nên *không cần thiết.* Hãy coi danh sách dependency là danh sách tất cả các giá trị reactive được code trong Effect sử dụng. Bạn không chủ động chọn những gì cần đưa vào danh sách đó. Danh sách này mô tả code của bạn. Để thay đổi danh sách dependency, hãy thay đổi code.

<LearnMore path="/learn/removing-effect-dependencies">

Đọc **[Removing Effect Dependencies](/learn/removing-effect-dependencies)** để tìm hiểu cách khiến Effect chạy lại ít thường xuyên hơn.

</LearnMore>

## Tái sử dụng logic với custom Hooks {/*reusing-logic-with-custom-hooks*/}

React đi kèm các Hooks tích hợp sẵn như `useState`, `useContext` và `useEffect`. Đôi khi, bạn sẽ mong có một Hook cho một mục đích cụ thể hơn: chẳng hạn như fetch dữ liệu, theo dõi xem người dùng có online hay không, hoặc kết nối với một chat room. Để làm điều này, bạn có thể tạo các Hooks của riêng mình cho nhu cầu của ứng dụng.

Trong ví dụ này, custom Hook `usePointerPosition` theo dõi vị trí con trỏ, còn custom Hook `useDelayedValue` trả về một giá trị "chậm hơn" giá trị bạn truyền vào một khoảng thời gian nhất định tính bằng mili giây. Di chuyển con trỏ qua khu vực xem trước của sandbox để thấy một vệt chấm chuyển động bám theo con trỏ:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Bạn có thể tạo các custom Hooks, kết hợp chúng với nhau, truyền dữ liệu giữa chúng và tái sử dụng chúng giữa các component. Khi ứng dụng phát triển, bạn sẽ phải tự viết ít Effect hơn vì có thể tái sử dụng các custom Hooks đã viết trước đó. Cộng đồng React cũng duy trì nhiều custom Hooks chất lượng.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Đọc **[Reusing Logic with Custom Hooks](/learn/reusing-logic-with-custom-hooks)** để tìm hiểu cách chia sẻ logic giữa các component.

</LearnMore>

## Tiếp theo là gì? {/*whats-next*/}

Hãy chuyển đến [Referencing Values with Refs](/learn/referencing-values-with-refs) để bắt đầu đọc từng trang của chương này!
