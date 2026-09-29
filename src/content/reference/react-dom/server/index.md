---
title: API React DOM phía server
---

<Intro>

Các API `react-dom/server` cho phép render các component React ở phía server thành HTML. Các API này chỉ được sử dụng trên server ở cấp cao nhất của app để tạo HTML ban đầu. Một [framework](/learn/creating-a-react-app#full-stack-frameworks) có thể gọi chúng thay bạn. Hầu hết component của bạn không cần import hoặc sử dụng chúng.

</Intro>

---

## API phía server cho Web Streams {/*server-apis-for-web-streams*/}

Các phương thức này chỉ khả dụng trong những môi trường có [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), bao gồm trình duyệt, Deno và một số edge runtime hiện đại:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) render một cây React thành một [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* [`resume`](/reference/react-dom/server/resume) tiếp tục [`prerender`](/reference/react-dom/static/prerender) thành một [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).


<Note>

Node.js cũng cung cấp các phương thức này để đảm bảo khả năng tương thích, nhưng không được khuyến nghị do hiệu suất kém hơn. Thay vào đó, hãy sử dụng [các API Node.js chuyên dụng](#server-apis-for-nodejs-streams).

</Note>
---

## API phía server cho Node.js Streams {/*server-apis-for-nodejs-streams*/}

Các phương thức này chỉ khả dụng trong những môi trường có [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) render một cây React thành một [Node.js Stream.](https://nodejs.org/api/stream.html)
* [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) tiếp tục [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) thành một [Node.js Stream.](https://nodejs.org/api/stream.html)

---

## API phía server cũ cho các môi trường không hỗ trợ streaming {/*legacy-server-apis-for-non-streaming-environments*/}

Các phương thức này có thể được sử dụng trong những môi trường không hỗ trợ stream:

* [`renderToString`](/reference/react-dom/server/renderToString) render một cây React thành một chuỗi.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) render một cây React không tương tác thành một chuỗi.

Chúng có chức năng hạn chế hơn so với các API streaming.