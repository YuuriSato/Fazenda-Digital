# FarmGrid · Central de farms

Dashboard local de monitoramento de Tibia, Ragnarok e MU Online. A página inicial mostra CPU e RAM do computador, consumo por jogo, estados, processos detectados e gráfico com as últimas 60 leituras da sessão.

Execute `node server.js` e abra http://127.0.0.1:4173. Mantenha o terminal aberto para a coleta funcionar. Não precisa instalar pacotes ou executar como administrador. O servidor atende apenas no próprio computador.

## Baixar e iniciar

Requisitos: Windows com PowerShell e Node.js 18 ou superior. A coleta dos jogos depende do Windows; o simulador funciona no navegador.

```powershell
git clone https://github.com/YuuriSato/Fazenda-Digital.git
cd Fazenda-Digital
npm start
```

Abra http://127.0.0.1:4173. Para os testes, use `npm test`. Não é necessário executar `npm install`, pois não há dependências externas.

O GitHub armazena o código. As métricas são coletadas no computador em que o servidor está rodando; o painel não recebe métricas locais pelo GitHub Pages.

## Monitoramento real

- Coleta do Windows a cada 3 segundos; falhas e dados antigos aparecem como indisponíveis, sem inventar valores.
- RAM por jogo: soma do conjunto de trabalho dos processos correspondentes; não representa memória exclusiva.
- CPU por jogo: diferença de tempo de processador entre amostras, dividida pelo intervalo e pelo número de processadores lógicos. A primeira leitura de um novo processo aparece como `—` até a próxima amostra.
- Operando: processo aberto e respondendo. Inoperante: processo ausente ou sem resposta. Sem leitura: monitor desconectado, amostra antiga ou contadores sem acesso.
- Esses estados não confirmam login, conexão ao servidor, personagem ativo ou farming.
- Nomes dos executáveis ficam em `farms.json`. Ajuste-os ao cliente instalado e reinicie o servidor. `client.exe` e `main.exe` são nomes genéricos e podem identificar outro aplicativo. Os detalhes de cada card mostram os PIDs detectados.
- Todas as instâncias de um jogo são agrupadas em seu card. Launchers com nomes diferentes não entram na contagem; clientes que reutilizam o mesmo nome de um launcher exigem ajuste na identificação.
- A coleta consulta apenas nomes, PIDs, memória, tempo de CPU, início do processo e estado de resposta. Não consulta credenciais ou memória interna do jogo.

Testes: `node --test engine.test.js monitor.test.js`.

## Simulador preservado

O protótipo anterior está em http://127.0.0.1:4173/simulation.html, com seu progresso no mesmo armazenamento do navegador.

Simulador local de fazenda AFK com cidade animada, bots, colheita e expansão. Esta versão foi criada a partir da descrição da conversa; o ZIP e o protótipo original não estavam disponíveis.

## Executar

Na pasta do projeto, execute `node server.js` e abra http://127.0.0.1:4173. Para verificar a lógica: `node --test engine.test.js`.

Sem instalação de pacotes. Fontes do Google são opcionais; o painel usa fontes locais se não houver conexão.

## Funcionamento

- Cada bot produz 0,5 unidade por segundo; cada unidade rende 2 moedas. Cada lote suporta 2 bots.
- Velocidades de 1×, 2× e 5×. Pausar também interrompe a produção durante ausências.
- Ao retornar, calcula até 8 horas reais de produção na velocidade escolhida. O navegador não precisa permanecer executando.
- Até 24 bots e 24 lotes. Preços aumentam a cada compra.
- Progresso salvo em localStorage, com exportação e importação JSON validada. Importar e reiniciar pedem confirmação.
- Use uma única aba da fazenda: múltiplas abas ainda não sincronizam suas alterações.

Os números representam uma simulação, sem integração com bots externos, dinheiro real ou plataformas de farming.
