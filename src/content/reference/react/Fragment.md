---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, thường được sử dụng qua cú pháp `<>...</>`, cho phép bạn nhóm các phần tử mà không cần node wrapper.

Fragment cũng có thể nhận refs, cho phép tương tác với các DOM node bên dưới mà không cần thêm phần tử wrapper.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `<Fragment>` {/*fragment*/}

Bọc các phần tử trong `<Fragment>` để nhóm chúng lại với nhau trong những tình huống bạn cần một phần tử duy nhất. Việc nhóm các phần tử trong `Fragment` không ảnh hưởng đến DOM kết quả; kết quả giống như khi các phần tử không được nhóm. Thẻ JSX rỗng `<></>` là cách viết tắt của `<Fragment></Fragment>` trong hầu hết trường hợp.

#### Props {/*props*/}

- **tùy chọn** `key`: Các Fragment được khai báo bằng cú pháp `<Fragment>` rõ ràng có thể có [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- **tùy chọn** `ref`: Một ref object (ví dụ: từ [`useRef`](/reference/react/useRef)) hoặc [callback function](/reference/react-dom/components/common#ref-callback). React cung cấp một `FragmentInstance` làm giá trị ref, triển khai các phương thức để tương tác với các DOM node được Fragment bọc.

#### Lưu ý {/*caveats*/}

* Nếu bạn muốn truyền `key` cho một Fragment, bạn không thể sử dụng cú pháp `<>...</>`. Bạn phải import `Fragment` một cách rõ ràng từ `'react'` và render `<Fragment key={yourKey}>...</Fragment>`.

* React không [reset state](/learn/preserving-and-resetting-state) khi bạn chuyển từ việc render `<><Child /></>` sang `[<Child />]` hoặc ngược lại, hoặc khi bạn chuyển từ việc render `<><Child /></>` sang `<Child />` rồi quay lại. Điều này chỉ hoạt động ở một cấp độ duy nhất: ví dụ, chuyển từ `<><><Child /></></>` sang `<Child />` sẽ reset state. Xem ngữ nghĩa chính xác [tại đây.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

* Nếu bạn muốn truyền `ref` cho một Fragment, bạn không thể sử dụng cú pháp `<>...</>`. Bạn phải import `Fragment` một cách rõ ràng từ `'react'` và render `<Fragment ref={yourRef}>...</Fragment>`.

---

### `FragmentInstance` {/*fragmentinstance*/}

Khi bạn truyền một `ref` cho Fragment, React cung cấp một object `FragmentInstance`. Object này triển khai các phương thức để tương tác với các DOM child ở cấp đầu tiên được Fragment bọc.

* [`addEventListener`](#addeventlistener) và [`removeEventListener`](#removeeventlistener) quản lý event listener trên tất cả DOM child ở cấp đầu tiên.
* [`dispatchEvent`](#dispatchevent) dispatch một event trên Fragment; event này có thể bubble lên DOM parent.
* [`focus`](#focus), [`focusLast`](#focuslast), và [`blur`](#blur) quản lý focus trên tất cả child lồng nhau theo thứ tự depth-first.
* [`observeUsing`](#observeusing) và [`unobserveUsing`](#unobserveusing) attach và detach các instance `IntersectionObserver` hoặc `ResizeObserver`.
* [`getClientRects`](#getclientrects) trả về các bounding rectangle của tất cả DOM child ở cấp đầu tiên.
* [`getRootNode`](#getrootnode) trả về root node của parent của Fragment.
* [`compareDocumentPosition`](#comparedocumentposition) so sánh vị trí của Fragment với một node khác.
* [`scrollIntoView`](#scrollintoview) cuộn các child của Fragment vào vùng hiển thị.

---

#### `addEventListener(type, listener, options?)` {/*addeventlistener*/}

Thêm một event listener vào tất cả DOM child ở cấp đầu tiên của Fragment.

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### Tham số {/*addeventlistener-parameters*/}

* `type`: Một chuỗi biểu diễn loại event cần lắng nghe (ví dụ: `'click'`, `'focus'`).
* `listener`: Hàm xử lý event.
* **tùy chọn** `options`: Một options object hoặc boolean cho capture, tương ứng với API [DOM `addEventListener`.](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

##### Giá trị trả về {/*addeventlistener-returns*/}

`addEventListener` không trả về gì (`undefined`).

---

#### `removeEventListener(type, listener, options?)` {/*removeeventlistener*/}

Xóa một event listener khỏi tất cả DOM child ở cấp đầu tiên của Fragment.

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### Tham số {/*removeeventlistener-parameters*/}

* `type`: Chuỗi loại event.
* `listener`: Hàm xử lý event cần xóa.
* **tùy chọn** `options`: Một options object hoặc boolean, tương ứng với API [DOM `removeEventListener`.](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)

##### Giá trị trả về {/*removeeventlistener-returns*/}

`removeEventListener` không trả về gì (`undefined`).

---

#### `dispatchEvent(event)` {/*dispatchevent*/}

Dispatch một event trên Fragment. Các event listener đã thêm sẽ được gọi, và event có thể bubble lên DOM parent của Fragment.

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### Tham số {/*dispatchevent-parameters*/}

* `event`: Một object [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) cần dispatch. Nếu `bubbles` là `true`, event sẽ bubble lên DOM node parent của Fragment.

##### Giá trị trả về {/*dispatchevent-returns*/}

`true` nếu event không bị hủy, `false` nếu `preventDefault()` được gọi.

---

#### `focus(options?)` {/*focus*/}

Đưa DOM node đầu tiên có thể focus trong Fragment vào focus. Không giống như khi gọi `element.focus()` trên một DOM element, phương thức này tìm kiếm tất cả child lồng nhau theo thứ tự depth-first cho đến khi tìm thấy một element có thể focus — không chỉ tìm chính element đó hoặc các child trực tiếp của nó.

```js
fragmentRef.current.focus();
```

##### Tham số {/*focus-parameters*/}

* **tùy chọn** `options`: Một object [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) (ví dụ: `{ preventScroll: true }`).

##### Giá trị trả về {/*focus-returns*/}

`focus` không trả về gì (`undefined`).

---

#### `focusLast(options?)` {/*focuslast*/}

Đưa DOM node cuối cùng có thể focus trong Fragment vào focus. Phương thức tìm kiếm các child lồng nhau theo thứ tự depth-first, sau đó duyệt theo thứ tự ngược lại.

```js
fragmentRef.current.focusLast();
```

##### Tham số {/*focuslast-parameters*/}

* **tùy chọn** `options`: Một object [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options).

##### Giá trị trả về {/*focuslast-returns*/}

`focusLast` không trả về gì (`undefined`).

---

#### `blur()` {/*blur*/}

Xóa focus khỏi active element nếu nó nằm trong Fragment. Nếu `document.activeElement` không nằm trong Fragment, `blur` sẽ không làm gì.

```js
fragmentRef.current.blur();
```

##### Giá trị trả về {/*blur-returns*/}

`blur` không trả về gì (`undefined`).

---

#### `observeUsing(observer)` {/*observeusing*/}

Bắt đầu theo dõi tất cả DOM child ở cấp đầu tiên của Fragment bằng observer được cung cấp.

```js
const observer = new IntersectionObserver(callback, options);
fragmentRef.current.observeUsing(observer);
```

##### Tham số {/*observeusing-parameters*/}

* `observer`: Một instance [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) hoặc [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).

##### Giá trị trả về {/*observeusing-returns*/}

`observeUsing` không trả về gì (`undefined`).

---

#### `unobserveUsing(observer)` {/*unobserveusing*/}

Dừng theo dõi các DOM child của Fragment bằng observer được chỉ định.

```js
fragmentRef.current.unobserveUsing(observer);
```

##### Tham số {/*unobserveusing-parameters*/}

* `observer`: Cùng instance `IntersectionObserver` hoặc `ResizeObserver` đã được truyền trước đó cho [`observeUsing`](#observeusing).

##### Giá trị trả về {/*unobserveusing-returns*/}

`unobserveUsing` không trả về gì (`undefined`).

---

#### `getClientRects()` {/*getclientrects*/}

Trả về một mảng phẳng gồm các object [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) biểu diễn bounding rectangle của tất cả DOM child ở cấp đầu tiên.

```js
const rects = fragmentRef.current.getClientRects();
```

##### Trả về {/*getclientrects-returns*/}

Một `Array<DOMRect>` chứa các hình chữ nhật giới hạn của tất cả phần tử con.

---

#### `getRootNode(options?)` {/*getrootnode*/}

Trả về node gốc chứa node DOM cha của Fragment, tương ứng với hành vi của [`Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode).

```js
const root = fragmentRef.current.getRootNode();
```

##### Tham số {/*getrootnode-parameters*/}

* **tùy chọn** `options`: Một object có thuộc tính boolean `composed`, tương ứng với API [DOM `getRootNode`. ](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#options)

##### Trả về {/*getrootnode-returns*/}

Một `Document`, `ShadowRoot`, hoặc chính `FragmentInstance` nếu không có node DOM cha.

---

#### `compareDocumentPosition(otherNode)` {/*comparedocumentposition*/}

So sánh vị trí trong document của Fragment với một node khác, trả về một bitmask tương ứng với hành vi của [`Node.compareDocumentPosition()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition).

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### Tham số {/*comparedocumentposition-parameters*/}

* `otherNode`: Node DOM cần so sánh.

##### Trả về {/*comparedocumentposition-returns*/}

Một bitmask gồm các [position flags](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value). Fragment rỗng và Fragment có các phần tử con được render thông qua một [portal](/reference/react-dom/createPortal) sẽ bao gồm `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` trong kết quả.

---

#### `scrollIntoView(alignToTop?)` {/*scrollintoview*/}

Cuộn các phần tử con của Fragment vào vùng hiển thị. Khi `alignToTop` là `true` hoặc bị bỏ qua, cuộn để căn phần tử con đầu tiên với đầu của ancestor có thể cuộn. Khi `alignToTop` là `false`, cuộn để căn phần tử con cuối cùng với đáy.

```js
fragmentRef.current.scrollIntoView();
```

##### Tham số {/*scrollintoview-parameters*/}

* **tùy chọn** `alignToTop`: Một boolean. Nếu `true` (mặc định), cuộn phần tử con đầu tiên lên đầu vùng có thể cuộn. Nếu `false`, cuộn phần tử con cuối cùng xuống đáy. Không giống [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView), phương thức này không chấp nhận object `ScrollIntoViewOptions`.

##### Trả về {/*scrollintoview-returns*/}

`scrollIntoView` không trả về gì (`undefined`).

##### Lưu ý {/*scrollintoview-caveats*/}

* `scrollIntoView` không chấp nhận object tùy chọn. Việc truyền object này sẽ gây ra lỗi. Thay vào đó, hãy sử dụng boolean `alignToTop`.
* Khi Fragment không có phần tử con, `scrollIntoView` sẽ cuộn sibling hoặc parent gần nhất vào vùng hiển thị như một phương án dự phòng.

---

#### `FragmentInstance` Lưu ý {/*fragmentinstance-caveats*/}

* Các phương thức nhắm đến phần tử con (chẳng hạn như `addEventListener`, `observeUsing` và `getClientRects`) hoạt động trên *các phần tử con host (DOM) cấp đầu tiên* của Fragment. Chúng không trực tiếp nhắm đến các phần tử con nằm bên trong một phần tử DOM khác.
* `focus` và `focusLast` tìm kiếm theo chiều sâu trong các phần tử con lồng nhau để tìm các phần tử có thể focus, khác với các phương thức event và observer vốn chỉ nhắm đến các phần tử host cấp đầu tiên.
* `observeUsing` không hoạt động trên các text node. React sẽ ghi log cảnh báo trong môi trường development nếu Fragment chỉ chứa các text children.
* React không áp dụng các event listener được thêm thông qua `addEventListener` cho các cây [`<Activity>`](/reference/react/Activity) bị ẩn. Khi một boundary `Activity` chuyển từ trạng thái ẩn sang hiển thị, các listener sẽ được tự động áp dụng.
* Mỗi phần tử DOM cấp đầu tiên của một Fragment có `ref` sẽ nhận thuộc tính `reactFragments`—một `Set<FragmentInstance>` chứa tất cả các instance Fragment sở hữu phần tử đó. Điều này cho phép [caching a shared observer](#caching-global-intersection-observer) trên nhiều Fragment.

---

## Cách sử dụng {/*usage*/}

### Trả về nhiều phần tử {/*returning-multiple-elements*/}

Sử dụng `Fragment`, hoặc cú pháp `<>...</>` tương đương, để nhóm nhiều phần tử lại với nhau. Bạn có thể dùng cách này để đặt nhiều phần tử ở bất kỳ vị trí nào mà một phần tử đơn lẻ có thể được đặt. Ví dụ, một component chỉ có thể trả về một phần tử, nhưng bằng cách sử dụng Fragment, bạn có thể nhóm nhiều phần tử lại với nhau rồi trả về chúng dưới dạng một nhóm:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragment hữu ích vì việc nhóm các phần tử bằng Fragment không ảnh hưởng đến layout hoặc styles, không giống như khi bạn bọc các phần tử trong một container khác, chẳng hạn như một phần tử DOM. Nếu kiểm tra ví dụ này bằng các công cụ trình duyệt, bạn sẽ thấy tất cả các node DOM `<h1>` và `<article>` xuất hiện dưới dạng các sibling mà không có wrapper bao quanh:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Làm thế nào để viết Fragment mà không dùng cú pháp đặc biệt? {/*how-to-write-a-fragment-without-the-special-syntax*/}

Ví dụ trên tương đương với việc import `Fragment` từ React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Thông thường bạn sẽ không cần làm vậy, trừ khi cần [pass a `key` to your `Fragment`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### Gán nhiều phần tử cho một biến {/*assigning-multiple-elements-to-a-variable*/}

Giống như mọi phần tử khác, bạn có thể gán các phần tử Fragment cho biến, truyền chúng dưới dạng props, v.v.:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### Nhóm các phần tử với văn bản {/*grouping-elements-with-text*/}

Bạn có thể sử dụng `Fragment` để nhóm văn bản với các component:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### Render danh sách Fragment {/*rendering-a-list-of-fragments*/}

Sau đây là một trường hợp bạn cần viết `Fragment` một cách tường minh thay vì sử dụng cú pháp `<></>`. Khi [render multiple elements in a loop](/learn/rendering-lists), bạn cần gán một `key` cho mỗi phần tử. Nếu các phần tử bên trong vòng lặp là Fragment, bạn cần sử dụng cú pháp phần tử JSX thông thường để cung cấp thuộc tính `key`:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Bạn có thể kiểm tra DOM để xác nhận rằng không có phần tử wrapper nào bao quanh các phần tử con của Fragment:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

---

### Thêm event listener mà không cần phần tử wrapper {/*adding-event-listeners-without-wrapper*/}

Fragment `ref`s cho phép bạn thêm event listener vào một nhóm phần tử mà không cần thêm node DOM wrapper. Sử dụng một [ref callback](/reference/react-dom/components/common#ref-callback) để gắn và dọn dẹp các listener:

<Sandpack>

```js
import { Fragment, useState, useRef, useEffect } from 'react';

function ClickableFragment({ children, onClick }) {
  const fragmentRef = useRef(null);
  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    if (fragmentInstance === null) {
      return;
    }
    fragmentInstance.addEventListener('click', onClick);
    return () => {
      fragmentInstance.removeEventListener(
        'click',
        onClick
      );
    };
  }, [onClick])
  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <p>Total clicks: {clicks}</p>
      <ClickableFragment onClick={() => {
        setClicks(c => c + 1);
      }}>
        <button>Button A</button>
        <button>Button B</button>
        <button>Button C</button>
      </ClickableFragment>
    </>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Lệnh gọi `addEventListener` áp dụng listener cho mọi phần tử DOM cấp đầu tiên của Fragment. Khi các phần tử con được thêm hoặc xóa một cách động, `FragmentInstance` sẽ tự động thêm hoặc xóa listener.

<DeepDive>

#### ref của Fragment nhắm đến những phần tử con nào? {/*which-children-does-a-fragment-ref-target*/}

Một `FragmentInstance` nhắm đến **các phần tử con host (DOM) cấp đầu tiên** của Fragment. Hãy xem cây sau:

```js
<Fragment ref={ref}>
  <div id="A" />
  <Wrapper>
    <div id="B">
      <div id="C" />
    </div>
  </Wrapper>
  <div id="D" />
</Fragment>
```

`Wrapper` là một component React, vì vậy `FragmentInstance` sẽ duyệt qua nó để tìm các node DOM. Các phần tử con được nhắm đến là `A`, `B` và `D`. `C` không được nhắm đến vì nó nằm bên trong phần tử DOM `B`.

Các phương thức như `addEventListener`, `observeUsing` và `getClientRects` hoạt động trên các phần tử DOM cấp đầu tiên này. `focus` và `focusLast` thì khác—chúng tìm kiếm qua *tất cả các phần tử con lồng nhau* theo chiều sâu để tìm các phần tử có thể focus.

</DeepDive>

---

### Quản lý focus trên một nhóm phần tử {/*managing-focus-across-elements*/}

Fragment `ref`s cung cấp các phương thức `focus`, `focusLast` và `blur` hoạt động trên tất cả node DOM bên trong Fragment:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function FormFields({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.focus();
        }}>
          Focus first
        </button>
        <button onClick={() => {
          fragmentRef.current.focusLast();
        }}>
          Focus last
        </button>
        <button onClick={() => {
          fragmentRef.current.blur();
        }}>
          Blur
        </button>
      </div>
      <Fragment ref={fragmentRef}>
        {children}
      </Fragment>
    </>
  );
}

// Dù các input được lồng sâu,
// focus() vẫn tìm chúng theo chiều sâu.
export default function App() {
  return (
    <FormFields>
      <fieldset>
        <legend>Shipping</legend>
        <label>
          Street: <input name="street" />
        </label>
        <label>
          City: <input name="city" />
        </label>
      </fieldset>
    </FormFields>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

label {
  display: inline-block;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Việc gọi `focus()` sẽ focus input `street`—dù nó nằm bên trong một `<fieldset>` và `<label>`. `focus()` tìm kiếm theo chiều sâu qua tất cả phần tử con lồng nhau, không chỉ các phần tử con trực tiếp của Fragment. `focusLast()` thực hiện tương tự theo chiều ngược lại, còn `blur()` loại bỏ focus nếu phần tử hiện đang được focus nằm bên trong Fragment.

---

### Cuộn một nhóm phần tử vào vùng hiển thị {/*scrolling-group-into-view*/}

Sử dụng `scrollIntoView` để cuộn các phần tử con của Fragment vào vùng hiển thị mà không cần phần tử wrapper. Truyền `true` (hoặc bỏ qua đối số) để cuộn phần tử con đầu tiên lên đầu. Truyền `false` để cuộn phần tử con cuối cùng xuống đáy:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function ScrollableSection({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.scrollIntoView();
        }}>
          Scroll to top
        </button>
        <button onClick={() => {
          fragmentRef.current.scrollIntoView(false);
        }}>
          Scroll to bottom
        </button>
      </div>
      <div className="container">
        <Fragment ref={fragmentRef}>
          {children}
        </Fragment>
      </div>
    </>
  );
}

const items = [];
for (let i = 1; i <= 25; i++) {
  items.push('Item ' + i);
}

export default function App() {
  return (
    <ScrollableSection>
      <h3>Section Start</h3>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
      <h3>Section End</h3>
    </ScrollableSection>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.container {
  height: 200px;
  overflow-y: auto;
  border: 2px solid #c4c4c4;
  border-radius: 4px;
  padding: 10px;
}

h3 {
  margin: 4px 0;
  /* Padding để xử lý offset của thanh điều hướng sticky toàn cục, chẳng hạn khi cuộn */
  padding-top: 4em;
  color: #1a73e8;
}

p {
  margin: 4px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Theo dõi khả năng hiển thị mà không cần phần tử wrapper {/*observing-visibility-without-wrapper*/}

Sử dụng `observeUsing` để gắn một `IntersectionObserver` vào tất cả phần tử DOM cấp đầu tiên của Fragment. Điều này cho phép bạn theo dõi khả năng hiển thị mà không yêu cầu các component con expose các `ref`s hoặc phải thêm một phần tử wrapper:

<Sandpack>

```js
import {
  Fragment,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import Card from './Card';

function VisibleGroup({ onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onVisibilityChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>
      <VisibleGroup onVisibilityChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </VisibleGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```

```js src/Card.js hidden
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Bộ nhớ đệm cho một IntersectionObserver toàn cục {/*caching-global-intersection-observer*/}

Một tối ưu hóa hiệu năng phổ biến cho các trang có nhiều observer là dùng chung một IntersectionObserver cho mỗi cấu hình, rồi chuyển các entry đến đúng callback dựa trên phần tử đã giao nhau. Các Fragment `ref` cũng hỗ trợ cùng mẫu này thông qua thuộc tính `reactFragments`.

Mỗi phần tử con DOM cấp đầu tiên của một Fragment có `ref` sẽ có thuộc tính `reactFragments`: một `Set` gồm các đối tượng `FragmentInstance` chứa phần tử đó. Khi observer dùng chung được kích hoạt, bạn có thể sử dụng thuộc tính này để tra cứu `FragmentInstance` nào sở hữu phần tử đang giao nhau và chạy đúng các callback.

<Sandpack>

```js src/App.js active
import { useState, useCallback } from 'react';
import ObservedGroup from './ObservedGroup';
import Card from './Card';

export default function App() {
  const [bgColor, setBgColor] = useState(null);

  const onGreen = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#d4edda');
    }
  }, []);

  const onBlue = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#cce5ff');
    }
  }, []);

  return (
    <div className="page" style={{
      background: bgColor || 'white',
    }}>
      <div className="filler">Scroll down</div>
      <ObservedGroup onIntersection={onGreen}>
        <Card title="Green section" className="green" />
      </ObservedGroup>
      <div className="filler" />
      <ObservedGroup onIntersection={onBlue}>
        <Card title="Blue section" className="blue" />
      </ObservedGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/ObservedGroup.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

const callbackMap = new WeakMap();
const observerCache = new Map();

function getOptionsKey(options) {
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '0px';
  const threshold = options?.threshold ?? 0;
  return `${rootMargin}|${threshold}`;
}

function getSharedObserver(
  fragmentInstance,
  onIntersection,
  options,
) {
  // Đăng ký callback này cho
  // fragment instance.
  const existing =
    callbackMap.get(fragmentInstance);
  callbackMap.set(
    fragmentInstance,
    existing
      ? [...existing, onIntersection]
      : [onIntersection],
  );

  const key = getOptionsKey(options);
  if (observerCache.has(key)) {
    return observerCache.get(key);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Tra cứu FragmentInstances nào sở hữu
        // phần tử này.
        const fragmentInstances =
          entry.target.reactFragments;
        if (fragmentInstances) {
          for (const inst of fragmentInstances) {
            const callbacks =
              callbackMap.get(inst) || [];
            callbacks.forEach(cb => cb(entry));
          }
        }
      }
    },
    options,
  );

  observerCache.set(key, observer);
  return observer;
}

export default function ObservedGroup({
  onIntersection,
  options,
  children,
}) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const fragmentInstance = fragmentRef.current;
    const observer = getSharedObserver(
      fragmentInstance,
      onIntersection,
      options,
    );
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
      callbackMap.delete(fragmentInstance);
    };
  }, [onIntersection, options]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}

.card.green {
  border-left: 3px solid #28a745;
}

.card.blue {
  border-left: 3px solid #007bff;
}
```

```js src/Card.js hidden
export default function Card({ title, className }) {
  return <div className={'card' + (className ? ' ' + className : '')}>{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Nhiều component `ObservedGroup` có cùng các tùy chọn sẽ dùng lại một `IntersectionObserver` duy nhất. Khi một trong hai section cuộn vào vùng hiển thị, observer dùng chung sẽ được kích hoạt và sử dụng `reactFragments` để chuyển entry đến đúng callback.
