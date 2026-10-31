// Inline loader: fetches the Amplitude Browser SDK and the Session Replay plugin from Amplitude's CDN,
// only on the production hosts. Downloaded copies, local previews, tests, and visitors with
// Do Not Track / Global Privacy Control send nothing and are never recorded.
(function(){
 var hosts=['open-fde.ai','www.open-fde.ai'];
 if(!__AMPLITUDE_API_KEY__||hosts.indexOf(location.hostname)<0)return;
 if(navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||window.doNotTrack==='1')return;
 var pending=2;
 function load(src,integrity){
  var script=document.createElement('script');
  script.src=src;script.integrity=integrity;script.crossOrigin='anonymous';script.async=true;
  script.onload=script.onerror=start;
  document.head.appendChild(script);
 }
 function start(){
  if(--pending)return;
  var amplitude=window.amplitude;
  if(!amplitude)return;
  // Session Replay is optional: analytics still starts if the plugin fails to load.
  // Medium masking hides everything typed into inputs; the remote sample rate in Amplitude overrides this one.
  if(window.sessionReplay&&window.sessionReplay.plugin)amplitude.add(window.sessionReplay.plugin({sampleRate:__REPLAY_SAMPLE_RATE__,privacyConfig:{defaultMaskLevel:'medium'}}));
  amplitude.init(__AMPLITUDE_API_KEY__,{serverZone:__AMPLITUDE_SERVER_ZONE__,autocapture:{attribution:true,pageViews:true,sessions:true,formInteractions:false,fileDownloads:false,elementInteractions:false}});
  function send(event){amplitude.track(event.name,event.props);}
  window.addEventListener('openfde:track',function(event){send(event.detail);});
  (window.__openfdeQueue||[]).splice(0).forEach(send);
  window.__openfdeReady=true;
 }
 load(__AMPLITUDE_SDK_URL__,__AMPLITUDE_SDK_SRI__);
 load(__REPLAY_PLUGIN_URL__,__REPLAY_PLUGIN_SRI__);
})();
