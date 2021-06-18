import generate, { TreeSelectProps } from './generate';
import OptionList from './OptionList';

const TreeSelect = generate({ prefixCls: 'rc-tree-select', optionList: OptionList as any });

export { TreeSelectProps };

export default TreeSelect;
