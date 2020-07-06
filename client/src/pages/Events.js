import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { Button, Card, Transition } from "semantic-ui-react";
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
  useEffect(() => {
    console.log(userId);
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
                title
                description
                date
                price
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
        if (res && res.data) {
          setEvents(res.data.events);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {token ? (
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
      {!token && <h2>Login to create/book an event!</h2>}
      <MyModal
        open={modal}
        submit={(data) => createEvent(data)}
        close={() => showModal(false)}
      />
      <Transition.Group animation="vertical flip" duration="600">
        {events && events.length ? (
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
                {userId && userId !== event.creator._id && (
                  <Button style={{ float: "right" }} inverted color="brown">
                    Book Event
                  </Button>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          <EventSkeleton />
        )}
      </Transition.Group>
    </div>
  );
};
export default Events;
