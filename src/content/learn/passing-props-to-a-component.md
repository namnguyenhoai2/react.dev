---
title: Truyền Props cho một Component
---

<Intro>

Các React component sử dụng *props* để giao tiếp với nhau. Mọi parent component đều có thể truyền một số thông tin cho các child component bằng cách cung cấp props cho chúng. Props có thể khiến bạn liên tưởng đến các thuộc tính HTML, nhưng bạn có thể truyền bất kỳ giá trị JavaScript nào qua props, bao gồm object, array và function.

</Intro>

<YouWillLearn>

* Cách truyền props cho một component
* Cách đọc props từ một component
* Cách chỉ định giá trị mặc định cho props
* Cách truyền một phần JSX cho một component
* Props thay đổi theo thời gian như thế nào

</YouWillLearn>

## Các props quen thuộc {/*familiar-props*/}

Props là thông tin bạn truyền vào một JSX tag. Ví dụ, `className`, `src`, `alt`, `width`, và `height` là một số props bạn có thể truyền vào một `<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://react.dev/images/docs/scientists/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Các props bạn có thể truyền vào một `<img>` tag đã được định nghĩa sẵn (ReactDOM tuân theo [tiêu chuẩn HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Nhưng bạn có thể truyền bất kỳ props nào vào *các* component của riêng mình, chẳng hạn như `<Avatar>`, để tùy chỉnh chúng. Sau đây là cách thực hiện!

## Truyền props cho một component {/*passing-props-to-a-component*/}

Trong đoạn code này, component `Profile` không truyền props nào cho child component `Avatar` của nó:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Bạn có thể cung cấp cho `Avatar` một số props qua hai bước.

### Bước 1: Truyền props cho child component {/*step-1-pass-props-to-the-child-component*/}

Trước tiên, hãy truyền một số props cho `Avatar`. Ví dụ, hãy truyền hai props: `person` (một object) và `size` (một number):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Nếu hai dấu ngoặc nhọn sau `person=` khiến bạn khó hiểu, hãy nhớ rằng [chúng chỉ là một object](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) nằm bên trong dấu ngoặc nhọn JSX.

</Note>

Bây giờ bạn có thể đọc các props này bên trong component `Avatar`.

### Bước 2: Đọc props bên trong child component {/*step-2-read-props-inside-the-child-component*/}

Bạn có thể đọc các props này bằng cách liệt kê tên của chúng `person, size`, được phân tách bằng dấu phẩy bên trong `({` và `})`, ngay sau `function Avatar`. Nhờ đó, bạn có thể sử dụng chúng trong code `Avatar`, giống như sử dụng một biến.

```js
function Avatar({ person, size }) {
  // person and size are available here
}
```

Hãy thêm một số logic vào `Avatar` để sử dụng các props `person` và `size` khi render, vậy là xong.

Giờ đây, bạn có thể cấu hình `Avatar` để render theo nhiều cách khác nhau với các props khác nhau. Hãy thử thay đổi các giá trị!

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma',
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Props cho phép bạn xem xét parent component và child component một cách độc lập. Ví dụ, bạn có thể thay đổi các props `person` hoặc `size` bên trong `Profile` mà không cần quan tâm `Avatar` sử dụng chúng như thế nào. Tương tự, bạn có thể thay đổi cách `Avatar` sử dụng các props này mà không cần xem xét `Profile`.

Bạn có thể hình dung props như những “nút điều chỉnh” mà bạn có thể thay đổi. Chúng có vai trò tương tự các argument của function—thực tế, props _là_ argument duy nhất của component! Các React component function nhận một argument duy nhất, một object `props`:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Thông thường, bạn không cần toàn bộ object `props`, nên bạn destructure nó thành các props riêng lẻ.

<Pitfall>

**Đừng bỏ sót cặp dấu ngoặc nhọn `{` và `}`** bên trong `(` và `)` khi khai báo props:

```js
function Avatar({ person, size }) {
  // ...
}
```

Cú pháp này được gọi là [“destructuring”](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) và tương đương với việc đọc các thuộc tính từ một function parameter:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Chỉ định giá trị mặc định cho một prop {/*specifying-a-default-value-for-a-prop*/}

Nếu muốn cung cấp cho một prop một giá trị mặc định để dùng khi không có giá trị nào được chỉ định, bạn có thể thực hiện việc này bằng destructuring: đặt `=` và giá trị mặc định ngay sau parameter:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Giờ đây, nếu `<Avatar person={...} />` được render mà không có prop `size`, `size` sẽ được đặt thành `100`.

Giá trị mặc định chỉ được sử dụng khi prop `size` bị thiếu hoặc khi bạn truyền `size={undefined}`. Tuy nhiên, nếu bạn truyền `size={null}` hoặc `size={0}`, giá trị mặc định sẽ **không** được sử dụng.

## Forward props bằng cú pháp JSX spread {/*forwarding-props-with-the-jsx-spread-syntax*/}

Đôi khi việc truyền props trở nên rất lặp lại:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Không có gì sai với code lặp lại—nó có thể dễ đọc hơn. Nhưng đôi khi bạn có thể ưu tiên sự ngắn gọn. Một số component forward toàn bộ props của chúng cho các child, giống như cách `Profile` này thực hiện với `Avatar`. Vì chúng không trực tiếp sử dụng bất kỳ props nào của mình, việc dùng cú pháp “spread” ngắn gọn hơn có thể hợp lý:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Cú pháp này forward tất cả props của `Profile` đến `Avatar` mà không cần liệt kê tên từng prop.

**Hãy sử dụng spread syntax một cách chừng mực.** Nếu bạn dùng nó trong mọi component khác, có gì đó không ổn. Thông thường, điều này cho thấy bạn nên tách các component và truyền children dưới dạng JSX. Phần tiếp theo sẽ nói rõ hơn về điều đó!

## Truyền JSX dưới dạng children {/*passing-jsx-as-children*/}

Việc lồng các browser tag có sẵn là rất phổ biến:

```js
<div>
  <img />
</div>
```

Đôi khi bạn cũng sẽ muốn lồng các component của riêng mình theo cách tương tự:

```js
<Card>
  <Avatar />
</Card>
```

Khi bạn lồng nội dung bên trong một JSX tag, parent component sẽ nhận nội dung đó trong một prop có tên là `children`. Ví dụ, component `Card` bên dưới sẽ nhận một prop `children` có giá trị là `<Avatar />` và render nó trong một wrapper div:

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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

Hãy thử thay thế `<Avatar>` bên trong `<Card>` bằng một đoạn text để xem component `Card` có thể bao bọc mọi nội dung được lồng vào như thế nào. Nó không cần “biết” nội dung bên trong đang được render là gì. Bạn sẽ thấy pattern linh hoạt này ở nhiều nơi.

Bạn có thể hình dung một component có prop `children` như có một “khoảng trống” để các parent component “điền vào” bằng JSX tùy ý. Bạn sẽ thường sử dụng prop `children` cho các wrapper dùng để trình bày: panel, grid, v.v.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## Props thay đổi theo thời gian như thế nào {/*how-props-change-over-time*/}

Component `Clock` bên dưới nhận hai props từ parent component: `color` và `time`. (Code của parent component được lược bỏ vì nó sử dụng [state](/learn/state-a-components-memory), nội dung mà chúng ta sẽ chưa đi sâu vào lúc này.)

Hãy thử thay đổi màu trong select box bên dưới:

<Sandpack>

```js src/Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Ví dụ này cho thấy rằng **một component có thể nhận các props khác nhau theo thời gian.** Props không phải lúc nào cũng tĩnh! Ở đây, prop `time` thay đổi mỗi giây, còn prop `color` thay đổi khi bạn chọn một màu khác. Props phản ánh dữ liệu của component tại từng thời điểm, chứ không chỉ tại thời điểm ban đầu.

Tuy nhiên, props là [immutable](https://en.wikipedia.org/wiki/Immutable_object)—một thuật ngữ trong computer science có nghĩa là “không thể thay đổi”. Khi một component cần thay đổi props của mình (ví dụ để phản hồi tương tác của người dùng hoặc dữ liệu mới), nó sẽ phải “yêu cầu” parent component truyền cho nó _các props khác_—một object mới! Các props cũ sau đó sẽ bị loại bỏ, và cuối cùng JavaScript engine sẽ thu hồi phần memory mà chúng chiếm dụng.

**Đừng cố “thay đổi props”.** Khi cần phản hồi input của người dùng (chẳng hạn như thay đổi màu đã chọn), bạn cần “set state”; bạn có thể tìm hiểu về việc này trong [State: Bộ nhớ của một Component.](/learn/state-a-components-memory)

<Recap>

* Để truyền props, hãy thêm chúng vào JSX, giống như cách bạn làm với các thuộc tính HTML.
* Để đọc props, hãy sử dụng cú pháp destructuring `function Avatar({ person, size })`.
* Bạn có thể chỉ định một giá trị mặc định như `size = 100`, được sử dụng cho các props bị thiếu và `undefined`.
* Bạn có thể forward tất cả props bằng cú pháp JSX spread `<Avatar {...props} />`, nhưng đừng lạm dụng nó!
* JSX được lồng như `<Card><Avatar /></Card>` sẽ xuất hiện dưới dạng prop `children` của component `Card`.
* Props là các snapshot chỉ-đọc tại từng thời điểm: mỗi lần render nhận được một phiên bản props mới.
* Bạn không thể thay đổi props. Khi cần tính tương tác, bạn sẽ phải set state.

</Recap>



<Challenges>

#### Tách một component {/*extract-a-component*/}

Component `Gallery` này chứa phần markup rất giống nhau cho hai profile. Hãy tách một component `Profile` ra khỏi nó để giảm sự trùng lặp. Bạn sẽ cần chọn các props để truyền cho component đó.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b>
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b>
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (chemical element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b>
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b>
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Bắt đầu bằng cách trích xuất markup cho một trong các nhà khoa học. Sau đó tìm những phần không khớp với nó trong ví dụ thứ hai và cho phép cấu hình chúng bằng props.

</Hint>

<Solution>

Trong lời giải này, component `Profile` nhận nhiều props: `imageId` (một chuỗi), `name` (một chuỗi), `profession` (một chuỗi), `awards` (một mảng các chuỗi), `discovery` (một chuỗi) và `imageSize` (một số).

Lưu ý rằng prop `imageSize` có giá trị mặc định, nên chúng ta không truyền nó vào component.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Lưu ý rằng bạn không cần một prop `awardCount` riêng nếu `awards` là một mảng. Khi đó, bạn có thể dùng `awards.length` để đếm số giải thưởng. Hãy nhớ rằng props có thể nhận bất kỳ giá trị nào, bao gồm cả mảng!

Một cách giải quyết khác, tương tự hơn với các ví dụ trước đó trên trang này, là nhóm tất cả thông tin về một người vào một object duy nhất rồi truyền object đó dưới dạng một prop:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Mặc dù cú pháp trông hơi khác vì bạn đang mô tả các thuộc tính của một object JavaScript thay vì một tập hợp các thuộc tính JSX, hai ví dụ này hầu như tương đương và bạn có thể chọn một trong hai cách.

</Solution>

#### Điều chỉnh kích thước ảnh dựa trên một prop {/*adjust-the-image-size-based-on-a-prop*/}

Trong ví dụ này, `Avatar` nhận một prop `size` dạng số, dùng để xác định chiều rộng và chiều cao `<img>`. Prop `size` được đặt thành `40` trong ví dụ này. Tuy nhiên, nếu mở ảnh trong tab mới, bạn sẽ nhận thấy rằng bản thân ảnh lớn hơn (`160` pixel). Kích thước thật của ảnh được xác định bởi kích thước thumbnail mà bạn yêu cầu.

Hãy thay đổi component `Avatar` để yêu cầu kích thước ảnh gần nhất dựa trên prop `size`. Cụ thể, nếu `size` nhỏ hơn `90`, hãy truyền `'s'` ("small") thay vì `'b'` ("big") vào hàm `getImageUrl`. Xác minh rằng các thay đổi của bạn hoạt động bằng cách render các avatar với những giá trị khác nhau của prop `size` rồi mở ảnh trong tab mới.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{
        name: 'Gregorio Y. Zara',
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Bạn có thể thực hiện như sau:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Bạn cũng có thể hiển thị ảnh sắc nét hơn trên màn hình có DPI cao bằng cách tính đến [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio):

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Props cho phép bạn đóng gói logic như thế này bên trong component `Avatar` (và thay đổi nó sau này nếu cần), để mọi người có thể sử dụng component `<Avatar>` mà không cần suy nghĩ về cách ảnh được yêu cầu và thay đổi kích thước.

</Solution>

#### Truyền JSX trong prop `children` {/*passing-jsx-in-a-children-prop*/}

Hãy trích xuất một component `Card` từ markup bên dưới và dùng prop `children` để truyền JSX khác nhau vào đó:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://react.dev/images/docs/scientists/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Mọi JSX bạn đặt bên trong thẻ của một component sẽ được truyền dưới dạng prop `children` cho component đó.

</Hint>

<Solution>

Sau đây là cách bạn có thể sử dụng component `Card` ở cả hai nơi:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://react.dev/images/docs/scientists/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

Bạn cũng có thể biến `title` thành một prop riêng nếu muốn mọi `Card` luôn có tiêu đề:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://react.dev/images/docs/scientists/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>