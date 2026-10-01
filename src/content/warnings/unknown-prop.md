---
title: Cảnh báo về Prop không xác định
---

Cảnh báo về prop không xác định sẽ xuất hiện nếu bạn cố gắng render một phần tử DOM với một prop không được React nhận diện là thuộc tính/property DOM hợp lệ. Bạn nên đảm bảo rằng các phần tử DOM của mình không có những prop thừa bị truyền qua.

Có một vài lý do thường gặp khiến cảnh báo này xuất hiện:

1. Bạn có đang sử dụng `{...props}` hoặc `cloneElement(element, props)` không? Khi sao chép các prop sang một component con, bạn nên đảm bảo rằng mình không vô tình chuyển tiếp những prop vốn chỉ dành cho component cha. Xem các cách khắc phục phổ biến cho vấn đề này bên dưới.

2. Bạn đang sử dụng một thuộc tính DOM không chuẩn trên một node DOM gốc, có thể là để biểu diễn dữ liệu tùy chỉnh. Nếu bạn đang cố gắn dữ liệu tùy chỉnh vào một phần tử DOM tiêu chuẩn, hãy cân nhắc sử dụng custom data attribute như được mô tả [trên MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes).

3. React chưa nhận diện thuộc tính mà bạn đã chỉ định. Điều này có thể sẽ được khắc phục trong một phiên bản React tương lai. React sẽ cho phép bạn truyền thuộc tính đó mà không cảnh báo nếu bạn viết tên thuộc tính bằng chữ thường.

4. Bạn đang sử dụng một component React không viết hoa chữ cái đầu, chẳng hạn như `<myButton />`. React diễn giải nó thành một thẻ DOM vì phép biến đổi JSX của React sử dụng quy ước chữ hoa và chữ thường để phân biệt giữa các component do người dùng định nghĩa và thẻ DOM. Với các component React của riêng mình, hãy sử dụng PascalCase. Ví dụ, hãy viết `<MyButton />` thay vì `<myButton />`.

---

Nếu nhận được cảnh báo này vì bạn truyền các prop như `{...props}`, component cha cần “tiêu thụ” mọi prop dành cho component cha thay vì component con. Ví dụ:

**Không nên:** Prop `layout` không mong muốn được chuyển tiếp đến thẻ `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // SAI! Vì bạn biết chắc rằng "layout" không phải là prop mà <div> hiểu được.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // SAI! Vì bạn biết chắc rằng "layout" không phải là prop mà <div> hiểu được.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Nên:** Có thể sử dụng spread syntax để lấy các biến ra khỏi props và đặt các prop còn lại vào một biến.

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**Nên:** Bạn cũng có thể gán các prop vào một object mới rồi xóa các key mà mình đang sử dụng khỏi object mới đó. Hãy đảm bảo không xóa các prop khỏi object `this.props` ban đầu, vì object đó nên được xem là immutable.

```js
function MyDiv(props) {
  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
