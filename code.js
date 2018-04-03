let canvas = document.getElementById('ttt'),
    ctx = canvas.getContext('2d'),
    msg = document.getElementById('message'),
    mouse = {
      x: -1,
      y: -1,
    },
    cellSize = 180;
var board = [0, 1, 2, 3, 4, 5, 6, 7, 8],
    huPlayer = "P",
    aiPlayer = "C",
    iter = 0,
    round = 0,
    currentPlayer = huPlayer,
    gameOver = false;
canvas.width = canvas.height = 3*cellSize;
ctx.lineCap = "round";

if(document.cookie == null){ document.cookie = "mode=multiPlayer";}

console.log(document.cookie);
function multiPlayer() {
  document.cookie = "mode=multiPlayer";
  console.log(document.cookie);
}

function computerEasy() {
  document.cookie = "mode=easy";
  console.log(document.cookie);
}

function computerHard() {
  document.cookie = "mode=hard";
  console.log(document.cookie);
}

canvas.addEventListener('mouseout', function() {
  mouse.x = mouse.y = -1;
});

canvas.addEventListener('mousemove', function(e){
  let x = e.pageX - canvas.offsetLeft,
      y = e.pageY - canvas.offsetTop;

  mouse.x = x;
  mouse.y = y;
});

canvas.addEventListener('click', function(e) {
  x = Math.floor(mouse.x/180);
  y = Math.floor(mouse.y/180);
  play(x+y*3);
});



function getDifficulty() {
  return document.cookie.substring(document.cookie.indexOf("mode=")+5);
}

msg.textContent = "Difficulty level: " + getDifficulty();

function play(cell){

  if(gameOver) return;

  if(board[cell] == "P" || board[cell] == "C"){
    msg.textContent = 'Position taken.';
    console.log(cell + ' ' + board[cell] + ' ' + mouse.x + ', ' + mouse.y + ' ' + getCellCoords(mouse.x, mouse.y));
    return;
  }

  board[cell] = currentPlayer;
  console.log(currentPlayer);

  if(!gameOver){
    if(getDifficulty() == "easy"){
      if(winning(board, huPlayer)){
        msg.textContent = "X's WIN!";
      }
      else if (winning(board, aiPlayer)){
        msg.textContent = "O's WIN!";
      }
      else if (round > 4) {
        msg.textContent = "No winner, it's a tie.";
      }
      round++;

      let arr = avail(board);
      let position = arr[Math.floor(Math.random()*arr.length)];
      board[position] = aiPlayer;
      console.log(board);
      if(winning(board, huPlayer)){
        msg.textContent = "X's WIN!";
      }
      else if (winning(board, aiPlayer)){
        msg.textContent = "O's WIN!";
      }
      else if (round > 4) {
        msg.textContent = "No winner, it's a tie.";
      }

    }
    else if(getDifficulty() == "hard"){

      if(winning(board, currentPlayer)){
        msg.textContent = "X's WIN!";
      }
      else if (round > 4) {
        msg.textContent = "No winner, it's a tie.";
      } else {
        round++;
        var index = minimax(board, aiPlayer).index;
        board[index] = aiPlayer;
        console.log(board);
        console.log(index);
        console.log(iter);
        iter = 0;
        if (winning(board, aiPlayer)) {
            msg.textContent = "O's WIN! Must be a smart computer.";
        } else if (round > 4) {
            msg.textContent = "No winner, it's a tie.";
        }
      }
    }
    else {
      if(winning(board, huPlayer)){
        msg.textContent = "X's WIN!";
      }
      else if (winning(board, aiPlayer)){
        msg.textContent = "O's WIN!";
      }
      else if (round > 7) {
        msg.textContent = "No winner, it's a tie.";
      }
      round++;
      if(currentPlayer == "P"){
        console.log("switch to: C");
        currentPlayer = "C";
      }
      else {
        console.log("switch to P");
        currentPlayer = "P";
      }

    }


    /**
    if(currentPlayer == huPlayer){
      currentPlayer = aiPlayer;
    }
    else if(currentPlayer == aiPlayer){
      currentPlayer == huPlayer;
    }
    **/

  }
}



function reset() {
  round = 0;
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  currentPlayer = huPlayer;
  msg.textContent = "Difficulty level: " + getDifficulty();
}

function minimax(reboard, player) {
  iter++;
  let array = avail(reboard);
  if(iter % 1000 == 0 || iter == 1){
    console.log(iter + ' ' + array + ' / ' + reboard);
  }
  if (winning(reboard, huPlayer)) {
    return {
      score: -10
    };
  } else if (winning(reboard, aiPlayer)) {
    return {
      score: 10
    };
  } else if (array.length === 0) {
    return {
      score: 0
    };
  }

  var moves = [];
  for (var i = 0; i < array.length; i++) {
    var move = {};
    move.index = reboard[array[i]];
    reboard[array[i]] = player;

    if (player == aiPlayer) {
      var g = minimax(reboard, huPlayer);
      move.score = g.score;
    } else {
      var g = minimax(reboard, aiPlayer);
      move.score = g.score;
    }
    reboard[array[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function avail(reboard) {
  return reboard.filter(s => s != "P" && s != "C");
}

// winning combinations
function winning(board, player) {
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
}





function draw () {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawBoard();
  fillBoard();

  function drawBoard() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 10;

    ctx.beginPath();
    ctx.moveTo(cellSize, 0);
    ctx.lineTo(cellSize, canvas.height);
    ctx.stroke();

    ctx.moveTo(2*cellSize, 0);
    ctx.lineTo(2*180, canvas.height);
    ctx.stroke();

    ctx.moveTo(0, cellSize);
    ctx.lineTo(canvas.width, cellSize);
    ctx.stroke();

    ctx.moveTo(0, 2*180);
    ctx.lineTo(canvas.width, 2*180);
    ctx.stroke();
  }

  function fillBoard () {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 25;
    for(let i = 0; i < board.length; i++){
      let coords = getCellCoords(i);

      ctx.save();
      ctx.translate(coords.x + cellSize/2, coords.y + cellSize/2);
      if(board[i] == "P"){
        ctx.strokeStyle = 'pink';
        drawX();
      }
      if(board[i] == "C"){
        ctx.strokeStyle = 'gold';
        drawO();
      }
      ctx.restore();
    }
  }

  function drawX(){
    let lineLength = cellSize/3
    ctx.beginPath();
    ctx.moveTo(-lineLength, -lineLength);
    ctx.lineTo(lineLength, lineLength);
    ctx.moveTo(lineLength, -lineLength);
    ctx.lineTo(-lineLength, lineLength);
    ctx.stroke();
  }

  function drawO() {
    ctx.beginPath();
    ctx.arc(0, 0, cellSize/3, 0, Math.PI*2);
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}

function getCellCoords(cell){
  let x = (cell % 3) * cellSize;
      y = Math.floor(cell/3) * cellSize;

  return {
      'x' : x,
      'y' : y,
  };
}

draw();
