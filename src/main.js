
const icons = {
 leaf:'<path d="M20 4C10 2 3 7 5 14c2 7 14 7 15-10Z"/><path d="m4 21 11-12"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>',
 book:'<path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',
 heart:'<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 3 11 8 15 5-4 13-10 8-15Z"/>',
 arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
 sound:'<path d="M11 4 5 9H2v6h3l6 5ZM15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
 pause:'<path d="M8 5v14M16 5v14"/>',
 play:'<path d="m8 5 11 7-11 7Z"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.leaf}</svg>`;
const panda = `<svg class="panda" viewBox="0 0 100 100" aria-hidden="true"><path d="M67 66c39-17 31 26 11 18" fill="#ab553b" stroke="#74392e" stroke-width="7"/><ellipse cx="50" cy="76" rx="25" ry="21" fill="#633f34"/><path d="M26 38 21 12l23 13M59 25l21-13-4 29" fill="#b86b46" stroke="#643e30" stroke-width="3"/><path d="m28 26-2-8 11 9m29 0 9-9-1 12" stroke="#fff3dc" stroke-width="5"/><ellipse cx="50" cy="47" rx="33" ry="28" fill="#bf704b"/><path d="M19 45q12-15 29 9Q27 78 19 45m62 0Q69 30 52 54q21 24 29-9" fill="#fff3dc"/><path d="M37 37 31 48m32-11 6 11" stroke="#563b30" stroke-width="9" stroke-linecap="round"/><circle cx="34" cy="43" r="3" fill="#17171c"/><circle cx="66" cy="43" r="3" fill="#17171c"/><path d="M44 53q6-5 12 0l-6 6Z" fill="#342b29"/><path d="M44 63q6 5 12 0" fill="none" stroke="#342b29" stroke-width="2"/><ellipse cx="33" cy="88" rx="10" ry="6" fill="#392f2c"/><ellipse cx="64" cy="88" rx="10" ry="6" fill="#392f2c"/></svg>`;
const firstAnimal = animals.find(a=>a.id==='red-panda') || animals[0];

let filter = 'all', query = '', visited = new Set(), route = 0;
try { visited = new Set(JSON.parse(localStorage.getItem('zoo-visited') || '[]')); } catch {}
const safeSave = (key,value) => { try { localStorage.setItem(key,JSON.stringify(value)); } catch {} };
const renderAnimals = () => {
 const visible = animals.filter(a=>(filter==='all'||a.habitat===filter)&&`${a.name} ${a.en}`.toLowerCase().includes(query.toLowerCase()));
 document.querySelector('#animal-grid').innerHTML = visible.length ? visible.map(a=>`<button class="animal-card" data-animal="${a.id}"><div class="animal-photo"><img src="${a.image}" alt="${a.name}" loading="lazy" width="700" height="800"><span class="animal-tag">${a.tag}</span><span class="photo-open">${icon('arrow')}</span>${visited.has(a.id)?'<span class="visited">已認識</span>':''}</div><div class="animal-caption"><div><h3>${a.name}</h3><span>${a.en}</span></div><span>${habitats.find(h=>h.id===a.habitat)?.name || ''}</span></div></button>`).join('') : '<div class="empty-results"><h3>還沒找到這位動物朋友</h3><p>試試「小熊貓」，或切換到所有動物。</p><button class="button dark" id="reset-search">顯示所有動物</button></div>';
 document.querySelector('.results-status').textContent = `找到 ${visible.length} 位動物朋友`;
 document.querySelector('#collection-count').textContent=`已認識 ${visited.size} / ${animals.length} 位朋友`;
};
renderAnimals();
const setFilter = (value) => {filter=value;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===value);b.setAttribute('aria-pressed',b.dataset.filter===value);});renderAnimals();};
document.querySelector('.search input').addEventListener('input',e=>{query=e.target.value;renderAnimals();});
const dialog = document.querySelector('dialog');
function openAnimal(id) {
 const a=animals.find(a=>a.id===id); if(!a)return;
 visited.add(id);safeSave('zoo-visited',[...visited]);renderAnimals();
 document.querySelector('.dialog-content').innerHTML=`<img class="detail-image" src="${a.image}" alt="${a.name}" width="700" height="800"><div class="detail-copy"><span class="eyebrow">${a.en}</span><h2 id="dialog-title">${a.name}</h2><span class="detail-tag">${a.tag}</span><p>${a.description}</p><dl>${a.facts.map(f=>`<div><dt>${f.label}</dt><dd>${f.value}</dd></div>`).join('')}</dl><div class="conservation-fact">${icon('leaf')}<p>${a.conservation}</p></div><button class="button dark" id="detail-next">${route===1?'前往下一站：棲息地':'看看牠的棲息地'} ${icon('arrow')}</button></div>`;
 document.querySelector('#detail-next').onclick=()=>{dialog.close();location.hash='habitats';if(route===1){route=2;showCompanion('第二站：每個動物都有適合自己的家。點選一個棲息地，認識那裡的居民。',true);}};
 dialog.showModal();document.body.classList.add('dialog-open');
}
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
document.querySelector('.dialog-close').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
document.addEventListener('click',e=>{
 const animal=e.target.closest('[data-animal]');if(animal)openAnimal(animal.dataset.animal);
 const chip=e.target.closest('[data-filter]');if(chip)setFilter(chip.dataset.filter);
 const habitat=e.target.closest('[data-habitat]');if(habitat){query='';document.querySelector('.search input').value='';setFilter(habitat.dataset.habitat);location.hash='animals';if(route===2){route=3;showCompanion('你發現了新的家！最後一站，選一個今天能做到的保育行動。',true);}}
 if(e.target.closest('#reset-search')){query='';document.querySelector('.search input').value='';setFilter('all');}
});
const care = new Set();try{JSON.parse(localStorage.getItem('zoo-care')||'[]').forEach(i=>care.add(i));}catch{}
function updateCare(){document.querySelectorAll('[data-care]').forEach(b=>{const selected=care.has(b.dataset.care);b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',selected);});document.querySelector('.care-status').textContent=care.size?`已選擇 ${care.size} 個友善行動，從今天開始。`:'選一件今天做得到的事。';}
updateCare();document.querySelectorAll('[data-care]').forEach(b=>b.onclick=()=>{care.has(b.dataset.care)?care.delete(b.dataset.care):care.add(b.dataset.care);safeSave('zoo-care',[...care]);updateCare();if(route===3&&care.size){route=4;showCompanion('探索完成！你認識了動物、走進牠們的家，也帶走了友善的改變。謝謝你和栗栗一起走。');document.querySelector('#start-route').textContent='再探索一次';}});
function showCompanion(text,action=false){const box=document.querySelector('.companion-message');box.replaceChildren();const p=document.createElement('p');p.textContent=text;box.append(p);if(action){const b=document.createElement('button');b.textContent=route===3?'前往保育日常':'繼續探索';b.onclick=()=>{location.hash=route===3?'conservation':'habitats';box.hidden=true;document.querySelector('.companion-button').setAttribute('aria-expanded','false');};box.append(b);}box.hidden=false;document.querySelector('.companion-button').setAttribute('aria-expanded','true');}
document.querySelector('.companion-button').onclick=()=>{const box=document.querySelector('.companion-message');if(!box.hidden){box.hidden=true;document.querySelector('.companion-button').setAttribute('aria-expanded','false');}else showCompanion(route===3?'最後一站：一起選一個友善行動吧！':`我是栗栗，你的森林嚮導！你已經認識 ${visited.size} 位動物朋友。點選照片，就能發現牠們的生活秘密。`,route===3);};
document.querySelector('#start-route').onclick=()=>{route=1;document.querySelector('.companion-message').hidden=true;openAnimal(firstAnimal.id);};
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduceMotion.matches;
const motionButton=document.querySelector('#motion-toggle');
function applyMotion(){document.documentElement.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',paused);motionButton.innerHTML=`${icon(paused?'play':'pause')} ${paused?'開啟動畫':'暫停動畫'}`;}
applyMotion();motionButton.onclick=()=>{paused=!paused;applyMotion();};reduceMotion.addEventListener('change',e=>{paused=e.matches;applyMotion();});
document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('page-hidden',document.hidden));
const heroObserver=new IntersectionObserver(([e])=>document.querySelector('.hero').classList.toggle('offscreen',!e.isIntersecting));heroObserver.observe(document.querySelector('.hero'));
document.querySelector('.menu-button').onclick=()=>{const open=document.querySelector('.site-header').classList.toggle('menu-open');document.querySelector('.menu-button').setAttribute('aria-expanded',open);};
document.querySelectorAll('.desktop-nav a').forEach(a=>a.onclick=()=>{document.querySelector('.site-header').classList.remove('menu-open');document.querySelector('.menu-button').setAttribute('aria-expanded','false');});
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('.mobile-nav a').forEach(a=>a.classList.toggle('current',a.hash===`#${e.target.id}`));}),{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main[id],section[id]').forEach(s=>sectionObserver.observe(s));



const film=document.querySelector('video');new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)film.pause();}).observe(film);document.addEventListener('visibilitychange',()=>{if(document.hidden)film.pause();});

