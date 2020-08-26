#extension GL_EXT_draw_buffers : require 

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texturePos;
uniform sampler2D textureVel;
uniform sampler2D textureExtra;
uniform float uSeed;

#pragma glslify: curlNoise    = require(glsl-utils/curlNoise.glsl)

void main(void) {
    vec3 pos = texture2D(texturePos, vTextureCoord).xyz;
    vec3 vel = texture2D(textureVel, vTextureCoord).xyz;
    vec3 extra = texture2D(textureExtra, vTextureCoord).xyz;

    // vec3 acc = vec3(0.0, 1.0, 0.0);
    // vel += acc * 0.01;
    // vel *= 0.95;
    // pos.y += 0.01;

    vec3 offset = (extra - 0.5) * 0.005;
    vec3 acc = vec3(0.0, 0.5, 0.0);
    vec3 noise = curlNoise(pos * 0.25 + offset + uSeed);
    acc += noise;

    pos += acc * 0.075;
    
    gl_FragData[0] = vec4(pos, 1.0);
	gl_FragData[1] = vec4(vel, 1.0);
	gl_FragData[2] = vec4(extra, 1.0);
}