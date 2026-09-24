# CHANGELOG — Escrituras Cartório Praia do Forte

Esquema de versão: `APP_VERSION` (const no `index.html`/`consulta.html`), também exibido no rodapé da sidebar.

## v2.2.0 — 2026-09-11 · Autenticação real server-side
Substitui o login client-side (senha embutida no fonte + usuários no localStorage por aparelho) por **autenticação real no servidor** (Apps Script). Objetivo: **uma senha** que vale em qualquer aparelho, guardada como **hash salgado** fora do código.
- **Backend novo `Code-AUTH.gs`** (`_auth-2026-09-11\`) estende o Code-NOVO deployado (preserva API_TOKEN/shape/histórico/lock): `action=login` (valida senha vs `ADMIN_HASH` → devolve token de **sessão assinado por HMAC**, exp ~12h); `action=save` (exige sessão quando `EXIGIR_SESSAO=true`); `action=changepw` (troca a senha no servidor, sincroniza entre aparelhos). `doGet` (leitura) mantém API_TOKEN, sem sessão — a `consulta.html` continua lendo.
- **Rollout seguro:** flag `EXIGIR_SESSAO` começa `false` (o save aceita o fluxo antigo só-token E o novo com sessão) → publica o front → valida → vira `true` (só sessão). Setup no editor: `setupAuth('<senha>')` / recuperação `resetAdminPassword('<nova>')`.
- **Front `index.html`:** login chama o backend e guarda o **token de sessão** no localStorage (`esc26_sessao`); `apiSave` envia a sessão e lê a resposta (401 de sessão → desloga e pede login); "Alterar senha" chama `action=changepw`. **Removidos** o array `_ap` (senha sai do fonte) e o store `esc26_usuarios`. Foto do perfil segue local (`esc26_foto`, conveniência). Sessão restaurada no reload (UX). Mantidos Aura 2, olho de senha, Versão C, movimento vivo.
- **`calcMes` e a `consulta.html` (leitura): inalterados.**
- Pendente do Isaac: aplicar o `Code-AUTH.gs` no editor + `setupAuth`, reimplantar na MESMA URL, e o push do front. Ver `_auth-2026-09-11\PASSO-A-PASSO-AUTH.md`.

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
