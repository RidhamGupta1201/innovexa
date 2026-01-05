const photoInput = document.getElementById("photoInput");
const profilePreview = document.getElementById("profilePreview");
const navPic = document.getElementById("profilePicNav");

// Preview uploaded image
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profilePreview.src = reader.result;
    navPic.src = reader.result;
  };
  reader.readAsDataURL(file);
});
