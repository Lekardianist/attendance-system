import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './DataTable.css';
import Button from '../Button/Button';

const DataTable = ({
  columns,
  data,
  keyField = 'id',
  selectable = false,
  onSelect,
  onRowClick,
  pagination = false,
  pageSize = 10,
  searchable = false,
  onSearch,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  rowClassName = '',
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchable) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, searchable, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / pageSize);
  }, [filteredData.length, pageSize]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const allIds = filteredData.map(row => row[keyField]);
    
    if (checked) {
      setSelectedRows(allIds);
      if (onSelect) onSelect(allIds);
    } else {
      setSelectedRows([]);
      if (onSelect) onSelect([]);
    }
  };

  const handleSelectRow = (rowId) => {
    let newSelectedRows;
    if (selectedRows.includes(rowId)) {
      newSelectedRows = selectedRows.filter(id => id !== rowId);
    } else {
      newSelectedRows = [...selectedRows, rowId];
    }
    
    setSelectedRows(newSelectedRows);
    if (onSelect) onSelect(newSelectedRows);
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    
    const value = row[column.key];
    
    // Format based on column type
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    
    if (column.type === 'datetime' && value) {
      return new Date(value).toLocaleString();
    }
    
    if (column.type === 'currency' && value !== undefined) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: column.currency || 'USD',
      }).format(value);
    }
    
    if (column.type === 'percentage' && value !== undefined) {
      return `${value}%`;
    }
    
    return value !== undefined ? value.toString() : '';
  };

  if (loading) {
    return (
      <div className={`data-table loading ${className}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="data-table-search">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {selectable && (
                <th className="select-column">
                  <input
                    type="checkbox"
                    checked={
                      filteredData.length > 0 &&
                      selectedRows.length === filteredData.length
                    }
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.sortable ? 'sortable' : ''}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="th-content">
                    {column.title}
                    {column.sortable && sortColumn === column.key && (
                      <span className="sort-icon">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row[keyField]}
                  className={`${rowClassName} ${onRowClick ? 'clickable' : ''} ${
                    selectedRows.includes(row[keyField]) ? 'selected' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {selectable && (
                    <td className="select-column">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row[keyField])}
                        onChange={() => handleSelectRow(row[keyField])}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select row ${row[keyField]}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={`${row[keyField]}-${column.key}`}>
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <div className="empty-message">{emptyMessage}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="data-table-pagination">
          <div className="pagination-info">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredData.length)} of{' '}
            {filteredData.length} entries
          </div>
          <div className="pagination-controls">
            <Button
              variant="secondary"
              size="small"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first 2, last 2, and pages around current
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="ellipsis">...</span>
                        <Button
                          variant={currentPage === page ? 'primary' : 'secondary'}
                          size="small"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'secondary'}
                      size="small"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
            </div>
            
            <Button
              variant="secondary"
              size="small"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      render: PropTypes.func,
      sortable: PropTypes.bool,
      type: PropTypes.oneOf(['text', 'number', 'date', 'datetime', 'currency', 'percentage']),
      currency: PropTypes.string,
      width: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  keyField: PropTypes.string,
  selectable: PropTypes.bool,
  onSelect: PropTypes.func,
  onRowClick: PropTypes.func,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  searchable: PropTypes.bool,
  onSearch: PropTypes.func,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  className: PropTypes.string,
  rowClassName: PropTypes.string,
};

export default DataTable;