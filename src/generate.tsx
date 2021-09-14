import * as React from 'react';
import { useMemo } from 'react';
import type { SelectProps, RefSelectProps, GenerateConfig } from 'rc-select/lib/generate';
import generateSelector from 'rc-select/lib/generate';
import { getLabeledValue } from 'rc-select/lib/utils/valueUtil';
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import type { IconType } from 'rc-tree/lib/interface';
import omit from 'rc-util/lib/omit';
import type { FilterFunc } from 'rc-select/lib/interface/generator';
import { INTERNAL_PROPS_MARK } from 'rc-select/lib/interface/generator';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import warning from 'rc-util/lib/warning';
import TreeNode from './TreeNode';
import type {
  Key,
  DefaultValueType,
  DataNode,
  LabelValueType,
  SimpleModeConfig,
  RawValueType,
  ChangeEventExtra,
  LegacyDataNode,
  SelectSource,
  FlattenDataNode,
  FieldNames,
} from './interface';
import {
  flattenOptions,
  filterOptions,
  isValueDisabled,
  findValueOption,
  addValue,
  removeValue,
  getRawValueLabeled,
  toArray,
  fillFieldNames,
} from './utils/valueUtil';
import warningProps from './utils/warningPropsUtil';
import { SelectContext } from './Context';
import useTreeData from './hooks/useTreeData';
import useKeyValueMap from './hooks/useKeyValueMap';
import useKeyValueMapping from './hooks/useKeyValueMapping';
import type { CheckedStrategy } from './utils/strategyUtil';
import { formatStrategyKeys, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './utils/strategyUtil';
import { fillAdditionalInfo } from './utils/legacyUtil';
import useSelectValues from './hooks/useSelectValues';

const OMIT_PROPS: (keyof TreeSelectProps)[] = [
  'expandedKeys' as any,
  'treeData',
  'treeCheckable',
  'showCheckedStrategy',
  'searchPlaceholder',
  'treeLine',
  'treeIcon',
  'showTreeIcon',
  'switcherIcon',
  'treeNodeFilterProp',
  'filterTreeNode',
  'dropdownPopupAlign',
  'treeDefaultExpandAll',
  'treeCheckStrictly',
  'treeExpandedKeys',
  'treeLoadedKeys',
  'treeMotion',
  'onTreeExpand',
  'onTreeLoad',
  'labelRender',
  'loadData',
  'treeDataSimpleMode',
  'treeNodeLabelProp',
  'treeDefaultExpandedKeys',
];

export interface TreeSelectProps<ValueType = DefaultValueType>
  extends Omit<
    SelectProps<DataNode[], ValueType>,
    | 'onChange'
    | 'mode'
    | 'menuItemSelectedIcon'
    | 'dropdownAlign'
    | 'backfill'
    | 'getInputElement'
    | 'optionLabelProp'
    | 'tokenSeparators'
    | 'filterOption'
    | 'fieldNames'
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

  maxTagPlaceholder?: (omittedValues: LabelValueType[]) => React.ReactNode;

  fieldNames?: FieldNames;
  loadData?: (dataNode: LegacyDataNode) => Promise<unknown>;
  treeNodeFilterProp?: string;
  treeNodeLabelProp?: string;
  treeDataSimpleMode?: boolean | SimpleModeConfig;
  treeExpandedKeys?: Key[];
  treeDefaultExpandedKeys?: Key[];
  treeLoadedKeys?: Key[];
  treeCheckable?: boolean | React.ReactNode;
  treeCheckStrictly?: boolean;
  showCheckedStrategy?: CheckedStrategy;
  treeDefaultExpandAll?: boolean;
  treeData?: DataNode[];
  treeLine?: boolean;
  treeIcon?: IconType;
  showTreeIcon?: boolean;
  switcherIcon?: IconType;
  treeMotion?: any;
  children?: React.ReactNode;

  filterTreeNode?: boolean | FilterFunc<LegacyDataNode>;
  dropdownPopupAlign?: any;

  // Event
  onSearch?: (value: string) => void;
  onChange?: (value: ValueType, labelList: React.ReactNode[], extra: ChangeEventExtra) => void;
  onTreeExpand?: (expandedKeys: Key[]) => void;
  onTreeLoad?: (loadedKeys: Key[]) => void;
  onDropdownVisibleChange?: (open: boolean) => void;

  // Legacy
  /** `searchPlaceholder` has been removed since search box has been merged into input box */
  searchPlaceholder?: React.ReactNode;

  /** @private This is not standard API since we only used in `rc-cascader`. Do not use in your production */
  labelRender?: (entity: FlattenDataNode, value: RawValueType) => React.ReactNode;
}

export default function generate(config: {
  prefixCls: string;
  optionList: GenerateConfig<any>['components']['optionList'];
}) {
  const { prefixCls, optionList } = config;

  const RefSelect = generateSelector<DataNode[]>({
    prefixCls,
    components: {
      optionList,
    },
    // Not use generate since we will handle ourself
    convertChildrenToData: () => null,
    flattenOptions,
    // Handle `optionLabelProp` in TreeSelect component
    getLabeledValue: getLabeledValue as any,
    filterOptions,
    isValueDisabled,
    findValueOption,
    omitDOMProps: (props: TreeSelectProps<any>) => omit(props, OMIT_PROPS),
  });

  RefSelect.displayName = 'Select';

  // =================================================================================
  // =                                      Tree                                     =
  // =================================================================================
  const RefTreeSelect = React.forwardRef<RefSelectProps, TreeSelectProps>((props, ref) => {
    const {
      fieldNames,
      multiple,
      treeCheckable,
      treeCheckStrictly,
      showCheckedStrategy = 'SHOW_CHILD',
      labelInValue,
      loadData,
      treeLoadedKeys,
      treeNodeFilterProp = 'value',
      treeNodeLabelProp,
      treeDataSimpleMode,
      treeData,
      treeExpandedKeys,
      treeDefaultExpandedKeys,
      treeDefaultExpandAll,
      children,
      treeIcon,
      showTreeIcon,
      switcherIcon,
      treeLine,
      treeMotion,
      filterTreeNode,
      dropdownPopupAlign,
      onChange,
      onTreeExpand,
      onTreeLoad,
      onDropdownVisibleChange,
      onSelect,
      onDeselect,
      labelRender,
    } = props;
    const mergedCheckable: React.ReactNode | boolean = treeCheckable || treeCheckStrictly;
    const mergedMultiple = multiple || mergedCheckable;
    const treeConduction = treeCheckable && !treeCheckStrictly;
    const mergedLabelInValue = treeCheckStrictly || labelInValue;

    // ======================= Tree Data =======================
    // FieldNames
    const mergedFieldNames = fillFieldNames(fieldNames, true);

    // Legacy both support `label` or `title` if not set.
    // We have to fallback to function to handle this
    const getTreeNodeTitle = (node: DataNode): React.ReactNode => {
      if (!treeData) {
        return node.title;
      }

      if (mergedFieldNames?.label) {
        return node[mergedFieldNames.label];
      }

      return node.label || node.title;
    };

    const getTreeNodeLabelProp = (entity: FlattenDataNode, val: RawValueType): React.ReactNode => {
      if (labelRender) {
        return labelRender(entity, val);
      }

      // Skip since entity not exist
      if (!entity) {
        return undefined;
      }

      const { node } = entity.data;

      if (treeNodeLabelProp) {
        return node[treeNodeLabelProp];
      }

      return getTreeNodeTitle(node);
    };

    const mergedTreeData = useTreeData(treeData, children, {
      getLabelProp: getTreeNodeTitle,
      simpleMode: treeDataSimpleMode,
      fieldNames: mergedFieldNames,
    });

    const flattedOptions = useMemo(() => flattenOptions(mergedTreeData), [mergedTreeData]);
    const [cacheKeyMap, cacheValueMap] = useKeyValueMap(flattedOptions);
    const [getEntityByKey, getEntityByValue] = useKeyValueMapping(cacheKeyMap, cacheValueMap);

    // Only generate keyEntities for check conduction when is `treeCheckable`
    const { keyEntities: conductKeyEntities } = useMemo(() => {
      if (treeConduction) {
        return convertDataToEntities(mergedTreeData as any);
      }
      return { keyEntities: null };
    }, [mergedTreeData, treeCheckable, treeCheckStrictly]);

    // ========================== Ref ==========================
    const selectRef = React.useRef<RefSelectProps>(null);

    React.useImperativeHandle(ref, () => ({
      scrollTo: selectRef.current.scrollTo,
      focus: selectRef.current.focus,
      blur: selectRef.current.blur,

      /** @private Internal usage. It's save to remove if `rc-cascader` not use it any longer */
      getEntityByValue,
    }));

    // ========================= Value =========================
    const [value, setValue] = useMergedState<DefaultValueType>(props.defaultValue, {
      value: props.value,
    });

    /** Get `missingRawValues` which not exist in the tree yet */
    const splitRawValues = (newRawValues: RawValueType[]) => {
      const missingRawValues = [];
      const existRawValues = [];

      // Keep missing value in the cache
      newRawValues.forEach(val => {
        if (getEntityByValue(val)) {
          existRawValues.push(val);
        } else {
          missingRawValues.push(val);
        }
      });

      return { missingRawValues, existRawValues };
    };

    const [rawValues, rawHalfCheckedKeys]: [RawValueType[], RawValueType[]] = useMemo(() => {
      const valueHalfCheckedKeys: RawValueType[] = [];
      const newRawValues: RawValueType[] = [];

      toArray(value).forEach(item => {
        if (item && typeof item === 'object' && 'value' in item) {
          if (item.halfChecked && treeCheckStrictly) {
            const entity = getEntityByValue(item.value);
            valueHalfCheckedKeys.push(entity ? entity.key : item.value);
          } else {
            newRawValues.push(item.value);
          }
        } else {
          newRawValues.push(item as RawValueType);
        }
      });

      // We need do conduction of values
      if (treeConduction) {
        const { missingRawValues, existRawValues } = splitRawValues(newRawValues);
        const keyList = existRawValues.map(val => getEntityByValue(val).key);

        const { checkedKeys, halfCheckedKeys } = conductCheck(keyList, true, conductKeyEntities);
        return [
          [...missingRawValues, ...checkedKeys.map(key => getEntityByKey(key).data.value)],
          halfCheckedKeys,
        ];
      }
      return [newRawValues, valueHalfCheckedKeys];
    }, [value, mergedMultiple, mergedLabelInValue, treeCheckable, treeCheckStrictly]);

    const selectValues = useSelectValues(rawValues, {
      treeConduction,
      value,
      showCheckedStrategy,
      conductKeyEntities,
      getEntityByValue,
      getEntityByKey,
      getLabelProp: getTreeNodeLabelProp,
    });

    const triggerChange = (
      newRawValues: RawValueType[],
      extra: { triggerValue: RawValueType; selected: boolean },
      source: SelectSource,
    ) => {
      setValue(mergedMultiple ? newRawValues : newRawValues[0]);
      if (onChange) {
        let eventValues: RawValueType[] = newRawValues;
        if (treeConduction && showCheckedStrategy !== 'SHOW_ALL') {
          const keyList = newRawValues.map(val => {
            const entity = getEntityByValue(val);
            return entity ? entity.key : val;
          });
          const formattedKeyList = formatStrategyKeys(
            keyList,
            showCheckedStrategy,
            conductKeyEntities,
          );

          eventValues = formattedKeyList.map(key => {
            const entity = getEntityByKey(key);
            return entity ? entity.data.value : key;
          });
        }

        const { triggerValue, selected } = extra || {
          triggerValue: undefined,
          selected: undefined,
        };

        let returnValues = mergedLabelInValue
          ? getRawValueLabeled(eventValues, value, getEntityByValue, getTreeNodeLabelProp)
          : eventValues;

        // We need fill half check back
        if (treeCheckStrictly) {
          const halfValues = rawHalfCheckedKeys
            .map(key => {
              const entity = getEntityByKey(key);
              return entity ? entity.data.value : key;
            })
            .filter(val => !eventValues.includes(val));

          returnValues = [
            ...(returnValues as LabelValueType[]),
            ...getRawValueLabeled(halfValues, value, getEntityByValue, getTreeNodeLabelProp),
          ];
        }

        const additionalInfo = {
          // [Legacy] Always return as array contains label & value
          preValue: selectValues,
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
        );

        if (mergedCheckable) {
          additionalInfo.checked = selected;
        } else {
          additionalInfo.selected = selected;
        }

        onChange(
          mergedMultiple ? returnValues : returnValues[0],
          mergedLabelInValue
            ? null
            : eventValues.map(val => {
                const entity = getEntityByValue(val);
                return entity ? entity.data.title : null;
              }),
          additionalInfo,
        );
      }
    };

    const onInternalSelect = (
      selectValue: RawValueType,
      option: DataNode,
      source: SelectSource,
    ) => {
      const eventValue = mergedLabelInValue ? selectValue : selectValue;

      if (!mergedMultiple) {
        // Single mode always set value
        triggerChange([selectValue], { selected: true, triggerValue: selectValue }, source);
      } else {
        let newRawValues = addValue(rawValues, selectValue);

        // Add keys if tree conduction
        if (treeConduction) {
          // Should keep missing values
          const { missingRawValues, existRawValues } = splitRawValues(newRawValues);
          const keyList = existRawValues.map(val => getEntityByValue(val).key);
          const { checkedKeys } = conductCheck(keyList, true, conductKeyEntities);
          newRawValues = [
            ...missingRawValues,
            ...checkedKeys.map(key => getEntityByKey(key).data.value),
          ];
        }

        triggerChange(newRawValues, { selected: true, triggerValue: selectValue }, source);
      }

      if (onSelect) {
        onSelect(eventValue, option);
      }
    };

    const onInternalDeselect = (
      selectValue: RawValueType,
      option: DataNode,
      source: SelectSource,
    ) => {
      const eventValue = mergedLabelInValue ? selectValue : selectValue;

      let newRawValues = removeValue(rawValues, selectValue);

      // Remove keys if tree conduction
      if (treeConduction) {
        const { missingRawValues, existRawValues } = splitRawValues(newRawValues);
        const keyList = existRawValues.map(val => getEntityByValue(val).key);
        const { checkedKeys } = conductCheck(
          keyList,
          { checked: false, halfCheckedKeys: rawHalfCheckedKeys },
          conductKeyEntities,
        );
        newRawValues = [
          ...missingRawValues,
          ...checkedKeys.map(key => getEntityByKey(key).data.value),
        ];
      }

      triggerChange(newRawValues, { selected: false, triggerValue: selectValue }, source);

      if (onDeselect) {
        onDeselect(eventValue, option);
      }
    };

    const onInternalClear = () => {
      triggerChange([], null, 'clear');
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

    // ======================== Warning ========================
    if (process.env.NODE_ENV !== 'production') {
      warningProps(props);
    }

    // ======================== Render =========================
    // We pass some props into select props style
    const selectProps: Partial<SelectProps<any, any>> = {
      optionLabelProp: null,
      optionFilterProp: treeNodeFilterProp,
      dropdownAlign: dropdownPopupAlign,
      internalProps: {
        mark: INTERNAL_PROPS_MARK,
        onClear: onInternalClear,
        skipTriggerChange: true,
        skipTriggerSelect: true,
        onRawSelect: onInternalSelect,
        onRawDeselect: onInternalDeselect,
      },
    };

    if ('filterTreeNode' in props) {
      selectProps.filterOption = filterTreeNode;
    }

    const selectContext = React.useMemo(
      () => ({
        checkable: mergedCheckable,
        loadData,
        treeLoadedKeys,
        onTreeLoad,
        checkedKeys: rawValues,
        halfCheckedKeys: rawHalfCheckedKeys,
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
        getEntityByKey,
        getEntityByValue,
      }),
      [
        mergedCheckable,
        loadData,
        treeLoadedKeys,
        onTreeLoad,
        rawValues,
        rawHalfCheckedKeys,
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
        getEntityByKey,
        getEntityByValue,
      ],
    );

    return (
      <SelectContext.Provider value={selectContext}>
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
          onSelect={null}
          onDeselect={null}
          onDropdownVisibleChange={onInternalDropdownVisibleChange}
        />
      </SelectContext.Provider>
    );
  });

  RefTreeSelect.displayName = 'TreeSelect';

  // =================================================================================
  // =                                    Generic                                    =
  // =================================================================================
  const TreeSelect = RefTreeSelect as any as (<ValueType = DefaultValueType>(
    props: React.PropsWithChildren<TreeSelectProps<ValueType>> & {
      ref?: React.Ref<RefSelectProps>;
    },
  ) => React.ReactElement) & {
    TreeNode: typeof TreeNode;
    SHOW_ALL: typeof SHOW_ALL;
    SHOW_PARENT: typeof SHOW_PARENT;
    SHOW_CHILD: typeof SHOW_CHILD;
  };

  TreeSelect.TreeNode = TreeNode;
  TreeSelect.SHOW_ALL = SHOW_ALL;
  TreeSelect.SHOW_PARENT = SHOW_PARENT;
  TreeSelect.SHOW_CHILD = SHOW_CHILD;

  return TreeSelect;
}
