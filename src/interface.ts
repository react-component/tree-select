import type * as React from 'react';
import type { SafeKey } from 'rc-tree/lib/interface';

export type { SafeKey };

export type SelectSource = 'option' | 'selection' | 'input' | 'clear';

export interface LabeledValueType {
  key?: SafeKey;
  value?: SafeKey;
  label?: React.ReactNode;
  /** Only works on `treeCheckStrictly` */
  halfChecked?: boolean;
}

export type DefaultValueType = SafeKey | SafeKey[] | LabeledValueType | LabeledValueType[];

export interface DataNode {
  value?: SafeKey;
  title?: React.ReactNode;
  label?: React.ReactNode;
  key?: SafeKey;
  disabled?: boolean;
  disableCheckbox?: boolean;
  checkable?: boolean;
  children?: DataNode[];

  /** Customize data info */
  [prop: string]: any;
}

export interface InternalDataEntity {
  key: SafeKey;
  value: SafeKey;
  title?: React.ReactNode;
  disableCheckbox?: boolean;
  disabled?: boolean;
  children?: InternalDataEntity[];

  /** Origin DataNode */
  node: DataNode;
}

export interface LegacyDataNode extends DataNode {
  props: any;
}

export interface TreeDataNode extends DataNode {
  key: SafeKey;
  children?: TreeDataNode[];
}

export interface FlattenDataNode {
  data: InternalDataEntity;
  key: SafeKey;
  value: SafeKey;
  level: number;
  parent?: FlattenDataNode;
}

export interface SimpleModeConfig {
  id?: SafeKey;
  pId?: SafeKey;
  rootPId?: SafeKey;
}

/** @deprecated This is only used for legacy compatible. Not works on new code. */
export interface LegacyCheckedNode {
  pos: string;
  node: React.ReactElement;
  children?: LegacyCheckedNode[];
}

export interface ChangeEventExtra {
  /** @deprecated Please save prev value by control logic instead */
  preValue: LabeledValueType[];
  triggerValue: SafeKey;
  /** @deprecated Use `onSelect` or `onDeselect` instead. */
  selected?: boolean;
  /** @deprecated Use `onSelect` or `onDeselect` instead. */
  checked?: boolean;

  // Not sure if exist user still use this. We have to keep but not recommend user to use
  /** @deprecated This prop not work as react node anymore. */
  triggerNode: React.ReactElement;
  /** @deprecated This prop not work as react node anymore. */
  allCheckedNodes: LegacyCheckedNode[];
}

export interface FieldNames {
  value?: string;
  label?: string;
  children?: string;
}
