global.requestAnimationFrame =
  global.requestAnimationFrame ||
  function requestAnimationFrame(cb) {
    return setTimeout(cb, 0);
  };

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

Object.assign(Enzyme.ReactWrapper.prototype, {
  openSelect() {
    this.find('.rc-tree-select').first().simulate('mousedown');
  },
  selectNode(index = 0) {
    this.find('.rc-tree-select-tree-node-content-wrapper').at(index).simulate('click');
  },
  switchNode(index = 0) {
    this.find('.rc-tree-select-tree-switcher').at(index).simulate('click');
  },
  getSelection(index) {
    const selections = this.find('.rc-tree-select-selection-item');
    if (index !== undefined) {
      const selection = selections.at(index);
      const content = selection.find('.rc-tree-select-selection-item-content');

      return content.length ? content : selection;
    }
    return selections;
  },
  clearSelection(index = 0) {
    return this.getSelection()
      .at(index)
      .find('.rc-tree-select-selection-item-remove')
      .hostNodes()
      .simulate('click');
  },
  clearAll() {
    return this.find('.rc-tree-select-clear').first().simulate('mouseDown');
  },
  search(text) {
    this.find('input.rc-tree-select-input').simulate('change', {
      target: { value: text },
    });
  },
  isOpen() {
    return this.find('.rc-tree-select').first().hasClass('rc-tree-select-open');
  },
});

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
