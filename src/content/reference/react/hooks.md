---
title: "Các React Hooks tích hợp sẵn"
---

<Intro>

*Hooks* cho phép bạn sử dụng các tính năng khác nhau của React từ các component. Bạn có thể sử dụng các Hooks tích hợp sẵn hoặc kết hợp chúng để xây dựng Hooks của riêng mình. Trang này liệt kê tất cả các Hooks tích hợp sẵn trong React.

</Intro>

---

## Các State Hook {/*state-hooks*/}

*State* cho phép một component ["ghi nhớ" thông tin như dữ liệu người dùng nhập vào.](/learn/state-a-components-memory) Ví dụ, một component biểu mẫu có thể sử dụng state để lưu giá trị đầu vào, trong khi một component thư viện ảnh có thể sử dụng state để lưu chỉ mục của ảnh được chọn.

Để thêm state vào một component, hãy sử dụng một trong các Hook sau:

* [`useState`](/reference/react/useState) khai báo một biến state mà bạn có thể cập nhật trực tiếp.
* [`useReducer`](/reference/react/useReducer) khai báo một biến state với logic cập nhật nằm bên trong một hàm [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Các Context Hook {/*context-hooks*/}

*Context* cho phép một component [nhận thông tin từ các component cha ở xa mà không cần truyền thông tin đó dưới dạng props.](/learn/passing-props-to-a-component) Ví dụ, component cấp cao nhất của ứng dụng có thể truyền theme UI hiện tại đến tất cả các component bên dưới, bất kể chúng nằm sâu đến đâu.

* [`useContext`](/reference/react/useContext) đọc và subscribe vào một context.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Các Ref Hook {/*ref-hooks*/}

*Ref* cho phép một component [lưu giữ một số thông tin không được dùng để render,](/learn/referencing-values-with-refs) chẳng hạn như một DOM node hoặc ID của bộ hẹn giờ. Không giống state, việc cập nhật một ref không render lại component của bạn. Ref là một "lối thoát" khỏi mô hình React. Chúng hữu ích khi bạn cần làm việc với các hệ thống không phải React, chẳng hạn như các browser API tích hợp sẵn.

* [`useRef`](/reference/react/useRef) khai báo một ref. Bạn có thể lưu bất kỳ giá trị nào trong đó, nhưng thường được dùng nhất để lưu một DOM node.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) cho phép bạn tùy chỉnh ref mà component của mình cung cấp. Hook này hiếm khi được sử dụng.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Các Effect Hook {/*effect-hooks*/}

*Effect* cho phép một component [kết nối và đồng bộ hóa với các hệ thống bên ngoài.](/learn/synchronizing-with-effects) Điều này bao gồm việc xử lý network, DOM của trình duyệt, animation, widget được viết bằng một thư viện UI khác và các đoạn code không phải React khác.

* [`useEffect`](/reference/react/useEffect) kết nối một component với một hệ thống bên ngoài.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Effect là một "lối thoát" khỏi mô hình React. Đừng sử dụng Effect để điều phối luồng dữ liệu của ứng dụng. Nếu bạn không tương tác với một hệ thống bên ngoài, [có thể bạn không cần Effect.](/learn/you-might-not-need-an-effect)

Có hai biến thể của `useEffect` hiếm khi được sử dụng, với thời điểm thực thi khác nhau:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) được thực thi trước khi trình duyệt vẽ lại màn hình. Bạn có thể đo layout tại đây.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) được thực thi trước khi React thực hiện các thay đổi lên DOM. Các thư viện có thể chèn CSS động tại đây.

Bạn cũng có thể tách các event khỏi Effect:

- [`useEffectEvent`](/reference/react/useEffectEvent) tạo một event không reactive để kích hoạt từ bất kỳ Effect hook nào.
---

## Các Performance Hook {/*performance-hooks*/}

Một cách phổ biến để tối ưu hiệu năng render lại là bỏ qua những công việc không cần thiết. Ví dụ, bạn có thể yêu cầu React sử dụng lại một phép tính đã được cache hoặc bỏ qua việc render lại nếu dữ liệu không thay đổi kể từ lần render trước.

Để bỏ qua các phép tính và việc render lại không cần thiết, hãy sử dụng một trong các Hook sau:

- [`useMemo`](/reference/react/useMemo) cho phép bạn cache kết quả của một phép tính tốn kém.
- [`useCallback`](/reference/react/useCallback) cho phép bạn cache định nghĩa một hàm trước khi truyền hàm đó xuống một component đã được tối ưu.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Đôi khi bạn không thể bỏ qua việc render lại vì màn hình thực sự cần được cập nhật. Trong trường hợp đó, bạn có thể cải thiện hiệu năng bằng cách tách các cập nhật chặn phải được thực hiện đồng bộ (như nhập dữ liệu vào một ô input) khỏi các cập nhật không chặn, không cần chặn giao diện người dùng (như cập nhật biểu đồ).

Để ưu tiên việc render, hãy sử dụng một trong các Hook sau:

- [`useTransition`](/reference/react/useTransition) cho phép bạn đánh dấu một state transition là không chặn và cho phép các cập nhật khác ngắt nó.
- [`useDeferredValue`](/reference/react/useDeferredValue) cho phép bạn trì hoãn việc cập nhật một phần UI không quan trọng và để các phần khác được cập nhật trước.

---

## Các Hook khác {/*other-hooks*/}

Các Hook này chủ yếu hữu ích với tác giả thư viện và không thường được sử dụng trong code của ứng dụng.

- [`useDebugValue`](/reference/react/useDebugValue) cho phép bạn tùy chỉnh nhãn mà React DevTools hiển thị cho custom Hook của mình.
- [`useId`](/reference/react/useId) cho phép một component liên kết một ID duy nhất với chính nó. Thường được sử dụng cùng với các accessibility API.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) cho phép một component subscribe vào một external store.
* [`useActionState`](/reference/react/useActionState) cho phép bạn quản lý state của các action.

---

## Hook của riêng bạn {/*your-own-hooks*/}

Bạn cũng có thể [định nghĩa các custom Hook của riêng mình](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) dưới dạng các hàm JavaScript.