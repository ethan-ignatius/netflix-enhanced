(function(){"use strict";const y={OVERLAY_ENABLED:"overlayEnabled",TMDB_API_KEY:"tmdbApiKey",TMDB_CACHE:"tmdbCache",TMDB_FEATURE_CACHE:"tmdbFeatureCache",MATCH_PROFILE:"matchProfile",LETTERBOXD_INDEX:"lb_index_v1",LETTERBOXD_STATS:"lb_stats_v1",LAST_IMPORT_AT:"lastImportAt",XRAY_ENABLED:"xrayEnabled",AWS_ACCESS_KEY_ID:"awsAccessKeyId",AWS_SECRET_ACCESS_KEY:"awsSecretAccessKey",AWS_REGION:"awsRegion"},p=(...t)=>{console.log("[Netflix+Letterboxd]",...t)},yt=t=>t?t.toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9']+/g," ").replace(/\s+/g," ").trim():"",Ft=(t,e)=>{const n=yt(t),o=e?String(e):"";return`${n}-${o}`},$t=(t,e)=>Ft(t,e),Et=async()=>(p("Loading storage state"),chrome.storage.local.get([y.OVERLAY_ENABLED,y.TMDB_API_KEY,y.TMDB_CACHE,y.TMDB_FEATURE_CACHE,y.MATCH_PROFILE,y.LETTERBOXD_INDEX,y.LETTERBOXD_STATS,y.LAST_IMPORT_AT,y.AWS_ACCESS_KEY_ID,y.AWS_SECRET_ACCESS_KEY,y.AWS_REGION])),Kt=async t=>{p("Saving storage state",t),await chrome.storage.local.set(t)},bt="a[href^='/title/']",X=["[role='dialog']","[aria-modal='true']","[aria-expanded='true']","[data-uia*='jawbone']","[class*='jawbone']","[data-uia*='preview']","[data-uia*='billboard']","[data-uia*='hero']","[data-uia*='details']"],xt=["h1","h2","h3","[data-uia*='title']","[class*='title']","[class*='fallback']","[class*='preview'] [class*='header']"],Tt=["video","img","[data-uia*='preview'] video","[data-uia*='preview'] img","[class*='preview'] video","[class*='preview'] img","[data-uia*='player'] video","[data-uia*='hero'] img"],wt=["[data-uia*='controls']","[class*='controls']","[class*='control']","[role='toolbar']"],q=/(S\d+\s*:?\s*E\d+|Season\s*\d+\s*Episode\s*\d+|Episode\s*\d+|\bE\d+\b)/i,j=/(\b\d+\s*(m|min|minutes)\b|\b\d+\s*of\s*\d+\s*(m|min|minutes)\b)/i,Xt=/\b(tv-[a-z0-9]+|pg-?13|pg|tv-ma|tv-y|tv-g|nr|nc-17|hd|uhd|4k|seasons?|season|episode|volume|part\s+\d+)\b/i,jt=/^(play|resume|continue|more info|details|watch|watch now|watch again|add|added|my list|remove|rate|like|dislike|thumbs up|thumbs down)$/i,Gt=/because you watched/i,vt=["[data-uia*='maturity-rating']","[data-uia*='season']","[data-uia*='resolution']","[data-uia*='hd']","[class*='maturity']","[class*='season']","[class*='quality']"],At=["[data-uia*='genre']","a[href*='/genre/']","[class*='genre']"],Ct=[...vt,...At,"[data-uia*='metadata']","[class*='metadata']","[class*='meta']","[class*='maturity']","[class*='season']","[class*='genre']","[class*='tag']","[class*='info']"],Ut=["header","nav","[data-uia*='header']","[data-uia*='row-title']","[class*='rowHeader']","[class*='row-title']"],z=["h1","h2","h3","h4","[data-uia*='title']","[class*='title']","[class*='headline']","[class*='header']","[class*='name']"],Jt=/(browse|home|my list|popular|your next watch|explore all|movies & shows|movies and shows|new & popular)/i,E=t=>{const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return!1;const n=window.getComputedStyle(t);return n.visibility==="hidden"||n.display==="none"||n.opacity==="0"?!1:e.bottom>=0&&e.right>=0&&e.top<=window.innerHeight&&e.left<=window.innerWidth},x=t=>{if(!t)return;const e=t.replace(/\s+/g," ").trim();return e.length?e:void 0},_t=t=>{if(!t)return;const e=t.match(/\/title\/(\d+)/);return e==null?void 0:e[1]},Y=t=>{if(!t)return;const e=t.match(/(19\d{2}|20\d{2})/);if(!e)return;const n=Number(e[1]);if(!Number.isNaN(n))return n},T=t=>{if(!t)return;let e=t;return e=e.replace(/^\s*S\d+\s*:?\s*E\d+\s*/i,""),e=e.replace(/"[^"]*"/g,n=>{const o=n.replace(/"/g,"");return q.test(o)?"":n}),e=e.replace(/Episode\s*\d+/gi,""),e=e.replace(/\bE\d+\b/gi,""),e=e.replace(j,""),e=e.replace(/\s+of\s+\d+\s*(m|min|minutes)?/gi,""),e=e.replace(/\s+/g," ").trim(),e.length?e:void 0},St=(t,e)=>{const n=t.getAttribute("href")||void 0,o=_t(n),i=x(t.getAttribute("aria-label")||t.textContent);return{netflixTitleId:o,titleText:i,href:n,source:e}},G=t=>{for(const e of xt){const n=t.querySelector(e);if(n&&E(n)){const o=x(n.textContent);if(o)return o}}},Qt=t=>{if(t)return G(t)},Zt=t=>{if(t)for(const e of xt){const n=Array.from(t.querySelectorAll(e));for(const o of n){if(!E(o))continue;const i=x(o.textContent);if(!i||q.test(i)||j.test(i))continue;const r=T(i);if(r)return r}}},V=t=>{if(!t)return null;const e=[];return Tt.forEach(n=>{t.querySelectorAll(n).forEach(o=>{E(o)&&e.push(o)})}),e.length?e.reduce((n,o)=>{const i=n.getBoundingClientRect(),r=o.getBoundingClientRect(),s=i.width*i.height;return r.width*r.height>s?o:n}):null},D=t=>{var i;if(!t)return null;const e=[];wt.forEach(r=>{t.querySelectorAll(r).forEach(s=>{E(s)&&e.push(s)})});const o=Array.from(new Set(e)).map(r=>{const s=r.querySelectorAll("button, [role='button']").length,a=r.getBoundingClientRect(),c=s*10+a.width;return{el:r,score:c,top:a.top}}).filter(r=>r.score>0);return o.sort((r,s)=>s.score-r.score||s.top-r.top),((i=o[0])==null?void 0:i.el)??null},te=t=>{if(!t)return!1;const e=[...vt,...At].join(",");return Array.from(t.querySelectorAll(e)).some(o=>E(o))},ee=t=>!!t.closest(Ct.join(",")),U=t=>!!t.closest(Ut.join(",")),A=t=>Jt.test(t)||jt.test(t.trim())||Gt.test(t)||Xt.test(t)?!0:q.test(t)||j.test(t)||/\b\d+\s*of\s*\d+\s*(m|min|minutes)?\b/i.test(t)||/\b\d+\s*(m|min|minutes)\b/i.test(t),J=(t,e)=>t.closest('[role="progressbar"], [data-uia*="progress"], [class*="progress"]')?!0:e!==void 0?t.getBoundingClientRect().bottom>=e-8:!1,F=(t,e)=>t?e&&(e.contains(t)||t.closest("button, [role='button']"))?!0:!!t.closest("button, [role='button'], [data-uia*='play'], [data-uia*='button']"):!1,ne=t=>{const e=t.getBoundingClientRect(),n=D(t),o=n?n.getBoundingClientRect().top:void 0,i=Array.from(t.querySelectorAll(z.join(",")));let r,s=0;const a=[];if(i.forEach(l=>{if(!E(l)){s+=1;return}if(U(l)){s+=1;return}if(F(l,n)){s+=1;return}if(J(l,o)){s+=1;return}const d=x(l.textContent);if(!d||d.length<2||d.length>80){s+=1;return}if(A(d)){a.push(l),s+=1;return}const h=l.getBoundingClientRect(),u=window.getComputedStyle(l),m=parseFloat(u.fontSize)||14,g=u.fontWeight==="bold"?700:Number(u.fontWeight),f=Number.isNaN(g)?400:g,w=h.left-e.left,mt=h.top-e.top,gt=Math.hypot(w,mt),bn=ee(l)?120:0,Vt=m*10+f/10+Math.max(0,300-gt)-bn;(!r||Vt>r.score)&&(r={el:l,score:Vt,text:d})}),r)return{title:T(r.text)??r.text,chosen:r.el,rejectedCount:s};for(const l of a){let d=l.parentElement,h=0;for(;d&&h<4;){const u=Array.from(d.querySelectorAll(z.join(","))).filter(m=>m!==l);for(const m of u){if(!E(m)||F(m,n)||J(m,o))continue;const g=x(m.textContent);if(!(!g||g.length<2||g.length>80)&&!A(g))return{title:T(g)??g,chosen:m,rejectedCount:s}}d=d.parentElement,h+=1}}const c=t.querySelector("a[href^='/title/']");if(c){const l=c.querySelector(z.join(",")),d=x((l==null?void 0:l.textContent)||c.textContent);if(d&&!A(d))return{title:T(d)??d,chosen:l??c,rejectedCount:s};let h=c.parentElement,u=0;for(;h&&u<4;){const m=Array.from(h.querySelectorAll(z.join(",")));for(const g of m){if(!E(g)||F(g,n)||J(g,o))continue;const f=x(g.textContent);if(!(!f||f.length<2||f.length>80)&&!A(f))return{title:T(f)??f,chosen:g,rejectedCount:s}}h=h.parentElement,u+=1}}return{title:null,rejectedCount:s}},oe=t=>{const n=Array.from(t.querySelectorAll(Ct.join(","))).map(c=>x(c.textContent)).filter(Boolean);if(!n.length){const c=D(t),l=c==null?void 0:c.nextElementSibling,d=x(l==null?void 0:l.textContent);d&&n.push(d)}const o=n.join(" "),i=Y(o),r=/\bseasons?\b/i.test(o),s=/\b\d+\s*(m|min|minutes)\b/i.test(o)||/\b\d+\s*h\b/i.test(o);let a;return r?a=!0:s&&(a=!1),{year:i,isSeries:a}},Q=t=>{var n,o;const e=[t.getAttribute("aria-label"),t.getAttribute("title"),(n=t.querySelector("img[alt]"))==null?void 0:n.alt,(o=t.querySelector("[aria-label]"))==null?void 0:o.getAttribute("aria-label"),t.textContent];for(const i of e){const r=x(i);if(r&&!A(r))return r}},ie=t=>{var o,i,r,s,a;const e=t,n=[((o=e.getAttribute)==null?void 0:o.call(e,"aria-label"))??void 0,((i=e.getAttribute)==null?void 0:i.call(e,"data-uia-title"))??void 0,((r=e.getAttribute)==null?void 0:r.call(e,"title"))??void 0,(a=(s=e.querySelector)==null?void 0:s.call(e,"img[alt]"))==null?void 0:a.alt,e.textContent];for(const c of n){const l=x(c);if(l&&!A(l)&&!U(e))return l}},re=(t,e,n)=>{const i=Array.from(t.querySelectorAll("a[href^='/title/']")).filter(a=>E(a));if(!i.length)return null;const r=e==null?void 0:e.getBoundingClientRect();let s=null;for(const a of i){if(U(a)||F(a,n)||!Q(a))continue;const l=a.getBoundingClientRect(),d=l.width*l.height;let h=0;if(r){const u=r.top-220,m=r.bottom+220;if(l.bottom<u||l.top>m)continue}if(e&&(a.contains(e)||e.contains(a))&&(h+=1e3),r){const u=l.left+l.width/2-(r.left+r.width/2),m=l.top+l.height/2-(r.top+r.height/2),g=Math.hypot(u,m);h+=Math.max(0,500-g)}h+=Math.min(d/100,200),h+=50,(!s||h>s.score)&&(s={anchor:a,score:h})}return(s==null?void 0:s.anchor)??null},se=t=>{if(t){const e=ae(t);if(e)return e}return le()},Z=(t,e,n)=>{const o=yt(t);if(!o)return null;const i=(e==null?void 0:e.getAttribute("href"))??null,r=_t(i)??null,{year:s,isSeries:a}=oe(n);return{rawTitle:t,normalizedTitle:o,year:s??null,isSeries:a,netflixId:r,href:i}},ae=t=>{const e=fe(t);let n,o=null;if(e){const s=Q(e);s&&(n=T(s)??s,o=e)}if(!n){let s=t,a=0;for(;s&&s!==document.body&&a<8;){const c=ie(s);if(c){n=T(c)??c;break}s=s.parentElement,a+=1}}if(!n)return null;if(o){const s=he(o);if(s){const a=Z(n,o,s);return a?{jawboneEl:s,extracted:a,chosenTitleElement:o}:null}}let i=o??t,r=0;for(;i&&i!==document.body&&r<8;){if(i instanceof HTMLElement){const s=i.getBoundingClientRect();if(s.width>=200&&s.height>=120){const a=Z(n,o,i);if(a)return{jawboneEl:i,extracted:a,chosenTitleElement:o??void 0}}}i=i.parentElement,r+=1}return null},le=()=>{const t=ue(),e=pe().map(r=>({root:r,preview:V(r)})),n=t?[{root:t.root,preview:t.preview},...e.filter(r=>r.root!==t.root)]:e,o=window.innerWidth*.85,i=window.innerHeight*.6;for(const r of n){const s=r.root,a=s.getBoundingClientRect();if(a.width>o||a.height>i)continue;const c=r.preview??V(s),l=D(s),d=te(s);if(!c||!l)continue;const h=re(s,c,l);let u=null,m=null;if(h){const f=Q(h);f&&(u=T(f)??f,m=h)}if(u||(u=ne(s).title??null),!u&&!d)continue;if(!u&&d){const f=Qt(s);f&&!A(f)&&(u=T(f)??f)}if(!u)continue;const g=Z(u,m,s);if(g)return{jawboneEl:s,extracted:g,chosenTitleElement:m??void 0}}return{jawboneEl:null,extracted:null}},tt=(t,e)=>{const n=Zt(t);if(n)return n;const o=T(e);if(o&&!q.test(o))return o;if(e)return T(e)??e},ce=t=>{const e=Array.from(t.querySelectorAll(bt)),n=e.filter(E);return n.length>0?n[0]:e[0]},Rt=()=>{const t=X.join(","),e=Array.from(document.querySelectorAll(t)),n=e.filter(E),o=window.innerWidth*.85,i=window.innerHeight*.6,r=n.filter(s=>{const a=s.getBoundingClientRect();return!(a.width===0||a.height===0||a.width<240||a.height<180||a.width>o||a.height>i)});return r.length>0?r.sort((s,a)=>{const c=s.getBoundingClientRect(),l=a.getBoundingClientRect();return l.width*l.height-c.width*c.height}):n.length>0?n:e},de=()=>{const t=[];return Tt.forEach(e=>{document.querySelectorAll(e).forEach(n=>{if(!E(n))return;const o=n.getBoundingClientRect();o.width<200||o.height<120||t.push(n)})}),t},ue=()=>{const t=de();if(!t.length)return null;const e=window.innerWidth*.85,n=window.innerHeight*.6,o=t.sort((i,r)=>{const s=i.getBoundingClientRect(),a=r.getBoundingClientRect();return a.width*a.height-s.width*s.height});for(const i of o){let r=i,s=0;for(;r&&s<8;){if(r instanceof HTMLElement){const a=r.getBoundingClientRect();if(a.width>=240&&a.height>=180&&a.width<=e&&a.height<=n&&D(r))return{root:r,preview:i}}r=r.parentElement,s+=1}}return null},fe=t=>{var o,i,r;let e=t;for(;e&&e!==document.body;){if(e instanceof HTMLAnchorElement&&((o=e.getAttribute("href"))!=null&&o.startsWith("/title/")))return e;const s=(i=e.querySelector)==null?void 0:i.call(e,":scope > a[href^='/title/']");if(s&&E(s))return s;e=e.parentElement}const n=(r=t.querySelector)==null?void 0:r.call(t,"a[href^='/title/']");return n&&E(n)?n:null},he=t=>{let e=t,n=0;const o=window.innerWidth*.85,i=window.innerHeight*.6;for(;e&&e!==document.body&&n<12;){if(e instanceof HTMLElement){const r=e.getBoundingClientRect();if(r.width>=240&&r.height>=180&&r.width<=o&&r.height<=i){const s=V(e),a=D(e);if(s&&a)return e}}e=e.parentElement,n+=1}return null},pe=()=>{const t=Rt();if(t.length)return t;const e=Array.from(document.querySelectorAll(wt.join(","))),n=window.innerWidth*.85,o=window.innerHeight*.6,i=new Set;return e.forEach(r=>{let s=r,a=0;for(;s&&a<6;){if(s instanceof HTMLElement){const c=s.getBoundingClientRect();if(c.width>=240&&c.height>=180&&c.width<=n&&c.height<=o&&V(s)){i.add(s);break}}s=s.parentElement,a+=1}}),Array.from(i)},me=()=>{const t=Rt();for(const n of t){const o=ce(n);if(o){const r=St(o,"container-anchor");if(r.netflixTitleId||r.titleText){const s=r.titleText??G(n),a=tt(n,s??r.titleText);return{candidate:{...r,titleText:a,year:Y(a??s)},container:n}}}const i=G(n);if(i){const r=tt(n,i);return{candidate:{titleText:r??i,year:Y(r??i),source:"container-text"},container:n}}}const e=Array.from(document.querySelectorAll(bt)).find(E);if(e){const n=St(e,"page-anchor"),o=tt(e.closest(X.join(","))??e.parentElement,n.titleText);return{candidate:{...n,titleText:o??n.titleText,year:Y(o??n.titleText)},container:e.closest(X.join(","))??e.parentElement}}return{candidate:null,container:null}},ge="nxlb-top-section",ye=()=>{const t=document.createElement("div");t.id=ge,t.style.display="block",t.style.width="100%",t.style.pointerEvents="none";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
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
  `,i.appendChild(r);const s=document.createElement("div");s.className="nxl-body";const a=document.createElement("div");a.className="nxl-rating",a.dataset.field="communityRating",a.textContent="Community rating: —";const c=document.createElement("div");c.className="nxl-match",c.dataset.field="match",c.textContent="Your match: —";const l=document.createElement("div");l.className="nxl-because",l.dataset.field="because",l.textContent="Because you like: —";const d=document.createElement("div");return d.className="nxl-badges",d.dataset.field="badges",s.appendChild(a),s.appendChild(c),s.appendChild(l),s.appendChild(d),o.appendChild(i),o.appendChild(s),e.appendChild(n),e.appendChild(o),t},Ee=t=>t==null?"":t>=1e6?`${(t/1e6).toFixed(1)}M`:t>=1e3?`${(t/1e3).toFixed(1)}K`:`${t}`,be=t=>{const e=Math.max(0,Math.min(5,t)),n=Math.floor(e),o=e%1>=.5;return"★".repeat(n)+(o?"½":"")},Lt=(t,e)=>{var l,d,h,u,m,g;const n=((l=e.tmdb)==null?void 0:l.voteAverage)??null,o=((d=e.tmdb)==null?void 0:d.voteCount)??null,i=e.letterboxd,r=(h=t.shadowRoot)==null?void 0:h.querySelector("[data-field='communityRating']");if(r)if(n!=null){const f=Ee(o),w=n/2;r.innerHTML=`
        Community rating:
        <span class="nxl-star">★</span>
        ${w.toFixed(1)}${f?` <span class="nxl-meta">${f} ratings</span>`:""}
      `}else r.textContent="Community rating: —";const s=(u=t.shadowRoot)==null?void 0:u.querySelector("[data-field='match']");s&&((i==null?void 0:i.matchPercent)!==null&&(i==null?void 0:i.matchPercent)!==void 0?s.innerHTML=`Your match: <span class="nxl-match-value">${i.matchPercent}%</span>`:s.textContent="Your match: —");const a=(m=t.shadowRoot)==null?void 0:m.querySelector("[data-field='because']");if(a){const f=(i==null?void 0:i.becauseYouLike)??[];a.textContent=f.length>0?`Because you like: ${f.join(", ")}`:"Because you like: —"}const c=(g=t.shadowRoot)==null?void 0:g.querySelector("[data-field='badges']");if(c){if(c.innerHTML="",i!=null&&i.inWatchlist){const f=document.createElement("span");f.className="nxl-badge",f.textContent="On your watchlist",c.appendChild(f)}if((i==null?void 0:i.userRating)!==null&&(i==null?void 0:i.userRating)!==void 0){const f=document.createElement("span");f.className="nxl-badge",f.textContent=`You rated ${be(i.userRating)}`,c.appendChild(f)}if(!(i!=null&&i.inWatchlist)&&(i==null?void 0:i.userRating)===void 0){const f=document.createElement("span");f.className="nxl-badge",f.textContent="Letterboxd: —",c.appendChild(f)}}},xe=()=>{let t=null,e=null,n=null;const o=()=>{e||(e=ye())};return{mount:c=>{o(),e&&t!==c&&(e.remove(),c.insertBefore(e,c.firstChild),t=c,requestAnimationFrame(()=>{e==null||e.classList.add("nxl-visible")}))},update:c=>{n=c,e&&Lt(e,c)},unmount:()=>{e&&e.remove(),t=null},renderLast:()=>{e&&n&&Lt(e,n)},getLastData:()=>n,getCurrentRoot:()=>t,isMounted:()=>!!(e&&e.isConnected)}},Te="nxlb-reaction-timeline",M=104,we=6,ve=.62,Ae=.16,Ce={laugh:"😂",smile:"😊",shock:"😱",sad:"😢",angry:"😡",scared:"😨",bored:"😴",neutral:"🙂"},_e=["laugh","smile","shock"],Se=["angry","scared"],Re=["sad","bored"],et=[76,217,100],nt=[255,69,58],ot=[90,130,230],Le=t=>{if(t.count===0)return{green:0,red:0,blue:0};const e=_e.reduce((r,s)=>r+t.reactions[s],0),n=Se.reduce((r,s)=>r+t.reactions[s],0),o=Re.reduce((r,s)=>r+t.reactions[s],0),i=e+n+o;return i===0?{green:.33,red:.33,blue:.33}:{green:e/i,red:n/i,blue:o/i}},Oe=(t,e)=>{const n=Math.round(t.green*et[0]+t.red*nt[0]+t.blue*ot[0]),o=Math.round(t.green*et[1]+t.red*nt[1]+t.blue*ot[1]),i=Math.round(t.green*et[2]+t.red*nt[2]+t.blue*ot[2]);return e<=0?`rgba(${n}, ${o}, ${i}, 0)`:`rgba(${n}, ${o}, ${i}, ${Math.max(.35,Math.min(.95,e*1.1))})`},Ne=(t,e,n,o,i=6)=>({cp1:[e[0]+(n[0]-t[0])/i,e[1]+(n[1]-t[1])/i],cp2:[n[0]-(o[0]-e[0])/i,n[1]-(o[1]-e[1])/i]}),Ie=(t,e,n)=>{const o=e/t.length,i=Math.max(1,M-we);return t.map((r,s)=>{const a=(s+.5)*o,c=n>0?r.intensity/n:0,l=c>0?Math.pow(c,ve):0,d=r.count>0?Math.max(Ae,l):0,h=d*i,u=Le(r),m=Oe(u,d);return{x:a,y:h,color:m,bucket:r}})},De=(t,e,n)=>{const o=t.createLinearGradient(0,0,n,0);for(const i of e){const r=Math.max(0,Math.min(1,i.x/n));o.addColorStop(r,i.color)}return o},Ot=(t,e,n)=>{const o=i=>n-i;t.moveTo(e[0].x,o(e[0].y));for(let i=0;i<e.length-1;i++){const r=e[Math.max(0,i-1)],s=e[i],a=e[i+1],c=e[Math.min(e.length-1,i+2)],{cp1:l,cp2:d}=Ne([r.x,o(r.y)],[s.x,o(s.y)],[a.x,o(a.y)],[c.x,o(c.y)]);t.bezierCurveTo(l[0],l[1],d[0],d[1],a.x,o(a.y))}},$=(t,e,n,o)=>{t.clearRect(0,0,n,o),e.length!==0&&(t.beginPath(),t.moveTo(0,o),t.lineTo(e[0].x,o),Ot(t,e,o),t.lineTo(e[e.length-1].x,o),t.lineTo(0,o),t.closePath(),t.fillStyle=De(t,e,n),t.fill(),t.beginPath(),Ot(t,e,o),t.strokeStyle="rgba(255, 255, 255, 0.42)",t.lineWidth=1.2,t.stroke())},Me=t=>{if(t.count===0)return"";const e=Object.entries(t.reactions).filter(([,n])=>n>0).sort((n,o)=>o[1]-n[1]);return e.length===0?"":e.map(([n,o])=>`${Ce[n]} ${o}`).join("  ")};let B=null;const Be=(t,e)=>{if(t.dataset.hoverBound==="1")return;t.dataset.hoverBound="1";let n=-1;t.addEventListener("mousemove",o=>{if(!B)return;const{points:i,ctx:r,logicalW:s,logicalH:a}=B;if(i.length===0)return;const c=t.getBoundingClientRect(),l=o.clientX-c.left,d=s/i.length,h=Math.min(i.length-1,Math.max(0,Math.floor(l/d)));if(h===n)return;n=h;const u=i[h],m=Me(u.bucket);if(!m){e.style.display="none",$(r,i,s,a);return}e.textContent=m,e.style.display="block",e.style.left=`${u.x}px`,$(r,i,s,a),r.beginPath(),r.moveTo(u.x,0),r.lineTo(u.x,a),r.strokeStyle="rgba(255, 255, 255, 0.25)",r.lineWidth=1,r.stroke()}),t.addEventListener("mouseleave",()=>{if(!B)return;const{points:o,ctx:i,logicalW:r,logicalH:s}=B;e.style.display="none",n=-1,$(i,o,r,s)})},He=()=>{const t=["[data-uia='timeline']","[class*='scrubber']","[role='slider'][aria-label]","[class*='Slider']","[class*='progress-bar']","[class*='PlayerTimeline']"];for(const e of t){const n=document.querySelector(e);if(n&&n.getBoundingClientRect().width>100)return n}return null},Pe=()=>!!document.querySelector("[data-uia*='ad-break'], [data-uia*='interstitial'], [class*='AdBreak'], [class*='interstitial']"),ke=()=>{const t=document.createElement("div");t.id=Te,t.style.position="fixed",t.style.zIndex="2147483645",t.style.pointerEvents="auto",t.style.height=`${M}px`;const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
    :host {
      all: initial;
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    }
    .graph-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .graph-canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
    .tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 0;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.92);
      color: #f5f5f5;
      font-family: "Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      display: none;
    }
  `;const o=document.createElement("div");o.className="graph-container",o.dataset.field="graph";const i=document.createElement("canvas");i.className="graph-canvas";const r=document.createElement("div");return r.className="tooltip",o.appendChild(i),o.appendChild(r),e.appendChild(n),e.appendChild(o),t};let b=null;const it=()=>{b&&(b.style.display="none")},We=async()=>{var w;if(!window.location.pathname.includes("/watch/")||Pe())return null;const t=He();if(!t)return p("EMOTION_TIMELINE_NO_SCRUBBER"),null;const e=t.getBoundingClientRect();(!b||!b.isConnected)&&(b=ke(),document.body.appendChild(b)),b.style.left=`${e.left}px`,b.style.width=`${e.width}px`,b.style.top=`${e.top-M}px`,b.style.height=`${M}px`,b.style.display="block";const n=document.querySelector("video"),o=window.location.pathname.match(/\/watch\/(\d+)/),i=(o==null?void 0:o[1])??null;if(!n||!i)return null;const r=n.duration||0;if(!r||!Number.isFinite(r))return null;const s=await Je(i,r);if(!s)return null;const a=(w=b.shadowRoot)==null?void 0:w.querySelector("[data-field='graph']");if(!a)return s;const c=a.querySelector(".graph-canvas"),l=a.querySelector(".tooltip");if(!c||!l)return s;const d=e.width,h=M,u=window.devicePixelRatio||1;c.width=d*u,c.height=h*u,c.style.width=`${d}px`,c.style.height=`${h}px`;const m=c.getContext("2d");if(!m)return s;m.setTransform(u,0,0,u,0,0);const g=s.buckets.reduce((mt,gt)=>Math.max(mt,gt.intensity),0),f=Ie(s.buckets,d,g);return $(m,f,d,h),B={points:f,ctx:m,logicalW:d,logicalH:h},Be(c,l),s},qe={KeyL:"laugh",KeyS:"sad",KeyA:"angry",KeyB:"bored",KeyH:"shock",KeyN:"neutral",KeyJ:"smile"},Nt={laugh:"😂",smile:"😊",shock:"😱",sad:"😢",angry:"😡",scared:"😨",bored:"😴",neutral:"🙂"},C=()=>{const t=document.querySelectorAll("video");for(let e=0;e<t.length;e+=1){const n=t[e],o=n.getBoundingClientRect();if(o.width>=window.innerWidth*.5&&o.height>=window.innerHeight*.5)return n}return t[0]??null},ze=()=>`rx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`,rt=()=>document.querySelector(".watch-video--player-view, [data-uia*='video-player'], [class*='VideoPlayer']")??document.body,Ye=t=>{const e=rt();if(!e)return;const n=Nt[t];if(!n)return;const o=document.createElement("div");o.textContent=n,o.style.position="absolute",o.style.zIndex="2147483647",o.style.pointerEvents="none",o.style.fontSize="26px",o.style.filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))";const i=e.getBoundingClientRect(),r=.3+Math.random()*.4,s=.6+Math.random()*.15;o.style.left=`${i.width*r}px`,o.style.top=`${i.height*s}px`,o.style.transform="translate(-50%, 0)",o.style.opacity="1",o.style.transition="transform 700ms ease-out, opacity 700ms ease-out",e.appendChild(o),requestAnimationFrame(()=>{o.style.transform="translate(-50%, -60px)",o.style.opacity="0"}),window.setTimeout(()=>{o.remove()},800)};let H=null,L=null,O=null,It=0,Dt=null;const Ve=1700,Fe=260,$e=120,K=()=>{if(H&&H.isConnected)return;const t=rt();if(!t)return;const e=document.createElement("div");e.style.position="absolute",e.style.right="20px",e.style.top="50%",e.style.bottom="auto",e.style.transform="translateY(-50%)",e.style.zIndex="2147483646",e.style.pointerEvents="none";const n=document.createElement("div");n.style.pointerEvents="none",n.style.background="transparent",n.style.border="none",n.style.padding="0",n.style.fontFamily='"Netflix Sans", "Netflix Sans Icon", "Helvetica Neue", Helvetica, Arial, sans-serif',n.style.fontSize="11px",n.style.color="rgba(255,255,255,0.9)",n.style.textShadow="0 2px 8px rgba(0,0,0,0.8)",n.style.maxWidth="300px",n.style.display="flex",n.style.flexDirection="column",n.style.alignItems="center";const o=document.createElement("div");o.textContent="Press while watching!",o.style.fontWeight="700",o.style.fontSize="16px",o.style.marginBottom="10px",o.style.letterSpacing="0.25px",o.style.textAlign="center";const i=document.createElement("div");i.style.display="flex",i.style.flexDirection="column",i.style.alignItems="center",i.style.gap="10px",[["L","laugh"],["J","smile"],["H","shock"],["S","sad"],["A","angry"],["B","bored"],["N","neutral"]].forEach(([s,a])=>{const c=Nt[a],l=document.createElement("div");l.style.display="flex",l.style.alignItems="center",l.style.justifyContent="center",l.style.gap="8px",l.style.whiteSpace="nowrap";const d=document.createElement("span");d.textContent=c,d.style.fontSize="18px",d.style.lineHeight="1";const h=document.createElement("span");h.textContent=`Press ${s}`,h.style.fontWeight="700",h.style.fontSize="13px",h.style.letterSpacing="0.25px";const u=document.createElement("span");u.textContent=a,u.style.textTransform="capitalize",u.style.fontSize="13px",u.style.opacity="0.92",l.appendChild(d),l.appendChild(h),l.appendChild(u),i.appendChild(l)}),n.appendChild(o),n.appendChild(i),e.appendChild(n),e.style.display="none",t.appendChild(e),H=e},P=t=>{H&&(H.style.display=t?"block":"none")},k=()=>window.location.pathname.includes("/watch/"),st=()=>{L!==null&&(window.clearTimeout(L),L=null),O!==null&&(window.clearTimeout(O),O=null)},at=(t=!1)=>{const e=Date.now();!t&&e-It<Fe||(It=e,We())},Mt=()=>{if(!k())return;const t=C();!t||t.paused||t.ended||(K(),P(!0),at(),O!==null&&window.clearTimeout(O),O=window.setTimeout(()=>{const e=C();!e||e.paused||e.ended||!k()||at(!0)},$e),L!==null&&window.clearTimeout(L),L=window.setTimeout(()=>{const e=C();!e||e.paused||e.ended||(P(!1),it())},Ve))},Ke=()=>{const t=C();!t||t.paused||t.ended||(st(),P(!1),it())},lt=()=>{const t=rt();!t||t===Dt||(Dt=t,t.addEventListener("mousemove",Mt,{passive:!0}),t.addEventListener("mouseenter",Mt,{passive:!0}),t.addEventListener("mouseleave",Ke))},Xe=()=>{const t=window.location.pathname.match(/\/watch\/(\d+)/);if(t!=null&&t[1])return t[1];const{candidate:e}=me();return(e==null?void 0:e.netflixTitleId)??null},je=()=>null,Ge=t=>{chrome.runtime.sendMessage({type:"STORE_REACTION_EVENT",payload:t}).catch(()=>{})},Ue=()=>{const t=n=>{n.dataset.nxlReactionsObserved!=="1"&&(n.dataset.nxlReactionsObserved="1",k()&&(K(),lt(),n.addEventListener("pause",()=>{st(),P(!0),at(!0)}),n.addEventListener("play",()=>{st(),P(!1),it()})))};if(k()){K(),lt();const n=C();n&&t(n)}new MutationObserver(()=>{if(!k())return;K(),lt();const n=C();n&&t(n)}).observe(document.body,{childList:!0,subtree:!0}),window.addEventListener("keydown",n=>{if(n.repeat)return;const o=qe[n.code];if(!o)return;n.stopPropagation(),n.preventDefault();const i=C();if(!i)return;const r=Xe();if(!r)return;const s=i.currentTime,a={id:ze(),netflixId:r,profileId:je(),season:null,episode:null,timestampSec:s,createdAt:Date.now(),type:o};Ge(a),Ye(o)},!0)},Je=async(t,e)=>{try{return await chrome.runtime.sendMessage({type:"GET_REACTION_TIMELINE",payload:{netflixId:t,durationSec:e}})??null}catch{return null}},Bt="nxlb-status-badge",Qe=()=>{const t=document.createElement("div");t.id=Bt,t.style.position="fixed",t.style.bottom="16px",t.style.right="16px",t.style.zIndex="2147483647",t.style.pointerEvents="none";const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
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
  `,e.appendChild(n),e.appendChild(o),t},N=t=>{const e=document.getElementById(Bt);if(!t){e&&(e.remove(),p("OVERLAY_BADGE_REMOVED"));return}if(e)return;const n=Qe();document.documentElement.appendChild(n),p("OVERLAY_BADGE_MOUNTED")},ct={ctrlKey:!0,shiftKey:!0,key:"l"},Ze=250,tn=2e3,en=.85,nn=.6,v=xe();let _=!0,Ht="",Pt=null,dt,ut,kt="",I=null,S=!1,Wt=null,W=null;const qt=()=>window,on=t=>{if(!t)return!1;const e=t.getBoundingClientRect();return e.width===0||e.height===0?!1:e.width>window.innerWidth*en||e.height>window.innerHeight*nn},ft=t=>{I&&I!==t&&(I.style.outline="",I.style.outlineOffset="",I=null),t&&(t.style.outline="1px solid rgba(255, 80, 80, 0.85)",t.style.outlineOffset="-1px",I=t)},rn=()=>window.location.pathname.includes("/watch/"),zt=()=>Array.from(document.querySelectorAll("video")).some(e=>{if(e.paused||e.ended)return!1;const n=e.getBoundingClientRect();if(n.width===0||n.height===0)return!1;const o=n.width/window.innerWidth,i=n.height/window.innerHeight;return o>.85||i>.6}),sn=()=>!!document.querySelector("[data-uia*='video-player'], [class*='VideoPlayer'], [class*='watch-video'], [data-uia*='player']"),an=()=>!!(rn()||zt()||sn()&&zt()),ht=()=>{const t=an();t!==S&&(S=t,S?(N(!1),p("BADGE_HIDDEN_PLAYBACK"),v.unmount()):_&&(N(!0),p("BADGE_SHOWN"),p("BROWSE_MODE_DETECTED")))},ln=()=>{if(!_){N(!1);return}S||(N(!0),p("BADGE_SHOWN"))},cn=t=>[t.normalizedTitle??"",t.year??"",t.netflixId??"",t.href??""].join("|"),dn=(t,e)=>({title:t,year:e??null,tmdb:{id:null,voteAverage:null,voteCount:null},letterboxd:{inWatchlist:!1,userRating:null,matchPercent:null,becauseYouLike:[]}}),un=t=>{var e;try{return(e=chrome.runtime)!=null&&e.id?chrome.runtime.sendMessage(t):(p("EXT_CONTEXT_INVALID",{messageType:t==null?void 0:t.type}),Promise.resolve(null))}catch(n){return p("EXT_CONTEXT_SEND_FAILED",{error:n,messageType:t==null?void 0:t.type}),Promise.resolve(null)}},fn=()=>W?W.isConnected?W:(W=null,null):null,pt=t=>{if(!_||(ht(),S))return;p("OVERLAY_MOUNT_ATTEMPT",{reason:t});const e=se(fn()),n=e.jawboneEl,o=e.extracted;if(!n||!o){p("OVERLAY_MOUNT_FAILED",{reason:"no-jawbone"}),v.unmount(),ft(null);return}if(on(n)){p("OVERLAY_MOUNT_FAILED",{reason:"hero-sized"}),v.unmount(),ft(null);return}p("ACTIVE_JAWBONE_FOUND",{rawTitle:o.rawTitle,netflixId:o.netflixId,year:o.year,isSeries:o.isSeries,rejectedTitleCandidates:e.rejectedCount,chosenTitleElement:e.chosenTitleElement?e.chosenTitleElement.outerHTML.slice(0,200):void 0}),p("EXTRACTED_TITLE_INFO",o);const i=cn(o);if(i===Ht&&n===Pt){p("OVERLAY_MOUNT_SUCCESS",{reused:!0});return}Ht=i,Pt=n,ft(n),v.mount(n),v.update(dn(o.rawTitle,o.year??void 0));const r=`req_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;kt=r;const s={type:"RESOLVE_OVERLAY_DATA",requestId:r,payload:o};p("OVERLAY_REQUEST",{titleText:o.rawTitle,normalizedTitle:o.normalizedTitle,href:o.href,year:o.year}),un(s).then(a=>{var c,l,d,h,u,m;if(a&&(a==null?void 0:a.type)==="OVERLAY_DATA_RESOLVED"&&a.requestId===kt){Wt=a.payload,p("OVERLAY_RESPONSE",{requestId:r,tmdb:a.payload.tmdb,letterboxd:{inWatchlist:((c=a.payload.letterboxd)==null?void 0:c.inWatchlist)??!1,userRating:((l=a.payload.letterboxd)==null?void 0:l.userRating)??null,matchPercent:((d=a.payload.letterboxd)==null?void 0:d.matchPercent)??null,becauseYouLikeCount:((u=(h=a.payload.letterboxd)==null?void 0:h.becauseYouLike)==null?void 0:u.length)??0}}),v.update(a.payload);{const g=a.payload.letterboxd;if(!g||!g.inWatchlist&&g.userRating===null){const f=$t(o.rawTitle,o.year??void 0);try{(m=chrome.runtime)!=null&&m.id?chrome.storage.local.get([y.LETTERBOXD_INDEX]).then(w=>{w[y.LETTERBOXD_INDEX]?o.year?p("LB_MATCH_NOT_FOUND",{reason:"no-key",key:f}):p("LB_MATCH_NOT_FOUND",{reason:"missing-year",key:f}):p("LB_MATCH_NOT_FOUND",{reason:"no-index",key:f})}):p("LB_INDEX_SKIP_EXT_CONTEXT_INVALID",{key:f})}catch(w){p("LB_INDEX_LOOKUP_FAILED",{error:w,key:f})}}}}}).catch(a=>{p("Title resolve failed",{requestId:r,err:a})})},R=t=>{dt&&window.clearTimeout(dt),dt=window.setTimeout(()=>{pt(t)},Ze)},hn=()=>{new MutationObserver(()=>{try{R("mutation")}catch(e){p("Mutation observer failed",{error:e})}}).observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","aria-expanded","aria-hidden"]}),document.addEventListener("pointerover",e=>{try{W=e.target,R("pointer")}catch(n){p("Pointer observer failed",{error:n})}},!0),document.addEventListener("focusin",()=>{try{R("focus")}catch(e){p("Focus observer failed",{error:e})}},!0),ut&&window.clearInterval(ut),ut=window.setInterval(()=>{_&&(ht(),!S&&(v.isMounted()||pt("watchdog")))},tn),R("init")},pn=async()=>{const e=!((await Et())[y.OVERLAY_ENABLED]??!0);await Kt({[y.OVERLAY_ENABLED]:e}),_=e,e?(ln(),R("toggle")):(v.unmount(),N(!1)),p("Overlay toggled",{enabled:e})},mn=t=>{t.ctrlKey===ct.ctrlKey&&t.shiftKey===ct.shiftKey&&t.key.toLowerCase()===ct.key&&(t.preventDefault(),pn().catch(e=>p("Toggle failed",e)))},gn=()=>{chrome.runtime.onMessage.addListener(t=>{if((t==null?void 0:t.type)==="LB_INDEX_UPDATED"){p("LB_INDEX_UPDATED"),R("lb-index-updated");return}(t==null?void 0:t.type)==="LB_INDEX_UPDATED_ACK"&&(p("LB_INDEX_UPDATED_ACK",t.payload),R("lb-index-updated"))})},yn=()=>{const t=qt();t.__nxlDebug={getLbIndex:async()=>chrome.storage.local.get(y.LETTERBOXD_INDEX),lastOverlayData:()=>Wt,forceResolve:()=>pt("force")}},En=async()=>{const t=qt();if(t.__nxlBooted)return;t.__nxlBooted=!0,_=(await Et())[y.OVERLAY_ENABLED]??!0,ht(),_&&!S&&(N(!0),p("BADGE_SHOWN"),p("BROWSE_MODE_DETECTED")),hn(),gn(),yn(),window.addEventListener("keydown",mn),Ue()},Yt=async()=>{await En()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{Yt().catch(t=>p("Init failed",t))},{once:!0}):Yt().catch(t=>p("Init failed",t))})();
//# sourceMappingURL=index.js.map
