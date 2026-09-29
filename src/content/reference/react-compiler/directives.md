---
title: Directives
---

<Intro>
React Compiler directives là các string literal đặc biệt, dùng để kiểm soát việc có biên dịch các hàm cụ thể hay không.
</Intro>

```js
function MyComponent() {
  "use memo"; // Opt this component into compilation
  return <div>{/* ... */}</div>;
}
```

<InlineToc />

---

## Tổng quan {/*overview*/}

React Compiler directives cung cấp quyền kiểm soát chi tiết đối với những hàm được compiler tối ưu hóa. Chúng là các string literal được đặt ở đầu thân hàm hoặc ở đầu module.

### Các directive hiện có {/*available-directives*/}

* **[`"use memo"`](/reference/react-compiler/directives/use-memo)** - Cho phép hàm được biên dịch
* **[`"use no memo"`](/reference/react-compiler/directives/use-no-memo)** - Ngăn hàm được biên dịch

### So sánh nhanh {/*quick-comparison*/}

| Directive | Mục đích | Khi nào sử dụng |
|-----------|---------|-------------|
| [`"use memo"`](/reference/react-compiler/directives/use-memo) | Buộc biên dịch | Khi sử dụng chế độ `annotation` hoặc để ghi đè các heuristic của chế độ `infer` |
| [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) | Ngăn biên dịch | Khi debug sự cố hoặc làm việc với code không tương thích |

---

## Cách sử dụng {/*usage*/}

### Directive ở cấp hàm {/*function-level*/}

Đặt directive ở đầu một hàm để kiểm soát việc biên dịch hàm đó:

```js
// Opt into compilation
function OptimizedComponent() {
  "use memo";
  return <div>This will be optimized</div>;
}

// Opt out of compilation
function UnoptimizedComponent() {
  "use no memo";
  return <div>This won't be optimized</div>;
}
```

### Directive ở cấp module {/*module-level*/}

Đặt directive ở đầu file để áp dụng cho tất cả các hàm trong module đó:

```js
// At the very top of the file
"use memo";

// All functions in this file will be compiled
function Component1() {
  return <div>Compiled</div>;
}

function Component2() {
  return <div>Also compiled</div>;
}

// Can be overridden at function level
function Component3() {
  "use no memo"; // This overrides the module directive
  return <div>Not compiled</div>;
}
```

### Tương tác với các chế độ biên dịch {/*compilation-modes*/}

Directive hoạt động khác nhau tùy thuộc vào [`compilationMode`](/reference/react-compiler/compilationMode) của bạn:

* **Chế độ `annotation`**: Chỉ các hàm có `"use memo"` mới được biên dịch
* **Chế độ `infer`**: Compiler quyết định nội dung cần biên dịch; các directive sẽ ghi đè những quyết định này
* **Chế độ `all`**: Mọi thứ đều được biên dịch; `"use no memo"` có thể loại trừ các hàm cụ thể

---

## Các phương pháp hay nhất {/*best-practices*/}

### Sử dụng directive có chừng mực {/*use-sparingly*/}

Directive là các lối thoát. Hãy ưu tiên cấu hình compiler ở cấp project:

```js
// ✅ Good - project-wide configuration
{
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer'
    }]
  ]
}

// ⚠️ Use directives only when needed
function SpecialCase() {
  "use no memo"; // Document why this is needed
  // ...
}
```

### Ghi chú việc sử dụng directive {/*document-usage*/}

Luôn giải thích lý do sử dụng directive:

```js
// ✅ Good - clear explanation
function DataGrid() {
  "use no memo"; // TODO: Remove after fixing issue with dynamic row heights (JIRA-123)
  // Complex grid implementation
}

// ❌ Bad - no explanation
function Mystery() {
  "use no memo";
  // ...
}
```

### Lên kế hoạch loại bỏ {/*plan-removal*/}

Các directive opt-out nên chỉ mang tính tạm thời:

1. Thêm directive cùng một comment TODO
2. Tạo issue để theo dõi
3. Khắc phục vấn đề nền tảng
4. Xóa directive

```js
function TemporaryWorkaround() {
  "use no memo"; // TODO: Remove after upgrading ThirdPartyLib to v2.0
  return <ThirdPartyComponent />;
}
```

---

## Các mẫu thường gặp {/*common-patterns*/}

### Áp dụng dần dần {/*gradual-adoption*/}

Khi áp dụng React Compiler vào một codebase lớn:

```js
// Start with annotation mode
{
  compilationMode: 'annotation'
}

// Opt in stable components
function StableComponent() {
  "use memo";
  // Well-tested component
}

// Later, switch to infer mode and opt out problematic ones
function ProblematicComponent() {
  "use no memo"; // Fix issues before removing
  // ...
}
```


---

## Khắc phục sự cố {/*troubleshooting*/}

Đối với các vấn đề cụ thể liên quan đến directive, hãy xem các phần khắc phục sự cố trong:

* [`"use memo"` khắc phục sự cố](/reference/react-compiler/directives/use-memo#troubleshooting)
* [`"use no memo"` khắc phục sự cố](/reference/react-compiler/directives/use-no-memo#troubleshooting)

### Các vấn đề thường gặp {/*common-issues*/}

1. **Directive bị bỏ qua**: Kiểm tra vị trí (phải ở đầu tiên) và chính tả
2. **Vẫn xảy ra biên dịch**: Kiểm tra thiết lập `ignoreUseNoForget`
3. **Directive ở cấp module không hoạt động**: Đảm bảo directive nằm trước tất cả các import

---

## Xem thêm {/*see-also*/}

* [`compilationMode`](/reference/react-compiler/compilationMode) - Cấu hình cách compiler chọn nội dung cần tối ưu hóa
* [`Configuration`](/reference/react-compiler/configuration) - Toàn bộ tùy chọn cấu hình compiler
* [Tài liệu React Compiler](https://react.dev/learn/react-compiler) - Hướng dẫn bắt đầu