---
title: panicThreshold
---

<Intro>

Tùy chọn `panicThreshold` kiểm soát cách React Compiler xử lý lỗi trong quá trình biên dịch.

</Intro>

```js
{
  panicThreshold: 'none' // Recommended
}
```

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `panicThreshold` {/*panicthreshold*/}

Xác định liệu lỗi biên dịch có làm quá trình build thất bại hay bỏ qua bước tối ưu hóa.

#### Kiểu {/*type*/}

```
'none' | 'critical_errors' | 'all_errors'
```

#### Giá trị mặc định {/*default-value*/}

`'none'`

#### Các tùy chọn {/*options*/}

- **`'none'`** (mặc định, khuyến nghị): Bỏ qua các component không thể biên dịch và tiếp tục build
- **`'critical_errors'`**: Chỉ làm quá trình build thất bại khi gặp lỗi nghiêm trọng của compiler
- **`'all_errors'`**: Làm quá trình build thất bại khi có bất kỳ diagnostic nào từ compiler

#### Lưu ý {/*caveats*/}

- Build production luôn phải sử dụng `'none'`
- Build thất bại sẽ ngăn ứng dụng của bạn được build
- Compiler tự động phát hiện và bỏ qua code có vấn đề với `'none'`
- Các threshold cao hơn chỉ hữu ích trong quá trình development để debug

---

## Cách sử dụng {/*usage*/}

### Cấu hình production (khuyến nghị) {/*production-configuration*/}

Đối với các build production, luôn sử dụng `'none'`. Đây là giá trị mặc định:

```js
{
  panicThreshold: 'none'
}
```

Điều này đảm bảo:
- Build của bạn không bao giờ thất bại do các vấn đề của compiler
- Các component không thể được tối ưu hóa vẫn chạy bình thường
- Số lượng component được tối ưu hóa đạt mức tối đa
- Các lần deploy production ổn định

### Debug trong development {/*development-debugging*/}

Tạm thời sử dụng các threshold nghiêm ngặt hơn để tìm vấn đề:

```js
const isDevelopment = process.env.NODE_ENV === 'development';

{
  panicThreshold: isDevelopment ? 'critical_errors' : 'none',
  logger: {
    logEvent(filename, event) {
      if (isDevelopment && event.kind === 'CompileError') {
        // ...
      }
    }
  }
}
```