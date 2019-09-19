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

const OMIT_PROPS = ['expandedKeys', 'treeData'];

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

  treeExpandedKeys?: Key[];
  treeData?: DataNode[];
  children?: React.ReactNode;

  // TODO:
  treeCheckable?: boolean | React.ReactNode;
  treeCheckStrictly?: boolean;

  // MISS PROPS:
  // prefixAria: PropTypes.string,
  // showArrow: PropTypes.bool,
  //   open: PropTypes.bool,
  //   value: valueProp,
  //   autoFocus: PropTypes.bool,

  //   defaultOpen: PropTypes.bool,
  //   defaultValue: valueProp,

  //   showSearch: PropTypes.bool,
  //   placeholder: PropTypes.node,
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
  //   onChange: PropTypes.func,
  //   onDropdownVisibleChange: PropTypes.func,

  //   onTreeExpand: PropTypes.func,

  //   inputIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  //   clearIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  //   removeIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  //   switcherIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

interface TreeSelectState<ValueType = DefaultValueType> {
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

    return newState;
  }

  state = {
    expandedKeys: [],
    treeData: null,

    prevProps: null,
  };

  render() {
    const { treeData, expandedKeys } = this.state;
    const { multiple, treeCheckable, treeCheckStrictly } = this.props;

    // Used for tree calculation
    const additionalProps = {
      expandedKeys,
    };

    return (
      <SelectContext.Provider
        value={{
          checkable: !!(treeCheckable || treeCheckStrictly),
        }}
      >
        <RefTreeSelect
          mode={multiple || treeCheckable ? 'multiple' : null}
          {...this.props}
          options={treeData}
          {...additionalProps}
        />
      </SelectContext.Provider>
    );
  }
}

export default TreeSelect;
