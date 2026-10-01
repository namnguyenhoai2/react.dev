---
title: "Các component thông dụng (ví dụ: <div>)"
---

<Intro>

Tất cả component tích hợp sẵn của trình duyệt, chẳng hạn như [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), đều hỗ trợ một số props và event thông dụng.

</Intro>

<InlineToc />

---

## Tham chiếu {/*reference*/}

### Các component thông dụng (ví dụ: `<div>`) {/*common*/}

```js
<div className="wrapper">Some content</div>
```

[Xem thêm các ví dụ bên dưới.](#usage)

#### Props {/*common-props*/}

Các props React đặc biệt này được hỗ trợ cho tất cả component tích hợp sẵn:

* `children`: Một React node (một element, một chuỗi, một số, [một portal,](/reference/react-dom/createPortal) một node rỗng như `null`, `undefined` và các giá trị boolean, hoặc một mảng gồm các React node khác). Chỉ định nội dung bên trong component. Khi sử dụng JSX, bạn thường chỉ định ngầm prop `children` bằng cách lồng các thẻ như `<div><span /></div>`.

* `dangerouslySetInnerHTML`: Một object có dạng `{ __html: '<p>some html</p>' }` chứa một chuỗi HTML thô hoặc giá trị [`TrustedHTML`](https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML) bên trong. Ghi đè thuộc tính [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) của DOM node và hiển thị HTML được truyền vào bên trong. Hãy sử dụng tính năng này hết sức thận trọng! Nếu HTML bên trong không đáng tin cậy (ví dụ: dựa trên dữ liệu người dùng), bạn có nguy cơ đưa vào một lỗ hổng [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). [Đọc thêm về cách sử dụng `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

* `ref`: Một ref object từ [`useRef`](/reference/react/useRef) hoặc [`createRef`](/reference/react/createRef), hoặc một hàm callback [`ref`,](#ref-callback) hay một chuỗi dành cho [legacy refs.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Ref của bạn sẽ được điền bằng phần tử DOM tương ứng với node này. [Đọc thêm về cách thao tác với DOM bằng ref.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: Một giá trị boolean. Nếu `true`, tắt cảnh báo mà React hiển thị cho các element đồng thời có `children` và `contentEditable={true}` (vốn thường không hoạt động cùng nhau). Hãy sử dụng tùy chọn này nếu bạn đang xây dựng một thư viện text input tự quản lý nội dung `contentEditable` theo cách thủ công.

* `suppressHydrationWarning`: Một giá trị boolean. Nếu bạn sử dụng [server rendering,](/reference/react-dom/server) thông thường sẽ có cảnh báo khi server và client render nội dung khác nhau. Trong một số trường hợp hiếm gặp (chẳng hạn như timestamp), việc đảm bảo khớp chính xác là rất khó hoặc không thể. Nếu đặt `suppressHydrationWarning` thành `true`, React sẽ không cảnh báo bạn về sự không khớp trong các thuộc tính và nội dung của element đó. Tùy chọn này chỉ hoạt động ở một cấp và nhằm được sử dụng như một lối thoát. Đừng lạm dụng nó. [Đọc về cách ngăn lỗi hydration.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: Một object chứa các CSS style, ví dụ `{ fontWeight: 'bold', margin: 20 }`. Tương tự như thuộc tính [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) của DOM, tên các thuộc tính CSS cần được viết dưới dạng `camelCase`, chẳng hạn như `fontWeight` thay vì `font-weight`. Bạn có thể truyền chuỗi hoặc số làm giá trị. Nếu truyền một số, chẳng hạn như `width: 100`, React sẽ tự động thêm `px` ("pixels") vào giá trị, trừ khi đó là một [unitless property.](https://github.com/react/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) Chúng tôi khuyến nghị chỉ sử dụng `style` cho các style động mà bạn không biết trước giá trị style. Trong các trường hợp khác, áp dụng các CSS class thông thường bằng `className` sẽ hiệu quả hơn. [Đọc thêm về `className` và `style`.](#applying-css-styles)

Các DOM prop tiêu chuẩn này cũng được hỗ trợ cho tất cả component tích hợp sẵn:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): Một chuỗi. Chỉ định phím tắt cho phần tử. [Thường không được khuyến nghị.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): Các thuộc tính ARIA cho phép bạn chỉ định thông tin trong cây khả năng truy cập cho phần tử này. Xem [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) để tham khảo đầy đủ. Trong React, tên của tất cả thuộc tính ARIA hoàn toàn giống với trong HTML.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): Một chuỗi. Chỉ định liệu và cách nội dung người dùng nhập vào nên được viết hoa.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): Một chuỗi. Chỉ định tên CSS class của phần tử. [Đọc thêm về cách áp dụng CSS styles.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): Một boolean. Nếu `true`, trình duyệt cho phép người dùng chỉnh sửa trực tiếp phần tử đã render. Thuộc tính này được dùng để triển khai các thư viện nhập văn bản có định dạng phong phú như [Lexical.](https://lexical.dev/) React sẽ cảnh báo nếu bạn cố truyền React children vào một phần tử có `contentEditable={true}`, vì React sẽ không thể cập nhật nội dung của phần tử đó sau khi người dùng chỉnh sửa.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Các thuộc tính dữ liệu cho phép bạn gắn một số dữ liệu dạng chuỗi vào phần tử, chẳng hạn như `data-fruit="banana"`. Trong React, chúng không thường được sử dụng vì thông thường bạn sẽ đọc dữ liệu từ props hoặc state thay thế.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): Hoặc `'ltr'` hoặc `'rtl'`. Chỉ định hướng văn bản của phần tử.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): Một boolean. Chỉ định liệu phần tử có thể kéo được hay không. Đây là một phần của [HTML Drag and Drop API.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): Một chuỗi. Chỉ định hành động cần hiển thị cho phím enter trên bàn phím ảo.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): Một chuỗi. Đối với [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) và [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output), cho phép bạn [liên kết nhãn với một control.](/reference/react-dom/components/input#providing-a-label-for-an-input) Giống với thuộc tính HTML [`for`.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) React sử dụng tên thuộc tính DOM tiêu chuẩn (`htmlFor`) thay vì tên thuộc tính HTML.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): Một boolean hoặc một chuỗi. Chỉ định liệu phần tử có nên bị ẩn hay không.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): Một chuỗi. Chỉ định một mã định danh duy nhất cho phần tử này, có thể được dùng để tìm phần tử sau đó hoặc kết nối phần tử này với các phần tử khác. Hãy tạo mã này bằng [`useId`](/reference/react/useId) để tránh xung đột giữa nhiều instance của cùng một component.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): Một chuỗi. Nếu được chỉ định, component sẽ hoạt động như một [custom element.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): Một chuỗi. Chỉ định loại bàn phím cần hiển thị (ví dụ: văn bản, số hoặc điện thoại).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): Một chuỗi. Chỉ định thuộc tính mà phần tử đại diện cho các trình thu thập dữ liệu có cấu trúc.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): Một chuỗi. Chỉ định ngôn ngữ của phần tử.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): Một hàm [`AnimationEvent` handler](#animationevent-handler). Được kích hoạt khi một CSS animation hoàn tất.
* `onAnimationEndCapture`: Một phiên bản của `onAnimationEnd` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): Một hàm [`AnimationEvent` handler](#animationevent-handler). Được kích hoạt khi một vòng lặp của CSS animation kết thúc và một vòng lặp khác bắt đầu.
* `onAnimationIterationCapture`: Một phiên bản của `onAnimationIteration` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): Một hàm [`AnimationEvent` handler](#animationevent-handler). Được kích hoạt khi một CSS animation bắt đầu.
* `onAnimationStartCapture`: `onAnimationStart`, nhưng được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): Một hàm [`MouseEvent` handler](#mouseevent-handler). Được kích hoạt khi một nút pointer không phải nút chính được nhấp.
* `onAuxClickCapture`: Một phiên bản của `onAuxClick` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: Một hàm [`InputEvent` handler](#inputevent-handler). Được kích hoạt trước khi giá trị của một phần tử có thể chỉnh sửa bị thay đổi. React *chưa* sử dụng sự kiện native [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event), mà thay vào đó cố gắng polyfill sự kiện này bằng các sự kiện khác.
* `onBeforeInputCapture`: Một phiên bản của `onBeforeInput` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: Một hàm [`FocusEvent` handler](#focusevent-handler). Được kích hoạt khi một phần tử mất focus. Không giống sự kiện tích hợp sẵn của trình duyệt [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event), trong React, sự kiện `onBlur` sẽ bubble.
* `onBlurCapture`: Một phiên bản của `onBlur` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): Một hàm [`MouseEvent` handler](#mouseevent-handler). Được kích hoạt khi nút chính trên thiết bị pointing được nhấp.
* `onClickCapture`: Một phiên bản của `onClick` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): Một hàm [`CompositionEvent` handler](#compositionevent-handler). Được kích hoạt khi một [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) bắt đầu một phiên composition mới.
* `onCompositionStartCapture`: Một phiên bản của `onCompositionStart` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): Một hàm [`CompositionEvent` handler](#compositionevent-handler). Được kích hoạt khi một [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) hoàn tất hoặc hủy một phiên composition.
* `onCompositionEndCapture`: Một phiên bản của `onCompositionEnd` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): Một hàm [`CompositionEvent` handler](#compositionevent-handler). Được kích hoạt khi [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) nhận một ký tự mới.
* `onCompositionUpdateCapture`: Một phiên bản của `onCompositionUpdate` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): Một hàm [`MouseEvent` handler](#mouseevent-handler). Được kích hoạt khi người dùng cố mở context menu.
* `onContextMenuCapture`: Một phiên bản của `onContextMenu` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): Một hàm [`ClipboardEvent` handler](#clipboardevent-handler). Được kích hoạt khi người dùng cố sao chép nội dung vào clipboard.
* `onCopyCapture`: Một phiên bản của `onCopy` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): Một hàm [`ClipboardEvent` handler](#clipboardevent-handler). Được kích hoạt khi người dùng cố cắt nội dung vào clipboard.
* `onCutCapture`: Một phiên bản của `onCut` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: Một hàm [`MouseEvent` handler](#mouseevent-handler). Được kích hoạt khi người dùng nhấp đúp. Tương ứng với browser [`dblclick` event.](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)
* `onDoubleClickCapture`: Một phiên bản của `onDoubleClick` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): Một hàm [`DragEvent` handler](#dragevent-handler). Được kích hoạt khi người dùng đang kéo một nội dung nào đó.
* `onDragCapture`: Một phiên bản của `onDrag` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): Một hàm [`DragEvent` handler](#dragevent-handler). Được kích hoạt khi người dùng dừng kéo một nội dung nào đó.
* `onDragEndCapture`: Một phiên bản của `onDragEnd` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): Một hàm [`DragEvent` handler](#dragevent-handler). Được kích hoạt khi nội dung đang được kéo đi vào một drop target hợp lệ.
* `onDragEnterCapture`: Một phiên bản của `onDragEnter` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): Một hàm [`DragEvent` handler](#dragevent-handler). Được kích hoạt trên một drop target hợp lệ khi nội dung đang được kéo qua nó. Bạn phải gọi `e.preventDefault()` tại đây để cho phép thả.
* `onDragOverCapture`: Một phiên bản của `onDragOver` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): Một hàm [`DragEvent` handler](#dragevent-handler). Được kích hoạt khi người dùng bắt đầu kéo một element.
* `onDragStartCapture`: Một phiên bản của `onDragStart` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): Một hàm [`DragEvent` handler](#dragevent-handler). Được kích hoạt khi một nội dung nào đó được thả trên một drop target hợp lệ.
* `onDropCapture`: Một phiên bản của `onDrop` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: Một hàm [`FocusEvent` handler](#focusevent-handler). Được kích hoạt khi một element nhận focus. Không giống browser [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) event tích hợp sẵn, trong React, event `onFocus` bubbles.
* `onFocusCapture`: Một phiên bản của `onFocus` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): Một hàm [`PointerEvent` handler](#pointerevent-handler). Được kích hoạt khi một element programmatically captures một pointer.
* `onGotPointerCaptureCapture`: Một phiên bản của `onGotPointerCapture` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): Một hàm [`KeyboardEvent` handler](#keyboardevent-handler). Được kích hoạt khi một phím được nhấn.
* `onKeyDownCapture`: Một phiên bản của `onKeyDown` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): Một hàm [`KeyboardEvent` handler](#keyboardevent-handler). Đã deprecated. Hãy sử dụng `onKeyDown` hoặc `onBeforeInput` thay thế.
* `onKeyPressCapture`: Một phiên bản của `onKeyPress` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): Một hàm [`KeyboardEvent` handler](#keyboardevent-handler). Được kích hoạt khi một phím được nhả.
* `onKeyUpCapture`: Một phiên bản của `onKeyUp` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): Một hàm [`PointerEvent` handler](#pointerevent-handler). Được kích hoạt khi một element dừng việc capture một pointer.
* `onLostPointerCaptureCapture`: Một phiên bản của `onLostPointerCapture` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): Một hàm [`MouseEvent` handler](#mouseevent-handler). Được kích hoạt khi pointer được nhấn xuống.
* `onMouseDownCapture`: Một phiên bản của `onMouseDown` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): Một hàm [`MouseEvent` handler](#mouseevent-handler). Được kích hoạt khi pointer di chuyển bên trong một element. Không có capture phase. Thay vào đó, `onMouseLeave` và `onMouseEnter` propagate từ element đang rời đi đến element đang được đi vào.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): Một hàm [`MouseEvent` handler](#mouseevent-handler). Được kích hoạt khi con trỏ di chuyển ra ngoài một phần tử. Không có capture phase. Thay vào đó, `onMouseLeave` và `onMouseEnter` lan truyền từ phần tử rời đi đến phần tử được đi vào.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): Một hàm [`MouseEvent` handler](#mouseevent-handler). Được kích hoạt khi con trỏ thay đổi tọa độ.
* `onMouseMoveCapture`: Phiên bản của `onMouseMove` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): Một hàm [`MouseEvent` handler](#mouseevent-handler). Được kích hoạt khi con trỏ di chuyển ra ngoài một phần tử hoặc di chuyển vào một phần tử con.
* `onMouseOutCapture`: Phiên bản của `onMouseOut` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): Một hàm [`MouseEvent` handler](#mouseevent-handler). Được kích hoạt khi con trỏ được thả ra.
* `onMouseUpCapture`: Phiên bản của `onMouseUp` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): Một hàm [`PointerEvent` handler](#pointerevent-handler). Được kích hoạt khi trình duyệt hủy một tương tác con trỏ.
* `onPointerCancelCapture`: Phiên bản của `onPointerCancel` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): Một hàm [`PointerEvent` handler](#pointerevent-handler). Được kích hoạt khi một con trỏ trở nên active.
* `onPointerDownCapture`: Phiên bản của `onPointerDown` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): Một hàm [`PointerEvent` handler](#pointerevent-handler). Được kích hoạt khi con trỏ di chuyển bên trong một phần tử. Không có capture phase. Thay vào đó, `onPointerLeave` và `onPointerEnter` lan truyền từ phần tử rời đi đến phần tử được đi vào.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): Một hàm [`PointerEvent` handler](#pointerevent-handler). Được kích hoạt khi con trỏ di chuyển ra ngoài một phần tử. Không có capture phase. Thay vào đó, `onPointerLeave` và `onPointerEnter` lan truyền từ phần tử rời đi đến phần tử được đi vào.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): Một hàm [`PointerEvent` handler](#pointerevent-handler). Được kích hoạt khi con trỏ thay đổi tọa độ.
* `onPointerMoveCapture`: Phiên bản của `onPointerMove` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): Một hàm [`PointerEvent` handler](#pointerevent-handler). Được kích hoạt khi con trỏ di chuyển ra ngoài một phần tử, khi tương tác con trỏ bị hủy và [một vài lý do khác.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: Phiên bản của `onPointerOut` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): Một hàm [`PointerEvent` handler](#pointerevent-handler). Được kích hoạt khi con trỏ không còn active.
* `onPointerUpCapture`: Phiên bản của `onPointerUp` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): Một hàm [`ClipboardEvent` handler](#clipboardevent-handler). Được kích hoạt khi người dùng cố dán nội dung nào đó từ clipboard.
* `onPasteCapture`: Phiên bản của `onPaste` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi một phần tử đã được cuộn. Event này không bubble.
* `onScrollCapture`: Phiên bản của `onScroll` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt sau khi vùng chọn bên trong một phần tử có thể chỉnh sửa, chẳng hạn như input, thay đổi. React mở rộng event `onSelect` để cũng hoạt động với các phần tử `contentEditable={true}`. Ngoài ra, React mở rộng event này để được kích hoạt đối với vùng chọn trống và khi chỉnh sửa (những thao tác có thể ảnh hưởng đến vùng chọn).
* `onSelectCapture`: Phiên bản của `onSelect` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): Một hàm [`TouchEvent` handler](#touchevent-handler). Được kích hoạt khi trình duyệt hủy một tương tác cảm ứng.
* `onTouchCancelCapture`: Phiên bản của `onTouchCancel` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): Một hàm [`TouchEvent` handler](#touchevent-handler). Được kích hoạt khi một hoặc nhiều điểm chạm bị xóa.
* `onTouchEndCapture`: Phiên bản của `onTouchEnd` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): Một hàm [`TouchEvent` handler](#touchevent-handler). Được kích hoạt khi một hoặc nhiều điểm chạm di chuyển.
* `onTouchMoveCapture`: Phiên bản của `onTouchMove` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): Một hàm [`TouchEvent` handler](#touchevent-handler). Được kích hoạt khi một hoặc nhiều điểm chạm được đặt xuống.
* `onTouchStartCapture`: Phiên bản của `onTouchStart` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): Một hàm [`TransitionEvent` handler](#transitionevent-handler). Được kích hoạt khi một CSS transition hoàn tất.
* `onTransitionEndCapture`: Phiên bản của `onTransitionEnd` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): Một [`WheelEvent` hàm xử lý](#wheelevent-handler). Kích hoạt khi người dùng xoay nút con lăn.
* `onWheelCapture`: Một phiên bản của `onWheel` được kích hoạt trong [giai đoạn capture.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Một chuỗi. Chỉ định rõ ràng role của phần tử cho các công nghệ hỗ trợ.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Một chuỗi. Chỉ định tên slot khi sử dụng shadow DOM. Trong React, một pattern tương đương thường được thực hiện bằng cách truyền JSX dưới dạng props, ví dụ `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): Một boolean hoặc null. Nếu được đặt rõ ràng thành `true` hoặc `false`, bật hoặc tắt tính năng spellcheck.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): Một số. Ghi đè hành vi mặc định của phím Tab. [Tránh sử dụng các giá trị khác ngoài `-1` và `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): Một chuỗi. Chỉ định văn bản tooltip cho phần tử.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): Hoặc `'yes'` hoặc `'no'`. Truyền `'no'` sẽ loại trừ nội dung phần tử khỏi quá trình dịch.Bạn cũng có thể truyền các thuộc tính tùy chỉnh dưới dạng props, ví dụ `mycustomprop="someValue"`. Điều này có thể hữu ích khi tích hợp với các thư viện bên thứ ba. Tên thuộc tính tùy chỉnh phải viết thường và không được bắt đầu bằng `on`. Giá trị sẽ được chuyển đổi thành một chuỗi. Nếu bạn truyền `null` hoặc `undefined`, thuộc tính tùy chỉnh sẽ bị xóa.

Các event này chỉ được kích hoạt cho các phần tử [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form):

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): Một hàm xử lý [`Event` handler](#event-handler). Được kích hoạt khi một form được reset.
* `onResetCapture`: Một phiên bản của `onReset` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): Một hàm xử lý [`Event` handler](#event-handler). Được kích hoạt khi một form được submit.
* `onSubmitCapture`: Một phiên bản của `onSubmit` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)

Các event này chỉ được kích hoạt cho các phần tử [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Không giống như các event của trình duyệt, chúng bubble trong React:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): Một hàm xử lý [`Event` handler](#event-handler). Được kích hoạt khi người dùng cố gắng đóng hộp thoại.
* `onCancelCapture`: Một phiên bản của `onCancel` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): Một hàm xử lý [`Event` handler](#event-handler). Được kích hoạt khi một hộp thoại đã được đóng.
* `onCloseCapture`: Một phiên bản của `onClose` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)

Các event này chỉ được kích hoạt cho các phần tử [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details). Không giống như các event của trình duyệt, chúng bubble trong React:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): Một hàm xử lý [`Event` handler](#event-handler). Được kích hoạt khi người dùng bật hoặc tắt phần details.
* `onToggleCapture`: Một phiên bản của `onToggle` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)

Các event này được kích hoạt cho [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), và các phần tử [SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag). Không giống như các event của trình duyệt, chúng bubble trong React:

* `onLoad`: Một hàm xử lý [`Event` handler](#event-handler). Được kích hoạt khi resource đã tải xong.
* `onLoadCapture`: Một phiên bản của `onLoad` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Một hàm xử lý [`Event` handler](#event-handler). Được kích hoạt khi resource không thể tải.
* `onErrorCapture`: Một phiên bản của `onError` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)

Các event này được kích hoạt cho những resource như [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) và [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). Không giống như các event của trình duyệt, chúng bubble trong React:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi tài nguyên chưa tải hoàn toàn nhưng không phải do lỗi.
* `onAbortCapture`: Phiên bản của `onAbort` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi có đủ dữ liệu để bắt đầu phát, nhưng không đủ để phát đến cuối mà không cần buffering.
* `onCanPlayCapture`: Phiên bản của `onCanPlay` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi có đủ dữ liệu để có khả năng bắt đầu phát mà không cần buffering cho đến cuối.
* `onCanPlayThroughCapture`: Phiên bản của `onCanPlayThrough` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi thời lượng media đã được cập nhật.
* `onDurationChangeCapture`: Phiên bản của `onDurationChange` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi media trở nên trống.
* `onEmptiedCapture`: Phiên bản của `onEmptied` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi trình duyệt gặp media được mã hóa.
* `onEncryptedCapture`: Phiên bản của `onEncrypted` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi quá trình phát dừng vì không còn gì để phát.
* `onEndedCapture`: Phiên bản của `onEnded` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi không thể tải tài nguyên.
* `onErrorCapture`: Phiên bản của `onError` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi frame phát hiện tại đã tải.
* `onLoadedDataCapture`: Phiên bản của `onLoadedData` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi metadata đã tải.
* `onLoadedMetadataCapture`: Phiên bản của `onLoadedMetadata` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi trình duyệt bắt đầu tải tài nguyên.
* `onLoadStartCapture`: Phiên bản của `onLoadStart` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi media bị tạm dừng.
* `onPauseCapture`: Phiên bản của `onPause` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi media không còn bị tạm dừng.
* `onPlayCapture`: Phiên bản của `onPlay` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi media bắt đầu hoặc bắt đầu phát lại.
* `onPlayingCapture`: Phiên bản của `onPlaying` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt định kỳ trong khi tài nguyên đang tải.
* `onProgressCapture`: Phiên bản của `onProgress` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi tốc độ phát thay đổi.
* `onRateChangeCapture`: Phiên bản của `onRateChange` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onResize`: Một hàm [`Event` handler](#event-handler). Được kích hoạt khi kích thước video thay đổi.
* `onResizeCapture`: Phiên bản của `onResize` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi thao tác seek hoàn tất.
* `onSeekedCapture`: Phiên bản của `onSeeked` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi thao tác seek bắt đầu.
* `onSeekingCapture`: Phiên bản của `onSeeking` được kích hoạt trong [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi trình duyệt đang chờ dữ liệu nhưng dữ liệu vẫn không tải.
* `onStalledCapture`: Phiên bản của `onStalled` thtại được kích hoạt trong giai đoạn [capture.](/learn/responding-to-events#capture-phase-events)
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi quá trình tải tài nguyên bị tạm dừng.
* `onSuspendCapture`: Một phiên bản của `onSuspend` được kích hoạt trong giai đoạn [capture.](/learn/responding-to-events#capture-phase-events)
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi thời gian phát hiện tại được cập nhật.
* `onTimeUpdateCapture`: Một phiên bản của `onTimeUpdate` được kích hoạt trong giai đoạn [capture.](/learn/responding-to-events#capture-phase-events)
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi âm lượng thay đổi.
* `onVolumeChangeCapture`: Một phiên bản của `onVolumeChange` được kích hoạt trong giai đoạn [capture.](/learn/responding-to-events#capture-phase-events)
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): Một hàm [`Event` handler](#event-handler). Được kích hoạt khi quá trình phát bị dừng do tạm thời không có dữ liệu.
* `onWaitingCapture`: Một phiên bản của `onWaiting` được kích hoạt trong giai đoạn [capture.](/learn/responding-to-events#capture-phase-events)
#### Các lưu ý {/*common-caveats*/}

- Bạn không thể truyền đồng thời cả `children` và `dangerouslySetInnerHTML`.
- Một số event (chẳng hạn như `onAbort` và `onLoad`) không bubble trong trình duyệt, nhưng lại bubble trong React.

---

### Hàm callback `ref` {/*ref-callback*/}

Thay vì một đối tượng ref (chẳng hạn như đối tượng được trả về bởi [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), bạn có thể truyền một hàm vào thuộc tính `ref`.

```js
<div ref={(node) => {
  console.log('Attached', node);

  return () => {
    console.log('Clean up', node)
  }
}}>
```

[Xem ví dụ sử dụng callback `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

Khi node DOM `<div>` được thêm vào màn hình, React sẽ gọi callback `ref` của bạn với `node` DOM làm đối số. Khi node DOM `<div>` đó bị xóa, React sẽ gọi hàm cleanup được trả về từ callback.

React cũng sẽ gọi callback `ref` của bạn mỗi khi bạn truyền một callback `ref` *khác*. Trong ví dụ trên, `(node) => { ... }` là một hàm khác nhau trong mỗi lần render. Khi component của bạn re-render, hàm *trước đó* sẽ được gọi với `null` làm đối số, còn hàm *tiếp theo* sẽ được gọi với node DOM.

#### Các tham số {/*ref-callback-parameters*/}

* `node`: Một node DOM. React sẽ truyền node DOM cho bạn khi ref được gắn vào. Trừ khi bạn truyền cùng một tham chiếu hàm cho callback `ref` trong mỗi lần render, callback sẽ tạm thời được cleanup rồi tạo lại trong mỗi lần component re-render.

<Note>

#### React 19 bổ sung các hàm cleanup cho callback `ref`. {/*react-19-added-cleanup-functions-for-ref-callbacks*/}

Để duy trì khả năng tương thích ngược, nếu không có hàm cleanup nào được trả về từ callback `ref`, `node` sẽ được gọi với `null` khi `ref` được tách khỏi DOM. Hành vi này sẽ bị loại bỏ trong một phiên bản tương lai.

</Note>

#### Giá trị trả về {/*returns*/}

* **tùy chọn** `cleanup function`: Khi `ref` được tách khỏi DOM, React sẽ gọi hàm cleanup. Nếu callback `ref` không trả về một hàm, React sẽ gọi lại callback với `null` làm đối số khi `ref` bị tách khỏi DOM. Hành vi này sẽ bị loại bỏ trong một phiên bản tương lai.

#### Các lưu ý {/*caveats*/}

* Khi Strict Mode được bật, React sẽ **chạy thêm một chu kỳ setup+cleanup chỉ dành cho development** trước lần setup thực sự đầu tiên. Đây là một bài kiểm tra nhằm đảm bảo logic cleanup của bạn “phản chiếu” logic setup và dừng hoặc hoàn tác bất cứ điều gì mà setup đang thực hiện. Nếu điều này gây ra sự cố, hãy triển khai hàm cleanup.
* Khi bạn truyền một callback `ref` *khác*, React sẽ gọi hàm cleanup của callback *trước đó* nếu có. Nếu không có hàm cleanup nào được định nghĩa, callback `ref` sẽ được gọi với `null` làm đối số. Hàm *tiếp theo* sẽ được gọi với node DOM.

---

### Đối tượng event của React {/*react-event-object*/}

Các event handler của bạn sẽ nhận được một *đối tượng event của React*. Đối tượng này đôi khi còn được gọi là “synthetic event”.

```js
<button onClick={e => {
  console.log(e); // Đối tượng event của React
}} />
```

Đối tượng này tuân theo cùng một tiêu chuẩn như các event DOM nền tảng, nhưng khắc phục một số điểm không nhất quán giữa các trình duyệt.

Một số event của React không ánh xạ trực tiếp với các event native của trình duyệt. Ví dụ, trong `onMouseLeave`, `e.nativeEvent` sẽ trỏ đến một event `mouseout`. Việc ánh xạ cụ thể không thuộc public API và có thể thay đổi trong tương lai. Nếu vì lý do nào đó bạn cần event nền tảng của trình duyệt, hãy đọc nó từ `e.nativeEvent`.

#### Các thuộc tính {/*react-event-object-properties*/}

Các đối tượng event của React triển khai một số thuộc tính [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) tiêu chuẩn:

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): Một boolean. Cho biết event có bubble qua DOM hay không.
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): Một boolean. Cho biết event có thể bị hủy hay không.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): Một node DOM. Trả về node mà handler hiện tại được gắn vào trong cây React.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): Một boolean. Cho biết `preventDefault` đã được gọi hay chưa.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): Một số. Cho biết event hiện đang ở phase nào.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): Một boolean. Cho biết event có được khởi tạo bởi người dùng hay không.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): Một node DOM. Trả về node nơi event xảy ra (có thể là một child ở xa).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): Một số. Trả về thời điểm event xảy ra.

Ngoài ra, các đối tượng event của React cung cấp thuộc tính sau:

* `nativeEvent`: Một [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) DOM. Đối tượng event gốc của trình duyệt.

#### Các phương thức {/*react-event-object-methods*/}

Các đối tượng event của React triển khai một số phương thức [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) tiêu chuẩn:

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): Ngăn hành động mặc định của trình duyệt đối với event.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): Dừng propagation của event qua cây React.

Ngoài ra, các đối tượng event của React cung cấp những phương thức sau:

* `isDefaultPrevented()`: Trả về một giá trị boolean cho biết `preventDefault` đã được gọi hay chưa.
* `isPropagationStopped()`: Trả về một giá trị boolean cho biết `stopPropagation` đã được gọi hay chưa.
* `persist()`: Không được sử dụng với React DOM. Với React Native, hãy gọi phương thức này để đọc các thuộc tính của event sau event đó.
* `isPersistent()`: Không được sử dụng với React DOM. Với React Native, trả về việc `persist` đã được gọi hay chưa.

#### Các lưu ý {/*react-event-object-caveats*/}

* Các giá trị của `currentTarget`, `eventPhase`, `target` và `type` phản ánh các giá trị mà mã React của bạn mong đợi. Bên dưới, React gắn các event handler ở root, nhưng điều này không được phản ánh trong các đối tượng event của React. Ví dụ: `e.currentTarget` có thể không giống với `e.nativeEvent.currentTarget` nền tảng. Đối với các event được polyfill, `e.type` (kiểu event của React) có thể khác với `e.nativeEvent.type` (kiểu nền tảng).

---

### Hàm handler `AnimationEvent` {/*animationevent-handler*/}

Một kiểu event handler cho các event [CSS animation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Các tham số {/*animationevent-handler-parameters*/}

* `e`: Một [đối tượng event của React](#react-event-object) với các thuộc tính [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent) bổ sung sau:
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### Hàm handler `ClipboardEvent` {/*clipboadevent-handler*/}

Một kiểu event handler cho các event [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Các tham số {/*clipboadevent-handler-parameters*/}

* `e`: Một [đối tượng event của React](#react-event-object) với các thuộc tính [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) bổ sung sau:

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### Hàm handler `CompositionEvent` {/*compositionevent-handler*/}

Một kiểu event handler cho các event [input method editor (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor).

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Các tham số {/*compositionevent-handler-parameters*/}

* `e`: Một [React event object](#react-event-object) với các thuộc tính [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) bổ sung sau:
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` hàm xử lý {/*dragevent-handler*/}

Một kiểu hàm xử lý sự kiện cho các sự kiện của [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Drag source
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Drop target
  </div>
</>
```

#### Tham số {/*dragevent-handler-parameters*/}

* `e`: Một [React event object](#react-event-object) với các thuộc tính [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) bổ sung sau:
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  Nó cũng bao gồm các thuộc tính [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) được kế thừa:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent` hàm xử lý {/*focusevent-handler*/}

Một kiểu hàm xử lý sự kiện cho các sự kiện focus.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[Xem một ví dụ.](#handling-focus-events)

#### Tham số {/*focusevent-handler-parameters*/}

* `e`: Một [React event object](#react-event-object) với các thuộc tính [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) bổ sung sau:
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event` hàm xử lý {/*event-handler*/}

Một kiểu hàm xử lý sự kiện cho các sự kiện tổng quát.

#### Tham số {/*event-handler-parameters*/}

* `e`: Một [React event object](#react-event-object) không có thuộc tính bổ sung.

---

### `InputEvent` hàm xử lý {/*inputevent-handler*/}

Một kiểu hàm xử lý sự kiện cho sự kiện `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Tham số {/*inputevent-handler-parameters*/}

* `e`: Một [React event object](#react-event-object) với các thuộc tính [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) bổ sung sau:
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` hàm xử lý {/*keyboardevent-handler*/}

Một kiểu hàm xử lý sự kiện cho các sự kiện bàn phím.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[Xem một ví dụ.](#handling-keyboard-events)

#### Tham số {/*keyboardevent-handler-parameters*/}

* `e`: Một [React event object](#react-event-object) với các thuộc tính [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) bổ sung sau:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent` hàm xử lý {/*mouseevent-handler*/}

Một kiểu hàm xử lý sự kiện cho các sự kiện chuột.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[Xem một ví dụ.](#handling-mouse-events)

#### Tham số {/*mouseevent-handler-parameters*/}

* `e`: Một [React event object](#react-event-object) với các thuộc tính [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) bổ sung:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent` hàm xử lý {/*pointerevent-handler*/}

Một kiểu trình xử lý sự kiện cho [pointer events.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[Xem một ví dụ.](#handling-pointer-events)

#### Tham số {/*pointerevent-handler-parameters*/}

* `e`: Một [React event object](#react-event-object) với các thuộc tính [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) bổ sung:
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  Nó cũng bao gồm các thuộc tính [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) được kế thừa:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent` hàm xử lý {/*touchevent-handler*/}

Một kiểu trình xử lý sự kiện cho [touch events.](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Tham số {/*touchevent-handler-parameters*/}

* `e`: Một [React event object](#react-event-object) với các thuộc tính [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) bổ sung:
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` hàm xử lý {/*transitionevent-handler*/}

Một kiểu trình xử lý sự kiện cho các sự kiện chuyển tiếp CSS.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Tham số {/*transitionevent-handler-parameters*/}

* `e`: Một [đối tượng event của React](#react-event-object) với các thuộc tính [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent) bổ sung:
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` hàm handler {/*uievent-handler*/}

Một kiểu event handler dành cho các UI event tổng quát.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Tham số {/*uievent-handler-parameters*/}

* `e`: Một [đối tượng event của React](#react-event-object) với các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) bổ sung:
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent` hàm handler {/*wheelevent-handler*/}

Một kiểu event handler dành cho event `onWheel`.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### Tham số {/*wheelevent-handler-parameters*/}

* `e`: Một [đối tượng event của React](#react-event-object) với các thuộc tính [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent) bổ sung:
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  Nó cũng bao gồm các thuộc tính [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) được kế thừa:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Nó cũng bao gồm các thuộc tính [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) được kế thừa:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Cách sử dụng {/*usage*/}

### Áp dụng CSS style {/*applying-css-styles*/}

Trong React, bạn chỉ định một CSS class bằng [`className`.](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) Nó hoạt động giống thuộc tính `class` trong HTML:

```js
<img className="avatar" />
```

Sau đó, bạn viết các CSS rule cho class đó trong một CSS file riêng:

```css
/* Trong CSS của bạn */
.avatar {
  border-radius: 50%;
}
```

React không quy định cách bạn thêm CSS file. Trong trường hợp đơn giản nhất, bạn sẽ thêm một thẻ [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) vào HTML. Nếu sử dụng build tool hoặc framework, hãy xem tài liệu của công cụ đó để biết cách thêm CSS file vào project.

Đôi khi, các style value phụ thuộc vào dữ liệu. Hãy sử dụng thuộc tính `style` để truyền một số style một cách động:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


Trong ví dụ trên, `style={{}}` không phải là cú pháp đặc biệt mà là một `{}` object thông thường bên trong `style={ }` [dấu ngoặc nhọn JSX.](/learn/javascript-in-jsx-with-curly-braces) Chúng tôi khuyến nghị chỉ sử dụng thuộc tính `style` khi style của bạn phụ thuộc vào các biến JavaScript.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### Làm thế nào để áp dụng nhiều CSS class có điều kiện? {/*how-to-apply-multiple-css-classes-conditionally*/}

Để áp dụng các CSS class có điều kiện, bạn cần tự tạo chuỗi `className` bằng JavaScript.

Ví dụ, `className={'row ' + (isSelected ? 'selected': '')}` sẽ tạo ra `className="row"` hoặc `className="row selected"`, tùy thuộc vào việc `isSelected` có phải là `true` hay không.

Để dễ đọc hơn, bạn có thể sử dụng một helper library nhỏ như [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

Cách này đặc biệt tiện lợi nếu bạn có nhiều class có điều kiện:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Thao tác với DOM node bằng ref {/*manipulating-a-dom-node-with-a-ref*/}

Đôi khi, bạn cần lấy DOM node trong browser tương ứng với một tag trong JSX. Ví dụ, nếu muốn focus một `<input>` khi nhấp vào button, bạn cần gọi [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) trên DOM node `<input>` trong browser.

Để lấy DOM node trong browser của một tag, hãy [khai báo một ref](/reference/react/useRef) và truyền nó làm thuộc tính `ref` cho tag đó:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React sẽ đặt DOM node vào `inputRef.current` sau khi node được render lên màn hình.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Đọc thêm về [thao tác DOM bằng ref](/learn/manipulating-the-dom-with-refs) và [xem thêm các ví dụ.](/reference/react/useRef#usage)

Trong các trường hợp sử dụng nâng cao hơn, thuộc tính `ref` cũng chấp nhận một [callback function.](#ref-callback)

---

### Thiết lập inner HTML một cách nguy hiểm {/*dangerously-setting-the-inner-html*/}

Bạn có thể truyền một chuỗi HTML thô hoặc một giá trị [`TrustedHTML`](https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML) cho một element như sau:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**Điều này nguy hiểm. Cũng như thuộc tính [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) DOM nền tảng, bạn phải hết sức thận trọng! Trừ khi markup đến từ một nguồn hoàn toàn đáng tin cậy, cách này rất dễ tạo ra lỗ hổng [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting).**

Nếu website của bạn thực thi [Trusted Types](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API), hãy truyền một giá trị `TrustedHTML` được tạo bởi security policy của bạn vào `__html`. React truyền giá trị này cho browser mà không chuyển đổi thành string, cho phép browser xác thực giá trị đó. Tuy nhiên, policy của bạn vẫn phải đảm bảo mọi input được dùng để tạo giá trị đều đáng tin cậy và đã được sanitize.

Ví dụ, nếu sử dụng một Markdown library chuyển Markdown thành HTML, bạn tin rằng parser của library đó không có bug và người dùng chỉ nhìn thấy input của chính họ, bạn có thể hiển thị HTML kết quả như sau:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // Điều này CHỈ an toàn vì HTML output
  // được hiển thị cho cùng một người dùng, và vì bạn
  // tin rằng Markdown parser này không có bug.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
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

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

Đối tượng `{__html}` nên được tạo càng gần nơi HTML được tạo càng tốt, như ví dụ trên thực hiện trong hàm `renderMarkdownToHTML`. Điều này đảm bảo rằng mọi HTML thô được sử dụng trong code của bạn đều được đánh dấu rõ ràng, và chỉ những biến mà bạn dự kiến chứa HTML mới được truyền vào `dangerouslySetInnerHTML`. Không nên tạo đối tượng inline như `<div dangerouslySetInnerHTML={{__html: markup}} />`.

Để thấy việc render HTML tùy ý nguy hiểm như thế nào, hãy thay code trên bằng đoạn sau:

```js {1-4,7,8}
const post = {
  // Hãy tưởng tượng nội dung này được lưu trong database.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 LỖ HỔNG BẢO MẬT: truyền dữ liệu đầu vào không đáng tin cậy vào dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

Code được nhúng trong HTML sẽ chạy. Hacker có thể lợi dụng lỗ hổng bảo mật này để đánh cắp thông tin người dùng hoặc thực hiện hành động thay mặt họ. **Chỉ sử dụng `dangerouslySetInnerHTML` với dữ liệu đáng tin cậy và đã được sanitize.**

---

### Xử lý sự kiện chuột {/*handling-mouse-events*/}

Ví dụ này minh họa một số [sự kiện chuột](#mouseevent-handler) phổ biến và thời điểm chúng được kích hoạt.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Xử lý sự kiện pointer {/*handling-pointer-events*/}

Ví dụ này minh họa một số [sự kiện pointer](#pointerevent-handler) phổ biến và thời điểm chúng được kích hoạt.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Xử lý sự kiện focus {/*handling-focus-events*/}

Trong React, [các sự kiện focus](#focusevent-handler) bubble. Bạn có thể sử dụng `currentTarget` và `relatedTarget` để phân biệt liệu các sự kiện focus hoặc blur có bắt nguồn từ bên ngoài phần tử cha hay không. Ví dụ này minh họa cách phát hiện khi focus vào phần tử con, focus vào phần tử cha, cũng như cách phát hiện focus đi vào hoặc rời khỏi toàn bộ subtree.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
    // Không kích hoạt khi chuyển focus giữa các child
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
    // Không kích hoạt khi chuyển focus giữa các child
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Xử lý sự kiện bàn phím {/*handling-keyboard-events*/}

Ví dụ này minh họa một số [sự kiện bàn phím](#keyboardevent-handler) phổ biến và thời điểm chúng được kích hoạt.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
