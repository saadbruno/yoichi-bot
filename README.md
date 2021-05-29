# Yoichi Bot
Um bot feito de brincadeira para o Discord do [Monastério Gentileza](https://discord.gg/cyWp3KEwtc), de Monge Han, personificando o Yoichi e adicionando funções extras.

![screenshot do bot em funcionamento](https://user-images.githubusercontent.com/23201434/111733997-ef1b2d00-8857-11eb-85e9-3550ddc9c4cf.png)

## Recursos:
- Reações a menções de "Yoichi", "Bom dia, Yoichi", entre outros
- Páginas de mondolís. Ex: `!mondolis cap 1 pag 2`

## Desenvolvimento:
Pull requests são muito bem vindas!

### Requerimentos:
- [Node.js](https://nodejs.org/)
- Um Aplicativo com Bot no [portal de desenvolvimento do Discord](https://discord.com/developers/applications)
- Uma base (planilha) no Airtable seguindo [esse schema](https://airtable.com/shr4aG6NiuZKNQ7Az), você pode duplicar essa base, caso necessário!

### Dev environment:
- Clone o repositório
- Copie o `config.json.example` para `config.json`
- Edite a `config.json` com os dados necessários
  - `token`: Token pessoal do bot criado no [portal de desenvolvimento do Discord](https://discord.com/developers/applications)
  - `servidoresAutorizados`: Alguns comandos (como o `!avatar`) necessitam que você seja administrador de algum dos servidores listados aqui.
  - `emoteBrabo` e `emoteEnvergonhado`: São os emotes que o Yoichi reage em casos específicos. Você pode incluir um emoji aqui (como no exemplo) ou algum emote personalizado do Discord (ex: `:yoichibrabo:822537986428239893`)
  - `airtableKey`: Sua chave de API do Airtable, disponível [na sua conta](https://airtable.com/account)
  - `airtableBase`: O ID da sua base (planilha) do Airtable, disponível na [documentação do Airtable](https://airtable.com/api)
  - `canalAniversario`: O ID do canal que o bot vai postar as mensagens de aniversário
- Instale as dependencias com `npm install`
- Rode o bot com o comando `node index.js`

## Links úteis
- [Discord.js](https://discord.js.org/)
- [Airtable.js](https://github.com/Airtable/airtable.js)
