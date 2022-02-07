//    Table of content:
// 1) Starting screen DOM
//    
// 2) Starting Game functions
//    
// 3) Main Game flow functions
//
// 4) Showing Round and Game Win/Draw/Game_End functions
//
// 5) Helper functions

// 1) Starting screen DOM
// Gameoboard Object
const Gameboard = {
  actualGameboard: ["", "", "", "", "", "" ,"", "", ""]
};
// Assign global DOM-Elements
const header = document.getElementById("header");
const leftSide = document.getElementById("PlayerOneWrapperDiv");
const rightSide = document.getElementById("PlayerTwoWrapperDiv");
const gameboard = document.getElementById("gameboardDiv");
const roundsInput = document.getElementById("RoundsInput");
const kiInput = document.getElementById("KIInput");
const StartButton = document.getElementById("StartButton");
// Set Player names to names which where used before, if there are names
if(localStorage.getItem("PlayerOneName")){document.getElementById("OneNameInput").value = localStorage.getItem("PlayerOneName")};
if(localStorage.getItem("PlayerTwoName")){document.getElementById("TwoNameInput").value = localStorage.getItem("PlayerTwoName")};
// Assgin Start Game Button
StartButton.addEventListener("click", ()=> StartGame());
// Event Listener for correct KI Naming
document.getElementById("KIInput").addEventListener("change", ()=>{
let newName = document.getElementById("KIInput").value;
// If play against player is selected, dont show "no" on Player two inout field and dont write it in localStorage
if(newName != "no"){
localStorage.setItem("PlayerTwoName", newName);
document.getElementById("TwoNameInput").value = newName;}
}
);

// 2) Starting Game functions
// Function to get the game settings
function GetReadyForGame(){
// Getting names & display it
// Player 1
const PlayerOneElement = document.createElement("h1");
let PlayerOneName = document.getElementById("OneNameInput").value;
PlayerOneElement.setAttribute("id", "PlayerOneNameH1");
localStorage.setItem("PlayerOneName", PlayerOneName);
PlayerOneElement.innerText = PlayerOneName;
PlayerOneElement.style = "width: 100%"
leftSide.appendChild(PlayerOneElement);
//Player 2
const PlayerTwoElement = document.createElement("h1");
PlayerTwoElement.setAttribute("id", "PlayerTwoNameH1");
let PlayerTwoName = document.getElementById("TwoNameInput").value;
localStorage.setItem("PlayerTwoName", PlayerTwoName);
PlayerTwoElement.innerText = PlayerTwoName;
PlayerTwoElement.style = "width: 100%"
rightSide.appendChild(PlayerTwoElement);
// Getting Game Mode Settings
let RoundsMax = roundsInput.value;
let KI = kiInput.value;
let roundCounter = 1;
let playerOneWins = 0;
let playerTwoWins = 0;
let isGameOver = false;
let playerOneOnTurn = true;
// Remove header & sidebar elements
header.classList.add("ClassNotVisible");
const sidebar = document.getElementsByClassName("ClassSidebar");
for (let element of sidebar)element.setAttribute("style", "display: none;");
// Return settings to GameSettings variable in MainGame
return {PlayerOneName, PlayerTwoName, roundCounter, RoundsMax, playerOneWins, playerTwoWins, KI, isGameOver, playerOneOnTurn};
};
// Start game function
function StartGame(){
Countdown();
// Show "Your turn elements"
pushTurnDisplayElements();
//Get Game setting and combine it with the Gamebooard object (to have actual Gameboard and Game settings in one object)
const GameSettings = GetReadyForGame();
Gameboard.GameSettings = GameSettings;
// Get value for actual and max rounds, create DOM Elements and push it to DOM
const roundsHeader = document.createElement("h3");
roundsHeader.innerText = "Round";
leftSide.appendChild(roundsHeader);
const roundsDisplay = document.createElement("h3");
roundsDisplay.setAttribute("id", "roundCounter");
roundsDisplay.innerText = `${GameSettings.roundCounter} of ${GameSettings.RoundsMax}`;
leftSide.appendChild(roundsDisplay);
let newKIName = document.getElementById("KIInput").value;
if(newKIName != "no"){
localStorage.setItem("PlayerTwoName", newKIName);
document.getElementById("TwoNameInput").value = newKIName;
document.getElementById("PlayerTwoNameH1").innerText = newKIName;}
// Start new Game 
if(GameSettings.KI === "no"){Game1vs1("Player 1")} else PlayKI("Player 1");
}
// 3) Main Game functions
// KI game controll function
function PlayKI(startingPlayer){
// remove header
header.classList.add("ClassNotVisible");
// Make sure to have a new Gameboard
newGameboard();
// Start new Game against correct KI
if (startingPlayer ="Player 1"){KIGamePlayersTurn()}else {KI()};
} 
// KI Is on turn
function KI(){
// If KI starts and game is not over, change turn display
if(Gameboard.GameSettings.playerOneOnTurn === false && Gameboard.GameSettings.isGameOver === false){turnDisplay(false)};
// If there is the thinking function element from the last round, remove it
const playerTwoDiv = document.getElementById("PlayerTwoNameH1");
if(document.getElementById("dot")){document.getElementById("dot").remove()};
if(playerTwoDiv){
const dotOne = document.createElement("h1");
dotOne.setAttribute("id", "dot");
dotOne.innerText = ".";
playerTwoDiv.appendChild(dotOne);}
// Check if game is not over. If it is, stop.
if (Gameboard.GameSettings.isGameOver == true)return;
// Save and show correct KI Name

// Try to get a valid cell, if not try again, else invoke next function with valid cell number to finish the placement
let randomCell;
if(Gameboard.GameSettings.KI === "KI Easy")randomCell = getKIEasyValidCell();
else if(Gameboard.GameSettings.KI === "KI Normal")randomCell = getKINormalValidCell();
else if(Gameboard.GameSettings.KI === "KI Heavy")randomCell = getKIHeavyValidCell();
if(randomCell != false  && randomCell != undefined){KIisThinking(randomCell)}else{KI()};
}
// Let KI Thinking function
function KIisThinking(cell){
// Get random int which is not 0 and mulitplicate it with 1000 to get the variable time for the thinking function
let randomNumber = getRandomInt(6);
if(randomNumber === 0){randomNumber = getRandomInt(6)}
randomNumber *= 1000;
// Get the right DOM Element
const dotOne = document.getElementById("dot");
// Set interval so as long as the thinking lasts it repeats settintg dots again and again....
const thinking = setInterval(()=>{
const dot1 = setTimeout(()=>{
  dotOne.innerText = "."
}, 250);
const dot2 = setTimeout(()=>{
  dotOne.innerText = ". .";
}, 500);
const dot3 = setTimeout(()=>{
  dotOne.innerText = ".....";
}, 1000);
}, 1000);
// Invoke finish...
finishThinking();
//... which stops the dots setting, remove them from DOM and invoke next function to place the mark -
// all after a random time between 1 and 5 seconds (random thinking time)
function finishThinking (){
 const finishedThinking = setTimeout(function(){
  KIPlaceMarker(cell)
  clearInterval(thinking);
  dotOne.remove();
  }, randomNumber);} 
}
// KI placement function
function KIPlaceMarker(playedCell){
 turnDisplay(true);
// Push the placement in the Gameboard array
Gameboard.actualGameboard[playedCell] = "o";
// Get the right cell in DOM
let playedCellDiv = document.getElementById(`Cell${playedCell}`);
// Get a random Marker and place it to the played cell
let randomMarker = getRandomInt(3);
playedCellDiv.classList.add(`Omarker${randomMarker}`);
playedCellDiv.classList.add("ClassMarkOPlayed");
// Proof if the round is won
let winValidation = WinValidation();
if(winValidation === true){
  // If it is won, invoke winDisplay and proof if game is won
  winDisplay(Gameboard.GameSettings.PlayerTwoName, Gameboard.GameSettings.PlayerOneName); 
  Gameboard.GameSettings.playerOneOnTurn = true
} else{
  // If it isn't won, player is on turn
  // Play audio effect
  let audioPlacement = new Audio("./Audio/freesound_com/OneHits/notyermom__chirp-shirp.wav");
  audioPlacement.play();
  Gameboard.GameSettings.playerOneOnTurn = true
  KIGamePlayersTurn()}
  return
};
// KI Easy algorythmus
function getKIEasyValidCell (){
// Get new turn, if the cell is free return the free cell number, else return false
// Get actual state of the Gameboard
let actualState = Gameboard.actualGameboard;
let random = getRandomInt(9);
if(actualState[random] === ""){return random} 
else {false}
}
// KI Normal algorythmus
function getKINormalValidCell(){
// console.log("KI Normal algorhytmus");
// Get actual state of the Gameboard
let actualState = Gameboard.actualGameboard;
// Get random exit cell
let randomExit = longRandomInt(10);
// Proof for first placement and if, return random cell
let firstPlacing = actualState.indexOf("o");
if(firstPlacing === -1){
// console.log("No "o" marker on gameboard, placing random number");
let random = getRandomInt(9);
if(actualState[random] === ""){return random}} 
// If no first placement, invoke KI Normal algorythmus
let normalCell = getKINormalCell();
// Return cell number for placing
if (getKINormalCell != false)return normalCell
else
// If nothing could return, return first free cell
console.log("random exit" + randomExit);
return randomExit }
// Heart of the KI Normal algorythmus
function getKINormalCell(){
let actualState = Gameboard.actualGameboard;
// First CORE Function fr KI Normal is getRowsOnGameboard
let pretending = getRowsOnGameboard("x");
let attacking = getRowsOnGameboard("o");
if(pretending != false){//console.log("pretending with cell..." + pretending);
return pretending}
if(attacking != false){//console.log("attacking with cell..." +  attacking);
return attacking}
// This is second CORE Function of KI Normal
// Get an  array with all placed o cell numbers 
let arrayPlacedCells = findCells("o", actualState);
// Get the played marks out of the array
let firstMark = arrayPlacedCells[0];
let secondMark = arrayPlacedCells[1];
let thirdMark = arrayPlacedCells[2];
let fourthMark = arrayPlacedCells[3];
/// Look if there are two "o" placed after another...
let calculatedFirst = getPromisingRow(firstMark, secondMark);
let calculatedSecond = getPromisingRow(secondMark, thirdMark);
let calculatedThird = getPromisingRow(thirdMark, fourthMark);
// If they are...
let finisher = false;
if(calculatedFirst === -1){finisher = finishRows(firstMark, secondMark)};
if(calculatedSecond === -1){finisher = finishRows(secondMark, thirdMark)};
if(calculatedThird === -1){finisher = finishRows(thirdMark, fourthMark)};
if(finisher != false) return finisher
// ...try fullfill the row downwards...
function finishRows(firstCell, secondCell){
  if (firstCell === 1 || firstCell === 4 || firstCell === 7){
    let rowFinish = firstCell - 1;
    console.log("downwards finish");
    if(actualState[rowFinish] === "") return rowFinish; 
  } // ...and upwards...
    else if (firstCell === 0 || firstCell=== 3 || firstCell === 6){
      let rowFinish = secondCell + 1;
      console.log("upwards finish");
      if(actualState[rowFinish] === "") return rowFinish;
  }
 else return false
}
let validRandomNumber = longRandomInt(10);
// If nothing was possible, return false
return validRandomNumber;};


// Function for player placement in KI Game
function KIGamePlayersTurn(newGame){
if(Gameboard.GameSettings.playerOneOnTurn === true){turnDisplay(true)}; 
// Check if game is not over
if (Gameboard.GameSettings.isGameOver == true)return;
// Make sure to get new Gameboard if needed
if (newGame === "newGame"){newGameboard()};
// Get all cells
let actualMarksArray = document.getElementsByClassName("ClassGameboardCells");
// Add event listener
for (let marks of actualMarksArray)marks.addEventListener("click", ()=>{
//If player can place, do it
if(Gameboard.GameSettings.playerOneOnTurn === true){
// Get the clicked cell, push information to Gameboard array and change the cell style
let cell = marks.getAttribute("id");
let playedCellNumber = cell[4];
if(Gameboard.actualGameboard[playedCellNumber] === ""){
Gameboard.actualGameboard[playedCellNumber] = "x";
let randomMarker = getRandomInt(3);
marks.classList.add(`Xmarker${randomMarker}`);
marks.classList.add("ClassMarkXPlayed");
// Play audio effect
let audioPlacement = new Audio("./Audio/freesound_com/OneHits/garuda1982__plop-sound-effect.wav");
audioPlacement.play();
// Proof if the game is won
let winVal = WinValidation();
if(winVal === true){
  winDisplay(Gameboard.GameSettings.PlayerOneName, Gameboard.GameSettings.PlayerTwoName); 
  Gameboard.GameSettings.playerOneOnTurn = false;
  KI();
}else {
  Gameboard.GameSettings.playerOneOnTurn = false;
  KI();
}}}})}; 

// Game flow for Player vs Player
function Game1vs1(start){
// Remove header
header.classList.add("ClassNotVisible");
// Proof if Game is over
if (Gameboard.GameSettings.isGameOver === true)return;
// Proof who is starting
if (start === "Player 1"){Gameboard.GameSettings.playerOneOnTurn === true; turnDisplay(true);} 
  else {Gameboard.GameSettings.playerOneOnTurn === false; turnDisplay(false);}
// 1vs1 Placing part
let actualMarksArray = document.getElementsByClassName("ClassGameboardCells");
for (let marks of actualMarksArray)marks.addEventListener("click", ()=>{
// If Player 1 is on turn
if(Gameboard.GameSettings.playerOneOnTurn === true){
// Get clickec cell
let cell = marks.getAttribute("id");
let playedCellNumber = cell[4];
// if it is free, mark it
if(Gameboard.actualGameboard[playedCellNumber] === ""){
Gameboard.actualGameboard[playedCellNumber] = "x";
let randomMarker = getRandomInt(3);
marks.classList.add(`Xmarker${randomMarker}`);
marks.classList.add("ClassMarkXPlayed");
// Set Player 2 is on next turn
Gameboard.GameSettings.playerOneOnTurn = false;
// Proof if the game is won
  let winVal = WinValidation();
  if(winVal === false){
    // Play audio effect
    let audioPlacement = new Audio("./Audio/freesound_com/OneHits/garuda1982__plop-sound-effect.wav");
    audioPlacement.play();
    turnDisplay(false);}
    if(winVal === true){
      winDisplay(Gameboard.GameSettings.PlayerOneName, Gameboard.GameSettings.PlayerTwoName); 
    }
}} // If Player 2 is on turn
else if(Gameboard.GameSettings.playerOneOnTurn === false){
// Get played cell
let cell = marks.getAttribute("id");
let playedCellNumber = cell[4];
// Proof is free and mark it
if(Gameboard.actualGameboard[playedCellNumber] === ""){
Gameboard.actualGameboard[playedCellNumber] = "o";
let randomMarker = getRandomInt(3);
marks.classList.add(`Omarker${randomMarker}`);
marks.classList.add("ClassMarkOPlayed");true;
// PLayer 1 is on next turn
Gameboard.GameSettings.playerOneOnTurn = true;
// Proof if the game is won
let winVal = WinValidation();
if(winVal === false){
  // Play audio effect
  let audioPlacement = new Audio("./Audio/freesound_com/OneHits/notyermom__chirp-shirp.wav");
  audioPlacement.play();
  turnDisplay(true);}
  if(winVal === true){
    winDisplay(Gameboard.GameSettings.PlayerTwoName, Gameboard.GameSettings.PlayerOneName); 
};};};});};
// Win Validation Function 
function WinValidation(){
// check for round draw
let draw = Gameboard.actualGameboard.indexOf("");
// Player 1 Validation
if     (Gameboard.actualGameboard[0] === "x" && Gameboard.actualGameboard[1] === "x" && Gameboard.actualGameboard[2] === "x"){return true}
else if(Gameboard.actualGameboard[3] === "x" && Gameboard.actualGameboard[4] === "x" && Gameboard.actualGameboard[5] === "x"){return true}
else if(Gameboard.actualGameboard[6] === "x" && Gameboard.actualGameboard[7] === "x" && Gameboard.actualGameboard[8] === "x"){return true}
else if(Gameboard.actualGameboard[0] === "x" && Gameboard.actualGameboard[3] === "x" && Gameboard.actualGameboard[6] === "x"){return true}
else if(Gameboard.actualGameboard[1] === "x" && Gameboard.actualGameboard[4] === "x" && Gameboard.actualGameboard[7] === "x"){return true}
else if(Gameboard.actualGameboard[2] === "x" && Gameboard.actualGameboard[5] === "x" && Gameboard.actualGameboard[8] === "x"){return true}
else if(Gameboard.actualGameboard[0] === "x" && Gameboard.actualGameboard[4] === "x" && Gameboard.actualGameboard[8] === "x"){return true}
else if(Gameboard.actualGameboard[2] === "x" && Gameboard.actualGameboard[4] === "x" && Gameboard.actualGameboard[6] === "x"){return true}
// Player 2 Validation
else if(Gameboard.actualGameboard[0] === "o" && Gameboard.actualGameboard[1] === "o" && Gameboard.actualGameboard[2] === "o"){return true}
else if(Gameboard.actualGameboard[3] === "o" && Gameboard.actualGameboard[4] === "o" && Gameboard.actualGameboard[5] === "o"){return true}
else if(Gameboard.actualGameboard[6] === "o" && Gameboard.actualGameboard[7] === "o" && Gameboard.actualGameboard[8] === "o"){return true}
else if(Gameboard.actualGameboard[0] === "o" && Gameboard.actualGameboard[3] === "o" && Gameboard.actualGameboard[6] === "o"){return true}
else if(Gameboard.actualGameboard[1] === "o" && Gameboard.actualGameboard[4] === "o" && Gameboard.actualGameboard[7] === "o"){return true}
else if(Gameboard.actualGameboard[2] === "o" && Gameboard.actualGameboard[5] === "o" && Gameboard.actualGameboard[8] === "o"){return true}
else if(Gameboard.actualGameboard[0] === "o" && Gameboard.actualGameboard[4] === "o" && Gameboard.actualGameboard[8] === "o"){return true}
else if(Gameboard.actualGameboard[2] === "o" && Gameboard.actualGameboard[4] === "o" && Gameboard.actualGameboard[6] === "o"){return true}
else if(
// If the last placement invoked no winning, check for draw: If indexOf returns -1, ther is no free (means no "" ) cell in the actual gameboard array
  draw === -1){drawDisplay()}
// If no winner and no round draw, return false (go ahead with next placement)
else return false
};
// 4) Showing Round and Game Win/Draw/Game_End functions
// If someone won, display it, start next round or start screen function
function winDisplay(winner, loser){
// Get actual Game settings
const RoundCounter = Gameboard.GameSettings.roundCounter
const RoundsMax = Gameboard.GameSettings.RoundsMax;
const playerOneWins =  Gameboard.GameSettings.playerOneWins;
const playerTwoWins = Gameboard.GameSettings.playerTwoWins;
const PlayerOneName = Gameboard.GameSettings.PlayerOneName;
const PlayerTwoName = Gameboard.GameSettings.PlayerTwoName;
const isPlayerOneOnTurn  = Gameboard.GameSettings.isPlayerOneOnTurn;
const isGameOver = Gameboard.GameSettings.isGameOver;
if(winner === PlayerOneName){
  // If Player 1 wins the round, update Game settings 
  let NewplayerOneWins = playerOneWins
  NewplayerOneWins++;
  Gameboard.GameSettings.playerOneWins = NewplayerOneWins;
}else { 
  // If Player 2 wins the round, update Game settings
  let NewplayerTwoWins = playerTwoWins;
  NewplayerTwoWins++;
  Gameboard.GameSettings.playerTwoWins = NewplayerTwoWins;
}
// Check for last round, if was show up game end with the correct variables....
if (RoundCounter == RoundsMax){
  // If Player one have more games won, push this
  if(Gameboard.GameSettings.playerOneWins > Gameboard.GameSettings.playerTwoWins){gameEnd(PlayerOneName, PlayerTwoName)}
  // If the players have the same wins, push draw
  else if (Gameboard.GameSettings.playerOneWins === Gameboard.GameSettings.playerTwoWins){gameEnd(PlayerOneName, PlayerTwoName, "Draw")}
  // Else Player 2 have won
    else {gameEnd(PlayerTwoName, PlayerOneName)};
} // If it wasn't the last round, show go ahead
else {
// As long as there are rounds open increase rounds and update round counter DIV
let newRoundsCounter = RoundCounter;
newRoundsCounter++;
Gameboard.GameSettings.roundCounter = newRoundsCounter;
const roundDisplay = document.getElementById("roundCounter");
roundDisplay.innerText = `${Gameboard.GameSettings.roundCounter} of ${RoundsMax}`;
// Confirm Round WIN window with rounds and name of the winner
if(confirm(`Wow, ${winner} have won the ${RoundCounter} Round against ${loser}!

Click confirm to start the countdown for the next round or click cancel to go to start screen!`)
== true){
// Delet marks from gameboard and set back actual Gameboard
newGameboard();
// Player clicked confirm starts countdown function
Countdown();
if(Gameboard.GameSettings.KI != "no" && winner === PlayerTwoName){KIGamePlayersTurn()};
}// If player clicked cancel go to start screen
else
document.location.reload();
};};
// Show a round draw
function drawDisplay(){
// Get actual Game settings
const RoundCounter = Gameboard.GameSettings.roundCounter
const RoundsMax = Gameboard.GameSettings.RoundsMax;
const PlayerOneName = Gameboard.GameSettings.PlayerOneName;
const PlayerTwoName = Gameboard.GameSettings.PlayerTwoName;
// Increase rounds with no Player/KI wins
let newRoundsCounter = RoundCounter;
newRoundsCounter++;
Gameboard.GameSettings.roundCounter = newRoundsCounter;
// Check for last round, if was show up game end with the correct variables....
if (RoundCounter == RoundsMax){
  // If Player one have more games won, push this
  if(Gameboard.GameSettings.playerOneWins > Gameboard.GameSettings.playerTwoWins){gameEnd(PlayerOneName, PlayerTwoName)}
  // If the players have the same wins, push draw
  else if (Gameboard.GameSettings.playerOneWins === Gameboard.GameSettings.playerTwoWins){gameEnd(PlayerOneName, PlayerTwoName, "Draw")}
  // Else Player 2 have won
    else {gameEnd(PlayerTwoName, PlayerOneName)};
} // If it wasn't the last round, show go ahead
else {
// As long as there are rounds open increase rounds and update round counter DIV
const roundDisplay = document.getElementById("roundCounter");
roundDisplay.innerText = `${Gameboard.GameSettings.roundCounter} of ${RoundsMax}`;
// Confirm round Draw window with rounds and name of the winner
if(confirm(`It's a draw in ${RoundCounter} Round !

Click confirm to start the countdown for the next round or click cancel to go to start screen!`)
=== true){
// If confirmed,...
// Delet marks from gameboard and set back actual Gameboard
newGameboard();
// Player clicked confirm starts async countdown function
Countdown();
}// If player clicked cancel go to start screen
else 
document.location.reload();
};
};
// Game end function
function gameEnd(winner, loser, draw){
// Set isGameOver to true
Gameboard.GameSettings.isGameOver = true;
let wins1 = Gameboard.GameSettings.playerOneWins;
let wins2 = Gameboard.GameSettings.playerTwoWins;
// If it is a dráw....
if(draw === "Draw"){
// Play audio effect
let audioPlacement = new Audio("./Audio/freesound_com/simon-lacelle__ba-da-dum.wav");
audioPlacement.play();
// Create Game Draw Header
const congratulationsHeader = document.createElement("h1");
congratulationsHeader.innerText = `Uhhhh! DRAW! 
${wins1} to ${wins2}

`;
// Create Game Draw Text
const congratulationsText = document.createElement("h3");
congratulationsText.innerText= `Are ${winner} & ${loser} same tough?





Click "New Game" to go to start screen and find it out!.`;
// Create Game Draw Button
const winButton = document.createElement("button");
winButton.textContent = "Play new Game!";
winButton.classList.add("ClassWinButton");
// Some DOM Manipulation
header.remove();
leftSide.remove();
rightSide.remove();
gameboard.remove();
// Push text to DOM and some manipulations
const mainWrapper = document.getElementById("mainWrapper");
const gameWonDiv = document.createElement("div");
gameWonDiv.classList.add("ClassWon");
winButton.addEventListener("click", ()=> document.location.reload());
mainWrapper.appendChild(gameWonDiv);
gameWonDiv.appendChild(congratulationsHeader);
gameWonDiv.appendChild(congratulationsText);
gameWonDiv.appendChild(winButton);
} else if (Gameboard.GameSettings.KI === "no" || Gameboard.GameSettings.KI === "yes" && winner === Gameboard.GameSettings.PlayerOneName) {
// Play audio effect
let audioPlacement = new Audio("./Audio/freesound_com/klankbeeld__choir-sing-a-final-01.wav");
audioPlacement.play();
  // Create Game Won Header
const congratulationsHeader = document.createElement("h1");
congratulationsHeader.innerText = `Congratulations ${winner}!




You won the game against ${loser} with ${wins1} to ${wins2} !

`;
localStorage.setItem("playerTwoWins", 0);
const congratulationsText = document.createElement("h3");
congratulationsText.innerText= `Click "New Game" to go to start screen.`; 
const winButton = document.createElement("button");
winButton.textContent = "Play new Game!";
winButton.classList.add("ClassWinButton");
// Some DOM Manipulation
header.remove();
leftSide.remove();
rightSide.remove();
gameboard.remove();
// Push text to DOM
const mainWrapper = document.getElementById("mainWrapper");
const gameWonDiv = document.createElement("div");
gameWonDiv.classList.add("ClassWon");
winButton.addEventListener("click", ()=> document.location.reload());
mainWrapper.appendChild(gameWonDiv);
gameWonDiv.appendChild(congratulationsHeader);
gameWonDiv.appendChild(congratulationsText);
gameWonDiv.appendChild(winButton);
} else {
  // Play audio effect
let audioPlacement = new Audio("./Audio/freesound_com/florianreichelt__fail-sound-effect-accoustic-guitar.wav");
audioPlacement.play();
// Create Player lost against CPU Header
const congratulationsHeader = document.createElement("h1");
congratulationsHeader.innerText = `Ohhh ${loser}!



You lost the game against ${winner} with ${wins1} to ${wins2} !

`;
localStorage.setItem("playerTwoWins", 0);
const congratulationsText = document.createElement("h3");
congratulationsText.innerText= `Try it again!



Click "New Game" to go to start screen.`; 
const winButton = document.createElement("button");
winButton.textContent = "Play new Game!";
winButton.classList.add("ClassWinButton");
// Some DOM Manipulation
header.remove();
leftSide.remove();
rightSide.remove();
gameboard.remove();
// Push text to DOM
const mainWrapper = document.getElementById("mainWrapper");
const gameWonDiv = document.createElement("div");
gameWonDiv.classList.add("ClassWon");
winButton.addEventListener("click", ()=> document.location.reload());
mainWrapper.appendChild(gameWonDiv);
gameWonDiv.appendChild(congratulationsHeader);
gameWonDiv.appendChild(congratulationsText);
gameWonDiv.appendChild(winButton);
}
}
// Function to show the countdown
function Countdown(isKIgame){
  // Play audio effect
let audioPlacement = new Audio("./Audio/JeopardyThemeSong .mp3");
audioPlacement.play();
// Manipulate DOM and get Countdown images
header.classList.add("ClassHidden");
leftSide.classList.add("ClassHidden");
gameboard.classList.add("ClassHidden");
rightSide.classList.add("ClassHidden");
const countdown3 = document.createElement("img");
const countdown2 = document.createElement("img");
const countdown1 = document.createElement("img");
const go  = document.createElement("img");
countdown3.setAttribute("src", "./Icons/Countdown/3fingers.svg");
countdown3.classList.add("Countdown");
countdown2.setAttribute("src", "./Icons/Countdown/2fingers.svg");
countdown2.classList.add("Countdown");
countdown1.setAttribute("src", "./Icons/Countdown/1finger.svg");
countdown1.classList.add("Countdown");
go.setAttribute("src", "./Icons/Countdown/go.svg");
go.classList.add("Countdown");
const mainWrapper = document.getElementById("mainWrapper");
mainWrapper.appendChild(countdown3);
// Timeout Part
const three = setTimeout(function(){
  countdown3.remove();
  mainWrapper.appendChild(countdown2);
  }, 1000);
  const two  = setTimeout(function(){
    countdown2.remove();
    mainWrapper.appendChild(countdown1);
    }, 2000);
    const one = setTimeout(function(){
      countdown1.remove();
      mainWrapper.appendChild(go);
      }, 3000);
      const start = setTimeout(function(){
        go.remove();
        header.classList.remove("ClassHidden");
        leftSide.classList.remove("ClassHidden");
        gameboard.classList.remove("ClassHidden");
        rightSide.classList.remove("ClassHidden");
        audioPlacement.pause();
        audioPlacement.currentTime = 0;
        }, 4000);
        if(isKIgame === "yes"){PlayKI()};
      }
// 5) Helper functions
// Helper function to reset the Gameboard
function newGameboard(){
let actualMarksArray = document.getElementsByClassName("ClassGameboardCells");
for (let marks of actualMarksArray){
marks.classList.remove("Omarker0");
marks.classList.remove("Omarker1");
marks.classList.remove("Omarker2");
marks.classList.remove("Omarker3");
marks.classList.remove("Xmarker0");
marks.classList.remove("Xmarker1");
marks.classList.remove("Xmarker2");
marks.classList.remove("Xmarker3");
marks.classList.remove("ClassMarkXPlayed");
marks.classList.remove("ClassMarkOPlayed");
Gameboard.actualGameboard = ["", "", "", "", "", "" ,"", "", ""]; 
}};  
// Helper function to show elements for which player can place
function pushTurnDisplayElements(whoStarts){
// Set turn Display elements for turn display function
const turnLeft = document.createElement("h3");
turnLeft.innerText = "You're turn...";
turnLeft.classList.add("ClassNotVisible");
turnLeft.setAttribute("id", "turnLeft");
leftSide.appendChild(turnLeft);
const turnRight = document.createElement("h3");
turnRight.innerText = "You're turn...";
turnRight.classList.add("ClassNotVisible");
turnRight.setAttribute("id", "turnRight");
rightSide.appendChild(turnRight);
}
// Helper function to turn elements for which player can place
function turnDisplay(playersTurn){
const turnLeft = document.getElementById("turnLeft");
const turnRight = document.getElementById("turnRight");
if(playersTurn === true && Gameboard.GameSettings.isGameOver === false){turnLeft.classList.remove("ClassNotVisible"); turnRight.classList.add("ClassNotVisible")} else {turnRight.classList.remove("ClassNotVisible"); turnLeft.classList.add("ClassNotVisible")};                   
};
// Game-Infobox Icon with Event-Listener 
const infoboxIcon = document.getElementById("infoIcon");
infoboxIcon.classList.add("ClassInfoboxIcon");
const infoText = document.getElementById("gameInfoTextP");
infoText.addEventListener("click", gameInfo);
function gameInfo(){
confirm(`                                   
                                  Tic Tac Toe
                                  Game-Rules

1) Player 1 starts with placing the first marker. If he/she is finished, Player 2 is on turn.
2) Players only can place markers on free cells.
3) The first Player who get 3 marks in a row (horizontal, vertical or diagonal) wins the round.
4) The loser of the round starts the next round (makes it harder to dominate the game).
5) The winner of the Game is the Player with more "Round-Wins".

                                    Credits:
The programming (HTML, CSS, Javascript) of this Game was a project during the https://www.theodinproject.com/
Online-Course. You find more of my projects here:
https://stefanbartl.github.io/StefanBartl_Portfolio/
There is also a contact possibility.
If you are interested in the code, you'll find it here:
https://github.com/StefanBartl/Tic-Tac-Toe
The code is well commented.
`)};  
// Returns a random numbers
function getRandomInt(max) {
return Math.floor(Math.random() * max);
};
// Returns a random number which is free on actual Gameboard
function longRandomInt(a){
actualState = Gameboard.actualGameboard;
let number = getRandomInt(a);
if(actualState[number] === ""){
return number
} else longRandomInt(a);
}
// KI Normal helping functions
// Helper function to get array with all indexes of placed markers
function findCells(marker, gameboard){
  let results = [];
  for(let i = 0; i < gameboard.length; i++){
    if(gameboard[i] === marker)results.push(i);
  }
  return results;
}
// Helper functions for getting rows
function getPromisingRow(a, b){
  let minusRow = a - b;
  return minusRow
}
// KI Normal CORE Functionality
function getRowsOnGameboard(a){
  let actualState = Gameboard.actualGameboard;
// If they are diagonal possibilties, try to pretend or take them
if (actualState[0] === a && actualState[4] === a && actualState[8] === ""){
  //console.log("1.diagonal...");
  return 8
} 
else if (actualState[0] === a && actualState[8] === a && actualState[4] === ""){
  //console.log("2.diagonal...");
  return 4
} 
else if (actualState[5] === a && actualState[8] === a && actualState[0] === ""){
  //console.log("3.diagonal...");
  return 0
} 
else if (actualState[2] === a && actualState[4] === a && actualState[6] === ""){
  //console.log("4.diagonal...");
  return 6
} 
else if (actualState[2] === a && actualState[6] === a && actualState[4] === ""){
  //console.log("5.diagonal...");
  return 4
} 
else if (actualState[4] === a && actualState[6] === a && actualState[2] === ""){
  //console.log("6.diagonal...");
  return 2
} // horizontal possibilities
else if (actualState[0] === a && actualState[3] === a && actualState[6] === ""){
  //console.log("1.horizontal...");
  return 6
}
else if (actualState[3] === a && actualState[6] === a && actualState[0] === ""){
  //console.log("2.horizontal...");
  return 0
}
else if (actualState[1] === a && actualState[4] === a && actualState[7] === ""){
  //console.log("3.horizontal...");
  return 7
}
else if (actualState[4] === a && actualState[7] === a && actualState[1] === ""){
  //console.log("4.horizontal...");
  return 1
}
else if (actualState[2] === a && actualState[5] === a && actualState[8] === ""){
  //console.log("5.horizontal...");
  return 8
}
else if (actualState[5] === a && actualState[8] === a && actualState[2] === ""){
  //console.log("6.horizontal...");
  return 2
} // vertical possibilities
else if (actualState[0] === a && actualState[1] === a && actualState[2] === ""){
  //console.log("1.vertical...");
  return 2
}
else if (actualState[1] === a && actualState[2] === a && actualState[0] === ""){
  //console.log("2.vertical...");
  return 0
}
else if (actualState[3] === a && actualState[4] === a && actualState[5] === ""){
  //console.log("3.vertical...");
  return 5
}
else if (actualState[4] === a && actualState[5] === a && actualState[3] === ""){
  //console.log("4.vertical...");
  return 3
}
else if (actualState[6] === a && actualState[7] === a && actualState[8] === ""){
  //console.log("5.vertical...");
  return 8
}
else if (actualState[7] === a && actualState[8] === a && actualState[6] === ""){
  //console.log("6.vertical...");
  return 6
} else return false
}
      // Jobs for later programming:
      // KI Hard mode
      // New Game Mode: Gathering points in every round: If you win rounds fast, you get more points than if you win it slow..
      // Style the confirm boxes with JQuery (but than you have to give up the Vanilla JS Style....)