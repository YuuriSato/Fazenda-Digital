'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFile}=require('node:child_process'),{summarize}=require('./monitor');
const farms=JSON.parse(fs.readFileSync(path.join(__dirname,'farms.json'),'utf8'));
const collectCommand=fs.readFileSync(path.join(__dirname,'collect-processes.ps1'),'utf8');
const allowed=new Set(['index.html','dashboard.css','dashboard.js','simulation.html','style.css','app.js','engine.js']);
let previous=new Map(),lastAt=0,previousCpu=os.cpus(),pending=false;
let snapshot={available:false,error:'Preparando a primeira leitura do Windows.',farms:farms.map(f=>({...f,status:'desconhecido',cpuPercent:null,memoryBytes:null,processes:[]}))};
function sample(){
 if(pending)return;pending=true;
 if(process.platform!=='win32'){snapshot={...snapshot,available:false,error:'O coletor de jogos requer Windows.'};pending=false;return;}
 execFile('powershell.exe',['-NoProfile','-NonInteractive','-Command',collectCommand],{windowsHide:true,timeout:12000,maxBuffer:4*1024*1024},(err,stdout)=>{
  pending=false;if(err){snapshot={...snapshot,available:false,error:'Não foi possível consultar os processos do Windows.'};return;}
  try{const processes=JSON.parse(stdout.replace(/^\uFEFF/,'')),now=Date.now(),cpus=os.cpus();let total=0,idle=0;
   cpus.forEach((cpu,i)=>{const old=previousCpu[i];if(!old)return;for(const k of Object.keys(cpu.times))total+=cpu.times[k]-old.times[k];idle+=cpu.times.idle-old.times.idle;});
   snapshot={available:true,sampledAt:now,cpuPercent:total>0?Math.max(0,Math.min(100,(1-idle/total)*100)):null,totalMemory:os.totalmem(),usedMemory:os.totalmem()-os.freemem(),cores:cpus.length,farms:summarize(farms,processes,previous,(now-lastAt)/1000,cpus.length)};
   previous=new Map(processes.map(p=>[p.pid,p]));lastAt=now;previousCpu=cpus;
  }catch{snapshot={...snapshot,available:false,error:'O Windows retornou uma leitura inválida.'};}
 });
}
sample();setInterval(sample,3000).unref();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
http.createServer((req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 if(req.method!=='GET'){res.writeHead(405);res.end();return;}
 if(pathname==='/api/metrics'){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(snapshot));return;}
 const file=pathname==='/'?'index.html':pathname.slice(1);if(!allowed.has(file)){res.writeHead(404);res.end('Não encontrado');return;}
 fs.readFile(path.join(__dirname,file),(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',types[path.extname(file)]);res.end(data);});
}).listen(4173,'127.0.0.1',()=>console.log('FarmGrid: http://127.0.0.1:4173'));
