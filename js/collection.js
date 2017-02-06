var cardCollection = []; // contains objects with set, deck and card

function loadCollection() {
	cardCollection = [];
	var item = localStorage.getItem('card_collection');
	if(item == undefined) return;
	var json = JSON.parse(item);
	for(var i = 0; i < json.length; i++) {
		var set = json[i].set;
		var card = getCardFromSet(set);
		cardCollection.push({ set: set, card: card, deck: json[i].deck });
		updateCollectionBadges(card);
	}
}

function addToCollection(set, deck, newDeck) {
	if(deck == undefined) {
		var deckList = getDeckList();
		if(newDeck == true) {
			var n = getDeckList().length + 1;
			while(deck == undefined) {
				var name = 'Deck ' + n;
				if($.inArray(name, getDeckList()) == -1) deck = name;
				n++;
			}
		} else if(deckList.length > 0) {
			// deck = getDeckList()[0];
			deck = cardCollection[cardCollection.length - 1].deck;
		} else {
			deck = "Deck 1";
		}
	}
	
	var card = getCardFromSet(set);
	cardCollection.push({ set: set, deck: deck, card: card });
	saveCollection();
	updateCardSetTable(card);
	updateCollectionBadges(card);
	if(sectionSelected == 1) searchForCards(1);
}

function removeFromCollection(set, deck) {
	var card = getCardFromSet(set);
	var lastIndex = -1;
	for(var i = 0; i < cardCollection.length; i++) {
		if(cardCollection[i].set == set && cardCollection[i].deck == deck) {
			lastIndex = i;
		}
	}
	if(lastIndex != -1) {
		cardCollection.splice(lastIndex, 1);
	}
	saveCollection();
	updateCardSetTable(card);
	updateCollectionBadges(card);
	if(sectionSelected == 1) searchForCards(1);
}

function saveCollection() {
	localStorage.setItem("card_collection", JSON.stringify(collectionToArray()));
}

function updateCollectionBadges(card) {
	var deckList = getDeckList();

	$('#collection-badge').html(cardCollection.length);
	$('#decks-badge').html(deckList.length);

	for(var d = 0; d < deckList.length; d++) {
		var elementDeckSize = $('[class*="coll-deck-size-' + deckList[d].replace(' ', '_') + '"]');
		var deckSize = getCardsInDeck(deckList[d]).length;
		elementDeckSize.html(deckSize);
	}

	if(card == undefined) return;

	var elementCollNumber = $('.coll-number-' + card.id);
	var cardNumber = getCardNumberInCollection(card);
	if(cardNumber != 0) {
		elementCollNumber.html(cardNumber);
	} else {
		elementCollNumber.html('');
	}

	if(card.sets != undefined) {
		for(var i = 0; i < card.sets.length; i++) {
			var set = card.sets[i].number;
			var setNumber = getSetNumberInCollection(set);
			var elementDetails = $('[class*="coll-number-details-' + set + '"]'); // string is like this because set number may contain '?'
			elementDetails.html(setNumber);

			for(var d = 0; d < deckList.length; d++) {
				var elementNumberInDeck = $('[class*="coll-number-details-' + set + '-' + deckList[d] + '"]'); // string is like this because set number may contain '?'
				var deckNumber = getSetNumberInDeck(set, deckList[d]);
				if(elementNumberInDeck != undefined) {
					elementNumberInDeck.html(deckNumber);
				}
			}
		}
	}
}

function updateCardSetTable(card) {
	if(card.sets == undefined) return;

	for(var i = 0; i < card.sets.length; i++) {
		var set = card.sets[i].number;
		var setNumber = getSetNumberInCollection(set);

		var tdCollection = $('[class*="td-coll-' + set + '"]');
		tdCollection.html('');

		if(getSetNumberInCollection(set) == 0) {
			tdCollection
				.append($('<span/>', { class: 'badge badge-pill badge-success coll-number-details-' + set }).html(0))
				.append(' ')
				.append($('<button/>', {
					type: 'button',
					class: 'btn btn-xs btn-success',
					click: function() { addToCollection($(this).attr('set')) }
				}).attr('set', set).html('<span class="glyphicon glyphicon-plus"></span>'))
		} else {
			var cardsInCollection = getCollectionObjectsFromSet(set);
			var uniqueDecks = [];
			for(var n = 0; n < cardsInCollection.length; n++) {
				var collectionObject = cardsInCollection[n];
				if($.inArray(collectionObject.deck, uniqueDecks) == -1) {
					uniqueDecks.push(collectionObject.deck);
				}
			}
			for(var d = 0; d < uniqueDecks.length; d++) {
				tdCollection.append($('<div/>').attr('set', set).attr('deck', uniqueDecks[d])
					.append($('<span/>', { class: 'badge badge-pill badge-success coll-number-details-' + set + '-' + uniqueDecks[d] }).html(0))
					.append(' ')
					.append($('<input/>', { class: 'typeahead', type: 'search', value: uniqueDecks[d], afterSelect: function() { changeDeckValue($(this)) } })
						.on('input', function() { changeDeckValue($(this)) })
						.on('typeahead:selected', function() { changeDeckValue($(this)) })
						.on('focusin', function() { setDeckNameRecent($(this)) })
					)
					.append(' ')
					.append($('<button/>', {
						type: 'button',
						class: 'btn btn-xs btn-success',
						click: function() { addToCollection($(this).parent().attr('set'), $(this).parent().attr('deck')) }
					}).html('<span class="glyphicon glyphicon-plus"></span>'))
					.append(' ')
					.append($('<button/>', {
						type: 'button',
						class: 'btn btn-xs btn-danger coll-remove-' + set,
						click: function() { removeFromCollection($(this).parent().attr('set'), $(this).parent().attr('deck')) }
					}).html('<span class="glyphicon glyphicon-minus"></span>'))
					.append(' ')
					.append($('<button/>', {
						type: 'button',
						class: 'btn btn-xs btn-primary',
						click: function() { addToCollection($(this).parent().attr('set'), undefined, true) }
					}).html('<span class="glyphicon glyphicon-arrow-down"></span>'))
					.append('<br>')
				);
			}
		}

		// var deckList = getDeckList();
		// for(var d = 0; d < deckList.length; d++) {
		// 	var elementNumberInDeck = $('[class*="coll-number-details-' + set + '-' + deckList[d] + '"]'); // string is like this because set number may contain '?'
		// 	var deckNumber = getSetNumberInDeck(set, deckList[d]);
		// 	if(elementNumberInDeck != undefined) {
		// 		elementNumberInDeck.html(deckNumber);
		// 	}
		// }

		var addButton = $('[class*="coll-remove-' + set + '"]');
		if(addButton != undefined) {
			if(setNumber > 0) {
				addButton.css("display", "");
			} else {
				addButton.css("display", "none");
			}
		}
	}

	var decks = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: getDeckList()
	});

	$('.typeahead').typeahead({
		hint: true,
		highlight: true,
		minLength: 1
	}, {
		name: 'decks',
		source: decks
	})
}

function setDeckNameRecent(input) {
	deckNameRecent = input.val();
}

function changeDeckValue(input, card) {
	var value = input.val();
	renameDeckForSet(input.parent().parent().attr('set'), deckNameRecent, value);
	input.parent().parent().attr('deck', value); // Two parents needed for typeahead
	// input.attr('id', 'deck-input-' + input.attr('set') + '-' + value);
	deckNameRecent = value;
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

function getSetNumberInDeck(set, deck) {
	var c = 0;
	for(var i = 0; i < cardCollection.length; i++) {
		if(cardCollection[i].set == set && cardCollection[i].deck == deck) {
			c++;
		}
	}
	return c;
}

function getCardsInDeck(deck) {
	var cards = [];
	for(var i = 0; i < cardCollection.length; i++) {
		if(cardCollection[i].deck == deck) {
			cards.push(cardCollection[i]);
		}
	}
	return cards;
}

function getDeckList() {
	var decks = [];
	for(var i = 0; i < cardCollection.length; i++) {
		if($.inArray(cardCollection[i].deck, decks) == -1) {
			decks.push(cardCollection[i].deck);
		}
	}
	return decks;
}

function getDeck(name) {
	return { title: name, cards: getCardsInDeck(name) };
}

function getCollectionObjectsFromSet(set) {
	var objects = [];
	for(var i = 0; i < cardCollection.length; i++) {
		if(cardCollection[i].set == set) {
			objects.push(cardCollection[i]);
		}
	}
	return objects;
}

function renameDeckForSet(set, deckOld, deckNew) {
	for(var i = 0; i < cardCollection.length; i++) {
		if(cardCollection[i].set == set && cardCollection[i].deck == deckOld) {
			cardCollection[i].deck = deckNew;
		}
	}
	saveCollection();
}

function renameDeck(deckOld, deckNew) {
	for(var i = 0; i < cardCollection.length; i++) {
		if(cardCollection[i].deck == deckOld) {
			cardCollection[i].deck = deckNew;
		}
	}
}

function collectionToArray() {
	var array = [];
	for(var i = 0; i < cardCollection.length; i++) {
		array.push({ set: cardCollection[i].set, deck: cardCollection[i].deck });
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