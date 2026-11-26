const participants=window.WORKSHOP_PARTICIPANTS;
// Temporary display filter only. All 16 participants and their content stay intact.
// Add an id here to show that participant again, or use participants.map(person=>person.id).
const visibleParticipantIds=new Set([13,14]); // 김항욱, 이해인
const rows=Object.fromEntries(window.ACCOUNT_ROWS.map(r=>[r[0],r]));
const T = window.TRANSLATIONS;
const accountLanguage=id=>window.ACCOUNT_LANGUAGES[id];
const accountAuthor=id=>accountLanguage(id)==='en'?(window.ACCOUNT_AUTHOR_EN[id]||rows[id][8]):rows[id][8];
function authorLabel(id){
 const name=accountAuthor(id).trim();
 // Missing bylines are descriptions, not invented usernames.
 if(/not identified|확인.*(?:불가|못함)/i.test(name))return name;
 const handle=name.match(/(?:^|\s|\/)@([^\s/]+)/);
 return '@'+(handle?handle[1]:name.replace(/^(?:u\/|@)+/,''));
}
function inlineAuthor(id,masked=false){
 const text=authorLabel(id).replace(/:+$/,'')+':',lang=/[ぁ-ヿ]/.test(text)?'ja':accountLanguage(id);
 const author=node('span',null,'author',lang);
 if(masked)addContext(author,text,lang);else author.textContent=text;
 return author;
}
const sheet = document.querySelector('#sheet');
const dialog = document.querySelector('#detail');
let activePerson,original,connections=[];
const clamp = (x, a=0, b=1) => Math.min(b, Math.max(a, x));
function node(tag, text, cls, lang) {
 const el = document.createElement(tag);
 if (text) el.textContent = text;
 if (cls) el.className = cls;
 if (lang) el.lang = lang;
 return el;
}
function bilingual(parent, tag, ko, en, cls='') {
 const wrap = node(tag, null, cls);
 wrap.append(node('span', ko, 'ko', 'ko'), node('span', en, 'en', 'en'));
 parent.append(wrap);return wrap;
}
function showDetail(id) {
 const body = document.querySelector('#detail-content');body.replaceChildren();
 const lang=id!==null?accountLanguage(id):'ko',isKorean=lang==='ko';
 const appendText=(tag,text,cls='')=>{
  const wrap=node(tag,null,cls);wrap.append(node('span',text,lang,lang));body.append(wrap);return wrap;
 };
 appendText('small',id!==null?(isKorean?'관련 기록 · 제공된 시트의 요약':'Related account · translated spreadsheet summary'):'워크숍 원문 · '+activePerson.name);
 appendText('h2',id!==null?(isKorean?rows[id][3]:T.sources[id].title):activePerson.title).id='detail-title';
 const text=id!==null?(isKorean?rows[id].slice(4,7):T.sources[id].text):original;
 const paragraph=appendText('p',text.join(' '),'detail-pair');
 if(id!==null){
  paragraph.firstChild.prepend(inlineAuthor(id),document.createTextNode(' '));
  const a = node('a');a.href=rows[id][7];a.target='_blank';a.rel='noopener noreferrer';
  a.append(node('span',isKorean?'원문 출처 열기':'Read the source',lang,lang));body.append(a);
 }else{
  const img=node('img');img.src=activePerson.image;img.alt=activePerson.name+'의 워크숍 원문';body.append(img);
 }
 if(!dialog.open)dialog.showModal();
}
const composition=document.querySelector('#composition');
const workshop=document.querySelector('#workshop');
const visitorView=()=>window.Visitor?.view===2;
// Decorate text nodes inside the canonical workshop markup. Original keyword padding,
// font metrics and fragment boundaries stay identical when switching 1 ↔ 2.
function decorateVisitorPart(part,ranges,source,section){
 const walker=document.createTreeWalker(part,NodeFilter.SHOW_TEXT),texts=[];
 let text;while((text=walker.nextNode()))texts.push(text);
 let offset=0;
 texts.forEach(text=>{
  const value=text.data,start=offset,end=start+value.length;offset=end;
  const cuts=ranges.filter(r=>r.end>start&&r.start<end).sort((a,b)=>a.start-b.start);
  const fragment=document.createDocumentFragment();let cursor=start;
  const append=(a,b,range)=>{
   if(b<=a)return;
   const span=node('span',value.slice(a-start,b-start),range?'visitor-keyword':'visitor-unrelated');
   if(range){span.dataset.connection=range.id;span.dataset.match=source+':'+section+':'+range.start;span.style.setProperty('--connection',range.color)}
   fragment.append(span);
  };
  cuts.forEach(r=>{const a=Math.max(start,r.start,cursor),b=Math.min(end,r.end);if(b<=a)return;append(cursor,a);append(a,b,r);cursor=b});
  append(cursor,end);text.replaceWith(fragment);
 });
}
sheet.dataset.basis=visitorView()?'visitor':'workshop';
let expandedWidth=sheet.clientWidth,expandedViewportWidth=innerWidth,readingTypeSize=0;
// Neutral, straight grayscale ramps like a graphics editor's gradient tool.
// Stable variation keeps each rectangle's tone while its overlap changes.
const blockPalettes=[
 {name:'linear',stops:[[0,255],[1,0]]},
 {name:'delayed',stops:[[0,255],[.18,247],[.92,0],[1,0]]},
 {name:'reverse',stops:[[0,0],[.88,247],[1,255]]},
 {name:'flat',stops:[[0,0],[1,0]]}
];
const blockFragments=[];
function addContext(ink,text,lang){
 const context=node('span',null,'context');ink.append(context);
 const tone=198+(Math.imul(blockFragments.length+7,41)>>>0)%40;
 context.style.setProperty('--context-gray',`rgb(${tone} ${tone-1} ${tone-2})`);
 const words=text.match(/\S+\s*|\s+/g)||[];
 let chunk='';
 const flush=()=>{
  if(!chunk)return;
  const index=blockFragments.length;
  const seed=((Math.imul(index+1,2654435761)>>>0)%997)/997;
  const fragment=node('span',chunk,'block-fragment');context.append(fragment);
  const palette=index%blockPalettes.length,gray=158+Math.round(seed*48),heightScale=Number((.94+seed*.18).toFixed(3));
  fragment.style.setProperty('--block-height',heightScale+'em');
  fragment.dataset.surface=blockPalettes[palette].name;
  blockFragments.push({el:fragment,palette,gray,heightScale,threshold:.18+seed*.9,covered:false});chunk='';
 };
 words.forEach(word=>{
  chunk+=word;
  if(chunk.length>=(lang==='ko'?3:6)+(blockFragments.length%4)*2)flush();
 });flush();
}

// Use literal, reviewed phrases so product words cannot accidentally imply a shared life.
function annotate(text,marks,lang,cls='phrase'){
 const el=node('span',null,cls+' '+lang,lang),ink=node('span',null,'ink');el.append(ink);
 const ranges=[];
 marks.forEach(({connection,phrases})=>phrases.forEach(phrase=>{
  let start=0;
  while((start=text.indexOf(phrase,start))!==-1){ranges.push({start,end:start+phrase.length,connection});start+=phrase.length}
 }));
 ranges.sort((a,b)=>a.start-b.start||b.end-a.end);
 let cursor=0;
 ranges.forEach(({start,end,connection})=>{
  if(start<cursor)return;
  addContext(ink,text.slice(cursor,start),lang);
  const mark=node('mark',text.slice(start,end),'keyword');
  mark.dataset.connection=connection.id;mark.style.setProperty('--connection',connection.color);ink.append(mark);cursor=end;
 });
 addContext(ink,text.slice(cursor),lang);
 return el;
}
function matchPassage(id,section,ko){
 const found=[];
 for(const connection of connections){
  const match=connection.matches.find(m=>m.source===id&&m.section===section&&m.ko.some(phrase=>ko.includes(phrase)));
  if(match)found.push({connection,ko:match.ko,en:match.en});
 }
 return found;
}
// Retain the established perfume reading order, then include the remaining sheet rows.
const leadingIds=['63','94','76','61','73','84','82','89'];
const columnCount=6,columnGap=18,pageMargin=16,reflowMix=.5;
const passages=[],accounts=[];
function buildAccount(id,index){
 const article=node('article',null,'account');article.dataset.source=id;composition.append(article);
 const lang=accountLanguage(id);article.dataset.language=lang;
 // Display one language; reviewed connections still match the Korean source summaries.
 const el=node('button',null,'passage account-copy');el.type='button';el.dataset.source=id;
 const copy=node('span',null,'phrase '+lang,lang);
 copy.append(inlineAuthor(id,true),document.createTextNode(' '));
 const matches=[];
 rows[id].slice(4,7).forEach((ko,section)=>{
  const found=matchPassage(id,section,ko);matches.push(...found);
  if(section)copy.append(document.createTextNode(' '));
  const text=lang==='ko'?ko:T.sources[id].text[section];
  const visitorRanges=(window.Visitor?.result?.groups||[]).flatMap(g=>g.ranges.filter(r=>r.source===id&&r.section===section).map(r=>({...r,id:g.id,color:g.color})));
  const part=annotate(text,found.map(m=>({connection:m.connection,phrases:m[lang]})),lang,'account-part');
  if(visitorView())decorateVisitorPart(part,visitorRanges,id,section);
  part.dataset.section=String(section);copy.append(part);
 });
 const match=matches.length>0;
 el.classList.toggle('connected',match);
 if(match)el.dataset.connection=[...new Set(matches.map(m=>m.connection.id))].join(' ');
 el.append(copy);el.addEventListener('click',()=>showDetail(id));article.append(el);
 const item={el,copy,match,index:passages.length};passages.push(item);
 return {items:[item],index};
}

function renderParticipant(id,refresh=false){
 const person=participants.find(p=>p.id===id)||participants[12];
 if(activePerson?.id===person.id&&!refresh)return;
 window.Visitor?.setPerson(person);
 if(dialog.open)dialog.close();
 resetKeywordAccents();
 activePerson=person;original=person.original;
 connections=window.PARTICIPANT_CONNECTIONS[person.id]||[];
 blockFragments.length=0;passages.length=0;accounts.length=0;
 workshop.replaceChildren();composition.replaceChildren(blockLayer,colorLayer,sharpLayer);
 invalidateReadingGeometry();
 colorRects.replaceChildren();sharpLayer.replaceChildren();
 sheet.dataset.participant=String(person.id);
 sheet.dataset.content=visibleParticipantIds.has(person.id)?'visible':'hidden';
 sheet.dataset.effect=person.id===13?'inkblocks':'blocks';
 sheet.setAttribute('aria-label',person.object+' / '+person.titleEn);
 workshop.setAttribute('aria-label',person.name+'의 워크숍 이야기 / '+person.nameEn+'’s workshop story');
 document.title='Things Between Lives';
 const source=node('button',null,'workshop-source');source.type='button';
 source.title='워크숍 원문 보기';source.setAttribute('aria-haspopup','dialog');
 source.append(annotate(original.join(' '),connections.map(c=>({connection:c,phrases:c.source.ko})),'ko','workshop-copy'));
 source.addEventListener('click',()=>showDetail(null));workshop.append(source);
 accentSourceMarks=[...workshop.querySelectorAll('.keyword')];
 accentStages=new Map([...new Set(accentSourceMarks.map(mark=>mark.dataset.connection))].map((connection,index)=>[connection,index]));
 const sourceIds=window.ACCOUNT_ROWS.filter(r=>r[1]===person.name).map(r=>r[0]);
 if(person.id===13)sourceIds.sort((a,b)=>{
  const ai=leadingIds.indexOf(a),bi=leadingIds.indexOf(b);
  return (ai<0?100+Number(a):ai)-(bi<0?100+Number(b):bi);
 });
 sourceIds.forEach((source,index)=>accounts.push(buildAccount(source,index)));
 composition.classList.toggle('empty',!accounts.length);
 if(!accounts.length)bilingual(composition,'p','아직 연결된 글이 없습니다.','No related accounts yet.','empty-copy');
 navigation.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.person)===person.id)));
 if(!refresh){expandedWidth=sheet.clientWidth;expandedViewportWidth=innerWidth;window.scrollTo({top:0,behavior:'instant'})}
 scheduleLayout();
}
const svgNS='http://www.w3.org/2000/svg';
const colorLayer=document.createElementNS(svgNS,'svg');
colorLayer.classList.add('overlap-colors');colorLayer.setAttribute('aria-hidden','true');
composition.append(colorLayer);
const colorDefs=document.createElementNS(svgNS,'defs');colorLayer.append(colorDefs);
// Secondary hues appear only where the gray covers physically cross a colored phrase.
const overlapPalette={memory:['#8f66ef','#42c9ed'],identity:['#7d69ed','#df78b2'],care:['#ed8c68','#bd75d9'],recognition:['#48bfc5','#9174e6'],gift:['#4eaddb','#e9a75d']};
Object.entries(overlapPalette).forEach(([id,colors])=>{
 const gradient=document.createElementNS(svgNS,'linearGradient');gradient.id='overlap-'+id;
 gradient.setAttribute('x2','1');gradient.setAttribute('y2','1');
 colors.forEach((color,i)=>{const stop=document.createElementNS(svgNS,'stop');stop.setAttribute('offset',String(i));stop.setAttribute('stop-color',color);gradient.append(stop)});
 colorDefs.append(gradient);
});
const colorRects=document.createElementNS(svgNS,'g');colorLayer.append(colorRects);
const sharpLayer=node('div',null,'sharp-keywords');composition.append(sharpLayer);
// One visible-window canvas blends the covers independently of the readable text.
const blockLayer=node('canvas',null,'block-density');blockLayer.setAttribute('aria-hidden','true');blockLayer.hidden=true;
composition.append(blockLayer);
const blockPaint=blockLayer.getContext('2d');
let blockBoxes=[],densityQueued=false;
function measureBlockBoxes(){
 blockBoxes=[];
 const origins=new Map(readingRows.map(owner=>[owner,{rect:owner.el.getBoundingClientRect(),fontSize:parseFloat(getComputedStyle(owner.el.querySelector('.phrase')).fontSize)}]));
 blockFragments.forEach(fragment=>{
  const owner=geometryByElement.get(fragment.el.closest('.passage'));
  if(!owner)return;
  const origin=origins.get(owner),baseHeight=origin.fontSize*fragment.heightScale;
  for(const rect of fragment.el.getClientRects()){
   const width=Math.max(0,rect.width-2);if(!width||!rect.height)continue;
   // Preserve the top edge, but cover the font's full descent (g, y, p, q, j).
   // A half CSS pixel below the font box also catches antialiased lower edges.
   const top=rect.top+(rect.height-baseHeight)/2;
   const bottom=Math.max(top+baseHeight,rect.bottom+.5);
   blockBoxes.push({fragment,owner,dx:rect.left-origin.rect.left+1,dy:top-origin.rect.top,width,height:bottom-top});
  }
 });
}
function paintBlockContacts(visible){
 // Sweep only neighboring rows. A reaction exists only where two different accounts touch.
 const sorted=visible.slice().sort((a,b)=>a.y-b.y),contacts=[];
 for(let i=0;i<sorted.length;i++){
  const a=sorted[i];
  for(let j=i+1;j<sorted.length&&sorted[j].y<a.y+a.height;j++){
   const b=sorted[j];if(a.owner===b.owner)continue;
   const left=Math.max(a.x,b.x),right=Math.min(a.x+a.width,b.x+b.width);
   const top=Math.max(a.y,b.y),bottom=Math.min(a.y+a.height,b.y+b.height);
   if(right-left<1||bottom-top<1)continue;
   const pressure=clamp(((right-left)/Math.min(a.width,b.width)-.04)/.55)*clamp((bottom-top)/Math.min(a.height,b.height));
   if(pressure<=0)continue;
   contacts.push({left,right,top,bottom,pressure});
  }
 }
 // A single neutral exclusion ramp remaps the shared grayscale values.
 // No diagonal light, specular edge or screen pass: the reaction stays a plain rectangle.
 // Mid-gray inputs keep repeated intersections away from solid black.
 blockPaint.globalCompositeOperation='exclusion';
 contacts.sort((a,b)=>a.pressure-b.pressure).forEach(({left,right,top,bottom,pressure})=>{
  const transfer=blockPaint.createLinearGradient(0,top,0,bottom);
  transfer.addColorStop(0,'#606060');transfer.addColorStop(1,'#a0a0a0');
  blockPaint.globalAlpha=.58+pressure*.24;blockPaint.fillStyle=transfer;
  blockPaint.fillRect(left,top,right-left,bottom-top);
 });
 blockPaint.globalAlpha=1;blockPaint.globalCompositeOperation='source-over';
 blockLayer.dataset.contacts=String(contacts.length);
}
function paintBlockDensity(){
 const started=performance.now();
 if(visitorView()||sheet.dataset.mode!=='blocks'||!blockBoxes.length){blockLayer.hidden=true;blockLayer.dataset.drawn='0';blockLayer.dataset.contacts='0';return}
 const bounds=composition.getBoundingClientRect(),overscan=96;
 const top=Math.floor(Math.max(0,-bounds.top-overscan));
 const bottom=Math.ceil(Math.min(compositionHeight,innerHeight-bounds.top+overscan));
 if(bottom<=top){blockLayer.hidden=true;blockLayer.dataset.drawn='0';blockLayer.dataset.contacts='0';return}
 const width=Math.ceil(bounds.width),height=bottom-top,ratio=Math.min(devicePixelRatio||1,1.5);
 const pixelWidth=Math.ceil(width*ratio),pixelHeight=Math.ceil(height*ratio);
 if(blockLayer.width!==pixelWidth)blockLayer.width=pixelWidth;
 if(blockLayer.height!==pixelHeight)blockLayer.height=pixelHeight;
 Object.assign(blockLayer.style,{width:width+'px',height:height+'px',transform:`translateY(${top}px)`});
 blockPaint.setTransform(ratio,0,0,ratio,0,0);
 blockPaint.clearRect(0,0,width,height);
 blockPaint.globalCompositeOperation='source-over';
 const visible=[];let drawn=0;
 blockBoxes.forEach(({fragment,owner,dx,dy,width:boxWidth,height:boxHeight})=>{
  if(!fragment.covered)return;
  const x=owner.x+dx,y=owner.y+dy-top;
  if(y+boxHeight<0||y>height||x+boxWidth<pageMargin||x>width-pageMargin)return;
  const palette=blockPalettes[fragment.palette];
  const gradient=blockPaint.createLinearGradient(0,y,0,y+boxHeight);
  palette.stops.forEach(([offset,value])=>{
   const gray=value===0?fragment.gray:value;
   gradient.addColorStop(offset,`rgb(${gray} ${gray} ${gray})`);
  });
  blockPaint.fillStyle=gradient;
  blockPaint.fillRect(x,y,boxWidth,boxHeight);drawn++;
  visible.push({x,y,width:boxWidth,height:boxHeight,owner});
 });
 paintBlockContacts(visible);
 blockLayer.hidden=drawn===0;blockLayer.dataset.drawn=String(drawn);
 blockLayer.dataset.paintMs=(performance.now()-started).toFixed(2);
}
function scheduleBlockDensity(){
 if(densityQueued)return;
 densityQueued=true;requestAnimationFrame(()=>{densityQueued=false;paintBlockDensity()});
}
// Line fragments are measured once per reading width, then moved with their owner.
let sharpLines=[];
let accentStartedAt=null,accentTimer=null,accentSourceMarks=[],accentStages=new Map();
function resetKeywordAccents(){
 clearTimeout(accentTimer);accentTimer=null;accentStartedAt=null;
 [...accentSourceMarks,...sharpLines.map(line=>line.copy)].forEach(el=>el.classList.remove('is-accented'));
}
function syncKeywordAccents(visible){
 if(visitorView()||!visible||activePerson.id!==13){if(accentStartedAt!==null)resetKeywordAccents();return}
 // Begin with the first covered fragments, not while the page is still fully readable.
 if(accentStartedAt===null){
  if(Number(sheet.dataset.blocks)===0)return;
  accentStartedAt=performance.now();
 }
 const now=performance.now(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let next=Infinity;
 const reveal=el=>{
  const step=accentStages.get(el.dataset.connection);if(step===undefined)return;
  const due=accentStartedAt+200+step*850;
  el.dataset.revealStep=String(step);
  if(reduced||now>=due){
   if(!el.classList.contains('is-accented')){
    // Rewrapped lines join the existing phase, including a partially drawn underline.
    el.style.setProperty('--underline-delay',(due+180-now).toFixed(1)+'ms');
    el.classList.add('is-accented');
   }
  }else next=Math.min(next,due);
 };
 accentSourceMarks.forEach(reveal);
 sharpLines.forEach(({copy})=>{if(copy.classList.contains('source-link'))reveal(copy)});
 // Five discrete updates, not a per-frame animation or an endless polling loop.
 clearTimeout(accentTimer);accentTimer=null;
 if(Number.isFinite(next))accentTimer=setTimeout(()=>syncKeywordAccents(true),next-now+2);
}

function measureSharpKeywords(){
 sharpLines=[];sharpLayer.replaceChildren();
 const fragment=document.createDocumentFragment(),tabStops=new Set();
 composition.querySelectorAll(visitorView()?'.visitor-keyword':'.keyword').forEach(mark=>{
  const owner=geometryByElement.get(mark.closest('.passage'));
  if(!owner)return;
  const origin=owner.el.getBoundingClientRect(),text=mark.firstChild,style=getComputedStyle(mark);
  const lineHeight=parseFloat(style.lineHeight),range=document.createRange(),lines=[];let offset=0;
  for(const char of text.textContent){
   range.setStart(text,offset);offset+=char.length;range.setEnd(text,offset);
   const box=range.getBoundingClientRect();if(!box.height)continue;
   let line=lines.at(-1);
   if(!line||Math.abs(line.top-box.top)>.5){line={top:box.top,left:box.left,height:box.height,text:''};lines.push(line)}
   line.text+=char;
  }
  const sourceId=owner.el.dataset.source;
  let sourceURL=null;
  if(visitorView()||activePerson.id===13){
   try{const url=new URL(rows[sourceId][7]);if(/^https?:$/.test(url.protocol))sourceURL=url.href}catch{}
  }
  lines.forEach((line,lineIndex)=>{
   const copy=node(sourceURL?'a':'span',line.text,sourceURL?'source-link':null,mark.closest('[lang]').lang);
   copy.dataset.connection=mark.dataset.connection;copy.dataset.source=sourceId;
   if(sourceURL){
    copy.href=sourceURL;copy.target='_blank';copy.rel='noopener noreferrer';
    copy.title=authorLabel(sourceId)+' 원문 열기';
    copy.setAttribute('aria-label',mark.textContent.trim()+' — '+authorLabel(sourceId)+' 원문 (새 탭)');
    // Wrapped lines remain clickable, with one keyboard stop for the complete phrase.
    const matchKey=mark.dataset.match;
    if(lineIndex||(matchKey&&tabStops.has(matchKey))){copy.tabIndex=-1;copy.setAttribute('aria-hidden','true')}
    if(matchKey)tabStops.add(matchKey);
   }else copy.setAttribute('aria-hidden','true');
   copy.style.setProperty('--connection',mark.style.getPropertyValue('--connection'));
   Object.assign(copy.style,{fontFamily:style.fontFamily,fontSize:style.fontSize,fontWeight:style.fontWeight,fontStyle:visitorView()?'normal':'italic',fontSynthesis:visitorView()?'none':'style',letterSpacing:style.letterSpacing,lineHeight:style.lineHeight,left:'0',top:'0'});
   sharpLines.push({copy,owner,dx:line.left-origin.left,dy:line.top-origin.top-(lineHeight-line.height)/2});fragment.append(copy);
  });
 });
 sharpLayer.append(fragment);
}
function paintSharpKeywords(visible){
 sharpLayer.hidden=!visible;
 if(!visible){syncKeywordAccents(false);return}
 sharpLines.forEach(({copy,owner,dx,dy})=>{copy.style.transform=`translate(${(owner.x+dx).toFixed(2)}px,${(owner.y+dy).toFixed(2)}px)`});
 syncKeywordAccents(true);
}
function paintOverlapColors(p){
 colorRects.replaceChildren();
 if(p===0){colorLayer.dataset.intersections='0';return}
 const bounds=composition.getBoundingClientRect();
 const boxes=el=>[...el.getClientRects()].map(r=>({left:r.left-bounds.left,top:r.top-bounds.top,right:r.right-bounds.left,bottom:r.bottom-bounds.top}));
 const covers=blockBoxes.filter(box=>box.fragment.covered).map(({owner,dx,dy,width,height})=>({left:owner.x+dx,top:owner.y+dy,right:owner.x+dx+width,bottom:owner.y+dy+height,owner:owner.el}));
 const painted=document.createDocumentFragment();let count=0;
 composition.querySelectorAll('.keyword').forEach(mark=>{
  const owner=mark.closest('.passage');
  boxes(mark).forEach(key=>covers.forEach(cover=>{
   if(cover.owner===owner)return;
   const x=Math.max(16,key.left,cover.left),y=Math.max(key.top,cover.top);
   const right=Math.min(bounds.width-16,key.right,cover.right),bottom=Math.min(key.bottom,cover.bottom);
   if(right-x<.5||bottom-y<.5)return;
   const rect=document.createElementNS(svgNS,'rect');
   rect.setAttribute('x',x.toFixed(2));rect.setAttribute('y',y.toFixed(2));
   rect.setAttribute('width',(right-x).toFixed(2));rect.setAttribute('height',(bottom-y).toFixed(2));
   rect.setAttribute('fill',`url(#overlap-${mark.dataset.connection})`);
   painted.append(rect);count++;
  }));
 });
 colorRects.append(painted);colorLayer.dataset.intersections=String(count);
}
let queued=false;
function scheduleLayout(){if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;layout()})}}
function keepSelectedNameVisible(){
 const selected=navigation.querySelector('[aria-pressed="true"]');
 if(!selected)return;
 const navBox=navigation.getBoundingClientRect(),box=selected.getBoundingClientRect();
 if(box.left<navBox.left+16)navigation.scrollLeft+=box.left-navBox.left-16;
 else if(box.right>navBox.right-16)navigation.scrollLeft+=box.right-navBox.right+16;
}
// Blend fixed and fluid text widths; cache geometry until the blended measure changes.
let measuredWidth=-1,readingRows=[];
const geometryByElement=new Map();
const stainNoise=(index,salt)=>((Math.imul(index+salt,2654435761)>>>0)%997)/997;
let geometryRevision=0,lastLayoutKey='',compositionHeight=0;
function invalidateReadingGeometry(){
 measuredWidth=-1;readingRows=[];sharpLines=[];blockBoxes=[];lastLayoutKey='';geometryByElement.clear();
}
function measureReadingGeometry(cw){
 const elements=[...composition.querySelectorAll('.passage')];
 // Batch writes, then read the newly wrapped heights before stacking each column.
 elements.forEach(el=>{el.style.width=cw.toFixed(2)+'px'});
 const heights=new Map(elements.map(el=>[el,el.getBoundingClientRect().height]));
 const accountGap=parseFloat(getComputedStyle(composition.querySelector('.phrase')||workshop.querySelector('.workshop-copy')).lineHeight);
 readingRows=[];geometryByElement.clear();const columnsY=Array(columnCount).fill(12);let bottom=0;
 const add=(el,column,y,seed)=>{
  const row={el,column,y,height:heights.get(el),width:cw,seed,x:0};
  readingRows.push(row);geometryByElement.set(el,row);
 };
 accounts.forEach(({items,index})=>{
  const column=index%columnCount;let y=columnsY[column];
  items.forEach(({el,index:passageIndex,match})=>{
   add(el,column,y,passageIndex*7+103);el.style.zIndex=String((match?20:2)+passageIndex%5);
   y+=heights.get(el);bottom=Math.max(bottom,y);
  });columnsY[column]=y+accountGap;
 });
 compositionHeight=accounts.length?Math.ceil(bottom+32):0;
 composition.style.height=accounts.length?compositionHeight+'px':'auto';
 measuredWidth=cw;geometryRevision++;
 measureBlockBoxes();
 measureSharpKeywords();
}
function layout(){
 const started=performance.now(),w=sheet.clientWidth;
 const key=w+':'+innerHeight+':'+activePerson.id+':'+measuredWidth;
 if(key===lastLayoutKey)return;
 expandedWidth=Math.max(expandedWidth,w);
 expandedViewportWidth=Math.max(expandedViewportWidth,innerWidth);
 // Match the reference's 8px type on a 1024px design canvas, then keep
 // that reading size while the window narrows so the text can overlap.
 const typeSize=Math.max(10,expandedViewportWidth/128);
 if(typeSize!==readingTypeSize){
  readingTypeSize=typeSize;
  document.documentElement.style.setProperty('--text-size',typeSize+'px');
  invalidateReadingGeometry();
 }
 if(sheet.dataset.content==='hidden'){
  sheet.dataset.mode='reading';sheet.dataset.blocks='0';sheet.dataset.overlap='0';
  blockLayer.hidden=true;sharpLayer.hidden=true;colorRects.replaceChildren();
  blockLayer.dataset.drawn='0';blockLayer.dataset.contacts='0';
  keepSelectedNameVisible();lastLayoutKey=key;
  return;
 }
 const p=clamp((expandedWidth-w-40)/Math.max(240,expandedWidth*.52-40));
 sheet.dataset.mode=p===0?'reading':'blocks';sheet.dataset.width=Math.round(w);
 sheet.style.setProperty('--reveal',String(clamp((p-.035)/.4)));
 const strike=visitorView()&&window.Visitor.result?1:0;
 sheet.style.setProperty('--strike',String(strike));sheet.dataset.strike=strike.toFixed(3);
 let covered=0;
 blockFragments.forEach(fragment=>{
  // Keep the participant's source story complete; masks belong to the related accounts.
  const hidden=!visitorView()&&p>=fragment.threshold&&composition.contains(fragment.el);
  if(hidden!==fragment.covered){fragment.el.classList.toggle('covered',hidden);fragment.covered=hidden}
  if(hidden)covered++;
 });
 sheet.dataset.blocks=covered;
 const t=clamp(p/.65),mix=1-(1-t)*(1-t);
 // Half of the window contraction reflows text; the other half retains its reading width.
 const columnWidth=width=>Math.max(72,(width-pageMargin*2-columnGap*(columnCount-1))/columnCount);
 const fixedWidth=columnWidth(expandedWidth),fluidWidth=columnWidth(w);
 const cw=Math.min(Math.max(72,w-pageMargin*2),fixedWidth+(fluidWidth-fixedWidth)*reflowMix);
 sheet.dataset.overlap=mix.toFixed(3);
 if(measuredWidth!==cw)measureReadingGeometry(cw);
 const pitch=Math.max(0,(w-pageMargin*2-cw)/(columnCount-1));
 const overlapDepth=Math.max(0,cw-pitch);
 readingRows.forEach(row=>{
  // Compress neighboring columns in place, with only a small local horizontal slip.
  const from=pageMargin+row.column*pitch;
  const slip=(stainNoise(row.seed,31)*2-1)*Math.min(cw*.12,overlapDepth*.35)*mix;
  row.x=row.column===0?pageMargin:row.column===columnCount-1?w-pageMargin-cw:clamp(from+slip,pageMargin,w-pageMargin-cw);
  row.el.style.transform=`translate(${row.x.toFixed(2)}px,${row.y}px)`;
 });
 paintBlockDensity();paintOverlapColors(visitorView()||activePerson.id===13?0:p);paintSharpKeywords(visitorView()||p>0);keepSelectedNameVisible();
 lastLayoutKey=w+':'+innerHeight+':'+activePerson.id+':'+measuredWidth;
 sheet.dataset.geometryRevision=geometryRevision;sheet.dataset.layoutMs=(performance.now()-started).toFixed(2);
}
const navigation=document.querySelector('#people-nav');
participants.forEach(person=>{
 const button=node('button',person.nameEn,null,'en');button.type='button';button.dataset.person=String(person.id);
 button.setAttribute('aria-controls','sheet');
 button.addEventListener('click',()=>{location.hash='person-'+person.id});
 navigation.append(button);
});
navigation.addEventListener('keydown',event=>{
 const buttons=[...navigation.querySelectorAll('button')],index=buttons.indexOf(document.activeElement);
 if(index<0)return;
 const next=event.key==='ArrowRight'?(index+1)%buttons.length:event.key==='ArrowLeft'?(index-1+buttons.length)%buttons.length:event.key==='Home'?0:event.key==='End'?buttons.length-1:-1;
 if(next<0)return;event.preventDefault();buttons[next].focus();buttons[next].scrollIntoView({block:'nearest',inline:'nearest'});
});
const participantFromURL=()=>Number(location.hash.match(/^#person-(\d+)$/)?.[1]||13);
window.addEventListener('hashchange',()=>renderParticipant(participantFromURL()));
new ResizeObserver(scheduleLayout).observe(sheet);
window.addEventListener('resize',scheduleLayout);
window.addEventListener('scroll',scheduleBlockDensity,{passive:true});
document.fonts.ready.then(()=>{invalidateReadingGeometry();scheduleLayout()});
Promise.allSettled([document.fonts.load('500 10px "Noto Serif KR"'),document.fonts.load('10px "joly-text"'),document.fonts.load('italic 10px "joly-text"'),document.fonts.load('700 10px "Resist Sans Display"'),document.fonts.load('400 10px "Chosun Gulim"')]).then(results=>{
 sheet.dataset.fonts=results.map((result,i)=>['korean','english','italic','navigation','workshop'][i]+':'+(result.status==='fulfilled'&&result.value.length?'loaded':'unavailable')).join(' ');
 invalidateReadingGeometry();scheduleLayout();
});
document.fonts.addEventListener('loadingdone',()=>{invalidateReadingGeometry();scheduleLayout()});
document.querySelector('.close').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
window.addEventListener('visitorchange',()=>renderParticipant(activePerson.id,true));
renderParticipant(participantFromURL());
