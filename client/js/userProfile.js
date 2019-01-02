$(document).ready(()=>{

    //delete Account
    $('#deleteConfirmed').on('click',()=>{
        let userId = $('#deleteConfirmed').attr('data-userId');
        $.ajax({
            type: 'DELETE',
            url: '/userProfile/' + userId,
            success: function() {
                window.location.assign('/')
            }
        });
    });
});

//change username
let changeUsername = ()=>{
    //removing placeholder and edit btn
    $('#usernameLabel').remove();
    $('#usernameText').remove();
    $('#changeUsernameBtn').remove();

    //adding edit username form
    let editForm =  "<form action='/changeUsername' method='post'>" +
                        "<input name=username placeholder='Awesome name' type='text' required>" +
                        "<button id='usernameEditCompleteBtn' class='fa fa-check'></button>" +
                    "</form>"
    $('#usernameContainer').append(editForm)
}

