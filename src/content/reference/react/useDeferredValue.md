---
title: useDeferredValue
---

<Intro>

`useDeferredValue` là một React Hook cho phép bạn trì hoãn việc cập nhật một phần UI.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

Gọi `useDeferredValue` ở cấp cao nhất của component để nhận phiên bản trì hoãn của giá trị đó.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

* `value`: Giá trị mà bạn muốn trì hoãn. Giá trị này có thể thuộc bất kỳ kiểu nào.
* **tùy chọn** `initialValue`: Giá trị được sử dụng trong lần render ban đầu của component. Nếu bỏ qua tùy chọn này, `useDeferredValue` sẽ không trì hoãn trong lần render ban đầu, vì không có phiên bản trước đó của `value` để render thay thế.


#### Giá trị trả về {/*returns*/}

- `currentValue`: Trong lần render ban đầu, giá trị trì hoãn được trả về sẽ là `initialValue`, hoặc giống với giá trị bạn đã cung cấp. Trong các lần cập nhật, trước tiên React sẽ thử render lại với giá trị cũ (do đó sẽ trả về giá trị cũ), sau đó thử render lại trong background với giá trị mới (do đó sẽ trả về giá trị đã cập nhật).

#### Lưu ý {/*caveats*/}

- Khi một bản cập nhật nằm bên trong một Transition, `useDeferredValue` luôn trả về `value` mới và không tạo một lần render trì hoãn, vì bản cập nhật đó vốn đã được trì hoãn.

- Các giá trị bạn truyền vào `useDeferredValue` nên là các giá trị nguyên thủy (chẳng hạn như chuỗi và số) hoặc các object được tạo bên ngoài quá trình rendering. Nếu bạn tạo một object mới trong quá trình rendering rồi truyền ngay object đó vào `useDeferredValue`, object này sẽ khác nhau trong mỗi lần render, gây ra các lần render lại trong background không cần thiết.

- Khi `useDeferredValue` nhận được một giá trị khác (so với [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), ngoài lần render hiện tại (khi vẫn sử dụng giá trị trước đó), nó sẽ lên lịch render lại trong background với giá trị mới. Lần render lại trong background này có thể bị gián đoạn: nếu có một bản cập nhật khác cho `value`, React sẽ khởi động lại lần render lại trong background từ đầu. Ví dụ, nếu người dùng nhập vào một input nhanh hơn tốc độ chart nhận giá trị trì hoãn có thể render lại, chart sẽ chỉ render lại sau khi người dùng ngừng nhập.

- `useDeferredValue` được tích hợp với [`<Suspense>`.](/reference/react/Suspense) Nếu bản cập nhật trong background do một giá trị mới gây ra làm UI suspend, người dùng sẽ không thấy fallback. Họ sẽ thấy giá trị trì hoãn cũ cho đến khi dữ liệu được tải xong.

- `useDeferredValue` tự nó không ngăn các request mạng bổ sung.

- Bản thân `useDeferredValue` không gây ra một khoảng trễ cố định nào. Ngay khi React hoàn tất lần render lại ban đầu, React sẽ lập tức bắt đầu xử lý lần render lại trong background với giá trị trì hoãn mới. Mọi bản cập nhật do các sự kiện gây ra (chẳng hạn như thao tác nhập) sẽ ngắt lần render lại trong background và được ưu tiên hơn.

- Lần render lại trong background do `useDeferredValue` gây ra sẽ không chạy các Effect cho đến khi được commit lên màn hình. Nếu lần render lại trong background bị suspend, các Effect của nó sẽ chạy sau khi dữ liệu được tải xong và UI được cập nhật.

---

## Cách sử dụng {/*usage*/}

### Hiển thị nội dung cũ trong khi nội dung mới đang tải {/*showing-stale-content-while-fresh-content-is-loading*/}

Gọi `useDeferredValue` ở cấp cao nhất của component để trì hoãn việc cập nhật một phần UI.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

Trong lần render ban đầu, <CodeStep step={2}>giá trị trì hoãn</CodeStep> sẽ giống với <CodeStep step={1}>giá trị</CodeStep> mà bạn đã cung cấp.

Trong các lần cập nhật, <CodeStep step={2}>giá trị trì hoãn</CodeStep> sẽ “chậm hơn” <CodeStep step={1}>giá trị</CodeStep> mới nhất. Cụ thể, trước tiên React sẽ render lại *mà không* cập nhật giá trị trì hoãn, sau đó thử render lại trong background với giá trị mới nhận được.

**Hãy cùng xem qua một ví dụ để hiểu khi nào cách này hữu ích.**

<Note>

Ví dụ này giả định bạn sử dụng một data source [kích hoạt một Suspense boundary](/reference/react/Suspense#what-activates-a-suspense-boundary), chẳng hạn như một Promise được đọc bằng [`use`](/reference/react/use).

[Tìm hiểu thêm về Suspense.](/reference/react/Suspense)

</Note>


Trong ví dụ này, component `SearchResults` [suspend](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) trong khi đang tìm nạp kết quả tìm kiếm. Hãy thử nhập `"a"`, chờ kết quả, sau đó chỉnh sửa thành `"ab"`. Kết quả cho `"a"` sẽ được thay thế bằng loading fallback.

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
    setTimeout(resolve, 1000);
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

Một mẫu UI thay thế phổ biến là *trì hoãn* việc cập nhật danh sách kết quả và tiếp tục hiển thị kết quả trước đó cho đến khi kết quả mới sẵn sàng. Gọi `useDeferredValue` để truyền một phiên bản trì hoãn của query xuống:

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

`query` sẽ được cập nhật ngay lập tức, vì vậy input sẽ hiển thị giá trị mới. Tuy nhiên, `deferredQuery` sẽ giữ giá trị trước đó cho đến khi dữ liệu được tải xong, nên `SearchResults` sẽ hiển thị các kết quả cũ trong một khoảng thời gian ngắn.

Nhập `"a"` vào ví dụ bên dưới, chờ kết quả tải xong, sau đó chỉnh sửa input thành `"ab"`. Lưu ý rằng thay vì Suspense fallback, giờ đây bạn sẽ thấy danh sách kết quả cũ cho đến khi kết quả mới được tải xong:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

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
    setTimeout(resolve, 1000);
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

<DeepDive>

#### Cơ chế trì hoãn một giá trị hoạt động như thế nào ở bên trong? {/*how-does-deferring-a-value-work-under-the-hood*/}

Bạn có thể hình dung quá trình này gồm hai bước:

1. **Trước tiên, React render lại với `query` mới (`"ab"`) nhưng vẫn giữ `deferredQuery` cũ (vẫn là `"a"`).** Giá trị `deferredQuery` mà bạn truyền vào danh sách kết quả được *trì hoãn:* nó “chậm hơn” `query`.

2. **Trong background, React thử render lại với cả `query` và `deferredQuery` được cập nhật thành `"ab"`.** Nếu lần render lại này hoàn tất, React sẽ hiển thị nó trên màn hình. Tuy nhiên, nếu nó bị suspend (kết quả cho `"ab"` vẫn chưa tải xong), React sẽ hủy lần render này và thử lại sau khi dữ liệu được tải xong. Người dùng sẽ tiếp tục thấy giá trị trì hoãn cũ cho đến khi dữ liệu sẵn sàng.

Quá trình rendering “background” bị trì hoãn có thể bị gián đoạn. Ví dụ, nếu bạn tiếp tục nhập vào input, React sẽ hủy quá trình đó và khởi động lại với giá trị mới. React luôn sử dụng giá trị mới nhất được cung cấp.

Lưu ý rằng vẫn có một request mạng cho mỗi lần nhấn phím. Thứ được trì hoãn ở đây là việc hiển thị kết quả (cho đến khi kết quả sẵn sàng), chứ không phải bản thân các request mạng. Ngay cả khi người dùng tiếp tục nhập, phản hồi cho mỗi lần nhấn phím vẫn được cache, vì vậy việc nhấn Backspace sẽ diễn ra tức thì và không fetch lại.

</DeepDive>

---

### Cho biết nội dung đã cũ {/*indicating-that-the-content-is-stale*/}

Trong ví dụ trên, không có dấu hiệu nào cho biết danh sách kết quả của query mới nhất vẫn đang tải. Điều này có thể khiến người dùng bối rối nếu kết quả mới mất nhiều thời gian để tải. Để giúp người dùng dễ nhận biết hơn rằng danh sách kết quả không khớp với query mới nhất, bạn có thể thêm một dấu hiệu trực quan khi danh sách kết quả cũ đang được hiển thị:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Với thay đổi này, ngay khi bắt đầu nhập, danh sách kết quả cũ sẽ hơi mờ đi cho đến khi danh sách kết quả mới được tải xong. Bạn cũng có thể thêm một CSS transition để trì hoãn việc làm mờ, tạo cảm giác chuyển đổi dần dần, như trong ví dụ dưới đây:

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
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
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
    setTimeout(resolve, 1000);
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

---

### Trì hoãn việc render lại một phần UI {/*deferring-re-rendering-for-a-part-of-the-ui*/}

Bạn cũng có thể áp dụng `useDeferredValue` như một tối ưu hóa hiệu năng. Cách này hữu ích khi một phần UI của bạn render lại chậm, không có cách đơn giản để tối ưu và bạn muốn ngăn phần đó chặn các phần còn lại của UI.

Hãy hình dung bạn có một trường văn bản và một component (chẳng hạn như chart hoặc danh sách dài) render lại sau mỗi lần nhấn phím:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

Trước tiên, hãy tối ưu `SlowList` để bỏ qua việc render lại khi props của nó không thay đổi. Để làm điều này, [bọc nó trong `memo`:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

Tuy nhiên, cách này chỉ hữu ích nếu các props của `SlowList` *giống nhau* như trong lần render trước. Vấn đề bạn đang gặp lúc này là nó chậm khi các props *khác nhau*, trong khi đây lại là lúc bạn thực sự cần hiển thị output trực quan khác.

Cụ thể, vấn đề hiệu năng chính là mỗi khi bạn nhập vào input, `SlowList` nhận props mới và việc render lại toàn bộ tree của nó khiến thao tác nhập trở nên giật. Trong trường hợp này, `useDeferredValue` cho phép bạn ưu tiên cập nhật input (phải nhanh) hơn cập nhật danh sách kết quả (có thể chậm hơn):```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

Điều này không làm cho việc render lại `SlowList` nhanh hơn. Tuy nhiên, nó cho React biết rằng có thể hạ mức ưu tiên của việc render lại danh sách để thao tác đó không chặn các lần gõ phím. Danh sách sẽ “chậm hơn” input rồi “bắt kịp”. Như trước đây, React sẽ cố gắng cập nhật danh sách sớm nhất có thể, nhưng sẽ không chặn người dùng nhập liệu.

<Recipes titleText="The difference between useDeferredValue and unoptimized re-rendering" titleId="examples">

#### Render lại danh sách bị trì hoãn {/*deferred-re-rendering-of-the-list*/}

Trong ví dụ này, mỗi mục trong component `SlowList` được **làm chậm một cách nhân tạo** để bạn có thể thấy `useDeferredValue` giúp duy trì khả năng phản hồi của input như thế nào. Hãy nhập vào input và chú ý rằng thao tác gõ vẫn nhanh nhạy trong khi danh sách “chậm hơn” input.

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Chỉ log một lần. Sự chậm trễ thực tế nằm trong SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Không làm gì trong 1 ms cho mỗi phần tử để mô phỏng code cực chậm
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
  max-height: 300px;
  overflow: auto;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### Render lại danh sách chưa được tối ưu {/*unoptimized-re-rendering-of-the-list*/}

Trong ví dụ này, mỗi mục trong component `SlowList` được **làm chậm một cách nhân tạo**, nhưng không có `useDeferredValue`.

Hãy chú ý rằng việc nhập vào input có cảm giác rất giật. Đó là vì khi không có `useDeferredValue`, mỗi lần gõ phím đều buộc toàn bộ danh sách phải render lại ngay lập tức theo cách không thể bị ngắt.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Chỉ log một lần. Sự chậm trễ thực tế nằm trong SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Không làm gì trong 1 ms cho mỗi phần tử để mô phỏng code cực chậm
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
  max-height: 300px;
  overflow: auto;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

Tối ưu hóa này yêu cầu `SlowList` được bọc trong [`memo`.](/reference/react/memo) Điều này là vì mỗi khi `text` thay đổi, React cần có khả năng nhanh chóng render lại component cha. Trong lần render lại đó, `deferredText` vẫn giữ giá trị trước đó, nên `SlowList` có thể bỏ qua việc render lại (props của nó chưa thay đổi). Nếu không có [`memo`,](/reference/react/memo) nó vẫn sẽ phải render lại, làm mất đi ý nghĩa của việc tối ưu hóa.

</Pitfall>

<DeepDive>

#### Việc trì hoãn một giá trị khác gì so với debouncing và throttling? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

Có hai kỹ thuật tối ưu hóa phổ biến mà bạn có thể đã từng sử dụng trong tình huống này:

- *Debouncing* nghĩa là bạn sẽ đợi người dùng ngừng gõ (ví dụ: trong một giây) rồi mới cập nhật danh sách.
- *Throttling* nghĩa là bạn sẽ cập nhật danh sách theo định kỳ (ví dụ: tối đa một lần mỗi giây).

Mặc dù các kỹ thuật này hữu ích trong một số trường hợp, `useDeferredValue` phù hợp hơn để tối ưu hóa việc render vì nó được tích hợp sâu với chính React và thích ứng với thiết bị của người dùng.

Không giống debouncing hoặc throttling, kỹ thuật này không yêu cầu chọn một khoảng trễ cố định. Nếu thiết bị của người dùng nhanh (ví dụ: laptop mạnh), lần render lại bị trì hoãn sẽ diễn ra gần như ngay lập tức và không đáng chú ý. Nếu thiết bị của người dùng chậm, danh sách sẽ “chậm hơn” input tương ứng với mức độ chậm của thiết bị.

Ngoài ra, không giống debouncing hoặc throttling, các lần render lại bị trì hoãn do `useDeferredValue` thực hiện mặc định có thể bị ngắt. Điều này có nghĩa là nếu React đang render lại một danh sách lớn nhưng người dùng gõ thêm một phím, React sẽ từ bỏ lần render lại đó, xử lý thao tác gõ phím, rồi bắt đầu render lại trong background. Ngược lại, debouncing và throttling vẫn tạo ra trải nghiệm giật vì chúng *blocking:* chúng chỉ trì hoãn thời điểm việc render chặn thao tác gõ phím.

Nếu công việc bạn đang tối ưu hóa không diễn ra trong quá trình render, debouncing và throttling vẫn hữu ích. Ví dụ, chúng có thể giúp bạn gửi ít network request hơn. Bạn cũng có thể kết hợp sử dụng các kỹ thuật này.

</DeepDive>
