import styled from 'styled-components';
import { ChromePicker } from 'react-color';
import { useState } from 'react';
import { useFamilyTree } from '../contexts/FamilyTreeContext';

const StyleSettings = () => {
  const { familyData, updateFamilyData } = useFamilyTree();
  const [activeColor, setActiveColor] = useState(null);

  const handleColorChange = (color, type) => {
    updateFamilyData({
      ...familyData,
      styles: {
        ...familyData.styles,
        [type]: color.hex
      }
    });
  };

  const handleStyleChange = (type, value) => {
    updateFamilyData({
      ...familyData,
      styles: {
        ...familyData.styles,
        [type]: value
      }
    });
  };

  const googleFonts = [
    { name: 'Noto Sans KR', label: '노토 산스' },
    { name: 'Nanum Gothic', label: '나눔 고딕' },
    { name: 'Nanum Myeongjo', label: '나눔 명조' },
    { name: 'Poor Story', label: '푸어 스토리' },
    { name: 'Sunflower', label: '선플라워' }
  ];

  return (
    <StyleContainer>
      <StyleSection>
        <SectionTitle>색상 설정</SectionTitle>
        {Object.entries(familyData.styles).map(([key, value]) => {
          if (['backgroundColor', 'lineColor', 'nodeColor', 'textColor', 'titleColor'].includes(key)) {
            return (
              <ColorOption key={key}>
                <Label>
                  {key === 'backgroundColor' && '배경 색상'}
                  {key === 'lineColor' && '선 색상'}
                  {key === 'nodeColor' && '노드 색상'}
                  {key === 'textColor' && '텍스트 색상'}
                  {key === 'titleColor' && '제목 색상'}
                </Label>
                <ColorPreview
                  color={value}
                  onClick={() => setActiveColor(activeColor === key ? null : key)}
                />
                {activeColor === key && (
                  <PickerContainer>
                    <ChromePicker
                      color={value}
                      onChange={(color) => handleColorChange(color, key)}
                    />
                  </PickerContainer>
                )}
              </ColorOption>
            );
          }
          return null;
        })}
      </StyleSection>

      <StyleSection>
        <SectionTitle>노드 스타일</SectionTitle>
        <Label>노드 모양</Label>
        <Select
          value={familyData.styles.nodeShape}
          onChange={(e) => handleStyleChange('nodeShape', e.target.value)}
        >
          <option value="rectangle">사각형</option>
          <option value="rounded">둥근 사각형</option>
          <option value="circle">원형</option>
          <option value="hexagon">육각형</option>
        </Select>

        <Label>그림자 효과</Label>
        <input
          type="checkbox"
          checked={familyData.styles.nodeShadow}
          onChange={(e) => handleStyleChange('nodeShadow', e.target.checked)}
        />

        <Label>그라데이션 효과</Label>
        <input
          type="checkbox"
          checked={familyData.styles.nodeGradient}
          onChange={(e) => handleStyleChange('nodeGradient', e.target.checked)}
        />

        <Label>테두리 두께</Label>
        <input
          type="range"
          min="1"
          max="5"
          value={familyData.styles.nodeBorderWidth}
          onChange={(e) => handleStyleChange('nodeBorderWidth', parseInt(e.target.value))}
        />
      </StyleSection>

      <StyleSection>
        <SectionTitle>제목 스타일</SectionTitle>
        
        <Label>제목 색상</Label>
        <ColorOption>
          <ColorPreview
            color={familyData.styles.titleColor}
            onClick={() => setActiveColor(activeColor === 'titleColor' ? null : 'titleColor')}
          />
          {activeColor === 'titleColor' && (
            <PickerContainer>
              <ChromePicker
                color={familyData.styles.titleColor}
                onChange={(color) => handleColorChange(color, 'titleColor')}
              />
            </PickerContainer>
          )}
        </ColorOption>
        
        <Label>폰트 크기</Label>
        <RangeInput
          type="range"
          min="20"
          max="60"
          value={familyData.styles.titleSize}
          onChange={(e) => handleStyleChange('titleSize', e.target.value)}
        />
        <RangeValue>{familyData.styles.titleSize}pt</RangeValue>

        <Label>폰트</Label>
        <Select
          value={familyData.styles.titleFont}
          onChange={(e) => handleStyleChange('titleFont', e.target.value)}
        >
          {googleFonts.map(font => (
            <option 
              key={font.name} 
              value={font.name}
              style={{ fontFamily: font.name }}
            >
              {font.label}
            </option>
          ))}
        </Select>
      </StyleSection>
    </StyleContainer>
  );
};

const StyleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ColorOption = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Label = styled.div`
  margin-bottom: 0.5rem;
`;

const ColorPreview = styled.div`
  width: 100px;
  height: 30px;
  border: 1px solid #ccc;
  background-color: ${props => props.color};
  cursor: pointer;
`;

const PickerContainer = styled.div`
  position: absolute;
  z-index: 2;
  margin-top: 0.5rem;
`;

const StyleSection = styled.div`
  margin-top: 1rem;
`;

const Select = styled.select`
  margin-bottom: 0.5rem;
`;

const SectionTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const RangeInput = styled.input`
  width: 100%;
  margin-bottom: 0.5rem;
`;

const RangeValue = styled.div`
  text-align: right;
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export default StyleSettings; 