---
title: Các API DOM tĩnh của React
---

<Intro>

Các API `react-dom/static` cho phép bạn tạo HTML tĩnh cho các component React. So với các API streaming, chúng có chức năng hạn chế hơn. [Framework](/learn/creating-a-react-app#full-stack-frameworks) có thể gọi chúng thay bạn. Hầu hết component của bạn không cần import hoặc sử dụng chúng.

</Intro>

---

## Các API tĩnh cho Web Streams {/*static-apis-for-web-streams*/}

Các phương thức này chỉ khả dụng trong những môi trường có [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), bao gồm trình duyệt, Deno và một số edge runtime hiện đại:

* [`prerender`](/reference/react-dom/static/prerender) render một cây React thành HTML tĩnh bằng [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) tiếp tục một cây React đã được prerender thành HTML tĩnh bằng [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

Node.js cũng có các phương thức này để đảm bảo khả năng tương thích, nhưng không được khuyến nghị vì hiệu năng kém hơn. Thay vào đó, hãy sử dụng [các API Node.js chuyên dụng](#static-apis-for-nodejs-streams).

---

## Các API tĩnh cho Node.js Streams {/*static-apis-for-nodejs-streams*/}

Các phương thức này chỉ khả dụng trong những môi trường có [Node.js Streams](https://nodejs.org/api/stream.html):

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) render một cây React thành HTML tĩnh bằng [Node.js Stream.](https://nodejs.org/api/stream.html)
* [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) tiếp tục một cây React đã được prerender thành HTML tĩnh bằng [Node.js Stream.](https://nodejs.org/api/stream.html)