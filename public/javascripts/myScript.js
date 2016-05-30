var player = 1; //to check whether it is a player 1 or player 2 move
var red = 1;
var yellow = 2;
var current_col; //column over which to put the chip
var player1_name;
var player2_name;
var num_moves = 0;
var player1_win_count = 0;
var player2_win_count = 0;

var col = new Array(0,0,0,0,0,0,0);
//make each cell empty
col[0] = new Array(0,0,0,0,0,0);
col[1] = new Array(0,0,0,0,0,0);
col[2] = new Array(0,0,0,0,0,0);
col[3] = new Array(0,0,0,0,0,0);
col[4] = new Array(0,0,0,0,0,0);
col[5] = new Array(0,0,0,0,0,0);
col[6] = new Array(0,0,0,0,0,0);

//array to keep track of the height of the column
var height = new Array(6,6,6,6,6,6,6);

function footer_info() {
	if(document.lastModified) {
		document.getElementById('last_modified').innerHTML = "Last Modified: " + new Date(document.lastModified).toLocaleString();
	}
}

//Function to reset the game board and some variables without refreshing the page
function reset () {
	//if there are chips on the board - remove all
	var any_chip = document.getElementById("chip");
	if (any_chip !== null) {
		var parent_div = document.getElementById('chipcontainer');
		while ( parent_div.firstChild ) parent_div.removeChild( parent_div.firstChild );

		for(var i = 0; i<7; i++) {
			for(var j = 0; j<6; j++) {
				col[i][j] = 0;
			}
			height[i] = 6;
		}
		num_moves = 0;
		player = 1;
	}
}

//Function to update the scores in score table
function update_score () {
	document.getElementById("table_p1_score").innerHTML= player1_win_count;
	document.getElementById("table_p2_score").innerHTML= player2_win_count;
}

//Function to start the NEW game (scores will be reset)
function start () { 

	//Reset board and variables
	reset();

	//Check whether names have been entered
	var x = document.getElementById("p1name").value;
	var y = document.getElementById("p2name").value;
	if ((x == null || x == "") || (y == null || y == ""))  {
		alert("Name must be filled out");
		return false;
	}

	//New game - so scores are reset
	player1_win_count = 0;
	player2_win_count = 0;

	player1_name = document.getElementById("p1name").value;
	player2_name = document.getElementById("p2name").value;
	document.getElementById("table_p1_name").innerHTML= player1_name;
	document.getElementById("table_p2_name").innerHTML= player2_name;

	document.getElementById("move_names").innerHTML = ( "It's now "+ player1_name + "'s move" );

	opponent = document.getElementById("opponent").value;

	//Enable clicks on the board
	document.getElementById("myTable").style.pointerEvents = "all";

	update_score();
}


//TAKEN FROM: http://www.srccodes.com/p/article/40/determine-click-position-row-column-number-onclick-table-cell     
$(document).ready(function(){
	$("#myTable td").click(function() {     
		current_col = parseInt( $(this).index() );
		var row_num = parseInt( $(this).parent().index() )+1;    

		putChip();
	});  
});


//Computer randomly chooses the column to drop the chip
function computer_move() {
	do {
		current_col = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
	}
	while (height[current_col]==0);
	putChip(); 

}

//Fucntion to place the chip into the table, update variables and call CheckWin function
function putChip() {
	if (height[current_col]==0) {alert("This column is full"); return;}


	var row = 6-height[current_col];
	if(player%2==0) { //player 2 move
		document.getElementById("chipcontainer").innerHTML = document.getElementById("chipcontainer").innerHTML + '<div id="chip"; style="position:absolute; top:'+(height[current_col]*83.3-82)+'px; left: '+(current_col*82.85)+'px;"><img src="../images/yellowchip.png" width=81 height=81> </div>';
		col[current_col][row] = 2;
		num_moves+=1;
		height[current_col]-=1;
		if (num_moves>6) { 
			if(checkwin() == true) {
				var win = window.open('http://localhost:3000/lose', '_blank');
				if(win){
    				//Browser has allowed it to be opened
   					win.focus();
				}else{
    				//Broswer has blocked it
    				alert('Please allow popups for this site');
				}
				alert(player2_name + " wins!!!"); 
				player2_win_count+=1;
				update_score();
				reset();
				return;
			}
		}
		player+=1;
		document.getElementById("move_names").innerHTML = ( "It's now "+ player1_name + "'s move" ); 
	}

	else { //player 1 move
		document.getElementById("chipcontainer").innerHTML = document.getElementById("chipcontainer").innerHTML + '<div id="chip"; style="position:absolute; top:'+(height[current_col]*83.3-82)+'px; left: '+(current_col*82.85)+'px;"><img src="../images/redchip.png" width=81 height=81> </div>';
		col[current_col][row] = 1;
		num_moves+=1;
		height[current_col]-=1;
		if (num_moves>6) { 
			if(checkwin() == true) {
				var win = window.open('http://localhost:3000/win', '_blank');
				if(win){
    				//Browser has allowed it to be opened
   					win.focus();
				}else{
    				//Broswer has blocked it
    				alert('Please allow popups for this site');
				}
				alert(player1_name + " wins!!!"); 
				player1_win_count+=1;
				update_score();
				reset();
				return;
			}
		}
		player+=1;
		document.getElementById("move_names").innerHTML = ( "It's now "+ player2_name + "'s move" ); 

		if (opponent==1) {
			computer_move();
		}
	}
}

//Fucntion to check the game board for WIN combinations
function checkwin() {
	var win = false;

	if((height[0]==0) && (height[1]==0) && (height[2]==0) && (height[3]==0) && (height[4]==0) && (height[5]==0) && (height[6]==0)) {
		alert("IT'S A DRAW!!!!!");
		return false;
	}

	var i,j,k,count;

	//TAKEN FROM: http://stackoverflow.com/questions/25289526/connect-4-check-if-player-wins
	//AND THEN MODIFIED TO FIT THIS CODE
    //checks horizontal win - WORKS!
    for(i=0;i<6;i++) {
    	for(j=0;j<6-2;j++)
    		if(col[j][i] != 0 && col[j][i]==col[j+1][i] && col[j][i]==col[j+2][i] && col[j][i]==col[j+3][i])
    			win = true;
    	}

    //checks vertical win - WORKS!
    for(i=0;i<6-3;i++) {
    	for(j=0;j<7;j++)
    		if(col[j][i] != 0 && col[j][i]==col[j][i+1] && col[j][i]==col[j][i+2] && col[j][i]==col[j][i+3])
    			win = true;
    	}

    //checks rigth diagonal win - WORKS!
    for(i=0;i<6-3;i++) {
    	for(j=0;j<7-3;j++)
    		if(col[j][i] != 0 && col[j][i]==col[j+1][i+1] && col[j][i]==col[j+2][i+2] && col[j][i]==col[j+3][i+3])
    			win = true;
    	}

    //checks left diagonal win - WORKS!
    for(i=0;i<6-3;i++) {
    	for(j=3;j<7;j++)
    		if(col[j][i] != 0 && col[j][i]==col[j-1][i+1] && col[j][i]==col[j-2][i+2] && col[j][i]==col[j-3][i+3])
    			win = true;
    	}

    	return win;
    }
