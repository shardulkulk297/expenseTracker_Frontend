import axios, { Axios } from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'


const FinancerDashboard = () => {

  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])

  const [showAddForm, setShowAddForm] = useState(false)
  const [bankName, setBankName] = useState("");
  const [mainBalance, setMainBalance] = useState(0);
  const [accountType, setAccountType] = useState("SAVINGS");

  const [newAccount, setNewAccount] = useState({});


  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {

      const getTransactions = async () => {
        try {
          const response = await axios.get("http://localhost:8081/api/transaction/getFirst5Transactions", {
            headers: { Authorization: "Bearer " + localStorage.getItem('token') }
          })
          console.log(response.data);
          setTransactions(response.data);

        } catch (error) {
          console.log(error);
        }
      }
      getTransactions();

    }
    else {
      console.log("No token found");
    }
  }, [])

  useEffect(() => {

    const getAccounts = async () => {

      try {
        const response = await axios.get("http://localhost:8081/api/account/getAccounts", {
          headers: { Authorization: "Bearer " + localStorage.getItem('token') }
        })
        console.log(response.data);
        setAccounts(response.data);

      } catch (error) {
        console.log(error);
      }

    }

    getAccounts();

  }, [])



  // Toggle & form handlers (implemented so buttons/forms don't error)
  const handleAddAccountToggle = () => {
    setShowAddForm(prev => !prev)
    if (!showAddForm) {
      setNewAccount({ bankName: '', accountType: 'SAVINGS', mainBalance: 0 })
    }
  }

  const handleInput = (e) => {
    const { name, value, type } = e.target
    setNewAccount(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleAddAccount = async(e) => {
    e.preventDefault()
    toast.success("Adding Account");

    try {
      const response = await axios.post("http://localhost:8081/api/account/add",{
        bankName: bankName,
        accountType: accountType,
        mainBalance: Number(mainBalance),
        balance: Number(mainBalance)
      },{
        headers: {Authorization: "Bearer " + localStorage.getItem("token")} 
      })
      console.log(response.data);
      
    } catch (error) {
      console.log(error);
      
    }
    

  
  }

  // Safe totals calculation from state (falls back to zero)
  const totals = useMemo(() => {
    const totalBalance = accounts.reduce((s, a) => s + Number(a.balance || 0), 0)
    const totalSpent = transactions
      .filter(t => t.transactionType?.toUpperCase() === 'EXPENSE')
      .reduce((s, t) => s + (isNaN(Number(t.amount)) ? 0 : Number(t.amount)), 0)

    const accountsCount = accounts.length
    return { totalBalance, totalSpent, accountsCount }
  }, [accounts, transactions])

  // When there's no data from APIs yet, show these HTML-only dummy values
  const hasData = accounts.length > 0 || transactions.length > 0
  const fallbackTotals = {
    totalBalance: 70000,
    totalSpent: 4000,
    totalIncome: 60000,
    accountsCount: 2,
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 m-0">Financer Dashboard</h1>
        <div>
          <button className="btn btn-primary me-2" onClick={handleAddAccountToggle}>
            {showAddForm ? 'Close' : 'Add Account'}
          </button>
          <Link to="/financer/transactions" className="btn btn-outline-secondary">
            View Transactions
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <div className="card p-3">
            <div className="small text-muted">Total Balance</div>
            <div className="h5 fw-bold">
              ₹ {(hasData ? totals.totalBalance : fallbackTotals.totalBalance).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="col-6 col-md-4">
          <div className="card p-3">
            <div className="small text-muted">Total Spent</div>
            <div className="h5 fw-bold text-danger">
              ₹ {(hasData ? totals.totalSpent : fallbackTotals.totalSpent).toLocaleString()}
            </div>
          </div>
        </div>



        <div className="col-6 col-md-4">
          <div className="card p-3">
            <div className="small text-muted">Accounts</div>
            <div className="h5 fw-bold">
              {hasData ? totals.accountsCount : fallbackTotals.accountsCount}
            </div>
          </div>
        </div>
      </div>

      {/* Add account inline form */}
      {showAddForm && (
        <div className="card mb-4 p-3">
          <form onSubmit={handleAddAccount}>
            <div className="row g-3 align-items-end">
              <div className="col-md-5">
                <label className="form-label small">Account name</label>
                <input
                  className="form-control"
                  name="bankName"
                  value={bankName}
                  onChange={(e)=>setBankName(e.target.value)}
                  placeholder="e.g. HDFC Savings"

                />
              </div>

              <div className="col-md-3">
                <label className="form-label small">Type</label>
                <select className="form-select" name="accountType" value={accountType} onChange={(e)=> setAccountType(e.target.value)}>
                  <option value="SAVINGS">SAVINGS</option>
                  <option value="CURRENT">CURRENT</option>
                  <option value="CREDIT">CREDIT</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label small">Opening balance</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  name="mainBalance"
                  value={mainBalance}
                  onChange={(e)=>setMainBalance(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">Create</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="row">
        {/* Accounts list */}
        <div className="col-lg-5 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Accounts</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th className="text-end">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.length > 0 ? (
                      accounts.map(acc => (
                        <tr key={acc.id}>
                          <td>{acc.bankName}</td>
                          <td>{acc.accountType}</td>
                          <td className="text-end">₹ {Number(acc.balance).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      // HTML-only dummy rows (visible while APIs not wired)
                      <>
                        <tr>
                          <td>HDFC Savings</td>
                          <td>SAVINGS</td>
                          <td className="text-end">₹ 50,000</td>
                        </tr>
                        <tr>
                          <td>ICICI Current</td>
                          <td>CURRENT</td>
                          <td className="text-end">₹ 20,000</td>
                        </tr>
                      </>
                    )}

                    {accounts.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center small text-muted">No accounts yet (showing sample rows)</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="col-lg-7 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Recent Transactions</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map(tx => (
                        <tr key={tx.id}>
                          <td>{tx.transactionDate}</td>
                        
                          <td>{tx.description}</td>
                          <td>{tx.transactionType}</td>
                          <td className={`text-end ${tx.type === 'EXPENSE' ? 'text-danger' : 'text-success'}`}>
                            {tx.type === 'EXPENSE' ? '-' : '+'} ₹ {Number(tx.amount).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      // HTML-only dummy rows while APIs are not wired
                      <>
                        <tr>
                          <td>2026-01-12</td>
                          <td>Electricity Bill</td>
                          <td>EXPENSE</td>
                          <td className="text-end text-danger">- ₹ 2,500</td>
                        </tr>
                        <tr>
                          <td>2026-01-10</td>
                          <td>Grocery</td>
                          <td>EXPENSE</td>
                          <td className="text-end text-danger">- ₹ 1,500</td>
                        </tr>
                        <tr>
                          <td>2026-01-08</td>
                          <td>Salary</td>
                          <td>INCOME</td>
                          <td className="text-end text-success">+ ₹ 60,000</td>
                        </tr>
                      </>
                    )}

                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center small text-muted">No transactions yet (showing sample rows)</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="text-end">
                <Link to="/financer/transactions" className="btn btn-sm btn-outline-primary">See all</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancerDashboard