---
title: tính thuần khiết
---

<Intro>

Xác thực rằng các [component/hook là thuần khiết](/reference/rules/components-and-hooks-must-be-pure) bằng cách kiểm tra rằng chúng không gọi các hàm được biết là không thuần khiết.

</Intro>

## Chi tiết về quy tắc {/*rule-details*/}

Các React component phải là các hàm thuần khiết - với cùng một props, chúng luôn phải trả về cùng một JSX. Khi component sử dụng các hàm như `Math.random()` hoặc `Date.now()` trong quá trình render, chúng tạo ra kết quả khác nhau mỗi lần, phá vỡ các giả định của React và gây ra những lỗi như hydration mismatch, memoization không chính xác và hành vi không thể đoán trước.

## Các vi phạm thường gặp {/*common-violations*/}

Nhìn chung, bất kỳ API nào trả về một giá trị khác nhau với cùng đầu vào đều vi phạm quy tắc này. Các ví dụ thường gặp gồm:

- `Math.random()`
- `Date.now()` / `new Date()`
- `crypto.randomUUID()`
- `performance.now()`

### Không hợp lệ {/*invalid*/}

Ví dụ về code không chính xác đối với quy tắc này:

```js
// ❌ Math.random() in render
function Component() {
  const id = Math.random(); // Different every render
  return <div key={id}>Content</div>;
}

// ❌ Date.now() for values
function Component() {
  const timestamp = Date.now(); // Changes every render
  return <div>Created at: {timestamp}</div>;
}
```

### Hợp lệ {/*valid*/}

Ví dụ về code chính xác đối với quy tắc này:

```js
// ✅ Stable IDs from initial state
function Component() {
  const [id] = useState(() => crypto.randomUUID());
  return <div key={id}>Content</div>;
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi cần hiển thị thời gian hiện tại {/*current-time*/}

Việc gọi `Date.now()` trong quá trình render khiến component của bạn không thuần khiết:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ Wrong: Time changes every render
function Clock() {
  return <div>Current time: {Date.now()}</div>;
}
```

Thay vào đó, [di chuyển hàm không thuần khiết ra bên ngoài quá trình render](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent):

```js
function Clock() {
  const [time, setTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Current time: {time}</div>;
}
```