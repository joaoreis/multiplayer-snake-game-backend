# FangAndFriends - Backend

## [Jogar Fang and Friends](http://ec2-15-228-3-72.sa-east-1.compute.amazonaws.com/#/)


[FangAndFriends Gameplay](https://github.com/joaoreis/multiplayer-snake-game/assets/857735/6922fdae-02c5-43c1-b6e0-5317825b8b29)

O backend deste projeto é responsável por gerenciar a lógica do *jogo da cobrinha multiplayer* e a comunicação em tempo real entre os jogadores.

Ele utiliza Node.js como ambiente de execução do servidor e o Socket.IO para permitir a troca de dados em tempo real. O servidor mantém o estado do jogo e notifica os clientes sobre as atualizações, garantindo que todos os jogadores vejam a mesma versão do jogo

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/): Ambiente de execução do servidor.
- [Socket.IO](https://socket.io/): Biblioteca para a comunicação cliente-servidor em tempo real.

## Funcionalidades

- Gerenciamento de múltiplos jogadores conectados em tempo real.
- Gerenciamento de múltiplas salas simultâneas.
- Lógica do jogo, incluindo a pontuação, resposta aos comandos e as colisões.
- Comunicação em tempo real para atualização do estado do jogo.

## Como rodar localmente

1. Clone este repositório: `git clone https://github.com/joaoreis/multiplayer-snake-game-backend.git`.
2. Navegue para o diretório do projeto: `cd multiplayer-snake-game-backend`.
3. Instale as dependências: `npm install`.
4. Inicie o servidor local: `npm start`.
5. O servidor estará rodando em `http://localhost:5000`
6. Para jogar, siga as instruções no [repositório do frontend](https://github.com/joaoreis/multiplayer-snake-game#readme) para configurá-lo corretamente.
