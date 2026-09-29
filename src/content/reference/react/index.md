---
title: Tổng quan về tài liệu tham khảo React
---

<Intro>

Phần này cung cấp tài liệu tham khảo chi tiết về cách làm việc với React. Để tìm hiểu về React, vui lòng truy cập phần [Tìm hiểu](/learn).

</Intro>

Tài liệu tham khảo React được chia thành các tiểu mục theo chức năng:

## React {/*react*/}

Các tính năng React có thể sử dụng theo cách lập trình:

* [Hooks](/reference/react/hooks) - Sử dụng các tính năng React khác nhau từ các component của bạn.
* [Components](/reference/react/components) - Các component tích hợp sẵn mà bạn có thể sử dụng trong JSX.
* [APIs](/reference/react/apis) - Các API hữu ích để định nghĩa component.
* [Directives](/reference/rsc/directives) - Cung cấp hướng dẫn cho các bundler tương thích với React Server Components.

## React DOM {/*react-dom*/}

React DOM chứa các tính năng chỉ được hỗ trợ cho các ứng dụng web (chạy trong môi trường DOM của trình duyệt). Phần này được chia thành các mục sau:

* [Hooks](/reference/react-dom/hooks) - Các Hooks dành cho ứng dụng web chạy trong môi trường DOM của trình duyệt.
* [Components](/reference/react-dom/components) - React hỗ trợ tất cả component HTML và SVG tích hợp sẵn của trình duyệt.
* [APIs](/reference/react-dom) - Gói `react-dom` chứa các phương thức chỉ được hỗ trợ trong các ứng dụng web.
* [Client APIs](/reference/react-dom/client) - Các API `react-dom/client` cho phép bạn render component React ở client (trong trình duyệt).
* [Server APIs](/reference/react-dom/server) - Các API `react-dom/server` cho phép bạn render component React thành HTML trên server.
* [Static APIs](/reference/react-dom/static) - Các API `react-dom/static` cho phép bạn tạo HTML tĩnh cho các component React.

## React Compiler {/*react-compiler*/}

React Compiler là một công cụ tối ưu hóa trong quá trình build, tự động memoize các component và giá trị React của bạn:

* [Configuration](/reference/react-compiler/configuration) - Các tùy chọn cấu hình cho React Compiler.
* [Directives](/reference/react-compiler/directives) - Các directive cấp hàm để kiểm soát quá trình biên dịch.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - Hướng dẫn phát hành mã thư viện đã được biên dịch trước.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

[Plugin ESLint cho React Hooks](/reference/eslint-plugin-react-hooks) giúp thực thi Rules of React:

* [Lints](/reference/eslint-plugin-react-hooks) - Tài liệu chi tiết cho từng lint kèm các ví dụ.

## Rules of React {/*rules-of-react*/}

React có các quy ước — hay quy tắc — về cách thể hiện các pattern theo cách dễ hiểu và tạo ra các ứng dụng chất lượng cao:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – Tính thuần giúp mã của bạn dễ hiểu và gỡ lỗi hơn, đồng thời cho phép React tự động tối ưu hóa component và hook của bạn một cách chính xác.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – React chịu trách nhiệm render component và hook khi cần để tối ưu hóa trải nghiệm người dùng.
* [Rules of Hooks](/reference/rules/rules-of-hooks) – Hooks được định nghĩa bằng các hàm JavaScript, nhưng chúng đại diện cho một loại logic UI có thể tái sử dụng đặc biệt, với các hạn chế về nơi chúng có thể được gọi.

## Legacy APIs {/*legacy-apis*/}

* [Legacy APIs](/reference/react/legacy) - Được export từ gói `react`, nhưng không được khuyến nghị sử dụng trong mã mới viết.