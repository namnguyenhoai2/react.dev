---
title: Xếp hàng một chuỗi cập nhật state
---

<Intro>

Việc thiết lập một state variable sẽ xếp hàng một lần render khác. Nhưng đôi khi bạn có thể muốn thực hiện nhiều thao tác trên giá trị đó trước khi xếp hàng lần render tiếp theo. Để làm được điều này, bạn cần hiểu cách React batching các state update.

</Intro>

<YouWillLearn>

* “Batching” là gì và React sử dụng nó như thế nào để xử lý nhiều state update
* Cách áp dụng nhiều update liên tiếp cho cùng một state variable

</YouWillLearn>

## React batching các state update {/*react-batches-state-updates*/}

Bạn có thể nghĩ rằng khi nhấp vào nút “+3”, counter sẽ tăng ba lần vì nó gọi `setNumber(number + 1)` ba lần:

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

Tuy nhiên, như bạn có thể nhớ từ phần trước, [các giá trị state của mỗi lần render là cố định](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), nên giá trị của `number` bên trong event handler của lần render đầu tiên luôn là `0`, bất kể bạn gọi `setNumber(1)` bao nhiêu lần:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Nhưng còn một yếu tố khác đang tác động ở đây. **React chờ cho đến khi *toàn bộ* code trong các event handler chạy xong trước khi xử lý state update của bạn.** Đây là lý do việc re-render chỉ xảy ra *sau khi* tất cả các lệnh gọi `setNumber()` này hoàn tất.

Điều này có thể khiến bạn liên tưởng đến một người phục vụ đang nhận order tại nhà hàng. Người phục vụ không chạy vào bếp ngay khi nghe bạn gọi món đầu tiên! Thay vào đó, họ để bạn gọi xong order, cho phép bạn thay đổi order, thậm chí còn nhận order từ những người khác trong bàn.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="An elegant cursor at a restaurant places and order multiple times with React, playing the part of the waiter. After she calls setState() multiple times, the waiter writes down the last one she requested as her final order." />

Điều này cho phép bạn cập nhật nhiều state variable--kể cả từ nhiều component--mà không gây ra quá nhiều [lần re-render.](/learn/render-and-commit#re-renders-when-state-updates) Nhưng điều đó cũng có nghĩa là UI sẽ không được cập nhật cho đến khi _event handler của bạn và mọi code bên trong nó_ hoàn tất. Cách hoạt động này, còn được gọi là **batching,** giúp ứng dụng React của bạn chạy nhanh hơn nhiều. Nó cũng tránh phải xử lý những lần render “chưa hoàn tất” khó hiểu, trong đó chỉ một số variable được cập nhật.

**React không batching giữa *nhiều* event có chủ đích như các lần nhấp**--mỗi lần nhấp được xử lý riêng. Bạn có thể yên tâm rằng React chỉ batching khi việc đó nhìn chung là an toàn. Điều này đảm bảo rằng, ví dụ, nếu lần nhấp đầu tiên vào button vô hiệu hóa một form, thì lần nhấp thứ hai sẽ không gửi form đó thêm lần nữa.

## Cập nhật cùng một state nhiều lần trước lần render tiếp theo {/*updating-the-same-state-multiple-times-before-the-next-render*/}

Đây là một trường hợp sử dụng không phổ biến, nhưng nếu bạn muốn cập nhật cùng một state variable nhiều lần trước lần render tiếp theo, thay vì truyền *giá trị state tiếp theo* như `setNumber(number + 1)`, bạn có thể truyền một *function* tính toán state tiếp theo dựa trên state trước đó trong queue, như `setNumber(n => n + 1)`. Đây là cách để yêu cầu React “thực hiện một việc gì đó với giá trị state” thay vì chỉ thay thế nó.

Bây giờ hãy thử tăng counter:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
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

Ở đây, `n => n + 1` được gọi là **updater function.** Khi bạn truyền nó cho state setter:

1. React xếp function này vào queue để xử lý sau khi toàn bộ code khác trong event handler đã chạy xong.
2. Trong lần render tiếp theo, React duyệt qua queue và cung cấp cho bạn state cuối cùng sau khi được cập nhật.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Dưới đây là cách React xử lý từng dòng code này trong khi thực thi event handler:

1. `setNumber(n => n + 1)`: `n => n + 1` là một function. React thêm nó vào queue.
1. `setNumber(n => n + 1)`: `n => n + 1` là một function. React thêm nó vào queue.
1. `setNumber(n => n + 1)`: `n => n + 1` là một function. React thêm nó vào queue.

Khi bạn gọi `useState` trong lần render tiếp theo, React sẽ duyệt qua queue. State `number` trước đó là `0`, vì vậy React truyền giá trị đó cho updater function đầu tiên dưới dạng đối số `n`. Sau đó, React lấy giá trị trả về từ updater function trước đó và truyền nó cho updater tiếp theo dưới dạng `n`, cứ như vậy:

|  update được xếp hàng | `n` | trả về |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React lưu `3` làm kết quả cuối cùng và trả về nó từ `useState`.

Đó là lý do việc nhấp vào “+3” trong ví dụ trên tăng giá trị chính xác thêm 3.

### Điều gì xảy ra nếu bạn cập nhật state sau khi thay thế nó {/*what-happens-if-you-update-state-after-replacing-it*/}

Còn event handler này thì sao? Bạn nghĩ `number` sẽ có giá trị bao nhiêu trong lần render tiếp theo?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

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
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Dưới đây là yêu cầu mà event handler này gửi cho React:

1. `setNumber(number + 5)`: `number` là `0`, vì vậy `setNumber(0 + 5)`. React thêm *“thay thế bằng `5`”* vào queue.
2. `setNumber(n => n + 1)`: `n => n + 1` là một updater function. React thêm *function đó* vào queue.

Trong lần render tiếp theo, React duyệt qua state queue:

|   update được xếp hàng       | `n` | trả về |
|--------------|---------|-----|
| “thay thế bằng `5`” | `0` (không được sử dụng) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React lưu `6` làm kết quả cuối cùng và trả về nó từ `useState`.

<Note>

Có thể bạn đã nhận thấy rằng `setState(5)` thực sự hoạt động giống như `setState(n => 5)`, nhưng `n` lại không được sử dụng!

</Note>

### Điều gì xảy ra nếu bạn thay thế state sau khi cập nhật nó {/*what-happens-if-you-replace-state-after-updating-it*/}

Hãy thử thêm một ví dụ nữa. Bạn nghĩ `number` sẽ có giá trị bao nhiêu trong lần render tiếp theo?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

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
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Dưới đây là cách React xử lý từng dòng code này trong khi thực thi event handler:

1. `setNumber(number + 5)`: `number` là `0`, vì vậy `setNumber(0 + 5)`. React thêm *“thay thế bằng `5`”* vào queue.
2. `setNumber(n => n + 1)`: `n => n + 1` là một updater function. React thêm *function đó* vào queue.
3. `setNumber(42)`: React thêm *“thay thế bằng `42`”* vào queue.

Trong lần render tiếp theo, React duyệt qua state queue:

|   update được xếp hàng       | `n` | trả về |
|--------------|---------|-----|
| “thay thế bằng `5`” | `0` (không được sử dụng) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| “thay thế bằng `42`” | `6` (không được sử dụng) | `42` |

Sau đó, React lưu `42` làm kết quả cuối cùng và trả về nó từ `useState`.

Tóm lại, bạn có thể hình dung những gì mình truyền cho state setter `setNumber` như sau:

* **Một updater function** (ví dụ: `n => n + 1`) được thêm vào queue.
* **Bất kỳ giá trị nào khác** (ví dụ: number `5`) sẽ thêm “thay thế bằng `5`” vào queue, bỏ qua những gì đã được xếp hàng trước đó.

Sau khi event handler hoàn tất, React sẽ trigger một lần re-render. Trong lần re-render đó, React sẽ xử lý queue. Updater function chạy trong quá trình render, vì vậy **updater function phải [thuần túy](/learn/keeping-components-pure)** và chỉ *trả về* kết quả. Đừng cố gắng thiết lập state từ bên trong chúng hoặc chạy các side effect khác. Trong Strict Mode, React sẽ chạy mỗi updater function hai lần (nhưng loại bỏ kết quả lần thứ hai) để giúp bạn phát hiện lỗi.

### Quy ước đặt tên {/*naming-conventions*/}

Một quy ước phổ biến là đặt tên đối số của updater function bằng các chữ cái đầu của state variable tương ứng:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Nếu thích code dài và rõ ràng hơn, một quy ước phổ biến khác là lặp lại toàn bộ tên state variable, chẳng hạn như `setEnabled(enabled => !enabled)`, hoặc sử dụng một prefix như `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Việc thiết lập state không thay đổi variable trong lần render hiện tại, mà yêu cầu một lần render mới.
* React xử lý state update sau khi các event handler chạy xong. Việc này được gọi là batching.
* Để cập nhật một state nhiều lần trong cùng một event, bạn có thể sử dụng `setNumber(n => n + 1)` updater function.

</Recap>



<Challenges>

#### Sửa counter request {/*fix-a-request-counter*/}

Bạn đang làm việc trên một ứng dụng art marketplace cho phép người dùng gửi nhiều order cho một art item cùng lúc. Mỗi lần người dùng nhấn button “Buy”, counter “Pending” sẽ tăng thêm một. Sau ba giây, counter “Pending” sẽ giảm xuống và counter “Completed” sẽ tăng lên.

Tuy nhiên, counter “Pending” không hoạt động như mong muốn. Khi nhấn “Buy”, nó giảm xuống `-1` (điều này đáng lẽ không thể xảy ra!). Và nếu bạn nhấp nhanh hai lần, cả hai counter dường như hoạt động không ổn định.

Tại sao lại xảy ra điều này? Hãy sửa cả hai counter.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

Bên trong trình xử lý sự kiện `handleClick`, các giá trị của `pending` và `completed` tương ứng với giá trị của chúng tại thời điểm xảy ra sự kiện nhấp. Ở lần render đầu tiên, `pending` là `0`, vì vậy `setPending(pending - 1)` trở thành `setPending(-1)`, điều này là sai. Vì bạn muốn *tăng* hoặc *giảm* các bộ đếm, thay vì đặt chúng thành một giá trị cụ thể được xác định trong lúc nhấp, bạn có thể truyền các hàm updater:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Điều này đảm bảo rằng khi bạn tăng hoặc giảm một bộ đếm, bạn thực hiện việc đó dựa trên state *mới nhất* của nó, thay vì state tại thời điểm nhấp.

</Solution>

#### Tự triển khai state queue {/*implement-the-state-queue-yourself*/}

Trong thử thách này, bạn sẽ tự triển khai lại một phần nhỏ của React từ đầu! Không khó như bạn nghĩ đâu.

Cuộn qua phần xem trước của sandbox. Lưu ý rằng phần này hiển thị **bốn trường hợp kiểm thử.** Chúng tương ứng với các ví dụ bạn đã thấy ở phần trước trên trang này. Nhiệm vụ của bạn là triển khai hàm `getFinalState` để hàm trả về kết quả chính xác cho từng trường hợp đó. Nếu triển khai đúng, cả bốn bài kiểm thử sẽ vượt qua.

Bạn sẽ nhận được hai đối số: `baseState` là state ban đầu (giống như `0`), còn `queue` là một mảng chứa kết hợp giữa các số (như `5`) và các hàm updater (như `n => n + 1`) theo đúng thứ tự chúng được thêm vào.

Nhiệm vụ của bạn là trả về state cuối cùng, giống như các bảng trên trang này thể hiện!

<Hint>

Nếu bạn cảm thấy bế tắc, hãy bắt đầu với cấu trúc mã sau:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

Hãy điền các dòng còn thiếu!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Đây chính là thuật toán được mô tả trên trang này, cũng là thuật toán React sử dụng để tính state cuối cùng:

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

Bây giờ bạn đã biết phần này của React hoạt động như thế nào!

</Solution>

</Challenges>