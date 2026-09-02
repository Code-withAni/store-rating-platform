const StarRating = ({ value, onChange, readOnly = false, style, className = '' }) => {
  return (
    <span className={`stars ${className}`} style={style}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${value >= star ? 'filled' : 'empty'} ${readOnly ? 'read-only' : ''}`}
          onClick={!readOnly && onChange ? () => onChange(star) : undefined}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
          title={readOnly ? `${value} star${value !== 1 ? 's' : ''}` : `Rate ${star}`}
        >
          ★
        </span>
      ))}
    </span>
  );
};

export default StarRating;
