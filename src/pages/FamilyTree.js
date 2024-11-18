import styled from 'styled-components';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import { buildTreeData, calculateNodePosition } from '../utils/treeUtils';
import { useEffect, useRef, useState } from 'react';
import TreeControls from '../components/TreeControls';

const FamilyTree = () => {
  const { familyData } = useFamilyTree();
  const svgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNodeClick = (member) => {
    setSelectedNode(member);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const exportTree = () => {
    const format = familyData.styles.exportFormat;
    const svgElement = svgRef.current;
    
    if (format === 'svg') {
      // 기존 SVG 내보내기
      const svgData = svgElement.outerHTML;
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      downloadFile(url, 'svg');
    } else {
      // PNG 또는 JPG로 내보내기
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      
      // SVG를 base64로 인코딩
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = familyData.styles.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // 캔버스를 이미지로 변환
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          downloadFile(url, format);
        }, `image/${format}`);
      };
      
      img.src = url;
    }
  };

  const downloadFile = (url, format) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${familyData.title || 'family-tree'}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderTree = () => {
    if (!familyData.members.length) return null;

    const treeData = buildTreeData(familyData.members);
    const nodePositions = calculateNodePosition(treeData[0]);

    return (
      <TreeSvg
        ref={svgRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {renderDefs()}
        
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {/* 연결선 그리기 */}
          {nodePositions.map(node => {
            const parent = familyData.members.find(m => m.id === node.id);
            if (!parent.parentId) return null;

            const parentPos = nodePositions.find(p => p.id === parent.parentId);
            if (!parentPos) return null;

            return (
              <line
                key={`line-${node.id}`}
                x1={parentPos.x + 60}
                y1={parentPos.y + 30}
                x2={node.x + 60}
                y2={node.y}
                stroke={familyData.styles.lineColor}
                strokeWidth="2"
              />
            );
          })}

          {/* 노드 그리기 */}
          {nodePositions.map(node => {
            const member = familyData.members.find(m => m.id === node.id);
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(member)}
                style={{ cursor: 'pointer' }}
              >
                {renderNode(node, member)}
              </g>
            );
          })}
        </g>
      </TreeSvg>
    );
  };

  const calculateHexagonPoints = (width, height) => {
    const w = width / 2;
    const h = height / 2;
    return `${w},0 ${width},${h} ${width},${height-h} ${w},${height} 0,${height-h} 0,${h}`;
  };

  const renderNode = (node, member) => {
    const isSelected = selectedNode?.id === member.id;
    const nodeWidth = 120;
    const nodeHeight = 60;

    return (
      <g>
        {renderNodeShape(isSelected, nodeWidth, nodeHeight, member)}
        <text
          x="60"
          y="35"
          textAnchor="middle"
          fill={familyData.styles.textColor}
          style={{ 
            fontFamily: `${familyData.styles.titleFont}, sans-serif`,
            fontSize: '14px'  // 노드 내 텍스트 크기
          }}
        >
          {member.name}
        </text>
      </g>
    );
  };

  const renderNodeShape = (isSelected, nodeWidth, nodeHeight, member) => {
    switch (familyData.styles.nodeShape) {
      case 'circle':
        return (
          <g>
            {familyData.styles.nodeShadow && (
              <circle
                cx={nodeWidth/2}
                cy={nodeHeight/2}
                r={nodeHeight/2}
                fill="rgba(0,0,0,0.2)"
                transform="translate(4,4)"
              />
            )}
            <circle
              cx={nodeWidth/2}
              cy={nodeHeight/2}
              r={nodeHeight/2}
              fill={familyData.styles.nodeGradient ? 
                `url(#nodeGradient-${member.id})` : 
                familyData.styles.nodeColor}
              stroke={familyData.styles.lineColor}
              strokeWidth={isSelected ? "3" : familyData.styles.nodeBorderWidth}
            />
          </g>
        );

      case 'hexagon':
        const points = calculateHexagonPoints(nodeWidth, nodeHeight);
        return (
          <g>
            {familyData.styles.nodeShadow && (
              <polygon
                points={points}
                fill="rgba(0,0,0,0.2)"
                transform="translate(4,4)"
              />
            )}
            <polygon
              points={points}
              fill={familyData.styles.nodeGradient ? 
                `url(#nodeGradient-${member.id})` : 
                familyData.styles.nodeColor}
              stroke={familyData.styles.lineColor}
              strokeWidth={isSelected ? "3" : familyData.styles.nodeBorderWidth}
            />
          </g>
        );

      case 'rounded':
        return (
          <g>
            {familyData.styles.nodeShadow && (
              <rect
                width={nodeWidth}
                height={nodeHeight}
                rx={nodeHeight/2}
                ry={nodeHeight/2}
                fill="rgba(0,0,0,0.2)"
                transform="translate(4,4)"
              />
            )}
            <rect
              width={nodeWidth}
              height={nodeHeight}
              rx={nodeHeight/2}
              ry={nodeHeight/2}
              fill={familyData.styles.nodeGradient ? 
                `url(#nodeGradient-${member.id})` : 
                familyData.styles.nodeColor}
              stroke={familyData.styles.lineColor}
              strokeWidth={isSelected ? "3" : familyData.styles.nodeBorderWidth}
            />
          </g>
        );

      default: // rectangle
        return (
          <g>
            {familyData.styles.nodeShadow && (
              <rect
                width={nodeWidth}
                height={nodeHeight}
                rx="5"
                ry="5"
                fill="rgba(0,0,0,0.2)"
                transform="translate(4,4)"
              />
            )}
            <rect
              width={nodeWidth}
              height={nodeHeight}
              rx="5"
              ry="5"
              fill={familyData.styles.nodeGradient ? 
                `url(#nodeGradient-${member.id})` : 
                familyData.styles.nodeColor}
              stroke={familyData.styles.lineColor}
              strokeWidth={isSelected ? "3" : familyData.styles.nodeBorderWidth}
            />
          </g>
        );
    }
  };

  const renderDefs = () => (
    <defs>
      {familyData.members.map(member => (
        <linearGradient
          key={member.id}
          id={`nodeGradient-${member.id}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            style={{
              stopColor: familyData.styles.nodeColor,
              stopOpacity: 1
            }}
          />
          <stop
            offset="100%"
            style={{
              stopColor: adjustColor(familyData.styles.nodeColor, -20),
              stopOpacity: 1
            }}
          />
        </linearGradient>
      ))}
    </defs>
  );

  const adjustColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (svgRef.current) {
      const bbox = svgRef.current.getBBox();
      svgRef.current.setAttribute('viewBox', `${bbox.x - 20} ${bbox.y - 20} ${bbox.width + 40} ${bbox.height + 40}`);
    }
  }, [familyData.members]);

  return (
    <TreeContainer 
      style={{ 
        backgroundColor: familyData.styles.backgroundColor,
        fontFamily: `${familyData.styles.titleFont}, sans-serif`  // 전체 컨테이너에 폰트 적용
      }}
    >
      <Header>
        <BackButton onClick={() => window.location.href = '/'}>
          ← 설정으로
        </BackButton>
        <Title 
          fontSize={familyData.styles.titleSize}
          fontFamily={familyData.styles.titleFont}
          color={familyData.styles.titleColor}
        >
          {familyData.title}
        </Title>
        <ExportButton onClick={exportTree}>내보내기</ExportButton>
      </Header>
      
      <TreeContent>
        {renderTree()}
      </TreeContent>

      <TreeControls
        zoom={zoom}
        setZoom={setZoom}
        onReset={handleReset}
      />

      {selectedNode && (
        <NodeDetail>
          <h3>구성원 정보</h3>
          <p>이름: {selectedNode.name}</p>
          {selectedNode.parentId && (
            <p>부모: {familyData.members.find(m => m.id === selectedNode.parentId)?.name}</p>
          )}
          <CloseButton onClick={() => setSelectedNode(null)}>닫기</CloseButton>
        </NodeDetail>
      )}
    </TreeContainer>
  );
};

const TreeContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: ${props => props.fontSize}pt;
  font-family: ${props => props.fontFamily}, sans-serif;
  color: ${props => props.color};
  margin: 0;
  text-align: center;
  flex-grow: 1;
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #5a6268;
  }
`;

const ExportButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #218838;
  }
`;

const TreeContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const TreeSvg = styled.svg`
  width: 100%;
  height: 600px;
  user-select: none;
`;

const NodeDetail = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 200px;
  font-family: inherit; // 부모로부터 폰트 상속
`;

const CloseButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #c82333;
  }
`;

export default FamilyTree;