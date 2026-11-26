// Conservative nearest-meaning classification against reviewed intentions.
// Threshold + opposing-intention margin: never select a group just to fill a quota.
export const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
export function classify(vector,themes){
 const scores=themes.map(t=>{
  const positive=Math.max(...t.positiveVectors.map(v=>dot(vector,v)));
  const negative=Math.max(...t.negativeVectors.map(v=>dot(vector,v)));
  return {theme:t,score:positive,margin:positive-negative};
 }).sort((a,b)=>b.score-a.score);
 const best=scores[0];
 if(!best||best.score<.56||best.margin<.045)return null;
 // Closely competing meanings are left open rather than over-interpreted.
 if(scores[1]&&best.score-scores[1].score<.035)return null;
 return {id:best.theme.key,score:best.score};
}
export function segments(text){
 const result=[];const re=/[^.!?。！？;；,，\n]+(?:[.!?。！？;；,，]+|$)/g;
 for(const match of text.matchAll(re)){
  const value=match[0].trim(),start=match.index+match[0].indexOf(value);
  if(value.length>=4)result.push({text:value,start,end:start+value.length});
 }
 return result;
}
