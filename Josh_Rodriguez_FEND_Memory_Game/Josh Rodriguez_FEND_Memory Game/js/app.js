//array of the cards
const myCards = ['fa-diamond','fa-diamond',
			'fa-paper-plane-o','fa-paper-plane-o',
			'fa-anchor','fa-anchor',
			'fa-bolt','fa-bolt',
			'fa-cube','fa-cube',
			'fa-leaf','fa-leaf',
			'fa-bicycle','fa-bicycle',
			'fa-bomb','fa-bomb'];
//creatting and shuffling the deck
let newCards;
const myDeck = document.querySelector(".deck");
function shuffleDeck() {
	const newDeck = shuffle(myCards);
	for (let i = 0; i < myCards.length; i++){
		newCards = document.createElement("li");
		//added "show" to the class list so the player can see where the cards are on the board for a few seconds.
		newCards.classList.add("card","show");
		newCards.innerHTML = `<i class="fa ${newDeck[i]}"></i>`;
		myDeck.appendChild(newCards);
	}
}
shuffleDeck ();

//code for showing the cards at the beggining when the page loads for a few seconds and then flip the cards back over
//timer code that starts as soon as the page loads
let showCardsTime = 0;
	let showCardsTimer;
	function startTimer () {
		showCardsTimer = setInterval(cardTimerCount, 1000);
		function cardTimerCount () {
		showCardsTime++;
			stopTimer ();
		}
	}
startTimer();
//stop the timer and unshow the cards
function stopTimer () {
	if (showCardsTime === 5) {
		removeShow();
		clearInterval(showCardsTimer);
	}
}
function removeShow () {
	myDeck.childNodes.forEach (function (node){
		node.classList.remove("show");
	});
}

// universal variables
let deck = document.querySelector('.deck');
let playCards = document.querySelectorAll('.card');

// arrays to send the flipped cards into
let flippedCards = [];
const matchedCards = [];

// reload the page to reset
const reload = document.querySelector('.restart');
reload.addEventListener ('click', function (event) {
	window.location.reload(true);
})

// move counter
let moves = 0;
function counter(){
	moves++;
	const numberOfMoves = document.querySelector('.moves');
	numberOfMoves.innerHTML = moves; 
}

// star removal. only way I could get it to work is with the || and it will remove them at 9 moves and 14 moves. 2 functions to remove 2 stars.
function removeStars (){
	var myStars = document.getElementById("theStars");
	if (moves===1 || moves ===9) {
		myStars.removeChild(myStars.firstChild);
	}
}
function removeStars2 (){
	var myStars = document.getElementById("theStars");
	if (moves===10 || moves ===14) {
		myStars.removeChild(myStars.firstChild);
	}
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//game timer code
//start the timer
let time = 0;
let myTimer;
function timerStart () {
	myTimer = setInterval(timerCount, 1000);
	function timerCount () {
		time++;
		//function that displays the time
		showTime();
	}
}
//stop timer
function timerStop () {
	clearInterval(myTimer);
}
//start the timer on the first click of a card
let click = 0;
function addClick () {
	click++;
	timerStart();
	//this code is so that the timer does not speed up or the code reactivate once someone clicks on another card by removing event listener after the first card selection.
	if (click = 1){
		deck.removeEventListener('click', addClick);
	}
}
deck.addEventListener('click', addClick);
//code to display the time on the score board
function showTime () {
	const timerDisplay = document.querySelector('.time');
	let seconds = time % 60;
	let minutes = Math.floor(time / 60);
	if (seconds < 10) {
		timerDisplay.innerHTML = `${minutes}:0${seconds}`;
	} else {
		timerDisplay.innerHTML = `${minutes}:${seconds}`;
	}
}

//wining conditions
//code to show the modal
function congrats () {
	const theModal = document.querySelector('.modal__background');
	theModal.classList.remove("hidden");
}
function gameOver () {
	if (matchedCards.length === 16) {
		//stop the game timer once all cards are matched
		timerStop();
		//show the modal with the game stats
		congrats();
		//update the game stats
		updateModal();
	}
}
// add the reload page functionality to the button on the modal
const playAgain = document.querySelector('.modal__button');
	  playAgain.addEventListener ('click', function (event) {
	window.location.reload(true);
})
//update modal stats
function updateModal () {
	const updateTime = document.querySelector('.modal__time');
	const finalTime = document.querySelector('.time').innerHTML;
	const updateMoves = document.querySelector('.modal__moves');
	const updateStars = document.querySelector('.modal__stars');
	const finalStars = document.querySelector('.stars').innerHTML;
	
	updateTime.innerHTML = `Time: ${finalTime}`;
	updateMoves.innerHTML = `${moves} Moves`;
	updateStars.innerHTML = `${finalStars}`;
}

//actual game code
playCards.forEach (function (card) {
	card.addEventListener ('click', function (event) {
		// show card on click
		flippedCards.push(card);
		let flippedOne = flippedCards[0];
		let flippedTwo = flippedCards[1];
		//code to add the open and show classes to only 2 cards at a time.
		if (flippedCards.length <= 2){
			card.classList.add('open','show');
		}
		//code run to compare if the two cards match or not
		if (flippedCards.length === 2) {
			//function for the move counter start. Had to add the code here to get it to work properly.
			counter();
			//function for the stars to be removed at certain moves
			removeStars ();
			removeStars2 ();
			//below is the code for the comparing of cards. setTimeout is used to stop somone from just clicking through all the cards to see where each card is.
			setTimeout (function() {
				if ((flippedOne.classList.contains('open') && flippedOne.classList.contains('show')) &&
					(flippedTwo.classList.contains('open') && flippedTwo.classList.contains('show')) ){
					// if they match, we add the match class to both cards and move the cards to a third array. also reset the flippedCards array. 
					//if they do not match, we remove the open and show classes from both cards and reset the flippedCards array.
					if (flippedOne.innerHTML === flippedTwo.innerHTML){
						flippedOne.classList.add('match');
						flippedTwo.classList.add('match');
						matchedCards.push(flippedOne, flippedTwo);
						flippedCards = [];
					} else {
						flippedOne.classList.remove('open','show');
						flippedTwo.classList.remove('open','show');
						flippedCards = [];
					}
				}
				//winning condition
				gameOver();
			}, 1000);
		}
	})
})
