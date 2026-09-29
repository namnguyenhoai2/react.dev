---
title: useMemo
---

<Intro>

`useMemo` là một React Hook cho phép bạn lưu vào cache kết quả của một phép tính giữa các lần re-render.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) tự động memoize các giá trị và function, giúp giảm nhu cầu gọi `useMemo` thủ công. Bạn có thể sử dụng compiler để tự động xử lý memoization.

</Note>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Gọi `useMemo` ở cấp cao nhất của component để lưu vào cache một phép tính giữa các lần re-render:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `calculateValue`: Function tính toán giá trị mà bạn muốn lưu vào cache. Function này phải pure, không nhận tham số và trả về một giá trị thuộc bất kỳ kiểu nào. React sẽ gọi function của bạn trong lần render đầu tiên. Ở các lần render tiếp theo, React sẽ trả về lại cùng giá trị nếu `dependencies` không thay đổi kể từ lần render trước. Nếu không, React sẽ gọi `calculateValue`, trả về kết quả của function đó và lưu kết quả để có thể tái sử dụng sau này.

* `dependencies`: Danh sách tất cả các giá trị reactive được tham chiếu bên trong code `calculateValue`. Các giá trị reactive bao gồm props, state cùng tất cả biến và function được khai báo trực tiếp bên trong thân component. Nếu linter của bạn được [cấu hình cho React](/learn/editor-setup#linting), nó sẽ kiểm tra để bảo đảm mọi giá trị reactive đều được chỉ định chính xác làm dependency. Danh sách dependency phải có số lượng phần tử cố định và được viết inline như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó bằng phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Giá trị trả về {/*returns*/}

Trong lần render đầu tiên, `useMemo` trả về kết quả của việc gọi `calculateValue` mà không có tham số.

Trong các lần render tiếp theo, nó sẽ trả về giá trị đã được lưu từ lần render trước (nếu các dependency không thay đổi), hoặc gọi lại `calculateValue` và trả về kết quả mà `calculateValue` đã trả về.

#### Lưu ý {/*caveats*/}

* `useMemo` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc trong các Hook của riêng bạn. Bạn không thể gọi nó bên trong loop hoặc condition. Nếu cần làm vậy, hãy tách thành một component mới và chuyển state vào đó.
* Trong Strict Mode, React sẽ **gọi function tính toán của bạn hai lần** để [giúp bạn phát hiện các tính không thuần (impurity) vô tình.](#my-calculation-runs-twice-on-every-re-render) Đây là hành vi chỉ xảy ra trong development và không ảnh hưởng đến production. Nếu function tính toán của bạn là pure (như yêu cầu), điều này sẽ không ảnh hưởng đến logic của bạn. Kết quả từ một trong hai lần gọi sẽ bị bỏ qua.
* React **sẽ không loại bỏ giá trị đã lưu trong cache trừ khi có lý do cụ thể để làm vậy.** Ví dụ, trong development, React sẽ loại bỏ cache khi bạn chỉnh sửa file của component. Trong cả development và production, React sẽ loại bỏ cache nếu component của bạn bị suspend trong lần mount đầu tiên. Trong tương lai, React có thể bổ sung thêm các tính năng tận dụng việc loại bỏ cache—ví dụ, nếu React bổ sung hỗ trợ tích hợp cho các list được virtualize, thì việc loại bỏ cache của những item đã cuộn ra ngoài viewport của bảng virtualized sẽ là hợp lý. Điều này sẽ không có vấn đề gì nếu bạn chỉ dựa vào `useMemo` như một tối ưu hóa hiệu năng. Nếu không, một [state variable](/reference/react/useState#avoiding-recreating-the-initial-state) hoặc [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) có thể phù hợp hơn.

<Note>

Việc lưu vào cache các giá trị trả về như thế này còn được gọi là [*memoization*,](https://en.wikipedia.org/wiki/Memoization) vì vậy Hook này được gọi là `useMemo`.

</Note>

---

## Cách sử dụng {/*usage*/}

### Bỏ qua các phép tính tốn nhiều chi phí {/*skipping-expensive-recalculations*/}

Để lưu vào cache một phép tính giữa các lần re-render, hãy bọc phép tính đó trong lời gọi `useMemo` ở cấp cao nhất của component:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Bạn cần truyền hai thứ vào `useMemo`:

1. Một <CodeStep step={1}>function tính toán</CodeStep> không nhận tham số, như `() =>`, và trả về kết quả bạn muốn tính.
2. Một <CodeStep step={2}>danh sách dependency</CodeStep> bao gồm mọi giá trị bên trong component được sử dụng trong phép tính.

Trong lần render đầu tiên, <CodeStep step={3}>giá trị</CodeStep> bạn nhận được từ `useMemo` sẽ là kết quả của việc gọi <CodeStep step={1}>phép tính</CodeStep> của bạn.

Trong mỗi lần render tiếp theo, React sẽ so sánh <CodeStep step={2}>các dependency</CodeStep> với các dependency bạn đã truyền trong lần render trước. Nếu không có dependency nào thay đổi (khi so sánh với [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo` sẽ trả về giá trị mà bạn đã tính trước đó. Nếu không, React sẽ chạy lại phép tính của bạn và trả về giá trị mới.

Nói cách khác, `useMemo` lưu kết quả của một phép tính giữa các lần re-render cho đến khi dependency của nó thay đổi.

**Hãy cùng xem qua một ví dụ để biết khi nào cách này hữu ích.**

Theo mặc định, React sẽ chạy lại toàn bộ phần thân component mỗi khi component re-render. Ví dụ, nếu `TodoList` này cập nhật state hoặc nhận props mới từ parent, function `filterTodos` sẽ chạy lại:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Thông thường, đây không phải vấn đề vì hầu hết phép tính đều rất nhanh. Tuy nhiên, nếu bạn đang lọc hoặc biến đổi một array lớn, hoặc thực hiện một phép tính tốn nhiều chi phí, bạn có thể muốn bỏ qua việc thực hiện lại nếu dữ liệu không thay đổi. Nếu cả `todos` và `tab` đều giống như trong lần render trước, việc bọc phép tính trong `useMemo` như ở trên cho phép bạn tái sử dụng `visibleTodos` đã được tính trước đó.

Kiểu lưu cache này được gọi là *[memoization.](https://en.wikipedia.org/wiki/Memoization)*

<Note>

**Bạn chỉ nên dựa vào `useMemo` như một cách tối ưu hóa hiệu năng.** Nếu code của bạn không hoạt động khi thiếu nó, hãy tìm và khắc phục vấn đề gốc trước. Sau đó, bạn có thể thêm `useMemo` để cải thiện hiệu năng.

</Note>

<DeepDive>

#### Làm thế nào để biết một phép tính có tốn nhiều chi phí hay không? {/*how-to-tell-if-a-calculation-is-expensive*/}

Nhìn chung, trừ khi bạn đang tạo hoặc lặp qua hàng nghìn object, phép tính đó có lẽ không tốn nhiều chi phí. Nếu muốn chắc chắn hơn, bạn có thể thêm một console log để đo thời gian dành cho một đoạn code:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Hãy thực hiện interaction mà bạn đang đo (ví dụ: nhập vào input). Sau đó, bạn sẽ thấy các log như `filter array: 0.15ms` trong console. Nếu tổng thời gian được log cộng lại thành một khoảng đáng kể (chẳng hạn `1ms` trở lên), việc memoize phép tính đó có thể hợp lý. Để thử nghiệm, bạn có thể bọc phép tính trong `useMemo` nhằm kiểm tra xem tổng thời gian được log có giảm trong interaction đó hay không:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Skipped if todos and tab haven't changed
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` sẽ không làm lần render *đầu tiên* nhanh hơn. Nó chỉ giúp bạn bỏ qua những công việc không cần thiết trong các lần cập nhật.

Hãy nhớ rằng máy của bạn có thể nhanh hơn máy của người dùng, vì vậy nên kiểm tra hiệu năng với một mức làm chậm nhân tạo. Ví dụ, Chrome cung cấp tùy chọn [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) cho việc này.

Cũng lưu ý rằng việc đo hiệu năng trong development sẽ không cho kết quả chính xác nhất. (Ví dụ, khi [Strict Mode](/reference/react/StrictMode) được bật, bạn sẽ thấy mỗi component render hai lần thay vì một lần.) Để có kết quả đo thời gian chính xác nhất, hãy build app cho production và kiểm tra trên một thiết bị tương tự thiết bị mà người dùng của bạn sử dụng.

</DeepDive>

<DeepDive>

#### Có nên thêm useMemo ở mọi nơi không? {/*should-you-add-usememo-everywhere*/}

Nếu app của bạn giống trang này và hầu hết interaction đều ở mức tổng thể (chẳng hạn thay thế một page hoặc toàn bộ section), memoization thường không cần thiết. Mặt khác, nếu app của bạn giống một trình chỉnh sửa bản vẽ hơn và hầu hết interaction đều ở mức chi tiết (chẳng hạn di chuyển các shape), bạn có thể thấy memoization rất hữu ích.

Tối ưu hóa bằng `useMemo` chỉ có giá trị trong một số trường hợp:

- Phép tính bạn đặt trong `useMemo` chậm một cách đáng kể, trong khi các dependency của nó hiếm khi thay đổi.
- Bạn truyền nó dưới dạng prop cho một component được bọc trong [`memo`.](/reference/react/memo) Bạn muốn bỏ qua việc re-render nếu giá trị không thay đổi. Memoization cho phép component của bạn chỉ re-render khi các dependency không còn giống nhau.
- Giá trị bạn truyền sau đó được dùng làm dependency của một Hook nào đó. Ví dụ: có thể một giá trị tính toán `useMemo` khác phụ thuộc vào nó. Hoặc có thể bạn đang phụ thuộc vào giá trị này từ [`useEffect.`](/reference/react/useEffect)

Trong các trường hợp khác, việc bọc một phép tính trong `useMemo` không đem lại lợi ích nào. Làm vậy cũng không gây hại đáng kể, vì thế một số team chọn cách không xem xét từng trường hợp riêng lẻ mà memoize nhiều nhất có thể. Nhược điểm của cách tiếp cận này là code trở nên khó đọc hơn. Ngoài ra, không phải mọi memoization đều hiệu quả: chỉ một giá trị "luôn mới" cũng đủ làm hỏng memoization cho toàn bộ component.

**Trên thực tế, bạn có thể khiến nhiều trường hợp memoization trở nên không cần thiết bằng cách tuân theo một vài nguyên tắc:**

1. Khi một component bọc các component khác về mặt hiển thị, hãy để component đó [accept JSX as children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Bằng cách này, khi component bọc cập nhật state của chính nó, React biết rằng các children của nó không cần re-render.
1. Ưu tiên state cục bộ và không [lift state up](/learn/sharing-state-between-components) xa hơn mức cần thiết. Ví dụ: đừng lưu các state tạm thời như form và trạng thái một item có đang được hover ở cấp cao nhất của cây component hoặc trong một thư viện global state.
1. Giữ cho [rendering logic pure.](/learn/keeping-components-pure) Nếu việc re-render một component gây ra sự cố hoặc tạo ra artifact trực quan đáng chú ý, đó là bug trong component của bạn! Hãy sửa bug thay vì thêm memoization.
1. Tránh [unnecessary Effects that update state.](/learn/you-might-not-need-an-effect) Hầu hết vấn đề về performance trong các ứng dụng React là do các chuỗi update bắt nguồn từ Effects, khiến component của bạn render lặp đi lặp lại.
1. Hãy thử [remove unnecessary dependencies from your Effects.](/learn/removing-effect-dependencies) Ví dụ, thay vì memoization, thường sẽ đơn giản hơn nếu di chuyển một object hoặc một function vào trong một Effect hoặc ra ngoài component.

Nếu một interaction cụ thể vẫn có cảm giác bị lag, [use the React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) để xem component nào sẽ được lợi nhiều nhất từ memoization, rồi thêm memoization khi cần. Dù sao thì các nguyên tắc này cũng giúp component của bạn dễ debug và dễ hiểu hơn, vì vậy bạn nên tuân theo chúng. Về lâu dài, chúng tôi đang nghiên cứu [doing granular memoization automatically](https://www.youtube.com/watch?v=lGEMwh32soc) để giải quyết vấn đề này một lần và mãi mãi.

</DeepDive>

<Recipes titleText="The difference between useMemo and calculating a value directly" titleId="examples-recalculation">

#### Bỏ qua việc tính toán lại với `useMemo` {/*skipping-recalculation-with-usememo*/}

Trong ví dụ này, implementation của `filterTodos` bị **làm chậm một cách nhân tạo** để bạn có thể thấy điều gì xảy ra khi một JavaScript function bạn gọi trong quá trình rendering thực sự chậm. Hãy thử chuyển tab và bật tắt theme.

Việc chuyển tab có cảm giác chậm vì nó buộc `filterTodos` đã bị làm chậm phải thực thi lại. Điều này là dễ hiểu vì `tab` đã thay đổi, nên toàn bộ phép tính *cần* được chạy lại. (Nếu bạn thắc mắc tại sao nó chạy hai lần, bạn có thể xem giải thích [here.](#my-calculation-runs-twice-on-every-re-render))

Bật tắt theme. **Nhờ có `useMemo`, thao tác này vẫn nhanh dù có sự làm chậm nhân tạo!** Lệnh gọi `filterTodos` chậm đã được bỏ qua vì cả `todos` và `tab` (những giá trị bạn truyền làm dependency cho `useMemo`) đều không thay đổi kể từ lần render trước.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Luôn tính toán lại một giá trị {/*always-recalculating-a-value*/}

Trong ví dụ này, implementation của `filterTodos` cũng bị **làm chậm một cách nhân tạo** để bạn có thể thấy điều gì xảy ra khi một JavaScript function bạn gọi trong quá trình rendering thực sự chậm. Hãy thử chuyển tab và bật tắt theme.

Không giống ví dụ trước, việc bật tắt theme giờ đây cũng chậm! Lý do là **phiên bản này không có lệnh gọi `useMemo`,** nên `filterTodos` đã bị làm chậm sẽ được gọi trong mỗi lần re-render. Nó được gọi ngay cả khi chỉ có `theme` thay đổi.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Tuy nhiên, đây là cùng đoạn code đó **nhưng đã loại bỏ sự làm chậm nhân tạo.** Việc thiếu `useMemo` có tạo cảm giác đáng chú ý không?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Rất thường xuyên, code không có memoization vẫn hoạt động tốt. Nếu các interaction đủ nhanh, có thể bạn không cần memoization.

Bạn có thể thử tăng số lượng todo item trong `utils.js` và xem hành vi thay đổi như thế nào. Ban đầu, phép tính cụ thể này vốn không quá tốn kém, nhưng nếu số lượng todo tăng đáng kể, phần lớn overhead sẽ nằm ở việc re-render chứ không phải ở việc filtering. Hãy tiếp tục đọc bên dưới để xem cách bạn có thể tối ưu việc re-render với `useMemo`.

<Solution />

</Recipes>

---

### Bỏ qua việc re-render component {/*skipping-re-rendering-of-components*/}

Trong một số trường hợp, `useMemo` cũng có thể giúp bạn tối ưu performance khi re-render các child component. Để minh họa, hãy giả sử component `TodoList` này truyền `visibleTodos` dưới dạng prop cho child component `List`:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

Bạn nhận thấy rằng việc bật tắt prop `theme` khiến ứng dụng bị đơ trong chốc lát, nhưng nếu xóa `<List />` khỏi JSX thì ứng dụng có cảm giác nhanh hơn. Điều này cho thấy bạn nên thử tối ưu component `List`.

**Theo mặc định, khi một component re-render, React sẽ re-render đệ quy tất cả children của component đó.** Đây là lý do khi `TodoList` re-render với một `theme` khác, component `List` cũng re-render. Điều này không có vấn đề với các component không cần nhiều phép tính để re-render. Nhưng nếu bạn đã xác nhận rằng việc re-render chậm, bạn có thể yêu cầu `List` bỏ qua việc re-render khi các prop của nó giống với lần render trước bằng cách bọc nó trong [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Với thay đổi này, `List` sẽ bỏ qua việc re-render nếu tất cả prop của nó *giống* với lần render trước.** Đây là lúc việc cache phép tính trở nên quan trọng! Hãy tưởng tượng bạn tính toán `visibleTodos` mà không có `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Every time the theme changes, this will be a different array...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... so List's props will never be the same, and it will re-render every time */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**Trong ví dụ trên, function `filterTodos` luôn tạo một array *khác*,** tương tự như cách object literal `{}` luôn tạo một object mới. Thông thường, đây không phải vấn đề, nhưng điều đó có nghĩa là prop `List` sẽ không bao giờ giống nhau, và optimization [`memo`](/reference/react/memo) của bạn sẽ không hoạt động. Đây là lúc `useMemo` trở nên hữu ích:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Tell React to cache your calculation between re-renders...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...so as long as these dependencies don't change...
  );
  return (
    <div className={theme}>
      {/* ...List will receive the same props and can skip re-rendering */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**Bằng cách bọc phép tính `visibleTodos` trong `useMemo`, bạn đảm bảo rằng nó có cùng giá trị giữa các lần re-render** (cho đến khi các dependency thay đổi). Bạn *không bắt buộc* phải bọc một phép tính trong `useMemo` trừ khi bạn làm vậy vì một lý do cụ thể. Trong ví dụ này, lý do là bạn truyền nó cho một component được bọc trong [`memo`,](/reference/react/memo) và điều này cho phép component đó bỏ qua việc re-render. Có một vài lý do khác để thêm `useMemo`, được mô tả ở phần sau của trang này.

<DeepDive>

#### Memoize từng JSX node {/*memoizing-individual-jsx-nodes*/}

Thay vì bọc `List` trong [`memo`](/reference/react/memo), bạn có thể bọc chính JSX node `<List />` trong `useMemo`:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

Hành vi sẽ giống nhau. Nếu `visibleTodos` không thay đổi, `List` sẽ không được re-render.

Một JSX node như `<List items={visibleTodos} />` là một object giống như `{ type: List, props: { items: visibleTodos } }`. Việc tạo object này rất nhẹ, nhưng React không biết nội dung của nó có giống lần trước hay không. Đây là lý do theo mặc định, React sẽ re-render component `List`.

Tuy nhiên, nếu React nhận thấy JSX hoàn toàn giống với JSX trong lần render trước, React sẽ không cố gắng render lại component của bạn. Điều này là do các node JSX là [bất biến (immutable).](https://en.wikipedia.org/wiki/Immutable_object) Một object node JSX không thể thay đổi theo thời gian, nên React biết rằng có thể an toàn bỏ qua việc render lại. Tuy nhiên, để điều này hoạt động, node phải *thực sự là cùng một object*, chứ không chỉ trông giống nhau trong code. Đây là điều mà `useMemo` thực hiện trong ví dụ này.

Việc tự bọc các node JSX vào `useMemo` không thuận tiện. Ví dụ, bạn không thể thực hiện việc này một cách có điều kiện. Đây thường là lý do bạn sẽ bọc các component bằng [`memo`](/reference/react/memo) thay vì bọc các node JSX.

</DeepDive>

<Recipes titleText="The difference between skipping re-renders and always re-rendering" titleId="examples-rerendering">

#### Bỏ qua việc render lại bằng `useMemo` và `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

Trong ví dụ này, component `List` được **làm chậm một cách nhân tạo** để bạn có thể thấy điều gì xảy ra khi một React component mà bạn đang render thực sự chạy chậm. Hãy thử chuyển đổi giữa các tab và bật/tắt theme.

Việc chuyển đổi giữa các tab có cảm giác chậm vì nó buộc `List` đã bị làm chậm phải render lại. Điều này là bình thường vì `tab` đã thay đổi, nên bạn cần phản ánh lựa chọn mới của người dùng trên màn hình.

Tiếp theo, hãy thử bật/tắt theme. **Nhờ có `useMemo` kết hợp với [`memo`](/reference/react/memo), thao tác này vẫn nhanh dù có sự làm chậm nhân tạo!** `List` đã bỏ qua việc render lại vì array `visibleTodos` không thay đổi kể từ lần render trước. Array `visibleTodos` không thay đổi vì cả `todos` và `tab` (được bạn truyền làm dependencies cho `useMemo`) đều không thay đổi kể từ lần render trước.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Luôn render lại một component {/*always-re-rendering-a-component*/}

Trong ví dụ này, implementation của `List` cũng được **làm chậm một cách nhân tạo** để bạn có thể thấy điều gì xảy ra khi một React component mà bạn đang render thực sự chạy chậm. Hãy thử chuyển đổi giữa các tab và bật/tắt theme.

Khác với ví dụ trước, việc bật/tắt theme hiện cũng chậm! Điều này là vì **trong phiên bản này không có lệnh gọi `useMemo`,** nên `visibleTodos` luôn là một array khác, và component `List` đã bị làm chậm không thể bỏ qua việc render lại.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Tuy nhiên, đây là cùng đoạn code đó **sau khi đã loại bỏ sự làm chậm nhân tạo.** Việc thiếu `useMemo` có tạo cảm giác đáng chú ý không?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Khá thường xuyên, code không có memoization vẫn hoạt động tốt. Nếu các tương tác đủ nhanh, bạn không cần memoization.

Hãy nhớ rằng bạn cần chạy React ở production mode, tắt [React Developer Tools](/learn/react-developer-tools), và sử dụng các thiết bị tương tự như thiết bị mà người dùng app của bạn sử dụng để có được đánh giá thực tế về điều gì đang thực sự làm app của bạn chậm đi.

<Solution />

</Recipes>

---

### Ngăn một Effect chạy quá thường xuyên {/*preventing-an-effect-from-firing-too-often*/}

Đôi khi, bạn có thể muốn sử dụng một giá trị bên trong một [Effect:](/learn/synchronizing-with-effects)

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Điều này tạo ra một vấn đề. [Mọi giá trị reactive đều phải được khai báo là dependency của Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Tuy nhiên, nếu bạn khai báo `options` là một dependency, nó sẽ khiến Effect của bạn liên tục kết nối lại với phòng chat:

```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 Problem: This dependency changes on every render
  // ...
```

Để giải quyết vấn đề này, bạn có thể bọc object cần gọi từ một Effect vào `useMemo`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Only changes when options changes
  // ...
```

Điều này đảm bảo rằng object `options` sẽ giống nhau giữa các lần render nếu `useMemo` trả về object đã được cache.

Tuy nhiên, vì `useMemo` là một tối ưu hóa hiệu năng, không phải một bảo đảm về ngữ nghĩa, React có thể loại bỏ giá trị đã cache nếu [có một lý do cụ thể để làm vậy](#caveats). Điều này cũng sẽ khiến effect chạy lại, **vì vậy tốt hơn nữa là loại bỏ nhu cầu về function dependency** bằng cách chuyển object *vào bên trong* Effect:

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ No need for useMemo or object dependencies!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

Bây giờ code của bạn đơn giản hơn và không cần `useMemo`. [Tìm hiểu thêm về cách loại bỏ các dependency của Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

### Memoize một dependency của Hook khác {/*memoizing-a-dependency-of-another-hook*/}

Giả sử bạn có một phép tính phụ thuộc vào một object được tạo trực tiếp trong phần thân của component:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body
  // ...
```

Việc phụ thuộc vào một object như thế này làm mất đi mục đích của memoization. Khi một component render lại, toàn bộ code nằm trực tiếp bên trong phần thân component sẽ chạy lại. **Các dòng code tạo object `searchOptions` cũng sẽ chạy trong mỗi lần render lại.** Vì `searchOptions` là một dependency trong lệnh gọi `useMemo` của bạn và nó khác nhau mỗi lần, React biết rằng các dependency đã khác, nên sẽ tính toán lại `searchItems` mỗi lần.

Để khắc phục điều này, bạn có thể memoize chính object `searchOptions` *trước khi* truyền nó làm dependency:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Only changes when text changes

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Only changes when allItems or searchOptions changes
  // ...
```

Trong ví dụ trên, nếu `text` không thay đổi, object `searchOptions` cũng sẽ không thay đổi. Tuy nhiên, cách khắc phục tốt hơn nữa là chuyển khai báo object `searchOptions` *vào bên trong* function tính toán `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Only changes when allItems or text changes
  // ...
```

Bây giờ phép tính của bạn phụ thuộc trực tiếp vào `text` (đây là một string và không thể “vô tình” trở nên khác đi).

---

### Memoize một function {/*memoizing-a-function*/}

Giả sử component `Form` được bọc trong [`memo`.](/reference/react/memo) Bạn muốn truyền cho nó một function dưới dạng prop:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

Tương tự như việc `{}` tạo ra một object khác, các khai báo function như `function() {}` và các biểu thức như `() => {}` sẽ tạo ra một *function khác* trong mỗi lần render lại. Việc tạo một function mới tự nó không phải là vấn đề. Đây không phải điều cần tránh! Tuy nhiên, nếu component `Form` được memoize, có lẽ bạn muốn bỏ qua việc render lại nó khi không có prop nào thay đổi. Một prop *luôn* khác sẽ làm mất đi mục đích của memoization.

Để memoize một function bằng `useMemo`, function tính toán của bạn phải trả về một function khác:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Điều này trông khá rườm rà! **Memoize function là việc đủ phổ biến để React có một Hook tích hợp sẵn dành riêng cho việc đó. Hãy bọc các function của bạn vào [`useCallback`](/reference/react/useCallback) thay vì `useMemo`** để không phải viết thêm một function lồng nhau:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Hai ví dụ trên hoàn toàn tương đương. Lợi ích duy nhất của `useCallback` là giúp bạn tránh phải viết thêm một function lồng nhau bên trong. Nó không làm gì khác. [Đọc thêm về `useCallback`.](/reference/react/useCallback)

---

## Khắc phục sự cố {/*troubleshooting*/}

### Phép tính của tôi chạy hai lần trong mỗi lần render lại {/*my-calculation-runs-twice-on-every-re-render*/}

Trong [Strict Mode](/reference/react/StrictMode), React sẽ gọi một số function của bạn hai lần thay vì một lần:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // This component function will run twice for every render.

  const visibleTodos = useMemo(() => {
    // This calculation will run twice if any of the dependencies change.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

Điều này là bình thường và không nên làm hỏng code của bạn.

Hành vi **chỉ xảy ra trong development** này giúp bạn [giữ cho các component thuần (pure).](/learn/keeping-components-pure) React sử dụng kết quả của một trong các lần gọi và bỏ qua kết quả của lần gọi còn lại. Miễn là component và các function tính toán của bạn là pure, điều này không ảnh hưởng đến logic của bạn. Tuy nhiên, nếu chúng vô tình không pure, điều này giúp bạn nhận ra và sửa lỗi.

Ví dụ, function tính toán không pure này làm thay đổi một array mà bạn nhận được dưới dạng prop:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Mistake: mutating a prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React gọi function của bạn hai lần, vì vậy bạn sẽ nhận thấy todo được thêm hai lần. Phép tính của bạn không nên thay đổi bất kỳ object hiện có nào, nhưng bạn có thể thay đổi bất kỳ object *mới* nào được tạo trong quá trình tính toán. Ví dụ, nếu function `filterTodos` luôn trả về một array *khác*, bạn có thể thay đổi chính array *đó*:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correct: mutating an object you created during the calculation
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Đọc [giữ cho các component pure](/learn/keeping-components-pure) để tìm hiểu thêm về tính pure.

Ngoài ra, hãy xem các hướng dẫn về [cập nhật object](/learn/updating-objects-in-state) và [cập nhật array](/learn/updating-arrays-in-state) mà không gây mutation.

---

### Lệnh gọi `useMemo` của tôi lẽ ra phải trả về một object, nhưng lại trả về undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Đoạn code này không hoạt động:

```js {1-2,5}
  // 🔴 You can't return an object from an arrow function with () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

Trong JavaScript, `() => {` bắt đầu phần thân của arrow function, vì vậy dấu ngoặc nhọn `{` không thuộc về object của bạn. Đây là lý do nó không trả về một object và dẫn đến sai sót. Bạn có thể sửa bằng cách thêm dấu ngoặc đơn như `({` và `})`:

```js {1-2,5}
  // This works, but is easy for someone to break again
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

Tuy nhiên, cách này vẫn gây nhầm lẫn và quá dễ bị hỏng nếu ai đó xóa các dấu ngoặc đơn.

Để tránh sai sót này, hãy viết tường minh một câu lệnh `return`:

```js {1-3,6-7}
  // ✅ This works and is explicit
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### Mỗi lần component của tôi render, phép tính trong `useMemo` lại chạy lại {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Hãy đảm bảo bạn đã chỉ định dependency array làm đối số thứ hai!

Nếu quên dependency array, `useMemo` sẽ chạy lại phép tính mỗi lần:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalculates every time: no dependency array
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Đây là phiên bản đã sửa, truyền dependency array làm đối số thứ hai:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Does not recalculate unnecessarily
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Nếu cách này không hiệu quả, thì vấn đề là ít nhất một dependency của bạn khác với lần render trước. Bạn có thể debug vấn đề này bằng cách ghi thủ công các dependency vào console:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Sau đó, bạn có thể nhấp chuột phải vào các array từ những lần re-render khác nhau trong console và chọn "Store as a global variable" cho cả hai. Giả sử array thứ nhất được lưu dưới dạng `temp1` và array thứ hai được lưu dưới dạng `temp2`, bạn có thể dùng browser console để kiểm tra xem mỗi dependency trong cả hai array có giống nhau hay không:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

Khi tìm ra dependency nào làm hỏng memoization, hãy tìm cách loại bỏ dependency đó hoặc [memoize nó nữa.](#memoizing-a-dependency-of-another-hook)

---

### Tôi cần gọi `useMemo` cho từng item trong list bên trong một vòng lặp, nhưng điều đó không được phép {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Giả sử component `Chart` được bọc trong [`memo`](/reference/react/memo). Bạn muốn bỏ qua việc re-render mọi `Chart` trong list khi component `ReportList` re-render. Tuy nhiên, bạn không thể gọi `useMemo` trong một vòng lặp:

```js {expectedErrors: {'react-compiler': [6]}} {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useMemo in a loop like this:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

Thay vào đó, hãy tách một component cho từng item và memoize dữ liệu cho từng item:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useMemo at the top level:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

Ngoài ra, bạn có thể loại bỏ `useMemo` rồi bọc chính `Report` trong [`memo`.](/reference/react/memo) Nếu prop `item` không thay đổi, `Report` sẽ bỏ qua việc re-render, vì vậy `Chart` cũng sẽ bỏ qua việc re-render:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```