# うちの子の星 — 公開手順（GitHub Pages）

静的サイトです。ビルド不要。サーバー代は **0円**（独自ドメイン代のみ）。

---

## 1. 構成

```
site/
├── index.html          トップ
├── map.html            思い出マップ（47都道府県）
├── memory.html         無料の思い出ページ申込（3ステップ）
├── memory/
│   └── mugi.html       できあがったページの実例（サンプル）
├── order.html          記念品の注文
├── tokushoho.html      特定商取引法に基づく表記  ← 公開前に要記入
├── privacy.html        プライバシーポリシー      ← 公開前に要記入
├── terms.html          利用規約
├── ai-policy.html      AI利用に関する方針
├── style.css           全ページ共通スタイル
├── config.js           ★ 設定ファイル（ここだけ直せば動きます）
├── form.js             フォーム送信の共通処理
├── main.js             演出・月相計算・地図描画
├── mapdata.js          都道府県データ
├── geomap.js           日本地図の輪郭データ
├── photo.js            写真のハッシュ計算・端末指紋（重複判定用）
├── guard.js            二重登録の判定（ブラウザ内で完結）
├── entries/            登録データ（JSON1件=1ページ）★公開しないこと
├── img/                写真素材（hero / cat / detail / og / entries）
├── CNAME               独自ドメイン（GitHub Pages 用）
├── robots.txt
└── sitemap.xml
```

> **`functions/` フォルダは使いません。** GitHub Pages は静的ホスティングのため、
> サーバー処理は外部サービス（Web3Forms / Formspree）で代替します。削除して構いません。

---

## よくあるご質問（faq.html）

メインページから独立させ、フッターの「CONTENTS」メニューからリンクしています。
質問は9件。料金・写真・支払い・AI利用・葬儀対応など。
`order.html` 内の記念品FAQ（7件）とは別内容で、相互にリンクしています。


## 2. GitHub にアップロード

### 2-1. リポジトリ作成
1. https://github.com/new
2. Repository name：`uchinoko-hoshi`（任意）
3. **Public** を選択（Private でも Pages は使えますが、無料枠の制限があります）
4. Create repository

### 2-2. ファイルをアップロード
1. リポジトリ画面 → **Add file** → **Upload files**
2. **`site/` フォルダの中身を全部**ドラッグ＆ドロップ
   - ⚠️ `site` フォルダごとではなく、**中のファイル**を入れます
   - `index.html` がリポジトリ直下に来るのが正解
3. Commit changes

> コマンドでやる場合：
> ```bash
> cd site
> git init
> git add .
> git commit -m "first commit"
> git branch -M main
> git remote add origin https://github.com/USERNAME/uchinoko-hoshi.git
> git push -u origin main
> ```

### 2-3. GitHub Pages を有効化
1. リポジトリ → **Settings** → 左メニュー **Pages**
2. **Source**：`Deploy from a branch`
3. **Branch**：`main` ／ フォルダ：`/ (root)`
4. **Save**
5. 1〜2分後、`https://USERNAME.github.io/uchinoko-hoshi/` で公開されます

---

## 3. 独自ドメインを接続

### 3-1. ドメイン取得
- `.com` / `.art` / `.studio` など：**Cloudflare Registrar**（原価・更新も安い）か **お名前.com**
- `.jp`：**お名前.com** / **ムームードメイン**

> 参考価格：`.com` 年 1,200〜1,600円 ／ `.jp` 年 3,000円前後
> **「墓」「霊園」を連想させるドメインは避けてください。**

### 3-2. GitHub 側の設定
1. Settings → Pages → **Custom domain** に取得したドメインを入力 → Save
2. `site/CNAME` を開いて、1行目を自分のドメインに書き換えてアップロード
   ```
   uchinoko-hoshi.com
   ```
3. **Enforce HTTPS** にチェック（証明書発行に最大24時間）

### 3-3. DNS 設定（ドメイン側）
**Apex ドメイン（`example.com`）の場合** — Aレコード4つ：

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**www の場合** — CNAME：

| Type | Name | Value |
|---|---|---|
| CNAME | www | USERNAME.github.io |

---

## 4. ★ config.js を書き換える（これが最重要）

`config.js` を開いて、次の3か所だけ直せば動きます。

```js
window.SITE_CONFIG = {
  formEndpoint: '',      // ← ここ
  accessKey: '',         // ← ここ
  mailTo: 'hello@example.com',   // ← ここ（自分のメール）
  siteUrl: 'https://example.com', // ← ここ（独自ドメイン）
  brand: 'こもれびアトリエ ／ うちの子の星'
};
```

### パターンA：Web3Forms（いちばん簡単・おすすめ）

1. https://web3forms.com を開く
2. メールアドレスを入力 → **Create Access Key**
3. 届いたキーをコピー
4. `config.js` をこう書き換える：

```js
formEndpoint: 'https://api.web3forms.com/submit',
accessKey: 'ここに受け取ったキー',
```

**無料枠：月250通。** お申し込みが自分のメールに届きます。

### パターンB：Formspree

1. https://formspree.io でフォーム作成
2. `formEndpoint: 'https://formspree.io/f/xxxxxxx'`、`accessKey: ''`
3. **無料枠：月50通**

### パターンC：何も設定しない

`formEndpoint` が空のままなら、送信ボタンで**メールソフトが開き**、内容が自動入力されます。
すぐ公開したいだけなら、これでも動きます（`mailTo` を自分のアドレスにしてください）。

---

## 5. 公開前に必ずやること

| # | ファイル | 箇所 | 内容 |
|---|---|---|---|
| 1 | `tokushoho.html` | `※` の赤字4か所 | 氏名・所在地・電話番号・メールアドレス |
| 2 | `privacy.html` | `※` の赤字2か所 | 個人情報保護管理者・メール |
| 3 | `privacy.html` | 第4条の表 | 実際に使う外部サービスに合わせる |
| 4 | `ai-policy.html` | 第2条・第4条 | 実際に使うツールに合わせる |
| 5 | `config.js` | `mailTo` / `siteUrl` | 自分のメール・ドメイン |
| 6 | `sitemap.xml` | `example.com` 8か所 | 実際のドメイン |
| 7 | `CNAME` | 1行目 | 実際のドメイン |
| 8 | `map.html` | `SAMPLE` | 公開時は `{}` のまま（空）にする |

> **`tokushoho.html` の `※` を埋めずに公開すると、特定商取引法違反になります。**
> **`map.html` に架空の件数を表示すると、景品表示法（優良誤認）になります。**
> 0件から始めてください。0件の地域に「いちばん最初のひとつに、なっていただけますか」と
> 出る設計は、むしろ正直で強いです。

---

## 6. 運用の流れ

### 無料掲載の申込が来たら
1. Web3Forms から自分のメールに通知が届く（申込者アドレスが reply-to に入る）
2. 申込者へ返信 → お写真を受け取る
3. ページを制作（手作業、1件30分程度）
4. `memory/` フォルダにページを置いて URL を送る
   - 例：`memory/mugi.html` → `https://yourdomain.com/memory/mugi.html`
5. 地図に載せたい場合は `map.html` の `SAMPLE` に1件追加

### 記念品の注文が来たら
1. 通知メールで内容を確認
2. 見積り・支払い方法を案内（銀行振込 or 決済リンク）
3. 天文計算で「その日の空」の数値を出す
4. 記念証を制作 → PDF入稿 or 印刷発注
5. 仕上がり確認 → 発送

### 返信の目安
**平日24時間以内。** 守れない日は、サイトに書かないでください。
守れない約束は、この商売では最も大きなダメージになります。

---

## 7. 費用

| 項目 | 金額 |
|---|---|
| GitHub Pages | **0円**（Public リポジトリ、帯域 100GB/月） |
| Web3Forms | **0円**（月250通） |
| 独自ドメイン | 年 1,200〜3,000円 |
| **合計** | **年 1,200〜3,000円のみ** |

印刷・発送は受注後に発注するので、**先出しの原価はゼロ**です。

---

## 8. 触ってはいけないところ

- **「その日の空」記念証の免責文**（星の命名権・IAU・所有権・法的効力なし）
  → 全ページのフッターにあります。これが事業の生命線です。
- **地図の免責文**（お墓・納骨堂・霊園ではない／区画の販売ではない）
- **「火葬・埋葬・供養・納骨は行っておりません」** の一文
- **`geomap.js` / `mapdata.js`** の座標データ（地図の形が崩れます）

---

## 9. よくあるつまずき

| 症状 | 原因と対処 |
|---|---|
| 404 になる | `index.html` がリポジトリ直下にない。`site/` フォルダごと上げてしまった場合は、Settings → Pages のフォルダ指定を `/docs` に変えるか、ファイルを移動 |
| CSS が効かない | `style.css` の大文字小文字。GitHub Pages は**大文字小文字を区別**します |
| フォームが送れない | `config.js` の `formEndpoint` / `accessKey` を確認。空なら mailto 動作になります |
| 地図が真っ白 | `geomap.js` を読み込んでいない。`index.html` / `map.html` の `<script>` 順を確認 |
| 文字が明朝体にならない | Google Fonts が読めていない環境（社内ネット等）。端末の游明朝 / ヒラギノ明朝にフォールバックします |
| 更新が反映されない | ブラウザキャッシュ。スーパーリロード（Cmd/Ctrl + Shift + R） |

---

## 10. 重複登録の防止について（重要）

### 10-1. いま動いているもの（追加設定なし）

`photo.js` と `guard.js` が、**ブラウザの中だけ**で次を判定します。

| 層 | 方法 | 検出できるもの |
|---|---|---|
| 1 | **SHA-256** | まったく同じファイルの再登録 |
| 2 | **知覚ハッシュ（8×8 / 64bit）** | 縮小・再保存・スクリーンショットした同じ写真（64bit中6bit以内の差） |
| 3 | **端末指紋** | 同じ端末・同じブラウザからの再登録（24時間制限） |
| 4 | **localStorage** | ブラウザを閉じても記録が残る |

**写真はどこにも送信されません。** 判定はすべて端末内で完結します。
指紋（ハッシュ）だけをフォームと一緒に送ります。

### 10-2. 正直に言っておきます

**ブラウザ側の判定だけでは、「同じ人が別の端末で登録する」ことは防げません。**

- シークレットモードを開く
- 別のブラウザを使う
- スマホとPCを両方使う

この3つで、上の4層はすべて回避されます。

### 10-3. IPアドレスで止める場合

**GitHub Pages は静的ホスティングなので、IPアドレスを見ることができません。**
IPを見るには、リクエストを受けるサーバー側の処理が必要です。

現実的な選択肢は次の3つです。

| 方法 | 費用 | IPが見える | 手間 |
|---|---|---|---|
| **Cloudflare Worker を1本だけ立てる** | 無料枠で足りる | ⭕ | 中 |
| Cloudflare の WAF（Rate limiting） | 無料枠あり | ⭕ | 低 |
| 外部フォームサービス | 無料枠あり | ❌ | 低 |

**Worker を使う場合の最小構成**（`worker.js` を別途つくる）：

```js
export default {
  async fetch(req, env) {
    const ip = req.headers.get('CF-Connecting-IP') || '';
    const body = await req.json();

    // ① 同じIPからの登録を、24時間に1件まで
    const ipKey = 'ip:' + ip;
    if (await env.KV.get(ipKey)) {
      return Response.json({
        ok: false,
        error: 'このネットワークからは、すでに登録があります。'
      }, { status: 429 });
    }

    // ② 同じ写真（SHA-256）を拒否
    const shaKey = 'sha:' + body.photoSha256;
    if (await env.KV.get(shaKey)) {
      return Response.json({
        ok: false,
        error: 'この写真は、すでに登録されています。'
      }, { status: 409 });
    }

    // ③ 同じ端末IDを拒否（24時間）
    const devKey = 'dev:' + body.deviceId;
    if (await env.KV.get(devKey)) {
      return Response.json({
        ok: false,
        error: 'この端末からは、すでに登録があります。'
      }, { status: 429 });
    }

    // 記録（24時間で自動消滅）
    const opt = { expirationTtl: 86400 };
    await env.KV.put(ipKey, '1', opt);
    await env.KV.put(devKey, '1', opt);
    if (body.photoSha256) {
      await env.KV.put(shaKey, '1', { expirationTtl: 60 * 60 * 24 * 365 * 3 });
    }

    // メール送信（Resend など）
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + env.RESEND_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        from: env.FROM,
        to: [env.TO],
        reply_to: body.email,
        subject: '【写真登録】' + (body.petName || ''),
        text: JSON.stringify(body, null, 2)
      })
    });

    return Response.json({ ok: true });
  }
};
```

これをデプロイして、`config.js` の `formEndpoint` に Worker のURLを入れると、
IPアドレス・写真・端末の**三重**で止まります。KV は無料枠（1日10万読み書き）で足ります。

### 10-4. そもそも、なぜ1人1枚にしているか

スパム対策だけではありません。

- **1枚だけ**だから、選ぶのに迷わない（悲しいときに20枚も選べない）
- 1枚しかないから、**人が見ても一瞬で「同じだ」と分かる**
- 写真が多いサイトは、荒らしの的になりやすい

**制限が、使いやすさと安全の両方を作っています。**
これは意図した設計です。

### 10-5. 正当な理由で断られた場合

家族で別々に登録したい、引っ越して同じ写真を再登録したい、などの場合は
手動で解除します。サイト下部の連絡先にご連絡ください。
**例外を作れるのは、人が見ているからです。**


---

## 11. 思い出ページの作り方（1件あたり3〜5分・自動生成）

`memory/mugi.html` は**手で書いた見本ではなく、生成スクリプトの出力**です。
注文が来たら、JSONをひとつ書いてコマンドを1回打つだけでページが出ます。

### 手順

**1. `site/entries/<slug>.json` を作る**

```json
{
  "slug": "mugi",
  "name": "むぎ",
  "kind": "dog",
  "breed": "柴犬（赤）",
  "yearFrom": 2012,
  "yearTo": 2026,
  "pref": "東京都",
  "date": "2026-11-03",
  "time": "21:00",
  "visibility": "link",
  "photo": "../img/entries/mugi-hero.jpg",
  "message": "毎朝、玄関まで見送りに来てくれました。\n最後の日も、同じ場所で待っていました。",
  "profile": {
    "よび名": "むぎ、むーちゃん",
    "好きだったもの": "日向、乾燥したさつまいも、雨の日の窓辺",
    "苦手だったもの": "掃除機、耳掃除、知らない人の帽子"
  },
  "timeline": [
    {"date": "2012.05.14", "title": "うちに来た日", "text": "..."}
  ],
  "quote": "「ありがとう」より先に、\n「またね」と言ってしまいました。",
  "messages": [
    {"who": "ご家族", "text": "...", "at": "2026.11.03"}
  ]
}
```

| キー | 必須 | 説明 |
|---|---|---|
| `slug` | ✔ | ファイル名。半角英数字とハイフンだけ。`mugi` → `memory/mugi.html` |
| `name` | ✔ | お名前 |
| `kind` | ✔ | `dog` / `cat` / `other` |
| `yearFrom` `yearTo` | | 過ごした年。片方だけでも可 |
| `pref` | | 都道府県。**その日の空の計算地点**になる（未指定は東京） |
| `date` `time` | | 空を計算する日時。未指定は `yearTo-11-03 21:00` |
| `visibility` | | **`link`（既定）** / `public`（地図・sitemap に表示）/ `private`。<br>**既定は `link` です。検索にも地図にも出ません。** ご家族が「載せたい」と**明示的に**希望したときだけ `"public"` と書いてください。 |
| `photo` | ✔ | 写真。`site/img/entries/` に置いて `../img/entries/xxx.jpg` |
| `message` | | ヒーロー下のひとこと。`\n` で改行 |
| `profile` | | 表の行。キーがそのまま左列になる。自由に増減可 |
| `timeline` | | 年表。3〜5個が読みやすい。空配列なら**その節ごと消える** |
| `quote` | | 引用。省略可 |
| `messages` | | メッセージ。省略可（節ごと消える） |

**2. 生成する**

```bash
python3 tools/build_memorial.py site/entries/mugi.json
```

```
[build] mugi
        日付 2026-11-03 21:00 / 東京都
        月 32% 下弦の月 ・ 天頂 デネブ ・ デネブ50.1° カペラ33.0° ベガ26.2° アルタイル25.8°
        -> site/memory/mugi.html  (19 KB)
```

この4行が**その日の空の計算結果**です。計算はPython標準ライブラリだけで完結し、
外部APIも天体暦ファイルのダウンロードも要りません。

生成すると、次の3つが**同時に**更新されます。

| ファイル | 中身 |
|---|---|
| `memory/<slug>.html` | ページ本体 |
| `entries.js` | 地図に出す public の一覧（名前・年・ひとこと・リンク） |
| `sitemap.xml` | public のページのURL |

**手で `entries.js` や `sitemap.xml` を編集しないでください。** 次の生成で上書きされます。

**3. 確認して公開**

```bash
python3 -m http.server -d site 8000     # http://localhost:8000/memory/mugi.html
git add . && git commit -m "add mugi" && git push
```

### 写真を書き出す

```bash
# 長辺1600px・200KB以下にそろえる（Pillow）
python3 - <<'PY'
from PIL import Image
im = Image.open("orig.jpg").convert("RGB")
im.thumbnail((1600, 1600), Image.LANCZOS)
im.save("site/img/entries/mugi-hero.jpg", quality=78, optimize=True, progressive=True)
PY
```

**縦長の写真でも構いません。** CSS側が自動でクロップします。
ただし「顔が上端にある写真」は、スマホで見たときに切れやすいので、
一度390px幅で開いて確認してください。

### その日の空について（重要）

- 使っているのは **Meeus『Astronomical Algorithms』の式**（太陽黄経25章／月位置47章）と
  **IAU 1976 歳差**、**HIPPARCOS星表**の恒星位置です。
- 照度の誤差は **±0.5%以内**、恒星高度は **±0.1°以内**（Skyfield + DE421 と比較して確認済み）。
- **「推定」「イメージ」ではありません。** 誰が計算しても同じ値になります。
  この一点が、他社の「星空イメージ画像」との決定的な違いです。
  ただし**天候・光害・建物の影は考慮していません**。「その夜、実際に見えた空」ではなく
  「その時刻に、その場所の空にあった天体」です。表現はそう書いてください。

### 地図の数字について（うそをつかないために）

- 登録が **0件のときは、件数そのものを表示しません**。「0 の想い」と出すより、
  何もないことがかえって目立つためです。
- **10件を超えたら**地図カードに件数が出ます。1〜9件のあいだは
  トップに「いま、星が N つ灯っています。」とだけ出ます。
- 「日本中で、たくさんのうちの子が星になっています」という**見出しは使わないでください。**
  最初のうちは事実ではありません。いまは「47都道府県のどこかに、その子の星があります。」です。
  件数が十分に増えたら、そのときの実数に合わせて書き直してください。

### 注意

- **`mugi` は見本です。** 実在のご家族の注文が入ったら削除せず、
  「ページの例」として `index.html` の `.prev` からリンクしたままにします。
  **見本と本番で同じ写真を使い回さないでください。** 信用を落とします。
- `entries/*.json` は**公開リポジトリに置かない**でください。ご家族のメールアドレスや
  本名が入ります。`.gitignore` に `site/entries/` を追加するか、
  リポジトリを private にしてください。
- `visibility` が `public` のページだけ `sitemap.xml` に追加します。

---

## 12. 記念証のPDFを作る（1件1分・自動生成）

`build_certificate.py` が、**計算からPDFの書き出しまで**をやります。
Illustrator も InDesign も Canva も要りません。

### 初回だけ：日本語フォントを1つ用意する

`tools/fonts/` に、**TrueType（.ttf / .otf のうち glyf 形式）**の日本語フォントを置きます。

```
tools/fonts/
├── NotoSerifJP-Regular.otf   ← 明朝（あると仕上がりが良い）
└── NotoSansJP-Regular.otf    ← ゴシック
```

- 入手先：**Google Fonts**（無料・商用可）
  Noto Serif JP ／ Noto Sans JP の "Download family" で入ります。
- **Important**: `.otf` でも中身が **CFF** のものは使えません。
  TrueType 形式（glyf）である必要があります。
  Noto Serif JP / Noto Sans JP は TrueType です。**Noto Sans CJK / Noto Serif CJK（CJK とつく方）は CFF なので弾かれます。**
- 入れなくても動きます。その場合は自動でシステムのフォントを探します。
  見つからないときはゴシックだけで作り、警告を出します。

### 作る

```bash
# 記念証だけ作る
python3 tools/build_certificate.py site/entries/mugi.json

# A3 で作る（③プレミアムセット用）
python3 tools/build_certificate.py site/entries/mugi.json --size a3

# 思い出ページと PDF をいっぺんに作る（こちらが普通）
python3 tools/build_memorial.py site/entries/mugi.json --pdf
```

出力：`site/certs/mugi.pdf`

### 中身

| 項目 | 内容 |
|---|---|
| 用紙 | A4よこ（297×210mm）／`--size a3` で A3よこ |
| 文字 | ベクタ。拡大しても荒れません。**埋め込み済み**なので、相手の環境で文字化けしません |
| 空の図 | その時刻に見えていた星と、月（**地平線より上にあるときだけ**描きます） |
| 免責 | 記念品であること・命名権でも法的効力でもないことを、必ず記載 |
| 整理番号 | 左下に `No. 2026-XXXX`。再発行・お問い合わせのときに使います |

**月が地平線の下にある時刻**は、月を描きません。図の右下に
「この時刻、月は地平線の下」と出ます。**見えていないものを見たことにしないため**です。
（`月齢23` 前後は深夜に昇るため、21:00指定だとよく起こります）

### こんなとき

| 症状 | 原因と対処 |
|---|---|
| `日本語フォントが見つかりません` | `tools/fonts/` にフォントを入れてください |
| `CFF(OTF) フォントには対応していません` | そのフォントは中身がCFFです。**Noto Serif JP**（CJKなし）を使ってください |
| 文字が欠ける | 実行時に `フォントにない文字:` と警告が出ます。漢字が古いフォントだと起きます |
| 明朝で出ない | 明朝が見つかっていません。警告が出ます（ゴシックで続行します） |

### なぜ自作か

Illustrator のライセンスは月額です。**資本金ゼロ**で始めるなら、この種のものは
自分で書いたほうが早い。依存パッケージもゼロなので、
**3年後に Python を入れ直しても、そのまま動きます。**
