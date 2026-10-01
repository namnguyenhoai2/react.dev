---
title: useOptimistic
---

<Intro>

`useOptimistic` là một React Hook cho phép bạn cập nhật UI theo hướng lạc quan.

```js
const [optimisticState, setOptimistic] = useOptimistic(value, reducer?);
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useOptimistic(value, reducer?)` {/*useoptimistic*/}

Gọi `useOptimistic` ở cấp cao nhất của component để tạo state lạc quan cho một giá trị.

```js
import { useOptimistic } from 'react';

function MyComponent({name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(28);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, todoReducer);
  // ...
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `value`: Giá trị được trả về khi không có Action nào đang chờ xử lý.
* **tùy chọn** `reducer(currentState, action)`: Hàm reducer chỉ định cách state lạc quan được cập nhật. Hàm này phải pure, nên nhận state hiện tại và các đối số của reducer action, đồng thời trả về state lạc quan tiếp theo.

#### Giá trị trả về {/*returns*/}

`useOptimistic` trả về một mảng có chính xác hai giá trị:

1. `optimisticState`: State lạc quan hiện tại. Giá trị này bằng `value` trừ khi có một Action đang chờ xử lý; trong trường hợp đó, nó bằng state do `reducer` trả về (hoặc giá trị được truyền vào hàm set nếu không cung cấp `reducer`).
2. Hàm [`set` function](#setoptimistic) cho phép bạn cập nhật state lạc quan thành một giá trị khác bên trong một Action.

---

### Các hàm `set`, chẳng hạn như `setOptimistic(optimisticState)` {/*setoptimistic*/}

Hàm `set` được `useOptimistic` trả về cho phép bạn cập nhật state trong suốt thời gian một [Action](reference/react/useTransition#functions-called-in-starttransition-are-called-actions) diễn ra. Bạn có thể truyền trực tiếp state tiếp theo hoặc một hàm tính toán state đó từ state trước đó:

```js
const [optimisticLike, setOptimisticLike] = useOptimistic(false);
const [optimisticSubs, setOptimisticSubs] = useOptimistic(subs);

function handleClick() {
  startTransition(async () => {
    setOptimisticLike(true);
    setOptimisticSubs(a => a + 1);
    await saveChanges();
  });
}
```

#### Tham số {/*setoptimistic-parameters*/}

* `optimisticState`: Giá trị mà bạn muốn state lạc quan có trong suốt một [Action](reference/react/useTransition#functions-called-in-starttransition-are-called-actions). Nếu bạn đã cung cấp `reducer` cho `useOptimistic`, giá trị này sẽ được truyền làm đối số thứ hai cho reducer của bạn. Giá trị này có thể thuộc bất kỳ kiểu nào.
    * Nếu bạn truyền một hàm làm `optimisticState`, hàm đó sẽ được xem là một _updater function_. Hàm này phải pure, chỉ nhận state đang chờ xử lý làm đối số và trả về state lạc quan tiếp theo. React sẽ đưa updater function của bạn vào một queue và re-render component. Trong lần render tiếp theo, React sẽ tính state tiếp theo bằng cách áp dụng các updater trong queue vào state trước đó, tương tự như các updater [`useState` updaters](/reference/react/useState#setstate-parameters).

#### Giá trị trả về {/*setoptimistic-returns*/}

Các hàm `set` không có giá trị trả về.

#### Lưu ý {/*setoptimistic-caveats*/}

* Hàm `set` phải được gọi bên trong một [Action](reference/react/useTransition#functions-called-in-starttransition-are-called-actions). Nếu bạn gọi setter bên ngoài một Action, [React sẽ hiển thị cảnh báo](#an-optimistic-state-update-occurred-outside-a-transition-or-action) và state lạc quan sẽ được render trong thời gian ngắn.

<DeepDive>

#### Cách state lạc quan hoạt động {/*how-optimistic-state-works*/}

`useOptimistic` cho phép bạn hiển thị một giá trị tạm thời trong khi một Action đang diễn ra:

```js
const [value, setValue] = useState('a');
const [optimistic, setOptimistic] = useOptimistic(value);

startTransition(async () => {
  setOptimistic('b');
  const newValue = await saveChanges('b');
  setValue(newValue);
});
```

Khi setter được gọi bên trong một Action, `useOptimistic` sẽ kích hoạt re-render để hiển thị state đó trong khi Action đang diễn ra. Nếu không, `value` được truyền vào `useOptimistic` sẽ được trả về.

State này được gọi là "lạc quan" vì nó được dùng để ngay lập tức hiển thị cho người dùng kết quả của việc thực hiện một Action, mặc dù Action thực tế cần thời gian để hoàn tất.

**Cách quá trình cập nhật diễn ra**

1. **Cập nhật ngay lập tức**: Khi `setOptimistic('b')` được gọi, React lập tức render với `'b'`.

2. **(Tùy chọn) await trong Action**: Nếu bạn dùng await trong Action, React tiếp tục hiển thị `'b'`.

3. **Lên lịch Transition**: `setValue(newValue)` lên lịch cập nhật state thực.

4. **(Tùy chọn) Chờ Suspense**: Nếu `newValue` suspend, React tiếp tục hiển thị `'b'`.

5. **Commit render một lần**: Cuối cùng, `newValue` commit cho `value` và `optimistic`.

Không có lần render bổ sung nào để "xóa" state lạc quan. State lạc quan và state thực hội tụ trong cùng một lần render khi Transition hoàn tất.

<Note>

#### State lạc quan là tạm thời {/*optimistic-state-is-temporary*/}

State lạc quan chỉ được render trong khi một Action đang diễn ra; nếu không, `value` sẽ được render.

Nếu `saveChanges` trả về `'c'`, thì cả `value` và `optimistic` sẽ là `'c'`, không phải `'b'`.

</Note>

**Cách xác định state cuối cùng**

Đối số `value` của `useOptimistic` xác định nội dung được hiển thị sau khi Action hoàn tất. Cách hoạt động phụ thuộc vào pattern bạn sử dụng:

- **Giá trị hardcoded** như `useOptimistic(false)`: Sau Action, `state` vẫn là `false`, vì vậy UI hiển thị `false`. Cách này hữu ích cho các state đang chờ xử lý mà bạn luôn bắt đầu từ `false`.

- **Props hoặc state được truyền vào** như `useOptimistic(isLiked)`: Nếu component cha cập nhật `isLiked` trong khi Action diễn ra, giá trị mới sẽ được sử dụng sau khi Action hoàn tất. Đây là cách UI phản ánh kết quả của Action.

- **Reducer pattern** như `useOptimistic(items, fn)`: Nếu `items` thay đổi trong khi Action đang chờ xử lý, React sẽ chạy lại `reducer` với `items` mới để tính toán lại state. Điều này giữ cho các phần tử lạc quan bạn thêm vào nằm trên dữ liệu mới nhất.

**Điều gì xảy ra khi Action thất bại**

Nếu Action throw một error, Transition vẫn kết thúc và React render với bất kỳ giá trị nào mà `value` hiện đang có. Vì component cha thường chỉ cập nhật `value` khi thành công, nên thất bại có nghĩa là `value` không thay đổi; do đó, UI hiển thị những gì đã hiển thị trước khi cập nhật lạc quan. Bạn có thể catch error để hiển thị thông báo cho người dùng.

</DeepDive>

---

## Cách sử dụng {/*usage*/}

### Thêm state lạc quan vào component {/*adding-optimistic-state-to-a-component*/}

Gọi `useOptimistic` ở cấp cao nhất của component để khai báo một hoặc nhiều state lạc quan.

```js [[1, 4, "age"], [1, 5, "name"], [1, 6, "todos"], [2, 4, "optimisticAge"], [2, 5, "optimisticName"], [2, 6, "optimisticTodos"], [3, 4, "setOptimisticAge"], [3, 5, "setOptimisticName"], [3, 6, "setOptimisticTodos"], [4, 6, "reducer"]]
import { useOptimistic } from 'react';

function MyComponent({age, name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(age);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, reducer);
  // ...
```

`useOptimistic` trả về một mảng có chính xác hai phần tử:

1. <CodeStep step={2}>state lạc quan</CodeStep>, ban đầu được đặt thành <CodeStep step={1}>giá trị</CodeStep> được cung cấp.
2. <CodeStep step={3}>hàm set</CodeStep> cho phép bạn tạm thời thay đổi state trong một [Action](reference/react/useTransition#functions-called-in-starttransition-are-called-actions).
   * Nếu cung cấp một <CodeStep step={4}>reducer</CodeStep>, reducer đó sẽ chạy trước khi trả về state lạc quan.

Để sử dụng <CodeStep step={2}>state lạc quan</CodeStep>, hãy gọi hàm `set` bên trong một Action.

Actions là các hàm được gọi bên trong `startTransition`:

```js {3}
function onAgeChange(e) {
  startTransition(async () => {
    setOptimisticAge(42);
    const newAge = await postAge(42);
    setAge(newAge);
  });
}
```

React sẽ render state lạc quan `42` trước, trong khi `age` vẫn là tuổi hiện tại. Action chờ POST, sau đó render `newAge` cho cả `age` và `optimisticAge`.

Xem [Cách state lạc quan hoạt động](#how-optimistic-state-works) để tìm hiểu chuyên sâu.

<Note>

Khi sử dụng [Action props](/reference/react/useTransition#exposing-action-props-from-components), bạn có thể gọi hàm set mà không cần `startTransition`:

```js [[3, 2, "setOptimisticName"]]
async function submitAction() {
  setOptimisticName('Taylor');
  await updateName('Taylor');
}
```

Điều này hoạt động vì Action props đã được gọi bên trong `startTransition`.

Xem ví dụ tại: [Sử dụng state lạc quan trong Action props](#using-optimistic-state-in-action-props).

</Note>

---

### Sử dụng state lạc quan trong Action props {/*using-optimistic-state-in-action-props*/}

Trong một [Action prop](/reference/react/useTransition#exposing-action-props-from-components), bạn có thể gọi trực tiếp optimistic setter mà không cần `startTransition`.

Ví dụ này thiết lập state lạc quan bên trong một prop `<form>` `submitAction`:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import EditName from './EditName';

export default function App() {
  const [name, setName] = useState('Alice');

  return <EditName name={name} action={setName} />;
}
```

```js src/EditName.js active
import { useOptimistic, startTransition } from 'react';
import { updateName } from './actions.js';

export default function EditName({ name, action }) {
  const [optimisticName, setOptimisticName] = useOptimistic(name);

  async function submitAction(formData) {
    const newName = formData.get('name');
    setOptimisticName(newName);

    const updatedName = await updateName(newName);
    startTransition(() => {
      action(updatedName);
    })
  }

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change it: </label>
        <input
          type="text"
          name="name"
          disabled={name !== optimisticName}
        />
      </p>
    </form>
  );
}
```

```js src/actions.js hidden
export async function updateName(name) {
  await new Promise((res) => setTimeout(res, 1000));
  return name;
}
```

</Sandpack>

Trong ví dụ này, khi người dùng submit form, `optimisticName` được cập nhật ngay lập tức để hiển thị `newName` theo hướng lạc quan trong khi request đến server đang diễn ra. Khi request hoàn tất, `name` và `optimisticName` được render cùng với `updatedName` thực tế từ response.

<DeepDive>

#### Tại sao không cần `startTransition`? {/*why-doesnt-this-need-starttransition*/}

Theo quy ước, các props được gọi bên trong `startTransition` được đặt tên với "Action".

Vì `submitAction` được đặt tên với "Action", bạn biết rằng nó đã được gọi bên trong `startTransition`.

Xem [Expose `action` prop từ các component](/reference/react/useTransition#exposing-action-props-from-components) để biết pattern của Action prop.

</DeepDive>

---

### Thêm trạng thái optimistic vào các Action prop {/*adding-optimistic-state-to-action-props*/}

Khi tạo một [Action prop](/reference/react/useTransition#exposing-action-props-from-components), bạn có thể thêm `useOptimistic` để hiển thị phản hồi ngay lập tức.

Đây là một button hiển thị "Submitting..." trong khi `action` đang pending:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import Button from './Button';
import { submitForm } from './actions.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Button action={async () => {
        await submitForm();
        startTransition(() => {
          setCount(c => c + 1);
        });
      }}>Increment</Button>
      {count > 0 && <p>Submitted {count}!</p>}
    </div>
  );
}
```

```js src/Button.js active
import { useOptimistic, startTransition } from 'react';

export default function Button({ action, children }) {
  const [isPending, setIsPending] = useOptimistic(false);

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          setIsPending(true);
          await action();
        });
      }}
    >
      {isPending ? 'Submitting...' : children}
    </button>
  );
}
```

```js src/actions.js hidden
export async function submitForm() {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

Khi click vào button, `setIsPending(true)` sử dụng trạng thái optimistic để ngay lập tức hiển thị "Submitting..." và vô hiệu hóa button. Khi Action hoàn tất, `isPending` được tự động render dưới dạng `false`.

Pattern này tự động hiển thị trạng thái pending khi `action` prop được sử dụng với `Button`:

```js
// Hiển thị trạng thái pending cho cập nhật state
<Button action={() => { setState(c => c + 1) }} />

// Hiển thị trạng thái pending cho điều hướng
<Button action={() => { navigate('/done') }} />

// Hiển thị trạng thái pending cho POST
<Button action={async () => { await fetch(/* ... */) }} />

// Hiển thị trạng thái pending cho mọi tổ hợp
<Button action={async () => {
  setState(c => c + 1);
  await fetch(/* ... */);
  navigate('/done');
}} />
```

Trạng thái pending sẽ được hiển thị cho đến khi mọi thứ trong `action` prop hoàn tất.

<Note>

Bạn cũng có thể sử dụng [`useTransition`](/reference/react/useTransition) để nhận trạng thái pending thông qua `isPending`.

Điểm khác biệt là `useTransition` cung cấp cho bạn hàm `startTransition`, trong khi `useOptimistic` hoạt động với mọi Transition. Hãy sử dụng cách phù hợp với nhu cầu của component.

</Note>

---

### Cập nhật props hoặc state theo cách optimistic {/*updating-props-or-state-optimistically*/}

Bạn có thể bọc props hoặc state trong `useOptimistic` để cập nhật chúng ngay lập tức trong khi một Action đang thực thi.

Trong ví dụ này, `LikeButton` nhận `isLiked` dưới dạng prop và ngay lập tức chuyển đổi nó khi được click:

<Sandpack>

```js src/App.js
import { useState, useOptimistic, startTransition } from 'react';
import { toggleLike } from './actions.js';

export default function App() {
  const [isLiked, setIsLiked] = useState(false);
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked);

  function handleClick() {
    startTransition(async () => {
      const newValue = !optimisticIsLiked
      console.log('⏳ setting optimistic state: ' + newValue);

      setOptimisticIsLiked(newValue);
      const updatedValue = await toggleLike(newValue);

      startTransition(() => {
        console.log('⏳ setting real state: ' + updatedValue );
        setIsLiked(updatedValue);
      });
    });
  }

  if (optimisticIsLiked !== isLiked) {
    console.log('✅ rendering optimistic state: ' + optimisticIsLiked);
  } else {
    console.log('✅ rendering real value: ' + optimisticIsLiked);
  }


  return (
    <button onClick={handleClick}>
      {optimisticIsLiked ? '❤️ Unlike' : '🤍 Like'}
    </button>
  );
}
```

```js src/actions.js hidden
export async function toggleLike(value) {
  return await new Promise((res) => setTimeout(() => res(value), 1000));
  // Trong app thực tế, đoạn này sẽ cập nhật server
}
```

```js src/index.js hidden
import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
// Không dùng StrictMode để không hiển thị log render hai lần.
root.render(<App />);
```

</Sandpack>

Khi click vào button, `setOptimisticIsLiked` ngay lập tức cập nhật trạng thái được hiển thị để cho biết heart đã được thích. Trong lúc đó, `await toggleLike` chạy ở background. Khi `await` hoàn tất, parent `setIsLiked` cập nhật trạng thái `isLiked` "thực", và trạng thái optimistic được render để khớp với giá trị mới này.

<Note>

Ví dụ này đọc từ `optimisticIsLiked` để tính toán giá trị tiếp theo. Cách này hoạt động khi base state không thay đổi, nhưng nếu base state có thể thay đổi trong khi Action đang pending, bạn nên sử dụng state updater hoặc reducer.

Xem [Cập nhật state dựa trên state hiện tại](#updating-state-based-on-current-state) để xem ví dụ.

</Note>

---

### Cập nhật nhiều giá trị cùng lúc {/*updating-multiple-values-together*/}

Khi một optimistic update ảnh hưởng đến nhiều giá trị có liên quan, hãy sử dụng reducer để cập nhật chúng cùng nhau. Điều này đảm bảo UI luôn nhất quán.

Đây là một follow button cập nhật cả trạng thái follow và số lượng follower:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { followUser, unfollowUser } from './actions.js';
import FollowButton from './FollowButton';

export default function App() {
  const [user, setUser] = useState({
    name: 'React',
    isFollowing: false,
    followerCount: 10500
  });

  async function followAction(shouldFollow) {
    if (shouldFollow) {
      await followUser(user.name);
    } else {
      await unfollowUser(user.name);
    }
    startTransition(() => {
      setUser(current => ({
        ...current,
        isFollowing: shouldFollow,
        followerCount: current.followerCount + (shouldFollow ? 1 : -1)
      }));
    });
  }

  return <FollowButton user={user} followAction={followAction} />;
}
```

```js src/FollowButton.js active
import { useOptimistic, startTransition } from 'react';

export default function FollowButton({ user, followAction }) {
  const [optimisticState, updateOptimistic] = useOptimistic(
    { isFollowing: user.isFollowing, followerCount: user.followerCount },
    (current, isFollowing) => ({
      isFollowing,
      followerCount: current.followerCount + (isFollowing ? 1 : -1)
    })
  );

  function handleClick() {
    const newFollowState = !optimisticState.isFollowing;
    startTransition(async () => {
      updateOptimistic(newFollowState);
      await followAction(newFollowState);
    });
  }

  return (
    <div>
      <p><strong>{user.name}</strong></p>
      <p>{optimisticState.followerCount} followers</p>
      <button onClick={handleClick}>
        {optimisticState.isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

```js src/actions.js hidden
export async function followUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}

export async function unfollowUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

Reducer nhận giá trị `isFollowing` mới và tính toán cả trạng thái follow mới lẫn số lượng follower được cập nhật trong một lần update. Điều này đảm bảo nội dung button và số lượng luôn đồng bộ.

<DeepDive>

#### Chọn giữa updater và reducer {/*choosing-between-updaters-and-reducers*/}

`useOptimistic` hỗ trợ hai pattern để tính toán state dựa trên state hiện tại:

**Updater function** hoạt động giống như [updater của useState](/reference/react/useState#updating-state-based-on-the-previous-state). Truyền một function vào setter:

```js
const [optimistic, setOptimistic] = useOptimistic(value);
setOptimistic(current => !current);
```

**Reducer** tách logic update khỏi lời gọi setter:

```js
const [optimistic, dispatch] = useOptimistic(value, (current, action) => {
  // Tính state tiếp theo dựa trên state hiện tại và action
});
dispatch(action);
```

**Sử dụng updater** cho các phép tính mà lời gọi setter tự nhiên mô tả được update. Cách này tương tự như việc sử dụng `setState(prev => ...)` với `useState`.

**Sử dụng reducer** khi bạn cần truyền dữ liệu vào update (chẳng hạn như cần thêm item nào) hoặc khi xử lý nhiều loại update bằng một hook duy nhất.

**Tại sao nên sử dụng reducer?**

Reducer rất cần thiết khi base state có thể thay đổi trong lúc Transition đang pending. Nếu `todos` thay đổi trong khi thao tác thêm của bạn đang pending (ví dụ: một user khác đã thêm một todo), React sẽ chạy lại reducer với `todos` mới để tính toán nội dung cần hiển thị. Điều này đảm bảo todo mới của bạn được thêm vào list mới nhất, thay vì một bản sao đã lỗi thời.

Một updater function như `setOptimistic(prev => [...prev, newItem])` chỉ nhìn thấy state tại thời điểm Transition bắt đầu và bỏ lỡ mọi update diễn ra trong quá trình xử lý async.

</DeepDive>

---

### Thêm item optimistic vào list {/*optimistically-adding-to-a-list*/}

Khi cần thêm item theo cách optimistic vào một list, hãy sử dụng một `reducer`:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addTodo } from './actions.js';
import TodoList from './TodoList';

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' }
  ]);

  async function addTodoAction(newTodo) {
    const savedTodo = await addTodo(newTodo);
    startTransition(() => {
      setTodos(todos => [...todos, savedTodo]);
    });
  }

  return <TodoList todos={todos} addTodoAction={addTodoAction} />;
}
```

```js src/TodoList.js active
import { useOptimistic, startTransition } from 'react';

export default function TodoList({ todos, addTodoAction }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [
      ...currentTodos,
      { id: newTodo.id, text: newTodo.text, pending: true }
    ]
  );

  function handleAddTodo(text) {
    const newTodo = { id: crypto.randomUUID(), text: text };
    startTransition(async () => {
      addOptimisticTodo(newTodo);
      await addTodoAction(newTodo);
    });
  }

  return (
    <div>
      <button onClick={() => handleAddTodo('New todo')}>Add Todo</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>
            {todo.text} {todo.pending && "(Adding...)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addTodo(todo) {
  await new Promise((res) => setTimeout(res, 1000));
  // Trong app thực tế, đoạn này sẽ lưu vào server
  return { ...todo, pending: false };
}
```

</Sandpack>

`reducer` nhận list todo hiện tại và todo mới cần thêm. Điều này rất quan trọng vì nếu prop `todos` thay đổi trong khi thao tác thêm đang pending (ví dụ: một user khác đã thêm một todo), React sẽ cập nhật trạng thái optimistic của bạn bằng cách chạy lại reducer với list đã được cập nhật. Điều này đảm bảo todo mới của bạn được thêm vào list mới nhất, thay vì một bản sao đã lỗi thời.

<Note>

Mỗi item optimistic bao gồm một flag `pending: true` để bạn có thể hiển thị trạng thái loading cho từng item. Khi server phản hồi và parent cập nhật list `todos` canonical bằng item đã được lưu, trạng thái optimistic sẽ cập nhật thành item đã xác nhận mà không còn flag pending.

</Note>

---

### Xử lý nhiều loại `action` {/*handling-multiple-action-types*/}

Khi cần xử lý nhiều loại optimistic update (chẳng hạn như thêm và xóa item), hãy sử dụng pattern reducer với các object `action`.

Ví dụ về shopping cart này cho thấy cách xử lý thao tác thêm và xóa bằng một reducer duy nhất:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addToCart, removeFromCart, updateQuantity } from './actions.js';
import ShoppingCart from './ShoppingCart';

export default function App() {
  const [cart, setCart] = useState([]);

  const cartActions = {
    async add(item) {
      await addToCart(item);
      startTransition(() => {
        setCart(current => {
          const exists = current.find(i => i.id === item.id);
          if (exists) {
            return current.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...current, { ...item, quantity: 1 }];
        });
      });
    },
    async remove(id) {
      await removeFromCart(id);
      startTransition(() => {
        setCart(current => current.filter(item => item.id !== id));
      });
    },
    async updateQuantity(id, quantity) {
      await updateQuantity(id, quantity);
      startTransition(() => {
        setCart(current =>
          current.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      });
    }
  };

  return <ShoppingCart cart={cart} cartActions={cartActions} />;
}
```

```js src/ShoppingCart.js active
import { useOptimistic, startTransition } from 'react';

export default function ShoppingCart({ cart, cartActions }) {
  const [optimisticCart, dispatch] = useOptimistic(
    cart,
    (currentCart, action) => {
      switch (action.type) {
        case 'add':
          const exists = currentCart.find(item => item.id === action.item.id);
          if (exists) {
            return currentCart.map(item =>
              item.id === action.item.id
                ? { ...item, quantity: item.quantity + 1, pending: true }
                : item
            );
          }
          return [...currentCart, { ...action.item, quantity: 1, pending: true }];
        case 'remove':
          return currentCart.filter(item => item.id !== action.id);
        case 'update_quantity':
          return currentCart.map(item =>
            item.id === action.id
              ? { ...item, quantity: action.quantity, pending: true }
              : item
          );
        default:
          return currentCart;
      }
    }
  );

  function handleAdd(item) {
    startTransition(async () => {
      dispatch({ type: 'add', item });
      await cartActions.add(item);
    });
  }

  function handleRemove(id) {
    startTransition(async () => {
      dispatch({ type: 'remove', id });
      await cartActions.remove(id);
    });
  }

  function handleUpdateQuantity(id, quantity) {
    startTransition(async () => {
      dispatch({ type: 'update_quantity', id, quantity });
      await cartActions.updateQuantity(id, quantity);
    });
  }

  const total = optimisticCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Shopping Cart</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => handleAdd({
          id: 1, name: 'T-Shirt', price: 25
        })}>
          Add T-Shirt ($25)
        </button>{' '}
        <button onClick={() => handleAdd({
          id: 2, name: 'Mug', price: 15
        })}>
          Add Mug ($15)
        </button>
      </div>
      {optimisticCart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {optimisticCart.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} ×
              {item.quantity}
              {' '}= ${item.price * item.quantity}
              <button
                onClick={() => handleRemove(item.id)}
                style={{ marginLeft: 8 }}
              >
                Remove
              </button>
              {item.pending && ' ...'}
            </li>
          ))}
        </ul>
      )}
      <p><strong>Total: ${total}</strong></p>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addToCart(item) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function removeFromCart(id) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function updateQuantity(id, quantity) {
  await new Promise((res) => setTimeout(res, 800));
}
```

</Sandpack>

Reducer xử lý ba loại `action` (`add`, `remove`, `update_quantity`) và trả về trạng thái optimistic mới cho từng loại. Mỗi `action` thiết lập một flag `pending: true` để bạn có thể hiển thị phản hồi trực quan trong khi [Server Function](/reference/rsc/server-functions) chạy.

---

### Xóa optimistic với khả năng khôi phục khi có lỗi {/*optimistic-delete-with-error-recovery*/}

Khi xóa item theo cách optimistic, bạn nên xử lý trường hợp Action thất bại.

Ví dụ này cho thấy cách hiển thị thông báo lỗi khi thao tác xóa thất bại, đồng thời UI tự động rollback để hiển thị lại item.

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { deleteItem } from './actions.js';
import ItemList from './ItemList';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Learn React' },
    { id: 2, name: 'Build an app' },
    { id: 3, name: 'Deploy to production' },
  ]);

  async function deleteAction(id) {
    await deleteItem(id);
    startTransition(() => {
      setItems(current => current.filter(item => item.id !== id));
    });
  }

  return <ItemList items={items} deleteAction={deleteAction} />;
}
```

```js src/ItemList.js active
import { useState, useOptimistic, startTransition } from 'react';

export default function ItemList({ items, deleteAction }) {
  const [error, setError] = useState(null);
  const [optimisticItems, removeItem] = useOptimistic(
    items,
    (currentItems, idToRemove) =>
      currentItems.map(item =>
        item.id === idToRemove
          ? { ...item, deleting: true }
          : item
      )
  );

  function handleDelete(id) {
    setError(null);
    startTransition(async () => {
      removeItem(id);
      try {
        await deleteAction(id);
      } catch (e) {
        setError(e.message);
      }
    });
  }

  return (
    <div>
      <h2>Your Items</h2>
      <ul>
        {optimisticItems.map(item => (
          <li
            key={item.id}
            style={{
              opacity: item.deleting ? 0.5 : 1,
              textDecoration: item.deleting ? 'line-through' : 'none',
              transition: 'opacity 0.2s'
            }}
          >
            {item.name}
            <button
              onClick={() => handleDelete(item.id)}
              disabled={item.deleting}
              style={{ marginLeft: 8 }}
            >
              {item.deleting ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      {error && (
        <p style={{ color: 'red', padding: 8, background: '#fee' }}>
          {error}
        </p>
      )}
    </div>
  );
}
```

```js src/actions.js hidden
export async function deleteItem(id) {
  await new Promise((res) => setTimeout(res, 1000));
  // Phần tử 3 luôn thất bại để minh họa việc khôi phục sau lỗi
  if (id === 3) {
    throw new Error('Cannot delete. Permission denied.');
  }
}
```

</Sandpack>

Hãy thử xóa 'Deploy to production'. Khi thao tác xóa thất bại, item sẽ tự động xuất hiện lại trong list.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi nhận được lỗi: "An optimistic state update occurred outside a Transition or Action" {/*an-optimistic-state-update-occurred-outside-a-transition-or-action*/}

Bạn có thể thấy lỗi sau:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Một optimistic state update đã xảy ra bên ngoài Transition hoặc Action. Để khắc phục, hãy chuyển update vào một Action hoặc bọc nó bằng `startTransition`.

</ConsoleLogLine>

</ConsoleBlockMulti>

Hàm optimistic setter phải được gọi bên trong `startTransition`:

```js
// 🚩 Incorrect: outside a Transition
function handleClick() {
  setOptimistic(newValue);  // Cảnh báo!
  // ...
}

// ✅ Correct: inside a Transition
function handleClick() {
  startTransition(async () => {
    setOptimistic(newValue);
    // ...
  });
}

// ✅ Also correct: inside an Action prop
function submitAction(formData) {
  setOptimistic(newValue);
  // ...
}
```

Khi gọi setter bên ngoài một Action, trạng thái optimistic sẽ xuất hiện trong thời gian ngắn rồi ngay lập tức trở về giá trị ban đầu. Điều này xảy ra vì không có Transition để "giữ" trạng thái optimistic trong khi Action chạy.

### Tôi nhận được lỗi: "Cannot update optimistic state while rendering" {/*cannot-update-optimistic-state-while-rendering*/}

Bạn có thể thấy lỗi sau:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Không thể cập nhật optimistic state trong khi rendering.

</ConsoleLogLine>

</ConsoleBlockMulti>

Lỗi này xảy ra khi bạn gọi optimistic setter trong giai đoạn render của component. Bạn chỉ có thể gọi nó từ event handler, effect hoặc callback khác:

```js
// 🚩 Incorrect: calling during render
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  // Đoạn này chạy trong khi render — không được phép!
  setPending(true);

  // ...
}

// ✅ Correct: calling inside startTransition
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function handleClick() {
    startTransition(() => {
      setPending(true);
      // ...
    });
  }

  // ...
}

// ✅ Also correct: calling from an Action
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function action() {
    setPending(true);
    // ...
  }

  // ...
}
```

### Các optimistic update của tôi hiển thị giá trị cũ {/*my-optimistic-updates-show-stale-values*/}

Nếu trạng thái optimistic của bạn có vẻ dựa trên dữ liệu cũ, hãy cân nhắc sử dụng updater function hoặc reducer để tính toán trạng thái optimistic dựa trên state hiện tại.

```js
// Có thể hiển thị dữ liệu cũ nếu state thay đổi trong Action
const [optimistic, setOptimistic] = useOptimistic(count);
setOptimistic(5);  // Luôn đặt thành 5, kể cả khi count đã thay đổi

// Tốt hơn: cập nhật tương đối xử lý thay đổi state đúng cách
const [optimistic, adjust] = useOptimistic(count, (current, delta) => current + delta);
adjust(1);  // Luôn cộng 1 vào giá trị count hiện tại
```

Xem [Cập nhật state dựa trên state hiện tại](#updating-state-based-on-current-state) để biết chi tiết.

### Tôi không biết optimistic update của mình có đang pending hay không {/*i-dont-know-if-my-optimistic-update-is-pending*/}

Để biết khi nào `useOptimistic` đang pending, bạn có ba lựa chọn:

1. **Kiểm tra xem `optimisticValue === value`**

```js
const [optimistic, setOptimistic] = useOptimistic(value);
const isPending = optimistic !== value;
```

Nếu các giá trị không bằng nhau, nghĩa là một Transition đang diễn ra.

2. **Thêm một `useTransition`**

```js
const [isPending, startTransition] = useTransition();
const [optimistic, setOptimistic] = useOptimistic(value);

//...
startTransition(() => {
  setOptimistic(state);
})
```

Vì `useTransition` sử dụng `useOptimistic` cho `isPending` ở bên dưới, cách này tương đương với lựa chọn 1.

3. **Thêm flag `pending` trong reducer**

```js
const [optimistic, addOptimistic] = useOptimistic(
  items,
  (state, newItem) => [...state, { ...newItem, isPending: true }]
);
```

Vì mỗi item optimistic có flag riêng, bạn có thể hiển thị trạng thái loading cho từng item.
