---
title: rules-of-hooks
---

<Intro>

Xác thực rằng các component và hook tuân thủ [Quy tắc của Hooks](/reference/rules/rules-of-hooks).

</Intro>

## Chi tiết về rule {/*rule-details*/}

React dựa vào thứ tự gọi các hook để bảo toàn state chính xác giữa các lần render. Mỗi khi component của bạn render, React mong đợi chính xác cùng một tập hợp hook được gọi theo chính xác cùng một thứ tự. Khi hook được gọi một cách có điều kiện hoặc trong vòng lặp, React sẽ không xác định được state nào tương ứng với lần gọi hook nào, dẫn đến các lỗi như state không khớp và lỗi "Rendered fewer/more hooks than expected".

## Các vi phạm thường gặp {/*common-violations*/}

Các pattern sau vi phạm Rules of Hooks:

- **Hooks trong các điều kiện** (`if`/`else`, toán tử ba ngôi, `&&`/`||`)
- **Hooks trong các vòng lặp** (`for`, `while`, `do-while`)
- **Hooks sau các lệnh return sớm**
- **Hooks trong callback/event handler**
- **Hooks trong các hàm async**
- **Hooks trong các method của class**
- **Hooks ở cấp module**

<Note>

### Hook `use` {/*use-hook*/}

Hook `use` khác với các hook React khác. Bạn có thể gọi hook này một cách có điều kiện và trong các vòng lặp:

```js
// ✅ `use` có thể được gọi có điều kiện
if (shouldFetch) {
  const data = use(fetchPromise);
}

// ✅ `use` có thể ở trong vòng lặp
for (const promise of promises) {
  results.push(use(promise));
}
```

Tuy nhiên, `use` vẫn có các hạn chế:
- Không thể được bọc trong try/catch
- Phải được gọi bên trong một component hoặc hook

Tìm hiểu thêm: [`use` Tài liệu tham khảo API](/reference/react/use)

</Note>

### {/*invalid*/} không hợp lệ

Ví dụ về code không đúng đối với rule này:

```js
// ❌ Hook trong điều kiện
if (isLoggedIn) {
  const [user, setUser] = useState(null);
}

// ❌ Hook sau lệnh return sớm
if (!data) return <Loading />;
const [processed, setProcessed] = useState(data);

// ❌ Hook trong callback
<button onClick={() => {
  const [clicked, setClicked] = useState(false);
}}/>

// ❌ `use` trong try/catch
try {
  const data = use(promise);
} catch (e) {
  // Xử lý lỗi
}

// ❌ Hook ở cấp độ module
const globalState = useState(0); // Bên ngoài component
```

### {/*valid*/} hợp lệ

Ví dụ về code đúng đối với rule này:

```js
function Component({ isSpecial, shouldFetch, fetchPromise }) {
  // ✅ Hooks ở cấp độ cao nhất
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  if (!isSpecial) {
    return null;
  }

  if (shouldFetch) {
    // ✅ `use` có thể được gọi có điều kiện
    const data = use(fetchPromise);
    return <div>{data}</div>;
  }

  return <div>{name}: {count}</div>;
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi muốn fetch dữ liệu dựa trên một điều kiện {/*conditional-data-fetching*/}

Bạn đang cố gọi useEffect một cách có điều kiện:

```js
// ❌ Hook có điều kiện
if (isLoggedIn) {
  useEffect(() => {
    fetchUserData();
  }, []);
}
```

Hãy gọi hook vô điều kiện và kiểm tra điều kiện bên trong:

```js
// ✅ Điều kiện bên trong Hook
useEffect(() => {
  if (isLoggedIn) {
    fetchUserData();
  }
}, [isLoggedIn]);
```

<Note>

Có những cách tốt hơn để fetch dữ liệu thay vì thực hiện trong một useEffect. Hãy cân nhắc sử dụng TanStack Query, useSWR hoặc React Router 6.4+ để fetch dữ liệu. Các giải pháp này xử lý việc loại bỏ các request trùng lặp, caching response và tránh network waterfall.

Tìm hiểu thêm: [Fetching Data](/learn/synchronizing-with-effects#fetching-data)

</Note>

### Tôi cần state khác nhau cho các tình huống khác nhau {/*conditional-state-initialization*/}

Bạn đang cố khởi tạo state một cách có điều kiện:

```js
// ❌ State có điều kiện
if (userType === 'admin') {
  const [permissions, setPermissions] = useState(adminPerms);
} else {
  const [permissions, setPermissions] = useState(userPerms);
}
```

Luôn gọi useState và đặt giá trị khởi tạo một cách có điều kiện:

```js
// ✅ Giá trị khởi tạo có điều kiện
const [permissions, setPermissions] = useState(
  userType === 'admin' ? adminPerms : userPerms
);
```

## Các tùy chọn {/*options*/}

Bạn có thể cấu hình các effect hook tùy chỉnh bằng shared ESLint settings (có trong `eslint-plugin-react-hooks` 6.1.1 trở lên):

```js
{
  "settings": {
    "react-hooks": {
      "additionalEffectHooks": "(useMyEffect|useCustomEffect)"
    }
  }
}
```

- `additionalEffectHooks`: Mẫu Regex khớp với các hook tùy chỉnh cần được xem như effect. Điều này cho phép `useEffectEvent` và các event function tương tự được gọi từ các effect hook tùy chỉnh của bạn.

Cấu hình dùng chung này được cả hai rule `rules-of-hooks` và `exhaustive-deps` sử dụng, nhằm đảm bảo hành vi nhất quán trên toàn bộ hoạt động linting liên quan đến hook.
