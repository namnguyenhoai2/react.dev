---
title: act
---

<Intro>

`act` là một test helper dùng để áp dụng các cập nhật React đang chờ xử lý trước khi thực hiện các assertion.

```js
await act(async actFn)
```

</Intro>

Để chuẩn bị một component cho các assertion, hãy bọc đoạn code render component và thực hiện các cập nhật bên trong một lần gọi `await act()`. Điều này giúp test của bạn chạy gần với cách React hoạt động trong trình duyệt hơn.

<Note>
Bạn có thể thấy việc sử dụng trực tiếp `act()` hơi dài dòng. Để tránh một phần boilerplate, bạn có thể sử dụng một library như [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), trong đó các helper của library đã được bọc bằng `act()`.
</Note>


<InlineToc />

---

## Tham khảo {/*reference*/}

### `await act(async actFn)` {/*await-act-async-actfn*/}

Khi viết UI test, các tác vụ như render, user event hoặc data fetching có thể được xem là “unit” tương tác với user interface. React cung cấp một helper có tên `act()`, giúp đảm bảo tất cả các cập nhật liên quan đến những “unit” này đã được xử lý và áp dụng vào DOM trước khi bạn thực hiện các assertion.

Tên `act` bắt nguồn từ pattern [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert).

```js {2,4}
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

<Note>

Chúng tôi khuyến nghị sử dụng `act` cùng với `await` và một hàm `async` async. Mặc dù phiên bản sync hoạt động trong nhiều trường hợp, nó không hoạt động trong mọi trường hợp. Ngoài ra, do cách React lên lịch các cập nhật ở bên trong, rất khó dự đoán khi nào bạn có thể sử dụng phiên bản sync.

Trong tương lai, chúng tôi sẽ deprecate và xóa phiên bản sync.

</Note>

#### Tham số {/*parameters*/}

* `async actFn`: Một hàm async bọc các thao tác render hoặc tương tác cho những component đang được test. Mọi cập nhật được kích hoạt bên trong `actFn` sẽ được thêm vào một act queue nội bộ, sau đó được flush cùng nhau để xử lý và áp dụng mọi thay đổi vào DOM. Vì là async, React cũng sẽ chạy mọi code vượt qua một async boundary và flush mọi cập nhật đã được lên lịch.

#### Giá trị trả về {/*returns*/}

`act` không trả về giá trị nào.

## Cách sử dụng {/*usage*/}

Khi test một component, bạn có thể sử dụng `act` để thực hiện assertion về output của component.

Ví dụ, giả sử chúng ta có component `Counter` này, các ví dụ sử dụng dưới đây cho biết cách test component đó:

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  )
}
```

### Render component trong test {/*rendering-components-in-tests*/}

Để test output render của một component, hãy bọc thao tác render bên trong `act()`:

```js  {10,12}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);

  // ✅ Render component bên trong act().
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');
});
```

Ở đây, chúng ta tạo một container, thêm nó vào document, rồi render component `Counter` bên trong `act()`. Điều này đảm bảo component được render và các effect của nó được áp dụng trước khi thực hiện các assertion.

Sử dụng `act` đảm bảo mọi cập nhật đã được áp dụng trước khi chúng ta thực hiện các assertion.

### Dispatch event trong test {/*dispatching-events-in-tests*/}

Để test event, hãy bọc thao tác dispatch event bên trong `act()`:

```js {14,16}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });

  // ✅ Dispatch event bên trong act().
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

Ở đây, chúng ta render component với `act`, sau đó dispatch event bên trong một `act()` khác. Điều này đảm bảo mọi cập nhật từ event đã được áp dụng trước khi thực hiện các assertion.

<Pitfall>

Đừng quên rằng việc dispatch các DOM event chỉ hoạt động khi DOM container được thêm vào document. Bạn có thể sử dụng một library như [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) để giảm lượng boilerplate code.

</Pitfall>

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi gặp lỗi: "The current testing environment is not configured to support act(...)" {/*error-the-current-testing-environment-is-not-configured-to-support-act*/}

Việc sử dụng `act` yêu cầu thiết lập `global.IS_REACT_ACT_ENVIRONMENT=true` trong test environment của bạn. Điều này nhằm đảm bảo `act` chỉ được sử dụng trong environment phù hợp.

Nếu bạn không thiết lập global này, bạn sẽ thấy một lỗi như sau:

<ConsoleBlock level="error">

Warning: The current testing environment is not configured to support act(...)

</ConsoleBlock>

Để khắc phục, hãy thêm đoạn này vào global setup file dành cho các React test:

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

<Note>

Trong các testing framework như [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), `IS_REACT_ACT_ENVIRONMENT` đã được thiết lập sẵn cho bạn.

</Note>
