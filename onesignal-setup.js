// OneSignal Setup - LOVE CARE GLOBAL
// Get your App ID from https://app.onesignal.com -> Settings -> Keys & IDs
// Replace YOUR_ONESIGNAL_APP_ID below

window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: "YOUR_ONESIGNAL_APP_ID", // <-- PUT YOUR APP ID HERE
    safari_web_id: "YOUR_SAFARI_WEB_ID", // Optional for Safari
    notifyButton: {
      enable: true,
    },
    allowLocalhostAsSecureOrigin: true,
  });

  // Show prompt after 5 seconds
  setTimeout(async () => {
    const permission = await OneSignal.Notifications.permission;
    if (permission === 'default') {
      await OneSignal.Slidedown.promptPush();
    }
  }, 5000);

  // Tag user as nurse or client for targeted notifications
  const role = localStorage.getItem('lcg_role') || 'visitor';
  const uid = localStorage.getItem('lcg_nurse_uid') || localStorage.getItem('lcg_client_uid') || '';
  if (uid) {
    try {
      await OneSignal.login(uid);
      await OneSignal.User.addTag('role', role);
      await OneSignal.User.addTag('uid', uid);
      console.log('OneSignal tagged:', role, uid);
    } catch(e) { console.log('OneSignal tag error', e); }
  }

  OneSignal.Notifications.addEventListener('click', (event) => {
    console.log('Notification clicked', event);
    // Open relevant page based on notification
    if (event.notification.data && event.notification.data.url) {
      window.location.href = event.notification.data.url;
    }
  });
});

// Helper to send notification permission request
window.askNotificationPermission = async function() {
  const OneSignal = window.OneSignal;
  if (OneSignal) {
    await OneSignal.Slidedown.promptPush();
  }
};
