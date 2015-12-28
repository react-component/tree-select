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
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	var _react = __webpack_require__(4);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(161);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTreeSelect = __webpack_require__(162);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _util = __webpack_require__(221);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  getInitialState: function getInitialState() {
	    return {
	      value: []
	    };
	  },
	  onDeselect: function onDeselect(selectedValue) {
	    console.log('onDeselect', selectedValue);
	    var newVal = [].concat(_toConsumableArray(this.state.value));
	    newVal.splice(newVal.indexOf(selectedValue), 1);
	    this.setState({
	      value: newVal
	    });
	  },
	  onSelect: function onSelect(selectedKey, node, selectedKeys) {
	    console.log('selected: ', selectedKey, selectedKeys);
	    this.setState({
	      value: selectedKeys
	    });
	  },
	  onCheck: function onCheck(checkedKey, node, checkedKeys) {
	    console.log('onCheck:', checkedKey);
	    this.setState({
	      value: checkedKeys
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
	    var treeProps = {
	      showIcon: false,
	      showLine: true,
	      checkable: true,
	      defaultCheckedKeys: this.state.value,
	      defaultSelectedKeys: this.state.value
	    };
	    // selectedKeys:  this.state.value,
	    // checkedKeys: this.state.value,
	    // onCheck: this.onCheck,
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
	        { style: { width: 300 }, defaultValue: this.state.value, multiple: true, treeProps: treeProps,
	          onSelect: this.onSelect, onCheck: this.onCheck, onDeselect: this.onDeselect },
	        loop(_util.gData)
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ },

/***/ 221:
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