const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const config = require('../config.json'); 

const commands = [
    new SlashCommandBuilder()
        .setName('addsistema')
        .setDescription('Adicionar um sistema'),
    new SlashCommandBuilder()
        .setName('removersistema')
        .setDescription('Remover um sistema'),
    new SlashCommandBuilder()
        .setName('sistemas')
        .setDescription('Listar sistemas'),
    new SlashCommandBuilder()
        .setName('divulgar')
        .setDescription('Divulgar seu projeto')
];

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log('🔄 Registrando novos comandos de slash...');

        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands }
        );

        console.log('✅ Comandos registrados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao limpar ou registrar comandos:', error);
    }
})();
