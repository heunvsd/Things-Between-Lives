/* This layer owns participation state; the original workshop data is never edited. */
(()=>{
 const form=document.querySelector('#expectation-form'),input=document.querySelector('#expectation');
 const status=document.querySelector('#visitor-status'),field=document.querySelector('.expectation-field');
 const preview=document.createElement('div'),previewCopy=document.createElement('div');
 preview.className='expectation-preview';preview.setAttribute('aria-hidden','true');preview.append(previewCopy);field.prepend(preview);
 input.addEventListener('scroll',()=>{previewCopy.style.transform=`translateY(${-input.scrollTop}px)`});
 const measure=document.createElement('div');measure.className='expectation-measure';measure.setAttribute('aria-hidden','true');field.append(measure);
 let alignmentQueued=false;
 function alignInput(){
  if(alignmentQueued)return;alignmentQueued=true;
  requestAnimationFrame(()=>{
   alignmentQueued=false;if(!field.clientHeight)return;
   measure.style.width=Math.max(0,field.clientWidth-2)+'px';measure.textContent=(input.value||input.placeholder)+'\u200b';
   // Read the containing field, not the textarea whose padding we are changing.
   const inset=Math.max(3,(field.clientHeight-2-measure.getBoundingClientRect().height)/2);
   field.style.setProperty('--input-inset',inset.toFixed(2)+'px');
  });
 }
 new ResizeObserver(alignInput).observe(field);
 document.fonts.addEventListener('loadingdone',alignInput);
 const states=new Map(),products={
  13:{name:'Louis Vuitton Imagination',href:'https://kr.louisvuitton.com/kor-kr/products/imagination-nvprod2970067v/LP0219'},
  14:{name:'Laneige Lip Glowy Balm, Gummy Bear',href:'https://www.laneige.com/product/detail.html?item_code=P00000DE000C&product_no=82'}
 };
 let person=13,view=1,worker=null,request=0,busy=false,timeout,composing=false;
 const state=()=>{if(!states.has(person))states.set(person,{draft:'',result:null,message:''});return states.get(person)};
 const changed=()=>window.dispatchEvent(new Event('visitorchange'));
 function update(){
  const current=state();
  document.querySelector('#sheet').dataset.view=String(view);
  document.querySelector('#sheet').dataset.basis=view===2?'visitor':'workshop';
  document.querySelector('#sheet').dataset.compared=String(Boolean(current.result));
  document.querySelectorAll('[data-view-button]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.viewButton)===view)));
  document.querySelector('#participation').hidden=view!==2||!products[person];
  document.querySelector('#workshop').inert=view===2;
  document.querySelector('#workshop').setAttribute('aria-hidden',String(view===2));
  form.setAttribute('aria-busy',String(busy));
  status.textContent=current.message;alignInput();
  previewCopy.replaceChildren();const result=current.result;
  preview.hidden=!result;form.dataset.preview=String(Boolean(result));
  if(result){
   const text=current.draft,leading=text.length-text.trimStart().length;let cursor=0;
   result.groups.flatMap(g=>g.queryRanges.map(r=>({...r,start:r.start+leading,end:r.end+leading,color:g.color}))).sort((a,b)=>a.start-b.start).forEach(r=>{
    if(r.start<cursor)return;previewCopy.append(document.createTextNode(text.slice(cursor,r.start)));
    const mark=document.createElement('mark');mark.textContent=text.slice(r.start,r.end);mark.style.setProperty('--connection',r.color);previewCopy.append(mark);cursor=r.end;
   });previewCopy.append(document.createTextNode(text.slice(cursor)));
   previewCopy.style.transform=`translateY(${-input.scrollTop}px)`;
  }
 }
 function cancel(){
  request++;clearTimeout(timeout);
  if(worker&&busy){worker.terminate();worker=null}
  busy=false;
 }
 function switchView(next){if(next===view)return;view=next;if(view===1)cancel();update();changed()}
 document.querySelectorAll('[data-view-button]').forEach(b=>b.addEventListener('click',()=>switchView(Number(b.dataset.viewButton))));
 input.addEventListener('compositionstart',()=>{composing=true;cancel()});
 input.addEventListener('compositionend',()=>{composing=false});
 input.addEventListener('input',()=>{
  const current=state(),hadResult=Boolean(current.result);cancel();current.draft=input.value;
  current.result=null;current.message='';update();if(hadResult)changed();
 });
 input.addEventListener('keydown',event=>{
  if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing&&!composing){event.preventDefault();compare()}
 });
 form.addEventListener('submit',event=>{event.preventDefault();compare()});
 function compare(){
  const text=input.value.trim();
  if(view!==2||busy||composing||state().result?.text===text)return;
  if(text.length<4){state().message='상상한 일상이나 기대를 조금 더 적어 주세요.';update();input.focus();return}
  cancel();view=2;busy=true;const id=++request,current=state();current.draft=input.value;current.result=null;
  current.message='문장의 의미를 읽고 있어요.';update();changed();
  try{
   if(!worker)worker=new Worker(new URL('semantic-worker.mjs',document.baseURI),{type:'module'});
   worker.onmessage=({data})=>{
    if(id!==request)return;
    if(data.type==='progress')return;
    if(data.id!==id||data.person!==person)return;
    clearTimeout(timeout);busy=false;
    if(data.type==='result'){
     current.result=data.result;
     current.message='';
    }else {console.error('Semantic model:',data.message);current.message='의미 비교를 준비하지 못했습니다. 입력은 남아 있으니 잠시 후 다시 시도해 주세요.';}
    update();changed();
   };
   worker.onerror=event=>{console.error('Semantic worker:',event.message);if(id!==request)return;cancel();current.message='의미 비교를 불러오지 못했습니다. 입력을 유지했습니다. 다시 시도해 주세요.';update()};
   worker.postMessage({id,person,text});
   timeout=setTimeout(()=>{if(id!==request)return;cancel();current.message='준비가 오래 걸려 비교를 멈췄습니다. 입력을 유지했습니다. 다시 시도해 주세요.';update()},120000);
  }catch{cancel();current.message='이 화면은 웹 주소에서 열어 주세요. 로컬 파일에서는 의미 비교를 시작할 수 없습니다.';update()}
 }
 const help=document.querySelector('#visitor-help');
 const panels={
  how:{title:'How to',paragraphs:['2번에서 물건 이름을 누르면 상품 정보를 볼 수 있습니다. 네모 칸에 기대하는 생활을 적고 Enter를 눌러 주세요. Shift+Enter로 줄을 바꿀 수 있습니다.','1에서는 워크숍 참여자의 글과 기존 기록을, 2에서는 나의 기대와 닮은 기록을 읽습니다. 같은 색은 비슷한 지향을 뜻하며, 공통점이 약하면 연결하지 않습니다.','2에서는 제출한 내용의 비교가 끝나면 관련 없는 부분에 검정 취소선이 나타납니다. 닮은 구절은 취소선 없이 남으며, 밑줄을 누르면 원문이 새 탭으로 열립니다. 창을 좁히면 같은 글들이 겹치고, 1로 돌아가면 기존 블록 방식으로 읽습니다.']},
  info:{title:'Info',paragraphs:['물건을 통해 어떤 생활과 자신을 상상하는지, 타인의 소비 경험과 함께 읽는 공간입니다. 구매를 권하기보다 나의 기대를 탐색하고 바꿔보는 과정을 보여줍니다.','아래 글은 수집한 기록의 요약이며, 외국어 기록은 영어 번역으로 표시합니다. 해석의 맥락은 각 기록의 원문에서 확인할 수 있습니다.','입력은 이 브라우저 안에서만 의미를 비교하며, 외부로 전송하거나 저장하지 않습니다. 새로고침하면 입력과 결과가 사라집니다.','의미 비교는 다국어 문장 모델과 기록에서 검토한 기대·경험을 사용합니다. 모든 뉘앙스를 판단할 수는 없어, 반대 의미이거나 연결이 불확실한 문장은 남겨 둡니다. 결과는 정답이나 상품 추천이 아닙니다.']}
 };
 for(const key of ['how','info'])document.querySelector('#'+key+'-button').addEventListener('click',()=>{
  const panel=panels[key];help.querySelector('h2').textContent=panel.title;
  const body=help.querySelector('.help-copy');body.replaceChildren(...panel.paragraphs.map(text=>{const p=document.createElement('p');p.textContent=text;return p}));help.showModal();
 });
 help.querySelector('button').addEventListener('click',()=>help.close());
 window.Visitor={
  get view(){return view},get result(){return state().result},
  setPerson(next){
   if(person!==next.id){if(busy)state().message='비교를 멈췄습니다. 작성한 문장은 남아 있습니다.';cancel();person=next.id;input.value=state().draft}
   const product=products[person],section=document.querySelector('#participation'),bar=document.querySelector('#view-nav');
   section.hidden=!product;bar.hidden=!product;
   if(product){const link=section.querySelector('#product-link');link.href=product.href;link.textContent=product.name}
   update();
  }
 };
})();
