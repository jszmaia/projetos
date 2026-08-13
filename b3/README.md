# B3 Bolsa Monitor

Painel de mercado brasileiro e global. A B3 e a fonte oficial para dados de indices e componentes brasileiros. Para mercados globais, detalhes de ativos, noticias e graficos, o app usa a assinatura **Yahoo Finance via RapidAPI**.

## Como a chave funciona

O Yahoo Finance nao disponibiliza uma API publica oficial para esse uso. Por isso, o projeto integra a API hospedada pela RapidAPI. Cada pessoa que executar sua propria copia do aplicativo deve criar uma conta na RapidAPI, assinar o produto correspondente e usar a propria chave. Os planos possuem limites e precos definidos pela RapidAPI.

1. Crie uma conta em [RapidAPI](https://rapidapi.com/).
2. Assine a API `Yahoo Finance` cujo host seja `apidojo-yahoo-finance-v1.p.rapidapi.com`.
3. Copie a chave apresentada nos exemplos da RapidAPI.
4. Crie um arquivo chamado `.env` ao lado deste README, com base em `.env.example`.
5. Inicie o servidor e abra `http://localhost:4173`:
   - de dentro desta pasta: `npm start`
   - da raiz do repositorio: `npm run b3`

Se a RapidAPI retornar `403` com a mensagem `You are not subscribed to this API`, a chave esta correta, mas a conta ainda nao foi aprovada ou inscrita no produto. Volte a pagina da API na RapidAPI e ative um plano para o host acima; criar a conta ou enviar uma solicitacao, por si so, nao libera as consultas.

Exemplo de configuracao (nao use uma chave real em arquivos versionados):

```env
RAPIDAPI_KEY=sua_chave_privada
RAPIDAPI_HOST=apidojo-yahoo-finance-v1.p.rapidapi.com
```

O servidor le o `.env` ao iniciar. Em hospedagem, prefira configurar `RAPIDAPI_KEY` como variavel de ambiente do provedor; ela substitui o valor do arquivo local.

## Seguranca da chave

- O `.env` esta no `.gitignore` e nao deve ser enviado para GitHub, compartilhado ou colocado no frontend.
- A chave fica somente no servidor: o navegador chama as rotas locais do aplicativo e nunca recebe o valor da credencial.
- Caso uma chave seja publicada por engano, revogue ou gere outra no painel da RapidAPI.

## Sem RapidAPI

O painel continua mostrando a B3 e seus componentes oficiais. Os recursos Yahoo aparecem como indisponiveis ate que uma chave seja configurada.

## Fontes e limites

Dados de mercado podem ter atraso, limites de requisicao ou cobertura variavel conforme o plano contratado. O aplicativo e um monitor informativo e nao constitui recomendacao de investimento.
