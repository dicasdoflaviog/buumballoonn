import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Define o tempo máximo de execução para 30 segundos
export const maxDuration = 30;

export async function GET(request: Request) {
    // Opcional: Verificar chave de segurança enviada pela Vercel Cron
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    try {
        const { data, error } = await supabase.rpc('verificar_reservas_expiradas');

        if (error) {
            console.error('Erro ao verificar reservas expiradas:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Verificação de expiração concluída',
            expiradas: data
        });
    } catch (error: any) {
        console.error('Erro na rota de cron:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
