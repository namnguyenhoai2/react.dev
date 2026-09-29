---
title: error-boundaries
---

<Intro>

Xác thực việc sử dụng Error Boundaries thay vì try/catch để xử lý lỗi trong các component con.

</Intro>

## Chi tiết về quy tắc {/*rule-details*/}

Các khối try/catch không thể bắt những lỗi xảy ra trong quá trình React render. Các lỗi được throw trong các phương thức render hoặc hook sẽ bubble up qua cây component. Chỉ [Error Boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) mới có thể bắt những lỗi này.

### Không hợp lệ {/*invalid*/}

Ví dụ về code không đúng đối với quy tắc này:

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Try/catch won't catch render errors
function Parent() {
  try {
    return <ChildComponent />; // If this throws, catch won't help
  } catch (error) {
    return <div>Error occurred</div>;
  }
}
```

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với quy tắc này:

```js
// ✅ Using error boundary
function Parent() {
  return (
    <ErrorBoundary>
      <ChildComponent />
    </ErrorBoundary>
  );
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tại sao linter yêu cầu tôi không bọc `use` trong `try`/`catch`? {/*why-is-the-linter-telling-me-not-to-wrap-use-in-trycatch*/}

Hook `use` không throw lỗi theo nghĩa truyền thống; nó tạm dừng quá trình thực thi component. Khi `use` gặp một promise đang chờ, nó tạm dừng component và cho phép React hiển thị fallback. Chỉ Suspense và Error Boundaries mới có thể xử lý những trường hợp này. Linter cảnh báo việc sử dụng `try`/`catch` quanh `use` để tránh nhầm lẫn, vì khối `catch` sẽ không bao giờ chạy.

```js {expectedErrors: {'react-compiler': [5]}}
// ❌ Try/catch around `use` hook
function Component({promise}) {
  try {
    const data = use(promise); // Won't catch - `use` suspends, not throws
    return <div>{data}</div>;
  } catch (error) {
    return <div>Failed to load</div>; // Unreachable
  }
}

// ✅ Error boundary catches `use` errors
function App() {
  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent promise={fetchData()} />
      </Suspense>
    </ErrorBoundary>
  );
}
```