import { useState, useEffect } from 'react';

const useResponsiveCollapse = (breakpoint: number = 768) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial state
    
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return [collapsed, setCollapsed] as const;
};

export default useResponsiveCollapse;