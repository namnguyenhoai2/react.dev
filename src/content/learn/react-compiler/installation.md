---
title: Cài đặt
---

<Intro>
Hướng dẫn này sẽ giúp bạn cài đặt và cấu hình React Compiler trong ứng dụng React của mình.
</Intro>

<YouWillLearn>

* Cách cài đặt React Compiler
* Cấu hình cơ bản cho các build tool khác nhau
* Cách xác minh thiết lập của bạn đang hoạt động

</YouWillLearn>

## Điều kiện tiên quyết {/*prerequisites*/}

React Compiler được thiết kế để hoạt động tốt nhất với React 19, nhưng cũng hỗ trợ React 17 và 18. Tìm hiểu thêm về [khả năng tương thích với phiên bản React](/reference/react-compiler/target).

## Cài đặt {/*installation*/}

Cài đặt React Compiler dưới dạng `devDependency`:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

Hoặc với Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@latest
</TerminalBlock>

Hoặc với pnpm:

<TerminalBlock>
pnpm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

## Thiết lập cơ bản {/*basic-setup*/}

React Compiler được thiết kế để hoạt động mặc định mà không cần cấu hình. Tuy nhiên, nếu bạn cần cấu hình trong các trường hợp đặc biệt (ví dụ: nhắm đến các phiên bản React thấp hơn 19), hãy tham khảo [tài liệu tham khảo về các tùy chọn của compiler](/reference/react-compiler/configuration).

Quy trình thiết lập phụ thuộc vào build tool của bạn. React Compiler bao gồm một Babel plugin tích hợp với build pipeline của bạn.

<Pitfall>
React Compiler phải chạy **đầu tiên** trong Babel plugin pipeline của bạn. Compiler cần thông tin source ban đầu để phân tích chính xác, vì vậy nó phải xử lý code của bạn trước các phép biến đổi khác.
</Pitfall>

### Babel {/*babel*/}

Tạo hoặc cập nhật `babel.config.js` của bạn:

```js {3}
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // phải chạy trước!
    // ... các plugin khác
  ],
  // ... cấu hình khác
};
```

### Vite {/*vite*/}

Nếu bạn sử dụng Vite với phiên bản 6.0.0 trở lên của `@vitejs/plugin-react`, bạn có thể sử dụng `reactCompilerPreset`:

<TerminalBlock>
npm install -D @rolldown/plugin-babel
</TerminalBlock>

```js {3-4,9-11}
// vite.config.js
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
  ],
});
```

<Note>
Trong `@vitejs/plugin-react@6.0.0`, tùy chọn Babel inline đã bị loại bỏ. Nếu bạn đang sử dụng phiên bản cũ hơn, bạn có thể dùng:

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```
</Note>

Ngoài ra, bạn có thể sử dụng trực tiếp Babel plugin với `@rolldown/plugin-babel`:

```js {3,9}
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    babel({
      plugins: ['babel-plugin-react-compiler'],
    }),
  ],
});
```

### Next.js {/*usage-with-nextjs*/}

Vui lòng tham khảo [tài liệu Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) để biết thêm thông tin.

### React Router {/*usage-with-react-router*/}
Cài đặt `vite-plugin-babel`, rồi thêm Babel plugin của compiler vào đó:

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {3-4,16}
// vite.config.js
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // nếu bạn dùng TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

Một webpack loader do cộng đồng phát triển [hiện đã có tại đây](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Vui lòng tham khảo [tài liệu Expo](https://docs.expo.dev/guides/react-compiler/) để bật và sử dụng React Compiler trong các ứng dụng Expo.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native sử dụng Babel thông qua Metro, vì vậy hãy tham khảo phần [Sử dụng với Babel](#babel) để biết hướng dẫn cài đặt.

### Rspack {/*usage-with-rspack*/}

Vui lòng tham khảo [tài liệu Rspack](https://rspack.dev/guide/tech/react#react-compiler) để bật và sử dụng React Compiler trong các ứng dụng Rspack.

### Rsbuild {/*usage-with-rsbuild*/}

Vui lòng tham khảo [tài liệu Rsbuild](https://rsbuild.dev/guide/framework/react#react-compiler) để bật và sử dụng React Compiler trong các ứng dụng Rsbuild.


## Tích hợp ESLint {/*eslint-integration*/}

React Compiler bao gồm một ESLint rule giúp xác định code không thể được tối ưu hóa. Khi ESLint rule báo lỗi, điều đó có nghĩa là compiler sẽ bỏ qua việc tối ưu hóa component hoặc hook cụ thể đó. Điều này an toàn: compiler vẫn tiếp tục tối ưu hóa các phần khác trong codebase của bạn. Bạn không cần sửa ngay tất cả các vi phạm. Hãy xử lý chúng theo tiến độ của riêng bạn để dần tăng số lượng component được tối ưu hóa.

Cài đặt ESLint plugin:

<TerminalBlock>
npm install -D eslint-plugin-react-hooks@latest
</TerminalBlock>

Nếu bạn chưa cấu hình eslint-plugin-react-hooks, hãy làm theo [hướng dẫn cài đặt trong readme](https://github.com/react/react/blob/main/packages/eslint-plugin-react-hooks/README.md#installation). Các rule của compiler có trong `recommended-latest` preset.

ESLint rule sẽ:
- Xác định các vi phạm [Rules of React](/reference/rules)
- Cho biết component nào không thể được tối ưu hóa
- Cung cấp thông báo lỗi hữu ích để khắc phục vấn đề

## Xác minh thiết lập của bạn {/*verify-your-setup*/}

Sau khi cài đặt, hãy xác minh React Compiler đang hoạt động chính xác.

### Kiểm tra React DevTools {/*check-react-devtools*/}

Các component được React Compiler tối ưu hóa sẽ hiển thị huy hiệu "Memo ✨" trong React DevTools:

1. Cài đặt tiện ích mở rộng trình duyệt [React Developer Tools](/learn/react-developer-tools)
2. Mở ứng dụng của bạn ở development mode
3. Mở React DevTools
4. Tìm emoji ✨ bên cạnh tên component

Nếu compiler đang hoạt động:
- Các component sẽ hiển thị huy hiệu "Memo ✨" trong React DevTools
- Các phép tính tốn kém sẽ được tự động memoize
- Không cần `useMemo` thủ công

### Kiểm tra output của build {/*check-build-output*/}

Bạn cũng có thể xác minh compiler đang chạy bằng cách kiểm tra output của build. Code đã compile sẽ bao gồm logic memoization tự động do compiler tự động thêm vào.

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```

## Khắc phục sự cố {/*troubleshooting*/}

### Loại trừ các component cụ thể {/*opting-out-specific-components*/}

Nếu một component gây ra sự cố sau khi compile, bạn có thể tạm thời loại trừ component đó bằng directive `"use no memo"`:

```js
function ProblematicComponent() {
  "use no memo";
  // Code component ở đây
}
```

Điều này yêu cầu compiler bỏ qua việc tối ưu hóa component cụ thể này. Bạn nên khắc phục vấn đề nền tảng và xóa directive sau khi vấn đề được giải quyết.

Để được trợ giúp thêm về khắc phục sự cố, hãy xem [hướng dẫn debugging](/learn/react-compiler/debugging).

## Các bước tiếp theo {/*next-steps*/}

Bây giờ bạn đã cài đặt React Compiler, hãy tìm hiểu thêm về:

- [khả năng tương thích với phiên bản React](/reference/react-compiler/target) cho React 17 và 18
- [Các tùy chọn cấu hình](/reference/react-compiler/configuration) để tùy chỉnh compiler
- [Các chiến lược áp dụng từng bước](/learn/react-compiler/incremental-adoption) cho các codebase hiện có
- [Các kỹ thuật debugging](/learn/react-compiler/debugging) để khắc phục sự cố
- [Hướng dẫn Compiling Libraries](/reference/react-compiler/compiling-libraries) để compile thư viện React của bạn
