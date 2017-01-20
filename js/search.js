var searchDatabase = "", searchCollection = "";

function searchForCards(page, value) {
	if(sectionSelected == 3) return;
	if(page < 1) page = 1;
	if(value == undefined) {
		value = document.getElementById("search-box").value;
	} else {
		document.getElementById("search-box").value = value;
	}
	var cardsContainer = $("#cards-container" + sectionSelected);
	cardsContainer.html("");

	// if(value == "" || cardsContainer == undefined) return;

	var cardsFound = [];

	if(sectionSelected == 0) {
		for(var i = 0; i < cardList.length; i++) {
			var card = cardList[i];
			if(value.startsWith('set:') && card.setsEn != undefined) {
				for(var s = 0; s < card.setsEn.length; s++) {
					if(card.setsEn[s].setName.toLowerCase().includes(value.replace('set:', '').toLowerCase())) {
						cardsFound.push(card);
						break;
					}
				}
			} else {
				if(card.title.toLowerCase().includes(value.toLowerCase())) {
					cardsFound.push(card);
				}
			}
		}
		searchDatabase = value;
	}
	if(sectionSelected == 1) {
		for(var i = 0; i < cardCollection.length; i++) {
			var card = cardCollection[i].card;
			if(value.startsWith('set:') && card.setsEn != undefined) {
				for(var s = 0; s < card.setsEn.length; s++) {
					if(card.setsEn[s].setName.toLowerCase().includes(value.replace('set:', '').toLowerCase())) {
						if($.inArray(card, cardsFound) == -1) {
							cardsFound.push(card);
						}
						break;
					}
				}
			} else {
				if(card.title.toLowerCase().includes(value.toLowerCase())) {
					if($.inArray(card, cardsFound) == -1) {
						cardsFound.push(card);
					}
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

	var sortMode = $('#sort-select').find('option:selected').attr('value');

	if(sortMode == 1) { // A -Z
		cardsFound.sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} ); 
	}
	if(sortMode == 2) { // Z - A
		cardsFound.sort(function(b,a) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} ); 
	}
	if(sortMode == 3) { // First - Last
		// array is already sorted this way
	}
	if(sortMode == 4) { // Last - First
		cardsFound.reverse();
	}
	if(sortMode == 5) { // ($) Low - High
		// var cardsChecked = 0;
		// var requests = [];

		// for(var i = 0; i < cardsFound.length; i++) {
		// 	cardsFound[i].cost = 0;
		// 	requests.push($.getJSON(getYqlFromUrl('https://yugiohprices.com/api/price_for_print_tag/' + cardCollection[i].set), function(data) {
		// 		if(data == undefined || data.query.results == null) return;
		// 		var json = data.query.results.json;
		// 		if(json.status == 'success' && json.data.price_data.price_data.status == "success") {
		// 			var prices = json.data.price_data.price_data.data.prices;
		// 			low += parseFloat(prices.low);
		// 			average += parseFloat(prices.average);
		// 			high += parseFloat(prices.high);
		// 			cardsChecked++;
		// 			success = true;
		// 			cardsContainer.html('(' + cardsChecked + '/' + cardsFound.length + ' checked)');
		// 		}
		// 	}));
		// }

		// var finished = false;

		// $.when.apply($, requests).done(function() {
		// 	finished = true;
		// });

		// while(!finish) {}
	}

	setPagination(page, parseInt(cardsFound.length / 24) + 1);

	for(i = 24 * (page - 1); i < 24 * page; i++) {
		// if(i < 24 * (page - 1) || i >= 24 * page) break;
		if(i >= cardsFound.length) break;

		var cardFound = cardsFound[i];

		var title = cardFound.title;

		cardsContainer.append(
			$('<div/>', { class: 'card-container' }).append(
				$('<div/>', { class: 'card-img-wrapper' }).append(
					$('<a/>', { href: '#', click: function() { showCardDetails($(this).attr('card')) }}).attr('card', title)
						.append($('<img/>', { src: cardFound.imageUrl }))
						.append($('<br>'))
						.append($('<span/>', { class: 'badge badge-pill badge-success coll-number-' + cardFound.id }))
						.append(' ' + cardFound.title)
				)
			)
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
				'<th>Price</th>' +
			'</tr>' +
		'</thead>'
	);

	var tBody = $('<tbody/>').appendTo(tableSets);

	if(card.setsEn != undefined) {
		for(var i = 0; i < card.setsEn.length; i++) {
			tBody.append(getSetTableEntry(card, card.setsEn[i].number, card.setsEn[i].setName, card.setsEn[i].rarity));
		}
	}

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

	var tdCollection = $('<td/>')
		.append($('<span/>', { class: 'badge badge-pill badge-success coll-number-details-' + number }).html(0))
		.append(' ')
		.append($('<button/>', {
			type: 'button',
			class: 'btn btn-xs btn-success',
			click: function() { addToCollection(number, card.title) }
		}).html('+'))
		.append(' ')
		.append($('<button/>', {
			type: 'button',
			class: 'btn btn-xs btn-danger coll-remove-' + number,
			click: function() { removeFromCollection(number, card.title) }
		}).html('-'))

		.appendTo(row);

	var tdNumber = $('<td/>').append(number).appendTo(row);

	var tdSet = $('<td/>')
		.append('<a href="http://yugioh.wikia.com/wiki/' + encodeURIComponent(set) + '" target="_blank">' + set + '</a> &nbsp;')
		.append(
			$('<a/>', {
				href: '#',
				click: function() { searchForSet(set) }
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