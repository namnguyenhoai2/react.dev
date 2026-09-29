---
title: đích
---

<Intro>

Tùy chọn `target` chỉ định phiên bản React mà compiler nên tạo mã cho phiên bản đó.

</Intro>

```js
{
  target: '19' // or '18', '17'
}
```

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `target` {/*target*/}

Cấu hình khả năng tương thích phiên bản React cho output đã được compile.

#### Kiểu {/*type*/}

```
'17' | '18' | '19'
```

#### Giá trị mặc định {/*default-value*/}

`'19'`

#### Các giá trị hợp lệ {/*valid-values*/}

- **`'19'`**: Nhắm đến React 19 (mặc định). Không cần runtime bổ sung.
- **`'18'`**: Nhắm đến React 18. Yêu cầu package `react-compiler-runtime`.
- **`'17'`**: Nhắm đến React 17. Yêu cầu package `react-compiler-runtime`.

#### Lưu ý {/*caveats*/}

- Luôn sử dụng giá trị dạng chuỗi, không sử dụng số (ví dụ: `'17'`, không phải `17`)
- Không bao gồm các phiên bản patch (ví dụ: sử dụng `'18'`, không phải `'18.2.0'`)
- React 19 tích hợp sẵn các runtime API của compiler
- React 17 và 18 yêu cầu cài đặt `react-compiler-runtime@latest`

---

## Cách sử dụng {/*usage*/}

### Nhắm đến React 19 (mặc định) {/*targeting-react-19*/}

Đối với React 19, không cần cấu hình đặc biệt:

```js
{
  // defaults to target: '19'
}
```

Compiler sẽ sử dụng các runtime API tích hợp sẵn của React 19:

```js
// Compiled output uses React 19's native APIs
import { c as _c } from 'react/compiler-runtime';
```

### Nhắm đến React 17 hoặc 18 {/*targeting-react-17-or-18*/}

Đối với các project React 17 và React 18, bạn cần thực hiện hai bước:

1. Cài đặt runtime package:

```bash
npm install react-compiler-runtime@latest
```

2. Cấu hình target:

```js
// For React 18
{
  target: '18'
}

// For React 17
{
  target: '17'
}
```

Compiler sẽ sử dụng polyfill runtime cho cả hai phiên bản:

```js
// Compiled output uses the polyfill
import { c as _c } from 'react-compiler-runtime';
```

---

## Khắc phục sự cố {/*troubleshooting*/}

### Lỗi runtime liên quan đến compiler runtime bị thiếu {/*missing-runtime*/}

Nếu bạn thấy các lỗi như "Cannot find module 'react/compiler-runtime'":

1. Kiểm tra phiên bản React của bạn:
   ```bash
   npm why react
   ```

2. Nếu đang sử dụng React 17 hoặc 18, hãy cài đặt runtime:
   ```bash
   npm install react-compiler-runtime@latest
   ```

3. Đảm bảo target khớp với phiên bản React của bạn:
   ```js
   {
     target: '18' // Must match your React major version
   }
   ```

### Runtime package không hoạt động {/*runtime-not-working*/}

Đảm bảo runtime package:

1. Được cài đặt trong project của bạn (không phải cài đặt global)
2. Được liệt kê trong dependencies của `package.json`
3. Là đúng phiên bản (tag `@latest`)
4. Không nằm trong `devDependencies` (vì package này cần thiết lúc runtime)

### Kiểm tra output đã compile {/*checking-output*/}

Để xác minh runtime chính xác đang được sử dụng, hãy lưu ý import khác nhau (`react/compiler-runtime` cho runtime tích hợp sẵn, `react-compiler-runtime` cho standalone package dành cho 17/18):

```js
// For React 19 (built-in runtime)
import { c } from 'react/compiler-runtime'
//                      ^

// For React 17/18 (polyfill runtime)
import { c } from 'react-compiler-runtime'
//                      ^
```