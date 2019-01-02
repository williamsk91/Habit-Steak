$(document).ready(()=>{
    /*----------------- appending a new month -------------------*/
    //ajax request to append new month in each of the tasks history
    let updateTasksHistory = ()=>{
        $.ajax({
            type: 'POST',
            url: '/main/updateMonth',
            success: function(data){
            //do something with the data via front-end framework
            window.location.href = "http://localhost:3000/main";
            }
        })
    }


    //first check to ensure the tasks array is not empty
    if(data.tasks.length > 0){
        //latest date - only need to check one of the task
        let lastMonthIndex = data.tasks[0].history.length - 1;
        let latestHistory = data.tasks[0].history[lastMonthIndex];
        let latestMonth = latestHistory.month;
        let latestYear = latestHistory.year;

        //current month
        let curMonth = new Date().getMonth();
        let curYear = new Date().getFullYear();

        //if year is ahead then add new arrays
        if(curYear > latestYear){
            console.log('changing year');
            //append new history array to all tasks
            updateTasksHistory();
            
        //if month is ahead then create new arrays
        } else if(curMonth > latestMonth){
            console.log('changing month');
            //append new history array to all tasks
            updateTasksHistory();
            
        } else {
            //month array is up to date
        }
    }
    


    /*----------------- Modifying card's visual -------------------*/
    //returns number of days in that month given the month and year
    function daysInMonth (month, year) {
        return new Date(year, month+1, 0).getDate();
    }
    
    //adding month's name to the calendar
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    //lopping through each task 
    for(let i=0; i<data.tasks.length; i++){
        
        //getting the necessary data
        let taskId = data.tasks[i].taskId;
        let lastIndex = data.tasks[i].history.length - 1;
        let monthNo = data.tasks[i].history[lastIndex].month;
        let yearNo = data.tasks[i].history[lastIndex].year;
        let completedArr = data.tasks[i].history[lastIndex].completed;
        let confirmedArr = data.tasks[i].history[lastIndex].confirmed;

        //*----------------- Confirmation Cards -------------------*//
        //if not the only month -> start from 0  to today
        //if it's the only month -> start from start date to today
        let startDate = (data.tasks[i].history.length > 1) ? 0 : data.tasks[i].startDate.date - 1;
        for(let j=startDate; j<new Date().getDate(); j++){
            if( completedArr[j] <= 0 ){
                //if the failure is already confirmed then skip
                if(confirmedArr[j]) continue;
                
                //if it's empty and it's still today also skip
                if(completedArr[j] == 0 && (j == new Date().getDate()-1)) continue;
                
                //if failed then set up a confirmation card
                //text
                let date = (monthNo+1)+ '/' + (j+1); // '2/28'
                console.log(monthNo);
                let taskName = data.tasks[i].title; 
                let stake = data.tasks[i].stake;
                //if it's empty set text to 'not confirmed on' else 'failed on'
                let connectingText = (completedArr[j] == 0)? 'not confirmed on': 'failed on'; 
                let text = "<p class='card-text'><strong>"+ taskName  + '</strong> '+connectingText+' <strong>' + date + '</strong> for <strong>$' + stake + '</strong>' + "</p>";
                //buttons
                let completeBtn = '<button class="btn btn-success" onclick="completeTask(' + taskId + ', 1,' + yearNo + ',' + monthNo + ',' + (j+1) + ')">I did this!</button>';
                let confirmBtn = '<button class="btn btn-danger" onclick="confirmTask(' +taskId+ ', true,' +yearNo+ ',' +monthNo+ ',' +(j+1)+ ')" >Pay Up!</button>';
                let btnGroup = "<div class='btn-group confirmationCardBtns' role='group'>"+completeBtn+confirmBtn+"</div>"
                //combining all of the elements
                let confirmationCard = '<div class="card confirmationCard" ><div class="card-body">'+text+btnGroup+'</div></div>'
                $('#confirmationCardContainer').append(confirmationCard);
            }
        }
    }

    //if there is no confirmation card set up a placeholder card
    if($('#confirmationCardContainer > div').length == 0){
        let placeholderCard = "<div id='confirmationCardPlaceholderCard' class='card bg-light text-center'><div class=card-text'>No confirmation card! Keep it up! <i class='fa fa-thumbs-up'></i></div></div>"
        $('#confirmationCardContainer').append(placeholderCard);
    }

    //*--------------^^^ Confirmation Cards ^^^----------------*//
   

    //-------------------- Card's background and text------------------//
    for(let i=0; i<data.tasks.length; i++){
        
        //getting the necessary data -> showing the latest month info
        let taskId = data.tasks[i].taskId;
        let lastIndex = data.tasks[i].history.length -1;
        let monthNo = data.tasks[i].history[lastIndex].month;
        let yearNo = data.tasks[i].history[lastIndex].year;
        let completedArr = data.tasks[i].history[lastIndex].completed;
        let confirmedArr = data.tasks[i].history[lastIndex].confirmed;

        
        //-------------------- Task Cards ------------------//
        let today = new Date().getDate();
        let todayStatus = completedArr[today-1];
        if( todayStatus == 1){
            //if completed change background to bg-success
            $('#infoCard'+taskId).addClass('bg-success text-light');
            $('#completeBtn'+taskId).addClass('btn-outline-light');
        } else if (confirmedArr[today-1] ){
            //if confirmed change background to bg-danger
            $('#infoCard'+taskId).addClass('bg-danger text-light');
            $('#completeBtn'+taskId).addClass('btn-outline-light');
            $('#failBtn'+taskId).addClass('btn-outline-light');

            //also remove option buttons
            removeElement('completeBtn'+taskId);
            removeElement('failBtn'+taskId);
        } else if ( todayStatus == -1 ){
            //if failed and but not confirmed change background to bg-warning
            $('#infoCard'+taskId).addClass('bg-warning text-light');
            $('#failBtn'+taskId).addClass('btn-outline-light');
        }

    }

    for(let i=0; i<data.tasks.length; i++){
        
        //getting the necessary data -> showing the latest month info
        let taskId = data.tasks[i].taskId;
        let lastIndex = data.tasks[i].history.length -1;
        let monthNo = data.tasks[i].history[lastIndex].month;
        let yearNo = data.tasks[i].history[lastIndex].year;
        let completedArr = data.tasks[i].history[lastIndex].completed;
        let confirmedArr = data.tasks[i].history[lastIndex].confirmed;

        //-------------------- Calendar ------------------//
        //month label
        $('#monthLabel'+i).text(months[monthNo]);

        //get this month's number of days
        let monthDateNo = data.tasks[i].history[lastIndex].completed.length;

        //if not the only month -> start labelling from 0 to end of month
        //if it's the only month -> start labelling from start date to end of mondth
        let startDate = (data.tasks[i].history.length > 1) ? 0 : data.tasks[i].startDate.date;
        //adding calendar grid in expanded view
        for(let j=0; j<monthDateNo; j++){

            //if it's before start date just append a btn with outline-dark
            if(j < startDate-1){
                let calendarCellId= 'calendarCellTask'+i+'day'+j;
                $('#calendarGrid'+i).append('<button id='+calendarCellId+'></button>'); 
                $('#'+calendarCellId).addClass('btn btn-outline-dark');      
            } else {
                let completedStatus = completedArr[j];
                let confirmedStatus = confirmedArr[j];

                //id for each cell
                let calendarCellId= 'calendarCellTask'+i+'day'+j;
                $('#calendarGrid'+i).append('<button id='+calendarCellId+'></button>');
                
                if(completedStatus == 1){
                    //if completed (1) add success background
                    $('#'+calendarCellId).addClass('btn btn-success');
                } else if(confirmedStatus){
                    //if failure is confirmed add danger background
                    $('#'+calendarCellId).addClass('btn btn-danger');
                } else if(completedStatus == -1){
                    //if failed (-1) but not yet confirmed add warning background
                    $('#'+calendarCellId).addClass('btn btn-warning');
                } else if(completedStatus == 0) {
                    //if empty then outline it dark
                    $('#'+calendarCellId).addClass('btn btn-outline-dark');
                } else {
                    console.log('main.js calendar -> completed status of: ' +completedStatus+ ' does not match anything error');
                }
            }
        }

        //mark the starting date in the calendar
        if(data.tasks[i].history.length == 1){
            // let startSign = '<button class="btn btn-dark" style="height= 10px"></button>'
            let startSign = "<i class='fa fa-play startSign'></i>"
            $('#calendarGrid'+i+' button:nth-child('+data.tasks[i].startDate.date+')').append(startSign);
        }
    }
    
    /*--------------^^^ Modifying card's visual ^^^----------------*/

    


});

// Removing element by Id
function removeElement(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}


/*----------------- Completing Tasks -------------------*/
//given the taskId, year, month and date updates the specific date to the given value parameter. Year, month and date defaults to today
let completeTask = (taskId, value, year = new Date().getFullYear(), month = new Date().getMonth(), date = new Date().getDate())=>{
    //Database change -> updating the completion status of the task 
    $.ajax({
        type: 'POST',
        url: '/main/complete?taskId=' + taskId + '&year=' + year + '&month=' + month + '&date=' + date + '&value=' + value,
        success: function(data){
        //do something with the data via front-end framework
        location.reload();
        }
    });
}


let confirmTask = (taskId, value, year, month, date)=>{
    //Database change -> updating the completion status of the task 
    //ajaxUpdateTaskDayFailure(taskId, year, month, date);
    //update db using ajax request to node express server

    console.log(year);
    console.log(month);
    console.log(date);
    $.ajax({
        type: 'POST',
        url: '/main/confirm?taskId=' + taskId + '&year=' + year + '&month=' + month + '&date=' + date + '&value=' + value,
        success: function(){
            location.reload();
        }
    });
}

/*--------------^^^ Completing Tasks ^^^----------------*/



    