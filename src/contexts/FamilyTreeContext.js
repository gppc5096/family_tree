import React, { createContext, useContext, useState, useEffect } from 'react';

const FamilyTreeContext = createContext();

export const FamilyTreeProvider = ({ children }) => {
  const [familyData, setFamilyData] = useState({
    title: '',
    members: [{
      id: 'root',
      name: '창조주하나님',
      parentId: null,
      isRoot: true
    }],
    styles: {
      backgroundColor: '#ffffff',
      lineColor: '#000000',
      nodeColor: '#e0e0e0',
      textColor: '#000000',
      nodeShape: 'rectangle',
      nodeBorderWidth: 2,
      nodeShadow: true,
      nodeGradient: true,
      lineStyle: 'straight',
      lineWidth: 2,
      titleColor: '#000000',
      titleSize: '30',
      titleFont: 'Noto Sans KR',
      exportFormat: 'svg'
    }
  });

  useEffect(() => {
    const savedData = localStorage.getItem('familyTreeData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (!parsedData.members.find(m => m.id === 'root')) {
        parsedData.members.unshift({
          id: 'root',
          name: '창조주하나님',
          parentId: null,
          isRoot: true
        });
      }
      setFamilyData(parsedData);
    }
  }, []);

  const updateFamilyData = (newData) => {
    if (!newData.members.find(m => m.id === 'root')) {
      newData.members.unshift({
        id: 'root',
        name: '창조주하나님',
        parentId: null,
        isRoot: true
      });
    }
    setFamilyData(newData);
    localStorage.setItem('familyTreeData', JSON.stringify(newData));
  };

  const resetData = () => {
    const newData = {
      ...familyData,
      members: [{
        id: 'root',
        name: '창조주하나님',
        parentId: null,
        isRoot: true
      }]
    };
    updateFamilyData(newData);
  };

  return (
    <FamilyTreeContext.Provider 
      value={{
        familyData,
        updateFamilyData,
        resetData
      }}
    >
      {children}
    </FamilyTreeContext.Provider>
  );
};

export const useFamilyTree = () => {
  const context = useContext(FamilyTreeContext);
  if (!context) {
    throw new Error('useFamilyTree must be used within a FamilyTreeProvider');
  }
  return context;
}; 