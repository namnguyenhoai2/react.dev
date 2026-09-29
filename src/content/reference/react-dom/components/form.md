---
title: "<form>"
---

<Intro>

[component `<form>`tích hợp sẵn trong trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) cho phép bạn tạo các control tương tác để gửi thông tin.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `<form>` {/*form*/}

Để tạo các control tương tác nhằm gửi thông tin, hãy render [component `<form>`tích hợp sẵn trong trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<form>` hỗ trợ tất cả [props phần tử thông dụng.](/reference/react-dom/components/common#common-props)

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): một URL hoặc function. Khi truyền URL vào `action`, form sẽ hoạt động giống component form HTML. Khi truyền function vào `action`, function đó sẽ xử lý việc gửi form trong một Transition theo [mẫu Action prop](/reference/react/useTransition#exposing-action-props-from-components). Function được truyền vào `action` có thể là async và sẽ được gọi với một đối số duy nhất chứa [dữ liệu form](https://developer.mozilla.org/en-US/docs/Web/API/FormData) của form đã gửi. Có thể ghi đè prop `action` bằng thuộc tính `formAction` trên component `<button>`, `<input type="submit">` hoặc `<input type="image">`.

#### Lưu ý {/*caveats*/}

* Khi truyền function vào `action` hoặc `formAction`, HTTP method sẽ luôn là POST bất kể giá trị của prop `method`.

---

## Cách sử dụng {/*usage*/}

### Xử lý việc gửi form bằng event handler {/*handle-form-submission-with-an-event-handler*/}

Truyền một function vào event handler `onSubmit` để chạy code khi form được gửi. Theo mặc định, trình duyệt gửi dữ liệu form đến URL hiện tại và refresh trang, vì vậy hãy gọi [`e.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) để ghi đè hành vi đó.

Ví dụ này đọc các giá trị đã gửi bằng [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), phương thức này thu thập mọi field theo `name`. Điều này giữ cho các input ở trạng thái [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). Nếu thay vào đó bạn [điều khiển một input bằng state](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable), hãy đọc state đó khi submit thay vì đọc từ `FormData`.

<Sandpack>

```js src/App.js
export default function Search() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

<Note>

Đọc dữ liệu form bằng `onSubmit` hoạt động trong mọi phiên bản React và cho phép bạn truy cập trực tiếp vào [submit event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event), nhờ đó bạn có thể gọi `e.preventDefault()` và tự đọc dữ liệu. Việc truyền function vào prop `action` sẽ chạy quá trình gửi trong một [Transition](/reference/react/useTransition). Sau đó, React sẽ theo dõi trạng thái đang chờ, gửi các lỗi được throw đến error boundary gần nhất, đồng thời cho phép form hoạt động với [`useActionState`](/reference/react/useActionState) và [`useOptimistic`](/reference/react/useOptimistic). Một `action` cũng có thể là một [Server Function](/reference/rsc/server-functions), điều mà `onSubmit` không hỗ trợ.

</Note>

### Xử lý việc gửi form bằng action prop {/*handle-form-submission-with-an-action-prop*/}

Truyền một function vào prop `action` của form để chạy function đó khi form được gửi. [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) sẽ được truyền vào function dưới dạng đối số, để bạn có thể truy cập dữ liệu được form gửi đi. Điều này khác với [HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action) thông thường, vốn chỉ chấp nhận URL. Không giống `onSubmit`, một `action` chạy trong một [Transition](/reference/react/useTransition) và không cần gọi `e.preventDefault()`. Sau khi function `action` chạy thành công, mọi field element uncontrolled trong form sẽ được reset.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

### Xử lý việc gửi form bằng Server Function {/*handle-form-submission-with-a-server-function*/}

Render một `<form>` cùng với input và nút submit. Truyền một Server Function (function được đánh dấu bằng [`'use server'`](/reference/rsc/use-server)) vào prop `action` của form để chạy function đó khi form được gửi.

Việc truyền Server Function vào `<form action>` cho phép người dùng gửi form mà không cần bật JavaScript hoặc trước khi code được tải xong. Điều này hữu ích cho người dùng có kết nối hoặc thiết bị chậm, hoặc đã tắt JavaScript, và tương tự cách form hoạt động khi truyền URL vào prop `action`.

Bạn có thể sử dụng các field form ẩn để cung cấp dữ liệu cho action của `<form>`. Server Function sẽ được gọi với dữ liệu từ field form ẩn dưới dạng một instance của [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Add to Cart</button>
    </form>

  );
}
```

Thay vì sử dụng field form ẩn để cung cấp dữ liệu cho action của `<form>`, bạn có thể gọi method <CodeStep step={1}>`bind`</CodeStep> để cung cấp thêm các đối số. Method này sẽ bind một đối số mới (<CodeStep step={2}>`productId`</CodeStep>) vào function, ngoài <CodeStep step={3}>`formData`</CodeStep> được truyền làm đối số cho function.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

Khi `<form>` được render bởi một [Server Component](/reference/rsc/use-client), và một [Server Function](/reference/rsc/server-functions) được truyền vào prop `action` của `<form>`, form sẽ được [progressively enhanced](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

### Hiển thị trạng thái đang chờ trong khi gửi form {/*display-a-pending-state-during-form-submission*/}

Để hiển thị trạng thái đang chờ khi form đang được gửi, bạn có thể gọi Hook `useFormStatus` trong một component được render bên trong `<form>` và đọc thuộc tính `pending` được trả về.

Ở đây, chúng ta sử dụng thuộc tính `pending` để cho biết form đang được gửi.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

Để tìm hiểu thêm về Hook `useFormStatus`, hãy xem [tài liệu tham chiếu](/reference/react-dom/hooks/useFormStatus).

### Cập nhật dữ liệu form theo hướng lạc quan {/*optimistically-updating-form-data*/}

Hook `useOptimistic` cung cấp một cách để cập nhật giao diện người dùng theo hướng lạc quan trước khi một thao tác chạy nền, chẳng hạn như network request, hoàn tất. Trong ngữ cảnh form, kỹ thuật này giúp ứng dụng có cảm giác phản hồi nhanh hơn. Khi người dùng gửi form, thay vì chờ response từ server để phản ánh các thay đổi, giao diện sẽ được cập nhật ngay với kết quả dự kiến.

Ví dụ, khi người dùng nhập tin nhắn vào form và nhấn nút "Send", Hook `useOptimistic` cho phép tin nhắn xuất hiện ngay trong danh sách với nhãn "Sending...", ngay cả trước khi tin nhắn thực sự được gửi đến server. Cách tiếp cận "optimistic" này tạo cảm giác nhanh chóng và phản hồi tức thì. Sau đó, form sẽ cố gắng gửi tin nhắn thực sự ở chế độ nền. Khi server xác nhận đã nhận được tin nhắn, nhãn "Sending..." sẽ bị xóa.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

[//]: # 'Bỏ comment dòng tiếp theo và xóa dòng này sau khi trang tài liệu tham chiếu `useOptimistic` được phát hành'
[//]: # 'Để tìm hiểu thêm về Hook `useOptimistic`, hãy xem [tài liệu tham chiếu](/reference/react/useOptimistic).'

### Xử lý lỗi khi gửi form {/*handling-form-submission-errors*/}

Trong một số trường hợp, function được gọi bởi prop `action` của `<form>` sẽ throw một error. Bạn có thể xử lý các error này bằng cách bọc `<form>` trong một Error Boundary. Nếu function được gọi bởi prop `action` của `<form>` throw một error, fallback của error boundary sẽ được hiển thị.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Hiển thị lỗi khi gửi form mà không cần JavaScript {/*display-a-form-submission-error-without-javascript*/}

Việc hiển thị thông báo lỗi khi gửi form trước khi bundle JavaScript được tải để progressive enhancement yêu cầu:

1. `<form>` được render bởi một [Client Component](/reference/rsc/use-client)
1. hàm được truyền vào prop `action` của `<form>` phải là một [Server Function](/reference/rsc/server-functions)
1. sử dụng Hook `useActionState` để hiển thị thông báo lỗi

`useActionState` nhận hai tham số: một [Server Function](/reference/rsc/server-functions) và một state ban đầu. `useActionState` trả về hai giá trị: một biến state và một action. Action được `useActionState` trả về nên được truyền vào prop `action` của form. Biến state được `useActionState` trả về có thể được dùng để hiển thị thông báo lỗi. Giá trị được Server Function truyền vào `useActionState` trả về sẽ được dùng để cập nhật biến state.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("This email address has already been added");
  }
  emails.push(newEmail);
}
```

</Sandpack>

Tìm hiểu thêm về cách cập nhật state từ một form action trong tài liệu [`useActionState`](/reference/react/useActionState)

### Xử lý nhiều kiểu gửi {/*handling-multiple-submission-types*/}

Có thể thiết kế form để xử lý nhiều action gửi khác nhau dựa trên nút mà người dùng nhấn. Mỗi nút bên trong form có thể được liên kết với một action hoặc hành vi riêng bằng cách thiết lập prop `formAction`.

Khi người dùng nhấn một nút cụ thể, form được gửi và action tương ứng, được xác định bởi các thuộc tính và action của nút đó, sẽ được thực thi. Ví dụ, một form có thể gửi bài viết để duyệt theo mặc định nhưng có một nút riêng với `formAction` được thiết lập để lưu bài viết dưới dạng bản nháp.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

</Sandpack>