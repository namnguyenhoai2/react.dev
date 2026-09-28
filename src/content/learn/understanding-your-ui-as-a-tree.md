---
title: Tìm hiểu UI của bạn dưới dạng cây
---

<Intro>

Ứng dụng React của bạn đang dần hình thành với nhiều component được lồng vào nhau. React theo dõi cấu trúc component của ứng dụng như thế nào?

React và nhiều thư viện UI khác mô hình hóa UI dưới dạng cây. Việc hình dung ứng dụng của bạn như một cây rất hữu ích để hiểu mối quan hệ giữa các component. Sự hiểu biết này sẽ giúp bạn debug các khái niệm sau này như hiệu năng và quản lý state.

</Intro>

<YouWillLearn>

* Cách React “nhìn nhận” cấu trúc component
* Render tree là gì và nó hữu ích cho việc gì
* Module dependency tree là gì và nó hữu ích cho việc gì

</YouWillLearn>

## UI của bạn dưới dạng cây {/*your-ui-as-a-tree*/}

Cây là một mô hình thể hiện mối quan hệ giữa các phần tử. UI thường được biểu diễn bằng các cấu trúc cây. Ví dụ, trình duyệt sử dụng cấu trúc cây để mô hình hóa HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) và CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Các nền tảng di động cũng sử dụng cây để biểu diễn hệ thống phân cấp view của chúng.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram with three sections arranged horizontally. In the first section, there are three rectangles stacked vertically, with labels 'Component A', 'Component B', and 'Component C'. Transitioning to the next pane is an arrow with the React logo on top labeled 'React'. The middle section contains a tree of components, with the root labeled 'A' and two children labeled 'B' and 'C'. The next section is again transitioned using an arrow with the React logo on top labeled 'React DOM'. The third and final section is a wireframe of a browser, containing a tree of 8 nodes, which has only a subset highlighted (indicating the subtree from the middle section).">

React tạo một UI tree từ các component của bạn. Trong ví dụ này, UI tree sau đó được dùng để render ra DOM.
</Diagram>

Tương tự trình duyệt và các nền tảng di động, React cũng sử dụng cấu trúc cây để quản lý và mô hình hóa mối quan hệ giữa các component trong một ứng dụng React. Những cây này là các công cụ hữu ích giúp hiểu cách dữ liệu luân chuyển qua ứng dụng React và cách tối ưu hóa việc render cũng như kích thước ứng dụng.

## Render Tree {/*the-render-tree*/}

Một tính năng quan trọng của component là khả năng kết hợp các component từ những component khác. Khi chúng ta [lồng các component](/learn/your-first-component#nesting-and-organizing-components), chúng ta có khái niệm component cha và component con, trong đó mỗi component cha có thể tự nó là component con của một component khác.

Khi render một ứng dụng React, chúng ta có thể mô hình hóa mối quan hệ này dưới dạng một cây, được gọi là render tree.

Dưới đây là một ứng dụng React render các câu trích dẫn truyền cảm hứng.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/quotes.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
  ];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

<Diagram name="render_tree" height={250} width={500} alt="Tree graph with five nodes. Each node represents a component. The root of the tree is App, with two arrows extending from it to 'InspirationGenerator' and 'FancyText'. The arrows are labelled with the word 'renders'. 'InspirationGenerator' node also has two arrows pointing to nodes 'FancyText' and 'Copyright'.">

React tạo một *render tree*, một UI tree bao gồm các component đã được render.


</Diagram>

Từ ứng dụng ví dụ, chúng ta có thể xây dựng render tree ở trên.

Cây này gồm các node, mỗi node đại diện cho một component. `App`, `FancyText`, `Copyright`, cùng một số component khác, đều là các node trong cây của chúng ta.

Node gốc trong render tree của React là [root component](/learn/importing-and-exporting-components#the-root-component-file) của ứng dụng. Trong trường hợp này, root component là `App` và đây là component đầu tiên React render. Mỗi mũi tên trong cây trỏ từ component cha đến component con.

<DeepDive>

#### Các thẻ HTML nằm ở đâu trong render tree? {/*where-are-the-html-elements-in-the-render-tree*/}

Bạn sẽ nhận thấy trong render tree ở trên không có đề cập đến các thẻ HTML mà mỗi component render. Đó là vì render tree chỉ bao gồm các [component](learn/your-first-component#components-ui-building-blocks) của React.

React, với tư cách là một UI framework, không phụ thuộc vào nền tảng. Trên react.dev, chúng tôi giới thiệu các ví dụ render lên web, nơi sử dụng markup HTML làm các UI primitive. Tuy nhiên, một ứng dụng React cũng có thể render lên nền tảng di động hoặc desktop, vốn có thể sử dụng các UI primitive khác như [UIView](https://developer.apple.com/documentation/uikit/uiview) hoặc [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Các UI primitive của nền tảng này không phải là một phần của React. Render tree của React vẫn có thể cung cấp thông tin chi tiết về ứng dụng React của chúng ta, bất kể ứng dụng được render lên nền tảng nào.

</DeepDive>

Một render tree biểu diễn một lần render duy nhất của ứng dụng React. Với [conditional rendering](/learn/conditional-rendering), một component cha có thể render các component con khác nhau tùy thuộc vào dữ liệu được truyền vào.

Chúng ta có thể cập nhật ứng dụng để render có điều kiện một câu trích dẫn truyền cảm hứng hoặc một màu sắc.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="Tree graph with six nodes. The top node of the tree is labelled 'App' with two arrows extending to nodes labelled 'InspirationGenerator' and 'FancyText'. The arrows are solid lines and are labelled with the word 'renders'. 'InspirationGenerator' node also has three arrows. The arrows to nodes 'FancyText' and 'Color' are dashed and labelled with 'renders?'. The last arrow points to the node labelled 'Copyright' and is solid and labelled with 'renders'.">

Với conditional rendering, qua các lần render khác nhau, render tree có thể render các component khác nhau.

</Diagram>

Trong ví dụ này, tùy thuộc vào giá trị của `inspiration.type`, chúng ta có thể render `<FancyText>` hoặc `<Color>`. Render tree có thể khác nhau trong mỗi lần render.

Mặc dù render tree có thể khác nhau giữa các lần render, những cây này nhìn chung rất hữu ích để xác định đâu là *top-level component* và *leaf component* trong một ứng dụng React. Top-level component là các component gần root component nhất và ảnh hưởng đến hiệu năng render của tất cả component nằm bên dưới chúng; chúng thường chứa phần phức tạp nhất. Leaf component nằm gần cuối cây, không có component con và thường được re-render thường xuyên.

Việc xác định các nhóm component này rất hữu ích để hiểu luồng dữ liệu và hiệu năng của ứng dụng.

## Module Dependency Tree {/*the-module-dependency-tree*/}

Một mối quan hệ khác trong ứng dụng React có thể được mô hình hóa bằng cây là các module dependency của ứng dụng. Khi chúng ta [tách các component](/learn/importing-and-exporting-components#exporting-and-importing-a-component) và logic thành các file riêng biệt, chúng ta tạo ra [JS module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), nơi có thể export component, function hoặc constant.

Mỗi node trong module dependency tree là một module, và mỗi nhánh đại diện cho một câu lệnh `import` trong module đó.

Nếu lấy ứng dụng Inspirations trước đó, chúng ta có thể xây dựng một module dependency tree, gọi ngắn gọn là dependency tree.

<Diagram name="module_dependency_tree" height={250} width={658} alt="A tree graph with seven nodes. Each node is labelled with a module name. The top level node of the tree is labelled 'App.js'. There are three arrows pointing to the modules 'InspirationGenerator.js', 'FancyText.js' and 'Copyright.js' and the arrows are labelled with 'imports'. From the 'InspirationGenerator.js' node, there are three arrows that extend to three modules: 'FancyText.js', 'Color.js', and 'inspirations.js'. The arrows are labelled with 'imports'.">

Module dependency tree của ứng dụng Inspirations.

</Diagram>

Node gốc của cây là root module, còn được gọi là file entrypoint. Đây thường là module chứa root component.

Nếu so sánh với render tree của cùng ứng dụng, ta thấy có những cấu trúc tương tự nhưng cũng có một số khác biệt đáng chú ý:

* Các node tạo nên cây đại diện cho module, không phải component.
* Các module không phải component, chẳng hạn như `inspirations.js`, cũng được biểu diễn trong cây này. Render tree chỉ bao gồm các component.
* `Copyright.js` xuất hiện bên dưới `App.js`, nhưng trong render tree, `Copyright`, tức component, lại xuất hiện dưới dạng component con của `InspirationGenerator`. Điều này là vì `InspirationGenerator` nhận JSX làm [children props](/learn/passing-props-to-a-component#passing-jsx-as-children), nên nó render `Copyright` dưới dạng component con nhưng không import module đó.

Dependency tree hữu ích trong việc xác định những module cần thiết để chạy ứng dụng React. Khi build một ứng dụng React cho production, thường sẽ có một bước build để bundle tất cả JavaScript cần thiết nhằm gửi đến client. Công cụ chịu trách nhiệm cho việc này được gọi là [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), và bundler sẽ sử dụng dependency tree để xác định những module nào cần được đưa vào.

Khi ứng dụng phát triển, kích thước bundle thường cũng tăng theo. Bundle lớn khiến client tốn nhiều chi phí để download và chạy. Kích thước bundle lớn có thể làm chậm thời điểm UI được vẽ. Nắm được dependency tree của ứng dụng có thể giúp debug những vấn đề này.

[comment]: <> (có lẽ chúng ta cũng nên đi sâu hơn về conditional imports)

<Recap>

* Cây là một cách phổ biến để biểu diễn mối quan hệ giữa các thực thể. Chúng thường được dùng để mô hình hóa UI.
* Render tree biểu diễn mối quan hệ lồng nhau giữa các component React trong một lần render.
* Với conditional rendering, render tree có thể thay đổi qua các lần render khác nhau. Với các giá trị prop khác nhau, component có thể render các component con khác nhau.
* Render tree giúp xác định đâu là top-level component và leaf component. Top-level component ảnh hưởng đến hiệu năng render của tất cả component bên dưới, còn leaf component thường xuyên được re-render. Việc xác định chúng rất hữu ích để hiểu và debug hiệu năng render.
* Dependency tree biểu diễn các module dependency trong một ứng dụng React.
* Dependency tree được các công cụ build sử dụng để bundle phần code cần thiết nhằm gửi ứng dụng đến client.
* Dependency tree hữu ích khi debug kích thước bundle lớn làm chậm thời gian hiển thị, đồng thời giúp phát hiện cơ hội tối ưu hóa lượng code được bundle.

</Recap>

[TODO]: <> (Thêm các bài tập)