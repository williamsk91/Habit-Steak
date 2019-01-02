$(document).ready(()=>{
    /*------------------ Statistics ----------------------*/
    let completeCnt=0, warningCnt=0, failedCnt=0, emptyCnt=0;
    //first month 
    //size of the first month
    let size = (task.history.length > 1) ? task.history[0].completed.length : new Date().getDate();
    //iterate over the month while keeping counts
    for(let j = task.startDate.date-1; j<size; j++){
        switch(task.history[0].completed[j]){
            case 1:
                completeCnt++;
                break;
            case -1:
                task.history[0].confirmed[j] ? failedCnt++ : warningCnt++;
                break;
            case 0: 
                task.history[0].confirmed[j] ? failedCnt++ : emptyCnt++;
                break;
            default:
                console.log('task.ejs script -> no value mathed on finding statistic error');     
        }
    }

    //success fail counts
    $('#completedNo p').text(completeCnt);
    $('#warningNo p').text(warningCnt);
    $('#failedNo p').text(failedCnt);
    $('#emptyNo p').text(emptyCnt);
    

    //adding month's name to the calendar
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    //-------------------- Calendar ------------------//
    //loop through the months and set up the calendars
    let histLength = task.history.length;
    for(let i=0; i<histLength; i++){
        
        //add div for the current month
        let monthId = 'calendarMonthContainer'+i;
        let classes = (i == histLength-1)? ' class="carousel-item active"': ' class="carousel-item"';
        $('#calendarInnerCarousel').append('<div id=' +monthId + classes + '></div>');

        //add month's title
        $('#'+monthId).append('<p>'+ months[task.history[i].month] + ' / ' + task.history[i].year +'</p>')
        $('#'+monthId).append('<div id=' + ("calendarGrid"+i) + ' class="calendarGrid"></div>')
        
        //adding calendar grid in expanded view
        for(let j=0; j<task.history[i].completed.length; j++){
            let completedStatus = task.history[i].completed[j];
            let confirmedStatus = task.history[i].confirmed[j];

            //id for each cell
            let calendarCellId= 'calendarCellTask'+i+'day'+j;
            $('#calendarGrid'+i).append('<button id='+calendarCellId+'></button>');
            
            //adding background depending on completed and confirmed status for the date
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
                console.log('tasks.ejs script calendar -> completed status of: ' +completedStatus+ ' does not match anything error');
            }
        }         
    }

    //mark the starting date in the calendar
    let startSign = "<i class='fa fa-play startSign'></i>"
    let startCellId= 'calendarCellTask0day'+(task.startDate.date - 1);
    $('#'+startCellId).append(startSign);


})

//deleting task
let deleteTask = (taskId)=>{
    console.log(taskId);
    $.ajax({
        type: 'DELETE',
        url: '/task/delete/' + taskId,
        success: function(){
            window.location.assign('/main')
        }
    })
}