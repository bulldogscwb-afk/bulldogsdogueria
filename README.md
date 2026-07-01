# Central de gestão — como colocar no ar

Este pacote tem estes arquivos:
- `index.html` — o painel inteiro (telas, regras, cálculos)
- `schema.sql` — cria a "tabela" do banco de dados
- `manifest.json` — permite instalar o painel como app no celular
- `sw.js` — arquivo técnico que possibilita a instalação (não precisa mexer)
- `icon-192.png` e `icon-512.png` — ícone do app
- `README.md` — este guia

Siga a ordem abaixo. Nenhum passo exige saber programar.

---

## 1. Criar o banco de dados (Supabase)

1. Entre em **supabase.com** e crie uma conta (pode usar o login do Google).
2. Clique em **New project**.
3. Dê um nome (ex: `central-gestao`), crie uma senha forte para o banco (guarde
   essa senha em local seguro — não é a mesma coisa que a senha da sua conta)
   e escolha a região mais perto do Brasil (`South America (São Paulo)`, se
   disponível).
4. Espere o projeto terminar de ser criado (leva 1-2 minutos).
5. No menu lateral, clique em **SQL Editor** → **New query**.
6. Abra o arquivo `schema.sql` (que está aqui nesta pasta), copie todo o
   conteúdo, cole no editor do Supabase e clique em **Run**.
   Deve aparecer "Success. No rows returned" — isso é o esperado.
7. No menu lateral, vá em **Project Settings** (ícone de engrenagem) → **API**.
8. Você vai ver dois campos que precisa copiar:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public** (uma chave longa de letras e números)

> **Sobre o plano pago:** o plano gratuito do Supabase não faz backup
> automático e pausa o projeto depois de uma semana sem uso — arriscado
> para um sistema usado todo dia. Recomendo ativar o plano **Pro (~US$25/mês)**
> antes de colocar a equipe pra usar de verdade. Dá pra testar tudo no
> gratuito primeiro, sem problema.

---

## 2. Conectar o painel ao banco de dados

1. Abra o arquivo `index.html` num editor de texto simples (o Bloco de
   Notas do Windows serve, ou o TextEdit do Mac).
2. Procure por estas duas linhas, perto do topo do arquivo (use Ctrl+F ou
   Cmd+F para achar rápido, buscando por `COLE_AQUI`):

   ```js
   var SUPABASE_URL = 'COLE_AQUI_A_URL_DO_SEU_PROJETO_SUPABASE';
   var SUPABASE_ANON_KEY = 'COLE_AQUI_A_CHAVE_ANON_PUBLIC';
   ```

3. Substitua os textos `COLE_AQUI_...` pelos valores que você copiou no
   passo 1.8 (mantendo as aspas). Deve ficar parecido com:

   ```js
   var SUPABASE_URL = 'https://xxxxx.supabase.co';
   var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

4. Salve o arquivo.

---

## 3. Subir o código pro GitHub

1. Entre no repositório que você já criou no GitHub.
2. Clique em **Add file** → **Upload files**.
3. Arraste **todos os arquivos** desta pasta (`index.html`, `schema.sql`,
   `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `README.md`)
   para a janela do navegador — todos precisam estar na mesma pasta do
   repositório para o app funcionar e ser instalável.
4. Role para baixo e clique em **Commit changes**.

Não precisa instalar nada nem usar linha de comando — o site do GitHub
aceita arrastar e soltar.

---

## 4. Publicar o site (Netlify)

1. Entre em **netlify.com** e crie uma conta (dá pra usar login do GitHub,
   facilita).
2. Clique em **Add new site** → **Import an existing project**.
3. Escolha **GitHub** e autorize o acesso.
4. Selecione o repositório que você acabou de subir.
5. Não precisa mexer em nenhuma configuração de build — clique direto em
   **Deploy site**.
6. Em 1-2 minutos o Netlify te dá um endereço tipo
   `nome-aleatorio-123.netlify.app`. Esse já é o site funcionando de
   verdade, acessível de qualquer lugar.

---

## 5. (Opcional) Domínio próprio

Se quiser um endereço tipo `painel.seurestaurante.com.br`:

1. Registre o domínio em **registro.br**.
2. No Netlify, vá em **Site settings** → **Domain management** → **Add a
   domain**, digite seu domínio e siga as instruções (vai pedir pra você
   configurar alguns registros DNS no registro.br — o Netlify explica
   exatamente quais).

---

## 6. Primeiro acesso

Abra o endereço do site (o `.netlify.app` ou seu domínio próprio). Como
ainda não existe nenhum usuário, a tela vai pedir pra você **criar a conta
do Dono** — nome, usuário e senha. A partir daí, tudo funciona igual ao
que testamos juntos no protótipo, só que os dados agora ficam guardados
de verdade, permanentemente, no seu banco de dados.

---

## 7. Instalar como app no celular

- **Android (Chrome)**: abra o site, toque no menu (⋮) e escolha
  **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
- **iPhone (Safari)**: abra o site, toque no ícone de compartilhar
  (quadrado com seta) e escolha **"Adicionar à Tela de Início"**.

Depois disso, um ícone do painel aparece na tela inicial do celular,
abrindo em tela cheia, sem barra de navegador — como um app de verdade.

---

## Sobre "esqueci minha senha"

Não existe recuperação automática por e-mail (isso exigiria configurar um
serviço de envio de e-mails, que não está incluído). Na prática: qualquer
Dono ou Gerente consegue redefinir a senha de qualquer pessoa da sua
unidade, direto na tela **Usuários**, com o botão **"Redefinir senha"**.
Avise a pessoa a nova senha por WhatsApp ou pessoalmente.

---

## Se algo der errado

- **Tela em branco ou erro ao carregar dados**: confira se colou a URL e
  a chave certas no passo 2, sem espaços extras e mantendo as aspas.
- **"Não foi possível salvar"**: normalmente é a tabela `kv_store` que
  não foi criada — repita o passo 1.6.
- Qualquer dúvida, volte nesta conversa com o Claude e descreva o que
  está acontecendo (vale até print da tela) — sigo ajudando a partir
  daqui.
