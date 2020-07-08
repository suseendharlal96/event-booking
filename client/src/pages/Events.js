import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { Button, Card, Transition, Checkbox } from "semantic-ui-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import MyModal from "../components/MyModal";
import { AuthContext } from "../context/authcontext";
import EventSkeleton from "../components/EventSkeleton";

const Events = (props) => {
  dayjs.extend(relativeTime);
  const { token, userId } = useContext(AuthContext);
  const [modal, showModal] = useState(false);
  const [events, setEvents] = useState(null);
  const [actualEvents, setActualEvents] = useState([]);
  const [userEvents, setUserEvents] = useState(false);
  const [bookings, setBookings] = useState(null);
  useEffect(() => {
    console.log(userId, typeof userId);
    console.log(token);
    getEvents();
  }, [props]);

  const createEvent = (data) => {
    console.log(data);
    const a = [...events];
    a.unshift(data.createEvent);
    setEvents(a);
  };

  const getEvents = () => {
    const reqBody = {
      query: `
            query{
              events{
                _id
                title
                description
                date
                price
                bookedBy
                creator{
                  email
                  _id
                }
              }
            }
            `,
    };
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          // setLoading(false);
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res && res.data.events && res.data.events.length) {
          setEvents(res.data.events);
          setActualEvents(res.data.events);
          if (userId) {
            getBookings();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBookings = () => {
    const reqBody = {
      query: `
              query{
                bookings{
                  _id
                  event{
                    _id
                    bookedBy
                  }
                  user{
                    _id
                  }
                }
              }
              `,
    };
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          // setLoading(false);
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res && res.data) {
          setBookings(res.data.bookings);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const bookEvent = (eventId) => {
    console.log(eventId.toString());
    const reqBody = {
      query: `
            mutation{
              bookEvent(eventId:"${eventId}"){
               createdAt
               event{
                 _id
               }
              }
            }
            `,
    };
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          // setLoading(false);
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res && res.data) {
          getEvents();
          getBookings();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleEvents = (e) => {
    console.log("sd", e);
    setUserEvents(!userEvents);
    const a = [...actualEvents];
    if (!userEvents) {
      setEvents(a.filter((user) => user.creator._id === userId));
    } else {
      setEvents(a);
    }
  };

  const bookingButton = (event) => {
    console.log(event);
    if (bookings && bookings.length) {
      const a =
        event.bookedBy && event.bookedBy.findIndex((bId) => bId === userId);
      const b = bookings.findIndex((bId) => bId.event._id === event._id);
      console.log(a);
      console.log(b);
    }
    return (
      <React.Fragment>
        {userId && userId !== event.creator._id ? (
          bookings &&
          bookings.length &&
          event.bookedBy &&
          event.bookedBy.findIndex((bId) => bId === userId) >= 0 &&
          bookings.findIndex((bId) => bId.event._id === event._id) >= 0 ? (
            <Button style={{ float: "right" }} inverted color="green">
              Event Booked
            </Button>
          ) : (
            <Button
              onClick={() => bookEvent(event._id)}
              style={{ float: "right" }}
              inverted
              color="brown"
            >
              Book Event
            </Button>
          )
        ) : null}
      </React.Fragment>
    );
  };

  return (
    <div>
      {userId ? (
        <Button primary onClick={() => showModal(true)}>
          Create Event
        </Button>
      ) : (
        <Button
          primary
          as={NavLink}
          to="/authenticate"
          onClick={() => showModal(true)}
        >
          Create Event
        </Button>
      )}
      {userId && (
        <span style={{ float: "right" }}>
          All Events
          <Checkbox
            style={{ margin: "10px 5px 0px 5px" }}
            onChange={toggleEvents}
            toggle
          />
          Your Events
        </span>
      )}
      {!token && <h2>Login to create/book an event!</h2>}
      <MyModal
        open={modal}
        submit={(data) => createEvent(data)}
        close={() => showModal(false)}
      />
      <Transition.Group animation="vertical flip" duration="600">
        {events ? (
          events.length ? (
            events.map((event, index) => (
              <Card fluid key={index}>
                <Card.Content>
                  {/* <Image floated="right" size="mini" src={Profile} /> */}
                  <Card.Header>Event Name: {event.title}</Card.Header>
                  <Card.Meta>
                    <strong>Date:</strong>
                    {dayjs(event.date).format("DD-MMM-YYYY")}(
                    {dayjs(event.date).fromNow()})
                  </Card.Meta>
                  <Card.Meta>
                    <strong>
                      Amount to register:
                      {"\u20B9"} {event.price}
                    </strong>
                  </Card.Meta>
                  <Card.Description>
                    <strong>
                      About event:
                      {event.description}
                    </strong>
                  </Card.Description>
                  {bookingButton(event)}
                </Card.Content>
              </Card>
            ))
          ) : (
            <p>No events found</p>
          )
        ) : (
          <EventSkeleton />
        )}
      </Transition.Group>
    </div>
  );
};
export default Events;
