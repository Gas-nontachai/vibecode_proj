export type Tables = {
  profiles: {
    id: string;
    full_name: string | null;
    nickname: string | null;
    phone: string | null;
    email: string | null;
    avatar_url: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Tables["profiles"];
        Insert: {
          id: string;
          full_name?: string | null;
          nickname?: string | null;
          phone?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          nickname?: string | null;
          phone?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
};
