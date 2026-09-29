---
title: startTransition
---

<Intro>

`startTransition` cho phép bạn render một phần UI ở chế độ nền.

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## Tham khảo {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

Hàm `startTransition` cho phép bạn đánh dấu một state update là một Transition.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[Xem thêm ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `action`: Một hàm cập nhật một số state bằng cách gọi một hoặc nhiều hàm [`set` ](/reference/react/useState#setstate). React gọi `action` ngay lập tức mà không truyền tham số, đồng thời đánh dấu tất cả state update được lên lịch một cách đồng bộ trong suốt lần gọi hàm `action` là các Transition. Mọi lời gọi async được await trong `action` sẽ được đưa vào transition, nhưng hiện tại yêu cầu bạn bọc mọi hàm `set` sau `await` trong một `startTransition` bổ sung (xem [Khắc phục sự cố](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Các state update được đánh dấu là Transition sẽ [không chặn](#marking-a-state-update-as-a-non-blocking-transition) và [sẽ không hiển thị các loading indicator không mong muốn.](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### Giá trị trả về {/*returns*/}

`startTransition` không trả về bất kỳ giá trị nào.

#### Lưu ý {/*caveats*/}

* `startTransition` không cung cấp cách theo dõi xem một Transition có đang chờ xử lý hay không. Để hiển thị pending indicator trong khi Transition đang diễn ra, thay vào đó bạn cần [`useTransition`](/reference/react/useTransition).

* Bạn chỉ có thể bọc một update trong một Transition nếu có quyền truy cập vào hàm `set` của state đó. Nếu muốn bắt đầu một Transition để phản hồi một prop hoặc giá trị trả về từ custom Hook, hãy thử [`useDeferredValue`](/reference/react/useDeferredValue) thay thế.

* Hàm bạn truyền vào `startTransition` được gọi ngay lập tức, đánh dấu tất cả state update diễn ra trong khi hàm thực thi là các Transition. Nếu bạn cố thực hiện state update trong một `setTimeout`, chẳng hạn, chúng sẽ không được đánh dấu là Transition.

* Bạn phải bọc mọi state update sau các request async trong một `startTransition` khác để đánh dấu chúng là Transition. Đây là một hạn chế đã biết và chúng tôi sẽ khắc phục trong tương lai (xem [Khắc phục sự cố](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Một state update được đánh dấu là Transition sẽ bị gián đoạn bởi các state update khác. Ví dụ: nếu bạn cập nhật một chart component bên trong một Transition, nhưng sau đó bắt đầu nhập vào một input trong khi chart đang giữa quá trình re-render, React sẽ khởi động lại công việc render trên chart component sau khi xử lý state update của input.

* Không thể dùng các Transition update để điều khiển text input.

* Nếu có nhiều Transition đang diễn ra, hiện tại React sẽ gộp chúng lại với nhau. Đây là một hạn chế có thể được loại bỏ trong một phiên bản tương lai.

---

## Cách sử dụng {/*usage*/}

### Đánh dấu state update là một Transition không chặn {/*marking-a-state-update-as-a-non-blocking-transition*/}

Bạn có thể đánh dấu một state update là một *Transition* bằng cách bọc nó trong một lời gọi `startTransition`:

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transitions giúp bạn duy trì khả năng phản hồi của giao diện người dùng ngay cả trên các thiết bị chậm.

Với một Transition, UI của bạn vẫn phản hồi trong khi re-render. Ví dụ: nếu người dùng nhấp vào một tab nhưng sau đó đổi ý và nhấp vào tab khác, họ có thể làm vậy mà không cần chờ lần re-render đầu tiên hoàn tất.

<Note>

`startTransition` rất giống với [`useTransition`](/reference/react/useTransition), ngoại trừ việc nó không cung cấp cờ `isPending` để theo dõi xem một Transition có đang diễn ra hay không. Hàm độc lập này cũng không liên kết với một component, vì vậy nếu hàm được truyền vào nó ném ra lỗi hoặc trả về một Promise bị reject, React sẽ báo cáo lỗi bằng [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/Window/reportError). Bạn có thể gọi `startTransition` khi `useTransition` không khả dụng. Ví dụ: `startTransition` hoạt động bên ngoài các component, chẳng hạn như từ một data library.

[Tìm hiểu về Transitions và xem các ví dụ trên trang `useTransition`.](/reference/react/useTransition)

</Note>