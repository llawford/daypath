var fixedCount = 0;
var anytimeCount = 0;
var fillCount = 0;

var ft_list = [];
var at_list = [];
var fl_list = [];

var dist = [];
var DISTANCE_REPLACE_LATER = 0;
var prev_loc = "";

var startTime = 0;
var locpairs = [];
var locations = [];


function addFixedTask(divname){
    var newdiv = document.createElement('div');
    newdiv.innerHTML = "<input type='text' id='fixed" + fixedCount + "' placeholder = 'ELEC374 Lecture'> from <input type='text' class = 'inputtime' id='fixedStart" + fixedCount + "' placeholder = '13:30'> to <input type='text' class = 'inputtime' id='fixedEnd" + fixedCount + "' placeholder = '14:20'> at <input type='text' id='fixedLoc" + fixedCount + "' placeholder = 'Walter Light Hall'>";
    document.getElementById(divname).appendChild(newdiv);
    fixedCount++;
}

function addAnytimeTask(divname){
    var newdiv = document.createElement('div');
    newdiv.innerHTML = "<input type='text' id='anytime" + anytimeCount + "' placeholder = 'Groceries'> for <input type='text' class = 'inputtime' id='anytimeDuration" + anytimeCount + "' placeholder = '0:45'> at <input type='text' id='anytimeLoc" + anytimeCount + "' placeholder = 'Metro Princess St.'>";
    document.getElementById(divname).appendChild(newdiv);
    anytimeCount++;
}

function addFillTask(divname){
    var newdiv = document.createElement('div');
    newdiv.innerHTML = "<input type='text' id='fill" + fillCount + "' placeholder = 'Read Cats 201 Ch. 3'> for <input type='text' class = 'inputtime'  id='fillDuration" + fillCount + "' placeholder = '1:20'>";
    document.getElementById(divname).appendChild(newdiv);
    fillCount++;
}

function submitForm(){
    
    
    for (i = 0;i < fixedCount;i++){
        var time1 = document.getElementById('fixedStart' + i).value.split(':');
        var time2 = document.getElementById('fixedEnd' + i).value.split(':');
        var start_minutes = +time1[0] * 60 + +time1[1];
        var duration = -start_minutes + (+time2[0] * 60) + +time2[1]; 
        
        if (ft_list.length == 0){
         ft_list[0] = [document.getElementById('fixed' + i).value,start_minutes,duration,document.getElementById('fixedLoc' + i).value];
        } else {
            var insertpos = 0;
            for (j = 0;j<ft_list.length;j++){ 
                if (start_minutes > ft_list[j][1]){
                    insertpos = j+1;
                }
            }
            ft_list.splice(insertpos,0,[document.getElementById('fixed' + i).value,start_minutes,duration,document.getElementById('fixedLoc' + i).value])
        }
    }
    
    for (i = 0;i < anytimeCount;i++){
        var time1 = document.getElementById('anytimeDuration' + i).value.split(':');
        var duration = +time1[0] * 60 + +time1[1];
        
        at_list[i] = [document.getElementById('anytime' + i).value,duration,document.getElementById('anytimeLoc' + i).value];
       
    }
    
    for (i = 0;i < fillCount;i++){
        var time1 = document.getElementById('fillDuration' + i).value.split(':');
        var duration = +time1[0] * 60 + +time1[1];
        
        fl_list[i] = [document.getElementById('fill' + i).value,duration];
       
    }
    
    var t1 = document.getElementById('dayStart').value.split(':');
    startTime = +t1[0]*60 + +t1[1];
    
    
    //create new thing
    
    locations = [];
    for (i=0;i<fixedCount;i++){
        locations.push(ft_list[i][3]);
    }
    for (i=0;i<anytimeCount;i++){
        locations.push(at_list[i][2]);
    }
    
    var newdiv = document.createElement('div');
    newdiv.innerHTML = "<p>One more thing...</p>";
    document.getElementById('result').appendChild(newdiv);
    
    
    locpairs = pairs(locations);
//    dist = [];
//    
//    for(i = 0;i<locations.length;i++){
//        var dist_ij = [];
//        for(j = 0;j<locations.length;j++){
//           if (i == j) {
//               dist_ij.push(0);
//           } else {
//               dist_ij.push(-1);
//           }
//        }
//        dist.push(dist_ij);
//    }
    
    for (i = 0;i<locpairs.length;i++){
        var newdiv = document.createElement('div');
        newdiv.innerHTML = locpairs[i][0] + " to " + locpairs[i][1] +"<input type = 'text' id = 'distInput" + i + "' placeholder = 5> minutes";
        document.getElementById('result').appendChild(newdiv);
    }
    
    var newdiv = document.createElement('div');
    newdiv.innerHTML = "<button id = submitButton onclick='submitDist()'>Finish</button>";
    document.getElementById('result').appendChild(newdiv);
    
    
}

function submitDist(){
    
//    var c = 0;
//    for(var i=0; i<locpairs.length; ++i){
//        for(var j=i+1; j<locpairs.length; ++j){
//            dist[i][j] = +document.getElementById('distInput' + c).value;
//            dist[j][i] = dist[i][j];
//            c++;
//        }
//    }   
    
    dist = [];
    for(i=0;i<locpairs.length;i++){
        dist[i] = +document.getElementById('distInput' + i).value;
    }
    
    console.log(dist);
    
    getShortestPath();
}

function getShortestPath(){
    //Find shortest route
    
    var fixedOrder = [];
    
    for (i = 0;i<fixedCount;i++){
        fixedOrder[i] = [0].concat(ft_list[i]);
    }
    
    var nonFixed = [];
    for (i = 0;i<anytimeCount;i++){
        nonFixed[i] = [1].concat(at_list[i]);
    }
    for (i = anytimeCount;i<fillCount+anytimeCount;i++){
        nonFixed[i] = [2].concat(fl_list[i-anytimeCount]);
    }
    
    //calc distances
    
    
    //to do
  
    var possibleRoutes = permutator(nonFixed);
    
    //try each one
    var tempRoute = [];
    var bestRoute = [];
    var tempTime = 0;
    var bestTime = 999999;
    var c_time = 0;
    
    for(i=0;i<possibleRoutes.length;i++){
        
        var fixed_list = [];
        for (j=0;j<fixedOrder.length;j++){
            fixed_list[j] = fixedOrder[j];
        }
        
        var nf_list = [];
        for (j=0;j<anytimeCount+fillCount;j++){
            nf_list[j] = possibleRoutes[i][j];
        }
        
        //reset route
        tempRoute = [];
        
        //Add first fixed one, update time
        c_time = +fixed_list[0][2] + +fixed_list[0][3];
        //add fixed to route
        prev_loc = fixed_list[0][4];
        tempRoute.push([fixed_list[0][2]].concat(fixed_list.shift()));
        
        
        while(fixed_list.length>0){
            var still_room = true;
            while(still_room){
                
                if(nf_list.length < 1){
                    //update time
                    c_time = +fixed_list[0][2] + +fixed_list[0][3];
                    //add fixed to route
                    prev_loc = fixed_list[0][4];
                    tempRoute.push([fixed_list[0][2]].concat(fixed_list.shift()));

                    still_room = false;
                } else {
                
                    if(nf_list[0][0] == 1){ //if location
                        console.log(prev_loc);
                        console.log(nf_list[0][3]);
                        console.log(fixed_list[0][4]);
                        console.log(locpairs);
                        
                        console.log(walkDist(prev_loc,nf_list[0][3]));
                        
                        
                        if(+nf_list[0][2] + walkDist(prev_loc,nf_list[0][3]) + walkDist(nf_list[0][3],fixed_list[0][4]) + c_time < +fixed_list[0][2]){
                            //update time
                            var t = c_time + walkDist(prev_loc,nf_list[0][3]);
                            c_time = walkDist(prev_loc,nf_list[0][3]) + +nf_list[0][2] + c_time;
                            //add nf0 to route from other list
                            prev_loc = nf_list[0][3];
                            tempRoute.push([t].concat(nf_list.shift()));

                        } else {
                            //update time
                            c_time = +fixed_list[0][2] + +fixed_list[0][3];
                            //add fixed to route
                            prev_loc = fixed_list[0][4];
                            tempRoute.push([fixed_list[0][2]].concat(fixed_list.shift()));

                            still_room = false;
                        }
                    } else { //if anywhere
                        if(+nf_list[0][2] + c_time < +fixed_list[0][2]){
                            //update time
                            var t = c_time;
                            c_time += nf_list[0][2];
                            //add nf0 to route from other list
                            tempRoute.push([t].concat(nf_list.shift()));
                        } else {
                            //update time
                            c_time = +fixed_list[0][2] + +fixed_list[0][3];
                            //add fixed to route
                            tempRoute.push([fixed_list[0][2]].concat(fixed_list.shift()));

                            still_room = false;
                        } 
                    }
                }
            } 
        } //end while, no more fixed ones
        
        //add the rest one by one
        while (nf_list.length>0){
            if(nf_list[0][0] == 1){ //if location
                var t = c_time + walkDist(prev_loc,nf_list[0][3]);
                c_time += walkDist(prev_loc,nf_list[0][3]) + nf_list[0][2];

                prev_loc = nf_list[0][1];
                tempRoute.push([t].concat(nf_list.shift()));
            } else {
                var t = c_time;
                c_time += nf_list[0][2];

                tempRoute.push([t].concat(nf_list.shift()));
            }
        }
        
        
        
        tempTime = c_time - startTime;
        if (tempTime < bestTime){
            bestRoute = tempRoute;
            bestTime = tempTime;
        }
        
    } //end for possible routes
    
    //output into result
    document.getElementById('result').innerHTML = "<p> Your Path </p>";
    
    //set location to first place
    
    if (bestRoute[0][1] == 0){
        prev_loc = bestRoute[0][5];
    } else {
        prev_loc = bestRoute[0][4];
    }
    
    for (i = 0;i<bestRoute.length;i++){
        //event thing
        var newdiv = document.createElement('div');
      
        if (bestRoute[i][1] == 0){
            newdiv.innerHTML = convertMinsToHrsMins(bestRoute[i][0]) + " - " + bestRoute[i][2] + " at " + bestRoute[i][5];
        }else if (bestRoute[i][1] == 1){
            newdiv.innerHTML = convertMinsToHrsMins(bestRoute[i][0]) + " - " + bestRoute[i][2] + " at " + bestRoute[i][4];
        }else{
            newdiv.innerHTML = convertMinsToHrsMins(bestRoute[i][0]) + " - " + bestRoute[i][2]; 
        }
        
        document.getElementById('result').appendChild(newdiv);
        
        //new shit
        if ((i < (bestRoute.length - 1)) && (bestRoute[i+1][1]==0)){
            var smalldiv = document.createElement('div');
            if (bestRoute[i][1] == 0){
                smalldiv.innerHTML = convertMinsToHrsMins(bestRoute[i][0] + bestRoute[i][4]) + " - walk to " + bestRoute[i+1][5] + " (" + walkDist(prev_loc,bestRoute[i+1][5]) + " mins)";
            }else{
                smalldiv.innerHTML = convertMinsToHrsMins(bestRoute[i][0] + bestRoute[i][3]) + " - walk to " + bestRoute[i+1][5] + " (" + walkDist(prev_loc,bestRoute[i+1][5]) + " mins)";
            }
            prev_loc = bestRoute[i+1][5];
            document.getElementById('result').appendChild(smalldiv);
        } else if ((i < (bestRoute.length - 1)) && (bestRoute[i+1][1]==1)){
            var smalldiv = document.createElement('div');
            if (bestRoute[i][1] == 0){
                smalldiv.innerHTML = convertMinsToHrsMins(bestRoute[i][0] + bestRoute[i][4]) + " - walk to " + bestRoute[i+1][4] + " (" + walkDist(prev_loc,bestRoute[i+1][4]) + "mins)";
            }else{
                smalldiv.innerHTML = convertMinsToHrsMins(bestRoute[i][0] + bestRoute[i][3]) + " - walk to " + bestRoute[i+1][4] + " (" + walkDist(prev_loc,bestRoute[i+1][4]) + "mins)";
            }
            prev_loc = bestRoute[i+1][4];
            document.getElementById('result').appendChild(smalldiv);

        }
        //end new shit
        
        
    }
    
}

function walkDist(start,end){
    let ret;
    locpairs.forEach((pair,idx) =>{
        console.log(pair[0] === start);
        console.log(pair[1]);
        console.log(start);
        console.log(end);
        if ((pair[0] === start && pair[1] === end) || (pair[1] === start && pair[0] === end)){
            console.log(dist);
            console.log(idx);
            console.log(dist[idx]);
            ret = dist[idx];
        }
    });
        
    return ret;
    //return -1;
}
    
function pairs(arr) {
    var res = [],
        l = arr.length;
    for(var i=0; i<l; ++i)
        for(var j=i+1; j<l; ++j)
            res.push([arr[i], arr[j]]);
    return res;
}

function convertMinsToHrsMins (minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return h + ':' + m;
}

function permutator(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}

