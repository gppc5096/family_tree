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

  const colorOptions = [
    { key: 'backgroundColor', label: '배경 색상' },
    { key: 'lineColor', label: '선 색상' },
    { key: 'nodeColor', label: '노드 색상' },
    { key: 'textColor', label: '텍스트 색상' }
  ];

  return (
    <StyleContainer>
      <StyleSection>
        <SectionTitle>색상 설정</SectionTitle>
        <ColorOptionsContainer>
          <ColorGrid>
            {colorOptions.map(({ key, label }) => (
              <ColorOption key={key}>
                <Label>{label}</Label>
                <ColorPreview
                  color={familyData.styles[key]}
                  onClick={() => setActiveColor(activeColor === key ? null : key)}
                />
              </ColorOption>
            ))}
          </ColorGrid>
          {activeColor && (
            <FixedPickerContainer>
              <ChromePicker
                color={familyData.styles[activeColor]}
                onChange={(color) => handleColorChange(color, activeColor)}
              />
            </FixedPickerContainer>
          )}
        </ColorOptionsContainer>
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

      <StyleSection>
        <SectionTitle>내보내기 설정</SectionTitle>
        <Label>파일 형식</Label>
        <Select
          value={familyData.styles.exportFormat}
          onChange={(e) => handleStyleChange('exportFormat', e.target.value)}
        >
          <option value="svg">SVG (벡터 이미지)</option>
          <option value="png">PNG (투명 배경 지원)</option>
          <option value="jpeg">JPG (작은 파일 크기)</option>
        </Select>
        <FormatDescription>
          {familyData.styles.exportFormat === 'svg' && 
            '벡터 이미지 형식으로, 크기를 자유롭게 조절할 수 있습니다.'}
          {familyData.styles.exportFormat === 'png' && 
            '투명 배경을 지원하는 고품질 이미지 형식입니다.'}
          {familyData.styles.exportFormat === 'jpeg' && 
            '작은 파일 크기로 저장되는 이미지 형식입니다.'}
        </FormatDescription>
      </StyleSection>
    </StyleContainer>
  );
};

const StyleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ColorOptionsContainer = styled.div`
  position: relative;
  min-height: auto;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ColorOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FixedPickerContainer = styled.div`
  position: fixed;
  top: 60%;
  left: 310px;
  transform: translateY(-50%);
  z-index: 1000;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Label = styled.div`
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
`;

const ColorPreview = styled.div`
  width: 100%;
  height: 40px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background-color: ${props => props.color};
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
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

const FormatDescription = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
  font-style: italic;
`;

export default StyleSettings; 