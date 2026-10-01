---
title: Phản hồi với Input bằng State
---

<Intro>

React cung cấp một cách khai báo (declarative) để thao tác với UI. Thay vì trực tiếp thao tác với từng phần riêng lẻ của UI, bạn mô tả những state khác nhau mà component có thể có, rồi chuyển đổi giữa chúng để phản hồi input của người dùng. Điều này tương tự cách các nhà thiết kế suy nghĩ về UI.

</Intro>

<YouWillLearn>

* UI declarative khác với UI imperative như thế nào
* Cách liệt kê các trạng thái hiển thị khác nhau mà component có thể có
* Cách kích hoạt các thay đổi giữa những trạng thái hiển thị khác nhau từ code

</YouWillLearn>

## UI declarative so với UI imperative như thế nào {/*how-declarative-ui-compares-to-imperative*/}

Khi thiết kế các tương tác UI, có lẽ bạn sẽ nghĩ về cách UI *thay đổi* để phản hồi các thao tác của người dùng. Hãy xem xét một form cho phép người dùng gửi câu trả lời:

* Khi bạn nhập nội dung vào form, nút "Submit" **được bật.**
* Khi bạn nhấn "Submit", cả form và nút **bị vô hiệu hóa,** đồng thời một spinner **xuất hiện.**
* Nếu network request thành công, form **bị ẩn,** và thông báo "Thank you" **xuất hiện.**
* Nếu network request thất bại, một thông báo lỗi **xuất hiện,** và form **được bật lại.**

Trong **lập trình imperative,** những điều trên tương ứng trực tiếp với cách bạn triển khai tương tác. Bạn phải viết chính xác các chỉ dẫn để thao tác với UI tùy theo điều vừa xảy ra. Hãy nghĩ về việc này theo một cách khác: hãy tưởng tượng bạn đang ngồi trên xe cạnh một người và chỉ đường cho họ từng chặng.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="In a car driven by an anxious-looking person representing JavaScript, a passenger orders the driver to execute a sequence of complicated turn by turn navigations." />

Họ không biết bạn muốn đi đâu, mà chỉ làm theo các mệnh lệnh của bạn. (Và nếu bạn chỉ đường sai, bạn sẽ đến nhầm nơi!) Cách này được gọi là *imperative* vì bạn phải "ra lệnh" cho từng phần tử, từ spinner đến nút, nói cho máy tính biết *cách* cập nhật UI.

Trong ví dụ về lập trình UI imperative này, form được xây dựng *không dùng* React. Nó chỉ sử dụng [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) của trình duyệt:

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Giả lập việc gửi yêu cầu qua mạng.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Thao tác với UI theo cách imperative hoạt động đủ tốt trong các ví dụ độc lập, nhưng việc quản lý sẽ khó hơn theo cấp số nhân trong các hệ thống phức tạp hơn. Hãy tưởng tượng phải cập nhật một trang chứa đầy những form khác nhau như thế này. Việc thêm một phần tử UI hoặc một tương tác mới sẽ yêu cầu kiểm tra cẩn thận toàn bộ code hiện có để đảm bảo bạn không tạo ra bug (ví dụ: quên hiển thị hoặc ẩn một thứ gì đó).

React được xây dựng để giải quyết vấn đề này.

Trong React, bạn không trực tiếp thao tác với UI--nghĩa là bạn không trực tiếp bật, vô hiệu hóa, hiển thị hoặc ẩn các component. Thay vào đó, bạn **khai báo những gì mình muốn hiển thị,** còn React sẽ xác định cách cập nhật UI. Hãy nghĩ đến việc đi taxi và nói cho tài xế biết bạn muốn đi đâu, thay vì chỉ cho họ chính xác từng chỗ cần rẽ. Đưa bạn đến nơi là công việc của tài xế, và họ thậm chí có thể biết một vài đường tắt mà bạn chưa nghĩ đến!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="In a car driven by React, a passenger asks to be taken to a specific place on the map. React figures out how to do that." />

## Tư duy về UI theo cách declarative {/*thinking-about-ui-declaratively*/}

Ở trên, bạn đã thấy cách triển khai một form theo cách imperative. Để hiểu rõ hơn cách tư duy trong React, dưới đây bạn sẽ từng bước xây dựng lại UI này bằng React:

1. **Xác định** các trạng thái hiển thị khác nhau của component
2. **Xác định** điều gì kích hoạt những thay đổi state đó
3. **Biểu diễn** state trong memory bằng `useState`
4. **Loại bỏ** mọi state variable không thiết yếu
5. **Kết nối** các event handler để thiết lập state

### Bước 1: Xác định các trạng thái hiển thị khác nhau của component {/*step-1-identify-your-components-different-visual-states*/}

Trong khoa học máy tính, bạn có thể nghe nói về một ["state machine"](https://en.wikipedia.org/wiki/Finite-state_machine) có thể ở một trong nhiều “state”. Nếu làm việc với một nhà thiết kế, bạn có thể đã thấy các mockup cho những "visual state" khác nhau. React nằm ở giao điểm giữa thiết kế và khoa học máy tính, vì vậy cả hai ý tưởng này đều là nguồn cảm hứng.

Trước tiên, bạn cần hình dung tất cả "state" khác nhau của UI mà người dùng có thể nhìn thấy:

* **Empty**: Form có nút "Submit" bị vô hiệu hóa.
* **Typing**: Form có nút "Submit" được bật.
* **Submitting**: Toàn bộ form bị vô hiệu hóa. Spinner được hiển thị.
* **Success**: Thông báo "Thank you" được hiển thị thay cho form.
* **Error**: Giống state Typing, nhưng có thêm một thông báo lỗi.

Giống như một nhà thiết kế, bạn sẽ muốn "tạo mockup" hoặc tạo "mock" cho các state khác nhau trước khi thêm logic. Ví dụ, dưới đây là một mock chỉ dành cho phần hiển thị của form. Mock này được điều khiển bởi một prop có tên `status` với giá trị mặc định là `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Bạn có thể gọi prop đó bằng bất kỳ tên nào; tên gọi không quan trọng. Hãy thử chỉnh sửa `status = 'empty'` thành `status = 'success'` để thấy thông báo success xuất hiện. Việc tạo mock cho phép bạn nhanh chóng lặp lại quá trình phát triển UI trước khi kết nối bất kỳ logic nào. Dưới đây là một prototype hoàn chỉnh hơn của cùng component, vẫn được "điều khiển" bởi prop `status`:

<Sandpack>

```js
export default function Form({
  // Thử 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Hiển thị nhiều trạng thái hiển thị cùng lúc {/*displaying-many-visual-states-at-once*/}

Nếu một component có nhiều trạng thái hiển thị, việc hiển thị tất cả chúng trên cùng một trang có thể rất thuận tiện:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Những trang như vậy thường được gọi là "living styleguide" hoặc "storybook".

</DeepDive>

### Bước 2: Xác định điều gì kích hoạt những thay đổi state đó {/*step-2-determine-what-triggers-those-state-changes*/}

Bạn có thể kích hoạt việc cập nhật state để phản hồi hai loại input:

* **Input từ con người,** chẳng hạn như nhấp vào nút, nhập vào một field, điều hướng đến một link.
* **Input từ máy tính,** chẳng hạn như network response đến nơi, timeout hoàn tất, một hình ảnh tải xong.

<IllustrationBlock>
  <Illustration caption="Human inputs" alt="A finger." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Computer inputs" alt="Ones and zeroes." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

Trong cả hai trường hợp, **bạn phải thiết lập [state variables](/learn/state-a-components-memory#anatomy-of-usestate) để cập nhật UI.** Với form bạn đang phát triển, bạn sẽ cần thay đổi state để phản hồi một vài input khác nhau:

* **Thay đổi text input** (từ con người) sẽ chuyển form từ state *Empty* sang state *Typing* hoặc ngược lại, tùy vào việc text box có trống hay không.
* **Nhấp vào nút Submit** (từ con người) sẽ chuyển form sang state *Submitting*.
* **Network response thành công** (từ máy tính) sẽ chuyển form sang state *Success*.
* **Network response thất bại** (từ máy tính) sẽ chuyển form sang state *Error* cùng với thông báo lỗi tương ứng.

<Note>

Lưu ý rằng input từ con người thường yêu cầu [event handlers](/learn/responding-to-events)!

</Note>

Để giúp hình dung luồng này, hãy thử vẽ mỗi state trên giấy dưới dạng một vòng tròn có nhãn, và mỗi thay đổi giữa hai state dưới dạng một mũi tên. Bạn có thể phác thảo nhiều flow theo cách này và phát hiện, xử lý bug từ lâu trước khi triển khai.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Flow chart moving left to right with 5 nodes. The first node labeled 'empty' has one edge labeled 'start typing' connected to a node labeled 'typing'. That node has one edge labeled 'press submit' connected to a node labeled 'submitting', which has two edges. The left edge is labeled 'network error' connecting to a node labeled 'error'. The right edge is labeled 'network success' connecting to a node labeled 'success'.">

Các state của form

</Diagram>

</DiagramGroup>

### Bước 3: Biểu diễn state trong memory bằng `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

Tiếp theo, bạn cần biểu diễn các trạng thái hiển thị của component trong memory bằng [`useState`.](/reference/react/useState) Sự đơn giản là yếu tố then chốt: mỗi phần state là một "moving piece", và **bạn muốn có càng ít "moving piece" càng tốt.** Càng phức tạp thì càng dễ có nhiều bug!

Hãy bắt đầu với state *bắt buộc phải* tồn tại. Ví dụ, bạn sẽ cần lưu `answer` cho input và `error` (nếu có) để lưu lỗi gần đây nhất:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Sau đó, bạn sẽ cần một state variable biểu thị trạng thái hiển thị nào mà bạn muốn hiển thị. Thường có nhiều cách để biểu diễn điều đó trong memory, vì vậy bạn sẽ cần thử nghiệm.

Nếu ngay lập tức bạn gặp khó khăn trong việc tìm ra cách tốt nhất, hãy bắt đầu bằng cách thêm đủ state để bạn *chắc chắn* rằng tất cả trạng thái hiển thị có thể xảy ra đều được bao quát:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Ý tưởng đầu tiên của bạn có thể chưa phải là tốt nhất, nhưng không sao--refactor state là một phần của quá trình!

### Bước 4: Loại bỏ mọi state variable không thiết yếu {/*step-4-remove-any-non-essential-state-variables*/}

Bạn nên tránh trùng lặp trong nội dung state để chỉ theo dõi những gì thiết yếu. Dành một chút thời gian để refactor cấu trúc state sẽ giúp component dễ hiểu hơn, giảm trùng lặp và tránh những ý nghĩa ngoài dự kiến. Mục tiêu của bạn là **ngăn những trường hợp state trong memory không biểu diễn bất kỳ UI hợp lệ nào mà bạn muốn người dùng nhìn thấy.** (Ví dụ, bạn không bao giờ muốn hiển thị thông báo lỗi đồng thời vô hiệu hóa input, vì khi đó người dùng sẽ không thể sửa lỗi!)

Dưới đây là một số câu hỏi bạn có thể đặt ra về các state variable của mình:

* **Trạng thái này có gây ra nghịch lý không?** Ví dụ: `isTyping` và `isSubmitting` không thể đồng thời là `true`. Một nghịch lý thường có nghĩa là trạng thái chưa đủ chặt chẽ. Có bốn tổ hợp khả dĩ của hai boolean, nhưng chỉ có ba tổ hợp tương ứng với các trạng thái hợp lệ. Để loại bỏ trạng thái “không thể xảy ra”, bạn có thể gộp chúng thành một `status` chỉ có thể nhận một trong ba giá trị: `'typing'`, `'submitting'` hoặc `'success'`.
* **Thông tin tương tự đã có trong một state variable khác chưa?** Một nghịch lý khác: `isEmpty` và `isTyping` không thể đồng thời là `true`. Khi biến chúng thành các state variable riêng biệt, bạn có nguy cơ chúng bị lệch trạng thái và gây ra bug. May mắn là bạn có thể loại bỏ `isEmpty` và thay vào đó kiểm tra `answer.length === 0`.
* **Bạn có thể lấy được thông tin tương tự từ giá trị nghịch đảo của một state variable khác không?** Không cần `isError` vì thay vào đó bạn có thể kiểm tra `error !== null`.

Sau khi dọn dẹp, bạn còn lại 3 (giảm từ 7!) state variable *thiết yếu*:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

Bạn biết chúng là thiết yếu vì không thể loại bỏ bất kỳ biến nào mà không làm hỏng chức năng.

<DeepDive>

#### Loại bỏ các trạng thái “không thể xảy ra” bằng reducer {/*eliminating-impossible-states-with-a-reducer*/}

Ba biến này đủ để biểu diễn trạng thái của form. Tuy nhiên, vẫn còn một số trạng thái trung gian chưa thực sự hợp lý. Ví dụ, một `error` khác null không có ý nghĩa khi `status` là `'success'`. Để mô hình hóa trạng thái chính xác hơn, bạn có thể [tách nó thành một reducer.](/learn/extracting-state-logic-into-a-reducer) Reducer cho phép bạn hợp nhất nhiều state variable thành một object duy nhất và tập trung toàn bộ logic liên quan!

</DeepDive>

### Bước 5: Kết nối các event handler để cập nhật state {/*step-5-connect-the-event-handlers-to-set-state*/}

Cuối cùng, hãy tạo các event handler để cập nhật state. Dưới đây là form hoàn chỉnh, với tất cả event handler đã được kết nối:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Giả lập việc gửi yêu cầu qua mạng.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Mặc dù đoạn code này dài hơn ví dụ imperative ban đầu, nó ít dễ hỏng hơn nhiều. Việc biểu diễn tất cả tương tác dưới dạng thay đổi state cho phép bạn thêm các trạng thái hiển thị mới sau này mà không làm hỏng những trạng thái hiện có. Nó cũng cho phép bạn thay đổi nội dung cần hiển thị trong mỗi trạng thái mà không phải thay đổi logic của chính tương tác đó.

<Recap>

* Lập trình khai báo (declarative programming) có nghĩa là mô tả UI cho từng trạng thái hiển thị thay vì quản lý vi mô UI (imperative).
* Khi phát triển một component:
  1. Xác định tất cả trạng thái hiển thị của component.
  2. Xác định các trigger từ người dùng và từ máy tính làm thay đổi state.
  3. Mô hình hóa state bằng `useState`.
  4. Loại bỏ state không thiết yếu để tránh bug và nghịch lý.
  5. Kết nối các event handler để cập nhật state.

</Recap>



<Challenges>

#### Thêm và xóa một CSS class {/*add-and-remove-a-css-class*/}

Hãy làm sao để khi click vào ảnh, `background--active` CSS class được *xóa* khỏi `<div>` bên ngoài, nhưng class `picture--active` lại được *thêm* vào `<img>`. Khi click vào background lần nữa, các CSS class ban đầu sẽ được khôi phục.

Về mặt hiển thị, khi click vào ảnh, bạn sẽ thấy background màu tím bị xóa và đường viền của ảnh được highlight. Khi click bên ngoài ảnh, background được highlight, nhưng phần highlight đường viền ảnh bị xóa.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Component này có hai trạng thái hiển thị: khi ảnh active và khi ảnh inactive:

* Khi ảnh active, các CSS class là `background` và `picture picture--active`.
* Khi ảnh inactive, các CSS class là `background background--active` và `picture`.

Một boolean state variable là đủ để ghi nhớ ảnh có active hay không. Nhiệm vụ ban đầu là xóa hoặc thêm CSS class. Tuy nhiên, trong React, bạn cần *mô tả* điều mình muốn thấy thay vì *thao tác* trực tiếp lên các phần tử UI. Vì vậy, bạn cần tính toán cả hai CSS class dựa trên state hiện tại. Bạn cũng cần [ngăn propagation](/learn/responding-to-events#stopping-propagation) để việc click vào ảnh không được ghi nhận là click vào background.

Hãy kiểm tra phiên bản này bằng cách click vào ảnh rồi click ra bên ngoài ảnh:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Ngoài ra, bạn có thể trả về hai đoạn JSX riêng biệt:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Hãy nhớ rằng nếu hai đoạn JSX khác nhau mô tả cùng một tree, cấu trúc lồng nhau của chúng (first `<div>` → first `<img>`) phải khớp nhau. Nếu không, việc bật/tắt `isActive` sẽ tạo lại toàn bộ tree bên dưới và [đặt lại state.](/learn/preserving-and-resetting-state) Đây là lý do nếu cả hai trường hợp đều trả về một JSX tree tương tự nhau, tốt hơn hết bạn nên viết chúng thành một đoạn JSX duy nhất.

</Solution>

#### Trình chỉnh sửa profile {/*profile-editor*/}

Dưới đây là một form nhỏ được triển khai bằng JavaScript thuần và DOM. Hãy thử tương tác với form để hiểu cách nó hoạt động:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Form này chuyển đổi giữa hai mode: ở mode chỉnh sửa, bạn thấy các input; còn ở mode xem, bạn chỉ thấy kết quả. Nhãn của button thay đổi giữa “Edit” và “Save” tùy thuộc vào mode hiện tại. Khi bạn thay đổi các input, thông báo chào mừng ở phía dưới sẽ được cập nhật theo thời gian thực.

Nhiệm vụ của bạn là triển khai lại form này bằng React trong sandbox bên dưới. Để thuận tiện, markup đã được chuyển đổi sang JSX, nhưng bạn sẽ cần làm cho các input được hiển thị và ẩn đi giống như phiên bản ban đầu.

Hãy đảm bảo rằng phần text ở phía dưới cũng được cập nhật!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Bạn sẽ cần hai state variable để lưu các giá trị input: `firstName` và `lastName`. Bạn cũng sẽ cần một state variable `isEditing` lưu việc có hiển thị các input hay không. Bạn _không_ cần biến `fullName` vì full name luôn có thể được tính từ `firstName` và `lastName`.

Cuối cùng, bạn nên sử dụng [conditional rendering](/learn/conditional-rendering) để hiển thị hoặc ẩn các input tùy thuộc vào `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Hãy so sánh solution này với imperative code ban đầu. Chúng khác nhau như thế nào?

</Solution>

#### Refactor imperative solution không dùng React {/*refactor-the-imperative-solution-without-react*/}

Đây là sandbox ban đầu từ challenge trước, được viết theo cách imperative và không dùng React:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Hãy tưởng tượng React không tồn tại. Bạn có thể refactor đoạn code này theo cách giúp logic ít dễ hỏng hơn và gần với phiên bản React hơn không? Nếu state được biểu diễn rõ ràng như trong React thì đoạn code sẽ trông như thế nào?

Nếu bạn chưa biết nên bắt đầu từ đâu, stub bên dưới đã có sẵn phần lớn cấu trúc. Nếu bắt đầu từ đây, hãy điền logic còn thiếu vào function `updateDOM`. (Tham khảo code ban đầu khi cần.)

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: hiện input, ẩn nội dung
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: ẩn input, hiện nội dung
  }
  // TODO: cập nhật nhãn văn bản
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

Logic còn thiếu bao gồm việc bật/tắt hiển thị input và content, cũng như cập nhật các nhãn:

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Function `updateDOM` mà bạn viết cho thấy React thực hiện điều gì bên dưới khi bạn set state. (Tuy nhiên, React cũng tránh tác động đến DOM đối với những property không thay đổi kể từ lần gần nhất chúng được set.)

</Solution>

</Challenges>
