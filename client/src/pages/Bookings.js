import React, { useState, useEffect, useContext } from "react";

import { Card, Button, Transition } from "semantic-ui-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { AuthContext } from "../context/authcontext";
import EventSkeleton from "../components/EventSkeleton";

const Bookings = (props) => {
  dayjs.extend(relativeTime);
  const { token, userId } = useContext(AuthContext);
  const [bookings, setBookings] = useState(null);
  useEffect(() => {
    if (!token) {
      props.history.push("/authenticate");
    }
    if (token) {
      getBookings();
    }
  }, []);

  const cancelBooking = (bookingId, eventId) => {
    console.log(bookingId);
    console.log(eventId);
    // const bIndex = bookings.findIndex((booking) => booking._id === bookingId);
    // console.log(bIndex);
    // bookings.splice(bIndex, 1);
    // console.log(bookings);
    // setBookings(bookings);
    const reqBody = {
      query: `
              mutation{
                cancelBooking(bookingId:"${bookingId}",eventId:"${eventId}"){
                    _id
                    title
                    price
                    date
                    description
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
          getBookings();
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
                    title
                    price
                    date
                    description
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
          console.log(res.data.bookings);
          setBookings(res.data.bookings);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Transition.Group animation="vertical flip" duration="600">
        {bookings ? (
          bookings.filter((b) => b.user._id === userId).length ? (
            bookings.map((booking, index) => {
              return (
                booking.user._id === userId && (
                  <Card fluid key={index}>
                    <Card.Content>
                      {/* <Image floated="right" size="mini" src={Profile} /> */}
                      <Card.Header>
                        Event Name: {booking.event.title}
                      </Card.Header>
                      <Card.Meta>
                        <strong>Date:</strong>
                        {dayjs(booking.event.date).format("DD-MMM-YYYY")}(
                        {dayjs(booking.event.date).fromNow()})
                      </Card.Meta>
                      <Card.Meta>
                        <strong>
                          Amount:
                          {"\u20B9"} {booking.event.price}
                        </strong>
                      </Card.Meta>
                      <Card.Description>
                        <strong>
                          About:
                          {booking.event.description}
                        </strong>
                      </Card.Description>
                      <Button
                        style={{ float: "right" }}
                        color="red"
                        onClick={() =>
                          cancelBooking(booking._id, booking.event._id)
                        }
                      >
                        Cancel Booking
                      </Button>
                    </Card.Content>
                  </Card>
                )
              );
            })
          ) : (
            <p>No Bookings found</p>
          )
        ) : (
          <EventSkeleton />
        )}
      </Transition.Group>
    </div>
  );
};
export default Bookings;
