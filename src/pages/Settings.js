import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import MemberForm from '../components/MemberForm';
import StyleSettings from '../components/StyleSettings';

const Settings = () => {
  const navigate = useNavigate();
  const { familyData, updateFamilyData, resetData } = useFamilyTree();
  const [title, setTitle] = useState(familyData.title);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTitle(familyData.title);
  }, [familyData.title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title && !familyData.title) return;
    
    updateFamilyData({
      ...familyData,
      title
    });
    setIsEditing(false);
    navigate('/tree');
  };

  const handleReset = () => {
    if (window.confirm('최상위 레벨(창조주하나님)을 제외한 모든 정보를 초기화하시겠습니까?')) {
      resetData();
      setTitle('');
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('제목을 삭제하시겠습니까?')) {
      updateFamilyData({
        ...familyData,
        title: ''
      });
      setTitle('');
    }
  };

  return (
    <SettingsContainer>
      <h1>가족 가계도 설정</h1>
      <form onSubmit={handleSubmit}>
        <Section>
          <SectionHeader>
            <h2>제목 설정</h2>
            {familyData.title && !isEditing && (
              <ButtonGroup>
                <ActionButton
                  type="button"
                  onClick={() => setIsEditing(true)}
                  color="#007bff"
                >
                  수정
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={handleDelete}
                  color="#dc3545"
                >
                  삭제
                </ActionButton>
              </ButtonGroup>
            )}
          </SectionHeader>
          
          {(isEditing || !familyData.title) && (
            <div>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="가계도 제목을 입력하세요"
              />
              <ButtonGroup>
                <ActionButton type="submit" color="#28a745">
                  {isEditing ? '수정' : '저장'}
                </ActionButton>
                {isEditing && (
                  <ActionButton
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setTitle(familyData.title);
                    }}
                    color="#6c757d"
                  >
                    취소
                  </ActionButton>
                )}
              </ButtonGroup>
            </div>
          )}
          {!isEditing && familyData.title && (
            <TitleDisplay>{familyData.title}</TitleDisplay>
          )}
        </Section>
        
        <Section>
          <h2>구성원 추가</h2>
          <MemberForm />
        </Section>

        <Section>
          <h2>스타일 설정</h2>
          <StyleSettings />
        </Section>

        <ButtonGroup>
          <ResetButton type="button" onClick={handleReset}>
            데이터 초기화
          </ResetButton>
          <ViewButton type="button" onClick={() => navigate('/tree')}>
            가계도 보기
          </ViewButton>
        </ButtonGroup>
      </form>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background-color: ${props => props.color};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const TitleDisplay = styled.div`
  padding: 0.5rem;
  font-size: 1.2rem;
  color: #333;
`;

const ResetButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #c82333;
  }
`;

const ViewButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

export default Settings; 