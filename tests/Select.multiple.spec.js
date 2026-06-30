import { fireEvent } from '@testing-library/dom';
/* eslint-disable no-undef */
import { render, within, screen } from '@testing-library/react';
import { KeyCode } from '@rc-component/util';
import React from 'react';
import TreeSelect, { TreeNode } from '../src';
import focusTest from './shared/focusTest';
import {
  selectNode,
  clearSelection,
  search,
  expectOpen,
  triggerOpen,
  getInput,
  getSelections,
  getSelectionText,
} from './util';

describe('TreeSelect.multiple', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  focusTest(true);

  const treeData = [
    { key: '0', value: '0', title: 'label0' },
    { key: '1', value: '1', title: 'label1' },
  ];
  const createSelect = props => <TreeSelect treeData={treeData} multiple {...props} />;

  it('select multiple nodes', () => {
    const { container } = render(createSelect({ open: true }));
    selectNode(0);
    selectNode(1);
    expect(getSelectionText(container, 0)).toBe('label0');
    expect(getSelectionText(container, 1)).toBe('label1');
  });

  it('remove selected node', () => {
    const { container } = render(createSelect({ defaultValue: ['0', '1'] }));
    clearSelection(container);
    expect(getSelections(container)).toHaveLength(1);
    expect(getSelectionText(container, 0)).toBe('label1');
  });

  it('remove by backspace key', () => {
    const { container } = render(createSelect({ defaultValue: ['0', '1'] }));
    fireEvent.keyDown(getInput(container), { which: KeyCode.BACKSPACE, key: 'Backspace' });
    expect(getSelections(container)).toHaveLength(1);
    expect(getSelectionText(container, 0)).toBe('label0');
  });

  // https://github.com/react-component/tree-select/issues/47
  it('remove by backspace key twice when treeCheckable and under controlled', () => {
    class App extends React.Component {
      state = {
        value: ['0', '1'],
      };

      handleChange = value => {
        this.setState({ value });
      };

      render() {
        const { value } = this.state;
        return createSelect({
          open: true,
          value,
          onChange: this.handleChange,
          treeCheckable: true,
        });
      }
    }
    const { container } = render(<App />);
    fireEvent.keyDown(getInput(container), { which: KeyCode.BACKSPACE, key: 'Backspace' });
    selectNode(1);
    fireEvent.keyDown(getInput(container), { which: KeyCode.BACKSPACE, key: 'Backspace' });
    expect(getSelections(container)).toHaveLength(1);
    expect(getSelectionText(container, 0)).toBe('label0');
  });

  // TODO: Check preVal, it's not correct
  it('click X to delete select', () => {
    const handleChange = jest.fn();
    const children = [
      <TreeNode key="0" value="0" title="label0" foo={0} />,
      <TreeNode key="1" value="1" title="label1" foo={1} />,
    ];
    const { container } = render(
      createSelect({
        open: true,
        value: ['0', '1'],
        onChange: handleChange,
        treeCheckable: true,
        treeData: null,
        children,
      }),
    );

    clearSelection(container, 1);

    expect(handleChange.mock.calls[0][2].allCheckedNodes[0].props).toBeTruthy();

    expect(handleChange).toHaveBeenCalledWith(
      ['0'],
      ['label0'],
      expect.anything({
        allCheckedNodes: [
          expect.objectContaining({
            props: expect.objectContaining(children[0].props),
          }),
        ],
      }),
    );
  });

  it('renders clear button', () => {
    const { container } = render(createSelect({ allowClear: true, value: ['0'] }));

    expect(container.querySelector('.rc-tree-select-clear')).toBeTruthy();
  });

  it('should focus and clear search input after select and unselect item', () => {
    const { container } = render(createSelect());

    search(container, '0');
    selectNode(0);
    expect(getInput(container).value).toBe('');

    search(container, '0');
    selectNode(0);
    expect(getInput(container).value).toBe('');
  });

  it('do not open tree when close button click', () => {
    const { container } = render(createSelect());

    // Open the select dropdown
    triggerOpen(container);

    // Select two nodes
    selectNode(0);
    selectNode(1);

    // Check selections exist
    expect(container.querySelectorAll('.rc-tree-select-selection-item')).toHaveLength(2);

    // Open again to ensure dropdown is open
    triggerOpen(container);

    // Clear one selection - this should NOT open the dropdown
    clearSelection(container, 0);

    // Check that only one selection remains
    expect(container.querySelectorAll('.rc-tree-select-selection-item')).toHaveLength(1);

    // Check that dropdown is closed after clearing
    expectOpen(container, false);
  });

  describe('maxTagCount', () => {
    it('legal', () => {
      const { container } = render(
        createSelect({
          maxTagCount: 1,
          value: ['0', '1'],
        }),
      );

      expect(getSelections(container)).toHaveLength(2);
      expect(getSelectionText(container, 1)).toBe('+ 1 ...');
    });

    it('illegal', () => {
      const { container } = render(
        createSelect({
          maxTagCount: 1,
          value: ['0', 'not exist'],
        }),
      );

      expect(getSelections(container)).toHaveLength(2);
      expect(getSelectionText(container, 1)).toBe('+ 1 ...');
    });

    it('zero', () => {
      const { container } = render(
        createSelect({
          maxTagCount: 0,
          value: ['0', '1'],
        }),
      );

      expect(getSelections(container)).toHaveLength(1);
      expect(getSelectionText(container, 0)).toBe('+ 2 ...');
    });

    describe('maxTagPlaceholder', () => {
      it('string', () => {
        const { container } = render(
          createSelect({
            maxTagCount: 1,
            value: ['0', '1'],
            maxTagPlaceholder: 'bamboo',
          }),
        );
        expect(getSelectionText(container, 1)).toBe('bamboo');
      });

      it('function', () => {
        const { container } = render(
          createSelect({
            maxTagCount: 1,
            value: ['0', '1'],
            maxTagPlaceholder: list => `${list.length} bamboo...`,
          }),
        );
        expect(getSelectionText(container, 1)).toBe('1 bamboo...');
      });
    });
  });

  it('number types', () => {
    const myTreeData = [
      { key: 0, value: 0, title: 0 },
      {
        key: 1,
        value: 1,
        title: 1,
        children: [
          { key: 2, value: 2, title: 2 },
          { key: 3, value: 3, title: 3 },
        ],
      },
      { key: 4, value: 4, title: 4 },
    ];

    const onChange = jest.fn();

    render(
      createSelect({
        open: true,
        treeCheckable: true,
        defaultValue: [4],
        treeData: myTreeData,
        onChange,
      }),
    );

    selectNode(0);
    expect(onChange).toHaveBeenCalledWith([4, 0], expect.anything(), expect.anything());
    onChange.mockReset();

    selectNode(1);
    expect(onChange).toHaveBeenCalledWith([4, 0, 2, 3], expect.anything(), expect.anything());
  });

  // https://github.com/ant-design/ant-design/issues/12315
  it('select searched node', () => {
    const onChange = jest.fn();
    const { container } = render(
      <TreeSelect value={['leaf1']} multiple onChange={onChange} open>
        <TreeNode value="parent 1" title="parent 1" key="0-1">
          <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
            <TreeNode value="leaf1" title="my leaf" key="random" />
          </TreeNode>
          <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
            <TreeNode value="sss" title="sss" key="random3" />
          </TreeNode>
        </TreeNode>
      </TreeSelect>,
    );

    // Search for 'sss'
    search(container, 'sss');

    // Find and click on the searched node - use selectNode from util with correct index
    selectNode(2); // The sss node should be at index 2 after search filtering

    expect(onChange).toHaveBeenCalledWith(['leaf1', 'sss'], expect.anything(), expect.anything());
  });

  it('do not crash when value has empty string', () => {
    const { container } = render(
      <TreeSelect multiple value={['']}>
        <TreeNode value="" title="empty str" key="empty str" />
      </TreeSelect>,
    );

    expect(getSelections(container)).toHaveLength(1);
  });

  it('can hide search box by showSearch = false', () => {
    const { container } = render(<TreeSelect multiple showSearch={false} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('not exist value should can be remove', () => {
    const onChange = jest.fn();
    const onDeselect = jest.fn();
    const { container } = render(
      <TreeSelect
        treeCheckable
        value={['not-exist']}
        onChange={onChange}
        onDeselect={onDeselect}
      />,
    );
    clearSelection(container, 0);

    expect(onChange).toHaveBeenCalledWith([], expect.anything(), expect.anything());
    expect(onDeselect).toHaveBeenCalledWith('not-exist', undefined);
  });

  it('should not omit value', () => {
    const { container } = render(
      <TreeSelect
        value={['child1', 'child2', 'parent']}
        multiple
        treeData={[
          {
            label: 'parent',
            value: 'parent',
            children: [
              {
                label: 'child1',
                value: 'child1',
              },
              {
                label: 'child2',
                value: 'child2',
              },
            ],
          },
        ]}
      />,
    );

    const values = Array.from(
      container.querySelectorAll('.rc-tree-select-selection-item-content'),
    ).map(ele => ele.textContent);
    expect(values).toEqual(['child1', 'child2', 'parent']);
  });

  // https://github.com/ant-design/ant-design/issues/50578#issuecomment-2312130715
  it('should not omit value when value is null', () => {
    const { container } = render(
      <TreeSelect
        value={null}
        multiple
        placeholder="Fake placeholder"
        treeData={[
          {
            label: 'parent',
            value: 'parent',
            children: [
              {
                label: 'child1',
                value: 'child1',
              },
              {
                label: 'child2',
                value: 'child2',
              },
            ],
          },
        ]}
      />,
    );

    const values = Array.from(container.querySelectorAll('.rc-tree-select-selection-item-content')); //.map(ele => ele.textContent);

    expect(values).toHaveLength(0);

    const placeholder = container.querySelector('[class$=placeholder]');
    expect(placeholder).toBeTruthy();
    expect(placeholder.textContent).toBe('Fake placeholder');
  });
});
