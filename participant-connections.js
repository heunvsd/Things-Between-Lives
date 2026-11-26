// Reviewed phrase links, grounded in each participant's own workshop account.
// Row numbers below refer to the supplied spreadsheet snapshot, including its header.
// Absence of evidence is never highlighted as an imagined life or expectation.
const PARTICIPANT_COLORS={memory:'#ff8077',identity:'#c9ec79',care:'#7bdcca',recognition:'#f4d96e',gift:'#e8b2e3'};
const participantConnection=(id,ko,en,matches)=>({id,color:PARTICIPANT_COLORS[id],source:{ko,en},matches:matches.map(([row,section,ko,en])=>({source:String(row-2),section,ko,en}))});
window.PARTICIPANT_CONNECTIONS={
1:[],2:[],
3:[
 participantConnection('memory',['이 책에서 본 기억','한국의 아주 옛날 영화를'],['I remembered seeing it in this book','a very old Korean film'],[
  [2,2,['아는 포스터','지금은 이름이 바뀐 전철역'],['recognized posters','subway stations whose names have since changed']],
  [3,2,['당시 시대상을 살펴볼 수 있다는 점'],['film cards reveal the period in which they were made']]
 ]),
 participantConnection('identity',['디자인이 멋졌다고'],['the design was wonderful'],[
  [2,2,['극장 건물 그림을 특히 좋아'],['especially liked the drawings of cinema buildings']]
 ])
],
4:[
 participantConnection('memory',['잊었던 기억들을 반추해 보는','그 당시 사진을 꺼내 본 경험'],['revisits forgotten memories','taken out photographs from that time'],[
  [5,2,['삶의 흔적이 남은 물건'],['an object carrying traces of life']],
  [6,2,['잊고 싶지 않은 것을 적어 두는 작은 수첩','개인 사진 앨범'],['a small notebook for things one does not want to forget','a personal photo album']]
 ]),
 participantConnection('care',['아들에게 건네는 작가의 캐주얼한 편지들도 사랑스러웠고','마치 제가 그 부자가 되어'],['The artist’s casual letters to his son were lovely','as if I were that father and son'],[
  [4,2,['두 사람의 교류','가족과의 협업'],['the exchange between them','collaboration with his family']],
  [5,2,['두 세대가 이미지와 글을 주고받는 방식','그 대화를 가까이 느끼게'],['the exchange of images and writing between two generations','brought that conversation closer']]
 ])
],
5:[participantConnection('identity',['밝은 여름옷을 입을 때가 되어 화사해진 나'],['myself looking brighter as it became time to wear light summer clothes'],[
 [7,2,['여름에 잘 어울리는 물건'],['perfect for summer']]
])],
6:[
 participantConnection('identity',['2학기 작업을 멋지게 하는 나'],['Myself making great work in the second semester'],[
  [12,2,['일러스트 초안과 여러 가지 메모'],['illustration drafts and various notes']],
  [14,1,['글귀·아이디어·디자인을 자유롭게 남기는'],['freely recording phrases, ideas and designs']],
  [15,1,['그림과 아이디어를 남기고 싶었다'],['record drawings and ideas']]
 ]),
 participantConnection('memory',['낙서와 스티커로 뒤덮인다','이 스티커는'],['covered in doodles and stickers','one cute sticker'],[
  [8,2,['표지에 피카츄 스티커를 붙이고'],['put a Pikachu sticker on the plain cover']],
  [9,0,['표지에 좋아하는 이미지를 붙일 수 있다는 점'],['its cover could hold images they liked']],
  [10,2,['전시 전단과 잡지 이미지 등을 표지에 붙인다'],['paste exhibition flyers and magazine images on its cover']]
 ]),
 participantConnection('care',['복잡해지는 정신상태를 반영하듯'],['reflecting my increasingly tangled state of mind'],[
  [13,2,['복잡한 마음 등을 자유롭게 적는다'],['freely recording money calculations, tasks and tangled feelings']]
 ])
],
7:[
 participantConnection('gift',['당장 사야 된다고 생각했고'],['I had to buy it right away'],[
  [16,0,['계속 갖고 싶어 했다'],['had long wanted the yellow pumpkin keyring']],
  [17,0,['호박 키링을 꼭 사고 싶어서'],['Determined to buy the pumpkin keyring']]
 ]),
 participantConnection('identity',['두가지 색깔을 사고 싶었다'],['I wanted both colors'],[
  [20,2,['두 색을 모두 사올 걸 그랬다는 아쉬움'],['regret that they had not brought home both colors']]
 ]),
 participantConnection('care',['내 가방과 어울리지 않아서'],['did not go with my bag'],[
  [19,1,['오토바이 차체 색과 어울리도록'],['matched the motorcycle’s color']]
 ])
],
8:[
 participantConnection('gift',['원하는 게 나와 너무 기뻤습니다'],['so happy that it was the one I wanted'],[
  [23,2,['그동안 구하지 못했던 파워퍼프걸 가챠를 얻고','좋은 만남이었다고 기뻐한다'],['delighted to finally obtain the gacha they had been unable to find','a good encounter at the end of the year']]
 ]),
 participantConnection('memory',['파워퍼프걸을 다시 찾아보게'],['look up The Powerpuff Girls again'],[
  [22,0,['추억의 애니메이션'],['a nostalgic cartoon']]
 ])
],
9:[participantConnection('care',['매거진이 낱장으로 구성되어 있고 안에 컨페티도 들어 있어','일반적인 제본 잡지와는 다른 구조'],['The magazine consists of loose sheets and includes confetti','different from a conventionally bound magazine'],[
 [24,2,['컨페티가 들어 있는 상자를 열고','제본되지 않은 이미지 낱장을 직접 꺼내 넘겨 본다','묶이지 않은 이미지를 하나씩 살피는 방식'],['Opening a box containing confetti','take out and turn through the unbound images','looking through loose images one by one']],
 [25,2,['컨페티가 들어 있는 상자를 열고','제본되지 않은 이미지 낱장을 직접 꺼내 넘겨 본다','묶이지 않은 이미지를 하나씩 살피는 방식'],['Opening a box containing confetti','take out and turn through the unbound images','looking through loose images one by one']]
])],
10:[
 participantConnection('identity',['가장 좋아하는 포켓몬의 카드','저의 최애이기에'],['a card of my favorite Pokémon','because it was my favorite'],[
  [27,0,['어린 시절부터 가장 좋아한 포켓몬'],['their favorite Pokémon since childhood']],
  [29,0,['특히 얻고 싶었던 카드'],['particularly hoping for the Poliwhirl']],
  [35,2,['소장한 카드 가운데 좋아하는 그림'],['one of the illustrations they like in their collection']],
  [36,0,['전체 컬렉션 중 가장 좋아하는 그림'],['their favorite illustration in the entire collection']]
 ]),
 participantConnection('gift',['기쁜 마음으로 구매했습니다','이 카드를 가진 행복한 나'],['bought it happily','myself happy to own this card'],[
  [27,2,['마침내 소장한 기쁨'],['joy at finally owning']],
  [29,2,['실제로 팩에서 슈륙챙이를 뽑았을 때 매우 기뻤으며'],['delighted when they actually pulled Poliwhirl']],
  [37,2,['원하던 두 카드를 모두 얻었다','신기하고 즐거운 경험'],['obtained both cards they had wanted','surprising pleasure']],
  [40,2,['직접 얻은 순간이 매우 만족스러웠다고'],['obtaining it themselves was deeply satisfying']]
 ]),
 participantConnection('care',['카드 보관함','진열장에 고이 모셔 두었습니다'],['a card case','placed it safely in the display cabinet'],[
  [38,2,['본인 바인더에 보관'],['kept in their own binder']],
  [43,2,['보존을 통해 전시·기록하는 대상'],['display and document through grading and preservation']]
 ])
],
11:[],
12:[
 participantConnection('care',['머리가 약간 건조해져서','머릿결도 훨씬 부드러워진 느낌','머릿결이 되게 좋아졌단'],['My hair had become a little dry','my hair felt much softer','my hair became much nicer'],[
  [46,0,['머리가 점점 건조하고 푸석해지는 느낌'],['their hair was growing drier and rougher']],
  [48,2,['잔머리가 차분해졌고'],['settled flyaways']],
  [51,2,['머리가 차분해지고'],['smoothed their hair']],
  [52,2,['부드러움과 은은한 향을 함께 느꼈다'],['both softness and a subtle scent']],
  [56,2,['부드러워지고 윤기가 나며 정돈'],['soft, shiny and tidy']],
  [58,2,['머릿결이 좋아 보이게'],['makes their hair look healthier']],
  [61,2,['머리가 더 매끄럽고 윤기 있게'],['their hair felt smoother and shinier']]
 ]),
 participantConnection('identity',['제가 좋아하는 분위기가 딱 떠오르는','제 취향이기도 하고','은은하지만 그 속에서 달콤함'],['a feeling I like','suited my taste','subtle but has a sweetness within it'],[
  [47,2,['향이 특히 고급스럽고 마음에 들었다'],['scent particularly refined and pleasing']],
  [55,2,['무화과의 은은한 단맛이 섞인 우디 향이 취향에 맞고'],['woody scent with a subtle sweetness of fig suits their taste']],
  [57,2,['향이 지나치게 강하지 않고','머리가 움직일 때 은은하게 느껴진다'],['scents are not overpowering','emerge subtly when the hair moves']],
  [58,2,['포근한 향이 자신의 취향에 잘 맞아'],['comforting scent suits their taste']]
 ])
],
13:window.WORKSHOP_CONNECTIONS,
14:[
 participantConnection('care',['기분 전환을 하기 위해','기분이 좋아진 사람'],['to lift my mood','Someone made happier by a very small change'],[
  [129,2,['자신을 기분 좋게 해준다고','좀 더 장난스럽고 가벼운 기분을 원할 때'],['lifts their mood','when they want to feel a little more playful and lighthearted']]
 ]),
 participantConnection('identity',['내가 좋아하는 향이 나는 립밤'],['a scent I like'],[
  [121,2,['포도향을 좋아하고'],['like purple and grape scents']],
  [122,2,['강한 달콤한 향을 좋아한다'],['like the strong, sweet scent']],
  [126,2,['향과 제형이 마음에 들어'],['hooked on Gummy Bear’s delicious-smelling scent and formula']]
 ]),
 participantConnection('memory',['원래 쓰던 립밤이 있었지만','립밤을 새로 구매했습니다'],['I already had a lip balm','bought a new one'],[
  [128,0,['새로운 향을 시험해 보고 싶어'],['wanted to try a new scent']]
 ])
],
15:[],
16:[participantConnection('gift',['사지 않을 수 없었습니다'],['I could not resist buying it'],[
 [133,0,['자기 컬렉션에 넣어야겠다고 생각'],['felt they had to add it to their collection']]
])]
};
