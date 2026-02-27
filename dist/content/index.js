(function(){"use strict";const E={OVERLAY_ENABLED:"overlayEnabled",TMDB_API_KEY:"tmdbApiKey",TMDB_CACHE:"tmdbCache",TMDB_FEATURE_CACHE:"tmdbFeatureCache",MATCH_PROFILE:"matchProfile",LETTERBOXD_INDEX:"lb_index_v1",LETTERBOXD_STATS:"lb_stats_v1",LAST_IMPORT_AT:"lastImportAt",XRAY_ENABLED:"xrayEnabled",AWS_ACCESS_KEY_ID:"awsAccessKeyId",AWS_SECRET_ACCESS_KEY:"awsSecretAccessKey",AWS_REGION:"awsRegion"},pt=500,d=(...t)=>{console.log("[Netflix+Letterboxd]",...t)};function b(){var t;try{return typeof chrome<"u"&&!!((t=chrome.runtime)!=null&&t.id)}catch{return!1}}function B(t){var e;return t instanceof Error&&((e=t.message)==null?void 0:e.includes("Extension context invalidated"))}const j=t=>t?t.toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9']+/g," ").replace(/\s+/g," ").trim():"",Gt=(t,e)=>{const n=j(t),o=e?String(e):"";return`${n}-${o}`},Jt=(t,e)=>Gt(t,e),gt=async()=>(d("Loading storage state"),chrome.storage.local.get([E.OVERLAY_ENABLED,E.TMDB_API_KEY,E.TMDB_CACHE,E.TMDB_FEATURE_CACHE,E.MATCH_PROFILE,E.LETTERBOXD_INDEX,E.LETTERBOXD_STATS,E.LAST_IMPORT_AT,E.AWS_ACCESS_KEY_ID,E.AWS_SECRET_ACCESS_KEY,E.AWS_REGION])),Zt=async t=>{d("Saving storage state",t),await chrome.storage.local.set(t)},Et="a[href^='/title/']",K=["[role='dialog']","[aria-modal='true']","[aria-expanded='true']","[data-uia*='jawbone']","[class*='jawbone']","[data-uia*='preview']","[data-uia*='billboard']","[data-uia*='hero']","[data-uia*='details']"],yt=["h1","h2","h3","[data-uia*='title']","[class*='title']","[class*='fallback']","[class*='preview'] [class*='header']"],bt=["video","img","[data-uia*='preview'] video","[data-uia*='preview'] img","[class*='preview'] video","[class*='preview'] img","[data-uia*='player'] video","[data-uia*='hero'] img"],wt=["[data-uia*='controls']","[class*='controls']","[class*='control']","[role='toolbar']"],X=/(S\d+\s*:?\s*E\d+|Season\s*\d+\s*Episode\s*\d+|Episode\s*\d+|\bE\d+\b)/i,$=/(\b\d+\s*(m|min|minutes)\b|\b\d+\s*of\s*\d+\s*(m|min|minutes)\b)/i,Qt=/\b(tv-[a-z0-9]+|pg-?13|pg|tv-ma|tv-y|tv-g|nr|nc-17|hd|uhd|4k|seasons?|season|episode|volume|part\s+\d+)\b/i,te=/^(play|resume|continue|more info|details|watch|watch now|watch again|add|added|my list|remove|rate|like|dislike|thumbs up|thumbs down)$/i,ee=/because you watched/i,ne=/(^["'\-]\s*[a-z]|\[[^\]]+\]|♪|^\s*-\s*[a-z]|[a-z][.!?]\s*$)/i,oe=/[a-z][.!?]\s+[A-Z][a-z]/,xt=["[data-uia*='maturity-rating']","[data-uia*='season']","[data-uia*='resolution']","[data-uia*='hd']","[class*='maturity']","[class*='season']","[class*='quality']"],Tt=["[data-uia*='genre']","a[href*='/genre/']","[class*='genre']"],At=[...xt,...Tt,"[data-uia*='metadata']","[class*='metadata']","[class*='meta']","[class*='maturity']","[class*='season']","[class*='genre']","[class*='tag']","[class*='info']"],ie=["header","nav","[data-uia*='header']","[data-uia*='row-title']","[class*='rowHeader']","[class*='row-title']"],W=["h1","h2","h3","h4","[data-uia*='title']","[class*='title']","[class*='headline']","[class*='header']","[class*='name']"],re=/(browse|home|my list|popular|your next watch|explore all|movies & shows|movies and shows|new & popular)/i,y=t=>{const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return!1;const n=window.getComputedStyle(t);return n.visibility==="hidden"||n.display==="none"||n.opacity==="0"?!1:e.bottom>=0&&e.right>=0&&e.top<=window.innerHeight&&e.left<=window.innerWidth},x=t=>{if(!t)return;const e=t.replace(/\s+/g," ").trim();return e.length?e:void 0},_t=t=>{if(!t)return;const e=t.match(/\/title\/(\d+)/);return e==null?void 0:e[1]},F=t=>{if(!t)return;const e=t.match(/(19\d{2}|20\d{2})/);if(!e)return;const n=Number(e[1]);if(!Number.isNaN(n))return n},T=t=>{if(!t)return;let e=t;return e=e.replace(/^\s*S\d+\s*:?\s*E\d+\s*/i,""),e=e.replace(/"[^"]*"/g,n=>{const o=n.replace(/"/g,"");return X.test(o)?"":n}),e=e.replace(/Episode\s*\d+/gi,""),e=e.replace(/\bE\d+\b/gi,""),e=e.replace($,""),e=e.replace(/\s+of\s+\d+\s*(m|min|minutes)?/gi,""),e=e.replace(/\s+/g," ").trim(),e.length?e:void 0},vt=(t,e)=>{const n=t.getAttribute("href")||void 0,o=_t(n),i=x(t.getAttribute("aria-label")||t.textContent);return{netflixTitleId:o,titleText:i,href:n,source:e}},G=t=>{for(const e of yt){const n=t.querySelector(e);if(n&&y(n)){const o=x(n.textContent);if(o)return o}}},ae=t=>{if(t)return G(t)},se=t=>{if(t)for(const e of yt){const n=Array.from(t.querySelectorAll(e));for(const o of n){if(!y(o))continue;const i=x(o.textContent);if(!i||X.test(i)||$.test(i))continue;const r=T(i);if(r)return r}}},z=t=>{if(!t)return null;const e=[];return bt.forEach(n=>{t.querySelectorAll(n).forEach(o=>{y(o)&&e.push(o)})}),e.length?e.reduce((n,o)=>{const i=n.getBoundingClientRect(),r=o.getBoundingClientRect(),a=i.width*i.height;return r.width*r.height>a?o:n}):null},I=t=>{var i;if(!t)return null;const e=[];wt.forEach(r=>{t.querySelectorAll(r).forEach(a=>{y(a)&&e.push(a)})});const o=Array.from(new Set(e)).map(r=>{const a=r.querySelectorAll("button, [role='button']").length,s=r.getBoundingClientRect(),c=a*10+s.width;return{el:r,score:c,top:s.top}}).filter(r=>r.score>0);return o.sort((r,a)=>a.score-r.score||a.top-r.top),((i=o[0])==null?void 0:i.el)??null},ce=t=>{if(!t)return!1;const e=[...xt,...Tt].join(",");return Array.from(t.querySelectorAll(e)).some(o=>y(o))},le=t=>!!t.closest(At.join(",")),J=t=>!!t.closest(ie.join(",")),_=t=>re.test(t)||te.test(t.trim())||ee.test(t)||Qt.test(t)||ne.test(t)||oe.test(t)?!0:X.test(t)||$.test(t)||/\b\d+\s*of\s*\d+\s*(m|min|minutes)?\b/i.test(t)||/\b\d+\s*(m|min|minutes)\b/i.test(t),Z=(t,e)=>t.closest('[role="progressbar"], [data-uia*="progress"], [class*="progress"]')?!0:e!==void 0?t.getBoundingClientRect().bottom>=e-8:!1,q=(t,e)=>t?e&&(e.contains(t)||t.closest("button, [role='button']"))?!0:!!t.closest("button, [role='button'], [data-uia*='play'], [data-uia*='button']"):!1,de=t=>{const e=t.getBoundingClientRect(),n=I(t),o=n?n.getBoundingClientRect().top:void 0,i=Array.from(t.querySelectorAll(W.join(",")));let r,a=0;const s=[];if(i.forEach(l=>{if(!y(l)){a+=1;return}if(J(l)){a+=1;return}if(q(l,n)){a+=1;return}if(Z(l,o)){a+=1;return}const f=x(l.textContent);if(!f||f.length<2||f.length>80){a+=1;return}if(_(f)){s.push(l),a+=1;return}const h=l.getBoundingClientRect(),m=window.getComputedStyle(l),g=parseFloat(m.fontSize)||14,p=m.fontWeight==="bold"?700:Number(m.fontWeight),u=Number.isNaN(p)?400:p,mt=h.left-e.left,mn=h.top-e.top,pn=Math.hypot(mt,mn),gn=le(l)?120:0,$t=g*10+u/10+Math.max(0,300-pn)-gn;(!r||$t>r.score)&&(r={el:l,score:$t,text:f})}),r)return{title:T(r.text)??r.text,chosen:r.el,rejectedCount:a};for(const l of s){let f=l.parentElement,h=0;for(;f&&h<4;){const m=Array.from(f.querySelectorAll(W.join(","))).filter(g=>g!==l);for(const g of m){if(!y(g)||q(g,n)||Z(g,o))continue;const p=x(g.textContent);if(!(!p||p.length<2||p.length>80)&&!_(p))return{title:T(p)??p,chosen:g,rejectedCount:a}}f=f.parentElement,h+=1}}const c=t.querySelector("a[href^='/title/']");if(c){const l=c.querySelector(W.join(",")),f=x((l==null?void 0:l.textContent)||c.textContent);if(f&&!_(f))return{title:T(f)??f,chosen:l??c,rejectedCount:a};let h=c.parentElement,m=0;for(;h&&m<4;){const g=Array.from(h.querySelectorAll(W.join(",")));for(const p of g){if(!y(p)||q(p,n)||Z(p,o))continue;const u=x(p.textContent);if(!(!u||u.length<2||u.length>80)&&!_(u))return{title:T(u)??u,chosen:p,rejectedCount:a}}h=h.parentElement,m+=1}}return{title:null,rejectedCount:a}},ue=t=>{const n=Array.from(t.querySelectorAll(At.join(","))).map(c=>x(c.textContent)).filter(Boolean);if(!n.length){const c=I(t),l=c==null?void 0:c.nextElementSibling,f=x(l==null?void 0:l.textContent);f&&n.push(f)}const o=n.join(" "),i=F(o),r=/\bseasons?\b/i.test(o),a=/\b\d+\s*(m|min|minutes)\b/i.test(o)||/\b\d+\s*h\b/i.test(o);let s;return r?s=!0:a&&(s=!1),{year:i,isSeries:s}},Ct=t=>t.replace(/\s*[-|:]\s*season\s+\d+.*$/i,"").replace(/\s*season\s+\d+.*$/i,"").replace(/\s*[-|:]\s*part\s+\d+.*$/i,"").replace(/\s*[-|:]\s*(official\s+)?trailer.*$/i,"").replace(/\s+/g," ").trim(),Rt=t=>{const e=j(t);if(!e)return Number.NEGATIVE_INFINITY;const n=e.split(" ").filter(Boolean);let o=n.length*12;return n.length===1&&(o-=20),t.length>=8&&(o+=8),t.length>=14&&(o+=8),/\d/.test(t)&&(o-=8),o},Q=t=>{var o,i;const e=[[t.getAttribute("aria-label"),t.getAttribute("title"),(o=t.querySelector("img[alt]"))==null?void 0:o.alt,(i=t.querySelector("[aria-label]"))==null?void 0:i.getAttribute("aria-label")],[t.textContent]];let n=null;for(const r of e){for(const a of r){const s=x(a);if(!s)continue;const c=Ct(s);if(!c||_(c))continue;const l=Rt(c);(!n||l>n.score)&&(n={text:c,score:l})}if(n)return n.text}},fe=t=>{var i,r,a,s,c;const e=t,n=[((i=e.getAttribute)==null?void 0:i.call(e,"aria-label"))??void 0,((r=e.getAttribute)==null?void 0:r.call(e,"data-uia-title"))??void 0,((a=e.getAttribute)==null?void 0:a.call(e,"title"))??void 0,(c=(s=e.querySelector)==null?void 0:s.call(e,"img[alt]"))==null?void 0:c.alt];let o=null;for(const l of n){const f=x(l);if(!f)continue;const h=Ct(f);if(!h||_(h)||J(e))continue;const m=Rt(h);(!o||m>o.score)&&(o={text:h,score:m})}return o==null?void 0:o.text},he=(t,e,n)=>{const i=Array.from(t.querySelectorAll("a[href^='/title/']")).filter(s=>y(s));if(!i.length)return null;const r=e==null?void 0:e.getBoundingClientRect();let a=null;for(const s of i){if(J(s)||q(s,n)||!Q(s))continue;const l=s.getBoundingClientRect(),f=l.width*l.height;let h=0;if(r){const m=r.top-220,g=r.bottom+220;if(l.bottom<m||l.top>g)continue}if(e&&(s.contains(e)||e.contains(s))&&(h+=1e3),r){const m=l.left+l.width/2-(r.left+r.width/2),g=l.top+l.height/2-(r.top+r.height/2),p=Math.hypot(m,g);h+=Math.max(0,500-p)}h+=Math.min(f/100,200),h+=50,(!a||h>a.score)&&(a={anchor:s,score:h})}return(a==null?void 0:a.anchor)??null},me=t=>{if(t){const e=pe(t);if(e)return e}return ge()},tt=(t,e,n)=>{const o=j(t);if(!o)return null;const i=(e==null?void 0:e.getAttribute("href"))??null,r=_t(i)??null,{year:a,isSeries:s}=ue(n);return{rawTitle:t,normalizedTitle:o,year:a??null,isSeries:s,netflixId:r,href:i}},pe=t=>{const e=we(t);let n,o=null;if(e){const a=Q(e);a&&(n=T(a)??a,o=e)}if(!n){let a=t,s=0;for(;a&&a!==document.body&&s<8;){const c=fe(a);if(c){n=T(c)??c;break}a=a.parentElement,s+=1}}if(!n)return null;if(o){const a=xe(o);if(a){const s=tt(n,o,a);return s?{jawboneEl:a,extracted:s,chosenTitleElement:o}:null}}let i=o??t,r=0;for(;i&&i!==document.body&&r<8;){if(i instanceof HTMLElement){const a=i.getBoundingClientRect();if(a.width>=200&&a.height>=120){const s=tt(n,o,i);if(s)return{jawboneEl:i,extracted:s,chosenTitleElement:o??void 0}}}i=i.parentElement,r+=1}return null},ge=()=>{const t=be(),e=Te().map(r=>({root:r,preview:z(r)})),n=t?[{root:t.root,preview:t.preview},...e.filter(r=>r.root!==t.root)]:e,o=window.innerWidth*.85,i=window.innerHeight*.6;for(const r of n){const a=r.root,s=a.getBoundingClientRect();if(s.width>o||s.height>i)continue;const c=r.preview??z(a),l=I(a),f=ce(a);if(!c||!l)continue;const h=he(a,c,l);let m=null,g=null;if(h){const u=Q(h);u&&(m=T(u)??u,g=h)}if(m||(m=de(a).title??null),!m&&!f)continue;if(!m&&f){const u=ae(a);u&&!_(u)&&(m=T(u)??u)}if(!m)continue;const p=tt(m,g,a);if(p)return{jawboneEl:a,extracted:p,chosenTitleElement:g??void 0}}return{jawboneEl:null,extracted:null}},et=(t,e)=>{const n=se(t);if(n)return n;const o=T(e);if(o&&!X.test(o))return o;if(e)return T(e)??e},Ee=t=>{const e=Array.from(t.querySelectorAll(Et)),n=e.filter(y);return n.length>0?n[0]:e[0]},St=()=>{const t=K.join(","),e=Array.from(document.querySelectorAll(t)),n=e.filter(y),o=window.innerWidth*.85,i=window.innerHeight*.6,r=n.filter(a=>{const s=a.getBoundingClientRect();return!(s.width===0||s.height===0||s.width<240||s.height<180||s.width>o||s.height>i)});return r.length>0?r.sort((a,s)=>{const c=a.getBoundingClientRect(),l=s.getBoundingClientRect();return l.width*l.height-c.width*c.height}):n.length>0?n:e},ye=()=>{const t=[];return bt.forEach(e=>{document.querySelectorAll(e).forEach(n=>{if(!y(n))return;const o=n.getBoundingClientRect();o.width<200||o.height<120||t.push(n)})}),t},be=()=>{const t=ye();if(!t.length)return null;const e=window.innerWidth*.85,n=window.innerHeight*.6,o=t.sort((i,r)=>{const a=i.getBoundingClientRect(),s=r.getBoundingClientRect();return s.width*s.height-a.width*a.height});for(const i of o){let r=i,a=0;for(;r&&a<8;){if(r instanceof HTMLElement){const s=r.getBoundingClientRect();if(s.width>=240&&s.height>=180&&s.width<=e&&s.height<=n&&I(r))return{root:r,preview:i}}r=r.parentElement,a+=1}}return null},we=t=>{var o,i,r;let e=t;for(;e&&e!==document.body;){if(e instanceof HTMLAnchorElement&&((o=e.getAttribute("href"))!=null&&o.startsWith("/title/")))return e;const a=(i=e.querySelector)==null?void 0:i.call(e,":scope > a[href^='/title/']");if(a&&y(a))return a;e=e.parentElement}const n=(r=t.querySelector)==null?void 0:r.call(t,"a[href^='/title/']");return n&&y(n)?n:null},xe=t=>{let e=t,n=0;const o=window.innerWidth*.85,i=window.innerHeight*.6;for(;e&&e!==document.body&&n<12;){if(e instanceof HTMLElement){const r=e.getBoundingClientRect();if(r.width>=240&&r.height>=180&&r.width<=o&&r.height<=i){const a=z(e),s=I(e);if(a&&s)return e}}e=e.parentElement,n+=1}return null},Te=()=>{const t=St();if(t.length)return t;const e=Array.from(document.querySelectorAll(wt.join(","))),n=window.innerWidth*.85,o=window.innerHeight*.6,i=new Set;return e.forEach(r=>{let a=r,s=0;for(;a&&s<6;){if(a instanceof HTMLElement){const c=a.getBoundingClientRect();if(c.width>=240&&c.height>=180&&c.width<=n&&c.height<=o&&z(a)){i.add(a);break}}a=a.parentElement,s+=1}}),Array.from(i)},Ae=()=>{const t=St();for(const n of t){const o=Ee(n);if(o){const r=vt(o,"container-anchor");if(r.netflixTitleId||r.titleText){const a=r.titleText??G(n),s=et(n,a??r.titleText);return{candidate:{...r,titleText:s,year:F(s??a)},container:n}}}const i=G(n);if(i){const r=et(n,i);return{candidate:{titleText:r??i,year:F(r??i),source:"container-text"},container:n}}}const e=Array.from(document.querySelectorAll(Et)).find(y);if(e){const n=vt(e,"page-anchor"),o=et(e.closest(K.join(","))??e.parentElement,n.titleText);return{candidate:{...n,titleText:o??n.titleText,year:F(o??n.titleText)},container:e.closest(K.join(","))??e.parentElement}}return{candidate:null,container:null}},_e="nxlb-top-section",ve=()=>{const t=document.createElement("div");t.id=_e,t.style.display="block",t.style.width="100%",t.style.pointerEvents="none";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
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
  `,i.appendChild(r);const a=document.createElement("div");a.className="nxl-body";const s=document.createElement("div");s.className="nxl-rating",s.dataset.field="communityRating",s.textContent="Community rating: —";const c=document.createElement("div");c.className="nxl-match",c.dataset.field="match",c.textContent="Your match: —";const l=document.createElement("div");l.className="nxl-because",l.dataset.field="because",l.textContent="Because you like: —";const f=document.createElement("div");return f.className="nxl-badges",f.dataset.field="badges",a.appendChild(s),a.appendChild(c),a.appendChild(l),a.appendChild(f),o.appendChild(i),o.appendChild(a),e.appendChild(n),e.appendChild(o),t},Ce=t=>t==null?"":t>=1e6?`${(t/1e6).toFixed(1)}M`:t>=1e3?`${(t/1e3).toFixed(1)}K`:`${t}`,Re=t=>{const e=Math.max(0,Math.min(5,t)),n=Math.floor(e),o=e%1>=.5;return"★".repeat(n)+(o?"½":"")},Lt=(t,e)=>{var l,f,h,m,g,p;const n=((l=e.tmdb)==null?void 0:l.voteAverage)??null,o=((f=e.tmdb)==null?void 0:f.voteCount)??null,i=e.letterboxd,r=(h=t.shadowRoot)==null?void 0:h.querySelector("[data-field='communityRating']");if(r)if(n!=null){const u=Ce(o),mt=n/2;r.innerHTML=`
        Community rating:
        <span class="nxl-star">★</span>
        ${mt.toFixed(1)}${u?` <span class="nxl-meta">${u} ratings</span>`:""}
      `}else r.textContent="Community rating: —";const a=(m=t.shadowRoot)==null?void 0:m.querySelector("[data-field='match']");a&&((i==null?void 0:i.matchPercent)!==null&&(i==null?void 0:i.matchPercent)!==void 0?a.innerHTML=`Your match: <span class="nxl-match-value">${i.matchPercent}%</span>`:a.textContent="Your match: —");const s=(g=t.shadowRoot)==null?void 0:g.querySelector("[data-field='because']");if(s){const u=(i==null?void 0:i.becauseYouLike)??[];s.textContent=u.length>0?`Because you like: ${u.join(", ")}`:"Because you like: —"}const c=(p=t.shadowRoot)==null?void 0:p.querySelector("[data-field='badges']");if(c){if(c.innerHTML="",i!=null&&i.inWatchlist){const u=document.createElement("span");u.className="nxl-badge",u.textContent="On your watchlist",c.appendChild(u)}if((i==null?void 0:i.userRating)!==null&&(i==null?void 0:i.userRating)!==void 0){const u=document.createElement("span");u.className="nxl-badge",u.textContent=`You rated ${Re(i.userRating)}`,c.appendChild(u)}if(!(i!=null&&i.inWatchlist)&&(i==null?void 0:i.userRating)===void 0){const u=document.createElement("span");u.className="nxl-badge",u.textContent="Letterboxd: —",c.appendChild(u)}}},Se=()=>{let t=null,e=null,n=null;const o=()=>{e||(e=ve())};return{mount:c=>{o(),e&&t!==c&&(e.remove(),c.insertBefore(e,c.firstChild),t=c,requestAnimationFrame(()=>{e==null||e.classList.add("nxl-visible")}))},update:c=>{n=c,e&&Lt(e,c)},unmount:()=>{e&&e.remove(),t=null},renderLast:()=>{e&&n&&Lt(e,n)},getLastData:()=>n,getCurrentRoot:()=>t,isMounted:()=>!!(e&&e.isConnected)}},Nt="nxlb-status-badge",Le=()=>{const t=document.createElement("div");t.id=Nt,t.style.position="fixed",t.style.bottom="16px",t.style.right="16px",t.style.zIndex="2147483647",t.style.pointerEvents="none";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
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
  `,e.appendChild(n),e.appendChild(o),t},N=t=>{if(!b())return;const e=document.getElementById(Nt);if(!t){e&&(e.remove(),d("OVERLAY_BADGE_REMOVED"));return}if(e)return;const n=Le();document.documentElement.appendChild(n),d("OVERLAY_BADGE_MOUNTED")},nt={ctrlKey:!0,shiftKey:!0,key:"l"},Ne=250,De=2e3,Oe=.85,Be=.6,Ie=2200,A=Se();let v=!0,Dt="",Ot=null,ot,it,Bt="",D=null,C=!1,It=null,O=null,Mt=0;const Pt=()=>window,Me=t=>{if(!t)return!1;const e=t.getBoundingClientRect();return e.width===0||e.height===0?!1:e.width>window.innerWidth*Oe||e.height>window.innerHeight*Be},rt=t=>{D&&D!==t&&(D.style.outline="",D.style.outlineOffset="",D=null),t&&(t.style.outline="1px solid rgba(255, 80, 80, 0.85)",t.style.outlineOffset="-1px",D=t)},Pe=()=>window.location.pathname.includes("/watch/"),Ht=()=>Array.from(document.querySelectorAll("video")).some(e=>{if(e.paused||e.ended)return!1;const n=e.getBoundingClientRect();if(n.width===0||n.height===0)return!1;const o=n.width/window.innerWidth,i=n.height/window.innerHeight;return o>.85||i>.6}),He=()=>!!document.querySelector("[data-uia*='video-player'], [class*='VideoPlayer'], [class*='watch-video'], [data-uia*='player']"),Ye=()=>!!(Pe()||Ht()||He()&&Ht()),at=()=>{const t=Ye();t!==C&&(C=t,C?(N(!1),d("BADGE_HIDDEN_PLAYBACK"),A.unmount()):v&&(N(!0),d("BADGE_SHOWN"),d("BROWSE_MODE_DETECTED")))},ke=()=>{if(!v){N(!1);return}C||(N(!0),d("BADGE_SHOWN"))},Xe=t=>[t.normalizedTitle??"",t.year??"",t.netflixId??"",t.href??""].join("|"),We=(t,e)=>({title:t,year:e??null,tmdb:{id:null,voteAverage:null,voteCount:null},letterboxd:{inWatchlist:!1,userRating:null,matchPercent:null,becauseYouLike:[]}}),Fe=()=>O?Date.now()-Mt>Ie||!O.isConnected?(O=null,null):O:null,st=t=>{if(!b()||!v||(at(),C))return;d("OVERLAY_MOUNT_ATTEMPT",{reason:t});const e=me(Fe()),n=e.jawboneEl,o=e.extracted;if(!n||!o){d("OVERLAY_MOUNT_FAILED",{reason:"no-jawbone"}),A.unmount(),rt(null);return}if(Me(n)){d("OVERLAY_MOUNT_FAILED",{reason:"hero-sized"}),A.unmount(),rt(null);return}d("ACTIVE_JAWBONE_FOUND",{rawTitle:o.rawTitle,netflixId:o.netflixId,year:o.year,isSeries:o.isSeries,rejectedTitleCandidates:e.rejectedCount,chosenTitleElement:e.chosenTitleElement?e.chosenTitleElement.outerHTML.slice(0,200):void 0}),d("EXTRACTED_TITLE_INFO",o);const i=Xe(o);if(i===Dt&&n===Ot){d("OVERLAY_MOUNT_SUCCESS",{reused:!0});return}Dt=i,Ot=n,rt(n),A.mount(n),A.update(We(o.rawTitle,o.year??void 0));const r=`req_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;Bt=r;const a={type:"RESOLVE_OVERLAY_DATA",requestId:r,payload:o};d("OVERLAY_REQUEST",{titleText:o.rawTitle,normalizedTitle:o.normalizedTitle,href:o.href,year:o.year});try{if(!b())return;chrome.runtime.sendMessage(a).then(s=>{var c,l,f,h,m;if(b()&&(s==null?void 0:s.type)==="OVERLAY_DATA_RESOLVED"&&s.requestId===Bt){It=s.payload,d("OVERLAY_RESPONSE",{requestId:r,tmdb:s.payload.tmdb,letterboxd:{inWatchlist:((c=s.payload.letterboxd)==null?void 0:c.inWatchlist)??!1,userRating:((l=s.payload.letterboxd)==null?void 0:l.userRating)??null,matchPercent:((f=s.payload.letterboxd)==null?void 0:f.matchPercent)??null,becauseYouLikeCount:((m=(h=s.payload.letterboxd)==null?void 0:h.becauseYouLike)==null?void 0:m.length)??0}}),A.update(s.payload);{const g=s.payload.letterboxd;if(!g||!g.inWatchlist&&g.userRating===null){const p=Jt(o.rawTitle,o.year??void 0);if(!b())return;chrome.storage.local.get([E.LETTERBOXD_INDEX]).then(u=>{b()&&(u[E.LETTERBOXD_INDEX]?o.year?d("LB_MATCH_NOT_FOUND",{reason:"no-key",key:p}):d("LB_MATCH_NOT_FOUND",{reason:"missing-year",key:p}):d("LB_MATCH_NOT_FOUND",{reason:"no-index",key:p}))}).catch(u=>{B(u)||d("LB_MATCH_DEBUG_FAILED",u)})}}}}).catch(s=>{B(s)||d("Title resolve failed",{requestId:r,err:s})})}catch(s){if(B(s))return;throw s}},R=t=>{b()&&(ot&&window.clearTimeout(ot),ot=window.setTimeout(()=>{b()&&st(t)},Ne))},ze=()=>{new MutationObserver(()=>{try{R("mutation")}catch(e){d("Mutation observer failed",{error:e})}}).observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","aria-expanded","aria-hidden"]}),document.addEventListener("pointerover",e=>{try{O=e.target,Mt=Date.now(),R("pointer")}catch(n){d("Pointer observer failed",{error:n})}},!0),document.addEventListener("focusin",()=>{try{R("focus")}catch(e){d("Focus observer failed",{error:e})}},!0),it&&window.clearInterval(it),it=window.setInterval(()=>{v&&(at(),!C&&(A.isMounted()||st("watchdog")))},De),R("init")},qe=async()=>{const e=!((await gt())[E.OVERLAY_ENABLED]??!0);await Zt({[E.OVERLAY_ENABLED]:e}),v=e,e?(ke(),R("toggle")):(A.unmount(),N(!1)),d("Overlay toggled",{enabled:e})},Ve=t=>{t.ctrlKey===nt.ctrlKey&&t.shiftKey===nt.shiftKey&&t.key.toLowerCase()===nt.key&&(t.preventDefault(),qe().catch(e=>d("Toggle failed",e)))},Ue=()=>{chrome.runtime.onMessage.addListener(t=>{if((t==null?void 0:t.type)==="LB_INDEX_UPDATED"){d("LB_INDEX_UPDATED"),R("lb-index-updated");return}(t==null?void 0:t.type)==="LB_INDEX_UPDATED_ACK"&&(d("LB_INDEX_UPDATED_ACK",t.payload),R("lb-index-updated"))})},je=()=>{const t=Pt();t.__nxlDebug={getLbIndex:async()=>chrome.storage.local.get(E.LETTERBOXD_INDEX),lastOverlayData:()=>It,forceResolve:()=>st("force")}},Ke=async()=>{if(!b())return;const t=Pt();if(t.__nxlBooted)return;t.__nxlBooted=!0;let e;try{e=await gt()}catch(n){if(B(n))return;throw n}b()&&(v=e[E.OVERLAY_ENABLED]??!0,at(),v&&!C&&(N(!0),d("BADGE_SHOWN"),d("BROWSE_MODE_DETECTED")),ze(),Ue(),je(),window.addEventListener("keydown",Ve))},Yt="nxl-xray-panel";function $e(){const t=document.createElement("div");t.id=Yt,t.style.cssText=`
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
  `;const o=document.createElement("div");return o.className="panel",o.innerHTML='<div class="panel-title">In this scene</div><div class="actor-list" data-list></div>',e.appendChild(n),e.appendChild(o),t}let w=null,ct=null,lt=null;function kt(){try{if(window.top&&window.top!==window&&window.top.document)return window.top.document}catch{}return document}function Ge(t){const e=t.fullscreenElement;return e||t.documentElement}function Je(){const t=kt(),e=Ge(t);return(!w||!w.isConnected||ct!==t||lt!==e)&&(w!=null&&w.isConnected&&w.remove(),w=$e(),e.appendChild(w),ct=t,lt=e),w}function dt(){var e;return((e=Je().shadowRoot)==null?void 0:e.querySelector("[data-list]"))??null}function Xt(t){const e=dt();if(e){if(e.innerHTML="",e.classList.remove("state-loading"),t.length===0){e.innerHTML='<div class="state-message">No faces visible in this frame</div>';return}for(const n of t){const o=document.createElement("div");o.className="actor-card";const i=document.createElement("img");i.className="actor-photo",i.alt=n.name,n.photoUrl?(i.src=n.photoUrl,i.onerror=()=>{i.style.display="none"}):i.style.display="none";const r=document.createElement("div");r.className="actor-info";const a=document.createElement("div");if(a.className="actor-name",a.textContent=n.name,r.appendChild(a),n.character){const s=document.createElement("div");s.className="actor-character",s.textContent=n.character,r.appendChild(s)}if(n.confidence>0&&n.confidence<1){const s=document.createElement("div");s.className="actor-confidence",s.textContent=`${Math.round(n.confidence*100)}% match`,r.appendChild(s)}o.appendChild(i),o.appendChild(r),e.appendChild(o)}}}function Ze(){const t=dt();t&&(t.innerHTML='<div class="state-message state-loading">Identifying actors…</div>')}function S(t){const e=dt();e&&(e.innerHTML=`<div class="state-message">${tn(t)}</div>`)}function Qe(){if(w!=null&&w.isConnected)w.remove();else{const e=kt().getElementById(Yt);e&&e.remove()}w=null,ct=null,lt=null}function tn(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}const en=800,Wt=120,Ft=["button[aria-label*='Play']","button[aria-label*='Pause']","[data-uia*='play-pause']","[class*='PlayPause']","[class*='play-pause']"].join(",");let L,ut,zt=0,ft=!0,qt,Vt="none";const Ut=new WeakSet;function nn(){return window}function jt(t){const e=t.match(/\/watch\/(\d+)/);return e==null?void 0:e[1]}function on(){var e,n;const t=jt(window.location.pathname);if(t)return t;try{return jt(((n=(e=window.top)==null?void 0:e.location)==null?void 0:n.pathname)??"")}catch{return}}function rn(){try{if(window.top&&window.top!==window&&window.top.document)return window.top.document}catch{}return document}function an(){var a,s;const t=rn(),{candidate:e}=Ae();if(e!=null&&e.titleText)return{titleText:e.titleText,year:e.year??void 0};const n=t.querySelector("[data-uia='video-title'], .title-title, [class*='title']"),o=(a=n==null?void 0:n.textContent)==null?void 0:a.trim(),i=t.querySelector("[class*='year'], [data-uia*='year']"),r=(s=i==null?void 0:i.textContent)==null?void 0:s.match(/(19\d{2}|20\d{2})/);return{titleText:o??void 0,year:r?Number(r[1]):void 0}}function sn(){if(!b()||!ft)return;const t=on();if(!t){d("X-Ray: no title ID on watch page"),S("Could not detect title");return}let e,n;try{const i=an();e=i.titleText,n=i.year}catch(i){d("X-Ray: title extraction failed",i)}const o={tabId:0,netflixTitleId:t,titleText:e,year:n,timestamp:Math.floor(Date.now()/1e3)};d("XRAY_ANALYZE_REQUEST",{netflixTitleId:t,titleText:e,year:n});try{chrome.runtime.sendMessage({type:"ANALYZE_FRAME",requestId:`xray_${Date.now()}`,payload:o},i=>{if(!b())return;if(chrome.runtime.lastError){S(chrome.runtime.lastError.message||"Extension error");return}if((i==null?void 0:i.type)!=="XRAY_FRAME_RESULT"){S("No response");return}const{actors:r,noFaces:a,drmBlocked:s,permissionRequired:c,error:l}=i.payload;if(d("XRAY_ANALYZE_RESPONSE",{actors:(r==null?void 0:r.length)??0,noFaces:a,drmBlocked:s,permissionRequired:c,error:l}),l){S(c?"Click the extension icon on this tab, then pause again":s?"Capture not available (DRM)":l);return}Xt(a?[]:r)})}catch(i){if(B(i))return;S((i==null?void 0:i.message)??"Extension error")}}function M(){const t=Array.from(document.querySelectorAll("video"));for(const e of t){const n=e.getBoundingClientRect();if(n.width>=window.innerWidth*.5&&n.height>=window.innerHeight*.5)return e}return t[0]??null}function V(){const t=Date.now();t-zt<pt||(zt=t,d("XRAY_PAUSE_DETECTED"),L&&window.clearTimeout(L),L=window.setTimeout(()=>{L=void 0,Ze(),sn()},pt))}function U(){d("XRAY_PLAY_DETECTED"),L&&(window.clearTimeout(L),L=void 0),Qe()}function ht(t){Ut.has(t)||(d("XRAY_VIDEO_OBSERVED",{width:Math.round(t.getBoundingClientRect().width),height:Math.round(t.getBoundingClientRect().height)}),t.addEventListener("pause",V),t.addEventListener("play",U),Ut.add(t))}function P(t){if(!t)return;const e=!!(t.paused||t.ended);qt!==e&&(qt=e,e?V():U())}function H(){var t,e,n;if(window.location.pathname.includes("/watch/"))return!0;try{return!!((n=(e=(t=window.top)==null?void 0:t.location)==null?void 0:e.pathname)!=null&&n.includes("/watch/"))}catch{return!1}}function cn(){var e;const t=(e=navigator.mediaSession)==null?void 0:e.playbackState;return t==="playing"||t==="paused"?t:"none"}function ln(t){const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return!1;const n=window.getComputedStyle(t);return!(n.display==="none"||n.visibility==="hidden"||n.opacity==="0")}function dn(){const t=Array.from(document.querySelectorAll(Ft)).filter(n=>ln(n));if(!t.length)return;const e=t.map(n=>(n.getAttribute("aria-label")??"").toLowerCase()).filter(Boolean);if(e.some(n=>/\bpause\b/.test(n)))return!1;if(e.some(n=>/\bplay\b/.test(n)))return!0}function Y(){const t=dn();t!==void 0&&(t?(d("XRAY_CONTROLS_PAUSED"),V()):(d("XRAY_CONTROLS_PLAYING"),U()))}function k(){const t=cn();if(t!==Vt){if(Vt=t,t==="paused"){d("XRAY_MEDIA_SESSION_PAUSED"),V();return}t==="playing"&&(d("XRAY_MEDIA_SESSION_PLAYING"),U())}}function un(){ut&&window.clearInterval(ut),ut=window.setInterval(()=>{if(!ft||!H())return;const t=M();if(t){ht(t),P(t);return}k(),Y()},en)}function fn(){document.addEventListener("click",t=>{if(!H())return;const e=t.target;e&&e.closest(Ft)&&window.setTimeout(()=>{const n=M();if(n){P(n);return}k(),Y()},Wt)},!0),document.addEventListener("keydown",t=>{if(!H())return;const e=t.key.toLowerCase();e!==" "&&e!=="k"||window.setTimeout(()=>{const n=M();if(n){P(n);return}k(),Y()},Wt)},!0)}async function hn(){try{const t=nn();if(t.__nxlXrayBooted||(t.__nxlXrayBooted=!0,!b()))return;const e=await chrome.storage.local.get([E.XRAY_ENABLED]);if(!b())return;ft=!0,e[E.XRAY_ENABLED]===!1&&chrome.storage.local.remove([E.XRAY_ENABLED]);const n=H();if(d("XRAY_INIT_FRAME",{href:window.location.href,topHref:(()=>{var r,a;try{return(a=(r=window.top)==null?void 0:r.location)==null?void 0:a.href}catch{return"cross-origin"}})(),watchPage:n}),!n)return;d("XRAY_INIT",{href:window.location.href,topHref:(()=>{var r,a;try{return(a=(r=window.top)==null?void 0:r.location)==null?void 0:a.href}catch{return"cross-origin"}})()});const o=M();if(o?(ht(o),P(o)):(k(),Y()),!document.body)return;new MutationObserver(()=>{if(!H())return;const r=M();if(r){ht(r),P(r);return}k(),Y()}).observe(document.body,{childList:!0,subtree:!0}),fn(),un()}catch(t){throw d("initXrayWatch error",t),t}}const Kt=async()=>{try{await Ke()}catch(t){d("initNetflixObserver failed",t)}try{await hn()}catch(t){d("initXrayWatch failed",t)}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Kt().catch(t=>d("Init failed",t))},{once:!0}):Kt().catch(t=>d("Init failed",t))})();
//# sourceMappingURL=index.js.map
