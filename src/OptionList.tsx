import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { RefOptionListProps, OptionListProps } from 'rc-select/lib/OptionList';
import Tree from 'rc-tree';
import Tree1 from 'rc-tree/lib/Tree';
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

const OptionList: React.RefForwardingComponent<RefOptionListProps, OptionListProps<DataNode[]>> = (
  props,
  ref,
) => {
  const {
    prefixCls,
    height,
    itemHeight,
    options,
    flattenOptions,
    multiple,
    values,
    onSelect,
    onToggleOpen,
  } = props;
  const treeRef = React.useRef<Tree1>();

  const flattenOptionMap = React.useMemo(() => {
    const map: Map<Key, FlattenDataNode> = new Map();
    flattenOptions.forEach((dataNode: FlattenDataNode) => {
      map.set(dataNode.key, dataNode);
    });
    return map;
  }, [flattenOptions]);

  const getValueByKey = React.useCallback(
    (key: Key) => {
      const dataNode = flattenOptionMap.get(key);
      return dataNode ? dataNode.data.value : null;
    },
    [flattenOptionMap],
  );

  // ========================== Events ==========================
  const onInternalSelect = (
    _: Key[],
    { node: { key }, selected }: { node: { key: Key }; selected: boolean },
  ) => {
    const value = getValueByKey(key);
    if (value !== null) {
      onSelect(value, { selected });
    }

    if (!multiple) {
      onToggleOpen(false);
    }
  };

  // ========================= Keyboard =========================
  const [activeKey, setActiveKey] = React.useState<Key>(null);

  React.useImperativeHandle(ref, () => ({
    onKeyDown: event => {
      const { which } = event;

      switch (which) {
        // >>> Arrow keys
        case KeyCode.UP:
        case KeyCode.DOWN:
        case KeyCode.LEFT:
        case KeyCode.RIGHT:
          treeRef.current.onKeyDown(event as React.KeyboardEvent<HTMLDivElement>);
          break;

        // >>> Select item
        case KeyCode.ENTER:
        case KeyCode.SPACE: {
          // TODO: Check if is checkable
          const value = getValueByKey(activeKey);
          onInternalSelect(null, { node: { key: activeKey }, selected: !values.has(value) });
          break;
        }
      }
    },
    onKeyUp: () => {},
  }));

  return (
    <div
      onMouseDown={event => {
        event.preventDefault();
      }}
    >
      <Tree
        ref={treeRef}
        focusable={false}
        prefixCls={`${prefixCls}-tree`}
        treeData={options as TreeDataNode[]}
        height={height}
        itemHeight={itemHeight}
        multiple={multiple}
        // We handle keys by out instead tree self
        checkedKeys={[]}
        selectedKeys={[]}
        // Proxy event out
        onActiveChange={setActiveKey}
        onSelect={onInternalSelect}
      />
    </div>
  );
};

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps<DataNode[]>>(OptionList);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
