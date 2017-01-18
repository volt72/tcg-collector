var deckList = [];

var deckSelected = 0;

function loadDecks() {
	cardCollection = [];
	getCookie("decks", (error, cookies) => {
		if(cookies.length > 0) {
			var decks = cookies[0].value;
			var json = JSON.parse(decks);
			for(var i = 0; i < json.length; i++) {
				deckList.push(json[i]);
			}
			updateSidebar();
		}
	})
}
 
// Cards is an array of titles
function createDeck(name, cards) {
	var value = document.getElementById("search-box").value;
	var cardsContainer = $("#cards-container" + sectionSelected);
	// cardsContainer = document.getElementById("cards-container" + sectionSelected);
	cardsContainer.html("");

	var deck = {
		name: name,
		cards: cards,
	}
	deckList.push(deck);

	setCookie("decks", JSON.stringify(deckList));
	updateSidebar();
}

function updateSidebar() {
	var container = $("#decks");
	container.html("");
	for(var i = 0; i < deckList.length; i++) {
		var deck = deckList[i];
		container.append(
			'<li id="list-section2-' + i + '" class="sublist-item">' + 
				'<a href="#" onclick="setDeckSelected(' + i + '); changeSection(2)">' + deck.name + '</a>' +
			'</li>'
		);	
	}
	$("#decks-badge").html(deckList.length);
}

function setDeckSelected(i) {
	deckSelected = i;
}