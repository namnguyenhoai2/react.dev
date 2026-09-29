---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` có thể làm giảm hiệu năng. Khi có thể, hãy ưu tiên [`useEffect`](/reference/react/useEffect).

</Pitfall>

<Intro>

`useLayoutEffect` là một phiên bản của [`useEffect`](/reference/react/useEffect) được thực thi trước khi trình duyệt vẽ lại màn hình.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Gọi `useLayoutEffect` để thực hiện các phép đo layout trước khi trình duyệt vẽ lại màn hình:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[Xem thêm ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `setup`: Hàm chứa logic của Effect. Hàm setup của bạn cũng có thể tùy chọn trả về một hàm *cleanup*. Sau khi [component commits](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom) vào DOM và trước khi trình duyệt vẽ lại màn hình, React sẽ chạy hàm setup của bạn. Sau mỗi commit có các dependency thay đổi, trước tiên React sẽ chạy hàm cleanup (nếu bạn cung cấp) với các giá trị cũ, sau đó chạy hàm setup với các giá trị mới. Trước khi component của bạn bị xóa khỏi DOM, React sẽ chạy hàm cleanup.

* **tùy chọn** `dependencies`: Danh sách tất cả các giá trị reactive được tham chiếu bên trong code `setup`. Các giá trị reactive bao gồm props, state và tất cả biến cũng như hàm được khai báo trực tiếp bên trong phần thân component. Nếu linter của bạn được [configured for React](/learn/editor-setup#linting), nó sẽ kiểm tra để đảm bảo mọi giá trị reactive đều được chỉ định chính xác dưới dạng dependency. Danh sách dependency phải có số lượng phần tử cố định và được viết inline như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó bằng phép so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Nếu bạn bỏ qua đối số này, Effect của bạn sẽ chạy lại sau mỗi commit của component.

#### Giá trị trả về {/*returns*/}

`useLayoutEffect` trả về `undefined`.

#### Lưu ý {/*caveats*/}

* `useLayoutEffect` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc các Hook riêng của bạn. Bạn không thể gọi nó bên trong vòng lặp hoặc điều kiện. Nếu cần làm vậy, hãy tách một component và chuyển Effect vào đó.

* Khi Strict Mode được bật, React sẽ **chạy thêm một chu kỳ setup+cleanup chỉ dành cho development** trước lần setup thực sự đầu tiên. Đây là một bài kiểm tra để đảm bảo logic cleanup của bạn “đối xứng” với logic setup và dừng hoặc hoàn tác mọi việc mà setup đang thực hiện. Nếu điều này gây ra vấn đề, [implement the cleanup function.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Nếu một số dependency của bạn là các object hoặc function được định nghĩa bên trong component, chúng có nguy cơ **khiến Effect chạy lại thường xuyên hơn mức cần thiết.** Để khắc phục, hãy loại bỏ các dependency [object](/reference/react/useEffect#removing-unnecessary-object-dependencies) và [function](/reference/react/useEffect#removing-unnecessary-function-dependencies) không cần thiết. Bạn cũng có thể [extract state updates](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) và [non-reactive logic](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) ra bên ngoài Effect.

* Effects **chỉ chạy trên client.** Chúng không chạy trong quá trình server rendering.

* Code bên trong `useLayoutEffect` và mọi state update được lên lịch từ đó **ngăn trình duyệt vẽ lại màn hình.** Khi sử dụng quá mức, điều này khiến ứng dụng của bạn chậm. Khi có thể, hãy ưu tiên [`useEffect`.](/reference/react/useEffect)

* Nếu bạn kích hoạt state update bên trong `useLayoutEffect`, React sẽ thực thi ngay lập tức tất cả Effect còn lại, bao gồm cả `useEffect`.

---

## Cách sử dụng {/*usage*/}

### Đo layout trước khi trình duyệt vẽ lại màn hình {/*measuring-layout-before-the-browser-repaints-the-screen*/}

Hầu hết component không cần biết vị trí và kích thước của chúng trên màn hình để quyết định nội dung cần render. Chúng chỉ trả về một số JSX. Sau đó, trình duyệt sẽ tính toán *layout* (vị trí và kích thước) của chúng rồi vẽ lại màn hình.

Đôi khi, như vậy vẫn chưa đủ. Hãy hình dung một tooltip xuất hiện cạnh một phần tử nào đó khi di chuột qua. Nếu có đủ không gian, tooltip sẽ xuất hiện phía trên phần tử, nhưng nếu không vừa, nó sẽ xuất hiện bên dưới. Để render tooltip ở đúng vị trí cuối cùng, bạn cần biết chiều cao của nó (tức là liệu nó có vừa ở phía trên hay không).

Để làm việc này, bạn cần render qua hai lượt:

1. Render tooltip ở bất kỳ đâu (kể cả với vị trí sai).
2. Đo chiều cao của nó và quyết định vị trí đặt tooltip.
3. Render *lại* tooltip ở đúng vị trí.

**Tất cả việc này phải diễn ra trước khi trình duyệt vẽ lại màn hình.** Bạn không muốn người dùng nhìn thấy tooltip di chuyển. Hãy gọi `useLayoutEffect` để thực hiện các phép đo layout trước khi trình duyệt vẽ lại màn hình:

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // You don't know real height yet

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Re-render now that you know the real height
  }, []);

  // ...use tooltipHeight in the rendering logic below...
}
```

Sau đây là cách hoạt động từng bước:

1. `Tooltip` render với `tooltipHeight = 0` ban đầu (vì vậy tooltip có thể được đặt sai vị trí).
2. React đặt nó vào DOM và chạy code trong `useLayoutEffect`.
3. `useLayoutEffect` của bạn [measures the height](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) của nội dung tooltip và kích hoạt việc render lại ngay lập tức.
4. `Tooltip` render lại với `tooltipHeight` thực tế (vì vậy tooltip được đặt đúng vị trí).
5. React cập nhật nó trong DOM, và cuối cùng trình duyệt hiển thị tooltip.

Di chuột qua các nút bên dưới để xem tooltip điều chỉnh vị trí tùy theo việc nó có vừa hay không:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Lưu ý rằng mặc dù component `Tooltip` phải render qua hai lượt (lượt đầu với `tooltipHeight` được khởi tạo thành `0`, sau đó là với chiều cao thực tế đã đo), bạn chỉ nhìn thấy kết quả cuối cùng. Đây là lý do bạn cần `useLayoutEffect` thay vì [`useEffect`](/reference/react/useEffect) cho ví dụ này. Hãy xem xét chi tiết sự khác biệt bên dưới.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` ngăn trình duyệt vẽ lại {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React đảm bảo rằng code bên trong `useLayoutEffect` và mọi state update được lên lịch bên trong nó sẽ được xử lý **trước khi trình duyệt vẽ lại màn hình.** Điều này cho phép bạn render tooltip, đo nó và render lại tooltip mà người dùng không nhận thấy lần render bổ sung đầu tiên. Nói cách khác, `useLayoutEffect` ngăn trình duyệt vẽ lại.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` không ngăn trình duyệt {/*useeffect-does-not-block-the-browser*/}

Đây là cùng một ví dụ, nhưng sử dụng [`useEffect`](/reference/react/useEffect) thay vì `useLayoutEffect`. Nếu bạn đang sử dụng thiết bị chậm hơn, đôi khi bạn có thể nhận thấy tooltip “nhấp nháy” và thoáng thấy vị trí ban đầu của nó trước khi chuyển sang vị trí đã được điều chỉnh.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Để dễ tái hiện lỗi hơn, phiên bản này thêm một khoảng trễ nhân tạo trong quá trình render. React sẽ cho phép trình duyệt vẽ màn hình trước khi xử lý state update bên trong `useEffect`. Do đó, tooltip sẽ nhấp nháy:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [10, 11]}} src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // This artificially slows down rendering
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Hãy chỉnh sửa ví dụ này để `useLayoutEffect` và quan sát rằng nó ngăn việc vẽ lại ngay cả khi quá trình render bị làm chậm.

<Solution />

</Recipes>

<Note>

Render qua hai lượt và ngăn trình duyệt vẽ lại sẽ làm giảm hiệu năng. Khi có thể, hãy cố gắng tránh việc này.

</Note>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi gặp lỗi: “`useLayoutEffect` không thực hiện gì trên server” {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

Mục đích của `useLayoutEffect` là cho phép component của bạn [use layout information for rendering:](#measuring-layout-before-the-browser-repaints-the-screen)

1. Render nội dung ban đầu.
2. Đo layout *trước khi trình duyệt vẽ lại màn hình.*
3. Render nội dung cuối cùng bằng thông tin layout bạn đã đọc.

Khi bạn hoặc framework của bạn sử dụng [server rendering](/reference/react-dom/server), ứng dụng React của bạn sẽ render thành HTML trên server cho lần render ban đầu. Điều này cho phép bạn hiển thị HTML ban đầu trước khi code JavaScript được tải.

Vấn đề là trên server không có thông tin về layout.

Trong [ví dụ trước đó](#measuring-layout-before-the-browser-repaints-the-screen), lệnh gọi `useLayoutEffect` trong component `Tooltip` cho phép nó tự định vị chính xác (ở trên hoặc bên dưới nội dung) tùy thuộc vào chiều cao của nội dung. Nếu bạn thử render `Tooltip` như một phần của HTML ban đầu trên server, bạn sẽ không thể xác định được điều này. Trên server chưa có layout! Vì vậy, ngay cả khi bạn render nó trên server, vị trí của nó vẫn sẽ “nhảy” trên client sau khi JavaScript được tải và chạy.

Thông thường, các component phụ thuộc vào thông tin layout ohnehin không cần được render trên server. Ví dụ, việc hiển thị `Tooltip` trong lần render ban đầu có lẽ không có ý nghĩa. Nó được kích hoạt bởi một tương tác của client.

Tuy nhiên, nếu bạn gặp phải vấn đề này, bạn có một vài lựa chọn khác nhau:

- Thay `useLayoutEffect` bằng [`useEffect`.](/reference/react/useEffect) Điều này cho React biết rằng có thể hiển thị kết quả render ban đầu mà không chặn quá trình vẽ (vì HTML ban đầu sẽ hiển thị trước khi Effect của bạn chạy).

- Hoặc gọi [`use(browser())`](/reference/react/use#use-browser) để đánh dấu component là chỉ dành cho trình duyệt. Trong quá trình server rendering, React sẽ thay thế nội dung của nó cho đến boundary [`<Suspense>`](/reference/react/Suspense) gần nhất bằng một loading fallback (chẳng hạn như spinner hoặc hiệu ứng lấp lánh).

- Hoặc [đánh dấu component của bạn là chỉ dành cho client.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) Điều này cho React biết rằng trong quá trình server rendering, nó sẽ thay thế nội dung của component cho đến boundary `<Suspense>` gần nhất bằng một loading fallback.

- Hoặc bạn có thể chỉ render một component có `useLayoutEffect` sau khi hydration. Hãy duy trì một state boolean `isMounted` được khởi tạo bằng `false`, rồi đặt nó thành `true` bên trong một lệnh gọi `useEffect`. Khi đó, logic rendering của bạn có thể giống như `return isMounted ? <RealContent /> : <FallbackContent />`. Trên server và trong quá trình hydration, người dùng sẽ thấy `FallbackContent`, thành phần này không được gọi `useLayoutEffect`. Sau đó, React sẽ thay thế nó bằng `RealContent`, thành phần này chỉ chạy trên client và có thể bao gồm các lệnh gọi `useLayoutEffect`.

- Nếu bạn đồng bộ component với một external data store và dựa vào `useLayoutEffect` vì những lý do khác ngoài việc đo layout, hãy cân nhắc [`useSyncExternalStore`](/reference/react/useSyncExternalStore) thay thế, vì [hỗ trợ server rendering.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)