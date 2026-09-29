---
title: useTransition
---

<Intro>

`useTransition` là một React Hook cho phép bạn render một phần UI ở background.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useTransition()` {/*usetransition*/}

Gọi `useTransition` ở cấp cao nhất của component để đánh dấu một số state update là Transitions.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

`useTransition` không nhận tham số nào.

#### Giá trị trả về {/*returns*/}

`useTransition` trả về một array có chính xác hai phần tử:

1. Cờ `isPending` cho biết có Transition nào đang chờ xử lý hay không.
2. Hàm [`startTransition` function](#starttransition) cho phép bạn đánh dấu các update là Transition.

---

### `startTransition(action)` {/*starttransition*/}

Hàm `startTransition` được `useTransition` trả về cho phép bạn đánh dấu một update là Transition.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

<Note>
#### Các function được gọi trong `startTransition` được gọi là “Actions”. {/*functions-called-in-starttransition-are-called-actions*/}

Function được truyền vào `startTransition` được gọi là một “Action”. Theo quy ước, mọi callback được gọi bên trong `startTransition` (chẳng hạn như một callback prop) nên có tên là `action` hoặc bao gồm hậu tố “Action”:

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}

```

</Note>

#### Tham số {/*starttransition-parameters*/}

* `action`: Một function cập nhật một số state bằng cách gọi một hoặc nhiều function [`set` functions](/reference/react/useState#setstate). React gọi `action` ngay lập tức mà không truyền tham số nào, đồng thời đánh dấu mọi state update được lên lịch một cách đồng bộ trong lúc gọi function `action` là Transitions. Mọi lời gọi async được await trong `action` sẽ được đưa vào Transition, nhưng hiện tại yêu cầu bọc mọi function `set` sau `await` trong một `startTransition` bổ sung (xem [Khắc phục sự cố](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Các state update được đánh dấu là Transitions sẽ [không chặn](#perform-non-blocking-updates-with-actions) và [sẽ không hiển thị các loading indicator không mong muốn](#preventing-unwanted-loading-indicators).

#### Giá trị trả về {/*starttransition-returns*/}

`startTransition` không trả về giá trị nào.

#### Lưu ý {/*starttransition-caveats*/}

* `useTransition` là một Hook, vì vậy chỉ có thể được gọi bên trong các component hoặc custom Hook. Nếu cần bắt đầu một Transition ở nơi khác (ví dụ: từ một data library), hãy gọi [`startTransition`](/reference/react/startTransition) độc lập thay thế.

* Bạn chỉ có thể bọc một update vào Transition nếu có quyền truy cập vào function `set` của state đó. Nếu muốn bắt đầu một Transition để phản hồi với một prop hoặc giá trị từ custom Hook, hãy thử [`useDeferredValue`](/reference/react/useDeferredValue) thay thế.

* Function bạn truyền vào `startTransition` được gọi ngay lập tức, đánh dấu mọi state update xảy ra trong khi function đó thực thi là Transitions. Nếu cố thực hiện state update trong một `setTimeout`, chẳng hạn như vậy, chúng sẽ không được đánh dấu là Transitions.

* Bạn phải bọc mọi state update sau các async request trong một `startTransition` khác để đánh dấu chúng là Transitions. Đây là một hạn chế đã biết và chúng tôi sẽ khắc phục trong tương lai (xem [Khắc phục sự cố](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Function `startTransition` có identity ổn định, vì vậy bạn thường thấy nó được bỏ qua khỏi các dependency của Effect, nhưng việc đưa nó vào sẽ không khiến Effect chạy lại. Nếu linter cho phép bạn bỏ qua một dependency mà không báo lỗi thì việc đó là an toàn. [Tìm hiểu thêm về cách loại bỏ các dependency của Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Một state update được đánh dấu là Transition sẽ bị gián đoạn bởi các state update khác. Ví dụ: nếu bạn update một chart component bên trong một Transition, nhưng sau đó bắt đầu nhập vào một input trong khi chart đang re-render, React sẽ khởi động lại công việc render trên chart component sau khi xử lý input update.

* Không thể dùng các Transition update để điều khiển text input.

* Nếu có nhiều Transition đang diễn ra, hiện tại React sẽ batch chúng lại với nhau. Đây là một hạn chế có thể được loại bỏ trong bản phát hành tương lai.

## Cách sử dụng {/*usage*/}

### Thực hiện các update không chặn bằng Actions {/*perform-non-blocking-updates-with-actions*/}

Gọi `useTransition` ở cấp cao nhất của component để tạo Actions và truy cập pending state:

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` trả về một array có chính xác hai phần tử:

1. Cờ <CodeStep step={1}>`isPending` flag</CodeStep> cho biết có Transition nào đang chờ xử lý hay không.
2. Hàm <CodeStep step={2}>`startTransition` function</CodeStep> cho phép bạn tạo một Action.

Để bắt đầu một Transition, hãy truyền một function vào `startTransition` như sau:

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

Function được truyền vào `startTransition` được gọi là “Action”. Bạn có thể update state và (tùy chọn) thực hiện side effect bên trong một Action; công việc sẽ được thực hiện ở background mà không chặn các tương tác của người dùng trên trang. Một Transition có thể bao gồm nhiều Action, và trong khi Transition đang diễn ra, UI của bạn vẫn phản hồi. Ví dụ: nếu người dùng nhấp vào một tab nhưng sau đó đổi ý và nhấp vào một tab khác, lần nhấp thứ hai sẽ được xử lý ngay lập tức mà không cần chờ update đầu tiên hoàn tất.

Để cung cấp phản hồi cho người dùng về các Transition đang diễn ra, state `isPending` chuyển sang `true` ở lần gọi đầu tiên đến `startTransition`, và duy trì ở trạng thái `true` cho đến khi tất cả các Action hoàn tất và state cuối cùng được hiển thị cho người dùng. Transitions đảm bảo các side effect trong Actions hoàn tất theo đúng thứ tự nhằm [ngăn các loading indicator không mong muốn](#preventing-unwanted-loading-indicators), đồng thời bạn có thể cung cấp phản hồi ngay lập tức trong khi Transition đang diễn ra bằng `useOptimistic`.

<Recipes titleText="The difference between Actions and regular event handling">

#### Update quantity trong một Action {/*updating-the-quantity-in-an-action*/}

Trong ví dụ này, function `updateQuantity` mô phỏng một request đến server để update quantity của item trong cart. Function này được *cố tình làm chậm* để request mất ít nhất một giây mới hoàn tất.

Hãy update quantity nhiều lần liên tiếp thật nhanh. Lưu ý rằng state “Total” đang chờ xử lý được hiển thị trong khi bất kỳ request nào còn đang diễn ra, và “Total” chỉ được update sau khi request cuối cùng hoàn tất. Vì update nằm trong một Action, “quantity” vẫn có thể tiếp tục được update trong khi request đang diễn ra.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
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
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

```js src/Item.js
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // To expose an action prop, await the callback in startTransition.
    startTransition(async () => {
      await action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

Đây là một ví dụ cơ bản để minh họa cách Actions hoạt động, nhưng ví dụ này không xử lý trường hợp các request hoàn tất không theo thứ tự. Khi update quantity nhiều lần, các request trước đó có thể hoàn tất sau các request đến sau, khiến quantity được update không theo thứ tự. Đây là một hạn chế đã biết và chúng tôi sẽ khắc phục trong tương lai (xem [Khắc phục sự cố](#my-state-updates-in-transitions-are-out-of-order) bên dưới).

Đối với các trường hợp sử dụng phổ biến, React cung cấp các abstraction tích hợp sẵn như:
- [`useActionState`](/reference/react/useActionState)
- [`<form>` actions](/reference/react-dom/components/form)
- [Server Functions](/reference/rsc/server-functions)

Các giải pháp này tự xử lý thứ tự request cho bạn. Khi dùng Transitions để xây dựng các custom hook hoặc library của riêng mình nhằm quản lý các async state transition, bạn có nhiều quyền kiểm soát hơn đối với thứ tự request, nhưng phải tự xử lý việc đó.

<Solution />

#### Update quantity không dùng Action {/*updating-the-users-name-without-an-action*/}

Trong ví dụ này, function `updateQuantity` cũng mô phỏng một request đến server để update quantity của item trong cart. Function này được *cố tình làm chậm* để request mất ít nhất một giây mới hoàn tất.

Hãy update quantity nhiều lần liên tiếp thật nhanh. Lưu ý rằng state “Total” đang chờ xử lý được hiển thị trong khi bất kỳ request nào còn đang diễn ra, nhưng “Total” được update nhiều lần tương ứng với mỗi lần “quantity” được nhấp:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
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
import { useState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async newQuantity => {
    // Manually set the isPending State.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

Một giải pháp phổ biến cho vấn đề này là ngăn người dùng thực hiện thay đổi trong khi quantity đang được update:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
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
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async event => {
    const newQuantity = event.target.value;
    // Manually set the isPending state.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item isPending={isPending} onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        disabled={isPending}
        onChange={onUpdateQuantity}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

Giải pháp này khiến ứng dụng có cảm giác chậm, vì người dùng phải chờ mỗi lần cập nhật số lượng. Có thể tự thêm cách xử lý phức tạp hơn để cho phép người dùng tương tác với UI trong khi số lượng đang được cập nhật, nhưng Actions xử lý trường hợp này bằng một API tích hợp sẵn đơn giản.

<Solution />

</Recipes>

---

### Exposing `action` prop from components {/*exposing-action-props-from-components*/}

Bạn có thể expose một prop `action` từ một component để cho phép component cha gọi một Action.

Ví dụ, component `TabButton` này bọc logic `onClick` của nó trong một prop `action`:

```js {8-12}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

Vì component cha cập nhật state bên trong `action`, nên state update đó được đánh dấu là một Transition. Điều này có nghĩa là bạn có thể nhấp vào "Posts" rồi ngay lập tức nhấp vào "Contact" mà không chặn các tương tác của người dùng:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
.items {
  max-height: 300px;
  overflow: auto;
}
```

</Sandpack>

<Note>

Khi expose một prop `action` từ một component, bạn nên `await` nó bên trong transition.

Điều này cho phép callback `action` có thể là synchronous hoặc asynchronous mà không cần thêm một `startTransition` để bọc `await` trong action.

</Note>

---

### Hiển thị trạng thái trực quan đang chờ {/*displaying-a-pending-visual-state*/}

Bạn có thể sử dụng giá trị boolean `isPending` được `useTransition` trả về để cho người dùng biết rằng một Transition đang diễn ra. Ví dụ, nút tab có thể có một trạng thái trực quan đặc biệt là "pending":

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Lưu ý rằng việc nhấp vào "Posts" giờ đây có cảm giác phản hồi nhanh hơn vì chính nút tab được cập nhật ngay lập tức:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
.items {
  max-height: 300px;
  overflow: auto;
}
```

</Sandpack>

---

### Ngăn các loading indicator không mong muốn {/*preventing-unwanted-loading-indicators*/}

Trong ví dụ này, component `PostsTab` fetch một số dữ liệu bằng [use](/reference/react/use). Khi bạn nhấp vào tab "Posts", component `PostsTab` *suspend*, khiến loading fallback gần nhất xuất hiện:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Ẩn toàn bộ container tab để hiển thị loading indicator tạo ra trải nghiệm người dùng giật cục. Nếu bạn thêm `useTransition` vào `TabButton`, thay vào đó bạn có thể hiển thị trạng thái đang chờ trong nút tab.

Lưu ý rằng việc nhấp vào "Posts" giờ đây không còn thay thế toàn bộ container tab bằng spinner:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Đọc thêm về cách sử dụng Transitions với Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Transitions chỉ "chờ" đủ lâu để tránh ẩn nội dung *đã được hiển thị* (chẳng hạn như container tab). Nếu tab Posts có một boundary [nested `<Suspense>`,](/reference/react/Suspense#revealing-nested-content-as-it-loads) Transition sẽ không "chờ" boundary đó.

</Note>

---

### Xây dựng router hỗ trợ Suspense {/*building-a-suspense-enabled-router*/}

Nếu bạn đang xây dựng một React framework hoặc một router, chúng tôi khuyến nghị đánh dấu việc điều hướng trang là Transitions.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

Điều này được khuyến nghị vì ba lý do:

- [Transitions có thể bị gián đoạn,](#perform-non-blocking-updates-with-actions) cho phép người dùng nhấp sang nơi khác mà không phải chờ re-render hoàn tất.
- [Transitions ngăn các loading indicator không mong muốn,](#preventing-unwanted-loading-indicators) cho phép người dùng tránh những thay đổi đột ngột khi điều hướng.
- [Transitions chờ tất cả các action đang chờ xử lý](#perform-non-blocking-updates-with-actions) cho phép người dùng chờ các side effect hoàn tất trước khi trang mới được hiển thị.

Dưới đây là một ví dụ đơn giản hóa về router sử dụng Transitions cho việc điều hướng.

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

Các router [Suspense-enabled](/reference/react/Suspense) được kỳ vọng sẽ bọc các navigation update trong Transitions theo mặc định.

</Note>

---

### Hiển thị lỗi cho người dùng bằng error boundary {/*displaying-an-error-to-users-with-error-boundary*/}

Nếu một function được truyền vào `startTransition` ném ra lỗi hoặc trả về một Promise bị reject, bạn có thể hiển thị lỗi cho người dùng bằng một [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Để sử dụng error boundary, hãy bọc component nơi bạn gọi `useTransition` trong một error boundary. Khi function được truyền vào `startTransition` gặp lỗi, fallback của error boundary sẽ được hiển thị.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Cập nhật input trong một Transition không hoạt động {/*updating-an-input-in-a-transition-doesnt-work*/}

Bạn không thể sử dụng Transition cho một state variable điều khiển input:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Can't use Transitions for controlled input state
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

Điều này là vì Transitions không chặn, nhưng việc cập nhật input để phản hồi change event phải diễn ra synchronous. Nếu bạn muốn chạy một Transition để phản hồi việc nhập liệu, có hai lựa chọn:

1. Bạn có thể khai báo hai state variable riêng biệt: một biến cho state của input (luôn được cập nhật synchronous), và một biến sẽ được cập nhật trong một Transition. Điều này cho phép bạn điều khiển input bằng state synchronous, đồng thời truyền state variable của Transition (sẽ "chậm hơn" input) cho phần logic rendering còn lại.
2. Ngoài ra, bạn có thể dùng một state variable và thêm [`useDeferredValue`](/reference/react/useDeferredValue), giá trị này sẽ "chậm hơn" giá trị thực. Nó sẽ tự động trigger các lần re-render không chặn để "bắt kịp" giá trị mới.

---

### React không coi state update của tôi là một Transition {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Khi bọc một state update trong một Transition, hãy đảm bảo rằng nó diễn ra *trong khi* thực hiện lời gọi `startTransition`:

```js
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

Function bạn truyền vào `startTransition` phải là synchronous. Bạn không thể đánh dấu một update là Transition như sau:

```js
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Thay vào đó, bạn có thể làm như sau:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

---

### React không coi state update của tôi sau `await` là một Transition {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

Khi bạn sử dụng `await` bên trong một function `startTransition`, các state update diễn ra sau `await` sẽ không được đánh dấu là Transitions. Bạn phải bọc các state update sau mỗi `await` trong một lời gọi `startTransition`:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Not using startTransition after await
  setPage('/about');
});
```

Tuy nhiên, cách này sẽ hoạt động:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Using startTransition *after* await
  startTransition(() => {
    setPage('/about');
  });
});
```

Đây là một giới hạn của JavaScript do React mất scope của async context. Trong tương lai, khi [AsyncContext](https://github.com/tc39/proposal-async-context) khả dụng, giới hạn này sẽ được loại bỏ.

---

### Tôi muốn gọi `useTransition` từ bên ngoài component {/*i-want-to-call-usetransition-from-outside-a-component*/}

Bạn không thể gọi `useTransition` bên ngoài một component vì nó là một Hook. Trong trường hợp này, function độc lập [`startTransition`](/reference/react/startTransition) có thể đánh dấu các state update là Transitions. Function này không cung cấp flag `isPending`. Vì function độc lập không liên kết với một component, Error Boundary không thể xử lý các lỗi từ Transition của nó.

---

### Function tôi truyền vào `startTransition` được thực thi ngay lập tức {/*the-function-i-pass-to-starttransition-executes-immediately*/}

Nếu chạy code này, nó sẽ in ra 1, 2, 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**Việc in ra 1, 2, 3 là đúng như dự kiến.** Function bạn truyền vào `startTransition` không bị trì hoãn. Không giống browser `setTimeout`, nó không chạy callback sau đó. React thực thi function của bạn ngay lập tức, nhưng mọi state update được schedule *trong khi function đang chạy* đều được đánh dấu là Transitions. Bạn có thể hình dung nó hoạt động như sau:

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a Transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```

### Các state update trong Transitions của tôi không đúng thứ tự {/*my-state-updates-in-transitions-are-out-of-order*/}

Nếu bạn `await` bên trong `startTransition`, bạn có thể thấy các update diễn ra không đúng thứ tự.

Trong ví dụ này, function `updateQuantity` mô phỏng một request đến server để cập nhật số lượng của item trong cart. Function này *cố ý trả về mọi request khác sau request trước đó* để mô phỏng các race condition đối với network request.

Hãy thử cập nhật số lượng một lần, sau đó nhanh chóng cập nhật nhiều lần. Bạn có thể thấy tổng số không chính xác:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
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
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);

  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Access the pending state of the transition,
    // by wrapping in startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(async () => {
      await action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>


Khi nhấp nhiều lần, các request trước đó có thể hoàn tất sau các request được gửi sau. Khi điều này xảy ra, hiện tại React không có cách nào biết được thứ tự mong muốn. Nguyên nhân là các bản cập nhật được lập lịch không đồng bộ, và React mất ngữ cảnh về thứ tự khi đi qua ranh giới bất đồng bộ.

Điều này là có thể dự đoán, vì các Actions trong một Transition không đảm bảo thứ tự thực thi. Đối với các trường hợp sử dụng phổ biến, React cung cấp các abstraction cấp cao hơn như [`useActionState`](/reference/react/useActionState) và các action [`<form>` actions](/reference/react-dom/components/form) để xử lý thứ tự giúp bạn. Đối với các trường hợp sử dụng nâng cao, bạn sẽ cần tự triển khai logic xếp hàng và hủy để xử lý việc này.


Ví dụ về cách `useActionState` xử lý thứ tự thực thi:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
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
import { useState, useActionState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  const [quantity, updateQuantityAction, isPending] = useActionState(
    async (prevState, payload) => {
      setClientQuantity(payload);
      const savedQuantity = await updateQuantity(payload);
      return savedQuantity; // Return the new quantity to update the state
    },
    1 // Initial quantity
  );

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(() => {
      action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>