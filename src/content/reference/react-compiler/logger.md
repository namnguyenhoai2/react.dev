---
title: logger
---

<Intro>

Tùy chọn `logger` cung cấp tính năng ghi log tùy chỉnh cho các sự kiện của React Compiler trong quá trình biên dịch.

</Intro>

```js
{
  logger: {
    logEvent(filename, event) {
      console.log(`[Compiler] ${event.kind}: ${filename}`);
    }
  }
}
```

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `logger` {/*logger*/}

Cấu hình tính năng ghi log tùy chỉnh để theo dõi hoạt động của compiler và gỡ lỗi.

#### Kiểu {/*type*/}

```
{
  logEvent: (filename: string | null, event: LoggerEvent) => void;
} | null
```

#### Giá trị mặc định {/*default-value*/}

`null`

#### Các phương thức {/*methods*/}

- **`logEvent`**: Được gọi cho mỗi sự kiện của compiler cùng với tên tệp và thông tin chi tiết về sự kiện

#### Các kiểu sự kiện {/*event-types*/}

- **`CompileSuccess`**: Function được biên dịch thành công
- **`CompileError`**: Function bị bỏ qua do có lỗi
- **`CompileDiagnostic`**: Thông tin chẩn đoán không nghiêm trọng
- **`CompileSkip`**: Function bị bỏ qua vì các lý do khác
- **`PipelineError`**: Lỗi biên dịch không mong đợi
- **`Timing`**: Thông tin về thời gian thực thi

#### Lưu ý {/*caveats*/}

- Cấu trúc sự kiện có thể thay đổi giữa các phiên bản
- Các codebase lớn tạo ra nhiều mục nhập log

---

## Cách sử dụng {/*usage*/}

### Ghi log cơ bản {/*basic-logging*/}

Theo dõi các lần biên dịch thành công và thất bại:

```js
{
  logger: {
    logEvent(filename, event) {
      switch (event.kind) {
        case 'CompileSuccess': {
          console.log(`✅ Compiled: ${filename}`);
          break;
        }
        case 'CompileError': {
          console.log(`❌ Skipped: ${filename}`);
          break;
        }
        default: {}
      }
    }
  }
}
```

### Ghi log lỗi chi tiết {/*detailed-error-logging*/}

Nhận thông tin cụ thể về các lần biên dịch thất bại:

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileError') {
        console.error(`\nCompilation failed: ${filename}`);
        console.error(`Reason: ${event.detail.reason}`);

        if (event.detail.description) {
          console.error(`Details: ${event.detail.description}`);
        }

        if (event.detail.loc) {
          const { line, column } = event.detail.loc.start;
          console.error(`Location: Line ${line}, Column ${column}`);
        }

        if (event.detail.suggestions) {
          console.error('Suggestions:', event.detail.suggestions);
        }
      }
    }
  }
}
```