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
// ❌ Array push mutation
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    items.push(4); // Mutating!
    setItems(items); // Same reference, no re-render
  };
}

// ❌ Object property assignment
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    user.name = 'Bob'; // Mutating!
    setUser(user); // Same reference
  };
}

// ❌ Sort without spreading
function Component() {
  const [items, setItems] = useState([3, 1, 2]);

  const sortItems = () => {
    setItems(items.sort()); // sort mutates!
  };
}
```

### Hợp lệ {/*valid*/}

```js
// ✅ Create new array
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    setItems([...items, 4]); // New array
  };
}

// ✅ Create new object
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    setUser({...user, name: 'Bob'}); // New object
  };
}
```

## Khắc phục sự cố {/*troubleshooting*/}

### Tôi cần thêm các phần tử vào một mảng {/*add-items-array*/}

Việc thay đổi mảng bằng các method như `push()` sẽ không kích hoạt việc re-render:

```js
// ❌ Wrong: Mutating the array
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    todos.push({id, text});
    setTodos(todos); // Same array reference!
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
// ✅ Better: Create a new array
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    setTodos([...todos, {id, text}]);
    // Or: setTodos(todos => [...todos, {id: Date.now(), text}])
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
// ❌ Wrong: Mutating nested object
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    user.settings.theme = 'dark'; // Mutation!
    setUser(user); // Same object reference
  };
}
```

Sử dụng spread ở mỗi cấp cần cập nhật:

```js
// ✅ Better: Create new objects at each level
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