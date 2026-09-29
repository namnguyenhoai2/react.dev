---
title: experimental_taintUniqueValue

version: experimental
---

<Experimental>

**API này đang ở trạng thái thử nghiệm và chưa có trong phiên bản React ổn định.**

Bạn có thể dùng thử bằng cách nâng cấp các package React lên phiên bản thử nghiệm mới nhất:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Các phiên bản thử nghiệm của React có thể chứa lỗi. Không sử dụng chúng trong môi trường production.

API này chỉ khả dụng bên trong [React Server Components](/reference/rsc/use-client).

</Experimental>


<Intro>

`taintUniqueValue` cho phép bạn ngăn không cho các giá trị duy nhất được truyền đến Client Components, chẳng hạn như mật khẩu, key hoặc token.

```js
taintUniqueValue(errMessage, lifetime, value)
```

Để ngăn việc truyền một object chứa dữ liệu nhạy cảm, hãy xem [`taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

Gọi `taintUniqueValue` với mật khẩu, token, key hoặc hash để đăng ký giá trị đó với React là một giá trị không được phép truyền nguyên trạng đến Client:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass secret keys to the client.',
  process,
  process.env.SECRET_KEY
);
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `message`: Thông báo bạn muốn hiển thị nếu `value` được truyền đến Client Component. Thông báo này sẽ được hiển thị như một phần của Error được throw nếu `value` được truyền đến Client Component.

* `lifetime`: Bất kỳ object nào cho biết thời gian `value` cần bị taint. `value` sẽ bị chặn không cho gửi đến bất kỳ Client Component nào trong khi object này vẫn còn tồn tại. Ví dụ, truyền `globalThis` sẽ chặn giá trị trong suốt vòng đời của app. `lifetime` thường là một object có các property chứa `value`.

* `value`: Một string, bigint hoặc TypedArray. `value` phải là một chuỗi ký tự hoặc byte duy nhất có entropy cao, chẳng hạn như cryptographic token, private key, hash hoặc mật khẩu dài. `value` sẽ bị chặn không cho gửi đến bất kỳ Client Component nào.

#### Giá trị trả về {/*returns*/}

`experimental_taintUniqueValue` trả về `undefined`.

#### Lưu ý {/*caveats*/}

* Việc tạo các giá trị mới từ các giá trị đã bị taint có thể làm ảnh hưởng đến cơ chế bảo vệ taint. Các giá trị mới được tạo bằng cách chuyển các giá trị đã bị taint sang chữ hoa, nối các giá trị string đã bị taint thành một string lớn hơn, chuyển các giá trị đã bị taint sang base64, lấy substring từ các giá trị đã bị taint và các phép biến đổi tương tự khác sẽ không bị taint, trừ khi bạn gọi `taintUniqueValue` một cách rõ ràng trên các giá trị mới được tạo này.
* Không sử dụng `taintUniqueValue` để bảo vệ các giá trị có entropy thấp, chẳng hạn như mã PIN hoặc số điện thoại. Nếu bất kỳ giá trị nào trong request do kẻ tấn công kiểm soát, họ có thể suy ra giá trị nào bị taint bằng cách liệt kê tất cả các giá trị bí mật có thể có.

---

## Cách sử dụng {/*usage*/}

### Ngăn token được truyền đến Client Components {/*prevent-a-token-from-being-passed-to-client-components*/}

Để đảm bảo thông tin nhạy cảm như mật khẩu, session token hoặc các giá trị duy nhất khác không vô tình được truyền đến Client Components, function `taintUniqueValue` cung cấp một lớp bảo vệ. Khi một giá trị bị taint, mọi nỗ lực truyền giá trị đó đến Client Component sẽ dẫn đến một lỗi.

Đối số `lifetime` xác định khoảng thời gian giá trị vẫn bị taint. Với các giá trị cần duy trì trạng thái taint vô thời hạn, những object như [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) hoặc `process` có thể được dùng làm đối số `lifetime`. Các object này có vòng đời kéo dài trong toàn bộ thời gian app của bạn thực thi.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass a user password to the client.',
  globalThis,
  process.env.SECRET_KEY
);
```

Nếu vòng đời của giá trị bị taint gắn với một object, `lifetime` phải là object bao bọc giá trị đó. Điều này đảm bảo giá trị bị taint vẫn được bảo vệ trong suốt vòng đời của object bao bọc.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Do not pass a user session token to the client.',
    user,
    user.session.token
  );
  return user;
}
```

Trong ví dụ này, object `user` đóng vai trò là đối số `lifetime`. Nếu object này được lưu trong global cache hoặc có thể được request khác truy cập, session token vẫn bị taint.

<Pitfall>

**Không chỉ dựa vào taint để đảm bảo security.** Việc taint một giá trị không chặn mọi giá trị có thể được tạo ra từ giá trị đó. Ví dụ, việc tạo một giá trị mới bằng cách chuyển một string đã bị taint sang chữ hoa sẽ không khiến giá trị mới bị taint.


```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Do not pass the password to the client.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` is not tainted
```

Trong ví dụ này, hằng số `password` bị taint. Sau đó, `password` được dùng để tạo một giá trị mới `uppercasePassword` bằng cách gọi method `toUpperCase` trên `password`. `uppercasePassword` mới được tạo không bị taint.

Các cách tương tự khác để tạo giá trị mới từ các giá trị đã bị taint, như nối giá trị đó vào một string lớn hơn, chuyển giá trị đó sang base64 hoặc trả về một substring, đều tạo ra các giá trị không bị taint.

Taint chỉ bảo vệ khỏi những lỗi đơn giản như truyền rõ ràng các giá trị bí mật đến client. Những lỗi khi gọi `taintUniqueValue`, chẳng hạn như sử dụng global store bên ngoài React mà không có object tương ứng để xác định vòng đời, có thể khiến giá trị bị taint trở thành không bị taint. Taint là một lớp bảo vệ; một app bảo mật sẽ có nhiều lớp bảo vệ, các API được thiết kế tốt và các pattern isolation.

</Pitfall>

<DeepDive>

#### Sử dụng `server-only` và `taintUniqueValue` để ngăn rò rỉ secret {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

Nếu bạn đang chạy một môi trường Server Components có quyền truy cập vào private key hoặc mật khẩu, chẳng hạn như mật khẩu database, bạn phải cẩn thận không truyền chúng đến Client Component.

```js
export async function Dashboard(props) {
  // DO NOT DO THIS
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

Ví dụ này sẽ làm lộ secret API token cho client. Nếu API token này có thể được dùng để truy cập dữ liệu mà user cụ thể này không được phép truy cập, điều đó có thể dẫn đến data breach.

[comment]: <> (TODO: Liên kết đến tài liệu `server-only` sau khi tài liệu này được viết)

Lý tưởng nhất là các secret như vậy được tách vào một helper file duy nhất, file này chỉ có thể được các data utility đáng tin cậy trên server import. Helper này thậm chí có thể được gắn [`server-only`](https://www.npmjs.com/package/server-only) để đảm bảo file này không được import trên client.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

Đôi khi lỗi xảy ra trong quá trình refactor và không phải đồng nghiệp nào của bạn cũng biết về điều đó.
Để ngăn những lỗi này xảy ra về sau, chúng ta có thể "taint" chính mật khẩu đó:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass the API token password to the client. ' +
    'Instead do all fetches on the server.'
  process,
  process.env.API_PASSWORD
);
```

Bây giờ, bất cứ khi nào ai đó cố truyền mật khẩu này đến Client Component hoặc gửi mật khẩu đến Client Component bằng Server Function, một error sẽ được throw với message bạn đã định nghĩa khi gọi `taintUniqueValue`.

</DeepDive>

---