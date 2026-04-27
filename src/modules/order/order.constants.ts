import { OrderStatus } from "../../../generated/prisma/enums";


export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ["PLACED", "CANCELLED"],
  PLACED:          ["ACCEPTED", "CANCELLED"],
  ACCEPTED:        ["PREPARING", "CANCELLED"],
  PREPARING:       ["OUT_FOR_DELIVERY"],     
  OUT_FOR_DELIVERY:["DELIVERED"],
  DELIVERED:       [],
  CANCELLED:       [],
  REFUNDED:        [],
};


export const CUSTOMER_CANCELLABLE_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PLACED",
  "ACCEPTED",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT:  "Pending Payment",
  PLACED:           "Order Placed",
  ACCEPTED:         "Accepted",
  PREPARING:        "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED:        "Delivered",
  CANCELLED:        "Cancelled",
  REFUNDED:         "Refunded",
};


export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
];