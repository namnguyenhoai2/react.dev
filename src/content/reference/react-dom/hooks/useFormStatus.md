---
title: useFormStatus
---

<Intro>

`useFormStatus` là một Hook cung cấp cho bạn thông tin trạng thái của lần gửi biểu mẫu gần nhất.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

Hook `useFormStatus` cung cấp thông tin trạng thái của lần gửi biểu mẫu gần nhất.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

Để lấy thông tin trạng thái, component `Submit` phải được render bên trong một `<form>`. Hook trả về các thông tin như thuộc tính <CodeStep step={1}>`pending`</CodeStep>, cho biết biểu mẫu có đang được gửi hay không.

Trong ví dụ trên, `Submit` sử dụng thông tin này để vô hiệu hóa các lần nhấn `<button>` trong khi biểu mẫu đang được gửi.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

`useFormStatus` không nhận tham số nào.

#### Giá trị trả về {/*returns*/}

Một đối tượng `status` với các thuộc tính sau:

* `pending`: Một boolean. Nếu `true`, điều này có nghĩa là `<form>` cha đang chờ được gửi. Nếu không, `false`.

* `data`: Một đối tượng triển khai [`FormData interface`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), chứa dữ liệu mà `<form>` cha đang gửi. Nếu không có lần gửi đang hoạt động hoặc không có `<form>` cha, giá trị sẽ là `null`.

* `method`: Một giá trị chuỗi là `'get'` hoặc `'post'`. Giá trị này cho biết `<form>` cha đang gửi bằng `GET` hay `POST` [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods). Theo mặc định, một `<form>` sẽ sử dụng method `GET`, và có thể được chỉ định bằng thuộc tính [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

[//]: # (Liên kết đến tài liệu `<form>`. "Đọc thêm về prop `action` trên `<form>`.")
* `action`: Một tham chiếu đến hàm được truyền vào prop `action` trên `<form>` cha. Nếu không có `<form>` cha, thuộc tính này là `null`. Nếu có giá trị URI được cung cấp cho prop `action`, hoặc không chỉ định prop `action`, `status.action` sẽ là `null`.

#### Lưu ý {/*caveats*/}

* Hook `useFormStatus` phải được gọi từ một component được render bên trong một `<form>`.
* `useFormStatus` chỉ trả về thông tin trạng thái cho `<form>` cha. Nó sẽ không trả về thông tin trạng thái cho bất kỳ `<form>` nào được render trong cùng component hoặc các component con đó.

---

## Cách sử dụng {/*usage*/}

### Hiển thị trạng thái đang chờ trong khi gửi biểu mẫu {/*display-a-pending-state-during-form-submission*/}
Để hiển thị trạng thái đang chờ trong khi biểu mẫu đang được gửi, bạn có thể gọi Hook `useFormStatus` trong một component được render bên trong `<form>` và đọc thuộc tính `pending` được trả về.

Ở đây, chúng ta sử dụng thuộc tính `pending` để cho biết biểu mẫu đang được gửi.

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

<Pitfall>

##### `useFormStatus` sẽ không trả về thông tin trạng thái cho một `<form>` được render trong cùng component. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

Hook `useFormStatus` chỉ trả về thông tin trạng thái cho một `<form>` cha, không phải cho bất kỳ `<form>` nào được render trong cùng component gọi Hook hoặc trong các component con.

```js
function Form() {
  // 🚩 `pending` sẽ không bao giờ là true
  // useFormStatus không theo dõi form được render trong component này
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

Thay vào đó, hãy gọi `useFormStatus` từ bên trong một component nằm bên trong `<form>`.

```js
function Submit() {
  // ✅ `pending` sẽ được lấy từ form bọc component Submit
  const { pending } = useFormStatus();
  return <button disabled={pending}>...</button>;
}

function Form() {
      // Đây là <form> mà `useFormStatus` theo dõi
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### Đọc dữ liệu biểu mẫu đang được gửi {/*read-form-data-being-submitted*/}

Bạn có thể sử dụng thuộc tính `data` của thông tin trạng thái được trả về từ `useFormStatus` để hiển thị dữ liệu mà người dùng đang gửi.

Ở đây, chúng ta có một biểu mẫu cho phép người dùng yêu cầu một username. Chúng ta có thể sử dụng `useFormStatus` để hiển thị tạm thời một thông báo trạng thái xác nhận username mà họ đã yêu cầu.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

</Sandpack>

---

## Khắc phục sự cố {/*troubleshooting*/}

### `status.pending` không bao giờ là `true` {/*pending-is-never-true*/}

`useFormStatus` chỉ trả về thông tin trạng thái cho một `<form>` cha.

Nếu component gọi `useFormStatus` không được lồng bên trong một `<form>`, `status.pending` sẽ luôn trả về `false`. Hãy xác minh rằng `useFormStatus` được gọi trong một component là con của phần tử `<form>`.

`useFormStatus` sẽ không theo dõi trạng thái của một `<form>` được render trong cùng component. Xem [Cạm bẫy](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component) để biết thêm chi tiết.
