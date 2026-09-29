---
title: useState
---

<Intro>

`useState` là một React Hook cho phép bạn thêm một biến [state](/learn/state-a-components-memory) vào component.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Gọi `useState` ở cấp cao nhất của component để khai báo một [biến state.](/learn/state-a-components-memory)

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

Quy ước là đặt tên cho các biến state như `[something, setSomething]` bằng cách sử dụng [array destructuring.](https://javascript.info/destructuring-assignment)

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `initialState`: Giá trị bạn muốn state có lúc khởi tạo. Giá trị này có thể thuộc bất kỳ kiểu nào, nhưng các function có hành vi đặc biệt. Đối số này bị bỏ qua sau lần render đầu tiên.
  * Nếu bạn truyền một function làm `initialState`, function đó sẽ được xem như một _initializer function_. Function này phải pure, không nhận đối số nào và phải trả về một giá trị thuộc bất kỳ kiểu nào. React sẽ gọi initializer function khi khởi tạo component và lưu giá trị mà function trả về làm state ban đầu. [Xem một ví dụ bên dưới.](#avoiding-recreating-the-initial-state)

#### Giá trị trả về {/*returns*/}

`useState` trả về một mảng gồm chính xác hai giá trị:

1. State hiện tại. Trong lần render đầu tiên, giá trị này sẽ khớp với `initialState` mà bạn đã truyền vào.
2. [`set` function](#setstate) cho phép bạn cập nhật state thành một giá trị khác và kích hoạt re-render.

#### Lưu ý {/*caveats*/}

* `useState` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc các Hook do bạn tự tạo. Bạn không thể gọi nó bên trong loop hoặc condition. Nếu cần làm vậy, hãy tách một component mới và chuyển state vào đó.
* Trong Strict Mode, React sẽ **gọi initializer function của bạn hai lần** để [giúp bạn phát hiện các thao tác không pure ngoài ý muốn.](#my-initializer-or-updater-function-runs-twice) Đây là hành vi chỉ có trong development và không ảnh hưởng đến production. Nếu initializer function của bạn là pure (như yêu cầu), điều này sẽ không ảnh hưởng đến hành vi. Kết quả từ một trong hai lần gọi sẽ bị bỏ qua.

---

### Các function `set`, chẳng hạn như `setSomething(nextState)` {/*setstate*/}

Function `set` do `useState` trả về cho phép bạn cập nhật state thành một giá trị khác và kích hoạt re-render. Bạn có thể truyền trực tiếp state tiếp theo hoặc một function tính toán state đó từ state trước đó:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Tham số {/*setstate-parameters*/}

* `nextState`: Giá trị mà bạn muốn state có. Giá trị này có thể thuộc bất kỳ kiểu nào, nhưng các function có hành vi đặc biệt.
  * Nếu bạn truyền một function làm `nextState`, function đó sẽ được xem như một _updater function_. Function này phải pure, chỉ nhận state đang chờ xử lý làm đối số duy nhất và phải trả về state tiếp theo. React sẽ đưa updater function của bạn vào một queue và re-render component. Trong lần render tiếp theo, React sẽ tính toán state tiếp theo bằng cách áp dụng tất cả updater đang nằm trong queue vào state trước đó. [Xem một ví dụ bên dưới.](#updating-state-based-on-the-previous-state)

#### Giá trị trả về {/*setstate-returns*/}

Các function `set` không trả về giá trị.

#### Lưu ý {/*setstate-caveats*/}

* Function `set` **chỉ cập nhật biến state cho lần render *tiếp theo***. Nếu bạn đọc biến state sau khi gọi function `set`, [bạn vẫn sẽ nhận được giá trị cũ](#ive-updated-the-state-but-logging-gives-me-the-old-value) đang hiển thị trên màn hình trước khi gọi function.

* Nếu giá trị mới bạn cung cấp giống hệt với `state` hiện tại, theo xác định của phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React sẽ **bỏ qua việc re-render component và các component con của nó.** Đây là một tối ưu hóa. Mặc dù trong một số trường hợp React vẫn có thể cần gọi component của bạn trước khi bỏ qua các component con, điều này không nên ảnh hưởng đến code của bạn.

* React [batch các lần cập nhật state.](/learn/queueing-a-series-of-state-updates) React cập nhật màn hình **sau khi tất cả event handler đã chạy** và đã gọi các function `set` của chúng. Điều này ngăn nhiều lần re-render trong một event duy nhất. Trong trường hợp hiếm gặp khi bạn cần buộc React cập nhật màn hình sớm hơn, chẳng hạn để truy cập DOM, bạn có thể sử dụng [`flushSync`.](/reference/react-dom/flushSync)

* Function `set` có identity ổn định, vì vậy bạn thường thấy nó được bỏ qua khỏi các dependency của Effect, nhưng việc đưa nó vào sẽ không khiến Effect chạy. Nếu linter cho phép bạn bỏ qua một dependency mà không báo lỗi, bạn có thể an toàn làm vậy. [Tìm hiểu thêm về cách loại bỏ dependency của Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Việc gọi function `set` *trong khi render* chỉ được phép thực hiện bên trong component hiện đang được render. React sẽ loại bỏ output của component và ngay lập tức thử render lại component đó với state mới. Mẫu này hiếm khi cần thiết, nhưng bạn có thể dùng nó để **lưu thông tin từ các lần render trước**. [Xem một ví dụ bên dưới.](#storing-information-from-previous-renders)

* Trong Strict Mode, React sẽ **gọi updater function của bạn hai lần** để [giúp bạn phát hiện các thao tác không pure ngoài ý muốn.](#my-initializer-or-updater-function-runs-twice) Đây là hành vi chỉ có trong development và không ảnh hưởng đến production. Nếu updater function của bạn là pure (như yêu cầu), điều này sẽ không ảnh hưởng đến hành vi. Kết quả từ một trong hai lần gọi sẽ bị bỏ qua.

---

## Cách sử dụng {/*usage*/}

### Thêm state vào component {/*adding-state-to-a-component*/}

Gọi `useState` ở cấp cao nhất của component để khai báo một hoặc nhiều [biến state.](/learn/state-a-components-memory)

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

Quy ước là đặt tên cho các biến state như `[something, setSomething]` bằng cách sử dụng [array destructuring.](https://javascript.info/destructuring-assignment)

`useState` trả về một mảng gồm chính xác hai phần tử:

1. <CodeStep step={1}>state hiện tại</CodeStep> của biến state này, ban đầu được đặt thành <CodeStep step={3}>state ban đầu</CodeStep> mà bạn cung cấp.
2. <CodeStep step={2}>`set` function</CodeStep> cho phép bạn thay đổi nó thành bất kỳ giá trị nào khác để phản hồi tương tác.

Để cập nhật nội dung trên màn hình, hãy gọi function `set` với một state tiếp theo:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React sẽ lưu state tiếp theo, render lại component với các giá trị mới và cập nhật UI.

<Pitfall>

Việc gọi function `set` [**không** thay đổi state hiện tại trong đoạn code đang thực thi](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

Function này chỉ ảnh hưởng đến giá trị mà `useState` sẽ trả về bắt đầu từ lần render *tiếp theo*.

</Pitfall>

<Recipes titleText="Basic useState examples" titleId="examples-basic">

#### Counter (number) {/*counter-number*/}

Trong ví dụ này, biến state `count` chứa một number. Khi nhấp vào button, giá trị này tăng lên.

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
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Text field (string) {/*text-field-string*/}

Trong ví dụ này, biến state `text` chứa một string. Khi bạn nhập, `handleChange` đọc giá trị input mới nhất từ input DOM element của browser và gọi `setText` để cập nhật state. Nhờ đó, bạn có thể hiển thị `text` hiện tại bên dưới.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Checkbox (boolean) {/*checkbox-boolean*/}

Trong ví dụ này, biến state `liked` chứa một boolean. Khi bạn nhấp vào input, `setLiked` cập nhật biến state `liked` dựa trên việc checkbox input của browser có được chọn hay không. Biến `liked` được dùng để render văn bản bên dưới checkbox.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Form (two variables) {/*form-two-variables*/}

Bạn có thể khai báo nhiều hơn một biến state trong cùng một component. Mỗi biến state hoàn toàn độc lập.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Cập nhật state dựa trên state trước đó {/*updating-state-based-on-the-previous-state*/}

Giả sử `age` là `42`. Handler này gọi `setAge(age + 1)` ba lần:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

Tuy nhiên, sau một lần nhấp, `age` sẽ chỉ là `43` thay vì `45`! Đó là vì việc gọi hàm `set` [does not update](/learn/state-as-a-snapshot) biến trạng thái `age` trong đoạn code đang chạy. Vì vậy, mỗi lần gọi `setAge(age + 1)` đều trở thành `setAge(43)`.

Để giải quyết vấn đề này, **bạn có thể truyền một *hàm updater*** cho `setAge` thay vì trạng thái tiếp theo:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Ở đây, `a => a + 1` là hàm updater của bạn. Hàm này nhận <CodeStep step={1}>pending state</CodeStep> và tính toán <CodeStep step={2}>next state</CodeStep> từ đó.

React đặt các hàm updater của bạn vào một [queue.](/learn/queueing-a-series-of-state-updates) Sau đó, trong lần render tiếp theo, React sẽ gọi chúng theo đúng thứ tự:

1. `a => a + 1` sẽ nhận `42` làm trạng thái đang chờ xử lý và trả về `43` làm trạng thái tiếp theo.
1. `a => a + 1` sẽ nhận `43` làm trạng thái đang chờ xử lý và trả về `44` làm trạng thái tiếp theo.
1. `a => a + 1` sẽ nhận `44` làm trạng thái đang chờ xử lý và trả về `45` làm trạng thái tiếp theo.

Không còn bản cập nhật nào khác trong hàng đợi, vì vậy cuối cùng React sẽ lưu `45` làm trạng thái hiện tại.

Theo quy ước, người ta thường đặt tên đối số trạng thái đang chờ xử lý theo chữ cái đầu tiên của tên biến trạng thái, chẳng hạn như `a` cho `age`. Tuy nhiên, bạn cũng có thể đặt tên là `prevAge` hoặc bất kỳ tên nào khác mà bạn thấy dễ hiểu hơn.

Trong môi trường development, React có thể [call your updaters twice](#my-initializer-or-updater-function-runs-twice) để xác minh rằng chúng là [pure.](/learn/keeping-components-pure)

<DeepDive>

#### Có phải luôn ưu tiên sử dụng updater không? {/*is-using-an-updater-always-preferred*/}

Bạn có thể nghe khuyến nghị rằng luôn nên viết code như `setAge(a => a + 1)` nếu trạng thái bạn đang thiết lập được tính toán từ trạng thái trước đó. Cách này không gây hại, nhưng cũng không phải lúc nào cũng cần thiết.

Trong hầu hết các trường hợp, hai cách tiếp cận này không có gì khác biệt. React luôn đảm bảo rằng đối với các thao tác có chủ đích của người dùng, chẳng hạn như nhấp chuột, biến trạng thái `age` sẽ được cập nhật trước lần nhấp tiếp theo. Điều này có nghĩa là handler xử lý nhấp chuột không có nguy cơ nhìn thấy `age` "cũ" ở đầu event handler.

Tuy nhiên, nếu bạn thực hiện nhiều lần cập nhật trong cùng một event, các updater có thể hữu ích. Chúng cũng hữu ích nếu việc truy cập trực tiếp vào biến trạng thái gây bất tiện (bạn có thể gặp trường hợp này khi tối ưu hóa việc re-render).

Nếu bạn ưu tiên tính nhất quán hơn cú pháp dài hơn một chút, việc luôn viết updater khi trạng thái bạn đang thiết lập được tính toán từ trạng thái trước đó là hoàn toàn hợp lý. Nếu trạng thái đó được tính toán từ trạng thái trước đó của một biến trạng thái *khác*, bạn có thể muốn gộp chúng vào một object và [use a reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="The difference between passing an updater and passing the next state directly" titleId="examples-updater">

#### Truyền hàm updater {/*passing-the-updater-function*/}

Ví dụ này truyền hàm updater, vì vậy nút "+3" hoạt động.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Truyền trực tiếp trạng thái tiếp theo {/*passing-the-next-state-directly*/}

Ví dụ này **không** truyền hàm updater, vì vậy nút "+3" **không hoạt động như mong đợi**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Cập nhật object và array trong state {/*updating-objects-and-arrays-in-state*/}

Bạn có thể đưa object và array vào state. Trong React, state được xem là chỉ đọc, vì vậy **bạn nên *thay thế* object hiện có thay vì *mutate* nó**. Ví dụ, nếu bạn có một object `form` trong state, đừng mutate nó:

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

Thay vào đó, hãy thay thế toàn bộ object bằng cách tạo một object mới:

```js
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: 'Taylor'
});
```

Đọc [updating objects in state](/learn/updating-objects-in-state) và [updating arrays in state](/learn/updating-arrays-in-state) để tìm hiểu thêm.

<Recipes titleText="Examples of objects and arrays in state" titleId="examples-objects">

#### Form (object) {/*form-object*/}

Trong ví dụ này, biến trạng thái `form` chứa một object. Mỗi input có một change handler gọi `setForm` với trạng thái tiếp theo của toàn bộ form. Cú pháp spread `{ ...form }` đảm bảo object trạng thái được thay thế thay vì bị mutate.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Form (nested object) {/*form-nested-object*/}

Trong ví dụ này, state có cấu trúc lồng nhau sâu hơn. Khi cập nhật state lồng nhau, bạn cần tạo một bản sao của object đang được cập nhật, cũng như mọi object "chứa" nó trên đường đi lên. Đọc [updating a nested object](/learn/updating-objects-in-state#updating-a-nested-object) để tìm hiểu thêm.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### List (array) {/*list-array*/}

Trong ví dụ này, biến trạng thái `todos` chứa một array. Mỗi button handler gọi `setTodos` với phiên bản tiếp theo của array đó. Cú pháp spread `[...todos]`, `todos.map()` và `todos.filter()` đảm bảo array trạng thái được thay thế thay vì bị mutate.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Viết logic cập nhật ngắn gọn với Immer {/*writing-concise-update-logic-with-immer*/}

Nếu việc cập nhật array và object mà không mutate khiến bạn cảm thấy rườm rà, bạn có thể sử dụng một thư viện như [Immer](https://github.com/immerjs/use-immer) để giảm code lặp lại. Immer cho phép bạn viết code ngắn gọn như thể đang mutate object, nhưng bên dưới, thư viện thực hiện các cập nhật immutable:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Tránh tạo lại state ban đầu {/*avoiding-recreating-the-initial-state*/}

React lưu state ban đầu một lần và bỏ qua state đó trong các lần render tiếp theo.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Mặc dù kết quả của `createInitialTodos()` chỉ được sử dụng cho lần render ban đầu, bạn vẫn đang gọi hàm này trong mỗi lần render. Điều này có thể gây lãng phí nếu hàm tạo ra các array lớn hoặc thực hiện những phép tính tốn kém.

Để giải quyết vấn đề này, thay vào đó, bạn có thể **truyền nó dưới dạng hàm _initializer_** cho `useState`:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Lưu ý rằng bạn đang truyền `createInitialTodos`, tức là *bản thân hàm*, chứ không phải `createInitialTodos()`, tức là kết quả của việc gọi hàm đó. Nếu bạn truyền một hàm cho `useState`, React sẽ chỉ gọi hàm đó trong quá trình khởi tạo.

Trong môi trường development, React có thể [call your initializers twice](#my-initializer-or-updater-function-runs-twice) để xác minh rằng chúng là [pure.](/learn/keeping-components-pure)

<Recipes titleText="The difference between passing an initializer and passing the initial state directly" titleId="examples-initializer">

#### Truyền hàm initializer {/*passing-the-initializer-function*/}

Ví dụ này truyền hàm initializer, vì vậy hàm `createInitialTodos` chỉ chạy trong quá trình khởi tạo. Hàm không chạy khi component re-render, chẳng hạn như khi bạn nhập vào input.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Truyền trực tiếp state ban đầu {/*passing-the-initial-state-directly*/}

Ví dụ này **không** truyền hàm initializer, vì vậy hàm `createInitialTodos` chạy trong mỗi lần render, chẳng hạn như khi bạn nhập vào input. Không có khác biệt nào có thể quan sát được về hành vi, nhưng code này kém hiệu quả hơn.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Đặt lại state bằng key {/*resetting-state-with-a-key*/}

Bạn sẽ thường gặp thuộc tính `key` khi [rendering lists.](/learn/rendering-lists) Tuy nhiên, thuộc tính này còn có một mục đích khác.

Bạn có thể **đặt lại state của một component bằng cách truyền một `key` khác cho component đó.** Trong ví dụ này, nút Reset thay đổi biến trạng thái `version`, rồi chúng ta truyền biến này làm `key` cho `Form`. Khi `key` thay đổi, React tạo lại component `Form` (và tất cả component con của nó) từ đầu, vì vậy state của nó được đặt lại.

Đọc [preserving and resetting state](/learn/preserving-and-resetting-state) để tìm hiểu thêm.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Lưu trữ thông tin từ các lần render trước {/*storing-information-from-previous-renders*/}

Thông thường, bạn sẽ cập nhật state trong các event handler. Tuy nhiên, trong một số trường hợp hiếm gặp, bạn có thể muốn điều chỉnh state để phản hồi việc render — chẳng hạn như khi một prop thay đổi.

Trong hầu hết các trường hợp, bạn không cần làm việc này:

* **Nếu giá trị bạn cần có thể được tính hoàn toàn từ các props hiện tại hoặc state khác, [loại bỏ hoàn toàn state dư thừa đó.](/learn/choosing-the-state-structure#avoid-redundant-state)** Nếu bạn lo rằng việc tính toán lại xảy ra quá thường xuyên, [`useMemo` Hook](/reference/react/useMemo) có thể giúp.
* Nếu bạn muốn reset state của toàn bộ cây component, [truyền một `key` khác vào component của bạn.](#resetting-state-with-a-key)
* Nếu có thể, hãy cập nhật tất cả state liên quan trong các event handler.

Trong trường hợp hiếm gặp khi không trường hợp nào ở trên áp dụng được, bạn có thể sử dụng một pattern để cập nhật state dựa trên các giá trị đã được render cho đến thời điểm hiện tại, bằng cách gọi một hàm `set` trong khi component đang render.

Dưới đây là một ví dụ. Component `CountLabel` này hiển thị prop `count` được truyền vào:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Giả sử bạn muốn hiển thị liệu counter đã *tăng hay giảm* kể từ lần thay đổi gần nhất. Prop `count` không cho bạn biết điều này -- bạn cần theo dõi giá trị trước đó của nó. Thêm biến state `prevCount` để theo dõi giá trị đó. Thêm một biến state khác có tên `trend` để lưu việc count đã tăng hay giảm. So sánh `prevCount` với `count`, và nếu chúng không bằng nhau, hãy cập nhật cả `prevCount` và `trend`. Bây giờ bạn có thể hiển thị cả prop count hiện tại và *cách nó đã thay đổi kể từ lần render gần nhất*.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Lưu ý rằng nếu bạn gọi một hàm `set` trong khi render, lệnh gọi đó phải nằm bên trong một điều kiện như `prevCount !== count`, và bên trong điều kiện phải có một lệnh gọi như `setPrevCount(count)`. Nếu không, component của bạn sẽ re-render trong một vòng lặp cho đến khi bị crash. Ngoài ra, bạn chỉ có thể cập nhật state của component *đang được render* theo cách này. Việc gọi hàm `set` của *một* component khác trong khi render là một lỗi. Cuối cùng, lệnh gọi `set` của bạn vẫn phải [cập nhật state mà không mutation](#updating-objects-and-arrays-in-state) -- điều này không có nghĩa là bạn có thể vi phạm các quy tắc khác của [pure function.](/learn/keeping-components-pure)

Pattern này có thể khó hiểu và thường nên tránh. Tuy nhiên, nó vẫn tốt hơn việc cập nhật state trong một effect. Khi bạn gọi hàm `set` trong lúc render, React sẽ re-render component đó ngay sau khi component của bạn kết thúc bằng câu lệnh `return`, và trước khi render các children. Nhờ vậy, children không cần phải render hai lần. Phần còn lại của component function vẫn sẽ được thực thi (và kết quả sẽ bị loại bỏ). Nếu điều kiện của bạn nằm sau tất cả các lệnh gọi Hook, bạn có thể thêm một `return;` sớm hơn để khởi động lại việc render sớm hơn.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi đã cập nhật state, nhưng việc logging lại cho giá trị cũ {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Việc gọi hàm `set` **không thay đổi state trong code đang chạy**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

Đó là vì [state hoạt động như một snapshot.](/learn/state-as-a-snapshot) Việc cập nhật state yêu cầu một lần render khác với giá trị state mới, nhưng không ảnh hưởng đến biến JavaScript `count` trong event handler đang chạy.

Nếu cần sử dụng state tiếp theo, bạn có thể lưu state đó vào một biến trước khi truyền biến này cho hàm `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### Tôi đã cập nhật state, nhưng màn hình không cập nhật {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React sẽ **bỏ qua việc cập nhật của bạn nếu state tiếp theo bằng state trước đó,** theo xác định của phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Điều này thường xảy ra khi bạn trực tiếp thay đổi một object hoặc array trong state:

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

Bạn đã mutate một object `obj` hiện có rồi truyền object đó trở lại cho `setObj`, nên React đã bỏ qua việc cập nhật. Để khắc phục, bạn cần đảm bảo luôn [_thay thế_ các object và array trong state thay vì _mutate_ chúng](#updating-objects-and-arrays-in-state):

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### Tôi gặp lỗi: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Bạn có thể gặp lỗi với thông báo: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Thông thường, điều này có nghĩa là bạn đang vô điều kiện set state *trong lúc render*, khiến component đi vào một vòng lặp: render, set state (khiến component render), render, set state (khiến component render), và cứ tiếp tục như vậy. Rất thường gặp, nguyên nhân là do chỉ định event handler sai:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Nếu không tìm được nguyên nhân của lỗi này, hãy nhấp vào mũi tên bên cạnh lỗi trong console và xem JavaScript stack để tìm lệnh gọi hàm `set` cụ thể gây ra lỗi.

---

### Hàm initializer hoặc updater của tôi chạy hai lần {/*my-initializer-or-updater-function-runs-twice*/}

Trong [Strict Mode](/reference/react/StrictMode), React sẽ gọi một số hàm của bạn hai lần thay vì một lần:

```js {2,5-6,11-12}
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

Đây là hành vi được mong đợi và không nên làm hỏng code của bạn.

Hành vi **chỉ xảy ra trong development** này giúp bạn [giữ cho các component pure.](/learn/keeping-components-pure) React sử dụng kết quả của một trong các lần gọi và bỏ qua kết quả của lần gọi còn lại. Miễn là component, initializer và updater function của bạn là pure, điều này sẽ không ảnh hưởng đến logic. Tuy nhiên, nếu chúng vô tình không pure, việc này giúp bạn nhận ra các lỗi.

Ví dụ, updater function không pure này mutate một array trong state:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

Vì React gọi updater function của bạn hai lần, bạn sẽ thấy todo được thêm hai lần, nhờ đó biết rằng có lỗi. Trong ví dụ này, bạn có thể khắc phục lỗi bằng cách [thay thế array thay vì mutate nó](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

Bây giờ updater function này đã pure, việc gọi nó thêm một lần không tạo ra khác biệt nào về hành vi. Đây là lý do tại sao việc React gọi nó hai lần lại giúp bạn tìm ra lỗi. **Chỉ component, initializer và updater function mới cần phải pure.** Event handler không cần pure, vì vậy React sẽ không bao giờ gọi event handler của bạn hai lần.

Đọc [giữ cho các component pure](/learn/keeping-components-pure) để tìm hiểu thêm.

---

### Tôi đang cố set state thành một function, nhưng function lại được gọi {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

Bạn không thể đưa một function vào state theo cách này:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Vì bạn đang truyền một function, React giả định rằng `someFunction` là một [initializer function](#avoiding-recreating-the-initial-state), còn `someOtherFunction` là một [updater function](#updating-state-based-on-the-previous-state), nên React cố gọi chúng và lưu kết quả. Để thực sự *lưu* một function, bạn phải đặt `() =>` trước function đó trong cả hai trường hợp. Khi đó React sẽ lưu các function mà bạn truyền vào.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```