---
title: 'Tái sử dụng logic với Custom Hook'
---

<Intro>

React đi kèm với một số Hook tích hợp sẵn như `useState`, `useContext` và `useEffect`. Đôi khi, bạn sẽ mong có một Hook cho một mục đích cụ thể hơn: chẳng hạn như lấy dữ liệu, theo dõi xem người dùng có đang online hay không, hoặc kết nối với một phòng chat. Bạn có thể không tìm thấy những Hook này trong React, nhưng bạn có thể tự tạo Hook cho nhu cầu của ứng dụng.

</Intro>

<YouWillLearn>

- Custom Hook là gì và cách tự viết Custom Hook
- Cách tái sử dụng logic giữa các component
- Cách đặt tên và cấu trúc Custom Hook
- Khi nào và tại sao nên tách logic thành Custom Hook

</YouWillLearn>

## Custom Hook: Chia sẻ logic giữa các component {/*custom-hooks-sharing-logic-between-components*/}

Hãy tưởng tượng bạn đang phát triển một ứng dụng phụ thuộc nhiều vào mạng (như hầu hết các ứng dụng). Bạn muốn cảnh báo người dùng nếu kết nối mạng của họ vô tình bị ngắt trong lúc họ đang sử dụng ứng dụng. Bạn sẽ thực hiện việc này như thế nào? Có vẻ như bạn sẽ cần hai thứ trong component:

1. Một state theo dõi xem mạng có đang online hay không.
2. Một Effect đăng ký các sự kiện [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) và [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) toàn cục, rồi cập nhật state đó.

Điều này sẽ giữ cho component của bạn [đồng bộ](/learn/synchronizing-with-effects) với trạng thái mạng. Bạn có thể bắt đầu bằng đoạn mã như sau:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

Hãy thử bật và tắt mạng, rồi quan sát cách `StatusBar` này cập nhật theo thao tác của bạn.

Bây giờ hãy tưởng tượng bạn *cũng* muốn sử dụng cùng logic đó trong một component khác. Bạn muốn triển khai một nút Save, nút này sẽ bị vô hiệu hóa và hiển thị "Reconnecting..." thay cho "Save" khi mạng bị ngắt.

Để bắt đầu, bạn có thể sao chép và dán state `isOnline` cùng Effect vào `SaveButton`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

Hãy xác minh rằng khi bạn tắt mạng, nút sẽ thay đổi giao diện.

Hai component này hoạt động tốt, nhưng việc lặp lại logic giữa chúng thật đáng tiếc. Có vẻ như dù chúng có *giao diện khác nhau,* bạn vẫn muốn tái sử dụng logic giữa chúng.

### Tách Custom Hook của riêng bạn từ một component {/*extracting-your-own-custom-hook-from-a-component*/}

Hãy tạm tưởng tượng rằng, tương tự như [`useState`](/reference/react/useState) và [`useEffect`](/reference/react/useEffect), có một Hook `useOnlineStatus` tích hợp sẵn. Khi đó, cả hai component này có thể được đơn giản hóa và bạn có thể loại bỏ phần logic lặp lại giữa chúng:

```js {2,7}
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
```

Mặc dù không có Hook tích hợp sẵn như vậy, bạn có thể tự viết nó. Khai báo một hàm có tên `useOnlineStatus` và chuyển toàn bộ mã bị lặp từ các component bạn đã viết trước đó vào hàm này:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Ở cuối hàm, trả về `isOnline`. Điều này cho phép các component đọc giá trị đó:

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
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Hãy xác minh rằng việc bật và tắt mạng sẽ cập nhật cả hai component.

Giờ đây, các component của bạn không còn nhiều logic lặp lại như trước. **Quan trọng hơn, mã bên trong chúng mô tả *điều chúng muốn làm* (sử dụng trạng thái online!) thay vì *cách thực hiện* (bằng cách đăng ký các sự kiện của trình duyệt).**

Khi tách logic thành Custom Hook, bạn có thể che giấu những chi tiết rắc rối về cách xử lý một hệ thống bên ngoài hoặc API của trình duyệt. Mã trong các component thể hiện ý định của bạn, không phải cách triển khai.

### Tên Hook luôn bắt đầu bằng `use` {/*hook-names-always-start-with-use*/}

Ứng dụng React được xây dựng từ các component. Các component được xây dựng từ Hook, dù là Hook tích hợp sẵn hay Custom Hook. Có thể bạn sẽ thường xuyên sử dụng Custom Hook do người khác tạo, nhưng đôi khi bạn cũng có thể tự viết một Hook!

Bạn phải tuân theo các quy ước đặt tên sau:

1. **Tên component React phải bắt đầu bằng một chữ cái viết hoa,** chẳng hạn như `StatusBar` và `SaveButton`. Component React cũng cần trả về thứ mà React biết cách hiển thị, chẳng hạn như một đoạn JSX.
2. **Tên Hook phải bắt đầu bằng `use` theo sau là một chữ cái viết hoa,** chẳng hạn như [`useState`](/reference/react/useState) (tích hợp sẵn) hoặc `useOnlineStatus` (tùy chỉnh, như ở phần trước). Hook có thể trả về các giá trị bất kỳ.

Quy ước này đảm bảo rằng bạn luôn có thể nhìn vào một component và biết state, Effect cùng các tính năng React khác có thể đang "ẩn" ở đâu. Ví dụ, nếu thấy một lệnh gọi hàm `getColor()` bên trong component, bạn có thể chắc chắn rằng nó không thể chứa state React, vì tên của nó không bắt đầu bằng `use`. Tuy nhiên, một lệnh gọi hàm như `useOnlineStatus()` rất có thể sẽ chứa các lệnh gọi đến những Hook khác bên trong!

<Note>

Nếu linter của bạn được [cấu hình cho React,](/learn/editor-setup#linting) nó sẽ thực thi quy ước đặt tên này. Cuộn lên sandbox ở trên và đổi tên `useOnlineStatus` thành `getOnlineStatus`. Hãy chú ý rằng linter sẽ không còn cho phép bạn gọi `useState` hoặc `useEffect` bên trong nó nữa. Chỉ Hook và component mới có thể gọi các Hook khác!

</Note>

<DeepDive>

#### Có phải mọi hàm được gọi trong quá trình render đều phải bắt đầu bằng tiền tố use không? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

Không. Những hàm không *gọi* Hook thì không cần *là* Hook.

Nếu hàm của bạn không gọi Hook nào, hãy tránh tiền tố `use`. Thay vào đó, hãy viết nó như một hàm thông thường *không có* tiền tố `use`. Ví dụ, `useSorted` bên dưới không gọi Hook nào, vì vậy hãy gọi nó là `getSorted`:

```js
// 🔴 Tránh: Hook không dùng Hook nào
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Tốt: Hàm thông thường không dùng Hook nào
function getSorted(items) {
  return items.slice().sort();
}
```

Điều này đảm bảo mã của bạn có thể gọi hàm thông thường này ở bất kỳ đâu, kể cả trong các điều kiện:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ Có thể gọi getSorted() có điều kiện vì nó không phải Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

Bạn nên thêm tiền tố `use` cho một hàm (và do đó biến nó thành một Hook) nếu bên trong nó sử dụng ít nhất một Hook:

```js
// ✅ Tốt: Hook dùng các Hook khác
function useAuth() {
  return useContext(Auth);
}
```

Về mặt kỹ thuật, React không bắt buộc điều này. Về nguyên tắc, bạn có thể tạo một Hook không gọi các Hook khác. Cách này thường gây khó hiểu và hạn chế, vì vậy tốt nhất nên tránh. Tuy nhiên, có thể có những trường hợp hiếm hoi mà nó hữu ích. Ví dụ, có thể hiện tại hàm của bạn chưa sử dụng Hook nào, nhưng bạn dự định thêm một số lệnh gọi Hook vào đó trong tương lai. Khi đó, việc đặt tên cho nó bằng tiền tố `use` là hợp lý:

```js {3-4}
// ✅ Tốt: Hook có thể sẽ dùng một số Hook khác sau này
function useAuth() {
  // TODO: Thay bằng dòng này khi đã triển khai xác thực:
  // return useContext(Auth);
  return TEST_USER;
}
```

Khi đó, các component sẽ không thể gọi nó một cách có điều kiện. Điều này sẽ trở nên quan trọng khi bạn thực sự thêm các lệnh gọi Hook vào bên trong. Nếu bạn không dự định sử dụng Hook bên trong nó (hiện tại hoặc sau này), đừng biến nó thành một Hook.

</DeepDive>

### Custom Hook giúp bạn chia sẻ logic có state, không phải bản thân state {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

Trong ví dụ trước, khi bạn bật và tắt mạng, cả hai component đều cập nhật cùng nhau. Tuy nhiên, sẽ sai nếu nghĩ rằng một biến state `isOnline` duy nhất được chia sẻ giữa chúng. Hãy xem đoạn mã này:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Nó hoạt động giống hệt như trước khi bạn tách phần mã lặp lại:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

Đây là hai biến state và Effect hoàn toàn độc lập! Chúng tình cờ có cùng giá trị tại cùng một thời điểm vì bạn đã đồng bộ chúng với cùng một giá trị bên ngoài (mạng có đang bật hay không).

Để minh họa rõ hơn, chúng ta cần một ví dụ khác. Hãy xem component `Form` này:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Có một số logic lặp lại cho mỗi trường biểu mẫu:

1. Có một state (`firstName` và `lastName`).
1. Có một change handler (`handleFirstNameChange` và `handleLastNameChange`).
1. Có một đoạn JSX chỉ định các thuộc tính `value` và `onChange` cho input đó.

Bạn có thể tách logic lặp lại thành Custom Hook `useFormInput` này:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Hãy chú ý rằng nó chỉ khai báo *một* biến state có tên `value`.

Tuy nhiên, component `Form` gọi `useFormInput` *hai lần:*

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

Đây là lý do nó hoạt động giống như việc khai báo hai biến state riêng biệt!

**Custom Hook cho phép bạn chia sẻ *logic có state* nhưng không chia sẻ *bản thân state.* Mỗi lần gọi một Hook hoàn toàn độc lập với mọi lần gọi khác đến cùng Hook đó.** Đây là lý do hai sandbox ở trên hoàn toàn tương đương. Nếu muốn, hãy cuộn lên và so sánh chúng. Hành vi trước và sau khi tách thành Custom Hook là giống hệt nhau.

Khi cần chia sẻ chính state giữa nhiều component, [đưa state lên component cha và truyền xuống](/learn/sharing-state-between-components) thay vào đó.

## Truyền các giá trị reactive giữa các Hook {/*passing-reactive-values-between-hooks*/}

Mã bên trong các custom Hook của bạn sẽ chạy lại trong mỗi lần component được re-render. Đây là lý do vì sao, cũng giống như component, custom Hook [cần phải thuần khiết.](/learn/keeping-components-pure) Hãy coi mã của custom Hook là một phần trong phần thân của component!

Vì custom Hook được re-render cùng với component, chúng luôn nhận được props và state mới nhất. Để thấy điều này có nghĩa là gì, hãy xem xét ví dụ về phòng chat sau. Hãy thay đổi URL của server hoặc phòng chat:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Khi bạn thay đổi `serverUrl` hoặc `roomId`, Effect ["phản ứng" với các thay đổi của bạn](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) và đồng bộ hóa lại. Bạn có thể nhận thấy qua các thông báo trong console rằng chat kết nối lại mỗi khi bạn thay đổi các dependency của Effect.

Bây giờ hãy chuyển mã của Effect vào một custom Hook:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Điều này cho phép component `ChatRoom` gọi custom Hook của bạn mà không cần quan tâm đến cách nó hoạt động bên trong:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

Trông đơn giản hơn nhiều! (Nhưng nó thực hiện đúng việc như trước.)

Hãy chú ý rằng logic *vẫn phản hồi* với các thay đổi của prop và state. Hãy thử chỉnh sửa URL của server hoặc phòng được chọn:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Hãy chú ý cách bạn lấy giá trị trả về của một Hook:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

và truyền nó làm đầu vào cho một Hook khác:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Mỗi khi component `ChatRoom` của bạn re-render, nó sẽ truyền `roomId` và `serverUrl` mới nhất vào Hook của bạn. Đây là lý do Effect của bạn kết nối lại với chat bất cứ khi nào các giá trị của chúng khác đi sau một lần re-render. (Nếu bạn từng làm việc với phần mềm xử lý audio hoặc video, việc xâu chuỗi các Hook như thế này có thể khiến bạn liên tưởng đến việc xâu chuỗi các hiệu ứng hình ảnh hoặc audio. Cứ như thể đầu ra của `useState` được "truyền vào" đầu vào của `useChatRoom`.)

### Truyền event handler cho custom Hook {/*passing-event-handlers-to-custom-hooks*/}

Khi bắt đầu sử dụng `useChatRoom` trong nhiều component hơn, bạn có thể muốn cho phép các component tùy chỉnh hành vi của nó. Ví dụ: hiện tại, logic xử lý khi một message đến đang được hardcode bên trong Hook:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Giả sử bạn muốn chuyển logic này trở lại component:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

Để việc này hoạt động, hãy thay đổi custom Hook để nhận `onReceiveMessage` như một trong các named option của nó:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ Đã khai báo tất cả dependency
}
```

Cách này sẽ hoạt động, nhưng bạn có thể cải thiện thêm một điểm khi custom Hook nhận event handler.

Việc thêm dependency vào `onReceiveMessage` không phải là lý tưởng vì nó sẽ khiến chat kết nối lại mỗi khi component re-render. [Hãy bọc event handler này trong một Effect Event để loại bỏ nó khỏi các dependency:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Đã khai báo tất cả dependency
}
```

Bây giờ chat sẽ không kết nối lại mỗi khi component `ChatRoom` re-render. Dưới đây là một demo hoàn chỉnh, hoạt động được, về việc truyền event handler cho một custom Hook để bạn có thể tự thử:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Hãy chú ý rằng bạn không còn cần biết `useChatRoom` hoạt động *như thế nào* để sử dụng nó. Bạn có thể thêm nó vào bất kỳ component nào khác, truyền vào bất kỳ option nào khác, và nó vẫn hoạt động theo cùng một cách. Đó chính là sức mạnh của custom Hook.

## Khi nào nên sử dụng custom Hook {/*when-to-use-custom-hooks*/}

Bạn không cần tách một custom Hook cho mọi đoạn mã nhỏ bị lặp lại. Một số phần trùng lặp là hoàn toàn ổn. Ví dụ, việc tách một Hook `useFormInput` để bọc một lời gọi `useState` duy nhất như trước đây có lẽ là không cần thiết.

Tuy nhiên, bất cứ khi nào viết một Effect, hãy cân nhắc xem việc bọc nó trong một custom Hook có làm code rõ ràng hơn không. [Bạn không nên cần đến Effect quá thường xuyên,](/learn/you-might-not-need-an-effect) vì vậy nếu bạn đang viết một Effect, điều đó có nghĩa là bạn cần "bước ra ngoài React" để đồng bộ với một hệ thống bên ngoài nào đó hoặc thực hiện việc mà React không có API tích hợp sẵn. Bọc nó trong một custom Hook giúp bạn truyền đạt chính xác mục đích của mình và cách dữ liệu đi qua nó.

Ví dụ, hãy xem xét một component `ShippingForm` hiển thị hai dropdown: một dropdown hiển thị danh sách thành phố, dropdown còn lại hiển thị danh sách khu vực trong thành phố được chọn. Bạn có thể bắt đầu với đoạn code trông như sau:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // Effect này lấy các thành phố của một quốc gia
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // Effect này lấy các khu vực của thành phố đã chọn
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

Mặc dù đoạn code này khá lặp lại, [việc giữ các Effect này tách biệt với nhau là đúng.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Chúng đồng bộ hai thứ khác nhau, vì vậy bạn không nên gộp chúng vào một Effect. Thay vào đó, bạn có thể đơn giản hóa component `ShippingForm` ở trên bằng cách tách logic chung giữa chúng thành custom Hook `useData` của riêng mình:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Bây giờ bạn có thể thay thế cả hai Effect trong các component `ShippingForm` bằng những lời gọi đến `useData`:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Việc tách một custom Hook khiến luồng dữ liệu trở nên rõ ràng. Bạn truyền `url` vào và nhận `data` ra. Bằng cách "ẩn" Effect bên trong `useData`, bạn cũng ngăn người làm việc trên component `ShippingForm` thêm các [dependency không cần thiết](/learn/removing-effect-dependencies) vào đó. Theo thời gian, phần lớn Effect trong app của bạn sẽ nằm trong các custom Hook.

<DeepDive>

#### Tập trung custom Hook vào các use case cấp cao, cụ thể {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Hãy bắt đầu bằng việc chọn tên cho custom Hook. Nếu bạn gặp khó khăn khi chọn một cái tên rõ ràng, điều đó có thể có nghĩa là Effect của bạn đang liên kết quá chặt với phần logic còn lại của component và chưa sẵn sàng để tách ra.

Lý tưởng nhất là tên custom Hook phải đủ rõ ràng để ngay cả người không thường xuyên viết code cũng có thể đoán được custom Hook của bạn làm gì, nhận gì và trả về gì:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

Khi đồng bộ với một hệ thống bên ngoài, tên custom Hook của bạn có thể mang tính kỹ thuật hơn và sử dụng các thuật ngữ chuyên ngành riêng của hệ thống đó. Điều này hoàn toàn ổn miễn là người quen thuộc với hệ thống đó có thể hiểu rõ:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Hãy tập trung custom Hook vào các use case cấp cao, cụ thể.** Tránh tạo và sử dụng các custom "lifecycle" Hook hoạt động như những API thay thế và wrapper tiện lợi cho chính API `useEffect`:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

Ví dụ, Hook `useMount` này cố gắng đảm bảo rằng một đoạn code chỉ chạy "khi mount":

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Tránh: dùng các Hook "lifecycle" tùy chỉnh
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Tránh: tạo các Hook "lifecycle" tùy chỉnh
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
}
```

**Các custom "lifecycle" Hook như `useMount` không phù hợp với mô hình React.** Ví dụ, đoạn code này có một lỗi (nó không "phản ứng" với các thay đổi của `roomId` hoặc `serverUrl`), nhưng linter sẽ không cảnh báo bạn vì linter chỉ kiểm tra các lời gọi `useEffect` trực tiếp. Nó không biết về Hook của bạn.

Nếu bạn đang viết một Effect, hãy bắt đầu bằng cách sử dụng trực tiếp API của React:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Tốt: hai Effect thô được tách theo mục đích

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Sau đó, bạn có thể (nhưng không bắt buộc) tách các custom Hook cho những use case cấp cao khác nhau:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Rất tốt: Hook tùy chỉnh được đặt tên theo mục đích
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Một custom Hook tốt giúp code gọi nó mang tính khai báo hơn bằng cách giới hạn những gì nó có thể thực hiện.** Ví dụ, `useChatRoom(options)` chỉ có thể kết nối với phòng chat, còn `useImpressionLog(eventName, extraData)` chỉ có thể gửi log impression đến analytics. Nếu API của custom Hook không giới hạn các use case và quá trừu tượng, về lâu dài, nhiều khả năng nó sẽ tạo ra nhiều vấn đề hơn là giải quyết được.

</DeepDive>

### Custom Hook giúp bạn chuyển sang các pattern tốt hơn {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Effect là một ["lối thoát"](/learn/escape-hatches): bạn sử dụng chúng khi cần "bước ra ngoài React" và khi không có giải pháp tích hợp nào tốt hơn cho use case của mình. Theo thời gian, mục tiêu của đội ngũ React là giảm số lượng Effect trong app của bạn xuống mức tối thiểu bằng cách cung cấp các giải pháp cụ thể hơn cho những vấn đề cụ thể hơn. Việc bọc Effect trong các custom Hook giúp bạn dễ dàng nâng cấp code khi những giải pháp này trở nên khả dụng.

Hãy quay lại ví dụ này:

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

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Trong ví dụ trên, `useOnlineStatus` được triển khai bằng một cặp [`useState`](/reference/react/useState) và [`useEffect`.](/reference/react/useEffect) Tuy nhiên, đây không phải là giải pháp tốt nhất có thể. Có một số trường hợp đặc biệt mà nó chưa xem xét. Ví dụ, nó giả định rằng khi component được mount, `isOnline` đã là `true`, nhưng điều này có thể không đúng nếu mạng đã bị ngắt kết nối trước đó. Bạn có thể sử dụng API [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) của trình duyệt để kiểm tra điều đó, nhưng sử dụng trực tiếp API này sẽ không hoạt động trên server khi tạo HTML ban đầu. Tóm lại, đoạn code này có thể được cải thiện.

React cung cấp một API chuyên dụng có tên là [`useSyncExternalStore`](/reference/react/useSyncExternalStore), API này xử lý tất cả các vấn đề trên cho bạn. Sau đây là `useOnlineStatus` Hook của bạn, được viết lại để tận dụng API mới này:

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

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // Cách lấy giá trị ở client
    () => true // Cách lấy giá trị ở server
  );
}

```

</Sandpack>

Lưu ý rằng **bạn không cần thay đổi bất kỳ component nào** để thực hiện quá trình chuyển đổi này:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Đây là một lý do khác khiến việc bọc các Effect trong custom Hook thường có lợi:

1. Bạn làm cho luồng dữ liệu đi vào và đi ra khỏi các Effect trở nên thật rõ ràng.
2. Bạn giúp các component tập trung vào ý định thay vì cách triển khai chính xác của các Effect.
3. Khi React thêm các tính năng mới, bạn có thể loại bỏ các Effect đó mà không cần thay đổi bất kỳ component nào.

Tương tự như [design system,](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), bạn có thể thấy hữu ích khi bắt đầu tách các idiom phổ biến từ các component trong ứng dụng thành các custom Hook. Điều này sẽ giúp code của các component tập trung vào ý định, đồng thời giúp bạn tránh thường xuyên phải viết các Effect thô. Cộng đồng React đang duy trì nhiều custom Hook xuất sắc.

<DeepDive>

#### React có cung cấp giải pháp tích hợp sẵn nào cho việc fetch dữ liệu không? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

Hiện nay, với API [`use`](/reference/react/use#streaming-data-from-server-to-client), dữ liệu có thể được đọc trong quá trình render bằng cách truyền một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) vào `use`:

```js {1,4,11}
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

Chúng tôi vẫn đang hoàn thiện các chi tiết, nhưng dự kiến trong tương lai, bạn sẽ viết logic fetch dữ liệu như sau:

```js {1,4,6}
import { use } from 'react';

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

Nếu bạn sử dụng các custom Hook như `useData` ở trên trong ứng dụng, bạn sẽ cần ít thay đổi hơn để chuyển sang cách tiếp cận được khuyến nghị sau này so với việc tự viết các Effect thô trong từng component. Tuy nhiên, cách tiếp cận cũ vẫn sẽ hoạt động tốt, vì vậy nếu bạn thấy thoải mái khi viết các Effect thô, bạn có thể tiếp tục làm như vậy.

</DeepDive>

### Có nhiều hơn một cách để thực hiện {/*there-is-more-than-one-way-to-do-it*/}

Giả sử bạn muốn tự triển khai một animation fade-in *từ đầu* bằng API [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) của trình duyệt. Bạn có thể bắt đầu với một Effect thiết lập vòng lặp animation. Trong mỗi frame của animation, bạn có thể thay đổi độ mờ của node DOM mà bạn [hold in a ref](/learn/manipulating-the-dom-with-refs) cho đến khi đạt `1`. Code của bạn có thể bắt đầu như sau:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Vẫn còn các frame cần vẽ
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
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

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Để component dễ đọc hơn, bạn có thể tách logic này vào một `useFadeIn` custom Hook:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Vẫn còn các frame cần vẽ
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Bạn có thể giữ nguyên code `useFadeIn`, nhưng cũng có thể refactor thêm. Ví dụ, bạn có thể tách logic thiết lập vòng lặp animation ra khỏi `useFadeIn` và đưa vào một custom `useAnimationLoop` Hook:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Tuy nhiên, bạn *không bắt buộc* phải làm vậy. Cũng như với các hàm thông thường, cuối cùng bạn là người quyết định ranh giới giữa các phần khác nhau trong code của mình. Bạn cũng có thể chọn một cách tiếp cận rất khác. Thay vì giữ logic trong Effect, bạn có thể chuyển phần lớn logic mang tính imperative vào một [class:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Effect cho phép bạn kết nối React với các hệ thống bên ngoài. Càng cần nhiều sự phối hợp giữa các Effect (ví dụ: để nối chuỗi nhiều animation), việc tách hoàn toàn logic đó khỏi các Effect và Hook, như trong sandbox ở trên, càng trở nên hợp lý. Khi đó, code bạn đã tách *trở thành* “hệ thống bên ngoài”. Điều này giúp các Effect của bạn vẫn đơn giản, vì chúng chỉ cần gửi message đến hệ thống mà bạn đã chuyển ra ngoài React.

Các ví dụ trên giả định rằng logic fade-in cần được viết bằng JavaScript. Tuy nhiên, animation fade-in cụ thể này vừa đơn giản hơn vừa hiệu quả hơn nhiều nếu được triển khai bằng một [CSS Animation thuần túy:](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
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

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

Đôi khi, bạn thậm chí không cần một Hook!

<Recap>

- Custom Hook cho phép bạn chia sẻ logic giữa các component.
- Custom Hook phải được đặt tên bắt đầu bằng `use` theo sau là một chữ cái viết hoa.
- Custom Hook chỉ chia sẻ logic có state, không chia sẻ chính state đó.
- Bạn có thể truyền các giá trị reactive từ Hook này sang Hook khác, và chúng sẽ luôn được cập nhật.
- Tất cả Hook đều chạy lại mỗi khi component của bạn re-render.
- Code của custom Hook phải pure, giống như code của component.
- Bọc các event handler nhận được bởi custom Hook trong Effect Event.
- Không tạo các custom Hook như `useMount`. Hãy giữ mục đích của chúng cụ thể.
- Bạn có toàn quyền quyết định cách thức và vị trí xác định ranh giới cho code của mình.

</Recap>

<Challenges>

#### Tách một `useCounter` Hook {/*extract-a-usecounter-hook*/}

Component này sử dụng một biến state và một Effect để hiển thị một số tăng lên mỗi giây. Hãy tách logic này thành một custom Hook có tên là `useCounter`. Mục tiêu của bạn là làm cho phần triển khai component `Counter` trông chính xác như sau:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

Bạn cần viết custom Hook trong `useCounter.js` và import nó vào file `App.js`.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
// Hãy viết Hook tùy chỉnh của bạn trong tệp này!
```

</Sandpack>

<Solution>

Code của bạn sẽ trông như sau:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Lưu ý rằng `App.js` không còn cần import `useState` hoặc `useEffect` nữa.

</Solution>

#### Cho phép cấu hình delay của counter {/*make-the-counter-delay-configurable*/}

Trong ví dụ này, có một biến state `delay` được điều khiển bằng một thanh trượt, nhưng giá trị của nó không được sử dụng. Hãy truyền giá trị `delay` vào `useCounter` custom Hook của bạn, rồi thay đổi `useCounter` Hook để sử dụng `delay` được truyền vào thay vì hardcode `1000` ms.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Truyền `delay` vào Hook bằng `useCounter(delay)`. Sau đó, bên trong Hook, sử dụng `delay` thay cho giá trị `1000` được hardcode. Bạn cần thêm `delay` vào dependencies của Effect. Điều này đảm bảo rằng khi `delay` thay đổi, interval sẽ được reset.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Tách `useInterval` ra khỏi `useCounter` {/*extract-useinterval-out-of-usecounter*/}

Hiện tại, `useCounter` Hook của bạn thực hiện hai việc. Nó thiết lập một interval, đồng thời tăng một biến state sau mỗi lần interval tick. Hãy tách logic thiết lập interval thành một Hook riêng có tên là `useInterval`. Hook này nhận hai đối số: callback `onTick` và `delay`. Sau thay đổi này, phần triển khai `useCounter` của bạn sẽ trông như sau:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Viết `useInterval` trong file `useInterval.js` và import nó vào file `useCounter.js`.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Hãy viết Hook của bạn ở đây!
```

</Sandpack>

<Solution>

Logic bên trong `useInterval` phải thiết lập và xóa interval. Nó không cần làm gì khác.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Lưu ý rằng giải pháp này có một vấn đề nhỏ, bạn sẽ giải quyết vấn đề đó trong thử thách tiếp theo.

</Solution>

#### Sửa interval bị reset {/*fix-a-resetting-interval*/}

Trong ví dụ này, có *hai* interval riêng biệt.

Component `App` gọi `useCounter`, và hàm này gọi `useInterval` để cập nhật bộ đếm mỗi giây. Nhưng component `App` *cũng* gọi `useInterval` để cập nhật ngẫu nhiên màu nền của trang mỗi hai giây.

Vì một lý do nào đó, callback cập nhật nền trang không bao giờ chạy. Hãy thêm một số log vào bên trong `useInterval`:

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Các log có khớp với điều bạn mong đợi không? Nếu một số Effect của bạn dường như đồng bộ hóa lại không cần thiết, bạn có đoán được dependency nào đang gây ra điều đó không? Có cách nào để [xóa dependency đó](/learn/removing-effect-dependencies) khỏi Effect không?

Sau khi sửa lỗi, bạn sẽ thấy nền trang được cập nhật sau mỗi hai giây.

<Hint>

Có vẻ như Hook `useInterval` nhận một event listener làm đối số. Bạn có nghĩ ra cách nào để bọc event listener đó lại, để nó không cần phải là dependency của Effect không?

</Hint>

<Sandpack>

```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

Bên trong `useInterval`, hãy bọc callback tick vào một Effect Event, giống như bạn đã làm [ở phần trước trên trang này.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)

Điều này cho phép bạn bỏ qua `onTick` khỏi các dependency của Effect. Effect sẽ không đồng bộ hóa lại sau mỗi lần component re-render, vì vậy interval thay đổi màu nền trang sẽ không bị reset mỗi giây trước khi có cơ hội chạy.

Với thay đổi này, cả hai interval đều hoạt động như mong đợi và không ảnh hưởng lẫn nhau:

<Sandpack>


```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Triển khai chuyển động so le {/*implement-a-staggering-movement*/}

Trong ví dụ này, Hook `usePointerPosition()` theo dõi vị trí con trỏ hiện tại. Hãy thử di chuyển con trỏ hoặc ngón tay trên khu vực xem trước và quan sát chấm đỏ di chuyển theo. Vị trí của nó được lưu trong biến `pos1`.

Thực tế, có năm (!) chấm đỏ khác nhau đang được render. Bạn không nhìn thấy chúng vì hiện tại tất cả đều xuất hiện ở cùng một vị trí. Đây là điều bạn cần sửa. Thay vào đó, bạn cần triển khai chuyển động “so le”: mỗi chấm sẽ “đi theo” quỹ đạo của chấm trước đó. Ví dụ, nếu bạn di chuyển nhanh con trỏ, chấm đầu tiên sẽ đi theo ngay lập tức, chấm thứ hai sẽ đi theo chấm đầu tiên với một khoảng trễ nhỏ, chấm thứ ba sẽ đi theo chấm thứ hai, v.v.

Bạn cần triển khai custom Hook `useDelayedValue`. Hiện tại, implementation của nó trả về `value` được truyền vào. Thay vào đó, bạn muốn trả về giá trị từ `delay` mili giây trước. Bạn có thể cần một state và một Effect để thực hiện việc này.

Sau khi triển khai `useDelayedValue`, bạn sẽ thấy các chấm di chuyển nối tiếp nhau.

<Hint>

Bạn cần lưu `delayedValue` dưới dạng một state variable bên trong custom Hook. Khi `value` thay đổi, bạn sẽ muốn chạy một Effect. Effect này phải cập nhật `delayedValue` sau `delay`. Bạn có thể thấy hữu ích khi gọi `setTimeout`.

Effect này có cần cleanup không? Tại sao có hoặc tại sao không?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Triển khai Hook này
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Đây là một phiên bản hoạt động. Bạn giữ `delayedValue` dưới dạng một state variable. Khi `value` được cập nhật, Effect của bạn lên lịch một timeout để cập nhật `delayedValue`. Đây là lý do `delayedValue` luôn “chậm hơn” `value` thực tế.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

Lưu ý rằng Effect này *không* cần cleanup. Nếu bạn gọi `clearTimeout` trong hàm cleanup, thì mỗi khi `value` thay đổi, nó sẽ reset timeout đã được lên lịch. Để chuyển động diễn ra liên tục, bạn muốn tất cả timeout đều chạy.

</Solution>

</Challenges>
