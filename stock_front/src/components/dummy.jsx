 import React, { useState ,useEffect} from "react";
 import "../style/Budget.css";
 import Navbar from "./Navbar";
 import { addExpense } from "../api/api.js";
 import { fetchExpenses } from "../api/api.js";
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import { faTrash } from "@fortawesome/free-solid-svg-icons";
 
 
 
 const Budget = () => {
   const [showBudgetForm, setShowBudgetForm] = useState(false);
   const [showExpenseForm, setShowExpenseForm] = useState(false);
   
   const [newBudget, setNewBudget] = useState({   
     budgetAmount: "", });
   const [expenses, setExpenses] = useState([{ name: "", amount: "" }]);
   const [expenseInputs, setExpenseInputs] = useState([{ name: "", amount: "" }]);
 
 
 //extraaa 
 
   const handleBudgetChange = (e) => {
     setNewBudget({ ...newBudget, [e.target.name]: e.target.value });
   };
 
   const handleBudgetSubmit = (e) => {
     e.preventDefault();
     console.log("Budget Added:", newBudget);
     setShowBudgetForm(false);
   };
 
  
   const handleExpenseChange = (index, field, value) => {
     const updatedInputs = [...expenseInputs];
     updatedInputs[index][field] = value;
     setExpenseInputs(updatedInputs);
   };
 
  
 
    const addExpenseField = () => {
     setExpenseInputs([...expenseInputs, { name: "", amount: "", time: new Date().toLocaleString() }]);
   };
  
   const handleDeleteInputExpense = (index) => {
     setExpenseInputs(expenseInputs.filter((_, i) => i !== index));
   };
   
   const handleDeleteTableExpense = (index) => {
     setExpenses(expenses.filter((_, i) => i !== index));
   };
   
   
 
   const handleExpenseSubmit = async () => {
     const isValid = expenseInputs.every(expense => expense.name.trim() !== "" && expense.amount.trim() !== "");
   
     if (!isValid) {
       alert("Please fill in all expense fields before saving.");
       return;
     }
   
     try {
       await Promise.all(expenseInputs.map(expense => addExpense(expense)));
       console.log("Expenses Added:", expenseInputs);
   
       // Refresh the expenses list
       loadExpenses();
   
       // Reset form state
       setExpenseInputs([{ name: "", amount: "" }]);
       setShowExpenseForm(false);
     } catch (error) {
       console.error("Failed to save expenses:", error.message);
     }
   };
 
   // Fetch from backend when the component mounts
 useEffect(() => {
   loadExpenses();
 }, []);
 
 const loadExpenses = async () => {
   try {
     const data = await fetchExpenses(); // Fetch data from backend
     setExpenses(data || []); // Ensure state doesn't break if response is undefined/null
     console.log("Expenses Loaded:", data); // Debugging log
   } catch (error) {
     console.error("Failed to load expenses:", error.response?.data || error.message);
   }
 };
 
 
   return (
     <div className="budget-body h-screen flex flex-col">
       {/* Navbar */}
       {/* <div className="fixed top-0 w-full z-50">
         <Navbar />
       </div> */}
 
       {/* Main Container */}
       <div className="flex flex-row h-[calc(100vh-80px)] pt-20">
         {/* Left Panel */}
         <div className="w-[45%] p-6 shadow-lg rounded-lg">
           <h2 className="text-xl font-bold mb-4">Budget</h2>
           <div className="flex space-x-8 mb-6">4
           <button
               onClick={() => setShowBudgetForm(true)}
               className="bg-blue-500 h-12 w-42 text-white px-4 py-2 rounded-md shadow-md"
             >
               + Add Budget
             </button>
  
 
 <button
   onClick={() => {
     setExpenseInputs([{ name: "", amount: "" }]); // Reset the form state
     setShowExpenseForm(true);
   }}
   className="bg-green-500 h-12 w-42 text-white px-4 py-2 rounded-md shadow-md"
 >
   + Add Expense
 </button>
           </div>
         </div>
 
         {/* Right Panel */}
         <div className="w-[55%] p-6  shadow-lg rounded-lg">
           <h2 className="text-xl font-bold mb-4">Expenses</h2>
 
           {expenses.length > 0 ? (
   <table className="w-full border-collapse border border-gray-300">
     <thead>
       <tr>
         <th className="border p-2">S.No</th>
         <th className="border p-2">Expense Name</th>
         <th className="border p-2">Amount</th>
         <th className="border p-2">Date & Time</th>
       </tr>
     </thead>
     <tbody>
             {expenses.map((expense, index) => (
               <tr key={index} className="text-center">
                 <td className="border p-2">{index + 1}</td>
                 <td className="border p-2">{expense.name}</td>
                 <td className="border p-2">₹{expense.amount}</td>
                 <td className="border p-2">{new Date(expense.date).toLocaleString()}</td>
                 <td className="border p-2">
                 <button onClick={() => handleDeleteTableExpense(index)} className="text-red-500 ml-2">
                 <FontAwesomeIcon icon={faTrash} size="lg" />   
                       </button>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
       ) : (
         <p>No expenses added yet.</p>
       )}
  
         </div>
       </div>
 
       {/* Budget Form */}
       {showBudgetForm && (
         <div className="overlay">
           <div className="form-container">
             <h2>Add Budget</h2>
             <form onSubmit={handleBudgetSubmit}>
               <input
                 type="number"
                 name="budgetAmount"
                 placeholder="Budget Amount"
                 value={newBudget.budgetAmount}
                 onChange={handleBudgetChange}
                 required
               />
               <div className="buttons">
                 <button type="submit">Add Budget</button>
                 <button type="button" onClick={() => setShowBudgetForm(false)}>Cancel</button>
               </div>
             </form>
           </div>
         </div>
       )}
 
       {/* Expense Form */}
       {showExpenseForm && (
         <div className="overlay">
           <div className="form-container">
             <h2>Add Expenses</h2>
  
 {expenseInputs.map((expense, index) => (
   <div key={index} className="expense-row">
     <input
       type="text"
       placeholder="Expense Name"
       value={expense.name}
       onChange={(e) => handleExpenseChange(index, "name", e.target.value)}
       required
     />
     <input
       type="number"
       placeholder="Amount"
       value={expense.amount}
       onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
       required
     />
     <button onClick={() => handleDeleteInputExpense (index)} className="text-red-500 ml-2">
       <FontAwesomeIcon icon={faTrash} />
     </button>
   </div>
 ))}
 
 
 
             <button className="add-expense-btn"
              onClick={addExpenseField}
           
              >+ Add More Expense</button>
             <div className="buttons">
               <button type="submit" onClick={handleExpenseSubmit}>Save</button>
               <button type="button" onClick={() => setShowExpenseForm(false)}>Cancel</button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default Budget;
 