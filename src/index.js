

import React from 'react';
import ReactDOM from 'react-dom';

import { Game } from './components/game/index.js';
import { Menu } from './components/menu/index.js';

ReactDOM.render(
    <Game />,
    document.getElementById('game')
);

ReactDOM.render(
    <Menu />,
    document.getElementById('menu')
);
