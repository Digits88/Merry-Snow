
		/* =========================== */
		/* ========= DAT GUI ========= */
		/* =========================== */
		function Ctrl(){
			this.bgAnimate          = card.bgAnimate;
			this.image          	= card.image;
			this.text               = card.message;
			this.fontSize           = card.messageSize;
			this.font               = card.messageFont;
			this.fontColor          = card.messageColor;
			this.color              = card.color;
			this.opacity            = card.opacity;
			this.speed              = card.speed;
			this.size               = card.size;
			this.maxParticles       = card.maxParticles;
			this.thresholdColor     = card.thresholdColor;
			this.thresholdIntensity = card.thresholdIntensity;
			this.clear = clearSnow;
		}
		var ctrl, guiTxt, guiSnow, controller;
		function initGui(){
			ctrl = new Ctrl;
			if(freshCard){
				gui  = new dat.GUI;
				guiBg = gui.addFolder("Background");
					guiBg.add(ctrl, "bgAnimate");
					guiBg.add(ctrl, "image", 1, 4).step(1).onChange(changeBackground);
					guiBg.open();
				guiTxt = gui.addFolder("Message");
					guiTxt.add(ctrl, "text").onFinishChange(resetTxt);
					guiTxt.add(ctrl, "font",["homestead", "geared", "mountain"]).onFinishChange(resetTxt);
					guiTxt.add(ctrl, "fontSize", 10, 100).step(1).onFinishChange(scaleTxt);
					guiTxt.addColor(ctrl, "fontColor").onChange(fontColor);
					guiTxt.open();
				guiSnow = gui.addFolder("Snow");
					guiSnow.add(ctrl, "maxParticles", 100, 10000).step(1);
					guiSnow.addColor(ctrl, "color").onChange(colorChange);
					guiSnow.add(ctrl, "opacity", 1, 10).step(1);
					guiSnow.add(ctrl, "speed", 1, 100).step(1);
					guiSnow.add(ctrl, "size", 1, 20).step(1);
					guiSnow.add(ctrl, "clear");
					guiSnow.open();
				guiImg = gui.addFolder("Uploaded Image");
				document.getElementsByClassName('dg')[document.getElementsByClassName('dg').length-1].querySelectorAll('.title')[0].insertAdjacentHTML('afterend', "<li class='cr function'><div><span class='property-name'>UploadFile</span><input type='file' id='fileUpload'></div></li>");
				loadEventForFile();
				guiImg.add(ctrl, "thresholdIntensity",0,120).onFinishChange(uploadFile.changeThresholdIntensity);
				guiImg.addColor(ctrl, "thresholdColor").onChange(uploadFile.changeThresholdColor);
				guiImg.open();
				// gui.close();
			}
		}

		//Constants
		var ww       	  = window.innerWidth,
			wh            = window.innerHeight,
			wish          = {dragging:false},
			flakes        = new PIXI.SpriteBatch(),
			flake         = new PIXI.Graphics(),
			drawContainer = new PIXI.DisplayObjectContainer(),
			canvas        = document.createElement("canvas"),
			ctx           = canvas.getContext("2d"),
			pixData       = [],
			draw  	 	  = new PIXI.Graphics(),
			isMouseDown   = false,
			mousePos 	  = {x:0,y:0},
			bgPos 	      = {x:0,y:0},
			size   	 	  = {width: 900, height: 600},
			dataUrl  	  = "";

		var stage         = new PIXI.Stage();

	    var renderer = PIXI.autoDetectRenderer(size.width, size.height, {transparent: true, antialias: true});

	 
	    document.body.appendChild(renderer.view);
	    function init(){

	    	document.getElementById("loader").style.opacity = 0;
	    	setTimeout(function(){
	    		document.getElementById("loader").style.zIndex = -1;
	    	},500);

	    	if(card.isImage==true){
	    		uploadFile.img = new Image();
	    		uploadFile.img.onload = function(){uploadFile.createImageInScene();};
				uploadFile.img.src = "uploads/"+card.publicID+".png";
				card.thresholdIntensity = 0;
	    	}

	    	initGui();


	    	if(freshCard){
		    	//Create message
			    resetTxt();
		   		stage.addChild(wish);


				stage.mousedown  = createPath;              
				stage.mouseup    = mouseupoutside = closePath;
				document.onkeydown = KeyPress;
			
				//Display save button
				document.getElementById("save").style.display = "block";
				document.getElementById("fileUpload").style.display = "block";
		   	}
		   	else{

    			document.getElementById("create").style.display = "block";
		   		loadedCardTxt = PIXI.Texture.fromImage("uploads/"+card.publicID+".png");
				loadedCard = new PIXI.Sprite(loadedCardTxt);
				loadedCard.position = {x:0,y:0};
				stage.addChild(loadedCard);
				toImageData();
		   	}

		 	//Add merry & particles in the stage
		    stage.addChild(flakes);
			stage.addChild(drawContainer);

		    //Create new flake texture
			flake.beginFill("0x"+ctrl.color.slice(1));
			flake.drawCircle(0, 0, 10);
			flake.endFill();
			flake = flake.generateTexture();


		    //Event listener on stage
			stage.mousemove  = stage.touchmove= getPosition;
			stage.touchstart = getPosition;

			//Create pixel data
			toImageData();

		    requestAnimFrame(animate);
	    }

	    function makeMeDraggable(who){
			who.anchor.x = .5;
		    who.anchor.y = .5;

			who.interactive = true;
		    who.buttonMode = true;
		    who.dragging = false;

			 who.mousedown = who.touchstart = function(data){
	            data.originalEvent.preventDefault();
	            this.data = data;
	            this.alpha = 0.6;
	            this.dragging = this.data.getLocalPosition(this.parent);
        	};
        	who.mouseup = who.mouseupoutside = who.touchend = who.touchendoutside = function(data){
	            data.originalEvent.preventDefault();
	            this.data = null;
	            this.alpha = 1;
	            this.dragging = false;
	            toImageData();
        	};
			
			who.mousemove = who.touchmove = function(data)
	        {
	            if(this.dragging){
	                var newPosition = this.data.getLocalPosition(this.parent);
	                this.position.x += (newPosition.x - this.dragging.x);
                	this.position.y += (newPosition.y - this.dragging.y);
                	this.dragging = newPosition;
	            }
	        }
		}
	 
	    function animate() {
	        requestAnimFrame(animate);

	 		for(var i = 0, j = flakes.children.length;i<j;i++){
	 			var flake = flakes.children[i];
	 			if(flake.position.y+.8 <= flake.direction && (flake.position.y+flake.speed) < flake.direction){
	 				flake.position.y += flake.speed;
	 			}
	 			else{
	 				flake.position.y = flake.direction;
	 			}
	 			if(flakes.children.length > ctrl.maxParticles){
					flake.alpha -= .01;
					if(flake.alpha<=.05){
						flakes.children.splice(i,1);
						j--;
					}
				}
	 		}
	 		if(ctrl.bgAnimate){
		 		bgPos.x +=  (((mousePos.x)-ww/2)/40 - bgPos.x)*0.05;
		 		bgPos.y +=  (((mousePos.y)-wh/2)/40 - bgPos.y)*0.05;
		 		bgPos.x = parseInt(bgPos.x*100)/100;
		 		bgPos.y = parseInt(bgPos.y*100)/100;
		 		document.getElementById("background").style.transform = "translate3d("+bgPos.x+"px,"+bgPos.y+"px,0)";
	 		}

	        //Render the stage   
	        renderer.render(stage);
	    }

	    function getPosition(e){
			var mouse  = e.getLocalPosition(stage);

			var mouseX = mousePos.x = mouse.x;
			var mouseY = mousePos.y = mouse.y;

			if(!uploadFile.pixiSprite.dragging && !wish.dragging && !isMouseDown){
				createParticle(mouseX, mouseY);
			}
			else if(!uploadFile.pixiSprite.dragging && !wish.dragging && isMouseDown){
				createDraw(mouseX, mouseY);
			}
		}

	    function createParticle(mX, mY){
	    	mX = parseInt(mX);
	    	mY = parseInt(mY);
			//Set random value for new flake
			random = Math.random()*(ctrl.size/10)+.1;
			var destination;
			for(var i=mY;i<size.height;i++){
				if(pixData[(( mX+(size.width*i) )*4+3)] > 128 //if there is an none transparent pixel under
					&&
					pixData[((mX+(mY*size.width))*4+3)] < 128){//If mouse on opaque pixel
					destination = parseInt(i-1);
					i=size.height;
				}
				else{destination = size.height;}
			}
			
			var nflake = new PIXI.Sprite(flake);

			nflake.anchor.x = .5;
			nflake.anchor.y = .9;
			nflake.position.x = mX;
			nflake.position.y = mY;
			nflake.scale = {x: 	random, y:random};

			nflake.speed = Math.random()*(ctrl.speed/10)+.4;
			nflake.alpha = Math.random()*(ctrl.opacity/10);
			nflake.direction = destination;

		    flakes.addChild(nflake);

	    }

	    function clearSnow(){
	    	flakes.removeChildren();
	    }

	    function createPath(e){
	    	isMouseDown = true;
	    	var mouse  = e.getLocalPosition(stage);
	    	draw = new PIXI.Graphics();
	    	draw.moveTo(mouse.x, mouse.y);
	    	draw.origin = [mouse.x, mouse.y];
	    	draw.previousCoord = [mouse.x, mouse.y];
	    	randomColor = "0xff"+parseInt((Math.random()*256)).toString(16)+"00";
	    	draw.lineStyle(3, randomColor, 1);
	    	drawContainer.addChild(draw);
	    }
	    function closePath(){
	    	if(draw.origin[0] == draw.previousCoord[0] && draw.origin[1] == draw.previousCoord[1]){
	    		drawContainer.removeChild(draw);
	    	}
	    	else{
		    	stage.removeChild(flakes);
				toImageData();
				stage.addChild(flakes);
	    	}
	    	isMouseDown = false;
	    }

	    function createDraw(mX, mY){
	    	draw.moveTo(draw.previousCoord[0], draw.previousCoord[1]);
	    	draw.lineTo(mX, mY);
	    	draw.previousCoord = [mX, mY];
	    }

	    function toImageData(){
			canvas.width = size.width;
			canvas.height = size.height;
			var image = new Image();
			image.width = size.width;
			image.height = size.height;
			image.onload = function(){
				ctx.drawImage(image,0,0, size.width, size.height);
				pixData = ctx.getImageData(0, 0, size.width, size.height).data;

				var destination;
				for(var k=0, j=flakes.children.length;k<j;k++){
					var flake = flakes.children[k];
					var pos = {
						x : flake.position.x,
						y : parseInt(flake.position.y)
					}
					flake.direction = size.height;
					for(var i=pos.y;i<size.height;i++){
						if(pixData[((pos.x+(i*size.width))*4+3)] > 128 &&
							pixData[((pos.x+(pos.y*size.width))*4+3)] < 128){
							flake.direction = i-1;
							i=size.height;
						}
					}
				}
			}
			stage.removeChild(flakes);
			renderer.render(stage);
			stage.addChild(flakes);
			image.src = renderer.view.toDataURL('image/png');

	    }

		function scaleTxt(){
			wish.scale = { x: ctrl.fontSize/100, y : ctrl.fontSize/100 }
			toImageData();
		}
		function fontColor(){
			var newColor = "0x"+ctrl.fontColor.slice(1);
			wish.tint = newColor;
		}
		function resetTxt(){

			document.title = ctrl.text;


			stage.removeChild(wish);
			wish = new PIXI.BitmapText(ctrl.text, {font: "120px "+ctrl.font, align: "center"});
	     	wish = wish.generateTexture();
	     	wish = new PIXI.Sprite(wish);
	     	var newColor = "0x"+ctrl.fontColor.slice(1);
			wish.tint = newColor;

			stage.addChild(wish);

	        makeMeDraggable(wish);
		    
		    wish.position.x = (size.width/100*card.messagePositionX);
		    wish.position.y = (size.height/100*card.messagePositionY);

		    wish.scale = { x: ctrl.fontSize/100, y : ctrl.fontSize/100 }

			toImageData();
		}

		function colorChange(){
			flake = new PIXI.Graphics();
			flake.beginFill("0x"+ctrl.color.slice(1));
			flake.drawCircle(0, 0, 10);
			flake.endFill();
			flake = flake.generateTexture();
		}

		
	    //Start the scene
		var loader = new PIXI.AssetLoader(["fonts/homestead.fnt", "fonts/geared.fnt", "fonts/mountain.fnt"]);
		loader.onComplete = function onAssetsLoaded(){
    		init();
		}


		function KeyPress(e) {
			var evtobj = window.event? event : e;
			if(evtobj.keyCode == 90 && evtobj.ctrlKey){
				drawContainer.removeChildAt(drawContainer.children.length-1);
				toImageData();
			}
		}


		/* ======================= */
		/* ===== UPLOAD FILE ===== */
		/* ======================= */
		var  uploadFile = {pixiSprite:{dragging:false}};
		function loadEventForFile(){

			uploadFile = {
				canvas     : document.createElement("canvas"),
				file       : document.getElementById("fileUpload"),
				col        : {r:255, g:255, b:255},
				pixData    : undefined,
				inte       : 10,
				col 	   : {r:255, g:255, b:255},
				nCanvas    : document.createElement("canvas"),
				img        : new Image()
			}
			uploadFile.ctx  = uploadFile.canvas.getContext("2d");
			uploadFile.nCtx = uploadFile.nCanvas.getContext("2d");
			uploadFile.pixiTxt = new PIXI.Texture.fromImage("");
			uploadFile.pixiSprite = new PIXI.Sprite(uploadFile.pixiTxt);
			stage.addChild(uploadFile.pixiSprite);
			makeMeDraggable(uploadFile.pixiSprite);

			uploadFile.file.addEventListener("change", function(e){
				uploadFile.nCanvas = document.createElement("canvas");
				uploadFile.nCtx 	= uploadFile.nCanvas.getContext("2d");
				uploadFile.img	 	= new Image();

				//When image is loaded
				uploadFile.img.onload = function(){uploadFile.createImageInScene();};

				if(e.target.files[0]!=undefined){
					uploadFile.img.src = URL.createObjectURL(e.target.files[0]);
				}
			});
			uploadFile.createImageInScene = function(){

				if(uploadFile.img.height > 500) {
					uploadFile.img.width *= 500 / uploadFile.img.height;
					uploadFile.img.height = 500;
				}
				if(uploadFile.img.width > 500){
					uploadFile.img.height *= 500 / uploadFile.img.width;
					uploadFile.img.width = 500;
				}
				uploadFile.canvas.width  = uploadFile.nCanvas.width  = uploadFile.img.width;
				uploadFile.canvas.height = uploadFile.nCanvas.height = uploadFile.img.height;

				uploadFile.nCtx.drawImage(uploadFile.img, 0, 0, uploadFile.img.width, uploadFile.img.height);
				pixData = uploadFile.nCtx.getImageData(0, 0, uploadFile.canvas.width, uploadFile.canvas.height),
			    pix = pixData.data;
				for (var i = 0, n = pix.length; i <n; i += 4) {
				    var r = pix[i],g = pix[i+1],b = pix[i+2];
			        if(uploadFile.checkBackground(r,g,b)){ 
			            pix[i] = pix[i+1] = pix[i+2] = pix[i+3] = 0;
			        }
				}
				uploadFile.ctx.putImageData(pixData, 0, 0);
				dataUrl = uploadFile.canvas.toDataURL("image/png");
				var texture = PIXI.Texture.fromImage(dataUrl);
				uploadFile.pixiSprite.setTexture(texture);
			    uploadFile.pixiSprite.position.x = uploadFile.pixiSprite.width/2;
	   		 	uploadFile.pixiSprite.position.y = uploadFile.pixiSprite.height/2;
				uploadFile.ctx.clearRect(0,0, uploadFile.canvas.width, uploadFile.canvas.height);
				card.isImage = true;
			}

			uploadFile.changeThresholdColor = function(){
				var newColor = ctrl.thresholdColor.slice(1);
				uploadFile.col.r = parseInt(newColor.slice(0,2), 16);
				uploadFile.col.g = parseInt(newColor.slice(2,4), 16);
				uploadFile.col.b = parseInt(newColor.slice(4,6), 16);
				uploadFile.threshold();
			}
			uploadFile.changeThresholdIntensity = function(){
				uploadFile.inte = parseInt(ctrl.thresholdIntensity);
				uploadFile.threshold();
			};
			uploadFile.checkBackground = function(r,g,b){
				if(r >= (uploadFile.col.r-uploadFile.inte) && r <= (uploadFile.col.r+uploadFile.inte)){
					if(g >= (uploadFile.col.g-uploadFile.inte) && g <= (uploadFile.col.g+uploadFile.inte)){
						if(b >= (uploadFile.col.b-uploadFile.inte) && b <= (uploadFile.col.b+uploadFile.inte)){
							return true;
						}
						else{
							return false;
						}
					}
				}
			}

			uploadFile.threshold = function(){
				if(pixData!=undefined){
					pixData = uploadFile.nCtx.getImageData(0, 0, uploadFile.canvas.width, uploadFile.canvas.height),
				    pix = pixData.data;
					for (var i = 0, n = pix.length; i <n; i += 4) {
					    var r = pix[i],g = pix[i+1],b = pix[i+2];
				        if(uploadFile.checkBackground(r,g,b)){ 
				            pix[i] = pix[i+1] = pix[i+2] = pix[i+3] = 0;
				        }
					}
					uploadFile.ctx.putImageData(pixData, 0, 0);
					dataUrl = uploadFile.canvas.toDataURL("image/png");
					var texture = PIXI.Texture.fromImage(dataUrl);
					uploadFile.pixiSprite.setTexture(texture);
					uploadFile.ctx.clearRect(0,0, uploadFile.canvas.width, uploadFile.canvas.height);
					toImageData();
				}
			}
		}
