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

var RIGHTWALL = 1;
var DOWNWALL = 2;

var numRows = 10;
var numCols = 10;
var cellHeight;
var cellWidth;

var GEN_METHOD = primMaze;

var multipleSolutionProbability = 0;

function initCanvas() {
    var ctx = document.getElementById('maze-canvas').getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    cellWidth = WIDTH / numCols;
    cellHeight = HEIGHT / numRows;
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
    for(var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {
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
    } else if (b == a + numCols) {
        cells[a] = (cells[a] & (~DOWNWALL));
    }
}

function down(ind) {
    if (ind /numCols < numRows-1) return ind + numCols;
    else return -1;
}

function up(ind) {
    if (ind / numCols > 0) return ind - numCols;
    else return -1;
}

function right(ind) {
    if (ind % numCols < numCols-1) return ind + 1;
    else return -1;
}

function left(ind) {
    if (ind % numCols > 0) return ind - 1;
    else return -1;
}

function toInd(r, c) {
    return r * numCols + c;
}

function toR(ind) {
    return Math.floor(ind / numCols);
}

function toC(ind) {
    return Math.floor(ind % numCols);
}


function primMaze() {
    var visited = new Array(numRows);
    var cells = new Array(numRows * numCols);
    for (var i = 0; i < numRows; i++) {
        visited[i] = 0;
    }
    for (var i = 0; i < numRows * numCols; i++) {
        cells[i] = RIGHTWALL | DOWNWALL;
    }

    var n = numRows * numCols;
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
    for (var i = 0; i < numRows * numCols; i++) {
        if (down(i) > 0 && Math.random() < p) makeWay(cells, i, down(i));
        if (right(i) > 0 && Math.random() < p) makeWay(cells, i, right(i));
    }
}

function getEdges(cells) {
    var edges = []
    for (var i = 0; i < numRows * numCols; i++) {
        if ((cells[i] & DOWNWALL) === 0) edges.push({a: i, b: down(i)});
        if ((cells[i] & RIGHTWALL) === 0) edges.push({a: i, b: right(i)});
    }
    return edges;
}

function generate() {
    var cells = GEN_METHOD();

    if (isNaN(Number($('#mpp').val()))) {
        $('#mpp').val('0');
    }
    var mpp = Number($('#mpp').val());
    
    addRandomPaths(cells, mpp);
    
    initCanvas();
    drawMaze(cells);
    
    var edges = getEdges(cells);
    var graph_rep = '';

    graph_rep += (numRows * numCols).toString() + ' ' + edges.length + '\n';
    for (var i = 0; i < edges.length; i++) {
        graph_rep += edges[i].a.toString() + ' ' + edges[i].b.toString() + '\n';
    }

    $('#graph-rep').val(graph_rep);
}

function submitPath() {
    var path = jQuery.map($('#path').val().split(' '), Number);

    for (var i = 0; i < path.length; i++) {
        dot(toR(path[i]), toC(path[i]), 'blue');
    }
}


var main = function() {
    $('#generate-10-10').click(function() {
        numRows = numCols = 10;
        generate();
    });
    
    $('#generate-30-30').click(function() {
        numRows = numCols = 30;
        generate();
    });

    $('#submit-path').click(submitPath);
    
    generate();
}


$(document).ready(main);

