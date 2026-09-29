---
script: "<script>"
---

<Intro>

[component `<script>` built-in browser](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) cho phép bạn thêm một script vào tài liệu của mình.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<script>` {/*script*/}

Để thêm các script inline hoặc bên ngoài vào tài liệu, hãy render component [built-in browser `<script>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script). Bạn có thể render `<script>` từ bất kỳ component nào và React sẽ [trong một số trường hợp](#special-rendering-behavior) đặt phần tử DOM tương ứng vào phần head của tài liệu và loại bỏ các script trùng lặp.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<script>` hỗ trợ tất cả [props phổ biến của phần tử.](/reference/react-dom/components/common#common-props)

Nó phải có *hoặc* `children` *hoặc* một prop `src`.

* `children`: một chuỗi. Mã nguồn của một script inline.
* `src`: một chuỗi. URL của một script bên ngoài.

Các props được hỗ trợ khác:

* `async`: một boolean. Cho phép trình duyệt trì hoãn việc thực thi script cho đến khi phần còn lại của tài liệu được xử lý — đây là hành vi được ưu tiên để cải thiện hiệu năng.
*  `crossOrigin`: một chuỗi. [Chính sách CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) cần sử dụng. Các giá trị có thể là `anonymous` và `use-credentials`.
* `fetchPriority`: một chuỗi. Cho phép trình duyệt xếp hạng mức độ ưu tiên của các script khi tải nhiều script cùng lúc. Có thể là `"high"`, `"low"` hoặc `"auto"` (mặc định).
* `integrity`: một chuỗi. Một cryptographic hash của script, để [xác minh tính xác thực](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) của script.
* `noModule`: một boolean. Vô hiệu hóa script trong các trình duyệt hỗ trợ ES modules — cho phép sử dụng một script dự phòng cho các trình duyệt không hỗ trợ.
* `nonce`: một chuỗi. Một [nonce cryptographic để cho phép resource](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) khi sử dụng Content Security Policy nghiêm ngặt.
* `referrer`: một chuỗi. Cho biết [header Referer nào cần gửi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) khi tải script và mọi resource mà script đó tiếp tục tải.
* `type`: một chuỗi. Cho biết script là [classic script, ES module hay import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type).

Các props vô hiệu hóa [cách xử lý đặc biệt đối với script](#special-rendering-behavior) của React:

* `onError`: một function. Được gọi khi script không tải được.
* `onLoad`: một function. Được gọi khi script tải xong.

Các props **không được khuyến nghị** sử dụng với React:

* `blocking`: một chuỗi. Nếu được đặt thành `"render"`, yêu cầu trình duyệt không render trang cho đến khi scriptsheet được tải. React cung cấp khả năng kiểm soát chi tiết hơn bằng Suspense.
* `defer`: một chuỗi. Ngăn trình duyệt thực thi script cho đến khi tài liệu tải xong. Không tương thích với các component được server-render theo kiểu streaming. Thay vào đó, hãy sử dụng prop `async`.

#### Hành vi render đặc biệt {/*special-rendering-behavior*/}

React có thể di chuyển các component `<script>` vào `<head>` của tài liệu và loại bỏ các script trùng lặp.

Để bật hành vi này, hãy cung cấp các props `src` và `async={true}`. React sẽ loại bỏ các script trùng lặp nếu chúng có cùng `src`. Prop `async` phải là true để cho phép di chuyển script một cách an toàn.

Cách xử lý đặc biệt này có hai điểm cần lưu ý:

* React sẽ bỏ qua các thay đổi đối với props sau khi script đã được render. (React sẽ đưa ra cảnh báo trong môi trường development nếu điều này xảy ra.)
* React có thể giữ lại script trong DOM ngay cả sau khi component đã render script đó bị unmount. (Điều này không gây ảnh hưởng vì script chỉ được thực thi một lần khi được chèn vào DOM.)

---

## Cách sử dụng {/*usage*/}

### Render một script bên ngoài {/*rendering-an-external-script*/}

Nếu một component phụ thuộc vào một số script nhất định để hiển thị chính xác, bạn có thể render một `<script>` bên trong component.
Tuy nhiên, component có thể được commit trước khi script tải xong.
Bạn có thể bắt đầu phụ thuộc vào nội dung của script sau khi event `load` được kích hoạt, chẳng hạn bằng cách sử dụng prop `onLoad`.

React sẽ loại bỏ các script trùng lặp có cùng `src`, chỉ chèn một script vào DOM ngay cả khi nhiều component render script đó.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
Khi muốn sử dụng một script, việc gọi function [preinit](/reference/react-dom/preinit) có thể hữu ích. Việc gọi function này có thể cho phép trình duyệt bắt đầu tải script sớm hơn so với chỉ render một component `<script>`, chẳng hạn bằng cách gửi phản hồi [HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

### Render một script inline {/*rendering-an-inline-script*/}

Để thêm một script inline, hãy render component `<script>` với mã nguồn của script làm nội dung con. Các script inline không bị loại bỏ trùng lặp hoặc di chuyển vào `<head>` của tài liệu.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>