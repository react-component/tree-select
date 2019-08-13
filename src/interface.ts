import * as React from 'react';

export type Key = string | number;

export interface DataNode {
  title: React.ReactNode;
  key: Key;
  value: Key;
  children?: DataNode[];
}

export interface SimpleMode {
  id?: string;
  pid?: string;
  rootPid?: string;
}

export type IconFunc = () => React.ReactNode;

export interface InternalValue {
  label?: React.ReactNode;
  value: Key;
}

export type SingleValue = Key | InternalValue;

export type Value = SingleValue | SingleValue[];

export interface Entity {
  key: Key;
  value: Key;
}