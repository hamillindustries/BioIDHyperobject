export const getItem = (mId, mObjs) => {
  return mObjs.filter(o => o.id === mId)[0]
}

export const checkItemExist = (mId, mObjs) => {
  return mObjs.filter(o => o.id === mId).length > 0
}

export const getDiff = (a, b) => {
  return a.filter(o => b.indexOf(o) === -1)
}

Array.prototype.without = function (ary) {
  return this.filter(item => ary.indexOf(item) === -1)
}
