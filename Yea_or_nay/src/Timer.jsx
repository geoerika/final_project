import React, {Component} from 'react';
import DebateRoomChatBar from './DebateRoomChatBar.jsx';
import DebateMessageList from './DebateMessageList.jsx';
import { Link } from 'react-router-dom'

class Timer extends React.Component {
  constructor(props) {
    super();

    this.state = {
      time: {},
      seconds: 3,
      debateRoom: props.debateRoom
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.updateComponant = this.updateComponant.bind(this);

  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  updateComponant(data) {
    // Remove one second, set state so a re-render happens.
    let seconds = data.timeLeft - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);
      let room = this.state.debateRoom.name
      this.props.socket.emit('debateEnded', room)
    }
}

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    this.props.socket.on ('TimerUpdate', data => {
      let timer = JSON.parse(data)
      this.updateComponant(timer)
    })

}

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {

    let room = this.state.debateRoom.name
    let timeLeft = this.state.seconds
    let roomTime = { room : room,
                     timeLeft : timeLeft
    }
    // Should join the room here

    this.props.socket.emit('timer', JSON.stringify(roomTime))
  }



  render() {
    if (this.state.time.m !== 5) {
      return (
        <div>
          <button onClick={this.startTimer}>Start</button>
          <span className='timer'>m: {this.state.time.m} s: {this.state.time.s}</span>
        </div>)
    } else {
      return(
        <div>
          <button onClick={this.startTimer}>Start</button>
        </div>
      )};
  }
}

export default Timer;