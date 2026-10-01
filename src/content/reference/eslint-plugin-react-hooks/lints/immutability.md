---
title: immutability
---

<Intro>

Kiểm tra việc thay đổi props, state và các giá trị khác [là bất biến](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable).

</Intro>

## Chi tiết về rule {/*rule-details*/}

Props và state của một component là các snapshot bất biến. Không bao giờ thay đổi trực tiếp chúng. Thay vào đó, hãy truyền props mới xuống và sử dụng hàm setter từ `useState`.

## Các lỗi vi phạm thường gặp {/*common-violations*/}

### Không hợp lệ {/*invalid*/}

```js
// ❌ Thay đổi mảng bằng push
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    items.push(4); // Thay đổi trực tiếp!
    setItems(items); // Cùng tham chiếu, không render lại
  };
}

// ❌ Gán thuộc tính cho object
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    user.name = 'Bob'; // Thay đổi trực tiếp!
    setUser(user); // Cùng tham chiếu
  };
}

// ❌ Sắp xếp mà không sao chép
function Component() {
  const [items, setItems] = useState([3, 1, 2]);

  const sortItems = () => {
    setItems(items.sort()); // sort thay đổi trực tiếp mảng!
  };
}
```

### Hợp lệ {/*valid*/}

```js
// ✅ Tạo mảng mới
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    setItems([...items, 4]); // Mảng mới
  };
}

// ✅ Tạo object mới
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    setUser({...user, name: 'Bob'}); // Object mới
  };
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi cần thêm các phần tử vào một mảng {/*add-items-array*/}

Việc thay đổi mảng bằng các method như `push()` sẽ không kích hoạt việc re-render:

```js
// ❌ Sai: Thay đổi trực tiếp mảng
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    todos.push({id, text});
    setTodos(todos); // Cùng tham chiếu mảng!
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

Thay vào đó, hãy tạo một mảng mới:

```js
// ✅ Tốt hơn: Tạo mảng mới
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    setTodos([...todos, {id, text}]);
    // Hoặc: setTodos(todos => [...todos, {id: Date.now(), text}])
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

### Tôi cần cập nhật các object lồng nhau {/*update-nested-objects*/}

Việc thay đổi các thuộc tính lồng nhau sẽ không kích hoạt việc re-render:

```js
// ❌ Sai: Thay đổi trực tiếp object lồng nhau
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    user.settings.theme = 'dark'; // Thay đổi trực tiếp!
    setUser(user); // Cùng tham chiếu object
  };
}
```

Sử dụng spread ở mỗi cấp cần cập nhật:

```js
// ✅ Tốt hơn: Tạo object mới ở từng cấp
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        theme: 'dark'
      }
    });
  };
}
```
