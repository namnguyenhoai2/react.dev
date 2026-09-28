---
title: Cập nhật Array trong State
---

<Intro>

Array có thể thay đổi (mutable) trong JavaScript, nhưng bạn nên xem chúng là bất biến (immutable) khi lưu trong state. Cũng giống như với object, khi muốn cập nhật một array được lưu trong state, bạn cần tạo một array mới (hoặc tạo bản sao của array hiện có), sau đó đặt state sử dụng array mới.

</Intro>

<YouWillLearn>

- Cách thêm, xóa hoặc thay đổi các phần tử trong array trong React state
- Cách cập nhật một object bên trong array
- Cách giảm sự lặp lại khi sao chép array bằng Immer

</YouWillLearn>

## Cập nhật array mà không mutation {/*updating-arrays-without-mutation*/}

Trong JavaScript, array chỉ là một loại object khác. [Cũng như với object](/learn/updating-objects-in-state), **bạn nên xem array trong React state là chỉ-đọc.** Điều này có nghĩa là bạn không nên gán lại các phần tử bên trong array như `arr[0] = 'bird'`, đồng thời cũng không nên sử dụng các method làm thay đổi array, chẳng hạn như `push()` và `pop()`.

Thay vào đó, mỗi khi muốn cập nhật một array, bạn nên truyền một array *mới* vào hàm thiết lập state. Để làm vậy, bạn có thể tạo một array mới từ array gốc trong state bằng cách gọi các method không làm thay đổi array như `filter()` và `map()`. Sau đó, bạn có thể đặt state thành array mới thu được.

Dưới đây là bảng tham khảo các thao tác array phổ biến. Khi làm việc với các array bên trong React state, bạn cần tránh các method ở cột bên trái và thay vào đó ưu tiên các method ở cột bên phải:

|           | avoid (mutates the array)           | prefer (returns a new array)                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| adding    | `push`, `unshift`                   | `concat`, `[...arr]` spread syntax ([example](#adding-to-an-array)) |
| removing  | `pop`, `shift`, `splice`            | `filter`, `slice` ([example](#removing-from-an-array))              |
| replacing | `splice`, `arr[i] = ...` assignment | `map` ([example](#replacing-items-in-an-array))                     |
| sorting   | `reverse`, `sort`                   | copy the array first ([example](#making-other-changes-to-an-array)) |

Ngoài ra, bạn có thể [sử dụng Immer](#write-concise-update-logic-with-immer), cho phép bạn sử dụng các method từ cả hai cột.

<Pitfall>

Thật không may, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) và [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) có tên tương tự nhau nhưng rất khác biệt:

* `slice` cho phép bạn sao chép một array hoặc một phần của array.
* `splice` **làm thay đổi** array (để chèn hoặc xóa các phần tử).

Trong React, bạn sẽ sử dụng `slice` (không có `p`!) thường xuyên hơn nhiều, vì bạn không muốn làm thay đổi object hoặc array trong state. [Cập nhật Object](/learn/updating-objects-in-state) giải thích mutation là gì và tại sao không nên sử dụng nó cho state.

</Pitfall>

### Thêm vào array {/*adding-to-an-array*/}

`push()` sẽ làm thay đổi array, điều bạn không muốn:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Thay vào đó, hãy tạo một array *mới* chứa các phần tử hiện có *và* một phần tử mới ở cuối. Có nhiều cách để làm việc này, nhưng cách dễ nhất là sử dụng cú pháp `...` [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Replace the state
  [ // with a new array
    ...artists, // that contains all the old items
    { id: nextId++, name: name } // and one new item at the end
  ]
);
```

Bây giờ code hoạt động chính xác:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Cú pháp array spread cũng cho phép bạn thêm một phần tử vào đầu bằng cách đặt phần tử đó *trước* `...artists` ban đầu:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Put old items at the end
]);
```

Theo cách này, spread có thể thực hiện công việc của cả `push()` bằng cách thêm vào cuối array và `unshift()` bằng cách thêm vào đầu array. Hãy thử trong sandbox ở trên!

### Xóa khỏi array {/*removing-from-an-array*/}

Cách dễ nhất để xóa một phần tử khỏi array là *lọc phần tử đó ra*. Nói cách khác, bạn sẽ tạo một array mới không chứa phần tử đó. Để làm vậy, hãy sử dụng method `filter`, ví dụ:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Hãy nhấp vào nút "Delete" vài lần và xem click handler của nó.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Ở đây, `artists.filter(a => a.id !== artist.id)` có nghĩa là “tạo một array gồm những `artists` có ID khác với `artist.id`”. Nói cách khác, nút "Delete" của mỗi artist sẽ lọc _artist đó_ khỏi array, sau đó yêu cầu render lại với array thu được. Lưu ý rằng `filter` không sửa đổi array gốc.

### Biến đổi array {/*transforming-an-array*/}

Nếu muốn thay đổi một số hoặc tất cả các phần tử trong array, bạn có thể sử dụng `map()` để tạo một array **mới**. Hàm bạn truyền vào `map` có thể quyết định cần làm gì với từng phần tử, dựa trên dữ liệu hoặc index của phần tử đó (hoặc cả hai).

Trong ví dụ này, một array chứa tọa độ của hai hình tròn và một hình vuông. Khi nhấn nút, chỉ các hình tròn được di chuyển xuống 50 pixel. Việc này được thực hiện bằng cách tạo một array dữ liệu mới sử dụng `map()`:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // No change
        return shape;
      } else {
        // Return a new circle 50px below
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render with the new array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Thay thế các phần tử trong array {/*replacing-items-in-an-array*/}

Một nhu cầu đặc biệt phổ biến là thay thế một hoặc nhiều phần tử trong array. Các phép gán như `arr[0] = 'bird'` sẽ làm thay đổi array gốc, vì vậy thay vào đó bạn cũng nên sử dụng `map` cho việc này.

Để thay thế một phần tử, hãy tạo một array mới với `map`. Bên trong lời gọi `map`, bạn sẽ nhận được index của phần tử dưới dạng đối số thứ hai. Hãy sử dụng nó để quyết định trả về phần tử gốc (đối số thứ nhất) hay một giá trị khác:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Chèn vào array {/*inserting-into-an-array*/}

Đôi khi, bạn có thể muốn chèn một phần tử vào một vị trí cụ thể không nằm ở đầu cũng không nằm ở cuối. Để làm vậy, bạn có thể sử dụng cú pháp `...` array spread cùng với method `slice()`. Method `slice()` cho phép bạn cắt một "slice" của array. Để chèn một phần tử, bạn sẽ tạo một array trong đó spread phần slice _trước_ vị trí chèn, sau đó là phần tử mới, rồi đến phần còn lại của array gốc.

Trong ví dụ này, nút Insert luôn chèn tại index `1`:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Could be any index
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Thực hiện các thay đổi khác với array {/*making-other-changes-to-an-array*/}

Có một số việc bạn không thể thực hiện chỉ bằng cú pháp spread và các method không làm thay đổi array như `map()` và `filter()`. Ví dụ, bạn có thể muốn đảo ngược hoặc sắp xếp một array. Các method JavaScript `reverse()` và `sort()` làm thay đổi array gốc, vì vậy bạn không thể sử dụng chúng trực tiếp.

**Tuy nhiên, bạn có thể sao chép array trước, rồi thực hiện các thay đổi trên bản sao.**

Ví dụ:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Ở đây, bạn sử dụng cú pháp `[...list]` spread để tạo bản sao của array gốc trước. Khi đã có bản sao, bạn có thể sử dụng các method làm thay đổi array như `nextList.reverse()` hoặc `nextList.sort()`, hoặc thậm chí gán cho từng phần tử bằng `nextList[0] = "something"`.

Tuy nhiên, **ngay cả khi đã sao chép một array, bạn cũng không thể trực tiếp làm thay đổi các phần tử hiện có _bên trong_ array đó.** Lý do là việc sao chép chỉ mang tính nông (shallow)—array mới sẽ chứa các phần tử giống với array gốc. Vì vậy, nếu bạn sửa đổi một object bên trong array đã sao chép, bạn đang làm thay đổi state hiện có. Ví dụ, đoạn code như sau sẽ gây ra vấn đề.

```js
const nextList = [...list];
nextList[0].seen = true; // Problem: mutates list[0]
setList(nextList);
```

Mặc dù `nextList` và `list` là hai array khác nhau, **`nextList[0]` và `list[0]` trỏ đến cùng một object.** Vì vậy, khi thay đổi `nextList[0].seen`, bạn cũng đang thay đổi `list[0].seen`. Đây là state mutation, điều bạn nên tránh! Bạn có thể giải quyết vấn đề này tương tự như cách [cập nhật các object JavaScript lồng nhau](/learn/updating-objects-in-state#updating-a-nested-object)—bằng cách sao chép từng phần tử muốn thay đổi thay vì làm thay đổi chúng. Cách thực hiện như sau.

## Cập nhật các object bên trong array {/*updating-objects-inside-arrays*/}

Object không thực sự nằm "bên trong" array. Chúng có thể trông như nằm "bên trong" trong code, nhưng mỗi object trong array là một giá trị riêng biệt mà array "trỏ đến". Đây là lý do bạn cần cẩn thận khi thay đổi các field lồng nhau như `list[0]`. Danh sách tác phẩm của một người khác có thể trỏ đến cùng một phần tử trong array!

**Khi cập nhật state lồng nhau, bạn cần tạo các bản sao bắt đầu từ vị trí muốn cập nhật và lên đến tận cấp cao nhất.** Hãy cùng xem cách hoạt động của việc này.

Trong ví dụ này, hai danh sách artwork riêng biệt có cùng state ban đầu. Chúng vốn phải được tách biệt, nhưng do một mutation, state của chúng vô tình được dùng chung, và việc đánh dấu một ô trong danh sách này lại ảnh hưởng đến danh sách kia:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Vấn đề nằm trong đoạn code như sau:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problem: mutates an existing item
setMyList(myNextList);
```

Mặc dù bản thân mảng `myNextList` là một mảng mới, *các item trong mảng* lại giống với các item trong mảng `myList` ban đầu. Vì vậy, việc thay đổi `artwork.seen` sẽ thay đổi *item artwork ban đầu*. Item artwork đó cũng nằm trong `yourList`, từ đó gây ra lỗi. Những bug như thế này có thể khó hình dung, nhưng may mắn là chúng sẽ biến mất nếu bạn tránh mutate state.

**Bạn có thể dùng `map` để thay thế một item cũ bằng phiên bản đã cập nhật của nó mà không cần mutation.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

Ở đây, `...` là object spread syntax được dùng để [tạo một bản sao của object.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

Với cách tiếp cận này, không có item state hiện có nào bị mutate, và bug đã được khắc phục:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Nói chung, **bạn chỉ nên mutate những object mà mình vừa tạo.** Nếu bạn đang chèn một artwork *mới*, bạn có thể mutate nó, nhưng nếu đang làm việc với thứ đã có trong state, bạn cần tạo một bản sao.

### Viết logic cập nhật ngắn gọn với Immer {/*write-concise-update-logic-with-immer*/}

Việc cập nhật các mảng lồng nhau mà không mutate có thể trở nên hơi lặp lại. [Cũng giống như với object](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Nhìn chung, bạn không nên cần cập nhật state sâu hơn một vài cấp. Nếu các state object của bạn rất sâu, bạn có thể muốn [tái cấu trúc chúng theo cách khác](/learn/choosing-the-state-structure#avoid-deeply-nested-state) để chúng trở nên phẳng.
- Nếu không muốn thay đổi cấu trúc state, bạn có thể thích sử dụng [Immer](https://github.com/immerjs/use-immer), cho phép bạn viết bằng syntax thuận tiện nhưng có tính mutation và tự đảm nhiệm việc tạo các bản sao.

Dưới đây là ví dụ Art Bucket List được viết lại bằng Immer:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
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

Hãy chú ý rằng với Immer, **mutation như `artwork.seen = nextSeen` giờ đây là hợp lệ:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Điều này là vì bạn không mutate state _ban đầu_, mà mutate một object `draft` đặc biệt do Immer cung cấp. Tương tự, bạn có thể áp dụng các method có tính mutation như `push()` và `pop()` lên nội dung của `draft`.

Ở phía sau, Immer luôn xây dựng state tiếp theo từ đầu dựa trên những thay đổi bạn đã thực hiện trên `draft`. Điều này giúp các event handler của bạn ngắn gọn mà không bao giờ mutate state.

<Recap>

- Bạn có thể đưa các mảng vào state, nhưng không thể thay đổi chúng.
- Thay vì mutate một mảng, hãy tạo một phiên bản *mới* của mảng đó rồi cập nhật state thành phiên bản mới.
- Bạn có thể dùng array spread syntax `[...arr, newItem]` để tạo các mảng có item mới.
- Bạn có thể dùng `filter()` và `map()` để tạo các mảng mới với các item đã được filter hoặc transform.
- Bạn có thể dùng Immer để giữ cho code ngắn gọn.

</Recap>



<Challenges>

#### Cập nhật một item trong shopping cart {/*update-an-item-in-the-shopping-cart*/}

Hoàn thiện logic `handleIncreaseClick` để khi nhấn "+" thì số lượng tương ứng tăng lên:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Bạn có thể dùng function `map` để tạo một mảng mới, sau đó dùng object spread syntax `...` để tạo một bản sao của object đã thay đổi cho mảng mới:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Xóa một item khỏi shopping cart {/*remove-an-item-from-the-shopping-cart*/}

Shopping cart này có button "+", nhưng button "–" không làm gì cả. Bạn cần thêm một event handler cho button đó để khi nhấn, nó giảm `count` của product tương ứng. Nếu nhấn "–" khi số lượng là 1, product đó sẽ tự động bị xóa khỏi cart. Hãy đảm bảo số lượng không bao giờ hiển thị là 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Trước tiên, bạn có thể dùng `map` để tạo ra một mảng mới, sau đó dùng `filter` để xóa các product có `count` được đặt thành `0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Sửa các mutation bằng các method không mutate {/*fix-the-mutations-using-non-mutative-methods*/}

Trong ví dụ này, tất cả event handler trong `App.js` đều sử dụng mutation. Vì vậy, việc chỉnh sửa và xóa todo không hoạt động. Hãy viết lại `handleAddTodo`, `handleChangeTodo` và `handleDeleteTodo` để sử dụng các method không mutate:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

Trong `handleAddTodo`, bạn có thể dùng array spread syntax. Trong `handleChangeTodo`, bạn có thể tạo một mảng mới với `map`. Trong `handleDeleteTodo`, bạn có thể tạo một mảng mới với `filter`. Giờ đây danh sách hoạt động chính xác:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Sửa các mutation bằng Immer {/*fix-the-mutations-using-immer*/}

Đây là ví dụ giống với challenge trước. Lần này, hãy sửa các mutation bằng cách sử dụng Immer. Để thuận tiện, `useImmer` đã được import sẵn, vì vậy bạn cần thay đổi biến state `todos` để sử dụng nó.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
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

<Solution>

Với Immer, bạn có thể viết code theo phong cách có mutation, miễn là bạn chỉ mutate các phần của `draft` mà Immer cung cấp cho bạn. Ở đây, tất cả mutation đều được thực hiện trên `draft`, vì vậy code hoạt động:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
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

Bạn cũng có thể kết hợp cách tiếp cận có mutation và không mutate với Immer.

Ví dụ, trong phiên bản này, `handleAddTodo` được triển khai bằng cách mutate `draft` của Immer, trong khi `handleChangeTodo` và `handleDeleteTodo` sử dụng các method không mutate `map` và `filter`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
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

Với Immer, bạn có thể chọn phong cách cảm thấy tự nhiên nhất cho từng trường hợp riêng biệt.

</Solution>

</Challenges>