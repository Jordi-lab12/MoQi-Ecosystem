import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackType } from '@/pages/Index';

export interface Profile {
  id: string;
  user_id: string;
  role: 'swiper' | 'startup';
  name: string;
  username: string;
  age?: string;
  study?: string;
  gender?: string;
  tagline?: string;
  description?: string;
  usp?: string;
  mission?: string;
  vision?: string;
  industry?: string;
  founded?: string;
  employees?: string;
  logo?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SwiperInteraction {
  id: string;
  swiper_id: string;
  startup_id: string;
  has_liked: boolean;
  coin_allocation: number;
  feedback_preference: FeedbackType;
  created_at?: string;
}

export interface FeedbackRequest {
  id: string;
  startup_id: string;
  swiper_id: string;
  feedback_type: string;
  scheduled_date: string;
  scheduled_time: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  teams_link?: string;
  created_at?: string;
  updated_at?: string;
}

interface SupabaseDataContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  
  // Data fetching
  getAllStartups: () => Promise<Profile[]>;
  getSwipedStartupIds: () => Promise<string[]>;
  createSwiperInteraction: (interaction: Omit<SwiperInteraction, 'id' | 'created_at'>) => Promise<void>;
  updateSwiperInteraction: (id: string, updates: Partial<SwiperInteraction>) => Promise<void>;
  getSwiperInteractions: (startupId?: string) => Promise<SwiperInteraction[]>;
  getLikedStartupsWithAllocations: () => Promise<{ startup: Profile; allocation: number }[]>;
  createFeedbackRequest: (request: Omit<FeedbackRequest, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  
  // Auth
  signOut: () => Promise<void>;
}

const SupabaseDataContext = createContext<SupabaseDataContextType | undefined>(undefined);

export const useSupabaseData = () => {
  const context = useContext(SupabaseDataContext);
  if (!context) {
    throw new Error('useSupabaseData must be used within a SupabaseDataProvider');
  }
  return context;
};

export const SupabaseDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          setProfile(profileData as Profile);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getAllStartups = async (): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'startup');
    
    if (error) throw error;
    return (data || []) as Profile[];
  };

  const getSwipedStartupIds = async (): Promise<string[]> => {
    if (!profile) return [];
    
    const { data, error } = await supabase
      .from('swiper_interactions')
      .select('startup_id')
      .eq('swiper_id', profile.id);
    
    if (error) throw error;
    return data?.map(item => item.startup_id) || [];
  };

  const createSwiperInteraction = async (interaction: Omit<SwiperInteraction, 'id' | 'created_at'>): Promise<void> => {
    const { error } = await supabase
      .from('swiper_interactions')
      .insert(interaction);
    
    if (error) throw error;
  };

  const updateSwiperInteraction = async (id: string, updates: Partial<SwiperInteraction>): Promise<void> => {
    const { error } = await supabase
      .from('swiper_interactions')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  };

  const getSwiperInteractions = async (startupId?: string): Promise<SwiperInteraction[]> => {
    let query = supabase
      .from('swiper_interactions')
      .select('*');
    
    if (startupId) {
      query = query.eq('startup_id', startupId);
    } else if (profile?.role === 'swiper') {
      query = query.eq('swiper_id', profile.id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return (data || []) as SwiperInteraction[];
  };

  const getLikedStartupsWithAllocations = async (): Promise<{ startup: Profile; allocation: number }[]> => {
    if (!profile || profile.role !== 'swiper') return [];
    
    const { data: interactions, error: interactionsError } = await supabase
      .from('swiper_interactions')
      .select('coin_allocation, startup_id')
      .eq('swiper_id', profile.id)
      .eq('has_liked', true)
      .gt('coin_allocation', 0);
    
    if (interactionsError) throw interactionsError;
    
    if (!interactions?.length) return [];
    
    // Get startup details separately
    const startupIds = interactions.map(i => i.startup_id);
    const { data: startups, error: startupsError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', startupIds);
    
    if (startupsError) throw startupsError;
    
    return interactions.map(interaction => {
      const startup = startups?.find(s => s.id === interaction.startup_id);
      return {
        startup: startup as Profile,
        allocation: interaction.coin_allocation
      };
    }).filter(item => item.startup);
  };

  const createFeedbackRequest = async (request: Omit<FeedbackRequest, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
    const { error } = await supabase
      .from('feedback_requests')
      .insert(request);
    
    if (error) throw error;
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <SupabaseDataContext.Provider value={{
      user,
      session,
      profile,
      loading,
      getAllStartups,
      getSwipedStartupIds,
      createSwiperInteraction,
      updateSwiperInteraction,
      getSwiperInteractions,
      getLikedStartupsWithAllocations,
      createFeedbackRequest,
      signOut,
    }}>
      {children}
    </SupabaseDataContext.Provider>
  );
};