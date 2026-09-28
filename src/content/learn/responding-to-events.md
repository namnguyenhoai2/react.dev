---
title: Phản hồi sự kiện
---

<Intro>

React cho phép bạn thêm *event handler* vào JSX. Event handler là các hàm do bạn tự định nghĩa và sẽ được kích hoạt để phản hồi những tương tác như nhấp chuột, di chuột, đặt tiêu điểm vào các input của biểu mẫu, v.v.

</Intro>

<YouWillLearn>

* Các cách khác nhau để viết event handler
* Cách truyền logic xử lý sự kiện từ component cha
* Cách các sự kiện lan truyền và cách ngăn chúng

</YouWillLearn>

## Thêm event handler {/*adding-event-handlers*/}

Để thêm một event handler, trước tiên bạn sẽ định nghĩa một hàm, sau đó [truyền nó dưới dạng prop](/learn/passing-props-to-a-component) vào thẻ JSX phù hợp. Ví dụ: sau đây là một nút hiện chưa thực hiện điều gì:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

Bạn có thể khiến nút hiển thị một thông báo khi người dùng nhấp vào bằng cách thực hiện ba bước sau:

1. Khai báo một hàm có tên là `handleClick` *bên trong* component `Button`.
2. Cài đặt logic bên trong hàm đó (sử dụng `alert` để hiển thị thông báo).
3. Thêm `onClick={handleClick}` vào JSX `<button>`.

<Sandpack>

```js
export default function Button() {
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

```css
button { margin-right: 10px; }
```

</Sandpack>

Bạn đã định nghĩa hàm `handleClick`, sau đó [truyền nó dưới dạng prop](/learn/passing-props-to-a-component) cho `<button>`. `handleClick` là một **event handler**. Các hàm event handler:

* Thường được định nghĩa *bên trong* component của bạn.
* Có tên bắt đầu bằng `handle`, theo sau là tên của sự kiện.

Theo quy ước, event handler thường được đặt tên bằng `handle` theo sau là tên sự kiện. Bạn sẽ thường thấy `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, v.v.

Ngoài ra, bạn có thể định nghĩa một event handler trực tiếp trong JSX:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Hoặc ngắn gọn hơn bằng cách sử dụng arrow function:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

Tất cả các cách viết này đều tương đương. Event handler viết trực tiếp rất tiện lợi đối với các hàm ngắn.

<Pitfall>

Các hàm được truyền vào event handler phải được truyền vào, không được gọi. Ví dụ:

| truyền một hàm (đúng)     | gọi một hàm (sai)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Sự khác biệt này khá tinh tế. Trong ví dụ đầu tiên, hàm `handleClick` được truyền vào dưới dạng event handler `onClick`. Điều này cho React biết cần ghi nhớ hàm đó và chỉ gọi hàm của bạn khi người dùng nhấp vào nút.

Trong ví dụ thứ hai, `()` ở cuối `handleClick()` sẽ kích hoạt hàm *ngay lập tức* trong quá trình [rendering](/learn/render-and-commit), mà không cần bất kỳ lần nhấp nào. Điều này xảy ra vì JavaScript bên trong [JSX `{` và `}`](/learn/javascript-in-jsx-with-curly-braces) được thực thi ngay lập tức.

Khi viết code trực tiếp, bạn cũng có thể gặp vấn đề tương tự theo một cách khác:

| truyền một hàm (đúng)            | gọi một hàm (sai)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

Việc truyền code trực tiếp như thế này sẽ không chỉ chạy khi nhấp chuột—nó chạy mỗi khi component render:

```jsx
// This alert fires when the component renders, not when clicked!
<button onClick={alert('You clicked me!')}>
```

Nếu muốn định nghĩa event handler trực tiếp, hãy bọc nó trong một hàm ẩn danh như sau:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Thay vì thực thi code bên trong ở mỗi lần render, cách này tạo ra một hàm để được gọi sau.

Trong cả hai trường hợp, thứ bạn muốn truyền vào là một hàm:

* `<button onClick={handleClick}>` truyền hàm `handleClick`.
* `<button onClick={() => alert('...')}>` truyền hàm `() => alert('...')`.

[Đọc thêm về arrow function.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### Đọc props trong event handler {/*reading-props-in-event-handlers*/}

Vì event handler được khai báo bên trong một component nên chúng có quyền truy cập vào props của component đó. Sau đây là một nút sẽ hiển thị alert chứa prop `message` của nó khi được nhấp vào:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Điều này cho phép hai nút hiển thị các thông báo khác nhau. Hãy thử thay đổi các thông báo được truyền vào chúng.

### Truyền event handler dưới dạng props {/*passing-event-handlers-as-props*/}

Thông thường, bạn sẽ muốn component cha chỉ định event handler của component con. Hãy xem xét các nút: tùy thuộc vào nơi bạn sử dụng component `Button`, bạn có thể muốn thực thi một hàm khác nhau—chẳng hạn một hàm phát phim và một hàm khác tải hình ảnh lên.

Để thực hiện điều này, hãy truyền một prop mà component nhận từ component cha làm event handler, như sau:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Ở đây, component `Toolbar` render một `PlayButton` và một `UploadButton`:

- `PlayButton` truyền `handlePlayClick` dưới dạng prop `onClick` cho `Button` bên trong.
- `UploadButton` truyền `() => alert('Uploading!')` dưới dạng prop `onClick` cho `Button` bên trong.

Cuối cùng, component `Button` của bạn nhận một prop có tên `onClick`. Nó truyền trực tiếp prop đó vào `<button>` tích hợp sẵn của trình duyệt cùng với `onClick={onClick}`. Điều này cho React biết cần gọi hàm được truyền vào khi nhấp chuột.

Nếu sử dụng một [design system](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), các component như button thường chứa phần styling nhưng không chỉ định behavior. Thay vào đó, các component như `PlayButton` và `UploadButton` sẽ truyền event handler xuống.

### Đặt tên cho các prop event handler {/*naming-event-handler-props*/}

Các component tích hợp sẵn như `<button>` và `<div>` chỉ hỗ trợ các [tên sự kiện của trình duyệt](/reference/react-dom/components/common#common-props) như `onClick`. Tuy nhiên, khi xây dựng component của riêng mình, bạn có thể đặt tên cho các prop event handler theo bất kỳ cách nào.

Theo quy ước, tên prop event handler nên bắt đầu bằng `on`, theo sau là một chữ cái viết hoa.

Ví dụ: prop `onClick` của component `Button` có thể được đặt tên là `onSmash`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Trong ví dụ này, `<button onClick={onSmash}>` cho thấy browser `<button>` (chữ thường) vẫn cần một prop có tên `onClick`, nhưng tên prop mà component tùy chỉnh `Button` của bạn nhận là do bạn quyết định!

Khi component hỗ trợ nhiều tương tác, bạn có thể đặt tên cho các prop event handler theo các khái niệm riêng của ứng dụng. Ví dụ: component `Toolbar` này nhận các event handler `onPlayMovie` và `onUploadImage`:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Lưu ý rằng component `App` không cần biết `Toolbar` sẽ làm gì với `onPlayMovie` hoặc `onUploadImage`. Đó là chi tiết triển khai của `Toolbar`. Ở đây, `Toolbar` truyền chúng xuống dưới dạng handler `onClick` cho các `Button`s của nó, nhưng sau này cũng có thể kích hoạt chúng bằng phím tắt. Đặt tên prop theo các tương tác riêng của ứng dụng như `onPlayMovie` mang lại cho bạn sự linh hoạt để thay đổi cách sử dụng chúng sau này.

<Note>

Hãy đảm bảo sử dụng các thẻ HTML phù hợp cho event handler. Ví dụ: để xử lý thao tác nhấp chuột, hãy sử dụng [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) thay vì `<div onClick={handleClick}>`. Việc sử dụng `<button>` thực sự của trình duyệt sẽ bật các behavior tích hợp sẵn của trình duyệt, chẳng hạn như điều hướng bằng bàn phím. Nếu không thích styling mặc định của trình duyệt đối với button và muốn làm cho nó trông giống một liên kết hoặc một phần tử UI khác hơn, bạn có thể thực hiện điều đó bằng CSS. [Tìm hiểu thêm về cách viết markup có khả năng truy cập.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

</Note>

## Lan truyền sự kiện {/*event-propagation*/}

Event handler cũng sẽ bắt các sự kiện từ bất kỳ component con nào mà component của bạn có thể chứa. Ta nói rằng một sự kiện “bubble” hoặc “lan truyền” lên trên cây: nó bắt đầu tại nơi sự kiện xảy ra, sau đó đi lên cây.

`<div>` này chứa hai nút. Cả `<div>` *và* mỗi nút đều có các handler `onClick` riêng. Bạn nghĩ handler nào sẽ được kích hoạt khi nhấp vào một nút?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Nếu nhấp vào một trong hai nút, `onClick` của nó sẽ chạy trước, tiếp theo là `onClick` của `<div>` cha. Vì vậy, hai thông báo sẽ xuất hiện. Nếu nhấp vào chính toolbar, chỉ `onClick` của `<div>` cha mới chạy.

<Pitfall>

Tất cả sự kiện đều lan truyền trong React, ngoại trừ `onScroll`, vốn chỉ hoạt động trên thẻ JSX mà bạn gắn nó vào.

</Pitfall>

### Ngăn lan truyền {/*stopping-propagation*/}

Các trình xử lý sự kiện nhận một **đối tượng sự kiện** làm đối số duy nhất. Theo quy ước, đối tượng này thường được gọi là `e`, viết tắt của “event”. Bạn có thể sử dụng đối tượng này để đọc thông tin về sự kiện.

Đối tượng sự kiện đó cũng cho phép bạn dừng việc lan truyền sự kiện. Nếu muốn ngăn một sự kiện đến được các component cha, bạn cần gọi `e.stopPropagation()` như component `Button` này:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Khi bạn nhấp vào một nút:

1. React gọi trình xử lý `onClick` được truyền vào `<button>`.
2. Trình xử lý đó, được định nghĩa trong `Button`, thực hiện những việc sau:
   * Gọi `e.stopPropagation()`, ngăn sự kiện tiếp tục lan truyền.
   * Gọi hàm `onClick`, là một prop được truyền từ component `Toolbar`.
3. Hàm đó, được định nghĩa trong component `Toolbar`, hiển thị alert riêng của nút.
4. Vì việc lan truyền đã bị dừng, trình xử lý `onClick` của `<div>` cha *không* được chạy.

Do `e.stopPropagation()`, khi nhấp vào các nút, giờ đây chỉ hiển thị một alert duy nhất (từ `<button>`) thay vì hai alert (từ `<button>` và toolbar `<div>` cha). Nhấp vào một nút không giống với nhấp vào toolbar bao quanh nó, vì vậy việc dừng lan truyền là hợp lý đối với UI này.

<DeepDive>

#### Sự kiện trong giai đoạn capture {/*capture-phase-events*/}

Trong một số trường hợp hiếm gặp, bạn có thể cần bắt tất cả sự kiện trên các phần tử con, *ngay cả khi chúng đã dừng việc lan truyền*. Ví dụ, bạn có thể muốn ghi lại mọi lần nhấp vào analytics, bất kể logic lan truyền là gì. Bạn có thể làm điều này bằng cách thêm `Capture` vào cuối tên sự kiện:

```js
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Mỗi sự kiện lan truyền qua ba giai đoạn:

1. Sự kiện di chuyển xuống dưới, gọi tất cả trình xử lý `onClickCapture`.
2. Sự kiện chạy trình xử lý `onClick` của phần tử được nhấp.
3. Sự kiện di chuyển ngược lên trên, gọi tất cả trình xử lý `onClick`.

Các sự kiện capture hữu ích cho những đoạn code như router hoặc analytics, nhưng có lẽ bạn sẽ không sử dụng chúng trong code ứng dụng.

</DeepDive>

### Truyền các trình xử lý như một lựa chọn thay thế cho việc lan truyền {/*passing-handlers-as-alternative-to-propagation*/}

Hãy chú ý cách trình xử lý click này chạy một dòng code _sau đó_ gọi prop `onClick` được component cha truyền vào:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Bạn cũng có thể thêm nhiều code hơn vào trình xử lý này trước khi gọi trình xử lý sự kiện `onClick` của component cha. Mẫu này cung cấp một *lựa chọn thay thế* cho việc lan truyền. Nó cho phép component con xử lý sự kiện, đồng thời cho phép component cha chỉ định một số hành vi bổ sung. Không giống như việc lan truyền, cách này không tự động xảy ra. Tuy nhiên, lợi ích của mẫu này là bạn có thể theo dõi rõ ràng toàn bộ chuỗi code được thực thi do một sự kiện nào đó.

Nếu bạn dựa vào việc lan truyền và gặp khó khăn khi truy vết những trình xử lý nào được thực thi cũng như lý do, hãy thử cách tiếp cận này.

### Ngăn hành vi mặc định {/*preventing-default-behavior*/}

Một số sự kiện trình duyệt có hành vi mặc định đi kèm. Ví dụ, sự kiện submit của `<form>`, xảy ra khi một nút bên trong nó được nhấp, theo mặc định sẽ tải lại toàn bộ trang:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Bạn có thể gọi `e.preventDefault()` trên đối tượng sự kiện để ngăn điều này xảy ra:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Đừng nhầm lẫn giữa `e.stopPropagation()` và `e.preventDefault()`. Cả hai đều hữu ích, nhưng không liên quan đến nhau:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) ngăn các trình xử lý sự kiện được gắn vào những tag bên trên được kích hoạt.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) ngăn hành vi mặc định của trình duyệt đối với một số ít sự kiện có hành vi này.

## Trình xử lý sự kiện có thể có side effect không? {/*can-event-handlers-have-side-effects*/}

Chắc chắn là có! Trình xử lý sự kiện là nơi phù hợp nhất cho các side effect.

Không giống các hàm render, trình xử lý sự kiện không cần phải [pure](/learn/keeping-components-pure), vì vậy đây là nơi tuyệt vời để *thay đổi* một thứ gì đó—ví dụ, thay đổi giá trị của input khi người dùng nhập, hoặc thay đổi một danh sách khi nhấn nút. Tuy nhiên, để thay đổi một thông tin nào đó, trước tiên bạn cần có cách lưu trữ thông tin đó. Trong React, việc này được thực hiện bằng cách sử dụng [state, bộ nhớ của component.](/learn/state-a-components-memory) Bạn sẽ tìm hiểu tất cả về vấn đề này ở trang tiếp theo.

<Recap>

* Bạn có thể xử lý sự kiện bằng cách truyền một hàm làm prop cho một phần tử như `<button>`.
* Trình xử lý sự kiện phải được truyền vào, **không được gọi!** `onClick={handleClick}`, không phải `onClick={handleClick()}`.
* Bạn có thể định nghĩa riêng hàm trình xử lý sự kiện hoặc định nghĩa trực tiếp trong dòng.
* Trình xử lý sự kiện được định nghĩa bên trong một component, vì vậy chúng có thể truy cập các prop.
* Bạn có thể khai báo một trình xử lý sự kiện trong component cha rồi truyền nó làm prop cho component con.
* Bạn có thể tự định nghĩa các prop trình xử lý sự kiện với tên dành riêng cho ứng dụng.
* Các sự kiện lan truyền lên trên. Gọi `e.stopPropagation()` trên đối số đầu tiên để ngăn việc đó.
* Các sự kiện có thể có hành vi mặc định không mong muốn của trình duyệt. Gọi `e.preventDefault()` để ngăn hành vi đó.
* Gọi rõ ràng một prop trình xử lý sự kiện từ trình xử lý của component con là một lựa chọn thay thế tốt cho việc lan truyền.

</Recap>



<Challenges>

#### Sửa một trình xử lý sự kiện {/*fix-an-event-handler*/}

Khi nhấp vào nút này, nền trang được cho là sẽ chuyển đổi giữa màu trắng và màu đen. Tuy nhiên, không có gì xảy ra khi bạn nhấp vào nút. Hãy sửa vấn đề này. (Đừng lo về logic bên trong `handleClick`—phần đó đã đúng.)

<Sandpack>

```js {expectedErrors: {'react-compiler': [5, 7]}}
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

Vấn đề là `<button onClick={handleClick()}>` _gọi_ hàm `handleClick` trong khi render thay vì _truyền_ hàm đó. Xóa lệnh gọi `()` để nó trở thành `<button onClick={handleClick}>` sẽ sửa được vấn đề:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

Ngoài ra, bạn có thể bọc lệnh gọi đó trong một hàm khác, chẳng hạn như `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Kết nối các sự kiện {/*wire-up-the-events*/}

Component `ColorSwitch` này render một nút. Nút này được cho là sẽ thay đổi màu của trang. Hãy kết nối nó với prop trình xử lý sự kiện `onChangeColor` mà nó nhận từ component cha để khi nhấp vào nút, màu sắc sẽ thay đổi.

Sau khi làm xong, hãy chú ý rằng khi nhấp vào nút, bộ đếm số lần nhấp vào trang cũng tăng lên. Đồng nghiệp viết component cha khẳng định rằng `onChangeColor` không tăng bất kỳ bộ đếm nào. Có thể còn điều gì khác đang xảy ra? Hãy sửa để khi nhấp vào nút, nó *chỉ* thay đổi màu sắc và _không_ tăng bộ đếm.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

Trước tiên, bạn cần thêm trình xử lý sự kiện, chẳng hạn như `<button onClick={onChangeColor}>`.

Tuy nhiên, việc này dẫn đến vấn đề bộ đếm tăng. Nếu `onChangeColor` không thực hiện việc đó, như đồng nghiệp của bạn khẳng định, thì vấn đề là sự kiện này lan truyền lên trên và một trình xử lý nào đó ở phía trên thực hiện việc đó. Để giải quyết vấn đề, bạn cần dừng việc lan truyền. Nhưng đừng quên rằng bạn vẫn phải gọi `onChangeColor`.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>