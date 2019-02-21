import { CustomerData } from "./customer-data.model";
import { HotelData } from "./hotel-data.model";
import { RoomData } from "./room-data.model";

export interface BookingData {
  id: number;
  customer: CustomerData;
  hotel: HotelData;
  room: RoomData;
  inDate: Date;
  outDate: Date;
  canceled: boolean;
}
