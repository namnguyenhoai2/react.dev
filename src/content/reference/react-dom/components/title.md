---
title: "<title>"
---

<Intro>

Thành phần [built-in browser `<title>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) cho phép bạn chỉ định tiêu đề của tài liệu.

```js
<title>My Blog</title>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<title>` {/*title*/}

Để chỉ định tiêu đề của tài liệu, hãy render thành phần [built-in browser `<title>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title). Bạn có thể render `<title>` từ bất kỳ component nào và React sẽ luôn đặt phần tử DOM tương ứng trong phần head của tài liệu.

```js
<title>My Blog</title>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<title>` hỗ trợ tất cả [common element props.](/reference/react-dom/components/common#common-props)

* `children`: `<title>` chỉ chấp nhận văn bản làm phần tử con. Văn bản này sẽ trở thành tiêu đề của tài liệu. Bạn cũng có thể truyền các component của riêng mình, miễn là chúng chỉ render văn bản.

#### Hành vi render đặc biệt {/*special-rendering-behavior*/}

React sẽ luôn đặt phần tử DOM tương ứng với component `<title>` bên trong `<head>` của tài liệu, bất kể nó được render ở đâu trong cây React. `<head>` là vị trí hợp lệ duy nhất để `<title>` tồn tại trong DOM, nhưng việc cho phép một component đại diện cho một trang cụ thể tự render `<title>` sẽ thuận tiện và giúp các thành phần có thể kết hợp với nhau.

Có hai ngoại lệ:
* Nếu `<title>` nằm trong một component `<svg>`, thì không có hành vi đặc biệt nào, vì trong ngữ cảnh này, nó không đại diện cho tiêu đề của tài liệu mà là một [accessibility annotation for that SVG graphic](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title).
* Nếu `<title>` có prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), thì không có hành vi đặc biệt nào, vì trong trường hợp này, nó không đại diện cho tiêu đề của tài liệu mà là siêu dữ liệu về một phần cụ thể của trang.

<Pitfall>

Chỉ render một `<title>` tại một thời điểm. Nếu có nhiều component cùng render thẻ `<title>`, React sẽ đặt tất cả các tiêu đề đó vào phần head của tài liệu. Khi điều này xảy ra, hành vi của trình duyệt và công cụ tìm kiếm là không xác định.

</Pitfall>

---

## Cách sử dụng {/*usage*/}

### Đặt tiêu đề tài liệu {/*set-the-document-title*/}

Render component `<title>` từ bất kỳ component nào với văn bản làm các phần tử con của nó. React sẽ đặt một node DOM `<title>` vào `<head>` của tài liệu.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Sử dụng biến trong tiêu đề {/*use-variables-in-the-title*/}

Các phần tử con của component `<title>` phải là một chuỗi văn bản duy nhất. (Hoặc một số duy nhất hay một object duy nhất có phương thức `toString`.) Điều này có thể không rõ ràng, nhưng việc sử dụng dấu ngoặc nhọn JSX như sau:

```js
<title>Results page {pageNumber}</title> // 🔴 Vấn đề: Đây không phải một chuỗi duy nhất
```

... thực ra khiến component `<title>` nhận một mảng gồm hai phần tử làm các phần tử con (chuỗi `"Results page"` và giá trị của `pageNumber`). Điều này sẽ gây ra lỗi. Thay vào đó, hãy sử dụng string interpolation để truyền cho `<title>` một chuỗi duy nhất:

```js
<title>{`Results page ${pageNumber}`}</title>
```
