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

サイトも見つかったけど, サービス利用不可とかだった
[例1](https://zenn.dev/ichii731/articles/509ec8a06a9082)
[例2](https://www.docswell.com/s/ichii731/ZNXYGK-nearest#p4)
