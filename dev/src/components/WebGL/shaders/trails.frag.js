import diffuse from "./fragments/diffuse.glsl";

export default `

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec4 vExtra;
varying vec3 vPosition;
varying float vDebug;

uniform float uOffset;
uniform sampler2D texture;

#define LIGHT vec3(1.0, 0.2, -1.0)
${diffuse}


#define FOG_DENSITY 0.2
float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}

float map(float v, float a, float b, float c, float d) {
    float p = (v - a ) / ( b - a);
    p = clamp(p, 0.0, 1.0);
    return c + p * ( d - c);
}

void main(void) {
    float d = diffuse(vNormal, LIGHT, .5);

    vec2 uv = vec2(vExtra.z, 0.5);
    vec3 color = texture2D(texture, uv).rgb;

    float r = 3.5;
    float z = map(vPosition.z + 3.0, -r, r, 0.0, 1.0);
    z = pow(z, 1.5);

    float br = mix(0.7, 1.25, vExtra.w) + 0.2;
    color *= d * z * br;

    gl_FragColor = vec4(color, 1.0);
}
`;
