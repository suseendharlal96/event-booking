const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Booking{
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type User{
    _id: ID!
    email:String!
    password:String
    createdEvents: [Event!]
}

input UserInput{
    email:String!
    password: String!
}

type LoginData{
    email:String!
    userId:ID!
    token:String!
    expirationTime:Int!
}

type Event {
    _id:ID!
    title:String!
    description:String!
    price:Float!
    date:String!
    creator: User!
    bookedBy: [String!]!
}

input EventInput{
    title:String!
    description:String!
    price:Float!
    date:String!

}

type RootQuery{
    events:[Event!]!
    bookings: [Booking!]!
    login(email:String!,password:String!):LoginData!
}
    
type RootMutation{
    createEvent(eventInput: EventInput):Event
    createUser(userInput: UserInput):User 
    bookEvent(eventId:ID!): Booking!
    cancelBooking(bookingId:ID!,eventId:ID!): Event!
}
        
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
