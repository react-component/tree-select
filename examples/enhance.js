webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(218);


/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

	// use jsx to render html, do not modify simple.html
	
	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	__webpack_require__(219);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(160);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTreeSelect = __webpack_require__(161);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _util = __webpack_require__(220);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  propTypes: {
	    multiple: _react.PropTypes.bool,
	    treeCheckable: _react.PropTypes.bool
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      multiple: true,
	      treeCheckable: true
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      value: undefined
	    };
	  },
	  onChange: function onChange(value) {
	    console.log('onChange ', value);
	    // can filter parent node if all its children is included
	    this.setState({
	      value: value
	    });
	  },
	  render: function render() {
	    var tProps = {
	      value: this.state.value,
	      onChange: this.onChange,
	      multiple: this.props.multiple,
	      treeCheckable: this.props.treeCheckable,
	      treeDefaultExpandAll: true
	    };
	    var loop = function loop(data) {
	      return data.map(function (item) {
	        if (item.children) {
	          return _react2['default'].createElement(
	            _rcTreeSelect.TreeNode,
	            { key: item.key, value: item.value,
	              title: item.key + ' label' },
	            loop(item.children)
	          );
	        }
	        return _react2['default'].createElement(_rcTreeSelect.TreeNode, { key: item.key, value: item.value, title: item.key + ' label' });
	      });
	    };
	    return _react2['default'].createElement(
	      'div',
	      { style: { padding: '10px 30px' } },
	      _react2['default'].createElement(
	        'h3',
	        null,
	        'more'
	      ),
	      _react2['default'].createElement(
	        _rcTreeSelect2['default'],
	        _extends({ style: { width: 300 } }, tProps),
	        loop(_util.gData)
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ },

/***/ 219:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 220:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var x = 3;
	var y = 2;
	var z = 1;
	var gData = [];
	
	var generateData = function generateData(_level, _preKey, _tns) {
	  var preKey = _preKey || '0';
	  var tns = _tns || gData;
	
	  var children = [];
	  for (var i = 0; i < x; i++) {
	    var key = preKey + '-' + i;
	    tns.push({ title: key, key: key, value: key });
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
	
	function loopData(data, callback) {
	  var loop = function loop(d) {
	    var level = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	
	    d.forEach(function (item, index) {
	      var pos = level + '-' + index;
	      if (item.children) {
	        loop(item.children, pos);
	      }
	      callback(item, index, pos);
	    });
	  };
	  loop(data);
	}
	
	function isInclude(smallArray, bigArray) {
	  return smallArray.every(function (ii, i) {
	    return ii === bigArray[i];
	  });
	}
	// console.log(isInclude(['0', '1'], ['0', '10', '1']));
	
	function getFilterValue(val, sVal, delVal) {
	  var allPos = [];
	  var delPos = [];
	  loopData(gData, function (item, index, pos) {
	    if (sVal.indexOf(item.value) > -1) {
	      allPos.push(pos);
	    }
	    if (delVal.indexOf(item.value) > -1) {
	      delPos.push(pos);
	    }
	  });
	  var newPos = [];
	  delPos.forEach(function (item) {
	    var nArr = item.split('-');
	    allPos.forEach(function (i) {
	      var iArr = i.split('-');
	      if (item === i || nArr.length > iArr.length && isInclude(iArr, nArr) || nArr.length < iArr.length && isInclude(nArr, iArr)) {
	        // 过滤掉 父级节点 和 所有子节点。
	        // 因为 node节点 不选时，其 父级节点 和 所有子节点 都不选。
	        return;
	      }
	      newPos.push(i);
	    });
	  });
	  var newVal = [];
	  if (newPos.length) {
	    loopData(gData, function (item, index, pos) {
	      if (newPos.indexOf(pos) > -1) {
	        newVal.push(item.value);
	      }
	    });
	  }
	  return newVal;
	}
	
	exports.gData = gData;
	exports.getFilterValue = getFilterValue;

/***/ }

});
//# sourceMappingURL=enhance.js.map