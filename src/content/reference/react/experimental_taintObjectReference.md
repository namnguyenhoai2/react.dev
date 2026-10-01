---
title: experimental_taintObjectReference

version: experimental
---

<Experimental>

**API này đang trong giai đoạn experimental và chưa có trong phiên bản React ổn định.**

Bạn có thể dùng thử bằng cách nâng cấp các package React lên phiên bản experimental mới nhất:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Các phiên bản experimental của React có thể chứa lỗi. Không sử dụng chúng trong production.

API này chỉ khả dụng bên trong React Server Components.

</Experimental>


<Intro>

`taintObjectReference` cho phép bạn ngăn một instance cụ thể của object được truyền đến Client Component, chẳng hạn như một object `user`.

```js
experimental_taintObjectReference(message, object);
```

Để ngăn việc truyền một key, hash hoặc token, hãy xem [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

Gọi `taintObjectReference` với một object để đăng ký object đó với React là không được phép truyền nguyên trạng đến Client:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Do not pass ALL environment variables to the client.',
  process.env
);
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `message`: Thông báo bạn muốn hiển thị nếu object được truyền đến một Client Component. Thông báo này sẽ được hiển thị như một phần của Error được ném ra nếu object được truyền đến một Client Component.

* `object`: Object cần được taint. Có thể truyền các function và class instance vào `taintObjectReference` dưới dạng `object`. Function và class vốn đã bị chặn không cho truyền đến Client Component, nhưng thông báo lỗi mặc định của React sẽ được thay thế bằng nội dung bạn định nghĩa trong `message`. Khi một instance cụ thể của Typed Array được truyền vào `taintObjectReference` dưới dạng `object`, mọi bản sao khác của Typed Array đó sẽ không bị taint.

#### Giá trị trả về {/*returns*/}

`experimental_taintObjectReference` trả về `undefined`.

#### Lưu ý {/*caveats*/}

- Việc tạo lại hoặc clone một object đã bị taint sẽ tạo ra một object mới không bị taint, object này có thể chứa dữ liệu nhạy cảm. Ví dụ: nếu bạn có một object `user` đã bị taint, `const userInfo = {name: user.name, ssn: user.ssn}` hoặc `{...user}` sẽ tạo ra các object mới không bị taint. `taintObjectReference` chỉ bảo vệ khỏi những lỗi đơn giản khi object được truyền nguyên trạng qua một Client Component.

<Pitfall>

**Đừng chỉ dựa vào việc taint để đảm bảo bảo mật.** Việc taint một object không ngăn được mọi giá trị dẫn xuất có thể bị rò rỉ. Ví dụ: clone một object đã bị taint sẽ tạo ra một object mới không bị taint. Việc sử dụng dữ liệu từ một object đã bị taint (ví dụ: `{secret: taintedObj.secret}`) sẽ tạo ra một giá trị hoặc object mới không bị taint. Taint là một lớp bảo vệ; một ứng dụng an toàn sẽ có nhiều lớp bảo vệ, các API được thiết kế tốt và các mô hình cô lập.

</Pitfall>

---

## Cách sử dụng {/*usage*/}

### Ngăn dữ liệu người dùng vô tình được truyền đến client {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Một Client Component không bao giờ nên nhận các object chứa dữ liệu nhạy cảm. Lý tưởng nhất là các function lấy dữ liệu không nên cung cấp dữ liệu mà người dùng hiện tại không được phép truy cập. Đôi khi có thể xảy ra sai sót trong quá trình refactor. Để bảo vệ khỏi những sai sót có thể xảy ra về sau, chúng ta có thể “taint” object người dùng trong data API.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

Giờ đây, bất cứ khi nào có người cố truyền object này đến một Client Component, một Error sẽ được ném ra với thông báo lỗi đã truyền vào.

<DeepDive>

#### Bảo vệ khỏi rò rỉ trong quá trình lấy dữ liệu {/*protecting-against-leaks-in-data-fetching*/}

Nếu bạn đang chạy một môi trường Server Components có quyền truy cập vào dữ liệu nhạy cảm, bạn phải cẩn thận không truyền thẳng các object:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // DO NOT DO THIS
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

Lý tưởng nhất là `getUser` không nên cung cấp dữ liệu mà người dùng hiện tại không được phép truy cập. Để ngăn việc truyền object `user` đến một Client Component ở bước sau, chúng ta có thể “taint” object người dùng:


```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

Giờ đây, nếu có người cố truyền object `user` đến một Client Component, một Error sẽ được ném ra với thông báo lỗi đã truyền vào.

</DeepDive>
