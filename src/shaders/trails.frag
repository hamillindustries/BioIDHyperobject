// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec3 vExtra;
varying float vDebug;
uniform vec3 uColors[5];

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

    vec3 color = vec3(1.0);
    float index = vExtra.z * 5.0;

    if(index < 0.5) {
        color = uColors[0];
    } else if(index < 1.5) {
        color = uColors[1];
    } else if(index < 2.5) {
        color = uColors[2];
    } else if(index < 3.5) {
        color = uColors[3];
    } else {
        color = uColors[4];
    }

    gl_FragColor = vec4(vec3(d) * color, 1.0);

    float fogDistance   = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount     = fogFactorExp2(fogDistance - 10.0, FOG_DENSITY);
    fogAmount = mix(fogAmount, 1.0, .35 - vDebug * 0.1);
    fogAmount = smoothstep(0.2, 1.0, fogAmount);
    
	const vec4 fogColor = vec4(0.0, 0.0, 0.0, 1.0); // white
	
	// gl_FragColor        = mix(gl_FragColor, fogColor, fogAmount);
    // gl_FragColor.rgb *= 1.25;
    // gl_FragColor = vec4(vec3(vDebug), 1.0);
}