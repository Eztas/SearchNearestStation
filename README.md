リンク(https://script.google.com/macros/s/AKfycbzxlj1v8qszxb652YSKw8bOYXcmE1nyNMK2s21Qx2LP7f83tQVfxQR6D9GJWiMVGPcnNw/exec)

# SearchNearestStation(3/15)

ある目的地へ向かうときに、いつもはまずその目的地における最寄り駅を調べ、さらにその場所から最寄り駅までの徒歩でかかる時間やルートも調べる。
しかしこれを調べようとすると、「目的地名 最寄り駅」と調べて最寄り駅を把握してから、「目的地名から最寄り駅まで」と調べなければならず、
いつも手間を感じていた。

そこで、目的地名だけを打てば、その場所の最寄り駅とそこまでかかる時間まで一気に分かるものがあれば良いと考えて、作成に至った。

まず、既存のものを組み合わせる方向性で考える。

集合場所名を打つとグーグルマップでその住所が分かる機構と、それをわざわざ新しいタブを作らなくても調べられるように、
住所だけで最寄り駅とその場所までの歩く時間が分かる、
[NAVITIME](https://api-sdk.navitime.co.jp/api/specs/examples/sample/node_around_search/node_around_search.html)のサイトを1つのページにまとめたものを作成した。

form actionやfetch, XMLHttpsrequestなどを用いてwebページにデータを送る方法を試みたが、どれもうまくいかなかった。

サイトも色々見つかったが, サービス利用不可などにより使えないものが多かった。

[例1, サンプルhtml](https://zenn.dev/ichii731/articles/509ec8a06a9082)

[例2, バーコード](https://www.docswell.com/s/ichii731/ZNXYGK-nearest#p4)

[例3, サービスが終了している? Nearest API](https://station.ic731.net/)

[例4, 運用停止](https://maps.multisoup.co.jp/blog/2931/)

[例5, 場所名で検索できない](https://dev.classmethod.jp/articles/heart-rails-express/)

# SearchNearestStation with Google Spread Sheet(3/17)

他者が実装したものがありました. https://www.pahoo.org/e-soul/webtech/js01/js01-11-01.shtm

と思っていたらAPIキー無効になってるからなのか, 単純に自分の実行の仕方に間違いがあったのか分からないが,

上手く動作させることができない.

また、Google Spread SheetとGAS, Heartrails Express API(登録不要, 無料)を用いることで、場所名を打ち込むだけで, その場所から最寄り駅までのルートを示す,
Google Mapのリンクを置くことに成功

課題

Google Mapそのものをiframeなどで載せることができないので、一度リンクを踏まないと実際の図までは見れない

Spread Sheetに値を入力するという形式なので、利用する際はわざわざGoogle Driveを立ち上げるか、
Google Spread Sheetのアプリを入れる必要があり、サイトを開くまでの手間がかかる。

1つのスプレッドシートだけで行うため, 自分が前に調べた場所名を他人に知られたり、複数人が同時に使うと検索内容が消されたりする可能性がある

総括

地図を見るためにリンクをクリックするというワンアクションが必要ではあるが, 今まで新しいタブを作ったり、わざわざ文字を再度入力しないと行けなかったり、一度に最寄り駅までの徒歩時間のリンクを調べることはできなかった. ゆえに, 既存の手法よりは楽になったように思える.

しかし、これはあくまでPCで使う上での感想であり、スマホで使う場合はGoogle Spread Sheetのアプリを導入していないと全く使えないという点で、かなり不便である。

# SearchNearestStation with HTML(3/20)

スプレッドシート利用によるデメリットをなくすために、GASからhtmlwebページを作成する手法を用いる.

しかし, GASでは, iframeでgoogle mapのwebページを埋め込む手法を制限、もしくは禁止しているようである.

ルート情報を表記させたgoogle mapをiframeで埋め込むこと自体が, GASではない通常のhtmlのwebページでも制限されていた.(2024/4/12時点でも確認済み)

とりあえず, また地図画像を載せることを諦めて, htmlでスプレッドシートで行っていたことと同様にURLテーブルを表示させることにした.

これにより、デメリットであった、

## Spread Sheetに値を入力するという形式なので、利用する際はわざわざGoogle Driveを立ち上げるか、Google Spread Sheetのアプリを入れる必要があり、サイトを開くまでの手間がかかり、本末転倒になっている。

## 1つのスプレッドシートだけで行うため, 自分が前に調べた場所名を他人に知られたり、複数人が同時に使うと検索内容が消されたりする可能性がある

の2つを解決することに成功した.

また, PCでのテストしかしていなかったため, スマホでの使用感を知らずにいたのだが, いざスマホで使ってみると横に広いため, 縦長のスマホでは使いずらい印象を受けた.

ユーザー(私自身)がいつでもどこでもスマホで使えるような状況を想定しており, かつPCで使うならスプレッドシート版の方を使えばいいため,

html版はスマホでの使いやすさに追求する.

<h3>今後の展望<h3>

<h3>スプレッドシートにデータを保存し, 直前に調べた10個程度の履歴情報を選択できるようにする.</h3>

そもそもこれは最寄り駅すら分からないところを調べるのに使う, つまり初見の場所を調べるときのみに使うため,

履歴情報を再利用するという初見でない場所を調べるのには使わない.

もし, 最寄り駅を知っているのなら, 直接Googleで調べた方が早いため、この機能はやはり必要ない.

<h3>最寄り駅の前駅, 次駅の名前も掲載する.</h3>

前駅, 次駅が最寄り駅と比べても特別は遠くない時もあり, 

かつこれらの方が自宅からの最寄り駅に近かったり, 急行などでも止まったりして,

前駅, 次駅の方が都合がいいことがある

ゆえに, これも載せる機能, さらに, これを選択したときにこちらの方の地図画像やルート情報を載せる機能をつけるのもあり.

しかし, これ以上動作が遅くなる可能性もあるため, このバランスを考慮する必要がある.

<h3>Google Mapそのものをiframeで埋め込みたかった</h3>

そこでMaps.newStaticMapで対応.

# SearchNearestStation with HTML and StaticMap(3/24)

[画像1](https://github.com/Eztas/SearchNearestStation/blob/main/img/sample1.png)
や
[画像2](https://github.com/Eztas/SearchNearestStation/blob/main/img/sample2.png)のように、
入力された場所名に関する, 最寄り駅, 路線, そこまでの距離と徒歩でかかる時間, さらには静的な地図画像を生成し、
添付できるようになった.

これにより, iframeを使わずにGoogle Mapのルート情報を目視でき, リンクを踏むというワンアクションを省くことができる.

課題

動的な地図画像じゃないので, 詳細なルートなどを知ろうとするためには, 結局リンクを踏まないといけない.

画像なしverのサイトと, 画像ありverのサイトを比較すると, 明らかに画像ありverのサイトの動作が遅い.

=>ラジオボタンで画像ありverと画像なしverを選べるようにしたが, 画像ありverを優先して使うべき状況はあまりなさそう.

ある時、京都の「伏見稲荷大社」を調べたら, 表にある最寄り駅は京都にある駅なのにもかかわらず, Google Mapのリンクを踏むと、

青森の駅が最寄り駅として使われているというように、「明らかに最寄り駅ではない場所が提示される」という事例もあった.

3/28 仕様変更

道のりの長さで地図のズーム度合いを決めていたが, 距離(2地点の直線距離)の長さで決定する.
(テスト検索先 大阪城,  東京スカイツリー,　京都水族館その他)

