// src/components/properties/TextProperties.tsx
import { Input, ColorPicker, Select } from "antd";

import type { StyleConfigProps } from "./types";

export default function TextProperties({
  component,
  onStyleChange,
  parse,
  format,
}: StyleConfigProps) {
  return (
    <div className="text-properties">
      {/* 字体样式 */}
      <div className="style-group">
        <h4>字体样式</h4>
        <div className="property-item-row">
          <div className="property-item">
            <label>字体颜色</label>
            <ColorPicker
              value={component.style.color || "#000000"}
              onChange={(_, hex) => onStyleChange("color", hex)}
            />
          </div>
          <div className="property-item">
            <label>字体粗细</label>
            <Select
              value={component.style.fontWeight || "normal"}
              onChange={(v) => onStyleChange("fontWeight", v)}
              options={[
                { value: "normal", label: "正常" },
                { value: "bold", label: "加粗" },
              ]}
            />
          </div>
        </div>
        <div className="property-item-row">
          <div className="property-item">
            <label>字体大小</label>
            <Input
              type="number"
              value={parse(component.style.fontSize)}
              onChange={(e) =>
                onStyleChange("fontSize", format(Number(e.target.value)))
              }
              suffix="px"
            />
          </div>
          <div className="property-item">
            <label>行高</label>
            <Input
              type="number"
              value={parse(component.style.lineHeight?.toString())}
              onChange={(e) =>
                onStyleChange("lineHeight", format(Number(e.target.value)))
              }
              suffix="px"
            />
          </div>
        </div>
      </div>

      {/* 文本样式 */}
      <div className="style-group">
        <h4>文本样式</h4>
        <div className="property-item-row">
          <div className="property-item">
            <label>缩进</label>
            <Input
              type="number"
              value={parse(component.style.textIndent)}
              onChange={(e) =>
                onStyleChange("textIndent", format(Number(e.target.value)))
              }
              suffix="px"
            />
          </div>
          <div className="property-item">
            <label>字间距</label>
            <Input
              type="number"
              value={parse(component.style.letterSpacing)}
              onChange={(e) =>
                onStyleChange("letterSpacing", format(Number(e.target.value)))
              }
              suffix="px"
            />
          </div>
        </div>
        <div className="property-item">
          <label>装饰线</label>
          <Select
            mode="multiple"
            value={component.style.textDecoration?.split(" ") || []}
            onChange={(values) =>
              onStyleChange("textDecoration", values.join(" "))
            }
            options={[
              { value: "underline", label: "下划线" },
              { value: "line-through", label: "删除线" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}