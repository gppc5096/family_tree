import styled from 'styled-components';

const TreeControls = ({ zoom, setZoom, onReset }) => {
  return (
    <ControlsContainer>
      <ControlButton onClick={() => setZoom(prev => prev + 0.1)}>
        <span>+</span>
      </ControlButton>
      <ControlButton onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}>
        <span>-</span>
      </ControlButton>
      <ControlButton onClick={onReset}>
        <span>↺</span>
      </ControlButton>
    </ControlsContainer>
  );
};

const ControlsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;

  &:hover {
    background: #0056b3;
  }
`;

export default TreeControls; 