---
title: cacheSignal
---

<RSC>

`cacheSignal` hiện chỉ được sử dụng với [React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

</RSC>

<Intro>

`cacheSignal` cho phép bạn biết khi vòng đời của `cache()` kết thúc.

```js
const signal = cacheSignal();
```

</Intro>

<InlineToc />

---

## Tài liệu tham khảo {/*reference*/}

### `cacheSignal` {/*cachesignal*/}

Gọi `cacheSignal` để nhận một `AbortSignal`.

```js {3,7}
import {cacheSignal} from 'react';
async function Component() {
  await fetch(url, { signal: cacheSignal() });
}
```

Khi React hoàn tất quá trình render, `AbortSignal` sẽ bị abort. Điều này cho phép bạn hủy mọi công việc đang thực hiện nhưng không còn cần thiết.
Quá trình render được xem là hoàn tất khi:
- React đã hoàn tất quá trình render thành công
- quá trình render đã bị abort
- quá trình render không thành công

#### Tham số {/*parameters*/}

Hàm này không nhận tham số nào.

#### Giá trị trả về {/*returns*/}

`cacheSignal` trả về một `AbortSignal` nếu được gọi trong quá trình render. Nếu không, `cacheSignal()` trả về `null`.

#### Lưu ý {/*caveats*/}

- `cacheSignal` hiện chỉ được dùng trong [React Server Components](/reference/rsc/server-components). Trong Client Components, nó sẽ luôn trả về `null`. Trong tương lai, nó cũng sẽ được dùng cho Client Component khi client cache được làm mới hoặc vô hiệu hóa. Bạn không nên giả định rằng nó sẽ luôn là null trên client.
- Nếu được gọi bên ngoài quá trình render, `cacheSignal` sẽ trả về `null` để làm rõ rằng scope hiện tại không được cache vĩnh viễn.

---

## Cách sử dụng {/*usage*/}

### Hủy các request đang thực hiện {/*cancel-in-flight-requests*/}

Gọi <CodeStep step={1}>`cacheSignal`</CodeStep> để abort các request đang thực hiện.

```js [[1, 4, "cacheSignal()"]]
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);
async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

<Pitfall>
Bạn không thể sử dụng `cacheSignal` để abort công việc async được bắt đầu bên ngoài quá trình render, ví dụ:

```js
import {cacheSignal} from 'react';
// 🚩 Lưu ý: request thực tế sẽ không bị hủy nếu `Component` render xong.
const response = fetch(url, { signal: cacheSignal() });
async function Component() {
  await response;
}
```
</Pitfall>

### Bỏ qua lỗi sau khi React hoàn tất quá trình render {/*ignore-errors-after-react-has-finished-rendering*/}

Nếu một function throw, nguyên nhân có thể là do cancellation (ví dụ: <CodeStep step={1}>kết nối cơ sở dữ liệu</CodeStep> đã bị đóng). Bạn có thể sử dụng <CodeStep step={2}>`aborted` thuộc tính</CodeStep> để kiểm tra xem lỗi là do cancellation hay do một lỗi thực sự. Bạn có thể muốn <CodeStep step={3}>bỏ qua lỗi</CodeStep> do cancellation.

```js [[1, 2, "./database"], [2, 8, "cacheSignal()?.aborted"], [3, 12, "return null"]]
import {cacheSignal} from "react";
import {queryDatabase, logError} from "./database";

async function getData(id) {
  try {
     return await queryDatabase(id);
  } catch (x) {
     if (!cacheSignal()?.aborted) {
        // Chỉ ghi log nếu đây là lỗi thực sự, không phải do bị hủy
       logError(x);
     }
     return null;
  }
}

async function Component({id}) {
  const data = await getData(id);
  if (data === null) {
    return <div>No data available</div>;
  }
  return <div>{data.name}</div>;
}
```
