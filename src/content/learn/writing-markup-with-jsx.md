---
title: Viết Markup bằng JSX
---

<Intro>

*JSX* là một phần mở rộng cú pháp của JavaScript, cho phép bạn viết markup giống HTML bên trong một tệp JavaScript. Mặc dù có những cách khác để viết component, hầu hết nhà phát triển React đều thích sự súc tích của JSX, và phần lớn codebase đều sử dụng nó.

</Intro>

<YouWillLearn>

* Vì sao React kết hợp markup với logic rendering
* JSX khác HTML như thế nào
* Cách hiển thị thông tin bằng JSX

</YouWillLearn>

## JSX: Đưa markup vào JavaScript {/*jsx-putting-markup-into-javascript*/}

Web được xây dựng dựa trên HTML, CSS và JavaScript. Trong nhiều năm, các nhà phát triển web giữ content trong HTML, phần thiết kế trong CSS và logic trong JavaScript—thường là ở các tệp riêng biệt! Content được đánh dấu trong HTML, còn logic của trang nằm riêng trong JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML markup with purple background and a div with two child tags: p and form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Three JavaScript handlers with yellow background: onSubmit, onLogin, and onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Nhưng khi Web trở nên tương tác hơn, logic ngày càng quyết định content. JavaScript chịu trách nhiệm điều khiển HTML! Đây là lý do **trong React, logic rendering và markup nằm cùng một nơi—các component.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Sidebar which calls the function isLoggedIn, highlighted in yellow. Nested inside the function highlighted in purple is the p tag from before, and a Form tag referencing the component shown in the next diagram.">

`Sidebar.js` React component

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Form containing two handlers onClick and onSubmit highlighted in yellow. Following the handlers is HTML highlighted in purple. The HTML contains a form element with a nested input element, each with an onClick prop.">

`Form.js` React component

</Diagram>

</DiagramGroup>

Việc giữ logic rendering và markup của một button cùng nhau đảm bảo chúng luôn đồng bộ trong mỗi lần chỉnh sửa. Ngược lại, những chi tiết không liên quan, chẳng hạn như markup của button và markup của sidebar, được tách biệt với nhau, nhờ đó việc thay đổi từng phần độc lập sẽ an toàn hơn.

Mỗi React component là một hàm JavaScript có thể chứa một phần markup để React render vào trình duyệt. React component sử dụng một phần mở rộng cú pháp có tên JSX để biểu diễn markup đó. JSX trông rất giống HTML, nhưng nghiêm ngặt hơn một chút và có thể hiển thị thông tin động. Cách tốt nhất để hiểu điều này là chuyển một phần markup HTML sang markup JSX.

<Note>

JSX và React là hai thứ riêng biệt. Chúng thường được sử dụng cùng nhau, nhưng bạn *có thể* [sử dụng chúng độc lập](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) với nhau. JSX là một phần mở rộng cú pháp, còn React là một thư viện JavaScript.

</Note>

## Chuyển HTML sang JSX {/*converting-html-to-jsx*/}

Giả sử bạn có một đoạn HTML (hoàn toàn hợp lệ):

```html
<h1>Hedy Lamarr's Todos</h1>
<img
  src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

Và bạn muốn đưa nó vào component của mình:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Nếu bạn sao chép và dán nguyên trạng, đoạn mã sẽ không hoạt động:


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

Đó là vì JSX nghiêm ngặt hơn và có thêm một số quy tắc so với HTML! Nếu đọc các thông báo lỗi ở trên, bạn sẽ được hướng dẫn cách sửa markup, hoặc có thể làm theo hướng dẫn bên dưới.

<Note>

Trong hầu hết trường hợp, các thông báo lỗi trên màn hình của React sẽ giúp bạn tìm ra vị trí có vấn đề. Nếu gặp khó khăn, hãy đọc kỹ các thông báo đó!

</Note>

## Các quy tắc của JSX {/*the-rules-of-jsx*/}

### 1. Trả về một phần tử gốc duy nhất {/*1-return-a-single-root-element*/}

Để trả về nhiều phần tử từ một component, **hãy bọc chúng bằng một thẻ cha duy nhất.**

Ví dụ, bạn có thể sử dụng một `<div>`:

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


Nếu không muốn thêm một `<div>` vào markup, bạn có thể viết `<>` và `</>` thay thế:

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Thẻ rỗng này được gọi là *[Fragment.](/reference/react/Fragment)* Fragment cho phép bạn nhóm các thành phần mà không để lại dấu vết nào trong cây HTML của trình duyệt.

<DeepDive>

#### Vì sao nhiều thẻ JSX cần được bọc? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX trông giống HTML, nhưng bên dưới nó được chuyển đổi thành các object JavaScript thuần. Bạn không thể trả về hai object từ một hàm nếu không bọc chúng trong một array. Điều này giải thích vì sao bạn cũng không thể trả về hai thẻ JSX nếu không bọc chúng trong một thẻ khác hoặc một Fragment.

</DeepDive>

### 2. Đóng tất cả các thẻ {/*2-close-all-the-tags*/}

JSX yêu cầu các thẻ phải được đóng một cách tường minh: các thẻ tự đóng như `<img>` phải trở thành `<img />`, còn các thẻ bọc như `<li>oranges` phải được viết thành `<li>oranges</li>`.

Đây là cách ảnh và các mục danh sách của Hedy Lamarr trông như sau khi được đóng:

```js {2-6,8-10}
<>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. camelCase <s>tất cả</s> mọi thứ! {/*3-camelcase-salls-most-of-the-things*/}

JSX được chuyển thành JavaScript, và các attribute được viết trong JSX sẽ trở thành các key của object JavaScript. Trong component của riêng mình, bạn thường muốn đọc các attribute đó vào các biến. Tuy nhiên, JavaScript có những hạn chế đối với tên biến. Ví dụ, tên biến không được chứa dấu gạch ngang hoặc là các từ dành riêng như `class`.

Đó là lý do trong React, nhiều attribute HTML và SVG được viết theo kiểu camelCase. Ví dụ, thay vì `stroke-width`, bạn sử dụng `strokeWidth`. Vì `class` là một từ dành riêng, trong React bạn viết `className` thay thế, được đặt tên theo [DOM property tương ứng](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img
  src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  className="photo"
/>
```

Bạn có thể [tìm tất cả các attribute này trong danh sách DOM component props.](/reference/react-dom/components/common) Nếu viết sai một attribute, đừng lo—React sẽ in một thông báo kèm đề xuất sửa trong [browser console.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

Vì lý do lịch sử, các attribute [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) và [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) được viết giống như trong HTML, với dấu gạch ngang.

</Pitfall>

### Mẹo chuyên nghiệp: Sử dụng JSX Converter {/*pro-tip-use-a-jsx-converter*/}

Việc chuyển đổi tất cả các attribute này trong markup hiện có có thể khá tốn công! Chúng tôi khuyên bạn nên sử dụng một [converter](https://transform.tools/html-to-jsx) để chuyển HTML và SVG hiện có sang JSX. Converter rất hữu ích trong thực tế, nhưng bạn vẫn nên hiểu điều gì đang diễn ra để có thể tự tin viết JSX.

Đây là kết quả cuối cùng:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

Bây giờ bạn đã biết vì sao JSX tồn tại và cách sử dụng nó trong component:

* React component nhóm logic rendering cùng với markup vì chúng có liên quan với nhau.
* JSX tương tự HTML, nhưng có một vài điểm khác biệt. Bạn có thể sử dụng [converter](https://transform.tools/html-to-jsx) nếu cần.
* Các thông báo lỗi thường chỉ cho bạn hướng xử lý đúng để sửa markup.

</Recap>



<Challenges>

#### Chuyển một phần HTML sang JSX {/*convert-some-html-to-jsx*/}

Đoạn HTML này được dán vào một component, nhưng không phải là JSX hợp lệ. Hãy sửa nó:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Bạn có thể tự sửa hoặc sử dụng converter, tùy bạn lựa chọn!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>