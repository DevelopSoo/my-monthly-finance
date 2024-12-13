import { Section } from "../pages/Home";
import styled from "styled-components";
import { useState } from "react";
import supabase from "../utils/supabase";
import getMonth from "../utils/getMonth";

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-end;
`;

const InputGroupInline = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 120px;
  label {
    margin-bottom: 5px;
    font-size: 14px;
    color: #333;
    text-align: left;
  }
  input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
`;

const AddButton = styled.button`
  padding: 8px 20px;
  height: 34px;
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #0056b3;
  }
`;

export default function CreateExpense({ expenses, setExpenses, setMonth }) {
  const [newDate, setNewDate] = useState(`2024-01-01`);
  const [newItem, setNewItem] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAddExpense = async () => {
    // 날짜 형식 검사 -> 미리 제공해주기
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(newDate)) {
      alert("날짜를 YYYY-MM-DD 형식으로 입력해주세요.");
      return;
    }

    const parsedAmount = parseInt(newAmount, 10);
    if (!newItem || parsedAmount <= 0) {
      alert("유효한 항목과 금액을 입력해주세요.");
      return;
    }

    const { data, error } = await supabase
      .from("expenses")
      .insert({
        date: newDate,
        item: newItem,
        amount: parsedAmount,
        description: newDescription,
      })
      .select();

    if (error) {
      return alert("저장에 실패했습니다.");
    }

    // API 추가 후 화면도 변경하기
    setExpenses([...expenses, data[0]]);

    // 입력 초기화
    setNewDate(newDate); // 입력한 날짜 유지
    setNewItem("");
    setNewAmount("");
    setNewDescription("");

    // 저장 후 해당 월로 이동
    setMonth(getMonth(newDate));
  };

  return (
    <Section>
      <InputRow>
        <InputGroupInline>
          <label htmlFor="date">날짜</label>
          <input
            type="text"
            id="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </InputGroupInline>
        <InputGroupInline>
          <label htmlFor="item">항목</label>
          <input
            type="text"
            id="item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="지출 항목"
          />
        </InputGroupInline>
        <InputGroupInline>
          <label htmlFor="amount">금액</label>
          <input
            type="number"
            id="amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="지출 금액"
          />
        </InputGroupInline>
        <InputGroupInline>
          <label htmlFor="description">내용</label>
          <input
            type="text"
            id="description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="지출 내용"
          />
        </InputGroupInline>
        <AddButton onClick={handleAddExpense}>저장</AddButton>
      </InputRow>
    </Section>
  );
}
