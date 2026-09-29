---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` là một React Hook cho phép bạn tùy chỉnh handle được expose dưới dạng [ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Gọi `useImperativeHandle` ở cấp cao nhất của component để tùy chỉnh ref handle mà component expose:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `ref`: `ref` mà bạn nhận được dưới dạng prop của component `MyInput`.

* `createHandle`: Một function không nhận đối số và trả về ref handle mà bạn muốn expose. Ref handle đó có thể có bất kỳ kiểu nào. Thông thường, bạn sẽ trả về một object chứa các method mà bạn muốn expose.

* **tùy chọn** `dependencies`: Danh sách tất cả các giá trị reactive được tham chiếu bên trong đoạn code `createHandle`. Các giá trị reactive bao gồm props, state, cùng tất cả các biến và function được khai báo trực tiếp bên trong phần thân component. Nếu linter của bạn được [cấu hình cho React](/learn/editor-setup#linting), nó sẽ kiểm tra để đảm bảo mọi giá trị reactive đều được chỉ định chính xác dưới dạng dependency. Danh sách dependency phải có số lượng phần tử cố định và được viết inline như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó bằng phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Nếu một lần re-render làm thay đổi một dependency nào đó, hoặc nếu bạn bỏ qua đối số này, function `createHandle` của bạn sẽ thực thi lại và handle vừa được tạo sẽ được gán cho ref.

<Note>

Bắt đầu từ React 19, [`ref` có sẵn dưới dạng prop.](/blog/2024/12/05/react-19#ref-as-a-prop) Trong React 18 và các phiên bản trước đó, bạn cần lấy `ref` từ [`forwardRef`.](/reference/react/forwardRef)

</Note>

#### Giá trị trả về {/*returns*/}

`useImperativeHandle` trả về `undefined`.

---

## Cách sử dụng {/*usage*/}

### Expose một custom ref handle cho component cha {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Để expose một DOM node cho phần tử cha, truyền prop `ref` vào node đó.

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

Với đoạn code trên, [một ref tới `MyInput` sẽ nhận DOM node `<input>`.](/learn/manipulating-the-dom-with-refs) Tuy nhiên, bạn có thể expose một giá trị tùy chỉnh thay thế. Để tùy chỉnh handle được expose, hãy gọi `useImperativeHandle` ở cấp cao nhất của component:

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);

  return <input />;
};
```

Lưu ý rằng trong đoạn code trên, `ref` không còn được truyền tới `<input>` nữa.

Ví dụ, giả sử bạn không muốn expose toàn bộ DOM node `<input>`, nhưng muốn expose hai method của nó: `focus` và `scrollIntoView`. Để thực hiện việc này, hãy giữ DOM thực của trình duyệt trong một ref riêng. Sau đó dùng `useImperativeHandle` để expose một handle chỉ chứa các method mà bạn muốn component cha gọi:

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input ref={inputRef} />;
};
```

Bây giờ, nếu component cha lấy một ref tới `MyInput`, nó sẽ có thể gọi các method `focus` và `scrollIntoView` trên đó. Tuy nhiên, nó sẽ không có toàn quyền truy cập vào DOM node `<input>` bên dưới.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
};

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Expose các method imperative của riêng bạn {/*exposing-your-own-imperative-methods*/}

Các method bạn expose thông qua imperative handle không nhất thiết phải khớp chính xác với các method DOM. Ví dụ, component `Post` này expose một method `scrollAndFocusAddComment` thông qua imperative handle. Điều này cho phép component cha `Page` cuộn danh sách comment *và* focus vào trường input khi bạn nhấp vào nút:

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

function AddComment({ ref }) {
  return <input placeholder="Add comment..." ref={ref} />;
}

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**Không nên lạm dụng ref.** Bạn chỉ nên dùng ref cho những hành vi *imperative* mà bạn không thể biểu đạt bằng prop: ví dụ như cuộn tới một node, focus vào một node, kích hoạt animation, chọn văn bản, v.v.

**Nếu bạn có thể biểu đạt điều gì đó bằng prop, bạn không nên dùng ref.** Ví dụ, thay vì expose một imperative handle như `{ open, close }` từ component `Modal`, tốt hơn là nhận `isOpen` dưới dạng prop như `<Modal isOpen={isOpen} />`. [Effect](/learn/synchronizing-with-effects) có thể giúp bạn expose các hành vi imperative thông qua prop.

</Pitfall>