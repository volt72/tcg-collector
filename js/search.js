// var searchDatabase = "", searchCollection = "";
var searchSection = { 0: "", 1: "", 2: "", 3: "", 4: "" };
var deckNameRecent;

function searchForCards(page, value) {
	if(sectionSelected > 2) return;
	if(page < 1) page = 1;
	if(value == undefined) {
		value = document.getElementById('search-box').value;
	} else {
		document.getElementById('search-box').value = value;
	}
	var cardsContainer = $('#cards-container' + sectionSelected);
	cardsContainer.html('');
	searchSection[sectionSelected] = value;

	// if(value == "" || cardsContainer == undefined) return;

	var objectsFound = [];

	if(sectionSelected == 0) {
		for(var i = 0; i < cardList.length; i++) {
			var card = cardList[i];
			if(value.startsWith('set:') && card.sets != undefined) {
				for(var s = 0; s < card.sets.length; s++) {
					if(card.sets[s].setName.toLowerCase().includes(value.replace('set:', '').toLowerCase())) {
						objectsFound.push(card);
						break;
					}
				}
			} else {
				if(card.title.toLowerCase().includes(value.toLowerCase())) {
					objectsFound.push(card);
				}
			}
		}
	}
	if(sectionSelected == 1) {
		for(var i = 0; i < cardCollection.length; i++) {
			var card = cardCollection[i].card;
			if(value.startsWith('set:') && card.sets != undefined) {
				for(var s = 0; s < card.sets.length; s++) {
					if(card.sets[s].setName.toLowerCase().includes(value.replace('set:', '').toLowerCase())) {
						if($.inArray(card, objectsFound) == -1) {
							objectsFound.push(card);
						}
						break;
					}
				}
			} else {
				if(card.title.toLowerCase().includes(value.toLowerCase())) {
					if($.inArray(card, objectsFound) == -1) {
						objectsFound.push(card);
					}
				}
			}
		}
	}
	if(sectionSelected == 2) {
		if(deckSelected == undefined) {
			var deckNameList = getDeckList();
			for(var i = 0; i < deckNameList.length; i++) {
				objectsFound.push(getDeck(deckNameList[i]));
			}
		} else {
			var deck = getDeck(deckSelected);
			for(var i = 0; i < deck.cards.length; i++) {
				var card = deck.cards[i].card;
				if(value.startsWith('set:') && card.sets != undefined) {
					for(var s = 0; s < card.sets.length; s++) {
						if(card.sets[s].setName.toLowerCase().includes(value.replace('set:', '').toLowerCase())) {
							objectsFound.push(card);
							break;
						}
					}
				} else {
					if(card.title.toLowerCase().includes(value.toLowerCase())) {
						objectsFound.push(card);
					}
				}
			}
		}
	}

	var sortMode = $('#sort-select').find('option:selected').attr('value');

	if(sortMode == 1) { // A -Z
		objectsFound.sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} ); 
	}
	if(sortMode == 2) { // Z - A
		objectsFound.sort(function(b,a) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} ); 
	}
	if(sortMode == 3) { // First - Last
		// array is already sorted this way
	}
	if(sortMode == 4) { // Last - First
		objectsFound.reverse();
	}

	setPagination(page, parseInt(objectsFound.length / 24) + 1);

	if(sectionSelected == 2 && deckSelected != undefined) {
		cardsContainer.append($('<div/>', { class: 'deck-title' }).append($('<form/>').submit(function() { submitDeckTitle(); return false; })
			.append($('<button/>', {
				type: 'button',
				class: 'btn btn-sm btn-outline-primary',
				click: function() { deckSelected = undefined; changeSection(2) }
			}).html('<span class="glyphicon glyphicon-arrow-left"></span>'))
			.append($('<span/>', { id: 'deck-title-text' }).html(' <b>' + deckSelected + '</b> ')
			.append($('<button/>', {
				type: 'button',
				class: 'btn btn-xs btn-primary',
				click: function() { editDeckTitle() }
			}).html('<span class="glyphicon glyphicon-pencil"></span>')))
		));
	}

	for(i = 24 * (page - 1); i < 24 * page; i++) {
		if(i >= objectsFound.length) break;

		if(sectionSelected == 2 && deckSelected == undefined) {
			var deckFound = objectsFound[i];
			var firstCard = deckFound.cards[0].card;
			var deckName = deckFound.title;
			cardsContainer.append(
				$('<div/>', { class: 'card-container' }).append(
					$('<div/>', { class: 'card-img-wrapper' }).append(
						$('<a/>', { href: '#', click: function() { selectDeck($(this).attr('deck')) }}).attr('deck', deckName)
							.append($('<img/>', { src: firstCard.imageUrl }))
							.append($('<br>'))
							.append($('<span/>', { class: 'badge badge-pill badge-success coll-deck-size-' + deckName.replace(' ', '_') }))
							.append(' ' + deckName)
					)
				)
			);
			updateCollectionBadges();
		} else {
			var cardFound = objectsFound[i];
			var title = cardFound.title;

			cardsContainer.append(
				$('<div/>', { class: 'card-container' }).append(
					$('<div/>', { class: 'card-img-wrapper' }).append(
						$('<a/>', { href: '#', click: function() { showCardDetails($(this).attr('card')) }}).attr('card', title)
							.append($('<img/>', { src: cardFound.imageUrl }))
							.append($('<br>'))
							.append($('<span/>', { 
								class: sectionSelected != 2 ? 'badge badge-pill badge-success coll-number-' + cardFound.id : ''
							}))
							.append(' ' + cardFound.title)
					)
				)
			);
			updateCollectionBadges(cardFound);
		}
	}
}

function selectDeck(deck) {
	deckSelected = deck;
	searchForCards(1);
}

function editDeckTitle() {
	$('#deck-title-text').html(' ').append($('<input/>', { type: 'text' }).val(deckSelected).attr('autofocus', true));
}

function submitDeckTitle() {
	var value = $('#deck-title-text').find('input').val();
	renameDeck(deckSelected, value);
	deckSelected = value;
	saveCollection();

	$('#deck-title-text').html(' <b>' + deckSelected + '</b> ').append($('<button/>', {
		type: 'button',
		class: 'btn btn-xs btn-primary',
		click: function() { editDeckTitle() }
	}).html('<span class="glyphicon glyphicon-pencil"></span>'));
}

function showCardDetails(title) {
	var card = getCardFromTitle(title);
	$.featherlight(getCardDetailsDOM(card));
	updateCardSetTable(card);
	updateCollectionBadges(card);

	if(card.sets != undefined) {
		for(var i = 0; i < card.sets.length; i++) {
			getCardPrices(card.sets[i].number);
		}
	}
}

function getCardDetailsDOM(card) {
	var divDetails = $('<div/>', { class: 'card-details' })
	var divCardImage = $('<div/>', { class: 'card-image '})
		.append($('<img/>', { src: card.imageUrl }))
		.appendTo(divDetails);

	var divTableDetails = $('<div/>', { class: 'table-details' }).appendTo(divDetails);
	var tableDetails = $('<table/>', { class: 'table table-bordered' }).appendTo(divTableDetails);
	var tbody = $('<tbody/>').appendTo(tableDetails);

	if(card.title != undefined) 		tbody.append(getTableEntryDOM("Title", card.title, "http://yugioh.wikia.com/wiki/" + encodeURIComponent(card.title)));
	if(card.lore != undefined) 			tbody.append(getTableEntryDOM("Description", card.lore));
	if(card.attribute != undefined) 	tbody.append(getTableEntryDOM("Attribute", card.attribute));
	if(card.types != undefined) 		tbody.append(getTableEntryDOM("Type(s)", arrayToString(card.types)));
	if(card.level != undefined) 		tbody.append(getTableEntryDOM("Level", card.level));
	if(card.atk != undefined) 			tbody.append(getTableEntryDOM("ATK", card.atk));
	if(card.def != undefined) 			tbody.append(getTableEntryDOM("DEF", card.def));
	if(card.statusTcgAdv != undefined)  tbody.append(getTableEntryDOM("Status (TCG Adv.)", card.statusTcgAdv, undefined, true));
	if(card.number != undefined) 		tbody.append(getTableEntryDOM("Number", card.number));

	var divTableSets = $('<div/>', { class: 'table-sets' }).appendTo(divDetails);
	var tableSets = $('<table/>', { class: 'table table-bordered'}).appendTo(divTableSets);
	tableSets.append(
		'<thead>' +
			'<tr>' +
				'<th>Owned</th>' +
				'<th>#</th>' +
				'<th>Set</th>' +
				'<th>Rarity</th>' +
				'<th><a href="http://yugiohprices.com/card_price?name=' + card.title + '" target="_blank">Price</a></th>' +
			'</tr>' +
		'</thead>'
	);

	var tBody = $('<tbody/>').appendTo(tableSets);

	if(card.sets != undefined) {
		for(var i = 0; i < card.sets.length; i++) {
			tBody.append(getSetTableEntry(card, card.sets[i].number, card.sets[i].setName, card.sets[i].rarity));
		}
	}

	// divDetails.append($('<datalist/>', { id: 'datalist-decks' }));

	return divDetails;
}

function getTableEntryDOM(name, value, link, bold) {
	var value = escapeHtml(value);
	if(link != undefined) value = '<a href="' + link + '" target="_blank">' + value + '</a>';
	var color = undefined;
	if(value == "Unlimited") color = 'rgb(150, 255, 150)';
	if(value == "Limited") color = 'rgb(150, 255, 255)';
	if(value == "Forbidden") color = 'rgb(255, 150, 150)';
	if(bold) value = '<b>' + value + '</b>';
	return '<tr><td><b>' + name + '</b></td><td ' + (color != undefined ? 'style="background-color:' + color + '"' : '') + '>' + value + '</td></tr>';
}

function getSetTableEntry(card, number, set, rarity) {
	var row = $('<tr/>');

	var tdCollection = $('<td/>', { class: 'td-coll-' + number }).appendTo(row);

	var tdNumber = $('<td/>').append(number).appendTo(row);

	var tdSet = $('<td/>')
		.append('<a href="http://yugioh.wikia.com/wiki/' + encodeURIComponent(set) + '" target="_blank">' + set + '</a> &nbsp;')
		.append(
			$('<a/>', {
				href: '#',
				click: function() { changeSection(0); searchForSet(set) }
			}).append('<span class="glyphicon glyphicon-search"></span>')
		).appendTo(row);

	var tdRarity = $('<td/>').append(rarity).appendTo(row);

	var tdPrice = $('<td/>').append('<span id="price-' + number + '">...</span>').appendTo(row);

	return row;
}

function searchForSet(setName) {
	$.featherlight.close();
	searchForCards(1, 'set:' + setName);
}

function arrayToString(array) {
	var s = "";
	for(x = 0; x < array.length; x++) {
		if(x > 0) s += ", ";
		s += array[x].toString();
	}
	return s;
}

// Parse text so it is without html tags
function escapeHtml(text) {
  	var map = {
    	'&': '&amp;',
    	'<': '&lt;',
    	'>': '&gt;',
    	'"': '&quot;',
    	"'": '&#039;'
  	};
  	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function getCardPrices(set) {
	$.getJSON(getYqlFromUrl('https://yugiohprices.com/api/price_for_print_tag/' + set), function(data) {
		var json = data.query.results.json;
		if(json.status == 'success' && json.data.price_data.price_data.status == "success") {
			var prices = json.data.price_data.price_data.data.prices; // Without YQL
			var low = parseFloat(prices.low).toFixed(2);
			var average = parseFloat(prices.average).toFixed(2);
			var high = parseFloat(prices.high).toFixed(2);
			$('#price-' + set).html("$" + low + " / <b>$" + average + "</b> / $" + high);
		} else {
			$('#price-' + set).html("n/a");
		}
	});
}

function getCollectionPrice() {
	var low = 0, average = 0, high = 0;
	var success = false;
	var cardsChecked = 0;
	var requests = [];

	for(var i = 0; i < cardCollection.length; i++) {
		requests.push($.getJSON(getYqlFromUrl('https://yugiohprices.com/api/price_for_print_tag/' + cardCollection[i].set), function(data) {
			if(data == undefined || data.query.results == null) return;
			var json = data.query.results.json;
			if(json.status == 'success' && json.data.price_data.price_data.status == "success") {
				var prices = json.data.price_data.price_data.data.prices;
				low += parseFloat(prices.low);
				average += parseFloat(prices.average);
				high += parseFloat(prices.high);
				cardsChecked++;
				success = true;
				$('#prices-total').html('(' + cardsChecked + '/' + cardCollection.length + ' checked)');
			}
		}));
	}

	$.when.apply($, requests).done(function() {
		if(success) {
			$('#prices-total').html("$" + low.toFixed(2) + " / <b>$" + average.toFixed(2) + "</b> / $" + high.toFixed(2));
		} else {
			$('#prices-total').html("n/a");
		}
	});
}

function setPagination(page, totalPages) {
	var first = $('#page-first');
	var prev = $('#page-prev');
	var page1 = $('#page-1');
	var page2 = $('#page-2');
	var page3 = $('#page-3');
	var next = $('#page-next');
	var last = $('#page-last');

	if(page == 1) {
		first.addClass('disabled');
		prev.addClass('disabled');
	} else {
		first.removeClass('disabled');
		prev.removeClass('disabled');
	}
	if(page == totalPages) {
		last.addClass('disabled');
		next.addClass('disabled');
	} else {
		last.removeClass('disabled');
		next.removeClass('disabled');
	}

	page1.removeClass('active');
	page2.removeClass('active');
	page3.removeClass('active');

	if(page == 1) {
		page1.addClass('active');
		page1.find('a').html(page);
		page2.find('a').html(page + 1);
		page3.find('a').html(page + 2);
	} else if(page == totalPages) {
		page3.addClass('active');
		page1.find('a').html(page - 2);
		page2.find('a').html(page - 1);
		page3.find('a').html(page);
	} else {
		page2.addClass('active');
		page1.find('a').html(page - 1);
		page2.find('a').html(page);
		page3.find('a').html(page + 1);
	}

	valuePage1 = parseInt(page1.find('a').html());
	valuePage2 = parseInt(page2.find('a').html());
	valuePage3 = parseInt(page3.find('a').html());

	page1.css('display', valuePage1 > totalPages || valuePage1 < 1 ? 'none' : '');
	page2.css('display', valuePage2 > totalPages || valuePage2 < 1 ? 'none' : '');
	page3.css('display', valuePage3 > totalPages || valuePage3 < 1 ? 'none' : '');

	// page2.css('display', totalPages > 1 ? '' : 'none');
	// page3.css('display', totalPages > 2 ? '' : 'none');

	page1.find('a').attr('onclick', 'searchForCards(' + valuePage1 + ')');
	page2.find('a').attr('onclick', 'searchForCards(' + valuePage2 + ')');
	page3.find('a').attr('onclick', 'searchForCards(' + valuePage3 + ')');

	first.find('a').attr('onclick', 'searchForCards(' + 1 + ')');
	prev.find('a').attr('onclick', 'searchForCards(' + (page - 1) + ')');
	next.find('a').attr('onclick', 'searchForCards(' + (page + 1) + ')');
	last.find('a').attr('onclick', 'searchForCards(' + totalPages + ')');

	if(page == 1) prev.find('a').attr('onclick', '');
	if(page == totalPages) next.find('a').attr('onclick', '');
}