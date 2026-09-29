---
title: "<progress>"
---

<Intro>

Thành phần built-in browser `<progress>` [component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) cho phép bạn hiển thị chỉ báo tiến trình.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `<progress>` {/*progress*/}

Để hiển thị chỉ báo tiến trình, hãy render component [built-in browser `<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress).

```js
<progress value={0.5} />
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*props*/}

`<progress>` hỗ trợ tất cả [props phần tử phổ biến.](/reference/react-dom/components/common#common-props)

Ngoài ra, `<progress>` hỗ trợ các props sau:

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#max): Một số. Chỉ định `value` tối đa. Mặc định là `1`.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#value): Một số nằm giữa `0` và `max`, hoặc `null` để biểu thị tiến trình không xác định. Chỉ định mức độ công việc đã hoàn thành.

---

## Cách sử dụng {/*usage*/}

### Điều khiển chỉ báo tiến trình {/*controlling-a-progress-indicator*/}

Để hiển thị chỉ báo tiến trình, hãy render một component `<progress>`. Bạn có thể truyền một số `value` nằm giữa `0` và giá trị `max` mà bạn chỉ định. Nếu không truyền giá trị `max`, giá trị đó sẽ mặc định được giả định là `1`.

Nếu thao tác không đang diễn ra, hãy truyền `value={null}` để đưa chỉ báo tiến trình vào trạng thái không xác định.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>