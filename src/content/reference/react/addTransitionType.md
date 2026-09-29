---
title: addTransitionType
---

<Intro>

`addTransitionType` cho phép bạn chỉ định nguyên nhân của một lần chuyển tiếp.


```js
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `addTransitionType` {/*addtransitiontype*/}

#### Tham số {/*parameters*/}

- `type`: Loại chuyển tiếp cần thêm. Đây có thể là bất kỳ chuỗi nào.

#### Giá trị trả về {/*returns*/}

`addTransitionType` không trả về giá trị nào.

#### Lưu ý {/*caveats*/}

- Nếu nhiều chuyển tiếp được kết hợp, tất cả Transition Types sẽ được tập hợp. Bạn cũng có thể thêm nhiều loại vào một Transition.
- Transition Types được đặt lại sau mỗi commit. Điều này có nghĩa là một `<Suspense>` fallback sẽ liên kết các loại sau một `startTransition`, nhưng việc hiển thị nội dung thì không.

---

## Cách sử dụng {/*usage*/}

### Thêm nguyên nhân của một lần chuyển tiếp {/*adding-the-cause-of-a-transition*/}

Gọi `addTransitionType` bên trong `startTransition` để cho biết nguyên nhân của một lần chuyển tiếp:

``` [[1, 6, "addTransitionType"], [2, 5, "startTransition", [3, 6, "'submit-click'"]]
import { startTransition, addTransitionType } from 'react';

function Submit({action) {
  function handleClick() {
    startTransition(() => {
      addTransitionType('submit-click');
      action();
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}

```

Khi bạn gọi <CodeStep step={1}>addTransitionType</CodeStep> bên trong phạm vi của <CodeStep step={2}>startTransition</CodeStep>, React sẽ liên kết <CodeStep step={3}>submit-click</CodeStep> như một trong các nguyên nhân của Transition.

Hiện tại, Transition Types có thể được dùng để tùy chỉnh các animation khác nhau dựa trên nguyên nhân gây ra Transition. Bạn có ba cách khác nhau để lựa chọn cách sử dụng chúng:

- [Tùy chỉnh animation bằng browser view transition types](#customize-animations-using-browser-view-transition-types)
- [Tùy chỉnh animation bằng `View Transition` Class](#customize-animations-using-view-transition-class)
- [Tùy chỉnh animation bằng các sự kiện `ViewTransition` events](#customize-animations-using-viewtransition-events)

Trong tương lai, chúng tôi dự định hỗ trợ thêm nhiều trường hợp sử dụng nguyên nhân của một lần chuyển tiếp.

---
### Tùy chỉnh animation bằng browser view transition types {/*customize-animations-using-browser-view-transition-types*/}

Khi một [`ViewTransition`](/reference/react/ViewTransition) được kích hoạt từ một lần chuyển tiếp, React sẽ thêm tất cả Transition Types dưới dạng các [view transition types](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) của browser vào phần tử.

Điều này cho phép bạn tùy chỉnh các animation khác nhau dựa trên các phạm vi CSS:

```js [11]
function Component() {
  return (
    <ViewTransition>
      <div>Hello</div>
    </ViewTransition>
  );
}

startTransition(() => {
  addTransitionType('my-transition-type');
  setShow(true);
});
```

```css
:root:active-view-transition-type(my-transition-type) {
  &::view-transition-...(...) {
    ...
  }
}
```

---

### Tùy chỉnh animation bằng `View Transition` Class {/*customize-animations-using-view-transition-class*/}

Bạn có thể tùy chỉnh animation cho một `ViewTransition` được kích hoạt dựa trên loại bằng cách truyền một object vào View Transition Class:

```js
function Component() {
  return (
    <ViewTransition enter={{
      'my-transition-type': 'my-transition-class',
    }}>
      <div>Hello</div>
    </ViewTransition>
  );
}

// ...
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

Nếu nhiều loại khớp, chúng sẽ được nối với nhau. Nếu không có loại nào khớp, mục nhập đặc biệt "default" sẽ được dùng thay thế. Nếu bất kỳ loại nào có giá trị "none", loại đó sẽ được ưu tiên và ViewTransition sẽ bị vô hiệu hóa (không được gán tên).

Bạn có thể kết hợp các tùy chọn enter/exit/update/layout/share này để khớp dựa trên loại trigger và Transition Type.

```js
<ViewTransition enter={{
  'navigation-back': 'enter-right',
  'navigation-forward': 'enter-left',
}}
exit={{
  'navigation-back': 'exit-right',
  'navigation-forward': 'exit-left',
}}>
```

---

### Tùy chỉnh animation bằng các sự kiện `ViewTransition` {/*customize-animations-using-viewtransition-events*/}

Bạn có thể tùy chỉnh animation theo cách mệnh lệnh cho một `ViewTransition` được kích hoạt dựa trên loại bằng các sự kiện View Transition:

```
<ViewTransition onUpdate={(inst, types) => {
  if (types.includes('navigation-back')) {
    ...
  } else if (types.includes('navigation-forward')) {
    ...
  } else {
    ...
  }
}}>
```

Điều này cho phép bạn chọn các Animation mệnh lệnh khác nhau dựa trên nguyên nhân.