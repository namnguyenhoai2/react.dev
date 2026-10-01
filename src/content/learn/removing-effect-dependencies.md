---
title: 'Loại bỏ các dependency của Effect'
---

<Intro>

Khi viết một Effect, trình linter sẽ xác minh rằng bạn đã thêm mọi giá trị reactive (chẳng hạn như props và state) mà Effect đọc vào danh sách dependencies của Effect. Điều này đảm bảo Effect luôn được đồng bộ với props và state mới nhất của component. Các dependency không cần thiết có thể khiến Effect chạy quá thường xuyên, hoặc thậm chí tạo ra một vòng lặp vô hạn. Hãy làm theo hướng dẫn này để xem xét và loại bỏ các dependency không cần thiết khỏi Effects.

</Intro>

<YouWillLearn>

- Cách sửa các vòng lặp vô hạn do dependency của Effect
- Cần làm gì khi bạn muốn loại bỏ một dependency
- Cách đọc một giá trị từ Effect mà không "phản ứng" với nó
- Cách và lý do tránh các dependency là object và function
- Vì sao việc tắt trình linter dependency rất nguy hiểm, và nên làm gì thay thế

</YouWillLearn>

## Dependencies phải khớp với code {/*dependencies-should-match-the-code*/}

Khi viết một Effect, trước tiên bạn chỉ định cách [khởi động và dừng](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) bất kỳ việc gì bạn muốn Effect thực hiện:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Sau đó, nếu để trống dependencies của Effect (`[]`), trình linter sẽ đề xuất các dependency chính xác:

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
  }, []); // <-- Hãy sửa lỗi ở đây!
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

Hãy điền chúng theo nội dung trình linter cho biết:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Đã khai báo tất cả dependency
  // ...
}
```

[Effects "phản ứng" với các giá trị reactive.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Vì `roomId` là một giá trị reactive (nó có thể thay đổi do một lần re-render), trình linter xác minh rằng bạn đã chỉ định nó làm dependency. Nếu `roomId` nhận một giá trị khác, React sẽ đồng bộ lại Effect của bạn. Điều này đảm bảo cuộc trò chuyện vẫn được kết nối với room đã chọn và "phản ứng" với dropdown:

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

### Để loại bỏ một dependency, hãy chứng minh rằng nó không phải là dependency {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Lưu ý rằng bạn không thể "chọn" các dependency của Effect. Mọi <CodeStep step={2}>giá trị reactive</CodeStep> được code của Effect sử dụng đều phải được khai báo trong danh sách dependency. Danh sách dependency được xác định bởi code xung quanh:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Đây là một giá trị reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Effect này đọc giá trị reactive đó
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Vì vậy, bạn phải chỉ định giá trị reactive đó là dependency của Effect
  // ...
}
```

[Các giá trị reactive](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) bao gồm props và tất cả biến, function được khai báo trực tiếp bên trong component của bạn. Vì `roomId` là một giá trị reactive, bạn không thể loại bỏ nó khỏi danh sách dependency. Trình linter sẽ không cho phép điều đó:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 Hook useEffect của React thiếu dependency: 'roomId'
  // ...
}
```

Và trình linter hoàn toàn đúng! Vì `roomId` có thể thay đổi theo thời gian, việc này sẽ tạo ra một bug trong code của bạn.

**Để loại bỏ một dependency, hãy "chứng minh" với trình linter rằng nó *không cần* là một dependency.** Ví dụ, bạn có thể di chuyển `roomId` ra ngoài component để chứng minh rằng nó không reactive và sẽ không thay đổi trong các lần re-render:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Không còn là giá trị reactive nữa

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Đã khai báo tất cả dependency
  // ...
}
```

Giờ đây, `roomId` không còn là một giá trị reactive (và không thể thay đổi trong một lần re-render), nên nó không cần là một dependency:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

Đây là lý do giờ bạn có thể chỉ định danh sách dependency [trống (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means). Effect của bạn *thực sự không còn* phụ thuộc vào bất kỳ giá trị reactive nào, nên *thực sự không cần* chạy lại khi props hoặc state của component thay đổi.

### Để thay đổi các dependency, hãy thay đổi code {/*to-change-the-dependencies-change-the-code*/}

Có thể bạn đã nhận thấy một quy trình quen thuộc:

1. Trước tiên, bạn **thay đổi code** của Effect hoặc cách các giá trị reactive được khai báo.
2. Sau đó, bạn làm theo trình linter và điều chỉnh các dependency để **khớp với code bạn đã thay đổi.**
3. Nếu không hài lòng với danh sách dependency, bạn **quay lại bước đầu tiên** (và tiếp tục thay đổi code).

Phần cuối rất quan trọng. **Nếu muốn thay đổi các dependency, trước tiên hãy thay đổi code xung quanh.** Bạn có thể xem danh sách dependency như [danh sách tất cả giá trị reactive được code của Effect sử dụng.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Bạn không *chọn* những gì đưa vào danh sách đó. Danh sách này *mô tả* code của bạn. Để thay đổi danh sách dependency, hãy thay đổi code.

Điều này có thể giống như việc giải một phương trình. Bạn có thể bắt đầu với một mục tiêu (chẳng hạn như loại bỏ một dependency), rồi cần "tìm" phần code phù hợp với mục tiêu đó. Không phải ai cũng thấy việc giải phương trình thú vị, và điều tương tự cũng có thể nói về việc viết Effects! May mắn là bên dưới có một danh sách các công thức phổ biến mà bạn có thể thử.

<Pitfall>

Nếu bạn có một codebase hiện có, có thể một số Effect đang tắt trình linter như sau:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Tránh vô hiệu hóa linter theo cách này:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Khi các dependency không khớp với code, nguy cơ tạo ra bug là rất cao.** Bằng cách tắt trình linter, bạn đang "nói dối" React về các giá trị mà Effect phụ thuộc vào.

Thay vào đó, hãy sử dụng các kỹ thuật bên dưới.

</Pitfall>

<DeepDive>

#### Vì sao việc tắt trình linter dependency lại nguy hiểm đến vậy? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Việc tắt trình linter dẫn đến những bug rất khó đoán, khó tìm và khó sửa. Đây là một ví dụ:

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
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

Giả sử bạn muốn chạy Effect "chỉ khi mount". Bạn đã đọc rằng dependencies [trống (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) sẽ làm điều đó, nên quyết định bỏ qua trình linter và bắt buộc chỉ định `[]` làm dependency.

Counter này được cho là sẽ tăng mỗi giây theo lượng có thể cấu hình bằng hai nút. Tuy nhiên, vì bạn đã "nói dối" React rằng Effect này không phụ thuộc vào bất cứ thứ gì, React sẽ mãi sử dụng function `onTick` từ lần render đầu tiên. [Trong lần render đó,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` là `0` còn `increment` là `1`. Đây là lý do `onTick` từ lần render đó luôn gọi `setCount(0 + 1)` mỗi giây, và bạn luôn thấy `1`. Những bug như vậy còn khó sửa hơn khi chúng nằm rải rác trong nhiều component.

Luôn có giải pháp tốt hơn việc bỏ qua trình linter! Để sửa code này, bạn cần thêm `onTick` vào danh sách dependency. (Để đảm bảo interval chỉ được thiết lập một lần, [hãy biến `onTick` thành một Effect Event.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**Chúng tôi khuyến nghị xem lỗi lint dependency như một lỗi compilation. Nếu không tắt nó, bạn sẽ không bao giờ gặp những bug như thế này.** Phần còn lại của trang này trình bày các phương án thay thế cho trường hợp này và những trường hợp khác.

</DeepDive>

## Loại bỏ các dependency không cần thiết {/*removing-unnecessary-dependencies*/}

Mỗi khi điều chỉnh dependency của Effect để phản ánh code, hãy xem lại danh sách dependency. Effect có nên chạy lại khi bất kỳ dependency nào trong số này thay đổi không? Đôi khi câu trả lời là "không":

* Bạn có thể muốn thực thi lại *những phần khác nhau* của Effect trong các điều kiện khác nhau.
* Bạn có thể chỉ muốn đọc *giá trị mới nhất* của một dependency thay vì "phản ứng" với các thay đổi của nó.
* Một dependency có thể thay đổi quá thường xuyên *ngoài chủ ý* vì nó là một object hoặc function.

Để tìm ra giải pháp phù hợp, bạn cần trả lời một vài câu hỏi về Effect của mình. Hãy cùng xem qua từng câu hỏi.

### Code này có nên chuyển sang event handler không? {/*should-this-code-move-to-an-event-handler*/}

Điều đầu tiên bạn nên cân nhắc là liệu code này có thực sự nên là một Effect hay không.

Hãy hình dung một form. Khi submit, bạn đặt biến state `submitted` thành `true`. Bạn cần gửi một POST request và hiển thị một notification. Bạn đã đặt logic này bên trong một Effect "phản ứng" với việc `submitted` có giá trị `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Tránh: logic dành riêng cho event nằm trong Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Sau đó, bạn muốn tạo style cho thông báo theo theme hiện tại, nên đọc theme hiện tại. Vì `theme` được khai báo trong phần thân component, nó là một giá trị reactive, nên bạn thêm nó làm dependency:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Tránh: logic dành riêng cho event nằm trong Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ Đã khai báo tất cả dependency

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Khi làm vậy, bạn đã tạo ra một bug. Hãy hình dung bạn submit form trước, sau đó chuyển đổi giữa theme Dark và Light. `theme` sẽ thay đổi, Effect sẽ chạy lại, và do đó hiển thị lại cùng một notification!

**Vấn đề ở đây là ngay từ đầu, đoạn code này không nên là một Effect.** Bạn muốn gửi POST request và hiển thị notification để phản hồi *việc submit form,* vốn là một tương tác cụ thể. Để chạy code nhằm phản hồi một tương tác cụ thể, hãy đặt logic đó trực tiếp vào event handler tương ứng:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Tốt: logic dành riêng cho event được gọi từ event handler
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }

  // ...
}
```

Giờ đây code nằm trong một event handler, nên nó không reactive--vì vậy chỉ chạy khi người dùng submit form. Đọc thêm về [cách lựa chọn giữa event handler và Effects](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) và [cách xóa các Effect không cần thiết.](/learn/you-might-not-need-an-effect)

### Effect của bạn có đang thực hiện nhiều việc không liên quan không? {/*is-your-effect-doing-several-unrelated-things*/}

Câu hỏi tiếp theo bạn nên tự hỏi là liệu Effect của bạn có đang thực hiện nhiều việc không liên quan hay không.

Hãy tưởng tượng bạn đang tạo một biểu mẫu giao hàng, trong đó người dùng cần chọn thành phố và khu vực. Bạn fetch danh sách `cities` từ server dựa trên `country` đã chọn để hiển thị chúng trong một dropdown:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ Đã khai báo tất cả dependency

  // ...
```

Đây là một ví dụ điển hình về [việc fetch dữ liệu trong Effect.](/learn/you-might-not-need-an-effect#fetching-data) Bạn đang đồng bộ state `cities` với network dựa trên prop `country`. Bạn không thể thực hiện việc này trong event handler vì cần fetch ngay khi `ShippingForm` được hiển thị và bất cứ khi nào `country` thay đổi (bất kể tương tác nào gây ra thay đổi đó).

Bây giờ, giả sử bạn thêm một ô select thứ hai cho các khu vực của thành phố, ô này sẽ fetch `areas` cho `city` hiện đang được chọn. Bạn có thể bắt đầu bằng cách thêm một lời gọi `fetch` thứ hai cho danh sách khu vực bên trong cùng một Effect:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Tránh: một Effect đồng bộ hai quy trình độc lập
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ Đã khai báo tất cả dependency

  // ...
```

Tuy nhiên, vì Effect hiện sử dụng biến state `city`, bạn phải thêm `city` vào danh sách dependencies. Điều đó lại tạo ra một vấn đề: khi người dùng chọn một thành phố khác, Effect sẽ chạy lại và gọi `fetchCities(country)`. Kết quả là bạn sẽ fetch lại danh sách thành phố nhiều lần một cách không cần thiết.

**Vấn đề với đoạn code này là bạn đang đồng bộ hai việc khác nhau, không liên quan:**

1. Bạn muốn đồng bộ state `cities` với network dựa trên prop `country`.
1. Bạn muốn đồng bộ state `areas` với network dựa trên state `city`.

Hãy tách logic thành hai Effect, mỗi Effect phản hồi với prop mà nó cần đồng bộ:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ Đã khai báo tất cả dependency

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ Đã khai báo tất cả dependency

  // ...
```

Giờ đây, Effect đầu tiên chỉ chạy lại khi `country` thay đổi, trong khi Effect thứ hai chạy lại khi `city` thay đổi. Bạn đã tách chúng theo mục đích: hai việc khác nhau được đồng bộ bởi hai Effect riêng biệt. Hai Effect riêng biệt có hai danh sách dependencies riêng biệt, nên chúng sẽ không vô tình kích hoạt lẫn nhau.

Đoạn code cuối cùng dài hơn đoạn code ban đầu, nhưng việc tách các Effect này vẫn là đúng. [Mỗi Effect nên đại diện cho một quy trình đồng bộ độc lập.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) Trong ví dụ này, việc xóa một Effect không làm hỏng logic của Effect còn lại. Điều đó có nghĩa là chúng *đồng bộ những việc khác nhau,* và việc tách chúng ra là hợp lý. Nếu lo ngại về việc lặp code, bạn có thể cải thiện đoạn code này bằng cách [trích xuất logic lặp lại thành một custom Hook.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Bạn có đang đọc một state để tính toán state tiếp theo không? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Effect này cập nhật biến state `messages` bằng một mảng mới được tạo mỗi khi có tin nhắn mới:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

Nó sử dụng biến `messages` để [tạo một mảng mới](/learn/updating-arrays-in-state) bắt đầu với tất cả tin nhắn hiện có, rồi thêm tin nhắn mới vào cuối. Tuy nhiên, vì `messages` là một giá trị reactive được đọc bởi Effect, nó phải là một dependency:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Và việc đưa `messages` vào dependencies lại tạo ra một vấn đề.

Mỗi khi nhận được một tin nhắn, `setMessages()` khiến component re-render với một mảng `messages` mới có chứa tin nhắn vừa nhận. Tuy nhiên, vì Effect này hiện phụ thuộc vào `messages`, điều này cũng sẽ khiến Effect đồng bộ lại. Vì vậy, mỗi tin nhắn mới sẽ khiến chat kết nối lại. Người dùng sẽ không mong muốn điều đó!

Để khắc phục vấn đề, đừng đọc `messages` bên trong Effect. Thay vào đó, hãy truyền một [hàm updater](/reference/react/useState#updating-state-based-on-the-previous-state) cho `setMessages`:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Đã khai báo tất cả dependency
  // ...
```

**Lưu ý rằng Effect của bạn hiện hoàn toàn không đọc biến `messages`.** Bạn chỉ cần truyền một hàm updater như `msgs => [...msgs, receivedMessage]`. React [đưa hàm updater của bạn vào một queue](/learn/queueing-a-series-of-state-updates) và sẽ cung cấp đối số `msgs` cho hàm đó trong lần render tiếp theo. Đây là lý do Effect không còn cần phụ thuộc vào `messages`. Nhờ cách khắc phục này, việc nhận tin nhắn chat sẽ không còn khiến chat kết nối lại.

### Bạn có muốn đọc một giá trị mà không “phản hồi” với các thay đổi của nó không? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

Giả sử bạn muốn phát âm thanh khi người dùng nhận được tin nhắn mới, trừ khi `isMuted` là `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Vì Effect hiện sử dụng `isMuted` trong code, bạn phải thêm nó vào dependencies:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Vấn đề là mỗi khi `isMuted` thay đổi (ví dụ: khi người dùng nhấn toggle "Muted"), Effect sẽ đồng bộ lại và kết nối lại với chat. Đây không phải là trải nghiệm người dùng mong muốn! (Trong ví dụ này, ngay cả việc vô hiệu hóa linter cũng không có tác dụng--nếu làm vậy, `isMuted` sẽ bị “kẹt” ở giá trị cũ.)

Để giải quyết vấn đề này, bạn cần trích xuất logic không nên reactive ra khỏi Effect. Bạn không muốn Effect này “phản hồi” với các thay đổi trong `isMuted`. [Chuyển phần logic không reactive này vào một Effect Event:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Effect Events cho phép bạn tách một Effect thành các phần reactive (nên “phản hồi” với những giá trị reactive như `roomId` và các thay đổi của chúng) và các phần không reactive (chỉ đọc các giá trị mới nhất, như khi `onMessage` đọc `isMuted`). **Giờ đây, vì bạn đọc `isMuted` bên trong một Effect Event, nó không cần là dependency của Effect nữa.** Nhờ đó, chat sẽ không kết nối lại khi bạn bật hoặc tắt cài đặt "Muted", giải quyết vấn đề ban đầu!

#### Bọc một event handler từ props {/*wrapping-an-event-handler-from-the-props*/}

Bạn có thể gặp vấn đề tương tự khi component nhận một event handler dưới dạng prop:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Giả sử component cha truyền một hàm `onReceiveMessage` *khác nhau* trong mỗi lần render:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Vì `onReceiveMessage` là một dependency, nó sẽ khiến Effect đồng bộ lại sau mỗi lần component cha re-render. Điều này sẽ khiến chat kết nối lại. Để giải quyết vấn đề, hãy bọc lời gọi đó trong một Effect Event:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Effect Events không reactive, vì vậy bạn không cần chỉ định chúng làm dependencies. Nhờ đó, chat sẽ không còn kết nối lại, ngay cả khi component cha truyền một hàm khác nhau trong mỗi lần re-render.

#### Tách code reactive và không reactive {/*separating-reactive-and-non-reactive-code*/}

Trong ví dụ này, bạn muốn ghi log một lượt truy cập mỗi khi `roomId` thay đổi. Bạn muốn đưa `notificationCount` hiện tại vào mỗi log, nhưng *không muốn thay đổi trong `notificationCount` kích hoạt một sự kiện log.*

Một lần nữa, giải pháp là tách code không reactive thành một Effect Event:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ Đã khai báo tất cả dependency
  // ...
}
```

Bạn muốn logic của mình reactive đối với `roomId`, nên bạn đọc `roomId` bên trong Effect. Tuy nhiên, bạn không muốn thay đổi trong `notificationCount` ghi thêm một lượt truy cập, nên bạn đọc `notificationCount` bên trong Effect Event. [Tìm hiểu thêm về cách đọc props và state mới nhất từ Effects bằng Effect Events.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### Có giá trị reactive nào thay đổi ngoài ý muốn không? {/*does-some-reactive-value-change-unintentionally*/}

Đôi khi, bạn *thực sự* muốn Effect “phản hồi” với một giá trị nhất định, nhưng giá trị đó thay đổi thường xuyên hơn mức bạn muốn--và có thể không phản ánh bất kỳ thay đổi thực tế nào từ góc nhìn của người dùng. Ví dụ, giả sử bạn tạo một object `options` trong phần thân của component, rồi đọc object đó bên trong Effect:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Object này được khai báo trong phần thân component, nên nó là một [giá trị reactive.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Khi bạn đọc một giá trị reactive như vậy bên trong Effect, bạn khai báo nó là một dependency. Điều này đảm bảo Effect “phản hồi” với các thay đổi của nó:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Việc khai báo nó là một dependency rất quan trọng! Điều này đảm bảo, chẳng hạn, rằng nếu `roomId` thay đổi, Effect của bạn sẽ kết nối lại với chat bằng `options` mới. Tuy nhiên, đoạn code trên cũng có một vấn đề. Để thấy điều đó, hãy thử nhập vào input trong sandbox bên dưới và theo dõi điều gì xảy ra trong console:

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Tạm thời vô hiệu hóa linter để minh họa vấn đề
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

Trong sandbox trên, input chỉ cập nhật biến state `message`. Từ góc nhìn của người dùng, điều này không nên ảnh hưởng đến kết nối chat. Tuy nhiên, mỗi khi bạn cập nhật `message`, component sẽ re-render. Khi component re-render, code bên trong nó sẽ chạy lại từ đầu.

Một đối tượng `options` mới được tạo lại từ đầu sau mỗi lần render lại của component `ChatRoom`. React nhận thấy đối tượng `options` là một *đối tượng khác* với đối tượng `options` được tạo trong lần render trước. Đây là lý do React đồng bộ lại Effect của bạn (vốn phụ thuộc vào `options`), khiến chat kết nối lại khi bạn nhập.

**Vấn đề này chỉ ảnh hưởng đến các object và function. Trong JavaScript, mỗi object và function mới được tạo đều được xem là khác biệt với tất cả object và function khác. Việc nội dung bên trong chúng có thể giống nhau không quan trọng!**

```js {7-8}
// Trong lần render đầu tiên
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Trong lần render tiếp theo
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Đây là hai object khác nhau!
console.log(Object.is(options1, options2)); // false
```

**Dependencies là object và function có thể khiến Effect của bạn đồng bộ lại thường xuyên hơn mức cần thiết.**

Đây là lý do tại sao, bất cứ khi nào có thể, bạn nên cố gắng tránh dùng object và function làm dependencies của Effect. Thay vào đó, hãy thử di chuyển chúng ra ngoài component, vào bên trong Effect, hoặc trích xuất các giá trị nguyên thủy từ chúng.

#### Di chuyển các object và function tĩnh ra ngoài component của bạn {/*move-static-objects-and-functions-outside-your-component*/}

Nếu object không phụ thuộc vào bất kỳ props hay state nào, bạn có thể di chuyển object đó ra ngoài component:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Đã khai báo tất cả dependency
  // ...
```

Theo cách này, bạn *chứng minh* với linter rằng nó không mang tính reactive. Nó không thể thay đổi do một lần render lại, nên không cần là một dependency. Giờ đây, việc render lại `ChatRoom` sẽ không khiến Effect của bạn đồng bộ lại.

Điều này cũng áp dụng cho function:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Đã khai báo tất cả dependency
  // ...
```

Vì `createOptions` được khai báo bên ngoài component, nó không phải là một giá trị reactive. Đây là lý do nó không cần được chỉ định trong dependencies của Effect, và cũng là lý do nó sẽ không bao giờ khiến Effect của bạn đồng bộ lại.

#### Di chuyển các object và function động vào bên trong Effect {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Nếu object của bạn phụ thuộc vào một giá trị reactive có thể thay đổi do render lại, chẳng hạn như một prop `roomId`, bạn không thể đưa nó *ra ngoài* component. Tuy nhiên, bạn có thể chuyển việc tạo object đó *vào bên trong* code của Effect:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Giờ đây, vì `options` được khai báo bên trong Effect, nó không còn là dependency của Effect nữa. Thay vào đó, giá trị reactive duy nhất được Effect sử dụng là `roomId`. Vì `roomId` không phải là object hay function, bạn có thể chắc chắn rằng nó sẽ không khác đi một cách *ngoài ý muốn*. Trong JavaScript, number và string được so sánh dựa trên nội dung của chúng:

```js {7-8}
// Trong lần render đầu tiên
const roomId1 = 'music';

// Trong lần render tiếp theo
const roomId2 = 'music';

// Hai chuỗi này giống nhau!
console.log(Object.is(roomId1, roomId2)); // true
```

Nhờ cách sửa này, chat không còn kết nối lại khi bạn chỉnh sửa input:

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

Tuy nhiên, chat *sẽ* kết nối lại khi bạn thay đổi dropdown `roomId`, đúng như mong đợi.

Điều này cũng áp dụng cho function:

```js {7-12,14}
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
  }, [roomId]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Bạn có thể tự viết các function để nhóm các phần logic bên trong Effect. Miễn là bạn cũng khai báo chúng *bên trong* Effect, chúng không phải là các giá trị reactive, nên không cần là dependencies của Effect.

#### Đọc các giá trị nguyên thủy từ object {/*read-primitive-values-from-objects*/}

Đôi khi, bạn có thể nhận một object từ props:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Rủi ro ở đây là component cha sẽ tạo object trong quá trình render:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Điều này sẽ khiến Effect của bạn kết nối lại mỗi khi component cha render lại. Để khắc phục, hãy đọc thông tin từ object *bên ngoài* Effect và tránh có các dependency là object và function:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Logic trở nên hơi lặp lại (bạn đọc một số giá trị từ object bên ngoài Effect, rồi tạo một object có cùng các giá trị bên trong Effect). Nhưng cách này làm rõ ràng chính xác những thông tin mà Effect của bạn *thực sự* phụ thuộc vào. Nếu component cha vô tình tạo lại object, chat sẽ không kết nối lại. Tuy nhiên, nếu `options.roomId` hoặc `options.serverUrl` thực sự khác nhau, chat sẽ kết nối lại.

#### Tính các giá trị nguyên thủy từ function {/*calculate-primitive-values-from-functions*/}

Cách tiếp cận tương tự cũng có thể áp dụng cho function. Ví dụ, giả sử component cha truyền vào một function:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

Để tránh biến function đó thành một dependency (và khiến nó kết nối lại khi render lại), hãy gọi nó bên ngoài Effect. Việc này cung cấp cho bạn các giá trị `roomId` và `serverUrl` không phải là object, và bạn có thể đọc chúng từ bên trong Effect:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Đã khai báo tất cả dependency
  // ...
```

Cách này chỉ hoạt động với các function [pure](/learn/keeping-components-pure) vì chúng an toàn để gọi trong quá trình render. Nếu function của bạn là một event handler nhưng bạn không muốn các thay đổi của nó đồng bộ lại Effect, [hãy bọc nó trong một Effect Event.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Dependencies luôn phải khớp với code.
- Khi không hài lòng với các dependencies, phần bạn cần chỉnh sửa là code.
- Việc tắt linter dẫn đến những bug rất khó hiểu, vì vậy bạn luôn nên tránh làm điều đó.
- Để loại bỏ một dependency, bạn cần “chứng minh” với linter rằng dependency đó không cần thiết.
- Nếu một đoạn code nên chạy để phản hồi một tương tác cụ thể, hãy chuyển đoạn code đó vào event handler.
- Nếu các phần khác nhau của Effect cần chạy lại vì những lý do khác nhau, hãy tách chúng thành nhiều Effect.
- Nếu muốn cập nhật state dựa trên state trước đó, hãy truyền vào một updater function.
- Nếu muốn đọc giá trị mới nhất mà không “phản ứng” với nó, hãy trích xuất một Effect Event từ Effect.
- Trong JavaScript, object và function được xem là khác nhau nếu chúng được tạo tại những thời điểm khác nhau.
- Cố gắng tránh các dependency là object và function. Hãy di chuyển chúng ra ngoài component hoặc vào bên trong Effect.

</Recap>

<Challenges>

#### Sửa interval bị đặt lại {/*fix-a-resetting-interval*/}

Effect này thiết lập một interval chạy mỗi giây. Bạn nhận thấy một điều kỳ lạ: có vẻ như interval bị hủy và tạo lại mỗi khi nó chạy. Hãy sửa code để interval không liên tục được tạo lại.

<Hint>

Có vẻ như code của Effect này phụ thuộc vào `count`. Có cách nào để không cần dependency này không? Phải có cách cập nhật state `count` dựa trên giá trị trước đó mà không thêm dependency cho giá trị đó.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

Bạn muốn cập nhật state `count` thành `count + 1` từ bên trong Effect. Tuy nhiên, điều này khiến Effect của bạn phụ thuộc vào `count`, vốn thay đổi sau mỗi lần chạy, và đó là lý do interval của bạn được tạo lại sau mỗi lần chạy.

Để giải quyết vấn đề này, hãy sử dụng [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) và viết `setCount(c => c + 1)` thay vì `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

Thay vì đọc `count` bên trong Effect, bạn truyền một instruction `c => c + 1` (“tăng số này lên!”) cho React. React sẽ áp dụng instruction đó trong lần render tiếp theo. Và vì bạn không còn cần đọc giá trị của `count` bên trong Effect nữa, bạn có thể để dependencies của Effect trống (`[]`). Điều này ngăn Effect tạo lại interval sau mỗi lần chạy.

</Solution>

#### Sửa animation bị kích hoạt lại {/*fix-a-retriggering-animation*/}

Trong ví dụ này, khi bạn nhấn “Show”, một thông báo chào mừng sẽ dần hiện ra. Animation mất một giây. Khi bạn nhấn “Remove”, thông báo chào mừng lập tức biến mất. Logic cho animation fade-in được triển khai trong file `animation.js` dưới dạng một [animation loop.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) bằng JavaScript thuần. Bạn không cần thay đổi logic đó. Bạn có thể xem nó như một thư viện bên thứ ba. Effect của bạn tạo một instance của `FadeInAnimation` cho DOM node, sau đó gọi `start(duration)` hoặc `stop()` để điều khiển animation. `duration` được điều khiển bằng một slider. Hãy điều chỉnh slider và xem animation thay đổi như thế nào.

Code này đã hoạt động, nhưng bạn muốn thay đổi một điều. Hiện tại, khi bạn di chuyển slider điều khiển biến state `duration`, animation sẽ được kích hoạt lại. Hãy thay đổi hành vi để Effect không “phản ứng” với biến `duration`. Khi bạn nhấn “Show”, Effect nên sử dụng giá trị `duration` hiện tại trên slider. Tuy nhiên, bản thân việc di chuyển slider không nên kích hoạt lại animation.

<Hint>

Có dòng code nào bên trong Effect không nên mang tính reactive không? Làm thế nào bạn có thể đưa code không reactive ra ngoài Effect?

</Hint>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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

<Solution>

Effect của bạn cần đọc giá trị mới nhất của `duration`, nhưng bạn không muốn Effect “phản ứng” với các thay đổi của `duration`. Bạn sử dụng `duration` để bắt đầu animation, nhưng việc bắt đầu animation không mang tính reactive. Hãy trích xuất dòng code không reactive vào một Effect Event, rồi gọi function đó từ Effect.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
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

Các Effect Event như `onAppear` không mang tính reactive, nên bạn có thể đọc `duration` bên trong chúng mà không kích hoạt lại animation.

</Solution>

#### Sửa chat liên tục kết nối lại {/*fix-a-reconnecting-chat*/}

Trong ví dụ này, mỗi lần bạn nhấn "Toggle theme", chat lại kết nối. Tại sao điều này xảy ra? Hãy sửa lỗi để chat chỉ kết nối lại khi bạn chỉnh sửa Server URL hoặc chọn một phòng chat khác.

Hãy coi `chat.js` là một thư viện bên thứ ba bên ngoài: bạn có thể tham khảo thư viện này để kiểm tra API của nó, nhưng không được chỉnh sửa nó.

<Hint>

Có nhiều cách để sửa lỗi này, nhưng cuối cùng, bạn cần tránh sử dụng một object làm dependency.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Effect của bạn đang chạy lại vì nó phụ thuộc vào object `options`. Các object có thể bị tạo lại ngoài ý muốn, vì vậy bạn nên cố gắng tránh sử dụng chúng làm dependency của Effects bất cứ khi nào có thể.

Cách sửa ít ảnh hưởng nhất là đọc `roomId` và `serverUrl` ngay bên ngoài Effect, sau đó để Effect phụ thuộc vào các giá trị primitive đó (những giá trị không thể thay đổi ngoài ý muốn). Bên trong Effect, hãy tạo một object và truyền nó cho `createConnection`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Tốt hơn nữa, hãy thay prop object `options` bằng các prop cụ thể hơn là `roomId` và `serverUrl`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Ưu tiên sử dụng các prop primitive khi có thể sẽ giúp bạn dễ tối ưu hóa các component hơn về sau.

</Solution>

#### Sửa chat bị kết nối lại, lần nữa {/*fix-a-reconnecting-chat-again*/}

Ví dụ này kết nối với chat có hoặc không có mã hóa. Hãy bật hoặc tắt checkbox và chú ý các thông báo khác nhau trong console khi mã hóa được bật hoặc tắt. Hãy thử thay đổi phòng. Sau đó, hãy thử bật hoặc tắt giao diện. Khi bạn đã kết nối với một phòng chat, bạn sẽ nhận được tin nhắn mới sau mỗi vài giây. Hãy xác nhận rằng màu của chúng khớp với giao diện bạn đã chọn.

Trong ví dụ này, chat kết nối lại mỗi lần bạn thử thay đổi giao diện. Hãy sửa lỗi này. Sau khi sửa, việc thay đổi giao diện không được khiến chat kết nối lại, nhưng việc bật hoặc tắt cài đặt mã hóa hay thay đổi phòng phải khiến chat kết nối lại.

Không thay đổi bất kỳ đoạn code nào trong `chat.js`. Ngoài điều đó ra, bạn có thể thay đổi bất kỳ đoạn code nào miễn là kết quả vẫn giữ nguyên hành vi. Chẳng hạn, bạn có thể thấy hữu ích khi thay đổi các prop được truyền xuống.

<Hint>

Bạn đang truyền xuống hai hàm: `onMessage` và `createConnection`. Cả hai đều được tạo lại từ đầu mỗi khi `App` re-render. Chúng được xem là các giá trị mới mỗi lần, đó là lý do chúng kích hoạt lại Effect.

Một trong hai hàm này là event handler. Bạn có biết cách nào để gọi một event handler từ Effect mà không "phản ứng" với các giá trị mới của hàm event handler đó không? Điều này sẽ rất hữu ích!

Một hàm khác chỉ tồn tại để truyền một state vào một method API đã được import. Hàm này có thực sự cần thiết không? Thông tin cốt lõi được truyền xuống là gì? Bạn có thể cần chuyển một số import từ `App.js` sang `ChatRoom.js`.

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Có nhiều cách đúng để giải quyết vấn đề này, nhưng dưới đây là một giải pháp khả thi.

Trong ví dụ ban đầu, việc bật hoặc tắt giao diện khiến các hàm `onMessage` và `createConnection` khác nhau được tạo ra và truyền xuống. Vì Effect phụ thuộc vào các hàm này, chat sẽ kết nối lại mỗi lần bạn bật hoặc tắt giao diện.

Để khắc phục vấn đề với `onMessage`, bạn cần bọc nó trong một Effect Event:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Không giống prop `onMessage`, Effect Event `onReceiveMessage` không mang tính reactive. Vì vậy, nó không cần là dependency của Effect. Kết quả là các thay đổi đối với `onMessage` sẽ không khiến chat kết nối lại.

Bạn không thể làm tương tự với `createConnection` vì nó *nên* mang tính reactive. Bạn *muốn* Effect được kích hoạt lại nếu người dùng chuyển đổi giữa kết nối có mã hóa và không mã hóa, hoặc nếu người dùng chuyển sang phòng hiện tại khác. Tuy nhiên, vì `createConnection` là một hàm, bạn không thể kiểm tra xem thông tin mà nó đọc có *thực sự* thay đổi hay không. Để giải quyết vấn đề này, thay vì truyền `createConnection` xuống từ component `App`, hãy truyền trực tiếp các giá trị `roomId` và `isEncrypted`:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Bây giờ, bạn có thể chuyển hàm `createConnection` *vào bên trong* Effect thay vì truyền nó xuống từ `App`:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

Sau hai thay đổi này, Effect của bạn không còn phụ thuộc vào bất kỳ giá trị hàm nào nữa:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Các giá trị reactive
  const onReceiveMessage = useEffectEvent(onMessage); // Không reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Đọc một giá trị reactive
      };
      if (isEncrypted) { // Đọc một giá trị reactive
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ Đã khai báo tất cả dependency
```

Kết quả là chat chỉ kết nối lại khi một điều gì đó có ý nghĩa (`roomId` hoặc `isEncrypted`) thay đổi:

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
