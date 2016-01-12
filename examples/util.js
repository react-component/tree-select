
const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({title: key, key: key, value: key});
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const __level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(__level, key, tns[index].children);
  });
};
generateData(z);


function loopData(data, callback) {
  const loop = (d, level = 0) => {
    d.forEach((item, index) => {
      const pos = `${level}-${index}`;
      if (item.children) {
        loop(item.children, pos);
      }
      callback(item, index, pos);
    });
  };
  loop(data);
}

function isInclude(smallArray, bigArray) {
  return smallArray.every((ii, i) => {
    return ii === bigArray[i];
  });
}
// console.log(isInclude(['0', '1'], ['0', '10', '1']));

function getFilterValue(val, sVal, delVal) {
  const allPos = [];
  const delPos = [];
  loopData(gData, (item, index, pos) => {
    if (sVal.indexOf(item.value) > -1) {
      allPos.push(pos);
    }
    if (delVal.indexOf(item.value) > -1) {
      delPos.push(pos);
    }
  });
  const newPos = [];
  delPos.forEach((item) => {
    const nArr = item.split('-');
    allPos.forEach((i) => {
      const iArr = i.split('-');
      if (item === i ||
        nArr.length > iArr.length && isInclude(iArr, nArr) ||
        nArr.length < iArr.length && isInclude(nArr, iArr)) {
        // 过滤掉 父级节点 和 所有子节点。
        // 因为 node节点 不选时，其 父级节点 和 所有子节点 都不选。
        return;
      }
      newPos.push(i);
    });
  });
  const newVal = [];
  if (newPos.length) {
    loopData(gData, (item, index, pos) => {
      if (newPos.indexOf(pos) > -1) {
        newVal.push(item.value);
      }
    });
  }
  return newVal;
}

export { gData, getFilterValue };
