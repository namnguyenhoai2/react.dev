---
title: Truyền dữ liệu qua nhiều tầng bằng Context
---

<Intro>

Thông thường, bạn sẽ truyền thông tin từ component cha đến component con thông qua props. Nhưng việc truyền props có thể trở nên dài dòng và bất tiện nếu bạn phải truyền chúng qua nhiều component trung gian, hoặc nếu nhiều component trong ứng dụng cần cùng một thông tin. *Context* cho phép component cha cung cấp một số thông tin cho bất kỳ component nào trong cây bên dưới nó—bất kể sâu đến đâu—mà không cần truyền thông tin đó một cách tường minh qua props.

</Intro>

<YouWillLearn>

- "Prop drilling" là gì
- Cách thay thế việc truyền props lặp đi lặp lại bằng context
- Các trường hợp sử dụng context phổ biến
- Các lựa chọn thay thế phổ biến cho context

</YouWillLearn>

## Vấn đề khi truyền props {/*the-problem-with-passing-props*/}

[Truyền props](/learn/passing-props-to-a-component) là một cách tuyệt vời để truyền dữ liệu một cách tường minh qua cây UI đến các component sử dụng dữ liệu đó.

Nhưng việc truyền props có thể trở nên dài dòng và bất tiện khi bạn cần truyền một prop qua nhiều tầng trong cây, hoặc khi nhiều component cần cùng một prop. Tổ tiên chung gần nhất có thể ở rất xa các component cần dữ liệu, và việc [đưa state lên trên](/learn/sharing-state-between-components) đến mức đó có thể dẫn đến một tình huống gọi là "prop drilling".

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in purple. The value flows down to each of the two children, both highlighted in purple." >

Đưa state lên trên

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root node contains a bubble representing a value highlighted in purple. The value flows down through the two children, each of which pass the value but do not contain it. The left child passes the value down to two children which are both highlighted purple. The right child of the root passes the value through to one of its two children - the right one, which is highlighted purple. That child passed the value through its single child, which passes it down to both of its two children, which are highlighted purple.">

Prop drilling

</Diagram>

</DiagramGroup>

Sẽ thật tuyệt nếu có cách "dịch chuyển" dữ liệu đến các component trong cây cần dữ liệu đó mà không cần truyền props, phải không? Với tính năng context của React, bạn có thể làm được điều đó!

## Context: một lựa chọn thay thế cho việc truyền props {/*context-an-alternative-to-passing-props*/}

Context cho phép component cha cung cấp dữ liệu cho toàn bộ cây bên dưới nó. Context có nhiều cách sử dụng. Sau đây là một ví dụ. Hãy xem xét component `Heading` này, nhận một `level` để xác định kích thước:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Giả sử bạn muốn nhiều heading trong cùng một `Section` luôn có cùng kích thước:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Hiện tại, bạn truyền riêng prop `level` cho từng `<Heading>`:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

Sẽ thật tiện nếu bạn có thể truyền prop `level` cho component `<Section>` thay vì truyền cho từng `<Heading>`. Bằng cách này, bạn có thể đảm bảo rằng mọi heading trong cùng một section đều có cùng kích thước:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

Nhưng làm thế nào component `<Heading>` biết được level của `<Section>` gần nhất? **Điều đó đòi hỏi một cách để component con "yêu cầu" dữ liệu từ một vị trí nào đó ở phía trên trong cây.**

Bạn không thể làm điều đó chỉ với props. Đây là lúc context phát huy tác dụng. Bạn sẽ thực hiện qua ba bước:

1. **Tạo** một context. (Bạn có thể gọi nó là `LevelContext`, vì nó dành cho level của heading.)
2. **Sử dụng** context đó từ component cần dữ liệu. (`Heading` sẽ sử dụng `LevelContext`. )
3. **Cung cấp** context đó từ component xác định dữ liệu. (`Section` sẽ cung cấp `LevelContext`.)

Context cho phép component cha—dù ở rất xa!—cung cấp một số dữ liệu cho toàn bộ cây bên trong nó.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in orange which projects down to the two children, each highlighted in orange." >

Sử dụng context trong các component con gần

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root parent node contains a bubble representing a value highlighted in orange. The value projects down directly to four leaves and one intermediate component in the tree, which are all highlighted in orange. None of the other intermediate components are highlighted.">

Sử dụng context trong các component con ở xa

</Diagram>

</DiagramGroup>

### Bước 1: Tạo context {/*step-1-create-the-context*/}

Trước tiên, bạn cần tạo context. Bạn sẽ cần **export nó từ một file** để các component có thể sử dụng:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Đối số duy nhất của `createContext` là giá trị _mặc định_. Ở đây, `1` biểu thị level heading lớn nhất, nhưng bạn có thể truyền bất kỳ kiểu giá trị nào (kể cả một object). Bạn sẽ thấy ý nghĩa của giá trị mặc định ở bước tiếp theo.

### Bước 2: Sử dụng context {/*step-2-use-the-context*/}

Import Hook `useContext` từ React và context của bạn:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Hiện tại, component `Heading` đọc `level` từ props:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Thay vào đó, hãy xóa prop `level` và đọc giá trị từ context bạn vừa import, `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` là một Hook. Cũng giống như `useState` và `useReducer`, bạn chỉ có thể gọi Hook ngay bên trong một component React (không gọi bên trong vòng lặp hoặc điều kiện). **`useContext` cho React biết rằng component `Heading` muốn đọc `LevelContext`.**

Giờ đây, khi component `Heading` không còn prop `level`, bạn không cần truyền prop level cho `Heading` trong JSX như sau nữa:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

Cập nhật JSX để chính `Section` nhận giá trị đó:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

Để nhắc lại, đây là markup mà bạn đang cố làm cho hoạt động:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Lưu ý rằng ví dụ này vẫn chưa hoàn toàn hoạt động! Tất cả heading đều có cùng kích thước vì **dù bạn đang *sử dụng* context, bạn vẫn chưa *cung cấp* context đó.** React không biết phải lấy nó ở đâu!

Nếu bạn không cung cấp context, React sẽ sử dụng giá trị mặc định mà bạn đã chỉ định ở bước trước. Trong ví dụ này, bạn đã chỉ định `1` làm đối số cho `createContext`, vì vậy `useContext(LevelContext)` trả về `1`, khiến tất cả các heading đó có `<h1>`. Hãy sửa vấn đề này bằng cách để mỗi `Section` cung cấp context riêng.

### Bước 3: Cung cấp context {/*step-3-provide-the-context*/}

Hiện tại, component `Section` render các component con của nó:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Bọc chúng bằng một context provider** để cung cấp `LevelContext` cho chúng:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

Điều này nói với React rằng: "nếu có component nào bên trong `<Section>` yêu cầu `LevelContext`, hãy cung cấp cho nó `level` này." Component sẽ sử dụng giá trị của `<LevelContext>` gần nhất trong cây UI phía trên nó.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Kết quả giống với code ban đầu, nhưng bạn không cần truyền prop `level` cho từng component `Heading`! Thay vào đó, nó "tự tìm ra" level heading bằng cách yêu cầu `Section` gần nhất ở phía trên:

1. Bạn truyền prop `level` cho `<Section>`.
2. `Section` bọc các component con của nó trong `<LevelContext value={level}>`.
3. `Heading` yêu cầu giá trị gần nhất của `LevelContext` ở phía trên bằng `useContext(LevelContext)`.

## Sử dụng và cung cấp context từ cùng một component {/*using-and-providing-context-from-the-same-component*/}

Hiện tại, bạn vẫn phải chỉ định thủ công `level` của từng section:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Vì context cho phép bạn đọc thông tin từ một component ở phía trên, mỗi `Section` có thể đọc `level` từ `Section` ở phía trên, rồi tự động truyền `level + 1` xuống. Bạn có thể làm như sau:

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

Với thay đổi này, bạn không cần truyền prop `level` *dù là* cho `<Section>` hay `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Giờ đây, cả `Heading` và `Section` đều đọc `LevelContext` để xác định chúng đang ở "sâu" đến đâu. Còn `Section` bọc các component con của nó trong `LevelContext` để chỉ định rằng mọi thứ bên trong nó nằm ở một level "sâu hơn".

<Note>

Ví dụ này sử dụng các level heading vì chúng cho thấy một cách trực quan cách các component lồng nhau có thể override context. Nhưng context cũng hữu ích cho nhiều trường hợp khác. Bạn có thể truyền xuống bất kỳ thông tin nào mà toàn bộ subtree cần: theme màu hiện tại, user đang đăng nhập, v.v.

</Note>

## Context đi qua các component trung gian {/*context-passes-through-intermediate-components*/}

Bạn có thể chèn bao nhiêu component tùy thích giữa component cung cấp context và component sử dụng context. Điều này bao gồm cả các component tích hợp sẵn như `<div>` và các component bạn tự xây dựng.

Trong ví dụ này, cùng một component `Post` (có đường viền nét đứt) được render ở hai level lồng nhau khác nhau. Hãy chú ý rằng `<Heading>` bên trong nó tự động nhận level từ `<Section>` gần nhất:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

Bạn không cần làm gì đặc biệt để tính năng này hoạt động. Một `Section` xác định context cho cây nằm bên trong nó, vì vậy bạn có thể chèn một `<Heading>` ở bất kỳ đâu, và nó sẽ có kích thước chính xác. Hãy thử trong sandbox ở trên!

**Context cho phép bạn viết các component có thể “thích ứng với môi trường xung quanh” và hiển thị theo cách khác nhau tùy thuộc vào _vị trí_ (hay nói cách khác, _context nào_) nơi chúng được render.**

Cách context hoạt động có thể khiến bạn liên tưởng đến [tính kế thừa thuộc tính CSS.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) Trong CSS, bạn có thể chỉ định `color: blue` cho một `<div>`, và mọi node DOM nằm bên trong nó, dù lồng sâu đến đâu, sẽ kế thừa màu đó trừ khi một node DOM khác ở giữa ghi đè bằng `color: green`. Tương tự, trong React, cách duy nhất để ghi đè một context được truyền từ phía trên là bọc các children trong một context provider có giá trị khác.

Trong CSS, các thuộc tính khác nhau như `color` và `background-color` không ghi đè lẫn nhau. Bạn có thể đặt `color` của tất cả `<div>` thành màu đỏ mà không ảnh hưởng đến `background-color`. Tương tự, **các context React khác nhau không ghi đè lẫn nhau.** Mỗi context bạn tạo bằng `createContext()` hoàn toàn độc lập với các context khác và liên kết các component sử dụng và cung cấp *chính context đó*. Một component có thể sử dụng hoặc cung cấp nhiều context khác nhau mà không gặp vấn đề gì.

## Trước khi sử dụng context {/*before-you-use-context*/}

Context rất hấp dẫn để sử dụng! Tuy nhiên, điều này cũng có nghĩa là bạn rất dễ lạm dụng nó. **Chỉ vì bạn cần truyền một số props qua vài tầng không có nghĩa là bạn nên đưa thông tin đó vào context.**

Dưới đây là một số phương án thay thế bạn nên cân nhắc trước khi sử dụng context:

1. **Trước tiên, hãy [truyền props.](/learn/passing-props-to-a-component)** Nếu các component của bạn không quá đơn giản, việc truyền một tá props qua một tá component cũng không phải điều bất thường. Việc này có thể khiến bạn cảm thấy khá mất công, nhưng nó làm rõ ràng component nào sử dụng dữ liệu nào! Người bảo trì code của bạn sẽ rất vui vì bạn đã làm cho luồng dữ liệu bằng props trở nên minh bạch.
2. **Tách các component và [truyền JSX dưới dạng `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) cho chúng.** Nếu bạn truyền một số dữ liệu qua nhiều tầng component trung gian không sử dụng dữ liệu đó (mà chỉ truyền tiếp xuống dưới), điều này thường có nghĩa là bạn đã quên tách một số component trong quá trình đó. Ví dụ, có thể bạn truyền các data props như `posts` cho những component hiển thị không trực tiếp sử dụng chúng, chẳng hạn như `<Layout posts={posts} />`. Thay vào đó, hãy để `Layout` nhận `children` dưới dạng prop và render `<Layout><Posts posts={posts} /></Layout>`. Cách này làm giảm số tầng giữa component chỉ định dữ liệu và component cần dữ liệu đó.

Nếu cả hai cách tiếp cận này đều không phù hợp với bạn, hãy cân nhắc sử dụng context.

## Các trường hợp sử dụng context {/*use-cases-for-context*/}

* **Theming:** Nếu ứng dụng của bạn cho phép người dùng thay đổi giao diện (ví dụ: dark mode), bạn có thể đặt một context provider ở đầu ứng dụng và sử dụng context đó trong các component cần điều chỉnh giao diện hiển thị.
* **Tài khoản hiện tại:** Nhiều component có thể cần biết người dùng hiện đang đăng nhập. Đưa thông tin này vào context giúp bạn dễ dàng đọc nó ở bất kỳ đâu trong cây. Một số ứng dụng cũng cho phép bạn thao tác với nhiều tài khoản cùng lúc (ví dụ: đăng bình luận với tư cách một người dùng khác). Trong những trường hợp đó, bạn có thể bọc một phần UI trong một provider lồng nhau với giá trị tài khoản hiện tại khác.
* **Routing:** Hầu hết các giải pháp routing đều sử dụng context bên trong để lưu route hiện tại. Đây là cách mọi link “biết” mình đang active hay không. Nếu tự xây dựng router, bạn cũng có thể muốn làm như vậy.
* **Quản lý state:** Khi ứng dụng phát triển, bạn có thể có rất nhiều state nằm gần đầu ứng dụng. Nhiều component ở xa bên dưới có thể muốn thay đổi state đó. Việc [sử dụng reducer cùng với context](/learn/scaling-up-with-reducer-and-context) để quản lý state phức tạp và truyền nó đến các component ở xa mà không quá vất vả là cách làm phổ biến.

Context không bị giới hạn ở các giá trị tĩnh. Nếu bạn truyền một giá trị khác trong lần render tiếp theo, React sẽ cập nhật tất cả component bên dưới đang đọc giá trị đó! Đây là lý do context thường được sử dụng kết hợp với state.

Nhìn chung, nếu một số thông tin được các component ở xa trong những phần khác nhau của cây cần đến, đó là dấu hiệu tốt cho thấy context sẽ hữu ích.

<Recap>

* Context cho phép một component cung cấp một số thông tin cho toàn bộ cây nằm bên dưới nó.
* Để truyền context:
  1. Tạo và export context bằng `export const MyContext = createContext(defaultValue)`.
  2. Truyền nó vào `useContext(MyContext)` Hook để đọc trong bất kỳ component con nào, dù lồng sâu đến đâu.
  3. Bọc children trong `<MyContext value={...}>` để cung cấp context đó từ component cha.
* Context đi xuyên qua mọi component trung gian.
* Context cho phép bạn viết các component có thể “thích ứng với môi trường xung quanh”.
* Trước khi sử dụng context, hãy thử truyền props hoặc truyền JSX dưới dạng `children`.

</Recap>

<Challenges>

#### Thay thế việc truyền prop qua nhiều tầng bằng context {/*replace-prop-drilling-with-context*/}

Trong ví dụ này, việc bật/tắt checkbox sẽ thay đổi prop `imageSize` được truyền cho từng `<PlaceImage>`. State của checkbox được lưu trong component `App` ở cấp cao nhất, nhưng mỗi `<PlaceImage>` đều cần biết về nó.

Hiện tại, `App` truyền `imageSize` cho `List`, component này truyền nó cho từng `Place`, rồi các component đó truyền nó cho `PlaceImage`. Hãy xóa prop `imageSize` và thay vào đó truyền nó trực tiếp từ component `App` đến `PlaceImage`.

Bạn có thể khai báo context trong `Context.js`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1,
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2,
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3,
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4,
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5,
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://react.dev/images/docs/scientists/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

Xóa prop `imageSize` khỏi tất cả component.

Tạo và export `ImageSizeContext` từ `Context.js`. Sau đó bọc List trong `<ImageSizeContext value={imageSize}>` để truyền giá trị xuống và `useContext(ImageSizeContext)` để đọc giá trị đó trong `PlaceImage`:

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1,
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2,
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3,
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4,
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5,
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://react.dev/images/docs/scientists/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

Lưu ý rằng các component ở giữa không còn cần truyền `imageSize` nữa.

</Solution>

</Challenges>