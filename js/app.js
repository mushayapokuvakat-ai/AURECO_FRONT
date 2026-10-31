(function(){
'use strict';
const DAY=86400000;
const SCHOOL='Africa University';
const LOGO_SRC='assets/logo.png';
const KEY='spw_proto_v2', SKEY='spw_session_v2';
const DEMO_PW='demo1234';
const CODE='123456';

/* ---------- helpers ---------- */
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
const first=n=>String(n).split(' ')[0];
const initials=n=>String(n).split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
const fmtD=ts=>new Date(ts).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
const fmtDL=ts=>new Date(ts).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
const sameDay=(a,b)=>a.toDateString()===b.toDateString();
function fmtWhen(ts){const d=new Date(ts),t=new Date();if(sameDay(d,t))return 'Today, '+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});if(sameDay(d,new Date(Date.now()-DAY)))return 'Yesterday';return fmtD(ts)}
const daysTo=ts=>Math.ceil((ts-Date.now())/DAY);
const uid=p=>p+'_'+Math.random().toString(36).slice(2,9);
const plural=(n,w,pl)=>n+' '+(n===1?w:(pl||w+'s'));
const link=u=>{u=(u||'').trim();if(!u)return '';if(!/^https?:\/\//i.test(u))u='https://'+u;try{return new URL(u).href}catch(e){return ''}};
const todayISO=()=>new Date().toISOString().slice(0,10);
function dueLabel(ts){const n=daysTo(ts);if(n<0)return `<span class="chip bad">⏱ Overdue by ${plural(-n,'day')}</span>`;if(n<=14)return `<span class="chip bad">⏱ Due in ${plural(n,'day')}</span>`;return `<span class="muted">Due ${fmtD(ts)}</span>`}

/* ---------- grades model ---------- */
const CAT=[
 [['Introduction to programming','CSC 101'],['Calculus I','MTH 101'],['Communication skills','COM 101'],['Computer systems','CSC 103']],
 [['Data structures','CSC 102'],['Calculus II','MTH 102'],['Discrete mathematics','MTH 104'],['Web basics','CSC 106']],
 [['Algorithms','CSC 201'],['Linear algebra','MTH 201'],['Operating systems','CSC 203'],['Statistics','STA 201']],
 [['Software engineering','CSC 204'],['Computer networks','CSC 206'],['Probability','STA 204'],['Professional ethics','COM 204']],
 [['Compilers','CSC 301'],['Mobile development','CSC 303'],['Operations research','MTH 305'],['Project management','BUS 301']],
 [['Machine learning','CSC 302'],['Databases','CSC 305'],['Numerical methods','MTH 310'],['Security basics','CSC 312']],
 [['Final-year project','CSC 401'],['Distributed systems','CSC 403'],['AI and society','CSC 405'],['Cloud computing','CSC 407']],
 [['Dissertation','CSC 402'],['Advanced databases','CSC 404'],['Entrepreneurship','BUS 402'],['Elective','CSC 4XX']]
];
const CREDITS=[13,13,13,13,12,14,13,13];
const CPAT={12:[3,3,3,3],13:[4,3,3,3],14:[4,4,3,3]};
const LAD=[['C',2],['C+',2.3],['B-',2.7],['B',3],['B+',3.3],['A-',3.7],['A',4]];
const EXACT5=[['Machine learning','CSC 302',4,'A'],['Databases','CSC 305',4,'B+'],['Numerical methods','MTH 310',3,'A-'],['Security basics','CSC 312',3,'B']];
function courses(u,i){
  if(u.id==='u_jordan'&&i===5)return EXACT5.map(c=>({name:c[0],code:c[1],credits:c[2],grade:c[3],points:LAD.find(l=>l[0]===c[3])[1]}));
  const cr=CPAT[CREDITS[i]];let R=CREDITS[i],P=u.gpas[i]*R;
  return CAT[i].map((c,j)=>{const want=P/R;const b=LAD.reduce((a,x)=>Math.abs(x[1]-want)<Math.abs(a[1]-want)?x:a);R-=cr[j];P-=b[1]*cr[j];return {name:c[0],code:c[1],credits:cr[j],grade:b[0],points:b[1]}});
}
function semGpa(u,i){const c=courses(u,i);const cr=c.reduce((a,x)=>a+x.credits,0);return Math.round(c.reduce((a,x)=>a+x.points*x.credits,0)/cr*100)/100}
const creditsDone=u=>(u.gpas||[]).reduce((a,_,i)=>a+CREDITS[i],0);
const fmt2=n=>Number(n).toFixed(2);

/* ---------- seed ---------- */
function seed(){
  let ph=100;
  const stu=(id,name,sid,year,prog,overall,gpas,extra)=>Object.assign({id,role:'student',name,schoolId:sid,email:name.toLowerCase().replace(/ /g,'.')+'@students.school.edu',phone:'+263 77 '+(++ph)+' '+(4000+ph),password:DEMO_PW,year,programme:prog,status:'active',overall,gpas,bio:'',skills:[],linkedin:'',github:'',photo:null},extra||{});
  const staff=(id,hon,name,title,dept,email,teaches,status)=>({id,role:'staff',hon,name,title,dept,email,teaches,password:DEMO_PW,status:status||'active',photo:null});
  const startJ=Date.now()-37*DAY, startC=Date.now()-68*DAY;
  const att=(start)=>({supId:'u_casey',company:'Acme Ltd',start,end:start+84*DAY});
  const users=[
    stu('u_jordan','Jordan Lee','2023-0148',3,'BSc Computer Science',3.41,[3.12,3.35,3.55,3.45,3.65,3.52],{phone:'+263 77 123 4567',bio:"Third-year Computer Science student who enjoys building tools that save people time. Strong in databases and web development. I'm looking for a software developer role after I graduate.",skills:['Python','SQL','JavaScript','Git'],linkedin:'linkedin.com/in/jordanlee',github:'github.com/jordanlee',attach:att(startJ)}),
    stu('u_sam','Sam Patel','2023-0152',3,'BSc Computer Science',3.28,[3.0,3.2,3.3,3.4,3.35,3.4],{bio:'Third-year student interested in data and mobile apps.',skills:['Java','Kotlin','SQL'],linkedin:'linkedin.com/in/sampatel',github:'github.com/sampatel',attach:att(startJ)}),
    stu('u_alex','Alex Carter','2024-0310',2,'BSc Information Systems',3.15,[3.0,3.1,3.3,3.2],{bio:'Second-year Information Systems student.',skills:['Excel','SQL']}),
    stu('u_taylor','Taylor Kim','2023-0201',3,'BSc Computer Science',3.55,[3.4,3.5,3.6,3.7,3.6,3.5],{bio:'Final-year project lead who likes teamwork and clean code.',skills:['Python','React','Git'],linkedin:'linkedin.com/in/taylorkim',github:'github.com/taylorkim'}),
    stu('u_casen','Casey Nguyen','2022-0077',4,'BSc Computer Science',3.62,[3.3,3.4,3.5,3.6,3.7,3.7,3.8],{bio:'Fourth-year student who enjoys backend work.',skills:['Go','PostgreSQL','Docker'],linkedin:'linkedin.com/in/caseynguyen',github:'github.com/caseynguyen',attach:att(startC)}),
    stu('u_tendai','Tendai Sibanda','2024-0188',2,'BSc Computer Science',3.22,[3.1,3.2,3.3,3.3],{bio:'Second-year student.',skills:['Python']}),
    stu('u_nomsa','Nomsa Dube','2025-0301',1,'BSc Information Systems',3.05,[3.0,3.1],{}),
    stu('u_farai','Farai Moyo','2025-0302',1,'BSc Computer Science',3.0,[3.0,3.0],{}),
    staff('u_riley','Dr.','Riley Adams','Lecturer','Computing','riley.adams@school.edu',['u_jordan','u_sam','u_alex','u_taylor','u_casen','u_tendai']),
    staff('u_jamie','Ms.','Jamie Ortiz','Teacher','Communication','jamie.ortiz@school.edu',['u_jordan','u_alex']),
    staff('u_morgan','Prof.','Morgan Hughes','Lecturer','Mathematics','morgan.hughes@school.edu',['u_jordan','u_sam']),
    staff('u_dana','Dr.','Dana Whitfield','Lecturer','Mathematics','dana.whitfield@school.edu',[],'deactivated'),
    {id:'u_casey',role:'supervisor',name:'Casey Brooks',company:'Acme Ltd',dept:'Software team',email:'casey.brooks@acme.example',password:DEMO_PW,status:'active',photo:null},
    {id:'u_quinn',role:'admin',name:'Quinn Moyer',dept:'Registry office',email:'quinn.moyer@school.edu',password:DEMO_PW,status:'active',photo:null},
    {id:'u_robin',role:'student',name:'Robin Hale',schoolId:'2025-0412',email:'robin.hale@students.school.edu',phone:'+263 77 555 0412',password:DEMO_PW,year:1,programme:'',status:'pending',overall:null,gpas:[],bio:'',skills:[],linkedin:'',github:'',photo:null,signup:{match:true,issues:[],at:Date.now()-DAY}},
    {id:'u_drew',role:'student',name:'Drew Sato',schoolId:'2025-0413',email:'drew.sato@mail.com',phone:'+263 77 555 0413',password:DEMO_PW,year:1,programme:'',status:'pending',overall:null,gpas:[],bio:'',skills:[],linkedin:'',github:'',photo:null,signup:{match:false,issues:['Records list drew.s@students.school.edu, but they entered drew.sato@mail.com.'],at:Date.now()-DAY}}
  ];
  const registry=users.filter(u=>u.role==='student').map(u=>({schoolId:u.schoolId,name:u.name,email:u.id==='u_drew'?'drew.s@students.school.edu':u.email,year:u.year,programme:u.programme}));
  registry.push({schoolId:'2026-0501',name:'Mia Dube',email:'mia.dube@students.school.edu',year:1,programme:'BSc Information Systems'},{schoolId:'2026-0502',name:'Kudzai Ncube',email:'kudzai.ncube@students.school.edu',year:1,programme:'BSc Computer Science'});
  let n=0;const A=(sid,type,year,title,where,status,age,comments)=>({id:'a'+(++n),sid,type,year,title,where:where||'',status,created:Date.now()-age*DAY,evidence:'',comments:comments||[]});
  const acts=[
    A('u_jordan','achievement',3,"Dean's list",'Faculty of Science','verified',60),
    A('u_jordan','achievement',2,'Hackathon finalist','Inter-university','verified',300),
    A('u_jordan','achievement',1,'Best first-year project','Computing department','verified',600),
    A('u_jordan','leadership',3,'Chess club treasurer',"Students' union",'waiting',45,[{by:'u_riley',text:'Please add a letter from the club president.',at:Date.now()-20*DAY}]),
    A('u_jordan','leadership',2,'Class representative','Computing','verified',350),
    A('u_jordan','leadership',2,'Peer mentor','First-year mentoring programme','verified',320),
    A('u_jordan','extra',3,'Debate society','Member, years 1 to 3','verified',90),
    A('u_jordan','extra',1,'Football, first team','University sport','verified',550),
    A('u_jordan','extra',2,'Photography club','Member','waiting',5),
    A('u_sam','achievement',3,'Programming contest, second place','Regional contest','waiting',3),
    A('u_sam','leadership',2,'Student council secretary','','verified',200),
    A('u_sam','extra',1,'Basketball','Campus league','verified',500),
    A('u_alex','leadership',2,'Volunteer tutor','Maths support desk','waiting',40),
    A('u_alex','extra',1,'Drama club','','verified',400),
    A('u_taylor','achievement',2,'Faculty prize','Computing','verified',300),
    A('u_taylor','leadership',3,'Hackathon team lead','','verified',100),
    A('u_taylor','extra',1,'Robotics club','','verified',500),
    A('u_casen','achievement',3,'Dean\'s list','','verified',200),
    A('u_casen','leadership',3,'Coding club president','','verified',150),
    A('u_casen','extra',2,'Cycling','','verified',300),
    A('u_tendai','achievement',1,'First-year merit award','','verified',400),
    A('u_nomsa','extra',1,'Choir','','waiting',10)
  ];
  const P=(sid,name,kind,goal,challenge,role,result,live,code)=>({id:uid('p'),sid,name,kind,goal,challenge,role,result,live:live||'',code:code||'',comments:[]});
  const projects=[
    P('u_jordan','Student results portal','Class project · Team of 4','Let lecturers upload marks and let students see them.','Marks pages loaded slowly. I added a database index and cut the load time from 6 seconds to 2.','I built the database and the login system. Two teammates built the screens, one wrote tests.','Used by 3 classes, 120 students','https://example.com/results','https://github.com/jordanlee/results-portal'),
    P('u_jordan','Clinic booking app','Freelance · Solo','Help a small clinic stop double-booking patients.','Two people booked the same slot. I chose to lock a slot the moment someone starts booking it.','I did everything: design, code and set-up.','Missed appointments down by a third','https://example.com/clinic','https://github.com/jordanlee/clinic-booking'),
    P('u_jordan','Budget tracker','Personal build · Solo','Track monthly spending without a spreadsheet.','Syncing between phone and laptop. I used a small sync queue.','Solo build.','Used daily for 8 months','','https://github.com/jordanlee/budget'),
    P('u_jordan','Library catalogue search','Class project · Team of 3','Help students find books faster than the old card list.','Searches were slow on long titles. I tried two methods and picked the faster one.','Team of 3. I wrote the search and the database.','Searches take under 1 second. Used by 200 students.','',''),
    P('u_sam','Step counter app','Personal build · Solo','Count steps and show weekly trends.','Battery use was high; I batched sensor reads.','Solo.','Battery use down 40%','','https://github.com/sampatel/steps'),
    P('u_sam','Campus map','Class project · Team of 3','A simple map of lecture rooms.','Offline use; cached tiles.','Wrote the search.','Used by 80 students','',''),
    P('u_alex','Inventory sheet','Class project · Solo','Track stock for a small shop.','','','','',''),
    P('u_taylor','Team scheduler','Class project · Team of 4','Fair timetable for group work.','','Led the team.','Used by 4 classes','',''),
    P('u_taylor','Portfolio site','Personal build · Solo','Show my work.','','Solo.','','',''),
    P('u_taylor','Final-year project','Final-year · Team of 4','Real-time lab booking.','Handling clashes.','Led a team of four.','Delivered ahead of schedule','',''),
    P('u_casen','Log shipper','Personal build · Solo','Ship logs cheaply.','','Solo.','Cut costs by half','',''),
    P('u_casen','Chat service','Class project · Team of 3','Scalable chat.','','Backend.','Handled 5k users in tests','',''),
    P('u_casen','Warehouse API','Attachment · Solo','Stock API for a client.','','Solo.','In use','',''),
    P('u_tendai','Quiz game','Class project · Team of 2','A study quiz.','','','','','')
  ];
  const bodyV1='Dear hiring manager,\n\nIt is my pleasure to recommend Taylor Kim for the software internship. In my databases class they showed strong problem-solving skills.\n\nI am confident they would be a valuable team member.\n\nYours sincerely,\nDr. Riley Adams';
  const draftV2='Dear hiring manager,\n\nIt is my pleasure to recommend Taylor Kim for the software internship. In my databases class they showed strong problem-solving skills.\n\nIn their final-year project, Taylor led a team of four and delivered a working system ahead of schedule.\n\nI am confident they would be a valuable team member.\n\nYours sincerely,\nDr. Riley Adams';
  const share={grades:true,ach:true,lead:true,extra:true};
  const L=(sid,staffId,purpose,due,status,o)=>Object.assign({id:uid('l'),sid,staffId,purpose,due,note:'',share:clone(share),status,reply:'',versions:[],changeRequests:[],changesUsed:0,draft:'',created:Date.now()-5*DAY},o||{});
  const letters=[
    L('u_jordan','u_riley','Internship',Date.now()+20*DAY,'ready',{versions:[{n:1,body:'Dear hiring manager,\n\nI am pleased to recommend Jordan Lee for a software internship. In my databases class Jordan built the strongest project of the year, and they led the team with care and good humour.\n\nI recommend them without reservation.\n\nYours sincerely,\nDr. Riley Adams',sent:Date.now()-3*DAY,seen:false}],note:"I'm applying for a software internship at a local bank."}),
    L('u_jordan','u_morgan','Scholarship',Date.now()+30*DAY,'accepted'),
    L('u_jordan','u_jamie','Job application',Date.now()+17*DAY,'declined',{reply:"I'm on leave this term. Please ask another lecturer."}),
    L('u_jordan','u_riley','Scholarship',Date.now()+10*DAY,'waiting',{note:'I would like my leadership in the chess club mentioned.'}),
    L('u_sam','u_riley','Job application',Date.now()+27*DAY,'waiting'),
    L('u_taylor','u_riley','Internship',Date.now()+15*DAY,'changes',{versions:[{n:1,body:bodyV1,sent:Date.now()-13*DAY,seen:true}],changesUsed:1,changeRequests:[{text:'Please mention my final-year project and how I led the team.',at:Date.now()-DAY}],draft:draftV2}),
    L('u_alex','u_riley','Scholarship',Date.now()-3*DAY,'waiting')
  ];
  const notes=[
    {sid:'u_jordan',wk:4,r:{punct:5,qual:3,team:4},text:'Started the reports page. Needs a clearer plan.',at:startJ+27*DAY,by:'u_casey'},
    {sid:'u_jordan',wk:5,r:{punct:5,qual:4,team:5},text:'Settled in well. Asks good questions.',at:startJ+34*DAY,by:'u_casey'},
    {sid:'u_sam',wk:5,r:{punct:4,qual:4,team:4},text:'Steady progress on the mobile client.',at:startJ+34*DAY,by:'u_casey'},
    {sid:'u_casen',wk:9,r:{punct:5,qual:5,team:5},text:'Delivered the stock API and wrote the handover notes.',at:startC+62*DAY,by:'u_casey'}
  ];
  return {v:2,users,registry,acts,projects,letters,notes,finals:{},
    assess:[{sid:'u_jordan',by:'u_riley',r:{leadership:4,teamwork:5,communication:3},feedback:'Jordan led the club well this year. Next, try delegating more tasks.',at:Date.now()-10*DAY}],
    perms:defaultPerms(),permLog:[{ts:Date.now()-DAY,by:'Quinn Moyer',text:'Permissions changed for Lecturers'},{ts:Date.now()-20*DAY,by:'Quinn Moyer',text:'Teachers can now comment on portfolios'}],
    log:[{ts:Date.now()-3600000,text:'Registry updated Year 2 grades'},{ts:Date.now()-DAY,text:'Permissions changed for Lecturers'},{ts:Date.now()-DAY,text:'2 students signed up'}],
    reports:[{id:'r1',name:'Year 3 progress',fmt:'PDF',ts:Date.now()-20*DAY,f:{'rep.type':'progress','rep.group':'3','rep.grades':true,'rep.credits':true,'rep.acts':true,'rep.comp':true}},{id:'r2',name:'Compliance summary',fmt:'Excel',ts:Date.now()-32*DAY,f:{'rep.type':'compliance','rep.group':'all'}}]
  };
}

/* ---------- permissions ---------- */
const PROLES=['student','teacher','lecturer','supervisor','administrator'];
const PLABEL={student:'Student',teacher:'Teacher',lecturer:'Lecturer',supervisor:'Supervisor',administrator:'Administrator'};
const N=null;
const PROWS=[
 {g:'Portfolios'},
 {k:'view_own',l:'View their own portfolio',why:'Students always see their own portfolio. This is fixed by the school.',c:[[1,1],N,N,N,N]},
 {k:'add_projects',l:'Add projects and edit their profile',c:[[1,0],N,N,N,N]},
 {k:'view_taught',l:'View portfolios of students they teach or supervise',c:[N,[1,0],[1,0],[1,0],N]},
 {k:'view_all',l:"View every student's portfolio",why:'Only administrators can be given access to every portfolio. Other roles only see students linked to them.',c:[[0,1],[0,1],[0,1],[0,1],[1,0]]},
 {k:'add_acts',l:'Add activities and achievements',c:[[1,0],N,N,N,N]},
 {k:'verify',l:'Check (verify) entries',why:'Students cannot verify their own entries. This is fixed by the school.',c:[[0,1],[1,0],[1,0],[0,0],[0,0]]},
 {k:'comment_rate',l:'Comment on and rate portfolios',why:'Students cannot rate their own portfolio. This is fixed by the school.',c:[[0,1],[1,0],[1,0],[0,0],[0,0]]},
 {k:'add_notes',l:'Add attachment progress notes',why:'Students cannot write their own progress notes. This is fixed by the school.',c:[[0,1],[0,0],[0,0],[1,0],[0,0]]},
 {k:'change_gpa',l:'Change certified GPA and grades',why:'Grades are entered by the registry office and certified. Nobody can edit them here.',c:[[0,1],[0,1],[0,1],[0,1],[0,1]]},
 {g:'Letters'},
 {k:'ask_letter',l:'Ask for a recommendation letter',c:[[1,0],N,N,N,N]},
 {k:'write_letters',l:'Write recommendation letters',why:'Students cannot write their own letters. This is fixed by the school.',c:[[0,1],[1,0],[1,0],[0,0],[0,0]]},
 {g:'People and reports'},
 {k:'manage_accounts',l:'Create and manage accounts',why:'Only administrators manage accounts, and they always keep this access.',c:[[0,1],[0,1],[0,1],[0,1],[1,1]]},
 {k:'change_perms',l:'Change permissions',why:'Only administrators change permissions, and they always keep this access.',c:[[0,1],[0,1],[0,1],[0,1],[1,1]]},
 {k:'see_reports',l:'See the dashboard and reports',why:'Students cannot see school-wide reports. This is fixed by the school.',c:[[0,1],[0,0],[0,0],[0,0],[1,1]]}
];
function defaultPerms(){const p={};PROWS.forEach(r=>{if(!r.k)return;p[r.k]={};PROLES.forEach((role,i)=>{const c=r.c[i];p[r.k][role]=c?{v:!!c[0],lock:!!c[1]}:null})});return p}
function permRole(u){return u.role==='student'?'student':u.role==='staff'?(u.title==='Teacher'?'teacher':'lecturer'):u.role==='supervisor'?'supervisor':'administrator'}

/* ---------- state ---------- */
function load(){if(AU_CONFIG.USE_BACKEND)return window.__AU_BOOT_STATE||null;try{const r=localStorage.getItem(KEY);if(r){const s=JSON.parse(r);if(s&&s.v===2)return s}}catch(e){}return null}
function save(){if(AU_CONFIG.USE_BACKEND){AuAPI.pushState(S);return}try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function loadSes(){try{const r=sessionStorage.getItem(SKEY)||localStorage.getItem(SKEY);if(r)return JSON.parse(r)}catch(e){}return null}
function saveSes(keep){try{sessionStorage.removeItem(SKEY);localStorage.removeItem(SKEY);if(SES){const j=JSON.stringify(SES);(keep?localStorage:sessionStorage).setItem(SKEY,j)}}catch(e){}}
let S=load()||seed();
let SES=loadSes();
let F={},NEXT={},ui={err:{}};
const live={},actions={},submits={};
const user=id=>S.users.find(u=>u.id===id);
const me=()=>{const u=SES&&user(SES.uid);return u&&u.status==='active'?u:null};
const students=()=>S.users.filter(u=>u.role==='student'&&u.status==='active');
const staffLabel=u=>((u.hon?u.hon+' ':'')+u.name);
function can(key){const u=me();if(!u)return false;const perms=(SES&&SES.perms)||S.perms;const c=perms[key]&&perms[key][permRole(u)];return !!(c&&c.v)}
function need(key){if(can(key))return true;toast("Your role doesn't have this permission. The administrator can change it under Permissions.",'bad');return false}
function addLog(text){S.log.unshift({ts:Date.now(),text});S.log=S.log.slice(0,30)}
const myActs=sid=>S.acts.filter(a=>a.sid===sid);
const myProjects=sid=>S.projects.filter(p=>p.sid===sid);
const isComplete=sid=>myProjects(sid).length>0&&['achievement','leadership','extra'].every(t=>myActs(sid).some(x=>x.type===t));
const TYPES={achievement:'School achievements',leadership:'Leadership roles',extra:'Extracurricular'};
const TYPE1={achievement:'School achievement',leadership:'Leadership role',extra:'Extracurricular'};
const FNAME=(u)=>u.role==='staff'?staffLabel(u):u.name;
const OLD=30*DAY;
const oldEntries=()=>S.acts.filter(a=>a.status!=='verified'&&Date.now()-a.created>OLD&&user(a.sid)&&user(a.sid).status==='active');
const openLetters=l=>['waiting','accepted','changes'].includes(l.status);
const overdueLetters=()=>S.letters.filter(l=>openLetters(l)&&l.due<Date.now());

/* ---------- UI helpers ---------- */
const app=document.getElementById('app');
function toast(msg,kind){const t=document.getElementById('toast');const d=document.createElement('div');d.className='toast '+(kind||'');d.textContent=msg;t.appendChild(d);setTimeout(()=>{try{d.remove()}catch(e){}},kind==='bad'?6000:4200)}
const fv=(k,d)=>F[k]!==undefined?F[k]:(d==null?'':d);
function fld(k,o){o=o||{};const err=ui.err[k],id='f_'+k.replace(/\W/g,'_'),val=fv(k,o.def);
  const at=`id="${id}" data-k="${k}" ${o.lv?`data-live="${o.lv}"`:''} ${o.ph?`placeholder="${esc(o.ph)}"`:''} ${o.max?`maxlength="${o.max}"`:''} ${o.auto?`autocomplete="${o.auto}"`:''} ${o.min?`min="${o.min}"`:''} ${err?`aria-invalid="true" aria-describedby="${id}_e"`:''}`;
  const ctl=o.ta?`<textarea ${at} rows="${o.rows||3}">${esc(val)}</textarea>`:`<input type="${o.type||'text'}" ${at} value="${esc(val)}">`;
  return `<div class="field ${err?'has-err':''}"><label for="${id}">${o.label}</label>${ctl}${o.hint?`<div class="hint">${o.hint}</div>`:''}${err?`<div class="errmsg" id="${id}_e">${esc(err)}</div>`:''}</div>`}
function selF(k,opts,o){o=o||{};const id='f_'+k.replace(/\W/g,'_'),err=ui.err[k],val=fv(k,o.def);
  return `<div class="field ${err?'has-err':''}">${o.label?`<label for="${id}">${o.label}</label>`:''}<select id="${id}" data-k="${k}" ${o.r?'data-r="1"':''} ${o.lv?`data-live="${o.lv}"`:''}>${opts.map(op=>{const [v,l]=Array.isArray(op)?op:[op,op];return `<option value="${esc(v)}" ${String(val)===String(v)?'selected':''}>${esc(l)}</option>`}).join('')}</select>${o.hint?`<div class="hint">${o.hint}</div>`:''}${err?`<div class="errmsg">${esc(err)}</div>`:''}</div>`}
function chk(k,label,def,r){const v=F[k]!==undefined?F[k]:!!def;return `<label class="chk"><input type="checkbox" data-k="${k}" ${r?'data-r="1"':''} ${v?'checked':''}><span>${label}</span></label>`}
function tabs(k,items,def,live_){const cur=fv(k,def);return `<div class="tabs" role="group">${items.map(([v,l])=>`<button type="button" data-a="setF" data-k="${k}" data-v="${esc(v)}" aria-pressed="${String(cur)===String(v)}">${l}</button>`).join('')}</div>`}
function ratings(k,def){const cur=Number(fv(k,def))||0;return `<div class="rating" role="group">${[1,2,3,4,5].map(n=>`<button type="button" data-a="rate" data-k="${k}" data-v="${n}" aria-pressed="${cur===n}" aria-label="${n}">${n}</button>`).join('')}</div>`}
function avatar(u,size,edit){const inner=u.photo?`<img src="${u.photo}" alt="">`:`<span>${esc(initials(u.name))}</span>`;return `<div class="avatar" style="--s:${size||56}px">${inner}${edit?`<button class="cam" data-a="photo" data-id="${u.id}" aria-label="Change profile photo" title="Change photo"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg></button>`:''}</div>`}
const logo=()=>`<span class="logo"><img src="${LOGO_SRC}" alt="Africa University logo"></span>`;
const crumbs=a=>`<div class="crumbs">${a.map(([l,h])=>h?`<a href="#${h}">${esc(l)}</a>`:esc(l)).join(' › ')}</div>`;
const fail=()=>{ui.focusErr=true;render()};
function openModal(title,body,o){ui.modal=Object.assign({title,body},o||{});renderModal()}
function closeModal(){ui.modal=null;renderModal()}
function renderModal(){const m=document.getElementById('modal');if(!ui.modal){m.innerHTML='';return}
  m.innerHTML=`<div class="backdrop" data-bd="1"><div class="modal ${ui.modal.wide?'wide':''}" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="mhead"><h2 id="mt">${esc(ui.modal.title)}</h2><button class="x" data-a="closeModal" aria-label="Close">✕</button></div><div class="mbody">${ui.modal.body()}</div></div></div>`;
  const f=m.querySelector('input,select,textarea,.btn');if(f&&f.focus)try{f.focus()}catch(e){}}
function go(p,next){NEXT=next||{};if(location.hash==='#'+p){F=Object.assign({},NEXT);NEXT={};ui={err:{}};render()}else location.hash=p}

/* ---------- dark / light toggle ---------- */
const TKEY='au_theme';
function getTheme(){try{const t=localStorage.getItem(TKEY);if(t==='dark'||t==='light')return t}catch(e){}return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
function applyTheme(t){document.documentElement.dataset.theme=t;document.body.classList.toggle('dark-theme',t==='dark')}
applyTheme(getTheme());
const themeBtn=()=>`<button type="button" class="linkbtn" data-a="theme">${getTheme()==='dark'?'☀ Light mode':'☾ Dark mode'}</button>`;
actions.theme=()=>{const t=getTheme()==='dark'?'light':'dark';applyTheme(t);try{localStorage.setItem(TKEY,t)}catch(e){}render()};
/* ---------- projects: tab filter ---------- */
const PCAT={'Class project':'class','Personal build':'personal','Freelance':'work','Attachment':'work','Final-year project':'major','Hackathon':'major'};
const PCATS=[['all','All'],['class','Class'],['personal','Personal'],['work','Freelance and attachment'],['major','Final-year and hackathon']];
const projCat=p=>PCAT[(p.kind||'').split(' · ')[0]]||'other';
function applyProjFilter(animate){const cat=fv('pr.cat','all');document.querySelectorAll('[data-a="projFilter"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===cat)));let shown=0;
  document.querySelectorAll('.pfilter').forEach(it=>{const ok=cat==='all'||it.dataset.category===cat;if(ok)shown++;
    if(!animate){it.hidden=!ok;it.classList.remove('fade');return}
    if(ok){if(it.hidden||it.classList.contains('fade')){it.classList.add('fade');it.hidden=false;void it.offsetWidth;it.classList.remove('fade')}}
    else{it.classList.add('fade');setTimeout(()=>{if(it.classList.contains('fade'))it.hidden=true},180)}});
  const em=document.getElementById('pfEmpty');if(em)em.hidden=shown>0}
actions.projFilter=el=>{F['pr.cat']=el.dataset.v;applyProjFilter(true)};
live.projFilter=()=>applyProjFilter(false);
/* ---------- shell ---------- */
const NAV={student:[['Home',''],['My grades','/grades'],['My projects','/projects'],['My activities','/activities'],['My letters','/letters']],staff:[['Home',''],['My students','/students'],['Letter requests','/letters']],supervisor:[['Home',''],['My students','/students']],admin:[['Home',''],['People','/people'],['Permissions','/permissions'],['Reports','/reports']]};
const SIDE_TITLE={student:'My portfolio',staff:'Staff portal',supervisor:'Supervisor',admin:'Admin'};
function shell(u,body){const base='/'+u.role,cur=location.hash.replace(/^#/,'');
  const items=NAV[u.role].map(([l,p])=>{const on=p===''?cur===base:cur.startsWith(base+p);return `<a href="#${base+p}" class="nav-i ${on?'on':''}" ${on?'aria-current="page"':''}>${l}</a>`}).join('');
  return `<div class="shell"><aside class="side"><div class="brand">${logo()}<span style="line-height:1.2"><b>Africa University</b><br><span class="muted small">${SIDE_TITLE[u.role]}</span></span></div><nav aria-label="Main">${items}</nav><div class="side-foot"><span>${esc(u.name)}</span>${themeBtn()}<button class="linkbtn" data-a="logout">Log out</button></div></aside><main class="main" id="main">${body}</main></div>`}

/* ---------- auth: log in ---------- */
const ROLE_LABEL={student:'Student',staff:'Staff',supervisor:'Supervisor',admin:'Administrator'};
function loginPage(){
  const role=fv('login.role','student');
  const demos=[['student','Jordan Lee','2023-0148'],['staff','Dr. Riley Adams','riley.adams@school.edu'],['supervisor','Casey Brooks','casey.brooks@acme.example'],['admin','Quinn Moyer','quinn.moyer@school.edu']];
  const hint={student:'School email or school ID',staff:'School email',supervisor:'Work email',admin:'School email'}[role];
  return `<div class="auth"><div class="authbox"><div style="text-align:right;margin-bottom:8px">${themeBtn()}</div><div class="authcard"><div class="logo">${logo().replace(/^<span class="logo">|<\/span>$/g,'')}</div><h1>Sign in to your portfolio</h1><p class="muted" style="text-align:center;margin:2px 0 18px">${SCHOOL}</p>
   <div class="seg" role="group" aria-label="I am a">${Object.entries(ROLE_LABEL).map(([r,l])=>`<button type="button" data-a="loginRole" data-v="${r}" aria-pressed="${r===role}">${l}</button>`).join('')}</div>
   ${ui.err.login?`<div class="banner bad mb" role="alert">${esc(ui.err.login)}</div>`:''}
   <form data-submit="login" novalidate>
    ${fld('login.id',{label:hint,ph:role==='student'?'name@students.school.edu or 2023-0148':'name@school.edu',auto:'username'})}
    <div class="field ${ui.err['login.pw']?'has-err':''}"><label for="f_login_pw">Password</label><div class="pw"><input id="f_login_pw" type="password" data-k="login.pw" value="${esc(fv('login.pw'))}" autocomplete="current-password"><button type="button" data-a="togglePw">Show</button></div>${ui.err['login.pw']?`<div class="errmsg">${esc(ui.err['login.pw'])}</div>`:''}</div>
    <div class="row between mb">${chk('login.keep','Keep me signed in')}<button type="button" class="linkbtn" data-a="forgot">Forgot password?</button></div>
    <button class="btn pri" style="width:100%" type="submit">Sign in as ${ROLE_LABEL[role].toLowerCase()}</button>
   </form>
   ${role==='student'?`<p style="text-align:center;margin-top:16px" class="muted">New student? <a href="#/signup"><b>Create an account</b></a></p>`:`<p class="muted small" style="text-align:center;margin-top:16px;border-top:1px solid var(--line);padding-top:14px">Staff, supervisors and administrators: accounts are created by the school. Supervisors sign in with their work email and password.</p>`}
  </div>
  ${AU_CONFIG.USE_BACKEND?'':`<div class="demo"><b>Prototype demo accounts</b> (password for all: ${DEMO_PW})<div class="row">${demos.map(([r,n,id])=>`<button type="button" class="btn sm" data-a="fillDemo" data-r="${r}" data-id="${id}">${n}</button>`).join('')}</div>
  <p class="small" style="margin-top:10px">Everything you do is saved in this browser only, so you can switch between roles and see how they work together. <button class="linkbtn" data-a="resetDemo">Reset demo data</button></p></div>`}</div></div>`}
actions.loginRole=el=>{F['login.role']=el.dataset.v;ui.err={};render()};
actions.togglePw=el=>{const i=el.parentElement.querySelector('input');const show=i.type==='password';i.type=show?'text':'password';el.textContent=show?'Hide':'Show'};
actions.fillDemo=el=>{F['login.role']=el.dataset.r;F['login.id']=el.dataset.id;F['login.pw']=DEMO_PW;ui.err={};render()};
actions.resetDemo=()=>{try{localStorage.removeItem(KEY)}catch(e){}S=seed();SES=null;saveSes();F={};ui={err:{}};render();toast('Demo data reset.')};
actions.forgot=()=>openModal('Reset your password',()=>`<p class="mb">Enter your school email. We will send a link to reset your password.</p>${fld('forgot.email',{label:'School email',type:'email',ph:'name@school.edu'})}<div class="row"><button class="btn pri" data-a="sendReset">Send reset link</button><button class="btn" data-a="closeModal">Cancel</button></div>`);
actions.sendReset=()=>{const v=fv('forgot.email').trim();if(!/^\S+@\S+\.\S+$/.test(v)){ui.err['forgot.email']='Enter a valid email, like name@school.edu.';renderModal();return}ui.err={};closeModal();toast('If that email belongs to an account, a reset link is on its way. (Prototype: no email is actually sent.)')};
submits.login=()=>{if(AU_CONFIG.USE_BACKEND)return loginRemote();
  const role=fv('login.role','student'),id=fv('login.id').trim().toLowerCase(),pw=fv('login.pw');ui.err={};
  if(!id)ui.err['login.id']='Enter your school email or school ID.';
  if(!pw)ui.err['login.pw']='Enter your password.';
  if(Object.keys(ui.err).length)return fail();
  const u=S.users.find(x=>x.email.toLowerCase()===id||(x.schoolId&&x.schoolId.toLowerCase()===id));
  if(!u||u.password!==pw){ui.err.login="We couldn't find an account with those details. Check your email or ID and password, then try again.";return fail()}
  if(u.role!==role){ui.err.login=`That is ${u.role==='admin'?'an administrator':'a '+u.role} account. Choose "${ROLE_LABEL[u.role]}" above and sign in again.`;return fail()}
  const msg={pending:"Your sign-up is waiting for the administrator to approve it. You can sign in once it's approved.",correction:'The administrator asked you to correct your details. Create your account again using the details the school holds for you.',rejected:'This sign-up was not approved. Contact the registry office for help.',deactivated:'This account has been deactivated. Contact the registry office to have it turned back on.'}[u.status];
  if(msg){ui.err.login=msg;return fail()}
  SES={uid:u.id,perms:clone(S.perms)};saveSes(!!fv('login.keep'));F={};ui={err:{}};go('/'+u.role);
};
actions.logout=()=>{if(AU_CONFIG.USE_BACKEND){AuAPI.logout();S=seed()}SES=null;saveSes();F={};ui={err:{}};location.hash='#/login';render()};

/* backend login: the server checks the password and returns a token; the app then loads its data */
function loginRemote(){const role=fv('login.role','student'),id=fv('login.id').trim(),pw=fv('login.pw'),keep=!!fv('login.keep');ui.err={};
  if(!id)ui.err['login.id']='Enter your school email or school ID.';
  if(!pw)ui.err['login.pw']='Enter your password.';
  if(Object.keys(ui.err).length)return fail();
  AuAPI.login(role,id,pw,keep).then(r=>AuAPI.fetchState().then(st=>{S=st;const u=user(r.userId);SES={uid:r.userId,perms:clone(S.perms)};saveSes(keep);F={};ui={err:{}};go('/'+(u?u.role:role))}))
   .catch(e=>{AuAPI.clearToken();ui.err.login=(e&&e.message)||'We could not sign you in. Check your connection and try again.';fail()})}
AuAPI.onError=msg=>toast(msg,'bad');
AuAPI.onUnauthorized=()=>{if(SES){SES=null;saveSes();S=seed();ui={err:{}};location.hash='#/login';render();toast('Your session has ended. Please sign in again.','bad')}};

/* ---------- auth: sign up ---------- */
const pwScore=p=>[p.length>=8,/\d/.test(p),/[^A-Za-z0-9]/.test(p),p.length>=12].filter(Boolean).length;
live.pw=()=>{const el=document.getElementById('pwbar');if(!el)return;const s=pwScore(fv('su.pw'));el.style.width=(fv('su.pw')?s*25:0)+'%';el.style.background=s<=1?'var(--bad)':s<3?'var(--warn)':'var(--ok)'};
function signupPage(){
  const su=ui.su||{stage:'form'};let inner;
  if(su.stage==='form')inner=`<h1>Create your account</h1><p class="muted" style="text-align:center;margin:2px 0 18px">Use the details the school has on file for you.</p>
   <form data-submit="signup" novalidate>
    ${fld('su.id',{label:'School ID',ph:'2023-0148',auto:'off'})}
    ${fld('su.email',{label:'School email',type:'email',ph:'name@students.school.edu',hint:"We'll send a verification code here.",auto:'email'})}
    ${fld('su.phone',{label:'Phone number',type:'tel',ph:'+263 77 123 4567',auto:'tel'})}
    <div class="field ${ui.err['su.pw']?'has-err':''}"><label for="f_su_pw">Create password</label><div class="pw"><input id="f_su_pw" type="password" data-k="su.pw" data-live="pw" value="${esc(fv('su.pw'))}" autocomplete="new-password"><button type="button" data-a="togglePw">Show</button></div><div class="strength" aria-hidden="true"><i id="pwbar"></i></div><div class="hint">At least 8 characters, one number, one symbol.</div>${ui.err['su.pw']?`<div class="errmsg">${esc(ui.err['su.pw'])}</div>`:''}</div>
    ${fld('su.pw2',{label:'Confirm password',type:'password',ph:'Password again',auto:'new-password'})}
    <div class="field ${ui.err['su.agree']?'has-err':''}">${chk('su.agree',"I agree to the school's data and privacy policy")}${ui.err['su.agree']?`<div class="errmsg">${esc(ui.err['su.agree'])}</div>`:''}</div>
    <button class="btn pri" style="width:100%" type="submit">Create account</button>
   </form><p style="text-align:center;margin-top:16px" class="muted">Already registered? <a href="#/login"><b>Sign in</b></a></p>`;
  else if(su.stage==='email'||su.stage==='phone'){const em=su.stage==='email';inner=`<h1>${em?'Check your email':'Now check your phone'}</h1><p class="muted" style="text-align:center;margin:6px 0 18px">We sent a 6-digit verification code to <b>${esc(em?su.d.email:su.d.phone)}</b>.</p><form data-submit="code" novalidate>${fld('su.code',{label:'Verification code',ph:'123456',max:6,auto:'one-time-code'})}<p class="hint mb">Enter the 6-digit code to verify your ${em?'email':'phone'}.</p><button class="btn pri" style="width:100%" type="submit">${em?'Verify email':'Verify phone'}</button></form><p class="small" style="text-align:center;margin-top:14px"><span class="muted">Step ${em?1:2} of 2</span></p>`}
  else inner=`<h1>Thanks, you're nearly there</h1><div class="banner ${su.match?'ok':''}" style="margin:16px 0">${su.match?'✓ Your details match the school records. The administrator will approve your account soon.':'▲ Some details don\'t match school records, so the administrator will look at your sign-up and may ask you to correct it.'}</div><p class="muted mb">You'll be able to sign in once your account is approved.</p><a class="btn pri" style="width:100%" href="#/login">Back to sign in</a>`;
  return `<div class="auth"><div class="authbox"><div style="text-align:right;margin-bottom:8px">${themeBtn()}</div><div class="authcard"><div class="logo">${logo().replace(/^<span class="logo">|<\/span>$/g,'')}</div>${inner}</div></div></div>`}
submits.signup=()=>{
  const id=fv('su.id').trim(),email=fv('su.email').trim(),phone=fv('su.phone').trim(),pw=fv('su.pw'),pw2=fv('su.pw2');ui.err={};
  if(!id)ui.err['su.id']='Enter your school ID.';
  if(!/^\S+@\S+\.\S+$/.test(email))ui.err['su.email']='Enter your school email, like name@students.school.edu.';
  if(!/^[+\d][\d\s-]{6,}$/.test(phone))ui.err['su.phone']='Enter a phone number, like +263 77 123 4567.';
  if(pw.length<8||!/\d/.test(pw)||!/[^A-Za-z0-9]/.test(pw))ui.err['su.pw']='Use at least 8 characters, with one number and one symbol.';
  if(pw2!==pw)ui.err['su.pw2']="The passwords don't match.";
  if(!fv('su.agree',false))ui.err['su.agree']='Please agree to the privacy policy to continue.';
  if(Object.keys(ui.err).length)return fail();

  if(AU_CONFIG.USE_BACKEND){
    AuAPI.signup({ id, email, phone, pw, pw2, agree: true }).then(r=>{
      ui.su={stage:'email',d:{id,email,phone,pw}};F['su.code']='';render();
    }).catch(e=>{
      ui.err['su.id']=(e&&e.message)||'Could not register. Please try again.';fail();
    });
    return;
  }
  const ex=S.users.find(u=>u.schoolId===id);
  if(!ui.err['su.id']&&ex&&!['rejected','correction'].includes(ex.status))ui.err['su.id']='There is already an account for this school ID. Try signing in instead.';
  if(Object.keys(ui.err).length)return fail();
  ui.su={stage:'email',d:{id,email,phone,pw}};F['su.code']='';render();
};
submits.code=()=>{
  const su=ui.su;ui.err={};
  const code=fv('su.code').trim();
  if(!code){ui.err['su.code']='Please enter the verification code.';return fail()}

  if(AU_CONFIG.USE_BACKEND){
    AuAPI.verifyCode({ id: su.d.id, email: su.d.email, phone: su.d.phone, pw: su.d.pw, code: code, stage: su.stage }).then(r=>{
      F['su.code']='';
      if(su.stage==='email'){ui.su={stage:'phone',d:su.d};render();return}
      ui.su={stage:'done',match:r.match};render();
    }).catch(e=>{
      ui.err['su.code']=(e&&e.message)||'Verification failed. Check the code and try again.';fail();
    });
    return;
  }
  if(code!==CODE){ui.err['su.code']=`That code isn't right. Check the message and try again. (Prototype code: ${CODE})`;return fail()}
  F['su.code']='';
  if(su.stage==='email'){ui.su={stage:'phone',d:su.d};render();return}
  const d=su.d,rec=S.registry.find(r=>r.schoolId===d.id),issues=[];
  if(!rec)issues.push("This school ID isn't in the school records.");
  else if(rec.email.toLowerCase()!==d.email.toLowerCase())issues.push(`Records list ${rec.email}, but they entered ${d.email}.`);
  S.users=S.users.filter(u=>!(u.schoolId===d.id&&['rejected','correction'].includes(u.status)));
  S.users.push({id:uid('u'),role:'student',name:rec?rec.name:d.email.split('@')[0],schoolId:d.id,email:d.email,phone:d.phone,password:d.pw,year:rec?rec.year:1,programme:rec?rec.programme:'',status:'pending',overall:null,gpas:[],bio:'',skills:[],linkedin:'',github:'',photo:null,signup:{match:!issues.length,issues,at:Date.now()}});
  addLog((rec?rec.name:d.id)+' signed up');save();ui.su={stage:'done',match:!issues.length};render();
};

/* ---------- events ---------- */
document.addEventListener('click',e=>{
  if(e.target.dataset&&e.target.dataset.bd){closeModal();return}
  const el=e.target.closest('[data-a]');if(!el)return;
  const a=actions[el.dataset.a];if(!a)return;e.preventDefault();a(el,e);
});
function readInput(t){return t.type==='checkbox'?t.checked:t.type==='file'?(t.files&&t.files[0]?t.files[0].name:''):t.value}
document.addEventListener('input',e=>{const t=e.target;if(t.dataset&&t.dataset.k){F[t.dataset.k]=readInput(t);if(t.dataset.live&&live[t.dataset.live])live[t.dataset.live]()}});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset&&t.dataset.k){F[t.dataset.k]=readInput(t);if(t.dataset.live&&live[t.dataset.live])live[t.dataset.live]();if(t.dataset.r)render()}});
document.addEventListener('submit',e=>{const f=e.target.closest&&e.target.closest('form[data-submit]');if(f){e.preventDefault();submits[f.dataset.submit](f)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ui.modal)closeModal()});
actions.closeModal=()=>closeModal();
actions.setF=el=>{F[el.dataset.k]=el.dataset.v;render()};
actions.rate=el=>{F[el.dataset.k]=Number(el.dataset.v);render()};
actions.print=()=>{try{window.print()}catch(e){toast("Printing isn't available here. Try opening the page in its own tab.",'bad')}};
actions.copy=el=>{const t=document.getElementById(el.dataset.t);if(!t)return;t.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}toast(ok?'Copied to the clipboard.':'Select the text and copy it with Ctrl+C.')};
actions.photo=el=>{const id=el.dataset.id;const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.onchange=()=>{const f=inp.files&&inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=c.height=160;const x=c.getContext('2d');const s=Math.min(img.width,img.height);x.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,160,160);const u=user(id);if(u){u.photo=c.toDataURL('image/jpeg',.8);save();render();toast('Photo updated.')}};img.src=r.result};r.readAsDataURL(f)};inp.click()};
window.addEventListener('hashchange',()=>{F=Object.assign({},NEXT);NEXT={};ui={err:{}};render();window.scrollTo(0,0)});

/* ---------- render ---------- */
function render(){
  const y=window.scrollY||0;const u=me();const parts=location.hash.replace(/^#/,'').split('/').filter(Boolean);
  document.documentElement.dataset.role=u?u.role:'student';
  if(!u){if(SES){SES=null;saveSes()}
    if(parts[0]!=='signup'&&parts[0]!=='login'){location.replace('#/login');return}
    app.innerHTML=parts[0]==='signup'?signupPage():loginPage();document.title=(parts[0]==='signup'?'Create your account':'Sign in')+' · '+SCHOOL;
  }else{
    if(parts[0]!==u.role){location.replace('#/'+u.role);return}
    app.innerHTML=shell(u,pageFor(u,parts.slice(1)));document.title=SIDE_TITLE[u.role]+' · '+SCHOOL;
  }
  renderModal();
  Object.keys(live).forEach(k=>{try{live[k]()}catch(e){}});
  window.scrollTo(0,ui.focusErr?y:y);
  if(ui.focusErr){ui.focusErr=false;const f=document.querySelector('.has-err input,.has-err select,.has-err textarea');if(f&&f.focus)try{f.focus()}catch(e){}}
}

/* ======================= STUDENT ======================= */
const statusChip=s=>s==='verified'?'<span class="chip ok">✓ Verified</span>':s==='evidence'?'<span class="chip bad">▲ Evidence asked for</span>':'<span class="chip warn">● Waiting to be checked</span>';
function cmtHtml(c){const w=user(c.by);return `<div class="cmt"><b>${esc(w?FNAME(w):'Someone')}:</b> ${esc(c.text)} <span class="muted small">· ${fmtD(c.at)}</span></div>`}

function gpaChart(u){
  const g=u.gpas.map((_,i)=>semGpa(u,i)),n=g.length;
  if(n<2)return '<p class="muted">Your graph appears once you have two semesters of certified grades.</p>';
  const W=640,H=230,L=46,R=26,T=26,B=42,min=Math.min(3.0,Math.floor(Math.min(...g)*2)/2),max=4.0;
  const x=i=>L+(W-L-R)*(i/(n-1)),y=v=>T+(H-T-B)*(1-(v-min)/(max-min));
  let grid='';for(let v=min;v<=max+.001;v+=.5)grid+=`<line class="grid" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end">${v.toFixed(1)}</text>`;
  const pts=g.map((v,i)=>[x(i),y(v)]);
  const yrs=Math.ceil(n/2);let lab='';for(let k=0;k<yrs;k++){const a=2*k,b=Math.min(2*k+1,n-1);lab+=`<text x="${(x(a)+x(b))/2}" y="${H-12}" text-anchor="middle">Year ${k+1}</text>`}
  const best=g.indexOf(Math.max(...g));
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="GPA by semester: ${g.map((v,i)=>`year ${Math.floor(i/2)+1} semester ${i%2+1}, ${v.toFixed(2)}`).join('; ')}">${grid}<polyline class="ln" points="${pts.map(p=>p.join(',')).join(' ')}"/>${pts.map((p,i)=>`<circle class="dot ${i===n-1?'last':''}" cx="${p[0]}" cy="${p[1]}" r="${i===n-1?7:5}"/>`).join('')}<text class="val" x="${pts[n-1][0]}" y="${pts[n-1][1]-14}" text-anchor="middle">${g[n-1].toFixed(2)}</text>${lab}</svg><p class="hint">Each dot is one semester. ${best===n-1?'Your best so far is this one.':`Your best so far was Year ${Math.floor(best/2)+1}, Semester ${best%2+1} (${g[best].toFixed(2)}).`}</p>`;
}

function studentHome(u){
  const n=u.gpas.length,cur=n?semGpa(u,n-1):null,prev=n>1?semGpa(u,n-2):null;
  const acts=myActs(u.id),letters=S.letters.filter(l=>l.sid===u.id);
  const ready=letters.filter(l=>l.status==='ready'&&l.versions.length&&!l.versions[l.versions.length-1].seen);
  const wait=acts.filter(a=>a.status==='waiting').length,ev=acts.filter(a=>a.status==='evidence').length;
  const bits=[];if(ready.length)bits.push(ready.length===1?'a letter is ready to download':`${ready.length} letters are ready to download`);
  if(ev)bits.push(ev===1?'a teacher asked for evidence on one activity':`teachers asked for evidence on ${ev} activities`);
  if(wait)bits.push(wait===1?'one activity is waiting for a teacher to check it':`${wait} activities are waiting for a teacher to check them`);
  const readyL=letters.filter(l=>l.status==='ready'||(l.status==='changes'&&l.versions.length));
  const recent=[...readyL.slice(0,2).map(l=>{const s=user(l.staffId),last=l.versions[l.versions.length-1];return `<div class="item"><span>↓ Your letter from <b>${esc(staffLabel(s))}</b> ${l.status==='changes'?'is being updated':'is ready'}</span><span class="row"><button class="btn sm" data-a="dlLetter" data-id="${l.id}">Download</button>${l.status==='ready'?`<button class="btn sm" data-a="askChange" data-id="${l.id}">Ask for changes</button>`:''}</span></div>`}),
    ...acts.slice().sort((a,b)=>b.created-a.created).slice(0,3).map(a=>`<div class="item"><span>${a.status==='verified'?'✓':a.status==='evidence'?'▲':'●'} ${esc(a.title)} ${a.status==='verified'?'was checked by a teacher':a.status==='evidence'?'needs evidence':'is waiting to be checked'}</span>${statusChip(a.status).replace('● Waiting to be checked','● Waiting').replace('▲ Evidence asked for','▲ Evidence')}</div>`)];
  const ass=S.assess.filter(a=>a.sid===u.id).sort((a,b)=>b.at-a.at)[0],sn=S.notes.filter(x=>x.sid===u.id).sort((a,b)=>b.wk-a.wk)[0];
  return `<div class="hello">${avatar(u,72,true)}<div><h1>Hi, ${esc(first(u.name))} <span aria-hidden="true">– <span class="typer" id="typer">${esc(window.__typerText||'')}</span></span><span class="sr"> Developer, Designer and Student</span></h1><p class="muted">Year ${u.year} · ${esc(u.programme)}</p></div></div>
  ${bits.length?`<div class="banner" role="status">● ${bits.length===1?'1 thing needs':bits.length+' things need'} you: ${bits.join(', and ')}.</div>`:''}
  <section class="intro" aria-label="About me, contact, certifications and skills">
   <div class="card"><div class="row between"><h3>About me</h3><button class="btn sm" data-a="editAbout">Edit</button></div>
    <p>${esc(u.bio)||'<span class="muted">Add a short bio so readers know who you are.</span>'}</p></div>
   <div class="card"><div class="row between"><h3>Contact</h3><button class="btn sm" data-a="editAbout">Edit</button></div>
    <p class="small">Email: ${esc(u.email)}<br>Phone: ${esc(u.phone)||'–'}<br>LinkedIn: ${esc(u.linkedin)||'–'}<br>GitHub: ${esc(u.github)||'–'}</p></div>
   <div class="card wide"><div class="row between"><h3>Certifications &amp; Skills</h3><button class="btn sm" data-a="editAbout">Edit</button></div>
    <h4 class="cert-sub">Skills</h4>
    <div class="tags">${(u.skills||[]).length?u.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join(''):'<span class="muted">No skills added yet.</span>'}</div>
    <h4 class="cert-sub">Certifications</h4>
    ${certsHtml(u,true)}</div>
  </section>
  <h2 class="mt">What would you like to do?</h2>
  <div class="grid g3 mt" style="margin-top:10px"><button class="btn big" data-a="goGrades">See my grades</button><button class="btn big" data-a="goAddAct">Add an activity</button><button class="btn big pri" data-a="goLetter">Ask for a letter</button></div>
  <div class="grid g3 mt">
   <div class="stat"><div class="l">Your GPA this semester</div><div class="n">${cur==null?'–':fmt2(cur)}</div><div class="d" style="color:${prev==null?'var(--muted)':cur>=prev?'var(--ok)':'var(--warn)'}">${prev==null?'Your first certified semester will show here.':`${cur>=prev?'↑ Up':'↓ Down'} from ${fmt2(prev)} last semester`}</div></div>
   <div class="stat"><div class="l">Your overall GPA</div><div class="n">${u.overall==null?'–':fmt2(u.overall)}</div><div class="d" style="color:var(--ok)">${u.overall==null?'':'✓ Official, certified by the school'}</div></div>
   <div class="stat"><div class="l">Your progress to graduation</div><div class="n">${Math.round(creditsDone(u)/120*100)}%</div><div class="bar"><i style="width:${Math.min(100,creditsDone(u)/120*100)}%"></i></div><div class="d muted">${creditsDone(u)} of 120 credits done</div></div>
  </div>
  <div class="card mt"><h3>How your GPA has changed</h3>${gpaChart(u)}<div style="margin-top:8px"><button class="btn sm" data-a="goGrades">See every semester</button></div></div>
  <div class="card mt"><h3>Recent updates</h3>${recent.length?`<div class="list">${recent.join('')}</div>`:'<div class="empty">Nothing yet. Add an activity or a project to get started.</div>'}</div>
  ${F['chg.id']?changePanel():''}
  ${ass||sn?`<div class="card mt"><h3>Feedback and notes</h3><div class="list">${ass?`<div><b>${esc(FNAME(user(ass.by)))}</b> <span class="muted small">· ${fmtD(ass.at)}</span><div class="muted small">Leadership ${ass.r.leadership||'–'} · Teamwork ${ass.r.teamwork||'–'} · Communication ${ass.r.communication||'–'} (out of 5)</div>${ass.feedback?`<p>${esc(ass.feedback)}</p>`:''}</div>`:''}${sn?`<div><b>${esc(user(sn.by).name)}</b> <span class="muted small">· workplace supervisor, week ${sn.wk}</span><p>${esc(sn.text)}</p></div>`:''}</div></div>`:''}`;
}
actions.goGrades=()=>go('/student/grades');
actions.goAddAct=()=>go('/student/activities',{'act.add':true});
actions.goLetter=()=>go('/student/letters');
function changePanel(){
  const l=S.letters.find(x=>x.id===F['chg.id']);if(!l)return '';const s=user(l.staffId),err=ui.err['chg.text'];
  return `<div class="card mt" id="chgpanel"><h3>What would you like changed?</h3><p class="muted small mb">${esc(staffLabel(s))} will see your message and update the letter. Be as specific as you can.</p>
  <div class="field ${err?'has-err':''}"><textarea data-k="chg.text" data-live="chgcount" rows="3" maxlength="600" aria-label="What would you like changed" placeholder="For example: please mention my final-year project and how I led the team.">${esc(fv('chg.text'))}</textarea>${err?`<div class="errmsg">${esc(err)}</div>`:''}<div class="hint" style="text-align:right"><span id="live-chgcount">${fv('chg.text').length}</span> / 600</div></div>
  <div class="row"><button class="btn pri" data-a="sendChange">Send request</button><button class="btn" data-a="cancelChange">Cancel</button></div>
  <p class="hint mt">You can still download the current version while you wait. You can ask for changes up to 2 times per letter (${l.changesUsed} used).</p></div>`}
live.chgcount=()=>{const el=document.getElementById('live-chgcount');if(el)el.textContent=fv('chg.text').length};
actions.askChange=el=>{const l=S.letters.find(x=>x.id===el.dataset.id);if(l.changesUsed>=2){toast("You've used both change requests for this letter. Please contact the staff member directly.",'bad');return}F['chg.id']=l.id;F['chg.text']='';ui.err={};render();setTimeout(()=>{const p=document.getElementById('chgpanel');if(p&&p.scrollIntoView)p.scrollIntoView({behavior:'smooth',block:'center'})},30)};
actions.cancelChange=()=>{delete F['chg.id'];delete F['chg.text'];ui.err={};render()};
actions.sendChange=()=>{const l=S.letters.find(x=>x.id===F['chg.id']),t=fv('chg.text').trim();if(!t){ui.err['chg.text']='Write what you would like changed before sending.';return fail()}
  l.status='changes';l.changesUsed++;l.changeRequests.push({text:t,at:Date.now()});l.draft='';save();delete F['chg.id'];delete F['chg.text'];ui.err={};render();toast('Request sent. You can still download the current version while you wait.')};
actions.dlLetter=el=>{const l=S.letters.find(x=>x.id===el.dataset.id),v=l.versions[l.versions.length-1];v.seen=true;save();render();openModal('Your letter',()=>letterDocHtml(l,v),{wide:true})};
function letterDocHtml(l,v){const st=user(l.sid),sf=user(l.staffId);return `<div class="doc"><div class="dm">${esc(SCHOOL)} · ${esc(sf.dept)}</div><h2>Recommendation letter</h2><div class="dm">For ${esc(st.name)} (${esc(st.schoolId)}) · ${esc(l.purpose)} · Version ${v.n}, signed ${fmtDL(v.sent)}</div><p>${esc(v.body)}</p></div><div class="row noprint mt"><button class="btn pri" data-a="print">Print or save as PDF</button><button class="btn" data-a="closeModal">Close</button></div><p class="hint noprint mt">In the live system this downloads as a PDF. Here, use "Print or save as PDF" in your browser.</p>`}

/* grades */
function gradesPage(u){
  const n=u.gpas.length,defY=n?Math.ceil(n/2):1,defS=n?((n-1)%2)+1:1;
  const y=Number(fv('gr.y',defY)),s=Number(fv('gr.s',defS)),i=(y-1)*2+(s-1);
  let body;
  if(i>=n){body=`<div class="empty">${y>u.year||i>=n?`Year ${y}, Semester ${s} hasn't been certified yet. Grades appear here once the registry office has entered them.`:''}</div>`}
  else{const c=courses(u,i),g=semGpa(u,i);body=`<div class="card"><div class="row between"><div><div class="muted">GPA for Year ${y}, Semester ${s}</div><div style="font-size:2.2rem;font-weight:700;line-height:1.2">${fmt2(g)}</div><div style="color:var(--ok)">✓ Certified by the registrar, ${i===n-1?'Jun 2026':'on completion of the semester'}</div></div><div class="muted">${CREDITS[i]} credits this semester</div></div>
   <div class="tw mt"><table><thead><tr><th>Course</th><th class="c">Credits</th><th class="c">Grade</th><th class="c">Points (out of 4.0)</th></tr></thead><tbody>${c.map(x=>`<tr><td><b>${esc(x.name)}</b><div class="muted small">${esc(x.code)}</div></td><td class="c">${x.credits}</td><td class="c"><b>${x.grade}</b></td><td class="c">${x.points.toFixed(1)}</td></tr>`).join('')}</tbody></table></div></div>`}
  return `${crumbs([['Home','/student'],['My grades']])}<div class="pagehead"><div><h1>My grades</h1><p class="sub">Every grade from Year 1 to the final year, in one place.</p></div><button class="btn" data-a="transcript">Download official transcript</button></div>
  <div class="grid g2"><div class="stat"><div class="l">Your overall GPA</div><div class="n">${u.overall==null?'–':fmt2(u.overall)}</div><div class="d" style="color:var(--ok)">✓ Official, certified by the school</div></div><div class="stat"><div class="l">Credits earned</div><div class="n">${creditsDone(u)} <span class="muted" style="font-size:1rem">of 120</span></div></div></div>
  <div class="mt"><div class="muted small" style="margin-bottom:6px">Choose a year</div>${tabs('gr.y',[1,2,3,4].map(k=>[k,'Year '+k]),defY)}${tabs('gr.s',[[1,'Semester 1'],[2,'Semester 2']],defS)}</div>
  ${body}
  <p class="hint mt">Grades are entered by the registry office and you can't change them. Think a grade is wrong? <a href="mailto:registry@school.edu">Contact the registry office</a>.</p>`}
actions.transcript=()=>{const u=me();openModal('Official transcript',()=>`<div class="doc"><div class="dm">${esc(SCHOOL)} · Registry office</div><h2>Official transcript</h2><div class="dm">${esc(u.name)} · ${esc(u.schoolId)} · ${esc(u.programme)}</div><p style="white-space:normal"><b>Overall GPA ${fmt2(u.overall)}</b> · ${creditsDone(u)} of 120 credits · certified by the registrar</p>${u.gpas.map((_,i)=>`<h3 style="margin-top:14px">Year ${Math.floor(i/2)+1}, Semester ${i%2+1} · GPA ${fmt2(semGpa(u,i))}</h3><table><tbody>${courses(u,i).map(c=>`<tr><td>${esc(c.code)}</td><td>${esc(c.name)}</td><td>${c.credits}</td><td>${c.grade}</td></tr>`).join('')}</tbody></table>`).join('')}</div><div class="row noprint mt"><button class="btn pri" data-a="print">Print or save as PDF</button><button class="btn" data-a="closeModal">Close</button></div>`,{wide:true})};

/* projects */
function projectsPage(u){
  const ps=myProjects(u.id),n=ps.length;
  const full=p=>`<div class="card"><div class="row between"><div><h3 style="margin:0">${esc(p.name)}</h3><div class="muted small">${esc(p.kind)}</div></div><button class="btn sm" data-a="editProj" data-id="${p.id}">Edit</button></div>
   <div class="grid g2 mt" style="margin-top:12px"><div><b>Goal</b><p>${esc(p.goal)||'<span class="muted">Not added yet.</span>'}</p></div><div><b>Challenge and what I did</b><p>${esc(p.challenge)||'<span class="muted">Not added yet.</span>'}</p></div><div><b>My role</b><p>${esc(p.role)||'<span class="muted">Not added yet.</span>'}</p></div><div><b>Result</b><p>${esc(p.result)||'<span class="muted">Not added yet.</span>'}</p></div></div>
   ${projLinks(p)}</div>`;
  const open=fv('pr.open','');
  return `${crumbs([['Home','/student'],['My projects']])}<div class="pagehead"><div><h1>My projects</h1><p class="sub">Show your best work. Three to six strong projects work better than lots of small ones. Your supervisor and lecturers can see this page.</p></div><button class="btn pri" data-a="newProj">+ Add a project</button></div>
  <div class="row mb"><span class="chip ${n>=3&&n<=6?'ok':'warn'}">${n} of 6 projects ${n>=3&&n<=6?'✓ A good number':n<3?'· Aim for at least 3':''}</span></div>
  ${n?`<div class="tabs" role="group" aria-label="Filter projects">${PCATS.map(([v,l])=>`<button type="button" data-a="projFilter" data-v="${v}" aria-pressed="${fv('pr.cat','all')===v}">${l}</button>`).join('')}</div><div class="stack">${ps.map((p,i)=>`<div class="pfilter" data-category="${projCat(p)}">${i<2||open===p.id?full(p):`<div class="card"><div class="item"><div><b>${i+1+1-1}. ${esc(p.name)}</b><div class="muted small">${esc(p.kind)}</div></div><span class="row"><button class="btn sm" data-a="openProj" data-id="${p.id}">Open</button><button class="btn sm" data-a="editProj" data-id="${p.id}">Edit</button></span></div></div>`}</div>`).join('')}</div><div class="empty" id="pfEmpty" hidden>No projects in this group yet.</div>`:'<div class="empty">No projects yet. Add your first one to show what you can do.</div>'}`}
function projLinks(p){const lv=link(p.live),cd=link(p.code);if(!lv&&!cd)return '';return `<div class="row mt">${lv?`<a class="btn sm" href="${esc(lv)}" target="_blank" rel="noopener">Open live version</a>`:''}${cd?`<a class="btn sm" href="${esc(cd)}" target="_blank" rel="noopener">View code</a>`:''}</div>`}
actions.openProj=el=>{F['pr.open']=el.dataset.id;render()};
actions.newProj=()=>{if(!need('add_projects'))return;if(myProjects(me().id).length>=6){toast('You have 6 projects, which is the most we show. Remove one to add another.','bad');return}go('/student/projects/new')};
actions.editProj=el=>go('/student/projects/edit/'+el.dataset.id);
/* ---------- certifications and skills ---------- */
const CERT_MAX=6,CERT_TYPES=['image/jpeg','image/png'];
const CERT_ICON='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><circle cx="12" cy="10" r="2.6"/><path d="M9.5 17l-1 4 3.5-2 3.5 2-1-4"/></svg>';
function certsHtml(u,mine){const c=u.certs||[];
  if(!c.length)return `<p class="muted small">${mine?'No certifications yet. Choose Edit to add a certificate image, who issued it and a link to verify it.':'No certifications added.'}</p>`;
  return `<ul class="certs">${c.map(x=>{const lk=link(x.url);
    const thumb=x.img?`<button type="button" class="cert-thumb" data-a="viewCert" data-id="${esc(x.id)}" data-sid="${esc(u.id)}" aria-label="View certificate: ${esc(x.name)}"><img src="${x.img}" alt="Certificate image for ${esc(x.name)}"></button>`:`<div class="cert-thumb ph" aria-hidden="true">${CERT_ICON}</div>`;
    return `<li class="cert">${thumb}<div class="cert-body"><b>${esc(x.name)}</b><div class="muted small">${x.issuer?'Issued by '+esc(x.issuer):'Issuer not added'}</div>${lk?`<a class="btn sm" href="${esc(lk)}" target="_blank" rel="noopener noreferrer">Verify credential ↗</a>`:''}</div></li>`}).join('')}</ul>`}
actions.viewCert=el=>{const s=user(el.dataset.sid),c=s&&(s.certs||[]).find(x=>x.id===el.dataset.id);if(!c)return;const lk=link(c.url);
  openModal(c.name,()=>`<img class="cert-full" src="${c.img}" alt="Certificate image for ${esc(c.name)}"><p class="mt">${c.issuer?'Issued by <b>'+esc(c.issuer)+'</b>':'<span class="muted">Issuer not added</span>'}</p><div class="row">${lk?`<a class="btn sm pri" href="${esc(lk)}" target="_blank" rel="noopener noreferrer">Verify credential ↗</a>`:''}<button class="btn sm" data-a="closeModal">Close</button></div>`,{wide:true})};
function certEditHtml(){const d=F['ab.certs']||[];
  if(!d.length)return '<p class="muted small">No certifications yet.</p>';
  return d.map((c,i)=>{const err=ui.err['ab.c'+i],id='cert'+i;
   return `<div class="certedit ${err?'has-err':''}"><div class="certedit-top"><div class="cert-thumb ${c.img?'':'ph'}">${c.img?`<img src="${c.img}" alt="Preview of the certificate image">`:CERT_ICON}</div>
    <div class="grow"><label for="${id}_img">Certificate image (JPEG or PNG)</label><input id="${id}_img" type="file" accept="image/jpeg,image/png" data-cimg="${i}">${c.img?`<button type="button" class="linkbtn small" data-a="rmCertImg" data-i="${i}">Remove image</button>`:''}</div></div>
    <div class="field"><label for="${id}_n">Certification name</label><input id="${id}_n" type="text" maxlength="80" value="${esc(c.name)}" data-ci="${i}" data-cf="name" placeholder="For example: AWS Cloud Practitioner"${err&&!(c.name||'').trim()?' aria-invalid="true"':''}></div>
    <div class="field"><label for="${id}_o">Issuing body</label><input id="${id}_o" type="text" maxlength="80" value="${esc(c.issuer)}" data-ci="${i}" data-cf="issuer" placeholder="For example: Amazon Web Services"></div>
    <div class="field"><label for="${id}_u">Credential or verification link (optional)</label><input id="${id}_u" type="url" inputmode="url" value="${esc(c.url)}" data-ci="${i}" data-cf="url" placeholder="https://"></div>
    ${err?`<div class="errmsg" role="alert">${esc(err)}</div>`:''}
    <button type="button" class="btn sm danger" data-a="rmCert" data-i="${i}">Remove this certification</button></div>`}).join('')}
function refreshCerts(){const c=document.getElementById('certlist');if(c)c.innerHTML=certEditHtml();const b=document.getElementById('addcert');if(b)b.disabled=(F['ab.certs']||[]).length>=CERT_MAX}
function certImage(file,cb){
  if(CERT_TYPES.indexOf(file.type)<0){toast('Please choose a JPEG or PNG image of the certificate.','bad');return cb(null)}
  if(file.size>10*1024*1024){toast('That image is over 10 MB. Please choose a smaller one.','bad');return cb(null)}
  const r=new FileReader(),bad=()=>{toast('That image could not be read. Try a different file.','bad');cb(null)};
  r.onerror=bad;r.onload=()=>{const img=new Image();img.onerror=bad;img.onload=()=>{const k=Math.min(1,800/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*k));c.height=Math.max(1,Math.round(img.height*k));const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.82))};img.src=r.result};
  r.readAsDataURL(file)}
document.addEventListener('input',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.cf){const d=F['ab.certs'],i=Number(t.dataset.ci);if(d&&d[i])d[i][t.dataset.cf]=t.value}});
document.addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset||t.dataset.cimg===undefined)return;const i=Number(t.dataset.cimg),f=t.files&&t.files[0];if(!f)return;
  certImage(f,data=>{const d=F['ab.certs'];if(data&&ui.modal&&d&&d[i]){d[i].img=data;delete ui.err['ab.c'+i];refreshCerts()}else t.value=''})});
actions.addCert=()=>{const d=F['ab.certs']=F['ab.certs']||[];if(d.length>=CERT_MAX){toast('You can add up to '+CERT_MAX+' certifications. Remove one to add another.','bad');return}
  d.push({id:uid('c'),name:'',issuer:'',url:'',img:''});refreshCerts();const el=document.getElementById('cert'+(d.length-1)+'_n');if(el){el.focus();if(el.scrollIntoView)el.scrollIntoView({block:'center'})}};
actions.rmCert=el=>{const d=F['ab.certs'];if(!d)return;d.splice(Number(el.dataset.i),1);Object.keys(ui.err).forEach(k=>{if(/^ab\.c\d/.test(k))delete ui.err[k]});refreshCerts()};
actions.rmCertImg=el=>{const d=F['ab.certs'],i=Number(el.dataset.i);if(d&&d[i]){d[i].img='';refreshCerts()}};
actions.editAbout=()=>{const u=me();F['ab.bio']=u.bio;F['ab.skills']=(u.skills||[]).join(', ');F['ab.phone']=u.phone;F['ab.li']=u.linkedin;F['ab.gh']=u.github;F['ab.certs']=(u.certs||[]).map(c=>Object.assign({},c));ui.err={};
  openModal('Edit about me, skills and contact',()=>`${fld('ab.bio',{label:'Short bio',ta:true,rows:4,max:400,hint:'Two or three sentences about what you do and what you want next.'})}${fld('ab.skills',{label:'Skills',hint:'Separate with commas.'})}
   <h3 class="cert-sub">Certifications</h3><p class="hint mb">Up to ${CERT_MAX}. Add a JPEG or PNG photo of each certificate, its name, who issued it and a link where someone can check it.</p>
   <div id="certlist">${certEditHtml()}</div><div class="mb"><button type="button" class="btn sm" id="addcert" data-a="addCert" ${(F['ab.certs']||[]).length>=CERT_MAX?'disabled':''}>+ Add a certification</button></div>
   ${fld('ab.phone',{label:'Phone'})}${fld('ab.li',{label:'LinkedIn'})}${fld('ab.gh',{label:'GitHub'})}<div class="row"><button class="btn pri" data-a="saveAbout">Save</button><button class="btn" data-a="closeModal">Cancel</button></div>`,{wide:true})};
actions.saveAbout=()=>{if(!need('add_projects'))return;const u=me(),out=[];let bad=false;
  Object.keys(ui.err).forEach(k=>{if(/^ab\.c\d/.test(k))delete ui.err[k]});
  (F['ab.certs']||[]).forEach((c,i)=>{const name=(c.name||'').trim(),issuer=(c.issuer||'').trim(),url=(c.url||'').trim();
    if(!name&&!issuer&&!url&&!c.img)return;
    if(!name){ui.err['ab.c'+i]='Add the name of this certification, or remove it.';bad=true;return}
    let lk='';if(url){lk=link(url);if(!lk){ui.err['ab.c'+i]='That link does not look right. Paste the full web address, like https://example.com/verify/123.';bad=true;return}}
    out.push({id:c.id,name,issuer,url:lk,img:c.img||''})});
  if(bad){renderModal();const er=document.querySelector('#modal .errmsg');if(er&&er.scrollIntoView)er.scrollIntoView({block:'center'});return}
  const prev={bio:u.bio,skills:u.skills,phone:u.phone,linkedin:u.linkedin,github:u.github,certs:u.certs};
  u.bio=fv('ab.bio').trim();u.skills=fv('ab.skills').split(',').map(x=>x.trim()).filter(Boolean).slice(0,12);u.phone=fv('ab.phone').trim();u.linkedin=fv('ab.li').trim();u.github=fv('ab.gh').trim();u.certs=out;
  try{if(AU_CONFIG.USE_BACKEND)AuAPI.pushState(S);else localStorage.setItem(KEY,JSON.stringify(S))}catch(err){let quota=false;try{localStorage.setItem(KEY+'.t','1');localStorage.removeItem(KEY+'.t');quota=true}catch(e2){}
    if(quota){Object.assign(u,prev);toast('There is not enough browser storage for these certificate images. Remove an image or use smaller files, then save again.','bad');return}}
  closeModal();render();toast('Your profile is saved.')};
const PFIELDS=[['goal','Goal'],['challenge','Problems and how you solved them'],['role','Your role'],['result','Result with numbers'],['live','Link to the live version'],['code','Link to the code']];
live.projCheck=()=>{const el=document.getElementById('live-projCheck');if(!el)return;const done=PFIELDS.filter(([k])=>fv('pj.'+k).trim()).length;el.innerHTML=`<div class="muted mb"><b>${done} of 6</b> things filled in</div>`+PFIELDS.map(([k,l])=>`<div>${fv('pj.'+k).trim()?'<span style="color:var(--ok)">✓</span>':'<span style="color:var(--warn)">●</span>'} ${l}</div>`).join('')+(done===6?'<div class="chip ok mt">✓ A strong project</div>':'')};
function projectForm(u,id){
  const p=id?S.projects.find(x=>x.id===id&&x.sid===u.id):null;if(id&&!p)return '<div class="empty">That project was not found. <a href="#/student/projects">Back to my projects</a></div>';
  const d=p||{};
  return `${crumbs([['Home','/student'],['My projects','/student/projects'],[p?'Edit project':'Add a project']])}<h1 class="mb">${p?'Edit project':'Add a project'}</h1>
  <div class="grid g21"><div class="card"><form data-submit="saveProj" data-id="${id||''}" novalidate>
   ${fld('pj.name',{label:'Project name',def:d.name,ph:'Library catalogue search',max:80})}
   ${selF('pj.kind',['Class project','Personal build','Freelance','Attachment','Final-year project','Hackathon'].map(k=>[k,k]),{label:'What kind of project is it?',def:(d.kind||'Class project').split(' · ')[0]})}
   ${fld('pj.goal',{label:'What was the goal?',ta:true,def:d.goal,lv:'projCheck',ph:'Help students find books faster than the old card list.'})}
   ${fld('pj.challenge',{label:'What problems did you hit, and how did you fix them?',ta:true,rows:4,def:d.challenge,lv:'projCheck',hint:'Explain why you made your choices, not only what you built.'})}
   ${fld('pj.role',{label:'What was your role?',ta:true,def:d.role,lv:'projCheck',hint:'If it was a team project, say what you did.'})}
   ${fld('pj.result',{label:'What was the result?',ta:true,def:d.result,lv:'projCheck',hint:'Numbers help, for example time saved or people who used it.'})}
   ${fld('pj.live',{label:'Link to the live version',def:d.live,lv:'projCheck',ph:'https://'})}
   ${fld('pj.code',{label:'Link to the code (GitHub)',def:d.code,lv:'projCheck',ph:'https://github.com/'})}
   <div class="row"><button class="btn pri" type="submit">Save project</button><a class="btn" href="#/student/projects">Cancel</a>${p?`<button type="button" class="btn danger" data-a="delProj" data-id="${p.id}">Remove project</button>`:''}</div>
  </form></div>
  <div class="stack"><div class="card"><h3>How strong is this project?</h3><div id="live-projCheck"></div></div><div class="card tint"><h3>Tips</h3><p class="small">Pick work that matches the job you want. Explain your thinking. Show what changed because of your work. Say exactly what you did.</p></div></div></div>`}
// prefill the live checklist from saved values when editing
const _pc=live.projCheck;live.projCheck=()=>{const parts=location.hash.split('/');const id=parts[4];const p=id&&S.projects.find(x=>x.id===id);if(p)PFIELDS.forEach(([k])=>{if(F['pj.'+k]===undefined)F['pj.'+k]=p[k]||''});_pc()};
submits.saveProj=f=>{if(!need('add_projects'))return;const u=me(),id=f.dataset.id,name=fv('pj.name',id&&S.projects.find(x=>x.id===id)?.name).trim();ui.err={};
  if(!name){ui.err['pj.name']='Give your project a name.';return fail()}
  const old=id?S.projects.find(x=>x.id===id):null;const g=k=>(F['pj.'+k]!==undefined?F['pj.'+k]:(old?old[k]:'')).trim();
  const kind=fv('pj.kind',old?old.kind.split(' · ')[0]:'Class project');
  const o={sid:u.id,name,kind:kind+' · '+(old&&old.kind.split(' · ')[1]||'Solo'),goal:g('goal'),challenge:g('challenge'),role:g('role'),result:g('result'),live:g('live'),code:g('code')};
  if(old)Object.assign(old,o);else S.projects.push(Object.assign({id:uid('p'),comments:[]},o));
  save();go('/student/projects');toast('Project saved.')};
actions.delProj=el=>openModal('Remove this project?',()=>`<p class="mb">This takes it off your portfolio. Supervisors and lecturers will no longer see it.</p><div class="row"><button class="btn danger" data-a="delProjYes" data-id="${el.dataset.id}">Remove project</button><button class="btn" data-a="closeModal">Keep it</button></div>`);
actions.delProjYes=el=>{S.projects=S.projects.filter(p=>p.id!==el.dataset.id);save();closeModal();go('/student/projects');toast('Project removed.')};

/* activities */
function activitiesPage(u){
  const all=myActs(u.id),ft=fv('act.ft','all'),fy=fv('act.fy','all');
  const list=all.filter(a=>(ft==='all'||a.type===ft)&&(fy==='all'||a.year===Number(fy))).sort((a,b)=>b.year-a.year||b.created-a.created);
  const cnt=t=>all.filter(a=>a.type===t).length,ver=all.filter(a=>a.status==='verified').length;
  const add=fv('act.add',false);
  return `${crumbs([['Home','/student'],['My activities']])}<div class="pagehead"><div><h1>My activities</h1><p class="sub">${all.length} ${all.length===1?'entry':'entries'} in total, ${ver} checked by a teacher.</p></div><button class="btn pri" data-a="toggleAdd">+ Add an activity</button></div>
  ${add?activityForm(u):''}
  <div class="row between"><div class="tabs">${[['all',`Everything (${all.length})`],['achievement',`Achievements (${cnt('achievement')})`],['leadership',`Leadership (${cnt('leadership')})`],['extra',`Extracurricular (${cnt('extra')})`]].map(([v,l])=>`<button data-a="setF" data-k="act.ft" data-v="${v}" aria-pressed="${ft===v}">${l}</button>`).join('')}</div>
   <div style="min-width:140px">${selF('act.fy',[['all','All years'],...[1,2,3,4].map(y=>[y,'Year '+y])],{r:1})}</div></div>
  ${list.length?`<div class="stack">${list.map(a=>`<div class="card"><div class="item"><div class="row" style="flex-wrap:nowrap"><span class="chip info" aria-hidden="true" style="width:34px;height:34px;padding:0;justify-content:center;border-radius:10px">${{achievement:'T',leadership:'L',extra:'E'}[a.type]}</span><div><b>${esc(a.title)}</b><div class="muted small">${TYPES[a.type]} · Year ${a.year}${a.where?' · '+esc(a.where):''}${a.evidence?' · Evidence: '+esc(a.evidence):''}</div></div></div><div class="row">${statusChip(a.status)}</div></div>
    ${a.comments.length?`<div class="stack mt" style="gap:6px">${a.comments.map(cmtHtml).join('')}</div>`:''}
    ${a.status==='evidence'?`<div class="row mt"><button class="btn sm pri" data-a="addEvidence" data-id="${a.id}">Add evidence</button></div>`:''}
    ${a.status!=='verified'?`<div class="row mt"><button class="btn sm" data-a="delAct" data-id="${a.id}">Remove entry</button></div>`:''}</div>`).join('')}</div>`:`<div class="empty">${all.length?'Nothing matches this filter. Try Everything or a different year.':'No activities yet. Add your first achievement, leadership role or club.'}</div>`}
  <div class="row mt2"><button class="btn" data-a="printRecord">Print or save my record</button></div>`}
function activityForm(u){
  return `<div class="card mb"><h3>Add an activity</h3><form data-submit="saveAct" novalidate><div class="grid g2">
   ${selF('act.type',[['achievement','School achievement'],['leadership','Leadership role'],['extra','Extracurricular']],{label:'What kind is it?'})}
   ${selF('act.year',[1,2,3,4].filter(y=>y<=Math.max(u.year,1)).map(y=>[y,y]),{label:'Which year?',def:u.year})}</div>
   ${fld('act.title',{label:'What is it called?',ph:'Debate society captain'})}
   ${fld('act.where',{label:'Where or what role? (optional)',ph:"Students' union, 2 hours a week"})}
   <div class="field"><label for="act_cert">Attach a certificate (optional)</label><input id="act_cert" type="file" data-k="act.cert" accept="image/*,.pdf"><div class="hint">${fv('act.cert')?'Attached: '+esc(fv('act.cert')):'A photo or PDF works.'}</div></div>
   <div class="row"><button class="btn pri" type="submit">Save activity</button><button type="button" class="btn" data-a="toggleAdd">Cancel</button></div>
   <p class="hint mt">A teacher will check it before it shows as verified.</p></form></div>`}
actions.toggleAdd=()=>{F['act.add']=!fv('act.add',false);ui.err={};render()};
submits.saveAct=()=>{if(!need('add_acts'))return;const u=me(),t=fv('act.title').trim();ui.err={};if(!t){ui.err['act.title']='Give this activity a name.';return fail()}
  S.acts.push({id:uid('a'),sid:u.id,type:fv('act.type','achievement'),year:Number(fv('act.year',u.year)),title:t,where:fv('act.where').trim(),status:'waiting',created:Date.now(),evidence:fv('act.cert'),comments:[]});
  save();['act.title','act.where','act.cert'].forEach(k=>delete F[k]);F['act.add']=false;render();toast('Saved. A teacher will check it soon.')};
actions.delAct=el=>{S.acts=S.acts.filter(a=>a.id!==el.dataset.id);save();render();toast('Entry removed.')};
actions.addEvidence=el=>{F['ev.id']=el.dataset.id;F['ev.name']='';openModal('Add evidence',()=>`<p class="mb">Attach a certificate, letter or photo that shows this entry is true.</p><div class="field ${ui.err['ev.name']?'has-err':''}"><input type="file" data-k="ev.name" accept="image/*,.pdf" aria-label="Evidence file">${ui.err['ev.name']?`<div class="errmsg">${esc(ui.err['ev.name'])}</div>`:''}</div><div class="row"><button class="btn pri" data-a="saveEvidence">Send evidence</button><button class="btn" data-a="closeModal">Cancel</button></div>`)};
actions.saveEvidence=()=>{const a=S.acts.find(x=>x.id===F['ev.id']);if(!fv('ev.name')){ui.err['ev.name']='Choose a file to attach first.';renderModal();return}a.evidence=fv('ev.name');a.status='waiting';a.created=Date.now();ui.err={};save();closeModal();render();toast('Evidence sent. A teacher will check it again.')};
actions.printRecord=()=>{const u=me();openModal('My portfolio record',()=>`<div class="doc"><div class="dm">${esc(SCHOOL)}</div><h2>${esc(u.name)}</h2><div class="dm">${esc(u.schoolId)} · Year ${u.year} · ${esc(u.programme)} · Overall GPA ${fmt2(u.overall)} (certified)</div>
  ${Object.keys(TYPES).map(t=>`<h3 style="margin-top:16px">${TYPES[t]}</h3>${myActs(u.id).filter(a=>a.type===t).map(a=>`<div>${a.status==='verified'?'✓':'○'} ${esc(a.title)} · Year ${a.year}${a.where?' · '+esc(a.where):''} <span class="dm">(${a.status==='verified'?'verified':'not yet verified'})</span></div>`).join('')||'<div class="dm">None yet.</div>'}`).join('')}
  <h3 style="margin-top:16px">Projects</h3>${myProjects(u.id).map(p=>`<div><b>${esc(p.name)}</b> <span class="dm">${esc(p.kind)}</span> ${esc(p.result)}</div>`).join('')||'<div class="dm">None yet.</div>'}</div><div class="row noprint mt"><button class="btn pri" data-a="print">Print or save as PDF</button><button class="btn" data-a="closeModal">Close</button></div>`,{wide:true})};

/* letters */
const LSTATUS={waiting:['info','● Waiting for a reply'],accepted:['info','✎ Being written'],ready:['ok','✓ Ready to download'],declined:['bad','✕ Not available'],changes:['warn','✎ Being updated']};
function lettersPage(u){
  const mine=S.letters.filter(l=>l.sid===u.id).sort((a,b)=>b.created-a.created);
  const staffOpts=[['','Choose a staff member'],...S.users.filter(x=>x.role==='staff'&&x.status==='active').map(x=>[x.id,`${staffLabel(x)}, ${x.dept}`])];
  return `${crumbs([['Home','/student'],['My letters']])}<div class="pagehead"><div><h1>My letters</h1></div></div>
  <div class="banner info mb">ⓘ You can still download your finished letters after you graduate. Just sign in with your school email.</div>
  <div class="card"><h3>Ask for a new letter</h3><form data-submit="askLetter" novalidate><div class="grid g2">
   ${selF('lt.staff',staffOpts,{label:'Who would you like to ask?'})}${selF('lt.purpose',['Job application','Internship','Scholarship','Further study','Other'],{label:'What is the letter for?'})}</div>
   ${fld('lt.due',{label:'When do you need it by?',type:'date',min:todayISO(),hint:'Give your writer at least two weeks.'})}
   ${fld('lt.note',{label:"Anything you'd like them to mention? (optional)",ta:true,ph:"I'm applying for a software internship..."})}
   <div class="field"><label>What can your writer see?</label>${chk('lt.s.grades','My grades',true)}${chk('lt.s.ach','My achievements',true)}${chk('lt.s.lead','My leadership roles',true)}${chk('lt.s.extra','My extracurricular activities',true)}</div>
   <button class="btn pri" type="submit">Send request</button></form></div>
  <div class="sect"><h2>My requests</h2>${mine.length?`<div class="stack">${mine.map(l=>{const s=user(l.staffId),st=LSTATUS[l.status],last=l.versions[l.versions.length-1];return `<div class="card"><div class="item"><div><b>${esc(staffLabel(s))}</b><div class="muted small">${esc(s.dept)} · ${esc(l.purpose)} · needed by ${fmtD(l.due)}</div></div><span class="chip ${st[0]}">${st[1]}</span></div>
   ${l.status==='declined'?`<div class="cmt mt"><b>Reply:</b> ${esc(l.reply)}</div><div class="row mt"><button class="btn sm" data-a="askElse" data-id="${l.id}">Ask someone else</button></div>`:''}
   ${last&&(l.status==='ready'||l.status==='changes')?`<div class="row mt"><button class="btn sm pri" data-a="dlLetter" data-id="${l.id}">Download letter${l.versions.length>1?' (version '+last.n+')':''}</button>${l.status==='ready'?`<button class="btn sm" data-a="askChange" data-id="${l.id}" ${l.changesUsed>=2?'disabled':''}>Ask for changes</button>`:''}</div><p class="hint mt">${l.status==='changes'?'You asked for changes. You can still download the current version while you wait.':''} You can ask for changes up to 2 times (${l.changesUsed} used).${l.changesUsed>=2?' For more changes, please contact the staff member directly.':''}</p>`:''}</div>`}).join('')}</div>`:'<div class="empty">No requests yet. Choose a staff member above to ask for your first letter.</div>'}</div>
  ${F['chg.id']?changePanel():''}`}
submits.askLetter=()=>{if(!need('ask_letter'))return;const u=me();ui.err={};const sid=fv('lt.staff'),due=fv('lt.due');
  if(!sid)ui.err['lt.staff']='Choose who you would like to ask.';
  if(!due)ui.err['lt.due']='Choose the date you need the letter by.';else if(new Date(due+'T23:59:59')<new Date())ui.err['lt.due']='Choose a date that is today or later.';
  if(Object.keys(ui.err).length)return fail();
  const g=k=>F['lt.s.'+k]!==undefined?F['lt.s.'+k]:true;
  S.letters.push({id:uid('l'),sid:u.id,staffId:sid,purpose:fv('lt.purpose','Job application'),due:new Date(due+'T12:00:00').getTime(),note:fv('lt.note').trim(),share:{grades:g('grades'),ach:g('ach'),lead:g('lead'),extra:g('extra')},status:'waiting',reply:'',versions:[],changeRequests:[],changesUsed:0,draft:'',created:Date.now()});
  save();['lt.staff','lt.due','lt.note'].forEach(k=>delete F[k]);render();toast('Request sent. You will see the reply here.')};
actions.askElse=el=>{const l=S.letters.find(x=>x.id===el.dataset.id);F['lt.purpose']=l.purpose;F['lt.note']=l.note;F['lt.staff']='';render();setTimeout(()=>{const e=document.getElementById('f_lt_staff');if(e){e.scrollIntoView&&e.scrollIntoView({block:'center'});e.focus()}},30)};

/* ======================= STAFF ======================= */
const taught=u=>(u.teaches||[]).map(user).filter(s=>s&&s.status==='active');
const teaches=(u,sid)=>(u.teaches||[]).includes(sid);
function studentRow(s,base,btn){return `<div class="item"><div class="row" style="flex-wrap:nowrap">${avatar(s,44)}<div><b>${esc(s.name)}</b><div class="muted small">${esc(s.schoolId)} · Year ${s.year} · ${esc(s.programme)}</div></div></div><a class="btn sm" href="#${base}/${s.schoolId}">${btn||'Open portfolio'}</a></div>`}
function studentListHtml(list,base,q,limit){
  const t=(q||'').trim().toLowerCase();const m=t?list.filter(s=>s.name.toLowerCase().includes(t)||s.schoolId.toLowerCase().includes(t)):list;
  const shown=limit&&!t?m.slice(0,limit):m;
  if(!m.length)return `<div class="empty">${t?`No student matches "${esc(q)}". Check the spelling or try the school ID, like 2023-0148.`:'No students are linked to you yet.'}</div>`;
  return `<div class="list">${shown.map(s=>studentRow(s,base)).join('')}</div><p class="hint mt">Showing ${shown.length} of ${list.length} ${list.length===1?'student':'students'}.${shown.length<m.length||t?'':' Search to find anyone else.'}</p>`}
live.staffSearch=()=>{const el=document.getElementById('live-staffSearch');const u=me();if(!el||!u)return;el.innerHTML=studentListHtml(u.role==='staff'?taught(u):supStudents(u),'/'+u.role+'/students',fv('st.q'),u.role==='staff'&&location.hash.split('/').length<=2?3:0)};

function staffHome(u){
  const list=taught(u),entries=S.acts.filter(a=>teaches(u,a.sid)&&a.status==='waiting'&&user(a.sid).status==='active'),mineL=S.letters.filter(l=>l.staffId===u.id&&openLetters(l));
  const soon=mineL.filter(l=>daysTo(l.due)<=14).length,newW=entries.filter(a=>Date.now()-a.created<7*DAY).length;
  const wait=mineL.filter(l=>l.status==='waiting'||l.status==='changes');
  return `<div class="hello">${avatar(u,72,true)}<div><h1>Good morning, ${esc(first(u.name))}</h1><p class="muted">${esc(u.title)} · ${esc(u.dept)}</p></div></div>
  <div class="grid g3"><div class="stat"><div class="l">Students you teach</div><div class="n">${list.length}</div></div><div class="stat"><div class="l">Entries to check</div><div class="n">${entries.length}</div><div class="d" style="color:var(--warn)">${newW} new this week</div></div><div class="stat"><div class="l">Letters to write</div><div class="n">${mineL.length}</div><div class="d" style="color:var(--warn)">${soon} ${soon===1?'is':'are'} due soon</div></div></div>
  <h2 class="sect">Needs your attention</h2>
  <div class="grid g2"><div class="card"><h3>Entries to check</h3>${entries.length?`<div class="list">${entries.slice(0,4).map(a=>{const s=user(a.sid);return `<div class="item"><div><b>${esc(s.name)}</b><div class="muted small">${esc(a.title)} · ${esc(TYPE1[a.type])}</div></div><a class="btn sm" href="#/staff/students/${s.schoolId}">Check</a></div>`}).join('')}</div>`:'<div class="empty">All caught up. New entries will show here.</div>'}</div>
  <div class="card"><h3>Letter requests</h3>${mineL.length?`<div class="list">${mineL.sort((a,b)=>a.due-b.due).slice(0,3).map(l=>`<div><div class="item"><div><b>${esc(user(l.sid).name)}</b><div class="muted small">${esc(l.purpose)}</div></div>${dueLabel(l.due)}</div><a class="btn sm" style="margin-top:8px" href="#/staff/letters">${l.status==='accepted'?'Write letter':l.status==='changes'?'Update letter':'Reply to request'}</a></div>`).join('')}</div>`:'<div class="empty">No letters waiting. Requests from students will show here.</div>'}</div></div>
  <h2 class="sect">Find a student</h2><div class="card">${can('view_taught')?`<div class="field"><input data-k="st.q" data-live="staffSearch" value="${esc(fv('st.q'))}" placeholder="⌕ Type a name or school ID" aria-label="Search students"></div><div id="live-staffSearch">${studentListHtml(list,'/staff/students',fv('st.q'),3)}</div>`:'<div class="empty">Your role cannot view student portfolios right now. Ask the administrator.</div>'}</div>`}
function staffStudents(u){return `${crumbs([['Home','/staff'],['My students']])}<h1 class="mb">My students</h1>${can('view_taught')?`<div class="card"><div class="field"><input data-k="st.q" data-live="staffSearch" value="${esc(fv('st.q'))}" placeholder="⌕ Type a name or school ID" aria-label="Search students"></div><div id="live-staffSearch">${studentListHtml(taught(u),'/staff/students',fv('st.q'),0)}</div></div>`:'<div class="empty">Your role cannot view student portfolios right now. Ask the administrator.</div>'}`}

/* review a portfolio (staff) */
function reviewPage(u,sid){
  const s=S.users.find(x=>x.schoolId===sid&&x.role==='student');
  if(!s||!teaches(u,s.id)||!can('view_taught'))return `${crumbs([['Home','/staff'],['My students']])}<div class="empty">You can only open students you teach. <a href="#/staff/students">Back to my students</a></div>`;
  const ft=fv('rv.ft','all'),ps=myProjects(s.id),acts=myActs(s.id);
  const items=[];
  acts.filter(a=>ft==='all'||ft==='act'&&a.type==='extra'||ft===a.type).forEach(a=>items.push({k:'a',o:a}));
  if(ft==='all'||ft==='proj')ps.forEach(p=>items.push({k:'p',o:p}));
  const mine=S.assess.filter(a=>a.sid===s.id&&a.by===u.id).sort((a,b)=>b.at-a.at)[0];
  const sn=S.notes.filter(x=>x.sid===s.id).sort((a,b)=>b.wk-a.wk).slice(0,3);
  const as=k=>F['as.'+k]!==undefined?F['as.'+k]:(mine?mine.r[k]:0);
  const openC=fv('rv.c','');
  const cbox=o=>openC===o.id?`<div class="mt stack" style="gap:6px">${o.comments.map(cmtHtml).join('')}<div class="row" style="flex-wrap:nowrap"><div class="field grow" style="margin:0"><input data-k="rv.cm" value="${esc(fv('rv.cm'))}" placeholder="Write a comment" aria-label="Write a comment"></div><button class="btn sm" data-a="postCmt" data-id="${o.id}" data-kind="${o.title!==undefined?'a':'p'}">Post</button></div><div class="hint">${esc(first(s.name))} can see your comments.</div></div>`:'';
  return `${crumbs([['Home','/staff'],['My students','/staff/students'],[s.name]])}
  <div class="pagehead"><div class="hello" style="margin:0">${avatar(s,64)}<div><h1>${esc(s.name)}</h1><p class="muted">${esc(s.schoolId)} · Year ${s.year} · ${esc(s.programme)}</p></div></div><div class="stat"><div class="l">Overall GPA</div><div class="n" style="font-size:1.6rem">${s.overall==null?'–':fmt2(s.overall)}</div><div class="d" style="color:var(--ok)">✓ Certified, read only</div></div></div>
  <div class="grid g21"><div class="stack">
   <div class="card"><h3>About ${esc(first(s.name))}</h3><p>${esc(s.bio)||'<span class="muted">No bio yet.</span>'}</p><div class="tags mt">${(s.skills||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div><h4 class="cert-sub">Certifications</h4>${certsHtml(s,false)}<p class="small muted mt">${esc(s.email)} · ${esc(s.phone)}<br>${esc(s.linkedin)} · ${esc(s.github)}</p></div>
   <div><h2 class="mb">Entries and projects</h2><div class="tabs">${[['all','Everything'],['achievement','Achievements'],['leadership','Leadership'],['act','Activities'],['proj',`Projects (${ps.length})`]].map(([v,l])=>`<button data-a="setF" data-k="rv.ft" data-v="${v}" aria-pressed="${ft===v}">${l}</button>`).join('')}</div>
   ${items.length?`<div class="stack">${items.map(({k,o})=>k==='a'?`<div class="card"><div class="item"><div><b>${esc(o.title)}</b><div class="muted small">${TYPE1[o.type]} · Year ${o.year}${o.where?' · '+esc(o.where):''}${o.evidence?' · Evidence: '+esc(o.evidence):''}</div></div>${statusChip(o.status)}</div>
    <div class="row mt">${o.status!=='verified'?`<button class="btn sm pri" data-a="verify" data-id="${o.id}">Verify</button>${o.status!=='evidence'?`<button class="btn sm" data-a="askEv" data-id="${o.id}">Ask for evidence</button>`:''}`:''}<button class="btn sm" data-a="toggleC" data-id="${o.id}">Comments (${o.comments.length})</button></div>${cbox(o)}</div>`:`<div class="card"><div class="item"><div><b>${esc(o.name)}</b><div class="muted small">Project · ${esc(o.kind)}</div></div><span class="muted small">Read and comment</span></div><p class="small mt">${esc(o.result||o.goal)}</p><div class="row mt">${link(o.live)?`<a class="btn sm" href="${esc(link(o.live))}" target="_blank" rel="noopener">Open live version</a>`:''}${link(o.code)?`<a class="btn sm" href="${esc(link(o.code))}" target="_blank" rel="noopener">View code</a>`:''}<button class="btn sm" data-a="toggleC" data-id="${o.id}">Comments (${o.comments.length})</button></div>${cbox(o)}</div>`).join('')}</div>`:'<div class="empty">Nothing in this filter yet.</div>'}</div></div>
  <div class="stack"><div class="card"><h3>Your assessment</h3><p class="hint mb">1 means needs work, 5 means excellent. ${esc(first(s.name))} will see this.</p>
   ${[['leadership','Leadership'],['teamwork','Teamwork'],['communication','Communication']].map(([k,l])=>`<div class="ratingrow"><span>${l}</span>${ratings('as.'+k,as(k))}</div>`).join('')}
   ${fld('as.fb',{label:`Feedback for ${esc(first(s.name))} (optional)`,ta:true,rows:4,def:mine?mine.feedback:''})}
   ${ui.err.as?`<div class="errmsg mb">${esc(ui.err.as)}</div>`:''}<button class="btn pri" style="width:100%" data-a="saveAssess" data-id="${s.id}">Save assessment</button>${mine?`<p class="hint mt">Last saved ${fmtD(mine.at)}.</p>`:''}</div>
   ${sn.length?`<div class="card"><h3>Supervisor notes</h3><div class="list">${sn.map(x=>`<div><b>Week ${x.wk}</b> <span class="muted small">· ${esc(user(x.by).name)}</span><p class="small">${esc(x.text)}</p></div>`).join('')}</div></div>`:''}</div></div>`}
function findEntry(id){return S.acts.find(a=>a.id===id)||S.projects.find(p=>p.id===id)}
actions.toggleC=el=>{F['rv.c']=fv('rv.c')===el.dataset.id?'':el.dataset.id;F['rv.cm']='';render()};
actions.postCmt=el=>{if(!need('comment_rate'))return;const o=findEntry(el.dataset.id),t=fv('rv.cm').trim();if(!t){toast('Write a comment first.','bad');return}o.comments.push({by:me().id,text:t,at:Date.now()});F['rv.cm']='';save();render();toast('Comment posted.')};
actions.verify=el=>{if(!need('verify'))return;const a=S.acts.find(x=>x.id===el.dataset.id);a.status='verified';a.verifiedBy=me().id;save();render();toast('Entry verified.')};
actions.askEv=el=>{if(!need('verify'))return;const a=S.acts.find(x=>x.id===el.dataset.id);a.status='evidence';if(!a.comments.some(c=>c.text.startsWith('Please add evidence')))a.comments.push({by:me().id,text:'Please add evidence, like a certificate or a letter, so I can verify this.',at:Date.now()});save();render();toast('Asked the student for evidence.')};
actions.saveAssess=el=>{if(!need('comment_rate'))return;const u=me(),sid=el.dataset.id,r={};let any=false;['leadership','teamwork','communication'].forEach(k=>{const v=F['as.'+k]!==undefined?F['as.'+k]:0;if(v){r[k]=v;any=true}});
  const prev=S.assess.find(a=>a.sid===sid&&a.by===u.id);const fb=(F['as.fb']!==undefined?F['as.fb']:(prev?prev.feedback:'')).trim();
  if(!any&&!fb&&!(prev&&Object.keys(prev.r).length)){ui.err.as='Give at least one rating or write some feedback.';return fail()}
  const rr=Object.assign({},prev?prev.r:{},r);ui.err={};
  S.assess=S.assess.filter(a=>!(a.sid===sid&&a.by===u.id));S.assess.push({sid,by:u.id,r:rr,feedback:fb,at:Date.now()});save();render();toast('Assessment saved. The student can see it.')};

/* letter requests (staff) */
function staffLetters(u){
  const mine=S.letters.filter(l=>l.staffId===u.id),tb=fv('lq.t','new');
  const groups={new:mine.filter(l=>l.status==='waiting'),changes:mine.filter(l=>l.status==='changes'),prog:mine.filter(l=>l.status==='accepted'),sent:mine.filter(l=>l.status==='ready')};
  const empty={new:'No new requests. When a student asks you for a letter, it shows here.',changes:'No change requests. If a student wants a letter updated, it shows here.',prog:'Nothing in progress. Accept a request to start writing.',sent:'No letters sent yet.'};
  const list=groups[tb].sort((a,b)=>a.due-b.due);
  const card=l=>{const s=user(l.sid);return `<div class="card"><div class="item"><div class="row" style="flex-wrap:nowrap">${avatar(s,44)}<div><b>${esc(s.name)}</b><div class="muted small">${esc(l.purpose)}${l.status==='changes'?` · Change request ${l.changesUsed} of 2`:''}</div></div></div>${l.status==='changes'?'<span class="chip info">✎ Changes requested</span>':dueLabel(l.due)}</div>
   ${l.note?`<div class="cmt mt"><span class="muted">Message from student:</span> ${esc(l.note)}</div>`:''}${l.status==='changes'?`<div class="cmt mt"><span class="muted">What ${esc(first(s.name))} wants changed:</span> ${esc(l.changeRequests[l.changeRequests.length-1].text)}</div>`:''}
   <div class="row mt">${l.status==='waiting'?(F['lq.d']===l.id?'':`<button class="btn sm pri" data-a="acceptLetter" data-id="${l.id}">Accept</button><button class="btn sm" data-a="openDecline" data-id="${l.id}">Decline</button>`):''}${l.status==='accepted'?`<a class="btn sm pri" href="#/staff/letters/write/${l.id}">Write letter</a>`:''}${l.status==='changes'?`<a class="btn sm pri" href="#/staff/letters/update/${l.id}">Update letter</a>`:''}${l.status==='ready'?`<button class="btn sm" data-a="viewSent" data-id="${l.id}">View sent letter</button>`:''}</div>
   ${F['lq.d']===l.id?`<div class="card tint mt"><b>Tell ${esc(first(s.name))} why, so they can ask someone else</b><div class="field mt ${ui.err['lq.r']?'has-err':''}"><input data-k="lq.r" value="${esc(fv('lq.r'))}" placeholder="I am on leave until December and cannot meet your deadline." aria-label="Reason">${ui.err['lq.r']?`<div class="errmsg">${esc(ui.err['lq.r'])}</div>`:'<div class="hint">A short reason is required before the reply can be sent.</div>'}</div><div class="row"><button class="btn pri sm" data-a="sendDecline" data-id="${l.id}">Send reply</button><button class="btn sm" data-a="cancelDecline">Cancel</button></div></div>`:''}</div>`};
  return `${crumbs([['Home','/staff'],['Letter requests']])}<div class="pagehead"><div><h1>Letter requests</h1><p class="sub">Accept or decline requests, then write and send each letter.</p></div></div>
  <div class="tabs">${[['new','New'],['changes','Changes requested'],['prog','In progress'],['sent','Sent']].map(([v,l])=>`<button data-a="setF" data-k="lq.t" data-v="${v}" aria-pressed="${tb===v}">${l} (${groups[v].length})</button>`).join('')}</div>
  ${list.length?`<div class="stack">${list.map(card).join('')}</div>`:`<div class="empty">${empty[tb]}</div>`}`}
actions.acceptLetter=el=>{if(!need('write_letters'))return;const l=S.letters.find(x=>x.id===el.dataset.id);l.status='accepted';save();F['lq.t']='prog';render();toast('Accepted. The student has been told. Write the letter when you are ready.')};
actions.openDecline=el=>{F['lq.d']=el.dataset.id;F['lq.r']='';ui.err={};render()};
actions.cancelDecline=()=>{delete F['lq.d'];ui.err={};render()};
actions.sendDecline=el=>{const r=fv('lq.r').trim();if(!r){ui.err['lq.r']='Write a short reason so the student can ask someone else.';return fail()}const l=S.letters.find(x=>x.id===el.dataset.id);l.status='declined';l.reply=r;save();delete F['lq.d'];ui.err={};render();toast('Reply sent.')};
actions.viewSent=el=>{const l=S.letters.find(x=>x.id===el.dataset.id);openModal('Sent letter',()=>letterDocHtml(l,l.versions[l.versions.length-1]),{wide:true})};

/* letter editor */
const TEMPLATES={scholarship:['Scholarship',(n,s)=>`To the scholarship committee,\n\nI am writing in support of ${n}. Their academic record and [achievement] show real promise.\n\n[A specific example of their work]\n\nI strongly support their application.\n\nYours faithfully,\n${s}`],job:['Job application',(n,s)=>`Dear hiring manager,\n\nIt is my pleasure to recommend ${n}. In my class they showed [strength].\n\n[A specific example of their work]\n\nI am confident they would be a valuable team member.\n\nYours sincerely,\n${s}`],ref:['Standard reference',(n,s)=>`To whom it may concern,\n\n${n} has studied with me in [course]. I found them [qualities].\n\n[A specific example]\n\nI am happy to recommend them.\n\nYours sincerely,\n${s}`]};
function letterEditor(u,id){
  const l=S.letters.find(x=>x.id===id&&x.staffId===u.id);if(!l||l.status!=='accepted')return `<div class="empty">That letter isn't open for writing. <a href="#/staff/letters">Back to letter requests</a></div>`;
  const s=user(l.sid),tk=l.purpose==='Scholarship'?'scholarship':l.purpose==='Job application'||l.purpose==='Internship'?'job':'ref';
  const body=fv('le.body',l.draft||TEMPLATES[tk][1](s.name,staffLabel(u)));
  return `${crumbs([['Home','/staff'],['Letter requests','/staff/letters'],[s.name]])}<div class="pagehead"><h1>Letter for ${esc(s.name)}</h1><a class="btn" href="#/staff/letters">← Back to requests</a></div>
  <div class="grid g21"><div class="card letter-edit"><div class="row" style="align-items:flex-end">${selF('le.tpl',Object.entries(TEMPLATES).map(([k,v])=>[k,v[0]]),{label:'Start from a template',def:tk})}<div class="field"><button class="btn sm" data-a="useTpl" data-id="${l.id}">Use this template</button></div><div class="field"><button class="btn sm gold" type="button" data-a="aiDraftLetter" data-id="${l.id}">✨ AI Draft with Gemini</button></div></div>
   <div class="field ${ui.err['le.body']?'has-err':''}"><label for="le_body">Your letter</label><textarea id="le_body" data-k="le.body" rows="14">${esc(body)}</textarea>${ui.err['le.body']?`<div class="errmsg">${esc(ui.err['le.body'])}</div>`:'<div class="hint">Review or adjust the letter details before signing.</div>'}</div>
   <div class="row"><button class="btn" data-a="saveDraft" data-id="${l.id}">Save draft</button><button class="btn pri" data-a="sendLetter" data-id="${l.id}">Sign and send</button></div></div>
  <div class="card"><h3>What ${esc(first(s.name))} shared with you</h3><p class="muted small mb">For: ${esc(l.purpose)}, due ${fmtD(l.due)}</p>${l.note?`<div class="cmt mb">${esc(l.note)}</div>`:''}${[['grades','My grades'],['ach','My achievements'],['lead','My leadership roles'],['extra','My extracurricular activities']].map(([k,t])=>`<div>${l.share[k]?'<span style="color:var(--ok)">✓</span>':'<span style="color:var(--muted)">✕</span>'} ${t}${l.share[k]?'':' <span class="muted small">(not shared)</span>'}</div>`).join('')}<a class="btn sm mt" style="margin-top:14px" href="#/staff/students/${s.schoolId}">Open ${esc(first(s.name))}'s portfolio</a></div></div>`}
actions.useTpl=el=>{const l=S.letters.find(x=>x.id===el.dataset.id),s=user(l.sid),u=me();F['le.body']=TEMPLATES[fv('le.tpl','job')][1](s.name,staffLabel(u));render()};
actions.aiDraftLetter=el=>{
  const l=S.letters.find(x=>x.id===el.dataset.id),s=user(l.sid),u=me();
  toast('🤖 Drafting personalized letter with Gemini AI...');
  AuAPI.aiLetter({
    student: s,
    lecturer: u,
    purpose: l.purpose,
    specificNote: l.note,
    projects: myProjects(s.id),
    activities: myActs(s.id),
    gpa: s.overall
  }).then(r=>{
    if(r&&r.letter){
      F['le.body']=r.letter;
      render();
      toast('✨ Letter draft generated by Gemini AI! Review and sign.');
    }
  }).catch(e=>{
    toast('AI Generation error: '+(e&&e.message||'Failed to generate'),'bad');
  });
};
actions.saveDraft=el=>{const l=S.letters.find(x=>x.id===el.dataset.id);if(F['le.body']!==undefined)l.draft=F['le.body'];save();toast('Draft saved.')};
function sendLetterFlow(el,isUpdate){
  if(!need('write_letters'))return;const l=S.letters.find(x=>x.id===el.dataset.id),b=fv('le.body',l.draft).trim();
  if(!b){ui.err['le.body']='A letter cannot be sent empty. Write your letter first.';return fail()}
  const ph=b.match(/\[[^\]]+\]/g);if(ph){ui.err['le.body']=`Replace the placeholder ${ph[0]} (and any others in brackets) with real details before sending.`;return fail()}
  const n=l.versions.length+1;l.versions.push({n,body:b,sent:Date.now(),seen:false});l.status='ready';l.draft='';save();ui.err={};go('/staff/letters',{'lq.t':'sent'});toast(isUpdate?'Updated letter sent. The student has been told.':'Letter signed and sent. The student can download it now.')}
actions.sendLetter=el=>sendLetterFlow(el,false);
function letterUpdater(u,id){
  const l=S.letters.find(x=>x.id===id&&x.staffId===u.id);if(!l||l.status!=='changes')return `<div class="empty">That letter has no open change request. <a href="#/staff/letters">Back to letter requests</a></div>`;
  const s=user(l.sid),last=l.versions[l.versions.length-1],req=l.changeRequests[l.changeRequests.length-1];
  const body=fv('le.body',l.draft||last.body);
  return `${crumbs([['Home','/staff'],['Letter requests','/staff/letters'],[s.name]])}<div class="pagehead"><h1>Update letter for ${esc(s.name)}</h1><a class="btn" href="#/staff/letters">← Back to requests</a></div>
  <div class="banner info mb"><b>${esc(first(s.name))} asked for changes (request ${l.changesUsed} of 2)</b><br>“${esc(req.text)}”</div>
  <div class="grid g21"><div class="card letter-edit"><div class="field ${ui.err['le.body']?'has-err':''}"><label for="le_body">Your letter (version ${last.n+1}, draft)</label><textarea id="le_body" data-k="le.body" rows="14">${esc(body)}</textarea>${ui.err['le.body']?`<div class="errmsg">${esc(ui.err['le.body'])}</div>`:''}</div><div class="row"><button class="btn" data-a="saveDraft" data-id="${l.id}">Save draft</button><button class="btn pri" data-a="sendUpdate" data-id="${l.id}">Sign and send updated letter</button></div></div>
  <div class="card"><h3>Versions</h3><div class="list"><div class="item"><div><b>Version ${last.n+1}</b><div class="muted small">Draft, you are editing this</div></div><span class="chip warn">✎ Draft</span></div>${l.versions.slice().reverse().map(v=>`<div class="item"><div><b>Version ${v.n}</b><div class="muted small">Sent ${fmtD(v.sent)}</div></div><button class="btn sm" data-a="viewVer" data-id="${l.id}" data-n="${v.n}">View</button></div>`).join('')}</div><p class="hint mt">${esc(first(s.name))} can still download version ${last.n} until you send the update. They will be told when the new version is ready.</p>${l.changesUsed>=2?'<p class="hint mt">This is the last update. Any further changes happen by the student contacting you directly.</p>':''}</div></div>`}
actions.sendUpdate=el=>sendLetterFlow(el,true);
actions.viewVer=el=>{const l=S.letters.find(x=>x.id===el.dataset.id),v=l.versions.find(x=>x.n===Number(el.dataset.n));openModal('Version '+v.n,()=>letterDocHtml(l,v),{wide:true})};

/* ======================= SUPERVISOR ======================= */
const supStudents=u=>S.users.filter(s=>s.role==='student'&&s.status==='active'&&s.attach&&s.attach.supId===u.id&&Date.now()<=s.attach.end+DAY);
const attWeek=a=>Math.max(1,Math.min(Math.round((a.end-a.start)/(7*DAY)),Math.floor((Date.now()-a.start)/(7*DAY))+1));
const attWeeks=a=>Math.round((a.end-a.start)/(7*DAY));
const hasNote=(sid,wk)=>S.notes.some(n=>n.sid===sid&&n.wk===wk);
function supHome(u){
  const list=supStudents(u);if(!can('view_taught'))return '<div class="empty">Your role cannot view student portfolios right now. Ask the administrator.</div>';
  const due=list.filter(s=>!hasNote(s.id,attWeek(s.attach))),ending=list.filter(s=>s.attach.end-Date.now()<=21*DAY);
  return `<div class="hello">${avatar(u,72,true)}<div><h1>Good morning, ${esc(first(u.name))}</h1><p class="muted">${esc(u.company)} · ${esc(u.dept)}</p></div></div>
  <div class="grid g3"><div class="stat"><div class="l">Students with you</div><div class="n">${list.length}</div></div><div class="stat"><div class="l">Progress notes due</div><div class="n">${due.length}</div><div class="d" style="color:var(--warn)">Due this week</div></div><div class="stat"><div class="l">Attachments ending soon</div><div class="n">${ending.length}</div><div class="d" style="color:var(--warn)">${ending.length?`Ends in ${Math.min(...ending.map(s=>Math.max(0,daysTo(s.attach.end))))} days`:'None right now'}</div></div></div>
  <h2 class="sect">Needs your attention</h2><div class="card">${due.length||ending.length?`<div class="list">${due.map(s=>`<div class="item"><span>● <b>${esc(s.name)}</b>: week ${attWeek(s.attach)} progress note is due Friday</span><a class="btn sm pri" href="#/supervisor/students/${s.schoolId}">Write note</a></div>`).join('')}${ending.map(s=>`<div class="item"><span>⏱ <b>${esc(s.name)}</b>: attachment ends in ${plural(Math.max(0,daysTo(s.attach.end)),'day')}. Final report needed.</span><a class="btn sm" href="#/supervisor/students/${s.schoolId}">Start report</a></div>`).join('')}</div>`:'<div class="empty">Nothing needs doing right now.</div>'}</div>
  <h2 class="sect">Students on attachment with you</h2><div class="card">${list.length?`<div class="list">${list.map(s=>{const wk=attWeek(s.attach),tot=attWeeks(s.attach),end=s.attach.end-Date.now()<=21*DAY;return `<div class="item"><div class="row" style="flex-wrap:nowrap">${avatar(s,44)}<div><b>${esc(s.name)}</b><div class="muted small">${esc(s.programme)} · Year ${s.year}</div><div class="row small"><div class="bar" style="width:120px;margin:0"><i style="width:${wk/tot*100}%"></i></div>Week ${wk} of ${tot}</div></div></div><div class="row"><span class="chip ${end?'warn':'ok'}">${end?'● Ending soon':'✓ On track'}</span><a class="btn sm" href="#/supervisor/students/${s.schoolId}">Open portfolio</a></div></div>`}).join('')}</div>`:'<div class="empty">No students are linked to you right now. The school links students when an attachment starts.</div>'}</div>
  <p class="hint mt">You only see the students the school has linked to you, and only while their attachment runs.</p>`}
function supStudentsPage(u){return `${crumbs([['Home','/supervisor'],['My students']])}<h1 class="mb">My students</h1><div class="card"><div class="field"><input data-k="st.q" data-live="staffSearch" value="${esc(fv('st.q'))}" placeholder="⌕ Type a name or school ID" aria-label="Search students"></div><div id="live-staffSearch">${studentListHtml(supStudents(u),'/supervisor/students',fv('st.q'),0)}</div></div>`}
function supPortfolio(u,sid){
  const s=S.users.find(x=>x.schoolId===sid&&x.role==='student');
  if(!s||!supStudents(u).includes(s)||!can('view_taught'))return `${crumbs([['Home','/supervisor'],['My students']])}<div class="empty">You can only open students the school has linked to you. <a href="#/supervisor/students">Back to my students</a></div>`;
  const a=s.attach,wk=attWeek(a),tot=attWeeks(a),tab=fv('sp.tab','overview'),ps=myProjects(s.id),acts=myActs(s.id),notes=S.notes.filter(n=>n.sid===s.id).sort((x,y)=>y.wk-x.wk);
  const cur=notes.find(n=>n.wk===wk),rv=k=>F['pn.'+k]!==undefined?F['pn.'+k]:(cur?cur.r[k]:0),fin=S.finals[s.id];
  const pl=p=>`<div class="item"><div><b>${esc(p.name)}</b><div class="muted small">${esc(p.kind)}${p.result?' · '+esc(p.result):''}</div></div><span class="row">${link(p.live)?`<a class="btn sm" href="${esc(link(p.live))}" target="_blank" rel="noopener">Live</a>`:''}${link(p.code)?`<a class="btn sm" href="${esc(link(p.code))}" target="_blank" rel="noopener">Code</a>`:''}</span></div>`;
  let left;
  if(tab==='projects')left=`<div class="card"><h3>Projects</h3>${ps.length?`<div class="list">${ps.map(p=>`<div>${pl(p)}<p class="small mt">${esc(p.goal)}</p></div>`).join('')}</div>`:'<div class="empty">No projects yet.</div>'}</div>`;
  else if(tab==='grades')left=`<div class="card"><h3>Grades</h3><p class="mb">Overall GPA <b>${s.overall==null?'–':fmt2(s.overall)}</b> <span style="color:var(--ok)">✓ Certified, read only</span> · ${creditsDone(s)} of 120 credits</p><div class="tw"><table><thead><tr><th>Semester</th><th class="c">GPA</th></tr></thead><tbody>${s.gpas.map((_,i)=>`<tr><td>Year ${Math.floor(i/2)+1}, Semester ${i%2+1}</td><td class="c">${fmt2(semGpa(s,i))}</td></tr>`).join('')}</tbody></table></div></div>`;
  else if(tab==='acts')left=`<div class="card"><h3>Activities</h3>${acts.length?`<div class="list">${acts.map(x=>`<div class="item"><div><b>${esc(x.title)}</b><div class="muted small">${TYPES[x.type]} · Year ${x.year}</div></div>${statusChip(x.status)}</div>`).join('')}</div>`:'<div class="empty">No activities yet.</div>'}</div>`;
  else left=`<div class="stack"><div class="card"><h3>About ${esc(first(s.name))}</h3><p>${esc(s.bio)||'<span class="muted">No bio yet.</span>'}</p><div class="tags mt">${(s.skills||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div><h4 class="cert-sub">Certifications</h4>${certsHtml(s,false)}<p class="small muted mt">${esc(s.email)} · ${esc(s.phone)}<br>${esc(s.linkedin)} · ${esc(s.github)}</p></div>
   <div class="card"><h3>Projects</h3>${ps.length?`<div class="list">${ps.slice(0,2).map(pl).join('')}</div>${ps.length>2?`<p class="hint mt">${esc(ps[2].name)}${ps.length>3?' and '+(ps.length-3)+' more':''}. See the Projects tab.</p>`:''}`:'<div class="empty">No projects yet.</div>'}</div>
   <div class="grid g2"><div class="stat"><div class="l">Overall GPA</div><div class="n">${s.overall==null?'–':fmt2(s.overall)}</div><div class="d" style="color:var(--ok)">✓ Certified, read only</div></div><div class="stat"><div class="l">Activities</div><div class="n">${acts.length}</div><div class="d muted">${acts.filter(x=>x.status==='verified').length} verified by teachers</div></div></div></div>`;
  return `${crumbs([['Home','/supervisor'],['My students','/supervisor/students'],[s.name]])}
  <div class="pagehead"><div class="hello" style="margin:0">${avatar(s,64)}<div><h1>${esc(s.name)}</h1><p class="muted">${esc(s.schoolId)} · Year ${s.year} · ${esc(s.programme)}</p></div></div><div class="stat"><div class="l">Attachment at ${esc(a.company)}</div><div class="n" style="font-size:1.4rem">Week ${wk} of ${tot}</div><div class="bar"><i style="width:${wk/tot*100}%"></i></div><div class="d muted">${fmtD(a.start)} to ${fmtD(a.end)}</div></div></div>
  <div class="banner info mb">ⓘ You can see this student's whole portfolio: profile, projects, grades, activities and contact details.</div>
  <div class="tabs">${[['overview','Overview'],['projects',`Projects (${ps.length})`],['grades','Grades'],['acts','Activities']].map(([v,l])=>`<button data-a="setF" data-k="sp.tab" data-v="${v}" aria-pressed="${tab===v}">${l}</button>`).join('')}</div>
  <div class="grid g21"><div>${left}</div><div class="stack"><div class="card"><h3>Progress during the attachment</h3><p class="hint mb">1 means needs work, 5 means excellent.</p>
   ${[['punct','Punctuality'],['qual','Quality of work'],['team','Teamwork']].map(([k,l])=>`<div class="ratingrow"><span>${l}</span>${ratings('pn.'+k,rv(k))}</div>`).join('')}
   ${fld('pn.text',{label:`This week's note (week ${wk})`,ta:true,rows:3,def:cur?cur.text:'',ph:'What did they deliver this week?'})}
   ${ui.err.pn?`<div class="errmsg mb">${esc(ui.err.pn)}</div>`:''}<button class="btn pri" style="width:100%" data-a="saveNote" data-id="${s.id}">Save progress note</button><p class="hint mt">${esc(first(s.name))} and their lecturers can see your notes.</p>
   <h4 class="mt2" style="margin-bottom:6px">Earlier notes</h4>${notes.filter(n=>n.wk!==wk).length?`<div class="list">${notes.filter(n=>n.wk!==wk).slice(0,4).map(n=>`<div><div class="item"><b>Week ${n.wk}</b><span class="muted small">${fmtD(n.at)}</span></div><div class="small">${esc(n.text)}</div></div>`).join('')}</div>`:'<p class="muted small">No earlier notes yet.</p>'}
   <div class="item mt2"><div><b>Final attachment report</b><div class="muted small">${fin?'Submitted '+fmtD(fin.at):'Due '+fmtD(a.end)}</div></div><button class="btn sm" data-a="finalReport" data-id="${s.id}">${fin?'View report':'Start report'}</button></div></div></div></div>`}
actions.saveNote=el=>{if(!need('add_notes'))return;const u=me(),s=user(el.dataset.id),wk=attWeek(s.attach),cur=S.notes.find(n=>n.sid===s.id&&n.wk===wk);
  const r={};let any=false;[['punct'],['qual'],['team']].forEach(([k])=>{const v=F['pn.'+k]!==undefined?F['pn.'+k]:(cur?cur.r[k]:0);if(v){r[k]=v;any=true}});
  const text=(F['pn.text']!==undefined?F['pn.text']:(cur?cur.text:'')).trim();
  if(!text){ui.err.pn="Write this week's note before saving.";return fail()}
  S.notes=S.notes.filter(n=>!(n.sid===s.id&&n.wk===wk));S.notes.push({sid:s.id,wk,r,text,at:Date.now(),by:u.id});ui.err={};save();render();toast(`Week ${wk} note saved.`)};
actions.finalReport=el=>{const s=user(el.dataset.id),fin=S.finals[s.id];F['fr.sum']=fin?fin.sum:'';F['fr.rec']=fin?fin.rec:'yes';ui.err={};
  openModal('Final attachment report',()=>`<p class="muted mb">${esc(s.name)} · ${esc(s.attach.company)} · ${fmtD(s.attach.start)} to ${fmtD(s.attach.end)}</p>${fld('fr.sum',{label:'Summary of the attachment',ta:true,rows:6,hint:'What did they achieve? What should they work on next?'})}${selF('fr.rec',[['yes','Yes, I would recommend them'],['maybe','Yes, with reservations'],['no','Not at this time']],{label:'Would you recommend them for a graduate role?'})}<div class="row"><button class="btn pri" data-a="saveFinal" data-id="${s.id}">Submit report</button><button class="btn" data-a="closeModal">Cancel</button></div>`,{wide:true})};
actions.saveFinal=el=>{if(!need('add_notes'))return;const t=fv('fr.sum').trim();if(!t){ui.err['fr.sum']='Write a short summary before submitting.';renderModal();return}S.finals[el.dataset.id]={sum:t,rec:fv('fr.rec','yes'),at:Date.now(),by:me().id};ui.err={};save();closeModal();render();toast('Final report submitted.')};

/* ======================= ADMIN ======================= */
const CUR_YEAR='2026/27',PREV_YEAR='2025/26';
function adminHome(u){
  const yr=fv('ad.yr',CUR_YEAR),cur=yr===CUR_YEAR;
  const st=students(),stf=S.users.filter(x=>x.role==='staff'&&x.status==='active');
  const pend=S.users.filter(x=>x.status==='pending'),old=oldEntries(),over=overdueLetters();
  const done=st.filter(s=>isComplete(s.id)).length,pct=st.length?Math.round(done/st.length*100):0;
  const yrs=[1,2,3,4].map(y=>{const g=st.filter(s=>s.year===y),gp=g.filter(s=>s.overall!=null);return {y,gpa:gp.length?gp.reduce((a,s)=>a+s.overall,0)/gp.length:null,pct:g.length?Math.round(g.filter(s=>isComplete(s.id)).length/g.length*100):null}});
  const best=yrs.filter(x=>x.gpa!=null).slice(-1)[0],bestP=yrs.filter(x=>x.pct!=null).slice(-1)[0];
  const dash=v=>cur?v:'–';
  return `<div class="pagehead"><div class="hello" style="margin:0">${avatar(u,72,true)}<div><h1>Hello, ${esc(first(u.name))}</h1><p class="muted">${esc(u.dept)}</p></div></div><div style="min-width:190px">${selF('ad.yr',[CUR_YEAR,PREV_YEAR].map(y=>[y,'Academic year: '+y]),{r:1})}</div></div>
  ${cur?'':`<div class="banner mb">Figures for ${PREV_YEAR} are held by the registry office and are not loaded in this prototype. Switch back to ${CUR_YEAR} to see live numbers.</div>`}
  <div class="grid g4"><div class="stat"><div class="l">People with accounts</div><div class="n">${dash(S.users.filter(x=>['active','deactivated'].includes(x.status)).length.toLocaleString())}</div></div><div class="stat"><div class="l">Students</div><div class="n">${dash(st.length.toLocaleString())}</div></div><div class="stat"><div class="l">Staff</div><div class="n">${dash(stf.length.toLocaleString())}</div></div><div class="stat"><div class="l">Portfolios completed</div><div class="n">${dash(pct+'%')}</div><div class="bar"><i style="width:${cur?pct:0}%"></i></div></div></div>
  <p class="hint mt">A portfolio is complete when it has at least one entry in each section: projects, achievements, leadership and extracurricular.</p>
  <h2 class="sect">Needs your attention</h2><div class="card">${cur?`<div class="list">
   ${[[pend.length,'new sign-ups','are waiting for you to approve them','Review sign-ups','review','bad'],[old.length,'student entries','have waited over 30 days to be checked','See entries','entries','warn'],[over.length,'letter requests','are past their due date','See requests','requests','warn']].map(([n,a,b,btn,act,c])=>n?`<div class="item"><span><span style="color:var(--${c})">●</span> <b>${n} ${n===1?a.replace(/s$/,'').replace('entrie','entry'):a}</b> ${n===1?b.replace('are ','is ').replace('have ','has '):b}</span><button class="btn sm" data-a="adm_${act}">${btn}</button></div>`:`<div class="item"><span style="color:var(--ok)">✓ No ${a} ${act==='review'?'waiting':'overdue'}</span></div>`).join('')}</div>`:'<div class="empty">Nothing to show for this year.</div>'}</div>
  <div class="grid g2 mt"><div class="card"><h3>Average overall GPA</h3><p class="hint mb">By year group, out of 4.0</p>${yrs.map(x=>`<div class="hbar ${best&&x.y===best.y?'hi':''}"><span>Year ${x.y}</span><div class="t"><i style="width:${cur&&x.gpa?x.gpa/4*100:0}%"></i></div><b>${cur&&x.gpa?x.gpa.toFixed(2):'–'}</b></div>`).join('')}</div>
  <div class="card"><h3>Portfolios completed</h3><p class="hint mb">By year group</p>${yrs.map(x=>`<div class="hbar ${bestP&&x.y===bestP.y?'hi':''}"><span>Year ${x.y}</span><div class="t"><i style="width:${cur&&x.pct!=null?x.pct:0}%"></i></div><b>${cur&&x.pct!=null?x.pct+'%':'–'}</b></div>`).join('')}</div></div>
  <div class="card mt"><h3>Recent activity</h3><div class="list">${S.log.slice(0,4).map(l=>`<div class="item"><span>${esc(l.text)}</span><span class="muted small">${fmtWhen(l.ts)}</span></div>`).join('')}</div></div>`}
actions.adm_review=()=>go('/admin/people');
actions.adm_entries=()=>openModal('Entries waiting over 30 days',()=>{const o=oldEntries();return `<div class="list">${o.map(a=>`<div class="item"><div><b>${esc(a.title)}</b><div class="muted small">${esc(user(a.sid).name)} · waiting ${Math.floor((Date.now()-a.created)/DAY)} days</div></div>${statusChip(a.status)}</div>`).join('')||'<div class="empty">None right now.</div>'}</div><p class="hint mt">Remind the teachers who teach these students to check them.</p>`});
actions.adm_requests=()=>openModal('Letter requests past their due date',()=>{const o=overdueLetters();return `<div class="list">${o.map(l=>`<div class="item"><div><b>${esc(user(l.sid).name)}</b><div class="muted small">Asked ${esc(staffLabel(user(l.staffId)))} · ${esc(l.purpose)}</div></div>${dueLabel(l.due)}</div>`).join('')||'<div class="empty">None right now.</div>'}</div>`});

/* people */
const ROLE_FILTER=[['all','All roles'],['student','Students'],['Lecturer','Lecturers'],['Teacher','Teachers'],['supervisor','Supervisors'],['admin','Administrators']];
const roleText=x=>x.role==='student'?`Student · ${x.schoolId}`:x.role==='staff'?`${x.title} · ${x.dept} · ${x.email}`:x.role==='supervisor'?`Supervisor · ${x.company} · ${x.email}`:`Administrator · ${x.email}`;
function peopleList(){
  const q=fv('pp.q').trim().toLowerCase(),rf=fv('pp.role','all'),sf=fv('pp.status','all'),u=me();
  const m=S.users.filter(x=>['active','deactivated'].includes(x.status)).filter(x=>rf==='all'||x.role===rf||x.title===rf).filter(x=>sf==='all'||x.status===sf).filter(x=>!q||[x.name,x.email,x.schoolId||''].some(v=>v.toLowerCase().includes(q)));
  if(!m.length)return `<div class="empty">No one matches. Try a different name, email or school ID, or clear the filters.</div>`;
  return `<div class="list">${m.map(x=>`<div class="item"><div class="row" style="flex-wrap:nowrap">${avatar(x,44)}<div><b>${esc(x.name)}</b><div class="muted small">${esc(roleText(x))}</div></div></div><div class="row">${x.status==='active'?'<span class="chip ok">✓ Active</span>':'<span class="chip mute">Deactivated</span>'}${x.id===u.id?'':x.status==='active'?`<button class="btn sm" data-a="deact" data-id="${x.id}">Deactivate</button>`:`<button class="btn sm" data-a="react" data-id="${x.id}">Reactivate</button>`}</div></div>`).join('')}</div>`}
live.people=()=>{const el=document.getElementById('live-people');if(el)el.innerHTML=peopleList()};
function peoplePage(u){
  const pend=S.users.filter(x=>x.status==='pending'),add=fv('pp.add',false),role=fv('ps.role','Lecturer');
  const stu=students();
  return `${crumbs([['Home','/admin'],['People']])}<div class="pagehead"><div><h1>People</h1><p class="sub">Create staff accounts, approve student sign-ups, and manage every account.</p></div><div class="row"><button class="btn" data-a="importStudents">Import students from a file</button><button class="btn pri" data-a="togglePP">Add staff or supervisor</button></div></div>
  ${add?`<div class="card mb"><h3>Add staff or supervisor</h3><form data-submit="createStaff" novalidate><div class="grid g2">${fld('ps.name',{label:'Full name',ph:'Casey Brooks'})}${fld('ps.email',{label:'Work email',type:'email',ph:'casey.brooks@acme.example'})}${selF('ps.role',['Lecturer','Teacher','Supervisor'],{label:'Role',r:1,def:'Lecturer'})}${fld('ps.dept',{label:role==='Supervisor'?'Company':'Department',ph:role==='Supervisor'?'Acme Ltd':'Computing'})}</div>
   <div class="field"><label>${role==='Supervisor'?'Students they supervise':'Students they teach'}</label><div class="card tint" style="max-height:170px;overflow:auto;padding:10px 14px">${stu.map(s=>chk('ps.s.'+s.id,`${esc(s.name)} <span class="muted small">${esc(s.schoolId)}${s.attach&&role==='Supervisor'?' · already linked to a supervisor':''}</span>`)).join('')}</div><div class="hint">${role==='Supervisor'?"They only see the students you link here, and only while the attachment runs.":'They only see the students you tick here.'}</div></div>
   ${role==='Supervisor'?`<div class="grid g2">${fld('ps.start',{label:'Attachment starts',type:'date',def:todayISO()})}${fld('ps.end',{label:'Attachment ends',type:'date',def:new Date(Date.now()+84*DAY).toISOString().slice(0,10)})}</div>`:''}
   <p class="hint mb">They'll get an email with a link to set their own password.</p><div class="row"><button class="btn pri" type="submit">Create account</button><button type="button" class="btn" data-a="togglePP">Cancel</button></div></form></div>`:''}
  <div class="card mb"><h3>Waiting for approval (${pend.length})</h3><p class="muted small mb">Students who signed up themselves. Check their details match school records.</p>${pend.length?`<div class="list">${pend.map(x=>`<div><div class="item"><div><b>${esc(x.name)}</b><div class="small" style="color:var(--${x.signup&&x.signup.match?'ok':'warn'})">${x.signup&&x.signup.match?'✓':'▲'} ${esc(x.schoolId)} · ${x.signup&&x.signup.match?'Details match school records':"Details don't match"}</div>${x.signup&&!x.signup.match?x.signup.issues.map(i=>`<div class="muted small">${esc(i)}</div>`).join(''):''}</div><div class="row">${x.signup&&x.signup.match?`<button class="btn sm pri" data-a="approve" data-id="${x.id}">Approve</button>`:`<button class="btn sm" data-a="correct" data-id="${x.id}">Ask them to correct it</button>`}<button class="btn sm" data-a="reject" data-id="${x.id}">Reject</button></div></div></div>`).join('')}</div>`:'<div class="empty">No sign-ups are waiting. New student sign-ups will show here.</div>'}</div>
  <h2 class="mb">Everyone</h2><div class="card"><div class="row mb" style="align-items:flex-start"><div class="field grow" style="margin:0"><input data-k="pp.q" data-live="people" value="${esc(fv('pp.q'))}" placeholder="⌕ Search by name, email or school ID" aria-label="Search people"></div><div style="min-width:140px">${selF('pp.role',ROLE_FILTER,{lv:'people'})}</div><div style="min-width:150px">${selF('pp.status',[['all','All statuses'],['active','Active'],['deactivated','Deactivated']],{lv:'people'})}</div></div><div id="live-people">${peopleList()}</div><p class="hint mt">Accounts are deactivated, never deleted, so student records stay safe.</p></div>`}
actions.togglePP=()=>{F['pp.add']=!fv('pp.add',false);ui.err={};render()};
submits.createStaff=()=>{if(!need('manage_accounts'))return;const name=fv('ps.name').trim(),email=fv('ps.email').trim(),role=fv('ps.role','Lecturer'),dept=fv('ps.dept').trim();ui.err={};
  if(!name)ui.err['ps.name']="Enter the person's full name.";
  if(!/^\S+@\S+\.\S+$/.test(email))ui.err['ps.email']='Enter a work email, like name@school.edu.';else if(S.users.some(x=>x.email.toLowerCase()===email.toLowerCase()))ui.err['ps.email']='There is already an account with this email.';
  if(!dept)ui.err['ps.dept']=role==='Supervisor'?'Enter the company they work for.':'Enter their department.';
  const ids=students().filter(s=>F['ps.s.'+s.id]).map(s=>s.id);
  let st,en;if(role==='Supervisor'){st=new Date(fv('ps.start',todayISO())+'T00:00:00').getTime();en=new Date(fv('ps.end')||new Date(Date.now()+84*DAY).toISOString().slice(0,10)+'T00:00:00').getTime();if(!(en>st))ui.err['ps.end']='The end date must be after the start date.'}
  if(Object.keys(ui.err).length)return fail();
  const id=uid('u');
  if(role==='Supervisor'){S.users.push({id,role:'supervisor',name,company:dept,dept:'Workplace supervisor',email,password:'welcome123',status:'active',photo:null});ids.forEach(sid=>{user(sid).attach={supId:id,company:dept,start:st,end:en}})}
  else S.users.push({id,role:'staff',hon:role==='Lecturer'?'Dr.':'Mr./Ms.',name,title:role,dept,email,teaches:ids,password:'welcome123',status:'active',photo:null});
  if(role!=='Supervisor')user(id).hon='';
  addLog(`Account created for ${name}`);save();Object.keys(F).filter(k=>k.startsWith('ps.')).forEach(k=>delete F[k]);F['pp.add']=false;render();toast(`Account created for ${name}. In the live system they would get an email to set a password. For this prototype the password is welcome123.`)};
actions.approve=el=>{const x=user(el.dataset.id);x.status='active';x.overall=null;const rec=S.registry.find(r=>r.schoolId===x.schoolId);if(rec)x.programme=rec.programme||'';addLog(`${x.name} was approved`);save();render();toast(`${x.name} approved. They can sign in now.`)};
actions.correct=el=>{const x=user(el.dataset.id);x.status='correction';addLog(`${x.name} was asked to correct their sign-up`);save();render();toast(`${x.name} was asked to correct their details.`)};
actions.reject=el=>{const x=user(el.dataset.id);x.status='rejected';addLog(`${x.name}'s sign-up was rejected`);save();render();toast('Sign-up rejected.')};
actions.deact=el=>{const x=user(el.dataset.id);if(!need('manage_accounts'))return;x.status='deactivated';addLog(`${x.name} was deactivated`);save();render();toast(`${x.name} deactivated. Their records are kept.`)};
actions.react=el=>{const x=user(el.dataset.id);if(!need('manage_accounts'))return;x.status='active';addLog(`${x.name} was reactivated`);save();render();toast(`${x.name} reactivated.`)};
actions.importStudents=()=>{F['imp.text']='';F['imp.file']='';ui.err={};openModal('Import students from a file',()=>`<p class="mb">Upload a CSV file, or paste rows below. Each row is: <b>school ID, name, school email, year, programme</b>. These become the school records that sign-ups are checked against.</p><div class="field"><input type="file" accept=".csv,text/csv,text/plain" data-a-file="1" id="impfile" aria-label="CSV file"></div>${fld('imp.text',{label:'Or paste rows',ta:true,rows:5,ph:'2026-0601, Tariro Moyo, tariro.moyo@students.school.edu, 1, BSc Computer Science'})}<div class="row"><button class="btn pri" data-a="doImport">Import</button><button class="btn" data-a="closeModal">Cancel</button></div>`)};
document.addEventListener('change',e=>{const t=e.target;if(t&&t.id==='impfile'&&t.files&&t.files[0]){const r=new FileReader();r.onload=()=>{F['imp.text']=String(r.result||'');renderModal();toast('File read. Check the rows, then choose Import.')};r.readAsText(t.files[0])}});
actions.doImport=()=>{const rows=fv('imp.text').split(/\r?\n/).map(l=>l.split(',').map(x=>x.trim())).filter(c=>c.length>=3&&c[0]&&!/^school\s*id$/i.test(c[0]));let n=0;
  rows.forEach(c=>{if(!/^\S+@\S+\.\S+$/.test(c[2]))return;S.registry=S.registry.filter(r=>r.schoolId!==c[0]);S.registry.push({schoolId:c[0],name:c[1],email:c[2],year:Number(c[3])||1,programme:c[4]||''});n++});
  if(!n){ui.err['imp.text']='No valid rows found. Each row needs a school ID, a name and a valid email.';renderModal();return}
  ui.err={};addLog(`${n} student records imported`);save();closeModal();render();toast(`${plural(n,'record')} imported.`)};

/* permissions */
function permsPage(u){
  if(!ui.pd)ui.pd=clone(S.perms);
  const diffs=[];PROWS.forEach(r=>{if(!r.k)return;PROLES.forEach(role=>{const a=S.perms[r.k][role],b=ui.pd[r.k][role];if(a&&b&&a.v!==b.v)diffs.push([r,role,b.v])})});
  return `${crumbs([['Home','/admin'],['Permissions']])}<div class="pagehead"><div><h1>Permissions</h1><p class="sub">Choose what each role can do. Changes apply the next time people sign in.</p></div></div>
  ${diffs.length?`<div class="banner mb" role="status">▲ You have ${plural(diffs.length,'unsaved change')}. <button class="linkbtn" data-a="undoPerms" style="color:inherit">Undo changes</button></div>`:''}
  <div class="card"><div class="tw"><table class="perm"><thead><tr><th>What people can do</th>${PROLES.map(r=>`<th class="c">${PLABEL[r]}</th>`).join('')}</tr></thead><tbody>
  ${PROWS.map(r=>r.g?`<tr class="grp"><td colspan="6">${r.g}</td></tr>`:`<tr><td>${r.l}</td>${PROLES.map(role=>{const c=ui.pd[r.k][role];if(!c)return '<td class="c muted">–</td>';const ch=S.perms[r.k][role].v!==c.v;return `<td class="c">${c.lock?`<button class="lock ${c.v?'yes':'no'}" data-a="lockWhy" data-k="${r.k}" aria-label="${PLABEL[role]}: ${c.v?'allowed':'not allowed'}, fixed by the school. Tap to see why.">🔒 ${c.v?'✓':'✕'}</button>`:`<button class="${c.v?'yes':'no'}" data-a="togPerm" data-k="${r.k}" data-role="${role}" aria-pressed="${c.v}" aria-label="${PLABEL[role]}: ${esc(r.l)}: ${c.v?'allowed':'not allowed'}" ${ch?'style="outline:2px solid var(--role)"':''}>${c.v?'✓':'✕'}</button>`}</td>`}).join('')}</tr>`).join('')}</tbody></table></div>
  <p class="hint mt">🔒 A lock means the school's rules fix this setting. Tap the lock to see why.</p><div class="row mt"><button class="btn pri" data-a="savePerms" ${diffs.length?'':'disabled'}>Save changes</button></div></div>
  <div class="card mt"><h3>Recent changes</h3><p class="hint mb">Every change is recorded: who made it and when.</p><div class="list">${S.permLog.slice(0,6).map(l=>`<div class="item"><span>${esc(l.text)} <span class="muted">· by ${esc(l.by)}</span></span><span class="muted small">${fmtWhen(l.ts)}</span></div>`).join('')}</div></div>
  <div class="card tint mt"><h3>Fixed by the school</h3><ul style="margin:0;padding-left:20px"><li>Nobody can edit certified GPA or grades here.</li><li>Students cannot verify their own entries.</li><li>Administrators always keep access to accounts and permissions.</li><li>Supervisors only see the students linked to them.</li></ul></div>`}
actions.togPerm=el=>{const c=ui.pd[el.dataset.k][el.dataset.role];c.v=!c.v;render()};
actions.undoPerms=()=>{ui.pd=clone(S.perms);render()};
actions.lockWhy=el=>{const r=PROWS.find(x=>x.k===el.dataset.k);openModal('Why is this locked?',()=>`<p><b>${esc(r.l)}</b></p><p class="mt">${esc(r.why||'The school\'s rules fix this setting, so it can\'t be changed here.')}</p><div class="row mt"><button class="btn pri" data-a="closeModal">Got it</button></div>`)};
actions.savePerms=()=>{if(!need('change_perms'))return;const u=me(),roles=new Set(),msgs=[];PROWS.forEach(r=>{if(!r.k)return;PROLES.forEach(role=>{const a=S.perms[r.k][role],b=ui.pd[r.k][role];if(a&&b&&a.v!==b.v){roles.add(PLABEL[role]+'s');msgs.push(`${PLABEL[role]}s ${b.v?'can now':'can no longer'} ${r.l.charAt(0).toLowerCase()+r.l.slice(1)}`)}})});
  if(!msgs.length)return;S.perms=clone(ui.pd);msgs.forEach(m=>S.permLog.unshift({ts:Date.now(),by:u.name,text:m}));addLog('Permissions changed for '+[...roles].join(', '));save();render();toast('Permissions saved. They apply the next time people sign in.')};

/* reports */
const REP_TYPES=[['progress','Student progress','How students are doing across grades and credits.'],['complete','Portfolio completeness','Who has projects, achievements, leadership and activities filled in.'],['compliance','Compliance checks','Entries waiting too long and letters past their due date.'],['attach','Attachment progress','Where each student is on attachment, and the latest supervisor note.']];
const repSpec=f=>({type:f['rep.type']||'progress',group:f['rep.group']||'all',period:f['rep.period']||'cur',grades:f['rep.grades']!==undefined?f['rep.grades']:true,credits:f['rep.credits']!==undefined?f['rep.credits']:true,acts:f['rep.acts']!==undefined?f['rep.acts']:true,comp:f['rep.comp']!==undefined?f['rep.comp']:true});
const groupLabel=g=>g==='all'?'All years':'Year '+g;
function repData(sp){
  let st=students();if(sp.group!=='all')st=st.filter(s=>String(s.year)===String(sp.group));
  const waitOld=s=>myActs(s.id).filter(a=>a.status!=='verified'&&Date.now()-a.created>OLD).length,late=s=>S.letters.filter(l=>l.sid===s.id&&openLetters(l)&&l.due<Date.now()).length;
  let cols=['Student','School ID','Year'],rows;
  if(sp.type==='progress'){if(sp.grades)cols.push('Overall GPA','Latest semester GPA');if(sp.credits)cols.push('Credits earned');if(sp.acts)cols.push('Activities','Verified');if(sp.comp)cols.push('Entries waiting 30+ days','Letters past due');
    rows=st.map(s=>{const a=myActs(s.id),r=[s.name,s.schoolId,s.year];if(sp.grades)r.push(s.overall==null?'–':fmt2(s.overall),s.gpas.length?fmt2(semGpa(s,s.gpas.length-1)):'–');if(sp.credits)r.push(creditsDone(s)+' of 120');if(sp.acts)r.push(a.length,a.filter(x=>x.status==='verified').length);if(sp.comp)r.push(waitOld(s),late(s));return r})}
  else if(sp.type==='complete'){cols.push('Projects','Achievements','Leadership','Extracurricular','Complete');rows=st.map(s=>{const a=myActs(s.id),c=t=>a.filter(x=>x.type===t).length;return [s.name,s.schoolId,s.year,myProjects(s.id).length,c('achievement'),c('leadership'),c('extra'),isComplete(s.id)?'Yes':'No']})}
  else if(sp.type==='compliance'){cols.push('Unverified entries','Waiting 30+ days','Letters past due');rows=st.map(s=>[s.name,s.schoolId,s.year,myActs(s.id).filter(a=>a.status!=='verified').length,waitOld(s),late(s)])}
  else{cols=['Student','School ID','Supervisor','Company','Week','Latest note'];rows=st.filter(s=>s.attach).map(s=>{const n=S.notes.filter(x=>x.sid===s.id).sort((a,b)=>b.wk-a.wk)[0],sup=user(s.attach.supId);return [s.name,s.schoolId,sup?sup.name:'–',s.attach.company,`${attWeek(s.attach)} of ${attWeeks(s.attach)}`,n?`Week ${n.wk}: ${n.text}`:'No notes yet']})}
  const gp=st.filter(s=>s.overall!=null);
  return {cols,rows,stats:{n:st.length,gpa:gp.length?gp.reduce((a,s)=>a+s.overall,0)/gp.length:null,cr:st.length?Math.round(st.reduce((a,s)=>a+creditsDone(s),0)/st.length):0,old:st.reduce((a,s)=>a+waitOld(s),0)}}}
const repTable=(d,lim)=>`<div class="tw"><table><thead><tr>${d.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${d.rows.slice(0,lim||999).map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')||`<tr><td colspan="${d.cols.length}" class="muted">No students match these choices.</td></tr>`}</tbody></table></div>`;
const csvOf=d=>[d.cols,...d.rows].map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
function reportsPage(u){
  const sp=repSpec(F),t=REP_TYPES.find(x=>x[0]===sp.type),d=repData(sp),fmtSel=fv('rep.fmt','PDF');
  return `${crumbs([['Home','/admin'],['Reports']])}<div class="pagehead"><div><h1>Reports</h1><p class="sub">Build a report, check the preview, then export it.</p></div></div>
  <div class="grid g2"><div class="card"><h3>Build your report</h3>
   ${selF('rep.type',REP_TYPES.map(x=>[x[0],x[1]]),{label:'What kind of report?',r:1,hint:t[2]})}
   ${selF('rep.group',[['all','All years'],...[1,2,3,4].map(y=>[String(y),'Year '+y])],{label:'Which students?',r:1})}
   ${selF('rep.period',[['cur',`This academic year (${CUR_YEAR})`],['prev',`Last academic year (${PREV_YEAR})`]],{label:'Which period?',r:1,hint:sp.period==='prev'?`Earlier years aren't loaded in this prototype, so the figures below are today's records.`:''})}
   ${sp.type==='progress'?`<div class="field ${ui.err['rep.inc']?'has-err':''}"><label>What should it include?</label>${chk('rep.grades','Grades and GPA',sp.grades,1)}${chk('rep.credits','Credits earned',sp.credits,1)}${chk('rep.acts','Activities and achievements',sp.acts,1)}${chk('rep.comp','Compliance checks',sp.comp,1)}${ui.err['rep.inc']?`<div class="errmsg">${esc(ui.err['rep.inc'])}</div>`:''}</div>`:`<p class="hint mb">This report has a fixed layout.</p>`}
   <div class="field"><label>Save it as</label><div class="tabs">${['PDF','Excel','CSV'].map(f=>`<button data-a="setF" data-k="rep.fmt" data-v="${f}" aria-pressed="${fmtSel===f}">${f}</button>`).join('')}</div></div>
   <button class="btn pri" data-a="exportReport">Export report</button><p class="hint mt">Reports contain student records. Only share them with people who are allowed to see them.</p></div>
  <div class="card"><h3>Preview</h3><p class="hint mb">Live figures from today's records.</p><h4>${esc(t[1])}</h4><p class="muted mb">${groupLabel(sp.group)} · This academic year (${CUR_YEAR})</p>
   <div class="list"><div class="item"><span>Students included</span><b>${d.stats.n}</b></div><div class="item"><span>Average overall GPA</span><b>${d.stats.gpa==null?'–':d.stats.gpa.toFixed(2)}</b></div><div class="item"><span>Average credits earned</span><b>${d.stats.cr} of 120</b></div><div class="item"><span>Entries waiting over 30 days</span><b>${d.stats.old}</b></div></div>
   <div class="mt">${repTable(d,4)}${d.rows.length>4?`<p class="hint mt">and ${d.rows.length-4} more in the export.</p>`:''}</div></div></div>
  <div class="card mt"><h3>Recent reports</h3>${S.reports.length?`<div class="list">${S.reports.slice(0,5).map(r=>`<div class="item"><div class="row"><span class="chip info">${r.fmt==='Excel'?'XLS':r.fmt}</span><div><b>${esc(r.name)}</b><div class="muted small">${fmtD(r.ts)} · ${r.fmt}</div></div></div><button class="btn sm" data-a="reopenReport" data-id="${r.id}">Download again</button></div>`).join('')}</div>`:'<div class="empty">No reports yet. Build one above and export it.</div>'}</div>`}
function reportModal(r){const sp=repSpec(r.f),d=repData(sp);
  openModal(r.name,()=>`<p class="muted mb">${r.fmt==='PDF'?'Use "Print or save as PDF" to keep this report.':`In the live system this downloads as ${r.fmt==='Excel'?'an Excel file':'a CSV file'}. Here, copy the CSV below and paste it into ${r.fmt==='Excel'?'Excel':'a text file'}.`}</p><div class="doc"><h2>${esc(r.name)}</h2><div class="dm">${esc(SCHOOL)} · ${groupLabel(sp.group)} · generated ${fmtDL(r.ts)}</div><div class="mt">${repTable(d)}</div></div>
  <div class="field mt noprint"><label for="csvbox">CSV</label><textarea id="csvbox" rows="4" readonly>${esc(csvOf(d))}</textarea></div><div class="row noprint"><button class="btn pri" data-a="print">Print or save as PDF</button><button class="btn" data-a="copy" data-t="csvbox">Copy CSV</button><button class="btn" data-a="closeModal">Close</button></div>`,{wide:true})}
actions.exportReport=()=>{const sp=repSpec(F);ui.err={};if(sp.type==='progress'&&!(sp.grades||sp.credits||sp.acts||sp.comp)){ui.err['rep.inc']='Tick at least one thing to include, or the report would be empty.';return fail()}
  const name=`${REP_TYPES.find(x=>x[0]===sp.type)[1]} (${groupLabel(sp.group).toLowerCase()})`;const r={id:uid('r'),name,fmt:fv('rep.fmt','PDF'),ts:Date.now(),f:{'rep.type':sp.type,'rep.group':sp.group,'rep.grades':sp.grades,'rep.credits':sp.credits,'rep.acts':sp.acts,'rep.comp':sp.comp}};
  S.reports.unshift(r);save();render();reportModal(r)};
actions.reopenReport=el=>{const r=S.reports.find(x=>x.id===el.dataset.id);if(r)reportModal(r)};

/* ======================= ROUTING ======================= */
function notFound(){return `<div class="empty">We couldn't find that page. Use the menu to get back on track.</div>`}
function pageFor(u,p){
  const r=u.role;
  if(r==='student'){if(!p.length)return studentHome(u);
    if(p[0]==='grades')return gradesPage(u);
    if(p[0]==='projects')return p[1]==='new'?projectForm(u):p[1]==='edit'?projectForm(u,p[2]):projectsPage(u);
    if(p[0]==='activities')return activitiesPage(u);if(p[0]==='letters')return lettersPage(u)}
  else if(r==='staff'){if(!p.length)return staffHome(u);
    if(p[0]==='students')return p[1]?reviewPage(u,p[1]):staffStudents(u);
    if(p[0]==='letters')return p[1]==='write'?letterEditor(u,p[2]):p[1]==='update'?letterUpdater(u,p[2]):staffLetters(u)}
  else if(r==='supervisor'){if(!p.length)return supHome(u);if(p[0]==='students')return p[1]?supPortfolio(u,p[1]):supStudentsPage(u)}
  else if(r==='admin'){if(!p.length)return adminHome(u);
    if(p[0]==='people')return can('manage_accounts')?peoplePage(u):'<div class="empty">Your role cannot manage accounts.</div>';
    if(p[0]==='permissions')return can('change_perms')?permsPage(u):'<div class="empty">Your role cannot change permissions.</div>';
    if(p[0]==='reports')return can('see_reports')?reportsPage(u):'<div class="empty">Your role cannot see reports.</div>'}
  return notFound();
}

/* ---------- start ---------- */
window.__spw={render,go,get S(){return S},set SES(v){SES=v},get SES(){return SES},get F(){return F},actions,submits,seed,user,setS(v){S=v}};
render();


})();
