---
title: createRef
---

<Pitfall>

`createRef` chủ yếu được dùng cho [class components.](/reference/react/Component) Function components thường dựa vào [`useRef`](/reference/react/useRef) thay vào đó.

</Pitfall>

<Intro>

`createRef` tạo một đối tượng [ref](/learn/referencing-values-with-refs) có thể chứa giá trị bất kỳ.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `createRef()` {/*createref*/}

Gọi `createRef` để khai báo một [ref](/learn/referencing-values-with-refs) bên trong một [class component.](/reference/react/Component)

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

`createRef` không nhận tham số nào.

#### Giá trị trả về {/*returns*/}

`createRef` trả về một đối tượng có một thuộc tính duy nhất:

* `current`: Ban đầu, thuộc tính này được đặt thành `null`. Sau đó, bạn có thể đặt nó thành một giá trị khác. Nếu truyền đối tượng ref cho React dưới dạng thuộc tính `ref` của một node JSX, React sẽ đặt thuộc tính `current` của nó.

#### Lưu ý {/*caveats*/}

* `createRef` luôn trả về một đối tượng *khác*. Điều này tương đương với việc tự viết `{ current: null }`.
* Trong một function component, có lẽ bạn nên dùng [`useRef`](/reference/react/useRef) thay vào đó, vì nó luôn trả về cùng một đối tượng.
* `const ref = useRef()` tương đương với `const [ref, _] = useState(() => createRef(null))`.

---

## Cách sử dụng {/*usage*/}

### Khai báo ref trong một class component {/*declaring-a-ref-in-a-class-component*/}

Để khai báo một ref bên trong một [class component,](/reference/react/Component) hãy gọi `createRef` và gán kết quả của nó cho một class field:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

Nếu lúc này bạn truyền `ref={this.inputRef}` cho một `<input>` trong JSX, React sẽ điền `this.inputRef.current` bằng node DOM của input. Ví dụ: sau đây là cách tạo một button để focus input:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` chủ yếu được dùng cho [class components.](/reference/react/Component) Function components thường dựa vào [`useRef`](/reference/react/useRef) thay vào đó.

</Pitfall>

---

## Các phương án thay thế {/*alternatives*/}

### Chuyển từ class có `createRef` sang function có `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Chúng tôi khuyên bạn nên sử dụng function components thay vì [class components](/reference/react/Component) trong code mới. Nếu bạn có một số class components hiện có đang sử dụng `createRef`, sau đây là cách chuyển đổi chúng. Đây là code ban đầu:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

Khi bạn [chuyển component này từ class sang function,](/reference/react/Component#alternatives) hãy thay thế các lệnh gọi đến `createRef` bằng các lệnh gọi đến [`useRef`:](/reference/react/useRef)

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>