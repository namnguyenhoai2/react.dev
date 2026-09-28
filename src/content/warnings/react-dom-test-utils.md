---
title: Cảnh báo ngừng hỗ trợ của react-dom/test-utils
---

## Cảnh báo về ReactDOMTestUtils.act() {/*reactdomtestutilsact-warning*/}

`act` từ `react-dom/test-utils` đã ngừng được hỗ trợ và được thay thế bằng `act` từ `react`.

Trước:

```js
import {act} from 'react-dom/test-utils';
```

Sau:

```js
import {act} from 'react';
```

## Các API còn lại của ReactDOMTestUtils {/*rest-of-reactdomtestutils-apis*/}

Tất cả các API ngoại trừ `act` đã bị xóa.

React Team khuyến nghị chuyển các bài test của bạn sang [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) để có trải nghiệm testing hiện đại và được hỗ trợ tốt.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

`renderIntoDocument` có thể được thay thế bằng `render` từ `@testing-library/react`.

Trước:

```js
import {renderIntoDocument} from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

Sau:

```js
import {render} from '@testing-library/react';

render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate` có thể được thay thế bằng `fireEvent` từ `@testing-library/react`.

Trước:

```js
import {Simulate} from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

Sau:

```js
import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

Lưu ý rằng `fireEvent` sẽ dispatch một event thực tế trên phần tử, thay vì chỉ gọi handler của event một cách giả lập.

### Danh sách tất cả các API đã bị xóa {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

- `mockComponent()`
- `isElement()`
- `isElementOfType()`
- `isDOMComponent()`
- `isCompositeComponent()`
- `isCompositeComponentWithType()`
- `findAllInRenderedTree()`
- `scryRenderedDOMComponentsWithClass()`
- `findRenderedDOMComponentWithClass()`
- `scryRenderedDOMComponentsWithTag()`
- `findRenderedDOMComponentWithTag()`
- `scryRenderedComponentsWithType()`
- `findRenderedComponentWithType()`
- `renderIntoDocument`
- `Simulate`