<Intro>

Trong bản build production đã được minify của React, chúng tôi tránh gửi toàn bộ thông báo lỗi để giảm số byte được truyền qua mạng.

</Intro>


Chúng tôi đặc biệt khuyến nghị sử dụng bản build development cục bộ khi debug ứng dụng, vì bản build này theo dõi thêm thông tin debug và cung cấp các cảnh báo hữu ích về những vấn đề tiềm ẩn trong ứng dụng của bạn. Tuy nhiên, nếu bạn gặp exception khi sử dụng bản build production, thông báo lỗi sẽ chỉ bao gồm một liên kết đến tài liệu về lỗi đó.

Ví dụ: [https://react.dev/errors/149](/errors/149).