import React, { useEffect, useRef, useState } from 'react';

const ScrollStack = ({ 
  children, 
  className = '', 
  itemDistance = 100, 
  itemScale = 0.03, 
  itemStackDistance = 30, 
  stackPosition = '20%', 
  scaleEndPosition = '10%', 
  baseScale = 0.85, 
  scaleDuration = 0.5, 
  rotationAmount = 0, 
  blurAmount = 0, 
  onStackComplete 
}) => {
  const stackRef = useRef(null);
  const [stackedIndexes, setStackedIndexes] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      if (!stackRef.current) return;

      const stackElement = stackRef.current;
      const rect = stackElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate when stacking should begin
      const stackStart = windowHeight * (parseFloat(stackPosition) / 100);
      const scaleEnd = windowHeight * (parseFloat(scaleEndPosition) / 100);
      
      const children = stackElement.children;
      const newStackedIndexes = new Set();

      Array.from(children).forEach((child, index) => {
        const childRect = child.getBoundingClientRect();
        const distanceFromTop = childRect.top;
        
        if (distanceFromTop <= stackStart) {
          newStackedIndexes.add(index);
          
          // Calculate scale based on position
          const scrollProgress = Math.max(0, Math.min(1, (stackStart - distanceFromTop) / itemDistance));
          const scale = baseScale - (itemScale * scrollProgress);
          const translateY = -(scrollProgress * itemStackDistance);
          const rotation = rotationAmount * scrollProgress;
          const blur = blurAmount * scrollProgress;
          
          child.style.transform = `scale(${Math.max(0.5, scale)}) translateY(${translateY}px) rotate(${rotation}deg)`;
          child.style.filter = `blur(${blur}px)`;
          child.style.zIndex = children.length - index;
        } else {
          child.style.transform = `scale(1) translateY(0px) rotate(0deg)`;
          child.style.filter = 'blur(0px)';
          child.style.zIndex = children.length - index;
        }
      });

      setStackedIndexes(newStackedIndexes);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, blurAmount]);

  useEffect(() => {
    if (onStackComplete && stackedIndexes.size > 0) {
      onStackComplete();
    }
  }, [stackedIndexes, onStackComplete]);

  return (
    <div className={`scroll-stack ${className}`} ref={stackRef}>
      {React.Children.map(children, (child, index) => (
        <div 
          key={index}
          className="scroll-stack-item" 
          style={{
            transition: `transform ${scaleDuration}s ease, filter ${scaleDuration}s ease`,
            marginBottom: index < React.Children.count(children) - 1 ? `${itemStackDistance}px` : '0px',
            position: 'relative'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ScrollStack;