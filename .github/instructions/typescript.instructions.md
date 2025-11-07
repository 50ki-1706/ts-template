# TypeScript コードレビュー指示

このファイルは TypeScript に特化したコードレビュー指示を提供します。基本的なコーディング規則は `AGENTS.md` を参照してください。

## TypeScript 固有のレビューポイント

### 1. ネストの深さ

**深いネストは可読性とメンテナンス性を低下させます。**

#### 警告すべきケース

- **4 階層以上のネスト**: 関数やメソッド内で 4 階層以上ネストしている場合は警告してください
- **複雑な条件分岐**: if-else のネストが深い場合

#### 早期リターンの提案

早期リターン（ガード節）を使用することで、ネストの深さを減らし、可読性を向上させることができます。

**悪い例:**
```typescript
function processUser(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // 処理
        return result;
      }
    }
  }
  return null;
}
```

**良い例:**
```typescript
function processUser(user: User | null) {
  if (!user) return null;
  if (!user.isActive) return null;
  if (!user.hasPermission) return null;
  
  // 処理
  return result;
}
```

#### 提案タイミング

以下の場合に早期リターンを提案してください：

- ネストが 3 階層以上になっている
- 条件を反転させることでコードがフラットになる
- ガード節を使用することで「正常系」のコードが明確になる

### 2. 型安全性の強化

AGENTS.md に記載されている内容に加えて：

#### 型ガードの活用

- `unknown` 型を使用している場合は、適切な型ガードを使用して型を絞り込んでいるか確認
- カスタム型ガード関数（`is` 演算子を使用）の活用を提案

**例:**
```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}
```

#### Discriminated Union の活用

- 状態管理や API レスポンスで複数の状態を表現する場合、Discriminated Union の使用を推奨

**例:**
```typescript
type ApiResponse<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
```

### 3. 型推論の最大活用

- 明示的な型注釈が不要な場合は、型推論に任せる
- ただし、関数の戻り値の型は明示することを推奨（ドキュメンテーションとエラー検出のため）

**推奨:**
```typescript
// 引数の型は明示、戻り値も明示
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### 4. Null 安全性

- Optional Chaining (`?.`) と Nullish Coalescing (`??`) の適切な使用
- `null` と `undefined` の使い分けが明確になっているか

**推奨パターン:**
```typescript
// Optional Chaining + Nullish Coalescing
const userName = user?.profile?.name ?? 'Guest';

// 明示的な undefined チェック
if (value !== undefined) {
  // value を使用
}
```

### 5. 関数の複雑度

- **1 つの関数は 1 つの責務**: 関数が複数の責務を持っている場合は分割を提案
- **関数の長さ**: 50 行を超える関数は分割を検討
- **引数の数**: 4 つ以上の引数がある場合は、オブジェクト引数の使用を検討

**改善例:**
```typescript
// 悪い例
function createUser(name: string, email: string, age: number, address: string, phone: string) {
  // ...
}

// 良い例
interface CreateUserParams {
  name: string;
  email: string;
  age: number;
  address: string;
  phone: string;
}

function createUser(params: CreateUserParams) {
  // ...
}
```

## レビュー時の注意事項

- **既存のコードスタイルに合わせる**: プロジェクトで統一されたスタイルがある場合は、それに従う
- **過度な最適化は避ける**: 可読性を犠牲にする最適化は推奨しない
- **段階的な改善**: 大規模なリファクタリングではなく、段階的な改善を提案する
