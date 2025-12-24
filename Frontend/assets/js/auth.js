const API = "http://localhost:5000/api/auth";

function register(role) {
  fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role,
      name: name.value,
      email: email.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(() => alert("Registered successfully"));
}

function login() {
  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("token", data.token);

    if (data.role === "BUYER")
      window.location.href = "buyer-dashboard.html";
    else
      window.location.href = "seller-dashboard.html";
  });
}
