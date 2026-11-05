/**
 * Payload of the `book_restocked` and `book_sold_out` Pub/Sub events
 */
export class BookStockChangedEvent {
  isbn: string;
  stock?: number;
}
