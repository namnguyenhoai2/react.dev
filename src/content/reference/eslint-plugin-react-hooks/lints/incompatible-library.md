---
title: incompatible-library
---

<Intro>

Xác thực việc sử dụng các thư viện không tương thích với memoization (thủ công hoặc tự động).

</Intro>

<Note>

Các thư viện này được thiết kế trước khi các quy tắc memoization của React được ghi chép đầy đủ. Khi đó, chúng đã đưa ra những lựa chọn phù hợp để tối ưu hóa các cách trực quan nhằm giữ cho component có mức độ reactive vừa đủ khi state của ứng dụng thay đổi. Mặc dù các pattern cũ này hoạt động hiệu quả, về sau chúng tôi phát hiện ra rằng chúng không tương thích với mô hình lập trình của React. Chúng tôi sẽ tiếp tục phối hợp với các tác giả thư viện để chuyển đổi các thư viện này sang những pattern tuân theo Rules of React.

</Note>

## Chi tiết về rule {/*rule-details*/}

Một số thư viện sử dụng các pattern không được React hỗ trợ. Khi linter phát hiện việc sử dụng các API này từ [danh sách đã biết](https://github.com/react/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/HIR/DefaultModuleTypeProvider.ts), linter sẽ đánh dấu chúng theo rule này. Điều này có nghĩa là React Compiler có thể tự động bỏ qua các component sử dụng những API không tương thích này để tránh làm hỏng ứng dụng của bạn.

```js
// Ví dụ về cách memoization bị hỏng với các thư viện này
function Form() {
  const { watch } = useForm();

  // ❌ Giá trị này sẽ không bao giờ cập nhật, kể cả khi trường 'name' thay đổi
  const name = useMemo(() => watch('name'), [watch]);

  return <div>Name: {name}</div>; // Giao diện trông như bị "đóng băng"
}
```

React Compiler tự động memoize các giá trị theo Rules of React. Nếu có điều gì đó bị hỏng khi sử dụng `useMemo` thủ công, thì tối ưu hóa tự động của compiler cũng sẽ bị hỏng. Rule này giúp xác định các pattern có vấn đề đó.

<DeepDive>

#### Thiết kế API tuân theo Rules of React {/*designing-apis-that-follow-the-rules-of-react*/}

Một câu hỏi cần cân nhắc khi thiết kế API của thư viện hoặc hook là liệu việc gọi API đó có thể được memoize an toàn bằng `useMemo` hay không. Nếu không thể, cả memoization thủ công lẫn memoization của React Compiler đều sẽ làm hỏng code của người dùng.

Ví dụ, một pattern không tương thích là “tính khả biến nội tại (interior mutability)”. Tính khả biến nội tại xảy ra khi một object hoặc function tự duy trì state ẩn thay đổi theo thời gian, mặc dù reference trỏ đến nó vẫn giữ nguyên. Hãy hình dung đó như một chiếc hộp trông vẫn giống bên ngoài nhưng âm thầm sắp xếp lại những gì bên trong. React không thể nhận biết có gì đã thay đổi vì nó chỉ kiểm tra xem bạn có cung cấp một chiếc hộp khác hay không, chứ không kiểm tra bên trong hộp. Điều này làm hỏng memoization, vì React dựa vào việc object bên ngoài (hoặc function) thay đổi nếu một phần giá trị của nó đã thay đổi.

Theo nguyên tắc chung, khi thiết kế API cho React, hãy cân nhắc liệu `useMemo` có làm hỏng API đó hay không:

```js
function Component() {
  const { someFunction } = useLibrary();
  // việc memo hóa các hàm như thế này luôn phải an toàn
  const result = useMemo(() => someFunction(), [someFunction]);
}
```

Thay vào đó, hãy thiết kế các API trả về state bất biến và sử dụng các function cập nhật tường minh:

```js
// ✅ Tốt: Trả về state bất biến, thay đổi tham chiếu khi cập nhật
function Component() {
  const { field, updateField } = useLibrary();
  // việc memo hóa điều này luôn an toàn
  const greeting = useMemo(() => `Hello, ${field.name}!`, [field.name]);

  return (
    <div>
      <input
        value={field.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <p>{greeting}</p>
    </div>
  );
}
```

</DeepDive>

### Không hợp lệ {/*invalid*/}

Ví dụ về code không đúng đối với rule này:

```js
// ❌ `watch` của react-hook-form
function Component() {
  const {watch} = useForm();
  const value = watch('field'); // Tính khả biến nội tại
  return <div>{value}</div>;
}

// ❌ `useReactTable` của TanStack Table
function Component({data}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // instance của table sử dụng tính khả biến nội tại
  return <Table table={table} />;
}
```

<Pitfall>

#### MobX {/*mobx*/}

Các pattern của MobX như `observer` cũng phá vỡ các giả định của memoization, nhưng linter hiện chưa phát hiện được chúng. Nếu bạn sử dụng MobX và nhận thấy ứng dụng của mình không hoạt động với React Compiler, bạn có thể cần sử dụng `"use no memo" directive`.

```js
// ❌ `observer` của MobX
const Component = observer(() => {
  const [timer] = useState(() => new Timer());
  return <span>Seconds passed: {timer.secondsPassed}</span>;
});
```

</Pitfall>

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với rule này:

```js
// ✅ Với react-hook-form, hãy dùng `useWatch`:
function Component() {
  const {register, control} = useForm();
  const watchedValue = useWatch({
    control,
    name: 'field'
  });

  return (
    <>
      <input {...register('field')} />
      <div>Current value: {watchedValue}</div>
    </>
  );
}
```

Một số thư viện khác hiện chưa có API thay thế tương thích với mô hình memoization của React. Nếu linter không tự động bỏ qua các component hoặc hook gọi những API này, vui lòng [gửi issue](https://github.com/react/react/issues) để chúng tôi có thể bổ sung chúng vào linter.
