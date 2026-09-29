---
title: set-state-in-render
---

<Intro>

Kiểm tra việc đặt state một cách vô điều kiện trong quá trình render, điều này có thể kích hoạt các lần render bổ sung và các vòng lặp render vô hạn tiềm ẩn.

</Intro>

## Chi tiết quy tắc {/*rule-details*/}

Gọi `setState` trong quá trình render một cách vô điều kiện sẽ ngay lập tức kích hoạt một lần render khác trước khi lần render hiện tại hoàn tất. Điều này tạo ra một vòng lặp vô hạn khiến ứng dụng của bạn bị crash.

## Các vi phạm thường gặp {/*common-violations*/}

### Không hợp lệ {/*invalid*/}

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Unconditional setState directly in render
function Component({value}) {
  const [count, setCount] = useState(0);
  setCount(value); // Infinite loop!
  return <div>{count}</div>;
}
```

### Hợp lệ {/*valid*/}

```js
// ✅ Derive during render
function Component({items}) {
  const sorted = [...items].sort(); // Just calculate it in render
  return <ul>{sorted.map(/*...*/)}</ul>;
}

// ✅ Set state in event handler
function Component() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Derive from props instead of setting state
function Component({user}) {
  const name = user?.name || '';
  const email = user?.email || '';
  return <div>{name}</div>;
}

// ✅ Conditionally derive state from props and state from previous renders
function Component({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) { // This condition makes it valid
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi muốn đồng bộ state với một prop {/*clamp-state-to-prop*/}

Một vấn đề phổ biến là cố gắng "sửa" state sau khi nó được render. Giả sử bạn muốn ngăn một bộ đếm vượt quá prop `max`:

```js
// ❌ Wrong: clamps during render
function Counter({max}) {
  const [count, setCount] = useState(0);

  if (count > max) {
    setCount(max);
  }

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

Ngay khi `count` vượt quá `max`, một vòng lặp vô hạn sẽ được kích hoạt.

Thay vào đó, thường tốt hơn là chuyển logic này vào event (nơi state được đặt lần đầu). Ví dụ: bạn có thể áp dụng giới hạn tối đa ngay tại thời điểm cập nhật state:

```js
// ✅ Clamp when updating
function Counter({max}) {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(current => Math.min(current + 1, max));
  };

  return <button onClick={increment}>{count}</button>;
}
```

Giờ đây, setter chỉ chạy để phản hồi thao tác nhấp, React hoàn tất quá trình render bình thường, và `count` không bao giờ vượt qua `max`.

Trong một số trường hợp hiếm gặp, bạn có thể cần điều chỉnh state dựa trên thông tin từ các lần render trước đó. Với những trường hợp này, hãy làm theo [mẫu này](https://react.dev/reference/react/useState#storing-information-from-previous-renders) để đặt state một cách có điều kiện.