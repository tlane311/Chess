
### Introduction
This project is still a work in progress. This markdown was created to help myself whenever I want to alter the chess app or for anyone who is curious how it works.

### Notes
ES6 modules are used.

### React-App
#### Game Logic
Game logic is stored in app/src/components/game/pieces.


### Backend
Server is created using express. Games are played in real time using a TCP connection established by socket.io. Users can create accounts and login via an express rest api. We divide our processes into three parts: routes, controllers and services; we separate each of those into two parts for the sockets and the rest api, respectively.