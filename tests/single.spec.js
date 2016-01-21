const expect = require('expect.js');
const React = require('react');
const ReactDOM = require('react-dom');
// const TestUtils = require('react-addons-test-utils');
// const Simulate = TestUtils.Simulate;
const $ = require('jquery');
import TreeSelect from '../';
import { gData, getNewTreeData, generateTreeNodes } from '../examples/util';

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
                  treeData={gData}
                  treeIcon treeLine treeDefaultExpandAll treeCheckable />,
    div);
    expect(ReactDOM.findDOMNode(instance).className.indexOf('forTest') !== -1).to.be(true);
  });

  it('render to body works', (done) => {
    instance = ReactDOM.render(
      <TreeSelect style={{width: 300}}
                  dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
                  treeData={gData}
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
                  treeData={gData}
                  value={['0-0-0-value', '0-0-0-0-value']}
                   />,
    div);
    instance.setState({
      open: true,
    }, () => {
      expect($(instance.getPopupComponentRefs().tree).find('.rc-tree-select-tree-node-selected').length).to.be(1);
      done();
    });
  });

  it('should select multiple treeNodes', (done) => {
    instance = ReactDOM.render(
      <TreeSelect style={{width: 300}}
                  dropdownMenuStyle={{maxHeight: 200, overflow: 'auto'}}
                  treeData={gData}
                  multiple
                  value={['0-0-0-value', '0-0-0-0-value']}
                   />,
    div);
    instance.setState({
      open: true,
    }, () => {
      expect($(instance.getPopupComponentRefs().tree).find('.rc-tree-select-tree-node-selected').length).to.be(2);
      done();
    });
  });

  it('should dynamic load treeNodes', (done) => {
    const Demo = React.createClass({
      propTypes: {},
      getInitialState() {
        return {
          treeData: [
            {label: 'pNode 01', value: '0-0', key: '0-0'},
            {label: 'pNode 02', value: '0-1', key: '0-1'},
            {label: 'pNode 03', value: '0-2', key: '0-2', isLeaf: true},
          ],
          value: undefined,
        };
      },
      onLoadData(treeNode) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const treeData = [...this.state.treeData];
            getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
            this.setState({treeData}, () => {
              done();
            });
            resolve();
          }, 100);
        });
      },
      getComponent() {
        return this.refs.treeselect;
      },
      render() {
        return (<TreeSelect style={{width: 300}} ref="treeselect"
          treeData={this.state.treeData}
          value={this.state.value}
          loadData={this.onLoadData} />
        );
      },
    });
    instance = ReactDOM.render(<Demo />, div);
    const ts = instance.getComponent();
    // console.log(ts);
    ts.setState({
      open: true,
    }, () => {
      ts.getPopupComponentRefs()['treeNode-0-0'].onExpand();
      // Simulate.click(ReactDOM.findDOMNode(ts.getPopupComponentRefs()['treeNode-0-0']));
    });
  });
});
