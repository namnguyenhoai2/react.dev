---
title: Các track về hiệu năng của React
---

<Intro>

Các track về hiệu năng của React là những mục tùy chỉnh chuyên biệt xuất hiện trên dòng thời gian của panel Performance trong công cụ dành cho nhà phát triển của trình duyệt.

</Intro>

Các track này được thiết kế để cung cấp cho nhà phát triển những thông tin toàn diện về hiệu năng của ứng dụng React bằng cách trực quan hóa các sự kiện và chỉ số dành riêng cho React cùng với những nguồn dữ liệu quan trọng khác như các yêu cầu mạng, quá trình thực thi JavaScript và hoạt động của event loop, tất cả được đồng bộ trên một dòng thời gian thống nhất trong panel Performance để có được sự hiểu biết đầy đủ về hành vi của ứng dụng.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/overview.png" alt="React Performance Tracks" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/overview.dark.png" alt="React Performance Tracks" />
</div>

<InlineToc />

---

## Cách sử dụng {/*usage*/}

Các track về hiệu năng của React chỉ khả dụng trong các bản build development và profiling của React:

- **Development**: được bật theo mặc định.
- **Profiling**: theo mặc định, chỉ các track Scheduler được bật. Track Components chỉ liệt kê những Components nằm trong các cây con được bọc bằng [`<Profiler>`](/reference/react/Profiler). Nếu bạn đã bật [tiện ích React Developer Tools](/learn/react-developer-tools), tất cả Components sẽ được đưa vào track Components ngay cả khi chúng không được bọc trong `<Profiler>`. Các track Server không khả dụng trong các bản build profiling.

Nếu được bật, các track sẽ tự động xuất hiện trong các trace mà bạn ghi lại bằng panel Performance trên những trình duyệt cung cấp [extensibility APIs](https://developer.chrome.com/docs/devtools/performance/extension).

<Pitfall>

Cơ chế instrumentation cho profiling cung cấp năng lượng cho các track về hiệu năng của React tạo thêm một phần overhead, vì vậy theo mặc định, cơ chế này bị tắt trong các bản build production.
Các track Server Components và Server Requests chỉ khả dụng trong các bản build development.

</Pitfall>

### Sử dụng các bản build profiling {/*using-profiling-builds*/}

Ngoài các bản build production và development, React còn bao gồm một bản build profiling đặc biệt.
Để sử dụng các bản build profiling, bạn phải dùng `react-dom/profiling` thay cho `react-dom/client`.
Chúng tôi khuyến nghị bạn alias `react-dom/client` thành `react-dom/profiling` trong thời gian build thông qua các alias của bundler, thay vì cập nhật thủ công từng import `react-dom/client`.
Framework của bạn có thể đã tích hợp sẵn hỗ trợ để bật bản build profiling của React.

---

## Các track {/*tracks*/}

### Scheduler {/*scheduler*/}

Scheduler là một khái niệm nội bộ của React, được dùng để quản lý các task với những mức độ ưu tiên khác nhau. Track này gồm 4 subtrack, mỗi subtrack đại diện cho công việc có một mức độ ưu tiên cụ thể:

- **Blocking** - Các cập nhật đồng bộ, có thể được khởi tạo bởi những tương tác của người dùng.
- **Transition** - Công việc không chặn diễn ra trong background, thường được khởi tạo thông qua [`startTransition`](/reference/react/startTransition).
- **Suspense** - Công việc liên quan đến các boundary Suspense, chẳng hạn như hiển thị fallback hoặc hiển thị nội dung.
- **Idle** - Công việc có mức độ ưu tiên thấp nhất, được thực hiện khi không còn task nào khác có mức độ ưu tiên cao hơn.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler.png" alt="Scheduler track" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler.dark.png" alt="Scheduler track" />
</div>

#### Các lần render {/*renders*/}

Mỗi lượt render gồm nhiều phase mà bạn có thể xem trên dòng thời gian:

- **Update** - nguyên nhân gây ra một lượt render mới.
- **Render** - React render cây con đã được cập nhật bằng cách gọi các hàm render của các component. Bạn có thể xem cây con của các component được render trên [Components track](#components), sử dụng cùng một bảng màu.
- **Commit** - Sau khi render các component, React sẽ submit các thay đổi lên DOM và chạy các layout effect, chẳng hạn như [`useLayoutEffect`](/reference/react/useLayoutEffect).
- **Remaining Effects** - React chạy các passive effect của cây con đã được render. Việc này thường xảy ra sau khi paint, và đây là lúc React chạy những hook như [`useEffect`](/reference/react/useEffect). Một ngoại lệ đã biết là các tương tác của người dùng, chẳng hạn như thao tác nhấp hoặc các sự kiện rời rạc khác. Trong trường hợp này, phase này có thể chạy trước khi paint.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-update.png" alt="Scheduler track: updates" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-update.dark.png" alt="Scheduler track: updates" />
</div>

[Tìm hiểu thêm về các lần render và commit](/learn/render-and-commit).

#### Các cập nhật dây chuyền {/*cascading-updates*/}

Các cập nhật dây chuyền là một trong những pattern gây suy giảm hiệu năng. Nếu một cập nhật được lên lịch trong lúc đang diễn ra một lượt render, React có thể loại bỏ phần công việc đã hoàn tất và bắt đầu một lượt mới.

Trong các bản build development, React có thể cho bạn biết Component nào đã lên lịch cho một cập nhật mới. Điều này bao gồm cả các cập nhật thông thường và các cập nhật dây chuyền. Bạn có thể xem stack trace được bổ sung thông tin bằng cách nhấp vào mục "Cascading update", mục này cũng sẽ hiển thị tên của method đã lên lịch cho một cập nhật.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-cascading-update.png" alt="Scheduler track: cascading updates" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-cascading-update.dark.png" alt="Scheduler track: cascading updates" />
</div>

[Tìm hiểu thêm về Effects](/learn/you-might-not-need-an-effect).

### Components {/*components*/}

Track Components trực quan hóa thời lượng của các component React. Chúng được hiển thị dưới dạng flamegraph, trong đó mỗi mục đại diện cho thời lượng render của component tương ứng cùng tất cả các component con hậu duệ của nó.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-render.png" alt="Components track: render durations" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-render.dark.png" alt="Components track: render durations" />
</div>

Tương tự như thời lượng render, thời lượng của effect cũng được biểu diễn dưới dạng flamegraph, nhưng sử dụng bảng màu khác, phù hợp với phase tương ứng trên track Scheduler.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-effects.png" alt="Components track: effects durations" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-effects.dark.png" alt="Components track: effects durations" />
</div>

<Note>

Không giống các lần render, theo mặc định không phải tất cả effect đều được hiển thị trên track Components.

Để duy trì hiệu năng và tránh làm giao diện trở nên rối mắt, React chỉ hiển thị những effect có thời lượng từ 0.05ms trở lên hoặc đã kích hoạt một cập nhật.

</Note>

Các sự kiện bổ sung có thể được hiển thị trong các phase render và effects:

- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Mount</span> - Một cây con tương ứng của các component render hoặc effect đã được mount.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Unmount</span> - Một cây con tương ứng của các component render hoặc effect đã được unmount.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Reconnect</span> - Tương tự Mount, nhưng chỉ giới hạn trong các trường hợp sử dụng [`<Activity>`](/reference/react/Activity).
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Disconnect</span> - Tương tự Unmount, nhưng chỉ giới hạn trong các trường hợp sử dụng [`<Activity>`](/reference/react/Activity).

#### Các props đã thay đổi {/*changed-props*/}

Trong các bản build development, khi bạn nhấp vào một mục render của component, bạn có thể kiểm tra những thay đổi tiềm ẩn trong props. Bạn có thể sử dụng thông tin này để xác định các lần render không cần thiết.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/changed-props.png" alt="Components track: changed props" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/changed-props.dark.png" alt="Components track: changed props" />
</div>

### Server {/*server*/}

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/server-overview.png" alt="React Server Performance Tracks" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/server-overview.dark.png" alt="React Server Performance Tracks" />
</div>

#### Server Requests {/*server-requests*/}

Track Server Requests trực quan hóa tất cả Promise cuối cùng được sử dụng trong một React Server Component. Điều này bao gồm mọi thao tác `async` như gọi `fetch` hoặc các thao tác file Node.js bất đồng bộ.

React sẽ cố gắng kết hợp các Promise được khởi chạy từ bên trong code bên thứ ba thành một span duy nhất, đại diện cho thời lượng của toàn bộ thao tác chặn code bên thứ nhất.
Ví dụ: một method của thư viện bên thứ ba có tên `getUser`, bên trong gọi `fetch` nhiều lần, sẽ được biểu diễn dưới dạng một span duy nhất có tên `getUser`, thay vì hiển thị nhiều span `fetch`.

Khi nhấp vào các span, bạn sẽ thấy stack trace cho biết nơi Promise được tạo, cũng như chế độ xem giá trị mà Promise đã resolve tới, nếu có.

Các Promise bị reject được hiển thị bằng màu đỏ cùng với giá trị bị reject của chúng.

#### Server Components {/*server-components*/}

Track Server Components trực quan hóa thời lượng của các Promise của React Server Components mà chúng đã await. Các mốc thời gian được hiển thị dưới dạng flamegraph, trong đó mỗi mục đại diện cho thời lượng render của component tương ứng cùng tất cả các component con hậu duệ của nó.

Nếu bạn await một Promise, React sẽ hiển thị thời lượng của Promise đó. Để xem tất cả thao tác I/O, hãy sử dụng track Server Requests.

Các màu khác nhau được dùng để biểu thị thời lượng render của component. Màu càng đậm thì thời lượng càng dài.

Nhóm track Server Components luôn chứa một track "Primary". Nếu React có thể render các Server Components đồng thời, nhóm này sẽ hiển thị thêm các track "Parallel".
Nếu có hơn 8 Server Components được render đồng thời, React sẽ gán chúng vào track "Parallel" cuối cùng thay vì thêm các track khác.