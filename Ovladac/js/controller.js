/*
* @name Controller.js 
* @author Jaroslav Valdauf
*/

$(document).ready(function() {
	
	// Vyskakovac� okno s mo�nost� zadat IP adresu serveru, predvyplnen� je adresa z adresov�ho r�dku, v�stup se ukl�d� do promenn�
	var IP = prompt("Please insert IP address", window.location.hostname); 
	// Vytvoreni websocket spojeni se serverem
	var connection = new WebSocket('ws://' + IP + ':1367');
	
	// prizpusoben� velikosti elementu v ovladaci ruzn�m rozli�en�m
	setSize();
	
	// Pri prijet� zpr�vy od serveru odr�zne prvn� 4 znaky v�pisu, pokud se rovnaj� "note", vyp�e zbytek do textov�ho pole
	connection.onmessage = function(event) {
		switch(event.data.substring(0, 4)) {
			case 'note':
				//pri v�pisu se zavol� funkce removeSpaces, kter� text uprav�
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
// Zabranuje posunut� str�nky, posun funguje pouze v pr�pade posunu v elementu textControl
document.ontouchmove = function(e) {
   if(e.target.id != "textControl") {
      e.preventDefault() }
   }; 

// EVENT
// Pri ot�cen� zar�zen� zavol� metodu rotateCalt, kter� prepoc�t� velikost elementu textControl
window.onorientationchange = function(e) {
	setSize();
};

/* V�pocet pozice prvku
Urcuje velikost prvku s id textControl, ve kter�m jsou zobrazov�ny pozn�mky.
Poc�t� se v��ka a ��rka v z�vislosti na natocen� a rozli�en� displaye
Nebot zar�zen� od spolecnosti Apple jsou specifick� v tom, jak pred�vaj� sv� rozli�en�, mus� se specifikovat zar�zen�
*/
function setSize() {

	// Orientace okna
	var orientation = window.orientation;
	
	// overeni zda-li je zobrazovacem zarizeni od firmy Apple
	var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i)?true:false;
	
	if(iOS == true) {
		switch(orientation) {
		// Orientace, nab�v� hodnot: 0,180, 90 a -90 podle natocen� zar�zen�
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
		// Ostatn� zar�zen�
		$("div#textControl").css("width", $(window).width() - 100);
		$("div#textControl").css("height", $(window).height() - ($("div[data-role=header]").height() + $("div[data-role=footer]").height() + 75));
	}
}

/* Uprav� pr�choz� text, odstran� tabul�tory, dvojit� mezery
@return {string} Upraven� text k zobrazen� v textArea
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