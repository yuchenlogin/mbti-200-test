(() => {
  const { metas, questions } = window.MBTI_DATA;
  const state = { current: 0, answers: Array(questions.length).fill(null), transitioning: false };
  const views = { intro: document.querySelector('#intro-view'), quiz: document.querySelector('#quiz-view'), result: document.querySelector('#result-view') };
  const els = {
    start: document.querySelector('#start-button'), quit: document.querySelector('#quit-button'), restart: document.querySelector('#restart-button'),
    progressLabel: document.querySelector('#progress-label'), progressPercent: document.querySelector('#progress-percent'), progressBar: document.querySelector('#progress-bar'),
    questionNumber: document.querySelector('#question-number'), questionText: document.querySelector('#question-text'), optionA: document.querySelector('#option-a'), optionB: document.querySelector('#option-b'), options: [...document.querySelectorAll('.answer-option')], prev: document.querySelector('#prev-button'), answeredCount: document.querySelector('#answered-count'),
    resultType: document.querySelector('#result-type'), resultName: document.querySelector('#result-name'), resultSummary: document.querySelector('#result-summary'), resultDescription: document.querySelector('#result-description'), typeTags: document.querySelector('#type-tags'), dimensionResults: document.querySelector('#dimension-results-list'), resultDate: document.querySelector('#result-date'), resultNote: document.querySelector('.result-note')
  };
  const typeProfiles = {
    ESTJ:['总经理型','务实、果断、有组织，擅长管理和执行，重视规则和效率。',['务实','果断','组织力']], ESTP:['企业家型','外向、务实、灵活，擅长应对突发情况，喜欢冒险和挑战。',['灵活','行动派','挑战者']], ESFJ:['执政官型','热情、负责、重视人际关系，擅长照顾他人，维护团队和谐。',['热情','责任感','共情']], ESFP:['表演者型','外向、乐观、热爱生活，擅长表达和社交，享受当下。',['乐观','表达力','体验派']],
    ENTJ:['指挥官型','自信、果断、有远见，擅长战略规划和领导，追求目标。',['远见','领导力','目标感']], ENTP:['辩论家型','聪明、灵活、喜欢挑战，擅长逻辑思辨和创新，思维活跃。',['创新','思辨','机敏']], ENFJ:['教育家型','热情、有同理心、有领导力，擅长激励他人，重视价值观。',['激励','同理心','领导力']], ENFP:['竞选者型','外向、乐观、有创造力，擅长社交和表达，追求自由和新鲜感。',['创造力','热情','自由']],
    ISTJ:['物流师型','严谨、可靠、务实，擅长组织和执行，重视传统和规则。',['严谨','可靠','执行力']], ISTP:['鉴赏家型','冷静、务实、动手能力强，擅长分析和解决问题，喜欢独处。',['冷静','实干','分析力']], ISFJ:['守卫者型','温柔、细心、有责任感，擅长照顾他人，重视安全感。',['细心','可靠','照顾者']], ISFP:['探险家型','内向、敏感、热爱自由，擅长艺术和感知，享受当下的体验。',['敏感','审美','自由']],
    INTJ:['建筑师型','聪明、独立、有远见，擅长战略规划和创新，追求完美。',['独立','远见','完美主义']], INTP:['逻辑学家型','冷静、理性、思维缜密，擅长抽象思考和研究，喜欢独处。',['理性','好奇','研究者']], INFJ:['咨询师型','温柔、有洞察力、有同理心，擅长理解他人，重视价值观。',['洞察','同理心','理想主义']], INFP:['调停者型','内向、敏感、有创造力，擅长思考和共情，追求内心的和谐。',['共情','创造力','和谐']]
  };
  const showView = (name) => Object.entries(views).forEach(([key, node]) => { node.hidden = key !== name; });
  const notify = (message) => { els.toast.textContent = message; els.toast.classList.add('show'); clearTimeout(notify.timer); notify.timer = setTimeout(() => els.toast.classList.remove('show'), 2200); };
  const answeredTotal = () => state.answers.filter(Boolean).length;
  const renderQuestion = () => {
    const q = questions[state.current]; const meta = metas[q.dimension]; const answer = state.answers[state.current]; const number = String(state.current + 1).padStart(3, '0');
    els.progressLabel.textContent = `QUESTION ${number} / 200`; els.progressPercent.textContent = `${Math.round((state.current / questions.length) * 100)}%`; els.progressBar.style.width = `${(state.current / questions.length) * 100}%`;
    els.questionNumber.textContent = String(state.current + 1).padStart(3, '0'); els.questionText.textContent = '哪一种描述更接近你？'; els.optionA.textContent = q.a; els.optionB.textContent = q.b;
    els.options.forEach((option) => { const selected = option.dataset.answer === answer; option.classList.toggle('selected', selected); option.classList.toggle('is-disabled', state.transitioning); option.setAttribute('aria-checked', selected ? 'true' : 'false'); option.querySelector('.option-check').textContent = selected ? '●' : '○'; });
    els.prev.disabled = state.current === 0 || state.transitioning; els.prev.style.opacity = state.current === 0 || state.transitioning ? '.35' : '1'; els.answeredCount.textContent = `${answeredTotal()} / 200 已完成`;
  };
  const choose = (answer) => {
    if (state.transitioning) return;
    state.answers[state.current] = answer; state.transitioning = true; renderQuestion();
    window.setTimeout(() => { state.transitioning = false; if (state.current < questions.length - 1) { state.current += 1; renderQuestion(); window.scrollTo({ top: 0, behavior: 'smooth' }); } else renderResult(); }, 260);
  };
  const goPrev = () => { if (state.current > 0 && !state.transitioning) { state.current -= 1; renderQuestion(); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const getScores = () => metas.map((meta, dimension) => { let a = 0; questions.forEach((q, i) => { if (q.dimension === dimension && state.answers[i] === 'A') a += 1; }); return { ...meta, aLetter: meta.a, bLetter: meta.b, a, b: 50 - a, winner: a >= 25 ? meta.a : meta.b, percentage: Math.max(a, 50 - a) / 50 }; });
  const renderResult = () => {
    const scores = getScores(); const type = scores.map((score) => score.winner).join(''); const profile = typeProfiles[type] || ['探索者','你的四个维度呈现出独特而均衡的组合，继续观察它们在不同情境下的变化。',['自洽','开放','探索']];
    els.resultType.textContent = type; els.resultName.textContent = `${type} · ${profile[0]}`; els.resultSummary.textContent = `你的自然倾向组合为 ${type}，这是一份关于偏好的快照。`; els.resultDescription.textContent = profile[1]; els.typeTags.innerHTML = profile[2].map((tag) => `<span class="type-tag">${tag}</span>`).join('');
    els.dimensionResults.innerHTML = scores.map((score) => { const winnerCount = Math.max(score.a, score.b); const balanced = Math.abs(score.a - score.b) <= 5; return `<div class="dimension-result"><div class="dimension-result-head"><span class="dimension-result-label">${score.short}</span><span class="dimension-result-score">${balanced ? '均衡倾向' : `${winnerCount} / 50`}</span></div><div class="dimension-result-pair"><span><strong>${score.a}</strong> ${score.aLetter}</span><span><strong>${score.b}</strong> ${score.bLetter}</span></div><div class="dimension-bar"><span class="${score.a >= score.b ? 'active-a' : ''}" style="opacity:${Math.max(score.a / 50, .08)}"></span><span class="${score.b > score.a ? 'active-b' : ''}" style="opacity:${Math.max(score.b / 50, .08)}"></span></div></div>`; }).join('');
    els.resultDate.textContent = new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); showView('result'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const reset = () => { state.current = 0; state.answers.fill(null); state.transitioning = false; renderQuestion(); showView('quiz'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  els.start.addEventListener('click', reset); els.restart.addEventListener('click', () => { state.current = 0; state.answers.fill(null); state.transitioning = false; showView('intro'); window.scrollTo({ top: 0, behavior: 'smooth' }); }); els.quit.addEventListener('click', () => { if (answeredTotal() && !confirm('退出后当前作答不会保留，确定退出吗？')) return; showView('intro'); }); els.options.forEach((option) => option.addEventListener('click', () => choose(option.dataset.answer))); els.prev.addEventListener('click', goPrev);
  document.addEventListener('keydown', (event) => { if (views.quiz.hidden) return; if (event.key.toLowerCase() === 'a' || event.key === '1') choose('A'); if (event.key.toLowerCase() === 'b' || event.key === '2') choose('B'); if (event.key === 'ArrowLeft') goPrev(); });
  renderQuestion(); showView('intro');
})();
