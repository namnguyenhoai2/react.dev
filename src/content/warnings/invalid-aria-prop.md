---
title: Cảnh báo về Prop ARIA không hợp lệ
---

Cảnh báo này sẽ xuất hiện nếu bạn cố gắng render một phần tử DOM với prop `aria-*` không tồn tại trong [đặc tả]( https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)Accessible Rich Internet Application (ARIA) của Web Accessibility Initiative (WAI).

1. Nếu bạn cho rằng mình đang sử dụng một prop hợp lệ, hãy kiểm tra kỹ chính tả. `aria-labelledby` và `aria-activedescendant` thường bị viết sai.

2. Nếu bạn đã viết `aria-role`, có thể bạn muốn viết `role`.

3. Nếu không, trong trường hợp bạn đang sử dụng phiên bản React DOM mới nhất và đã xác minh rằng mình đang dùng một tên thuộc tính hợp lệ được liệt kê trong đặc tả ARIA, vui lòng [báo cáo lỗi](https://github.com/react/react/issues/new/choose).