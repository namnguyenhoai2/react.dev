---
title: flushSync
---

<Pitfall>

Việc sử dụng `flushSync` không phổ biến và có thể làm giảm hiệu năng ứng dụng của bạn.

</Pitfall>

<Intro>

`flushSync` cho phép bạn buộc React đồng bộ (flush) mọi cập nhật bên trong callback được cung cấp. Điều này đảm bảo DOM được cập nhật ngay lập tức.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

Gọi `flushSync` để buộc React đồng bộ mọi công việc đang chờ xử lý và cập nhật DOM.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

Trong hầu hết trường hợp, có thể tránh `flushSync`. Chỉ sử dụng `flushSync` như phương án cuối cùng.

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `callback`: Một hàm. React sẽ ngay lập tức gọi callback này và đồng bộ mọi cập nhật mà callback chứa. React cũng có thể đồng bộ mọi cập nhật hoặc Effect đang chờ xử lý, hoặc các cập nhật bên trong Effect. Nếu một cập nhật bị suspend do lệnh gọi `flushSync` này, các fallback có thể được hiển thị lại.

#### Giá trị trả về {/*returns*/}

`flushSync` trả về `undefined`.

#### Lưu ý {/*caveats*/}

* `flushSync` có thể làm giảm đáng kể hiệu năng. Hãy sử dụng một cách hạn chế.
* `flushSync` có thể buộc các Suspense boundary đang chờ xử lý hiển thị trạng thái `fallback`.
* `flushSync` có thể chạy các Effect đang chờ xử lý và đồng bộ áp dụng mọi cập nhật mà chúng chứa trước khi trả về.
* Khi cần thiết để đồng bộ các cập nhật bên trong callback, `flushSync` có thể đồng bộ cả các cập nhật bên ngoài callback. Ví dụ: nếu có các cập nhật đang chờ xử lý từ một lần nhấp, React có thể đồng bộ chúng trước khi đồng bộ các cập nhật bên trong callback.

---

## Cách sử dụng {/*usage*/}

### Đồng bộ cập nhật cho các tích hợp bên thứ ba {/*flushing-updates-for-third-party-integrations*/}

Khi tích hợp với mã bên thứ ba như browser API hoặc thư viện UI, bạn có thể cần buộc React đồng bộ các cập nhật. Sử dụng `flushSync` để buộc React đồng bộ mọi <CodeStep step={1}>state updates</CodeStep> bên trong callback:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// By this line, the DOM is updated.
```

Điều này đảm bảo rằng khi dòng mã tiếp theo chạy, React đã cập nhật DOM.

**Việc sử dụng `flushSync` không phổ biến, và việc sử dụng thường xuyên có thể làm giảm đáng kể hiệu năng ứng dụng của bạn.** Nếu ứng dụng của bạn chỉ sử dụng các React API và không tích hợp với thư viện bên thứ ba, thì `flushSync` không cần thiết.

Tuy nhiên, nó có thể hữu ích khi tích hợp với mã bên thứ ba như browser API.

Một số browser API yêu cầu kết quả bên trong callback phải được ghi vào DOM một cách đồng bộ, trước khi callback kết thúc, để trình duyệt có thể xử lý DOM đã render. Trong hầu hết trường hợp, React tự động xử lý việc này cho bạn. Nhưng trong một số trường hợp, bạn có thể cần buộc cập nhật đồng bộ.

Ví dụ: browser `onbeforeprint` API cho phép bạn thay đổi trang ngay trước khi hộp thoại in mở ra. Điều này hữu ích khi áp dụng các kiểu in tùy chỉnh để tài liệu hiển thị tốt hơn khi in. Trong ví dụ bên dưới, bạn sử dụng `flushSync` bên trong callback `onbeforeprint` để ngay lập tức "flush" state của React vào DOM. Sau đó, khi hộp thoại in mở ra, `isPrinting` hiển thị "yes":

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

Nếu không có `flushSync`, hộp thoại in sẽ hiển thị `isPrinting` là "no". Điều này xảy ra vì React batch các cập nhật một cách bất đồng bộ và hộp thoại in được hiển thị trước khi state được cập nhật.

<Pitfall>

`flushSync` có thể làm giảm đáng kể hiệu năng và có thể bất ngờ buộc các Suspense boundary đang chờ xử lý hiển thị trạng thái fallback.

Trong hầu hết trường hợp, có thể tránh `flushSync`, vì vậy hãy sử dụng `flushSync` như phương án cuối cùng.

</Pitfall>

---

## Xử lý sự cố {/*troubleshooting*/}

### Tôi gặp lỗi: "flushSync was called from inside a lifecycle method" {/*im-getting-an-error-flushsync-was-called-from-inside-a-lifecycle-method*/}

React không thể `flushSync` ở giữa quá trình render. Nếu làm vậy, React sẽ không thực hiện thao tác này và đưa ra cảnh báo:

<ConsoleBlock level="error">

Warning: flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.

</ConsoleBlock>

Điều này bao gồm việc gọi `flushSync` bên trong:

- quá trình render một component.
- các hook `useLayoutEffect` hoặc `useEffect`.
- Các lifecycle method của class component.

Ví dụ, việc gọi `flushSync` trong một Effect sẽ không thực hiện thao tác này và đưa ra cảnh báo:

```js
import { useEffect } from 'react';
import { flushSync } from 'react-dom';

function MyComponent() {
  useEffect(() => {
    // 🚩 Wrong: calling flushSync inside an effect
    flushSync(() => {
      setSomething(newValue);
    });
  }, []);

  return <div>{/* ... */}</div>;
}
```

Để khắc phục, thông thường bạn nên chuyển lệnh gọi `flushSync` sang một event:

```js
function handleClick() {
  // ✅ Correct: flushSync in event handlers is safe
  flushSync(() => {
    setSomething(newValue);
  });
}
```

Nếu khó chuyển sang một event, bạn có thể trì hoãn `flushSync` trong một microtask:

```js {3,7}
useEffect(() => {
  // ✅ Correct: defer flushSync to a microtask
  queueMicrotask(() => {
    flushSync(() => {
      setSomething(newValue);
    });
  });
}, []);
```

Điều này cho phép quá trình render hiện tại hoàn tất và lên lịch một lần render đồng bộ khác để đồng bộ các cập nhật.

<Pitfall>

`flushSync` có thể làm giảm đáng kể hiệu năng, nhưng mẫu này còn gây ảnh hưởng xấu hơn đến hiệu năng. Hãy thử hết mọi lựa chọn khác trước khi gọi `flushSync` trong một microtask như một phương án dự phòng.

</Pitfall>