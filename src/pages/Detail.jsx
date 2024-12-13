import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../utils/supabase";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  label {
    margin-bottom: 5px;
    font-size: 14px;
    color: #333;
    text-align: left;
  }

  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.danger ? "#ff4d4d" : "#007bff")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.danger ? "#cc0000" : "#0056b3")};
  }
`;

const BackButton = styled(Button)`
  background-color: #6c757d;

  &:hover {
    background-color: #5a6268;
  }
`;

export default function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [date, setDate] = useState("");
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const getExpense = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("id", id);
      if (error) {
        alert("데이터를 불러오는데 실패했습니다.");
      } else {
        setDate(data[0].date);
        setItem(data[0].item);
        setAmount(data[0].amount);
        setDescription(data[0].description);
      }
    };
    getExpense();
  }, [id]);

  const editExpense = async () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      alert("날짜를 YYYY-MM-DD 형식으로 입력해주세요.");
      return;
    }
    if (!item || amount <= 0) {
      alert("유효한 항목과 금액을 입력해주세요.");
      return;
    }

    await supabase
      .from("expenses")
      .update({
        date: date,
        item: item,
        amount: amount,
        description: description,
      })
      .eq("id", id);
    navigate("/");
  };

  const deleteExpense = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) {
      return;
    }
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      alert("삭제에 실패했습니다.");
    } else {
      navigate("/");
    }
  };

  return (
    <Container>
      <InputGroup>
        <label htmlFor="date">날짜</label>
        <input
          type="text"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="YYYY-MM-DD"
        />
      </InputGroup>
      <InputGroup>
        <label htmlFor="item">항목</label>
        <input
          type="text"
          id="item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="지출 항목"
        />
      </InputGroup>
      <InputGroup>
        <label htmlFor="amount">금액</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="지출 금액"
        />
      </InputGroup>
      <InputGroup>
        <label htmlFor="description">내용</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="지출 내용"
        />
      </InputGroup>
      <ButtonGroup>
        <Button onClick={editExpense}>수정</Button>
        <Button danger="true" onClick={deleteExpense}>
          삭제
        </Button>
        <BackButton onClick={() => navigate(-1)}>뒤로 가기</BackButton>
      </ButtonGroup>
    </Container>
  );
}
