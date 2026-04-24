/* ============================================
   VERDANT BANK - ONLINE BANKING SYSTEM
   ============================================
   Features:
   - User login & authentication
   - Fund transfers between accounts
   - Bill payments & instant transfers
   - Transaction history
   ============================================ */

/* ============================================
   GLOBAL STATE & VARIABLES
   ============================================ */
var currentBal = 707113.73;  // Current account balance
var pinEntry = '';       // Transfer PIN entry
var transferData = {};   // Stores current transfer data

/* ============================================
   LOGIN MANAGEMENT
   ============================================ */

function doLogin(){
  const u = document.getElementById('uid').value.trim().toLowerCase();
  const p = document.getElementById('pwd').value;
  // Accept any password for demo (username: jackson tiller)
  if((u==='jackson tiller'||u==='jacksontiller') && p.length>=1){
    document.getElementById('login').style.display='none';
    document.getElementById('token').style.display='block';
  } else {
    document.getElementById('errmsg').style.display='block';
  }
}

function doTokenVerify(){
  const token = document.getElementById('tokenInput').value.trim();
  if(token === '263263'){
    document.getElementById('token').style.display='none';
    document.getElementById('dash').style.display='flex';
  } else {
    document.getElementById('tokenErrmsg').style.display='block';
  }
}

// Allow Enter key to submit token
document.getElementById('tokenInput').addEventListener('keydown', e => { if(e.key==='Enter') doTokenVerify(); });

function doLogout(){
  document.getElementById('dash').style.display='none';
  document.getElementById('token').style.display='none';
  document.getElementById('login').style.display='block';
}

// Allow Enter key to submit login
document.getElementById('pwd').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });

/* ============================================
   TRANSACTION FILTERING
   ============================================ */

function filterTxn(type, el){
  // Remove active class from all tabs
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
  // Show/hide transactions based on filter
  document.querySelectorAll('.txn-row').forEach(r => {
    r.style.display = (type==='all' || r.dataset.type===type) ? 'flex' : 'none';
  });
}

/* ============================================
   TRANSFER MODAL - FUNCTIONS
   ============================================ */

function openTransfer(){
  resetModal();
  document.getElementById('transferModal').classList.add('open');
}
function closeTransfer(){
  document.getElementById('transferModal').classList.remove('open');
  resetModal();
}

// Reset all form fields and states when modal closes
function resetModal(){
  pinEntry='';
  ['recName','recAcct','recBank','recRouting','recAmount','recNote'].forEach(id=>{ var el=document.getElementById(id); if(el) el.value=''; });
  ['err-recName','err-recAcct','err-recBank','err-recRouting','err-recAmount','pin-err'].forEach(id=>{ var el=document.getElementById(id); if(el) el.style.display='none'; });
  showStep(1);
  updateStepUI(1);
  updatePinDisplay();
}

function showStep(n){
  // Show the requested step (1-4) and hide others
  [1,2,3,4].forEach(i => {
    document.getElementById('step'+i).style.display = (i===n)?'block':'none';
  });
  var titles = {1:'Transfer funds',2:'Review transfer',3:'Enter PIN',4:'Transfer complete'};
  document.getElementById('modalTitle').textContent = titles[n];
}

// Update visual progress indicators in step bar
function updateStepUI(active){
  [1,2,3,4].forEach(i=>{
    var sc = document.getElementById('sc'+i);
    var sl = document.getElementById('sl'+i);
    sc.className='step-circle';
    sl.className='step-label';
    if(i<active){ sc.classList.add('done'); sl.classList.add('done'); sc.textContent='✓'; }
    else if(i===active){ sc.classList.add('active'); sl.classList.add('active'); sc.textContent=i; }
    else { sc.textContent=i; }
  });
  [1,2,3].forEach(i=>{
    var ln = document.getElementById('line'+i);
    ln.className = 'step-line' + (i<active?' done':'');
  });
}

// Display and hide error messages
function showErr(id, msg){ var el=document.getElementById(id); el.textContent=msg; el.style.display='block'; }
function hideErr(id){ document.getElementById(id).style.display='none'; }

// Step 2: Validate recipient details and prepare review
function goStep2(){
  var name=document.getElementById('recName').value.trim();
  var acct=document.getElementById('recAcct').value.trim();
  var bank=document.getElementById('recBank').value.trim();
  var routing=document.getElementById('recRouting').value.trim();
  var amount=parseFloat(document.getElementById('recAmount').value);
  var valid=true;
  if(!name){ showErr('err-recName','Please enter the recipient\'s name.'); valid=false; } else hideErr('err-recName');
  if(!acct||acct.length<6){ showErr('err-recAcct','Please enter a valid account number (min 6 digits).'); valid=false; } else hideErr('err-recAcct');
  if(!bank){ showErr('err-recBank','Please enter the bank name.'); valid=false; } else hideErr('err-recBank');
  if(!routing||routing.length!==9||isNaN(routing)){ showErr('err-recRouting','Routing number must be exactly 9 digits.'); valid=false; } else hideErr('err-recRouting');
  if(!amount||amount<=0||amount>currentBal){ showErr('err-recAmount', amount>currentBal?'Amount exceeds available balance.':'Please enter a valid amount.'); valid=false; } else hideErr('err-recAmount');
  if(!valid) return;
  transferData = { name, acct, bank, routing, amount, note: document.getElementById('recNote').value.trim() };
  document.getElementById('rv-name').textContent = name;
  document.getElementById('rv-acct').textContent = acct.replace(/(\d{4})(?=\d)/g,'$1 ');
  document.getElementById('rv-bank').textContent = bank;
  document.getElementById('rv-routing').textContent = routing;
  document.getElementById('rv-note').textContent = transferData.note || '—';
  document.getElementById('rv-amount').textContent = '$'+amount.toFixed(2);
  showStep(2); updateStepUI(2);
}
function goBackStep1(){ showStep(1); updateStepUI(1); }
function goStep3(){ pinEntry=''; updatePinDisplay(); document.getElementById('pin-err').style.display='none'; showStep(3); updateStepUI(3); }
function goBackStep2(){ showStep(2); updateStepUI(2); }

function pinPress(v){
  // Handle PIN input (digits, clear, delete)
  document.getElementById('pin-err').style.display='none';
  if(v==='del'){ pinEntry=pinEntry.slice(0,-1); }
  else if(v==='clear'){ pinEntry=''; }
  else if(pinEntry.length<4){ pinEntry+=v; }
  updatePinDisplay();
  document.getElementById('sendBtn').disabled = (pinEntry.length!==4);
}

// Display PIN as dots
function updatePinDisplay(){
  for(var i=0;i<4;i++){
    var dot=document.getElementById('pd'+i);
    if(i<pinEntry.length){ dot.textContent='●'; dot.classList.add('filled'); }
    else { dot.textContent='—'; dot.classList.remove('filled'); }
  }
}

// Step 4: Submit transfer with PIN verification
function submitPin(){
  // Check PIN (demo: 5125)
  if(pinEntry!=='5125'){
    document.getElementById('pin-err').style.display='block';
    pinEntry=''; updatePinDisplay();
    document.getElementById('sendBtn').disabled=true;
    return;
  }
  currentBal -= transferData.amount;
  document.getElementById('dashBal').textContent = '$'+currentBal.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  var ref = 'VB-'+Math.floor(100000+Math.random()*900000);
  document.getElementById('refBadge').textContent='REF: '+ref;
  document.getElementById('successMsg').textContent='$'+transferData.amount.toFixed(2)+' sent to '+transferData.name+' at '+transferData.bank+'.';
  var txnList=document.getElementById('txnList');
  var newRow=document.createElement('div');
  newRow.className='txn-row'; newRow.dataset.type='dr';
  newRow.innerHTML='<div class="t-icon ico-b"><svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M8 4v8M12 8l-4 4-4-4" stroke="#A32D2D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="t-meta"><div class="t-name">Transfer to '+transferData.name+' <span class="t-badge badge-dr">Debit</span></div><div class="t-sub">'+transferData.bank+' · Just now</div></div><div class="t-right"><div class="t-amt dr">-$'+transferData.amount.toFixed(2)+'</div><div class="t-date">Completed</div></div>';
  txnList.insertBefore(newRow, txnList.firstChild);
  showStep(4); updateStepUI(4);
}

/* ============================================
   PAYMENT MODAL - FUNCTIONS
   ============================================ */

// Payment method state variables
var payPinEntry = '';
var payData = {};
var payMethod = 'instant';

function selectPayMethod(m){
  // Toggle between instant pay and bill pay methods
  payMethod = m;
  document.getElementById('pm-instant').classList.toggle('selected', m==='instant');
  document.getElementById('pm-bill').classList.toggle('selected', m==='bill');
  document.getElementById('payFields-instant').style.display = m==='instant'?'block':'none';
  document.getElementById('payFields-bill').style.display = m==='bill'?'block':'none';
}

function openPay(){
  resetPayModal();
  document.getElementById('payModal').classList.add('open');
}
function closePay(){
  document.getElementById('payModal').classList.remove('open');
  resetPayModal();
}

// Reset payment modal to initial state
function resetPayModal(){
  payPinEntry=''; payMethod='instant';
  ['pay-name','pay-contact','pay-biller','pay-billref','pay-amount','pay-note'].forEach(id=>{var el=document.getElementById(id);if(el)el.value='';});
  var cat=document.getElementById('pay-category'); if(cat) cat.value='';
  var bt=document.getElementById('pay-billtype'); if(bt) bt.value='';
  ['err-pay-name','err-pay-contact','err-pay-biller','err-pay-billref','err-pay-amount','err-pay-category','err-pay-billtype','pay-pin-err'].forEach(id=>{var el=document.getElementById(id);if(el)el.style.display='none';});
  document.getElementById('pm-instant').classList.add('selected');
  document.getElementById('pm-bill').classList.remove('selected');
  document.getElementById('payFields-instant').style.display='block';
  document.getElementById('payFields-bill').style.display='none';
  payShowStep(1); payUpdateStepUI(1); payUpdatePinDisplay();
}

// Display payment step (1-4) with corresponding title
function payShowStep(n){
  [1,2,3,4].forEach(i=>{document.getElementById('pstep'+i).style.display=(i===n)?'block':'none';});
  var titles={1:'Make a payment',2:'Review payment',3:'Enter PIN',4:'Payment complete'};
  document.getElementById('payModalTitle').textContent=titles[n];
}

// Update payment progress indicators
function payUpdateStepUI(active){
  [1,2,3,4].forEach(i=>{
    var sc=document.getElementById('psc'+i), sl=document.getElementById('psl'+i);
    sc.className='step-circle'; sl.className='step-label';
    if(i<active){sc.classList.add('done');sl.classList.add('done');sc.textContent='✓';}
    else if(i===active){sc.classList.add('active');sl.classList.add('active');sc.textContent=i;}
    else{sc.textContent=i;}
  });
  [1,2,3].forEach(i=>{
    document.getElementById('pline'+i).className='step-line'+(i<active?' done':'');
  });
}

// Step 2: Validate payment details
function payGoStep2(){
  var amount=parseFloat(document.getElementById('pay-amount').value);
  var valid=true;
  if(payMethod==='instant'){
    var nm=document.getElementById('pay-name').value.trim();
    var ct=document.getElementById('pay-contact').value.trim();
    var cat=document.getElementById('pay-category').value;
    if(!nm){showErr('err-pay-name','Please enter the recipient\'s name.');valid=false;}else hideErr('err-pay-name');
    if(!ct){showErr('err-pay-contact','Please enter a phone number or email.');valid=false;}else hideErr('err-pay-contact');
    if(!cat){showErr('err-pay-category','Please select a category.');valid=false;}else hideErr('err-pay-category');
    if(!amount||amount<=0||amount>currentBal){showErr('err-pay-amount',amount>currentBal?'Amount exceeds available balance.':'Please enter a valid amount.');valid=false;}else hideErr('err-pay-amount');
    if(!valid)return;
    payData={method:'Instant pay',to:nm,contact:ct,category:cat,amount,note:document.getElementById('pay-note').value.trim(),icon:'person'};
    document.getElementById('prv-method').textContent='Instant pay';
    document.getElementById('prv-tolabel').textContent='To';
    document.getElementById('prv-to').textContent=nm;
    document.getElementById('prv-contactlabel').textContent='Phone / email';
    document.getElementById('prv-contact').textContent=ct;
    document.getElementById('prv-catlabel').textContent='Category';
    document.getElementById('prv-category').textContent=cat;
  } else {
    var bl=document.getElementById('pay-biller').value.trim();
    var br=document.getElementById('pay-billref').value.trim();
    var btype=document.getElementById('pay-billtype').value;
    if(!bl){showErr('err-pay-biller','Please enter the biller\'s name.');valid=false;}else hideErr('err-pay-biller');
    if(!br){showErr('err-pay-billref','Please enter a reference number.');valid=false;}else hideErr('err-pay-billref');
    if(!btype){showErr('err-pay-billtype','Please select a bill type.');valid=false;}else hideErr('err-pay-billtype');
    if(!amount||amount<=0||amount>currentBal){showErr('err-pay-amount',amount>currentBal?'Amount exceeds available balance.':'Please enter a valid amount.');valid=false;}else hideErr('err-pay-amount');
    if(!valid)return;
    payData={method:'Bill payment',to:bl,contact:br,category:btype,amount,note:document.getElementById('pay-note').value.trim(),icon:'bill'};
    document.getElementById('prv-method').textContent='Bill payment';
    document.getElementById('prv-tolabel').textContent='Biller';
    document.getElementById('prv-to').textContent=bl;
    document.getElementById('prv-contactlabel').textContent='Reference no.';
    document.getElementById('prv-contact').textContent=br;
    document.getElementById('prv-catlabel').textContent='Bill type';
    document.getElementById('prv-category').textContent=btype;
  }
  document.getElementById('prv-note').textContent=payData.note||'—';
  document.getElementById('prv-amount').textContent='$'+amount.toFixed(2);
  payShowStep(2); payUpdateStepUI(2);
}
function payBackStep1(){payShowStep(1);payUpdateStepUI(1);}
function payGoStep3(){payPinEntry='';payUpdatePinDisplay();document.getElementById('pay-pin-err').style.display='none';payShowStep(3);payUpdateStepUI(3);}
function payBackStep2(){payShowStep(2);payUpdateStepUI(2);}

// Handle payment PIN input
function payPinPress(v){
  document.getElementById('pay-pin-err').style.display='none';
  if(v==='del'){payPinEntry=payPinEntry.slice(0,-1);}
  else if(v==='clear'){payPinEntry='';}
  else if(payPinEntry.length<4){payPinEntry+=v;}
  payUpdatePinDisplay();
  document.getElementById('paySendBtn').disabled=(payPinEntry.length!==4);
}

// Display payment PIN as dots  
function payUpdatePinDisplay(){
  for(var i=0;i<4;i++){
    var dot=document.getElementById('ppd'+i);
    if(i<payPinEntry.length){dot.textContent='●';dot.classList.add('filled');}
    else{dot.textContent='—';dot.classList.remove('filled');}
  }
}

// Final step: Submit payment with PIN verification
function paySubmitPin(){
  // Verify PIN (demo: 5125)
  if(payPinEntry!=='5125'){
    document.getElementById('pay-pin-err').style.display='block';
    payPinEntry='';payUpdatePinDisplay();
    document.getElementById('paySendBtn').disabled=true;
    return;
  }
  currentBal-=payData.amount;
  document.getElementById('dashBal').textContent='$'+currentBal.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  var ref='VB-'+Math.floor(100000+Math.random()*900000);
  document.getElementById('payRefBadge').textContent='REF: '+ref;
  document.getElementById('paySuccessMsg').textContent='$'+payData.amount.toFixed(2)+' paid to '+payData.to+'.';
  var txnList=document.getElementById('txnList');
  var newRow=document.createElement('div');
  newRow.className='txn-row'; newRow.dataset.type='dr';
  var iconColor = payData.icon==='bill'?'ico-a':'ico-p';
  newRow.innerHTML='<div class="t-icon '+iconColor+'"><svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M8 4v8M12 8l-4 4-4-4" stroke="#A32D2D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="t-meta"><div class="t-name">'+payData.method+' — '+payData.to+' <span class="t-badge badge-dr">Debit</span></div><div class="t-sub">'+payData.category+' · Just now</div></div><div class="t-right"><div class="t-amt dr">-$'+payData.amount.toFixed(2)+'</div><div class="t-date">Completed</div></div>';
  txnList.insertBefore(newRow,txnList.firstChild);
  payShowStep(4); payUpdateStepUI(4);
}

/* ============================================
   MODAL EVENT LISTENERS
   ============================================ */

// Close modals when clicking overlay
document.getElementById('payModal').addEventListener('click',function(e){if(e.target===this)closePay();});
document.getElementById('transferModal').addEventListener('click', function(e){
  if(e.target===this) closeTransfer();
});
