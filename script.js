document.addEventListener("DOMContentLoaded", function () {
  const birthInput = document.getElementById("birthdate");
  const ageOutput = document.getElementById("humanAge");
  const stageOutput = document.getElementById("lifeStage");
  const calcBtn = document.getElementById("calculateBtn");
  const saveBtn = document.getElementById("saveBtn");
  const clearBtn = document.getElementById("clearBtn");

  const dateWrapper = document.querySelector(".date-input-wrapper");
  const STORAGE_KEY = "dogAgeRecord";

  /* ---------- 共用小工具 ---------- */

  function togglePlaceholder() {
    if (!dateWrapper) return;
    if (birthInput.value) {
      dateWrapper.classList.add("has-value");
    } else {
      dateWrapper.classList.remove("has-value");
    }
  }

  function calculateAgeFromInput() {
    // 使用 valueAsDate 會比較穩定
    const birthDate = birthInput.valueAsDate;
    if (!birthDate) {
      return NaN;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  function getLifeStage(age) {
    if (age < 0) return "時間旅行中？請重新輸入日期";
    if (age < 7) return "幼兒～國小低年級";
    if (age < 12) return "國小中高年級";
    if (age < 15) return "國中生";
    if (age < 18) return "高中生";
    if (age < 25) return "大學生／剛出社會";
    if (age < 40) return "穩定大人階段";
    if (age < 60) return "熟練中年階段";
    return "優雅熟齡階段";
  }

  /* ---------- 讀取 localStorage ---------- */

  function loadSavedData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      if (data.birthdate) {
        birthInput.value = data.birthdate;
      }
      if (data.humanAge) {
        ageOutput.value = data.humanAge;
      }
      if (data.lifeStage) {
        stageOutput.value = data.lifeStage;
      }
      togglePlaceholder();
    } catch (e) {
      console.error("解析儲存資料時發生錯誤：", e);
    }
  }

  /* ---------- 按鈕行為 ---------- */

  function handleCalculate() {
    if (!birthInput.value) {
      alert('請先選擇出生日期再按下「換算」。');
      return;
    }

    const age = calculateAgeFromInput();

    if (isNaN(age)) {
      alert("日期格式有問題，請重新選擇日期。");
      return;
    }

    if (age < 0) {
      alert("出生日期不能晚於今天，請重新輸入。");
      ageOutput.value = "";
      stageOutput.value = "";
      return;
    }

    ageOutput.value = age === 0 ? "未滿 1 歲" : `${age} 歲`;
    stageOutput.value = getLifeStage(age);
  }

  function handleSave() {
    // 必須先有換算結果才允許儲存
    if (!birthInput.value || !ageOutput.value || !stageOutput.value) {
      alert('請先選擇日期並按「換算」，再按「儲存」。');
      return;
    }

    const data = {
      birthdate: birthInput.value, // 會是 YYYY-MM-DD 格式
      humanAge: ageOutput.value,
      lifeStage: stageOutput.value,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    alert("已儲存狗狗年齡記錄。");
  }

  function handleClear() {
    birthInput.value = "";
    ageOutput.value = "";
    stageOutput.value = "";
    localStorage.removeItem(STORAGE_KEY);
    togglePlaceholder();
  }

  /* ---------- 事件綁定 ---------- */

  calcBtn.addEventListener("click", handleCalculate);
  saveBtn.addEventListener("click", handleSave);
  clearBtn.addEventListener("click", handleClear);

  birthInput.addEventListener("input", togglePlaceholder);
  birthInput.addEventListener("change", togglePlaceholder);

  // 初始化：檢查有沒有舊紀錄
  togglePlaceholder();
  loadSavedData();
});
