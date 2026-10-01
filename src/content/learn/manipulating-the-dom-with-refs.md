---
title: 'Thao tác với DOM bằng Refs'
---

<Intro>

React tự động cập nhật [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) để khớp với kết quả render của bạn, vì vậy các component của bạn thường không cần thao tác với nó. Tuy nhiên, đôi khi bạn có thể cần truy cập vào các phần tử DOM do React quản lý--ví dụ: để focus một node, cuộn đến node đó hoặc đo kích thước và vị trí của nó. React không có cách tích hợp sẵn để thực hiện những việc này, vì vậy bạn sẽ cần một *ref* trỏ đến node DOM.

</Intro>

<YouWillLearn>

- Cách truy cập node DOM do React quản lý bằng thuộc tính `ref`
- Mối liên hệ giữa thuộc tính JSX `ref` và Hook `useRef`
- Cách truy cập node DOM của một component khác
- Những trường hợp nào an toàn để sửa đổi DOM do React quản lý

</YouWillLearn>

## Lấy ref đến node {/*getting-a-ref-to-the-node*/}

Để truy cập một node DOM do React quản lý, trước tiên hãy import Hook `useRef`:

```js
import { useRef } from 'react';
```

Sau đó, sử dụng nó để khai báo một ref bên trong component:

```js
const myRef = useRef(null);
```

Cuối cùng, truyền ref của bạn dưới dạng thuộc tính `ref` vào thẻ JSX mà bạn muốn lấy node DOM:

```js
<div ref={myRef}>
```

Hook `useRef` trả về một object có một thuộc tính duy nhất tên là `current`. Ban đầu, `myRef.current` sẽ là `null`. Khi React tạo một node DOM cho `<div>` này, React sẽ đặt tham chiếu đến node đó vào `myRef.current`. Sau đó, bạn có thể truy cập node DOM này từ các [event handler](/learn/responding-to-events) của mình và sử dụng các [browser API](https://developer.mozilla.org/docs/Web/API/Element) tích hợp sẵn được định nghĩa trên node đó.

```js
// Bạn có thể dùng bất kỳ browser API nào, ví dụ:
myRef.current.scrollIntoView();
```

### Ví dụ: Focus một text input {/*example-focusing-a-text-input*/}

Trong ví dụ này, việc nhấp vào button sẽ focus input:

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

Để triển khai việc này:

1. Khai báo `inputRef` bằng Hook `useRef`.
2. Truyền nó dưới dạng `<input ref={inputRef}>`. Điều này yêu cầu React **đặt DOM node của `<input>` này vào `inputRef.current`.**
3. Trong function `handleClick`, đọc node DOM của input từ `inputRef.current` và gọi [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) trên nó với `inputRef.current.focus()`.
4. Truyền event handler `handleClick` vào `<button>` với `onClick`.

Mặc dù thao tác DOM là trường hợp sử dụng phổ biến nhất của refs, Hook `useRef` có thể được dùng để lưu trữ những thứ khác bên ngoài React, chẳng hạn như ID của timer. Tương tự state, refs vẫn tồn tại qua các lần render. Refs giống như các biến state nhưng không kích hoạt render lại khi bạn gán giá trị cho chúng. Đọc thêm về refs trong [Tham chiếu giá trị bằng Refs.](/learn/referencing-values-with-refs)

### Ví dụ: Cuộn đến một phần tử {/*example-scrolling-to-an-element*/}

Bạn có thể có nhiều hơn một ref trong một component. Trong ví dụ này, có một carousel gồm ba hình ảnh. Mỗi button căn giữa một hình ảnh bằng cách gọi method [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) của browser trên node DOM tương ứng:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### Cách quản lý danh sách refs bằng ref callback {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Trong các ví dụ trên, số lượng ref được xác định trước. Tuy nhiên, đôi khi bạn cần một ref cho từng item trong danh sách và không biết mình sẽ có bao nhiêu item. Cách làm như sau **sẽ không hoạt động**:

```js
<ul>
  {items.map((item) => {
    // Không hoạt động!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Điều này là do **Hooks chỉ được gọi ở cấp cao nhất của component.** Bạn không thể gọi `useRef` trong một loop, trong một điều kiện hoặc bên trong lời gọi `map()`.

Một cách có thể giải quyết vấn đề này là lấy một ref duy nhất đến phần tử cha, sau đó sử dụng các method thao tác DOM như [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) để "tìm" các node con riêng lẻ từ đó. Tuy nhiên, cách này dễ hỏng và có thể ngừng hoạt động nếu cấu trúc DOM của bạn thay đổi.

Một giải pháp khác là **truyền một function vào thuộc tính `ref`.** Đây được gọi là một [`ref` callback.](/reference/react-dom/components/common#ref-callback) React sẽ gọi ref callback của bạn với node DOM khi đến lúc thiết lập ref, đồng thời gọi cleanup function được trả về từ callback khi đến lúc xóa ref. Điều này cho phép bạn tự duy trì một array hoặc một [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), và truy cập bất kỳ ref nào theo index hoặc một loại ID nào đó.

Ví dụ này cho thấy cách bạn có thể sử dụng phương pháp trên để cuộn đến một node bất kỳ trong một danh sách dài:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Khởi tạo Map trong lần sử dụng đầu tiên.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[8])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat.imageUrl} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catCount = 10;
  const catList = new Array(catCount)
  for (let i = 0; i < catCount; i++) {
    let imageUrl = '';
    if (i < 5) {
      imageUrl = "https://placecats.com/neo/320/240";
    } else if (i < 8) {
      imageUrl = "https://placecats.com/millie/320/240";
    } else {
      imageUrl = "https://placecats.com/bella/320/240";
    }
    catList[i] = {
      id: i,
      imageUrl,
    };
  }
  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

Trong ví dụ này, `itemsRef` không chứa một node DOM duy nhất. Thay vào đó, nó chứa một [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) ánh xạ từ ID của item đến một node DOM. ([Refs có thể chứa bất kỳ giá trị nào!](/learn/referencing-values-with-refs)) [`ref` callback](/reference/react-dom/components/common#ref-callback) trên mỗi item trong danh sách sẽ đảm nhiệm việc cập nhật Map:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Thêm vào Map
    map.set(cat, node);

    return () => {
      // Xóa khỏi Map
      map.delete(cat);
    };
  }}
>
```

Điều này cho phép bạn đọc từng node DOM riêng lẻ từ Map về sau.

<Note>

Khi Strict Mode được bật, ref callback sẽ chạy hai lần trong môi trường development.

Đọc thêm về [cách điều này giúp phát hiện bug](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) trong callback refs.

</Note>

</DeepDive>

## Truy cập node DOM của một component khác {/*accessing-another-components-dom-nodes*/}

<Pitfall>
Refs là một escape hatch. Việc thao tác thủ công với node DOM của _một_ component khác có thể khiến code của bạn dễ hỏng.
</Pitfall>

Bạn có thể truyền refs từ component cha xuống component con [giống như mọi prop khác](/learn/passing-props-to-a-component).

```js {3-4,9}
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

Trong ví dụ trên, một ref được tạo trong component cha, `MyForm`, và được truyền vào component con, `MyInput`. `MyInput` sau đó truyền ref vào `<input>`. Vì `<input>` là một [built-in component](/reference/react-dom/components/common), React đặt thuộc tính `.current` của ref thành phần tử DOM `<input>`.

`inputRef` được tạo trong `MyForm` giờ đây trỏ đến phần tử DOM `<input>` được trả về bởi `MyInput`. Một click handler được tạo trong `MyForm` có thể truy cập `inputRef` và gọi `focus()` để focus `<input>`.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<DeepDive>

#### Expose một phần API bằng imperative handle {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

Trong ví dụ trên, ref được truyền vào `MyInput` được truyền tiếp đến phần tử DOM input ban đầu. Điều này cho phép component cha gọi `focus()` trên nó. Tuy nhiên, điều này cũng cho phép component cha làm những việc khác--ví dụ: thay đổi CSS style của nó. Trong những trường hợp không phổ biến, bạn có thể muốn giới hạn chức năng được expose. Bạn có thể thực hiện việc đó bằng [`useImperativeHandle`](/reference/react/useImperativeHandle):

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Chỉ expose focus, không expose gì khác
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

</Sandpack>

Ở đây, `realInputRef` bên trong `MyInput` chứa node DOM input thực tế. Tuy nhiên, [`useImperativeHandle`](/reference/react/useImperativeHandle) yêu cầu React cung cấp object đặc biệt của riêng bạn làm giá trị của ref cho component cha. Vì vậy, `inputRef.current` bên trong component `Form` sẽ chỉ có method `focus`. Trong trường hợp này, "handle" của ref không phải là node DOM mà là object tùy chỉnh bạn tạo bên trong lời gọi [`useImperativeHandle`](/reference/react/useImperativeHandle).

</DeepDive>

## Khi React gắn các ref {/*when-react-attaches-the-refs*/}

Trong React, mỗi lần update được chia thành [hai phase](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Trong **render,** React gọi các component của bạn để xác định nội dung cần hiển thị trên màn hình.
* Trong **commit,** React áp dụng các thay đổi vào DOM.

Nhìn chung, bạn [không muốn](/learn/referencing-values-with-refs#best-practices-for-refs) truy cập refs trong quá trình render. Điều này cũng áp dụng cho các ref chứa node DOM. Trong lần render đầu tiên, các node DOM chưa được tạo, vì vậy `ref.current` sẽ là `null`. Trong quá trình render các lần update, các node DOM cũng chưa được cập nhật. Vì vậy, đọc chúng vào thời điểm này là quá sớm.

React thiết lập `ref.current` trong quá trình commit. Trước khi cập nhật DOM, React đặt các giá trị `ref.current` bị ảnh hưởng thành `null`. Sau khi cập nhật DOM, React lập tức đặt chúng thành các node DOM tương ứng.

**Thông thường, bạn sẽ truy cập refs từ các event handler.** Nếu bạn muốn thực hiện việc gì đó với một ref nhưng không có event cụ thể nào để thực hiện, bạn có thể cần một Effect. Chúng ta sẽ thảo luận về Effects ở các trang tiếp theo.

<DeepDive>

#### Flushing các state update một cách đồng bộ với flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Hãy xem đoạn code như sau: đoạn code này thêm một todo mới và cuộn màn hình xuống đến phần tử cuối cùng của danh sách. Lưu ý rằng vì một lý do nào đó, nó luôn cuộn đến todo *ngay trước* todo vừa được thêm cuối cùng:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

Vấn đề nằm ở hai dòng này:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

Trong React, [các state update được xếp vào hàng đợi.](/learn/queueing-a-series-of-state-updates) Thông thường, đây là điều bạn muốn. Tuy nhiên, trong trường hợp này, nó gây ra vấn đề vì `setTodos` không cập nhật DOM ngay lập tức. Vì vậy, tại thời điểm bạn cuộn danh sách đến phần tử cuối cùng, todo vẫn chưa được thêm vào. Đây là lý do việc cuộn luôn “chậm hơn” một item.

Để khắc phục vấn đề này, bạn có thể buộc React cập nhật (“flush”) DOM một cách đồng bộ. Để làm vậy, hãy import `flushSync` từ `react-dom` và **bọc state update** trong một lời gọi `flushSync`:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Thao tác này sẽ yêu cầu React cập nhật DOM một cách đồng bộ ngay sau khi code được bọc trong `flushSync` thực thi. Do đó, todo cuối cùng sẽ có sẵn trong DOM vào thời điểm bạn cố cuộn đến nó:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Các phương pháp hay nhất để thao tác DOM với refs {/*best-practices-for-dom-manipulation-with-refs*/}

Refs là một cơ chế “thoát” (escape hatch). Bạn chỉ nên sử dụng chúng khi cần “bước ra ngoài React”. Các ví dụ phổ biến bao gồm quản lý focus, vị trí cuộn hoặc gọi các browser API mà React không cung cấp.

Nếu bạn chỉ thực hiện những thao tác không mang tính phá hủy như focus và cuộn, bạn sẽ không gặp vấn đề gì. Tuy nhiên, nếu cố **sửa đổi** DOM theo cách thủ công, bạn có thể gây xung đột với những thay đổi mà React đang thực hiện.

Để minh họa vấn đề này, ví dụ sau có một thông báo chào mừng và hai nút. Nút đầu tiên bật/tắt sự hiện diện của thông báo bằng [conditional rendering](/learn/conditional-rendering) và [state](/learn/state-a-components-memory), giống như cách bạn thường làm trong React. Nút thứ hai sử dụng [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) để buộc xóa thông báo khỏi DOM mà không thông qua React.

Hãy thử nhấn “Toggle with setState” vài lần. Thông báo sẽ biến mất rồi xuất hiện lại. Sau đó nhấn “Remove from the DOM”. Thao tác này sẽ buộc xóa thông báo. Cuối cùng, hãy nhấn “Toggle with setState”:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

Sau khi bạn đã xóa phần tử DOM theo cách thủ công, việc cố sử dụng `setState` để hiển thị lại phần tử đó sẽ dẫn đến crash. Nguyên nhân là bạn đã thay đổi DOM và React không biết cách tiếp tục quản lý DOM một cách chính xác.

**Tránh thay đổi các node DOM do React quản lý.** Việc sửa đổi, thêm children vào hoặc xóa children khỏi các phần tử do React quản lý có thể dẫn đến kết quả hiển thị không nhất quán hoặc các crash như trên.

Tuy nhiên, điều này không có nghĩa là bạn hoàn toàn không thể làm vậy. Bạn cần thận trọng. **Bạn có thể sửa đổi an toàn những phần DOM mà React _không có lý do_ để cập nhật.** Ví dụ, nếu một `<div>` nào đó luôn rỗng trong JSX, React sẽ không có lý do để động đến danh sách children của nó. Vì vậy, bạn có thể an toàn thêm hoặc xóa các phần tử ở đó theo cách thủ công.

<Recap>

- Refs là một khái niệm tổng quát, nhưng thường được dùng nhất để lưu các phần tử DOM.
- Bạn yêu cầu React đặt một node DOM vào `myRef.current` bằng cách truyền `<div ref={myRef}>`.
- Thông thường, bạn sẽ dùng refs cho các thao tác không mang tính phá hủy như focus, cuộn hoặc đo các phần tử DOM.
- Theo mặc định, một component không expose các node DOM của nó. Bạn có thể chọn expose một node DOM bằng cách sử dụng prop `ref`.
- Tránh thay đổi các node DOM do React quản lý.
- Nếu bạn có sửa đổi các node DOM do React quản lý, hãy chỉ sửa đổi những phần mà React không có lý do để cập nhật.

</Recap>



<Challenges>

#### Phát và tạm dừng video {/*play-and-pause-the-video*/}

Trong ví dụ này, nút sẽ bật/tắt một state variable để chuyển đổi giữa trạng thái đang phát và tạm dừng. Tuy nhiên, để thực sự phát hoặc tạm dừng video, chỉ bật/tắt state là chưa đủ. Bạn cũng cần gọi [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) và [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) trên DOM element của `<video>`. Hãy thêm một ref vào đó và làm cho nút hoạt động.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Để thử thách hơn, hãy giữ nút “Play” đồng bộ với trạng thái đang phát của video, ngay cả khi người dùng nhấp chuột phải vào video và phát video bằng các media controls tích hợp của trình duyệt. Bạn có thể muốn lắng nghe `onPlay` và `onPause` trên video để thực hiện việc này.

<Solution>

Khai báo một ref và đặt nó lên phần tử `<video>`. Sau đó gọi `ref.current.play()` và `ref.current.pause()` trong event handler, tùy thuộc vào state tiếp theo.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Để xử lý các controls tích hợp của trình duyệt, bạn có thể thêm các handler `onPlay` và `onPause` vào phần tử `<video>`, rồi gọi `setIsPlaying` từ các handler đó. Nhờ vậy, nếu người dùng phát video bằng các controls của trình duyệt, state sẽ được điều chỉnh tương ứng.

</Solution>

#### Focus vào trường tìm kiếm {/*focus-the-search-field*/}

Hãy làm cho việc nhấp vào nút “Search” đưa focus vào trường tìm kiếm.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Thêm một ref vào input và gọi `focus()` trên node DOM để đưa focus vào đó:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Cuộn carousel hình ảnh {/*scrolling-an-image-carousel*/}

Carousel hình ảnh này có một nút “Next” để chuyển sang hình ảnh đang active. Hãy làm cho gallery cuộn theo chiều ngang đến hình ảnh active khi nhấp vào nút. Bạn sẽ cần gọi [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) trên node DOM của hình ảnh active:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Bạn không cần có một ref cho mọi hình ảnh trong bài tập này. Chỉ cần có một ref đến hình ảnh hiện đang active hoặc đến chính danh sách là đủ. Sử dụng `flushSync` để đảm bảo DOM được cập nhật *trước* khi bạn cuộn.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

Bạn có thể khai báo một `selectedRef`, sau đó chỉ truyền nó có điều kiện cho hình ảnh hiện tại:

```js
<li ref={index === i ? selectedRef : null}>
```

Khi `index === i`, nghĩa là hình ảnh đó là hình ảnh được chọn, `<li>` sẽ nhận `selectedRef`. React sẽ đảm bảo rằng `selectedRef.current` luôn trỏ đến đúng node DOM.

Lưu ý rằng lời gọi `flushSync` là cần thiết để buộc React cập nhật DOM trước khi cuộn. Nếu không, `selectedRef.current` sẽ luôn trỏ đến item được chọn trước đó.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### Focus vào trường tìm kiếm với các component riêng biệt {/*focus-the-search-field-with-separate-components*/}

Hãy làm cho việc nhấp vào nút “Search” đưa focus vào trường tìm kiếm. Lưu ý rằng mỗi component được định nghĩa trong một file riêng và không nên được di chuyển ra khỏi file đó. Bạn kết nối chúng với nhau như thế nào?

<Hint>

Bạn sẽ cần truyền `ref` dưới dạng prop để cho phép expose một node DOM từ component của chính bạn, chẳng hạn như `SearchInput`.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Bạn sẽ cần thêm một prop `onClick` vào `SearchButton`, đồng thời để `SearchButton` truyền prop đó xuống `<button>` của trình duyệt. Bạn cũng sẽ truyền một ref xuống `<SearchInput>`, component này sẽ chuyển tiếp ref đó đến `<input>` thực tế và gán giá trị cho nó. Cuối cùng, trong click handler, bạn sẽ gọi `focus` trên node DOM được lưu bên trong ref đó.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
