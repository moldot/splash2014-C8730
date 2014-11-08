/**
 * Splash 2014 - C8730: Find the Shortest Path! 
 * File: maze-generator.js
 * Description: Generates and visualizes maze.
 *
 * @author Varot Premtoon
 * @version 1.0 11/08/2014
 */

var WIDTH = 600;
var HEIGHT = 600;
var ROW = 10;
var COL = 10;

var RIGHTWALL = 1;
var DOWNWALL = 2;

var cellHeight = HEIGHT / ROW;
var cellWidth = WIDTH / COL;

var MULTIPLE_PATH_PRB = 0.1

var GEN_METHOD = primMaze

function initCanvas() {
    var ctx = document.getElementById('maze-canvas').getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
};


function drawCell(r, c, downWall, rightWall) {
    var ctx = document.getElementById('maze-canvas').getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    //console.log(downWall, rightWall);
    ctx.fillRect(c * cellWidth, r * cellHeight, cellWidth - rightWall, cellHeight - downWall); 
};

function dot(r, c, color) {
    var ctx = document.getElementById('maze-canvas').getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(c * cellHeight + cellHeight / 2, r * cellWidth + cellWidth / 2,
            Math.min(cellWidth, cellHeight) / 4, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

function drawMaze(cells) {
    for(var i = 0; i < ROW; i++) {
        for (var j = 0; j < COL; j++) {
            drawCell(i, j, 
                    Number((cells[toInd(i, j)] & DOWNWALL) != 0),
                    Number((cells[toInd(i, j)] & RIGHTWALL) != 0));
        }
    }
}

function makeWay(cells, a, b) {
    if (a > b) {
        var tmp = a;
        a = b;
        b = tmp;
    }
    if (b == a+1) {
        cells[a] = (cells[a] & (~RIGHTWALL));
    } else if (b == a + COL) {
        cells[a] = (cells[a] & (~DOWNWALL));
    }
}

function down(ind) {
    if (ind /COL < ROW-1) return ind + COL;
    else return -1;
}

function up(ind) {
    if (ind / COL > 0) return ind - COL;
    else return -1;
}

function right(ind) {
    if (ind % COL < COL-1) return ind + 1;
    else return -1;
}

function left(ind) {
    if (ind % COL > 0) return ind - 1;
    else return -1;
}

function toInd(r, c) {
    return r * COL + c;
}


function primMaze() {
    var visited = new Array(ROW);
    var cells = new Array(ROW * COL);
    for (var i = 0; i < ROW; i++) {
        visited[i] = 0;
    }
    for (var i = 0; i < ROW * COL; i++) {
        cells[i] = RIGHTWALL | DOWNWALL;
    }

    var n = ROW * COL;
    var queue = [];
    visited[0] = 1;
    queue.push({a: 0, b: right(0)});
    queue.push({a: 0, b: down(0)}); 
    while (queue.length > 0) {
        var rnd = Math.floor(Math.random() * queue.length);
        var trans = queue[rnd];
        queue.splice(rnd, 1);
        var a = trans.a;
        var b = trans.b;
        if (visited[trans.b] == 1) continue;
        visited[trans.b] = 1;
        makeWay(cells, a, b); 
        if (up(b) >= 0) queue.push({a: b, b: up(b)});
        if (down(b) >= 0) queue.push({a: b, b: down(b)});
        if (left(b) >= 0) queue.push({a: b, b: left(b)});
        if (right(b) >= 0) queue.push({a: b, b: right(b)});
    }
    return cells;
};   

function addRandomPaths(cells, p) {
    for (var i = 0; i < ROW * COL; i++) {
        if (down(i) > 0 && Math.random() < p) makeWay(cells, i, down(i));
        if (right(i) > 0 && Math.random() < p) makeWay(cells, i, right(i));
    }
}

function getEdges(cells) {
    var edges = []
    for (var i = 0; i < ROW * COL; i++) {
        if ((cells[i] & DOWNWALL) === 0) edges.push({a: i, b: down(i)});
        if ((cells[i] & RIGHTWALL) === 0) edges.push({a: i, b: right(i)});
    }
    return edges;
}

function generate() {
    var cells = GEN_METHOD();
    addRandomPaths(cells, 0.1);
    
    initCanvas();
    drawMaze(cells);
    
    var edges = getEdges(cells);
    var graph_rep = '';

    graph_rep += (ROW * COL).toString() + ' ' + edges.length + '\n';
    for (var i = 0; i < edges.length; i++) {
        graph_rep += edges[i].a.toString() + ' ' + edges[i].b.toString() + '\n';
    }

    $('#graph-rep').val(graph_rep);
}

var main = function() {
    $('#generate').click(generate);
    
    generate();
}


$(document).ready(main);

