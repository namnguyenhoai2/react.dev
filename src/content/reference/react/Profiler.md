---
title: <Profiler>
---

<Intro>

`<Profiler>` cho phép bạn đo lường hiệu năng rendering của một cây React theo cách lập trình.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## Tài liệu tham khảo {/*reference*/}

### `<Profiler>` {/*profiler*/}

Bọc một cây component trong `<Profiler>` để đo lường hiệu năng rendering của cây đó.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id`: Một chuỗi xác định phần UI mà bạn đang đo lường.
* `onRender`: Một [`onRender` callback](#onrender-callback) mà React gọi mỗi khi các component bên trong cây được profile cập nhật. Callback này nhận thông tin về nội dung đã được render và thời gian thực hiện.

#### Lưu ý {/*caveats*/}

* Việc profiling tạo thêm một phần overhead, vì vậy **theo mặc định, tính năng này bị vô hiệu hóa trong bản build production.** Để bật profiling trong production, bạn cần bật [một bản build production đặc biệt có bật profiling.](/reference/dev-tools/react-performance-tracks#using-profiling-builds)

---

### Callback `onRender` {/*onrender-callback*/}

React sẽ gọi callback `onRender` của bạn với thông tin về nội dung đã được render.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```

#### Tham số {/*onrender-parameters*/}

* `id`: Giá trị prop `id` dạng chuỗi của cây `<Profiler>` vừa commit. Điều này giúp bạn xác định phần nào của cây đã được commit nếu bạn đang sử dụng nhiều profiler.
* `phase`: `"mount"`, `"update"` hoặc `"nested-update"`. Điều này cho biết cây vừa được mount lần đầu hay được re-render do có thay đổi trong props, state hoặc Hooks.
* `actualDuration`: Số mili giây đã dành để render `<Profiler>` và các component con của nó trong lần cập nhật hiện tại. Giá trị này cho biết subtree sử dụng memoization hiệu quả đến mức nào (ví dụ: [`memo`](/reference/react/memo) và [`useMemo`](/reference/react/useMemo)). Lý tưởng nhất là giá trị này sẽ giảm đáng kể sau lần mount ban đầu, vì nhiều component con sẽ chỉ cần re-render khi các prop cụ thể của chúng thay đổi.
* `baseDuration`: Số mili giây ước tính cần thiết để re-render toàn bộ subtree `<Profiler>` mà không có bất kỳ tối ưu hóa nào. Giá trị này được tính bằng cách cộng các thời lượng render gần đây nhất của từng component trong cây. Giá trị này ước tính chi phí render trong trường hợp xấu nhất (ví dụ: lần mount ban đầu hoặc một cây không có memoization). Hãy so sánh `actualDuration` với giá trị này để xem memoization có hoạt động hay không.
* `startTime`: Dấu thời gian dạng số cho biết thời điểm React bắt đầu render lần cập nhật hiện tại.
* `commitTime`: Dấu thời gian dạng số cho biết thời điểm React commit lần cập nhật hiện tại. Giá trị này được dùng chung giữa tất cả profiler trong một lần commit, cho phép nhóm chúng lại nếu cần.

---

## Cách sử dụng {/*usage*/}

### Đo lường hiệu năng rendering theo cách lập trình {/*measuring-rendering-performance-programmatically*/}

Bọc component `<Profiler>` xung quanh một cây React để đo lường hiệu năng rendering của cây đó.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

Component này yêu cầu hai prop: một `id` (chuỗi) và một `onRender` callback (hàm) mà React gọi mỗi khi một component bên trong cây “commit” một lần cập nhật.

<Pitfall>

Việc profiling tạo thêm một phần overhead, vì vậy **theo mặc định, tính năng này bị vô hiệu hóa trong bản build production.** Để bật profiling trong production, bạn cần bật [một bản build production đặc biệt có bật profiling.](/reference/dev-tools/react-performance-tracks#using-profiling-builds)

</Pitfall>

<Note>

`<Profiler>` cho phép bạn thu thập các phép đo theo cách lập trình. Nếu bạn đang tìm kiếm một profiler tương tác, hãy thử tab Profiler trong [React Developer Tools](/learn/react-developer-tools). Công cụ này cung cấp chức năng tương tự dưới dạng một browser extension.

Các component được bọc trong `<Profiler>` cũng sẽ được đánh dấu trong [Component tracks](/reference/dev-tools/react-performance-tracks#components) của React Performance tracks, ngay cả trong các bản build có profiling.
Trong các bản build development, tất cả component đều được đánh dấu trong Components track, bất kể chúng có được bọc trong `<Profiler>` hay không.

</Note>

---

### Đo lường các phần khác nhau của ứng dụng {/*measuring-different-parts-of-the-application*/}

Bạn có thể sử dụng nhiều component `<Profiler>` để đo lường các phần khác nhau trong ứng dụng:

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

Bạn cũng có thể lồng các component `<Profiler>`:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

Mặc dù `<Profiler>` là một component nhẹ, bạn chỉ nên sử dụng nó khi cần thiết. Mỗi lần sử dụng sẽ tạo thêm overhead về CPU và bộ nhớ cho ứng dụng.

---