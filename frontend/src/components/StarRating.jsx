import { useState } from 'react';

const StarRating = ({ value, onChange, readOnly = false, style, className = '' }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const [animating, setAnimating] = useState(false);

  const displayValue = hoverValue || value;

  const handleClick = (star) => {
    if (readOnly || !onChange) return;
    onChange(star);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150);
  };

  return (
    <span className={`stars ${className}`} style={style}
      onMouseLeave={() => !readOnly && setHoverValue(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${displayValue >= star ? 'filled' : 'empty'} ${readOnly ? 'read-only' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          style={{
            cursor: readOnly ? 'default' : 'pointer',
            transform: !readOnly && animating && displayValue === star ? 'scale(1.2)' : undefined,
            transition: 'transform 120ms ease-out, color 120ms ease-out',
          }}
          title={readOnly ? `${value} star${value !== 1 ? 's' : ''}` : `Rate ${star}`}
          aria-label={readOnly ? `${value} out of 5 stars` : `Rate ${star} out of 5 stars`}
        >
          ★
        </span>
      ))}
    </span>
  );
};

export default StarRating;
