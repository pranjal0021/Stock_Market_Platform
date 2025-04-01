import React, { useState, useEffect } from "react";
import "../style/Budget.css";
import Navbar from "./Navbar";
import { addExpense, fetchExpenses, fetchBudget, editBudget, addBudget, deleteBudget } from "../api/api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Budget = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [expenseInputs, setExpenseInputs] = useState([{ name: "", amount: "" }]);
  const [budget, setBudget] = useState(null);
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  useEffect(() => {
    loadBudget();
    loadExpenses();
  }, []);

  const loadBudget = async () => {
    try {
      const existingBudget = await fetchBudget();
      setBudget(existingBudget);
    } catch (error) {
      console.error("Failed to load budget", error);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (budget) {
      alert("You can only set one budget. Try editing it.");
      return;
    }
    try {
      const newBudget = await addBudget({ budgetAmount: newBudgetAmount });
      setBudget(newBudget);
      setShowBudgetForm(false);
      setNewBudgetAmount("");
    } catch (error) {
      console.error("Failed to add budget", error);
    }
  };

  const handleEditBudget = async () => {
    try {
      await editBudget(budget.id, parseFloat(newBudgetAmount));
      setBudget({ ...budget, budgetAmount: parseFloat(newBudgetAmount) });
      setIsEditing(false);
      setNewBudgetAmount("");
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const handleDeleteBudget = async () => {
    try {
      await deleteBudget(budget.id);
      setBudget(null);
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const loadExpenses = async () => {
    try {
      const data = await fetchExpenses();
      setExpenses(data || []);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    }
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedInputs = [...expenseInputs];
    updatedInputs[index][field] = value;
    setExpenseInputs(updatedInputs);
  };

  const addExpenseField = () => {
    setExpenseInputs([...expenseInputs, { name: "", amount: "" }]);
  };

  const handleDeleteInputExpense = (index) => {
    setExpenseInputs(expenseInputs.filter((_, i) => i !== index));
  };

  const handleDeleteTableExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleExpenseSubmit = async () => {
    if (expenseInputs.some(expense => !expense.name.trim() || !expense.amount.trim())) {
      alert("Please fill in all expense fields before saving.");
      return;
    }
    try {
      await Promise.all(expenseInputs.map(expense => addExpense(expense)));
      loadExpenses();
      setExpenseInputs([{ name: "", amount: "" }]);
      setShowExpenseForm(false);
    } catch (error) {
      console.error("Failed to save expenses:", error);
    }
  };

  return (
    <div className="budget-body h-screen flex flex-col">
      <div className="flex flex-row h-[calc(100vh-80px)] pt-20">
        <div className="w-[45%] p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Budget</h2>
          <div className="flex space-x-8 mb-6">
            {!budget && (
              <button onClick={() => setShowBudgetForm(true)} className="bg-blue-500 h-12 w-42 text-white px-4 py-2 rounded-md shadow-md">
                <FaPlus /> Add Budget
              </button>
            )}
            <button onClick={() => setShowExpenseForm(true)} className="bg-green-500 h-12 w-42 text-white px-4 py-2 rounded-md shadow-md">
              <FaPlus /> Add Expense
            </button>
          </div>
        </div>
        <div className="w-[55%] p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Expenses</h2>
          {expenses.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border p-2">S.No</th>
                  <th className="border p-2">Expense Name</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Date & Time</th>
                  <th className="border p-2">Actions</th>
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
    </div>
  );
};

export default Budget;
