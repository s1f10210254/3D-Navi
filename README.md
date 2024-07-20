# 3Dなび

目的地を入力し、観光地を選択、現在地から目的地までの経路を3Dで表示するWebアプリケーションです。

## 使用技術

aspida と frourio を用いた フルTypeScript開発

- Frontend: Next.js
- Backend: Fastify
- Docker コンテナー1つだけでデプロイ

## 開発手順

### Node.js のインストール

https://nodejs.org/en で v20 以上をインストール

### npm モジュールのインストール

package.json は3つ存在する

```sh
$ npm i
$ npm i --prefix client
$ npm i --prefix server
```

### 環境変数ファイルの作成

```sh
$ cp client/.env.example client/.env
```

`NEXT_PUBLIC_MAPBOX_API_KEY`は[Mapbox](https://www.mapbox.com)で取得したものを設定

### 開発サーバー起動

次回以降は以下のコマンドだけで開発できる

```sh
$ npm run notios
```

Web ブラウザで http://localhost:3000 を開く

開発時のターミナル表示は [notios](https://github.com/frouriojs/notios) で制御している

[Node.js モノレポ開発のターミナルログ混雑解消のための新作 CLI ツール notios](https://zenn.dev/luma/articles/nodejs-new-cli-tool-notios)

閉じるときは `Ctrl + C` を 2 回連続で入力

## デプロイ

`Dockerfile`で[Render](https://render.com)にデプロイ
