---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` dành cho các tác giả thư viện CSS-in-JS. Trừ khi bạn đang phát triển một thư viện CSS-in-JS và cần một nơi để chèn các style, có lẽ bạn sẽ muốn sử dụng [`useEffect`](/reference/react/useEffect) hoặc [`useLayoutEffect`](/reference/react/useLayoutEffect) thay thế.

</Pitfall>

<Intro>

`useInsertionEffect` cho phép chèn các phần tử vào DOM trước khi bất kỳ layout Effect nào chạy.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Gọi `useInsertionEffect` để chèn các style trước khi bất kỳ Effect nào có thể cần đọc layout chạy:

```js
import { useInsertionEffect } from 'react';

// Bên trong thư viện CSS-in-JS của bạn
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... chèn các thẻ <style> ở đây ...
  });
  return rule;
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `setup`: Hàm chứa logic của Effect. Hàm setup của bạn cũng có thể tùy chọn trả về một hàm *cleanup*. Khi component của bạn được thêm vào DOM nhưng trước khi bất kỳ layout Effect nào chạy, React sẽ chạy hàm setup của bạn. Sau mỗi lần re-render với các dependency đã thay đổi, trước tiên React sẽ chạy hàm cleanup (nếu bạn cung cấp) với các giá trị cũ, sau đó chạy hàm setup với các giá trị mới. Khi component của bạn bị xóa khỏi DOM, React sẽ chạy hàm cleanup.

* **tùy chọn** `dependencies`: Danh sách tất cả các giá trị reactive được tham chiếu bên trong đoạn mã `setup`. Các giá trị reactive bao gồm props, state, cùng tất cả biến và hàm được khai báo trực tiếp bên trong phần thân component. Nếu linter của bạn được [cấu hình cho React](/learn/editor-setup#linting), linter sẽ kiểm tra để đảm bảo mọi giá trị reactive đều được chỉ định chính xác dưới dạng dependency. Danh sách dependency phải có số lượng phần tử cố định và được viết inline, chẳng hạn như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó bằng thuật toán so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Nếu bạn hoàn toàn không chỉ định dependency, Effect sẽ chạy lại sau mỗi lần component re-render.

#### Giá trị trả về {/*returns*/}

`useInsertionEffect` trả về `undefined`.

#### Lưu ý {/*caveats*/}

* Effect chỉ chạy trên client. Chúng không chạy trong quá trình server rendering.
* Bạn không thể cập nhật state từ bên trong `useInsertionEffect`.
* Khi `useInsertionEffect` chạy, refs vẫn chưa được gắn.
* `useInsertionEffect` có thể chạy trước hoặc sau khi DOM được cập nhật. Bạn không nên dựa vào việc DOM đã được cập nhật tại một thời điểm cụ thể nào.
* Không giống các loại Effect khác, vốn thực hiện cleanup cho mọi Effect rồi mới thực hiện setup cho mọi Effect, `useInsertionEffect` sẽ thực hiện cả cleanup và setup lần lượt cho từng component. Điều này dẫn đến việc các hàm cleanup và setup được “xen kẽ”.
---

## Cách sử dụng {/*usage*/}

### Chèn style động từ các thư viện CSS-in-JS {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

Theo cách truyền thống, bạn sẽ tạo style cho các React component bằng CSS thuần.

```js
// Trong file JS của bạn:
<button className="success" />

// Trong file CSS của bạn:
.success { color: green; }
```

Một số nhóm thích viết style trực tiếp trong mã JavaScript thay vì viết các tệp CSS. Việc này thường đòi hỏi sử dụng một thư viện hoặc công cụ CSS-in-JS. Có ba cách tiếp cận phổ biến đối với CSS-in-JS:

1. Trích xuất tĩnh thành các tệp CSS bằng compiler
2. Inline style, ví dụ `<div style={{ opacity: 1 }}>`
3. Runtime injection của các thẻ `<style>`

Nếu sử dụng CSS-in-JS, chúng tôi khuyến nghị kết hợp hai cách tiếp cận đầu tiên (tệp CSS cho style tĩnh, inline style cho style động). **Chúng tôi không khuyến nghị runtime `<style>` injection vì hai lý do:**

1. Runtime injection buộc trình duyệt phải tính toán lại style thường xuyên hơn nhiều.
2. Runtime injection có thể rất chậm nếu xảy ra không đúng thời điểm trong vòng đời React.

Vấn đề đầu tiên không thể giải quyết, nhưng `useInsertionEffect` giúp bạn giải quyết vấn đề thứ hai.

Gọi `useInsertionEffect` để chèn các style trước khi bất kỳ layout Effect nào chạy:

```js {4-11}
// Bên trong thư viện CSS-in-JS của bạn
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // Như đã giải thích ở trên, chúng tôi không khuyến nghị chèn thẻ <style> ở runtime.
    // Nhưng nếu buộc phải làm vậy, điều quan trọng là phải thực hiện trong useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

Tương tự như `useEffect`, `useInsertionEffect` không chạy trên server. Nếu cần thu thập các quy tắc CSS nào đã được sử dụng trên server, bạn có thể thực hiện việc đó trong quá trình rendering:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[Đọc thêm về cách nâng cấp các thư viện CSS-in-JS với runtime injection lên `useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### Cách này tốt hơn việc chèn style trong quá trình rendering hoặc dùng useLayoutEffect như thế nào? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

Nếu bạn chèn style trong quá trình rendering và React đang xử lý một [bản cập nhật không chặn,](/reference/react/useTransition#perform-non-blocking-updates-with-actions) trình duyệt sẽ tính toán lại style trong từng frame khi render một cây component, việc này có thể **cực kỳ chậm.**

`useInsertionEffect` tốt hơn việc chèn style trong [`useLayoutEffect`](/reference/react/useLayoutEffect) hoặc [`useEffect`](/reference/react/useEffect) vì nó đảm bảo rằng khi các Effect khác trong component của bạn chạy, các thẻ `<style>` đã được chèn. Nếu không, các phép tính layout trong những Effect thông thường sẽ không chính xác do style đã lỗi thời.

</DeepDive>
