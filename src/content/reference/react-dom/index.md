---
title: Các API React DOM
---

<Intro>

Gói `react-dom` chứa các phương thức chỉ được hỗ trợ cho các ứng dụng web (chạy trong môi trường DOM của trình duyệt). Các phương thức này không được hỗ trợ cho React Native.

</Intro>

---

## Các API {/*apis*/}

Bạn có thể import các API này từ các component của mình. Chúng hiếm khi được sử dụng:

* [`createPortal`](/reference/react-dom/createPortal) cho phép bạn render các component con vào một phần khác của cây DOM.
* [`flushSync`](/reference/react-dom/flushSync) cho phép bạn buộc React áp dụng một state update và cập nhật DOM một cách đồng bộ.

## Các API Preloading tài nguyên {/*resource-preloading-apis*/}

Bạn có thể sử dụng các API này để làm cho ứng dụng nhanh hơn bằng cách pre-load các tài nguyên như script, stylesheet và font ngay khi biết mình cần chúng, chẳng hạn trước khi chuyển đến một trang khác, nơi các tài nguyên đó sẽ được sử dụng.

[Các framework dựa trên React](/learn/creating-a-react-app) thường xử lý việc tải tài nguyên cho bạn, vì vậy có thể bạn không cần tự gọi các API này. Hãy tham khảo tài liệu của framework để biết chi tiết.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) cho phép bạn prefetch địa chỉ IP của một tên miền DNS mà bạn dự kiến sẽ kết nối đến.
* [`preconnect`](/reference/react-dom/preconnect) cho phép bạn kết nối đến một server mà bạn dự kiến sẽ request tài nguyên từ đó, ngay cả khi chưa biết mình sẽ cần những tài nguyên nào.
* [`preload`](/reference/react-dom/preload) cho phép bạn fetch một stylesheet, font, image hoặc script bên ngoài mà bạn dự kiến sẽ sử dụng.
* [`preloadModule`](/reference/react-dom/preloadModule) cho phép bạn fetch một module ESM mà bạn dự kiến sẽ sử dụng.
* [`preinit`](/reference/react-dom/preinit) cho phép bạn fetch và evaluate một script bên ngoài hoặc fetch và chèn một stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) cho phép bạn fetch và evaluate một module ESM.

## Các API Server Rendering {/*server-rendering-apis*/}

API này kiểm soát cách các component được render trên server:

* [`browser`](/reference/react-dom/browser) cho phép bạn đánh dấu một component là chỉ dành cho trình duyệt trong quá trình server rendering.

---

## Entry points {/*entry-points*/}

Gói `react-dom` cung cấp thêm hai entry point:

* [`react-dom/client`](/reference/react-dom/client) chứa các API để render các component React ở phía client (trong trình duyệt).
* [`react-dom/server`](/reference/react-dom/server) chứa các API để render các component React ở phía server.

---

## Các API đã bị xóa {/*removed-apis*/}

Các API này đã bị xóa trong React 19:

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): xem [các lựa chọn thay thế](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): thay vào đó, hãy sử dụng [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](https://18.react.dev/reference/react-dom/render): thay vào đó, hãy sử dụng [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): thay vào đó, hãy sử dụng [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): thay vào đó, hãy sử dụng các API [`react-dom/server`](/reference/react-dom/server).
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): thay vào đó, hãy sử dụng các API [`react-dom/server`](/reference/react-dom/server).