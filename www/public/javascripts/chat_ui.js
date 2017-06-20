/**
 * Created by projo on 2017-04-29.
 */

var socket = io.connect();

$(document).ready(function(){
    console.log({'socket':socket});
   var chatApp = new Chat(socket);

   // 내가 정의한 소켓 메서드
    socket.on('connected', function(result){
        console.log(result.text);
    });
    socket.on('drawClient', function(result){
       console.log('drawClient 호출되었다능');
       console.log({result:result});
       var clients = result.usersArray;
       console.log(clients);

       $('.user').remove();

       for(var index in clients){

           // alert(clients[index].left);
           // $("body").append('<span class="user"></span>').css('background-color','blue');
           // $('<span class="user"></span>').appendTo("body").css('left',clients[index].left);





        }

    });

   socket.on('nameResult', function(result){
      var message;

      if(result.success){
          message = '당신의 닉네임은 ' + result.name + ' 입니다,';
      }else{
          message = result.message;
      }
      $('#messages').append(divSystemContentElement(message));
   });

   socket.on('joinResult', function(result){
       $('#room-name').text(result.room);
       $('#messages').append(divSystemContentElement('방이 변경됐습니다.'));
   });

   socket.on('message', function(message){
       var newElement = $('<div></div>').text(message.text);
       $('#messages').append(newElement);
       console.log(document.getElementById("contents").scrollTop);
       document.getElementById("contents").scrollTop = document.getElementById("contents").scrollHeight;


   });

   socket.on('disconnect', function(userName){
       console.log('disconeected!!');
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




   var $el = {
       roomName: $('#show-room'),
       lnb: $('#lnb'),
       contents: $('#contents')
   };

    $el.roomName.each(function(index, item){
       console.log('room-name 이벤트 바인딩 forEach');

       $(item).on('click', function(){

           console.log('room-name is clicked');

           if($(this).hasClass('open')){
               // 열려있었다면.. 닫는다.

               $(this).toggleClass('open');
               $(this).addClass('close');

               if($el.lnb.hasClass('open')){
                   $el.lnb.toggleClass();
                   $el.lnb.addClass('close');
               }

               if($el.contents.hasClass('lnb-open')){
                   $el.contents.toggleClass();
                   $el.contents.addClass('lnb-close');
               }

           }else{
               // 닫혀있었다면.. 연다.

               $(this).toggleClass('close');
               $(this).addClass('open');

               if($el.lnb.hasClass('close')){
                   $el.lnb.toggleClass();
                   $el.lnb.addClass('open');
               }

               if($el.contents.hasClass('lnb-close')){
                   $el.contents.toggleClass();
                   $el.contents.addClass('lnb-open');
               }

           }



       });

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
        document.getElementById("contents").scrollTop = document.getElementById("contents").scrollHeight;
    }

    $('#send-message').val('');
}