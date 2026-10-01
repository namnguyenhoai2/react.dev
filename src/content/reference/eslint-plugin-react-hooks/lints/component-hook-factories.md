---
title: component-hook-factories
---

<Intro>

Kiểm tra các higher-order function định nghĩa component hoặc hook lồng nhau. Component và hook nên được định nghĩa ở cấp module.

</Intro>

## Chi tiết về rule {/*rule-details*/}

Việc định nghĩa component hoặc hook bên trong các function khác sẽ tạo ra instance mới ở mỗi lần gọi. React xem mỗi instance là một component hoàn toàn khác, hủy và tạo lại toàn bộ cây component, làm mất toàn bộ state và gây ra các vấn đề về hiệu năng.

### Không hợp lệ {/*invalid*/}

Ví dụ về code không đúng đối với rule này:

```js {expectedErrors: {'react-compiler': [14]}}
// ❌ Hàm factory tạo component
function createComponent(defaultValue) {
  return function Component() {
    // ...
  };
}

// ❌ Component được định nghĩa bên trong component khác
function Parent() {
  function Child() {
    // ...
  }

  return <Child />;
}

// ❌ Hàm factory cho Hook
function createCustomHook(endpoint) {
  return function useData() {
    // ...
  };
}
```

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với rule này:

```js
// ✅ Component được định nghĩa ở cấp độ module
function Component({ defaultValue }) {
  // ...
}

// ✅ Hook tùy chỉnh ở cấp độ module
function useData(endpoint) {
  // ...
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi cần hành vi component động {/*dynamic-behavior*/}

Bạn có thể nghĩ rằng mình cần một factory để tạo các component được tùy chỉnh:

```js
// ❌ Sai: Mẫu factory
function makeButton(color) {
  return function Button({children}) {
    return (
      <button style={{backgroundColor: color}}>
        {children}
      </button>
    );
  };
}

const RedButton = makeButton('red');
const BlueButton = makeButton('blue');
```

Thay vào đó, hãy truyền [JSX làm children](/learn/passing-props-to-a-component#passing-jsx-as-children):

```js
// ✅ Tốt hơn: Truyền JSX dưới dạng children
function Button({color, children}) {
  return (
    <button style={{backgroundColor: color}}>
      {children}
    </button>
  );
}

function App() {
  return (
    <>
      <Button color="red">Red</Button>
      <Button color="blue">Blue</Button>
    </>
  );
}
```
