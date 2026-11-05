import { ApiProperty } from 'asyncapi-decorators';

/**
 * Payload of the `book_restocked` and `book_sold_out` Pub/Sub events
 */
export class BookStockChangedEvent {
  @ApiProperty()
  isbn: string;
  @ApiProperty()
  stock?: number;
}
