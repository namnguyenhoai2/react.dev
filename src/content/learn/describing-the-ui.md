---
title: Mô tả UI
---

<Intro>

React là một thư viện JavaScript dùng để render giao diện người dùng (UI). UI được xây dựng từ những đơn vị nhỏ như button, văn bản và hình ảnh. React cho phép bạn kết hợp chúng thành các *component* có thể tái sử dụng và lồng ghép. Từ website đến ứng dụng điện thoại, mọi thứ hiển thị trên màn hình đều có thể được phân tách thành các component. Trong chương này, bạn sẽ học cách tạo, tùy chỉnh và hiển thị có điều kiện các component React.

</Intro>

<YouWillLearn isChapter={true}>

* [Cách viết component React đầu tiên](/learn/your-first-component)
* [Khi nào và cách tạo các file chứa nhiều component](/learn/importing-and-exporting-components)
* [Cách thêm markup vào JavaScript bằng JSX](/learn/writing-markup-with-jsx)
* [Cách sử dụng dấu ngoặc nhọn với JSX để truy cập chức năng JavaScript từ các component](/learn/javascript-in-jsx-with-curly-braces)
* [Cách cấu hình component bằng props](/learn/passing-props-to-a-component)
* [Cách render component có điều kiện](/learn/conditional-rendering)
* [Cách render nhiều component cùng lúc](/learn/rendering-lists)
* [Cách tránh các bug khó hiểu bằng cách giữ component pure](/learn/keeping-components-pure)
* [Tại sao việc hình dung UI dưới dạng cây lại hữu ích](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## Component đầu tiên của bạn {/*your-first-component*/}

Các ứng dụng React được xây dựng từ những phần UI độc lập gọi là *component*. Một component React là một hàm JavaScript mà bạn có thể thêm markup vào. Component có thể nhỏ như một button hoặc lớn như cả một trang. Dưới đây là một component `Gallery` render ba component `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

Đọc **[Component đầu tiên của bạn](/learn/your-first-component)** để tìm hiểu cách khai báo và sử dụng component React.

</LearnMore>

## Import và export component {/*importing-and-exporting-components*/}

Bạn có thể khai báo nhiều component trong một file, nhưng các file lớn có thể trở nên khó điều hướng. Để giải quyết vấn đề này, bạn có thể *export* một component vào file riêng, sau đó *import* component đó từ một file khác:


<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Đọc **[Import và Export Component](/learn/importing-and-exporting-components)** để tìm hiểu cách tách component vào các file riêng.

</LearnMore>

## Viết markup bằng JSX {/*writing-markup-with-jsx*/}

Mỗi component React là một hàm JavaScript có thể chứa markup mà React render vào trình duyệt. Component React sử dụng một phần mở rộng cú pháp có tên là JSX để biểu diễn markup đó. JSX trông rất giống HTML, nhưng nghiêm ngặt hơn một chút và có thể hiển thị thông tin động.

Nếu chúng ta dán markup HTML có sẵn vào một component React, đoạn mã đó không phải lúc nào cũng hoạt động:

<Sandpack>

```js
export default function TodoList() {
  return (
    // Cách này chưa hoạt động đúng!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Nếu bạn có HTML có sẵn như thế này, bạn có thể sửa nó bằng một [converter](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Đọc **[Viết Markup bằng JSX](/learn/writing-markup-with-jsx)** để tìm hiểu cách viết JSX hợp lệ.

</LearnMore>

## JavaScript trong JSX với dấu ngoặc nhọn {/*javascript-in-jsx-with-curly-braces*/}

JSX cho phép bạn viết markup giống HTML bên trong một file JavaScript, giữ logic render và nội dung ở cùng một nơi. Đôi khi bạn sẽ muốn thêm một chút logic JavaScript hoặc tham chiếu đến một thuộc tính động bên trong markup đó. Trong trường hợp này, bạn có thể sử dụng dấu ngoặc nhọn trong JSX để “mở một cửa sổ” đến JavaScript:

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

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Đọc **[JavaScript trong JSX với Dấu ngoặc nhọn](/learn/javascript-in-jsx-with-curly-braces)** để tìm hiểu cách truy cập dữ liệu JavaScript từ JSX.

</LearnMore>

## Truyền props cho component {/*passing-props-to-a-component*/}

Các component React sử dụng *props* để giao tiếp với nhau. Mỗi component cha có thể truyền một số thông tin cho các component con bằng cách cung cấp props cho chúng. Props có thể khiến bạn liên tưởng đến các thuộc tính HTML, nhưng bạn có thể truyền bất kỳ giá trị JavaScript nào qua chúng, bao gồm object, array, function và thậm chí cả JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Đọc **[Truyền Props cho Component](/learn/passing-props-to-a-component)** để tìm hiểu cách truyền và đọc props.

</LearnMore>

## Render có điều kiện {/*conditional-rendering*/}

Component của bạn thường cần hiển thị những nội dung khác nhau tùy thuộc vào các điều kiện khác nhau. Trong React, bạn có thể render JSX có điều kiện bằng các cú pháp JavaScript như câu lệnh `if`, `&&` và các toán tử `? :`.

Trong ví dụ này, toán tử JavaScript `&&` được sử dụng để render có điều kiện một dấu check:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Đọc **[Render có điều kiện](/learn/conditional-rendering)** để tìm hiểu các cách khác nhau nhằm render nội dung có điều kiện.

</LearnMore>

## Render danh sách {/*rendering-lists*/}

Bạn sẽ thường muốn hiển thị nhiều component tương tự nhau từ một tập hợp dữ liệu. Bạn có thể sử dụng `filter()` và `map()` của JavaScript cùng với React để filter và transform array dữ liệu thành một array các component.

Với mỗi phần tử trong array, bạn cần chỉ định một `key`. Thông thường, bạn sẽ muốn sử dụng ID từ database làm `key`. Key cho phép React theo dõi vị trí của từng phần tử trong danh sách ngay cả khi danh sách thay đổi.

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
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Đọc **[Render danh sách](/learn/rendering-lists)** để tìm hiểu cách render một danh sách component và cách chọn key.

</LearnMore>

## Giữ component pure {/*keeping-components-pure*/}

Một số hàm JavaScript là *pure*. Một hàm pure:

* **Chỉ xử lý công việc của riêng mình.** Hàm không thay đổi bất kỳ object hoặc biến nào đã tồn tại trước khi được gọi.
* **Cùng input, cùng output.** Với cùng input, một hàm pure luôn phải trả về cùng một kết quả.

Bằng cách chỉ viết component của bạn dưới dạng các hàm pure một cách nghiêm ngặt, bạn có thể tránh được cả một nhóm bug khó hiểu và hành vi không thể dự đoán khi codebase phát triển. Dưới đây là một ví dụ về component impure:

<Sandpack>

```js {expectedErrors: {'react-compiler': [5]}}
let guest = 0;

function Cup() {
  // Không tốt: thay đổi một biến đã tồn tại!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Bạn có thể biến component này thành pure bằng cách truyền một prop thay vì sửa đổi một biến đã tồn tại:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Đọc **[Giữ Component Pure](/learn/keeping-components-pure)** để tìm hiểu cách viết component dưới dạng các hàm pure, có thể dự đoán.

</LearnMore>

## UI của bạn dưới dạng cây {/*your-ui-as-a-tree*/}

React sử dụng cây để mô hình hóa mối quan hệ giữa các component và module.

Cây render của React là biểu diễn mối quan hệ cha-con giữa các component.

<Diagram name="generic_render_tree" height={250} width={500} alt="A tree graph with five nodes, with each node representing a component. The root node is located at the top the tree graph and is labelled 'Root Component'. It has two arrows extending down to two nodes labelled 'Component A' and 'Component C'. Each of the arrows is labelled with 'renders'. 'Component A' has a single 'renders' arrow to a node labelled 'Component B'. 'Component C' has a single 'renders' arrow to a node labelled 'Component D'.">

Một ví dụ về cây render của React.

</Diagram>

Các component ở gần đầu cây, gần component gốc, được xem là component cấp cao nhất. Các component không có component con là component lá. Việc phân loại component này hữu ích để hiểu luồng dữ liệu và hiệu suất render.

Mô hình hóa mối quan hệ giữa các module JavaScript là một cách hữu ích khác để hiểu ứng dụng của bạn. Chúng tôi gọi đó là cây dependency của module.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="A tree graph with five nodes. Each node represents a JavaScript module. The top-most node is labelled 'RootModule.js'. It has three arrows extending to the nodes: 'ModuleA.js', 'ModuleB.js', and 'ModuleC.js'. Each arrow is labelled as 'imports'. 'ModuleC.js' node has a single 'imports' arrow that points to a node labelled 'ModuleD.js'.">

Một ví dụ về cây dependency của module.

</Diagram>

Cây dependency thường được các build tool sử dụng để bundle toàn bộ code JavaScript liên quan mà client cần tải xuống và render. Kích thước bundle lớn làm giảm trải nghiệm người dùng đối với các ứng dụng React. Hiểu cây dependency của module sẽ giúp debug những vấn đề như vậy.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Đọc **[UI của bạn dưới dạng cây](/learn/understanding-your-ui-as-a-tree)** để tìm hiểu cách tạo cây render và cây dependency của module cho một ứng dụng React, cũng như cách chúng cung cấp các mô hình tư duy hữu ích để cải thiện trải nghiệm người dùng và hiệu suất.

</LearnMore>


## Tiếp theo là gì? {/*whats-next*/}

Hãy truy cập [Thành phần đầu tiên của bạn](/learn/your-first-component) để bắt đầu đọc chương này theo từng trang!

Hoặc, nếu bạn đã quen thuộc với những chủ đề này, tại sao không đọc về [Thêm tính tương tác](/learn/adding-interactivity)?
