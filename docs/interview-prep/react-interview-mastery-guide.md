#  React Interview Mastery Guide
## Your Complete Preparation Resource for Acing React Interviews

---

##  How to Use This Guide

This guide is designed to build your confidence and competence for React technical interviews. Here's how to get the most from it:

### Study Strategy
1. **Start with Foundational Questions** - Master React basics first (80% of interviews cover these)
2. **Practice building components** - Code along with examples, don't just read
3. **Understand the "why"** - Know why React does things a certain way
4. **Time yourself** - Aim to explain concepts in 2-3 minutes
5. **Build real projects** - Apply concepts to solidify understanding

### Progressive Learning Path
- **Week 1**: Foundational Questions (Q1-10) + Component Basics
- **Week 2**: Hooks Deep Dive (Q11-15) + State Management
- **Week 3**: Practical Coding (Q16-20) + Performance
- **Week 4**: Advanced Patterns (Q26-30) + Real-World Scenarios
- **Final Review**: Company-specific focus + mock interviews

---

##  What Interviewers Look For in React Questions

### They're Evaluating:
1. **React Fundamentals** - Core concepts (components, props, state, lifecycle)
2. **Hooks Mastery** - Understanding useState, useEffect, custom hooks
3. **Performance Awareness** - Optimization techniques (memoization, lazy loading)
4. **State Management** - Context, Redux, or other solutions
5. **Best Practices** - Code organization, reusability, testing
6. **Problem-Solving** - How you approach building features

### Red Flags They're Watching For:
-  Not understanding component lifecycle
-  Misusing useEffect (missing dependencies, infinite loops)
-  Poor state management decisions
-  No awareness of performance implications
-  Can't explain when/why to use different patterns
-  No testing knowledge

### Green Flags That Impress:
-  Explaining component composition strategies
-  Understanding reconciliation and Virtual DOM
-  Discussing performance optimization techniques
-  Knowing when to use Context vs props vs state management
-  Writing clean, maintainable component code
-  Testing components effectively

---

##  Tips for Answering Confidently

### The PREP Framework for React Questions:
- **P**oint: State your answer directly first
- **R**eason: Explain why React works this way
- **E**xample: Provide code or real component example
- **P**oint: Mention related concepts or alternatives

### Example:
**Q: What is the Virtual DOM?**
- **Point**: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM that React uses to optimize updates."
- **Reason**: "It allows React to batch updates and minimize expensive DOM operations by calculating the minimal changes needed."
- **Example**: [Show reconciliation example]
- **Point**: "This is why React is so fast - it never directly manipulates the DOM unnecessarily."

### React-Specific Communication Tips:
- **Think in components**: "I'd break this into X components..."
- **Discuss data flow**: "Props would flow down, events bubble up..."
- **Mention performance**: "For optimization, I'd use useMemo here..."
- **Show testing awareness**: "I'd test this component by..."

---

##  How to Handle "I Don't Know" Gracefully

### React-Specific Recovery Strategies:

#### 1. The Version Response
> "I haven't used that specific API, but I know in React 18 they introduced [related feature]. Is this related to that?"

#### 2. The Pattern Recognition Response
> "I'm not familiar with that exact hook, but based on React patterns, I'd expect it to handle [logical guess]. Am I on the right track?"

#### 3. The Problem-Solving Response
> "I haven't implemented that before, but here's how I'd approach it: [describe component structure, state management, etc.]"

#### 4. The Documentation Response
> "That's not something I've used yet. I'd check the React docs and probably start with a simple implementation to understand the use case better."

---

##  FOUNDATIONAL QUESTIONS (Q1-10)
###  Must-Know React Concepts Every Developer Should Explain

---

### **Q1: What is React? Why use it over vanilla JavaScript?**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"React is a JavaScript library for building user interfaces, focused on creating reusable components. It was created by Facebook and uses a declarative approach to build UIs.

**Key Benefits:**
1. **Component-Based Architecture** - Reusable, composable UI pieces
2. **Virtual DOM** - Efficient updates and rendering
3. **Declarative** - Describe what UI should look like, React handles the how
4. **Unidirectional Data Flow** - Predictable state management
5. **Rich Ecosystem** - Huge community, tools, libraries
6. **JSX** - Write HTML-like syntax in JavaScript"

####  What to Say (Exact Phrasing):
```jsx
// Vanilla JavaScript - Imperative
const button = document.createElement('button');
button.textContent = 'Click me';
button.addEventListener('click', () => {
  const div = document.getElementById('counter');
  const count = parseInt(div.textContent) + 1;
  div.textContent = count;
});
document.body.appendChild(button);

// React - Declarative
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

// React handles the DOM updates efficiently
```

####  Follow-up Discussion Points:
- "React's component model makes code more maintainable and testable"
- "The Virtual DOM minimizes expensive DOM operations"
- "Declarative code is easier to reason about than imperative DOM manipulation"
- "React's ecosystem includes React Native for mobile development"

####  Weak Answer:
- "It makes websites faster" (not always true)
- "Everyone uses it" (not a technical reason)
- "It's better than vanilla JS" (without explaining why)
- Not mentioning components or Virtual DOM

#### Common Interviewer Follow-ups:
1. **"What is the Virtual DOM and how does it work?"**
   - "The Virtual DOM is a lightweight copy of the actual DOM. When state changes, React creates a new Virtual DOM tree, compares it with the previous one (diffing), calculates the minimal changes needed, and updates only those parts of the real DOM."

2. **"What are the downsides of React?"**
   - "React has a learning curve with JSX and component patterns. It's just the view layer, so you often need additional libraries for routing and state management. The bundle size can be large for small projects. It requires build tools like Webpack or Vite."

3. **"When would you NOT use React?"**
   - "For very simple static sites, React might be overkill. For SEO-critical sites without SSR setup, vanilla HTML might be better. For projects where the team doesn't know JavaScript well, a simpler framework might be more appropriate."

---

### **Q2: Explain the difference between functional and class components**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"React has two ways to create components: class components (legacy) and functional components (modern standard).

**Class Components:**
- Use ES6 class syntax extending React.Component
- Have lifecycle methods (componentDidMount, etc.)
- Use `this.state` and `this.setState()`
- More verbose and complex

**Functional Components:**
- Just JavaScript functions that return JSX
- Use Hooks for state and side effects (useState, useEffect)
- Simpler, less boilerplate
- Easier to test and understand
- **React team recommends these for all new code**"

####  What to Say (Exact Phrasing):
```jsx
// Class Component (Legacy)
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.increment = this.increment.bind(this); // Need to bind
  }
  
  componentDidMount() {
    console.log('Component mounted');
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log('Component updated');
  }
  
  componentWillUnmount() {
    console.log('Component will unmount');
  }
  
  increment() {
    this.setState({ count: this.state.count + 1 });
  }
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

// Functional Component (Modern)
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('Component mounted');
    
    return () => {
      console.log('Component will unmount');
    };
  }, []);
  
  useEffect(() => {
    console.log('Component updated');
  });
  
  const increment = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// Much cleaner, no 'this' confusion!
```

####  Follow-up Discussion Points:
- "Hooks solve many problems: no `this` confusion, easier code reuse with custom hooks, less boilerplate"
- "Functional components perform slightly better (no class instantiation overhead)"
- "All new React code should use functional components - class components are legacy"
- "You might still see class components in older codebases"

####  Weak Answer:
- "Functional components are just simpler"
- Not mentioning Hooks
- Saying "classes are bad" without context
- Not knowing lifecycle method equivalents

#### Common Interviewer Follow-ups:
1. **"How do lifecycle methods map to Hooks?"**
   - "`componentDidMount` → `useEffect(() => {}, [])`"
   - "`componentDidUpdate` → `useEffect(() => {})`"
   - "`componentWillUnmount` → `useEffect` cleanup function"
   - "`shouldComponentUpdate` → `React.memo()` or `useMemo()`"

2. **"Can you still use class components?"**
   - "Yes, they're fully supported and won't be removed. But the React team recommends functional components for all new code since Hooks were introduced in React 16.8."

3. **"What problems do Hooks solve that classes had?"**
   - "No confusing `this` binding, easier to reuse stateful logic with custom hooks, related logic can stay together (not split across lifecycle methods), less code overall, better tree-shaking."

---

### **Q3: What are props and state? What's the difference?**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"Props and state are both plain JavaScript objects that hold data, but they serve different purposes:

**Props (Properties):**
- Data passed FROM parent TO child components
- Immutable (read-only) within the component
- Used to configure child components
- Flow downward (unidirectional data flow)

**State:**
- Data managed WITHIN a component
- Mutable (can be changed with setState/useState)
- Private to the component
- When state changes, component re-renders

**Key Rule**: Props are like function parameters, State is like local variables."

####  What to Say (Exact Phrasing):
```jsx
// Parent Component
function App() {
  const [user, setUser] = useState({ name: 'Alice', age: 25 });
  
  return (
    <div>
      {/* Passing props to child */}
      <UserProfile 
        name={user.name}     // Props flow down
        age={user.age}
        onUpdate={setUser}
      />
    </div>
  );
}

// Child Component
function UserProfile({ name, age, onUpdate }) {
  // Local state (private to this component)
  const [isEditing, setIsEditing] = useState(false);
  
  //  Can't do this - props are read-only!
  // name = 'Bob'; // Error!
  
  //  Can modify local state
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  //  Can send events up to parent to modify parent's state
  const handleSave = (newName) => {
    onUpdate({ name: newName, age });
  };
  
  return (
    <div>
      {isEditing ? (
        <input defaultValue={name} onBlur={(e) => handleSave(e.target.value)} />
      ) : (
        <h2>{name} - {age} years old</h2>
      )}
      <button onClick={toggleEdit}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}

// Data flow:
// App (state) → UserProfile (props) → display
// UserProfile (event) → App (setState) → re-render
```

####  Follow-up Discussion Points:
- "Props enable component composition and reusability"
- "State should be lifted to the lowest common ancestor when multiple components need it"
- "Props drilling can become a problem - solved with Context or state management libraries"
- "Always treat props and state as immutable - create new objects/arrays instead of mutating"

####  Weak Answer:
- "Props are just variables"
- Not understanding data flow direction
- Saying you can modify props
- Not knowing when to use state vs props

#### Common Interviewer Follow-ups:
1. **"What is prop drilling and how do you solve it?"**
   - "Prop drilling is passing props through many intermediate components that don't use them, just to reach a deep child. Solutions: React Context for global data, component composition (render props/children), state management libraries like Redux or Zustand."

2. **"When should you lift state up?"**
   - "When multiple components need to share or synchronize the same state. Lift state to their closest common ancestor. Example: two sibling components need the same data - move state to their parent."

3. **"What's the difference between props.children and regular props?"**
   - "`props.children` is a special prop that contains the JSX/components between opening and closing tags. Regular props are explicitly passed. Children enable composition patterns and wrapper components."

---

### **Q4: Explain the component lifecycle in React**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"React components go through three main phases: **Mounting** (component is created and inserted into DOM), **Updating** (component re-renders due to props/state changes), and **Unmounting** (component is removed from DOM).

**In Modern React (Functional Components with Hooks):**
- **Mounting**: Component function runs, `useEffect` with empty deps runs
- **Updating**: Component re-renders, `useEffect` with dependencies runs if deps changed
- **Unmounting**: Cleanup functions from `useEffect` run

**In Class Components (Legacy):**
- Mounting: constructor → render → componentDidMount
- Updating: render → componentDidUpdate
- Unmounting: componentWillUnmount"

####  What to Say (Exact Phrasing):
```jsx
// Modern Functional Component Lifecycle
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // 1. MOUNTING - Runs once when component mounts
  useEffect(() => {
    console.log('Component mounted - setup subscriptions');
    const subscription = subscribeToUserStatus(userId);
    
    // 4. UNMOUNTING - Cleanup runs when component unmounts
    return () => {
      console.log('Component unmounting - cleanup');
      subscription.unsubscribe();
    };
  }, []); // Empty deps = mount/unmount only
  
  // 2. MOUNTING + UPDATING - Runs on mount and when userId changes
  useEffect(() => {
    console.log('Fetching user data');
    fetchUser(userId).then(setUser);
  }, [userId]); // Runs when userId changes
  
  // 3. UPDATING - Runs after every render
  useEffect(() => {
    console.log('Component rendered/updated');
    document.title = user ? user.name : 'Loading...';
  }); // No deps = runs every render
  
  if (!user) return <div>Loading...</div>;
  
  return <div>{user.name}</div>;
}

// Lifecycle Order:
// 1. Component function runs (render)
// 2. JSX is returned and committed to DOM
// 3. useEffect callbacks run (after paint)
// 4. On unmount, cleanup functions run

// Legacy Class Component (for reference)
class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
    console.log('1. Constructor');
  }
  
  componentDidMount() {
    console.log('3. Component mounted');
    fetchUser(this.props.userId).then(user => {
      this.setState({ user });
    });
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log('4. Component updated');
    if (prevProps.userId !== this.props.userId) {
      fetchUser(this.props.userId).then(user => {
        this.setState({ user });
      });
    }
  }
  
  componentWillUnmount() {
    console.log('5. Component unmounting');
    // Cleanup
  }
  
  render() {
    console.log('2. Render');
    return <div>{this.state.user?.name}</div>;
  }
}
```

####  Follow-up Discussion Points:
- "`useEffect` runs AFTER the render is painted, not during"
- "Cleanup functions prevent memory leaks (unsubscribe, clear timers, cancel requests)"
- "Empty dependency array `[]` means 'run once on mount' - equivalent to componentDidMount"
- "React 18 introduced Strict Mode double-mounting in development to catch bugs"

####  Weak Answer:
- Only knowing class lifecycle methods
- Not understanding useEffect dependency array
- Forgetting cleanup functions
- Not knowing when effects run (after paint vs during render)

#### Common Interviewer Follow-ups:
1. **"What's the difference between useEffect and useLayoutEffect?"**
   - "`useEffect` runs asynchronously after paint (non-blocking). `useLayoutEffect` runs synchronously after DOM mutations but before paint (blocking). Use `useLayoutEffect` for DOM measurements or avoiding visual flicker, but prefer `useEffect` for most cases."

2. **"Why do we need cleanup functions in useEffect?"**
   - "To prevent memory leaks and bugs. If you set up subscriptions, timers, or event listeners, you must clean them up when the component unmounts or before the effect runs again. Otherwise, they'll accumulate and cause issues."

3. **"What happens if you forget dependencies in useEffect?"**
   - "You'll have stale closures - the effect captures old values of props/state. This causes bugs where the effect doesn't react to changes. Always include all values used inside the effect in the dependency array, or use ESLint plugin to catch this."

---

### **Q5: What is JSX? Why use it?**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"JSX (JavaScript XML) is a syntax extension for JavaScript that looks like HTML but is actually JavaScript. It allows you to write HTML-like code in JavaScript files.

**Key Points:**
- JSX is syntactic sugar for `React.createElement()` calls
- Gets compiled to JavaScript by Babel/TypeScript
- Not required but makes React code much more readable
- Can embed JavaScript expressions with `{}`
- Components must return a single parent element
- Class becomes className, for becomes htmlFor"

####  What to Say (Exact Phrasing):
```jsx
// JSX (what you write)
const element = (
  <div className="container">
    <h1>Hello, {user.name}!</h1>
    <p>You have {unreadCount} messages.</p>
  </div>
);

// Compiles to this JavaScript
const element = React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, 'Hello, ', user.name, '!'),
  React.createElement('p', null, 'You have ', unreadCount, ' messages.')
);

// JSX Rules and Examples
function UserCard({ user, isOnline }) {
  //  Can embed expressions
  const greeting = isOnline ? 'Online' : 'Offline';
  
  //  Can use conditional rendering
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <span style={{ color: isOnline ? 'green' : 'gray' }}>
        {greeting}
      </span>
      
      {/*  Conditional rendering with && */}
      {user.isPremium && <span className="badge">Premium</span>}
      
      {/*  Ternary for if-else */}
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} />
      ) : (
        <div className="avatar-placeholder">
          {user.name[0]}
        </div>
      )}
      
      {/*  Map for lists */}
      <ul>
        {user.hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
}

//  Common JSX mistakes
function BadExamples() {
  //  Multiple root elements without wrapper
  return (
    <h1>Title</h1>
    <p>Content</p>  // Error!
  );
  
  //  Fixed with Fragment
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
  
  //  Using 'class' instead of 'className'
  return <div class="container">Bad</div>; // Error!
  
  //  Correct
  return <div className="container">Good</div>;
  
  //  Not closing self-closing tags
  return <img src="photo.jpg">; // Error!
  
  //  Correct
  return <img src="photo.jpg" />;
}
```

####  Follow-up Discussion Points:
- "JSX makes React code more readable and familiar to HTML developers"
- "It's type-safe - TypeScript can check JSX for errors"
- "You can use JavaScript's full power inside JSX with `{}`"
- "React Fragments (`<>...</>`) let you return multiple elements without extra DOM nodes"

####  Weak Answer:
- "JSX is HTML in JavaScript" (it's not HTML)
- Not knowing it compiles to React.createElement
- Not understanding why we use className instead of class
- Thinking JSX is required (it's not, but it's standard)

#### Common Interviewer Follow-ups:
1. **"Can you use React without JSX?"**
   - "Yes! JSX is optional. You can write `React.createElement()` calls directly. But JSX is much more readable and is the standard in the community."

2. **"What's the difference between `<div />` and `<div></div>`?"**
   - "They're identical for elements with no children. `<div />` is a self-closing tag (like HTML's `<img />`). For components, both work, but self-closing is cleaner when there are no children."

3. **"Why use React.Fragment or `<>...</>`?"**
   - "To return multiple elements without adding an extra DOM node. `<div>` wrappers can break CSS (flexbox, grid) or add unnecessary markup. Fragments have zero footprint in the DOM."

---

### **Q6: What are React Hooks? Why were they introduced?**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"Hooks are functions that let you 'hook into' React features like state and lifecycle from functional components. They were introduced in React 16.8 (2019) to solve problems with class components.

**Problems Hooks Solve:**
1. **Reusing stateful logic** was hard (wrapper hell with HOCs/render props)
2. **Complex components** became hard to understand (lifecycle methods scattered logic)
3. **Classes confused people** (`this` binding, hard for humans and machines)

**Common Built-in Hooks:**
- `useState` - Add state to functional components
- `useEffect` - Side effects (data fetching, subscriptions, DOM manipulation)
- `useContext` - Access context values
- `useRef` - Persist values across renders without causing re-renders
- `useMemo` - Memoize expensive calculations
- `useCallback` - Memoize functions
- `useReducer` - Complex state logic (like Redux in a component)"

####  What to Say (Exact Phrasing):
```jsx
// Before Hooks: Class Component
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      error: null
    };
  }
  
  componentDidMount() {
    this.fetchUser();
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser();
    }
  }
  
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
  
  fetchUser() {
    // Fetch logic scattered across lifecycle methods
  }
  
  render() {
    // Render logic
  }
}

// After Hooks: Functional Component
function UserProfile({ userId }) {
  // 1. useState - Add state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. useEffect - Side effects in one place
  useEffect(() => {
    setLoading(true);
    
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
    
    const subscription = subscribeToUser(userId);
    
    // Cleanup
    return () => subscription.unsubscribe();
  }, [userId]); // Re-run when userId changes
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return <div>{user.name}</div>;
}

// 3. Custom Hooks - Reusable Logic
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading, error };
}

// Now reusable across components!
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <div>{user.name}</div>;
}

function UserSettings({ userId }) {
  const { user, loading } = useUser(userId); // Same logic!
  // ... settings UI
}

// 4. useContext - Access context
const ThemeContext = React.createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}

// 5. useRef - DOM access or persistent values
function VideoPlayer() {
  const videoRef = useRef(null);
  
  const play = () => {
    videoRef.current.play();
  };
  
  return (
    <>
      <video ref={videoRef} src="video.mp4" />
      <button onClick={play}>Play</button>
    </>
  );
}

// 6. useMemo & useCallback - Performance
function SearchResults({ query, data }) {
  // Expensive calculation - only recompute when data/query changes
  const filteredResults = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query]);
  
  // Memoize callback to prevent child re-renders
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []); // Empty deps = function never changes
  
  return (
    <ResultsList 
      results={filteredResults}
      onClick={handleClick}
    />
  );
}
```

####  Follow-up Discussion Points:
- "Custom hooks let you extract and reuse stateful logic - this was impossible with classes"
- "Hooks must follow rules: only call at the top level, only call from React functions"
- "Hook names must start with 'use' - this is how React identifies them"
- "Hooks made React code more functional and easier to optimize"

####  Weak Answer:
- "Hooks are just a new feature"
- Not knowing the problems they solve
- Not understanding Rules of Hooks
- Only knowing useState and useEffect

#### Common Interviewer Follow-ups:
1. **"What are the Rules of Hooks?"**
   - "1) Only call Hooks at the top level (not inside loops, conditions, or nested functions). 2) Only call Hooks from React function components or custom Hooks. This ensures Hooks are called in the same order every render, which is how React tracks their state."

2. **"What's the difference between useEffect and useLayoutEffect?"**
   - "`useEffect` runs asynchronously after the browser paints. `useLayoutEffect` runs synchronously after DOM mutations but before paint. Use `useLayoutEffect` for DOM measurements or preventing visual flicker, but prefer `useEffect` for most cases as it's non-blocking."

3. **"When would you create a custom Hook?"**
   - "When you have stateful logic that's used in multiple components. Examples: data fetching patterns, form handling, browser API access (localStorage, geolocation), animation logic, or any complex state management that should be reusable."

---

### **Q7: Explain useState Hook with examples**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"`useState` is a Hook that adds state to functional components. It returns an array with two elements: the current state value and a function to update it.

**Key Points:**
- State persists across re-renders
- Updating state triggers a re-render
- State updates are asynchronous
- Can initialize with a value or a function (lazy initialization)
- Each useState call is independent"

####  What to Say (Exact Phrasing):
```jsx
// Basic Usage
function Counter() {
  // [stateValue, setterFunction] = useState(initialValue)
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// Multiple State Variables
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <form>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </form>
  );
}

// Object State
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    age: 25,
    email: 'alice@example.com'
  });
  
  //  Wrong - Mutates state directly
  const updateWrong = () => {
    user.age = 26; // Don't do this!
    setUser(user); // React won't detect the change
  };
  
  //  Correct - Create new object
  const updateAge = () => {
    setUser({
      ...user,  // Spread existing properties
      age: 26   // Override age
    });
  };
  
  //  Also correct - Use functional update
  const updateName = (newName) => {
    setUser(prevUser => ({
      ...prevUser,
      name: newName
    }));
  };
  
  return <div>{user.name} - {user.age}</div>;
}

// Array State
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  // Add item
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }]);
  };
  
  // Remove item
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Update item
  const updateTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// Lazy Initialization - For expensive calculations
function DataProcessor() {
  //  This runs on every render (expensive!)
  const [data, setData] = useState(expensiveProcessing());
  
  //  This runs only once (on mount)
  const [data, setData] = useState(() => {
    return expensiveProcessing(); // Only called once
  });
}

// Functional Updates - When new state depends on previous
function Counter() {
  const [count, setCount] = useState(0);
  
  //  Can have stale state issues
  const incrementBad = () => {
    setCount(count + 1);
    setCount(count + 1); // Still only increments by 1!
  };
  
  //  Correct - Uses previous state
  const incrementGood = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // Increments by 2!
  };
  
  return (
    <button onClick={incrementGood}>
      Count: {count}
    </button>
  );
}

// State Updates are Asynchronous
function AsyncExample() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
    console.log(count); //  Logs OLD value (0)
    
    //  To use new value, use effect or functional update
    setCount(prev => {
      console.log(prev + 1); // Logs NEW value (1)
      return prev + 1;
    });
  };
}
```

####  Follow-up Discussion Points:
- "Always treat state as immutable - use spread operator for objects/arrays"
- "Use functional updates when new state depends on previous state"
- "Lazy initialization is useful for expensive computations"
- "Multiple setState calls in the same function are batched in React 18"

####  Weak Answer:
- Not understanding state is immutable
- Mutating state directly
- Not knowing about functional updates
- Not understanding async nature of setState

#### Common Interviewer Follow-ups:
1. **"Why should you use functional updates in setState?"**
   - "When the new state depends on the previous state, use the function form `setState(prev => prev + 1)`. This ensures you always work with the latest state, avoiding issues with stale closures or batched updates."

2. **"What happens if you call setState multiple times in a row?"**
   - "In React 18, state updates are automatically batched for performance. Multiple setState calls in the same event handler are combined into one re-render. If you need each update to cause a render, use `flushSync` (rare)."

3. **"When would you use multiple useState vs one with an object?"**
   - "Use multiple useState for independent values that change separately. Use an object when values are related and often update together. Multiple useState is often clearer and makes it easier to split logic into custom hooks."

---

### **Q8: Explain useEffect Hook in depth**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"`useEffect` is a Hook for performing side effects in functional components. It runs after the component renders and can optionally clean up before the next effect or unmount.

**Side effects include:**
- Data fetching (API calls)
- Subscriptions (WebSocket, event listeners)
- DOM manipulation
- Timers (setTimeout, setInterval)
- Logging

**Three forms based on dependency array:**
1. `useEffect(() => {})` - Runs after every render
2. `useEffect(() => {}, [])` - Runs once (mount only)
3. `useEffect(() => {}, [dep1, dep2])` - Runs when dependencies change"

####  What to Say (Exact Phrasing):
```jsx
// 1. Basic useEffect - Runs after every render
function DocumentTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }); // No dependency array = runs every render
}

// 2. useEffect with empty deps - Runs once on mount
function UserData({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    console.log('Component mounted');
    fetchUser(userId).then(setUser);
  }, []); // Empty array = mount only
  
  return <div>{user?.name}</div>;
}

// 3. useEffect with dependencies - Runs when deps change
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    console.log('Query changed:', query);
    searchAPI(query).then(setResults);
  }, [query]); // Runs when query changes
  
  return <ResultsList results={results} />;
}

// 4. Cleanup Functions - Prevent memory leaks
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Setup
    const socket = connectToChat(roomId);
    
    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    
    // Cleanup - runs before next effect and on unmount
    return () => {
      console.log('Cleaning up');
      socket.disconnect();
    };
  }, [roomId]);
  
  return <MessageList messages={messages} />;
}

// 5. Common Patterns

// Data Fetching with Cleanup
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let cancelled = false; // Prevent setting state after unmount
    
    setLoading(true);
    
    fetchUser(userId).then(data => {
      if (!cancelled) { // Only update if still mounted
        setUser(data);
        setLoading(false);
      }
    });
    
    return () => {
      cancelled = true; // Mark as cancelled
    };
  }, [userId]);
}

// Event Listeners
function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    
    // Add listener
    window.addEventListener('resize', handleResize);
    
    // Remove listener on cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // No deps = setup once
  
  return <div>Width: {width}px</div>;
}

// Timers
function AutoSave({ data }) {
  useEffect(() => {
    const timer = setInterval(() => {
      saveData(data);
    }, 30000); // Save every 30 seconds
    
    return () => {
      clearInterval(timer); // Clear on unmount or data change
    };
  }, [data]); // Reset timer when data changes
}

//  Common Mistakes

// Missing dependencies (ESLint will warn)
function BadExample({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); //  Missing userId dependency!
  // Effect won't re-run when userId changes
}

// Infinite loop - state update causes re-render causes effect causes state update...
function InfiniteLoop() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1); //  Infinite loop!
  }); // No deps array = runs every render
}

// Not cleaning up
function MemoryLeak() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Running');
    }, 1000);
    
    //  No cleanup! Interval keeps running after unmount
  }, []);
}

//  Best Practices
function BestPractices() {
  // 1. Include all dependencies
  useEffect(() => {
    // Use all variables from component scope
  }, [/* list all used values */]);
  
  // 2. Always cleanup side effects
  useEffect(() => {
    const subscription = api.subscribe();
    return () => subscription.unsubscribe();
  }, []);
  
  // 3. Use async functions carefully
  useEffect(() => {
    //  Can't make useEffect callback async directly
    // async () => { await fetch() } // Error!
    
    //  Define async function inside
    const fetchData = async () => {
      const data = await fetch('/api/data');
      setData(data);
    };
    
    fetchData();
  }, []);
}
```

####  Follow-up Discussion Points:
- "useEffect runs AFTER the render is committed to the screen (after paint)"
- "Cleanup functions prevent memory leaks - always cleanup subscriptions, timers, listeners"
- "React 18's Strict Mode runs effects twice in development to catch missing cleanups"
- "The dependency array is how React knows when to re-run the effect"

####  Weak Answer:
- "useEffect is like componentDidMount"
- Not understanding cleanup functions
- Missing dependencies in the dependency array
- Not knowing when effects run (timing)

#### Common Interviewer Follow-ups:
1. **"What's the execution order of useEffect?"**
   - "1) Component renders (JSX), 2) React updates the DOM, 3) Browser paints the screen, 4) useEffect callback runs. Cleanup runs before the next effect or on unmount. This is why useEffect doesn't block rendering."

2. **"How do you handle async operations in useEffect?"**
   - "You can't make the useEffect callback async directly. Instead, define an async function inside the effect and call it. Also implement cleanup to prevent setting state on unmounted components (use a 'cancelled' flag or AbortController)."

3. **"What happens if you omit the dependency array?"**
   - "The effect runs after every render. This can cause performance issues and infinite loops if the effect triggers state updates. Always include a dependency array, even if it's empty."

---

### **Q9: What is the Virtual DOM and how does it work?**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to optimize updates by minimizing expensive DOM operations.

**How it works:**
1. **Initial Render**: React creates a Virtual DOM tree from components
2. **State Changes**: React creates a new Virtual DOM tree
3. **Diffing**: React compares new tree with previous tree (reconciliation)
4. **Minimal Updates**: React calculates the minimal changes needed
5. **Batch Updates**: React applies only necessary changes to real DOM

**Why it's fast:**
- DOM operations are slow, JavaScript objects are fast
- Batching reduces reflows and repaints
- Diffing algorithm is highly optimized
- Only changed elements are updated"

####  What to Say (Exact Phrasing):
```jsx
// Example: How Virtual DOM works

// 1. Initial Render
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build Project' }
  ]);
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// Virtual DOM representation (simplified):
{
  type: 'ul',
  props: {},
  children: [
    { type: 'li', props: { key: 1 }, children: ['Learn React'] },
    { type: 'li', props: { key: 2 }, children: ['Build Project'] }
  ]
}

// Real DOM created:
<ul>
  <li>Learn React</li>
  <li>Build Project</li>
</ul>

// 2. State Change - Add new todo
setTodos([...todos, { id: 3, text: 'Deploy App' }]);

// New Virtual DOM:
{
  type: 'ul',
  props: {},
  children: [
    { type: 'li', props: { key: 1 }, children: ['Learn React'] },
    { type: 'li', props: { key: 2 }, children: ['Build Project'] },
    { type: 'li', props: { key: 3 }, children: ['Deploy App'] }  // New!
  ]
}

// 3. Diffing Algorithm (Reconciliation)
// React compares old and new Virtual DOM
// Finds: First two <li> unchanged, third <li> is new

// 4. Minimal Update
// Instead of recreating entire <ul>:
//  React only appends the new <li>
//  Doesn't touch existing <li> elements

// Reconciliation Rules
function ReconciliationExamples() {
  // Rule 1: Different element types = destroy and rebuild
  // Old: <div>Content</div>
  // New: <span>Content</span>
  // Result: Destroys div, creates span
  
  // Rule 2: Same element type = update attributes
  // Old: <div className="old">Content</div>
  // New: <div className="new">Content</div>
  // Result: Only updates className
  
  // Rule 3: Keys help identify elements
  return (
    <ul>
      {/*  Without keys - React doesn't know which items changed */}
      {items.map(item => (
        <li>{item.text}</li>
      ))}
      
      {/*  With keys - React knows exactly which items changed */}
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}

// Why Virtual DOM is faster than direct DOM manipulation
//  Direct DOM (slow)
function directDOM() {
  const list = document.querySelector('ul');
  
  // Each operation triggers reflow/repaint
  list.innerHTML = ''; // Reflow
  data.forEach(item => {
    const li = document.createElement('li'); // Reflow
    li.textContent = item.text;
    list.appendChild(li); // Reflow (multiple times!)
  });
  // Total: Many expensive DOM operations
}

//  Virtual DOM (fast)
function virtualDOM() {
  // 1. Build Virtual DOM tree (fast - just JS objects)
  const vdom = createVirtualDOM(data);
  
  // 2. Diff with previous tree (fast - JS comparison)
  const patches = diff(previousVdom, vdom);
  
  // 3. Apply minimal changes in one batch (one reflow)
  applyPatchesToRealDOM(patches);
  // Total: One optimized DOM operation
}

// Fiber Architecture (React 16+)
// React's improved reconciliation algorithm
// - Can pause and resume work
// - Prioritizes updates (user interactions over background work)
// - Enables Concurrent Mode features

function FiberConcept() {
  // High priority: User click
  <button onClick={urgentUpdate}>Click me</button>
  
  // Low priority: Background data update
  // React can pause low-priority work to handle click
}
```

####  Follow-up Discussion Points:
- "The Virtual DOM isn't always faster - for simple updates, direct DOM can be quicker"
- "Keys are crucial for list rendering - they help React identify which items changed"
- "React Fiber (React 16+) improved reconciliation with interruptible rendering"
- "Virtual DOM also enables React Native - same API, different render targets"

####  Weak Answer:
- "Virtual DOM makes React fast" (oversimplification)
- Not understanding the diffing/reconciliation process
- Not mentioning the tradeoffs
- Thinking Virtual DOM is always better than DOM

#### Common Interviewer Follow-ups:
1. **"What is reconciliation?"**
   - "Reconciliation is React's diffing algorithm that compares the new Virtual DOM with the previous one to calculate the minimal set of changes needed. It uses heuristics like element type comparison and keys to optimize this process."

2. **"Why are keys important in lists?"**
   - "Keys help React identify which items have changed, been added, or removed. Without keys, React uses index position, which causes bugs when items are reordered or removed. Keys should be stable, unique IDs, not array indices."

3. **"What's the difference between Virtual DOM and Shadow DOM?"**
   - "Virtual DOM is a React concept - a JavaScript representation of the DOM for optimization. Shadow DOM is a browser feature for encapsulating DOM/styles in web components. They're completely different technologies."

---

### **Q10: Explain React component rendering and re-rendering**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"React components render when they're first mounted and re-render when their state or props change. Understanding when and why components re-render is crucial for performance.

**Rendering triggers:**
1. **Initial mount** - Component renders for the first time
2. **State change** - Component calls setState/useState updater
3. **Parent re-render** - Parent re-renders, children re-render by default
4. **Context change** - Context value changes, consumers re-render
5. **Force update** - forceUpdate() called (rare, avoid)

**Key Point**: Re-rendering doesn't mean DOM updates - React may render but not commit changes to DOM if Virtual DOM hasn't changed."

####  What to Say (Exact Phrasing):
```jsx
// Rendering Behavior
function Parent() {
  const [count, setCount] = useState(0);
  
  console.log('Parent rendering');
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <Child />  {/* Re-renders every time Parent renders! */}
    </div>
  );
}

function Child() {
  console.log('Child rendering');
  return <div>I am child</div>;
}

// When you click the button:
// Output:
// "Parent rendering"
// "Child rendering"  <- Even though Child doesn't use count!

// Optimization 1: React.memo - Prevent unnecessary re-renders
const Child = React.memo(function Child({ name }) {
  console.log('Child rendering');
  return <div>Hello {name}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <Child name="Alice" />  
      {/* Now Child only re-renders if 'name' prop changes */}
    </div>
  );
}

// Gotcha with React.memo - Reference equality
function Parent() {
  const [count, setCount] = useState(0);
  
  //  Object created on every render - new reference
  const user = { name: 'Alice', age: 25 };
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child user={user} />  
      {/* Still re-renders! user is a new object every time */}
    </div>
  );
}

//  Solution: useMemo or move outside component
function Parent() {
  const [count, setCount] = useState(0);
  
  const user = useMemo(() => ({
    name: 'Alice',
    age: 25
  }), []); // Only create once
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child user={user} />  
      {/* Now Child doesn't re-render! */}
    </div>
  );
}

// useCallback for function props
function Parent() {
  const [count, setCount] = useState(0);
  
  //  New function every render
  const handleClick = () => {
    console.log('Clicked');
  };
  
  //  Same function reference
  const handleClickMemo = useCallback(() => {
    console.log('Clicked');
  }, []); // Dependencies
  
  return (
    <Child onClick={handleClickMemo} />
  );
}

// Render vs Commit Phase
function Example() {
  const [count, setCount] = useState(0);
  
  console.log('Rendering'); // Happens on every render
  
  useEffect(() => {
    console.log('Committed'); // Only after DOM is updated
  });
  
  // Render phase: React calls component function, builds Virtual DOM
  // Commit phase: React updates actual DOM (only if changes exist)
  
  return <div>{count}</div>;
}

// State updates are batched
function BatchingExample() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  
  function handleClick() {
    console.log('Before updates');
    setCount(count + 1);  // Doesn't re-render immediately
    setFlag(!flag);       // Doesn't re-render immediately
    console.log('After updates');
    // Re-renders once after both updates (batched)
  }
  
  console.log('Rendering');
  
  return <button onClick={handleClick}>Update</button>;
  
  // Output:
  // "Before updates"
  // "After updates"
  // "Rendering" (only once!)
}

// Context causes re-renders
const ThemeContext = React.createContext();

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Header />  {/* Re-renders when theme changes */}
      <Content /> {/* Re-renders when theme changes */}
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = useContext(ThemeContext);
  console.log('Header rendering');
  return <div className={theme}>Header</div>;
}

// Optimization: Split context for better granularity
const ThemeContext = React.createContext();
const ThemeUpdaterContext = React.createContext();

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdaterContext.Provider value={setTheme}>
        <Header />
        <ThemeToggle />
      </ThemeUpdaterContext.Provider>
    </ThemeContext.Provider>
  );
}

// Only re-renders when theme value changes
function Header() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Header</div>;
}

// Doesn't re-render when theme changes!
function ThemeToggle() {
  const setTheme = useContext(ThemeUpdaterContext);
  return <button onClick={() => setTheme('dark')}>Toggle</button>;
}

// Performance Profiling
function ProfiledComponent() {
  // Use React DevTools Profiler to see:
  // - Which components rendered
  // - Why they rendered
  // - How long it took
  
  return <ExpensiveComponent />;
}
```

####  Follow-up Discussion Points:
- "React.memo does a shallow comparison of props by default"
- "In React 18, batching works even in async functions and promises"
- "Re-rendering isn't always bad - premature optimization can make code complex"
- "Use React DevTools Profiler to identify performance bottlenecks"

####  Weak Answer:
- "Components re-render when props change" (incomplete - also state, context, parent)
- Not understanding render vs commit phase
- Not knowing optimization techniques
- Thinking re-render always means DOM update

#### Common Interviewer Follow-ups:
1. **"When should you use React.memo?"**
   - "Use React.memo for components that render often with the same props, expensive to render, or receive complex props. Don't overuse it - the comparison itself has a cost. Profile first, optimize when needed."

2. **"What's the difference between useMemo and useCallback?"**
   - "`useMemo` memoizes a computed value: `useMemo(() => expensiveCalc(), [deps])`. `useCallback` memoizes a function: `useCallback(() => handleClick(), [deps])`. useCallback is actually shorthand for `useMemo(() => fn, [deps])`."

3. **"How does context affect rendering performance?"**
   - "All components that useContext() will re-render when the context value changes, even if they don't use the changed part. Solutions: split contexts, use React.memo, or use state management libraries that have fine-grained subscriptions."

---

##  HOOKS DEEP DIVE (Q11-15)
### Advanced Hook Patterns and Custom Hooks

---

### **Q11: What is useContext? When should you use it?**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"`useContext` is a Hook that lets you read and subscribe to context from your component. It solves the prop drilling problem by allowing data to be accessed by any component in the tree without passing props through every level.

**When to use Context:**
- Theme (dark/light mode)
- User authentication state
- Language/localization
- Global UI state (modals, notifications)
- Data that many components need

**When NOT to use:**
- Frequently changing data (causes many re-renders)
- As a replacement for proper component composition
- For all state management (consider Redux/Zustand for complex apps)"

####  What to Say (Exact Phrasing):
```jsx
// Creating and Using Context
import React, { createContext, useContext, useState } from 'react';

// 1. Create Context
const ThemeContext = createContext('light'); // Default value

// 2. Provider Component
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <Content />
      <Footer />
    </ThemeContext.Provider>
  );
}

// 3. Consume with useContext
function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <header className={theme}>
      <h1>My App</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  );
}

// Before Context (Prop Drilling Problem)
function App() {
  const [user, setUser] = useState(null);
  
  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  return (
    <div>
      <Header user={user} setUser={setUser} />  {/* Just passing through */}
      <Sidebar user={user} />  {/* Just passing through */}
    </div>
  );
}

function Header({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;  {/* Just passing through */}
}

function UserMenu({ user, setUser }) {
  return <div>{user?.name}</div>;  {/* Finally used here! */}
}

// After Context (Clean)
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />  {/* No props! */}
    </UserContext.Provider>
  );
}

function Layout() {
  return (
    <div>
      <Header />  {/* No props! */}
      <Sidebar />  {/* No props! */}
    </div>
  );
}

function UserMenu() {
  const { user, setUser } = useContext(UserContext);  {/* Access directly */}
  return <div>{user?.name}</div>;
}

// Custom Hook Pattern (Best Practice)
function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}

// Provider with Logic
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    checkAuth().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  
  const login = async (email, password) => {
    const user = await loginAPI(email, password);
    setUser(user);
  };
  
  const logout = () => {
    logoutAPI();
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Usage in Components
function Dashboard() {
  const { user, logout } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Multiple Contexts
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <Routes />
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Context Performance Optimization
//  Problem: Every component re-renders when any part of context changes
const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  
  // New object every render!
  const value = { user, setUser, settings, setSettings };
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

//  Solution 1: useMemo
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  
  const value = useMemo(() => ({
    user,
    setUser,
    settings,
    setSettings
  }), [user, settings]);
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

//  Solution 2: Split contexts
const UserContext = createContext();
const UserDispatchContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

// Components only re-render for what they use
function UserDisplay() {
  const user = useContext(UserContext);  // Re-renders when user changes
  return <div>{user?.name}</div>;
}

function UserControls() {
  const setUser = useContext(UserDispatchContext);  // Doesn't re-render!
  return <button onClick={() => setUser(null)}>Logout</button>;
}
```

####  Follow-up Discussion Points:
- "Context causes re-renders of ALL consumers when value changes - use sparingly"
- "Always wrap context value in useMemo if it contains objects/arrays"
- "Custom hooks (useAuth, useTheme) are the standard way to consume context"
- "For complex global state, consider Redux, Zustand, or Jotai instead"

####  Weak Answer:
- "Context is for global state" (too vague)
- Not understanding performance implications
- Using context for everything
- Not using custom hooks to consume context

#### Common Interviewer Follow-ups:
1. **"What's the difference between Context and Redux?"**
   - "Context is built into React for passing data through the tree. Redux is a separate state management library with time-travel debugging, middleware, and dev tools. Context is simpler for basic use cases, Redux is better for complex applications with lots of state interactions."

2. **"How do you prevent unnecessary re-renders with Context?"**
   - "Split contexts into value and dispatch, useMemo the provider value, use React.memo on consuming components, or consider state management libraries that have fine-grained subscriptions (Zustand, Jotai)."

3. **"Can you use multiple contexts?"**
   - "Yes! Nest multiple providers or use a single provider that combines contexts. Be careful about provider order - inner providers can access outer contexts."

---

### **Q12: Explain useReducer and when to use it over useState**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"`useReducer` is a Hook for managing complex state logic in React. It's similar to Redux - you dispatch actions to a reducer function that determines how state should change.

**Use useReducer when:**
- State logic is complex (multiple sub-values, interrelated changes)
- Next state depends on previous state
- You want to optimize performance (stable dispatch function)
- State transitions should be explicit and traceable

**Use useState when:**
- Simple state (single values, booleans, strings)
- State updates are independent
- Logic is straightforward"

####  What to Say (Exact Phrasing):
```jsx
// Basic useReducer
import { useReducer } from 'react';

// 1. Define reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// 2. Use in component
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}

// Complex Example: Form with Multiple Fields
const initialState = {
  name: '',
  email: '',
  age: 0,
  errors: {},
  isSubmitting: false
};

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: undefined  // Clear error for this field
        }
      };
      
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        isSubmitting: false
      };
      
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true
      };
      
    case 'SUBMIT_SUCCESS':
      return initialState;  // Reset form
      
    case 'RESET':
      return initialState;
      
    default:
      return state;
  }
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  const handleChange = (field) => (e) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field,
      value: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch({ type: 'SUBMIT_START' });
    
    try {
      await registerUser(state);
      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch (errors) {
      dispatch({ type: 'SET_ERRORS', errors });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.name}
        onChange={handleChange('name')}
        placeholder="Name"
      />
      {state.errors.name && <span>{state.errors.name}</span>}
      
      <input
        value={state.email}
        onChange={handleChange('email')}
        placeholder="Email"
      />
      {state.errors.email && <span>{state.errors.email}</span>}
      
      <button disabled={state.isSubmitting}>
        {state.isSubmitting ? 'Submitting...' : 'Register'}
      </button>
    </form>
  );
}

// useState vs useReducer Comparison

//  Complex state with useState - Hard to maintain
function TodoListState() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const loadTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Multiple useState calls, scattered logic
}

//  With useReducer - Centralized, clear logic
const initialState = {
  todos: [],
  filter: 'all',
  isLoading: false,
  error: null
};

function todosReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.text,
          completed: false
        }]
      };
      
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
      
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      };
      
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.filter
      };
      
    case 'LOAD_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case 'LOAD_SUCCESS':
      return {
        ...state,
        todos: action.todos,
        isLoading: false
      };
      
    case 'LOAD_ERROR':
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
      
    default:
      return state;
  }
}

function TodoListReducer() {
  const [state, dispatch] = useReducer(todosReducer, initialState);
  
  const loadTodos = async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const todos = await fetchTodos();
      dispatch({ type: 'LOAD_SUCCESS', todos });
    } catch (error) {
      dispatch({ type: 'LOAD_ERROR', error: error.message });
    }
  };
  
  // Clean, organized dispatch calls
  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD_TODO', text: 'New' })}>
        Add
      </button>
      {state.todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onToggle={() => dispatch({ type: 'TOGGLE_TODO', id: todo.id })}
          onDelete={() => dispatch({ type: 'DELETE_TODO', id: todo.id })}
        />
      ))}
    </div>
  );
}

// Lazy Initialization
function init(initialCount) {
  return { count: initialCount };
}

function Counter({ initialCount = 0 }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // Third argument is init function
}

// TypeScript with useReducer (Bonus)
type State = {
  count: number;
};

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'SET':
      return { count: action.payload };
    default:
      return state;
  }
}
```

####  Follow-up Discussion Points:
- "useReducer is like having Redux in a single component"
- "The dispatch function identity is stable - good for performance with useCallback"
- "Reducer functions should be pure - no side effects, same input = same output"
- "Great for forms, shopping carts, multi-step wizards, or any complex state"

####  Weak Answer:
- "useReducer is for complex state" (too vague)
- Not understanding when to use it
- Not knowing reducer pattern
- Comparing to Redux without understanding differences

#### Common Interviewer Follow-ups:
1. **"What's the difference between useReducer and Redux?"**
   - "useReducer is component-level state with reducer pattern. Redux is application-level state management with middleware, dev tools, and time-travel debugging. useReducer is simpler for component state, Redux is better for global state shared across many components."

2. **"Can you combine useReducer with Context?"**
   - "Yes! This is a common pattern for lightweight global state management. Pass dispatch from useReducer through Context - components can dispatch actions without prop drilling. This is like mini-Redux without the library."

3. **"What are the benefits of stable dispatch function?"**
   - "The dispatch function from useReducer never changes between renders. This means you don't need to include it in dependency arrays, and child components with useCallback don't need to recreate functions. It's a performance optimization."

---

### **Q13: What is useRef? When would you use it?**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"`useRef` returns a mutable ref object whose `.current` property persists across renders. Unlike state, updating a ref doesn't cause a re-render.

**Two Main Uses:**
1. **Accessing DOM elements** (like document.querySelector)
2. **Storing mutable values** that persist across renders without causing re-renders

**Key Differences from useState:**
- useRef: Mutable, doesn't cause re-render, synchronous updates
- useState: Immutable, causes re-render, asynchronous updates"

####  What to Say (Exact Phrasing):
```jsx
import { useRef, useState, useEffect } from 'react';

// Use Case 1: Accessing DOM Elements
function TextInput() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();  // Direct DOM access
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

// Use Case 2: Storing Previous Values
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  
  useEffect(() => {
    prevCountRef.current = count;  // Store previous value
  }, [count]);
  
  const prevCount = prevCountRef.current;
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// Use Case 3: Storing Mutable Values (Don't Cause Re-renders)
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    clearInterval(intervalRef.current);  // Access stored interval ID
  };
  
  useEffect(() => {
    return () => clearInterval(intervalRef.current);  // Cleanup
  }, []);
  
  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}

// Use Case 4: Avoiding Stale Closures
function DataFetcher() {
  const [data, setData] = useState(null);
  const cancelledRef = useRef(false);
  
  useEffect(() => {
    cancelledRef.current = false;  // Reset on mount
    
    fetchData().then(result => {
      if (!cancelledRef.current) {  // Only update if not cancelled
        setData(result);
      }
    });
    
    return () => {
      cancelledRef.current = true;  // Mark as cancelled
    };
  }, []);
  
  return <div>{data}</div>;
}

// useState vs useRef Comparison
function Comparison() {
  const [stateValue, setStateValue] = useState(0);
  const refValue = useRef(0);
  
  console.log('Component rendered');
  
  const updateState = () => {
    setStateValue(stateValue + 1);  // Causes re-render
    console.log('State updated to:', stateValue + 1);
  };
  
  const updateRef = () => {
    refValue.current += 1;  // No re-render!
    console.log('Ref updated to:', refValue.current);
  };
  
  return (
    <div>
      <p>State: {stateValue}</p>
      <p>Ref: {refValue.current}</p>
      <button onClick={updateState}>Update State</button>
      <button onClick={updateRef}>Update Ref</button>
    </div>
  );
}

// Advanced: Callback Refs
function MeasureElement() {
  const [height, setHeight] = useState(0);
  
  // Callback ref - called when element mounts/unmounts
  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);
  
  return (
    <div>
      <div ref={measuredRef}>
        This element's height is: {height}px
      </div>
    </div>
  );
}

// Advanced: Forwarding Refs
const FancyInput = React.forwardRef((props, ref) => {
  return (
    <div className="fancy">
      <input ref={ref} {...props} />
    </div>
  );
});

function Parent() {
  const inputRef = useRef();
  
  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>
        Focus Input
      </button>
    </div>
  );
}

// Common Patterns
function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div>
      <video ref={videoRef} src={src} />
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

// Scroll to Element
function ScrollToSection() {
  const sectionRef = useRef(null);
  
  const scrollToSection = () => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div>
      <button onClick={scrollToSection}>Scroll Down</button>
      <div style={{ height: '1000px' }}></div>
      <section ref={sectionRef}>
        <h2>Target Section</h2>
      </section>
    </div>
  );
}

//  Common Mistakes
function Mistakes() {
  const ref = useRef(0);
  
  //  Trying to trigger re-render with ref
  const increment = () => {
    ref.current += 1;  // Updates, but no re-render
    // UI won't update!
  };
  
  //  Using ref for data that should trigger re-renders
  // Use useState instead!
  
  //  Accessing ref.current during render
  console.log(ref.current);  // Don't rely on this during render
  // Access in useEffect or event handlers
}

//  Best Practices
function BestPractices() {
  const inputRef = useRef(null);
  
  //  Access in useEffect
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  
  //  Access in event handlers
  const handleClick = () => {
    console.log(inputRef.current.value);
  };
  
  return <input ref={inputRef} onClick={handleClick} />;
}
```

####  Follow-up Discussion Points:
- "useRef is perfect for instances where you need to 'remember' something without re-rendering"
- "Refs are essential for integrating with third-party DOM libraries (charts, maps)"
- "The `.current` property is the only mutable part - the ref object itself doesn't change"
- "Don't read or write refs during rendering - only in effects or event handlers"

####  Weak Answer:
- "useRef is for DOM access" (incomplete - also for mutable values)
- Not knowing when to use ref vs state
- Not understanding that refs don't cause re-renders
- Confusing refs with state

#### Common Interviewer Follow-ups:
1. **"What's the difference between useRef and creating a variable?"**
   - "Regular variables reset on every render. useRef persists the same object across renders. A regular let/const in the component body would be recreated, but useRef.current maintains its value."

2. **"When should you use useRef vs useState?"**
   - "Use useState for data that affects the UI - changes should trigger re-renders. Use useRef for data that doesn't affect rendering (DOM nodes, timers, counters, previous values, or any mutable data you need to persist)."

3. **"What is forwardRef and why is it needed?"**
   - "forwardRef allows a component to expose a ref to its parent. By default, function components don't accept refs. forwardRef is needed when you want to let parents access a child's DOM node or imperative methods."

---

### **Q14: Explain useMemo and useCallback. When should you use them?**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"`useMemo` and `useCallback` are React Hooks for performance optimization through memoization.

**useMemo:**
- Memoizes a **computed value**
- Prevents expensive calculations on every render
- Returns the memoized value
- Syntax: `useMemo(() => computeValue(), [dependencies])`

**useCallback:**
- Memoizes a **function**
- Prevents recreating functions on every render
- Returns the memoized function
- Syntax: `useCallback(() => handleClick(), [dependencies])`

**Key Point**: `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`

**When to use:**
-  Expensive calculations
-  Passing callbacks to optimized child components (React.memo)
-  Dependencies in useEffect that should be stable
-  Don't overuse - premature optimization is bad!"

####  What to Say (Exact Phrasing):
```jsx
import { useMemo, useCallback, useState, memo } from 'react';

// useMemo Example: Expensive Calculation
function ProductList({ products, searchTerm }) {
  const [sortOrder, setSortOrder] = useState('asc');
  
  //  Without useMemo - Runs on every render
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
  });
  
  //  With useMemo - Only recomputes when dependencies change
  const filteredProducts = useMemo(() => {
    console.log('Filtering and sorting...');
    return products
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
  }, [products, searchTerm, sortOrder]);  // Only recompute when these change
  
  return (
    <div>
      <button onClick={() => setSortOrder('asc')}>Sort Asc</button>
      <button onClick={() => setSortOrder('desc')}>Sort Desc</button>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// useCallback Example: Preventing Child Re-renders
const ChildComponent = memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  //  Without useCallback - New function every render
  const handleClick = () => {
    console.log('Clicked');
  };
  // Child re-renders even though onClick logic hasn't changed
  
  //  With useCallback - Same function reference
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);  // Empty deps = function never changes
  // Child doesn't re-render unless dependencies change
  
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}

// useMemo vs useCallback Comparison
function Comparison() {
  const [count, setCount] = useState(0);
  
  // useMemo - Memoize a VALUE
  const expensiveValue = useMemo(() => {
    console.log('Computing expensive value...');
    return count * 2;
  }, [count]);
  
  // useCallback - Memoize a FUNCTION
  const handleClick = useCallback(() => {
    console.log('Count:', count);
  }, [count]);
  
  // These are equivalent:
  const memoizedCallback = useCallback(() => {
    doSomething(count);
  }, [count]);
  
  const memoizedCallbackAlt = useMemo(() => {
    return () => doSomething(count);
  }, [count]);
  
  return <div>{expensiveValue}</div>;
}

// Real-World Example: Search with Debounce
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  // Memoize debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      searchAPI(searchTerm).then(setResults);
    }, 300),
    []  // Create debounce function only once
  );
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return (
    <div>
      <input value={query} onChange={handleChange} />
      <ResultsList results={results} />
    </div>
  );
}

// Complex Example: Data Grid
function DataGrid({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  
  // Memoize filtered data
  const filteredData = useMemo(() => {
    console.log('Filtering data...');
    return data.filter(item =>
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [data, filterText]);
  
  // Memoize sorted data
  const sortedData = useMemo(() => {
    console.log('Sorting data...');
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);
  
  // Memoize sort handler
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);
  
  return (
    <div>
      <input
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        placeholder="Filter..."
      />
      <Table data={sortedData} onSort={handleSort} />
    </div>
  );
}

// When NOT to use useMemo/useCallback
function DontOverOptimize() {
  const [count, setCount] = useState(0);
  
  //  Unnecessary - Simple calculation
  const double = useMemo(() => count * 2, [count]);  // Overhead not worth it
  
  //  Just calculate directly
  const double = count * 2;
  
  //  Unnecessary - Child not memoized
  const handleClick = useCallback(() => {
    console.log(count);
  }, [count]);
  
  return <RegularComponent onClick={handleClick} />;  // Not memo'd, so pointless
  
  //  Only use with memo'd components
  return <MemoizedComponent onClick={handleClick} />;
}

// Dependencies Matter!
function DependencyExamples() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'Alice' });
  
  //  Missing dependencies (ESLint will warn)
  const value = useMemo(() => {
    return count + user.age;
  }, [count]);  // Missing user!
  
  //  All dependencies included
  const value = useMemo(() => {
    return count + user.age;
  }, [count, user.age]);
  
  //  Object in dependency array
  const handleClick = useCallback(() => {
    console.log(user.name);
  }, [user]);  // user is new object every render!
  
  //  Only include what you need
  const handleClick = useCallback(() => {
    console.log(user.name);
  }, [user.name]);  // Only re-create if name changes
}

// Performance Profiling
function ProfiledComponent() {
  // Use React DevTools Profiler to see:
  // 1. How often component renders
  // 2. How long renders take
  // 3. What causes renders
  
  // Add useMemo/useCallback based on profiling, not guessing!
  
  return <ExpensiveComponent />;
}
```

####  Follow-up Discussion Points:
- "useMemo and useCallback themselves have a cost - only use when profiling shows a benefit"
- "Always include all dependencies - ESLint plugin (eslint-plugin-react-hooks) helps catch this"
- "useCallback is essential when passing callbacks to React.memo'd children"
- "In React 19, there's a compiler that auto-memoizes - these hooks may be less necessary"

####  Weak Answer:
- "They make React faster" (oversimplification)
- Using them everywhere without profiling
- Not understanding dependencies
- Not knowing the difference between them

#### Common Interviewer Follow-ups:
1. **"What's the cost of using useMemo/useCallback?"**
   - "They have overhead: allocating the memoization cache, checking dependencies on every render, and storing the memoized value. For simple operations, this overhead can exceed the cost of just recalculating. Always profile before optimizing."

2. **"When is useMemo actually beneficial?"**
   - "When the computation is expensive (complex calculations, large array operations), when the result is passed to a React.memo'd component, or when the value is used in other hooks' dependency arrays. For simple calculations like `count * 2`, it's not worth it."

3. **"Why do you need useCallback if you have useMemo?"**
   - "useCallback is syntactic sugar for memoizing functions specifically. It's clearer and more readable than `useMemo(() => fn, deps)`. The React team added it because memoizing callbacks is such a common pattern."

---

### **Q15: How do you create custom Hooks? Give examples**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"Custom Hooks are JavaScript functions that start with 'use' and can call other Hooks. They let you extract and reuse stateful logic across components.

**Benefits:**
- **Reusability** - Share logic between components
- **Separation of Concerns** - Extract complex logic from components
- **Testability** - Test logic independently
- **Composition** - Combine multiple hooks

**Rules:**
- Name must start with 'use'
- Can only be called from React functions (components or other hooks)
- Follow all Rules of Hooks"

####  What to Say (Exact Phrasing):
```jsx
// Basic Custom Hook: useToggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);
  
  return [value, toggle];
}

// Usage
function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);
  
  return (
    <div>
      <button onClick={toggleOpen}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={toggleOpen}>Close</button>
        </div>
      )}
    </div>
  );
}

// Custom Hook: useLocalStorage
function useLocalStorage(key, initialValue) {
  // Get from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  // Update localStorage when value changes
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function like useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <p>Current theme: {theme}</p>
    </div>
  );
}

// Custom Hook: useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    setLoading(true);
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!cancelled) {
          setData(data);
          setError(null);
        }
      })
      .catch(error => {
        if (!cancelled) {
          setError(error.message);
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Custom Hook: useDebounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // API call with debounced value
      searchAPI(debouncedSearchTerm).then(setResults);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}

// Custom Hook: useWindowSize
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return windowSize;
}

// Usage
function ResponsiveComponent() {
  const { width } = useWindowSize();
  
  return (
    <div>
      {width < 768 ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}

// Custom Hook: useForm
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (name) => (event) => {
    const value = event.target.value;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBlur = (name) => () => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate single field
    if (validate) {
      const fieldErrors = validate({ ...values });
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name]
      }));
    }
  };
  
  const handleSubmit = (onSubmit) => async (event) => {
    event.preventDefault();
    
    // Validate all fields
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
}

// Usage
function LoginForm() {
  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };
  
  const form = useForm(
    { email: '', password: '' },
    validate
  );
  
  const onSubmit = async (values) => {
    await loginAPI(values);
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange('email')}
        onBlur={form.handleBlur('email')}
      />
      {form.touched.email && form.errors.email && (
        <span>{form.errors.email}</span>
      )}
      
      <input
        type="password"
        name="password"
        value={form.values.password}
        onChange={form.handleChange('password')}
        onBlur={form.handleBlur('password')}
      />
      {form.touched.password && form.errors.password && (
        <span>{form.errors.password}</span>
      )}
      
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// Composing Custom Hooks
function useUserWithPosts(userId) {
  const { data: user, loading: userLoading } = useFetch(`/api/users/${userId}`);
  const { data: posts, loading: postsLoading } = useFetch(`/api/users/${userId}/posts`);
  
  return {
    user,
    posts,
    loading: userLoading || postsLoading
  };
}

// Advanced: Custom Hook with useReducer
function useAsync(asyncFunction) {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'LOADING':
          return { ...state, loading: true, error: null };
        case 'SUCCESS':
          return { loading: false, data: action.data, error: null };
        case 'ERROR':
          return { loading: false, data: null, error: action.error };
        default:
          return state;
      }
    },
    { loading: false, data: null, error: null }
  );
  
  const execute = useCallback(async (...params) => {
    dispatch({ type: 'LOADING' });
    try {
      const data = await asyncFunction(...params);
      dispatch({ type: 'SUCCESS', data });
      return data;
    } catch (error) {
      dispatch({ type: 'ERROR', error: error.message });
      throw error;
    }
  }, [asyncFunction]);
  
  return { ...state, execute };
}
```

####  Follow-up Discussion Points:
- "Custom hooks make testing easier - test logic without rendering components"
- "They enable separation of concerns - UI components stay focused on rendering"
- "Popular libraries (React Query, SWR) are built on custom hooks"
- "Name MUST start with 'use' - this is how React identifies hooks"

####  Weak Answer:
- "Custom hooks are just functions"
- Not following naming convention
- Not understanding when to extract logic
- Creating hooks that don't actually need hooks

#### Common Interviewer Follow-ups:
1. **"When should you create a custom hook?"**
   - "When you have stateful logic that's used in multiple components, or when a component is too complex and you want to extract concerns. Examples: data fetching patterns, form handling, browser API access, or any complex useState/useEffect combinations that are reusable."

2. **"Can custom hooks call other hooks?"**
   - "Yes! Custom hooks can call any built-in hooks (useState, useEffect, etc.) or other custom hooks. This is how you compose complex behavior from simpler hooks. Just follow the Rules of Hooks - only call at the top level."

3. **"How do you test custom hooks?"**
   - "Use React Testing Library's `renderHook` utility. It lets you test hooks in isolation without creating a component. You can test state changes, effects, and returned values directly."

---

*[Guide continues with remaining sections: Q16-45, covering practical coding, real-world scenarios, advanced patterns, behavioral questions, quick fire round, and success tips]*

---

**Good luck with your React interviews! **

*Remember: Understanding WHY React works the way it does is more valuable than memorizing syntax.*

## �� PRACTICAL CODING QUESTIONS (Q16-20)
### Build Real Components and Solutions

---

### **Q16: Build a custom useDebounce hook and demonstrate its usage**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"I'll create a debounce hook that delays updating a value until after a specified time has passed without changes. This is essential for search inputs and API calls."

####  Complete Implementation:
```jsx
// useDebounce Hook
import { useState, useEffect } from 'react';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    // Set up timeout to update debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Clean up timeout if value changes before delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Example Usage: Search Component
function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Perform search when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      
      fetch(`/api/users?search=${debouncedSearchTerm}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      
      {loading && <p>Searching...</p>}
      
      <ul>
        {results.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      
      <p>API calls only happen 500ms after user stops typing</p>
    </div>
  );
}

// Advanced: Debounce with callback
function useDebouncedCallback(callback, delay = 500) {
  const [timer, setTimer] = useState(null);
  
  const debouncedCallback = (...args) => {
    if (timer) clearTimeout(timer);
    
    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);
    
    setTimer(newTimer);
  };
  
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);
  
  return debouncedCallback;
}
```

####  Key Points:
- "Debouncing prevents excessive API calls - only calls after user stops typing"
- "The cleanup function in useEffect is crucial - it cancels the pending timeout"
- "Typical delay is 300-500ms for optimal UX"
- "This pattern saves bandwidth and reduces server load"

---

### **Q17: Implement a reusable Modal component with Portal**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"I'll create a Modal component using React Portals to render outside the DOM hierarchy, preventing z-index and overflow issues."

####  Complete Implementation:
```jsx
import { createPortal } from 'react-dom';
import { useEffect, useCallback } from 'react';

// Modal Component
function Modal({ isOpen, onClose, children, title }) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  // Close on backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);
  
  if (!isOpen) return null;
  
  // Render modal in a portal (outside root div)
  return createPortal(
    <div 
      className="modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ marginBottom: '20px' }}>
          <h2>{title}</h2>
          <button 
            onClick={onClose}
            style={{ float: 'right', fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body  // Render at body level
  );
}

// Custom Hook for Modal State
function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return {
    isOpen,
    open,
    close,
    toggle
  };
}

// Usage Example
function App() {
  const confirmModal = useModal();
  const infoModal = useModal();
  
  const handleDelete = () => {
    confirmModal.close();
    // Perform delete action
    console.log('Item deleted');
  };
  
  return (
    <div>
      <h1>My Application</h1>
      
      <button onClick={confirmModal.open}>Delete Item</button>
      <button onClick={infoModal.open}>Show Info</button>
      
      <Modal 
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this item?</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={confirmModal.close}>Cancel</button>
        </div>
      </Modal>
      
      <Modal
        isOpen={infoModal.isOpen}
        onClose={infoModal.close}
        title="Information"
      >
        <p>This is some important information.</p>
        <button onClick={infoModal.close}>Got it</button>
      </Modal>
    </div>
  );
}
```

####  Key Points:
- "React Portal renders components outside the parent DOM hierarchy"
- "This prevents CSS overflow/z-index issues with modals"
- "Proper cleanup: remove event listeners, restore body scroll"
- "Accessibility: ESC key to close, click backdrop to close"
- "The custom hook makes modal state management reusable"

---

### **Q18: Create an infinite scroll component**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"I'll build an infinite scroll using the Intersection Observer API to detect when the user reaches the bottom and load more items."

####  Complete Implementation:
```jsx
import { useState, useEffect, useRef, useCallback } from 'react';

// Custom Hook for Infinite Scroll
function useInfiniteScroll(fetchMore, hasMore) {
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // When the sentinel element is visible and we have more data
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          fetchMore().finally(() => setLoading(false));
        }
      },
      { threshold: 1.0 }  // Trigger when 100% visible
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchMore, hasMore, loading]);
  
  return { observerTarget, loading };
}

// Infinite Scroll Component
function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Fetch items from API
  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(`/api/items?page=${page}&limit=20`);
      const data = await response.json();
      
      if (data.items.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...data.items]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [page]);
  
  // Load initial items
  useEffect(() => {
    fetchItems();
  }, []);
  
  const { observerTarget, loading } = useInfiniteScroll(fetchItems, hasMore);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Infinite Scroll Demo</h1>
      
      <div style={{ display: 'grid', gap: '10px' }}>
        {items.map((item, index) => (
          <div
            key={item.id || index}
            style={{
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      
      {/* Sentinel element for intersection observer */}
      {hasMore && (
        <div
          ref={observerTarget}
          style={{
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '20px 0'
          }}
        >
          {loading && <p>Loading more items...</p>}
        </div>
      )}
      
      {!hasMore && (
        <p style={{ textAlign: 'center', padding: '20px' }}>
          No more items to load
        </p>
      )}
    </div>
  );
}

// Alternative: With Virtual Scrolling for Performance
function VirtualInfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);
  const ITEM_HEIGHT = 100;
  const VISIBLE_ITEMS = 10;
  
  const [scrollTop, setScrollTop] = useState(0);
  
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setScrollTop(scrollTop);
      
      // Load more when near bottom
      if (scrollHeight - scrollTop - clientHeight < 200) {
        loadMore();
      }
    }
  }, []);
  
  const loadMore = async () => {
    const response = await fetch(`/api/items?page=${page}`);
    const data = await response.json();
    setItems(prev => [...prev, ...data.items]);
    setPage(prev => prev + 1);
  };
  
  // Calculate which items to render
  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  const endIndex = startIndex + VISIBLE_ITEMS;
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * ITEM_HEIGHT;
  
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: '500px',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      <div style={{ height: items.length * ITEM_HEIGHT }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(item => (
            <div
              key={item.id}
              style={{ height: ITEM_HEIGHT, padding: '10px', border: '1px solid #ddd' }}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

####  Key Points:
- "Intersection Observer is more performant than scroll event listeners"
- "The sentinel element triggers loading when it becomes visible"
- "Prevent duplicate loading with a loading flag"
- "For very long lists (10,000+ items), consider virtual scrolling"
- "Always cleanup observer on unmount"

---

### **Q19: Build a controlled form with validation**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"I'll create a controlled form where React manages the form state, with real-time validation and error handling."

####  Complete Implementation:
```jsx
import { useState } from 'react';

// Validation Rules
const validators = {
  required: (value) => {
    return value.trim() === '' ? 'This field is required' : '';
  },
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Invalid email address' : '';
  },
  
  minLength: (min) => (value) => {
    return value.length < min ? `Must be at least ${min} characters` : '';
  },
  
  password: (value) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter';
    if (!/[a-z]/.test(value)) return 'Must contain lowercase letter';
    if (!/[0-9]/.test(value)) return 'Must contain a number';
    return '';
  },
  
  match: (fieldName, otherValue) => (value) => {
    return value !== otherValue ? `Must match ${fieldName}` : '';
  }
};

// Registration Form Component
function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Validate single field
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'username':
        error = validators.required(value) || validators.minLength(3)(value);
        break;
      case 'email':
        error = validators.required(value) || validators.email(value);
        break;
      case 'password':
        error = validators.required(value) || validators.password(value);
        break;
      case 'confirmPassword':
        error = validators.required(value) || 
                validators.match('password', formData.password)(value);
        break;
      case 'agreeToTerms':
        error = !value ? 'You must agree to terms' : '';
        break;
      default:
        break;
    }
    
    return error;
  };
  
  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };
  
  // Handle input blur
  const handleBlur = (e) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Submit form data
      console.log('Form submitted:', formData);
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      });
      setErrors({});
      setTouched({});
      
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Create Account</h2>
      
      {submitSuccess && (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '20px', borderRadius: '4px' }}>
          Registration successful!
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            Username *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${touched.username && errors.username ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
          />
          {touched.username && errors.username && (
            <span style={{ color: 'red', fontSize: '14px' }}>{errors.username}</span>
          )}
        </div>
        
        {/* Email */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${touched.email && errors.email ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
          />
          {touched.email && errors.email && (
            <span style={{ color: 'red', fontSize: '14px' }}>{errors.email}</span>
          )}
        </div>
        
        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${touched.password && errors.password ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
          />
          {touched.password && errors.password && (
            <span style={{ color: 'red', fontSize: '14px' }}>{errors.password}</span>
          )}
        </div>
        
        {/* Confirm Password */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${touched.confirmPassword && errors.confirmPassword ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <span style={{ color: 'red', fontSize: '14px' }}>{errors.confirmPassword}</span>
          )}
        </div>
        
        {/* Terms Checkbox */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ marginRight: '8px' }}
            />
            I agree to terms and conditions *
          </label>
          {touched.agreeToTerms && errors.agreeToTerms && (
            <span style={{ color: 'red', fontSize: '14px' }}>{errors.agreeToTerms}</span>
          )}
        </div>
        
        {/* Submit Error */}
        {errors.submit && (
          <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '20px', borderRadius: '4px' }}>
            {errors.submit}
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
```

####  Key Points:
- "Controlled components: React owns the form state, not the DOM"
- "Validate on blur for better UX - not too aggressive"
- "Show errors only after field is touched"
- "Disable submit button during submission to prevent double-submit"
- "Use noValidate on form to disable HTML5 validation and use custom validation"

---

### **Q20: Implement a drag and drop component**
**Difficulty**:  Senior | **Frequency**: 

####  Strong Answer:
"I'll create a drag and drop interface using HTML5 Drag and Drop API, allowing users to reorder items."

####  Complete Implementation:
```jsx
import { useState } from 'react';

function DraggableList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1', color: '#FF6B6B' },
    { id: 2, text: 'Item 2', color: '#4ECDC4' },
    { id: 3, text: 'Item 3', color: '#45B7D1' },
    { id: 4, text: 'Item 4', color: '#FFA07A' },
    { id: 5, text: 'Item 5', color: '#98D8C8' }
  ]);
  
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  const handleDragStart = (index) => (e) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
  };
  
  const handleDragOver = (index) => (e) => {
    e.preventDefault();  // Necessary to allow drop
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Reorder items
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    
    // Remove from old position
    newItems.splice(draggedIndex, 1);
    // Insert at new position
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
    setDraggedIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Drag and Drop List</h2>
      <p style={{ color: '#666' }}>Drag items to reorder them</p>
      
      <div style={{ marginTop: '20px' }}>
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver(index)}
            onDragEnd={handleDragEnd}
            style={{
              padding: '15px',
              margin: '10px 0',
              backgroundColor: item.color,
              color: 'white',
              borderRadius: '8px',
              cursor: 'move',
              opacity: draggedIndex === index ? 0.5 : 1,
              transition: 'opacity 0.2s',
              userSelect: 'none'
            }}
          >
            <span style={{ marginRight: '10px' }}></span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// Advanced: File Upload with Drag and Drop
function FileDropZone() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };
  
  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };
  
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>File Upload</h2>
      
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#007bff' : '#ddd'}`,
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: isDragging ? '#f0f8ff' : '#fafafa',
          transition: 'all 0.3s',
          cursor: 'pointer'
        }}
      >
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          {isDragging ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p style={{ color: '#666', marginBottom: '20px' }}>or</p>
        <label style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'inline-block'
        }}>
          Choose Files
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      
      {files.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Files ({files.length})</h3>
          {files.map((file, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                margin: '5px 0',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
              }}
            >
              <span>
                 {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </span>
              <button
                onClick={() => removeFile(index)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

####  Key Points:
- "HTML5 Drag and Drop API: dragStart, dragOver, drop events"
- "preventDefault() on dragOver is crucial to allow dropping"
- "Use dataTransfer to pass data between drag events"
- "Visual feedback improves UX - show dragging state"
- "For complex scenarios, consider libraries like react-beautiful-dnd"

---


##  REAL-WORLD SCENARIOS (Q21-25)
### Production-Level Problem Solving

---

### **Q21: How would you implement authentication in a React app?**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"I'd implement authentication using Context API for state management, protected routes, token storage, and automatic token refresh."

####  Complete Architecture:
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Auth Context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in (on app load)
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // Verify token and get user info
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token invalid, clear it
          localStorage.removeItem('accessToken');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Set user
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const logout = () => {
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Clear user
    setUser(null);
    
    // Optional: Call logout API
    fetch('/api/auth/logout', { method: 'POST' });
  };
  
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
    
    return null;
  };
  
  const value = {
    user,
    loading,
    login,
    logout,
    refreshAccessToken
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Protected Route Component
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    // Redirect to login, save intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

// API Interceptor for automatic token refresh
export function setupAPIInterceptor(refreshAccessToken, logout) {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    let [url, config] = args;
    
    // Add token to headers
    const token = localStorage.getItem('accessToken');
    if (token && config?.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    let response = await originalFetch(url, config);
    
    // If 401, try to refresh token
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry request with new token
        if (config?.headers) {
          config.headers['Authorization'] = `Bearer ${newToken}`;
        }
        response = await originalFetch(url, config);
      } else {
        // Refresh failed, logout user
        logout();
      }
    }
    
    return response;
  };
}

// Usage in App
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Login Page
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit">Login</button>
    </form>
  );
}

// Dashboard with Auth
function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

####  Key Points:
- "Store tokens in localStorage (or httpOnly cookies for better security)"
- "Protected routes redirect to login if user not authenticated"
- "Automatic token refresh prevents user from being logged out"
- "Context API avoids prop drilling for auth state"
- "For production, consider NextAuth.js or Auth0"

---

### **Q22: How do you optimize performance in a large React application?**
**Difficulty**:  Senior | **Frequency**: 

####  Strong Answer:
"Performance optimization involves multiple strategies: code splitting, memoization, virtualization, lazy loading, and proper state management."

####  Optimization Techniques:
```jsx
// 1. Code Splitting with React.lazy and Suspense
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// 2. React.memo for Component Memoization
const ExpensiveComponent = React.memo(({ data }) => {
  console.log('Rendering expensive component');
  
  return (
    <div>
      {/* Complex rendering logic */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.id === nextProps.data.id;
});

// 3. useMemo for Expensive Calculations
function DataGrid({ data, filters }) {
  // Memoize filtered data
  const filteredData = useMemo(() => {
    console.log('Filtering data...');
    return data.filter(item => {
      // Complex filtering logic
      return filters.every(filter => 
        item[filter.key] === filter.value
      );
    });
  }, [data, filters]);
  
  // Memoize sorted data
  const sortedData = useMemo(() => {
    console.log('Sorting data...');
    return [...filteredData].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }, [filteredData]);
  
  return (
    <div>
      {sortedData.map(item => (
        <DataRow key={item.id} item={item} />
      ))}
    </div>
  );
}

// 4. Virtual Scrolling for Large Lists
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// 5. Debouncing User Input
function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  useEffect(() => {
    if (debouncedQuery) {
      // API call only happens after 500ms of no typing
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// 6. Intersection Observer for Lazy Loading Images
function LazyImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (isVisible) {
      setImageSrc(src);
    }
  }, [isVisible, src]);
  
  return (
    <img
      ref={imgRef}
      src={imageSrc || 'placeholder.jpg'}
      alt={alt}
      loading="lazy"
    />
  );
}

// 7. Web Workers for Heavy Computations
function useWebWorker(workerFunction) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const runWorker = useCallback((data) => {
    setLoading(true);
    
    // Create worker from function
    const worker = new Worker(
      URL.createObjectURL(
        new Blob([`(${workerFunction})()`])
      )
    );
    
    worker.onmessage = (e) => {
      setResult(e.data);
      setLoading(false);
      worker.terminate();
    };
    
    worker.onerror = (e) => {
      setError(e.message);
      setLoading(false);
      worker.terminate();
    };
    
    worker.postMessage(data);
  }, [workerFunction]);
  
  return { result, error, loading, runWorker };
}

// 8. Optimize Context to Prevent Unnecessary Re-renders
const StateContext = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Separate contexts prevent re-renders
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// 9. Production Build Optimizations
// package.json scripts
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite-bundle-visualizer"
  }
}

// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui': ['@mui/material']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true  // Remove console.logs in production
      }
    }
  }
};

// 10. Performance Monitoring
import { Profiler } from 'react';

function onRenderCallback(
  id, // the "id" prop of the Profiler tree
  phase, // "mount" or "update"
  actualDuration, // time spent rendering
  baseDuration, // estimated time without memoization
  startTime, // when React began rendering
  commitTime // when React committed the update
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
  
  // Send to analytics
  if (actualDuration > 100) {
    trackSlowRender({ id, phase, actualDuration });
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  );
}
```

####  Key Points:
- "**Measure first** - Use React DevTools Profiler to identify bottlenecks"
- "**Code splitting** reduces initial bundle size significantly"
- "**Virtual scrolling** essential for lists with 1000+ items"
- "**Memoization** helps but adds overhead - use judiciously"
- "**Split contexts** to prevent unnecessary consumer re-renders"

---

### **Q23: How would you handle state management in a large application?**
**Difficulty**:  Senior | **Frequency**: 

####  Strong Answer:
"For large applications, I'd use a combination of local state (useState), Context for app-wide state, and a dedicated state management library (Redux, Zustand, or Jotai) for complex global state."

####  State Management Architecture:
```jsx
// Option 1: Context + useReducer (Medium apps)
import { createContext, useContext, useReducer } from 'react';

// Actions
const actions = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  SET_FILTER: 'SET_FILTER'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case actions.ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    
    case actions.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    
    case actions.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    case actions.SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };
    
    default:
      return state;
  }
}

// Context
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    todos: [],
    filter: 'all'
  });
  
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// Hooks
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('Must use within AppProvider');
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) throw new Error('Must use within AppProvider');
  return context;
}

// Option 2: Zustand (Simpler than Redux)
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        todos: [],
        filter: 'all',
        
        // Actions
        addTodo: (todo) => set((state) => ({
          todos: [...state.todos, todo]
        })),
        
        toggleTodo: (id) => set((state) => ({
          todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        })),
        
        deleteTodo: (id) => set((state) => ({
          todos: state.todos.filter(todo => todo.id !== id)
        })),
        
        setFilter: (filter) => set({ filter }),
        
        // Computed values
        get filteredTodos() {
          const { todos, filter } = get();
          if (filter === 'active') return todos.filter(t => !t.completed);
          if (filter === 'completed') return todos.filter(t => t.completed);
          return todos;
        }
      }),
      { name: 'todo-storage' }  // localStorage key
    )
  )
);

// Usage
function TodoList() {
  const todos = useStore(state => state.filteredTodos);
  const toggleTodo = useStore(state => state.toggleTodo);
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// Option 3: Redux Toolkit (Large, complex apps)
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

// Slice
const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    filter: 'all',
    loading: false,
    error: null
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

// Async thunk
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response = await fetch('/api/todos');
    return response.json();
  }
);

// Store
export const store = configureStore({
  reducer: {
    todos: todosSlice.reducer
  }
});

// Selectors
export const selectTodos = (state) => state.todos.items;
export const selectFilter = (state) => state.todos.filter;
export const selectFilteredTodos = (state) => {
  const { items, filter } = state.todos;
  if (filter === 'active') return items.filter(t => !t.completed);
  if (filter === 'completed') return items.filter(t => t.completed);
  return items;
};

// Usage
function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector(selectFilteredTodos);
  
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(todosSlice.actions.toggleTodo(todo.id))}
          />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// Decision Matrix
/*
State Management Choice Guide:

1. Local State (useState)
   - Use for: Component-specific state
   - Examples: Form inputs, toggles, local UI state
   - Pros: Simple, no overhead
   - Cons: Can't share across components

2. Context + useReducer
   - Use for: App-wide state (theme, auth, language)
   - Team size: Small to medium
   - Pros: Built-in, no external deps
   - Cons: Performance issues with frequent updates

3. Zustand
   - Use for: Medium to large apps
   - Team size: Any
   - Pros: Simple API, great performance, small bundle
   - Cons: Less mature ecosystem than Redux

4. Redux Toolkit
   - Use for: Large, complex apps with many developers
   - Team size: Medium to large
   - Pros: Excellent dev tools, time-travel debugging, middleware
   - Cons: More boilerplate, steeper learning curve

5. Jotai / Recoil
   - Use for: Atomic state management
   - Pros: Minimal re-renders, flexible
   - Cons: Newer, smaller community
*/
```

####  Key Points:
- "**Keep state as local as possible** - only lift to global when necessary"
- "**Context is fine for infrequent updates** (theme, auth)"
- "**Use Redux for complex workflows** with middleware needs"
- "**Zustand offers best simplicity/power ratio** for most apps"
- "**Always use selectors** to prevent unnecessary re-renders"

---

### **Q24: How do you handle error boundaries and error handling in React?**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"Error boundaries catch JavaScript errors anywhere in the component tree, log errors, and display a fallback UI instead of crashing the entire app."

####  Implementation:
```jsx
// Error Boundary Component (Class-based - required)
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  
  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to error tracking service (Sentry, LogRocket, etc.)
    logErrorToService(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }
  
  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1> Something went wrong</h1>
          <p>We're sorry for the inconvenience. The error has been reported.</p>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
              <summary>Error Details (Dev Only)</summary>
              <p><strong>Error:</strong> {this.state.error?.toString()}</p>
              <p><strong>Stack:</strong></p>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
          
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage in App
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            } 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

// Async Error Handling Hook
function useAsyncError() {
  const [, setError] = useState();
  
  return useCallback(
    (error) => {
      setError(() => {
        throw error;  // Throw to be caught by error boundary
      });
    },
    [setError]
  );
}

// Usage with async operations
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const throwError = useAsyncError();
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(setUser)
      .catch(throwError)  // Throw to error boundary
      .finally(() => setLoading(false));
  }, [userId, throwError]);
  
  if (loading) return <Spinner />;
  
  return <div>{user.name}</div>;
}

// Global Error Handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to error tracking
  logErrorToService(event.reason);
});

// API Error Interceptor
async function apiCall(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      
      if (response.status === 404) {
        throw new Error('Resource not found');
      }
      
      if (response.status >= 500) {
        throw new Error('Server error - please try again later');
      }
      
      throw new Error(`Request failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    // Network error
    if (error.name === 'TypeError') {
      throw new Error('Network error - please check your connection');
    }
    
    throw error;
  }
}

// Toast Notifications for User-Friendly Errors
import { toast } from 'react-toastify';

function handleError(error) {
  // User-friendly error messages
  const errorMessages = {
    'NetworkError': 'Please check your internet connection',
    'Unauthorized': 'Please log in to continue',
    'NotFound': 'The requested resource was not found',
    'ServerError': 'Something went wrong. Please try again later'
  };
  
  const message = errorMessages[error.name] || error.message;
  toast.error(message);
  
  // Log to error tracking
  logErrorToService(error);
}

// Custom Hook for Error Handling
function useErrorHandler() {
  const showError = (error) => {
    toast.error(error.message);
    console.error(error);
  };
  
  const showSuccess = (message) => {
    toast.success(message);
  };
  
  return { showError, showSuccess };
}
```

####  Key Points:
- "**Error boundaries don't catch**: event handlers, async code, SSR, errors in the boundary itself"
- "**Use multiple boundaries** for graceful degradation - isolate critical sections"
- "**Always log errors** to a service (Sentry, LogRocket) in production"
- "**Show user-friendly messages** - don't expose technical errors to users"
- "**Have retry mechanisms** for failed network requests"

---

### **Q25: Implement a real-time feature (like chat or notifications)**
**Difficulty**:  Senior | **Frequency**: 

####  Strong Answer:
"I'd implement real-time features using WebSockets or Server-Sent Events, with proper connection management, reconnection logic, and optimistic updates."

####  Complete Implementation:
```jsx
// WebSocket Hook
import { useEffect, useRef, useState, useCallback } from 'react';

function useWebSocket(url) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Reconnect with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current++;
          connect();
        }, delay);
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, [url]);
  
  const sendMessage = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);
  
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);
  
  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);
  
  return {
    isConnected,
    messages,
    sendMessage,
    disconnect
  };
}

// Chat Component
function ChatRoom({ roomId, userId, username }) {
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);
  
  const { isConnected, messages, sendMessage } = useWebSocket(
    `wss://api.example.com/chat/${roomId}`
  );
  
  // Add received messages to chat
  useEffect(() => {
    messages.forEach(msg => {
      if (msg.type === 'message') {
        setChatMessages(prev => [...prev, msg.data]);
      }
    });
  }, [messages]);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSend = (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    const message = {
      type: 'message',
      data: {
        id: Date.now(),
        userId,
        username,
        text: messageText,
        timestamp: new Date().toISOString()
      }
    };
    
    // Optimistic update
    setChatMessages(prev => [...prev, message.data]);
    
    // Send to server
    const sent = sendMessage(message);
    
    if (sent) {
      setMessageText('');
    } else {
      // Rollback on failure
      setChatMessages(prev => prev.filter(m => m.id !== message.data.id));
      alert('Failed to send message. Please check your connection.');
    }
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', border: '1px solid #ddd' }}>
      {/* Header */}
      <div style={{ padding: '15px', borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
        <h3>Chat Room: {roomId}</h3>
        <span style={{ fontSize: '12px', color: isConnected ? 'green' : 'red' }}>
          {isConnected ? '● Connected' : '● Disconnected'}
        </span>
      </div>
      
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            style={{
              marginBottom: '15px',
              textAlign: msg.userId === userId ? 'right' : 'left'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                maxWidth: '70%',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: msg.userId === userId ? '#007bff' : '#e9ecef',
                color: msg.userId === userId ? 'white' : 'black'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
                {msg.username}
              </div>
              <div>{msg.text}</div>
              <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.7 }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '15px', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />
        <button
          type="submit"
          disabled={!isConnected || !messageText.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isConnected ? 'pointer' : 'not-allowed'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

// Notification System
function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const { messages } = useWebSocket('wss://api.example.com/notifications');
  
  useEffect(() => {
    messages.forEach(msg => {
      if (msg.type === 'notification') {
        addNotification(msg.data);
      }
    });
  }, [messages]);
  
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, ...notification }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return { notifications, removeNotification };
}

// Notification Display
function NotificationCenter() {
  const { notifications, removeNotification } = useNotifications();
  
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
      {notifications.map(notif => (
        <div
          key={notif.id}
          style={{
            padding: '15px',
            marginBottom: '10px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            maxWidth: '300px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <strong>{notif.title}</strong>
            <button
              onClick={() => removeNotification(notif.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
            >
              ×
            </button>
          </div>
          <p>{notif.message}</p>
        </div>
      ))}
    </div>
  );
}
```

####  Key Points:
- "**WebSocket reconnection** is critical - use exponential backoff"
- "**Optimistic updates** improve UX - update UI immediately, rollback on failure"
- "**Handle connection status** - show indicators, disable inputs when disconnected"
- "**Consider Server-Sent Events (SSE)** for one-way real-time data"
- "**For production, use libraries** like Socket.io or use managed services (Pusher, Ably)"

---

## REACT 19 — NEW FEATURES (2024–2025)
### The Next Generation of React APIs

> React 19 was released stable in December 2024. These APIs are increasingly asked in 2025–2026 interviews, especially for senior roles.

---

### **Q: What are Actions in React 19?**
**Difficulty**: Senior | **Frequency**: Rising Fast

#### Strong Answer:
"React 19 introduces **Actions** — a first-class pattern for handling async state transitions (especially form submissions and mutations). Before, you had to manually manage `isPending`, `error`, and `data` state for every async operation. Actions unify this with `useActionState` and `useFormStatus`."

#### What to Say (Exact Phrasing):
```jsx
// BEFORE React 19 — manual async state management
function UpdateName() {
  const [name, setName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    try {
      await updateUsername(name);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      {isPending && <span>Saving...</span>}
      {error && <span>{error}</span>}
      <button type="submit" disabled={isPending}>Save</button>
    </form>
  );
}

// AFTER React 19 — Actions handle all of this
import { useActionState } from 'react';

async function updateNameAction(prevState, formData) {
  const name = formData.get('name');
  try {
    await updateUsername(name);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(
    updateNameAction,
    { success: false, error: null }
  );

  return (
    <form action={submitAction}>  {/* action prop accepts async function! */}
      <input name="name" />
      {isPending && <span>Saving...</span>}
      {state.error && <span>{state.error}</span>}
      {state.success && <span>Saved!</span>}
      <button type="submit" disabled={isPending}>Save</button>
    </form>
  );
}
```

#### Follow-up Discussion Points:
- "React 19 lets `<form action>` accept an async function directly — no `e.preventDefault()` needed"
- "The transition is automatically wrapped, so `isPending` works out of the box"
- "Works with React Server Actions in Next.js for end-to-end type-safe mutations"

---

### **Q: What is useFormStatus and when do you use it?**
**Difficulty**: Mid-Senior | **Frequency**: Rising

#### Strong Answer:
"`useFormStatus` allows a child component inside a `<form>` to read the form's pending state — without prop drilling. This makes it easy to build reusable `<SubmitButton>` components that automatically disable themselves while the form is submitting."

#### What to Say (Exact Phrasing):
```jsx
import { useFormStatus } from 'react-dom';

// Reusable submit button that knows about its parent form's state
function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

// Usage — SubmitButton just works, no props needed
function ProfileForm() {
  const [state, submitAction] = useActionState(updateProfileAction, null);

  return (
    <form action={submitAction}>
      <input name="username" />
      <input name="bio" />
      <SubmitButton />  {/* Automatically disabled while pending */}
    </form>
  );
}
```

#### Key Rule:
- `useFormStatus` must be called **inside** the `<form>` tree (in a child component) — not in the same component that renders the form.

---

### **Q: What is useOptimistic? How does it improve UX?**
**Difficulty**: Senior | **Frequency**: Medium

#### Strong Answer:
"`useOptimistic` lets you show an optimistic (expected) UI state immediately while an async operation is in flight, then automatically reverts to the real state when the operation completes or fails. It dramatically improves perceived performance."

#### What to Say (Exact Phrasing):
```jsx
import { useOptimistic, useActionState } from 'react';

function TodoList({ todos }) {
  // optimisticTodos: shows immediate update
  // addOptimisticTodo: function to trigger optimistic update
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [...currentTodos, { ...newTodo, sending: true }]
  );

  async function addTodoAction(formData) {
    const text = formData.get('text');
    const optimisticTodo = { id: Date.now(), text };

    // Show optimistic update immediately
    addOptimisticTodo(optimisticTodo);

    // Actually save to server (may take 500ms+)
    await saveTodo(text);
  }

  return (
    <>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.sending ? 0.5 : 1 }}>
            {todo.text}
            {todo.sending && ' (saving...)'}
          </li>
        ))}
      </ul>
      <form action={addTodoAction}>
        <input name="text" />
        <button type="submit">Add</button>
      </form>
    </>
  );
}
```

#### Follow-up Discussion Points:
- "On success, the optimistic state is replaced by the real server data"
- "On failure, it automatically reverts to the original state"
- "This is the React-native answer to libraries like SWR's `mutate` or React Query's `optimisticUpdate`"

---

### **Q: What is the use() hook in React 19?**
**Difficulty**: Senior | **Frequency**: Medium

#### Strong Answer:
"The `use()` hook lets you read a Promise or Context value inside a component. Unlike `useContext`, `use()` can be called conditionally. Unlike `await`, it works inside render — React suspends the component automatically until the Promise resolves."

#### What to Say (Exact Phrasing):
```jsx
import { use, Suspense } from 'react';

// use() with a Promise — replaces async data fetching patterns
function UserProfile({ userPromise }) {
  // React will suspend this component until the promise resolves
  const user = use(userPromise);

  return <h1>{user.name}</h1>;
}

// Usage with Suspense boundary
function App() {
  const userPromise = fetchUser(1); // Start fetch outside component

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}

// use() with Context — works conditionally (unlike useContext)
function ThemedButton({ isAdmin }) {
  if (isAdmin) {
    // This is valid in React 19 — use() can be called in conditions
    const theme = use(ThemeContext);
    return <button style={{ background: theme.adminColor }}>Admin</button>;
  }
  return <button>User</button>;
}
```

#### Key Differences from existing hooks:
| Feature | `useContext` | `use()` |
|---|---|---|
| Conditional calls | Not allowed | Allowed |
| Works with Promises | No | Yes |
| Suspense integration | No | Yes (automatic) |

---

### **Q: What is the React Compiler (React Forget)?**
**Difficulty**: Senior | **Frequency**: Growing

#### Strong Answer:
"The React Compiler (formerly React Forget) is a compile-time optimization tool that automatically adds memoization (the equivalent of `useMemo`, `useCallback`, and `React.memo`) to your components. This means you can write simpler code without manually optimizing re-renders, and the compiler handles it."

#### What to Say (Exact Phrasing):
```jsx
// BEFORE React Compiler — you manually memoize
function ExpensiveList({ items, onSelect }) {
  const sorted = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  const handleSelect = useCallback(
    (id) => onSelect(id),
    [onSelect]
  );

  return <List items={sorted} onSelect={handleSelect} />;
}

// AFTER React Compiler — write simple code, compiler handles memoization
function ExpensiveList({ items, onSelect }) {
  // Compiler automatically figures out what to memoize
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name));

  return <List items={sorted} onSelect={(id) => onSelect(id)} />;
}
// Same performance — less code!
```

#### Key Points:
- Introduced experimentally in React 19; stable rollout ongoing
- Works at build time — no runtime overhead
- Requires components to follow React's rules (pure functions, immutable state)
- Already used at Meta in production (Instagram, WhatsApp Web)
- Doesn't replace all manual optimization, but eliminates 80% of it

---

### **Q: What changed in ref handling in React 19?**
**Difficulty**: Mid-Level | **Frequency**: Medium

#### Strong Answer:
"In React 19, `ref` is now a regular prop instead of a special reserved attribute. This means you no longer need `forwardRef` to pass refs to child components."

#### What to Say (Exact Phrasing):
```jsx
// BEFORE React 19 — forwardRef required
const MyInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

// AFTER React 19 — ref is just a prop
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

// Usage is the same
function Form() {
  const inputRef = useRef(null);

  return (
    <form>
      <MyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </form>
  );
}
```

#### Other React 19 Quality-of-Life Improvements:
- **`<Context>` as provider** — `<Context.Provider>` can now be written as `<Context>` directly
- **Improved hydration errors** — Much clearer diffs showing server vs client mismatch
- **Document metadata** — `<title>`, `<meta>`, `<link>` in components automatically hoist to `<head>`

```jsx
// Document metadata hoisting — React 19
function BlogPost({ post }) {
  return (
    <article>
      {/* These automatically move to <head> */}
      <title>{post.title}</title>
      <meta name="description" content={post.summary} />
      <link rel="canonical" href={post.url} />

      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

---

