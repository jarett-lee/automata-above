'use strict';

const CANVAS_SIZE = 800;
const SCREEN_SIZE = 100;
const SQUARE_SIZE = CANVAS_SIZE/SCREEN_SIZE;
var canvas;
var context;

$(document).ready(function() {

    var position = $('#canvas').position();
    $('.overlay').css({top: position.top, left: position.left, position: 'absolute'});
    $('.overlay').draggable({containment: '#canvas', scroll: false});
    $('.close').on('click', function() {
        $('.close').parent().hide();
    });

    startGame();
});

function startGame() {
    initBoard();
    function step() {
        update();
        draw();
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}

var step_num = 0;
var x = 10;
var y = 0;
var x_v = 2;
var y_v = 2;
var x_list = [];
var y_list = [];
var x_c;
var y_c;
const SAVE_TAIL = 100;
var tail_len = 10;

function update() {
    updateHead();
    updateTailLen();
    updateTail();
    step_num++;
}

function bounded(i) {
    return i <= 0 || i > SCREEN_SIZE;
}

function draw() {
    setRectangle(x, y);
    if (step_num > tail_len) {
        clearRectangle(x_c, y_c);
    }
    // setRandomSquare();
}

function updateTail() {
    let tail_num = (step_num - tail_len) % SAVE_TAIL;
    x_c = x_list[tail_num];
    y_c = y_list[tail_num];

    tail_num = step_num % SAVE_TAIL;
    x_list[tail_num] = x;
    y_list[tail_num] = y;
}

function updateTailLen() {
    let tail_len_n = x_v*x_v + y_v*y_v;
    if (tail_len != tail_len_n) {
        for (let i = 0; i <= (tail_len - tail_len_n); i++) {
            let tail_num = (step_num - tail_len + i) % SAVE_TAIL;
            x_c = x_list[tail_num];
            y_c = y_list[tail_num];
            clearRectangle(x_c, y_c);
        }
    }
    tail_len = tail_len_n;
}

function updateHead() {
    var x_n = x + x_v;
    var y_n = y + y_v;
    if (bounded(x_n)) {
        x_v = -x_v;
        if (x_v <= 3 && (x_v == 1 || Math.floor(Math.random() * 2) == 0)) {
            if (x_n <= 0) {
                x_v++;
            }
            else {
                x_v--;
            }
        }
        else {
            if (x_n <= 0) {
                x_v--;
            }
            else {
                x_v++;
            }
        }
    }
    if (bounded(y_n)) {
        y_v = -y_v;
        if (y_v <= 3 && (y_v == 1 || Math.floor(Math.random() * 2) == 0)) {
            if (y_n <= 0) {
                y_v++;
            }
            else {
                y_v--;
            }
        }
        else {
            if (y_n <= 0) {
                y_v--;
            }
            else {
                y_v++;
            }
        }
    }
    x += x_v;
    y += y_v;
}

function randomColors() {
    let count = 0;
    var lastLoop = performance.now();
    var fps_list = [];
    var fps;

    setInterval(function() {
        var thisLoop = performance.now();
        fps_list[count % 100] = 1000 / (thisLoop - lastLoop);
        lastLoop = thisLoop;

        fps = 0;
        for (let i = 0; i < fps_list.length; i++) {
            fps += fps_list[i];
        }
        fps = fps / fps_list.length;

        $('#fps').html('<p>'+fps+'</p>');

        for (let i = 0; i < 100; i++) {
            setRandomSquare();
        }

        count++;
    }, 10);
}

function setRandomSquare() {
    let x = Math.floor(Math.random() * SCREEN_SIZE);
    let y = Math.floor(Math.random() * SCREEN_SIZE);
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    context.fillStyle = 'rgb('+r+', '+g+', '+b+')';
    setRectangle(x, y);
}

function initBoard() {
    canvas = document.getElementById('canvas');
    canvas.height = CANVAS_SIZE;
    canvas.width = CANVAS_SIZE;

    context = canvas.getContext('2d');
}

function clearBoard() {
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function setRectangle(x, y) {
    context.fillRect(SQUARE_SIZE*(x-1) + 1, SQUARE_SIZE*(y-1) + 1, SQUARE_SIZE - 1, SQUARE_SIZE - 1);
}

function clearRectangle(x, y) {
    context.clearRect(SQUARE_SIZE*(x-1) + 1, SQUARE_SIZE*(y-1) + 1, SQUARE_SIZE - 1, SQUARE_SIZE - 1);
}
