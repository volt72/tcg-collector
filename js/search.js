function searchForCards() {
	var value = document.getElementById("search-box").value;
	var cardsContainer = document.getElementById("cards-container");
	cardsContainer.innerHTML = "";

	if(value == "") return;

	var cardsFound = [];

	for(i = 0; i < cardList.length; i++) {
		if(cardList[i].title.toLowerCase().includes(value.toLowerCase())) {
			cardsFound.push(cardList[i]);
		}
	}

	// cardsFound.sort(compareTitles);

	for(i = 0; i < cardsFound.length; i++) {
		if(i >= 24) break;
		var cardFound = cardsFound[i];
		cardsContainer.innerHTML += 
			"<div class='card-container'>"+ 
				"<div class='card-img-wrapper'>" + 
					"<a href='#' data-featherlight=\"" + getCardDetailsDOM(cardFound) + "\"><img src='" + cardFound.imageUrl + "'><br>" + cardFound.title + "</a>" + 
				"</div>" + 
			"</div>";
	}
}

function getCardDetailsDOM(card) {
	var title = card.title;

	var html = "<div class='card-details'>" + 
		"<div class='card-image'>" + 
			"<img src='" + card.imageUrl + "'>" +
			escapeHtml("<button type='button' class='btn btn-sm btn-success' onclick='addToCollection(\"" + title + "\")'>Add to collection</button>") +
		"</div>" +
		"<div class='table-details'>" +
		"<table class='table table-bordered'>" +
			"<tbody>";

	if(card.title != undefined) 		html += getTableEntryDOM("Title", card.title);
	if(card.lore != undefined) 			html += getTableEntryDOM("Description", card.lore);
	if(card.types != undefined) 		html += getTableEntryDOM("Type(s)", arrayToString(card.types));
	if(card.level != undefined) 		html += getTableEntryDOM("Level", card.level);
	if(card.atk != undefined) 			html += getTableEntryDOM("ATK", card.atk);
	if(card.def != undefined) 			html += getTableEntryDOM("DEF", card.def);
	if(card.archetypes != undefined) 	html += getTableEntryDOM("Archetype(s)", arrayToString(card.archetypes));
	if(card.actions != undefined) 		html += getTableEntryDOM("Action(s)", arrayToString(card.actions));
	if(card.number != undefined) 		html += getTableEntryDOM("Number", card.number);
				
	html += "</tbody>" +
		"</table>" +
		"</div" +
	"</div>";

	return html;
}

function getTableEntryDOM(name, value) {
	return "<tr><td><b>" + name + "</b></td><td>" + escapeHtml(value) + "</td></tr>";
}

function arrayToString(array) {
	var s = "";
	for(x = 0; x < array.length; x++) {
		if(x > 0) s += ", ";
		s += array[x].toString();
	}
	return s;
}

function compareTitles(a, b) {
	var titleA = a.title.toLowerCase();
	var titleB = b.title.toUpperCase();
	if(titleA < titleB) return -1;
	if(titleA > titleB) return 1;
	return 0;
}

// Parse text so it is without html tags
function escapeHtml(text) {
  	var map = {
    	'&': '&amp;',
    	'<': '&lt;',    	'>': '&gt;',
    	'"': '&quot;',
    	"'": '&#039;'
  	};
  	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}