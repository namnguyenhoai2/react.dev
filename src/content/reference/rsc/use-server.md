---
title: "'use server'"
titleForTitleTag: Chỉ thị "'use server'"
---

<RSC>

`'use server'` được dùng để [sử dụng React Server Components](/reference/rsc/server-components).

</RSC>


<Intro>

`'use server'` đánh dấu các hàm phía server có thể được gọi từ code phía client.

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `'use server'` {/*use-server*/}

Thêm `'use server'` ở đầu thân của một hàm async để đánh dấu rằng hàm đó có thể được client gọi. Chúng ta gọi các hàm này là [_Server Functions_](/reference/rsc/server-functions).

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

Khi gọi một Server Function từ client, hàm sẽ gửi một network request đến server, trong đó bao gồm bản sao đã được serialized của mọi đối số được truyền vào. Nếu Server Function trả về một giá trị, giá trị đó sẽ được serialized và trả về client.

Thay vì đánh dấu riêng lẻ các hàm bằng `'use server'`, bạn có thể thêm directive này ở đầu một file để đánh dấu tất cả các export trong file đó là Server Functions có thể được sử dụng ở bất kỳ đâu, bao gồm cả việc import trong code client.

#### Lưu ý {/*caveats*/}
* `'use server'` phải nằm ở ngay đầu hàm hoặc module; phía trên mọi code khác, bao gồm cả import (có thể đặt comment phía trên directive).
* `'use server'` chỉ có thể được sử dụng trong các file phía server. Các Server Functions kết quả có thể được truyền đến Client Components thông qua props. Xem các [kiểu được hỗ trợ để serialization](#serializable-parameters-and-return-values).
* Để import một Server Function từ [code client](/reference/rsc/use-client), directive phải được sử dụng ở cấp module.
* Vì các network call bên dưới luôn là bất đồng bộ, `'use server'` chỉ có thể được sử dụng trên các hàm async.
* Luôn coi các đối số của Server Functions là input không đáng tin cậy và xác thực quyền đối với mọi mutation. Xem [các lưu ý về bảo mật](#security).
* Server Functions nên được gọi trong một [Transition](/reference/react/useTransition). Các Server Functions được truyền đến [`<form action>`](/reference/react-dom/components/form#props) hoặc [`formAction`](/reference/react-dom/components/input#props) sẽ tự động được gọi trong một transition.
* Server Functions được thiết kế cho các mutation cập nhật state phía server; không nên dùng chúng để lấy dữ liệu. Vì vậy, các framework triển khai Server Functions thường xử lý từng action một và không có cách cache giá trị trả về.

### Lưu ý về bảo mật {/*security*/}

Các đối số của Server Functions hoàn toàn do client kiểm soát. Vì lý do bảo mật, luôn coi chúng là input không đáng tin cậy, đồng thời bảo đảm xác thực và escape các đối số khi thích hợp.

Trong mọi Server Function, hãy bảo đảm xác thực rằng user đã đăng nhập được phép thực hiện action đó.

<Wip>

Để ngăn việc gửi dữ liệu nhạy cảm từ một Server Function, có các taint API thử nghiệm nhằm ngăn các giá trị và object duy nhất được truyền đến code client.

Xem [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) và [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Các đối số và giá trị trả về có thể serialize {/*serializable-parameters-and-return-values*/}

Vì code client gọi Server Function qua network, mọi đối số được truyền vào đều phải có thể serialize.

Sau đây là các kiểu được hỗ trợ cho đối số của Server Function:

* Kiểu nguyên thủy
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), chỉ các symbol được đăng ký trong global Symbol registry thông qua [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Các iterable chứa các giá trị có thể serialize
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) và [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Các instance của [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* Các [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) thuần túy: những object được tạo bằng [object initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), với các property có thể serialize
* Các function là Server Functions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Đáng chú ý, các kiểu sau không được hỗ trợ:
* Các React element hoặc [JSX](/learn/writing-markup-with-jsx)
* Các function, bao gồm function của component hoặc bất kỳ function nào khác không phải là Server Function
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Các object là instance của bất kỳ class nào (ngoài các built-in đã đề cập) hoặc các object có [prototype là null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Các symbol chưa được đăng ký global, ví dụ `Symbol('my new symbol')`
* Các event từ event handler


Các giá trị trả về có thể serialize được hỗ trợ cũng giống như [props có thể serialize](/reference/rsc/use-client#serializable-types) cho một Client Component ở boundary.


## Cách sử dụng {/*usage*/}

### Server Functions trong form {/*server-functions-in-forms*/}

Trường hợp sử dụng phổ biến nhất của Server Functions là gọi các function thực hiện mutation dữ liệu. Trên trình duyệt, [phần tử HTML form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) là cách truyền thống để user gửi một mutation. Với React Server Components, React cung cấp hỗ trợ tích hợp sẵn cho Server Functions dưới dạng Actions trong [form](/reference/react-dom/components/form).

Sau đây là một form cho phép user yêu cầu username.

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

Trong ví dụ này, `requestUsername` là một Server Function được truyền đến `<form>`. Khi user gửi form này, sẽ có một network request đến server function `requestUsername`. Khi gọi một Server Function trong form, React sẽ cung cấp <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> của form làm đối số đầu tiên cho Server Function.

Bằng cách truyền một Server Function vào `action` của form, React có thể [progressively enhance](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) form. Điều này có nghĩa là form có thể được gửi trước khi JavaScript bundle được tải.

#### Xử lý giá trị trả về trong form {/*handling-return-values*/}

Trong form yêu cầu username, có thể xảy ra trường hợp username không khả dụng. `requestUsername` sẽ cho chúng ta biết request có thất bại hay không.

Để cập nhật UI dựa trên kết quả của một Server Function đồng thời hỗ trợ progressive enhancement, hãy sử dụng [`useActionState`](/reference/react/useActionState).

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

Lưu ý rằng, cũng như hầu hết các Hook, `useActionState` chỉ có thể được gọi trong <CodeStep step={1}>[code client](/reference/rsc/use-client)</CodeStep>.

### Gọi Server Function bên ngoài `<form>` {/*calling-a-server-function-outside-of-form*/}

Server Functions là các server endpoint được expose và có thể được gọi ở bất kỳ đâu trong code client.

Khi sử dụng Server Function bên ngoài [form](/reference/react-dom/components/form), hãy gọi Server Function trong một [Transition](/reference/react/useTransition), cho phép bạn hiển thị chỉ báo đang tải, hiển thị [optimistic state updates](/reference/react/useOptimistic), và xử lý các lỗi không mong muốn. Forms sẽ tự động bao bọc Server Functions trong các transition.

```js {9-14}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      startTransition(() => {
        setLikeCount(currentCount);
      });
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

Để đọc giá trị trả về của một Server Function, bạn cần `await` promise được trả về.