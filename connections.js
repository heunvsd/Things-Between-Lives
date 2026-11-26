// Every connection starts in Hanguk's workshop text.
// Matches are reviewed in context, not inferred from generic product vocabulary.
window.WORKSHOP_CONNECTIONS = [
 {id:'memory',color:'#ff8077',
  source:{ko:['기억에 남았습니다','잊히지 않아','1년 가까이 마음에 두다가','오랜 고민','기억에 남았던'],en:['stayed in my memory','could not forget','keeping it in mind for almost a year','a long period of consideration']},
  matches:[
   {source:'63',section:0,ko:['두 달 동안 향이 생각나'],en:['stayed on their mind throughout the flight and for two months afterward']},
   {source:'72',section:0,ko:['잊지 못해'],en:['unable to forget']},
   {source:'73',section:0,ko:['인상에 남았다고'],en:['left an impression']},
   {source:'73',section:2,ko:['기억에 남는 향'],en:['memorable scent']},
   {source:'94',section:0,ko:['계속 생각나'],en:['kept coming to mind']},
   {source:'86',section:0,ko:['계속 이마지나시옹이 떠올라'],en:['Imagination kept returning to mind']},
   {source:'97',section:0,ko:['구매하기까지 일 년 이상이 걸렸다고'],en:['buying Imagination took more than a year']}
  ]},
 {id:'identity',color:'#c9ec79',
  source:{ko:['오래 기억되는 사람','은은한 인상','취향이 분명하며'],en:['someone others would remember for a long time','a subtle impression','a distinct taste']},
  matches:[
   {source:'84',section:1,ko:['세련된 인상을 줄 것 같다는 기대'],en:['leave a refined impression']},
   {source:'94',section:1,ko:['자신을 대표하는 향'],en:['one of their signature scents']},
   {source:'101',section:0,ko:['자신의 대표 향'],en:['their signature scent']},
   {source:'101',section:1,ko:['자신만의 대표 향'],en:['their own signature']},
   {source:'109',section:2,ko:['자신의 시그니처 향'],en:['their signature scent']}
  ]},
 {id:'care',color:'#7bdcca',
  source:{ko:['자기 자신을 잘 돌보는','환기하는','리셋되는'],en:['takes good care of themselves','clear my mind','a brief reset']},
  matches:[
   {source:'61',section:2,ko:['다른 걱정에서 주의를 돌릴 수'],en:['turn away from other worries']},
   {source:'68',section:1,ko:['뒤숭숭한 기분을 가라앉히고'],en:['calm an unsettled mood']},
   {source:'94',section:2,ko:['기분을 북돋는'],en:['uplifting']},
   {source:'95',section:2,ko:['기분을 북돋는'],en:['uplifting']},
   {source:'114',section:0,ko:['자신을 깨워 줄'],en:['wake them up']}
  ]},
 {id:'recognition',color:'#f4d96e',
  source:{ko:['무슨 향이냐고 물어봐서','뿌듯했습니다'],en:['ask what scent I am wearing','quietly proud']},
  matches:[
   {source:'76',section:2,ko:['향이 좋다는 말을 듣거나 어떤 향수인지 질문받은'],en:['compliment the scent or ask which fragrance they are wearing']},
   {source:'82',section:2,ko:['칭찬받았다고','좋게 평가해 주어 기뻤다고'],en:['receiving a compliment','happy that someone else appreciated']},
   {source:'108',section:2,ko:['주변 반응이 좋았고'],en:['received positive reactions']},
   {source:'93',section:2,ko:['늘 향이 좋은 사람으로 통한다는 말을 듣고 무척 기뻤다'],en:['they were known for always smelling good, which delighted them']}
  ]},
 {id:'gift',color:'#e8b2e3',
  source:{ko:['스스로에게 주는 선물'],en:['a gift to myself']},
  matches:[{source:'89',section:0,ko:['자신에게 선물하려고'],en:['a gift to themselves']}]}
];
