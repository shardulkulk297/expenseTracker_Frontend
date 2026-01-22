
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [bank, setBank] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      setLoading(false);
      setError('No token found. Please log in again.');
      return;
    }

    const getTransactions = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(
          'http://localhost:8081/api/transaction/getAll',
          { headers: { Authorization: 'Bearer ' + token } }
        );
        setTransactions(response.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, []);

  // Unique bank names for the dropdown
  const bankOptions = useMemo(() => {
    const set = new Set();
    transactions.forEach(t => {
      const name = t?.account?.bankName;
      if (name) set.add(name);
    });
    return Array.from(set).sort();
  }, [transactions]);

  // Apply filters (date + bank)
  const filtered = useMemo(() => {
    return transactions.filter(t => {
      // Handle date comparisons; assume t.transactionDate is ISO string or yyyy-MM-dd
      const txDate = t?.transactionDate ? new Date(t.transactionDate) : null;

      if (fromDate) {
        const from = new Date(fromDate);
        if (!txDate || txDate < from) return false;
      }
      if (toDate) {
        // Include entire "to" day by setting time to 23:59:59
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (!txDate || txDate > to) return false;
      }

      if (bank) {
        if ((t?.account?.bankName || '') !== bank) return false;
      }

      return true;
    });
  }, [transactions, fromDate, toDate, bank]);

  const clearFilters = () => {
    setFromDate('');
    setToDate('');
    setBank('');
  };

  const formatCurrencyINR = (val) => {
    const n = Number(val || 0);
    return `₹ ${n.toLocaleString('en-IN')}`;
  };

  const formatDate = (val) => {
    if (!val) return '—';
    // Try to format nicely; fallback to raw string if parsing fails
    const d = new Date(val);
    return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  return (
    <div className="container my-4">

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb bg-light px-3 py-2 rounded shadow-sm">
          <li className="breadcrumb-item">
            <a href="/financer" className="text-decoration-none">🏠 Dashboard</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            View Transactions
          </li>
        </ol>
      </nav>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">All Transactions</h2>
        <span className="badge text-bg-primary">
          {filtered.length} shown / {transactions.length} total
        </span>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold">From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={toDate || undefined}
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold">To Date</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || undefined}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Bank</label>
              <select
                className="form-select"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              >
                <option value="">All Banks</option>
                {bankOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-2 d-grid d-md-flex justify-content-md-end">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading transactions…</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No transactions match the selected filters.
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">Bank</th>
                <th scope="col" className="text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, index) => (
                <tr key={t.id ?? index}>
                  <td>{t.id}</td>
                  <th scope="row">{formatDate(t.transactionDate)}</th>
                  <td>{t.description || '—'}</td>
                  <td>{t?.account?.bankName || '—'}</td>
                  <td className="text-end">{formatCurrencyINR(t.amount)} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ViewTransactions;
``
