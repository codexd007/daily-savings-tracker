// Basic Setup
let monthlyGoal = 25000;
let daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
let saved = JSON.parse(localStorage.getItem('saved')) || 0;
let today = new Date().getDate();
let targets = JSON.parse(localStorage.getItem('targets')) || [];

// Generate dynamic daily targets if empty
if(targets.length === 0){
  let remaining = monthlyGoal;
  for(let i=1;i<=daysInMonth;i++){
    let maxDaily = Math.min(1000, remaining - (daysInMonth-i)*100);
    let minDaily = Math.max(50, Math.floor(remaining/daysInMonth));
    let amt = Math.floor(Math.random()*(maxDaily - minDaily +1) + minDaily);
    remaining -= amt;
    targets.push(amt);
  }
  localStorage.setItem('targets', JSON.stringify(targets));
}

// Display today's target
document.getElementById('today-target').innerText = `💵 Today's Target: Rs ${targets[today-1]}`;
document.getElementById('total').innerText = `Total Saved: Rs ${saved}`;

// Update Progress Bar
function updateProgress(){
  let percent = Math.min(100, Math.floor(saved/monthlyGoal*100));
  document.getElementById('progress').style.width = percent+'%';
  document.getElementById('progress').innerText = percent + '%';
}
updateProgress();

// Calendar
let calendar = document.getElementById('calendar');
for(let i=1;i<=daysInMonth;i++){
  let day = document.createElement('div');
  day.className='day';
  day.innerText=i;
  if(localStorage.getItem('day-'+i)) day.classList.add('saved');
  calendar.appendChild(day);
}

// Save Money Function
document.getElementById('save-btn').addEventListener('click', ()=>{
  let amt = parseInt(document.getElementById('amount').value);
  if(!amt) return alert("Enter amount first!");
  saved += amt;
  localStorage.setItem('saved', saved);
  document.getElementById('total').innerText = `Total Saved: Rs ${saved}`;
  updateProgress();
  localStorage.setItem('day-'+today,true);
  calendar.children[today-1].classList.add('saved');
  animateCoins();
  alert(`✅ You added Rs ${amt} today!`);
});

// Animate Coins
function animateCoins(){
  for(let i=0;i<10;i++){
    let coin = document.createElement('div');
    coin.className='coins';
    coin.style.left = Math.random()*window.innerWidth+'px';
    document.body.appendChild(coin);
    setTimeout(()=>coin.remove(),2000);
  }
}

// Reset Month
document.getElementById('reset-btn').addEventListener('click', ()=>{
  if(confirm("Are you sure you want to reset month?")){
    localStorage.clear();
    location.reload();
  }
});

// Light/Dark Mode
document.getElementById('mode-btn').addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
});

// Daily Notification
if(Notification.permission !== "granted") Notification.requestPermission();
else new Notification("💸 Savings Reminder",{body:`Today save Rs ${targets[today-1]}!`});