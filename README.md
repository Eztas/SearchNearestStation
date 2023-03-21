# SearchNearestStation(3/15)

ある集合場所へ向かうときに、いつもはまずその場所と最寄り駅を調べ、さらにその場所から最寄り駅までの徒歩でかかる時間も調べる。
しかしこれを調べようとすると、「集合場所名 最寄り駅」と調べてから、「集合場所名から最寄り駅までの時間」と調べなければならず、
いつも手間を感じていた。

そこで、集合場所名だけを打てば、その場所の最寄り駅とそこまでかかる時間まで一気に分かるものがあれば良いと考えて、作成に至った。
API周りはお金がかかるので、それを使わずに9割くらい自作のものを作りたかったが、心が折れた。(まだ3日ほどしかやってないけど)

妥協案として、集合場所名を打つとグーグルマップでその住所が分かる機構と、それをわざわざ新しいタブを作らなくても調べられるように、
住所だけで最寄り駅とその場所までの歩く時間が分かる(わいのやりたいことを95%くらい実践してくれてる)
[NAVITIME](https://api-sdk.navitime.co.jp/api/specs/examples/sample/node_around_search/node_around_search.html)のサイトを1つのページにまとめるものとする。

form actionやfetch, XMLHttpsrequestなどを用いてみたが、どれもうまくいかなかった。

有識者がもしこんな辺鄙なGithubを見つけた時に、あれ？ここをこうしたら上手くいくんじゃない？って声をかけてくれるように、
残骸をjsにまとめて貼っておきます.

もしかしたらアプリで既に作られてるかもしれませんが、わざわざ調べるのが面倒なのと、
あまりアプリにスマホの容量を使いたくない主義なので、webサイトでの実現を考えてます。
(ざっくり調べた感じ、ありそうだけど割と規模が小さそう)

サイトも色々見つかったが, サービス利用不可とかだった

[例1, サンプルhtml](https://zenn.dev/ichii731/articles/509ec8a06a9082)

[例2, バーコード](https://www.docswell.com/s/ichii731/ZNXYGK-nearest#p4)

[例3, サ終してる? Nearest API](https://station.ic731.net/)

[例4, 運用停止](https://maps.multisoup.co.jp/blog/2931/)

# SearchNearestStation with Google Spread Sheet(3/17)

他者が実装したものがありました. https://www.pahoo.org/e-soul/webtech/js01/js01-11-01.shtm

と思ってたらAPIキー無効になってました.

Google Spread SheetとGAS, Heartrails Express API(登録不要, 無料)を用いることで、場所名を打ち込むだけで, その場所から最寄り駅までのルートを示す,
Google Mapのリンクを置くことに成功

課題

Google Mapそのものをiframeなどで載せることができないので、一度リンクを踏まないと実際の図までは見れない

Spread Sheetに値を入力するという形式なので、利用する際はわざわざGoogle Driveを立ち上げるか、
Google Spread Sheetのアプリを入れる必要があり、サイトを開くまでの手間がかかり、本末転倒になっている。

1つのスプレッドシートだけで行うため, 自分が前に調べた場所名を他人に知られたり、複数人が同時に使うと検索内容が消されたりする可能性がある

総括

地図を見るためにリンクをクリックするというワンアクションが必要ではあるが, 今まで新しいタブを作ったり、わざわざ文字を再度入力しないと行けなかったり、一度に最寄り駅までの徒歩時間のリンクを調べることはできなかった. ゆえに, 既存の手法よりは楽になったように思える.

しかし、これはあくまでPCで使う上での感想であり、スマホで使う場合はGoogle Spread Sheetのアプリを導入していないと全く使えないという点で、かなり不便である。

# SearchNearestStation with HTML(3/20)

スプレッドシート利用によるデメリットをなくすために、GASからhtmlwebページを作成する手法を用いる.

しかし, GASでは, iframeでgoogle mapのwebページを埋め込む手法を制限、もしくは禁止しているようであり、さっそく挫折しそうである.

そもそもルート情報を表記させたgoogle mapをiframeで埋め込むこと自体が, GASではない通常のhtmlでも制限されているようだ.

そして、htmlでスプレッドシートで行っていたことと同様の動作をさせることに成功した.

これにより、デメリットであった、

Spread Sheetに値を入力するという形式なので、利用する際はわざわざGoogle Driveを立ち上げるか、
Google Spread Sheetのアプリを入れる必要があり、サイトを開くまでの手間がかかり、本末転倒になっている。

1つのスプレッドシートだけで行うため, 自分が前に調べた場所名を他人に知られたり、複数人が同時に使うと検索内容が消されたりする可能性がある

の2つを解決することに成功した.

無料でできる範囲はどうやらここまでのようである.

また, PCでのテストしかしていなかったため, スマホでの使用感を知らずにいたのだが, いざスマホで使ってみると横に広いため, 縦長のスマホでは使いずらい印象を受けた.

ユーザー(私自身)がいつでもどこでもスマホで使えるような状況を想定しており, かつPCで使うならスプレッドシート版の方を使えばいいため,

html版はスマホでの使いやすさに追求する.

今後の展望

スプレッドシートにデータを保存し, 直前に調べた10個程度の履歴情報を選択できるようにする.

最寄り駅の前駅, 次駅の名前も掲載する.(動作を重くする原因, 情報量増加による使いにくさの原因となりそうなので, 今のところは用いない).

Google Mapそのものをiframeで埋め込みたかったです
