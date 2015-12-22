import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Trigger from 'rc-trigger';
import placements from './placements';

const TreeSelect = React.createClass({
  propTypes: {
    minOverlayWidthMatchTrigger: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    prefixCls: PropTypes.string,
    children: PropTypes.any,
    transitionName: PropTypes.string,
    overlayClassName: PropTypes.string,
    animation: PropTypes.any,
    align: PropTypes.object,
    overlayStyle: PropTypes.object,
    placement: PropTypes.string,
    trigger: PropTypes.array,
  },
  getDefaultProps() {
    return {
      minOverlayWidthMatchTrigger: true,
      prefixCls: 'rc-tree-select',
      trigger: ['hover'],
      overlayClassName: '',
      overlayStyle: {},
      defaultVisible: false,
      onVisibleChange() {
      },
      placement: 'bottomLeft',
    };
  },
  getInitialState() {
    const props = this.props;
    if ('visible' in props) {
      return {
        visible: props.visible,
      };
    }
    return {
      visible: props.defaultVisible,
    };
  },
  componentWillReceiveProps(props) {
    if ('visible' in props) {
      this.setState({
        visible: props.visible,
      });
    }
  },
  onChange(value) {
    console.log('change', value);
  },
  onSelect(value) {
    console.log('select ', value);
  },
  onClick(e) {
    const props = this.props;
    const overlayProps = props.overlay.props;
    if (!('visible' in props)) {
      this.setState({
        visible: false,
      });
    }
    if (overlayProps.onClick) {
      overlayProps.onClick(e);
    }
  },
  onVisibleChange(v) {
    const props = this.props;
    if (!('visible' in props)) {
      this.setState({
        visible: v,
      });
    }
    props.onVisibleChange(v);
  },
  getPopupElement() {
    const props = this.props;
    return React.cloneElement(props.overlay, {
      // prefixCls: `${props.prefixCls}-menu`,
      onClick: this.onClick,
    });
  },
  afterVisibleChange(visible) {
    if (visible && this.props.minOverlayWidthMatchTrigger) {
      const overlayNode = this.refs.trigger.getPopupDomNode();
      const rootNode = ReactDOM.findDOMNode(this);
      if (rootNode.offsetWidth > overlayNode.offsetWidth) {
        overlayNode.style.width = rootNode.offsetWidth + 'px';
      }
    }
  },
  render() {
    const {prefixCls, children,
      transitionName, animation,
      align, placement,
      overlayClassName, overlayStyle,
      trigger} = this.props;
    return (<Trigger prefixCls={prefixCls}
                     ref="trigger"
                     popupClassName={overlayClassName}
                     popupStyle={overlayStyle}
                     builtinPlacements={placements}
                     action={trigger}
                     popupPlacement={placement}
                     popupAlign={align}
                     popupTransitionName={transitionName}
                     popupAnimation={animation}
                     popupVisible={this.state.visible}
                     afterPopupVisibleChange={this.afterVisibleChange}
                     popup={this.getPopupElement()}
                     onPopupVisibleChange={this.onVisibleChange}
      >{children}</Trigger>);
  },
});
export default TreeSelect;
