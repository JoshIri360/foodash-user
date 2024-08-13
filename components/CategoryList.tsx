import React from 'react';
import { FlatList, Pressable, Text } from 'react-native';

interface CategoryListProps {
  categories: string[];
  activeCategory: string;
  onCategoryPress: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, activeCategory, onCategoryPress }) => {
  const renderCategoryItem = ({ item }: { item: string }) => (
    <Pressable
      onPress={() => onCategoryPress(item)}
      className={`px-3 py-2 rounded-full mr-2 mb-2 ${
        activeCategory === item ? "bg-[#00A36C]" : "bg-[#F6F6F6]"
      }`}
    >
      <Text
        className={`${activeCategory === item ? "text-white" : "text-black"}`}
        style={{ fontFamily: "SenBold" }}
      >
        {item}
      </Text>
    </Pressable>
  );

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={renderCategoryItem}
      className="grow-0 px-3"
    />
  );
};

export default CategoryList;
