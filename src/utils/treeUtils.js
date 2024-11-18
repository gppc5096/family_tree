// 트리 구조로 데이터 변환
export const buildTreeData = (members) => {
  // 루트 노드들 (부모가 없는 노드들)
  const roots = members.filter(member => !member.parentId);
  
  // 자식 노드들을 찾아서 트리 구조 생성
  const buildNode = (member) => {
    const children = members.filter(m => m.parentId === member.id);
    return {
      ...member,
      children: children.map(buildNode)
    };
  };

  return roots.map(buildNode);
};

// 트리의 각 레벨별 너비 계산
export const calculateLevelWidth = (node, level = 0, widths = []) => {
  widths[level] = (widths[level] || 0) + 1;
  node.children?.forEach(child => calculateLevelWidth(child, level + 1, widths));
  return widths;
};

// 노드의 위치 계산
export const calculateNodePosition = (node, level = 0, offset = 0, gap = 100) => {
  const nodeWidth = 120;
  const levelHeight = 100;
  
  const positions = [];
  const x = offset * (nodeWidth + gap);
  const y = level * levelHeight;
  
  positions.push({ id: node.id, x, y });
  
  let childOffset = offset - (node.children.length - 1) / 2;
  node.children.forEach(child => {
    positions.push(...calculateNodePosition(child, level + 1, childOffset, gap));
    childOffset++;
  });
  
  return positions;
}; 