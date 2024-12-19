import styled from "styled-components";
import { useEffect, useState } from "react";
import MonthNavigation from "../components/MonthNavigation";
import ExpenseList from "../components/ExpenseList";
import CreateExpense from "../components/CreateExpense";
import supabase from "../utils/supabase";
import getMonth from "../utils/getMonth";

// 코드 변경 테스트

const Container = styled.main`
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
`;

export const Section = styled.section`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
`;

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await supabase.from("expenses").select("*");
      if (error) {
        alert("데이터를 불러오는데 실패했습니다.");
      } else {
        setExpenses(data);
      }
    };
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter(
    (expense) => getMonth(expense.date) === selectedMonth
  );

  return (
    <Container>
      <MonthNavigation month={selectedMonth} setMonth={setSelectedMonth} />
      <CreateExpense
        setMonth={setSelectedMonth}
        expenses={expenses}
        setExpenses={setExpenses}
      />
      <ExpenseList expenses={filteredExpenses} />
    </Container>
  );
}
