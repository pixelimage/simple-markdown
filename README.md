# シンプルマークダウン

## 概要

**シンプルマークダウン**は、リアルタイムでMarkdown文書を編集・プレビューできるWebアプリです。直感的なUIと多機能なエディタで、快適なMarkdown執筆体験を提供します。

## 主な機能

- **リアルタイムプレビュー**  
  Markdownを編集しながら、即座に右側でプレビューを確認できます。
- **Monacoエディタ搭載**  
  シンタックスハイライトやショートカット付きの高機能エディタ。
- **複数ドキュメント管理**  
  複数のMarkdown文書を作成・切り替え・削除・並び替えできます。
- **エクスポート/インポート**  
  Markdownファイル（.md）として保存・読み込みが可能。
- **自動保存**  
  編集内容はローカルストレージに自動保存されます。
- **ドキュメントのドラッグ＆ドロップ並び替え**
- **検索機能**  
  ドキュメントタイトルや内容から検索できます。
- **フルスクリーンモード**
- **テーマ切り替え（ダーク/ライト）**  
  ※ただし、ユーザーの要望によりライトモードのみを推奨。

## 技術スタック

- React
- Vite
- TypeScript（ただしJSへの移行も可能）
- Tailwind CSS
- Monaco Editor
- marked（Markdownパーサ）
- DOMPurify（XSS対策）

## 使い方

1. リポジトリをクローン
2. 依存パッケージをインストール
   ```
   npm install
   ```
3. 開発サーバー起動
   ```
   npm run dev
   ```
4. ブラウザで `http://localhost:5173` にアクセス

## デモ

[デモサイト](https://www.pixelimage.jp/app/markdown/)

## ライセンス

MIT 