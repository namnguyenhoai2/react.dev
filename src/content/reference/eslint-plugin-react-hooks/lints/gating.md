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
// ❌ Missing required fields
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: '__experimental_useCompiler'
        // Missing 'source' field
      }
    }]
  ]
};

// ❌ Invalid gating type
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: '__experimental_useCompiler' // Should be object
    }]
  ]
};
```

### Hợp lệ {/*valid*/}

Ví dụ về mã đúng đối với quy tắc này:

```js
// ✅ Complete gating configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: 'isCompilerEnabled', // exported function name
        source: 'featureFlags' // module name
      }
    }]
  ]
};

// featureFlags.js
export function isCompilerEnabled() {
  // ...
}

// ✅ No gating (compile everything)
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // No gating field - compiles all components
    }]
  ]
};
```