---
title: Biên dịch thư viện
---

<Intro>
Hướng dẫn này giúp các tác giả thư viện hiểu cách sử dụng React Compiler để cung cấp mã thư viện được tối ưu hóa cho người dùng.
</Intro>

<InlineToc />

## Tại sao nên phân phối mã đã biên dịch? {/*why-ship-compiled-code*/}

Với tư cách là tác giả thư viện, bạn có thể biên dịch mã thư viện trước khi phát hành lên npm. Điều này mang lại một số lợi ích:

- **Cải thiện hiệu suất cho tất cả người dùng** - Người dùng thư viện của bạn nhận được mã được tối ưu hóa ngay cả khi họ chưa sử dụng React Compiler
- **Người dùng không cần cấu hình** - Các tối ưu hóa hoạt động ngay từ đầu
- **Hành vi nhất quán** - Tất cả người dùng đều nhận được cùng một phiên bản được tối ưu hóa, bất kể thiết lập build của họ

## Thiết lập việc biên dịch {/*setting-up-compilation*/}

Thêm React Compiler vào quy trình build của thư viện:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

Cấu hình công cụ build để biên dịch thư viện của bạn. Ví dụ với Babel:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler',
  ],
  // ... cấu hình khác
};
```

## Tính tương thích ngược {/*backwards-compatibility*/}

Nếu thư viện của bạn hỗ trợ các phiên bản React thấp hơn 19, bạn sẽ cần cấu hình bổ sung:

### 1. Cài đặt package runtime {/*install-runtime-package*/}

Chúng tôi khuyến nghị cài đặt react-compiler-runtime dưới dạng dependency trực tiếp:

<TerminalBlock>
npm install react-compiler-runtime@latest
</TerminalBlock>

```json
{
  "dependencies": {
    "react-compiler-runtime": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
  }
}
```

### 2. Cấu hình phiên bản đích {/*configure-target-version*/}

Đặt phiên bản React tối thiểu mà thư viện của bạn hỗ trợ:

```js
{
  target: '17', // Phiên bản React thấp nhất được hỗ trợ
}
```

## Chiến lược kiểm thử {/*testing-strategy*/}

Kiểm thử thư viện của bạn cả khi có và không có biên dịch để đảm bảo tính tương thích. Chạy test suite hiện có trên mã đã biên dịch, đồng thời tạo một cấu hình kiểm thử riêng bỏ qua compiler. Điều này giúp phát hiện các vấn đề có thể phát sinh trong quá trình biên dịch và đảm bảo thư viện hoạt động chính xác trong mọi tình huống.

## Khắc phục sự cố {/*troubleshooting*/}

### Thư viện không hoạt động với các phiên bản React cũ hơn {/*library-doesnt-work-with-older-react-versions*/}

Nếu thư viện đã biên dịch của bạn phát sinh lỗi trong React 17 hoặc 18:

1. Xác minh rằng bạn đã cài đặt `react-compiler-runtime` dưới dạng dependency
2. Kiểm tra xem cấu hình `target` của bạn có khớp với phiên bản React tối thiểu được hỗ trợ hay không
3. Đảm bảo package runtime được đưa vào bundle đã phát hành

### Quá trình biên dịch xung đột với các Babel plugin khác {/*compilation-conflicts-with-other-babel-plugins*/}

Một số Babel plugin có thể xung đột với React Compiler:

1. Đặt `babel-plugin-react-compiler` ở vị trí sớm trong danh sách plugin
2. Tắt các tối ưu hóa xung đột trong các plugin khác
3. Kiểm thử kỹ output build của bạn

### Không tìm thấy module runtime {/*runtime-module-not-found*/}

Nếu người dùng thấy thông báo "Cannot find module 'react-compiler-runtime'":

1. Đảm bảo runtime được liệt kê trong `dependencies`, không phải `devDependencies`
2. Kiểm tra để đảm bảo bundler đưa runtime vào output
3. Xác minh package được phát hành lên npm cùng với thư viện của bạn

## Bước tiếp theo {/*next-steps*/}

- Tìm hiểu về [kỹ thuật debugging](/learn/react-compiler/debugging) cho mã đã biên dịch
- Kiểm tra [các tùy chọn cấu hình](/reference/react-compiler/configuration) cho tất cả tùy chọn của compiler
- Khám phá [các chế độ biên dịch](/reference/react-compiler/compilationMode) để tối ưu hóa có chọn lọc
