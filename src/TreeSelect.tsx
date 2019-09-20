import React from 'react';
import generateSelector from 'rc-select/lib/generate';
import { getLabeledValue } from 'rc-select/lib/utils/valueUtil';
import OptionList from './OptionList';
import TreeNode from './TreeNode';
import { Key, DefaultValueType, DataNode, LabelValueType } from './interface';
import { convertChildrenToData } from './utils/legacyUtil';
import {
  flattenOptions,
  filterOptions,
  isValueDisabled,
  findValueOption,
  formatTreeData,
  getRawValues,
} from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { SelectContext } from './Context';
import useTreeData from './hooks/useTreeData';
import useKeyValueMap from './hooks/useKeyValueMap';
import useKeyValueMapping from './hooks/useKeyValueMapping';

const OMIT_PROPS = ['expandedKeys', 'treeData', 'treeCheckable'];

const RefSelect = generateSelector<DataNode[]>({
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
  autoFocus?: boolean;
  multiple?: boolean;
  showArrow?: boolean;
  showSearch?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  value?: ValueType;
  defaultValue?: ValueType;
  disabled?: boolean;

  placeholder?: React.ReactNode;
  /** @deprecated Use `searchValue` instead */
  inputValue?: string;
  searchValue?: string;
  autoClearSearchValue?: boolean;

  maxTagTextLength?: number;
  maxTagCount?: number;
  maxTagPlaceholder?: (omittedValues: LabelValueType[]) => React.ReactNode;

  treeData?: DataNode[];
  children?: React.ReactNode;

  // Event
  onSearch?: (value: string) => void;

  // TODO:
  labelInValue?: boolean;
  treeExpandedKeys?: Key[];
  treeCheckable?: boolean | React.ReactNode;
  treeCheckStrictly?: boolean;
  onChange?: (value: ValueType, labelList: React.ReactNode[], extra: any) => void;

  // MISS PROPS:
  //   searchPlaceholder: PropTypes.node, // [Legacy] Confuse with placeholder
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

const RefTreeSelect = React.forwardRef<any, TreeSelectProps>((props, ref) => {
  const {
    multiple,
    treeCheckable,
    treeCheckStrictly,
    labelInValue,
    treeData,
    children,
    onChange,
  } = props;
  const mergedCheckable = !!(treeCheckable || treeCheckStrictly);
  const mergedMultiple = multiple || mergedCheckable;

  // ======================= Tree Data =======================
  const mergedTreeData = useTreeData(treeData, children);
  const flattedOptions = React.useMemo(() => flattenOptions(mergedTreeData), [mergedTreeData]);
  const [cacheKeyMap, cacheValueMap] = useKeyValueMap(flattedOptions);
  const [getEntityByKey, getEntityByValue] = useKeyValueMapping(cacheKeyMap, cacheValueMap);

  // ========================= Value =========================
  const [value, setValue] = React.useState<DefaultValueType>(props.defaultValue);
  const mergedValue = 'value' in props ? props.value : value;

  const onInternalChange = (newValue: DefaultValueType, options: DataNode | DataNode[]) => {
    setValue(newValue);

    if (onChange) {
      const rawValues = getRawValues(newValue, mergedMultiple, labelInValue);
      onChange(
        newValue,
        labelInValue
          ? null
          : rawValues.map(val => {
              const entity = getEntityByValue(val);
              return entity ? entity.data.title : null;
            }),
        null,
      );
    }
  };

  return (
    <SelectContext.Provider
      value={{
        checkable: mergedCheckable,
      }}
    >
      <RefSelect
        mode={mergedMultiple ? 'multiple' : null}
        {...props}
        value={mergedValue}
        options={mergedTreeData}
        onChange={onInternalChange}
      />
    </SelectContext.Provider>
  );
});

// Use class component since typescript not support generic
// by `forwardRef` with function component yet.
class TreeSelect<ValueType = DefaultValueType> extends React.Component<
  TreeSelectProps<ValueType>,
  TreeSelectState<ValueType>
> {
  static TreeNode = TreeNode;

  render() {
    return <RefTreeSelect {...this.props} />;
  }
}

export default TreeSelect;
