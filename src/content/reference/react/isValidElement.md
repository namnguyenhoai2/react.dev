---
title: isValidElement
---

<Intro>

`isValidElement` kiểm tra xem một giá trị có phải là một React element hay không.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Gọi `isValidElement(value)` để kiểm tra xem `value` có phải là một React element hay không.

```js
import { isValidElement, createElement } from 'react';

// ✅ React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Không phải React element
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `value`: `value` mà bạn muốn kiểm tra. Đây có thể là một giá trị thuộc bất kỳ kiểu nào.

#### Giá trị trả về {/*returns*/}

`isValidElement` trả về `true` nếu `value` là một React element. Nếu không, nó trả về `false`.

#### Lưu ý {/*caveats*/}

* **Chỉ [JSX tags](/learn/writing-markup-with-jsx) và các object được trả về bởi [`createElement`](/reference/react/createElement) mới được xem là React element.** Ví dụ, mặc dù một số như `42` là một React *node* hợp lệ (và có thể được trả về từ một component), nó không phải là một React element hợp lệ. Các array và portal được tạo bằng [`createPortal`](/reference/react-dom/createPortal) cũng *không* được xem là React element.

---

## Cách sử dụng {/*usage*/}

### Kiểm tra xem một giá trị có phải là React element hay không {/*checking-if-something-is-a-react-element*/}

Gọi `isValidElement` để kiểm tra xem một giá trị có phải là một *React element* hay không.

React element là:

- Các giá trị được tạo bằng cách viết một [JSX tag](/learn/writing-markup-with-jsx)
- Các giá trị được tạo bằng cách gọi [`createElement`](/reference/react/createElement)

Đối với React element, `isValidElement` trả về `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ Các thẻ JSX là React element
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Giá trị do createElement trả về là React element
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Mọi giá trị khác, chẳng hạn như string, number hoặc object và array bất kỳ, đều không phải là React element.

Đối với các giá trị đó, `isValidElement` trả về `false`:

```js
// ❌ Đây *không phải* React element
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

Rất hiếm khi bạn cần dùng `isValidElement`. Nó chủ yếu hữu ích khi bạn gọi một API khác *chỉ* chấp nhận element (như [`cloneElement`](/reference/react/cloneElement)) và muốn tránh lỗi khi đối số của bạn không phải là React element.

Trừ khi bạn có một lý do rất cụ thể để thêm một kiểm tra `isValidElement`, có lẽ bạn không cần dùng nó.

<DeepDive>

#### React element và React node {/*react-elements-vs-react-nodes*/}

Khi viết một component, bạn có thể trả về bất kỳ loại *React node* nào từ component đó:

```js
function MyComponent() {
  // ... bạn có thể trả về bất kỳ React node nào ...
}
```

Một React node có thể là:

- Một React element được tạo như `<div />` hoặc `createElement('div')`
- Một portal được tạo bằng [`createPortal`](/reference/react-dom/createPortal)
- Một string
- Một number
- `true`, `false`, `null` hoặc `undefined` (những giá trị này không được hiển thị)
- Một array gồm các React node khác

**Lưu ý: `isValidElement` kiểm tra xem đối số có phải là một *React element* hay không, chứ không kiểm tra xem nó có phải là một React node hay không.** Ví dụ, `42` không phải là một React element hợp lệ. Tuy nhiên, nó hoàn toàn là một React node hợp lệ:

```js
function MyComponent() {
  return 42; // Có thể trả về một number từ component
}
```

Đây là lý do bạn không nên dùng `isValidElement` để kiểm tra xem một giá trị có thể được render hay không.

</DeepDive>
