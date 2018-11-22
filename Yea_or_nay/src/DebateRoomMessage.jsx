import React, {Component} from 'react';

function DebateRoomMessage ({username, message, room, updateLiked, state, flag}) {


   function clickedLike(e){
     updateLiked(username);
     e.target.disabled = true;


   }

  return (
      <div className="message" >
        <span className="message-username">{username}: </span>
          <span className="message-content">{message} {room !== 'mainroom' && state === 'viewer' &&  !flag ? <button id='liked' onClick={clickedLike}>LIKE</button>: ''}</span>
      </div>
  );
}

export default DebateRoomMessage;