---
title: Bảo toàn và đặt lại state
---

<Intro>

State được cô lập giữa các component. React theo dõi state nào thuộc về component nào dựa trên vị trí của chúng trong cây UI. Bạn có thể kiểm soát thời điểm bảo toàn state và thời điểm đặt lại state giữa các lần re-render.

</Intro>

<YouWillLearn>

* Khi React chọn bảo toàn hoặc đặt lại state
* Cách buộc React đặt lại state của component
* Cách key và type ảnh hưởng đến việc state có được bảo toàn hay không

</YouWillLearn>

## State gắn với một vị trí trong cây render {/*state-is-tied-to-a-position-in-the-tree*/}

React xây dựng [cây render](learn/understanding-your-ui-as-a-tree#the-render-tree) cho cấu trúc component trong UI của bạn.

Khi bạn cung cấp state cho một component, bạn có thể nghĩ rằng state đó “sống” bên trong component. Nhưng thực tế, state được lưu bên trong React. React liên kết mỗi phần state mà nó đang lưu với component phù hợp dựa trên vị trí của component đó trong cây render.

Ở đây chỉ có một thẻ `<Counter />` JSX, nhưng nó được render ở hai vị trí khác nhau:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Đây là cách chúng trông như một cây:

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. Each of the children are labeled 'Counter' and both contain a state bubble labeled 'count' with value 0.">

Cây React

</Diagram>

</DiagramGroup>

**Đây là hai bộ đếm riêng biệt vì mỗi bộ được render ở vị trí riêng trong cây.** Thông thường, bạn không cần suy nghĩ về những vị trí này khi sử dụng React, nhưng hiểu cách hoạt động của chúng có thể hữu ích.

Trong React, mỗi component trên màn hình có state hoàn toàn độc lập. Ví dụ, nếu bạn render hai component `Counter` cạnh nhau, mỗi component sẽ có các state `score` và `hover` riêng biệt, độc lập.

Hãy thử nhấp vào cả hai bộ đếm và chú ý rằng chúng không ảnh hưởng lẫn nhau:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Như bạn có thể thấy, khi một bộ đếm được cập nhật, chỉ state của component đó được cập nhật:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 1. The state bubble of the right child is highlighted in yellow to indicate its value has updated.">

Cập nhật state

</Diagram>

</DiagramGroup>


React sẽ giữ state miễn là bạn render cùng một component ở cùng một vị trí trong cây. Để thấy điều này, hãy tăng cả hai bộ đếm, sau đó xóa component thứ hai bằng cách bỏ chọn checkbox “Render the second counter”, rồi thêm lại bằng cách chọn checkbox đó:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Hãy chú ý rằng ngay khi bạn ngừng render bộ đếm thứ hai, state của nó sẽ biến mất hoàn toàn. Đó là vì khi React xóa một component, nó sẽ hủy state của component đó.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is missing, and in its place is a yellow 'poof' image, highlighting the component being deleted from the tree.">

Xóa một component

</Diagram>

</DiagramGroup>

Khi bạn chọn “Render the second counter”, một `Counter` thứ hai cùng state của nó sẽ được khởi tạo lại từ đầu (`score = 0`) và thêm vào DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The entire right child node is highlighted in yellow, indicating that it was just added to the tree.">

Thêm một component

</Diagram>

</DiagramGroup>

**React bảo toàn state của một component miễn là component đó vẫn được render ở vị trí của nó trong cây UI.** Nếu component bị xóa hoặc một component khác được render ở cùng vị trí, React sẽ loại bỏ state của component đó.

## Cùng một component ở cùng một vị trí sẽ bảo toàn state {/*same-component-at-the-same-position-preserves-state*/}

Trong ví dụ này có hai thẻ `<Counter />` khác nhau:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} />
      ) : (
        <Counter isFancy={false} />
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Khi bạn chọn hoặc bỏ chọn checkbox, state của bộ đếm không bị đặt lại. Dù `isFancy` là `true` hay `false`, bạn luôn có một `<Counter />` là phần tử con đầu tiên của `div` được trả về từ component gốc `App`:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram with two sections separated by an arrow transitioning between them. Each section contains a layout of components with a parent labeled 'App' containing a state bubble labeled isFancy. This component has one child labeled 'div', which leads to a prop bubble containing isFancy (highlighted in purple) passed down to the only child. The last child is labeled 'Counter' and contains a state bubble with label 'count' and value 3 in both diagrams. In the left section of the diagram, nothing is highlighted and the isFancy parent state value is false. In the right section of the diagram, the isFancy parent state value has changed to true and it is highlighted in yellow, and so is the props bubble below, which has also changed its isFancy value to true.">

Việc cập nhật state `App` không đặt lại `Counter` vì `Counter` vẫn ở cùng một vị trí

</Diagram>

</DiagramGroup>


Đó là cùng một component ở cùng một vị trí, nên theo góc nhìn của React, đây là cùng một bộ đếm.

<Pitfall>

Hãy nhớ rằng **đối với React, vị trí trong cây UI--chứ không phải trong markup JSX--mới là điều quan trọng!** Component này có hai mệnh đề `return` với các thẻ `<Counter />` JSX khác nhau ở bên trong và bên ngoài `if`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Bạn có thể nghĩ rằng state sẽ được đặt lại khi chọn checkbox, nhưng điều đó không xảy ra! Đó là vì **cả hai thẻ `<Counter />` này đều được render ở cùng một vị trí.** React không biết bạn đặt các điều kiện ở đâu trong function. Tất cả những gì nó “nhìn thấy” là cây mà bạn trả về.

Trong cả hai trường hợp, component `App` đều trả về một `<div>` với `<Counter />` là phần tử con đầu tiên. Đối với React, hai bộ đếm này có cùng một “địa chỉ”: phần tử con đầu tiên của phần tử con đầu tiên của root. Đây là cách React đối chiếu chúng giữa các lần render trước và sau, bất kể bạn cấu trúc logic như thế nào.

</Pitfall>

## Các component khác nhau ở cùng một vị trí sẽ đặt lại state {/*different-components-at-the-same-position-reset-state*/}

Trong ví dụ này, việc chọn checkbox sẽ thay thế `<Counter>` bằng `<p>`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p>
      ) : (
        <Counter />
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Ở đây, bạn chuyển đổi giữa _các kiểu_ component khác nhau tại cùng một vị trí. Ban đầu, phần tử con đầu tiên của `<div>` chứa một `Counter`. Nhưng khi bạn thay bằng một `p`, React đã xóa `Counter` khỏi cây UI và hủy state của nó.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'p', highlighted in yellow.">

Khi `Counter` thay đổi thành `p`, `Counter` bị xóa và `p` mới được thêm vào

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'p'. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, highlighted in yellow.">

Khi chuyển lại, `p` bị xóa và `Counter` được thêm vào

</Diagram>

</DiagramGroup>

Ngoài ra, **khi bạn render một component khác ở cùng một vị trí, state của toàn bộ subtree của nó cũng được đặt lại.** Để xem cách hoạt động, hãy tăng bộ đếm rồi chọn checkbox:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} />
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

State của bộ đếm được đặt lại khi bạn nhấp vào checkbox. Mặc dù bạn render một `Counter`, phần tử con đầu tiên của `div` đã thay đổi từ `section` thành `div`. Khi component con `section` bị xóa khỏi DOM, toàn bộ cây bên dưới nó (bao gồm `Counter` và state của nó) cũng bị hủy.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

Khi `section` thay đổi thành `div`, `section` bị xóa và `div` mới được thêm vào

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'div', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 0. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'section', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

Khi chuyển lại, `div` bị xóa và `section` mới được thêm vào

</Diagram>

</DiagramGroup>

Theo nguyên tắc chung, **nếu bạn muốn bảo toàn state giữa các lần re-render, cấu trúc cây của bạn cần “khớp”** từ lần render này sang lần render khác. Nếu cấu trúc khác nhau, state sẽ bị hủy vì React hủy state khi xóa một component khỏi cây.

<Pitfall>

Đây là lý do bạn không nên lồng các định nghĩa function của component.

Ở đây, function component `MyTextField` được định nghĩa *bên trong* `MyComponent`:

<Sandpack>

```js {expectedErrors: {'react-compiler': [7]}}
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


Mỗi lần bạn nhấp vào button, state của input lại biến mất! Đó là vì một function `MyTextField` *khác* được tạo ra cho mỗi lần render `MyComponent`. Bạn đang render một component *khác* ở cùng một vị trí, nên React đặt lại toàn bộ state bên dưới. Điều này dẫn đến bug và các vấn đề về hiệu năng. Để tránh vấn đề này, **luôn khai báo các function component ở cấp cao nhất và không lồng các định nghĩa của chúng.**

</Pitfall>

## Đặt lại state ở cùng một vị trí {/*resetting-state-at-the-same-position*/}

Theo mặc định, React bảo toàn state của một component khi component đó vẫn ở cùng một vị trí. Thông thường, đây chính xác là điều bạn muốn, nên hành vi mặc định này là hợp lý. Nhưng đôi khi, bạn có thể muốn đặt lại state của một component. Hãy xem xét app cho phép hai người chơi theo dõi điểm số của họ trong mỗi lượt chơi:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Hiện tại, khi bạn đổi người chơi, điểm số vẫn được bảo toàn. Hai `Counter` xuất hiện ở cùng một vị trí, nên React xem chúng là *cùng một* `Counter` có prop `person` đã thay đổi.

Nhưng về mặt khái niệm, trong app này, chúng nên là hai bộ đếm riêng biệt. Chúng có thể xuất hiện ở cùng một vị trí trong UI, nhưng một bộ đếm là của Taylor, còn bộ đếm kia là của Sarah.

Có hai cách để đặt lại state khi chuyển đổi giữa chúng:

1. Render các component ở những vị trí khác nhau
2. Cung cấp cho mỗi component một identity rõ ràng bằng `key`

### Tùy chọn 1: Render một component ở những vị trí khác nhau {/*option-1-rendering-a-component-in-different-positions*/}

Nếu muốn hai `Counter`s này độc lập với nhau, bạn có thể render chúng ở hai vị trí khác nhau:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Ban đầu, `isPlayerA` là `true`. Vì vậy, vị trí đầu tiên chứa trạng thái `Counter`, còn vị trí thứ hai trống.
* Khi bạn nhấp vào nút "Next player", vị trí đầu tiên được xóa, còn vị trí thứ hai giờ chứa một `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The only child, arranged to the left, is labeled Counter with a state bubble labeled 'count' and value 0. All of the left child is highlighted in yellow, indicating it was added.">

Trạng thái ban đầu

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'false'. The state bubble is highlighted in yellow, indicating that it has changed. The left child is replaced with a yellow 'poof' image indicating that it has been deleted and there is a new child on the right, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0.">

Nhấp vào "next"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The state bubble is highlighted in yellow, indicating that it has changed. There is a new child on the left, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is replaced with a yellow 'poof' image indicating that it has been deleted.">

Nhấp vào "next" lần nữa

</Diagram>

</DiagramGroup>

Trạng thái của mỗi `Counter` bị hủy mỗi khi nó bị xóa khỏi DOM. Đây là lý do chúng được reset mỗi lần bạn nhấp vào nút.

Giải pháp này thuận tiện khi bạn chỉ có một vài component độc lập được render tại cùng một vị trí. Trong ví dụ này, bạn chỉ có hai component, nên việc render riêng từng component trong JSX không gây phiền phức.

### Tùy chọn 2: Reset state bằng key {/*option-2-resetting-state-with-a-key*/}

Ngoài ra còn có một cách tổng quát hơn để reset state của một component.

Có thể bạn đã thấy `key`s khi [rendering lists.](/learn/rendering-lists#keeping-list-items-in-order-with-key) Key không chỉ dành cho list! Bạn có thể dùng key để khiến React phân biệt bất kỳ component nào. Theo mặc định, React sử dụng thứ tự trong component cha ("counter thứ nhất", "counter thứ hai") để phân biệt các component. Nhưng key cho phép bạn nói với React rằng đây không chỉ là *counter thứ nhất* hay *counter thứ hai*, mà là một counter cụ thể—ví dụ, counter của *Taylor*. Nhờ vậy, React sẽ nhận biết counter của *Taylor* ở bất kỳ nơi nào nó xuất hiện trong tree!

Trong ví dụ này, hai `<Counter />`s không dùng chung state dù chúng xuất hiện ở cùng một vị trí trong JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Việc chuyển đổi giữa Taylor và Sarah không giữ lại state. Đó là vì **bạn đã gán cho chúng các `key` khác nhau:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Việc chỉ định một `key` cho React biết hãy sử dụng chính `key` đó như một phần của vị trí, thay vì sử dụng thứ tự của chúng trong component cha. Đây là lý do dù bạn render chúng ở cùng một vị trí trong JSX, React vẫn xem chúng là hai counter khác nhau, nên chúng sẽ không bao giờ dùng chung state. Mỗi khi một counter xuất hiện trên màn hình, state của nó được tạo. Mỗi khi nó bị xóa, state của nó bị hủy. Việc chuyển đổi qua lại giữa chúng sẽ reset state của chúng lặp đi lặp lại.

<Note>

Hãy nhớ rằng key không phải là duy nhất trên toàn cục. Chúng chỉ xác định vị trí *bên trong component cha*.

</Note>

### Reset form bằng key {/*resetting-a-form-with-a-key*/}

Reset state bằng key đặc biệt hữu ích khi làm việc với form.

Trong ứng dụng chat này, component `<Chat>` chứa state của ô nhập văn bản:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Hãy thử nhập nội dung vào ô nhập, sau đó nhấn "Alice" hoặc "Bob" để chọn người nhận khác. Bạn sẽ nhận thấy state của ô nhập được giữ lại vì `<Chat>` được render ở cùng một vị trí trong tree.

**Trong nhiều ứng dụng, đây có thể là hành vi mong muốn, nhưng không phải trong ứng dụng chat!** Bạn không muốn người dùng gửi tin nhắn họ đã nhập cho nhầm người chỉ vì vô tình nhấp chuột. Để khắc phục, hãy thêm một `key`:

```js
<Chat key={to.id} contact={to} />
```

Điều này đảm bảo rằng khi bạn chọn một người nhận khác, component `Chat` sẽ được tạo lại từ đầu, bao gồm mọi state trong tree bên dưới nó. React cũng sẽ tạo lại các phần tử DOM thay vì tái sử dụng chúng.

Giờ đây, việc chuyển đổi người nhận luôn xóa nội dung trường văn bản:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### Giữ lại state cho các component đã bị xóa {/*preserving-state-for-removed-components*/}

Trong một ứng dụng chat thực tế, có lẽ bạn sẽ muốn khôi phục state của ô nhập khi người dùng chọn lại người nhận trước đó. Có một vài cách để giữ state "sống" cho một component không còn hiển thị:

- Bạn có thể render _tất cả_ các cuộc chat thay vì chỉ cuộc chat hiện tại, nhưng ẩn các cuộc chat còn lại bằng CSS. Các cuộc chat sẽ không bị xóa khỏi tree, nên state cục bộ của chúng sẽ được giữ lại. Giải pháp này hoạt động rất tốt với UI đơn giản. Tuy nhiên, nó có thể trở nên rất chậm nếu các tree bị ẩn lớn và chứa nhiều node DOM.
- Bạn cũng có thể [lift the state up](/learn/sharing-state-between-components) và lưu tin nhắn đang chờ của từng người nhận trong component cha. Nhờ vậy, khi các component con bị xóa, điều đó không quan trọng, vì chính component cha giữ thông tin quan trọng. Đây là giải pháp phổ biến nhất.
- Bạn cũng có thể sử dụng một nguồn khác bên cạnh state của React. Ví dụ, có lẽ bạn muốn bản nháp tin nhắn vẫn được lưu ngay cả khi người dùng vô tình đóng trang. Để triển khai điều này, bạn có thể cho component `Chat` khởi tạo state bằng cách đọc từ [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), đồng thời lưu các bản nháp ở đó.

Dù chọn chiến lược nào, một cuộc chat _với Alice_ về mặt khái niệm khác với một cuộc chat _với Bob_, nên việc gán một `key` cho tree `<Chat>` dựa trên người nhận hiện tại là hợp lý.

</DeepDive>

<Recap>

- React giữ state miễn là cùng một component được render ở cùng một vị trí.
- State không được lưu trong các thẻ JSX. Nó được liên kết với vị trí trong tree nơi bạn đặt JSX đó.
- Bạn có thể buộc một subtree reset state bằng cách gán cho nó một key khác.
- Đừng lồng các định nghĩa component, nếu không bạn sẽ vô tình reset state.

</Recap>



<Challenges>

#### Khắc phục nội dung ô nhập biến mất {/*fix-disappearing-input-text*/}

Ví dụ này hiển thị một thông báo khi bạn nhấn nút. Tuy nhiên, việc nhấn nút cũng vô tình reset ô nhập. Tại sao điều này xảy ra? Hãy sửa để việc nhấn nút không reset nội dung ô nhập.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Vấn đề là `Form` được render ở các vị trí khác nhau. Trong nhánh `if`, nó là phần tử con thứ hai của `<div>`, nhưng trong nhánh `else`, nó là phần tử con thứ nhất. Vì vậy, loại component ở mỗi vị trí thay đổi. Vị trí đầu tiên thay đổi giữa việc chứa một `p` và một `Form`, còn vị trí thứ hai thay đổi giữa việc chứa một `Form` và một `button`. React reset state mỗi khi loại component thay đổi.

Giải pháp đơn giản nhất là hợp nhất các nhánh để `Form` luôn được render ở cùng một vị trí:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Về mặt kỹ thuật, bạn cũng có thể thêm `null` trước `<Form />` trong nhánh `else` để khớp với cấu trúc của nhánh `if`:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

Bằng cách này, `Form` luôn là phần tử con thứ hai, nên nó giữ nguyên vị trí và state. Tuy nhiên, cách tiếp cận này khó nhận biết hơn nhiều và tạo ra rủi ro người khác sẽ xóa `null` đó.

</Solution>

#### Hoán đổi hai trường trong form {/*swap-two-form-fields*/}

Form này cho phép bạn nhập tên và họ. Nó cũng có một checkbox điều khiển trường nào được đặt trước. Khi bạn đánh dấu checkbox, trường "Last name" sẽ xuất hiện trước trường "First name".

Form gần như hoạt động đúng, nhưng có một lỗi. Nếu bạn điền vào ô nhập "First name" rồi đánh dấu checkbox, nội dung sẽ vẫn nằm trong ô nhập đầu tiên (giờ là "Last name"). Hãy sửa để nội dung ô nhập *cũng* di chuyển khi bạn đảo thứ tự.

<Hint>

Có vẻ như với các trường này, vị trí của chúng bên trong component cha là chưa đủ. Có cách nào để cho React biết cách ghép state giữa các lần re-render không?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" />
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" />
        <Field label="Last name" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Hãy gán một `key` cho cả hai component `<Field>` trong cả hai nhánh `if` và `else`. Điều này cho React biết cách "ghép" state chính xác cho `<Field>`, ngay cả khi thứ tự của chúng trong component cha thay đổi:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" />
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" />
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Reset form chi tiết {/*reset-a-detail-form*/}

Đây là một danh sách liên hệ có thể chỉnh sửa. Bạn có thể chỉnh sửa thông tin của liên hệ đã chọn, sau đó nhấn "Save" để cập nhật hoặc "Reset" để hoàn tác các thay đổi.

Khi bạn chọn một liên hệ khác (ví dụ: Alice), state được cập nhật nhưng form vẫn hiển thị thông tin của liên hệ trước đó. Hãy sửa để form được reset khi liên hệ đã chọn thay đổi.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Cung cấp `key={selectedId}` cho component `EditContact`. Nhờ đó, việc chuyển đổi giữa các contact khác nhau sẽ reset form:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Xóa một hình ảnh trong khi hình ảnh đang tải {/*clear-an-image-while-its-loading*/}

Khi bạn nhấn "Next", trình duyệt bắt đầu tải hình ảnh tiếp theo. Tuy nhiên, vì hình ảnh được hiển thị trong cùng một thẻ `<img>`, theo mặc định bạn vẫn sẽ thấy hình ảnh trước đó cho đến khi hình ảnh tiếp theo tải xong. Điều này có thể không mong muốn nếu việc văn bản luôn khớp với hình ảnh là quan trọng. Hãy thay đổi để ngay khi bạn nhấn "Next", hình ảnh trước đó lập tức bị xóa.

<Hint>

Có cách nào để yêu cầu React tạo lại DOM thay vì tái sử dụng nó không?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

Bạn có thể cung cấp một `key` cho thẻ `<img>`. Khi `key` đó thay đổi, React sẽ tạo lại node DOM `<img>` từ đầu. Điều này gây ra một flash ngắn mỗi khi hình ảnh tải xong, vì vậy bạn sẽ không muốn làm vậy với mọi hình ảnh trong ứng dụng của mình. Nhưng cách này hợp lý nếu bạn muốn đảm bảo hình ảnh luôn khớp với văn bản.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Sửa state bị đặt sai trong danh sách {/*fix-misplaced-state-in-the-list*/}

Trong danh sách này, mỗi `Contact` có state xác định liệu "Show email" đã được nhấn cho contact đó hay chưa. Hãy nhấn "Show email" cho Alice, sau đó đánh dấu checkbox "Show in reverse order". Bạn sẽ nhận thấy email của _Taylor_ hiện được mở rộng, còn email của Alice—đã được chuyển xuống cuối danh sách—lại có vẻ bị thu gọn.

Hãy sửa để trạng thái mở rộng được gắn với từng contact, bất kể thứ tự đã chọn.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Vấn đề là ví dụ này đang sử dụng index làm `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

Tuy nhiên, bạn muốn state được gắn với _từng contact cụ thể_.

Thay vào đó, sử dụng ID của contact làm `key` sẽ khắc phục vấn đề:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

State được gắn với vị trí trong tree. Một `key` cho phép bạn chỉ định một vị trí có tên thay vì dựa vào thứ tự.

</Solution>

</Challenges>