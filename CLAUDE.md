# DevPR Conf 26: instruções pro Claude

Site estático (HTML/CSS/JS puro, sem build). Contexto de projeto, como rodar
localmente e estrutura de pastas: ver [README.md](README.md).

## Git: commit e push só com autorização explícita

**Nunca fazer `git commit` nem `git push` por conta própria.** Só quando a pessoa
pedir de forma clara ("commita", "sobe isso", "pode commitar e dar push", etc.).

- Terminar e verificar uma mudança **não** é sinal pra commitar. Deixar no
  working tree e avisar que está pronto.
- Sem pedido explícito: no máximo deixar os arquivos como estão (nada de
  `git add` / `commit` / `push`).
- Fazer edições, subir o servidor local, tirar screenshots, rodar checagens:
  tudo isso pode, sem precisar perguntar.
- `git push --force` / reescrever histórico de branch compartilhado: só com
  autorização explícita e específica pra isso.

## Escrita: sem travessão

Não usar `—` (travessão / em dash), nem `–` (en dash), em lugar nenhum: texto do
site, comentários de código, mensagens de commit, docs. Priorizar vírgula. Quando
vírgula não encaixar, reescrever a frase (ponto final, dois pontos, parênteses).
Hífen de palavra composta ("line-up", "meia-entrada") segue normal.
