'use strict';
const clamp=n=>Math.max(0,Math.min(100,n));
function summarize(farms,processes,previous,seconds,cores){return farms.map(farm=>{
 const names=new Set(farm.processNames.map(n=>n.toLowerCase())),found=processes.filter(p=>names.has(p.name.toLowerCase()));
 const measured=found.every(p=>Number.isFinite(p.memoryBytes)&&typeof p.responding==='boolean');let cpu=0,hasCpu=true;
 for(const p of found){const old=previous.get(p.pid);if(!old||old.startedAt!==p.startedAt||!Number.isFinite(p.cpuSeconds)||!Number.isFinite(old.cpuSeconds)||seconds<=0){hasCpu=false;continue;}cpu+=Math.max(0,p.cpuSeconds-old.cpuSeconds)/seconds/cores*100;}
 const status=!found.length?'inoperante':!measured?'desconhecido':found.some(p=>!p.responding)?'inoperante':'operando';
 return {...farm,status,reason:!found.length?'Processo não encontrado':!measured?'Sem acesso aos contadores':status==='inoperante'?'Processo sem resposta':'Processo aberto e respondendo',cpuPercent:hasCpu?clamp(cpu):null,memoryBytes:measured?found.reduce((n,p)=>n+p.memoryBytes,0):null,processes:found.map(p=>({pid:p.pid,name:p.name,responding:p.responding,startedAt:p.startedAt}))};
});}
module.exports={summarize};
