const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
// const TestUtils = require('react-addons-test-utils');
// const Simulate = TestUtils.Simulate;
const $ = require('jquery');
import TreeSelect from '../';
import data from '../examples/data';

describe('simple', () => {
  let instance;
  let div;
  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should add css class of root dom node', () => {
    instance = ReactDOM.render(
      <TreeSelect style={{width: 300}} className="forTest"
                  dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
                  treeData={data}
                  treeIcon treeLine treeDefaultExpandAll treeCheckable />,
    div);
    expect(ReactDOM.findDOMNode(instance).className.indexOf('forTest') !== -1).to.be(true);
  });

  it('render to body works', (done) => {
    instance = ReactDOM.render(
      <TreeSelect style={{width: 300}}
                  dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
                  treeData={data}
                  treeDefaultExpandAll />,
      div);
    instance.setState({
      open: true,
    }, () => {
      expect(instance.getPopupDOMNode().parentNode.parentNode.nodeName.toLowerCase()).to.be('body');
      expect(instance.getPopupDOMNode().className).not.to.contain('hidden');
      done();
    });
  });

  it('should select the right treeNode', (done) => {
    instance = ReactDOM.render(
      <TreeSelect style={{width: 300}}
                  dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
                  treeData={data}
                  value={['01-2', '01-3']}
                   />,
    div);
    instance.setState({
      open: true,
    }, () => {
      expect($(instance.getPopupComponentRefs().tree).find('.rc-tree-select-tree-node-selected').length).to.be(1);
      done();
    });
  });

  it('should can select multiple treeNodes', (done) => {
    instance = ReactDOM.render(
      <TreeSelect style={{width: 300}}
                  dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
                  treeData={data}
                  multiple
                  value={['01-2', '01-3']}
                   />,
    div);
    instance.setState({
      open: true,
    }, () => {
      console.log(instance.getPopupComponentRefs().tree);
      expect($(instance.getPopupComponentRefs().tree).find('.rc-tree-select-tree-node-selected').length).to.be(2);
      done();
    });
  });
});
