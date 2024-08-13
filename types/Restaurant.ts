interface MealPreparationTime {
  high: number;
  low: number;
}

export interface Restaurant {
  id: any;
  coverImage: string;
  endTime: Date;
  iconImage: string;
  mealCategories: string[];
  mealPreparationTime: MealPreparationTime;
  name: string;
  startTime: Date;
  uniId: string;
  open: boolean;
}
