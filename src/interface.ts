import * as React from 'react';

export type SelectSource = 'option' | 'selection' | 'input' | 'clear';

export type Key = string | number;

export type RawValueType = string | number;

export interface LabelValueType {
  key?: Key;
  value?: RawValueType;
  label?: React.ReactNode;
  /** Only works on `treeCheckStrictly` */
  halfChecked?: boolean;
}

export type DefaultValueType =
  | RawValueType
  | RawValueType[]
  | LabelValueType
  | LabelValueType[];

export interface DataNode {
  value?: RawValueType;
  title?: React.ReactNode;
  label?: React.ReactNode;
  key?: Key;
  disabled?: boolean;
  disableCheckbox?: boolean;
  checkable?: boolean;
  children?: DataNode[];

  /** Customize data info */
  [prop: string]: any;
}

export interface InnerDataNode extends DataNode {
  key: Key;
  value: RawValueType;
  label?: React.ReactNode;
  children?: InnerDataNode[];
}

export interface LegacyDataNode extends DataNode {
  props: any;
}

export interface TreeDataNode extends DataNode {
  key: Key;
  children?: TreeDataNode[];
}

export interface FlattenDataNode {
  data: DataNode;
  key: Key;
  level: number;
}

export interface SimpleModeConfig {
  id?: Key;
  pId?: Key;
  rootPId?: Key;
}

/** @deprecated This is only used for legacy compatible. Not works on new code. */
export interface LegacyCheckedNode {
  pos: string;
  node: React.ReactElement;
  children?: LegacyCheckedNode[];
}

export interface ChangeEventExtra {
  /** @deprecated Please save prev value by control logic instead */
  preValue: LabelValueType[];
  triggerValue: RawValueType;
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
