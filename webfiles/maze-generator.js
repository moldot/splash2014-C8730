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
var WALL_THICKNESS = 3;

var RIGHTWALL = 1;
var DOWNWALL = 2;

var MAX_WEIGHT = 100;

var cells;
var cellWeights;

var numRows;
var numCols;
var cellHeight;
var cellWidth;
var cellsWeight;

var GEN_METHOD = primMaze;

var SURPRISE_WEIGHT_PROB = 0.0;
var SURPRISE_WEIGHT = MAX_WEIGHT * 10;

function initCanvas() {
    var ctx = document.getElementById('maze-canvas').getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    cellWidth = WIDTH / numCols;
    cellHeight = HEIGHT / numRows;
}


function drawCell(r, c, downWall, rightWall) {
    var ctx = document.getElementById('maze-canvas').getContext('2d');
    ctx.fillStyle = 'hsl(240, 70%, ' + 
            (100 - Math.floor(cellWeights[toInd(r, c)] * 50 / MAX_WEIGHT)).toString() + '%)';
    ctx.fillRect(c * cellWidth, r * cellHeight,
            cellWidth - WALL_THICKNESS * rightWall, cellHeight - WALL_THICKNESS * downWall); 
}

function dot(r, c, color) {
    var ctx = document.getElementById('maze-canvas').getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(c * cellHeight + cellHeight / 2, r * cellWidth + cellWidth / 2,
            Math.min(cellWidth, cellHeight) / 4, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

function drawMaze() {
    for(var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {
            drawCell(i, j, 
                    Number((cells[toInd(i, j)] & DOWNWALL) != 0),
                    Number((cells[toInd(i, j)] & RIGHTWALL) != 0));
        }
    }
}

function makeWay(a, b) {
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
    var visited = [];
    
    cells = [];
    
    for (var i = 0; i < numRows; i++) {
        visited.push(0);
    }
    for (var i = 0; i < numRows * numCols; i++) {
        cells.push(RIGHTWALL | DOWNWALL);
    }

    var n = numRows * numCols;
    var queue = [];
    
    visited[0] = 1;
    queue.push({a: 0, b: right(0)});
    queue.push({a: 0, b: down(0)}); 
    
    while (queue.length > 0) {
        var rnd = Math.floor(Math.random() * queue.length);
        var a = queue[rnd].a;
        var b = queue[rnd].b;
   
        queue.splice(rnd, 1);
  
        if (visited[b] == 1) continue;

        visited[b] = 1;
        makeWay(a, b); 

        if (up(b) >= 0) queue.push({a: b, b: up(b)});
        if (down(b) >= 0) queue.push({a: b, b: down(b)});
        if (left(b) >= 0) queue.push({a: b, b: left(b)});
        if (right(b) >= 0) queue.push({a: b, b: right(b)});
    }
};   

function addRandomPaths(p) {
    console.log(p);
    for (var i = 0; i < cells.length; i++) {
        if (down(i) > 0 && Math.random() < p) makeWay(i, down(i));
        if (right(i) > 0 && Math.random() < p) makeWay(i, right(i));
    }
}

function getEdges() {
    var edges = []
    for (var i = 0; i < cells.length; i++) {
        if ((cells[i] & DOWNWALL) === 0) edges.push({a: i, b: down(i)});
        if ((cells[i] & RIGHTWALL) === 0) edges.push({a: i, b: right(i)});
    }
    return edges;
}

function generate(weighted) {
    GEN_METHOD();

    if (isNaN(Number($('#mpp').val()))) {
        $('#mpp').val('0');
    }
    var mpp = Number($('#mpp').val());
    
    addRandomPaths(mpp);

    cellWeights = []
    for (var i = 0; i < numRows * numCols; i++) {
        if (weighted) {
            if (Math.random() > SURPRISE_WEIGHT_PROB) {
                cellWeights.push(Math.floor(Math.random() * MAX_WEIGHT) + 1);
            }
            else {
                cellWeights.push(Math.floor(Math.random() * SURPRISE_WEIGHT) + 1);
            }
        }
        else {
            cellWeights.push(1);
        }
    }
    
    initCanvas();
    drawMaze();
    
    var edges = getEdges();
    var graph_rep = '';

    graph_rep += (numRows * numCols).toString() + ' ' + edges.length + '\n';
    if (weighted) {
        for (var i = 0; i < cellWeights.length; i++) {
            graph_rep += cellWeights[i].toString() + '\n';
        }
    }
    for (var i = 0; i < edges.length; i++) {
        graph_rep += edges[i].a.toString() + ' ' + edges[i].b.toString() + '\n';
    }

    $('#graph-rep').val(graph_rep);
    $('#feedback-placeholder').hide();
}

function showFeedback(type, message) {
    $('#feedback-placeholder').html('<div class="alert ' + type + '">' + 
                                    '<span>' + message + '</span></div>');
    $('#feedback-placeholder').show();
}

function submitPath() {
    var path = jQuery.map($('#path').val().split(' '), Number);
    var alerted = 0;
    var cost = 0;

    drawMaze();

    for (var i = 0; i < path.length; cost += cellWeights[path[i]], i++) {
        if (i > 0) {
            if ((path[i] === up(path[i-1]) && (cells[path[i]] & DOWNWALL) > 0) ||
                (path[i] === right(path[i-1]) && (cells[path[i-1]] & RIGHTWALL) > 0) ||
                (path[i] === down(path[i-1]) && (cells[path[i-1]] & DOWNWALL) > 0) ||
                (path[i] === left(path[i-1]) && (cells[path[i]] & RIGHTWALL) > 0)) {
                dot(toR(path[i]),toC(path[i]), 'red');
                if (alerted === 0) {
                    showFeedback('alert-danger', 'The path crosses a wall');
                    alerted = 1;
                }
            } 
            else {
                dot(toR(path[i]), toC(path[i]), 'green');
            }
        }
        else {
            dot(toR(path[i]), toC(path[i]), 'green');
        }
    }

    if (alerted === 0) showFeedback('alert-success', 'Your path is correct at cost <b>' + cost.toString() + '.</b>');
}


var main = function() {
    $('#generate-10-10').click(function() {
        numRows = numCols = 10;
        generate($('#weighted').is(':checked'));
    });
    
    $('#generate-30-30').click(function() {
        numRows = numCols = 30;
        generate($('#weighted').is(':checked'));
    });

    $('#submit-path').click(function() {
        if (typeof cells === 'undefined') {
            showFeedback('alert-danger', 'Maze not yet generated');
        }
        else {
            submitPath();
        }
    });
   
    numRows = numCols = 10;
    generate(false);
}


$(document).ready(main);

