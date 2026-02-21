export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            agenda_diaria: {
                Row: {
                    bloqueado_manual: boolean | null
                    data: string
                    limite_diario: number | null
                    reservas_confirmadas: number | null
                }
                Insert: {
                    bloqueado_manual?: boolean | null
                    data: string
                    limite_diario?: number | null
                    reservas_confirmadas?: number | null
                }
                Update: {
                    bloqueado_manual?: boolean | null
                    data?: string
                    limite_diario?: number | null
                    reservas_confirmadas?: number | null
                }
                Relationships: []
            }
            clientes: {
                Row: {
                    bairro: string | null
                    created_at: string | null
                    data_primeira_compra: string | null
                    data_ultima_compra: string | null
                    email: string | null
                    id: string
                    nome: string | null
                    telefone: string
                    total_gasto: number | null
                }
                Insert: {
                    bairro?: string | null
                    created_at?: string | null
                    data_primeira_compra?: string | null
                    data_ultima_compra?: string | null
                    email?: string | null
                    id?: string
                    nome?: string | null
                    telefone: string
                    total_gasto?: number | null
                }
                Update: {
                    bairro?: string | null
                    created_at?: string | null
                    data_primeira_compra?: string | null
                    data_ultima_compra?: string | null
                    email?: string | null
                    id?: string
                    nome?: string | null
                    telefone?: string
                    total_gasto?: number | null
                }
                Relationships: []
            }
            dashboard_financeiro_cache: {
                Row: {
                    a_receber: number | null
                    atrasado: number | null
                    custos: number | null
                    faturamento: number | null
                    lucro: number | null
                    margem: number | null
                    mes: string
                    recebido: number | null
                    saldo: number | null
                    ticket_medio: number | null
                    updated_at: string | null
                }
                Insert: {
                    a_receber?: number | null
                    atrasado?: number | null
                    custos?: number | null
                    faturamento?: number | null
                    lucro?: number | null
                    margem?: number | null
                    mes: string
                    recebido?: number | null
                    saldo?: number | null
                    ticket_medio?: number | null
                    updated_at?: string | null
                }
                Update: {
                    a_receber?: number | null
                    atrasado?: number | null
                    custos?: number | null
                    faturamento?: number | null
                    lucro?: number | null
                    margem?: number | null
                    mes?: string
                    recebido?: number | null
                    saldo?: number | null
                    ticket_medio?: number | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            dashboard_mensal: {
                Row: {
                    mes: string
                    receita_servicos: number | null
                    receita_total: number | null
                    receita_upsell: number | null
                    total_reservas: number | null
                }
                Insert: {
                    mes: string
                    receita_servicos?: number | null
                    receita_total?: number | null
                    receita_upsell?: number | null
                    total_reservas?: number | null
                }
                Update: {
                    mes?: string
                    receita_servicos?: number | null
                    receita_total?: number | null
                    receita_upsell?: number | null
                    total_reservas?: number | null
                }
                Relationships: []
            }
            faturamento_regiao_mensal: {
                Row: {
                    bairro: string
                    mes: string
                    valor: number | null
                }
                Insert: {
                    bairro: string
                    mes: string
                    valor?: number | null
                }
                Update: {
                    bairro?: string
                    mes?: string
                    valor?: number | null
                }
                Relationships: []
            }
            financeiro: {
                Row: {
                    categoria: string | null
                    created_at: string | null
                    forma_pagamento: string | null
                    id: string
                    reserva_id: string | null
                    tipo: string | null
                    valor: number | null
                }
                Insert: {
                    categoria?: string | null
                    created_at?: string | null
                    forma_pagamento?: string | null
                    id?: string
                    reserva_id?: string | null
                    tipo?: string | null
                    valor?: number | null
                }
                Update: {
                    categoria?: string | null
                    created_at?: string | null
                    forma_pagamento?: string | null
                    id?: string
                    reserva_id?: string | null
                    tipo?: string | null
                    valor?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "financeiro_reserva_id_fkey"
                        columns: ["reserva_id"]
                        isOneToOne: false
                        referencedRelation: "reservas"
                        referencedColumns: ["id"]
                    },
                ]
            }
            metas_mensais: {
                Row: {
                    mes: string
                    meta_faturamento: number | null
                    meta_lucro: number | null
                }
                Insert: {
                    mes: string
                    meta_faturamento?: number | null
                    meta_lucro?: number | null
                }
                Update: {
                    mes?: string
                    meta_faturamento?: number | null
                    meta_lucro?: number | null
                }
                Relationships: []
            }
            movimentacoes_financeiras: {
                Row: {
                    bairro: string | null
                    categoria: string | null
                    created_at: string | null
                    data_pagamento: string | null
                    data_vencimento: string | null
                    descricao: string | null
                    forma_pagamento: string | null
                    id: string
                    reserva_id: string | null
                    status: string | null
                    subcategoria: string | null
                    tipo: string | null
                    valor: number | null
                }
                Insert: {
                    bairro?: string | null
                    categoria?: string | null
                    created_at?: string | null
                    data_pagamento?: string | null
                    data_vencimento?: string | null
                    descricao?: string | null
                    forma_pagamento?: string | null
                    id?: string
                    reserva_id?: string | null
                    status?: string | null
                    subcategoria?: string | null
                    tipo?: string | null
                    valor?: number | null
                }
                Update: {
                    bairro?: string | null
                    categoria?: string | null
                    created_at?: string | null
                    data_pagamento?: string | null
                    data_vencimento?: string | null
                    descricao?: string | null
                    forma_pagamento?: string | null
                    id?: string
                    reserva_id?: string | null
                    status?: string | null
                    subcategoria?: string | null
                    tipo?: string | null
                    valor?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "movimentacoes_financeiras_reserva_id_fkey"
                        columns: ["reserva_id"]
                        isOneToOne: false
                        referencedRelation: "reservas"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    id: string
                    role: string | null
                }
                Insert: {
                    id: string
                    role?: string | null
                }
                Update: {
                    id?: string
                    role?: string | null
                }
                Relationships: []
            }
            quiz_eventos: {
                Row: {
                    etapa: string
                    id: string
                    timestamp: string | null
                }
                Insert: {
                    etapa: string
                    id?: string
                    timestamp?: string | null
                }
                Update: {
                    etapa?: string
                    id?: string
                    timestamp?: string | null
                }
                Relationships: []
            }
            reserva_servicos: {
                Row: {
                    id: string
                    nome: string
                    reserva_id: string | null
                    valor: number | null
                }
                Insert: {
                    id?: string
                    nome: string
                    reserva_id?: string | null
                    valor?: number | null
                }
                Update: {
                    id?: string
                    nome?: string
                    reserva_id?: string | null
                    valor?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "reserva_servicos_reserva_id_fkey"
                        columns: ["reserva_id"]
                        isOneToOne: false
                        referencedRelation: "reservas"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reserva_upsells: {
                Row: {
                    id: string
                    nome: string
                    reserva_id: string | null
                    valor: number | null
                }
                Insert: {
                    id?: string
                    nome: string
                    reserva_id?: string | null
                    valor?: number | null
                }
                Update: {
                    id?: string
                    nome?: string
                    reserva_id?: string | null
                    valor?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "reserva_upsells_reserva_id_fkey"
                        columns: ["reserva_id"]
                        isOneToOne: false
                        referencedRelation: "reservas"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reservas: {
                Row: {
                    bairro: string | null
                    categoria: string | null
                    created_at: string | null
                    data_evento: string
                    email: string | null
                    expires_at: string | null
                    forma_pagamento: string | null
                    id: string
                    local_evento: string | null
                    nome_cliente: string
                    plano: string | null
                    status: string | null
                    telefone: string
                    tema: string | null
                    valor_plano: number | null
                    valor_servicos: number | null
                    valor_total: number | null
                    valor_upsells: number | null
                }
                Insert: {
                    bairro?: string | null
                    categoria?: string | null
                    created_at?: string | null
                    data_evento: string
                    email?: string | null
                    expires_at?: string | null
                    forma_pagamento?: string | null
                    id?: string
                    local_evento?: string | null
                    nome_cliente: string
                    plano?: string | null
                    status?: string | null
                    telefone: string
                    tema?: string | null
                    valor_plano?: number | null
                    valor_servicos?: number | null
                    valor_total?: number | null
                    valor_upsells?: number | null
                }
                Update: {
                    bairro?: string | null
                    categoria?: string | null
                    created_at?: string | null
                    data_evento?: string
                    email?: string | null
                    expires_at?: string | null
                    forma_pagamento?: string | null
                    id?: string
                    local_evento?: string | null
                    nome_cliente?: string
                    plano?: string | null
                    status?: string | null
                    telefone?: string
                    tema?: string | null
                    valor_plano?: number | null
                    valor_servicos?: number | null
                    valor_total?: number | null
                    valor_upsells?: number | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            atualizar_dashboard_financeiro: {
                Args: { p_mes: string }
                Returns: undefined
            }
            cancelar_reserva: { Args: { p_reserva_id: string }; Returns: undefined }
            confirmar_pagamento: {
                Args: { p_reserva_id: string }
                Returns: undefined
            }
            confirmar_reserva: { Args: { p_reserva_id: string }; Returns: undefined }
            criar_reserva_aguardando_pagamento: {
                Args: {
                    p_bairro: string
                    p_categoria: string
                    p_data_evento: string
                    p_email: string
                    p_forma_pagamento: string
                    p_local_evento: string
                    p_nome_cliente: string
                    p_plano: string
                    p_telefone: string
                    p_tema: string
                    p_valor_plano: number
                    p_valor_servicos: number
                    p_valor_total: number
                    p_valor_upsells: number
                }
                Returns: string
            }
            is_admin: { Args: never; Returns: boolean }
            registrar_entrada_reserva: {
                Args: { p_reserva_id: string }
                Returns: undefined
            }
            registrar_saida_manual: {
                Args: {
                    p_categoria: string
                    p_data_pagamento?: string
                    p_data_vencimento: string
                    p_descricao: string
                    p_forma_pagamento: string
                    p_status: string
                    p_subcategoria: string
                    p_valor: number
                }
                Returns: string
            }
            verificar_reservas_expiradas: {
                Args: never
                Returns: {
                    reserva_id: string
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
