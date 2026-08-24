# DevPR Conf 26

Site de divulgação da 11ª edição da DevPR Conf, evento da comunidade DevParaná. Sábado, 7 de novembro de 2026, no Bondam Restaurante (Parque do Japão, Maringá — PR).

HTML, CSS e JS puros — sem build, sem framework, sem dependências pra instalar. A ideia é manter fácil de editar por qualquer pessoa da organização, não só quem programa.

## Rodando localmente

O site usa `fetch()` pra carregar os dados de `data/*.json`, então **não funciona abrindo o `index.html` direto no navegador** (bloqueio de CORS em `file://`). É preciso servir por HTTP:

```bash
python3 -m http.server 8888
```

E acessar `http://localhost:8888`.

### Modo preview

Acessando com `?preview=1` na URL (ex.: `http://localhost:8888/?preview=1`), as seções Palestrantes e Patrocínio usam dados fictícios (`data/speakers.mock.json` e `data/sponsors.mock.json`) em vez dos reais — útil pra mostrar o site "cheio" pra validação interna sem mexer nos dados de verdade.

## Estrutura

```
index.html          Página única, todas as seções em ordem
css/
  tokens.css         Design tokens: cores, tipografia, espaçamento, raio
  base.css           Reset e estilos globais
  section.css        Estilos compartilhados entre seções (heading, lead, eyebrow)
  buttons.css         Componentes de botão (.btn, .btn--primary, .btn--outline)
  header.css, hero.css, stats.css, sobre.css, cfp.css,
  programacao.css, palestrantes.css, ingressos.css,
  patrocinio.css, local.css, faq.css, footer.css
                       Um arquivo por seção, na mesma ordem em que aparecem no HTML
js/
  main.js             Toda a lógica do site: menu mobile, link de config,
                       e o fetch()/render de cada seção data-driven
data/
  config.js            Links externos (ingressos, CFP, e-mail) — const CONFIG, carregado como script comum (não é JSON)
  schedule.json         Linhas da seção Programação
  speakers.json          Palestrantes confirmados (real — hoje vazio)
  speakers.mock.json      Palestrantes fictícios, só pro modo preview
  sponsors.json           Patrocinadores confirmados (real — hoje vazio)
  sponsors.mock.json      Patrocinadores fictícios, só pro modo preview
  faq.json               Perguntas da seção FAQ
assets/
  devpr-logo.svg, favicon.svg, apple-touch-icon.svg/png,
  og-image.svg/png, logo_codaqui.svg
                       Logos, ícones e a imagem de compartilhamento (OG/Twitter)
```

## Design tokens

Todas as cores em `css/tokens.css` seguem uma escala de opacidade exata (ex.: `--on-dark-60`, `--on-light-24`, `--tint-green-12`) em vez de nomes semânticos aproximados — o valor de opacidade é o que importa pra bater com o design original, então o nome da variável reflete isso diretamente.

## Conteúdo data-driven

Quatro seções carregam conteúdo de JSON via `fetch()` em vez de terem o HTML escrito à mão:

- **Programação** (`data/schedule.json`) — sempre renderizada a partir do arquivo.
- **Palestrantes** (`data/speakers.json`) e **Patrocínio** (`data/sponsors.json`) — têm dois estados: "em breve" (arquivo vazio, `[]`) e "populado" (lista preenchida). O site alterna automaticamente conforme o conteúdo do arquivo, sem precisar mexer no HTML.
- **FAQ** (`data/faq.json`) — sempre renderizada a partir do arquivo.

Pra atualizar qualquer uma dessas seções, basta editar o `.json` correspondente — não precisa tocar em `index.html` nem em `main.js`.

## Configuração

`data/config.js` centraliza os três links externos do site (ingressos, formulário do CFP, e-mail de contato). Qualquer elemento com `data-link="tickets"`, `data-link="cfp"` ou `data-link="contact-email"` é atualizado automaticamente por `main.js` — pra trocar um link em todo o site, edita esse arquivo uma vez só. Botões de ingresso abrem em nova aba.

## Breakpoints

O header troca entre menu desktop e mobile em `900px` — esse valor foi medido empiricamente (não é um breakpoint "redondo") pra evitar que os itens do menu comecem a ser cortados antes da troca. A seção Palestrantes troca entre grid de cards e lista compacta em `759px`, só no celular.

## Pendências

Ver [TODO.md](TODO.md) pra checklist de lançamento e conteúdo ainda em aberto (dados reais de palestrantes/patrocinadores, horários "a definir", hospedagem).
