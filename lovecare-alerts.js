// LOVE CARE ALERT SOUND SYSTEM
function playLoveCareAlert(type){
  // type = 'accepted' or 'booked'
  let savedTone = localStorage.getItem('lovecare_tone') || 'success'; // wetin user choose for Alerts page
  let soundOn = localStorage.getItem('lovecare_sound') !== 'off';
  if(!soundOn) return;

  let soundFile = 'success.mp3';
  if(savedTone === 'urgent') soundFile = 'urgent-alarm.mp3';
  if(savedTone === 'gentle') soundFile = 'gentle-chime.mp3';
  if(savedTone === 'afrobeat') soundFile = 'afrobeat-ghana.mp3';
  if(localStorage.getItem('lovecare_custom_tone')) soundFile = localStorage.getItem('lovecare_custom_tone');

  let audio = new Audio(soundFile);
  audio.play().catch(e=>{});

  // Vibrate — make phone shake to draw attention
  if(navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);

  // Flash title
  document.title = '🔔 NEW ALERT - LoveCare Global!';
}

// Test am
// playLoveCareAlert('accepted');
