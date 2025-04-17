export interface Database {
    public: {
      Tables: {
        users: {
          Row: {
            id: string;
            email: string;
            full_name: string;
            role: 'admin' | 'rider' | 'customer';
            status: 'active' | 'inactive' | 'pending';
            created_at: string;
          };
          Insert: {
            id?: string;
            email: string;
            full_name: string;
            role?: 'admin' | 'rider' | 'customer';
            status?: 'active' | 'inactive' | 'pending';
            created_at?: string;
          };
          Update: {
            id?: string;
            email?: string;
            full_name?: string;
            role?: 'admin' | 'rider' | 'customer';
            status?: 'active' | 'inactive' | 'pending';
            created_at?: string;
          };
        };
      };
    };
  }