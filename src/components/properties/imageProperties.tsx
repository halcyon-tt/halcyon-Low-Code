
import { Input } from "antd";
import type { StyleConfigProps } from "./types";

export default function ImageProperties({
  component,
  onStyleChange,
  parse,
  format,
}: StyleConfigProps) {
  return (
    <div className="image-properties">
      <div className="style-group">
        <h4>尺寸设置</h4>
        <div className="property-item-row">
          <div className="property-item">
            <label>容器宽度</label>
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
            <label>容器高度</label>
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
        <div className="property-item-row">
          <div className="property-item">
            <label>图片宽度</label>
            <Input
              type="number"
              value={parse(component.style.imgWidth)}
              onChange={(e) =>
                onStyleChange("imgWidth", format(Number(e.target.value)))
              }
              suffix="px"
            />
          </div>
          <div className="property-item">
            <label>图片高度</label>
            <Input
              type="number"
              value={parse(component.style.imgHeight)}
              onChange={(e) =>
                onStyleChange("imgHeight", format(Number(e.target.value)))
              }
              suffix="px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}