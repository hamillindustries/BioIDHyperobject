import curlNoise from "./fragments/curlNoise.glsl";

export default `
#extension GL_EXT_draw_buffers : require 

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texturePos;
uniform sampler2D textureVel;
uniform sampler2D textureExtra;
uniform float uSeed;
uniform float uNoise;
uniform vec3 uGrowDir;

${curlNoise}

void main(void) {
    vec3 pos = texture2D(texturePos, vTextureCoord).xyz;
    vec3 vel = texture2D(textureVel, vTextureCoord).xyz;
    vec3 extra = texture2D(textureExtra, vTextureCoord).xyz;

    vec3 offset = (extra - 0.5) * 0.01;
    vec3 acc = uGrowDir;
    vec3 noise = curlNoise(pos * 0.25 * uNoise + offset + uSeed);
    acc += noise;

    pos += acc * 0.075;
    
    gl_FragData[0] = vec4(pos, 1.0);
	gl_FragData[1] = vec4(vel, 1.0);
	gl_FragData[2] = vec4(extra, 1.0);
}
`;
