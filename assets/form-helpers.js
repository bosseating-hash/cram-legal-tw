/**
 * 補教業法務支援站 - 共用表單工具
 *
 * 提供：
 * 1. initAddressSelector(cityId, districtId) — 縣市/區動態聯動（依 window.TW_ADDRESS）
 * 2. initMinguoDateSelector(yearId, monthId, dayId, [yearRange]) — 民國年/月/日 select 初始化
 * 3. bindOtherFallback(selectId, otherTextId) — 選「其他」時顯示 text input
 * 4. getValueWithOther(selectId, otherTextId) — 統一取值（其他則取 text）
 * 5. combineAddress(cityId, districtId, detailId) — 組合三段地址字串
 */

const OTHER_VALUE = '__other__';

/**
 * 縣市/區聯動下拉
 * 使用前需在 <head> 載入 tw-address-data.js（賦值 window.TW_ADDRESS）
 */
function initAddressSelector(cityId, districtId) {
  const citySel = document.getElementById(cityId);
  const distSel = document.getElementById(districtId);
  if (!citySel || !distSel) {
    console.error('initAddressSelector: 找不到 select', cityId, districtId);
    return;
  }
  if (!window.TW_ADDRESS) {
    console.error('initAddressSelector: window.TW_ADDRESS 未載入');
    return;
  }

  // 填縣市
  citySel.innerHTML = '<option value="">請選擇縣市</option>';
  Object.keys(window.TW_ADDRESS).forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    citySel.appendChild(opt);
  });

  // 初始 district 為禁用狀態
  function resetDistrict(placeholder) {
    distSel.innerHTML = '<option value="">' + placeholder + '</option>';
    distSel.disabled = true;
  }
  resetDistrict('請先選縣市');

  citySel.addEventListener('change', () => {
    const city = citySel.value;
    if (!city || !window.TW_ADDRESS[city]) {
      resetDistrict('請先選縣市');
      return;
    }
    distSel.innerHTML = '<option value="">請選擇鄉鎮市區</option>';
    window.TW_ADDRESS[city].forEach(district => {
      const opt = document.createElement('option');
      opt.value = district;
      opt.textContent = district;
      distSel.appendChild(opt);
    });
    distSel.disabled = false;
  });

  // 觸發一次（若 localStorage 載回已選縣市）
  if (citySel.value) {
    citySel.dispatchEvent(new Event('change'));
  }
}

/**
 * 民國年/月/日 select 初始化
 * yearRange: [起始, 結束]（民國年），預設 [113, 118]（律師指定）
 */
function initMinguoDateSelector(yearId, monthId, dayId, yearRange) {
  const yearEl = document.getElementById(yearId);
  const monthEl = document.getElementById(monthId);
  const dayEl = document.getElementById(dayId);
  if (!yearEl || !monthEl || !dayEl) {
    console.error('initMinguoDateSelector: 找不到 select', yearId, monthId, dayId);
    return;
  }
  const [yStart, yEnd] = yearRange || [113, 118];

  yearEl.innerHTML = '<option value="">年</option>';
  for (let y = yStart; y <= yEnd; y++) {
    const opt = document.createElement('option');
    opt.value = String(y);
    opt.textContent = String(y) + ' 年';
    yearEl.appendChild(opt);
  }

  monthEl.innerHTML = '<option value="">月</option>';
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement('option');
    const mm = m < 10 ? '0' + m : String(m);
    opt.value = mm;
    opt.textContent = String(m) + ' 月';
    monthEl.appendChild(opt);
  }

  dayEl.innerHTML = '<option value="">日</option>';
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option');
    const dd = d < 10 ? '0' + d : String(d);
    opt.value = dd;
    opt.textContent = String(d) + ' 日';
    dayEl.appendChild(opt);
  }
}

/**
 * 把「其他（自填）」option 綁定到 text input 顯示邏輯
 * select 值 = OTHER_VALUE 時顯示 text，否則隱藏並清空 text
 */
function bindOtherFallback(selectId, otherTextId) {
  const sel = document.getElementById(selectId);
  const txt = document.getElementById(otherTextId);
  if (!sel || !txt) {
    console.error('bindOtherFallback: 找不到', selectId, otherTextId);
    return;
  }
  function update() {
    if (sel.value === OTHER_VALUE) {
      txt.style.display = 'block';
      txt.focus();
    } else {
      txt.style.display = 'none';
      txt.value = '';
    }
  }
  sel.addEventListener('change', update);
  // 初始狀態
  update();
}

/**
 * 取值：select 若選「其他」則回傳 text input 值，否則回傳 select 值
 */
function getValueWithOther(selectId, otherTextId) {
  const sel = document.getElementById(selectId);
  const txt = document.getElementById(otherTextId);
  if (!sel) return '';
  if (sel.value === OTHER_VALUE) {
    return (txt ? txt.value.trim() : '');
  }
  return sel.value.trim();
}

/**
 * 組合三段地址（縣市 + 鄉鎮市區 + 詳細）
 */
function combineAddress(cityId, districtId, detailId) {
  const city = document.getElementById(cityId).value.trim();
  const district = document.getElementById(districtId).value.trim();
  const detail = document.getElementById(detailId).value.trim();
  return city + district + detail;
}
