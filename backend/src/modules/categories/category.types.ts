export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export interface CategoryQueryDto {
  search?: string;
  isActive?: boolean;
}
