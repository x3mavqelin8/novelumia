# DBSDV Collection

Dragon Ball Super Divers のカードコレクションを管理する PWA です。

## 📁 フォルダ構成

``` text
dbsdv-collection/
├─ css/                 # CSS
│  ├─ base.css
│  ├─ buttons.css
│  ├─ cards.css
│  ├─ collection.css
│  ├─ deck.css
│  ├─ filters.css
│  ├─ master-pupil.css
│  ├─ mobile.css
│  ├─ modal.css
│  ├─ navigation.css
│  ├─ rarity.css
│  ├─ settings.css
│  ├─ unopened.css
│  └─ variables.css
│
├─ images/              # カード画像・サムネイル・アプリアイコン等
│
├─ js/                  # アプリの JavaScript
│  ├─ core/             # アプリ共通処理
│  │  ├─ app.js
│  │  ├─ navigation.js
│  │  └─ storage.js
│  ├─ pages/            # 各ページ
│  │  ├─ cardsPage.js
│  │  ├─ collectionPage.js
│  │  ├─ decksPage.js
│  │  ├─ masterPupilPage.js
│  │  └─ unopenedPage.js
│  ├─ settings/         # 設定・バックアップ・Excel
│  │  ├─ backup.js
│  │  └─ excelImport.js
│  └─ ui/                # UI部品
│     ├─ cardDetailModal.js
│     └─ cardFilters.js
│
├─ node_modules/        # npm パッケージ（自動生成）
│
├─ tools/                # 開発用スクリプト
│  ├─ release.js         # リリース時のバージョン更新
│  └─ update.js          # カードデータ・画像更新用
│
├─ 削除/                 # 現在使用していないファイルの退避場所
│
├─ .gitignore
├─ cards.json            # ★メインのカードデータ
├─ form.json             # 師弟レベル等で使用するフォーム情報
├─ index.html             # アプリ本体の入口
├─ manifest.json          # PWA設定
├─ package.json           # npm設定
├─ package-lock.json      # npm依存関係のロックファイル
├─ server.js              # ローカル開発用サーバー
├─ service-worker.js      # PWAのキャッシュ・更新処理
└─ version.json           # アプリのビルド番号・更新日時
```

## 🗃️ カードデータ

### `cards.json`

アプリで使用するメインのカードデータです。

カードごとに、以下のような情報を管理しています。

-   カードID
-   カード名
-   形態
-   弾
-   レアリティ
-   パラレル
-   タイプ
-   攻撃タイプ
-   HP
-   パワー
-   覚醒後パワー
-   ガード
-   初期気力
-   エネルギー
-   必殺技
-   スキル
-   アクションスキル
-   ユニット
-   ブッパ
-   特殊ルール
-   入手情報
-   所持数
-   未開封
-   欲しい
-   メモ
-   確認状態

`cards.json`
は現在のアプリのメインデータなので、既存データを壊さないように扱います。

### `form.json`

キャラクターの形態・師弟レベル機能などで使用するデータです。

## 🖼️ 画像

カード画像は公式 DBSDV
サイトから取得し、アプリ用のサムネイルを作成します。

基本的な画像処理は以下のスクリプトを使用します。

``` text
tools/downloadAndResize.js
tools/downloadCardImages.js
tools/create-thumbnails.js
```

## 🤖 カード情報の登録

現在の基本方針は、

1.  公式サイトからカード画像を取得
2.  必要なサムネイルを作成
3.  カードデータを弾ごとに整理
4.  Google AI Studio でカード画像を OCR
5.  OCR結果を確認・修正
6.  JSON に反映
7.  最終的に `cards.json` に統合

という流れです。

### OCRについて

カード情報の読み取りは **Google AI Studio
を利用して確認・入力する方針**です。

過去には Node.js 側で OCR
を行う仕組みがありましたが、現在の基本ワークフローではその方式を前提にしません。

## 🛠️ 開発・更新

### 開発サーバー

``` bash
npm start
```

`package.json` の設定により、以下が実行されます。

``` bash
node server.js
```

### カード更新

``` bash
node tools/update.js
```

カード更新用のスクリプトです。

※ `update.js`
は現在も使用しているため、内容を変更・削除する場合は関連処理を確認してから行います。

### リリース

PWA を更新して GitHub に反映するときは、リリース処理を先に実行します。

``` bash
node tools/release.js
```

その後、

``` bash
git add .
git commit -m "更新内容"
git push
```

の順でコミット・プッシュします。

`release.js` は `version.json` と Service Worker
のキャッシュバージョンを更新するため、PWA の更新時に使用します。

## 📦 npm パッケージ

主な依存パッケージ：

-   `express` --- ローカルサーバー
-   `playwright` --- 公式サイトのカード情報取得など
-   `sharp` --- 画像処理・サムネイル作成
-   `xlsx` --- Excel 入出力
-   `qrcode` --- QRコード関連
-   `multer` --- サーバー側ファイル受け取り

依存関係は `package.json` と `package-lock.json` で管理します。

`package-lock.json` は手動編集せず、パッケージを追加・削除するときは npm
コマンドを使用します。

## 🧹 ファイル整理について

プロジェクト内には、過去のカード登録・OCR・データ統合作業で使用していたファイルが存在する場合があります。

不要になったファイルはすぐに削除せず、必要に応じて `削除/`
に退避してから動作確認します。

特に以下のような古い処理は、現在のワークフローと役割が重複する可能性があります。

-   過去の OCR 処理
-   一度きりの JSON 統合スクリプト
-   古いカードデータ生成スクリプト

**現在動いているアプリのファイルを優先し、動作確認なしで削除しないこと。**

## 📱 PWA

`manifest.json` と `service-worker.js` により PWA として動作します。

アプリ名：

-   DBSDV Collection
-   短縮名：DBSDV

アイコン：

``` text
images/icon.webp
```

## 🔄 今後のカード追加時の考え方

新しい弾を追加するときは、できるだけ

``` text
画像取得
   ↓
サムネイル作成
   ↓
弾ごとのカードJSON作成
   ↓
Google AI StudioでOCR
   ↓
内容確認・修正
   ↓
cards.jsonへ反映
   ↓
動作確認
   ↓
release
```

という流れに統一します。

既存の `cards.json`
の形式を維持しながら、新しいカードを追加していきます。
