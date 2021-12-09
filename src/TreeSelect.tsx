// import generate, { TreeSelectProps } from './generate';
import * as React from 'react';
import { BaseSelect } from 'rc-select';
import type { BaseSelectRef, BaseSelectPropsWithoutPrivate } from 'rc-select';
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import useId from 'rc-select/lib/hooks/useId';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import OptionList from './OptionList';
import TreeNode from './TreeNode';
import { SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from './utils/strategyUtil';
import TreeSelectContext from './TreeSelectContext';
import LegacyContext from './LegacyContext';
import useTreeData from './hooks/useTreeData';
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
import useCache from './hooks/useCache';

export type RawValueType = string | number;

export interface LabeledValueType {
  key?: React.Key;
  value?: RawValueType;
  label?: React.ReactNode;
  /** Only works on `treeCheckStrictly` */
  halfChecked?: boolean;
}

export type ValueType = RawValueType | LabeledValueType | (RawValueType | LabeledValueType)[];

export interface FieldNames {
  value?: string;
  label?: string;
  children?: string;
}

export interface InternalFieldName extends Omit<FieldNames, 'label'> {
  _title: string[];
}

export interface SimpleModeConfig {
  id?: React.Key;
  pId?: React.Key;
  rootPId?: React.Key;
}

export interface BaseOptionType {
  disabled?: boolean;
  checkable?: boolean;
  disableCheckbox?: boolean;
  children?: BaseOptionType[];
  [name: string]: any;
}

export interface DefaultOptionType extends BaseOptionType {
  value?: RawValueType;
  title?: React.ReactNode;
  label?: React.ReactNode;
  key?: React.Key;
  children?: DefaultOptionType[];
}

export interface LegacyDataNode extends DefaultOptionType {
  props: any;
}

export interface TreeSelectProps<OptionType extends BaseOptionType = DefaultOptionType>
  extends BaseSelectPropsWithoutPrivate {
  prefixCls?: string;
  id?: string;

  // >>> Value
  value?: ValueType;
  defaultValue?: ValueType;

  // >>> Field Names
  fieldNames?: FieldNames;

  // >>> Mode
  treeCheckable?: boolean | React.ReactNode;
  treeCheckStrictly?: boolean;

  // >>> Data
  treeData?: OptionType[];
  treeDataSimpleMode?: boolean | SimpleModeConfig;
  loadData?: (dataNode: LegacyDataNode) => Promise<unknown>;
  treeLoadedKeys?: React.Key[];
  onTreeLoad?: (loadedKeys: React.Key[]) => void;

  // >>> Options
  virtual?: boolean;
  listHeight?: number;
  listItemHeight?: number;
}

function isRawValue(value: RawValueType | LabeledValueType): value is RawValueType {
  return !value || typeof value !== 'object';
}

const TreeSelect = React.forwardRef<BaseSelectRef, TreeSelectProps>((props, ref) => {
  const {
    id,
    prefixCls = 'rc-tree-select',

    // Value
    value,
    defaultValue,

    //  Mode
    treeCheckable,
    treeCheckStrictly,

    // FieldNames
    fieldNames,

    // Data
    treeDataSimpleMode,
    treeData,
    children,
    loadData,
    treeLoadedKeys,
    onTreeLoad,

    // Options
    virtual,
    listHeight = 200,
    listItemHeight = 20,
  } = props;

  const mergedId = useId(id);
  const treeConduction = treeCheckable && !treeCheckStrictly;
  const mergedCheckable: React.ReactNode | boolean = treeCheckable || treeCheckStrictly;
  const mergedFieldNames: InternalFieldName = React.useMemo(
    () => fillFieldNames(fieldNames),
    [fieldNames],
  );

  // ============================ Data ============================
  // `useTreeData` only do convert of `children` or `simpleMode`.
  // Else will return origin `treeData` for perf consideration.
  // Do not do anything to loop the data.
  const mergedTreeData = useTreeData(treeData, children, treeDataSimpleMode);

  const { keyEntities } = React.useMemo(
    () =>
      convertDataToEntities(mergedTreeData as any, {
        fieldNames: mergedFieldNames,
      }),
    [mergedTreeData, mergedFieldNames],
  );

  // useCache(mergedTreeData, treeConduction, mergedFieldNames);

  // =========================== Label ============================
  const getLabel = React.useCallback(
    (item: DefaultOptionType) => {
      if (item) {
        const { _title: titleList } = mergedFieldNames;

        for (let i = 0; i < titleList.length; i += 1) {
          const title = item[titleList[i]];
          if (title !== undefined) {
            return title;
          }
        }
      }
    },
    [mergedFieldNames],
  );

  // ========================= Wrap Value =========================
  const convert2LabelValues = React.useCallback(
    (draftValues: ValueType) => {
      const values = toArray(draftValues);

      return values.map(val => {
        let rawLabel: React.ReactNode;
        let rawValue: RawValueType;
        let rawHalfChecked: boolean;

        // Init provided info
        if (!isRawValue(val)) {
          rawLabel = val.label;
          rawValue = val.value;
          rawHalfChecked = val.halfChecked;
        } else {
          rawValue = val;
        }

        // Fill missing label
        if (rawLabel === undefined) {
          const entity = keyEntities[rawValue];
          rawLabel = getLabel(entity?.node);
        }

        return {
          label: rawLabel,
          value: rawValue,
          halfChecked: rawHalfChecked,
        };
      });
    },
    [keyEntities, getLabel],
  );

  // =========================== Values ===========================
  const [internalValue, setInternalValue] = useMergedState(defaultValue, { value });

  const rawLabeledValues = React.useMemo(
    () => convert2LabelValues(internalValue),
    [convert2LabelValues, internalValue],
  );

  const displayValues = React.useMemo(
    () =>
      rawLabeledValues.map(item => ({
        ...item,
        label: item.label ?? item.value,
      })),
    [rawLabeledValues],
  );

  const rawValues = React.useMemo(
    () => rawLabeledValues.map(item => item.value),
    [rawLabeledValues],
  );

  // ========================== Context ===========================
  const treeSelectContext = React.useMemo(
    () => ({
      virtual,
      listHeight,
      listItemHeight,
      treeData: mergedTreeData,
      fieldNames: mergedFieldNames,
    }),
    [virtual, listHeight, listItemHeight, mergedTreeData, mergedFieldNames],
  );

  // ======================= Legacy Context =======================
  const legacyContext = React.useMemo(
    () => ({
      checkable: mergedCheckable,
      loadData,
      treeLoadedKeys,
      onTreeLoad,
      checkedKeys: rawValues,
      // halfCheckedKeys: rawHalfCheckedKeys,
      // treeDefaultExpandAll,
      // treeExpandedKeys,
      // treeDefaultExpandedKeys,
      // onTreeExpand,
      // treeIcon,
      // treeMotion,
      // showTreeIcon,
      // switcherIcon,
      // treeLine,
      // treeNodeFilterProp,
      // getEntityByKey,
      // getEntityByValue,
    }),
    [
      mergedCheckable,
      loadData,
      treeLoadedKeys,
      onTreeLoad,
      rawValues,
      // rawHalfCheckedKeys,
      // treeDefaultExpandAll,
      // treeExpandedKeys,
      // treeDefaultExpandedKeys,
      // onTreeExpand,
      // treeIcon,
      // treeMotion,
      // showTreeIcon,
      // switcherIcon,
      // treeLine,
      // treeNodeFilterProp,
      // getEntityByKey,
      // getEntityByValue,
    ],
  );

  // =========================== Render ===========================
  return (
    <TreeSelectContext.Provider value={treeSelectContext}>
      <LegacyContext.Provider value={legacyContext}>
        <BaseSelect
          ref={ref}
          {...props}
          // >>> MISC
          id={mergedId}
          prefixCls={prefixCls}
          displayValues={displayValues}
          // >>> Options
          OptionList={OptionList}
        />
      </LegacyContext.Provider>
    </TreeSelectContext.Provider>
  );
}) as any; // TODO: handle this

// Assign name for Debug
if (process.env.NODE_ENV !== 'production') {
  TreeSelect.displayName = 'TreeSelect';
}

TreeSelect.TreeNode = TreeNode;
TreeSelect.SHOW_ALL = SHOW_ALL;
TreeSelect.SHOW_PARENT = SHOW_PARENT;
TreeSelect.SHOW_CHILD = SHOW_CHILD;

export default TreeSelect;
