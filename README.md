
O projeto ficou bem interessante, utilizei a Clen Arch para todo o backend, e para o front o design dos componentes foi feito seguindo o composition. Explico mais nos tópicos abaixo.

### Demonstração ao vivo
O projeto está hospedado em: http://77.37.40.187:3000/
por não ter domínio, o google não permite fazer login com oauth, porém todo o resto funciona normal

tem cerca de 10 usuários cadastrados para teste, eles variam de user pra admin
usuários com email impár: teste1@gmail.com tem cargo USER usuários com email par teste2@gmail.com tem função ADMIN

exemplo de login
email: teste1@gmail.com 
senha: 12345678 -- todos tem essa senha

## Configurações (envs)

No backend é só copiar o .env.example e o renomear para .env.

No front é quase a mesma coisa, copiar o .env.exmaple e renomeá-lo. Porém será necessário um google cliente id, para fazer a autenticação via oatuh. Esse vídeo demonstra como criar um projeto no GCP e pegar essa chave: https://www.youtube.com/watch?v=SwCA0K3gy90

## Como rodar

### Docker (recomendado)

requisitos: clonar o repositório, e ter o docker instalado. Ao rodar esse comando ele já vai subir o front na porta 3000, e o backend na porta 4000

```
docker compose up -d
```

### NPM

\*\*\*Importante: o docker compose também sobe o banco e o redis, se for rodar com o npm, rode o docker compose que está dentro da pasta backend, esse sobe apenas o banco e o redis


para o front apenas rode

```
npm run start
```

para o backend primeiro rode o comando npm run migration:run e depois

```
npm run start:dev
```

## Backend

### Estrutura

A estrutura do backend foi montada seguindo a Clean Arch, então temos camada de entities, use cases, infra e presenters pelos módulos, assim fica bem mais fácil de testar.

Para os endpoints de listagem adicionei paginação, assim mesmo com uma base gigante de usuários, o banco não perde a performance

### Autenticação

Utilizei o jwt, porém também implementei uma lógica de refresh token. Assim a aplicação também gerencia tokens, que ficam guardados no redis.

### Testes

Os testes unitários e de integração foram implementados, para rodar utilize os comandos.

para testes unitários:

```
npm run test:unit
```

para testes de integração:

```
npm run test:int
```

O teste de integração roda em um banco de testes

### Adcionais

Também adicionei um esquema de logs pra salvas as alterações que forem feitas em usuários. Assim que uma alteração ocorre ela é enviada para um fila e posteriormente salva no banco.

## Frontend

\*\*\*Obs: A biblioteca que estava no doc do teste está deprecada, ao tentar utiliza-lá, o google retornava este erro:

Como já disse lá em cima, os componentes segume o design patter de composition, o que deixa eles bem mais flexíveis para trabalhar.

A estrutura do cliente http foi montada de uma forma que seja fácil trocar. Então se não quisermos mais utilizar o axios, é só implementar um `fetchAdapter` e retorná-lo no factory.

Utilizei a context api, e adicionei dois providers, um de auth que gerencia o estado do usuário, e um de toast para poder mostrar erros da api.

### Telas mobile:

(a tabela tem um scroll horizontal, e mais pra baixo tem como fazer paginação dos usuários)
![Captura de tela de 2025-05-19 05-33-29](https://github.com/user-attachments/assets/1655cec9-0dfa-405b-a6e3-4091de1aa25c)
![Captura de tela de 2025-05-19 05-34-10](https://github.com/user-attachments/assets/ea273ea6-e66c-4e37-8732-fea81085ba1a)
![Captura de tela de 2025-05-19 05-34-45](https://github.com/user-attachments/assets/d08b9532-7c94-4503-93fd-e0f6b70d1458)
![Captura de tela de 2025-05-19 05-35-08](https://github.com/user-attachments/assets/1a561ebb-bf79-4456-b307-82c4f7fcd4b7)
![Captura de tela de 2025-05-19 05-35-29](https://github.com/user-attachments/assets/882b376c-335d-4eed-a96e-695dc4f25c45)


### Telas desktop

as telas são as mesmas, só um pouco maiores kkk (o texto pode parecer pequeno, mas eu diminui o zoom para caber a tela toda)
![Captura de tela de 2025-05-19 05-37-30](https://github.com/user-attachments/assets/63d9b8c7-4fbe-4b97-9e4d-b96c3281f7fd)
![Captura de tela de 2025-05-19 05-39-35](https://github.com/user-attachments/assets/8cd9f0cd-0092-4f02-914d-0307f1969442)
