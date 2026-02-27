(function(){"use strict";const y={OVERLAY_ENABLED:"overlayEnabled",TMDB_API_KEY:"tmdbApiKey",TMDB_CACHE:"tmdbCache",TMDB_FEATURE_CACHE:"tmdbFeatureCache",MATCH_PROFILE:"matchProfile",LETTERBOXD_INDEX:"lb_index_v1",LETTERBOXD_STATS:"lb_stats_v1",LAST_IMPORT_AT:"lastImportAt",XRAY_ENABLED:"xrayEnabled",AWS_ACCESS_KEY_ID:"awsAccessKeyId",AWS_SECRET_ACCESS_KEY:"awsSecretAccessKey",AWS_REGION:"awsRegion"},p=(...t)=>{console.log("[Netflix+Letterboxd]",...t)},Z=t=>t?t.toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9']+/g," ").replace(/\s+/g," ").trim():"",St=(t,e)=>{const n=Z(t),o=e?String(e):"";return`${n}-${o}`},Rt=(t,e)=>St(t,e),tt=async()=>(p("Loading storage state"),chrome.storage.local.get([y.OVERLAY_ENABLED,y.TMDB_API_KEY,y.TMDB_CACHE,y.TMDB_FEATURE_CACHE,y.MATCH_PROFILE,y.LETTERBOXD_INDEX,y.LETTERBOXD_STATS,y.LAST_IMPORT_AT,y.AWS_ACCESS_KEY_ID,y.AWS_SECRET_ACCESS_KEY,y.AWS_REGION])),Lt=async t=>{p("Saving storage state",t),await chrome.storage.local.set(t)},et="a[href^='/title/']",P=["[role='dialog']","[aria-modal='true']","[aria-expanded='true']","[data-uia*='jawbone']","[class*='jawbone']","[data-uia*='preview']","[data-uia*='billboard']","[data-uia*='hero']","[data-uia*='details']"],nt=["h1","h2","h3","[data-uia*='title']","[class*='title']","[class*='fallback']","[class*='preview'] [class*='header']"],ot=["video","img","[data-uia*='preview'] video","[data-uia*='preview'] img","[class*='preview'] video","[class*='preview'] img","[data-uia*='player'] video","[data-uia*='hero'] img"],it=["[data-uia*='controls']","[class*='controls']","[class*='control']","[role='toolbar']"],D=/(S\d+\s*:?\s*E\d+|Season\s*\d+\s*Episode\s*\d+|Episode\s*\d+|\bE\d+\b)/i,k=/(\b\d+\s*(m|min|minutes)\b|\b\d+\s*of\s*\d+\s*(m|min|minutes)\b)/i,Nt=/\b(tv-[a-z0-9]+|pg-?13|pg|tv-ma|tv-y|tv-g|nr|nc-17|hd|uhd|4k|seasons?|season|episode|volume|part\s+\d+)\b/i,Ot=/^(play|resume|continue|more info|details|watch|watch now|watch again|add|added|my list|remove|rate|like|dislike|thumbs up|thumbs down)$/i,Dt=/because you watched/i,rt=["[data-uia*='maturity-rating']","[data-uia*='season']","[data-uia*='resolution']","[data-uia*='hd']","[class*='maturity']","[class*='season']","[class*='quality']"],st=["[data-uia*='genre']","a[href*='/genre/']","[class*='genre']"],at=[...rt,...st,"[data-uia*='metadata']","[class*='metadata']","[class*='meta']","[class*='maturity']","[class*='season']","[class*='genre']","[class*='tag']","[class*='info']"],It=["header","nav","[data-uia*='header']","[data-uia*='row-title']","[class*='rowHeader']","[class*='row-title']"],I=["h1","h2","h3","h4","[data-uia*='title']","[class*='title']","[class*='headline']","[class*='header']","[class*='name']"],Bt=/(browse|home|my list|popular|your next watch|explore all|movies & shows|movies and shows|new & popular)/i,E=t=>{const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return!1;const n=window.getComputedStyle(t);return n.visibility==="hidden"||n.display==="none"||n.opacity==="0"?!1:e.bottom>=0&&e.right>=0&&e.top<=window.innerHeight&&e.left<=window.innerWidth},b=t=>{if(!t)return;const e=t.replace(/\s+/g," ").trim();return e.length?e:void 0},lt=t=>{if(!t)return;const e=t.match(/\/title\/(\d+)/);return e==null?void 0:e[1]},B=t=>{if(!t)return;const e=t.match(/(19\d{2}|20\d{2})/);if(!e)return;const n=Number(e[1]);if(!Number.isNaN(n))return n},x=t=>{if(!t)return;let e=t;return e=e.replace(/^\s*S\d+\s*:?\s*E\d+\s*/i,""),e=e.replace(/"[^"]*"/g,n=>{const o=n.replace(/"/g,"");return D.test(o)?"":n}),e=e.replace(/Episode\s*\d+/gi,""),e=e.replace(/\bE\d+\b/gi,""),e=e.replace(k,""),e=e.replace(/\s+of\s+\d+\s*(m|min|minutes)?/gi,""),e=e.replace(/\s+/g," ").trim(),e.length?e:void 0},ct=(t,e)=>{const n=t.getAttribute("href")||void 0,o=lt(n),r=b(t.getAttribute("aria-label")||t.textContent);return{netflixTitleId:o,titleText:r,href:n,source:e}},q=t=>{for(const e of nt){const n=t.querySelector(e);if(n&&E(n)){const o=b(n.textContent);if(o)return o}}},Mt=t=>{if(t)return q(t)},Ht=t=>{if(t)for(const e of nt){const n=Array.from(t.querySelectorAll(e));for(const o of n){if(!E(o))continue;const r=b(o.textContent);if(!r||D.test(r)||k.test(r))continue;const s=x(r);if(s)return s}}},M=t=>{if(!t)return null;const e=[];return ot.forEach(n=>{t.querySelectorAll(n).forEach(o=>{E(o)&&e.push(o)})}),e.length?e.reduce((n,o)=>{const r=n.getBoundingClientRect(),s=o.getBoundingClientRect(),i=r.width*r.height;return s.width*s.height>i?o:n}):null},L=t=>{var r;if(!t)return null;const e=[];it.forEach(s=>{t.querySelectorAll(s).forEach(i=>{E(i)&&e.push(i)})});const o=Array.from(new Set(e)).map(s=>{const i=s.querySelectorAll("button, [role='button']").length,a=s.getBoundingClientRect(),c=i*10+a.width;return{el:s,score:c,top:a.top}}).filter(s=>s.score>0);return o.sort((s,i)=>i.score-s.score||i.top-s.top),((r=o[0])==null?void 0:r.el)??null},Pt=t=>{if(!t)return!1;const e=[...rt,...st].join(",");return Array.from(t.querySelectorAll(e)).some(o=>E(o))},kt=t=>!!t.closest(at.join(",")),W=t=>!!t.closest(It.join(",")),v=t=>Bt.test(t)||Ot.test(t.trim())||Dt.test(t)||Nt.test(t)?!0:D.test(t)||k.test(t)||/\b\d+\s*of\s*\d+\s*(m|min|minutes)?\b/i.test(t)||/\b\d+\s*(m|min|minutes)\b/i.test(t),V=(t,e)=>t.closest('[role="progressbar"], [data-uia*="progress"], [class*="progress"]')?!0:e!==void 0?t.getBoundingClientRect().bottom>=e-8:!1,H=(t,e)=>t?e&&(e.contains(t)||t.closest("button, [role='button']"))?!0:!!t.closest("button, [role='button'], [data-uia*='play'], [data-uia*='button']"):!1,qt=t=>{const e=t.getBoundingClientRect(),n=L(t),o=n?n.getBoundingClientRect().top:void 0,r=Array.from(t.querySelectorAll(I.join(",")));let s,i=0;const a=[];if(r.forEach(l=>{if(!E(l)){i+=1;return}if(W(l)){i+=1;return}if(H(l,n)){i+=1;return}if(V(l,o)){i+=1;return}const h=b(l.textContent);if(!h||h.length<2||h.length>80){i+=1;return}if(v(h)){a.push(l),i+=1;return}const f=l.getBoundingClientRect(),u=window.getComputedStyle(l),m=parseFloat(u.fontSize)||14,g=u.fontWeight==="bold"?700:Number(u.fontWeight),d=Number.isNaN(g)?400:g,T=f.left-e.left,Pe=f.top-e.top,ke=Math.hypot(T,Pe),qe=kt(l)?120:0,_t=m*10+d/10+Math.max(0,300-ke)-qe;(!s||_t>s.score)&&(s={el:l,score:_t,text:h})}),s)return{title:x(s.text)??s.text,chosen:s.el,rejectedCount:i};for(const l of a){let h=l.parentElement,f=0;for(;h&&f<4;){const u=Array.from(h.querySelectorAll(I.join(","))).filter(m=>m!==l);for(const m of u){if(!E(m)||H(m,n)||V(m,o))continue;const g=b(m.textContent);if(!(!g||g.length<2||g.length>80)&&!v(g))return{title:x(g)??g,chosen:m,rejectedCount:i}}h=h.parentElement,f+=1}}const c=t.querySelector("a[href^='/title/']");if(c){const l=c.querySelector(I.join(",")),h=b((l==null?void 0:l.textContent)||c.textContent);if(h&&!v(h))return{title:x(h)??h,chosen:l??c,rejectedCount:i};let f=c.parentElement,u=0;for(;f&&u<4;){const m=Array.from(f.querySelectorAll(I.join(",")));for(const g of m){if(!E(g)||H(g,n)||V(g,o))continue;const d=b(g.textContent);if(!(!d||d.length<2||d.length>80)&&!v(d))return{title:x(d)??d,chosen:g,rejectedCount:i}}f=f.parentElement,u+=1}}return{title:null,rejectedCount:i}},Wt=t=>{const n=Array.from(t.querySelectorAll(at.join(","))).map(c=>b(c.textContent)).filter(Boolean);if(!n.length){const c=L(t),l=c==null?void 0:c.nextElementSibling,h=b(l==null?void 0:l.textContent);h&&n.push(h)}const o=n.join(" "),r=B(o),s=/\bseasons?\b/i.test(o),i=/\b\d+\s*(m|min|minutes)\b/i.test(o)||/\b\d+\s*h\b/i.test(o);let a;return s?a=!0:i&&(a=!1),{year:r,isSeries:a}},Y=t=>{var n,o;const e=[t.getAttribute("aria-label"),t.getAttribute("title"),(n=t.querySelector("img[alt]"))==null?void 0:n.alt,(o=t.querySelector("[aria-label]"))==null?void 0:o.getAttribute("aria-label"),t.textContent];for(const r of e){const s=b(r);if(s&&!v(s))return s}},Vt=t=>{var o,r,s,i,a;const e=t,n=[((o=e.getAttribute)==null?void 0:o.call(e,"aria-label"))??void 0,((r=e.getAttribute)==null?void 0:r.call(e,"data-uia-title"))??void 0,((s=e.getAttribute)==null?void 0:s.call(e,"title"))??void 0,(a=(i=e.querySelector)==null?void 0:i.call(e,"img[alt]"))==null?void 0:a.alt,e.textContent];for(const c of n){const l=b(c);if(l&&!v(l)&&!W(e))return l}},Yt=(t,e,n)=>{const r=Array.from(t.querySelectorAll("a[href^='/title/']")).filter(a=>E(a));if(!r.length)return null;const s=e==null?void 0:e.getBoundingClientRect();let i=null;for(const a of r){if(W(a)||H(a,n)||!Y(a))continue;const l=a.getBoundingClientRect(),h=l.width*l.height;let f=0;if(s){const u=s.top-220,m=s.bottom+220;if(l.bottom<u||l.top>m)continue}if(e&&(a.contains(e)||e.contains(a))&&(f+=1e3),s){const u=l.left+l.width/2-(s.left+s.width/2),m=l.top+l.height/2-(s.top+s.height/2),g=Math.hypot(u,m);f+=Math.max(0,500-g)}f+=Math.min(h/100,200),f+=50,(!i||f>i.score)&&(i={anchor:a,score:f})}return(i==null?void 0:i.anchor)??null},$t=t=>{if(t){const e=zt(t);if(e)return e}return Ft()},$=(t,e,n)=>{const o=Z(t);if(!o)return null;const r=(e==null?void 0:e.getAttribute("href"))??null,s=lt(r)??null,{year:i,isSeries:a}=Wt(n);return{rawTitle:t,normalizedTitle:o,year:i??null,isSeries:a,netflixId:s,href:r}},zt=t=>{const e=Gt(t);let n,o=null;if(e){const i=Y(e);i&&(n=x(i)??i,o=e)}if(!n){let i=t,a=0;for(;i&&i!==document.body&&a<8;){const c=Vt(i);if(c){n=x(c)??c;break}i=i.parentElement,a+=1}}if(!n)return null;if(o){const i=Ut(o);if(i){const a=$(n,o,i);return a?{jawboneEl:i,extracted:a,chosenTitleElement:o}:null}}let r=o??t,s=0;for(;r&&r!==document.body&&s<8;){if(r instanceof HTMLElement){const i=r.getBoundingClientRect();if(i.width>=200&&i.height>=120){const a=$(n,o,r);if(a)return{jawboneEl:r,extracted:a,chosenTitleElement:o??void 0}}}r=r.parentElement,s+=1}return null},Ft=()=>{const t=jt(),e=Jt().map(s=>({root:s,preview:M(s)})),n=t?[{root:t.root,preview:t.preview},...e.filter(s=>s.root!==t.root)]:e,o=window.innerWidth*.85,r=window.innerHeight*.6;for(const s of n){const i=s.root,a=i.getBoundingClientRect();if(a.width>o||a.height>r)continue;const c=s.preview??M(i),l=L(i),h=Pt(i);if(!c||!l)continue;const f=Yt(i,c,l);let u=null,m=null;if(f){const d=Y(f);d&&(u=x(d)??d,m=f)}if(u||(u=qt(i).title??null),!u&&!h)continue;if(!u&&h){const d=Mt(i);d&&!v(d)&&(u=x(d)??d)}if(!u)continue;const g=$(u,m,i);if(g)return{jawboneEl:i,extracted:g,chosenTitleElement:m??void 0}}return{jawboneEl:null,extracted:null}},z=(t,e)=>{const n=Ht(t);if(n)return n;const o=x(e);if(o&&!D.test(o))return o;if(e)return x(e)??e},Kt=t=>{const e=Array.from(t.querySelectorAll(et)),n=e.filter(E);return n.length>0?n[0]:e[0]},dt=()=>{const t=P.join(","),e=Array.from(document.querySelectorAll(t)),n=e.filter(E),o=window.innerWidth*.85,r=window.innerHeight*.6,s=n.filter(i=>{const a=i.getBoundingClientRect();return!(a.width===0||a.height===0||a.width<240||a.height<180||a.width>o||a.height>r)});return s.length>0?s.sort((i,a)=>{const c=i.getBoundingClientRect(),l=a.getBoundingClientRect();return l.width*l.height-c.width*c.height}):n.length>0?n:e},Xt=()=>{const t=[];return ot.forEach(e=>{document.querySelectorAll(e).forEach(n=>{if(!E(n))return;const o=n.getBoundingClientRect();o.width<200||o.height<120||t.push(n)})}),t},jt=()=>{const t=Xt();if(!t.length)return null;const e=window.innerWidth*.85,n=window.innerHeight*.6,o=t.sort((r,s)=>{const i=r.getBoundingClientRect(),a=s.getBoundingClientRect();return a.width*a.height-i.width*i.height});for(const r of o){let s=r,i=0;for(;s&&i<8;){if(s instanceof HTMLElement){const a=s.getBoundingClientRect();if(a.width>=240&&a.height>=180&&a.width<=e&&a.height<=n&&L(s))return{root:s,preview:r}}s=s.parentElement,i+=1}}return null},Gt=t=>{var o,r,s;let e=t;for(;e&&e!==document.body;){if(e instanceof HTMLAnchorElement&&((o=e.getAttribute("href"))!=null&&o.startsWith("/title/")))return e;const i=(r=e.querySelector)==null?void 0:r.call(e,":scope > a[href^='/title/']");if(i&&E(i))return i;e=e.parentElement}const n=(s=t.querySelector)==null?void 0:s.call(t,"a[href^='/title/']");return n&&E(n)?n:null},Ut=t=>{let e=t,n=0;const o=window.innerWidth*.85,r=window.innerHeight*.6;for(;e&&e!==document.body&&n<12;){if(e instanceof HTMLElement){const s=e.getBoundingClientRect();if(s.width>=240&&s.height>=180&&s.width<=o&&s.height<=r){const i=M(e),a=L(e);if(i&&a)return e}}e=e.parentElement,n+=1}return null},Jt=()=>{const t=dt();if(t.length)return t;const e=Array.from(document.querySelectorAll(it.join(","))),n=window.innerWidth*.85,o=window.innerHeight*.6,r=new Set;return e.forEach(s=>{let i=s,a=0;for(;i&&a<6;){if(i instanceof HTMLElement){const c=i.getBoundingClientRect();if(c.width>=240&&c.height>=180&&c.width<=n&&c.height<=o&&M(i)){r.add(i);break}}i=i.parentElement,a+=1}}),Array.from(r)},Qt=()=>{const t=dt();for(const n of t){const o=Kt(n);if(o){const s=ct(o,"container-anchor");if(s.netflixTitleId||s.titleText){const i=s.titleText??q(n),a=z(n,i??s.titleText);return{candidate:{...s,titleText:a,year:B(a??i)},container:n}}}const r=q(n);if(r){const s=z(n,r);return{candidate:{titleText:s??r,year:B(s??r),source:"container-text"},container:n}}}const e=Array.from(document.querySelectorAll(et)).find(E);if(e){const n=ct(e,"page-anchor"),o=z(e.closest(P.join(","))??e.parentElement,n.titleText);return{candidate:{...n,titleText:o??n.titleText,year:B(o??n.titleText)},container:e.closest(P.join(","))??e.parentElement}}return{candidate:null,container:null}},Zt="nxlb-top-section",te=()=>{const t=document.createElement("div");t.id=Zt,t.style.display="block",t.style.width="100%",t.style.pointerEvents="none";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
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
  `;const o=document.createElement("div");o.className="nxl-top-section";const r=document.createElement("div");r.className="nxl-header";const s=document.createElement("div");s.className="nxl-branding",s.innerHTML=`
    Powered by
    <span class="nxl-dots">
      <span class="nxl-dot green"></span>
      <span class="nxl-dot orange"></span>
      <span class="nxl-dot blue"></span>
    </span>
    Letterboxd
  `,r.appendChild(s);const i=document.createElement("div");i.className="nxl-body";const a=document.createElement("div");a.className="nxl-rating",a.dataset.field="communityRating",a.textContent="Community rating: —";const c=document.createElement("div");c.className="nxl-match",c.dataset.field="match",c.textContent="Your match: —";const l=document.createElement("div");l.className="nxl-because",l.dataset.field="because",l.textContent="Because you like: —";const h=document.createElement("div");return h.className="nxl-badges",h.dataset.field="badges",i.appendChild(a),i.appendChild(c),i.appendChild(l),i.appendChild(h),o.appendChild(r),o.appendChild(i),e.appendChild(n),e.appendChild(o),t},ee=t=>t==null?"":t>=1e6?`${(t/1e6).toFixed(1)}M`:t>=1e3?`${(t/1e3).toFixed(1)}K`:`${t}`,ne=t=>{const e=Math.max(0,Math.min(5,t)),n=Math.floor(e),o=e%1>=.5;return"★".repeat(n)+(o?"½":"")},ut=(t,e)=>{var l,h,f,u,m,g;const n=((l=e.tmdb)==null?void 0:l.voteAverage)??null,o=((h=e.tmdb)==null?void 0:h.voteCount)??null,r=e.letterboxd,s=(f=t.shadowRoot)==null?void 0:f.querySelector("[data-field='communityRating']");if(s)if(n!=null){const d=ee(o),T=n/2;s.innerHTML=`
        Community rating:
        <span class="nxl-star">★</span>
        ${T.toFixed(1)}${d?` <span class="nxl-meta">${d} ratings</span>`:""}
      `}else s.textContent="Community rating: —";const i=(u=t.shadowRoot)==null?void 0:u.querySelector("[data-field='match']");i&&((r==null?void 0:r.matchPercent)!==null&&(r==null?void 0:r.matchPercent)!==void 0?i.innerHTML=`Your match: <span class="nxl-match-value">${r.matchPercent}%</span>`:i.textContent="Your match: —");const a=(m=t.shadowRoot)==null?void 0:m.querySelector("[data-field='because']");if(a){const d=(r==null?void 0:r.becauseYouLike)??[];a.textContent=d.length>0?`Because you like: ${d.join(", ")}`:"Because you like: —"}const c=(g=t.shadowRoot)==null?void 0:g.querySelector("[data-field='badges']");if(c){if(c.innerHTML="",r!=null&&r.inWatchlist){const d=document.createElement("span");d.className="nxl-badge",d.textContent="On your watchlist",c.appendChild(d)}if((r==null?void 0:r.userRating)!==null&&(r==null?void 0:r.userRating)!==void 0){const d=document.createElement("span");d.className="nxl-badge",d.textContent=`You rated ${ne(r.userRating)}`,c.appendChild(d)}if(!(r!=null&&r.inWatchlist)&&(r==null?void 0:r.userRating)===void 0){const d=document.createElement("span");d.className="nxl-badge",d.textContent="Letterboxd: —",c.appendChild(d)}}},oe=()=>{let t=null,e=null,n=null;const o=()=>{e||(e=te())};return{mount:c=>{o(),e&&t!==c&&(e.remove(),c.insertBefore(e,c.firstChild),t=c,requestAnimationFrame(()=>{e==null||e.classList.add("nxl-visible")}))},update:c=>{n=c,e&&ut(e,c)},unmount:()=>{e&&e.remove(),t=null},renderLast:()=>{e&&n&&ut(e,n)},getLastData:()=>n,getCurrentRoot:()=>t,isMounted:()=>!!(e&&e.isConnected)}},ft="nxlb-reaction-timeline",ht=40,ie=()=>{const t=["[data-uia='timeline']","[class*='scrubber']","[role='slider'][aria-label]","[class*='Slider']","[class*='progress-bar']","[class*='PlayerTimeline']"];for(const e of t){const n=document.querySelector(e);if(n&&n.getBoundingClientRect().width>100)return n}return null},re=()=>{const t=document.createElement("div");t.id=ft,t.style.position="absolute",t.style.left="0",t.style.right="0",t.style.bottom="0",t.style.height=`${ht}px`,t.style.pointerEvents="auto";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
    :host {
      all: initial;
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    }
    .bar {
      display: flex;
      align-items: flex-end;
      width: 100%;
      height: 100%;
      overflow: hidden;
      gap: 0;
      position: relative;
    }
    .segment {
      flex: 1 1 auto;
      min-height: 0;
      border-radius: 1.5px 1.5px 0 0;
      background: rgba(255, 255, 255, 0.25);
      transition: height 200ms ease, background-color 120ms ease, opacity 120ms ease;
      cursor: pointer;
      position: relative;
    }
    .segment:hover {
      filter: brightness(1.4);
    }
    .tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.92);
      color: #f5f5f5;
      font-family: "Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 11px;
      padding: 6px 10px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      display: none;
    }
    .segment:hover .tooltip {
      display: block;
    }
  `;const o=document.createElement("div");return o.className="bar",o.dataset.field="segments",e.appendChild(n),e.appendChild(o),t},se=(t,e)=>{const o=(Math.max(-1,Math.min(1,t))+1)/2,i=0*(1-o)+120*o,a=Math.max(.1,Math.min(.8,e));return`hsla(${i}, 70%, 55%, ${a})`},pt=t=>{const e=Math.floor(t/3600),n=Math.floor(t%3600/60),o=Math.floor(t%60);return e>0?`${e}:${String(n).padStart(2,"0")}:${String(o).padStart(2,"0")}`:`${n}:${String(o).padStart(2,"0")}`},ae=async()=>{var h;if(!window.location.pathname.includes("/watch/"))return null;const t=document.querySelector(".watch-video--player-view, [data-uia*='video-player'], [class*='VideoPlayer']")??document.body;if(!t)return p("EMOTION_TIMELINE_NO_PLAYER"),null;(!t.style.position||t.style.position==="static")&&(t.style.position="relative");let e=t.querySelector(`#${ft}`);if(!e){e=re();const f=ie();if(f){const u=t.getBoundingClientRect(),m=f.getBoundingClientRect(),g=m.left-u.left,d=u.right-m.right;e.style.left=`${g}px`,e.style.right=`${d}px`;const T=u.bottom-m.top;e.style.bottom=`${T}px`}else e.style.left="6%",e.style.right="6%",e.style.bottom="54px";e.style.height=`${ht}px`,t.appendChild(e)}const n=document.querySelector("video"),o=window.location.pathname.match(/\/watch\/(\d+)/),r=(o==null?void 0:o[1])??null;if(!n||!r)return null;const s=n.duration||0;if(!s||!Number.isFinite(s))return null;const i=await ge(r,s);if(!i)return null;const a=(h=e.shadowRoot)==null?void 0:h.querySelector("[data-field='segments']");if(!a)return i;a.innerHTML="";const c=i.buckets.length||1,l=i.buckets.reduce((f,u)=>Math.max(f,u.intensity),0);return i.buckets.forEach(f=>{const u=document.createElement("div");if(u.className="segment",f.count>0&&l>0){const d=se(f.meanValence,f.intensity);u.style.backgroundColor=d;const T=Math.max(5,f.intensity/l*100);u.style.height=`${T}%`,u.style.opacity="1"}else u.style.backgroundColor="rgba(255,255,255,0.08)",u.style.height="2px",u.style.opacity="0.3";const m=document.createElement("div");m.className="tooltip";const g=`${pt(f.startSec)} – ${pt(f.endSec)}`;f.count>0?m.textContent=`${g}  •  ${f.count} reaction${f.count!==1?"s":""}`:m.textContent=g,u.appendChild(m),u.style.flexBasis=`${100/c}%`,a.appendChild(u)}),i},le={KeyL:"laugh",KeyS:"sad",KeyA:"angry",KeyB:"bored",KeyH:"shock",KeyN:"neutral",KeyJ:"smile"},mt={laugh:"😂",smile:"😊",shock:"😱",sad:"😢",angry:"😡",scared:"😨",bored:"😴",neutral:"🙂"},F=()=>{const t=document.querySelectorAll("video");for(let e=0;e<t.length;e+=1){const n=t[e],o=n.getBoundingClientRect();if(o.width>=window.innerWidth*.5&&o.height>=window.innerHeight*.5)return n}return t[0]??null},ce=()=>`rx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`,gt=()=>document.querySelector(".watch-video--player-view, [data-uia*='video-player'], [class*='VideoPlayer']")??document.body,de=t=>{const e=gt();if(!e)return;const n=mt[t];if(!n)return;const o=document.createElement("div");o.textContent=n,o.style.position="absolute",o.style.zIndex="2147483647",o.style.pointerEvents="none",o.style.fontSize="26px",o.style.filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))";const r=e.getBoundingClientRect(),s=.3+Math.random()*.4,i=.6+Math.random()*.15;o.style.left=`${r.width*s}px`,o.style.top=`${r.height*i}px`,o.style.transform="translate(-50%, 0)",o.style.opacity="1",o.style.transition="transform 700ms ease-out, opacity 700ms ease-out",e.appendChild(o),requestAnimationFrame(()=>{o.style.transform="translate(-50%, -60px)",o.style.opacity="0"}),window.setTimeout(()=>{o.remove()},800)};let N=null;const ue=()=>{if(N&&N.isConnected)return;const t=gt();if(!t)return;const e=document.createElement("div");e.style.position="absolute",e.style.right="16px",e.style.bottom="80px",e.style.zIndex="2147483646",e.style.pointerEvents="none";const n=document.createElement("div");n.style.pointerEvents="auto",n.style.background="rgba(0,0,0,0.88)",n.style.borderRadius="12px",n.style.border="1px solid rgba(255,255,255,0.18)",n.style.padding="10px 12px",n.style.fontFamily='"Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',n.style.fontSize="11px",n.style.color="rgba(255,255,255,0.9)",n.style.boxShadow="0 8px 24px rgba(0,0,0,0.5)";const o=document.createElement("div");o.textContent="Reactions (press while watching)",o.style.fontWeight="600",o.style.marginBottom="6px";const r=document.createElement("div");r.style.display="grid",r.style.gridTemplateColumns="auto 1fr",r.style.rowGap="4px",r.style.columnGap="6px",[["L","laugh"],["J","smile"],["H","shock"],["S","sad"],["A","angry"],["B","bored"],["N","neutral"]].forEach(([i,a])=>{const c=mt[a],l=document.createElement("div");l.textContent=`${c}  ${i}`,l.style.whiteSpace="nowrap";const h=document.createElement("div");h.textContent=a,h.style.textTransform="capitalize",h.style.opacity="0.75",r.appendChild(l),r.appendChild(h)}),n.appendChild(o),n.appendChild(r),e.appendChild(n),e.style.display="none",t.appendChild(e),N=e},yt=t=>{N&&(N.style.display=t?"block":"none")},K=()=>window.location.pathname.includes("/watch/"),fe=()=>{const t=window.location.pathname.match(/\/watch\/(\d+)/);if(t!=null&&t[1])return t[1];const{candidate:e}=Qt();return(e==null?void 0:e.netflixTitleId)??null},he=()=>null,pe=t=>{chrome.runtime.sendMessage({type:"STORE_REACTION_EVENT",payload:t}).catch(()=>{})},me=()=>{const t=n=>{n.dataset.nxlReactionsObserved!=="1"&&(n.dataset.nxlReactionsObserved="1",K()&&(ue(),n.addEventListener("pause",()=>{yt(!0),ae()}),n.addEventListener("play",()=>yt(!1))))};if(K()){const n=F();n&&t(n)}new MutationObserver(()=>{if(!K())return;const n=F();n&&t(n)}).observe(document.body,{childList:!0,subtree:!0}),window.addEventListener("keydown",n=>{if(n.repeat)return;const o=le[n.code];if(!o)return;n.stopPropagation(),n.preventDefault();const r=F();if(!r)return;const s=fe();if(!s)return;const i=r.currentTime,a={id:ce(),netflixId:s,profileId:he(),season:null,episode:null,timestampSec:i,createdAt:Date.now(),type:o};pe(a),de(o)},!0)},ge=async(t,e)=>{try{return await chrome.runtime.sendMessage({type:"GET_REACTION_TIMELINE",payload:{netflixId:t,durationSec:e}})??null}catch{return null}},Et="nxlb-status-badge",ye=()=>{const t=document.createElement("div");t.id=Et,t.style.position="fixed",t.style.bottom="16px",t.style.right="16px",t.style.zIndex="2147483647",t.style.pointerEvents="none";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
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
  `;const o=document.createElement("div");return o.className="badge",o.innerHTML=`
    <span class="dots">
      <span class="dot orange"></span>
      <span class="dot green"></span>
      <span class="dot blue"></span>
    </span>
    <span>Letterboxd</span>
    <span class="status" aria-hidden="true"></span>
    <span class="tooltip">Netflix × Letterboxd overlay enabled</span>
  `,e.appendChild(n),e.appendChild(o),t},S=t=>{const e=document.getElementById(Et);if(!t){e&&(e.remove(),p("OVERLAY_BADGE_REMOVED"));return}if(e)return;const n=ye();document.documentElement.appendChild(n),p("OVERLAY_BADGE_MOUNTED")},X={ctrlKey:!0,shiftKey:!0,key:"l"},Ee=250,be=2e3,xe=.85,Te=.6,w=oe();let A=!0,bt="",xt=null,j,G,Tt="",R=null,C=!1,wt=null,O=null;const vt=()=>window,we=t=>{if(!t)return!1;const e=t.getBoundingClientRect();return e.width===0||e.height===0?!1:e.width>window.innerWidth*xe||e.height>window.innerHeight*Te},U=t=>{R&&R!==t&&(R.style.outline="",R.style.outlineOffset="",R=null),t&&(t.style.outline="1px solid rgba(255, 80, 80, 0.85)",t.style.outlineOffset="-1px",R=t)},ve=()=>window.location.pathname.includes("/watch/"),At=()=>Array.from(document.querySelectorAll("video")).some(e=>{if(e.paused||e.ended)return!1;const n=e.getBoundingClientRect();if(n.width===0||n.height===0)return!1;const o=n.width/window.innerWidth,r=n.height/window.innerHeight;return o>.85||r>.6}),Ae=()=>!!document.querySelector("[data-uia*='video-player'], [class*='VideoPlayer'], [class*='watch-video'], [data-uia*='player']"),Ce=()=>!!(ve()||At()||Ae()&&At()),J=()=>{const t=Ce();t!==C&&(C=t,C?(S(!1),p("BADGE_HIDDEN_PLAYBACK"),w.unmount()):A&&(S(!0),p("BADGE_SHOWN"),p("BROWSE_MODE_DETECTED")))},_e=()=>{if(!A){S(!1);return}C||(S(!0),p("BADGE_SHOWN"))},Se=t=>[t.normalizedTitle??"",t.year??"",t.netflixId??"",t.href??""].join("|"),Re=(t,e)=>({title:t,year:e??null,tmdb:{id:null,voteAverage:null,voteCount:null},letterboxd:{inWatchlist:!1,userRating:null,matchPercent:null,becauseYouLike:[]}}),Le=t=>{var e;try{return(e=chrome.runtime)!=null&&e.id?chrome.runtime.sendMessage(t):(p("EXT_CONTEXT_INVALID",{messageType:t==null?void 0:t.type}),Promise.resolve(null))}catch(n){return p("EXT_CONTEXT_SEND_FAILED",{error:n,messageType:t==null?void 0:t.type}),Promise.resolve(null)}},Ne=()=>O?O.isConnected?O:(O=null,null):null,Q=t=>{if(!A||(J(),C))return;p("OVERLAY_MOUNT_ATTEMPT",{reason:t});const e=$t(Ne()),n=e.jawboneEl,o=e.extracted;if(!n||!o){p("OVERLAY_MOUNT_FAILED",{reason:"no-jawbone"}),w.unmount(),U(null);return}if(we(n)){p("OVERLAY_MOUNT_FAILED",{reason:"hero-sized"}),w.unmount(),U(null);return}p("ACTIVE_JAWBONE_FOUND",{rawTitle:o.rawTitle,netflixId:o.netflixId,year:o.year,isSeries:o.isSeries,rejectedTitleCandidates:e.rejectedCount,chosenTitleElement:e.chosenTitleElement?e.chosenTitleElement.outerHTML.slice(0,200):void 0}),p("EXTRACTED_TITLE_INFO",o);const r=Se(o);if(r===bt&&n===xt){p("OVERLAY_MOUNT_SUCCESS",{reused:!0});return}bt=r,xt=n,U(n),w.mount(n),w.update(Re(o.rawTitle,o.year??void 0));const s=`req_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;Tt=s;const i={type:"RESOLVE_OVERLAY_DATA",requestId:s,payload:o};p("OVERLAY_REQUEST",{titleText:o.rawTitle,normalizedTitle:o.normalizedTitle,href:o.href,year:o.year}),Le(i).then(a=>{var c,l,h,f,u,m;if(a&&(a==null?void 0:a.type)==="OVERLAY_DATA_RESOLVED"&&a.requestId===Tt){wt=a.payload,p("OVERLAY_RESPONSE",{requestId:s,tmdb:a.payload.tmdb,letterboxd:{inWatchlist:((c=a.payload.letterboxd)==null?void 0:c.inWatchlist)??!1,userRating:((l=a.payload.letterboxd)==null?void 0:l.userRating)??null,matchPercent:((h=a.payload.letterboxd)==null?void 0:h.matchPercent)??null,becauseYouLikeCount:((u=(f=a.payload.letterboxd)==null?void 0:f.becauseYouLike)==null?void 0:u.length)??0}}),w.update(a.payload);{const g=a.payload.letterboxd;if(!g||!g.inWatchlist&&g.userRating===null){const d=Rt(o.rawTitle,o.year??void 0);try{(m=chrome.runtime)!=null&&m.id?chrome.storage.local.get([y.LETTERBOXD_INDEX]).then(T=>{T[y.LETTERBOXD_INDEX]?o.year?p("LB_MATCH_NOT_FOUND",{reason:"no-key",key:d}):p("LB_MATCH_NOT_FOUND",{reason:"missing-year",key:d}):p("LB_MATCH_NOT_FOUND",{reason:"no-index",key:d})}):p("LB_INDEX_SKIP_EXT_CONTEXT_INVALID",{key:d})}catch(T){p("LB_INDEX_LOOKUP_FAILED",{error:T,key:d})}}}}}).catch(a=>{p("Title resolve failed",{requestId:s,err:a})})},_=t=>{j&&window.clearTimeout(j),j=window.setTimeout(()=>{Q(t)},Ee)},Oe=()=>{new MutationObserver(()=>{try{_("mutation")}catch(e){p("Mutation observer failed",{error:e})}}).observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","aria-expanded","aria-hidden"]}),document.addEventListener("pointerover",e=>{try{O=e.target,_("pointer")}catch(n){p("Pointer observer failed",{error:n})}},!0),document.addEventListener("focusin",()=>{try{_("focus")}catch(e){p("Focus observer failed",{error:e})}},!0),G&&window.clearInterval(G),G=window.setInterval(()=>{A&&(J(),!C&&(w.isMounted()||Q("watchdog")))},be),_("init")},De=async()=>{const e=!((await tt())[y.OVERLAY_ENABLED]??!0);await Lt({[y.OVERLAY_ENABLED]:e}),A=e,e?(_e(),_("toggle")):(w.unmount(),S(!1)),p("Overlay toggled",{enabled:e})},Ie=t=>{t.ctrlKey===X.ctrlKey&&t.shiftKey===X.shiftKey&&t.key.toLowerCase()===X.key&&(t.preventDefault(),De().catch(e=>p("Toggle failed",e)))},Be=()=>{chrome.runtime.onMessage.addListener(t=>{if((t==null?void 0:t.type)==="LB_INDEX_UPDATED"){p("LB_INDEX_UPDATED"),_("lb-index-updated");return}(t==null?void 0:t.type)==="LB_INDEX_UPDATED_ACK"&&(p("LB_INDEX_UPDATED_ACK",t.payload),_("lb-index-updated"))})},Me=()=>{const t=vt();t.__nxlDebug={getLbIndex:async()=>chrome.storage.local.get(y.LETTERBOXD_INDEX),lastOverlayData:()=>wt,forceResolve:()=>Q("force")}},He=async()=>{const t=vt();if(t.__nxlBooted)return;t.__nxlBooted=!0,A=(await tt())[y.OVERLAY_ENABLED]??!0,J(),A&&!C&&(S(!0),p("BADGE_SHOWN"),p("BROWSE_MODE_DETECTED")),Oe(),Be(),Me(),window.addEventListener("keydown",Ie),me()},Ct=async()=>{await He()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Ct().catch(t=>p("Init failed",t))},{once:!0}):Ct().catch(t=>p("Init failed",t))})();
//# sourceMappingURL=index.js.map
