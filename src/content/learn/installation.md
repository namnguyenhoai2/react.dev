---
title: Cài đặt
---

<Intro>

Ngay từ đầu, React đã được thiết kế để có thể áp dụng dần dần. Bạn có thể sử dụng React ít hay nhiều tùy theo nhu cầu. Dù bạn muốn làm quen với React, thêm một chút tương tác vào một trang HTML hay bắt đầu xây dựng một ứng dụng phức tạp được hỗ trợ bởi React, phần này sẽ giúp bạn bắt đầu.

</Intro>

## Dùng thử React {/*try-react*/}

Bạn không cần cài đặt gì để thử dùng React. Hãy thử chỉnh sửa sandbox này!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

Bạn có thể chỉnh sửa trực tiếp hoặc mở sandbox này trong tab mới bằng cách nhấn nút "Fork" ở góc trên bên phải.

Hầu hết các trang trong tài liệu React đều có những sandbox như thế này. Ngoài tài liệu React, có rất nhiều sandbox trực tuyến hỗ trợ React: chẳng hạn như [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), hoặc [CodePen.](https://codepen.io/pen?template=QWYVwWN)

Để thử React cục bộ trên máy tính, [hãy tải xuống trang HTML này.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Mở trang đó trong editor và trình duyệt của bạn!

## Tạo ứng dụng React {/*creating-a-react-app*/}

Nếu muốn bắt đầu một ứng dụng React mới, bạn có thể [tạo một ứng dụng React](/learn/creating-a-react-app) bằng một framework được khuyến nghị.

## Xây dựng ứng dụng React từ đầu {/*build-a-react-app-from-scratch*/}

Nếu framework không phù hợp với dự án của bạn, bạn muốn tự xây dựng framework riêng hoặc chỉ muốn tìm hiểu những kiến thức cơ bản về một ứng dụng React, bạn có thể [xây dựng một ứng dụng React từ đầu](/learn/build-a-react-app-from-scratch).

## Thêm React vào dự án hiện có {/*add-react-to-an-existing-project*/}

Nếu bạn muốn thử sử dụng React trong ứng dụng hoặc website hiện có, bạn có thể [thêm React vào một dự án hiện có.](/learn/add-react-to-an-existing-project)


<Note>

#### Tôi có nên sử dụng Create React App không? {/*should-i-use-create-react-app*/}

Không. Create React App đã bị ngừng phát triển. Để biết thêm thông tin, hãy xem [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>

## Các bước tiếp theo {/*next-steps*/}

Hãy xem hướng dẫn [Quick Start](/learn) để tìm hiểu các khái niệm React quan trọng nhất mà bạn sẽ gặp hằng ngày.