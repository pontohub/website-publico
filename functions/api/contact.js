// ================================================
// CLOUDFLARE WORKER - INTEGRAÇÃO DISCORD PONTOHUB
// Arquivo: functions/api/contact.js
// ================================================

export async function onRequestPost(context) {
    const { request } = context;
    
    // SEU WEBHOOK DO DISCORD - JÁ CONFIGURADO!
    const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1403873035521364029/pfd6OqxRzAi1-iy4hH2F7Kr79tBNpD-haHlJ4BRB6ywCDjN95KaPQk6haoAsh_tXtxGJ';
    
    try {
        // Pegar dados do formulário
        const formData = await request.json();
        
        // Criar mensagem bonita para o Discord
        const discordMessage = {
            content: '🚀 **NOVO FORMULÁRIO PONTOHUB**',
            embeds: [{
                color: 0x0B4387, // Cor azul PontoHub
                title: '📋 Nova Oportunidade de Negócio',
                fields: [
                    {
                        name: '👤 Nome',
                        value: formData.name || 'Não informado',
                        inline: true
                    },
                    {
                        name: '📧 Email',
                        value: formData.email || 'Não informado',
                        inline: true
                    },
                    {
                        name: '🏢 Empresa',
                        value: formData.company || 'Não informado',
                        inline: true
                    },
                    {
                        name: '📱 Telefone/WhatsApp',
                        value: formData.phone || 'Não informado',
                        inline: true
                    },
                    {
                        name: '🌍 País',
                        value: formData.country || 'Não informado',
                        inline: true
                    },
                    {
                        name: '💼 Serviço de Interesse',
                        value: formData.service || 'Não informado',
                        inline: true
                    },
                    {
                        name: '💰 Orçamento',
                        value: formData.budget || 'Não especificado',
                        inline: true
                    },
                    {
                        name: '⏰ Prazo',
                        value: formData.timeline || 'A definir',
                        inline: true
                    },
                    {
                        name: '📝 Mensagem',
                        value: formData.message || 'Sem mensagem',
                        inline: false
                    }
                ],
                footer: {
                    text: 'PontoHub Forms - ' + new Date().toLocaleString('pt-PT')
                },
                timestamp: new Date().toISOString()
            }]
        };
        
        // Adicionar botões úteis - Link direto para WhatsApp
        const phoneNumber = formData.phone?.replace(/\D/g, '');
        if (phoneNumber) {
            discordMessage.embeds[0].fields.push({
                name: '🔗 Ações Rápidas',
                value: `[Abrir WhatsApp](https://wa.me/${phoneNumber}) | [Enviar Email](mailto:${formData.email})`,
                inline: false
            });
        }
        
        // Enviar para o Discord
        const discordResponse = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage)
        });
        
        if (!discordResponse.ok) {
            console.error('Discord error:', await discordResponse.text());
            throw new Error('Erro ao enviar para Discord');
        }
        
        // Retornar sucesso
        return new Response(
            JSON.stringify({ 
                success: true, 
                message: 'Formulário enviado com sucesso!' 
            }),
            { 
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
        
    } catch (error) {
        console.error('Erro:', error);
        
        return new Response(
            JSON.stringify({ 
                success: false, 
                message: 'Erro ao enviar formulário. Tente novamente.' 
            }),
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
    }
}

// Permitir CORS (necessário para funcionar)
export async function onRequestOptions() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}