---
title: Giới thiệu
---

<Intro>
React Compiler là một công cụ build mới, tự động tối ưu hóa ứng dụng React của bạn. Công cụ này hoạt động với JavaScript thuần và hiểu [Các Quy tắc của React](/reference/rules), vì vậy bạn không cần viết lại bất kỳ đoạn mã nào để sử dụng nó.
</Intro>

<YouWillLearn>

* React Compiler thực hiện những gì
* Bắt đầu sử dụng compiler
* Các chiến lược áp dụng từng bước
* Debug và khắc phục sự cố khi có vấn đề
* Sử dụng compiler cho thư viện React của bạn

</YouWillLearn>

## React Compiler thực hiện những gì? {/*what-does-react-compiler-do*/}

React Compiler tự động tối ưu hóa ứng dụng React của bạn tại thời điểm build. React thường đủ nhanh ngay cả khi không tối ưu hóa, nhưng đôi khi bạn cần tự memo hóa các component và giá trị để ứng dụng duy trì khả năng phản hồi. Việc memo hóa thủ công này tẻ nhạt, dễ mắc lỗi và làm tăng lượng code cần bảo trì. React Compiler tự động thực hiện việc tối ưu hóa này cho bạn, giúp bạn không phải bận tâm về vấn đề đó để có thể tập trung xây dựng các tính năng.

### Trước React Compiler {/*before-react-compiler*/}

Khi không có compiler, bạn cần tự memo hóa các component và giá trị để tối ưu hóa việc re-render:

```js
import { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback((item) => {
    onClick(item.id);
  }, [onClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```


<Note>

Việc memo hóa thủ công này có một lỗi tinh vi làm hỏng quá trình memo hóa:

```js [[2, 1, "() => handleClick(item)"]]
<Item key={item.id} onClick={() => handleClick(item)} />
```

Mặc dù `handleClick` được bọc trong `useCallback`, hàm mũi tên `() => handleClick(item)` lại tạo một hàm mới mỗi khi component render. Điều này có nghĩa là `Item` sẽ luôn nhận một prop `onClick` mới, làm hỏng quá trình memo hóa.

React Compiler có thể tối ưu hóa chính xác trường hợp này, dù có hoặc không có hàm mũi tên, đảm bảo rằng `Item` chỉ re-render khi `props.onClick` thay đổi.

</Note>

### Sau React Compiler {/*after-react-compiler*/}

Với React Compiler, bạn viết cùng đoạn code đó mà không cần memo hóa thủ công:

```js
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

_[Xem ví dụ này trong React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAogB4AOCmYeAbggMIQC2Fh1OAFMEQCYBDHAIA0RQowA2eOAGsiAXwCURYAB1iROITA4iFGBERgwCPgBEhAogF4iCStVoMACoeO1MAcy6DhSgG4NDSItHT0ACwFMPkkmaTlbIi48HAQWFRsAPlUQ0PFMKRlZFLSWADo8PkC8hSDMPJgEHFhiLjzQgB4+eiyO-OADIwQTM0thcpYBClL02xz2zXz8zoBJMqJZBABPG2BU9Mq+BQKiuT2uTJyomLizkoOMk4B6PqX8pSUFfs7nnro3qEapgFCAFEA)_

React Compiler tự động áp dụng cách memo hóa tối ưu, đảm bảo ứng dụng của bạn chỉ re-render khi cần thiết.

<DeepDive>
#### React Compiler thêm loại memo hóa nào? {/*what-kind-of-memoization-does-react-compiler-add*/}

Memo hóa tự động của React Compiler chủ yếu tập trung vào **cải thiện hiệu suất cập nhật** (re-render các component hiện có), vì vậy tập trung vào hai trường hợp sử dụng sau:

1. **Bỏ qua việc re-render lan truyền của các component**
    * Việc re-render `<Parent />` khiến nhiều component trong cây component của nó re-render, dù chỉ `<Parent />` thay đổi
1. **Bỏ qua các phép tính tốn kém bên ngoài React**
    * Ví dụ: gọi `expensivelyProcessAReallyLargeArrayOfObjects()` bên trong component hoặc hook cần dữ liệu đó

#### Tối ưu hóa việc re-render {/*optimizing-re-renders*/}

React cho phép bạn biểu diễn UI dưới dạng một hàm của state hiện tại (cụ thể hơn: props, state và context của chúng). Trong cách triển khai hiện tại, khi state của một component thay đổi, React sẽ re-render component đó _và tất cả các component con của nó_ — trừ khi bạn đã áp dụng một hình thức memo hóa thủ công nào đó với `useMemo()`, `useCallback()` hoặc `React.memo()`. Ví dụ, trong ví dụ sau, `<MessageButton>` sẽ re-render bất cứ khi nào state của `<FriendList>` thay đổi:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_Xem ví dụ này trong React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler tự động áp dụng cơ chế tương đương với memo hóa thủ công, đảm bảo chỉ những phần liên quan của ứng dụng được re-render khi state thay đổi. Cách này đôi khi được gọi là “tính phản ứng chi tiết” (fine-grained reactivity). Trong ví dụ trên, React Compiler xác định rằng giá trị trả về của `<FriendListCard />` có thể được sử dụng lại ngay cả khi `friends` thay đổi, đồng thời tránh tạo lại JSX này _và_ tránh re-render `<MessageButton>` khi count thay đổi.

#### Các phép tính tốn kém cũng được memo hóa {/*expensive-calculations-also-get-memoized*/}

React Compiler cũng có thể tự động memo hóa các phép tính tốn kém được sử dụng trong quá trình render:

```js
// **Not** memoized by React Compiler, since this is not a component or hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoized by React Compiler since this is a component
function TableContainer({ items }) {
  // This function call would be memoized:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_Xem ví dụ này trong React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

Tuy nhiên, nếu `expensivelyProcessAReallyLargeArrayOfObjects` thực sự là một hàm tốn kém, bạn có thể cân nhắc triển khai cơ chế memo hóa riêng bên ngoài React, vì:

- React Compiler chỉ memo hóa các component và hook của React, không phải mọi hàm
- Cơ chế memo hóa của React Compiler không được chia sẻ giữa nhiều component hoặc hook

Vì vậy, nếu `expensivelyProcessAReallyLargeArrayOfObjects` được sử dụng trong nhiều component khác nhau, ngay cả khi truyền xuống cùng chính xác các item, phép tính tốn kém đó vẫn sẽ được thực hiện lặp đi lặp lại. Chúng tôi khuyên bạn nên [profiling](reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) trước để xem phép tính đó có thực sự tốn kém hay không, rồi mới làm cho code phức tạp hơn.
</DeepDive>

## Tôi có nên dùng thử compiler không? {/*should-i-try-out-the-compiler*/}

Chúng tôi khuyến khích mọi người bắt đầu sử dụng React Compiler. Mặc dù hiện tại compiler vẫn là một phần bổ sung tùy chọn cho React, một số tính năng trong tương lai có thể yêu cầu compiler để hoạt động đầy đủ.

### Sử dụng có an toàn không? {/*is-it-safe-to-use*/}

React Compiler hiện đã ổn định và đã được kiểm thử rộng rãi trong môi trường production. Mặc dù đã được sử dụng trong production tại các công ty như Meta, việc đưa compiler vào production cho ứng dụng của bạn sẽ phụ thuộc vào tình trạng của codebase và mức độ bạn tuân thủ [Các Quy tắc của React](/reference/rules).

## Những build tool nào được hỗ trợ? {/*what-build-tools-are-supported*/}

React Compiler có thể được cài đặt trên [nhiều build tool](/learn/react-compiler/installation) như Babel, Vite, Metro và Rsbuild.

React Compiler chủ yếu là một wrapper plugin Babel nhẹ bên ngoài compiler core, vốn được thiết kế để tách biệt khỏi chính Babel. Mặc dù phiên bản ổn định đầu tiên của compiler vẫn chủ yếu là một plugin Babel, chúng tôi đang làm việc với các team swc và [oxc](https://github.com/oxc-project/oxc/issues/10048) để xây dựng hỗ trợ React Compiler hạng nhất, ताकि trong tương lai bạn không phải thêm Babel trở lại các build pipeline của mình.

Người dùng Next.js có thể bật React Compiler được gọi qua swc bằng cách sử dụng [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) trở lên.

## Tôi nên làm gì với useMemo, useCallback và React.memo? {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

Theo mặc định, React Compiler sẽ memo hóa code của bạn dựa trên việc phân tích và các heuristic. Trong hầu hết trường hợp, việc memo hóa này sẽ chính xác, hoặc thậm chí chính xác hơn, so với những gì bạn có thể tự viết.

Tuy nhiên, trong một số trường hợp, developer có thể cần kiểm soát nhiều hơn đối với việc memo hóa. Các hook `useMemo` và `useCallback` vẫn có thể được sử dụng cùng React Compiler như một escape hatch để kiểm soát những giá trị nào được memo hóa. Một trường hợp sử dụng phổ biến là khi một giá trị đã memo hóa được dùng làm dependency của effect, nhằm đảm bảo effect không chạy lặp lại ngay cả khi các dependency của nó không thực sự thay đổi.

Đối với code mới, chúng tôi khuyên bạn nên dựa vào compiler để memo hóa và sử dụng `useMemo`/`useCallback` khi cần kiểm soát chính xác.

Đối với code hiện có, chúng tôi khuyên bạn nên giữ nguyên cơ chế memo hóa hiện tại (việc loại bỏ nó có thể thay đổi output của quá trình biên dịch) hoặc kiểm thử cẩn thận trước khi loại bỏ memo hóa.

## Dùng thử React Compiler {/*try-react-compiler*/}

Phần này sẽ giúp bạn bắt đầu sử dụng React Compiler và hiểu cách sử dụng hiệu quả trong các dự án của mình.

* **[Cài đặt](/learn/react-compiler/installation)** - Cài đặt React Compiler và cấu hình cho các build tool của bạn
* **[Khả năng tương thích với phiên bản React](/reference/react-compiler/target)** - Hỗ trợ React 17, 18 và 19
* **[Cấu hình](/reference/react-compiler/configuration)** - Tùy chỉnh compiler cho nhu cầu cụ thể của bạn
* **[Áp dụng từng bước](/learn/react-compiler/incremental-adoption)** - Các chiến lược triển khai compiler dần dần trong những codebase hiện có
* **[Debug và khắc phục sự cố](/learn/react-compiler/debugging)** - Xác định và sửa các vấn đề khi sử dụng compiler
* **[Biên dịch thư viện](/reference/react-compiler/compiling-libraries)** - Các phương pháp tốt nhất để phân phối code đã biên dịch
* **[Tham chiếu API](/reference/react-compiler/configuration)** - Tài liệu chi tiết về tất cả tùy chọn cấu hình

## Tài nguyên bổ sung {/*additional-resources*/}

Ngoài các tài liệu này, chúng tôi khuyên bạn nên xem [Nhóm làm việc React Compiler](https://github.com/reactwg/react-compiler) để biết thêm thông tin và thảo luận về compiler.