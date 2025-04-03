import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

function App() {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [isDanggeun2, setIsDanggeun2] = useState(false);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbwirTulMMCxIbljHXoEfp5xBuc2CPn_v_n8qR2GF7hPYpwe0TS9RxHlfPf_jd2yJdK1/exec')
      .then(res => res.json())
      .then(data => {
        const parsed = data.map(r => ({
          id: Date.now() + Math.random(),
          date: r[0].includes('T') ? r[0].split('T')[0] : r[0],
          category: r[1],
          subCategory: r[2],
          item: r[3],
          amount: r[1] === '소득' ? parseInt(r[4]) : -parseInt(r[4]),
          who: r[5]
        }));
        setRecords(parsed);
      })
      .catch(err => console.error('불러오기 실패:', err));
  }, []);

  let balance = 0;
  const recordsWithBalance = [...records].reverse().map((rec) => {
    balance += rec.amount;
    return { ...rec, balance };
  }).reverse();

  const categories = [
    '소득', '생활비', '식비', '공과금', '교통비', '지출 이월',
    '유흥/사치', '저축', '대출', '경조사비', '데이트'
  ];
  const foodSubCategories = ['외식', '배달', '간식', '주류', '식재료'];

  const isFood = category === '식비';
  const isIncome = category === '소득';

  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#FF6666', '#AA99FF', '#33CC99', '#FF99AA', '#66B2FF', '#FFCC00'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !category || !item || !amount) return alert('모든 항목을 입력해주세요!');
    const amt = parseInt(amount.replace(/,/g, ''), 10);
    const signedAmount = isIncome ? amt : -amt;
  
    try {
      const form = new URLSearchParams();
      form.append('date', date);
      form.append('category', category);
      form.append('subCategory', subCategory);
      form.append('item', item);
      form.append('amount', amt);
      form.append('who', isDanggeun2 ? '이당근' : '민당근');
  
      const response = await fetch('https://script.google.com/macros/s/AKfycbwirTulMMCxIbljHXoEfp5xBuc2CPn_v_n8qR2GF7hPYpwe0TS9RxHlfPf_jd2yJdK1/exec', {
        method: 'POST',
        body: form  // 👈 JSON 대신 form 데이터 전송!
      });
  
      const text = await response.text();
      console.log('🔥 응답:', text);

      const newRecord = {
        id: Date.now(),
        date,
        category,
        subCategory: isFood ? subCategory : '',
        item,
        who: isDanggeun2 ? '이당근' : '민당근',
        amount: signedAmount
      };
      setRecords([newRecord, ...records]);
      setDate('');
      setCategory('');
      setSubCategory('');
      setItem('');
      setAmount('');
      setIsDanggeun2(false);
    } catch (error) {
      console.error('Google Sheets 저장 실패:', error);
      alert('Google Sheets에 데이터를 추가하는 데 실패했어요!');
    }
  };

  const getExpenseByCategory = () => {
    const result = {};
    records.forEach(r => {
      if (r.amount < 0 && r.category !== '소득') {
        result[r.category] = (result[r.category] || 0) + Math.abs(r.amount);
      }
    });
    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const getFoodSubCategory = () => {
    const result = {};
    records.forEach(r => {
      if (r.amount < 0 && r.category === '식비') {
        result[r.subCategory] = (result[r.subCategory] || 0) + Math.abs(r.amount);
      }
    });
    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const getSpendingByWho = () => {
    const result = { 이당근: 0, 민당근: 0 };
    records.forEach(r => {
      if (r.amount < 0) {
        result[r.who] += Math.abs(r.amount);
      }
    });
    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>당근 가계부 🥕</h1>

      {/* 입력 폼 + 소비 항목 분포 */}
      <div style={{ maxWidth: '900px', margin: '0 auto'}}>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(''); }}>
            <option value="">항목 선택</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} disabled={!isFood}>
            <option value="">세부 항목 선택</option>
            {foodSubCategories.map(s => <option key={s}>{s}</option>)}
          </select>
          <input type="text" value={item} placeholder="소비 항목 이름" onChange={(e) => setItem(e.target.value)} />
          <input type="text" value={amount} placeholder="금액 (숫자만)" onChange={(e) => setAmount(e.target.value)} />
          <label><input type="checkbox" checked={isDanggeun2} onChange={(e) => setIsDanggeun2(e.target.checked)} /> 이당근이에요</label>
          <button type="submit">추가</button>
        </form>

        <div style={{ flex: 1, overflowX: 'auto' }}>
        <h3 style={{ textAlign: 'center' }}>소비 항목 분포</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={getExpenseByCategory()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {getExpenseByCategory().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div></div>

      <div style={{
        width: '1200px',
        margin: '2rem auto',
        }}>
      {/* 소비 내역 테이블 + 월별 소비 추이 (placeholder) */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 3 }}>
          <h3 style={{ textAlign: 'center' }}>소비 내역</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }} border="1">
            <thead>
              <tr>
                <th>날짜</th>
                <th>항목</th>
                <th>세부</th>
                <th>이름</th>
                <th>소비 내역</th>
                <th>금액</th>
                <th>잔액</th>
              </tr>
            </thead>
            <tbody>
              {recordsWithBalance.length === 0 ? (
                <tr><td colSpan="7">데이터가 없습니다</td></tr>
              ) : (
                recordsWithBalance.map((rec) => (
                <tr key={rec.id}>
              <td>{rec.date}</td>
              <td>{rec.category}</td>
              <td>{rec.subCategory}</td>
              <td>{rec.who}</td>
              <td>{rec.item}</td>
              <td>{Math.abs(rec.amount).toLocaleString()}원</td>
              <td style={{ color: rec.balance < 0 ? 'red' : 'black' }}>
                {rec.balance.toLocaleString()}원</td>
              </tr>
              ))
              )}
              </tbody>
          </table>
        </div>

      {/* 식비 세부 + 소비 주체 바차트 */}
        <div style={{ flex: 1 }}>
          <h4 style={{ textAlign: 'center' }}>식비 세부 항목</h4>
          <ResponsiveContainer width="150%" height={200}>
            <PieChart>
              <Pie data={getFoodSubCategory()} dataKey="value" nameKey="name" outerRadius={60} label>
                {getFoodSubCategory().map((entry, index) => (
                  <Cell key={`cell-sub-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ textAlign: 'center' }}>소비 주체 별 분포</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getSpendingByWho()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
              </div></div>
              </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h3>월별 소비 추이</h3>
          <div style={{ border: '1px dashed gray', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            (추후 구현 예정 차트 자리)
          </div>
        </div>
      </div>
      </div>
  );
}

export default App;