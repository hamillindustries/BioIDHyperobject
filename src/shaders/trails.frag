// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec3 vExtra;
varying float vDebug;
// uniform vec3 uColors[5];
uniform float uOffset;
uniform sampler2D texture;

#define LIGHT vec3(1.0)
#pragma glslify: diffuse    = require(glsl-utils/diffuse.glsl)


#define FOG_DENSITY 0.2
float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}

void main(void) {
    float d = diffuse(vNormal, LIGHT, .35);

    vec2 uv = vec2(vExtra.z, 0.5);
    vec3 color = texture2D(texture, uv).rgb;

    gl_FragColor = vec4(vec3(d) * color, 1.0);
    // gl_FragColor = vec4(vec3(vDebug), 1.0);
}