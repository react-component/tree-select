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
    onSelect,
    onToggleOpen,
  } = props;
  const {
    checkable,
    checkedKeys,
    halfCheckedKeys,
    treeExpandedKeys,
    treeDefaultExpandAll,
    treeDefaultExpandedKeys,
    onTreeExpand,
    treeIcon,
    switcherIcon,
    treeLine,
  } = React.useContext(SelectContext);

  const treeRef = React.useRef<Tree>();

  const [cacheKeyMap, cacheValueMap] = useKeyValueMap(flattenOptions);
  const [getEntityByKey, getEntityByValue] = useKeyValueMapping(cacheKeyMap, cacheValueMap);

  // ========================== Values ==========================
  const valueKeys = checkedKeys.map(val => {
    const entity = getEntityByValue(val);
    return entity ? entity.key : null;
  });

  const mergedCheckedKeys = React.useMemo(() => {
    if (!checkable) {
      return null;
    }

    return {
      checked: valueKeys,
      halfChecked: halfCheckedKeys,
    };
  }, [valueKeys, halfCheckedKeys, checkable]);

  // =========================== Keys ===========================
  const [expandedKeys, setExpandedKeys] = React.useState<Key[]>(treeDefaultExpandedKeys);
  const mergedExpandedKeys = treeExpandedKeys || expandedKeys;

  const onInternalExpand = (keys: Key[]) => {
    setExpandedKeys(keys);

    if (onTreeExpand) {
      onTreeExpand(keys);
    }
  };

  // ========================== Events ==========================
  const onInternalSelect = (_: Key[], { node: { key } }: TreeEventInfo) => {
    const entity = getEntityByKey(key, checkable ? 'checkbox' : 'select');
    if (entity !== null) {
      onSelect(entity.data.value, { selected: !checkedKeys.includes(entity.data.value) });
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
              selected: !checkedKeys.includes(entity.data.value),
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
        icon={treeIcon}
        switcherIcon={switcherIcon}
        showLine={treeLine}
        // We handle keys by out instead tree self
        checkable={checkable}
        checkStrictly
        checkedKeys={mergedCheckedKeys}
        selectedKeys={!checkable ? valueKeys : []}
        expandedKeys={mergedExpandedKeys}
        defaultExpandAll={treeDefaultExpandAll}
        // Proxy event out
        onActiveChange={setActiveKey}
        onSelect={onInternalSelect}
        onCheck={onInternalSelect}
        onExpand={onInternalExpand}
      />
    </div>
  );
};

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps<DataNode[]>>(OptionList);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;