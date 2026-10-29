(function(){
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var links=document.querySelectorAll('nav a');
addEventListener('keydown',function(e){if(e.ctrlKey||e.metaKey||e.altKey)return;var t=e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;var link=links[Number(e.key)-1];if(link)location.href=link.href});
var lines=document.querySelectorAll('[data-type]');
lines.forEach(function(el){el.dataset.full=el.textContent;if(!reduce)el.textContent=''});
if(!reduce){var i=0;(function next(){if(i>=lines.length)return;var el=lines[i++],s=el.dataset.full,n=0;
(function tick(){el.textContent=s.slice(0,++n);if(n<s.length)setTimeout(tick,16);else setTimeout(next,120)})()})()}
var cv=document.getElementById('radar');if(!cv)return;
var x=cv.getContext('2d'),S=0,blips=[],codes=['CN','RU','US','BR','IN','VN','DE','NL','ID','KR'];
function size(){var r=cv.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=S=r.width*d;cv.height=r.height*d}
size();addEventListener('resize',size);
var ang=0;
function draw(){var c=S/2,R=c-4;x.clearRect(0,0,S,S);
x.strokeStyle='rgba(77,243,255,.25)';x.lineWidth=1;
for(var k=1;k<=4;k++){x.beginPath();x.arc(c,c,R*k/4,0,7);x.stroke()}
x.beginPath();x.moveTo(c,c-R);x.lineTo(c,c+R);x.moveTo(c-R,c);x.lineTo(c+R,c);x.stroke();
var g=x.createConicGradient(ang-1.2,c,c);g.addColorStop(0,'rgba(77,243,255,0)');g.addColorStop(.19,'rgba(77,243,255,.5)');g.addColorStop(.2,'rgba(77,243,255,0)');
x.fillStyle=g;x.beginPath();x.arc(c,c,R,0,7);x.fill();
if(Math.random()<.04){var a=Math.random()*6.28,r=(.25+Math.random()*.7)*R;blips.push({x:c+Math.cos(a)*r,y:c+Math.sin(a)*r,t:1,k:codes[Math.random()*codes.length|0]})}
blips=blips.filter(function(b){return b.t>0});
blips.forEach(function(b){b.t-=.006;x.fillStyle='rgba(255,79,163,'+b.t+')';x.beginPath();x.arc(b.x,b.y,S/90*(1+(1-b.t)*2),0,7);x.fill();
x.strokeStyle='rgba(255,79,163,'+b.t*.7+')';x.beginPath();x.arc(b.x,b.y,S/40*(2-b.t),0,7);x.stroke();
x.fillStyle='rgba(255,185,56,'+b.t+')';x.font=(S/24)+'px VT323,monospace';x.fillText(b.k,b.x+S/40,b.y-S/60)});
ang+=.025;if(!reduce)requestAnimationFrame(draw)}
reduce?(blips=[],draw()):draw();
})();
