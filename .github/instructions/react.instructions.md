# React コードレビュー指示

**applyTo**: `src/app/**/*`, `src/components/**/*`, `src/hooks/**/*`

このファイルは React に特化したコードレビュー指示を提供します。基本的なコーディング規則は `AGENTS.md` を参照してください。

## React コンポーネント構造のレビューポイント

### 1. コンポーネントの単一責任原則

**1 つのコンポーネントは 1 つの責務を持つべきです。**

#### チェック項目

- コンポーネントが複数の独立した機能を持っていないか
- UI の表示とビジネスロジックが適切に分離されているか
- 1 つのコンポーネントが 200 行を超える場合は分割を検討

#### 分割の提案

**悪い例:**
```tsx
// UserProfilePage.tsx - 複数の責務が混在
export default function UserProfilePage() {
  // プロフィール情報の取得
  // 投稿一覧の取得
  // フォロワー情報の取得
  // 各種編集機能
  // 複雑な UI レンダリング
  return (/* 大量の JSX */);
}
```

**良い例:**
```tsx
// UserProfilePage.tsx - 責務を分割
export default function UserProfilePage() {
  return (
    <div>
      <UserProfileHeader />
      <UserPostList />
      <UserFollowerList />
    </div>
  );
}

// UserProfileHeader.tsx
export function UserProfileHeader() {
  // プロフィール表示に特化
}

// UserPostList.tsx
export function UserPostList() {
  // 投稿一覧表示に特化
}
```

### 2. Props の設計

#### Props の型定義

- すべての props に明示的な型定義があるか
- Optional な props は本当に必要か（デフォルト値で対応できないか）
- Props が多すぎる場合（5 個以上）は設計を見直す

**推奨パターン:**
```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick 
}: ButtonProps) {
  // ...
}
```

#### Children Props の活用

- 柔軟性が必要な場合は `children` props を使用
- コンポジション（合成）パターンの活用

**例:**
```tsx
// 悪い例 - Props が多すぎる
<Card 
  title="タイトル"
  description="説明"
  image="/image.jpg"
  button="クリック"
  onButtonClick={handleClick}
/>

// 良い例 - コンポジションの活用
<Card>
  <CardImage src="/image.jpg" />
  <CardTitle>タイトル</CardTitle>
  <CardDescription>説明</CardDescription>
  <CardButton onClick={handleClick}>クリック</CardButton>
</Card>
```

### 3. 状態管理

#### ローカル状態 vs グローバル状態

- 本当にグローバル状態にする必要があるか
- 状態のスコープを最小限に保つ
- 状態の持ち方が適切か（useState vs useReducer）

**チェックポイント:**
```tsx
// 悪い例 - 不必要なグローバル状態
const GlobalContext = createContext();
function useGlobalState() {
  return useContext(GlobalContext);
}

// 良い例 - 必要な場所でのみローカル状態
function TodoList() {
  const [todos, setTodos] = useState([]);
  // このコンポーネント内でのみ使用
}
```

#### 派生状態の避け方

- 既存の状態から計算できる値は、新しい状態として保持しない
- `useMemo` で計算結果をメモ化（ただし、React 19 の自動メモ化により基本的に不要。詳細は「8. レンダリング最適化」を参照）

**悪い例:**
```tsx
const [todos, setTodos] = useState([]);
const [completedCount, setCompletedCount] = useState(0);

// todos が変更されるたびに completedCount を更新する必要がある
```

**良い例:**
```tsx
const [todos, setTodos] = useState([]);
const completedCount = todos.filter(todo => todo.completed).length;
// 派生状態として計算
```

### 4. コンポーネントの階層構造

#### 適切なコンポーネント分割

- Prop Drilling（props のバケツリレー）が発生していないか
- 3 階層以上の Prop Drilling がある場合は Context の使用を検討

**改善例:**
```tsx
// 悪い例 - Prop Drilling
<GrandParent>
  <Parent data={data}>
    <Child data={data}>
      <GrandChild data={data} />
    </Child>
  </Parent>
</GrandParent>

// 良い例 - Context の使用
const DataContext = createContext();

<DataContext.Provider value={data}>
  <GrandParent>
    <Parent>
      <Child>
        <GrandChild />
      </Child>
    </Parent>
  </GrandParent>
</DataContext.Provider>
```

### 5. カスタムフックの活用

#### ロジックの分離

- コンポーネントから複雑なロジックを分離
- 再利用可能なロジックはカスタムフックに抽出
- hooks ディレクトリに配置

**推奨パターン:**
```tsx
// hooks/useFormValidation.ts
export function useFormValidation(initialValues: FormValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    // バリデーションロジック
  };
  
  return { values, errors, validate };
}

// コンポーネント内
function LoginForm() {
  const { values, errors, validate } = useFormValidation({
    email: '',
    password: ''
  });
  
  // UI に専念
}
```

### 6. イベントハンドラー

#### 命名規則

- ハンドラー関数は `handle` プレフィックスを使用（例: `handleClick`, `handleSubmit`）
- Callback props は `on` プレフィックスを使用（例: `onClick`, `onSubmit`）

**例:**
```tsx
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const handleToggle = () => {
    onToggle(todo.id);
  };
  
  const handleDelete = () => {
    onDelete(todo.id);
  };
  
  return (
    <div>
      <button onClick={handleToggle}>Toggle</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

### 7. コンポーネントのエクスポート

#### エクスポート戦略

- 各ディレクトリに `index.ts` を配置し、エクスポートを集約
- Named Export を推奨（デフォルトエクスポートは避ける）

**推奨:**
```tsx
// components/todos/TodoList.tsx
export function TodoList() {
  // ...
}

// components/todos/index.ts
export { TodoList } from './TodoList';
export { TodoItem } from './TodoItem';
export { TodoForm } from './TodoForm';

// 使用側
import { TodoList, TodoItem } from '@/components/todos';
```

### 8. レンダリング最適化

#### React Compiler の活用

- このプロジェクトでは React 19 の自動メモ化機能を前提としているため、`React.memo`, `useMemo`, `useCallback` は基本的に不要
- React 19 では再レンダリングの最適化が自動で行われるため、手動の最適化は避ける
- ただし、React DevTools Profiler で測定して明確なパフォーマンス問題がある場合のみ、個別に最適化を検討

#### レンダリングの確認

- React DevTools Profiler で不要な再レンダリングを確認
- パフォーマンス問題が実際に発生している場合のみ最適化を提案

### 9. useEffect の使用制限と SWR の活用

**このプロジェクトでは、データフェッチに useEffect を使用しないでください。**

この制限の理由：
- **パフォーマンス**: SWR はキャッシング、再検証、重複排除などの最適化を自動で行う
- **SSR 互換性**: Server Components でサーバーサイドデータフェッチが可能
- **コード品質**: useEffect は依存配列の管理が複雑で、バグの原因になりやすい
- **ユーザー体験**: SWR の自動再検証とバックグラウンド更新により、最新データを保持し、より良い UX を提供

#### useEffect の代替案

1. **Server Components**: サーバーサイドでデータフェッチ
2. **SWR**: クライアントサイドでのデータフェッチとキャッシング
3. **イベントハンドラー**: ユーザーアクションに応じた処理

#### SWR の使用

**推奨パターン:**
```tsx
'use client';

import useSWR from 'swr';

export function TodoList() {
  const { data: todos, error, isLoading, mutate } = useSWR('/api/todos');
  
  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;
  
  return (
    <div>
      {todos?.map(todo => (
        <TodoItem key={todo.id} todo={todo} onUpdate={mutate} />
      ))}
    </div>
  );
}
```

#### useEffect が許可されるケース

以下の場合のみ `useEffect` の使用を許可します：

- **ブラウザ API の初期化**: Web Storage、Intersection Observer など
- **サブスクリプション**: WebSocket、イベントリスナーの登録/解除
- **DOM 操作**: サードパーティライブラリとの統合
- **アナリティクス**: ページビューのトラッキング

**許可される例:**
```tsx
'use client';

export function MyComponent() {
  useEffect(() => {
    // ページビューをトラッキング
    analytics.track('page_view', { page: window.location.pathname });
  }, []);
  
  useEffect(() => {
    // イベントリスナーの登録と解除
    const handleResize = () => {
      console.log('Window resized');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
}
```

**禁止される例:**
```tsx
// 悪い例 - データフェッチに useEffect を使用
'use client';

export function TodoList() {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    // これは NG！SWR を使用すべき
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);
  
  return (/* ... */);
}
```

## レビュー時の注意事項

- **過度な最適化は避ける**: React Compiler が自動で最適化するため、手動の最適化は最小限に
- **アクセシビリティの確認**: セマンティック HTML、ARIA 属性、キーボード操作のサポート
- **エラーバウンダリー**: エラー処理が適切に実装されているか
- **テスト可能性**: コンポーネントがテスト可能な設計になっているか
