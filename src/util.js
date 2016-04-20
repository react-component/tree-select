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

function recursiveGen(children, level = 0) {
  return React.Children.map(children, (child, index) => {
    const pos = `${level}-${index}`;
    const o = {
      title: child.props.title,
      label: child.props.label || child.props.title,
      value: child.props.value,
      key: child.key,
      _pos: pos,
    };
    if (child.props.children) {
      o.children = recursiveGen(child.props.children, pos);
    }
    return o;
  });
}

function recursive(children, cb) {
  children.forEach(item => {
    cb(item);
    if (item.children) {
      recursive(item.children, cb);
    }
  });
}

// 用于根据选择框里的 value 筛选初始的 tree 数据里全部选中项。
// 规则是：某一项选中，则子项全选中；相邻节点全选中，则父节点选中。
// 与 handleCheckState 部分功能重合，TODO：优化合并起来。
export function filterAllCheckedData(vs, treeNodes) {
  const vals = [...vs];
  if (!vals.length) {
    return vals;
  }

  const data = recursiveGen(treeNodes);
  const checkedNodesPositions = [];

  function checkChildren(children) {
    children.forEach(item => {
      if (item.__checked) {
        return;
      }
      const ci = vals.indexOf(item.value);
      const childs = item.children;
      if (ci > -1) {
        item.__checked = true;
        checkedNodesPositions.push({ node: item, pos: item._pos });
        vals.splice(ci, 1);
        if (childs) {
          recursive(childs, child => {
            child.__checked = true;
            checkedNodesPositions.push({ node: child, pos: child._pos });
          });
        }
      } else {
        if (childs) {
          checkChildren(childs);
        }
      }
    });
  }

  function checkParent(children, parent = { root: true }) {
    let siblingChecked = 0;
    children.forEach(item => {
      const childs = item.children;
      if (childs && !item.__checked && !item.__halfChecked) {
        const p = checkParent(childs, item);
        if (p.__checked) {
          siblingChecked++;
        } else if (p.__halfChecked) {
          siblingChecked += 0.5;
        }
      } else if (item.__checked) {
        siblingChecked++;
      } else if (item.__halfChecked) {
        siblingChecked += 0.5;
      }
    });
    const len = children.length;
    if (siblingChecked === len) {
      parent.__checked = true;
      checkedNodesPositions.push({ node: parent, pos: parent._pos });
    } else if (siblingChecked < len && siblingChecked > 0) {
      parent.__halfChecked = true;
    }
    if (parent.root) {
      return children;
    }
    return parent;
  }
  checkChildren(data);
  checkParent(data);

  checkedNodesPositions.forEach((i, index) => {
    // 清理掉私有数据
    delete checkedNodesPositions[index].node.__checked;
    delete checkedNodesPositions[index].node._pos;
    // 封装出 props 和 onCheck 返回值一致
    checkedNodesPositions[index].node.props = {
      title: checkedNodesPositions[index].node.title,
      label: checkedNodesPositions[index].node.label || checkedNodesPositions[index].node.title,
      value: checkedNodesPositions[index].node.value,
    };
    if (checkedNodesPositions[index].node.children) {
      checkedNodesPositions[index].node.props.children = checkedNodesPositions[index].node.children;
    }
    delete checkedNodesPositions[index].node.title;
    delete checkedNodesPositions[index].node.label;
    delete checkedNodesPositions[index].node.value;
    delete checkedNodesPositions[index].node.children;
  });
  return checkedNodesPositions;
}
