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
// ❌ Factory function creating components
function createComponent(defaultValue) {
  return function Component() {
    // ...
  };
}

// ❌ Component defined inside component
function Parent() {
  function Child() {
    // ...
  }

  return <Child />;
}

// ❌ Hook factory function
function createCustomHook(endpoint) {
  return function useData() {
    // ...
  };
}
```

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với rule này:

```js
// ✅ Component defined at module level
function Component({ defaultValue }) {
  // ...
}

// ✅ Custom hook at module level
function useData(endpoint) {
  // ...
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi cần hành vi component động {/*dynamic-behavior*/}

Bạn có thể nghĩ rằng mình cần một factory để tạo các component được tùy chỉnh:

```js
// ❌ Wrong: Factory pattern
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
// ✅ Better: Pass JSX as children
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