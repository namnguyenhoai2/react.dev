---
style: "<style>"
---

<Intro>

Thành phần [trình duyệt tích hợp sẵn `<style>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) cho phép bạn thêm các stylesheet CSS inline vào tài liệu.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `<style>` {/*style*/}

Để thêm các style inline vào tài liệu, hãy render [trình duyệt tích hợp sẵn `<style>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style). Bạn có thể render `<style>` từ bất kỳ component nào và React sẽ [trong một số trường hợp](#special-rendering-behavior) đặt phần tử DOM tương ứng vào phần head của tài liệu, đồng thời loại bỏ các style trùng lặp.

```js
<style>{` p { color: red; } `}</style>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<style>` hỗ trợ tất cả [các prop phần tử thông thường.](/reference/react-dom/components/common#common-props)

* `children`: một chuỗi, bắt buộc. Nội dung của stylesheet.
* `precedence`: một chuỗi. Cho React biết cách xếp hạng `<style>` node DOM so với các node khác trong `<head>` của tài liệu, từ đó xác định stylesheet nào có thể ghi đè stylesheet kia. React sẽ suy ra rằng các giá trị precedence mà nó phát hiện trước là “thấp hơn”, còn các giá trị precedence phát hiện sau là “cao hơn”. Nhiều hệ thống style có thể hoạt động tốt khi chỉ sử dụng một giá trị precedence duy nhất vì các quy tắc style là atomic. Các stylesheet có cùng precedence sẽ được nhóm lại với nhau, bất kể chúng là `<link>` hay các thẻ `<style>` inline, hoặc được tải bằng các hàm [`preinit`](/reference/react-dom/preinit).
* `href`: một chuỗi. Cho phép React [loại bỏ các style trùng lặp](#special-rendering-behavior) có cùng `href`.
* `media`: một chuỗi. Giới hạn stylesheet trong một [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) nhất định.
* `nonce`: một chuỗi. Một [nonce mật mã cho phép tài nguyên](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Content Security Policy nghiêm ngặt.
* `title`: một chuỗi. Chỉ định tên của một [stylesheet thay thế](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Các prop **không được khuyến nghị** sử dụng với React:

* `blocking`: một chuỗi. Nếu được đặt thành `"render"`, chỉ thị cho trình duyệt không render trang cho đến khi stylesheet được tải. React cung cấp khả năng kiểm soát chi tiết hơn bằng Suspense.

#### Hành vi render đặc biệt {/*special-rendering-behavior*/}

React có thể di chuyển các component `<style>` vào `<head>` của tài liệu, loại bỏ các stylesheet trùng lặp và [tạm dừng](/reference/react/Suspense) trong khi stylesheet đang được tải.

Để bật hành vi này, hãy cung cấp các prop `href` và `precedence`. React sẽ loại bỏ các style trùng lặp nếu chúng có cùng `href`. Prop precedence cho React biết cách xếp hạng `<style>` node DOM so với các node khác trong `<head>` của tài liệu, từ đó xác định stylesheet nào có thể ghi đè stylesheet kia.

Cách xử lý đặc biệt này có ba điểm cần lưu ý:

* React sẽ bỏ qua các thay đổi đối với prop sau khi style đã được render. (React sẽ đưa ra cảnh báo trong môi trường development nếu điều này xảy ra.)
* React sẽ loại bỏ tất cả các prop thừa khi sử dụng prop `precedence` (ngoài `href` và `precedence`).
* React có thể giữ style trong DOM ngay cả sau khi component đã render style đó bị unmount.

---

## Cách sử dụng {/*usage*/}

### Render một stylesheet CSS inline {/*rendering-an-inline-css-stylesheet*/}

Nếu một component phụ thuộc vào một số style CSS nhất định để được hiển thị chính xác, bạn có thể render một stylesheet inline bên trong component đó.

Prop `href` phải xác định duy nhất stylesheet, vì React sẽ loại bỏ các stylesheet trùng lặp có cùng `href`.
Nếu cung cấp prop `precedence`, React sẽ sắp xếp lại các stylesheet inline dựa trên thứ tự xuất hiện của các giá trị này trong cây component.

Các stylesheet inline sẽ không kích hoạt các boundary Suspense trong khi đang tải.
Ngay cả khi chúng tải các tài nguyên bất đồng bộ như font hoặc hình ảnh.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>