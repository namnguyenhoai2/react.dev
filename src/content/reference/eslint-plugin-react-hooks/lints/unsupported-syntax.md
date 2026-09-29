---
title: unsupported-syntax
---

<Intro>

Kiểm tra cú pháp mà React Compiler không hỗ trợ. Nếu cần, bạn vẫn có thể sử dụng cú pháp này bên ngoài React, chẳng hạn như trong một hàm tiện ích độc lập.

</Intro>

## Chi tiết quy tắc {/*rule-details*/}

React Compiler cần phân tích tĩnh mã của bạn để áp dụng các tối ưu hóa. Những tính năng như `eval` và `with` khiến trình biên dịch không thể hiểu tĩnh mã thực hiện điều gì tại thời điểm biên dịch, vì vậy compiler không thể tối ưu hóa các component sử dụng chúng.

### Không hợp lệ {/*invalid*/}

Ví dụ về mã không đúng đối với quy tắc này:

```js
// ❌ Using eval in component
function Component({ code }) {
  const result = eval(code); // Can't be analyzed
  return <div>{result}</div>;
}

// ❌ Using with statement
function Component() {
  with (Math) { // Changes scope dynamically
    return <div>{sin(PI / 2)}</div>;
  }
}

// ❌ Dynamic property access with eval
function Component({propName}) {
  const value = eval(`props.${propName}`);
  return <div>{value}</div>;
}
```

### Hợp lệ {/*valid*/}

Ví dụ về mã đúng đối với quy tắc này:

```js
// ✅ Use normal property access
function Component({propName, props}) {
  const value = props[propName]; // Analyzable
  return <div>{value}</div>;
}

// ✅ Use standard Math methods
function Component() {
  return <div>{Math.sin(Math.PI / 2)}</div>;
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi cần đánh giá mã động {/*evaluate-dynamic-code*/}

Bạn có thể cần đánh giá mã do người dùng cung cấp:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ Wrong: eval in component
function Calculator({expression}) {
  const result = eval(expression); // Unsafe and unoptimizable
  return <div>Result: {result}</div>;
}
```

Thay vào đó, hãy sử dụng một expression parser an toàn:

```js
// ✅ Better: Use a safe parser
import {evaluate} from 'mathjs'; // or similar library

function Calculator({expression}) {
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      // Safe mathematical expression evaluation
      setResult(evaluate(expression));
    } catch (error) {
      setResult('Invalid expression');
    }
  };

  return (
    <div>
      <button onClick={calculate}>Calculate</button>
      {result && <div>Result: {result}</div>}
    </div>
  );
}
```

<Note>

Không bao giờ sử dụng `eval` với dữ liệu đầu vào của người dùng — đây là một rủi ro bảo mật. Hãy sử dụng các thư viện parsing chuyên dụng cho những trường hợp sử dụng cụ thể như biểu thức toán học, phân tích JSON hoặc đánh giá template.

</Note>