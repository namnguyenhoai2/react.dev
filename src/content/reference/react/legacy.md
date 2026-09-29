---
title: "Các API React cũ"
---

<Intro>

Các API này được export từ package `react`, nhưng không được khuyến nghị sử dụng trong code mới viết. Hãy xem các trang API riêng lẻ được liên kết để biết các lựa chọn thay thế được đề xuất.

</Intro>

---

## Các API cũ {/*legacy-apis*/}

* [`Children`](/reference/react/Children) cho phép bạn thao tác và biến đổi JSX nhận được dưới dạng prop `children`. [Xem các lựa chọn thay thế.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) cho phép bạn tạo một phần tử React bằng cách sử dụng một phần tử khác làm điểm bắt đầu. [Xem các lựa chọn thay thế.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) cho phép bạn định nghĩa một component React dưới dạng một class JavaScript. [Xem các lựa chọn thay thế.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) cho phép bạn tạo một phần tử React. Thông thường, bạn sẽ sử dụng JSX thay thế.
* [`createRef`](/reference/react/createRef) tạo một đối tượng ref có thể chứa giá trị tùy ý. [Xem các lựa chọn thay thế.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) cho phép component của bạn expose một node DOM cho component cha bằng một [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) kiểm tra xem một giá trị có phải là phần tử React hay không. Thường được sử dụng cùng với [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) tương tự như [`Component`,](/reference/react/Component) nhưng bỏ qua việc re-render khi props không đổi. [Xem các lựa chọn thay thế.](/reference/react/PureComponent#alternatives)

---

## Các API đã bị loại bỏ {/*removed-apis*/}

Các API này đã bị loại bỏ trong React 19:

* [`createFactory`](https://18.react.dev/reference/react/createFactory): thay vào đó, hãy sử dụng JSX.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): thay vào đó, hãy sử dụng [`static contextType`](#static-contexttype).
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): thay vào đó, hãy sử dụng [`static contextType`](#static-contexttype).
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): thay vào đó, hãy sử dụng [`Context`](/reference/react/createContext#provider).
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): thay vào đó, hãy sử dụng một type system như [TypeScript](https://www.typescriptlang.org/).
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): thay vào đó, hãy sử dụng [`createRef`](/reference/react/createRef).