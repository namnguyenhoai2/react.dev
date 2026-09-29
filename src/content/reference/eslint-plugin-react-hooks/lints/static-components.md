---
title: static-components
---

<Intro>

Xác thực rằng các component là static, không được tạo lại trong mỗi lần render. Các component được tạo lại một cách dynamic có thể reset state và gây ra việc re-render quá mức.

</Intro>

## Chi tiết về rule {/*rule-details*/}

Các component được định nghĩa bên trong những component khác sẽ được tạo lại trong mỗi lần render. React xem mỗi component như một component type hoàn toàn mới, unmount component cũ và mount component mới, đồng thời hủy toàn bộ state và các DOM node trong quá trình này.

### Không hợp lệ {/*invalid*/}

Ví dụ về code không đúng đối với rule này:

```js
// ❌ Component defined inside component
function Parent() {
  const ChildComponent = () => { // New component every render!
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };

  return <ChildComponent />; // State resets every render
}

// ❌ Dynamic component creation
function Parent({type}) {
  const Component = type === 'button'
    ? () => <button>Click</button>
    : () => <div>Text</div>;

  return <Component />;
}
```

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với rule này:

```js
// ✅ Components at module level
const ButtonComponent = () => <button>Click</button>;
const TextComponent = () => <div>Text</div>;

function Parent({type}) {
  const Component = type === 'button'
    ? ButtonComponent  // Reference existing component
    : TextComponent;

  return <Component />;
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi cần render các component khác nhau một cách có điều kiện {/*conditional-components*/}

Bạn có thể định nghĩa các component ở bên trong để truy cập state cục bộ:

```js {expectedErrors: {'react-compiler': [13]}}
// ❌ Wrong: Inner component to access parent state
function Parent() {
  const [theme, setTheme] = useState('light');

  function ThemedButton() { // Recreated every render!
    return (
      <button className={theme}>
        Click me
      </button>
    );
  }

  return <ThemedButton />;
}
```

Thay vào đó, hãy truyền dữ liệu dưới dạng props:

```js
// ✅ Better: Pass props to static component
function ThemedButton({theme}) {
  return (
    <button className={theme}>
      Click me
    </button>
  );
}

function Parent() {
  const [theme, setTheme] = useState('light');
  return <ThemedButton theme={theme} />;
}
```

<Note>

Nếu bạn thấy mình muốn định nghĩa các component bên trong những component khác để truy cập các biến cục bộ, đó là dấu hiệu cho thấy bạn nên truyền props thay thế. Điều này giúp các component có khả năng tái sử dụng và dễ kiểm thử hơn.

</Note>