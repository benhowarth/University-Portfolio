$(function(){
	$("#dungeonHolder").draggable();
	var qDlg=$("#questionDialog");
	qDlg.dialog({
		autoOpen:false,
		title:"Question x",
		closeText:"X",
		modal:true,
		closeOnEscape: false,
		   open: function(event, ui)
		   {
			  $(".ui-dialog-titlebar-close").hide();
		   }
	});
	var gDlg=$("#gameOverDialog");
		gDlg.dialog({
			autoOpen:false,
			title:"Game Over!",
			closeText:"X",
			modal:true,
			closeOnEscape: false,
			open: function(event, ui) { $(".ui-dialog-titlebar-close", ui.dialog | ui).hide(); }

		});
	function questionDisplay(q,qNum,a1,a2,a3){
		qDlg.dialog("option","title","Question "+qNum);
		$("#questionDialogText").text(q);
		qDlg.dialog("option","buttons",[
			{
				text:a1,
				click:function(){dungeon.answer(0);$(this).dialog("close");}
			},
			{
				text:a2,
				click:function(){dungeon.answer(1);$(this).dialog("close");}
			},
			{
				text:a3,
				click:function(){dungeon.answer(2);$(this).dialog("close");}
			}/*,
			{
				text:"wrong",
				click:function(){dungeon.answer(50);$(this).dialog("close");}
			}*/
		]);
		qDlg.dialog("option","width",200);
		qDlg.dialog("option","position",[0,150]);
		qDlg.dialog("open");
	}
	function gameOverDisplay(score,level){
		console.log("game over");
		console.log(level);
		console.log(score);
		$("#gameOverText").text("You got to level "+level+"! And scored "+score+"!");
		$("#scoreEnd").hide();
		$("#levelEnd").hide();
		$("#scoreEnd").val(score);
		$("#levelEnd").val(level);
		gDlg.dialog("option","buttons",[
			{
				text:"OK",
				click:function(){submitScore($("#nameInput").val(),level,score);$(this).dialog("close");}
			}
		]);
		gDlg.dialog("option","width",200);
		gDlg.dialog("option","position",[0,150]);
		gDlg.dialog("open");
	}
	
	function submitScore(name,level,score){
		$("#scoreForm").submit();
	}
	
	//questionDisplay("question",2,"a","b","c");


	function px2em(px) {
		px=parseInt(px,10);
		em=px/16;
		return em;
	}

	$(window).load(function() {
		keysSetup=false;
		//dungeon object
		$("#score").text("Score: 0\nLevel: 1\nQuestions Left: null");
		
		dungeon=
		{
			width:50,
			height:20,
			ar:[],
			rooms:[],
			roomsPrint:function(){
				for(i=0;i<dungeon.rooms.length;i++){
					//console.log("Room"+i+" has top left of ("+dungeon.rooms[i][0][0]+", "+dungeon.rooms[i][0][1]+"), top right of ("+dungeon.rooms[i][1][0]+", "+dungeon.rooms[i][1][1]+"),bottom left of ("+dungeon.rooms[i][2][0]+", "+dungeon.rooms[i][2][1]+"), bottom right of ("+dungeon.rooms[i][3][0]+", "+dungeon.rooms[i][3][1]+")");
				}
			},
			roomPrint:function(i){
				if(i<=dungeon.rooms.length-1&&i>=0){
					//console.log("Room"+i+" has top left of ("+dungeon.rooms[i][0][0]+", "+dungeon.rooms[i][0][1]+"), top right of ("+dungeon.rooms[i][1][0]+", "+dungeon.rooms[i][1][1]+"),bottom left of ("+dungeon.rooms[i][2][0]+", "+dungeon.rooms[i][2][1]+"), bottom right of ("+dungeon.rooms[i][3][0]+", "+dungeon.rooms[i][3][1]+")");
				}
				else{
					//console.log("Room does not exist");
				}
			},
			player:{
				x:0,
				y:0,
				canMove:true,
				moved:false,
				score:0,
				level:1,
				moveTo:function(wantX,wantY){
					if(wantX>=0&&wantX<dungeon.width&&wantY>=0&&wantY<dungeon.height&&dungeon.player.canMove){
						if(dungeon.ar[Math.floor(wantX)][Math.floor(wantY)]!=" "||dungeon.ar[Math.floor(wantX)][Math.floor(wantY)]=="0"){
							dungeon.player.x=wantX;
							dungeon.player.y=wantY;
							dungeon.player.moved=true;
						}
						else{dungeon.player.moved=false;}
						if(dungeon.ar[Math.floor(wantX)][Math.floor(wantY)]=="?")
						{
							dungeon.player.canMove=false;
							//console.log("Question!");
							dungeon.question();
						}
						dungeon.render();
					}
					else{dungeon.player.moved=false;}
				},
				move:function(dir){
					//up
					if(dir=="up"){dungeon.player.moveTo(dungeon.player.x,dungeon.player.y-1);if(dungeon.player.moved){dungeon.move(0,1);}}
					//down
					else if(dir=="down"){dungeon.player.moveTo(dungeon.player.x,dungeon.player.y+1);if(dungeon.player.moved){dungeon.move(0,-1);}}
					//left
					else if(dir=="left"){dungeon.player.moveTo(dungeon.player.x-1,dungeon.player.y);if(dungeon.player.moved){dungeon.move(1,0);}}
					//right
					else if(dir=="right"){dungeon.player.moveTo(dungeon.player.x+1,dungeon.player.y);if(dungeon.player.moved){dungeon.move(-1,0);}}
			
				},
				checkFinishLevel:function(){
					if(dungeon.questionsLeft==0){
						console.log(dungeon.questionsLeft,oldScore,dungeon.player.score)
						if(dungeon.player.score-oldScore>0){
							//console.log("Level completed!");
							//console.log("Your final score is "+dungeon.player.score+"!");
							dungeon.clear();
							dungeon.player.level++;
							$("#score").text("Score: "+dungeon.player.score+"\nLevel: "+dungeon.player.level+"\nQuestions Left: "+dungeon.questionsLeft);
							dungeonGen(dungeon);
						}
						else{
							console.log(dungeon.player.score,dungeon.player.level);
							dungeon.player.gameOver();
						}
					}
				},
				questionCorrect:function(){
					dungeon.player.canMove=true;
					dungeon.ar[dungeon.player.x][dungeon.player.y]=".";
					dungeon.player.score+=dungeon.timeLeft;
					dungeon.timer("stop");
					console.log("Question correct!");
					//alert(0);
					//alert("Question correct!");
					dungeon.questionsLeft--;
					questionNo++;
					//console.log("Your score is "+dungeon.player.score+"!");
					$("#score").text("Score: "+dungeon.player.score+"\nLevel: "+dungeon.player.level+"\nQuestions Left: "+dungeon.questionsLeft);
					dungeon.player.checkFinishLevel();
				},
				questionIncorrect:function(){
					dungeon.player.canMove=true;
					dungeon.ar[dungeon.player.x][dungeon.player.y]=".";
					dungeon.timer("stop");
					console.log("Question incorrect!");
					//alert("Question incorrect!");
					dungeon.questionsLeft--;
					questionNo++;
					//console.log("Your score is "+dungeon.player.score+"!");
					$("#score").text("Score: "+dungeon.player.score+"\nLevel: "+dungeon.player.level+"\nQuestions Left: "+dungeon.questionsLeft);
					dungeon.player.checkFinishLevel();
				},
				gameOver:function(){
					dungeon.player.canMove=false;
					gameOverDisplay(dungeon.player.score,dungeon.player.level);
					//$("#questionDialogText").dialog("open");
				}
			},
			
			//returns full dungeon in a printable form
			fullText:function(){
				dungeonText="";
				for(y=0;y<this.height;y++)
				{
					for(x=0;x<this.width;x++)
					{
						if(x==dungeon.player.x&&y==dungeon.player.y){
							dungeonText+="@";
						}
						else{
							dungeonText+=this.ar[x][y];
						}
					}
					dungeonText+="\n";
				}
				return dungeonText;
			},
		
			move:function(x,y){
				dunLeft=px2em($("#dungeonHolder").css("marginLeft"));
				dunTop=px2em($("#dungeonHolder").css("marginTop"));
				//console.log(dunLeft,dunTop);
				//console.log(x,y);
				//console.log(dunLeft+x,dunTop+y);
				dunLeft=dunLeft+0.6*x;
				dunTop=dunTop+0.6*y;
				//console.log(dunLeft,dunTop);
				$("#dungeonHolder").css("marginLeft",dunLeft+"em");
				$("#dungeonHolder").css("marginTop",dunTop+"em");
			},
			
			//builds room, column by column from left to right, with top left coord (xPos,yPos) and width of w and height of h
			makeRoom:function(xPos,yPos,w,h){
				dungeon.rooms.push([
					//top left
					[xPos,yPos],
					//top right
					[xPos+w,yPos],
					//bottom left
					[xPos,yPos+h],
					//bottom right
					[xPos+w,yPos+h]
				]);
				for(x=0;x<w;x++)
				{
					for(y=0;y<h;y++)
					{
						//dungeon.ar[Math.floor((xPos)+x)][Math.floor((yPos)+y)]=(dungeon.rooms.length-1);
						dungeon.ar[Math.floor((xPos)+x)][Math.floor((yPos)+y)]=".";
						//console.log(Math.floor((yPos)+y)+", "+Math.floor((xPos)+x));
					}
				}
			},
			makeCorridor:function(x1,y1,x2,y2){
				corridorXDir=0;
				corridorL=0;
				corridorYDir=0;
				corridorH=0;
				if(x1<x2){
					corridorXDir=1;
					corridorL=x2-x1;
				}
				else if(x1>x2){
					corridorXDir=-1;
					corridorL=x1-x2;
				}
				else{
					corridorXDir=0;
					corridorL=0;
				}
				if(y1<y2){
					corridorYDir=1;
					corridorH=y2-y1;
				}
				else if(y1>y2){
					corridorYDir=-1;
					corridorH=y1-y2;
				}
				else{
					corridorYDir=0;
					corridorH=0;
				}
				for(x=0;x<corridorL+1;x++){
					dungeon.ar[x1+(x*corridorXDir)][y1]=".";
				}
				for(y=0;y<corridorH+1;y++){
					dungeon.ar[x2][y1+(y*corridorYDir)]=".";
				}
			},
			
			questionGen:function(){
				levelNo=dungeon.player.level;
				if(levelNo==1){problem=adSubGen();}
				else if(levelNo==2){problem=multiplyGen();}
				else if(levelNo==3){problem=percentageGen();}
				else if(levelNo==4){problem=quadraticGen();}
				return problem;
			},
			
			timeLeft:10,
			
			question:function(){
				questionVar=dungeon.questionGen();
				question=questionVar[0];
				answers=questionVar[1];
				correctIndex=questionVar[2];
				//console.log(question,answers,correctIndex);
				dungeon.timer("start");
				questionDisplay(question,questionNo,answers[0],answers[1],answers[2]);
			},
			
			timer:function(whatDo){
				//console.log(whatDo);
				if(whatDo=="start"){
					$("#questionDialogTimer").text("Time left: "+dungeon.timeLeft);
					timerInterval=window.setInterval(function(){
						$("#questionDialogTimer").text("Time left: "+dungeon.timeLeft);
						dungeon.timeLeft--;
						console.log(dungeon.timeLeft);
						if(dungeon.timeLeft==0){
							dungeon.player.questionIncorrect();
						}
					},1000)
				}
				else if(whatDo=="stop"){
					//console.log(100);
					window.clearInterval(timerInterval);
					dungeon.timeLeft=10;
					$("#questionDialog").dialog("close");
				}
			},
			
			answer:function(userAnswer){
				if(String(userAnswer)==correctIndex){
					dungeon.player.questionCorrect();
				}
				else{
					dungeon.player.questionIncorrect();
				}
			},
			
			render:function(){
				$("#dungeonHolder").text(dungeon.fullText());
			},
			clear:function(){
				for(x=0;x<dungeon.width;x++)
				{
					for(y=0;y<dungeon.height;y++)
					{
						//dungeon.ar[Math.floor((xPos)+x)][Math.floor((yPos)+y)]=(dungeon.rooms.length-1);
						dungeon.ar[x][y]=" ";
						//console.log(Math.floor((yPos)+y)+", "+Math.floor((xPos)+x));
					}
				}
				dungeon.rooms=[];
			}
		};

		
		function dungeonGen(dungeonObj)
		{
			//console.log(dungeonObj.ar);
			//add row, add all blocks in row, by column
			for(x=0;x<dungeonObj.width;x++)
			{
				dungeonObj.ar.push([]);
				for(y=0;y<dungeonObj.height;y++)
				{
					//initialise all grid as floor
					dungeonObj.ar[x].push(" ");
				}
			}
			//in middle-ish of dungeon build a room that's a fifth-ish of the width and height(starting room)
			dungeonObj.makeRoom(dungeonObj.width/2-dungeonObj.width/5/2,dungeonObj.height/2-dungeonObj.height/5/2,dungeonObj.width/5,dungeonObj.height/5);
			
			//dungeonObj.makeRoom(8,8,2,2);
			//dungeonObj.player.moveTo(8,8);
			dungeonObj.player.moveTo(dungeonObj.width/2-dungeonObj.width/5/2,dungeonObj.height/2-dungeonObj.height/5/2);
			//dungeonObj.move(0,0);
			//dungeonObj.move(dungeonObj.width/2+dungeonObj.width/5/2,dungeonObj.height/2+dungeonObj.height/5/2);
			
			
			//no of rooms (not including start room)
			roomNo=5;
			
			for(k=0;k<roomNo;k++){
				roomGened=false;
				while(!roomGened){
					//console.log("k",k);
					rW=Math.floor(Math.random()*(dungeonObj.width-1)/1.5)+2;
					rH=Math.floor(Math.random()*(dungeonObj.height-1)/1.5)+2;
					rX=Math.floor(Math.random()*(dungeonObj.width-1)-rW);
					rY=Math.floor(Math.random()*(dungeonObj.height-1)-rH);
					if(rW<0){rW=0;}
					if(rH<0){rH=0;}
					if(rX<0){rX=0;}
					if(rY<0){rY=0;}
					room=[
						//top left
						[rX,rY],
						//top right
						[rX+rW,rY],
						//bottom left
						[rX,rY+rH],
						//bottom right
						[rX+rW,rY+rH]
					];
					

					roomIntersects=false;
					//console.log("XS",room[0][0],"YS",room[0][1],"VAL",dungeon.ar[room[0][0]][room[0][1]]);
					//console.log("W",room[1][0]-room[0][0]);
					//console.log("H",room[3][1]-room[0][1]);
					//for width of room
					for(x=0;x<room[1][0]-room[0][0];x++)
					{
						//for height of room
						for(y=0;y<room[3][1]-room[0][1];y++)
						{
							//console.log("X",room[0][0]+x,"Y",room[0][1]+y,"VAL",dungeon.ar[room[0][0]+x][room[0][1]+y]);
							if((dungeon.ar[room[0][0]+x][room[0][1]+y]!=" ")||(dungeon.ar[room[0][0]+x][room[0][1]+y]=="0"))
							{
								//console.log("INTERSECT DETECTED");
								roomIntersects=true;
							}
						}
					}
					
					
					if(!roomIntersects){
						dungeonObj.makeRoom(rX,rY,rW,rH);
						//console.log("MADE ROOM AT",rX,rY,rW,rH);
						roomGened=true;
					}
				}
				//console.log("END OF ROOM GEN");
				//console.log(roomNo);
				dungeonObj.roomsPrint();
			}
			
			//make corridors between rooms
			for(i=0;i<dungeonObj.rooms.length-1;i++){
				dungeonObj.makeCorridor(dungeonObj.rooms[i][0][0],dungeonObj.rooms[i][0][1],dungeonObj.rooms[i+1][0][0],dungeonObj.rooms[i+1][0][1]);
			}
			
			questionNo=5;
			dungeonObj.questionsLeft=0;
			questionFractionX=parseInt(dungeonObj.width/5);
			for(i=0;i<questionNo;i++){
				for(x=i*questionFractionX;x<(i+1)*questionFractionX;x++)
				{
					//console.log("XQ: "+x);
					for(y=0;y<dungeonObj.height;y++)
					{
						if(questionNo>0){
							if((dungeonObj.ar[x][y]==".")&&(Math.random()<0.05)&&(x!=dungeonObj.player.x)&&(y!=dungeonObj.player.y))
							{
								dungeonObj.ar[x][y]="?";
								questionNo--;
								dungeonObj.questionsLeft++;
								x=(i+1)*questionFractionX;
							}
						}
					}
				}
			}
			questionNo=1;
			oldScore=dungeon.player.score;
			if(!keysSetup){
				//if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
					speed=100;
					//up
					$("#btnUp").on("touchstart",function(){dungeonObj.player.move("up");playerMoveUp=setInterval(function(){dungeonObj.player.move("up");},speed);});
					$("#btnUp").on("touchend",function(){clearInterval(playerMoveUp);});
					//down
					$("#btnDown").on("touchstart",function(){dungeonObj.player.move("down");playerMoveDown=setInterval(function(){dungeonObj.player.move("down");},speed);});
					$("#btnDown").on("touchend",function(){clearInterval(playerMoveDown);});
					//left
					$("#btnLeft").on("touchstart",function(){dungeonObj.player.move("left");playerMoveLeft=setInterval(function(){dungeonObj.player.move("left");},speed);});
					$("#btnLeft").on("touchend",function(){clearInterval(playerMoveLeft);});
					//right
					$("#btnRight").on("touchstart",function(){dungeonObj.player.move("right");playerMoveRight=setInterval(function(){dungeonObj.player.move("right");},speed);});
					$("#btnRight").on("touchend",function(){clearInterval(playerMoveRight);});
					
				/*}
				else{
					//up
					$("#btnUp").on("click",function(){dungeonObj.player.move("up");});
					//down
					$("#btnDown").on("click",function(){dungeonObj.player.move("down");});
					//left
					$("#btnLeft").on("click",function(){dungeonObj.player.move("left");});
					//right
					$("#btnRight").on("click",function(){dungeonObj.player.move("right");});
				}*/
				
				
				$("html").keydown(function(e){
					//up
					if(e.keyCode==87||e.keyCode==38){dungeonObj.player.move("up");}
					//down
					else if(e.keyCode==83||e.keyCode==40){dungeonObj.player.move("down");}
					//left
					else if(e.keyCode==65||e.keyCode==37){dungeonObj.player.move("left");}
					//right
					else if(e.keyCode==68||e.keyCode==39){dungeonObj.player.move("right");}
				});
				keysSetup=true;
			}
			$("#score").text("Score: "+dungeon.player.score+"\nLevel: "+dungeon.player.level+"\nQuestions Left: "+dungeon.questionsLeft);
			//console.log(dungeonObj.fullText());
			dungeonObj.render();
		}
		
		dungeonGen(dungeon);
	});
});