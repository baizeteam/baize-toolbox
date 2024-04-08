import { store } from "../plugin/modules/store";

const DEFAULT_LENGTH = 10;

// 队列存储
export const queueStore = (params, key) => {
  let list = (store.get(key) as Array<any>) || [];
  if (list.length >= DEFAULT_LENGTH) {
    list.pop();
  }
  list.unshift(params);
  store.set("ttsList", list);
};
