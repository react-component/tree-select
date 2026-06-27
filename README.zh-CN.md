<div align="center">
  <h1>@rc-component/tree-select</h1>
  <p><sub><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /> Ant Design 生态的一部分。</sub></p>
  <p>🌳 React 树选择组件，结合树形数据、多选、搜索和下拉交互。</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/tree-select"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/tree-select.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/tree-select"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/tree-select.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/tree-select/actions/workflows/react-component-ci.yml"><img alt="build status" src="https://github.com/react-component/tree-select/actions/workflows/react-component-ci.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/tree-select"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/tree-select/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/tree-select"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/tree-select?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>


## 特性

| 范围 | 支持 |
| --------- | --------------------------------------------------------- |
| 数据      | 树数据、简单模式和自定义字段名                |
| 选择 | 单选、多选、勾选、严格勾选和标注值 |
| 搜索    | 受控搜索、自定义过滤和自动清除              |
| 加载   | 异步树加载和受控 loaded keys             |
| 规模     | 支持可配置列表指标的虚拟滚动          |

## 安装

```bash
npm install @rc-component/tree-select
```

## 使用

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

## 示例

```bash
npm install
npm start
```

本地打开 <http://localhost:8000/examples/>，或访问在线示例：<https://tree-select-react-component.vercel.app/>。

## API

### TreeSelect

TreeSelect 还接受来自 `@rc-component/select` `BaseSelect` 的公共属性，但内部使用的 `mode`、`classNames`、`styles` 和由 TreeSelect 重新定义的 `showSearch` 除外。

| 名称 | 说明 | 类型 | 默认值 |
| ----------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| autoClearSearchValue    | 已弃用。请改用 `showSearch.autoClearSearchValue`。     | boolean                                                                                                    | true                                                               |
| classNames              | 语义className。                                          | `Partial<Record<SemanticName, string>> & { popup?: Partial<Record<PopupSemantic, string>> }`               | -                                                                  |
| defaultValue            | 初始选中值。                                        | `ValueType`                                                                                                | -                                                                  |
| fieldNames              | 自定义树数据的字段名称。                           | `FieldNames`                                                                                               | -                                                                  |
| filterTreeNode          | 已弃用。请改用 `showSearch.filterTreeNode`。           | boolean \| `(inputValue: string, treeNode: DataNode) => boolean`                                           | -                                                                  |
| inputValue              | 已弃用。请改用 `showSearch.searchValue`。              | string                                                                                                     | -                                                                  |
| labelInValue            | 是否返回标记值对象而不是原始值。 | boolean                                                                                                    | false                                                              |
| listHeight              | 弹层列表高度。                                             | number                                                                                                     | 200                                                                |
| listItemHeight          | 弹层列表项的高度。                                        | number                                                                                                     | 20                                                                 |
| listItemScrollOffset    | 弹层列表项滚动偏移。                                 | number                                                                                                     | 0                                                                  |
| loadData                | 异步加载树数据。                                 | `(dataNode: LegacyDataNode) => Promise<unknown>`                                                           | -                                                                  |
| maxCount                | 多重或可检查模式下的最大选定项目数。     | number                                                                                                     | -                                                                  |
| multiple                | 启用多项选择。                                     | boolean                                                                                                    | false                                                              |
| onChange                | 当选定值更改时调用。                            | `(value: ValueType, labelList: ReactNode[], extra: ChangeEventExtra) => void`                              | -                                                                  |
| onDeselect              | 当取消选择某个值时调用。                             | `(value: ValueType, option: OptionType) => void`                                                           | -                                                                  |
| onPopupVisibleChange    | 当弹层窗口可见性发生变化时调用。                          | `(open: boolean) => void`                                                                                  | -                                                                  |
| onSearch                | 已弃用。请改用 `showSearch.onSearch`。                 | `(value: string) => void`                                                                                  | -                                                                  |
| onSelect                | 选择值时调用。                               | `(value: ValueType, option: OptionType) => void`                                                           | -                                                                  |
| onTreeExpand            | 当扩展树键更改时调用。                         | `(expandedKeys: SafeKey[]) => void`                                                                        | -                                                                  |
| onTreeLoad              | 当异步加载的键发生变化时调用。                          | `(loadedKeys: SafeKey[]) => void`                                                                          | -                                                                  |
| searchValue             | 已弃用。请改用 `showSearch.searchValue`。              | string                                                                                                     | -                                                                  |
| showCheckedStrategy     | 配置检查值的显示方式。                    | `SHOW_ALL` \| `SHOW_PARENT` \| `SHOW_CHILD`                                                                | 当 `treeCheckable` 使能时为 `SHOW_CHILD`，否则为 `SHOW_ALL` |
| showSearch              | 启用搜索或配置搜索行为。                    | boolean \| `SearchConfig`                                                                                  | -                                                                  |
| showTreeIcon            | 是否显示树形图标。                                    | boolean                                                                                                    | false                                                              |
| styles                  | 语义化样式。                                               | `Partial<Record<SemanticName, CSSProperties>> & { popup?: Partial<Record<PopupSemantic, CSSProperties>> }` | -                                                                  |
| switcherIcon            | 自定义树切换器图标。                                     | `IconType`                                                                                                 | -                                                                  |
| treeCheckable           | 是否在树中显示复选框。                        | boolean \| ReactNode                                                                                       | false                                                              |
| treeCheckStrictly       | 精确检查树节点，无需父子关联。   | boolean                                                                                                    | false                                                              |
| treeData                | 树节点数据。                                                | `OptionType[]`                                                                                             | -                                                                  |
| treeDataSimpleMode      | 启用简单树数据模式。                                  | boolean \| `SimpleModeConfig`                                                                              | false                                                              |
| treeDefaultExpandAll    | 默认展开所有树节点。                              | boolean                                                                                                    | false                                                              |
| treeDefaultExpandedKeys | 初始扩展树键。                                    | `SafeKey[]`                                                                                                | -                                                                  |
| treeExpandAction        | 树节点展开触发行为。                                  | false \| `click` \| `doubleClick`                                                                          | `click`                                                            |
| treeExpandedKeys        | 受控的扩展树键。                                 | `SafeKey[]`                                                                                                | -                                                                  |
| treeIcon                | 自定义树图标。                                              | `IconType`                                                                                                 | -                                                                  |
| treeLine                | 是否显示树线。                                    | boolean                                                                                                    | false                                                              |
| treeLoadedKeys          | 受控加载的树键。                                   | `SafeKey[]`                                                                                                | -                                                                  |
| treeMotion              | 树运动配置。                                            | any                                                                                                        | -                                                                  |
| treeNodeFilterProp      | 已弃用。请改用 `showSearch.treeNodeFilterProp`。       | string                                                                                                     | `value`                                                            |
| treeNodeLabelProp       | 作为选中标签渲染的树节点属性。                     | string                                                                                                     | `title`                                                            |
| treeTitleRender         | 自定义树节点标题渲染器。                               | `(node: OptionType) => ReactNode`                                                                          | -                                                                  |
| value                   | 受控选中值。                                     | `ValueType`                                                                                                | -                                                                  |
| virtual                 | 设置为 `false` 时禁用虚拟滚动。                 | boolean                                                                                                    | -                                                                  |

### SearchConfig

| 名称 | 说明 | 类型 | 默认值 |
| -------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- | ------- |
| autoClearSearchValue | 在多种模式下选择或取消选择后清除搜索输入。 | boolean                                                          | true    |
| filterTreeNode       | 根据搜索输入过滤树节点。                                  | boolean \| `(inputValue: string, treeNode: DataNode) => boolean` | -       |
| onSearch             | 当搜索输入更改时调用。                                   | `(value: string) => void`                                        | -       |
| searchValue          | 受控搜索输入值。                                      | string                                                           | -       |
| treeNodeFilterProp   | 启用 `filterTreeNode` 时用于过滤的树节点属性。 | string                                                           | `value` |

### DataNode

| 名称 | 说明 | 类型 | 默认值 |
| -------- | ---------------------- | ------------ | ------- |
| children | 子树节点。      | `DataNode[]` | -       |
| disabled | 禁用树节点。 | boolean      | false   |
| key      | 唯一树节点 key。  | `React.Key`  | -       |
| title    | 树节点标题。       | ReactNode    | -       |
| value    | 树节点值。       | `SafeKey`    | -       |

### TreeNode

推荐使用 `treeData`。`TreeNode` 仅为兼容旧用法保留。

| 名称 | 说明 | 类型 | 默认值 |
| -------- | ----------------------------- | --------- | ------- |
| disabled | 禁用树节点。        | boolean   | false   |
| isLeaf   | 标记节点为叶子节点。 | boolean   | false   |
| key      | 唯一树节点 key。         | React.Key | -       |
| title    | 树节点标题。              | ReactNode | -       |
| value    | 树节点值。              | SafeKey   | -       |

## 说明

对于大型树，避免默认展开所有节点。优先使用虚拟滚动，减少同时存在的 TreeSelect 实例数量，并在可勾选节点较多时使用 `treeCheckStrictly`。

在 `treeCheckable` 模式下，从选择器中移除选中项和取消勾选对应树节点会得到相同的选中值，但它们是不同的交互。二者都会触发 `onChange`，`extra` 参数可能
therefore differ.

## 本地开发

```bash
npm install
npm start
npm test
npm run lint
npm run compile
```

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/tree-select 基于 [MIT](./LICENSE.md) 许可证发布。
