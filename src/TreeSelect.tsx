// import generate, { TreeSelectProps } from './generate';
import * as React from 'react';
import { BaseSelect } from 'rc-select';
import type { BaseSelectRef, BaseSelectPropsWithoutPrivate } from 'rc-select';
import useId from 'rc-select/lib/hooks/useId';
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

export type RawValueType = string | number;

export interface FieldNames {
  value?: string;
  label?: string;
  children?: string;
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

const TreeSelect = React.forwardRef<BaseSelectRef, TreeSelectProps>((props, ref) => {
  const {
    id,
    prefixCls = 'rc-tree-select',

    // >>> Mode
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
  const mergedCheckable: React.ReactNode | boolean = treeCheckable || treeCheckStrictly;
  const mergedFieldNames = React.useMemo(() => fillFieldNames(fieldNames, true), [fieldNames]);

  // =========================== Values ===========================
  const displayValues = React.useMemo(() => [], []);

  // ========================== Options ===========================
  // Legacy both support `label` or `title` if not set.
  // We have to fallback to function to handle this
  const getTreeNodeTitle = React.useCallback(
    (node: DefaultOptionType): React.ReactNode => {
      if (!treeData) {
        return node.title;
      }

      if (mergedFieldNames?.label) {
        return node[mergedFieldNames.label];
      }

      return node.label || node.title;
    },
    [mergedFieldNames, treeData],
  );

  const mergedTreeData = useTreeData(treeData, children, {
    getLabelProp: getTreeNodeTitle,
    simpleMode: treeDataSimpleMode,
    fieldNames: mergedFieldNames,
  });

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
      // checkedKeys: rawValues,
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
      // rawValues,
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
