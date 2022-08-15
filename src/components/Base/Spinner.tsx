import React from 'react';
interface ISpinnerProps {
  width?: number;
  height?: number;
  borderWidth?: number;
  color?: string;
  center?: boolean;
  className?: string;
}

const Spinner: React.FC<ISpinnerProps> = ({
  width = 20,
  height = 20,
  borderWidth = 4,
  color='#ffffff',
  center,
  className = '',
}) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      className={`spinner ${className} ${center ? 'spinner_center' : ''}`}
    >
      <span
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderColor: `${color} transparent ${color} transparent`,
          borderWidth: `${borderWidth}px`,
        }}
      />
    </div>
  );
};

export default Spinner;
