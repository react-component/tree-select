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
    this.find('.rc-tree-select-selector').simulate('mousedown');
  },
  selectNode(index = 0) {
    this.find('.rc-tree-select-tree-node-content-wrapper')
      .at(index)
      .simulate('click');
  },
  getSelection(index = 0) {
    return this.find('.rc-tree-select-selection-item').at(index);
  },
  search(text) {
    this.find('input.rc-tree-select-selection-search-input').simulate('change', { target: { value: text } });
  },
});
