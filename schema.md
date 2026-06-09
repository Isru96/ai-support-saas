table users {
  id uuid [pk]
  name varchar
  email varchar [unique]
  password_hash text
  avatar_url text
  email_verified boolean
  last_login_at timestamp
  created_at timestamp
  updated_at timestamp
}

table sessions {
  id uuid [pk]
  user_id uuid
  refresh_token text
  expires_at timestamp
  created_at timestamp
}

table password_resets {
  id uuid [pk]
  user_id uuid
  token varchar
  expires_at timestamp
  used boolean
  created_at timestamp
}

table verification_tokens {
  id uuid [pk]
  user_id uuid
  token varchar
  expires_at timestamp
  created_at timestamp
}

table workspaces {
  id uuid [pk]
  owner_id uuid
  name varchar
  slug varchar [unique]
  logo_url text
  plan varchar
  created_at timestamp
  updated_at timestamp
}

table workspace_members {
  id uuid [pk]
  workspace_id uuid
  user_id uuid
  role varchar
  created_at timestamp
}

table invitations {
  id uuid [pk]
  workspace_id uuid
  email varchar
  role varchar
  token varchar
  expires_at timestamp
  accepted_at timestamp
  created_at timestamp
}

table documents {
  id uuid [pk]
  workspace_id uuid
  uploaded_by uuid
  filename varchar
  storage_url text
  mime_type varchar
  file_size bigint
  status varchar
  created_at timestamp
}

table document_versions {
  id uuid [pk]
  document_id uuid
  version_number int
  storage_url text
  uploaded_by uuid
  created_at timestamp
}

table processing_jobs {
  id uuid [pk]
  document_id uuid
  status varchar
  started_at timestamp
  completed_at timestamp
  error_message text
  created_at timestamp
}

table document_chunks {
  id uuid [pk]
  document_id uuid
  chunk_index int
  content text
  token_count int
  metadata json
  created_at timestamp
}

table embeddings {
  id uuid [pk]
  chunk_id uuid
  embedding_provider varchar
  embedding_model varchar
  vector_id varchar
  created_at timestamp
}

table chat_sessions {
  id uuid [pk]
  workspace_id uuid
  created_by uuid
  title varchar
  created_at timestamp
  updated_at timestamp
}

table messages {
  id uuid [pk]
  session_id uuid
  role varchar
  content text
  prompt_tokens int
  completion_tokens int
  total_tokens int
  response_time_ms int
  created_at timestamp
}

table message_sources {
  id uuid [pk]
  message_id uuid
  chunk_id uuid
}

table subscriptions {
  id uuid [pk]
  workspace_id uuid
  stripe_customer_id varchar
  stripe_subscription_id varchar
  plan varchar
  status varchar
  current_period_start timestamp
  current_period_end timestamp
  cancel_at_period_end boolean
  created_at timestamp
}

table invoices {
  id uuid [pk]
  subscription_id uuid
  stripe_invoice_id varchar
  amount decimal
  currency varchar
  status varchar
  invoice_url text
  created_at timestamp
}

table usage_logs {
  id uuid [pk]
  workspace_id uuid
  type varchar
  provider varchar
  model varchar
  prompt_tokens int
  completion_tokens int
  total_tokens int
  estimated_cost decimal
  created_at timestamp
}

table api_keys {
  id uuid [pk]
  workspace_id uuid
  name varchar
  hashed_key text
  last_used_at timestamp
  created_at timestamp
}

table audit_logs {
  id uuid [pk]
  workspace_id uuid
  user_id uuid
  action varchar
  resource_type varchar
  resource_id uuid
  metadata json
  created_at timestamp
}

table support_widgets {
  id uuid [pk]
  workspace_id uuid
  name varchar
  theme json
  allowed_domains json
  is_active boolean
  created_at timestamp
}

table leads {
  id uuid [pk]
  workspace_id uuid
  email varchar
  name varchar
  metadata json
  created_at timestamp
}

table conversations {
  id uuid [pk]
  workspace_id uuid
  lead_id uuid
  started_at timestamp
  ended_at timestamp
}

ref: sessions.user_id > users.id

ref: password_resets.user_id > users.id
ref: verification_tokens.user_id > users.id

ref: workspaces.owner_id > users.id

ref: workspace_members.workspace_id > workspaces.id
ref: workspace_members.user_id > users.id

ref: invitations.workspace_id > workspaces.id

ref: documents.workspace_id > workspaces.id
ref: documents.uploaded_by > users.id

ref: document_versions.document_id > documents.id
ref: document_versions.uploaded_by > users.id

ref: processing_jobs.document_id > documents.id

ref: document_chunks.document_id > documents.id

ref: embeddings.chunk_id > document_chunks.id

ref: chat_sessions.workspace_id > workspaces.id
ref: chat_sessions.created_by > users.id

ref: messages.session_id > chat_sessions.id

ref: message_sources.message_id > messages.id
ref: message_sources.chunk_id > document_chunks.id

ref: subscriptions.workspace_id > workspaces.id

ref: invoices.subscription_id > subscriptions.id

ref: usage_logs.workspace_id > workspaces.id

ref: api_keys.workspace_id > workspaces.id

ref: audit_logs.workspace_id > workspaces.id
ref: audit_logs.user_id > users.id

ref: support_widgets.workspace_id > workspaces.id

ref: leads.workspace_id > workspaces.id

ref: conversations.workspace_id > workspaces.id
ref: conversations.lead_id > leads.id