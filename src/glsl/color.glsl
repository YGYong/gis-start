#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution; // 画布尺寸(像素)

void main() {
    // 创建纯红色 (R=1.0, G=0.0, B=0.0, A=1.0)
    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);
    
    // 必须: 将颜色输出到屏幕
    gl_FragColor = color;
}