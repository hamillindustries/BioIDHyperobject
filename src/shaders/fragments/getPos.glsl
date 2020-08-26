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


#pragma glslify: export(getPos)