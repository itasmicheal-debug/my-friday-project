document.addEventListener('DOMContentLoaded',()=>{
  const KEY='delivery_tracks_v1'
  const navCreate=document.getElementById('nav-create')
  const navUpdate=document.getElementById('nav-update')
  const navTrack=document.getElementById('nav-track')
  const sCreate=document.getElementById('section-create')
  const sUpdate=document.getElementById('section-update')
  const sTrack=document.getElementById('section-track')

  function show(section){
    [sCreate,sUpdate,sTrack].forEach(s=>s&&s.classList.add('hidden'))
    if(section) section.classList.remove('hidden')
  }
  if(navCreate && sCreate) navCreate.onclick=()=>show(sCreate)
  if(navUpdate && sUpdate) navUpdate.onclick=()=>show(sUpdate)
  if(navTrack && sTrack) navTrack.onclick=()=>show(sTrack)

  function load(){
    try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):{}}
    catch(e){return{}}
  }
  function save(data){localStorage.setItem(KEY,JSON.stringify(data))}

  function genCode(){return 'TRK-'+Math.random().toString(36).slice(2,9).toUpperCase()}

  // Create
  const formCreate=document.getElementById('form-create')
  const resultCreate=document.getElementById('create-result')
  if(formCreate){
    formCreate.addEventListener('submit',e=>{
      e.preventDefault()
      const name=document.getElementById('create-name').value.trim()
      const status=document.getElementById('create-status').value
      const note=document.getElementById('create-note').value.trim()
      if(!name && resultCreate) {resultCreate.textContent='Name required';return}
      const data=load()
      const code=genCode()
      const now=new Date().toISOString()
      data[code]={code,recipient:name,status,history:[{status,note,at:now}],created:now}
      save(data)
      if(resultCreate) resultCreate.innerHTML=`Created: <span class="track-code">${code}</span>`
      formCreate.reset()
    })
  }

  // Update
  const formUpdate=document.getElementById('form-update')
  const resultUpdate=document.getElementById('update-result')
  if(formUpdate){
    formUpdate.addEventListener('submit',e=>{
      e.preventDefault()
      const code=document.getElementById('update-code').value.trim().toUpperCase()
      const status=document.getElementById('update-status').value
      const note=document.getElementById('update-note').value.trim()
      const data=load()
      if(!data[code]){if(resultUpdate) resultUpdate.textContent='Tracking code not found';return}
      const now=new Date().toISOString()
      data[code].status=status
      data[code].history.unshift({status,note,at:now})
      save(data)
      if(resultUpdate) resultUpdate.textContent='Update saved'
      formUpdate.reset()
    })
  }

  // Track
  const formTrack=document.getElementById('form-track')
  const resultTrack=document.getElementById('track-result')
  if(formTrack){
    formTrack.addEventListener('submit',e=>{
      e.preventDefault()
      const code=document.getElementById('track-code').value.trim().toUpperCase()
      const data=load()
      const item=data[code]
      if(!item){if(resultTrack) resultTrack.textContent='Not found';return}
      renderTrack(item)
    })
  }

  function renderTrack(item){
    if(!resultTrack) return
    resultTrack.innerHTML=''
    const header=document.createElement('div')
    header.className='track-row'
    header.innerHTML=`<div><span class=\"track-code\">${item.code}</span> — ${item.recipient}</div><small>Current: ${item.status}</small>`
    resultTrack.appendChild(header)
    const hist=document.createElement('div')
    hist.className='history'
    item.history.forEach(h=>{
      const el=document.createElement('div')
      el.className='item'
      const time=new Date(h.at).toLocaleString()
      el.innerHTML=`<div><strong>${h.status}</strong> <small>${time}</small></div><div>${h.note||''}</div>`
      hist.appendChild(el)
    })
    resultTrack.appendChild(hist)
  }

  // Expose small helper for demo data
  window._deliveryDemo = function(){
    const data=load()
    const sample=genCode()
    data[sample]={code:sample,recipient:'Demo User',status:'In transit',created:new Date().toISOString(),history:[{status:'Created',note:'Order placed',at:new Date().toISOString()},{status:'In transit',note:'Left warehouse',at:new Date().toISOString()}]}
    save(data)
    alert('Demo created: '+sample)
  }

  // If page was opened with ?code=TRK-..., auto-run lookup (useful when coming from home quick-track)
  try{
    const params=new URLSearchParams(window.location.search)
    const pre=params.get('code')
    if(pre){
      const code=pre.trim().toUpperCase()
      const data=load()
      if(data[code]){
        // ensure track-result exists; if not, open track section when present
        const r=document.getElementById('track-result')
        if(r){ renderTrack(data[code]) }
        else {
          // if sections exist, show track section
          if(sTrack) show(sTrack)
          // small delay to allow render if elements are added later
          setTimeout(()=>{
            const r2=document.getElementById('track-result')
            if(r2) renderTrack(data[code])
          },200)
        }
      }
    }
  }catch(e){}
})
