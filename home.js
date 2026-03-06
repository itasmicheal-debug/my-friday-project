document.addEventListener('DOMContentLoaded',()=>{
  const REV_KEY='isaac_reviews_v1'

  // Hero image carousel
  const heroImgs=[
    // delivery truck
    'https://images.unsplash.com/photo-1520975910206-4d1d6b2d2a4b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6e5f8f9c9f9c9f9c9f9c9f9c9f9c9f9c',
    // cargo ship
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e6f',
    // airplane
    'https://images.unsplash.com/photo-1517976487492-6b2b0ad5d4a3?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b3c4d5e6f7g',
    // warehouse / van
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c4d5e6f7g8h'
  ]
  let hIndex=0
  const heroImg=document.getElementById('hero-img')
  if(heroImg){
    setInterval(()=>{
      hIndex=(hIndex+1)%heroImgs.length
      heroImg.src=heroImgs[hIndex]
    },4000)
  }

  // Quick track form redirects to tracker page with code in query
  const quick=document.getElementById('quick-track')
  if(quick){
    quick.addEventListener('submit',e=>{
      e.preventDefault()
      const code=document.getElementById('quick-code').value.trim()
      if(!code) return
      // For merged single-page site: set ?code=... and reload so tracker shows
      const q = '?code=' + encodeURIComponent(code)
      if(window.location.search === q){
        window.location.reload()
      } else {
        window.location.search = q
      }
    })
  }

  // Reviews
  function loadReviews(){
    try{const raw=localStorage.getItem(REV_KEY);return raw?JSON.parse(raw):[]}catch(e){return[]}
  }
  function saveReviews(arr){localStorage.setItem(REV_KEY,JSON.stringify(arr))}

  function renderReviews(){
    const list=document.getElementById('reviews-list')
    if(!list) return
    const arr=loadReviews()
    list.innerHTML=''
    // If no reviews, show a few sample realistic reviews for demonstration
    const samples = [
      {name:'Aisha Bello',text:'Quick delivery and great communication — highly recommend!',at:new Date().toISOString(),stars:5},
      {name:'John Okoro',text:'Parcel arrived in perfect condition. Very professional.',at:new Date().toISOString(),stars:5},
      {name:'Ngozi Eze',text:'Good value for money and friendly drivers.',at:new Date().toISOString(),stars:4}
    ]
    const source = arr.length? arr.slice().reverse() : samples
    source.forEach(r=>{
      const d=document.createElement('div')
      d.className='review-card reveal'
      d.innerHTML=`<div class="review-meta"><span class="avatar"></span><div><strong>${escapeHtml(r.name)}</strong><div class="review-stars">${renderStars(r.stars||5)}</div></div></div><div class="review-text">${escapeHtml(r.text)}</div><small>${new Date(r.at).toLocaleDateString()}</small>`
      list.appendChild(d)
    })
    // enable simple horizontal carousel behavior
    initReviewCarousel()
  }

  function escapeHtml(s){return (s||'').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c])}

  const form=document.getElementById('review-form')
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault()
      const name=document.getElementById('reviewer').value.trim()||'Anonymous'
      const text=document.getElementById('review-text').value.trim()
      if(!text) return
      const arr=loadReviews()
      arr.push({name,text,at:new Date().toISOString()})
      saveReviews(arr)
      form.reset()
      renderReviews()
    })
  }

  renderReviews()

  // Header quick track button
  const headerBtn = document.getElementById('header-track-btn')
  const headerInput = document.getElementById('header-code')
  if(headerBtn && headerInput){
    headerBtn.addEventListener('click',()=>{
      const code = headerInput.value.trim()
      if(!code) return
      const q = '?code=' + encodeURIComponent(code)
      if(window.location.search === q) window.location.reload()
      else window.location.search = q
    })
  }

  // Services cards
  document.querySelectorAll('.services .card').forEach(card=>{
    card.addEventListener('click',()=>{
      const k=card.dataset.key
      const detail=document.getElementById('service-detail')
      if(!detail) return
      if(k==='parcel') detail.textContent='Parcel Delivery — affordable door-to-door for packages up to 30kg.'
      if(k==='freight') detail.textContent='Freight — palletised and bulk shipping with tracking and insurance.'
      if(k==='express') detail.textContent='Express — same-day and overnight options with priority handling.'
    })
  })

  // Estimator
  const estForm = document.getElementById('est-form')
  if(estForm){
    estForm.addEventListener('submit',e=>{
      e.preventDefault()
      const w = parseFloat(document.getElementById('est-weight').value) || 0
      const d = parseFloat(document.getElementById('est-distance').value) || 0
      const speed = document.getElementById('est-speed').value
      // simple pricing formula
      let price = 500 + (w * 120) + (d * 8)
      if(speed==='express') price = Math.round(price * 1.5)
      else price = Math.round(price)
      const out = document.getElementById('est-result')
      if(out) out.innerHTML = `Estimated price: <strong>₦${price.toLocaleString()}</strong>`
    })
  }

  // (Signup modal removed) nav-create will be handled by app.js to show create section

  // FAQ accordion
  document.querySelectorAll('.faq .q').forEach(q=>{
    q.addEventListener('click',()=>{
      q.querySelector('.a').classList.toggle('hidden')
    })
  })

  // Animated counters when visible
  function animateCounters(){
    document.querySelectorAll('.stat-number').forEach(el=>{
      const target = parseInt(el.dataset.target,10)||0
      let val=0
      const step = Math.max(1, Math.floor(target/60))
      const iv = setInterval(()=>{
        val += step
        if(val >= target){ el.textContent = target; clearInterval(iv) }
        else el.textContent = val
      },18)
    })
  }
  // trigger when stats visible
  const statsSection = document.querySelector('.stats')
  if(statsSection){
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(en=>{ if(en.isIntersecting){ animateCounters(); obs.disconnect() } })
    },{threshold:0.4})
    obs.observe(statsSection)
  }

  // helpers: render star icons
  function renderStars(n){
    let s=''
    for(let i=0;i<5;i++) s += i < n ? '★' : '☆'
    return s
  }

  // reveal elements when in view
  function revealOnScroll(){
    document.querySelectorAll('.reveal').forEach(el=> el.classList.remove('visible'))
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('visible') })
    },{threshold:0.15})
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el))
  }
  revealOnScroll()

  // Simple review carousel auto-scroll
  let reviewInterval
  function initReviewCarousel(){
    const wrap = document.getElementById('reviews-list')
    if(!wrap) return
    clearInterval(reviewInterval)
    reviewInterval = setInterval(()=>{
      // smooth scroll by width of first child
      const first = wrap.querySelector('.review-card')
      if(!first) return
      const w = first.offsetWidth + 12
      wrap.scrollBy({left: w, behavior: 'smooth'})
      // if scrolled near end, return to start
      if(wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 10){
        setTimeout(()=> wrap.scrollTo({left:0,behavior:'smooth'}),800)
      }
    },3800)
  }
})
