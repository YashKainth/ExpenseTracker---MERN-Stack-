import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [Authenticated, setAuthenticated] = useState(false);
    const [loggedUser, setLoggedUser] = useState("");
    const [loggedEmail, setLoggedEmail] = useState("");

    // Set logged email
    const emaillogged = (email) => {
        setLoggedEmail(email);
    };

    // Add income
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            getIncomes(loggedEmail);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    // Get incomes
    const getIncomes = async (targetEmail) => {
        try {
            const response = await axios.get(`${BASE_URL}get-income`);
            const filteredIncomes = response.data.filter((income) => income.email === targetEmail);
            setIncomes(filteredIncomes);
        } catch (error) {
            console.error("Error fetching incomes:", error);
        }
    };

    // Delete income
    const deleteIncome = async (id) => {
        await axios.delete(`${BASE_URL}delete-income/${id}`);
        getIncomes(loggedEmail);
    };

    // Calculate total income
    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    // Add expense
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            getExpenses(loggedEmail);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    // Get expenses
    const getExpenses = async (targetEmail) => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            const filteredExpenses = response.data.filter((expense) => expense.email === targetEmail);
            setExpenses(filteredExpenses);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    // Delete expense
    const deleteExpense = async (id) => {
        await axios.delete(`${BASE_URL}delete-expense/${id}`);
        getExpenses(loggedEmail);
    };

    // Calculate total expenses
    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    // Calculate total balance
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Get transaction history
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 5);
    };

    // Get short transaction history
    const transactionHistory1 = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    // Authenticate user
    const authenticate = (state) => {
        setAuthenticated(state);
    };

    // Set user name
    const userName = (name) => {
        setLoggedUser(name);
    };

    // useEffect to fetch data
    useEffect(() => {
        const email = localStorage.getItem('loggedemail');
        emaillogged(email);
        if (loggedEmail) {
            getIncomes(loggedEmail);
            getExpenses(loggedEmail);
        }
    }, [loggedEmail]);

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError,
            authenticate,
            Authenticated,
            userName,
            loggedUser,
            emaillogged,
            loggedEmail,
            transactionHistory1
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
