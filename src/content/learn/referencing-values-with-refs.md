---
title: 'Tham chiếu các giá trị bằng Refs'
---

<Intro>

Khi bạn muốn một component “ghi nhớ” một số thông tin, nhưng không muốn thông tin đó [kích hoạt các lần render mới](/learn/render-and-commit), bạn có thể sử dụng một *ref*.

</Intro>

<YouWillLearn>

- Cách thêm một ref vào component
- Cách cập nhật giá trị của ref
- Refs khác với state như thế nào
- Cách sử dụng refs an toàn

</YouWillLearn>

## Thêm một ref vào component {/*adding-a-ref-to-your-component*/}

Bạn có thể thêm một ref vào component bằng cách import Hook `useRef` từ React:

```js
import { useRef } from 'react';
```

Bên trong component, hãy gọi Hook `useRef` và truyền giá trị ban đầu mà bạn muốn tham chiếu làm đối số duy nhất. Ví dụ, sau đây là một ref đến giá trị `0`:

```js
const ref = useRef(0);
```

`useRef` trả về một object như sau:

```js
{
  current: 0 // The value you passed to useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="An arrow with 'current' written on it stuffed into a pocket with 'ref' written on it." />

Bạn có thể truy cập giá trị hiện tại của ref thông qua thuộc tính `ref.current`. Giá trị này có thể thay đổi một cách có chủ đích, nghĩa là bạn có thể đọc và ghi vào nó. Nó giống như một ngăn túi bí mật của component mà React không theo dõi. (Đây chính là điều khiến nó trở thành một “lối thoát” khỏi luồng dữ liệu một chiều của React—sẽ nói thêm về điều này bên dưới!)

Ở đây, một button sẽ tăng `ref.current` sau mỗi lần nhấp:

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

Ref trỏ đến một số, nhưng cũng giống như [state](/learn/state-a-components-memory), bạn có thể cho nó trỏ đến bất kỳ thứ gì: một chuỗi, một object, hoặc thậm chí một function. Không giống state, ref là một object JavaScript thông thường có thuộc tính `current` mà bạn có thể đọc và thay đổi.

Lưu ý rằng **component không re-render sau mỗi lần tăng.** Giống như state, refs được React giữ lại giữa các lần re-render. Tuy nhiên, việc thiết lập state sẽ re-render một component. Thay đổi ref thì không!

## Ví dụ: xây dựng một stopwatch {/*example-building-a-stopwatch*/}

Bạn có thể kết hợp refs và state trong cùng một component. Ví dụ, hãy tạo một stopwatch mà người dùng có thể bắt đầu hoặc dừng bằng cách nhấn một button. Để hiển thị khoảng thời gian đã trôi qua kể từ khi người dùng nhấn “Start”, bạn cần theo dõi thời điểm button Start được nhấn và thời gian hiện tại. **Thông tin này được dùng để render, vì vậy bạn sẽ lưu nó trong state:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Khi người dùng nhấn “Start”, bạn sẽ sử dụng [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) để cập nhật thời gian sau mỗi 10 mili giây:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}
```

</Sandpack>

Khi button “Stop” được nhấn, bạn cần hủy interval hiện tại để nó ngừng cập nhật biến state `now`. Bạn có thể thực hiện việc này bằng cách gọi [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), nhưng bạn cần truyền cho nó ID của interval đã được trả về trước đó bởi lệnh gọi `setInterval` khi người dùng nhấn Start. Bạn cần lưu ID của interval ở đâu đó. **Vì ID của interval không được dùng để render, bạn có thể lưu nó trong một ref:**

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

Khi một thông tin được dùng để render, hãy lưu thông tin đó trong state. Khi một thông tin chỉ cần thiết cho các event handler và việc thay đổi thông tin đó không yêu cầu re-render, sử dụng ref có thể hiệu quả hơn.

## Sự khác nhau giữa refs và state {/*differences-between-refs-and-state*/}

Có lẽ bạn đang nghĩ rằng refs có vẻ ít “nghiêm ngặt” hơn state—chẳng hạn, bạn có thể thay đổi chúng thay vì luôn phải sử dụng một hàm thiết lập state. Tuy nhiên, trong hầu hết trường hợp, bạn sẽ muốn sử dụng state. Refs là một “lối thoát” mà bạn không thường xuyên cần đến. Sau đây là so sánh giữa state và refs:

| refs                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` trả về `{ current: initialValue }`                            | `useState(initialValue)` trả về giá trị hiện tại của biến state và một hàm setter của state ( `[value, setValue]`) |
| Không kích hoạt re-render khi bạn thay đổi nó.                                         | Kích hoạt re-render khi bạn thay đổi nó.                                                                                    |
| Có thể thay đổi—bạn có thể sửa đổi và cập nhật giá trị của `current` bên ngoài quá trình render. | “Bất biến”—bạn phải sử dụng hàm thiết lập state để sửa đổi các biến state nhằm xếp hàng một lần re-render.                       |
| Bạn không nên đọc (hoặc ghi) giá trị `current` trong khi render. | Bạn có thể đọc state bất kỳ lúc nào. Tuy nhiên, mỗi lần render có một [snapshot](/learn/state-as-a-snapshot) riêng của state và snapshot này không thay đổi. |

Sau đây là một button bộ đếm được triển khai bằng state:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

Vì giá trị `count` được hiển thị, việc sử dụng một giá trị state cho nó là hợp lý. Khi giá trị của bộ đếm được thiết lập bằng `setCount()`, React sẽ re-render component và màn hình cập nhật để phản ánh số đếm mới.

Nếu bạn thử triển khai việc này bằng một ref, React sẽ không bao giờ re-render component, vì vậy bạn sẽ không bao giờ thấy số đếm thay đổi! Hãy xem việc nhấp vào button này **không cập nhật nội dung của nó**:

<Sandpack>

```js {expectedErrors: {'react-compiler': [13]}}
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // This doesn't re-render the component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

Đây là lý do việc đọc `ref.current` trong quá trình render dẫn đến code không đáng tin cậy. Nếu cần điều đó, hãy sử dụng state thay thế.

<DeepDive>

#### Bên trong useRef hoạt động như thế nào? {/*how-does-use-ref-work-inside*/}

Mặc dù cả `useState` và `useRef` đều được React cung cấp, về nguyên tắc `useRef` có thể được triển khai _dựa trên_ `useState`. Bạn có thể hình dung rằng bên trong React, `useRef` được triển khai như sau:

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Trong lần render đầu tiên, `useRef` trả về `{ current: initialValue }`. Object này được React lưu lại, vì vậy trong lần render tiếp theo, cùng object đó sẽ được trả về. Hãy chú ý rằng setter của state không được sử dụng trong ví dụ này. Nó không cần thiết vì `useRef` luôn cần trả về cùng một object!

React cung cấp phiên bản tích hợp sẵn của `useRef` vì nó đủ phổ biến trong thực tế. Nhưng bạn có thể hình dung nó như một biến state thông thường không có setter. Nếu quen thuộc với lập trình hướng đối tượng, refs có thể khiến bạn liên tưởng đến các field của instance—nhưng thay vì `this.something`, bạn viết `somethingRef.current`.

</DeepDive>

## Khi nào nên sử dụng refs {/*when-to-use-refs*/}

Thông thường, bạn sẽ sử dụng ref khi component cần “bước ra ngoài” React và giao tiếp với các API bên ngoài—thường là một API của trình duyệt không ảnh hưởng đến giao diện của component. Dưới đây là một số tình huống hiếm gặp như vậy:

- Lưu trữ [timeout IDs](https://developer.mozilla.org/docs/Web/API/setTimeout)
- Lưu trữ và thao tác với các [DOM elements](https://developer.mozilla.org/docs/Web/API/Element), nội dung này được đề cập ở [trang tiếp theo](/learn/manipulating-the-dom-with-refs)
- Lưu trữ các object khác không cần thiết để tính toán JSX.

Nếu component cần lưu trữ một giá trị nhưng giá trị đó không ảnh hưởng đến logic render, hãy chọn refs.

## Các phương pháp tốt nhất khi sử dụng refs {/*best-practices-for-refs*/}

Tuân theo các nguyên tắc này sẽ giúp component của bạn dễ dự đoán hơn:

- **Hãy xem refs như một lối thoát.** Refs hữu ích khi bạn làm việc với các hệ thống bên ngoài hoặc API của trình duyệt. Nếu phần lớn logic ứng dụng và luồng dữ liệu của bạn dựa vào refs, có thể bạn nên xem xét lại cách tiếp cận của mình.
- **Không đọc hoặc ghi `ref.current` trong quá trình render.** Nếu cần một thông tin trong quá trình render, hãy sử dụng [state](/learn/state-a-components-memory) thay thế. Vì React không biết khi nào `ref.current` thay đổi, ngay cả việc đọc nó trong quá trình render cũng khiến hành vi của component khó dự đoán. (Ngoại lệ duy nhất là code như `if (!ref.current) ref.current = new Thing()`, chỉ thiết lập ref một lần trong lần render đầu tiên.)

Các giới hạn của React state không áp dụng cho refs. Ví dụ, state hoạt động như một [snapshot cho mỗi lần render](/learn/state-as-a-snapshot) và [không cập nhật đồng bộ.](/learn/queueing-a-series-of-state-updates) Nhưng khi bạn thay đổi giá trị hiện tại của ref, nó thay đổi ngay lập tức:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Điều này là do **bản thân ref là một object JavaScript thông thường,** nên nó hoạt động như một object thông thường.

Bạn cũng không cần lo lắng về việc [tránh thay đổi](/learn/updating-objects-in-state) khi làm việc với ref. Miễn là object bạn đang thay đổi không được dùng để render, React không quan tâm bạn làm gì với ref hoặc nội dung của nó.

## Refs và DOM {/*refs-and-the-dom*/}

Bạn có thể trỏ một ref đến bất kỳ giá trị nào. Tuy nhiên, trường hợp sử dụng phổ biến nhất của ref là truy cập một phần tử DOM. Ví dụ, điều này rất hữu ích nếu bạn muốn focus một input bằng code. Khi bạn truyền một ref vào thuộc tính `ref` trong JSX, chẳng hạn như `<div ref={myRef}>`, React sẽ đặt phần tử DOM tương ứng vào `myRef.current`. Khi phần tử bị xóa khỏi DOM, React sẽ cập nhật `myRef.current` thành `null`. Bạn có thể đọc thêm về vấn đề này trong [Manipulating the DOM with Refs.](/learn/manipulating-the-dom-with-refs)

<Recap>

- Ref là một lối thoát (escape hatch) để lưu giữ các giá trị không được dùng cho việc render. Bạn sẽ không thường xuyên cần đến chúng.
- Ref là một object JavaScript thuần túy với một thuộc tính duy nhất có tên là `current`, mà bạn có thể đọc hoặc thiết lập.
- Bạn có thể yêu cầu React cung cấp một ref bằng cách gọi Hook `useRef`.
- Giống như state, ref cho phép bạn giữ lại thông tin giữa các lần re-render của một component.
- Không giống state, việc thiết lập giá trị `current` của ref không kích hoạt re-render.
- Đừng đọc hoặc ghi `ref.current` trong quá trình render. Điều này khiến component của bạn khó dự đoán.

</Recap>

<Challenges>

#### Sửa input chat bị lỗi {/*fix-a-broken-chat-input*/}

Nhập một tin nhắn và nhấp vào "Send". Bạn sẽ nhận thấy có độ trễ ba giây trước khi cảnh báo "Sent!" xuất hiện. Trong thời gian chờ này, bạn có thể thấy nút "Undo". Hãy nhấp vào đó. Nút "Undo" này được cho là sẽ ngăn thông báo "Sent!" xuất hiện. Nó thực hiện điều này bằng cách gọi [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) cho ID của timeout được lưu trong `handleSend`. Tuy nhiên, ngay cả sau khi nhấp vào "Undo", thông báo "Sent!" vẫn xuất hiện. Hãy tìm nguyên nhân khiến nó không hoạt động và sửa lỗi.

<Hint>

Các biến thông thường như `let timeoutID` không “tồn tại” qua các lần re-render vì mỗi lần render sẽ chạy component của bạn (và khởi tạo các biến của nó) lại từ đầu. Bạn có nên lưu ID của timeout ở một nơi khác không?

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Mỗi khi component của bạn re-render (chẳng hạn như khi bạn set state), tất cả biến cục bộ đều được khởi tạo lại từ đầu. Đây là lý do bạn không thể lưu ID của timeout trong một biến cục bộ như `timeoutID` rồi mong đợi một event handler khác có thể “nhìn thấy” nó trong tương lai. Thay vào đó, hãy lưu nó trong một ref, vì React sẽ bảo toàn ref đó giữa các lần render.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>

#### Sửa component không re-render {/*fix-a-component-failing-to-re-render*/}

Nút này được cho là sẽ chuyển đổi giữa việc hiển thị "On" và "Off". Tuy nhiên, nó luôn hiển thị "Off". Đoạn code này có vấn đề gì? Hãy sửa nó.

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

Trong ví dụ này, giá trị hiện tại của một ref được dùng để tính toán kết quả render: `{isOnRef.current ? 'On' : 'Off'}`. Đây là dấu hiệu cho thấy thông tin này không nên nằm trong ref mà thay vào đó phải được đặt trong state. Để sửa, hãy xóa ref và sử dụng state:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Sửa debounce {/*fix-debouncing*/}

Trong ví dụ này, tất cả các handler xử lý sự kiện nhấp nút đều được ["debounced".](https://kettanaito.com/blog/debounce-vs-throttle) Để hiểu điều này có nghĩa là gì, hãy nhấn một trong các nút. Hãy chú ý cách thông báo xuất hiện sau một giây. Nếu bạn nhấn nút trong lúc chờ thông báo, timer sẽ được đặt lại. Vì vậy, nếu bạn tiếp tục nhấp nhanh nhiều lần vào cùng một nút, thông báo sẽ chỉ xuất hiện một giây *sau khi* bạn dừng nhấp. Debouncing cho phép trì hoãn một hành động nào đó cho đến khi người dùng “ngừng thực hiện thao tác”.

Ví dụ này hoạt động, nhưng chưa hoàn toàn đúng như dự định. Các nút không độc lập với nhau. Để thấy vấn đề, hãy nhấp vào một nút, sau đó ngay lập tức nhấp vào một nút khác. Bạn sẽ mong đợi rằng sau một khoảng trễ, thông báo của cả hai nút sẽ xuất hiện. Nhưng chỉ thông báo của nút cuối cùng xuất hiện. Thông báo của nút đầu tiên bị mất.

Tại sao các nút lại ảnh hưởng lẫn nhau? Hãy tìm và sửa vấn đề.

<Hint>

Biến ID của timeout gần đây nhất được dùng chung giữa tất cả các component `DebouncedButton`. Đây là lý do việc nhấp vào một nút lại đặt lại timeout của nút khác. Bạn có thể lưu một ID timeout riêng cho mỗi nút không?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

Một biến như `timeoutID` được dùng chung giữa tất cả các component. Đây là lý do việc nhấp vào nút thứ hai lại đặt lại timeout đang chờ của nút thứ nhất. Để sửa, bạn có thể lưu timeout trong một ref. Mỗi nút sẽ có ref riêng, vì vậy chúng sẽ không xung đột với nhau. Hãy chú ý rằng khi nhấp nhanh vào hai nút, cả hai thông báo đều sẽ xuất hiện.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Đọc state mới nhất {/*read-the-latest-state*/}

Trong ví dụ này, sau khi bạn nhấn "Send", sẽ có một khoảng trễ ngắn trước khi thông báo xuất hiện. Nhập "hello", nhấn Send, rồi nhanh chóng chỉnh sửa input lần nữa. Bất chấp những chỉnh sửa của bạn, cảnh báo vẫn sẽ hiển thị "hello" (đó là giá trị của state [tại thời điểm](/learn/state-as-a-snapshot#state-over-time) nút được nhấp).

Thông thường, đây là hành vi bạn muốn trong một ứng dụng. Tuy nhiên, đôi khi bạn có thể muốn một đoạn code bất đồng bộ đọc phiên bản *mới nhất* của một state nào đó. Bạn có nghĩ ra cách để cảnh báo hiển thị nội dung input *hiện tại* thay vì nội dung tại thời điểm nhấp nút không?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

State hoạt động [giống như một snapshot](/learn/state-as-a-snapshot), vì vậy bạn không thể đọc state mới nhất từ một thao tác bất đồng bộ như timeout. Tuy nhiên, bạn có thể lưu nội dung input mới nhất trong một ref. Ref có thể thay đổi, vì vậy bạn có thể đọc thuộc tính `current` bất kỳ lúc nào. Vì nội dung hiện tại cũng được dùng cho việc render, trong ví dụ này, bạn sẽ cần *cả* một biến state (để render), *và* một ref (để đọc nó trong timeout). Bạn sẽ cần cập nhật giá trị ref hiện tại theo cách thủ công.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>