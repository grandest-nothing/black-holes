(() => {
  if(document.getElementById('ambient-toggle'))return;
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
  const style=document.createElement('style');style.textContent=`
    #ambient-toggle{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(10px,env(safe-area-inset-bottom));z-index:170;min-height:44px;padding:10px 12px;border:0;background:transparent;color:#9a9aa6;font:700 .65rem/1.4 Inter,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;touch-action:manipulation}
    #ambient-toggle:hover,#ambient-toggle[aria-pressed="true"]{color:#ffd9b0}
    #ambient-toggle:focus-visible{outline:2px solid #ff8a3d;outline-offset:2px;border-radius:4px}
  `;document.head.append(style);
  const button=document.createElement('button');button.id='ambient-toggle';button.type='button';button.textContent='Sound off';button.setAttribute('aria-label','Enable quiet ambient sound');button.setAttribute('aria-pressed','false');document.body.append(button);
  let ctx,master,bus,enabled=false,noteTimer=0,sleepTimer=0,step=0;
  function label(){button.textContent=enabled?'Sound on':'Sound off';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Mute quiet ambient sound':'Enable quiet ambient sound');}
  function build(){
    ctx=new Audio();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
    bus=ctx.createBiquadFilter();bus.type='lowpass';bus.frequency.value=950;bus.Q.value=.4;bus.connect(master);
    const reverb=ctx.createConvolver(),impulse=ctx.createBuffer(2,Math.floor(ctx.sampleRate*3.5),ctx.sampleRate);
    for(let c=0;c<2;c++){const data=impulse.getChannelData(c);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,3)*.35;}
    reverb.buffer=impulse;const wet=ctx.createGain();wet.gain.value=.28;bus.connect(reverb);reverb.connect(wet);wet.connect(master);
    [55,110,164.8138,220,261.6256].forEach((hz,i)=>{
      const tone=ctx.createOscillator(),gain=ctx.createGain(),breath=ctx.createOscillator(),depth=ctx.createGain();
      tone.type=i===1?'triangle':'sine';tone.frequency.value=hz;tone.detune.value=i%2?2:-2;gain.gain.value=i===0?.065:.035;
      breath.frequency.value=.018+i*.006;depth.gain.value=.008;breath.connect(depth);depth.connect(gain.gain);tone.connect(gain);gain.connect(bus);tone.start();breath.start();
    });
  }
  function fade(value,seconds){const now=ctx.currentTime;const param=master.gain;if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(now);else{const current=param.value;param.cancelScheduledValues(now);param.setValueAtTime(current,now);}param.linearRampToValueAtTime(value,now+seconds);}
  function notes(){
    clearTimeout(noteTimer);if(!enabled||document.hidden||ctx.state!=='running')return;
    const now=ctx.currentTime,hz=[329.6276,440,391.9954,523.2511][step++%4],tone=ctx.createOscillator(),gain=ctx.createGain();tone.type='sine';tone.frequency.value=hz;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.016,now+3);gain.gain.linearRampToValueAtTime(0,now+11);tone.connect(gain);gain.connect(bus);tone.start(now);tone.stop(now+12);tone.onended=()=>{tone.disconnect();gain.disconnect();};noteTimer=setTimeout(notes,18000+Math.random()*10000);
  }
  async function start(){clearTimeout(sleepTimer);if(!ctx)build();await ctx.resume();if(!enabled||document.hidden)return;fade(.24,3);notes();}
  button.addEventListener('click',async()=>{
    button.disabled=true;
    try{enabled=!enabled;label();if(enabled)await start();else if(ctx){clearTimeout(noteTimer);fade(0,1.8);sleepTimer=setTimeout(()=>{if(!enabled)ctx.suspend().catch(()=>{});},1900);}}
    catch(error){enabled=false;label();if(ctx)ctx.suspend().catch(()=>{});button.title='Audio could not start. Tap to try again.';}
    finally{button.disabled=false;}
  });
  function pause(){clearTimeout(noteTimer);clearTimeout(sleepTimer);if(ctx){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(0,ctx.currentTime);ctx.suspend().catch(()=>{});}}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else if(enabled)start().catch(()=>{enabled=false;label();});});
  window.addEventListener('pagehide',pause);window.addEventListener('pageshow',()=>{if(enabled&&!document.hidden)start().catch(()=>{enabled=false;label();});});
})();
