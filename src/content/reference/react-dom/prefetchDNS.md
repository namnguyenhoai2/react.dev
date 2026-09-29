---
title: prefetchDNS
---

<Intro>

`prefetchDNS` cho phép bạn chủ động tra cứu IP của một máy chủ mà bạn dự kiến sẽ tải tài nguyên từ đó.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

Để tra cứu một host, hãy gọi hàm `prefetchDNS` từ `react-dom`.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[Xem thêm các ví dụ bên dưới.](#usage)

Hàm prefetchDNS cung cấp cho trình duyệt một gợi ý rằng trình duyệt nên tra cứu địa chỉ IP của một máy chủ cụ thể. Nếu trình duyệt chọn thực hiện việc này, quá trình tải tài nguyên từ máy chủ đó có thể nhanh hơn.

#### Tham số {/*parameters*/}

* `href`: một chuỗi. URL của máy chủ mà bạn muốn kết nối đến.

#### Giá trị trả về {/*returns*/}

`prefetchDNS` không trả về gì.

#### Lưu ý {/*caveats*/}

* Nhiều lần gọi `prefetchDNS` với cùng một máy chủ có tác dụng giống như một lần gọi.
* Trong trình duyệt, bạn có thể gọi `prefetchDNS` trong mọi tình huống: khi render một component, trong một Effect, trong một event handler, v.v.
* Khi server-side rendering hoặc khi render Server Components, `prefetchDNS` chỉ có tác dụng nếu bạn gọi nó trong khi render một component hoặc trong một async context bắt nguồn từ việc render một component. Mọi lần gọi khác sẽ bị bỏ qua.
* Nếu biết chính xác những tài nguyên mình sẽ cần, bạn có thể gọi [các hàm khác](/reference/react-dom/#resource-preloading-apis) thay thế; các hàm này sẽ bắt đầu tải tài nguyên ngay lập tức.
* Việc prefetch cùng một máy chủ nơi chính trang web được lưu trữ không mang lại lợi ích gì, vì máy chủ đó đã được tra cứu vào thời điểm gợi ý được đưa ra.
* So với [`preconnect`](/reference/react-dom/preconnect), `prefetchDNS` có thể phù hợp hơn nếu bạn đang kết nối thăm dò đến một số lượng lớn domain, vì chi phí của việc preconnect có thể lớn hơn lợi ích mang lại.

---

## Cách sử dụng {/*usage*/}

### Prefetch DNS khi render {/*prefetching-dns-when-rendering*/}

Hãy gọi `prefetchDNS` khi render một component nếu bạn biết các component con của nó sẽ tải tài nguyên bên ngoài từ host đó.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### Prefetch DNS trong một event handler {/*prefetching-dns-in-an-event-handler*/}

Hãy gọi `prefetchDNS` trong một event handler trước khi chuyển sang một trang hoặc state mà tại đó sẽ cần đến các tài nguyên bên ngoài. Việc này bắt đầu quá trình sớm hơn so với khi bạn gọi hàm trong lúc render trang hoặc state mới.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```