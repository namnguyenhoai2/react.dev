---
title: Giữ cho các Component thuần khiết
---

<Intro>

Một số hàm JavaScript là *pure* (thuần khiết). Các hàm thuần khiết chỉ thực hiện một phép tính và không làm gì hơn. Bằng cách luôn viết component của bạn dưới dạng các hàm thuần khiết, bạn có thể tránh được cả một nhóm lỗi khó hiểu và hành vi không thể đoán trước khi codebase phát triển. Tuy nhiên, để có được những lợi ích này, bạn cần tuân theo một vài quy tắc.

</Intro>

<YouWillLearn>

* Tính thuần khiết là gì và cách nó giúp bạn tránh lỗi
* Cách giữ cho component thuần khiết bằng cách không thực hiện thay đổi trong giai đoạn render
* Cách sử dụng Strict Mode để tìm lỗi trong component

</YouWillLearn>

## Tính thuần khiết: Component dưới dạng công thức {/*purity-components-as-formulas*/}

Trong khoa học máy tính (đặc biệt là trong lĩnh vực functional programming), [a pure function](https://wikipedia.org/wiki/Pure_function) là một hàm có các đặc điểm sau:

* **Chỉ lo việc của riêng mình.** Hàm không thay đổi bất kỳ object hoặc biến nào đã tồn tại trước khi nó được gọi.
* **Input giống nhau, output giống nhau.** Với cùng một input, một hàm thuần khiết phải luôn trả về cùng một kết quả.

Có thể bạn đã quen thuộc với một ví dụ về các hàm thuần khiết: các công thức toán học.

Hãy xem công thức toán học này: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

Nếu <Math><MathI>x</MathI> = 2</Math> thì <Math><MathI>y</MathI> = 4</Math>. Luôn luôn.

Nếu <Math><MathI>x</MathI> = 3</Math> thì <Math><MathI>y</MathI> = 6</Math>. Luôn luôn.

Nếu <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> đôi khi sẽ không phải là <Math>9</Math> hoặc <Math>–1</Math> hoặc <Math>2.5</Math> tùy thuộc vào thời điểm trong ngày hay tình hình thị trường chứng khoán.

Nếu <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> và <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> _luôn luôn_ sẽ là <Math>6</Math>.

Nếu chuyển công thức này thành một hàm JavaScript, nó sẽ trông như sau:

```js
function double(number) {
  return 2 * number;
}
```

Trong ví dụ trên, `double` là một **hàm thuần khiết.** Nếu bạn truyền `3` cho nó, nó sẽ trả về `6`. Luôn luôn.

React được thiết kế dựa trên khái niệm này. **React giả định rằng mọi component bạn viết đều là một hàm thuần khiết.** Điều này có nghĩa là các component React bạn viết phải luôn trả về cùng một JSX với cùng một input:

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

Khi bạn truyền `drinkers={2}` cho `Recipe`, nó sẽ trả về JSX chứa `2 cups of water`. Luôn luôn.

Nếu bạn truyền `drinkers={4}`, nó sẽ trả về JSX chứa `4 cups of water`. Luôn luôn.

Cũng giống như một công thức toán học.

Bạn có thể hình dung component của mình như những công thức nấu ăn: nếu làm theo công thức và không thêm nguyên liệu mới trong quá trình nấu, bạn sẽ luôn có được cùng một món ăn. “Món ăn” đó chính là JSX mà component cung cấp cho React để [render.](/learn/render-and-commit)

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="A tea recipe for x people: take x cups of water, add x spoons of tea and 0.5x spoons of spices, and 0.5x cups of milk" />

## Side effect: Những hệ quả (có chủ ý hoặc không) {/*side-effects-unintended-consequences*/}

Quá trình render của React phải luôn thuần khiết. Component chỉ nên *trả về* JSX của mình, không nên *thay đổi* bất kỳ object hoặc biến nào đã tồn tại trước khi render—nếu không, component sẽ không thuần khiết!

Đây là một component vi phạm quy tắc này:

<Sandpack>

```js {expectedErrors: {'react-compiler': [5]}}
let guest = 0;

function Cup() {
  // Không tốt: thay đổi một biến đã tồn tại!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Component này đang đọc và ghi vào một biến `guest` được khai báo bên ngoài nó. Điều này có nghĩa là **việc gọi component nhiều lần sẽ tạo ra JSX khác nhau!** Hơn nữa, nếu _các_ component khác đọc `guest`, chúng cũng sẽ tạo ra JSX khác nhau, tùy thuộc vào thời điểm chúng được render! Điều đó không thể dự đoán được.

Quay lại công thức <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, giờ đây ngay cả khi <Math><MathI>x</MathI> = 2</Math>, chúng ta cũng không thể tin rằng <Math><MathI>y</MathI> = 4</Math>. Các bài test có thể thất bại, người dùng sẽ bối rối, máy bay sẽ rơi khỏi bầu trời—bạn có thể thấy điều này sẽ dẫn đến những lỗi khó hiểu như thế nào!

Bạn có thể sửa component này bằng cách [truyền `guest` vào dưới dạng một prop](/learn/passing-props-to-a-component):

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

Giờ đây component của bạn đã thuần khiết, vì JSX mà nó trả về chỉ phụ thuộc vào prop `guest`.

Nhìn chung, bạn không nên kỳ vọng các component của mình được render theo một thứ tự cụ thể nào. Việc bạn gọi <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> trước hay sau <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math> không quan trọng: cả hai công thức đều được tính độc lập với nhau. Tương tự, mỗi component chỉ nên “tự suy nghĩ”, không cố gắng phối hợp hoặc phụ thuộc vào component khác trong quá trình render. Render giống như một bài kiểm tra ở trường: mỗi component phải tự tính toán JSX của mình!

<DeepDive>

#### Phát hiện phép tính không thuần khiết bằng StrictMode {/*detecting-impure-calculations-with-strict-mode*/}

Mặc dù có thể bạn chưa sử dụng hết chúng, trong React có ba loại input mà bạn có thể đọc trong khi render: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), và [context.](/learn/passing-data-deeply-with-context) Bạn luôn nên coi các input này là chỉ-đọc.

Khi muốn *thay đổi* điều gì đó để phản hồi thao tác nhập của người dùng, bạn nên [set state](/learn/state-a-components-memory) thay vì ghi vào một biến. Bạn không bao giờ nên thay đổi các biến hoặc object đã tồn tại trong khi component đang render.

React cung cấp "Strict Mode", trong đó React gọi hàm của mỗi component hai lần trong quá trình development. **Bằng cách gọi các hàm component hai lần, Strict Mode giúp phát hiện những component vi phạm các quy tắc này.**

Hãy chú ý rằng ví dụ ban đầu hiển thị "Guest #2", "Guest #4" và "Guest #6" thay vì "Guest #1", "Guest #2" và "Guest #3". Hàm ban đầu không thuần khiết, nên việc gọi nó hai lần đã làm hỏng kết quả. Nhưng phiên bản thuần khiết đã sửa vẫn hoạt động ngay cả khi hàm được gọi hai lần trong mỗi lần. **Các hàm thuần khiết chỉ thực hiện tính toán, nên việc gọi chúng hai lần sẽ không thay đổi điều gì**—cũng giống như việc gọi `double(2)` hai lần không thay đổi giá trị được trả về, và việc giải <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> hai lần không thay đổi giá trị của <MathI>y</MathI>. Input giống nhau, output giống nhau. Luôn luôn.

Strict Mode không có tác động trong production, nên nó sẽ không làm ứng dụng chạy chậm hơn đối với người dùng. Để bật Strict Mode, bạn có thể bọc component gốc trong `<React.StrictMode>`. Một số framework thực hiện việc này theo mặc định.

</DeepDive>

### Mutation cục bộ: Bí mật nhỏ của component {/*local-mutation-your-components-little-secret*/}

Trong ví dụ trên, vấn đề là component đã thay đổi một biến *đã tồn tại trước đó* trong khi render. Điều này thường được gọi là **"mutation"** để nghe có vẻ đáng sợ hơn một chút. Các hàm thuần khiết không mutation các biến bên ngoài phạm vi của hàm hoặc các object được tạo trước khi hàm được gọi—nếu không, chúng sẽ không thuần khiết!

Tuy nhiên, **việc thay đổi các biến và object mà bạn *vừa tạo* trong khi render là hoàn toàn ổn.** Trong ví dụ này, bạn tạo một mảng `[]`, gán nó cho một biến `cups`, rồi `push` một tá chiếc cốc vào đó:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  const cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

Nếu biến `cups` hoặc mảng `[]` được tạo bên ngoài hàm `TeaGathering`, đây sẽ là một vấn đề nghiêm trọng! Bạn sẽ thay đổi một object đã *tồn tại trước đó* bằng cách đẩy các phần tử vào mảng đó.

Tuy nhiên, việc này ổn vì bạn đã tạo chúng *trong cùng một lần render*, bên trong `TeaGathering`. Không có code nào bên ngoài `TeaGathering` biết được việc này đã xảy ra. Đây được gọi là **"mutation cục bộ"**—giống như bí mật nhỏ của component.

## Những nơi bạn _có thể_ tạo side effect {/*where-you-_can_-cause-side-effects*/}

Mặc dù functional programming phụ thuộc rất nhiều vào tính thuần khiết, đến một lúc nào đó, ở một nơi nào đó, _vẫn phải_ có thứ gì đó thay đổi. Đó cũng chính là mục đích của việc lập trình! Những thay đổi này—cập nhật màn hình, bắt đầu animation, thay đổi dữ liệu—được gọi là **side effect.** Chúng là những việc xảy ra _"bên ngoài"_, không diễn ra trong quá trình render.

Trong React, **các side effect thường thuộc về bên trong [event handlers.](/learn/responding-to-events)** Event handler là những hàm được React chạy khi bạn thực hiện một hành động nào đó—chẳng hạn như khi bạn nhấp vào một nút. Mặc dù event handler được định nghĩa *bên trong* component, chúng không chạy *trong quá trình* render! **Vì vậy, event handler không cần phải là hàm pure.**

Nếu bạn đã thử mọi lựa chọn khác nhưng vẫn không tìm được event handler phù hợp cho side effect của mình, bạn vẫn có thể gắn nó vào JSX được trả về bằng một lệnh gọi [`useEffect`](/reference/react/useEffect) trong component. Điều này yêu cầu React thực thi nó sau đó, sau khi render, khi các side effect được phép thực hiện. **Tuy nhiên, đây nên là lựa chọn cuối cùng của bạn.**

Khi có thể, hãy cố gắng biểu đạt logic chỉ bằng việc render. Bạn sẽ ngạc nhiên trước những gì mình có thể làm được theo cách này!

<DeepDive>

#### Tại sao React quan tâm đến tính pure? {/*why-does-react-care-about-purity*/}

Việc viết các hàm pure đòi hỏi một chút thói quen và tính kỷ luật. Nhưng nó cũng mở ra những cơ hội tuyệt vời:

* Component của bạn có thể chạy trong một môi trường khác—chẳng hạn như trên server! Vì chúng trả về cùng một kết quả với cùng một input, một component có thể phục vụ nhiều request của người dùng.
* Bạn có thể cải thiện hiệu năng bằng cách [bỏ qua việc render](/reference/react/memo) những component có input không thay đổi. Điều này an toàn vì các hàm pure luôn trả về cùng một kết quả, nên chúng có thể được cache an toàn.
* Nếu một số dữ liệu thay đổi giữa chừng khi đang render một cây component sâu, React có thể khởi động lại quá trình render mà không lãng phí thời gian hoàn tất lần render đã lỗi thời. Tính pure khiến việc dừng tính toán ở bất kỳ thời điểm nào trở nên an toàn.

Mọi tính năng React mới mà chúng tôi xây dựng đều tận dụng tính pure. Từ việc fetch dữ liệu đến animation và hiệu năng, việc giữ cho các component pure sẽ mở khóa sức mạnh của mô hình React.

</DeepDive>

<Recap>

* Một component phải là pure, nghĩa là:
  * **Component chỉ lo việc của mình.** Nó không nên thay đổi bất kỳ object hoặc biến nào đã tồn tại trước khi render.
  * **Input giống nhau, output giống nhau.** Với cùng một input, component phải luôn trả về cùng một JSX.
* Việc render có thể xảy ra bất kỳ lúc nào, vì vậy các component không nên phụ thuộc vào thứ tự render của nhau.
* Bạn không nên mutate bất kỳ input nào mà component sử dụng để render. Điều đó bao gồm props, state và context. Để cập nhật màn hình, hãy ["set" state](/learn/state-a-components-memory) thay vì mutate các object đã tồn tại.
* Hãy cố gắng biểu đạt logic của component trong JSX mà bạn trả về. Khi cần "thay đổi một thứ gì đó", thông thường bạn nên thực hiện việc đó trong event handler. Trong trường hợp bất khả kháng, bạn có thể `useEffect`.
* Việc viết các hàm pure cần một chút luyện tập, nhưng nó sẽ mở khóa sức mạnh của mô hình React.

</Recap>



<Challenges>

#### Sửa một chiếc đồng hồ bị hỏng {/*fix-a-broken-clock*/}

Component này cố gắng đặt class CSS của `<h1>` thành `"night"` trong khoảng thời gian từ nửa đêm đến sáu giờ sáng, và thành `"day"` vào tất cả các thời điểm khác. Tuy nhiên, nó không hoạt động. Bạn có thể sửa component này không?

Bạn có thể xác minh giải pháp của mình bằng cách tạm thời thay đổi múi giờ của máy tính. Khi thời gian hiện tại nằm trong khoảng từ nửa đêm đến sáu giờ sáng, đồng hồ phải hiển thị màu đảo ngược!

<Hint>

Render là một *phép tính*, nó không nên cố gắng "thực hiện" điều gì. Bạn có thể diễn đạt cùng ý tưởng theo một cách khác không?

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  const hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

Bạn có thể sửa component này bằng cách tính toán `className` và đưa nó vào output của quá trình render:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  const hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

Trong ví dụ này, side effect (thay đổi DOM) hoàn toàn không cần thiết. Bạn chỉ cần trả về JSX.

</Solution>

#### Sửa một profile bị hỏng {/*fix-a-broken-profile*/}

Hai component `Profile` được render cạnh nhau với dữ liệu khác nhau. Hãy nhấn "Collapse" trên profile đầu tiên, sau đó nhấn "Expand". Bạn sẽ nhận thấy cả hai profile hiện đều hiển thị cùng một người. Đây là một bug.

Hãy tìm nguyên nhân của bug và sửa nó.

<Hint>

Code gây ra bug nằm trong `Profile.js`. Hãy đảm bảo bạn đọc toàn bộ code từ đầu đến cuối!

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [7]}} src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

Vấn đề là component `Profile` ghi vào một biến đã tồn tại có tên `currentPerson`, còn các component `Header` và `Avatar` lại đọc từ biến đó. Điều này khiến *cả ba component* đều không pure và khó dự đoán.

Để sửa bug, hãy xóa biến `currentPerson`. Thay vào đó, truyền tất cả thông tin từ `Profile` đến `Header` và `Avatar` thông qua props. Bạn sẽ cần thêm một prop `person` vào cả hai component và truyền nó xuống xuyên suốt.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Hãy nhớ rằng React không đảm bảo các hàm component sẽ được thực thi theo bất kỳ thứ tự cụ thể nào, vì vậy bạn không thể giao tiếp giữa chúng bằng cách thiết lập các biến. Mọi giao tiếp đều phải đi qua props.

</Solution>

#### Sửa một khay story bị hỏng {/*fix-a-broken-story-tray*/}

CEO của công ty bạn yêu cầu bạn thêm "story" vào ứng dụng đồng hồ trực tuyến, và bạn không thể từ chối. Bạn đã viết một component `StoryTray` nhận vào một danh sách `stories`, theo sau là một placeholder "Create Story".

Bạn triển khai placeholder "Create Story" bằng cách thêm một story giả vào cuối mảng `stories` nhận được qua prop. Nhưng vì lý do nào đó, "Create Story" lại xuất hiện nhiều hơn một lần. Hãy sửa vấn đề này.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js {expectedErrors: {'react-compiler': [16]}} src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Ngăn bộ nhớ tăng mãi khi bạn đọc tài liệu.
  // Ở đây chúng ta đang phá vỡ chính quy tắc của mình.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Hãy chú ý rằng mỗi khi đồng hồ cập nhật, "Create Story" lại được thêm *hai lần*. Đây là dấu hiệu cho thấy có mutation trong quá trình render—Strict Mode gọi component hai lần để làm cho những vấn đề này dễ nhận thấy hơn.

Hàm `StoryTray` không pure. Bằng cách gọi `push` trên mảng `stories` nhận được (một prop!), nó đang mutate một object được tạo ra *trước khi* `StoryTray` bắt đầu render. Điều này khiến code bị lỗi và rất khó dự đoán.

Cách sửa đơn giản nhất là hoàn toàn không động vào mảng, mà render "Create Story" riêng:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js {expectedErrors: {'react-compiler': [16]}} src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Ngăn bộ nhớ tăng mãi khi bạn đọc tài liệu.
  // Ở đây chúng ta đang phá vỡ chính quy tắc của mình.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Ngoài ra, bạn có thể tạo một mảng _mới_ (bằng cách sao chép mảng hiện có) trước khi push một item vào đó:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // Sao chép mảng!
  const storiesToDisplay = stories.slice();

  // Không ảnh hưởng đến mảng gốc:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js {expectedErrors: {'react-compiler': [16]}} src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Ngăn bộ nhớ tăng mãi khi bạn đọc tài liệu.
  // Ở đây chúng ta đang phá vỡ chính quy tắc của mình.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Cách này giữ mutation ở phạm vi cục bộ và giúp hàm render của bạn pure. Tuy nhiên, bạn vẫn cần cẩn thận: chẳng hạn, nếu muốn thay đổi bất kỳ item nào đã có trong mảng, bạn cũng sẽ phải clone các item đó.

Bạn nên ghi nhớ những thao tác nào trên mảng sẽ mutate mảng và những thao tác nào thì không. Ví dụ, `push`, `pop`, `reverse` và `sort` sẽ mutate mảng gốc, còn `slice`, `filter` và `map` sẽ tạo ra một mảng mới.

</Solution>

</Challenges>
