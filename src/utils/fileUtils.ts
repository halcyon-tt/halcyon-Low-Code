import type { CSSProperties } from "react";
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string
) => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
// 增强版样式转换函数
export const convertComponentStyles = (styles: Record<string,  CSSProperties[keyof CSSProperties]>) => {
  // 需要单位转换的数值属性
  const unitProperties = [
    'width', 'height', 'top', 'left', 'right', 'bottom',
    'fontSize', 'borderRadius', 'borderWidth', 'padding',
    'margin', 'letterSpacing', 'textIndent', 'lineHeight'
  ];

  // CSS属性名映射表
  const cssPropertyMap: Record<string, string> = {
    justifyContent: 'justify-content',
    alignItems: 'align-items',
    flexDirection: 'flex-direction',
    zIndex: 'z-index',
    lineSpacing: 'line-spacing'
  };

  return Object.entries(styles)
    .map(([key, value]) => {
      if (value === undefined || value === null) return '';

      // 转换属性名
      const cssKey = cssPropertyMap[key] || 
        key.replace(/([A-Z])/g, '-$1').toLowerCase();

      // 处理特殊值
      let cssValue = value;

      // 处理数字单位
      if (unitProperties.includes(key)) {
        if (typeof value === 'number') {
          cssValue = `${value}px`;
        } else if (typeof value === 'string' && !isNaN(Number(value))) {
          cssValue = `${value}px`;
        }
      }

      // 处理flex布局属性值
      if (key === 'justifyContent' || key === 'alignItems') {
        cssValue = typeof value === 'string' ? value.replace('flex-', '') : value;
      }

      // 处理行高特殊逻辑
      if (key === 'lineHeight' && typeof value === 'number') {
        cssValue = value % 1 === 0 ? `${value}em` : value.toString();
      }

      // 处理背景图片
      if (key === 'backgroundImage' && value) {
        const isBase64 = typeof value === 'string' && value.startsWith('data:image');
        const isUrl = typeof value === 'string' && value.startsWith('url(');
        cssValue = isUrl ? value : 
          `url(${isBase64 ? value : `'${encodeURI(String(value))}'`})`;
      }

      return `${cssKey}: ${cssValue} !important;`;
    })
    .filter(Boolean)
    .join(' ');
};