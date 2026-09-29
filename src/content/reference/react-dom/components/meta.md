---
meta: "<meta>"
---

<Intro>

Component [built-in của trình duyệt `<meta>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) cho phép bạn thêm metadata vào tài liệu.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<meta>` {/*meta*/}

Để thêm metadata cho tài liệu, hãy render component [built-in của trình duyệt `<meta>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta). Bạn có thể render `<meta>` từ bất kỳ component nào và React sẽ luôn đặt phần tử DOM tương ứng vào phần head của tài liệu.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<meta>` hỗ trợ tất cả [props phổ biến của element.](/reference/react-dom/components/common#common-props)

Nó phải có *chính xác một* trong các prop sau: `name`, `httpEquiv`, `charset`, `itemProp`. Component `<meta>` thực hiện các tác vụ khác nhau tùy thuộc vào prop nào trong số này được chỉ định.

* `name`: một chuỗi. Chỉ định [loại metadata](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) sẽ được đính kèm vào tài liệu.
* `charset`: một chuỗi. Chỉ định bộ ký tự được tài liệu sử dụng. Giá trị hợp lệ duy nhất là `"utf-8"`.
* `httpEquiv`: một chuỗi. Chỉ định một chỉ thị để xử lý tài liệu.
* `itemProp`: một chuỗi. Chỉ định metadata về một mục cụ thể trong tài liệu thay vì toàn bộ tài liệu.
* `content`: một chuỗi. Chỉ định metadata sẽ được đính kèm khi được dùng cùng với prop `name` hoặc `itemProp`, hoặc chỉ định hành vi của chỉ thị khi được dùng cùng với prop `httpEquiv`.

#### Hành vi render đặc biệt {/*special-rendering-behavior*/}

React sẽ luôn đặt phần tử DOM tương ứng với component `<meta>` bên trong `<head>` của tài liệu, bất kể component đó được render ở đâu trong cây React. `<head>` là nơi hợp lệ duy nhất để `<meta>` tồn tại trong DOM, tuy nhiên sẽ thuận tiện và giúp các component có khả năng kết hợp với nhau hơn nếu một component đại diện cho một trang cụ thể có thể tự render các component `<meta>`.

Có một ngoại lệ: nếu `<meta>` có prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), thì không có hành vi đặc biệt nào, vì trong trường hợp này nó không đại diện cho metadata của tài liệu mà là metadata của một phần cụ thể trên trang.

---

## Cách sử dụng {/*usage*/}

### Gắn metadata cho tài liệu {/*annotating-the-document-with-metadata*/}

Bạn có thể chú thích tài liệu bằng metadata như từ khóa, bản tóm tắt hoặc tên tác giả. React sẽ đặt metadata này trong `<head>` của tài liệu, bất kể nó được render ở đâu trong cây React.

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

Bạn có thể render component `<meta>` từ bất kỳ component nào. React sẽ đặt một node DOM `<meta>` trong `<head>` của tài liệu.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Gắn metadata cho các mục cụ thể trong tài liệu {/*annotating-specific-items-within-the-document-with-metadata*/}

Bạn có thể sử dụng component `<meta>` cùng với prop `itemProp` để chú thích các mục cụ thể trong tài liệu bằng metadata. Trong trường hợp này, React sẽ *không* đặt các chú thích này trong `<head>` của tài liệu mà sẽ đặt chúng giống như bất kỳ component React nào khác.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```