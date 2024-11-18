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
    <PageContainer>
      <PageTitle>가족 가계도 설정</PageTitle>
      <form onSubmit={handleSubmit}>
        <SectionsContainer>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                <SectionIcon>📝</SectionIcon>
                제목 설정
              </SectionTitle>
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
            
            <SectionContent>
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
            </SectionContent>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                <SectionIcon>👥</SectionIcon>
                구성원 추가
              </SectionTitle>
            </SectionHeader>
            <SectionContent>
              <MemberForm />
            </SectionContent>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                <SectionIcon>🎨</SectionIcon>
                스타일 설정
              </SectionTitle>
            </SectionHeader>
            <SectionContent>
              <StyleSettings />
            </SectionContent>
          </SectionCard>
        </SectionsContainer>

        <BottomSection>
          <ButtonGroup>
            <ResetButton type="button" onClick={handleReset}>
              데이터 초기화
            </ResetButton>
            <ViewButton type="button" onClick={() => navigate('/tree')}>
              가계도 보기
            </ViewButton>
          </ButtonGroup>
        </BottomSection>
      </form>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: bold;
`;

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionCard = styled.section`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(to right, #f8f9fa, white);
  border-bottom: 1px solid #eee;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
`;

const SectionIcon = styled.span`
  font-size: 1.5rem;
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const BottomSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;

const ActionButton = styled.button`
  background-color: ${props => props.color};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const TitleDisplay = styled.div`
  padding: 1rem;
  font-size: 1.2rem;
  color: #2c3e50;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const ResetButton = styled(ActionButton).attrs({ color: '#dc3545' })``;
const ViewButton = styled(ActionButton).attrs({ color: '#007bff' })``;

export default Settings; 