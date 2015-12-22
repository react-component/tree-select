webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	// use jsx to render html, do not modify simple.html
	
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	var _rcTreeSelect = __webpack_require__(4);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _rcTree = __webpack_require__(214);
	
	var _rcTree2 = _interopRequireDefault(_rcTree);
	
	var _util = __webpack_require__(219);
	
	var _react = __webpack_require__(7);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(164);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  getInitialState: function getInitialState() {
	    return {
	      visible: false,
	      sel: ''
	    };
	  },
	  onVisibleChange: function onVisibleChange(visible) {
	    this.setState({
	      visible: visible
	    });
	  },
	  handleSelect: function handleSelect(info) {
	    console.log('selected: ', info);
	    this.setState({
	      visible: false,
	      sel: info.node.props.title
	    });
	  },
	  render: function render() {
	    var loop = function loop(data) {
	      return data.map(function (item) {
	        if (item.children) {
	          return _react2['default'].createElement(
	            _rcTree.TreeNode,
	            { key: item.key, title: item.key },
	            loop(item.children)
	          );
	        }
	        return _react2['default'].createElement(_rcTree.TreeNode, { key: item.key, title: item.key });
	      });
	    };
	    var overlay = _react2['default'].createElement(
	      _rcTree2['default'],
	      { defaultExpandAll: false,
	        onSelect: this.handleSelect },
	      loop(_util.gData)
	    );
	
	    return _react2['default'].createElement(
	      'div',
	      { style: { padding: '10px 30px' } },
	      _react2['default'].createElement(
	        'h3',
	        null,
	        'with tree'
	      ),
	      _react2['default'].createElement(
	        _rcTreeSelect2['default'],
	        { trigger: ['click'],
	          onVisibleChange: this.onVisibleChange,
	          visible: this.state.visible,
	          closeOnSelect: false,
	          overlay: overlay, animation: 'slide-up' },
	        _react2['default'].createElement('input', { key: Date.now(), placeholder: '选择岗位节点', defaultValue: this.state.sel, readOnly: true })
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ },

/***/ 3:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 214:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Tree = __webpack_require__(215);
	
	var _Tree2 = _interopRequireDefault(_Tree);
	
	var _TreeNode = __webpack_require__(217);
	
	var _TreeNode2 = _interopRequireDefault(_TreeNode);
	
	_Tree2['default'].TreeNode = _TreeNode2['default'];
	
	exports['default'] = _Tree2['default'];
	module.exports = exports['default'];

/***/ },

/***/ 215:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(7);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _classnames = __webpack_require__(171);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _util = __webpack_require__(216);
	
	// sorted array ['0-0','0-1', '0-0-1', '0-1-1'] => ['0-0', '0-1']
	var filterMin = function filterMin(arr) {
	  var a = [];
	  arr.forEach(function (item) {
	    var b = a.filter(function (i) {
	      return item.indexOf(i) === 0;
	    });
	    if (!b.length) {
	      a.push(item);
	    }
	  });
	  return a;
	};
	
	var Tree = (function (_React$Component) {
	  _inherits(Tree, _React$Component);
	
	  function Tree(props) {
	    var _this = this;
	
	    _classCallCheck(this, Tree);
	
	    _get(Object.getPrototypeOf(Tree.prototype), 'constructor', this).call(this, props);
	    ['handleKeyDown', 'handleCheck'].forEach(function (m) {
	      _this[m] = _this[m].bind(_this);
	    });
	    this.defaultExpandAll = props.defaultExpandAll;
	    var expandedKeys = props.defaultExpandedKeys;
	    var checkedKeys = props.defaultCheckedKeys;
	    if ('checkedKeys' in props) {
	      checkedKeys = props.checkedKeys || [];
	    }
	    var selectedKeys = props.multiple ? [].concat(_toConsumableArray(props.defaultSelectedKeys)) : [props.defaultSelectedKeys[0]];
	    if ('selectedKeys' in props) {
	      selectedKeys = props.multiple ? [].concat(_toConsumableArray(props.selectedKeys)) : [props.selectedKeys[0]];
	    }
	    this.state = {
	      expandedKeys: expandedKeys,
	      checkedKeys: checkedKeys,
	      selectedKeys: selectedKeys,
	      dragNodesKeys: '',
	      dragOverNodeKey: '',
	      dropNodeKey: ''
	    };
	    this.contextmenuKeys = [];
	  }
	
	  _createClass(Tree, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {}
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var props = {};
	      if ('checkedKeys' in nextProps) {
	        props.checkedKeys = nextProps.checkedKeys;
	      }
	      if ('selectedKeys' in nextProps) {
	        props.selectedKeys = nextProps.multiple ? nextProps.selectedKeys : [nextProps.selectedKeys[0]];
	      }
	      this.setState(props);
	    }
	  }, {
	    key: 'getCheckKeys',
	    value: function getCheckKeys() {
	      var _this2 = this;
	
	      var checkPartKeys = [];
	      var checkedKeys = [];
	      Object.keys(this.treeNodesStates).forEach(function (item) {
	        var itemObj = _this2.treeNodesStates[item];
	        if (itemObj.checked) {
	          checkedKeys.push(itemObj.key);
	        } else if (itemObj.checkPart) {
	          checkPartKeys.push(itemObj.key);
	        }
	      });
	      return {
	        checkPartKeys: checkPartKeys, checkedKeys: checkedKeys
	      };
	    }
	  }, {
	    key: 'getOpenTransitionName',
	    value: function getOpenTransitionName() {
	      var props = this.props;
	      var transitionName = props.openTransitionName;
	      var animationName = props.openAnimation;
	      if (!transitionName && typeof animationName === 'string') {
	        transitionName = props.prefixCls + '-open-' + animationName;
	      }
	      return transitionName;
	    }
	  }, {
	    key: 'getDragNodes',
	    value: function getDragNodes(treeNode) {
	      var _this3 = this;
	
	      var dragNodesKeys = [];
	      Object.keys(this.treeNodesStates).forEach(function (item) {
	        if (item.indexOf(treeNode.props.pos) === 0) {
	          dragNodesKeys.push(_this3.treeNodesStates[item].key);
	        }
	      });
	      return dragNodesKeys;
	    }
	  }, {
	    key: 'getExpandedKeys',
	    value: function getExpandedKeys(treeNode, expand) {
	      var key = treeNode.props.eventKey;
	      var expandedKeys = this.state.expandedKeys;
	      var expandedIndex = expandedKeys.indexOf(key);
	      var exKeys = undefined;
	      if (expandedIndex > -1 && !expand) {
	        exKeys = [].concat(_toConsumableArray(expandedKeys));
	        exKeys.splice(expandedIndex, 1);
	        return exKeys;
	      }
	      if (expand && expandedKeys.indexOf(key) === -1) {
	        return expandedKeys.concat([key]);
	      }
	    }
	
	    /*
	    // ie8
	    createDragElement(treeNode) {
	      const props = this.props;
	       // copy treeNode and it's childNodes, remove data-reactid attribute.
	      let tn = treeNode.refs.selectHandle.cloneNode(true);
	      [...tn.childNodes].forEach(child => {
	        if (child.nodeType !== 1) {
	          return;
	        }
	        child.removeAttribute('data-reactid');
	      });
	      tn.removeAttribute('data-reactid');
	       // make element
	      const li = document.createElement("li");
	      li.className = treeNode.props.className || '';
	      li.appendChild(tn);
	      const ul = document.createElement("ul");
	      ul.className = `${props.prefixCls}-dragUl ${classNames(props.className, props.prefixCls)}`;
	      ul.appendChild(li);
	       ul.setAttribute('draggable', 'true');
	      this.refs.tree.parentNode.insertBefore(ul, this.refs.tree);
	      ul.focus();
	    }
	    */
	  }, {
	    key: 'handleDragStart',
	    value: function handleDragStart(e, treeNode) {
	      // console.log(this.refs.tree.parentNode, treeNode.refs.selectHandle);
	      // this.createDragElement(treeNode);
	      this.dragNode = treeNode;
	      this.dragNodesKeys = this.getDragNodes(treeNode);
	      var st = {
	        dragNodesKeys: this.dragNodesKeys
	      };
	      var expandedKeys = this.getExpandedKeys(treeNode, false);
	      if (expandedKeys) {
	        st.expandedKeys = expandedKeys;
	      }
	      this.setState(st);
	      if (this.props.onTreeDragStart) {
	        this.props.onTreeDragStart({
	          event: e,
	          node: treeNode
	        });
	      }
	    }
	  }, {
	    key: 'handleDragEnterGap',
	    value: function handleDragEnterGap(e, treeNode) {
	      // console.log(e.pageY, getOffset(treeNode.refs.selectHandle), treeNode.props.eventKey);
	      var offsetTop = (0, _util.getOffset)(treeNode.refs.selectHandle).top;
	      var offsetHeight = treeNode.refs.selectHandle.offsetHeight;
	      var pageY = e.pageY;
	      var gapHeight = 2;
	      if (pageY > offsetTop + offsetHeight - gapHeight) {
	        // console.log('enter gap');
	        this.dropPos = 1;
	        return 1;
	      }
	      if (pageY < offsetTop + gapHeight) {
	        // console.log('ee');
	        this.dropPos = -1;
	        return -1;
	      }
	      // console.log('xx');
	      this.dropPos = 0;
	      return 0;
	    }
	  }, {
	    key: 'handleDragEnter',
	    value: function handleDragEnter(e, treeNode) {
	      var enterGap = this.handleDragEnterGap(e, treeNode);
	      if (this.dragNode.props.eventKey === treeNode.props.eventKey && enterGap === 0) {
	        this.setState({
	          dragOverNodeKey: ''
	        });
	        return;
	      }
	      // console.log('en...', this.dropPos);
	      var st = {
	        dragOverNodeKey: treeNode.props.eventKey
	      };
	      var expandedKeys = this.getExpandedKeys(treeNode, true);
	      if (expandedKeys) {
	        st.expandedKeys = expandedKeys;
	      }
	      this.setState(st);
	      if (this.props.onTreeDragEnter) {
	        this.props.onTreeDragEnter({
	          event: e,
	          node: treeNode,
	          expandedKeys: expandedKeys || this.state.expandedKeys
	        });
	      }
	    }
	  }, {
	    key: 'handleDragOver',
	    value: function handleDragOver(e, treeNode) {
	      if (this.props.onTreeDragOver) {
	        this.props.onTreeDragOver({ event: e, node: treeNode });
	      }
	    }
	  }, {
	    key: 'handleDragLeave',
	    value: function handleDragLeave(e, treeNode) {
	      if (this.props.onTreeDragLeave) {
	        this.props.onTreeDragLeave({ event: e, node: treeNode });
	      }
	    }
	  }, {
	    key: 'handleDrop',
	    value: function handleDrop(e, treeNode) {
	      var key = treeNode.props.eventKey;
	      if (this.dragNode.props.eventKey === key) {
	        return;
	      }
	      this.setState({
	        dragOverNodeKey: '',
	        dropNodeKey: key
	      });
	      if (this.props.onTreeDrop) {
	        var posArr = treeNode.props.pos.split('-');
	        var res = {
	          event: e,
	          node: treeNode,
	          dragNode: this.dragNode,
	          dragNodesKeys: this.dragNodesKeys,
	          dropPos: this.dropPos + Number(posArr[posArr.length - 1])
	        };
	        if (this.dropPos !== 0) {
	          res.dropToGap = true;
	        }
	        this.props.onTreeDrop(res);
	      }
	    }
	  }, {
	    key: 'loopAllChildren',
	    value: function loopAllChildren(childs, callback) {
	      var loop = function loop(children, level) {
	        _react2['default'].Children.forEach(children, function (item, index) {
	          var pos = level + '-' + index;
	          var newChildren = item.props.children;
	          if (newChildren) {
	            if (!Array.isArray(newChildren)) {
	              newChildren = [newChildren];
	            }
	            loop(newChildren, pos);
	          }
	          callback(item, index, pos);
	        });
	      };
	      loop(childs, 0);
	    }
	  }, {
	    key: 'handleExpand',
	    value: function handleExpand(treeNode) {
	      var _this4 = this;
	
	      var thisProps = this.props;
	      var tnProps = treeNode.props;
	      var expandedKeys = this.state.expandedKeys.concat([]);
	      var expanded = !tnProps.expanded;
	      if (this.defaultExpandAll) {
	        this.loopAllChildren(thisProps.children, function (item, index, pos) {
	          var key = item.key || pos;
	          if (expandedKeys.indexOf(key) === -1) {
	            expandedKeys.push(key);
	          }
	        });
	        this.defaultExpandAll = false;
	      }
	      var index = expandedKeys.indexOf(tnProps.eventKey);
	      if (expanded) {
	        if (index === -1) {
	          expandedKeys.push(tnProps.eventKey);
	          if (thisProps.onDataLoaded) {
	            return thisProps.onDataLoaded(treeNode).then(function () {
	              _this4.setState({
	                expandedKeys: expandedKeys
	              });
	            })['catch'](function () {
	              // console.error('Something went wrong', reason);
	            });
	          }
	        }
	      } else {
	          expandedKeys.splice(index, 1);
	        }
	      this.setState({
	        expandedKeys: expandedKeys
	      });
	    }
	  }, {
	    key: 'handleCheckState',
	    value: function handleCheckState(obj, checkedArr, unCheckEvent) {
	      var evt = false;
	      if (typeof unCheckEvent === 'boolean') {
	        evt = true;
	      }
	      var splitPos = function splitPos(pos) {
	        return pos.split('-');
	      };
	      // stripTail('x-xx-sss-xx')
	      var stripTail = function stripTail(str) {
	        var arr = str.match(/(.+)(-[^-]+)$/);
	        var st = '';
	        if (arr && arr.length === 3) {
	          st = arr[1];
	        }
	        return st;
	      };
	      checkedArr.forEach(function (_pos) {
	        Object.keys(obj).forEach(function (i) {
	          if (splitPos(i).length > splitPos(_pos).length && i.indexOf(_pos) === 0) {
	            obj[i].checkPart = false;
	            if (evt) {
	              if (unCheckEvent) {
	                obj[i].checked = false;
	              } else {
	                obj[i].checked = true;
	              }
	            } else {
	              obj[i].checked = true;
	            }
	          }
	        });
	        var loop = function loop(__pos) {
	          var _posLen = splitPos(__pos).length;
	          if (_posLen <= 2) {
	            return;
	          }
	          var sibling = 0;
	          var siblingChecked = 0;
	          var parentPos = stripTail(__pos);
	          Object.keys(obj).forEach(function (i) {
	            if (splitPos(i).length === _posLen && i.indexOf(parentPos) === 0) {
	              sibling++;
	              if (obj[i].checked) {
	                siblingChecked++;
	              } else if (obj[i].checkPart) {
	                siblingChecked += 0.5;
	              }
	            }
	          });
	          var parent = obj[parentPos];
	          // sibling 不会等于0
	          // 全不选 - 全选 - 半选
	          if (siblingChecked === 0) {
	            parent.checked = false;
	            parent.checkPart = false;
	          } else if (siblingChecked === sibling) {
	            parent.checked = true;
	            parent.checkPart = false;
	          } else {
	            parent.checkPart = true;
	            parent.checked = false;
	          }
	          loop(parentPos);
	        };
	        loop(_pos);
	      });
	    }
	  }, {
	    key: 'handleCheck',
	    value: function handleCheck(treeNode) {
	      var _this5 = this;
	
	      var tnProps = treeNode.props;
	      var checked = !tnProps.checked;
	      if (tnProps.checkPart) {
	        checked = true;
	      }
	      var pos = undefined;
	      Object.keys(this.treeNodesStates).forEach(function (item) {
	        var itemObj = _this5.treeNodesStates[item];
	        if (itemObj.key === (treeNode.key || tnProps.eventKey)) {
	          pos = item;
	          itemObj.checked = checked;
	          itemObj.checkPart = false;
	        }
	      });
	      this.handleCheckState(this.treeNodesStates, [pos], !checked);
	      var checkKeys = this.getCheckKeys();
	      this.checkPartKeys = checkKeys.checkPartKeys;
	      var checkedKeys = checkKeys.checkedKeys;
	      var newSt = {
	        event: 'check',
	        node: treeNode
	      };
	      if (!('checkedKeys' in this.props)) {
	        this.setState({
	          checkedKeys: checkedKeys
	        });
	        newSt.checked = checked;
	      } else {
	        checkedKeys = this.state.checkedKeys;
	      }
	      newSt.checkedKeys = checkedKeys;
	      if (this.props.onCheck) {
	        this.props.onCheck(newSt);
	      }
	    }
	  }, {
	    key: 'handleSelect',
	    value: function handleSelect(treeNode) {
	      var props = this.props;
	      var selectedKeys = [].concat(_toConsumableArray(this.state.selectedKeys));
	      var eventKey = treeNode.props.eventKey;
	      var index = selectedKeys.indexOf(eventKey);
	      var selected = undefined;
	      if (index !== -1) {
	        selected = false;
	        selectedKeys.splice(index, 1);
	      } else {
	        selected = true;
	        if (!props.multiple) {
	          selectedKeys.length = 0;
	        }
	        selectedKeys.push(eventKey);
	      }
	      var newSt = {
	        event: 'select',
	        node: treeNode
	      };
	      if (!('selectedKeys' in this.props)) {
	        this.setState({
	          selectedKeys: selectedKeys
	        });
	        newSt.selected = selected;
	      } else {
	        selectedKeys = this.state.selectedKeys;
	      }
	      newSt.selectedKeys = selectedKeys;
	      if (props.onSelect) {
	        props.onSelect(newSt);
	      }
	    }
	  }, {
	    key: 'handleContextMenu',
	    value: function handleContextMenu(e, treeNode) {
	      var selectedKeys = [].concat(_toConsumableArray(this.state.selectedKeys));
	      var eventKey = treeNode.props.eventKey;
	      if (this.contextmenuKeys.indexOf(eventKey) === -1) {
	        this.contextmenuKeys.push(eventKey);
	      }
	      this.contextmenuKeys.forEach(function (key) {
	        var index = selectedKeys.indexOf(key);
	        if (index !== -1) {
	          selectedKeys.splice(index, 1);
	        }
	      });
	      if (selectedKeys.indexOf(eventKey) === -1) {
	        selectedKeys.push(eventKey);
	      }
	      this.setState({
	        selectedKeys: selectedKeys
	      });
	      this.props.onRightClick({ event: e, node: treeNode });
	    }
	
	    // all keyboard events callbacks run from here at first
	  }, {
	    key: 'handleKeyDown',
	    value: function handleKeyDown(e) {
	      e.preventDefault();
	    }
	  }, {
	    key: 'renderTreeNode',
	    value: function renderTreeNode(child, index) {
	      var level = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	
	      var key = child.key || level + '-' + index;
	      var state = this.state;
	      var props = this.props;
	      var cloneProps = {
	        ref: 'treeNode-' + key,
	        root: this,
	        eventKey: key,
	        pos: level + '-' + index,
	        onDataLoaded: props.onDataLoaded,
	        onRightClick: props.onRightClick,
	        prefixCls: props.prefixCls,
	        showLine: props.showLine,
	        showIcon: props.showIcon,
	        checkable: props.checkable,
	        draggable: props.draggable,
	        dragOver: state.dragOverNodeKey === key && this.dropPos === 0,
	        dragOverGapTop: state.dragOverNodeKey === key && this.dropPos === -1,
	        dragOverGapBottom: state.dragOverNodeKey === key && this.dropPos === 1,
	        expanded: this.defaultExpandAll || state.expandedKeys.indexOf(key) !== -1,
	        selected: state.selectedKeys.indexOf(key) !== -1,
	        checked: this.checkedKeys.indexOf(key) !== -1,
	        checkPart: this.checkPartKeys.indexOf(key) !== -1,
	        openTransitionName: this.getOpenTransitionName(),
	        openAnimation: props.openAnimation
	      };
	      return _react2['default'].cloneElement(child, cloneProps);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this6 = this;
	
	      var props = this.props;
	      var domProps = {
	        className: (0, _classnames2['default'])(props.className, props.prefixCls),
	        role: 'tree-node'
	      };
	      if (props.focusable) {
	        domProps.tabIndex = '0';
	        domProps.onKeyDown = this.handleKeyDown;
	      }
	      var checkedKeys = this.state.checkedKeys;
	      var checkedPos = [];
	      this.treeNodesStates = {};
	      this.loopAllChildren(props.children, function (item, index, pos) {
	        var key = item.key || pos;
	        var checked = false;
	        if (checkedKeys.indexOf(key) !== -1) {
	          checked = true;
	          checkedPos.push(pos);
	        }
	        _this6.treeNodesStates[pos] = {
	          key: key,
	          checked: checked,
	          checkPart: false
	        };
	      });
	      this.handleCheckState(this.treeNodesStates, filterMin(checkedPos.sort()));
	      var checkKeys = this.getCheckKeys();
	      this.checkPartKeys = checkKeys.checkPartKeys;
	      this.checkedKeys = checkKeys.checkedKeys;
	      this.newChildren = _react2['default'].Children.map(props.children, this.renderTreeNode, this);
	      return _react2['default'].createElement(
	        'ul',
	        _extends({}, domProps, { unselectable: true, ref: 'tree' }),
	        this.newChildren
	      );
	    }
	  }]);
	
	  return Tree;
	})(_react2['default'].Component);
	
	Tree.propTypes = {
	  prefixCls: _react2['default'].PropTypes.string,
	  checkable: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _react2['default'].PropTypes.node]),
	  multiple: _react2['default'].PropTypes.bool,
	  showLine: _react2['default'].PropTypes.bool,
	  showIcon: _react2['default'].PropTypes.bool,
	  defaultExpandAll: _react2['default'].PropTypes.bool,
	  defaultExpandedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
	  checkedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
	  defaultCheckedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
	  selectedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
	  defaultSelectedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
	  onCheck: _react2['default'].PropTypes.func,
	  onSelect: _react2['default'].PropTypes.func,
	  onDataLoaded: _react2['default'].PropTypes.func,
	  onRightClick: _react2['default'].PropTypes.func,
	  onTreeDragStart: _react2['default'].PropTypes.func,
	  onTreeDragEnter: _react2['default'].PropTypes.func,
	  onTreeDragOver: _react2['default'].PropTypes.func,
	  onTreeDragLeave: _react2['default'].PropTypes.func,
	  onTreeDrop: _react2['default'].PropTypes.func,
	  openTransitionName: _react2['default'].PropTypes.string,
	  openAnimation: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.object])
	};
	
	Tree.defaultProps = {
	  prefixCls: 'rc-tree',
	  multiple: false,
	  checkable: false,
	  draggable: false,
	  showLine: false,
	  showIcon: true,
	  defaultExpandAll: false,
	  defaultExpandedKeys: [],
	  defaultCheckedKeys: [],
	  defaultSelectedKeys: []
	};
	
	exports['default'] = Tree;
	module.exports = exports['default'];

/***/ },

/***/ 216:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.browser = browser;
	exports.getOffset = getOffset;
	
	function browser(ua) {
	  var tem = undefined;
	  var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	  if (/trident/i.test(M[1])) {
	    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
	    return 'IE ' + (tem[1] || '');
	  }
	  if (M[1] === 'Chrome') {
	    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
	    if (tem) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	  }
	  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	  tem = ua.match(/version\/(\d+)/i);
	  if (tem) {
	    M.splice(1, 1, tem[1]);
	  }
	  return M.join(' ');
	}
	
	// export function getOffset(el) {
	//   const obj = el.getBoundingClientRect();
	//   return {
	//     left: obj.left + document.body.scrollLeft,
	//     top: obj.top + document.body.scrollTop,
	//     width: obj.width,
	//     height: obj.height
	//   };
	// }
	
	function getOffset(ele) {
	  var el = ele;
	  var _x = 0;
	  var _y = 0;
	  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
	    _x += el.offsetLeft - el.scrollLeft;
	    _y += el.offsetTop - el.scrollTop;
	    el = el.offsetParent;
	  }
	  return { top: _y, left: _x };
	}

/***/ },

/***/ 217:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(7);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _objectAssign = __webpack_require__(218);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	var _classnames = __webpack_require__(171);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _rcAnimate = __webpack_require__(202);
	
	var _rcAnimate2 = _interopRequireDefault(_rcAnimate);
	
	var _util = __webpack_require__(216);
	
	var browserUa = (0, _util.browser)(window.navigator.userAgent || '');
	var ieOrEdge = /.*(IE|Edge).+/.test(browserUa);
	// const uaArray = browserUa.split(' ');
	// const gtIE8 = uaArray.length !== 2 || uaArray[0].indexOf('IE') === -1 || Number(uaArray[1]) > 8;
	
	var defaultTitle = '---';
	
	var TreeNode = (function (_React$Component) {
	  _inherits(TreeNode, _React$Component);
	
	  function TreeNode(props) {
	    var _this = this;
	
	    _classCallCheck(this, TreeNode);
	
	    _get(Object.getPrototypeOf(TreeNode.prototype), 'constructor', this).call(this, props);
	    ['handleExpand', 'handleCheck', 'handleContextMenu', 'handleDragStart', 'handleDragEnter', 'handleDragOver', 'handleDragLeave', 'handleDrop'].forEach(function (m) {
	      _this[m] = _this[m].bind(_this);
	    });
	    this.state = {
	      dataLoading: false,
	      dragNodeHighlight: false
	    };
	  }
	
	  _createClass(TreeNode, [{
	    key: 'getPosition',
	    value: function getPosition(pos) {
	      var obj = {
	        last: false,
	        center: false
	      };
	      var siblings = Object.keys(this.props.root.treeNodesStates).filter(function (item) {
	        var len = pos.length;
	        return len === item.length && pos.substring(0, len - 2) === item.substring(0, len - 2);
	      });
	      var sLen = siblings.length;
	      var posIndex = Number(pos.substr(-1, 1));
	      if (sLen === 1 || posIndex === sLen - 1) {
	        obj.last = true;
	      } else {
	        obj.center = true;
	      }
	      return obj;
	    }
	  }, {
	    key: 'handleCheck',
	    value: function handleCheck() {
	      this.props.root.handleCheck(this);
	    }
	  }, {
	    key: 'handleSelect',
	    value: function handleSelect() {
	      this.props.root.handleSelect(this);
	    }
	  }, {
	    key: 'handleContextMenu',
	    value: function handleContextMenu(e) {
	      e.preventDefault();
	      this.props.root.handleContextMenu(e, this);
	    }
	  }, {
	    key: 'handleDragStart',
	    value: function handleDragStart(e) {
	      // console.log('dragstart', this.props.eventKey, e);
	      // e.preventDefault();
	      e.stopPropagation();
	      this.setState({
	        dragNodeHighlight: true
	      });
	      this.props.root.handleDragStart(e, this);
	    }
	  }, {
	    key: 'handleDragEnter',
	    value: function handleDragEnter(e) {
	      // console.log('dragenter', this.props.eventKey, e);
	      e.preventDefault();
	      e.stopPropagation();
	      this.props.root.handleDragEnter(e, this);
	    }
	  }, {
	    key: 'handleDragOver',
	    value: function handleDragOver(e) {
	      // console.log(this.props.eventKey, e);
	      // todo disabled
	      e.preventDefault();
	      e.stopPropagation();
	      this.props.root.handleDragOver(e, this);
	      return false;
	    }
	  }, {
	    key: 'handleDragLeave',
	    value: function handleDragLeave(e) {
	      // console.log(this.props.eventKey, e);
	      e.stopPropagation();
	      this.props.root.handleDragLeave(e, this);
	    }
	  }, {
	    key: 'handleDrop',
	    value: function handleDrop(e) {
	      e.stopPropagation();
	      this.setState({
	        dragNodeHighlight: false
	      });
	      this.props.root.handleDrop(e, this);
	    }
	  }, {
	    key: 'handleExpand',
	    value: function handleExpand() {
	      var _this2 = this;
	
	      var callbackPromise = this.props.root.handleExpand(this);
	      if (callbackPromise && typeof callbackPromise === 'object') {
	        (function () {
	          var setLoading = function setLoading(dataLoading) {
	            _this2.setState({
	              dataLoading: dataLoading
	            });
	          };
	          setLoading(true);
	          callbackPromise.then(function () {
	            setLoading(false);
	          }, function () {
	            setLoading(false);
	          });
	        })();
	      }
	    }
	
	    // keyboard event support
	  }, {
	    key: 'handleKeyDown',
	    value: function handleKeyDown(e) {
	      e.preventDefault();
	    }
	  }, {
	    key: 'renderSwitcher',
	    value: function renderSwitcher(props, expandedState) {
	      var prefixCls = props.prefixCls;
	      var switcherCls = _defineProperty({}, prefixCls + '-switcher', true);
	      if (props.disabled) {
	        switcherCls[prefixCls + '-switcher-disabled'] = true;
	        return _react2['default'].createElement('span', { className: (0, _classnames2['default'])(switcherCls) });
	      }
	
	      var posObj = this.getPosition(props.pos);
	
	      if (!props.showLine) {
	        switcherCls[prefixCls + '-noline_' + expandedState] = true;
	      } else if (props.pos === '0-0') {
	        switcherCls[prefixCls + '-roots_' + expandedState] = true;
	      } else {
	        switcherCls[prefixCls + '-center_' + expandedState] = posObj.center;
	        switcherCls[prefixCls + '-bottom_' + expandedState] = posObj.last;
	      }
	      return _react2['default'].createElement('span', { className: (0, _classnames2['default'])(switcherCls), onClick: this.handleExpand });
	    }
	  }, {
	    key: 'renderCheckbox',
	    value: function renderCheckbox(props) {
	      var prefixCls = props.prefixCls;
	      var checkboxCls = _defineProperty({}, prefixCls + '-checkbox', true);
	      if (props.checkPart) {
	        checkboxCls[prefixCls + '-checkbox-indeterminate'] = true;
	      } else if (props.checked) {
	        checkboxCls[prefixCls + '-checkbox-checked'] = true;
	      }
	      var customEle = null;
	      if (typeof props.checkable !== 'boolean') {
	        customEle = props.checkable;
	      }
	      if (props.disabled) {
	        checkboxCls[prefixCls + '-checkbox-disabled'] = true;
	        return _react2['default'].createElement(
	          'span',
	          { ref: 'checkbox', className: (0, _classnames2['default'])(checkboxCls) },
	          customEle
	        );
	      }
	      return _react2['default'].createElement(
	        'span',
	        { ref: 'checkbox', className: (0, _classnames2['default'])(checkboxCls), onClick: this.handleCheck },
	        customEle
	      );
	    }
	  }, {
	    key: 'renderChildren',
	    value: function renderChildren(props) {
	      var renderFirst = this.renderFirst;
	      this.renderFirst = 1;
	      var transitionAppear = true;
	      if (!renderFirst && props.expanded) {
	        transitionAppear = false;
	      }
	      var children = props.children;
	      var newChildren = children;
	      if (!children) {
	        return children;
	      }
	      if (children.type === TreeNode || Array.isArray(children) && children.every(function (item) {
	        return item.type === TreeNode;
	      })) {
	        var _cls;
	
	        var cls = (_cls = {}, _defineProperty(_cls, props.prefixCls + '-child-tree', true), _defineProperty(_cls, props.prefixCls + '-child-tree-open', props.expanded), _cls);
	        if (props.showLine) {
	          cls[props.prefixCls + '-line'] = this.getPosition(props.pos).center;
	        }
	        var animProps = {};
	        if (props.openTransitionName) {
	          animProps.transitionName = props.openTransitionName;
	        } else if (typeof props.openAnimation === 'object') {
	          animProps.animation = (0, _objectAssign2['default'])({}, props.openAnimation);
	          if (!transitionAppear) {
	            delete animProps.animation.appear;
	          }
	        }
	        newChildren = this.newChildren = _react2['default'].createElement(
	          _rcAnimate2['default'],
	          _extends({}, animProps, {
	            showProp: 'expanded',
	            transitionAppear: transitionAppear,
	            component: '' }),
	          _react2['default'].createElement(
	            'ul',
	            { className: (0, _classnames2['default'])(cls), expanded: props.expanded },
	            _react2['default'].Children.map(children, function (item, index) {
	              return props.root.renderTreeNode(item, index, props.pos);
	            }, props.root)
	          )
	        );
	      }
	      return newChildren;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _iconEleCls,
	          _this3 = this;
	
	      var props = this.props;
	      var prefixCls = props.prefixCls;
	      var expandedState = props.expanded ? 'open' : 'close';
	
	      var iconEleCls = (_iconEleCls = {}, _defineProperty(_iconEleCls, prefixCls + '-iconEle', true), _defineProperty(_iconEleCls, prefixCls + '-icon_loading', this.state.dataLoading), _defineProperty(_iconEleCls, prefixCls + '-icon__' + expandedState, true), _iconEleCls);
	
	      var canRenderSwitcher = true;
	      var content = props.title;
	      var newChildren = this.renderChildren(props);
	      if (!newChildren || newChildren === props.children) {
	        // content = newChildren;
	        newChildren = null;
	        if (!props.onDataLoaded || props.isLeaf) {
	          canRenderSwitcher = false;
	        }
	      }
	
	      var selectHandle = function selectHandle() {
	        var icon = props.showIcon || props.onDataLoaded && _this3.state.dataLoading ? _react2['default'].createElement('span', { className: (0, _classnames2['default'])(iconEleCls) }) : null;
	        var title = _react2['default'].createElement(
	          'span',
	          { className: prefixCls + '-title' },
	          content
	        );
	        var domProps = {};
	        if (!props.disabled) {
	          if (props.selected || _this3.state.dragNodeHighlight) {
	            domProps.className = prefixCls + '-node-selected';
	          }
	          domProps.onClick = function (e) {
	            e.preventDefault();
	            _this3.handleSelect();
	            if (props.checkable) {
	              _this3.handleCheck();
	            }
	          };
	          if (props.onRightClick) {
	            domProps.onContextMenu = _this3.handleContextMenu;
	          }
	          if (props.draggable) {
	            if (ieOrEdge) {
	              // ie bug!
	              domProps.href = '#';
	            }
	            domProps.draggable = true;
	            domProps['aria-grabbed'] = true;
	            domProps.onDragStart = _this3.handleDragStart;
	          }
	        }
	        return _react2['default'].createElement(
	          'a',
	          _extends({ ref: 'selectHandle', title: content }, domProps),
	          icon,
	          title
	        );
	      };
	
	      var liProps = {};
	      if (props.draggable) {
	        liProps.onDragEnter = this.handleDragEnter;
	        liProps.onDragOver = this.handleDragOver;
	        liProps.onDragLeave = this.handleDragLeave;
	        liProps.onDrop = this.handleDrop;
	      }
	
	      var disabledCls = '';
	      var dragOverCls = '';
	      if (props.disabled) {
	        disabledCls = prefixCls + '-treenode-disabled';
	      } else if (props.dragOver) {
	        dragOverCls = 'drag-over';
	      } else if (props.dragOverGapTop) {
	        dragOverCls = 'drag-over-gap-top';
	      } else if (props.dragOverGapBottom) {
	        dragOverCls = 'drag-over-gap-bottom';
	      }
	
	      return _react2['default'].createElement(
	        'li',
	        _extends({}, liProps, { ref: 'li', className: (0, _classnames2['default'])(props.className, disabledCls, dragOverCls) }),
	        canRenderSwitcher ? this.renderSwitcher(props, expandedState) : _react2['default'].createElement('span', { className: prefixCls + '-switcher-noop' }),
	        props.checkable ? this.renderCheckbox(props) : null,
	        selectHandle(),
	        newChildren
	      );
	    }
	  }]);
	
	  return TreeNode;
	})(_react2['default'].Component);
	
	TreeNode.propTypes = {
	  prefixCls: _react2['default'].PropTypes.string,
	  expanded: _react2['default'].PropTypes.bool,
	  isLeaf: _react2['default'].PropTypes.bool,
	  root: _react2['default'].PropTypes.object,
	  onSelect: _react2['default'].PropTypes.func
	};
	TreeNode.defaultProps = {
	  title: defaultTitle
	};
	
	exports['default'] = TreeNode;
	module.exports = exports['default'];

/***/ },

/***/ 218:
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};


/***/ },

/***/ 219:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var x = 5;
	var y = 3;
	var z = 2;
	var gData = [];
	
	var generateData = function generateData(_level, _preKey, _tns) {
	  var preKey = _preKey || '0';
	  var tns = _tns || gData;
	
	  var children = [];
	  for (var i = 0; i < x; i++) {
	    var key = preKey + '-' + i;
	    tns.push({ title: key, key: key });
	    if (i < y) {
	      children.push(key);
	    }
	  }
	  if (_level < 0) {
	    return tns;
	  }
	  var __level = _level - 1;
	  children.forEach(function (key, index) {
	    tns[index].children = [];
	    return generateData(__level, key, tns[index].children);
	  });
	};
	generateData(z);
	
	exports.gData = gData;

/***/ }

});
//# sourceMappingURL=enhance.js.map