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
// ❌ Tên tùy chọn không xác định
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // Lỗi chính tả: phải là compilationMode
    }]
  ]
};

// ❌ Giá trị tùy chọn không hợp lệ
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // Không hợp lệ: dùng 'all' hoặc 'infer'
    }]
  ]
};
```

### Hợp lệ {/*valid*/}

Ví dụ về code chính xác đối với rule này:

```js
// ✅ Cấu hình compiler hợp lệ
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
// ❌ Sai: Các lỗi cấu hình thường gặp
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Lỗi chính tả trong tên tùy chọn
      compilationMod: 'all',
      // Sai kiểu giá trị
      panicThreshold: true,
      // Tùy chọn không xác định
      optimizationLevel: 'max'
    }]
  ]
};
```

Hãy xem [tài liệu cấu hình](/reference/react-compiler/configuration) để biết các tùy chọn hợp lệ:

```js
// ✅ Tốt hơn: Cấu hình hợp lệ
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // hoặc 'infer'
      panicThreshold: 'none', // hoặc 'critical_errors', 'all_errors'
      // Chỉ dùng các tùy chọn đã được ghi tài liệu
    }]
  ]
};
```
