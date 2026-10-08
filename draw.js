/* Креслення одного навчального будинку: Grundriss, Schnitt, Ansicht, Lageplan, Schalplan, Detail */
const PW=[[0,0,174,36.5],[375,0,686.5,36.5],[812.5,0,999,36.5],[0,712.5,711.5,749],[812.5,712.5,999,749],[0,36.5,36.5,712.5],[962.5,36.5,999,712.5],[537.5,36.5,561.5,600],[537.5,688.5,561.5,712.5],[561.5,387.5,600,399],[688.5,387.5,962.5,399]];
const tickS=(x,y)=>`<line class="k1" x1="${x-3}" y1="${y+3}" x2="${x+3}" y2="${y-3}"/>`;
function chains(X,Y){
  const hch=(y,cs,labs,under=[])=>{let s=`<line class="k1" x1="${X(cs[0])-5}" y1="${y}" x2="${X(cs.at(-1))+5}" y2="${y}"/>`;cs.forEach(c=>s+=tickS(X(c),y));
    labs.forEach((l,i)=>{const m=(X(cs[i])+X(cs[i+1]))/2;s+=`<text class="t" x="${m}" y="${y-4}" text-anchor="middle">${st(l)}</text>`;if(under[i])s+=`<text class="t" x="${m}" y="${y+11}" text-anchor="middle">${st(under[i])}</text>`});return s};
  const vch=(x,cs,labs)=>{let s=`<line class="k1" x1="${x}" y1="${Y(cs[0])-5}" x2="${x}" y2="${Y(cs.at(-1))+5}"/>`;cs.forEach(c=>s+=tickS(x,Y(c)));
    labs.forEach((l,i)=>{const m=(Y(cs[i])+Y(cs[i+1]))/2;s+=`<text class="t" transform="translate(${x-4} ${m}) rotate(-90)" text-anchor="middle">${st(l)}</text>`});return s};
  return{hch,vch};
}

function planSVG(err){
  const X=c=>100+c/2,Y=c=>60+c/2,{hch,vch}=chains(X,Y);
  const rc=(w,a)=>`<rect ${a} x="${X(w[0])}" y="${Y(w[1])}" width="${(w[2]-w[0])/2}" height="${(w[3]-w[1])/2}"/>`;
  const win=(a,b)=>`<rect class="win" x="${X(a)}" y="60" width="${(b-a)/2}" height="18.25"/><line class="k1" x1="${X(a)}" y1="69" x2="${X(b)}" y2="69"/>`;
  const stamp=(x,y,w,l)=>`<rect class="fo" x="${x}" y="${y}" width="${w}" height="${l.length*13+8}"/>`+l.map((t,i)=>`<text class="${i?'t':'t tb'}" x="${x+6}" y="${y+15+i*13}">${t}</text>`).join('');
  return `<svg viewBox="30 0 630 510" role="img" aria-label="Grundriss Erdgeschoss, Maßstab 1:50">
  ${PW.map(w=>rc(w,'class="wo"')).join('')}${PW.map(w=>rc(w,'fill="url(#hm)"')).join('')}
  ${win(174,375)}${win(686.5,812.5)}
  <line class="k1" x1="455.75" y1="416.25" x2="506.25" y2="416.25"/><line class="k1" x1="455.75" y1="434.5" x2="506.25" y2="434.5"/>
  <line class="k2" x1="455.75" y1="416.25" x2="455.75" y2="365.75"/><path class="k1" d="M455.75 365.75A50.5 50.5 0 0 1 506.25 416.25"/>
  <line class="k2" x1="368.75" y1="404.25" x2="324.5" y2="404.25"/><path class="k1" d="M324.5 404.25A44.25 44.25 0 0 1 368.75 360"/>
  <line class="k2" x1="444.25" y1="253.75" x2="444.25" y2="209.5"/><path class="k1" d="M444.25 209.5A44.25 44.25 0 0 0 400 253.75"/>
  <line class="k2" x1="118.25" y1="270" x2="368.75" y2="270" stroke-dasharray="0.1 4.5" stroke-linecap="round"/><line class="k2" x1="118.25" y1="282" x2="368.75" y2="282" stroke-dasharray="0.1 4.5" stroke-linecap="round"/>
  <text class="t" x="128" y="265">UZ 24/40</text>
  <rect class="fo" x="557.5" y="82.5" width="20" height="20"/><path class="fi" d="M557.5 102.5L577.5 82.5V102.5z"/><text class="t" x="553" y="96" text-anchor="end">DD 40/40</text>
  ${stamp(132,120,112,['01 Wohnen',err?'38,87 m²':'33,87 m²','Parkett','LH 2,60'])}${stamp(420,130,100,['02 Küche','14,08 m²','Fliesen'])}${stamp(470,290,100,['03 Flur','12,57 m²','Fliesen'])}
  <path class="fo" d="M150 340l-6-9h12z"/><line class="k1" x1="150" y1="340" x2="200" y2="340"/><text class="t" x="160" y="337">±0,00</text>
  <path class="fi" d="M150 358l-6-9h12z"/><line class="k1" x1="150" y1="358" x2="200" y2="358"/><text class="t" x="160" y="355">${err?'+0,15':'−0,15'}</text>
  <line class="sec" x1="260" y1="10" x2="260" y2="452" stroke-dasharray="18 5 3 5"/>
  <path class="secf" d="M260 6h14v-4l9 7-9 7v-4h-14zM260 446h14v-4l9 7-9 7v-4h-14z"/>
  <text class="sect" x="243" y="17">A</text><text class="sect" x="243" y="457">${err?'B':'A'}</text>
  ${hch(36,[0,174,375,686.5,812.5,999],['1,74','2,01','3,11^5',err?'1,30':'1,26','1,86^5'],['','1,38^5','','1,26',''])}
  ${hch(472,[0,36.5,537.5,561.5,962.5,999],['36^5',err?'5,10':'5,01','24','4,01','36^5'])}${hch(498,[0,999],['9,99'])}
  ${vch(76,[0,36.5,712.5,749],['36^5','6,76','36^5'])}${vch(52,[0,749],['7,49'])}
  <circle class="k1" cx="630" cy="62" r="14"/><path class="fi" d="M630 44l5 22-5-5-5 5z"/><text class="t tb" x="630" y="40" text-anchor="middle">N</text>
  <text class="t" x="655" y="506" text-anchor="end">Grundriss EG · M 1:50</text></svg>`;
}

function schnittSVG(){
  const X=c=>100+c*.6,Y=h=>250-h*.6;
  const R=(a,cls)=>`<rect ${cls} x="${X(a[0])}" y="${Y(a[3])}" width="${(a[2]-a[0])*.6}" height="${(a[3]-a[1])*.6}"/>`;
  const MW=[[0,-15,36.5,90],[0,228.5,36.5,260],[712.5,-15,749,260],[0,280,36.5,350],[712.5,280,749,350]];
  const BT=[[0,-35,749,-15],[-11.75,-110,48.25,-35],[700.75,-110,760.75,-35],[0,260,749,280],[420,240,444,260]];
  const kr=(h,l)=>`<line class="k1" x1="553" y1="${Y(h)}" x2="574" y2="${Y(h)}"/><path class="fi" d="M566 ${Y(h)}l-5-8h10z"/><text class="t" x="578" y="${Y(h)-3}">${l}</text>`;
  const earth=x=>`<path class="k1" d="M${x} 270l-5 7M${x+5} 270l-5 7M${x+10} 270l-5 7"/>`;
  return `<svg viewBox="20 20 660 320" role="img" aria-label="Schnitt A–A, Maßstab 1:50">
  ${[...MW,...BT].map(a=>R(a,'class="wo"')).join('')}${MW.map(a=>R(a,'fill="url(#hm)"')).join('')}${BT.map(a=>R(a,'fill="url(#hb)"')).join('')}
  ${R([36.5,-15,712.5,-6],'fill="url(#hd)" stroke="none"')}${R([36.5,-6,712.5,0],'class="est"')}
  ${R([36.5,280,712.5,289],'fill="url(#hd)" stroke="none"')}${R([36.5,289,712.5,295],'class="est"')}
  ${R([12,90,24,228.5],'class="win"')}<line class="k1" x1="${X(18)}" y1="${Y(90)}" x2="${X(18)}" y2="${Y(228.5)}"/>
  <line class="k2" x1="36" y1="268" x2="${X(-11.75)}" y2="268"/><line class="k2" x1="${X(760.75)}" y1="268" x2="612" y2="268"/>${earth(48)}${earth(72)}${earth(585)}
  <path class="fo" d="M78 268l-5-8h10z"/><text class="t" x="70" y="264" text-anchor="end">−0,30</text><text class="t" x="70" y="253" text-anchor="end">GOK</text>
  ${kr(280,'+2,80 OK RD')}${kr(-15,'−0,15 OK RFB')}${kr(-110,'−1,10 UK FU')}
  <path class="fo" d="M${X(560)} ${Y(0)}l-5-8h10z"/><text class="t" x="${X(560)+9}" y="${Y(0)-4}">±0,00 OK FFB</text>
  <path class="fo" d="M${X(560)} ${Y(295)}l-5-8h10z"/><text class="t" x="${X(560)+9}" y="${Y(295)-4}">+2,95 OK FFB</text>
  <path class="fi" d="M${X(520)} ${Y(260)}l-5 8h10z"/><text class="t" x="${X(520)+9}" y="${Y(260)+10}">+2,60 UK RD</text>
  <text class="t" x="${X(432)}" y="${Y(240)+11}" text-anchor="middle">UZ 24/40</text><text class="t" x="${X(432)}" y="${Y(240)+22}" text-anchor="middle">UK +2,40</text>
  <line class="k1" x1="145" y1="${Y(0)+4}" x2="145" y2="${Y(228.5)-4}"/>${[0,90,228.5].map(h=>`<line class="k1" x1="142" y1="${Y(h)+3}" x2="148" y2="${Y(h)-3}"/>`).join('')}
  <text class="t" transform="translate(141 ${Y(45)}) rotate(-90)" text-anchor="middle">BRH 90</text><text class="t" transform="translate(141 ${Y(159)}) rotate(-90)" text-anchor="middle">${st('1,38^5')}</text>
  <text class="t tb" x="${X(250)}" y="${Y(120)}" text-anchor="middle">EG</text><text class="t tb" x="${X(250)}" y="${Y(315)}" text-anchor="middle">OG</text>
  <text class="t" x="672" y="334" text-anchor="end">Schnitt A–A · M 1:50</text></svg>`;
}

function ansichtSVG(){
  const X=v=>90+v*.5,Y=h=>350-h*.5;
  const win=(a,b,h1,h2,two)=>{const x=X(a),y=Y(h2),w=(b-a)*.5,h=(h2-h1)*.5,m=x+w/2;
    let s=`<rect class="win" x="${x}" y="${y}" width="${w}" height="${h}"/><rect class="k1" x="${x+3}" y="${y+3}" width="${w-6}" height="${h-6}"/>`;
    s+=two?`<line class="k1" x1="${m}" y1="${y+3}" x2="${m}" y2="${y+h-3}"/><path class="k1" d="M${m} ${y+3}L${x+3} ${y+h/2}L${m} ${y+h-3}M${m} ${y+3}L${x+w-3} ${y+h/2}L${m} ${y+h-3}"/>`:`<path class="k1" d="M${x+w-3} ${y+3}L${x+3} ${y+h/2}L${x+w-3} ${y+h-3}"/>`;
    return s+`<line class="k2" x1="${x-3}" y1="${y+h+1}" x2="${x+w+3}" y2="${y+h+1}"/>`};
  const kr=(h,l,f)=>`<line class="k1" x1="592" y1="${Y(h)}" x2="614" y2="${Y(h)}"/><path class="${f?'fi':'fo'}" d="M606 ${Y(h)}l-5-8h10z"/><text class="t" x="618" y="${Y(h)-3}">${l}</text>`;
  const dash=h=>`<line class="k1" stroke-dasharray="7 4" x1="${X(0)}" y1="${Y(h)}" x2="${X(999)}" y2="${Y(h)}"/>`;
  return `<svg viewBox="20 15 700 388" role="img" aria-label="Ansicht Nord, Maßstab 1:100">
  <rect class="win" style="stroke-width:2" x="${X(0)}" y="${Y(625)}" width="499.5" height="327.5"/>
  <rect class="est" x="${X(0)}" y="${Y(0)}" width="499.5" height="15"/><rect class="fi" x="${X(-6)}" y="${Y(631)}" width="505.5" height="3.5"/>
  ${dash(260)}${dash(280)}${dash(555)}${dash(575)}
  ${win(186.5,312.5,90,216)}${win(624,825,90,228.5,1)}${win(186.5,312.5,385,511)}${win(624,825,385,511,1)}
  <line class="k1" x1="${X(955)}" y1="${Y(-30)}" x2="${X(955)}" y2="${Y(615)}"/><line class="k1" x1="${X(965)}" y1="${Y(-30)}" x2="${X(965)}" y2="${Y(615)}"/>
  <line class="k3" x1="36" y1="${Y(-30)}" x2="592" y2="${Y(-30)}"/><line class="k1" stroke-dasharray="7 4" x1="36" y1="${Y(-52)}" x2="592" y2="${Y(-14)}"/>
  <text class="t" x="300" y="377">gepl. Gelände</text><text class="t" x="40" y="390">vorh. Gelände</text>
  ${kr(625,'+6,25 OK Attika',1)}${kr(295,'+2,95 OK FFB OG')}${kr(0,'±0,00 OK FFB EG')}${kr(-30,'−0,30 GOK')}
  <text class="t" x="712" y="399" text-anchor="end">Ansicht Nord · M 1:100</text></svg>`;
}

function lageSVG(){
  const X=m=>70+m*13,Y=m=>40+m*13;
  const gp=(x,y)=>`<circle class="fo" cx="${X(x)}" cy="${Y(y)}" r="3.5"/>`;
  const hp=(x,y,t)=>`<path class="k1" d="M${x-4} ${y}h8M${x} ${y-4}v8"/><text class="t" x="${x+7}" y="${y+3}">${t}</text>`;
  return `<svg viewBox="0 0 600 440" role="img" aria-label="Lageplan, Maßstab 1:500">
  <rect class="est" x="40" y="${Y(24)}" width="470" height="40"/><text class="t tb" x="275" y="${Y(24)+24}" text-anchor="middle">Musterstraße</text>
  <rect class="k2" x="${X(0)}" y="${Y(0)}" width="390" height="312"/>${gp(0,0)}${gp(30,0)}${gp(30,24)}${gp(0,24)}
  <rect class="k1" stroke-dasharray="14 4 2 4" x="${X(3)}" y="${Y(3)}" width="${24*13}" height="${18*13}"/><text class="t" x="${X(20)}" y="${Y(21)-5}">Baugrenze</text>
  <rect class="k1" stroke-dasharray="3 3" x="${X(2)}" y="${Y(0)}" width="${15.99*13}" height="${13.49*13}"/><text class="t" x="${X(9.6)}" y="${Y(13.49)-5}">Abstandsfläche</text>
  <rect class="est" x="${X(6.2)}" y="${Y(10.49)}" width="40" height="${13.51*13}"/><text class="t" transform="translate(${X(6.2)+23} ${Y(19)}) rotate(-90)" text-anchor="middle">Zufahrt</text>
  <line class="k1" stroke-dasharray="7 4" x1="${X(12.7)}" y1="${Y(10.49)}" x2="${X(12.7)}" y2="${Y(24)+20}"/><text class="t" transform="translate(${X(12.7)+12} ${Y(19)}) rotate(-90)" text-anchor="middle">SW · TW · ELT</text>
  <rect class="bx" fill="url(#hm)" x="${X(5)}" y="${Y(3)}" width="${9.99*13}" height="${7.49*13}"/>
  <rect class="fo" x="${X(5)+12}" y="${Y(3)+22}" width="106" height="46"/><text class="t tb" x="${X(5)+18}" y="${Y(3)+36}">Neubau EFH</text><text class="t" x="${X(5)+18}" y="${Y(3)+48}">II · FD</text><text class="t" x="${X(5)+18}" y="${Y(3)+60}">±0,00 = 112,45</text>
  <line class="k1" x1="${X(10)}" y1="${Y(0)}" x2="${X(10)}" y2="${Y(3)}"/>${tickS(X(10),Y(0))}${tickS(X(10),Y(3))}<text class="t" x="${X(10)+5}" y="${Y(1.7)}">3,00</text>
  <line class="k1" x1="${X(0)}" y1="${Y(6.7)}" x2="${X(5)}" y2="${Y(6.7)}"/>${tickS(X(0),Y(6.7))}${tickS(X(5),Y(6.7))}<text class="t" x="${X(2.5)}" y="${Y(6.7)-4}" text-anchor="middle">5,00</text>
  ${hp(86,338,'112,10')}${hp(410,58,'112,30')}${hp(300,170,'112,15')}
  <text class="t tb" x="${X(22)}" y="${Y(15)}" text-anchor="middle">Flst. 123/4</text><text class="t" x="35" y="${Y(12)}" text-anchor="middle">123/3</text><text class="t" x="500" y="${Y(12)}" text-anchor="middle">123/5</text>
  <circle class="k1" cx="550" cy="62" r="14"/><path class="fi" d="M550 44l5 22-5-5-5 5z"/><text class="t tb" x="550" y="40" text-anchor="middle">N</text>
  <rect class="fi" x="70" y="418" width="65" height="5"/><rect class="fo" x="135" y="418" width="65" height="5"/><text class="t" x="70" y="414" text-anchor="middle">0</text><text class="t" x="135" y="414" text-anchor="middle">5</text><text class="t" x="200" y="414" text-anchor="middle">10 m</text>
  <text class="t" x="590" y="432" text-anchor="end">Lageplan · M 1:500</text></svg>`;
}

function schalSVG(){
  const X=c=>100+c/2,Y=c=>60+c/2,{hch}=chains(X,Y);
  const r=(a,cls)=>`<rect ${cls} x="${X(a[0])}" y="${Y(a[1])}" width="${(a[2]-a[0])/2}" height="${(a[3]-a[1])/2}"/>`;
  const axV=(c,l)=>`<line class="k1" stroke-dasharray="14 3 2 3" x1="${X(c)}" y1="34" x2="${X(c)}" y2="450"/><circle class="fo" cx="${X(c)}" cy="24" r="9"/><text class="t tb" x="${X(c)}" y="27.5" text-anchor="middle">${l}</text>`;
  const axH=(c,l)=>`<line class="k1" stroke-dasharray="14 3 2 3" x1="66" y1="${Y(c)}" x2="612" y2="${Y(c)}"/><circle class="fo" cx="56" cy="${Y(c)}" r="9"/><text class="t tb" x="56" y="${Y(c)+3.5}" text-anchor="middle">${l}</text>`;
  const ar=(x1,y1,x2,y2)=>{const v=x1===x2;return `<line class="k1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><path class="fi" d="${v?`M${x1} ${y1}l-4 9h8zM${x2} ${y2}l-4-9h8z`:`M${x1} ${y1}l9-4v8zM${x2} ${y2}l-9-4v8z`}"/>`};
  const bt=['Decke über EG','Beton C25/30','XC1 · WO','Betonstahl B500B','c nom = 20 mm','Schalung SB 2'];
  return `<svg viewBox="30 0 705 510" role="img" aria-label="Schalplan Decke über EG, Maßstab 1:50">
  ${r([0,0,999,749],'class="bx" fill="url(#hm)"')}${r([36.5,36.5,537.5,712.5],'class="fo"')}${r([561.5,36.5,962.5,712.5],'class="fo"')}
  <line class="k2" x1="${X(36.5)}" y1="${Y(420)}" x2="${X(537.5)}" y2="${Y(420)}"/><line class="k2" x1="${X(36.5)}" y1="${Y(444)}" x2="${X(537.5)}" y2="${Y(444)}"/><text class="t tb" x="128" y="${Y(420)-5}">UZ1 24/40</text>
  <rect class="fo" x="557.5" y="82.5" width="20" height="20"/><path class="k1" d="M557.5 82.5l20 20M577.5 82.5l-20 20"/><text class="t" x="553" y="96" text-anchor="end">DD 40/40</text>
  <text class="t tb" x="${X(200)}" y="${Y(210)}" text-anchor="middle">D1  d = 20</text>${ar(X(420),Y(70),X(420),Y(390))}
  <text class="t tb" x="${X(760)}" y="${Y(300)}" text-anchor="middle">D2  d = 20</text>${ar(X(585),Y(420),X(940),Y(420))}
  <path class="fi" d="M450 340l-5-8h10z"/><text class="t" x="459" y="337">+2,80 OK RD</text><path class="fi" d="M450 350l-5 8h10z"/><text class="t" x="459" y="359">+2,60 UK RD</text>
  ${axV(18.25,'A')}${axV(549.5,'B')}${axV(980.75,'C')}${axH(18.25,'1')}${axH(730.75,'2')}
  <rect class="fo" x="618" y="62" width="110" height="${bt.length*13+8}"/>${bt.map((t,i)=>`<text class="${i?'t':'t tb'}" x="624" y="${77+i*13}">${t}</text>`).join('')}
  ${hch(472,[0,36.5,537.5,561.5,962.5,999],['36^5','5,01','24','4,01','36^5'])}${hch(498,[0,999],['9,99'])}
  <text class="t" x="728" y="506" text-anchor="end">Schalplan Decke über EG · M 1:50</text></svg>`;
}

function detailSVG(){
  const X=c=>130+c*2.4,Y=h=>150-h*2.4;
  const R=(x1,h1,x2,h2,a)=>`<rect ${a} x="${X(x1)}" y="${Y(h2)}" width="${(x2-x1)*2.4}" height="${(h2-h1)*2.4}"/>`;
  const tx=['Fußbodenaufbau EG','1,0  Bodenbelag','5,0  Zementestrich','–    Trennlage PE-Folie','9,0  Wärmedämmung','–    Abdichtung','20,0 Stb-Bodenplatte','15,0 kapillarbr. Schicht','','Wandaufbau','1,5  Innenputz','36,5 Mauerwerk','2,0  Außenputz'];
  return `<svg viewBox="20 15 650 290" role="img" aria-label="Sockeldetail, Maßstab 1:10">
  ${R(-11.75,-60,48.25,-35,'class="bx" fill="url(#hb)"')}${R(48.25,-50,110,-35,'class="s1" fill="url(#hk)"')}${R(0,-35,110,-15,'class="bx" fill="url(#hb)"')}
  ${R(0,-15,36.5,50,'class="bx" fill="url(#hm)"')}${R(36.5,0,38,50,'class="est"')}${R(-2,30,0,50,'class="est"')}${R(-5,-60,0,30,'class="s1" fill="url(#hd)"')}
  ${R(36.5,-15,110,-6,'class="s1" fill="url(#hd)"')}${R(37.5,-6,110,-1,'class="est"')}${R(37.5,-1,110,0,'class="fi"')}${R(36.5,-6,37.5,0,'class="fo"')}
  <line class="k1" stroke-dasharray="5 3" x1="${X(37.5)}" y1="${Y(-6)}" x2="${X(110)}" y2="${Y(-6)}"/>
  <path class="k3" d="M${X(110)} ${Y(-15)}H${X(0)}M${X(0)} ${Y(-60)}V${Y(30)}"/>
  <line class="k2" x1="30" y1="${Y(-30)}" x2="${X(-5)}" y2="${Y(-30)}"/><path class="k1" d="M44 224l-5 7M49 224l-5 7M54 224l-5 7M84 224l-5 7M89 224l-5 7M94 224l-5 7"/>
  <path class="fo" d="M46 ${Y(-30)}l-5-8h10z"/><text class="t" x="55" y="${Y(-30)-4}">−0,30 GOK</text>
  <path class="fo" d="M${X(85)} ${Y(0)}l-5-8h10z"/><text class="t" x="${X(85)+9}" y="${Y(0)-4}">±0,00</text>
  <text class="t" x="50" y="60" text-anchor="middle">außen</text><text class="t" x="${X(75)}" y="60" text-anchor="middle">innen</text>
  ${tx.map((t,i)=>t?`<text class="${/aufbau/.test(t)?'t tb':'t'}" x="420" y="${50+i*14}" xml:space="preserve">${t}</text>`:'').join('')}
  <text class="t" x="662" y="298" text-anchor="end">Sockeldetail · M 1:10</text></svg>`;
}

function isoSVG(m){
  const k=13,p=(x,y,z)=>[(170+(x-y)*.866*k).toFixed(1),(150+(x+y)*.5*k-z*k).toFixed(1)];
  const pg=(pts,cls)=>`<polygon class="${cls}" points="${pts.map(q=>p(...q).join(',')).join(' ')}"/>`;
  let s=pg([[0,7.5,0],[10,7.5,0],[10,7.5,6],[0,7.5,6]],'fo')+pg([[10,0,0],[10,7.5,0],[10,7.5,6],[10,0,6]],'est')+pg([[0,0,6],[10,0,6],[10,7.5,6],[0,7.5,6]],'fo');
  [[1.5,1,3.5,2.4],[6,1,7.3,2.3],[1.5,4,3.5,5.2],[6,4,7.3,5.2]].forEach(w=>s+=pg([[w[0],7.5,w[1]],[w[2],7.5,w[1]],[w[2],7.5,w[3]],[w[0],7.5,w[3]]],'win'));
  s+=pg([[10,3,0],[10,4,0],[10,4,2.1],[10,3,2.1]],'win');
  if(m==='g')s+=pg([[-1.5,-1.5,1],[11.5,-1.5,1],[11.5,9,1],[-1.5,9,1]],'cut');
  if(m==='s')s+=pg([[3.2,-1.5,-.5],[3.2,9,-.5],[3.2,9,7],[3.2,-1.5,7]],'cut');
  if(m==='a'){const a=p(5,13,2.5),b=p(5,8,2.5);s+=`<line class="sec" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/><circle class="secf" cx="${a[0]}" cy="${a[1]}" r="5"/><circle class="secf" cx="${b[0]}" cy="${b[1]}" r="2.5"/><text class="sect" x="${+a[0]-8}" y="${+a[1]+18}">Blick</text>`}
  return `<svg viewBox="30 50 320 240" role="img" aria-label="Будинок і площина розрізу">${s}</svg>`;
}
