---
title: "<img>"
---

<Intro>

[component `<img>` tích hợp sẵn trong trình duyệt](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) cho phép bạn nhúng một hình ảnh.

```js
<img src="photo.jpg" alt="A person walking through a park" />
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `<img>` {/*img*/}

Để hiển thị một hình ảnh, hãy render component [ tích hợp sẵn trong trình duyệt `<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img).

```js
<img src="photo.jpg" alt="A person walking through a park" />
```

[Xem thêm ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<img>` hỗ trợ tất cả [prop phần tử phổ biến.](/reference/react-dom/components/common#common-props)

* `alt`: một chuỗi. Chỉ định văn bản thay thế cho hình ảnh. Sử dụng chuỗi rỗng cho hình ảnh chỉ mang tính trang trí.
* `crossOrigin`: một chuỗi. Chỉ định [chính sách CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) sẽ được sử dụng khi tải hình ảnh. Các giá trị có thể là `anonymous` và `use-credentials`.
* `decoding`: một chuỗi. Gợi ý liệu trình duyệt có nên chờ giải mã hình ảnh trước khi hiển thị nội dung khác hay không. Các giá trị có thể là `async`, `sync` và `auto` (mặc định).
* `fetchPriority`: một chuỗi. Gợi ý mức độ ưu tiên tương đối khi tải hình ảnh. Các giá trị có thể là `high`, `low` và `auto` (mặc định). Trong quá trình server rendering, `fetchPriority="low"` cũng ngăn React [tự động preload hình ảnh.](#controlling-image-preloading-during-server-rendering)
* `height`: một số hoặc chuỗi. Chỉ định chiều cao được render của hình ảnh.
* `loading`: một chuỗi. Chỉ định liệu trình duyệt có nên trì hoãn việc tải hình ảnh cho đến khi hình ảnh ở gần viewport hay không. Các giá trị có thể là `eager` (mặc định) và `lazy`. Việc đặt `loading="lazy"` sẽ ngăn React [tự động preload hình ảnh.](#controlling-image-preloading-during-server-rendering)
* `onError`: một hàm [xử lý sự kiện](/reference/react-dom/components/common#event-handler). Được gọi khi hình ảnh không tải được.
* `onLoad`: một hàm [xử lý sự kiện](/reference/react-dom/components/common#event-handler). Được gọi khi hình ảnh tải xong. Truyền `onLoad` sẽ ngăn React [chờ hình ảnh trong quá trình cập nhật View Transition được render ở client.](#waiting-for-an-image-during-a-view-transition)
* `referrerPolicy`: một chuỗi. Chỉ định [thông tin referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#referrerpolicy) sẽ gửi khi tải hình ảnh.
* `sizes`: một chuỗi. Chỉ định kích thước hình ảnh cho các bố cục trang khác nhau. Được sử dụng cùng với `srcSet`.
* `src`: một chuỗi. Chỉ định URL của hình ảnh.
* `srcSet`: một chuỗi. Chỉ định một hoặc nhiều nguồn hình ảnh ứng viên để trình duyệt lựa chọn.
* `useMap`: một chuỗi. Liên kết hình ảnh với [image map phía client](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map).
* `width`: một số hoặc chuỗi. Chỉ định chiều rộng được render của hình ảnh.

#### Lưu ý {/*caveats*/}

* Không truyền chuỗi rỗng cho `src`. Điều này có thể khiến trình duyệt yêu cầu lại trang hiện tại. React sẽ cảnh báo trong môi trường development và bỏ qua attribute này. Để không render hình ảnh, hãy bỏ qua `<img>` hoặc truyền `null` cho `src`.
* `<img>` không thể có children hoặc sử dụng `dangerouslySetInnerHTML`. React sẽ throw error nếu bạn truyền một trong hai.
* `fetchPriority="low"` không ngăn React chờ hình ảnh tải và giải mã trong quá trình cập nhật View Transition được render ở client. Hãy sử dụng `loading="lazy"` hoặc một handler `onLoad` để chọn không sử dụng hành vi đó.

---

## Cách sử dụng {/*usage*/}

### Hiển thị hình ảnh {/*displaying-an-image*/}

Truyền URL của hình ảnh cho `src` và phần mô tả bằng văn bản cho `alt`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      width={100}
      height={100}
    />
  );
}
```

```css
img {
  border-radius: 50%;
  object-fit: cover;
}
```

</Sandpack>

Chỉ định `width` và `height` khi bạn biết kích thước hình ảnh để trình duyệt có thể dành sẵn không gian trước khi hình ảnh tải. Đối với hình ảnh mang tính trang trí, hãy truyền `alt=""` để trình đọc màn hình bỏ qua hình ảnh đó.

---

### Kiểm soát việc preload hình ảnh trong quá trình server rendering {/*controlling-image-preloading-during-server-rendering*/}

Trong quá trình server rendering, theo mặc định React tự động tạo gợi ý preload cho một `<img>`. Điều này cho phép trình duyệt bắt đầu tải hình ảnh trước khi gặp `<img>` trong HTML đã render.

Thêm `loading="lazy"` hoặc `fetchPriority="low"` vào hình ảnh không nên nhận gợi ý này:

```js
function ProductPage() {
  return (
    <>
      <img src="hero.jpg" alt="Featured product" />
      <img src="thumbnail.jpg" alt="Related product" loading="lazy" />
      <img src="secondary.jpg" alt="Another product" fetchPriority="low" />
    </>
  );
}
```

Trong ví dụ này, React chỉ tạo gợi ý preload cho `hero.jpg`. Tùy thuộc vào server API hoặc framework, React có thể render phần tử tương đương với phần tử này:

```html
<link rel="preload" as="image" href="hero.jpg" />
```

Thay vào đó, React có thể cung cấp cùng gợi ý đó trong response header `Link`. Hai hình ảnh còn lại vẫn giữ các prop `loading` và `fetchPriority` trong HTML đã render, nhưng React không tạo gợi ý preload cho chúng. Prop `loading="lazy"` yêu cầu trình duyệt trì hoãn việc tải hình ảnh cho đến khi hình ảnh tiến gần viewport. Prop `fetchPriority="low"` cho phép hình ảnh tải ngay lập tức, nhưng yêu cầu trình duyệt tải hình ảnh với mức ưu tiên thấp hơn.

React cũng không tự động preload hình ảnh khi hình ảnh nằm bên trong phần tử `<picture>` hoặc `<noscript>`, hoặc khi `src` hay `srcSet` của hình ảnh là data URL.

Nếu bạn render hình ảnh thông qua framework hoặc thư viện component, hãy tham khảo tài liệu của thư viện đó để biết hành vi mặc định. React quyết định có tạo preload tự động hay không dựa trên các prop của `<img>` bên dưới. Ví dụ, một image component có thể thêm `loading="lazy"` theo mặc định và cung cấp một tùy chọn riêng để preload rõ ràng các hình ảnh được chọn.

Để tạo gợi ý preload rõ ràng, hãy gọi [`preload`](/reference/react-dom/preload).

---

### Chờ hình ảnh trong quá trình View Transition {/*waiting-for-an-image-during-a-view-transition*/}

Trong quá trình cập nhật [`<ViewTransition>`](/reference/react/ViewTransition) được render ở client, React có thể chờ hình ảnh tải và giải mã trước khi bắt đầu animation. Điều này áp dụng khi một `<img>` mới có `src` không rỗng được render, hoặc khi `src` hay `srcSet` của hình ảnh hiện có thay đổi. Hình ảnh phải nằm bên trong subtree `<ViewTransition>` và không được có `loading="lazy"` hoặc handler `onLoad`. React không chờ hình ảnh trong các cập nhật đồng bộ.

Khi một Suspense boundary hiển thị nội dung được stream bên trong `<ViewTransition>`, React cũng có thể chờ các hình ảnh hiển thị có `src` không rỗng và không có `loading="lazy"`. React sẽ ngừng chờ sau một khoảng thời gian giới hạn để hình ảnh tải chậm không chặn cập nhật vô thời hạn.

Trong ví dụ này, Suspense boundary được bọc trong `<ViewTransition>` và hiển thị skeleton hồ sơ cho đến khi ảnh chân dung tải xong.

Để so sánh, button thứ hai chèn cùng card đó trực tiếp vào DOM. Card xuất hiện ngay lập tức và trình duyệt hiển thị hình ảnh sau khi hình ảnh tải xong:

<Sandpack>

```js
import { ViewTransition, Suspense, useState, startTransition } from 'react';
import { freshImageUrl } from './image.js';
import VanillaProfile from './VanillaProfile.js';

function Profile({ src }) {
  return (
    <div className="card">
      <img src={src} alt="Jack Pope" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [src, setSrc] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setSrc(freshImageUrl());
          });
        }}>
        Show profile
      </button>
      {src && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile src={src} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfile />
    </>
  );
}
```

```js src/VanillaProfile.js
import { useRef } from 'react';
import { freshImageUrl } from './image.js';

export default function VanillaProfile() {
  const ref = useRef(null);
  function show() {
    ref.current.innerHTML = `<div class="card">
      <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
      <p>Jack Pope</p>
    </div>`;
  }
  return (
    <>
      <button onClick={show}>Show profile (direct DOM update)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/image.js hidden
  // Thêm một parameter duy nhất để image không bị cache,
  // và mỗi lần chạy đều hiển thị trạng thái loading.
export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>
