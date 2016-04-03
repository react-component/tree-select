/* eslint no-loop-func: 0*/
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
      if (item && item.props.children) {
        loop(item.props.children, pos);
      }
      if (item) {
        callback(item, index, pos, getValuePropValue(item));
      }
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
  // const s = Date.now();
  // todo: 数据量大时，下边函数性能差，能否是o1时间复杂度？
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
  // console.log(Date.now() - s);
  return levelObj[levelArr[levelArr.length - 1]].concat(hierarchyNodes);
}


// arr.length === 628, use time: ~20ms
export function filterParentPosition(arr) {
  const levelObj = {};
  arr.forEach((item) => {
    const posLen = item.split('-').length;
    if (!levelObj[posLen]) {
      levelObj[posLen] = [];
    }
    levelObj[posLen].push(item);
  });
  const levelArr = Object.keys(levelObj).sort();
  for (let i = 0; i < levelArr.length; i++) {
    if (levelArr[i + 1]) {
      levelObj[levelArr[i]].forEach(ii => {
        for (let j = i + 1; j < levelArr.length; j++) {
          levelObj[levelArr[j]].forEach((_i, index) => {
            if (isInclude(ii.split('-'), _i.split('-'))) {
              levelObj[levelArr[j]][index] = null;
            }
          });
          levelObj[levelArr[j]] = levelObj[levelArr[j]].filter(p => p);
        }
      });
    }
  }
  let nArr = [];
  levelArr.forEach(i => {
    nArr = nArr.concat(levelObj[i]);
  });
  return nArr;
}
// console.log(filterParentPosition(['0-2', '0-3-3', '0-10', '0-10-0', '0-0-1', '0-0', '0-1-1', '0-1']));


const stripTail = (str) => {
  const arr = str.match(/(.+)(-[^-]+)$/);
  let st = '';
  if (arr && arr.length === 3) {
    st = arr[1];
  }
  return st;
};
const splitPosition = (pos) => {
  return pos.split('-');
};

// TODO 再优化
export function handleCheckState(obj, checkedPositionArr, checkIt) {
  // console.log(stripTail('0-101-000'));
  // let s = Date.now();
  let objKeys = Object.keys(obj);

  objKeys.forEach((i, index) => {
    const iArr = splitPosition(i);
    let saved = false;
    checkedPositionArr.forEach((_pos) => {
      // 设置子节点，全选或全不选
      const _posArr = splitPosition(_pos);
      if (iArr.length > _posArr.length && isInclude(_posArr, iArr)) {
        obj[i].checkPart = false;
        obj[i].checked = checkIt;
        objKeys[index] = null;
      }
      if (iArr[0] === _posArr[0] && iArr[1] === _posArr[1]) {
        // 如果
        saved = true;
      }
    });
    if (!saved) {
      objKeys[index] = null;
    }
  });
  objKeys = objKeys.filter(i => i); // filter non null;

  for (let pIndex = 0; pIndex < checkedPositionArr.length; pIndex++) {
    // 循环设置父节点的 选中 或 半选状态
    const loop = (__pos) => {
      const _posLen = splitPosition(__pos).length;
      if (_posLen <= 2) { // e.g. '0-0', '0-1'
        return;
      }
      let sibling = 0;
      let siblingChecked = 0;
      const parentPosition = stripTail(__pos);
      objKeys.forEach((i /* , index*/) => {
        const iArr = splitPosition(i);
        if (iArr.length === _posLen && isInclude(splitPosition(parentPosition), iArr)) {
          sibling++;
          if (obj[i].checked) {
            siblingChecked++;
            const _i = checkedPositionArr.indexOf(i);
            if (_i > -1) {
              checkedPositionArr.splice(_i, 1);
              if (_i <= pIndex) {
                pIndex--;
              }
            }
          } else if (obj[i].checkPart) {
            siblingChecked += 0.5;
          }
          // objKeys[index] = null;
        }
      });
      // objKeys = objKeys.filter(i => i); // filter non null;
      const parent = obj[parentPosition];
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
      loop(parentPosition);
    };
    loop(checkedPositionArr[pIndex], pIndex);
  }
  // console.log(Date.now()-s, objKeys.length, checkIt);
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
