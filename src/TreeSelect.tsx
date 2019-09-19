import React from 'react';
import generateSelector from 'rc-select/lib/generate';
import { getLabeledValue } from 'rc-select/lib/utils/valueUtil';
import OptionList from './OptionList';
import TreeNode from './TreeNode';
import { Key, DefaultValueType, DataNode } from './interface';
import { convertChildrenToData } from './utils/legacyUtil';
import {
  flattenOptions,
  filterOptions,
  isValueDisabled,
  findValueOption,
  formatTreeData,
} from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { SelectContext } from './Context';

const OMIT_PROPS = ['expandedKeys', 'treeData', 'treeCheckable'];

const RefTreeSelect = generateSelector<DataNode[]>({
  prefixCls: 'rc-tree-select',
  components: {
    optionList: OptionList,
  },
  // Not use generate since we will handle ourself
  convertChildrenToData: () => null,
  flattenOptions,
  // Handle `optionLabelProp` in TreeSelect component
  getLabeledValue: getLabeledValue as any,
  filterOptions,
  isValueDisabled,
  findValueOption,
  warningProps,
  // TreeSelect will not fill missing options
  fillOptionsWithMissingValue: options => options,
  omitDOMProps: (props: object) => {
    const cloneProps = { ...props };
    OMIT_PROPS.forEach(prop => {
      delete cloneProps[prop];
    });
    return cloneProps;
  },
});

export interface TreeSelectProps<ValueType = DefaultValueType> {
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;
  multiple?: boolean;
  showArrow?: boolean;
  open?: boolean;
  value?: ValueType;
  defaultValue?: ValueType;
  placeholder?: React.ReactNode;

  treeExpandedKeys?: Key[];
  treeData?: DataNode[];
  children?: React.ReactNode;

  // Event

  // TODO:
  treeCheckable?: boolean | React.ReactNode;
  treeCheckStrictly?: boolean;
  onChange?: (value: ValueType, labelList: React.ReactNode[], extra: any) => void;

  // MISS PROPS:
  //   value: valueProp,
  //   autoFocus: PropTypes.bool,

  //   defaultOpen: PropTypes.bool,

  //   showSearch: PropTypes.bool,
  //   inputValue: PropTypes.string, // [Legacy] Deprecated. Use `searchValue` instead.
  //   searchValue: PropTypes.string,
  //   autoClearSearchValue: PropTypes.bool,
  //   searchPlaceholder: PropTypes.node, // [Legacy] Confuse with placeholder
  //   disabled: PropTypes.bool,
  //   children: PropTypes.node,
  //   labelInValue: PropTypes.bool,
  //   maxTagCount: PropTypes.number,
  //   maxTagPlaceholder: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  //   maxTagTextLength: PropTypes.number,
  //   showCheckedStrategy: PropTypes.oneOf([SHOW_ALL, SHOW_PARENT, SHOW_CHILD]),

  //   dropdownMatchSelectWidth: PropTypes.bool,
  //   treeDataSimpleMode: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  //   treeNodeFilterProp: PropTypes.string,
  //   treeNodeLabelProp: PropTypes.string,
  //   treeIcon: PropTypes.bool,
  //   treeLine: PropTypes.bool,
  //   treeDefaultExpandAll: PropTypes.bool,
  //   treeDefaultExpandedKeys: PropTypes.array,
  //   treeExpandedKeys: PropTypes.array,
  //   loadData: PropTypes.func,
  //   filterTreeNode: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

  //   notFoundContent: PropTypes.node,

  //   onSearch: PropTypes.func,
  //   onSelect: PropTypes.func,
  //   onDeselect: PropTypes.func,
  //   onDropdownVisibleChange: PropTypes.func,

  //   onTreeExpand: PropTypes.func,

  //   inputIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  //   clearIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  //   removeIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  //   switcherIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

interface TreeSelectState<ValueType = DefaultValueType> {
  value: ValueType;
  expandedKeys: Key[];
  treeData: DataNode[];

  prevProps: TreeSelectProps<ValueType>;
}

// Use class component since typescript not support generic
// by `forwardRef` with function component yet.
class TreeSelect<ValueType = DefaultValueType> extends React.Component<
  TreeSelectProps<ValueType>,
  TreeSelectState<ValueType>
> {
  static TreeNode = TreeNode;

  static getDerivedStateFromProps(
    props: TreeSelectProps,
    { prevProps, ...prevState }: TreeSelectState,
  ) {
    const newState: Partial<TreeSelectState> = {
      prevProps: props,
    };

    function needSync(propName: string, callback: (prop: any) => void) {
      if (!prevProps || prevProps[propName] !== props[propName]) {
        callback(props[propName]);
        return true;
      }
      return false;
    }

    if ('treeExpandedKeys' in props) {
      newState.expandedKeys = props.treeExpandedKeys;
    }

    // ======================= Tree Data =======================
    // We convert `children` to `treeData` here since we need inject `value` as `key`
    let treeData = null;

    if (props.treeData) {
      needSync('treeData', (oriTreeData: DataNode[]) => {
        treeData = oriTreeData;
      });
    } else if (props.children) {
      needSync('children', (children: React.ReactNode) => {
        treeData = convertChildrenToData(children);
      });
    }

    if (treeData) {
      newState.treeData = formatTreeData(treeData);
    }

    // ========================= Value =========================

    return newState;
  }

  constructor(props: TreeSelectProps<ValueType>) {
    super(props);

    this.state = {
      value: 'value' in props ? props.value : props.defaultValue,
      expandedKeys: [],
      treeData: null,

      prevProps: null,
    };
  }

  onChange = (value: ValueType, options: DataNode | DataNode[]) => {
    console.log('~~~>', value, options);
    this.setState({ value });
  };

  render() {
    const { treeData, value } = this.state;
    const { multiple, treeCheckable, treeCheckStrictly } = this.props;

    return (
      <SelectContext.Provider
        value={{
          checkable: !!(treeCheckable || treeCheckStrictly),
        }}
      >
        <RefTreeSelect
          mode={multiple || treeCheckable ? 'multiple' : null}
          {...this.props}
          value={value}
          options={treeData}
          onChange={this.onChange}
        />
      </SelectContext.Provider>
    );
  }
}

export default TreeSelect;
