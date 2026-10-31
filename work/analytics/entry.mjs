// Inline loader: fetches the Amplitude Browser SDK from Amplitude's CDN only on the production hosts.
// Downloaded copies, local previews, tests, and visitors with Do Not Track / Global Privacy Control send nothing.
(function(){
 var hosts=['open-fde.ai','www.open-fde.ai'];
 if(!__AMPLITUDE_API_KEY__||hosts.indexOf(location.hostname)<0)return;
 if(navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||window.doNotTrack==='1')return;
 var script=document.createElement('script');
 script.src=__AMPLITUDE_SDK_URL__;script.integrity=__AMPLITUDE_SDK_SRI__;script.crossOrigin='anonymous';script.async=true;
 script.onload=function(){
  var amplitude=window.amplitude;
  amplitude.init(__AMPLITUDE_API_KEY__,{serverZone:__AMPLITUDE_SERVER_ZONE__,autocapture:{attribution:true,pageViews:true,sessions:true,formInteractions:false,fileDownloads:false,elementInteractions:false}});
  function send(event){amplitude.track(event.name,event.props);}
  window.addEventListener('openfde:track',function(event){send(event.detail);});
  (window.__openfdeQueue||[]).splice(0).forEach(send);
  window.__openfdeReady=true;
 };
 document.head.appendChild(script);
})();
