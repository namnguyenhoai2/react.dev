---
title: biến toàn cục
---

<Intro>

Xác thực việc gán/thay đổi các biến toàn cục trong quá trình render, một phần nhằm đảm bảo rằng [các tác dụng phụ phải chạy bên ngoài quá trình render](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render).

</Intro>

## Chi tiết quy tắc {/*rule-details*/}

Các biến toàn cục tồn tại bên ngoài quyền kiểm soát của React. Khi bạn thay đổi chúng trong quá trình render, bạn phá vỡ giả định của React rằng việc render là thuần túy. Điều này có thể khiến các component hoạt động khác nhau giữa môi trường development và production, làm hỏng Fast Refresh, đồng thời khiến ứng dụng của bạn không thể được tối ưu hóa bằng các tính năng như React Compiler.

### Không hợp lệ {/*invalid*/}

Ví dụ về code không đúng đối với quy tắc này:

```js
// ❌ Global counter
let renderCount = 0;
function Component() {
  renderCount++; // Mutating global
  return <div>Count: {renderCount}</div>;
}

// ❌ Modifying window properties
function Component({userId}) {
  window.currentUser = userId; // Global mutation
  return <div>User: {userId}</div>;
}

// ❌ Global array push
const events = [];
function Component({event}) {
  events.push(event); // Mutating global array
  return <div>Events: {events.length}</div>;
}

// ❌ Cache manipulation
const cache = {};
function Component({id}) {
  if (!cache[id]) {
    cache[id] = fetchData(id); // Modifying cache during render
  }
  return <div>{cache[id]}</div>;
}
```

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với quy tắc này:

```js
// ✅ Use state for counters
function Component() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(c => c + 1);
  };

  return (
    <button onClick={handleClick}>
      Clicked: {clickCount} times
    </button>
  );
}

// ✅ Use context for global values
function Component() {
  const user = useContext(UserContext);
  return <div>User: {user.id}</div>;
}

// ✅ Synchronize external state with React
function Component({title}) {
  useEffect(() => {
    document.title = title; // OK in effect
  }, [title]);

  return <div>Page: {title}</div>;
}
```