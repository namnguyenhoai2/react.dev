---
title: <Suspense>
---

<Intro>

`<Suspense>` cho phép bạn hiển thị nội dung dự phòng cho đến khi các phần tử con tải xong.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Props {/*props*/}
* `children`: UI thực tế mà bạn muốn render. Nếu `children` tạm dừng trong khi render, Suspense boundary sẽ chuyển sang render `fallback`.
* `fallback`: UI thay thế được render thay cho UI thực tế nếu UI đó chưa tải xong. Mọi React node hợp lệ đều được chấp nhận, tuy nhiên trong thực tế, fallback thường là một chế độ xem giữ chỗ nhẹ, chẳng hạn như loading spinner hoặc skeleton. Suspense sẽ tự động chuyển sang `fallback` khi `children` tạm dừng, và quay lại `children` khi dữ liệu đã sẵn sàng. Nếu `fallback` tạm dừng trong khi render, nó sẽ kích hoạt Suspense boundary gần nhất ở cấp cha.
* <ExperimentalBadge /> **tùy chọn** `defer`: Một boolean. Khi `true`, React có thể hiển thị `fallback` trước và render hoặc stream `children` sau, ngay cả khi không có gì bên trong chúng tạm dừng. Hãy dùng tùy chọn này cho nội dung tốn nhiều chi phí render. Mặc định là `false`.

#### Các điểm cần lưu ý {/*caveats*/}

- Suspense không phát hiện khi dữ liệu được fetch bên trong Effect hoặc event handler. Nó chỉ kích hoạt trong [các trường hợp](#what-activates-a-suspense-boundary) được liệt kê bên dưới.
- React không giữ lại state cho các lần render bị tạm dừng trước khi chúng có thể mount lần đầu. Khi component đã tải xong, React sẽ thử render lại suspended tree từ đầu.
- Nếu Suspense đang hiển thị nội dung cho tree nhưng sau đó tree lại tạm dừng, `fallback` sẽ được hiển thị lại, trừ khi update gây ra việc đó được tạo bởi [`startTransition`](/reference/react/startTransition) hoặc [`useDeferredValue`](/reference/react/useDeferredValue).
- React hiển thị nội dung bị tạm dừng nhiều nhất một lần trong mỗi 300ms, tính từ lần hiển thị gần nhất. Các boundary sẵn sàng trong khoảng thời gian đó sẽ được [hiển thị cùng nhau](/blog/2025/10/01/react-19-2#batching-suspense-boundaries-for-ssr) thay vì hiển thị lần lượt.
- Nếu React cần ẩn nội dung đã hiển thị vì nội dung đó lại tạm dừng, nó sẽ dọn dẹp [layout Effects](/reference/react/useLayoutEffect) trong content tree. Khi nội dung sẵn sàng để hiển thị lại, React sẽ chạy các layout Effects lần nữa. Điều này đảm bảo các Effect đo layout của DOM không cố thực hiện việc đó trong khi nội dung bị ẩn.
- React tích hợp các tối ưu hóa bên dưới như *Streaming Server Rendering* và *Selective Hydration* với Suspense. Hãy đọc [phần tổng quan về kiến trúc](https://github.com/reactwg/react-18/discussions/37) và xem [bài nói chuyện kỹ thuật](https://www.youtube.com/watch?v=pj5N-Khihgc) để tìm hiểu thêm.

---

### Điều gì kích hoạt Suspense boundary {/*what-activates-a-suspense-boundary*/}

Suspense boundary chờ nội dung sẵn sàng trước khi hiển thị nội dung đó. Bất kỳ điều nào sau đây cũng khiến boundary chưa hiển thị nội dung:

- Lazy-load code của component bằng [`lazy`](/reference/react/lazy).
- Đọc Promise bằng [`use`](/reference/react/use), bao gồm dữ liệu được stream từ [Server Components](/reference/rsc/server-components) hoặc được tải thông qua [Suspense-enabled framework](#suspense-enabled-frameworks).
- Tải stylesheet được render bằng [`<link rel="stylesheet">` và prop `precedence`. ](/reference/react-dom/components/link#special-rendering-behavior) React sẽ chặn boundary cho đến khi stylesheet tải xong, tối đa trong một khoảng thời gian chờ. [Xem ví dụ bên dưới.](#waiting-for-a-stylesheet-to-load)
- Chờ HTML của một boundary lớn xuất hiện trong quá trình streaming server rendering. Việc gửi HTML cần thời gian, vì vậy một boundary có đủ nội dung sẽ kích hoạt ngay cả khi không có gì bên trong nó tạm dừng. React hiển thị nội dung khi HTML xuất hiện.
- Tải font. Theo mặc định, Suspense không chờ font, nhưng một update [`<ViewTransition>`](/reference/react/ViewTransition) sẽ chờ font mới tải xong, tối đa trong một khoảng thời gian chờ, để văn bản không bị nhấp nháy với font dự phòng. [Xem ví dụ bên dưới.](#waiting-for-a-font-to-load)
- Tải image. Theo mặc định, Suspense không chờ image, nhưng trong một update [`<ViewTransition>`](/reference/react/ViewTransition), React sẽ chặn boundary cho đến khi image tải xong, tối đa trong một khoảng thời gian chờ. Thêm handler `onLoad` sẽ loại một image cụ thể khỏi cơ chế này. [Xem ví dụ bên dưới.](#waiting-for-an-image-to-load)
- <ExperimentalBadge /> Thực hiện công việc render bị giới hạn bởi CPU bên trong một [`<Suspense defer>`](#props) boundary.

<Note>

#### Suspense-enabled frameworks {/*suspense-enabled-frameworks*/}

Một *Suspense-enabled framework* cung cấp cho bạn cách đọc dữ liệu trong component theo cách kích hoạt Suspense boundary gần nhất. Cách chính xác để tải dữ liệu phụ thuộc vào framework của bạn; bạn có thể tìm thông tin chi tiết trong tài liệu của framework đó. Ở bên dưới, một Suspense-enabled framework duy trì cache của các Promise và gọi [`use`](/reference/react/use) để tạm dừng trên một Promise.

Không có framework, bạn có thể đọc Promise trực tiếp bằng `use`, miễn là Promise đó được [cache để cùng một instance được tái sử dụng giữa các lần render.](/reference/react/use#caching-promises-for-client-components)

</Note>

---

## Cách sử dụng {/*usage*/}

### Hiển thị fallback trong khi nội dung đang tải {/*displaying-a-fallback-while-content-is-loading*/}

Bạn có thể bọc bất kỳ phần nào của ứng dụng bằng Suspense boundary:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React sẽ hiển thị <CodeStep step={1}>loading fallback</CodeStep> cho đến khi toàn bộ code và dữ liệu cần thiết cho <CodeStep step={2}>các phần tử con</CodeStep> được tải xong.

Trong ví dụ bên dưới, component `Albums` *tạm dừng* trong khi fetch danh sách album. Cho đến khi component sẵn sàng để render, React chuyển Suspense boundary gần nhất ở phía trên sang hiển thị fallback—component `Loading` của bạn. Sau đó, khi dữ liệu tải xong, React ẩn fallback `Loading` và render component `Albums` cùng dữ liệu.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

</Sandpack>

Ngược lại, code fetch dữ liệu bên ngoài `use`, chẳng hạn như bên trong một Effect, sẽ không kích hoạt boundary:

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import EffectAlbums from './EffectAlbums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <EffectAlbums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/EffectAlbums.js
import { useState, useEffect } from 'react';
import { fetchData } from './data.js';

export default function EffectAlbums({ artistId }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let active = true;
    fetchData(`/${artistId}/albums`).then(result => {
      if (active) {
        setAlbums(result);
      }
    });
    return () => {
      active = false;
    };
  }, [artistId]);

  // Suspense không nhìn thấy lần fetch này nên fallback của nó
  // không bao giờ hiển thị. Danh sách rỗng cho đến khi dữ liệu đến.
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

</Sandpack>

Trong quá trình streaming server rendering, một boundary cũng kích hoạt khi HTML của boundary vẫn đang được stream. Với bất kỳ API streaming server rendering nào, React trước tiên gửi [shell](/reference/react-dom/server/renderToPipeableStream#specifying-what-goes-into-the-shell) cùng với `fallback`, sau đó stream HTML của từng boundary và thay `fallback` bằng nội dung đó khi nội dung xuất hiện. Nhấn "Render the page" để xem trang được stream:

<Sandpack>

```js src/App.js hidden
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Streaming SSR</title>
</head>
<body>
  <button id="render">Render the page</button>
  <br /><br />
  <iframe id="container" style="width: 100%; height: 180px; border: 1px solid #aaa;"></iframe>
</body>
</html>
```

```js src/index.js
import { flushReadableStreamToFrame } from './demo-helpers.js';
import { Suspense, use } from 'react';
import { renderToReadableStream } from 'react-dom/server';

let posts = null;

function Posts() {
  const text = use(posts.promise);
  return <p>{text}</p>;
}

function ProfilePage() {
  return (
    <html>
      <body>
        <h1>Alice</h1>
        <p>Photographer and traveler.</p>
        <Suspense fallback={<p>⌛ Loading posts...</p>}>
          <Posts />
        </Suspense>
      </body>
    </html>
  );
}

async function main(frame) {
  posts = Promise.withResolvers();
  const stream = await renderToReadableStream(<ProfilePage />);

  // Các bài viết được resolve sau khi shell đã stream, nên React
  // stream HTML của chúng vào và thay thế fallback.
  setTimeout(() => {
    posts.resolve(
      'Just got back from two weeks along the coast. The drive ' +
      'was longer than expected, but every stop was worth it. ' +
      'A full write-up and more photos are coming soon.'
    );
  }, 1500);

  await flushReadableStreamToFrame(stream, frame);
}

document.getElementById('render').addEventListener('click', () => {
  main(document.getElementById('container'));
});
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

</Sandpack>

---

### Hiển thị toàn bộ nội dung cùng lúc {/*revealing-content-together-at-once*/}

Theo mặc định, toàn bộ tree bên trong Suspense được xem là một đơn vị duy nhất. Ví dụ, ngay cả khi *chỉ một* trong các component này tạm dừng để chờ dữ liệu, tất cả chúng sẽ cùng bị thay thế bằng loading indicator:

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Sau đó, khi tất cả đã sẵn sàng để hiển thị, chúng sẽ cùng xuất hiện một lúc.

Trong ví dụ bên dưới, cả `Biography` và `Albums` đều fetch một số dữ liệu. Tuy nhiên, vì chúng được nhóm dưới cùng một Suspense boundary, các component này luôn “xuất hiện” cùng lúc.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

Các component tải dữ liệu không nhất thiết phải là phần tử con trực tiếp của Suspense boundary. Ví dụ, bạn có thể chuyển `Biography` và `Albums` vào một component `Details` mới. Điều này không thay đổi hành vi. `Biography` và `Albums` dùng chung Suspense boundary gần nhất ở cấp cha, vì vậy việc hiển thị của chúng được điều phối cùng nhau.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### Hiển thị nội dung lồng nhau khi nội dung tải xong {/*revealing-nested-content-as-it-loads*/}

Khi một component bị suspend, component Suspense cha gần nhất sẽ hiển thị fallback. Điều này cho phép bạn lồng nhiều component Suspense để tạo ra một chuỗi tải. Fallback của mỗi Suspense boundary sẽ được điền vào khi cấp nội dung tiếp theo trở nên khả dụng. Ví dụ: bạn có thể cung cấp fallback riêng cho danh sách album:

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

Với thay đổi này, việc hiển thị `Biography` không cần phải “chờ” `Albums` tải xong.

Trình tự sẽ là:

1. Nếu `Biography` chưa tải xong, `BigSpinner` sẽ được hiển thị thay cho toàn bộ vùng nội dung.
2. Khi `Biography` tải xong, `BigSpinner` sẽ được thay thế bằng nội dung.
3. Nếu `Albums` chưa tải xong, `AlbumsGlimmer` sẽ được hiển thị thay cho `Albums` và `Panel` cha của nó.
4. Cuối cùng, khi `Albums` tải xong, nó sẽ thay thế `AlbumsGlimmer`.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Suspense boundary cho phép bạn điều phối những phần nào trong UI luôn phải “xuất hiện cùng lúc”, cũng như những phần nào sẽ dần dần hiển thị thêm nội dung theo một chuỗi trạng thái tải. Bạn có thể thêm, di chuyển hoặc xóa Suspense boundary ở bất kỳ vị trí nào trong cây mà không ảnh hưởng đến hành vi của phần còn lại trong ứng dụng.

Đừng đặt một Suspense boundary quanh mọi component. Suspense boundary không nên chi tiết hơn chuỗi tải mà bạn muốn người dùng trải nghiệm. Nếu bạn làm việc với designer, hãy hỏi họ nên đặt các trạng thái tải ở đâu--có khả năng họ đã đưa chúng vào wireframe thiết kế.

---

### Hiển thị nội dung cũ trong khi nội dung mới đang tải {/*showing-stale-content-while-fresh-content-is-loading*/}

Trong ví dụ này, component `SearchResults` bị suspend trong khi lấy kết quả tìm kiếm. Nhập `"a"`, chờ kết quả, rồi chỉnh sửa thành `"ab"`. Kết quả cho `"a"` sẽ được thay thế bằng loading fallback.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

Một UI pattern phổ biến khác là *defer* việc cập nhật danh sách và tiếp tục hiển thị kết quả trước đó cho đến khi kết quả mới sẵn sàng. Hook [`useDeferredValue`](/reference/react/useDeferredValue) cho phép bạn truyền một phiên bản trì hoãn của query xuống:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` sẽ cập nhật ngay lập tức, vì vậy input sẽ hiển thị giá trị mới. Tuy nhiên, `deferredQuery` sẽ giữ giá trị trước đó cho đến khi dữ liệu được tải xong, nên `SearchResults` sẽ hiển thị kết quả cũ trong một khoảng thời gian ngắn.

Để người dùng dễ nhận biết hơn, bạn có thể thêm một chỉ báo trực quan khi danh sách kết quả cũ đang được hiển thị:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Nhập `"a"` vào ví dụ bên dưới, chờ kết quả tải xong, rồi chỉnh sửa input thành `"ab"`. Hãy chú ý rằng thay vì Suspense fallback, giờ đây bạn sẽ thấy danh sách kết quả cũ bị làm mờ cho đến khi kết quả mới tải xong:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<Note>

Cả các giá trị được trì hoãn và [Transitions](#preventing-already-revealed-content-from-hiding) đều cho phép bạn tránh hiển thị Suspense fallback bằng cách sử dụng các chỉ báo inline. Transitions đánh dấu toàn bộ bản cập nhật là không khẩn cấp, vì vậy chúng thường được frameworks và router libraries sử dụng cho việc điều hướng. Ngược lại, các giá trị được trì hoãn chủ yếu hữu ích trong application code, khi bạn muốn đánh dấu một phần UI là không khẩn cấp và cho phép phần đó “chậm hơn” phần còn lại của UI.

</Note>

---

### Ngăn nội dung đã hiển thị bị ẩn đi {/*preventing-already-revealed-content-from-hiding*/}

Khi một component bị suspend, Suspense boundary cha gần nhất sẽ chuyển sang hiển thị fallback. Điều này có thể khiến trải nghiệm người dùng bị gián đoạn nếu trước đó boundary đang hiển thị một phần nội dung. Hãy thử nhấn nút này:

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Khi bạn nhấn nút, component `Router` đã render `ArtistPage` thay vì `IndexPage`. Một component bên trong `ArtistPage` bị suspend, nên Suspense boundary gần nhất bắt đầu hiển thị fallback. Suspense boundary gần nhất nằm gần root, vì vậy toàn bộ layout của trang bị thay thế bởi `BigSpinner`.

Để ngăn điều này, bạn có thể đánh dấu bản cập nhật trạng thái điều hướng là một *Transition* bằng [`startTransition`:](/reference/react/startTransition)

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

Điều này cho React biết rằng state transition không khẩn cấp và tốt hơn hết là tiếp tục hiển thị trang trước đó thay vì ẩn nội dung đã hiển thị. Giờ đây, khi nhấn nút, React sẽ “chờ” `Biography` tải xong:

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Một Transition không chờ *toàn bộ* nội dung tải xong. Nó chỉ chờ đủ lâu để tránh ẩn nội dung đã hiển thị. Ví dụ, website `Layout` đã được hiển thị, nên việc ẩn nó sau một loading spinner sẽ không phù hợp. Tuy nhiên, boundary `Suspense` lồng bên trong, bao quanh `Albums`, là boundary mới, nên Transition không chờ boundary này.

<Note>

Các router hỗ trợ Suspense được kỳ vọng sẽ mặc định bọc những bản cập nhật điều hướng trong Transitions.

</Note>

---

### Cho biết một Transition đang diễn ra {/*indicating-that-a-transition-is-happening*/}

Trong ví dụ trên, sau khi bạn nhấn nút, không có chỉ báo trực quan nào cho biết quá trình điều hướng đang diễn ra. Để thêm chỉ báo, bạn có thể thay [`startTransition`](/reference/react/startTransition) bằng [`useTransition`](/reference/react/useTransition), hàm này cung cấp cho bạn một giá trị boolean `isPending`. Trong ví dụ bên dưới, giá trị này được dùng để thay đổi styling của header website trong khi Transition đang diễn ra:

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Reset Suspense boundary khi điều hướng {/*resetting-suspense-boundaries-on-navigation*/}

Trong một Transition, React tránh ẩn nội dung đã hiển thị. Tuy nhiên, khi bạn điều hướng đến *nội dung khác*, chẳng hạn hồ sơ của người dùng khác, bạn sẽ muốn boundary hiển thị fallback thay vì nội dung trước đó. Bạn có thể thể hiện điều này bằng một `key`:

```js
<ProfilePage key={queryParams.id} />
```

Với `key` khác, React xem các hồ sơ là nội dung khác nhau và reset Suspense boundary trong quá trình điều hướng. `key` có thể được đặt trên chính boundary hoặc trên một component nằm phía trên boundary. Các router tích hợp Suspense nên tự động thực hiện việc này.

Trong ví dụ bên dưới, khi mở trang hồ sơ, hồ sơ đầu tiên sẽ được tải. Nhấn “Bob” để điều hướng đến một hồ sơ khác; `key` sẽ reset boundary, vì vậy fallback sẽ được hiển thị thay cho tiểu sử của người dùng trước đó. Hãy thử xóa `key`: tiểu sử trước đó vẫn hiển thị trong khi tiểu sử tiếp theo đang tải:

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ProfilePage from './ProfilePage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return <ProfilePage />;
  }
  return (
    <button onClick={() => setShow(true)}>
      Open profile page
    </button>
  );
}
```

```js src/ProfilePage.js active
import { Suspense, useState, startTransition } from 'react';
import Bio from './Bio.js';
import { fetchBio } from './data.js';

export default function ProfilePage() {
  const [user, setUser] = useState(() => ({
    id: 'alice',
    bioPromise: fetchBio('alice'),
  }));
  function navigate(id) {
    startTransition(() => {
      setUser({ id, bioPromise: fetchBio(id) });
    });
  }
  return (
    <>
      <button onClick={() => navigate('alice')}>
        Alice
      </button>
      <button onClick={() => navigate('bob')}>
        Bob
      </button>
      <Suspense key={user.id} fallback={<p>⌛ Loading profile...</p>}>
        <Bio bioPromise={user.bioPromise} />
      </Suspense>
    </>
  );
}
```

```js src/Bio.js
import { use } from 'react';

export default function Bio({ bioPromise }) {
  const bio = use(bioPromise);
  return <p>{bio}</p>;
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.

export async function fetchBio(userId) {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return userId === 'alice'
    ? 'Alice is a photographer and traveler.'
    : 'Bob collects vintage synthesizers.';
}
```

```css
button {
  margin-right: 8px;
}
```

</Sandpack>

---

### Cung cấp fallback cho lỗi server và nội dung chỉ dành cho client {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

Nếu bạn sử dụng một trong các [streaming server rendering APIs](/reference/react-dom/server) (hoặc một framework dựa trên các API này), React cũng sẽ sử dụng các `<Suspense>` boundary của bạn để xử lý lỗi trên server. Nếu một component gây ra lỗi trên server, React sẽ không hủy quá trình server render. Thay vào đó, nó sẽ tìm component `<Suspense>` gần nhất bên trên component đó và đưa fallback của component này (chẳng hạn spinner) vào server HTML được tạo ra. Ban đầu, người dùng sẽ nhìn thấy spinner.

Trên client, React sẽ cố gắng render lại chính component đó. Nếu component cũng gây ra lỗi trên client, React sẽ throw lỗi và hiển thị [Error Boundary.](/reference/react/Component#static-getderivedstatefromerror) gần nhất. Tuy nhiên, nếu component không gây ra lỗi trên client, React sẽ không hiển thị lỗi cho người dùng vì cuối cùng nội dung đã được hiển thị thành công.

Bạn có thể sử dụng cơ chế này để loại một số component khỏi quá trình render trên server. Để làm vậy, hãy throw một lỗi trong môi trường server, sau đó bọc chúng trong một `<Suspense>` boundary để thay thế HTML của chúng bằng fallback:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat should only render on the client.');
  }
  // ...
}
```

Server HTML sẽ bao gồm loading indicator. Trên client, indicator này sẽ được thay thế bằng component `Chat`.

---

### Cung cấp nội dung dự phòng cho nội dung chỉ dành cho trình duyệt {/*providing-a-fallback-for-browser-only-content*/}

Một Suspense boundary có thể cung cấp nội dung dự phòng cho một component chỉ dành cho trình duyệt. Bọc component trong `<Suspense>` và gọi [`use(browser())`](/reference/react/use#use-browser) bên trong đó.

Nhấp vào **Reload** để xem nội dung dự phòng đang tải trong HTML ban đầu. Sau khi hydration, React hiển thị bản nháp được tải từ `localStorage`.

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('The draft is stored in localStorage.'));
  const [draft, setDraft] = useState(
    () => localStorage.getItem('draft') ?? ''
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem('draft', nextDraft);
  }

  return (
    <label>
      Draft:
      <textarea
        value={draft}
        onChange={handleChange}
        rows={4}
        cols={30}
      />
    </label>
  );
}

export default function App() {
  return (
    <>
      <h1>Saved draft</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Saved draft</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
          label, textarea { display: block; }
          textarea { margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Chờ để cả fallback lẫn nội dung đã hydrate đều hiển thị.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Browser-only rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 160px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Trong quá trình server rendering, React đưa nội dung dự phòng của Suspense boundary vào HTML. Trong trình duyệt, React thay thế nội dung dự phòng bằng bản nháp đã lưu.

---

### Chờ stylesheet tải {/*waiting-for-a-stylesheet-to-load*/}

Một stylesheet được render bằng [`<link rel="stylesheet">` cùng với prop `precedence`](/reference/react-dom/components/link#special-rendering-behavior) sẽ chặn Suspense boundary cho đến khi stylesheet tải xong, tối đa trong một khoảng thời gian chờ, để nội dung không xuất hiện khi chưa được áp dụng style.

Trong ví dụ dưới đây, component `Card` render một stylesheet với `precedence`. Nhấn "Show card": React hiển thị nội dung dự phòng cho đến khi stylesheet tải xong, sau đó hiển thị card với các style đã được áp dụng.

Để so sánh, nút thứ hai thực hiện cùng một update nhưng không dùng React, trong một document riêng biệt. Không có gì chờ stylesheet, vì vậy văn bản của card ban đầu xuất hiện bằng font dự phòng rồi sau đó chuyển đổi:

<Sandpack>

```js
import { Suspense, useState, startTransition } from 'react';
import { freshStylesheetUrl } from './styles.js';
import VanillaCard from './VanillaCard.js';

function Card({ href }) {
  return (
    <>
      <link rel="stylesheet" href={href} precedence="default" />
      <div className="fancy-card">This card uses a font from the stylesheet.</div>
    </>
  );
}

export default function App() {
  const [href, setHref] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setHref(freshStylesheetUrl());
          });
        }}>
        Show card
      </button>
      {href && (
        <Suspense fallback={<p>⌛ Loading styles...</p>}>
          <Card href={href} />
        </Suspense>
      )}
      <hr />
      <VanillaCard />
    </>
  );
}
```

```js src/VanillaCard.js
import { useRef } from 'react';
import { freshStylesheetUrl } from './styles.js';

export default function VanillaCard() {
  const ref = useRef(null);
  function show() {
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; }
        .fancy-card {
          padding: 20px;
          border-radius: 8px;
          color: white;
          font-family: 'Caveat', sans-serif;
          font-size: 24px;
          background: linear-gradient(135deg, #087ea4, #2b3491);
        }
      </style>
      <div class="fancy-card">This card uses a font from the stylesheet.</div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show card (without React)</button>
      <iframe ref={ref} title="Vanilla card" className="vanilla-frame" />
    </>
  );
}
```

```js src/styles.js hidden
// Thêm tham số duy nhất để stylesheet không bị cache,
// và mỗi lần chạy đều hiển thị trạng thái đang tải.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}
```

```css
#root {
  min-height: 300px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
.fancy-card {
  margin-top: 1em;
  padding: 20px;
  border-radius: 8px;
  color: white;
  font-family: 'Caveat', sans-serif;
  font-size: 24px;
  background: linear-gradient(135deg, #087ea4, #2b3491);
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 90px;
}
```

</Sandpack>

---

### Tạo hiệu ứng chuyển động từ nội dung Suspense {/*animating-from-suspense-content*/}

Suspense kết hợp với [`<ViewTransition>`](/reference/react/ViewTransition) để tạo hiệu ứng chuyển đổi từ nội dung dự phòng sang nội dung chính. Bọc boundary trong một `<ViewTransition>`, và React sẽ xử lý quá trình chuyển đổi như một update, mặc định tạo hiệu ứng cross-fade giữa nội dung dự phòng và nội dung chính:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, Suspense} from 'react';
import {Video, VideoPlaceholder} from './Video';
import {useLazyVideoData} from './data';

function LazyVideo() {
  const video = useLazyVideoData();
  return <Video video={video} />;
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from 'react';

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

Vị trí bạn đặt `<ViewTransition>` so với boundary sẽ quyết định nội dung dự phòng và nội dung chính được cross-fade như một update hay được tạo hiệu ứng riêng biệt khi thoát và khi xuất hiện. Bạn cũng có thể [tùy chỉnh hiệu ứng chuyển động](/reference/react/ViewTransition#customizing-animations) bằng các class của View Transition.

[Tìm hiểu thêm về việc tạo hiệu ứng chuyển động từ nội dung Suspense.](/reference/react/ViewTransition#animating-from-suspense-content)

</Note>

---

### Chờ font tải {/*waiting-for-a-font-to-load*/}

Khi một [`<ViewTransition>`](/reference/react/ViewTransition) tạo hiệu ứng cho việc hiển thị Suspense boundary, React sẽ chờ các font mới mà nội dung giới thiệu tải xong, tối đa trong một khoảng thời gian chờ, để văn bản không nhấp nháy với font dự phòng. Điều này chỉ xảy ra trong một update `<ViewTransition>`.

Trong ví dụ dưới đây, Suspense boundary được bọc trong một `<ViewTransition>`, và component `Quote` chuyển sang trạng thái suspend trong khi dữ liệu tải. Việc render câu trích dẫn bắt đầu quá trình tải font. React giữ nội dung dự phòng hiển thị cho đến khi font tải xong, vì vậy câu trích dẫn xuất hiện ngay với font của nó.

Để so sánh, nút thứ hai thực hiện cùng một update nhưng không dùng React. Không có gì chờ font, vì vậy văn bản ban đầu xuất hiện bằng font dự phòng rồi sau đó chuyển đổi:

<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshFontUrl } from './font.js';
import VanillaQuote from './VanillaQuote.js';

function Quote({ fontSrc }) {
  const quote = use(fetchQuote());
  return (
    <>
      <style href={fontSrc} precedence="default">
        {`@font-face {
          font-family: 'Fancy';
          src: url(${fontSrc}) format('truetype');
          font-display: swap;
        }`}
      </style>
      <p className="quote fancy">{quote}</p>
    </>
  );
}

export default function App() {
  const [fontSrc, setFontSrc] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setFontSrc(freshFontUrl());
          });
        }}>
        Show quote
      </button>
      {fontSrc && (
        <ViewTransition>
          <Suspense fallback={<p className="quote">⌛ Loading quote...</p>}>
            <Quote fontSrc={fontSrc} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaQuote />
    </>
  );
}
```

```js src/VanillaQuote.js
import { useRef } from 'react';
import { freshFontUrl } from './font.js';

export default function VanillaQuote() {
  const ref = useRef(null);
  function show() {
    const style = document.createElement('style');
    style.textContent = `@font-face {
      font-family: 'VanillaFancy';
      src: url(${freshFontUrl()}) format('truetype');
      font-display: swap;
    }`;
    document.head.appendChild(style);
    ref.current.innerHTML = `<p class="quote vanilla-fancy">The best way to predict the future is to invent it.</p>`;
  }
  return (
    <>
      <button onClick={show}>Show quote (without React)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/font.js hidden
// Thêm tham số duy nhất để font không bị cache,
// và mỗi lần chạy đều hiển thị trạng thái đang tải.
export function freshFontUrl() {
  return (
    'https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/Caveat%5Bwght%5D.ttf' +
    '?t=' +
    Date.now()
  );
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.
// Thông thường, logic cache nằm bên trong framework.

let cache = null;

export function fetchQuote() {
  if (!cache) {
    cache = new Promise((resolve) => {
      // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
      setTimeout(() => {
        resolve(
          'The best way to predict the future is to invent it.'
        );
      }, 500);
    });
  }
  return cache;
}
```

```css
#root {
  min-height: 260px;
}
.quote {
  font-size: 20px;
  margin-top: 1em;
}
.fancy {
  font-family: 'Fancy', sans-serif;
}
.vanilla-fancy {
  font-family: 'VanillaFancy', sans-serif;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Chờ hình ảnh tải {/*waiting-for-an-image-to-load*/}

Khi một [`<ViewTransition>`](/reference/react/ViewTransition) tạo hiệu ứng cho việc hiển thị Suspense boundary, React sẽ chờ các hình ảnh hiển thị tải xong, tối đa trong một khoảng thời gian chờ, để hiệu ứng không bắt đầu khi hình ảnh mới chỉ tải một phần. Điều này chỉ xảy ra trong một update `<ViewTransition>`. Việc thêm một handler `onLoad` sẽ loại trừ một hình ảnh cụ thể, ngay cả khi hình ảnh đó nằm trong một `<ViewTransition>`.

Trong ví dụ dưới đây, Suspense boundary được bọc trong một `<ViewTransition>` và hiển thị skeleton hồ sơ cho đến khi ảnh chân dung tải xong.

Để so sánh, nút thứ hai thực hiện cùng một update nhưng không dùng React. Không có gì chờ hình ảnh, vì vậy card xuất hiện ngay lập tức và hình ảnh xuất hiện sau khi tải xong:

<Sandpack>

```js
import { ViewTransition, Suspense, useState, startTransition } from 'react';
import { freshImageUrl } from './image.js';
import VanillaProfile from './VanillaProfile.js';

function Profile({ src }) {
  return (
    <div className="card">
      <img src={src} alt="Jack Pope" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [src, setSrc] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setSrc(freshImageUrl());
          });
        }}>
        Show profile
      </button>
      {src && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile src={src} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfile />
    </>
  );
}
```

```js src/VanillaProfile.js
import { useRef } from 'react';
import { freshImageUrl } from './image.js';

export default function VanillaProfile() {
  const ref = useRef(null);
  function show() {
    ref.current.innerHTML = `<div class="card">
      <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
      <p>Jack Pope</p>
    </div>`;
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/image.js hidden
// Thêm tham số duy nhất để hình ảnh không bị cache,
// và mỗi lần chạy đều hiển thị trạng thái đang tải.
export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Phối hợp font, hình ảnh và stylesheet {/*coordinating-fonts-images-and-stylesheets*/}

Một Suspense boundary có thể chờ dữ liệu, stylesheet, font và hình ảnh cùng lúc. Việc chờ font và hình ảnh chỉ xảy ra trong một update [`<ViewTransition>`](/reference/react/ViewTransition). Trong ví dụ dưới đây, component `ProfileCard` chuyển sang trạng thái suspend trong khi dữ liệu tải, đồng thời render một stylesheet với `precedence`, văn bản bằng một font mới và một ảnh chân dung. React giữ skeleton hiển thị trong khi dữ liệu và stylesheet tải. Sau đó, quá trình reveal của `<ViewTransition>` sẽ chờ font và hình ảnh, để card xuất hiện hoàn chỉnh.

Để so sánh, phiên bản không dùng React tải cùng dữ liệu và hiển thị từng tài nguyên theo lịch tải riêng:

<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';
import VanillaProfileCard from './VanillaProfileCard.js';

function ProfileCard({ resources }) {
  const quote = use(resources.quotePromise);
  return (
    <>
      <link rel="stylesheet" href={resources.stylesheet} precedence="default" />
      <div className="profile-card">
        <img src={resources.image} alt="Jack Pope" width={80} height={80} />
        <div>
          <p className="name">Jack Pope</p>
          <p className="bio">{quote}</p>
        </div>
      </div>
    </>
  );
}

function ProfileCardPlaceholder() {
  return (
    <div className="profile-card">
      <div className="avatar-placeholder" />
      <div>
        <p className="name name-placeholder">&nbsp;</p>
        <p className="bio bio-placeholder">&nbsp;</p>
      </div>
    </div>
  );
}

export default function App() {
  const [resources, setResources] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setResources({
              quotePromise: fetchQuote(),
              stylesheet: freshStylesheetUrl(),
              image: freshImageUrl(),
            });
          });
        }}>
        Show profile
      </button>
      {resources && (
        <ViewTransition>
          <Suspense fallback={<ProfileCardPlaceholder />}>
            <ProfileCard resources={resources} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfileCard />
    </>
  );
}
```

```js src/VanillaProfileCard.js
import { useRef } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';

export default function VanillaProfileCard() {
  const ref = useRef(null);
  async function show() {
    const quote = await fetchQuote();
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; font-family: sans-serif; }
        .profile-card { display: flex; gap: 12px; align-items: center; }
        .profile-card img { border-radius: 50%; background: #dfe3e9; }
        .name { margin: 0 0 4px; font-family: 'Caveat', sans-serif; font-size: 22px; line-height: 28px; font-weight: bold; }
        .bio { margin: 0; font-family: 'Caveat', sans-serif; font-size: 20px; line-height: 26px; }
      </style>
      <div class="profile-card">
        <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
        <div>
          <p class="name">Jack Pope</p>
          <p class="bio">${quote}</p>
        </div>
      </div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <iframe ref={ref} title="Vanilla profile card" className="vanilla-frame" />
    </>
  );
}
```

```js src/resources.js hidden
// Thêm tham số duy nhất để tài nguyên không bị cache,
// và mỗi lần chạy đều hiển thị trạng thái đang tải.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```js src/data.js hidden
// Lưu ý: cách bạn lấy dữ liệu phụ thuộc vào
// framework được dùng cùng Suspense.

export async function fetchQuote() {
  // Thêm độ trễ giả để việc chờ đợi trở nên dễ nhận biết.
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return 'The best way to predict the future is to invent it.';
}
```

```css
#root {
  min-height: 320px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
.profile-card {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 1em;
}
.profile-card img {
  border-radius: 50%;
  background: #dfe3e9;
}
.name {
  margin: 0 0 4px;
  font-family: 'Caveat', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
}
.bio {
  margin: 0;
  font-family: 'Caveat', sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.profile-card img {
  display: block;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder,
.bio-placeholder {
  border-radius: 4px;
  background: #dfe3e9;
  color: transparent;
}
.name-placeholder {
  width: 90px;
}
.bio-placeholder {
  width: 220px;
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 110px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

## Xử lý sự cố {/*troubleshooting*/}

### Làm thế nào để ngăn UI bị thay thế bằng nội dung dự phòng trong quá trình update? {/*preventing-unwanted-fallbacks*/}

Việc thay thế UI đang hiển thị bằng nội dung dự phòng tạo ra trải nghiệm người dùng khó chịu. Điều này có thể xảy ra khi một update khiến component chuyển sang trạng thái suspend, trong khi Suspense boundary gần nhất đã hiển thị nội dung cho người dùng.

Để ngăn điều này xảy ra, [đánh dấu update là không khẩn cấp bằng `startTransition`](#preventing-already-revealed-content-from-hiding). Trong một Transition, React sẽ chờ cho đến khi đủ dữ liệu được tải để ngăn nội dung dự phòng không mong muốn xuất hiện:

```js {2-3,5}
function handleNextPageClick() {
  // Nếu cập nhật này suspend, đừng ẩn nội dung đã hiển thị
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Cách này sẽ tránh ẩn nội dung hiện có. Tuy nhiên, mọi `Suspense` boundary mới được render vẫn sẽ ngay lập tức hiển thị nội dung dự phòng để tránh chặn UI và cho phép người dùng xem nội dung khi nội dung đó sẵn sàng.

**React chỉ ngăn nội dung dự phòng không mong muốn trong các update không khẩn cấp**. React sẽ không trì hoãn quá trình render nếu quá trình đó là kết quả của một update khẩn cấp. Bạn phải chủ động sử dụng một API như [`startTransition`](/reference/react/startTransition) hoặc [`useDeferredValue`](/reference/react/useDeferredValue).

Nếu router của bạn được tích hợp với Suspense, router sẽ tự động bọc các update của mình trong [`startTransition`](/reference/react/startTransition).
