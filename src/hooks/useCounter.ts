import { useState } from 'react';

/** 숫자 카운트 커스텀 훅 */
const useCounter = (initialState = 0) => {
  const [count, setCount] = useState(initialState);

  const increase = () => setCount((prev) => prev + 1);
  const decrease = () => setCount((prev) => prev - 1);

  return { count, increase, decrease };
};

export default useCounter;
