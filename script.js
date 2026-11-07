var bingkai = document.getElementById('bingkai');
var tombolPilih = document.querySelectorAll('#pilihan button');
var btnTab = document.getElementById('btnTab');
var linkCadangan = document.getElementById('linkCadangan');
var memuat = document.getElementById('memuat');

function tampilMemuat(){
  memuat.classList.remove('hilang');
  clearTimeout(tampilMemuat.t);
  tampilMemuat.t = setTimeout(function(){ memuat.classList.add('hilang'); }, 8000);
}
bingkai.addEventListener('load', function(){ memuat.classList.add('hilang'); });
tampilMemuat();

function ganti(url, judul){
  tampilMemuat();
  bingkai.src = url;
  bingkai.title = judul || 'NASA Eyes';
  btnTab.href = url;
  linkCadangan.href = url;
}

tombolPilih.forEach(function(b){
  b.addEventListener('click', function(){
    tombolPilih.forEach(function(x){ x.setAttribute('aria-pressed','false'); });
    b.setAttribute('aria-pressed','true');
    ganti(b.getAttribute('data-url'), b.getAttribute('data-judul'));
  });
});

document.getElementById('btnMuat').addEventListener('click', function(){
  tampilMemuat();
  bingkai.src = bingkai.src;
});

document.getElementById('btnLayar').addEventListener('click', function(){
  var el = document.getElementById('layar');
  if (document.fullscreenElement) { document.exitFullscreen(); }
  else if (el.requestFullscreen) { el.requestFullscreen(); }
});

/* Latar bintang berkelip + bintang jatuh sesekali */
(function(){
  var c = document.getElementById('bintang'), ctx = c.getContext('2d');
  var diam = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bintang = [], jatuh = null, w, h, dpr;

  function ukur(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr;
    h = c.height = innerHeight * dpr;
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
    var n = Math.round(innerWidth * innerHeight / 2600);
    bintang = [];
    for (var i = 0; i < n; i++){
      bintang.push({
        x: Math.random()*w, y: Math.random()*h,
        r: (Math.random()*1.2 + .2) * dpr,
        f: Math.random()*Math.PI*2, s: Math.random()*.02 + .005,
        warna: Math.random() < .12 ? '253,230,138' : (Math.random() < .2 ? '165,243,252' : '255,255,255')
      });
    }
  }

  function gambar(){
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < bintang.length; i++){
      var b = bintang[i]; b.f += b.s;
      var a = diam ? .7 : .35 + Math.sin(b.f) * .35 + .3;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(' + b.warna + ',' + a + ')'; ctx.fill();
    }
    if (!diam){
      if (!jatuh && Math.random() < .004){
        jatuh = {x: Math.random()*w*.7 + w*.3, y: Math.random()*h*.3, v: 14*dpr, umur: 0};
      }
      if (jatuh){
        var g = ctx.createLinearGradient(jatuh.x, jatuh.y, jatuh.x + 90*dpr, jatuh.y - 45*dpr);
        g.addColorStop(0, 'rgba(255,255,255,.9)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.5*dpr;
        ctx.beginPath();
        ctx.moveTo(jatuh.x, jatuh.y);
        ctx.lineTo(jatuh.x + 90*dpr, jatuh.y - 45*dpr);
        ctx.stroke();
        jatuh.x -= jatuh.v; jatuh.y += jatuh.v/2; jatuh.umur++;
        if (jatuh.umur > 40) jatuh = null;
      }
      requestAnimationFrame(gambar);
    }
  }

  addEventListener('resize', function(){ ukur(); if (diam) gambar(); });
  ukur(); gambar();
})();
