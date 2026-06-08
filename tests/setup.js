global.requestAnimationFrame =
  global.requestAnimationFrame ||
  function requestAnimationFrame(cb) {
    return setTimeout(cb, 0);
  };

window.MessageChannel = class {
  constructor() {
    const createPort = () => {
      const port = {
        onmessage: null,
        postMessage: message => {
          setTimeout(() => {
            if (port._target && typeof port._target.onmessage === 'function') {
              port._target.onmessage({ data: message });
            }
          }, 0);
        },
        _target: null,
      };
      return port;
    };

    const port1 = createPort();
    const port2 = createPort();
    port1._target = port2;
    port2._target = port1;
    this.port1 = port1;
    this.port2 = port2;
  }
};
