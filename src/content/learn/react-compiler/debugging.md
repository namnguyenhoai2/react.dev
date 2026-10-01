---
title: Gỡ lỗi và khắc phục sự cố
---

<Intro>
Hướng dẫn này giúp bạn xác định và khắc phục các sự cố khi sử dụng React Compiler. Tìm hiểu cách gỡ lỗi các vấn đề biên dịch và giải quyết những sự cố thường gặp.
</Intro>

<YouWillLearn>

* Sự khác biệt giữa lỗi compiler và các vấn đề runtime
* Những mẫu thường làm gián đoạn quá trình biên dịch
* Quy trình gỡ lỗi từng bước

</YouWillLearn>

## Tìm hiểu hành vi của compiler {/*understanding-compiler-behavior*/}

React Compiler được thiết kế để xử lý code tuân theo [Rules of React](/reference/rules). Khi gặp code có thể vi phạm các quy tắc này, compiler sẽ bỏ qua việc tối ưu một cách an toàn thay vì mạo hiểm làm thay đổi hành vi của ứng dụng.

### Lỗi compiler và vấn đề runtime {/*compiler-errors-vs-runtime-issues*/}

**Lỗi compiler** xảy ra tại thời điểm build và ngăn code của bạn được biên dịch. Những lỗi này hiếm gặp vì compiler được thiết kế để bỏ qua code có vấn đề thay vì bị lỗi.

**Vấn đề runtime** xảy ra khi code đã biên dịch hoạt động khác với dự kiến. Trong hầu hết trường hợp, nếu gặp sự cố với React Compiler, đó là vấn đề runtime. Điều này thường xảy ra khi code của bạn vi phạm Rules of React theo những cách tinh vi mà compiler không thể phát hiện, khiến compiler vô tình biên dịch một component mà lẽ ra nó phải bỏ qua.

Khi gỡ lỗi các vấn đề runtime, hãy tập trung tìm những vi phạm Rules of React trong các component bị ảnh hưởng mà ESLint rule chưa phát hiện được. Compiler dựa vào việc code của bạn tuân theo các quy tắc này; khi chúng bị vi phạm theo những cách mà compiler không thể phát hiện, các vấn đề runtime sẽ xảy ra.


## Các mẫu thường gây lỗi {/*common-breaking-patterns*/}

Một trong những cách chính khiến React Compiler có thể làm hỏng ứng dụng của bạn là khi code được viết dựa vào memoization để đảm bảo tính đúng đắn. Điều này có nghĩa là ứng dụng của bạn phụ thuộc vào việc các giá trị cụ thể được memoize để hoạt động chính xác. Vì compiler có thể memoize theo cách khác với cách bạn thực hiện thủ công, điều này có thể dẫn đến hành vi không mong muốn như effects chạy quá nhiều lần, vòng lặp vô hạn hoặc bỏ lỡ các lần cập nhật.

Các tình huống thường xảy ra điều này:

- **Effects phụ thuộc vào referential equality** - Khi effects phụ thuộc vào việc các object hoặc array duy trì cùng một reference qua các lần render
- **Dependency array cần các reference ổn định** - Khi các dependency không ổn định khiến effects chạy quá thường xuyên hoặc tạo ra vòng lặp vô hạn
- **Logic có điều kiện dựa trên việc kiểm tra reference** - Khi code sử dụng referential equality để caching hoặc tối ưu

## Quy trình gỡ lỗi {/*debugging-workflow*/}

Hãy thực hiện các bước sau khi gặp sự cố:

### Lỗi build của compiler {/*compiler-build-errors*/}

Nếu gặp lỗi compiler khiến build bị gián đoạn ngoài dự kiến, nhiều khả năng đây là bug trong compiler. Hãy báo cáo lỗi đó trong repository [react/react](https://github.com/react/react/issues) cùng với:
- Thông báo lỗi
- Code gây ra lỗi
- Phiên bản React và compiler của bạn

### Vấn đề runtime {/*runtime-issues*/}

Đối với các vấn đề về hành vi runtime:

### 1. Tạm thời tắt compilation {/*temporarily-disable-compilation*/}

Sử dụng `"use no memo"` để xác định xem sự cố có liên quan đến compiler hay không:

```js
function ProblematicComponent() {
  "use no memo"; // Bỏ qua việc biên dịch component này
  // ... phần còn lại của component
}
```

Nếu sự cố biến mất, nhiều khả năng nguyên nhân liên quan đến việc vi phạm Rules of React.

Bạn cũng có thể thử xóa memoization thủ công (useMemo, useCallback, memo) khỏi component có vấn đề để xác minh rằng ứng dụng hoạt động chính xác khi không có memoization. Nếu bug vẫn xảy ra khi đã xóa toàn bộ memoization, bạn đang gặp một vi phạm Rules of React cần được khắc phục.

### 2. Khắc phục sự cố từng bước {/*fix-issues-step-by-step*/}

1. Xác định nguyên nhân gốc (thường là memoization để đảm bảo tính đúng đắn)
2. Kiểm thử sau mỗi lần khắc phục
3. Xóa `"use no memo"` sau khi đã khắc phục
4. Xác minh component hiển thị badge ✨ trong React DevTools

## Báo cáo bug của compiler {/*reporting-compiler-bugs*/}

Nếu cho rằng mình đã phát hiện bug trong compiler:

1. **Xác minh rằng đó không phải là vi phạm Rules of React** - Kiểm tra bằng ESLint
2. **Tạo reproduction tối giản** - Cô lập sự cố trong một ví dụ nhỏ
3. **Kiểm thử khi không có compiler** - Xác nhận rằng sự cố chỉ xảy ra khi có compilation
4. **Tạo một [issue](https://github.com/react/react/issues/new?template=compiler_bug_report.yml)**:
   - Phiên bản React và compiler
   - Code reproduction tối giản
   - Hành vi dự kiến so với hành vi thực tế
   - Mọi thông báo lỗi

## Bước tiếp theo {/*next-steps*/}

- Xem lại [Rules of React](/reference/rules) để ngăn ngừa sự cố
- Xem [hướng dẫn áp dụng incremental](/learn/react-compiler/incremental-adoption) để biết các chiến lược triển khai từng bước
