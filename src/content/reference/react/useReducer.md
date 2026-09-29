---
title: useReducer
---

<Intro>

`useReducer` là một React Hook cho phép bạn thêm một [reducer](/learn/extracting-state-logic-into-a-reducer) vào component của mình.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

Gọi `useReducer` ở cấp cao nhất của component để quản lý state bằng một [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[Xem thêm ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `reducer`: Hàm reducer xác định cách state được cập nhật. Hàm này phải là pure, nên nhận state và action làm các đối số, đồng thời trả về state tiếp theo. State và action có thể thuộc bất kỳ kiểu nào.
* `initialArg`: Giá trị được dùng để tính toán state ban đầu. Giá trị này có thể thuộc bất kỳ kiểu nào. Cách tính state ban đầu từ giá trị đó phụ thuộc vào đối số `init` tiếp theo.
* **tùy chọn** `init`: Hàm initializer phải trả về state ban đầu. Nếu không được chỉ định, state ban đầu sẽ được đặt thành `initialArg`. Nếu không, state ban đầu sẽ được đặt thành kết quả của việc gọi `init(initialArg)`.

#### Giá trị trả về {/*returns*/}

`useReducer` trả về một mảng có chính xác hai giá trị:

1. State hiện tại. Trong lần render đầu tiên, state được đặt thành `init(initialArg)` hoặc `initialArg` (nếu không có `init`).
2. Hàm [`dispatch` function](#dispatch) cho phép bạn cập nhật state thành một giá trị khác và kích hoạt việc render lại.

#### Lưu ý {/*caveats*/}

* `useReducer` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc trong các Hook của riêng bạn. Bạn không thể gọi nó bên trong vòng lặp hoặc điều kiện. Nếu cần làm vậy, hãy tách thành một component mới và chuyển state vào đó.
* Hàm `dispatch` có identity ổn định, vì vậy bạn thường thấy nó được bỏ qua khỏi các dependency của Effect, nhưng việc bao gồm nó sẽ không khiến Effect chạy. Nếu linter cho phép bạn bỏ qua một dependency mà không báo lỗi thì bạn có thể an toàn làm vậy. [Tìm hiểu thêm về cách loại bỏ các dependency của Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* Trong Strict Mode, React sẽ **gọi reducer và initializer của bạn hai lần** để [giúp bạn phát hiện các tính không thuần khiết vô tình.](#my-reducer-or-initializer-function-runs-twice) Đây là hành vi chỉ có trong môi trường development và không ảnh hưởng đến production. Nếu reducer và initializer của bạn là pure (như yêu cầu), điều này sẽ không ảnh hưởng đến logic của bạn. Kết quả từ một trong các lần gọi sẽ bị bỏ qua.

---

### Hàm `dispatch` {/*dispatch*/}

Hàm `dispatch` được `useReducer` trả về cho phép bạn cập nhật state thành một giá trị khác và kích hoạt việc render lại. Bạn cần truyền action làm đối số duy nhất cho hàm `dispatch`:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React sẽ đặt state tiếp theo thành kết quả của việc gọi hàm `reducer` mà bạn đã cung cấp với `state` hiện tại và action bạn đã truyền vào `dispatch`.

#### Tham số {/*dispatch-parameters*/}

* `action`: Action được người dùng thực hiện. Action có thể thuộc bất kỳ kiểu nào. Theo quy ước, action thường là một object có thuộc tính `type` xác định action đó và tùy chọn thêm các thuộc tính khác chứa thông tin bổ sung.

#### Giá trị trả về {/*dispatch-returns*/}

Các hàm `dispatch` không có giá trị trả về.

#### Lưu ý {/*setstate-caveats*/}

* Hàm `dispatch` **chỉ cập nhật biến state cho lần render *tiếp theo***. Nếu bạn đọc biến state sau khi gọi hàm `dispatch`, [bạn vẫn sẽ nhận được giá trị cũ](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) đang hiển thị trên màn hình trước khi bạn gọi hàm.

* Nếu giá trị mới bạn cung cấp giống hệt với `state` hiện tại, theo xác định của phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React sẽ **bỏ qua việc render lại component và các component con của nó.** Đây là một tối ưu hóa. React vẫn có thể cần gọi component của bạn trước khi bỏ qua kết quả, nhưng điều này không nên ảnh hưởng đến code của bạn.

* React [gộp các lần cập nhật state.](/learn/queueing-a-series-of-state-updates) React cập nhật màn hình **sau khi tất cả các event handler đã chạy** và đã gọi các hàm `set` của chúng. Điều này ngăn nhiều lần render lại trong cùng một event. Trong trường hợp hiếm khi bạn cần buộc React cập nhật màn hình sớm hơn, chẳng hạn để truy cập DOM, bạn có thể sử dụng [`flushSync`.](/reference/react-dom/flushSync)

---

## Cách sử dụng {/*usage*/}

### Thêm reducer vào component {/*adding-a-reducer-to-a-component*/}

Gọi `useReducer` ở cấp cao nhất của component để quản lý state bằng một [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` trả về một mảng có chính xác hai phần tử:

1. <CodeStep step={1}>State hiện tại</CodeStep> của biến state này, ban đầu được đặt thành <CodeStep step={3}>state ban đầu</CodeStep> mà bạn đã cung cấp.
2. Hàm <CodeStep step={2}>`dispatch` function</CodeStep> cho phép bạn thay đổi state để phản hồi tương tác.

Để cập nhật nội dung trên màn hình, hãy gọi <CodeStep step={2}>`dispatch`</CodeStep> với một object biểu thị điều người dùng đã thực hiện, được gọi là một *action*:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React sẽ truyền state hiện tại và action vào <CodeStep step={4}>hàm reducer</CodeStep> của bạn. Reducer sẽ tính toán và trả về state tiếp theo. React sẽ lưu state tiếp theo đó, render component với state này và cập nhật UI.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` rất giống với [`useState`](/reference/react/useState), nhưng cho phép bạn chuyển logic cập nhật state từ các event handler vào một hàm duy nhất bên ngoài component. Đọc thêm về [việc lựa chọn giữa `useState` và `useReducer`.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### Viết hàm reducer {/*writing-the-reducer-function*/}

Hàm reducer được khai báo như sau:

```js
function reducer(state, action) {
  // ...
}
```

Sau đó, bạn cần điền code để tính toán và trả về state tiếp theo. Theo quy ước, cách thường dùng là viết hàm này dưới dạng một câu lệnh [`switch` .](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) Với mỗi `case` trong `switch`, hãy tính toán và trả về một state tiếp theo nào đó.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Action có thể có bất kỳ hình dạng nào. Theo quy ước, cách thường dùng là truyền các object có thuộc tính `type` xác định action. Object này nên bao gồm thông tin tối thiểu cần thiết mà reducer cần để tính toán state tiếp theo.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

Tên các action có phạm vi cục bộ trong component của bạn. [Mỗi action mô tả một tương tác đơn lẻ, ngay cả khi tương tác đó dẫn đến nhiều thay đổi trong dữ liệu.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) Hình dạng của state là tùy ý, nhưng thường sẽ là một object hoặc một mảng.

Đọc [tách logic state vào một reducer](/learn/extracting-state-logic-into-a-reducer) để tìm hiểu thêm.

<Pitfall>

State chỉ được đọc. Đừng sửa đổi bất kỳ object hoặc mảng nào trong state:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Don't mutate an object in state like this:
      state.age = state.age + 1;
      return state;
    }
```

Thay vào đó, hãy luôn trả về các object mới từ reducer:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Instead, return a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
```

Đọc [cập nhật object trong state](/learn/updating-objects-in-state) và [cập nhật mảng trong state](/learn/updating-arrays-in-state) để tìm hiểu thêm.

</Pitfall>

<Recipes titleText="Basic useReducer examples" titleId="examples-basic">

#### Form (object) {/*form-object*/}

Trong ví dụ này, reducer quản lý một object state có hai trường: `name` và `age`.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Danh sách Todo (mảng) {/*todo-list-array*/}

Trong ví dụ này, reducer quản lý một mảng các task. Mảng này cần được cập nhật [mà không mutation.](/learn/updating-arrays-in-state)

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

Nếu việc cập nhật các array và object mà không mutation khiến bạn cảm thấy tẻ nhạt, bạn có thể sử dụng một thư viện như [Immer](https://github.com/immerjs/use-immer#useimmerreducer) để giảm bớt code lặp lại. Immer cho phép bạn viết code ngắn gọn như thể đang mutation các object, nhưng bên dưới nó thực hiện các cập nhật immutable:

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

React lưu state ban đầu một lần và bỏ qua nó trong các lần render tiếp theo.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

Mặc dù kết quả của `createInitialState(username)` chỉ được sử dụng cho lần render đầu tiên, bạn vẫn đang gọi hàm này trong mỗi lần render. Điều này có thể gây lãng phí nếu nó tạo các array lớn hoặc thực hiện các phép tính tốn kém.

Để giải quyết vấn đề này, thay vào đó, bạn có thể **truyền nó dưới dạng hàm _initializer_** cho `useReducer` làm đối số thứ ba:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

Lưu ý rằng bạn đang truyền `createInitialState`, tức là *bản thân hàm*, chứ không phải `createInitialState()`, tức là kết quả của việc gọi hàm. Nhờ vậy, state ban đầu sẽ không được tạo lại sau khi khởi tạo.

Trong ví dụ trên, `createInitialState` nhận một đối số `username`. Nếu initializer của bạn không cần bất kỳ thông tin nào để tính toán state ban đầu, bạn có thể truyền `null` làm đối số thứ hai cho `useReducer`.

<Recipes titleText="The difference between passing an initializer and passing the initial state directly" titleId="examples-initializer">

#### Truyền hàm initializer {/*passing-the-initializer-function*/}

Ví dụ này truyền hàm initializer, vì vậy hàm `createInitialState` chỉ chạy trong quá trình khởi tạo. Hàm này không chạy khi component re-render, chẳng hạn như khi bạn nhập vào input.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
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

Ví dụ này **không** truyền hàm initializer, vì vậy hàm `createInitialState` chạy trong mỗi lần render, chẳng hạn như khi bạn nhập vào input. Không có khác biệt quan sát được về hành vi, nhưng code này kém hiệu quả hơn.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
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

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi đã dispatch một action, nhưng việc logging lại cho giá trị state cũ {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

Việc gọi hàm `dispatch` **không thay đổi state trong code đang chạy**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Request a re-render with 43
  console.log(state.age);  // Still 42!

  setTimeout(() => {
    console.log(state.age); // Also 42!
  }, 5000);
}
```

Đó là vì [state hoạt động như một snapshot.](/learn/state-as-a-snapshot) Việc cập nhật state yêu cầu một lần render khác với giá trị state mới, nhưng không ảnh hưởng đến biến JavaScript `state` trong event handler đang chạy hiện tại.

Nếu cần dự đoán giá trị state tiếp theo, bạn có thể tự tính toán bằng cách gọi reducer:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### Tôi đã dispatch một action, nhưng màn hình không cập nhật {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React sẽ **bỏ qua bản cập nhật của bạn nếu state tiếp theo bằng state trước đó,** theo xác định của phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Điều này thường xảy ra khi bạn thay đổi trực tiếp một object hoặc array trong state:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Wrong: mutating existing object
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Wrong: mutating existing object
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

Bạn đã mutate một object `state` hiện có và trả về nó, nên React bỏ qua bản cập nhật. Để khắc phục, bạn cần đảm bảo luôn [cập nhật các object trong state](/learn/updating-objects-in-state) và [cập nhật các array trong state](/learn/updating-arrays-in-state) thay vì mutate chúng:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### Một phần state của reducer trở thành undefined sau khi dispatch {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

Đảm bảo mọi nhánh `case` đều **sao chép tất cả các field hiện có** khi trả về state mới:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Don't forget this!
        age: state.age + 1
      };
    }
    // ...
```

Nếu không có `...state` ở trên, state tiếp theo được trả về sẽ chỉ chứa field `age` và không có gì khác.

---

### Toàn bộ state của reducer trở thành undefined sau khi dispatch {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

Nếu state bất ngờ trở thành `undefined`, có thể bạn đã quên `return` state trong một trong các case, hoặc type của action không khớp với bất kỳ câu lệnh `case` nào. Để tìm nguyên nhân, hãy throw một error bên ngoài `switch`:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Bạn cũng có thể sử dụng static type checker như TypeScript để phát hiện những lỗi này.

---

### Tôi gặp lỗi: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Bạn có thể gặp lỗi với nội dung: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Thông thường, điều này có nghĩa là bạn đang vô điều kiện dispatch một action *trong lúc render*, khiến component của bạn rơi vào vòng lặp: render, dispatch (gây ra một lần render), render, dispatch (gây ra một lần render), và cứ tiếp tục như vậy. Rất thường xuyên, nguyên nhân là do chỉ định event handler không đúng:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Nếu không thể tìm ra nguyên nhân của lỗi này, hãy nhấp vào mũi tên bên cạnh lỗi trong console và xem JavaScript stack để tìm lời gọi hàm `dispatch` cụ thể chịu trách nhiệm cho lỗi.

---

### Hàm reducer hoặc initializer của tôi chạy hai lần {/*my-reducer-or-initializer-function-runs-twice*/}

Trong [Strict Mode](/reference/react/StrictMode), React sẽ gọi các hàm reducer và initializer của bạn hai lần. Điều này không nên làm hỏng code của bạn.

Hành vi **chỉ xảy ra trong development** này giúp bạn [giữ cho các component pure.](/learn/keeping-components-pure) React sử dụng kết quả của một trong các lần gọi và bỏ qua kết quả của lần gọi còn lại. Miễn là component, initializer và reducer của bạn là pure, điều này sẽ không ảnh hưởng đến logic của bạn. Tuy nhiên, nếu chúng vô tình không pure, điều này sẽ giúp bạn nhận ra các lỗi.

Ví dụ, hàm reducer không pure này mutate một array trong state:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Mistake: mutating state
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

Vì React gọi hàm reducer của bạn hai lần, bạn sẽ thấy todo được thêm hai lần, từ đó biết rằng có lỗi. Trong ví dụ này, bạn có thể sửa lỗi bằng cách [thay array thay vì mutate nó](/learn/updating-arrays-in-state#adding-to-an-array):

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Correct: replacing with new state
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

Bây giờ hàm reducer này đã pure, nên việc gọi nó thêm một lần không tạo ra khác biệt về hành vi. Đây là lý do việc React gọi hàm này hai lần giúp bạn tìm ra lỗi. **Chỉ các hàm component, initializer và reducer cần pure.** Event handler không cần pure, nên React sẽ không bao giờ gọi event handler của bạn hai lần.

Đọc [giữ cho các component pure](/learn/keeping-components-pure) để tìm hiểu thêm.