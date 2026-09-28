---
title: Nhập và xuất các component
---

<Intro>

Điểm kỳ diệu của các component nằm ở khả năng tái sử dụng: bạn có thể tạo các component được cấu thành từ những component khác. Tuy nhiên, khi lồng ngày càng nhiều component, việc bắt đầu tách chúng thành các tệp khác nhau thường là hợp lý. Điều này giúp bạn dễ dàng xem qua các tệp và tái sử dụng component ở nhiều nơi hơn.

</Intro>

<YouWillLearn>

* Tệp component gốc là gì
* Cách nhập và xuất một component
* Khi nào nên sử dụng default và named import, export
* Cách nhập và xuất nhiều component từ một tệp
* Cách tách component thành nhiều tệp

</YouWillLearn>

## Tệp component gốc {/*the-root-component-file*/}

Trong [Thành phần đầu tiên của bạn](/learn/your-first-component), bạn đã tạo một component `Profile` và một component `Gallery` render nó:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Hiện tại, chúng nằm trong một **tệp component gốc,** trong ví dụ này có tên là `App.js`. Tuy nhiên, tùy vào thiết lập của bạn, component gốc có thể nằm trong một tệp khác. Nếu bạn sử dụng framework có định tuyến dựa trên tệp, chẳng hạn như Next.js, component gốc của bạn sẽ khác nhau đối với mỗi trang.

## Xuất và nhập một component {/*exporting-and-importing-a-component*/}

Nếu trong tương lai bạn muốn thay đổi màn hình landing và đặt một danh sách sách khoa học ở đó thì sao? Hoặc đặt tất cả profile ở một nơi khác? Việc chuyển `Gallery` và `Profile` ra khỏi tệp component gốc là hợp lý. Điều này sẽ giúp chúng có tính module và có thể tái sử dụng trong các tệp khác. Bạn có thể di chuyển một component qua ba bước:

1. **Tạo** một tệp JS mới để đặt các component vào đó.
2. **Export** function component từ tệp đó (sử dụng [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) hoặc [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) export).
3. **Import** component trong tệp nơi bạn sẽ sử dụng nó (sử dụng kỹ thuật tương ứng để import [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) hoặc [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) export).

Ở đây, cả `Profile` và `Gallery` đã được chuyển từ `App.js` sang một tệp mới có tên là `Gallery.js`. Bây giờ bạn có thể thay đổi `App.js` để import `Gallery` từ `Gallery.js`:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Lưu ý cách ví dụ này hiện được chia thành hai tệp component:

1. `Gallery.js`:
     - Định nghĩa component `Profile`, chỉ được sử dụng trong cùng tệp và không được export.
     - Export component `Gallery` dưới dạng **default export.**
2. `App.js`:
     - Import `Gallery` dưới dạng **default import** từ `Gallery.js`.
     - Export component gốc `App` dưới dạng **default export.**


<Note>

Bạn có thể gặp các tệp bỏ phần mở rộng `.js` như sau:

```js
import Gallery from './Gallery';
```

Cả `'./Gallery.js'` và `'./Gallery'` đều hoạt động với React, dù cách đầu tiên gần với cách [native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) hoạt động hơn.

</Note>

<DeepDive>

#### Default export và named export {/*default-vs-named-exports*/}

Có hai cách chính để export các giá trị bằng JavaScript: default export và named export. Cho đến nay, các ví dụ của chúng ta chỉ sử dụng default export. Tuy nhiên, bạn có thể sử dụng một trong hai hoặc cả hai trong cùng một tệp. **Một tệp không thể có nhiều hơn một _default_ export, nhưng có thể có bao nhiêu _named_ export tùy ý.**

![Default và named export](/images/docs/illustrations/i_import-export.svg)

Cách bạn export component sẽ quyết định cách bạn phải import nó. Bạn sẽ gặp lỗi nếu cố import một default export theo cùng cách với named export! Bảng này có thể giúp bạn theo dõi:

| Cú pháp           | Câu lệnh export                           | Câu lệnh import                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

Khi viết _default_ import, bạn có thể đặt bất kỳ tên nào mình muốn sau `import`. Ví dụ, bạn có thể viết `import Banana from './Button.js'` thay thế mà vẫn nhận được cùng default export. Ngược lại, với named import, tên phải khớp ở cả hai phía. Đó là lý do chúng được gọi là named import!

**Mọi người thường sử dụng default export nếu tệp chỉ export một component, và sử dụng named export nếu tệp export nhiều component và giá trị.** Bất kể bạn thích phong cách viết code nào, hãy luôn đặt tên có ý nghĩa cho các function component và các tệp chứa chúng. Các component không có tên, chẳng hạn như `export default () => {}`, không được khuyến khích vì chúng khiến việc debug khó khăn hơn.

</DeepDive>

## Export và import nhiều component từ cùng một tệp {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Nếu bạn chỉ muốn hiển thị một `Profile` thay vì một gallery thì sao? Bạn cũng có thể export component `Profile`. Tuy nhiên, `Gallery.js` đã có một *default* export và bạn không thể có _hai_ default export. Bạn có thể tạo một tệp mới với default export, hoặc thêm một *named* export cho `Profile`. **Một tệp chỉ có thể có một default export, nhưng có thể có rất nhiều named export!**

<Note>

Để giảm khả năng nhầm lẫn giữa default và named export, một số nhóm chọn chỉ theo một phong cách (default hoặc named), hoặc tránh kết hợp chúng trong cùng một tệp. Hãy chọn cách phù hợp nhất với bạn!

</Note>

Trước tiên, **export** `Profile` từ `Gallery.js` bằng named export (không có từ khóa `default`):

```js
export function Profile() {
  // ...
}
```

Sau đó, **import** `Profile` từ `Gallery.js` vào `App.js` bằng named import (có dấu ngoặc nhọn):

```js
import { Profile } from './Gallery.js';
```

Cuối cùng, **render** `<Profile />` từ component `App`:

```js
export default function App() {
  return <Profile />;
}
```

Bây giờ `Gallery.js` chứa hai export: một default `Gallery` export và một named `Profile` export. `App.js` import cả hai. Hãy thử chỉnh sửa `<Profile />` thành `<Gallery />` rồi đổi lại trong ví dụ này:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
export function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Bây giờ bạn đang sử dụng kết hợp default và named export:

* `Gallery.js`:
  - Export component `Profile` dưới dạng **named export có tên `Profile`.**
  - Export component `Gallery` dưới dạng **default export.**
* `App.js`:
  - Import `Profile` dưới dạng **named import có tên `Profile`** từ `Gallery.js`.
  - Import `Gallery` dưới dạng **default import** từ `Gallery.js`.
  - Export component gốc `App` dưới dạng **default export.**

<Recap>

Trong trang này, bạn đã học:

* Tệp component gốc là gì
* Cách import và export một component
* Khi nào và cách sử dụng default và named import, export
* Cách export nhiều component từ cùng một tệp

</Recap>



<Challenges>

#### Tách component thêm nữa {/*split-the-components-further*/}

Hiện tại, `Gallery.js` export cả `Profile` và `Gallery`, điều này hơi gây nhầm lẫn.

Hãy chuyển component `Profile` vào `Profile.js` riêng, sau đó thay đổi component `App` để render cả `<Profile />` và `<Gallery />` lần lượt.

Bạn có thể sử dụng default export hoặc named export cho `Profile`, nhưng hãy đảm bảo sử dụng cú pháp import tương ứng trong cả `App.js` và `Gallery.js`! Bạn có thể tham khảo bảng trong phần tìm hiểu chuyên sâu ở trên:

| Cú pháp           | Câu lệnh export                           | Câu lệnh import                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

Đừng quên import các component tại nơi chúng được gọi. Chẳng phải `Gallery` cũng sử dụng `Profile` sao?

</Hint>

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js src/Gallery.js active
// Move me to Profile.js!
export function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Sau khi làm cho code hoạt động với một loại export, hãy làm cho nó hoạt động với loại còn lại.

<Solution>

Đây là lời giải sử dụng named export:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Đây là lời giải sử dụng default export:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>