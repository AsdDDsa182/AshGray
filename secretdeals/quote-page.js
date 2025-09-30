(function(){
  'use strict';

  // ===== 설정 (메인 스크립트에서 복사) =====
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRAXNYclCAqOkzqXe8fIHc6Md0nQOIXcJeAC13xjKqobD3t7jdDZ-PjmtULNFJ5ZZr/exec';

  // ===== 유틸리티 함수 (메인 스크립트에서 복사) =====
  const fmtKRW = n => new Intl.NumberFormat('ko-KR',{style:'currency',currency:'KRW',maximumFractionDigits:0}).format(n);
  const $ = s => document.querySelector(s);
  
  const toastEl = $('#toastNotification');
  let toastTimeout;
  let toastResetTimeout;

  function showToast(message) { 
    if (!toastEl) return; 
    clearTimeout(toastTimeout); 
    clearTimeout(toastResetTimeout); 
    const _show = () => { 
      toastEl.textContent = message; 
      toastEl.classList.add('show'); 
      toastTimeout = setTimeout(() => { toastEl.classList.remove('show'); }, 3000); 
    }; 
    if (toastEl.classList.contains('show')) { 
      toastEl.classList.remove('show'); 
      toastResetTimeout = setTimeout(_show, 100); 
    } else { _show(); } 
  }

  // ===== 페이지 로직 =====
  const quote = JSON.parse(localStorage.getItem('quoteForSubmission') || '{"items":[]}');
  const quoteType = localStorage.getItem('quoteType') || 'sale';
  const rentalDuration = localStorage.getItem('rentalDuration') || '24';
  const totalKRW = quote.items.reduce((s,x)=>s+x.price*x.qty,0);

  function populateQuoteList() {
    const listEl = $('#quoteItemsList');
    const boxEl = listEl.closest('.quote-summary-box');
    if (!listEl || !boxEl) return;
    
    listEl.innerHTML = '';
    
    if (quote.items.length > 0) {
      quote.items.forEach(item => {
        const li = document.createElement('li');
        const qtyText = item.qty > 1 ? ` (수량: ${item.qty})` : '';
        li.textContent = `${item.title}${qtyText}`;
        listEl.appendChild(li);
      });
      boxEl.hidden = false;
    } else {
      boxEl.hidden = true;
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector(`#fName`).value.trim();
    const email = form.querySelector(`#fEmail`).value.trim();
    const tel = form.querySelector(`#fTel`).value.trim();
    const company = form.querySelector(`#fCompany`).value.trim();
    const memo = form.querySelector(`#fMemo`).value.trim();
    
    const items = quote.items;
    const isQuote = items.length > 0;
    const quoteTypeText = quoteType === 'rental' ? '렌탈' : '구매';
    const durationText = quoteType === 'rental' ? (rentalDuration === 'etc' ? '기간 협의' : `${rentalDuration}개월`) : '';
    
    const subject = `[비밀특가 ${quoteTypeText}견적요청] ${name}`;
    const quoteText = isQuote ? `\n\n--- 담긴상품 (${quoteTypeText} ${durationText}) ---\n${items.map(x => `- ${x.title} x ${x.qty} = ${x.price > 0 ? fmtKRW(x.price * x.qty) : '별도문의'}${x.isRental && x.price > 0 ? '/월' : ''}`).join('\n')}\n\n${quoteType === 'rental' ? '월 예상 총액' : '총액'}: ${fmtKRW(totalKRW)}` : '';
    const copiedText = `${subject}\n\n--- 고객정보 ---\n이름: ${name}\n이메일: ${email}\n전화: ${tel}\n회사/지점: ${company || '-'}\n요청사항: ${memo || '-'}` + quoteText;
    
    const fd = new FormData();
    fd.append('name', name); fd.append('email', email); fd.append('tel', tel);
    fd.append('company', company); fd.append('memo', memo); fd.append('totalKRW', String(totalKRW));
    fd.append('itemsJSON', JSON.stringify(items)); fd.append('copiedText', copiedText);
    
    const btn = form.querySelector('button[type="submit"]');
    const oldLabel = btn.textContent;
    btn.textContent = '전송 중…';
    btn.disabled = true;

    try {
      const res = await fetch(SCRIPT_URL, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = (await res.text() || '').trim();
      if (text !== 'Success') throw new Error(`Unexpected response: ${text}`);
      
      showToast('문의가 성공적으로 접수되었습니다. 잠시 후 메인 페이지로 이동합니다.');
      localStorage.removeItem('quoteForSubmission');
      localStorage.removeItem('quoteType');
      localStorage.removeItem('rentalDuration');
      form.reset();
      
      setTimeout(() => { window.location.href = 'index.html'; }, 2500);

    } catch (e) {
      console.error('submit error:', e);
      showToast('전송 실패. 잠시 후 다시 시도해주세요.');
      btn.textContent = oldLabel;
      btn.disabled = false;
    }
  }

  // ===== 초기화 =====
  document.addEventListener('DOMContentLoaded', () => {
    if (quote.items.length === 0) {
      alert('견적서에 담긴 상품이 없습니다. 메인 페이지로 돌아갑니다.');
      window.history.back();
      return;
    }
    populateQuoteList();
    $('#quoteForm').addEventListener('submit', handleFormSubmit);
    $('#cancelBtn').addEventListener('click', () => { window.history.back(); });
  });
})();