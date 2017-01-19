var deckList = [];

var deckSelected = 0;

function loadDecks() {
	removeCookie("decks");
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
function createDeck(name) {
	if(name == undefined) {
		for(var i = 0; i < deckList.length + 2; i++) {
			var deckName = "Deck " + (i + 1);
			if(getDeck(deckName) == undefined) {
				name = deckName;
				break;
			}
		}
	}

	// var value = document.getElementById("search-box").value;
	var cardsContainer = $("#cards-container" + sectionSelected);

	var deck = {
		name: name,
		cards: []
	}
	deckList.push(deck);

	setCookie("decks", JSON.stringify(deckList));
	updateSidebar();
}

function deleteDeck(name) {
	var lastIndex = -1;
	for(var i = 0; i < deckList.length; i++) {
		if(deckList[i].name == name) {
			lastIndex = i;
		}
	}
	if(lastIndex != -1) {
		deckList.splice(lastIndex, 1);
	}
	setCookie("decks", JSON.stringify(deckList));
	updateSidebar();
}

function updateSidebar() {
	var container = $("#decks");
	container.html("");
	for(var i = 0; i < deckList.length; i++) {
		var deck = deckList[i];
		container.append(
			'<li id="list-section2-' + i + '">' + 
				'<a href="#" class="sublist-item" onclick="setDeckSelected(' + i + '); changeSection(2)">' + 
					deck.name + '&nbsp;&nbsp;&nbsp;&nbsp;' +
					'<button type="button" class="btn btn-xs btn-danger" onclick="deleteDeck(\'' + escapeHtml(deck.name) + '\')">x</button>' +
				'</a>' +
			'</li>'
		);	
	}
	$("#decks-badge").html(deckList.length);
}

function setDeckSelected(i) {
	deckSelected = i;
}

function getDeck(name) {
	for(var i = 0; i < deckList.length; i++) {
		if(deckList[i].name == name) {
			return deckList[i];
		}
	}
	return undefined;
}

function deckHasCard(set, deck) {
	for(var i = 0; i < deck.cards; i++) {
		if(deck.cards[i].set == set) {
			return true;
		}
	}
	return false;
}

function getDecksWithCard(set) {
	var decks = [];
	for(var i = 0; i < deckList.length; i++) {
		if(deckHasCard(set, deckList[i])) {
			decks.push(deckList[i]);
		}
	}
	return decks;
}