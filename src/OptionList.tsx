import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import useMemo from 'rc-util/lib/hooks/useMemo';
import type { RefOptionListProps } from 'rc-select/lib/OptionList';
import { useBaseProps } from 'rc-select';
import type { TreeProps } from 'rc-tree';
import Tree from 'rc-tree';
import type { EventDataNode, ScrollTo } from 'rc-tree/lib/interface';
import type { TreeDataNode, Key } from './interface';
import LegacyContext from './LegacyContext';
import TreeSelectContext from './TreeSelectContext';
import { getAllKeys, isCheckDisabled } from './utils/valueUtil';

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

type ReviseRefOptionListProps = Omit<RefOptionListProps, 'scrollTo'> & { scrollTo: ScrollTo };

const OptionList: React.RefForwardingComponent<ReviseRefOptionListProps> = (_, ref) => {
  const { prefixCls, multiple, searchValue, toggleOpen, open, notFoundContent } = useBaseProps();

  const {
    virtual,
    listHeight,
    listItemHeight,
    listItemScrollOffset,
    treeData,
    fieldNames,
    onSelect,
    dropdownMatchSelectWidth,
    treeExpandAction,
  } = React.useContext(TreeSelectContext);

  const {
    checkable,
    checkedKeys,
    halfCheckedKeys,
    treeExpandedKeys,
    treeDefaultExpandAll,
    treeDefaultExpandedKeys,
    onTreeExpand,
    treeIcon,
    showTreeIcon,
    switcherIcon,
    treeLine,
    treeNodeFilterProp,
    loadData,
    treeLoadedKeys,
    treeMotion,
    onTreeLoad,
    keyEntities,
  } = React.useContext(LegacyContext);

  const treeRef = React.useRef<Tree>();

  const memoTreeData = useMemo(
    () => treeData,
    [open, treeData],
    (prev, next) => next[0] && prev[1] !== next[1],
  );

  // ========================== Active ==========================
  const [activeKey, setActiveKey] = React.useState<Key>(null);
  const activeEntity = keyEntities[activeKey];

  // ========================== Values ==========================
  const mergedCheckedKeys = React.useMemo(() => {
    if (!checkable) {
      return null;
    }

    return {
      checked: checkedKeys,
      halfChecked: halfCheckedKeys,
    };
  }, [checkable, checkedKeys, halfCheckedKeys]);

  // ========================== Scroll ==========================
  React.useEffect(() => {
    // Single mode should scroll to current key
    if (open && !multiple && checkedKeys.length) {
      treeRef.current?.scrollTo({ key: checkedKeys[0] });
      setActiveKey(checkedKeys[0]);
    }
  }, [open]);

  // ========================== Search ==========================
  const lowerSearchValue = String(searchValue).toLowerCase();
  const filterTreeNode = (treeNode: EventDataNode<any>) => {
    if (!lowerSearchValue) {
      return false;
    }
    return String(treeNode[treeNodeFilterProp]).toLowerCase().includes(lowerSearchValue);
  };

  // =========================== Keys ===========================
  const [expandedKeys, setExpandedKeys] = React.useState<Key[]>(treeDefaultExpandedKeys);
  const [searchExpandedKeys, setSearchExpandedKeys] = React.useState<Key[]>(null);

  const mergedExpandedKeys = React.useMemo(() => {
    if (treeExpandedKeys) {
      return [...treeExpandedKeys];
    }
    return searchValue ? searchExpandedKeys : expandedKeys;
  }, [expandedKeys, searchExpandedKeys, treeExpandedKeys, searchValue]);

  React.useEffect(() => {
    if (searchValue) {
      setSearchExpandedKeys(getAllKeys(treeData, fieldNames));
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

  const onInternalSelect = (__: React.Key[], info: TreeEventInfo) => {
    const { node } = info;

    if (checkable && isCheckDisabled(node)) {
      return;
    }

    onSelect(node.key, {
      selected: !checkedKeys.includes(node.key),
    });

    if (!multiple) {
      toggleOpen(false);
    }
  };

  // ========================= Keyboard =========================
  React.useImperativeHandle(ref, () => ({
    scrollTo: treeRef.current?.scrollTo,
    onKeyDown: event => {
      const { which } = event;
      switch (which) {
        // >>> Arrow keys
        case KeyCode.UP:
        case KeyCode.DOWN:
        case KeyCode.LEFT:
        case KeyCode.RIGHT:
          treeRef.current?.onKeyDown(event as React.KeyboardEvent<HTMLDivElement>);
          break;

        // >>> Select item
        case KeyCode.ENTER: {
          if (activeEntity) {
            const { selectable, value } = activeEntity?.node || {};
            if (selectable !== false) {
              onInternalSelect(null, {
                node: { key: activeKey },
                selected: !checkedKeys.includes(value),
              });
            }
          }
          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          toggleOpen(false);
        }
      }
    },
    onKeyUp: () => {},
  }));

  // ========================== Render ==========================
  if (memoTreeData.length === 0) {
    return (
      <div role="listbox" className={`${prefixCls}-empty`} onMouseDown={onListMouseDown}>
        {notFoundContent}
      </div>
    );
  }

  const treeProps: Partial<TreeProps> = {
    fieldNames,
  };
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
          {activeEntity.node.value}
        </span>
      )}

      <Tree
        ref={treeRef}
        focusable={false}
        prefixCls={`${prefixCls}-tree`}
        treeData={memoTreeData as TreeDataNode[]}
        height={listHeight}
        itemHeight={listItemHeight}
        itemScrollOffset={listItemScrollOffset}
        virtual={virtual !== false && dropdownMatchSelectWidth !== false}
        multiple={multiple}
        icon={treeIcon}
        showIcon={showTreeIcon}
        switcherIcon={switcherIcon}
        showLine={treeLine}
        loadData={searchValue ? null : (loadData as any)}
        motion={treeMotion}
        activeKey={activeKey}
        // We handle keys by out instead tree self
        checkable={checkable}
        checkStrictly
        checkedKeys={mergedCheckedKeys}
        selectedKeys={!checkable ? checkedKeys : []}
        defaultExpandAll={treeDefaultExpandAll}
        {...treeProps}
        // Proxy event out
        onActiveChange={setActiveKey}
        onSelect={onInternalSelect}
        onCheck={onInternalSelect}
        onExpand={onInternalExpand}
        onLoad={onTreeLoad}
        filterTreeNode={filterTreeNode}
        expandAction={treeExpandAction}
      />
    </div>
  );
};

const RefOptionList = React.forwardRef<ReviseRefOptionListProps>(OptionList);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
