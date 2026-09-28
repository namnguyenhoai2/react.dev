---
title: Bắt đầu nhanh
---

<Intro>

Chào mừng bạn đến với tài liệu React! Trang này sẽ giới thiệu cho bạn 80% các khái niệm React mà bạn sẽ sử dụng hằng ngày.

</Intro>

<YouWillLearn>

- Cách tạo và lồng ghép các component
- Cách thêm markup và style
- Cách hiển thị dữ liệu
- Cách render các điều kiện và danh sách
- Cách phản hồi sự kiện và cập nhật màn hình
- Cách chia sẻ dữ liệu giữa các component

</YouWillLearn>

## Tạo và lồng ghép các component {/*components*/}

Các ứng dụng React được tạo nên từ *component*. Một component là một phần của UI (giao diện người dùng), có logic và giao diện riêng. Một component có thể nhỏ như một button hoặc lớn như toàn bộ một trang.

Các component React là những hàm JavaScript trả về markup:

```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

Sau khi đã khai báo `MyButton`, bạn có thể lồng nó vào một component khác:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

Hãy chú ý rằng `<MyButton />` bắt đầu bằng một chữ cái viết hoa. Đây là cách bạn nhận biết đó là một component React. Tên component React luôn phải bắt đầu bằng chữ cái viết hoa, còn các tag HTML phải viết thường.

Hãy xem kết quả:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

Các từ khóa `export default` chỉ định component chính trong file. Nếu bạn chưa quen với một số cú pháp JavaScript, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) và [javascript.info](https://javascript.info/import-export) có các tài liệu tham khảo rất hữu ích.

## Viết markup bằng JSX {/*writing-markup-with-jsx*/}

Cú pháp markup bạn đã thấy ở trên được gọi là *JSX*. JSX là tùy chọn, nhưng hầu hết các dự án React đều sử dụng JSX vì tính tiện lợi của nó. Tất cả [công cụ chúng tôi khuyến nghị để phát triển cục bộ](/learn/installation) đều hỗ trợ JSX ngay từ đầu.

JSX nghiêm ngặt hơn HTML. Bạn phải đóng các tag như `<br />`. Component của bạn cũng không thể trả về nhiều tag JSX. Bạn phải bọc chúng trong một phần tử cha chung, chẳng hạn như một `<div>...</div>` hoặc một wrapper `<>...</>` rỗng:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

Nếu có nhiều HTML cần chuyển sang JSX, bạn có thể sử dụng [trình chuyển đổi trực tuyến.](https://transform.tools/html-to-jsx)

## Thêm style {/*adding-styles*/}

Trong React, bạn chỉ định một class CSS bằng `className`. Nó hoạt động giống như thuộc tính [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) của HTML:

```js
<img className="avatar" />
```

Sau đó, bạn viết các quy tắc CSS cho class đó trong một file CSS riêng:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React không quy định cách bạn thêm các file CSS. Trong trường hợp đơn giản nhất, bạn sẽ thêm một tag [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) vào HTML. Nếu sử dụng build tool hoặc framework, hãy tham khảo tài liệu của công cụ đó để biết cách thêm file CSS vào dự án.

## Hiển thị dữ liệu {/*displaying-data*/}

JSX cho phép bạn đưa markup vào JavaScript. Dấu ngoặc nhọn cho phép bạn “thoát trở lại” JavaScript để nhúng một biến trong code và hiển thị biến đó cho người dùng. Ví dụ, đoạn này sẽ hiển thị `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Bạn cũng có thể “thoát vào JavaScript” từ các thuộc tính JSX, nhưng phải sử dụng dấu ngoặc nhọn *thay vì* dấu ngoặc kép. Ví dụ, `className="avatar"` truyền chuỗi `"avatar"` làm class CSS, còn `src={user.imageUrl}` đọc giá trị của biến JavaScript `user.imageUrl`, rồi truyền giá trị đó làm thuộc tính `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Bạn cũng có thể đặt các biểu thức phức tạp hơn bên trong dấu ngoặc nhọn JSX, chẳng hạn như [phép nối chuỗi](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

Trong ví dụ trên, `style={{}}` không phải cú pháp đặc biệt mà là một object `{}` thông thường bên trong dấu ngoặc nhọn JSX của `style={ }`. Bạn có thể sử dụng thuộc tính `style` khi style của bạn phụ thuộc vào các biến JavaScript.

## Render có điều kiện {/*conditional-rendering*/}

Trong React không có cú pháp đặc biệt để viết điều kiện. Thay vào đó, bạn sẽ sử dụng các kỹ thuật giống như khi viết code JavaScript thông thường. Ví dụ, bạn có thể sử dụng câu lệnh [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) để đưa JSX vào một cách có điều kiện:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Nếu muốn code ngắn gọn hơn, bạn có thể sử dụng [toán tử `?` có điều kiện.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) Không giống như `if`, toán tử này hoạt động bên trong JSX:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Khi không cần nhánh `else`, bạn cũng có thể sử dụng cú pháp [`&&` logic](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation) ngắn hơn:

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Tất cả các cách tiếp cận này cũng có thể được sử dụng để chỉ định thuộc tính theo điều kiện. Nếu chưa quen với một số cú pháp JavaScript này, bạn có thể bắt đầu bằng cách luôn sử dụng `if...else`.

## Render danh sách {/*rendering-lists*/}

Bạn sẽ dựa vào các tính năng JavaScript như [vòng lặp `for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) và hàm [array `map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) để render danh sách các component.

Ví dụ, giả sử bạn có một array sản phẩm:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

Bên trong component, hãy sử dụng hàm `map()` để chuyển một array sản phẩm thành một array các item `<li>`:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Hãy chú ý rằng `<li>` có thuộc tính `key`. Với mỗi item trong danh sách, bạn nên truyền một chuỗi hoặc một số xác định duy nhất item đó giữa các phần tử cùng cấp. Thông thường, key nên lấy từ dữ liệu của bạn, chẳng hạn như ID trong database. React sử dụng các key của bạn để biết điều gì đã xảy ra nếu sau đó bạn chèn, xóa hoặc sắp xếp lại các item.

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Phản hồi sự kiện {/*responding-to-events*/}

Bạn có thể phản hồi các sự kiện bằng cách khai báo các hàm *event handler* bên trong component:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

Hãy chú ý rằng `onClick={handleClick}` không có dấu ngoặc đơn ở cuối! Đừng _gọi_ hàm event handler; bạn chỉ cần *truyền nó xuống*. React sẽ gọi event handler của bạn khi người dùng click button.

## Cập nhật màn hình {/*updating-the-screen*/}

Thông thường, bạn sẽ muốn component của mình “ghi nhớ” một số thông tin và hiển thị thông tin đó. Ví dụ, có thể bạn muốn đếm số lần một button được click. Để làm việc này, hãy thêm *state* vào component.

Trước tiên, import [`useState`](/reference/react/useState) từ React:

```js
import { useState } from 'react';
```

Bây giờ bạn có thể khai báo một *biến state* bên trong component:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

Bạn sẽ nhận được hai thứ từ `useState`: state hiện tại (`count`) và hàm cho phép bạn cập nhật state (`setCount`). Bạn có thể đặt cho chúng bất kỳ tên nào, nhưng quy ước là viết `[something, setSomething]`.

Lần đầu tiên button được hiển thị, `count` sẽ là `0` vì bạn đã truyền `0` vào `useState()`. Khi muốn thay đổi state, hãy gọi `setCount()` và truyền giá trị mới vào đó. Click button này sẽ tăng counter:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React sẽ gọi lại hàm component của bạn. Lần này, `count` sẽ là `1`. Sau đó sẽ là `2`. Và cứ tiếp tục như vậy.

Nếu render cùng một component nhiều lần, mỗi component sẽ có state riêng. Hãy click từng button riêng biệt:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Hãy chú ý rằng mỗi button đều “ghi nhớ” state `count` riêng của mình và không ảnh hưởng đến các button khác.

## Sử dụng Hooks {/*using-hooks*/}

Các hàm bắt đầu bằng `use` được gọi là *Hooks*. `useState` là một Hook tích hợp sẵn do React cung cấp. Bạn có thể tìm thấy các Hook tích hợp sẵn khác trong [tài liệu tham khảo API.](/reference/react) Bạn cũng có thể tự viết Hook bằng cách kết hợp các Hook hiện có.

Hooks có nhiều hạn chế hơn các hàm khác. Bạn chỉ có thể gọi Hooks *ở cấp cao nhất* bên trong component (hoặc các Hook khác). Nếu muốn sử dụng `useState` trong một điều kiện hoặc vòng lặp, hãy tách thành một component mới và đặt nó ở đó.

## Chia sẻ dữ liệu giữa các component {/*sharing-data-between-components*/}

Trong ví dụ trước, mỗi `MyButton` có `count` độc lập riêng, và khi click từng button, chỉ `count` của button được click thay đổi:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

Ban đầu, state `count` của mỗi `MyButton` là `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

`MyButton` đầu tiên cập nhật `count` của nó thành `1`

</Diagram>

</DiagramGroup>

Tuy nhiên, thường bạn sẽ cần các component *chia sẻ dữ liệu và luôn cập nhật cùng nhau*.Để cả hai component `MyButton` hiển thị cùng một `count` và cập nhật cùng nhau, bạn cần chuyển state từ các button riêng lẻ “lên trên” đến component gần nhất chứa tất cả chúng.

Trong ví dụ này, đó là `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

Ban đầu, state `count` của `MyApp` là `0` và được truyền xuống cả hai component con

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

Khi được click, `MyApp` cập nhật state `count` của nó thành `1` rồi truyền state đó xuống cả hai component con

</Diagram>

</DiagramGroup>

Giờ đây, khi bạn click vào một trong hai button, `count` trong `MyApp` sẽ thay đổi, kéo theo cả hai giá trị đếm trong `MyButton` cùng thay đổi. Sau đây là cách bạn biểu diễn điều này trong code.

Trước tiên, *đưa state lên trên* từ `MyButton` vào `MyApp`:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}

```

Sau đó, *truyền state xuống* từ `MyApp` đến từng `MyButton`, cùng với click handler dùng chung. Bạn có thể truyền thông tin đến `MyButton` bằng dấu ngoặc nhọn JSX, giống như cách bạn đã làm trước đó với các tag tích hợp sẵn như `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Thông tin bạn truyền xuống theo cách này được gọi là _props_. Giờ đây, component `MyApp` chứa state `count` và event handler `handleClick`, đồng thời *truyền cả hai xuống dưới dạng props* cho từng button.

Cuối cùng, thay đổi `MyButton` để *đọc* các props bạn đã truyền từ component cha:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

Khi bạn click vào button, handler `onClick` sẽ được kích hoạt. Prop `onClick` của mỗi button được gán cho function `handleClick` bên trong `MyApp`, nên code bên trong function đó sẽ chạy. Code này gọi `setCount(count + 1)`, làm tăng biến state `count`. Giá trị `count` mới được truyền dưới dạng prop cho mỗi button, nên tất cả chúng đều hiển thị giá trị mới. Đây được gọi là “đưa state lên trên” (lifting state up). Bằng cách đưa state lên trên, bạn đã chia sẻ state đó giữa các component.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Các bước tiếp theo {/*next-steps*/}

Đến đây, bạn đã biết những kiến thức cơ bản về cách viết code React!

Hãy xem [Tutorial](/learn/tutorial-tic-tac-toe) để thực hành và xây dựng mini-app đầu tiên của bạn với React.