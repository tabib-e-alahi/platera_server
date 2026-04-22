import { EventEmitter } from "node:events";

type TOrderTrackingEvent = {
  orderId: string;
  status: string;
  message: string;
  updatedAt: string;
};

class OrderEventBus extends EventEmitter {
  emitOrderUpdate(payload: TOrderTrackingEvent) {
    this.emit(`order:${payload.orderId}`, payload);
  }

  subscribe(orderId: string, listener: (payload: TOrderTrackingEvent) => void) {
    this.on(`order:${orderId}`, listener);
  }

  unsubscribe(orderId: string, listener: (payload: TOrderTrackingEvent) => void) {
    this.off(`order:${orderId}`, listener);
  }
}

export const orderEventBus = new OrderEventBus();