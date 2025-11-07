# Next.js コードレビュー指示

このファイルは Next.js に特化したコードレビュー指示を提供します。基本的なコーディング規則は `AGENTS.md` を参照してください。

## Next.js 固有のレビューポイント

### 1. ルーティング構造

#### App Router の適切な使用

- `src/app` ディレクトリ配下のファイル構造が Next.js の規約に従っているか
- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` などの特殊ファイルが適切に配置されているか
- ルートグループ `(group)` やダイナミックルート `[id]` が適切に使用されているか

**推奨構造:**
```
src/app/
├── layout.tsx           # ルートレイアウト
├── page.tsx             # トップページ
├── (auth)/              # 認証関連ルートグループ
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── todos/
│   ├── page.tsx         # TODO 一覧
│   ├── [id]/
│   │   └── page.tsx     # TODO 詳細
│   └── loading.tsx      # ローディング UI
└── api/                 # API ルート
    └── todos/
        └── route.ts
```

#### リンクとナビゲーション

- `next/link` の `Link` コンポーネントを使用しているか（`<a>` タグの直接使用は避ける）
- Prefetch の最適化が適切か（`prefetch={false}` の使用判断）

**推奨:**
```tsx
import Link from 'next/link';

// 良い例
<Link href="/todos">TODO 一覧</Link>

// 悪い例
<a href="/todos">TODO 一覧</a>
```

### 2. Server Components と Client Components の使い分け

**このプロジェクトで最も重要なレビューポイントです。**

#### 基本原則

- **デフォルトは Server Components**: 特に理由がない限り Server Components を使用
- **Client Components は必要最小限**: `use client` ディレクティブは本当に必要な場合のみ使用

#### Client Components が必要なケース

以下の場合のみ `use client` を使用してください：

1. **インタラクティブな要素**
   - `useState`, `useReducer` などの React フックを使用
   - イベントハンドラー（`onClick`, `onChange` など）を使用
   
2. **ブラウザ専用 API の使用**
   - `window`, `document`, `localStorage` などを使用
   - `useEffect` でブラウザ環境でのみ動作する処理

3. **React Context の使用**
   - `useContext` でコンテキストを参照

4. **サードパーティライブラリ**
   - クライアント専用のライブラリを使用（例: `react-hook-form`, カスタムフック）

#### Server Components のメリット

- サーバーサイドでのデータフェッチが可能
- バンドルサイズの削減
- SEO の向上
- 初期表示の高速化

**推奨パターン:**
```tsx
// app/todos/page.tsx - Server Component
export default async function TodosPage() {
  // サーバーサイドでデータフェッチ
  const todos = await fetchTodos();
  
  return (
    <div>
      <h1>TODO 一覧</h1>
      <TodoList todos={todos} />
    </div>
  );
}

// components/TodoList.tsx - Client Component（インタラクティブ）
'use client';

export function TodoList({ todos }: { todos: Todo[] }) {
  const [filter, setFilter] = useState('all');
  
  return (
    <div>
      <FilterButtons onFilterChange={setFilter} />
      {todos.filter(/* ... */).map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

#### コンポーネントの分割戦略

- Server Components で可能な限りデータを取得
- Client Components はできるだけツリーの葉（末端）に配置
- Server Components と Client Components の境界を明確に

**悪い例:**
```tsx
// 全体を Client Component にしている
'use client';

export default function TodosPage() {
  const [filter, setFilter] = useState('all');
  const { data: todos } = useSWR('/api/todos');
  
  // すべてがクライアントサイドで動作
  return (/* ... */);
}
```

**良い例:**
```tsx
// Server Component（データフェッチ）
export default async function TodosPage() {
  const todos = await fetchTodos();
  
  return <TodoListClient todos={todos} />;
}

// Client Component（インタラクション）
'use client';
function TodoListClient({ todos }: { todos: Todo[] }) {
  const [filter, setFilter] = useState('all');
  return (/* ... */);
}
```

### 3. useEffect の使用禁止と SWR の活用

**このプロジェクトでは、データフェッチに useEffect を使用しないでください。**

この制限の理由：
- **パフォーマンス**: SWR はキャッシング、再検証、重複排除などの最適化を自動で行う
- **SSR 互換性**: Server Components でサーバーサイドデータフェッチが可能
- **コード品質**: useEffect は依存配列の管理が複雑で、バグの原因になりやすい
- **ユーザー体験**: SWR のリアルタイム更新とローディング状態管理により、より良い UX を提供

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

### 4. Next.js ライブラリの活用

#### next/image の使用

- 画像の最適化のために `next/image` の `Image` コンポーネントを使用
- `<img>` タグの直接使用は避ける
- `width` と `height` を適切に指定（レイアウトシフト防止）

**推奨:**
```tsx
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="プロフィール画像"
  width={200}
  height={200}
  priority={true}  // LCP 改善のため、ファーストビューの画像に使用
/>
```

#### next/font の使用

- フォントの最適化のために `next/font` を使用
- Google Fonts や ローカルフォントの読み込みを最適化

**推奨:**
```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

#### Metadata API の使用

- `metadata` エクスポートまたは `generateMetadata` 関数で SEO を最適化
- 各ページで適切なメタデータを設定

**推奨:**
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TODO 一覧',
  description: 'あなたの TODO を管理します',
};

export default function TodosPage() {
  return (/* ... */);
}
```

#### Dynamic Import の活用

- 大きなコンポーネントやライブラリは動的インポート
- クライアント専用コンポーネントの遅延読み込み

**推奨:**
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>読み込み中...</div>,
  ssr: false,  // クライアントサイドのみで実行
});
```

### 5. API Routes の設計

#### Route Handlers の使用

- `src/app/api` ディレクトリ配下に配置
- `route.ts` ファイルで定義
- RESTful な設計を心がける

**推奨:**
```tsx
// app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const todos = await fetchTodos();
  return NextResponse.json({ success: true, data: todos });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const todo = await createTodo(body);
  return NextResponse.json({ success: true, data: todo }, { status: 201 });
}
```

#### エラーハンドリング

- 適切な HTTP ステータスコードを返す
- 一貫したエラーレスポンス形式

**推奨:**
```tsx
try {
  const todo = await fetchTodo(id);
  return NextResponse.json({ success: true, data: todo });
} catch (error) {
  return NextResponse.json(
    { success: false, error: 'TODO が見つかりません' },
    { status: 404 }
  );
}
```

### 6. パフォーマンス最適化

#### Streaming と Suspense

- `loading.tsx` でローディング UI を提供
- `Suspense` で部分的なストリーミング

**推奨:**
```tsx
import { Suspense } from 'react';

export default function TodosPage() {
  return (
    <div>
      <h1>TODO 一覧</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <TodoList />
      </Suspense>
    </div>
  );
}
```

#### Parallel Data Fetching

- 複数のデータを並列で取得

**推奨:**
```tsx
export default async function DashboardPage() {
  // 並列でデータフェッチ
  const [todos, user, stats] = await Promise.all([
    fetchTodos(),
    fetchUser(),
    fetchStats(),
  ]);
  
  return (/* ... */);
}
```

## レビュー時の注意事項

- **Server Components を優先**: Client Components は最小限に
- **useEffect の代わりに SWR**: データフェッチは SWR を使用
- **Next.js の機能を最大限活用**: Image, Font, Metadata API など
- **パフォーマンス**: Streaming, Suspense, 並列データフェッチ
- **SEO**: 適切なメタデータとサーバーサイドレンダリング
