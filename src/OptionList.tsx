import * as React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import useMemo from 'rc-util/lib/hooks/useMemo';
import type { RefOptionListProps } from 'rc-select/lib/OptionList';
import { useBaseProps } from 'rc-select';
import type { TreeProps } from 'rc-tree';
import Tree from 'rc-tree';
import type { EventDataNode, ScrollTo } from 'rc-tree/lib/interface';
import type { FlattenDataNode, RawValueType, DataNode, TreeDataNode, Key } from './interface';
import LegacyContext from './LegacyContext';
import TreeSelectContext from './TreeSelectContext';
import { getAllKeys } from './utils/valueUtil';

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
  // prefixCls: string;
  // id: string;
  // options: OptionsType;
  // flattenOptions: FlattenDataNode[];
  // height: number;
  // itemHeight: number;
  // virtual?: boolean;
  // values: Set<RawValueType>;
  // multiple: boolean;
  // open: boolean;
  // defaultActiveFirstOption?: boolean;
  // notFoundContent?: React.ReactNode;
  // menuItemSelectedIcon?: any;
  // childrenAsData: boolean;
  // searchValue: string;
  // onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  // onToggleOpen: (open?: boolean) => void;
  // /** Tell Select that some value is now active to make accessibility work */
  // onActiveValue: (value: RawValueType, index: number) => void;
  // onScroll: React.UIEventHandler<HTMLDivElement>;
  // onMouseEnter: () => void;
}

type ReviseRefOptionListProps = Omit<RefOptionListProps, 'scrollTo'> & { scrollTo: ScrollTo };

const OptionList: React.RefForwardingComponent<
  ReviseRefOptionListProps,
  OptionListProps<DataNode[]>
> = (props, ref) => {
  const { prefixCls, multiple, searchValue, toggleOpen, open, notFoundContent, onMouseEnter } =
    useBaseProps();

  const { virtual, listHeight, listItemHeight, treeData, fieldNames, onSelect } =
    React.useContext(TreeSelectContext);

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

    getEntityByKey,
    getEntityByValue,
  } = React.useContext(LegacyContext);

  const treeRef = React.useRef<Tree>();

  const memoTreeData = useMemo(
    () => treeData,
    [open, treeData],
    (prev, next) => next[0] && prev[1] !== next[1],
  );

  // ========================== Values ==========================
  // const valueKeys = React.useMemo(
  //   () =>
  //     checkedKeys.map(val => {
  //       // We should keep disabled value entity here
  //       const entity = getEntityByValue(val, undefined, true);
  //       return entity ? entity.key : null;
  //     }),
  //   [checkedKeys, getEntityByValue],
  // );

  // TODO: handle this
  const valueKeys = [];

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
      treeRef.current?.scrollTo({ key: valueKeys[0] });
    }
  }, [open]);

  // ========================== Search ==========================
  const lowerSearchValue = String(searchValue).toLowerCase();
  const filterTreeNode = (treeNode: EventDataNode) => {
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
  }, [expandedKeys, searchExpandedKeys, lowerSearchValue, treeExpandedKeys]);

  React.useEffect(() => {
    if (searchValue) {
      setSearchExpandedKeys(getAllKeys(treeData, fieldNames));
    }
  }, [!!searchValue]);

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

  // const onInternalSelect = (_: Key[], { node: { key } }: TreeEventInfo) => {
  const onInternalSelect = (_: Key[], info: TreeEventInfo) => {
    // const entity = getEntityByKey(key, checkable ? 'checkbox' : 'select');
    // if (entity !== null) {
    //   onSelect(entity.data.value, {
    //     selected: !checkedKeys.includes(entity.data.value),
    //   });
    // }
    onSelect(info.node.key, {
      selected: !checkedKeys.includes(info.node.key),
    });

    if (!multiple) {
      toggleOpen(false);
    }
  };

  // ========================= Keyboard =========================
  const [activeKey, setActiveKey] = React.useState<Key>(null);
  // const activeEntity = getEntityByKey(activeKey);
  // TODO: handle this
  const activeEntity = null;

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
          const { selectable, value } = activeEntity?.data.node || {};
          if (selectable !== false) {
            onInternalSelect(null, {
              node: { key: activeKey },
              selected: !checkedKeys.includes(value),
            });
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
    <div onMouseDown={onListMouseDown} onMouseEnter={onMouseEnter}>
      {activeEntity && open && (
        <span style={HIDDEN_STYLE} aria-live="assertive">
          {activeEntity.data.value}
        </span>
      )}

      <Tree
        ref={treeRef}
        focusable={false}
        prefixCls={`${prefixCls}-tree`}
        treeData={memoTreeData as TreeDataNode[]}
        height={listHeight}
        itemHeight={listItemHeight}
        virtual={virtual}
        multiple={multiple}
        icon={treeIcon}
        showIcon={showTreeIcon}
        switcherIcon={switcherIcon}
        showLine={treeLine}
        loadData={searchValue ? null : (loadData as any)}
        motion={treeMotion}
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

const RefOptionList = React.forwardRef<ReviseRefOptionListProps, OptionListProps<DataNode[]>>(
  OptionList,
);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
