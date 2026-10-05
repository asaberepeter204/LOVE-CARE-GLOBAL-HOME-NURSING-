<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CEO Dashboard - LOVE CARE GLOBAL HOME NURSING</title>
<style>body{font-family:Inter,sans-serif;margin:0;background:#f3f4f6;color:#111}.header{background:#ef4444;color:white;padding:12px 16px;display:flex;justify-content:space-between;position:sticky;top:0;z-index:100}.container{max-width:1200px;margin:0 auto;padding:16px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}.card{background:white;padding:18px;border-radius:14px;border:1px solid #e5e7eb;box-shadow:0 2px 8px rgba(0,0,0,0.05)}.stat{font-size:26px;font-weight:900;color:#ef4444}.btn{background:#ef4444;color:white;padding:8px 14px;border-radius:8px;text-decoration:none;font-weight:800;border:none;cursor:pointer}.btn-green{background:#16a34a}.btn-blue{background:#2563eb}a{color:#ef4444;font-weight:700}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:8px;border-bottom:1px solid #e5e7eb;text-align:left}</style>
</head>
<body>
<div class="header"><div><strong>CEO DASHBOARD - LOVE CARE GLOBAL HOME NURSING</strong><br><small>https://asaberepeter204.github.io/LOVE-CARE-GLOBAL-HOME-NURSING-/</small></div><div><a href="index.html" style="color:white">Home</a> | <a href="ceo-login.html" style="color:white">Logout</a></div></div>
<div class="container">
<div class="grid">
<div class="card"><div class="stat" id="totalClients">0</div>Clients</div>
<div class="card"><div class="stat" id="totalNurses">0</div>Nurses</div>
<div class="card"><div class="stat" id="totalBookings">0</div>Bookings</div>
<div class="card"><div class="stat" id="pendingNurses">0</div>Pending Nurses</div>
</div>

<div class="card" style="border-left:5px solid #ef4444">
<h3>🚨 Pending Nurse Applications - CEO Review (STABLE - No Shake)</h3>
<div id="ceoNurseApplicationsList">Loading nurses...</div>
</div>

<div class="card">
<h3>📋 All Bookings</h3>
<div id="allBookings" style="max-height:400px;overflow-y:auto">Loading...</div>
</div>

<div class="card">
<h3>👥 All Clients</h3>
<div id="allClients">Loading...</div>
</div>

<p style="text-align:center"><a href="staff-dashboard.html">Staff Dashboard</a> | <a href="group-chat.html">Group Chat</a> | <a href="settings.html">Settings</a></p>
</div>
<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
const app=initializeApp({databaseURL:"https://love-care-global-default-rtdb.firebaseio.com"}); const db=getDatabase(app);

onValue(ref(db,'clients'),s=>{document.getElementById('totalClients').innerText=s.size; let h='<table><tr><th>Name</th><th>Phone</th></tr>'; s.forEach(c=>{const v=c.val(); h+=`<tr><td>${v.name||''}</td><td>${v.phone||''}</td></tr>`}); h+='</table>'; document.getElementById('allClients').innerHTML=h;});
onValue(ref(db,'nurses'),s=>{document.getElementById('totalNurses').innerText=s.size; let pending=0; let html=''; s.forEach(n=>{const v=n.val(); if(v.status==='pending') pending++; html+=`<div style="border:1px solid #e5e7eb;padding:10px;border-radius:8px;margin:6px 0"><strong>${v.name}</strong> - ${v.phone} - ${v.country} - Status:${v.status}<br><button class="btn btn-green" onclick="approveNurse('${n.key}')">✅ Approve</button> <button class="btn" style="background:#6b7280" onclick="rejectNurse('${n.key}')">❌ Reject</button> <a href="${Object.values(v.documents||{})[0]||'#'}" target="_blank">View Doc</a></div>`}); document.getElementById('pendingNurses').innerText=pending; document.getElementById('ceoNurseApplicationsList').innerHTML=html||'No nurses';});
onValue(ref(db,'bookings'),s=>{document.getElementById('totalBookings').innerText=s.size; let h='<table><tr><th>Service</th><th>Client</th><th>Nurse</th><th>Status</th></tr>'; s.forEach(b=>{const v=b.val(); h+=`<tr><td>${v.service||''}</td><td>${v.clientPhone||''}</td><td>${v.nursePhone||''}</td><td>${v.status||''}</td></tr>`}); h+='</table>'; document.getElementById('allBookings').innerHTML=h;});
window.approveNurse=async(k)=>{await update(ref(db,'nurses/'+k),{status:'approved'}); alert('Approved');}
window.rejectNurse=async(k)=>{if(confirm('Reject?')) await remove(ref(db,'nurses/'+k));}
</script>
</body>
</html>
