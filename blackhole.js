(() => {
  const host = document.querySelector('.bh');
  if (!host) return;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) return;

  const ASPECT = 1.75;
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uElev; uniform float uRoll;
const float RIN = 3.2;
const float ROUT = 15.0;

float hash(vec3 p){ p = fract(p*0.3183099 + vec3(.1,.2,.3)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i), hash(i+vec3(1.,0.,0.)), f.x), mix(hash(i+vec3(0.,1.,0.)), hash(i+vec3(1.,1.,0.)), f.x), f.y),
             mix(mix(hash(i+vec3(0.,0.,1.)), hash(i+vec3(1.,0.,1.)), f.x), mix(hash(i+vec3(0.,1.,1.)), hash(i+vec3(1.,1.,1.)), f.x), f.y), f.z);
}
float fbm(vec3 p){ float s = 0.0, a = 0.5; for(int i=0;i<3;i++){ s += a*noise(p); p = p*2.1 + vec3(1.7,9.2,3.1); a *= 0.5; } return s; }

vec3 palette(float t){
  vec3 c0 = vec3(0.35,0.02,0.0), c1 = vec3(0.78,0.06,0.0), c2 = vec3(1.0,0.26,0.02), c3 = vec3(1.0,0.46,0.07), c4 = vec3(1.0,0.64,0.20);
  vec3 c = mix(c0, c1, smoothstep(0.0,0.3,t));
  c = mix(c, c2, smoothstep(0.25,0.55,t));
  c = mix(c, c3, smoothstep(0.5,0.85,t));
  return mix(c, c4, smoothstep(0.85,1.2,t)) * vec3(1.0, 0.55, 0.35);
}

void main(){
  vec2 uv = (gl_FragCoord.xy*2.0 - uRes) / uRes.x;
  float cr = cos(uRoll), sr = sin(uRoll);
  uv = mat2(cr, sr, -sr, cr) * uv;

  float D = 40.0;
  vec3 ro = vec3(0.0, D*sin(uElev), -D*cos(uElev));
  vec3 f = normalize(-ro);
  vec3 rt = normalize(cross(f, vec3(0.0,1.0,0.0)));
  vec3 up = cross(rt, f);
  vec3 rd = normalize(f + (uv.x*rt + uv.y*up) * 0.3875);

  vec3 p = ro, v = rd;
  vec3 L = cross(p, v);
  float h2 = dot(L, L);

  vec3 col = vec3(0.0);
  float T = 1.0;
  bool hole = false, escaped = false;

  for(int i=0;i<380;i++){
    float r = length(p);
    if(r < 1.0){ hole = true; break; }
    if(r > 70.0 && dot(p, v) > 0.0){ escaped = true; break; }
    float dt = clamp(0.06*r, 0.04, 1.5);
    vec3 a = -1.5*h2*p/(r*r*r*r*r);
    vec3 vn = normalize(v + a*dt);
    vec3 pn = p + vn*dt;
    if(p.y*pn.y < 0.0){
      float k = p.y/(p.y - pn.y);
      vec3 hp = mix(p, pn, k);
      float rr = length(hp.xz);
      if(rr > RIN && rr < ROUT){
        float phi = atan(hp.z, hp.x);
        float om = 0.7071/(rr*sqrt(rr));
        float ang = phi - om*uTime*8.0;
        vec3 q = vec3(cos(ang)*1.3, sin(ang)*1.3, rr*8.0);
        float n = fbm(q);
        float dens = mix(0.45, 1.2, smoothstep(0.25, 0.75, n));
        float prof = 0.2 + 0.8*exp(-pow((rr - 6.0)/4.8, 2.0));
        float beta = sqrt(0.5/(rr - 1.0));
        vec3 vdir = normalize(vec3(hp.z, 0.0, -hp.x));
        float gam = 1.0/sqrt(1.0 - beta*beta);
        float dop = 1.0/(gam*(1.0 - beta*dot(vdir, -vn)));
        float g = dop*sqrt(1.0 - 1.0/rr);
        float I = prof*dens*pow(g, 0.9);
        vec3 c = palette(prof*pow(g, 0.4)*(0.7 + 0.6*dens))*I*2.6;
        float al = 0.97*smoothstep(ROUT, ROUT-4.0, rr)*smoothstep(RIN, RIN+0.3, rr);
        col += T*c*al;
        T *= (1.0 - al);
      }
    }
    p = pn; v = vn;
  }
  if(!escaped) hole = true;

  float alpha = hole ? 1.0 : 1.0 - T;
  float b = sqrt(h2);
  float pr = exp(-pow((b - 2.6)/0.025, 2.0));
  col = 1.0 - exp(-col*1.1);
  col += vec3(1.0,0.45,0.1)*pr*0.85;
  alpha = max(alpha, pr*0.9);
  col = min(col, vec3(alpha));
  gl_FragColor = vec4(col, alpha);
}`;

  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : (console.warn(gl.getShaderInfoLog(s)), null); };
  const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'uRes'), uTime = gl.getUniformLocation(prog, 'uTime'),
        uElev = gl.getUniformLocation(prog, 'uElev'), uRoll = gl.getUniformLocation(prog, 'uRoll');

  canvas.className = 'bh__canvas';
  host.appendChild(canvas);
  host.classList.add('bh--gl');

  const resize = () => {
    const w = Math.min(Math.round(host.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5)), 1100);
    const h = Math.round(w / ASPECT);
    if (w > 0 && canvas.width !== w) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  };
  const draw = (ms) => {
    const t = ms / 1000;
    resize();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform1f(uElev, (4.2 + 1.2*Math.sin(t*0.25)) * Math.PI/180);
    gl.uniform1f(uRoll, 0.0);
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(12000); return; }
  let visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(host);
  const loop = (ms) => { if (visible && !document.hidden) draw(ms); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
})();
