let user

$(async function () {
    axios({
        url: '/app-03/login',
        method: 'get'
    })
    .then((res) => {
        if (res.data === 'Not Logged In'){
            $('#login').show()
            $('#signup').show()
        }
        else{
            user = res.data

            $('#logout').show()
            $('#title').html(
                `Welcome ${user}, let's get you talking to some of your friends with <br><span class='logo'>Quick Talk.</span>`
            )
            $('#note').html(
                "Choose a room below to get started"
            )
            $('#rooms').show()
        }
    })
    .catch((error) => {
        console.log(error);
    })
    
    $('.room').click(async e => {
        socket = await io();
        e.preventDefault();
        
        // welcome, rooms, messages, signup, login
        displayContainers(false, false, true, false, false)
        
        let room = $(e.target).html()
        socket.emit('subscribe', room);

        $('#message-form').submit(function () {
            socket.emit('chat message ' + room, $('#message-input').val(), user);
            $('#message-input').val('');
            return false;
        });

        socket.on('chat message ' + room, function (msg) {
            console.log(msg)
            $('#chat-messages').append($('<li>').text(msg));
        });

        socket.on('previous messages ' + room, function (data) {
            console.log(data)
            $('#chat-messages').html('')
            for (let item of data){
                $('#chat-messages').append($('<li>').text(item));
            }
        });
    })

    $('#home').click(e => {
        e.preventDefault();
        // welcome, rooms, messages, signup, login
        if (user) displayContainers(true, true, false, false, false)
        else displayContainers(true, false, false, false, false)

        $('#chat-messages').html('')
        $('#message-form').off('submit')
    })

    $('#signup').click(e => {
        e.preventDefault();
        // welcome, rooms, messages, signup, login
        displayContainers(false, false, false, true, false)
    })

    $('#login').click(e => {
        e.preventDefault();
        // welcome, rooms, messages, signup, login
        displayContainers(false, false, false, false, true)
    })

    $('#logout').click(e => {
        e.preventDefault();

        axios({
            url: '/app-03/logout',
            method: 'get'
        })
        .then(() => {
            location.reload()
        })
        .catch((error) => {
            console.log(error);
        })
    })
});


// Hide or display containers
function displayContainers(welcome, rooms, messages, signup, login){
    if (welcome === true) $('#welcome').show()
    else $('#welcome').hide()

    if (rooms === true) $('#rooms').show()
    else $('#rooms').hide()

    if (messages === true){
        $('#message-container').removeClass('d-none')
        $('#message-container').addClass('d-flex')
    }
    else{
        $('#message-container').addClass('d-none')
        $('#message-container').removeClass('d-flex')
    }

    if (signup === true){
        $('#signup-container').removeClass('d-none')
        $('#signup-container').addClass('d-flex')
    }
    else{
        $('#signup-container').addClass('d-none')
        $('#signup-container').removeClass('d-flex')
    }

    if (login === true){
        $('#login-container').removeClass('d-none')
        $('#login-container').addClass('d-flex')
    }
    else{
        $('#login-container').addClass('d-none')
        $('#login-container').removeClass('d-flex')
    }
}