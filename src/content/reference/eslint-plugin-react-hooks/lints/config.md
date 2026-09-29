---
title: config
---

<Intro>

Xác thực [các tùy chọn cấu hình](/reference/react-compiler/configuration) của compiler.

</Intro>

## Chi tiết về rule {/*rule-details*/}

React Compiler chấp nhận nhiều [tùy chọn cấu hình](/reference/react-compiler/configuration) để kiểm soát hành vi của nó. Rule này xác thực rằng cấu hình của bạn sử dụng đúng tên tùy chọn và kiểu giá trị, giúp ngăn các lỗi im lặng do lỗi chính tả hoặc cài đặt không chính xác.

### Không hợp lệ {/*invalid*/}

Ví dụ về code không chính xác đối với rule này:

```js
// ❌ Unknown option name
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // Typo: should be compilationMode
    }]
  ]
};

// ❌ Invalid option value
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // Invalid: use 'all' or 'infer'
    }]
  ]
};
```

### Hợp lệ {/*valid*/}

Ví dụ về code chính xác đối với rule này:

```js
// ✅ Valid compiler configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer',
      panicThreshold: 'critical_errors'
    }]
  ]
};
```

## Khắc phục sự cố {/*troubleshooting*/}

### Cấu hình không hoạt động như mong đợi {/*config-not-working*/}

Cấu hình compiler của bạn có thể chứa lỗi chính tả hoặc giá trị không chính xác:

```js
// ❌ Wrong: Common configuration mistakes
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Typo in option name
      compilationMod: 'all',
      // Wrong value type
      panicThreshold: true,
      // Unknown option
      optimizationLevel: 'max'
    }]
  ]
};
```

Hãy xem [tài liệu cấu hình](/reference/react-compiler/configuration) để biết các tùy chọn hợp lệ:

```js
// ✅ Better: Valid configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // or 'infer'
      panicThreshold: 'none', // or 'critical_errors', 'all_errors'
      // Only use documented options
    }]
  ]
};
```