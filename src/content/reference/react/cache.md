---
title: bộ nhớ đệm
---

<RSC>

`cache` chỉ được sử dụng với [React Server Components](/reference/rsc/server-components).

</RSC>

<Intro>

`cache` cho phép bạn lưu vào bộ nhớ đệm kết quả của một lần tìm nạp dữ liệu hoặc phép tính.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## Tài liệu tham khảo {/*reference*/}

### `cache(fn)` {/*cache*/}

Gọi `cache` bên ngoài mọi component để tạo một phiên bản của hàm có bộ nhớ đệm.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

Khi `getMetrics` được gọi lần đầu với `data`, `getMetrics` sẽ gọi `calculateMetrics(data)` và lưu kết quả vào bộ nhớ đệm. Nếu `getMetrics` được gọi lại với cùng `data`, hàm sẽ trả về kết quả đã được lưu trong bộ nhớ đệm thay vì gọi lại `calculateMetrics(data)`.

[Xem thêm ví dụ bên dưới.](#usage)

#### Tham số {/*parameters*/}

- `fn`: Hàm mà bạn muốn lưu kết quả vào bộ nhớ đệm. `fn` có thể nhận bất kỳ đối số nào và trả về bất kỳ giá trị nào.

#### Giá trị trả về {/*returns*/}

`cache` trả về một phiên bản đã lưu trong bộ nhớ đệm của `fn` với cùng type signature. Trong quá trình này, hàm không gọi `fn`.

Khi gọi `cachedFn` với các đối số đã cho, trước tiên hàm kiểm tra xem kết quả đã lưu trong bộ nhớ đệm có tồn tại hay không. Nếu có, hàm trả về kết quả đó. Nếu không, hàm gọi `fn` với các đối số, lưu kết quả vào bộ nhớ đệm rồi trả về kết quả. `fn` chỉ được gọi khi xảy ra cache miss.

<Note>

Việc tối ưu hóa bằng cách lưu các giá trị trả về dựa trên các đầu vào được gọi là [_memoization_](https://en.wikipedia.org/wiki/Memoization). Chúng ta gọi hàm được trả về từ `cache` là memoized function.

</Note>

#### Lưu ý {/*caveats*/}

- React sẽ vô hiệu hóa bộ nhớ đệm cho tất cả memoized function sau mỗi server request.
- Mỗi lần gọi `cache` sẽ tạo một hàm mới. Điều này có nghĩa là việc gọi `cache` nhiều lần với cùng một hàm sẽ trả về các memoized function khác nhau và không dùng chung một bộ nhớ đệm.
- `cachedFn` cũng sẽ lưu các lỗi vào bộ nhớ đệm. Nếu `fn` throw một lỗi với một số đối số nhất định, lỗi đó sẽ được lưu vào bộ nhớ đệm và chính lỗi đó sẽ được throw lại khi `cachedFn` được gọi với các đối số tương tự.
- `cache` chỉ được sử dụng trong [Server Components](/reference/rsc/server-components).

---

## Cách sử dụng {/*usage*/}

### Lưu một phép tính tốn kém vào bộ nhớ đệm {/*cache-expensive-computation*/}

Sử dụng `cache` để bỏ qua các công việc trùng lặp.

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

Nếu cùng một đối tượng `user` được render trong cả `Profile` và `TeamReport`, hai component có thể dùng chung công việc và chỉ gọi `calculateUserMetrics` một lần cho `user` đó.

Giả sử `Profile` được render trước. Nó sẽ gọi <CodeStep step={1}>`getUserMetrics`</CodeStep>, rồi kiểm tra xem có kết quả nào được lưu trong bộ nhớ đệm hay không. Vì đây là lần đầu `getUserMetrics` được gọi với `user` đó, sẽ xảy ra cache miss. Sau đó, `getUserMetrics` sẽ gọi `calculateUserMetrics` với `user` đó và ghi kết quả vào bộ nhớ đệm.

Khi `TeamReport` render danh sách `users` và gặp cùng đối tượng `user`, nó sẽ gọi <CodeStep step={2}>`getUserMetrics`</CodeStep> và đọc kết quả từ bộ nhớ đệm.

Nếu `calculateUserMetrics` có thể bị hủy bằng cách truyền một [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), bạn có thể sử dụng [`cacheSignal()`](/reference/react/cacheSignal) để hủy phép tính tốn kém nếu React đã hoàn tất việc render. `calculateUserMetrics` có thể đã tự xử lý việc hủy bằng cách sử dụng trực tiếp `cacheSignal`.

<Pitfall>

##### Việc gọi các memoized function khác nhau sẽ đọc từ các bộ nhớ đệm khác nhau. {/*pitfall-different-memoized-functions*/}

Để truy cập cùng một bộ nhớ đệm, các component phải gọi cùng một memoized function.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Không đúng: Gọi `cache` trong component tạo `getWeekReport` mới cho mỗi lần render
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Không đúng: `getWeekReport` chỉ có thể được truy cập trong component `Precipitation`.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

Trong ví dụ trên, <CodeStep step={2}>`Precipitation`</CodeStep> và <CodeStep step={1}>`Temperature`</CodeStep> lần lượt gọi `cache` để tạo một memoized function mới với bộ nhớ đệm riêng. Nếu cả hai component render cùng một `cityData`, chúng sẽ thực hiện công việc trùng lặp để gọi `calculateWeekReport`.

Ngoài ra, `Temperature` tạo một <CodeStep step={1}>memoized function mới</CodeStep> mỗi khi component được render, nên không cho phép chia sẻ bộ nhớ đệm.

Để tối đa hóa số lần cache hit và giảm công việc, hai component nên gọi cùng một memoized function để truy cập cùng một bộ nhớ đệm. Thay vào đó, hãy định nghĩa memoized function trong một module riêng để có thể [`import`-ed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) giữa các component.

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```
Ở đây, cả hai component đều gọi <CodeStep step={3}>cùng một memoized function</CodeStep> được export từ `./getWeekReport.js` để đọc và ghi vào cùng một bộ nhớ đệm.
</Pitfall>

### Chia sẻ snapshot của dữ liệu {/*take-and-share-snapshot-of-data*/}

Để chia sẻ một snapshot của dữ liệu giữa các component, hãy gọi `cache` với một hàm tìm nạp dữ liệu như `fetch`. Khi nhiều component thực hiện cùng một lần tìm nạp dữ liệu, chỉ một request được gửi đi, còn dữ liệu trả về sẽ được lưu trong bộ nhớ đệm và chia sẻ giữa các component. Tất cả component đều tham chiếu đến cùng một snapshot của dữ liệu trong suốt quá trình server render.

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

Nếu `AnimatedWeatherCard` và `MinimalWeatherCard` cùng render cho một <CodeStep step={1}>city</CodeStep>, chúng sẽ nhận được cùng một snapshot của dữ liệu từ <CodeStep step={2}>memoized function</CodeStep>.

Nếu `AnimatedWeatherCard` và `MinimalWeatherCard` truyền các đối số <CodeStep step={1}>city</CodeStep> khác nhau cho <CodeStep step={2}>`getTemperature`</CodeStep>, thì `fetchTemperature` sẽ được gọi hai lần và mỗi vị trí gọi sẽ nhận được dữ liệu khác nhau.

<CodeStep step={1}>city</CodeStep> đóng vai trò là cache key.

<Note>

<CodeStep step={3}>Asynchronous rendering</CodeStep> chỉ được hỗ trợ cho Server Components.

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

Để render các component sử dụng dữ liệu bất đồng bộ trong Client Components, hãy xem [`use()` documentation](/reference/react/use).

</Note>

### Preload dữ liệu {/*preload-data*/}

Bằng cách lưu một lần tìm nạp dữ liệu chạy lâu vào bộ nhớ đệm, bạn có thể khởi chạy công việc bất đồng bộ trước khi render component.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
});

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Đúng: bắt đầu lấy dữ liệu người dùng
  getUser(id);
  // ... một vài tác vụ tính toán
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

Khi render `Page`, component gọi <CodeStep step={1}>`getUser`</CodeStep>, nhưng lưu ý rằng nó không sử dụng dữ liệu được trả về. Lời gọi <CodeStep step={1}>`getUser`</CodeStep> sớm này khởi chạy truy vấn cơ sở dữ liệu bất đồng bộ trong khi `Page` đang thực hiện các phép tính khác và render các component con.

Khi render `Profile`, chúng ta lại gọi <CodeStep step={2}>`getUser`</CodeStep>. Nếu lời gọi <CodeStep step={1}>`getUser`</CodeStep> ban đầu đã trả về và lưu dữ liệu người dùng vào bộ nhớ đệm, khi `Profile` <CodeStep step={2}>asks and waits for this data</CodeStep>, nó có thể chỉ cần đọc từ bộ nhớ đệm mà không cần thêm một remote procedure call. Nếu <CodeStep step={1}> initial data request</CodeStep> chưa hoàn tất, việc preload dữ liệu theo cách này sẽ giảm độ trễ khi tìm nạp dữ liệu.

<DeepDive>

#### Lưu công việc bất đồng bộ vào bộ nhớ đệm {/*caching-asynchronous-work*/}

Khi đánh giá một [asynchronous function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), bạn sẽ nhận được một [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) cho công việc đó. Promise lưu trạng thái của công việc (_pending_, _fulfilled_, _failed_) và kết quả cuối cùng sau khi được settle.

Trong ví dụ này, asynchronous function <CodeStep step={1}>`fetchData`</CodeStep> trả về một promise đang chờ `fetch`.

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... một vài tác vụ tính toán
  await getData();
  // ...
}
```

Khi gọi <CodeStep step={2}>`getData`</CodeStep> lần đầu, promise được trả về từ <CodeStep step={1}>`fetchData`</CodeStep> sẽ được lưu vào bộ nhớ đệm. Các lần tra cứu tiếp theo sẽ trả về cùng promise đó.

Lưu ý rằng lệnh gọi <CodeStep step={2}>`getData`</CodeStep> đầu tiên không `await`, trong khi <CodeStep step={3}>lệnh gọi thứ hai</CodeStep> thì có. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) là một toán tử JavaScript sẽ chờ và trả về kết quả đã hoàn tất của promise. Lệnh gọi <CodeStep step={2}>`getData`</CodeStep> đầu tiên chỉ khởi tạo `fetch` để lưu vào cache promise cho <CodeStep step={3}>`getData`</CodeStep> thứ hai tra cứu.

Nếu đến <CodeStep step={3}>lệnh gọi thứ hai</CodeStep> mà promise vẫn _pending_, thì `await` sẽ tạm dừng để chờ kết quả. Điểm tối ưu là trong khi chờ `fetch`, React có thể tiếp tục thực hiện công việc tính toán, nhờ đó giảm thời gian chờ cho <CodeStep step={3}>lệnh gọi thứ hai</CodeStep>.

Nếu promise đã hoàn tất, dù là do lỗi hay cho kết quả _fulfilled_, `await` sẽ trả về giá trị đó ngay lập tức. Trong cả hai trường hợp, hiệu năng đều được cải thiện.
</DeepDive>

<Pitfall>

##### Gọi một hàm đã memoize bên ngoài component sẽ không sử dụng cache. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Không đúng: Gọi hàm đã memoize bên ngoài component sẽ không được memoize.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Đúng: `getUser` sẽ được memoize.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React chỉ cung cấp quyền truy cập cache cho hàm đã memoize trong một component. Khi gọi <CodeStep step={1}>`getUser`</CodeStep> bên ngoài component, hàm vẫn được thực thi nhưng không đọc hoặc cập nhật cache.

Điều này là do quyền truy cập cache được cung cấp thông qua một [context](/learn/passing-data-deeply-with-context) chỉ có thể truy cập từ một component.

</Pitfall>

<DeepDive>

#### Khi nào nên sử dụng `cache`, [`memo`](/reference/react/memo), hoặc [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

Tất cả API được đề cập đều hỗ trợ memoization, nhưng khác nhau ở đối tượng mà chúng được thiết kế để memoize, đối tượng có thể truy cập cache và thời điểm cache của chúng bị vô hiệu hóa.

#### `useMemo` {/*deep-dive-use-memo*/}

Nhìn chung, bạn nên sử dụng [`useMemo`](/reference/react/useMemo) để cache một phép tính tốn kém trong Client Component qua các lần render. Ví dụ, để memoize việc chuyển đổi dữ liệu bên trong một component.

```jsx {expectedErrors: {'react-compiler': [4]}} {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```
Trong ví dụ này, `App` render hai `WeatherReport`s với cùng một record. Mặc dù cả hai component đều thực hiện cùng một công việc, chúng không thể dùng chung công việc đó. Cache của `useMemo`'s chỉ nằm cục bộ trong component.

Tuy nhiên, `useMemo` đảm bảo rằng nếu `App` render lại và object `record` không thay đổi, mỗi instance của component sẽ bỏ qua công việc và sử dụng giá trị đã memoize của `avgTemp`. `useMemo` sẽ chỉ cache phép tính gần nhất của `avgTemp` với các dependency đã cho.

#### `cache` {/*deep-dive-cache*/}

Nhìn chung, bạn nên sử dụng `cache` trong Server Components để memoize công việc có thể được chia sẻ giữa các component.

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```
Viết lại ví dụ trước để sử dụng `cache`, trong trường hợp này <CodeStep step={3}>instance thứ hai của `WeatherReport`</CodeStep> sẽ có thể bỏ qua công việc trùng lặp và đọc từ cùng một cache với <CodeStep step={1}>instance `WeatherReport` đầu tiên</CodeStep>. Một điểm khác so với ví dụ trước là `cache` cũng được khuyến nghị để <CodeStep step={2}>memoize các lần fetch dữ liệu</CodeStep>, không giống như `useMemo`, vốn chỉ nên được sử dụng cho các phép tính.

Hiện tại, `cache` chỉ nên được sử dụng trong Server Components và cache sẽ bị vô hiệu hóa giữa các request đến server.

#### `memo` {/*deep-dive-memo*/}

Bạn nên sử dụng [`memo`](reference/react/memo) để ngăn component render lại nếu props của nó không thay đổi.

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record);
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

Trong ví dụ này, cả hai component `MemoWeatherReport` sẽ gọi `calculateAvg` khi được render lần đầu. Tuy nhiên, nếu `App` render lại mà không có thay đổi nào đối với `record`, không có prop nào thay đổi và `MemoWeatherReport` sẽ không render lại.

So với `useMemo`, `memo` memoize việc render component dựa trên props thay vì các phép tính cụ thể. Tương tự như `useMemo`, component đã memoize chỉ cache lần render gần nhất với các giá trị prop gần nhất. Khi props thay đổi, cache bị vô hiệu hóa và component render lại.

</DeepDive>

---

## Khắc phục sự cố {/*troubleshooting*/}

### Hàm đã memoize của tôi vẫn chạy dù tôi đã gọi nó với cùng các đối số {/*memoized-function-still-runs*/}

Xem các vấn đề đã đề cập trước đó
* [Gọi các hàm đã memoize khác nhau sẽ đọc từ các cache khác nhau.](#pitfall-different-memoized-functions)
* [Gọi một hàm đã memoize bên ngoài component sẽ không sử dụng cache.](#pitfall-memoized-call-outside-component)

Nếu không trường hợp nào ở trên áp dụng, vấn đề có thể nằm ở cách React kiểm tra xem một giá trị có tồn tại trong cache hay không.

Nếu các đối số của bạn không phải là [primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (ví dụ: object, function, array), hãy đảm bảo rằng bạn truyền cùng một tham chiếu object.

Khi gọi một hàm đã memoize, React sẽ tra cứu các đối số đầu vào để xem kết quả đã được cache hay chưa. React sẽ sử dụng phép so sánh nông đối với các đối số để xác định cache hit.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Không đúng: props là object thay đổi ở mỗi lần render.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Trong trường hợp này, hai `MapMarker`s có vẻ đang thực hiện cùng một công việc và gọi `calculateNorm` với cùng giá trị của `{x: 10, y: 10, z:10}`. Mặc dù các object chứa cùng giá trị, chúng không có cùng tham chiếu object vì mỗi component tạo object `props` riêng.

React sẽ gọi [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) trên đầu vào để xác minh xem có cache hit hay không.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Đúng: Truyền các giá trị nguyên thủy vào hàm đã memoize
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Một cách để giải quyết vấn đề này là truyền các kích thước vector cho `calculateNorm`. Cách này hoạt động vì bản thân các kích thước là primitive.

Một giải pháp khác là truyền chính object vector làm prop cho component. Chúng ta cần truyền cùng một object cho cả hai instance của component.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Đúng: Truyền cùng object `vector`
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```
