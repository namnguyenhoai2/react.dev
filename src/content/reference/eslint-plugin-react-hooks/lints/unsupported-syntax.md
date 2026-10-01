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
// ❌ Dùng eval trong component
function Component({ code }) {
  const result = eval(code); // Không thể phân tích
  return <div>{result}</div>;
}

// ❌ Dùng câu lệnh with
function Component() {
  with (Math) { // Thay đổi scope động
    return <div>{sin(PI / 2)}</div>;
  }
}

// ❌ Truy cập thuộc tính động bằng eval
function Component({propName}) {
  const value = eval(`props.${propName}`);
  return <div>{value}</div>;
}
```

### Hợp lệ {/*valid*/}

Ví dụ về mã đúng đối với quy tắc này:

```js
// ✅ Dùng cách truy cập thuộc tính thông thường
function Component({propName, props}) {
  const value = props[propName]; // Có thể phân tích
  return <div>{value}</div>;
}

// ✅ Dùng các phương thức Math chuẩn
function Component() {
  return <div>{Math.sin(Math.PI / 2)}</div>;
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi cần đánh giá mã động {/*evaluate-dynamic-code*/}

Bạn có thể cần đánh giá mã do người dùng cung cấp:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ Sai: eval trong component
function Calculator({expression}) {
  const result = eval(expression); // Không an toàn và không thể tối ưu hóa
  return <div>Result: {result}</div>;
}
```

Thay vào đó, hãy sử dụng một expression parser an toàn:

```js
// ✅ Tốt hơn: Dùng parser an toàn
import {evaluate} from 'mathjs'; // hoặc thư viện tương tự

function Calculator({expression}) {
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      // Đánh giá biểu thức toán học an toàn
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
