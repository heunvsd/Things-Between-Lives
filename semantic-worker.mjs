import {pipeline,env} from './assets/semantic/transformers.min.js';
import {classify,segments} from './semantic-matcher.mjs';
// Reuse local weights when present; static deployments download the same public model.
// Only model files are fetched. Visitor text stays in this worker.
env.allowRemoteModels=true;
env.allowLocalModels=true;
env.localModelPath=new URL('./assets/semantic/models/',import.meta.url).href;
env.backends.onnx.wasm.wasmPaths=new URL('./assets/semantic/',import.meta.url).href;
env.backends.onnx.wasm.numThreads=1;
let resources;
function load(){
 if(!resources)resources=Promise.all([
  pipeline('feature-extraction','Xenova/paraphrase-multilingual-MiniLM-L12-v2',{
   dtype:'q8',device:'wasm',progress_callback:p=>{
    if(p.status==='progress')postMessage({type:'progress',progress:Math.round(p.progress||0)});
   }
  }),
  fetch(new URL('./semantic-themes.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Could not load records');return r.json()})
 ]).catch(e=>{resources=null;throw e;});
 return resources;
}
// Serialize inference to avoid concurrent WASM sessions. The UI ignores stale requests.
let queue=Promise.resolve();
self.onmessage=({data})=>{
 queue=queue.catch(()=>{}).then(async()=>{
  const {id,person,text}=data;
  try{
   const [embed,themes]=await load(),parts=segments(text),relevant=themes.filter(t=>t.person===person);
   const vectors=parts.length?(await embed(parts.map(p=>p.text),{pooling:'mean',normalize:true})).tolist():[];
   const found=parts.map((part,i)=>({...part,match:classify(vectors[i],relevant)})).filter(p=>p.match);
   const groups=relevant.filter(t=>found.some(p=>p.match.id===t.key)).map(t=>({
    id:t.key,label:t.label,color:t.color,ranges:t.ranges,
    queryRanges:found.filter(p=>p.match.id===t.key).map(p=>({start:p.start,end:p.end}))
   }));
   postMessage({type:'result',id,person,result:{text,groups}});
  }catch(error){postMessage({type:'error',id,person,message:String(error.message||error)})}
 });
};
