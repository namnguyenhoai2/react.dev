---
title: Chia sẻ State giữa các Component
---

<Intro>

Đôi khi, bạn muốn state của hai component luôn thay đổi cùng nhau. Để làm điều đó, hãy loại bỏ state khỏi cả hai component, chuyển state vào parent gần nhất mà chúng cùng có, sau đó truyền state xuống cho chúng thông qua props. Cách này được gọi là *lifting state up* và đây là một trong những việc phổ biến nhất bạn sẽ làm khi viết code React.

</Intro>

<YouWillLearn>

- Cách chia sẻ state giữa các component bằng cách lifting state up
- Component controlled và uncontrolled là gì

</YouWillLearn>

## Ví dụ về lifting state up {/*lifting-state-up-by-example*/}

Trong ví dụ này, một component parent `Accordion` render hai `Panel` riêng biệt:

* `Accordion`
  - `Panel`
  - `Panel`

Mỗi component `Panel` có một state boolean `isActive` xác định nội dung của nó có hiển thị hay không.

Nhấn nút Show trên cả hai panel:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Hãy chú ý rằng việc nhấn nút của một panel không ảnh hưởng đến panel còn lại--chúng hoạt động độc lập.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Both Panel components contain isActive with value false.">

Ban đầu, state `isActive` của mỗi `Panel` là `false`, vì vậy cả hai đều hiển thị ở trạng thái thu gọn

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="The same diagram as the previous, with the isActive of the first child Panel component highlighted indicating a click with the isActive value set to true. The second Panel component still contains value false." >

Việc nhấp vào nút của `Panel` sẽ chỉ cập nhật state `isActive` của riêng `Panel`

</Diagram>

</DiagramGroup>

**Nhưng bây giờ hãy giả sử bạn muốn thay đổi để tại mỗi thời điểm chỉ có một panel được mở rộng.** Với thiết kế đó, việc mở rộng panel thứ hai sẽ thu gọn panel thứ nhất. Bạn sẽ làm điều đó như thế nào?

Để điều phối hai panel này, bạn cần "lift state của chúng lên" một component parent theo ba bước:

1. **Loại bỏ** state khỏi các component con.
2. **Truyền** dữ liệu hardcoded từ parent chung.
3. **Thêm** state vào parent chung và truyền state xuống cùng với các event handler.

Điều này sẽ cho phép component `Accordion` điều phối cả hai `Panel` và chỉ mở rộng một panel tại một thời điểm.

### Bước 1: Loại bỏ state khỏi các component con {/*step-1-remove-state-from-the-child-components*/}

Bạn sẽ trao quyền điều khiển `isActive` của `Panel` cho component parent của nó. Điều này có nghĩa là component parent sẽ truyền `isActive` vào `Panel` dưới dạng prop. Trước tiên, hãy **xóa dòng này** khỏi component `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

Thay vào đó, hãy thêm `isActive` vào danh sách props của `Panel`:

```js
function Panel({ title, children, isActive }) {
```

Giờ đây, component parent của `Panel` có thể *điều khiển* `isActive` bằng cách [truyền nó xuống dưới dạng prop.](/learn/passing-props-to-a-component) Ngược lại, component `Panel` giờ đây *không còn quyền kiểm soát* giá trị của `isActive`--giá trị này giờ phụ thuộc vào component parent!

### Bước 2: Truyền dữ liệu hardcoded từ parent chung {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Để lift state lên, bạn phải xác định component parent chung gần nhất của **cả hai** component con mà bạn muốn điều phối:

* `Accordion` *(parent chung gần nhất)*
  - `Panel`
  - `Panel`

Trong ví dụ này, đó là component `Accordion`. Vì component này nằm phía trên cả hai panel và có thể điều khiển props của chúng, nó sẽ trở thành "source of truth" cho biết panel nào hiện đang active. Hãy để component `Accordion` truyền một giá trị hardcoded của `isActive` (ví dụ: `true`) cho cả hai panel:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Hãy thử chỉnh sửa các giá trị `isActive` hardcoded trong component `Accordion` và xem kết quả trên màn hình.

### Bước 3: Thêm state vào parent chung {/*step-3-add-state-to-the-common-parent*/}

Việc lifting state up thường làm thay đổi bản chất của dữ liệu bạn lưu trong state.

Trong trường hợp này, mỗi thời điểm chỉ nên có một panel active. Điều đó có nghĩa là component parent chung `Accordion` cần theo dõi *panel nào* đang active. Thay vì một giá trị `boolean`, bạn có thể dùng một number làm index của `Panel` active cho biến state:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Khi `activeIndex` là `0`, panel thứ nhất active, còn khi nó là `1`, panel thứ hai active.

Việc nhấp vào nút "Show" trong `Panel` cần thay đổi index active trong `Accordion`. Một `Panel` không thể trực tiếp thiết lập state `activeIndex` vì state này được định nghĩa bên trong `Accordion`. Component `Accordion` cần *cho phép rõ ràng* component `Panel` thay đổi state của nó bằng cách [truyền một event handler xuống dưới dạng prop](/learn/responding-to-events#passing-event-handlers-as-props):

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

`<button>` bên trong `Panel` giờ đây sẽ dùng prop `onShow` làm click event handler:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Vậy là bạn đã hoàn tất việc lifting state up! Việc chuyển state vào component parent chung cho phép bạn điều phối hai panel. Việc sử dụng index active thay vì hai cờ "is shown" đảm bảo rằng tại mỗi thời điểm chỉ có một panel active. Đồng thời, việc truyền event handler xuống component con cho phép component con thay đổi state của parent.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Accordion contains an activeIndex value of zero which turns into isActive value of true passed to the first Panel, and isActive value of false passed to the second Panel." >

Ban đầu, `Accordion`'s `activeIndex` là `0`, vì vậy `Panel` đầu tiên nhận được `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="The same diagram as the previous, with the activeIndex value of the parent Accordion component highlighted indicating a click with the value changed to one. The flow to both of the children Panel components is also highlighted, and the isActive value passed to each child is set to the opposite: false for the first Panel and true for the second one." >

Khi state `activeIndex` của `Accordion` thay đổi thành `1`, `Panel` thứ hai sẽ nhận `isActive = true` thay thế

</Diagram>

</DiagramGroup>

<DeepDive>

#### Component controlled và uncontrolled {/*controlled-and-uncontrolled-components*/}

Thông thường, một component có state cục bộ được gọi là "uncontrolled". Ví dụ, component `Panel` ban đầu với biến state `isActive` là uncontrolled vì parent của nó không thể tác động đến việc panel có active hay không.

Ngược lại, bạn có thể gọi một component là "controlled" khi thông tin quan trọng bên trong nó được điều khiển bởi props thay vì state cục bộ của chính nó. Điều này cho phép component parent chỉ định hoàn toàn behavior của component. Component `Panel` cuối cùng với prop `isActive` được component `Accordion` điều khiển.

Các component uncontrolled dễ sử dụng hơn bên trong parent vì chúng yêu cầu ít cấu hình hơn. Tuy nhiên, chúng kém linh hoạt hơn khi bạn muốn điều phối chúng với nhau. Các component controlled linh hoạt tối đa, nhưng yêu cầu component parent cấu hình đầy đủ cho chúng bằng props.

Trên thực tế, "controlled" và "uncontrolled" không phải là các thuật ngữ kỹ thuật chặt chẽ--mỗi component thường có sự kết hợp giữa state cục bộ và props. Tuy nhiên, đây là cách hữu ích để nói về cách component được thiết kế và những khả năng mà chúng cung cấp.

Khi viết một component, hãy cân nhắc thông tin nào trong đó nên được controlled (thông qua props), và thông tin nào nên được uncontrolled (thông qua state). Nhưng bạn luôn có thể thay đổi quyết định và refactor sau này.

</DeepDive>

## Một source of truth duy nhất cho mỗi state {/*a-single-source-of-truth-for-each-state*/}

Trong một ứng dụng React, nhiều component sẽ có state riêng. Một số state có thể "sống" gần các component lá (các component ở cuối cây) như input. Một số state khác có thể "sống" gần phía trên của ứng dụng hơn. Ví dụ, ngay cả các thư viện routing phía client thường được triển khai bằng cách lưu route hiện tại trong state React và truyền nó xuống qua props!

**Với mỗi phần state duy nhất, bạn sẽ chọn component "sở hữu" nó.** Nguyên tắc này còn được gọi là ["single source of truth".](https://en.wikipedia.org/wiki/Single_source_of_truth) Điều đó không có nghĩa là toàn bộ state nằm ở một nơi--mà với _mỗi_ phần state, sẽ có một component _cụ thể_ lưu giữ thông tin đó. Thay vì nhân bản state được chia sẻ giữa các component, hãy *lift state lên* parent chung mà chúng cùng có, rồi *truyền state xuống* cho các component con cần nó.

Ứng dụng của bạn sẽ thay đổi trong quá trình làm việc. Việc bạn di chuyển state xuống hoặc đưa state trở lại lên là điều rất thường gặp trong khi vẫn đang xác định nơi mỗi phần state "sống". Tất cả đều là một phần của quy trình!

Để xem điều này diễn ra như thế nào trong thực tế với thêm một vài component, hãy đọc [Thinking in React.](/learn/thinking-in-react)

<Recap>

* Khi muốn điều phối hai component, hãy chuyển state của chúng vào parent chung.
* Sau đó, truyền thông tin xuống thông qua props từ parent chung.
* Cuối cùng, truyền các event handler xuống để component con có thể thay đổi state của parent.
* Việc xem component là "controlled" (được điều khiển bởi props) hay "uncontrolled" (được điều khiển bởi state) là điều hữu ích.

</Recap>

<Challenges>

#### Các input được đồng bộ {/*synced-inputs*/}

Hai input này hoạt động độc lập. Hãy giữ chúng đồng bộ: việc chỉnh sửa một input phải cập nhật input còn lại bằng cùng đoạn văn bản và ngược lại.

<Hint>

Bạn sẽ cần lift state của chúng lên component parent.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Di chuyển biến state `text` vào component cha cùng với handler `handleChange`. Sau đó truyền chúng xuống dưới dạng props cho cả hai component `Input`. Điều này sẽ giữ cho chúng luôn đồng bộ.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Lọc một danh sách {/*filtering-a-list*/}

Trong ví dụ này, `SearchBar` có state `query` riêng để điều khiển ô nhập văn bản. Component cha `FilterableList` của nó hiển thị một `List` các mục, nhưng không xét đến truy vấn tìm kiếm.

Sử dụng hàm `filterItems(foods, query)` để lọc danh sách theo truy vấn tìm kiếm. Để kiểm tra các thay đổi, hãy xác nhận rằng khi nhập "s" vào ô nhập, danh sách được lọc còn "Sushi", "Shish kebab" và "Dim sum".

Lưu ý rằng `filterItems` đã được triển khai và import sẵn, vì vậy bạn không cần tự viết nó!

<Hint>

Bạn sẽ cần xóa state `query` và handler `handleChange` khỏi `SearchBar`, rồi chuyển chúng sang `FilterableList`. Sau đó truyền chúng xuống `SearchBar` dưới dạng các prop `query` và `onChange`.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

Đưa state `query` lên component `FilterableList`. Gọi `filterItems(foods, query)` để lấy danh sách đã lọc và truyền danh sách đó xuống `List`. Giờ đây, việc thay đổi input truy vấn sẽ được phản ánh trong danh sách:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>