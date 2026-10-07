# Zé Express — Guia de Deploy na Netlify

Este projeto é um e-commerce **Next.js 14 + PostgreSQL (Prisma)** com rotas dinâmicas
e API routes. A Netlify tem suporte oficial a Next.js (Netlify Next.js Runtime), então
o deploy é simples.

> ⚠️ **Importante:** a Netlify **não aceita upload de pasta/ZIP** para apps dinâmicos
> (o Netlify Drop é só para sites 100% estáticos). Um app Next.js com API routes e
> renderização no servidor precisa ser enviado por **repositório Git** (criar um repo
> no GitHub, subir os arquivos e importar na Netlify).

---

## ⚙️ O que já vem pronto neste pacote

- `netlify.toml` — define build (`npm run build`), pasta publicada (`.next`), Node 20
  e o plugin oficial `@netlify/plugin-nextjs` (instalado automaticamente pela Netlify).
- `server.js` — **não é usado na Netlify** (o runtime cuida do servidor). Ele fica
  apenas para compatibilidade com a GoDaddy.
- `.env.example` — modelo das variáveis de ambiente.
- Dependências de build (TypeScript, Prisma, Tailwind) **em `dependencies`** — evita
  quebras quando a Netlify instala com `--production`.

---

## 🗄️ 1. Criar o banco PostgreSQL (2 minutos)

A Netlify não oferece banco de dados. Crie um PostgreSQL grátis em uma dessas opções:

- [neon.tech](https://neon.tech) (recomendado)
- [supabase.com](https://supabase.com)
- [railway.app](https://railway.app)

Copie a **connection string** que eles fornecem (formato
`postgresql://usuario:senha@host:5432/banco`). Ela será a sua `DATABASE_URL`.

---

## ⚙️ 2. Criar o repositório e subir o código

No seu computador:

```bash
# dentro da pasta do projeto (onde está o netlify.toml)
rm -rf node_modules .next .build   # garante que nada de build local suba

git init
git add .
git commit -m "Zé Express - Next.js 14"
```

Crie um repositório vazio no [GitHub](https://github.com/new) (ex.: `ze-express`) e envie:

```bash
git remote add origin https://github.com/SEU_USUARIO/ze-express.git
git branch -M main
git push -u origin main
```

> Os arquivos `.env`, `node_modules` e `.next` já estão no `.gitignore` — não sobem.

---

## 🌐 3. Importar na Netlify

1. Acesse [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Escolha o repositório `ze-express` (autorize o GitHub se pedir).
3. A Netlify **detecta o `netlify.toml`** e já preenche:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. Antes de clicar em **Deploy**, configure as variáveis de ambiente:
   - `DATABASE_URL` → connection string do banco (com `?schema=public` no final, se não tiver)
   - `NEXTAUTH_SECRET` → gere com `openssl rand -base64 32` (ou use [randomkeygen.com](https://randomkeygen.com))
   - `NEXTAUTH_URL` → a URL do seu site na Netlify (ex.: `https://ze-express.netlify.app`; dá para alterar depois de publicar)
   - **Opcionais** (deixe vazio se não usar): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`, `AWS_FOLDER_PREFIX` (upload de imagens no admin), `BLACKCAT_PUBLIC_KEY`, `BLACKCAT_SECRET_KEY` (gateway de pagamento), `ABACUSAI_API_KEY` / `OPENAI_API_KEY` (IA Brand Knowledge), credenciais Cloudinary.
5. Clique em **Deploy** e aguarde o build terminar.

---

## 📦 4. Criar as tabelas e popular o banco (PRIMEIRA VEZ)

As tabelas e o seed **rodam no seu computador** (uma única vez), apontando para o banco:

```bash
cd /home/SEU_USUARIO/ze-express   # pasta do projeto no seu PC

cp .env.example .env              # preencha DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
npm install
npx prisma generate
npx prisma db push                # cria as tabelas no banco
npm run seed                      # cria admin, 14 categorias, 442 produtos, 39 marcas
```

**Acesso ao admin** (criado pelo seed):
- URL: `https://seu-site.netlify.app/login`
- Email: `ze@abacusai.app`
- Senha: `121416`

> Troque a senha no painel após o primeiro login. Não rode o seed de novo depois que
> o site estiver em produção (ele é seguro — não apaga dados — mas duplicaria registros).

---

## 🔄 5. Publicar mudanças futuras

Toda vez que alterar o código:

```bash
git add .
git commit -m "descrição da mudança"
git push
```

A Netlify detecta o push e faz o redeploy automaticamente.

---

## 🔧 Troubleshooting

**Erro “Html from next/document”**
→ Não faz parte deste projeto (usa App Router, pasta `app/`, sem `pages/`). Se aparecer
na Netlify, confirme que você está fazendo build da pasta certa e que `npm ls next`
mostra `next@14.2.35`.

**Build trava por falta de memória no free tier**
→ No Netlify: **Site configuration → Build & deploy → Environment** – variável
`NODE_OPTIONS` = `--max-old-space-size=2048` (o free tier tem 3 GB; se ainda travar,
é o tamanho das dependências — reduza em outro plano ou use Neon/Vercel).

**“PrismaClientInitializationError” em produção**
→ O `DATABASE_URL` está errado ou não foi definido. Confira em **Site configuration →
Environment variables** e faça um novo deploy (ou clique em **Retry deploy**).

**Login/admin não funciona**
→ Confira `NEXTAUTH_SECRET` e `NEXTAUTH_URL` (sem barra no final). Reinicie o deploy
após alterar.

**Upload de imagens no admin falha**
→ Configure um bucket S3 próprio (ou desative — o site continua funcionando).

**Escolher entre Netlify, Vercel e Abacus**
→ Este mesmo código roda nesses três. A **Vercel** é a dona do Next.js e tem o deploy
mais simples (o mesmo fluxo do Git). O **Abacus** também funciona e tem banco próprio
gratuito. A Netlify é ótima se você já usa o ecossistema dela.
