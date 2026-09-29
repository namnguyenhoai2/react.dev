---
title: "Các API React tích hợp sẵn"
---

<Intro>

Ngoài [Hooks](/reference/react/hooks) và [Components](/reference/react/components), package `react` export một số API khác hữu ích để định nghĩa component. Trang này liệt kê tất cả các API React hiện đại còn lại.

</Intro>

---

* [`createContext`](/reference/react/createContext) cho phép bạn định nghĩa và cung cấp context cho các component con. Được dùng cùng với [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) cho phép bạn trì hoãn việc tải code của một component cho đến khi component đó được render lần đầu.
* [`memo`](/reference/react/memo) cho phép component của bạn bỏ qua việc re-render khi nhận cùng props. Được dùng cùng với [`useMemo`](/reference/react/useMemo) và [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) cho phép bạn đánh dấu một lần cập nhật state là không khẩn cấp. Tương tự như [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) cho phép bạn bao bọc các lần render và tương tác trong test để đảm bảo các bản cập nhật đã được xử lý trước khi đưa ra các assertion.
* [`cache`](/reference/react/cache) cho phép bạn cache kết quả của một lần fetch dữ liệu hoặc phép tính.
* [`cacheSignal`](/reference/react/cacheSignal) cho phép bạn biết khi vòng đời của `cache()` kết thúc.
* [`captureOwnerStack`](/reference/react/captureOwnerStack) đọc Owner Stack hiện tại trong môi trường development và trả về dưới dạng chuỗi nếu có.

---

## Các API Resource {/*resource-apis*/}

*Resource* có thể được component truy cập mà không cần là một phần trong state của component đó. Ví dụ: một component có thể đọc một message từ Promise hoặc đọc thông tin styling từ context.

Bạn có thể truyền các loại resource này cho [`use`](/reference/react/use):

* Một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) để đọc giá trị đã được resolve.
* Một [context](/learn/passing-data-deeply-with-context) để đọc giá trị của nó.
* Giá trị được trả về bởi [`browser`](/reference/react-dom/browser) để đánh dấu một component chỉ dành cho trình duyệt trong quá trình server rendering.

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```