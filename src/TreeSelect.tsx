import React from 'react';
import generateSelector, { SelectProps } from 'rc-select/lib/generate';
import { getLabeledValue } from 'rc-select/lib/utils/valueUtil';
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import { IconType } from 'rc-tree/lib/interface';
import { FilterFunc } from 'rc-select/lib/interface/generator';
import warning from 'rc-util/lib/warning';
import OptionList from './OptionList';
import TreeNode from './TreeNode';
import {
  Key,
  DefaultValueType,
  DataNode,
  LabelValueType,
  SimpleModeConfig,
  RawValueType,
  ChangeEventExtra,
  LegacyDataNode,
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
  toArray,
} from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { SelectContext } from './Context';
import useTreeData from './hooks/useTreeData';
import useKeyValueMap from './hooks/useKeyValueMap';
import useKeyValueMapping from './hooks/useKeyValueMapping';
import { CheckedStrategy, formatStrategyValues } from './utils/strategyUtil';
import { fillLegacyProps } from './utils/legacyUtil';

const OMIT_PROPS = ['expandedKeys', 'treeData', 'treeCheckable', 'showCheckedStrategy'];

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

export interface TreeSelectProps<ValueType = DefaultValueType>
  extends Omit<
    SelectProps<DataNode[], ValueType>,
    | 'onChange'
    | 'mode'
    | 'menuItemSelectedIcon'
    | 'dropdownRender'
    | 'backfill'
    | 'getInputElement'
    | 'optionLabelProp'
    | 'tokenSeparators'
    | 'filterOption'
  > {
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

  loadData?: (dataNode: LegacyDataNode) => Promise<void>;
  treeNodeFilterProp?: string;
  treeNodeLabelProp?: string;
  treeDataSimpleMode?: boolean | SimpleModeConfig;
  treeExpandedKeys?: Key[];
  treeDefaultExpandedKeys?: Key[];
  treeCheckable?: boolean | React.ReactNode;
  treeCheckStrictly?: boolean;
  showCheckedStrategy?: CheckedStrategy;
  treeDefaultExpandAll?: boolean;
  treeData?: DataNode[];
  treeLine?: boolean;
  treeIcon?: IconType;
  switcherIcon?: IconType;
  children?: React.ReactNode;

  filterTreeNode?: boolean | FilterFunc<LegacyDataNode>;

  // Event
  onSearch?: (value: string) => void;
  onChange?: (value: ValueType, labelList: React.ReactNode[], extra: ChangeEventExtra) => void;
  onTreeExpand?: (expandedKeys: Key[]) => void;

  // Legacy
  /** `searchPlaceholder` has been removed since search box has been merged into input box */
  searchPlaceholder?: React.ReactNode;
}

const RefTreeSelect = React.forwardRef<any, TreeSelectProps>((props, ref) => {
  const {
    multiple,
    treeCheckable,
    treeCheckStrictly,
    showCheckedStrategy = 'SHOW_CHILD',
    labelInValue,
    loadData,
    treeNodeFilterProp,
    treeNodeLabelProp,
    treeDataSimpleMode,
    treeData,
    treeExpandedKeys,
    treeDefaultExpandedKeys,
    treeDefaultExpandAll,
    children,
    treeIcon,
    switcherIcon,
    treeLine,
    filterTreeNode,
    onChange,
    onTreeExpand,
    onDropdownVisibleChange,
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

  /** Return wrapped with legacy info data node for out event param */
  const getDataNode = (value: RawValueType) => {
    const entity = getEntityByValue(value);
    return entity ? fillLegacyProps(entity.data) : null;
  };

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

  const convertToLabelValues = (rawValues: RawValueType[]) =>
    rawValues.map(val => {
      const entity = getEntityByValue(val);
      return { value: val, label: entity ? entity.data[mergeTreeNodeLabelProp] : val };
    });

  const [rawValues, rawHalfCheckedValues]: [RawValueType[], RawValueType[]] = React.useMemo(() => {
    const newRawValues = getRawValues(mergedValue, labelInValue);

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

  const triggerChange = (
    newRawValues: RawValueType[],
    extra: { triggerValue: RawValueType; selected: boolean },
  ) => {
    setValue(mergedMultiple ? newRawValues : newRawValues[0]);
    if (onChange) {
      let eventValues: RawValueType[] = newRawValues;
      if (treeConduction && showCheckedStrategy !== 'SHOW_ALL') {
        eventValues = formatStrategyValues(newRawValues, showCheckedStrategy, conductKeyEntities);
      }

      const { triggerValue, selected } = extra;

      const returnValues = labelInValue ? convertToLabelValues(eventValues) : eventValues;
      onChange(
        returnValues,
        labelInValue
          ? null
          : eventValues.map(val => {
              const entity = getEntityByValue(val);
              return entity ? entity.data[mergeTreeNodeLabelProp] : null;
            }),
        {
          // [Legacy] Always return as array contains label & value
          preValue: convertToLabelValues(toArray(selectValues)),
          triggerValue,
          selected: !mergedCheckable ? selected : undefined,
          checked: mergedCheckable ? selected : undefined,
          triggerNode: getDataNode(triggerValue),
          allCheckedNodes: eventValues.map(getDataNode),
        },
      );
    }
  };

  const onInternalSelect = (selectValue: RawValueType) => {
    if (!mergedMultiple) {
      // Single mode always set value
      triggerChange([selectValue], { selected: true, triggerValue: selectValue });
    } else {
      let newRawValues = addValue(rawValues, getRawValue(selectValue, labelInValue));

      // Add keys if tree conduction
      if (treeConduction) {
        newRawValues = conductCheck(newRawValues, true, conductKeyEntities).checkedKeys;
      }

      triggerChange(newRawValues, { selected: true, triggerValue: selectValue });
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

    triggerChange(newRawValues, { selected: false, triggerValue: selectValue });
  };

  // ========================= Open ==========================
  const onInternalDropdownVisibleChange = React.useCallback(
    (open: boolean) => {
      if (onDropdownVisibleChange) {
        const legacyParam = {};

        Object.defineProperty(legacyParam, 'documentClickClose', {
          get() {
            warning(false, 'Second param of `onDropdownVisibleChange` has been removed.');
            return false;
          },
        });

        (onDropdownVisibleChange as any)(open, legacyParam);
      }
    },
    [onDropdownVisibleChange],
  );

  // ======================== Render =========================
  // We pass some props into select props style
  const selectProps: Partial<SelectProps<any, any>> = {
    optionLabelProp: mergeTreeNodeLabelProp,
  };

  if (treeNodeFilterProp) {
    selectProps.optionFilterProp = treeNodeFilterProp;
  }
  if ('filterTreeNode' in props) {
    selectProps.filterOption = filterTreeNode;
  }

  return (
    <SelectContext.Provider
      value={{
        checkable: mergedCheckable,
        loadData,
        checkedKeys: rawValues,
        halfCheckedKeys: rawHalfCheckedValues,
        treeDefaultExpandAll,
        treeExpandedKeys,
        treeDefaultExpandedKeys,
        onTreeExpand,
        treeIcon,
        switcherIcon,
        treeLine,
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
        onDropdownVisibleChange={onInternalDropdownVisibleChange}
      />
    </SelectContext.Provider>
  );
});

// Use class component since typescript not support generic
// by `forwardRef` with function component yet.
class TreeSelect<ValueType = DefaultValueType> extends React.Component<
  TreeSelectProps<ValueType>,
  {}
> {
  static TreeNode = TreeNode;

  render() {
    return <RefTreeSelect {...this.props} />;
  }
}

export default TreeSelect;
