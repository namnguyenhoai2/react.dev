---
title: Server Components
---

<Intro>

Server Components là một loại Component mới, được render trước, trước khi bundling, trong một môi trường tách biệt với client app hoặc SSR server của bạn.

</Intro>

Môi trường tách biệt này chính là “server” trong React Server Components. Server Components có thể chạy một lần tại thời điểm build trên CI server của bạn, hoặc có thể chạy cho mỗi request bằng cách sử dụng web server.

<InlineToc />

<Note>

#### Làm thế nào để xây dựng hỗ trợ cho Server Components? {/*how-do-i-build-support-for-server-components*/}

Mặc dù React Server Components trong React 19 đã ổn định và sẽ không có breaking change giữa các minor version, các API nền tảng được sử dụng để triển khai bundler hoặc framework cho React Server Components không tuân theo semver và có thể thay đổi giữa các minor version trong React 19.x.

Để hỗ trợ React Server Components với tư cách là bundler hoặc framework, chúng tôi khuyến nghị pin vào một phiên bản React cụ thể hoặc sử dụng bản phát hành Canary. Chúng tôi sẽ tiếp tục làm việc với các bundler và framework để ổn định các API được sử dụng nhằm triển khai React Server Components trong tương lai.

</Note>

### Server Components không có Server {/*server-components-without-a-server*/}
Server Components có thể chạy tại thời điểm build để đọc từ filesystem hoặc fetch nội dung tĩnh, vì vậy không bắt buộc phải có web server. Ví dụ: bạn có thể muốn đọc dữ liệu tĩnh từ một content management system.

Khi không sử dụng Server Components, cách phổ biến là fetch dữ liệu tĩnh trên client bằng một Effect:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // LƯU Ý: tải *sau* lần render trang đầu tiên.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

Mẫu này có nghĩa là người dùng phải tải xuống và parse thêm 75K (gzipped) thư viện, đồng thời chờ một request thứ hai để fetch dữ liệu sau khi page được load, chỉ để render nội dung tĩnh sẽ không thay đổi trong suốt vòng đời của page.

Với Server Components, bạn có thể render các component này một lần tại thời điểm build:

```js
import marked from 'marked'; // Không được đưa vào bundle
import sanitizeHtml from 'sanitize-html'; // Không được đưa vào bundle

async function Page({page}) {
  // LƯU Ý: tải *trong lúc* render, khi ứng dụng được build.
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

Sau đó, output đã render có thể được server-side render (SSR) thành HTML và upload lên CDN. Khi app được load, client sẽ không thấy component `Page` ban đầu hoặc các thư viện tốn kém để render markdown. Client chỉ thấy output đã render:

```js
<div><!-- html for markdown --></div>
```

Điều này có nghĩa là nội dung hiển thị ngay trong lần load page đầu tiên và bundle không bao gồm các thư viện tốn kém cần thiết để render nội dung tĩnh.

<Note>

Bạn có thể nhận thấy Server Component ở trên là một async function:

```js
async function Page({page}) {
  //...
}
```

Async Components là một tính năng mới của Server Components, cho phép bạn `await` trong quá trình render.

Xem [Async components with Server Components](#async-components-with-server-components) bên dưới.

</Note>

### Server Components với một Server {/*server-components-with-a-server*/}
Server Components cũng có thể chạy trên web server trong khi xử lý request cho một page, cho phép bạn truy cập data layer mà không cần xây dựng API. Chúng được render trước khi application của bạn được bundle và có thể truyền data cùng JSX dưới dạng props cho Client Components.

Khi không sử dụng Server Components, cách phổ biến là fetch dữ liệu động trên client trong một Effect:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // LƯU Ý: tải *sau* lần render đầu tiên.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // LƯU Ý: tải *sau khi* Note render.
  // Dẫn đến waterfall client-server tốn kém.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

Với Server Components, bạn có thể đọc dữ liệu và render nó trong component:

```js
import db from './database';

async function Note({id}) {
  // LƯU Ý: tải *trong lúc* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // LƯU Ý: tải *sau* Note,
  // nhưng nhanh nếu dữ liệu được đặt cùng vị trí.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

Sau đó, bundler kết hợp data, các Server Components đã render và các Client Components động thành một bundle. Tùy chọn, bundle đó có thể được server-side render (SSR) để tạo HTML ban đầu cho page. Khi page được load, browser không thấy các component `Note` và `Author` ban đầu; chỉ output đã render được gửi đến client:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

Server Components có thể trở nên động bằng cách fetch lại chúng từ một server, nơi chúng có thể truy cập dữ liệu và render lại. Kiến trúc application mới này kết hợp mô hình tư duy “request/response” đơn giản của Multi-Page Apps tập trung vào server với khả năng tương tác liền mạch của Single-Page Apps tập trung vào client, mang đến cho bạn ưu điểm của cả hai mô hình.

### Render một context provider trong một Server Component {/*rendering-a-context-provider-in-a-server-component*/}

Server Components không thể tạo context, nhưng có thể render một context provider được import từ một Client Component module.

Tạo và export context từ một file với directive [`'use client'`](/reference/rsc/use-client):

```js
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);
```

Sau đó import và render context trực tiếp từ một Server Component:

```js
// server-component.js
import { UserContext } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserContext value={currentUser}>
      {children}
    </UserContext>
  );
}
```

Các Client Components được render bên trong provider này có thể đọc giá trị của nó bằng [`use`](/reference/react/use) hoặc [`useContext`](/reference/react/useContext).

### Thêm khả năng tương tác vào Server Components {/*adding-interactivity-to-server-components*/}

Server Components không được gửi đến browser, vì vậy chúng không thể sử dụng các API tương tác như `useState`. Để thêm khả năng tương tác vào Server Components, bạn có thể kết hợp chúng với Client Component bằng directive `"use client"`.

<Note>

#### Không có directive dành cho Server Components. {/*there-is-no-directive-for-server-components*/}

Một hiểu lầm phổ biến là Server Components được đánh dấu bằng `"use server"`, nhưng không có directive nào dành cho Server Components. Directive `"use server"` được sử dụng cho Server Functions.

Để biết thêm thông tin, hãy xem tài liệu về [Directives](/reference/rsc/directives).

</Note>


Trong ví dụ sau, Server Component `Notes` import một Client Component `Expandable` sử dụng state để chuyển đổi trạng thái `expanded`:
```js
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

Điều này hoạt động bằng cách trước tiên render `Notes` dưới dạng Server Component, sau đó chỉ dẫn bundler tạo một bundle cho Client Component `Expandable`. Trong browser, các Client Components sẽ thấy output của Server Components được truyền vào dưới dạng props:

```js
<head>
  <!-- bundle dành cho các Client Component -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div>
</body>
```

### Async components với Server Components {/*async-components-with-server-components*/}

Server Components giới thiệu một cách mới để viết Components bằng async/await. Khi bạn `await` trong một async component, React sẽ suspend và chờ promise được resolve trước khi tiếp tục quá trình render. Điều này hoạt động xuyên suốt ranh giới server/client với hỗ trợ streaming cho Suspense.

Bạn thậm chí có thể tạo một promise trên server và await nó trên client:

```js
// Server Component
import db from './database';

async function Page({id}) {
  // Sẽ suspend Server Component.
  const note = await db.notes.get(id);

  // LƯU Ý: không await, sẽ bắt đầu tại đây và await ở client.
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // LƯU Ý: thao tác này sẽ tiếp tục promise từ server.
  // Nó sẽ suspend cho đến khi dữ liệu sẵn sàng.
  const comments = use(commentsPromise);
  return comments.map(comment => <p>{comment}</p>);
}
```

Nội dung `note` là dữ liệu quan trọng để page được render, vì vậy chúng ta `await` nó trên server. Các comment nằm bên dưới phần hiển thị ban đầu và có độ ưu tiên thấp hơn, vì vậy chúng ta bắt đầu promise trên server và chờ nó trên client bằng API `use`. Thao tác này sẽ Suspend trên client mà không chặn nội dung `note` render.

Vì async components không được hỗ trợ trên client, chúng ta await promise bằng `use`.
