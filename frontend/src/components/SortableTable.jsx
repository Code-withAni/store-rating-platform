import { useState } from 'react';

/**
 * Generic sortable table.
 * columns: [{ key, label, render?, sortable? }]
 * data: array of objects
 */
const SortableTable = ({ columns, data, emptyText = 'No data found', header }) => {
  const [sortKey, setSortKey] = useState(columns[0]?.key || '');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ direction, active }) => (
    <span style={{ marginLeft: 'var(--space-1)', fontSize: '0.75rem', color: active ? 'var(--primary)' : 'var(--gray-400)' }}>
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );

  return (
    <div className="table-wrapper">
      {header && (
        <div className="table-header">
          {typeof header === 'string' ? <h2 className="table-header-title">{header}</h2> : header}
        </div>
      )}
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable !== false ? 'sortable' : ''}
                onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                scope="col"
              >
                {col.label}
                {col.sortable !== false && sortKey === col.key && (
                  <SortIcon direction={sortDir} active />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-8)' }}>
                <p style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)' }}>{emptyText}</p>
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
