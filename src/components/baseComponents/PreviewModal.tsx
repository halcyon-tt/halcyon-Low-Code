import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import ComponentRenderer from '../../store/modules/componentSlice';

export default function PreviewModal({ visible, mode, onClose, onChangeMode }) {
  const components = useSelector(state => state.components.components);
  
  return (
    <Modal
      width={mode === 'pc' ? 1200 : 375}
      bodyStyle={{
        height: '80vh',
        overflow: 'auto',
        padding: mode === 'mobile' ? '20px' : 0,
        background: mode === 'mobile' ? '#f0f2f5' : '#fff'
      }}
      title={
        <div className="preview-mode-switcher">
          <Button onClick={() => onChangeMode('pc')} type={mode === 'pc' ? 'primary' : 'text'}>
            PC预览
          </Button>
          <Button onClick={() => onChangeMode('mobile')} type={mode === 'mobile' ? 'primary' : 'text'}>
            手机预览
          </Button>
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <div className={`preview-container ${mode}`}>
        {components.map(component => (
          <ComponentRenderer
            key={component.id}
            component={component}
            mode={mode}
          />
        ))}
      </div>
    </Modal>
  )
}