---
title: 'Tách Event khỏi Effect'
---

<Intro>

Event handler chỉ chạy lại khi bạn thực hiện lại cùng một tương tác. Không giống event handler, Effect sẽ đồng bộ hóa lại nếu một giá trị mà nó đọc, chẳng hạn như prop hoặc biến state, khác với giá trị trong lần render trước. Đôi khi, bạn cũng muốn kết hợp cả hai hành vi: một Effect chạy lại để phản hồi một số giá trị nhưng không phản hồi các giá trị khác. Trang này sẽ hướng dẫn bạn cách thực hiện điều đó.

</Intro>

<YouWillLearn>

- Cách lựa chọn giữa event handler và Effect
- Vì sao Effect có tính phản ứng, còn event handler thì không
- Cần làm gì khi bạn muốn một phần code trong Effect không có tính phản ứng
- Effect Event là gì và cách tách chúng khỏi Effect
- Cách đọc prop và state mới nhất từ Effect bằng Effect Event

</YouWillLearn>

## Lựa chọn giữa event handler và Effect {/*choosing-between-event-handlers-and-effects*/}

Trước tiên, hãy cùng ôn lại sự khác nhau giữa event handler và Effect.

Hãy tưởng tượng bạn đang triển khai một component phòng trò chuyện. Các yêu cầu của bạn như sau:

1. Component của bạn phải tự động kết nối với phòng trò chuyện đã chọn.
1. Khi bạn nhấp vào nút "Send", component phải gửi một tin nhắn đến phòng trò chuyện.

Giả sử bạn đã triển khai code cho các yêu cầu này nhưng chưa chắc nên đặt chúng ở đâu. Bạn nên sử dụng event handler hay Effect? Mỗi khi cần trả lời câu hỏi này, hãy cân nhắc [*vì sao* code cần chạy.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Event handler chạy để phản hồi các tương tác cụ thể {/*event-handlers-run-in-response-to-specific-interactions*/}

Từ góc nhìn của người dùng, việc gửi tin nhắn phải xảy ra *vì* họ đã nhấp vào đúng nút "Send". Người dùng sẽ khá khó chịu nếu bạn gửi tin nhắn của họ vào bất kỳ thời điểm nào khác hoặc vì bất kỳ lý do nào khác. Vì vậy, việc gửi tin nhắn nên được xử lý bằng event handler. Event handler cho phép bạn xử lý các tương tác cụ thể:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

Với event handler, bạn có thể chắc chắn rằng `sendMessage(message)` sẽ *chỉ* chạy khi người dùng nhấn nút.

### Effect chạy bất cứ khi nào cần đồng bộ hóa {/*effects-run-whenever-synchronization-is-needed*/}

Hãy nhớ rằng bạn cũng cần duy trì kết nối của component với phòng trò chuyện. Code đó nên được đặt ở đâu?

*lý do* chạy code này không phải là một tương tác cụ thể nào đó. Người dùng điều hướng đến màn hình phòng trò chuyện vì lý do gì hay bằng cách nào không quan trọng. Giờ đây, khi họ đang xem màn hình đó và có thể tương tác với nó, component cần duy trì kết nối với chat server đã chọn. Ngay cả khi phòng trò chuyện là màn hình ban đầu của app và người dùng chưa thực hiện bất kỳ tương tác nào, bạn *vẫn* cần kết nối. Đây là lý do nó là một Effect:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Với code này, bạn có thể chắc chắn rằng luôn có một kết nối đang hoạt động đến chat server hiện được chọn, *bất kể* người dùng đã thực hiện những tương tác cụ thể nào. Dù người dùng chỉ mới mở app, chọn một phòng khác, hay điều hướng đến màn hình khác rồi quay lại, Effect của bạn vẫn đảm bảo component sẽ [kết nối lại bất cứ khi nào cần thiết.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
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
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

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
input, select { margin-right: 20px; }
```

</Sandpack>

## Giá trị có tính phản ứng và logic có tính phản ứng {/*reactive-values-and-reactive-logic*/}

Theo trực giác, bạn có thể nói rằng event handler luôn được kích hoạt "thủ công", chẳng hạn bằng cách nhấp vào một nút. Mặt khác, Effect là "tự động": chúng chạy và chạy lại thường xuyên đến mức cần thiết để duy trì đồng bộ.

Có một cách chính xác hơn để suy nghĩ về điều này.

Props, state và các biến được khai báo bên trong body của component được gọi là <CodeStep step={2}>giá trị có tính phản ứng</CodeStep>. Trong ví dụ này, `serverUrl` không phải là một giá trị có tính phản ứng, nhưng `roomId` và `message` thì có. Chúng tham gia vào data flow của quá trình render:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Các giá trị có tính phản ứng như vậy có thể thay đổi do một lần re-render. Ví dụ, người dùng có thể chỉnh sửa `message` hoặc chọn một `roomId` khác trong dropdown. Event handler và Effect phản hồi các thay đổi theo những cách khác nhau:

- **Logic bên trong event handler *không có tính phản ứng*.** Logic này sẽ không chạy lại trừ khi người dùng thực hiện lại cùng một tương tác (ví dụ: một lần nhấp). Event handler có thể đọc các giá trị có tính phản ứng mà không "phản ứng" với những thay đổi của chúng.
- **Logic bên trong Effect *có tính phản ứng*.** Nếu Effect đọc một giá trị có tính phản ứng, [bạn phải chỉ định giá trị đó là một dependency.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Sau đó, nếu một lần re-render khiến giá trị đó thay đổi, React sẽ chạy lại logic của Effect với giá trị mới.

Hãy xem lại ví dụ trước để minh họa sự khác biệt này.

### Logic bên trong event handler không có tính phản ứng {/*logic-inside-event-handlers-is-not-reactive*/}

Hãy xem dòng code này. Logic này nên có tính phản ứng hay không?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Từ góc nhìn của người dùng, **việc `message` thay đổi _không_ có nghĩa là họ muốn gửi tin nhắn.** Điều đó chỉ có nghĩa là người dùng đang nhập. Nói cách khác, logic gửi tin nhắn không nên có tính phản ứng. Logic này không nên chạy lại chỉ vì <CodeStep step={2}>giá trị có tính phản ứng</CodeStep> đã thay đổi. Vì vậy, nó thuộc về event handler:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Event handler không có tính phản ứng, vì vậy `sendMessage(message)` sẽ chỉ chạy khi người dùng nhấp vào nút Send.

### Logic bên trong Effect có tính phản ứng {/*logic-inside-effects-is-reactive*/}

Bây giờ hãy quay lại các dòng này:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Từ góc nhìn của người dùng, **việc `roomId` thay đổi *có* nghĩa là họ muốn kết nối đến một phòng khác.** Nói cách khác, logic kết nối đến phòng nên có tính phản ứng. Bạn *muốn* các dòng code này "bắt kịp" với <CodeStep step={2}>giá trị có tính phản ứng</CodeStep>, và chạy lại nếu giá trị đó khác đi. Vì vậy, nó thuộc về một Effect:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Effect có tính phản ứng, vì vậy `createConnection(serverUrl, roomId)` và `connection.connect()` sẽ chạy với mọi giá trị riêng biệt của `roomId`. Effect của bạn giữ cho kết nối trò chuyện được đồng bộ với phòng hiện đang được chọn.

## Tách logic không có tính phản ứng khỏi Effect {/*extracting-non-reactive-logic-out-of-effects*/}

Mọi thứ trở nên phức tạp hơn khi bạn muốn kết hợp logic có tính phản ứng với logic không có tính phản ứng.

Ví dụ, hãy tưởng tượng bạn muốn hiển thị một thông báo khi người dùng kết nối với phòng trò chuyện. Bạn đọc theme hiện tại (tối hoặc sáng) từ props để có thể hiển thị thông báo với màu phù hợp:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

Tuy nhiên, `theme` là một giá trị có tính phản ứng (nó có thể thay đổi do re-render), và [mọi giá trị có tính phản ứng được Effect đọc đều phải được khai báo là dependency của nó.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Bây giờ bạn phải chỉ định `theme` là một dependency của Effect:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Hãy thử tương tác với ví dụ này và xem bạn có nhận ra vấn đề trong trải nghiệm người dùng này không:

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

Khi `roomId` thay đổi, chat sẽ kết nối lại như bạn mong đợi. Nhưng vì `theme` cũng là một dependency, chat *cũng* sẽ kết nối lại mỗi khi bạn chuyển đổi giữa theme tối và theme sáng. Điều đó không tốt!

Nói cách khác, bạn *không* muốn dòng này có tính phản ứng, dù nó nằm bên trong một Effect (vốn có tính phản ứng):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Bạn cần một cách để tách logic không có tính phản ứng này khỏi Effect có tính phản ứng bao quanh nó.

### Khai báo một Effect Event {/*declaring-an-effect-event*/}

Sử dụng một Hook đặc biệt có tên là [`useEffectEvent`](/reference/react/useEffectEvent) để tách logic không có tính phản ứng này khỏi Effect:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

Ở đây, `onConnected` được gọi là một *Effect Event.* Nó là một phần trong logic của Effect, nhưng hoạt động giống event handler hơn nhiều. Logic bên trong nó không có tính phản ứng và luôn "nhìn thấy" các giá trị mới nhất của props và state.

Bây giờ bạn có thể gọi `onConnected` Effect Event từ bên trong Effect:

```js {2-4,9,13}
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
  }, [roomId]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Điều này giải quyết vấn đề. Lưu ý rằng bạn phải *xóa* `theme` khỏi danh sách dependency của Effect, vì nó không còn được sử dụng trong Effect nữa. Bạn cũng không cần *thêm* `onConnected` vào đó, vì **Effect Event không có tính phản ứng và phải được loại khỏi danh sách dependency.**

Hãy xác minh rằng hành vi mới hoạt động như bạn mong đợi:

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

Bạn có thể hình dung Effect Event rất giống với event handler. Điểm khác biệt chính là event handler chạy để phản hồi các tương tác của người dùng, còn Effect Event được bạn kích hoạt từ bên trong Effect. Effect Event cho phép bạn "ngắt chuỗi" giữa tính phản ứng của Effect và code không nên có tính phản ứng.

### Đọc props và state mới nhất bằng Effect Event {/*reading-latest-props-and-state-with-effect-events*/}

Effect Event giúp bạn khắc phục nhiều pattern mà bạn có thể muốn bỏ qua dependency linter.

Ví dụ, giả sử bạn có một Effect để ghi log những lần truy cập trang:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Sau đó, bạn thêm nhiều route vào site của mình. Lúc này, component `Page` nhận một prop `url` chứa path hiện tại. Bạn muốn truyền `url` như một phần của lời gọi `logVisit`, nhưng dependency linter phàn nàn:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 Hook useEffect của React thiếu dependency: 'url'
  // ...
}
```

Hãy nghĩ về điều bạn muốn đoạn code thực hiện. Bạn *muốn* ghi lại một lượt truy cập riêng cho các URL khác nhau, vì mỗi URL đại diện cho một trang khác nhau. Nói cách khác, lời gọi `logVisit` này *nên* reactive đối với `url`. Vì vậy, trong trường hợp này, việc làm theo dependency linter và thêm `url` làm dependency là hợp lý:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Đã khai báo tất cả dependency
  // ...
}
```

Bây giờ, giả sử bạn muốn đưa số lượng sản phẩm trong giỏ hàng vào cùng với mỗi lượt truy cập trang:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 Hook useEffect của React thiếu dependency: 'numberOfItems'
  // ...
}
```

Bạn đã sử dụng `numberOfItems` bên trong Effect, nên linter yêu cầu bạn thêm nó làm dependency. Tuy nhiên, bạn *không muốn* lời gọi `logVisit` reactive đối với `numberOfItems`. Nếu người dùng thêm thứ gì đó vào giỏ hàng và `numberOfItems` thay đổi, điều đó *không có nghĩa* là người dùng đã truy cập trang một lần nữa. Nói cách khác, *việc truy cập trang* theo một nghĩa nào đó là một “event”. Nó xảy ra tại một thời điểm cụ thể.

Hãy tách code thành hai phần:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Đã khai báo tất cả dependency
  // ...
}
```

Ở đây, `onVisit` là một Effect Event. Code bên trong nó không reactive. Vì vậy, bạn có thể sử dụng `numberOfItems` (hoặc bất kỳ giá trị reactive nào khác!) mà không phải lo rằng nó sẽ khiến code bao quanh chạy lại khi có thay đổi.

Mặt khác, bản thân Effect vẫn reactive. Code bên trong Effect sử dụng prop `url`, vì vậy Effect sẽ chạy lại sau mỗi lần re-render với `url` khác. Đổi lại, việc này sẽ gọi Effect Event `onVisit`.

Kết quả là, bạn sẽ gọi `logVisit` cho mỗi thay đổi đối với `url`, đồng thời luôn đọc `numberOfItems` mới nhất. Tuy nhiên, nếu `numberOfItems` tự thay đổi, điều đó sẽ không khiến bất kỳ code nào chạy lại.

<Note>

Có thể bạn đang tự hỏi liệu có thể gọi `onVisit()` mà không truyền đối số nào, rồi đọc `url` bên trong nó hay không:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Cách này sẽ hoạt động, nhưng tốt hơn là truyền `url` này một cách rõ ràng cho Effect Event. **Bằng cách truyền `url` làm đối số cho Effect Event, bạn đang nói rằng việc truy cập một trang có `url` khác sẽ tạo thành một “event” riêng biệt theo góc nhìn của người dùng.** `visitedUrl` là một *phần* của “event” đã xảy ra:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Vì Effect Event của bạn “yêu cầu” `visitedUrl` một cách rõ ràng, giờ đây bạn không thể vô tình xóa `url` khỏi dependencies của Effect. Nếu xóa dependency `url` (khiến các lượt truy cập trang riêng biệt bị tính là một), linter sẽ cảnh báo bạn. Bạn muốn `onVisit` reactive đối với `url`, nên thay vì đọc `url` bên trong (nơi nó sẽ không reactive), bạn truyền nó *từ* Effect.

Điều này đặc biệt quan trọng nếu bên trong Effect có logic bất đồng bộ:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Trì hoãn việc ghi log lượt truy cập
  }, [url]);
```

Ở đây, `url` bên trong `onVisit` tương ứng với `url` mới nhất (có thể đã thay đổi), còn `visitedUrl` tương ứng với `url` đã khởi tạo Effect này (và lời gọi `onVisit` này).

</Note>

<DeepDive>

#### Có nên suppress dependency linter thay thế không? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

Trong các codebase hiện có, đôi khi bạn có thể thấy lint rule bị suppress như sau:

```js {expectedErrors: {'react-compiler': [8]}} {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Tránh vô hiệu hóa linter theo cách này:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

Chúng tôi khuyến nghị **không bao giờ suppress linter**.

Nhược điểm đầu tiên của việc suppress rule là React sẽ không còn cảnh báo bạn khi Effect cần “react” với một reactive dependency mới mà bạn đã thêm vào code. Trong ví dụ trước, bạn đã thêm `url` vào dependencies *vì* React nhắc bạn làm vậy. Nếu tắt linter, bạn sẽ không còn nhận được những lời nhắc như vậy cho bất kỳ chỉnh sửa nào trong tương lai đối với Effect đó. Điều này dẫn đến bug.

Dưới đây là một ví dụ về một bug khó hiểu do suppress linter gây ra. Trong ví dụ này, hàm `handleMove` được cho là sẽ đọc giá trị hiện tại của state variable `canMove` để quyết định liệu dấu chấm có đi theo con trỏ hay không. Tuy nhiên, `canMove` luôn là `true` bên trong `handleMove`.

Bạn có thấy tại sao không?

<Sandpack>

```js {expectedErrors: {'react-compiler': [16]}}
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Vấn đề của code này nằm ở việc suppress dependency linter. Nếu xóa phần suppress, bạn sẽ thấy Effect này nên phụ thuộc vào hàm `handleMove`. Điều này hợp lý: `handleMove` được khai báo bên trong phần thân component, nên nó là một reactive value. Mọi reactive value đều phải được chỉ định làm dependency, nếu không nó có thể trở nên stale theo thời gian!

Tác giả của code gốc đã “nói dối” React khi cho rằng Effect không phụ thuộc (`[]`) vào bất kỳ reactive value nào. Vì vậy, React không re-synchronize Effect sau khi `canMove` thay đổi (và `handleMove` cũng thay đổi theo). Do React không re-synchronize Effect, `handleMove` được gắn làm listener là hàm `handleMove` được tạo trong lần render đầu tiên. Trong lần render đầu tiên, `canMove` là `true`, đó là lý do `handleMove` từ lần render đầu tiên sẽ luôn nhìn thấy giá trị đó.

**Nếu bạn không bao giờ suppress linter, bạn sẽ không bao giờ gặp vấn đề với các giá trị stale.**

Với `useEffectEvent`, bạn không cần “nói dối” linter, và code hoạt động như mong đợi:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Điều này không có nghĩa `useEffectEvent` *luôn* là giải pháp đúng. Bạn chỉ nên áp dụng nó cho những dòng code mà bạn không muốn reactive. Trong sandbox trên, bạn không muốn code của Effect reactive đối với `canMove`. Vì vậy, việc tách ra thành một Effect Event là hợp lý.

Đọc [Removing Effect Dependencies](/learn/removing-effect-dependencies) để xem các lựa chọn đúng khác thay cho việc suppress linter.

</DeepDive>

### Các hạn chế của Effect Events {/*limitations-of-effect-events*/}

Effect Events bị hạn chế rất nhiều về cách bạn có thể sử dụng chúng:

* **Chỉ gọi chúng từ bên trong Effects.**
* **Không bao giờ truyền chúng cho component hoặc Hook khác.**

Ví dụ, đừng khai báo và truyền một Effect Event như sau:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Tránh: truyền Effect Event

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Cần chỉ định "callback" trong dependencies
}
```

Thay vào đó, luôn khai báo Effect Events ngay cạnh các Effects sử dụng chúng:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Tốt: chỉ được gọi cục bộ trong Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // Không cần chỉ định "onTick" (một Effect Event) làm dependency
}
```

Effect Events là những “mảnh” code không reactive trong Effect của bạn. Chúng nên nằm cạnh Effect đang sử dụng chúng.

<Recap>

- Event handlers chạy để phản hồi các tương tác cụ thể.
- Effects chạy bất cứ khi nào cần synchronization.
- Logic bên trong event handlers không reactive.
- Logic bên trong Effects reactive.
- Bạn có thể chuyển logic không reactive từ Effects vào Effect Events.
- Chỉ gọi Effect Events từ bên trong Effects.
- Không truyền Effect Events cho component hoặc Hook khác.

</Recap>

<Challenges>

#### Sửa một biến không cập nhật {/*fix-a-variable-that-doesnt-update*/}

Component `Timer` này duy trì một state variable `count`, biến này tăng lên mỗi giây. Giá trị dùng để tăng được lưu trong state variable `increment`. Bạn có thể điều khiển biến `increment` bằng các nút cộng và trừ.

Tuy nhiên, dù bạn nhấn nút cộng bao nhiêu lần, counter vẫn chỉ tăng một đơn vị mỗi giây. Code này có vấn đề gì? Tại sao `increment` luôn bằng `1` bên trong code của Effect? Hãy tìm lỗi và sửa nó.

<Hint>

Để sửa code này, chỉ cần làm theo các quy tắc.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Như thường lệ, khi tìm bug trong Effects, hãy bắt đầu bằng cách tìm các linter suppression.

Nếu xóa comment suppression, React sẽ cho bạn biết code của Effect này phụ thuộc vào `increment`, nhưng bạn đã “nói dối” React khi tuyên bố rằng Effect này không phụ thuộc vào bất kỳ reactive value nào (`[]`). Hãy thêm `increment` vào dependency array:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Bây giờ, khi `increment` thay đổi, React sẽ re-synchronize Effect của bạn, nhờ đó khởi động lại interval.

</Solution>

#### Sửa counter bị đóng băng {/*fix-a-freezing-counter*/}

Component `Timer` này duy trì một state variable `count`, biến này tăng lên mỗi giây. Giá trị dùng để tăng được lưu trong state variable `increment`, và bạn có thể điều khiển nó bằng các nút cộng và trừ. Ví dụ, hãy thử nhấn nút cộng chín lần và chú ý rằng `count` lúc này tăng mười đơn vị mỗi giây thay vì một đơn vị.

Có một vấn đề nhỏ với giao diện người dùng này. Bạn có thể nhận thấy rằng nếu liên tục nhấn các nút cộng hoặc trừ nhanh hơn một lần mỗi giây, bản thân bộ hẹn giờ dường như sẽ tạm dừng. Nó chỉ tiếp tục chạy sau khi đã một giây trôi qua kể từ lần cuối bạn nhấn một trong hai nút. Hãy tìm nguyên nhân và khắc phục vấn đề để bộ hẹn giờ tích tắc vào *mỗi* giây mà không bị gián đoạn.

<Hint>

Có vẻ như Effect dùng để thiết lập bộ hẹn giờ đang “phản ứng” với giá trị `increment`. Dòng sử dụng giá trị `increment` hiện tại để gọi `setCount` có thực sự cần phải reactive không?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Vấn đề là code bên trong Effect sử dụng biến state `increment`. Vì đây là một dependency của Effect, mọi thay đổi đối với `increment` đều khiến Effect re-synchronize, từ đó làm xóa interval. Nếu bạn liên tục xóa interval trước khi nó có cơ hội chạy, bộ hẹn giờ sẽ có vẻ như bị đình trệ.

Để giải quyết vấn đề, hãy trích xuất một Effect Event `onTick` từ Effect:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

Vì `onTick` là một Effect Event, code bên trong nó không reactive. Việc thay đổi `increment` không kích hoạt bất kỳ Effect nào.

</Solution>

#### Khắc phục delay không thể điều chỉnh {/*fix-a-non-adjustable-delay*/}

Trong ví dụ này, bạn có thể tùy chỉnh delay của interval. Delay được lưu trong một biến state `delay`, được cập nhật bởi hai nút. Tuy nhiên, ngay cả khi bạn nhấn nút “plus 100 ms” cho đến khi `delay` là 1000 mili giây (tức là một giây), bạn sẽ nhận thấy bộ hẹn giờ vẫn tăng rất nhanh (mỗi 100 ms). Có vẻ như các thay đổi đối với `delay` bị bỏ qua. Hãy tìm và sửa lỗi.

<Hint>

Code bên trong Effect Event không reactive. Có trường hợp nào bạn _muốn_ lệnh gọi `setInterval` chạy lại không?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Vấn đề với ví dụ trên là nó đã trích xuất một Effect Event có tên `onMount` mà không cân nhắc xem code thực sự nên hoạt động như thế nào. Bạn chỉ nên trích xuất Effect Event vì một lý do cụ thể: khi muốn làm cho một phần code không reactive. Tuy nhiên, lệnh gọi `setInterval` *nên* reactive đối với biến state `delay`. Nếu `delay` thay đổi, bạn muốn thiết lập lại interval từ đầu! Để sửa code này, hãy đưa toàn bộ code reactive trở lại bên trong Effect:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Nhìn chung, bạn nên cảnh giác với những function như `onMount`, vốn tập trung vào *thời điểm* thay vì *mục đích* của một đoạn code. Ban đầu, chúng có thể tạo cảm giác “mô tả rõ hơn”, nhưng lại che khuất ý định của bạn. Theo nguyên tắc chung, Effect Event nên tương ứng với điều gì đó xảy ra từ góc nhìn của *người dùng*. Ví dụ, `onMessage`, `onTick`, `onVisit` hoặc `onConnected` là những tên Effect Event phù hợp. Code bên trong chúng có lẽ không cần phải reactive. Ngược lại, `onMount`, `onUpdate`, `onUnmount` hoặc `onAfterRender` quá chung chung, nên rất dễ vô tình đưa code *nên* reactive vào đó. Đây là lý do bạn nên đặt tên Effect Event theo *điều mà người dùng nghĩ là đã xảy ra*, chứ không phải theo thời điểm một đoạn code tình cờ được chạy.

</Solution>

#### Khắc phục thông báo bị trì hoãn {/*fix-a-delayed-notification*/}

Khi tham gia một phòng chat, component này sẽ hiển thị một thông báo. Tuy nhiên, thông báo không xuất hiện ngay lập tức. Thay vào đó, thông báo được trì hoãn nhân tạo hai giây để người dùng có thời gian xem qua UI.

Cách này gần như hoạt động đúng, nhưng có một lỗi. Hãy thử nhanh chóng thay đổi dropdown từ “general” sang “travel”, rồi sang “music”. Nếu thao tác đủ nhanh, bạn sẽ thấy hai thông báo (như mong đợi!), nhưng *cả hai* đều ghi “Welcome to music”.

Hãy sửa để khi bạn nhanh chóng chuyển từ “general” sang “travel”, rồi sang “music”, bạn sẽ thấy hai thông báo: thông báo thứ nhất là “Welcome to travel” và thông báo thứ hai là “Welcome to music”. (Để thử thách thêm, với giả định bạn đã làm cho các thông báo hiển thị đúng phòng, hãy thay đổi code để chỉ hiển thị thông báo sau cùng.)

<Hint>

Effect của bạn biết nó đã kết nối với phòng nào. Có thông tin nào mà bạn muốn truyền vào Effect Event không?

</Hint>

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
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
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

<Solution>

Bên trong Effect Event, `roomId` là giá trị *tại thời điểm Effect Event được gọi*.

Effect Event của bạn được gọi sau khoảng thời gian trễ hai giây. Nếu bạn nhanh chóng chuyển từ phòng travel sang phòng music, thì đến lúc thông báo của phòng travel xuất hiện, `roomId` đã là `"music"`. Đây là lý do cả hai thông báo đều ghi “Welcome to music”.

Để khắc phục vấn đề, thay vì đọc `roomId` *mới nhất* bên trong Effect Event, hãy biến nó thành một parameter của Effect Event, như `connectedRoomId` bên dưới. Sau đó, truyền `roomId` từ Effect bằng cách gọi `onConnected(roomId)`:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
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

Effect có `roomId` được đặt thành `"travel"` (nên nó đã kết nối với phòng `"travel"`) sẽ hiển thị thông báo cho `"travel"`. Effect có `roomId` được đặt thành `"music"` (nên nó đã kết nối với phòng `"music"`) sẽ hiển thị thông báo cho `"music"`. Nói cách khác, `connectedRoomId` đến từ Effect của bạn (vốn là reactive), còn `theme` luôn sử dụng giá trị mới nhất.

Để giải quyết thử thách thêm, hãy lưu ID của notification timeout và xóa nó trong hàm cleanup của Effect:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
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

Điều này đảm bảo các thông báo đã được lên lịch (nhưng chưa hiển thị) sẽ bị hủy khi bạn thay đổi phòng.

</Solution>

</Challenges>
