webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(220);


/***/ },

/***/ 220:
/***/ function(module, exports, __webpack_require__) {

	// use jsx to render html, do not modify simple.html
	
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	var _rcTreeSelect = __webpack_require__(4);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _react = __webpack_require__(7);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(164);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	_reactDom2['default'].render(_react2['default'].createElement(
	  'div',
	  { style: { padding: '10px 30px' } },
	  _react2['default'].createElement(
	    'h3',
	    null,
	    'simple content'
	  ),
	  _react2['default'].createElement(
	    _rcTreeSelect2['default'],
	    { trigger: ['click'], overlay: _react2['default'].createElement(
	        'span',
	        null,
	        'popup content'
	      ), animation: 'slide-up' },
	    _react2['default'].createElement(
	      'button',
	      { style: { width: 100 } },
	      'open'
	    )
	  )
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=simple.js.map