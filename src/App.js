import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import events from './events';

import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = Calendar.momentLocalizer(moment);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events 
   };
    this.handleSelect = this.handleSelect.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    // this.doubleClick = this.doubleClick.bind(this);
  }

  componentDidMount() {
    // listen for the calendar to fully load, then show notifications for the day's events
    window.addEventListener('load', this.handleLoad);
  }

  handleLoad = () => {
    //check for any event starting at the beginning of today
    let todayStart = new Date().setHours(0,0,0,0);
    //check for any event end at the end of today
    var todayEnd = new Date().setHours(23,59,59,999);

    //for each event that is happening today, fire off a notification for that event with the details
    this.state.events.forEach(event => {
      if(event['start'].getTime() >= todayStart && event['start'].getTime() <= todayEnd){
        return alert(event.title + "\nStarts: " + event.start + "\nEnds: " + event.end)
      }
    })
  }

  // doubleClick = (event) => {
  //   window.alert('doubleclicked');
  // }

  deleteEvent = (event, { start, end, title }) => {
    const r = window.confirm("Would you like to remove this event?")
    if(r === true){
     
    this.setState((prevState, props) => {
      const events = [...prevState.events]
      const idx = events.indexOf(event)
      events.splice(idx, 1);
      return { events };
    });
   }
  }

  handleSelect = ({ start, end }) => {
    var i = 0;
    this.state.events.forEach(event => {
      if (
        (start.getTime() > event['start'].getTime()
        && 
        start.getTime() < event['end'].getTime())
        ||
        (start.getTime() < event['start'].getTime()
        &&
        end.getTime() < event['end'].getTime() && end.getTime() > event['start'].getTime())
      ){
        // console.log(start);
        // console.log('firing event');
        return i++;
      }
    })

    if (
      (start >= new Date().setHours(0,0,0,0) )
      &&
      (this.state.events.find(event => event['start'].getTime() === start.getTime()) === undefined)
      && 
      (
        // if i is greater than 0, then there is an event that spans over the selected start time
        i < 1
      )
    )
    {
      const title = window.prompt('New Event name')
      if (title){
        this.setState({
          events: [
            ...this.state.events,
            {
              start,
              end,
              title,
            },
          ],
        })
      }
    } else {
      window.alert('Cannot create events in the past or that have overlapping event times');
    }
  }

  render() {
    
    return (
      <div className="App">
        <Calendar
          popup
          selectable
          localizer={localizer}
          events={this.state.events}
          defaultView="month"
          onSelectEvent={this.deleteEvent}
          // onDoubleClickEvent={this.doubleClick}
          onSelectSlot={this.handleSelect}
          style={{ height: "90vh" }}
        />
      </div>
    );
  }
}

export default App;