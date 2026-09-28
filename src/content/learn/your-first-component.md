---
title: Component đầu tiên của bạn
---

<Intro>

*Component* là một trong những khái niệm cốt lõi của React. Chúng là nền tảng để bạn xây dựng giao diện người dùng (UI), nên đây là nơi tuyệt vời để bắt đầu hành trình học React của bạn!

</Intro>

<YouWillLearn>

* Component là gì
* Component đóng vai trò gì trong một ứng dụng React
* Cách viết component React đầu tiên của bạn

</YouWillLearn>

## Component: các khối xây dựng UI {/*components-ui-building-blocks*/}

Trên Web, HTML cho phép chúng ta tạo các tài liệu có cấu trúc phong phú bằng tập hợp các thẻ tích hợp sẵn như `<h1>` và `<li>`:

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

Đoạn markup này biểu diễn bài viết `<article>`, tiêu đề của bài viết `<h1>`, và mục lục (được rút gọn) dưới dạng danh sách có thứ tự `<ol>`. Markup như vậy, kết hợp với CSS để tạo kiểu và JavaScript để thêm tính tương tác, nằm phía sau mọi thanh bên, avatar, modal, dropdown—mọi phần UI mà bạn thấy trên Web.

React cho phép bạn kết hợp markup, CSS và JavaScript thành các "component" tùy chỉnh, **những phần tử UI có thể tái sử dụng cho ứng dụng của bạn.** Đoạn code mục lục mà bạn thấy ở trên có thể được chuyển thành một component `<TableOfContents />` để bạn render trên mọi trang. Bên dưới, nó vẫn sử dụng các thẻ HTML giống như `<article>`, `<h1>`, v.v.

Cũng giống như các thẻ HTML, bạn có thể kết hợp, sắp xếp và lồng các component để thiết kế toàn bộ trang. Ví dụ, trang tài liệu bạn đang đọc được tạo thành từ các component React:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Khi dự án phát triển, bạn sẽ nhận thấy rằng nhiều thiết kế có thể được tạo thành bằng cách tái sử dụng các component mà bạn đã viết, giúp đẩy nhanh quá trình phát triển. Mục lục ở trên có thể được thêm vào bất kỳ màn hình nào bằng `<TableOfContents />`! Bạn thậm chí có thể bắt đầu nhanh dự án của mình với hàng nghìn component được cộng đồng mã nguồn mở React chia sẻ, chẳng hạn như [Chakra UI](https://chakra-ui.com/) và [Material UI.](https://material-ui.com/)

## Định nghĩa một component {/*defining-a-component*/}

Theo cách truyền thống khi tạo trang web, các web developer đánh dấu nội dung của họ rồi thêm tính tương tác bằng cách rải một ít JavaScript vào. Cách này hoạt động rất tốt khi tính tương tác chỉ là một tính năng bổ sung hữu ích trên web. Ngày nay, tính tương tác được kỳ vọng ở nhiều website và mọi ứng dụng. React đặt tính tương tác lên hàng đầu nhưng vẫn sử dụng cùng công nghệ: **một component React là một hàm JavaScript mà bạn có thể _rắc thêm markup_.** Đây là cách nó trông như thế nào (bạn có thể chỉnh sửa ví dụ bên dưới):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Và đây là cách xây dựng một component:

### Bước 1: Export component {/*step-1-export-the-component*/}

Tiền tố `export default` là [cú pháp JavaScript tiêu chuẩn](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (không dành riêng cho React). Nó cho phép bạn đánh dấu hàm chính trong một file để sau đó có thể import hàm đó từ các file khác. (Tìm hiểu thêm về việc import trong [Import và Export Component](/learn/importing-and-exporting-components)!)

### Bước 2: Định nghĩa hàm {/*step-2-define-the-function*/}

Với `function Profile() { }`, bạn định nghĩa một hàm JavaScript có tên `Profile`.

<Pitfall>

Component React là các hàm JavaScript thông thường, nhưng **tên của chúng phải bắt đầu bằng một chữ cái viết hoa**, nếu không chúng sẽ không hoạt động!

</Pitfall>

### Bước 3: Thêm markup {/*step-3-add-markup*/}

Component trả về một thẻ `<img />` với các thuộc tính `src` và `alt`. `<img />` được viết giống HTML, nhưng thực chất bên dưới là JavaScript! Cú pháp này được gọi là [JSX](/learn/writing-markup-with-jsx), và cho phép bạn nhúng markup vào JavaScript.

Các câu lệnh return có thể được viết trên cùng một dòng, như trong component này:

```js
return <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

Nhưng nếu markup của bạn không nằm trên cùng dòng với từ khóa `return`, bạn phải đặt nó trong một cặp dấu ngoặc đơn:

```js
return (
  <div>
    <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

Nếu không có dấu ngoặc đơn, mọi code trên các dòng sau `return` [sẽ bị bỏ qua](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Sử dụng một component {/*using-a-component*/}

Bây giờ bạn đã định nghĩa component `Profile`, bạn có thể lồng nó bên trong các component khác. Ví dụ, bạn có thể export một component `Gallery` sử dụng nhiều component `Profile`:

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

### Trình duyệt nhìn thấy gì {/*what-the-browser-sees*/}

Hãy chú ý đến sự khác nhau về cách viết hoa:

* `<section>` được viết thường, nên React biết rằng chúng ta đang nói đến một thẻ HTML.
* `<Profile />` bắt đầu bằng chữ cái viết hoa `P`, nên React biết rằng chúng ta muốn sử dụng component có tên `Profile`.

Và `Profile` còn chứa nhiều HTML hơn: `<img />`. Cuối cùng, đây là những gì trình duyệt nhìn thấy:

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Lồng và tổ chức các component {/*nesting-and-organizing-components*/}

Component là các hàm JavaScript thông thường, vì vậy bạn có thể giữ nhiều component trong cùng một file. Điều này thuận tiện khi các component tương đối nhỏ hoặc có mối liên hệ chặt chẽ với nhau. Nếu file trở nên quá chật chội, bạn luôn có thể chuyển `Profile` sang một file riêng. Bạn sẽ sớm học cách thực hiện việc này trong [trang nói về import.](/learn/importing-and-exporting-components)

Vì các component `Profile` được render bên trong `Gallery`—thậm chí nhiều lần!—chúng ta có thể nói rằng `Gallery` là một **component cha,** render mỗi `Profile` như một "component con". Đây là một phần sức mạnh kỳ diệu của React: bạn có thể định nghĩa một component một lần, sau đó sử dụng nó ở bao nhiêu nơi và bao nhiêu lần tùy thích.

<Pitfall>

Component có thể render các component khác, nhưng **bạn không bao giờ được lồng các định nghĩa của chúng:**

```js {2-5}
export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```

Đoạn code trên [rất chậm và gây ra lỗi.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Thay vào đó, hãy định nghĩa mọi component ở cấp cao nhất:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```

Khi một component con cần một số dữ liệu từ component cha, hãy [truyền dữ liệu đó qua props](/learn/passing-props-to-a-component) thay vì lồng các định nghĩa.

</Pitfall>

<DeepDive>

#### Component ở mọi cấp {/*components-all-the-way-down*/}

Ứng dụng React của bạn bắt đầu từ một component "root". Thông thường, component này được tự động tạo khi bạn bắt đầu một dự án mới. Ví dụ, nếu bạn sử dụng [CodeSandbox](https://codesandbox.io/) hoặc framework [Next.js](https://nextjs.org/), component root được định nghĩa trong `pages/index.js`. Trong các ví dụ này, bạn đã export các component root.

Hầu hết ứng dụng React sử dụng component ở mọi cấp. Điều này có nghĩa là bạn không chỉ sử dụng component cho các phần có thể tái sử dụng như button, mà còn cho các phần lớn hơn như thanh bên, danh sách và cuối cùng là toàn bộ trang! Component là một cách thuận tiện để tổ chức code và markup của UI, ngay cả khi một số component chỉ được sử dụng một lần.

[Các framework dựa trên React](/learn/creating-a-react-app) tiến thêm một bước. Thay vì sử dụng một file HTML trống và để React "tiếp quản" việc quản lý trang bằng JavaScript, chúng *cũng tự động tạo HTML từ các component React của bạn.* Điều này cho phép ứng dụng hiển thị một phần nội dung trước khi code JavaScript được tải.

Tuy vậy, nhiều website chỉ sử dụng React để [thêm tính tương tác vào các trang HTML hiện có.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) Chúng có nhiều component root thay vì chỉ một component cho toàn bộ trang. Bạn có thể sử dụng React nhiều hoặc ít tùy theo nhu cầu.

</DeepDive>

<Recap>

Bạn vừa làm quen với React! Hãy cùng ôn lại một số điểm chính.

* React cho phép bạn tạo các component, **những phần tử UI có thể tái sử dụng cho ứng dụng của bạn.**
* Trong một ứng dụng React, mọi phần UI đều là một component.
* Component React là các hàm JavaScript thông thường, ngoại trừ:

  1. Tên của chúng luôn bắt đầu bằng một chữ cái viết hoa.
  2. Chúng trả về markup JSX.

</Recap>



<Challenges>

#### Export component {/*export-the-component*/}

Sandbox này không hoạt động vì component root chưa được export:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Hãy thử tự sửa trước khi xem lời giải!

<Solution>

Thêm `export default` trước phần định nghĩa hàm như sau:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Có thể bạn đang thắc mắc tại sao chỉ viết `export` vẫn chưa đủ để sửa ví dụ này. Bạn có thể tìm hiểu sự khác nhau giữa `export` và `export default` trong [Import và Export Component.](/learn/importing-and-exporting-components)

</Solution>

#### Sửa câu lệnh return {/*fix-the-return-statement*/}

Có điều gì đó không đúng với câu lệnh `return` này. Bạn có thể sửa nó không?

<Hint>

Bạn có thể gặp lỗi "Unexpected token" khi cố gắng sửa lỗi này. Trong trường hợp đó, hãy kiểm tra để bảo đảm dấu chấm phẩy xuất hiện *sau* dấu ngoặc đơn đóng. Để dấu chấm phẩy bên trong `return ( )` sẽ gây ra lỗi.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Bạn có thể sửa component này bằng cách chuyển câu lệnh return lên cùng một dòng như sau:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Hoặc bằng cách đặt phần đánh dấu JSX được return trong cặp dấu ngoặc đơn, mở ngay sau `return`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg"
      alt="Katsuko Saruhashi"
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Tìm lỗi {/*spot-the-mistake*/}

Có điều gì đó không đúng trong cách component `Profile` được khai báo và sử dụng. Bạn có nhận ra lỗi không? (Hãy thử nhớ lại cách React phân biệt component với các thẻ HTML thông thường!)

<Sandpack>

```js
function profile() {
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
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

Tên component React phải bắt đầu bằng chữ cái viết hoa.

Hãy đổi `function profile()` thành `function Profile()`, sau đó đổi mọi `<profile />` thành `<Profile />`:

<Sandpack>

```js
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
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### Component của riêng bạn {/*your-own-component*/}

Hãy tự viết một component từ đầu. Bạn có thể đặt cho nó bất kỳ tên hợp lệ nào và return bất kỳ phần đánh dấu nào. Nếu chưa có ý tưởng, bạn có thể viết một component `Congratulations` hiển thị `<h1>Good job!</h1>`. Đừng quên export component đó!

<Sandpack>

```js
// Write your component below!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>