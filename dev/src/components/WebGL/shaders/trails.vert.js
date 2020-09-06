import rotate from "./fragments/rotate.glsl";
import align from "./fragments/align.glsl";

export default `
precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec4 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform float uRadius;
uniform float uSetPercent;
uniform float uNumSets;
uniform float uOffset;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform sampler2D texture5;
uniform sampler2D texture6;
uniform sampler2D texture7;
uniform sampler2D texture8;
uniform sampler2D texture9;
uniform sampler2D texture10;
uniform sampler2D texture11;
uniform sampler2D texture12;
uniform sampler2D texture13;
uniform sampler2D texture14;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vNormalOrg;
varying vec4 vExtra;
varying vec3 vPosition;
varying float vDebug;

#define PI 3.141592653

vec3 getPos(float index, vec2 uv) {
  vec3 pos = vec3(0.0);
  if(index < 0.5) {
    pos = texture2D(texture0, uv).xyz;
  } else if(index < 1.5) {
    pos = texture2D(texture1, uv).xyz;
  } else if(index < 2.5) {
    pos = texture2D(texture2, uv).xyz;
  } else if(index < 3.5) {
    pos = texture2D(texture3, uv).xyz;
  } else if(index < 4.5) {
    pos = texture2D(texture4, uv).xyz;
  } else if(index < 5.5) {
    pos = texture2D(texture5, uv).xyz;
  } else if(index < 6.5) {
    pos = texture2D(texture6, uv).xyz;
  } else if(index < 7.5) {
    pos = texture2D(texture7, uv).xyz;
  } else if(index < 8.5) {
    pos = texture2D(texture8, uv).xyz;
  } else if(index < 9.5) {
    pos = texture2D(texture9, uv).xyz;
  } else if(index < 10.5) {
    pos = texture2D(texture10, uv).xyz;
  } else if(index < 11.5) {
    pos = texture2D(texture11, uv).xyz;
  } else if(index < 12.5) {
    pos = texture2D(texture12, uv).xyz;
  } else if(index < 13.5) {
    pos = texture2D(texture13, uv).xyz;
  } else {
    pos = texture2D(texture14, uv).xyz;
  }

  return pos;
}

vec3 getDir(float index, vec2 uv) {
    vec3 dir = vec3(1.0, 0.0, 0.0);
    if(index < 13.5) {
        dir = getPos(index + 1.0, uv) - getPos(index, uv);
    } else {
        dir = getPos(index, uv) - getPos(index - 1.0, uv);
    }
    return normalize(dir);
}

${rotate}
${align}

void main(void) {

    float offset = uOffset * 2.0 - aPosOffset.w;
    offset = clamp(offset, 0.0, 1.0);

    float t = aTextureCoord.x / uNumSets;
    float debug = 1.0 - (t + uSetPercent);
    float radiusScale = smoothstep(0.0, 0.5, debug);
    float openingScale = smoothstep(offset, offset + 0.1, debug);
    vDebug = debug;

    vec3 pos = vec3(0.0, uRadius * radiusScale * openingScale, 0.0);
    float a = aTextureCoord.y * PI * 2.0;
    pos.yz = rotate(pos.yz, -a);

    vec3 dir = getDir(aVertexPosition.x, aPosOffset.xy);
    pos = align(pos, dir);

    vec3 posOffset = getPos(aVertexPosition.x, aPosOffset.xy);
    pos += posOffset;

    vec4 wsPos = uModelMatrix * vec4(pos, 1.0);

    gl_Position = uProjectionMatrix * uViewMatrix * wsPos;
    vTextureCoord = aTextureCoord;

    vec3 n = vec3(0.0, 1.0, 0.0);
    n.yz = rotate(n.yz, -a);
    vNormal = uNormalMatrix * n;
    vNormalOrg = aNormal;
    vExtra = aPosOffset;
    vPosition = wsPos.xyz;
}
`;
