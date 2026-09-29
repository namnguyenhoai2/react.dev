---
title: useContext
---

<Intro>

`useContext` là một React Hook cho phép bạn đọc và đăng ký nhận cập nhật từ [context](/learn/passing-data-deeply-with-context) trong component của mình.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Gọi `useContext` ở cấp cao nhất của component để đọc và đăng ký nhận cập nhật từ [context.](/learn/passing-data-deeply-with-context)

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `SomeContext`: Context mà bạn đã tạo trước đó bằng [`createContext`](/reference/react/createContext). Bản thân context không lưu giữ thông tin; nó chỉ biểu thị loại thông tin mà bạn có thể cung cấp hoặc đọc từ các component.

#### Giá trị trả về {/*returns*/}

`useContext` trả về giá trị context cho component đang gọi. Giá trị này được xác định bằng `value` được truyền đến `SomeContext` gần nhất phía trên component đang gọi trong cây. Nếu không có provider như vậy, giá trị được trả về sẽ là `defaultValue` mà bạn đã truyền khi [`createContext`](/reference/react/createContext) context đó. Giá trị trả về luôn được cập nhật. React tự động re-render các component đọc một context khi context đó thay đổi.

#### Lưu ý {/*caveats*/}

* Lệnh gọi `useContext()` trong một component không bị ảnh hưởng bởi các provider được trả về từ *chính component đó*. `<Context>` tương ứng **cần phải nằm *phía trên*** component thực hiện lệnh gọi `useContext()`.
* React **tự động re-render** tất cả children sử dụng một context cụ thể, bắt đầu từ provider nhận được `value` khác. Các giá trị trước và sau được so sánh bằng phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Việc bỏ qua re-render bằng [`memo`](/reference/react/memo) không ngăn children nhận các giá trị context mới nhất.
* Nếu build system của bạn tạo ra các module trùng lặp trong output (điều này có thể xảy ra với symlink), context có thể bị hỏng. Việc truyền một giá trị qua context chỉ hoạt động nếu `SomeContext` mà bạn dùng để cung cấp context và `SomeContext` mà bạn dùng để đọc context là ***chính xác* cùng một object**, theo phép so sánh `===`.

---

## Cách sử dụng {/*usage*/}


### Truyền dữ liệu sâu vào cây {/*passing-data-deeply-into-the-tree*/}

Gọi `useContext` ở cấp cao nhất của component để đọc và đăng ký nhận cập nhật từ [context.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

`useContext` trả về <CodeStep step={2}>giá trị context</CodeStep> của <CodeStep step={1}>context</CodeStep> mà bạn đã truyền vào. Để xác định giá trị context, React tìm kiếm trong cây component và tìm **context provider gần nhất ở phía trên** của context cụ thể đó.

Để truyền context đến một `Button`, hãy bọc nó hoặc một trong các component cha của nó bằng context provider tương ứng:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

Không quan trọng có bao nhiêu lớp component nằm giữa provider và `Button`. Khi một `Button` ở *bất kỳ đâu* bên trong `Form` gọi `useContext(ThemeContext)`, nó sẽ nhận được `"dark"` làm giá trị.

<Pitfall>

`useContext()` luôn tìm provider gần nhất *phía trên* component gọi nó. Nó tìm kiếm hướng lên trên và **không** xem xét các provider trong component mà từ đó bạn đang gọi `useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Cập nhật dữ liệu được truyền qua context {/*updating-data-passed-via-context*/}

Thông thường, bạn sẽ muốn context thay đổi theo thời gian. Để cập nhật context, hãy kết hợp nó với [state.](/reference/react/useState) Khai báo một state variable trong component cha và truyền state hiện tại xuống dưới dưới dạng <CodeStep step={2}>giá trị context</CodeStep> cho provider.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext>
  );
}
```

Bây giờ, mọi `Button` bên trong provider sẽ nhận được giá trị `theme` hiện tại. Nếu bạn gọi `setTheme` để cập nhật giá trị `theme` mà bạn truyền cho provider, tất cả component `Button` sẽ re-render với giá trị `'light'` mới.

<Recipes titleText="Examples of updating context" titleId="examples-basic">

#### Cập nhật một giá trị qua context {/*updating-a-value-via-context*/}

Trong ví dụ này, component `MyApp` lưu một state variable, sau đó state variable này được truyền đến provider `ThemeContext`. Việc chọn checkbox "Dark mode" sẽ cập nhật state. Thay đổi giá trị được cung cấp sẽ re-render tất cả component sử dụng context đó.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Lưu ý rằng `value="dark"` truyền chuỗi `"dark"`, nhưng `value={theme}` truyền giá trị của biến JavaScript `theme` bằng [dấu ngoặc nhọn JSX.](/learn/javascript-in-jsx-with-curly-braces) Dấu ngoặc nhọn cũng cho phép bạn truyền các giá trị context không phải là chuỗi.

<Solution />

#### Cập nhật một object qua context {/*updating-an-object-via-context*/}

Trong ví dụ này, có một state variable `currentUser` lưu một object. Bạn kết hợp `{ currentUser, setCurrentUser }` thành một object duy nhất và truyền xuống qua context bên trong `value={}`. Điều này cho phép bất kỳ component nào bên dưới, chẳng hạn như `LoginButton`, đọc cả `currentUser` và `setCurrentUser`, sau đó gọi `setCurrentUser` khi cần.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Nhiều context {/*multiple-contexts*/}

Trong ví dụ này có hai context độc lập. `ThemeContext` cung cấp theme hiện tại, là một chuỗi, trong khi `CurrentUserContext` lưu object biểu diễn user hiện tại.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Use dark mode
        </label>
      </CurrentUserContext>
    </ThemeContext>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Tách provider thành một component {/*extracting-providers-to-a-component*/}

Khi app phát triển, việc có một "pyramid" gồm các context gần root của app là điều thường thấy. Điều đó hoàn toàn không có vấn đề gì. Tuy nhiên, nếu bạn không thích cách lồng nhau này về mặt thẩm mỹ, bạn có thể tách các provider thành một component duy nhất. Trong ví dụ này, `MyProviders` ẩn phần "plumbing" và render các children được truyền vào bên trong những provider cần thiết. Lưu ý rằng state `theme` và `setTheme` là cần thiết trong chính `MyApp`, vì vậy `MyApp` vẫn sở hữu phần state đó.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext>
    </ThemeContext>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Mở rộng với context và reducer {/*scaling-up-with-context-and-a-reducer*/}

Trong các app lớn hơn, việc kết hợp context với một [reducer](/reference/react/useReducer) để tách logic liên quan đến một số state ra khỏi component là điều phổ biến. Trong ví dụ này, toàn bộ phần "wiring" được ẩn trong `TasksContext.js`, nơi chứa một reducer và hai context riêng biệt.

Đọc [hướng dẫn đầy đủ](/learn/scaling-up-with-reducer-and-context) về ví dụ này.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

</Recipes>

---

### Chỉ định giá trị mặc định dự phòng {/*specifying-a-fallback-default-value*/}

Nếu React không thể tìm thấy provider nào của <CodeStep step={1}>context</CodeStep> cụ thể đó trong cây component cha, giá trị context được `useContext()` trả về sẽ bằng <CodeStep step={3}>giá trị mặc định</CodeStep> mà bạn đã chỉ định khi [tạo context đó](/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

Giá trị mặc định **không bao giờ thay đổi**. Nếu muốn cập nhật context, hãy sử dụng nó cùng với state như đã [mô tả ở trên.](#updating-data-passed-via-context)

Thông thường, thay vì `null`, sẽ có một giá trị ý nghĩa hơn mà bạn có thể dùng làm mặc định, chẳng hạn như:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

Theo cách này, nếu bạn vô tình render một component mà không có provider tương ứng, component đó sẽ không bị lỗi. Điều này cũng giúp các component của bạn hoạt động tốt trong môi trường test mà không cần thiết lập quá nhiều provider trong các bài test.

Trong ví dụ bên dưới, button "Toggle theme" luôn có màu sáng vì nó **nằm ngoài mọi theme context provider** và giá trị theme context mặc định là `'light'`. Hãy thử chỉnh sửa theme mặc định thành `'dark'`.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Ghi đè context cho một phần của cây {/*overriding-context-for-a-part-of-the-tree*/}

Bạn có thể ghi đè context cho một phần của cây bằng cách bọc phần đó trong một provider có giá trị khác.

```js {3,5}
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

Bạn có thể lồng và ghi đè các provider bao nhiêu lần tùy nhu cầu.

<Recipes titleText="Examples of overriding context">

#### Ghi đè theme {/*overriding-a-theme*/}

Ở đây, button *bên trong* `Footer` nhận một giá trị context khác (`"light"`) so với các button bên ngoài (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Các heading được lồng tự động {/*automatically-nested-headings*/}

Bạn có thể “tích lũy” thông tin khi lồng các context provider. Trong ví dụ này, component `Section` theo dõi `LevelContext`, giá trị này xác định độ sâu của việc lồng các section. Nó đọc `LevelContext` từ section cha và cung cấp cho các component con giá trị `LevelContext` được tăng thêm một. Nhờ đó, component `Heading` có thể tự động quyết định sử dụng các tag `<h1>`, `<h2>`, `<h3>`, ... nào dựa trên số lượng component `Section` mà nó được lồng bên trong.

Đọc [hướng dẫn chi tiết](/learn/passing-data-deeply-with-context) về ví dụ này.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Tối ưu việc re-render khi truyền object và function {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Bạn có thể truyền bất kỳ giá trị nào qua context, bao gồm object và function.

```js [[2, 10, "{ currentUser, login }"]]
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

Ở đây, <CodeStep step={2}>giá trị context</CodeStep> là một object JavaScript có hai property, trong đó một property là một function. Mỗi khi `MyApp` re-render (chẳng hạn như khi cập nhật route), đây sẽ là một object *khác* trỏ đến một function *khác*, vì vậy React cũng sẽ phải re-render tất cả component nằm sâu trong cây gọi `useContext(AuthContext)`.

Trong các app nhỏ hơn, đây không phải là vấn đề. Tuy nhiên, không cần re-render chúng nếu dữ liệu nền tảng, chẳng hạn như `currentUser`, chưa thay đổi. Để giúp React tận dụng thực tế đó, bạn có thể bọc function `login` bằng [`useCallback`](/reference/react/useCallback) và bọc việc tạo object trong [`useMemo`](/reference/react/useMemo). Đây là một tối ưu hóa hiệu năng:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

Nhờ thay đổi này, ngay cả khi `MyApp` cần re-render, các component gọi `useContext(AuthContext)` cũng không cần re-render trừ khi `currentUser` đã thay đổi.

Đọc thêm về [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) và [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Khắc phục sự cố {/*troubleshooting*/}

### Component của tôi không nhận được giá trị từ provider {/*my-component-doesnt-see-the-value-from-my-provider*/}

Có một số nguyên nhân phổ biến khiến điều này xảy ra:

1. Bạn đang render `<SomeContext>` trong cùng component (hoặc bên dưới) nơi bạn gọi `useContext()`. Hãy di chuyển `<SomeContext>` *lên trên và ra bên ngoài* component gọi `useContext()`.
2. Có thể bạn đã quên bọc component bằng `<SomeContext>`, hoặc đã đặt nó ở một phần khác của cây so với bạn nghĩ. Hãy kiểm tra xem cấu trúc phân cấp có đúng không bằng cách sử dụng [React DevTools.](/learn/react-developer-tools)
3. Có thể bạn đang gặp một vấn đề build nào đó với tooling, khiến `SomeContext` khi được nhìn từ component cung cấp và `SomeContext` khi được nhìn từ component đọc trở thành hai object khác nhau. Điều này có thể xảy ra nếu bạn sử dụng symlink, chẳng hạn. Bạn có thể xác minh bằng cách gán chúng vào các global như `window.SomeContext1` và `window.SomeContext2`, sau đó kiểm tra xem `window.SomeContext1 === window.SomeContext2` trong console. Nếu chúng không giống nhau, hãy khắc phục vấn đề đó ở cấp build tool.

### Tôi luôn nhận được `undefined` từ context, mặc dù giá trị mặc định khác {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Có thể bạn có một provider không có `value` trong cây:

```js {1,2}
// 🚩 Doesn't work: no value prop
<ThemeContext>
   <Button />
</ThemeContext>
```

Nếu quên chỉ định `value`, điều đó tương đương với việc truyền `value={undefined}`.

Bạn cũng có thể đã vô tình sử dụng sai tên prop:

```js {1,2}
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

Trong cả hai trường hợp này, bạn sẽ thấy cảnh báo từ React trong console. Để khắc phục, hãy gọi prop là `value`:

```js {1,2}
// ✅ Passing the value prop
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

Lưu ý rằng [giá trị mặc định từ lời gọi `createContext(defaultValue)` của bạn](#specifying-a-fallback-default-value) chỉ được sử dụng **nếu hoàn toàn không có provider nào khớp ở phía trên.** Nếu có một component `<SomeContext value={undefined}>` ở đâu đó trong cây cha, component gọi `useContext(SomeContext)` *sẽ* nhận `undefined` làm giá trị context.