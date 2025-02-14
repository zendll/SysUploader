const { REST, Routes } = require('discord.js');
const config = require('../config.json');

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log('🔄 Limpando comandos de slash...');

        await rest.put(
            Routes.applicationCommands(config.clientId), 
            { body: [] }
        );
        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: [] } 
        );

        console.log('✅ Todos os comandos foram removidos!');
    } catch (error) {
        console.error('❌ Erro ao remover comandos:', error);
    }
})();
