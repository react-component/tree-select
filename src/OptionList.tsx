import { useBaseProps } from 'rc-select';
import type { RefOptionListProps } from 'rc-select/lib/OptionList';
import type { TreeProps } from 'rc-tree';
import Tree from 'rc-tree';
import { UnstableContext } from 'rc-tree';
import type { EventDataNode, ScrollTo } from 'rc-tree/lib/interface';
import KeyCode from 'rc-util/lib/KeyCode';
import useMemo from 'rc-util/lib/hooks/useMemo';
import * as React from 'react';
import LegacyContext from './LegacyContext';
import TreeSelectContext from './TreeSelectContext';
import type { DataNode, FieldNames, Key, SafeKey } from './interface';
import { getAllKeys, isCheckDisabled } from './utils/valueUtil';
import { useEvent } from 'rc-util';
import { formatStrategyValues } from './utils/strategyUtil';

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

const OptionList: React.ForwardRefRenderFunction<ReviseRefOptionListProps> = (_, ref) => {
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
    treeTitleRender,
    onPopupScroll,
    leftMaxCount,
    showCheckedStrategy,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, treeData],
    (prev, next) => next[0] && prev[1] !== next[1],
  );

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ========================== Events ==========================
  const onListMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
  };

  const onInternalSelect = (__: Key[], info: TreeEventInfo) => {
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

  // =========================== Keys ===========================
  const [expandedKeys, setExpandedKeys] = React.useState<Key[]>(treeDefaultExpandedKeys);
  const [searchExpandedKeys, setSearchExpandedKeys] = React.useState<Key[]>(null);

  const mergedExpandedKeys = React.useMemo(() => {
    if (treeExpandedKeys) {
      return [...treeExpandedKeys];
    }
    return searchValue ? searchExpandedKeys : expandedKeys;
  }, [expandedKeys, searchExpandedKeys, treeExpandedKeys, searchValue]);

  const onInternalExpand = (keys: Key[]) => {
    setExpandedKeys(keys);
    setSearchExpandedKeys(keys);

    if (onTreeExpand) {
      onTreeExpand(keys);
    }
  };

  // ========================== Search ==========================
  const lowerSearchValue = String(searchValue).toLowerCase();
  const filterTreeNode = (treeNode: EventDataNode<any>) => {
    if (!lowerSearchValue) {
      return false;
    }
    return String(treeNode[treeNodeFilterProp]).toLowerCase().includes(lowerSearchValue);
  };

  React.useEffect(() => {
    if (searchValue) {
      setSearchExpandedKeys(getAllKeys(treeData, fieldNames));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // const getSelectableKeys = (targetNode: DataNode, names: FieldNames): Key[] => {
  //   const keys = [targetNode[names.value]];
  //   if (!Array.isArray(targetNode.children)) {
  //     return keys;
  //   }

  //   return targetNode.children.reduce((acc, child) => {
  //     if (!child.disabled) {
  //       acc.push(...getSelectableKeys(child, names));
  //     }
  //     return acc;
  //   }, keys);
  // };

  const nodeDisabled = useEvent((node: DataNode) => {
    const nodeValue = node[fieldNames.value];

    if (checkedKeys.includes(nodeValue)) {
      return false;
    }

    if (leftMaxCount === null) {
      return false;
    }

    // const cacheKey = `${nodeValue}-${checkedKeys.join(',')}-${maxCount}`;

    // // check cache
    // if (disabledCacheRef.current.has(cacheKey)) {
    //   return disabledCacheRef.current.get(cacheKey);
    // }

    // // calculate disabled state
    // const selectableNodeKeys = getSelectableKeys(node, fieldNames);
    // const simulatedCheckedKeys = [...checkedKeys, ...selectableNodeKeys];
    // const simulatedDisplayValues = formatStrategyValues(
    //   simulatedCheckedKeys as SafeKey[],
    //   showCheckedStrategy,
    //   keyEntities,
    //   fieldNames,
    // );

    // const isDisabled = simulatedDisplayValues.length > maxCount;

    // // update cache
    // disabledCacheRef.current.set(cacheKey, isDisabled);

    // return isDisabled;

    return false;
  });

  // ========================== Get First Selectable Node ==========================
  const getFirstMatchingNode = (nodes: EventDataNode<any>[]): EventDataNode<any> | null => {
    for (const node of nodes) {
      if (node.disabled || node.selectable === false) {
        continue;
      }

      if (searchValue) {
        if (filterTreeNode(node)) {
          return node;
        }
      } else {
        return node;
      }

      if (node[fieldNames.children]) {
        const matchInChildren = getFirstMatchingNode(node[fieldNames.children]);
        if (matchInChildren) {
          return matchInChildren;
        }
      }
    }
    return null;
  };

  // ========================== Active ==========================
  const [activeKey, setActiveKey] = React.useState<Key>(null);
  const activeEntity = keyEntities[activeKey as SafeKey];

  React.useEffect(() => {
    if (!open) {
      return;
    }
    let nextActiveKey = null;

    const getFirstNode = () => {
      const firstNode = getFirstMatchingNode(memoTreeData);
      return firstNode ? firstNode[fieldNames.value] : null;
    };

    // single mode active first checked node
    if (!multiple && checkedKeys.length && !searchValue) {
      nextActiveKey = checkedKeys[0];
    } else {
      nextActiveKey = getFirstNode();
    }

    setActiveKey(nextActiveKey);
  }, [open, searchValue]);

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
            const isNodeDisabled = nodeDisabled(activeEntity.node);
            const { selectable, value, disabled } = activeEntity?.node || {};
            if (selectable !== false && !disabled && !isNodeDisabled) {
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

  const hasLoadDataFn = useMemo(
    () => (searchValue ? false : true),
    [searchValue, treeExpandedKeys || expandedKeys],
    ([preSearchValue], [nextSearchValue, nextExcludeSearchExpandedKeys]) =>
      preSearchValue !== nextSearchValue && !!(nextSearchValue || nextExcludeSearchExpandedKeys),
  );

  const syncLoadData = hasLoadDataFn ? loadData : null;

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
      <UnstableContext.Provider value={{ nodeDisabled }}>
        <Tree
          ref={treeRef}
          focusable={false}
          prefixCls={`${prefixCls}-tree`}
          treeData={memoTreeData}
          height={listHeight}
          itemHeight={listItemHeight}
          itemScrollOffset={listItemScrollOffset}
          virtual={virtual !== false && dropdownMatchSelectWidth !== false}
          multiple={multiple}
          icon={treeIcon}
          showIcon={showTreeIcon}
          switcherIcon={switcherIcon}
          showLine={treeLine}
          loadData={syncLoadData}
          motion={treeMotion}
          activeKey={activeKey}
          // We handle keys by out instead tree self
          checkable={checkable}
          checkStrictly
          checkedKeys={mergedCheckedKeys}
          selectedKeys={!checkable ? checkedKeys : []}
          defaultExpandAll={treeDefaultExpandAll}
          titleRender={treeTitleRender}
          {...treeProps}
          // Proxy event out
          onActiveChange={setActiveKey}
          onSelect={onInternalSelect}
          onCheck={onInternalSelect}
          onExpand={onInternalExpand}
          onLoad={onTreeLoad}
          filterTreeNode={filterTreeNode}
          expandAction={treeExpandAction}
          onScroll={onPopupScroll}
        />
      </UnstableContext.Provider>
    </div>
  );
};

const RefOptionList = React.forwardRef<ReviseRefOptionListProps>(OptionList);

if (process.env.NODE_ENV !== 'production') {
  RefOptionList.displayName = 'OptionList';
}

export default RefOptionList;
