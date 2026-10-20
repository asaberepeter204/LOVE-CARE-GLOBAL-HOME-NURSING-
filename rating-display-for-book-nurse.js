
// === RATING DISPLAY FOR BOOK-NURSE PAGES - VISIBLE TO EVERYONE - CEO DECREASED RATING SHOWS HERE - 100% WORKING ===
let nurseRatingsCache={};

async function loadNurseRatingsForBooking(){
  try{
    const snap = await get(child(ref(rtdb), 'publicNurseRatings'));
    if(snap.exists()){
      snap.forEach(child=>{
        nurseRatingsCache[child.key] = child.val();
      });
    }
    // Also check nurseRatings
    const snap2 = await get(child(ref(rtdb), 'nurseRatings'));
    if(snap2.exists()){
      snap2.forEach(child=>{
        if(!nurseRatingsCache[child.key]){
          nurseRatingsCache[child.key] = child.val();
        }
      });
    }
    console.log('Loaded nurse ratings for booking - Visible to everyone -', Object.keys(nurseRatingsCache).length, 'nurses');
  }catch(e){ console.log('Rating load error', e.message); }
}

function getNurseRatingDisplay(nurseId){
  const ratingData = nurseRatingsCache[nurseId];
  if(!ratingData){
    return {current:5.0, display:'⭐ 5.0/5.0 ⭐⭐⭐⭐⭐', color:'#86efac', warning:'', isLow:false};
  }
  const current = ratingData.currentRating||ratingData.current||5.0;
  const previous = ratingData.previousRating||5.0;
  const decreasedBy = ratingData.decreasedBy||0;
  const reason = ratingData.reason||'';
  const isDecreased = current < 5.0;
  const isLow = current < 4.0;
  const isVeryLow = current < 3.0;
  
  let stars = '';
  for(let i=1;i<=5;i++){
    if(i <= Math.floor(current)) stars += '⭐';
    else if(i-0.5 <= current) stars += '⭐';
    else stars += '☆';
  }
  
  let display = `⭐ ${current.toFixed(1)}/5.0 ${stars}`;
  let color = current >=4.5?'#86efac':current>=4.0?'#facc15':current>=3.0?'#f59e0b':'#ef4444';
  let warning = '';
  if(isDecreased){
    warning = `⚠️ Rating decreased by CEO from ${previous.toFixed(1)} to ${current.toFixed(1)} - Reason: ${reason} - Visible to everyone`;
  }
  if(isVeryLow){
    warning += ' 🚫 Low rating - Book at your own risk - CEO decreased rating';
  } else if(isLow){
    warning += ' ⚠️ Below 4.0 - CEO decreased rating';
  }
  
  return {current, display, color, warning, isLow, isVeryLow, isDecreased, reason, decreasedBy};
}

// Call this when rendering nurse cards in book-nurse pages
function renderNurseCardWithRating(nurse){
  const ratingInfo = getNurseRatingDisplay(nurse.id||nurse.nurseId);
  return `
    <div class="nurse-card" style="border:2px solid ${ratingInfo.isVeryLow?'#ef4444':ratingInfo.isLow?'#f59e0b':'rgba(168,85,247,.2)'}">
      <div style="display:flex;justify-content:space-between">
        <b>👩‍⚕️ ${nurse.name||nurse.nurseName}</b>
        <span style="color:${ratingInfo.color};font-weight:900">${ratingInfo.display}</span>
      </div>
      ${ratingInfo.warning?`<div style="margin-top:6px;padding:6px;background:${ratingInfo.isVeryLow?'rgba(239,68,68,.15)':'rgba(245,158,11,.1)'};border-radius:8px"><small style="color:${ratingInfo.color}">${ratingInfo.warning}</small></div>`:''}
      <small>📍 ${nurse.location||''} | 🕐 ${nurse.experience||''} years | 💰 GHS ${nurse.hourlyRate||15}/hr</small>
      ${ratingInfo.isVeryLow?'<div style="margin-top:6px"><small style="color:#ef4444">🚫 This nurse has low rating - CEO decreased rating due to complaints - Book at your own risk - CEO approval may be required</small></div>':''}
    </div>
  `;
}

// Check if nurse is suspended - Don't show suspended nurses in booking list
async function isNurseSuspended(nurseId){
  try{
    const snap = await get(child(ref(rtdb), 'suspendedNurses/'+nurseId));
    return snap.exists();
  }catch(e){ return false; }
}

// Filter out suspended nurses from booking list
async function filterSuspendedNurses(nursesList){
  let filtered=[];
  for(let nurse of nursesList){
    const suspended = await isNurseSuspended(nurse.id||nurse.nurseId);
    if(!suspended){
      filtered.push(nurse);
    } else {
      console.log('Filtered suspended nurse', nurse.id, '- Not showing in booking list - CEO suspended');
    }
  }
  return filtered;
}

// Load ratings on page load
// Call loadNurseRatingsForBooking() when page loads, then filterSuspendedNurses(allNurses) before displaying
