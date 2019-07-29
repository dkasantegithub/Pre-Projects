$(document).ready(function() {
     // Connect to websocket
     var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

     // Retrieve username
     const username = document.querySelector('#get-username').innerHTML;

    let room = 'Lounge';
    joinRoom('Lounge');
   
    //Display incoming messages
socket.on('message', function(data) {
     // Display current message
     if (data.msg) {
    const p = document.createElement('p');
    const span_username = document.createElement('span');
    const span_timestamp = document.createElement('span');
    const br = document.createElement('br');
      // Display user's own message
    if(data.username  == username){
        p.setAttribute("class", "my-msg");

        //Username
        span_username.setAttribute("class", "my-username");
        span_username.innerText = data.username;

        //Timestamp
        span_timestamp.setAttribute("class", "timestamp");
        span_timestamp.innerText = data.time_stamp;

        //HTML to append
        p.innerHTML += span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML +
        span_timestamp.outerHTML;

        //Append
        $('#display').append(p);
    }
    else{
         // Display system message
        printSysMsg(data.msg);
    }
}
scrollDownChatWindow();

});

 // Room selection
 document.querySelectorAll('.select-room').forEach(p => {
    p.onclick = () =>{
        let newRoom = p.innerHTML;
        if(newRoom == room){
            msg = `You are already in ${room} room.`
            printSysMsg(msg);
        }
        else{
            leaveRoom(room);
            joinRoom(newRoom);
            room = newRoom;
        }
    }
});

  // Logout from chat
  document.querySelector("#logout-btn").onclick = () => {
    leaveRoom(room);
};

//send Message
$('#send').on('click', function () {
    socket.send({'msg': $('#user').val() ,'username': username, 'room': room });
     
    //clear input area
     document.querySelector('#user').value = '';
    });

   
    // Trigger 'leave' event if user was previously on a room
    function leaveRoom(room) {
        socket.emit('leave', {'username': username, 'room': room});
        document.querySelectorAll('.select-room').forEach(p => {
            p.style.color = "black";
    });
}

   // Trigger 'join' event
    function joinRoom(room){
         // Join room
        socket.emit('join', {'username': username, 'room': room});

         // Highlight selected room
         document.querySelector('#' + CSS.escape(room)).style.color = "#ffc107";
         document.querySelector('#' + CSS.escape(room)).style.backgroundColor = "white";

        //Clear message area
        document.querySelector('#display').innerHTML = '';
        //Autofocus on text box
        document.querySelector('#user').focus();
    }

     // Scroll chat window down
     function scrollDownChatWindow() {
        const chatWindow = document.querySelector("#display");
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    //print system messages
    function printSysMsg(msg){
        const p = document.createElement('p');
        p.setAttribute("class", "system-msg");
        p.innerHTML = msg;
        document.querySelector('#display').append(p);

        scrollDownChatWindow();

        // Autofocus on text box
        document.querySelector("#user").focus();
    }
});