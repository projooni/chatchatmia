/**
 * Created by projo on 2017-04-29.
 */

var socket = io.connect();

$(document).ready(function(){
    console.log({'socket':socket});
   var chatApp = new Chat(socket);

   socket.on('nameResult', function(result){
      var message;

      if(result.success){
          message = 'You are now known as ' + result.name + ',';
      }else{
          message = result.message;
      }
      $('#messages').append(divSystemContentElement(message));
   });

   socket.on('joinResult', function(result){
       $('#room').text(result.room);
       $('#messages').append(divSystemContentElement('Room changed.'));
   });

   socket.on('message', function(message){
       var newElement = $('<div></div>').text(message.text);
       $('#messages').append(newElement);

   });

   socket.on('disconnect', function(userName){
       alert('연결해제!');
       $('#messages').append(userName + ' 가 나갔습니다.');
   });

   socket.on('rooms', function(rooms){
      $('#room-list').empty();
      // console.log({'rooms':rooms});
      for(var room in rooms){
          room = room.substring(1, room.length);
          if(room != ''){
              $('#room-list').append(divEscapedContentElement(room));
          }
      }

      $('#room-list div').click(function(){
          chatApp.processCommand('/join ' + $(this).text());
          $('#send-message').focus();
      });

   });

   setInterval(function(){
       // console.log('emit rooms..');
       socket.emit('rooms');

   }, 1000);

   $('#send-message').focus();

   $('#send-form').submit(function(){
       // alert(2);
       // console.log('submit');
      processUserInput(chatApp, socket);
      return false;
   });

});


function divEscapedContentElement(message){
    return $('<div></div>').text(message);
}
function divSystemContentElement(message){
    return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket){
    var message = $('#send-message').val();
    var systemMessage;

    // console.log('processUserInput..');
    // alert(1);

    if(message.charAt(0) == '/'){
        systemMessage = chatApp.processCommand(message);
        if(systemMessage){
            $('#messages').append(divEscapedContentElement(systemMessage));
        }
    }else{
        chatApp.sendMessage($('#room').text(), message);
        $('#messages').append(divEscapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }

    $('#send-message').val('');
}