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

const OMIT_PROPS = ['expandedKeys'];

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
  treeExpandedKeys?: Key[];
  treeData?: DataNode[];
  children?: React.ReactNode;
}

interface TreeSelectState<ValueType = DefaultValueType> {
  expandedKeys: Key[];
  treeData: DataNode[];

  prevProps: TreeSelectProps<ValueType>;
}

// Use class component since typescript not support generic by `forwardRef` with function component yet.
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

    // Used for tree calculation
    const additionalProps = {
      expandedKeys,
    };

    return <RefTreeSelect {...this.props} options={treeData} {...additionalProps} />;
  }
}

export default TreeSelect;
