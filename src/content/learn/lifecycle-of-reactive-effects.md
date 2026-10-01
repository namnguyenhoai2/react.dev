---
title: 'Vòng đời của các Reactive Effect'
---

<Intro>

Effect có vòng đời khác với component. Component có thể mount, update hoặc unmount. Effect chỉ có thể làm hai việc: bắt đầu đồng bộ hóa một thứ gì đó, rồi sau đó dừng đồng bộ hóa nó. Chu kỳ này có thể xảy ra nhiều lần nếu Effect của bạn phụ thuộc vào props và state thay đổi theo thời gian. React cung cấp một quy tắc linter để kiểm tra xem bạn đã chỉ định đúng các dependency của Effect hay chưa. Điều này giúp Effect của bạn luôn được đồng bộ với props và state mới nhất.

</Intro>

<YouWillLearn>

- Vòng đời của Effect khác với vòng đời của component như thế nào
- Cách suy nghĩ về từng Effect riêng lẻ một cách độc lập
- Khi nào Effect cần được đồng bộ lại và vì sao
- Các dependency của Effect được xác định như thế nào
- Một giá trị reactive có nghĩa là gì
- Mảng dependency rỗng có ý nghĩa gì
- React xác minh các dependency của bạn là chính xác bằng linter như thế nào
- Cần làm gì khi bạn không đồng ý với linter

</YouWillLearn>

## Vòng đời của một Effect {/*the-lifecycle-of-an-effect*/}

Mọi React component đều trải qua cùng một vòng đời:

- Một component _mount_ khi được thêm vào màn hình.
- Một component _update_ khi nhận props hoặc state mới, thường là để phản hồi một tương tác.
- Một component _unmount_ khi bị xóa khỏi màn hình.

**Đây là cách tốt để suy nghĩ về component, nhưng _không phải_ về Effect.** Thay vào đó, hãy thử suy nghĩ về từng Effect độc lập với vòng đời của component. Effect mô tả cách [đồng bộ hóa một hệ thống bên ngoài](/learn/synchronizing-with-effects) với props và state hiện tại. Khi code của bạn thay đổi, việc đồng bộ hóa sẽ cần diễn ra thường xuyên hơn hoặc ít thường xuyên hơn.

Để minh họa điều này, hãy xem xét Effect kết nối component của bạn với một chat server:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Phần thân của Effect chỉ rõ cách **bắt đầu đồng bộ hóa:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Hàm cleanup được Effect trả về chỉ rõ cách **dừng đồng bộ hóa:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Theo trực giác, bạn có thể nghĩ rằng React sẽ **bắt đầu đồng bộ hóa** khi component mount và **dừng đồng bộ hóa** khi component unmount. Tuy nhiên, đó chưa phải là toàn bộ câu chuyện! Đôi khi, bạn cũng cần **bắt đầu và dừng đồng bộ hóa nhiều lần** trong khi component vẫn đang được mount.

Hãy cùng xem _vì sao_ điều này cần thiết, _khi nào_ nó xảy ra và _cách_ bạn có thể kiểm soát hành vi này.

<Note>

Một số Effect hoàn toàn không trả về hàm cleanup. [Trong phần lớn trường hợp,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) bạn sẽ muốn trả về một hàm--nhưng nếu không, React sẽ hoạt động như thể bạn đã trả về một hàm cleanup rỗng.

</Note>

### Vì sao việc đồng bộ hóa có thể cần diễn ra nhiều hơn một lần {/*why-synchronization-may-need-to-happen-more-than-once*/}

Hãy tưởng tượng component `ChatRoom` này nhận một prop `roomId` mà người dùng chọn trong dropdown. Giả sử ban đầu người dùng chọn phòng `"general"` làm `roomId`. Ứng dụng của bạn hiển thị phòng chat `"general"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Sau khi UI được hiển thị, React sẽ chạy Effect của bạn để **bắt đầu đồng bộ hóa.** Nó kết nối với phòng `"general"`:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Kết nối với phòng "general"
    connection.connect();
    return () => {
      connection.disconnect(); // Ngắt kết nối khỏi phòng "general"
    };
  }, [roomId]);
  // ...
```

Cho đến đây thì mọi thứ đều ổn.

Sau đó, người dùng chọn một phòng khác trong dropdown (ví dụ: `"travel"`). Trước tiên, React sẽ cập nhật UI:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Hãy nghĩ xem điều gì nên xảy ra tiếp theo. Người dùng thấy rằng `"travel"` là phòng chat được chọn trong UI. Tuy nhiên, Effect đã chạy lần trước vẫn đang kết nối với phòng `"general"`. **Prop `roomId` đã thay đổi, vì vậy những gì Effect của bạn đã làm lúc đó (kết nối với phòng `"general"`) không còn khớp với UI nữa.**

Tại thời điểm này, bạn muốn React làm hai việc:

1. Dừng đồng bộ hóa với `roomId` cũ (ngắt kết nối khỏi phòng `"general"`)
2. Bắt đầu đồng bộ hóa với `roomId` mới (kết nối với phòng `"travel"`)

**May mắn là bạn đã hướng dẫn React cách thực hiện cả hai việc này!** Phần thân của Effect chỉ rõ cách bắt đầu đồng bộ hóa, còn hàm cleanup chỉ rõ cách dừng đồng bộ hóa. Bây giờ, tất cả những gì React cần làm là gọi chúng theo đúng thứ tự và với đúng props và state. Hãy xem chính xác điều đó diễn ra như thế nào.

### React đồng bộ lại Effect của bạn như thế nào {/*how-react-re-synchronizes-your-effect*/}

Hãy nhớ rằng component `ChatRoom` của bạn đã nhận một giá trị mới cho prop `roomId`. Trước đây giá trị là `"general"`, còn bây giờ là `"travel"`. React cần đồng bộ lại Effect để kết nối lại bạn với một phòng khác.

Để **dừng đồng bộ hóa,** React sẽ gọi hàm cleanup mà Effect của bạn trả về sau khi kết nối với phòng `"general"`. Vì `roomId` là `"general"`, hàm cleanup sẽ ngắt kết nối khỏi phòng `"general"`:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Kết nối với phòng "general"
    connection.connect();
    return () => {
      connection.disconnect(); // Ngắt kết nối khỏi phòng "general"
    };
    // ...
```

Sau đó React sẽ chạy Effect mà bạn đã cung cấp trong lần render này. Lần này, `roomId` là `"travel"`, vì vậy nó sẽ **bắt đầu đồng bộ hóa** với phòng chat `"travel"` (cho đến khi hàm cleanup của nó cũng được gọi sau đó):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Kết nối với phòng "travel"
    connection.connect();
    // ...
```

Nhờ vậy, giờ bạn đã kết nối với đúng phòng mà người dùng chọn trong UI. Tránh được sự cố!

Mỗi lần component render lại với `roomId` khác, Effect của bạn sẽ được đồng bộ lại. Ví dụ, giả sử người dùng thay đổi `roomId` từ `"travel"` thành `"music"`. React lại **dừng đồng bộ hóa** Effect của bạn bằng cách gọi hàm cleanup (ngắt kết nối bạn khỏi phòng `"travel"`). Sau đó, nó sẽ **bắt đầu đồng bộ hóa** lại bằng cách chạy phần thân với prop `roomId` mới (kết nối bạn với phòng `"music"`).

Cuối cùng, khi người dùng chuyển sang một màn hình khác, `ChatRoom` sẽ unmount. Lúc này không còn cần duy trì kết nối nữa. React sẽ **dừng đồng bộ hóa** Effect của bạn lần cuối và ngắt kết nối bạn khỏi phòng chat `"music"`.

### Suy nghĩ từ góc nhìn của Effect {/*thinking-from-the-effects-perspective*/}

Hãy cùng tóm tắt mọi việc đã xảy ra từ góc nhìn của component `ChatRoom`:

1. `ChatRoom` đã mount với `roomId` được đặt thành `"general"`
1. `ChatRoom` đã update với `roomId` được đặt thành `"travel"`
1. `ChatRoom` đã update với `roomId` được đặt thành `"music"`
1. `ChatRoom` đã unmount

Trong mỗi thời điểm của vòng đời component, Effect của bạn đã làm những việc khác nhau:

1. Effect kết nối với phòng `"general"`
1. Effect ngắt kết nối khỏi phòng `"general"` và kết nối với phòng `"travel"`
1. Effect ngắt kết nối khỏi phòng `"travel"` và kết nối với phòng `"music"`
1. Effect ngắt kết nối khỏi phòng `"music"`

Bây giờ hãy nghĩ về những gì đã xảy ra từ góc nhìn của chính Effect:

```js
  useEffect(() => {
    // Effect của bạn đã kết nối với phòng được chỉ định bằng roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...cho đến khi nó ngắt kết nối
      connection.disconnect();
    };
  }, [roomId]);
```

Cấu trúc của code này có thể khiến bạn hình dung những gì đã xảy ra như một chuỗi các khoảng thời gian không chồng lấn lên nhau:

1. Effect kết nối với phòng `"general"` (cho đến khi ngắt kết nối)
1. Effect kết nối với phòng `"travel"` (cho đến khi ngắt kết nối)
1. Effect kết nối với phòng `"music"` (cho đến khi ngắt kết nối)

Trước đây, bạn đã suy nghĩ từ góc nhìn của component. Khi nhìn từ góc nhìn của component, bạn dễ nghĩ về Effect như các "callback" hoặc "sự kiện vòng đời" được kích hoạt tại một thời điểm cụ thể, chẳng hạn như "sau một lần render" hoặc "trước khi unmount". Cách suy nghĩ này nhanh chóng trở nên phức tạp, vì vậy tốt nhất nên tránh.

**Thay vào đó, luôn tập trung vào từng chu kỳ bắt đầu/dừng riêng lẻ. Việc component đang mount, update hay unmount không nên quan trọng. Tất cả những gì bạn cần làm là mô tả cách bắt đầu đồng bộ hóa và cách dừng nó. Nếu làm tốt, Effect của bạn sẽ có khả năng thích ứng với việc được bắt đầu và dừng bao nhiêu lần cũng được.**

Điều này có thể nhắc bạn nhớ rằng khi viết rendering logic tạo JSX, bạn không suy nghĩ xem component đang mount hay update. Bạn mô tả những gì nên xuất hiện trên màn hình, còn React [tự mình xử lý phần còn lại.](/learn/reacting-to-input-with-state)

### React xác minh Effect của bạn có thể đồng bộ lại như thế nào {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

Đây là một ví dụ trực tiếp mà bạn có thể tương tác. Nhấn "Open chat" để mount component `ChatRoom`:

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

Hãy chú ý rằng khi component mount lần đầu, bạn thấy ba log:

1. `✅ Connecting to "general" room at https://localhost:1234...` *(chỉ dành cho development)*
1. `❌ Disconnected from "general" room at https://localhost:1234.` *(chỉ dành cho development)*
1. `✅ Connecting to "general" room at https://localhost:1234...`

Hai log đầu tiên chỉ xuất hiện trong development. Trong development, React luôn remount mỗi component một lần.

**React xác minh rằng Effect của bạn có thể đồng bộ lại bằng cách buộc nó thực hiện việc đó ngay lập tức trong development.** Điều này có thể khiến bạn liên tưởng đến việc mở cửa rồi đóng cửa thêm một lần để kiểm tra khóa cửa có hoạt động hay không. React bắt đầu và dừng Effect của bạn thêm một lần trong development để kiểm tra [bạn đã triển khai hàm cleanup tốt hay chưa.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

Lý do chính khiến Effect của bạn tái đồng bộ trong thực tế là một số dữ liệu mà nó sử dụng đã thay đổi. Trong sandbox ở trên, hãy thay đổi phòng chat được chọn. Hãy chú ý rằng khi `roomId` thay đổi, Effect của bạn sẽ tái đồng bộ.

Tuy nhiên, cũng có những trường hợp bất thường hơn mà việc tái đồng bộ là cần thiết. Ví dụ, hãy thử chỉnh sửa `serverUrl` trong sandbox ở trên khi cuộc trò chuyện đang mở. Hãy chú ý cách Effect tái đồng bộ để phản hồi những chỉnh sửa của bạn đối với mã. Trong tương lai, React có thể bổ sung thêm các tính năng dựa vào việc tái đồng bộ.

### Cách React biết rằng nó cần tái đồng bộ Effect {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Bạn có thể thắc mắc React đã biết bằng cách nào rằng Effect của bạn cần tái đồng bộ sau khi `roomId` thay đổi. Đó là vì *bạn đã cho React biết* rằng mã của nó phụ thuộc vào `roomId` bằng cách đưa nó vào [danh sách dependency:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // Prop roomId có thể thay đổi theo thời gian
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect này đọc roomId
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Như vậy, bạn cho React biết Effect này "phụ thuộc vào" roomId
  // ...
```

Cách hoạt động như sau:

1. Bạn biết `roomId` là một prop, nghĩa là nó có thể thay đổi theo thời gian.
2. Bạn biết Effect của mình đọc `roomId` (vì vậy logic của nó phụ thuộc vào một giá trị có thể thay đổi về sau).
3. Đây là lý do bạn chỉ định nó làm dependency của Effect (để Effect tái đồng bộ khi `roomId` thay đổi).

Mỗi lần component của bạn re-render, React sẽ xem xét mảng dependency mà bạn đã truyền vào. Nếu bất kỳ giá trị nào trong mảng khác với giá trị ở cùng vị trí mà bạn đã truyền vào trong lần render trước, React sẽ tái đồng bộ Effect của bạn.

Ví dụ, nếu bạn truyền `["general"]` trong lần render ban đầu, rồi sau đó truyền `["travel"]` trong lần render tiếp theo, React sẽ so sánh `"general"` và `"travel"`. Đây là các giá trị khác nhau (được so sánh bằng [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), nên React sẽ tái đồng bộ Effect của bạn. Ngược lại, nếu component của bạn re-render nhưng `roomId` không thay đổi, Effect của bạn sẽ tiếp tục kết nối với cùng một phòng.

### Mỗi Effect đại diện cho một quy trình đồng bộ riêng biệt {/*each-effect-represents-a-separate-synchronization-process*/}

Tránh thêm logic không liên quan vào Effect chỉ vì logic đó cần chạy cùng lúc với Effect mà bạn đã viết. Ví dụ, giả sử bạn muốn gửi một analytics event khi người dùng truy cập phòng. Bạn đã có một Effect phụ thuộc vào `roomId`, nên có thể bạn sẽ muốn thêm lệnh gọi analytics vào đó:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Nhưng hãy tưởng tượng sau này bạn thêm một dependency khác vào Effect này, khiến kết nối cần được thiết lập lại. Nếu Effect này tái đồng bộ, nó cũng sẽ gọi `logVisit(roomId)` cho cùng một phòng, điều mà bạn không hề chủ định. Ghi log lượt truy cập **là một quy trình riêng biệt** với việc kết nối. Hãy viết chúng thành hai Effect riêng biệt:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Mỗi Effect trong mã của bạn nên đại diện cho một quy trình đồng bộ riêng biệt và độc lập.**

Trong ví dụ trên, việc xóa một Effect sẽ không làm hỏng logic của Effect còn lại. Đây là dấu hiệu tốt cho thấy chúng đồng bộ những thứ khác nhau, và do đó việc tách chúng ra là hợp lý. Ngược lại, nếu bạn tách một phần logic gắn kết thành các Effect riêng biệt, mã có thể trông “sạch hơn” nhưng sẽ [khó bảo trì hơn.](/learn/you-might-not-need-an-effect#chains-of-computations) Đây là lý do bạn nên cân nhắc xem các quy trình là giống nhau hay riêng biệt, thay vì chỉ xem mã có trông sạch hơn hay không.

## Effect “phản ứng” với các giá trị reactive {/*effects-react-to-reactive-values*/}

Effect của bạn đọc hai biến (`serverUrl` và `roomId`), nhưng bạn chỉ chỉ định `roomId` làm dependency:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Tại sao `serverUrl` không cần là một dependency?

Đó là vì `serverUrl` không bao giờ thay đổi do re-render. Nó luôn giống nhau, bất kể component re-render bao nhiêu lần và vì lý do gì. Vì `serverUrl` không bao giờ thay đổi, việc chỉ định nó làm dependency sẽ không hợp lý. Suy cho cùng, dependency chỉ có tác dụng khi chúng thay đổi theo thời gian!

Mặt khác, `roomId` có thể khác trong một lần re-render. **Props, state và các giá trị khác được khai báo bên trong component là _reactive_ vì chúng được tính toán trong quá trình render và tham gia vào luồng dữ liệu của React.**

Nếu `serverUrl` là một biến state, nó sẽ là reactive. Các giá trị reactive phải được đưa vào dependency:

```js {2,5,10}
function ChatRoom({ roomId }) { // Props thay đổi theo thời gian
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State có thể thay đổi theo thời gian

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect của bạn đọc props và state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Như vậy, bạn cho React biết Effect này "phụ thuộc vào" props và state
  // ...
}
```

Bằng cách đưa `serverUrl` làm dependency, bạn đảm bảo rằng Effect sẽ tái đồng bộ sau khi nó thay đổi.

Hãy thử thay đổi phòng chat được chọn hoặc chỉnh sửa server URL trong sandbox này:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
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

Mỗi khi bạn thay đổi một giá trị reactive như `roomId` hoặc `serverUrl`, Effect sẽ kết nối lại với chat server.

### Ý nghĩa của Effect có dependency rỗng {/*what-an-effect-with-empty-dependencies-means*/}

Điều gì xảy ra nếu bạn chuyển cả `serverUrl` và `roomId` ra ngoài component?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

Bây giờ mã của Effect không sử dụng *bất kỳ* giá trị reactive nào, nên dependency của nó có thể để trống (`[]`).

Xét từ góc nhìn của component, mảng dependency `[]` rỗng có nghĩa là Effect này chỉ kết nối với phòng chat khi component mount và chỉ ngắt kết nối khi component unmount. (Hãy nhớ rằng trong môi trường development, React vẫn sẽ [tái đồng bộ nó thêm một lần](#how-react-verifies-that-your-effect-can-re-synchronize) để kiểm tra logic của bạn.)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Tuy nhiên, nếu bạn [nhìn từ góc độ của Effect,](#thinking-from-the-effects-perspective) bạn không cần nghĩ đến việc mount và unmount. Điều quan trọng là bạn đã chỉ định Effect làm gì để bắt đầu và dừng việc đồng bộ. Hiện tại, nó không có dependency reactive nào. Nhưng nếu sau này bạn muốn người dùng thay đổi `roomId` hoặc `serverUrl` theo thời gian (và chúng trở thành reactive), mã của Effect sẽ không thay đổi. Bạn chỉ cần thêm chúng vào dependency.

### Tất cả biến được khai báo trong thân component đều là reactive {/*all-variables-declared-in-the-component-body-are-reactive*/}

Props và state không phải là những giá trị reactive duy nhất. Các giá trị mà bạn tính toán từ chúng cũng là reactive. Nếu props hoặc state thay đổi, component của bạn sẽ re-render, và các giá trị được tính toán từ chúng cũng sẽ thay đổi. Đây là lý do tất cả biến từ thân component được Effect sử dụng phải nằm trong danh sách dependency của Effect.

Giả sử người dùng có thể chọn một chat server trong dropdown, nhưng cũng có thể cấu hình server mặc định trong settings. Giả sử bạn đã đặt state settings vào một [context](/learn/scaling-up-with-reducer-and-context) để đọc `settings` từ context đó. Bây giờ bạn tính toán `serverUrl` dựa trên server được chọn từ props và server mặc định:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId là reactive
  const settings = useContext(SettingsContext); // settings là reactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl là reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect của bạn đọc roomId và serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Vì vậy cần đồng bộ lại khi một trong hai thay đổi!
  // ...
}
```

Trong ví dụ này, `serverUrl` không phải là prop hay biến state. Đây là một biến thông thường được bạn tính toán trong quá trình render. Nhưng vì nó được tính toán trong quá trình render, nó có thể thay đổi do re-render. Đây là lý do nó là reactive.

**Tất cả giá trị bên trong component (bao gồm props, state và các biến trong thân component) đều là reactive. Bất kỳ giá trị reactive nào cũng có thể thay đổi trong một lần re-render, vì vậy bạn cần đưa các giá trị reactive vào dependency của Effect.**

Nói cách khác, Effect “phản ứng” với mọi giá trị từ thân component.

<DeepDive>

#### Giá trị global hoặc mutable có thể là dependency không? {/*can-global-or-mutable-values-be-dependencies*/}

Các giá trị mutable (bao gồm cả biến global) không phải là reactive.

**Một giá trị mutable như [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) không thể là dependency.** Vì là mutable, nó có thể thay đổi bất kỳ lúc nào hoàn toàn bên ngoài luồng dữ liệu render của React. Việc thay đổi nó sẽ không kích hoạt re-render component của bạn. Do đó, ngay cả khi bạn chỉ định nó trong dependency, React *cũng không biết* để tái đồng bộ Effect khi nó thay đổi. Điều này cũng vi phạm các quy tắc của React vì việc đọc dữ liệu mutable trong quá trình render (là lúc bạn tính toán dependency) phá vỡ [tính thuần khiết của quá trình render.](/learn/keeping-components-pure) Thay vào đó, bạn nên đọc và subscribe vào một giá trị mutable bên ngoài bằng [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**Một giá trị mutable như [`ref.current`](/reference/react/useRef#reference) hoặc những thứ bạn đọc từ nó cũng không thể là dependency.** Bản thân object ref do `useRef` trả về có thể là một dependency, nhưng thuộc tính `current` của nó cố ý là mutable. Nó cho phép bạn [theo dõi một thứ mà không kích hoạt re-render.](/learn/referencing-values-with-refs) Nhưng vì việc thay đổi nó không kích hoạt re-render, nó không phải là một giá trị reactive, và React sẽ không biết để chạy lại Effect của bạn khi nó thay đổi.

Như bạn sẽ học ở phần bên dưới của trang này, một linter sẽ tự động kiểm tra những vấn đề này.

</DeepDive>

### React xác minh rằng bạn đã chỉ định mọi giá trị reactive làm dependency {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}Nếu linter của bạn được [cấu hình cho React,](/learn/editor-setup#linting) nó sẽ kiểm tra rằng mọi giá trị reactive được sử dụng trong code của Effect đều được khai báo là dependency của nó. Ví dụ: đây là lỗi lint vì cả `roomId` và `serverUrl` đều là reactive:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId là reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl là reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Something's wrong here!

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

Điều này có thể trông giống như một lỗi của React, nhưng thực ra React đang chỉ ra một bug trong code của bạn. Cả `roomId` và `serverUrl` đều có thể thay đổi theo thời gian, nhưng bạn lại quên đồng bộ lại Effect khi chúng thay đổi. Bạn sẽ vẫn kết nối với `roomId` và `serverUrl` ban đầu ngay cả sau khi người dùng chọn các giá trị khác trong UI.

Để sửa bug, hãy làm theo đề xuất của linter và chỉ định `roomId` và `serverUrl` làm dependency của Effect:

```js {9}
function ChatRoom({ roomId }) { // roomId là reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl là reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ All dependencies declared
  // ...
}
```

Hãy thử cách sửa này trong sandbox ở trên. Xác nhận rằng lỗi linter đã biến mất và chat kết nối lại khi cần.

<Note>

Trong một số trường hợp, React *biết* rằng một giá trị sẽ không bao giờ thay đổi dù giá trị đó được khai báo bên trong component. Ví dụ, hàm [`set` function](/reference/react/useState#setstate) được trả về từ `useState` và ref object được trả về bởi [`useRef`](/reference/react/useRef) đều là các giá trị *stable*--chúng được đảm bảo không thay đổi khi re-render. Các giá trị stable không phải là reactive, vì vậy bạn có thể bỏ qua chúng trong danh sách. Việc đưa chúng vào cũng được phép: chúng sẽ không thay đổi nên điều đó không ảnh hưởng gì.

</Note>

### Cần làm gì khi bạn không muốn đồng bộ lại {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

Trong ví dụ trước, bạn đã sửa lỗi lint bằng cách liệt kê `roomId` và `serverUrl` làm dependency.

**Tuy nhiên, thay vào đó, bạn có thể "chứng minh" với linter rằng các giá trị này không phải là giá trị reactive,** tức là chúng *không thể* thay đổi do re-render. Ví dụ, nếu `serverUrl` và `roomId` không phụ thuộc vào quá trình render và luôn có cùng giá trị, bạn có thể di chuyển chúng ra ngoài component. Khi đó, chúng không cần phải là dependency:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl không reactive
const roomId = 'general'; // roomId không reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

Bạn cũng có thể di chuyển chúng *vào bên trong Effect.* Chúng không được tính toán trong quá trình render, nên chúng không phải là reactive:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl không reactive
    const roomId = 'general'; // roomId không reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

**Effects là các block code reactive.** Chúng đồng bộ lại khi những giá trị bạn đọc bên trong chúng thay đổi. Không giống event handler, vốn chỉ chạy một lần cho mỗi lần tương tác, Effects chạy bất cứ khi nào cần đồng bộ.

**Bạn không thể "chọn" dependency của mình.** Dependency của bạn phải bao gồm mọi [giá trị reactive](#all-variables-declared-in-the-component-body-are-reactive) mà bạn đọc trong Effect. Linter sẽ thực thi quy tắc này. Đôi khi điều này có thể dẫn đến các vấn đề như vòng lặp vô hạn và khiến Effect đồng bộ lại quá thường xuyên. Đừng khắc phục các vấn đề này bằng cách tắt linter! Thay vào đó, hãy thử các cách sau:

* **Kiểm tra xem Effect của bạn có đại diện cho một quy trình đồng bộ độc lập hay không.** Nếu Effect không đồng bộ bất cứ điều gì, [có thể nó không cần thiết.](/learn/you-might-not-need-an-effect) Nếu nó đồng bộ nhiều thứ độc lập, [hãy tách nó ra.](#each-effect-represents-a-separate-synchronization-process)

* **Nếu bạn muốn đọc giá trị mới nhất của props hoặc state mà không "react" với nó và đồng bộ lại Effect,** bạn có thể tách Effect thành một phần reactive (bạn sẽ giữ phần này trong Effect) và một phần non-reactive (bạn sẽ tách phần này thành một thứ gọi là _Effect Event_). [Đọc về cách tách Event khỏi Effect.](/learn/separating-events-from-effects)

* **Tránh phụ thuộc vào object và function.** Nếu bạn tạo object và function trong quá trình render rồi đọc chúng từ một Effect, chúng sẽ khác nhau trong mỗi lần render. Điều này sẽ khiến Effect của bạn đồng bộ lại mỗi lần. [Đọc thêm về cách loại bỏ các dependency không cần thiết khỏi Effect.](/learn/removing-effect-dependencies)

<Pitfall>

Linter là bạn của bạn, nhưng khả năng của nó có giới hạn. Linter chỉ biết khi nào dependency *sai*. Nó không biết *cách tốt nhất* để giải quyết từng trường hợp. Nếu linter đề xuất một dependency nhưng việc thêm dependency đó gây ra vòng lặp, điều đó không có nghĩa là bạn nên bỏ qua linter. Bạn cần thay đổi code bên trong (hoặc bên ngoài) Effect để giá trị đó không còn reactive và *không cần* làm dependency.

Nếu bạn có một codebase hiện có, có thể bạn có một số Effect tắt linter như sau:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Tránh vô hiệu hóa linter theo cách này:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

Ở [phần](/learn/separating-events-from-effects) [tiếp theo](/learn/removing-effect-dependencies), bạn sẽ học cách sửa code này mà không phá vỡ các quy tắc. Việc sửa luôn đáng công sức!

</Pitfall>

<Recap>

- Component có thể mount, update và unmount.
- Mỗi Effect có một lifecycle riêng, tách biệt với component bao quanh.
- Mỗi Effect mô tả một quy trình đồng bộ riêng biệt có thể *bắt đầu* và *dừng lại*.
- Khi viết và đọc Effects, hãy suy nghĩ từ góc nhìn của từng Effect riêng lẻ (cách bắt đầu và dừng quá trình đồng bộ), thay vì từ góc nhìn của component (cách nó mount, update hoặc unmount).
- Các giá trị được khai báo bên trong phần thân component là "reactive".
- Các giá trị reactive nên khiến Effect đồng bộ lại vì chúng có thể thay đổi theo thời gian.
- Linter xác minh rằng mọi giá trị reactive được sử dụng bên trong Effect đều được chỉ định làm dependency.
- Tất cả lỗi mà linter đánh dấu đều là lỗi hợp lệ. Luôn có cách sửa code để không vi phạm các quy tắc.

</Recap>

<Challenges>

#### Sửa lỗi kết nối lại sau mỗi lần gõ phím {/*fix-reconnecting-on-every-keystroke*/}

Trong ví dụ này, component `ChatRoom` kết nối với chat room khi component mount, ngắt kết nối khi unmount và kết nối lại khi bạn chọn một chat room khác. Hành vi này là đúng, vì vậy bạn cần giữ nguyên hoạt động đó.

Tuy nhiên, có một vấn đề. Mỗi khi bạn gõ vào ô nhập tin nhắn ở phía dưới, `ChatRoom` *cũng* kết nối lại với chat. (Bạn có thể nhận thấy điều này bằng cách xóa console rồi gõ vào ô nhập.) Hãy sửa vấn đề để điều này không xảy ra.

<Hint>

Có thể bạn cần thêm một dependency array cho Effect này. Dependency nào nên được đưa vào?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

<Solution>

Effect này hoàn toàn không có dependency array, nên nó đồng bộ lại sau mỗi lần re-render. Trước tiên, hãy thêm dependency array. Sau đó, hãy đảm bảo rằng mọi giá trị reactive được Effect sử dụng đều được chỉ định trong array. Ví dụ, `roomId` là reactive (vì nó là một prop), nên nó cần được đưa vào array. Điều này đảm bảo rằng khi người dùng chọn một room khác, chat sẽ kết nối lại. Mặt khác, `serverUrl` được định nghĩa bên ngoài component. Vì vậy, nó không cần được đưa vào array.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

</Solution>

#### Bật và tắt quá trình đồng bộ {/*switch-synchronization-on-and-off*/}

Trong ví dụ này, một Effect đăng ký lắng nghe event [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) của window để di chuyển một chấm màu hồng trên màn hình. Hãy thử di chuột qua khu vực preview (hoặc chạm vào màn hình nếu bạn đang dùng thiết bị di động) và xem chấm màu hồng di chuyển theo bạn.

Ngoài ra còn có một checkbox. Việc đánh dấu checkbox sẽ chuyển đổi state variable `canMove`, nhưng state variable này không được sử dụng ở đâu trong code. Nhiệm vụ của bạn là thay đổi code để khi `canMove` là `false` (checkbox được bỏ đánh dấu), chấm sẽ dừng di chuyển. Sau khi bạn đánh dấu checkbox trở lại (và đặt `canMove` thành `true`), chấm sẽ lại di chuyển theo chuyển động. Nói cách khác, việc chấm có thể di chuyển hay không phải luôn được đồng bộ với trạng thái checkbox được đánh dấu hay chưa.

<Hint>

Bạn không thể khai báo một Effect có điều kiện. Tuy nhiên, code bên trong Effect có thể sử dụng các điều kiện!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

Một giải pháp là bọc lệnh gọi `setPosition` trong một điều kiện `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Ngoài ra, bạn có thể bọc logic *đăng ký event* trong một điều kiện `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

Trong cả hai trường hợp này, `canMove` là một biến reactive được bạn đọc bên trong Effect. Vì vậy, nó phải được chỉ định trong danh sách dependency của Effect. Điều này đảm bảo rằng Effect sẽ đồng bộ lại sau mỗi lần giá trị của nó thay đổi.

</Solution>

#### Điều tra bug giá trị cũ {/*investigate-a-stale-value-bug*/}

Trong ví dụ này, chấm màu hồng sẽ di chuyển khi checkbox được bật và sẽ dừng lại khi checkbox bị tắt. Logic cho việc này đã được triển khai: trình xử lý sự kiện `handleMove` kiểm tra biến trạng thái `canMove`.

Tuy nhiên, vì một lý do nào đó, biến trạng thái `canMove` bên trong `handleMove` có vẻ bị "lỗi thời": nó luôn là `true`, ngay cả sau khi bạn bỏ chọn checkbox. Điều này có thể xảy ra như thế nào? Hãy tìm lỗi trong code và sửa nó.

<Hint>

Nếu bạn thấy một quy tắc linter đang bị tắt, hãy gỡ bỏ việc tắt đó! Đó thường là nơi có lỗi.

</Hint>

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

<Solution>

Vấn đề với code ban đầu là đã tắt dependency linter. Nếu gỡ bỏ việc tắt này, bạn sẽ thấy Effect này phụ thuộc vào hàm `handleMove`. Điều này hợp lý: `handleMove` được khai báo bên trong phần thân component, nên đây là một giá trị reactive. Mọi giá trị reactive đều phải được chỉ định là dependency, nếu không nó có thể bị lỗi thời theo thời gian!

Tác giả của code ban đầu đã "nói dối" React bằng cách cho biết Effect không phụ thuộc (`[]`) vào bất kỳ giá trị reactive nào. Vì vậy, React không đồng bộ hóa lại Effect sau khi `canMove` thay đổi (và `handleMove` cũng thay đổi theo). Do React không đồng bộ hóa lại Effect, `handleMove` được gắn làm listener chính là hàm `handleMove` được tạo trong lần render ban đầu. Trong lần render ban đầu, `canMove` là `true`, vì vậy `handleMove` từ lần render ban đầu sẽ luôn nhìn thấy giá trị đó.

**Nếu bạn không bao giờ tắt linter, bạn sẽ không bao giờ gặp vấn đề với các giá trị bị lỗi thời.** Có một vài cách khác nhau để sửa bug này, nhưng bạn luôn nên bắt đầu bằng cách gỡ bỏ việc tắt linter. Sau đó, thay đổi code để sửa lỗi lint.

Bạn có thể thay đổi các dependency của Effect thành `[handleMove]`, nhưng vì đây sẽ là một hàm mới được định nghĩa trong mỗi lần render, bạn cũng có thể xóa hẳn mảng dependencies. Khi đó, Effect *sẽ* đồng bộ hóa lại sau mỗi lần re-render:

<Sandpack>

```js
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
  });

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

Giải pháp này hoạt động, nhưng không lý tưởng. Nếu đặt `console.log('Resubscribing')` bên trong Effect, bạn sẽ nhận thấy rằng nó đăng ký lại sau mỗi lần re-render. Việc đăng ký lại rất nhanh, nhưng sẽ tốt hơn nếu tránh thực hiện việc này quá thường xuyên.

Một cách sửa tốt hơn là chuyển hàm `handleMove` *vào bên trong* Effect. Khi đó, `handleMove` sẽ không còn là một giá trị reactive, nên Effect của bạn sẽ không phụ thuộc vào một hàm. Thay vào đó, nó sẽ cần phụ thuộc vào `canMove`, là giá trị mà code của bạn hiện đọc bên trong Effect. Điều này khớp với hành vi bạn mong muốn, vì Effect của bạn giờ sẽ luôn được đồng bộ với giá trị của `canMove`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Hãy thử thêm `console.log('Resubscribing')` vào bên trong phần thân của Effect và nhận thấy rằng giờ đây nó chỉ đăng ký lại khi bạn bật hoặc tắt checkbox (`canMove` thay đổi) hoặc chỉnh sửa code. Điều này tốt hơn cách tiếp cận trước, vốn luôn đăng ký lại.

Bạn sẽ học một cách tiếp cận tổng quát hơn cho loại vấn đề này trong [Separating Events from Effects.](/learn/separating-events-from-effects)

</Solution>

#### Sửa lỗi công tắc kết nối {/*fix-a-connection-switch*/}

Trong ví dụ này, dịch vụ chat trong `chat.js` cung cấp hai API khác nhau: `createEncryptedConnection` và `createUnencryptedConnection`. Component `App` ở cấp cao nhất cho phép người dùng chọn có sử dụng mã hóa hay không, sau đó truyền phương thức API tương ứng xuống component con `ChatRoom` dưới dạng prop `createConnection`.

Hãy chú ý rằng ban đầu, các log trong console cho biết kết nối không được mã hóa. Hãy thử bật checkbox: sẽ không có gì xảy ra. Tuy nhiên, nếu sau đó bạn thay đổi phòng đã chọn, chat sẽ kết nối lại *và* bật mã hóa (như bạn sẽ thấy qua các thông báo trong console). Đây là một bug. Hãy sửa bug để việc bật checkbox *cũng* khiến chat kết nối lại.

<Hint>

Việc tắt linter luôn đáng ngờ. Có thể đây là một bug không?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [8]}} src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Nếu gỡ bỏ việc tắt linter, bạn sẽ thấy một lỗi lint. Vấn đề là `createConnection` là một prop, nên đây là một giá trị reactive. Nó có thể thay đổi theo thời gian! (Và thực tế, nó nên thay đổi—khi người dùng bật checkbox, component cha truyền một giá trị khác cho prop `createConnection`.) Đây là lý do nó phải là một dependency. Hãy thêm nó vào danh sách để sửa bug:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

`createConnection` đúng là một dependency. Tuy nhiên, code này hơi mong manh vì ai đó có thể chỉnh sửa component `App` để truyền một hàm inline làm giá trị cho prop này. Khi đó, giá trị của nó sẽ khác nhau mỗi lần component `App` re-render, vì vậy Effect có thể đồng bộ hóa lại quá thường xuyên. Để tránh điều này, bạn có thể truyền `isEncrypted` xuống thay thế:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Trong phiên bản này, component `App` truyền một prop boolean thay vì một hàm. Bên trong Effect, bạn quyết định sẽ sử dụng hàm nào. Vì cả `createEncryptedConnection` và `createUnencryptedConnection` đều được khai báo bên ngoài component, chúng không phải là reactive và không cần làm dependency. Bạn sẽ tìm hiểu thêm về điều này trong [Removing Effect Dependencies.](/learn/removing-effect-dependencies)

</Solution>

#### Điền dữ liệu cho một chuỗi hộp select {/*populate-a-chain-of-select-boxes*/}

Trong ví dụ này có hai hộp select. Một hộp select cho phép người dùng chọn một hành tinh. Hộp select còn lại cho phép người dùng chọn một địa điểm *trên hành tinh đó.* Hộp thứ hai chưa hoạt động. Nhiệm vụ của bạn là làm cho nó hiển thị các địa điểm trên hành tinh đã chọn.

Hãy xem cách hộp select đầu tiên hoạt động. Nó điền state `planetList` bằng kết quả từ lệnh gọi API `"/planets"`. ID của hành tinh hiện được chọn được lưu trong biến state `planetId`. Bạn cần tìm nơi để thêm một số code nhằm điền biến state `placeList` bằng kết quả từ lệnh gọi API `"/planets/" + planetId + "/places"`.

Nếu triển khai đúng, việc chọn một hành tinh sẽ điền danh sách địa điểm. Khi thay đổi hành tinh, danh sách địa điểm cũng sẽ thay đổi.

<Hint>

Nếu có hai quy trình đồng bộ hóa độc lập, bạn cần viết hai Effect riêng biệt.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Chọn hành tinh đầu tiên
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Có hai quy trình đồng bộ hóa độc lập:

- Hộp select đầu tiên được đồng bộ với danh sách hành tinh từ xa.
- Hộp select thứ hai được đồng bộ với danh sách địa điểm từ xa của `planetId` hiện tại.

Vì vậy, việc mô tả chúng dưới dạng hai Effect riêng biệt là hợp lý. Dưới đây là một ví dụ về cách bạn có thể thực hiện:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Chọn hành tinh đầu tiên
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Chưa có gì được chọn trong ô đầu tiên
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Chọn địa điểm đầu tiên
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Code này hơi lặp lại. Tuy nhiên, đó không phải là lý do chính đáng để gộp chúng vào một Effect duy nhất! Nếu làm vậy, bạn sẽ phải gộp dependencies của cả hai Effect vào cùng một danh sách, và khi thay đổi hành tinh, danh sách tất cả các hành tinh cũng sẽ được fetch lại. Effect không phải là công cụ để tái sử dụng code.

Thay vào đó, để giảm sự lặp lại, bạn có thể tách một phần logic thành một custom Hook như `useSelectOptions` dưới đây:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Hãy kiểm tra tab `useSelectOptions.js` trong sandbox để xem cách nó hoạt động. Lý tưởng nhất là phần lớn Effect trong ứng dụng của bạn cuối cùng nên được thay thế bằng custom Hook, dù do bạn hay cộng đồng viết. Custom Hook ẩn logic đồng bộ hóa, nên component gọi Hook không cần biết về Effect. Khi tiếp tục phát triển ứng dụng, bạn sẽ xây dựng được một bộ sưu tập các Hook để lựa chọn, và cuối cùng bạn sẽ không cần thường xuyên viết Effect bên trong các component nữa.

</Solution>

</Challenges>
