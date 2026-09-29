---
title: eslint-plugin-react-hooks
version: rc
---

<Intro>

`eslint-plugin-react-hooks` cung cấp các quy tắc ESLint để thực thi [Rules of React](/reference/rules).

</Intro>

Plugin này giúp bạn phát hiện các vi phạm quy tắc của React tại thời điểm build, đảm bảo các component và hook của bạn tuân theo các quy tắc của React để đảm bảo tính chính xác và hiệu năng. Các phép lint bao quát cả những pattern React nền tảng (exhaustive-deps và rules-of-hooks) lẫn các vấn đề được React Compiler gắn cờ. Các chẩn đoán của React Compiler được plugin ESLint này tự động hiển thị và có thể được sử dụng ngay cả khi ứng dụng của bạn chưa áp dụng compiler.

<Note>
Khi compiler báo cáo một chẩn đoán, điều đó có nghĩa là compiler đã có thể phát hiện tĩnh một pattern không được hỗ trợ hoặc vi phạm Rules of React. Khi phát hiện điều này, compiler **tự động** bỏ qua các component và hook đó, đồng thời vẫn compile phần còn lại của ứng dụng. Điều này đảm bảo phạm vi tối ưu hóa an toàn tối ưu mà không làm hỏng ứng dụng của bạn.

Đối với lint, điều này có nghĩa là bạn không cần sửa tất cả vi phạm ngay lập tức. Hãy xử lý chúng theo tốc độ của riêng bạn để dần tăng số lượng component được tối ưu hóa.
</Note>

## Các quy tắc được khuyến nghị {/*recommended*/}

Các quy tắc này được включ trong preset `recommended` của `eslint-plugin-react-hooks`:

* [`exhaustive-deps`](/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) - Xác thực rằng các dependency array của React hook chứa tất cả dependency cần thiết
* [`rules-of-hooks`](/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) - Xác thực rằng các component và hook tuân theo Rules of Hooks
* [`component-hook-factories`](/reference/eslint-plugin-react-hooks/lints/component-hook-factories) - Xác thực các higher-order function định nghĩa component hoặc hook lồng nhau
* [`config`](/reference/eslint-plugin-react-hooks/lints/config) - Xác thực các tùy chọn cấu hình của compiler
* [`error-boundaries`](/reference/eslint-plugin-react-hooks/lints/error-boundaries) - Xác thực việc sử dụng Error Boundary thay cho try/catch để xử lý lỗi của component con
* [`gating`](/reference/eslint-plugin-react-hooks/lints/gating) - Xác thực cấu hình của gating mode
* [`globals`](/reference/eslint-plugin-react-hooks/lints/globals) - Xác thực để ngăn việc gán/thay đổi các biến global trong quá trình render
* [`immutability`](/reference/eslint-plugin-react-hooks/lints/immutability) - Xác thực để ngăn việc thay đổi props, state và các giá trị immutable khác
* [`incompatible-library`](/reference/eslint-plugin-react-hooks/lints/incompatible-library) - Xác thực để ngăn việc sử dụng các library không tương thích với memoization
* [`preserve-manual-memoization`](/reference/eslint-plugin-react-hooks/lints/preserve-manual-memoization) - Xác thực rằng compiler bảo toàn memoization thủ công hiện có
* [`purity`](/reference/eslint-plugin-react-hooks/lints/purity) - Xác thực rằng component/hook là pure bằng cách kiểm tra các function được biết là impure
* [`refs`](/reference/eslint-plugin-react-hooks/lints/refs) - Xác thực việc sử dụng ref đúng cách, không đọc/ghi trong quá trình render
* [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) - Xác thực để ngăn việc gọi setState đồng bộ trong một effect
* [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render) - Xác thực để ngăn việc thiết lập state trong quá trình render
* [`static-components`](/reference/eslint-plugin-react-hooks/lints/static-components) - Xác thực rằng các component là static, không được tạo lại trong mỗi lần render
* [`unsupported-syntax`](/reference/eslint-plugin-react-hooks/lints/unsupported-syntax) - Xác thực để ngăn cú pháp mà React Compiler không hỗ trợ
* [`use-memo`](/reference/eslint-plugin-react-hooks/lints/use-memo) - Xác thực việc sử dụng hook `useMemo` mà không có giá trị trả về