---
title: Render và Commit
---

<Intro>

Trước khi các component của bạn được hiển thị trên màn hình, chúng phải được React render. Hiểu các bước trong quá trình này sẽ giúp bạn hình dung cách code được thực thi và giải thích hành vi của code.

</Intro>

<YouWillLearn>

* Render có nghĩa là gì trong React
* Khi nào và tại sao React render một component
* Các bước cần thực hiện để hiển thị một component trên màn hình
* Tại sao việc render không phải lúc nào cũng tạo ra cập nhật DOM

</YouWillLearn>

Hãy tưởng tượng các component của bạn là những đầu bếp trong bếp, lắp ráp các món ăn ngon từ những nguyên liệu. Trong tình huống này, React là người phục vụ nhận yêu cầu từ khách hàng và mang món ăn đến cho họ. Quá trình yêu cầu và phục vụ UI này gồm ba bước:

1. **Kích hoạt** việc render (chuyển yêu cầu của khách đến bếp)
2. **Render** component (chuẩn bị món ăn trong bếp)
3. **Commit** vào DOM (đặt món ăn lên bàn)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Bước 1: Kích hoạt việc render {/*step-1-trigger-a-render*/}

Có hai lý do khiến một component được render:

1. Đó là **lần render đầu tiên của component.**
2. **State của component (hoặc một trong các component tổ tiên của nó) đã được cập nhật.**

### Lần render đầu tiên {/*initial-render*/}

Khi ứng dụng khởi động, bạn cần kích hoạt lần render đầu tiên. Các framework và sandbox đôi khi ẩn đoạn code này, nhưng thực chất nó được thực hiện bằng cách gọi [`createRoot`](/reference/react-dom/client/createRoot) với node DOM đích, sau đó gọi phương thức `render` của nó với component của bạn:

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

Hãy thử comment lệnh gọi `root.render()` và xem component biến mất!

### Render lại khi state được cập nhật {/*re-renders-when-state-updates*/}

Sau khi component đã được render lần đầu, bạn có thể kích hoạt các lần render tiếp theo bằng cách cập nhật state của nó bằng hàm [`set`. ](/reference/react/useState#setstate) Việc cập nhật state của component sẽ tự động đưa một lần render vào hàng đợi. (Bạn có thể hình dung rằng khách trong nhà hàng gọi thêm trà, món tráng miệng và đủ thứ sau khi đã gọi món đầu tiên, tùy thuộc vào mức độ khát hoặc đói của họ.)

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. The patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Bước 2: React render các component của bạn {/*step-2-react-renders-your-components*/}

Sau khi bạn kích hoạt việc render, React sẽ gọi các component của bạn để xác định nội dung cần hiển thị trên màn hình. **“Render” là việc React gọi các component của bạn.**

* **Trong lần render đầu tiên,** React sẽ gọi component gốc.
* **Trong các lần render tiếp theo,** React sẽ gọi function component có state update đã kích hoạt lần render đó.

Quá trình này mang tính đệ quy: nếu component được cập nhật trả về một component khác, React sẽ render _component đó_ tiếp theo; nếu component đó cũng trả về một giá trị nào đó, React sẽ render _component đó_ tiếp theo, và cứ như vậy. Quá trình sẽ tiếp tục cho đến khi không còn component lồng nhau nào nữa và React biết chính xác nội dung cần hiển thị trên màn hình.

Trong ví dụ sau, React sẽ gọi `Gallery()` và `Image()` nhiều lần:

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **Trong lần render đầu tiên,** React sẽ [tạo các node DOM](https://developer.mozilla.org/docs/Web/API/Document/createElement) cho `<section>`, `<h1>` và ba thẻ `<img>`.
* **Trong một lần render lại,** React sẽ tính toán xem có thuộc tính nào của chúng đã thay đổi kể từ lần render trước hay không. React sẽ chưa làm gì với thông tin đó cho đến bước tiếp theo, tức giai đoạn commit.

<Pitfall>

Việc render luôn phải là một [phép tính thuần túy](/learn/keeping-components-pure):

* **Cùng đầu vào, cùng đầu ra.** Với cùng các đầu vào, một component luôn phải trả về cùng một JSX. (Khi ai đó gọi một món salad có cà chua, họ không nên nhận được món salad có hành tây!)
* **Chỉ xử lý công việc của mình.** Component không được thay đổi bất kỳ object hoặc biến nào đã tồn tại trước khi render. (Một đơn gọi món không nên làm thay đổi đơn gọi món của người khác.)

Nếu không, bạn có thể gặp phải các bug khó hiểu và hành vi không thể dự đoán khi codebase ngày càng phức tạp. Khi phát triển ở “Strict Mode”, React gọi hàm của mỗi component hai lần, điều này có thể giúp phát hiện các lỗi do các hàm không thuần túy gây ra.

</Pitfall>

<DeepDive>

#### Tối ưu hiệu suất {/*optimizing-performance*/}

Hành vi mặc định là render tất cả component được lồng bên trong component đã cập nhật sẽ không tối ưu về hiệu suất nếu component được cập nhật nằm rất cao trong cây. Nếu gặp vấn đề về hiệu suất, có một số cách tùy chọn để giải quyết được mô tả trong phần [Hiệu suất](https://reactjs.org/docs/optimizing-performance.html). **Đừng tối ưu quá sớm!**

</DeepDive>

## Bước 3: React commit các thay đổi vào DOM {/*step-3-react-commits-changes-to-the-dom*/}

Sau khi render (gọi) các component của bạn, React sẽ sửa đổi DOM.

* **Trong lần render đầu tiên,** React sẽ sử dụng [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API để đưa tất cả node DOM mà nó đã tạo lên màn hình.
* **Trong các lần render lại,** React sẽ áp dụng những thao tác tối thiểu cần thiết (được tính toán trong quá trình render!) để khiến DOM khớp với kết quả render mới nhất.

**React chỉ thay đổi các node DOM nếu có sự khác biệt giữa các lần render.** Ví dụ, dưới đây là một component được render lại mỗi giây với các props khác nhau được truyền từ component cha. Hãy chú ý rằng bạn có thể thêm một đoạn văn bản vào `<input>`, cập nhật `value` của nó, nhưng văn bản đó không biến mất khi component được render lại:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
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
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

Điều này hoạt động vì trong bước cuối cùng này, React chỉ cập nhật nội dung của `<h1>` bằng `time` mới. React nhận thấy `<input>` xuất hiện trong JSX ở cùng vị trí như lần trước, nên React không chạm vào `<input>`—hoặc `value` của nó!

## Phần kết: Trình duyệt vẽ lại {/*epilogue-browser-paint*/}

Sau khi quá trình render hoàn tất và React cập nhật DOM, trình duyệt sẽ vẽ lại màn hình. Mặc dù quá trình này được gọi là “browser rendering”, chúng ta sẽ gọi nó là “painting” để tránh nhầm lẫn trong toàn bộ tài liệu.

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Mọi cập nhật màn hình trong ứng dụng React đều diễn ra qua ba bước:
  1. Trigger
  2. Render
  3. Commit
* Bạn có thể sử dụng Strict Mode để tìm lỗi trong các component của mình
* React không chạm vào DOM nếu kết quả render giống với lần trước

</Recap>