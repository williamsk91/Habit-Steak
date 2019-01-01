$(document).ready(()=>{

    //delete Account
    $('#deleteConfirmed').on('click',()=>{
        let userId = $('#deleteConfirmed').attr('data-userId');
        $.ajax({
            type: 'DELETE',
            url: '/userProfile/' + userId,
            success: function(data) {
                window.location.href = "http://localhost:3000/auth/login";
            }
        });
    });


});

