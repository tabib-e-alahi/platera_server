import { OrderStatus } from "../../../generated/prisma/enums";

/**
 * Valid next-statuses for each order state (provider transitions).
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ["PLACED", "CANCELLED"],
  PLACED:          ["ACCEPTED", "CANCELLED"],
  ACCEPTED:        ["PREPARING", "CANCELLED"],
  PREPARING:       ["OUT_FOR_DELIVERY"],          // provider cannot cancel once preparing
  OUT_FOR_DELIVERY:["DELIVERED"],
  DELIVERED:       [],
  CANCELLED:       [],
  REFUNDED:        [],
};

/**
 * Statuses from which a CUSTOMER is allowed to cancel.
 * Rule: PENDING_PAYMENT, PLACED, ACCEPTED only.
 * Once the restaurant starts preparing, cancellation is blocked.
 */
export const CUSTOMER_CANCELLABLE_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PLACED",
  "ACCEPTED",
];

/**
 * Human-readable labels for order statuses.
 */
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

/**
 * Active (in-progress) statuses — used to filter dashboard counts.
 */
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
];