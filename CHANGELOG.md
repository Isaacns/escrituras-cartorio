# CHANGELOG — Escrituras Cartório Praia do Forte

Esquema de versão: `APP_VERSION` (const no `index.html`/`consulta.html`), também exibido no rodapé da sidebar.

## v2.1.0 — 2026-08-19 · Movimento vivo (§20)
Aplicação do padrão de ecossistema "sistemas vivos" (§20), na versão **sutil**, com a identidade do cartório (verde), nos dois arquivos de produção (`index.html` admin e `consulta.html` leitura).
- **Gráfico "Movimento por mês"** (Visão Geral): as barras preenchem de baixo para cima (`fillUp`, `transform:scaleY`) com stagger por coluna; reanima ao trocar de mês.
- **Anel de Idas à PF**: preenche de 0 até o valor (`ringFill` via `@property --p`); reanima ao trocar de mês.
- **Count-up** nos KPIs da Visão Geral (Entregas, Retiradas, Idas à PF, Diligências, A receber — este formatado em R$).
- **Entrada fade + subida (~8px) com stagger** em KPIs, cards e itens de lista; **hover leve** (`scale 1.01`) nas barras do gráfico.
- `@media (prefers-reduced-motion: reduce)` desliga ondas/count-up e mostra os valores finais estáticos.
- Só `transform`/`opacity`/`--p`; sem `will-change` permanente; a marca do login continua **respirando** (não pisca).
- **`calcMes` e regras financeiras: inalterados.**
- Versão visível no rodapé da sidebar.

_Pendência:_ Tela de **Novidades (§19)** — o Escrituras não tem hoje e não há backend de versões; criar do zero é um item à parte, a decidir com o Isaac (ver relatório).

## v2.0.0 — base (Versão C publicada)
Command center: login exclusivo do admin + página de consulta somente-leitura; edição in-place de registros/idas/diligências; fechar/reabrir mês com trava; relatórios por período (mensal/trimestral/semestral/anual) imprimíveis; perfil de usuário (foto + trocar senha); responsivo mobile (tabelas viram cards); olho de mostrar/ocultar senha.
