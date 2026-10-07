# Zé Express — Guia de Deploy na GoDaddy (Node.js)

Este projeto é um e-commerce **Next.js 14 + PostgreSQL (Prisma)**. Este guia mostra
como publicá-lo na hospedagem da GoDaddy passo a passo.

---

## ✅ O que já foi ajustado neste pacote

| Ajuste | Motivo |
|---|---|
| `prisma/schema.prisma` | Removido caminho fixo que só existia na máquina de origem (`/home/ubuntu/zeeexpress_deploy/...`) — o cliente agora é gerado em `node_modules/.prisma/client` |
| `prisma/schema.prisma` | `binaryTargets` portáteis (`native` + `debian-openssl-3.0.x`) para funcionar em servidores Linux |
| `package.json` | Versões de ESLint/@typescript-eslint alinhadas (`npm install` funciona sem conflitos), Node `>=18.17`, scripts `db:generate`, `db:push` e `seed` |
| `next.config.js` | Removido caminho externo ao projeto que quebrava o build em outros servidores |
| Next.js 14.2.28 → **14.2.35** | Atualização de segurança dentro da mesma série (sem breaking changes) |
| `yarn.lock`/`.yarnrc.yml` | Removidos — o projeto agora usa **npm** (padrão da GoDaddy) com `package-lock.json` |
| `.env.example` | Modelo de configuração com placeholders — **nunca suba o `.env` real** |
| `.gitignore`, `.nvmrc`, `package-lock.json` | Adicionados |

O build de produção foi **testado e validado** (homepage e login respondem HTTP 200).

---

## 📋 Requisitos

- **Node.js 18.17+** (recomendado: 20.x LTS)
- **PostgreSQL** — ⚠️ a hospedagem compartilhada da GoDaddy **não oferece PostgreSQL**.
  Crie um banco gratuito em uma dessas opções (2 minutos):
  - [neon.tech](https://neon.tech) (recomendado, grátis)
  - [supabase.com](https://supabase.com) (grátis)
  - [railway.app](https://railway.app) (grátis)
  - Ou instale PostgreSQL no seu próprio VPS

---

## 📤 Upload direto (sem o Setup Node.js App — hospedagem Node da GoDaddy)

Se você cria o app **direto no painel Node.js** da GoDaddy e sobe a pasta por FTP /
Gerenciador de Arquivos, siga estas regras — elas evitam exatamente o erro de
`next/document` que você viu:

1. **Suba apenas os arquivos do ZIP** (descompactado). **NÃO** suba as pastas
   `node_modules/`, `.next/` ou `.build/` — se você rodou `npm install` ou
   `npm run build` no seu computador, **apague essas pastas antes de subir**:
   ```bash
   # no seu computador, dentro da pasta do projeto:
   rm -rf node_modules .next .build
   ```
   Elas são recriadas na GoDaddy e só atrapalham (binários do seu sistema, build antigo).

2. **Apague os arquivos antigos que já existem na pasta da GoDaddy.** O painel Node
   da GoDaddy costuma deixar um **app de exemplo** na pasta — é ele que tem
   `pages/_error.tsx`, `pages/404.tsx`, `pages/500.tsx` e o erro de `next/document`.
   Na pasta do app na GoDaddy, remova tudo e então suba os arquivos novos:
   ```bash
   # no Terminal/SSH da GoDaddy, dentro da pasta do app:
   find . -name "_document*" -not -path "*/node_modules/*" -delete
   find . -name "_error*"    -not -path "*/node_modules/*" -delete
   find . -name "404.tsx"    -not -path "*/node_modules/*" -delete
   find . -name "500.tsx"    -not -path "*/node_modules/*" -delete
   find . -type d -name pages -not -path "*/node_modules/*" -delete
   # (ou simplesmente: delete tudo e suba o ZIP novo do zero)
   ```

3. **No painel Node.js da GoDaddy**, depois de subir os arquivos:
   - **Node version**: 20.x (o `.nvmrc` já indica 20)
   - **Startup command**: `npm start` (roda o `server.js` que escuta a porta da GoDaddy)
   - Clique em **instalar dependências / run build** no botão do painel, **ou** rode
     pelo Terminal/SSH:
     ```bash
     cd ~/nodejs/ze-express   # ou o caminho do seu app
     npm install
     npx prisma generate
     npm run build
     ```
   > Se o painel só oferecer **install**, rode o `npm run build` pelo Terminal/SSH
   > depois — o build **precisa** rodar para criar a pasta de produção.

4. Se o painel mostrar o erro de `next/document` **mesmo depois** disso, é porque o
   build está lendo arquivos de outro lugar: confirme com `npm ls next` que está
   `next@14.2.35` e que a pasta do app tem `app/` (e não `pages/`).

---

## 🚀 Passo a passo — Hospedagem compartilhada (cPanel)

### 1. Criar o arquivo `.env`
Na pasta do projeto (no seu computador), copie o modelo e preencha:

```bash
cp .env.example .env
```

Edite o `.env`:
- `DATABASE_URL` → URL do seu banco PostgreSQL (ex.: `postgresql://usuario:senha@host:5432/banco`)
- `NEXTAUTH_SECRET` → gere com `openssl rand -base64 32` (ou use [randomkeygen.com](https://randomkeygen.com))
- `NEXTAUTH_URL` → a URL final do site (ex.: `https://www.seusite.com.br`)

### 2. Subir os arquivos
No cPanel da GoDaddy, use **Gerenciador de Arquivos → Enviar** (ou FTP) e envie o
conteúdo da pasta do projeto para o diretório da sua aplicação (ex.: `~/nodejs/ze-express/`).
Quando fizer upload, **não envie** as pastas `node_modules/` e `.next/` (elas são
geradas no servidor).

### 3. Criar o app Node.js no cPanel
No cPanel, abra **Setup Node.js App** (ou **App Manager**):

1. **Node.js version**: selecione **20.x**
2. **Application root**: `nodejs/ze-express` (ou o caminho onde você subiu os arquivos)
3. **Application URL**: `www.seusite.com.br`
4. **Application startup file**: `server.js`

Isso equivale a rodar `npm start`, que executa o `server.js` incluído no pacote
(um servidor customizado que escuta na variável `PORT` que a GoDaddy injeta automaticamente).
5. Clique em **Create**

### 4. Instalar e configurar (usando o Terminal do cPanel ou SSH)
> ⚠️ **Importante:** use **sempre o Terminal** com `npm install` (ele instala TODAS
> as dependências, incluindo TypeScript e Prisma). O botão **“Ensure Dependencies”**
> do cPanel instala **apenas** as `dependencies` do package.json — com ele, o build
> vai falhar.

```bash
cd ~/nodejs/ze-express

# 1) Instalar dependências (TODAS — use o Terminal, não o botão do cPanel)
npm install

# 2) Gerar o cliente Prisma
npx prisma generate

# 3) Criar as tabelas no banco (rodar apenas na primeira vez)
npx prisma db push

# 4) Popular o banco com os produtos iniciais (apenas na primeira vez)
npm run seed

# 5) Gerar o build de produção
npm run build
```

### 5. Reiniciar o app
Volte ao **Setup Node.js App**, clique em **Restart** (ou o cPanel reinicia sozinho
quando o startup file muda). Pronto — o site já deve responder no seu domínio.

---

## 🚀 Alternativa — VPS (Ubuntu, recomendado para produção)

```bash
# 1) Instalar Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql

# 2) Subir o projeto e configurar
cd /var/www/ze-express
cp .env.example .env
# ... edite o .env com DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL ...

# 3) Instalar e preparar
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run build

# 4) Rodar como serviço (systemd)
sudo tee /etc/systemd/system/ze-express.service > /dev/null <<'EOF'
[Unit]
Description=Ze Express (Next.js)
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ze-express
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now ze-express
```

Depois, aponte o domínio para o VPS e configure **Nginx** (ou o painel da GoDaddy)
como proxy reverso para `http://127.0.0.1:3000`.

---

## 🔑 Variáveis de ambiente (resumo)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | ✅ | URL de conexão PostgreSQL |
| `NEXTAUTH_SECRET` | ✅ | Segredo do NextAuth (gere com `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ✅ | URL pública do site |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `AWS_BUCKET_NAME` / `AWS_FOLDER_PREFIX` | opcional | Bucket S3 para upload de imagens pelo painel admin (sem isso, o upload fica desabilitado) |
| `BLACKCAT_PUBLIC_KEY` / `BLACKCAT_SECRET_KEY` | opcional | Gateway de pagamento BlackCat (também configurável pelo admin) |
| `ABACUSAI_API_KEY` / `OPENAI_API_KEY` | opcional | Recurso de IA “Brand Knowledge” (deixe vazio para desativar) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | opcional | Cloudinary |

---

## 🔧 Troubleshooting

**Erro: “Search your project for any file other than `pages/_document.tsx` that imports `Html` from `next/document`”**
→ Este erro **NÃO vem deste projeto**. Nós verificamos: o código não importa `next/document` em lugar nenhum e não existe pasta `pages/` (o projeto usa App Router — a estrutura é a pasta `app/`). Além disso, essa mensagem só existe em versões **novas** do Next.js (15/16), e este projeto usa o **14.2.35** (fixado no `package.json`). Ou seja: na GoDaddy, o build está rodando com **outro projeto ou outra versão do Next**. Corrija assim:

1. Confira o **Application root** no Setup Node.js App: tem que ser a pasta que **contém o arquivo `package.json`** (ex.: `nodejs/ze-express`). Se apontar para uma pasta acima, a GoDaddy pode estar iniciando um projeto antigo dela.
2. No **Terminal** do cPanel, confirme a versão instalada:
   ```bash
   cd ~/nodejs/ze-express
   npm ls next
   ```
   Tem que aparecer `next@14.2.35`. Se aparecer `15.x`/`16.x` (ou `deduped` de outro lugar), o `node_modules` está com versão errada — apague e reinstale:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm ls next   # deve mostrar 14.2.35
   ```
3. Verifique se sobrou **starter antigo da GoDaddy** dentro da pasta do app (não pode existir `pages/` nem arquivos `_document.tsx`, `_error.tsx`, `404.tsx`, `500.tsx` fora da estrutura do projeto). Procure e apague:
   ```bash
   find ~/nodejs/ze-express -type d -name pages -not -path "*/node_modules/*"
   find ~/nodejs/ze-express -name "_document*" -not -path "*/node_modules/*"
   ```
   Se aparecerem resultados, é um projeto antigo — apague esses arquivos (eles não fazem parte deste projeto).
4. Garanta que você está rodando o build **dentro da pasta certa**:
   ```bash
   cd ~/nodejs/ze-express
   npm run build
   ```
5. Volte ao **Setup Node.js App** e clique em **Restart**. Depois force um recarregamento do site (Ctrl+F5).

Se AINDA falhar, é porque existe uma **cópia antiga do projeto** (ou do starter) sendo usada — compare com o pacote novo: confira se o `package.json` na GoDaddy tem `"next": "14.2.35"` e se a pasta `app/` existe. Se necessário, apague tudo e suba o ZIP novo do zero.

---

**“PrismaClientInitializationError / engine not found”**
→ Rode `npx prisma generate` dentro da pasta do projeto e depois `npm run build` de novo.

**Build trava por falta de memória**
→ No painel/VPS: `export NODE_OPTIONS="--max-old-space-size=2048"` antes do `npm run build`.

**O cPanel informa que a porta 3000 está em uso**
→ A GoDaddy injeta a variável `PORT` automaticamente; não especifique porta fixa no `next start`.

**Login do admin não funciona**
→ Confira `NEXTAUTH_SECRET` e `NEXTAUTH_URL`. Depois de alterar, reinicie o app Node.

**O site funciona, mas o upload de imagens do admin falha**
→ Configure um bucket S3 próprio (ou desative o recurso — o site continua funcionando).
