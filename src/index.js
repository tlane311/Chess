import React from 'react';
import ReactDOM from 'react-dom';

import { Game } from './components/game/game.js';
import { Menu } from './components/menu/menu.js';

ReactDOM.render(
    <Game />,
    document.getElementById('game')
);

ReactDOM.render(
    <Menu />,
    document.getElementById('menu')
);
/*
ReactDOM.render(
    <Login />,
    document.getElementById('login')
);*/