import React from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { BaseModal } from '../base-modal';

/**
 * Example component demonstrating basic usage of BaseModal
 */
export const BasicModalExample: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div>
      <button onClick={() => setVisible(true)}>
        Open Basic Modal
      </button>

      <BaseModal
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Basic Modal Example"
        titleIcon={<SettingOutlined />}
        modalId="basic-example"
        guidanceText="This is a basic modal example with drag & drop functionality"
      >
        <div style={{ padding: '20px' }}>
          <h3>Basic Modal Content</h3>
          <p>This modal demonstrates the basic features of BaseModal:</p>
          <ul>
            <li>Drag & drop by clicking on the title</li>
            <li>Position persistence</li>
            <li>Guidance toggle</li>
            <li>Keyboard navigation (ESC to close)</li>
          </ul>
        </div>
      </BaseModal>
    </div>
  );
};

/**
 * Example component demonstrating advanced features
 */
export const AdvancedModalExample: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setHasChanges(false);
  };

  return (
    <div>
      <button onClick={() => setVisible(true)}>
        Open Advanced Modal
      </button>

      <BaseModal
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Advanced Modal Example"
        titleIcon={<SettingOutlined />}
        modalId="advanced-example"
        isLoading={isLoading}
        hasUnsavedChanges={hasChanges}
        guidanceText="Advanced modal with loading states and unsaved changes tracking"
        width={700}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <button onClick={() => setHasChanges(!hasChanges)}>
              Toggle Changes
            </button>
            <div>
              <button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                style={{
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  padding: '6px 15px',
                  borderRadius: '4px'
                }}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        }
      >
        <div style={{ padding: '20px' }}>
          <h3>Advanced Features</h3>
          <p>This modal demonstrates advanced features:</p>
          <ul>
            <li>Loading overlay when saving</li>
            <li>Unsaved changes indicator</li>
            <li>Custom footer</li>
            <li>Larger width</li>
          </ul>

          <div style={{ marginTop: '20px' }}>
            <label>
              <input
                type="checkbox"
                checked={hasChanges}
                onChange={(e) => setHasChanges(e.target.checked)}
              />
              Has unsaved changes
            </label>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

/**
 * Example component demonstrating non-draggable modal
 */
export const StaticModalExample: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div>
      <button onClick={() => setVisible(true)}>
        Open Static Modal
      </button>

      <BaseModal
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Static Modal (No Drag)"
        modalId="static-example"
        draggable={false}
        showGuidanceToggle={false}
        mask={true}
        className="static-modal"
      >
        <div style={{ padding: '20px' }}>
          <h3>Static Modal</h3>
          <p>This modal cannot be dragged and has:</p>
          <ul>
            <li>No drag functionality</li>
            <li>No guidance toggle</li>
            <li>Background mask</li>
            <li>Custom CSS class</li>
          </ul>
        </div>
      </BaseModal>
    </div>
  );
};

/**
 * Main example component showcasing all examples
 */
export const BaseModalExamples: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>BaseModal Examples</h1>
      <p>Click the buttons below to see different BaseModal configurations:</p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <BasicModalExample />
        <AdvancedModalExample />
        <StaticModalExample />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Usage Tips:</h2>
        <ul>
          <li>Each modal has a unique <code>modalId</code> to persist position separately</li>
          <li>Drag modals by clicking and holding the title bar</li>
          <li>Use ESC key to close modals</li>
          <li>Toggle guidance text using the eye icon in the footer</li>
          <li>Modal positions are saved to localStorage</li>
        </ul>
      </div>
    </div>
  );
};

export default BaseModalExamples;