import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { RefOptionListProps, OptionListProps } from 'rc-select/lib/OptionList';
import Tree from 'rc-tree';
import { FlattenDataNode, RawValueType, DataNode, TreeDataNode, Key } from './interface';

export interface OptionListProps<OptionsType extends object[]> {
  prefixCls: string;
  id: string;
  options: OptionsType;
  flattenOptions: FlattenDataNode[];
  height: number;
  itemHeight: number;
  values: Set<RawValueType>;
  multiple: boolean;
  open: boolean;
  defaultActiveFirstOption?: boolean;
  notFoundContent?: React.ReactNode;
  menuItemSelectedIcon?: any;
  childrenAsData: boolean;
  searchValue: string;

  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  onToggleOpen: (open?: boolean) => void;
  /** Tell Select that some value is now active to make accessibility work */
  onActiveValue: (value: RawValueType, index: number) => void;
  onScroll: React.UIEventHandler<HTMLDivElement>;
}

// TODO: Should check if use `treeData` without `key`
const OptionList: React.RefForwardingComponent<RefOptionListProps, OptionListProps<DataNode[]>> = (
  props,
  ref,
) => {
  const { prefixCls, height, itemHeight, options } = props;

  // ========================== Active ==========================
  const [activeKey, setActiveKey] = React.useState<Key>(null);

  // ========================= Keyboard =========================
  React.useImperativeHandle(ref, () => ({
    onKeyDown: event => {
      const { which } = event;

      switch (which) {
        // >>> Arrow keys
        case KeyCode.UP:
        case KeyCode.DOWN: {
          console.log('!!!!ARROW');
          break;
        }
      }
    },
    onKeyUp: () => {},
  }));

  return (
    <>
      <Tree
        activeKey={activeKey}
        focusable={false}
        prefixCls={`${prefixCls}-tree`}
        treeData={options as TreeDataNode[]}
        height={height}
        itemHeight={itemHeight}
      />
    </>
  );
};

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps<DataNode[]>>(OptionList);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
