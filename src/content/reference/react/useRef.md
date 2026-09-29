---
title: useRef
---

<Intro>

`useRef` là một React Hook cho phép bạn tham chiếu đến một giá trị không cần thiết cho việc kết xuất.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Gọi `useRef` ở cấp cao nhất của component để khai báo một [ref.](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `initialValue`: Giá trị bạn muốn thuộc tính `current` của đối tượng ref có lúc đầu. Đây có thể là giá trị thuộc bất kỳ kiểu nào. Đối số này sẽ bị bỏ qua sau lần kết xuất đầu tiên.

#### Giá trị trả về {/*returns*/}

`useRef` trả về một đối tượng có duy nhất một thuộc tính:

* `current`: Ban đầu, thuộc tính này được đặt thành `initialValue` mà bạn đã truyền vào. Sau đó, bạn có thể đặt nó thành một giá trị khác. Nếu bạn truyền đối tượng ref cho React dưới dạng thuộc tính `ref` của một node JSX, React sẽ đặt thuộc tính `current` của nó.

Trong các lần kết xuất tiếp theo, `useRef` sẽ trả về cùng một đối tượng.

#### Lưu ý {/*caveats*/}

* Bạn có thể thay đổi thuộc tính `ref.current`. Không giống như state, thuộc tính này có thể thay đổi. Tuy nhiên, nếu nó chứa một đối tượng được dùng cho việc kết xuất (ví dụ: một phần state của bạn), bạn không nên thay đổi đối tượng đó.
* Khi bạn thay đổi thuộc tính `ref.current`, React sẽ không kết xuất lại component của bạn. React không biết khi nào bạn thay đổi thuộc tính này vì ref là một đối tượng JavaScript thuần.
* Không được ghi _hoặc đọc_ `ref.current` trong quá trình kết xuất, ngoại trừ việc [khởi tạo.](#avoiding-recreating-the-ref-contents) Điều này khiến hành vi của component trở nên khó dự đoán.
* Trong Strict Mode, React sẽ **gọi hàm component của bạn hai lần** để [giúp bạn tìm ra các tác động phụ ngoài ý muốn.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Đây là hành vi chỉ xảy ra trong quá trình phát triển và không ảnh hưởng đến môi trường production. Mỗi đối tượng ref sẽ được tạo hai lần, nhưng một phiên bản sẽ bị loại bỏ. Nếu hàm component của bạn là pure (như yêu cầu), điều này sẽ không ảnh hưởng đến hành vi.

---

## Cách sử dụng {/*usage*/}

### Tham chiếu đến một giá trị bằng ref {/*referencing-a-value-with-a-ref*/}

Gọi `useRef` ở cấp cao nhất của component để khai báo một hoặc nhiều [ref.](/learn/referencing-values-with-refs)

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` trả về một <CodeStep step={1}>ref object</CodeStep> có một <CodeStep step={2}>`current` property</CodeStep> duy nhất, ban đầu được đặt thành <CodeStep step={3}>initial value</CodeStep> mà bạn đã cung cấp.

Trong các lần kết xuất tiếp theo, `useRef` sẽ trả về cùng một đối tượng. Bạn có thể thay đổi thuộc tính `current` của nó để lưu trữ thông tin và đọc lại sau đó. Điều này có thể khiến bạn liên tưởng đến [state](/reference/react/useState), nhưng có một điểm khác biệt quan trọng.

**Thay đổi ref không kích hoạt việc kết xuất lại.** Điều này có nghĩa là ref rất phù hợp để lưu trữ thông tin không ảnh hưởng đến đầu ra trực quan của component. Ví dụ: nếu bạn cần lưu trữ một [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) và truy xuất nó sau đó, bạn có thể đặt nó vào một ref. Để cập nhật giá trị bên trong ref, bạn cần tự thay đổi thuộc tính <CodeStep step={2}>`current` property</CodeStep>:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

Sau đó, bạn có thể đọc interval ID đó từ ref để [clear that interval](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Bằng cách sử dụng ref, bạn đảm bảo rằng:

- Bạn có thể **lưu trữ thông tin** giữa các lần kết xuất lại (không giống các biến thông thường, vốn được đặt lại sau mỗi lần kết xuất).
- Việc thay đổi nó **không kích hoạt kết xuất lại** (không giống các biến state, vốn kích hoạt kết xuất lại).
- **Thông tin mang tính cục bộ** đối với mỗi bản sao của component (không giống các biến bên ngoài, vốn được dùng chung).

Việc thay đổi ref không kích hoạt kết xuất lại, vì vậy ref không phù hợp để lưu trữ thông tin mà bạn muốn hiển thị trên màn hình. Thay vào đó, hãy dùng state. Đọc thêm về [việc lựa chọn giữa `useRef` và `useState`.](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="Examples of referencing a value with useRef" titleId="examples-value">

#### Bộ đếm lượt nhấp {/*click-counter*/}

Component này sử dụng một ref để theo dõi số lần nút được nhấp. Lưu ý rằng trong trường hợp này, dùng ref thay vì state là hợp lý vì số lượt nhấp chỉ được đọc và ghi trong một event handler.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

Nếu bạn hiển thị `{ref.current}` trong JSX, con số sẽ không cập nhật khi nhấp. Điều này là do việc thiết lập `ref.current` không kích hoạt kết xuất lại. Thông tin được dùng cho việc kết xuất nên là state.

<Solution />

#### Đồng hồ bấm giờ {/*a-stopwatch*/}

Ví dụ này sử dụng kết hợp state và refs. Cả `startTime` và `now` đều là các biến state vì chúng được dùng cho việc kết xuất. Tuy nhiên, chúng ta cũng cần lưu giữ một [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) để có thể dừng interval khi nhấn nút. Vì interval ID không được dùng cho việc kết xuất, việc giữ nó trong một ref và tự cập nhật nó là phù hợp.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**Không được ghi _hoặc đọc_ `ref.current` trong quá trình kết xuất.**

React mong đợi phần thân component của bạn [hoạt động như một pure function](/learn/keeping-components-pure):

- Nếu các đầu vào ([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), và [context](/learn/passing-data-deeply-with-context)) giống nhau, nó phải trả về chính xác cùng một JSX.
- Việc gọi nó theo thứ tự khác hoặc với các đối số khác nhau không được ảnh hưởng đến kết quả của những lần gọi khác.

Việc đọc hoặc ghi ref **trong quá trình kết xuất** sẽ phá vỡ các kỳ vọng này.

```js {expectedErrors: {'react-compiler': [4]}} {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Don't write a ref during rendering
  myRef.current = 123;
  // ...
  // 🚩 Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}
```

Thay vào đó, bạn có thể đọc hoặc ghi refs **từ event handler hoặc effects**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Nếu bạn *phải* đọc [hoặc ghi](/reference/react/useState#storing-information-from-previous-renders) một giá trị trong quá trình kết xuất, [hãy dùng state](/reference/react/useState) thay thế.

Khi vi phạm các quy tắc này, component của bạn vẫn có thể hoạt động, nhưng hầu hết các tính năng mới hơn mà chúng tôi bổ sung vào React sẽ dựa trên những kỳ vọng này. Đọc thêm về [việc giữ cho component của bạn pure.](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

</Pitfall>

---

### Thao tác với DOM bằng ref {/*manipulating-the-dom-with-a-ref*/}

Việc sử dụng ref để thao tác với [DOM.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) là rất phổ biến. React có hỗ trợ tích hợp cho việc này.

Trước tiên, hãy khai báo một <CodeStep step={1}>ref object</CodeStep> với <CodeStep step={3}>initial value</CodeStep> là `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Sau đó, truyền đối tượng ref của bạn dưới dạng thuộc tính `ref` vào JSX của node DOM mà bạn muốn thao tác:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

Sau khi React tạo node DOM và đưa nó lên màn hình, React sẽ đặt thuộc tính <CodeStep step={2}>`current` property</CodeStep> của đối tượng ref thành node DOM đó. Giờ đây, bạn có thể truy cập `<input>`'s DOM node và gọi các phương thức như [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React sẽ đặt thuộc tính `current` trở lại thành `null` khi node bị xóa khỏi màn hình.

Đọc thêm về [việc thao tác với DOM bằng refs.](/learn/manipulating-the-dom-with-refs)

<Recipes titleText="Examples of manipulating the DOM with useRef" titleId="examples-dom">

#### Đưa input văn bản vào trạng thái focus {/*focusing-a-text-input*/}

Trong ví dụ này, việc nhấp vào nút sẽ đưa input vào trạng thái focus:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Cuộn hình ảnh vào vùng hiển thị {/*scrolling-an-image-into-view*/}

Trong ví dụ này, việc nhấp vào nút sẽ cuộn một hình ảnh vào vùng hiển thị. Ví dụ sử dụng một ref trỏ đến node DOM của danh sách, sau đó gọi API DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) để tìm hình ảnh mà chúng ta muốn cuộn đến.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // This line assumes a particular DOM structure:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Neo
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Millie
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Bella
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### Phát và tạm dừng video {/*playing-and-pausing-a-video*/}

Ví dụ này sử dụng một ref để gọi [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) và [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) trên một node DOM `<video>`.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### Exposing a ref to your own component {/*exposing-a-ref-to-your-own-component*/}

Đôi khi, bạn có thể muốn cho component cha thao tác với DOM bên trong component của mình. Ví dụ: bạn đang viết một component `MyInput`, nhưng muốn component cha có thể focus vào input (vốn không thể truy cập được từ component cha). Bạn có thể tạo một `ref` trong component cha và truyền `ref` dưới dạng prop cho component con. Đọc [hướng dẫn chi tiết](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) tại đây.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Tránh tạo lại nội dung của ref {/*avoiding-recreating-the-ref-contents*/}

React lưu giá trị ban đầu của ref một lần và bỏ qua giá trị đó trong các lần render tiếp theo.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Mặc dù kết quả của `new VideoPlayer()` chỉ được sử dụng cho lần render ban đầu, bạn vẫn đang gọi hàm này trong mỗi lần render. Điều này có thể gây lãng phí nếu hàm tạo ra các object tốn kém tài nguyên.

Để giải quyết vấn đề này, thay vào đó, bạn có thể khởi tạo ref như sau:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Thông thường, không được phép ghi hoặc đọc `ref.current` trong quá trình render. Tuy nhiên, trong trường hợp này thì được, vì kết quả luôn giống nhau và điều kiện chỉ được thực thi trong quá trình khởi tạo, nên hoàn toàn có thể dự đoán được.

<DeepDive>

#### Cách tránh kiểm tra null khi khởi tạo useRef sau này {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

Nếu bạn sử dụng type checker và không muốn luôn phải kiểm tra `null`, bạn có thể thử một pattern như sau:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Ở đây, bản thân `playerRef` có thể là nullable. Tuy nhiên, bạn có thể thuyết phục type checker của mình rằng không có trường hợp nào `getPlayer()` trả về `null`. Sau đó, hãy sử dụng `getPlayer()` trong các event handler.

</DeepDive>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi không thể lấy ref đến một component tùy chỉnh {/*i-cant-get-a-ref-to-a-custom-component*/}

Nếu bạn thử truyền một `ref` vào component của mình như sau:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

Bạn có thể nhận được lỗi sau trong console:

<ConsoleBlock level="error">

TypeError: Cannot read properties of null

</ConsoleBlock>

Theo mặc định, các component của bạn không expose ref đến những node DOM bên trong chúng.

Để khắc phục, hãy tìm component mà bạn muốn lấy ref:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

Sau đó, thêm `ref` vào danh sách các prop mà component của bạn chấp nhận và truyền `ref` dưới dạng prop cho [component tích hợp sẵn](/reference/react-dom/components/common) tương ứng như sau:

```js {1,6}
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

Sau đó, component cha có thể lấy ref đến nó.

Đọc thêm về [cách truy cập các node DOM của component khác.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)