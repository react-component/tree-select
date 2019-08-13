export function openSelect(wrapper) {
  wrapper.find('.rc-tree-select').simulate('click');
  jest.runAllTimers();
  wrapper.update();
}

export function selectNode(wrapper, index) {
  wrapper
    .find('.rc-tree-select-tree-node-content-wrapper')
    .at(index)
    .simulate('click');
}
