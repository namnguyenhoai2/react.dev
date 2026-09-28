---
title: Render có điều kiện
---

<Intro>

Các component của bạn thường cần hiển thị những nội dung khác nhau tùy theo các điều kiện khác nhau. Trong React, bạn có thể render JSX có điều kiện bằng cú pháp JavaScript như các câu lệnh `if`, `&&` và toán tử `? :`.

</Intro>

<YouWillLearn>

* Cách trả về JSX khác nhau tùy theo một điều kiện
* Cách đưa một phần JSX vào hoặc loại khỏi kết quả một cách có điều kiện
* Các cách viết tắt điều kiện phổ biến bạn sẽ gặp trong các codebase React

</YouWillLearn>

## Trả về JSX có điều kiện {/*conditionally-returning-jsx*/}

Giả sử bạn có một component `PackingList` render một vài `Item`s, trong đó mỗi mục có thể được đánh dấu là đã đóng gói hoặc chưa:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
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

Hãy chú ý rằng một số component `Item` có prop `isPacked` được đặt thành `true` thay vì `false`. Bạn muốn thêm dấu kiểm (✅) vào các mục đã đóng gói nếu `isPacked={true}`.

Bạn có thể viết điều này bằng một câu lệnh [`if`/`else`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) như sau:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Nếu prop `isPacked` là `true`, đoạn mã này **trả về một cây JSX khác.** Sau thay đổi này, một số mục sẽ có dấu kiểm ở cuối:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
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

Hãy thử chỉnh sửa nội dung được trả về trong từng trường hợp và xem kết quả thay đổi như thế nào!

Hãy chú ý cách bạn tạo logic rẽ nhánh bằng các câu lệnh JavaScript `if` và `return`. Trong React, luồng điều khiển (chẳng hạn như các điều kiện) được xử lý bằng JavaScript.

### Có điều kiện không trả về gì với `null` {/*conditionally-returning-nothing-with-null*/}

Trong một số tình huống, bạn sẽ không muốn render bất kỳ thứ gì. Ví dụ, giả sử bạn không muốn hiển thị các mục đã đóng gói. Một component phải trả về một giá trị nào đó. Trong trường hợp này, bạn có thể trả về `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Nếu `isPacked` là true, component sẽ không trả về gì, `null`. Nếu không, nó sẽ trả về JSX để render.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
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

Trên thực tế, việc trả về `null` từ một component không phổ biến, vì điều đó có thể khiến nhà phát triển đang cố render component này bất ngờ. Thông thường hơn, bạn sẽ đưa component vào hoặc loại component khỏi JSX của component cha một cách có điều kiện. Sau đây là cách thực hiện!

## Đưa JSX vào có điều kiện {/*conditionally-including-jsx*/}

Trong ví dụ trước, bạn kiểm soát cây JSX nào (nếu có!) sẽ được component trả về. Có thể bạn đã nhận thấy một số phần bị lặp lại trong kết quả render:

```js
<li className="item">{name} ✅</li>
```

rất giống với

```js
<li className="item">{name}</li>
```

Cả hai nhánh điều kiện đều trả về `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Mặc dù việc lặp lại này không gây hại, nó có thể khiến code khó bảo trì hơn. Nếu bạn muốn thay đổi `className` thì sao? Bạn sẽ phải thực hiện thay đổi đó ở hai vị trí trong code! Trong tình huống như vậy, bạn có thể đưa một phần JSX nhỏ vào một cách có điều kiện để code [DRY.](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

### Toán tử điều kiện (ternary) (`? :`) {/*conditional-ternary-operator--*/}

JavaScript có một cú pháp ngắn gọn để viết biểu thức điều kiện -- [toán tử điều kiện](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) hay còn gọi là "ternary operator".

Thay vì viết:

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Bạn có thể viết:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

Bạn có thể đọc đoạn này là *"nếu `isPacked` là true, thì (`?`) render `name + ' ✅'`, nếu không (`:`) render `name`"*.

<DeepDive>

#### Hai ví dụ này có hoàn toàn tương đương không? {/*are-these-two-examples-fully-equivalent*/}

Nếu xuất phát từ nền tảng lập trình hướng đối tượng, bạn có thể cho rằng hai ví dụ trên khác nhau một cách tinh tế vì một trong số chúng có thể tạo ra hai "instance" khác nhau của `<li>`. Nhưng các phần tử JSX không phải là "instance", vì chúng không chứa trạng thái nội bộ và không phải là các node DOM thực sự. Chúng là những mô tả nhẹ, giống như các bản thiết kế. Vì vậy, trên thực tế, hai ví dụ này *hoàn toàn tương đương*. [Bảo toàn và đặt lại state](/learn/preserving-and-resetting-state) giải thích chi tiết cách hoạt động này.

</DeepDive>

Bây giờ, giả sử bạn muốn bọc phần văn bản của mục đã hoàn thành trong một thẻ HTML khác, chẳng hạn như `<del>` để gạch ngang. Bạn có thể thêm nhiều dòng mới và dấu ngoặc đơn hơn để dễ lồng thêm JSX vào từng trường hợp:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
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

Cách viết này phù hợp với các điều kiện đơn giản, nhưng hãy sử dụng ở mức vừa phải. Nếu component của bạn trở nên rối rắm vì có quá nhiều markup điều kiện lồng nhau, hãy cân nhắc tách các child component để code gọn gàng hơn. Trong React, markup là một phần của code, vì vậy bạn có thể sử dụng các công cụ như biến và hàm để sắp xếp các biểu thức phức tạp.

### Toán tử AND logic (`&&`) {/*logical-and-operator-*/}

Một cách viết tắt phổ biến khác mà bạn sẽ gặp là [toán tử AND logic JavaScript (`&&`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) Bên trong các React component, toán tử này thường được dùng khi bạn muốn render một số JSX nếu điều kiện là true, **hoặc không render gì nếu không phải.** Với `&&`, bạn có thể chỉ render dấu kiểm nếu `isPacked` là `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

Bạn có thể đọc đoạn này là *"nếu `isPacked`, thì (`&&`) render dấu kiểm, nếu không thì không render gì"*.

Sau đây là kết quả khi chạy:

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

Một [biểu thức JavaScript &&](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) sẽ trả về giá trị ở vế phải của nó (trong trường hợp này là dấu kiểm) nếu vế trái (điều kiện của chúng ta) là `true`. Nhưng nếu điều kiện là `false`, toàn bộ biểu thức sẽ trở thành `false`. React xem `false` như một "khoảng trống" trong cây JSX, giống như `null` hoặc `undefined`, và không render gì tại vị trí đó.


<Pitfall>

**Đừng đặt số ở vế trái của `&&`.**

Để kiểm tra điều kiện, JavaScript tự động chuyển vế trái thành boolean. Tuy nhiên, nếu vế trái là `0`, toàn bộ biểu thức sẽ nhận giá trị đó (`0`), và React sẽ vui vẻ render chính `0` thay vì không render gì.

Ví dụ, một lỗi phổ biến là viết code như `messageCount && <p>New messages</p>`. Bạn có thể dễ dàng cho rằng đoạn code này không render gì khi `messageCount` là `0`, nhưng thực tế nó render chính `0`!

Để sửa lỗi, hãy biến vế trái thành boolean: `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### Gán JSX vào một biến có điều kiện {/*conditionally-assigning-jsx-to-a-variable*/}

Khi các cách viết tắt khiến việc viết code thông thường trở nên khó khăn, hãy thử sử dụng một câu lệnh `if` và một biến. Bạn có thể gán lại các biến được định nghĩa bằng [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), vì vậy hãy bắt đầu bằng cách cung cấp nội dung mặc định bạn muốn hiển thị, tức là tên:

```js
let itemContent = name;
```

Sử dụng một câu lệnh `if` để gán lại một biểu thức JSX cho `itemContent` nếu `isPacked` là `true`:

```js
if (isPacked) {
  itemContent = name + " ✅";
}
```

[Dấu ngoặc nhọn mở ra "cửa sổ nhìn vào JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Nhúng biến bằng dấu ngoặc nhọn vào cây JSX được trả về, lồng biểu thức đã tính trước đó bên trong JSX:

```js
<li className="item">
  {itemContent}
</li>
```

Cách viết này dài dòng nhất, nhưng cũng linh hoạt nhất. Sau đây là kết quả khi chạy:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
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

Cũng như trước, cách này không chỉ áp dụng cho văn bản mà còn cho JSX bất kỳ:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
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

Nếu chưa quen với JavaScript, ban đầu bạn có thể cảm thấy nhiều kiểu viết này khá choáng ngợp. Tuy nhiên, học chúng sẽ giúp bạn đọc và viết mọi code JavaScript -- không chỉ các React component! Trước hết, hãy chọn một kiểu mà bạn thích, sau đó tham khảo lại tài liệu này nếu quên cách hoạt động của các kiểu còn lại.

<Recap>

* Trong React, bạn điều khiển logic rẽ nhánh bằng JavaScript.
* Bạn có thể trả về một biểu thức JSX có điều kiện bằng câu lệnh `if`.
* Bạn có thể có điều kiện lưu một phần JSX vào một biến, sau đó đưa nó vào bên trong JSX khác bằng cách sử dụng dấu ngoặc nhọn.
* Trong JSX, `{cond ? <A /> : <B />}` có nghĩa là *"nếu `cond`, render `<A />`, nếu không thì `<B />`"*.
* Trong JSX, `{cond && <A />}` có nghĩa là *"nếu `cond`, render `<A />`, nếu không thì không render gì"*.
* Các cách viết tắt rất phổ biến, nhưng bạn không bắt buộc phải sử dụng chúng nếu thích `if` thông thường hơn.

</Recap>



<Challenges>

#### Hiển thị icon cho các mục chưa hoàn thành bằng `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Sử dụng toán tử điều kiện (`cond ? a : b`) để hiển thị ❌ nếu `isPacked` không phải là `true`.

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

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
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

</Solution>

#### Hiển thị mức độ quan trọng của mục bằng `&&` {/*show-the-item-importance-with-*/}

Trong ví dụ này, mỗi `Item` nhận một prop `importance` dạng số. Sử dụng toán tử `&&` để hiển thị "_(Mức độ quan trọng: X)_" ở dạng chữ nghiêng, nhưng chỉ với những mục có mức độ quan trọng khác không. Danh sách mục của bạn sẽ có dạng như sau:

* Bộ đồ du hành vũ trụ _(Mức độ quan trọng: 9)_
* Mũ bảo hiểm có chiếc lá vàng
* Ảnh của Tam _(Mức độ quan trọng: 6)_

Đừng quên thêm một khoảng trắng giữa hai nhãn!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="Space suit"
        />
        <Item
          importance={0}
          name="Helmet with a golden leaf"
        />
        <Item
          importance={6}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Đoạn mã sau sẽ thực hiện được điều đó:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          importance={9}
          name="Space suit"
        />
        <Item
          importance={0}
          name="Helmet with a golden leaf"
        />
        <Item
          importance={6}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Lưu ý rằng bạn phải viết `importance > 0 && ...` thay vì `importance && ...` để nếu `importance` là `0`, `0` sẽ không được render thành kết quả!

Trong lời giải này, hai điều kiện riêng biệt được sử dụng để chèn một khoảng trắng giữa tên và nhãn mức độ quan trọng. Ngoài ra, bạn có thể sử dụng Fragment với một khoảng trắng ở đầu: `importance > 0 && <> <i>...</i></>` hoặc thêm một khoảng trắng ngay bên trong `<i>`:  `importance > 0 && <i> ...</i>`.

</Solution>

#### Refactor một loạt `? :` thành `if` và các biến {/*refactor-a-series-of---to-if-and-variables*/}

Component `Drink` này sử dụng một loạt điều kiện `? :` để hiển thị các thông tin khác nhau tùy thuộc vào việc prop `name` là `"tea"` hay `"coffee"`. Vấn đề là thông tin về mỗi loại đồ uống bị phân tán qua nhiều điều kiện. Hãy refactor đoạn mã này để sử dụng một câu lệnh `if` duy nhất thay cho ba điều kiện `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Sau khi đã refactor đoạn mã để sử dụng `if`, bạn còn ý tưởng nào khác để đơn giản hóa nó không?

<Solution>

Có nhiều cách để thực hiện việc này, nhưng sau đây là một điểm bắt đầu:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Ở đây, thông tin về mỗi loại đồ uống được nhóm lại với nhau thay vì bị phân tán qua nhiều điều kiện. Điều này giúp việc thêm nhiều loại đồ uống hơn trong tương lai trở nên dễ dàng hơn.

Một giải pháp khác là loại bỏ hoàn toàn điều kiện bằng cách chuyển thông tin vào các object:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>