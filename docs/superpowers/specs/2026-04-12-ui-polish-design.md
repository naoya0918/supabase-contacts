# supabase-contacts UIデザイン仕上げ 設計書

## 概要

supabase-contactsの3画面（ダッシュボード・公開フォーム・完了ページ）のデザインを、シンプル＆クリーンなブルー系テーマで仕上げる。機能の変更はなし、見た目のみの改善。

## デザイン方針

- **テーマ**: シンプル＆クリーン
- **カラー**: ブルー系
- **実装順序**: 共通ヘッダー → ダッシュボード → フォーム → 完了ページ
- **ツール**: Frontend Designプラグインを使用

## カラーパレット

| 用途 | 色名 | HEX | Tailwind |
|------|-------|-----|----------|
| プライマリ | Blue 500 | `#3b82f6` | `blue-500` |
| ホバー | Blue 700 | `#1d4ed8` | `blue-700` |
| ライトブルー | Blue 100 | `#dbeafe` | `blue-100` |
| 背景 | Slate 50 | `#f8fafc` | `slate-50` |
| テキスト | Slate 800 | `#1e293b` | `slate-800` |
| サブテキスト | Slate 500 | `#64748b` | `slate-500` |
| 危険 | Red 500 | `#ef4444` | `red-500` |

### ステータスバッジ

| ステータス | 背景色 | テキスト色 | Tailwind |
|-----------|--------|-----------|----------|
| 未対応 | `#fef3c7` | `#92400e` | `bg-amber-100 text-amber-800` |
| 対応中 | `#dbeafe` | `#1d4ed8` | `bg-blue-100 text-blue-700` |
| 完了 | `#d1fae5` | `#047857` | `bg-emerald-100 text-emerald-700` |

## Step 1: 共通ヘッダー

### 概要

全3画面で共有するナビゲーションヘッダーを `layout.tsx` に配置する。

### 仕様

- 白背景（`bg-white`）、下線ボーダー（`border-b border-slate-200`）
- 左: ロゴ（テキスト、太字）
- 右: ナビリンク3つ（ホーム / お問い合わせ / 管理）
- `next/link` を使用したクライアント側ルーティング
- 現在のページのリンクにアクティブスタイル（ブルー太字）。`usePathname` を使うため、ヘッダーはClient Componentとして別ファイル（`app/Header.tsx`）に切り出す

### 対象ファイル

- `app/Header.tsx` — ヘッダーClient Component（新規作成）
- `app/layout.tsx` — `<Header />` を配置

## Step 2: ダッシュボード（/contacts）

### 概要

問い合わせ一覧をテーブル形式で表示。統計バッジで件数を把握しやすくする。

### 仕様

- **ページ背景**: `slate-50`
- **ヘッダー部分**: 「問い合わせ管理」見出し（`text-xl font-bold`）＋統計バッジ（全体件数、未対応件数）を横並び
- **テーブル**: 白背景カード（`bg-white rounded-lg shadow-sm border`）内に配置
  - ヘッダー行: グレー背景（`bg-slate-50`）
  - 列: 名前 / 件名 / メール / ステータス / 操作
  - ステータス: カラーバッジ（丸角 pill 型）で表示。セレクトボックスの機能はそのまま維持
  - 削除ボタン: 赤テキスト（`text-red-500`）
  - 行間: ゆったりしたパディング（`py-3 px-4`）

### 対象ファイル

- `app/contacts/page.tsx` — テーブルレイアウト・統計バッジ
- `app/contacts/StatusSelect.tsx` — バッジスタイルの適用
- `app/contacts/DeleteButton.tsx` — ボタンスタイルの適用

## Step 3: 公開フォーム（/contact）

### 概要

センター1カラムのフォーム。白背景カード内にフォーム項目を配置。

### 仕様

- **レイアウト**: 中央揃え、最大幅 `max-w-md`（480px程度）
- **見出し**: 「お問い合わせ」（`text-2xl font-bold`）＋補足テキスト「ご質問やご相談はこちらから」（`text-slate-500`）を中央揃え
- **フォームカード**: `bg-white rounded-xl shadow-sm` に `p-6` のパディング
  - ラベル: `text-sm font-semibold text-slate-700`、入力欄の上
  - 入力欄: `bg-slate-50 border border-slate-200 rounded-lg`、フォーカス時にブルーボーダー
  - メッセージ欄: textarea、高さ大きめ（`rows={5}` 程度）
- **送信ボタン**: `bg-blue-500 text-white w-full rounded-lg py-3 font-semibold`、hover時 `bg-blue-700`
- **エラー表示**: 入力欄直下に `text-red-500 text-sm` で表示（既存ロジック維持）

### 対象ファイル

- `app/contact/page.tsx` — 見出し・レイアウト
- `app/contact/ContactForm.tsx` — フォームスタイル

## Step 4: 完了ページ（/contact/thanks）

### 概要

送信完了を視覚的に伝えるページ。チェックマークアイコン付き。

### 仕様

- **レイアウト**: 縦横中央揃え（`min-h-screen flex items-center justify-center`相当）
- **チェックマーク**: CSSで作成（外部ライブラリ不使用）
  - 円: `w-20 h-20 bg-blue-100 rounded-full` にフレックスで中央配置
  - ✓: `text-blue-500 text-4xl` でテキストまたはSVGで表示
- **メッセージ**: 「送信が完了しました」（`text-2xl font-bold text-slate-800`）
- **補足**: 「24時間以内にご返信いたします」（`text-slate-500`）
- **リンク**: 「トップページに戻る」をブルーテキストリンク（`text-blue-500 hover:underline`）

### 対象ファイル

- `app/contact/thanks/page.tsx` — 全体の書き換え

## スコープ外

- 機能の追加・変更（検索、フィルター、ページネーションなど）
- レスポンシブ対応の細かい調整（基本的なTailwindの応答性は活用する）
- ダークモード対応
- アニメーション（チェックマークのアニメーション等）
- フォントの変更（システムフォントをそのまま使用）
