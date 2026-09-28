---
title: Cảnh báo về Props đặc biệt
---

Hầu hết props trên một phần tử JSX được truyền cho component, tuy nhiên, có hai props đặc biệt (`ref` và `key`) được React sử dụng, nên không được chuyển tiếp đến component.

Ví dụ, bạn không thể đọc `props.key` từ một component. Nếu cần truy cập cùng giá trị đó trong component con, bạn nên truyền nó dưới dạng một prop khác (ví dụ: `<ListItemWrapper key={result.id} id={result.id} />` và đọc `props.id`). Mặc dù điều này có vẻ dư thừa, việc tách biệt logic của ứng dụng khỏi các gợi ý dành cho React là rất quan trọng.