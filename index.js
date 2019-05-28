// create the html
const createAndAddElement = (elem, parent, className = null, idName = null ) => { // takes strings
    let newElem = document.createElement(elem);
    
    parent.appendChild(newElem);
    
    className && newElem.classList.add(className);
    idName && newElem.setAttribute('id', idName);

    return newElem;
}
 


// Table
const tableHTML = createAndAddElement('div', document.body, null, 'table');

// Rows
let rowsHTML = [];
['row1', 'row2', 'row3'].forEach( r => {
    rowsHTML.push(
        createAndAddElement('div', tableHTML, 'row', r)
        );
});

// Cards
let cardsHTML = [];
const cardValues = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
for(let i = 0, rowNumber = 1; i < cardValues.length; i++) {
    
    if(i === 4 || i === 9) rowNumber++; // creates 4 5 4 rows
    cardsHTML.push(
        createAndAddElement('div', rowsHTML[
        rowsHTML.indexOf('row') + rowNumber 
        ], 'card', cardValues[i])
    );
}

// Hand 
let handHTML = createAndAddElement('div', document.body, null, 'hand');
let handCardsHTML = []
let handSize = 15;
for(let i = 0; i < handSize ; i++ ) { // 15 is the standard hand size 13 cards + 2 jokers
    handCardsHTML.push(
        createAndAddElement('div', handHTML, 'card')
    );
} 




class Card {
    constructor(val, loc, up = false) { // value, location
        this.val = val;
        this.loc = loc;
        this.up = up;
    }
    
    flip(){
        this.up = !this.up;
        if(this.up) {
            this.loc.className = 'card up';
            this.loc.innerText = this.val;
        }
        else {
            this.loc.className = 'card down';
            this.loc.innerText = '?';
        }
        
        return this;
    }
}
const deck = {};
cardValues.forEach(c => {
    deck[c] = 4;
});

class Table {
    constructor(){
        this.isWinner = false;
        this.cards = [];
    }
    
    assignLocations() {
        cardValues.forEach(l => {
            this[`${l}`] = document.getElementById(l);
        });
        
        return this;
    }
    connectCards() {
        for(let i = 0; i < cardValues.length; i++){
            this.cards.push(new Card(cardsHTML[i].innerText, cardsHTML[i]))
        }
        return this.cards;
    }
    
    dealCards() {
        for( let i = 0; i < cardValues.length; i++) {
            let randCard = Math.floor(Math.random() * cardValues.length);
            let newCard = cardValues[randCard];
            
            while(!deck[newCard]) { // if newCard is not in deck draw again
                randCard = Math.floor(Math.random() * cardValues.length);
                newCard = cardValues[randCard];
            }
            this[cardValues[i]].innerText = `${newCard}`
            deck[newCard]--;
        }
        
    }
}

class Hand { 
    constructor(size = 13,) {
        this.size = size;
    }
    
    dealCards(arr) {
        for( let i = 0; i < cardValues.length; i++) {
            let randCard = Math.floor(Math.random() * cardValues.length);
            let newCard = cardValues[randCard];
            
            while(!deck[newCard]) { // if newCard is not in deck draw again
                randCard = Math.floor(Math.random() * cardValues.length);
                newCard = cardValues[randCard];
            }
            arr[i].innerText = `${newCard}`
            deck[newCard]--;
        }
        arr[arr.length-1].innerText = '$';
        arr[arr.length-2].innerText = '$';
    }
}

let table = new Table;
table.assignLocations();

let hand = new Hand;
table.dealCards()
table.connectCards();

hand.dealCards(handCardsHTML);


let listenForEvents = () => {   
    for( let c of handCardsHTML) {
        c.addEventListener('dragstart', dragStart);
        c.addEventListener('dragend', dragEnd);
    }
    //.filter(c => getTableCardFromDiv(c).up)
    for (let c of cardsHTML) {
        c.addEventListener('dragover', dragOver);
        c.addEventListener('dragenter',dragEnter);
        c.addEventListener('dragleave', dragLeave);
        c.addEventListener('drop', dragDrop);
    }
}

let removeEvents = () => {
    for( let c of handCardsHTML) {
        c.removeEventListener('dragstart', dragStart);
        c.removeEventListener('dragend', dragEnd);
    }
    //.filter(c => getTableCardFromDiv(c).up)
    for (let c of cardsHTML) {
        c.removeEventListener('dragover', dragOver);
        c.removeEventListener('dragenter',dragEnter);
        c.removeEventListener('dragleave', dragLeave);
    }
}

listenForEvents();



const getTableCardFromDiv = (div) => {
    return table.cards.find(c => c.loc === div);
}
// cardsHTML.forEach( c => {
    // c.className += ' down';
// c.innerText = '?'
// });

table.cards.forEach( c => {
    c.flip()
});

table.cards.forEach( c => {
    c.flip()
});



handCardsHTML.forEach(c => c.setAttribute('draggable', 'true'));

const joker = () => {
    cardsHTML.forEach(c => c.addEventListener('click', useJoker))
}

// needs work
/////////////////////
const useJoker = (e) => {
    console.log('TESTING JOKER')
    cardsHTML.forEach(c => c.removeEventListener('click', useJoker));
    let selection = getTableCardFromDiv(e.target);
    if (!selection.up) {
        seleection.flip();
        findFlip(selection.val)
    }
    else if (selection.val === '$') {
        //flips joker if joker is selected
        return selection.flip();
    }
    return findFlip(e.target.innerText);
}
////////////////////////////
const findFlip = (value) => {
    if(value === '$') {
        joker();
    } else {
        let find = table.cards.find(c => c.loc.getAttribute('id') === value);
        // console.log(find)
        
        if(find.loc.getAttribute('id') === find.val && find.up) return find;
        if(find.up){
            find.flip()
            
            return find;
        }
        find.flip()
        return findFlip(find.val)
    }
    
}




let gameStarted = false;
const firstClick = (event) => {
    let catalyst;
    if(!gameStarted) {
        // uses Card class loc to connect cardsHTML and table.cards
        catalyst = getTableCardFromDiv(event.target);

        catalyst.flip();
        
        //##########################33
        console.log(catalyst.loc.getAttribute('id'))
        console.log(catalyst)
        //############################3
        gameStarted = true;
        
        findFlip( catalyst.val, catalyst.loc)
    }
    
    return catalyst;
}
cardsHTML.forEach(c => c.addEventListener('click', firstClick , {once: true}))



// drag and drop

    // drag handCardshtml to Cardshtml





// edit these styles to work with our code

//  const getTableCardFromDiv = (div) => {
//     return table.cards.find(c => c.loc === div.getAttribute('id'));
//  }

let upOrDown = (c) => {
    return c.up ? 'up' : 'down';
}

    function dragStart() {
        this.className += ' hold';
        console.log('dragstart',this)
        setTimeout(() => (this.className = ' invisible'), 0)
        this.id = 'holding';
        console.log('start')


    }
    
    function dragEnd() {
        console.log('end')
        this.className = 'card ';
        console.log('dragend',this)
        this.removeAttribute('id');

    
    }

//// HAND IS ^^^^^^^

//// TABLE IS vvvvvvvvv

    function dragOver(e) {
        e.preventDefault()
        console.log('over')
    }
    
    function dragEnter(e) {
        e.preventDefault()
        this.className += ' hovered'
        console.log(this)
        console.log('enter')
    }
    
    function dragLeave() {
        this.className = `card ${upOrDown(getTableCardFromDiv(this))}`
        console.log('leave')
    }
    
    function dragDrop() {
        if(getTableCardFromDiv(this).up) {
            let replaceCard =  getTableCardFromDiv(this)
            let replacement = document.getElementById('holding')
            
            replaceCard.loc.innerText= replacement.innerText;
            replaceCard.val = replacement.innerText;
            
            replacement.parentNode.removeChild(replacement);
            findFlip(replacement.innerText); 
            console.log('drop')
        }
        this.className = `card ${upOrDown(getTableCardFromDiv(this))}`;
    }
    

    // update drop location to handCard value

    // remove handcard from hand

    // call findFlip on drop loc