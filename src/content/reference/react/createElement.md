---
title: createElement
---

<Intro>

`createElement` cho phép bạn tạo một React element. Đây là một cách thay thế cho việc viết [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Gọi `createElement` để tạo một React element với `type`, `props` và `children` đã cho.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[Xem thêm ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `type`: Đối số `type` phải là một React component type hợp lệ. Ví dụ: đó có thể là một chuỗi tên tag (chẳng hạn như `'div'` hoặc `'span'`), hoặc một React component (một function, một class hoặc một component đặc biệt như [`Fragment`](/reference/react/Fragment)).

* `props`: Đối số `props` phải là một object hoặc `null`. Nếu truyền `null`, giá trị này sẽ được xử lý giống như một object rỗng. React sẽ tạo một element với các props khớp với `props` mà bạn đã truyền. Lưu ý rằng `ref` và `key` từ object `props` của bạn là các giá trị đặc biệt và sẽ *không* có sẵn dưới dạng `element.props.ref` và `element.props.key` trên `element` được trả về. Chúng sẽ có sẵn dưới dạng `element.ref` và `element.key`.

* **tùy chọn** `...children`: Không hoặc nhiều child node. Chúng có thể là bất kỳ React node nào, bao gồm React element, string, number, [portal](/reference/react-dom/createPortal), node rỗng (`null`, `undefined`, `true` và `false`) và các array chứa React node.

#### Giá trị trả về {/*returns*/}

`createElement` trả về một object React element với một số thuộc tính:

* `type`: `type` mà bạn đã truyền.
* `props`: `props` mà bạn đã truyền, ngoại trừ `ref` và `key`.
* `ref`: `ref` mà bạn đã truyền. Nếu bị thiếu, giá trị là `null`.
* `key`: `key` mà bạn đã truyền, được chuyển thành string. Nếu bị thiếu, giá trị là `null`.

Thông thường, bạn sẽ return element từ component của mình hoặc biến nó thành child của một element khác. Mặc dù bạn có thể đọc các thuộc tính của element, tốt nhất là xem mỗi element như một giá trị opaque sau khi được tạo và chỉ render nó.

#### Lưu ý {/*caveats*/}

* Bạn phải **xem React element và props của chúng là [immutable](https://en.wikipedia.org/wiki/Immutable_object)** và không bao giờ thay đổi nội dung của chúng sau khi tạo. Trong môi trường development, React sẽ [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) element được trả về và thuộc tính `props` của nó ở mức shallow để thực thi điều này.

* Khi sử dụng JSX, **bạn phải bắt đầu tag bằng một chữ cái viết hoa để render custom component của riêng mình.** Nói cách khác, `<Something />` tương đương với `createElement(Something)`, nhưng `<something />` (chữ thường) tương đương với `createElement('something')` (lưu ý rằng đây là một string, vì vậy nó sẽ được xử lý như một HTML tag dựng sẵn).

* Bạn chỉ nên **truyền children dưới dạng nhiều đối số cho `createElement` nếu tất cả chúng đều được biết tĩnh,** chẳng hạn như `createElement('h1', {}, child1, child2, child3)`. Nếu children của bạn là dynamic, hãy truyền toàn bộ array làm đối số thứ ba: `createElement('ul', {}, listItems)`. Điều này đảm bảo React sẽ [warn bạn về các `key`s](/learn/rendering-lists#keeping-list-items-in-order-with-key) bị thiếu đối với mọi dynamic list. Điều này không cần thiết đối với các list tĩnh vì chúng không bao giờ thay đổi thứ tự.

---

## Cách sử dụng {/*usage*/}

### Tạo element không dùng JSX {/*creating-an-element-without-jsx*/}

Nếu bạn không thích [JSX](/learn/writing-markup-with-jsx) hoặc không thể sử dụng nó trong project của mình, bạn có thể dùng `createElement` làm cách thay thế.

Để tạo một element không dùng JSX, hãy gọi `createElement` với một <CodeStep step={1}>type</CodeStep>, <CodeStep step={2}>props</CodeStep> và <CodeStep step={3}>children</CodeStep>:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

<CodeStep step={3}>children</CodeStep> là tùy chọn và bạn có thể truyền bao nhiêu child tùy ý (ví dụ trên có ba child). Code này sẽ hiển thị một header `<h1>` cùng lời chào. Để so sánh, dưới đây là cùng ví dụ đó được viết lại bằng JSX:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

Để render React component của riêng mình, hãy truyền một function như `Greeting` làm <CodeStep step={1}>type</CodeStep> thay vì một string như `'h1'`:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

Với JSX, đoạn code sẽ trông như sau:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

Dưới đây là một ví dụ hoàn chỉnh được viết bằng `createElement`:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Và đây là cùng ví dụ đó được viết bằng JSX:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Cả hai phong cách viết code đều phù hợp, vì vậy bạn có thể sử dụng cách nào mình thích cho project. Lợi ích chính của JSX so với `createElement` là bạn dễ dàng thấy closing tag nào tương ứng với opening tag nào.

<DeepDive>

#### Chính xác thì React element là gì? {/*what-is-a-react-element-exactly*/}

Element là một mô tả nhẹ về một phần của user interface. Ví dụ: cả `<Greeting name="Taylor" />` và `createElement(Greeting, { name: 'Taylor' })` đều tạo ra một object như sau:

```js
// Slightly simplified
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**Lưu ý rằng việc tạo object này không render component `Greeting` hoặc tạo bất kỳ DOM element nào.**

React element giống một mô tả hơn--một chỉ dẫn để React render component `Greeting` vào lúc sau. Bằng cách return object này từ component `App` của bạn, bạn cho React biết cần làm gì tiếp theo.

Việc tạo element cực kỳ rẻ, vì vậy bạn không cần cố gắng tối ưu hóa hoặc tránh thực hiện thao tác này.

</DeepDive>