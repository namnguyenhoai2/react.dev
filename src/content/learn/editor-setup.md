---
title: Thiết lập Editor
---

<Intro>

Một editor được cấu hình đúng cách có thể giúp code dễ đọc hơn và viết nhanh hơn. Thậm chí, editor còn có thể giúp bạn phát hiện lỗi ngay khi đang viết! Nếu đây là lần đầu bạn thiết lập editor hoặc bạn muốn cải thiện editor hiện tại, chúng tôi có một vài đề xuất.

</Intro>

<YouWillLearn>

* Các editor phổ biến nhất
* Cách tự động format code

</YouWillLearn>

## Editor của bạn {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) là một trong những editor phổ biến nhất hiện nay. Editor này có marketplace extension lớn và tích hợp tốt với các dịch vụ phổ biến như GitHub. Hầu hết các tính năng được liệt kê dưới đây cũng có thể được thêm vào VS Code dưới dạng extension, giúp editor này có khả năng tùy chỉnh rất cao!

Các text editor phổ biến khác được sử dụng trong cộng đồng React gồm:

* [WebStorm](https://www.jetbrains.com/webstorm/) là một integrated development environment được thiết kế riêng cho JavaScript.
* [Sublime Text](https://www.sublimetext.com/) hỗ trợ JSX và TypeScript, có sẵn [syntax highlighting](https://stackoverflow.com/a/70960574/458193) và autocomplete.
* [Vim](https://www.vim.org/) là một text editor có khả năng tùy chỉnh cao, được xây dựng để giúp việc tạo và chỉnh sửa mọi loại văn bản trở nên hiệu quả hơn. Editor này được tích hợp dưới tên "vi" trong hầu hết các hệ thống UNIX và Apple OS X.

## Các tính năng text editor được đề xuất {/*recommended-text-editor-features*/}

Một số editor được tích hợp sẵn các tính năng này, nhưng một số khác có thể yêu cầu thêm extension. Hãy kiểm tra xem editor bạn chọn hỗ trợ những gì để chắc chắn!

### Linting {/*linting*/}

Các code linter tìm ra vấn đề trong code khi bạn viết, giúp bạn sửa chúng sớm. [ESLint](https://eslint.org/) là một linter mã nguồn mở phổ biến cho JavaScript.

* [Cài đặt ESLint với cấu hình được đề xuất cho React](https://www.npmjs.com/package/eslint-config-react-app) (hãy chắc chắn rằng bạn đã [cài đặt Node!](https://nodejs.org/en/download/current/))
* [Tích hợp ESLint vào VSCode bằng extension chính thức](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Hãy đảm bảo bạn đã bật tất cả các quy tắc [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) cho project của mình.** Chúng rất cần thiết và giúp phát hiện sớm những lỗi nghiêm trọng nhất. Preset [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) được đề xuất đã bao gồm chúng.

### Formatting {/*formatting*/}

Điều cuối cùng bạn muốn làm khi chia sẻ code với một contributor khác là tranh luận về [tabs hay spaces](https://www.google.com/search?q=tabs+vs+spaces)! May mắn là, [Prettier](https://prettier.io/) sẽ dọn dẹp code của bạn bằng cách format lại để tuân theo các quy tắc có sẵn và có thể tùy chỉnh. Hãy chạy Prettier, tất cả tabs của bạn sẽ được chuyển thành spaces—đồng thời indentation, dấu ngoặc kép, v.v. cũng sẽ được thay đổi để tuân theo cấu hình. Trong thiết lập lý tưởng, Prettier sẽ chạy khi bạn lưu file, nhanh chóng thực hiện những chỉnh sửa này cho bạn.

Bạn có thể cài đặt [extension Prettier trong VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) bằng các bước sau:

1. Khởi chạy VS Code
2. Sử dụng Quick Open (nhấn Ctrl/Cmd+P)
3. Dán `ext install esbenp.prettier-vscode`
4. Nhấn Enter

#### Formatting khi lưu {/*formatting-on-save*/}

Lý tưởng nhất là bạn nên format code mỗi khi lưu. VS Code có các setting cho việc này!

1. Trong VS Code, nhấn `CTRL/CMD + SHIFT + P`.
2. Nhập "settings"
3. Nhấn Enter
4. Trong thanh tìm kiếm, nhập "format on save"
5. Hãy chắc chắn rằng tùy chọn "format on save" đã được chọn!

> Nếu preset ESLint của bạn có các quy tắc formatting, chúng có thể xung đột với Prettier. Chúng tôi khuyến nghị vô hiệu hóa tất cả các quy tắc formatting trong preset ESLint bằng cách sử dụng [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) để ESLint *chỉ* được sử dụng nhằm phát hiện các lỗi logic. Nếu bạn muốn đảm bảo các file được format trước khi một pull request được merge, hãy sử dụng [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) cho continuous integration của bạn.