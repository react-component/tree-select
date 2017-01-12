webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(276);


/***/ },

/***/ 276:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(4);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(35);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTreeSelect = __webpack_require__(197);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _util = __webpack_require__(273);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint react/no-multi-comp:0, no-console:0 */
	
	var Demo = _react2.default.createClass({
	  displayName: 'Demo',
	
	  propTypes: {},
	  getInitialState: function getInitialState() {
	    return {
	      treeData: [{ label: 'pNode 01', value: '0-0', key: '0-0' }, { label: 'pNode 02', value: '0-1', key: '0-1' }, { label: 'pNode 03', value: '0-2', key: '0-2', isLeaf: true }],
	      // value: '0-0',
	      value: { value: '0-0-0-value', label: '0-0-0-label' }
	    };
	  },
	  onChange: function onChange(value) {
	    console.log(value);
	    this.setState({
	      value: value
	    });
	  },
	  onLoadData: function onLoadData(treeNode) {
	    var _this = this;
	
	    console.log(treeNode);
	    return new Promise(function (resolve) {
	      setTimeout(function () {
	        var treeData = [].concat(_toConsumableArray(_this.state.treeData));
	        (0, _util.getNewTreeData)(treeData, treeNode.props.eventKey, (0, _util.generateTreeNodes)(treeNode), 2);
	        _this.setState({ treeData: treeData });
	        resolve();
	      }, 500);
	    });
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      { style: { padding: '10px 30px' } },
	      _react2.default.createElement(
	        'h2',
	        null,
	        'dynamic render'
	      ),
	      _react2.default.createElement(_rcTreeSelect2.default, {
	        style: { width: 300 },
	        treeData: this.state.treeData,
	        labelInValue: true,
	        value: this.state.value,
	        onChange: this.onChange,
	        loadData: this.onLoadData
	      })
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=dynamic.js.map