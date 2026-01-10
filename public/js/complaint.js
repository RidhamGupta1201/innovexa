document.addEventListener("DOMContentLoaded", () => {

  const openBtn = document.getElementById("openFormBtn");
  const form = document.getElementById("complaintForm");
  const quote = document.getElementById("quotePage");
  const backBtn = document.getElementById("backBtn");
  const submitBtn = document.getElementById("submitBtn");

  const subjectInput = document.getElementById("subject");
  const concernInput = document.getElementById("concern");
  const problemInput = document.getElementById("problem");
  const suggestionInput = document.getElementById("suggestion");

  const complaintsList = document.getElementById("complaintsList");

  /* OPEN FORM */
  openBtn.onclick = () => {
    form.classList.remove("hidden");
    quote.style.display = "none";
  };

  /* BACK ARROW */
  backBtn.onclick = () => {
    form.classList.add("hidden");
    quote.style.display = "block";
  };

  /* SUBMIT COMPLAINT */
  submitBtn.onclick = () => {
    const complaint = {
      subject: subjectInput.value.trim(),
      concern: concernInput.value.trim(),
      problem: problemInput.value.trim(),
      suggestion: suggestionInput.value.trim(),
      likes: 0
    };

    if (!complaint.subject || !complaint.problem) {
      alert("Please fill required fields");
      return;
    }

    saveComplaint(complaint);

    alert("Complaint registered successfully");

    form.classList.add("hidden");
    quote.style.display = "block";

    clearForm();
    loadComplaints();
  };

  /* SAVE */
  function saveComplaint(data) {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints.push(data);
    localStorage.setItem("complaints", JSON.stringify(complaints));
  }

  /* LOAD */
  function loadComplaints() {
    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaintsList.innerHTML = "";

    complaints.forEach((c, index) => {
      const div = document.createElement("div");
      div.className = "complaint-card";
      div.innerHTML = `
  <button class="delete-btn" onclick="deleteComplaint(${index})">🗑️</button>

  <h4>${c.subject}</h4>
  <p><b>Concern:</b> ${c.concern}</p>
  <p>${c.problem}</p>
  <p><i>${c.suggestion}</i></p>

  <button class="like-btn" onclick="likeComplaint(${index})">
    👍 Like (${c.likes})
  </button>
`;

      complaintsList.appendChild(div);
    });
  }
function deleteComplaint(index) {
  if (!confirm("Delete this complaint?")) return;

  let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
  complaints.splice(index, 1);
  localStorage.setItem("complaints", JSON.stringify(complaints));
  loadComplaints();
}

  /* LIKE */
  window.likeComplaint = function(index) {
    let complaints = JSON.parse(localStorage.getItem("complaints"));
    complaints[index].likes++;
    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints();
  };

  function clearForm() {
    subjectInput.value = "";
    concernInput.value = "";
    problemInput.value = "";
    suggestionInput.value = "";
  }

  loadComplaints();
});
