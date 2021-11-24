# Yoichi Bot
Um bot feito de brincadeira para o Discord do [Monastério Gentileza](https://discord.gg/cyWp3KEwtc), de Monge Han, personificando o Yoichi e adicionando funções extras.

![image](https://user-images.githubusercontent.com/23201434/131280096-bbf7ecaa-691f-4bf6-b6cf-1e8df5884fef.png)
![image](https://user-images.githubusercontent.com/23201434/131280108-1400a8de-f87e-4217-ae1d-f74f4ccd0976.png)

## Recursos:
- Reações a menções de "Yoichi", "Bom dia, Yoichi", entre outros.
- Mostra páginas de mondolís.
- Dá a role de Aniversariante pros aniversariantes do dia (e anuncia no #Megafone).
- Mostra como linkar a conta da Twitch com o Discord.

## Desenvolvimento:
Pull requests são muito bem vindas!

### Requerimentos:
- [Node.js](https://nodejs.org/)
- Um Aplicativo com Bot no [portal de desenvolvimento do Discord](https://discord.com/developers/applications)
- Uma base (planilha) no Airtable seguindo [esse schema](https://airtable.com/shr4aG6NiuZKNQ7Az), você pode duplicar essa base, caso necessário!
- Priviledged Intents
  - O Discord agora precisa que você habilite permissões para ler mensagens do servidor através do portal de desenvolvedor. Navegue até `https://discord.com/developers/applications/<application_id>/bot` e marque as opções de membros. Isso serve pro comando de purgerole e pras reações à menções do Yoichi.

### Dev environment:
- Clone o repositório
- Copie o `config.json.example` para `config.json`
- Edite a `config.json` com os dados necessários
  - `clientId`: O ID do seu aplicativo no [portal de desenvolvimento do Discord](https://discord.com/developers/applications). Só serve para registrar os comandos na API do Discord. Quando o bot está rodando, ele usa o próprio client ID.
  - `guildId`: O ID da guild principal do bot. Isso vai ser usado pra registrar os comandos, e pra tarefas como as roles de aniversário e da contagem.
  - `token`: Token pessoal do bot criado no [portal de desenvolvimento do Discord](https://discord.com/developers/applications)
  - `prefixo`: DESCONTINUADO: Agora o bot usa os comandos nativos com `/` do Discord. Ainda está aqui pra responder às mensagens de migração.
  - `emoteBrabo` e `emoteEnvergonhado`: São os emotes que o Yoichi reage em casos específicos. Você pode incluir um emoji aqui (como no exemplo) ou algum emote personalizado do Discord (ex: `:yoichibrabo:822537986428239893`)
  - `airtableKey`: Sua chave de API do Airtable, disponível [na sua conta](https://airtable.com/account)
  - `airtableBase`: O ID da sua base (planilha) do Airtable, disponível na [documentação do Airtable](https://airtable.com/api)
  - `canalAniversario`: O ID do canal que o bot vai postar as mensagens de aniversário
  - `roleAniversario`: O ID da role de aniversariante
  - `roleCounting`: A role de "Não sabe contar". O bot remove essa role de todos os membros em todo dia 1 de cada mês
  - `textoPomodoro`: O ID do canal de texto que o bot posta output do comando Pomodoro
  - `vozPomodoro`: O ID do canal de voz que o bot checa por participantes do Pomodoro
- (Opcional) Copie o `data/blacklist.json.example` para `data/blacklist.json` e edite de acordo. Mensagens que contenham qualquer uma das strings definidas nesse arquivo serão automaticamente removidas.
- Instale as dependencias com `npm install`
- Registre os comandos com `node deploy-commands.js`
- Rode o bot com o comando `node index.js`

## Docker
Atualmente o bot não conta com um setup de Docker para Dev, mas conta com um para produção.
### Build
- Para buildar a imagem, rode `make build` ou então `docker build . -t saadbruno/yoichi-bot`

### Run
- Crie um arquivo `config.json` com base no [repositorio](https://github.com/saadbruno/yoichi-bot/blob/main/config.json.example)

- Opção 1: Docker run
`docker run -v $(pwd)/config.json:/usr/src/app/config.json --name yoichi-bot saadbruno/yoichi-bot`

- Opção 2: Docker Compose
```
version: '3.5'
services:
  yoichi-bot:
    image: saadbruno/yoichi-bot
    restart: unless-stopped
    volumes:
      - ./config.json:/usr/src/app/config.json
```

## Links úteis
- [Discord.js](https://discord.js.org/)
- [Airtable.js](https://github.com/Airtable/airtable.js)
