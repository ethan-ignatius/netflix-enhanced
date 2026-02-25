(function(){"use strict";const b={OVERLAY_ENABLED:"overlayEnabled",TMDB_API_KEY:"tmdbApiKey",TMDB_CACHE:"tmdbCache",TMDB_FEATURE_CACHE:"tmdbFeatureCache",MATCH_PROFILE:"matchProfile",LETTERBOXD_INDEX:"lb_index_v1",LETTERBOXD_STATS:"lb_stats_v1",LAST_IMPORT_AT:"lastImportAt"},f=(...t)=>{console.log("[Netflix+Letterboxd]",...t)},z=t=>t?t.toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9']+/g," ").replace(/\s+/g," ").trim():"",ct=(t,e)=>{const n=z(t),i=e?String(e):"";return`${n}-${i}`},dt=(t,e)=>ct(t,e),j=async()=>(f("Loading storage state"),chrome.storage.local.get([b.OVERLAY_ENABLED,b.TMDB_API_KEY,b.TMDB_CACHE,b.TMDB_FEATURE_CACHE,b.MATCH_PROFILE,b.LETTERBOXD_INDEX,b.LETTERBOXD_STATS,b.LAST_IMPORT_AT])),ut=async t=>{f("Saving storage state",t),await chrome.storage.local.set(t)},ft=["[role='dialog']","[aria-modal='true']","[aria-expanded='true']","[data-uia*='jawbone']","[class*='jawbone']","[data-uia*='preview']","[data-uia*='billboard']","[data-uia*='hero']","[data-uia*='details']"],ht=["h1","h2","h3","[data-uia*='title']","[class*='title']","[class*='fallback']","[class*='preview'] [class*='header']"],X=["video","img","[data-uia*='preview'] video","[data-uia*='preview'] img","[class*='preview'] video","[class*='preview'] img","[data-uia*='player'] video","[data-uia*='hero'] img"],K=["[data-uia*='controls']","[class*='controls']","[class*='control']","[role='toolbar']"],U=/(S\d+\s*:?\s*E\d+|Season\s*\d+\s*Episode\s*\d+|Episode\s*\d+|\bE\d+\b)/i,G=/(\b\d+\s*(m|min|minutes)\b|\b\d+\s*of\s*\d+\s*(m|min|minutes)\b)/i,gt=/\b(tv-[a-z0-9]+|pg-?13|pg|tv-ma|tv-y|tv-g|nr|nc-17|hd|uhd|4k|seasons?|season|episode|volume|part\s+\d+)\b/i,mt=/^(play|resume|continue|more info|details|watch|watch now|watch again|add|added|my list|remove|rate|like|dislike|thumbs up|thumbs down)$/i,pt=/because you watched/i,$=["[data-uia*='maturity-rating']","[data-uia*='season']","[data-uia*='resolution']","[data-uia*='hd']","[class*='maturity']","[class*='season']","[class*='quality']"],J=["[data-uia*='genre']","a[href*='/genre/']","[class*='genre']"],Q=[...$,...J,"[data-uia*='metadata']","[class*='metadata']","[class*='meta']","[class*='maturity']","[class*='season']","[class*='genre']","[class*='tag']","[class*='info']"],bt=["header","nav","[data-uia*='header']","[data-uia*='row-title']","[class*='rowHeader']","[class*='row-title']"],O=["h1","h2","h3","h4","[data-uia*='title']","[class*='title']","[class*='headline']","[class*='header']","[class*='name']"],Et=/(browse|home|my list|popular|your next watch|explore all|movies & shows|movies and shows|new & popular)/i,E=t=>{const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return!1;const n=window.getComputedStyle(t);return n.visibility==="hidden"||n.display==="none"||n.opacity==="0"?!1:e.bottom>=0&&e.right>=0&&e.top<=window.innerHeight&&e.left<=window.innerWidth},y=t=>{if(!t)return;const e=t.replace(/\s+/g," ").trim();return e.length?e:void 0},yt=t=>{if(!t)return;const e=t.match(/\/title\/(\d+)/);return e==null?void 0:e[1]},xt=t=>{if(!t)return;const e=t.match(/(19\d{2}|20\d{2})/);if(!e)return;const n=Number(e[1]);if(!Number.isNaN(n))return n},x=t=>{if(!t)return;let e=t;return e=e.replace(/^\s*S\d+\s*:?\s*E\d+\s*/i,""),e=e.replace(/"[^"]*"/g,n=>{const i=n.replace(/"/g,"");return U.test(i)?"":n}),e=e.replace(/Episode\s*\d+/gi,""),e=e.replace(/\bE\d+\b/gi,""),e=e.replace(G,""),e=e.replace(/\s+of\s+\d+\s*(m|min|minutes)?/gi,""),e=e.replace(/\s+/g," ").trim(),e.length?e:void 0},Tt=t=>{for(const e of ht){const n=t.querySelector(e);if(n&&E(n)){const i=y(n.textContent);if(i)return i}}},wt=t=>{if(t)return Tt(t)},D=t=>{if(!t)return null;const e=[];return X.forEach(n=>{t.querySelectorAll(n).forEach(i=>{E(i)&&e.push(i)})}),e.length?e.reduce((n,i)=>{const a=n.getBoundingClientRect(),r=i.getBoundingClientRect(),o=a.width*a.height;return r.width*r.height>o?i:n}):null},S=t=>{var a;if(!t)return null;const e=[];K.forEach(r=>{t.querySelectorAll(r).forEach(o=>{E(o)&&e.push(o)})});const i=Array.from(new Set(e)).map(r=>{const o=r.querySelectorAll("button, [role='button']").length,s=r.getBoundingClientRect(),l=o*10+s.width;return{el:r,score:l,top:s.top}}).filter(r=>r.score>0);return i.sort((r,o)=>o.score-r.score||o.top-r.top),((a=i[0])==null?void 0:a.el)??null},At=t=>{if(!t)return!1;const e=[...$,...J].join(",");return Array.from(t.querySelectorAll(e)).some(i=>E(i))},Ct=t=>!!t.closest(Q.join(",")),B=t=>!!t.closest(bt.join(",")),w=t=>Et.test(t)||mt.test(t.trim())||pt.test(t)||gt.test(t)?!0:U.test(t)||G.test(t)||/\b\d+\s*of\s*\d+\s*(m|min|minutes)?\b/i.test(t)||/\b\d+\s*(m|min|minutes)\b/i.test(t),M=(t,e)=>t.closest('[role="progressbar"], [data-uia*="progress"], [class*="progress"]')?!0:e!==void 0?t.getBoundingClientRect().bottom>=e-8:!1,N=(t,e)=>t?e&&(e.contains(t)||t.closest("button, [role='button']"))?!0:!!t.closest("button, [role='button'], [data-uia*='play'], [data-uia*='button']"):!1,vt=t=>{const e=t.getBoundingClientRect(),n=S(t),i=n?n.getBoundingClientRect().top:void 0,a=Array.from(t.querySelectorAll(O.join(",")));let r,o=0;const s=[];if(a.forEach(c=>{if(!E(c)){o+=1;return}if(B(c)){o+=1;return}if(N(c,n)){o+=1;return}if(M(c,i)){o+=1;return}const u=y(c.textContent);if(!u||u.length<2||u.length>80){o+=1;return}if(w(u)){s.push(c),o+=1;return}const h=c.getBoundingClientRect(),g=window.getComputedStyle(c),p=parseFloat(g.fontSize)||14,m=g.fontWeight==="bold"?700:Number(g.fontWeight),d=Number.isNaN(m)?400:m,V=h.left-e.left,le=h.top-e.top,ce=Math.hypot(V,le),de=Ct(c)?120:0,lt=p*10+d/10+Math.max(0,300-ce)-de;(!r||lt>r.score)&&(r={el:c,score:lt,text:u})}),r)return{title:x(r.text)??r.text,chosen:r.el,rejectedCount:o};for(const c of s){let u=c.parentElement,h=0;for(;u&&h<4;){const g=Array.from(u.querySelectorAll(O.join(","))).filter(p=>p!==c);for(const p of g){if(!E(p)||N(p,n)||M(p,i))continue;const m=y(p.textContent);if(!(!m||m.length<2||m.length>80)&&!w(m))return{title:x(m)??m,chosen:p,rejectedCount:o}}u=u.parentElement,h+=1}}const l=t.querySelector("a[href^='/title/']");if(l){const c=l.querySelector(O.join(",")),u=y((c==null?void 0:c.textContent)||l.textContent);if(u&&!w(u))return{title:x(u)??u,chosen:c??l,rejectedCount:o};let h=l.parentElement,g=0;for(;h&&g<4;){const p=Array.from(h.querySelectorAll(O.join(",")));for(const m of p){if(!E(m)||N(m,n)||M(m,i))continue;const d=y(m.textContent);if(!(!d||d.length<2||d.length>80)&&!w(d))return{title:x(d)??d,chosen:m,rejectedCount:o}}h=h.parentElement,g+=1}}return{title:null,rejectedCount:o}},_t=t=>{const n=Array.from(t.querySelectorAll(Q.join(","))).map(l=>y(l.textContent)).filter(Boolean);if(!n.length){const l=S(t),c=l==null?void 0:l.nextElementSibling,u=y(c==null?void 0:c.textContent);u&&n.push(u)}const i=n.join(" "),a=xt(i),r=/\bseasons?\b/i.test(i),o=/\b\d+\s*(m|min|minutes)\b/i.test(i)||/\b\d+\s*h\b/i.test(i);let s;return r?s=!0:o&&(s=!1),{year:a,isSeries:s}},I=t=>{var n,i;const e=[t.getAttribute("aria-label"),t.getAttribute("title"),(n=t.querySelector("img[alt]"))==null?void 0:n.alt,(i=t.querySelector("[aria-label]"))==null?void 0:i.getAttribute("aria-label"),t.textContent];for(const a of e){const r=y(a);if(r&&!w(r))return r}},Rt=t=>{var i,a,r,o,s;const e=t,n=[((i=e.getAttribute)==null?void 0:i.call(e,"aria-label"))??void 0,((a=e.getAttribute)==null?void 0:a.call(e,"data-uia-title"))??void 0,((r=e.getAttribute)==null?void 0:r.call(e,"title"))??void 0,(s=(o=e.querySelector)==null?void 0:o.call(e,"img[alt]"))==null?void 0:s.alt,e.textContent];for(const l of n){const c=y(l);if(c&&!w(c)&&!B(e))return c}},St=(t,e,n)=>{const a=Array.from(t.querySelectorAll("a[href^='/title/']")).filter(s=>E(s));if(!a.length)return null;const r=e==null?void 0:e.getBoundingClientRect();let o=null;for(const s of a){if(B(s)||N(s,n)||!I(s))continue;const c=s.getBoundingClientRect(),u=c.width*c.height;let h=0;if(r){const g=r.top-220,p=r.bottom+220;if(c.bottom<g||c.top>p)continue}if(e&&(s.contains(e)||e.contains(s))&&(h+=1e3),r){const g=c.left+c.width/2-(r.left+r.width/2),p=c.top+c.height/2-(r.top+r.height/2),m=Math.hypot(g,p);h+=Math.max(0,500-m)}h+=Math.min(u/100,200),h+=50,(!o||h>o.score)&&(o={anchor:s,score:h})}return(o==null?void 0:o.anchor)??null},Lt=t=>{if(t){const e=Ot(t);if(e)return e}return Dt()},H=(t,e,n)=>{const i=z(t);if(!i)return null;const a=(e==null?void 0:e.getAttribute("href"))??null,r=yt(a)??null,{year:o,isSeries:s}=_t(n);return{rawTitle:t,normalizedTitle:i,year:o??null,isSeries:s,netflixId:r,href:a}},Ot=t=>{const e=It(t);let n,i=null;if(e){const o=I(e);o&&(n=x(o)??o,i=e)}if(!n){let o=t,s=0;for(;o&&o!==document.body&&s<8;){const l=Rt(o);if(l){n=x(l)??l;break}o=o.parentElement,s+=1}}if(!n)return null;if(i){const o=Ht(i);if(o){const s=H(n,i,o);return s?{jawboneEl:o,extracted:s,chosenTitleElement:i}:null}}let a=i??t,r=0;for(;a&&a!==document.body&&r<8;){if(a instanceof HTMLElement){const o=a.getBoundingClientRect();if(o.width>=200&&o.height>=120){const s=H(n,i,a);if(s)return{jawboneEl:a,extracted:s,chosenTitleElement:i??void 0}}}a=a.parentElement,r+=1}return null},Dt=()=>{const t=Mt(),e=kt().map(r=>({root:r,preview:D(r)})),n=t?[{root:t.root,preview:t.preview},...e.filter(r=>r.root!==t.root)]:e,i=window.innerWidth*.85,a=window.innerHeight*.6;for(const r of n){const o=r.root,s=o.getBoundingClientRect();if(s.width>i||s.height>a)continue;const l=r.preview??D(o),c=S(o),u=At(o);if(!l||!c)continue;const h=St(o,l,c);let g=null,p=null;if(h){const d=I(h);d&&(g=x(d)??d,p=h)}if(g||(g=vt(o).title??null),!g&&!u)continue;if(!g&&u){const d=wt(o);d&&!w(d)&&(g=x(d)??d)}if(!g)continue;const m=H(g,p,o);if(m)return{jawboneEl:o,extracted:m,chosenTitleElement:p??void 0}}return{jawboneEl:null,extracted:null}},Nt=()=>{const t=ft.join(","),e=Array.from(document.querySelectorAll(t)),n=e.filter(E),i=window.innerWidth*.85,a=window.innerHeight*.6,r=n.filter(o=>{const s=o.getBoundingClientRect();return!(s.width===0||s.height===0||s.width<240||s.height<180||s.width>i||s.height>a)});return r.length>0?r.sort((o,s)=>{const l=o.getBoundingClientRect(),c=s.getBoundingClientRect();return c.width*c.height-l.width*l.height}):n.length>0?n:e},Bt=()=>{const t=[];return X.forEach(e=>{document.querySelectorAll(e).forEach(n=>{if(!E(n))return;const i=n.getBoundingClientRect();i.width<200||i.height<120||t.push(n)})}),t},Mt=()=>{const t=Bt();if(!t.length)return null;const e=window.innerWidth*.85,n=window.innerHeight*.6,i=t.sort((a,r)=>{const o=a.getBoundingClientRect(),s=r.getBoundingClientRect();return s.width*s.height-o.width*o.height});for(const a of i){let r=a,o=0;for(;r&&o<8;){if(r instanceof HTMLElement){const s=r.getBoundingClientRect();if(s.width>=240&&s.height>=180&&s.width<=e&&s.height<=n&&S(r))return{root:r,preview:a}}r=r.parentElement,o+=1}}return null},It=t=>{var i,a,r;let e=t;for(;e&&e!==document.body;){if(e instanceof HTMLAnchorElement&&((i=e.getAttribute("href"))!=null&&i.startsWith("/title/")))return e;const o=(a=e.querySelector)==null?void 0:a.call(e,":scope > a[href^='/title/']");if(o&&E(o))return o;e=e.parentElement}const n=(r=t.querySelector)==null?void 0:r.call(t,"a[href^='/title/']");return n&&E(n)?n:null},Ht=t=>{let e=t,n=0;const i=window.innerWidth*.85,a=window.innerHeight*.6;for(;e&&e!==document.body&&n<12;){if(e instanceof HTMLElement){const r=e.getBoundingClientRect();if(r.width>=240&&r.height>=180&&r.width<=i&&r.height<=a){const o=D(e),s=S(e);if(o&&s)return e}}e=e.parentElement,n+=1}return null},kt=()=>{const t=Nt();if(t.length)return t;const e=Array.from(document.querySelectorAll(K.join(","))),n=window.innerWidth*.85,i=window.innerHeight*.6,a=new Set;return e.forEach(r=>{let o=r,s=0;for(;o&&s<6;){if(o instanceof HTMLElement){const l=o.getBoundingClientRect();if(l.width>=240&&l.height>=180&&l.width<=n&&l.height<=i&&D(o)){a.add(o);break}}o=o.parentElement,s+=1}}),Array.from(a)},Pt="nxlb-top-section",qt=()=>{const t=document.createElement("div");t.id=Pt,t.style.display="block",t.style.width="100%",t.style.pointerEvents="none";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
    :host {
      all: initial;
      font-family: "Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
      pointer-events: none;
      display: block;
      width: 100%;
      box-sizing: border-box;
      opacity: 0;
      transform: translateY(-8px);
      transition: opacity 180ms cubic-bezier(0.2, 0, 0, 1),
        transform 180ms cubic-bezier(0.2, 0, 0, 1);
      will-change: opacity, transform;
    }
    :host(.nxl-visible) {
      opacity: 1;
      transform: translateY(0);
    }
    .nxl-top-section {
      background: rgba(0, 0, 0, 0.82);
      color: #f5f5f5;
      padding: 16px 20px;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: grid;
      gap: 8px;
      box-sizing: border-box;
    }
    .nxl-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 16px;
    }
    .nxl-branding {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.85);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .nxl-dots {
      display: inline-flex;
      gap: 4px;
      align-items: center;
    }
    .nxl-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      display: inline-block;
    }
    .nxl-dot.green { background: #00c46a; }
    .nxl-dot.orange { background: #f2b34c; }
    .nxl-dot.blue { background: #4aa8ff; }
    .nxl-body {
      display: grid;
      gap: 6px;
      font-size: 15px;
      color: rgba(255, 255, 255, 0.9);
    }
    .nxl-rating {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nxl-star {
      color: #e3b341;
      font-size: 16px;
    }
    .nxl-match {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .nxl-match-value {
      color: #46d369;
      font-weight: 700;
      font-size: 20px;
    }
    .nxl-because {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }
    .nxl-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.85);
    }
    .nxl-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.06);
    }
  `;const i=document.createElement("div");i.className="nxl-top-section";const a=document.createElement("div");a.className="nxl-header";const r=document.createElement("div");r.className="nxl-branding",r.innerHTML=`
    Powered by
    <span class="nxl-dots">
      <span class="nxl-dot green"></span>
      <span class="nxl-dot orange"></span>
      <span class="nxl-dot blue"></span>
    </span>
    Letterboxd
  `,a.appendChild(r);const o=document.createElement("div");o.className="nxl-body";const s=document.createElement("div");s.className="nxl-rating",s.dataset.field="communityRating",s.textContent="Community rating: —";const l=document.createElement("div");l.className="nxl-match",l.dataset.field="match",l.textContent="Your match: —";const c=document.createElement("div");c.className="nxl-because",c.dataset.field="because",c.textContent="Because you like: —";const u=document.createElement("div");return u.className="nxl-badges",u.dataset.field="badges",o.appendChild(s),o.appendChild(l),o.appendChild(c),o.appendChild(u),i.appendChild(a),i.appendChild(o),e.appendChild(n),e.appendChild(i),t},Wt=t=>t==null?"":t>=1e6?`${(t/1e6).toFixed(1)}M`:t>=1e3?`${(t/1e3).toFixed(1)}K`:`${t}`,Yt=t=>{const e=Math.max(0,Math.min(5,t)),n=Math.floor(e),i=e%1>=.5;return"★".repeat(n)+(i?"½":"")},Z=(t,e)=>{var c,u,h,g,p,m;const n=((c=e.tmdb)==null?void 0:c.voteAverage)??null,i=((u=e.tmdb)==null?void 0:u.voteCount)??null,a=e.letterboxd,r=(h=t.shadowRoot)==null?void 0:h.querySelector("[data-field='communityRating']");if(r)if(n!=null){const d=Wt(i),V=n/2;r.innerHTML=`
        Community rating:
        <span class="nxl-star">★</span>
        ${V.toFixed(1)}${d?` <span class="nxl-meta">${d} ratings</span>`:""}
      `}else r.textContent="Community rating: —";const o=(g=t.shadowRoot)==null?void 0:g.querySelector("[data-field='match']");o&&((a==null?void 0:a.matchPercent)!==null&&(a==null?void 0:a.matchPercent)!==void 0?o.innerHTML=`Your match: <span class="nxl-match-value">${a.matchPercent}%</span>`:o.textContent="Your match: —");const s=(p=t.shadowRoot)==null?void 0:p.querySelector("[data-field='because']");if(s){const d=(a==null?void 0:a.becauseYouLike)??[];s.textContent=d.length>0?`Because you like: ${d.join(", ")}`:"Because you like: —"}const l=(m=t.shadowRoot)==null?void 0:m.querySelector("[data-field='badges']");if(l){if(l.innerHTML="",a!=null&&a.inWatchlist){const d=document.createElement("span");d.className="nxl-badge",d.textContent="On your watchlist",l.appendChild(d)}if((a==null?void 0:a.userRating)!==null&&(a==null?void 0:a.userRating)!==void 0){const d=document.createElement("span");d.className="nxl-badge",d.textContent=`You rated ${Yt(a.userRating)}`,l.appendChild(d)}if(!(a!=null&&a.inWatchlist)&&(a==null?void 0:a.userRating)===void 0){const d=document.createElement("span");d.className="nxl-badge",d.textContent="Letterboxd: —",l.appendChild(d)}}},Ft=()=>{let t=null,e=null,n=null;const i=()=>{e||(e=qt())};return{mount:l=>{i(),e&&t!==l&&(e.remove(),l.insertBefore(e,l.firstChild),t=l,requestAnimationFrame(()=>{e==null||e.classList.add("nxl-visible")}))},update:l=>{n=l,e&&Z(e,l)},unmount:()=>{e&&e.remove(),t=null},renderLast:()=>{e&&n&&Z(e,n)},getLastData:()=>n,getCurrentRoot:()=>t,isMounted:()=>!!(e&&e.isConnected)}},tt="nxlb-status-badge",Vt=()=>{const t=document.createElement("div");t.id=tt,t.style.position="fixed",t.style.bottom="16px",t.style.right="16px",t.style.zIndex="2147483647",t.style.pointerEvents="none";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
    :host {
      all: initial;
      font-family: "Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 999px;
      padding: 8px 12px;
      color: #f5f5f5;
      font-size: 12px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
      pointer-events: auto;
      position: relative;
    }
    .dots {
      display: inline-flex;
      gap: 4px;
      align-items: center;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot.orange { background: #f2b34c; }
    .dot.green { background: #00c46a; }
    .dot.blue { background: #4aa8ff; }
    .status {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #46d369;
      box-shadow: 0 0 6px rgba(70, 211, 105, 0.6);
    }
    .tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      color: #f5f5f5;
      font-size: 11px;
      padding: 6px 8px;
      border-radius: 8px;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 120ms ease, transform 120ms ease;
      white-space: nowrap;
      pointer-events: none;
    }
    .badge:hover .tooltip {
      opacity: 1;
      transform: translateY(0);
    }
  `;const i=document.createElement("div");return i.className="badge",i.innerHTML=`
    <span class="dots">
      <span class="dot orange"></span>
      <span class="dot green"></span>
      <span class="dot blue"></span>
    </span>
    <span>Letterboxd</span>
    <span class="status" aria-hidden="true"></span>
    <span class="tooltip">Netflix × Letterboxd overlay enabled</span>
  `,e.appendChild(n),e.appendChild(i),t},_=t=>{const e=document.getElementById(tt);if(!t){e&&(e.remove(),f("OVERLAY_BADGE_REMOVED"));return}if(e)return;const n=Vt();document.documentElement.appendChild(n),f("OVERLAY_BADGE_MOUNTED")},k={ctrlKey:!0,shiftKey:!0,key:"l"},zt=250,jt=2e3,Xt=.85,Kt=.6,T=Ft();let A=!0,et="",nt=null,P,q,ot="",R=null,C=!1,it=null,L=null;const rt=()=>window,Ut=t=>{if(!t)return!1;const e=t.getBoundingClientRect();return e.width===0||e.height===0?!1:e.width>window.innerWidth*Xt||e.height>window.innerHeight*Kt},W=t=>{R&&R!==t&&(R.style.outline="",R.style.outlineOffset="",R=null),t&&(t.style.outline="1px solid rgba(255, 80, 80, 0.85)",t.style.outlineOffset="-1px",R=t)},Gt=()=>window.location.pathname.includes("/watch/"),at=()=>Array.from(document.querySelectorAll("video")).some(e=>{if(e.paused||e.ended)return!1;const n=e.getBoundingClientRect();if(n.width===0||n.height===0)return!1;const i=n.width/window.innerWidth,a=n.height/window.innerHeight;return i>.85||a>.6}),$t=()=>!!document.querySelector("[data-uia*='video-player'], [class*='VideoPlayer'], [class*='watch-video'], [data-uia*='player']"),Jt=()=>!!(Gt()||at()||$t()&&at()),Y=()=>{const t=Jt();t!==C&&(C=t,C?(_(!1),f("BADGE_HIDDEN_PLAYBACK"),T.unmount()):A&&(_(!0),f("BADGE_SHOWN"),f("BROWSE_MODE_DETECTED")))},Qt=()=>{if(!A){_(!1);return}C||(_(!0),f("BADGE_SHOWN"))},Zt=t=>[t.normalizedTitle??"",t.year??"",t.netflixId??"",t.href??""].join("|"),te=(t,e)=>({title:t,year:e??null,tmdb:{id:null,voteAverage:null,voteCount:null},letterboxd:{inWatchlist:!1,userRating:null,matchPercent:null,becauseYouLike:[]}}),ee=()=>L?L.isConnected?L:(L=null,null):null,F=t=>{if(!A||(Y(),C))return;f("OVERLAY_MOUNT_ATTEMPT",{reason:t});const e=Lt(ee()),n=e.jawboneEl,i=e.extracted;if(!n||!i){f("OVERLAY_MOUNT_FAILED",{reason:"no-jawbone"}),T.unmount(),W(null);return}if(Ut(n)){f("OVERLAY_MOUNT_FAILED",{reason:"hero-sized"}),T.unmount(),W(null);return}f("ACTIVE_JAWBONE_FOUND",{rawTitle:i.rawTitle,netflixId:i.netflixId,year:i.year,isSeries:i.isSeries,rejectedTitleCandidates:e.rejectedCount,chosenTitleElement:e.chosenTitleElement?e.chosenTitleElement.outerHTML.slice(0,200):void 0}),f("EXTRACTED_TITLE_INFO",i);const a=Zt(i);if(a===et&&n===nt){f("OVERLAY_MOUNT_SUCCESS",{reused:!0});return}et=a,nt=n,W(n),T.mount(n),T.update(te(i.rawTitle,i.year??void 0));const r=`req_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;ot=r;const o={type:"RESOLVE_OVERLAY_DATA",requestId:r,payload:i};f("OVERLAY_REQUEST",{titleText:i.rawTitle,normalizedTitle:i.normalizedTitle,href:i.href,year:i.year}),chrome.runtime.sendMessage(o).then(s=>{var l,c,u,h,g;if((s==null?void 0:s.type)==="OVERLAY_DATA_RESOLVED"&&s.requestId===ot){it=s.payload,f("OVERLAY_RESPONSE",{requestId:r,tmdb:s.payload.tmdb,letterboxd:{inWatchlist:((l=s.payload.letterboxd)==null?void 0:l.inWatchlist)??!1,userRating:((c=s.payload.letterboxd)==null?void 0:c.userRating)??null,matchPercent:((u=s.payload.letterboxd)==null?void 0:u.matchPercent)??null,becauseYouLikeCount:((g=(h=s.payload.letterboxd)==null?void 0:h.becauseYouLike)==null?void 0:g.length)??0}}),T.update(s.payload);{const p=s.payload.letterboxd;if(!p||!p.inWatchlist&&p.userRating===null){const m=dt(i.rawTitle,i.year??void 0);chrome.storage.local.get([b.LETTERBOXD_INDEX]).then(d=>{d[b.LETTERBOXD_INDEX]?i.year?f("LB_MATCH_NOT_FOUND",{reason:"no-key",key:m}):f("LB_MATCH_NOT_FOUND",{reason:"missing-year",key:m}):f("LB_MATCH_NOT_FOUND",{reason:"no-index",key:m})})}}}}).catch(s=>{f("Title resolve failed",{requestId:r,err:s})})},v=t=>{P&&window.clearTimeout(P),P=window.setTimeout(()=>{F(t)},zt)},ne=()=>{new MutationObserver(()=>{try{v("mutation")}catch(e){f("Mutation observer failed",{error:e})}}).observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","aria-expanded","aria-hidden"]}),document.addEventListener("pointerover",e=>{try{L=e.target,v("pointer")}catch(n){f("Pointer observer failed",{error:n})}},!0),document.addEventListener("focusin",()=>{try{v("focus")}catch(e){f("Focus observer failed",{error:e})}},!0),q&&window.clearInterval(q),q=window.setInterval(()=>{A&&(Y(),!C&&(T.isMounted()||F("watchdog")))},jt),v("init")},oe=async()=>{const e=!((await j())[b.OVERLAY_ENABLED]??!0);await ut({[b.OVERLAY_ENABLED]:e}),A=e,e?(Qt(),v("toggle")):(T.unmount(),_(!1)),f("Overlay toggled",{enabled:e})},ie=t=>{t.ctrlKey===k.ctrlKey&&t.shiftKey===k.shiftKey&&t.key.toLowerCase()===k.key&&(t.preventDefault(),oe().catch(e=>f("Toggle failed",e)))},re=()=>{chrome.runtime.onMessage.addListener(t=>{if((t==null?void 0:t.type)==="LB_INDEX_UPDATED"){f("LB_INDEX_UPDATED"),v("lb-index-updated");return}(t==null?void 0:t.type)==="LB_INDEX_UPDATED_ACK"&&(f("LB_INDEX_UPDATED_ACK",t.payload),v("lb-index-updated"))})},ae=()=>{const t=rt();t.__nxlDebug={getLbIndex:async()=>chrome.storage.local.get(b.LETTERBOXD_INDEX),lastOverlayData:()=>it,forceResolve:()=>F("force")}},se=async()=>{const t=rt();if(t.__nxlBooted)return;t.__nxlBooted=!0,A=(await j())[b.OVERLAY_ENABLED]??!0,Y(),A&&!C&&(_(!0),f("BADGE_SHOWN"),f("BROWSE_MODE_DETECTED")),ne(),re(),ae(),window.addEventListener("keydown",ie)},st=async()=>{await se()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{st().catch(t=>f("Init failed",t))},{once:!0}):st().catch(t=>f("Init failed",t))})();
//# sourceMappingURL=index.js.map
