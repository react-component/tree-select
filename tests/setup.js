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
    this.find('input.rc-tree-select-selection-search-input').simulate('change', {
      target: { value: text },
    });
  },
  isOpen() {
    return this.find('.rc-tree-select').hasClass('rc-tree-select-open');
  },
});
