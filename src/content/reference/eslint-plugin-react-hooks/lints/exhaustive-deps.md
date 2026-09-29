---
title: exhaustive-deps
---

<Intro>

Kiểm tra để đảm bảo các mảng dependency của React hook chứa mọi dependency cần thiết.

</Intro>

## Chi tiết về rule {/*rule-details*/}

Các React hook như `useEffect`, `useMemo` và `useCallback` chấp nhận các mảng dependency. Khi một giá trị được tham chiếu bên trong các hook này không được đưa vào mảng dependency, React sẽ không chạy lại effect hoặc tính toán lại giá trị khi dependency đó thay đổi. Điều này gây ra các closure cũ (stale closure), trong đó hook sử dụng các giá trị đã lỗi thời.

## Các lỗi thường gặp {/*common-violations*/}

Lỗi này thường xảy ra khi bạn cố gắng “đánh lừa” React về các dependency để kiểm soát thời điểm effect chạy. Effect nên đồng bộ component của bạn với các hệ thống bên ngoài. Mảng dependency cho React biết effect sử dụng những giá trị nào, nhờ đó React biết khi nào cần đồng bộ lại.

Nếu bạn thấy mình liên tục phải “đấu” với linter, có thể bạn cần tái cấu trúc code. Xem [Xóa các dependency của Effect](/learn/removing-effect-dependencies) để tìm hiểu cách thực hiện.

### Không hợp lệ {/*invalid*/}

Ví dụ về code không đúng đối với rule này:

```js
// ❌ Missing dependency
useEffect(() => {
  console.log(count);
}, []); // Missing 'count'

// ❌ Missing prop
useEffect(() => {
  fetchUser(userId);
}, []); // Missing 'userId'

// ❌ Incomplete dependencies
useMemo(() => {
  return items.sort(sortOrder);
}, [items]); // Missing 'sortOrder'
```

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với rule này:

```js
// ✅ All dependencies included
useEffect(() => {
  console.log(count);
}, [count]);

// ✅ All dependencies included
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

## Khắc phục sự cố {/*troubleshooting*/}

### Việc thêm dependency là một function gây ra vòng lặp vô hạn {/*function-dependency-loops*/}

Bạn có một effect, nhưng lại tạo một function mới trong mỗi lần render:

```js
// ❌ Causes infinite loop
const logItems = () => {
  console.log(items);
};

useEffect(() => {
  logItems();
}, [logItems]); // Infinite loop!
```

Trong hầu hết trường hợp, bạn không cần effect. Thay vào đó, hãy gọi function tại nơi hành động xảy ra:

```js
// ✅ Call it from the event handler
const logItems = () => {
  console.log(items);
};

return <button onClick={logItems}>Log</button>;

// ✅ Or derive during render if there's no side effect
items.forEach(item => {
  console.log(item);
});
```

Nếu thực sự cần effect (ví dụ: để đăng ký với một thứ gì đó bên ngoài), hãy làm cho dependency ổn định:

```js
// ✅ useCallback keeps the function reference stable
const logItems = useCallback(() => {
  console.log(items);
}, [items]);

useEffect(() => {
  logItems();
}, [logItems]);

// ✅ Or move the logic straight into the effect
useEffect(() => {
  console.log(items);
}, [items]);
```

### Chỉ chạy effect một lần {/*effect-on-mount*/}

Bạn muốn chạy effect một lần khi mount, nhưng linter phàn nàn về các dependency bị thiếu:

```js
// ❌ Missing dependency
useEffect(() => {
  sendAnalytics(userId);
}, []); // Missing 'userId'
```

Hãy thêm dependency (được khuyến nghị) hoặc sử dụng ref nếu bạn thực sự cần chạy một lần:

```js
// ✅ Include dependency
useEffect(() => {
  sendAnalytics(userId);
}, [userId]);

// ✅ Or use a ref guard inside an effect
const sent = useRef(false);

useEffect(() => {
  if (sent.current) {
    return;
  }

  sent.current = true;
  sendAnalytics(userId);
}, [userId]);
```

## Các tùy chọn {/*options*/}

Bạn có thể cấu hình các effect hook tùy chỉnh bằng các thiết lập ESLint dùng chung (có trong `eslint-plugin-react-hooks` 6.1.1 trở lên):

```js
{
  "settings": {
    "react-hooks": {
      "additionalEffectHooks": "(useMyEffect|useCustomEffect)"
    }
  }
}
```

- `additionalEffectHooks`: Mẫu Regex khớp với các hook tùy chỉnh cần được kiểm tra về dependency đầy đủ. Cấu hình này được dùng chung cho tất cả các rule `react-hooks`.

Để đảm bảo tương thích ngược, rule này cũng chấp nhận một tùy chọn cấp rule:

```js
{
  "rules": {
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useAnotherHook)"
    }]
  }
}
```

- `additionalHooks`: Regex dành cho các hook cần được kiểm tra về dependency đầy đủ. **Lưu ý:** Nếu tùy chọn cấp rule này được chỉ định, nó sẽ được ưu tiên hơn cấu hình `settings` dùng chung.