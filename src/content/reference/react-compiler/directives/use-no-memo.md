---
title: "use no memo"
titleForTitleTag: Chỉ thị "'use no memo'"
---

<Intro>

`"use no memo"` ngăn một hàm được tối ưu hóa bởi React Compiler.

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `"use no memo"` {/*use-no-memo*/}

Thêm `"use no memo"` ở đầu một hàm để ngăn React Compiler tối ưu hóa hàm đó.

```js {1}
function MyComponent() {
  "use no memo";
  // ...
}
```

Khi một hàm chứa `"use no memo"`, React Compiler sẽ hoàn toàn bỏ qua hàm đó trong quá trình tối ưu hóa. Điều này hữu ích như một cách tạm thời để vô hiệu hóa tính năng khi debug hoặc khi xử lý code không hoạt động chính xác với compiler.

#### Lưu ý {/*caveats*/}

* `"use no memo"` phải nằm ở vị trí đầu tiên trong thân hàm, trước mọi import hoặc code khác (comment được phép).
* Chỉ thị phải được viết bằng dấu ngoặc kép hoặc dấu ngoặc đơn, không dùng backtick.
* Chỉ thị phải khớp chính xác với `"use no memo"` hoặc alias `"use no forget"` của nó.
* Chỉ thị này được ưu tiên hơn tất cả chế độ compilation và các chỉ thị khác.
* Chỉ thị này được thiết kế như một công cụ debug tạm thời, không phải giải pháp lâu dài.

### Cách `"use no memo"` loại khỏi quá trình tối ưu hóa {/*how-use-no-memo-opts-out*/}

React Compiler phân tích code của bạn tại thời điểm build để áp dụng các tối ưu hóa. `"use no memo"` tạo ra một ranh giới rõ ràng, yêu cầu compiler hoàn toàn bỏ qua một hàm.

Chỉ thị này được ưu tiên hơn mọi cài đặt khác:
* Ở chế độ `all`: Hàm bị bỏ qua bất kể cài đặt toàn cục
* Ở chế độ `infer`: Hàm bị bỏ qua ngay cả khi heuristic cho rằng nên tối ưu hóa hàm đó

Compiler xử lý các hàm này như thể React Compiler chưa được bật, giữ nguyên chúng đúng như cách bạn đã viết.

### Khi nào nên sử dụng `"use no memo"` {/*when-to-use*/}

Nên sử dụng `"use no memo"` một cách có chọn lọc và tạm thời. Các trường hợp phổ biến gồm:

#### Debug sự cố với compiler {/*debugging-compiler*/}
Khi nghi ngờ compiler đang gây ra sự cố, hãy tạm thời vô hiệu hóa tính năng tối ưu hóa để cô lập vấn đề:

```js
function ProblematicComponent({ data }) {
  "use no memo"; // TODO: Remove after fixing issue #123

  // Rules of React violations that weren't statically detected
  // ...
}
```

#### Tích hợp thư viện bên thứ ba {/*third-party*/}
Khi tích hợp với các thư viện có thể không tương thích với compiler:

```js
function ThirdPartyWrapper() {
  "use no memo";

  useThirdPartyHook(); // Has side effects that compiler might optimize incorrectly
  // ...
}
```

---

## Cách sử dụng {/*usage*/}

Chỉ thị `"use no memo"` được đặt ở đầu thân hàm để ngăn React Compiler tối ưu hóa hàm đó:

```js
function MyComponent() {
  "use no memo";
  // Function body
}
```

Chỉ thị này cũng có thể được đặt ở đầu file để áp dụng cho tất cả các hàm trong module đó:

```js
"use no memo";

// All functions in this file will be skipped by the compiler
```

`"use no memo"` ở cấp độ hàm sẽ ghi đè chỉ thị ở cấp độ module.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Chỉ thị không ngăn compilation {/*not-preventing*/}

Nếu `"use no memo"` không hoạt động:

```js
// ❌ Wrong - directive after code
function Component() {
  const data = getData();
  "use no memo"; // Too late!
}

// ✅ Correct - directive first
function Component() {
  "use no memo";
  const data = getData();
}
```

Ngoài ra, hãy kiểm tra:
* Chính tả - phải chính xác là `"use no memo"`
* Dấu ngoặc - phải sử dụng dấu ngoặc đơn hoặc dấu ngoặc kép, không dùng backtick

### Phương pháp tốt nhất {/*best-practices*/}

**Luôn ghi lại lý do** bạn vô hiệu hóa tính năng tối ưu hóa:

```js
// ✅ Good - clear explanation and tracking
function DataProcessor() {
  "use no memo"; // TODO: Remove after fixing rule of react violation
  // ...
}

// ❌ Bad - no explanation
function Mystery() {
  "use no memo";
  // ...
}
```

### Xem thêm {/*see-also*/}

* [`"use memo"`](/reference/react-compiler/directives/use-memo) - Bật compilation
* [React Compiler](/learn/react-compiler) - Hướng dẫn bắt đầu