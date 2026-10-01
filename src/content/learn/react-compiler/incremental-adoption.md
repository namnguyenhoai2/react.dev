---
title: Áp dụng từng bước
---

<Intro>
React Compiler có thể được áp dụng từng bước, cho phép bạn thử nghiệm trước trên các phần cụ thể trong codebase. Hướng dẫn này chỉ cho bạn cách triển khai compiler dần dần trong các project hiện có.
</Intro>

<YouWillLearn>

* Vì sao nên áp dụng từng bước
* Sử dụng Babel overrides để áp dụng theo thư mục
* Sử dụng chỉ thị "use memo" để biên dịch khi opt-in
* Sử dụng chỉ thị "use no memo" để loại trừ các component
* Runtime feature flags với gating
* Theo dõi tiến độ áp dụng

</YouWillLearn>

## Vì sao nên áp dụng từng bước? {/*why-incremental-adoption*/}

React Compiler được thiết kế để tự động tối ưu toàn bộ codebase, nhưng bạn không cần áp dụng tất cả cùng một lúc. Việc áp dụng từng bước giúp bạn kiểm soát quá trình triển khai, cho phép kiểm thử compiler trên những phần nhỏ của app trước khi mở rộng sang các phần còn lại.

Bắt đầu từ quy mô nhỏ giúp bạn xây dựng sự tin tưởng vào các tối ưu hóa của compiler. Bạn có thể xác minh rằng app hoạt động chính xác với code đã được biên dịch, đo lường các cải thiện về hiệu năng và xác định những trường hợp đặc biệt trong codebase của mình. Cách tiếp cận này đặc biệt có giá trị đối với các ứng dụng production, nơi tính ổn định rất quan trọng.

Việc áp dụng từng bước cũng giúp xử lý dễ dàng hơn mọi vi phạm Rules of React mà compiler có thể phát hiện. Thay vì sửa các vi phạm trong toàn bộ codebase cùng một lúc, bạn có thể xử lý chúng một cách có hệ thống khi mở rộng phạm vi áp dụng compiler. Điều này giúp quá trình migration dễ quản lý hơn và giảm nguy cơ phát sinh bug.

Bằng cách kiểm soát những phần nào trong code được biên dịch, bạn cũng có thể chạy các A/B test để đo lường tác động thực tế của các tối ưu hóa từ compiler. Dữ liệu này giúp bạn đưa ra quyết định sáng suốt về việc áp dụng toàn bộ và chứng minh giá trị của compiler với team.

## Các phương pháp áp dụng từng bước {/*approaches-to-incremental-adoption*/}

Có ba phương pháp chính để áp dụng React Compiler từng bước:

1. **Babel overrides** - Áp dụng compiler cho các thư mục cụ thể
2. **Opt-in với "use memo"** - Chỉ biên dịch các component chủ động opt-in
3. **Runtime gating** - Kiểm soát việc biên dịch bằng feature flags

Tất cả các phương pháp đều cho phép bạn kiểm thử compiler trên những phần cụ thể của ứng dụng trước khi triển khai toàn bộ.

## Áp dụng theo thư mục với Babel Overrides {/*directory-based-adoption*/}

Tùy chọn `overrides` của Babel cho phép bạn áp dụng các plugin khác nhau cho từng phần trong codebase. Đây là lựa chọn lý tưởng để áp dụng React Compiler dần dần theo từng thư mục.

### Cấu hình cơ bản {/*basic-configuration*/}

Bắt đầu bằng cách áp dụng compiler cho một thư mục cụ thể:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Các plugin dùng chung cho mọi tệp
  ],
  overrides: [
    {
      test: './src/modern/**/*.{js,jsx,ts,tsx}',
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### Mở rộng phạm vi áp dụng {/*expanding-coverage*/}

Khi đã có thêm sự tin tưởng, hãy thêm nhiều thư mục hơn:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Các plugin dùng chung
  ],
  overrides: [
    {
      test: ['./src/modern/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    },
    {
      test: './src/legacy/**/*.{js,jsx,ts,tsx}',
      plugins: [
        // Các plugin khác dành cho code cũ
      ]
    }
  ]
};
```

### Với các tùy chọn của compiler {/*with-compiler-options*/}

Bạn cũng có thể cấu hình các tùy chọn của compiler cho từng override:

```js
// babel.config.js
module.exports = {
  plugins: [],
  overrides: [
    {
      test: './src/experimental/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // các tùy chọn ...
        }]
      ]
    },
    {
      test: './src/production/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // các tùy chọn ...
        }]
      ]
    }
  ]
};
```


## Chế độ opt-in với "use memo" {/*opt-in-mode-with-use-memo*/}

Để kiểm soát tối đa, bạn có thể sử dụng `compilationMode: 'annotation'` để chỉ biên dịch các component và hook chủ động opt-in bằng chỉ thị `"use memo"`.

<Note>
Phương pháp này cho phép bạn kiểm soát chi tiết từng component và hook. Phương pháp này hữu ích khi bạn muốn kiểm thử compiler trên các component cụ thể mà không ảnh hưởng đến toàn bộ thư mục.
</Note>

### Cấu hình chế độ annotation {/*annotation-mode-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation',
    }],
  ],
};
```

### Sử dụng chỉ thị {/*using-the-directive*/}

Thêm `"use memo"` ở đầu các function mà bạn muốn biên dịch:

```js
function TodoList({ todos }) {
  "use memo"; // Chọn biên dịch component này

  const sortedTodos = todos.slice().sort();

  return (
    <ul>
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function useSortedData(data) {
  "use memo"; // Chọn biên dịch Hook này

  return data.slice().sort();
}
```

Với `compilationMode: 'annotation'`, bạn phải:
- Thêm `"use memo"` vào mọi component mà bạn muốn tối ưu
- Thêm `"use memo"` vào mọi custom hook
- Nhớ thêm chỉ thị này vào các component mới

Điều này giúp bạn kiểm soát chính xác những component nào được biên dịch trong khi đánh giá tác động của compiler.

## Runtime Feature Flags với Gating {/*runtime-feature-flags-with-gating*/}

Tùy chọn `gating` cho phép bạn kiểm soát việc biên dịch tại runtime bằng feature flags. Tùy chọn này hữu ích khi chạy A/B test hoặc dần triển khai compiler dựa trên các nhóm người dùng.

### Gating hoạt động như thế nào {/*how-gating-works*/}

Compiler bọc code đã tối ưu trong một runtime check. Nếu gate trả về `true`, phiên bản đã tối ưu sẽ chạy. Nếu không, code ban đầu sẽ chạy.

### Cấu hình Gating {/*gating-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        source: 'ReactCompilerFeatureFlags',
        importSpecifierName: 'isCompilerEnabled',
      },
    }],
  ],
};
```

### Triển khai Feature Flag {/*implementing-the-feature-flag*/}

Tạo một module export hàm gating của bạn:

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // Dùng hệ thống feature flag của bạn
  return getFeatureFlag('react-compiler-enabled');
}
```

## Khắc phục sự cố khi áp dụng {/*troubleshooting-adoption*/}

Nếu gặp sự cố trong quá trình áp dụng:

1. Sử dụng `"use no memo"` để tạm thời loại trừ các component có vấn đề
2. Xem [hướng dẫn debugging](/learn/react-compiler/debugging) để tìm các sự cố thường gặp
3. Sửa các vi phạm Rules of React được ESLint plugin xác định
4. Cân nhắc sử dụng `compilationMode: 'annotation'` để áp dụng dần dần hơn

## Các bước tiếp theo {/*next-steps*/}

- Đọc [hướng dẫn cấu hình](/reference/react-compiler/configuration) để tìm hiểu thêm các tùy chọn
- Tìm hiểu về [kỹ thuật debugging](/learn/react-compiler/debugging)
- Xem [tài liệu tham khảo API](/reference/react-compiler/configuration) để biết tất cả tùy chọn của compiler
