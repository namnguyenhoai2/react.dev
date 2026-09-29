---
title: Các quy tắc của React
---

<Intro>
Cũng như mỗi ngôn ngữ lập trình có cách riêng để diễn đạt các khái niệm, React có các idiom — hay quy tắc — riêng về cách diễn đạt các pattern sao cho dễ hiểu và tạo ra các ứng dụng chất lượng cao.
</Intro>

<InlineToc />

---

<Note>
Để tìm hiểu thêm về cách diễn đạt UI bằng React, chúng tôi khuyên bạn nên đọc [Tư duy trong React](/learn/thinking-in-react).
</Note>

Phần này mô tả các quy tắc bạn cần tuân theo để viết code React đúng theo idiom. Việc viết code React đúng theo idiom có thể giúp bạn tạo ra các ứng dụng được tổ chức tốt, an toàn và có thể kết hợp. Những thuộc tính này giúp ứng dụng của bạn có khả năng chống chịu tốt hơn trước các thay đổi, đồng thời giúp bạn dễ làm việc hơn với các developer, library và tool khác.

Các quy tắc này được gọi là **Rules of React**. Đây là các quy tắc — không chỉ là hướng dẫn — theo nghĩa rằng nếu vi phạm chúng, ứng dụng của bạn có khả năng sẽ có bug. Code của bạn cũng trở nên không đúng theo idiom và khó hiểu, khó phân tích hơn.

Chúng tôi đặc biệt khuyên bạn nên sử dụng [Strict Mode](/reference/react/StrictMode) cùng với [ESLint plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) của React để giúp codebase tuân theo Rules of React. Bằng cách tuân theo Rules of React, bạn sẽ có thể tìm và xử lý các bug này, đồng thời duy trì khả năng bảo trì của ứng dụng.

---

## Components và Hooks phải thuần túy {/*components-and-hooks-must-be-pure*/}

[Tính thuần túy trong Components và Hooks](/reference/rules/components-and-hooks-must-be-pure) là một quy tắc quan trọng của React, giúp ứng dụng của bạn dễ dự đoán, dễ debug và cho phép React tự động tối ưu code của bạn.

* [Components phải có tính idempotent](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – Các React component được giả định là luôn trả về cùng một output tương ứng với các input của chúng — props, state và context.
* [Side effect phải chạy bên ngoài quá trình render](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – Side effect không nên chạy trong quá trình render, vì React có thể render component nhiều lần để tạo ra trải nghiệm người dùng tốt nhất có thể.
* [Props và state là bất biến](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – Props và state của một component là các snapshot bất biến trong phạm vi một lần render. Không bao giờ được trực tiếp mutate chúng.
* [Giá trị trả về và đối số của Hooks là bất biến](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – Sau khi các giá trị được truyền vào một Hook, bạn không nên thay đổi chúng. Giống như props trong JSX, các giá trị trở nên bất biến khi được truyền vào một Hook.
* [Các giá trị là bất biến sau khi được truyền vào JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – Đừng mutate các giá trị sau khi chúng đã được sử dụng trong JSX. Hãy thực hiện việc mutate trước khi JSX được tạo.

---

## React gọi Components và Hooks {/*react-calls-components-and-hooks*/}

[React chịu trách nhiệm render các component và hook khi cần thiết để tối ưu trải nghiệm người dùng.](/reference/rules/react-calls-components-and-hooks) React mang tính khai báo: bạn cho React biết cần render gì trong logic của component, còn React sẽ tự xác định cách tốt nhất để hiển thị nội dung đó cho người dùng.

* [Không bao giờ gọi trực tiếp các hàm component](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – Chỉ nên sử dụng component trong JSX. Đừng gọi chúng như các function thông thường.
* [Không bao giờ truyền Hooks dưới dạng các giá trị thông thường](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – Chỉ nên gọi Hooks bên trong component. Không bao giờ truyền chúng dưới dạng một giá trị thông thường.

---

## Rules of Hooks {/*rules-of-hooks*/}

Hooks được định nghĩa bằng các function JavaScript, nhưng chúng đại diện cho một loại logic UI có thể tái sử dụng đặc biệt, với các hạn chế về nơi chúng có thể được gọi. Bạn cần tuân theo [Rules of Hooks](/reference/rules/rules-of-hooks) khi sử dụng chúng.

* [Chỉ gọi Hooks ở cấp cao nhất](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – Đừng gọi Hooks bên trong vòng lặp, điều kiện hoặc function lồng nhau. Thay vào đó, luôn sử dụng Hooks ở cấp cao nhất trong React function của bạn, trước mọi lệnh return sớm.
* [Chỉ gọi Hooks từ các React function](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – Đừng gọi Hooks từ các function JavaScript thông thường.