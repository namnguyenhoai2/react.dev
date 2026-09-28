---
title: Cập nhật object trong state
---

<Intro>

State có thể chứa bất kỳ kiểu giá trị JavaScript nào, bao gồm cả object. Tuy nhiên, bạn không nên trực tiếp thay đổi các object được lưu trong React state. Thay vào đó, khi muốn cập nhật một object, bạn cần tạo một object mới (hoặc tạo bản sao của object hiện có), rồi đặt state sử dụng bản sao đó.

</Intro>

<YouWillLearn>

- Cách cập nhật đúng một object trong React state
- Cách cập nhật object lồng nhau mà không mutate object đó
- Immutability là gì và cách không phá vỡ nó
- Cách giảm việc sao chép object lặp đi lặp lại bằng Immer

</YouWillLearn>

## Mutation là gì? {/*whats-a-mutation*/}

Bạn có thể lưu bất kỳ kiểu giá trị JavaScript nào trong state.

```js
const [x, setX] = useState(0);
```

Cho đến giờ, bạn đã làm việc với number, string và boolean. Những kiểu giá trị JavaScript này là “immutable”, nghĩa là không thể thay đổi hoặc “chỉ đọc”. Bạn có thể kích hoạt một lần re-render để _thay thế_ một giá trị:

```js
setX(5);
```

State `x` đã thay đổi từ `0` thành `5`, nhưng _chính `0` kiểu number_ không thay đổi. Trong JavaScript, bạn không thể thay đổi các giá trị primitive dựng sẵn như number, string và boolean.

Bây giờ hãy xem xét một object trong state:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Về mặt kỹ thuật, bạn có thể thay đổi nội dung của _chính object đó_. **Điều này được gọi là mutation:**

```js
position.x = 5;
```

Tuy nhiên, mặc dù các object trong React state về mặt kỹ thuật có thể bị mutate, bạn vẫn nên xử lý chúng **như thể** chúng immutable—giống như number, boolean và string. Thay vì mutate chúng, bạn luôn nên thay thế chúng.

## Xem state là chỉ đọc {/*treat-state-as-read-only*/}

Nói cách khác, bạn nên **xem mọi object JavaScript được đưa vào state là chỉ đọc.**

Ví dụ này lưu một object trong state để biểu diễn vị trí con trỏ hiện tại. Chấm đỏ được cho là sẽ di chuyển khi bạn chạm hoặc di chuyển con trỏ qua vùng xem trước. Nhưng chấm đỏ vẫn ở vị trí ban đầu:

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Vấn đề nằm ở đoạn code này.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Đoạn code này sửa đổi object được gán cho `position` từ [lần render trước.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) Nhưng vì không sử dụng state setting function, React không biết object đó đã thay đổi. Vì vậy, React không làm gì để phản hồi. Điều này giống như cố gắng thay đổi món ăn sau khi bạn đã ăn xong. Mặc dù mutate state có thể hoạt động trong một số trường hợp, chúng tôi không khuyến nghị cách này. Bạn nên xem giá trị state mà mình truy cập được trong một lần render là chỉ đọc.

Để thực sự [kích hoạt một lần re-render](/learn/state-as-a-snapshot#setting-state-triggers-renders) trong trường hợp này, **hãy tạo một object *mới* và truyền nó cho state setting function:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

Với `setPosition`, bạn đang nói với React:

* Thay thế `position` bằng object mới này
* Và render component này một lần nữa

Hãy chú ý rằng chấm đỏ giờ đây đi theo con trỏ khi bạn chạm hoặc di chuyển con trỏ qua vùng xem trước:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Mutation cục bộ thì không sao {/*local-mutation-is-fine*/}

Code như thế này có vấn đề vì nó sửa đổi một object *hiện có* trong state:

```js
position.x = e.clientX;
position.y = e.clientY;
```

Nhưng code như thế này thì **hoàn toàn ổn** vì bạn đang mutate một object mới được *tạo ngay trước đó*:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

Thực ra, cách này hoàn toàn tương đương với việc viết:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Mutation chỉ là vấn đề khi bạn thay đổi các object *hiện có* vốn đã nằm trong state. Mutate một object mà bạn vừa tạo là hoàn toàn ổn vì *chưa có code nào khác tham chiếu đến nó.* Việc thay đổi object đó sẽ không vô tình ảnh hưởng đến thứ gì phụ thuộc vào nó. Đây được gọi là “mutation cục bộ”. Bạn thậm chí có thể thực hiện mutation cục bộ [trong khi render.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Rất tiện lợi và hoàn toàn ổn!

</DeepDive>

## Sao chép object bằng cú pháp spread {/*copying-objects-with-the-spread-syntax*/}

Trong ví dụ trước, object `position` luôn được tạo mới từ vị trí con trỏ hiện tại. Nhưng thường thì bạn sẽ muốn đưa *dữ liệu hiện có* vào object mới mà mình đang tạo. Ví dụ, bạn có thể muốn chỉ cập nhật *một* field trong form nhưng vẫn giữ nguyên các giá trị trước đó của mọi field khác.

Các input field này không hoạt động vì các handler `onChange` mutate state:

<Sandpack>

```js {expectedErrors: {'react-compiler': [11, 15, 19]}}
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Ví dụ, dòng này mutate state từ một lần render trước:

```js
person.firstName = e.target.value;
```

Cách đáng tin cậy để có được hành vi bạn muốn là tạo một object mới và truyền nó cho `setPerson`. Nhưng ở đây, bạn cũng muốn **sao chép dữ liệu hiện có vào đó** vì chỉ một field đã thay đổi:

```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email
});
```

Bạn có thể sử dụng cú pháp `...` [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) để không phải sao chép từng property riêng lẻ.

```js
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```

Bây giờ form đã hoạt động!

Hãy chú ý rằng bạn không khai báo một state variable riêng cho từng input field. Với các form lớn, việc nhóm toàn bộ dữ liệu trong một object rất tiện lợi—miễn là bạn cập nhật nó đúng cách!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Lưu ý rằng cú pháp spread của `...` là “shallow”—nó chỉ sao chép các giá trị sâu một level. Điều này giúp nó nhanh, nhưng cũng có nghĩa là nếu muốn cập nhật một property lồng nhau, bạn sẽ phải sử dụng nó nhiều hơn một lần.

<DeepDive>

#### Sử dụng một event handler cho nhiều field {/*using-a-single-event-handler-for-multiple-fields*/}

Bạn cũng có thể sử dụng dấu ngoặc `[` và `]` bên trong định nghĩa object để chỉ định một property có tên động. Đây là cùng ví dụ đó, nhưng sử dụng một event handler duy nhất thay vì ba handler khác nhau:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Ở đây, `e.target.name` tham chiếu đến property `name` được gán cho phần tử DOM `<input>`.

</DeepDive>

## Cập nhật object lồng nhau {/*updating-a-nested-object*/}

Hãy xem xét một cấu trúc object lồng nhau như sau:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  }
});
```

Nếu muốn cập nhật `person.artwork.city`, rõ ràng bạn có thể làm điều đó bằng mutation:

```js
person.artwork.city = 'New Delhi';
```

Nhưng trong React, bạn xử lý state như immutable! Để thay đổi `city`, trước tiên bạn cần tạo object `artwork` mới (được điền sẵn dữ liệu từ object trước đó), sau đó tạo object `person` mới trỏ đến `artwork` mới:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Hoặc viết thành một function call duy nhất:

```js
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});
```

Cách này hơi dài dòng, nhưng hoạt động tốt trong nhiều trường hợp:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### Object thực sự không lồng nhau {/*objects-are-not-really-nested*/}

Một object như thế này trông có vẻ “lồng nhau” trong code:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  }
};
```

Tuy nhiên, “lồng nhau” không phải là cách chính xác để hình dung cách object hoạt động. Khi code được thực thi, không có thứ gì gọi là object “lồng nhau”. Thực tế, bạn đang nhìn vào hai object khác nhau:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

Object `obj1` không “nằm bên trong” `obj2`. Ví dụ, `obj3` cũng có thể “trỏ” đến `obj1`:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

Nếu mutate `obj3.artwork.city`, điều đó sẽ ảnh hưởng đến cả `obj2.artwork.city` và `obj1.city`. Đó là vì `obj3.artwork`, `obj2.artwork`, và `obj1` là cùng một object. Điều này khó nhận ra khi bạn nghĩ về các object như những thứ “lồng nhau”. Thay vào đó, chúng là các object riêng biệt “trỏ” đến nhau thông qua các property.

</DeepDive>

### Viết logic cập nhật ngắn gọn với Immer {/*write-concise-update-logic-with-immer*/}

Nếu state của bạn lồng nhau nhiều cấp, bạn có thể cân nhắc [làm phẳng nó.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) Nhưng nếu không muốn thay đổi cấu trúc state, bạn có thể thích một shortcut thay cho các spread lồng nhau. [Immer](https://github.com/immerjs/use-immer) là một thư viện phổ biến cho phép bạn viết code bằng cú pháp tiện lợi nhưng có mutation, đồng thời tự xử lý việc tạo các bản sao cho bạn. Với Immer, code bạn viết trông như thể đang “phá vỡ quy tắc” và mutate một object:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Nhưng không giống mutation thông thường, cách này không ghi đè state trước đó!

<DeepDive>

#### Immer hoạt động như thế nào? {/*how-does-immer-work*/}

`draft` do Immer cung cấp là một kiểu object đặc biệt, được gọi là [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), có tác dụng “ghi lại” những gì bạn làm với nó. Đây là lý do bạn có thể tự do mutate nó tùy thích! Bên dưới, Immer xác định những phần nào của `draft` đã thay đổi và tạo ra một object hoàn toàn mới chứa các chỉnh sửa của bạn.

</DeepDive>

Để dùng thử Immer:

1. Chạy `npm install use-immer` để thêm Immer làm dependency
2. Sau đó thay `import { useState } from 'react'` bằng `import { useImmer } from 'use-immer'`

Dưới đây là ví dụ trên sau khi chuyển đổi sang Immer:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Hãy chú ý xem các event handler đã trở nên ngắn gọn hơn nhiều như thế nào. Bạn có thể tùy ý kết hợp `useState` và `useImmer` trong cùng một component. Immer là một cách tuyệt vời để giữ cho các update handler ngắn gọn, đặc biệt khi state của bạn có cấu trúc lồng nhau và việc sao chép các object dẫn đến code lặp lại.

<DeepDive>

#### Tại sao không khuyến nghị mutate state trong React? {/*why-is-mutating-state-not-recommended-in-react*/}

Có một vài lý do:

* **Debugging:** Nếu bạn sử dụng `console.log` và không mutate state, các log trước đây sẽ không bị ghi đè bởi những thay đổi state mới hơn. Nhờ đó, bạn có thể thấy rõ state đã thay đổi như thế nào giữa các lần render.
* **Optimizations:** Các [optimization strategies](/reference/react/memo) phổ biến của React dựa trên việc bỏ qua công việc nếu props hoặc state trước đó giống với props hoặc state tiếp theo. Nếu bạn không bao giờ mutate state, việc kiểm tra xem có thay đổi nào hay không sẽ rất nhanh. Nếu `prevObj === obj`, bạn có thể chắc chắn rằng không có gì bên trong nó có thể đã thay đổi.
* **New Features:** Các tính năng React mới mà chúng tôi đang xây dựng dựa vào việc state được [treated like a snapshot.](/learn/state-as-a-snapshot) Nếu bạn mutate các phiên bản state trước đó, điều đó có thể khiến bạn không sử dụng được những tính năng mới.
* **Requirement Changes:** Một số tính năng của ứng dụng, chẳng hạn như triển khai Undo/Redo, hiển thị lịch sử thay đổi hoặc cho phép người dùng khôi phục form về các giá trị trước đó, sẽ dễ thực hiện hơn khi không có gì bị mutate. Điều này là vì bạn có thể giữ các bản sao state trước đó trong bộ nhớ và tái sử dụng chúng khi thích hợp. Nếu bắt đầu bằng cách tiếp cận có mutation, những tính năng như vậy có thể khó bổ sung về sau.
* **Simpler Implementation:** Vì React không dựa vào mutation, nên không cần làm gì đặc biệt với các object của bạn. React không cần chiếm quyền kiểm soát các property của chúng, luôn bọc chúng trong Proxies hoặc thực hiện các công việc khác khi khởi tạo như nhiều giải pháp "reactive" vẫn làm. Đây cũng là lý do React cho phép bạn đặt bất kỳ object nào vào state--dù lớn đến đâu--mà không phát sinh thêm các vấn đề về hiệu năng hoặc tính đúng đắn.

Trong thực tế, bạn thường có thể "vẫn dùng được" việc mutate state trong React, nhưng chúng tôi đặc biệt khuyên bạn không nên làm vậy để có thể sử dụng các tính năng React mới được phát triển dựa trên cách tiếp cận này. Những người đóng góp trong tương lai và có lẽ cả chính bạn trong tương lai sẽ cảm ơn bạn!

</DeepDive>

<Recap>

* Hãy xem mọi state trong React là immutable.
* Khi lưu object trong state, việc mutate chúng sẽ không kích hoạt các lần render và sẽ thay đổi state trong các "snapshot" của những lần render trước.
* Thay vì mutate một object, hãy tạo một phiên bản *mới* của nó và kích hoạt re-render bằng cách set state thành phiên bản đó.
* Bạn có thể sử dụng `{...obj, something: 'newValue'}` object spread syntax để tạo các bản sao của object.
* Spread syntax là shallow: nó chỉ sao chép một cấp.
* Để cập nhật một object lồng nhau, bạn cần tạo các bản sao cho đến tận cấp trên cùng từ vị trí đang được cập nhật.
* Để giảm lượng code sao chép lặp lại, hãy sử dụng Immer.

</Recap>



<Challenges>

#### Sửa các state update không chính xác {/*fix-incorrect-state-updates*/}

Form này có một vài bug. Hãy nhấp vào button tăng score vài lần. Hãy chú ý rằng score không tăng. Sau đó chỉnh sửa tên, và chú ý rằng score đột nhiên "bắt kịp" các thay đổi của bạn. Cuối cùng, chỉnh sửa họ, và chú ý rằng score đã biến mất hoàn toàn.

Nhiệm vụ của bạn là sửa tất cả các bug này. Khi sửa, hãy giải thích tại sao từng bug xảy ra.

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Đây là phiên bản đã sửa cả hai bug:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Vấn đề với `handlePlusClick` là nó đã mutate object `player`. Do đó, React không biết rằng có lý do để re-render và không cập nhật score trên màn hình. Đây là lý do khi bạn chỉnh sửa tên, state được cập nhật, kích hoạt re-render và _đồng thời_ cập nhật score trên màn hình.

Vấn đề với `handleLastNameChange` là nó không sao chép các field `...player` hiện có vào object mới. Đây là lý do score bị mất sau khi bạn chỉnh sửa họ.

</Solution>

#### Tìm và sửa mutation {/*find-and-fix-the-mutation*/}

Có một box có thể kéo được trên nền tĩnh. Bạn có thể thay đổi màu của box bằng select input.

Nhưng có một bug. Nếu bạn di chuyển box trước, rồi thay đổi màu của nó, background (vốn không được phép di chuyển!) sẽ "nhảy" đến vị trí của box. Nhưng điều này không nên xảy ra: prop `position` của `Background` được đặt thành `initialPosition`, vốn là `{ x: 0, y: 0 }`. Tại sao background lại di chuyển sau khi đổi màu?

Hãy tìm bug và sửa nó.

<Hint>

Nếu có điều gì đó thay đổi ngoài dự kiến, thì đã có mutation. Hãy tìm mutation trong `App.js` và sửa nó.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [17]}} src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Vấn đề nằm ở mutation bên trong `handleMove`. Nó đã mutate `shape.position`, nhưng đó cũng chính là object mà `initialPosition` trỏ tới. Đây là lý do cả shape và background đều di chuyển. (Đó là một mutation, nên thay đổi không phản ánh trên màn hình cho đến khi một update không liên quan--việc đổi màu--kích hoạt re-render.)

Cách sửa là loại bỏ mutation khỏi `handleMove` và sử dụng spread syntax để sao chép shape. Lưu ý rằng `+=` là một mutation, vì vậy bạn cần viết lại nó bằng một thao tác `+` thông thường.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Cập nhật một object bằng Immer {/*update-an-object-with-immer*/}

Đây là ví dụ có bug giống challenge trước. Lần này, hãy sửa mutation bằng cách sử dụng Immer. Để thuận tiện cho bạn, `useImmer` đã được import sẵn, vì vậy bạn cần thay đổi state variable `shape` để sử dụng nó.

<Sandpack>

```js {expectedErrors: {'react-compiler': [18]}} src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

Đây là lời giải được viết lại bằng Immer. Hãy chú ý rằng các event handler được viết theo cách có mutation, nhưng bug không xảy ra. Đó là vì bên dưới, Immer không bao giờ mutate các object hiện có.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

</Solution>

</Challenges>