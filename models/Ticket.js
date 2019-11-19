const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  availableFrom: {
    type: String,
    dateUntil: new Date("<YYYY-mm-dd>")
  },
  availableUntil: {
    type: String,
    dateFrom: new Date("<YYYY-mm-dd>")
  },
  zone: {
    type: String,
    enum: ["AB", "ABC"]
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  ticketId: Number
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;




//  
// 