---
title: Trích xuất logic state vào một reducer
---

<Intro>

Các component có nhiều cập nhật state nằm rải rác trong nhiều event handler có thể trở nên khó quản lý. Trong những trường hợp này, bạn có thể tập trung toàn bộ logic cập nhật state bên ngoài component vào một hàm duy nhất, gọi là _reducer._

</Intro>

<YouWillLearn>

- Reducer function là gì
- Cách refactor `useState` thành `useReducer`
- Khi nào nên sử dụng reducer
- Cách viết reducer tốt

</YouWillLearn>

## Tập trung logic state bằng reducer {/*consolidate-state-logic-with-a-reducer*/}

Khi component trở nên phức tạp hơn, bạn sẽ khó có thể nhìn nhanh và thấy được tất cả những cách khác nhau mà state của component được cập nhật. Ví dụ: component `TaskApp` dưới đây lưu một mảng `tasks` trong state và sử dụng ba event handler khác nhau để thêm, xóa và chỉnh sửa task:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Mỗi event handler đều gọi `setTasks` để cập nhật state. Khi component này phát triển, lượng logic state nằm rải rác bên trong nó cũng tăng theo. Để giảm độ phức tạp này và giữ toàn bộ logic ở một nơi dễ truy cập, bạn có thể chuyển logic state đó vào một hàm duy nhất bên ngoài component, **gọi là "reducer".**

Reducer là một cách khác để xử lý state. Bạn có thể chuyển từ `useState` sang `useReducer` qua ba bước:

1. **Chuyển** từ việc thiết lập state sang dispatch action.
2. **Viết** một reducer function.
3. **Sử dụng** reducer trong component.

### Bước 1: Chuyển từ thiết lập state sang dispatch action {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Hiện tại, các event handler của bạn chỉ định _phải làm gì_ bằng cách thiết lập state:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Hãy xóa toàn bộ logic thiết lập state. Khi đó, bạn còn lại ba event handler:

- `handleAddTask(text)` được gọi khi người dùng nhấn "Add".
- `handleChangeTask(task)` được gọi khi người dùng chuyển đổi một task hoặc nhấn "Save".
- `handleDeleteTask(taskId)` được gọi khi người dùng nhấn "Delete".

Quản lý state bằng reducer hơi khác so với việc trực tiếp thiết lập state. Thay vì nói cho React biết "phải làm gì" bằng cách thiết lập state, bạn chỉ định "người dùng vừa làm gì" bằng cách dispatch "action" từ các event handler. (Logic cập nhật state sẽ nằm ở nơi khác!) Vì vậy, thay vì "thiết lập `tasks`" thông qua event handler, bạn dispatch action "đã thêm/đã thay đổi/đã xóa một task". Cách này mô tả rõ hơn ý định của người dùng.

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

Object bạn truyền vào `dispatch` được gọi là một "action":

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" object:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

Đó là một JavaScript object thông thường. Bạn quyết định đưa gì vào đó, nhưng nhìn chung, object này nên chứa thông tin tối thiểu về _điều đã xảy ra_. (Bạn sẽ thêm function `dispatch` ở bước sau.)

<Note>

Một action object có thể có bất kỳ cấu trúc nào.

Theo quy ước, action thường có một chuỗi `type` mô tả điều đã xảy ra, đồng thời truyền mọi thông tin bổ sung trong các field khác. `type` mang tính cụ thể đối với từng component, vì vậy trong ví dụ này, `'added'` hoặc `'added_task'` đều phù hợp. Hãy chọn một tên thể hiện điều đã xảy ra!

```js
dispatch({
  // specific to component
  type: 'what_happened',
  // other fields go here
});
```

</Note>

### Bước 2: Viết một reducer function {/*step-2-write-a-reducer-function*/}

Reducer function là nơi bạn đặt logic state. Hàm này nhận hai đối số: state hiện tại và action object, sau đó trả về state tiếp theo:

```js
function yourReducer(state, action) {
  // return next state for React to set
}
```

React sẽ đặt state thành giá trị mà bạn trả về từ reducer.

Để chuyển logic thiết lập state từ các event handler sang một reducer function trong ví dụ này, bạn sẽ:

1. Khai báo state hiện tại (`tasks`) làm đối số thứ nhất.
2. Khai báo action object `action` làm đối số thứ hai.
3. Trả về state _tiếp theo_ từ reducer (giá trị mà React sẽ dùng để thiết lập state).

Dưới đây là toàn bộ logic thiết lập state đã được chuyển vào một reducer function:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

Vì reducer function nhận state (`tasks`) làm đối số, bạn có thể **khai báo nó bên ngoài component.** Điều này làm giảm mức độ thụt lề và có thể giúp code dễ đọc hơn.

<Note>

Đoạn code trên sử dụng các câu lệnh if/else, nhưng theo quy ước, người ta thường sử dụng [switch statements](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) bên trong reducer. Kết quả là như nhau, nhưng switch statement có thể dễ đọc hơn khi nhìn lướt qua.

Chúng ta sẽ sử dụng chúng trong phần còn lại của tài liệu như sau:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

Chúng tôi khuyến nghị đặt mỗi block `case` bên trong cặp dấu ngoặc nhọn `{` và `}`, để các biến được khai báo bên trong những `case` khác nhau không xung đột với nhau. Ngoài ra, một `case` thường nên kết thúc bằng `return`. Nếu bạn quên `return`, code sẽ "rơi xuống" `case` tiếp theo, điều này có thể dẫn đến lỗi!

Nếu bạn chưa quen với switch statement, sử dụng if/else hoàn toàn không có vấn đề gì.

</Note>

<DeepDive>

#### Tại sao reducer lại được gọi như vậy? {/*why-are-reducers-called-this-way*/}

Mặc dù reducer có thể "giảm" lượng code bên trong component, tên gọi này thực ra bắt nguồn từ thao tác [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) mà bạn có thể thực hiện trên các array.

Thao tác `reduce()` cho phép bạn lấy một array và "tích lũy" nhiều giá trị thành một giá trị duy nhất:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

Function bạn truyền vào `reduce` được gọi là một "reducer". Function này nhận _kết quả tính đến hiện tại_ và _item hiện tại_, sau đó trả về _kết quả tiếp theo_. React reducer cũng hoạt động theo cùng ý tưởng: chúng nhận _state tính đến hiện tại_ và _action_, rồi trả về _state tiếp theo_. Theo cách này, chúng tích lũy các action theo thời gian thành state.

Bạn thậm chí có thể sử dụng method `reduce()` với một `initialState` và một array gồm `actions` để tính state cuối cùng bằng cách truyền reducer function của bạn vào đó:

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

Có lẽ bạn sẽ không cần tự làm điều này, nhưng đây cũng tương tự như những gì React thực hiện!

</DeepDive>

### Bước 3: Sử dụng reducer trong component {/*step-3-use-the-reducer-from-your-component*/}

Cuối cùng, bạn cần kết nối `tasksReducer` với component của mình. Import `useReducer` Hook từ React:

```js
import { useReducer } from 'react';
```

Sau đó, bạn có thể thay thế `useState`:

```js
const [tasks, setTasks] = useState(initialTasks);
```

bằng `useReducer` như sau:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` Hook tương tự như `useState`—bạn phải truyền vào một state ban đầu, và nó trả về một giá trị state cùng một cách để thiết lập state (trong trường hợp này là dispatch function). Tuy nhiên, nó có một chút khác biệt.

`useReducer` Hook nhận hai đối số:

1. Một reducer function
2. Một state ban đầu

Và trả về:

1. Một giá trị state
2. Một dispatch function (để "dispatch" action của người dùng đến reducer)

Bây giờ mọi thứ đã được kết nối hoàn chỉnh! Ở đây, reducer được khai báo ở cuối file component:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Nếu muốn, bạn thậm chí có thể chuyển reducer sang một file khác:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Logic của component có thể dễ đọc hơn khi bạn tách biệt các mối quan tâm như vậy. Bây giờ, các event handler chỉ chỉ định _điều đã xảy ra_ bằng cách dispatch action, còn reducer function sẽ quyết định _cách state được cập nhật_ để phản hồi các action đó.

## So sánh `useState` và `useReducer` {/*comparing-usestate-and-usereducer*/}

Reducer không phải không có nhược điểm! Dưới đây là một vài cách để bạn so sánh chúng:

- **Kích thước code:** Nhìn chung, với `useState`, bạn phải viết ít code hơn ngay từ đầu. Với `useReducer`, bạn phải viết cả một hàm reducer _và_ các action dispatch. Tuy nhiên, `useReducer` có thể giúp giảm lượng code nếu nhiều event handler sửa đổi state theo cách tương tự.
- **Khả năng đọc:** `useState` rất dễ đọc khi các thao tác cập nhật state đơn giản. Khi chúng trở nên phức tạp hơn, chúng có thể làm code của component phình to và khó xem nhanh. Trong trường hợp này, `useReducer` cho phép bạn tách riêng một cách rõ ràng _cách thức_ logic cập nhật hoạt động khỏi _điều đã xảy ra_ trong các event handler.
- **Debug:** Khi bạn gặp lỗi với `useState`, có thể khó xác định _state đã được thiết lập sai ở đâu_ và _vì sao_. Với `useReducer`, bạn có thể thêm một console log vào reducer để xem mọi lần cập nhật state và _lý do_ nó xảy ra (do `action` nào). Nếu mỗi `action` đều đúng, bạn sẽ biết rằng lỗi nằm trong chính logic của reducer. Tuy nhiên, bạn phải lần theo nhiều code hơn so với `useState`.
- **Testing:** Reducer là một pure function không phụ thuộc vào component của bạn. Điều này có nghĩa là bạn có thể export và test riêng nó một cách độc lập. Mặc dù nhìn chung, tốt nhất là nên test các component trong một môi trường thực tế hơn, nhưng với logic cập nhật state phức tạp, việc xác nhận rằng reducer trả về một state cụ thể với một state ban đầu và action cụ thể có thể rất hữu ích.
- **Sở thích cá nhân:** Một số người thích reducer, những người khác thì không. Điều đó hoàn toàn ổn. Đây là vấn đề về sở thích. Bạn luôn có thể chuyển đổi qua lại giữa `useState` và `useReducer`: chúng tương đương nhau!

Chúng tôi khuyên bạn nên dùng reducer nếu thường xuyên gặp lỗi do cập nhật state không chính xác trong một component nào đó và muốn đưa thêm cấu trúc vào code của component. Bạn không cần dùng reducer cho mọi thứ: hãy thoải mái kết hợp chúng! Bạn thậm chí có thể `useState` và `useReducer` trong cùng một component.

## Viết reducer hiệu quả {/*writing-reducers-well*/}

Hãy ghi nhớ hai mẹo sau khi viết reducer:

- **Reducer phải là pure function.** Tương tự như [các hàm cập nhật state](/learn/queueing-a-series-of-state-updates), reducer chạy trong quá trình render! (Các action được xếp hàng cho đến lần render tiếp theo.) Điều này có nghĩa là reducer [phải là pure function](/learn/keeping-components-pure)—cùng input luôn phải cho ra cùng output. Chúng không được gửi request, lên lịch timeout hoặc thực hiện bất kỳ side effect nào (các thao tác ảnh hưởng đến những thứ bên ngoài component). Chúng nên cập nhật [object](/learn/updating-objects-in-state) và [array](/learn/updating-arrays-in-state) mà không thực hiện mutation.
- **Mỗi action mô tả một tương tác người dùng duy nhất, ngay cả khi tương tác đó dẫn đến nhiều thay đổi trong dữ liệu.** Ví dụ, nếu người dùng nhấn "Reset" trên một form có năm trường được quản lý bởi reducer, việc dispatch một action `reset_form` sẽ hợp lý hơn so với việc dispatch năm action `set_field` riêng biệt. Nếu bạn log mọi action trong reducer, log đó phải đủ rõ để bạn tái hiện những tương tác hoặc phản hồi nào đã xảy ra và theo thứ tự nào. Điều này giúp debug dễ hơn!

## Viết reducer ngắn gọn với Immer {/*writing-concise-reducers-with-immer*/}

Cũng giống như khi [cập nhật object](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) và [array](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) trong state thông thường, bạn có thể dùng thư viện Immer để viết reducer ngắn gọn hơn. Ở đây, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) cho phép bạn mutate state bằng phép gán `push` hoặc `arr[i] =`:

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
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
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

Reducer phải là pure function, vì vậy không được mutate state. Nhưng Immer cung cấp cho bạn một object `draft` đặc biệt, an toàn để mutate. Ở bên trong, Immer sẽ tạo một bản sao state với những thay đổi bạn đã thực hiện trên `draft`. Đây là lý do các reducer được quản lý bởi `useImmerReducer` có thể mutate đối số đầu tiên và không cần return state.

<Recap>

- Để chuyển từ `useState` sang `useReducer`:
  1. Dispatch action từ các event handler.
  2. Viết một hàm reducer trả về state tiếp theo dựa trên state và action đã cho.
  3. Thay thế `useState` bằng `useReducer`.
- Reducer yêu cầu bạn viết nhiều code hơn một chút, nhưng chúng giúp debug và testing dễ dàng hơn.
- Reducer phải là pure function.
- Mỗi action mô tả một tương tác người dùng duy nhất.
- Dùng Immer nếu bạn muốn viết reducer theo kiểu mutation.

</Recap>

<Challenges>

#### Dispatch action từ các event handler {/*dispatch-actions-from-event-handlers*/}

Hiện tại, các event handler trong `ContactList.js` và `Chat.js` có các comment `// TODO`. Đây là lý do việc nhập vào input không hoạt động và việc nhấp vào các button không thay đổi người nhận đã chọn.

Hãy thay thế hai `// TODO` này bằng code để `dispatch` các action tương ứng. Để xem cấu trúc dự kiến và kiểu của các action, hãy kiểm tra reducer trong `messengerReducer.js`. Reducer đã được viết sẵn nên bạn không cần thay đổi nó. Bạn chỉ cần dispatch các action trong `ContactList.js` và `Chat.js`.

<Hint>

Hàm `dispatch` đã có sẵn trong cả hai component này vì nó được truyền vào dưới dạng prop. Vì vậy, bạn cần gọi `dispatch` với object action tương ứng.

Để kiểm tra cấu trúc của object action, bạn có thể xem reducer và xác định những trường `action` nào mà nó yêu cầu. Ví dụ, case `changed_selection` trong reducer có dạng như sau:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

Điều này có nghĩa là object action của bạn phải có một `type: 'changed_selection'`. Bạn cũng thấy `action.contactId` được sử dụng, vì vậy bạn cần thêm một thuộc tính `contactId` vào action.

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Từ code của reducer, bạn có thể suy ra rằng các action cần có dạng như sau:

```js
// When the user presses "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// When user types "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

Dưới đây là ví dụ đã được cập nhật để dispatch các message tương ứng:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### Xóa input khi gửi message {/*clear-the-input-on-sending-a-message*/}

Hiện tại, việc nhấn "Send" không thực hiện điều gì. Hãy thêm một event handler vào button "Send" để:

1. Hiển thị một `alert` cùng với email của người nhận và message.
2. Xóa input message.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Có một vài cách bạn có thể thực hiện việc này trong event handler của button "Send". Một cách là hiển thị alert rồi dispatch một action `edited_message` với một `message` rỗng:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Cách này hoạt động và sẽ xóa input khi bạn nhấn "Send".

Tuy nhiên, _theo góc nhìn của người dùng_, gửi một message là một action khác với chỉnh sửa field. Để phản ánh điều đó, thay vào đó bạn có thể tạo một action _mới_ có tên `sent_message` và xử lý nó riêng trong reducer:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Hành vi cuối cùng là như nhau. Nhưng hãy nhớ rằng các action type lý tưởng nhất nên mô tả "người dùng đã làm gì" thay vì "bạn muốn state thay đổi như thế nào". Điều này giúp bạn dễ dàng bổ sung thêm tính năng sau này.

Với cả hai cách, điều quan trọng là bạn **không** đặt `alert` bên trong reducer. Reducer phải là một pure function—nó chỉ nên tính toán state tiếp theo. Nó không được "thực hiện" bất kỳ việc gì, bao gồm cả việc hiển thị message cho người dùng. Việc đó phải diễn ra trong event handler. (Để giúp phát hiện những lỗi như vậy, React sẽ gọi reducer nhiều lần trong Strict Mode. Đây là lý do nếu bạn đặt alert trong reducer, nó sẽ hiển thị hai lần.)

</Solution>

#### Khôi phục giá trị input khi chuyển đổi giữa các tab {/*restore-input-values-when-switching-between-tabs*/}

Trong ví dụ này, việc chuyển đổi giữa những người nhận khác nhau luôn xóa text input:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Clears the input
  };
```

Điều này là do bạn không muốn dùng chung một message draft giữa nhiều người nhận. Nhưng sẽ tốt hơn nếu app của bạn "ghi nhớ" một draft riêng cho từng contact và khôi phục chúng khi bạn chuyển contact.

Nhiệm vụ của bạn là thay đổi cách cấu trúc state để ghi nhớ một message draft _cho mỗi contact_. Bạn sẽ cần thực hiện một vài thay đổi đối với reducer, state ban đầu và các component.

<Hint>

Bạn có thể cấu trúc state như sau:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Draft for contactId = 0
    1: 'Hello, Alice', // Draft for contactId = 1
  },
};
```

Cú pháp `[key]: value` [thuộc tính computed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) có thể giúp bạn cập nhật đối tượng `messages`:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Bạn sẽ cần cập nhật reducer để lưu trữ và cập nhật một bản nháp tin nhắn riêng cho từng liên hệ:

```js
// When the input is edited
case 'edited_message': {
  return {
    // Keep other state like selection
    ...state,
    messages: {
      // Keep messages for other contacts
      ...state.messages,
      // But change the selected contact's message
      [state.selectedId]: action.message
    }
  };
}
```

Bạn cũng sẽ cập nhật component `Messenger` để đọc tin nhắn của liên hệ hiện đang được chọn:

```js
const message = state.messages[state.selectedId];
```

Đây là lời giải hoàn chỉnh:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Đáng chú ý là bạn không cần thay đổi bất kỳ event handler nào để triển khai hành vi khác này. Nếu không có reducer, bạn sẽ phải thay đổi mọi event handler cập nhật state.

</Solution>

#### Triển khai `useReducer` từ đầu {/*implement-usereducer-from-scratch*/}

Trong các ví dụ trước, bạn đã import Hook `useReducer` từ React. Lần này, bạn sẽ tự triển khai _chính Hook `useReducer` này!_ Đây là một stub để giúp bạn bắt đầu. Phần này không nên cần quá 10 dòng code.

Để kiểm tra các thay đổi, hãy thử nhập nội dung vào input hoặc chọn một liên hệ.

<Hint>

Dưới đây là phác thảo chi tiết hơn về cách triển khai:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

Hãy nhớ rằng một hàm reducer nhận hai đối số—state hiện tại và object action—rồi trả về state tiếp theo. Bạn nên xử lý chúng như thế nào trong triển khai `dispatch`?

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Việc dispatch một action sẽ gọi reducer với state hiện tại và action đó, rồi lưu kết quả làm state tiếp theo. Trong code, điều này trông như sau:

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Mặc dù trong hầu hết trường hợp điều này không quan trọng, một cách triển khai chính xác hơn một chút sẽ trông như sau:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

Điều này là vì các action được dispatch sẽ được xếp hàng cho đến lần render tiếp theo, [tương tự như các hàm updater.](/learn/queueing-a-series-of-state-updates)

</Solution>

</Challenges>