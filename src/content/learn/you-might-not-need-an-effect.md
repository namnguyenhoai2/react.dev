---
title: 'Bạn có thể không cần Effect'
---

<Intro>

Effect là một lối thoát khỏi mô hình React. Chúng cho phép bạn “bước ra ngoài” React và đồng bộ hóa các component của mình với một hệ thống bên ngoài, chẳng hạn như widget không phải React, mạng hoặc DOM của trình duyệt. Nếu không có hệ thống bên ngoài nào liên quan (ví dụ: nếu bạn muốn cập nhật state của một component khi một props hoặc state nào đó thay đổi), bạn không cần Effect. Loại bỏ các Effect không cần thiết sẽ giúp code của bạn dễ theo dõi hơn, chạy nhanh hơn và ít lỗi hơn.

</Intro>

<YouWillLearn>

* Tại sao và cách loại bỏ các Effect không cần thiết khỏi component
* Cách cache các phép tính tốn kém mà không cần Effect
* Cách reset và điều chỉnh state của component mà không cần Effect
* Cách chia sẻ logic giữa các event handler
* Logic nào nên được chuyển vào event handler
* Cách thông báo cho component cha về các thay đổi

</YouWillLearn>

## Cách loại bỏ các Effect không cần thiết {/*how-to-remove-unnecessary-effects*/}

Có hai trường hợp phổ biến mà bạn không cần Effect:

* **Bạn không cần Effect để biến đổi dữ liệu phục vụ việc render.** Ví dụ, giả sử bạn muốn lọc một danh sách trước khi hiển thị. Bạn có thể muốn viết một Effect để cập nhật một biến state khi danh sách thay đổi. Tuy nhiên, cách này không hiệu quả. Khi bạn cập nhật state, trước tiên React sẽ gọi các hàm component của bạn để tính toán nội dung cần xuất hiện trên màn hình. Sau đó React sẽ ["commit"](/learn/render-and-commit) các thay đổi này vào DOM, cập nhật màn hình. Tiếp đó React sẽ chạy các Effect của bạn. Nếu Effect của bạn *cũng* ngay lập tức cập nhật state, toàn bộ quá trình sẽ khởi động lại từ đầu! Để tránh các lượt render không cần thiết, hãy biến đổi toàn bộ dữ liệu ở cấp cao nhất của component. Code đó sẽ tự động chạy lại mỗi khi props hoặc state của bạn thay đổi.
* **Bạn không cần Effect để xử lý các sự kiện của người dùng.** Ví dụ, giả sử bạn muốn gửi một `/api/buy` POST request và hiển thị thông báo khi người dùng mua một sản phẩm. Trong event handler cho sự kiện nhấp vào nút Buy, bạn biết chính xác chuyện gì đã xảy ra. Khi Effect chạy, bạn không biết *người dùng đã làm gì* (ví dụ: nút nào đã được nhấp). Vì vậy, bạn thường sẽ xử lý các sự kiện của người dùng trong event handler tương ứng.

Bạn *có* cần Effect để [đồng bộ hóa](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) với các hệ thống bên ngoài. Ví dụ, bạn có thể viết một Effect để giữ cho widget jQuery được đồng bộ với state React. Bạn cũng có thể fetch dữ liệu bằng Effect: chẳng hạn, bạn có thể đồng bộ kết quả tìm kiếm với truy vấn tìm kiếm hiện tại. Hãy nhớ rằng các [framework](/learn/creating-a-react-app#full-stack-frameworks) hiện đại cung cấp các cơ chế fetch dữ liệu tích hợp hiệu quả hơn so với việc viết Effect trực tiếp trong component.

Để giúp bạn hình thành trực giác đúng đắn, hãy cùng xem một số ví dụ cụ thể phổ biến!

### Cập nhật state dựa trên props hoặc state {/*updating-state-based-on-props-or-state*/}

Giả sử bạn có một component với hai biến state: `firstName` và `lastName`. Bạn muốn tính một `fullName` từ chúng bằng cách nối chúng lại với nhau. Ngoài ra, bạn muốn `fullName` được cập nhật mỗi khi `firstName` hoặc `lastName` thay đổi. Phản xạ đầu tiên của bạn có thể là thêm một biến state `fullName` và cập nhật nó trong một Effect:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Cách này phức tạp hơn mức cần thiết. Nó cũng không hiệu quả: trước tiên, nó thực hiện toàn bộ một lượt render với giá trị cũ của `fullName`, rồi ngay lập tức render lại với giá trị đã cập nhật. Hãy xóa biến state và Effect:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Khi một giá trị có thể được tính từ props hoặc state hiện có, [đừng đưa nó vào state.](/learn/choosing-the-state-structure#avoid-redundant-state) Thay vào đó, hãy tính giá trị đó trong quá trình render.** Cách này giúp code chạy nhanh hơn (tránh các cập nhật “dây chuyền” bổ sung), đơn giản hơn (loại bỏ một phần code) và ít lỗi hơn (tránh các lỗi do những biến state khác nhau không đồng bộ với nhau). Nếu cách tiếp cận này còn mới với bạn, [Thinking in React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) sẽ giải thích nội dung nào nên được đưa vào state.

### Cache các phép tính tốn kém {/*caching-expensive-calculations*/}

Component này tính `visibleTodos` bằng cách lấy `todos` nhận được thông qua props và lọc chúng theo prop `filter`. Bạn có thể muốn lưu kết quả vào state và cập nhật nó bằng một Effect:

```js {expectedErrors: {'react-compiler': [7]}} {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Giống như ví dụ trước, cách này vừa không cần thiết vừa không hiệu quả. Trước tiên, hãy xóa state và Effect:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Thông thường, code này là đủ tốt! Nhưng có thể `getFilteredTodos()` chạy chậm hoặc bạn có rất nhiều `todos`. Trong trường hợp đó, bạn không muốn tính lại `getFilteredTodos()` nếu một biến state không liên quan như `newTodo` đã thay đổi.

Bạn có thể cache (hay ["memoize"](https://en.wikipedia.org/wiki/Memoization)) một phép tính tốn kém bằng cách bọc nó trong một [`useMemo`](/reference/react/useMemo) Hook:

<Note>

[React Compiler](/learn/react-compiler) có thể tự động memoize các phép tính tốn kém cho bạn, loại bỏ nhu cầu `useMemo` thủ công trong nhiều trường hợp.

</Note>

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Does not re-run unless todos or filter change
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Hoặc viết trên một dòng:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Điều này cho React biết rằng bạn không muốn hàm bên trong chạy lại trừ khi `todos` hoặc `filter` thay đổi.** React sẽ ghi nhớ giá trị trả về của `getFilteredTodos()` trong lần render đầu tiên. Ở những lần render tiếp theo, nó sẽ kiểm tra xem `todos` hoặc `filter` có khác không. Nếu chúng giống lần trước, `useMemo` sẽ trả về kết quả cuối cùng mà nó đã lưu. Nhưng nếu chúng khác, React sẽ gọi lại hàm bên trong (và lưu kết quả của hàm đó).

Hàm bạn bọc trong [`useMemo`](/reference/react/useMemo) chạy trong quá trình render, vì vậy cách này chỉ hoạt động với các phép tính [thuần túy.](/learn/keeping-components-pure)

<DeepDive>

#### Làm thế nào để biết một phép tính có tốn kém hay không? {/*how-to-tell-if-a-calculation-is-expensive*/}

Nhìn chung, trừ khi bạn tạo hoặc lặp qua hàng nghìn object, phép tính đó có lẽ không tốn kém. Nếu muốn chắc chắn hơn, bạn có thể thêm một console log để đo thời gian dành cho một đoạn code:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Hãy thực hiện thao tác mà bạn đang đo (ví dụ: nhập vào input). Sau đó, bạn sẽ thấy các log như `filter array: 0.15ms` trong console. Nếu tổng thời gian được log cộng lại lên đến một mức đáng kể (chẳng hạn `1ms` hoặc hơn), việc memoize phép tính đó có thể hợp lý. Để thử nghiệm, bạn có thể bọc phép tính trong `useMemo` rồi kiểm tra xem tổng thời gian được log có giảm hay không đối với thao tác đó:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` sẽ không giúp lần render *đầu tiên* nhanh hơn. Nó chỉ giúp bạn bỏ qua công việc không cần thiết trong các lần cập nhật.

Hãy nhớ rằng máy của bạn có thể nhanh hơn máy của người dùng, vì vậy bạn nên kiểm tra hiệu năng với một mức làm chậm nhân tạo. Ví dụ, Chrome cung cấp tùy chọn [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) cho việc này.

Ngoài ra, hãy lưu ý rằng việc đo hiệu năng trong môi trường development sẽ không cho kết quả chính xác nhất. (Ví dụ, khi [Strict Mode](/reference/react/StrictMode) được bật, bạn sẽ thấy mỗi component render hai lần thay vì một lần.) Để có thời gian đo chính xác nhất, hãy build app cho production và kiểm tra trên một thiết bị tương tự thiết bị mà người dùng của bạn sử dụng.

</DeepDive>

### Reset toàn bộ state khi một prop thay đổi {/*resetting-all-state-when-a-prop-changes*/}

`ProfilePage` component này nhận một prop `userId`. Trang có một input để nhập comment, và bạn sử dụng biến state `comment` để lưu giá trị của nó. Một ngày nọ, bạn nhận thấy một vấn đề: khi chuyển từ profile này sang profile khác, state `comment` không được reset. Kết quả là bạn rất dễ vô tình đăng comment lên profile của người dùng sai. Để khắc phục vấn đề này, bạn muốn xóa biến state `comment` mỗi khi `userId` thay đổi:

```js {expectedErrors: {'react-compiler': [6]}} {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

Cách này không hiệu quả vì `ProfilePage` và các component con của nó trước tiên sẽ render với giá trị cũ, rồi lại render lần nữa. Cách này cũng phức tạp vì bạn sẽ phải thực hiện việc này trong *mọi* component có state bên trong `ProfilePage`. Ví dụ, nếu giao diện comment được lồng bên trong, bạn cũng sẽ muốn xóa state comment lồng bên trong.

Thay vào đó, bạn có thể cho React biết rằng profile của mỗi người dùng về mặt khái niệm là một profile _khác nhau_ bằng cách cung cấp cho nó một key tường minh. Hãy tách component thành hai component và truyền một thuộc tính `key` từ component bên ngoài vào component bên trong:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}
```

Thông thường, React giữ nguyên state khi cùng một component được render tại cùng một vị trí. **Bằng cách truyền `userId` dưới dạng một `key` cho component `Profile`, bạn đang yêu cầu React coi hai component `Profile` có `userId` khác nhau là hai component khác nhau và không nên dùng chung state.** Mỗi khi key (mà bạn đã đặt thành `userId`) thay đổi, React sẽ tạo lại DOM và [đặt lại state](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) của component `Profile` cùng tất cả component con của nó. Giờ đây, trường `comment` sẽ tự động được xóa khi điều hướng giữa các profile.

Lưu ý rằng trong ví dụ này, chỉ component `ProfilePage` bên ngoài được export và hiển thị với các file khác trong project. Các component render `ProfilePage` không cần truyền key cho nó: chúng truyền `userId` dưới dạng một prop thông thường. Việc `ProfilePage` truyền nó dưới dạng một `key` cho component `Profile` bên trong là một chi tiết triển khai.

### Điều chỉnh một phần state khi prop thay đổi {/*adjusting-some-state-when-a-prop-changes*/}

Đôi khi, bạn có thể muốn reset hoặc điều chỉnh một phần state khi prop thay đổi, nhưng không phải toàn bộ state.

Component `List` này nhận một danh sách `items` dưới dạng prop và duy trì item được chọn trong biến state `selection`. Bạn muốn reset `selection` về `null` bất cứ khi nào prop `items` nhận một array khác:

```js {expectedErrors: {'react-compiler': [7]}} {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: Adjusting state on prop change in an Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Cách này cũng chưa lý tưởng. Mỗi khi `items` thay đổi, `List` và các component con của nó trước tiên sẽ render với giá trị `selection` đã lỗi thời. Sau đó React sẽ cập nhật DOM và chạy các Effect. Cuối cùng, lệnh gọi `setSelection(null)` sẽ khiến `List` và các component con của nó render lại, rồi lại bắt đầu toàn bộ quy trình này.

Hãy bắt đầu bằng cách xóa Effect. Thay vào đó, điều chỉnh state trực tiếp trong quá trình rendering:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[Lưu trữ thông tin từ các lần render trước](/reference/react/useState#storing-information-from-previous-renders) như thế này có thể khó hiểu, nhưng vẫn tốt hơn việc cập nhật cùng một state trong Effect. Trong ví dụ trên, `setSelection` được gọi trực tiếp trong một lần render. React sẽ render lại `List` *ngay lập tức* sau khi nó thoát bằng câu lệnh `return`. React chưa render các component con `List` hoặc cập nhật DOM, vì vậy cách này cho phép các component con `List` bỏ qua việc render giá trị `selection` đã lỗi thời.

Khi bạn cập nhật một component trong quá trình rendering, React sẽ loại bỏ JSX được trả về và ngay lập tức thử render lại. Để tránh các lần thử lại dây chuyền rất chậm, React chỉ cho phép bạn cập nhật state của *chính component đó* trong quá trình render. Nếu bạn cập nhật state của một component khác trong quá trình render, bạn sẽ thấy lỗi. Một điều kiện như `items !== prevItems` là cần thiết để tránh vòng lặp. Bạn có thể điều chỉnh state theo cách này, nhưng mọi side effect khác (chẳng hạn như thay đổi DOM hoặc thiết lập timeout) nên nằm trong event handler hoặc Effect để [giữ cho các component thuần túy.](/learn/keeping-components-pure)

**Mặc dù pattern này hiệu quả hơn Effect, hầu hết component cũng không nên cần đến nó.** Dù thực hiện bằng cách nào, việc điều chỉnh state dựa trên props hoặc state khác đều khiến data flow khó hiểu và khó debug hơn. Luôn kiểm tra xem bạn có thể [reset toàn bộ state bằng một key](#resetting-all-state-when-a-prop-changes) hoặc [tính toán mọi thứ trong quá trình rendering](#updating-state-based-on-props-or-state) hay không. Ví dụ, thay vì lưu (và reset) *item* được chọn, bạn có thể lưu *ID của item* được chọn:

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Giờ đây hoàn toàn không cần “điều chỉnh” state nữa. Nếu item có ID được chọn nằm trong danh sách, nó vẫn được chọn. Nếu không, `selection` được tính toán trong quá trình rendering sẽ là `null` vì không tìm thấy item phù hợp. Hành vi này khác với trước, nhưng có thể tốt hơn vì hầu hết thay đổi đối với `items` đều giữ nguyên lựa chọn.

### Chia sẻ logic giữa các event handler {/*sharing-logic-between-event-handlers*/}

Giả sử bạn có một trang sản phẩm với hai nút (Buy và Checkout), cả hai đều cho phép bạn mua sản phẩm đó. Bạn muốn hiển thị một thông báo mỗi khi người dùng thêm sản phẩm vào giỏ hàng. Việc gọi `showNotification()` trong click handler của cả hai nút có vẻ lặp lại, vì vậy bạn có thể muốn đặt logic này trong một Effect:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

Effect này không cần thiết. Nó cũng rất có thể gây ra lỗi. Ví dụ, giả sử ứng dụng của bạn “ghi nhớ” giỏ hàng giữa các lần tải lại trang. Nếu bạn thêm một sản phẩm vào giỏ hàng rồi tải lại trang, thông báo sẽ xuất hiện lại. Nó sẽ tiếp tục xuất hiện mỗi lần bạn tải lại trang của sản phẩm đó. Điều này xảy ra vì `product.isInCart` đã `true` ngay khi trang được tải, nên Effect ở trên sẽ gọi `showNotification()`.

**Khi không chắc một đoạn code nên nằm trong Effect hay event handler, hãy tự hỏi *vì sao* đoạn code đó cần chạy. Chỉ sử dụng Effect cho code cần chạy *vì* component đã được hiển thị cho người dùng.** Trong ví dụ này, thông báo nên xuất hiện vì người dùng *nhấn nút*, không phải vì trang được hiển thị! Hãy xóa Effect và đặt logic dùng chung vào một function được gọi từ cả hai event handler:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

Cách này vừa loại bỏ Effect không cần thiết vừa sửa được lỗi.

### Gửi một POST request {/*sending-a-post-request*/}

Component `Form` này gửi hai loại POST request. Nó gửi một analytics event khi được mount. Khi bạn điền form và nhấp vào nút Submit, nó sẽ gửi một POST request đến endpoint `/api/register`:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

Hãy áp dụng cùng tiêu chí như trong ví dụ trước.

POST request analytics nên vẫn nằm trong Effect. Đó là vì _lý do_ gửi analytics event là form đã được hiển thị. (Trong development, nó sẽ chạy hai lần, nhưng [xem tại đây](/learn/synchronizing-with-effects#sending-analytics) để biết cách xử lý.)

Tuy nhiên, POST request `/api/register` không phải do form được _hiển thị_ gây ra. Bạn chỉ muốn gửi request vào một thời điểm cụ thể: khi người dùng nhấn nút. Nó chỉ nên xảy ra _trong đúng tương tác đó_. Hãy xóa Effect thứ hai và chuyển POST request đó vào event handler:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Khi quyết định đặt một logic trong event handler hay Effect, câu hỏi chính bạn cần trả lời là, từ góc nhìn của người dùng, đó là _loại logic nào_. Nếu logic này do một tương tác cụ thể gây ra, hãy giữ nó trong event handler. Nếu nó do người dùng _nhìn thấy_ component trên màn hình gây ra, hãy giữ nó trong Effect.

### Chuỗi các phép tính {/*chains-of-computations*/}

Đôi khi bạn có thể muốn nối các Effect, trong đó mỗi Effect điều chỉnh một phần state dựa trên state khác:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

Code này có hai vấn đề.

Vấn đề đầu tiên là nó rất kém hiệu quả: component (và các component con của nó) phải render lại giữa mỗi lần gọi `set` trong chuỗi. Trong ví dụ trên, ở trường hợp xấu nhất (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render), có ba lần render lại không cần thiết của cây bên dưới.

Vấn đề thứ hai là ngay cả khi code không chậm, khi code phát triển, bạn sẽ gặp những trường hợp “chuỗi” đã viết không còn phù hợp với các yêu cầu mới. Hãy tưởng tượng bạn thêm cách duyệt qua lịch sử các nước đi trong game. Bạn sẽ thực hiện việc này bằng cách cập nhật từng biến state thành một giá trị trong quá khứ. Tuy nhiên, việc đặt state `card` thành một giá trị trong quá khứ sẽ kích hoạt lại chuỗi Effect và thay đổi dữ liệu bạn đang hiển thị. Code như vậy thường cứng nhắc và dễ hỏng.

Trong trường hợp này, tốt hơn là tính toán những gì có thể trong quá trình rendering và điều chỉnh state trong event handler:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount < 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

Cách này hiệu quả hơn nhiều. Ngoài ra, nếu bạn triển khai tính năng xem lịch sử game, giờ đây bạn có thể đặt từng biến state thành một nước đi trong quá khứ mà không kích hoạt chuỗi Effect điều chỉnh mọi giá trị khác. Nếu cần sử dụng lại logic giữa nhiều event handler, bạn có thể [trích xuất một function](#sharing-logic-between-event-handlers) và gọi function đó từ các handler.

Hãy nhớ rằng bên trong event handler, [state hoạt động như một snapshot.](/learn/state-as-a-snapshot) Ví dụ, ngay cả sau khi bạn gọi `setRound(round + 1)`, biến `round` vẫn phản ánh giá trị tại thời điểm người dùng nhấp vào nút. Nếu cần sử dụng giá trị tiếp theo để tính toán, hãy tự định nghĩa nó như `const nextRound = round + 1`.

Trong một số trường hợp, bạn *không thể* tính toán state tiếp theo trực tiếp trong event handler. Ví dụ, hãy tưởng tượng một form có nhiều dropdown, trong đó các lựa chọn của dropdown tiếp theo phụ thuộc vào giá trị được chọn ở dropdown trước đó. Khi đó, chuỗi Effect là phù hợp vì bạn đang đồng bộ với network.

### Khởi tạo ứng dụng {/*initializing-the-application*/}

Một số logic chỉ nên chạy một lần khi ứng dụng tải.

Bạn có thể muốn đặt logic đó trong một Effect ở component cấp cao nhất:

```js {2-6}
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

Tuy nhiên, bạn sẽ nhanh chóng phát hiện rằng nó [chạy hai lần trong môi trường development.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) Điều này có thể gây ra sự cố—ví dụ: nó có thể vô hiệu hóa authentication token vì hàm này không được thiết kế để được gọi hai lần. Nhìn chung, các component của bạn nên có khả năng chống chịu khi được mount lại. Điều này bao gồm cả component `App` ở cấp cao nhất.

Mặc dù trên thực tế component này có thể không bao giờ được mount lại trong production, việc tuân thủ cùng một ràng buộc trong tất cả component sẽ giúp bạn dễ dàng di chuyển và tái sử dụng code hơn. Nếu một logic nào đó phải chạy *một lần mỗi khi app được tải* thay vì *một lần mỗi khi component được mount*, hãy thêm một biến ở cấp cao nhất để theo dõi xem logic đó đã được thực thi hay chưa:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

Bạn cũng có thể chạy logic này trong quá trình khởi tạo module và trước khi app render:

```js {1,5}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
   // ✅ Only runs once per app load
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Code ở cấp cao nhất chạy một lần khi component của bạn được import—ngay cả khi cuối cùng component đó không được render. Để tránh làm chậm hoặc gây ra hành vi bất ngờ khi import các component tùy ý, đừng lạm dụng pattern này. Hãy giữ logic khởi tạo trên toàn app trong các module của component gốc như `App.js` hoặc trong entry point của ứng dụng.

### Thông báo cho các component cha về những thay đổi state {/*notifying-parent-components-about-state-changes*/}

Giả sử bạn đang viết một component `Toggle` có state `isOn` nội bộ, có thể là `true` hoặc `false`. Có một vài cách khác nhau để chuyển đổi nó (bằng cách nhấp hoặc kéo). Bạn muốn thông báo cho component cha mỗi khi state `Toggle` nội bộ thay đổi, vì vậy bạn expose một event `onChange` và gọi nó từ một Effect:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

Giống như phần trước, cách này không lý tưởng. `Toggle` trước tiên cập nhật state của nó, rồi React cập nhật màn hình. Sau đó React chạy Effect, Effect này gọi hàm `onChange` được truyền từ component cha. Bây giờ component cha sẽ cập nhật state của chính nó, bắt đầu một lượt render khác. Sẽ tốt hơn nếu thực hiện mọi thứ trong một lượt duy nhất.

Hãy xóa Effect và thay vào đó cập nhật state của *cả hai* component trong cùng một event handler:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

Với cách tiếp cận này, cả component `Toggle` và component cha của nó đều cập nhật state trong event. React [gộp các lần cập nhật](/learn/queueing-a-series-of-state-updates) từ các component khác nhau lại với nhau, vì vậy sẽ chỉ có một lượt render.

Bạn cũng có thể loại bỏ hoàn toàn state và thay vào đó nhận `isOn` từ component cha:

```js {1,2}
// ✅ Also good: the component is fully controlled by its parent
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["Đưa state lên trên"](/learn/sharing-state-between-components) cho phép component cha toàn quyền kiểm soát `Toggle` bằng cách chuyển đổi state của chính component cha. Điều này có nghĩa là component cha sẽ phải chứa nhiều logic hơn, nhưng tổng thể sẽ có ít state hơn cần quan tâm. Bất cứ khi nào bạn cố gắng giữ cho hai biến state khác nhau được đồng bộ, hãy thử đưa state lên component cha thay thế!

### Truyền dữ liệu cho component cha {/*passing-data-to-the-parent*/}

Component `Child` này lấy một số dữ liệu rồi truyền dữ liệu đó cho component `Parent` trong một Effect:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

Trong React, dữ liệu đi từ các component cha xuống các component con. Khi thấy điều gì đó không đúng trên màn hình, bạn có thể lần theo nguồn gốc của thông tin bằng cách đi ngược lên chuỗi component cho đến khi tìm ra component nào truyền prop sai hoặc có state sai. Khi các component con cập nhật state của component cha trong Effect, luồng dữ liệu trở nên rất khó theo dõi. Vì cả component con và component cha đều cần cùng một dữ liệu, hãy để component cha lấy dữ liệu đó rồi *truyền xuống* component con:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

Cách này đơn giản hơn và giữ cho luồng dữ liệu dễ dự đoán: dữ liệu đi từ component cha xuống component con.

### Subscribe vào external store {/*subscribing-to-an-external-store*/}

Đôi khi, component của bạn cần subscribe vào một số dữ liệu nằm bên ngoài React state. Dữ liệu này có thể đến từ thư viện bên thứ ba hoặc browser API tích hợp sẵn. Vì dữ liệu này có thể thay đổi mà React không biết, bạn cần subscribe thủ công các component của mình vào dữ liệu đó. Việc này thường được thực hiện bằng một Effect, ví dụ:

```js {2-17}
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Ở đây, component subscribe vào một external data store (trong trường hợp này là browser `navigator.onLine` API). Vì API này không tồn tại trên server (nên không thể được dùng cho HTML ban đầu), state ban đầu được đặt thành `true`. Bất cứ khi nào giá trị của data store đó thay đổi trong browser, component sẽ cập nhật state của nó.

Mặc dù việc dùng Effect cho mục đích này khá phổ biến, React có một Hook chuyên dụng để subscribe vào external store và được ưu tiên sử dụng hơn. Hãy xóa Effect và thay thế bằng một lệnh gọi đến [`useSyncExternalStore`](/reference/react/useSyncExternalStore):

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Cách tiếp cận này ít dễ phát sinh lỗi hơn so với việc đồng bộ thủ công dữ liệu có thể thay đổi vào React state bằng Effect. Thông thường, bạn sẽ viết một custom Hook như `useOnlineStatus()` ở trên để không phải lặp lại code này trong từng component. [Đọc thêm về việc subscribe vào external store từ các component React.](/reference/react/useSyncExternalStore)

### Lấy dữ liệu {/*fetching-data*/}

Nhiều app dùng Effect để bắt đầu việc lấy dữ liệu. Việc viết một Effect để lấy dữ liệu như sau là khá phổ biến:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Bạn *không cần* chuyển lệnh fetch này vào event handler.

Điều này có vẻ mâu thuẫn với các ví dụ trước, trong đó bạn cần đặt logic vào event handler! Tuy nhiên, hãy xem xét rằng *event gõ phím* không phải là lý do chính để lấy dữ liệu. Các ô tìm kiếm thường được điền sẵn từ URL, và người dùng có thể điều hướng Back và Forward mà không chạm vào ô nhập.

Không quan trọng `page` và `query` đến từ đâu. Trong khi component này hiển thị, bạn muốn giữ cho `results` [được đồng bộ](/learn/synchronizing-with-effects) với dữ liệu từ network cho `page` và `query` hiện tại. Đây là lý do nó là một Effect.

Tuy nhiên, đoạn code trên có một bug. Hãy tưởng tượng bạn gõ `"hello"` thật nhanh. Khi đó `query` sẽ thay đổi từ `"h"`, sang `"he"`, `"hel"`, `"hell"` và `"hello"`. Việc này sẽ khởi chạy các lệnh fetch riêng biệt, nhưng không có gì đảm bảo thứ tự các response sẽ đến. Ví dụ, response của `"hell"` có thể đến *sau* response của `"hello"`. Vì nó sẽ gọi `setResults()` sau cùng, bạn sẽ hiển thị sai kết quả tìm kiếm. Đây được gọi là ["race condition"](https://en.wikipedia.org/wiki/Race_condition): hai request khác nhau đã "đua" với nhau và đến theo thứ tự khác với dự kiến.

**Để sửa race condition, bạn cần [thêm một hàm cleanup](/learn/synchronizing-with-effects#fetching-data) để bỏ qua các response cũ:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Điều này đảm bảo rằng khi Effect của bạn lấy dữ liệu, mọi response ngoại trừ response được request sau cùng sẽ bị bỏ qua.

Xử lý race condition không phải là khó khăn duy nhất khi triển khai việc lấy dữ liệu. Bạn cũng có thể cần cân nhắc việc cache response (để người dùng có thể nhấp vào Back và xem ngay màn hình trước đó), cách lấy dữ liệu trên server (để HTML được server render ban đầu chứa nội dung đã lấy thay vì spinner), và cách tránh network waterfall (để component con có thể lấy dữ liệu mà không phải chờ từng component cha).

**Những vấn đề này áp dụng cho mọi UI library, không chỉ React. Việc giải quyết chúng không hề đơn giản, đó là lý do các [framework](/learn/creating-a-react-app#full-stack-frameworks) hiện đại cung cấp các cơ chế lấy dữ liệu tích hợp hiệu quả hơn so với việc lấy dữ liệu trong Effect.**

Nếu bạn không dùng framework (và không muốn tự xây dựng framework của mình) nhưng muốn việc lấy dữ liệu từ Effect trở nên thuận tiện hơn, hãy cân nhắc tách logic lấy dữ liệu thành một custom Hook như trong ví dụ này:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Bạn có thể cũng sẽ muốn thêm logic để xử lý lỗi và theo dõi xem nội dung có đang loading hay không. Bạn có thể tự xây dựng một Hook như vậy hoặc sử dụng một trong rất nhiều giải pháp đã có trong hệ sinh thái React. **Mặc dù riêng cách này sẽ không hiệu quả bằng việc sử dụng cơ chế lấy dữ liệu tích hợp sẵn của framework, việc chuyển logic lấy dữ liệu vào một custom Hook sẽ giúp bạn dễ dàng áp dụng một chiến lược lấy dữ liệu hiệu quả hơn về sau.**

Nhìn chung, bất cứ khi nào phải sử dụng Effect, hãy chú ý xem khi nào bạn có thể tách một phần chức năng thành một custom Hook với API mang tính khai báo và chuyên dụng hơn, như `useData` ở trên. Càng có ít lệnh gọi `useEffect` thô trong các component, bạn sẽ càng dễ bảo trì ứng dụng hơn.

<Recap>

- Nếu bạn có thể tính toán một giá trị trong quá trình render, bạn không cần Effect.
- Để cache các phép tính tốn kém, hãy thêm `useMemo` thay vì `useEffect`.
- Để đặt lại state của toàn bộ cây component, hãy truyền một `key` khác cho nó.
- Để đặt lại một phần state cụ thể khi prop thay đổi, hãy thiết lập phần state đó trong quá trình render.
- Code chạy vì một component được *hiển thị* nên nằm trong Effects, còn phần còn lại nên nằm trong các event.
- Nếu cần cập nhật state của nhiều component, tốt hơn hết là thực hiện việc đó trong một event duy nhất.
- Bất cứ khi nào bạn cố gắng đồng bộ các biến state trong những component khác nhau, hãy cân nhắc việc nâng state lên.
- Bạn có thể fetch dữ liệu bằng Effects, nhưng cần triển khai cleanup để tránh race condition.

</Recap>

<Challenges>

#### Biến đổi dữ liệu mà không dùng Effects {/*transform-data-without-effects*/}

`TodoList` dưới đây hiển thị một danh sách todo. Khi checkbox "Chỉ hiển thị todo đang hoạt động" được chọn, các todo đã hoàn thành sẽ không được hiển thị trong danh sách. Bất kể những todo nào đang hiển thị, footer vẫn hiển thị số lượng todo chưa hoàn thành.

Hãy đơn giản hóa component này bằng cách loại bỏ toàn bộ state và Effects không cần thiết.

<Sandpack>

```js {expectedErrors: {'react-compiler': [12, 16, 20]}}
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

Nếu bạn có thể tính toán một giá trị trong quá trình render, bạn không cần state hoặc Effect để cập nhật giá trị đó.

</Hint>

<Solution>

Chỉ có hai phần state thiết yếu trong ví dụ này: danh sách `todos` và biến state `showActive` biểu thị việc checkbox có được chọn hay không. Tất cả các biến state khác đều [dư thừa](/learn/choosing-the-state-structure#avoid-redundant-state) và có thể được tính toán ngay trong quá trình render. Trong đó có `footer`, bạn có thể chuyển trực tiếp vào JSX bao quanh.

Kết quả của bạn sẽ trông như sau:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Cache phép tính mà không dùng Effects {/*cache-a-calculation-without-effects*/}

Trong ví dụ này, việc lọc các todo được tách thành một hàm riêng có tên là `getVisibleTodos()`. Hàm này chứa một lệnh gọi `console.log()` bên trong, giúp bạn nhận biết khi nào hàm được gọi. Hãy bật tắt "Chỉ hiển thị todo đang hoạt động" và nhận thấy thao tác đó khiến `getVisibleTodos()` chạy lại. Đây là điều được mong đợi vì các todo hiển thị sẽ thay đổi khi bạn chuyển đổi những todo cần hiển thị.

Nhiệm vụ của bạn là loại bỏ Effect tính toán lại danh sách `visibleTodos` trong component `TodoList`. Tuy nhiên, bạn cần đảm bảo rằng `getVisibleTodos()` *không* chạy lại (và do đó không in bất kỳ log nào) khi bạn nhập vào input.

<Hint>

Một giải pháp là thêm lệnh gọi `useMemo` để cache các todo hiển thị. Ngoài ra còn một giải pháp khác, ít rõ ràng hơn.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

Hãy loại bỏ biến state và Effect, rồi thay vào đó thêm lệnh gọi `useMemo` để cache kết quả của việc gọi `getVisibleTodos()`:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Với thay đổi này, `getVisibleTodos()` sẽ chỉ được gọi khi `todos` hoặc `showActive` thay đổi. Việc nhập vào input chỉ thay đổi biến state `text`, nên không kích hoạt lệnh gọi đến `getVisibleTodos()`.

Cũng có một giải pháp khác không cần `useMemo`. Vì biến state `text` không thể ảnh hưởng đến danh sách todo, bạn có thể tách form `NewTodo` thành một component riêng và chuyển biến state `text` vào bên trong component đó:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Cách tiếp cận này cũng đáp ứng các yêu cầu. Khi bạn nhập vào input, chỉ biến state `text` được cập nhật. Vì biến state `text` nằm trong component con `NewTodo`, component cha `TodoList` sẽ không được render lại. Đó là lý do `getVisibleTodos()` không được gọi khi bạn nhập. (Hàm này vẫn sẽ được gọi nếu `TodoList` render lại vì một lý do khác.)

</Solution>

#### Đặt lại state mà không dùng Effects {/*reset-state-without-effects*/}

Component `EditContact` này nhận một object contact có cấu trúc như `{ id, name, email }` làm prop `savedContact`. Hãy thử chỉnh sửa các trường input tên và email. Khi nhấn Save, button của contact phía trên form sẽ cập nhật thành tên đã chỉnh sửa. Khi nhấn Reset, mọi thay đổi chưa lưu trong form sẽ bị loại bỏ. Hãy thử tương tác với UI này để làm quen với cách hoạt động của nó.

Khi bạn chọn một contact bằng các button ở phía trên, form sẽ được đặt lại để phản ánh thông tin của contact đó. Việc này được thực hiện bằng một Effect bên trong `EditContact.js`. Hãy loại bỏ Effect này. Tìm một cách khác để đặt lại form khi `savedContact.id` thay đổi.

<Sandpack>

```js src/App.js hidden
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
        savedContact={selectedContact}
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

```js src/ContactList.js hidden
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

```js {expectedErrors: {'react-compiler': [8, 9]}} src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

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
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
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

<Hint>

Sẽ thật hữu ích nếu có cách cho React biết rằng khi `savedContact.id` khác đi, form `EditContact` về mặt khái niệm là _form của một contact khác_ và không nên giữ lại state. Bạn có nhớ cách nào như vậy không?

</Hint>

<Solution>

Hãy tách component `EditContact` thành hai component. Chuyển toàn bộ state của form vào component `EditForm` bên trong. Export component `EditContact` bên ngoài và để component này truyền `savedContact.id` làm `key` cho component `EditForm` bên trong. Kết quả là component `EditForm` bên trong sẽ đặt lại toàn bộ state của form và tạo lại DOM mỗi khi bạn chọn một contact khác.

<Sandpack>

```js src/App.js hidden
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
        savedContact={selectedContact}
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

```js src/ContactList.js hidden
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

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

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
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
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

#### Submit form mà không dùng Effects {/*submit-a-form-without-effects*/}

Component `Form` này cho phép bạn gửi tin nhắn cho một người bạn. Khi submit form, biến state `showForm` được đặt thành `false`. Việc này kích hoạt một Effect gọi `sendMessage(message)`, hàm này gửi tin nhắn (bạn có thể thấy tin nhắn trong console). Sau khi tin nhắn được gửi, bạn sẽ thấy một dialog "Cảm ơn" với button "Mở cuộc trò chuyện", cho phép bạn quay lại form.

Người dùng ứng dụng của bạn đang gửi quá nhiều tin nhắn. Để việc trò chuyện trở nên khó khăn hơn một chút, bạn quyết định hiển thị dialog "Cảm ơn" *trước* thay vì form. Hãy thay đổi biến state `showForm` để khởi tạo thành `false` thay vì `true`. Ngay khi thực hiện thay đổi này, console sẽ cho thấy một tin nhắn rỗng đã được gửi. Có điều gì đó không đúng trong logic này!

Nguyên nhân gốc rễ của vấn đề là gì? Và bạn có thể khắc phục như thế nào?

<Hint>

Tin nhắn được gửi _vì_ người dùng nhìn thấy dialog "Cảm ơn"? Hay là ngược lại?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

Biến state `showForm` quyết định việc hiển thị form hay dialog "Cảm ơn". Tuy nhiên, bạn không gửi tin nhắn vì dialog "Cảm ơn" được _hiển thị_. Bạn muốn gửi tin nhắn vì người dùng đã _submit form_. Hãy xóa Effect gây hiểu nhầm và chuyển lệnh gọi `sendMessage` vào event handler `handleSubmit`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Hãy chú ý rằng trong phiên bản này, chỉ _việc submit form_ (vốn là một event) mới khiến tin nhắn được gửi. Cách này hoạt động tốt như nhau bất kể `showForm` ban đầu được đặt thành `true` hay `false`. (Hãy đặt nó thành `false` và nhận thấy không có thêm thông báo nào trong console.)

</Solution>

</Challenges>