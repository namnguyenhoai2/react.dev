---
title: <ViewTransition>
---

<Intro>

`<ViewTransition>` cho phép bạn tạo animation cho một cây component bằng Transitions và Suspense.

```js
import {ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `<ViewTransition>` {/*viewtransition*/}

Bọc một cây component trong `<ViewTransition>` để tạo animation cho nó:

```js
<ViewTransition>
  <Page />
</ViewTransition>
```

[Xem thêm các ví dụ bên dưới.](#usage)

<DeepDive>

#### `<ViewTransition>` hoạt động như thế nào? {/*how-does-viewtransition-work*/}

Ở phía bên dưới, React áp dụng `view-transition-name` vào các inline style của DOM node gần nhất được lồng bên trong component `<ViewTransition>`. Nếu có nhiều DOM node anh em như `<ViewTransition><div /><div /></ViewTransition>` thì React thêm hậu tố vào tên để làm cho mỗi tên là duy nhất, nhưng về mặt khái niệm, chúng vẫn thuộc cùng một nhóm. React không áp dụng các tên này ngay lập tức mà chỉ áp dụng vào thời điểm boundary đó cần tham gia vào một animation.

React tự động gọi `startViewTransition` ở phía sau, vì vậy bạn không bao giờ nên tự gọi nó. Trên thực tế, nếu có thứ gì khác trên trang đang chạy một ViewTransition thì React sẽ ngắt nó. Vì vậy, bạn nên để chính React điều phối các ViewTransition này. Nếu trước đây bạn có những cách khác để kích hoạt ViewTransition, chúng tôi khuyến nghị bạn chuyển sang cách tích hợp sẵn này.

Nếu đã có các React ViewTransition khác đang chạy, React sẽ đợi chúng hoàn tất trước khi bắt đầu ViewTransition tiếp theo. Tuy nhiên, điều quan trọng là nếu có nhiều update xảy ra trong khi animation đầu tiên đang chạy thì tất cả sẽ được gộp thành một. Nếu bạn bắt đầu A->B, rồi trong lúc đó nhận được một update để chuyển đến C và sau đó đến D, khi animation A->B đầu tiên kết thúc, animation tiếp theo sẽ chạy từ B->D.

Lifecycle `getSnapshotBeforeUpdate` sẽ được gọi trước `startViewTransition`, và một số `view-transition-name` sẽ được update cùng lúc.

Sau đó, React gọi `startViewTransition`. Bên trong `updateCallback`, React sẽ:

- Áp dụng các mutation của nó vào DOM và gọi `useInsertionEffect`.
- Chờ các font tải xong.
- Gọi `componentDidMount`, `componentDidUpdate`, `useLayoutEffect` và refs.
- Chờ mọi Navigation đang chờ hoàn tất.
- Sau đó, React sẽ đo mọi thay đổi đối với layout để xác định boundary nào cần tạo animation.

Sau khi Promise ready của `startViewTransition` được resolve, React sẽ khôi phục `view-transition-name`. Sau đó, React sẽ gọi các callback `onEnter`, `onExit`, `onUpdate` và `onShare` để cho phép kiểm soát animation theo cách thủ công bằng code. Việc này xảy ra sau khi các animation mặc định tích hợp sẵn đã được tính toán.

Nếu một `flushSync` xảy ra giữa sequence này, React sẽ bỏ qua Transition vì nó phụ thuộc vào khả năng hoàn tất một cách đồng bộ.

Sau khi Promise finished của `startViewTransition` được resolve, React sẽ gọi `useEffect`. Điều này ngăn chúng can thiệp vào hiệu năng của animation. Tuy nhiên, đây không phải là điều được đảm bảo, vì nếu một `setState` khác xảy ra trong khi animation đang chạy thì React vẫn phải gọi `useEffect` sớm hơn để duy trì các đảm bảo về thứ tự tuần tự.

</DeepDive>

#### Props {/*props*/}

- **tùy chọn** `name`: Một string hoặc object. Tên của View Transition được dùng cho shared element transitions. Nếu không được cung cấp, React sẽ sử dụng một tên duy nhất cho mỗi View Transition để ngăn các animation ngoài dự kiến.
- [View Transition Class](#view-transition-class) props.
- [View Transition Event](#view-transition-event) props.

#### Lưu ý {/*caveats*/}

- Chỉ sử dụng `name` cho [shared element transitions](#animating-a-shared-element). Với mọi animation khác, React tự động tạo một tên duy nhất để ngăn các animation ngoài dự kiến.
- Theo mặc định, các update của `setState` được thực hiện ngay lập tức và không kích hoạt `<ViewTransition>`; chỉ các update được bọc trong [Transition](/reference/react/useTransition), [`<Suspense>`](/reference/react/Suspense), hoặc `useDeferredValue` mới kích hoạt ViewTransition.
- `<ViewTransition>` tạo ra một image có thể được di chuyển, scale và cross-fade. Không giống Layout Animations mà bạn có thể đã thấy trong React Native hoặc Motion, điều này có nghĩa là không phải mọi Element riêng lẻ bên trong nó đều tạo animation cho vị trí của mình. Cách này có thể mang lại hiệu năng tốt hơn và animation mượt mà, liên tục hơn so với việc tạo animation cho từng phần tử riêng lẻ. Tuy nhiên, nó cũng có thể làm mất tính liên tục ở những thành phần đáng lẽ phải tự di chuyển. Vì vậy, bạn có thể phải tự thêm nhiều `<ViewTransition>` boundary hơn.
- Hiện tại, `<ViewTransition>` chỉ hoạt động trong DOM. Chúng tôi đang phát triển để bổ sung hỗ trợ cho React Native và các nền tảng khác.

#### Trình kích hoạt animation {/*animation-triggers*/}

React tự động quyết định loại animation View Transition cần kích hoạt:

- `enter`: Nếu một `ViewTransition` là component đầu tiên được chèn vào Transition này thì loại này sẽ được kích hoạt.
- `exit`: Nếu một `ViewTransition` là component đầu tiên bị xóa trong Transition này thì loại này sẽ được kích hoạt.
- `update`: Nếu một `ViewTransition` có bất kỳ mutation DOM nào bên trong mà React đang thực hiện, chẳng hạn như một prop thay đổi, hoặc nếu chính boundary `ViewTransition` thay đổi kích thước hoặc vị trí do một sibling tức thời. Nếu có các `ViewTransition` được lồng nhau thì mutation sẽ áp dụng cho chúng thay vì component cha.
- `share`: Nếu một `ViewTransition` có tên nằm bên trong một subtree đã bị xóa và một `ViewTransition` có tên trùng khớp nằm trong một subtree được chèn vào trong cùng Transition, chúng sẽ tạo thành một Shared Element Transition và animation sẽ chuyển từ phần tử đã bị xóa sang phần tử được chèn vào.

Theo mặc định, `<ViewTransition>` tạo animation bằng hiệu ứng cross-fade mượt mà (view transition mặc định của trình duyệt).

Bạn có thể tùy chỉnh animation bằng cách cung cấp một [View Transition Class](#view-transition-class) cho component `<ViewTransition>` tương ứng với từng loại trigger (xem [Styling View Transitions](#styling-view-transitions)), hoặc bằng cách sử dụng [ViewTransition Events](#view-transition-events) để điều khiển animation bằng JavaScript thông qua [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

<Note>

#### Luôn kiểm tra `prefers-reduced-motion` {/*always-check-prefers-reduced-motion*/}

Nhiều người dùng có thể không muốn trang có animation. React không tự động tắt animation trong trường hợp này.

Chúng tôi khuyến nghị luôn sử dụng media query `@media (prefers-reduced-motion)` để tắt animation hoặc giảm mức độ animation dựa trên tùy chọn của người dùng.

Trong tương lai, các thư viện CSS có thể tích hợp sẵn tính năng này trong các preset của chúng.

</Note>

### View Transition Class {/*view-transition-class*/}

`<ViewTransition>` cung cấp các props để xác định những gì sẽ kích hoạt animation:

```js
<ViewTransition
  default="none"
  enter="slide-up"
  exit="slide-down"
/>
```

#### Props {/*view-transition-class-props*/}

- **tùy chọn** `enter`: `"auto"`, `"none"`, một string hoặc object.
- **tùy chọn** `exit`: `"auto"`, `"none"`, một string hoặc object.
- **tùy chọn** `update`: `"auto"`, `"none"`, một string hoặc object.
- **tùy chọn** `share`: `"auto"`, `"none"`, một string hoặc object.
- **tùy chọn** `default`: `"auto"`, `"none"`, một string hoặc object.

#### Lưu ý {/*view-transition-class-caveats*/}

- Nếu `default` là `"none"` thì tất cả trigger khác sẽ bị tắt, trừ khi được liệt kê rõ ràng.

#### Giá trị {/*view-transition-values*/}

Các giá trị của View Transition class có thể là:
- `auto`: giá trị mặc định. Sử dụng animation mặc định của trình duyệt.
- `none`: tắt animation cho loại này.
- `<classname>`: tên CSS class tùy chỉnh dùng để [tùy chỉnh View Transitions](#styling-view-transitions).

Các giá trị object có thể là một object với các key dạng string và giá trị là `auto`, `none` hoặc một className tùy chỉnh:
- `{[type]: value}`: áp dụng `value` nếu animation khớp với [Transition Type](/reference/react/addTransitionType).
- `{default: value}`: giá trị mặc định được áp dụng nếu không khớp với [Transition Type](/reference/react/addTransitionType) nào.

Ví dụ, bạn có thể định nghĩa một ViewTransition như sau:

```js
<ViewTransition
  /* tắt mọi animation không được định nghĩa bên dưới */
  default="none"
  enter={{
    /* áp dụng slide-in cho Transition Type `forward` */
    "forward": 'slide-in',
    /* nếu không thì dùng animation mặc định của trình duyệt */
    "default": 'auto'
  }}
  /* dùng animation mặc định của trình duyệt cho animation exit */
  exit="auto"
  /* áp dụng class `cross-fade` tùy chỉnh cho các update */
  update="cross-fade"
>
```

Xem [Styling View Transitions](#styling-view-transitions) để biết cách định nghĩa các CSS class cho animation tùy chỉnh.

---

### View Transition Event {/*view-transition-event*/}

Các sự kiện View Transition cho phép bạn điều khiển animation bằng JavaScript sử dụng [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API):

```js
<ViewTransition
  onEnter={instance => {/* ... */}}
  onExit={instance => {/* ... */}}
/>
```

#### Props {/*view-transition-event-props*/}

- **tùy chọn** `onEnter`: Được gọi khi animation "enter" được kích hoạt.
- **tùy chọn** `onExit`: Được gọi khi animation "exit" được kích hoạt.
- **tùy chọn** `onShare`: Được gọi khi animation "share" được kích hoạt.
- **tùy chọn** `onUpdate`: Được gọi khi animation "update" được kích hoạt.


#### Lưu ý {/*view-transition-event-caveats*/}
- Mỗi `<ViewTransition>` chỉ kích hoạt một sự kiện cho mỗi Transition. `onShare` được ưu tiên hơn `onEnter` và `onExit`.
- Mỗi sự kiện nên trả về một **hàm cleanup**. Hàm cleanup được gọi khi View Transition kết thúc, cho phép bạn hủy hoặc cleanup mọi animation.

#### Đối số {/*view-transition-event-arguments*/}

Mỗi sự kiện nhận hai đối số:

- `instance`: Một instance View Transition cung cấp quyền truy cập vào các [pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#the_view_transition_process) của view transition
  - `old`: Pseudo-element `::view-transition-old`.
  - `new`: Pseudo-element `::view-transition-new`.
  - `name`: Chuỗi `view-transition-name` cho boundary này.
  - `group`: Pseudo-element `::view-transition-group`.
  - `imagePair`: Pseudo-element `::view-transition-image-pair`.
- `types`: Một `Array<string>` của [Transition Types](/reference/react/addTransitionType) được đưa vào animation. Mảng rỗng nếu không chỉ định type nào.

Ví dụ, bạn có thể định nghĩa một sự kiện `onEnter` điều khiển animation bằng JavaScript:

```js
<ViewTransition
  onEnter={(instance, types) => {
    const anim = instance.new.animate([{opacity: 0}, {opacity: 1}], {
      duration: 500,
    });
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

Xem [Animating with JavaScript](#animating-with-javascript) để biết thêm ví dụ.

---

## Tạo kiểu cho View Transitions {/*styling-view-transitions*/}

<Note>

Trong nhiều ví dụ ban đầu về View Transitions trên web, bạn có thể đã thấy người ta sử dụng [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name) rồi tạo kiểu cho nó bằng các selector `::view-transition-...(my-name)`. Chúng tôi không khuyến nghị cách này để tạo kiểu. Thay vào đó, thông thường chúng tôi khuyến nghị sử dụng View Transition Class.

</Note>

Để tùy chỉnh animation cho một `<ViewTransition>`, bạn có thể cung cấp View Transition Class cho một trong các activation prop. View Transition Class là tên CSS class mà React áp dụng cho các phần tử con khi ViewTransition được kích hoạt.

Ví dụ, để tùy chỉnh animation "enter", hãy cung cấp tên class cho prop `enter`:

```js
<ViewTransition enter="slide-in">
```

Khi `<ViewTransition>` kích hoạt animation "enter", React sẽ thêm tên class `slide-in`. Sau đó, bạn có thể tham chiếu class này bằng các [view transition pseudo selectors](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API#pseudo-elements) để xây dựng các animation có thể tái sử dụng:

```css
::view-transition-group(.slide-in) {
}
::view-transition-old(.slide-in) {
}
::view-transition-new(.slide-in) {
}
```

Trong tương lai, các CSS library có thể bổ sung các animation dựng sẵn bằng View Transition Classes để việc này dễ sử dụng hơn.

---

## Cách sử dụng {/*usage*/}

### Tạo animation cho phần tử khi enter/exit {/*animating-an-element-on-enter*/}

Enter/Exit Transitions được kích hoạt khi một `<ViewTransition>` được component thêm vào hoặc xóa khỏi transition:

```js {3}
function Child() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <div>Hi</div>
    </ViewTransition>
  );
}

function Parent() {
  const [show, setShow] = useState();
  if (show) {
    return <Child />;
  }
  return null;
}
```

Khi `setShow` được gọi, `show` chuyển sang `true` và component `Child` được render. Khi `setShow` được gọi bên trong `startTransition`, và `Child` render một `ViewTransition` trước mọi DOM node khác, một animation `enter` được kích hoạt.

Khi `show` chuyển trở lại `false`, một animation `exit` được kích hoạt.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Pitfall>

#### Chỉ ViewTransition ở cấp cao nhất mới được animate khi exit/enter {/*only-top-level-viewtransition-animates-on-exit-enter*/}

`<ViewTransition>` chỉ kích hoạt exit/enter nếu được đặt _trước_ mọi DOM node.

Nếu có một `<div>` nằm phía trên `<ViewTransition>`, sẽ không có animation exit/enter nào được kích hoạt:

```js [3, 5]
function Item() {
  return (
    <div> {/* 🚩<div> phía trên <ViewTransition> làm hỏng exit/enter */}
      <ViewTransition enter="auto" exit="auto" default="none">
        <Video video={videos[0]} />
      </ViewTransition>
    </div>
  );
}
```

Ràng buộc này ngăn các lỗi tinh vi xảy ra khi animate quá nhiều hoặc quá ít nội dung.

</Pitfall>

---

### Tạo animation enter/exit với Activity {/*animating-enter-exit-with-activity*/}

Nếu muốn animate một component vào và ra trong khi vẫn giữ lại state của component, hoặc pre-render nội dung cho một animation, bạn có thể sử dụng [`<Activity>`](/reference/react/Activity). Khi một `<ViewTransition>` bên trong `<Activity>` trở nên visible, animation `enter` được kích hoạt. Khi nó trở nên hidden, animation `exit` được kích hoạt:

```js
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ViewTransition enter="auto" exit="auto">
    <Counter />
  </ViewTransition>
</Activity>

```

Trong ví dụ này, `Counter` có một counter với state nội bộ. Hãy thử tăng counter, ẩn nó, rồi hiển thị lại. Giá trị của counter được giữ nguyên trong khi sidebar animate vào và ra:

<Sandpack>

```js
import { Activity, ViewTransition, useState, startTransition } from 'react';

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div className="layout">
      <Toggle show={show} setShow={setShow} />
      <Activity mode={show ? 'visible' : 'hidden'}>
        <ViewTransition enter="auto" exit="auto" default="none">
          <Counter />
        </ViewTransition>
      </Activity>
    </div>
  );
}
function Toggle({show, setShow}) {
  return (
    <button
      className="toggle"
      onClick={() => {
        startTransition(() => {
          setShow(s => !s);
        });
      }}>
      {show ? 'Hide' : 'Show'}
    </button>
  )
}
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="counter">
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

```

```css
.layout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-height: 200px;
}
.counter {
  padding: 15px;
  background: #f0f4f8;
  border-radius: 8px;
  width: 200px;
}
.counter h2 {
  margin: 0 0 10px 0;
  font-size: 16px;
}
.counter p {
  margin: 0 0 10px 0;
}
.toggle {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f0f8ff;
  cursor: pointer;
  font-size: 14px;
}
.toggle:hover {
  background: #e0e8ff;
}
.counter button {
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Nếu không có `<Activity>`, counter sẽ reset về `0` mỗi lần sidebar xuất hiện lại.

---

### Tạo animation cho shared element {/*animating-a-shared-element*/}

Thông thường, chúng tôi không khuyến nghị gán tên cho `<ViewTransition>`, mà thay vào đó để React tự động gán tên. Lý do bạn có thể muốn tự gán tên là để animate giữa các component hoàn toàn khác nhau khi một tree unmount và một tree khác mount cùng lúc, nhằm duy trì tính liên tục.

```js
<ViewTransition name={UNIQUE_NAME}>
  <Child />
</ViewTransition>
```

Khi một tree unmount và một tree khác mount, nếu có một cặp mà cùng một tên tồn tại trong tree đang unmount và tree đang mount, chúng sẽ kích hoạt animation "share" trên cả hai. Animation chạy từ phía đang unmount đến phía đang mount.

Không giống animation exit/enter, animation này có thể nằm sâu bên trong tree bị xóa/được mount. Nếu một `<ViewTransition>` cũng đủ điều kiện cho exit/enter, animation "share" sẽ được ưu tiên.

Nếu Transition trước tiên unmount một phía, sau đó dẫn đến việc hiển thị một fallback `<Suspense>` trước khi tên mới cuối cùng được mount, thì sẽ không có shared element transition nào xảy ra.

<Sandpack>

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video, Thumbnail, FullscreenVideo} from './Video';
import videos from './data';

export default function Component() {
  const [fullscreen, setFullscreen] = useState(false);
  if (fullscreen) {
    return (
      <FullscreenVideo
        video={videos[0]}
        onExit={() => startTransition(() => setFullscreen(false))}
      />
    );
  }
  return (
    <Video
      video={videos[0]}
      onClick={() => startTransition(() => setFullscreen(true))}
    />
  );
}
```

```js src/Video.js
import {ViewTransition} from 'react';

const THUMBNAIL_NAME = 'video-thumbnail';

export function Thumbnail({video, children}) {
  return (
    <ViewTransition name={THUMBNAIL_NAME}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      />
    </ViewTransition>
  );
}

export function Video({video, onClick}) {
  return (
    <div className="video">
      <div className="link" onClick={onClick}>
        <Thumbnail video={video} />
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function FullscreenVideo({video, onExit}) {
  return (
    <div className="fullscreenLayout">
      <ViewTransition name={THUMBNAIL_NAME}>
        <div
          aria-hidden="true"
          tabIndex={-1}
          className={`thumbnail ${video.image} fullscreen`}
        />
        <button className="close-button" onClick={onExit}>
          ✖
        </button>
      </ViewTransition>
    </div>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.fullscreen {
  width: 100%;
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
.fullscreenLayout {
  position: relative;
  height: 100%;
  width: 100%;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
}
@keyframes progress-animation {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

Nếu phía đã mount hoặc đã unmount của một cặp nằm ngoài viewport, thì cặp đó sẽ không được tạo. Điều này đảm bảo phần tử không bay vào hoặc bay ra khỏi viewport khi người dùng cuộn. Thay vào đó, phần tử được xử lý như một enter/exit thông thường và hoạt động độc lập.

Điều này không xảy ra nếu cùng một Component instance thay đổi vị trí, vì trường hợp đó sẽ kích hoạt một "update". Các phần tử này vẫn được animate bất kể một trong hai vị trí có nằm ngoài viewport hay không.

Có một trường hợp đã biết: nếu một `<ViewTransition>` đã unmount và nằm sâu trong cây ở bên trong viewport, nhưng phía đã mount không nằm trong viewport, thì phía đã unmount sẽ animate như một animation "exit" riêng, dù nằm sâu trong cây, thay vì là một phần của animation của parent.

</Note>

<Pitfall>

Điều quan trọng là tại một thời điểm chỉ có một phần tử mang cùng tên được mount trong toàn bộ app. Vì vậy, việc sử dụng namespace duy nhất cho tên là rất quan trọng để tránh xung đột. Để đảm bảo điều này, bạn có thể thêm một constant vào một module riêng rồi import nó.

```js
export const MY_NAME = "my-globally-unique-name";
import {MY_NAME} from './shared-name';
...
<ViewTransition name={MY_NAME}>
```

</Pitfall>

---

### Tạo animation khi sắp xếp lại các item trong list {/*animating-reorder-of-items-in-a-list*/}

```js
items.map((item) => <Component key={item.id} item={item} />);
```

Khi sắp xếp lại một list mà không cập nhật nội dung, animation "update" sẽ được kích hoạt trên mỗi `<ViewTransition>` trong list nếu chúng nằm bên ngoài một DOM node. Tương tự như animation enter/exit.

Điều này có nghĩa là animation sẽ được kích hoạt trên `<ViewTransition>` này:

```js
function Component() {
  return (
    <ViewTransition>
      <div>...</div>
    </ViewTransition>
  );
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <div className="listContainer">
        {orderedVideos.map((video, i) => {
          return (
            <ViewTransition key={video.title}>
              <Video video={video} />
            </ViewTransition>
          );
        })}
      </div>
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Tuy nhiên, cách này sẽ không animate từng item riêng lẻ:

```js
function Component() {
  return (
    <div>
      <ViewTransition>...</ViewTransition>
    </div>
  );
}
```

Thay vào đó, mọi `<ViewTransition>` parent sẽ cross-fade. Nếu không có `<ViewTransition>` parent thì trong trường hợp đó sẽ không có animation.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <ViewTransition>
        <div className="listContainer">
          {orderedVideos.map((video, i) => {
            return <Video video={video} key={video.title} />;
          })}
        </div>
      </ViewTransition>
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Điều này có nghĩa là bạn có thể muốn tránh các wrapper element trong những list mà bạn muốn Component tự điều khiển animation reorder của chính nó:

```
items.map(item => <div><Component key={item.id} item={item} /></div>)
```

Quy tắc trên cũng áp dụng nếu một trong các item được cập nhật để thay đổi kích thước, khiến các item sibling thay đổi kích thước theo; khi đó, animation cũng sẽ áp dụng cho `<ViewTransition>` sibling của nó, nhưng chỉ khi chúng là sibling trực tiếp.

Điều này có nghĩa là trong một update gây ra nhiều re-layout, không phải mọi `<ViewTransition>` trên trang đều được animate riêng lẻ. Làm như vậy sẽ tạo ra rất nhiều animation gây nhiễu và khiến người dùng mất tập trung khỏi thay đổi thực sự. Vì vậy, React thận trọng hơn trong việc xác định thời điểm kích hoạt một animation riêng lẻ.

<Pitfall>

Điều quan trọng là sử dụng key đúng cách để bảo toàn identity khi sắp xếp lại các list. Có vẻ như bạn có thể sử dụng "name", shared element transitions, để animate việc sắp xếp lại, nhưng chúng sẽ không được kích hoạt nếu một phía nằm ngoài viewport. Để animate việc sắp xếp lại, bạn thường muốn thể hiện rằng phần tử đã được chuyển đến một vị trí nằm ngoài viewport.

</Pitfall>

---

### Animate từ nội dung Suspense {/*animating-from-suspense-content*/}

Giống như bất kỳ Transition nào, React sẽ chờ dữ liệu và CSS mới (`<link rel="stylesheet" precedence="...">`) trước khi chạy animation. Ngoài ra, ViewTransitions cũng chờ tối đa 500ms để các font mới tải xong trước khi bắt đầu animation, nhằm tránh việc chúng nhấp nháy khi xuất hiện muộn hơn. Vì lý do tương tự, một image được bọc trong ViewTransition sẽ chờ image tải xong. Xem các ví dụ về [chờ một font](/reference/react/Suspense#waiting-for-a-font-to-load) và [chờ một image](/reference/react/Suspense#waiting-for-an-image-to-load) trên trang Suspense.

Nếu nó nằm bên trong một instance Suspense boundary mới, fallback sẽ được hiển thị trước. Sau khi Suspense boundary tải hoàn tất, nó sẽ kích hoạt `<ViewTransition>` để animate việc hiển thị nội dung.

Có hai cách để animate Suspense boundary, tùy thuộc vào nơi bạn đặt `<ViewTransition>`:

**Update:**

```
<ViewTransition>
  <Suspense fallback={<A />}>
    <B />
  </Suspense>
</ViewTransition>
```

Trong trường hợp này, khi nội dung chuyển từ A sang B, nó sẽ được xử lý như một "update" và áp dụng class đó nếu phù hợp. Cả A và B sẽ nhận cùng một view-transition-name, vì vậy theo mặc định chúng hoạt động như một cross-fade.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, Suspense} from 'react';
import {Video, VideoPlaceholder} from './Video';
import {useLazyVideoData} from './data';

function LazyVideo() {
  const video = useLazyVideoData();
  return <Video video={video} />;
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from 'react';

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

**Enter/Exit:**

```
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
  <ViewTransition><B /></ViewTransition>
</Suspense>
```

Trong trường hợp này, đây là hai instance ViewTransition riêng biệt, mỗi instance có `view-transition-name` riêng. Điều này sẽ được xử lý như một "exit" của `<A>` và một "enter" của `<B>`.

Bạn có thể tạo ra các hiệu ứng khác nhau tùy thuộc vào vị trí bạn chọn để đặt boundary `<ViewTransition>`.

---

### Tắt một animation {/*opting-out-of-an-animation*/}

Đôi khi bạn bọc một component hiện có lớn, chẳng hạn như toàn bộ một trang, và muốn animate một số update, ví dụ như khi thay đổi theme. Tuy nhiên, bạn không muốn opt-in toàn bộ các update bên trong trang để cross-fade khi chúng được update, đặc biệt là khi bạn đang dần bổ sung thêm nhiều animation.

Bạn có thể sử dụng class "none" để opt-out khỏi một animation. Bằng cách bọc các children trong một "none", bạn có thể vô hiệu hóa animation đối với các update của chúng, trong khi parent vẫn kích hoạt animation.

```js
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">{children}</ViewTransition>
  </div>
</ViewTransition>
```

Điều này sẽ chỉ animate khi theme thay đổi, không animate khi chỉ có children được update. Children vẫn có thể opt-in lại bằng `<ViewTransition>` riêng, nhưng ít nhất việc này lại được thực hiện thủ công.

---

### Tùy chỉnh animation {/*customizing-animations*/}

Theo mặc định, `<ViewTransition>` bao gồm cross-fade mặc định từ browser.

Để tùy chỉnh animation, bạn có thể truyền props cho component `<ViewTransition>` nhằm chỉ định các animation cần sử dụng, dựa trên cách `<ViewTransition>` được kích hoạt.

Ví dụ, chúng ta có thể làm chậm animation cross-fade mặc định:

```js
<ViewTransition default="slow-fade">
  <Video />
</ViewTransition>
```

Và định nghĩa slow-fade trong CSS bằng các class của view transition:

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition default="slow-fade">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Ngoài việc thiết lập `default`, bạn cũng có thể cung cấp cấu hình cho các animation `enter`, `exit`, `update` và `share`.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Tùy chỉnh animation bằng types {/*customizing-animations-with-types*/}

Bạn có thể sử dụng API [`addTransitionType`](/reference/react/addTransitionType) để thêm tên class vào các phần tử con khi một transition type cụ thể được kích hoạt bởi một activation trigger cụ thể. Điều này cho phép bạn tùy chỉnh animation cho từng loại transition.

Ví dụ, để tùy chỉnh animation cho tất cả thao tác điều hướng tiến và lùi:

```js
<ViewTransition
  default={{
    'navigation-back': 'slide-right',
    'navigation-forward': 'slide-left',
  }}>
  <div>...</div>
</ViewTransition>;

// trong router của bạn:
startTransition(() => {
  addTransitionType('navigation-' + navigationType);
});
```

Khi ViewTransition kích hoạt animation "navigation-back", React sẽ thêm tên class "slide-right". Khi ViewTransition kích hoạt animation "navigation-forward", React sẽ thêm tên class "slide-left".

Trong tương lai, các router và library khác có thể hỗ trợ các view-transition type và style tiêu chuẩn.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition
      enter={{
        'add-video-back': 'slide-in-back',
        'add-video-forward': 'slide-in-forward',
      }}
      exit={{
        'remove-video-back': 'slide-in-forward',
        'remove-video-forward': 'slide-in-back',
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-back');
              } else {
                addTransitionType('add-video-back');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-forward');
              } else {
                addTransitionType('add-video-forward');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ➡️
        </button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in-back) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-back) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-back) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-back) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-in-forward) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-forward) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-forward) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-forward) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Animate bằng JavaScript {/*animating-with-javascript*/}

Mặc dù [View Transition Classes](#view-transition-class) cho phép bạn định nghĩa animation bằng CSS, đôi khi bạn cần quyền kiểm soát imperative đối với animation. Các callback `onEnter`, `onExit`, `onUpdate` và `onShare` cho phép bạn truy cập trực tiếp vào các pseudo-element của view transition để có thể animate chúng bằng [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

Mỗi callback nhận một `instance` với các thuộc tính `.old` và `.new`, đại diện cho các pseudo-element của view transition. Bạn có thể gọi `.animate()` trên chúng, giống như khi gọi trên một DOM element:

```js
<ViewTransition
  onEnter={(instance) => {
    const anim = instance.new.animate(
      [
        {transform: 'scale(0.8)'},
        {transform: 'scale(1)'},
      ],
      {duration: 300, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

Điều này cho phép bạn kết hợp các animation do CSS điều khiển với các animation do JavaScript điều khiển.

Trong ví dụ sau, cross-fade mặc định được xử lý bằng CSS, còn các animation slide được điều khiển bằng JavaScript trong các animation `onEnter` và `onExit`:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';
import {SLIDE_IN, SLIDE_OUT} from './animations';

function Item() {
  return (
    <ViewTransition
      default="none"
      /* mặc định cross fade được điều khiển bằng CSS */
      enter="auto"
      exit="auto"
      /* animation slide được điều khiển bằng JS */
      onEnter={(instance) => {
        const anim = instance.new.animate(
          SLIDE_IN,
          {duration: 500, easing: 'ease-out'}
        );
        return () => anim.cancel();
      }}
      onExit={(instance) => {
        const anim = instance.old.animate(
          SLIDE_OUT,
          {duration: 300, easing: 'ease-in'}
        );
        return () => anim.cancel();
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/animations.js
export const SLIDE_IN = [
  {transform: 'translateY(20px)'},
  {transform: 'translateY(0)'},
];

export const SLIDE_OUT = [
  {transform: 'translateY(0)'},
  {transform: 'translateY(-20px)'},
];
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

#### Luôn dọn dẹp View Transition Events {/*always-clean-up-view-transition-events*/}

View Transition Events luôn phải trả về một cleanup function:

```js {7}
<ViewTransition
  onEnter={(instance) => {
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: 500, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}
>
```

Điều này cho phép browser hủy animation khi View Transition bị gián đoạn.

</Note>

---

### Animate transition type bằng JavaScript {/*animating-transition-types-with-javascript*/}

Bạn có thể sử dụng `types` được truyền vào các event `ViewTransition` để áp dụng có điều kiện các animation khác nhau, dựa trên cách Transition được kích hoạt.

```js {3}
 <ViewTransition
  onEnter={(instance, types) => {
    const duration = types.includes('fast') ? 150 : 2000;
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: duration, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}
>
```

Ví dụ này gọi [`addTransitionType`](/reference/react/addTransitionType) để đánh dấu một Transition là "fast", sau đó điều chỉnh thời lượng animation:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, addTransitionType} from 'react';
import {Video} from './Video';
import videos from './data';
import {SLIDE_IN, SLIDE_OUT} from './animations';

function Item() {
  return (
    <ViewTransition
      onEnter={(instance, types) => {
        const duration = types.includes('fast') ? 150 : 2000;
        const anim = instance.new.animate(
          SLIDE_IN,
          {duration: duration, easing: 'ease-out'}
        );
        return () => anim.cancel();
      }}
      onExit={(instance, types) => {
        const duration = types.includes('fast') ? 150 : 500;
        const anim = instance.old.animate(
          SLIDE_OUT,
          {duration: duration, easing: 'ease-in'}
        );
        return () => anim.cancel();
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  const [isFast, setIsFast] = useState(false);
  return (
    <>
      <div>
        Fast: <input type="checkbox" onChange={() => {setIsFast(f => !f)}} value={isFast}></input>
      </div><br />
      <button
        onClick={() => {
          startTransition(() => {
            if (isFast) {
              addTransitionType('fast');
            }
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/animations.js
export const SLIDE_IN = [
  {opacity: 0, transform: 'translateY(20px)'},
  {opacity: 1, transform: 'translateY(0)'},
];

export const SLIDE_OUT = [
  {opacity: 1, transform: 'translateY(0)'},
  {opacity: 0, transform: 'translateY(-20px)'},
];
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Xây dựng router hỗ trợ View Transition {/*building-view-transition-enabled-routers*/}

React chờ mọi Navigation đang chờ xử lý hoàn tất để bảo đảm việc khôi phục scroll diễn ra trong animation. Nếu Navigation bị React chặn, router của bạn phải bỏ chặn trong `useLayoutEffect`, vì `useEffect` sẽ dẫn đến deadlock.

Nếu một `startTransition` được bắt đầu từ legacy popstate event, chẳng hạn trong quá trình điều hướng "back", nó phải kết thúc đồng bộ để bảo đảm việc khôi phục scroll và form hoạt động chính xác. Điều này xung đột với việc chạy animation View Transition. Vì vậy, React sẽ bỏ qua các animation từ popstate và animation sẽ không chạy đối với nút back. Bạn có thể khắc phục bằng cách nâng cấp router để sử dụng Navigation API.

---

## Troubleshooting {/*troubleshooting*/}

### `<ViewTransition>` của tôi không được kích hoạt {/*my-viewtransition-is-not-activating*/}

`<ViewTransition>` chỉ được kích hoạt nếu được đặt trước bất kỳ DOM node nào:

```js [3, 5]
function Component() {
  return (
    <div>
      <ViewTransition>Hi</ViewTransition>
    </div>
  );
}
```

Để khắc phục, hãy bảo đảm `<ViewTransition>` đứng trước mọi DOM node khác:

```js [3, 5]
function Component() {
  return (
    <ViewTransition>
      <div>Hi</div>
    </ViewTransition>
  );
}
```

### Tôi nhận được lỗi "Có hai component `<ViewTransition name=%s>` có cùng name được mount cùng lúc." {/*two-viewtransition-with-same-name*/}

Lỗi này xảy ra khi hai component `<ViewTransition>` có cùng `name` được mount cùng lúc:

```js [3]
function Item() {
  // 🚩 Tất cả item sẽ nhận cùng một "name".
  return <ViewTransition name="item">...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} />
      ))}
    </>
  );
}
```

Điều này sẽ khiến View Transition gặp lỗi. Trong development, React phát hiện vấn đề này để hiển thị và ghi log hai lỗi:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

Có hai component `<ViewTransition name=%s>` có cùng name được mount cùng lúc. Điều này không được hỗ trợ và sẽ khiến View Transitions gặp lỗi. Hãy thử sử dụng name độc đáo hơn, chẳng hạn bằng cách dùng namespace prefix và thêm id của một item vào name.
{' '}at Item
{' '}at ItemList

</ConsoleLogLine>

<ConsoleLogLine level="error">

`<ViewTransition name=%s>` trùng lặp hiện có có stack trace sau.
{' '}at Item
{' '}at ItemList

</ConsoleLogLine>
</ConsoleBlockMulti>

Để khắc phục, hãy bảo đảm tại một thời điểm chỉ có một `<ViewTransition>` có cùng name được mount trong toàn bộ app, bằng cách bảo đảm `name` là duy nhất hoặc thêm `id` vào name:

```js [3]
function Item({id}) {
  // ✅ Mỗi item sẽ nhận một name duy nhất.
  return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </>
  );
}
```
