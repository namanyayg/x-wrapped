import { motion, useSpring } from 'framer-motion';
import { useEffect } from 'react';

// export const CountUpAnimation = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
//   const springValue = useSpring(0, {
//     stiffness: 50,
//     damping: 10
//   });

//   useEffect(() => {
//     springValue.set(value);
//   }, [value, springValue]);

//   return (
//     <motion.span>
//       {springValue.get().toFixed(0).toLocaleString()}{suffix}
//     </motion.span>
//   );
// }; 
export const CountUpAnimation = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
  return <span>{value.toLocaleString()}{suffix}</span>;
};
