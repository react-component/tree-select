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
  return props.multiple || props.tags || props.treeCheckable;
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

export function preventDefaultEvent(e) {
  e.preventDefault();
}

export function findIndexInValueByKey(value, key) {
  let index = -1;
  for (let i = 0; i < value.length; i++) {
    if (value[i].value === key) {
      index = i;
      break;
    }
  }
  return index;
}

export const UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
};

export const UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable',
};


export function labelCompatible(prop) {
  let newProp = prop;
  if (newProp === 'label') {
    newProp = 'title';
  }
  return newProp;
}


export function isInclude(smallArray, bigArray) {
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
        // 过滤掉 父级节点 和 所有子节点。
        // 因为 node节点 不选时，其 父级节点 和 所有子节点 都不选。
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
      callback(item, index, pos, getValuePropValue(item));
    });
  };
  loop(childs, 0);
}

export function flatToHierarchy(arr) {
  if (!arr.length) {
    return arr;
  }
  const hierarchyNodes = [];
  const levelObj = {};
  arr.forEach((item) => {
    const posLen = item.pos.split('-').length;
    if (!levelObj[posLen]) {
      levelObj[posLen] = [];
    }
    levelObj[posLen].push(item);
  });
  const levelArr = Object.keys(levelObj).sort((a, b) => b - a);
  levelArr.reduce((pre, cur) => {
    if (cur && cur !== pre) {
      levelObj[pre].forEach((item) => {
        let haveParent = false;
        levelObj[cur].forEach((ii) => {
          if (isInclude(ii.pos.split('-'), item.pos.split('-'))) {
            haveParent = true;
            if (!ii.children) {
              ii.children = [];
            }
            ii.children.push(item);
          }
        });
        if (!haveParent) {
          hierarchyNodes.push(item);
        }
      });
    }
    return cur;
  });
  return levelObj[levelArr[levelArr.length - 1]].concat(hierarchyNodes);
}

function uniqueArray(arr) {
  const obj = {};
  arr.forEach(item => {
    if (!obj[item]) {
      obj[item] = true;
    }
  });
  return Object.keys(obj);
}
// console.log(uniqueArray(['11', '2', '2']));

export function filterParentPosition(arr) {
  const a = [].concat(arr);
  arr.forEach((item) => {
    const itemArr = item.split('-');
    a.forEach((ii, index) => {
      const iiArr = ii.split('-');
      if (itemArr.length <= iiArr.length && isInclude(itemArr, iiArr)) {
        a[index] = item;
      }
      if (itemArr.length > iiArr.length && isInclude(iiArr, itemArr)) {
        a[index] = ii;
      }
    });
  });
  return uniqueArray(a);
}

const stripTail = (str) => {
  const arr = str.match(/(.+)(-[^-]+)$/);
  let st = '';
  if (arr && arr.length === 3) {
    st = arr[1];
  }
  return st;
};

function handleCheckState(obj, checkedPosArr, checkIt) {
  // stripTail('x-xx-sss-xx')
  const splitPos = (pos) => {
    return pos.split('-');
  };
  checkedPosArr.forEach((_pos) => {
    const posPath = splitPos(_pos);
    // 设置子节点，全选或全不选
    Object.keys(obj).forEach((i) => {
      const iPath = splitPos(i);
      if (iPath.length > posPath.length && isInclude(posPath, iPath)) {
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
      const parentPosPath = splitPos(parentPos);
      Object.keys(obj).forEach((i) => {
        const iPath = splitPos(i);
        if (iPath.length === _posLen && isInclude(parentPosPath, iPath)) {
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

function getCheck(treeNodesStates) {
  const checkedTreeNodes = [];
  Object.keys(treeNodesStates).forEach((item) => {
    const itemObj = treeNodesStates[item];
    if (itemObj.checked) {
      // checkedTreeNodes.push(getValuePropValue(itemObj.node));
      checkedTreeNodes.push({ ...itemObj, pos: item });
    }
  });
  return {
    checkedTreeNodes,
  };
}

export function getTreeNodesStates(children, values) {
  const checkedPos = [];
  const treeNodesStates = {};
  loopAllChildren(children, (item, index, pos, value) => {
    let checked = false;
    if (values.indexOf(value) !== -1) {
      checked = true;
      checkedPos.push(pos);
    }
    treeNodesStates[pos] = {
      node: item,
      checked: checked,
      checkPart: false,
    };
  });

  handleCheckState(treeNodesStates, filterParentPosition(checkedPos.sort()), true);

  return getCheck(treeNodesStates);
}
