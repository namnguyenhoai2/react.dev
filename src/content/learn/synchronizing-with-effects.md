---
title: 'Đồng bộ hóa với Effects'
---

<Intro>

Một số component cần đồng bộ hóa với các hệ thống bên ngoài. Ví dụ, bạn có thể muốn điều khiển một component không phải React dựa trên state của React, thiết lập kết nối đến máy chủ hoặc gửi nhật ký analytics khi một component xuất hiện trên màn hình. *Effects* cho phép bạn chạy một đoạn code sau khi render để đồng bộ hóa component của bạn với một hệ thống nào đó bên ngoài React.

</Intro>

<YouWillLearn>

- Effects là gì
- Effects khác với event như thế nào
- Cách khai báo Effect trong component
- Cách tránh chạy lại Effect không cần thiết
- Vì sao Effects chạy hai lần trong môi trường development và cách khắc phục

</YouWillLearn>

## Effects là gì và chúng khác với event như thế nào? {/*what-are-effects-and-how-are-they-different-from-events*/}

Trước khi tìm hiểu về Effects, bạn cần quen thuộc với hai loại logic bên trong các component React:

- **Code rendering** (được giới thiệu trong [Mô tả UI](/learn/describing-the-ui)) nằm ở cấp cao nhất của component. Đây là nơi bạn nhận props và state, biến đổi chúng rồi trả về JSX mà bạn muốn hiển thị trên màn hình. [Code rendering phải thuần túy.](/learn/keeping-components-pure) Giống như một công thức toán học, code chỉ nên _tính toán_ kết quả, không làm bất kỳ việc gì khác.

- **Event handler** (được giới thiệu trong [Thêm tính tương tác](/learn/adding-interactivity)) là các hàm lồng bên trong component, thực hiện các hành động thay vì chỉ tính toán. Một event handler có thể cập nhật trường input, gửi HTTP POST request để mua một sản phẩm hoặc điều hướng người dùng đến màn hình khác. Event handler chứa ["side effect"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) (chúng thay đổi state của chương trình) do một hành động cụ thể của người dùng gây ra (ví dụ: click vào button hoặc nhập nội dung).

Đôi khi như vậy vẫn chưa đủ. Hãy xem xét một component `ChatRoom` phải kết nối đến chat server bất cứ khi nào nó hiển thị trên màn hình. Kết nối đến server không phải là một phép tính thuần túy (đó là một side effect), vì vậy không thể thực hiện trong quá trình rendering. Tuy nhiên, không có một event cụ thể nào, chẳng hạn như thao tác click, khiến `ChatRoom` được hiển thị.

***Effects* cho phép bạn chỉ định các side effect do chính việc rendering gây ra, thay vì do một event cụ thể.** Việc gửi tin nhắn trong chat là một *event* vì nó được gây ra trực tiếp bởi việc người dùng click vào một button cụ thể. Tuy nhiên, thiết lập kết nối đến server là một *Effect* vì nó phải xảy ra bất kể tương tác nào khiến component xuất hiện. Effects chạy ở cuối [commit](/learn/render-and-commit) sau khi màn hình được cập nhật. Đây là thời điểm phù hợp để đồng bộ hóa các component React với một hệ thống bên ngoài (chẳng hạn như network hoặc thư viện bên thứ ba).

<Note>

Trong phần này và các phần sau, "Effect" viết hoa đề cập đến định nghĩa dành riêng cho React ở trên, tức là một side effect do việc rendering gây ra. Để nói về khái niệm rộng hơn trong lập trình, chúng ta sẽ dùng "side effect".

</Note>

## Có thể bạn không cần Effect {/*you-might-not-need-an-effect*/}

**Đừng vội thêm Effects vào component của bạn.** Hãy nhớ rằng Effects thường được dùng để "bước ra" khỏi code React và đồng bộ hóa với một *hệ thống* bên ngoài. Hệ thống này có thể là browser API, widget bên thứ ba, network, v.v. Nếu Effect của bạn chỉ điều chỉnh một state dựa trên state khác, [có thể bạn không cần Effect.](/learn/you-might-not-need-an-effect)

## Cách viết một Effect {/*how-to-write-an-effect*/}

Để viết một Effect, hãy làm theo ba bước sau:

1. **Khai báo một Effect.** Theo mặc định, Effect của bạn sẽ chạy sau mỗi [commit](/learn/render-and-commit).
2. **Chỉ định dependencies của Effect.** Hầu hết Effects chỉ nên chạy lại *khi cần thiết*, thay vì sau mỗi lần render. Ví dụ, animation fade-in chỉ nên được kích hoạt khi component xuất hiện. Việc kết nối và ngắt kết nối với một chat room chỉ nên xảy ra khi component xuất hiện và biến mất, hoặc khi chat room thay đổi. Bạn sẽ tìm hiểu cách kiểm soát điều này bằng cách chỉ định các *dependencies*.
3. **Thêm cleanup nếu cần.** Một số Effects cần chỉ định cách dừng, hoàn tác hoặc dọn dẹp bất cứ việc gì chúng đã thực hiện. Ví dụ, "connect" cần "disconnect", "subscribe" cần "unsubscribe", còn "fetch" cần "cancel" hoặc "ignore". Bạn sẽ tìm hiểu cách thực hiện việc này bằng cách trả về một *cleanup function*.

Hãy cùng xem chi tiết từng bước.

### Bước 1: Khai báo một Effect {/*step-1-declare-an-effect*/}

Để khai báo một Effect trong component, hãy import [`useEffect` Hook](/reference/react/useEffect) từ React:

```js
import { useEffect } from 'react';
```

Sau đó, gọi Hook này ở cấp cao nhất của component và đặt một đoạn code bên trong Effect:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
  });
  return <div />;
}
```

Mỗi khi component render, React sẽ cập nhật màn hình *sau đó* chạy code bên trong `useEffect`. Nói cách khác, **`useEffect` "trì hoãn" việc chạy một đoạn code cho đến khi kết quả của lần render đó được phản ánh trên màn hình.**

Hãy xem cách bạn có thể dùng Effect để đồng bộ hóa với một hệ thống bên ngoài. Hãy xét một component React `<VideoPlayer>`. Sẽ rất hữu ích nếu có thể điều khiển việc component này đang phát hay tạm dừng bằng cách truyền một prop `isPlaying` cho nó:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

Component `VideoPlayer` tùy chỉnh của bạn render thẻ [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) tích hợp sẵn của trình duyệt:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

Tuy nhiên, thẻ `<video>` của trình duyệt không có prop `isPlaying`. Cách duy nhất để điều khiển nó là gọi thủ công các phương thức [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) và [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) trên phần tử DOM. **Bạn cần đồng bộ hóa giá trị của prop `isPlaying`, cho biết video hiện tại _nên_ đang phát hay không, với các lệnh gọi như `play()` và `pause()`.**

Trước tiên, chúng ta cần [lấy một ref](/learn/manipulating-the-dom-with-refs) đến node DOM `<video>`.

Bạn có thể muốn thử gọi `play()` hoặc `pause()` trong quá trình rendering, nhưng làm vậy là không đúng:

<Sandpack>

```js {expectedErrors: {'react-compiler': [7, 9]}}
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Calling these while rendering isn't allowed.
  } else {
    ref.current.pause(); // Also, this crashes.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Lý do đoạn code này không đúng là vì nó cố thực hiện một thao tác với node DOM trong quá trình rendering. Trong React, [rendering phải là một phép tính thuần túy](/learn/keeping-components-pure) của JSX và không được chứa các side effect như sửa đổi DOM.

Hơn nữa, khi `VideoPlayer` được gọi lần đầu, DOM của nó vẫn chưa tồn tại! Chưa có node DOM nào để gọi `play()` hoặc `pause()`, vì React chưa biết cần tạo DOM nào cho đến khi bạn trả về JSX.

Giải pháp ở đây là **bọc side effect bằng `useEffect` để đưa nó ra khỏi phép tính rendering:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

Bằng cách bọc phần cập nhật DOM trong một Effect, bạn cho phép React cập nhật màn hình trước. Sau đó Effect của bạn sẽ chạy.

Khi component `VideoPlayer` render (dù là lần đầu hay do render lại), một vài việc sẽ xảy ra. Trước tiên, React sẽ cập nhật màn hình, đảm bảo thẻ `<video>` nằm trong DOM với các prop phù hợp. Sau đó React sẽ chạy Effect của bạn. Cuối cùng, Effect sẽ gọi `play()` hoặc `pause()` tùy thuộc vào giá trị của `isPlaying`.

Hãy nhấn Play/Pause nhiều lần và xem trình phát video luôn được đồng bộ với giá trị `isPlaying` như thế nào:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Trong ví dụ này, "hệ thống bên ngoài" mà bạn đồng bộ với state của React là media API của trình duyệt. Bạn có thể dùng cách tiếp cận tương tự để bọc code cũ không phải React (chẳng hạn như các plugin jQuery) vào các component React mang tính khai báo.

Lưu ý rằng trên thực tế, việc điều khiển trình phát video phức tạp hơn nhiều. Lệnh gọi `play()` có thể thất bại, người dùng có thể phát hoặc tạm dừng bằng các điều khiển tích hợp sẵn của trình duyệt, v.v. Ví dụ này đã được đơn giản hóa rất nhiều và chưa hoàn chỉnh.

<Pitfall>

Theo mặc định, Effects chạy sau *mỗi* lần render. Vì vậy, code như sau sẽ **tạo ra một vòng lặp vô hạn:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effects chạy như một *kết quả* của việc rendering. Việc set state *kích hoạt* rendering. Set state ngay lập tức trong một Effect giống như cắm một ổ điện vào chính nó. Effect chạy, set state, việc này gây ra render lại, khiến Effect chạy, Effect lại set state, việc này gây ra một lần render lại khác, cứ thế tiếp diễn.

Effects thường nên đồng bộ hóa component của bạn với một *hệ thống bên ngoài*. Nếu không có hệ thống bên ngoài nào và bạn chỉ muốn điều chỉnh một state dựa trên state khác, [có thể bạn không cần Effect.](/learn/you-might-not-need-an-effect)

</Pitfall>

### Bước 2: Chỉ định dependencies của Effect {/*step-2-specify-the-effect-dependencies*/}

Theo mặc định, Effects chạy sau *mỗi* lần render. Thông thường, đây **không phải điều bạn muốn:**

- Đôi khi, thao tác này chậm. Việc đồng bộ hóa với một hệ thống bên ngoài không phải lúc nào cũng diễn ra ngay lập tức, vì vậy bạn có thể muốn bỏ qua thao tác này nếu không cần thiết. Ví dụ, bạn không muốn kết nối lại với máy chủ chat sau mỗi lần nhấn phím.
- Đôi khi, thao tác này không phù hợp. Ví dụ, bạn không muốn kích hoạt animation fade-in của component sau mỗi lần nhấn phím. Animation chỉ nên phát một lần khi component xuất hiện lần đầu.

Để minh họa vấn đề, dưới đây là ví dụ trước đó với một vài lần gọi `console.log` và một ô nhập văn bản cập nhật state của component cha. Hãy chú ý rằng việc nhập liệu khiến Effect chạy lại:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Bạn có thể yêu cầu React **bỏ qua việc chạy lại Effect không cần thiết** bằng cách chỉ định một mảng *dependency* làm đối số thứ hai cho lệnh gọi `useEffect`. Trước tiên, hãy thêm một mảng `[]` rỗng vào ví dụ trên ở dòng 14:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

Bạn sẽ thấy một lỗi có nội dung `React Hook useEffect has a missing dependency: 'isPlaying'`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // This causes an error

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Vấn đề là code bên trong Effect của bạn *phụ thuộc vào* prop `isPlaying` để quyết định cần làm gì, nhưng dependency này chưa được khai báo rõ ràng. Để khắc phục vấn đề, hãy thêm `isPlaying` vào mảng dependency:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
```

Bây giờ tất cả dependency đã được khai báo, nên không còn lỗi. Việc chỉ định `[isPlaying]` làm mảng dependency cho React biết rằng nó nên bỏ qua việc chạy lại Effect nếu `isPlaying` giống hệt giá trị trong lần render trước. Với thay đổi này, việc nhập vào ô input không khiến Effect chạy lại, nhưng nhấn Play/Pause thì có:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Mảng dependency có thể chứa nhiều dependency. React chỉ bỏ qua việc chạy lại Effect nếu *tất cả* dependency bạn chỉ định đều có giá trị hoàn toàn giống với lần render trước. React so sánh các giá trị dependency bằng phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Xem tài liệu tham khảo [`useEffect`reference](/reference/react/useEffect#reference) để biết thêm chi tiết.

**Lưu ý rằng bạn không thể “chọn” dependency.** Bạn sẽ nhận được lỗi lint nếu các dependency bạn chỉ định không khớp với những gì React mong đợi dựa trên code bên trong Effect. Điều này giúp phát hiện nhiều lỗi trong code của bạn. Nếu bạn không muốn một đoạn code nào đó chạy lại, [*hãy chỉnh sửa chính đoạn code của Effect* để nó không “cần” dependency đó.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

Hành vi khi không có mảng dependency và khi có một mảng dependency `[]` *rỗng* là khác nhau:

```js {3,7,11}
useEffect(() => {
  // This runs after every render
});

useEffect(() => {
  // This runs only on mount (when the component appears)
}, []);

useEffect(() => {
  // This runs on mount *and also* if either a or b have changed since the last render
}, [a, b]);
```

Chúng ta sẽ xem xét kỹ hơn ý nghĩa của “mount” ở bước tiếp theo.

</Pitfall>

<DeepDive>

#### Tại sao ref bị bỏ qua khỏi mảng dependency? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

Effect này sử dụng _cả_ `ref` và `isPlaying`, nhưng chỉ `isPlaying` được khai báo là dependency:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

Đó là vì object `ref` có *identity ổn định:* React đảm bảo [bạn sẽ luôn nhận được cùng một object](/reference/react/useRef#returns) từ cùng một lần gọi `useRef` trong mỗi lần render. Nó không bao giờ thay đổi, nên bản thân nó sẽ không bao giờ khiến Effect chạy lại. Vì vậy, việc bạn có đưa nó vào hay không không quan trọng. Đưa nó vào cũng hoàn toàn ổn:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

Các [`set` function](/reference/react/useState#setstate) được `useState` trả về cũng có identity ổn định, vì vậy bạn sẽ thường thấy chúng được bỏ qua khỏi dependency. Nếu linter cho phép bạn bỏ qua một dependency mà không báo lỗi thì việc đó an toàn.

Việc bỏ qua các dependency luôn ổn định chỉ hiệu quả khi linter có thể “nhìn thấy” rằng object đó ổn định. Ví dụ, nếu `ref` được truyền từ component cha, bạn sẽ phải chỉ định nó trong mảng dependency. Tuy nhiên, điều này là hợp lý vì bạn không thể biết component cha luôn truyền cùng một ref hay truyền một trong số nhiều ref tùy theo điều kiện. Vì vậy, Effect của bạn _sẽ_ phụ thuộc vào ref được truyền vào.

</DeepDive>

### Bước 3: Thêm cleanup nếu cần {/*step-3-add-cleanup-if-needed*/}

Hãy xem xét một ví dụ khác. Bạn đang viết một component `ChatRoom` cần kết nối với máy chủ chat khi xuất hiện. Bạn được cung cấp một API `createConnection()` trả về một object có các method `connect()` và `disconnect()`. Làm thế nào để giữ cho component luôn được kết nối trong khi nó được hiển thị với người dùng?

Trước tiên, hãy viết logic của Effect:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

Việc kết nối với chat sau mỗi lần re-render sẽ chậm, vì vậy bạn thêm mảng dependency:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Code bên trong Effect không sử dụng bất kỳ prop hoặc state nào, nên mảng dependency của bạn là `[]` (rỗng). Điều này cho React biết chỉ chạy code này khi component “mount”, tức là xuất hiện trên màn hình lần đầu tiên.**

Hãy thử chạy code này:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Effect này chỉ chạy khi mount, nên bạn có thể mong đợi `"✅ Connecting..."` được in một lần trong console. **Tuy nhiên, nếu kiểm tra console, `"✅ Connecting..."` lại được in hai lần. Tại sao điều này xảy ra?**

Hãy hình dung component `ChatRoom` là một phần của một ứng dụng lớn hơn với nhiều màn hình khác nhau. Người dùng bắt đầu hành trình của họ trên trang `ChatRoom`. Component được mount và gọi `connection.connect()`. Sau đó, hãy hình dung người dùng chuyển sang một màn hình khác--chẳng hạn như trang Settings. Component `ChatRoom` bị unmount. Cuối cùng, người dùng nhấn Back và `ChatRoom` được mount lại. Thao tác này sẽ thiết lập kết nối thứ hai--nhưng kết nối đầu tiên chưa bao giờ bị hủy! Khi người dùng di chuyển qua lại trong ứng dụng, các kết nối sẽ tiếp tục chồng chất.

Những lỗi như vậy rất dễ bị bỏ sót nếu không kiểm thử thủ công kỹ lưỡng. Để giúp bạn nhanh chóng phát hiện chúng, trong môi trường development, React sẽ remount mỗi component một lần ngay sau lần mount ban đầu.

Việc log `"✅ Connecting..."` xuất hiện hai lần giúp bạn nhận ra vấn đề thực sự: code của bạn không đóng kết nối khi component unmount.

Để khắc phục vấn đề, hãy return một *cleanup function* từ Effect:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React sẽ gọi cleanup function của bạn mỗi lần trước khi Effect chạy lại, và gọi thêm một lần cuối khi component unmount (bị xóa). Hãy xem điều gì xảy ra khi cleanup function được triển khai:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Bây giờ bạn nhận được ba log trong console ở môi trường development:

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**Đây là hành vi chính xác trong môi trường development.** Bằng cách remount component của bạn, React xác minh rằng việc điều hướng đi rồi quay lại sẽ không làm hỏng code. Ngắt kết nối rồi kết nối lại chính xác là điều nên xảy ra! Khi bạn triển khai cleanup tốt, người dùng sẽ không nhận thấy sự khác biệt giữa việc chạy Effect một lần và việc chạy Effect, cleanup rồi chạy lại. Có thêm một cặp lời gọi connect/disconnect vì React đang kiểm tra code của bạn để tìm lỗi trong môi trường development. Đây là điều bình thường--đừng cố loại bỏ nó!

**Trong môi trường production, bạn sẽ chỉ thấy `"✅ Connecting..."` được in một lần.** Việc remount component chỉ xảy ra trong môi trường development để giúp bạn tìm ra những Effect cần cleanup. Bạn có thể tắt [Strict Mode](/reference/react/StrictMode) để không áp dụng hành vi trong development, nhưng chúng tôi khuyến nghị nên giữ nguyên. Điều này giúp bạn tìm ra nhiều lỗi giống như lỗi trên.

## Làm thế nào để xử lý việc Effect chạy hai lần trong môi trường development? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React cố ý remount component của bạn trong môi trường development để tìm những lỗi như trong ví dụ trước. **Câu hỏi đúng không phải là “làm thế nào để chạy Effect một lần”, mà là “làm thế nào để sửa Effect để nó hoạt động sau khi được remount”.**

Thông thường, câu trả lời là triển khai cleanup function. Cleanup function phải dừng hoặc hoàn tác bất cứ điều gì mà Effect đã thực hiện. Nguyên tắc chung là người dùng không thể phân biệt được giữa việc Effect chạy một lần (như trong production) và chuỗi _setup → cleanup → setup_ (như bạn thấy trong development).

Hầu hết các Effect bạn viết sẽ phù hợp với một trong những mẫu phổ biến dưới đây.

<Pitfall>

#### Không sử dụng ref để ngăn Effect chạy {/*dont-use-refs-to-prevent-effects-from-firing*/}

Một lỗi thường gặp khi ngăn Effect chạy hai lần trong môi trường development là sử dụng `ref` để ngăn Effect chạy nhiều hơn một lần. Ví dụ, bạn có thể “sửa” lỗi trên bằng `useRef`:

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 This wont fix the bug!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

Cách này khiến bạn chỉ thấy `"✅ Connecting..."` một lần trong môi trường development, nhưng không khắc phục được lỗi.

Khi người dùng điều hướng đi, kết nối vẫn không được đóng; và khi họ quay lại, một kết nối mới được tạo ra. Khi người dùng di chuyển qua lại trong ứng dụng, các kết nối sẽ tiếp tục chồng chất, giống hệt như trước khi có “bản sửa”.

Để khắc phục lỗi, chỉ làm cho Effect chạy một lần là chưa đủ. Effect phải hoạt động được sau khi remount, nghĩa là kết nối cần được cleanup như trong giải pháp ở trên.

Xem các ví dụ dưới đây để biết cách xử lý những mẫu thường gặp.

</Pitfall>

### Kiểm soát các widget không phải React {/*controlling-non-react-widgets*/}

Đôi khi bạn cần thêm các UI widget không được viết bằng React. Ví dụ, giả sử bạn đang thêm một component bản đồ vào trang. Component này có phương thức `setZoomLevel()`, và bạn muốn giữ mức thu phóng đồng bộ với biến state `zoomLevel` trong mã React. Effect của bạn sẽ trông tương tự như sau:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Lưu ý rằng trong trường hợp này không cần cleanup. Trong development, React sẽ gọi Effect hai lần, nhưng đây không phải vấn đề vì việc gọi `setZoomLevel` hai lần với cùng một giá trị sẽ không làm gì cả. Có thể sẽ chậm hơn một chút, nhưng điều này không đáng kể vì trong production, component sẽ không bị remount không cần thiết.

Một số API có thể không cho phép bạn gọi chúng hai lần liên tiếp. Ví dụ, phương thức [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) của phần tử [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) tích hợp sẵn sẽ báo lỗi nếu bạn gọi nó hai lần. Hãy triển khai hàm cleanup và để hàm này đóng dialog:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

Trong development, Effect của bạn sẽ gọi `showModal()`, sau đó ngay lập tức gọi `close()`, rồi lại gọi `showModal()`. Điều này có cùng hành vi có thể quan sát từ phía người dùng như việc chỉ gọi `showModal()` một lần, giống như trong production.

### Đăng ký sự kiện {/*subscribing-to-events*/}

Nếu Effect đăng ký theo dõi một thứ gì đó, hàm cleanup nên hủy đăng ký:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Trong development, Effect của bạn sẽ gọi `addEventListener()`, sau đó ngay lập tức gọi `removeEventListener()`, rồi lại gọi `addEventListener()` với cùng một handler. Vì vậy, tại một thời điểm sẽ chỉ có một subscription đang hoạt động. Điều này có cùng hành vi có thể quan sát từ phía người dùng như việc chỉ gọi `addEventListener()` một lần, giống như trong production.

### Kích hoạt animation {/*triggering-animations*/}

Nếu Effect tạo animation cho một thứ gì đó xuất hiện, hàm cleanup nên đặt lại animation về các giá trị ban đầu:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

Trong development, opacity sẽ được đặt thành `1`, sau đó thành `0`, rồi lại thành `1`. Điều này phải có cùng hành vi có thể quan sát từ phía người dùng như việc đặt trực tiếp thành `1`, vốn là điều sẽ xảy ra trong production. Nếu bạn sử dụng thư viện animation của bên thứ ba có hỗ trợ tweening, hàm cleanup nên đặt timeline về trạng thái ban đầu.

### Fetch dữ liệu {/*fetching-data*/}

Nếu Effect fetch một thứ gì đó, hàm cleanup nên [hủy fetch](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) hoặc bỏ qua kết quả của nó:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

Bạn không thể “hoàn tác” một network request đã xảy ra, nhưng hàm cleanup nên đảm bảo rằng fetch _không còn liên quan_ sẽ không tiếp tục ảnh hưởng đến ứng dụng. Nếu `userId` thay đổi từ `'Alice'` sang `'Bob'`, cleanup sẽ đảm bảo rằng response của `'Alice'` bị bỏ qua, ngay cả khi nó đến sau `'Bob'`.

**Trong development, bạn sẽ thấy hai fetch trong tab Network.** Điều đó hoàn toàn bình thường. Với cách tiếp cận trên, Effect đầu tiên sẽ được cleanup ngay lập tức, nên bản sao biến `ignore` của nó sẽ được đặt thành `true`. Vì vậy, dù có thêm một request, nó cũng sẽ không ảnh hưởng đến state nhờ kiểm tra `if (!ignore)`.

**Trong production, sẽ chỉ có một request.** Nếu request thứ hai trong development khiến bạn khó chịu, cách tiếp cận tốt nhất là sử dụng một giải pháp loại bỏ các request trùng lặp và cache response giữa các component:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

Điều này không chỉ cải thiện trải nghiệm development mà còn khiến ứng dụng của bạn có cảm giác nhanh hơn. Ví dụ, khi người dùng nhấn nút Back, họ sẽ không phải chờ dữ liệu tải lại vì dữ liệu đã được cache. Bạn có thể tự xây dựng cache như vậy hoặc sử dụng một trong nhiều giải pháp thay thế cho việc fetch thủ công trong Effects.

<DeepDive>

#### Những lựa chọn thay thế tốt cho việc fetch dữ liệu trong Effects là gì? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Việc viết các lời gọi `fetch` bên trong Effects là một [cách phổ biến để fetch dữ liệu](https://www.robinwieruch.de/react-hooks-fetch-data/), đặc biệt trong các ứng dụng hoàn toàn chạy ở client. Tuy nhiên, đây là một cách tiếp cận rất thủ công và có những nhược điểm đáng kể:

- **Effects không chạy trên server.** Điều này có nghĩa là HTML được render ban đầu trên server sẽ chỉ bao gồm trạng thái loading mà không có dữ liệu. Máy tính client sẽ phải tải xuống toàn bộ JavaScript và render ứng dụng, rồi mới phát hiện rằng bây giờ nó cần tải dữ liệu. Điều này không thực sự hiệu quả.
- **Fetch trực tiếp trong Effects dễ tạo ra “network waterfall”.** Bạn render component cha, component này fetch một số dữ liệu, render các component con, rồi các component con mới bắt đầu fetch dữ liệu của chúng. Nếu network không đủ nhanh, cách này sẽ chậm hơn đáng kể so với việc fetch toàn bộ dữ liệu song song.
- **Fetch trực tiếp trong Effects thường có nghĩa là bạn không preload hoặc cache dữ liệu.** Ví dụ, nếu component unmount rồi mount lại, nó sẽ phải fetch dữ liệu một lần nữa.
- **Cách này không thực sự thuận tiện.** Có khá nhiều boilerplate code khi viết các lời gọi `fetch` theo cách không gặp những lỗi như [race condition.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Danh sách nhược điểm này không chỉ áp dụng cho React. Nó áp dụng cho việc fetch dữ liệu khi mount bằng bất kỳ library nào. Cũng như routing, fetch dữ liệu không dễ thực hiện tốt, vì vậy chúng tôi khuyến nghị các cách tiếp cận sau:

- **Nếu bạn sử dụng một [framework](/learn/creating-a-react-app#full-stack-frameworks), hãy sử dụng cơ chế fetch dữ liệu tích hợp sẵn của framework đó.** Các React framework hiện đại có những cơ chế fetch dữ liệu được tích hợp, hoạt động hiệu quả và không gặp các vấn đề nêu trên.
- **Nếu không, hãy cân nhắc sử dụng hoặc xây dựng một client-side cache.** Các giải pháp open source phổ biến gồm [TanStack Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), và [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Bạn cũng có thể tự xây dựng giải pháp của mình. Khi đó, bạn sẽ sử dụng Effects ở bên dưới, nhưng bổ sung logic để loại bỏ các request trùng lặp, cache response và tránh network waterfall (bằng cách preload dữ liệu hoặc đưa các yêu cầu dữ liệu lên route).

Bạn vẫn có thể tiếp tục fetch dữ liệu trực tiếp trong Effects nếu cả hai cách tiếp cận này đều không phù hợp với bạn.

</DeepDive>

### Gửi analytics {/*sending-analytics*/}

Hãy xem đoạn code gửi một analytics event khi truy cập trang dưới đây:

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

Trong development, `logVisit` sẽ được gọi hai lần cho mỗi URL, vì vậy bạn có thể muốn tìm cách khắc phục điều đó. **Chúng tôi khuyến nghị giữ nguyên code này.** Giống như các ví dụ trước, không có khác biệt *có thể quan sát từ phía người dùng* giữa việc chạy một lần và chạy hai lần. Về mặt thực tế, `logVisit` không nên làm gì trong development vì bạn không muốn log từ các máy development làm sai lệch các metric trong production. Component của bạn sẽ remount mỗi lần bạn lưu file, nên dù sao nó cũng log thêm các lượt truy cập trong development.

**Trong production, sẽ không có log truy cập trùng lặp.**

Để debug các analytics event bạn đang gửi, bạn có thể deploy ứng dụng lên môi trường staging (chạy ở production mode) hoặc tạm thời tắt [Strict Mode](/reference/react/StrictMode) và các kiểm tra remount chỉ có trong development. Bạn cũng có thể gửi analytics từ các event handler thay đổi route thay vì từ Effects. Để có analytics chính xác hơn, [intersection observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) có thể giúp theo dõi component nào đang nằm trong viewport và chúng hiển thị trong bao lâu.

### Không phải Effect: Khởi tạo ứng dụng {/*not-an-effect-initializing-the-application*/}

Một số logic chỉ nên chạy một lần khi ứng dụng khởi động. Bạn có thể đặt logic đó bên ngoài các component:

```js {2-3}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Điều này đảm bảo logic đó chỉ chạy một lần sau khi trình duyệt tải trang.

### Không phải Effect: Mua sản phẩm {/*not-an-effect-buying-a-product*/}

Đôi khi, ngay cả khi bạn viết một hàm cleanup, vẫn không có cách nào ngăn các hệ quả mà người dùng có thể nhìn thấy khi Effect chạy hai lần. Ví dụ, có thể Effect của bạn gửi một POST request để mua sản phẩm:

```js {2-3}
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

Bạn chắc chắn không muốn mua sản phẩm hai lần. Tuy nhiên, đây cũng là lý do bạn không nên đặt logic này trong Effect. Nếu người dùng chuyển sang một trang khác rồi nhấn Back thì sao? Effect của bạn sẽ chạy lại. Bạn không muốn mua sản phẩm khi người dùng *truy cập* một trang; bạn muốn mua sản phẩm khi họ *nhấn* nút Buy.

Việc mua hàng không do rendering gây ra; nó do một tương tác cụ thể gây ra. Việc này chỉ nên chạy khi người dùng nhấn nút. **Hãy xóa Effect và chuyển request `/api/buy` vào event handler của nút Buy:**

```js {2-3}
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**Điều này cho thấy rằng nếu việc remount làm hỏng logic của ứng dụng, nguyên nhân thường là các bug vốn đã tồn tại.** Từ góc nhìn của người dùng, việc truy cập một trang không nên khác với việc truy cập trang đó, nhấn vào một liên kết, rồi nhấn Back để xem lại trang. React kiểm tra rằng các component của bạn tuân thủ nguyên tắc này bằng cách remount chúng một lần trong development.

## Ghép mọi thứ lại với nhau {/*putting-it-all-together*/}

Playground này có thể giúp bạn “cảm nhận” cách Effects hoạt động trong thực tế.

Ví dụ này sử dụng [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) để lên lịch ghi log vào console cùng với văn bản đầu vào, sao cho log xuất hiện ba giây sau khi Effect chạy. Hàm cleanup sẽ hủy timeout đang chờ. Hãy bắt đầu bằng cách nhấn "Mount the component":

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

Ban đầu, bạn sẽ thấy ba log: `Schedule "a" log`, `Cancel "a" log`, và `Schedule "a" log` một lần nữa. Ba giây sau, bạn cũng sẽ thấy một log có nội dung `a`. Như đã học ở phần trước, cặp lên lịch/hủy bổ sung xuất hiện vì React remount component một lần trong môi trường development để xác minh rằng bạn đã triển khai cleanup đúng cách.

Bây giờ, hãy chỉnh sửa input để có nội dung `abc`. Nếu bạn làm đủ nhanh, bạn sẽ thấy `Schedule "ab" log` ngay lập tức, sau đó là `Cancel "ab" log` và `Schedule "abc" log`. **React luôn cleanup Effect của lần render trước trước khi chạy Effect của lần render tiếp theo.** Vì vậy, ngay cả khi bạn nhập thật nhanh vào input, tại một thời điểm cũng chỉ có nhiều nhất một timeout được lên lịch. Hãy chỉnh sửa input vài lần và theo dõi console để cảm nhận cách các Effect được cleanup.

Hãy nhập gì đó vào input, sau đó ngay lập tức nhấn "Unmount the component". Hãy chú ý rằng việc unmount sẽ cleanup Effect của lần render cuối cùng. Ở đây, nó xóa timeout cuối cùng trước khi timeout đó có cơ hội chạy.

Cuối cùng, hãy chỉnh sửa component ở trên và comment out hàm cleanup để các timeout không bị hủy. Hãy thử nhập nhanh `abcde`. Bạn dự đoán điều gì sẽ xảy ra sau ba giây? Liệu `console.log(text)` bên trong timeout có in ra `text` *mới nhất* và tạo ra năm log `abcde` không? Hãy thử để kiểm tra trực giác của bạn!

Ba giây sau, bạn sẽ thấy một chuỗi log (`a`, `ab`, `abc`, `abcd`, và `abcde`) thay vì năm log `abcde`. **Mỗi Effect đều “nắm giữ” giá trị `text` từ lần render tương ứng.** Việc `text` state thay đổi không quan trọng: Effect từ lần render có `text = 'ab'` sẽ luôn thấy `'ab'`. Nói cách khác, các Effect từ mỗi lần render được cô lập với nhau. Nếu tò mò về cách hoạt động này, bạn có thể đọc về [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

<DeepDive>

#### Mỗi lần render có các Effect riêng {/*each-render-has-its-own-effects*/}

Bạn có thể hình dung `useEffect` như việc “gắn” một hành vi vào output của lần render. Hãy xem Effect này:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

Hãy cùng xem chính xác điều gì xảy ra khi người dùng điều hướng trong ứng dụng.

#### Lần render ban đầu {/*initial-render*/}

Người dùng truy cập `<ChatRoom roomId="general" />`. Hãy [mentally substitute](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` bằng `'general'`:

```js
  // JSX for the first render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**Effect cũng là một phần của output khi render.** Effect của lần render đầu tiên trở thành:

```js
  // Effect for the first render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  ['general']
```

React chạy Effect này, kết nối tới phòng chat `'general'`.

#### Render lại với cùng các dependency {/*re-render-with-same-dependencies*/}

Giả sử `<ChatRoom roomId="general" />` render lại. Output JSX không thay đổi:

```js
  // JSX for the second render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React nhận thấy output khi render không thay đổi, vì vậy không cập nhật DOM.

Effect từ lần render thứ hai trông như sau:

```js
  // Effect for the second render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  ['general']
```

React so sánh `['general']` từ lần render thứ hai với `['general']` từ lần render đầu tiên. **Vì tất cả dependency đều giống nhau, React *bỏ qua* Effect từ lần render thứ hai.** Effect này không bao giờ được gọi.

#### Render lại với các dependency khác {/*re-render-with-different-dependencies*/}

Sau đó, người dùng truy cập `<ChatRoom roomId="travel" />`. Lần này, component trả về JSX khác:

```js
  // JSX for the third render (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React cập nhật DOM để đổi `"Welcome to general"` thành `"Welcome to travel"`.

Effect từ lần render thứ ba trông như sau:

```js
  // Effect for the third render (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  ['travel']
```

React so sánh `['travel']` từ lần render thứ ba với `['general']` từ lần render thứ hai. Một dependency đã thay đổi: `Object.is('travel', 'general')` là `false`. Effect không thể bị bỏ qua.

**Trước khi React có thể áp dụng Effect từ lần render thứ ba, nó cần cleanup Effect cuối cùng _đã thực sự chạy_.** Effect của lần render thứ hai đã bị bỏ qua, vì vậy React cần cleanup Effect của lần render đầu tiên. Nếu cuộn lên phần lần render đầu tiên, bạn sẽ thấy cleanup của nó gọi `disconnect()` trên connection được tạo với `createConnection('general')`. Thao tác này ngắt kết nối ứng dụng khỏi phòng chat `'general'`.

Sau đó, React chạy Effect của lần render thứ ba. Nó kết nối tới phòng chat `'travel'`.

#### Unmount {/*unmount*/}

Cuối cùng, giả sử người dùng điều hướng sang nơi khác và component `ChatRoom` bị unmount. React chạy hàm cleanup của Effect cuối cùng. Effect cuối cùng là Effect từ lần render thứ ba. Cleanup của lần render thứ ba hủy connection `createConnection('travel')`. Vì vậy, ứng dụng ngắt kết nối khỏi phòng `'travel'`.

#### Các hành vi chỉ có trong development {/*development-only-behaviors*/}

Khi [Strict Mode](/reference/react/StrictMode) được bật, React remount mọi component một lần sau khi mount (state và DOM được giữ nguyên). Điều này [giúp bạn tìm ra các Effect cần cleanup](#step-3-add-cleanup-if-needed) và sớm phát hiện các bug như race condition. Ngoài ra, React sẽ remount các Effect mỗi khi bạn lưu một file trong môi trường development. Cả hai hành vi này chỉ xảy ra trong development.

</DeepDive>

<Recap>

- Không giống như event, Effect được tạo ra bởi chính quá trình render chứ không phải bởi một tương tác cụ thể.
- Effect cho phép bạn đồng bộ component với một hệ thống bên ngoài (third-party API, network, v.v.).
- Theo mặc định, Effect chạy sau mỗi lần render (bao gồm cả lần render ban đầu).
- React sẽ bỏ qua Effect nếu tất cả dependency có cùng giá trị như trong lần render trước.
- Bạn không thể “chọn” dependency. Chúng được xác định bởi code bên trong Effect.
- Mảng dependency rỗng (`[]`) tương ứng với thời điểm component “mount”, tức là được thêm vào màn hình.
- Trong Strict Mode, React mount component hai lần (chỉ trong development!) để stress-test các Effect của bạn.
- Nếu Effect bị lỗi vì remount, bạn cần triển khai một hàm cleanup.
- React sẽ gọi hàm cleanup trước khi Effect chạy lần tiếp theo và trong quá trình unmount.

</Recap>

<Challenges>

#### Focus một field khi mount {/*focus-a-field-on-mount*/}

Trong ví dụ này, form render một component `<MyInput />`.

Sử dụng method [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) của input để tự động focus `MyInput` khi nó xuất hiện trên màn hình. Đã có sẵn một cách triển khai được comment out, nhưng cách đó không hoạt động hoàn toàn đúng. Hãy tìm hiểu lý do và sửa nó. (Nếu bạn quen với attribute `autoFocus`, hãy giả sử rằng attribute này không tồn tại: chúng ta đang triển khai lại cùng chức năng từ đầu.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>


Để xác minh giải pháp hoạt động, hãy nhấn "Show form" và kiểm tra rằng input nhận focus (được làm nổi bật và con trỏ được đặt bên trong). Nhấn "Hide form", rồi lại nhấn "Show form". Xác minh rằng input lại được làm nổi bật.

`MyInput` chỉ nên focus _khi mount_ thay vì sau mỗi lần render. Để kiểm tra hành vi này đúng, hãy nhấn "Show form", sau đó nhấn lặp lại checkbox "Make it uppercase". Việc nhấp vào checkbox _không nên_ focus input ở phía trên.

<Solution>

Gọi `ref.current.focus()` trong quá trình render là sai vì đó là một *side effect*. Side effect nên được đặt bên trong event handler hoặc được khai báo bằng `useEffect`. Trong trường hợp này, side effect _được gây ra_ bởi việc component xuất hiện chứ không phải bởi một tương tác cụ thể nào, vì vậy đặt nó trong một Effect là hợp lý.

Để sửa lỗi, hãy bọc lệnh gọi `ref.current.focus()` trong một khai báo Effect. Sau đó, để đảm bảo Effect này chỉ chạy khi mount thay vì sau mỗi lần render, hãy thêm dependency `[]` rỗng vào đó.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### Focus một field có điều kiện {/*focus-a-field-conditionally*/}

Form này render hai component `<MyInput />`.

Nhấn "Show form" và chú ý rằng field thứ hai tự động được focus. Điều này xảy ra vì cả hai component `<MyInput />` đều cố gắng focus field bên trong. Khi bạn gọi `focus()` cho hai input liên tiếp, input cuối cùng luôn “thắng”.

Giả sử bạn muốn focus field đầu tiên. Component `MyInput` đầu tiên giờ nhận một prop boolean `shouldFocus` có giá trị `true`. Hãy thay đổi logic để `focus()` chỉ được gọi nếu prop `shouldFocus` mà `MyInput` nhận được là `true`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Để kiểm tra lời giải của bạn, hãy nhấn "Show form" và "Hide form" liên tục. Khi form xuất hiện, chỉ ô input *đầu tiên* được focus. Điều này là do component cha render input đầu tiên với `shouldFocus={true}` và input thứ hai với `shouldFocus={false}`. Đồng thời, hãy kiểm tra rằng cả hai input vẫn hoạt động và bạn có thể nhập vào cả hai.

<Hint>

Bạn không thể khai báo một Effect một cách có điều kiện, nhưng Effect của bạn có thể chứa logic có điều kiện.

</Hint>

<Solution>

Đặt logic có điều kiện bên trong Effect. Bạn sẽ cần chỉ định `shouldFocus` làm dependency vì bạn đang sử dụng nó bên trong Effect. (Điều này có nghĩa là nếu `shouldFocus` của một input nào đó thay đổi từ `false` thành `true`, input đó sẽ được focus sau khi mount.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### Sửa interval chạy hai lần {/*fix-an-interval-that-fires-twice*/}

Component `Counter` này hiển thị một counter, counter này sẽ tăng mỗi giây. Khi mount, nó gọi [`setInterval`.](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) Điều này khiến `onTick` chạy mỗi giây. Hàm `onTick` sẽ tăng counter.

Tuy nhiên, thay vì tăng một lần mỗi giây, nó lại tăng hai lần. Tại sao lại như vậy? Hãy tìm nguyên nhân của bug và sửa nó.

<Hint>

Hãy nhớ rằng `setInterval` trả về một interval ID, bạn có thể truyền ID này vào [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) để dừng interval.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

Khi [Strict Mode](/reference/react/StrictMode) được bật (như trong các sandbox trên trang này), React sẽ remount mỗi component một lần trong development. Điều này khiến interval được thiết lập hai lần, và đó là lý do counter tăng hai lần mỗi giây.

Tuy nhiên, hành vi của React không phải là *nguyên nhân* của bug: bug đã tồn tại trong code. Hành vi của React chỉ khiến bug dễ nhận thấy hơn. Nguyên nhân thực sự là Effect này khởi động một process nhưng không cung cấp cách để dọn dẹp process đó.

Để sửa code này, hãy lưu interval ID được `setInterval` trả về và triển khai một hàm cleanup với [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Trong development, React vẫn sẽ remount component của bạn một lần để kiểm tra rằng bạn đã triển khai cleanup đúng cách. Vì vậy sẽ có một lần gọi `setInterval`, ngay sau đó là `clearInterval`, rồi lại gọi `setInterval`. Trong production, sẽ chỉ có một lần gọi `setInterval`. Hành vi mà người dùng nhìn thấy trong cả hai trường hợp đều giống nhau: counter tăng một lần mỗi giây.

</Solution>

#### Sửa việc fetching bên trong một Effect {/*fix-fetching-inside-an-effect*/}

Component này hiển thị tiểu sử của người được chọn. Nó tải tiểu sử bằng cách gọi một hàm bất đồng bộ `fetchBio(person)` khi mount và mỗi khi `person` thay đổi. Hàm bất đồng bộ đó trả về một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) và cuối cùng sẽ resolve thành một chuỗi. Khi fetching hoàn tất, hàm gọi `setBio` để hiển thị chuỗi đó bên dưới hộp select.

<Sandpack>

{/* not the most efficient, but this validation is enabled in the linter only, so it's fine to ignore it here since we know what we're doing */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>


Code này có một bug. Trước tiên, hãy chọn "Alice". Sau đó chọn "Bob" và ngay lập tức chọn "Taylor". Nếu thao tác đủ nhanh, bạn sẽ nhận thấy bug: Taylor được chọn, nhưng đoạn văn bên dưới lại ghi "This is Bob's bio."

Tại sao điều này xảy ra? Hãy sửa bug bên trong Effect này.

<Hint>

Nếu một Effect fetch dữ liệu một cách bất đồng bộ, nó thường cần cleanup.

</Hint>

<Solution>

Để kích hoạt bug, các sự việc cần xảy ra theo thứ tự sau:

- Chọn `'Bob'` kích hoạt `fetchBio('Bob')`
- Chọn `'Taylor'` kích hoạt `fetchBio('Taylor')`
- **Fetching `'Taylor'` hoàn tất *trước* khi fetching `'Bob'` hoàn tất**
- Effect từ lần render `'Taylor'` gọi `setBio('This is Taylor’s bio')`
- Fetching `'Bob'` hoàn tất
- Effect từ lần render `'Bob'` gọi `setBio('This is Bob’s bio')`

Đó là lý do bạn thấy tiểu sử của Bob mặc dù Taylor đang được chọn. Những bug như vậy được gọi là [race conditions](https://en.wikipedia.org/wiki/Race_condition) vì hai thao tác bất đồng bộ đang "chạy đua" với nhau và có thể hoàn tất theo thứ tự không mong đợi.

Để sửa race condition này, hãy thêm một hàm cleanup:

<Sandpack>

{/* not the most efficient, but this validation is enabled in the linter only, so it's fine to ignore it here since we know what we're doing */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

Effect của mỗi lần render có biến `ignore` riêng. Ban đầu, biến `ignore` được đặt thành `false`. Tuy nhiên, nếu một Effect được cleanup (chẳng hạn khi bạn chọn một người khác), biến `ignore` của nó sẽ trở thành `true`. Vì vậy, thứ tự hoàn tất của các request không còn quan trọng. Chỉ Effect của người cuối cùng được chọn mới có `ignore` được đặt thành `false`, nên nó sẽ gọi `setBio(result)`. Các Effect trước đó đã được cleanup, vì vậy điều kiện kiểm tra `if (!ignore)` sẽ ngăn chúng gọi `setBio`:

- Chọn `'Bob'` kích hoạt `fetchBio('Bob')`
- Chọn `'Taylor'` kích hoạt `fetchBio('Taylor')` **và cleanup Effect trước đó (Effect của Bob)**
- Fetching `'Taylor'` hoàn tất *trước* khi fetching `'Bob'` hoàn tất
- Effect từ lần render `'Taylor'` gọi `setBio('This is Taylor’s bio')`
- Fetching `'Bob'` hoàn tất
- Effect từ lần render `'Bob'` **không làm gì vì flag `ignore` của nó đã được đặt thành `true`**

Ngoài việc bỏ qua kết quả của một lệnh gọi API đã lỗi thời, bạn cũng có thể sử dụng [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) để hủy các request không còn cần thiết. Tuy nhiên, chỉ riêng cách này vẫn chưa đủ để bảo vệ khỏi race condition. Sau fetch có thể còn nối tiếp thêm nhiều bước bất đồng bộ, vì vậy sử dụng một flag rõ ràng như `ignore` là cách đáng tin cậy nhất để sửa loại vấn đề này.

</Solution>

</Challenges>