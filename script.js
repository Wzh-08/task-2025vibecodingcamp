document.addEventListener("DOMContentLoaded", function () {
  const birthInput = document.getElementById("birthdate");
  const ageOutput = document.getElementById("humanAge");
  const stageOutput = document.getElementById("lifeStage");
  const btn = document.getElementById("calculateBtn");
  const clearBtn = document.getElementById("clearBtn"); // 清空按鈕

  // 取得包住 input 的外層，用來加上 has-value class
  const dateWrapper = document.querySelector(".date-input-wrapper");

  function togglePlaceholder() {
    if (!dateWrapper) return;

    if (birthInput.value) {
      dateWrapper.classList.add("has-value");
    } else {
      dateWrapper.classList.remove("has-value");
    }
  }

  // 一開始先判斷一次（避免重新整理後，有值但沒藏起來）
  togglePlaceholder();

  // 每次輸入或選日期時都更新
  birthInput.addEventListener("input", togglePlaceholder);
  birthInput.addEventListener("change", togglePlaceholder);

  btn.addEventListener("click", () => {
    const value = birthInput.value;

    if (!value) {
      alert('請先選擇出生日期再按下「換算」。');
      return;
    }

    const age = calculateAge(value);

    if (age < 0) {
      alert("出生日期不能晚於今天，請重新輸入。");
      ageOutput.value = "";
      stageOutput.value = "";
      togglePlaceholder();
      return;
    }

    ageOutput.value = age === 0 ? "未滿 1 歲" : `${age} 歲`;
    stageOutput.value = getLifeStage(age);
  });

  // ⭐ 清空按鈕行為
  clearBtn.addEventListener("click", () => {
    birthInput.value = "";
    ageOutput.value = "";
    stageOutput.value = "";
    togglePlaceholder(); // 讓 YYYY/MM/DD 回來
  });

  function calculateAge(birthString) {
    const today = new Date();
    const birthDate = new Date(birthString);

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
});
