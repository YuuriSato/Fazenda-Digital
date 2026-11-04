const test=require('node:test'),assert=require('node:assert/strict'),E=require('./engine');
test('produção gera colheita e moedas',()=>{const s=E.initial();E.advance(s,60);assert.equal(s.harvest,90);assert.equal(s.coins,420);});
test('pausa interrompe produção e passagem do tempo',()=>{const s=E.initial();s.paused=true;E.advance(s,60);assert.equal(s.harvest,0);assert.equal(s.elapsed,0);});
test('ausência tem limite de oito horas',()=>{const s=E.initial();E.advance(s,999999);assert.equal(s.harvest,1.5*8*3600);});
test('compra desconta saldo e respeita capacidade',()=>{const s=E.initial();assert.equal(E.purchase(s,'bot'),true);assert.equal(s.coins,120);assert.equal(s.bots,4);assert.equal(E.purchase(s,'plot'),false);s.bots=24;s.coins=99999;assert.equal(E.purchase(s,'bot'),false);});
test('produção é limitada aos lotes e multiplicada pela velocidade',()=>{const s=E.initial();s.bots=10;s.speed=5;E.advance(s,10);assert.equal(s.harvest,150);});
test('importação rejeita valores inválidos',()=>{assert.throws(()=>E.validate({...E.initial(),coins:-1}));assert.throws(()=>E.validate({...E.initial(),bots:999}));assert.throws(()=>E.validate({...E.initial(),paused:'false'}));assert.deepEqual(E.validate(E.initial(100)),E.initial(100));});
