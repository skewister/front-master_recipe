export interface tag {
  id: number;
  tag_type_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pivot: { recipe_id: number; tag_id: number; };
  tag_type: { id: number; type: string; created_at: string; updated_at: string; };

}

