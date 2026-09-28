---
title: Tư duy theo React
---

<Intro>

React có thể thay đổi cách bạn suy nghĩ về những thiết kế mình nhìn thấy và các ứng dụng mình xây dựng. Khi xây dựng một giao diện người dùng với React, trước tiên bạn sẽ chia giao diện thành các phần gọi là *component*. Sau đó, bạn sẽ mô tả các trạng thái trực quan khác nhau cho từng component. Cuối cùng, bạn sẽ kết nối các component với nhau để dữ liệu truyền qua chúng. Trong tutorial này, chúng ta sẽ hướng dẫn bạn từng bước suy nghĩ khi xây dựng một bảng dữ liệu sản phẩm có chức năng tìm kiếm bằng React.

</Intro>

## Bắt đầu với bản mockup {/*start-with-the-mockup*/}

Hãy tưởng tượng bạn đã có một JSON API và một bản mockup từ designer.

JSON API trả về dữ liệu có dạng như sau:

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

Bản mockup trông như sau:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

Để triển khai UI trong React, thông thường bạn sẽ thực hiện theo năm bước giống nhau.

## Bước 1: Chia UI thành một hệ thống phân cấp component {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Bắt đầu bằng cách vẽ các hộp xung quanh từng component và subcomponent trong bản mockup, rồi đặt tên cho chúng. Nếu bạn làm việc với designer, có thể họ đã đặt tên cho các component này trong công cụ thiết kế của mình. Hãy hỏi họ!

Tùy vào nền tảng của mình, bạn có thể suy nghĩ về việc chia một thiết kế thành các component theo những cách khác nhau:

* **Lập trình**--sử dụng các kỹ thuật tương tự khi quyết định có nên tạo một function hoặc object mới hay không. Một kỹ thuật như vậy là [tách biệt mối quan tâm (separation of concerns)](https://en.wikipedia.org/wiki/Separation_of_concerns), nghĩa là một component về lý tưởng chỉ nên phụ trách một việc. Nếu component trở nên quá lớn, bạn nên phân rã nó thành các subcomponent nhỏ hơn.
* **CSS**--hãy cân nhắc những gì bạn sẽ tạo class selector cho. (Tuy nhiên, component có mức độ chi tiết thấp hơn một chút.)
* **Thiết kế**--hãy cân nhắc cách bạn sẽ sắp xếp các layer của thiết kế.

Nếu JSON của bạn có cấu trúc tốt, bạn thường sẽ nhận thấy nó tự nhiên ánh xạ vào cấu trúc component của UI. Đó là vì các model UI và data thường có cùng một information architecture--nghĩa là có cùng hình dạng. Hãy tách UI thành các component, trong đó mỗi component tương ứng với một phần của data model.

Màn hình này có năm component:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (màu xám) chứa toàn bộ ứng dụng.
2. `SearchBar` (màu xanh dương) nhận input của người dùng.
3. `ProductTable` (màu tím nhạt) hiển thị và lọc danh sách theo input của người dùng.
4. `ProductCategoryRow` (màu xanh lá) hiển thị heading cho từng category.
5. `ProductRow`	(màu vàng) hiển thị một row cho mỗi sản phẩm.

</CodeDiagram>

</FullWidth>

Nếu nhìn vào `ProductTable` (màu tím nhạt), bạn sẽ thấy table header (chứa các nhãn "Name" và "Price") không phải là một component riêng. Đây là vấn đề tùy theo sở thích, và bạn có thể chọn cách nào cũng được. Trong ví dụ này, nó là một phần của `ProductTable` vì nó xuất hiện bên trong danh sách của `ProductTable`. Tuy nhiên, nếu header này trở nên phức tạp (ví dụ: nếu bạn thêm chức năng sorting), bạn có thể chuyển nó thành một component `ProductTableHeader` riêng.

Bây giờ bạn đã xác định được các component trong bản mockup, hãy sắp xếp chúng thành một hệ thống phân cấp. Các component xuất hiện bên trong một component khác trong bản mockup nên xuất hiện dưới dạng child trong hệ thống phân cấp:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Bước 2: Xây dựng phiên bản tĩnh bằng React {/*step-2-build-a-static-version-in-react*/}

Bây giờ bạn đã có hệ thống phân cấp component, đã đến lúc triển khai ứng dụng. Cách tiếp cận trực tiếp nhất là xây dựng một phiên bản render UI từ data model mà chưa thêm tính tương tác... ít nhất là vào lúc này! Thường thì việc xây dựng phiên bản tĩnh trước rồi thêm tính tương tác sau sẽ dễ hơn. Xây dựng phiên bản tĩnh đòi hỏi phải gõ rất nhiều nhưng không cần suy nghĩ nhiều, trong khi thêm tính tương tác đòi hỏi phải suy nghĩ nhiều nhưng không cần gõ quá nhiều.

Để xây dựng một phiên bản tĩnh của ứng dụng có thể render data model, bạn sẽ muốn xây dựng các [component](/learn/your-first-component) có thể tái sử dụng các component khác và truyền dữ liệu bằng [props.](/learn/passing-props-to-a-component) Props là cách truyền dữ liệu từ parent xuống child. (Nếu bạn quen với khái niệm [state](/learn/state-a-components-memory), đừng sử dụng state khi xây dựng phiên bản tĩnh này. State chỉ dành cho tính tương tác, tức là dữ liệu thay đổi theo thời gian. Vì đây là phiên bản tĩnh của ứng dụng nên bạn không cần đến state.)

Bạn có thể xây dựng theo hướng "top down", bắt đầu từ các component ở vị trí cao hơn trong hệ thống phân cấp (như `FilterableProductTable`), hoặc theo hướng "bottom up", bắt đầu từ các component ở vị trí thấp hơn (như `ProductRow`). Trong những ví dụ đơn giản, thông thường xây dựng theo hướng top-down sẽ dễ hơn; còn trong các project lớn, xây dựng theo hướng bottom-up sẽ dễ hơn.

<Sandpack>

```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(Nếu đoạn code này trông có vẻ khó hiểu, trước tiên hãy xem qua [Quick Start](/learn/)!)

Sau khi xây dựng các component, bạn sẽ có một thư viện gồm các component có thể tái sử dụng để render data model. Vì đây là một ứng dụng tĩnh, các component sẽ chỉ trả về JSX. Component ở đầu hệ thống phân cấp (`FilterableProductTable`) sẽ nhận data model làm prop. Đây được gọi là _luồng dữ liệu một chiều_ vì dữ liệu truyền xuống từ component cấp cao nhất đến các component ở cuối cây.

<Pitfall>

Ở thời điểm này, bạn chưa nên sử dụng bất kỳ state value nào. Việc đó dành cho bước tiếp theo!

</Pitfall>

## Bước 3: Tìm biểu diễn tối thiểu nhưng đầy đủ của state UI {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Để làm cho UI có tính tương tác, bạn cần cho phép người dùng thay đổi data model bên dưới. Bạn sẽ sử dụng *state* cho việc này.

Hãy xem state là tập dữ liệu thay đổi tối thiểu mà ứng dụng cần ghi nhớ. Nguyên tắc quan trọng nhất khi cấu trúc state là giữ cho nó [DRY (Don't Repeat Yourself).](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) Hãy xác định biểu diễn tối thiểu tuyệt đối của state mà ứng dụng cần, rồi tính toán mọi thứ khác theo nhu cầu. Ví dụ, nếu bạn đang xây dựng một shopping list, bạn có thể lưu các item dưới dạng một array trong state. Nếu cũng muốn hiển thị số lượng item trong danh sách, đừng lưu số lượng item dưới dạng một state value khác--thay vào đó, hãy đọc length của array.

Bây giờ hãy nghĩ về tất cả các phần dữ liệu trong ứng dụng ví dụ này:

1. Danh sách sản phẩm ban đầu
2. Nội dung tìm kiếm người dùng đã nhập
3. Giá trị của checkbox
4. Danh sách sản phẩm đã lọc

Trong số này, phần nào là state? Hãy xác định những phần không phải state:

* Nó có **giữ nguyên không thay đổi** theo thời gian không? Nếu có, đó không phải state.
* Nó có **được truyền từ parent** thông qua props không? Nếu có, đó không phải state.
* **Bạn có thể tính toán nó** dựa trên state hoặc props hiện có trong component không? Nếu có, nó *chắc chắn* không phải state!

Những gì còn lại có thể là state.

Hãy cùng xem lại từng phần một:

1. Danh sách sản phẩm ban đầu **được truyền vào dưới dạng props, nên không phải state.**
2. Nội dung tìm kiếm có vẻ là state vì nó thay đổi theo thời gian và không thể được tính toán từ bất kỳ dữ liệu nào.
3. Giá trị của checkbox có vẻ là state vì nó thay đổi theo thời gian và không thể được tính toán từ bất kỳ dữ liệu nào.
4. Danh sách sản phẩm đã lọc **không phải state vì có thể được tính toán** bằng cách lấy danh sách sản phẩm ban đầu và lọc theo nội dung tìm kiếm cùng giá trị của checkbox.

Điều này có nghĩa là chỉ nội dung tìm kiếm và giá trị của checkbox là state! Làm tốt lắm!

<DeepDive>

#### Props và State {/*props-vs-state*/}

Trong React có hai loại dữ liệu "model": props và state. Hai loại này rất khác nhau:

* [**Props** giống như các argument bạn truyền](/learn/passing-props-to-a-component) vào một function. Chúng cho phép parent component truyền dữ liệu cho child component và tùy chỉnh giao diện của child component. Ví dụ, một `Form` có thể truyền một prop `color` cho một `Button`.
* [**State** giống như bộ nhớ của một component.](/learn/state-a-components-memory) Nó cho phép component theo dõi một số thông tin và thay đổi thông tin đó để phản hồi các tương tác. Ví dụ, một `Button` có thể theo dõi `isHovered` state.

Props và state khác nhau, nhưng chúng hoạt động cùng nhau. Một parent component thường sẽ lưu một số thông tin trong state (để có thể thay đổi thông tin đó), rồi *truyền xuống* cho các child component dưới dạng props của chúng. Nếu sự khác biệt này vẫn còn hơi mơ hồ ở lần đọc đầu tiên thì cũng không sao. Bạn cần luyện tập một chút để thực sự hiểu rõ nó!

</DeepDive>

## Bước 4: Xác định state nên được đặt ở đâu {/*step-4-identify-where-your-state-should-live*/}

Sau khi xác định dữ liệu state tối thiểu của ứng dụng, bạn cần xác định component nào chịu trách nhiệm thay đổi state này, hay component nào *sở hữu* state. Hãy nhớ rằng React sử dụng luồng dữ liệu một chiều, truyền dữ liệu xuống theo hệ thống phân cấp component, từ parent đến child component. Có thể ngay lập tức bạn chưa thấy rõ component nào nên sở hữu state nào. Điều này có thể là một thử thách nếu bạn mới làm quen với khái niệm này, nhưng bạn có thể tìm ra bằng cách làm theo các bước sau!

Với mỗi phần state trong ứng dụng:

1. Xác định *mọi* component render nội dung dựa trên state đó.
2. Tìm component cha chung gần nhất của chúng--một component nằm phía trên tất cả chúng trong hệ phân cấp.
3. Quyết định nơi state sẽ tồn tại:
    1. Thông thường, bạn có thể đặt state trực tiếp vào component cha chung của chúng.
    2. Bạn cũng có thể đặt state vào một component nào đó nằm phía trên component cha chung.
    3. Nếu không thể tìm được component nào phù hợp để sở hữu state, hãy tạo một component mới chỉ để lưu state và thêm nó vào đâu đó trong hệ phân cấp, phía trên component cha chung.

Ở bước trước, bạn đã tìm thấy hai phần state trong ứng dụng này: văn bản trong ô tìm kiếm và giá trị của checkbox. Trong ví dụ này, chúng luôn xuất hiện cùng nhau, vì vậy đặt chúng vào cùng một nơi là hợp lý.

Bây giờ, hãy áp dụng chiến lược của chúng ta cho chúng:

1. **Xác định các component sử dụng state:**
    * `ProductTable` cần lọc danh sách sản phẩm dựa trên state đó (văn bản tìm kiếm và giá trị checkbox).
    * `SearchBar` cần hiển thị state đó (văn bản tìm kiếm và giá trị checkbox).
2. **Tìm component cha chung:** Component cha đầu tiên mà cả hai component cùng chia sẻ là `FilterableProductTable`.
3. **Quyết định nơi state tồn tại**: Chúng ta sẽ giữ các giá trị văn bản bộ lọc và trạng thái đã chọn trong `FilterableProductTable`.

Vì vậy, các giá trị state sẽ nằm trong `FilterableProductTable`.

Thêm state vào component bằng Hook [`useState()`. ](/reference/react/useState) Hooks là những hàm đặc biệt cho phép bạn “hook vào” React. Thêm hai biến state ở đầu `FilterableProductTable` và chỉ định state ban đầu của chúng:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
```

Sau đó, truyền `filterText` và `inStockOnly` vào `ProductTable` và `SearchBar` dưới dạng props:

```js
<div>
  <SearchBar
    filterText={filterText}
    inStockOnly={inStockOnly} />
  <ProductTable
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

Bạn có thể bắt đầu hình dung ứng dụng của mình sẽ hoạt động như thế nào. Hãy chỉnh sửa giá trị ban đầu `filterText` từ `useState('')` thành `useState('fruit')` trong mã sandbox bên dưới. Bạn sẽ thấy cả văn bản trong ô tìm kiếm và bảng đều được cập nhật:

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."/>
      <label>
        <input
          type="checkbox"
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Lưu ý rằng việc chỉnh sửa form vẫn chưa hoạt động. Có một lỗi console trong sandbox ở trên giải thích lý do:

<ConsoleBlock level="error">

Bạn đã cung cấp prop \`value\` cho một trường form mà không có handler \`onChange\`. Điều này sẽ render một trường chỉ đọc.

</ConsoleBlock>

Trong sandbox ở trên, `ProductTable` và `SearchBar` đọc các prop `filterText` và `inStockOnly` để render bảng, ô nhập liệu và checkbox. Ví dụ, sau đây là cách `SearchBar` điền giá trị cho ô nhập liệu:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."/>
```

Tuy nhiên, bạn vẫn chưa thêm mã để phản hồi các thao tác của người dùng, chẳng hạn như thao tác nhập văn bản. Đây sẽ là bước cuối cùng của bạn.


## Bước 5: Thêm luồng dữ liệu ngược {/*step-5-add-inverse-data-flow*/}

Hiện tại, ứng dụng của bạn render chính xác với props và state truyền xuống theo hệ phân cấp. Nhưng để thay đổi state theo dữ liệu đầu vào của người dùng, bạn cần hỗ trợ dữ liệu truyền theo hướng ngược lại: các component form nằm sâu trong hệ phân cấp cần cập nhật state trong `FilterableProductTable`.

React làm cho luồng dữ liệu này trở nên tường minh, nhưng yêu cầu bạn viết nhiều mã hơn một chút so với two-way data binding. Nếu thử nhập văn bản hoặc chọn checkbox trong ví dụ trên, bạn sẽ thấy React bỏ qua dữ liệu nhập vào. Đây là chủ đích. Bằng cách viết `<input value={filterText} />`, bạn đã đặt prop `value` của `input` luôn bằng state `filterText` được truyền từ `FilterableProductTable`. Vì state `filterText` không bao giờ được cập nhật, ô nhập liệu không bao giờ thay đổi.

Bạn cần làm cho state cập nhật để phản ánh những thay đổi đó mỗi khi người dùng thay đổi các ô nhập liệu trong form. State thuộc sở hữu của `FilterableProductTable`, vì vậy chỉ component này mới có thể gọi `setFilterText` và `setInStockOnly`. Để cho phép `SearchBar` cập nhật state của `FilterableProductTable`, bạn cần truyền các hàm này xuống `SearchBar`:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

Bên trong `SearchBar`, bạn sẽ thêm các event handler `onChange` và cập nhật state của component cha từ đó:

```js {4,5,13,19}
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

Bây giờ ứng dụng đã hoạt động hoàn chỉnh!

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText} placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Bạn có thể tìm hiểu toàn bộ về cách xử lý event và cập nhật state trong phần [Thêm tính tương tác](/learn/adding-interactivity).

## Tiếp theo nên làm gì {/*where-to-go-from-here*/}

Đây là phần giới thiệu rất ngắn gọn về cách tư duy khi xây dựng component và ứng dụng với React. Bạn có thể [bắt đầu một dự án React](/learn/installation) ngay bây giờ hoặc [tìm hiểu sâu hơn về toàn bộ cú pháp](/learn/describing-the-ui) được sử dụng trong tutorial này.