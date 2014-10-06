/*
* @name Controller.js 
* @author Jaroslav Valdauf
*/

$(document).ready(function() {
	
	// Vyskakovací okno s možností zadat IP adresu serveru, predvyplnená je adresa z adresového rádku, výstup se ukládá do promenné
	var IP = prompt("Please insert IP address", window.location.hostname); 
	// Vytvoreni websocket spojeni se serverem
	var connection = new WebSocket('ws://' + IP + ':1367');
	
	// prizpusobení velikosti elementu v ovladaci ruzným rozlišením
	setSize();
	
	// Pri prijetí zprávy od serveru odrízne první 4 znaky výpisu, pokud se rovnají "note", vypíše zbytek do textového pole
	connection.onmessage = function(event) {
		switch(event.data.substring(0, 4)) {
			case 'note':
				//pri výpisu se zavolá funkce removeSpaces, která text upraví
				$("#textControl").html(removeSpaces(event.data.substring(5)));
			break;
		}
	};

	// nastaveni funkcionality tlacitkuv v ovladaci liste	
	$("div[data-role=footer] a").on("click", function(e) {
		e.preventDefault();
		connection.send($(this).attr("href").split("#")[1]);
	});
	
});

// EVENT
// Zabranuje posunutí stránky, posun funguje pouze v prípade posunu v elementu textControl
document.ontouchmove = function(e) {
   if(e.target.id != "textControl") {
      e.preventDefault() }
   }; 

// EVENT
// Pri otácení zarízení zavolá metodu rotateCalt, která prepocítá velikost elementu textControl
window.onorientationchange = function(e) {
	setSize();
};

/* Výpocet pozice prvku
Urcuje velikost prvku s id textControl, ve kterém jsou zobrazovány poznámky.
Pocítá se výška a šírka v závislosti na natocení a rozlišení displaye
Nebot zarízení od spolecnosti Apple jsou specifická v tom, jak predávají své rozlišení, musí se specifikovat zarízení
*/
function setSize() {

	// Orientace okna
	var orientation = window.orientation;
	
	// overeni zda-li je zobrazovacem zarizeni od firmy Apple
	var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i)?true:false;
	
	if(iOS == true) {
		switch(orientation) {
		// Orientace, nabývá hodnot: 0,180, 90 a -90 podle natocení zarízení
			case 0:
      $("div#textControl").css("width", $(window).width() - 50);
      $("div#textControl").css("height", $(window).height() - ($("div[data-role=header]").height() + $("div[data-role=footer]").height() + 55));
			break;
			case 180:
				$("div#textControl").css("width", $(window).width() - 50);
				$("div#textControl").css("height", $(window).height() - ($("div[data-role=header]").height() + $("div[data-role=footer]").height() + 55));
			break; 
			case 90:
      	$("div#textControl").css("width", $(window).width() - 50);
				$("div#textControl").css("height", $(window).height() - ($("div[data-role=header]").height() + $("div[data-role=footer]").height() + 55));
			break;
			case -90:
				$("div#textControl").css("width", $(window).width() - 50);
				$("div#textControl").css("height", $(window).height() - ($("div[data-role=header]").height() + $("div[data-role=footer]").height() + 55));
			break;
		}
	} else {
		// Ostatní zarízení
		$("div#textControl").css("width", $(window).width() - 100);
		$("div#textControl").css("height", $(window).height() - ($("div[data-role=header]").height() + $("div[data-role=footer]").height() + 75));
	}
}

/* Upraví príchozí text, odstraní tabulátory, dvojité mezery
@return {string} Upravený text k zobrazení v textArea
*/
function removeSpaces(strInputText) {
	strInputText = strInputText.replace(/(\n\r|\n|\r)/gm,"<1br />");
	strInputText = strInputText.replace(/\t/g,"");
	re1 = /\s+/g;
	strInputText = strInputText.replace(re1, " ");
	re2 = /\<1br \/>/gi;
	strInputText = strInputText.replace(re2, "\n");
	
	return strInputText;
}