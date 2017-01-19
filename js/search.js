var searchDatabase = "", searchCollection = "";

function searchForCards(page) {
	if(sectionSelected == 2) return;
	if(page < 1) page = 1;
	var value = document.getElementById("search-box").value;
	var cardsContainer = $("#cards-container" + sectionSelected);
	// cardsContainer = document.getElementById("cards-container" + sectionSelected);
	cardsContainer.html("");

	// if(value == "" || cardsContainer == undefined) return;

	var cardsFound = [];

	if(sectionSelected == 0) {
		for(var i = 0; i < cardList.length; i++) {
			if(cardList[i].title.toLowerCase().includes(value.toLowerCase())) {
				cardsFound.push(cardList[i]);
			}
		}
		searchDatabase = value;
	}
	if(sectionSelected == 1) {
		for(var i = 0; i < cardCollection.length; i++) {
			if(cardCollection[i].card.title.toLowerCase().includes(value.toLowerCase())) {
				if($.inArray(cardCollection[i].card, cardsFound) == -1) {
					cardsFound.push(cardCollection[i].card);
				}
			}
		}
		searchCollection = value;
	}
	if(sectionSelected == 2) {
		var cards = deckList[deckSelected].cards;
		for(var i = 0; i < cards.length; i++) {
			if(cards[i].title.toLowerCase().includes(value.toLowerCase())) {
				cardsFound.push(cards[i]);
			}
		}
	}

	setPagination(page, parseInt(cardsFound.length / 24) + 1);

	for(i = 24 * (page - 1); i < 24 * page; i++) {
		// if(i < 24 * (page - 1) || i >= 24 * page) break;
		if(i >= cardsFound.length) break;

		var cardFound = cardsFound[i];
		cardsContainer.append(
			'<div class="card-container">'+ 
				'<div class="card-img-wrapper">' + 
					// "<a href='#' data-featherlight=\"" + getCardDetailsDOM(cardFound) + "\">" +
					'<a href="#" onclick="showCardDetails(\'' + escapeHtml(cardFound.title) + '\')">' +
						'<img src="' + cardFound.imageUrl + '"><br>' + 
						'<span class="badge badge-pill badge-success coll-number-' + cardFound.id + '"></span> ' + 
						cardFound.title + 
					'</a>' + 
				'</div>' + 
			'</div>'
		);
		updateCollectionElements(cardFound);
	}
}

function showCardDetails(title) {
	var card = getCardFromTitle(title);
	$.featherlight(getCardDetailsDOM(card));
	updateCollectionElements(card);

	if(card.setsEn != undefined) {
		for(var i = 0; i < card.setsEn.length; i++) {
			getCardPrices(card.setsEn[i].number);
		}
	}
}

function getCardDetailsDOM(card) {
	var html = '<div class="card-details">' + 
		'<div class="card-image">' + 
			'<img src="' + card.imageUrl + '">' +
			// '<button type="button" class="btn btn-sm btn-success" onclick="addToCollection(\'' + card.title + '\')">Add</button>' +
			// ' <span class="badge badge-pill badge-success coll-number-' + card.id + '"></span>' + 
			// ' <button type="button" class="btn btn-sm btn-danger coll-add-' + card.id + '" onclick="removeFromCollection(\'' + card.title + '\')">Remove</button>' +
		'</div>' +
		'<div class="table-details">' +
		'<table class="table table-bordered">' +
			'<tbody>';

	if(card.title != undefined) 		html += getTableEntryDOM("Title", card.title);
	if(card.lore != undefined) 			html += getTableEntryDOM("Description", card.lore);
	if(card.attribute != undefined) 	html += getTableEntryDOM("Attribute", card.attribute);
	if(card.types != undefined) 		html += getTableEntryDOM("Type(s)", arrayToString(card.types));
	if(card.level != undefined) 		html += getTableEntryDOM("Level", card.level);
	if(card.atk != undefined) 			html += getTableEntryDOM("ATK", card.atk);
	if(card.def != undefined) 			html += getTableEntryDOM("DEF", card.def);
	// if(card.archetypes != undefined) 	html += getTableEntryDOM("Archetype(s)", arrayToString(card.archetypes));
	// if(card.actions != undefined) 		html += getTableEntryDOM("Action(s)", arrayToString(card.actions));
	if(card.number != undefined) 		html += getTableEntryDOM("Number", card.number);
				
	html += '</tbody>' +
		'</table>' +
		'</div>' +

		'<div class="table-sets">' +
			'<table class="table table-bordered">' +
				'<thead>' +
					'<tr>' +
						'<th>Owned</th>' +
						'<th>#</th>' +
						'<th>Set</th>' +
						'<th>Rarity</th>' +
						'<th>Price</th>' +
					'</tr>' +
				'</thead>' +
				'<tbody>';

	if(card.setsEn != undefined) {
		for(var i = 0; i < card.setsEn.length; i++) {
			html += getSetTableEntry(card, card.setsEn[i].number, card.setsEn[i].setName, card.setsEn[i].rarity);
		}
	}

	html += '</tbody>' +
			'</table>' +
		'</div>' +
	'</div>';

	return html;
}

function getTableEntryDOM(name, value) {
	return "<tr><td><b>" + name + "</b></td><td>" + escapeHtml(value) + "</td></tr>";
}

function getSetTableEntry(card, number, set, rarity) {
	return '<tr>' +
		'<td>' + 
			'<span class="badge badge-pill badge-success coll-number-details-' + number + '">0</span>' +
			' <button type="button" class="btn btn-xs btn-success" onclick="addToCollection(\'' + number + '\', \'' + escapeHtml(card.title) + '\')"> + </button>' +
			' <button type="button" class="btn btn-xs btn-danger coll-remove-' + number + '" onclick="removeFromCollection(\'' + number + '\', \'' + escapeHtml(card.title) + '\')">-</button>' +
		'</td>' +
		'<td>' + number + '</td>' +
		'<td>' + set + '</td>' +
		'<td>' + rarity + '</td>' +
		'<td><span id="price-' + number + '">...</span></td>' +
	'</tr>';
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

	page2.css('display', totalPages > 1 ? '' : 'none');
	page3.css('display', totalPages > 2 ? '' : 'none');

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

	page1.find('a').attr('onclick', 'searchForCards(' + page1.find('a').html() + ')');
	page2.find('a').attr('onclick', 'searchForCards(' + page2.find('a').html() + ')');
	page3.find('a').attr('onclick', 'searchForCards(' + page3.find('a').html() + ')');

	first.find('a').attr('onclick', 'searchForCards(' + 1 + ')');
	prev.find('a').attr('onclick', 'searchForCards(' + (page - 1) + ')');
	next.find('a').attr('onclick', 'searchForCards(' + (page + 1) + ')');
	last.find('a').attr('onclick', 'searchForCards(' + totalPages + ')');

	if(page == 1) prev.find('a').attr('onclick', '');
	if(page == totalPages) next.find('a').attr('onclick', '');
}