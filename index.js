


/*
                                              █▀▀▀█ █▀▀█ █▀▄▀█ █▀▀█   █▀▀█ █▀▀▀█ █▀▀▄ █▀▀▀
                                              ▀▀▀▄▄ █▄▄█ █▒█▒█ █▄▄█   █░░░ █░░▒█ █░▒█ █▀▀▀
                                              █▄▄▄█ █░▒█ █░░▒█ █░░░   █▄▄█ █▄▄▄█ █▄▄▀ █▄▄▄
                                                
*/



const { Client, GatewayIntentBits, InteractionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { On_AddSistema, On_SistemasPaginados, On_RemoverSistemaID, On_PegarSistemaID, CriarTable, VerificarSlotVazio } = require('./db/dblite');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

CriarTable();

//        registrar comandos slash                            node register_commands/register_commands.js

client.once('ready', () => {
    console.log('Bot Online!');
});

const enviarLog = async (message) => {
    const LogCanal = await client.channels.fetch('1326852325066936322');
    if (LogCanal) {
        LogCanal.send(message);
    }
};

const LinkValido = (link) => {
    const regex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA0-9_-]+/i;
    return regex.test(link);
};

/*

                                                █▀▀ █▀▀█ █▀▄▀█ █▀▀█ █▀▀▄ █▀▀▄ █▀▀█ █▀▀
                                                █░░ █░░█ █░▀░█ █▄▄█ █░░█ █░░█ █░░█ ▀▀█
                                                ▀▀▀ ▀▀▀▀ ▀░░░▀ ▀░░▀ ▀░░▀ ▀▀▀░ ▀▀▀▀ ▀▀▀


*/
client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand() && !interaction.isModalSubmit() && !interaction.isButton()) return;

    /*


                                                SISTEMA DE LISTAR SISTEMA



    */
    if (interaction.commandName === 'addsistema') {
        const modal = new ModalBuilder()
            .setCustomId('addSistemaModal')
            .setTitle('Adicionar Sistema');

        const nomeInput = new TextInputBuilder()
            .setCustomId('nome')
            .setLabel('Nome do Sistema')      
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite o nome de seu sistema')
            .setRequired(true);

        const descInput = new TextInputBuilder()
            .setCustomId('descricao')
            .setLabel('Descrição')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Digite uma breve descrição')
            .setRequired(true);

        const linkInput = new TextInputBuilder()
            .setCustomId('link')
            .setLabel('Link do GitHub')            
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Forneça um link github.com')
            .setRequired(true);

        const actionRows = [
            new ActionRowBuilder().addComponents(nomeInput),
            new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(linkInput),
        ];

        modal.addComponents(...actionRows);
        await interaction.showModal(modal);

        enviarLog(`Usuário <@${interaction.user.id}> digitou o comando /addsistema`);
    }

    if (interaction.commandName === 'removersistema') {
        const modal = new ModalBuilder()
            .setCustomId('removerSistemaModal')
            .setTitle('Remover Sistema');

        const idInput = new TextInputBuilder()
            .setCustomId('id')
            .setLabel('ID do Sistema')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite o ID do sistema')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(idInput);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);

        enviarLog(`Usuário <@${interaction.user.id}> digitou o comando /removersistema`);
    }

    if (interaction.commandName === 'sistemas') {
        const page = 1;
    
        On_SistemasPaginados(page, (err, rows) => {
            if (err) 
                return interaction.reply({ content: '❌ Ocorreu um erro, contate um desenvolvedor.', flags: 64 });
    
            if (rows.length === 0) 
                return interaction.reply({ content: '❌ Nenhum sistema cadastrado.', flags: 64 });
    
            const embed = new EmbedBuilder()
                .setTitle('Lista de Sistemas')
                .setColor('#0099ff')
                .setDescription(
                    rows
                        .map((sistema) => `**ID:** ${sistema.id} | **Criador:** <@${sistema.criadorId}> | **Sistema:** ${sistema.nome}`)
                        .join('\n')
                );

            const actionRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`pagina-voltar-1-${interaction.user.id}`) 
                    .setLabel('<')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true), 
    
                new ButtonBuilder()
                    .setCustomId(`pegarSistema-${interaction.user.id}`)
                    .setLabel('Pegar Sistema')
                    .setStyle(ButtonStyle.Primary),
    
                new ButtonBuilder()
                    .setCustomId(`pagina-proximo-1-${interaction.user.id}`)
                    .setLabel('>')
                    .setStyle(ButtonStyle.Secondary)
            );
            interaction.reply({ embeds: [embed], components: [actionRow] });
        });
    }
    
    
    
    if (interaction.type === InteractionType.ModalSubmit) {

        if (interaction.customId === 'removerSistemaModal') {

            const id = interaction.fields.getTextInputValue('id');

            On_PegarSistemaID(id, (err, sistema) => {
                if (err) 
                    return interaction.reply({ content: '❌ Ocorreu um erro, por favor, tente novamente.', flags: 64 });
                
                if (!sistema) 
                    return interaction.reply({ content: '❌ Sistema não encontrado com esse ID.', flags: 64 });
                
                if (sistema.criadorId !== interaction.user.id && !interaction.member.roles.cache.some(role => role.name === 'Ceo')) 
                    return interaction.reply({ content: '❌ Você nao tem permissão para remover este sistema', flags: 64 });
                

                On_RemoverSistemaID(id, (err) => {

                    if (err) 
                        return interaction.reply({ content: 'Erro ao remover sistema.', flags: 64 });

                    enviarLog(`🦎 O membro <@${interaction.user.id}>, removeu um sistema em nosso banco de dados: ${nome}`);
                    
                    interaction.reply({ content: '✅ Sistema removido com sucesso!', flags: 64 });
                });
            });
        }

        if (interaction.customId === 'addSistemaModal') {

            const nome = interaction.fields.getTextInputValue('nome');
            const descricao = interaction.fields.getTextInputValue('descricao');
            const link = interaction.fields.getTextInputValue('link');

            if (!LinkValido(link))
                return interaction.reply({ content: '☝️ O link deve ser do GitHub', flags: 64 });

            const criadorId = interaction.user.id;

            VerificarSlotVazio((err, nextAvailableId) => {

                if (err) 
                    return interaction.reply({ content: '❌ Erro ao adicionar sistema.', flags: 64 });
                

                On_AddSistema(criadorId, nome, descricao, link, (err) => {

                    if (err) 
                        return interaction.reply({ content: '❌ Erro ao adicionar sistema. contate um desenvolvedor', flags: 64 });
                    
                    enviarLog(`🦎 O membro <@${interaction.user.id}>, Adicionou um sistema em nosso banco de dados: ${nome}`);

                    interaction.reply({ content: '✅ Sistema adicionado com sucesso!', flags: 64 });
                }, nextAvailableId);
            });
        }
    }
});
/*


                                            ▀█▀ █▄░▒█ ▀▀█▀▀ █▀▀▀ █▀▀█ █▀▀█ █▀▀█ █▀▀█ █▀▀▀█
                                            ░█░ █▒█▒█ ░▒█░░ █▀▀▀ █▄▄▀ █▄▄█ █░░░ █▄▄█ █░░▒█
                                            ▄█▄ █░░▀█ ░▒█░░ █▄▄▄ █░▒█ █░▒█ █▄▄█ █░▒█ █▄▄▄█


*/
client.on('interactionCreate', async (interaction) => {


    if (!interaction.isButton()) 
        return;

    const userId = 
        interaction.user.id;

    if (interaction.customId.startsWith('pagina-')) {
        const [_, action, page, userIdInButton] = interaction.customId.split('-');
        
        if (userIdInButton !== userId) 
            return interaction.reply({ content: '❌ Você não pode interagir com os botões.', flags: 64,});
        

        const newPage = action === 'voltar' ? Math.max(1, parseInt(page) - 1) : parseInt(page) + 1;

        On_SistemasPaginados(newPage, (err, rows) => {
            if (err) return interaction.reply({ content: '❌ Erro ao listar sistemas.', flags: 64 });

            if (rows.length === 0) 
                return interaction.reply({ content: '☝️ Nenhum sistema cadastrado na página seguinte', flags: 64 });

            const embed = new EmbedBuilder()
                .setTitle('Lista de Sistemas')
                .setColor('#0099ff')
                .setDescription(
                    rows
                        .map((sistema) => `**ID:** ${sistema.id} | **Criador:** <@${sistema.criadorId}> | **Sistema:** ${sistema.nome}`)
                        .join('\n')
                );

            const voltarButton = new ButtonBuilder()

                .setCustomId(`pagina-voltar-${newPage}-${userId}`)
                .setLabel('<')
                .setStyle(ButtonStyle.Success)
                .setDisabled(newPage === 1); 

            const proximoButton = new ButtonBuilder()
                .setCustomId(`pagina-proximo-${newPage}-${userId}`) 
                .setLabel('>')
                .setStyle(ButtonStyle.Success);

            const actionRow = new ActionRowBuilder().addComponents(voltarButton, proximoButton);

            interaction.update({ embeds: [embed], components: [actionRow] });
        });
    }
    if (interaction.customId.startsWith('pegarSistema-')) {

        const modalUserId = interaction.customId.split('-')[1];
        if (modalUserId !== userId) {
            return interaction.reply({
                content: '❌ Você não tem permissão para interagir com este botão.',
                flags: 64,
            });
        }

        const modal = new ModalBuilder()
            .setCustomId(`pegarSistema-${userId}`)
            .setTitle('Pegar Sistema');

        const idInput = new TextInputBuilder()
            .setCustomId('id')
            .setLabel('ID do Sistema')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const idRow = new ActionRowBuilder().addComponents(idInput);
        modal.addComponents(idRow);

        try {
            await interaction.showModal(modal);

        } catch (error) {
            console.error('Erro ao exibir o modal:', error);
            if (!interaction.replied && !interaction.deferred) {
                interaction.reply({
                    content: '❌ Ocorreu um erro ao exibir o modal.',
                    flags: 64,
                });
            }
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.type === InteractionType.ModalSubmit) {

        if (interaction.customId.startsWith('pegarSistema-')) {
            const modalUserId = interaction.customId.split('-')[1];
            if (modalUserId !== interaction.user.id) {
                return interaction.reply({
                    content: '❌ Você não tem permissão para enviar este modal.',
                    flags: 64,
                });
            }

            const id = interaction.fields.getTextInputValue('id');

            if (isNaN(id) || id <= 0) {
                return interaction.reply({
                    content: 'Digite um ID válido maior que 0.',
                    flags: 64,
                });
            }

            On_PegarSistemaID(id, (err, sistema) => {
                if (err) {
                    return interaction.reply({
                        content: '❌ Ocorreu um erro ao buscar o sistema.',
                        flags: 64,
                    });
                }

                if (!sistema) {
                    return interaction.reply({
                        content: '❌ Sistema não encontrado com este ID.',
                        flags: 64,
                    });
                }

                interaction.user
                    .send({
                        content: `Aqui está o sistema:\n\n**ID:** ${sistema.id}\n**Nome:** ${sistema.nome}\n**Descrição:** ${sistema.descricao}\n**Link:** ${sistema.link}`,
                    })
                    .then(() => {
                        interaction.reply({
                            content: '✅ Sistema enviado para o seu privado.',
                            flags: 64,
                        });

                        enviarLog(
                            `Usuário <@${interaction.user.id}> pegou o sistema ID: ${id}, Nome: ${sistema.nome}`
                        );
                    })
                    .catch(() => {
                        interaction.reply({
                            content: '❌ Não foi possível enviar a mensagem no seu DM.',
                            flags: 64,
                        });
                    });
            });
        }
    }
});

client.login(config.token);
