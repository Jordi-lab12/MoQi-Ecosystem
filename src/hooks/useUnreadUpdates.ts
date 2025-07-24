import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';

interface UnreadUpdate {
  startup_id: string;
  startup_name: string;
  update_count: number;
  latest_update_date: string;
}

export const useUnreadUpdates = () => {
  const [unreadUpdates, setUnreadUpdates] = useState<UnreadUpdate[]>([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const { profile } = useSupabaseData();

  const fetchUnreadUpdates = async () => {
    if (!profile || profile.role !== 'swiper') return;

    try {
      // Get all liked startups for this swiper
      const { data: interactions, error: interactionsError } = await supabase
        .from('swiper_interactions')
        .select('startup_id')
        .eq('swiper_id', profile.id)
        .eq('has_liked', true);

      if (interactionsError) throw interactionsError;

      const likedStartupIds = interactions?.map(i => i.startup_id) || [];
      if (likedStartupIds.length === 0) {
        setUnreadUpdates([]);
        setTotalUnreadCount(0);
        return;
      }

      // Get all published updates for liked startups and join with profiles
      const { data: updates, error: updatesError } = await supabase
        .from('startup_updates')
        .select(`
          id,
          startup_id,
          created_at
        `)
        .in('startup_id', likedStartupIds)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (updatesError) throw updatesError;

      // Get read status for this swiper
      const { data: reads, error: readsError } = await supabase
        .from('startup_update_reads')
        .select('update_id')
        .eq('swiper_id', profile.id);

      if (readsError) throw readsError;

      const readUpdateIds = new Set(reads?.map(r => r.update_id) || []);

      // Get startup names for unread updates
      const startupNames: Record<string, string> = {};
      if (likedStartupIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', likedStartupIds);
        
        if (!profilesError) {
          profiles?.forEach(profile => {
            startupNames[profile.id] = profile.name;
          });
        }
      }

      // Calculate unread updates per startup
      const unreadByStartup: Record<string, UnreadUpdate> = {};
      let totalCount = 0;

      updates?.forEach(update => {
        if (!readUpdateIds.has(update.id)) {
          const startupId = update.startup_id;
          if (!unreadByStartup[startupId]) {
            unreadByStartup[startupId] = {
              startup_id: startupId,
              startup_name: startupNames[startupId] || 'Unknown Startup',
              update_count: 0,
              latest_update_date: update.created_at
            };
          }
          unreadByStartup[startupId].update_count++;
          totalCount++;
        }
      });

      setUnreadUpdates(Object.values(unreadByStartup));
      setTotalUnreadCount(totalCount);
    } catch (error) {
      console.error('Error fetching unread updates:', error);
    }
  };

  const markUpdateAsRead = async (updateId: string, startupId: string) => {
    if (!profile || profile.role !== 'swiper') return;

    try {
      const { error } = await supabase
        .from('startup_update_reads')
        .upsert({
          swiper_id: profile.id,
          startup_id: startupId,
          update_id: updateId
        });

      if (error) throw error;
      
      // Refresh unread counts
      await fetchUnreadUpdates();
    } catch (error) {
      console.error('Error marking update as read:', error);
    }
  };

  useEffect(() => {
    fetchUnreadUpdates();

    // Set up real-time subscription for new updates
    if (profile?.role === 'swiper') {
      const channel = supabase
        .channel('startup-updates-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'startup_updates',
            filter: 'is_published=eq.true'
          },
          () => {
            fetchUnreadUpdates();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  return {
    unreadUpdates,
    totalUnreadCount,
    fetchUnreadUpdates,
    markUpdateAsRead
  };
};