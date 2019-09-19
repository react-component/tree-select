import React from 'react';

export type Key = string | number;

export type RawValueType = string | number;

export interface LabelValueType {
  key?: Key;
  value?: RawValueType;
  label?: React.ReactNode;
}

export type DefaultValueType = RawValueType | RawValueType[] | LabelValueType | LabelValueType[];

export interface DataNode {
  value?: RawValueType;
  title?: React.ReactNode;
  key?: Key;
  disabled?: boolean;
  children?: DataNode[];
}

export interface InnerDataNode extends DataNode {
  key: Key;
  value: RawValueType;
  label?: React.ReactNode;
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
