let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let scrollCounter, cameraY, current, mode, xSpeed;
let ySpeed = 5;
let height = 50;
let boxes = [];



let debris = {
  x: 0,
  width: 0
};

// Set responsive screen size --------------------------------------------------
function resizeCanvas() {
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  context.font = 'bold 25px "Varela Round", sans-serif';
  boxes[0] = {
      x: (canvas.width / 2) - (canvas.width /4), //200 is the width of the box
      y: 0,
      width: (canvas.width / 2)
    };
}
window.addEventListener("resize", resizeCanvas);
// Call the function initially to set the canvas size on page load
resizeCanvas();
// -----------------------------------------------------------------------------

// GRADIENT --------------------------------------------------------------------
let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop(0, "rgb(72,210,248, 0.8)");
gradient.addColorStop(0.5, "rgb(11,65,46, 0.8)");
// -----------------------------------------------------------------------------

const randomLeftOrRight = (left,right) => {
  let num = Math.round(Math.random())
  if(num===1){
    return right
  } else return left
}

function newBox() {
  boxes[current] = {
    x: randomLeftOrRight(0,(canvas.width - boxes[current - 1].width)),
    y: (current+1) * height,
    width: boxes[current - 1].width
  };
}
 
function gameOver() {
  score.innerHTML = `Your score is ${current-1}!`
  gameoverContainer.style.display = 'flex'
  mode = 'gameOver';
  context.font = 'bold 30px "Varela Round", sans-serif';
  // context.fillText('Game over. Click to play again!', canvas.width*0.5, canvas.height*0.4);
  context.textAlign = "center";
  
}
 
function animate() {
  
  if (mode != 'gameOver') {
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 45px "Varela Round", sans-serif';
    context.fillStyle = 'cyan';
    context.strokeStyle = "rgb(44, 45, 45)";
    context.fillText('Score: ' + (current - 1).toString(), canvas.width*0.5, canvas.height*0.25);
    context.lineWidth = 0.1;
    context.strokeText('Score: ' + (current - 1).toString(), canvas.width*0.5, canvas.height*0.25);
    context.textAlign = "center";
    for (let n = 0; n < boxes.length; n++) {
      let box = boxes[n];
      context.fillStyle = gradient;//'rgb(' + n * 16 + ',' + n * 16 + ',' + n * 16 + ')'; style this for changing color with each box
      context.strokeStyle = 'white';
      context.lineWidth = 1;
      context.fillRect(box.x, 600 - box.y + cameraY, box.width, height);
      context.strokeRect(box.x, 600 - box.y + cameraY, box.width, height);
    }
    
    context.fillStyle = '#ff4040';
    context.fillRect(debris.x, 600 - debris.y + cameraY, debris.width, height);
    context.strokeStyle = 'white';
    context.strokeRect(debris.x, 600 - debris.y + cameraY, debris.width, height)
    if (mode == 'bounce') {
      boxes[current].x = boxes[current].x + xSpeed;
      if (xSpeed > 0 && boxes[current].x + boxes[current].width > canvas.width)
        xSpeed = -xSpeed;
      if (xSpeed < 0 && boxes[current].x < 0)
        xSpeed = -xSpeed;
    }
    if (mode == 'fall') {
      boxes[current].y = boxes[current].y - ySpeed;
      if (boxes[current].y == boxes[current - 1].y + height) {
        mode = 'bounce';
        let difference = boxes[current].x - boxes[current - 1].x;
        if (Math.abs(difference) >= boxes[current].width) {
          gameOver();
        }
        debris = {
          y: boxes[current].y,
          width: difference
        };
        if (boxes[current].x > boxes[current - 1].x) {
          boxes[current].width = boxes[current].width - difference;
          debris.x = boxes[current].x + boxes[current].width;
        } else {
          debris.x = boxes[current].x - difference;
          boxes[current].width = boxes[current].width + difference;
          boxes[current].x = boxes[current - 1].x;
        }
        if (xSpeed > 0)
          xSpeed++;
        else
          xSpeed--;
        current++;
        scrollCounter = height;
        newBox();
      }
    }
    debris.y = debris.y - ySpeed;
    if (scrollCounter) {
      cameraY++;
      scrollCounter--;
    }
  }
  window.requestAnimationFrame(animate);
}
 
function restart() {
  boxes.splice(1, boxes.length - 1);
  mode = 'bounce';
  cameraY = 0;
  scrollCounter = 0;
  xSpeed = 2;
  current = 1;
  newBox();
  debris.y = 0;
  debris.x = -1; //odd bug, stroke persist so set this for debris to fall offscreen upon restart
  debris.width = 0;
}
 
canvas.onpointerdown = function(event) {
  if(event.button!==2){
    if (mode == 'gameOver'){
      gameoverContainer.style.display = 'none'
      restart();
    }
    
    else {
    if (mode == 'bounce')
      mode = 'fall';
    }
  }
};
 
restart();
animate();


// Music

let volumeButton = document.querySelector('.volume')
volumeButton.addEventListener('click', playMusic)

let volumeSymbol = document.getElementById("volumeSymbol");

let volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", adjustVolume);

let audio = new Audio("./assets/Yum_Yum_Island_ Illiyard_Moor.mp3")
audio.loop = true // if you want the music to loop

audio.volume = 0.20

function adjustVolume() {
  audio.volume = volumeSlider.value;
}

function playMusic(){
  if(volumeSlider.classList.contains('hidden')){
    volumeSlider.classList.remove('hidden');
    volumeSymbol.className = "fa-solid fa-volume-high fa-xl";
    volumeButton.style.scale = '85%'
    setTimeout(function () {
      volumeButton.style.removeProperty('scale')
  }, 100);
  }else{
    volumeSlider.classList.add('hidden');
    volumeSymbol.className = "fa-solid fa-volume-xmark fa-xl";
    volumeButton.style.scale = '85%'
    setTimeout(function () {
      volumeButton.style.removeProperty('scale')
  }, 100);
  }


  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}


let infoButton = document.querySelector('.info')
let textBox = document.getElementById("text-box")
infoButton.addEventListener("click", function () {
  textBox.classList.toggle("show");
  infoButton.classList.toggle("active")
  infoButton.style.scale = '85%'
    setTimeout(function () {
      infoButton.style.removeProperty('scale')
  }, 100);
});

// infoButton.addEventListener("mouseover", function () {
//   textBox.classList.remove("hidden");
// });

// textBox.addEventListener("mouseout", function () {
//   textBox.classList.add("hidden");
// });

// textBox.addEventListener("click", function () {
//   textBox.classList.add("hidden");
// });

let gameoverContainer = document.querySelector('.gameover-container')
let closeLeaderboard = document.querySelector('.close-leaderboard')
let score = document.querySelector('.score')

closeLeaderboard.addEventListener('click', closeBoard)

function closeBoard (){
  gameoverContainer.style.display = 'none'
}


// FORM SUBMISSION

document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault();
  const userName = document.querySelector("input[name='name']").value;
  const score = current-2;
  const data = { userName, score };

  fetch("/leaderboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      // handle the response from the server here
      form.style.display = 'none'
      submitted.style.display ='block'
      
    })
    .catch(error => {
      // handle any errors here
    });
});


let submitted = document.querySelector('.submitted')

let form = document.querySelector('form')

let leaderboardContainer = document.querySelector('.leaderboard-container2')

let leaderboardButton = document.querySelector('.leaderboardButton')

leaderboardButton.addEventListener('click', openLeaderboard)

function openLeaderboard(){

  
  leaderboardContainer.classList.toggle("showFlex");
  leaderboardButton.classList.toggle("active")
  leaderboardButton.style.scale = '85%'
    setTimeout(function () {
      leaderboardButton.style.removeProperty('scale')
  }, 100);
}