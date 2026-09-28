---
title: Xây dựng ứng dụng React từ đầu
---

<Intro>

Nếu ứng dụng của bạn có những hạn chế mà các framework hiện có không đáp ứng tốt, bạn muốn tự xây dựng framework của riêng mình hoặc chỉ muốn tìm hiểu những kiến thức cơ bản về ứng dụng React, bạn có thể xây dựng ứng dụng React từ đầu.

</Intro>

<DeepDive>

#### Cân nhắc sử dụng framework {/*consider-using-a-framework*/}

Bắt đầu từ đầu là một cách dễ dàng để làm quen với React, nhưng một đánh đổi lớn cần lưu ý là cách này thường tương đương với việc tự xây dựng một framework ad hoc. Khi các yêu cầu của bạn phát triển, bạn có thể cần giải quyết thêm những vấn đề mang tính framework mà các framework được chúng tôi khuyến nghị đã có những giải pháp được phát triển và hỗ trợ tốt.

Ví dụ: nếu sau này ứng dụng của bạn cần hỗ trợ server-side rendering (SSR), static site generation (SSG) và/hoặc React Server Components (RSC), bạn sẽ phải tự triển khai những tính năng đó. Tương tự, các tính năng mới trong React yêu cầu tích hợp ở cấp framework cũng sẽ phải được bạn tự triển khai nếu muốn sử dụng chúng.

Các framework được chúng tôi khuyến nghị cũng giúp bạn xây dựng những ứng dụng có hiệu năng tốt hơn. Ví dụ, việc giảm hoặc loại bỏ các waterfall trong network request sẽ mang lại trải nghiệm người dùng tốt hơn. Điều này có thể không phải là ưu tiên cao khi bạn xây dựng một dự án thử nghiệm, nhưng nếu ứng dụng của bạn có thêm người dùng, bạn có thể muốn cải thiện hiệu năng của ứng dụng.

Việc đi theo hướng này cũng khiến bạn khó nhận được hỗ trợ hơn, vì cách bạn phát triển routing, data-fetching và các tính năng khác sẽ là riêng biệt theo tình huống của bạn. Bạn chỉ nên chọn tùy chọn này nếu cảm thấy thoải mái khi tự mình giải quyết những vấn đề đó, hoặc nếu tin chắc rằng mình sẽ không bao giờ cần đến các tính năng này.

Để xem danh sách các framework được khuyến nghị, hãy xem [Tạo ứng dụng React](/learn/creating-a-react-app).

</DeepDive>


## Bước 1: Cài đặt build tool {/*step-1-install-a-build-tool*/}

Bước đầu tiên là cài đặt một build tool như `vite`, `parcel` hoặc `rsbuild`. Các build tool này cung cấp các tính năng để đóng gói và chạy source code, cung cấp development server cho việc phát triển cục bộ, cùng một build command để deploy ứng dụng lên production server.

### Vite {/*vite*/}

[Vite](https://vite.dev/) là một build tool hướng đến việc cung cấp trải nghiệm phát triển nhanh hơn và gọn nhẹ hơn cho các dự án web hiện đại.

<TerminalBlock>
npm create vite@latest my-app -- --template react-ts
</TerminalBlock>

Vite có những quan điểm thiết kế rõ ràng và đi kèm các thiết lập mặc định hợp lý ngay từ đầu. Vite có một hệ sinh thái plugin phong phú hỗ trợ fast refresh, JSX, Babel/SWC và các tính năng phổ biến khác. Hãy xem [React plugin](https://vite.dev/plugins/#vitejs-plugin-react) hoặc [React SWC plugin](https://vite.dev/plugins/#vitejs-plugin-react-swc) và [React SSR example project](https://vite.dev/guide/ssr.html#example-projects) của Vite để bắt đầu.

Vite hiện đã được sử dụng làm build tool trong một trong các [framework được khuyến nghị](/learn/creating-a-react-app) của chúng tôi: [React Router](https://reactrouter.com/start/framework/installation).

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/) kết hợp trải nghiệm phát triển tốt ngay từ đầu với một kiến trúc có khả năng mở rộng, có thể đưa dự án của bạn từ giai đoạn mới bắt đầu đến những ứng dụng production quy mô rất lớn.

<TerminalBlock>
npm install --save-dev parcel
</TerminalBlock>

Parcel hỗ trợ sẵn fast refresh, JSX, TypeScript, Flow và styling. Hãy xem [Parcel's React recipe](https://parceljs.org/recipes/react/#getting-started) để bắt đầu.

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/) là một build tool được xây dựng trên Rspack, cung cấp trải nghiệm phát triển liền mạch cho các ứng dụng React. Công cụ này đi kèm các thiết lập mặc định được tinh chỉnh cẩn thận và những tối ưu hóa hiệu năng có thể sử dụng ngay.

<TerminalBlock>
npx create-rsbuild --template react
</TerminalBlock>

Rsbuild tích hợp sẵn hỗ trợ cho các tính năng React như fast refresh, JSX, TypeScript và styling. Hãy xem [Rsbuild's React guide](https://rsbuild.dev/guide/framework/react) để bắt đầu.

<Note>

#### Metro cho React Native {/*react-native*/}

Nếu bắt đầu từ đầu với React Native, bạn sẽ cần sử dụng [Metro](https://metrobundler.dev/), JavaScript bundler dành cho React Native. Metro hỗ trợ bundling cho các nền tảng như iOS và Android, nhưng thiếu nhiều tính năng so với các công cụ ở đây. Chúng tôi khuyến nghị bắt đầu với Vite, Parcel hoặc Rsbuild, trừ khi dự án của bạn yêu cầu hỗ trợ React Native.

</Note>

## Bước 2: Xây dựng các mẫu ứng dụng phổ biến {/*step-2-build-common-application-patterns*/}

Các build tool được liệt kê ở trên bắt đầu với một single-page app (SPA) chỉ chạy ở client, nhưng không bao gồm thêm giải pháp nào cho các chức năng phổ biến như routing, data fetching hoặc styling.

Hệ sinh thái React có nhiều công cụ cho những vấn đề này. Chúng tôi liệt kê một số công cụ được sử dụng rộng rãi làm điểm khởi đầu, nhưng bạn hoàn toàn có thể chọn các công cụ khác nếu chúng phù hợp với bạn hơn.

### Routing {/*routing*/}

Routing quyết định nội dung hoặc trang nào sẽ được hiển thị khi người dùng truy cập một URL cụ thể. Bạn cần thiết lập một router để ánh xạ các URL tới những phần khác nhau của ứng dụng. Bạn cũng cần xử lý nested route, route parameter và query parameter. Router có thể được cấu hình trong code hoặc được xác định dựa trên cấu trúc thư mục và file component của bạn.

Router là một phần cốt lõi của các ứng dụng hiện đại và thường được tích hợp với data fetching (bao gồm việc prefetch dữ liệu cho toàn bộ trang để tải nhanh hơn), code splitting (để giảm kích thước client bundle) và các phương thức page rendering (để quyết định cách tạo từng trang).

Chúng tôi đề xuất sử dụng:

- [React Router](https://reactrouter.com/start/data/custom)
- [Tanstack Router](https://tanstack.com/router/latest)


### Data Fetching {/*data-fetching*/}

Việc fetch dữ liệu từ server hoặc nguồn dữ liệu khác là một phần quan trọng của hầu hết ứng dụng. Để thực hiện đúng cách, bạn cần xử lý loading state, error state và caching dữ liệu đã fetch, vốn có thể khá phức tạp.

Các thư viện data fetching chuyên dụng sẽ đảm nhiệm phần khó khăn là fetch và caching dữ liệu, giúp bạn tập trung vào việc ứng dụng cần dữ liệu nào và hiển thị dữ liệu đó ra sao. Các thư viện này thường được sử dụng trực tiếp trong component, nhưng cũng có thể được tích hợp vào routing loader để pre-fetch nhanh hơn và cải thiện hiệu năng, cũng như được sử dụng trong server rendering.

Lưu ý rằng việc fetch dữ liệu trực tiếp trong component có thể dẫn đến thời gian tải chậm hơn do các waterfall trong network request, vì vậy chúng tôi khuyến nghị prefetch dữ liệu trong router loader hoặc trên server nhiều nhất có thể! Nhờ đó, dữ liệu của một trang có thể được fetch cùng lúc khi trang đang được hiển thị.

Nếu bạn fetch dữ liệu từ hầu hết backend hoặc REST-style API, chúng tôi đề xuất sử dụng:

- [TanStack Query](https://tanstack.com/query/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

Nếu bạn fetch dữ liệu từ GraphQL API, chúng tôi đề xuất sử dụng:

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)


### Code-splitting {/*code-splitting*/}

Code-splitting là quá trình chia ứng dụng thành các bundle nhỏ hơn có thể được tải theo nhu cầu. Kích thước code của ứng dụng tăng lên theo mỗi tính năng mới và dependency bổ sung. Ứng dụng có thể tải chậm vì toàn bộ code của ứng dụng phải được gửi đi trước khi có thể sử dụng. Caching, giảm bớt tính năng/dependency và chuyển một phần code chạy trên server có thể giúp giảm thiểu tình trạng tải chậm, nhưng đây vẫn là những giải pháp chưa hoàn chỉnh và có thể làm giảm chức năng nếu sử dụng quá mức.

Tương tự, nếu bạn dựa vào framework để thực hiện việc split code, bạn có thể gặp những tình huống mà tốc độ tải trở nên chậm hơn so với khi hoàn toàn không thực hiện code splitting. Ví dụ, [lazily loading](/reference/react/lazy) một biểu đồ sẽ trì hoãn việc gửi code cần thiết để render biểu đồ, tách code của biểu đồ khỏi phần còn lại của ứng dụng. [Parcel hỗ trợ code splitting với React.lazy](https://parceljs.org/recipes/react/#code-splitting). Tuy nhiên, nếu biểu đồ fetch dữ liệu *sau khi* được render lần đầu, thì lúc này bạn phải chờ hai lần. Đây là một waterfall: thay vì fetch dữ liệu cho biểu đồ và gửi code để render biểu đồ đồng thời, bạn phải chờ từng bước hoàn tất lần lượt.

Việc tách code theo route, khi được tích hợp với bundling và data fetching, có thể giảm thời gian tải ban đầu của ứng dụng cũng như thời gian cần để phần nội dung lớn nhất đang hiển thị của ứng dụng được render ([Largest Contentful Paint](https://web.dev/articles/lcp)).

Để biết hướng dẫn về code-splitting, hãy xem tài liệu về build tool của bạn:
- [Các tối ưu hóa khi build bằng Vite](https://vite.dev/guide/features.html#build-optimizations)
- [Code splitting với Parcel](https://parceljs.org/features/code-splitting/)
- [Code splitting với Rsbuild](https://rsbuild.dev/guide/optimization/code-splitting)

### Cải thiện hiệu năng ứng dụng {/*improving-application-performance*/}

Vì build tool bạn chọn chỉ hỗ trợ các ứng dụng một trang (SPA), bạn sẽ cần triển khai các [mẫu rendering](https://www.patterns.dev/vanilla/rendering-patterns) khác như server-side rendering (SSR), static site generation (SSG) và/hoặc React Server Components (RSC). Ngay cả khi ban đầu bạn chưa cần những tính năng này, trong tương lai có thể sẽ có một số route được hưởng lợi từ SSR, SSG hoặc RSC.

* **Ứng dụng một trang (SPA)** tải một trang HTML duy nhất và cập nhật trang một cách động khi người dùng tương tác với ứng dụng. SPA giúp bắt đầu dễ dàng hơn, nhưng có thể có thời gian tải ban đầu lâu hơn. SPA là kiến trúc mặc định của hầu hết build tool.

* **Streaming Server-side rendering (SSR)** render một trang trên server và gửi trang đã được render hoàn chỉnh đến client. SSR có thể cải thiện hiệu năng, nhưng việc thiết lập và bảo trì có thể phức tạp hơn so với ứng dụng một trang. Khi có thêm streaming, SSR có thể trở nên rất phức tạp trong việc thiết lập và bảo trì. Xem [hướng dẫn SSR của Vite]( https://vite.dev/guide/ssr).

* **Static site generation (SSG)** tạo các tệp HTML tĩnh cho ứng dụng của bạn trong thời gian build. SSG có thể cải thiện hiệu năng, nhưng việc thiết lập và bảo trì có thể phức tạp hơn so với server-side rendering. Xem [hướng dẫn SSG của Vite](https://vite.dev/guide/ssr.html#pre-rendering-ssg).

* **React Server Components (RSC)** cho phép bạn kết hợp các component tại thời điểm build, chỉ chạy trên server và có tính tương tác trong cùng một cây React. RSC có thể cải thiện hiệu năng, nhưng hiện vẫn đòi hỏi chuyên môn sâu để thiết lập và bảo trì. Xem [các ví dụ về RSC của Parcel](https://github.com/parcel-bundler/rsc-examples).

Các chiến lược rendering của bạn cần tích hợp với router để những ứng dụng được xây dựng bằng framework có thể chọn chiến lược rendering ở cấp độ từng route. Điều này cho phép sử dụng các chiến lược rendering khác nhau mà không cần viết lại toàn bộ ứng dụng. Ví dụ: landing page của ứng dụng có thể được hưởng lợi từ việc tạo tĩnh (SSG), trong khi một trang có content feed có thể hoạt động tốt nhất với server-side rendering.

Sử dụng chiến lược rendering phù hợp cho từng route có thể giảm thời gian để byte nội dung đầu tiên được tải ([Time to First Byte](https://web.dev/articles/ttfb)), phần nội dung đầu tiên được render ([First Contentful Paint](https://web.dev/articles/fcp)) và phần nội dung lớn nhất hiển thị trong ứng dụng được render ([Largest Contentful Paint](https://web.dev/articles/lcp)).

### Và còn nữa... {/*and-more*/}

Đây chỉ là một vài ví dụ về những tính năng mà một ứng dụng mới sẽ cần cân nhắc khi xây dựng từ đầu. Nhiều hạn chế bạn gặp phải có thể khó giải quyết, vì mỗi vấn đề đều liên kết với những vấn đề khác và có thể đòi hỏi chuyên môn sâu trong các lĩnh vực mà bạn chưa quen thuộc.

Nếu không muốn tự mình giải quyết những vấn đề này, bạn có thể [bắt đầu với một framework](/learn/creating-a-react-app) cung cấp sẵn các tính năng này.