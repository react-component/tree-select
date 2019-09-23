import React from 'react';
import generateSelector, { SelectProps } from 'rc-select/lib/generate';
import { getLabeledValue } from 'rc-select/lib/utils/valueUtil';
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import OptionList from './OptionList';
import TreeNode from './TreeNode';
import {
  Key,
  DefaultValueType,
  DataNode,
  LabelValueType,
  SimpleModeConfig,
  RawValueType,
} from './interface';
import {
  flattenOptions,
  filterOptions,
  isValueDisabled,
  findValueOption,
  getRawValues,
  addValue,
  getRawValue,
  removeValue,
} from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { SelectContext } from './Context';
import useTreeData from './hooks/useTreeData';
import useKeyValueMap from './hooks/useKeyValueMap';
import useKeyValueMapping from './hooks/useKeyValueMapping';
import { CheckedStrategy, formatStrategyValues } from './utils/strategyUtil';

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

  treeNodeFilterProp?: string;
  treeNodeLabelProp?: string;
  treeDataSimpleMode?: boolean | SimpleModeConfig;
  treeData?: DataNode[];
  children?: React.ReactNode;

  // Event
  onSearch?: (value: string) => void;

  // TODO:
  labelInValue?: boolean;
  treeExpandedKeys?: Key[];
  treeCheckable?: boolean | React.ReactNode;
  treeCheckStrictly?: boolean;
  showCheckedStrategy?: CheckedStrategy;
  onChange?: (value: ValueType, labelList: React.ReactNode[], extra: any) => void;

  // MISS PROPS:
  //   searchPlaceholder: PropTypes.node, // [Legacy] Confuse with placeholder
  //   showCheckedStrategy: PropTypes.oneOf([SHOW_ALL, SHOW_PARENT, SHOW_CHILD]),

  //   dropdownMatchSelectWidth: PropTypes.bool,
  //
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
    showCheckedStrategy = 'SHOW_CHILD',
    labelInValue,
    treeNodeFilterProp,
    treeNodeLabelProp,
    treeDataSimpleMode,
    treeData,
    children,
    onChange,
  } = props;
  const mergedCheckable = !!(treeCheckable || treeCheckStrictly);
  const mergedMultiple = multiple || mergedCheckable;
  const treeConduction = treeCheckable && !treeCheckStrictly;

  // ======================= Tree Data =======================
  const mergeTreeNodeLabelProp = treeNodeLabelProp || (treeData ? 'label' : 'title');

  const mergedTreeData = useTreeData(treeData, children, {
    labelProp: mergeTreeNodeLabelProp,
    simpleMode: treeDataSimpleMode,
  });

  const flattedOptions = React.useMemo(() => flattenOptions(mergedTreeData), [mergedTreeData]);
  const [cacheKeyMap, cacheValueMap] = useKeyValueMap(flattedOptions);
  const [getEntityByKey, getEntityByValue] = useKeyValueMapping(cacheKeyMap, cacheValueMap);

  // Only generate keyEntities for check conduction when is `treeCheckable`
  const { keyEntities: conductKeyEntities } = React.useMemo(() => {
    if (treeConduction) {
      return convertDataToEntities(mergedTreeData as any);
    }
    return { keyEntities: null };
  }, [mergedTreeData, treeCheckable, treeCheckStrictly]);

  // ========================= Value =========================
  const [value, setValue] = React.useState<DefaultValueType>(props.defaultValue);
  const mergedValue = 'value' in props ? props.value : value;

  const [rawValues, rawHalfCheckedValues]: [RawValueType[], RawValueType[]] = React.useMemo(() => {
    const newRawValues = getRawValues(mergedValue, mergedMultiple, labelInValue);

    // We need do conduction of values
    if (treeConduction) {
      const { checkedKeys, halfCheckedKeys } = conductCheck(newRawValues, true, conductKeyEntities);
      return [checkedKeys, halfCheckedKeys];
    }
    return [newRawValues, []];
  }, [mergedValue, mergedMultiple, labelInValue, treeCheckable, treeCheckStrictly]);

  const selectValues = React.useMemo(() => {
    const values = mergedMultiple ? rawValues : rawValues[0];

    if (treeConduction) {
      return formatStrategyValues(
        values as RawValueType[],
        showCheckedStrategy,
        conductKeyEntities,
      );
    }

    // Force set a empty string as value if not exist
    return values !== undefined ? values : '';
  }, [rawValues]);

  const triggerChange = (newRawValues: RawValueType[]) => {
    setValue(mergedMultiple ? newRawValues : newRawValues[0]);
    if (onChange) {
      let eventValues = newRawValues;
      if (treeConduction && showCheckedStrategy !== 'SHOW_ALL') {
        eventValues = formatStrategyValues(newRawValues, showCheckedStrategy, conductKeyEntities);
      }

      // TODO: extra
      onChange(
        labelInValue
          ? eventValues.map(val => {
              const entity = getEntityByValue(val);
              return { value: val, label: entity ? entity.data[mergeTreeNodeLabelProp] : val };
            })
          : eventValues,
        labelInValue
          ? null
          : eventValues.map(val => {
              const entity = getEntityByValue(val);
              return entity ? entity.data[mergeTreeNodeLabelProp] : null;
            }),
        null,
      );
    }
  };

  const onInternalSelect = (selectValue: RawValueType) => {
    if (!mergedMultiple) {
      // Single mode always set value
      triggerChange([selectValue]);
    } else {
      let newRawValues = addValue(rawValues, getRawValue(selectValue, labelInValue));

      // Add keys if tree conduction
      if (treeConduction) {
        newRawValues = conductCheck(newRawValues, true, conductKeyEntities).checkedKeys;
      }

      triggerChange(newRawValues);
    }
  };

  const onInternalDeselect = (selectValue: RawValueType) => {
    let newRawValues = removeValue(rawValues, getRawValue(selectValue, labelInValue));

    // Remove keys if tree conduction
    if (treeConduction) {
      newRawValues = conductCheck(
        newRawValues,
        { checked: false, halfCheckedKeys: rawHalfCheckedValues },
        conductKeyEntities,
      ).checkedKeys;
    }

    triggerChange(newRawValues);
  };

  // ======================== Render =========================
  // We pass some props into select props style
  const selectProps: Partial<SelectProps<any, any>> = {
    optionLabelProp: mergeTreeNodeLabelProp,
  };

  if (treeNodeFilterProp) {
    selectProps.optionFilterProp = treeNodeFilterProp;
  }

  return (
    <SelectContext.Provider
      value={{
        checkable: mergedCheckable,
        checkedKeys: rawValues,
        halfCheckedKeys: rawHalfCheckedValues,
      }}
    >
      <RefSelect
        mode={mergedMultiple ? 'multiple' : null}
        {...props}
        {...selectProps}
        value={selectValues}
        // We will handle this ourself since we need calculate conduction
        labelInValue={false}
        options={mergedTreeData}
        onChange={null}
        onSelect={onInternalSelect}
        onDeselect={onInternalDeselect}
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
