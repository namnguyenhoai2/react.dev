---
title: forwardRef
---

<Deprecated>

Trong React 19, `forwardRef` không còn cần thiết nữa. Thay vào đó, hãy truyền `ref` dưới dạng prop.

`forwardRef` sẽ bị deprecated trong một bản phát hành trong tương lai. Tìm hiểu thêm [tại đây](/blog/2024/04/25/react-19#ref-as-a-prop).

</Deprecated>

<Intro>

`forwardRef` cho phép component của bạn expose một DOM node cho component cha bằng một [ref.](/learn/manipulating-the-dom-with-refs)

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Gọi `forwardRef()` để cho phép component của bạn nhận một ref và chuyển tiếp ref đó đến component con:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `render`: Hàm render cho component của bạn. React gọi hàm này với props và `ref` mà component của bạn nhận được từ component cha. JSX bạn trả về sẽ là output của component.

#### Giá trị trả về {/*returns*/}

`forwardRef` trả về một React component mà bạn có thể render trong JSX. Không giống các React component được định nghĩa dưới dạng các hàm thông thường, component được `forwardRef` trả về cũng có thể nhận một prop `ref`.

#### Lưu ý {/*caveats*/}

* Trong Strict Mode, React sẽ **gọi hàm render của bạn hai lần** để [giúp bạn phát hiện các tính không thuần (impurity) vô tình.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Đây là hành vi chỉ xảy ra trong môi trường development và không ảnh hưởng đến production. Nếu hàm render của bạn là pure (như yêu cầu), điều này sẽ không ảnh hưởng đến logic của component. Kết quả từ một trong hai lần gọi sẽ bị bỏ qua.

---

### Hàm `render` {/*render-function*/}

`forwardRef` nhận một hàm render làm đối số. React gọi hàm này với `props` và `ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Tham số {/*render-parameters*/}

* `props`: Các props do component cha truyền vào.

* `ref`: Thuộc tính `ref` do component cha truyền vào. `ref` có thể là một object hoặc một function. Nếu component cha không truyền ref, giá trị này sẽ là `null`. Bạn nên truyền `ref` nhận được đến một component khác hoặc truyền nó đến [`useImperativeHandle`.](/reference/react/useImperativeHandle)

#### Giá trị trả về {/*render-returns*/}

`forwardRef` trả về một React component mà bạn có thể render trong JSX. Không giống các React component được định nghĩa dưới dạng các hàm thông thường, component do `forwardRef` trả về có thể nhận prop `ref`.

---

## Cách sử dụng {/*usage*/}

### Expose một DOM node cho component cha {/*exposing-a-dom-node-to-the-parent-component*/}

Theo mặc định, các DOM node của mỗi component là private. Tuy nhiên, đôi khi việc expose một DOM node cho component cha sẽ hữu ích--ví dụ, để cho phép focus vào node đó. Để bật tính năng này, hãy bọc định nghĩa component của bạn trong `forwardRef()`:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Bạn sẽ nhận được một <CodeStep step={1}>ref</CodeStep> dưới dạng đối số thứ hai sau props. Hãy truyền ref đó đến DOM node mà bạn muốn expose:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Điều này cho phép component cha `Form` truy cập vào <CodeStep step={2}>`<input>` DOM node</CodeStep> được expose bởi `MyInput`:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Component `Form` này [truyền một ref](/reference/react/useRef#manipulating-the-dom-with-a-ref) đến `MyInput`. Component `MyInput` *chuyển tiếp* ref đó đến thẻ trình duyệt `<input>`. Vì vậy, component `Form` có thể truy cập DOM node `<input>` đó và gọi [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) trên node này.

Hãy nhớ rằng việc expose ref đến DOM node bên trong component sẽ khiến việc thay đổi phần implementation bên trong của component sau này trở nên khó khăn hơn. Thông thường, bạn sẽ expose DOM node từ các component cấp thấp có thể tái sử dụng như button hoặc text input, nhưng sẽ không làm vậy với các component cấp ứng dụng như avatar hoặc comment.

<Recipes titleText="Examples of forwarding a ref">

#### Focus vào text input {/*focusing-a-text-input*/}

Khi nhấp vào button, input sẽ được focus. Component `Form` định nghĩa một ref và truyền ref đó đến component `MyInput`. Component `MyInput` chuyển tiếp ref đó đến `<input>` của trình duyệt. Điều này cho phép component `Form` focus vào `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Phát và tạm dừng video {/*playing-and-pausing-a-video*/}

Khi nhấp vào button, lệnh này sẽ gọi [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) và [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) trên một DOM node `<video>`. Component `App` định nghĩa một ref và truyền ref đó đến component `MyVideoPlayer`. Component `MyVideoPlayer` chuyển tiếp ref đó đến node `<video>` của trình duyệt. Điều này cho phép component `App` phát và tạm dừng `<video>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Chuyển tiếp ref qua nhiều component {/*forwarding-a-ref-through-multiple-components*/}

Thay vì chuyển tiếp một `ref` đến DOM node, bạn có thể chuyển tiếp nó đến component của riêng mình như `MyInput`:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Nếu component `MyInput` đó chuyển tiếp ref đến `<input>` của nó, ref đến `FormField` sẽ cung cấp cho bạn `<input>` đó:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Component `Form` định nghĩa một ref và truyền ref đó đến `FormField`. Component `FormField` chuyển tiếp ref đó đến `MyInput`, rồi component này chuyển tiếp nó đến một DOM node `<input>` của trình duyệt. Đây là cách `Form` truy cập DOM node đó.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### Expose imperative handle thay vì DOM node {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Thay vì expose toàn bộ DOM node, bạn có thể expose một object tùy chỉnh, gọi là một *imperative handle*, với tập hợp các method bị giới hạn hơn. Để làm vậy, bạn cần định nghĩa một ref riêng để giữ DOM node:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Truyền `ref` mà bạn đã nhận được đến [`useImperativeHandle`](/reference/react/useImperativeHandle) và chỉ định giá trị mà bạn muốn expose cho `ref`:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Nếu một component nào đó nhận được ref đến `MyInput`, nó sẽ chỉ nhận object `{ focus, scrollIntoView }` của bạn thay vì DOM node. Điều này cho phép bạn giới hạn thông tin expose về DOM node ở mức tối thiểu.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[Đọc thêm về cách sử dụng imperative handle.](/reference/react/useImperativeHandle)

<Pitfall>

**Không nên lạm dụng ref.** Bạn chỉ nên sử dụng ref cho các hành vi *imperative* mà bạn không thể biểu đạt bằng props: ví dụ như cuộn đến một node, focus vào một node, kích hoạt animation, chọn văn bản, v.v.

**Nếu bạn có thể biểu đạt điều gì đó bằng prop, bạn không nên sử dụng ref.** Ví dụ, thay vì expose một imperative handle như `{ open, close }` từ một component `Modal`, tốt hơn là nhận `isOpen` dưới dạng một prop như `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) có thể giúp bạn expose các hành vi imperative thông qua props.

</Pitfall>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Component của tôi được bọc trong `forwardRef`, nhưng `ref` của nó luôn là `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Điều này thường có nghĩa là bạn đã quên thực sự sử dụng `ref` mà mình nhận được.

Ví dụ: component này không làm gì với `ref` của nó:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Để khắc phục, hãy truyền `ref` xuống một DOM node hoặc component khác có thể nhận ref:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

`ref` đến `MyInput` cũng có thể là `null` nếu một phần logic có điều kiện:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Nếu `showInput` là `false`, ref sẽ không được chuyển tiếp đến bất kỳ node nào và ref đến `MyInput` sẽ vẫn trống. Điều này đặc biệt dễ bỏ sót nếu điều kiện được ẩn bên trong một component khác, như `Panel` trong ví dụ này:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```