import { store } from "../plugin/modules/store";

const DEFAULT_LENGTH = 10;

// 队列存储(新增)
export const queueStoreAdd = ({ params, key }) => {
  let list = (store.get(key) as Array<any>) || [];
  if (list.length >= DEFAULT_LENGTH) {
    list.pop();
  }
  list.unshift(params);
  store.set(key, list);
};

// 队列存储（更新）
export const queueStoreUpdate = ({ params, key, idKey }) => {
  let list = (store.get(key) as Array<any>) || [];
  let index = list.findIndex((item) => item[idKey] === params[idKey]);
  if (index !== -1) {
    list.splice(index, 1, params);
    store.set(key, list);
  }
};

// 队列存储（删除）
export const queueStoreDelete = ({ key, idKey, id }) => {
  let list = (store.get(key) as Array<any>) || [];
  let index = list.findIndex((item) => item[idKey] === id);
  if (index !== -1) {
    list.splice(index, 1);
    store.set(key, list);
  }
};
