webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	// use jsx to render html, do not modify simple.html
	
	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	__webpack_require__(4);
	
	var _react = __webpack_require__(5);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(162);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTreeSelect = __webpack_require__(163);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _util = __webpack_require__(222);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  getInitialState: function getInitialState() {
	    return {
	      value: ['0-0']
	    };
	  },
	  onSelect: function onSelect(selectedKey, node, selectedKeys) {
	    console.log('selected: ', selectedKey, selectedKeys);
	    this.setState({
	      value: selectedKeys
	    });
	  },
	  onChange: function onChange(value) {
	    console.log('selected ' + value);
	    this.setState({
	      value: value
	    });
	  },
	  render: function render() {
	    var loop = function loop(data) {
	      return data.map(function (item) {
	        if (item.children) {
	          return _react2['default'].createElement(
	            _rcTreeSelect.TreeNode,
	            { key: item.key, value: item.key, title: item.key },
	            loop(item.children)
	          );
	        }
	        return _react2['default'].createElement(_rcTreeSelect.TreeNode, { key: item.key, value: item.key, title: item.key });
	      });
	    };
	    var tProps = {
	      // defaultValue: this.state.value,
	      value: this.state.value,
	      onChange: this.onChange,
	      onSelect: this.onSelect,
	      multiple: true,
	      // treeCheckable: true,
	      treeDefaultExpandAll: true
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

/***/ 4:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 222:
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