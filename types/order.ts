export type Order = {
  $id: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalPrice: number;
  status: "new" | "accepted" | "in-progress" | "completed";
  driverId?: string;
  customerId?: string;
  restaurantId?: string;
  createdAt?: string;
  items?: string; // later can make this structured if you want
};
