import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { RefOptionListProps } from 'rc-select/lib/OptionList';
import Tree from 'rc-tree';
import { FlattenDataNode, RawValueType, DataNode, TreeDataNode, Key } from './interface';
import { SelectContext } from './Context';
import useKeyValueMapping from './hooks/useKeyValueMapping';
import useKeyValueMap from './hooks/useKeyValueMap';

interface TreeEventInfo {
  node: { key: Key };
  selected?: boolean;
  checked?: boolean;
}

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
  const { checkable } = React.useContext(SelectContext);

  const treeRef = React.useRef<Tree>();

  const [cacheKeyMap, cacheValueMap] = useKeyValueMap(flattenOptions);
  const [getEntityByKey, getEntityByValue] = useKeyValueMapping(cacheKeyMap, cacheValueMap);

  // ========================== Values ==========================
  const valueKeys = [...values].map(val => {
    const entity = getEntityByValue(val);
    return entity ? entity.key : null;
  });

  // ========================== Events ==========================
  const onInternalSelect = (_: Key[], { node: { key }, selected }: TreeEventInfo) => {
    const entity = getEntityByKey(key);
    if (entity !== null) {
      onSelect(entity.data.value, { selected });
    }

    if (!multiple) {
      onToggleOpen(false);
    }
  };

  const onInternalCheck = (_: Key[], { node: { key }, checked }: TreeEventInfo) => {
    const entity = getEntityByKey(key);
    if (entity !== null) {
      onSelect(entity.data.value, { selected: checked });
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
        case KeyCode.ENTER: {
          const entity = getEntityByKey(activeKey);
          if (entity !== null) {
            onInternalSelect(null, {
              node: { key: activeKey },
              selected: !values.has(entity.data.value),
            });
          }
          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          onToggleOpen(false);
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
        checkable={checkable}
        checkStrictly
        checkedKeys={checkable ? valueKeys : []}
        selectedKeys={!checkable ? valueKeys : []}
        // Proxy event out
        onActiveChange={setActiveKey}
        onSelect={onInternalSelect}
        onCheck={onInternalCheck}
      />
    </div>
  );
};

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps<DataNode[]>>(OptionList);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
