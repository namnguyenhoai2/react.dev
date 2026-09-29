---
title: preserve-manual-memoization
---

<Intro>

Xác thực rằng compiler bảo toàn memoization thủ công hiện có. React Compiler chỉ biên dịch các component và hook nếu khả năng suy luận của nó [khớp hoặc vượt qua memoization thủ công hiện có](/learn/react-compiler/introduction#what-should-i-do-about-usememo-usecallback-and-reactmemo).

</Intro>

## Chi tiết quy tắc {/*rule-details*/}

React Compiler bảo toàn các lời gọi `useMemo`, `useCallback` và `React.memo` hiện có của bạn. Nếu bạn đã tự memoize một thành phần nào đó, compiler giả định rằng bạn có lý do chính đáng và sẽ không loại bỏ nó. Tuy nhiên, các dependency chưa đầy đủ khiến compiler không thể hiểu luồng dữ liệu trong mã của bạn và áp dụng thêm các tối ưu hóa.

### Không hợp lệ {/*invalid*/}

Ví dụ về mã không đúng đối với quy tắc này:

```js
// ❌ Missing dependencies in useMemo
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data] // Missing 'filter' dependency
  );

  return <List items={filtered} />;
}

// ❌ Missing dependencies in useCallback
function Component({ onUpdate, value }) {
  const handleClick = useCallback(() => {
    onUpdate(value);
  }, [onUpdate]); // Missing 'value'

  return <button onClick={handleClick}>Update</button>;
}
```

### Hợp lệ {/*valid*/}

Ví dụ về mã đúng đối với quy tắc này:

```js
// ✅ Complete dependencies
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data, filter] // All dependencies included
  );

  return <List items={filtered} />;
}

// ✅ Or let the compiler handle it
function Component({ data, filter }) {
  // No manual memoization needed
  const filtered = data.filter(filter);
  return <List items={filtered} />;
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi có nên loại bỏ memoization thủ công không? {/*remove-manual-memoization*/}

Bạn có thể tự hỏi liệu React Compiler có khiến memoization thủ công trở nên không cần thiết hay không:

```js
// Do I still need this?
function Component({items, sortBy}) {
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      return a[sortBy] - b[sortBy];
    });
  }, [items, sortBy]);

  return <List items={sorted} />;
}
```

Bạn có thể an toàn loại bỏ nó khi sử dụng React Compiler:

```js
// ✅ Better: Let the compiler optimize
function Component({items, sortBy}) {
  const sorted = [...items].sort((a, b) => {
    return a[sortBy] - b[sortBy];
  });

  return <List items={sorted} />;
}
```