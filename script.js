function generateWalletAddress() {
  return 'T' + Math.random().toString(36).substring(2, 14).toUpperCase();
}

function getUsers() {
  return JSON.parse(localStorage.getItem("walletUsers") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("walletUsers", JSON.stringify(users));
}

function login() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("أدخل اسم المستخدم");

  let users = getUsers();

  if (!users[username]) {
    users[username] = {
      address: generateWalletAddress(),
      trx: parseFloat((Math.random() * 1000).toFixed(3)),
      usdt: parseFloat((Math.random() * 1000).toFixed(3))
    };
    saveUsers(users);
  }

  localStorage.setItem("loggedInUser", username);
  location.reload();
}

function logout() {
  localStorage.removeItem("loggedInUser");
  location.reload();
}

function fakeReceive() {
  alert("تم استقبال المعاملة (وهمية)");
}

function toggleSendForm() {
  const form = document.getElementById("sendForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

function sendFlash() {
  const to = document.getElementById("receiverAddress").value.trim();
  const amount = parseFloat(document.getElementById("sendAmount").value);
  const user = localStorage.getItem("loggedInUser");
  let users = getUsers();

  if (!to || isNaN(amount) || amount <= 0) return alert("الرجاء إدخال عنوان صحيح ومبلغ صالح");
  if (!user || !users[user]) return alert("لم يتم تسجيل الدخول");

  const sender = users[user];

  const recipientEntry = Object.entries(users).find(([_, val]) => val.address === to);
  if (!recipientEntry) return alert("العنوان غير موجود في النظام");

  if (sender.usdt < amount) return alert("لا يوجد رصيد كافٍ");

  const [recipientUsername, recipient] = recipientEntry;

  sender.usdt -= amount;
  recipient.usdt += amount;

  saveUsers(users);
  alert(`✅ تم إرسال ${amount} USDT إلى ${recipient.address}`);
  location.reload();
}

window.onload = () => {
  const user = localStorage.getItem("loggedInUser");
  if (!user) return;

  const users = getUsers();
  const data = users[user];

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("walletSection").style.display = "block";

  document.getElementById("walletAddress").textContent = data.address;
  document.getElementById("trxBalance").textContent = data.trx;
  document.getElementById("usdValue").textContent = `$${(data.trx * 0.244 + data.usdt).toFixed(3)}`;
  document.getElementById("assetTRX").textContent = `$${(data.trx * 0.244).toFixed(3)}`;
  document.getElementById("assetUSDT").textContent = `$${data.usdt.toFixed(3)}`;
};
