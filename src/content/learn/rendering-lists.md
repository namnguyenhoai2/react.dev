---
title: Hiển thị danh sách
---

<Intro>

Bạn sẽ thường muốn hiển thị nhiều component tương tự từ một tập hợp dữ liệu. Bạn có thể sử dụng các [phương thức mảng JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) để thao tác với một mảng dữ liệu. Trong trang này, bạn sẽ sử dụng [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) và [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) với React để lọc và biến đổi mảng dữ liệu của bạn thành một mảng các component.

</Intro>

<YouWillLearn>

* Cách hiển thị các component từ một mảng bằng `map()` của JavaScript
* Cách chỉ hiển thị một số component cụ thể bằng `filter()` của JavaScript
* Khi nào và tại sao nên sử dụng React key

</YouWillLearn>

## Hiển thị dữ liệu từ các mảng {/*rendering-data-from-arrays*/}

Giả sử bạn có một danh sách nội dung.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

Điểm khác biệt duy nhất giữa các mục trong danh sách đó là nội dung và dữ liệu của chúng. Khi xây dựng giao diện, bạn sẽ thường cần hiển thị nhiều instance của cùng một component bằng các dữ liệu khác nhau: từ danh sách bình luận đến các thư viện ảnh hồ sơ. Trong những tình huống này, bạn có thể lưu dữ liệu trong các object và array của JavaScript, rồi sử dụng các phương thức như [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) và [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) để hiển thị danh sách component từ chúng.

Dưới đây là một ví dụ ngắn về cách tạo danh sách các mục từ một mảng:

1. **Đưa** dữ liệu vào một mảng:

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. **Map** các phần tử `people` vào một mảng mới gồm các node JSX, `listItems`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Trả về** `listItems` từ component của bạn, được bọc trong một `<ul>`:

```js
return <ul>{listItems}</ul>;
```

Đây là kết quả:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Lưu ý rằng sandbox ở trên hiển thị một lỗi trong console:

<ConsoleBlock level="error">

Cảnh báo: Mỗi child trong một danh sách phải có prop "key" duy nhất.

</ConsoleBlock>

Bạn sẽ học cách sửa lỗi này ở phần sau của trang. Trước khi đi đến đó, hãy thêm một số cấu trúc vào dữ liệu của bạn.

## Lọc các mảng mục {/*filtering-arrays-of-items*/}

Dữ liệu này có thể được cấu trúc chi tiết hơn nữa.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

Giả sử bạn muốn chỉ hiển thị những người có nghề nghiệp là `'chemist'`. Bạn có thể sử dụng phương thức `filter()` của JavaScript để chỉ trả về những người đó. Phương thức này nhận một mảng các mục, đưa chúng qua một “bài kiểm tra” (một hàm trả về `true` hoặc `false`), rồi trả về một mảng mới chỉ gồm những mục vượt qua bài kiểm tra (trả về `true`).

Bạn chỉ muốn các mục có `profession` là `'chemist'`. Hàm “kiểm tra” cho trường hợp này sẽ là `(person) => person.profession === 'chemist'`. Sau đây là cách kết hợp chúng:

1. **Tạo** một mảng mới chỉ gồm những người “chemist”, `chemists`, bằng cách gọi `filter()` trên `people`, lọc theo `person.profession === 'chemist'`:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. Bây giờ hãy **map** qua `chemists`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       known for {person.accomplishment}
     </p>
  </li>
);
```

3. Cuối cùng, **trả về** `listItems` từ component của bạn:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Các arrow function ngầm trả về biểu thức ngay sau `=>`, vì vậy bạn không cần câu lệnh `return`:

```js
const listItems = chemists.map(person =>
  <li>...</li> // Implicit return!
);
```

Tuy nhiên, **bạn phải viết `return` một cách tường minh nếu `=>` của bạn được theo sau bởi một dấu ngoặc nhọn `{`!**

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

Các arrow function chứa `=> {` được gọi là có ["block body".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) Chúng cho phép bạn viết nhiều hơn một dòng code, nhưng bạn *phải* tự viết câu lệnh `return`. Nếu quên, sẽ không có gì được trả về!

</Pitfall>

## Giữ thứ tự các mục trong danh sách bằng `key` {/*keeping-list-items-in-order-with-key*/}

Lưu ý rằng tất cả sandbox ở trên đều hiển thị một lỗi trong console:

<ConsoleBlock level="error">

Cảnh báo: Mỗi child trong một danh sách phải có prop "key" duy nhất.

</ConsoleBlock>

Bạn cần cung cấp cho mỗi mục trong mảng một `key` -- một string hoặc number xác định duy nhất mục đó giữa các mục khác trong cùng mảng:

```js
<li key={person.id}>...</li>
```

<Note>

Các phần tử JSX nằm trực tiếp bên trong lời gọi `map()` luôn cần có key!

</Note>

Key cho React biết mỗi component tương ứng với mục nào trong mảng, để sau này React có thể ghép chúng lại. Điều này trở nên quan trọng nếu các mục trong mảng có thể di chuyển (ví dụ: do sắp xếp), được chèn vào hoặc bị xóa. Một `key` được chọn phù hợp giúp React suy ra chính xác điều gì đã xảy ra và thực hiện các cập nhật đúng trên cây DOM.

Thay vì tạo key ngay trong lúc chạy, bạn nên đưa chúng vào dữ liệu:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js active
export const people = [{
  id: 0, // Used in JSX as a key
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Used in JSX as a key
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Used in JSX as a key
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Used in JSX as a key
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Used in JSX as a key
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Hiển thị nhiều node DOM cho mỗi mục trong danh sách {/*displaying-several-dom-nodes-for-each-list-item*/}

Bạn sẽ làm gì khi mỗi mục cần hiển thị không phải một mà là nhiều node DOM?

Cú pháp Fragment ngắn [`<>...</>` Fragment](/reference/react/Fragment) không cho phép bạn truyền key, vì vậy bạn cần nhóm chúng vào một `<div>` duy nhất hoặc sử dụng cú pháp `<Fragment>` dài hơn và [tường minh hơn:](/reference/react/Fragment#rendering-a-list-of-fragments)

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragment biến mất khỏi DOM, vì vậy kết quả sẽ là một danh sách phẳng gồm `<h1>`, `<p>`, `<h1>`, `<p>`, v.v.

</DeepDive>

### Lấy `key` ở đâu {/*where-to-get-your-key*/}

Các nguồn dữ liệu khác nhau cung cấp các nguồn key khác nhau:

* **Dữ liệu từ database:** Nếu dữ liệu của bạn đến từ database, bạn có thể sử dụng các key/ID của database, vốn độc nhất theo bản chất.
* **Dữ liệu được tạo cục bộ:** Nếu dữ liệu của bạn được tạo và lưu trữ cục bộ (ví dụ: ghi chú trong ứng dụng ghi chú), hãy sử dụng một bộ đếm tăng dần, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) hoặc một package như [`uuid`](https://www.npmjs.com/package/uuid) khi tạo các mục.

### Quy tắc của key {/*rules-of-keys*/}

* **Key phải là duy nhất giữa các phần tử cùng cấp.** Tuy nhiên, bạn có thể sử dụng cùng một key cho các node JSX trong _những mảng khác nhau_.
* **Key không được thay đổi**, nếu không chúng sẽ mất đi mục đích sử dụng! Đừng tạo key trong lúc render.

### Tại sao React cần key? {/*why-does-react-need-keys*/}

Hãy tưởng tượng các file trên desktop của bạn không có tên. Thay vào đó, bạn sẽ gọi chúng theo thứ tự -- file đầu tiên, file thứ hai, v.v. Bạn có thể quen với cách này, nhưng một khi xóa một file, mọi thứ sẽ trở nên khó hiểu. File thứ hai sẽ trở thành file đầu tiên, file thứ ba sẽ trở thành file thứ hai, v.v.

Tên file trong một thư mục và key JSX trong một mảng có mục đích tương tự nhau. Chúng cho phép chúng ta xác định duy nhất một mục giữa các phần tử cùng cấp. Một key được chọn phù hợp cung cấp nhiều thông tin hơn vị trí trong mảng. Ngay cả khi _vị trí_ thay đổi do sắp xếp lại, `key` vẫn cho phép React xác định mục đó trong suốt vòng đời của nó.

<Pitfall>

Bạn có thể muốn sử dụng index của một mục trong mảng làm key. Thực tế, đó là giá trị React sẽ sử dụng nếu bạn không chỉ định `key` nào cả. Nhưng thứ tự render các mục sẽ thay đổi theo thời gian nếu một mục được chèn vào, bị xóa hoặc mảng được sắp xếp lại. Việc dùng index làm key thường dẫn đến các bug tinh vi và khó hiểu.

Tương tự, không tạo key ngay trong lúc chạy, chẳng hạn bằng `key={Math.random()}`. Điều này sẽ khiến các key không bao giờ khớp nhau giữa các lần render, dẫn đến việc toàn bộ component và DOM của bạn bị tạo lại mỗi lần. Điều này không chỉ chậm mà còn làm mất mọi input của người dùng bên trong các mục trong danh sách. Thay vào đó, hãy sử dụng một ID ổn định dựa trên dữ liệu.

Lưu ý rằng component của bạn sẽ không nhận `key` dưới dạng prop. Nó chỉ được React sử dụng như một gợi ý. Nếu component của bạn cần một ID, bạn phải truyền nó dưới dạng một prop riêng: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

Trong trang này, bạn đã học:

* Cách đưa dữ liệu ra khỏi component và vào các cấu trúc dữ liệu như array và object.
* Cách tạo các nhóm component tương tự bằng `map()` của JavaScript.
* Cách tạo các mảng gồm các mục đã lọc bằng `filter()` của JavaScript.
* Tại sao và cách đặt `key` trên mỗi component trong một tập hợp để React có thể theo dõi từng component, ngay cả khi vị trí hoặc dữ liệu của chúng thay đổi.

</Recap>



<Challenges>

#### Chia một danh sách thành hai {/*splitting-a-list-in-two*/}

Ví dụ này hiển thị danh sách tất cả mọi người.

Hãy thay đổi để hiển thị hai danh sách riêng biệt, nối tiếp nhau: **Chemists** và **Everyone Else.** Như trước đây, bạn có thể xác định một người có phải là chemist hay không bằng cách kiểm tra xem `person.profession === 'chemist'`.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Bạn có thể sử dụng `filter()` hai lần, tạo ra hai mảng riêng biệt, rồi `map` trên cả hai mảng:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Trong lời giải này, các lệnh gọi `map` được đặt trực tiếp bên trong các phần tử `<ul>` cha, nhưng bạn có thể khai báo biến cho chúng nếu thấy cách đó dễ đọc hơn.

Vẫn còn một phần trùng lặp giữa các danh sách được render. Bạn có thể đi xa hơn và tách các phần lặp lại thành một component `<ListSection>`:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Một độc giả thật sự chú ý có thể nhận ra rằng với hai lệnh gọi `filter`, chúng ta kiểm tra nghề nghiệp của mỗi người hai lần. Việc kiểm tra một thuộc tính diễn ra rất nhanh, nên trong ví dụ này điều đó không sao. Nếu logic của bạn tốn nhiều chi phí hơn, bạn có thể thay các lệnh gọi `filter` bằng một vòng lặp tự xây dựng các mảng và kiểm tra mỗi người đúng một lần.

Thực tế, nếu `people` không bao giờ thay đổi, bạn có thể chuyển đoạn mã này ra ngoài component. Từ góc nhìn của React, điều duy nhất quan trọng là cuối cùng bạn cung cấp cho nó một mảng các node JSX. React không quan tâm bạn tạo mảng đó như thế nào:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Danh sách lồng nhau trong một component {/*nested-lists-in-one-component*/}

Hãy tạo một danh sách công thức nấu ăn từ mảng này! Với mỗi công thức trong mảng, hãy hiển thị tên của nó dưới dạng `<h2>` và liệt kê các nguyên liệu trong một `<ul>`.

<Hint>

Việc này sẽ yêu cầu lồng hai lệnh gọi `map` khác nhau.

</Hint>

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Sau đây là một cách bạn có thể thực hiện:

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Mỗi `recipes` đã bao gồm một trường `id`, vì vậy đó là trường mà vòng lặp bên ngoài sử dụng làm `key`. Không có ID nào để bạn có thể dùng khi lặp qua các nguyên liệu. Tuy nhiên, hợp lý khi giả định rằng cùng một nguyên liệu sẽ không được liệt kê hai lần trong cùng một công thức, nên tên của nguyên liệu có thể dùng làm `key`. Ngoài ra, bạn có thể thay đổi cấu trúc dữ liệu để thêm ID, hoặc sử dụng index làm `key` (với lưu ý rằng bạn không thể sắp xếp lại các nguyên liệu một cách an toàn).

</Solution>

#### Tách component cho một mục trong danh sách {/*extracting-a-list-item-component*/}

Component `RecipeList` này chứa hai lệnh gọi `map` lồng nhau. Để đơn giản hóa, hãy tách từ đó một component `Recipe` nhận các props `id`, `name`, và `ingredients`. Bạn đặt `key` bên ngoài ở đâu và tại sao?

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Bạn có thể sao chép và dán JSX từ `map` bên ngoài vào một component `Recipe` mới rồi trả về JSX đó. Sau đó, bạn có thể đổi `recipe.name` thành `name`, `recipe.id` thành `id`, v.v., rồi truyền chúng dưới dạng props cho `Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Ở đây, `<Recipe {...recipe} key={recipe.id} />` là cú pháp rút gọn có nghĩa là “truyền tất cả thuộc tính của object `recipe` dưới dạng props cho component `Recipe`”. Bạn cũng có thể viết rõ từng prop: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Lưu ý rằng `key` được chỉ định trên chính `<Recipe>`, thay vì trên `<div>` gốc được trả về từ `Recipe`.** Lý do là `key` này cần thiết ngay trong ngữ cảnh của mảng bao quanh. Trước đó, bạn có một mảng các `<div>` nên mỗi phần tử cần một `key`, nhưng bây giờ bạn có một mảng các `<Recipe>`. Nói cách khác, khi tách một component, đừng quên để `key` ở bên ngoài phần JSX mà bạn sao chép và dán.

</Solution>

#### Danh sách có dấu phân cách {/*list-with-a-separator*/}

Ví dụ này render một bài haiku nổi tiếng của Tachibana Hokushi, trong đó mỗi dòng được bọc trong một thẻ `<p>`. Nhiệm vụ của bạn là chèn một dấu phân cách `<hr />` giữa mỗi đoạn. Cấu trúc kết quả của bạn sẽ trông như sau:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

Một bài haiku chỉ có ba dòng, nhưng lời giải của bạn phải hoạt động với số lượng dòng bất kỳ. Lưu ý rằng các phần tử `<hr />` chỉ xuất hiện *giữa* các phần tử `<p>`, không xuất hiện ở đầu hoặc cuối!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(Đây là một trường hợp hiếm hoi mà việc sử dụng index làm key được chấp nhận, vì các dòng thơ sẽ không bao giờ được sắp xếp lại.)

<Hint>

Bạn sẽ cần chuyển `map` thành một vòng lặp thủ công hoặc sử dụng Fragment.

</Hint>

<Solution>

Bạn có thể viết một vòng lặp thủ công, chèn `<hr />` và `<p>...</p>` vào mảng kết quả trong quá trình lặp:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Việc sử dụng index của dòng ban đầu làm `key` không còn hiệu quả, vì mỗi dấu phân cách và đoạn văn hiện nằm trong cùng một mảng. Tuy nhiên, bạn có thể cung cấp cho mỗi phần tử một key riêng biệt bằng cách thêm hậu tố, chẳng hạn như `key={i + '-text'}`.

Ngoài ra, bạn có thể render một tập hợp các Fragment chứa `<hr />` và `<p>...</p>`. Tuy nhiên, cú pháp viết tắt `<>...</>` không hỗ trợ truyền key, nên bạn sẽ phải viết rõ `<Fragment>`:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Hãy nhớ rằng Fragment (thường được viết là `<> </>`) cho phép bạn nhóm các node JSX mà không thêm các `<div>` dư thừa!

</Solution>

</Challenges>