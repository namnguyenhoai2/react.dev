---
title: useCallback
---

<Intro>

`useCallback` là một React Hook cho phép bạn lưu vào bộ nhớ đệm một định nghĩa hàm giữa các lần re-render.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) tự động memoize các giá trị và hàm, giúp giảm nhu cầu gọi `useCallback` thủ công. Bạn có thể sử dụng compiler để tự động xử lý việc memoization.

</Note>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Gọi `useCallback` ở cấp cao nhất của component để lưu vào bộ nhớ đệm một định nghĩa hàm giữa các lần re-render:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[Xem thêm ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `fn`: Giá trị hàm mà bạn muốn lưu vào bộ nhớ đệm. Hàm này có thể nhận bất kỳ đối số nào và trả về bất kỳ giá trị nào. React sẽ trả về (không gọi!) hàm của bạn cho bạn trong lần render đầu tiên. Trong các lần render tiếp theo, React sẽ cung cấp lại chính hàm đó nếu `dependencies` không thay đổi kể từ lần render trước. Nếu không, React sẽ cung cấp hàm mà bạn đã truyền trong lần render hiện tại và lưu hàm đó phòng khi có thể tái sử dụng sau này. React sẽ không gọi hàm của bạn. Hàm được trả về cho bạn để bạn có thể quyết định khi nào và liệu có gọi hàm đó hay không.

* `dependencies`: Danh sách tất cả các giá trị reactive được tham chiếu bên trong mã `fn`. Các giá trị reactive bao gồm props, state cùng tất cả biến và hàm được khai báo trực tiếp bên trong phần thân component. Nếu linter của bạn được [cấu hình cho React](/learn/editor-setup#linting), linter sẽ kiểm tra để bảo đảm mọi giá trị reactive đều được chỉ định chính xác dưới dạng dependency. Danh sách dependency phải có số lượng phần tử cố định và được viết inline như `[dep1, dep2, dep3]`. React sẽ so sánh từng dependency với giá trị trước đó bằng thuật toán so sánh [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Giá trị trả về {/*returns*/}

Trong lần render đầu tiên, `useCallback` trả về hàm `fn` mà bạn đã truyền.

Trong các lần render tiếp theo, nó sẽ trả về một hàm `fn` đã được lưu từ lần render trước (nếu dependency không thay đổi), hoặc trả về hàm `fn` mà bạn đã truyền trong lần render này.

#### Lưu ý {/*caveats*/}

* `useCallback` là một Hook, vì vậy bạn chỉ có thể gọi nó **ở cấp cao nhất của component** hoặc trong các Hook của riêng bạn. Bạn không thể gọi nó bên trong vòng lặp hoặc điều kiện. Nếu cần làm vậy, hãy tách một component mới và chuyển state vào đó.
* React **sẽ không loại bỏ hàm đã lưu trong bộ nhớ đệm trừ khi có lý do cụ thể để làm vậy.** Ví dụ, trong môi trường development, React sẽ loại bỏ cache khi bạn chỉnh sửa tệp của component. Cả trong development và production, React sẽ loại bỏ cache nếu component của bạn bị suspend trong quá trình mount ban đầu. Trong tương lai, React có thể bổ sung thêm các tính năng tận dụng việc loại bỏ cache--ví dụ: nếu React bổ sung hỗ trợ tích hợp cho các danh sách được virtualize trong tương lai, việc loại bỏ cache của những item đã cuộn ra khỏi viewport của bảng virtualize sẽ hợp lý. Điều này phù hợp với kỳ vọng của bạn nếu bạn dựa vào `useCallback` như một tối ưu hóa hiệu năng. Nếu không, [biến state](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) hoặc [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) có thể phù hợp hơn.

---

## Cách sử dụng {/*usage*/}

### Bỏ qua việc re-render component {/*skipping-re-rendering-of-components*/}

Khi tối ưu hiệu năng rendering, đôi khi bạn sẽ cần lưu vào bộ nhớ đệm các hàm truyền cho component con. Trước tiên, hãy xem cú pháp để thực hiện việc này, sau đó tìm hiểu những trường hợp mà cách này hữu ích.

Để lưu một hàm vào bộ nhớ đệm giữa các lần re-render của component, hãy bọc định nghĩa hàm đó trong Hook `useCallback`:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Bạn cần truyền hai thứ vào `useCallback`:

1. Một định nghĩa hàm mà bạn muốn lưu vào bộ nhớ đệm giữa các lần re-render.
2. Một <CodeStep step={2}>danh sách dependency</CodeStep> bao gồm mọi giá trị bên trong component được sử dụng trong hàm của bạn.

Trong lần render đầu tiên, <CodeStep step={3}>hàm được trả về</CodeStep> mà bạn nhận được từ `useCallback` sẽ là hàm bạn đã truyền.

Trong các lần render tiếp theo, React sẽ so sánh <CodeStep step={2}>dependency</CodeStep> với các dependency bạn đã truyền trong lần render trước. Nếu không có dependency nào thay đổi (khi so sánh bằng [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` sẽ trả về cùng hàm như trước. Nếu không, `useCallback` sẽ trả về hàm bạn đã truyền trong lần render *này*.

Nói cách khác, `useCallback` lưu một hàm vào bộ nhớ đệm giữa các lần re-render cho đến khi dependency của hàm đó thay đổi.

**Hãy cùng xem qua một ví dụ để hiểu khi nào cách này hữu ích.**

Giả sử bạn đang truyền một hàm `handleSubmit` từ `ProductPage` xuống component `ShippingForm`:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

Bạn nhận thấy việc bật tắt prop `theme` khiến ứng dụng bị đơ trong giây lát, nhưng nếu xóa `<ShippingForm />` khỏi JSX thì ứng dụng có vẻ nhanh hơn. Điều này cho thấy bạn nên thử tối ưu component `ShippingForm`.

**Theo mặc định, khi một component re-render, React sẽ re-render tất cả component con của nó một cách đệ quy.** Vì vậy, khi `ProductPage` re-render với một `theme` khác, component `ShippingForm` *cũng* re-render. Điều này không sao đối với các component không cần nhiều phép tính để re-render. Nhưng nếu bạn đã xác nhận rằng một lần re-render diễn ra chậm, bạn có thể yêu cầu `ShippingForm` bỏ qua việc re-render khi props của nó giống với lần render trước bằng cách bọc nó trong [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**Với thay đổi này, `ShippingForm` sẽ bỏ qua việc re-render nếu tất cả props của nó *giống hệt* như trong lần render trước.** Đây là lúc việc lưu một hàm vào bộ nhớ đệm trở nên quan trọng! Giả sử bạn định nghĩa `handleSubmit` mà không có `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Mỗi lần theme thay đổi, đây sẽ là một hàm khác...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... so ShippingForm's props will never be the same, and it will re-render every time */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Trong JavaScript, một `function () {}` hoặc `() => {}` luôn tạo ra một hàm _khác_,** tương tự như cách một object literal `{}` luôn tạo ra một object mới. Thông thường, đây không phải vấn đề, nhưng điều đó có nghĩa là props của `ShippingForm` sẽ không bao giờ giống nhau, và việc tối ưu [`memo`](/reference/react/memo) của bạn sẽ không hoạt động. Đây là lúc `useCallback` phát huy tác dụng:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Yêu cầu React cache hàm của bạn giữa các lần render lại...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...so as long as these dependencies don't change...

  return (
    <div className={theme}>
      {/* ...ShippingForm will receive the same props and can skip re-rendering */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Bằng cách bọc `handleSubmit` trong `useCallback`, bạn bảo đảm rằng đó là *cùng một* hàm giữa các lần re-render** (cho đến khi dependency thay đổi). Bạn *không bắt buộc* phải bọc một hàm trong `useCallback` trừ khi có một lý do cụ thể. Trong ví dụ này, lý do là bạn truyền hàm đó cho một component được bọc trong [`memo`,](/reference/react/memo) và điều này cho phép component bỏ qua việc re-render. Có những lý do khác khiến bạn có thể cần `useCallback`, được mô tả ở phần sau của trang này.

<Note>

**Bạn chỉ nên dựa vào `useCallback` như một tối ưu hóa hiệu năng.** Nếu mã của bạn không hoạt động khi thiếu nó, hãy tìm và khắc phục vấn đề nền tảng trước. Sau đó, bạn có thể thêm lại `useCallback`.

</Note>

<DeepDive>

#### useCallback có liên quan thế nào đến useMemo? {/*how-is-usecallback-related-to-usememo*/}

Bạn sẽ thường thấy [`useMemo`](/reference/react/useMemo) được sử dụng cùng với `useCallback`. Cả hai đều hữu ích khi bạn muốn tối ưu một component con. Chúng cho phép bạn [memoize](https://en.wikipedia.org/wiki/Memoization) (hay nói cách khác là lưu vào bộ nhớ đệm) một thứ mà bạn truyền xuống:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Gọi hàm của bạn và cache kết quả
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Cache chính hàm của bạn
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

Điểm khác biệt nằm ở *thứ* mà chúng cho phép bạn lưu vào bộ nhớ đệm:

* **[`useMemo`](/reference/react/useMemo) lưu *kết quả* của việc gọi hàm.** Trong ví dụ này, nó lưu kết quả gọi `computeRequirements(product)` để kết quả không thay đổi cho đến khi `product` thay đổi. Nhờ đó, bạn có thể truyền object `requirements` xuống mà không khiến `ShippingForm` re-render không cần thiết. Khi cần, React sẽ gọi hàm bạn đã truyền trong quá trình rendering để tính toán kết quả.
* **`useCallback` lưu chính *bản thân hàm*.** Không giống `useMemo`, nó không gọi hàm bạn cung cấp. Thay vào đó, nó lưu hàm bạn đã cung cấp để bản thân `handleSubmit` không thay đổi cho đến khi `productId` hoặc `referrer` thay đổi. Nhờ đó, bạn có thể truyền hàm `handleSubmit` xuống mà không khiến `ShippingForm` re-render không cần thiết. Mã của bạn sẽ không chạy cho đến khi người dùng submit form.

Nếu bạn đã quen thuộc với [`useMemo`,](/reference/react/useMemo) bạn có thể thấy hữu ích nếu hình dung `useCallback` như sau:

```js {expectedErrors: {'react-compiler': [3]}}
// Bản triển khai đơn giản hóa (bên trong React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Đọc thêm về sự khác biệt giữa `useMemo` và `useCallback`.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### Có nên thêm useCallback ở mọi nơi không? {/*should-you-add-usecallback-everywhere*/}

Nếu ứng dụng của bạn giống như trang web này và hầu hết các tương tác đều ở mức tổng thể (chẳng hạn như thay thế một trang hoặc toàn bộ một section), memoization thường không cần thiết. Mặt khác, nếu ứng dụng của bạn giống một trình chỉnh sửa bản vẽ hơn và hầu hết các tương tác đều ở mức chi tiết (chẳng hạn như di chuyển các hình), bạn có thể thấy memoization rất hữu ích.

Việc cache một function bằng `useCallback` chỉ có giá trị trong một vài trường hợp:

- Bạn truyền nó làm prop cho một component được bọc trong [`memo`.](/reference/react/memo) Bạn muốn bỏ qua việc re-render nếu giá trị không thay đổi. Memoization cho phép component của bạn chỉ re-render khi các dependencies thay đổi.
- Function bạn truyền sau đó được dùng làm dependency của một Hook nào đó. Ví dụ: một function khác được bọc trong `useCallback` phụ thuộc vào nó, hoặc bạn phụ thuộc vào function này từ [`useEffect.`](/reference/react/useEffect)

Trong các trường hợp khác, việc bọc một function trong `useCallback` không mang lại lợi ích. Việc này cũng không gây hại đáng kể, vì vậy một số team chọn cách không xem xét từng trường hợp riêng lẻ và memoize nhiều nhất có thể. Nhược điểm là code trở nên kém dễ đọc hơn. Ngoài ra, không phải mọi memoization đều hiệu quả: chỉ một giá trị "luôn mới" cũng đủ phá vỡ memoization cho toàn bộ component.

Lưu ý rằng `useCallback` không ngăn việc *tạo* function. Bạn luôn tạo một function (và điều đó hoàn toàn ổn!), nhưng React sẽ bỏ qua function đó và trả lại cho bạn một function đã được cache nếu không có gì thay đổi.

**Trên thực tế, bạn có thể khiến nhiều trường hợp memoization trở nên không cần thiết bằng cách tuân theo một số nguyên tắc:**

1. Khi một component bao bọc các component khác về mặt hiển thị, hãy để nó [nhận JSX làm children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Khi đó, nếu component wrapper cập nhật state của chính nó, React biết rằng các children của nó không cần re-render.
2. Ưu tiên state cục bộ và đừng [đưa state lên cao hơn](/learn/sharing-state-between-components) mức cần thiết. Đừng giữ các state tạm thời như form và trạng thái một item đang được hover ở cấp cao nhất trong tree hoặc trong một thư viện state toàn cục.
3. Giữ cho [logic rendering của bạn thuần.](/learn/keeping-components-pure) Nếu việc re-render một component gây ra sự cố hoặc tạo ra artifact hiển thị dễ nhận thấy, đó là bug trong component của bạn! Hãy sửa bug thay vì thêm memoization.
4. Tránh [các Effect không cần thiết cập nhật state.](/learn/you-might-not-need-an-effect) Hầu hết vấn đề về hiệu năng trong các ứng dụng React là do những chuỗi cập nhật bắt nguồn từ các Effect, khiến component của bạn render lặp đi lặp lại.
5. Hãy thử [loại bỏ các dependencies không cần thiết khỏi Effect.](/learn/removing-effect-dependencies) Ví dụ, thay vì memoization, thường sẽ đơn giản hơn nếu di chuyển một object hoặc một function vào bên trong Effect hoặc ra bên ngoài component.

Nếu một tương tác cụ thể vẫn có cảm giác bị trễ, [hãy dùng profiler của React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) để xem component nào được hưởng lợi nhiều nhất từ memoization, rồi thêm memoization khi cần. Những nguyên tắc này giúp component của bạn dễ debug và dễ hiểu hơn, vì vậy dù thế nào bạn cũng nên tuân theo chúng. Về lâu dài, chúng tôi đang nghiên cứu [việc tự động thực hiện memoization](https://www.youtube.com/watch?v=lGEMwh32soc) để giải quyết vấn đề này một lần và mãi mãi.

</DeepDive>

<Recipes titleText="The difference between useCallback and declaring a function directly" titleId="examples-rerendering">

#### Bỏ qua việc re-render bằng `useCallback` và `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

Trong ví dụ này, component `ShippingForm` được **làm chậm một cách có chủ đích** để bạn có thể thấy điều gì xảy ra khi một React component mà bạn đang render thực sự chậm. Hãy thử tăng counter và chuyển đổi theme.

Việc tăng counter có cảm giác chậm vì nó buộc `ShippingForm` đã bị làm chậm phải re-render. Điều đó là đúng như dự kiến vì counter đã thay đổi, nên bạn cần phản ánh lựa chọn mới của người dùng trên màn hình.

Tiếp theo, hãy thử chuyển đổi theme. **Nhờ `useCallback` kết hợp với [`memo`](/reference/react/memo), thao tác này vẫn nhanh dù đã được làm chậm một cách có chủ đích!** `ShippingForm` đã bỏ qua việc re-render vì function `handleSubmit` không thay đổi. Function `handleSubmit` không thay đổi vì cả `productId` và `referrer` (các dependencies `useCallback` của bạn) đều không thay đổi kể từ lần render trước.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Giả sử đoạn này gửi một yêu cầu...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Không làm gì trong 500 ms để mô phỏng code cực chậm
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Một component luôn re-render {/*always-re-rendering-a-component*/}

Trong ví dụ này, implementation của `ShippingForm` cũng được **làm chậm một cách có chủ đích** để bạn có thể thấy điều gì xảy ra khi một React component mà bạn đang render thực sự chậm. Hãy thử tăng counter và chuyển đổi theme.

Không giống ví dụ trước, giờ đây việc chuyển đổi theme cũng chậm! Đó là vì **trong phiên bản này không có lời gọi `useCallback`,** nên `handleSubmit` luôn là một function mới và component `ShippingForm` đã bị làm chậm không thể bỏ qua việc re-render.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Giả sử đoạn này gửi một yêu cầu...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Không làm gì trong 500 ms để mô phỏng code cực chậm
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Tuy nhiên, đây là cùng đoạn code đó **sau khi đã loại bỏ việc làm chậm có chủ đích.** Việc thiếu `useCallback` có dễ nhận thấy hay không?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Giả sử đoạn này gửi một yêu cầu...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Khá thường xuyên, code không có memoization vẫn hoạt động tốt. Nếu các tương tác đủ nhanh, bạn không cần memoization.

Hãy nhớ rằng bạn cần chạy React ở chế độ production, tắt [React Developer Tools](/learn/react-developer-tools), và sử dụng các thiết bị tương tự thiết bị của người dùng ứng dụng để có đánh giá thực tế về điều gì đang thực sự làm ứng dụng chậm đi.

<Solution />

</Recipes>

---

### Cập nhật state từ một callback đã được memoize {/*updating-state-from-a-memoized-callback*/}

Đôi khi, bạn có thể cần cập nhật state dựa trên state trước đó từ một callback đã được memoize.

Function `handleAddTodo` này chỉ định `todos` làm dependency vì nó tính toán các todo tiếp theo từ dependency đó:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Thông thường, bạn sẽ muốn các function đã được memoize có ít dependencies nhất có thể. Khi bạn chỉ đọc một state để tính toán state tiếp theo, bạn có thể loại bỏ dependency đó bằng cách truyền một [function updater](/reference/react/useState#updating-state-based-on-the-previous-state) thay vào đó:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No need for the todos dependency
  // ...
```

Ở đây, thay vì đưa `todos` vào làm dependency và đọc nó bên trong, bạn truyền cho React một chỉ dẫn về *cách* cập nhật state (`todos => [...todos, newTodo]`). [Đọc thêm về các function updater.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Ngăn Effect chạy quá thường xuyên {/*preventing-an-effect-from-firing-too-often*/}

Đôi khi, bạn có thể muốn gọi một function từ bên trong một [Effect:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Điều này tạo ra một vấn đề. [Mọi giá trị reactive đều phải được khai báo làm dependency của Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Tuy nhiên, nếu bạn khai báo `createOptions` làm dependency, nó sẽ khiến Effect của bạn liên tục kết nối lại với chat room:

```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problem: This dependency changes on every render
  // ...
```

Để giải quyết vấn đề này, bạn có thể bọc function cần gọi từ Effect vào trong `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Only changes when createOptions changes
  // ...
```

Điều này đảm bảo rằng function `createOptions` vẫn giống nhau giữa các lần re-render nếu `roomId` giống nhau. **Tuy nhiên, tốt hơn nữa là loại bỏ nhu cầu sử dụng function dependency.** Hãy di chuyển function của bạn *vào bên trong* Effect:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ No need for useCallback or function dependencies!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

Giờ đây code của bạn đơn giản hơn và không cần `useCallback`. [Tìm hiểu thêm về cách loại bỏ các dependencies của Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Tối ưu hóa một custom Hook {/*optimizing-a-custom-hook*/}

Nếu bạn đang viết một [custom Hook,](/learn/reusing-logic-with-custom-hooks) bạn nên bọc mọi function mà nó trả về trong `useCallback`:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

Điều này đảm bảo rằng các consumer của Hook có thể tối ưu code của chính họ khi cần.

---

## Khắc phục sự cố {/*troubleshooting*/}

### Mỗi lần component của tôi render, `useCallback` lại trả về một function khác {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Hãy đảm bảo bạn đã chỉ định dependency array làm đối số thứ hai!

Nếu quên dependency array, `useCallback` sẽ trả về một function mới mỗi lần:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Returns a new function every time: no dependency array
  // ...
```

Đây là phiên bản đã được sửa, truyền dependency array làm đối số thứ hai:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Does not return a new function unnecessarily
  // ...
```

Nếu cách này vẫn không hiệu quả, thì vấn đề là ít nhất một dependency của bạn đã khác so với lần render trước. Bạn có thể debug vấn đề này bằng cách ghi thủ công các dependency của mình ra console:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

Sau đó, bạn có thể nhấp chuột phải vào các array từ những lần re-render khác nhau trong console và chọn "Store as a global variable" cho cả hai. Giả sử array đầu tiên được lưu với tên `temp1` và array thứ hai được lưu với tên `temp2`, bạn có thể dùng browser console để kiểm tra xem mỗi dependency trong cả hai array có giống nhau hay không:

```js
Object.is(temp1[0], temp2[0]); // Dependency đầu tiên có giống nhau giữa các mảng không?
Object.is(temp1[1], temp2[1]); // Dependency thứ hai có giống nhau giữa các mảng không?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

Khi tìm ra dependency nào đang làm hỏng memoization, hãy tìm cách loại bỏ nó hoặc [memoize nó.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### Tôi cần gọi `useCallback` cho từng item trong list bên trong một vòng lặp, nhưng điều đó không được phép {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Giả sử component `Chart` được bọc trong [`memo`](/reference/react/memo). Bạn muốn bỏ qua việc re-render mọi `Chart` trong list khi component `ReportList` re-render. Tuy nhiên, bạn không thể gọi `useCallback` trong một vòng lặp:

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useCallback in a loop like this:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Thay vào đó, hãy tách một component cho từng item riêng lẻ và đặt `useCallback` vào đó:

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useCallback at the top level:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Ngoài ra, bạn có thể xóa `useCallback` trong đoạn snippet cuối cùng và thay vào đó bọc chính `Report` trong [`memo`.](/reference/react/memo) Nếu prop `item` không thay đổi, `Report` sẽ bỏ qua việc re-render, vì vậy `Chart` cũng sẽ bỏ qua việc re-render:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
