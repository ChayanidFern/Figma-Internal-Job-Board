const USER="Chaweewan";
const PASS="1234";

/* ===== SAMPLE JOB DATA (เหมือนเดิม) ===== */
let jobs=[
{
id:1,
title:"IT Support",
dept:"IT",
desc:"Provide technical support for internal staff and systems.",
status:"Open",
date:"12/02/2023"
},
{
id:2,
title:"Nursing Supervisor",
dept:"Nursing",
desc:"Supervise nursing staff and coordinate patient care.",
status:"Open",
date:"18/02/2023"
},
{
id:3,
title:"Data Analyst",
dept:"Analytics",
desc:"Analyze hospital operational data and generate reports.",
status:"Open",
date:"04/01/2023"
}
];

let editId=null;

/* ===== LOGIN ===== */
loginBtn.onclick=()=>{
  if(loginEmail.value===USER && loginPass.value===PASS){
    loginScreen.style.display="none";
    app.style.display="flex";
    showPage("jobs");
    renderJobs();
  } else {
    alert("Username or password incorrect");
  }
};

/* ===== PAGE SWITCH ===== */
function showPage(p){
  jobsPage.style.display=p==="jobs"?"block":"none";
  dashboardPage.style.display=p==="dashboard"?"block":"none";
  viewPage.style.display=p==="view"?"block":"none";
  createPage.style.display=p==="create"?"block":"none";
}

/* ===== SIDEBAR MENU ===== */
document.querySelectorAll(".menu-item").forEach(m=>{
  m.onclick=()=>{
    document.querySelectorAll(".menu-item").forEach(x=>x.classList.remove("active"));
    m.classList.add("active");
    showPage(m.dataset.page);
  }
});

/* ===== CREATE BUTTON ===== */
createBtn.onclick=()=>{
  editId=null;
  newTitle.value="";
  newDept.value="";
  newDesc.value="";
  showPage("create");
};

/* ===== SAVE JOB ===== */
saveJobBtn.onclick=()=>{
  if(editId){
    const j=jobs.find(x=>x.id===editId);
    j.title=newTitle.value;
    j.dept=newDept.value;
    j.desc=newDesc.value;
  } else {
    jobs.push({
      id:Date.now(),
      title:newTitle.value,
      dept:newDept.value,
      desc:newDesc.value,
      status:"Open",
      date:new Date().toLocaleDateString()
    });
  }
  renderJobs();
  showPage("jobs");
};

/* ===== RENDER TABLE ===== */
function renderJobs(){
  jobTable.innerHTML="";
  jobs.forEach(j=>{
    jobTable.innerHTML+=`
    <tr>
      <td>${j.title}</td>
      <td>${j.dept}</td>
      <td>${j.status}</td>
      <td><button onclick="viewJob(${j.id})">View</button></td>
      <td>${j.date}</td>
    </tr>`;
  });

  statTotal.textContent=jobs.length;
  statOpen.textContent=jobs.filter(x=>x.status==="Open").length;
  statClosed.textContent=jobs.filter(x=>x.status==="Archived").length;
}

/* ===== VIEW JOB ===== */
function viewJob(id){
  const j=jobs.find(x=>x.id===id);
  editId=id;
  viewTitle.textContent=j.title;
  viewBody.innerHTML=`
  <b>Department:</b> ${j.dept}<br><br>
  <b>Status:</b> ${j.status}<br><br>
  <b>Date:</b> ${j.date}<br><br>
  <b>Description:</b><br>${j.desc}
  `;
  showPage("view");
}

/* ===== EDIT ===== */
editBtn.onclick=()=>{
  const j=jobs.find(x=>x.id===editId);
  newTitle.value=j.title;
  newDept.value=j.dept;
  newDesc.value=j.desc;
  showPage("create");
};

/* ===== ARCHIVE ===== */
archiveBtn.onclick=()=>{
  const j=jobs.find(x=>x.id===editId);
  j.status="Archived";
  renderJobs();
  showPage("jobs");
};

/* ===== DELETE ===== */
deleteBtn.onclick=()=>{
  jobs=jobs.filter(x=>x.id!==editId);
  renderJobs();
  showPage("jobs");
};

/* ===== SEARCH ===== */
searchBtn.onclick=()=>{
  const q=searchInput.value.toLowerCase();
  jobTable.innerHTML="";
  jobs
  .filter(j=>j.title.toLowerCase().includes(q))
  .forEach(j=>{
    jobTable.innerHTML+=`
    <tr>
      <td>${j.title}</td>
      <td>${j.dept}</td>
      <td>${j.status}</td>
      <td><button onclick="viewJob(${j.id})">View</button></td>
      <td>${j.date}</td>
    </tr>`;
  });
};