---
title: Thêm React vào một dự án hiện có
---

<Intro>

Nếu bạn muốn thêm một chút tính tương tác vào dự án hiện có, bạn không cần viết lại dự án đó bằng React. Hãy thêm React vào stack hiện tại và render các React component có tính tương tác ở bất kỳ đâu.

</Intro>

<Note>

**Bạn cần cài đặt [Node.js](https://nodejs.org/en/) để phát triển cục bộ.** Mặc dù bạn có thể [thử React](/learn/installation#try-react) trực tuyến hoặc với một trang HTML đơn giản, nhưng trên thực tế, hầu hết các công cụ JavaScript mà bạn muốn sử dụng để phát triển đều yêu cầu Node.js.

</Note>

## Sử dụng React cho toàn bộ một subroute của website hiện có {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Giả sử bạn có một web app hiện có tại `example.com`, được xây dựng bằng một công nghệ server khác (chẳng hạn như Rails), và bạn muốn triển khai đầy đủ bằng React tất cả các route bắt đầu bằng `example.com/some-app/`.

Sau đây là cách chúng tôi khuyến nghị thiết lập:

1. **Xây dựng phần React của app** bằng một trong các [framework dựa trên React](/learn/creating-a-react-app).
2. **Chỉ định `/some-app` làm *base path*** trong cấu hình của framework (xem cách thực hiện với: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Cấu hình server hoặc proxy** để tất cả request bên dưới `/some-app/` được xử lý bởi React app của bạn.

Điều này đảm bảo phần React của app có thể [hưởng lợi từ các best practice](/learn/build-a-react-app-from-scratch#consider-using-a-framework) được tích hợp sẵn trong các framework đó.

Nhiều framework dựa trên React là full-stack và cho phép React app của bạn tận dụng server. Tuy nhiên, bạn vẫn có thể sử dụng cách tiếp cận tương tự ngay cả khi không thể hoặc không muốn chạy JavaScript trên server. Trong trường hợp đó, hãy phục vụ bản export HTML/CSS/JS ([`next export` output](https://nextjs.org/docs/advanced-features/static-html-export) đối với Next.js, mặc định đối với Gatsby) tại `/some-app/`.

## Sử dụng React cho một phần của trang hiện có {/*using-react-for-a-part-of-your-existing-page*/}

Giả sử bạn có một trang hiện có được xây dựng bằng một công nghệ khác (server technology như Rails hoặc client technology như Backbone), và bạn muốn render các React component có tính tương tác ở đâu đó trên trang. Đây là một cách phổ biến để tích hợp React—trên thực tế, trong nhiều năm, phần lớn cách Meta sử dụng React cũng như vậy!

Bạn có thể thực hiện việc này qua hai bước:

1. **Thiết lập một môi trường JavaScript** cho phép bạn sử dụng [cú pháp JSX](/learn/writing-markup-with-jsx), chia code thành các module bằng cú pháp [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export), và sử dụng các package (ví dụ: React) từ registry package [npm](https://www.npmjs.com/).
2. **Render các React component** tại vị trí bạn muốn chúng xuất hiện trên trang.

Cách tiếp cận chính xác phụ thuộc vào thiết lập của trang hiện có, vì vậy hãy cùng xem qua một số chi tiết.

### Bước 1: Thiết lập môi trường JavaScript dạng module {/*step-1-set-up-a-modular-javascript-environment*/}

Môi trường JavaScript dạng module cho phép bạn viết các React component trong những file riêng lẻ, thay vì viết toàn bộ code trong một file duy nhất. Môi trường này cũng cho phép bạn sử dụng tất cả các package hữu ích do những developer khác publish trên registry [npm](https://www.npmjs.com/)—bao gồm cả chính React! Cách thực hiện phụ thuộc vào thiết lập hiện có của bạn:

* **Nếu app của bạn đã được chia thành các file sử dụng câu lệnh `import`,** hãy thử sử dụng thiết lập hiện có. Kiểm tra xem việc viết `<div />` trong code JS có gây ra lỗi cú pháp hay không. Nếu có, bạn có thể cần [transform code JavaScript bằng Babel](https://babeljs.io/setup) và bật [Babel React preset](https://babeljs.io/docs/babel-preset-react) để sử dụng JSX.

* **Nếu app của bạn chưa có thiết lập để compile các JavaScript module,** hãy thiết lập bằng [Vite](https://vite.dev/). Cộng đồng Vite duy trì [nhiều integration với các backend framework](https://github.com/vitejs/awesome-vite#integrations-with-backends), bao gồm Rails, Django và Laravel. Nếu backend framework của bạn không có trong danh sách, [hãy làm theo hướng dẫn này](https://vite.dev/guide/backend-integration.html) để tích hợp thủ công các bản build Vite với backend.

Để kiểm tra xem thiết lập của bạn có hoạt động hay không, hãy chạy command này trong thư mục dự án:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Sau đó thêm các dòng code sau vào đầu file JavaScript chính (file này có thể có tên là `index.js` hoặc `main.js`):

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Your existing page content (in this example, it gets replaced) -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Nếu toàn bộ nội dung trang được thay thế bằng "Hello, world!", nghĩa là mọi thứ đã hoạt động! Hãy tiếp tục đọc.

<Note>

Việc tích hợp môi trường JavaScript dạng module vào một dự án hiện có lần đầu tiên có thể khiến bạn cảm thấy khó khăn, nhưng rất đáng để thực hiện! Nếu gặp khó khăn, hãy thử [các tài nguyên cộng đồng](/community) hoặc [Vite Chat](https://chat.vite.dev/).

</Note>

### Bước 2: Render React component ở bất kỳ đâu trên trang {/*step-2-render-react-components-anywhere-on-the-page*/}

Ở bước trước, bạn đã đặt đoạn code này ở đầu file chính:

```js
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Tất nhiên, bạn không thực sự muốn xóa nội dung HTML hiện có!

Hãy xóa đoạn code này.

Thay vào đó, có lẽ bạn muốn render các React component tại những vị trí cụ thể trong HTML. Mở trang HTML (hoặc các server template tạo ra trang đó) và thêm một thuộc tính [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) duy nhất vào bất kỳ tag nào, ví dụ:

```html
<!-- ... somewhere in your html ... -->
<nav id="navigation"></nav>
<!-- ... more html ... -->
```

Điều này cho phép bạn tìm phần tử HTML đó bằng [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) và truyền nó vào [`createRoot`](/reference/react-dom/client/createRoot) để render React component của riêng bạn bên trong:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Hãy chú ý rằng nội dung HTML ban đầu từ `index.html` vẫn được giữ nguyên, nhưng `NavigationBar` React component của bạn hiện xuất hiện bên trong `<nav id="navigation">` từ HTML. Đọc [`createRoot` tài liệu về cách sử dụng](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) để tìm hiểu thêm về cách render React component bên trong một trang HTML hiện có.

Khi áp dụng React vào một dự án hiện có, bạn thường bắt đầu với các component có tính tương tác nhỏ (chẳng hạn như button), rồi dần dần “di chuyển lên trên” cho đến khi toàn bộ trang được xây dựng bằng React. Nếu đạt đến giai đoạn đó, chúng tôi khuyến nghị bạn chuyển sang [một React framework](/learn/creating-a-react-app) ngay sau đó để tận dụng React tối đa.

## Sử dụng React Native trong một native mobile app hiện có {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) cũng có thể được tích hợp dần vào các native app hiện có. Nếu bạn có một native app hiện có cho Android (Java hoặc Kotlin) hoặc iOS (Objective-C hoặc Swift), [hãy làm theo hướng dẫn này](https://reactnative.dev/docs/integration-with-existing-apps) để thêm một React Native screen vào app đó.