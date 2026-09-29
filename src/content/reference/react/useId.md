---
title: useId
---

<Intro>

`useId` là một React Hook dùng để tạo các ID duy nhất có thể truyền vào các thuộc tính accessibility.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Tài liệu tham khảo {/*reference*/}

### `useId()` {/*useid*/}

Gọi `useId` ở cấp cao nhất của component để tạo một ID duy nhất:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

`useId` không nhận tham số nào.

#### Giá trị trả về {/*returns*/}

`useId` trả về một chuỗi ID duy nhất được liên kết với lần gọi `useId` cụ thể này trong component cụ thể này.

#### Lưu ý {/*caveats*/}

* `useId` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component hoặc các Hook của riêng bạn**. Bạn không thể gọi nó bên trong vòng lặp hoặc điều kiện. Nếu cần làm vậy, hãy tách thành một component mới và chuyển state vào đó.

* `useId` **không nên được dùng để tạo cache key** cho [use()](/reference/react/use). ID ổn định khi component được mount nhưng có thể thay đổi trong quá trình render. Cache key nên được tạo từ dữ liệu của bạn.

* `useId` **không nên được dùng để tạo key** trong một list. [Key nên được tạo từ dữ liệu của bạn.](/learn/rendering-lists#where-to-get-your-key)

* `useId` hiện chưa thể được sử dụng trong [async Server Components](/reference/rsc/server-components#async-components-with-server-components).

---

## Cách sử dụng {/*usage*/}

<Pitfall>

**Không gọi `useId` để tạo key trong một list.** [Key nên được tạo từ dữ liệu của bạn.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Tạo ID duy nhất cho các thuộc tính accessibility {/*generating-unique-ids-for-accessibility-attributes*/}

Gọi `useId` ở cấp cao nhất của component để tạo một ID duy nhất:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Sau đó, bạn có thể truyền <CodeStep step={1}>ID đã tạo</CodeStep> vào các thuộc tính khác nhau:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Hãy cùng xem qua một ví dụ để biết khi nào cách này hữu ích.**

[Các thuộc tính accessibility của HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) như [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) cho phép bạn chỉ định rằng hai thẻ có liên quan với nhau. Ví dụ, bạn có thể chỉ định rằng một phần tử (chẳng hạn như input) được mô tả bởi một phần tử khác (chẳng hạn như đoạn văn).

Trong HTML thông thường, bạn sẽ viết như sau:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

Tuy nhiên, hardcode ID như vậy không phải là một thực hành tốt trong React. Một component có thể được render nhiều hơn một lần trên trang--nhưng ID phải là duy nhất! Thay vì hardcode một ID, hãy tạo một ID duy nhất bằng `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

Giờ đây, ngay cả khi `PasswordField` xuất hiện nhiều lần trên màn hình, các ID được tạo sẽ không bị trùng.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[Xem video này](https://www.youtube.com/watch?v=0dNzNcuEuOo) để thấy sự khác biệt trong trải nghiệm người dùng với các công nghệ hỗ trợ.

<Pitfall>

Với [server rendering](/reference/react-dom/server), **`useId` yêu cầu cây component trên server và client phải giống hệt nhau**. Nếu các cây bạn render trên server và client không khớp chính xác, các ID được tạo sẽ không khớp.

</Pitfall>

<DeepDive>

#### Vì sao useId tốt hơn bộ đếm tăng dần? {/*why-is-useid-better-than-an-incrementing-counter*/}

Có thể bạn thắc mắc vì sao `useId` tốt hơn việc tăng dần một biến global như `nextId++`.

Lợi ích chính của `useId` là React đảm bảo nó hoạt động với [server rendering.](/reference/react-dom/server) Trong quá trình server rendering, các component của bạn tạo ra đầu ra HTML. Sau đó, trên client, [hydration](/reference/react-dom/client/hydrateRoot) gắn các event handler của bạn vào HTML đã tạo. Để hydration hoạt động, đầu ra trên client phải khớp với HTML trên server.

Điều này rất khó đảm bảo với một bộ đếm tăng dần vì thứ tự hydration của các Client Component có thể không khớp với thứ tự HTML trên server được xuất ra. Bằng cách gọi `useId`, bạn đảm bảo hydration sẽ hoạt động và đầu ra sẽ khớp giữa server và client.

Bên trong React, `useId` được tạo từ "đường dẫn cha" của component đang gọi. Vì vậy, nếu cây trên client và server giống nhau, "đường dẫn cha" sẽ khớp bất kể thứ tự rendering.

</DeepDive>

---

### Tạo ID cho nhiều phần tử có liên quan {/*generating-ids-for-several-related-elements*/}

Nếu cần gán ID cho nhiều phần tử có liên quan, bạn có thể gọi `useId` để tạo một tiền tố dùng chung cho chúng:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Điều này giúp bạn tránh phải gọi `useId` cho từng phần tử cần một ID duy nhất.

---

### Chỉ định tiền tố dùng chung cho tất cả ID được tạo {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Nếu render nhiều ứng dụng React độc lập trên cùng một trang, hãy truyền `identifierPrefix` dưới dạng một tùy chọn cho các lần gọi [`createRoot`](/reference/react-dom/client/createRoot#parameters) hoặc [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) của bạn. Điều này đảm bảo các ID được tạo bởi hai ứng dụng khác nhau không bao giờ bị trùng, vì mọi identifier được tạo bằng `useId` sẽ bắt đầu bằng tiền tố riêng biệt mà bạn đã chỉ định.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### Sử dụng cùng tiền tố ID trên client và server {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

Nếu bạn [render nhiều ứng dụng React độc lập trên cùng một trang](#specifying-a-shared-prefix-for-all-generated-ids), và một số ứng dụng trong đó được server-render, hãy đảm bảo rằng `identifierPrefix` bạn truyền vào lần gọi [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) ở phía client giống với `identifierPrefix` bạn truyền vào [các API server](/reference/react-dom/server) như [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

Bạn không cần truyền `identifierPrefix` nếu trên trang chỉ có một ứng dụng React.