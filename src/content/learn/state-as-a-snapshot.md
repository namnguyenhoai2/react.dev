---
title: State dưới dạng ảnh chụp nhanh
---

<Intro>

Các biến state có thể trông giống như những biến JavaScript thông thường mà bạn có thể đọc và ghi. Tuy nhiên, state hoạt động giống một ảnh chụp nhanh hơn. Việc thiết lập state không thay đổi biến state mà bạn đang có, mà thay vào đó sẽ kích hoạt một lần re-render.

</Intro>

<YouWillLearn>

* Cách việc thiết lập state kích hoạt re-render
* Khi nào và bằng cách nào state được cập nhật
* Vì sao state không được cập nhật ngay sau khi bạn thiết lập
* Cách các event handler truy cập một “ảnh chụp nhanh” của state

</YouWillLearn>

## Việc thiết lập state kích hoạt render {/*setting-state-triggers-renders*/}

Bạn có thể nghĩ rằng giao diện người dùng thay đổi trực tiếp để phản hồi một sự kiện của người dùng, chẳng hạn như một lần nhấp. Trong React, mọi việc hơi khác với mô hình tư duy này. Ở trang trước, bạn đã thấy rằng [việc thiết lập state yêu cầu một lần re-render](/learn/render-and-commit#step-1-trigger-a-render) từ React. Điều này có nghĩa là để giao diện phản hồi sự kiện, bạn cần *cập nhật state*.

Trong ví dụ này, khi bạn nhấn "send", `setIsSent(true)` yêu cầu React re-render UI:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Đây là những gì xảy ra khi bạn nhấp vào nút:

1. Event handler `onSubmit` được thực thi.
2. `setIsSent(true)` thiết lập `isSent` thành `true` và xếp hàng một lần render mới.
3. React re-render component dựa trên giá trị `isSent` mới.

Hãy xem xét kỹ hơn mối quan hệ giữa state và rendering.

## Rendering tạo một ảnh chụp nhanh theo thời điểm {/*rendering-takes-a-snapshot-in-time*/}

["Rendering"](/learn/render-and-commit#step-2-react-renders-your-components) có nghĩa là React đang gọi component của bạn, vốn là một function. JSX mà bạn trả về từ function đó giống như một ảnh chụp nhanh của UI tại một thời điểm. Props, event handler và biến cục bộ của nó đều được tính toán **dựa trên state tại thời điểm render.**

Không giống một bức ảnh hoặc một khung hình trong phim, “ảnh chụp nhanh” UI mà bạn trả về vẫn có tính tương tác. Nó bao gồm logic như các event handler, xác định điều gì xảy ra để phản hồi các input. React cập nhật màn hình để khớp với ảnh chụp nhanh này và kết nối các event handler. Vì vậy, nhấn một nút sẽ kích hoạt click handler từ JSX của bạn.

Khi React re-render một component:

1. React gọi lại function của bạn.
2. Function của bạn trả về một ảnh chụp nhanh JSX mới.
3. Sau đó, React cập nhật màn hình để khớp với ảnh chụp nhanh mà function của bạn đã trả về.

<IllustrationBlock sequential>
    <Illustration caption="React executing the function" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Calculating the snapshot" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Updating the DOM tree" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Là bộ nhớ của component, state không giống một biến thông thường sẽ biến mất sau khi function của bạn trả về. State thực sự “sống” trong chính React—như thể nằm trên một chiếc kệ!—ở bên ngoài function của bạn. Khi React gọi component, nó cung cấp cho bạn một ảnh chụp nhanh của state cho lần render cụ thể đó. Component của bạn trả về một ảnh chụp nhanh UI với một tập props và event handler mới trong JSX, tất cả đều được tính toán **dựa trên các giá trị state từ lần render đó!**

<IllustrationBlock sequential>
  <Illustration caption="You tell React to update the state" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React updates the state value" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React passes a snapshot of the state value into the component" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

Sau đây là một thử nghiệm nhỏ để cho bạn thấy cách hoạt động này. Trong ví dụ này, bạn có thể mong đợi rằng việc nhấp vào nút "+3" sẽ tăng counter ba lần vì nó gọi `setNumber(number + 1)` ba lần.

Hãy xem điều gì xảy ra khi bạn nhấp vào nút "+3":

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Lưu ý rằng `number` chỉ tăng một lần sau mỗi lần nhấp!

**Việc thiết lập state chỉ thay đổi state cho lần render *tiếp theo*.** Trong lần render đầu tiên, `number` là `0`. Đây là lý do trong handler `onClick` của *lần render đó*, giá trị của `number` vẫn là `0` ngay cả sau khi `setNumber(number + 1)` được gọi:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Đây là những gì click handler của nút yêu cầu React thực hiện:

1. `setNumber(number + 1)`: `number` là `0` nên `setNumber(0 + 1)`.
    - React chuẩn bị thay đổi `number` thành `1` trong lần render tiếp theo.
2. `setNumber(number + 1)`: `number` là `0` nên `setNumber(0 + 1)`.
    - React chuẩn bị thay đổi `number` thành `1` trong lần render tiếp theo.
3. `setNumber(number + 1)`: `number` là `0` nên `setNumber(0 + 1)`.
    - React chuẩn bị thay đổi `number` thành `1` trong lần render tiếp theo.

Mặc dù bạn đã gọi `setNumber(number + 1)` ba lần, trong event handler của *lần render này*, `number` luôn là `0`, nên bạn thiết lập state thành `1` ba lần. Đây là lý do sau khi event handler kết thúc, React re-render component với `number` bằng `1` thay vì `3`.

Bạn cũng có thể hình dung điều này bằng cách thay thế các biến state bằng giá trị của chúng trong code. Vì biến state `number` là `0` trong *lần render này*, event handler của nó sẽ trông như sau:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Trong lần render tiếp theo, `number` là `1`, nên click handler của *lần render đó* sẽ trông như sau:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Đây là lý do việc nhấp vào nút lần nữa sẽ thiết lập counter thành `2`, rồi thành `3` ở lần nhấp tiếp theo, v.v.

## State theo thời gian {/*state-over-time*/}

Thật thú vị. Hãy thử đoán xem việc nhấp vào nút này sẽ alert điều gì:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Nếu sử dụng phương pháp thay thế như trước, bạn có thể đoán rằng alert sẽ hiển thị "0":

```js
setNumber(0 + 5);
alert(0);
```

Nhưng nếu bạn đặt timer cho alert để nó chỉ được kích hoạt _sau khi_ component đã re-render thì sao? Nó sẽ hiển thị "0" hay "5"? Hãy thử đoán!

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Bất ngờ phải không? Nếu sử dụng phương pháp thay thế, bạn có thể thấy “ảnh chụp nhanh” của state được truyền cho alert.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

State được lưu trong React có thể đã thay đổi vào thời điểm alert chạy, nhưng alert đã được lên lịch bằng một ảnh chụp nhanh của state tại thời điểm người dùng tương tác với nó!

**Giá trị của một biến state không bao giờ thay đổi trong một lần render,** ngay cả khi code trong event handler của nó là bất đồng bộ. Bên trong `onClick` của *lần render đó*, giá trị của `number` vẫn tiếp tục là `0` ngay cả sau khi `setNumber(number + 5)` được gọi. Giá trị của nó đã được “cố định” khi React “chụp ảnh nhanh” UI bằng cách gọi component của bạn.

Sau đây là một ví dụ cho thấy điều này giúp event handler của bạn ít dễ gặp lỗi về timing hơn như thế nào. Bên dưới là một form gửi message với độ trễ năm giây. Hãy hình dung tình huống sau:

1. Bạn nhấn nút "Send", gửi "Hello" cho Alice.
2. Trước khi kết thúc khoảng trễ năm giây, bạn thay đổi giá trị của trường "To" thành "Bob".

Bạn mong đợi `alert` hiển thị điều gì? Nó sẽ hiển thị "You said Hello to Alice"? Hay sẽ hiển thị "You said Hello to Bob"? Hãy dự đoán dựa trên những gì bạn đã biết, rồi thử xem:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React giữ các giá trị state “cố định” trong event handler của một lần render.** Bạn không cần lo lắng về việc state có thay đổi trong khi code đang chạy hay không.

Nhưng nếu bạn muốn đọc state mới nhất trước một lần re-render thì sao? Bạn sẽ muốn sử dụng một [state updater function](/learn/queueing-a-series-of-state-updates), nội dung này sẽ được trình bày ở trang tiếp theo!

<Recap>

* Việc thiết lập state yêu cầu một lần render mới.
* React lưu state ở bên ngoài component của bạn, như thể state nằm trên một chiếc kệ.
* Khi bạn gọi `useState`, React cung cấp cho bạn một ảnh chụp nhanh của state *cho lần render đó*.
* Các biến và event handler không “sống sót” qua các lần re-render. Mỗi lần render có các event handler riêng.
* Mỗi lần render (và các function bên trong nó) luôn “nhìn thấy” ảnh chụp nhanh của state mà React cung cấp cho *lần render đó*.
* Bạn có thể hình dung việc thay thế state trong các event handler, tương tự như cách bạn hình dung JSX đã được render.
* Các event handler được tạo trong quá khứ có các giá trị state của lần render mà chúng được tạo ra.

</Recap>



<Challenges>

#### Triển khai đèn giao thông {/*implement-a-traffic-light*/}

Sau đây là một component đèn dành cho vạch qua đường, chuyển đổi trạng thái khi nhấn nút:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Thêm một `alert` vào click handler. Khi đèn màu xanh và hiển thị "Walk", việc nhấp vào nút sẽ hiển thị "Stop is next". Khi đèn màu đỏ và hiển thị "Stop", việc nhấp vào nút sẽ hiển thị "Walk is next".

Việc đặt `alert` trước hay sau lệnh gọi `setWalk` có tạo ra khác biệt không?

<Solution>

`alert` của bạn sẽ trông như sau:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Việc đặt nó trước hay sau lệnh gọi `setWalk` không tạo ra khác biệt. Giá trị `walk` của lần render đó là cố định. Việc gọi `setWalk` chỉ thay đổi giá trị này cho lần render *tiếp theo*, chứ không ảnh hưởng đến event handler của lần render trước.

Dòng này thoạt đầu có thể có vẻ ngược với trực giác:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

Nhưng điều này sẽ hợp lý nếu bạn đọc nó như sau: "Nếu đèn giao thông hiển thị 'Walk now', thông báo sẽ là 'Stop is next'." Biến `walk` bên trong event handler khớp với giá trị `walk` của lần render đó và không thay đổi.

Bạn có thể xác minh điều này là đúng bằng cách áp dụng phương pháp thế. Khi `walk` là `true`, bạn nhận được:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

Vì vậy, việc nhấp vào "Change to Stop" sẽ đưa vào hàng đợi một lần render với `walk` được đặt thành `false`, và hiển thị cảnh báo "Stop is next".

</Solution>

</Challenges>