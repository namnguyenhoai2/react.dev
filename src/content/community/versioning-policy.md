---
title: Chính sách đánh phiên bản
---

<Intro>

Tất cả các bản build ổn định của React đều trải qua quá trình kiểm thử ở mức độ cao và tuân theo semantic versioning (semver). React cũng cung cấp các release channel không ổn định để khuyến khích phản hồi sớm về các tính năng thử nghiệm. Trang này mô tả những gì bạn có thể mong đợi từ các bản phát hành React.

</Intro>

Chính sách đánh phiên bản này mô tả cách chúng tôi sử dụng số phiên bản cho các package như `react` và `react-dom`. Để xem danh sách các bản phát hành trước đây, hãy xem trang [Các phiên bản](/versions).

## Các bản phát hành ổn định {/*stable-releases*/}

Các bản phát hành React ổn định (còn được gọi là release channel "Latest") tuân theo các nguyên tắc [semantic versioning (semver)](https://semver.org/).

Điều đó có nghĩa là với một số phiên bản **x.y.z**:

* Khi phát hành **bản sửa lỗi nghiêm trọng**, chúng tôi tạo một **bản patch release** bằng cách thay đổi số **z** (ví dụ: từ 15.6.2 thành 15.6.3).
* Khi phát hành **tính năng mới** hoặc **bản sửa lỗi không nghiêm trọng**, chúng tôi tạo một **minor release** bằng cách thay đổi số **y** (ví dụ: từ 15.6.2 thành 15.7.0).
* Khi phát hành **thay đổi gây breaking**, chúng tôi tạo một **major release** bằng cách thay đổi số **x** (ví dụ: từ 15.6.2 thành 16.0.0).

Các major release cũng có thể bao gồm tính năng mới, và bất kỳ bản phát hành nào cũng có thể bao gồm bản sửa lỗi.

Minor release là loại bản phát hành phổ biến nhất.

Chúng tôi biết người dùng vẫn tiếp tục sử dụng các phiên bản React cũ trong môi trường production. Nếu phát hiện một lỗ hổng bảo mật trong React, chúng tôi sẽ phát hành bản sửa lỗi backport cho tất cả các major version bị ảnh hưởng bởi lỗ hổng đó.

### Các thay đổi gây breaking {/*breaking-changes*/}

Các thay đổi gây breaking gây bất tiện cho tất cả mọi người, vì vậy chúng tôi cố gắng giảm thiểu số lượng major release – chẳng hạn, React 15 được phát hành vào tháng 4 năm 2016, React 16 được phát hành vào tháng 9 năm 2017 và React 17 được phát hành vào tháng 10 năm 2020.

Thay vào đó, chúng tôi phát hành các tính năng mới trong minor version. Điều đó có nghĩa là các minor release thường thú vị và hấp dẫn hơn các major release, dù tên gọi của chúng có vẻ không đáng chú ý.

### Cam kết về tính ổn định {/*commitment-to-stability*/}

Khi thay đổi React theo thời gian, chúng tôi cố gắng giảm thiểu công sức cần thiết để tận dụng các tính năng mới. Khi có thể, chúng tôi sẽ duy trì hoạt động của API cũ, ngay cả khi điều đó đồng nghĩa với việc đặt API đó trong một package riêng. Ví dụ, [mixins đã không được khuyến khích sử dụng trong nhiều năm](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) nhưng đến nay chúng vẫn được hỗ trợ [thông qua create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) và nhiều codebase vẫn tiếp tục sử dụng chúng trong mã legacy ổn định.

Hơn một triệu developer sử dụng React và cùng nhau duy trì hàng triệu component. Riêng codebase của Facebook đã có hơn 50.000 component React. Điều đó có nghĩa là chúng tôi cần giúp việc nâng cấp lên các phiên bản React mới trở nên dễ dàng nhất có thể; nếu thực hiện những thay đổi lớn mà không cung cấp lộ trình migration, mọi người sẽ bị mắc kẹt ở các phiên bản cũ. Chúng tôi kiểm thử các lộ trình nâng cấp này ngay trên Facebook – nếu đội ngũ dưới 10 người của chúng tôi có thể tự mình cập nhật hơn 50.000 component, chúng tôi hy vọng việc nâng cấp cũng sẽ dễ quản lý đối với bất kỳ ai sử dụng React. Trong nhiều trường hợp, chúng tôi viết [các script tự động](https://github.com/reactjs/react-codemod) để nâng cấp cú pháp component, sau đó đưa chúng vào bản phát hành open source để mọi người sử dụng.

### Nâng cấp từng bước thông qua cảnh báo {/*gradual-upgrades-via-warnings*/}

Các bản build development của React bao gồm nhiều cảnh báo hữu ích. Bất cứ khi nào có thể, chúng tôi thêm cảnh báo để chuẩn bị cho các thay đổi gây breaking trong tương lai. Nhờ đó, nếu ứng dụng của bạn không có cảnh báo nào trên bản phát hành mới nhất, ứng dụng sẽ tương thích với major release tiếp theo. Điều này cho phép bạn nâng cấp ứng dụng từng component một.

Các cảnh báo development sẽ không ảnh hưởng đến runtime behavior của ứng dụng. Nhờ đó, bạn có thể yên tâm rằng ứng dụng sẽ hoạt động giống nhau giữa bản build development và production -- điểm khác biệt duy nhất là bản build production sẽ không ghi log các cảnh báo và hoạt động hiệu quả hơn. (Nếu bạn nhận thấy điều ngược lại, vui lòng gửi issue.)

### Điều gì được xem là một thay đổi gây breaking? {/*what-counts-as-a-breaking-change*/}

Nhìn chung, chúng tôi *không* tăng số major version đối với các thay đổi sau:

* **Cảnh báo development.** Vì những cảnh báo này không ảnh hưởng đến behavior của production, chúng tôi có thể thêm cảnh báo mới hoặc chỉnh sửa cảnh báo hiện có giữa các major version. Trên thực tế, đây chính là điều cho phép chúng tôi cảnh báo một cách đáng tin cậy về các thay đổi gây breaking sắp tới.
* **Các API bắt đầu bằng `unstable_`.** Đây là những tính năng thử nghiệm với các API mà chúng tôi chưa đủ tự tin. Bằng cách phát hành chúng với tiền tố `unstable_`, chúng tôi có thể lặp lại nhanh hơn và sớm đạt được một API ổn định.
* **Các phiên bản Alpha và Canary của React.** Chúng tôi cung cấp các phiên bản alpha của React để thử nghiệm sớm những tính năng mới, nhưng cần có sự linh hoạt để thay đổi dựa trên những gì học được trong giai đoạn alpha. Nếu sử dụng các phiên bản này, hãy lưu ý rằng API có thể thay đổi trước bản phát hành ổn định.
* **Các API không được ghi chép và cấu trúc dữ liệu nội bộ.** Nếu bạn truy cập các tên property nội bộ như `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` hoặc `__reactInternalInstance$uk43rzhitjg`, chúng tôi không đưa ra bất kỳ bảo đảm nào. Bạn phải tự chịu trách nhiệm.

Chính sách này được thiết kế theo hướng thực tế: chắc chắn chúng tôi không muốn gây thêm phiền toái cho bạn. Nếu tăng major version cho tất cả những thay đổi này, chúng tôi sẽ phải phát hành nhiều major version hơn và cuối cùng gây thêm khó khăn về versioning cho cộng đồng. Điều đó cũng có nghĩa là chúng tôi không thể cải tiến React nhanh như mong muốn.

Tuy vậy, nếu dự đoán một thay đổi trong danh sách này sẽ gây ra vấn đề trên diện rộng trong cộng đồng, chúng tôi vẫn sẽ cố gắng hết sức để cung cấp một lộ trình migration từng bước.

### Nếu một minor release không có tính năng mới, tại sao nó không phải là patch? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

Có thể một minor release sẽ không bao gồm tính năng mới. [Điều này được semver cho phép](https://semver.org/#spec-item-7), trong đó nêu rõ rằng **"[một minor version] CÓ THỂ được tăng lên nếu các chức năng mới đáng kể hoặc các cải tiến được đưa vào trong code riêng tư. Nó CÓ THỂ bao gồm các thay đổi ở cấp patch."**

Tuy nhiên, điều này đặt ra câu hỏi tại sao các bản phát hành này không được đánh phiên bản dưới dạng patch.

Câu trả lời là mọi thay đổi đối với React (hoặc phần mềm khác) đều tiềm ẩn rủi ro gây lỗi ngoài dự kiến. Hãy hình dung một tình huống trong đó một patch release sửa một lỗi nhưng vô tình gây ra một lỗi khác. Điều này không chỉ gây gián đoạn cho developer mà còn làm suy giảm niềm tin của họ vào các patch release trong tương lai. Điều đó đặc biệt đáng tiếc nếu bản sửa lỗi ban đầu là dành cho một lỗi hiếm khi gặp trong thực tế.

Chúng tôi có thành tích khá tốt trong việc giữ cho các bản phát hành React không có lỗi, nhưng patch release phải đáp ứng tiêu chuẩn độ tin cậy còn cao hơn, vì hầu hết developer đều cho rằng họ có thể áp dụng chúng mà không gặp hậu quả bất lợi.

Vì những lý do này, chúng tôi chỉ dành patch release cho các lỗi nghiêm trọng nhất và các lỗ hổng bảo mật.

Nếu một bản phát hành bao gồm các thay đổi không thiết yếu — chẳng hạn như refactor nội bộ, thay đổi chi tiết triển khai, cải thiện hiệu năng hoặc sửa các lỗi nhỏ — chúng tôi sẽ tăng minor version ngay cả khi không có tính năng mới.

## Tất cả release channel {/*all-release-channels*/}

React dựa vào một cộng đồng open source năng động để báo cáo lỗi, mở pull request và [gửi RFC](https://github.com/reactjs/rfcs). Để khuyến khích phản hồi, đôi khi chúng tôi chia sẻ các bản build đặc biệt của React có chứa những tính năng chưa được phát hành.

<Note>

Phần này sẽ phù hợp nhất với các developer làm việc trên framework, library hoặc developer tooling. Những developer chủ yếu sử dụng React để xây dựng ứng dụng hướng đến người dùng sẽ không cần quan tâm đến các prerelease channel của chúng tôi.

</Note>

Mỗi release channel của React được thiết kế cho một trường hợp sử dụng riêng:

- [**Latest**](#latest-channel) dành cho các bản phát hành React ổn định, tuân theo semver. Đây là phiên bản bạn nhận được khi cài đặt React từ npm. Đây là channel bạn đang sử dụng hiện nay. **Các ứng dụng hướng đến người dùng sử dụng trực tiếp React sẽ dùng channel này.**
- [**Canary**](#canary-channel) bám theo main branch của source code repository React. Hãy xem chúng như các release candidate cho semver release tiếp theo. **[Các framework hoặc setup được tuyển chọn khác có thể chọn sử dụng channel này với một phiên bản React được pin.](/blog/2023/05/03/react-canaries) Bạn cũng có thể sử dụng Canary để integration testing giữa React và các project bên thứ ba.**
- [**Experimental**](#experimental-channel) bao gồm các API và tính năng thử nghiệm chưa có trong các bản phát hành ổn định. Các bản này cũng bám theo main branch nhưng bật thêm các feature flag. Hãy sử dụng channel này để thử các tính năng sắp tới trước khi chúng được phát hành.

Tất cả các bản phát hành đều được publish lên npm, nhưng chỉ Latest sử dụng semantic versioning. Các prerelease (những bản trong channel Canary và Experimental) có phiên bản được tạo từ hash của nội dung và ngày commit, ví dụ: `18.3.0-canary-388686f29-20230503` đối với Canary và `0.0.0-experimental-388686f29-20230503` đối với Experimental.

**Cả channel Latest và Canary đều được hỗ trợ chính thức cho các ứng dụng hướng đến người dùng, nhưng với những kỳ vọng khác nhau**:

* Các bản phát hành Latest tuân theo mô hình semver truyền thống.
* Các bản phát hành Canary [phải được pin cố định](/blog/2023/05/03/react-canaries) và có thể bao gồm các thay đổi đột phá. Chúng dành cho các thiết lập được tuyển chọn (như các framework) muốn phát hành dần các tính năng React mới và bản sửa lỗi theo lịch phát hành riêng của họ.

Các bản phát hành Experimental chỉ được cung cấp cho mục đích testing, và chúng tôi không đảm bảo rằng hành vi sẽ không thay đổi giữa các bản phát hành. Chúng không tuân theo giao thức semver mà chúng tôi sử dụng cho các bản phát hành từ Latest.

Bằng cách phát hành các prerelease lên cùng registry mà chúng tôi sử dụng cho các bản phát hành ổn định, chúng tôi có thể tận dụng nhiều công cụ hỗ trợ workflow của npm, như [unpkg](https://unpkg.com) và [CodeSandbox](https://codesandbox.io).

### Kênh Latest {/*latest-channel*/}

Latest là kênh được sử dụng cho các bản phát hành React ổn định. Kênh này tương ứng với `latest` tag trên npm. Đây là kênh được khuyến nghị cho mọi ứng dụng React được cung cấp cho người dùng thực tế.

**Nếu bạn không chắc nên sử dụng kênh nào thì đó là Latest.** Nếu bạn đang sử dụng React trực tiếp, đây chính là kênh bạn đang sử dụng. Bạn có thể kỳ vọng các bản cập nhật cho Latest sẽ cực kỳ ổn định. Các phiên bản tuân theo scheme semantic versioning, như đã [mô tả ở trên.](#stable-releases)

### Kênh Canary {/*canary-channel*/}

Kênh Canary là một kênh prerelease theo dõi main branch của repository React. Chúng tôi sử dụng các prerelease trong kênh Canary làm release candidate cho kênh Latest. Bạn có thể hình dung Canary là một tập hợp bao gồm Latest và được cập nhật thường xuyên hơn.

Mức độ thay đổi giữa bản phát hành Canary gần đây nhất và bản phát hành Latest gần đây nhất xấp xỉ bằng mức độ thay đổi giữa hai bản phát hành semver minor. Tuy nhiên, **kênh Canary không tuân theo semantic versioning.** Bạn nên dự kiến thỉnh thoảng sẽ có các thay đổi đột phá giữa những bản phát hành liên tiếp trong kênh Canary.

**Không sử dụng trực tiếp các prerelease trong các ứng dụng hướng đến người dùng, trừ khi bạn đang tuân theo [workflow Canary](/blog/2023/05/03/react-canaries).**

Các bản phát hành trong Canary được published với `canary` tag trên npm. Các phiên bản được tạo từ hash của nội dung bản build và ngày commit, ví dụ `18.3.0-canary-388686f29-20230503`.

#### Sử dụng kênh Canary để integration testing {/*using-the-canary-channel-for-integration-testing*/}

Kênh Canary cũng hỗ trợ integration testing giữa React và các project khác.

Mọi thay đổi đối với React đều trải qua quá trình testing nội bộ chuyên sâu trước khi được phát hành công khai. Tuy nhiên, hệ sinh thái React sử dụng vô số môi trường và cấu hình, và chúng tôi không thể testing với từng môi trường.

Nếu bạn là tác giả của một React framework, library, developer tool hoặc dự án hạ tầng tương tự của bên thứ ba, bạn có thể giúp chúng tôi giữ React ổn định cho người dùng của bạn và toàn bộ cộng đồng React bằng cách định kỳ chạy test suite của bạn với những thay đổi mới nhất. Nếu quan tâm, hãy làm theo các bước sau:

- Thiết lập một cron job bằng nền tảng continuous integration mà bạn предпоч. Cron job được hỗ trợ bởi cả [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) và [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- Trong cron job, cập nhật các package React lên bản phát hành React mới nhất trong kênh Canary, sử dụng `canary` tag trên npm. Sử dụng npm cli:

  ```console
  npm update react@canary react-dom@canary
  ```

  Hoặc yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Chạy test suite của bạn với các package đã cập nhật.
- Nếu mọi thứ đều pass thì thật tuyệt! Bạn có thể kỳ vọng project của mình sẽ hoạt động với bản phát hành React minor tiếp theo.
- Nếu có điều gì đó bất ngờ bị lỗi, vui lòng cho chúng tôi biết bằng cách [tạo issue](https://github.com/react/react/issues).

Một project sử dụng workflow này là Next.js. Bạn có thể tham khảo [cấu hình CircleCI](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) của họ làm ví dụ.

### Kênh Experimental {/*experimental-channel*/}

Giống như Canary, kênh Experimental là một kênh prerelease theo dõi main branch của repository React. Không giống Canary, các bản phát hành Experimental bao gồm những feature và API bổ sung chưa sẵn sàng để phát hành rộng rãi hơn.

Thông thường, một bản cập nhật cho Canary đi kèm với một bản cập nhật tương ứng cho Experimental. Chúng dựa trên cùng một source revision, nhưng được build bằng một tập feature flag khác.

Các bản phát hành Experimental có thể khác biệt đáng kể so với các bản phát hành Canary và Latest. **Không sử dụng các bản phát hành Experimental trong các ứng dụng hướng đến người dùng.** Bạn nên dự kiến sẽ có các thay đổi đột phá thường xuyên giữa các bản phát hành trong kênh Experimental.

Các bản phát hành trong Experimental được published với `experimental` tag trên npm. Các phiên bản được tạo từ hash của nội dung bản build và ngày commit, ví dụ `0.0.0-experimental-68053d940-20210623`.

#### Bản phát hành experimental bao gồm những gì? {/*what-goes-into-an-experimental-release*/}

Các feature Experimental là những feature chưa sẵn sàng để phát hành rộng rãi và có thể thay đổi đáng kể trước khi được hoàn thiện. Một số experiment có thể không bao giờ được hoàn thiện -- lý do chúng tôi có các experiment là để kiểm tra tính khả thi của những thay đổi được đề xuất.

Ví dụ, nếu kênh Experimental đã tồn tại khi chúng tôi công bố Hooks, chúng tôi đã phát hành Hooks lên kênh Experimental vài tuần trước khi chúng có mặt trong Latest.

Bạn có thể thấy hữu ích khi chạy integration test với Experimental. Điều này tùy thuộc vào bạn. Tuy nhiên, hãy lưu ý rằng Experimental còn kém ổn định hơn Canary. **Chúng tôi không đảm bảo bất kỳ sự ổn định nào giữa các bản phát hành Experimental.**

#### Làm thế nào để tìm hiểu thêm về các feature experimental? {/*how-can-i-learn-more-about-experimental-features*/}

Các feature Experimental có thể được documented hoặc không. Thông thường, các experiment chưa được documented cho đến khi chúng gần được phát hành trong Canary hoặc Latest.

Nếu một feature chưa được documented, feature đó có thể đi kèm với một [RFC](https://github.com/reactjs/rfcs).

Chúng tôi sẽ đăng bài trên [blog React](/blog) khi sẵn sàng công bố các experiment mới, nhưng điều đó không có nghĩa là chúng tôi sẽ công khai mọi experiment.

Bạn luôn có thể tham khảo [lịch sử](https://github.com/react/react/commits/main) của repository GitHub công khai để xem danh sách đầy đủ các thay đổi.