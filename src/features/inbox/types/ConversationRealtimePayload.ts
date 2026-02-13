export type ConversationRealtimePayload = {
  conversation_id: string;
  adopter_id: string;
  rehomer_id: string;
  animal_id: string | null;
  created_at: string;
  last_message_at: string | null;
  adopter_last_active_at: string | null;
  rehomer_last_active_at: string | null;
  adopter_last_read_at: string | null;
  rehomer_last_read_at: string | null;
  adopter_is_typing: boolean;
  rehomer_is_typing: boolean;
  adopter_last_typing_at: string | null;
  rehomer_last_typing_at: string | null;
  adopter_deleted_at: string | null;
  rehomer_deleted_at: string | null;
};
