import { HotelData } from "./hotel-data.model";

export interface BookableData {
  id: number;
  hotel: HotelData;
  room_count: number;
  dtFrom: Date;
  dtTo: Date;
}
