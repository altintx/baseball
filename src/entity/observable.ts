export class Observable {
  listeners: Record<string, ((...args: any[]) => unknown)[]> = {};

  on(event: string, listener: (...args: any[]) => void) {
    if(!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
  }

  off(event: string, listener: (...args: any[]) => void) {
    if(!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]) {
    if(!this.listeners[event]) return;
    for(const listener of this.listeners[event]) {
      listener(...args);
    }
  }
}