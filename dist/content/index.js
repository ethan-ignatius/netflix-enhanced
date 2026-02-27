(function(){"use strict";const E={OVERLAY_ENABLED:"overlayEnabled",TMDB_API_KEY:"tmdbApiKey",TMDB_CACHE:"tmdbCache",TMDB_FEATURE_CACHE:"tmdbFeatureCache",MATCH_PROFILE:"matchProfile",LETTERBOXD_INDEX:"lb_index_v1",LETTERBOXD_STATS:"lb_stats_v1",LAST_IMPORT_AT:"lastImportAt",XRAY_ENABLED:"xrayEnabled",AWS_ACCESS_KEY_ID:"awsAccessKeyId",AWS_SECRET_ACCESS_KEY:"awsSecretAccessKey",AWS_REGION:"awsRegion"},et=500,u=(...t)=>{console.log("[Netflix+Letterboxd]",...t)},nt=t=>t?t.toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9']+/g," ").replace(/\s+/g," ").trim():"",Ot=(t,e)=>{const n=nt(t),o=e?String(e):"";return`${n}-${o}`},Dt=(t,e)=>Ot(t,e),ot=async()=>(u("Loading storage state"),chrome.storage.local.get([E.OVERLAY_ENABLED,E.TMDB_API_KEY,E.TMDB_CACHE,E.TMDB_FEATURE_CACHE,E.MATCH_PROFILE,E.LETTERBOXD_INDEX,E.LETTERBOXD_STATS,E.LAST_IMPORT_AT,E.AWS_ACCESS_KEY_ID,E.AWS_SECRET_ACCESS_KEY,E.AWS_REGION])),Bt=async t=>{u("Saving storage state",t),await chrome.storage.local.set(t)},it="a[href^='/title/']",W=["[role='dialog']","[aria-modal='true']","[aria-expanded='true']","[data-uia*='jawbone']","[class*='jawbone']","[data-uia*='preview']","[data-uia*='billboard']","[data-uia*='hero']","[data-uia*='details']"],rt=["h1","h2","h3","[data-uia*='title']","[class*='title']","[class*='fallback']","[class*='preview'] [class*='header']"],at=["video","img","[data-uia*='preview'] video","[data-uia*='preview'] img","[class*='preview'] video","[class*='preview'] img","[data-uia*='player'] video","[data-uia*='hero'] img"],st=["[data-uia*='controls']","[class*='controls']","[class*='control']","[role='toolbar']"],I=/(S\d+\s*:?\s*E\d+|Season\s*\d+\s*Episode\s*\d+|Episode\s*\d+|\bE\d+\b)/i,q=/(\b\d+\s*(m|min|minutes)\b|\b\d+\s*of\s*\d+\s*(m|min|minutes)\b)/i,It=/\b(tv-[a-z0-9]+|pg-?13|pg|tv-ma|tv-y|tv-g|nr|nc-17|hd|uhd|4k|seasons?|season|episode|volume|part\s+\d+)\b/i,Mt=/^(play|resume|continue|more info|details|watch|watch now|watch again|add|added|my list|remove|rate|like|dislike|thumbs up|thumbs down)$/i,Ht=/because you watched/i,lt=["[data-uia*='maturity-rating']","[data-uia*='season']","[data-uia*='resolution']","[data-uia*='hd']","[class*='maturity']","[class*='season']","[class*='quality']"],ct=["[data-uia*='genre']","a[href*='/genre/']","[class*='genre']"],dt=[...lt,...ct,"[data-uia*='metadata']","[class*='metadata']","[class*='meta']","[class*='maturity']","[class*='season']","[class*='genre']","[class*='tag']","[class*='info']"],Pt=["header","nav","[data-uia*='header']","[data-uia*='row-title']","[class*='rowHeader']","[class*='row-title']"],M=["h1","h2","h3","h4","[data-uia*='title']","[class*='title']","[class*='headline']","[class*='header']","[class*='name']"],kt=/(browse|home|my list|popular|your next watch|explore all|movies & shows|movies and shows|new & popular)/i,b=t=>{const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return!1;const n=window.getComputedStyle(t);return n.visibility==="hidden"||n.display==="none"||n.opacity==="0"?!1:e.bottom>=0&&e.right>=0&&e.top<=window.innerHeight&&e.left<=window.innerWidth},x=t=>{if(!t)return;const e=t.replace(/\s+/g," ").trim();return e.length?e:void 0},ut=t=>{if(!t)return;const e=t.match(/\/title\/(\d+)/);return e==null?void 0:e[1]},H=t=>{if(!t)return;const e=t.match(/(19\d{2}|20\d{2})/);if(!e)return;const n=Number(e[1]);if(!Number.isNaN(n))return n},y=t=>{if(!t)return;let e=t;return e=e.replace(/^\s*S\d+\s*:?\s*E\d+\s*/i,""),e=e.replace(/"[^"]*"/g,n=>{const o=n.replace(/"/g,"");return I.test(o)?"":n}),e=e.replace(/Episode\s*\d+/gi,""),e=e.replace(/\bE\d+\b/gi,""),e=e.replace(q,""),e=e.replace(/\s+of\s+\d+\s*(m|min|minutes)?/gi,""),e=e.replace(/\s+/g," ").trim(),e.length?e:void 0},ft=(t,e)=>{const n=t.getAttribute("href")||void 0,o=ut(n),i=x(t.getAttribute("aria-label")||t.textContent);return{netflixTitleId:o,titleText:i,href:n,source:e}},Y=t=>{for(const e of rt){const n=t.querySelector(e);if(n&&b(n)){const o=x(n.textContent);if(o)return o}}},Wt=t=>{if(t)return Y(t)},qt=t=>{if(t)for(const e of rt){const n=Array.from(t.querySelectorAll(e));for(const o of n){if(!b(o))continue;const i=x(o.textContent);if(!i||I.test(i)||q.test(i))continue;const r=y(i);if(r)return r}}},P=t=>{if(!t)return null;const e=[];return at.forEach(n=>{t.querySelectorAll(n).forEach(o=>{b(o)&&e.push(o)})}),e.length?e.reduce((n,o)=>{const i=n.getBoundingClientRect(),r=o.getBoundingClientRect(),a=i.width*i.height;return r.width*r.height>a?o:n}):null},O=t=>{var i;if(!t)return null;const e=[];st.forEach(r=>{t.querySelectorAll(r).forEach(a=>{b(a)&&e.push(a)})});const o=Array.from(new Set(e)).map(r=>{const a=r.querySelectorAll("button, [role='button']").length,s=r.getBoundingClientRect(),l=a*10+s.width;return{el:r,score:l,top:s.top}}).filter(r=>r.score>0);return o.sort((r,a)=>a.score-r.score||a.top-r.top),((i=o[0])==null?void 0:i.el)??null},Yt=t=>{if(!t)return!1;const e=[...lt,...ct].join(",");return Array.from(t.querySelectorAll(e)).some(o=>b(o))},Ft=t=>!!t.closest(dt.join(",")),F=t=>!!t.closest(Pt.join(",")),w=t=>kt.test(t)||Mt.test(t.trim())||Ht.test(t)||It.test(t)?!0:I.test(t)||q.test(t)||/\b\d+\s*of\s*\d+\s*(m|min|minutes)?\b/i.test(t)||/\b\d+\s*(m|min|minutes)\b/i.test(t),X=(t,e)=>t.closest('[role="progressbar"], [data-uia*="progress"], [class*="progress"]')?!0:e!==void 0?t.getBoundingClientRect().bottom>=e-8:!1,k=(t,e)=>t?e&&(e.contains(t)||t.closest("button, [role='button']"))?!0:!!t.closest("button, [role='button'], [data-uia*='play'], [data-uia*='button']"):!1,Xt=t=>{const e=t.getBoundingClientRect(),n=O(t),o=n?n.getBoundingClientRect().top:void 0,i=Array.from(t.querySelectorAll(M.join(",")));let r,a=0;const s=[];if(i.forEach(c=>{if(!b(c)){a+=1;return}if(F(c)){a+=1;return}if(k(c,n)){a+=1;return}if(X(c,o)){a+=1;return}const f=x(c.textContent);if(!f||f.length<2||f.length>80){a+=1;return}if(w(f)){s.push(c),a+=1;return}const h=c.getBoundingClientRect(),m=window.getComputedStyle(c),g=parseFloat(m.fontSize)||14,p=m.fontWeight==="bold"?700:Number(m.fontWeight),d=Number.isNaN(p)?400:p,R=h.left-e.left,ke=h.top-e.top,We=Math.hypot(R,ke),qe=Ft(c)?120:0,Nt=g*10+d/10+Math.max(0,300-We)-qe;(!r||Nt>r.score)&&(r={el:c,score:Nt,text:f})}),r)return{title:y(r.text)??r.text,chosen:r.el,rejectedCount:a};for(const c of s){let f=c.parentElement,h=0;for(;f&&h<4;){const m=Array.from(f.querySelectorAll(M.join(","))).filter(g=>g!==c);for(const g of m){if(!b(g)||k(g,n)||X(g,o))continue;const p=x(g.textContent);if(!(!p||p.length<2||p.length>80)&&!w(p))return{title:y(p)??p,chosen:g,rejectedCount:a}}f=f.parentElement,h+=1}}const l=t.querySelector("a[href^='/title/']");if(l){const c=l.querySelector(M.join(",")),f=x((c==null?void 0:c.textContent)||l.textContent);if(f&&!w(f))return{title:y(f)??f,chosen:c??l,rejectedCount:a};let h=l.parentElement,m=0;for(;h&&m<4;){const g=Array.from(h.querySelectorAll(M.join(",")));for(const p of g){if(!b(p)||k(p,n)||X(p,o))continue;const d=x(p.textContent);if(!(!d||d.length<2||d.length>80)&&!w(d))return{title:y(d)??d,chosen:p,rejectedCount:a}}h=h.parentElement,m+=1}}return{title:null,rejectedCount:a}},zt=t=>{const n=Array.from(t.querySelectorAll(dt.join(","))).map(l=>x(l.textContent)).filter(Boolean);if(!n.length){const l=O(t),c=l==null?void 0:l.nextElementSibling,f=x(c==null?void 0:c.textContent);f&&n.push(f)}const o=n.join(" "),i=H(o),r=/\bseasons?\b/i.test(o),a=/\b\d+\s*(m|min|minutes)\b/i.test(o)||/\b\d+\s*h\b/i.test(o);let s;return r?s=!0:a&&(s=!1),{year:i,isSeries:s}},z=t=>{var n,o;const e=[t.getAttribute("aria-label"),t.getAttribute("title"),(n=t.querySelector("img[alt]"))==null?void 0:n.alt,(o=t.querySelector("[aria-label]"))==null?void 0:o.getAttribute("aria-label"),t.textContent];for(const i of e){const r=x(i);if(r&&!w(r))return r}},Vt=t=>{var o,i,r,a,s;const e=t,n=[((o=e.getAttribute)==null?void 0:o.call(e,"aria-label"))??void 0,((i=e.getAttribute)==null?void 0:i.call(e,"data-uia-title"))??void 0,((r=e.getAttribute)==null?void 0:r.call(e,"title"))??void 0,(s=(a=e.querySelector)==null?void 0:a.call(e,"img[alt]"))==null?void 0:s.alt,e.textContent];for(const l of n){const c=x(l);if(c&&!w(c)&&!F(e))return c}},jt=(t,e,n)=>{const i=Array.from(t.querySelectorAll("a[href^='/title/']")).filter(s=>b(s));if(!i.length)return null;const r=e==null?void 0:e.getBoundingClientRect();let a=null;for(const s of i){if(F(s)||k(s,n)||!z(s))continue;const c=s.getBoundingClientRect(),f=c.width*c.height;let h=0;if(r){const m=r.top-220,g=r.bottom+220;if(c.bottom<m||c.top>g)continue}if(e&&(s.contains(e)||e.contains(s))&&(h+=1e3),r){const m=c.left+c.width/2-(r.left+r.width/2),g=c.top+c.height/2-(r.top+r.height/2),p=Math.hypot(m,g);h+=Math.max(0,500-p)}h+=Math.min(f/100,200),h+=50,(!a||h>a.score)&&(a={anchor:s,score:h})}return(a==null?void 0:a.anchor)??null},Kt=t=>{if(t){const e=Ut(t);if(e)return e}return $t()},V=(t,e,n)=>{const o=nt(t);if(!o)return null;const i=(e==null?void 0:e.getAttribute("href"))??null,r=ut(i)??null,{year:a,isSeries:s}=zt(n);return{rawTitle:t,normalizedTitle:o,year:a??null,isSeries:s,netflixId:r,href:i}},Ut=t=>{const e=Zt(t);let n,o=null;if(e){const a=z(e);a&&(n=y(a)??a,o=e)}if(!n){let a=t,s=0;for(;a&&a!==document.body&&s<8;){const l=Vt(a);if(l){n=y(l)??l;break}a=a.parentElement,s+=1}}if(!n)return null;if(o){const a=te(o);if(a){const s=V(n,o,a);return s?{jawboneEl:a,extracted:s,chosenTitleElement:o}:null}}let i=o??t,r=0;for(;i&&i!==document.body&&r<8;){if(i instanceof HTMLElement){const a=i.getBoundingClientRect();if(a.width>=200&&a.height>=120){const s=V(n,o,i);if(s)return{jawboneEl:i,extracted:s,chosenTitleElement:o??void 0}}}i=i.parentElement,r+=1}return null},$t=()=>{const t=Qt(),e=ee().map(r=>({root:r,preview:P(r)})),n=t?[{root:t.root,preview:t.preview},...e.filter(r=>r.root!==t.root)]:e,o=window.innerWidth*.85,i=window.innerHeight*.6;for(const r of n){const a=r.root,s=a.getBoundingClientRect();if(s.width>o||s.height>i)continue;const l=r.preview??P(a),c=O(a),f=Yt(a);if(!l||!c)continue;const h=jt(a,l,c);let m=null,g=null;if(h){const d=z(h);d&&(m=y(d)??d,g=h)}if(m||(m=Xt(a).title??null),!m&&!f)continue;if(!m&&f){const d=Wt(a);d&&!w(d)&&(m=y(d)??d)}if(!m)continue;const p=V(m,g,a);if(p)return{jawboneEl:a,extracted:p,chosenTitleElement:g??void 0}}return{jawboneEl:null,extracted:null}},j=(t,e)=>{const n=qt(t);if(n)return n;const o=y(e);if(o&&!I.test(o))return o;if(e)return y(e)??e},Gt=t=>{const e=Array.from(t.querySelectorAll(it)),n=e.filter(b);return n.length>0?n[0]:e[0]},ht=()=>{const t=W.join(","),e=Array.from(document.querySelectorAll(t)),n=e.filter(b),o=window.innerWidth*.85,i=window.innerHeight*.6,r=n.filter(a=>{const s=a.getBoundingClientRect();return!(s.width===0||s.height===0||s.width<240||s.height<180||s.width>o||s.height>i)});return r.length>0?r.sort((a,s)=>{const l=a.getBoundingClientRect(),c=s.getBoundingClientRect();return c.width*c.height-l.width*l.height}):n.length>0?n:e},Jt=()=>{const t=[];return at.forEach(e=>{document.querySelectorAll(e).forEach(n=>{if(!b(n))return;const o=n.getBoundingClientRect();o.width<200||o.height<120||t.push(n)})}),t},Qt=()=>{const t=Jt();if(!t.length)return null;const e=window.innerWidth*.85,n=window.innerHeight*.6,o=t.sort((i,r)=>{const a=i.getBoundingClientRect(),s=r.getBoundingClientRect();return s.width*s.height-a.width*a.height});for(const i of o){let r=i,a=0;for(;r&&a<8;){if(r instanceof HTMLElement){const s=r.getBoundingClientRect();if(s.width>=240&&s.height>=180&&s.width<=e&&s.height<=n&&O(r))return{root:r,preview:i}}r=r.parentElement,a+=1}}return null},Zt=t=>{var o,i,r;let e=t;for(;e&&e!==document.body;){if(e instanceof HTMLAnchorElement&&((o=e.getAttribute("href"))!=null&&o.startsWith("/title/")))return e;const a=(i=e.querySelector)==null?void 0:i.call(e,":scope > a[href^='/title/']");if(a&&b(a))return a;e=e.parentElement}const n=(r=t.querySelector)==null?void 0:r.call(t,"a[href^='/title/']");return n&&b(n)?n:null},te=t=>{let e=t,n=0;const o=window.innerWidth*.85,i=window.innerHeight*.6;for(;e&&e!==document.body&&n<12;){if(e instanceof HTMLElement){const r=e.getBoundingClientRect();if(r.width>=240&&r.height>=180&&r.width<=o&&r.height<=i){const a=P(e),s=O(e);if(a&&s)return e}}e=e.parentElement,n+=1}return null},ee=()=>{const t=ht();if(t.length)return t;const e=Array.from(document.querySelectorAll(st.join(","))),n=window.innerWidth*.85,o=window.innerHeight*.6,i=new Set;return e.forEach(r=>{let a=r,s=0;for(;a&&s<6;){if(a instanceof HTMLElement){const l=a.getBoundingClientRect();if(l.width>=240&&l.height>=180&&l.width<=n&&l.height<=o&&P(a)){i.add(a);break}}a=a.parentElement,s+=1}}),Array.from(i)},ne=()=>{const t=ht();for(const n of t){const o=Gt(n);if(o){const r=ft(o,"container-anchor");if(r.netflixTitleId||r.titleText){const a=r.titleText??Y(n),s=j(n,a??r.titleText);return{candidate:{...r,titleText:s,year:H(s??a)},container:n}}}const i=Y(n);if(i){const r=j(n,i);return{candidate:{titleText:r??i,year:H(r??i),source:"container-text"},container:n}}}const e=Array.from(document.querySelectorAll(it)).find(b);if(e){const n=ft(e,"page-anchor"),o=j(e.closest(W.join(","))??e.parentElement,n.titleText);return{candidate:{...n,titleText:o??n.titleText,year:H(o??n.titleText)},container:e.closest(W.join(","))??e.parentElement}}return{candidate:null,container:null}},oe="nxlb-top-section",ie=()=>{const t=document.createElement("div");t.id=oe,t.style.display="block",t.style.width="100%",t.style.pointerEvents="none";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
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
  `;const o=document.createElement("div");o.className="nxl-top-section";const i=document.createElement("div");i.className="nxl-header";const r=document.createElement("div");r.className="nxl-branding",r.innerHTML=`
    Powered by
    <span class="nxl-dots">
      <span class="nxl-dot green"></span>
      <span class="nxl-dot orange"></span>
      <span class="nxl-dot blue"></span>
    </span>
    Letterboxd
  `,i.appendChild(r);const a=document.createElement("div");a.className="nxl-body";const s=document.createElement("div");s.className="nxl-rating",s.dataset.field="communityRating",s.textContent="Community rating: —";const l=document.createElement("div");l.className="nxl-match",l.dataset.field="match",l.textContent="Your match: —";const c=document.createElement("div");c.className="nxl-because",c.dataset.field="because",c.textContent="Because you like: —";const f=document.createElement("div");return f.className="nxl-badges",f.dataset.field="badges",a.appendChild(s),a.appendChild(l),a.appendChild(c),a.appendChild(f),o.appendChild(i),o.appendChild(a),e.appendChild(n),e.appendChild(o),t},re=t=>t==null?"":t>=1e6?`${(t/1e6).toFixed(1)}M`:t>=1e3?`${(t/1e3).toFixed(1)}K`:`${t}`,ae=t=>{const e=Math.max(0,Math.min(5,t)),n=Math.floor(e),o=e%1>=.5;return"★".repeat(n)+(o?"½":"")},mt=(t,e)=>{var c,f,h,m,g,p;const n=((c=e.tmdb)==null?void 0:c.voteAverage)??null,o=((f=e.tmdb)==null?void 0:f.voteCount)??null,i=e.letterboxd,r=(h=t.shadowRoot)==null?void 0:h.querySelector("[data-field='communityRating']");if(r)if(n!=null){const d=re(o),R=n/2;r.innerHTML=`
        Community rating:
        <span class="nxl-star">★</span>
        ${R.toFixed(1)}${d?` <span class="nxl-meta">${d} ratings</span>`:""}
      `}else r.textContent="Community rating: —";const a=(m=t.shadowRoot)==null?void 0:m.querySelector("[data-field='match']");a&&((i==null?void 0:i.matchPercent)!==null&&(i==null?void 0:i.matchPercent)!==void 0?a.innerHTML=`Your match: <span class="nxl-match-value">${i.matchPercent}%</span>`:a.textContent="Your match: —");const s=(g=t.shadowRoot)==null?void 0:g.querySelector("[data-field='because']");if(s){const d=(i==null?void 0:i.becauseYouLike)??[];s.textContent=d.length>0?`Because you like: ${d.join(", ")}`:"Because you like: —"}const l=(p=t.shadowRoot)==null?void 0:p.querySelector("[data-field='badges']");if(l){if(l.innerHTML="",i!=null&&i.inWatchlist){const d=document.createElement("span");d.className="nxl-badge",d.textContent="On your watchlist",l.appendChild(d)}if((i==null?void 0:i.userRating)!==null&&(i==null?void 0:i.userRating)!==void 0){const d=document.createElement("span");d.className="nxl-badge",d.textContent=`You rated ${ae(i.userRating)}`,l.appendChild(d)}if(!(i!=null&&i.inWatchlist)&&(i==null?void 0:i.userRating)===void 0){const d=document.createElement("span");d.className="nxl-badge",d.textContent="Letterboxd: —",l.appendChild(d)}}},se=()=>{let t=null,e=null,n=null;const o=()=>{e||(e=ie())};return{mount:l=>{o(),e&&t!==l&&(e.remove(),l.insertBefore(e,l.firstChild),t=l,requestAnimationFrame(()=>{e==null||e.classList.add("nxl-visible")}))},update:l=>{n=l,e&&mt(e,l)},unmount:()=>{e&&e.remove(),t=null},renderLast:()=>{e&&n&&mt(e,n)},getLastData:()=>n,getCurrentRoot:()=>t,isMounted:()=>!!(e&&e.isConnected)}},pt="nxlb-status-badge",le=()=>{const t=document.createElement("div");t.id=pt,t.style.position="fixed",t.style.bottom="16px",t.style.right="16px",t.style.zIndex="2147483647",t.style.pointerEvents="none";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
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
  `,e.appendChild(n),e.appendChild(o),t},S=t=>{const e=document.getElementById(pt);if(!t){e&&(e.remove(),u("OVERLAY_BADGE_REMOVED"));return}if(e)return;const n=le();document.documentElement.appendChild(n),u("OVERLAY_BADGE_MOUNTED")},K={ctrlKey:!0,shiftKey:!0,key:"l"},ce=250,de=2e3,ue=.85,fe=.6,T=se();let A=!0,gt="",Et=null,U,$,bt="",L=null,v=!1,xt=null,D=null;const yt=()=>window,he=t=>{if(!t)return!1;const e=t.getBoundingClientRect();return e.width===0||e.height===0?!1:e.width>window.innerWidth*ue||e.height>window.innerHeight*fe},G=t=>{L&&L!==t&&(L.style.outline="",L.style.outlineOffset="",L=null),t&&(t.style.outline="1px solid rgba(255, 80, 80, 0.85)",t.style.outlineOffset="-1px",L=t)},me=()=>window.location.pathname.includes("/watch/"),Tt=()=>Array.from(document.querySelectorAll("video")).some(e=>{if(e.paused||e.ended)return!1;const n=e.getBoundingClientRect();if(n.width===0||n.height===0)return!1;const o=n.width/window.innerWidth,i=n.height/window.innerHeight;return o>.85||i>.6}),pe=()=>!!document.querySelector("[data-uia*='video-player'], [class*='VideoPlayer'], [class*='watch-video'], [data-uia*='player']"),ge=()=>!!(me()||Tt()||pe()&&Tt()),J=()=>{const t=ge();t!==v&&(v=t,v?(S(!1),u("BADGE_HIDDEN_PLAYBACK"),T.unmount()):A&&(S(!0),u("BADGE_SHOWN"),u("BROWSE_MODE_DETECTED")))},Ee=()=>{if(!A){S(!1);return}v||(S(!0),u("BADGE_SHOWN"))},be=t=>[t.normalizedTitle??"",t.year??"",t.netflixId??"",t.href??""].join("|"),xe=(t,e)=>({title:t,year:e??null,tmdb:{id:null,voteAverage:null,voteCount:null},letterboxd:{inWatchlist:!1,userRating:null,matchPercent:null,becauseYouLike:[]}}),ye=t=>{var e;try{return(e=chrome.runtime)!=null&&e.id?chrome.runtime.sendMessage(t):(u("EXT_CONTEXT_INVALID",{messageType:t==null?void 0:t.type}),Promise.resolve(null))}catch(n){return u("EXT_CONTEXT_SEND_FAILED",{error:n,messageType:t==null?void 0:t.type}),Promise.resolve(null)}},Te=()=>D?D.isConnected?D:(D=null,null):null,Q=t=>{if(!A||(J(),v))return;u("OVERLAY_MOUNT_ATTEMPT",{reason:t});const e=Kt(Te()),n=e.jawboneEl,o=e.extracted;if(!n||!o){u("OVERLAY_MOUNT_FAILED",{reason:"no-jawbone"}),T.unmount(),G(null);return}if(he(n)){u("OVERLAY_MOUNT_FAILED",{reason:"hero-sized"}),T.unmount(),G(null);return}u("ACTIVE_JAWBONE_FOUND",{rawTitle:o.rawTitle,netflixId:o.netflixId,year:o.year,isSeries:o.isSeries,rejectedTitleCandidates:e.rejectedCount,chosenTitleElement:e.chosenTitleElement?e.chosenTitleElement.outerHTML.slice(0,200):void 0}),u("EXTRACTED_TITLE_INFO",o);const i=be(o);if(i===gt&&n===Et){u("OVERLAY_MOUNT_SUCCESS",{reused:!0});return}gt=i,Et=n,G(n),T.mount(n),T.update(xe(o.rawTitle,o.year??void 0));const r=`req_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;bt=r;const a={type:"RESOLVE_OVERLAY_DATA",requestId:r,payload:o};u("OVERLAY_REQUEST",{titleText:o.rawTitle,normalizedTitle:o.normalizedTitle,href:o.href,year:o.year}),ye(a).then(s=>{var l,c,f,h,m,g;if(s&&(s==null?void 0:s.type)==="OVERLAY_DATA_RESOLVED"&&s.requestId===bt){xt=s.payload,u("OVERLAY_RESPONSE",{requestId:r,tmdb:s.payload.tmdb,letterboxd:{inWatchlist:((l=s.payload.letterboxd)==null?void 0:l.inWatchlist)??!1,userRating:((c=s.payload.letterboxd)==null?void 0:c.userRating)??null,matchPercent:((f=s.payload.letterboxd)==null?void 0:f.matchPercent)??null,becauseYouLikeCount:((m=(h=s.payload.letterboxd)==null?void 0:h.becauseYouLike)==null?void 0:m.length)??0}}),T.update(s.payload);{const p=s.payload.letterboxd;if(!p||!p.inWatchlist&&p.userRating===null){const d=Dt(o.rawTitle,o.year??void 0);try{(g=chrome.runtime)!=null&&g.id?chrome.storage.local.get([E.LETTERBOXD_INDEX]).then(R=>{R[E.LETTERBOXD_INDEX]?o.year?u("LB_MATCH_NOT_FOUND",{reason:"no-key",key:d}):u("LB_MATCH_NOT_FOUND",{reason:"missing-year",key:d}):u("LB_MATCH_NOT_FOUND",{reason:"no-index",key:d})}):u("LB_INDEX_SKIP_EXT_CONTEXT_INVALID",{key:d})}catch(R){u("LB_INDEX_LOOKUP_FAILED",{error:R,key:d})}}}}}).catch(s=>{u("Title resolve failed",{requestId:r,err:s})})},C=t=>{U&&window.clearTimeout(U),U=window.setTimeout(()=>{Q(t)},ce)},we=()=>{new MutationObserver(()=>{try{C("mutation")}catch(e){u("Mutation observer failed",{error:e})}}).observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","aria-expanded","aria-hidden"]}),document.addEventListener("pointerover",e=>{try{D=e.target,C("pointer")}catch(n){u("Pointer observer failed",{error:n})}},!0),document.addEventListener("focusin",()=>{try{C("focus")}catch(e){u("Focus observer failed",{error:e})}},!0),$&&window.clearInterval($),$=window.setInterval(()=>{A&&(J(),!v&&(T.isMounted()||Q("watchdog")))},de),C("init")},Ae=async()=>{const e=!((await ot())[E.OVERLAY_ENABLED]??!0);await Bt({[E.OVERLAY_ENABLED]:e}),A=e,e?(Ee(),C("toggle")):(T.unmount(),S(!1)),u("Overlay toggled",{enabled:e})},ve=t=>{t.ctrlKey===K.ctrlKey&&t.shiftKey===K.shiftKey&&t.key.toLowerCase()===K.key&&(t.preventDefault(),Ae().catch(e=>u("Toggle failed",e)))},Ce=()=>{chrome.runtime.onMessage.addListener(t=>{if((t==null?void 0:t.type)==="LB_INDEX_UPDATED"){u("LB_INDEX_UPDATED"),C("lb-index-updated");return}(t==null?void 0:t.type)==="LB_INDEX_UPDATED_ACK"&&(u("LB_INDEX_UPDATED_ACK",t.payload),C("lb-index-updated"))})},_e=()=>{const t=yt();t.__nxlDebug={getLbIndex:async()=>chrome.storage.local.get(E.LETTERBOXD_INDEX),lastOverlayData:()=>xt,forceResolve:()=>Q("force")}},Re=async()=>{const t=yt();if(t.__nxlBooted)return;t.__nxlBooted=!0,A=(await ot())[E.OVERLAY_ENABLED]??!0,J(),A&&!v&&(S(!0),u("BADGE_SHOWN"),u("BROWSE_MODE_DETECTED")),we(),Ce(),_e(),window.addEventListener("keydown",ve)},wt="nxl-xray-panel";function Se(){const t=document.createElement("div");t.id=wt,t.style.cssText=`
    position: fixed;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 280px;
    max-height: 70vh;
    overflow-y: auto;
    z-index: 2147483646;
    pointer-events: auto;
    font-family: "Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  `;const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
    :host, .panel {
      all: initial;
      font-family: "Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    .panel {
      background: rgba(0, 0, 0, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      color: #f5f5f5;
    }
    .panel-title {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 12px;
      letter-spacing: 0.02em;
    }
    .actor-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .actor-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .actor-card:last-child {
      border-bottom: none;
    }
    .actor-photo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      background: rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }
    .actor-info {
      flex: 1;
      min-width: 0;
    }
    .actor-name {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
    .actor-character {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.65);
      margin-top: 2px;
    }
    .actor-confidence {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 2px;
    }
    .state-message {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      padding: 12px 0;
      text-align: center;
    }
    .state-loading {
      color: rgba(255, 255, 255, 0.5);
    }
  `;const o=document.createElement("div");return o.className="panel",o.innerHTML='<div class="panel-title">In this scene</div><div class="actor-list" data-list></div>',e.appendChild(n),e.appendChild(o),t}let N=null;function Le(){return(!N||!N.isConnected)&&(N=Se(),document.documentElement.appendChild(N)),N}function Z(){var e;return((e=Le().shadowRoot)==null?void 0:e.querySelector("[data-list]"))??null}function At(t){const e=Z();if(e){if(e.innerHTML="",e.classList.remove("state-loading"),t.length===0){e.innerHTML='<div class="state-message">No faces visible in this frame</div>';return}for(const n of t){const o=document.createElement("div");o.className="actor-card";const i=document.createElement("img");i.className="actor-photo",i.alt=n.name,n.photoUrl?(i.src=n.photoUrl,i.onerror=()=>{i.style.display="none"}):i.style.display="none";const r=document.createElement("div");r.className="actor-info";const a=document.createElement("div");if(a.className="actor-name",a.textContent=n.name,r.appendChild(a),n.character){const s=document.createElement("div");s.className="actor-character",s.textContent=n.character,r.appendChild(s)}if(n.confidence>0&&n.confidence<1){const s=document.createElement("div");s.className="actor-confidence",s.textContent=`${Math.round(n.confidence*100)}% match`,r.appendChild(s)}o.appendChild(i),o.appendChild(r),e.appendChild(o)}}}function Ne(){const t=Z();t&&(t.innerHTML='<div class="state-message state-loading">Identifying actors…</div>')}function B(t){const e=Z();e&&(e.innerHTML=`<div class="state-message">${De(t)}</div>`)}function Oe(){const t=document.getElementById(wt);t&&t.remove(),N=null}function De(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}let _,vt=0,Ct=!0;function Be(){const t=window.location.pathname.match(/\/watch\/(\d+)/);return t==null?void 0:t[1]}function Ie(){var a,s;const{candidate:t,container:e}=ne();if(t!=null&&t.titleText)return{titleText:t.titleText,year:t.year??void 0};const n=document.querySelector("[data-uia='video-title'], .title-title, [class*='title']"),o=(a=n==null?void 0:n.textContent)==null?void 0:a.trim(),i=document.querySelector("[class*='year'], [data-uia*='year']"),r=(s=i==null?void 0:i.textContent)==null?void 0:s.match(/(19\d{2}|20\d{2})/);return{titleText:o??void 0,year:r?Number(r[1]):void 0}}function Me(){if(!Ct)return;const t=Be();if(!t){u("X-Ray: no title ID on watch page"),B("Could not detect title");return}const{titleText:e,year:n}=Ie(),o={tabId:0,netflixTitleId:t,titleText:e,year:n,timestamp:Math.floor(Date.now()/1e3)};chrome.runtime.sendMessage({type:"ANALYZE_FRAME",requestId:`xray_${Date.now()}`,payload:o},i=>{if(chrome.runtime.lastError){B(chrome.runtime.lastError.message||"Extension error");return}if((i==null?void 0:i.type)!=="XRAY_FRAME_RESULT"){B("No response");return}const{actors:r,noFaces:a,drmBlocked:s,error:l}=i.payload;if(l){B(s?"Capture not available (DRM)":l);return}At(a?[]:r)})}function _t(){const t=document.querySelectorAll("video");for(const e of t){const n=e.getBoundingClientRect();if(n.width>=window.innerWidth*.5&&n.height>=window.innerHeight*.5)return e}return t[0]??null}function tt(){const t=Date.now();t-vt<et||(vt=t,_&&window.clearTimeout(_),_=window.setTimeout(()=>{_=void 0,Ne(),Me()},et))}function He(){_&&(window.clearTimeout(_),_=void 0),Oe()}function Rt(t){t.addEventListener("pause",tt),t.addEventListener("play",He)}function St(){return window.location.pathname.includes("/watch/")}async function Pe(){if(Ct=(await chrome.storage.local.get([E.XRAY_ENABLED]))[E.XRAY_ENABLED]!==!1,!St())return;const e=_t();e&&(Rt(e),e.paused&&tt()),new MutationObserver(()=>{if(!St())return;const o=_t();o&&!o.dataset.nxlObserved&&(o.dataset.nxlObserved="1",Rt(o),o.paused&&tt())}).observe(document.body,{childList:!0,subtree:!0})}const Lt=async()=>{await Re(),await Pe()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Lt().catch(t=>u("Init failed",t))},{once:!0}):Lt().catch(t=>u("Init failed",t))})();
//# sourceMappingURL=index.js.map
