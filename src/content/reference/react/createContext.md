---
title: createContext
---

<Intro>

`createContext` cho phép bạn tạo một [context](/learn/passing-data-deeply-with-context) mà các component có thể cung cấp hoặc đọc.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Gọi `createContext` bên ngoài mọi component để tạo một context.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `defaultValue`: Giá trị mà bạn muốn context có khi không có context provider tương ứng nào trong cây phía trên component đọc context. Nếu bạn không có giá trị mặc định có ý nghĩa, hãy chỉ định `null`. Giá trị mặc định được dùng như một phương án dự phòng "cuối cùng". Giá trị này là tĩnh và không bao giờ thay đổi theo thời gian.

#### Giá trị trả về {/*returns*/}

`createContext` trả về một đối tượng context.

**Bản thân đối tượng context không chứa bất kỳ thông tin nào.** Nó đại diện cho việc các component khác đọc hoặc cung cấp context nào. Thông thường, bạn sẽ dùng [`SomeContext`](#provider) trong các component phía trên để chỉ định giá trị context, và gọi [`useContext(SomeContext)`](/reference/react/useContext) trong các component phía dưới để đọc giá trị đó. Đối tượng context có một vài thuộc tính:

* `SomeContext` cho phép bạn cung cấp giá trị context cho các component.
* `SomeContext.Consumer` là một cách thay thế và hiếm khi được dùng để đọc giá trị context.
* `SomeContext.Provider` là cách cũ để cung cấp giá trị context trước React 19.

---

### `SomeContext` Provider {/*provider*/}

Bọc các component của bạn trong một context provider để chỉ định giá trị của context này cho tất cả component bên trong:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  );
}
```

<Note>

Bắt đầu từ React 19, bạn có thể render `<SomeContext>` dưới dạng provider.

Trong các phiên bản React cũ hơn, hãy dùng `<SomeContext.Provider>`.

</Note>

#### Props {/*provider-props*/}

* `value`: Giá trị mà bạn muốn truyền cho tất cả component đọc context này bên trong provider, bất kể chúng nằm sâu đến đâu. Giá trị context có thể thuộc bất kỳ kiểu nào. Một component gọi [`useContext(SomeContext)`](/reference/react/useContext) bên trong provider sẽ nhận được `value` của context provider tương ứng gần nhất ở phía trên.

---

### `SomeContext.Consumer` {/*consumer*/}

Trước khi `useContext` tồn tại, có một cách cũ hơn để đọc context:

```js
function Button() {
  // 🟡 Legacy way (not recommended)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

Mặc dù cách cũ này vẫn hoạt động, **code mới nên đọc context bằng [`useContext()`](/reference/react/useContext) thay vào đó:**

```js
function Button() {
  // ✅ Recommended way
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: Một hàm. React sẽ gọi hàm bạn truyền vào với giá trị context hiện tại được xác định bằng cùng thuật toán mà [`useContext()`](/reference/react/useContext) sử dụng, rồi render kết quả bạn trả về từ hàm này. React cũng sẽ chạy lại hàm này và cập nhật UI bất cứ khi nào context từ các component cha thay đổi.

---

## Cách sử dụng {/*usage*/}

### Tạo context {/*creating-context*/}

Context cho phép các component [truyền thông tin xuống sâu](/learn/passing-data-deeply-with-context) mà không cần truyền props một cách tường minh.

Gọi `createContext` bên ngoài mọi component để tạo một hoặc nhiều context.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` trả về một <CodeStep step={1}>đối tượng context</CodeStep>. Các component có thể đọc context bằng cách truyền nó vào [`useContext()`](/reference/react/useContext):

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

Theo mặc định, các giá trị mà chúng nhận được sẽ là <CodeStep step={3}>giá trị mặc định</CodeStep> mà bạn đã chỉ định khi tạo context. Tuy nhiên, riêng điều này không hữu ích vì các giá trị mặc định không bao giờ thay đổi.

Context hữu ích vì bạn có thể **cung cấp các giá trị động khác từ các component của mình:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

Giờ đây, component `Page` và mọi component bên trong nó, bất kể nằm sâu đến đâu, sẽ "nhìn thấy" các giá trị context đã truyền. Nếu các giá trị context đã truyền thay đổi, React cũng sẽ re-render các component đang đọc context.

[Đọc thêm về cách đọc và cung cấp context, đồng thời xem các ví dụ.](/reference/react/useContext)

---

### Import và export context từ một file {/*importing-and-exporting-context-from-a-file*/}

Thông thường, các component trong những file khác nhau sẽ cần truy cập cùng một context. Vì vậy, việc khai báo context trong một file riêng là rất phổ biến. Sau đó, bạn có thể dùng câu lệnh [`export` để cung cấp context cho các file khác:](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Các component được khai báo trong những file khác sau đó có thể dùng câu lệnh [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) để đọc hoặc cung cấp context này:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

Điều này hoạt động tương tự như [import và export component.](/learn/importing-and-exporting-components)

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi không tìm thấy cách thay đổi giá trị context {/*i-cant-find-a-way-to-change-the-context-value*/}


Code như sau chỉ định giá trị context *mặc định*:

```js
const ThemeContext = createContext('light');
```

Giá trị này không bao giờ thay đổi. React chỉ dùng giá trị này làm phương án dự phòng nếu không tìm thấy provider tương ứng ở phía trên.

Để context thay đổi theo thời gian, [hãy thêm state và bọc các component trong một context provider.](/reference/react/useContext#updating-data-passed-via-context)