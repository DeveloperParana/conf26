# Pendências antes de publicar

## Bloqueia o lançamento

- [x] ~~Links de ingresso e CFP~~ — `data/config.js`: `ticketsUrl` (Doity) e `cfpUrl` (Google Forms) preenchidos. Botões de ingresso já abrem em nova aba.
- [x] ~~Endereço completo do Bondam Restaurante~~ — atualizado (Av. Arquiteto Nildo Ribeiro da Rocha, 7070, Jardim Ipanema, Maringá — PR, 87053-330).
- [x] ~~Domínio final~~ — confirmado `devpr.org`, já configurado em `og:url`/`og:image`.
- [ ] **Hospedagem** — repositório `DeveloperParana/conf26` já criado no GitHub, mas ainda sem deploy publicado (GitHub Pages, Netlify, Vercel etc.). Arquivos locais (`assets/`, `css/`, `data/`, `js/`, `index.html`) ainda não commitados no git.
- [x] ~~Testar em celular real~~ — confirmado ok (programação, ingressos, menu mobile).

## Preencher conforme o evento avança (o site já lida bem com "vazio")

- [ ] `data/speakers.json` — hoje vazio (`[]`), site mostra o estado "em breve". Trocar pelos palestrantes confirmados conforme a curadoria fechar. Dados fictícios pra teste/preview ficam em `data/speakers.mock.json`, acessível via `?preview=1`.
- [ ] `data/sponsors.json` — mesma coisa: hoje vazio (`[]`). Mock em `data/sponsors.mock.json`.
- [ ] `data/schedule.json` — 6 horários ainda como "A definir" (09:30, 10:30, 11:15, 13:30, 14:15, 16:30), trocar pelos títulos/nomes reais conforme fecha a curadoria.
- [ ] Kit de patrocínio em PDF — nota escondida (`hidden`) na seção Patrocínio até existir um link real.

## Opcional / qualidade

- [x] ~~`apple-touch-icon.png`~~ — feito (180×180, logo sobre fundo preto).
- [x] ~~Testar em outros navegadores além de Safari~~ — confirmado ok no Chrome.
