---
title: JavaScript trong JSX với dấu ngoặc nhọn
---

<Intro>

JSX cho phép bạn viết markup giống HTML bên trong một tệp JavaScript, giữ logic render và nội dung ở cùng một nơi. Đôi khi bạn sẽ muốn thêm một chút logic JavaScript hoặc tham chiếu đến một thuộc tính động bên trong markup đó. Trong trường hợp này, bạn có thể sử dụng dấu ngoặc nhọn trong JSX để mở một cửa sổ đến JavaScript.

</Intro>

<YouWillLearn>

* Cách truyền các chuỗi có dấu ngoặc kép
* Cách tham chiếu một biến JavaScript bên trong JSX bằng dấu ngoặc nhọn
* Cách gọi một hàm JavaScript bên trong JSX bằng dấu ngoặc nhọn
* Cách sử dụng một đối tượng JavaScript bên trong JSX bằng dấu ngoặc nhọn

</YouWillLearn>

## Truyền chuỗi bằng dấu ngoặc kép {/*passing-strings-with-quotes*/}

Khi muốn truyền một thuộc tính chuỗi vào JSX, bạn đặt chuỗi đó trong dấu ngoặc đơn hoặc dấu ngoặc kép:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Ở đây, `"https://react.dev/images/docs/scientists/7vQD0fPs.jpg"` và `"Gregorio Y. Zara"` được truyền dưới dạng chuỗi.

Nhưng nếu bạn muốn chỉ định động văn bản `src` hoặc `alt` thì sao? Bạn có thể **sử dụng một giá trị từ JavaScript bằng cách thay `"` và `"` bằng `{` và `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://react.dev/images/docs/scientists/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Hãy chú ý sự khác biệt giữa `className="avatar"`, chỉ định một tên class CSS `"avatar"` giúp hình ảnh có dạng tròn, và `src={avatar}`, đọc giá trị của biến JavaScript có tên `avatar`. Đó là vì dấu ngoặc nhọn cho phép bạn làm việc với JavaScript ngay trong markup!

## Sử dụng dấu ngoặc nhọn: Cửa sổ dẫn vào thế giới JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX là một cách đặc biệt để viết JavaScript. Điều đó có nghĩa là bạn có thể sử dụng JavaScript bên trong JSX—bằng dấu ngoặc nhọn `{ }`. Ví dụ dưới đây trước tiên khai báo tên của nhà khoa học là `name`, sau đó nhúng tên này bằng dấu ngoặc nhọn vào bên trong `<h1>`:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

Hãy thử thay đổi giá trị của `name` từ `'Gregorio Y. Zara'` thành `'Hedy Lamarr'`. Bạn có thấy tiêu đề danh sách thay đổi không?

Bất kỳ biểu thức JavaScript nào cũng hoạt động bên trong dấu ngoặc nhọn, bao gồm cả các lần gọi hàm như `formatDate()`:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Nơi sử dụng dấu ngoặc nhọn {/*where-to-use-curly-braces*/}

Bạn chỉ có thể sử dụng dấu ngoặc nhọn trong JSX theo hai cách:

1. **Dưới dạng văn bản** ngay bên trong một thẻ JSX: `<h1>{name}'s To Do List</h1>` hoạt động, nhưng `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` thì không.
2. **Dưới dạng thuộc tính** ngay sau dấu `=`: `src={avatar}` sẽ đọc biến `avatar`, nhưng `src="{avatar}"` sẽ truyền chuỗi `"{avatar}"`.

## Sử dụng “hai dấu ngoặc nhọn”: CSS và các đối tượng khác trong JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Ngoài chuỗi, số và các biểu thức JavaScript khác, bạn thậm chí có thể truyền các đối tượng trong JSX. Các đối tượng cũng được biểu diễn bằng dấu ngoặc nhọn, chẳng hạn như `{ name: "Hedy Lamarr", inventions: 5 }`. Vì vậy, để truyền một đối tượng JS trong JSX, bạn phải bọc đối tượng đó trong một cặp dấu ngoặc nhọn khác: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Bạn có thể thấy cách này được sử dụng với các style CSS inline trong JSX. React không yêu cầu bạn phải sử dụng style inline (class CSS hoạt động rất tốt trong hầu hết trường hợp). Nhưng khi cần một style inline, bạn truyền một đối tượng vào thuộc tính `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Hãy thử thay đổi các giá trị của `backgroundColor` và `color`.

Bạn có thể thấy rõ đối tượng JavaScript bên trong dấu ngoặc nhọn khi viết như sau:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

Lần tới khi thấy `{{` và `}}` trong JSX, hãy nhớ rằng chúng không gì khác ngoài một đối tượng bên trong dấu ngoặc nhọn của JSX!

<Pitfall>

Các thuộc tính `style` inline được viết theo kiểu camelCase. Ví dụ, HTML `<ul style="background-color: black">` sẽ được viết là `<ul style={{ backgroundColor: 'black' }}>` trong component của bạn.

</Pitfall>

## Thao tác thú vị hơn với các đối tượng JavaScript và dấu ngoặc nhọn {/*more-fun-with-javascript-objects-and-curly-braces*/}

Bạn có thể đưa nhiều biểu thức vào một đối tượng và tham chiếu chúng trong JSX bên trong dấu ngoặc nhọn:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Trong ví dụ này, đối tượng JavaScript `person` chứa một chuỗi `name` và một đối tượng `theme`:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Component có thể sử dụng các giá trị này từ `person` như sau:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX là một ngôn ngữ tạo template rất tối giản vì nó cho phép bạn tổ chức dữ liệu và logic bằng JavaScript.

<Recap>

Bây giờ bạn đã biết gần như mọi điều về JSX:

* Các thuộc tính JSX bên trong dấu ngoặc kép được truyền dưới dạng chuỗi.
* Dấu ngoặc nhọn cho phép bạn đưa logic và các biến JavaScript vào markup.
* Chúng hoạt động bên trong nội dung của thẻ JSX hoặc ngay sau `=` trong các thuộc tính.
* `{{` và `}}` không phải cú pháp đặc biệt: đó là một đối tượng JavaScript được đặt bên trong dấu ngoặc nhọn của JSX.

</Recap>

<Challenges>

#### Sửa lỗi {/*fix-the-mistake*/}

Đoạn code này gặp lỗi với thông báo `Objects are not valid as a React child`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Bạn có thể tìm ra vấn đề không?

<Hint>Hãy xem bên trong dấu ngoặc nhọn có gì. Chúng ta có đang đặt đúng thứ cần đặt vào đó không?</Hint>

<Solution>

Điều này xảy ra vì ví dụ này render *chính một đối tượng* vào markup thay vì một chuỗi: `<h1>{person}'s Todos</h1>` đang cố render toàn bộ đối tượng `person`! Việc đưa các đối tượng thô vào nội dung văn bản sẽ gây ra lỗi vì React không biết bạn muốn hiển thị chúng như thế nào.

Để sửa lỗi, hãy thay `<h1>{person}'s Todos</h1>` bằng `<h1>{person.name}'s Todos</h1>`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Trích xuất thông tin vào một đối tượng {/*extract-information-into-an-object*/}

Hãy trích xuất URL hình ảnh vào đối tượng `person`.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Di chuyển URL hình ảnh vào một thuộc tính có tên `person.imageUrl` và đọc thuộc tính đó từ thẻ `<img>` bằng dấu ngoặc nhọn:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://react.dev/images/docs/scientists/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Viết một biểu thức bên trong dấu ngoặc nhọn của JSX {/*write-an-expression-inside-jsx-curly-braces*/}

Trong đối tượng bên dưới, URL hình ảnh đầy đủ được chia thành bốn phần: URL cơ sở, `imageId`, `imageSize` và phần mở rộng tệp.

Chúng ta muốn URL hình ảnh kết hợp các thuộc tính này lại: URL cơ sở (luôn là `'https://react.dev/images/docs/scientists/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`) và phần mở rộng tệp (luôn là `'.jpg'`). Tuy nhiên, có điều gì đó không đúng trong cách thẻ `<img>` chỉ định `src` của nó.

Bạn có thể sửa lỗi không?

<Sandpack>

```js

const baseUrl = 'https://react.dev/images/docs/scientists/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Để kiểm tra xem bản sửa lỗi có hoạt động không, hãy thử thay đổi giá trị của `imageSize` thành `'b'`. Hình ảnh sẽ thay đổi kích thước sau khi bạn chỉnh sửa.

<Solution>

Bạn có thể viết như sau: `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` mở biểu thức JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` tạo ra chuỗi URL chính xác
3. `}` đóng biểu thức JavaScript

<Sandpack>

```js
const baseUrl = 'https://react.dev/images/docs/scientists/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Bạn cũng có thể chuyển biểu thức này vào một hàm riêng như `getImageUrl` bên dưới:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Các biến và hàm có thể giúp bạn giữ cho markup đơn giản!

</Solution>

</Challenges>