---
title: useActionState
---

<Intro>

`useActionState` là một React Hook cho phép bạn cập nhật state với các side effect bằng cách sử dụng [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).

```js
const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useActionState(reducerAction, initialState, permalink?)` {/*useactionstate*/}

Gọi `useActionState` ở cấp cao nhất của component để tạo state cho kết quả của một Action.

```js
import { useActionState } from 'react';

function reducerAction(previousState, actionPayload) {
  // ...
}

function MyCart({initialState}) {
  const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState);
  // ...
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reducerAction`: Hàm sẽ được gọi khi Action được kích hoạt. Khi được gọi, hàm nhận state trước đó (ban đầu là `initialState` mà bạn đã cung cấp, sau đó là giá trị trả về trước đó) làm đối số đầu tiên, tiếp theo là `actionPayload` được truyền vào `dispatchAction`.
* `initialState`: Giá trị bạn muốn state có ban đầu. React sẽ bỏ qua đối số này sau khi `dispatchAction` được gọi lần đầu.
* **tùy chọn** `permalink`: Một chuỗi chứa URL duy nhất của trang mà form này sửa đổi.
  * Dùng cho các trang có [React Server Components](/reference/rsc/server-components) với progressive enhancement.
  * Nếu `reducerAction` là một [Server Function](/reference/rsc/server-functions) và form được submit trước khi JavaScript bundle tải xong, trình duyệt sẽ điều hướng đến URL permalink được chỉ định thay vì URL của trang hiện tại.

#### Giá trị trả về {/*returns*/}

`useActionState` trả về một mảng có chính xác ba giá trị:

1. State hiện tại. Trong lần render đầu tiên, state này sẽ khớp với `initialState` mà bạn đã truyền vào. Sau khi `dispatchAction` được gọi, state này sẽ khớp với giá trị mà `reducerAction` trả về.
2. Một hàm `dispatchAction` mà bạn gọi bên trong [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).
3. Cờ `isPending` cho biết liệu có Action nào được dispatch cho Hook này đang ở trạng thái pending hay không.

#### Lưu ý {/*caveats*/}

* `useActionState` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc trong các Hook của riêng bạn. Bạn không thể gọi nó bên trong vòng lặp hoặc điều kiện. Nếu cần làm vậy, hãy tách thành một component mới và chuyển state vào đó.
* React xếp hàng và thực thi tuần tự nhiều lần gọi `dispatchAction`. Mỗi lần gọi `reducerAction` sẽ nhận kết quả của lần gọi trước đó.
* Hàm `dispatchAction` có identity ổn định, vì vậy bạn thường thấy nó được bỏ qua trong các dependency của Effect, nhưng việc đưa nó vào sẽ không khiến Effect chạy. Nếu linter cho phép bạn bỏ qua một dependency mà không báo lỗi thì bạn có thể an toàn làm vậy. [Tìm hiểu thêm về cách loại bỏ các dependency của Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* Khi sử dụng tùy chọn `permalink`, hãy đảm bảo cùng một form component được render trên trang đích (bao gồm cùng `reducerAction` và `permalink`) để React biết cách truyền state qua. Khi trang trở nên interactive, tham số này không còn tác dụng.
* Khi sử dụng Server Functions, `initialState` cần phải [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values) (các giá trị như object thuần, array, string và number).
* Nếu `dispatchAction` throw error, React sẽ hủy tất cả các action đang xếp hàng và hiển thị [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) gần nhất.
* Nếu có nhiều Action đang diễn ra, React sẽ batch chúng lại với nhau. Đây là một hạn chế có thể được loại bỏ trong bản phát hành tương lai.

<Note>

`dispatchAction` phải được gọi từ một Action.

Bạn có thể bọc nó trong [`startTransition`](/reference/react/startTransition), hoặc truyền nó vào một [Action prop](/reference/react/useTransition#exposing-action-props-from-components). Các lần gọi nằm ngoài phạm vi đó sẽ không được xem là một phần của Transition và [ghi log một lỗi](#async-function-outside-transition) trong development mode.

</Note>

---

### Hàm `reducerAction` {/*reduceraction*/}

Hàm `reducerAction` được truyền vào `useActionState` sẽ nhận state trước đó và trả về state mới.

Không giống như các reducer trong `useReducer`, `reducerAction` có thể là async và thực hiện side effect:

```js
async function reducerAction(previousState, actionPayload) {
  const newState = await post(actionPayload);
  return newState;
}
```

Mỗi lần bạn gọi `dispatchAction`, React sẽ gọi `reducerAction` với `actionPayload`. Reducer sẽ thực hiện các side effect như gửi dữ liệu và trả về state mới. Nếu `dispatchAction` được gọi nhiều lần, React sẽ xếp hàng và thực thi chúng theo thứ tự, để kết quả của lần gọi trước đó được truyền làm `previousState` cho lần gọi hiện tại.

#### Tham số {/*reduceraction-parameters*/}

* `previousState`: State cuối cùng. Ban đầu, giá trị này bằng `initialState`. Sau lần gọi đầu tiên đến `dispatchAction`, giá trị này bằng state cuối cùng được trả về.

* **tùy chọn** `actionPayload`: Đối số được truyền vào `dispatchAction`. Đối số này có thể là giá trị thuộc bất kỳ kiểu nào. Tương tự các quy ước của `useReducer`, thông thường đây là một object có thuộc tính `type` để định danh object đó và, tùy chọn, các thuộc tính khác chứa thông tin bổ sung.

#### Giá trị trả về {/*reduceraction-returns*/}

`reducerAction` trả về state mới và kích hoạt một Transition để render lại với state đó.

#### Lưu ý {/*reduceraction-caveats*/}

* `reducerAction` có thể là sync hoặc async. Nó có thể thực hiện các action sync như hiển thị notification hoặc các action async như gửi bản cập nhật đến server.
* `reducerAction` không được gọi hai lần trong `<StrictMode>` vì `reducerAction` được thiết kế để cho phép các side effect.
* Kiểu trả về của `reducerAction` phải khớp với kiểu của `initialState`. Nếu TypeScript suy luận ra sự không khớp, bạn có thể cần chỉ rõ kiểu state.
* Nếu bạn set state sau `await` trong `reducerAction`, hiện tại bạn cần bọc state update trong một `startTransition` bổ sung. Xem tài liệu [startTransition](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) để biết thêm thông tin.
* Khi sử dụng Server Functions, `actionPayload` cần phải [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values) (các giá trị như object thuần, array, string và number).

<DeepDive>

#### Tại sao được gọi là `reducerAction`? {/*why-is-it-called-reduceraction*/}

Hàm được truyền vào `useActionState` được gọi là *reducer action* vì:

- Nó *reduce* state trước đó thành state mới, giống như `useReducer`.
- Đây là một *Action* vì nó được gọi bên trong một Transition và có thể thực hiện các side effect.

Về mặt khái niệm, `useActionState` giống `useReducer`, nhưng bạn có thể thực hiện side effect trong reducer.

</DeepDive>

---

## Cách sử dụng {/*usage*/}

### Thêm state vào một Action {/*adding-state-to-an-action*/}

Gọi `useActionState` ở cấp cao nhất của component để tạo state cho kết quả của một Action.

```js [[1, 7, "count"], [2, 7, "dispatchAction"], [3, 7, "isPending"]]
import { useActionState } from 'react';

async function addToCartAction(prevCount) {
  // ...
}
function Counter() {
  const [count, dispatchAction, isPending] = useActionState(addToCartAction, 0);

  // ...
}
```

`useActionState` trả về một mảng có chính xác ba phần tử:

1. <CodeStep step={1}>State hiện tại</CodeStep>, ban đầu được đặt thành state ban đầu mà bạn đã cung cấp.
2. <CodeStep step={2}>Action dispatcher</CodeStep> cho phép bạn kích hoạt `reducerAction`.
3. <CodeStep step={3}>Pending state</CodeStep> cho biết Action có đang diễn ra hay không.

Để gọi `addToCartAction`, hãy gọi <CodeStep step={2}>action dispatcher</CodeStep>. React sẽ xếp hàng các lần gọi đến `addToCartAction` cùng với count trước đó.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(async (prevCount) => {
    return await addToCart(prevCount)
  }, 0);

  function handleClick() {
    startTransition(() => {
      dispatchAction();
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>Qty: {count}</span>
      </div>
      <div className="row">
        <button onClick={handleClick}>Add Ticket{isPending ? ' 🌀' : '  '}</button>
      </div>
      <hr />
      <Total quantity={count} />
    </div>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row button {
  margin-left: auto;
  min-width: 150px;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}
```

</Sandpack>

Mỗi lần bạn nhấp vào "Add Ticket", React sẽ xếp hàng một lần gọi đến `addToCartAction`. React hiển thị pending state cho đến khi tất cả ticket được thêm, sau đó render lại với state cuối cùng.

<DeepDive>

#### Cách hoạt động của việc xếp hàng `useActionState` {/*how-useactionstate-queuing-works*/}

Hãy thử nhấp vào "Add Ticket" nhiều lần. Mỗi lần bạn nhấp, một `addToCartAction` mới sẽ được xếp hàng. Vì có độ trễ nhân tạo 1 giây, 4 lần nhấp sẽ mất khoảng 4 giây để hoàn tất.

**Đây là chủ ý trong thiết kế của `useActionState`.**

Chúng ta phải chờ kết quả trước đó của `addToCartAction` để truyền `prevCount` vào lần gọi tiếp theo đến `addToCartAction`. Điều đó có nghĩa là React phải chờ Action trước đó hoàn tất rồi mới gọi Action tiếp theo.

Thông thường, bạn có thể giải quyết vấn đề này bằng cách [using with useOptimistic](/reference/react/useActionState#using-with-useoptimistic), nhưng với các trường hợp phức tạp hơn, bạn có thể cân nhắc [hủy các action đang xếp hàng](#cancelling-queued-actions) hoặc không sử dụng `useActionState`.

</DeepDive>

---

### Sử dụng nhiều loại Action {/*using-multiple-action-types*/}

Để xử lý nhiều loại, bạn có thể truyền một đối số vào `dispatchAction`.

Theo quy ước, cách viết phổ biến là sử dụng câu lệnh switch. Với mỗi case trong switch, hãy tính toán và trả về một state tiếp theo. Đối số có thể có bất kỳ hình dạng nào, nhưng thông thường người ta truyền các object có thuộc tính `type` để xác định action.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function handleAdd() {
    startTransition(() => {
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="qty">{isPending ? '🌀' : count}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Khi bạn nhấp để tăng hoặc giảm số lượng, một `"ADD"` hoặc `"REMOVE"` sẽ được dispatch. Trong `reducerAction`, các API khác nhau được gọi để cập nhật số lượng.

Trong ví dụ này, chúng ta sử dụng pending state của Actions để thay thế cả số lượng và tổng. Nếu muốn cung cấp phản hồi tức thì, chẳng hạn như cập nhật số lượng ngay lập tức, bạn có thể sử dụng `useOptimistic`.

<DeepDive>

#### `useActionState` khác `useReducer` như thế nào? {/*useactionstate-vs-usereducer*/}

Bạn có thể nhận thấy ví dụ này trông rất giống `useReducer`, nhưng chúng phục vụ các mục đích khác nhau:

- **Sử dụng `useReducer`** để quản lý state của UI. Reducer phải là pure.

- **Sử dụng `useActionState`** để quản lý state của Actions. Reducer có thể thực hiện side effect.

Bạn có thể xem `useActionState` như `useReducer` dành cho các side effect từ Actions của người dùng. Vì nó tính toán Action tiếp theo cần thực hiện dựa trên Action trước đó, nên nó phải [sắp xếp các lệnh gọi theo thứ tự](/reference/react/useActionState#how-useactionstate-queuing-works). Nếu muốn thực hiện Actions song song, hãy sử dụng trực tiếp `useState` và `useTransition`.

</DeepDive>

---

### Sử dụng với `useOptimistic` {/*using-with-useoptimistic*/}

Bạn có thể kết hợp `useActionState` với [`useOptimistic`](/reference/react/useOptimistic) để hiển thị phản hồi UI tức thì:


<Sandpack>

```js src/App.js
import { useActionState, startTransition, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  function handleAdd() {
    startTransition(() => {
      setOptimisticCount(c => c + 1);
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      setOptimisticCount(c => c - 1);
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={optimisticCount} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>


`setOptimisticCount` cập nhật số lượng ngay lập tức, còn `dispatchAction()` đưa `updateCartAction` vào hàng đợi. Một chỉ báo pending xuất hiện trên cả số lượng và tổng, để cho người dùng biết rằng bản cập nhật của họ vẫn đang được áp dụng.

---


### Sử dụng với các prop Action {/*using-with-action-props*/}

Khi bạn truyền hàm `dispatchAction` cho một component cung cấp prop [Action](/reference/react/useTransition#exposing-action-props-from-components), bạn không cần tự gọi `startTransition` hoặc `useOptimistic`.

Ví dụ này minh họa cách sử dụng các prop `increaseAction` và `decreaseAction` của một component QuantityStepper:

<Sandpack>

```js src/App.js
import { useActionState } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function addAction() {
    dispatchAction({type: 'ADD'});
  }

  function removeAction() {
    dispatchAction({type: 'REMOVE'});
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
    <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Vì `<QuantityStepper>` có sẵn hỗ trợ cho transitions, pending state và việc cập nhật count một cách lạc quan, bạn chỉ cần cho Action biết cần thay đổi _điều gì_, còn _cách_ thay đổi sẽ được xử lý thay cho bạn.

---

### Hủy các Actions đang xếp hàng {/*cancelling-queued-actions*/}

Bạn có thể sử dụng `AbortController` để hủy các Actions đang chờ:

<Sandpack>

```js src/App.js
import { useActionState, useRef } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const abortRef = useRef(null);
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  async function addAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'ADD', signal: abortRef.current.signal });
  }

  async function removeAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'REMOVE', signal: abortRef.current.signal });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      try {
        return await addToCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return prevCount + 1;
      }
    }
    case 'REMOVE': {
      try {
        return await removeFromCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return Math.max(0, prevCount - 1);
      }
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
          <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
class AbortError extends Error {
  name = 'AbortError';
  constructor(message = 'The operation was aborted') {
    super(message);
  }
}

function sleep(ms, signal) {
  if (!signal) return new Promise((resolve) => setTimeout(resolve, ms));
  if (signal.aborted) return Promise.reject(new AbortError());

  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(id);
      reject(new AbortError());
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
}
export async function addToCart(count, opts) {
  await sleep(1000, opts?.signal);
  return count + 1;
}

export async function removeFromCart(count, opts) {
  await sleep(1000, opts?.signal);
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Hãy thử nhấp nhiều lần vào nút tăng hoặc giảm và lưu ý rằng tổng sẽ cập nhật trong vòng 1 giây, bất kể bạn nhấp bao nhiêu lần. Điều này hoạt động vì nó sử dụng một `AbortController` để “hoàn tất” Action trước đó, nhờ đó Action tiếp theo có thể tiếp tục.

<Pitfall>

Việc abort một Action không phải lúc nào cũng an toàn.

Ví dụ, nếu Action thực hiện một mutation (chẳng hạn như ghi vào database), việc abort network request không hoàn tác thay đổi phía server. Đây là lý do `useActionState` không abort theo mặc định. Cách này chỉ an toàn khi bạn biết side effect có thể được bỏ qua hoặc retry một cách an toàn.

</Pitfall>

---

### Sử dụng với các prop Action của `<form>` {/*use-with-a-form*/}

Bạn có thể truyền hàm `dispatchAction` làm prop `action` cho một `<form>`.

Khi được sử dụng theo cách này, React tự động bọc việc submit trong một Transition, nên bạn không cần tự gọi `startTransition`. `reducerAction` nhận state trước đó và `FormData` đã submit:

<Sandpack>

```js src/App.js
import { useActionState, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  async function formAction(formData) {
    const type = formData.get('type');
    if (type === 'ADD') {
      setOptimisticCount(c => c + 1);
    } else {
      setOptimisticCount(c => Math.max(0, c - 1));
    }
    return dispatchAction(formData);
  }

  return (
    <form action={formAction} className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button type="submit" name="type" value="ADD">▲</button>
            <button type="submit" name="type" value="REMOVE">▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </form>
  );
}

async function updateCartAction(prevCount, formData) {
  const type = formData.get('type');
  switch (type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Trong ví dụ này, khi người dùng nhấp vào các mũi tên của stepper, button sẽ submit form và `useActionState` gọi `updateCartAction` với dữ liệu form. Ví dụ sử dụng `useOptimistic` để hiển thị ngay số lượng mới trong khi server xác nhận bản cập nhật.

<RSC>

Khi được sử dụng với một [Server Function](/reference/rsc/server-functions), `useActionState` cho phép hiển thị phản hồi của server trước khi quá trình hydration (khi React gắn vào HTML được server render) hoàn tất. Bạn cũng có thể sử dụng tham số tùy chọn `permalink` để progressive enhancement (cho phép form hoạt động trước khi JavaScript tải) trên các trang có nội dung động. Framework của bạn thường sẽ tự xử lý việc này.

</RSC>

Xem tài liệu [`<form>`](/reference/react-dom/components/form#handle-form-submission-with-a-server-function) để biết thêm thông tin về việc sử dụng Actions với forms.

---

### Xử lý lỗi {/*handling-errors*/}

Có hai cách để xử lý lỗi với `useActionState`.

Đối với các lỗi đã biết, chẳng hạn như lỗi validation “quantity not available” từ backend, bạn có thể trả về lỗi đó trong `reducerAction` state và hiển thị nó trong UI.

Đối với các lỗi chưa biết, chẳng hạn như `undefined is not a function`, bạn có thể throw một error. React sẽ hủy tất cả Actions đang xếp hàng và hiển thị [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) gần nhất bằng cách throw lại error từ hook `useActionState`.

<Sandpack>

```js src/App.js
import {useActionState, startTransition} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {addToCart} from './api';
import Total from './Total';

function Checkout() {
  const [state, dispatchAction, isPending] = useActionState(
    async (prevState, quantity) => {
      const result = await addToCart(prevState.count, quantity);
      if (result.error) {
        // Return the error from the API as state
        return {...prevState, error: `Could not add quanitiy ${quantity}: ${result.error}`};
      }

      if (!isPending) {
        // Clear the error state for the first dispatch.
        return {count: result.count, error: null};
      }

      // Return the new count, and any errors that happened.
      return {count: result.count, error: prevState.error};


    },
    {
      count: 0,
      error: null,
    }
  );

  function handleAdd(quantity) {
    startTransition(() => {
      dispatchAction(quantity);
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>
          {isPending && '🌀 '}Qty: {state.count}
        </span>
      </div>
      <div className="buttons">
        <button onClick={() => handleAdd(1)}>Add 1</button>
        <button onClick={() => handleAdd(10)}>Add 10</button>
        <button onClick={() => handleAdd(NaN)}>Add NaN</button>
      </div>
      {state.error && <div className="error">{state.error}</div>}
      <hr />
      <Total quantity={state.count} isPending={isPending} />
    </div>
  );
}



export default function App() {
  return (
    <ErrorBoundary
      fallbackRender={({resetErrorBoundary}) => (
        <div className="checkout">
          <h2>Something went wrong</h2>
          <p>The action could not be completed.</p>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}>
      <Checkout />
    </ErrorBoundary>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>
        {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
      </span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count, quantity) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (quantity > 5) {
    return {error: 'Quantity not available'};
  } else if (isNaN(quantity)) {
    throw new Error('Quantity must be a number');
  }
  return {count: count + quantity};
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.buttons {
  display: flex;
  gap: 8px;
}

.error {
  color: red;
  font-size: 14px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

Trong ví dụ này, “Add 10” mô phỏng một API trả về lỗi validation, lỗi này được `updateCartAction` lưu vào state và hiển thị inline. “Add NaN” tạo ra một count không hợp lệ, vì vậy `updateCartAction` throw, lỗi này truyền qua `useActionState` đến `ErrorBoundary` và hiển thị UI reset.


---

## Khắc phục sự cố {/*troubleshooting*/}

### Flag `isPending` của tôi không cập nhật {/*ispending-not-updating*/}

Nếu bạn gọi `dispatchAction` thủ công (không thông qua prop Action), hãy đảm bảo bọc lệnh gọi trong [`startTransition`](/reference/react/startTransition):

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  function handleClick() {
    // ✅ Correct: wrap in startTransition
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

Khi `dispatchAction` được truyền vào prop Action, React sẽ tự động bọc nó trong một Transition.

---

### Action của tôi không thể đọc dữ liệu form {/*action-cannot-read-form-data*/}

Khi sử dụng `useActionState`, `reducerAction` nhận thêm một đối số ở vị trí đầu tiên: state trước đó hoặc state ban đầu. Vì vậy, dữ liệu form đã submit là đối số thứ hai thay vì đối số thứ nhất.

```js {2,7}
// Without useActionState
function action(formData) {
  const name = formData.get('name');
}

// With useActionState
function action(prevState, formData) {
  const name = formData.get('name');
}
```

---

### Các action của tôi đang bị bỏ qua {/*actions-skipped*/}

Nếu bạn gọi `dispatchAction` nhiều lần và một số lần gọi không chạy, có thể là do một lệnh gọi `dispatchAction` trước đó đã throw một error.

Khi `reducerAction` throw, React sẽ bỏ qua tất cả các lệnh gọi `dispatchAction` được xếp hàng sau đó.

Để xử lý vấn đề này, hãy catch các error bên trong `reducerAction` và trả về một error state thay vì throw:

```js
async function myReducerAction(prevState, data) {
  try {
    const result = await submitData(data);
    return { success: true, data: result };
  } catch (error) {
    // ✅ Return error state instead of throwing
    return { success: false, error: error.message };
  }
}
```

---

### State của tôi không reset {/*reset-state*/}

`useActionState` không cung cấp hàm reset tích hợp sẵn. Để reset state, bạn có thể thiết kế `reducerAction` để xử lý một tín hiệu reset:

```js
const initialState = { name: '', error: null };

async function formAction(prevState, payload) {
  // Handle reset
  if (payload === null) {
    return initialState;
  }
  // Normal action logic
  const result = await submitData(payload);
  return result;
}

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(formAction, initialState);

  function handleReset() {
    startTransition(() => {
      dispatchAction(null); // Pass null to trigger reset
    });
  }

  // ...
}
```

Ngoài ra, bạn có thể thêm một prop `key` vào component sử dụng `useActionState` để buộc component remount với state mới, hoặc một prop `<form>` `action`, prop này sẽ tự động reset sau khi submit.

---

### Tôi gặp lỗi: “An async function with useActionState was called outside of a transition.” {/*async-function-outside-transition*/}

Một lỗi thường gặp là quên gọi `dispatchAction` bên trong một Transition:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.

</ConsoleLogLine>
</ConsoleBlockMulti>


Lỗi này xảy ra vì `dispatchAction` phải chạy bên trong một Transition:

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ❌ Wrong: calling dispatchAction outside a Transition
    dispatchAction();
  }

  // ...
}
```

Để khắc phục, hãy bọc lệnh gọi trong [`startTransition`](/reference/react/startTransition):

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ✅ Correct: wrap in startTransition
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

Hoặc truyền `dispatchAction` vào một prop Action; prop này gọi nó trong một Transition:

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  // ✅ Correct: action prop wraps in a Transition for you
  return <Button action={dispatchAction}>...</Button>;
}
```

---

### Tôi gặp lỗi: “Cannot update action state while rendering” {/*cannot-update-during-render*/}

Bạn không thể gọi `dispatchAction` trong lúc render:

<ConsoleBlock level="error">

Không thể cập nhật trạng thái action trong khi đang render.

</ConsoleBlock>

Điều này gây ra một vòng lặp vô hạn vì việc gọi `dispatchAction` sẽ lên lịch cập nhật state, từ đó kích hoạt render lại và lại gọi `dispatchAction`.

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  // ❌ Wrong: calling dispatchAction during render
  dispatchAction();

  // ...
}
```

Để khắc phục, chỉ gọi `dispatchAction` để phản hồi các sự kiện của người dùng (chẳng hạn như gửi biểu mẫu hoặc nhấp vào nút).