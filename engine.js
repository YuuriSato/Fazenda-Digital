(function(root){
 'use strict';
 const MAX_OFFLINE=8*3600;
 function initial(now=Date.now()){return {version:1,coins:240,harvest:0,bots:3,plots:3,elapsed:0,paused:false,speed:1,updatedAt:now,events:[{text:'Sua fazenda ganhou vida. Bem-vindo ao FarmGrid!',at:now}]};}
 function rate(s){return Math.min(s.bots,s.plots*2)*.5;}
 function advance(s,seconds){if(!Number.isFinite(seconds)||seconds<0)throw new Error('Intervalo inválido');if(s.paused)return 0;const duration=Math.min(seconds,MAX_OFFLINE)*s.speed;const amount=rate(s)*duration;s.harvest+=amount;s.coins+=amount*2;s.elapsed+=duration;return amount;}
 function cost(s,type){return type==='bot'?120+(s.bots-3)*60:300+(s.plots-3)*150;}
 function purchase(s,type){if(!['bot','plot'].includes(type))throw new Error('Compra inválida');if(s[type==='bot'?'bots':'plots']>=24)return false;const price=cost(s,type);if(s.coins<price)return false;s.coins-=price;s[type==='bot'?'bots':'plots']++;return true;}
 function validate(s){if(!s||s.version!==1)throw new Error('Arquivo incompatível');for(const k of ['coins','harvest','elapsed','updatedAt'])if(!Number.isFinite(s[k])||s[k]<0)throw new Error('Progresso inválido');for(const k of ['bots','plots'])if(!Number.isInteger(s[k])||s[k]<3||s[k]>24)throw new Error('Capacidade inválida');if(typeof s.paused!=='boolean'||![1,2,5].includes(s.speed))throw new Error('Configuração inválida');if(!Array.isArray(s.events)||s.events.length>30||s.events.some(e=>!e||typeof e.text!=='string'||e.text.length>250||!Number.isFinite(e.at)))throw new Error('Diário inválido');return s;}
 const api={initial,rate,advance,cost,purchase,validate,MAX_OFFLINE};if(typeof module!=='undefined')module.exports=api;else root.FarmEngine=api;
})(typeof window!=='undefined'?window:globalThis);
