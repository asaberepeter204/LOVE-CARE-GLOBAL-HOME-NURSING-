// LoveCare Global - OneSignal for ALL pages
window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: "c3139bd9-6b17-40cd-812c-3003952f5d09",
  });

  let type = "general";
  let page = location.pathname.toLowerCase();
  if (page.includes("nurse")) type = "nurse";
  else if (page.includes("client") || page.includes("my-booking") || page.includes("book-nurse")) type = "client";
  else if (page.includes("hr-") || page.includes("staff")) type = "hr";
  else if (page.includes("ceo")) type = "ceo";

  try { await OneSignal.User.addTag("user_type", type); } catch(e){}
});
