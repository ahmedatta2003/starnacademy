/* ====== بيانات الطلاب ====== */
const students = {
  ahmed: {
    name: "أحمد محمود",
    parent: "محمود السيد",
    img: "images/student1.jpg",
    bio: "طالب متميز يتعلم البرمجة والألعاب، شارك في مشروع تفاعلي ونفّذه بنجاح.",
    skills: ["أساسيات الكمبيوتر", "Scratch", "مشروع تفاعلي", "الطباعة"]
  },

  mona: {
    name: "مونة علي",
    parent: "علي فوزي",
    img: "images/student2.jpg",
    bio: "مبدعة في التصميم وتحب الأعمال اليدوية والبرمجة.",
    skills: ["التصميم الرقمي", "إبداع", "مشروع تلوين تفاعلي"]
  }
};

/* ====== فتح البروفايل ====== */
function openProfile(id) {
  const s = students[id];
  if(!s) return;

  document.getElementById("profileImg").src = s.img;
  document.getElementById("profileImg").alt = s.name;
  document.getElementById("profileName").innerText = s.name;
  document.getElementById("profileParent").innerText = "ولي الأمر: " + s.parent;
  document.getElementById("profileBio").innerText = s.bio;

  const skillsList = document.getElementById("profileSkills");
  skillsList.innerHTML = "";
  s.skills.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = "• " + skill;
    skillsList.appendChild(li);
  });

  const modal = document.getElementById("profileModal");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden","false");
  // منع تمرير الخلفية
  document.body.style.overflow = "hidden";
}

/* ====== غلق البروفايل ====== */
function closeProfile() {
  const modal = document.getElementById("profileModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

/* ====== غلق بالضغط خارج المحتوى ====== */
document.addEventListener("click", function(e){
  const modal = document.getElementById("profileModal");
  if(modal.getAttribute("aria-hidden")==="false" && e.target === modal){
    closeProfile();
  }
});

/* ====== غلق بالـ ESC ====== */
document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){
    const modal = document.getElementById("profileModal");
    if(modal.getAttribute("aria-hidden")==="false") closeProfile();
  }
});
