---
title: PureComponent
---

<Pitfall>

Chúng tôi khuyến nghị định nghĩa component dưới dạng function thay vì class. [Xem cách migrate.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` tương tự như [`Component`](/reference/react/Component) nhưng bỏ qua việc re-render khi props và state không thay đổi. React vẫn hỗ trợ class component, nhưng chúng tôi không khuyến nghị sử dụng chúng trong code mới.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `PureComponent` {/*purecomponent*/}

Để bỏ qua việc re-render một class component khi props và state không thay đổi, hãy kế thừa `PureComponent` thay vì [`Component`:](/reference/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` là một subclass của `Component` và hỗ trợ [tất cả các API của `Component`.](/reference/react/Component#reference) Việc kế thừa `PureComponent` tương đương với việc định nghĩa một phương thức [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) tùy chỉnh, trong đó so sánh nông (shallow comparison) props và state.


[Xem thêm ví dụ bên dưới.](#usage)

---

## Cách sử dụng {/*usage*/}

### Bỏ qua các lần re-render không cần thiết cho class component {/*skipping-unnecessary-re-renders-for-class-components*/}

Thông thường, React re-render một component mỗi khi component cha của nó re-render. Để tối ưu hóa, bạn có thể tạo một component mà React sẽ không re-render khi component cha re-render, miễn là props và state mới của nó giống với props và state cũ. [Class component](/reference/react/Component) có thể bật hành vi này bằng cách kế thừa `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Một React component luôn phải có [logic rendering thuần.](/learn/keeping-components-pure) Điều này có nghĩa là nó phải trả về cùng một output nếu props, state và context của nó không thay đổi. Khi sử dụng `PureComponent`, bạn cho React biết rằng component của mình đáp ứng yêu cầu này, vì vậy React không cần re-render miễn là props và state của nó không thay đổi. Tuy nhiên, component của bạn vẫn sẽ re-render nếu một context mà nó đang sử dụng thay đổi.

Trong ví dụ này, hãy chú ý rằng component `Greeting` re-render mỗi khi `name` thay đổi (vì đó là một trong các prop của nó), nhưng không re-render khi `address` thay đổi (vì nó không được truyền cho `Greeting` dưới dạng prop):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

Chúng tôi khuyến nghị định nghĩa component dưới dạng function thay vì class. [Xem cách migrate.](#alternatives)

</Pitfall>

---

## Các lựa chọn thay thế {/*alternatives*/}

### Chuyển từ class component `PureComponent` sang function {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

Chúng tôi khuyến nghị sử dụng function component thay vì [class component](/reference/react/Component) trong code mới. Nếu bạn có một số class component hiện có đang sử dụng `PureComponent`, dưới đây là cách chuyển đổi chúng. Đây là code ban đầu:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Khi bạn [chuyển component này từ class sang function,](/reference/react/Component#alternatives) hãy bọc nó trong [`memo`:](/reference/react/memo)

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

Không giống như `PureComponent`, [`memo`](/reference/react/memo) không so sánh state mới và state cũ. Trong function component, việc gọi hàm [`set` function](/reference/react/useState#setstate) với cùng state [đã mặc định ngăn việc re-render,](/reference/react/memo#updating-a-memoized-component-using-state) ngay cả khi không có `memo`.

</Note>