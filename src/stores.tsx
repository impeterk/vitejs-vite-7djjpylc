import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';
export const counterStore = () => {
  const $counter = atom(0);
  function increment() {
    $counter.set($counter.get() + 1);
  }
  return {
    increment,
    _rawValue: $counter,
    get value() {
      return useStore($counter);
    },
  };
};

export const useCounterStore = counterStore();
