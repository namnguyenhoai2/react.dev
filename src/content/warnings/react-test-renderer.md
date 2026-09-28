---
title: Cảnh báo ngừng hỗ trợ react-test-renderer
---

## Cảnh báo ReactTestRenderer.create() {/*reacttestrenderercreate-warning*/}

react-test-renderer đã ngừng hỗ trợ. Cảnh báo sẽ xuất hiện mỗi khi gọi ReactTestRenderer.create() hoặc ReactShallowRender.render(). Gói react-test-renderer vẫn sẽ có sẵn trên NPM nhưng sẽ không được bảo trì và có thể bị lỗi khi có các tính năng React mới hoặc thay đổi trong nội bộ React.

React Team khuyến nghị bạn chuyển các bài kiểm thử của mình sang [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) hoặc [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro) để có trải nghiệm kiểm thử hiện đại và được hỗ trợ tốt.


## Cảnh báo new ShallowRenderer() {/*new-shallowrenderer-warning*/}

Gói react-test-renderer không còn export shallow renderer tại `react-test-renderer/shallow`. Đây chỉ đơn giản là phiên bản đóng gói lại của một package riêng đã được tách ra trước đó: `react-shallow-renderer`. Vì vậy, bạn vẫn có thể sử dụng shallow renderer theo cách tương tự bằng cách cài đặt package đó trực tiếp. Xem [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).