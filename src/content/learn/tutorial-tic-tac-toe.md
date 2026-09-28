---
title: 'Hướng dẫn: Tic-Tac-Toe'
---

<Intro>

Trong hướng dẫn này, bạn sẽ xây dựng một trò chơi tic-tac-toe nhỏ. Hướng dẫn này không yêu cầu bạn đã có kiến thức về React. Các kỹ thuật bạn sẽ học trong hướng dẫn là nền tảng để xây dựng bất kỳ ứng dụng React nào, và việc hiểu đầy đủ các kỹ thuật này sẽ giúp bạn hiểu sâu về React.

</Intro>

<Note>

Hướng dẫn này dành cho những người thích **học bằng cách thực hành** và muốn nhanh chóng thử tạo ra một sản phẩm cụ thể. Nếu bạn muốn học từng khái niệm theo từng bước, hãy bắt đầu với [Mô tả UI.](/learn/describing-the-ui)

</Note>

Hướng dẫn được chia thành một số phần:

- [Thiết lập cho hướng dẫn](#setup-for-the-tutorial) sẽ cung cấp cho bạn **điểm bắt đầu** để làm theo hướng dẫn.
- [Tổng quan](#overview) sẽ dạy bạn **những kiến thức nền tảng** về React: components, props và state.
- [Hoàn thiện trò chơi](#completing-the-game) sẽ dạy bạn **những kỹ thuật phổ biến nhất** trong phát triển React.
- [Thêm tính năng du hành thời gian](#adding-time-travel) sẽ giúp bạn **hiểu sâu hơn** về những điểm mạnh độc đáo của React.

### Bạn sẽ xây dựng gì? {/*what-are-you-building*/}

Trong hướng dẫn này, bạn sẽ xây dựng một trò chơi tic-tac-toe tương tác bằng React.

Bạn có thể xem giao diện của trò chơi sau khi hoàn thành tại đây:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Nếu bạn vẫn chưa hiểu code hoặc chưa quen với cú pháp của code, đừng lo lắng! Mục tiêu của hướng dẫn này là giúp bạn hiểu React và cú pháp của nó.

Chúng tôi khuyên bạn nên trải nghiệm trò chơi tic-tac-toe ở trên trước khi tiếp tục với hướng dẫn. Một trong những tính năng bạn sẽ nhận thấy là có một danh sách được đánh số ở bên phải bàn cờ. Danh sách này ghi lại lịch sử tất cả các nước đi đã diễn ra trong trò chơi và được cập nhật khi trò chơi tiến triển.

Sau khi đã thử chơi trò chơi tic-tac-toe hoàn chỉnh, hãy tiếp tục cuộn xuống. Trong hướng dẫn này, bạn sẽ bắt đầu với một template đơn giản hơn. Bước tiếp theo là thiết lập để bạn có thể bắt đầu xây dựng trò chơi.

## Thiết lập cho hướng dẫn {/*setup-for-the-tutorial*/}

Trong trình soạn thảo code trực tiếp bên dưới, hãy nhấp vào **Fork** ở góc trên bên phải để mở trình soạn thảo trong một tab mới bằng website CodeSandbox. CodeSandbox cho phép bạn viết code trong trình duyệt và xem trước ứng dụng bạn tạo sẽ hiển thị như thế nào với người dùng. Tab mới sẽ hiển thị một hình vuông trống và code khởi đầu cho hướng dẫn này.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Bạn cũng có thể làm theo hướng dẫn này bằng môi trường phát triển cục bộ của mình. Để thực hiện việc này, bạn cần:

1. Cài đặt [Node.js](https://nodejs.org/en/)
1. Trong tab CodeSandbox đã mở trước đó, nhấn nút ở góc trên bên trái để mở menu, sau đó chọn **Download Sandbox** trong menu đó để tải một archive chứa các file về máy
1. Giải nén archive, sau đó mở terminal và `cd` đến thư mục bạn đã giải nén
1. Cài đặt các dependencies bằng `npm install`
1. Chạy `npm start` để khởi động local server và làm theo các hướng dẫn để xem code đang chạy trong trình duyệt

Nếu gặp khó khăn, đừng để điều đó ngăn cản bạn! Hãy tiếp tục làm theo hướng dẫn trực tuyến và thử thiết lập môi trường cục bộ vào lúc khác.

</Note>

## Tổng quan {/*overview*/}

Bây giờ bạn đã thiết lập xong, hãy cùng tìm hiểu tổng quan về React!

### Kiểm tra code khởi đầu {/*inspecting-the-starter-code*/}

Trong CodeSandbox, bạn sẽ thấy ba khu vực chính:

![CodeSandbox với code khởi đầu](../images/tutorial/react-starter-code-codesandbox.png)

1. Khu vực _Files_ với danh sách các file như `App.js`, `index.js`, `styles.css` trong thư mục `src` và một thư mục có tên `public`
1. _code editor_, nơi bạn sẽ thấy source code của file đã chọn
1. Khu vực _browser_, nơi bạn sẽ thấy code đã viết được hiển thị như thế nào

File `App.js` sẽ được chọn trong khu vực _Files_. Nội dung của file đó trong _code editor_ sẽ là:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

Khu vực _browser_ sẽ hiển thị một hình vuông có chữ X bên trong như sau:

![hình vuông chứa x](../images/tutorial/x-filled-square.png)

Bây giờ hãy cùng xem các file trong code khởi đầu.

#### `App.js` {/*appjs*/}

Code trong `App.js` tạo ra một _component_. Trong React, component là một đoạn code có thể tái sử dụng, đại diện cho một phần của user interface. Components được dùng để render, quản lý và cập nhật các phần tử UI trong ứng dụng của bạn. Hãy xem component này từng dòng để hiểu điều gì đang xảy ra:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

Dòng đầu tiên định nghĩa một function có tên `Square`. Từ khóa JavaScript `export` giúp function này có thể được truy cập bên ngoài file này. Từ khóa `default` cho các file khác sử dụng code của bạn biết rằng đây là function chính trong file.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

Dòng thứ hai trả về một button. Từ khóa JavaScript `return` có nghĩa là mọi thứ theo sau nó sẽ được trả về dưới dạng giá trị cho bên gọi function. `<button>` là một *JSX element*. JSX element là sự kết hợp giữa code JavaScript và các thẻ HTML, mô tả nội dung bạn muốn hiển thị. `className="square"` là một thuộc tính của button, hay còn gọi là *prop*, cho CSS biết cách tạo kiểu cho button. `X` là nội dung được hiển thị bên trong button, còn `</button>` đóng JSX element để cho biết mọi nội dung tiếp theo không được đặt bên trong button.

#### `styles.css` {/*stylescss*/}

Nhấp vào file có nhãn `styles.css` trong khu vực _Files_ của CodeSandbox. File này định nghĩa các style cho ứng dụng React của bạn. Hai _CSS selector_ đầu tiên (`*` và `body`) định nghĩa style cho các phần lớn trong ứng dụng, trong khi selector `.square` định nghĩa style cho bất kỳ component nào có thuộc tính `className` được đặt thành `square`. Trong code của bạn, điều đó sẽ khớp với button từ component Square trong file `App.js`.

#### `index.js` {/*indexjs*/}

Nhấp vào file có nhãn `index.js` trong khu vực _Files_ của CodeSandbox. Bạn sẽ không chỉnh sửa file này trong suốt hướng dẫn, nhưng nó là cầu nối giữa component bạn đã tạo trong file `App.js` và web browser.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

Các dòng 1-5 kết hợp tất cả những phần cần thiết:

* React
* thư viện của React dùng để giao tiếp với web browser (React DOM)
* các style cho components của bạn
* component bạn đã tạo trong `App.js`.

Phần còn lại của file kết hợp tất cả các phần và inject sản phẩm hoàn chỉnh vào `index.html` trong thư mục `public`.

### Xây dựng bàn cờ {/*building-the-board*/}

Hãy quay lại `App.js`. Đây là nơi bạn sẽ dành phần còn lại của hướng dẫn.

Hiện tại bàn cờ chỉ có một hình vuông, nhưng bạn cần chín hình vuông! Nếu chỉ sao chép và dán hình vuông để tạo thành hai hình vuông như sau:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Bạn sẽ nhận được lỗi này:

<ConsoleBlock level="error">

/src/App.js: Các JSX element liền kề phải được đặt trong một thẻ bao quanh. Bạn có muốn dùng JSX Fragment `<>...</>` không?

</ConsoleBlock>

Các React component phải trả về một JSX element duy nhất thay vì nhiều JSX element liền kề, chẳng hạn như hai button. Để khắc phục điều này, bạn có thể dùng *Fragments* (`<>` và `</>`) để bao quanh nhiều JSX element liền kề như sau:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Bây giờ bạn sẽ thấy:

![hai hình vuông chứa x](../images/tutorial/two-x-filled-squares.png)

Tuyệt! Bây giờ bạn chỉ cần sao chép và dán thêm vài lần để tạo chín hình vuông và...

![chín hình vuông chứa x trên một hàng](../images/tutorial/nine-x-filled-squares.png)

Ôi không! Các hình vuông đều nằm trên một hàng duy nhất thay vì nằm trong một grid như bàn cờ bạn cần. Để khắc phục, bạn sẽ cần nhóm các hình vuông thành từng hàng bằng các thẻ `div`s và thêm một số CSS class. Nhân tiện, bạn cũng sẽ đánh số từng hình vuông để đảm bảo biết mỗi hình vuông được hiển thị ở đâu.

Trong file `App.js`, hãy cập nhật component `Square` để có dạng như sau:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

CSS được định nghĩa trong `styles.css` tạo style cho các div có `className` là `board-row`. Bây giờ bạn đã nhóm các component thành từng hàng bằng các `div`s có style, bạn đã có bàn cờ tic-tac-toe:

![bàn cờ tic-tac-toe được điền các số từ 1 đến 9](../images/tutorial/number-filled-board.png)

Nhưng bây giờ bạn gặp một vấn đề. Component có tên `Square` thực sự không còn là một square nữa. Hãy sửa điều đó bằng cách đổi tên thành `Board`:

```js {1}
export default function Board() {
  //...
}
```

Lúc này, code của bạn sẽ trông gần giống như sau:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Psssst... Có rất nhiều thứ phải gõ! Bạn có thể yên tâm sao chép và dán code từ trang này. Tuy nhiên, nếu bạn muốn thử một chút thách thức, chúng tôi khuyên bạn chỉ sao chép những đoạn code mà bạn đã tự tay gõ ít nhất một lần.

</Note>

### Truyền dữ liệu qua props {/*passing-data-through-props*/}

Tiếp theo, bạn sẽ muốn thay đổi giá trị của một ô từ rỗng thành "X" khi người dùng nhấp vào ô đó. Với cách xây dựng bàn cờ hiện tại, bạn sẽ phải sao chép-dán đoạn code cập nhật ô chín lần (mỗi lần cho một ô)! Thay vì sao chép-dán, kiến trúc component của React cho phép bạn tạo một component có thể tái sử dụng để tránh code lộn xộn và trùng lặp.

Trước tiên, bạn sẽ sao chép dòng định nghĩa ô đầu tiên của mình (`<button className="square">1</button>`) từ component `Board` vào một component `Square` mới:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Sau đó, bạn sẽ cập nhật component Board để render component `Square` đó bằng cú pháp JSX:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Lưu ý rằng không giống như các `div` của trình duyệt, các component của riêng bạn là `Board` và `Square` phải bắt đầu bằng chữ cái viết hoa.

Hãy cùng xem:

![bàn cờ có một ô đã được điền](../images/tutorial/board-filled-with-ones.png)

Ôi không! Bạn đã làm mất các ô được đánh số trước đó. Bây giờ mỗi ô đều hiển thị "1". Để sửa điều này, bạn sẽ dùng *props* để truyền giá trị mà mỗi ô nên có từ component cha (`Board`) đến component con (`Square`).

Cập nhật component `Square` để đọc prop `value` mà bạn sẽ truyền từ `Board`:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` cho biết component Square có thể nhận một prop có tên là `value`.

Bây giờ bạn muốn hiển thị `value` đó thay vì `1` bên trong mỗi ô. Hãy thử làm như sau:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Ồ, đây không phải điều bạn muốn:

![bàn cờ đã điền giá trị](../images/tutorial/board-filled-with-value.png)

Bạn muốn render biến JavaScript có tên `value` từ component của mình, chứ không phải từ "value". Để "thoát vào JavaScript" từ JSX, bạn cần dùng dấu ngoặc nhọn. Thêm dấu ngoặc nhọn xung quanh `value` trong JSX như sau:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Hiện tại, bạn sẽ thấy một bàn cờ trống:

![bàn cờ trống](../images/tutorial/empty-board.png)

Điều này là do component `Board` vẫn chưa truyền prop `value` cho từng component `Square` mà nó render. Để sửa điều này, bạn sẽ thêm prop `value` vào từng component `Square` được render bởi component `Board`:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

Bây giờ bạn sẽ lại thấy một lưới các số:

![bàn cờ tic-tac-toe được điền các số từ 1 đến 9](../images/tutorial/number-filled-board.png)

Code đã cập nhật của bạn sẽ trông như sau:

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Tạo một component tương tác {/*making-an-interactive-component*/}

Hãy thêm một `X` vào component `Square` khi bạn nhấp vào nó. Khai báo một hàm có tên `handleClick` bên trong `Square`. Sau đó, thêm `onClick` vào props của phần tử button JSX được trả về từ `Square`:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Nếu bây giờ bạn nhấp vào một ô, bạn sẽ thấy một log có nội dung `"clicked!"` trong tab _Console_ ở cuối phần _Browser_ trong CodeSandbox. Nhấp vào ô nhiều lần sẽ ghi lại `"clicked!"` lần nữa. Các log trong console lặp lại với cùng một thông báo sẽ không tạo thêm dòng mới trong console. Thay vào đó, bạn sẽ thấy một bộ đếm tăng dần bên cạnh log `"clicked!"` đầu tiên.

<Note>

Nếu bạn đang làm theo hướng dẫn này bằng môi trường development cục bộ, bạn cần mở Console của trình duyệt. Ví dụ, nếu dùng trình duyệt Chrome, bạn có thể mở Console bằng phím tắt **Shift + Ctrl + J** (trên Windows/Linux) hoặc **Option + ⌘ + J** (trên macOS).

</Note>

Bước tiếp theo, bạn muốn component Square "ghi nhớ" rằng nó đã được nhấp vào và điền vào đó một dấu "X". Để "ghi nhớ" thông tin, các component sử dụng *state*.

React cung cấp một hàm đặc biệt có tên `useState` mà bạn có thể gọi từ component để cho phép nó "ghi nhớ" thông tin. Hãy lưu giá trị hiện tại của `Square` vào state và thay đổi giá trị đó khi `Square` được nhấp vào.

Import `useState` ở đầu file. Xóa prop `value` khỏi component `Square`. Thay vào đó, thêm một dòng mới ở đầu `Square` để gọi `useState`. Cho hàm này trả về một state variable có tên `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` lưu giá trị và `setValue` là một hàm có thể dùng để thay đổi giá trị đó. `null` được truyền vào `useState` được dùng làm giá trị khởi tạo cho state variable này, vì vậy `value` ở đây ban đầu sẽ bằng `null`.

Vì component `Square` không còn nhận props nữa, bạn sẽ xóa prop `value` khỏi cả chín component Square được component Board tạo ra:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Bây giờ bạn sẽ thay đổi `Square` để hiển thị "X" khi được nhấp vào. Thay event handler `console.log("clicked!");` bằng `setValue('X');`. Lúc này component `Square` của bạn sẽ trông như sau:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Bằng cách gọi hàm `set` này từ một event handler `onClick`, bạn đang yêu cầu React render lại `Square` đó mỗi khi `<button>` của nó được nhấp vào. Sau khi cập nhật, `Square` của `value` sẽ là `'X'`, vì vậy bạn sẽ thấy "X" trên bàn cờ. Nhấp vào bất kỳ Square nào, và "X" sẽ xuất hiện:

![thêm các dấu x vào bàn cờ](../images/tutorial/tictac-adding-x-s.gif)

Mỗi Square có state riêng: `value` được lưu trong mỗi Square hoàn toàn độc lập với các Square khác. Khi bạn gọi hàm `set` trong một component, React cũng tự động cập nhật các component con bên trong component đó.

Sau khi thực hiện các thay đổi trên, code của bạn sẽ trông như sau:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### React Developer Tools {/*react-developer-tools*/}

React Developer Tools cho phép bạn kiểm tra props và state của các component React. Công cụ này có sẵn dưới dạng tiện ích mở rộng cho trình duyệt [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), và [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil).

Sau khi cài đặt, một tab *Components* mới sẽ xuất hiện trong Developer Tools của trình duyệt đối với các trang web sử dụng React. Nếu bạn đang làm theo hướng dẫn trong CodeSandbox, trước tiên bạn cần mở bản xem trước sandbox trong một tab mới:

![mở trong tab mới](../images/tutorial/sandbox-new-tab.png)

Sau đó, trên trang xem trước, hãy mở DevTools của trình duyệt và tìm tab *Components*:

![tab components](../images/tutorial/components-tab.png)

Để kiểm tra một component cụ thể trên màn hình, hãy dùng nút ở góc trên bên trái của tab Components:

![kiểm tra bằng devtools](../images/tutorial/devtools-inspect.gif)


## Hoàn thiện trò chơi {/*completing-the-game*/}

Đến thời điểm này, bạn đã có tất cả các khối xây dựng cơ bản cho trò chơi tic-tac-toe. Để hoàn thiện trò chơi, bây giờ bạn cần lần lượt đặt các dấu "X" và "O" lên bàn cờ, đồng thời cần có cách xác định người chiến thắng.

### Đưa state lên component cha {/*lifting-state-up*/}

Hiện tại, mỗi component `Square` duy trì một phần state của trò chơi. Để kiểm tra người chiến thắng trong trò chơi tic-tac-toe, `Board` sẽ cần biết bằng cách nào đó state của từng trong số 9 component `Square`.

Bạn sẽ tiếp cận việc này như thế nào? Ban đầu, bạn có thể đoán rằng `Board` cần "hỏi" từng `Square` về state của `Square` đó. Mặc dù cách tiếp cận này về mặt kỹ thuật là có thể thực hiện trong React, chúng tôi không khuyến khích vì code sẽ trở nên khó hiểu, dễ phát sinh bug và khó refactor. Thay vào đó, cách tốt nhất là lưu state của trò chơi trong component `Board` cha thay vì trong từng `Square`. Component `Board` có thể cho từng `Square` biết cần hiển thị gì bằng cách truyền một prop, giống như khi bạn truyền một số cho mỗi Square.

**Để thu thập dữ liệu từ nhiều component con hoặc để hai component con giao tiếp với nhau, thay vào đó hãy khai báo state dùng chung trong component cha của chúng. Component cha có thể truyền state đó trở lại các component con thông qua props. Điều này giữ cho các component con đồng bộ với nhau và với component cha của chúng.**

Đưa state lên một component cha là việc thường gặp khi các component React được refactor.

Hãy tận dụng cơ hội này để thử. Chỉnh sửa component `Board` để khai báo một biến state có tên `squares`, mặc định là một mảng gồm 9 giá trị null tương ứng với 9 ô:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` tạo một mảng gồm chín phần tử và đặt mỗi phần tử thành `null`. Lời gọi `useState()` bao quanh nó khai báo một biến state `squares`, ban đầu được đặt thành mảng đó. Mỗi phần tử trong mảng tương ứng với giá trị của một ô. Sau này, khi bạn điền bàn cờ, mảng `squares` sẽ trông như sau:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

Bây giờ component `Board` cần truyền prop `value` xuống từng component `Square` mà nó render:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

Tiếp theo, bạn sẽ chỉnh sửa component `Square` để nhận prop `value` từ component Board. Việc này yêu cầu loại bỏ cơ chế theo dõi state riêng của component Square đối với `value` và prop `onClick` của button:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

Lúc này, bạn sẽ thấy một bàn cờ tic-tac-toe trống:

![empty board](../images/tutorial/empty-board.png)

Và code của bạn sẽ trông như sau:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Mỗi Square giờ sẽ nhận một prop `value`, có thể là `'X'`, `'O'`, hoặc `null` đối với các ô trống.

Tiếp theo, bạn cần thay đổi điều xảy ra khi một `Square` được nhấp. Component `Board` hiện duy trì thông tin về các ô đã được điền. Bạn cần tạo cách để `Square` cập nhật state của `Board`. Vì state là private đối với component định nghĩa nó, bạn không thể cập nhật trực tiếp state của `Board` từ `Square`.

Thay vào đó, bạn sẽ truyền một function từ component `Board` xuống component `Square`, rồi yêu cầu `Square` gọi function đó khi một ô được nhấp. Trước tiên, bạn sẽ bắt đầu với function mà component `Square` sẽ gọi khi nó được nhấp. Bạn sẽ gọi function đó là `onSquareClick`:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Tiếp theo, bạn sẽ thêm function `onSquareClick` vào props của component `Square`:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Bây giờ, bạn sẽ kết nối prop `onSquareClick` với một function trong component `Board` mà bạn sẽ đặt tên là `handleClick`. Để kết nối `onSquareClick` với `handleClick`, bạn sẽ truyền một function vào prop `onSquareClick` của component `Square` đầu tiên:

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

Cuối cùng, bạn sẽ định nghĩa function `handleClick` bên trong component Board để cập nhật mảng `squares` chứa state của bàn cờ:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Function `handleClick` tạo một bản sao của mảng `squares` (`nextSquares`) bằng method Array `slice()` của JavaScript. Sau đó, `handleClick` cập nhật mảng `nextSquares` để thêm `X` vào ô đầu tiên (index `[0]`).

Việc gọi function `setSquares` cho React biết rằng state của component đã thay đổi. Điều này sẽ kích hoạt việc re-render các component sử dụng state `squares` (`Board`), cũng như các component con của nó (các component `Square` tạo nên bàn cờ).

<Note>

JavaScript hỗ trợ [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures), nghĩa là một function bên trong (ví dụ: `handleClick`) có quyền truy cập vào các biến và function được định nghĩa trong một function bên ngoài (ví dụ: `Board`). Function `handleClick` có thể đọc state `squares` và gọi method `setSquares` vì cả hai đều được định nghĩa bên trong function `Board`.

</Note>

Bây giờ bạn có thể thêm các X vào bàn cờ... nhưng chỉ vào ô phía trên bên trái. Function `handleClick` của bạn đang được hardcode để cập nhật index của ô phía trên bên trái (`0`). Hãy cập nhật `handleClick` để có thể cập nhật bất kỳ ô nào. Thêm một tham số `i` vào function `handleClick`, tham số này nhận index của ô cần cập nhật:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Tiếp theo, bạn cần truyền `i` đó vào `handleClick`. Bạn có thể thử đặt trực tiếp prop `onSquareClick` của square thành `handleClick(0)` trong JSX như sau, nhưng cách này sẽ không hoạt động:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

Đây là lý do cách này không hoạt động. Lời gọi `handleClick(0)` sẽ là một phần trong quá trình render component board. Vì `handleClick(0)` thay đổi state của component board bằng cách gọi `setSquares`, toàn bộ component board sẽ lại được re-render. Nhưng điều này lại chạy `handleClick(0)` lần nữa, dẫn đến một vòng lặp vô hạn:

<ConsoleBlock level="error">

Quá nhiều lần re-render. React giới hạn số lần render để ngăn vòng lặp vô hạn.

</ConsoleBlock>

Tại sao vấn đề này không xảy ra trước đó?

Khi truyền `onSquareClick={handleClick}`, bạn đã truyền function `handleClick` xuống dưới dạng prop. Bạn không gọi function đó! Nhưng bây giờ bạn đang *gọi* function đó ngay lập tức--hãy chú ý dấu ngoặc đơn trong `handleClick(0)`--và đó là lý do nó chạy quá sớm. Bạn không muốn gọi `handleClick` cho đến khi người dùng nhấp!

Bạn có thể khắc phục việc này bằng cách tạo một function như `handleFirstSquareClick` gọi `handleClick(0)`, một function như `handleSecondSquareClick` gọi `handleClick(1)`, v.v. Bạn sẽ truyền (thay vì gọi) các function này xuống dưới dạng props như `onSquareClick={handleFirstSquareClick}`. Cách này sẽ giải quyết vòng lặp vô hạn.

Tuy nhiên, việc định nghĩa chín function khác nhau và đặt tên cho từng function là quá dài dòng. Thay vào đó, hãy làm như sau:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

Hãy chú ý đến cú pháp `() =>` mới. Ở đây, `() => handleClick(0)` là một *arrow function*, một cách ngắn gọn hơn để định nghĩa function. Khi ô được nhấp, code sau `=>` "mũi tên" sẽ chạy và gọi `handleClick(0)`.

Bây giờ bạn cần cập nhật tám ô còn lại để gọi `handleClick` từ các arrow function mà bạn truyền vào. Hãy đảm bảo rằng đối số trong mỗi lần gọi `handleClick` tương ứng với index của ô chính xác:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};
```

Bây giờ bạn lại có thể thêm X vào bất kỳ ô nào trên bàn cờ bằng cách nhấp vào chúng:

![filling the board with X](../images/tutorial/tictac-adding-x-s.gif)

Nhưng lần này, toàn bộ việc quản lý state được xử lý bởi component `Board`!

Code của bạn sẽ trông như sau:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Bây giờ việc xử lý state nằm trong component `Board`, component `Board` cha truyền props cho các component `Square` con để chúng có thể được hiển thị chính xác. Khi nhấp vào một `Square`, component `Square` con giờ sẽ yêu cầu component `Board` cha cập nhật state của bàn cờ. Khi state của `Board` thay đổi, cả component `Board` và mọi component `Square` con đều tự động re-render. Việc giữ state của tất cả các ô trong component `Board` sẽ cho phép component này xác định người chiến thắng trong tương lai.

Hãy cùng tóm tắt điều xảy ra khi người dùng nhấp vào ô phía trên bên trái trên bàn cờ để thêm một `X` vào đó:

1. Việc nhấp vào ô phía trên bên trái chạy function mà `button` nhận được dưới dạng prop `onClick` từ `Square`. Component `Square` nhận function đó dưới dạng prop `onSquareClick` từ `Board`. Component `Board` định nghĩa function đó trực tiếp trong JSX. Function gọi `handleClick` với đối số là `0`.
1. `handleClick` sử dụng đối số (`0`) để cập nhật phần tử đầu tiên của mảng `squares` từ `null` thành `X`.
1. State `squares` của component `Board` đã được cập nhật, vì vậy `Board` và tất cả component con của nó được re-render. Điều này khiến prop `value` của component `Square` có index `0` thay đổi từ `null` thành `X`.

Cuối cùng, người dùng sẽ thấy ô phía trên bên trái đã thay đổi từ trống thành có một `X` sau khi nhấp vào đó.

<Note>

Phần tử DOM `<button>` có thuộc tính `onClick` mang ý nghĩa đặc biệt đối với React vì đây là một built-in component. Đối với các custom component như Square, cách đặt tên là tùy thuộc vào bạn. Bạn có thể đặt bất kỳ tên nào cho prop `onSquareClick` của `Square` hoặc function `handleClick` của `Board`, và code vẫn hoạt động như nhau. Trong React, quy ước là sử dụng tên `onSomething` cho các prop biểu diễn event và `handleSomething` cho các định nghĩa function xử lý những event đó.

</Note>

### Tại sao tính bất biến lại quan trọng {/*why-immutability-is-important*/}

Lưu ý rằng trong `handleClick`, bạn gọi `.slice()` để tạo một bản sao của mảng `squares` thay vì sửa đổi mảng hiện có. Để giải thích lý do, chúng ta cần thảo luận về tính bất biến (immutability) và lý do bạn cần tìm hiểu tính bất biến.

Nhìn chung, có hai cách tiếp cận để thay đổi dữ liệu. Cách thứ nhất là _mutate_ dữ liệu bằng cách trực tiếp thay đổi các giá trị của dữ liệu. Cách thứ hai là thay thế dữ liệu bằng một bản sao mới chứa những thay đổi mong muốn. Đây là hình dạng của mảng `squares` nếu bạn mutate nó:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Now `squares` is ["X", null, null, null, null, null, null, null, null];
```

Còn đây là hình dạng khi bạn thay đổi dữ liệu mà không mutate mảng `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Now `squares` is unchanged, but `nextSquares` first element is 'X' rather than `null`
```

Kết quả là như nhau, nhưng bằng cách không trực tiếp mutate (thay đổi dữ liệu bên dưới), bạn nhận được một số lợi ích.

Tính bất biến giúp việc triển khai các tính năng phức tạp dễ dàng hơn nhiều. Ở phần sau của tutorial này, bạn sẽ triển khai một tính năng "du hành thời gian" cho phép xem lại lịch sử của trò chơi và "quay lại" các nước đi trước đó. Chức năng này không chỉ dành riêng cho trò chơi--khả năng undo và redo một số hành động là yêu cầu phổ biến đối với các app. Việc tránh mutate dữ liệu trực tiếp cho phép bạn giữ nguyên các phiên bản trước đó của dữ liệu và tái sử dụng chúng sau này.

Tính bất biến còn có một lợi ích khác. Theo mặc định, tất cả child component sẽ tự động re-render khi state của parent component thay đổi. Điều này bao gồm cả những child component không bị ảnh hưởng bởi thay đổi đó. Mặc dù bản thân việc re-render không gây ảnh hưởng đáng kể mà người dùng có thể nhận thấy (bạn không nên chủ động cố tránh việc này!), vì lý do hiệu năng, bạn có thể muốn bỏ qua việc re-render một phần của tree rõ ràng không bị ảnh hưởng. Tính bất biến giúp component so sánh xem dữ liệu của chúng có thay đổi hay không với chi phí rất thấp. Bạn có thể tìm hiểu thêm về cách React quyết định thời điểm re-render một component trong [tài liệu tham khảo API `memo`API reference](/reference/react/memo).

### Luân phiên lượt chơi {/*taking-turns*/}

Bây giờ là lúc sửa một lỗi lớn trong trò tic-tac-toe này: các chữ "O" không thể được đánh dấu trên bàn cờ.

Bạn sẽ đặt nước đi đầu tiên mặc định là "X". Hãy theo dõi điều này bằng cách thêm một state khác vào component Board:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Mỗi khi một người chơi thực hiện nước đi, `xIsNext` (một boolean) sẽ được đảo ngược để xác định người chơi tiếp theo và state của trò chơi sẽ được lưu lại. Bạn sẽ cập nhật hàm `handleClick` của `Board` để đảo giá trị của `xIsNext`:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

Bây giờ, khi bạn nhấp vào các ô khác nhau, chúng sẽ luân phiên giữa `X` và `O`, đúng như mong đợi!

Nhưng khoan, có một vấn đề. Hãy thử nhấp nhiều lần vào cùng một ô:

![O ghi đè lên X](../images/tutorial/o-replaces-x.gif)

`X` bị một `O` ghi đè! Mặc dù điều này sẽ tạo thêm một tình tiết rất thú vị cho trò chơi, hiện tại chúng ta sẽ tuân theo luật ban đầu.

Khi bạn đánh dấu một ô bằng `X` hoặc `O`, trước tiên bạn không kiểm tra xem ô đó đã có giá trị `X` hoặc `O` hay chưa. Bạn có thể sửa lỗi này bằng cách *return sớm*. Bạn sẽ kiểm tra xem ô đó đã có `X` hoặc `O` hay chưa. Nếu ô đã được điền, bạn sẽ `return` trong hàm `handleClick` sớm--trước khi hàm này cố cập nhật state của bàn cờ.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Bây giờ bạn chỉ có thể thêm `X` hoặc `O` vào các ô trống! Đây là hình dạng code của bạn ở thời điểm này:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Tuyên bố người thắng {/*declaring-a-winner*/}

Giờ đây khi người chơi có thể luân phiên thực hiện nước đi, bạn sẽ muốn hiển thị khi trò chơi kết thúc với một người thắng và không còn lượt nào để thực hiện. Để làm điều đó, bạn sẽ thêm một helper function có tên `calculateWinner`, nhận vào một mảng gồm 9 ô, kiểm tra người thắng và trả về `'X'`, `'O'` hoặc `null` tùy trường hợp. Đừng quá bận tâm về function `calculateWinner`; nó không dành riêng cho React:

```js src/App.js
export default function Board() {
  //...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

<Note>

Việc bạn định nghĩa `calculateWinner` trước hay sau `Board` không quan trọng. Hãy đặt nó ở cuối để bạn không phải cuộn qua nó mỗi lần chỉnh sửa các component.

</Note>

Bạn sẽ gọi `calculateWinner(squares)` trong function `handleClick` của component `Board` để kiểm tra xem người chơi đã thắng hay chưa. Bạn có thể thực hiện việc kiểm tra này đồng thời với việc kiểm tra xem người dùng có nhấp vào một ô đã có giá trị `X` hoặc `O` hay không. Chúng ta muốn return sớm trong cả hai trường hợp:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Để cho người chơi biết khi trò chơi kết thúc, bạn có thể hiển thị văn bản như "Winner: X" hoặc "Winner: O". Để làm điều đó, bạn sẽ thêm một section `status` vào component `Board`. Status sẽ hiển thị người thắng nếu trò chơi đã kết thúc; nếu trò chơi vẫn đang diễn ra, bạn sẽ hiển thị lượt tiếp theo thuộc về người chơi nào:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

Chúc mừng! Bây giờ bạn đã có một trò tic-tac-toe hoạt động. Và bạn cũng vừa học được những kiến thức cơ bản về React. Vì vậy, _bạn_ mới là người chiến thắng thực sự ở đây. Đây là hình dạng code của bạn:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

## Thêm tính năng du hành thời gian {/*adding-time-travel*/}

Ở bài tập cuối cùng, hãy làm cho trò chơi có thể "quay ngược thời gian" về các nước đi trước đó.

### Lưu lịch sử các nước đi {/*storing-a-history-of-moves*/}

Nếu bạn mutate mảng `squares`, việc triển khai tính năng du hành thời gian sẽ rất khó khăn.

Tuy nhiên, bạn đã sử dụng `slice()` để tạo một bản sao mới của mảng `squares` sau mỗi nước đi và coi nó là bất biến. Điều này cho phép bạn lưu trữ mọi phiên bản trước đây của mảng `squares` và di chuyển giữa những lượt đã diễn ra.

Bạn sẽ lưu các mảng `squares` trước đó trong một mảng khác có tên `history`, mảng này sẽ được lưu dưới dạng một state variable mới. Mảng `history` đại diện cho tất cả state của bàn cờ, từ nước đi đầu tiên đến nước đi cuối cùng, và có dạng như sau:

```jsx
[
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Nâng state lên một lần nữa {/*lifting-state-up-again*/}

Bây giờ bạn sẽ viết một top-level component mới có tên `Game` để hiển thị danh sách các nước đi trước đó. Đây là nơi bạn sẽ đặt state `history`, chứa toàn bộ lịch sử của trò chơi.

Đặt state `history` vào component `Game` sẽ cho phép bạn xóa state `squares` khỏi child component `Board` của nó. Tương tự như khi bạn "nâng state lên" từ component `Square` vào component `Board`, giờ đây bạn sẽ nâng state đó từ `Board` lên component top-level `Game`. Điều này giúp component `Game` toàn quyền kiểm soát dữ liệu của `Board` và cho phép nó chỉ dẫn `Board` render các lượt trước đó từ `history`.

Trước tiên, hãy thêm một component `Game` với `export default`. Hãy để component này render component `Board` và một số markup:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

Lưu ý rằng bạn đang xóa các keyword `export default` trước khai báo `function Board() {` và thêm chúng trước khai báo `function Game() {`. Điều này cho biết file `index.js` của bạn sử dụng component `Game` làm component top-level thay vì component `Board`. Các `div` bổ sung được component `Game` trả về đang tạo chỗ cho thông tin trò chơi mà bạn sẽ thêm vào board sau này.

Thêm state vào component `Game` để theo dõi người chơi tiếp theo và lịch sử các nước đi:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Lưu ý rằng `[Array(9).fill(null)]` là một mảng có một phần tử duy nhất, bản thân phần tử đó lại là một mảng gồm 9 `null`.

Để render các ô của lượt hiện tại, bạn sẽ muốn đọc mảng squares cuối cùng từ `history`. Bạn không cần `useState` cho việc này--bạn đã có đủ thông tin để tính toán nó trong quá trình rendering:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Tiếp theo, hãy tạo một function `handlePlay` bên trong component `Game`. Function này sẽ được component `Board` gọi để cập nhật trò chơi. Truyền `xIsNext`, `currentSquares` và `handlePlay` làm props cho component `Board`:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

Hãy để component `Board` được điều khiển hoàn toàn bởi các props mà nó nhận. Thay đổi component `Board` để nhận ba props: `xIsNext`, `squares` và một function `onPlay` mới mà `Board` có thể gọi với mảng squares đã cập nhật khi người chơi thực hiện một nước đi. Tiếp theo, xóa hai dòng đầu tiên của function `Board`, là những dòng gọi `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Bây giờ hãy thay thế các lệnh gọi `setSquares` và `setXIsNext` trong `handleClick` ở component `Board` bằng một lệnh gọi duy nhất đến function `onPlay` mới, để component `Game` có thể cập nhật `Board` khi người dùng nhấp vào một ô:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

Component `Board` được điều khiển hoàn toàn bởi các props được truyền vào nó từ component `Game`. Bạn cần triển khai hàm `handlePlay` trong component `Game` để trò chơi hoạt động trở lại.

`handlePlay` nên làm gì khi được gọi? Hãy nhớ rằng trước đây Board gọi `setSquares` với một array đã được cập nhật; giờ đây nó truyền array `squares` đã cập nhật cho `onPlay`.

Hàm `handlePlay` cần cập nhật state của `Game` để kích hoạt việc re-render, nhưng bạn không còn có hàm `setSquares` để gọi nữa--giờ đây bạn đang sử dụng biến state `history` để lưu thông tin này. Bạn sẽ muốn cập nhật `history` bằng cách thêm array `squares` đã cập nhật làm một mục mới trong history. Bạn cũng muốn chuyển đổi `xIsNext`, giống như Board đã từng làm:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

Ở đây, `[...history, nextSquares]` tạo một array mới chứa tất cả các item trong `history`, tiếp theo là `nextSquares`. (Bạn có thể đọc `...history` [*spread syntax*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) là “liệt kê tất cả các item trong `history`”.)

Ví dụ, nếu `history` là `[[null,null,null], ["X",null,null]]` và `nextSquares` là `["X",null,"O"]`, thì array `[...history, nextSquares]` mới sẽ là `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

Đến đây, bạn đã chuyển state để nó nằm trong component `Game`, và UI sẽ hoạt động đầy đủ, giống như trước khi refactor. Đây là giao diện của code ở thời điểm này:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Hiển thị các nước đi trước đó {/*showing-the-past-moves*/}

Vì bạn đang ghi lại history của trò tic-tac-toe, giờ đây bạn có thể hiển thị danh sách các nước đi trước đó cho người chơi.

Các React element như `<button>` thực chất là những JavaScript object thông thường; bạn có thể truyền chúng qua lại trong application của mình. Để render nhiều item trong React, bạn có thể sử dụng một array các React element.

Bạn đã có một array gồm các nước đi `history` trong state, vì vậy bây giờ bạn cần chuyển nó thành một array các React element. Trong JavaScript, để chuyển một array thành một array khác, bạn có thể sử dụng [array `map` method:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

Bạn sẽ sử dụng `map` để chuyển `history` các nước đi thành các React element đại diện cho các button trên màn hình, đồng thời hiển thị một danh sách các button để “nhảy” đến những nước đi trước đó. Hãy `map` qua `history` trong component Game:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

Bạn có thể xem code sẽ trông như thế nào bên dưới. Lưu ý rằng bạn sẽ thấy một lỗi trong console của developer tools với nội dung:

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>

Bạn sẽ sửa lỗi này trong phần tiếp theo.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Khi lặp qua array `history` bên trong function mà bạn truyền cho `map`, argument `squares` sẽ lần lượt đi qua từng element của `history`, còn argument `move` sẽ lần lượt đi qua từng index của array: `0`, `1`, `2`, …. (Trong hầu hết trường hợp, bạn sẽ cần các array element thực tế, nhưng để render danh sách các nước đi, bạn chỉ cần các index.)

Với mỗi nước đi trong history của trò tic-tac-toe, bạn tạo một list item `<li>` chứa một button `<button>`. Button này có một handler `onClick`, gọi một function có tên `jumpTo` (mà bạn vẫn chưa triển khai).

Hiện tại, bạn sẽ thấy danh sách các nước đi đã diễn ra trong trò chơi và một lỗi trong console của developer tools. Hãy cùng tìm hiểu lỗi “key” có nghĩa là gì.

### Chọn một key {/*picking-a-key*/}

Khi bạn render một danh sách, React lưu một số thông tin về từng list item đã được render. Khi bạn cập nhật một danh sách, React cần xác định điều gì đã thay đổi. Bạn có thể đã thêm, xóa, sắp xếp lại hoặc cập nhật các item trong danh sách.

Hãy hình dung việc chuyển từ

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

sang

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

Ngoài các số lượng đã được cập nhật, người đọc là con người có lẽ sẽ nói rằng bạn đã đổi thứ tự của Alexa và Ben, đồng thời chèn Claudia vào giữa Alexa và Ben. Tuy nhiên, React là một chương trình máy tính và không biết bạn định làm gì, vì vậy bạn cần chỉ định thuộc tính _key_ cho mỗi list item để phân biệt từng list item với các sibling của nó. Nếu dữ liệu của bạn đến từ database, các database ID của Alexa, Ben và Claudia có thể được dùng làm key.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

Khi một danh sách được re-render, React lấy key của từng list item và tìm trong các item của danh sách trước đó một key trùng khớp. Nếu danh sách hiện tại có một key trước đây chưa tồn tại, React sẽ tạo một component. Nếu danh sách hiện tại thiếu một key từng tồn tại trong danh sách trước đó, React sẽ hủy component trước đó. Nếu hai key trùng khớp, component tương ứng sẽ được di chuyển.

Key cho React biết identity của mỗi component, nhờ đó React có thể duy trì state giữa các lần re-render. Nếu key của một component thay đổi, component đó sẽ bị hủy và được tạo lại với state mới.

`key` là một property đặc biệt và được dành riêng trong React. Khi một element được tạo, React lấy property `key` và lưu key trực tiếp trên element được trả về. Mặc dù `key` có vẻ như được truyền dưới dạng props, React tự động sử dụng `key` để quyết định component nào cần được cập nhật. Không có cách nào để một component hỏi parent của nó đã chỉ định `key` nào.

**Bạn nên luôn gán key phù hợp mỗi khi tạo các danh sách động.** Nếu không có key phù hợp, bạn có thể cân nhắc tái cấu trúc dữ liệu của mình.

Nếu không chỉ định key, React sẽ báo lỗi và mặc định sử dụng array index làm key. Việc sử dụng array index làm key có vấn đề khi cố gắng sắp xếp lại các item trong danh sách hoặc chèn/xóa item. Truyền rõ ràng `key={i}` sẽ loại bỏ lỗi nhưng vẫn gặp các vấn đề tương tự như khi dùng array index, và không được khuyến nghị trong hầu hết trường hợp.

Key không cần phải là duy nhất trên toàn cục; chúng chỉ cần duy nhất giữa các component và các sibling của chúng.

### Triển khai time travel {/*implementing-time-travel*/}

Trong history của trò tic-tac-toe, mỗi nước đi trước đó có một ID duy nhất đi kèm: đó là số thứ tự của nước đi. Các nước đi sẽ không bao giờ được sắp xếp lại, xóa hoặc chèn vào giữa, vì vậy sử dụng index của nước đi làm key là an toàn.

Trong function `Game`, bạn có thể thêm key bằng `<li key={move}>`, và nếu reload trò chơi đã render, lỗi “key” của React sẽ biến mất:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Trước khi có thể triển khai `jumpTo`, bạn cần component `Game` theo dõi bước mà người dùng hiện đang xem. Để làm điều này, hãy định nghĩa một biến state mới có tên `currentMove`, với giá trị mặc định là `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Tiếp theo, hãy cập nhật function `jumpTo` bên trong `Game` để cập nhật `currentMove`. Bạn cũng sẽ đặt `xIsNext` thành `true` nếu số mà bạn đang thay đổi `currentMove` thành là số chẵn.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

Bây giờ bạn sẽ thực hiện hai thay đổi đối với function `handlePlay` của `Game`, function này được gọi khi bạn click vào một ô vuông.

- Nếu bạn “quay ngược thời gian” rồi thực hiện một nước đi mới từ thời điểm đó, bạn chỉ muốn giữ lại history cho đến thời điểm đó. Thay vì thêm `nextSquares` sau tất cả các item (`...` spread syntax) trong `history`, bạn sẽ thêm nó sau tất cả các item trong `history.slice(0, currentMove + 1)` để chỉ giữ lại phần tương ứng của history cũ.
- Mỗi khi một nước đi được thực hiện, bạn cần cập nhật `currentMove` để trỏ đến mục mới nhất trong history.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Cuối cùng, bạn sẽ chỉnh sửa component `Game` để render nước đi hiện đang được chọn, thay vì luôn render nước đi cuối cùng:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

Nếu bạn click vào bất kỳ bước nào trong history của trò chơi, bàn cờ tic-tac-toe sẽ ngay lập tức cập nhật để hiển thị trạng thái của bàn cờ sau khi bước đó diễn ra.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Dọn dẹp lần cuối {/*final-cleanup*/}

Nếu xem xét code thật kỹ, bạn có thể nhận thấy rằng `xIsNext === true` khi `currentMove` là số chẵn và `xIsNext === false` khi `currentMove` là số lẻ. Nói cách khác, nếu biết giá trị của `currentMove`, bạn luôn có thể xác định `xIsNext` nên là gì.

Không có lý do gì để lưu cả hai giá trị này trong state. Trên thực tế, hãy luôn cố gắng tránh state dư thừa. Đơn giản hóa những gì bạn lưu trong state sẽ giảm lỗi và giúp code dễ hiểu hơn. Hãy thay đổi `Game` để nó không lưu `xIsNext` dưới dạng một biến state riêng biệt, mà thay vào đó tính giá trị này dựa trên `currentMove`:

```js {4,11,15}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // ...
}
```

Bạn không còn cần khai báo state `xIsNext` hoặc các lệnh gọi đến `setXIsNext`. Giờ đây, sẽ không còn khả năng `xIsNext` bị không đồng bộ với `currentMove`, ngay cả khi bạn mắc lỗi trong quá trình viết các component.

### Hoàn thiện {/*wrapping-up*/}

Chúc mừng! Bạn đã tạo một trò chơi tic-tac-toe có thể:

- Cho phép bạn chơi tic-tac-toe,
- Cho biết khi nào một người chơi đã thắng,
- Lưu lại lịch sử của ván cờ trong quá trình chơi,
- Cho phép người chơi xem lại lịch sử của ván cờ và xem các phiên bản trước đó của bàn cờ.

Làm tốt lắm! Chúng tôi hy vọng giờ đây bạn đã nắm khá rõ cách React hoạt động.

Xem kết quả cuối cùng tại đây:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Nếu còn thời gian hoặc muốn thực hành các kỹ năng React mới, dưới đây là một số ý tưởng cải tiến mà bạn có thể thực hiện cho trò chơi tic-tac-toe, được sắp xếp theo thứ tự độ khó tăng dần:

1. Chỉ đối với nước đi hiện tại, hãy hiển thị “Bạn đang ở nước đi #...” thay cho một button.
1. Viết lại `Board` để sử dụng hai vòng lặp tạo các ô vuông thay vì hardcode chúng.
1. Thêm một button chuyển đổi cho phép bạn sắp xếp các nước đi theo thứ tự tăng dần hoặc giảm dần.
1. Khi có người thắng, hãy làm nổi bật ba ô vuông tạo nên chiến thắng đó (và khi không có ai thắng, hãy hiển thị thông báo cho biết kết quả là hòa).
1. Hiển thị vị trí của mỗi nước đi theo định dạng (row, col) trong danh sách lịch sử nước đi.

Trong suốt tutorial này, bạn đã tìm hiểu các khái niệm của React, bao gồm elements, components, props và state. Giờ đây, khi đã thấy cách các khái niệm này hoạt động trong quá trình xây dựng một trò chơi, hãy xem [Thinking in React](/learn/thinking-in-react) để tìm hiểu cách những khái niệm React tương tự hoạt động khi xây dựng UI của một ứng dụng.