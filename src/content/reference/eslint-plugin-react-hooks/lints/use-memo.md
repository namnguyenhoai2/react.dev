---
title: use-memo
---

<Intro>

Xác thực rằng hook `useMemo` được sử dụng với một giá trị trả về. Xem [`useMemo` tài liệu](/reference/react/useMemo) để biết thêm thông tin.

</Intro>

## Chi tiết về rule {/*rule-details*/}

`useMemo` dùng để tính toán và caching các giá trị tốn nhiều tài nguyên, không dùng cho side effect. Nếu không có giá trị trả về, `useMemo` trả về `undefined`, làm mất đi mục đích của nó và có khả năng cho thấy bạn đang sử dụng sai hook.

### Không hợp lệ {/*invalid*/}

Ví dụ về code không đúng đối với rule này:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ No return value
function Component({ data }) {
  const processed = useMemo(() => {
    data.forEach(item => console.log(item));
    // Missing return!
  }, [data]);

  return <div>{processed}</div>; // Always undefined
}
```

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với rule này:

```js
// ✅ Returns computed value
function Component({ data }) {
  const processed = useMemo(() => {
    return data.map(item => item * 2);
  }, [data]);

  return <div>{processed}</div>;
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi cần chạy side effect khi các dependency thay đổi {/*side-effects*/}

Bạn có thể thử sử dụng `useMemo` cho các side effect:

{/* TODO(@poteto) fix compiler validation to check for unassigned useMemos */}
```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Wrong: Side effects in useMemo
function Component({user}) {
  // No return value, just side effect
  useMemo(() => {
    analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);

  // Not assigned to a variable
  useMemo(() => {
    return analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);
}
```

Nếu side effect cần xảy ra để phản hồi tương tác của người dùng, tốt nhất là đặt side effect cùng với event:

```js
// ✅ Good: Side effects in event handlers
function Component({user}) {
  const handleClick = () => {
    analytics.track('ButtonClicked', {userId: user.id});
    // Other click logic...
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

Nếu side effect đồng bộ hóa state của React với một state bên ngoài (hoặc ngược lại), hãy sử dụng `useEffect`:

```js
// ✅ Good: Synchronization in useEffect
function Component({theme}) {
  useEffect(() => {
    localStorage.setItem('preferredTheme', theme);
    document.body.className = theme;
  }, [theme]);

  return <div>Current theme: {theme}</div>;
}
```