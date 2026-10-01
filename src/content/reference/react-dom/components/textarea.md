---
title: "<textarea>"
---

<Intro>

Component [built-in browser `<textarea>` này](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) cho phép bạn hiển thị một ô nhập văn bản nhiều dòng.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<textarea>` {/*textarea*/}

Để hiển thị một text area, hãy render component [built-in browser `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<textarea>` hỗ trợ tất cả [common element props.](/reference/react-dom/components/common#common-props)

Bạn có thể [biến một text area thành controlled](#controlling-a-text-area-with-a-state-variable) bằng cách truyền prop `value`:

* `value`: Một string. Điều khiển văn bản bên trong text area.

Khi truyền `value`, bạn cũng phải truyền một handler `onChange` để cập nhật giá trị đã truyền.

Nếu `<textarea>` của bạn là uncontrolled, thay vào đó bạn có thể truyền prop `defaultValue`:

* `defaultValue`: Một string. Chỉ định [giá trị ban đầu](#providing-an-initial-value-for-a-text-area) cho một text area.

Các props `<textarea>` này áp dụng cho cả text area uncontrolled và controlled:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): Có thể là `'on'` hoặc `'off'`. Chỉ định hành vi autocomplete.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): Một boolean. Nếu `true`, React sẽ focus element khi mount.
* `children`: `<textarea>` không chấp nhận children. Để đặt giá trị ban đầu, hãy dùng `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): Một number. Chỉ định chiều rộng mặc định theo độ rộng trung bình của ký tự. Mặc định là `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): Một boolean. Nếu `true`, input sẽ không có tính tương tác và hiển thị mờ.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): Một string. Chỉ định `id` của `<form>` mà input này thuộc về. Nếu bỏ qua, đó là form cha gần nhất.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): Một number. Chỉ định độ dài tối đa của văn bản.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): Một number. Chỉ định độ dài tối thiểu của văn bản.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Một string. Chỉ định tên của input sẽ được [gửi cùng form.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: Một hàm handler [`Event`](/reference/react-dom/components/common#event-handler). Bắt buộc đối với text area [controlled.](#controlling-a-text-area-with-a-state-variable) Được gọi ngay khi giá trị của input bị người dùng thay đổi (ví dụ: được gọi sau mỗi lần nhấn phím). Hoạt động giống như event [`input` của browser.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Một phiên bản của `onChange` được gọi trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Một hàm handler [`Event`](/reference/react-dom/components/common#event-handler). Được gọi ngay khi giá trị bị người dùng thay đổi. Vì lý do lịch sử, trong React, cách dùng phổ biến là sử dụng `onChange` để thay thế, hoạt động tương tự.
* `onInputCapture`: Một phiên bản của `onInput` được gọi trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Một hàm handler [`Event`](/reference/react-dom/components/common#event-handler). Được gọi nếu input không vượt qua validation khi submit form. Không giống event `invalid` tích hợp sẵn, event `onInvalid` của React sẽ bubble.
* `onInvalidCapture`: Một phiên bản của `onInvalid` được gọi trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): Một hàm handler [`Event`](/reference/react-dom/components/common#event-handler). Được gọi sau khi selection bên trong `<textarea>` thay đổi. React mở rộng event `onSelect` để event này cũng được gọi khi selection rỗng và khi chỉnh sửa (có thể ảnh hưởng đến selection).
* `onSelectCapture`: Một phiên bản của `onSelect` được gọi trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): Một string. Hiển thị bằng màu mờ khi giá trị của text area rỗng.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): Một boolean. Nếu `true`, người dùng không thể chỉnh sửa text area.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): Một boolean. Nếu `true`, phải cung cấp giá trị để form có thể submit.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): Một number. Chỉ định chiều cao mặc định theo chiều cao trung bình của ký tự. Mặc định là `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): Có thể là `'hard'`, `'soft'` hoặc `'off'`. Chỉ định cách văn bản được wrap khi submit form.

#### Lưu ý {/*caveats*/}

- Không được truyền children như `<textarea>something</textarea>`. [Hãy dùng `defaultValue` cho nội dung ban đầu.](#providing-an-initial-value-for-a-text-area)
- Nếu text area nhận prop `value` là một string, nó sẽ được [coi là controlled.](#controlling-a-text-area-with-a-state-variable)
- Một text area không thể vừa controlled vừa uncontrolled cùng lúc.
- Một text area không thể chuyển đổi giữa controlled và uncontrolled trong suốt vòng đời của nó.
- Mọi text area controlled đều cần một event handler `onChange` để đồng bộ cập nhật giá trị nền của nó.

---

## Cách dùng {/*usage*/}

### Hiển thị một text area {/*displaying-a-text-area*/}

Render `<textarea>` để hiển thị một text area. Bạn có thể chỉ định kích thước mặc định bằng các thuộc tính [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) và [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols), nhưng theo mặc định người dùng có thể resize nó. Để tắt việc resize, bạn có thể chỉ định `resize: none` trong CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Cung cấp label cho một text area {/*providing-a-label-for-a-text-area*/}

Thông thường, bạn sẽ đặt mỗi `<textarea>` bên trong một thẻ [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Điều này cho browser biết rằng label này liên kết với text area đó. Khi người dùng nhấp vào label, browser sẽ focus text area. Đây cũng là điều thiết yếu đối với accessibility: screen reader sẽ đọc nội dung label khi người dùng focus text area.

Nếu không thể lồng `<textarea>` vào `<label>`, hãy liên kết chúng bằng cách truyền cùng một ID cho `<textarea id>` và [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Để tránh xung đột giữa các instance của cùng một component, hãy tạo ID như vậy bằng [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Cung cấp giá trị ban đầu cho một text area {/*providing-an-initial-value-for-a-text-area*/}

Bạn có thể tùy chọn chỉ định giá trị ban đầu cho text area. Truyền giá trị đó dưới dạng string `defaultValue`.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

Không giống như trong HTML, việc truyền văn bản ban đầu như `<textarea>Some content</textarea>` không được hỗ trợ.

</Pitfall>

---

### Đọc giá trị của vùng văn bản khi gửi biểu mẫu {/*reading-the-text-area-value-when-submitting-a-form*/}

Thêm một [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) bao quanh textarea của bạn, bên trong có một [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button). Nó sẽ gọi trình xử lý sự kiện `<form onSubmit>` của bạn. Theo mặc định, trình duyệt sẽ gửi dữ liệu biểu mẫu đến URL hiện tại và làm mới trang. Bạn có thể ghi đè hành vi đó bằng cách gọi `e.preventDefault()`. Đọc dữ liệu biểu mẫu bằng [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Ngăn trình duyệt tải lại trang
    e.preventDefault();

    // Đọc dữ liệu form
    const form = e.target;
    const formData = new FormData(form);

    // Bạn có thể truyền formData trực tiếp làm body cho fetch:
    fetch('/some-api', { method: form.method, body: formData });

    // Hoặc bạn có thể dùng nó như một object thuần:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Đặt một `name` cho `<textarea>` của bạn, chẳng hạn như `<textarea name="postContent" />`. `name` mà bạn chỉ định sẽ được dùng làm key trong dữ liệu biểu mẫu, chẳng hạn như `{ postContent: "Your post" }`.

</Note>

<Pitfall>

Theo mặc định, *bất kỳ* `<button>` nào bên trong một `<form>` cũng sẽ gửi biểu mẫu đó. Điều này có thể gây bất ngờ! Nếu bạn có component React `Button` tùy chỉnh của riêng mình, hãy cân nhắc trả về [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) thay vì `<button>`. Sau đó, để thể hiện rõ ràng ý định, hãy sử dụng `<button type="submit">` cho các button *có* nhiệm vụ gửi biểu mẫu.

</Pitfall>

---

### Điều khiển vùng văn bản bằng biến state {/*controlling-a-text-area-with-a-state-variable*/}

Một vùng văn bản như `<textarea />` là *uncontrolled*. Ngay cả khi bạn [truyền một giá trị ban đầu](#providing-an-initial-value-for-a-text-area) như `<textarea defaultValue="Initial text" />`, JSX của bạn chỉ chỉ định giá trị ban đầu, chứ không phải giá trị hiện tại.

**Để render một vùng văn bản _controlled_, hãy truyền prop `value` cho nó.** React sẽ buộc vùng văn bản luôn có `value` mà bạn đã truyền vào. Thông thường, bạn sẽ điều khiển vùng văn bản bằng cách khai báo một biến state [:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Declare a state variable...
  // ...
  return (
    <textarea
      value={postContent} // ...buộc giá trị của input khớp với biến state...
      onChange={e => setPostContent(e.target.value)} // ...và cập nhật biến state khi có bất kỳ chỉnh sửa nào!
    />
  );
}
```

Điều này hữu ích nếu bạn muốn re-render một phần UI để phản hồi mỗi lần gõ phím.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
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
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**Nếu bạn truyền `value` mà không có `onChange`, bạn sẽ không thể nhập vào vùng văn bản.** Khi điều khiển một vùng văn bản bằng cách truyền một `value` nào đó cho nó, bạn *buộc* nó luôn có giá trị đã truyền. Vì vậy, nếu bạn truyền một biến state làm `value` nhưng quên cập nhật biến state đó một cách đồng bộ trong trình xử lý sự kiện `onChange`, React sẽ khôi phục vùng văn bản sau mỗi lần gõ phím về `value` mà bạn đã chỉ định.

</Pitfall>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Vùng văn bản của tôi không cập nhật khi tôi nhập vào đó {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Nếu bạn render một vùng văn bản với `value` nhưng không có `onChange`, bạn sẽ thấy lỗi sau trong console:

```js
// 🔴 Lỗi: text area được kiểm soát nhưng không có handler onChange
<textarea value={something} />
```

<ConsoleBlock level="error">

Bạn đã cung cấp prop `value` cho một trường biểu mẫu nhưng không có handler `onChange`. Điều này sẽ render một trường chỉ đọc. Nếu trường này cần có thể thay đổi, hãy sử dụng `defaultValue`. Nếu không, hãy đặt `onChange` hoặc `readOnly`.

</ConsoleBlock>

Như thông báo lỗi gợi ý, nếu bạn chỉ muốn [chỉ định giá trị *ban đầu*,](#providing-an-initial-value-for-a-text-area) hãy truyền `defaultValue` thay thế:

```js
// ✅ Tốt: text area không kiểm soát có giá trị ban đầu
<textarea defaultValue={something} />
```

Nếu bạn muốn [điều khiển vùng văn bản này bằng một biến state,](#controlling-a-text-area-with-a-state-variable) hãy chỉ định một handler `onChange`:

```js
// ✅ Tốt: text area được kiểm soát có onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Nếu giá trị này cố ý chỉ đọc, hãy thêm prop `readOnly` để ẩn lỗi:

```js
// ✅ Tốt: text area được kiểm soát chỉ đọc, không có onChange
<textarea value={something} readOnly={true} />
```

---

### Con trỏ trong vùng văn bản của tôi nhảy về đầu sau mỗi lần gõ phím {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

Nếu bạn [điều khiển một vùng văn bản,](#controlling-a-text-area-with-a-state-variable) bạn phải cập nhật biến state của nó thành giá trị của vùng văn bản trong DOM trong `onChange`.

Bạn không thể cập nhật nó thành một giá trị khác với `e.target.value`:

```js
function handleChange(e) {
  // 🔴 Lỗi: cập nhật input thành giá trị khác e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Bạn cũng không thể cập nhật nó một cách bất đồng bộ:

```js
function handleChange(e) {
  // 🔴 Lỗi: cập nhật input bất đồng bộ
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Để sửa code, hãy cập nhật nó một cách đồng bộ thành `e.target.value`:

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

Nếu cách này không khắc phục được vấn đề, có thể vùng văn bản bị xóa rồi thêm lại vào DOM sau mỗi lần gõ phím. Điều này có thể xảy ra nếu bạn vô tình [đặt lại state](/learn/preserving-and-resetting-state) sau mỗi lần re-render. Ví dụ, điều này có thể xảy ra nếu vùng văn bản hoặc một trong các parent của nó luôn nhận được một thuộc tính `key` khác, hoặc nếu bạn lồng các định nghĩa component (điều này không được phép trong React và khiến component "bên trong" remount sau mỗi lần render).

---

### Tôi gặp lỗi: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Nếu bạn cung cấp một `value` cho component, giá trị đó phải luôn là một string trong suốt vòng đời của component.

Bạn không thể truyền `value={undefined}` trước rồi sau đó truyền `value="some string"`, vì React sẽ không biết bạn muốn component là uncontrolled hay controlled. Một component controlled luôn phải nhận `value` là một string, không phải `null` hoặc `undefined`.

Nếu `value` của bạn đến từ một API hoặc một biến state, nó có thể được khởi tạo thành `null` hoặc `undefined`. Trong trường hợp đó, hãy đặt nó thành một chuỗi rỗng (`''`) ngay từ đầu, hoặc truyền `value={someValue ?? ''}` để đảm bảo `value` là một string.
