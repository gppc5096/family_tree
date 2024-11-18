import styled from 'styled-components';
import { useState } from 'react';
import { useFamilyTree } from '../contexts/FamilyTreeContext';

const MemberForm = () => {
  const { familyData, updateFamilyData } = useFamilyTree();
  const [member, setMember] = useState({
    id: '',
    name: '',
    parentId: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleAddMember = () => {
    if (!member.name) return;

    if (isEditing) {
      // 수정 모드: 기존 멤버 업데이트
      const updatedMembers = familyData.members.map(m => 
        m.id === member.id ? { ...member } : m
      );
      
      updateFamilyData({
        ...familyData,
        members: updatedMembers
      });
      setIsEditing(false);
    } else {
      // 추가 모드: 새 멤버 추가
      const newMember = {
        id: Date.now().toString(),
        name: member.name,
        parentId: member.parentId || null
      };

      updateFamilyData({
        ...familyData,
        members: [...familyData.members, newMember]
      });
    }

    // 폼 초기화
    setMember({ id: '', name: '', parentId: '' });
  };

  const handleEdit = (editMember) => {
    setMember({
      id: editMember.id,
      name: editMember.name,
      parentId: editMember.parentId || ''
    });
    setIsEditing(true);
  };

  const handleDelete = (memberId) => {
    if (window.confirm('정말로 이 구성원을 삭제하시겠습니까?')) {
      // 삭제할 멤버의 자식들의 parentId도 함께 제거
      const updatedMembers = familyData.members
        .filter(m => m.id !== memberId)
        .map(m => m.parentId === memberId ? { ...m, parentId: null } : m);

      updateFamilyData({
        ...familyData,
        members: updatedMembers
      });
    }
  };

  const handleCancel = () => {
    setMember({ id: '', name: '', parentId: '' });
    setIsEditing(false);
  };

  return (
    <FormContainer>
      <FormGroup>
        <Input
          type="text"
          value={member.name}
          onChange={(e) => setMember({ ...member, name: e.target.value })}
          placeholder="이름을 입력하세요"
        />
        
        <Select
          value={member.parentId}
          onChange={(e) => setMember({ ...member, parentId: e.target.value })}
        >
          <option value="">부모 선택 (선택사항)</option>
          {familyData.members
            .filter(m => m.id !== member.id) // 자기 자신은 부모로 선택할 수 없음
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))
          }
        </Select>

        <ButtonGroup>
          <ActionButton 
            type="button" 
            onClick={handleAddMember}
            color="#28a745"
          >
            {isEditing ? '수정' : '추가'}
          </ActionButton>
          
          {isEditing && (
            <ActionButton 
              type="button" 
              onClick={handleCancel}
              color="#6c757d"
            >
              취소
            </ActionButton>
          )}
        </ButtonGroup>
      </FormGroup>

      <MemberList>
        {familyData.members.map((m) => (
          <MemberItem key={m.id}>
            <MemberInfo>
              <span>{m.name}</span>
              {m.parentId && (
                <ParentInfo>
                  (부모: {familyData.members.find(p => p.id === m.parentId)?.name})
                </ParentInfo>
              )}
            </MemberInfo>
            {!m.isRoot && (
              <ButtonGroup>
                <ActionButton
                  type="button"
                  onClick={() => handleEdit(m)}
                  color="#007bff"
                  small
                >
                  수정
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  color="#dc3545"
                  small
                >
                  삭제
                </ActionButton>
              </ButtonGroup>
            )}
          </MemberItem>
        ))}
      </MemberList>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background-color: ${props => props.color};
  color: white;
  border: none;
  padding: ${props => props.small ? '4px 8px' : '0.5rem 1rem'};
  border-radius: 4px;
  cursor: pointer;
  font-size: ${props => props.small ? '0.875rem' : '1rem'};
  
  &:hover {
    opacity: 0.9;
  }
`;

const MemberList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const MemberItem = styled.li`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ParentInfo = styled.span`
  color: #666;
  font-size: 0.875rem;
`;

export default MemberForm; 