---
title: Cấu hình
---

<Intro>

Trang này liệt kê tất cả tùy chọn cấu hình có trong React Compiler.

</Intro>

<Note>

Đối với hầu hết ứng dụng, các tùy chọn mặc định sẽ hoạt động ngay mà không cần cấu hình thêm. Nếu bạn có nhu cầu đặc biệt, bạn có thể sử dụng các tùy chọn nâng cao này.

</Note>

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler', {
        // compiler options
      }
    ]
  ]
};
```

---

## Kiểm soát biên dịch {/*compilation-control*/}

Các tùy chọn này kiểm soát *những gì* compiler tối ưu hóa và *cách* compiler chọn các component và hook để biên dịch.

* [`compilationMode`](/reference/react-compiler/compilationMode) kiểm soát chiến lược chọn các function để biên dịch (ví dụ: tất cả function, chỉ những function được chú thích hoặc tự động phát hiện thông minh).

```js
{
  compilationMode: 'annotation' // Only compile "use memo" functions
}
```

---

## Khả năng tương thích phiên bản {/*version-compatibility*/}

Cấu hình phiên bản React đảm bảo compiler tạo ra code tương thích với phiên bản React của bạn.

[`target`](/reference/react-compiler/target) chỉ định phiên bản React bạn đang sử dụng (17, 18 hoặc 19).

```js
// For React 18 projects
{
  target: '18' // Also requires react-compiler-runtime package
}
```

---

## Xử lý lỗi {/*error-handling*/}

Các tùy chọn này kiểm soát cách compiler phản hồi với code không tuân theo [Rules of React](/reference/rules).

[`panicThreshold`](/reference/react-compiler/panicThreshold) xác định việc build sẽ thất bại hay bỏ qua các component có vấn đề.

```js
// Recommended for production
{
  panicThreshold: 'none' // Skip components with errors instead of failing the build
}
```

---

## Gỡ lỗi {/*debugging*/}

Các tùy chọn logging và phân tích giúp bạn hiểu compiler đang thực hiện những gì.

[`logger`](/reference/react-compiler/logger) cung cấp logging tùy chỉnh cho các sự kiện biên dịch.

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileSuccess') {
        console.log('Compiled:', filename);
      }
    }
  }
}
```

---

## Cờ tính năng {/*feature-flags*/}

Biên dịch có điều kiện cho phép bạn kiểm soát thời điểm sử dụng code đã được tối ưu hóa.

[`gating`](/reference/react-compiler/gating) bật các cờ tính năng runtime để A/B testing hoặc rollout dần dần.

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'isCompilerEnabled'
  }
}
```

---

## Các mẫu cấu hình phổ biến {/*common-patterns*/}

### Cấu hình mặc định {/*default-configuration*/}

Đối với hầu hết ứng dụng React 19, compiler hoạt động mà không cần cấu hình:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler'
  ]
};
```

### Dự án React 17/18 {/*react-17-18*/}

Các phiên bản React cũ hơn cần runtime package và target configuration:

```bash
npm install react-compiler-runtime@latest
```

```js
{
  target: '18' // or '17'
}
```

### Áp dụng từng bước {/*incremental-adoption*/}

Bắt đầu với các thư mục cụ thể rồi dần mở rộng:

```js
{
  compilationMode: 'annotation' // Only compile "use memo" functions
}
```