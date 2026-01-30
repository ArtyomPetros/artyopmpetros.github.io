if('serviceWorker'in navigator){
 navigator.serviceWorker.register('./sw.js').catch(()=>{});
}

const map=L.map('map',{center:window.__CENTER__,zoom:6,tap:true});
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);

function popup(p,t){
 let r='';
 for(const k in p) if(!k.startsWith('_'))
   r+=`<tr><td><b>${k}</b></td><td>${p[k]}</td></tr>`;
 return `<b>${t}</b><table>${r}</table>`;
}

L.geoJSON(window.__MLN_DATA__,{
 pointToLayer:(_,ll)=>L.circleMarker(ll,{radius:4,color:'#1f77b4'}),
 onEachFeature:(f,l)=>l.bindPopup(popup(f.properties,'MLN'))
}).addTo(map);

L.geoJSON(window.__HS_DATA__,{
 pointToLayer:(_,ll)=>L.circleMarker(ll,{radius:4,color:'#d62728'}),
 onEachFeature:(f,l)=>l.bindPopup(popup(f.properties,'HS'))
}).addTo(map);

// GEOLOCATION
let m=null,a=null;
document.getElementById('btn-gps').onclick=()=>{
 if(!navigator.geolocation){alert('Нет геолокации');return;}
 if(!window.isSecureContext){alert('Нужен HTTPS');return;}
 navigator.geolocation.watchPosition(p=>{
  const ll=[p.coords.latitude,p.coords.longitude];
  if(m)map.removeLayer(m); if(a)map.removeLayer(a);
  m=L.circleMarker(ll,{radius:7,color:'#2ca02c'}).addTo(map);
  a=L.circle(ll,{radius:p.coords.accuracy,fillOpacity:.12}).addTo(map);
  map.setView(ll,15);
  document.getElementById('geo-status').textContent='Геолокация: OK';
 });
};
