# Contexto para continuidade

## Objetivo

Digital Farm City (FarmGrid): simulador visual AFK com bots trabalhando numa cidade virtual e painel de monitoramento de farming.

## Origem desta versão

O usuário trouxe uma mensagem sobre um pacote de transferência, mas a pasta estava vazia e nenhum anexo estava acessível. Autorizou continuar. Esta implementação é uma nova base local, não uma recuperação do protótipo original.

## Arquitetura e decisões

Atualização de 15/10/2026: `index.html` é agora um dashboard de monitoramento real dos três jogos. `dashboard.css` e `dashboard.js` implementam cards, resumo do computador, filtro, detalhes e gráfico de 60 amostras. O simulador anterior foi preservado em `simulation.html`.

`server.js` expõe `GET /api/metrics` apenas no loopback. Consulta contadores com PowerShell, usa `os.cpus()` e memória do Node para o computador, e agrega processos em `monitor.js`. `farms.json` define nomes exatos de executáveis. A consulta a cada 3 segundos usa comandos PowerShell normais, sem modificar a política de execução do Windows. O servidor serve apenas os arquivos públicos explicitamente permitidos.

Os estados descrevem presença e resposta do processo, não farming. Ausência de telemetria é exibida como desconhecida. CPU é normalizada pela capacidade total da máquina; RAM soma working sets. Nomes genéricos podem causar falsos positivos e precisam ser ajustados ao cliente instalado. `monitor.test.js` cobre CPU, soma de RAM, ausência, primeira amostra, PID reutilizado e falta de acesso.

HTML/CSS/JavaScript sem dependências. `engine.js` concentra regras de produção, preços, validação e limite de ausência. `app.js` controla interação, persistência, diário e desenho Canvas responsivo. `server.js` serve localmente no loopback. `engine.test.js` verifica regras econômicas.

Interface em português, paleta verde natural, mapa de cidade com lotes, prédios e bots animados. Salvamento automático a cada cinco segundos e ao sair/alternar a visibilidade. Exportação/importação manual; sem backend, login ou integração externa. Limite de ausência: 8 horas reais, multiplicadas pela velocidade da simulação.

## Próximas melhorias propostas

1. Sincronização entre abas e versionamento de salvamentos.
2. Seleção de lotes, atribuição individual de bots, culturas e ciclos de produção.
3. Histórico agregado com gráficos de produtividade.
4. Separar sensores reais da simulação quando houver API e requisitos definidos.
5. Persistência em servidor e autenticação se o usuário solicitar uso entre dispositivos.

Não interpretar produção simulada como execução de bots reais. Validar integrações e ações antes de conectá-las a serviços externos.
