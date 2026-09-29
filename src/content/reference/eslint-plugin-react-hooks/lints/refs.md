---
title: refs
---

<Intro>

Xác thực việc sử dụng refs đúng cách, không đọc/ghi trong quá trình render. Xem phần "pitfalls" trong [`useRef()` usage](/reference/react/useRef#usage).

</Intro>

## Chi tiết về rule {/*rule-details*/}

Refs lưu giữ các giá trị không được sử dụng cho việc render. Không giống state, việc thay đổi một ref không kích hoạt render lại. Việc đọc hoặc ghi `ref.current` trong quá trình render sẽ phá vỡ các kỳ vọng của React. Refs có thể chưa được khởi tạo khi bạn cố đọc chúng, và giá trị của chúng có thể đã cũ hoặc không nhất quán.

## Cách phát hiện refs {/*how-it-detects-refs*/}

Lint chỉ áp dụng các quy tắc này cho những giá trị mà nó biết là refs. Một giá trị được suy luận là ref khi compiler thấy một trong các mẫu sau:

- Được trả về từ `useRef()` hoặc `React.createRef()`.

  ```js
  const scrollRef = useRef(null);
  ```

- Một identifier có tên `ref` hoặc kết thúc bằng `Ref`, có thao tác đọc hoặc ghi vào `.current`.

  ```js
  buttonRef.current = node;
  ```

- Được truyền qua một prop JSX `ref` (ví dụ: `<div ref={someRef} />`).

  ```jsx
  <input ref={inputRef} />
  ```

Sau khi một giá trị được đánh dấu là ref, quá trình suy luận đó sẽ theo dõi giá trị qua các phép gán, destructuring hoặc lời gọi helper. Nhờ đó, lint có thể phát hiện các vi phạm ngay cả khi `ref.current` được truy cập bên trong một hàm khác nhận ref làm đối số.

## Các vi phạm thường gặp {/*common-violations*/}

- Đọc `ref.current` trong quá trình render
- Cập nhật `refs` trong quá trình render
- Sử dụng `refs` cho các giá trị đáng ra phải là state

### Không hợp lệ {/*invalid*/}

Ví dụ về code không đúng đối với rule này:

```js
// ❌ Reading ref during render
function Component() {
  const ref = useRef(0);
  const value = ref.current; // Don't read during render
  return <div>{value}</div>;
}

// ❌ Modifying ref during render
function Component({value}) {
  const ref = useRef(null);
  ref.current = value; // Don't modify during render
  return <div />;
}
```

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với rule này:

```js
// ✅ Read ref in effects/handlers
function Component() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current.offsetWidth); // OK in effect
    }
  });

  return <div ref={ref} />;
}

// ✅ Use state for UI values
function Component() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Lazy initialization of ref value
function Component() {
  const ref = useRef(null);

  // Initialize only once on first use
  if (ref.current === null) {
    ref.current = expensiveComputation(); // OK - lazy initialization
  }

  const handleClick = () => {
    console.log(ref.current); // Use the initialized value
  };

  return <button onClick={handleClick}>Click</button>;
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Lint đã đánh dấu plain object của tôi có `.current` {/*plain-object-current*/}

Heuristic về tên cố ý coi `ref.current` và `fooRef.current` là các ref thực sự. Nếu bạn đang mô hình hóa một custom container object, hãy chọn tên khác (ví dụ: `box`) hoặc chuyển giá trị mutable vào state. Việc đổi tên sẽ tránh được lint vì compiler không còn suy luận đó là một ref.