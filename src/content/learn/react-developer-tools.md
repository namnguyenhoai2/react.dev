---
title: React Developer Tools
---

<Intro>

Sử dụng React Developer Tools để kiểm tra các [components](/learn/your-first-component) của React, chỉnh sửa [props](/learn/passing-props-to-a-component) và [state](/learn/state-a-components-memory), đồng thời xác định các vấn đề về hiệu suất.

</Intro>

<YouWillLearn>

* Cách cài đặt React Developer Tools

</YouWillLearn>

## Tiện ích trình duyệt {/*browser-extension*/}

Cách dễ nhất để debug các website được xây dựng bằng React là cài đặt tiện ích trình duyệt React Developer Tools. Tiện ích này có sẵn cho một số trình duyệt phổ biến:

* [Cài đặt cho **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Cài đặt cho **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Cài đặt cho **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Bây giờ, nếu bạn truy cập một website **được xây dựng bằng React,** bạn sẽ thấy các panel _Components_ và _Profiler_.

![Tiện ích React Developer Tools](/images/docs/react-devtools-extension.png)

### Safari và các trình duyệt khác {/*safari-and-other-browsers*/}
Đối với các trình duyệt khác (ví dụ: Safari), hãy cài đặt package [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Tiếp theo, mở developer tools từ terminal:
```bash
react-devtools
```

Sau đó, kết nối website của bạn bằng cách thêm thẻ `<script>` sau vào đầu `<head>` của website:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Bây giờ hãy tải lại website trong trình duyệt để xem website trong developer tools.

![React Developer Tools độc lập](/images/docs/react-devtools-standalone.png)

## Thiết bị di động (React Native) {/*mobile-react-native*/}

Để kiểm tra các ứng dụng được xây dựng bằng [React Native](https://reactnative.dev/), bạn có thể sử dụng [React Native DevTools](https://reactnative.dev/docs/react-native-devtools), trình debugger tích hợp sẵn và tích hợp sâu với React Developer Tools. Tất cả tính năng đều hoạt động giống hệt tiện ích trình duyệt, bao gồm cả việc làm nổi bật và chọn các phần tử native.

[Tìm hiểu thêm về việc debug trong React Native.](https://reactnative.dev/docs/debugging)

> Đối với các phiên bản React Native cũ hơn 0.76, vui lòng sử dụng bản build độc lập của React DevTools bằng cách làm theo hướng dẫn [Safari và các trình duyệt khác](#safari-and-other-browsers) ở trên.