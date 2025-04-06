import TicketModel from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export default class TicketService {
  async createTicket({ amount, purchaser }) {
    const newTicket = await TicketModel.create({
      code: uuidv4(),
      amount,
      purchaser,
    });
    return newTicket;
  }

  async getAllTickets() {
    return await TicketModel.find();
  }

  async getTicketById(ticketId) {
    return await TicketModel.findById(ticketId);
  }
}
