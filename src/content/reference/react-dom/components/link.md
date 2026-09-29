---
link: "<link>"
---

<Intro>

Thành phần [built-in browser `<link>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) cho phép bạn sử dụng các tài nguyên bên ngoài như stylesheet hoặc chú thích tài liệu bằng metadata của link.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `<link>` {/*link*/}

Để liên kết đến các tài nguyên bên ngoài như stylesheet, font và icon, hoặc chú thích tài liệu bằng metadata của link, hãy render thành phần [built-in browser `<link>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). Bạn có thể render `<link>` từ bất kỳ component nào và React sẽ [trong hầu hết các trường hợp](#special-rendering-behavior) đặt phần tử DOM tương ứng vào document head.

```js
<link rel="icon" href="favicon.ico" />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<link>` hỗ trợ tất cả [common element props.](/reference/react-dom/components/common#common-props)

* `rel`: một string, bắt buộc. Chỉ định [mối quan hệ với tài nguyên](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). React [xử lý các link có `rel="stylesheet"` khác biệt](#special-rendering-behavior) so với các link khác.

Các prop này được áp dụng khi `rel="stylesheet"`:

* `precedence`: một string. Cho React biết cách xếp hạng `<link>` node DOM tương đối với các node khác trong `<head>` của tài liệu, qua đó xác định stylesheet nào có thể override stylesheet còn lại. React sẽ suy ra rằng các giá trị precedence mà nó phát hiện trước là "thấp hơn", còn các giá trị precedence phát hiện sau là "cao hơn". Nhiều style system có thể hoạt động tốt chỉ với một giá trị precedence duy nhất vì các style rule mang tính atomic. Các stylesheet có cùng precedence sẽ được nhóm lại với nhau, bất kể chúng là `<link>` hay các tag `<style>` inline hoặc được load bằng các hàm [`preinit`](/reference/react-dom/preinit).
* `media`: một string. Giới hạn stylesheet cho một [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) nhất định.
* `title`: một string. Chỉ định tên của một [alternative stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Các prop này được áp dụng khi `rel="stylesheet"` nhưng vô hiệu hóa [cách xử lý đặc biệt của React đối với stylesheet](#special-rendering-behavior):

* `disabled`: một boolean. Vô hiệu hóa stylesheet.
* `onError`: một function. Được gọi khi stylesheet không load được.
* `onLoad`: một function. Được gọi khi stylesheet load xong.

Các prop này được áp dụng khi `rel="preload"` hoặc `rel="modulepreload"`:

* `as`: một string. Loại tài nguyên. Các giá trị có thể là `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
* `imageSrcSet`: một string. Chỉ áp dụng khi `as="image"`. Chỉ định [source set của image](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
* `imageSizes`: một string. Chỉ áp dụng khi `as="image"`. Chỉ định [sizes của image](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Các prop này được áp dụng khi `rel="icon"` hoặc `rel="apple-touch-icon"`:

* `sizes`: một string. [Sizes của icon](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Các prop này được áp dụng trong mọi trường hợp:

* `href`: một string. URL của tài nguyên được liên kết.
*  `crossOrigin`: một string. [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) cần sử dụng. Các giá trị có thể là `anonymous` và `use-credentials`. Bắt buộc phải có khi `as` được đặt thành `"fetch"`.
*  `referrerPolicy`: một string. [Referrer header](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) sẽ gửi khi fetching. Các giá trị có thể là `no-referrer-when-downgrade` (mặc định), `no-referrer`, `origin`, `origin-when-cross-origin` và `unsafe-url`.
* `fetchPriority`: một string. Gợi ý mức độ ưu tiên tương đối khi fetch tài nguyên. Các giá trị có thể là `auto` (mặc định), `high` và `low`.
* `hrefLang`: một string. Ngôn ngữ của tài nguyên được liên kết.
* `integrity`: một string. Hash mật mã của tài nguyên, dùng để [xác minh tính xác thực](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) của tài nguyên.
* `type`: một string. MIME type của tài nguyên được liên kết.

Các prop **không được khuyến nghị** sử dụng với React:

* `blocking`: một string. Nếu được đặt thành `"render"`, yêu cầu browser không render trang cho đến khi stylesheet được load. React cung cấp quyền kiểm soát chi tiết hơn bằng Suspense.

#### Hành vi render đặc biệt {/*special-rendering-behavior*/}

React sẽ luôn đặt phần tử DOM tương ứng với component `<link>` bên trong `<head>` của document, bất kể nó được render ở vị trí nào trong React tree. `<head>` là nơi duy nhất hợp lệ để `<link>` tồn tại trong DOM, nhưng việc cho phép một component đại diện cho một trang cụ thể tự render các component `<link>` vẫn thuận tiện và giúp duy trì khả năng composable.

Có một vài ngoại lệ:

* Nếu `<link>` có prop `rel="stylesheet"`, thì nó cũng phải có prop `precedence` để nhận được hành vi đặc biệt này. Nguyên nhân là thứ tự của các stylesheet trong document rất quan trọng, vì vậy React cần biết cách sắp xếp stylesheet này tương đối với các stylesheet khác; bạn chỉ định điều đó bằng prop `precedence`. Nếu bỏ qua prop `precedence`, sẽ không có hành vi đặc biệt.
* Nếu `<link>` có prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), sẽ không có hành vi đặc biệt, vì trong trường hợp này nó không áp dụng cho document mà thay vào đó đại diện cho metadata về một phần cụ thể của trang.
* Nếu `<link>` có prop `onLoad` hoặc `onError`, vì trong trường hợp đó bạn đang tự quản lý việc load tài nguyên được liên kết bên trong React component của mình.

#### Hành vi đặc biệt đối với stylesheet {/*special-behavior-for-stylesheets*/}

Ngoài ra, nếu `<link>` trỏ đến một stylesheet (nghĩa là trong props của nó có `rel="stylesheet"`), React sẽ xử lý nó theo những cách đặc biệt sau:

* Component render `<link>` sẽ [suspend](/reference/react/Suspense) trong khi stylesheet đang load.
* Nếu nhiều component render link đến cùng một stylesheet, React sẽ loại bỏ các link trùng lặp và chỉ đưa một link duy nhất vào DOM. Hai link được xem là giống nhau nếu chúng có cùng prop `href`.

Có hai ngoại lệ đối với hành vi đặc biệt này:

* Nếu link không có prop `precedence`, sẽ không có hành vi đặc biệt, vì thứ tự của các stylesheet trong document rất quan trọng; do đó React cần biết cách sắp xếp stylesheet này tương đối với các stylesheet khác, và bạn chỉ định điều đó bằng prop `precedence`.
* Nếu bạn cung cấp bất kỳ prop nào trong số `onLoad`, `onError` hoặc `disabled`, sẽ không có hành vi đặc biệt, vì các prop này cho biết bạn đang tự quản lý việc load stylesheet bên trong component của mình.

Cách xử lý đặc biệt này có hai điểm cần lưu ý:

* React sẽ bỏ qua các thay đổi đối với props sau khi link đã được render. (React sẽ đưa ra cảnh báo trong development nếu điều này xảy ra.)
* React có thể giữ lại link trong DOM ngay cả sau khi component đã render link đó bị unmount.

---

## Cách sử dụng {/*usage*/}

### Liên kết đến các tài nguyên liên quan {/*linking-to-related-resources*/}

Bạn có thể chú thích document bằng các link đến những tài nguyên liên quan như icon, canonical URL hoặc pingback. React sẽ đặt metadata này bên trong document `<head>`, bất kể nó được render ở vị trí nào trong React tree.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Liên kết đến stylesheet {/*linking-to-a-stylesheet*/}

Nếu một component phụ thuộc vào một stylesheet cụ thể để hiển thị chính xác, bạn có thể render link đến stylesheet đó bên trong component. Component của bạn sẽ [suspend](/reference/react/Suspense) trong khi stylesheet đang load. Bạn phải cung cấp prop `precedence`, prop này cho React biết vị trí đặt stylesheet này tương đối với các stylesheet khác — stylesheet có precedence cao hơn có thể override stylesheet có precedence thấp hơn.

<Note>
Khi muốn sử dụng một stylesheet, bạn có thể gọi hàm [preinit](/reference/react-dom/preinit). Việc gọi hàm này có thể cho phép trình duyệt bắt đầu tải stylesheet sớm hơn so với khi bạn chỉ render một component `<link>`, chẳng hạn bằng cách gửi một [phản hồi HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Kiểm soát độ ưu tiên của stylesheet {/*controlling-stylesheet-precedence*/}

Các stylesheet có thể xung đột với nhau và khi đó, trình duyệt sẽ sử dụng stylesheet xuất hiện sau trong tài liệu. React cho phép bạn kiểm soát thứ tự của các stylesheet bằng prop `precedence`. Trong ví dụ này, ba component render các stylesheet, và những stylesheet có cùng độ ưu tiên được nhóm lại trong `<head>`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent/>
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="first" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="second" />;
}

function ThirdComponent() {
  return <link rel="stylesheet" href="third.css" precedence="first" />;
}

```

</SandpackWithHTMLOutput>

Lưu ý rằng bản thân các giá trị `precedence` là tùy ý và bạn có thể đặt tên theo ý muốn. React sẽ suy ra rằng các giá trị độ ưu tiên mà nó phát hiện trước là “thấp hơn”, còn các giá trị độ ưu tiên mà nó phát hiện sau là “cao hơn”.

### Render stylesheet được loại bỏ trùng lặp {/*deduplicated-stylesheet-rendering*/}

Nếu bạn render cùng một stylesheet từ nhiều component, React sẽ chỉ đặt một `<link>` duy nhất trong phần head của tài liệu.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### Chú thích các mục cụ thể trong tài liệu bằng liên kết {/*annotating-specific-items-within-the-document-with-links*/}

Bạn có thể sử dụng component `<link>` cùng với prop `itemProp` để chú thích các mục cụ thể trong tài liệu bằng các liên kết đến những tài nguyên liên quan. Trong trường hợp này, React *sẽ không* đặt các chú thích này bên trong `<head>` của tài liệu mà sẽ đặt chúng giống như bất kỳ component React nào khác.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```