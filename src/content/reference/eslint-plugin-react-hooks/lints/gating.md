---
title: gating
---

<Intro>

Xác thực cấu hình của [chế độ gating](/reference/react-compiler/gating).

</Intro>

## Chi tiết quy tắc {/*rule-details*/}

Chế độ gating cho phép bạn từng bước áp dụng React Compiler bằng cách đánh dấu các component cụ thể để tối ưu hóa. Quy tắc này đảm bảo cấu hình gating của bạn hợp lệ để compiler biết cần xử lý những component nào.

### Không hợp lệ {/*invalid*/}

Ví dụ về mã không đúng đối với quy tắc này:

```js
// ❌ Thiếu trường bắt buộc
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: '__experimental_useCompiler'
        // Thiếu trường 'source'
      }
    }]
  ]
};

// ❌ Kiểu gating không hợp lệ
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: '__experimental_useCompiler' // Phải là object
    }]
  ]
};
```

### Hợp lệ {/*valid*/}

Ví dụ về mã đúng đối với quy tắc này:

```js
// ✅ Cấu hình gating đầy đủ
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: 'isCompilerEnabled', // tên hàm được export
        source: 'featureFlags' // tên module
      }
    }]
  ]
};

// featureFlags.js
export function isCompilerEnabled() {
  // ...
}

// ✅ Không gating (biên dịch mọi thứ)
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Không có trường gating — biên dịch tất cả component
    }]
  ]
};
```
