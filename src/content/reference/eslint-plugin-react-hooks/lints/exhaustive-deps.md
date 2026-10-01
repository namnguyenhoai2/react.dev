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
// ❌ Thiếu dependency
useEffect(() => {
  console.log(count);
}, []); // Thiếu 'count'

// ❌ Thiếu prop
useEffect(() => {
  fetchUser(userId);
}, []); // Thiếu 'userId'

// ❌ Dependency chưa đầy đủ
useMemo(() => {
  return items.sort(sortOrder);
}, [items]); // Thiếu 'sortOrder'
```

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với rule này:

```js
// ✅ Đã bao gồm mọi dependency
useEffect(() => {
  console.log(count);
}, [count]);

// ✅ Đã bao gồm mọi dependency
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

## Khắc phục sự cố {/*troubleshooting*/}

### Việc thêm dependency là một function gây ra vòng lặp vô hạn {/*function-dependency-loops*/}

Bạn có một effect, nhưng lại tạo một function mới trong mỗi lần render:

```js
// ❌ Gây vòng lặp vô hạn
const logItems = () => {
  console.log(items);
};

useEffect(() => {
  logItems();
}, [logItems]); // Vòng lặp vô hạn!
```

Trong hầu hết trường hợp, bạn không cần effect. Thay vào đó, hãy gọi function tại nơi hành động xảy ra:

```js
// ✅ Gọi hàm từ event handler
const logItems = () => {
  console.log(items);
};

return <button onClick={logItems}>Log</button>;

// ✅ Hoặc suy ra trong quá trình render nếu không có side effect
items.forEach(item => {
  console.log(item);
});
```

Nếu thực sự cần effect (ví dụ: để đăng ký với một thứ gì đó bên ngoài), hãy làm cho dependency ổn định:

```js
// ✅ useCallback giữ tham chiếu hàm ổn định
const logItems = useCallback(() => {
  console.log(items);
}, [items]);

useEffect(() => {
  logItems();
}, [logItems]);

// ✅ Hoặc chuyển logic trực tiếp vào effect
useEffect(() => {
  console.log(items);
}, [items]);
```

### Chỉ chạy effect một lần {/*effect-on-mount*/}

Bạn muốn chạy effect một lần khi mount, nhưng linter phàn nàn về các dependency bị thiếu:

```js
// ❌ Thiếu dependency
useEffect(() => {
  sendAnalytics(userId);
}, []); // Thiếu 'userId'
```

Hãy thêm dependency (được khuyến nghị) hoặc sử dụng ref nếu bạn thực sự cần chạy một lần:

```js
// ✅ Bao gồm dependency
useEffect(() => {
  sendAnalytics(userId);
}, [userId]);

// ✅ Hoặc dùng ref guard bên trong effect
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
