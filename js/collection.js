var cardCollection = []; // contains objects with set, deck and card

function loadCollection() {
	cardCollection = [];
	// getCookie("card_collection", (error, cookies) => {
	// 	if(cookies != undefined && cookies.length > 0 && cookies[0] != undefined) {
	// 		var collection = cookies[0].value;
	// 		var json = JSON.parse(collection);
	// 		for(var i = 0; i < json.length; i++) {
	// 			var set = json[i].set;
	// 			var card = getCardFromTitle(json[i].title);
	// 			cardCollection.push({ set: set, card: card });
	// 			updateCollectionElements(card);
	// 		}
	// 	}
	// })
	var item = localStorage.getItem("card_collection");
	if(item == undefined) return;
	var json = JSON.parse(item);
	for(var i = 0; i < json.length; i++) {
		var set = json[i].set;
		var card = getCardFromSet(set);
		cardCollection.push({ set: set, card: card });
		updateCollectionElements(card);
	}
}

function addToCollection(set, title) {
	var card = getCardFromTitle(title);
	cardCollection.push({ set: set, card: card });
	// setCookie("card_collection", JSON.stringify(collectionToArray()));
	localStorage.setItem("card_collection", JSON.stringify(collectionToArray()));
	updateCollectionElements(card);
	if(sectionSelected == 1) searchForCards(1);
}

function removeFromCollection(set, title) {
	var card = getCardFromTitle(title);
	var lastIndex = -1;
	for(var i = 0; i < cardCollection.length; i++) {
		if(cardCollection[i].card == card && cardCollection[i].set == set) {
			lastIndex = i;
		}
	}
	if(lastIndex != -1) {
		cardCollection.splice(lastIndex, 1);
	}
	// setCookie("card_collection", JSON.stringify(collectionToArray()));
	localStorage.setItem("card_collection", JSON.stringify(collectionToArray()));
	updateCollectionElements(card);
	if(sectionSelected == 1) searchForCards(1);
}

function updateCollectionElements(card) {
	$("#collection-badge").html(cardCollection.length);

	var element = $(".coll-number-" + card.id);
	var cardNumber = getCardNumberInCollection(card);
	element.html(cardNumber);

	if(element != undefined) {
		if(cardNumber != 0) {
			element.html(cardNumber);
		} else {
			element.html("");
		}
	}

	if(card.setsEn != undefined) {
		for(var i = 0; i < card.setsEn.length; i++) {
			var set = card.setsEn[i].number;
			var setNumber = getSetNumberInCollection(set);
			var elementDetails = $('[class*="coll-number-details-' + set + '"]'); // sring is like this because set number may contain '?'
			// console.log(set + ': ' + 'coll-number-details-' + set);
			if(elementDetails != undefined) {
				elementDetails.html(setNumber);
			}
			var addButton = $('[class*="coll-remove-' + set + '"]');
			if(addButton != undefined) {
				if(setNumber > 0) {
					addButton.css("display", "");
				} else {
					addButton.css("display", "none");
				} 
			}
		}
	}
}

function getCardNumberInCollection(card) {
	var c = 0;
	for(var i = 0; i < cardCollection.length; i++) {
		if(cardCollection[i].card == card) c++;
	}
	return c;
}

function getSetNumberInCollection(set) {
	var c = 0;
	for(var i = 0; i < cardCollection.length; i++) {
		if(cardCollection[i].set == set) {
			c++;
		}
	}
	return c;
}

function collectionToArray() {
	var array = [];
	for(var i = 0; i < cardCollection.length; i++) {
		array.push({ set: cardCollection[i].set });
	}
	return array;
}

function getNumberUniqueCards() {
	var uniqueCards = [];
	for(var i = 0; i < cardCollection.length; i++) {
		if($.inArray(cardCollection[i].card, uniqueCards) == -1) {
			uniqueCards.push(cardCollection[i].card);
		}
	}
	return uniqueCards.length;
}