
// LOVE CARE GLOBAL - REAL WIRING - Makes all pages talk to each other
// Uses Firebase RTDB: web-care-618e8
(function(){
  const firebaseConfig={apiKey:"AIzaSyB52-X1D8Cg-wUDWPds_tR7X3cF82dMdRg",authDomain:"web-care-618e8.firebaseapp.com",databaseURL:"https://web-care-618e8-default-rtdb.firebaseio.com",projectId:"web-care-618e8",storageBucket:"web-care-618e8.firebasestorage.app",messagingSenderId:"1062578660694",appId:"1:1062578660694:web:f94dfe12c929df05bce2f7"};
  if(typeof firebase!=='undefined' && !firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
  const rtdb = (typeof firebase!=='undefined') ? firebase.database() : null;

  function getCurrentNurse(){
    const KEYS=['nurse','nurseData','currentUser','user','auth_user','nurse_profile'];
    for(const store of [localStorage, sessionStorage]){
      for(const k of KEYS){
        try{
          const raw=store.getItem(k);
          if(!raw) continue;
          const d=JSON.parse(raw);
          const o=d.user||d.nurse||d.data||d;
          const full=o.fullName||o.name||o.displayName;
          if(full){
            return {
              id: o.id||o.nurseId||o.uid||full.toLowerCase().replace(/\s+/g,'-'),
              fullName: full,
              firstName: o.firstName||full.split(' ')[0],
              location: o.location||'East Legon',
              photo: o.photo||null
            };
          }
        }catch{}
      }
    }
    // fallback for testing - Asabere Peter
    return {id:'asabere-peter', fullName:'Asabere Peter', firstName:'Asabere', location:'East Legon', photo:null};
  }

  function getNurseId(){
    const n=getCurrentNurse();
    return n.id;
  }

  // REAL-TIME LISTENER FOR MY JOB OFFER
  function listenMyJobOffers(callback){
    const nurseId=getNurseId();
    if(!rtdb) { callback([]); return; }
    const ref = rtdb.ref('myJobOffers/'+nurseId);
    ref.on('value', (snap)=>{
      const val=snap.val();
      const arr = val ? Object.values(val) : [];
      // Also merge localStorage
      try{
        const localRaw=localStorage.getItem('jobOffers');
        if(localRaw){
          const localArr=JSON.parse(localRaw);
          // merge by id
          const map={};
          [...arr, ...localArr].forEach(o=>{ if(o && o.id) map[o.id]=o; });
          const merged=Object.values(map);
          // save merged back to local
          localStorage.setItem('jobOffers', JSON.stringify(merged));
          callback(merged);
          return;
        }
      }catch{}
      callback(arr);
    });
  }

  // REAL-TIME LISTENER FOR MY BOOKINGS (CLIENT)
  function listenMyBookings(callback){
    if(!rtdb){ callback([]); return; }
    // Listen to bookings where clientName matches or all bookings
    const ref = rtdb.ref('bookings');
    ref.orderByChild('time').limitToLast(50).on('value', (snap)=>{
      const val=snap.val();
      const arr = val ? Object.values(val).reverse() : [];
      callback(arr);
    });
  }

  // When client books a nurse - called from book-nurse.html
  function pushOfferToNurse(nurseId, bookingData){
    // Save to localStorage for instant reflection
    try{
      const existing=JSON.parse(localStorage.getItem('jobOffers')||'[]');
      // Add if not exists
      if(!existing.find(o=>o.id===bookingData.id)){
        existing.unshift(bookingData);
        localStorage.setItem('jobOffers', JSON.stringify(existing));
        // Trigger storage event for same tab
        window.dispatchEvent(new Event('storage'));
      }
    }catch{}

    // Also push to Firebase if available
    if(rtdb && nurseId && bookingData.id){
      rtdb.ref('myJobOffers/'+nurseId+'/'+bookingData.id).set(bookingData);
      rtdb.ref('jobOffers/'+bookingData.id).set(bookingData);
      rtdb.ref('nurseBookings/'+nurseId+'/'+bookingData.id).set(bookingData);
    }
  }

  window.LoveCareWiring = {
    getCurrentNurse,
    getNurseId,
    listenMyJobOffers,
    listenMyBookings,
    pushOfferToNurse,
    rtdb
  };

  console.log('Love Care Wiring loaded - Nurse:', getCurrentNurse());
})();
