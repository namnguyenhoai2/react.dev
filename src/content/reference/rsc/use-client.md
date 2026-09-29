---
title: "'use client'"
titleForTitleTag: Chỉ thị "'use client'"
---

<RSC>

`'use client'` được dùng với [React Server Components](/reference/rsc/server-components).

</RSC>


<Intro>

`'use client'` cho phép bạn đánh dấu đoạn mã nào chạy trên client.

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `'use client'` {/*use-client*/}

Thêm `'use client'` ở đầu tệp để đánh dấu module và các dependency bắc cầu của nó là mã client.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

Khi một tệp được đánh dấu bằng `'use client'` được import từ một Server Component, [các bundler tương thích](/learn/creating-a-react-app#full-stack-frameworks) sẽ coi việc import module là ranh giới giữa mã chạy trên server và mã chạy trên client.

Là dependency của `RichTextEditor`, `formatDate` và `Button` cũng sẽ được đánh giá trên client, bất kể các module của chúng có chứa chỉ thị `'use client'` hay không. Lưu ý rằng một module có thể được đánh giá trên server khi được import từ mã server và trên client khi được import từ mã client.

#### Các điểm cần lưu ý {/*caveats*/}

* `'use client'` phải nằm ở vị trí đầu tiên của tệp, phía trên mọi import hoặc đoạn mã khác (có thể có comment). Chúng phải được viết bằng dấu nháy đơn hoặc dấu nháy kép, không được dùng dấu backtick.
* Khi một module `'use client'` được import từ một module khác được render trên client, chỉ thị này không có tác dụng.
* Khi một module component chứa chỉ thị `'use client'`, mọi cách sử dụng component đó đều chắc chắn là một Client Component. Tuy nhiên, một component vẫn có thể được đánh giá trên client ngay cả khi không có chỉ thị `'use client'`.
	* Một cách sử dụng component được xem là Client Component nếu nó được định nghĩa trong module có chỉ thị `'use client'` hoặc khi nó là dependency bắc cầu của một module chứa chỉ thị `'use client'`. Nếu không, đó là một Server Component.
* Mã được đánh dấu để đánh giá trên client không chỉ giới hạn ở các component. Mọi mã thuộc cây con module Client đều được gửi đến và chạy bởi client.
* Khi một module được đánh giá trên server import các giá trị từ module `'use client'`, các giá trị đó phải là một React component hoặc [các giá trị prop có thể serialize được](#passing-props-from-server-to-client-components) để truyền vào một Client Component. Mọi trường hợp sử dụng khác sẽ ném ra exception.

### Cách `'use client'` đánh dấu mã client {/*how-use-client-marks-client-code*/}

Trong một ứng dụng React, các component thường được tách thành những tệp riêng biệt, hay còn gọi là [module](/learn/importing-and-exporting-components#exporting-and-importing-a-component).

Đối với các ứng dụng sử dụng React Server Components, ứng dụng mặc định được render trên server. `'use client'` tạo ra ranh giới server-client trong [cây dependency của module](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree), qua đó tạo hiệu quả một cây con gồm các module Client.

Để minh họa rõ hơn, hãy xem xét ứng dụng React Server Components sau đây.

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
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

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

```js src/inspirations.js
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

Trong cây dependency của module trong ứng dụng ví dụ này, chỉ thị `'use client'` trong `InspirationGenerator.js` đánh dấu module đó và tất cả dependency bắc cầu của nó là các module Client. Cây con bắt đầu từ `InspirationGenerator.js` giờ đây được đánh dấu là các module Client.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'` phân tách cây dependency của module trong ứng dụng React Server Components, đánh dấu `InspirationGenerator.js` và tất cả dependency của nó là được render trên client.
</Diagram>

Trong quá trình render, framework sẽ render component gốc trên server và tiếp tục đi qua [cây render](/learn/understanding-your-ui-as-a-tree#the-render-tree), đồng thời không đánh giá bất kỳ mã nào được import từ mã đã được đánh dấu cho client.

Sau đó, phần cây render đã được render trên server sẽ được gửi đến client. Client, sau khi đã tải mã client xuống, sẽ hoàn tất việc render phần còn lại của cây.

<Diagram name="use_client_render_tree" height={250} width={500} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">
Cây render của ứng dụng React Server Components. `InspirationGenerator` và component con của nó là `FancyText` được export từ mã đã được đánh dấu cho client và được xem là các Client Component.
</Diagram>

Chúng ta đưa ra các định nghĩa sau:

* **Client Components** là các component trong cây render được render trên client.
* **Server Components** là các component trong cây render được render trên server.

Xét ứng dụng ví dụ, `App`, `FancyText` và `Copyright` đều được render trên server và được xem là Server Component. Vì `InspirationGenerator.js` và các dependency bắc cầu của nó được đánh dấu là mã client, component `InspirationGenerator` và component con của nó là `FancyText` là các Client Component.

<DeepDive>
#### Làm thế nào `FancyText` vừa là Server Component vừa là Client Component? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

Theo các định nghĩa trên, component `FancyText` vừa là Server Component vừa là Client Component; điều này có thể xảy ra như thế nào?

Trước tiên, cần làm rõ rằng thuật ngữ "component" không thật sự chính xác. Dưới đây là hai cách hiểu về "component":

1. "Component" có thể chỉ **định nghĩa component**. Trong hầu hết trường hợp, đây sẽ là một function.

```js
// This is a definition of a component
function MyComponent() {
  return <p>My Component</p>
}
```

2. "Component" cũng có thể chỉ **cách sử dụng component** từ định nghĩa của nó.
```js
import MyComponent from './MyComponent';

function App() {
  // This is a usage of a component
  return <MyComponent />;
}
```

Sự không chính xác này thường không quan trọng khi giải thích các khái niệm, nhưng trong trường hợp này thì có.

Khi nói về Server Component hoặc Client Component, chúng ta đang nói đến cách sử dụng component.

* Nếu component được định nghĩa trong một module có chỉ thị `'use client'`, hoặc component được import và gọi trong một Client Component, thì cách sử dụng component đó là một Client Component.
* Nếu không, cách sử dụng component đó là một Server Component.


<Diagram name="use_client_render_tree" height={150} width={450} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">Cây render minh họa các cách sử dụng component.</Diagram>

Quay lại câu hỏi về `FancyText`, ta thấy định nghĩa component _không_ có chỉ thị `'use client'` và có hai cách sử dụng.

Việc sử dụng `FancyText` làm component con của `App` đánh dấu cách sử dụng đó là một Server Component. Khi `FancyText` được import và gọi bên trong `InspirationGenerator`, cách sử dụng `FancyText` đó là một Client Component, vì `InspirationGenerator` chứa chỉ thị `'use client'`.

Điều này có nghĩa là định nghĩa component của `FancyText` sẽ vừa được đánh giá trên server, vừa được client tải xuống để render cách sử dụng nó như một Client Component.

</DeepDive>

<DeepDive>

#### Tại sao `Copyright` lại là một Server Component? {/*why-is-copyright-a-server-component*/}

Vì `Copyright` được render làm component con của Client Component `InspirationGenerator`, bạn có thể ngạc nhiên khi nó lại là một Server Component.

Hãy nhớ rằng `'use client'` xác định ranh giới giữa mã server và mã client trên _cây dependency của module_, không phải trên cây render.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'` xác định ranh giới giữa mã server và mã client trên cây dependency của module.
</Diagram>

Trong cây dependency của module, ta thấy `App.js` import và gọi `Copyright` từ module `Copyright.js`. Vì `Copyright.js` không chứa chỉ thị `'use client'`, cách sử dụng component đó được render trên server. `App` được render trên server vì đây là component gốc.

Client Components có thể render Server Components vì bạn có thể truyền JSX dưới dạng prop. Trong trường hợp này, `InspirationGenerator` nhận `Copyright` làm [children](/learn/passing-props-to-a-component#passing-jsx-as-children). Tuy nhiên, module `InspirationGenerator` không trực tiếp import module `Copyright` cũng như gọi component này; tất cả đều được thực hiện bởi `App`. Trên thực tế, component `Copyright` được thực thi hoàn toàn trước khi `InspirationGenerator` bắt đầu render.

Điều cần ghi nhớ là mối quan hệ render cha-con giữa các component không đảm bảo chúng được render trong cùng một môi trường.

</DeepDive>

### Khi nào nên sử dụng `'use client'` {/*when-to-use-use-client*/}

Với `'use client'`, bạn có thể xác định khi nào các component là Client Component. Vì Server Component là mặc định, dưới đây là phần tổng quan ngắn gọn về các ưu điểm và hạn chế của Server Component để xác định khi nào bạn cần đánh dấu một thành phần là được render trên client.

Để đơn giản, chúng ta nói về Server Component, nhưng các nguyên tắc tương tự cũng áp dụng cho mọi mã chạy trên server trong ứng dụng của bạn.

#### Ưu điểm của Server Component {/*advantages*/}
* Server Component có thể giảm lượng mã được gửi đến và chạy trên client. Chỉ các module Client mới được bundler và đánh giá bởi client.
* Server Component hưởng lợi từ việc chạy trên server. Chúng có thể truy cập filesystem cục bộ và có thể có độ trễ thấp khi fetch dữ liệu cũng như thực hiện các network request.

#### Hạn chế của Server Components {/*limitations*/}
* Server Components không thể hỗ trợ tương tác vì event handler phải được đăng ký và kích hoạt bởi client.
	* Ví dụ: các event handler như `onClick` chỉ có thể được định nghĩa trong Client Components.
* Server Components không thể sử dụng hầu hết các Hooks.
	* Khi Server Components được render, output của chúng về cơ bản là một danh sách các component để client render. Server Components không được duy trì trong bộ nhớ sau khi render và không thể có state riêng.

### Các kiểu dữ liệu có thể tuần tự hóa được trả về bởi Server Components {/*serializable-types*/}

Cũng như trong mọi ứng dụng React, component cha truyền dữ liệu cho component con. Vì chúng được render trong các môi trường khác nhau, việc truyền dữ liệu từ Server Component đến Client Component cần được cân nhắc thêm.

Các giá trị prop được truyền từ Server Component đến Client Component phải có thể tuần tự hóa được.

Các prop có thể tuần tự hóa bao gồm:
* Primitive
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), chỉ các symbol được đăng ký trong global Symbol registry thông qua [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Các iterable chứa các giá trị có thể tuần tự hóa
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) và [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) thuần: những object được tạo bằng [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), với các thuộc tính có thể tuần tự hóa
* Các function là [Server Functions](/reference/rsc/server-functions)
* Các phần tử Client Component hoặc Server Component (JSX)
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Đáng chú ý, các kiểu sau không được hỗ trợ:
* [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) không được export từ các module được đánh dấu là client hoặc không được đánh dấu bằng [`'use server'`](/reference/rsc/use-server)
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Các object là instance của bất kỳ class nào (ngoại trừ các built-in đã đề cập) hoặc các object có [a null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Các symbol chưa được đăng ký globally, ví dụ `Symbol('my new symbol')`


## Cách sử dụng {/*usage*/}

### Xây dựng với tính tương tác và state {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

Vì `Counter` yêu cầu cả `useState` Hook và các event handler để tăng hoặc giảm giá trị, component này phải là một Client Component và cần có directive `'use client'` ở phần đầu.

Ngược lại, một component render UI mà không có tương tác sẽ không cần là Client Component.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

Ví dụ, component cha của `Counter`, `CounterContainer`, không cần `'use client'` vì nó không có tính tương tác và không sử dụng state. Ngoài ra, `CounterContainer` phải là một Server Component vì nó đọc từ hệ thống tệp cục bộ trên server, điều chỉ có thể thực hiện trong một Server Component.

Cũng có những component không sử dụng bất kỳ tính năng nào chỉ dành riêng cho server hoặc client và có thể không phụ thuộc vào nơi chúng được render. Trong ví dụ trước đó, `FancyText` là một component như vậy.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

Trong trường hợp này, chúng ta không thêm directive `'use client'`, nên _output_ của `FancyText` (thay vì source code của nó) sẽ được gửi đến trình duyệt khi được tham chiếu từ một Server Component. Như đã minh họa trong ví dụ ứng dụng Inspirations trước đó, `FancyText` được sử dụng vừa như một Server Component vừa như một Client Component, tùy thuộc vào nơi nó được import và sử dụng.

Tuy nhiên, nếu output HTML của `FancyText` lớn so với source code của nó (bao gồm cả dependencies), việc buộc nó luôn là một Client Component có thể hiệu quả hơn. Các component trả về một chuỗi SVG path dài là một trường hợp mà việc buộc component trở thành Client Component có thể hiệu quả hơn.

### Sử dụng client API {/*using-client-apis*/}

Ứng dụng React của bạn có thể sử dụng các API dành riêng cho client, chẳng hạn như API của trình duyệt để lưu trữ web, thao tác âm thanh và video, cũng như phần cứng thiết bị và [others](https://developer.mozilla.org/en-US/docs/Web/API).

Trong ví dụ này, component sử dụng [DOM APIs](https://developer.mozilla.org/en-US/docs/Glossary/DOM) để thao tác với một phần tử [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). Vì các API đó chỉ có trong trình duyệt, component phải được đánh dấu là Client Component.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### Sử dụng thư viện bên thứ ba {/*using-third-party-libraries*/}

Thông thường, trong một ứng dụng React, bạn sẽ tận dụng các thư viện bên thứ ba để xử lý những pattern UI hoặc logic phổ biến.

Các thư viện này có thể dựa vào các Hook của component hoặc client API. Các component bên thứ ba sử dụng bất kỳ React API nào sau đây phải chạy trên client:
* [createContext](/reference/react/createContext)
* Các Hook [`react`](/reference/react/hooks) và [`react-dom`](/reference/react-dom/hooks), ngoại trừ [`use`](/reference/react/use) và [`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* Nếu chúng sử dụng client API, ví dụ như DOM insertion hoặc native platform views

Nếu các thư viện này đã được cập nhật để tương thích với React Server Components, chúng sẽ có sẵn các marker `'use client'` của riêng mình, cho phép bạn sử dụng chúng trực tiếp từ Server Components. Nếu một thư viện chưa được cập nhật hoặc nếu một component cần các prop như event handler chỉ có thể được chỉ định trên client, bạn có thể cần thêm một file Client Component của riêng mình vào giữa Client Component bên thứ ba và Server Component nơi bạn muốn sử dụng nó.

[TODO]: <> (Khắc phục sự cố - cần các trường hợp sử dụng)