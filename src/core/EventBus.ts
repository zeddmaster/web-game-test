
type EventBusCallback = (data: any) => unknown;

class EventBusService {

  protected events: Record<string, EventBusCallback[]> = {};

  $on(event: string, callback: EventBusCallback){
    if(!this.events[event])
      this.events[event] = [];

    if(this.events[event].includes(callback))
      return;

    this.events[event].push(callback);
  }

  $emit = async (event: string, data?: any) => {
    if(!this.events[event] || !this.events[event].length)
      return;

    const promises = this.events[event].map(
      async (callback) => {
        await callback(data)
      }
    );

    await Promise.all(promises)
  }

  $off(event: string, callback: EventBusCallback){
    if(!this.events[event] || !this.events[event].length)
      return;

    const i = this.events[event].findIndex(handler => handler === callback)
    if(!~i) return;

    this.events[event].splice(i, 1);
  }

}

export const EventBus = new EventBusService();