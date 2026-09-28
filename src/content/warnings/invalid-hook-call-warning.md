---
title: Quy tắc của Hooks
---

Có lẽ bạn đang ở đây vì gặp thông báo lỗi sau:

<ConsoleBlock level="error">

Hooks chỉ có thể được gọi bên trong phần thân của một function component.

</ConsoleBlock>

Có ba lý do phổ biến khiến bạn thấy lỗi này:

1. Bạn có thể đang **vi phạm Quy tắc của Hooks**.
2. Bạn có thể đang sử dụng các phiên bản **không tương thích** của React và React DOM.
3. Bạn có thể có **nhiều hơn một bản sao của React** trong cùng một ứng dụng.

Hãy xem xét từng trường hợp.

## Vi phạm Quy tắc của Hooks {/*breaking-rules-of-hooks*/}

Các hàm có tên bắt đầu bằng `use` được gọi là [*Hooks*](/reference/react) trong React.

**Đừng gọi Hooks bên trong các vòng lặp, điều kiện hoặc hàm lồng nhau.** Thay vào đó, luôn sử dụng Hooks ở cấp cao nhất trong function React của bạn, trước mọi lệnh return sớm. Bạn chỉ có thể gọi Hooks khi React đang render một function component:

* ✅ Gọi chúng ở cấp cao nhất trong phần thân của một [function component](/learn/your-first-component).
* ✅ Gọi chúng ở cấp cao nhất trong phần thân của một [custom Hook](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Không được hỗ trợ việc gọi Hooks (các hàm bắt đầu bằng `use`) trong bất kỳ trường hợp nào khác, chẳng hạn như:

* 🔴 Không gọi Hooks bên trong các điều kiện hoặc vòng lặp.
* 🔴 Không gọi Hooks sau câu lệnh `return` điều kiện.
* 🔴 Không gọi Hooks trong các event handler.
* 🔴 Không gọi Hooks trong các class component.
* 🔴 Không gọi Hooks bên trong các hàm được truyền vào `useMemo`, `useReducer` hoặc `useEffect`.

Nếu vi phạm các quy tắc này, bạn có thể thấy lỗi trên.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}
```

Bạn có thể sử dụng plugin [`eslint-plugin-react-hooks` để phát hiện những lỗi này](https://www.npmjs.com/package/eslint-plugin-react-hooks).

<Note>

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) *có thể* gọi các Hooks khác (đó chính là mục đích của chúng). Điều này hoạt động vì custom Hooks cũng chỉ được gọi khi một function component đang được render.

</Note>

## Các phiên bản React và React DOM không tương thích {/*mismatching-versions-of-react-and-react-dom*/}

Bạn có thể đang sử dụng một phiên bản của `react-dom` (< 16.8.0) hoặc `react-native` (< 0.59) chưa hỗ trợ Hooks. Bạn có thể chạy `npm ls react-dom` hoặc `npm ls react-native` trong thư mục ứng dụng để kiểm tra phiên bản đang sử dụng. Nếu tìm thấy nhiều hơn một phiên bản, điều này cũng có thể gây ra sự cố (sẽ nói thêm bên dưới).

## React trùng lặp {/*duplicate-react*/}

Để Hooks hoạt động, import `react` từ mã ứng dụng của bạn cần trỏ đến cùng module với import `react` bên trong package `react-dom`.

Nếu các import `react` này trỏ đến hai export object khác nhau, bạn sẽ thấy cảnh báo này. Điều này có thể xảy ra nếu bạn **vô tình có hai bản sao** của package `react`.

Nếu sử dụng Node để quản lý package, bạn có thể chạy lệnh kiểm tra này trong thư mục dự án:

<TerminalBlock>

npm ls react

</TerminalBlock>

Nếu thấy nhiều hơn một React, bạn cần tìm hiểu nguyên nhân và sửa dependency tree. Ví dụ, có thể một library bạn đang sử dụng đã khai báo không đúng `react` dưới dạng dependency (thay vì peer dependency). Cho đến khi library đó được sửa, [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) là một cách khắc phục tạm thời khả thi.

Bạn cũng có thể thử debug sự cố này bằng cách thêm một số log và khởi động lại development server:

```js
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Nếu kết quả in ra là `false` thì có thể bạn có hai React và cần tìm hiểu lý do xảy ra việc đó. [Vấn đề này](https://github.com/react/react/issues/13991) bao gồm một số nguyên nhân phổ biến được cộng đồng ghi nhận.

Sự cố này cũng có thể xảy ra khi bạn sử dụng `npm link` hoặc một công cụ tương đương. Trong trường hợp đó, bundler của bạn có thể “nhìn thấy” hai React — một trong thư mục ứng dụng và một trong thư mục library. Giả sử `myapp` và `mylib` là hai thư mục cùng cấp, một cách khắc phục có thể là chạy `npm link ../myapp/node_modules/react` từ `mylib`. Việc này sẽ khiến library sử dụng bản sao React của ứng dụng.

<Note>

Nhìn chung, React hỗ trợ sử dụng nhiều bản sao độc lập trên cùng một trang (ví dụ: một app và một widget bên thứ ba cùng sử dụng React). Chỉ xảy ra lỗi nếu `require('react')` trỏ đến các bản khác nhau giữa component và bản sao `react-dom` dùng để render component đó.

</Note>

## Các nguyên nhân khác {/*other-causes*/}

Nếu không cách nào ở trên hiệu quả, vui lòng bình luận trong [vấn đề này](https://github.com/react/react/issues/13991) và chúng tôi sẽ cố gắng hỗ trợ. Hãy thử tạo một ví dụ nhỏ có thể tái hiện lỗi — có thể bạn sẽ phát hiện ra vấn đề trong quá trình thực hiện.