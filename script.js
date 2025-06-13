// A palavra-chave 'import' é o que torna necessário usar type="module" na tag <script> do HTML.
import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

// Adiciona um "ouvinte" que espera o HTML da página ser totalmente carregado para executar o código.
document.addEventListener('DOMContentLoaded', () => {

    // Pega as referências de TODOS os elementos da página que vamos manipular.
    const startButton = document.getElementById('start-chat-button');
    const welcomeContainer = document.getElementById('welcome-container');
    const chatWrapper = document.getElementById('chat-wrapper');
    const chatContainer = document.getElementById('n8n-chat-container');
    const endSessionButton = document.getElementById('end-session-button');
    const thankYouContainer = document.getElementById('thank-you-container');

    /**
     * Função para desabilitar o input de texto e o botão de envio no final da conversa.
     */
    function disableChatInput() {
        const chatTextarea = document.querySelector('#n8n-chat-container textarea');
        if (chatTextarea) {
            chatTextarea.disabled = true;
            chatTextarea.placeholder = 'Interação finalizada! Clique em Encerrar.';
        }
        const sendButton = document.querySelector('#n8n-chat-container .n8n-chat-footer button');
        if (sendButton) {
            sendButton.disabled = true;
            sendButton.style.cursor = 'not-allowed';
            sendButton.style.opacity = '0.5';
        }
    }

    /**
     * Função para observar o chat e finalizar a interação
     * ao detectar a imagem do Pokémon pela URL.
     */
    function observeForPokemonImage() {
        const observer = new MutationObserver((mutationsList, obs) => {
            // Em cada mudança no chat, procuramos por TODAS as imagens
            const allImages = document.querySelectorAll('#n8n-chat-container img');

            for (const image of allImages) {
                // ==========================================================
                // >> CORREÇÃO FINAL APLICADA AQUI <<
                // ==========================================================
                // Verificamos se a ORIGEM (src) da imagem contém a parte da URL que você forneceu.
                if (image.src && image.src.includes('limitlesstcg.nyc3.cdn.digitaloceanspaces.com')) {
                    
                    console.log("Imagem do Pokémon detectada pela URL correta! Finalizando interação...");
                    
                    // a) Mostra o botão "Encerrar"
                    endSessionButton.classList.add('visible');

                    // b) Desabilita o campo de texto e o botão de envio
                    disableChatInput();
                    
                    // c) Para de observar para não disparar a função novamente
                    obs.disconnect(); 
                    
                    // Saímos do loop assim que encontramos a imagem
                    return; 
                }
            }
        });

        // Começa a observar o container do chat por adições de novos elementos filhos e mudanças na árvore.
        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    /**
     * Função que será chamada para carregar e iniciar o chat do n8n.
     */
    async function initializeChat() {
        chatWrapper.classList.remove('hidden');

        try {
            const n8nWebhookUrl = 'https://unichatwebhooks-homolog.unilavras.edu.br/webhook/9be89b31-2f31-45fd-a195-f10ba750f66d/chat';

            createChat({
                webhookUrl: n8nWebhookUrl,
                target: '#n8n-chat-container',
                mode: 'fullscreen',
                initialMessages: [],
                i18n: {
                    en: {
                        title: 'PokédexBot Unilavras',
                        subtitle: "Fale com nossa IA e capture um Pokémon!",
                        inputPlaceholder: 'Vamos conversar!',
                    },
                },
            });
            
            // Inicia o observador para aguardar pela IMAGEM.
            observeForPokemonImage();

        } catch (error) {
            console.error("Erro ao carregar o chat do n8n:", error);
            chatContainer.innerHTML = '<p style="color: red; text-align: center;">Não foi possível carregar o chat. Tente atualizar a página.</p>';
        }
    }

    // Adiciona um "ouvinte" para o clique no botão "Iniciar Aventura".
    startButton.addEventListener('click', () => {
        console.log("Botão de iniciar clicado! Escondendo boas-vindas...");
        welcomeContainer.classList.add('hidden');
        initializeChat();
    });

    // Adiciona um "ouvinte" para o clique no botão "Encerrar Sessão".
    endSessionButton.addEventListener('click', () => {
        console.log("Botão de encerrar clicado! Mostrando tela de agradecimento.");
        chatWrapper.classList.add('hidden');
        thankYouContainer.classList.remove('hidden');
    });
});