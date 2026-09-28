---
title: Sử dụng TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript là một cách phổ biến để thêm các định nghĩa kiểu vào các codebase JavaScript. Theo mặc định, TypeScript [hỗ trợ JSX](/learn/writing-markup-with-jsx) và bạn có thể có đầy đủ hỗ trợ React Web bằng cách thêm [`@types/react`](https://www.npmjs.com/package/@types/react) và [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) vào project của mình.

</Intro>

<YouWillLearn>

* [TypeScript với các React Component](/learn/typescript#typescript-with-react-components)
* [Ví dụ về typing với Hooks](/learn/typescript#example-hooks)
* [Các kiểu phổ biến từ `@types/react`](/learn/typescript#useful-types)
* [Các địa điểm tìm hiểu thêm](/learn/typescript#further-learning)

</YouWillLearn>

## Cài đặt {/*installation*/}

Tất cả [React framework cấp production](/learn/creating-a-react-app#full-stack-frameworks) đều hỗ trợ sử dụng TypeScript. Hãy làm theo hướng dẫn cài đặt dành riêng cho từng framework:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Thêm TypeScript vào một React project hiện có {/*adding-typescript-to-an-existing-react-project*/}

Để cài đặt phiên bản mới nhất của các type definition của React:

<TerminalBlock>
npm install --save-dev @types/react @types/react-dom
</TerminalBlock>

Các tùy chọn compiler sau đây cần được thiết lập trong `tsconfig.json`:

1. `dom` phải được bao gồm trong [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Lưu ý: Nếu không chỉ định tùy chọn `lib`, `dom` sẽ được bao gồm theo mặc định).
2. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) phải được đặt thành một trong các tùy chọn hợp lệ. `preserve` sẽ phù hợp với hầu hết ứng dụng.
  Nếu bạn đang publish một library, hãy tham khảo [`jsx` documentation](https://www.typescriptlang.org/tsconfig/#jsx) để biết nên chọn giá trị nào.

## TypeScript với các React Component {/*typescript-with-react-components*/}

<Note>

Mọi file chứa JSX đều phải sử dụng phần mở rộng file `.tsx`. Đây là phần mở rộng dành riêng cho TypeScript, cho TypeScript biết rằng file này chứa JSX.

</Note>

Viết TypeScript với React rất giống viết JavaScript với React. Điểm khác biệt chính khi làm việc với một component là bạn có thể cung cấp các type cho props của component. Những type này có thể được dùng để kiểm tra tính đúng đắn và cung cấp tài liệu inline trong các editor.

Lấy component [`MyButton` component](/learn#components) từ hướng dẫn [Quick Start](/learn), chúng ta có thể thêm một type mô tả `title` của button:

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

Các sandbox này có thể xử lý code TypeScript, nhưng không chạy type-checker. Điều này có nghĩa là bạn có thể chỉnh sửa các sandbox TypeScript để học, nhưng sẽ không nhận được lỗi hoặc cảnh báo về type. Để thực hiện type-checking, bạn có thể sử dụng [TypeScript Playground](https://www.typescriptlang.org/play) hoặc sử dụng một online sandbox có đầy đủ tính năng hơn.

</Note>

Cú pháp inline này là cách đơn giản nhất để cung cấp type cho một component, mặc dù khi bạn bắt đầu có một vài field cần mô tả, nó có thể trở nên khó quản lý. Thay vào đó, bạn có thể sử dụng một `interface` hoặc `type` để mô tả props của component:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** The text to display inside the button */
  title: string;
  /** Whether the button can be interacted with */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Type mô tả props của component có thể đơn giản hoặc phức tạp tùy theo nhu cầu, nhưng nên là một object type được mô tả bằng `type` hoặc `interface`. Bạn có thể tìm hiểu cách TypeScript mô tả object trong [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html), nhưng bạn cũng có thể quan tâm đến việc sử dụng [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) để mô tả một prop có thể thuộc một trong vài type khác nhau, cũng như hướng dẫn [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) cho các trường hợp sử dụng nâng cao hơn.


## Ví dụ về Hooks {/*example-hooks*/}

Các type definition từ `@types/react` bao gồm type cho các Hook tích hợp sẵn, vì vậy bạn có thể sử dụng chúng trong component mà không cần thiết lập bổ sung. Chúng được xây dựng để xét đến code bạn viết trong component, nên phần lớn thời gian bạn sẽ nhận được [inferred types](https://www.typescriptlang.org/docs/handbook/type-inference.html) và lý tưởng nhất là không cần xử lý những chi tiết nhỏ nhặt của việc cung cấp type.

Tuy nhiên, chúng ta có thể xem qua một vài ví dụ về cách cung cấp type cho Hooks.

### `useState` {/*typing-usestate*/}

Hook [`useState` Hook](/reference/react/useState) sẽ sử dụng lại giá trị được truyền vào làm state ban đầu để xác định type của giá trị. Ví dụ:

```ts
// Infer the type as "boolean"
const [enabled, setEnabled] = useState(false);
```

Điều này sẽ gán type của `boolean` cho `enabled`, và `setEnabled` sẽ là một function nhận một đối số `boolean`, hoặc một function trả về `boolean`. Nếu muốn cung cấp rõ ràng một type cho state, bạn có thể làm vậy bằng cách truyền một type argument vào lời gọi `useState`:

```ts
// Explicitly set the type to "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

Trong trường hợp này, cách làm đó không hữu ích lắm, nhưng một trường hợp phổ biến mà bạn có thể muốn cung cấp type là khi có một union type. Ví dụ, `status` ở đây có thể là một trong vài string khác nhau:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Hoặc, như được khuyến nghị trong [Principles for structuring state](/learn/choosing-the-state-structure#principles-for-structuring-state), bạn có thể nhóm các state liên quan thành một object và mô tả những khả năng khác nhau bằng object type:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

Hook [`useReducer` Hook](/reference/react/useReducer) là một Hook phức tạp hơn, nhận một reducer function và một state ban đầu. Các type cho reducer function được suy luận từ state ban đầu. Bạn có thể tùy chọn cung cấp một type argument cho lời gọi `useReducer` để cung cấp type cho state, nhưng thường tốt hơn là đặt type trên state ban đầu:

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


Chúng ta đang sử dụng TypeScript ở một vài vị trí quan trọng:

 - `interface State` mô tả cấu trúc của state trong reducer.
 - `type CounterAction` mô tả các action khác nhau có thể được dispatch đến reducer.
 - `const initialState: State` cung cấp type cho state ban đầu, đồng thời cũng là type được `useReducer` sử dụng theo mặc định.
 - `stateReducer(state: State, action: CounterAction): State` thiết lập type cho các đối số và giá trị trả về của reducer function.

Một cách thay thế rõ ràng hơn cho việc đặt type trên `initialState` là truyền một type argument cho `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

Hook [`useContext` Hook](/reference/react/useContext) là một kỹ thuật để truyền dữ liệu xuống component tree mà không cần truyền props qua các component. Kỹ thuật này được sử dụng bằng cách tạo một provider component và thường tạo một Hook để consume giá trị trong một child component.

Type của giá trị được cung cấp bởi context được suy luận từ giá trị truyền vào lời gọi `createContext`:

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext value={theme}>
      <MyComponent />
    </ThemeContext>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Kỹ thuật này hoạt động khi bạn có một giá trị mặc định hợp lý — nhưng đôi khi bạn không có, và trong những trường hợp đó, `null` có vẻ là một giá trị mặc định hợp lý. Tuy nhiên, để type-system hiểu được code của bạn, bạn cần thiết lập rõ ràng `ContextShape | null` trên `createContext`.

Điều này dẫn đến vấn đề là bạn cần loại bỏ `| null` khỏi type dành cho các context consumer. Khuyến nghị của chúng tôi là để Hook thực hiện runtime check nhằm kiểm tra sự tồn tại của nó và throw error khi không tồn tại:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// This is a simpler example, but you can imagine a more complex object here
type ComplexObject = {
  kind: string
};

// The context is created with `| null` in the type, to accurately reflect the default value.
const Context = createContext<ComplexObject | null>(null);

// The `| null` will be removed via the check in the Hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context value={object}>
      <MyComponent />
    </Context>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

<Note>

[React Compiler](/learn/react-compiler) tự động memo hóa các giá trị và hàm, giảm nhu cầu gọi `useMemo` thủ công. Bạn có thể sử dụng compiler để tự động xử lý việc memoization.

</Note>

Các [`useMemo`](/reference/react/useMemo) Hooks sẽ tạo/truy cập lại một giá trị đã được memo hóa từ một lời gọi hàm, chỉ chạy lại hàm khi các dependency được truyền vào dưới dạng tham số thứ 2 thay đổi. Kết quả của việc gọi Hook được suy ra từ giá trị trả về của hàm trong tham số thứ nhất. Bạn có thể chỉ rõ hơn bằng cách cung cấp một type argument cho Hook.

```ts
// The type of visibleTodos is inferred from the return value of filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

<Note>

[React Compiler](/learn/react-compiler) tự động memo hóa các giá trị và hàm, giảm nhu cầu gọi `useCallback` thủ công. Bạn có thể sử dụng compiler để tự động xử lý việc memoization.

</Note>

Các [`useCallback`](/reference/react/useCallback) cung cấp một tham chiếu ổn định đến một hàm miễn là các dependency được truyền vào tham số thứ hai không thay đổi. Tương tự như `useMemo`, type của hàm được suy ra từ giá trị trả về của hàm trong tham số thứ nhất, và bạn có thể chỉ rõ hơn bằng cách cung cấp một type argument cho Hook.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

Khi làm việc ở strict mode của TypeScript, `useCallback` yêu cầu bạn thêm type cho các parameter trong callback. Điều này là vì type của callback được suy ra từ giá trị trả về của hàm, và nếu không có parameter thì không thể hiểu đầy đủ type này.

Tùy theo sở thích về code style, bạn có thể sử dụng các hàm `*EventHandler` từ React types để cung cấp type cho event handler đồng thời với lúc định nghĩa callback:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## Các type hữu ích {/*useful-types*/}

Có một tập hợp khá phong phú các type đến từ package `@types/react`; bạn nên đọc qua khi đã quen với cách React và TypeScript tương tác với nhau. Bạn có thể tìm thấy chúng [trong thư mục React của DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). Ở đây, chúng ta sẽ đề cập đến một số type phổ biến hơn.

### DOM Events {/*typing-dom-events*/}

Khi làm việc với các DOM event trong React, type của event thường có thể được suy ra từ event handler. Tuy nhiên, khi muốn tách một hàm để truyền vào event handler, bạn sẽ cần chỉ rõ type của event.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Có nhiều type event được cung cấp trong React types — bạn có thể tìm thấy danh sách đầy đủ [tại đây](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373), dựa trên [các event phổ biến nhất từ DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

Khi xác định type cần tìm, trước tiên bạn có thể xem thông tin hiển thị khi di chuột lên event handler đang sử dụng; thông tin này sẽ hiển thị type của event.

Nếu cần sử dụng một event không có trong danh sách này, bạn có thể dùng type `React.SyntheticEvent`, là type cơ sở cho mọi event.

### Children {/*typing-children*/}

Có hai cách phổ biến để mô tả children của một component. Cách đầu tiên là sử dụng type `React.ReactNode`, một union của tất cả các type có thể được truyền làm children trong JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Đây là một định nghĩa rất rộng về children. Cách thứ hai là sử dụng type `React.ReactElement`, chỉ bao gồm các JSX element chứ không bao gồm các primitive của JavaScript như string hoặc number:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Lưu ý rằng bạn không thể dùng TypeScript để mô tả children là một type JSX element cụ thể, vì vậy không thể dùng type system để mô tả một component chỉ chấp nhận children kiểu `<li>`.

Bạn có thể xem ví dụ về cả `React.ReactNode` và `React.ReactElement` cùng với type-checker trong [TypeScript playground này](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Style Props {/*typing-style-props*/}

Khi sử dụng inline style trong React, bạn có thể dùng `React.CSSProperties` để mô tả object được truyền vào prop `style`. Type này là một union của tất cả các CSS property có thể có, giúp đảm bảo rằng bạn đang truyền các CSS property hợp lệ vào prop `style`, đồng thời cung cấp tính năng auto-complete trong editor.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Học thêm {/*further-learning*/}

Hướng dẫn này đã trình bày những kiến thức cơ bản về việc sử dụng TypeScript với React, nhưng vẫn còn rất nhiều điều cần tìm hiểu.
Các trang API riêng lẻ trong tài liệu có thể chứa phần hướng dẫn chuyên sâu hơn về cách sử dụng chúng với TypeScript.

Chúng tôi đề xuất các tài nguyên sau:

 - [Sổ tay TypeScript](https://www.typescriptlang.org/docs/handbook/) là tài liệu chính thức về TypeScript và trình bày hầu hết các tính năng ngôn ngữ quan trọng.

 - [Ghi chú phát hành TypeScript](https://devblogs.microsoft.com/typescript/) trình bày chuyên sâu các tính năng mới.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) là cheatsheet do cộng đồng duy trì về việc sử dụng TypeScript với React, bao quát nhiều edge case hữu ích và cung cấp phạm vi rộng hơn tài liệu này.

 - [TypeScript Community Discord](https://discord.com/invite/typescript) là nơi tuyệt vời để đặt câu hỏi và nhận trợ giúp về các vấn đề với TypeScript và React.