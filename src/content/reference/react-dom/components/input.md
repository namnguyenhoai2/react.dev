---
title: "<input>"
---

<Intro>

Thành phần [built-in browser `<input>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) cho phép bạn render nhiều loại input biểu mẫu khác nhau.

```js
<input />
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<input>` {/*input*/}

Để hiển thị một input, hãy render component [built-in browser `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).

```js
<input name="myInput" />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<input>` hỗ trợ tất cả [props phổ biến của element.](/reference/react-dom/components/common#common-props)

- [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Một string hoặc function. Ghi đè `<form action>` của component cha cho `type="submit"` và `type="image"`. Khi truyền một URL vào `action`, form sẽ hoạt động như một form HTML tiêu chuẩn. Khi truyền một function vào `formAction`, function đó sẽ xử lý việc gửi form. Xem [`<form action>`](/reference/react-dom/components/form#props).

Bạn có thể [kiểm soát một input](#controlling-an-input-with-a-state-variable) bằng cách truyền một trong các prop sau:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Một boolean. Đối với input checkbox hoặc radio button, kiểm soát việc input đó có được chọn hay không.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): Một string. Đối với text input, kiểm soát nội dung văn bản của input. (Đối với radio button, chỉ định dữ liệu form của nó.)

Khi truyền một trong hai prop này, bạn cũng phải truyền một handler `onChange` để cập nhật giá trị đã truyền.

Các prop `<input>` này chỉ áp dụng cho input không được kiểm soát:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Một boolean. Chỉ định [giá trị ban đầu](#providing-an-initial-value-for-an-input) cho input `type="checkbox"` và `type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): Một string. Chỉ định [giá trị ban đầu](#providing-an-initial-value-for-an-input) cho một text input.

Các prop `<input>` này áp dụng cho cả input không được kiểm soát và input được kiểm soát:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): Một chuỗi. Chỉ định các filetype được chấp nhận bởi input `type="file"`.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): Một chuỗi. Chỉ định văn bản thay thế của hình ảnh cho input `type="image"`.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): Một chuỗi. Chỉ định media (microphone, video hoặc camera) được thu bởi input `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): Một chuỗi. Chỉ định một trong các hành vi autocomplete khả dụng của [.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Một boolean. Nếu `true`, React sẽ focus phần tử khi mount.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): Một chuỗi. Chỉ định tên trường form cho directionality của phần tử.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Một boolean. Nếu `true`, input sẽ không có tính tương tác và sẽ hiển thị mờ.
* `children`: `<input>` không chấp nhận children.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): Một chuỗi. Chỉ định `id` của `<form>` mà input này thuộc về. Nếu bỏ qua, đó là form cha gần nhất.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Một chuỗi. Ghi đè `<form action>` của phần tử cha cho `type="submit"` và `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): Một chuỗi. Ghi đè `<form enctype>` của phần tử cha cho `type="submit"` và `type="image"`.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): Một chuỗi. Ghi đè `<form method>` của phần tử cha cho `type="submit"` và `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): Một chuỗi. Ghi đè `<form noValidate>` của phần tử cha cho `type="submit"` và `type="image"`.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): Một chuỗi. Ghi đè `<form target>` của phần tử cha cho `type="submit"` và `type="image"`.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): Một chuỗi. Chỉ định chiều cao hình ảnh cho `type="image"`.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): Một chuỗi. Chỉ định `id` của `<datalist>` có các tùy chọn autocomplete.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Một số. Chỉ định giá trị tối đa của input số và datetime.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Một số. Chỉ định độ dài tối đa của văn bản và các input khác.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Một số. Chỉ định giá trị tối thiểu của input số và datetime.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Một số. Chỉ định độ dài tối thiểu của văn bản và các input khác.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Một boolean. Chỉ định liệu có cho phép nhiều giá trị cho `<type="file"` và `type="email"` hay không.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Một chuỗi. Chỉ định tên cho input này, tên này sẽ được [ gửi cùng form.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Bắt buộc đối với input [controlled.](#controlling-an-input-with-a-state-variable) Được gọi ngay khi giá trị của input bị người dùng thay đổi (ví dụ: được gọi sau mỗi lần nhấn phím). Hoạt động giống như event [`input` của trình duyệt.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Một phiên bản của `onChange` được gọi trong giai đoạn [capture.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Được gọi ngay khi giá trị bị người dùng thay đổi. Vì lý do lịch sử, trong React, cách dùng mang tính quy ước là sử dụng `onChange` thay thế, hoạt động tương tự.
* `onInputCapture`: Một phiên bản của `onInput` được gọi trong giai đoạn [capture.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Được gọi nếu input không vượt qua bước validation khi submit form. Không giống event `invalid` tích hợp sẵn, event `onInvalid` của React sẽ bubble.
* `onInvalidCapture`: Một phiên bản của `onInvalid` được gọi trong giai đoạn [capture.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Được gọi sau khi selection bên trong `<input>` thay đổi. React mở rộng event `onSelect` để cũng được gọi khi selection rỗng và khi chỉnh sửa (những thao tác có thể ảnh hưởng đến selection).
* `onSelectCapture`: Một phiên bản của `onSelect` được gọi trong giai đoạn [capture.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): Một chuỗi. Chỉ định pattern mà `value` phải khớp.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): Một chuỗi. Hiển thị bằng màu mờ khi giá trị input rỗng.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Một boolean. Nếu `true`, người dùng không thể chỉnh sửa input.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Một boolean. Nếu `true`, giá trị phải được cung cấp để form có thể submit.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Một số. Tương tự như đặt width, nhưng đơn vị phụ thuộc vào control.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): Một chuỗi. Chỉ định nguồn hình ảnh cho input `type="image"`.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Một số dương hoặc một chuỗi `'any'`. Chỉ định khoảng cách giữa các giá trị hợp lệ.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): Một chuỗi. Một trong các loại [input.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width): Một chuỗi. Chỉ định chiều rộng hình ảnh cho input `type="image"`.

#### Lưu ý {/*caveats*/}

- Checkbox cần `checked` (hoặc `defaultChecked`), không phải `value` (hoặc `defaultValue`).
- Nếu một text input nhận prop chuỗi `value`, nó sẽ được [xử lý như controlled.](#controlling-an-input-with-a-state-variable)
- Nếu một checkbox hoặc radio button nhận prop boolean `checked`, nó sẽ được [xử lý như controlled.](#controlling-an-input-with-a-state-variable)
- Một input không thể vừa controlled vừa uncontrolled cùng lúc.
- Một input không thể chuyển đổi giữa controlled và uncontrolled trong suốt vòng đời của nó.
- Mọi controlled input đều cần một event handler `onChange` để cập nhật đồng bộ giá trị nền của nó.

---

## Cách sử dụng {/*usage*/}

### Hiển thị các input thuộc nhiều kiểu khác nhau {/*displaying-inputs-of-different-types*/}

Để hiển thị một input, hãy render một component `<input>`. Theo mặc định, đó sẽ là một text input. Bạn có thể truyền `type="checkbox"` cho checkbox, `type="radio"` cho radio button, [hoặc một trong các kiểu input khác.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Cung cấp label cho một input {/*providing-a-label-for-an-input*/}

Thông thường, bạn sẽ đặt mỗi `<input>` bên trong một thẻ [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Điều này cho trình duyệt biết label này được liên kết với input đó. Khi người dùng nhấp vào label, trình duyệt sẽ tự động focus vào input. Đây cũng là điều thiết yếu đối với khả năng accessibility: screen reader sẽ đọc caption của label khi người dùng focus vào input tương ứng.

Nếu không thể lồng `<input>` vào `<label>`, hãy liên kết chúng bằng cách truyền cùng một ID cho `<input id>` và [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Để tránh xung đột giữa nhiều instance của cùng một component, hãy tạo ID như vậy bằng [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Cung cấp giá trị ban đầu cho một input {/*providing-an-initial-value-for-an-input*/}

Bạn có thể tùy chọn chỉ định giá trị ban đầu cho bất kỳ input nào. Hãy truyền giá trị đó dưới dạng chuỗi `defaultValue` cho text input. Checkbox và radio button thay vào đó nên chỉ định giá trị ban đầu bằng boolean `defaultChecked`.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true}
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Đọc các giá trị input khi submit form {/*reading-the-input-values-when-submitting-a-form*/}

Hãy thêm một [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) bao quanh các input của bạn, bên trong có một [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button). Nó sẽ gọi event handler `<form onSubmit>` của bạn. Theo mặc định, trình duyệt sẽ gửi dữ liệu form đến URL hiện tại và refresh trang. Bạn có thể ghi đè hành vi đó bằng cách gọi `e.preventDefault()`. Đọc dữ liệu form bằng [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function MyForm() {
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
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
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

Hãy cung cấp `name` cho mỗi `<input>`, ví dụ `<input name="firstName" defaultValue="Taylor" />`. `name` mà bạn chỉ định sẽ được dùng làm key trong dữ liệu form, ví dụ `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

Theo mặc định, một `<button>` bên trong `<form>` không có attribute `type` sẽ submit form. Điều này có thể gây bất ngờ! Nếu bạn có React component `Button` của riêng mình, hãy cân nhắc sử dụng [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) thay cho `<button>` (không có type). Sau đó, để chỉ rõ mục đích, hãy dùng `<button type="submit">` cho các button *thực sự* dùng để submit form.

</Pitfall>

---

### Điều khiển input bằng biến state {/*controlling-an-input-with-a-state-variable*/}

Một input như `<input />` là *uncontrolled*. Ngay cả khi bạn [truyền một giá trị ban đầu](#providing-an-initial-value-for-an-input) như `<input defaultValue="Initial text" />`, JSX của bạn cũng chỉ chỉ định giá trị ban đầu. Nó không điều khiển giá trị hiện tại của input.

**Để render một input _controlled_, hãy truyền prop `value` cho input đó (hoặc `checked` đối với checkbox và radio).** React sẽ buộc input luôn có `value` mà bạn đã truyền. Thông thường, bạn sẽ làm điều này bằng cách khai báo một biến state [:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Khai báo một biến state...
  // ...
  return (
    <input
      value={firstName} // ...buộc giá trị của input khớp với biến state...
      onChange={e => setFirstName(e.target.value)} // ...và cập nhật biến state khi có bất kỳ chỉnh sửa nào!
    />
  );
}
```

Input controlled rất hữu ích nếu bạn vốn đã cần state—ví dụ, để render lại UI sau mỗi lần chỉnh sửa:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

Nó cũng hữu ích nếu bạn muốn cung cấp nhiều cách để điều chỉnh state của input (chẳng hạn bằng cách nhấp vào một button):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

`value` mà bạn truyền cho các component controlled không được là `undefined` hoặc `null`. Nếu cần giá trị ban đầu là rỗng (chẳng hạn với field `firstName` bên dưới), hãy khởi tạo biến state bằng một chuỗi rỗng (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**Nếu bạn truyền `value` mà không có `onChange`, bạn sẽ không thể nhập vào input.** Khi điều khiển một input bằng cách truyền một `value` nào đó cho nó, bạn *buộc* input luôn có giá trị đã truyền. Vì vậy, nếu truyền một biến state dưới dạng `value` nhưng quên cập nhật đồng bộ biến state đó trong event handler `onChange`, React sẽ đưa input trở lại sau mỗi lần gõ phím về `value` mà bạn đã chỉ định.

</Pitfall>

---

### Tối ưu việc render lại sau mỗi lần gõ phím {/*optimizing-re-rendering-on-every-keystroke*/}

Khi sử dụng input controlled, bạn cập nhật state sau mỗi lần gõ phím. Nếu component chứa state của bạn render lại một cây lớn, thao tác này có thể trở nên chậm. Có một số cách để tối ưu hiệu năng render lại.

Ví dụ, giả sử bạn bắt đầu với một form render lại toàn bộ nội dung trang sau mỗi lần gõ phím:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

Vì `<PageContent />` không phụ thuộc vào state của input, bạn có thể chuyển state của input vào component riêng:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Điều này cải thiện đáng kể hiệu năng vì giờ đây chỉ `SignupForm` render lại sau mỗi lần gõ phím.

Nếu không thể tránh việc render lại (chẳng hạn khi `PageContent` phụ thuộc vào giá trị của input tìm kiếm), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) cho phép bạn giữ input controlled luôn phản hồi nhanh ngay cả giữa một lần render lại lớn.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Text input của tôi không cập nhật khi tôi nhập vào {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Nếu render một input với `value` nhưng không có `onChange`, bạn sẽ thấy một lỗi trong console:

```js
// 🔴 Lỗi: text input được kiểm soát nhưng không có handler onChange
<input value={something} />
```

<ConsoleBlock level="error">

Bạn đã cung cấp prop `value` cho một form field nhưng không có handler `onChange`. Điều này sẽ render một field chỉ-đọc. Nếu field cần có thể thay đổi, hãy sử dụng `defaultValue`. Nếu không, hãy đặt `onChange` hoặc `readOnly`.

</ConsoleBlock>

Như thông báo lỗi gợi ý, nếu bạn chỉ muốn [chỉ định giá trị *ban đầu*,](#providing-an-initial-value-for-an-input) hãy truyền `defaultValue` thay vào đó:

```js
// ✅ Tốt: input không kiểm soát có giá trị ban đầu
<input defaultValue={something} />
```

Nếu muốn [điều khiển input này bằng một biến state,](#controlling-an-input-with-a-state-variable) hãy chỉ định một handler `onChange`:

```js
// ✅ Tốt: input được kiểm soát có onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Nếu giá trị này chủ ý là chỉ-đọc, hãy thêm prop `readOnly` để ẩn lỗi:

```js
// ✅ Tốt: input được kiểm soát chỉ đọc, không có onChange
<input value={something} readOnly={true} />
```

---

### Checkbox của tôi không cập nhật khi tôi nhấp vào nó {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Nếu render một checkbox với `checked` nhưng không có `onChange`, bạn sẽ thấy một lỗi trong console:

```js
// 🔴 Lỗi: checkbox được kiểm soát nhưng không có handler onChange
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

Bạn đã cung cấp prop `checked` cho một form field nhưng không có handler `onChange`. Điều này sẽ render một field chỉ-đọc. Nếu field cần có thể thay đổi, hãy sử dụng `defaultChecked`. Nếu không, hãy đặt `onChange` hoặc `readOnly`.

</ConsoleBlock>

Như thông báo lỗi gợi ý, nếu bạn chỉ muốn [chỉ định giá trị *ban đầu*,](#providing-an-initial-value-for-an-input) hãy truyền `defaultChecked` thay vào đó:

```js
// ✅ Tốt: checkbox không kiểm soát có giá trị ban đầu
<input type="checkbox" defaultChecked={something} />
```

Nếu muốn [điều khiển checkbox này bằng một biến state,](#controlling-an-input-with-a-state-variable) hãy chỉ định một handler `onChange`:

```js
// ✅ Tốt: checkbox được kiểm soát có onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Đối với checkbox, bạn cần đọc `e.target.checked` thay vì `e.target.value`.

</Pitfall>

Nếu checkbox chủ ý là chỉ-đọc, hãy thêm prop `readOnly` để ẩn lỗi:

```js
// ✅ Tốt: input được kiểm soát chỉ đọc, không có onChange
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Con trỏ input nhảy về đầu sau mỗi lần gõ phím {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Nếu bạn [điều khiển một input,](#controlling-an-input-with-a-state-variable) bạn phải cập nhật biến state của nó thành giá trị của input trong DOM khi xảy ra `onChange`.

Bạn không thể cập nhật nó thành giá trị khác với `e.target.value` (hoặc `e.target.checked` đối với checkbox):

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

Để sửa code, hãy cập nhật nó đồng bộ thành `e.target.value`:

```js
function handleChange(e) {
  // ✅ Cập nhật đồng bộ input được kiểm soát thành e.target.value
  setFirstName(e.target.value);
}
```

Nếu cách này không khắc phục được sự cố, có thể input bị xóa rồi thêm lại vào DOM sau mỗi lần gõ phím. Điều này có thể xảy ra nếu bạn vô tình [đặt lại state](/learn/preserving-and-resetting-state) sau mỗi lần re-render, chẳng hạn như khi input hoặc một trong các phần tử cha của nó luôn nhận một thuộc tính `key` khác, hoặc khi bạn lồng các định nghĩa hàm component (điều này không được hỗ trợ và khiến component "bên trong" luôn được xem là một tree khác).

---

### Tôi gặp lỗi: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Nếu bạn cung cấp `value` cho component, giá trị đó phải luôn là một string trong suốt vòng đời của component.

Bạn không thể truyền `value={undefined}` trước rồi sau đó truyền `value="some string"` vì React sẽ không biết bạn muốn component là uncontrolled hay controlled. Một component controlled luôn phải nhận `value` dạng string, không phải `null` hoặc `undefined`.

Nếu `value` của bạn đến từ một API hoặc một state variable, nó có thể được khởi tạo thành `null` hoặc `undefined`. Trong trường hợp đó, hãy đặt nó thành một string rỗng (`''`) ngay từ đầu, hoặc truyền `value={someValue ?? ''}` để đảm bảo `value` là một string.

Tương tự, nếu bạn truyền `checked` cho một checkbox, hãy đảm bảo giá trị đó luôn là boolean.
