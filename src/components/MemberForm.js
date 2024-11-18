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
      {/* 입력 필드 섹션 */}
      <InputSection>
        <InputTitle>새 구성원 {isEditing ? '수정' : '추가'}</InputTitle>
        <FormGroup>
          <InputLabel>이름</InputLabel>
          <Input
            type="text"
            value={member.name}
            onChange={(e) => setMember({ ...member, name: e.target.value })}
            placeholder="이름을 입력하세요"
          />
          
          <InputLabel>부모 선택</InputLabel>
          <Select
            value={member.parentId}
            onChange={(e) => setMember({ ...member, parentId: e.target.value })}
          >
            <option value="">부모 선택 (선택사항)</option>
            {familyData.members
              .filter(m => m.id !== member.id)
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
      </InputSection>

      {/* 리스트 필드 섹션 */}
      <ListSection>
        <ListTitle>구성원 목록</ListTitle>
        <MemberList>
          {familyData.members.map((m) => (
            <MemberItem key={m.id}>
              <MemberInfo>
                <MemberName>{m.name}</MemberName>
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
      </ListSection>
    </FormContainer>
  );
};

// 스타일 컴포넌트 수정 및 추가
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InputSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const ListSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const InputTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
`;

const ListTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputLabel = styled.label`
  color: #495057;
  font-weight: 500;
  margin-bottom: -0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const MemberList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MemberItem = styled.li`
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  height: 100%;

  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const MemberName = styled.span`
  font-weight: 500;
  color: #2c3e50;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ParentInfo = styled.span`
  color: #6c757d;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const ActionButton = styled.button`
  background-color: ${props => props.color};
  color: white;
  border: none;
  padding: ${props => props.small ? '0.35rem 0.5rem' : '0.75rem 1rem'};
  border-radius: 6px;
  cursor: pointer;
  font-size: ${props => props.small ? '0.75rem' : '1rem'};
  white-space: nowrap;
  
  &:hover {
    opacity: 0.9;
  }
`;

export default MemberForm; 