var freshCard;

/* WELCOME MODAL */
function closeWelcomeModal(){
	document.getElementsByClassName("welcome")[0].classList.remove("active");
}

document.getElementsByClassName("overlay")[0].addEventListener("click", closeWelcomeModal);
document.getElementById("hideWelcome").addEventListener("click", closeWelcomeModal);

document.getElementById("saveCard").addEventListener("click", saveTheCard);
document.getElementById("getLink").addEventListener("click", promptLink);
var publicID = "";
function saveTheCard(){

	var request = new XMLHttpRequest();
	request.open("POST", "requests/save.php", true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

	//Generate an id for the card
	publicID = parseInt(new Date().getTime() + (parseInt(Math.random()*1)).toString()).toString(16);
	//Get the position of the message and transform it to %
	var percentPosition = {
		x : parseInt((wish.position.x/size.width)*100),
		y : parseInt((wish.position.y/size.height)*100)
	};

	stage.removeChild(flakes);
	renderer.render(stage);
	var sceneUrl = renderer.view.toDataURL('image/png');
	stage.addChild(flakes);
	var saveCard = {
		"card" : {
			publicID 			: publicID,
			message 			: ctrl.text,
			messageColor 		: ctrl.fontColor,
			messageSize 		: ctrl.fontSize,
			messageFont			: ctrl.font,
			messageColor 		: ctrl.fontColor,
			messagePositionX	: percentPosition.x,
			messagePositionY	: percentPosition.y,
			color        		: ctrl.color,
			opacity      		: ctrl.opacity,
			speed        		: ctrl.speed,
			size         		: ctrl.size,
			maxParticles 		: ctrl.maxParticles,
			thresholdColor  	: ctrl.thresholdColor,
			thresholdIntensity  : ctrl.thresholdIntensity,
			bgAnimate  			: ctrl.bgAnimate,
			image  				: ctrl.image,
			dataUrl				: sceneUrl
		}
	};
	request.send(JSON.stringify(saveCard));

	request.onreadystatechange=function()
	{
		if (request.readyState==4 && request.status==200)
		{
			document.getElementsByClassName("twitter-share-button")[0].href = "http://twitter.com/share?url=http://merrysnow.cards/%23"+publicID;
			!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
			document.getElementsByClassName("links")[0].style.display = "block";
		}
	}
}
function promptLink(){
	prompt("There it is, my friend : ", "http://www.merrysnow.cards/#"+publicID);
}


//Default params
var card = {
		bgAnimate			: true,
		image				: 2,
		message 			: "Merry Christmas",
		messageSize			: 80,
		messageFont			: "geared",
		messageColor 		: "#ffffff",
		messagePositionX 	: 50,
		messagePositionY 	: 50,
		color        		: "#ffffff",
		opacity      		: 8,
		speed        		: 10,
		size         		: 8,
		maxParticles 		: 4500,
		thresholdColor  	: "#ffffff",
		thresholdIntensity  : 10,
		isImage  			: false,
		dataUrl				: ""
	};


document.addEventListener('DOMContentLoaded', function(){
	if(window.location.hash != "" && window.location.hash.length >= 4){

		var request = new XMLHttpRequest();
		request.open("POST", "requests/getCard.php", true);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		var cardId = window.location.hash.slice(1);
		request.send(cardId);

		request.onreadystatechange=function()
		{
			if (request.readyState==4 && request.status==200)
			{
				//The app can be started
				if(this.response!="null"){
					//All new settings are set in card var
					card = JSON.parse(this.response);
					changeBackground(card.image);
					loader = new PIXI.AssetLoader(["uploads/"+card.publicID+".png"]);
					loader.onComplete = function onAssetsLoaded(){
			    		init();
					}
				}
				else if(this.response=="null"){
					freshCard = true;
					changeBackground(2);
				}
				loader.load();
			}
		}

	}
	else{
		freshCard = true;
		loader.load();
		changeBackground(2);
	}
});



// If the user change the background
function changeBackground(which){
	var newBg = which || ctrl.image;
	document.getElementById("background").style.backgroundImage = "url(img/bg"+newBg+".jpg)";
}
