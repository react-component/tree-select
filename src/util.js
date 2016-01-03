import React from 'react';

export function getValuePropValue(child) {
  const props = child.props;
  if ('value' in props) {
    return props.value;
  }
  if (child.key) {
    return child.key;
  }
  throw new Error('no key or value for ' + child);
}

export function getPropValue(child, prop) {
  if (prop === 'value') {
    return getValuePropValue(child);
  }
  return child.props[prop];
}

export function isCombobox(props) {
  return props.combobox;
}

export function isMultipleOrTags(props) {
  return props.multiple || props.tags;
}

export function isMultipleOrTagsOrCombobox(props) {
  return isMultipleOrTags(props) || isCombobox(props);
}

export function isSingleMode(props) {
  return !isMultipleOrTagsOrCombobox(props);
}

export function toArray(value) {
  let ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}


function isInclude(smallArray, bigArray) {
  // attention: [0,0,1] [0,0,10]
  return smallArray.every((ii, i) => {
    return ii === bigArray[i];
  });
}
export function getCheckedKeys(node, checkedKeys, allCheckedNodesKeys) {
  const nodeKey = node.props.eventKey;
  let newCks = [...checkedKeys];
  let nodePos;
  const unCheck = allCheckedNodesKeys.some(item => {
    if (item.key === nodeKey) {
      nodePos = item.pos;
      return true;
    }
  });
  if (unCheck) {
    const nArr = nodePos.split('-');
    newCks = [];
    allCheckedNodesKeys.forEach(item => {
      const iArr = item.pos.split('-');
      if (item.pos === nodePos ||
        nArr.length > iArr.length && isInclude(iArr, nArr) ||
        nArr.length < iArr.length && isInclude(nArr, iArr)) {
        // 过滤掉 非父级节点 和 所有子节点。
        // 因为 node节点 不选时，其 非父级节点 和 所有子节点 都不选。
        return;
      }
      newCks.push(item.key);
    });
  } else {
    newCks.push(nodeKey);
  }
  return newCks;
}

export function loopAllChildren(childs, callback) {
  const loop = (children, level) => {
    React.Children.forEach(children, (item, index) => {
      const pos = `${level}-${index}`;
      if (item.props.children) {
        loop(item.props.children, pos);
      }
      callback(item, index, pos, item.key || pos);
    });
  };
  loop(childs, 0);
}

export function filterMinPos(arr) {
  const a = [];
  arr.forEach((item) => {
    const b = a.filter((i) => {
      return item.indexOf(i) === 0 && (item[i.length] === '-' || !item[i.length]);
    });
    if (!b.length) {
      a.push(item);
    }
  });
  return a;
}
// console.log(filterMinPos(['0-0','0-1', '0-10', '0-0-1', '0-1-1', '0-10-0']));

function handleCheckState(obj, checkedPosArr, checkIt) {
  const stripTail = (str) => {
    const arr = str.match(/(.+)(-[^-]+)$/);
    let st = '';
    if (arr && arr.length === 3) {
      st = arr[1];
    }
    return st;
  };
  // stripTail('x-xx-sss-xx')
  const splitPos = (pos) => {
    return pos.split('-');
  };
  checkedPosArr.forEach((_pos) => {
    // 设置子节点，全选或全不选
    Object.keys(obj).forEach((i) => {
      if (splitPos(i).length > splitPos(_pos).length && i.indexOf(_pos) === 0) {
        obj[i].checkPart = false;
        obj[i].checked = checkIt;
      }
    });
    // 循环设置父节点的 选中 或 半选状态
    const loop = (__pos) => {
      const _posLen = splitPos(__pos).length;
      if (_posLen <= 2) { // e.g. '0-0', '0-1'
        return;
      }
      let sibling = 0;
      let siblingChecked = 0;
      const parentPos = stripTail(__pos);
      Object.keys(obj).forEach((i) => {
        if (splitPos(i).length === _posLen && i.indexOf(parentPos) === 0) {
          sibling++;
          if (obj[i].checked) {
            siblingChecked++;
          } else if (obj[i].checkPart) {
            siblingChecked += 0.5;
          }
        }
      });
      const parent = obj[parentPos];
      // sibling 不会等于0
      // 全不选 - 全选 - 半选
      if (siblingChecked === 0) {
        parent.checked = false;
        parent.checkPart = false;
      } else if (siblingChecked === sibling) {
        parent.checked = true;
        parent.checkPart = false;
      } else {
        parent.checkPart = true;
        parent.checked = false;
      }
      loop(parentPos);
    };
    loop(_pos);
  });
}

function getCheckKeys(treeNodesStates) {
  const checkPartKeys = [];
  const checkedKeys = [];
  const checkedNodes = [];
  const checkedNodesKeys = [];
  Object.keys(treeNodesStates).forEach((item) => {
    const itemObj = treeNodesStates[item];
    if (itemObj.checked) {
      checkedKeys.push(itemObj.key);
      checkedNodes.push(itemObj.node);
      checkedNodesKeys.push({key: itemObj.key, node: itemObj.node, pos: item});
    } else if (itemObj.checkPart) {
      checkPartKeys.push(itemObj.key);
    }
  });
  return {
    checkPartKeys, checkedKeys, checkedNodes, checkedNodesKeys, treeNodesStates,
  };
}

export function getTreeNodesStates(children, checkedKeys) {
  const checkedPos = [];
  const treeNodesStates = {};
  loopAllChildren(children, (item, index, pos, newKey) => {
    let checked = false;
    if (checkedKeys.indexOf(newKey) !== -1) {
      checked = true;
      checkedPos.push(pos);
    }
    treeNodesStates[pos] = {
      node: item,
      key: newKey,
      checked: checked,
      checkPart: false,
    };
  });

  handleCheckState(treeNodesStates, filterMinPos(checkedPos.sort()), true);

  return getCheckKeys(treeNodesStates);
}
