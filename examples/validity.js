webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(224);


/***/ },

/***/ 221:
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

/***/ },

/***/ 224:
/***/ function(module, exports, __webpack_require__) {

	// use jsx to render html, do not modify simple.html
	
	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	__webpack_require__(2);
	
	__webpack_require__(221);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(160);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTreeSelect = __webpack_require__(161);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _rcForm = __webpack_require__(225);
	
	var _styles = __webpack_require__(253);
	
	var _util = __webpack_require__(222);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  propTypes: {
	    form: _react.PropTypes.object
	  },
	  onSelect: function onSelect(selectedValue, info) {
	    console.log('onSelect: ', selectedValue, info);
	    var newVal = [].concat(_toConsumableArray(this.props.value));
	
	    function setNewVal(i) {
	      var index = i;
	      if (index > -1) {
	        index = newVal.indexOf(info.node.props.value);
	        if (index > -1) {
	          newVal.splice(index, 1);
	        }
	      } else if (index === -1) {
	        newVal.push(info.node.props.value);
	      }
	    }
	
	    function getNode(arr, val) {
	      var node = undefined;
	      return arr.some(function (item) {
	        if (item.key === val) {
	          node = item.node;
	          return true;
	        }
	      }) && node;
	    }
	
	    if (info.event === 'select') {
	      setNewVal(info.selectedKeys.indexOf(info.node.props.eventKey));
	    } else if (info.event === 'check') {
	      newVal = [];
	      info.filterAllCheckedKeys.forEach(function (item) {
	        var node = getNode(info.allCheckedNodesKeys, item);
	        if (node) {
	          newVal.push(node.props.value);
	        } else if (info.node.props.eventKey === item) {
	          newVal.push(info.node.props.value);
	        }
	      });
	    }
	    this.props.onChange(newVal);
	  },
	  onChange: function onChange(value, label) {
	    console.log('onChange ', value, label);
	  },
	  render: function render() {
	    var props = this.props;
	    var _props$form = props.form;
	    var getFieldProps = _props$form.getFieldProps;
	    var getFieldError = _props$form.getFieldError;
	    var isFieldValidating = _props$form.isFieldValidating;
	
	    var errors = getFieldError('treeselect');
	
	    var tProps = {
	      // defaultValue: this.props.value,
	      value: this.props.value,
	      onChange: this.onChange,
	      onSelect: this.onSelect,
	      multiple: true,
	      treeCheckable: true,
	      treeDefaultExpandAll: true
	    };
	    // treeNodeLabelProp: 'title',
	    var loop = function loop(data) {
	      return data.map(function (item) {
	        if (item.children) {
	          return _react2['default'].createElement(
	            _rcTreeSelect.TreeNode,
	            { key: item.key, value: item.key, title: item.key + ' label' },
	            loop(item.children)
	          );
	        }
	        return _react2['default'].createElement(_rcTreeSelect.TreeNode, { key: item.key, value: item.key, title: item.key + ' label' });
	      });
	    };
	    return _react2['default'].createElement(
	      'div',
	      { style: _styles.regionStyle },
	      _react2['default'].createElement(
	        'div',
	        null,
	        _react2['default'].createElement(
	          'p',
	          { style: { color: 'blue' } },
	          'not work rightly'
	        ),
	        _react2['default'].createElement(
	          _rcTreeSelect2['default'],
	          _extends({ style: { width: 200 } }, tProps, getFieldProps('treeselect', {
	            validateTrigger: 'onSelect',
	            trigger: 'onSelect',
	            initialValue: this.props.value,
	            rules: [{ required: true, type: 'array' }]
	          })),
	          loop(_util.gData)
	        )
	      ),
	      _react2['default'].createElement(
	        'p',
	        { style: _styles.errorStyle },
	        errors ? errors.join(',') : null
	      ),
	      _react2['default'].createElement(
	        'p',
	        { style: _styles.errorStyle },
	        isFieldValidating('treeselect') ? 'validating' : null
	      )
	    );
	  }
	});
	
	var Demo1 = _react2['default'].createClass({
	  displayName: 'Demo1',
	
	  propTypes: {
	    form: _react.PropTypes.object
	  },
	  onSelect: function onSelect(selectedValue, info) {
	    console.log('onSelect: ', selectedValue, info);
	    var newVal = [].concat(_toConsumableArray(this.props.value));
	
	    function setNewVal(i) {
	      var index = i;
	      if (index > -1) {
	        index = newVal.indexOf(info.node.props.value);
	        if (index > -1) {
	          newVal.splice(index, 1);
	        }
	      } else if (index === -1) {
	        newVal.push(info.node.props.value);
	      }
	    }
	
	    function getNode(arr, val) {
	      var node = undefined;
	      return arr.some(function (item) {
	        if (item.key === val) {
	          node = item.node;
	          return true;
	        }
	      }) && node;
	    }
	
	    if (info.event === 'select') {
	      setNewVal(info.selectedKeys.indexOf(info.node.props.eventKey));
	    } else if (info.event === 'check') {
	      newVal = [];
	      info.filterAllCheckedKeys.forEach(function (item) {
	        var node = getNode(info.allCheckedNodesKeys, item);
	        if (node) {
	          newVal.push(node.props.value);
	        } else if (info.node.props.eventKey === item) {
	          newVal.push(info.node.props.value);
	        }
	      });
	    }
	    this.props.onChange(newVal);
	  },
	  render: function render() {
	    var tProps = {
	      // defaultValue: this.props.value,
	      value: this.props.value,
	      // onChange: this.onChange,
	      onSelect: this.onSelect,
	      multiple: true,
	      treeCheckable: true,
	      treeDefaultExpandAll: true
	    };
	    // treeNodeLabelProp: 'title',
	    var loop = function loop(data) {
	      return data.map(function (item) {
	        if (item.children) {
	          return _react2['default'].createElement(
	            _rcTreeSelect.TreeNode,
	            { key: item.key, value: item.key, title: item.key + ' label' },
	            loop(item.children)
	          );
	        }
	        return _react2['default'].createElement(_rcTreeSelect.TreeNode, { key: item.key, value: item.key, title: item.key + ' label' });
	      });
	    };
	    return _react2['default'].createElement(
	      _rcTreeSelect2['default'],
	      _extends({ style: { width: 200 } }, tProps),
	      loop(_util.gData)
	    );
	  }
	});
	
	var Form = (function (_Component) {
	  _inherits(Form, _Component);
	
	  _createClass(Form, null, [{
	    key: 'propTypes',
	    value: {
	      form: _react.PropTypes.object
	    },
	    enumerable: true
	  }]);
	
	  function Form(props) {
	    var _this = this;
	
	    _classCallCheck(this, _Form);
	
	    _get(Object.getPrototypeOf(_Form.prototype), 'constructor', this).call(this, props);
	
	    this.onSubmit = function (e) {
	      console.log('submit');
	      e.preventDefault();
	      _this.props.form.validateFields(function (error, values) {
	        if (!error) {
	          console.log('ok', values);
	        } else {
	          console.log('error', error, values);
	        }
	      });
	    };
	
	    this.reset = function (e) {
	      e.preventDefault();
	      _this.props.form.resetFields();
	    };
	
	    this.state = {
	      value: ['0-0-0'],
	      initialValue: ['0-0-0']
	    };
	  }
	
	  _createClass(Form, [{
	    key: 'onChange',
	    value: function onChange(newVal) {
	      console.log('newVal', newVal);
	      this.setState({
	        value: newVal
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var form = this.props.form;
	      var getFieldProps = form.getFieldProps;
	      var getFieldError = form.getFieldError;
	      var isFieldValidating = form.isFieldValidating;
	
	      var errors = getFieldError('treeselect1');
	      return _react2['default'].createElement(
	        'div',
	        { style: { margin: 20 } },
	        _react2['default'].createElement(
	          'h2',
	          null,
	          'validity'
	        ),
	        _react2['default'].createElement(
	          'form',
	          { onSubmit: this.onSubmit },
	          _react2['default'].createElement(
	            'div',
	            { style: _styles.regionStyle },
	            _react2['default'].createElement(
	              'p',
	              null,
	              'normal input, no validate'
	            ),
	            _react2['default'].createElement(
	              'p',
	              null,
	              _react2['default'].createElement('input', getFieldProps('normal'))
	            )
	          ),
	          _react2['default'].createElement(Demo, { form: form, value: this.state.value, onChange: this.onChange.bind(this) }),
	          _react2['default'].createElement(
	            'div',
	            { style: _styles.regionStyle },
	            _react2['default'].createElement(
	              'div',
	              null,
	              _react2['default'].createElement(
	                'p',
	                { style: { color: 'blue' } },
	                'work rightly'
	              ),
	              _react2['default'].createElement(Demo1, _extends({ form: form, value: this.state.value }, getFieldProps('treeselect1', {
	                initialValue: this.state.value,
	                rules: [{ required: true, type: 'array' }]
	              })))
	            ),
	            _react2['default'].createElement(
	              'p',
	              { style: _styles.errorStyle },
	              errors ? errors.join(',') : null
	            ),
	            _react2['default'].createElement(
	              'p',
	              { style: _styles.errorStyle },
	              isFieldValidating('treeselect1') ? 'validating' : null
	            )
	          ),
	          _react2['default'].createElement(
	            'div',
	            { style: _styles.regionStyle },
	            _react2['default'].createElement(
	              'button',
	              { onClick: this.reset },
	              'reset'
	            ),
	            ' ',
	            _react2['default'].createElement('input', { type: 'submit', value: 'submit' })
	          )
	        )
	      );
	    }
	  }]);
	
	  var _Form = Form;
	  Form = (0, _rcForm.createForm)({
	    // mapPropsToFields(props) {
	    //   console.log('mapPropsToFields', props);
	    //   return props.formState;
	    // },
	    onFieldsChange: function onFieldsChange(props, fields) {
	      console.log('onFieldsChange', fields);
	    }
	  })(Form) || Form;
	  return Form;
	})(_react.Component);
	
	_reactDom2['default'].render(_react2['default'].createElement(Form, null), document.getElementById('__react-content'));

/***/ },

/***/ 225:
/***/ function(module, exports, __webpack_require__) {

	// export this package's api
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _createForm = __webpack_require__(226);
	
	exports.createForm = _interopRequire(_createForm);

/***/ },

/***/ 226:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _utils = __webpack_require__(227);
	
	var _asyncValidator = __webpack_require__(229);
	
	var _asyncValidator2 = _interopRequireDefault(_asyncValidator);
	
	// avoid concurrency problems
	var gid = 0;
	var defaultValidateTrigger = 'onChange';
	var defaultTrigger = defaultValidateTrigger;
	
	function createForm() {
	  var option = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var mapPropsToFields = option.mapPropsToFields;
	  var onFieldsChange = option.onFieldsChange;
	  var _option$formPropName = option.formPropName;
	  var formPropName = _option$formPropName === undefined ? 'form' : _option$formPropName;
	
	  function decorate(WrappedComponent) {
	    var Form = (function (_Component) {
	      _inherits(Form, _Component);
	
	      function Form() {
	        var _this = this;
	
	        _classCallCheck(this, Form);
	
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }
	
	        _get(Object.getPrototypeOf(Form.prototype), 'constructor', this).apply(this, args);
	        var fields = undefined;
	        if (mapPropsToFields) {
	          fields = mapPropsToFields(this.props);
	        }
	        this.fields = fields || {};
	        this.fieldsMeta = {};
	        this.cachedBind = {};
	        var bindMethods = ['getFieldProps', 'isFieldValidating', 'getFieldError', 'setFields', 'resetFields', 'validateFieldsByName', 'getFieldsValue', 'setFieldsValue', 'getFieldValue'];
	        bindMethods.forEach(function (m) {
	          _this[m] = _this[m].bind(_this);
	        });
	      }
	
	      _createClass(Form, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	          this.componentDidUpdate();
	        }
	      }, {
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(nextProps) {
	          if (mapPropsToFields) {
	            var fields = mapPropsToFields(nextProps);
	            if (fields) {
	              this.fields = _extends({}, this.fields, fields);
	            }
	          }
	        }
	      }, {
	        key: 'componentDidUpdate',
	        value: function componentDidUpdate() {
	          var fields = this.fields;
	          var fieldsMeta = this.fieldsMeta;
	
	          var fieldsKeys = Object.keys(fields);
	          fieldsKeys.forEach(function (s) {
	            if (!fieldsMeta[s]) {
	              delete fields[s];
	            }
	          });
	          // do not notify store
	        }
	      }, {
	        key: 'onChange',
	        value: function onChange(name, event) {
	          var fieldMeta = this.getFieldMeta(name);
	          var _fieldMeta$trigger = fieldMeta.trigger;
	          var trigger = _fieldMeta$trigger === undefined ? defaultTrigger : _fieldMeta$trigger;
	          var rules = fieldMeta.rules;
	
	          if (fieldMeta[trigger]) {
	            fieldMeta[trigger](event);
	          }
	          var value = (0, _utils.getValueFromEvent)(event);
	          var field = this.getField(name, true);
	          this.setFields(_defineProperty({}, name, _extends({}, field, {
	            value: value,
	            dirty: !!rules,
	            sid: ++gid
	          })));
	        }
	      }, {
	        key: 'onChangeValidate',
	        value: function onChangeValidate(name, event) {
	          var fieldMeta = this.getFieldMeta(name);
	          var _fieldMeta$validateTrigger = fieldMeta.validateTrigger;
	          var validateTrigger = _fieldMeta$validateTrigger === undefined ? defaultValidateTrigger : _fieldMeta$validateTrigger;
	
	          if (fieldMeta[validateTrigger]) {
	            fieldMeta[validateTrigger](event);
	          }
	          var value = (0, _utils.getValueFromEvent)(event);
	          var field = this.getField(name, true);
	          field.value = value;
	          field.dirty = true;
	          this.validateFields([field]);
	        }
	      }, {
	        key: 'getCacheBind',
	        value: function getCacheBind(name, action, fn) {
	          var cache = this.cachedBind[name] = this.cachedBind[name] || {};
	          if (!cache[action]) {
	            cache[action] = fn.bind(this, name);
	          }
	          return cache[action];
	        }
	      }, {
	        key: 'getFieldMeta',
	        value: function getFieldMeta(name) {
	          return this.fieldsMeta[name];
	        }
	      }, {
	        key: 'getField',
	        value: function getField(name, copy) {
	          var ret = this.fields[name];
	          if (ret) {
	            ret.name = name;
	          }
	          if (copy) {
	            if (ret) {
	              return _extends({}, ret);
	            }
	            return { name: name };
	          }
	          return ret;
	        }
	      }, {
	        key: 'getFieldProps',
	        value: function getFieldProps(name) {
	          var fieldOption = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	          var rules = fieldOption.rules;
	          var _fieldOption$trigger = fieldOption.trigger;
	          var trigger = _fieldOption$trigger === undefined ? defaultTrigger : _fieldOption$trigger;
	          var _fieldOption$valuePropName = fieldOption.valuePropName;
	          var valuePropName = _fieldOption$valuePropName === undefined ? 'value' : _fieldOption$valuePropName;
	          var _fieldOption$validateTrigger = fieldOption.validateTrigger;
	          var validateTrigger = _fieldOption$validateTrigger === undefined ? defaultValidateTrigger : _fieldOption$validateTrigger;
	
	          var inputProps = _defineProperty({}, valuePropName, fieldOption.initialValue);
	          if (rules && validateTrigger) {
	            inputProps[validateTrigger] = this.getCacheBind(name, validateTrigger, this.onChangeValidate);
	          }
	          if (trigger && (validateTrigger !== trigger || !rules)) {
	            inputProps[trigger] = this.getCacheBind(name, trigger, this.onChange);
	          }
	          var field = this.getField(name);
	          if (field && 'value' in field) {
	            inputProps[valuePropName] = field.value;
	          }
	          this.fieldsMeta[name] = fieldOption;
	          return inputProps;
	        }
	      }, {
	        key: 'getFieldMember',
	        value: function getFieldMember(name, member) {
	          var field = this.getField(name);
	          return field && field[member];
	        }
	      }, {
	        key: 'getFieldError',
	        value: function getFieldError(name) {
	          return this.getFieldMember(name, 'errors');
	        }
	      }, {
	        key: 'getValidFieldsName',
	        value: function getValidFieldsName() {
	          var fieldsMeta = this.fieldsMeta;
	          return fieldsMeta ? Object.keys(fieldsMeta).filter(function (name) {
	            return !fieldsMeta[name].hidden;
	          }) : [];
	        }
	      }, {
	        key: 'getFieldsValue',
	        value: function getFieldsValue(names) {
	          var _this2 = this;
	
	          var fields = names || this.getValidFieldsName();
	          var allValues = {};
	          fields.forEach(function (f) {
	            allValues[f] = _this2.getFieldValue(f);
	          });
	          return allValues;
	        }
	      }, {
	        key: 'getFieldValue',
	        value: function getFieldValue(name) {
	          var fields = this.fields;
	
	          return this.getValueFromFields(name, fields);
	        }
	      }, {
	        key: 'getValueFromFields',
	        value: function getValueFromFields(name, fields) {
	          var fieldsMeta = this.fieldsMeta;
	
	          var field = fields[name];
	          if (field && 'value' in field) {
	            return field.value;
	          }
	          var fieldMeta = fieldsMeta[name];
	          return fieldMeta && fieldMeta.initialValue;
	        }
	      }, {
	        key: 'getForm',
	        value: function getForm() {
	          return {
	            getFieldsValue: this.getFieldsValue,
	            getFieldValue: this.getFieldValue,
	            setFieldsValue: this.setFieldsValue,
	            setFields: this.setFields,
	            getFieldProps: this.getFieldProps,
	            getFieldError: this.getFieldError,
	            isFieldValidating: this.isFieldValidating,
	            validateFields: this.validateFieldsByName,
	            resetFields: this.resetFields
	          };
	        }
	      }, {
	        key: 'setFields',
	        value: function setFields(fields) {
	          var _this3 = this;
	
	          var originalFields = this.fields;
	          var nowFields = _extends({}, originalFields, fields);
	          var fieldsMeta = this.fieldsMeta;
	          var nowValues = {};
	          Object.keys(fieldsMeta).forEach(function (f) {
	            nowValues[f] = _this3.getValueFromFields(f, nowFields);
	          });
	          var changedFieldsName = Object.keys(fields);
	          Object.keys(nowValues).forEach(function (f) {
	            var value = nowValues[f];
	            var fieldMeta = fieldsMeta[f];
	            if (fieldMeta && fieldMeta.normalize) {
	              var nowValue = fieldMeta.normalize(value, _this3.getValueFromFields(f, originalFields), nowValues);
	              if (nowValue !== value) {
	                nowFields[f] = _extends({}, nowFields[f], { value: nowValue });
	                if (changedFieldsName.indexOf(f) === -1) {
	                  changedFieldsName.push(f);
	                }
	              }
	            }
	          });
	          this.fields = nowFields;
	          if (onFieldsChange) {
	            (function () {
	              var changedFields = {};
	              changedFieldsName.forEach(function (f) {
	                changedFields[f] = nowFields[f];
	              });
	              onFieldsChange(_this3.props, changedFields);
	            })();
	          }
	          this.forceUpdate();
	        }
	      }, {
	        key: 'setFieldsValue',
	        value: function setFieldsValue(fieldsValue) {
	          var fields = {};
	          for (var _name in fieldsValue) {
	            if (fieldsValue.hasOwnProperty(_name)) {
	              fields[_name] = {
	                name: _name,
	                value: fieldsValue[_name]
	              };
	            }
	          }
	          this.setFields(fields);
	        }
	      }, {
	        key: 'validateFields',
	        value: function validateFields(fields, callback, fieldNames) {
	          var _this4 = this;
	
	          var currentGlobalId = gid;
	          ++gid;
	          var allRules = {};
	          var allValues = {};
	          var allFields = {};
	          var alreadyErrors = {};
	          fields.forEach(function (field) {
	            var name = field.name;
	            if (field.dirty === false) {
	              if (field.errors) {
	                alreadyErrors[name] = field.errors;
	              }
	              return;
	            }
	            var fieldMeta = _this4.getFieldMeta(name);
	            field.errors = undefined;
	            field.validating = true;
	            field.dirty = true;
	            field.sid = currentGlobalId;
	            allRules[name] = fieldMeta.rules;
	            allValues[name] = field.value;
	            allFields[name] = field;
	          });
	          this.setFields(allFields);
	          var nowFields = this.fields;
	          // incase normalize
	          Object.keys(allValues).forEach(function (f) {
	            allValues[f] = nowFields[f].value;
	          });
	          if (callback && (0, _utils.isEmptyObject)(allFields)) {
	            callback((0, _utils.isEmptyObject)(alreadyErrors) ? null : alreadyErrors, this.getFieldsValue(fieldNames));
	            return;
	          }
	          new _asyncValidator2['default'](allRules).validate(allValues, function (errors) {
	            var errorsGroup = _extends({}, alreadyErrors);
	            if (errors && errors.length) {
	              errors.forEach(function (e) {
	                var fieldName = e.field;
	                var fieldErrors = errorsGroup[fieldName] || [];
	                fieldErrors.push(e);
	                errorsGroup[fieldName] = fieldErrors;
	              });
	            }
	            var expired = false;
	            var nowAllFields = {};
	            Object.keys(allRules).forEach(function (name) {
	              var fieldErrors = errorsGroup[name];
	              var nowField = _this4.getField(name, true);
	              if (nowField.sid !== currentGlobalId) {
	                expired = true;
	              } else {
	                nowField.errors = fieldErrors && (0, _utils.getErrorStrs)(fieldErrors);
	                nowField.validating = false;
	                nowField.dirty = false;
	                nowField.value = allValues[name];
	                nowAllFields[name] = nowField;
	              }
	            });
	            _this4.setFields(nowAllFields);
	            if (callback && !expired) {
	              callback((0, _utils.isEmptyObject)(errorsGroup) ? null : errorsGroup, _this4.getFieldsValue(fieldNames));
	            }
	          });
	        }
	      }, {
	        key: 'validateFieldsByName',
	        value: function validateFieldsByName(ns, cb) {
	          var _this5 = this;
	
	          var names = ns;
	          var callback = cb;
	          if (typeof names === 'function') {
	            callback = names;
	            names = undefined;
	          }
	          var fieldNames = names || this.getValidFieldsName();
	          var fields = fieldNames.map(function (name) {
	            var fieldMeta = _this5.getFieldMeta(name);
	            if (!fieldMeta.rules) {
	              return null;
	            }
	            var field = _this5.getField(name, true);
	            field.value = _this5.getFieldValue(name);
	            return field;
	          }).filter(function (f) {
	            return !!f;
	          });
	          if (!fields.length) {
	            if (callback) {
	              callback(null, this.getFieldsValue(fieldNames));
	            }
	            return;
	          }
	          this.validateFields(fields, callback, fieldNames);
	        }
	      }, {
	        key: 'isFieldValidating',
	        value: function isFieldValidating(name) {
	          return this.getFieldMember(name, 'validating');
	        }
	      }, {
	        key: 'resetFields',
	        value: function resetFields(ns) {
	          var newFields = {};
	          var fields = this.fields;
	
	          var changed = false;
	          var names = ns || Object.keys(fields);
	          names.forEach(function (name) {
	            var field = fields[name];
	            if (field && 'value' in field) {
	              changed = true;
	              newFields[name] = {};
	            }
	          });
	          if (changed) {
	            this.setFields(newFields);
	          }
	        }
	      }, {
	        key: 'render',
	        value: function render() {
	          var formProps = _defineProperty({}, formPropName, this.getForm());
	          this.fieldsMeta = {};
	          return _react2['default'].createElement(WrappedComponent, _extends({}, formProps, this.props));
	        }
	      }]);
	
	      return Form;
	    })(_react.Component);
	
	    return (0, _utils.argumentContainer)(Form, WrappedComponent);
	  }
	
	  return decorate;
	}
	
	exports['default'] = createForm;
	module.exports = exports['default'];

/***/ },

/***/ 227:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.argumentContainer = argumentContainer;
	exports.getValueFromEvent = getValueFromEvent;
	exports.getErrorStrs = getErrorStrs;
	exports.isEmptyObject = isEmptyObject;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _hoistNonReactStatics = __webpack_require__(228);
	
	var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);
	
	function getDisplayName(WrappedComponent) {
	  return WrappedComponent.displayName || WrappedComponent.name || 'WrappedComponent';
	}
	
	function argumentContainer(Container, WrappedComponent) {
	  Container.displayName = 'Form(' + getDisplayName(WrappedComponent) + ')';
	  Container.WrappedComponent = WrappedComponent;
	  return (0, _hoistNonReactStatics2['default'])(Container, WrappedComponent);
	}
	
	function getValueFromEvent(e) {
	  // support custom element
	  if (!e || !e.target) {
	    return e;
	  }
	  var target = e.target;
	
	  return target.type === 'checkbox' ? target.checked : target.value;
	}
	
	function getErrorStrs(errors) {
	  if (errors) {
	    return errors.map(function (e) {
	      if (e.message) {
	        return e.message;
	      }
	      return e;
	    });
	  }
	  return errors;
	}
	
	function isEmptyObject(obj) {
	  return Object.keys(obj).length === 0;
	}

/***/ },

/***/ 228:
/***/ function(module, exports) {

	/**
	 * Copyright 2015, Yahoo! Inc.
	 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	 */
	'use strict';
	
	var REACT_STATICS = {
	    childContextTypes: true,
	    contextTypes: true,
	    defaultProps: true,
	    displayName: true,
	    getDefaultProps: true,
	    mixins: true,
	    propTypes: true,
	    type: true
	};
	
	var KNOWN_STATICS = {
	    name: true,
	    length: true,
	    prototype: true,
	    caller: true,
	    arguments: true,
	    arity: true
	};
	
	module.exports = function hoistNonReactStatics(targetComponent, sourceComponent) {
	    var keys = Object.getOwnPropertyNames(sourceComponent);
	    for (var i=0; i<keys.length; ++i) {
	        if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]]) {
	            targetComponent[keys[i]] = sourceComponent[keys[i]];
	        }
	    }
	
	    return targetComponent;
	};


/***/ },

/***/ 229:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _util = __webpack_require__(230);
	
	var util = _interopRequireWildcard(_util);
	
	var _validator = __webpack_require__(231);
	
	var _validator2 = _interopRequireDefault(_validator);
	
	var _messages2 = __webpack_require__(252);
	
	var _messages3 = _interopRequireDefault(_messages2);
	
	var _rule = __webpack_require__(233);
	
	function asyncMap(arr, func, callback) {
	  var results = [];
	
	  function count(_, result) {
	    results.push(result);
	    if (results.length === arr.length) {
	      callback(null, results);
	    }
	  }
	
	  arr.forEach(function (a) {
	    func(a, count);
	  });
	}
	
	function complementError(rule) {
	  return function (oe) {
	    var e = oe;
	    if (!e.message) {
	      e = new Error(e);
	    }
	    e.field = e.field || rule.fullField;
	    return e;
	  };
	}
	
	/**
	 *  Encapsulates a validation schema.
	 *
	 *  @param descriptor An object declaring validation rules
	 *  for this schema.
	 */
	function Schema(descriptor) {
	  this.rules = null;
	  this._messages = _messages3['default'];
	  this.define(descriptor);
	}
	
	Schema.prototype = {
	  messages: function messages(_messages) {
	    if (_messages) {
	      this._messages = _messages;
	    }
	    return this._messages;
	  },
	  define: function define(rules) {
	    if (!rules) {
	      throw new Error('Cannot configure a schema with no rules');
	    }
	    if (typeof rules !== 'object' || Array.isArray(rules)) {
	      throw new Error('Rules must be an object');
	    }
	    this.rules = {};
	    var z = undefined;
	    var item = undefined;
	    for (z in rules) {
	      if (rules.hasOwnProperty(z)) {
	        item = rules[z];
	        this.rules[z] = Array.isArray(item) ? item : [item];
	      }
	    }
	  },
	  validate: function validate(source, o, oc) {
	    var _this = this;
	
	    if (!this.rules) {
	      throw new Error('Cannot validate with no rules.');
	    }
	    var callback = oc;
	    var options = o || {};
	    if (typeof options === 'function') {
	      callback = options;
	      options = {};
	    }
	    function complete(results) {
	      var i = undefined;
	      var field = undefined;
	      var errors = [];
	      var fields = {};
	
	      function add(e) {
	        if (e instanceof Error) {
	          errors.push(e);
	        } else if (Array.isArray(e)) {
	          errors = errors.concat.apply(errors, e);
	        }
	      }
	
	      for (i = 0; i < results.length; i++) {
	        add(results[i]);
	      }
	      if (!errors.length) {
	        errors = null;
	        fields = null;
	      } else {
	        if (options.single) {
	          errors = errors.slice(0, 1);
	        }
	        for (i = 0; i < errors.length; i++) {
	          field = errors[i].field;
	          fields[field] = fields[field] || [];
	          fields[field].push(errors[i]);
	        }
	      }
	      callback(errors, fields);
	    }
	
	    options.messages = options.messages || this.messages();
	    options.error = _rule.error;
	    var arr = undefined;
	    var value = undefined;
	    var series = [];
	    var keys = options.keys || Object.keys(this.rules);
	    keys.forEach(function (z) {
	      arr = _this.rules[z];
	      value = source[z];
	      arr.forEach(function (r) {
	        var rule = r;
	        if (typeof rule.transform === 'function') {
	          value = source[z] = rule.transform(value);
	        }
	        if (typeof rule === 'function') {
	          rule = {
	            validator: rule
	          };
	        }
	        rule.field = z;
	        rule.fullField = rule.fullField || z;
	        rule.type = _this.getType(rule);
	        rule.validator = _this.getValidationMethod(rule);
	        if (!rule.validator) {
	          return;
	        }
	        series.push({ rule: rule, value: value, source: source, field: z });
	      });
	    });
	    asyncMap(series, function (data, doIt) {
	      var rule = data.rule;
	      var deep = (rule.type === 'object' || rule.type === 'array') && typeof rule.fields === 'object';
	      deep = deep && (rule.required || !rule.required && data.value);
	      rule.field = data.field;
	      function cb(e) {
	        var errors = e;
	        if (errors && !Array.isArray(errors)) {
	          errors = [errors];
	        }
	        if (errors && errors.length && rule.message) {
	          errors = [].concat(rule.message);
	        }
	        if (errors) {
	          errors = errors.map(complementError(rule));
	        }
	        if (options.first && errors && errors.length) {
	          return doIt(errors);
	        }
	        if (!deep) {
	          doIt(null, errors);
	        } else {
	          errors = errors || [];
	          // if rule is required but the target object
	          // does not exist fail at the rule level and don't
	          // go deeper
	          if (rule.required && !data.value) {
	            if (rule.message) {
	              errors = [].concat(rule.message).map(complementError(rule));
	            } else {
	              errors = [options.error(rule, util.format(options.messages.required, rule.field))];
	            }
	            return doIt(null, errors);
	          }
	          var fieldsSchema = data.rule.fields;
	          for (var f in fieldsSchema) {
	            if (fieldsSchema.hasOwnProperty(f)) {
	              var fieldSchema = fieldsSchema[f];
	              fieldSchema.fullField = rule.fullField + '.' + f;
	            }
	          }
	          var schema = new Schema(fieldsSchema);
	          schema.messages(options.messages);
	          if (data.rule.options) {
	            data.rule.options.messages = options.messages;
	            data.rule.options.error = options.error;
	          }
	          schema.validate(data.value, data.rule.options || options, function (errs) {
	            doIt(null, errs && errs.length ? errors.concat(errs) : errs);
	          });
	        }
	      }
	
	      rule.validator(rule, data.value, cb, data.source, options);
	    }, function (err, results) {
	      complete(results);
	    });
	  },
	  getType: function getType(rule) {
	    if (rule.type === undefined && rule.pattern instanceof RegExp) {
	      rule.type = 'pattern';
	    }
	    if (typeof rule.validator !== 'function' && rule.type && !_validator2['default'].hasOwnProperty(rule.type)) {
	      throw new Error(util.format('Unknown rule type %s', rule.type));
	    }
	    return rule.type || 'string';
	  },
	  getValidationMethod: function getValidationMethod(rule) {
	    if (typeof rule.validator === 'function') {
	      return rule.validator;
	    }
	    return _validator2['default'][rule.type] || false;
	  }
	};
	
	Schema.register = function register(type, validator) {
	  if (typeof validator !== 'function') {
	    throw new Error('Cannot register a validator by type, validator is not a function');
	  }
	  _validator2['default'][type] = validator;
	};
	
	Schema.messages = _messages3['default'];
	
	exports['default'] = Schema;
	module.exports = exports['default'];

/***/ },

/***/ 230:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.format = format;
	exports.isEmptyValue = isEmptyValue;
	var formatRegExp = /%[sdj%]/g;
	
	function format() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  var i = 1;
	  var f = args[0];
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function (x) {
	    if (x === '%%') {
	      return '%';
	    }
	    if (i >= len) {
	      return x;
	    }
	    switch (x) {
	      case '%s':
	        return String(args[i++]);
	      case '%d':
	        return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	        break;
	      default:
	        return x;
	    }
	  });
	  for (var arg = args[i]; i < len; arg = args[++i]) {
	    str += ' ' + arg;
	  }
	  return str;
	}
	
	function isEmptyValue(value, type) {
	  if (value === undefined || value === null) {
	    return true;
	  }
	  if (type === 'array' && Array.isArray(value) && !value.length) {
	    return true;
	  }
	  if (type === 'string' && typeof value === 'string' && !value) {
	    return true;
	  }
	  return false;
	}

/***/ },

/***/ 231:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = {
	  string: __webpack_require__(232),
	  method: __webpack_require__(240),
	  number: __webpack_require__(241),
	  boolean: __webpack_require__(242),
	  regexp: __webpack_require__(243),
	  integer: __webpack_require__(244),
	  'float': __webpack_require__(245),
	  array: __webpack_require__(246),
	  object: __webpack_require__(247),
	  'enum': __webpack_require__(248),
	  pattern: __webpack_require__(249),
	  email: __webpack_require__(250),
	  url: __webpack_require__(250),
	  date: __webpack_require__(251),
	  hex: __webpack_require__(250)
	};
	module.exports = exports['default'];

/***/ },

/***/ 232:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	var _util = __webpack_require__(230);
	
	/**
	 *  Performs validation for string types.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function string(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value, 'string') && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options, 'string');
	    if (!(0, _util.isEmptyValue)(value, 'string')) {
	      _rule2['default'].type(rule, value, source, errors, options);
	      _rule2['default'].range(rule, value, source, errors, options);
	      _rule2['default'].pattern(rule, value, source, errors, options);
	      if (rule.whitespace === true) {
	        _rule2['default'].whitespace(rule, value, source, errors, options);
	      }
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = string;
	module.exports = exports['default'];

/***/ },

/***/ 233:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = {
	  required: __webpack_require__(234),
	  whitespace: __webpack_require__(235),
	  type: __webpack_require__(236),
	  range: __webpack_require__(237),
	  'enum': __webpack_require__(238),
	  pattern: __webpack_require__(239)
	};
	module.exports = exports['default'];

/***/ },

/***/ 234:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _util = __webpack_require__(230);
	
	var util = _interopRequireWildcard(_util);
	
	/**
	 *  Rule for validating required fields.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function required(rule, value, source, errors, options, type) {
	  if (rule.required && (!source.hasOwnProperty(rule.field) || util.isEmptyValue(value, type))) {
	    errors.push(util.format(options.messages.required, rule.fullField));
	  }
	}
	
	exports['default'] = required;
	module.exports = exports['default'];

/***/ },

/***/ 235:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _util = __webpack_require__(230);
	
	var util = _interopRequireWildcard(_util);
	
	/**
	 *  Rule for validating whitespace.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function whitespace(rule, value, source, errors, options) {
	  if (/^\s+$/.test(value) || value === '') {
	    errors.push(util.format(options.messages.whitespace, rule.fullField));
	  }
	}
	
	exports['default'] = whitespace;
	module.exports = exports['default'];

/***/ },

/***/ 236:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _util = __webpack_require__(230);
	
	var util = _interopRequireWildcard(_util);
	
	var _required = __webpack_require__(234);
	
	var _required2 = _interopRequireDefault(_required);
	
	var pattern = {
	  email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
	  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(([\/\w\.-]*)?)(\?[-_+=~\.;&%\w]*)?(\#[-_\/\!\w]*)?( *)?$/i,
	  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
	};
	
	var types = {
	  integer: function integer(value) {
	    return types.number(value) && parseInt(value, 10) === value;
	  },
	  float: function float(value) {
	    return types.number(value) && !types.integer(value);
	  },
	  array: function array(value) {
	    return Array.isArray(value);
	  },
	  regexp: function regexp(value) {
	    if (value instanceof RegExp) {
	      return true;
	    }
	    try {
	      return !!new RegExp(value);
	    } catch (e) {
	      return false;
	    }
	  },
	  date: function date(value) {
	    return typeof value.getTime === 'function' && typeof value.getMonth === 'function' && typeof value.getYear === 'function';
	  },
	  number: function number(value) {
	    if (isNaN(value)) {
	      return false;
	    }
	    return typeof value === 'number';
	  },
	  object: function object(value) {
	    return typeof value === 'object' && !types.array(value);
	  },
	  method: function method(value) {
	    return typeof value === 'function';
	  },
	  email: function email(value) {
	    return typeof value === 'string' && !!value.match(pattern.email);
	  },
	  url: function url(value) {
	    return typeof value === 'string' && !!value.match(pattern.url);
	  },
	  hex: function hex(value) {
	    return typeof value === 'string' && !!value.match(pattern.hex);
	  }
	};
	
	/**
	 *  Rule for validating the type of a value.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function type(rule, value, source, errors, options) {
	  if (rule.required && value === undefined) {
	    (0, _required2['default'])(rule, value, source, errors, options);
	    return;
	  }
	  var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method', 'email', 'number', 'date', 'url', 'hex'];
	  var ruleType = rule.type;
	  if (custom.indexOf(ruleType) > -1) {
	    if (!types[ruleType](value)) {
	      errors.push(util.format(options.messages.types[ruleType], rule.fullField, rule.type));
	    }
	    // straight typeof check
	  } else if (ruleType && typeof value !== rule.type) {
	      errors.push(util.format(options.messages.types[ruleType], rule.fullField, rule.type));
	    }
	}
	
	exports['default'] = type;
	module.exports = exports['default'];

/***/ },

/***/ 237:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _util = __webpack_require__(230);
	
	var util = _interopRequireWildcard(_util);
	
	/**
	 *  Rule for validating minimum and maximum allowed values.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function range(rule, value, source, errors, options) {
	  var len = typeof rule.len === 'number';
	  var min = typeof rule.min === 'number';
	  var max = typeof rule.max === 'number';
	  var val = value;
	  var key = null;
	  var num = typeof value === 'number';
	  var str = typeof value === 'string';
	  var arr = Array.isArray(value);
	  if (num) {
	    key = 'number';
	  } else if (str) {
	    key = 'string';
	  } else if (arr) {
	    key = 'array';
	  }
	  // if the value is not of a supported type for range validation
	  // the validation rule rule should use the
	  // type property to also test for a particular type
	  if (!key) {
	    return false;
	  }
	  if (str || arr) {
	    val = value.length;
	  }
	  if (len) {
	    if (val !== rule.len) {
	      errors.push(util.format(options.messages[key].len, rule.fullField, rule.len));
	    }
	  } else if (min && !max && val < rule.min) {
	    errors.push(util.format(options.messages[key].min, rule.fullField, rule.min));
	  } else if (max && !min && val > rule.max) {
	    errors.push(util.format(options.messages[key].max, rule.fullField, rule.max));
	  } else if (min && max && (val < rule.min || val > rule.max)) {
	    errors.push(util.format(options.messages[key].range, rule.fullField, rule.min, rule.max));
	  }
	}
	
	exports['default'] = range;
	module.exports = exports['default'];

/***/ },

/***/ 238:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _util = __webpack_require__(230);
	
	var util = _interopRequireWildcard(_util);
	
	var ENUM = 'enum';
	
	/**
	 *  Rule for validating a value exists in an enumerable list.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function enumerable(rule, value, source, errors, options) {
	  rule[ENUM] = Array.isArray(rule[ENUM]) ? rule[ENUM] : [];
	  if (rule[ENUM].indexOf(value) === -1) {
	    errors.push(util.format(options.messages[ENUM], rule.fullField, rule[ENUM].join(', ')));
	  }
	}
	
	exports['default'] = enumerable;
	module.exports = exports['default'];

/***/ },

/***/ 239:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _util = __webpack_require__(230);
	
	var util = _interopRequireWildcard(_util);
	
	/**
	 *  Rule for validating a regular expression pattern.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function pattern(rule, value, source, errors, options) {
	  if (rule.pattern instanceof RegExp) {
	    if (!rule.pattern.test(value)) {
	      errors.push(util.format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
	    }
	  }
	}
	
	exports['default'] = pattern;
	module.exports = exports['default'];

/***/ },

/***/ 240:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	/**
	 *  Validates a function.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function method(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if (value === undefined && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2['default'].type(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = method;
	module.exports = exports['default'];

/***/ },

/***/ 241:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	/**
	 *  Validates a number.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function number(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if (value === undefined && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2['default'].type(rule, value, source, errors, options);
	      _rule2['default'].range(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = number;
	module.exports = exports['default'];

/***/ },

/***/ 242:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	/**
	 *  Validates a boolean.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function boolean(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if (value === undefined && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2['default'].type(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = boolean;
	module.exports = exports['default'];

/***/ },

/***/ 243:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	var _util = __webpack_require__(230);
	
	/**
	 *  Validates the regular expression type.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function regexp(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options);
	    if (!(0, _util.isEmptyValue)(value)) {
	      _rule2['default'].type(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = regexp;
	module.exports = exports['default'];

/***/ },

/***/ 244:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	/**
	 *  Validates a number is an integer.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function integer(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if (value === undefined && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2['default'].type(rule, value, source, errors, options);
	      _rule2['default'].range(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = integer;
	module.exports = exports['default'];

/***/ },

/***/ 245:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	/**
	 *  Validates a number is a floating point number.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function floatFn(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if (value === undefined && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2['default'].type(rule, value, source, errors, options);
	      _rule2['default'].range(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = floatFn;
	module.exports = exports['default'];

/***/ },

/***/ 246:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	var _util = __webpack_require__(230);
	
	/**
	 *  Validates an array.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function array(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value, 'array') && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options, 'array');
	    if (!(0, _util.isEmptyValue)(value, 'array')) {
	      _rule2['default'].type(rule, value, source, errors, options);
	      _rule2['default'].range(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = array;
	module.exports = exports['default'];

/***/ },

/***/ 247:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	/**
	 *  Validates an object.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function object(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if (value === undefined && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2['default'].type(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = object;
	module.exports = exports['default'];

/***/ },

/***/ 248:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	var ENUM = 'enum';
	
	/**
	 *  Validates an enumerable list.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function enumerable(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if (value === undefined && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options);
	    if (value) {
	      _rule2['default'][ENUM](rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = enumerable;
	module.exports = exports['default'];

/***/ },

/***/ 249:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	var _util = __webpack_require__(230);
	
	/**
	 *  Validates a regular expression pattern.
	 *
	 *  Performs validation when a rule only contains
	 *  a pattern property but is not declared as a string type.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function pattern(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value, 'string') && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options);
	    if (!(0, _util.isEmptyValue)(value, 'string')) {
	      _rule2['default'].pattern(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = pattern;
	module.exports = exports['default'];

/***/ },

/***/ 250:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	function type(rule, value, callback, source, options) {
	  var errors = [];
	  _rule2['default'].type(rule, value, source, errors, options);
	  callback(errors);
	}
	
	exports['default'] = type;
	module.exports = exports['default'];

/***/ },

/***/ 251:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _rule = __webpack_require__(233);
	
	var _rule2 = _interopRequireDefault(_rule);
	
	var _util = __webpack_require__(230);
	
	function date(rule, value, callback, source, options) {
	  // console.log('integer rule called %j', rule);
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  // console.log('validate on %s value', value);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2['default'].required(rule, value, source, errors, options);
	    if (!(0, _util.isEmptyValue)(value)) {
	      _rule2['default'].type(rule, value, source, errors, options);
	      if (value) {
	        _rule2['default'].range(rule, value.getTime(), source, errors, options);
	      }
	    }
	  }
	  callback(errors);
	}
	
	exports['default'] = date;
	module.exports = exports['default'];

/***/ },

/***/ 252:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var messages = {
	  'default': 'Validation error on field %s',
	  required: '%s is required',
	  'enum': '%s must be one of %s',
	  whitespace: '%s cannot be empty',
	  date: {
	    format: '%s date %s is invalid for format %s',
	    parse: '%s date could not be parsed, %s is invalid ',
	    invalid: '%s date %s is invalid'
	  },
	  types: {
	    string: '%s is not a %s',
	    method: '%s is not a %s (function)',
	    array: '%s is not an %s',
	    object: '%s is not an %s',
	    number: '%s is not a %s',
	    date: '%s is not a %s',
	    boolean: '%s is not a %s',
	    integer: '%s is not an %s',
	    float: '%s is not a %s',
	    regexp: '%s is not a valid %s',
	    email: '%s is not a valid %s',
	    url: '%s is not a valid %s',
	    hex: '%s is not a valid %s'
	  },
	  string: {
	    len: '%s must be exactly %s characters',
	    min: '%s must be at least %s characters',
	    max: '%s cannot be longer than %s characters',
	    range: '%s must be between %s and %s characters'
	  },
	  number: {
	    len: '%s must equal %s',
	    min: '%s cannot be less than %s',
	    max: '%s cannot be greater than %s',
	    range: '%s must be between %s and %s'
	  },
	  array: {
	    len: '%s must be exactly %s in length',
	    min: '%s cannot be less than %s in length',
	    max: '%s cannot be greater than %s in length',
	    range: '%s must be between %s and %s in length'
	  },
	  pattern: {
	    mismatch: '%s value %s does not match pattern %s'
	  },
	  clone: function clone() {
	    var cloned = JSON.parse(JSON.stringify(this));
	    cloned.clone = this.clone;
	    return cloned;
	  }
	};
	exports['default'] = messages;
	module.exports = exports['default'];

/***/ },

/***/ 253:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var regionStyle = {
	  border: '1px solid red',
	  marginTop: 10,
	  padding: 10
	};
	
	exports.regionStyle = regionStyle;
	var errorStyle = {
	  color: 'red',
	  marginTop: 10,
	  padding: 10
	};
	exports.errorStyle = errorStyle;

/***/ }

});
//# sourceMappingURL=validity.js.map