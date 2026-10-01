---
title: cơ chế gating
---

<Intro>

Tùy chọn `gating` bật conditional compilation, cho phép bạn kiểm soát thời điểm code đã được tối ưu hóa được sử dụng trong runtime.

</Intro>

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

<InlineToc />

---

## Tham khảo {/*reference*/}

### `gating` {/*gating*/}

Cấu hình cơ chế gating của feature flag trong runtime cho các function đã được compile.

#### Kiểu {/*type*/}

```
{
  source: string;
  importSpecifierName: string;
} | null
```

#### Giá trị mặc định {/*default-value*/}

`null`

#### Thuộc tính {/*properties*/}

- **`source`**: Đường dẫn module để import feature flag từ đó
- **`importSpecifierName`**: Tên của function được export cần import

#### Lưu ý {/*caveats*/}

- Function gating phải trả về một giá trị boolean
- Cả phiên bản đã compile và phiên bản gốc đều làm tăng kích thước bundle
- Import được thêm vào mọi file có các function đã compile

---

## Cách sử dụng {/*usage*/}

### Thiết lập feature flag cơ bản {/*basic-setup*/}

1. Tạo một module feature flag:

```js
// src/utils/feature-flags.js
export function shouldUseCompiler() {
  // logic của bạn ở đây
  return getFeatureFlag('react-compiler-enabled');
}
```

2. Cấu hình compiler:

```js
{
  gating: {
    source: './src/utils/feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

3. Compiler tạo ra code có gating:

```js
// Đầu vào
function Button(props) {
  return <button>{props.label}</button>;
}

// Đầu ra (đã giản lược)
import { shouldUseCompiler } from './src/utils/feature-flags';

const Button = shouldUseCompiler()
  ? function Button_optimized(props) { /* phiên bản đã biên dịch */ }
  : function Button_original(props) { /* phiên bản gốc */ };
```

Lưu ý rằng function gating được đánh giá một lần tại thời điểm module được tải, vì vậy sau khi JS bundle được phân tích cú pháp và đánh giá, lựa chọn component sẽ giữ nguyên trong suốt phần còn lại của phiên trình duyệt.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Feature flag không hoạt động {/*flag-not-working*/}

Xác minh rằng module flag của bạn export đúng function:

```js
// ❌ Sai: export mặc định
export default function shouldUseCompiler() {
  return true;
}

// ✅ Đúng: named export khớp với importSpecifierName
export function shouldUseCompiler() {
  return true;
}
```

### Lỗi import {/*import-errors*/}

Đảm bảo source path là chính xác:

```js
// ❌ Sai: đường dẫn tương đối với babel.config.js
{
  source: './src/flags',
  importSpecifierName: 'flag'
}

// ✅ Đúng: đường dẫn phân giải module
{
  source: '@myapp/feature-flags',
  importSpecifierName: 'flag'
}

// ✅ Cũng đúng: đường dẫn tuyệt đối từ thư mục gốc của dự án
{
  source: './src/utils/flags',
  importSpecifierName: 'flag'
}
```
