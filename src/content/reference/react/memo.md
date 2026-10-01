---
title: memo
---

<Intro>

`memo` cho phép bạn bỏ qua việc re-render một component khi các props của nó không thay đổi.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) tự động áp dụng cơ chế tương đương với `memo` cho tất cả component, giảm nhu cầu memoization thủ công. Bạn có thể sử dụng compiler để tự động xử lý memoization cho component.

</Note>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Bọc một component trong `memo` để tạo phiên bản *memoized* của component đó. Phiên bản memoized này thường sẽ không re-render khi component cha của nó re-render, miễn là các props của nó không thay đổi. Tuy nhiên, React vẫn có thể re-render component đó: memoization là một tối ưu hóa hiệu năng, không phải một bảo đảm.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `Component`: Component mà bạn muốn memoize. `memo` không sửa đổi component này mà thay vào đó trả về một component mới, đã được memoize. Mọi React component hợp lệ, bao gồm function và [`forwardRef`](/reference/react/forwardRef) component, đều được chấp nhận.

* **tùy chọn** `arePropsEqual`: Một function nhận hai đối số: các props trước đó của component và các props mới của nó. Function này phải trả về `true` nếu các props cũ và mới bằng nhau; nghĩa là component sẽ render cùng một output và hoạt động theo cùng một cách với các props mới như với các props cũ. Nếu không, function phải trả về `false`. Thông thường, bạn sẽ không chỉ định function này. Theo mặc định, React sẽ so sánh từng prop bằng phép so sánh [`Object.is`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

#### Giá trị trả về {/*returns*/}

`memo` trả về một React component mới. Component này hoạt động giống như component được cung cấp cho `memo`, ngoại trừ việc React sẽ không luôn re-render component đó khi component cha của nó đang re-render, trừ khi các props của nó đã thay đổi.

---

## Cách sử dụng {/*usage*/}

### Bỏ qua việc re-render khi props không thay đổi {/*skipping-re-rendering-when-props-are-unchanged*/}

Thông thường, React re-render một component mỗi khi component cha của nó re-render. Với `memo`, bạn có thể tạo một component mà React sẽ không re-render khi component cha re-render, miễn là các props mới của component đó giống với các props cũ. Component như vậy được gọi là *memoized*.

Để memoize một component, hãy bọc component đó trong `memo` và sử dụng giá trị mà nó trả về thay cho component ban đầu:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

Một React component luôn phải có [logic rendering thuần.](/learn/keeping-components-pure) Điều này có nghĩa là component phải trả về cùng một output nếu props, state và context của nó không thay đổi. Khi sử dụng `memo`, bạn đang cho React biết rằng component của mình tuân thủ yêu cầu này, vì vậy React không cần re-render component miễn là các props của nó chưa thay đổi. Ngay cả khi sử dụng `memo`, component của bạn vẫn sẽ re-render nếu state riêng của nó thay đổi hoặc nếu một context mà nó đang sử dụng thay đổi.

Trong ví dụ này, hãy chú ý rằng component `Greeting` re-render mỗi khi `name` thay đổi (vì đó là một trong các props của component), nhưng không re-render khi `address` thay đổi (vì nó không được truyền cho `Greeting` dưới dạng prop):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**Bạn chỉ nên dựa vào `memo` như một tối ưu hóa hiệu năng.** Nếu code của bạn không hoạt động khi thiếu nó, hãy tìm và khắc phục vấn đề cốt lõi trước. Sau đó, bạn có thể thêm `memo` để cải thiện hiệu năng.

</Note>

<DeepDive>

#### Có nên thêm memo ở mọi nơi không? {/*should-you-add-memo-everywhere*/}

Nếu ứng dụng của bạn giống trang web này và hầu hết các tương tác đều có phạm vi lớn (chẳng hạn như thay thế một trang hoặc toàn bộ một section), memoization thường không cần thiết. Mặt khác, nếu ứng dụng của bạn giống một trình chỉnh sửa bản vẽ hơn và hầu hết các tương tác đều có phạm vi nhỏ (chẳng hạn như di chuyển các hình), bạn có thể thấy memoization rất hữu ích.

Tối ưu hóa bằng `memo` chỉ có giá trị khi component của bạn thường xuyên re-render với đúng cùng các props và logic rendering của nó tốn nhiều chi phí. Nếu không có độ trễ cảm nhận được khi component re-render, `memo` là không cần thiết. Hãy nhớ rằng `memo` hoàn toàn vô dụng nếu các props truyền vào component của bạn *luôn khác nhau,* chẳng hạn như khi bạn truyền một object hoặc một function thông thường được định nghĩa trong quá trình rendering. Đây là lý do bạn thường sẽ cần [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) và [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) cùng với `memo`.

Trong các trường hợp khác, việc bọc component trong `memo` không mang lại lợi ích. Làm như vậy cũng không gây hại đáng kể, vì vậy một số team chọn không xem xét từng trường hợp riêng lẻ mà memoize nhiều nhất có thể. Nhược điểm của cách tiếp cận này là code trở nên khó đọc hơn. Ngoài ra, không phải mọi memoization đều hiệu quả: chỉ một giá trị "luôn mới" cũng đủ làm hỏng memoization của toàn bộ component.

**Trên thực tế, bạn có thể khiến nhiều trường hợp memoization trở nên không cần thiết bằng cách tuân theo một số nguyên tắc:**

1. Khi một component bao bọc các component khác về mặt hiển thị, hãy để component đó [nhận JSX làm children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Bằng cách này, khi component bao bọc cập nhật state riêng, React biết rằng các children của nó không cần re-render.
1. Ưu tiên state cục bộ và đừng [đưa state lên trên](/learn/sharing-state-between-components) cao hơn mức cần thiết. Ví dụ, đừng giữ các state tạm thời như form và trạng thái một item đang được hover ở cấp cao nhất trong cây hoặc trong một thư viện state toàn cục.
1. Giữ [logic rendering thuần.](/learn/keeping-components-pure) Nếu việc re-render một component gây ra vấn đề hoặc tạo ra một hiện tượng hiển thị dễ nhận thấy, đó là bug trong component của bạn! Hãy sửa bug thay vì thêm memoization.
1. Tránh [các Effect không cần thiết làm cập nhật state.](/learn/you-might-not-need-an-effect) Hầu hết vấn đề hiệu năng trong ứng dụng React là do các chuỗi cập nhật bắt nguồn từ Effect, khiến component của bạn render lặp đi lặp lại.
1. Hãy thử [loại bỏ các dependency không cần thiết khỏi Effect.](/learn/removing-effect-dependencies) Ví dụ, thay vì memoization, thường sẽ đơn giản hơn nếu di chuyển một object hoặc function nào đó vào trong Effect hoặc ra ngoài component.

Nếu một tương tác cụ thể vẫn có cảm giác bị lag, [hãy sử dụng profiler của React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) để xem component nào sẽ được hưởng lợi nhiều nhất từ memoization, rồi thêm memoization ở những nơi cần thiết. Những nguyên tắc này giúp component của bạn dễ debug và dễ hiểu hơn, vì vậy dù thế nào thì việc tuân theo chúng cũng là điều nên làm. Về lâu dài, chúng tôi đang nghiên cứu [tự động thực hiện memoization ở phạm vi nhỏ](https://www.youtube.com/watch?v=lGEMwh32soc) để giải quyết vấn đề này một lần dứt điểm.

</DeepDive>

---

### Cập nhật component memoized bằng state {/*updating-a-memoized-component-using-state*/}

Ngay cả khi một component đã được memoize, nó vẫn sẽ re-render khi state riêng của nó thay đổi. Memoization chỉ liên quan đến các props được truyền từ component cha vào component.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Nếu bạn đặt một biến state thành giá trị hiện tại của chính nó, React sẽ bỏ qua việc re-render component của bạn ngay cả khi không có `memo`. Bạn vẫn có thể thấy function component được gọi thêm một lần, nhưng kết quả sẽ bị loại bỏ.

---

### Cập nhật component memoized bằng context {/*updating-a-memoized-component-using-a-context*/}

Ngay cả khi một component đã được memoize, nó vẫn sẽ re-render khi một context mà nó đang sử dụng thay đổi. Memoization chỉ liên quan đến các props được truyền từ component cha vào component.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

Để component của bạn chỉ re-render khi _một phần_ của context nào đó thay đổi, hãy tách component thành hai phần. Đọc những gì bạn cần từ context trong component bên ngoài, rồi truyền dữ liệu đó xuống component con đã được memoize dưới dạng prop.

---

### Giảm thiểu thay đổi của props {/*minimizing-props-changes*/}

Khi sử dụng `memo`, component của bạn sẽ re-render bất cứ khi nào có prop không *bằng nhau một cách nông* (*shallowly equal*) so với trước đó. Điều này có nghĩa là React so sánh từng prop trong component với giá trị trước đó của nó bằng phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Lưu ý rằng `Object.is(3, 3)` là `true`, nhưng `Object.is({}, {})` là `false`.


Để tận dụng tối đa `memo`, hãy giảm thiểu số lần các props thay đổi. Ví dụ: nếu prop là một object, hãy ngăn component cha tạo lại object đó trong mỗi lần render bằng cách sử dụng [`useMemo`:](/reference/react/useMemo)

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

Một cách tốt hơn để giảm thiểu thay đổi của props là đảm bảo component chỉ nhận lượng thông tin cần thiết tối thiểu trong props. Ví dụ: component có thể nhận từng giá trị riêng lẻ thay vì cả một object:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Đôi khi, ngay cả các giá trị riêng lẻ cũng có thể được chuyển thành những giá trị thay đổi ít thường xuyên hơn. Ví dụ: ở đây, một component nhận một boolean cho biết một giá trị có tồn tại hay không, thay vì nhận chính giá trị đó:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

Khi cần truyền một function cho component đã được memoize, bạn có thể khai báo function đó bên ngoài component để nó không bao giờ thay đổi, hoặc [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) để lưu vào cache định nghĩa của nó giữa các lần re-render.

---

### Chỉ định hàm so sánh tùy chỉnh {/*specifying-a-custom-comparison-function*/}

Trong một số trường hợp hiếm gặp, việc giảm thiểu thay đổi của props của một component đã được memoize có thể không khả thi. Khi đó, bạn có thể cung cấp một hàm so sánh tùy chỉnh, hàm này sẽ được React sử dụng để so sánh props cũ và mới thay vì dùng phép so sánh nông (shallow equality). Hàm này được truyền làm đối số thứ hai cho `memo`. Hàm chỉ nên trả về `true` nếu props mới tạo ra cùng output với props cũ; nếu không, hàm nên trả về `false`.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

Nếu làm như vậy, hãy sử dụng Performance panel trong công cụ dành cho developer của trình duyệt để đảm bảo rằng hàm so sánh của bạn thực sự nhanh hơn việc re-render component. Bạn có thể sẽ ngạc nhiên.

Khi đo hiệu năng, hãy đảm bảo React đang chạy ở production mode.

<Pitfall>

Nếu cung cấp một implementation `arePropsEqual` tùy chỉnh, **bạn phải so sánh mọi prop, bao gồm cả các function.** Các function thường [close over](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) props và state của component cha. Nếu bạn trả về `true` khi `oldProps.onClick !== newProps.onClick`, component của bạn sẽ tiếp tục “nhìn thấy” props và state từ một lần render trước đó bên trong handler `onClick` của nó, dẫn đến những bug rất khó hiểu.

Tránh thực hiện các phép kiểm tra bằng deep equality bên trong `arePropsEqual`, trừ khi bạn chắc chắn 100% rằng cấu trúc dữ liệu đang làm việc có độ sâu giới hạn đã biết. **Các phép kiểm tra deep equality có thể trở nên cực kỳ chậm** và có thể khiến ứng dụng bị treo trong nhiều giây nếu sau này ai đó thay đổi cấu trúc dữ liệu.

</Pitfall>

---

### Tôi có còn cần React.memo nếu sử dụng React Compiler không? {/*react-compiler-memo*/}

Khi bật [React Compiler](/learn/react-compiler), thông thường bạn không còn cần `React.memo` nữa. Compiler sẽ tự động tối ưu việc re-render component cho bạn.

Cách hoạt động như sau:

**Không có React Compiler**, bạn cần `React.memo` để ngăn các lần re-render không cần thiết:

```js
// Component cha re-render mỗi giây
function Parent() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1>Seconds: {seconds}</h1>
      <ExpensiveChild name="John" />
    </>
  );
}

// Không có memo, component này re-render mỗi giây dù props không thay đổi
const ExpensiveChild = memo(function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
});
```

**Khi bật React Compiler**, cùng một tối ưu hóa sẽ diễn ra tự động:

```js
// Không cần memo — compiler tự động ngăn re-render
function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
}
```

Đây là phần quan trọng trong những gì React Compiler tạo ra:

```js {6-12}
function Parent() {
  const $ = _c(7);
  const [seconds, setSeconds] = useState(0);
  // ... code khác ...

  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = <ExpensiveChild name="John" />;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  // ... câu lệnh return ...
}
```

Hãy chú ý các dòng được đánh dấu: Compiler bọc `<ExpensiveChild name="John" />` trong một bước kiểm tra cache. Vì prop `name` luôn là `"John"`, JSX này chỉ được tạo một lần và được tái sử dụng trong mỗi lần re-render của component cha. Đây chính xác là điều `React.memo` thực hiện — ngăn component con re-render khi props của nó không thay đổi.

React Compiler tự động:
1. Theo dõi rằng prop `name` được truyền cho `ExpensiveChild` chưa thay đổi
2. Tái sử dụng JSX đã tạo trước đó cho `<ExpensiveChild name="John" />`
3. Hoàn toàn bỏ qua việc re-render `ExpensiveChild`

Điều này có nghĩa là **bạn có thể an toàn xóa `React.memo` khỏi các component khi sử dụng React Compiler**. Compiler cung cấp cùng một tối ưu hóa một cách tự động, giúp code của bạn gọn gàng hơn và dễ bảo trì hơn.

<Note>

Tối ưu hóa của compiler thực tế còn toàn diện hơn `React.memo`. Nó cũng memoize các giá trị trung gian và những phép tính tốn kém bên trong component của bạn, tương tự như việc kết hợp `React.memo` với `useMemo` xuyên suốt cây component.

</Note>

---

## Khắc phục sự cố {/*troubleshooting*/}
### Component của tôi re-render khi một prop là object, array hoặc function {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React so sánh props cũ và mới bằng phép so sánh nông: nghĩa là nó kiểm tra xem mỗi prop mới có cùng reference với prop cũ hay không. Nếu bạn tạo một object hoặc array mới mỗi khi component cha được re-render, dù từng phần tử riêng lẻ đều giống nhau, React vẫn xem nó là đã thay đổi. Tương tự, nếu bạn tạo một function mới khi render component cha, React sẽ xem function đó đã thay đổi ngay cả khi nó có cùng định nghĩa. Để tránh điều này, [hãy đơn giản hóa props hoặc memoize props trong component cha](#minimizing-props-changes).
