import type { BaseSelectPropsWithoutPrivate, BaseSelectRef } from '@rc-component/select';
import { BaseSelect } from '@rc-component/select';
import useId from '@rc-component/util/lib/hooks/useId';
import type { IconType } from '@rc-component/tree/lib/interface';
import type { ExpandAction } from '@rc-component/tree/lib/Tree';
import { conductCheck } from '@rc-component/tree/lib/utils/conductUtil';
import useControlledState from '@rc-component/util/lib/hooks/useControlledState';
import * as React from 'react';
import useCache from './hooks/useCache';
import useCheckedKeys from './hooks/useCheckedKeys';
import useDataEntities from './hooks/useDataEntities';
import useFilterTreeData from './hooks/useFilterTreeData';
import useRefFunc from './hooks/useRefFunc';
import useTreeData from './hooks/useTreeData';
import LegacyContext from './LegacyContext';
import OptionList from './OptionList';
import TreeNode from './TreeNode';
import type { TreeSelectContextProps } from './TreeSelectContext';
import TreeSelectContext from './TreeSelectContext';
import { fillAdditionalInfo, fillLegacyProps } from './utils/legacyUtil';
import type { CheckedStrategy } from './utils/strategyUtil';
import { formatStrategyValues, SHOW_ALL, SHOW_CHILD, SHOW_PARENT } from './utils/strategyUtil';
import { fillFieldNames, isNil, toArray } from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import type {
  LabeledValueType,
  SafeKey,
  Key,
  DataNode,
  SimpleModeConfig,
  ChangeEventExtra,
  SelectSource,
  DefaultValueType,
  FieldNames,
  LegacyDataNode,
} from './interface';
import useSearchConfig from './hooks/useSearchConfig';

export type SemanticName = 'input' | 'prefix' | 'suffix';
export type PopupSemantic = 'item' | 'itemTitle';
export interface SearchConfig {
  searchValue?: string;
  onSearch?: (value: string) => void;
  autoClearSearchValue?: boolean;
  filterTreeNode?: boolean | ((inputValue: string, treeNode: DataNode) => boolean);
  treeNodeFilterProp?: string;
}
export interface TreeSelectProps<ValueType = any, OptionType extends DataNode = DataNode>
  extends Omit<BaseSelectPropsWithoutPrivate, 'mode' | 'classNames' | 'styles' | 'showSearch'> {
  prefixCls?: string;
  id?: string;
  children?: React.ReactNode;
  styles?: Partial<Record<SemanticName, React.CSSProperties>> & {
    popup?: Partial<Record<PopupSemantic, React.CSSProperties>>;
  };
  classNames?: Partial<Record<SemanticName, string>> & {
    popup?: Partial<Record<PopupSemantic, string>>;
  };
  // >>> Value
  value?: ValueType;
  defaultValue?: ValueType;
  onChange?: (value: ValueType, labelList: React.ReactNode[], extra: ChangeEventExtra) => void;

  // >>> Search
  showSearch?: boolean | SearchConfig;
  /** @deprecated Use `showSearch.searchValue` instead */
  searchValue?: string;
  /** @deprecated Use `showSearch.searchValue` instead */
  inputValue?: string;
  /** @deprecated Use `showSearch.onSearch` instead */
  onSearch?: (value: string) => void;
  /** @deprecated Use `showSearch.autoClearSearchValue` instead */
  autoClearSearchValue?: boolean;
  /** @deprecated Use `showSearch.filterTreeNode` instead */
  filterTreeNode?: boolean | ((inputValue: string, treeNode: DataNode) => boolean);
  /** @deprecated Use `showSearch.treeNodeFilterProp` instead */
  treeNodeFilterProp?: string;

  // >>> Select
  onSelect?: (value: ValueType, option: OptionType) => void;
  onDeselect?: (value: ValueType, option: OptionType) => void;

  // >>> Selector
  showCheckedStrategy?: CheckedStrategy;
  treeNodeLabelProp?: string;

  // >>> Field Names
  fieldNames?: FieldNames;

  // >>> Mode
  multiple?: boolean;
  treeCheckable?: boolean | React.ReactNode;
  treeCheckStrictly?: boolean;
  labelInValue?: boolean;
  maxCount?: number;

  // >>> Data
  treeData?: OptionType[];
  treeDataSimpleMode?: boolean | SimpleModeConfig;
  loadData?: (dataNode: LegacyDataNode) => Promise<unknown>;
  treeLoadedKeys?: SafeKey[];
  onTreeLoad?: (loadedKeys: SafeKey[]) => void;

  // >>> Expanded
  treeDefaultExpandAll?: boolean;
  treeExpandedKeys?: SafeKey[];
  treeDefaultExpandedKeys?: SafeKey[];
  onTreeExpand?: (expandedKeys: SafeKey[]) => void;
  treeExpandAction?: ExpandAction;

  // >>> Options
  virtual?: boolean;
  listHeight?: number;
  listItemHeight?: number;
  listItemScrollOffset?: number;
  onPopupVisibleChange?: (open: boolean) => void;
  treeTitleRender?: (node: OptionType) => React.ReactNode;

  // >>> Tree
  treeLine?: boolean;
  treeIcon?: IconType;
  showTreeIcon?: boolean;
  switcherIcon?: IconType;
  treeMotion?: any;
}

function isRawValue(value: SafeKey | LabeledValueType): value is SafeKey {
  return !value || typeof value !== 'object';
}

const TreeSelect = React.forwardRef<BaseSelectRef, TreeSelectProps>((props, ref) => {
  const {
    id,
    prefixCls = 'rc-tree-select',

    // Value
    value,
    defaultValue,
    onChange,
    onSelect,
    onDeselect,

    // Search
    showSearch,
    searchValue: legacySearchValue,
    inputValue: legacyinputValue,
    onSearch: legacyOnSearch,
    autoClearSearchValue: legacyAutoClearSearchValue,
    filterTreeNode: legacyFilterTreeNode,
    treeNodeFilterProp: legacytreeNodeFilterProp,
    // Selector
    showCheckedStrategy,
    treeNodeLabelProp,

    //  Mode
    multiple,
    treeCheckable,
    treeCheckStrictly,
    labelInValue,
    maxCount,

    // FieldNames
    fieldNames,

    // Data
    treeDataSimpleMode,
    treeData,
    children,
    loadData,
    treeLoadedKeys,
    onTreeLoad,

    // Expanded
    treeDefaultExpandAll,
    treeExpandedKeys,
    treeDefaultExpandedKeys,
    onTreeExpand,
    treeExpandAction,

    // Options
    virtual,
    listHeight = 200,
    listItemHeight = 20,
    listItemScrollOffset = 0,

    onPopupVisibleChange,
    popupMatchSelectWidth = true,

    // Tree
    treeLine,
    treeIcon,
    showTreeIcon,
    switcherIcon,
    treeMotion,
    treeTitleRender,

    onPopupScroll,

    classNames: treeSelectClassNames,
    styles,
    ...restProps
  } = props;

  const mergedId = useId(id);
  const treeConduction = treeCheckable && !treeCheckStrictly;
  const mergedCheckable = treeCheckable || treeCheckStrictly;
  const mergedLabelInValue = treeCheckStrictly || labelInValue;
  const mergedMultiple = mergedCheckable || multiple;

  const searchProps = {
    searchValue: legacySearchValue,
    inputValue: legacyinputValue,
    onSearch: legacyOnSearch,
    autoClearSearchValue: legacyAutoClearSearchValue,
    filterTreeNode: legacyFilterTreeNode,
    treeNodeFilterProp: legacytreeNodeFilterProp,
  };
  const [mergedShowSearch, searchConfig] = useSearchConfig(showSearch, searchProps);
  const {
    searchValue,
    onSearch,
    autoClearSearchValue = true,
    filterTreeNode,
    treeNodeFilterProp = 'value',
  } = searchConfig;

  const [internalValue, setInternalValue] = useControlledState(defaultValue, value);

  // `multiple` && `!treeCheckable` should be show all
  const mergedShowCheckedStrategy = React.useMemo(() => {
    if (!treeCheckable) {
      return SHOW_ALL;
    }

    return showCheckedStrategy || SHOW_CHILD;
  }, [showCheckedStrategy, treeCheckable]);

  // ========================== Warning ===========================
  if (process.env.NODE_ENV !== 'production') {
    warningProps(props);
  }

  // ========================= FieldNames =========================
  const mergedFieldNames: FieldNames = React.useMemo(
    () => fillFieldNames(fieldNames),
    /* eslint-disable react-hooks/exhaustive-deps */
    [JSON.stringify(fieldNames)],
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  // =========================== Search ===========================
  const [internalSearchValue, setSearchValue] = useControlledState('', searchValue);
  const mergedSearchValue = internalSearchValue || '';

  const onInternalSearch = searchText => {
    setSearchValue(searchText);
    onSearch?.(searchText);
  };

  // ============================ Data ============================
  // `useTreeData` only do convert of `children` or `simpleMode`.
  // Else will return origin `treeData` for perf consideration.
  // Do not do anything to loop the data.
  const mergedTreeData = useTreeData(treeData, children, treeDataSimpleMode);

  const { keyEntities, valueEntities } = useDataEntities(mergedTreeData, mergedFieldNames);

  /** Get `missingRawValues` which not exist in the tree yet */
  const splitRawValues = React.useCallback(
    (newRawValues: SafeKey[]) => {
      const missingRawValues = [];
      const existRawValues = [];

      // Keep missing value in the cache
      newRawValues.forEach(val => {
        if (valueEntities.has(val)) {
          existRawValues.push(val);
        } else {
          missingRawValues.push(val);
        }
      });

      return { missingRawValues, existRawValues };
    },
    [valueEntities],
  );

  // Filtered Tree
  const filteredTreeData = useFilterTreeData(mergedTreeData, mergedSearchValue, {
    fieldNames: mergedFieldNames,
    treeNodeFilterProp,
    filterTreeNode,
  });

  // =========================== Label ============================
  const getLabel = React.useCallback(
    (item: DataNode) => {
      if (item) {
        if (treeNodeLabelProp) {
          return item[treeNodeLabelProp];
        }

        // Loop from fieldNames
        const { _title: titleList } = mergedFieldNames;

        for (let i = 0; i < titleList.length; i += 1) {
          const title = item[titleList[i]];
          if (title !== undefined) {
            return title;
          }
        }
      }
    },
    [mergedFieldNames, treeNodeLabelProp],
  );

  // ========================= Wrap Value =========================
  const toLabeledValues = React.useCallback((draftValues: DefaultValueType) => {
    const values = toArray(draftValues);

    return values.map(val => {
      if (isRawValue(val)) {
        return { value: val };
      }
      return val;
    });
  }, []);

  const convert2LabelValues = React.useCallback(
    (draftValues: DefaultValueType) => {
      const values = toLabeledValues(draftValues);

      return values.map(item => {
        let { label: rawLabel } = item;
        const { value: rawValue, halfChecked: rawHalfChecked } = item;

        let rawDisabled: boolean | undefined;

        const entity = valueEntities.get(rawValue);

        // Fill missing label & status
        if (entity) {
          rawLabel = treeTitleRender
            ? treeTitleRender(entity.node)
            : (rawLabel ?? getLabel(entity.node));
          rawDisabled = entity.node.disabled;
        } else if (rawLabel === undefined) {
          // We try to find in current `labelInValue` value
          const labelInValueItem = toLabeledValues(internalValue).find(
            labeledItem => labeledItem.value === rawValue,
          );
          rawLabel = labelInValueItem.label;
        }
        return {
          label: rawLabel,
          value: rawValue,
          halfChecked: rawHalfChecked,
          disabled: rawDisabled,
        };
      });
    },
    [valueEntities, getLabel, toLabeledValues, internalValue],
  );

  // =========================== Values ===========================
  const rawMixedLabeledValues = React.useMemo(
    () => toLabeledValues(internalValue === null ? [] : internalValue),
    [toLabeledValues, internalValue],
  );

  // Split value into full check and half check
  const [rawLabeledValues, rawHalfLabeledValues] = React.useMemo(() => {
    const fullCheckValues: LabeledValueType[] = [];
    const halfCheckValues: LabeledValueType[] = [];

    rawMixedLabeledValues.forEach(item => {
      if (item.halfChecked) {
        halfCheckValues.push(item);
      } else {
        fullCheckValues.push(item);
      }
    });

    return [fullCheckValues, halfCheckValues];
  }, [rawMixedLabeledValues]);

  // const [mergedValues] = useCache(rawLabeledValues);
  const rawValues = React.useMemo(
    () => rawLabeledValues.map(item => item.value),
    [rawLabeledValues],
  );

  // Convert value to key. Will fill missed keys for conduct check.
  const [rawCheckedValues, rawHalfCheckedValues] = useCheckedKeys(
    rawLabeledValues,
    rawHalfLabeledValues,
    treeConduction,
    keyEntities,
  );

  // Convert rawCheckedKeys to check strategy related values
  const displayValues = React.useMemo(() => {
    // Collect keys which need to show
    const displayKeys = formatStrategyValues(
      rawCheckedValues as SafeKey[],
      mergedShowCheckedStrategy,
      keyEntities,
      mergedFieldNames,
    );

    // Convert to value and filled with label
    const values = displayKeys.map(key => keyEntities[key]?.node?.[mergedFieldNames.value] ?? key);

    // Back fill with origin label
    const labeledValues = values.map(val => {
      const targetItem = rawLabeledValues.find(item => item.value === val);
      const label = labelInValue ? targetItem?.label : treeTitleRender?.(targetItem);
      return {
        value: val,
        label,
      };
    });

    const rawDisplayValues = convert2LabelValues(labeledValues);

    const firstVal = rawDisplayValues[0];

    if (!mergedMultiple && firstVal && isNil(firstVal.value) && isNil(firstVal.label)) {
      return [];
    }

    return rawDisplayValues.map(item => ({
      ...item,
      label: item.label ?? item.value,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mergedFieldNames,
    mergedMultiple,
    rawCheckedValues,
    rawLabeledValues,
    convert2LabelValues,
    mergedShowCheckedStrategy,
    keyEntities,
  ]);

  const [cachedDisplayValues] = useCache(displayValues);

  // ========================== MaxCount ==========================
  const mergedMaxCount = React.useMemo(() => {
    if (
      mergedMultiple &&
      (mergedShowCheckedStrategy === 'SHOW_CHILD' || treeCheckStrictly || !treeCheckable)
    ) {
      return maxCount;
    }
    return null;
  }, [maxCount, mergedMultiple, treeCheckStrictly, mergedShowCheckedStrategy, treeCheckable]);

  // =========================== Change ===========================
  const triggerChange = useRefFunc(
    (
      newRawValues: SafeKey[],
      extra: { triggerValue?: SafeKey; selected?: boolean },
      source: SelectSource,
    ) => {
      const formattedKeyList = formatStrategyValues(
        newRawValues,
        mergedShowCheckedStrategy,
        keyEntities,
        mergedFieldNames,
      );

      // Not allow pass with `maxCount`
      if (mergedMaxCount && formattedKeyList.length > mergedMaxCount) {
        return;
      }

      const labeledValues = convert2LabelValues(newRawValues);
      setInternalValue(labeledValues);

      // Clean up if needed
      if (autoClearSearchValue) {
        setSearchValue('');
      }

      // Generate rest parameters is costly, so only do it when necessary
      if (onChange) {
        let eventValues: SafeKey[] = newRawValues;
        if (treeConduction) {
          eventValues = formattedKeyList.map(key => {
            const entity = valueEntities.get(key);
            return entity ? entity.node[mergedFieldNames.value] : key;
          });
        }

        const { triggerValue, selected } = extra || {
          triggerValue: undefined,
          selected: undefined,
        };

        let returnRawValues: (LabeledValueType | SafeKey)[] = eventValues;

        // We need fill half check back
        if (treeCheckStrictly) {
          const halfValues = rawHalfLabeledValues.filter(item => !eventValues.includes(item.value));

          returnRawValues = [...returnRawValues, ...halfValues];
        }

        const returnLabeledValues = convert2LabelValues(returnRawValues);
        const additionalInfo = {
          // [Legacy] Always return as array contains label & value
          preValue: rawLabeledValues,
          triggerValue,
        } as ChangeEventExtra;

        // [Legacy] Fill legacy data if user query.
        // This is expansive that we only fill when user query
        // https://github.com/react-component/tree-select/blob/fe33eb7c27830c9ac70cd1fdb1ebbe7bc679c16a/src/Select.jsx
        let showPosition = true;
        if (treeCheckStrictly || (source === 'selection' && !selected)) {
          showPosition = false;
        }

        fillAdditionalInfo(
          additionalInfo,
          triggerValue,
          newRawValues,
          mergedTreeData,
          showPosition,
          mergedFieldNames,
        );

        if (mergedCheckable) {
          additionalInfo.checked = selected;
        } else {
          additionalInfo.selected = selected;
        }

        const returnValues = mergedLabelInValue
          ? returnLabeledValues
          : returnLabeledValues.map(item => item.value);

        onChange(
          mergedMultiple ? returnValues : returnValues[0],
          mergedLabelInValue ? null : returnLabeledValues.map(item => item.label),
          additionalInfo,
        );
      }
    },
  );

  // ========================== Options ===========================
  /** Trigger by option list */
  const onOptionSelect = React.useCallback(
    (selectedKey: SafeKey, { selected, source }: { selected: boolean; source: SelectSource }) => {
      const entity = keyEntities[selectedKey];
      const node = entity?.node;
      const selectedValue = node?.[mergedFieldNames.value] ?? selectedKey;

      // Never be falsy but keep it safe
      if (!mergedMultiple) {
        // Single mode always set value
        triggerChange([selectedValue], { selected: true, triggerValue: selectedValue }, 'option');
      } else {
        let newRawValues = selected
          ? [...rawValues, selectedValue]
          : rawCheckedValues.filter(v => v !== selectedValue);

        // Add keys if tree conduction
        if (treeConduction) {
          // Should keep missing values
          const { missingRawValues, existRawValues } = splitRawValues(newRawValues);
          const keyList = existRawValues.map(val => valueEntities.get(val).key);

          // Conduction by selected or not
          let checkedKeys: Key[];
          if (selected) {
            ({ checkedKeys } = conductCheck(keyList, true, keyEntities));
          } else {
            ({ checkedKeys } = conductCheck(
              keyList,
              { checked: false, halfCheckedKeys: rawHalfCheckedValues },
              keyEntities,
            ));
          }

          // Fill back of keys
          newRawValues = [
            ...missingRawValues,
            ...checkedKeys.map(key => keyEntities[key as SafeKey].node[mergedFieldNames.value]),
          ];
        }
        triggerChange(newRawValues, { selected, triggerValue: selectedValue }, source || 'option');
      }

      // Trigger select event
      if (selected || !mergedMultiple) {
        onSelect?.(selectedValue, fillLegacyProps(node));
      } else {
        onDeselect?.(selectedValue, fillLegacyProps(node));
      }
    },
    [
      splitRawValues,
      valueEntities,
      keyEntities,
      mergedFieldNames,
      mergedMultiple,
      rawValues,
      triggerChange,
      treeConduction,
      onSelect,
      onDeselect,
      rawCheckedValues,
      rawHalfCheckedValues,
      maxCount,
    ],
  );

  // ========================== Dropdown ==========================
  const onInternalPopupVisibleChange = React.useCallback(
    (open: boolean) => {
      if (onPopupVisibleChange) {
        onPopupVisibleChange(open);
      }
    },
    [onPopupVisibleChange],
  );

  // ====================== Display Change ========================
  const onDisplayValuesChange = useRefFunc((newValues, info) => {
    const newRawValues = newValues.map(item => item.value);

    if (info.type === 'clear') {
      triggerChange(newRawValues, {}, 'selection');
      return;
    }

    // TreeSelect only have multiple mode which means display change only has remove
    if (info.values.length) {
      onOptionSelect(info.values[0].value, { selected: false, source: 'selection' });
    }
  });

  // ========================== Context ===========================
  const treeSelectContext = React.useMemo<TreeSelectContextProps>(() => {
    return {
      virtual,
      popupMatchSelectWidth,
      listHeight,
      listItemHeight,
      listItemScrollOffset,
      treeData: filteredTreeData,
      fieldNames: mergedFieldNames,
      onSelect: onOptionSelect,
      treeExpandAction,
      treeTitleRender,
      onPopupScroll,
      leftMaxCount: maxCount === undefined ? null : maxCount - cachedDisplayValues.length,
      leafCountOnly:
        mergedShowCheckedStrategy === 'SHOW_CHILD' && !treeCheckStrictly && !!treeCheckable,
      valueEntities,
      classNames: treeSelectClassNames,
      styles,
    };
  }, [
    virtual,
    popupMatchSelectWidth,
    listHeight,
    listItemHeight,
    listItemScrollOffset,
    filteredTreeData,
    mergedFieldNames,
    onOptionSelect,
    treeExpandAction,
    treeTitleRender,
    onPopupScroll,
    maxCount,
    cachedDisplayValues.length,
    mergedShowCheckedStrategy,
    treeCheckStrictly,
    treeCheckable,
    valueEntities,
    treeSelectClassNames,
    styles,
  ]);

  // ======================= Legacy Context =======================
  const legacyContext = React.useMemo(
    () => ({
      checkable: mergedCheckable,
      loadData,
      treeLoadedKeys,
      onTreeLoad,
      checkedKeys: rawCheckedValues,
      halfCheckedKeys: rawHalfCheckedValues,
      treeDefaultExpandAll,
      treeExpandedKeys,
      treeDefaultExpandedKeys,
      onTreeExpand,
      treeIcon,
      treeMotion,
      showTreeIcon,
      switcherIcon,
      treeLine,
      treeNodeFilterProp,
      keyEntities,
    }),
    [
      mergedCheckable,
      loadData,
      treeLoadedKeys,
      onTreeLoad,
      rawCheckedValues,
      rawHalfCheckedValues,
      treeDefaultExpandAll,
      treeExpandedKeys,
      treeDefaultExpandedKeys,
      onTreeExpand,
      treeIcon,
      treeMotion,
      showTreeIcon,
      switcherIcon,
      treeLine,
      treeNodeFilterProp,
      keyEntities,
    ],
  );

  // =========================== Render ===========================
  return (
    <TreeSelectContext.Provider value={treeSelectContext}>
      <LegacyContext.Provider value={legacyContext}>
        <BaseSelect
          ref={ref}
          {...restProps}
          classNames={{
            prefix: treeSelectClassNames?.prefix,
            suffix: treeSelectClassNames?.suffix,
            input: treeSelectClassNames?.input,
          }}
          styles={{
            prefix: styles?.prefix,
            suffix: styles?.suffix,
            input: styles?.input,
          }}
          // >>> MISC
          id={mergedId}
          prefixCls={prefixCls}
          mode={mergedMultiple ? 'multiple' : undefined}
          // >>> Display Value
          displayValues={cachedDisplayValues}
          onDisplayValuesChange={onDisplayValuesChange}
          // >>> Search
          autoClearSearchValue={autoClearSearchValue}
          showSearch={mergedShowSearch}
          searchValue={mergedSearchValue}
          onSearch={onInternalSearch}
          // >>> Options
          OptionList={OptionList}
          emptyOptions={!mergedTreeData.length}
          onPopupVisibleChange={onInternalPopupVisibleChange}
          popupMatchSelectWidth={popupMatchSelectWidth}
        />
      </LegacyContext.Provider>
    </TreeSelectContext.Provider>
  );
});

// Assign name for Debug
if (process.env.NODE_ENV !== 'production') {
  TreeSelect.displayName = 'TreeSelect';
}

const GenericTreeSelect = TreeSelect as unknown as (<
  ValueType = any,
  OptionType extends DataNode = DataNode,
>(
  props: React.PropsWithChildren<TreeSelectProps<ValueType, OptionType>> & {
    ref?: React.Ref<BaseSelectRef>;
  },
) => React.ReactElement) & {
  TreeNode: typeof TreeNode;
  SHOW_ALL: typeof SHOW_ALL;
  SHOW_PARENT: typeof SHOW_PARENT;
  SHOW_CHILD: typeof SHOW_CHILD;
};

GenericTreeSelect.TreeNode = TreeNode;
GenericTreeSelect.SHOW_ALL = SHOW_ALL;
GenericTreeSelect.SHOW_PARENT = SHOW_PARENT;
GenericTreeSelect.SHOW_CHILD = SHOW_CHILD;

export default GenericTreeSelect;
