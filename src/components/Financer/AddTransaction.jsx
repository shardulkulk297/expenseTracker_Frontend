
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddTransaction = ({ onAdded }) => {
  const [category, setCategory] = useState("");
  const [accountId, setAccountId] = useState("");
  const [transactionType, setTransactionType] = useState("EXPENSE");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8081/api/transaction/add",
        {
          category,
          account: selectedAccount,
          transactionType,
          description,
          amount: Number(amount),
        },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );

      toast.success("Transaction added successfully");
      if (onAdded) onAdded(response.data);

      // Reset form
      setCategory("");
      setAccountId("");
      setTransactionType("EXPENSE");
      setDescription("");
      setAmount("");
    } catch (error) {
      console.error(error);
      alert("Failed to add transaction");
    }
  };

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

  const handleAccountChange = (accountId) => {
    const account = accounts.find(a => a.id.toString() === accountId);
    console.log(account);
    setSelectedAccount(account);
  }

  return (
    <div className="card shadow-sm border-0 p-4 mb-4 rounded-4">

      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb bg-light px-3 py-2 rounded shadow-sm">
          <li className="breadcrumb-item">
            <a href="/financer" className="text-decoration-none">🏠 Dashboard</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Add Transaction
          </li>
        </ol>
      </nav>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-bold">Add Transaction</h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Category */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Category</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Groceries"
              required
            />
          </div>

          {/* Account ID */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Choose Account</label>
            <select
              type="text"
              className="form-control rounded-3"
              value={selectedAccount?.id}
              onChange={(e) => handleAccountChange(e.target.value)}
              required
              min="1"
            >
              <option value="" >
                -- Select a account --
              </option>

              {
                accounts.map((a, index) => (

                  <option key={a.id} value={a.id}>

                    {a.bankName}

                  </option>

                ))
              }

            </select>
          </div>

          {/* Transaction Type */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Transaction Type</label>
            <select
              className="form-select rounded-3"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              required
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          {/* Amount */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Amount</label>
            <input
              type="number"
              className="form-control rounded-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
              required
              min="0"
            />
          </div>

          {/* Description */}
          <div className="col-12">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control rounded-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows="3"
            />
          </div>
        </div>

        {/* Actions: auto-width button, right-aligned on md+ */}
        <div className="d-grid gap-2 d-md-flex align-content-center justify-content-md-center mt-4">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 rounded-3 fw-semibold"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;
