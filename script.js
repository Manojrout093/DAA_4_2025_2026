const ROWS = 20;
const COLS = 40;
const START_NODE = [10, 5];
const END_NODE = [10, 35];
let gridData = [];

// Initialize Grid
function createGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    gridData = [];

    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            const node = document.createElement('div');
            node.classList.add('node');
            node.id = `node-${r}-${c}`;
            
            const nodeObj = {
                r, c, 
                isStart: r === START_NODE[0] && c === START_NODE[1],
                isEnd: r === END_NODE[0] && c === END_NODE[1],
                isWall: false,
                distance: Infinity,
                isVisited: false,
                previousNode: null
            };

            if (nodeObj.isStart) node.classList.add('node-start');
            if (nodeObj.isEnd) node.classList.add('node-end');

            // Wall drawing logic
            node.onmousedown = () => { nodeObj.isWall = true; node.classList.add('node-wall'); };
            node.onmouseenter = (e) => { if (e.buttons === 1) { nodeObj.isWall = true; node.classList.add('node-wall'); } };

            gridElement.appendChild(node);
            row.push(nodeObj);
        }
        gridData.push(row);
    }
}

// Dijkstra's Algorithm
async function startDijkstra() {
    const startNode = gridData[START_NODE[0]][START_NODE[1]];
    const endNode = gridData[END_NODE[0]][END_NODE[1]];
    startNode.distance = 0;

    let unvisitedNodes = gridData.flat();

    while (unvisitedNodes.length) {
        unvisitedNodes.sort((a, b) => a.distance - b.distance);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) break;

        closestNode.isVisited = true;
        if (closestNode !== startNode && closestNode !== endNode) {
            document.getElementById(`node-${closestNode.r}-${closestNode.c}`).classList.add('node-visited');
            await new Promise(r => setTimeout(r, 10)); // Animation delay
        }

        if (closestNode === endNode) return animatePath(endNode);

        updateNeighbors(closestNode);
    }
}

function updateNeighbors(node) {
    const neighbors = [];
    const {r, c} = node;
    if (r > 0) neighbors.push(gridData[r-1][c]);
    if (r < ROWS - 1) neighbors.push(gridData[r+1][c]);
    if (c > 0) neighbors.push(gridData[r][c-1]);
    if (c < COLS - 1) neighbors.push(gridData[r][c+1]);

    for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
            neighbor.distance = node.distance + 1;
            neighbor.previousNode = node;
        }
    }
}

async function animatePath(endNode) {
    let curr = endNode;
    while (curr !== null) {
        const el = document.getElementById(`node-${curr.r}-${curr.c}`);
        el.classList.add('node-path');
        curr = curr.previousNode;
        await new Promise(r => setTimeout(r, 30));
    }
}

function resetGrid() { createGrid(); }

createGrid();