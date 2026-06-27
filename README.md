<div align="center">
  <h1>@rc-component/tree-select</h1>
  <p><sub>Part of the Ant Design ecosystem.</sub></p>
  <img alt="Ant Design" height="32" src="https://gw.alipayobjects.com/zos/bmw-prod/ae669a89-0c24-40ff-a91d-2b83497170f6.svg" />
  <p>🌳 React TreeSelect component for choosing values from tree data, with search, checkable nodes, async loading, and virtual scrolling.</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/tree-select"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/tree-select.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/tree-select"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/tree-select.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/tree-select/actions/workflows/react-component-ci.yml"><img alt="build status" src="https://github.com/react-component/tree-select/actions/workflows/react-component-ci.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/tree-select"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/tree-select/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/tree-select"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/tree-select?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>


## Highlights

| Area      | Support                                                   |
| --------- | --------------------------------------------------------- |
| Data      | Tree data, simple mode, custom field names                |
| Selection | Single, multiple, checkable, strict check, label-in-value |
| Search    | Controlled search, custom filter, auto clear              |
| Loading   | Async tree loading and controlled loaded keys             |
| Scale     | Virtual scrolling with configurable list metrics          |

## Install

```bash
npm install @rc-component/tree-select
```

## Usage

```tsx | pure
import TreeSelect from '@rc-component/tree-select';

const treeData = [
  {
    title: 'Parent',
    value: 'parent',
    children: [
      {
        title: 'Child',
        value: 'child',
      },
    ],
  },
];

export default () => <TreeSelect treeData={treeData} placeholder="Select a node" />;
```

## Examples

```bash
npm install
npm start
```

Open <http://localhost:8000/examples/> locally, or visit the online example:
<https://tree-select-react-component.vercel.app/>.

## API

### TreeSelect

TreeSelect also accepts public props from `@rc-component/select` `BaseSelect`, except
for the internal `mode`, `classNames`, `styles`, and `showSearch` props that are
redefined by TreeSelect.

| Name                    | Description                                                    | Type                                                                                                       | Default                                                            |
| ----------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| autoClearSearchValue    | Deprecated. Use `showSearch.autoClearSearchValue` instead.     | boolean                                                                                                    | true                                                               |
| classNames              | Semantic class names.                                          | `Partial<Record<SemanticName, string>> & { popup?: Partial<Record<PopupSemantic, string>> }`               | -                                                                  |
| defaultValue            | Initial selected value.                                        | `ValueType`                                                                                                | -                                                                  |
| fieldNames              | Customize field names for tree data.                           | `FieldNames`                                                                                               | -                                                                  |
| filterTreeNode          | Deprecated. Use `showSearch.filterTreeNode` instead.           | boolean \| `(inputValue: string, treeNode: DataNode) => boolean`                                           | -                                                                  |
| inputValue              | Deprecated. Use `showSearch.searchValue` instead.              | string                                                                                                     | -                                                                  |
| labelInValue            | Whether to return labeled value objects instead of raw values. | boolean                                                                                                    | false                                                              |
| listHeight              | Popup list height.                                             | number                                                                                                     | 200                                                                |
| listItemHeight          | Popup list item height.                                        | number                                                                                                     | 20                                                                 |
| listItemScrollOffset    | Popup list item scroll offset.                                 | number                                                                                                     | 0                                                                  |
| loadData                | Load tree data asynchronously.                                 | `(dataNode: LegacyDataNode) => Promise<unknown>`                                                           | -                                                                  |
| maxCount                | Maximum selected item count in multiple or checkable mode.     | number                                                                                                     | -                                                                  |
| multiple                | Enable multiple selection.                                     | boolean                                                                                                    | false                                                              |
| onChange                | Called when selected value changes.                            | `(value: ValueType, labelList: ReactNode[], extra: ChangeEventExtra) => void`                              | -                                                                  |
| onDeselect              | Called when a value is deselected.                             | `(value: ValueType, option: OptionType) => void`                                                           | -                                                                  |
| onPopupVisibleChange    | Called when popup visibility changes.                          | `(open: boolean) => void`                                                                                  | -                                                                  |
| onSearch                | Deprecated. Use `showSearch.onSearch` instead.                 | `(value: string) => void`                                                                                  | -                                                                  |
| onSelect                | Called when a value is selected.                               | `(value: ValueType, option: OptionType) => void`                                                           | -                                                                  |
| onTreeExpand            | Called when expanded tree keys change.                         | `(expandedKeys: SafeKey[]) => void`                                                                        | -                                                                  |
| onTreeLoad              | Called when async loaded keys change.                          | `(loadedKeys: SafeKey[]) => void`                                                                          | -                                                                  |
| searchValue             | Deprecated. Use `showSearch.searchValue` instead.              | string                                                                                                     | -                                                                  |
| showCheckedStrategy     | Configure how checked values are displayed.                    | `SHOW_ALL` \| `SHOW_PARENT` \| `SHOW_CHILD`                                                                | `SHOW_CHILD` when `treeCheckable` is enabled, otherwise `SHOW_ALL` |
| showSearch              | Enable search or configure search behavior.                    | boolean \| `SearchConfig`                                                                                  | -                                                                  |
| showTreeIcon            | Whether to show tree icons.                                    | boolean                                                                                                    | false                                                              |
| styles                  | Semantic styles.                                               | `Partial<Record<SemanticName, CSSProperties>> & { popup?: Partial<Record<PopupSemantic, CSSProperties>> }` | -                                                                  |
| switcherIcon            | Custom tree switcher icon.                                     | `IconType`                                                                                                 | -                                                                  |
| treeCheckable           | Whether to show checkboxes in the tree.                        | boolean \| ReactNode                                                                                       | false                                                              |
| treeCheckStrictly       | Check tree nodes precisely without parent-child association.   | boolean                                                                                                    | false                                                              |
| treeData                | Tree node data.                                                | `OptionType[]`                                                                                             | -                                                                  |
| treeDataSimpleMode      | Enable simple tree data mode.                                  | boolean \| `SimpleModeConfig`                                                                              | false                                                              |
| treeDefaultExpandAll    | Expand all tree nodes by default.                              | boolean                                                                                                    | false                                                              |
| treeDefaultExpandedKeys | Initial expanded tree keys.                                    | `SafeKey[]`                                                                                                | -                                                                  |
| treeExpandAction        | Expand action for tree nodes.                                  | false \| `click` \| `doubleClick`                                                                          | `click`                                                            |
| treeExpandedKeys        | Controlled expanded tree keys.                                 | `SafeKey[]`                                                                                                | -                                                                  |
| treeIcon                | Custom tree icon.                                              | `IconType`                                                                                                 | -                                                                  |
| treeLine                | Whether to show tree lines.                                    | boolean                                                                                                    | false                                                              |
| treeLoadedKeys          | Controlled loaded tree keys.                                   | `SafeKey[]`                                                                                                | -                                                                  |
| treeMotion              | Tree motion config.                                            | any                                                                                                        | -                                                                  |
| treeNodeFilterProp      | Deprecated. Use `showSearch.treeNodeFilterProp` instead.       | string                                                                                                     | `value`                                                            |
| treeNodeLabelProp       | Tree node prop rendered as selected label.                     | string                                                                                                     | `title`                                                            |
| treeTitleRender         | Custom tree node title renderer.                               | `(node: OptionType) => ReactNode`                                                                          | -                                                                  |
| value                   | Controlled selected value.                                     | `ValueType`                                                                                                | -                                                                  |
| virtual                 | Disable virtual scrolling when set to `false`.                 | boolean                                                                                                    | -                                                                  |

### SearchConfig

| Name                 | Description                                                         | Type                                                             | Default |
| -------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- | ------- |
| autoClearSearchValue | Clear search input after selecting or deselecting in multiple mode. | boolean                                                          | true    |
| filterTreeNode       | Filter tree nodes by search input.                                  | boolean \| `(inputValue: string, treeNode: DataNode) => boolean` | -       |
| onSearch             | Called when search input changes.                                   | `(value: string) => void`                                        | -       |
| searchValue          | Controlled search input value.                                      | string                                                           | -       |
| treeNodeFilterProp   | Tree node prop used for filtering when `filterTreeNode` is enabled. | string                                                           | `value` |

### DataNode

| Name     | Description            | Type         | Default |
| -------- | ---------------------- | ------------ | ------- |
| children | Child tree nodes.      | `DataNode[]` | -       |
| disabled | Disable the tree node. | boolean      | false   |
| key      | Unique tree node key.  | `React.Key`  | -       |
| title    | Tree node title.       | ReactNode    | -       |
| value    | Tree node value.       | `SafeKey`    | -       |

### TreeNode

Using `treeData` is recommended. `TreeNode` is kept for legacy usage.

| Name     | Description                   | Type      | Default |
| -------- | ----------------------------- | --------- | ------- |
| disabled | Disable the tree node.        | boolean   | false   |
| isLeaf   | Mark the node as a leaf node. | boolean   | false   |
| key      | Unique tree node key.         | React.Key | -       |
| title    | Tree node title.              | ReactNode | -       |
| value    | Tree node value.              | SafeKey   | -       |

## Notes

For large trees, avoid expanding all nodes by default. Prefer virtual scrolling,
keep the number of simultaneous TreeSelect instances low, and use
`treeCheckStrictly` when checkable mode has many nodes.

In `treeCheckable` mode, removing a selected item from the selector and
unchecking the matching tree node produce the same selected values, but they are
different interactions. Both trigger `onChange`, and the `extra` argument may
therefore differ.

## Development

```bash
npm install
npm start
npm test
npm run lint
npm run compile
```

## Release

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command after the package build.

## License

@rc-component/tree-select is released under the [MIT](./LICENSE.md) license.
