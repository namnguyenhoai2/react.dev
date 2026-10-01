---
title: Tạo ứng dụng React
---

<Intro>

Nếu bạn muốn xây dựng một ứng dụng hoặc website mới bằng React, chúng tôi khuyên bạn nên bắt đầu với một framework.

</Intro>

Nếu ứng dụng của bạn có những ràng buộc mà các framework hiện có không đáp ứng tốt, bạn muốn tự xây dựng framework của riêng mình hoặc chỉ muốn tìm hiểu những kiến thức cơ bản về ứng dụng React, bạn có thể [xây dựng ứng dụng React từ đầu](/learn/build-a-react-app-from-scratch).

## Framework full-stack {/*full-stack-frameworks*/}

Các framework được khuyên dùng này hỗ trợ tất cả những tính năng bạn cần để deploy và scale ứng dụng trong môi trường production. Chúng đã tích hợp các tính năng React mới nhất và tận dụng kiến trúc của React.

<Note>

#### Framework full-stack không yêu cầu server. {/*react-frameworks-do-not-require-a-server*/}

Tất cả các framework trên trang này đều hỗ trợ client-side rendering ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)), ứng dụng single-page ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)) và static-site generation ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)). Bạn có thể deploy các ứng dụng này lên [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) hoặc dịch vụ static hosting mà không cần server. Ngoài ra, các framework này cho phép bạn thêm server-side rendering cho từng route khi phù hợp với trường hợp sử dụng của mình.

Điều này cho phép bạn bắt đầu với một ứng dụng chỉ chạy ở client, và nếu nhu cầu thay đổi sau này, bạn có thể chọn sử dụng các tính năng server trên từng route mà không cần viết lại ứng dụng. Hãy xem tài liệu của framework để biết cách cấu hình chiến lược rendering.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[App Router của Next.js](https://nextjs.org/docs) là một framework React tận dụng đầy đủ kiến trúc của React để hỗ trợ các ứng dụng React full-stack.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js được [Vercel](https://vercel.com/) duy trì. Bạn có thể [deploy ứng dụng Next.js](https://nextjs.org/docs/app/building-your-application/deploying) lên bất kỳ nhà cung cấp dịch vụ hosting nào hỗ trợ Node.js hoặc Docker container, hoặc lên server của riêng bạn. Next.js cũng hỗ trợ [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports), không yêu cầu server.

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) là thư viện routing phổ biến nhất cho React và có thể kết hợp với Vite để tạo một framework React full-stack**. Thư viện này chú trọng các Web API tiêu chuẩn và có một số [template sẵn sàng để deploy](https://github.com/remix-run/react-router-templates) cho nhiều JavaScript runtime và nền tảng khác nhau.

Để tạo một dự án framework React Router mới, hãy chạy:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router được [Shopify](https://www.shopify.com) duy trì.

### Expo (cho ứng dụng native) {/*expo*/}

**[Expo](https://expo.dev/) là một framework React cho phép bạn tạo các ứng dụng Android, iOS và web universal với UI thực sự native.** Framework này cung cấp SDK cho [React Native](https://reactnative.dev/), giúp việc sử dụng các thành phần native trở nên dễ dàng hơn. Để tạo một dự án Expo mới, hãy chạy:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Nếu bạn mới làm quen với Expo, hãy xem [hướng dẫn Expo](https://docs.expo.dev/tutorial/introduction/).

Expo được [Expo (công ty)](https://expo.dev/about) duy trì. Việc xây dựng ứng dụng bằng Expo là miễn phí và bạn có thể gửi ứng dụng lên các app store của Google và Apple mà không bị hạn chế. Expo cũng cung cấp các dịch vụ cloud trả phí theo lựa chọn.


## Các framework khác {/*other-frameworks*/}

Có những framework mới nổi khác đang hướng tới tầm nhìn React full-stack của chúng tôi:

- [TanStack Start (Beta)](https://tanstack.com/start/): TanStack Start là một framework React full-stack được xây dựng trên TanStack Router. Framework này cung cấp SSR cho toàn bộ tài liệu, streaming, server functions, bundling và nhiều tính năng khác bằng các công cụ như Nitro và Vite.
- [RedwoodSDK](https://rwsdk.com/): Redwood là một framework React full-stack với nhiều package và cấu hình được cài đặt sẵn, giúp dễ dàng xây dựng các ứng dụng web full-stack.

<DeepDive>

#### Những tính năng nào tạo nên tầm nhìn của đội ngũ React về kiến trúc full-stack? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Bundler của App Router trong Next.js triển khai đầy đủ [đặc tả React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) chính thức. Điều này cho phép bạn kết hợp các component build-time, chỉ chạy trên server và component tương tác trong cùng một cây React.

Ví dụ, bạn có thể viết một component React chỉ chạy trên server dưới dạng `async` function đọc dữ liệu từ database hoặc từ một file. Sau đó, bạn có thể truyền dữ liệu từ component này xuống các component tương tác:

```js
// Component này *chỉ* chạy trên server (hoặc trong lúc build).
async function Talks({ confId }) {
  // 1. Bạn đang ở server nên có thể giao tiếp với lớp dữ liệu. Không cần API endpoint.
  const talks = await db.Talks.findAll({ confId });

  // 2. Thêm bao nhiêu logic render cũng được. JavaScript bundle của bạn sẽ không lớn hơn.
  const videos = talks.map(talk => talk.video);

  // 3. Truyền dữ liệu xuống các component sẽ chạy trong trình duyệt.
  return <SearchableVideoList videos={videos} />;
}
```

App Router của Next.js cũng tích hợp [data fetching với Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Điều này cho phép bạn chỉ định trạng thái loading (chẳng hạn như skeleton placeholder) cho các phần khác nhau trong UI trực tiếp trong cây React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components và Suspense là các tính năng của React, không phải của Next.js. Tuy nhiên, việc áp dụng chúng ở cấp framework đòi hỏi sự đồng thuận và nhiều công sức triển khai đáng kể. Hiện tại, App Router của Next.js là bản triển khai hoàn chỉnh nhất. Đội ngũ React đang làm việc với các nhà phát triển bundler để giúp việc triển khai những tính năng này trở nên dễ dàng hơn trong thế hệ framework tiếp theo.

</DeepDive>

## Bắt đầu từ đầu {/*start-from-scratch*/}

Nếu ứng dụng của bạn có những ràng buộc mà các framework hiện có không đáp ứng tốt, bạn muốn tự xây dựng framework của riêng mình hoặc chỉ muốn tìm hiểu những kiến thức cơ bản về ứng dụng React, có những lựa chọn khác để bắt đầu một dự án React từ đầu.

Bắt đầu từ đầu mang lại cho bạn nhiều sự linh hoạt hơn, nhưng đòi hỏi bạn phải lựa chọn các công cụ để sử dụng cho routing, data fetching và những mẫu sử dụng phổ biến khác. Cách này khá giống với việc tự xây dựng framework thay vì sử dụng một framework đã có sẵn. [Các framework chúng tôi khuyên dùng](#full-stack-frameworks) đã tích hợp sẵn giải pháp cho những vấn đề này.

Nếu muốn tự xây dựng các giải pháp của riêng mình, hãy xem hướng dẫn của chúng tôi về [xây dựng ứng dụng React từ đầu](/learn/build-a-react-app-from-scratch) để biết cách thiết lập một dự án React mới, bắt đầu với một build tool như [Vite](https://vite.dev/), [Parcel](https://parceljs.org/) hoặc [RSbuild](https://rsbuild.dev/).

-----

_Nếu bạn là tác giả framework và muốn được đưa vào trang này, [hãy cho chúng tôi biết](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
