class EventEmitter {
    constructor() {
      this.events = Object.create(null); // Using Object.create(null) to avoid prototype properties [15]
    }
  
    on(eventName, listener) {
      if (!this.events[eventName]) {
        this.events[eventName] =[];
      }
      this.events[eventName].push(listener);
      return this; 
    }
  
    emit(eventName,...args) {
      const listeners = this.events[eventName];
      if (listeners) {
        listeners.forEach(listener => {
          listener.apply(this, args); 
        });
        return true; 
      }
      return false; 
    }
  
    off(eventName, listenerToRemove) {
      const listeners = this.events[eventName];
      if (listeners) {
        this.events[eventName] = listeners.filter(listener => listener!== listenerToRemove);
        return this;
      }
      return this; 
    }
  
    once(eventName, listener) {
      const onceListener = (...args) => {
        listener.apply(this, args);
        this.off(eventName, onceListener);
      };
      this.on(eventName, onceListener);
      return this; 
    }
  }
  
export {EventEmitter};