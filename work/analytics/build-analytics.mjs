import {transformSync} from 'esbuild';
import {existsSync, readFileSync} from 'node:fs';

// Emits a small inline loader for the Amplitude Browser SDK and Session Replay plugin (served from Amplitude's CDN with SRI).
// Configure with AMPLITUDE_API_KEY (and AMPLITUDE_SERVER_ZONE=EU for EU projects), or work/analytics/config.json.
const configPath=new URL('config.json',import.meta.url);
const fileConfig=existsSync(configPath)?JSON.parse(readFileSync(configPath,'utf8')):{};
const apiKey=process.env.AMPLITUDE_API_KEY||fileConfig.apiKey||'';
const sdkUrl='https://cdn.amplitude.com/libs/analytics-browser-2.49.0-min.js.gz';
const sdkIntegrity='sha384-IyDmz4uJhRk+mG6aJ69V/h5nf3bN2rkgHJaHADJgxxEFtXKhc3ajWBgxKhrUKWgf';
const replayPluginUrl='https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.36.2-min.js.gz';
const replayPluginIntegrity='sha384-MQZ7yfJH6HUiNXw8tTpqfySLb9W1ci0zk+3H+jY6MqgsGFBpLyXN2Zak3DW50Ti3';
// Share of sessions recorded by Session Replay (0 to 1). Amplitude's remote setting overrides it.
const replaySampleRate=Number(process.env.AMPLITUDE_REPLAY_SAMPLE_RATE??fileConfig.replaySampleRate??1);
const serverZone=(process.env.AMPLITUDE_SERVER_ZONE||fileConfig.serverZone||'US').toUpperCase();

export function analyticsBlock(){
 if(!apiKey)return '';
 const {code:minified}=transformSync(readFileSync(new URL('entry.mjs',import.meta.url),'utf8'),{minify:true,target:'es2017',define:{__AMPLITUDE_API_KEY__:JSON.stringify(apiKey),__AMPLITUDE_SERVER_ZONE__:JSON.stringify(serverZone),__AMPLITUDE_SDK_URL__:JSON.stringify(sdkUrl),__AMPLITUDE_SDK_SRI__:JSON.stringify(sdkIntegrity),__REPLAY_PLUGIN_URL__:JSON.stringify(replayPluginUrl),__REPLAY_PLUGIN_SRI__:JSON.stringify(replayPluginIntegrity),__REPLAY_SAMPLE_RATE__:JSON.stringify(replaySampleRate)}});
 const code=minified.trim().replace(/<\/script/gi,'<\\/script').replace(/<!--/g,'<\\!--');
 return '<!-- analytics --><script>'+code+'</script><!-- /analytics -->';
}
