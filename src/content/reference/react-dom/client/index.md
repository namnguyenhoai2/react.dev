---
title: Các API DOM phía client của React
---

<Intro>

Các API `react-dom/client` cho phép bạn render các component React ở phía client (trong trình duyệt). Các API này thường được sử dụng ở cấp cao nhất của ứng dụng để khởi tạo cây React. Một [framework](/learn/creating-a-react-app#full-stack-frameworks) có thể gọi chúng thay bạn. Hầu hết component của bạn không cần import hoặc sử dụng chúng.

</Intro>

---

## Các API phía client {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) cho phép bạn tạo một root để hiển thị các component React bên trong một node DOM của trình duyệt.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) cho phép bạn hiển thị các component React bên trong một node DOM của trình duyệt có nội dung HTML trước đó đã được tạo bởi [`react-dom/server`.](/reference/react-dom/server)

---

## Hỗ trợ trình duyệt {/*browser-support*/}

React hỗ trợ tất cả các trình duyệt phổ biến, bao gồm Internet Explorer 9 trở lên. Cần có một số polyfill cho các trình duyệt cũ hơn như IE 9 và IE 10.