---
title: compilationMode
---

<Intro>

Tùy chọn `compilationMode` kiểm soát cách React Compiler lựa chọn các hàm cần biên dịch.

</Intro>

```js
{
  compilationMode: 'infer' // or 'annotation', 'syntax', 'all'
}
```

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `compilationMode` {/*compilationmode*/}

Kiểm soát chiến lược xác định các hàm mà React Compiler sẽ tối ưu hóa.

#### Kiểu {/*type*/}

```
'infer' | 'syntax' | 'annotation' | 'all'
```

#### Giá trị mặc định {/*default-value*/}

`'infer'`

#### Các tùy chọn {/*options*/}

- **`'infer'`** (mặc định): Compiler sử dụng các heuristic thông minh để xác định các React component và hook:
  - Các hàm được chú thích rõ ràng bằng directive `"use memo"`
  - Các hàm được đặt tên giống component (PascalCase) hoặc hook (tiền tố `use`) VÀ tạo JSX và/hoặc gọi các hook khác

- **`'annotation'`**: Chỉ biên dịch các hàm được đánh dấu rõ ràng bằng directive `"use memo"`. Phù hợp để áp dụng dần.

- **`'syntax'`**: Chỉ biên dịch các component và hook sử dụng cú pháp [component](https://flow.org/en/docs/react/component-syntax/) và [hook](https://flow.org/en/docs/react/hook-syntax/) của Flow.

- **`'all'`**: Biên dịch tất cả các hàm cấp cao nhất. Không được khuyến nghị vì có thể biên dịch các hàm không liên quan đến React.

#### Lưu ý {/*caveats*/}

- Chế độ `'infer'` yêu cầu các hàm tuân theo quy ước đặt tên của React để được phát hiện
- Việc sử dụng chế độ `'all'` có thể ảnh hưởng tiêu cực đến hiệu năng do biên dịch các hàm tiện ích
- Chế độ `'syntax'` yêu cầu Flow và sẽ không hoạt động với TypeScript
- Bất kể chế độ nào, các hàm có directive `"use no memo"` luôn bị bỏ qua

---

## Cách sử dụng {/*usage*/}

### Chế độ suy luận mặc định {/*default-inference-mode*/}

Chế độ `'infer'` mặc định hoạt động tốt với hầu hết các codebase tuân theo quy ước của React:

```js
{
  compilationMode: 'infer'
}
```

Với chế độ này, các hàm sau sẽ được biên dịch:

```js
// ✅ Compiled: Named like a component + returns JSX
function Button(props) {
  return <button>{props.label}</button>;
}

// ✅ Compiled: Named like a hook + calls hooks
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, setCount];
}

// ✅ Compiled: Explicit directive
function expensiveCalculation(data) {
  "use memo";
  return data.reduce(/* ... */);
}

// ❌ Not compiled: Not a component/hook pattern
function calculateTotal(items) {
  return items.reduce((a, b) => a + b, 0);
}
```

### Áp dụng dần với chế độ chú thích {/*incremental-adoption*/}

Để di chuyển dần, hãy sử dụng chế độ `'annotation'` nhằm chỉ biên dịch các hàm được đánh dấu:

```js
{
  compilationMode: 'annotation'
}
```

Sau đó, đánh dấu rõ ràng các hàm cần biên dịch:

```js
// Only this function will be compiled
function ExpensiveList(props) {
  "use memo";
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// This won't be compiled without the directive
function NormalComponent(props) {
  return <div>{props.content}</div>;
}
```

### Sử dụng chế độ cú pháp Flow {/*flow-syntax-mode*/}

Nếu codebase của bạn sử dụng Flow thay vì TypeScript:

```js
{
  compilationMode: 'syntax'
}
```

Sau đó, sử dụng cú pháp component của Flow:

```js
// Compiled: Flow component syntax
component Button(label: string) {
  return <button>{label}</button>;
}

// Compiled: Flow hook syntax
hook useCounter(initial: number) {
  const [count, setCount] = useState(initial);
  return [count, setCount];
}

// Not compiled: Regular function syntax
function helper(data) {
  return process(data);
}
```

### Loại trừ các hàm cụ thể {/*opting-out*/}

Bất kể chế độ biên dịch nào, hãy sử dụng `"use no memo"` để bỏ qua việc biên dịch:

```js
function ComponentWithSideEffects() {
  "use no memo"; // Prevent compilation

  // This component has side effects that shouldn't be memoized
  logToAnalytics('component_rendered');

  return <div>Content</div>;
}
```

---

## Khắc phục sự cố {/*troubleshooting*/}

### Component không được biên dịch trong chế độ suy luận {/*component-not-compiled-infer*/}

Trong chế độ `'infer'`, hãy đảm bảo component của bạn tuân theo các quy ước của React:

```js
// ❌ Won't be compiled: lowercase name
function button(props) {
  return <button>{props.label}</button>;
}

// ✅ Will be compiled: PascalCase name
function Button(props) {
  return <button>{props.label}</button>;
}

// ❌ Won't be compiled: doesn't create JSX or call hooks
function useData() {
  return window.localStorage.getItem('data');
}

// ✅ Will be compiled: calls a hook
function useData() {
  const [data] = useState(() => window.localStorage.getItem('data'));
  return data;
}
```