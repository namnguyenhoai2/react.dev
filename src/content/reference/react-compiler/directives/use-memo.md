---
title: "use memo"
titleForTitleTag: Chỉ thị "'use memo'"
---

<Intro>

`"use memo"` đánh dấu một hàm để React Compiler tối ưu hóa.

</Intro>

<Note>

Trong hầu hết trường hợp, bạn không cần `"use memo"`. Chỉ thị này chủ yếu cần thiết trong chế độ `annotation`, nơi bạn phải đánh dấu rõ ràng các hàm để tối ưu hóa. Trong chế độ `infer`, compiler tự động phát hiện các component và hook dựa trên quy tắc đặt tên của chúng (PascalCase cho component, tiền tố `use` cho hook). Nếu một component hoặc hook không được compile trong chế độ `infer`, bạn nên sửa quy ước đặt tên của nó thay vì buộc compile bằng `"use memo"`.

</Note>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `"use memo"` {/*use-memo*/}

Thêm `"use memo"` ở đầu một hàm để đánh dấu hàm đó cho React Compiler tối ưu hóa.

```js {1}
function MyComponent() {
  "use memo";
  // ...
}
```

Khi một hàm chứa `"use memo"`, React Compiler sẽ phân tích và tối ưu hóa hàm đó trong thời gian build. Compiler sẽ tự động memoize các giá trị và component để tránh việc tính toán lại và re-render không cần thiết.

#### Lưu ý {/*caveats*/}

* `"use memo"` phải nằm ngay đầu thân hàm, trước mọi import hoặc code khác (comment được phép).
* Chỉ thị phải được viết bằng dấu ngoặc kép hoặc ngoặc đơn, không phải backtick.
* Chỉ thị phải khớp chính xác với `"use memo"`.
* Chỉ thị đầu tiên trong một hàm sẽ được xử lý; các chỉ thị bổ sung sẽ bị bỏ qua.
* Tác động của chỉ thị phụ thuộc vào thiết lập [`compilationMode`](/reference/react-compiler/compilationMode) của bạn.

### Cách `"use memo"` đánh dấu các hàm để tối ưu hóa {/*how-use-memo-marks*/}

Trong một ứng dụng React sử dụng React Compiler, các hàm được phân tích trong thời gian build để xác định xem chúng có thể được tối ưu hóa hay không. Theo mặc định, compiler tự động suy luận những component nào cần được memoize, nhưng điều này có thể phụ thuộc vào thiết lập [`compilationMode`](/reference/react-compiler/compilationMode) của bạn nếu bạn đã thiết lập.

`"use memo"` đánh dấu rõ ràng một hàm để tối ưu hóa, ghi đè hành vi mặc định:

* Trong chế độ `annotation`: Chỉ các hàm có `"use memo"` mới được tối ưu hóa
* Trong chế độ `infer`: Compiler sử dụng heuristic, nhưng `"use memo"` sẽ buộc tối ưu hóa
* Trong chế độ `all`: Mọi thứ được tối ưu hóa theo mặc định, khiến `"use memo"` trở nên dư thừa

Chỉ thị này tạo ra một ranh giới rõ ràng trong codebase giữa code được tối ưu hóa và code không được tối ưu hóa, cho phép bạn kiểm soát chi tiết quá trình compilation.

### Khi nào nên sử dụng `"use memo"` {/*when-to-use*/}

Bạn nên cân nhắc sử dụng `"use memo"` khi:

#### Bạn đang sử dụng chế độ annotation {/*annotation-mode-use*/}
Trong `compilationMode: 'annotation'`, chỉ thị này là bắt buộc đối với mọi hàm bạn muốn tối ưu hóa:

```js
// ✅ This component will be optimized
function OptimizedList() {
  "use memo";
  // ...
}

// ❌ This component won't be optimized
function SimpleWrapper() {
  // ...
}
```

#### Bạn đang dần áp dụng React Compiler {/*gradual-adoption*/}
Bắt đầu với chế độ `annotation` và chọn lọc các component ổn định để tối ưu hóa:

```js
// Start by optimizing leaf components
function Button({ onClick, children }) {
  "use memo";
  // ...
}

// Gradually move up the tree as you verify behavior
function ButtonGroup({ buttons }) {
  "use memo";
  // ...
}
```

---

## Cách sử dụng {/*usage*/}

### Làm việc với các chế độ compilation khác nhau {/*compilation-modes*/}

Hành vi của `"use memo"` thay đổi tùy theo cấu hình compiler của bạn:

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation' // or 'infer' or 'all'
    }]
  ]
};
```

#### Chế độ annotation {/*annotation-mode-example*/}
```js
// ✅ Optimized with "use memo"
function ProductCard({ product }) {
  "use memo";
  // ...
}

// ❌ Not optimized (no directive)
function ProductList({ products }) {
  // ...
}
```

#### Chế độ Infer (mặc định) {/*infer-mode-example*/}
```js
// Automatically memoized because this is named like a Component
function ComplexDashboard({ data }) {
  // ...
}

// Skipped: Is not named like a Component
function simpleDisplay({ text }) {
  // ...
}
```

Trong chế độ `infer`, compiler tự động phát hiện các component và hook dựa trên quy tắc đặt tên của chúng (PascalCase cho component, tiền tố `use` cho hook). Nếu một component hoặc hook không được compile trong chế độ `infer`, bạn nên sửa quy ước đặt tên của nó thay vì buộc compile bằng `"use memo"`.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Xác minh việc tối ưu hóa {/*verifying-optimization*/}

Để xác nhận component của bạn đang được tối ưu hóa:

1. Kiểm tra output đã compile trong bản build của bạn
2. Sử dụng React DevTools để kiểm tra badge Memo ✨

### Xem thêm {/*see-also*/}

* [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) - Tắt compilation
* [`compilationMode`](/reference/react-compiler/compilationMode) - Cấu hình hành vi compilation
* [React Compiler](/learn/react-compiler) - Hướng dẫn bắt đầu vertal