import generate, { TreeSelectProps } from './generate';
import OptionList from './OptionList';

const TreeSelect = generate(OptionList as any);

export { TreeSelectProps };

export default TreeSelect;
