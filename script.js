// ====== Konfigurasi yang mudah diedit ======
const CONFIG = {
  eventDate: '2026-03-26T08:00:00+07:00',
  mapsUrl: 'https://maps.google.com/?q=KP%20Cibeureum%20Empe%20RT%2003%20RW%2020%2C%20Pangalengan%2C%20Bandung',
  gift: [
    {label: 'Rekening BCA', value: '1234567890 a.n. Vinka'},
    {label: 'Rekening Mandiri', value: '9876543210 a.n. Ilham'},
    {label: 'Alamat Rumah', value: 'KP. Cibeureum Empe RT 03 RW 20, Pangalengan'}
  ]
};

// ====== Helper ======
const $ = (s, d=document)=>d.querySelector(s);
const $$ = (s, d=document)=>Array.from(d.querySelectorAll(s));

// ====== Inisialisasi ======
window.addEventListener('DOMContentLoaded', () => {
  // Map
  const btnMap = $('#btnMap');
  if(btnMap){ btnMap.href = CONFIG.mapsUrl; }

  // Countdown
  startCountdown(new Date(CONFIG.eventDate));

  // RSVP handling (LocalStorage demo)
  const rsvpForm = $('#rsvpForm');
  if(rsvpForm){
    rsvpForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(rsvpForm).entries());
      const list = JSON.parse(localStorage.getItem('rsvp_list')||'[]');
      data.time = new Date().toISOString();
      list.push(data);
      localStorage.setItem('rsvp_list', JSON.stringify(list));
      $('#rsvpStatus').textContent = 'Terima kasih, konfirmasi Anda tersimpan.';
      rsvpForm.reset();
      // Tambahkan juga ke ucapan
      if(data.pesan){ addWish({nama:data.nama, pesan:data.pesan, time:new Date()}); }
    });
  }

  // Wishes existing (demo)
  addWish({nama:'Mantan mu', pesan:'Selamat atas pernikahanmu, semoga langgeng sampai selamanya. Aamiin.', time:new Date('2026-02-20T13:00:00+07:00')});

  // Gift
  const btnGift = $('#btnGift');
  if(btnGift){ btnGift.addEventListener('click', showGiftOptions); }
});

function startCountdown(target){
  const day=$('#tDay'), hour=$('#tHour'), min=$('#tMin'), sec=$('#tSec');
  function tick(){
    const now = new Date();
    const diff = Math.max(0, target - now);
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    day.textContent=d; hour.textContent=h; min.textContent=m; sec.textContent=s;
  }
  tick();
  setInterval(tick, 1000);
}

function addWish({nama, pesan, time}){
  const list = $('#wishList');
  const item = document.createElement('div');
  item.className='wish';
  const dt = new Date(time);
  const tanggal = dt.toLocaleDateString('id-ID',{day:'2-digit', month:'long', year:'numeric'});
  const jam = dt.toLocaleTimeString('id-ID',{hour:'2-digit', minute:'2-digit'});
  item.innerHTML = `<div class="meta">${nama}</div><div>${pesan}</div><div class="meta">${tanggal} • ${jam} WIB</div>`;
  list.prepend(item);
}

$('#wishForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  addWish({nama:data.nama, pesan:data.pesan, time:new Date()});
  e.target.reset();
});

function showGiftOptions(){
  const lines = CONFIG.gift.map(g=>`${g.label}:\n${g.value}`).join('\n\n');
  navigator.clipboard.writeText(lines).catch(()=>{});
  alert('Informasi hadiah telah disalin ke clipboard:\n\n'+lines);
}

// ===== Cover (splash) =====
function getQueryParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

window.addEventListener('DOMContentLoaded', ()=>{
  // Ambil nama tamu dari URL: ?to=Nama+Tamu (juga mendukung ?nama= / ?guest=)
  const guest = getQueryParam('to') || getQueryParam('nama') || getQueryParam('guest');
  if(guest){
    const cleaned = decodeURIComponent(guest).replace(/\+/g,' ');
    const span = document.getElementById('guestName');
    if(span){ span.textContent = cleaned; }
  }
  // Tombol "Buka Undangan"
  const btnOpen = document.getElementById('btnOpen');
  const cover = document.getElementById('cover');
  if(btnOpen && cover){
    btnOpen.addEventListener('click', ()=>{
      cover.classList.add('hide');
      document.getElementById('hero')?.scrollIntoView({behavior:'smooth'});
    });
  }
});
// Nama tamu: title-case + sapaan otomatis/param
const raw = getQueryParam('to') || getQueryParam('nama') || getQueryParam('guest') || '';
const sapaanParam = getQueryParam('sapaan');
if(raw){
  const cleaned = decodeURIComponent(raw).replace(/\+/g,' ').trim();
  const sal = inferSalutation(cleaned, sapaanParam); // Bapak/Ibu/Keluarga
  const pure = cleaned.replace(/^((bpk|bapak|pak|ibu|bu|keluarga|kel|family)\.?\s*)/i,'');
  const finalName = [sal, titleCase(pure)].filter(Boolean).join(' ');
  document.getElementById('guestName').textContent = finalName || titleCase(cleaned);
}

// Spawn partikel kecil
for(let i=0;i<30;i++){ /* bikin <span class="particle"> dengan delay/durasi acak */ }

// Musik & gate
btnMute.addEventListener('click', () => setMuted(!audio.muted));
btnOpen.addEventListener('click', async () => {
  try{ await audio.play(); }catch(e){}
  cover.classList.add('hide');
  document.body.classList.remove('no-scroll'); // buka scroll
  document.getElementById('hero').scrollIntoView({behavior:'smooth'});
});
