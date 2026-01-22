import axios from 'axios';
import React, { useEffect, useState } from 'react'

const ViewTransactions = () => {

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {

      const getTransactions = async () => {
        try {
          const response = await axios.get("http://localhost:8081/api/transaction/getAll", {
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


  return (
    <div className='container'>

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

      <h1>All Transactions</h1>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Description</th>
            <th scope='col'>From</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>

          {
            transactions.map((t, index) => (

              <tr>
                <td>{t.id}</td>
                <th scope="row">{t.transactionDate}</th>
                <td>{t.description}</td>
                <td>{t.account.bankName}</td>
                <td>{t.amount} ₹</td>
              </tr>

            ))
          }


        </tbody>
      </table>






    </div>
  )
}

export default ViewTransactions