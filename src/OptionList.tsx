import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { RefOptionListProps } from 'rc-select/lib/OptionList';
import Tree, { TreeProps } from 'rc-tree';
import { EventDataNode } from 'rc-tree/lib/interface';
import { FlattenDataNode, RawValueType, DataNode, TreeDataNode, Key } from './interface';
import { SelectContext } from './Context';
import useKeyValueMapping from './hooks/useKeyValueMapping';
import useKeyValueMap from './hooks/useKeyValueMap';

const HIDDEN_STYLE = {
  width: 0,
  height: 0,
  display: 'flex',
  overflow: 'hidden',
  opacity: 0,
  border: 0,
  padding: 0,
  margin: 0,
};

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
    searchValue,
    onSelect,
    onToggleOpen,
    open,
    notFoundContent,
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
    treeNodeFilterProp,
    loadData,
    treeLoadedKeys,
    onTreeLoad,
  } = React.useContext(SelectContext);

  const treeRef = React.useRef<Tree>();

  const [cacheKeyMap, cacheValueMap] = useKeyValueMap(flattenOptions);
  const [getEntityByKey, getEntityByValue] = useKeyValueMapping(cacheKeyMap, cacheValueMap);

  // ========================== Values ==========================
  const valueKeys = React.useMemo(
    () =>
      checkedKeys.map(val => {
        const entity = getEntityByValue(val);
        return entity ? entity.key : null;
      }),
    [checkedKeys],
  );

  const mergedCheckedKeys = React.useMemo(() => {
    if (!checkable) {
      return null;
    }

    return {
      checked: valueKeys,
      halfChecked: halfCheckedKeys,
    };
  }, [valueKeys, halfCheckedKeys, checkable]);

  // ========================== Scroll ==========================
  React.useEffect(() => {
    // Single mode should scroll to current key
    if (open && !multiple && valueKeys.length) {
      treeRef.current.scrollTo({ key: valueKeys[0] });
    }
  }, [open]);

  // ========================== Search ==========================
  const lowerSearchValue = String(searchValue).toLowerCase();
  const filterTreeNode = (treeNode: EventDataNode) => {
    if (!lowerSearchValue) {
      return false;
    }
    return String(treeNode[treeNodeFilterProp])
      .toLowerCase()
      .includes(lowerSearchValue);
  };

  // =========================== Keys ===========================
  const [expandedKeys, setExpandedKeys] = React.useState<Key[]>(treeDefaultExpandedKeys);
  const [searchExpandedKeys, setSearchExpandedKeys] = React.useState<Key[]>(null);
  const mergedExpandedKeys = treeExpandedKeys || (searchValue ? searchExpandedKeys : expandedKeys);

  React.useEffect(() => {
    if (searchValue) {
      setSearchExpandedKeys(flattenOptions.map(o => o.key));
    }
  }, [searchValue]);

  const onInternalExpand = (keys: Key[]) => {
    setExpandedKeys(keys);
    setSearchExpandedKeys(keys);

    if (onTreeExpand) {
      onTreeExpand(keys);
    }
  };

  // ========================== Events ==========================
  const onListMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
  };

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
  const activeEntity = getEntityByKey(activeKey);

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
          if (activeEntity !== null) {
            onInternalSelect(null, {
              node: { key: activeKey },
              selected: !checkedKeys.includes(activeEntity.data.value),
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

  // ========================== Render ==========================
  if (options.length === 0) {
    return (
      <div role="listbox" className={`${prefixCls}-empty`} onMouseDown={onListMouseDown}>
        {notFoundContent}
      </div>
    );
  }

  const treeProps: Partial<TreeProps> = {};
  if (treeLoadedKeys) {
    treeProps.loadedKeys = treeLoadedKeys;
  }
  if (mergedExpandedKeys) {
    treeProps.expandedKeys = mergedExpandedKeys;
  }

  return (
    <div onMouseDown={onListMouseDown}>
      {activeEntity && open && (
        <span style={HIDDEN_STYLE} aria-live="assertive">
          {activeEntity.data.value}
        </span>
      )}

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
        loadData={searchValue ? null : (loadData as any)}
        // We handle keys by out instead tree self
        checkable={checkable}
        checkStrictly
        checkedKeys={mergedCheckedKeys}
        selectedKeys={!checkable ? valueKeys : []}
        defaultExpandAll={treeDefaultExpandAll}
        {...treeProps}
        // Proxy event out
        onActiveChange={setActiveKey}
        onSelect={onInternalSelect}
        onCheck={onInternalSelect}
        onExpand={onInternalExpand}
        onLoad={onTreeLoad}
        filterTreeNode={filterTreeNode}
      />
    </div>
  );
};

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps<DataNode[]>>(OptionList);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
