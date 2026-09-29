---
title: "<option>"
---

<Intro>

Component [tích hợp sẵn của trình duyệt `<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) cho phép bạn render một tùy chọn bên trong một hộp [`<select>`](/reference/react-dom/components/select).

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

### `<option>` {/*option*/}

Component [tích hợp sẵn của trình duyệt `<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) cho phép bạn render một tùy chọn bên trong một hộp [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<option>` hỗ trợ tất cả [các prop phần tử thông dụng.](/reference/react-dom/components/common#common-props)

Ngoài ra, `<option>` hỗ trợ các prop sau:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): Một boolean. Nếu `true`, tùy chọn sẽ không thể được chọn và sẽ hiển thị mờ.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): Một string. Chỉ định ý nghĩa của tùy chọn. Nếu không được chỉ định, phần văn bản bên trong tùy chọn sẽ được sử dụng.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): Giá trị được sử dụng [khi submit `<select>` cha trong một form](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) nếu tùy chọn này được chọn.

#### Lưu ý {/*caveats*/}

* React không hỗ trợ thuộc tính `selected` trên `<option>`. Thay vào đó, hãy truyền `value` của tùy chọn này vào [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) cha đối với select box không được kiểm soát, hoặc [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) đối với select được kiểm soát.

---

## Cách sử dụng {/*usage*/}

### Hiển thị select box với các tùy chọn {/*displaying-a-select-box-with-options*/}

Render một `<select>` với danh sách các component `<option>` bên trong để hiển thị một select box. Cung cấp cho mỗi `<option>` một `value` đại diện cho dữ liệu sẽ được submit cùng với form.

[Đọc thêm về cách hiển thị một `<select>` với danh sách các component `<option>`.](/reference/react-dom/components/select)

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