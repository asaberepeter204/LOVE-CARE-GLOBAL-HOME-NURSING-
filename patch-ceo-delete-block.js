// CEO DELETE BLOCK PATCH — Include AFTER firebase imports in nurse-login.html — Boss Fixed!
// <script src="patch-ceo-delete-block.js"></script>

console.log('🔴 CEO DELETE BLOCK PATCH LOADED — Deleted nurses cannot login!');

if(window.emailLogin){
  const originalEmailLogin = window.emailLogin;
  window.emailLogin = async () => {
    try{
      const email=document.getElementById('email').value.trim();
      const password=document.getElementById('password').value;
      if(!email||!password){ 
        const el=document.getElementById('msg'); 
        if(el){ el.textContent='Enter email and password'; el.className='alert show alert-error'; }
        return;
      }
      const { getAuth, signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js");
      const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js");
      const { getDatabase, ref, get, set } = await import("https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js");
      const auth=getAuth();
      const db=getFirestore();
      const rtdb=getDatabase();
      
      const showMsg=(text,type='alert-error')=>{
        const el=document.getElementById('msg');
        if(el){ el.textContent=text; el.className='alert show '+type; }
      };
      
      showMsg('Checking account... CEO delete check...','alert-info');
      const cred=await signInWithEmailAndPassword(auth, email, password);
      const user=cred.user;
      const uid=user.uid;
      
      // 🔴 CEO DELETE CHECK — BLOCK IF DELETED VIA delete-nurse-all-paths.html
      const snap = await getDoc(doc(db,'nurses', uid));
      if(snap.exists()){
        const data=snap.data();
        if(data.deleted===true || data.isDeleted===true || data.deletedBy==='CEO' || data.deletedAt){
          await auth.signOut();
          localStorage.clear();
          showMsg('❌ Account DELETED by CEO via delete-nurse-all-paths.html — Hidden from book-nurse.html — Cannot login straight!','alert-error');
          alert('❌ DELETED by CEO!');
          return;
        }
        if(data.blocked===true || data.isBlocked===true || data.blockedBy==='CEO'){
          await auth.signOut();
          try{await set(ref(rtdb,'onlineNurses/'+uid), null);}catch(e){}
          try{await set(ref(rtdb,'nurses/'+uid), null);}catch(e){}
          localStorage.clear();
          showMsg('🚫 BLOCKED/DELETED by CEO — Cannot login straight!','alert-error');
          return;
        }
        try{
          const delSnap = await getDoc(doc(db,'deletedNurses', uid));
          if(delSnap.exists()){
            await auth.signOut();
            localStorage.clear();
            showMsg('❌ In deletedNurses list — DELETED by CEO!','alert-error');
            return;
          }
        }catch(e){}
      } else {
        try{
          const delSnap = await getDoc(doc(db,'deletedNurses', uid));
          if(delSnap.exists()){
            await auth.signOut();
            localStorage.clear();
            showMsg('❌ DELETED by CEO — In deletedNurses — Cannot login!','alert-error');
            alert('❌ DELETED by CEO via delete-nurse-all-paths.html!');
            return;
          }
        }catch(e){}
        const rSnap = await get(ref(rtdb,'nurses/'+uid));
        if(!rSnap.exists()){
          await auth.signOut();
          localStorage.clear();
          showMsg('❌ DELETED by CEO — No profile found (deleted via delete-nurse-all-paths.html) — Hidden from book-nurse.html — Cannot login straight!','alert-error');
          alert('❌ DELETED by CEO via delete-nurse-all-paths.html! Firestore nurses/'+uid+' NOT FOUND! Hidden from book-nurse.html!');
          return;
        }
      }
      localStorage.setItem('lcg_nurse_uid', uid);
      localStorage.setItem('nurseUid', uid);
      localStorage.setItem('nurseName', user.displayName||email.split('@')[0]);
      localStorage.setItem('lcg_logged_in','true');
      localStorage.setItem('lcg_role','nurse');
      window.location.replace('nurses-dashboard.html');
    }catch(e){
      const el=document.getElementById('msg');
      let msg=e.message;
      if(msg.includes('invalid-credential')) msg='Wrong email or password';
      if(msg.includes('user-not-found')) msg='Account not found — Maybe deleted by CEO?';
      if(msg.includes('user-disabled')) msg='🚫 Disabled by CEO — Cannot login straight!';
      if(el){ el.textContent='Login failed: '+msg; el.className='alert show alert-error'; }
    }
  };
}
console.log('✅ CEO DELETE BLOCK PATCH ACTIVE!');
