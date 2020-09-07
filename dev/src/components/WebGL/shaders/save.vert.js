export default `
precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

varying vec3 vColor;
varying vec3 vExtra;

void main(void) {
    gl_Position = vec4(aTextureCoord, 0.0, 1.0);
    vColor = aVertexPosition;
    vExtra = aNormal;

    gl_PointSize = 1.0;
}
`;
