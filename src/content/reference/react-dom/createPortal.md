---
title: createPortal
---

<Intro>

`createPortal` cho phép bạn render một số children vào một phần khác của DOM.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Để tạo một portal, hãy gọi `createPortal`, truyền vào một JSX và node DOM nơi nó sẽ được render:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

[Xem thêm ví dụ bên dưới.](#usage)

Portal chỉ thay đổi vị trí vật lý của node DOM. Về mọi mặt khác, JSX mà bạn render vào một portal hoạt động như một child node của React component render nó. Ví dụ, child có thể truy cập context do parent tree cung cấp, và các event bubble từ child lên parent theo React tree.

#### Tham số {/*parameters*/}

* `children`: Bất kỳ thứ gì có thể được render bằng React, chẳng hạn như một đoạn JSX (ví dụ: `<div />` hoặc `<SomeComponent />`), một [Fragment](/reference/react/Fragment) (`<>...</>`), một string hoặc number, hay một array gồm các giá trị này.

* `domNode`: Một node DOM, chẳng hạn như node được trả về bởi `document.getElementById()`. Node này phải tồn tại từ trước. Việc truyền một node DOM khác trong quá trình update sẽ khiến nội dung portal được tạo lại.

* **tùy chọn** `key`: Một string hoặc number duy nhất được dùng làm [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) của portal.

#### Giá trị trả về {/*returns*/}

`createPortal` trả về một React node có thể được đưa vào JSX hoặc được trả về từ một React component. Nếu React gặp node này trong output render, nó sẽ đặt `children` được cung cấp vào bên trong `domNode` được cung cấp.

#### Lưu ý {/*caveats*/}

* Các event từ portal được lan truyền theo React tree thay vì DOM tree. Ví dụ, nếu bạn click bên trong một portal và portal được bao bọc trong `<div onClick>`, handler `onClick` đó sẽ được gọi. Nếu điều này gây ra vấn đề, hãy dừng việc lan truyền event từ bên trong portal hoặc di chuyển chính portal lên cao hơn trong React tree.

---

## Cách sử dụng {/*usage*/}

### Render vào một phần khác của DOM {/*rendering-to-a-different-part-of-the-dom*/}

*Portal* cho phép component render một số child của chúng vào một vị trí khác trong DOM. Điều này cho phép một phần component của bạn “thoát” khỏi bất kỳ container nào mà nó đang nằm trong đó. Ví dụ, một component có thể hiển thị một modal dialog hoặc tooltip xuất hiện phía trên và bên ngoài phần còn lại của trang.

Để tạo một portal, hãy render kết quả của `createPortal` với <CodeStep step={1}>some JSX</CodeStep> và <CodeStep step={2}>DOM node nơi nó sẽ được đặt</CodeStep>:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

React sẽ đặt các DOM node của <CodeStep step={1}>JSX bạn đã truyền vào</CodeStep> bên trong <CodeStep step={2}>DOM node bạn đã cung cấp</CodeStep>.

Nếu không có portal, `<p>` thứ hai sẽ được đặt bên trong `<div>` parent, nhưng portal đã “dịch chuyển” nó vào [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Hãy chú ý rằng đoạn văn thứ hai hiển thị bên ngoài `<div>` parent có đường viền. Nếu kiểm tra cấu trúc DOM bằng developer tools, bạn sẽ thấy `<p>` thứ hai được đặt trực tiếp vào `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>This child is placed inside the parent div.</p>
      </div>
    ...
  </div>
  <p>This child is placed in the document body.</p>
</body>
```

Portal chỉ thay đổi vị trí vật lý của node DOM. Về mọi mặt khác, JSX mà bạn render vào một portal hoạt động như một child node của React component render nó. Ví dụ, child có thể truy cập context do parent tree cung cấp, và các event vẫn bubble từ child lên parent theo React tree.

---

### Render modal dialog bằng portal {/*rendering-a-modal-dialog-with-a-portal*/}

Bạn có thể sử dụng portal để tạo một modal dialog nổi phía trên phần còn lại của trang, ngay cả khi component gọi dialog nằm bên trong một container có `overflow: hidden` hoặc các style khác gây ảnh hưởng đến dialog.

Trong ví dụ này, hai container có các style làm gián đoạn modal dialog, nhưng container được render vào portal không bị ảnh hưởng vì trong DOM, modal không nằm bên trong các phần tử JSX parent.

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal without a portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```


```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

Điều quan trọng là phải đảm bảo app của bạn có tính accessible khi sử dụng portal. Chẳng hạn, bạn có thể cần quản lý keyboard focus để người dùng có thể di chuyển focus vào và ra khỏi portal một cách tự nhiên.

Hãy tuân theo [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal) khi tạo modal. Nếu sử dụng một package do cộng đồng phát triển, hãy đảm bảo package đó accessible và tuân theo các hướng dẫn này.

</Pitfall>

---

### Render React component vào markup server không phải React {/*rendering-react-components-into-non-react-server-markup*/}

Portal có thể hữu ích nếu React root của bạn chỉ là một phần của trang tĩnh hoặc được server render, không được xây dựng bằng React. Ví dụ, nếu trang của bạn được xây dựng bằng một server framework như Rails, bạn có thể tạo các khu vực có tính tương tác bên trong những khu vực tĩnh như sidebar. So với việc có [nhiều React root riêng biệt,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) portal cho phép bạn xử lý app như một React tree duy nhất với state dùng chung, dù các phần của nó được render vào những phần khác nhau của DOM.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Render React component vào các DOM node không phải React {/*rendering-react-components-into-non-react-dom-nodes*/}

Bạn cũng có thể sử dụng portal để quản lý nội dung của một DOM node được quản lý bên ngoài React. Ví dụ, giả sử bạn đang tích hợp một map widget không phải React và muốn render nội dung React bên trong một popup. Để làm vậy, hãy khai báo một `popupContainer` state variable để lưu DOM node mà bạn sẽ render vào:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Khi tạo third-party widget, hãy lưu DOM node do widget trả về để bạn có thể render vào đó:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

Điều này cho phép bạn sử dụng `createPortal` để render nội dung React vào `popupContainer` sau khi node này khả dụng:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

Dưới đây là một ví dụ hoàn chỉnh mà bạn có thể chạy thử:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>