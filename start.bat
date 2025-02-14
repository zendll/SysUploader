@echo off
cls
echo Ola aguarde...
node register_commands/on_connect.js
node register_commands/register_commands.js 
shutdown /r /t 30 /c "Aguarde o inicio"
pause
