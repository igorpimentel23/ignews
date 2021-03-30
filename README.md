# Ignews

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Índice**

- [Começando](#come%C3%A7ando)
  - [Pré-requisitos](#pr%C3%A9-requisitos)
  - [Instalando](#instalando)
    - [Configurando o Stripe](#configurando-o-stripe)
    - [Configurando as chaves de Acesso do Github](#configurando-as-chaves-de-acesso-do-github)
    - [Configurando o Faunadb](#configurando-o-faunadb)
    - [Configurando o Prismic CMS](#configurando-o-prismic-cms)
    - [Iniciando o projeto](#iniciando-o-projeto)
- [Autores](#autores)
- [Licença](#licen%C3%A7a)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Blog em NextJS em que o usuário necessita fazer o login pelo Github e também uma assinatura mensal para ter acesso aos posts. A aplicação utiliza o FaunaDB como banco de dados, Stripe como plataforma de pagamentos e Prismic CMS como editor para os posts.

## Começando

Estas instruções te darão uma cópia do projeto pronta para rodar na sua máquina local para propositos de testes.

### Pré-requisitos

Para a instalação do projeto, é necessário que o Yarn esteja instalado na máquina.

[Yarn](https://classic.yarnpkg.com/en/docs/install/)

### Instalando

Depois de clonar e baixar o projeto, execute:

```
yarn
```

E em seguida, execute:

```
cp .env.example .env
```

#### Configurando o Stripe

Acessar o site do [Stripe](https://stripe.com/), e criar uma conta.

Acesse no menu lateral, a opção configurações. Crie um nome para a aplicação e preencha o campo "Nome da conta".

Em seguida, para criar a assinatura, no menu lateral, acessar o item "Produtos" e depois "Adicionar um produto de teste". Então, crie um produto conforme.

Após a criação do produto, copiar o ID do produto, e colar no item "STRIPE_PRODUCT_PRICE" do arquivo .env do projeto.

Agora, acesse no menu lateral da plataforma do Stripe, a opção "Desenvolvedores" e em seguida "Chaves da API". Então, copie a "chave publicável" e a "chave secreta" para os itens "NEXT_PUBLIC_STRIPE_PUBLIC_KEY" e "STRIPE_API_KEY", respectivamente.

Em seguida, executar:

```
docker-compose up --build -d
```

Em seguida, executar:

```
./stripecli
```
Em seguida, executar:

```
stripe login
```
Após a execução do comando, acessar o link fornecido na linha de comando. Exemplo:

```
To authenticate with Stripe, please go to: https://dashboard.stripe.com/stripecli/confirm_auth?t=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Após autorizar o acesso no browser, executar o comando:

```
stripe listen
```
Copiar a chave exibida.

```
> Ready! Your webhook signing secret is whsec_XXXXXXXXXXXXXXXXXXXXXXXX
```

#### Configurando as chaves de Acesso do Github

Acessar as configurações de desenvolvedor do [GitHub](https://github.com/settings/apps) e registrar uma nova aplicação OAuth. Assim a aplicação for registrada, copiar o ID do cliente e o segredo do cliente e colar nos itens "GITHUB_ID" e "GITHUB_SECRET" respectivamente no arquivo .env do projeto.

#### Configurando o Faunadb

Executar o comando

```
./faunadb
```

Em seguida executar os seguintes comandos:

```
fauna create-database ignews
```
```
fauna create-key ignews
```

Após a execução dos comandos, copiar a chave de acesso mostrada e colar no item "FAUNA_ROOT_KEY" no arquivo .env do projeto.

```
created key for database 'ignews' with role 'admin'.
secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Então, executar os seguintes comandos:

```
fauna shell ignews
```
```
CreateCollection({ name: "users" })
```
```
CreateCollection({ name: "subscriptions" })
```
```
CreateIndex({
  name: "subscription_by_id",
  unique: false,
  serialized: true,
  source: Collection("subscriptions"),
  terms: [
    {
      field: ["data", "id"]
    }
  ]
})
```
```
CreateIndex({
  name: "subscription_by_status",
  unique: false,
  serialized: true,
  source: Collection("subscriptions"),
  terms: [
    {
      field: ["data", "status"]
    }
  ]
})
```
```
CreateIndex({
  name: "subscription_by_user_ref",
  unique: false,
  serialized: true,
  source: Collection("subscriptions"),
  terms: [
    {
      field: ["data", "userId"]
    }
  ]
})
```
```
CreateIndex({
  name: "user_by_email",
  unique: true,
  serialized: true,
  source: Collection("users"),
  terms: [
    {
      field: ["data", "email"]
    }
  ]
})
```
```
CreateIndex({
  name: "user_by_stripe_customer_id",
  unique: false,
  serialized: true,
  source: Collection("users"),
  terms: [
    {
      field: ["data", "stripe_customer_id"]
    }
  ]
})
```

#### Configurando o Prismic CMS

Criar uma conta no site do [Prismic](https://prismic.io/).
Criar um repositório com o plano Free.

Criar um tipo de postagem utilizando as seguintes configurações:

```
{
  "Main" : {
    "uid" : {
      "type" : "UID",
      "config" : {
        "label" : "UID"
      }
    },
    "title" : {
      "type" : "StructuredText",
      "config" : {
        "single" : "heading1",
        "label" : "Title"
      }
    },
    "content" : {
      "type" : "StructuredText",
      "config" : {
        "multi" : "paragraph, preformatted, heading1, heading2, heading3, heading4, heading5, heading6, strong, em, hyperlink, image, embed, list-item, o-list-item, rtl",
        "allowTargetBlank" : true,
        "label" : "Content"
      }
    }
  }
}
```
Então, crie alguns posts para teste.

Agora, no menu lateral, acessar "Settings" e "API & Security".Em "API Endpoint" copiar o link mostrado para o item "PRISMIC_ENDPOINT" no arquivo .env do projeto. Em "Repository Security" alterar a opção selecionada para "Private API - Require an access token for any request" e clicar em  "Change the API visibility". Em "Generate an Access Token", preencher o campo "Aplication Name" e clicar em "Add this Repository" e então copie o campo "Access to master" e cole no item "PRISMIC_ACCESS_TOKEN" do arquivo .env do projeto.

#### Iniciando o projeto

Executar os comandos:

```
docker-compose down
```
```
docker-compose up
```
```
yarn dev
```

Para acessar a aplicação, acesse no navegador o endereço:

```
http://localhost:3000/
```

Para propósitos de teste da aplicação, ao realizar a assinatura pelo Stripe, utilizar o número de cartão de crédito abaixo:

```
4242 4242 4242 4242
```

O restante das informações pode ser fictícia.

## Autores

* **Igor Pimentel** - *Trabalho inicial* - [igorpimentel23](https://github.com/igorpimentel23)


## Licença

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
