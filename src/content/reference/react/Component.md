---
title: Component
---

<Pitfall>

Chúng tôi khuyến nghị định nghĩa các component dưới dạng function thay vì class. [Xem cách migrate.](#alternatives)

</Pitfall>

<Intro>

`Component` là base class dành cho các React component được định nghĩa dưới dạng [JavaScript class.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) React vẫn hỗ trợ class component, nhưng chúng tôi không khuyến nghị sử dụng chúng trong code mới.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `Component` {/*component*/}

Để định nghĩa một React component dưới dạng class, hãy mở rộng class tích hợp sẵn `Component` và định nghĩa một phương thức [`render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Chỉ cần có phương thức `render`; các phương thức khác là tùy chọn.

[Xem thêm ví dụ bên dưới.](#usage)

---

### `context` {/*context*/}

[context](/learn/passing-data-deeply-with-context) của class component có sẵn dưới dạng `this.context`. Nó chỉ có sẵn nếu bạn chỉ định *context nào* muốn nhận bằng cách sử dụng [`static contextType`](#static-contexttype).

Một class component chỉ có thể đọc một context tại một thời điểm.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

Việc đọc `this.context` trong class component tương đương với việc sử dụng [`useContext`](/reference/react/useContext) trong function component.

[Xem cách migrate.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

Các props được truyền vào class component có sẵn dưới dạng `this.props`.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

Việc đọc `this.props` trong class component tương đương với việc [khai báo props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) trong function component.

[Xem cách migrate.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `state` {/*state*/}

State của class component có sẵn dưới dạng `this.state`. Trường `state` phải là một object. Không được mutate state trực tiếp. Nếu muốn thay đổi state, hãy gọi `setState` với state mới.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

Việc định nghĩa `state` trong class component tương đương với việc gọi [`useState`](/reference/react/useState) trong function component.

[Xem cách migrate.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

[constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) chạy trước khi class component của bạn *mount* (được thêm vào màn hình). Thông thường, constructor chỉ được sử dụng cho hai mục đích trong React. Nó cho phép bạn khai báo state và [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) các class method của bạn với class instance:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

Nếu sử dụng cú pháp JavaScript hiện đại, bạn hiếm khi cần constructor. Thay vào đó, bạn có thể viết lại code trên bằng [cú pháp public class field](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields), được hỗ trợ bởi cả trình duyệt hiện đại lẫn các công cụ như [Babel:](https://babeljs.io/)

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

Constructor không nên chứa side effect hoặc subscription nào.

#### Tham số {/*constructor-parameters*/}

* `props`: Props ban đầu của component.

#### Giá trị trả về {/*constructor-returns*/}

`constructor` không nên trả về bất kỳ giá trị nào.

#### Lưu ý {/*constructor-caveats*/}

* Không chạy side effect hoặc subscription nào trong constructor. Thay vào đó, hãy sử dụng [`componentDidMount`](#componentdidmount) cho việc đó.

* Bên trong constructor, bạn cần gọi `super(props)` trước mọi câu lệnh khác. Nếu không làm vậy, `this.props` sẽ là `undefined` trong khi constructor chạy, điều này có thể gây khó hiểu và dẫn đến lỗi.

* Constructor là nơi duy nhất bạn có thể gán trực tiếp [`this.state`](#state). Trong mọi method khác, bạn cần sử dụng [`this.setState()`](#setstate) thay thế. Không gọi `setState` trong constructor.

* Khi sử dụng [server rendering,](/reference/react-dom/server), constructor cũng sẽ chạy trên server, sau đó là method [`render`](#render). Tuy nhiên, các lifecycle method như `componentDidMount` hoặc `componentWillUnmount` sẽ không chạy trên server.

* Khi [Strict Mode](/reference/react/StrictMode) được bật, React sẽ gọi `constructor` hai lần trong development rồi loại bỏ một trong các instance. Điều này giúp bạn phát hiện các side effect vô tình cần được chuyển ra ngoài `constructor`.

<Note>

Không có tương đương chính xác cho `constructor` trong function component. Để khai báo state trong function component, hãy gọi [`useState`.](/reference/react/useState) Để tránh tính toán lại state ban đầu, [hãy truyền một function vào `useState`.](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

Nếu bạn định nghĩa `componentDidCatch`, React sẽ gọi nó khi một child component nào đó (bao gồm cả các child ở xa) throw một error trong quá trình rendering. Điều này cho phép bạn ghi log error đó vào một error reporting service trong production.

Thông thường, nó được sử dụng cùng với [`static getDerivedStateFromError`](#static-getderivedstatefromerror), cho phép bạn cập nhật state để phản hồi lỗi và hiển thị thông báo lỗi cho người dùng. Một component có các method này được gọi là *Error Boundary*.

[Xem ví dụ.](#catching-rendering-errors-with-an-error-boundary)

#### Tham số {/*componentdidcatch-parameters*/}

* `error`: Error đã được throw. Trên thực tế, nó thường sẽ là một instance của [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), nhưng điều này không được đảm bảo vì JavaScript cho phép [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) bất kỳ giá trị nào, kể cả string hoặc thậm chí `null`.

* `info`: Một object chứa thông tin bổ sung về error. Trường `componentStack` của nó chứa stack trace với component đã throw error, cùng với tên và vị trí trong source của tất cả component cha. Trong production, tên component sẽ được minify. Nếu thiết lập production error reporting, bạn có thể decode component stack bằng sourcemap giống như cách thực hiện với các JavaScript error stack thông thường.

#### Giá trị trả về {/*componentdidcatch-returns*/}

`componentDidCatch` không nên trả về bất kỳ giá trị nào.

#### Lưu ý {/*componentdidcatch-caveats*/}

* Trước đây, việc gọi `setState` bên trong `componentDidCatch` để cập nhật UI và hiển thị fallback error message là điều phổ biến. Cách này đã deprecated; thay vào đó, hãy định nghĩa [`static getDerivedStateFromError`.](#static-getderivedstatefromerror)

* Bản build production và development của React hơi khác nhau trong cách `componentDidCatch` xử lý error. Trong development, error sẽ bubble lên `window`, nghĩa là mọi `window.onerror` hoặc `window.addEventListener('error', callback)` sẽ intercept các error đã được `componentDidCatch` bắt. Trong production, ngược lại, error sẽ không bubble lên, nghĩa là mọi error handler ở component cha chỉ nhận được các error không được `componentDidCatch` bắt một cách rõ ràng.

<Note>

Hiện chưa có tương đương trực tiếp cho `componentDidCatch` trong function component. Nếu muốn tránh tạo class component, hãy viết một component `ErrorBoundary` duy nhất như trên và sử dụng nó trong toàn bộ app. Ngoài ra, bạn có thể sử dụng package [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary), package này sẽ thực hiện việc đó thay bạn.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

Nếu bạn định nghĩa phương thức `componentDidMount`, React sẽ gọi phương thức đó khi component của bạn được thêm *(mounted)* vào màn hình. Đây là nơi thường được dùng để bắt đầu lấy dữ liệu, thiết lập các subscription hoặc thao tác với các node DOM.

Nếu bạn triển khai `componentDidMount`, bạn thường cần triển khai các phương thức lifecycle khác để tránh lỗi. Ví dụ: nếu `componentDidMount` đọc một số state hoặc props, bạn cũng phải triển khai [`componentDidUpdate`](#componentdidupdate) để xử lý các thay đổi của chúng, và [`componentWillUnmount`](#componentwillunmount) để dọn dẹp những gì `componentDidMount` đã thực hiện.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Xem thêm ví dụ.](#adding-lifecycle-methods-to-a-class-component)

#### Tham số {/*componentdidmount-parameters*/}

`componentDidMount` không nhận bất kỳ tham số nào.

#### Giá trị trả về {/*componentdidmount-returns*/}

`componentDidMount` không nên trả về bất kỳ giá trị nào.

#### Lưu ý {/*componentdidmount-caveats*/}

- Khi [Strict Mode](/reference/react/StrictMode) được bật, trong môi trường development, React sẽ gọi `componentDidMount`, sau đó ngay lập tức gọi [`componentWillUnmount`,](#componentwillunmount) rồi lại gọi `componentDidMount`. Điều này giúp bạn phát hiện liệu mình có quên triển khai `componentWillUnmount` hay không, hoặc liệu logic của nó có hoàn toàn “đối xứng” với những gì `componentDidMount` thực hiện hay không.

- Mặc dù bạn có thể gọi [`setState`](#setstate) ngay lập tức trong `componentDidMount`, tốt nhất là tránh làm vậy khi có thể. Việc này sẽ kích hoạt một lần rendering bổ sung, nhưng nó sẽ diễn ra trước khi trình duyệt cập nhật màn hình. Điều này đảm bảo rằng dù [`render`](#render) được gọi hai lần trong trường hợp này, người dùng sẽ không nhìn thấy state trung gian. Hãy thận trọng khi sử dụng pattern này vì nó thường gây ra các vấn đề về hiệu năng. Trong hầu hết trường hợp, bạn có thể gán state ban đầu trong [`constructor`](#constructor) thay thế. Tuy nhiên, điều này có thể cần thiết trong các trường hợp như modal và tooltip, khi bạn cần đo một node DOM trước khi rendering một thành phần phụ thuộc vào kích thước hoặc vị trí của node đó.

<Note>

Trong nhiều trường hợp sử dụng, việc định nghĩa `componentDidMount`, `componentDidUpdate` và `componentWillUnmount` cùng nhau trong class component tương đương với việc gọi [`useEffect`](/reference/react/useEffect) trong function component. Trong những trường hợp hiếm hoi mà việc chạy code trước khi trình duyệt paint là quan trọng, [`useLayoutEffect`](/reference/react/useLayoutEffect) là lựa chọn tương đồng hơn.

[Xem cách migrate.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

Nếu bạn định nghĩa phương thức `componentDidUpdate`, React sẽ gọi phương thức đó ngay sau khi component của bạn được re-render với props hoặc state đã cập nhật. Phương thức này không được gọi trong lần render ban đầu.

Bạn có thể dùng phương thức này để thao tác với DOM sau một lần update. Đây cũng là nơi thường dùng để thực hiện các network request, miễn là bạn so sánh props hiện tại với props trước đó (ví dụ: có thể không cần thực hiện network request nếu props không thay đổi). Thông thường, bạn sẽ dùng phương thức này cùng với [`componentDidMount`](#componentdidmount) và [`componentWillUnmount`:](#componentwillunmount)

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Xem thêm ví dụ.](#adding-lifecycle-methods-to-a-class-component)


#### Tham số {/*componentdidupdate-parameters*/}

* `prevProps`: Props trước lần update. So sánh `prevProps` với [`this.props`](#props) để xác định điều gì đã thay đổi.

* `prevState`: State trước lần update. So sánh `prevState` với [`this.state`](#state) để xác định điều gì đã thay đổi.

* `snapshot`: Nếu bạn đã triển khai [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate), `snapshot` sẽ chứa giá trị bạn trả về từ phương thức đó. Nếu không, giá trị này sẽ là `undefined`.

#### Giá trị trả về {/*componentdidupdate-returns*/}

`componentDidUpdate` không nên trả về bất kỳ giá trị nào.

#### Lưu ý {/*componentdidupdate-caveats*/}

- `componentDidUpdate` sẽ không được gọi nếu [`shouldComponentUpdate`](#shouldcomponentupdate) được định nghĩa và trả về `false`.

- Logic bên trong `componentDidUpdate` thường nên được bao bọc trong các điều kiện so sánh `this.props` với `prevProps`, và `this.state` với `prevState`. Nếu không, bạn có nguy cơ tạo ra các vòng lặp vô hạn.

- Mặc dù bạn có thể gọi [`setState`](#setstate) ngay lập tức trong `componentDidUpdate`, tốt nhất là tránh làm vậy khi có thể. Việc này sẽ kích hoạt một lần rendering bổ sung, nhưng nó sẽ diễn ra trước khi trình duyệt cập nhật màn hình. Điều này đảm bảo rằng dù [`render`](#render) được gọi hai lần trong trường hợp này, người dùng sẽ không nhìn thấy state trung gian. Pattern này thường gây ra các vấn đề về hiệu năng, nhưng có thể cần thiết trong những trường hợp hiếm hoi như modal và tooltip, khi bạn cần đo một node DOM trước khi rendering một thành phần phụ thuộc vào kích thước hoặc vị trí của node đó.

<Note>

Trong nhiều trường hợp sử dụng, việc định nghĩa `componentDidMount`, `componentDidUpdate` và `componentWillUnmount` cùng nhau trong class component tương đương với việc gọi [`useEffect`](/reference/react/useEffect) trong function component. Trong những trường hợp hiếm hoi mà việc chạy code trước khi trình duyệt paint là quan trọng, [`useLayoutEffect`](/reference/react/useLayoutEffect) là lựa chọn tương đồng hơn.

[Xem cách migrate.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

API này đã được đổi tên từ `componentWillMount` thành [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) Tên cũ đã bị deprecated. Trong một major version tương lai của React, chỉ tên mới sẽ hoạt động.

Chạy codemod [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) để tự động cập nhật các component của bạn.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

API này đã được đổi tên từ `componentWillReceiveProps` thành [`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveprops) Tên cũ đã bị deprecated. Trong một major version tương lai của React, chỉ tên mới sẽ hoạt động.

Chạy codemod [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) để tự động cập nhật các component của bạn.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

API này đã được đổi tên từ `componentWillUpdate` thành [`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) Tên cũ đã bị deprecated. Trong một major version tương lai của React, chỉ tên mới sẽ hoạt động.

Chạy codemod [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) để tự động cập nhật các component của bạn.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

Nếu bạn định nghĩa phương thức `componentWillUnmount`, React sẽ gọi phương thức đó trước khi component của bạn bị xóa *(unmounted)* khỏi màn hình. Đây là nơi thường dùng để hủy việc lấy dữ liệu hoặc gỡ bỏ các subscription.

Logic bên trong `componentWillUnmount` nên “đối xứng” với logic bên trong [`componentDidMount`.](#componentdidmount) Ví dụ: nếu `componentDidMount` thiết lập một subscription, `componentWillUnmount` nên dọn dẹp subscription đó. Nếu logic cleanup trong `componentWillUnmount` đọc một số props hoặc state, bạn thường cũng cần triển khai [`componentDidUpdate`](#componentdidupdate) để dọn dẹp các tài nguyên (chẳng hạn như subscription) tương ứng với props và state cũ.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Xem thêm ví dụ.](#adding-lifecycle-methods-to-a-class-component)

#### Tham số {/*componentwillunmount-parameters*/}

`componentWillUnmount` không nhận bất kỳ tham số nào.

#### Giá trị trả về {/*componentwillunmount-returns*/}

`componentWillUnmount` không được trả về bất kỳ giá trị nào.

#### Lưu ý {/*componentwillunmount-caveats*/}

- Khi [Strict Mode](/reference/react/StrictMode) được bật, trong môi trường development, React sẽ gọi [`componentDidMount`,](#componentdidmount) rồi ngay lập tức gọi `componentWillUnmount`, sau đó lại gọi `componentDidMount`. Điều này giúp bạn nhận ra nếu quên triển khai `componentWillUnmount` hoặc logic của nó không hoàn toàn “mirror” những gì `componentDidMount` thực hiện.

<Note>

Trong nhiều trường hợp sử dụng, việc định nghĩa `componentDidMount`, `componentDidUpdate`, và `componentWillUnmount` cùng nhau trong các class component tương đương với việc gọi [`useEffect`](/reference/react/useEffect) trong các function component. Trong những trường hợp hiếm hoi mà việc chạy code trước khi trình duyệt paint là quan trọng, [`useLayoutEffect`](/reference/react/useLayoutEffect) là lựa chọn tương ứng hơn.

[Xem cách migrate.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

Buộc một component render lại.

Thông thường, việc này không cần thiết. Nếu method [`render`](#render) của component chỉ đọc từ [`this.props`](#props), [`this.state`](#state), hoặc [`this.context`,](#context) thì component sẽ tự động render lại khi bạn gọi [`setState`](#setstate) bên trong component hoặc một trong các parent của nó. Tuy nhiên, nếu method `render` của component đọc trực tiếp từ một nguồn dữ liệu bên ngoài, bạn phải thông báo cho React cập nhật giao diện người dùng khi nguồn dữ liệu đó thay đổi. Đó là điều `forceUpdate` cho phép bạn thực hiện.

Cố gắng tránh mọi việc sử dụng `forceUpdate` và chỉ đọc từ `this.props` và `this.state` trong `render`.

#### Tham số {/*forceupdate-parameters*/}

* **tùy chọn** `callback` Nếu được chỉ định, React sẽ gọi `callback` mà bạn cung cấp sau khi update được commit.

#### Giá trị trả về {/*forceupdate-returns*/}

`forceUpdate` không trả về bất kỳ giá trị nào.

#### Lưu ý {/*forceupdate-caveats*/}

- Nếu bạn gọi `forceUpdate`, React sẽ render lại mà không gọi [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

Việc đọc một nguồn dữ liệu bên ngoài và buộc các class component render lại để phản hồi những thay đổi của nguồn đó bằng `forceUpdate` đã được thay thế bằng [`useSyncExternalStore`](/reference/react/useSyncExternalStore) trong các function component.

</Note>

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

Nếu bạn triển khai `getSnapshotBeforeUpdate`, React sẽ gọi nó ngay trước khi React cập nhật DOM. Nó cho phép component của bạn ghi lại một số thông tin từ DOM, chẳng hạn như vị trí cuộn, trước khi thông tin đó có khả năng bị thay đổi. Bất kỳ giá trị nào được lifecycle method này trả về sẽ được truyền làm tham số cho [`componentDidUpdate`.](#componentdidupdate)

Ví dụ, bạn có thể sử dụng nó trong một UI như luồng chat cần duy trì vị trí cuộn trong quá trình update:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Chúng ta có đang thêm phần tử mới vào danh sách không?
    // Lưu vị trí cuộn để có thể điều chỉnh sau.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Nếu có giá trị snapshot, chúng ta vừa thêm phần tử mới.
    // Điều chỉnh cuộn để phần tử mới không đẩy phần tử cũ ra khỏi vùng nhìn thấy.
    // (snapshot ở đây là giá trị được trả về từ getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

Trong ví dụ trên, điều quan trọng là phải đọc trực tiếp property `scrollHeight` bên trong `getSnapshotBeforeUpdate`. Việc đọc nó trong [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops), hoặc [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) là không an toàn vì có thể có một khoảng trễ giữa lúc các method này được gọi và lúc React cập nhật DOM.

#### Tham số {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: Props trước khi update. So sánh `prevProps` với [`this.props`](#props) để xác định điều gì đã thay đổi.

* `prevState`: State trước khi update. So sánh `prevState` với [`this.state`](#state) để xác định điều gì đã thay đổi.

#### Giá trị trả về {/*getsnapshotbeforeupdate-returns*/}

Bạn nên trả về một giá trị snapshot thuộc bất kỳ kiểu nào bạn muốn, hoặc `null`. Giá trị bạn trả về sẽ được truyền làm đối số thứ ba cho [`componentDidUpdate`.](#componentdidupdate)

#### Lưu ý {/*getsnapshotbeforeupdate-caveats*/}

- `getSnapshotBeforeUpdate` sẽ không được gọi nếu [`shouldComponentUpdate`](#shouldcomponentupdate) được định nghĩa và trả về `false`.

<Note>

Hiện tại, không có cách tương đương với `getSnapshotBeforeUpdate` cho các function component. Trường hợp sử dụng này rất hiếm gặp, nhưng nếu bạn cần đến nó thì hiện tại bạn sẽ phải viết một class component.

</Note>

---

### `render()` {/*render*/}

Method `render` là method bắt buộc duy nhất trong một class component.

Method `render` phải chỉ định nội dung bạn muốn hiển thị trên màn hình, ví dụ:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React có thể gọi `render` bất cứ lúc nào, vì vậy bạn không nên giả định rằng nó chạy vào một thời điểm cụ thể. Thông thường, method `render` phải trả về một đoạn [JSX](/learn/writing-markup-with-jsx), nhưng một số [kiểu giá trị trả về khác](#render-returns) (chẳng hạn như string) cũng được hỗ trợ. Để tính JSX được trả về, method `render` có thể đọc [`this.props`](#props), [`this.state`](#state), và [`this.context`](#context).

Bạn nên viết method `render` dưới dạng một pure function, nghĩa là nó phải trả về cùng một kết quả nếu props, state và context giống nhau. Method này cũng không được chứa side effect (chẳng hạn như thiết lập subscription) hoặc tương tác với browser API. Side effect nên được thực hiện trong event handler hoặc các method như [`componentDidMount`.](#componentdidmount)

#### Tham số {/*render-parameters*/}

`render` không nhận tham số nào.

#### Giá trị trả về {/*render-returns*/}

`render` có thể trả về bất kỳ React node hợp lệ nào. Điều này bao gồm các React element như `<div />`, string, number, [portal](/reference/react-dom/createPortal), node rỗng (`null`, `undefined`, `true`, và `false`), cùng các array chứa React node.

#### Lưu ý {/*render-caveats*/}

- `render` nên được viết dưới dạng pure function của props, state và context. Method này không được có side effect.

- `render` sẽ không được gọi nếu [`shouldComponentUpdate`](#shouldcomponentupdate) được định nghĩa và trả về `false`.

- Khi [Strict Mode](/reference/react/StrictMode) được bật, React sẽ gọi `render` hai lần trong môi trường development rồi loại bỏ một trong các kết quả. Điều này giúp bạn nhận ra những side effect vô tình tạo ra, vốn cần được chuyển ra khỏi method `render`.

- Không có sự tương ứng một-một giữa lần gọi `render` và lần gọi `componentDidMount` hoặc `componentDidUpdate` ngay sau đó. React có thể loại bỏ một số kết quả của lần gọi `render` khi điều đó có lợi.

---

### `setState(nextState, callback?)` {/*setstate*/}

Gọi `setState` để cập nhật state của React component.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

`setState` xếp hàng các thay đổi đối với state của component. Nó thông báo cho React rằng component này và các component con của nó cần render lại với state mới. Đây là cách chính để bạn cập nhật giao diện người dùng nhằm phản hồi các tương tác.

<Pitfall>

Việc gọi `setState` **không** thay đổi state hiện tại trong đoạn code đang được thực thi:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Vẫn là "Taylor"!
}
```

Nó chỉ ảnh hưởng đến giá trị mà `this.state` trả về kể từ lần render *tiếp theo*.

</Pitfall>

Bạn cũng có thể truyền một function vào `setState`. Cách này cho phép bạn cập nhật state dựa trên state trước đó:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

Bạn không bắt buộc phải làm điều này, nhưng nó rất hữu ích nếu bạn muốn cập nhật state nhiều lần trong cùng một event.

#### Tham số {/*setstate-parameters*/}

* `nextState`: Một object hoặc một function.
  * Nếu bạn truyền một object làm `nextState`, object đó sẽ được shallow merge vào `this.state`.
  * Nếu bạn truyền một function làm `nextState`, function đó sẽ được xem là một _updater function_. Function này phải pure, nên nhận state đang chờ xử lý và props làm các đối số, đồng thời trả về object để shallow merge vào `this.state`. React sẽ đưa updater function của bạn vào một queue và re-render component. Trong lần render tiếp theo, React sẽ tính state tiếp theo bằng cách áp dụng tất cả updater trong queue lên state trước đó.

* **tùy chọn** `callback`: Nếu được chỉ định, React sẽ gọi `callback` mà bạn cung cấp sau khi update được commit.

#### Giá trị trả về {/*setstate-returns*/}

`setState` không trả về gì.

#### Lưu ý {/*setstate-caveats*/}

- Hãy xem `setState` như một *request* thay vì một command tức thời để cập nhật component. Khi nhiều component cập nhật state để phản hồi một event, React sẽ batch các update của chúng và re-render chúng cùng nhau trong một lần duy nhất vào cuối event. Trong trường hợp hiếm khi bạn cần buộc một state update cụ thể được áp dụng đồng bộ, bạn có thể bọc nó trong [`flushSync`,](/reference/react-dom/flushSync) nhưng điều này có thể làm giảm performance.

- `setState` không cập nhật `this.state` ngay lập tức. Vì vậy, việc đọc `this.state` ngay sau khi gọi `setState` có thể dẫn đến lỗi khó nhận ra. Thay vào đó, hãy sử dụng [`componentDidUpdate`](#componentdidupdate) hoặc đối số `callback` của setState; cả hai đều được đảm bảo chạy sau khi update được áp dụng. Nếu cần thiết lập state dựa trên state trước đó, bạn có thể truyền một function vào `nextState` như mô tả ở trên.

<Note>

Việc gọi `setState` trong class component tương tự như việc gọi một function [`set`function](/reference/react/useState#setstate) trong function component.

[Xem cách migrate.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

Nếu bạn định nghĩa `shouldComponentUpdate`, React sẽ gọi nó để xác định liệu có thể bỏ qua một lần re-render hay không.

Nếu bạn chắc chắn muốn tự viết, bạn có thể so sánh `this.props` với `nextProps` và `this.state` với `nextState`, rồi trả về `false` để cho React biết rằng có thể bỏ qua update.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Không có gì thay đổi nên không cần render lại
      return false;
    }
    return true;
  }

  // ...
}

```

React gọi `shouldComponentUpdate` trước khi render khi đang nhận props hoặc state mới. Mặc định là `true`. Method này không được gọi trong lần render ban đầu hoặc khi sử dụng [`forceUpdate`](#forceupdate).

#### Tham số {/*shouldcomponentupdate-parameters*/}

- `nextProps`: Props tiếp theo mà component sắp render cùng. So sánh `nextProps` với [`this.props`](#props) để xác định điều gì đã thay đổi.
- `nextState`: State tiếp theo mà component sắp render cùng. So sánh `nextState` với [`this.state`](#props) để xác định điều gì đã thay đổi.
- `nextContext`: Context tiếp theo mà component sắp render cùng. So sánh `nextContext` với [`this.context`](#context) để xác định điều gì đã thay đổi. Chỉ khả dụng nếu bạn chỉ định [`static contextType`](#static-contexttype).

#### Giá trị trả về {/*shouldcomponentupdate-returns*/}

Trả về `true` nếu bạn muốn component re-render. Đây là hành vi mặc định.

Trả về `false` để cho React biết rằng có thể bỏ qua việc re-render.

#### Lưu ý {/*shouldcomponentupdate-caveats*/}

- Method này *chỉ* tồn tại như một tối ưu hóa performance. Nếu component của bạn bị lỗi khi không có method này, hãy khắc phục điều đó trước.

- Hãy cân nhắc sử dụng [`PureComponent`](/reference/react/PureComponent) thay vì tự viết `shouldComponentUpdate`. `PureComponent` sẽ shallow compare props và state, đồng thời giảm khả năng bạn bỏ qua một update cần thiết.

- Chúng tôi không khuyến nghị thực hiện deep equality check hoặc sử dụng `JSON.stringify` trong `shouldComponentUpdate`. Điều này khiến performance trở nên khó dự đoán và phụ thuộc vào cấu trúc dữ liệu của mọi prop và state. Trong trường hợp tốt nhất, bạn có nguy cơ tạo ra tình trạng ứng dụng bị stall trong nhiều giây; trong trường hợp xấu nhất, ứng dụng có thể bị crash.

- Việc trả về `false` không ngăn các child component re-render khi *state của chính chúng* thay đổi.

- Việc trả về `false` không *đảm bảo* component sẽ không re-render. React sẽ sử dụng giá trị trả về như một gợi ý, nhưng vẫn có thể chọn re-render component nếu điều đó hợp lý vì các lý do khác.

<Note>

Tối ưu hóa class component bằng `shouldComponentUpdate` tương tự như tối ưu hóa function component bằng [`memo`.](/reference/react/memo) Function component cũng cung cấp khả năng tối ưu hóa chi tiết hơn với [`useMemo`.](/reference/react/useMemo)

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

Nếu bạn định nghĩa `UNSAFE_componentWillMount`, React sẽ gọi nó ngay sau [`constructor`.](#constructor) Method này chỉ tồn tại vì lý do lịch sử và không nên được sử dụng trong code mới. Thay vào đó, hãy sử dụng một trong các phương án sau:

- Để khởi tạo state, hãy khai báo [`state`](#state) dưới dạng class field hoặc thiết lập `this.state` bên trong [`constructor`.](#constructor)
- Nếu cần chạy một side effect hoặc thiết lập subscription, hãy chuyển logic đó sang [`componentDidMount`](#componentdidmount).

[Xem các ví dụ về cách migrate khỏi unsafe lifecycle.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Tham số {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` không nhận tham số nào.

#### Giá trị trả về {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` không nên trả về gì.

#### Lưu ý {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount` sẽ không được gọi nếu component triển khai [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) hoặc [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Mặc dù tên gọi gợi ý điều ngược lại, `UNSAFE_componentWillMount` không đảm bảo component *sẽ* được mounted nếu app của bạn sử dụng các tính năng React hiện đại như [`Suspense`.](/reference/react/Suspense) Nếu một lần render bị suspended (ví dụ: do code của một child component nào đó chưa được load), React sẽ loại bỏ tree đang xử lý và cố gắng xây dựng component lại từ đầu trong lần thử tiếp theo. Đây là lý do method này là "unsafe". Code phụ thuộc vào việc mounting (chẳng hạn như thêm subscription) nên được đặt trong [`componentDidMount`.](#componentdidmount)

- `UNSAFE_componentWillMount` là lifecycle method duy nhất chạy trong quá trình [server rendering.](/reference/react-dom/server) Xét trên mọi phương diện thực tế, nó tương đương với [`constructor`,](#constructor) vì vậy bạn nên sử dụng `constructor` cho loại logic này.

<Note>

Việc gọi [`setState`](#setstate) bên trong `UNSAFE_componentWillMount` trong class component để khởi tạo state tương đương với việc truyền state đó làm initial state cho [`useState`](/reference/react/useState) trong function component.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

Nếu bạn định nghĩa `UNSAFE_componentWillReceiveProps`, React sẽ gọi nó khi component nhận props mới. Method này chỉ tồn tại vì lý do lịch sử và không nên được sử dụng trong code mới. Thay vào đó, hãy sử dụng một trong các phương án sau:

- Nếu bạn cần **chạy một side effect** (ví dụ: fetch dữ liệu, chạy animation hoặc khởi tạo lại một subscription) để phản hồi các thay đổi của prop, thay vào đó hãy chuyển logic đó vào [`componentDidUpdate`](#componentdidupdate).
- Nếu bạn cần **tránh tính toán lại một số dữ liệu chỉ khi một prop thay đổi,** thay vào đó hãy sử dụng một [helper memoization](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
- Nếu bạn cần **“đặt lại” một số state khi một prop thay đổi,** hãy cân nhắc việc biến component thành [được kiểm soát hoàn toàn](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) hoặc [hoàn toàn không được kiểm soát với một key](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).
- Nếu bạn cần **“điều chỉnh” một số state khi một prop thay đổi,** hãy kiểm tra xem bạn có thể tính toán mọi thông tin cần thiết chỉ từ props trong quá trình rendering hay không. Nếu không thể, thay vào đó hãy sử dụng [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops).

[Xem các ví dụ về cách chuyển đổi khỏi các lifecycle không an toàn.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### Parameters {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: Các props tiếp theo mà component sắp nhận từ component cha. So sánh `nextProps` với [`this.props`](#props) để xác định điều gì đã thay đổi.
- `nextContext`: Context tiếp theo mà component sắp nhận từ provider gần nhất. So sánh `nextContext` với [`this.context`](#context) để xác định điều gì đã thay đổi. Chỉ khả dụng nếu bạn chỉ định [`static contextType`](#static-contexttype).

#### Returns {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` không nên trả về bất kỳ giá trị nào.

#### Caveats {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps` sẽ không được gọi nếu component triển khai [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) hoặc [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Mặc dù tên gọi mang ý nghĩa như vậy, `UNSAFE_componentWillReceiveProps` không đảm bảo rằng component *sẽ* nhận các props đó nếu ứng dụng của bạn sử dụng những tính năng hiện đại của React như [`Suspense`.](/reference/react/Suspense) Nếu một lần thử render bị tạm dừng (ví dụ: vì code của một component con nào đó chưa được tải), React sẽ loại bỏ cây đang xử lý và cố gắng xây dựng component từ đầu trong lần thử tiếp theo. Đến lần thử render tiếp theo, các props có thể đã khác. Đây là lý do phương thức này “không an toàn”. Code chỉ nên chạy đối với các lần cập nhật đã commit (chẳng hạn như đặt lại một subscription) nên được đưa vào [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillReceiveProps` không có nghĩa là component đã nhận các props *khác* so với lần trước. Bạn cần tự so sánh `nextProps` và `this.props` để kiểm tra xem có điều gì thay đổi hay không.

- React không gọi `UNSAFE_componentWillReceiveProps` với các props ban đầu trong quá trình mounting. React chỉ gọi phương thức này nếu một số props của component sắp được cập nhật. Ví dụ: việc gọi [`setState`](#setstate) nhìn chung không kích hoạt `UNSAFE_componentWillReceiveProps` bên trong cùng component.

<Note>

Việc gọi [`setState`](#setstate) bên trong `UNSAFE_componentWillReceiveProps` trong một class component để “điều chỉnh” state tương đương với [việc gọi hàm `set` từ `useState` trong quá trình rendering](/reference/react/useState#storing-information-from-previous-renders) trong một function component.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


Nếu bạn định nghĩa `UNSAFE_componentWillUpdate`, React sẽ gọi nó trước khi rendering với props hoặc state mới. Phương thức này chỉ tồn tại vì lý do lịch sử và không nên được sử dụng trong code mới. Thay vào đó, hãy sử dụng một trong các phương án sau:

- Nếu bạn cần chạy một side effect (ví dụ: fetch dữ liệu, chạy animation hoặc khởi tạo lại một subscription) để phản hồi các thay đổi của prop hoặc state, hãy chuyển logic đó vào [`componentDidUpdate`](#componentdidupdate).
- Nếu bạn cần đọc một số thông tin từ DOM (ví dụ: để lưu vị trí scroll hiện tại) nhằm sử dụng trong [`componentDidUpdate`](#componentdidupdate) sau đó, hãy đọc thông tin đó bên trong [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate).

[Xem các ví dụ về cách chuyển đổi khỏi các lifecycle không an toàn.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parameters {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: Các props tiếp theo mà component sắp render cùng. So sánh `nextProps` với [`this.props`](#props) để xác định điều gì đã thay đổi.
- `nextState`: State tiếp theo mà component sắp render cùng. So sánh `nextState` với [`this.state`](#state) để xác định điều gì đã thay đổi.

#### Returns {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` không nên trả về bất kỳ giá trị nào.

#### Caveats {/*unsafe_componentwillupdate-caveats*/}

- `UNSAFE_componentWillUpdate` sẽ không được gọi nếu [`shouldComponentUpdate`](#shouldcomponentupdate) được định nghĩa và trả về `false`.

- `UNSAFE_componentWillUpdate` sẽ không được gọi nếu component triển khai [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) hoặc [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Không hỗ trợ việc gọi [`setState`](#setstate) (hoặc bất kỳ phương thức nào dẫn đến việc gọi `setState`, chẳng hạn như dispatch một Redux action) trong quá trình `componentWillUpdate`.

- Mặc dù tên gọi mang ý nghĩa như vậy, `UNSAFE_componentWillUpdate` không đảm bảo rằng component *sẽ* được cập nhật nếu ứng dụng của bạn sử dụng những tính năng hiện đại của React như [`Suspense`.](/reference/react/Suspense) Nếu một lần thử render bị tạm dừng (ví dụ: vì code của một component con nào đó chưa được tải), React sẽ loại bỏ cây đang xử lý và cố gắng xây dựng component từ đầu trong lần thử tiếp theo. Đến lần thử render tiếp theo, props và state có thể đã khác. Đây là lý do phương thức này “không an toàn”. Code chỉ nên chạy đối với các lần cập nhật đã commit (chẳng hạn như đặt lại một subscription) nên được đưa vào [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillUpdate` không có nghĩa là component đã nhận các props hoặc state *khác* so với lần trước. Bạn cần tự so sánh `nextProps` với `this.props` và `nextState` với `this.state` để kiểm tra xem có điều gì thay đổi hay không.

- React không gọi `UNSAFE_componentWillUpdate` với props và state ban đầu trong quá trình mounting.

<Note>

Không có phương thức tương đương trực tiếp với `UNSAFE_componentWillUpdate` trong function component.

</Note>

---

### `static contextType` {/*static-contexttype*/}

Nếu muốn đọc [`this.context`](#context-instance-field) từ class component, bạn phải chỉ định context mà component cần đọc. Context bạn chỉ định làm `static contextType` phải là một giá trị đã được tạo trước đó bởi [`createContext`.](/reference/react/createContext)

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

Việc đọc `this.context` trong class component tương đương với [`useContext`](/reference/react/useContext) trong function component.

[Xem cách chuyển đổi.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

Bạn có thể định nghĩa `static defaultProps` để thiết lập các props mặc định cho class. Chúng sẽ được sử dụng cho `undefined` và các props bị thiếu, nhưng không được sử dụng cho các props `null`.

Ví dụ: sau đây là cách bạn định nghĩa rằng prop `color` sẽ mặc định là `'blue'`:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

Nếu prop `color` không được cung cấp hoặc là `undefined`, nó sẽ được mặc định đặt thành `'blue'`:

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

Việc định nghĩa `defaultProps` trong các class component tương tự như việc sử dụng [giá trị mặc định](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) trong các function component.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

Nếu bạn định nghĩa `static getDerivedStateFromError`, React sẽ gọi nó khi một child component (bao gồm cả các component con ở xa) phát sinh lỗi trong quá trình render. Điều này cho phép bạn hiển thị thông báo lỗi thay vì xóa UI.

Thông thường, nó được sử dụng cùng với [`componentDidCatch`](#componentdidcatch), cho phép bạn gửi báo cáo lỗi đến một analytics service nào đó. Một component có các method này được gọi là *Error Boundary*.

[Xem ví dụ.](#catching-rendering-errors-with-an-error-boundary)

#### Tham số {/*static-getderivedstatefromerror-parameters*/}

* `error`: Lỗi đã phát sinh. Trên thực tế, nó thường sẽ là một instance của [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), nhưng điều này không được đảm bảo vì JavaScript cho phép [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) bất kỳ giá trị nào, bao gồm cả chuỗi hoặc thậm chí `null`.

#### Giá trị trả về {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` phải trả về state cho biết component cần hiển thị thông báo lỗi.

#### Lưu ý {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` phải là một pure function. Nếu bạn muốn thực hiện một side effect (ví dụ: gọi một analytics service), bạn cũng cần triển khai [`componentDidCatch`.](#componentdidcatch)

<Note>

Hiện chưa có cách tương đương trực tiếp cho `static getDerivedStateFromError` trong function component. Nếu bạn muốn tránh việc tạo class component, hãy viết một `ErrorBoundary` component duy nhất như trên và sử dụng nó trong toàn bộ app. Ngoài ra, hãy sử dụng package [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary), package này thực hiện điều đó.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

Nếu bạn định nghĩa `static getDerivedStateFromProps`, React sẽ gọi nó ngay trước khi gọi [`render`,](#render) cả khi mount lần đầu lẫn trong các lần update tiếp theo. Method này phải trả về một object để cập nhật state, hoặc `null` nếu không cập nhật gì.

Method này tồn tại cho các trường hợp [hiếm gặp](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) mà state phụ thuộc vào những thay đổi của props theo thời gian. Ví dụ, component `Form` này reset state `email` khi prop `userID` thay đổi:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Mỗi khi người dùng hiện tại thay đổi,
    // hãy reset mọi phần state gắn với người dùng đó.
    // Trong ví dụ đơn giản này, đó chỉ là email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Lưu ý rằng pattern này yêu cầu bạn lưu giá trị trước đó của prop (chẳng hạn như `userID`) trong state (chẳng hạn như `prevUserID`).

<Pitfall>

Việc suy ra state dẫn đến code dài dòng và khiến component khó hiểu hơn. [Hãy đảm bảo bạn đã quen thuộc với các lựa chọn thay thế đơn giản hơn:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- Nếu bạn cần **thực hiện một side effect** (ví dụ: fetching dữ liệu hoặc animation) để phản hồi một thay đổi trong props, hãy sử dụng method [`componentDidUpdate`](#componentdidupdate) thay thế.
- Nếu bạn muốn **tính toán lại một số dữ liệu chỉ khi prop thay đổi,** [hãy sử dụng một memoization helper thay thế.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- Nếu bạn muốn **“reset” một state khi prop thay đổi,** hãy cân nhắc việc biến component thành [fully controlled](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) hoặc [fully uncontrolled with a key](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

</Pitfall>

#### Tham số {/*static-getderivedstatefromprops-parameters*/}

- `props`: Các props tiếp theo mà component sắp render.
- `state`: State tiếp theo mà component sắp render.

#### Giá trị trả về {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` trả về một object để cập nhật state, hoặc `null` nếu không cập nhật gì.

#### Lưu ý {/*static-getderivedstatefromprops-caveats*/}

- Method này được gọi trong *mọi* lần render, bất kể nguyên nhân. Điều này khác với [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops), vốn chỉ được gọi khi parent gây ra một lần re-render chứ không phải do một `setState` cục bộ.

- Method này không có quyền truy cập vào instance của component. Nếu muốn, bạn có thể dùng lại một số code giữa `static getDerivedStateFromProps` và các class method khác bằng cách tách các pure function nhận props và state của component ra bên ngoài định nghĩa class.

<Note>

Việc triển khai `static getDerivedStateFromProps` trong một class component tương đương với [việc gọi function `set` từ `useState` trong quá trình render](/reference/react/useState#storing-information-from-previous-renders) trong một function component.

</Note>

---

## Cách sử dụng {/*usage*/}

### Định nghĩa một class component {/*defining-a-class-component*/}

Để định nghĩa một React component dưới dạng class, hãy extend class tích hợp sẵn `Component` và định nghĩa một method [`render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React sẽ gọi method [`render`](#render) của bạn bất cứ khi nào cần xác định nội dung sẽ hiển thị trên màn hình. Thông thường, bạn sẽ trả về một số [JSX](/learn/writing-markup-with-jsx) từ method này. Method `render` của bạn phải là một [pure function:](https://en.wikipedia.org/wiki/Pure_function) nó chỉ nên tính toán JSX.

Tương tự như [function component,](/learn/your-first-component#defining-a-component), class component có thể [nhận thông tin thông qua props](/learn/your-first-component#defining-a-component) từ parent component. Tuy nhiên, cú pháp đọc props khác nhau. Ví dụ: nếu parent component render `<Greeting name="Taylor" />`, bạn có thể đọc prop `name` từ [`this.props`](#props), như sau `this.props.name`:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Lưu ý rằng Hooks (các function bắt đầu bằng `use`, như [`useState`](/reference/react/useState)) không được hỗ trợ bên trong class component.

<Pitfall>

Chúng tôi khuyến nghị định nghĩa component dưới dạng function thay vì class. [Xem cách migrate.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Thêm state vào class component {/*adding-state-to-a-class-component*/}

Để thêm [state](/learn/state-a-components-memory) vào một class, hãy gán một object cho property có tên [`state`](#state). Để cập nhật state, hãy gọi [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Pitfall>

Chúng tôi khuyến nghị định nghĩa component dưới dạng function thay vì class. [Xem cách migrate.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Thêm lifecycle method vào class component {/*adding-lifecycle-methods-to-a-class-component*/}

Bạn có thể định nghĩa một vài method đặc biệt trên class của mình.

Nếu bạn định nghĩa method [`componentDidMount`](#componentdidmount), React sẽ gọi nó khi component của bạn được thêm *(mounted)* vào màn hình. React sẽ gọi [`componentDidUpdate`](#componentdidupdate) sau khi component của bạn re-render do props hoặc state thay đổi. React sẽ gọi [`componentWillUnmount`](#componentwillunmount) sau khi component của bạn bị xóa *(unmounted)* khỏi màn hình.

Nếu bạn triển khai `componentDidMount`, thông thường bạn cần triển khai cả ba lifecycle để tránh lỗi. Ví dụ: nếu `componentDidMount` đọc một số state hoặc props, bạn cũng phải triển khai `componentDidUpdate` để xử lý các thay đổi của chúng, và `componentWillUnmount` để dọn dẹp bất cứ điều gì mà `componentDidMount` đang thực hiện.

Ví dụ, component `ChatRoom` này giữ cho kết nối chat được đồng bộ với props và state:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Lưu ý rằng trong môi trường development, khi [Strict Mode](/reference/react/StrictMode) được bật, React sẽ gọi `componentDidMount`, ngay lập tức gọi `componentWillUnmount`, rồi lại gọi `componentDidMount`. Điều này giúp bạn nhận ra nếu quên triển khai `componentWillUnmount` hoặc nếu logic của nó không hoàn toàn “mirror” những gì `componentDidMount` thực hiện.

<Pitfall>

Chúng tôi khuyến nghị định nghĩa component dưới dạng function thay vì class. [Xem cách migrate.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### Bắt lỗi khi rendering bằng một Error Boundary {/*catching-rendering-errors-with-an-error-boundary*/}

Theo mặc định, nếu ứng dụng của bạn throw một error trong quá trình rendering, React sẽ xóa UI của ứng dụng khỏi màn hình. Để ngăn điều này, bạn có thể bọc một phần UI trong một *Error Boundary*. Error Boundary là một component đặc biệt cho phép bạn hiển thị một fallback UI thay cho phần đã bị crash--ví dụ: một thông báo lỗi.

<Note>
Error Boundary không bắt được lỗi trong các trường hợp sau:

- Event handler [(tìm hiểu thêm)](/learn/responding-to-events)
- [Server side rendering](/reference/react-dom/server)
- Lỗi được throw ngay bên trong Error Boundary (thay vì bên trong các component con của nó)
- Code bất đồng bộ (ví dụ: callback của `setTimeout` hoặc `requestAnimationFrame`); một ngoại lệ là việc sử dụng hàm [`startTransition`](/reference/react/useTransition#starttransition) được trả về bởi [`useTransition`](/reference/react/useTransition) Hook. Các lỗi được throw bên trong transition function sẽ được Error Boundary bắt lại [(tìm hiểu thêm)](/reference/react/useTransition#displaying-an-error-to-users-with-error-boundary)

</Note>

Để triển khai một component Error Boundary, bạn cần cung cấp [`static getDerivedStateFromError`](#static-getderivedstatefromerror), cho phép bạn cập nhật state để phản hồi lỗi và hiển thị thông báo lỗi cho người dùng. Bạn cũng có thể tùy chọn triển khai [`componentDidCatch`](#componentdidcatch) để thêm một số logic khác, chẳng hạn như ghi log lỗi vào một analytics service.

Với [`captureOwnerStack`](/reference/react/captureOwnerStack), bạn có thể đưa Owner Stack vào trong quá trình development.

```js {9-12,14-27}
import * as React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để lần render tiếp theo hiển thị UI fallback.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(
      error,
      // Ví dụ về "componentStack":
      //   trong ComponentThatThrows (được tạo bởi App)
      //   trong ErrorBoundary (được tạo bởi App)
      //   trong div (được tạo bởi App)
      //   trong App
      info.componentStack,
      // Cảnh báo: `captureOwnerStack` không có trong môi trường production.
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // Bạn có thể render bất kỳ UI fallback tùy chỉnh nào
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Sau đó, bạn có thể bọc một phần cây component bằng nó:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

Nếu `Profile` hoặc component con của nó throw một error, `ErrorBoundary` sẽ “catch” error đó, hiển thị fallback UI cùng thông báo lỗi mà bạn đã cung cấp, đồng thời gửi báo cáo lỗi production đến error reporting service của bạn.

Bạn không cần bọc từng component trong một Error Boundary riêng. Khi cân nhắc [granularity của Error Boundary,](https://www.brandondail.com/posts/fault-tolerance-react) hãy xem nơi nào phù hợp để hiển thị thông báo lỗi. Ví dụ, trong một ứng dụng nhắn tin, việc đặt một Error Boundary quanh danh sách các cuộc trò chuyện là hợp lý. Việc đặt một Error Boundary quanh từng tin nhắn riêng lẻ cũng hợp lý. Tuy nhiên, sẽ không hợp lý nếu đặt một boundary quanh từng avatar.

<Note>

Hiện tại không có cách nào viết một Error Boundary dưới dạng function component. Tuy nhiên, bạn không cần tự viết class Error Boundary. Ví dụ, bạn có thể sử dụng [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) thay thế.

</Note>

---

## Các lựa chọn thay thế {/*alternatives*/}

### Migrate một component đơn giản từ class sang function {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Thông thường, bạn sẽ [định nghĩa component dưới dạng function](/learn/your-first-component#defining-a-component) thay thế.

Ví dụ, giả sử bạn đang chuyển class component `Greeting` sau đây thành function:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Định nghĩa một function có tên `Greeting`. Đây là nơi bạn sẽ chuyển phần thân của function `render`.

```js
function Greeting() {
  // ... chuyển code từ phương thức render vào đây ...
}
```

Thay vì `this.props.name`, hãy định nghĩa prop `name` [bằng cú pháp destructuring](/learn/passing-props-to-a-component) và đọc trực tiếp prop đó:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

Dưới đây là một ví dụ hoàn chỉnh:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### Migrate một component có state từ class sang function {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Giả sử bạn đang chuyển class component `Counter` sau đây thành function:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

Bắt đầu bằng cách khai báo một function với các [biến state cần thiết:](/reference/react/useState#adding-state-to-a-component)

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

Tiếp theo, chuyển đổi các event handler:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

Cuối cùng, thay thế tất cả tham chiếu bắt đầu bằng `this` bằng các biến và function mà bạn đã định nghĩa trong component. Ví dụ, thay thế `this.state.age` bằng `age`, và thay thế `this.handleNameChange` bằng `handleNameChange`.

Dưới đây là component đã được chuyển đổi hoàn chỉnh:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Migrate một component có lifecycle method từ class sang function {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Giả sử bạn đang chuyển class component `ChatRoom` có lifecycle method sau đây thành function:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Trước tiên, hãy xác minh rằng [`componentWillUnmount`](#componentwillunmount) của bạn thực hiện điều ngược lại với [`componentDidMount`.](#componentdidmount) Trong ví dụ trên, điều này là đúng: nó ngắt kết nối mà `componentDidMount` thiết lập. Nếu thiếu logic như vậy, trước tiên hãy thêm logic đó.

Tiếp theo, hãy xác minh rằng method [`componentDidUpdate`](#componentdidupdate) của bạn xử lý các thay đổi đối với mọi prop và state mà bạn đang sử dụng trong `componentDidMount`. Trong ví dụ trên, `componentDidMount` gọi `setupConnection`, hàm này đọc `this.state.serverUrl` và `this.props.roomId`. Đó là lý do `componentDidUpdate` kiểm tra xem `this.state.serverUrl` và `this.props.roomId` có thay đổi hay không, rồi reset connection nếu chúng đã thay đổi. Nếu logic `componentDidUpdate` của bạn bị thiếu hoặc không xử lý các thay đổi đối với tất cả prop và state liên quan, trước tiên hãy sửa logic đó.

Trong ví dụ trên, logic bên trong các lifecycle method kết nối component với một hệ thống bên ngoài React (một chat server). Để kết nối component với một hệ thống bên ngoài, [hãy mô tả logic này dưới dạng một Effect duy nhất:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

Lời gọi [`useEffect`](/reference/react/useEffect) này tương đương với logic trong các lifecycle method ở trên. Nếu lifecycle method của bạn thực hiện nhiều việc không liên quan, [hãy tách chúng thành nhiều Effect độc lập.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Dưới đây là một ví dụ hoàn chỉnh để bạn có thể thực hành:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Trong bản triển khai thực tế, đoạn này sẽ kết nối với server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

Nếu component của bạn không đồng bộ hóa với bất kỳ hệ thống bên ngoài nào, [có thể bạn không cần Effect.](/learn/you-might-not-need-an-effect)

</Note>

---

### Migrate một component có context từ class sang function {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

Trong ví dụ này, hai class component `Panel` và `Button` đọc [context](/learn/passing-data-deeply-with-context) từ [`this.context`:](#context)

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Khi chuyển chúng thành function component, hãy thay thế `this.context` bằng các lời gọi [`useContext`](/reference/react/useContext):

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
