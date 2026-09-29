---
title: React gọi Components và Hooks
---

<Intro>
React chịu trách nhiệm render các component và Hooks khi cần để tối ưu hóa trải nghiệm người dùng. React mang tính khai báo: bạn cho React biết cần render gì trong logic của component, và React sẽ tự xác định cách tốt nhất để hiển thị điều đó cho người dùng.
</Intro>

<InlineToc />

---

## Không bao giờ gọi trực tiếp các hàm component {/*never-call-component-functions-directly*/}
Chỉ nên sử dụng component trong JSX. Đừng gọi chúng như các hàm thông thường. React sẽ gọi chúng.

React phải quyết định thời điểm hàm component của bạn được gọi [trong quá trình render](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code). Trong React, bạn thực hiện điều này bằng JSX.

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Good: Only use components in JSX
}
```

```js {expectedErrors: {'react-compiler': [2]}} {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Bad: Never call them directly
}
```

Nếu một component chứa Hooks, bạn rất dễ vi phạm [Rules of Hooks](/reference/rules/rules-of-hooks) khi các component được gọi trực tiếp trong một vòng lặp hoặc một điều kiện.

Để React điều phối việc render cũng mang lại một số lợi ích:

* **Component trở nên nhiều hơn các hàm.** React có thể bổ sung cho chúng các tính năng như _local state_ thông qua Hooks được gắn với danh tính của component trong cây.
* **Kiểu component tham gia vào quá trình reconciliation.** Bằng cách để React gọi các component của bạn, bạn cũng cung cấp cho React thêm thông tin về cấu trúc khái niệm của cây. Ví dụ: khi bạn chuyển từ việc render `<Feed>` sang trang `<Profile>`, React sẽ không cố gắng tái sử dụng chúng.
* **React có thể nâng cao trải nghiệm người dùng.** Ví dụ: React có thể cho trình duyệt thực hiện một số công việc giữa các lần gọi component để việc render lại một cây component lớn không chặn main thread.
* **Trải nghiệm debugging tốt hơn.** Nếu component là các thành phần hạng nhất mà thư viện nhận biết được, chúng ta có thể xây dựng các công cụ phong phú cho developer để kiểm tra trong quá trình phát triển.
* **Reconciliation hiệu quả hơn.** React có thể xác định chính xác những component nào trong cây cần được render lại và bỏ qua những component không cần. Điều đó giúp ứng dụng của bạn nhanh hơn và phản hồi linh hoạt hơn.

---

## Không bao giờ truyền Hooks như các giá trị thông thường {/*never-pass-around-hooks-as-regular-values*/}

Chỉ nên gọi Hooks bên trong component hoặc Hooks. Không bao giờ truyền chúng như một giá trị thông thường.

Hooks cho phép bạn bổ sung các tính năng của React vào một component. Chúng luôn phải được gọi như một hàm và không bao giờ được truyền đi như một giá trị thông thường. Điều này cho phép _local reasoning_, tức là khả năng để developer hiểu mọi điều một component có thể làm bằng cách xem component đó một cách độc lập.

Vi phạm quy tắc này sẽ khiến React không thể tự động tối ưu hóa component của bạn.

### Đừng thay đổi động một Hook {/*dont-dynamically-mutate-a-hook*/}

Hooks nên "tĩnh" hết mức có thể. Điều này có nghĩa là bạn không nên thay đổi chúng một cách động. Ví dụ, bạn không nên viết các higher-order Hooks:

```js {expectedErrors: {'react-compiler': [2, 3]}} {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Bad: don't write higher order Hooks
  const data = useDataWithLogging();
}
```

Hooks nên bất biến và không bị thay đổi. Thay vì thay đổi động một Hook, hãy tạo một phiên bản tĩnh của Hook với chức năng mong muốn.

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Good: Create a new version of the Hook
}

function useDataWithLogging() {
  // ... Create a new version of the Hook and inline the logic here
}
```

### Đừng sử dụng Hooks một cách động {/*dont-dynamically-use-hooks*/}

Hooks cũng không nên được sử dụng một cách động: ví dụ, thay vì thực hiện dependency injection trong một component bằng cách truyền một Hook dưới dạng giá trị:

```js {expectedErrors: {'react-compiler': [2]}} {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Bad: don't pass Hooks as props
}
```

Bạn luôn nên đặt lời gọi Hook trực tiếp trong component đó và xử lý mọi logic ở bên trong.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Good: Use the Hook directly
}

function useDataWithLogging() {
  // If there's any conditional logic to change the Hook's behavior, it should be inlined into
  // the Hook
}
```

Theo cách này, `<Button />` sẽ dễ hiểu và debug hơn nhiều. Khi Hooks được sử dụng theo những cách động, độ phức tạp của ứng dụng sẽ tăng lên đáng kể và cản trở local reasoning, khiến nhóm của bạn kém hiệu quả hơn về lâu dài. Điều này cũng khiến việc vô tình vi phạm [Rules of Hooks](/reference/rules/rules-of-hooks) — rằng không được gọi Hooks một cách có điều kiện — trở nên dễ dàng hơn. Nếu bạn thấy mình cần mock component để kiểm thử, tốt hơn hết là mock server để server phản hồi bằng dữ liệu dựng sẵn. Nếu có thể, việc kiểm thử ứng dụng bằng các bài kiểm thử end-to-end cũng thường hiệu quả hơn.