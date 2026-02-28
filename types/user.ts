export type Driver = {
  $id: string;
  name: string;
  email: string;
  accountId: string;
  role: "driver";
};

export type Customer = {
  $id: string;
  name: string;
  email: string;
  accountId: string;
  role: "customer";
};
