import React from 'react';
import generateSelector, { SelectProps, RefSelectProps } from 'rc-select/lib/generate';
import { getLabeledValue } from 'rc-select/lib/utils/valueUtil';
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import { IconType } from 'rc-tree/lib/interface';
import { FilterFunc, INTERNAL_PROPS_MARK } from 'rc-select/lib/interface/generator';
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
  getRawValueLabeled,
} from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { SelectContext } from './Context';
import useTreeData from './hooks/useTreeData';
import useKeyValueMap from './hooks/useKeyValueMap';
import useKeyValueMapping from './hooks/useKeyValueMapping';
import { CheckedStrategy, formatStrategyValues } from './utils/strategyUtil';
import { fillLegacyProps } from './utils/legacyUtil';
import useSelectValues from './hooks/useSelectValues';

const OMIT_PROPS = [
  'expandedKeys',
  'treeData',
  'treeCheckable',
  'showCheckedStrategy',
  'searchPlaceholder',
  'treeLine',
  'treeNodeFilterProp',
  'filterTreeNode',
  'dropdownPopupAlign',
];

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
    | 'dropdownAlign'
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
  dropdownPopupAlign?: any;

  // Event
  onSearch?: (value: string) => void;
  onChange?: (value: ValueType, labelList: React.ReactNode[], extra: ChangeEventExtra) => void;
  onTreeExpand?: (expandedKeys: Key[]) => void;

  // Legacy
  /** `searchPlaceholder` has been removed since search box has been merged into input box */
  searchPlaceholder?: React.ReactNode;
}

const RefTreeSelect = React.forwardRef<RefSelectProps, TreeSelectProps>((props, ref) => {
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
    dropdownPopupAlign,
    onChange,
    onTreeExpand,
    onDropdownVisibleChange,
    onSelect,
    onDeselect,
  } = props;
  const mergedCheckable = !!(treeCheckable || treeCheckStrictly);
  const mergedMultiple = multiple || mergedCheckable;
  const treeConduction = treeCheckable && !treeCheckStrictly;

  // ========================== Ref ==========================
  const selectRef = React.useRef<RefSelectProps>(null);

  React.useImperativeHandle(ref, () => ({
    focus: selectRef.current.focus,
    blur: selectRef.current.blur,
  }));

  // ======================= Tree Data =======================
  const mergedTreeNodeLabelProp = treeNodeLabelProp || (treeData ? 'label' : 'title');

  const mergedTreeData = useTreeData(treeData, children, {
    labelProp: mergedTreeNodeLabelProp,
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

  const [rawValues, rawHalfCheckedValues]: [RawValueType[], RawValueType[]] = React.useMemo(() => {
    const newRawValues = getRawValues(mergedValue, labelInValue);

    // We need do conduction of values
    if (treeConduction) {
      const { checkedKeys, halfCheckedKeys } = conductCheck(newRawValues, true, conductKeyEntities);
      return [checkedKeys, halfCheckedKeys];
    }
    return [newRawValues, []];
  }, [mergedValue, mergedMultiple, labelInValue, treeCheckable, treeCheckStrictly]);

  const selectValues = useSelectValues(rawValues, {
    treeConduction,
    value: mergedValue,
    showCheckedStrategy,
    conductKeyEntities,
    getEntityByValue,
    treeNodeLabelProp: mergedTreeNodeLabelProp,
  });

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

      const { triggerValue, selected } = extra || { triggerValue: undefined, selected: undefined };

      const returnValues = labelInValue
        ? getRawValueLabeled(eventValues, mergedValue, getEntityByValue, mergedTreeNodeLabelProp)
        : eventValues;

      onChange(
        mergedMultiple ? returnValues : returnValues[0],
        labelInValue
          ? null
          : eventValues.map(val => {
              const entity = getEntityByValue(val);
              return entity ? entity.data[mergedTreeNodeLabelProp] : null;
            }),
        {
          // [Legacy] Always return as array contains label & value
          preValue: selectValues,
          triggerValue,
          selected: !mergedCheckable ? selected : undefined,
          checked: mergedCheckable ? selected : undefined,
          triggerNode: getDataNode(triggerValue),
          allCheckedNodes: eventValues.map(getDataNode),
        },
      );
    }
  };

  const onInternalSelect = (selectValue: LabelValueType, options: DataNode[]) => {
    const eventValue = labelInValue ? selectValue : selectValue.value;

    if (!mergedMultiple) {
      // Single mode always set value
      triggerChange([selectValue.value], { selected: true, triggerValue: selectValue.value });
    } else {
      let newRawValues = addValue(rawValues, getRawValue(selectValue, true));

      // Add keys if tree conduction
      if (treeConduction) {
        newRawValues = conductCheck(newRawValues, true, conductKeyEntities).checkedKeys;
      }

      triggerChange(newRawValues, { selected: true, triggerValue: selectValue.value });

      if (onSelect) {
        onSelect(eventValue, options);
      }
    }
  };

  const onInternalDeselect = (selectValue: LabelValueType, options: DataNode[]) => {
    const eventValue = labelInValue ? selectValue : selectValue.value;

    let newRawValues = removeValue(rawValues, getRawValue(selectValue, true));

    // Remove keys if tree conduction
    if (treeConduction) {
      newRawValues = conductCheck(
        newRawValues,
        { checked: false, halfCheckedKeys: rawHalfCheckedValues },
        conductKeyEntities,
      ).checkedKeys;
    }

    triggerChange(newRawValues, { selected: false, triggerValue: selectValue.value });

    if (onDeselect) {
      onDeselect(eventValue, options);
    }
  };

  const onInternalClear = () => {
    triggerChange([], null);
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
    optionLabelProp: mergedTreeNodeLabelProp,
    dropdownAlign: dropdownPopupAlign,
    internalProps: {
      mark: INTERNAL_PROPS_MARK,
      onClear: onInternalClear,
    },
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
        ref={selectRef}
        mode={mergedMultiple ? 'multiple' : null}
        {...props}
        {...selectProps}
        value={selectValues}
        // We will handle this ourself since we need calculate conduction
        labelInValue
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

  selectRef = React.createRef<RefSelectProps>();

  focus = () => {
    this.selectRef.current.focus();
  };

  blur = () => {
    this.selectRef.current.blur();
  };

  render() {
    return <RefTreeSelect ref={this.selectRef} {...this.props} />;
  }
}

export default TreeSelect;
