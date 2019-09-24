import React from 'react';

export type Key = string | number;

export type RawValueType = string | number;

export interface LabelValueType {
  key?: Key;
  value?: RawValueType;
  label?: React.ReactNode;
  /** Only works on `treeCheckStrictly` */
  halfChecked?: boolean;
}

export type DefaultValueType = RawValueType | RawValueType[] | LabelValueType | LabelValueType[];

export interface DataNode {
  value?: RawValueType;
  title?: React.ReactNode;
  label?: React.ReactNode;
  key?: Key;
  disabled?: boolean;
  disableCheckbox?: boolean;
  children?: DataNode[];

  /** Customize data info */
  [prop: string]: any;
}

export interface InnerDataNode extends DataNode {
  key: Key;
  value: RawValueType;
  label?: React.ReactNode;
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

interface ChangeEventExtraNode {
  props: any;
  [prop: string]: any;
}

export interface ChangeEventExtra {
  /** @deprecated Please save prev value by control logic instead */
  preValue: LabelValueType[];
  triggerValue: RawValueType;
  /** @deprecated This prop not work as react node anymore. */
  triggerNode: ChangeEventExtraNode;
  /** @deprecated Use `onSelect` or `onDeselect` instead. */
  selected?: boolean;
  /** @deprecated Use `onSelect` or `onDeselect` instead. */
  checked?: boolean;
  /** @deprecated This prop not work as react node anymore. */
  allCheckedNodes: ChangeEventExtraNode[];
}
