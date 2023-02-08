// CANVAS
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

// Canvas responsive screen size
function resizeCanvas() {
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  context.font = 'bold 25px "Varela Round", sans-serif';
  boxes[0] = {
      x: (canvas.width / 2) - (canvas.width /4),
      y: 0,
      width: (canvas.width / 2)
    };
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// gradient color background 
const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop(0, "rgb(72,210,248, 0.8)");
gradient.addColorStop(0.5, "rgb(11,65,46, 0.8)");

// Helper function for blocks to randomly appear left or right
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
  debris.x = -1; //odd bug, stroke persists, so set this for debris to fall offscreen upon restart
  debris.width = 0;
}
 
canvas.onpointerdown = (event) => {
  if(event.button!==2){ //set for left clicks
    if (mode == 'gameOver'){
      gameoverContainer.style.display = 'none'
      form.style.display = 'block'
      submitted.style.display ='none'
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


// MUSIC
const volumeButton = document.querySelector('.volume')
const volumeSymbol = document.getElementById("volumeSymbol");
const volumeSlider = document.getElementById("volume-slider");

volumeSlider.addEventListener("input", adjustVolume);
volumeButton.addEventListener('click', playMusic)

let audio = new Audio("./assets/Yum_Yum_Island_ Illiyard_Moor.mp3")
audio.loop = true
audio.volume = 0.20

function adjustVolume() {
  audio.volume = volumeSlider.value;
}

function playMusic(){
  if(volumeSlider.classList.contains('hidden')){
    volumeSlider.classList.remove('hidden');
    volumeSymbol.className = "fa-solid fa-volume-high fa-xl";
    volumeButton.style.scale = '85%'
    setTimeout(() => {
      volumeButton.style.removeProperty('scale')
    }, 100);
  } else {
    volumeSlider.classList.add('hidden');
    volumeSymbol.className = "fa-solid fa-volume-xmark fa-xl";
    volumeButton.style.scale = '85%'
    setTimeout(() => {
      volumeButton.style.removeProperty('scale')
    }, 100);
  }

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

// Toggle show/hide/active to smooth out navigation buttons
const infoButton = document.querySelector('.info')
const textBox = document.getElementById("text-box")
infoButton.addEventListener("click", () => {
  textBox.classList.toggle("show");
  infoButton.classList.toggle("active")
  infoButton.style.scale = '85%'
    setTimeout(() => {
      infoButton.style.removeProperty('scale')
  }, 100);
});

// Game over screen
const leaderboardContainer2 = document.querySelector('.leaderboard-container2')
const gameoverContainer = document.querySelector('.gameover-container')
const closeGameover = document.querySelector('.close-gameover')
const closeLeaderboard = document.querySelector('.close-leaderboard')
const score = document.querySelector('.score')

closeGameover.addEventListener('click', closeGameoverContainer)
closeLeaderboard.addEventListener('click', closeLeaderboardContainer)

function closeGameoverContainer (){
  gameoverContainer.style.display = 'none'
}

function closeLeaderboardContainer (){
  leaderboardContainer2.classList.remove('showFlex')
  leaderboardButton.classList.remove("active")
}


// Form submission - name input to server to database
const form = document.querySelector('form')
const nameInput = document.querySelector("input[name='name']")
const submitted = document.querySelector('.submitted')

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const userName = nameInput.value;
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
    console.log(error)
  });
});

// Leaderboard screen
const leaderboardContainer = document.querySelector('.leaderboard-container2')
const leaderboardButton = document.querySelector('.leaderboardButton')

leaderboardButton.addEventListener('click', openLeaderboard)

let page = currentPage

async function openLeaderboard(){
  
  await fetchList(currentPage)

  if (leaderboardButton.classList.contains("active")) {
    leaderboardContainer.classList.toggle("showFlex");
    leaderboardButton.classList.toggle("active")
    leaderboardButton.style.scale = '85%'
    setTimeout(() => {
      leaderboardButton.style.removeProperty('scale')
    }, 100);
    return
  }

  
  
    leaderboardContainer.classList.toggle("showFlex");
    leaderboardButton.classList.toggle("active")
    leaderboardButton.style.scale = '85%'
    setTimeout(() => {
      leaderboardButton.style.removeProperty('scale')
    }, 100);
    // console.log(entries);
  
  
}

// Pagination fetches
// const previousButton = document.querySelector(".previous");
// // previousButton.style.display = currentPage > 1 ? "inline" : "none";
// const nextButton = document.querySelector(".next");
// // nextButton.style.display = currentPage < totalPages ? "inline" : "none";
// const pageButtons = document.getElementsByClassName("page");



// const itemsPerPage = 10;
// const totalPages = Math.ceil(items.length / itemsPerPage);
// const maxPages = 10;
// const currentPage = 1;

// function getPage(){

// }
// The number of items to display per page
var itemsPerPage = 10;

// The total number of pages
var totalPages = 10;

// The maximum number of pages to display in the navigation
var maxPages = 4;

// The current page
var currentPage = 1;

// place this before update to get the correct page number
const paginationButtons = document.querySelectorAll('.pagination')



for (let i = 0; i < paginationButtons.length; i++) {
  paginationButtons[i].addEventListener("click", () => {
    var page = paginationButtons[i].innerHTML;
    if(page==='«'){
      page = currentPage-1
    } else if (page==='»'){
      page = currentPage+1
    }
    fetchList(page);
  });
}

// A function to update the display
function updateDisplay() {
  // Update the navigation
  var previousButton = document.querySelector(".pagination.previous");
  previousButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
  var nextButton = document.querySelector(".pagination.next");
  nextButton.style.visibility = currentPage < totalPages ? "visible" : "hidden";
  var pageButtons = document.querySelectorAll(".pagination.page");

  // Show previous, current, and next page
  var pagesToShow = [];
  if (currentPage === 1) {
    pagesToShow = [currentPage, currentPage + 1, currentPage + 2];
  } else if (currentPage === totalPages) {
    pagesToShow = [currentPage - 2, currentPage - 1, currentPage];
  } else {
    pagesToShow = [currentPage - 1, currentPage, currentPage + 1];
  }

  for (var i = 0; i < pagesToShow.length; i++) {
    var page = pagesToShow[i];
    if (page >= 1 && page <= totalPages) {
      pageButtons[i].style.visibility = "visible";
      pageButtons[i].innerHTML = page;
      if (page === currentPage) {
        pageButtons[i].classList.add("active");
      } else {
        pageButtons[i].classList.remove("active");
      }
    } else {
      pageButtons[i].style.visibility = "hidden";
    }
  }
}

// A function to go to the previous page
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    updateDisplay();
  }
}

// A function to go to the next page
function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    updateDisplay();
  }
}

// A function to go to a specific page
function goToPage(page) {
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    updateDisplay();
  }
}

// Attach the event listeners to the buttons
var previousButton = document.querySelector(".pagination.previous");
previousButton.addEventListener("click", previousPage);
var nextButton = document.querySelector(".pagination.next");
nextButton.addEventListener("click", nextPage);
var pageButtons = document.querySelectorAll(".pagination.page");
for (var i = 0; i < pageButtons.length; i++) {
  var pageButton = pageButtons[i];
  pageButton.addEventListener("click", function() {
    goToPage(parseInt(this.innerHTML));
  });
}

// Initialize the display
updateDisplay();


// fetch with the buttons



async function fetchList (currentPage) {
  await fetch(`/leaderboard/${currentPage}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(result => {
    const entries = result.entries;
    const leaderboardTable = document.querySelector('.leaderboard tbody');
    leaderboardTable.innerHTML = '';
    for(let i = 0; i<10; i++){
      const tr = document.createElement('tr');

      if(entries[i]){
        tr.innerHTML = `
        <td>${currentPage>1?(currentPage-1)*10 + i+1:i+1}</td>
        <td>${entries[i].userName}</td>
        <td>${entries[i].score}</td>
        `;
      leaderboardTable.appendChild(tr);
      } else {
        tr.innerHTML = `
          <td>${currentPage>1?(currentPage-1)*10 + i+1:i+1}</td>
          <td></td>
          <td></td>
        `;
      leaderboardTable.appendChild(tr);
      }

      // if (i >= 10) {
      //   return;
      // }
    };
  })
  .catch(error => {
    console.error("There was a problem with the fetch operation:", error);
  });
}