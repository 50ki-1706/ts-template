# Copilot Instructions for TODO App Project

## このドキュメントについて

- このドキュメントは、GitHub Copilot に対してプロジェクトのコンテキストを提供し、より適切なコード補完と提案を行うためのものです。
- 新しい機能を追加する際や、既存のコードを変更する際には、このドキュメントの内容を前提に設計してください。
- 内容が不確かな場合は、ユーザーに質問するか README.md を参照してください。

## 前提条件

- 回答は必ず日本語で行ってください。
- コードを変更する際、変更量が 200 行を超える場合は、必ずユーザーに確認を行ってください。
- 変更を加える際は、まずは何をするのか計画を立て、ユーザーに提案し、ユーザーからの修正があれば、修正し計画を再構築してください。

## プロジェクトの概要

このプロジェクトは、ユーザーがタスクを管理できるシンプルな TODO アプリケーションです。ユーザーはタスクを作成、更新、削除することができ、タスクの状態を管理できます。アプリケーションは、Next.js、TypeScript、および Drizzle ORM を使用して構築されています。

## 主な機能

- メール/パスワードおよび OAuth (Google, GitHub) を使用したユーザー認証
- TODO の作成、読み取り、更新、削除
- TODO を完了/未完了としてマーク
- SWR を使用したリアルタイムデータ同期
- ダークモードサポート
- レスポンシブデザイン
- Drizzle ORM を使用した型安全なデータベース操作

## 技術スタック

- Node.js 18+
- pnpm (recommended) or npm
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Headless UI
- **Authentication**: Better Auth (JWT + OAuth - Google & GitHub)
- **Database**: SQLite with Drizzle ORM
- **Data Fetching**: SWR
- **Code Quality**: Biome (linter & formatter)

## Getting Started

README.md を参照してください。

## Folder Structure

- `src/app`: Next.js アプリケーションのルート
  - `src/app/layout.tsx`: アプリ全体のレイアウト
  - `src/app/page.tsx`: ホームページ
  - `src/app/api`: API ルート
    - `src/app/api/auth/[...all]/route.ts`: 認証 API エンドポイント
    - `src/app/api/todos/route.ts`: TODO API エンドポイント
    - `src/app/api/[id]/route.ts`: 特定の TODO アイテムの API エンドポイント
- `src/components`: React コンポーネントディレクトリ
  - `src/components/shared`: 共通コンポーネント
  - `src/components/todos`: TODO 関連コンポーネント
  - `src/components/auth`: 認証関連コンポーネント
  - `src/components/xxx`: xxx ページ専用コンポーネント
- `src/hooks`: カスタムフック
  - `src/hooks/useAuth.ts`: 認証フック
  - `src/hooks/useTodos.ts`: TODO フック
  - `src/hooks/xxx.ts`: xxx 用フック
- `src/lib`: 認証やデータベースなどのライブラリコード
- `styles`: グローバルスタイルと Tailwind CSS 設定

## 状態管理の方針

- **ローカル状態**: `useState` / `useReducer` で管理してください。
- **グローバル状態**: 認証情報やユーザー設定など、アプリ全体で共有される状態は React Context を使用して管理してください。
- **サーバー状態**: SWR を使用してデータの取得とキャッシュを行ってください。

## データフロー

- **UI→Hooks→API** の順でデータを送信してください、またはその逆の流れでデータを取得してください。
- API からのレスポンスは hooks 内で処理し、UI コンポーネントには必要なデータのみを渡してください。
- データの整形や変換は hooks 内で行い、UI コンポーネントは表示に専念させてください。
- データの取得と更新には **SWR** を使用し、リアルタイムで最新のデータを表示してください。

## ディレクトリ、ファイル命名規則

### コンポーネント

- **ファイル名**: PascalCase (例: `TaskList.tsx`, `TaskCard.tsx`)
- **ディレクトリ**: ケバブケース (例: `task-list/`, `calendar-view/`)
- **index.ts**: 各ディレクトリに配置し、外部へのエクスポートを集約

### フック

- **ファイル名**: camelCase + `use` プレフィックス (例: `useTaskList.ts`, `useAuth.ts`)

### ユーティリティ関数

- **ファイル名**: camelCase (例: `dateFormatter.ts`, `apiClient.ts`)

### 型定義

- **ファイル名**: camelCase または PascalCase (例: `task.types.ts`, `Task.ts`)
- **型名**: PascalCase (例: `Task`, `User`, `ApiResponse<T>`)

## UI / UX ガイドライン

### コンポーネント設計

- 再利用可能なコンポーネントは `src/components/shared` に配置してください。
- ページ固有のコンポーネントは、対応するページフォルダに配置してください。
- コンポーネントはできるだけ小さく、**単一責任**に保ってください。
- コンポーネントでは、UI に専念し、ロジックは hooks ディレクトリで管理してください。
- すべての props に明示的な型定義を行ってください。
- 柔軟性が必要な場合は` children` プロパティを使用してください。

### スタイリング設計

- **共通スタイルの定義**: `styles/globals.css` に配置し、全体のスタイルを管理してください。
- **Tailwind CSS ベースに設計**: ユーティリティファーストのアプローチを採用し、クラス名を活用してスタイリングを行ってください。
- **レスポンシブデザイン**: モバイルファーストのアプローチを採用し、すべての画面サイズで適切に表示されるように設計してください。
- **Headless UI の活用**: アクセシビリティと一貫性を確保するために、できる限り Headless UI コンポーネントを使用してください。

### アクセシビリティ

- **セマンティック HTML**: 適切な HTML タグを使用 (`<button>`, `<nav>`, `<main>` 等)
- **aria 属性**: 必要に応じて `aria-label`, `aria-describedby` 等を付与
- **キーボード操作**: すべての操作をキーボードで実行可能に
- **フォーカス管理**: `focus-visible` で適切なフォーカススタイルを適用

### パフォーマンス

- **コード分割**: Next.js の動的インポートを活用し、初期ロード時間を短縮、また Suspense を使用して遅延読み込みを実装
- **キャッシング**: SWR のキャッシュ機能を活用して、API リクエストの回数を最小限に抑える
- **画像最適化**: Next.js の `next/image` コンポーネントを使用して画像を最適化
- **React compiler**: React.memo, useMemo, useCallback は今回のプロジェクトでは基本的に使用しないでください。

## API 設計

### API 設計

- RESTful API を採用し、リソースベースのエンドポイントを設計してください。
- 各エンドポイントは、適切な HTTP メソッドを使用してください (GET, POST, PUT, DELETE)。
- API レスポンスは一貫したフォーマットで返却してください (例: `{ success: boolean, data: T, error?: string }`)。

### エラーハンドリング

- **API エラー**: SWR の onError でハンドリング
- **グローバルエラー**: SWRConfig コンポーネントで共通のエラーハンドリングを設定
- **ユーザーフィードバック**: Toast 通知やモーダルでエラー情報をユーザーに提供

### データ型定義

- **Zod スキーマ**: API リクエストとレスポンスのバリデーションに使用
- **TypeScript 型**: zod スキーマから型を生成（`z.infer<typeof schema>`）

## 認証

### Google Sign-In フロー

1. **authClient 初期化**: `src/lib/auth.ts` で設定
2. **Google プロバイダー**: google でログイン
3. **トークン管理**: HTTP クッキーに保存
4. **React Context**: ログインユーザー情報を管理

### GitHub Sign-In フロー

1. **authClient 初期化**: `src/lib/auth.ts` で設定
2. **GitHub プロバイダー**: github でログイン
3. **トークン管理**: HTTP クッキーに保存
4. **React Context**: ログインユーザー情報を管理

### JWT 認証フロー

1. **authClient 初期化**: `src/lib/auth.ts` で設定
2. **メール/パスワード認証**: メールアドレスとパスワードでログイン
3. **トークン管理**: HTTP クッキーに保存
4. **React Context**: ログインユーザー情報を管理

### 認証ガード

- **ProtectedRoute コンポーネント**: 未承認時にログインページへリダイレクト
- **useAuth フック**: 認証状態の確認とユーザー情報の取得

## ビルド、デプロイ

### Next.js ビルド設定

README.md を参照してください。

### CI/CD (github actions)

- **ワークフロー定義**: `.github/workflows` に YAML ファイルを配置
  - **PR チェック**: リント、型チェック、テスト実行
- **ビルドとテスト**: プッシュ時に自動で実行
- **デプロイ**: 成功したビルドのみを本番環境にデプロイ

## コーディング規約、ベストプラクティス

### TypeScript

- **strict モード**: `tsconfig.json` で有効化
- **any 型の禁止**: biome でエラーに設定
- **型推論の活用**: 冗長な型注釈は避け、推論に任せる
- **ユニオン型**: 状態を明示的に表現 (例: `type Status = 'idle' | 'loading' | 'success' | 'error'`)
- **型定義ディレクトリ**: 型定義は `src/types` に集約
  - `types/api`: API 関連の型
  - `types/components`: コンポーネント関連の型
  - `types/hooks`: フック関連の型
- **readonly 修飾子**: 不変データには `readonly` を使用
- **as const の使用**: 定数オブジェクトや配列に使用して、リテラル型を保持
- **型エイリアス vs インターフェース**: 単純なオブジェクト型にはインターフェース、ユニオン型やタプルには型エイリアスを使用

### 非同期処理

- **async/await**: Promise チェーンよりも可読性が高いため使用
- **エラーハンドリング**
  - **API データ取得**: try-catch は fetcher 内で行い、SWR の onError で処理
  - **イベントハンドラー**: try-catch を使用してエラーをキャッチし、ユーザーに通知
  - **レンダー中のエラー**: エラーバウンダリーを使用して、UI にエラーメッセージを表示

### コメント

- **JSDoc**: 複雑な関数には JSDoc コメントを付与
- **TODO コメント**: 一時的な実装には `// TODO:` を残す
- **コメントアウト**: 不要なコードは削除し、コメントアウトは残さない

## アンチパターン

以下のパターンは避けてください。既存コードで発見した場合は、リファクタリングを提案してください。

### コンポーネント設計

- **巨大コンポーネント**: 1 つのコンポーネントが 200 行を超える場合は分割を検討
- **Prop Drilling**: 深い階層での props バケツリレーは、Context や状態管理ライブラリで解決
- **useEffect の濫用**: データフェッチは React Query、イベントハンドラーで済む処理は useEffect を使わない

### 状態管理

- **過度なグローバル状態**: 真にグローバルな状態のみを Context で管理
- **useState の濫用**: 複雑な状態は useReducer で管理
- **直接的な状態変更**: イミュータブルな更新を心がける

### パフォーマンス

- **不要な再レンダリング**: React DevTools Profiler で計測し、必要に応じて最適化ける

### TypeScript

- **any の濫用**: 型推論が難しい場合は `unknown` を使用し、型ガードで絞り込む
- **型アサーション (as)**: 必要最小限に留め、型の安全性を保つ
- **オプショナルの濫用**: 本当に必要な場合のみ `?` を使用

## セキュリティとプライバシー

- **環境変数の管理**: 機密情報は `.env` ファイルに保存し、`.gitignore` に追加
- **フロントエンドのセキュリティ**: ユーザからの入力をバリデーション、サニタイズし、UI に反映
- **バックエンドのセキュリティ**: フロントエンドから受け取った入力を必ずサーバー側で再度バリデーション、サニタイズ
  →**フロントエンドは信用しない設計**
- **CSRF 対策**: 認証トークンを HTTP Only クッキーに保存し、CSRF トークンを使用
- **HTTPS 通信**: 本番環境では必ず HTTPS を使用
- **CSP (Content Security Policy)**: 適切な CSP ヘッダーを設定

## アクセシビリティ (a11y) ガイドライン

- **WCAG 2.1 AA レベル**: 準拠を目指す
- **スクリーンリーダー対応**: ARIA 属性を適切に使用
- **キーボードナビゲーション**: Tab, Enter, Escape キーでの操作をサポート
- **カラーコントラスト**: 4.5:1 以上のコントラスト比を維持
- **axe DevTools**: 開発時に定期的にチェック
