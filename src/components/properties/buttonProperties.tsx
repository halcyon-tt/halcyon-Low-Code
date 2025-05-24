// src/components/properties/ButtonProperties.tsx
import { Input, Switch } from "antd";
import type { StyleConfigProps } from "./types";

export default function ButtonProperties({
  component,
  onStyleChange,
  parse,
  format,
}: StyleConfigProps) {
  return (
    <div className="button-properties">
      {/* 边框样式 */}
      <div className="style-group">
        <h4>边框样式</h4>
        <div className="property-item-row">
          <div className="property-item">
            <label>按钮宽度</label>
            <Input
              type="number"
              value={parse(component.style.width)}
              onChange={(e) =>
                onStyleChange("width", format(Number(e.target.value)))
              }
              suffix="px"
            />
          </div>
          <div className="property-item">
            <label>按钮高度</label>
            <Input
              type="number"
              value={parse(component.style.height)}
              onChange={(e) =>
                onStyleChange("height", format(Number(e.target.value)))
              }
              suffix="px"
            />
          </div>
        </div>
        <div className="property-item">
          <label>边框圆角</label>
          <Input
            type="number"
            value={parse(component.style.borderRadius)}
            onChange={(e) =>
              onStyleChange("borderRadius", format(Number(e.target.value)))
            }
            suffix="px"
          />
        </div>
      </div>

      {/* 字体样式 */}
      <div className="style-group">
        <h4>字体样式</h4>
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
            <label>文字加粗</label>
            <Switch
              checked={component.style.fontWeight === "bold"}
              onChange={(checked) =>
                onStyleChange("fontWeight", checked ? "bold" : "normal")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}