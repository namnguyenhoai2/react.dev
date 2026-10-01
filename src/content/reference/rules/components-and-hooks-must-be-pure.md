---
title: Components và Hooks phải thuần túy
---

<Intro>
Các hàm thuần túy chỉ thực hiện một phép tính và không làm gì hơn. Điều này giúp code của bạn dễ hiểu, dễ debug hơn, đồng thời cho phép React tự động tối ưu Components và Hooks của bạn một cách chính xác.
</Intro>

<Note>
Trang tham chiếu này đề cập đến các chủ đề nâng cao và yêu cầu bạn đã quen thuộc với các khái niệm được trình bày trong trang [Giữ Components thuần túy](/learn/keeping-components-pure).
</Note>

<InlineToc />

### Tại sao tính thuần túy lại quan trọng? {/*why-does-purity-matter*/}

Một trong những khái niệm cốt lõi làm nên React, _React_, là _tính thuần túy_. Một component hoặc hook thuần túy là một component hoặc hook:

* **Idempotent** – Bạn [luôn nhận được cùng một kết quả trong mỗi lần](/learn/keeping-components-pure#purity-components-as-formulas) chạy nó với cùng các đầu vào – props, state, context đối với đầu vào của component; và các đối số đối với đầu vào của hook.
* **Không có side effect trong quá trình render** – Code có side effect nên chạy [**tách biệt với quá trình render**](#how-does-react-run-your-code). Ví dụ như trong một [event handler](/learn/responding-to-events) – nơi người dùng tương tác với UI và khiến UI cập nhật; hoặc trong một [Effect](/reference/react/useEffect) – chạy sau quá trình render.
* **Không mutate các giá trị không cục bộ**: Components và Hooks không nên [bao giờ thay đổi các giá trị không được tạo cục bộ](#mutation) trong quá trình render.

Khi quá trình render được giữ thuần túy, React có thể hiểu cách ưu tiên những cập nhật quan trọng nhất để người dùng nhìn thấy trước. Điều này có được nhờ tính thuần túy của quá trình render: vì components không có side effect [trong quá trình render](#how-does-react-run-your-code), React có thể tạm dừng việc render những components chưa cần cập nhật và chỉ quay lại với chúng khi cần.

Cụ thể, điều này có nghĩa là logic render có thể được chạy nhiều lần theo cách cho phép React mang lại trải nghiệm dễ chịu cho người dùng. Tuy nhiên, nếu component của bạn có một side effect không được theo dõi – chẳng hạn như sửa đổi giá trị của một biến toàn cục [trong quá trình render](#how-does-react-run-your-code) – khi React chạy lại code render, các side effect của bạn sẽ được kích hoạt theo cách không khớp với mong muốn. Điều này thường dẫn đến các bug không mong muốn, có thể làm giảm chất lượng trải nghiệm của người dùng với app của bạn. Bạn có thể xem [ví dụ về điều này trong trang Giữ Components thuần túy](/learn/keeping-components-pure#side-effects-unintended-consequences).

#### React chạy code của bạn như thế nào? {/*how-does-react-run-your-code*/}

React mang tính khai báo: bạn cho React biết _cần render gì_, và React sẽ xác định _cách tốt nhất_ để hiển thị điều đó cho người dùng. Để thực hiện việc này, React có một vài phase trong đó nó chạy code của bạn. Bạn không cần biết tất cả các phase này để sử dụng React hiệu quả. Nhưng ở mức khái quát, bạn nên biết code nào chạy trong _render_ và code nào chạy bên ngoài nó.

_Rendering_ là quá trình tính toán xem phiên bản UI tiếp theo của bạn nên trông như thế nào. Sau khi render, React lấy phép tính mới này và so sánh với phép tính được dùng để tạo phiên bản UI trước đó của bạn. Sau đó React chỉ commit những thay đổi tối thiểu cần thiết vào [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (những gì người dùng thực sự nhìn thấy) để áp dụng các thay đổi. Cuối cùng, [Effects](/learn/synchronizing-with-effects) được flush (nghĩa là được chạy cho đến khi không còn Effect nào). Để biết thông tin chi tiết hơn, hãy xem tài liệu về [Render](/learn/render-and-commit) và [Commit và Effect Hooks](/reference/react/hooks#effect-hooks).

<DeepDive>

#### Cách xác định code có chạy trong quá trình render hay không {/*how-to-tell-if-code-runs-in-render*/}

Một heuristic nhanh để xác định code có chạy trong quá trình render hay không là xem xét vị trí của nó: nếu nó được viết ở cấp cao nhất như trong ví dụ bên dưới, rất có khả năng nó chạy trong quá trình render.

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // được tạo trong quá trình render
  // ...
}
```

Event handlers và Effects không chạy trong quá trình render:

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // code này nằm trong event handler, nên chỉ chạy khi người dùng kích hoạt handler
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // code này nằm trong Effect, nên chỉ chạy sau khi render
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## Components và Hooks phải có tính idempotent {/*components-and-hooks-must-be-idempotent*/}

Components phải luôn trả về cùng một output tương ứng với các đầu vào của chúng – props, state và context. Đây được gọi là _tính idempotent_. [Idempotent](https://en.wikipedia.org/wiki/Idempotence) là một thuật ngữ phổ biến trong lập trình hàm. Thuật ngữ này nói đến ý tưởng rằng bạn [luôn nhận được cùng một kết quả trong mỗi lần](learn/keeping-components-pure) chạy đoạn code đó với cùng các đầu vào.

Điều này có nghĩa là _mọi_ code chạy [trong quá trình render](#how-does-react-run-your-code) cũng phải có tính idempotent để quy tắc này được đảm bảo. Ví dụ, dòng code sau không có tính idempotent (và do đó component cũng không có tính idempotent):

```js {2}
function Clock() {
  const time = new Date(); // 🔴 Không tốt: luôn trả về kết quả khác nhau!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` không có tính idempotent vì nó luôn trả về ngày hiện tại và thay đổi kết quả mỗi khi được gọi. Khi bạn render component ở trên, thời gian hiển thị trên màn hình sẽ bị cố định ở thời điểm component được render. Tương tự, các hàm như `Math.random()` cũng không có tính idempotent, vì chúng trả về các kết quả khác nhau mỗi khi được gọi, ngay cả khi các đầu vào giống nhau.

Điều này không có nghĩa là bạn hoàn toàn không nên sử dụng các hàm không có tính idempotent như `new Date()` – bạn chỉ nên tránh sử dụng chúng [trong quá trình render](#how-does-react-run-your-code). Trong trường hợp này, chúng ta có thể _đồng bộ hóa_ ngày mới nhất với component này bằng một [Effect](/reference/react/useEffect):

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Theo dõi state của ngày hiện tại. `useState` nhận một hàm khởi tạo làm state ban đầu.
  //    Hàm này chỉ chạy một lần khi Hook được gọi, nên ban đầu chỉ ngày hiện tại tại thời điểm
  //    Hook được gọi mới được thiết lập.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Cập nhật ngày hiện tại mỗi giây bằng `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Tốt: code không idempotent không còn chạy trong quá trình render
    }, 1000);
    // 3. Trả về hàm dọn dẹp để tránh rò rỉ timer `setInterval`.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

Bằng cách bọc lệnh gọi `new Date()` không có tính idempotent trong một Effect, phép tính đó được chuyển [ra ngoài quá trình render](#how-does-react-run-your-code).

Nếu bạn không cần đồng bộ hóa một state bên ngoài nào đó với React, bạn cũng có thể cân nhắc sử dụng một [event handler](/learn/responding-to-events) nếu state đó chỉ cần được cập nhật để phản hồi một tương tác của người dùng.

---

## Side effect phải chạy bên ngoài quá trình render {/*side-effects-must-run-outside-of-render*/}

[Side effect](/learn/keeping-components-pure#side-effects-unintended-consequences) không nên chạy [trong quá trình render](#how-does-react-run-your-code), vì React có thể render components nhiều lần để tạo ra trải nghiệm người dùng tốt nhất có thể.

<Note>
Side effect là một thuật ngữ rộng hơn Effect. Effect cụ thể đề cập đến code được bọc trong `useEffect`, trong khi side effect là thuật ngữ chung cho code tạo ra bất kỳ tác động có thể quan sát nào ngoài kết quả chính là trả về một giá trị cho caller.

Side effect thường được viết bên trong [event handlers](/learn/responding-to-events) hoặc Effects. Nhưng tuyệt đối không được viết trong quá trình render.
</Note>

Mặc dù quá trình render phải được giữ thuần túy, side effect vẫn cần thiết ở một thời điểm nào đó để app của bạn có thể thực hiện những việc thú vị, chẳng hạn như hiển thị nội dung trên màn hình! Điểm mấu chốt của quy tắc này là side effect không nên chạy [trong quá trình render](#how-does-react-run-your-code), vì React có thể render components nhiều lần. Trong hầu hết trường hợp, bạn sẽ sử dụng [event handlers](learn/responding-to-events) để xử lý side effect. Việc sử dụng event handler cho React biết một cách rõ ràng rằng code này không cần chạy trong quá trình render, nhờ đó giữ cho quá trình render thuần túy. Nếu bạn đã thử mọi lựa chọn – và chỉ sử dụng như phương án cuối cùng – bạn cũng có thể xử lý side effect bằng `useEffect`.

### Khi nào mutation là hợp lệ? {/*mutation*/}

#### Mutation cục bộ {/*local-mutation*/}
Một ví dụ phổ biến về side effect là mutation, trong JavaScript có nghĩa là thay đổi giá trị của một giá trị không phải [primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive). Nhìn chung, mặc dù mutation không phải là cách làm theo thông lệ trong React, mutation _cục bộ_ hoàn toàn hợp lệ:

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ Tốt: được tạo cục bộ
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ Tốt: mutation cục bộ là hợp lệ
  }
  return <section>{items}</section>;
}
```

Không cần phải làm code của bạn trở nên phức tạp để tránh mutation cục bộ. [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) cũng có thể được dùng ở đây để viết ngắn gọn hơn, nhưng không có gì sai khi tạo một array cục bộ rồi thêm các item vào đó bằng push [trong quá trình render](#how-does-react-run-your-code).

Mặc dù có vẻ như chúng ta đang mutate `items`, điểm mấu chốt cần lưu ý là code này chỉ làm vậy _cục bộ_ – mutation không được “ghi nhớ” khi component được render lại. Nói cách khác, `items` chỉ tồn tại chừng nào component còn tồn tại. Vì `items` luôn được _tạo lại_ mỗi khi `<FriendList />` được render, component sẽ luôn trả về cùng một kết quả.

Mặt khác, nếu `items` được tạo bên ngoài component, nó sẽ giữ lại các giá trị trước đó và ghi nhớ các thay đổi:

```js {1,7}
const items = []; // 🔴 Không tốt: được tạo bên ngoài component
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 Không tốt: thay đổi một giá trị được tạo bên ngoài quá trình render
  }
  return <section>{items}</section>;
}
```

Khi `<FriendList />` chạy lại, chúng ta sẽ tiếp tục nối thêm `friends` vào `items` mỗi lần component đó được chạy, dẫn đến nhiều kết quả bị trùng lặp. Phiên bản `<FriendList />` này có các side effect có thể quan sát được [trong quá trình render](#how-does-react-run-your-code) và **vi phạm quy tắc**.

#### Khởi tạo lazy {/*lazy-initialization*/}

Khởi tạo lazy cũng hợp lệ dù không hoàn toàn "pure":

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Tốt: nếu không ảnh hưởng đến các component khác
  // Tiếp tục render...
}
```

#### Thay đổi DOM {/*changing-the-dom*/}

Các side effect hiển thị trực tiếp cho người dùng không được phép xuất hiện trong logic render của các React component. Nói cách khác, chỉ việc gọi một hàm component không nên tự nó tạo ra thay đổi trên màn hình.

```js {2}
function ProductDetailPage({ product }) {
  document.title = product.title; // 🔴 Không tốt: Thay đổi DOM
}
```

Một cách để đạt được kết quả mong muốn là cập nhật `document.title` bên ngoài render bằng cách [đồng bộ hóa component với `document`](/learn/synchronizing-with-effects).

Miễn là việc gọi một component nhiều lần vẫn an toàn và không ảnh hưởng đến việc render của các component khác, React không quan tâm component đó có 100% pure theo nghĩa nghiêm ngặt của lập trình hàm hay không. Điều quan trọng hơn là [các component phải idempotent](/reference/rules/components-and-hooks-must-be-pure).

---

## Props và state là bất biến {/*props-and-state-are-immutable*/}

Props và state của một component là các [snapshot](learn/state-as-a-snapshot) bất biến. Không bao giờ được trực tiếp thay đổi chúng. Thay vào đó, hãy truyền các props mới xuống và sử dụng hàm setter từ `useState`.

Bạn có thể xem các giá trị props và state như những snapshot được cập nhật sau khi render. Vì lý do này, bạn không sửa đổi trực tiếp các biến props hoặc state: thay vào đó, hãy truyền các props mới hoặc sử dụng hàm setter được cung cấp để cho React biết rằng state cần được cập nhật vào lần tiếp theo component được render.

### Không thay đổi Props {/*props*/}
Props là bất biến vì nếu bạn thay đổi chúng, ứng dụng sẽ tạo ra kết quả không nhất quán. Điều này có thể khó debug vì ứng dụng có thể hoạt động hoặc không, tùy thuộc vào hoàn cảnh.

```js {expectedErrors: {'react-compiler': [2]}} {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Không tốt: không bao giờ thay đổi trực tiếp props
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Tốt: hãy tạo bản sao thay thế
  return <Link url={url}>{item.title}</Link>;
}
```

### Không thay đổi State {/*state*/}
`useState` trả về biến state và một setter để cập nhật state đó.

```js
const [stateVariable, setter] = useState(0);
```

Thay vì cập nhật trực tiếp biến state, chúng ta cần cập nhật nó bằng hàm setter được trả về bởi `useState`. Việc thay đổi các giá trị trên biến state không khiến component cập nhật, khiến người dùng của bạn thấy một UI lỗi thời. Việc sử dụng hàm setter thông báo cho React rằng state đã thay đổi và chúng ta cần xếp hàng một lần re-render để cập nhật UI.

```js {expectedErrors: {'react-compiler': [2, 5]}} {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 Không tốt: không bao giờ thay đổi trực tiếp state
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Tốt: dùng hàm setter do useState trả về
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

---

## Giá trị trả về và đối số của Hooks là bất biến {/*return-values-and-arguments-to-hooks-are-immutable*/}

Một khi các giá trị đã được truyền vào một hook, bạn không nên sửa đổi chúng. Giống như props trong JSX, các giá trị trở nên bất biến khi được truyền vào một hook.

```js {expectedErrors: {'react-compiler': [4]}} {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 Không tốt: không bao giờ thay đổi trực tiếp đối số của Hook
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ Tốt: hãy tạo bản sao thay thế
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

Một nguyên tắc quan trọng trong React là _suy luận cục bộ_: khả năng hiểu một component hoặc hook thực hiện điều gì bằng cách xem xét riêng code của nó. Hooks nên được xem như những "hộp đen" khi được gọi. Ví dụ, một custom hook có thể đã sử dụng các đối số của nó làm dependency để memoize các giá trị bên trong:

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

Nếu bạn thay đổi các đối số của Hook, cơ chế memoization của custom hook sẽ trở nên không chính xác, vì vậy điều quan trọng là tránh làm như vậy.

```js {4}
style = useIconStyle(icon);         // `style` được memoize dựa trên `icon`
icon.enabled = false;               // Không tốt: 🔴 không bao giờ thay đổi trực tiếp đối số của Hook
style = useIconStyle(icon);         // kết quả đã memoize trước đó được trả về
```

```js {4}
style = useIconStyle(icon);         // `style` được memoize dựa trên `icon`
icon = { ...icon, enabled: false }; // Tốt: ✅ hãy tạo bản sao thay thế
style = useIconStyle(icon);         // giá trị mới của `style` được tính toán
```

Tương tự, điều quan trọng là không sửa đổi các giá trị trả về của Hooks, vì chúng có thể đã được memoize.

---

## Giá trị là bất biến sau khi được truyền vào JSX {/*values-are-immutable-after-being-passed-to-jsx*/}

Không thay đổi các giá trị sau khi chúng đã được sử dụng trong JSX. Hãy chuyển thao tác thay đổi đến trước khi JSX được tạo.

Khi bạn sử dụng JSX trong một biểu thức, React có thể eager evaluate JSX trước khi component hoàn tất quá trình render. Điều này có nghĩa là việc thay đổi các giá trị sau khi chúng đã được truyền vào JSX có thể dẫn đến UI lỗi thời, vì React sẽ không biết cần cập nhật output của component.

```js {expectedErrors: {'react-compiler': [4]}} {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 Không tốt: styles đã được dùng trong JSX bên trên
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ Tốt: ta đã tạo một giá trị mới
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```
