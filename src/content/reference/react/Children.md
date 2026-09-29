---
title: Các phần tử con
---

<Pitfall>

Việc sử dụng `Children` không phổ biến và có thể dẫn đến code mong manh. [Xem các phương án thay thế thường dùng.](#alternatives)

</Pitfall>

<Intro>

`Children` cho phép bạn thao tác và biến đổi JSX mà bạn nhận được dưới dạng prop [`children`.](/learn/passing-props-to-a-component#passing-jsx-as-children)

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `Children.count(children)` {/*children-count*/}

Gọi `Children.count(children)` để đếm số lượng phần tử con trong cấu trúc dữ liệu `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[Xem thêm ví dụ bên dưới.](#counting-children)

#### Tham số {/*children-count-parameters*/}

* `children`: Giá trị của prop [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) mà component của bạn nhận được.

#### Giá trị trả về {/*children-count-returns*/}

Số lượng node bên trong `children`.

#### Lưu ý {/*children-count-caveats*/}

- Các node rỗng (`null`, `undefined` và Boolean), chuỗi, số và [React element](/reference/react/createElement) được tính là các node riêng lẻ. Array không được tính là node riêng lẻ, nhưng các phần tử con của chúng thì có. **Quá trình duyệt không đi sâu hơn React element:** chúng không được render và các phần tử con của chúng không được duyệt. [Fragment](/reference/react/Fragment) cũng không được duyệt.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Gọi `Children.forEach(children, fn, thisArg?)` để chạy một đoạn code cho từng phần tử con trong cấu trúc dữ liệu `children`.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[Xem thêm ví dụ bên dưới.](#running-some-code-for-each-child)

#### Tham số {/*children-foreach-parameters*/}

* `children`: Giá trị của prop [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) mà component của bạn nhận được.
* `fn`: Hàm bạn muốn chạy cho từng phần tử con, tương tự như callback của phương thức [array `forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Hàm này sẽ được gọi với phần tử con làm đối số thứ nhất và chỉ mục của nó làm đối số thứ hai. Chỉ mục bắt đầu từ `0` và tăng lên sau mỗi lần gọi.
* **tùy chọn** `thisArg`: Giá trị [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) mà hàm `fn` sẽ được gọi cùng. Nếu bỏ qua, giá trị này là `undefined`.

#### Giá trị trả về {/*children-foreach-returns*/}

`Children.forEach` trả về `undefined`.

#### Lưu ý {/*children-foreach-caveats*/}

- Các node rỗng (`null`, `undefined` và Boolean), chuỗi, số và [React element](/reference/react/createElement) được tính là các node riêng lẻ. Array không được tính là node riêng lẻ, nhưng các phần tử con của chúng thì có. **Quá trình duyệt không đi sâu hơn React element:** chúng không được render và các phần tử con của chúng không được duyệt. [Fragment](/reference/react/Fragment) cũng không được duyệt.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Gọi `Children.map(children, fn, thisArg?)` để ánh xạ hoặc biến đổi từng phần tử con trong cấu trúc dữ liệu `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[Xem thêm ví dụ bên dưới.](#transforming-children)

#### Tham số {/*children-map-parameters*/}

* `children`: Giá trị của prop [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) mà component của bạn nhận được.
* `fn`: Hàm ánh xạ, tương tự như callback của phương thức [array `map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Hàm này sẽ được gọi với phần tử con làm đối số thứ nhất và chỉ mục của nó làm đối số thứ hai. Chỉ mục bắt đầu từ `0` và tăng lên sau mỗi lần gọi. Bạn cần trả về một React node từ hàm này. Node đó có thể là node rỗng (`null`, `undefined` hoặc Boolean), chuỗi, số, React element hoặc array chứa các React node khác.
* **tùy chọn** `thisArg`: Giá trị [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) mà hàm `fn` sẽ được gọi cùng. Nếu bỏ qua, giá trị này là `undefined`.

#### Giá trị trả về {/*children-map-returns*/}

Nếu `children` là `null` hoặc `undefined`, hàm trả về cùng giá trị đó.

Nếu không, hàm trả về một flat array gồm các node mà bạn đã trả về từ hàm `fn`. Array được trả về sẽ chứa tất cả các node bạn đã trả về, ngoại trừ `null` và `undefined`.

#### Lưu ý {/*children-map-caveats*/}

- Các node rỗng (`null`, `undefined` và Boolean), chuỗi, số và [React element](/reference/react/createElement) được tính là các node riêng lẻ. Array không được tính là node riêng lẻ, nhưng các phần tử con của chúng thì có. **Quá trình duyệt không đi sâu hơn React element:** chúng không được render và các phần tử con của chúng không được duyệt. [Fragment](/reference/react/Fragment) cũng không được duyệt.

- Nếu bạn trả về một element hoặc một array gồm các element có key từ `fn`, **key của các element được trả về sẽ tự động được kết hợp với key của item gốc tương ứng từ `children`.** Khi bạn trả về nhiều element từ `fn` trong một array, key của chúng chỉ cần là duy nhất trong phạm vi các element đó.

---

### `Children.only(children)` {/*children-only*/}

Gọi `Children.only(children)` để xác nhận rằng `children` biểu diễn một React element duy nhất.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Tham số {/*children-only-parameters*/}

* `children`: Giá trị của prop [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) mà component của bạn nhận được.

#### Giá trị trả về {/*children-only-returns*/}

Nếu `children` [là một element hợp lệ,](/reference/react/isValidElement) hàm trả về element đó.

Nếu không, hàm sẽ throw một error.

#### Lưu ý {/*children-only-caveats*/}

- Phương thức này luôn **throw nếu bạn truyền một array (chẳng hạn như giá trị trả về của `Children.map`) làm `children`.** Nói cách khác, phương thức này buộc `children` phải là một React element duy nhất, chứ không phải một array chứa một element duy nhất.

---

### `Children.toArray(children)` {/*children-toarray*/}

Gọi `Children.toArray(children)` để tạo một array từ cấu trúc dữ liệu `children`.

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Tham số {/*children-toarray-parameters*/}

* `children`: Giá trị của prop [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) mà component của bạn nhận được.

#### Giá trị trả về {/*children-toarray-returns*/}

Trả về một flat array gồm các element trong `children`.

#### Lưu ý {/*children-toarray-caveats*/}

- Các node rỗng (`null`, `undefined` và Boolean) sẽ bị loại khỏi array được trả về. **Key của các element được trả về sẽ được tính từ key của các element gốc, cùng với cấp độ lồng nhau và vị trí của chúng.** Điều này đảm bảo việc flatten array không làm thay đổi hành vi.

---

## Cách sử dụng {/*usage*/}

### Biến đổi các phần tử con {/*transforming-children*/}

Để biến đổi JSX con mà component của bạn [nhận được dưới dạng prop `children`,](/learn/passing-props-to-a-component#passing-jsx-as-children) hãy gọi `Children.map`:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

Trong ví dụ trên, `RowList` bọc mọi phần tử con mà nó nhận được trong một container `<div className="Row">`. Ví dụ, giả sử component cha truyền ba thẻ `<p>` vào prop `children` của `RowList`:

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

Sau đó, với implementation `RowList` ở trên, kết quả được render cuối cùng sẽ giống như sau:

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map` tương tự [việc biến đổi array bằng `map()`.](/learn/rendering-lists) Điểm khác biệt là cấu trúc dữ liệu `children` được xem là *opaque* (không trong suốt). Điều này có nghĩa là ngay cả khi đôi lúc nó là một array, bạn cũng không nên giả định nó là array hay bất kỳ kiểu dữ liệu cụ thể nào khác. Vì vậy, bạn nên sử dụng `Children.map` nếu cần biến đổi nó.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### Tại sao prop children không phải lúc nào cũng là một array? {/*why-is-the-children-prop-not-always-an-array*/}

Trong React, prop `children` được xem là một cấu trúc dữ liệu *opaque*. Điều này có nghĩa là bạn không nên dựa vào cách nó được cấu trúc. Để biến đổi, lọc hoặc đếm các children, bạn nên sử dụng các phương thức `Children`.

Trên thực tế, cấu trúc dữ liệu `children` thường được biểu diễn nội bộ dưới dạng một array. Tuy nhiên, nếu chỉ có một child, React sẽ không tạo thêm một array vì điều này gây ra overhead bộ nhớ không cần thiết. Miễn là bạn sử dụng các phương thức `Children` thay vì trực tiếp kiểm tra prop `children`, code của bạn sẽ không bị hỏng ngay cả khi React thay đổi cách triển khai thực tế của cấu trúc dữ liệu này.

Ngay cả khi `children` là một array, `Children.map` vẫn có hành vi đặc biệt hữu ích. Ví dụ, `Children.map` kết hợp [keys](/learn/rendering-lists#keeping-list-items-in-order-with-key) trên các phần tử được trả về với các key trên `children` mà bạn đã truyền vào. Điều này đảm bảo các children JSX ban đầu không bị "mất" key ngay cả khi chúng được bọc lại như trong ví dụ trên.

</DeepDive>

<Pitfall>

Cấu trúc dữ liệu `children` **không bao gồm output đã render** của các component mà bạn truyền dưới dạng JSX. Trong ví dụ dưới đây, `children` mà `RowList` nhận được chỉ chứa hai item thay vì ba:

1. `<p>This is the first item.</p>`
2. `<MoreRows />`

Đây là lý do vì sao chỉ có hai wrapper cho row được tạo trong ví dụ này:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**Không có cách nào để lấy output đã render của một component bên trong** như `<MoreRows />` khi thao tác với `children`. Đây là lý do [thường tốt hơn là sử dụng một trong các giải pháp thay thế.](#alternatives)

</Pitfall>

---

### Chạy một đoạn code cho mỗi child {/*running-some-code-for-each-child*/}

Gọi `Children.forEach` để lặp qua từng child trong cấu trúc dữ liệu `children`. Phương thức này không trả về giá trị nào và tương tự như phương thức [array `forEach`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) Bạn có thể sử dụng nó để chạy logic tùy chỉnh, chẳng hạn như tự tạo array.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

Như đã đề cập trước đó, không có cách nào để lấy output đã render của một component bên trong khi thao tác với `children`. Đây là lý do [thường tốt hơn là sử dụng một trong các giải pháp thay thế.](#alternatives)

</Pitfall>

---

### Đếm children {/*counting-children*/}

Gọi `Children.count(children)` để tính số lượng children.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

Như đã đề cập trước đó, không có cách nào để lấy output đã render của một component bên trong khi thao tác với `children`. Đây là lý do [thường tốt hơn là sử dụng một trong các giải pháp thay thế.](#alternatives)

</Pitfall>

---

### Chuyển children thành một array {/*converting-children-to-an-array*/}

Gọi `Children.toArray(children)` để chuyển cấu trúc dữ liệu `children` thành một array JavaScript thông thường. Điều này cho phép bạn thao tác với array bằng các phương thức array tích hợp sẵn như [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), hoặc [`reverse`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

Như đã đề cập trước đó, không có cách nào để lấy output đã render của một component bên trong khi thao tác với `children`. Đây là lý do [thường tốt hơn là sử dụng một trong các giải pháp thay thế.](#alternatives)

</Pitfall>

---

## Các giải pháp thay thế {/*alternatives*/}

<Note>

Phần này mô tả các giải pháp thay thế cho API `Children` (với chữ `C` viết hoa), được import như sau:

```js
import { Children } from 'react';
```

Đừng nhầm nó với [việc sử dụng prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) (chữ `c` viết thường), cách làm này là tốt và được khuyến khích.

</Note>

### Expose nhiều component {/*exposing-multiple-components*/}

Việc thao tác với children bằng các phương thức `Children` thường dẫn đến code dễ bị lỗi. Khi bạn truyền children cho một component trong JSX, thông thường bạn không mong đợi component đó thao tác hoặc biến đổi từng child riêng lẻ.

Khi có thể, hãy cố gắng tránh sử dụng các phương thức `Children`. Ví dụ, nếu bạn muốn mọi child của `RowList` được bọc trong `<div className="Row">`, hãy export một component `Row` và tự bọc từng row vào đó như sau:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Không giống như việc sử dụng `Children.map`, cách tiếp cận này không tự động bọc mọi child. **Tuy nhiên, cách tiếp cận này có một lợi ích đáng kể so với [ví dụ trước đó với `Children.map`](#transforming-children) vì nó vẫn hoạt động ngay cả khi bạn tiếp tục tách thêm component.** Ví dụ, nó vẫn hoạt động nếu bạn tách component `MoreRows` của riêng mình:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Cách này sẽ không hoạt động với `Children.map` vì nó sẽ "nhìn thấy" `<MoreRows />` như một child duy nhất (và một row duy nhất).

---

### Nhận một array các object làm prop {/*accepting-an-array-of-objects-as-a-prop*/}

Bạn cũng có thể truyền một array làm prop một cách rõ ràng. Ví dụ, `RowList` này nhận một array `rows` làm prop:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Vì `rows` là một array JavaScript thông thường, component `RowList` có thể sử dụng các phương thức array tích hợp sẵn như [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) trên đó.

Pattern này đặc biệt hữu ích khi bạn muốn có thể truyền thêm thông tin dưới dạng dữ liệu có cấu trúc cùng với children. Trong ví dụ dưới đây, component `TabSwitcher` nhận một array các object làm prop `tabs`:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

Không giống như việc truyền children dưới dạng JSX, cách tiếp cận này cho phép bạn liên kết một số dữ liệu bổ sung như `header` với từng item. Vì bạn đang trực tiếp làm việc với `tabs`, và nó là một array, bạn không cần các phương thức `Children`.

---

### Gọi render prop để tùy chỉnh việc render {/*calling-a-render-prop-to-customize-rendering*/}

Thay vì tạo JSX cho từng item, bạn cũng có thể truyền một function trả về JSX và gọi function đó khi cần. Trong ví dụ này, component `App` truyền một function `renderContent` cho component `TabSwitcher`. Component `TabSwitcher` chỉ gọi `renderContent` cho tab được chọn:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

Một prop như `renderContent` được gọi là *render prop* vì đó là một prop xác định cách render một phần giao diện người dùng. Tuy nhiên, không có gì đặc biệt về nó: đây là một prop thông thường, tình cờ có giá trị là một function.

Render prop là các function, vì vậy bạn có thể truyền thông tin cho chúng. Ví dụ, component `RowList` này truyền `id` và `index` của từng row cho render prop `renderRow`, trong đó sử dụng `index` để làm nổi bật các row chẵn:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row>
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

Đây là một ví dụ khác cho thấy các component cha và con có thể phối hợp với nhau mà không cần thao tác với children.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi truyền một custom component, nhưng các phương thức `Children` không hiển thị kết quả render của nó {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Giả sử bạn truyền hai child cho `RowList` như sau:

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

Nếu bạn thực hiện `Children.count(children)` bên trong `RowList`, bạn sẽ nhận được `2`. Ngay cả khi `MoreRows` render 10 item khác nhau, hoặc trả về `null`, `Children.count(children)` vẫn sẽ là `2`. Từ góc nhìn của `RowList`, nó chỉ "nhìn thấy" JSX mà nó nhận được. Nó không "nhìn thấy" phần nội bộ của component `MoreRows`.

Hạn chế này khiến việc tách một component trở nên khó khăn. Đây là lý do các phương án thay thế [alternatives](#alternatives) được ưu tiên hơn việc sử dụng `Children`.