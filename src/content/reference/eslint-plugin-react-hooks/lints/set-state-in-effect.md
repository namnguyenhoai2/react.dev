---
title: set-state-in-effect
---

<Intro>

Kiểm tra việc gọi setState một cách đồng bộ trong effect, điều này có thể dẫn đến việc re-render làm giảm hiệu năng.

</Intro>

## Chi tiết về rule {/*rule-details*/}

Việc cập nhật state ngay lập tức bên trong một effect buộc React phải khởi động lại toàn bộ chu kỳ render. Khi bạn cập nhật state trong một effect, React phải re-render component, áp dụng các thay đổi vào DOM, rồi chạy lại các effect. Điều này tạo ra một lượt render bổ sung mà bạn có thể tránh bằng cách chuyển đổi dữ liệu trực tiếp trong quá trình render hoặc suy ra state từ props. Thay vào đó, hãy chuyển đổi dữ liệu ở cấp cao nhất của component. Đoạn code này sẽ tự động chạy lại khi props hoặc state thay đổi mà không kích hoạt thêm các chu kỳ render.

Các lệnh gọi `setState` đồng bộ trong effect sẽ kích hoạt re-render ngay lập tức trước khi trình duyệt có thể vẽ, gây ra vấn đề về hiệu năng và hiện tượng giật hình. React phải render hai lần: một lần để áp dụng việc cập nhật state, sau đó một lần nữa sau khi các effect chạy xong. Việc render hai lần này gây lãng phí khi cùng một kết quả có thể đạt được chỉ với một lần render.

Trong nhiều trường hợp, bạn cũng có thể không cần effect. Vui lòng xem [Bạn Có thể Không Cần Effect](/learn/you-might-not-need-an-effect) để biết thêm thông tin.

## Các vi phạm thường gặp {/*common-violations*/}

Rule này phát hiện một số mẫu sử dụng setState đồng bộ không cần thiết:

- Cập nhật state loading một cách đồng bộ
- Suy ra state từ props trong effect
- Chuyển đổi dữ liệu trong effect thay vì trong quá trình render

### Không hợp lệ {/*invalid*/}

Ví dụ về code không đúng đối với rule này:

```js
// ❌ Synchronous setState in effect
function Component({data}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data); // Extra render, use initial state instead
  }, [data]);
}

// ❌ Setting loading state synchronously
function Component() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Synchronous, causes extra render
    fetchData().then(() => setLoading(false));
  }, []);
}

// ❌ Transforming data in effect
function Component({rawData}) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    setProcessed(rawData.map(transform)); // Should derive in render
  }, [rawData]);
}

// ❌ Deriving state from props
function Component({selectedId, items}) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(items.find(i => i.id === selectedId));
  }, [selectedId, items]);
}
```

### Hợp lệ {/*valid*/}

Ví dụ về code đúng đối với rule này:

```js
// ✅ setState in an effect is fine if the value comes from a ref
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
}

// ✅ Calculate during render
function Component({selectedId, items}) {
  const selected = items.find(i => i.id === selectedId);
  return <div>{selected?.name}</div>;
}
```

**Khi có thể tính toán một giá trị từ props hoặc state hiện có, đừng đưa giá trị đó vào state.** Thay vào đó, hãy tính toán giá trị đó trong quá trình render. Điều này giúp code của bạn nhanh hơn, đơn giản hơn và ít lỗi hơn. Tìm hiểu thêm trong [Bạn Có thể Không Cần Effect](/learn/you-might-not-need-an-effect).