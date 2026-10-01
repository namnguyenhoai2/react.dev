---
title: useEffectEvent
---

<Intro>

`useEffectEvent` là một React Hook cho phép bạn tách các sự kiện khỏi Effects.

```js
const onEvent = useEffectEvent(callback)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

Gọi `useEffectEvent` ở cấp cao nhất trong component của bạn để tạo một Effect Event.

```js {4,6}
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
}
```

Effect Events là một phần trong logic Effect của bạn, nhưng chúng hoạt động giống event handler hơn. Chúng luôn “nhìn thấy” các giá trị mới nhất từ lần render (chẳng hạn như props và state) mà không đồng bộ lại Effect, vì vậy chúng được loại khỏi các dependency của Effect. Xem [Tách Events khỏi Effects](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects) để tìm hiểu thêm.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `callback`: Một hàm chứa logic cho Effect Event của bạn. Hàm này có thể nhận bất kỳ số lượng đối số nào và trả về bất kỳ giá trị nào. Khi bạn gọi hàm Effect Event được trả về, `callback` luôn truy cập các giá trị mới nhất đã commit từ lần render tại thời điểm gọi.

#### Giá trị trả về {/*returns*/}

`useEffectEvent` trả về một hàm Effect Event có cùng type signature với `callback`.

Bạn có thể gọi hàm này bên trong `useEffect`, `useLayoutEffect`, `useInsertionEffect`, hoặc từ bên trong các Effect Event khác trong cùng component.

#### Lưu ý {/*caveats*/}

* `useEffectEvent` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất trong component** hoặc các Hook của riêng bạn. Bạn không thể gọi nó bên trong vòng lặp hoặc điều kiện. Nếu cần làm vậy, hãy tách ra một component mới và chuyển Effect Event vào đó.
* Effect Events chỉ có thể được gọi từ bên trong Effects hoặc các Effect Events khác. Không gọi chúng trong quá trình render hoặc truyền chúng cho các component hay Hook khác. Linter [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) thực thi hạn chế này.
* Không sử dụng `useEffectEvent` để tránh chỉ định các dependency trong dependency array của Effect. Cách này che giấu bug và khiến code khó hiểu hơn. Chỉ sử dụng nó cho logic thực sự là một sự kiện được kích hoạt từ Effects.
* Các hàm Effect Event không có identity ổn định. Identity của chúng cố ý thay đổi ở mỗi lần render.

<DeepDive>

#### Tại sao Effect Events không ổn định? {/*why-are-effect-events-not-stable*/}

Không giống các hàm `set` từ `useState` hoặc refs, các hàm Effect Event không có identity ổn định. Identity của chúng cố ý thay đổi ở mỗi lần render:

```js
// 🔴 Không đúng: đưa Effect Event vào dependencies
useEffect(() => {
  onSomething();
}, [onSomething]); // ESLint sẽ cảnh báo về điều này
```

Đây là một lựa chọn thiết kế có chủ đích. Effect Events chỉ được gọi từ bên trong các Effects trong cùng component. Vì bạn chỉ có thể gọi chúng cục bộ, không thể truyền chúng cho các component khác hoặc đưa chúng vào dependency arrays, nên identity ổn định sẽ không mang lại lợi ích gì và thực tế còn che giấu bug.

Identity không ổn định hoạt động như một runtime assertion: nếu code của bạn vô tình phụ thuộc vào function identity, bạn sẽ thấy Effect chạy lại ở mỗi lần render, khiến bug trở nên rõ ràng.

Thiết kế này củng cố rằng Effect Events về mặt khái niệm thuộc về một effect cụ thể, không phải là một API đa mục đích để tắt tính reactive.

</DeepDive>

---

## Cách sử dụng {/*usage*/}


### Sử dụng một event trong Effect {/*using-an-event-in-an-effect*/}

Gọi `useEffectEvent` ở cấp cao nhất trong component của bạn để tạo một *Effect Event*:


```js [[1, 1, "onConnected"]]
const onConnected = useEffectEvent(() => {
  if (!muted) {
    showNotification('Connected!');
  }
});
```

`useEffectEvent` nhận một `event callback` và trả về một <CodeStep step={1}>Effect Event</CodeStep>. Effect Event là một hàm có thể được gọi bên trong Effects mà không kết nối lại Effect:

```js [[1, 3, "onConnected"]]
useEffect(() => {
  const connection = createConnection(roomId);
  connection.on('connected', onConnected);
  connection.connect();
  return () => {
    connection.disconnect();
  }
}, [roomId]);
```

Vì `onConnected` là một <CodeStep step={1}>Effect Event</CodeStep>, `muted` và `onConnect` không nằm trong các dependency của Effect.

<Pitfall>

##### Không sử dụng Effect Events để bỏ qua dependencies {/*pitfall-skip-dependencies*/}

Bạn có thể muốn sử dụng `useEffectEvent` để tránh liệt kê các dependency mà bạn cho là "không cần thiết". Tuy nhiên, cách này che giấu bug và khiến code khó hiểu hơn:

```js
// 🔴 Không đúng: Dùng Effect Event để che giấu dependencies
const logVisit = useEffectEvent(() => {
  log(pageUrl);
});

useEffect(() => {
  logVisit()
}, []); // Thiếu pageUrl nghĩa là bạn sẽ bỏ lỡ log
```

Nếu một giá trị cần khiến Effect chạy lại, hãy giữ giá trị đó làm dependency. Chỉ sử dụng Effect Events cho logic thực sự không nên kích hoạt lại Effect.

Xem [Tách Events khỏi Effects](/learn/separating-events-from-effects) để tìm hiểu thêm.

</Pitfall>

---

### Sử dụng timer với các giá trị mới nhất {/*using-a-timer-with-latest-values*/}

Khi sử dụng `setInterval` hoặc `setTimeout` trong một Effect, bạn thường muốn đọc các giá trị mới nhất từ lần render mà không khởi động lại timer mỗi khi các giá trị đó thay đổi.

Bộ đếm này tăng `count` thêm giá trị `increment` hiện tại mỗi giây. Effect Event `onTick` đọc các giá trị mới nhất của `count` và `increment` mà không khiến interval khởi động lại:

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(count + increment);
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

Hãy thử thay đổi giá trị increment trong khi timer đang chạy. Bộ đếm ngay lập tức sử dụng giá trị increment mới, nhưng timer vẫn tiếp tục chạy mượt mà mà không khởi động lại.

---

### Sử dụng event listener với các giá trị mới nhất {/*using-an-event-listener-with-latest-values*/}

Khi thiết lập event listener trong một Effect, bạn thường cần đọc các giá trị mới nhất từ lần render trong callback. Nếu không có `useEffectEvent`, bạn sẽ phải thêm các giá trị đó vào dependencies, khiến listener bị xóa rồi thêm lại sau mỗi thay đổi.

Ví dụ này hiển thị một chấm di chuyển theo con trỏ, nhưng chỉ khi "Can move" được chọn. Effect Event `onMove` luôn đọc giá trị `canMove` mới nhất mà không chạy lại Effect:

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

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
        <input
          type="checkbox"
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

Hãy bật tắt checkbox và di chuyển con trỏ. Chấm phản hồi ngay lập tức theo trạng thái checkbox, nhưng event listener chỉ được thiết lập một lần khi component mount.

---

### Tránh kết nối lại với các hệ thống bên ngoài {/*showing-a-notification-without-reconnecting*/}

Một trường hợp sử dụng phổ biến của `useEffectEvent` là khi bạn muốn thực hiện điều gì đó để phản hồi một Effect, nhưng "điều gì đó" lại phụ thuộc vào một giá trị mà bạn không muốn phản ứng theo.

Trong ví dụ này, một component chat kết nối với một room và hiển thị thông báo khi đã kết nối. Người dùng có thể tắt thông báo bằng checkbox. Tuy nhiên, bạn không muốn kết nối lại với room chat mỗi khi người dùng thay đổi cài đặt:

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
import { useState, useEffect, useEffectEvent } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

function ChatRoom({ roomId, muted }) {
  const onConnected = useEffectEvent((roomId) => {
    console.log('✅ Connected to ' + roomId + ' (muted: ' + muted + ')');
    if (!muted) {
      showNotification('Connected to ' + roomId);
    }
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    console.log('⏳ Connecting to ' + roomId + '...');
    connection.on('connected', () => {
      onConnected(roomId);
    });
    connection.connect();
    return () => {
      console.log('❌ Disconnected from ' + roomId);
      connection.disconnect();
    }
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [muted, setMuted] = useState(false);
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
          checked={muted}
          onChange={e => setMuted(e.target.checked)}
        />
        Mute notifications
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        muted={muted}
      />
    </>
  );
}
```

```js src/chat.js
const serverUrl = 'https://localhost:1234';

export function createConnection(roomId) {
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

Hãy thử chuyển room. Chat sẽ kết nối lại và hiển thị thông báo. Bây giờ hãy tắt thông báo. Vì `muted` được đọc bên trong Effect Event thay vì Effect, chat vẫn duy trì kết nối.

---

### Sử dụng Effect Events trong custom Hooks {/*using-effect-events-in-custom-hooks*/}

Bạn có thể sử dụng `useEffectEvent` bên trong các custom Hooks của riêng mình. Điều này cho phép bạn tạo các Hook có thể tái sử dụng, đóng gói Effects trong khi vẫn giữ một số giá trị ở trạng thái non-reactive:

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Counter({ incrementBy }) {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount(c => c + incrementBy);
  }, 1000);

  return (
    <div>
      <h2>Count: {count}</h2>
      <p>Incrementing by {incrementBy} every second</p>
    </div>
  );
}

export default function App() {
  const [incrementBy, setIncrementBy] = useState(1);

  return (
    <>
      <label>
        Increment by:{' '}
        <select
          value={incrementBy}
          onChange={(e) => setIncrementBy(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </label>
      <hr />
      <Counter incrementBy={incrementBy} />
    </>
  );
}
```

```css
label { display: block; margin-bottom: 8px; }
```

</Sandpack>

Trong ví dụ này, `useInterval` là một custom Hook thiết lập một interval. `callback` được truyền vào Hook này sẽ được bọc trong một Effect Event, vì vậy interval không bị reset ngay cả khi một `callback` mới được truyền vào ở mỗi lần render.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi gặp lỗi: "A function wrapped in useEffectEvent can't be called during rendering" {/*cant-call-during-rendering*/}

Lỗi này có nghĩa là bạn đang gọi một hàm Effect Event trong giai đoạn render của component. Effect Events chỉ có thể được gọi từ bên trong Effects hoặc các Effect Events khác.

```js
function MyComponent({ data }) {
  const onLog = useEffectEvent(() => {
    console.log(data);
  });

  // 🔴 Không đúng: gọi trong khi render
  onLog();

  // ✅ Đúng: gọi từ một Effect
  useEffect(() => {
    onLog();
  }, []);

  return <div>{data}</div>;
}
```

Nếu cần chạy logic trong quá trình render, đừng bọc logic đó trong `useEffectEvent`. Hãy gọi trực tiếp logic hoặc chuyển logic vào một Effect.

---

### Tôi gặp lỗi lint: "Functions returned from useEffectEvent must not be included in the dependency array" {/*effect-event-in-deps*/}

Nếu thấy cảnh báo như "Functions returned from `useEffectEvent` must not be included in the dependency array", hãy xóa Effect Event khỏi dependencies:

```js
const onSomething = useEffectEvent(() => {
  // ...
});

// 🔴 Không đúng: Effect Event nằm trong dependencies
useEffect(() => {
  onSomething();
}, [onSomething]);

// ✅ Đúng: không có Effect Event trong dependencies
useEffect(() => {
  onSomething();
}, []);
```

Effect Events được thiết kế để được gọi từ Effects mà không cần liệt kê dưới dạng dependencies. Linter thực thi quy tắc này vì function identity [intentionally not stable](#why-are-effect-events-not-stable). Việc đưa nó vào sẽ khiến Effect chạy lại ở mỗi lần render.

---

### Tôi gặp lỗi lint: "... is a function created with useEffectEvent, and can only be called from Effects" {/*effect-event-called-outside-effect*/}

Nếu thấy cảnh báo như "... is a function created with React Hook `useEffectEvent`, and can only be called from Effects and Effect Events", bạn đang gọi hàm từ sai vị trí:

```js
const onSomething = useEffectEvent(() => {
  console.log(value);
});

// 🔴 Không đúng: gọi từ event handler
function handleClick() {
  onSomething();
}

// 🔴 Không đúng: truyền cho component con
return <Child onSomething={onSomething} />;

// ✅ Đúng: gọi từ Effect
useEffect(() => {
  onSomething();
}, []);
```

Effect Events được thiết kế cụ thể để sử dụng trong các Effects thuộc component nơi chúng được định nghĩa. Nếu cần một callback cho các event handler hoặc để truyền cho component con, hãy sử dụng một hàm thông thường hoặc `useCallback` thay thế.
