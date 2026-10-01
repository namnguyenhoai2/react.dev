---
title: "<select>"
---

<Intro>

[component trình duyệt tích hợp sẵn `<select>` của trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) cho phép bạn hiển thị một hộp select kèm các tùy chọn.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `<select>` {/*select*/}

Để hiển thị một hộp select, hãy render component [tích hợp sẵn trong trình duyệt `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<select>` hỗ trợ tất cả [props phần tử phổ biến.](/reference/react-dom/components/common#common-props)

Bạn có thể [điều khiển một hộp select](#controlling-a-select-box-with-a-state-variable) bằng cách truyền một prop `value`:

* `value`: Một chuỗi (hoặc một mảng chuỗi đối với [`multiple={true}`](#enabling-multiple-selection)). Kiểm soát tùy chọn nào được chọn. Mỗi chuỗi giá trị phải khớp với `value` của một `<option>` lồng bên trong `<select>`.

Khi truyền `value`, bạn cũng phải truyền một handler `onChange` để cập nhật giá trị đã truyền.

Nếu `<select>` của bạn là uncontrolled, thay vào đó bạn có thể truyền prop `defaultValue`:

* `defaultValue`: Một chuỗi (hoặc một mảng chuỗi đối với [`multiple={true}`](#enabling-multiple-selection)). Chỉ định [tùy chọn được chọn ban đầu.](#providing-an-initially-selected-option)

Các prop `<select>` này áp dụng cho cả hộp select uncontrolled và controlled:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): Một chuỗi. Chỉ định một trong các [hành vi autocomplete.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): Một boolean. Nếu `true`, React sẽ focus phần tử khi mount.
* `children`: `<select>` chấp nhận các component [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup), và [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) làm children. Bạn cũng có thể truyền các component của riêng mình, miễn là cuối cùng chúng render một trong các component được cho phép. Nếu bạn truyền các component của riêng mình mà cuối cùng render các thẻ `<option>`, mỗi `<option>` bạn render phải có một `value`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): Một boolean. Nếu `true`, hộp select sẽ không tương tác được và hiển thị mờ.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): Một chuỗi. Chỉ định `id` của `<form>` mà hộp select này thuộc về. Nếu bỏ qua, đó sẽ là form cha gần nhất.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): Một boolean. Nếu `true`, trình duyệt cho phép [chọn nhiều tùy chọn.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): Một chuỗi. Chỉ định tên của hộp select này, tên đó sẽ được [gửi cùng form.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Bắt buộc đối với [hộp select controlled.](#controlling-a-select-box-with-a-state-variable) Được kích hoạt ngay khi người dùng chọn một tùy chọn khác. Hoạt động giống như event [`input` của trình duyệt.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Một phiên bản của `onChange` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Được kích hoạt ngay khi giá trị bị người dùng thay đổi. Vì lý do lịch sử, trong React, cách dùng quen thuộc là dùng `onChange` thay thế vì nó hoạt động tương tự.
* `onInputCapture`: Một phiên bản của `onInput` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Một hàm [`Event` handler](/reference/react-dom/components/common#event-handler). Được kích hoạt nếu một input không vượt qua validation khi submit form. Không giống event `invalid` tích hợp sẵn, event `onInvalid` của React bubble lên.
* `onInvalidCapture`: Một phiên bản của `onInvalid` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): Một boolean. Nếu `true`, giá trị phải được cung cấp để form được submit.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): Một số. Đối với select `multiple={true}`, chỉ định số lượng item hiển thị ban đầu được ưu tiên.

#### Lưu ý {/*caveats*/}

- Không giống HTML, không hỗ trợ truyền thuộc tính `selected` cho `<option>`. Thay vào đó, hãy dùng [`<select defaultValue>`](#providing-an-initially-selected-option) cho hộp select uncontrolled và [`<select value>`](#controlling-a-select-box-with-a-state-variable) cho hộp select controlled.
- Nếu hộp select nhận một prop `value`, nó sẽ được [coi là controlled.](#controlling-a-select-box-with-a-state-variable)
- Một hộp select không thể vừa controlled vừa uncontrolled cùng lúc.
- Một hộp select không thể chuyển đổi giữa controlled và uncontrolled trong suốt vòng đời của nó.
- Mọi hộp select controlled đều cần một handler event `onChange` cập nhật đồng bộ giá trị backing của nó.

---

## Cách dùng {/*usage*/}

### Hiển thị hộp select với các tùy chọn {/*displaying-a-select-box-with-options*/}

Render một `<select>` với danh sách các component `<option>` bên trong để hiển thị một hộp select. Gán cho mỗi `<option>` một `value` đại diện cho dữ liệu sẽ được gửi cùng form.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

---

### Cung cấp label cho hộp select {/*providing-a-label-for-a-select-box*/}

Thông thường, bạn sẽ đặt mỗi `<select>` bên trong một thẻ [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Điều này cho trình duyệt biết label này được liên kết với hộp select đó. Khi người dùng nhấp vào label, trình duyệt sẽ tự động focus hộp select. Đây cũng là điều thiết yếu đối với khả năng accessibility: screen reader sẽ đọc tiêu đề label khi người dùng focus hộp select.

Nếu không thể lồng `<select>` vào `<label>`, hãy liên kết chúng bằng cách truyền cùng một ID cho `<select id>` và [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Để tránh xung đột giữa nhiều instance của cùng một component, hãy tạo ID như vậy bằng [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Cung cấp tùy chọn được chọn ban đầu {/*providing-an-initially-selected-option*/}

Theo mặc định, trình duyệt sẽ chọn `<option>` đầu tiên trong danh sách. Để chọn mặc định một tùy chọn khác, hãy truyền `<option>`'s `value` của tùy chọn đó làm `defaultValue` cho phần tử `<select>`.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

<Pitfall>

Không giống HTML, không hỗ trợ truyền thuộc tính `selected` cho một `<option>` riêng lẻ.

</Pitfall>

---

### Bật tính năng chọn nhiều tùy chọn {/*enabling-multiple-selection*/}

Truyền `multiple={true}` cho `<select>` để cho phép người dùng chọn nhiều tùy chọn. Trong trường hợp đó, nếu bạn cũng chỉ định `defaultValue` để chọn các tùy chọn được chọn ban đầu, thì giá trị này phải là một mảng.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Đọc giá trị của hộp chọn khi gửi form {/*reading-the-select-box-value-when-submitting-a-form*/}

Thêm một [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) bao quanh hộp chọn của bạn, với một [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) bên trong. Thao tác này sẽ gọi event handler `<form onSubmit>` của bạn. Theo mặc định, trình duyệt sẽ gửi dữ liệu form đến URL hiện tại và refresh trang. Bạn có thể ghi đè hành vi đó bằng cách gọi `e.preventDefault()`. Đọc dữ liệu form bằng [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
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
    // Bạn có thể tạo URL từ nó, như cách trình duyệt làm theo mặc định:
    console.log(new URLSearchParams(formData).toString());
    // Bạn có thể dùng nó như một object thuần.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) Điều này không bao gồm nhiều giá trị select
    // Hoặc bạn có thể lấy một array các cặp tên-giá trị.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

Cung cấp một `name` cho `<select>` của bạn, chẳng hạn như `<select name="selectedFruit" />`. `name` mà bạn chỉ định sẽ được dùng làm key trong dữ liệu form, chẳng hạn như `{ selectedFruit: "orange" }`.

Nếu bạn sử dụng `<select multiple={true}>`, [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) mà bạn đọc từ form sẽ bao gồm từng giá trị được chọn dưới dạng một cặp name-value riêng biệt. Hãy xem kỹ các log trong console ở ví dụ trên.

</Note>

<Pitfall>

Theo mặc định, *bất kỳ* `<button>` nào bên trong `<form>` cũng sẽ submit form đó. Điều này có thể gây bất ngờ! Nếu bạn có component React `Button` của riêng mình, hãy cân nhắc trả về [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) thay vì `<button>`. Sau đó, để chỉ rõ ý định, hãy dùng `<button type="submit">` cho những button *thực sự* được dùng để submit form.

</Pitfall>

---

### Điều khiển hộp chọn bằng biến state {/*controlling-a-select-box-with-a-state-variable*/}

Một hộp chọn như `<select />` là *uncontrolled.* Ngay cả khi bạn [truyền một giá trị được chọn ban đầu](#providing-an-initially-selected-option) chẳng hạn như `<select defaultValue="orange" />`, JSX của bạn chỉ chỉ định giá trị ban đầu, chứ không phải giá trị hiện tại.

**Để render một hộp chọn _controlled_, hãy truyền prop `value` cho nó.** React sẽ buộc hộp chọn luôn có `value` mà bạn đã truyền vào. Thông thường, bạn sẽ điều khiển một hộp chọn bằng cách khai báo biến state [:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Khai báo một biến state...
  // ...
  return (
    <select
      value={selectedFruit} // ...buộc giá trị của select khớp với biến state...
      onChange={e => setSelectedFruit(e.target.value)} // ...và cập nhật biến state khi có bất kỳ thay đổi nào!
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  );
}
```

Điều này hữu ích nếu bạn muốn render lại một phần UI để phản hồi mỗi lần lựa chọn thay đổi.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**Nếu bạn truyền `value` mà không truyền `onChange`, bạn sẽ không thể chọn tùy chọn nào.** Khi điều khiển một hộp chọn bằng cách truyền một `value` nào đó cho nó, bạn *buộc* nó luôn có giá trị mà bạn đã truyền. Vì vậy, nếu bạn truyền một biến state làm `value` nhưng quên cập nhật biến state đó một cách đồng bộ trong event handler `onChange`, React sẽ đưa hộp chọn trở lại sau mỗi lần gõ phím về `value` mà bạn đã chỉ định.

Không giống HTML, việc truyền thuộc tính `selected` cho từng `<option>` riêng lẻ không được hỗ trợ.

</Pitfall>
