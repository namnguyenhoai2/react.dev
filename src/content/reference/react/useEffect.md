---
title: useEffect
---

<Intro>

`useEffect` là một React Hook cho phép bạn [đồng bộ hóa một component với một hệ thống bên ngoài.](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Gọi `useEffect` ở cấp cao nhất của component để khai báo một Effect:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `setup`: Hàm chứa logic của Effect. Hàm setup của bạn cũng có thể tùy chọn trả về một hàm *cleanup*. Khi [component của bạn được commit](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom), React sẽ chạy hàm setup của bạn. Sau mỗi commit có các dependency thay đổi, trước tiên React sẽ chạy hàm cleanup (nếu bạn cung cấp) với các giá trị cũ, sau đó chạy hàm setup với các giá trị mới. Sau khi component của bạn bị xóa khỏi DOM, React sẽ chạy hàm cleanup.

* **tùy chọn** `dependencies`: Danh sách tất cả các giá trị reactive được tham chiếu bên trong đoạn `setup` code. Các giá trị reactive bao gồm props, state và tất cả biến cũng như hàm được khai báo trực tiếp bên trong phần thân component. Nếu linter của bạn được [cấu hình cho React](/learn/editor-setup#linting), nó sẽ kiểm tra để đảm bảo mọi giá trị reactive đều được chỉ định chính xác dưới dạng dependency. Danh sách dependency phải có số lượng phần tử cố định và được viết inline như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó bằng phép [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Nếu bạn bỏ qua đối số này, Effect của bạn sẽ chạy lại sau mỗi commit của component. [Xem sự khác biệt giữa việc truyền một mảng dependency, một mảng rỗng và hoàn toàn không truyền dependency.](#examples-dependencies)

#### Giá trị trả về {/*returns*/}

`useEffect` trả về `undefined`.

#### Lưu ý {/*caveats*/}

* `useEffect` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component hoặc các Hook của riêng bạn**. Bạn không thể gọi nó bên trong vòng lặp hoặc điều kiện. Nếu cần làm vậy, hãy tách ra thành một component mới và chuyển state vào đó.

* Nếu bạn **không cố gắng đồng bộ hóa với một hệ thống bên ngoài nào đó,** [có lẽ bạn không cần Effect.](/learn/you-might-not-need-an-effect)

* Khi Strict Mode được bật, React sẽ **chạy thêm một chu kỳ setup+cleanup chỉ dành cho development** trước lần setup thực sự đầu tiên. Đây là một bài kiểm tra sức chịu đựng nhằm đảm bảo logic cleanup của bạn “phản chiếu” logic setup và dừng hoặc hoàn tác bất kỳ điều gì mà setup đang thực hiện. Nếu điều này gây ra vấn đề, [hãy triển khai hàm cleanup.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Nếu một số dependency của bạn là các object hoặc function được định nghĩa bên trong component, có nguy cơ chúng sẽ **khiến Effect chạy lại thường xuyên hơn mức cần thiết.** Để khắc phục, hãy loại bỏ các dependency [object](#removing-unnecessary-object-dependencies) và [function](#removing-unnecessary-function-dependencies) không cần thiết. Bạn cũng có thể [tách các cập nhật state](#updating-state-based-on-previous-state-from-an-effect) và [logic không reactive](#reading-the-latest-props-and-state-from-an-effect) ra bên ngoài Effect.

* Nếu Effect của bạn không được gây ra bởi một tương tác (chẳng hạn như thao tác nhấp), React thường sẽ cho phép trình duyệt **paint màn hình đã cập nhật trước khi chạy Effect.** Nếu Effect của bạn thực hiện một việc liên quan đến hiển thị (ví dụ: định vị tooltip) và độ trễ dễ nhận thấy (chẳng hạn như hiện tượng nhấp nháy), hãy thay `useEffect` bằng [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Nếu Effect của bạn được gây ra bởi một tương tác (chẳng hạn như thao tác nhấp), **React có thể chạy Effect trước khi trình duyệt paint màn hình đã cập nhật**. Điều này đảm bảo kết quả của Effect có thể được hệ thống sự kiện quan sát. Thông thường, điều này hoạt động như mong đợi. Tuy nhiên, nếu bạn phải trì hoãn công việc cho đến sau khi paint, chẳng hạn như một `alert()`, bạn có thể sử dụng `setTimeout`. Xem [reactwg/react-18/128](https://github.com/reactwg/react-18/discussions/128) để biết thêm thông tin.

* Ngay cả khi Effect của bạn được gây ra bởi một tương tác (chẳng hạn như thao tác nhấp), **React vẫn có thể cho phép trình duyệt repaint màn hình trước khi xử lý các cập nhật state bên trong Effect.** Thông thường, điều này hoạt động như mong đợi. Tuy nhiên, nếu bạn phải ngăn trình duyệt repaint màn hình, bạn cần thay `useEffect` bằng [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Effect **chỉ chạy trên client.** Chúng không chạy trong quá trình server rendering.

---

## Cách sử dụng {/*usage*/}

### Kết nối với một hệ thống bên ngoài {/*connecting-to-an-external-system*/}

Một số component cần duy trì kết nối với network, một browser API hoặc một thư viện bên thứ ba trong khi được hiển thị trên trang. Các hệ thống này không do React kiểm soát, vì vậy chúng được gọi là *bên ngoài.*

Để [kết nối component với một hệ thống bên ngoài,](/learn/synchronizing-with-effects) hãy gọi `useEffect` ở cấp cao nhất của component:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

Bạn cần truyền hai đối số cho `useEffect`:

1. Một *hàm setup* với <CodeStep step={1}>đoạn setup code</CodeStep> kết nối với hệ thống đó.
   - Hàm này nên trả về một *hàm cleanup* với <CodeStep step={2}>đoạn cleanup code</CodeStep> ngắt kết nối khỏi hệ thống đó.
2. Một <CodeStep step={3}>danh sách dependency</CodeStep> bao gồm mọi giá trị từ component được sử dụng bên trong các hàm đó.

**React gọi các hàm setup và cleanup của bạn bất cứ khi nào cần thiết, và điều này có thể xảy ra nhiều lần:**

1. <CodeStep step={1}>Đoạn setup code</CodeStep> của bạn chạy khi component được thêm vào trang *(mount)*.
2. Sau mỗi commit của component trong đó các <CodeStep step={3}>dependency</CodeStep> đã thay đổi:
   - Trước tiên, <CodeStep step={2}>đoạn cleanup code</CodeStep> của bạn chạy với props và state cũ.
   - Sau đó, <CodeStep step={1}>đoạn setup code</CodeStep> của bạn chạy với props và state mới.
3. <CodeStep step={2}>Đoạn cleanup code</CodeStep> của bạn chạy lần cuối sau khi component bị xóa khỏi trang *(unmount).*

**Hãy minh họa trình tự này bằng ví dụ ở trên.**

Khi component `ChatRoom` ở trên được thêm vào trang, nó sẽ kết nối với phòng chat bằng `serverUrl` và `roomId` ban đầu. Nếu `serverUrl` hoặc `roomId` thay đổi do một commit (ví dụ: khi người dùng chọn một phòng chat khác trong dropdown), Effect của bạn sẽ *ngắt kết nối khỏi phòng trước đó và kết nối với phòng tiếp theo.* Khi component `ChatRoom` bị xóa khỏi trang, Effect sẽ ngắt kết nối lần cuối.

**Để [giúp bạn tìm lỗi,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) trong development, React chạy <CodeStep step={1}>setup</CodeStep> và <CodeStep step={2}>cleanup</CodeStep> thêm một lần trước <CodeStep step={1}>setup</CodeStep>.** Đây là một bài kiểm tra sức chịu đựng nhằm xác minh logic của Effect được triển khai chính xác. Nếu điều này gây ra các vấn đề có thể nhìn thấy, hàm cleanup của bạn đang thiếu một phần logic. Hàm cleanup phải dừng hoặc hoàn tác bất kỳ điều gì mà hàm setup đã thực hiện. Quy tắc kinh nghiệm là người dùng không thể phân biệt được giữa việc setup được gọi một lần (như trong production) và một chuỗi *setup* → *cleanup* → *setup* (như trong development). [Xem các giải pháp phổ biến.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**Hãy [viết mỗi Effect như một quy trình độc lập](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) và [nghĩ về từng chu kỳ setup/cleanup riêng lẻ.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** Việc component của bạn đang mount, update hay unmount không nên tạo ra khác biệt. Khi logic cleanup của bạn “phản chiếu” chính xác logic setup, Effect của bạn sẽ bền vững trước việc setup và cleanup được chạy thường xuyên khi cần.

<Note>

Effect cho phép bạn [duy trì sự đồng bộ của component](/learn/synchronizing-with-effects) với một hệ thống bên ngoài nào đó (chẳng hạn như một chat service). Ở đây, *hệ thống bên ngoài* có nghĩa là bất kỳ đoạn code nào không do React kiểm soát, chẳng hạn như:

* Một timer được quản lý bằng <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> và <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* Một event subscription sử dụng <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> và <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* Một thư viện animation bên thứ ba với API như <CodeStep step={1}>`animation.start()`</CodeStep> và <CodeStep step={2}>`animation.reset()`</CodeStep>.

**Nếu bạn không kết nối với bất kỳ hệ thống bên ngoài nào, [có lẽ bạn không cần một Effect.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Examples of connecting to an external system" titleId="examples-connecting">

#### Kết nối với máy chủ chat {/*connecting-to-a-chat-server*/}

Trong ví dụ này, component `ChatRoom` sử dụng một Effect để duy trì kết nối với một hệ thống bên ngoài được định nghĩa trong `chat.js`. Nhấn "Open chat" để hiển thị component `ChatRoom`. Sandbox này chạy ở chế độ development, vì vậy có thêm một chu kỳ kết nối rồi ngắt kết nối, như được [giải thích tại đây.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) Hãy thử thay đổi `roomId` và `serverUrl` bằng dropdown và input, rồi xem Effect kết nối lại với chat như thế nào. Nhấn "Close chat" để thấy Effect ngắt kết nối lần cuối.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

<Solution />

#### Lắng nghe một browser event toàn cục {/*listening-to-a-global-browser-event*/}

Trong ví dụ này, hệ thống bên ngoài chính là browser DOM. Thông thường, bạn sẽ chỉ định event listener bằng JSX, nhưng bạn không thể lắng nghe đối tượng [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) toàn cục theo cách này. Effect cho phép bạn kết nối với đối tượng `window` và lắng nghe các event của nó. Việc lắng nghe event `pointermove` cho phép bạn theo dõi vị trí của con trỏ (hoặc ngón tay) và cập nhật chấm đỏ để nó di chuyển theo.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
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
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Kích hoạt một animation {/*triggering-an-animation*/}

Trong ví dụ này, hệ thống bên ngoài là thư viện animation trong `animation.js`. Thư viện cung cấp một class JavaScript có tên `FadeInAnimation`, nhận một DOM node làm đối số và cung cấp các method `start()` và `stop()` để điều khiển animation. Component này [sử dụng một ref](/learn/manipulating-the-dom-with-refs) để truy cập DOM node bên dưới. Effect đọc DOM node từ ref và tự động bắt đầu animation cho node đó khi component xuất hiện.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Nhảy ngay đến cuối
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Bắt đầu hiệu ứng động
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Vẫn còn các frame cần vẽ
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### Điều khiển một modal dialog {/*controlling-a-modal-dialog*/}

Trong ví dụ này, hệ thống bên ngoài là browser DOM. Component `ModalDialog` render một phần tử [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Component sử dụng một Effect để đồng bộ prop `isOpen` với các lời gọi method [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) và [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Theo dõi khả năng hiển thị của element {/*tracking-element-visibility*/}

Trong ví dụ này, hệ thống bên ngoài một lần nữa là browser DOM. Component `App` hiển thị một danh sách dài, sau đó là component `Box`, rồi một danh sách dài khác. Hãy cuộn danh sách xuống. Lưu ý rằng khi toàn bộ component `Box` hiển thị hoàn toàn trong viewport, màu nền sẽ chuyển thành đen. Để triển khai điều này, component `Box` sử dụng một Effect để quản lý [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). Browser API này thông báo cho bạn khi element DOM hiển thị trong viewport.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Bọc Effects trong custom Hooks {/*wrapping-effects-in-custom-hooks*/}

Effects là một ["lối thoát":](/learn/escape-hatches) bạn sử dụng chúng khi cần "bước ra ngoài React" và khi không có giải pháp tích hợp nào tốt hơn cho trường hợp sử dụng của mình. Nếu bạn thường xuyên phải tự viết Effects, đó thường là dấu hiệu cho thấy bạn cần tách một số [custom Hooks](/learn/reusing-logic-with-custom-hooks) cho các hành vi phổ biến mà component của bạn phụ thuộc vào.

Ví dụ, custom Hook `useChatRoom` này "ẩn" logic của Effect phía sau một API mang tính khai báo hơn:

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Sau đó, bạn có thể sử dụng nó từ bất kỳ component nào như sau:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Ngoài ra, hệ sinh thái React còn có rất nhiều custom Hooks tuyệt vời cho mọi mục đích.

[Tìm hiểu thêm về việc bọc Effects trong custom Hooks.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Examples of wrapping Effects in custom Hooks" titleId="examples-custom-hooks">

#### Custom `useChatRoom` Hook {/*custom-usechatroom-hook*/}

Ví dụ này giống hệt một trong các [ví dụ trước,](#examples-connecting) nhưng logic được tách vào một custom Hook.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
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

<Solution />

#### Custom `useWindowListener` Hook {/*custom-usewindowlistener-hook*/}

Ví dụ này giống hệt một trong các [ví dụ trước,](#examples-connecting) nhưng logic được tách vào một custom Hook.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
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
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Custom `useIntersectionObserver` Hook {/*custom-useintersectionobserver-hook*/}

Ví dụ này giống hệt một trong các [ví dụ trước,](#examples-connecting) nhưng logic chỉ được tách một phần vào một custom Hook.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Điều khiển widget không dùng React {/*controlling-a-non-react-widget*/}

Đôi khi, bạn muốn giữ cho một hệ thống bên ngoài được đồng bộ với một prop hoặc state của component.

Ví dụ, nếu bạn có một widget bản đồ bên thứ ba hoặc một component video player được viết mà không dùng React, bạn có thể sử dụng Effect để gọi các method trên đó, khiến state của nó khớp với state hiện tại của component React. Effect này tạo một instance của class `MapWidget` được định nghĩa trong `map-widget.js`. Khi bạn thay đổi prop `zoomLevel` của component `Map`, Effect gọi `setZoom()` trên instance của class để giữ cho chúng được đồng bộ:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

Trong ví dụ này, không cần hàm cleanup vì class `MapWidget` chỉ quản lý DOM node được truyền cho nó. Sau khi component React `Map` bị xóa khỏi tree, cả DOM node và instance của class `MapWidget` sẽ được browser JavaScript engine tự động garbage-collect.

---

### Fetching dữ liệu bằng Effects {/*fetching-data-with-effects*/}

Bạn có thể sử dụng Effect để fetching dữ liệu cho component. Lưu ý rằng [nếu bạn sử dụng một framework,](/learn/creating-a-react-app#full-stack-frameworks) việc sử dụng cơ chế fetching dữ liệu của framework sẽ hiệu quả hơn nhiều so với tự viết Effects.

Nếu muốn tự fetching dữ liệu từ một Effect, code của bạn có thể trông như sau:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Hãy chú ý đến biến `ignore`, được khởi tạo với giá trị `false` và được đặt thành `true` trong quá trình cleanup. Điều này đảm bảo [code của bạn không gặp phải "race conditions":](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) các response từ network có thể đến theo thứ tự khác với thứ tự bạn gửi chúng.

<Sandpack>

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Bạn cũng có thể viết lại bằng cú pháp [`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), nhưng vẫn cần cung cấp một hàm cleanup:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Việc viết logic lấy dữ liệu trực tiếp trong Effects trở nên lặp lại và khiến việc bổ sung các tối ưu hóa như caching và server rendering về sau trở nên khó khăn. [Sử dụng một custom Hook sẽ dễ dàng hơn--có thể là Hook do bạn tự viết hoặc được cộng đồng duy trì.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Các lựa chọn thay thế tốt cho việc lấy dữ liệu trong Effects là gì? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Việc viết các lệnh gọi `fetch` bên trong Effects là một [cách phổ biến để lấy dữ liệu](https://www.robinwieruch.de/react-hooks-fetch-data/), đặc biệt trong các ứng dụng hoàn toàn chạy phía client. Tuy nhiên, đây là một cách tiếp cận rất thủ công và có những nhược điểm đáng kể:

- **Effects không chạy trên server.** Điều này có nghĩa là HTML được server render ban đầu sẽ chỉ bao gồm trạng thái loading mà không có dữ liệu. Máy tính của client sẽ phải tải xuống toàn bộ JavaScript và render ứng dụng của bạn, rồi mới phát hiện rằng bây giờ nó cần tải dữ liệu. Cách này không hiệu quả lắm.
- **Việc lấy dữ liệu trực tiếp trong Effects dễ tạo ra “network waterfalls”.** Bạn render component cha, component đó lấy một số dữ liệu, render các component con, rồi các component con mới bắt đầu lấy dữ liệu của chúng. Nếu mạng không đủ nhanh, cách này chậm hơn đáng kể so với việc lấy toàn bộ dữ liệu song song.
- **Việc lấy dữ liệu trực tiếp trong Effects thường có nghĩa là bạn không preload hoặc cache dữ liệu.** Ví dụ, nếu component bị unmount rồi mount lại, nó sẽ phải lấy dữ liệu lại.
- **Cách này không thực sự thuận tiện.** Có khá nhiều boilerplate code cần viết khi sử dụng các lệnh gọi `fetch` theo cách không gặp những lỗi như [race conditions.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Danh sách nhược điểm này không chỉ riêng React mới có. Nó áp dụng cho việc lấy dữ liệu khi mount với bất kỳ thư viện nào. Cũng giống như routing, việc lấy dữ liệu không dễ thực hiện tốt, vì vậy chúng tôi khuyến nghị các cách tiếp cận sau:

- **Nếu bạn sử dụng một [framework](/learn/creating-a-react-app#full-stack-frameworks), hãy sử dụng cơ chế lấy dữ liệu tích hợp sẵn của nó.** Các framework React hiện đại đã tích hợp cơ chế lấy dữ liệu hiệu quả và không gặp những vấn đề nêu trên.
- **Nếu không, hãy cân nhắc sử dụng hoặc xây dựng một client-side cache.** Các giải pháp open source phổ biến gồm [TanStack Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), và [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Bạn cũng có thể tự xây dựng giải pháp của mình. Khi đó, bạn sẽ sử dụng Effects ở bên dưới, đồng thời thêm logic để loại bỏ các request trùng lặp, cache response và tránh network waterfalls (bằng cách preload dữ liệu hoặc đưa các yêu cầu dữ liệu lên routes).

Bạn vẫn có thể tiếp tục lấy dữ liệu trực tiếp trong Effects nếu cả hai cách tiếp cận trên đều không phù hợp với bạn.

</DeepDive>

---

### Chỉ định các dependency mang tính phản ứng {/*specifying-reactive-dependencies*/}

**Lưu ý rằng bạn không thể “chọn” các dependency của Effect.** Mọi <CodeStep step={2}>giá trị mang tính phản ứng</CodeStep> được code của Effect sử dụng đều phải được khai báo là dependency. Danh sách dependency của Effect được xác định bởi code xung quanh:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // Đây là một giá trị reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // Đây cũng là một giá trị reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect này đọc các giá trị reactive này
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ Vì vậy, bạn phải chỉ định chúng làm dependency của Effect
  // ...
}
```

Nếu `serverUrl` hoặc `roomId` thay đổi, Effect của bạn sẽ kết nối lại với chat bằng các giá trị mới.

**[Các giá trị mang tính phản ứng](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) bao gồm props và tất cả biến cũng như hàm được khai báo trực tiếp bên trong component của bạn.** Vì `roomId` và `serverUrl` là các giá trị mang tính phản ứng, bạn không thể loại bỏ chúng khỏi các dependency. Nếu bạn cố bỏ qua chúng và [linter của bạn được cấu hình đúng cho React,](/learn/editor-setup#linting) linter sẽ đánh dấu đây là một lỗi mà bạn cần sửa:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect thiếu dependency: 'roomId' và 'serverUrl'
  // ...
}
```

**Để loại bỏ một dependency, bạn cần [“chứng minh” với linter rằng dependency đó *không cần thiết*.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** Ví dụ, bạn có thể đưa `serverUrl` ra ngoài component để chứng minh rằng nó không mang tính phản ứng và sẽ không thay đổi khi re-render:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Không còn là giá trị reactive nữa

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Đã khai báo đầy đủ dependencies
  // ...
}
```

Bây giờ `serverUrl` không còn là một giá trị mang tính phản ứng (và không thể thay đổi khi re-render), nên nó không cần là một dependency. **Nếu code của Effect không sử dụng bất kỳ giá trị mang tính phản ứng nào, danh sách dependency của nó phải trống (`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Không còn là giá trị reactive nữa
const roomId = 'music'; // Không còn là giá trị reactive nữa

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Đã khai báo đầy đủ dependencies
  // ...
}
```

[Effect có dependency trống](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) sẽ không chạy lại khi bất kỳ prop hoặc state nào của component thay đổi.

<Pitfall>

Nếu bạn có một codebase hiện có, có thể bạn có một số Effect tắt cảnh báo của linter như sau:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Tránh vô hiệu hóa linter theo cách này:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Khi các dependency không khớp với code, nguy cơ phát sinh bug là rất cao.** Bằng cách tắt linter, bạn đang “nói dối” React về những giá trị mà Effect của bạn phụ thuộc vào. [Thay vào đó, hãy chứng minh rằng chúng không cần thiết.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Examples of passing reactive dependencies" titleId="examples-dependencies">

#### Truyền một dependency array {/*passing-a-dependency-array*/}

Nếu bạn chỉ định các dependency, Effect sẽ chạy **sau commit ban đầu _và_ sau các commit có dependency thay đổi.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Chạy lại nếu a hoặc b khác đi
```

Trong ví dụ bên dưới, `serverUrl` và `roomId` là các [giá trị mang tính phản ứng,](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) nên cả hai đều phải được chỉ định làm dependency. Do đó, việc chọn một room khác trong dropdown hoặc chỉnh sửa input URL của server sẽ khiến chat kết nối lại. Tuy nhiên, vì `message` không được sử dụng trong Effect (và do đó không phải là dependency), việc chỉnh sửa message sẽ không khiến chat kết nối lại.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
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
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Truyền một dependency array trống {/*passing-an-empty-dependency-array*/}

Nếu Effect của bạn thực sự không sử dụng bất kỳ giá trị mang tính phản ứng nào, nó sẽ chỉ chạy **sau commit ban đầu.**

```js {3}
useEffect(() => {
  // ...
}, []); // Không chạy lại (trừ một lần trong môi trường phát triển)
```

**Ngay cả với dependency trống, setup và cleanup vẫn sẽ [chạy thêm một lần trong development](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) để giúp bạn tìm ra bug.**


Trong ví dụ này, cả `serverUrl` và `roomId` đều được hardcode. Vì chúng được khai báo bên ngoài component, chúng không phải là các giá trị mang tính phản ứng, nên cũng không phải là dependency. Danh sách dependency trống, vì vậy Effect không chạy lại khi re-render.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
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

</Sandpack>

<Solution />


#### Không truyền dependency array {/*passing-no-dependency-array-at-all*/}

Nếu hoàn toàn không truyền dependency array, Effect sẽ chạy **sau mỗi commit của component.**

```js {3}
useEffect(() => {
  // ...
}); // Luôn chạy lại
```

Trong ví dụ này, Effect chạy lại khi bạn thay đổi `serverUrl` và `roomId`, điều này hợp lý. Tuy nhiên, nó *cũng* chạy lại khi bạn thay đổi `message`, điều có lẽ không mong muốn. Đây là lý do bạn thường sẽ chỉ định dependency array.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // Không có dependency array nào

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
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
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Cập nhật state dựa trên state trước đó từ một Effect {/*updating-state-based-on-previous-state-from-an-effect*/}

Khi muốn cập nhật state dựa trên state trước đó từ một Effect, bạn có thể gặp phải vấn đề sau:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Bạn muốn tăng bộ đếm mỗi giây...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... nhưng chỉ định `count` làm dependency luôn đặt lại interval.
  // ...
}
```

Vì `count` là một giá trị mang tính phản ứng, nó phải được chỉ định trong danh sách dependency. Tuy nhiên, điều đó khiến Effect cleanup và setup lại mỗi khi `count` thay đổi. Đây không phải là điều lý tưởng.

Để khắc phục, [hãy truyền `c => c + 1` state updater](/reference/react/useState#updating-state-based-on-the-previous-state) cho `setCount`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Truyền một state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Giờ count không còn là dependency

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Bây giờ bạn truyền `c => c + 1` thay vì `count + 1`, [Effect của bạn không còn cần phụ thuộc vào `count`.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) Nhờ thay đổi này, nó sẽ không cần cleanup và setup lại interval mỗi khi `count` thay đổi.

---

### Loại bỏ các dependency object không cần thiết {/*removing-unnecessary-object-dependencies*/}

Nếu Effect của bạn phụ thuộc vào một object hoặc function được tạo trong quá trình rendering, nó có thể chạy quá thường xuyên. Ví dụ, Effect này kết nối lại sau mỗi commit vì object `options` [khác nhau trong mỗi lần render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 Object này được tạo mới hoàn toàn ở mỗi lần re-render
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // Nó được dùng bên trong Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 Do đó, các dependency này luôn khác nhau ở mỗi lần commit
  // ...
```

Tránh sử dụng object được tạo trong quá trình rendering làm dependency. Thay vào đó, hãy tạo object bên trong Effect:

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

Bây giờ bạn tạo object `options` bên trong Effect, nên bản thân Effect chỉ phụ thuộc vào chuỗi `roomId`.

Với bản sửa này, việc nhập vào input không kết nối lại chat. Không giống như một object được tạo lại, một string như `roomId` sẽ không thay đổi trừ khi bạn gán cho nó một giá trị khác. [Đọc thêm về việc loại bỏ dependencies.](/learn/removing-effect-dependencies)

---

### Loại bỏ các dependency không cần thiết của function {/*removing-unnecessary-function-dependencies*/}

Nếu Effect của bạn phụ thuộc vào một object hoặc một function được tạo trong quá trình render, nó có thể chạy quá thường xuyên. Ví dụ: Effect này kết nối lại sau mỗi commit vì function `createOptions` [khác nhau trong mỗi lần render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 Function này được tạo mới hoàn toàn ở mỗi lần re-render
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // Nó được dùng bên trong Effect
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 Do đó, các dependency này luôn khác nhau ở mỗi lần commit
  // ...
```

Tự bản thân việc tạo một function mới trong mỗi lần re-render không phải là vấn đề. Bạn không cần tối ưu hóa việc đó. Tuy nhiên, nếu bạn sử dụng nó làm dependency của Effect, nó sẽ khiến Effect chạy lại sau mỗi commit.

Tránh sử dụng một function được tạo trong quá trình render làm dependency. Thay vào đó, hãy khai báo nó bên trong Effect:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
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

Bây giờ, khi bạn định nghĩa function `createOptions` bên trong Effect, bản thân Effect chỉ phụ thuộc vào string `roomId`. Với bản sửa này, việc nhập vào input không kết nối lại chat. Không giống như một function được tạo lại, một string như `roomId` sẽ không thay đổi trừ khi bạn gán cho nó một giá trị khác. [Đọc thêm về việc loại bỏ dependencies.](/learn/removing-effect-dependencies)

---

### Đọc props và state mới nhất từ Effect {/*reading-the-latest-props-and-state-from-an-effect*/}

Theo mặc định, khi bạn đọc một giá trị reactive từ Effect, bạn phải thêm giá trị đó làm dependency. Điều này đảm bảo Effect của bạn "phản ứng" với mọi thay đổi của giá trị đó. Với hầu hết dependency, đây là hành vi bạn mong muốn.

**Tuy nhiên, đôi khi bạn sẽ muốn đọc *props* và *state* mới nhất từ Effect mà không "phản ứng" với chúng.** Ví dụ: hãy tưởng tượng bạn muốn ghi lại số lượng item trong giỏ hàng cho mỗi lần truy cập trang:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ Đã khai báo đầy đủ dependencies
  // ...
}
```

**Nếu bạn muốn ghi lại một lần truy cập trang mới sau mỗi thay đổi của `url`, nhưng *không* ghi lại nếu chỉ `shoppingCart` thay đổi thì sao?** Bạn không thể loại trừ `shoppingCart` khỏi dependencies mà không vi phạm [các quy tắc reactivity.](#specifying-reactive-dependencies) Tuy nhiên, bạn có thể thể hiện rằng mình *không muốn* một đoạn code phản ứng với các thay đổi, dù đoạn code đó được gọi từ bên trong một Effect. [Khai báo một *Effect Event*](/learn/separating-events-from-effects#declaring-an-effect-event) bằng [`useEffectEvent`](/reference/react/useEffectEvent) Hook, rồi di chuyển đoạn code đọc `shoppingCart` vào bên trong đó:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Đã khai báo đầy đủ dependencies
  // ...
}
```

**Effect Event không reactive và luôn phải được loại trừ khỏi dependencies của Effect.** Điều này cho phép bạn đặt code không reactive (nơi bạn có thể đọc giá trị mới nhất của một số props và state) vào bên trong chúng. Bằng cách đọc `shoppingCart` bên trong `onVisit`, bạn đảm bảo rằng `shoppingCart` sẽ không chạy lại Effect của mình.

[Đọc thêm về cách Effect Event giúp bạn tách code reactive và không reactive.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

---

### Hiển thị nội dung khác nhau trên server và client {/*displaying-different-content-on-the-server-and-the-client*/}

Nếu app của bạn sử dụng server rendering (bằng cách [trực tiếp](/reference/react-dom/server) hoặc thông qua một [framework](/learn/creating-a-react-app#full-stack-frameworks)), component của bạn sẽ được render trong hai môi trường khác nhau. Trên server, nó sẽ được render để tạo HTML ban đầu. Trên client, React sẽ chạy lại code render để gắn các event handler của bạn vào HTML đó. Đây là lý do để [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) hoạt động, output render ban đầu của bạn phải giống hệt nhau trên client và server.

Trong một số trường hợp hiếm gặp, bạn có thể cần hiển thị nội dung khác nhau trên client. Ví dụ: nếu app của bạn đọc một số dữ liệu từ [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), thì server không thể thực hiện việc đó. Sau đây là cách bạn có thể triển khai:

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [5]}}
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... trả về JSX chỉ dành cho client ...
  }  else {
    // ... trả về JSX ban đầu ...
  }
}
```

Trong khi app đang tải, người dùng sẽ thấy output render ban đầu. Sau đó, khi app đã tải và được hydrated, Effect của bạn sẽ chạy và đặt `didMount` thành `true`, khiến component re-render. Điều này sẽ chuyển sang output render chỉ dành cho client. Effect không chạy trên server, đó là lý do `didMount` có giá trị `false` trong lần render ban đầu trên server.

Hãy sử dụng pattern này một cách hạn chế. Hãy nhớ rằng người dùng có kết nối chậm sẽ thấy nội dung ban đầu trong khoảng thời gian khá dài--có thể là nhiều giây--vì vậy bạn không nên tạo ra những thay đổi đột ngột về giao diện của component. Trong nhiều trường hợp, bạn có thể tránh nhu cầu này bằng cách dùng CSS để hiển thị có điều kiện các nội dung khác nhau.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Effect của tôi chạy hai lần khi component mount {/*my-effect-runs-twice-when-the-component-mounts*/}

Khi Strict Mode được bật, trong môi trường development, React sẽ chạy setup và cleanup thêm một lần trước lần setup thực tế.

Đây là một bài kiểm tra áp lực nhằm xác minh logic của Effect được triển khai chính xác. Nếu điều này gây ra các vấn đề có thể nhìn thấy, hàm cleanup của bạn đang thiếu một số logic. Hàm cleanup phải dừng hoặc hoàn tác bất kỳ việc gì mà hàm setup đã thực hiện. Nguyên tắc chung là người dùng không thể phân biệt được giữa việc setup được gọi một lần (như trong production) và chuỗi setup → cleanup → setup (như trong development).

Đọc thêm về [cách việc này giúp tìm ra bug](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) và [cách sửa logic của bạn.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Effect của tôi chạy sau mỗi lần re-render {/*my-effect-runs-after-every-re-render*/}

Trước tiên, hãy kiểm tra xem bạn có quên chỉ định dependency array hay không:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 Không có dependency array: chạy lại sau mỗi lần commit!
```

Nếu bạn đã chỉ định dependency array nhưng Effect vẫn chạy lại theo vòng lặp, đó là vì một trong các dependency của bạn khác nhau trong mỗi lần re-render.

Bạn có thể debug vấn đề này bằng cách ghi thủ công các dependency vào console:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

Sau đó, bạn có thể nhấp chuột phải vào các array từ những lần re-render khác nhau trong console và chọn "Store as a global variable" cho cả hai array. Giả sử array đầu tiên được lưu dưới tên `temp1` và array thứ hai được lưu dưới tên `temp2`, bạn có thể dùng browser console để kiểm tra xem từng dependency trong cả hai array có giống nhau hay không:

```js
Object.is(temp1[0], temp2[0]); // Dependency đầu tiên có giống nhau giữa các mảng không?
Object.is(temp1[1], temp2[1]); // Dependency thứ hai có giống nhau giữa các mảng không?
Object.is(temp1[2], temp2[2]); // ... và tiếp tục như vậy cho mỗi dependency ...
```

Khi tìm thấy dependency khác nhau trong mỗi lần re-render, bạn thường có thể khắc phục theo một trong các cách sau:

- [Cập nhật state dựa trên state trước đó từ một Effect](#updating-state-based-on-previous-state-from-an-effect)
- [Loại bỏ các dependency object không cần thiết](#removing-unnecessary-object-dependencies)
- [Loại bỏ các dependency function không cần thiết](#removing-unnecessary-function-dependencies)
- [Đọc props và state mới nhất từ một Effect](#reading-the-latest-props-and-state-from-an-effect)

Nếu không còn cách nào khác (nếu các phương pháp này không giúp ích), hãy bọc việc tạo nó bằng [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) hoặc [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (đối với function).

---

### Effect của tôi liên tục chạy lại trong một chu kỳ vô hạn {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Nếu Effect của bạn chạy trong một chu kỳ vô hạn, hai điều sau phải đúng:

- Effect của bạn đang cập nhật một state.
- State đó dẫn đến một lần re-render, khiến các dependency của Effect thay đổi.

Trước khi bắt đầu sửa vấn đề, hãy tự hỏi liệu Effect của bạn có đang kết nối với một hệ thống bên ngoài nào đó (chẳng hạn như DOM, network, widget bên thứ ba, v.v.) hay không. Tại sao Effect của bạn cần set state? Nó có đồng bộ với hệ thống bên ngoài đó không? Hay bạn đang cố quản lý data flow của app bằng Effect?

Nếu không có hệ thống bên ngoài nào, hãy cân nhắc liệu [loại bỏ hoàn toàn Effect](/learn/you-might-not-need-an-effect) có giúp đơn giản hóa logic của bạn hay không.

Nếu bạn thực sự đang đồng bộ với một hệ thống bên ngoài, hãy suy nghĩ xem tại sao và trong điều kiện nào Effect của bạn nên cập nhật state. Có điều gì đã thay đổi và ảnh hưởng đến output trực quan của component không? Nếu bạn cần theo dõi một số dữ liệu không được dùng cho rendering, một [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (không trigger re-render) có thể phù hợp hơn. Hãy xác minh rằng Effect của bạn không cập nhật state (và trigger re-render) nhiều hơn mức cần thiết.

Cuối cùng, nếu Effect của bạn đang cập nhật state đúng thời điểm nhưng vẫn có vòng lặp, đó là vì việc cập nhật state này khiến một trong các dependency của Effect thay đổi. [Đọc cách debug các thay đổi của dependency.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### Logic cleanup của tôi chạy dù component chưa unmount {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}Hàm cleanup chạy không chỉ trong quá trình unmount, mà còn trước mỗi lần re-render khi các dependency thay đổi. Ngoài ra, trong môi trường development, React [chạy setup+cleanup thêm một lần ngay sau khi component mount.](#my-effect-runs-twice-when-the-component-mounts)

Nếu bạn có code cleanup mà không có code setup tương ứng, đó thường là một code smell:

```js {2-5}
useEffect(() => {
  // 🔴 Tránh: logic cleanup không có logic thiết lập tương ứng
  return () => {
    doSomething();
  };
}, []);
```

Logic cleanup của bạn nên “đối xứng” với logic setup và phải dừng hoặc hoàn tác bất kỳ điều gì mà setup đã thực hiện:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Tìm hiểu vòng đời của Effect khác với vòng đời của component như thế nào.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Effect của tôi thực hiện một thao tác trực quan và tôi thấy hiện tượng nhấp nháy trước khi nó chạy {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Nếu Effect của bạn phải ngăn trình duyệt [vẽ màn hình,](/learn/render-and-commit#epilogue-browser-paint) hãy thay `useEffect` bằng [`useLayoutEffect`](/reference/react/useLayoutEffect). Lưu ý rằng **điều này không cần thiết đối với phần lớn các Effect.** Bạn chỉ cần làm vậy nếu việc chạy Effect trước khi trình duyệt vẽ màn hình là tối quan trọng—ví dụ: để đo và định vị tooltip trước khi người dùng nhìn thấy nó.
